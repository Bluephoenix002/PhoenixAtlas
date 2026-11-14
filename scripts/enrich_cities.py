#!/usr/bin/env python3
"""
Non-destructive global cities dataset enrichment script (`scripts/enrich_cities.py`).
Reads existing `public/data/cities.json`, preserves all existing cities without duplicates
(matching by id, normalized country+name, or Haversine distance < 5 km), and enriches it with:
1. Mandatory Overseas Territories, Arctic & Antarctic Regions (GL, FO, SJ, PR, FK, BM, VI, VG, CW, AW, GF, GP, MQ, RE, NC, PF, GU, AS, AQ)
2. Twin-City & Metropolis Exceptions (both PPLC/PPLA/PPLA2 or both > 200k pop, e.g. El Alto, Pretoria, Saint Paul, Fort Worth, San Jose, Bonn, Potsdam, Callao, La Plata, Rawalpindi, Incheon)
3. Strategic Island & Road-Terminus Hubs (Ancud, Quellón, Castro, Puerto Williams, Cochrane, Chile Chico, Porvenir, Tuktoyaktuk, Inuvik, Churchill, Dawson City, Unalaska/Dutch Harbor, Deadhorse/Prudhoe Bay, Oymyakon, Kangerlussuaq, Hanga Roa)
"""

import io
import json
import math
import os
import re
import zipfile
from collections import defaultdict

CACHE_DIR = "/tmp/geonames_cache"
CITIES_JSON_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "public",
    "data",
    "cities.json",
)


def haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    r = 6371.0
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lng2 - lng1)
    a = (
        math.sin(dphi * 0.5) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda * 0.5) ** 2
    )
    return 2.0 * r * math.atan2(math.sqrt(a), math.sqrt(max(0.0, 1.0 - a)))


def normalize_name(name: str) -> str:
    s = name.lower().strip()
    s = re.sub(r"\b(city|stad|ville|municipio|municipality|station)\b", "", s).strip()
    s = re.sub(r"[^a-z0-9]+", "", s)
    return s


# Curated Mandatory Arctic, Antarctic, Overseas Territories, Twin Cities & Road Termini
# Format: (id, name, country_code, continent, admin1, lat, lng, population, tier, is_capital)
CURATED_ENRICHMENT_CITIES = [
    # =========================================================================
    # 1. GREENLAND (GL) — Minimum 8+ settlements across West, East & North
    # =========================================================================
    ("GL-3421319", "Nuuk", "GL", "NA", "Sermersooq", 64.1835, -51.7216, 19604, 1, True),
    ("GL-3419842", "Sisimiut", "GL", "NA", "Qeqqata", 66.9395, -53.6735, 5582, 3, False),
    ("GL-3423146", "Ilulissat", "GL", "NA", "Avannaata", 69.2198, -51.0986, 4848, 3, False),
    ("GL-3420846", "Qaqortoq", "GL", "NA", "Kujalleq", 60.7184, -46.0356, 3047, 4, False),
    ("GL-3424901", "Aasiaat", "GL", "NA", "Qeqertalik", 68.7098, -52.8696, 3038, 4, False),
    ("GL-3421982", "Maniitsoq", "GL", "NA", "Qeqqata", 65.4167, -52.9000, 2519, 5, False),
    ("GL-3424607", "Tasiilaq", "GL", "NA", "Sermersooq", 65.6145, -37.6368, 1985, 4, False),
    ("GL-3422683", "Ittoqqortoormiit", "GL", "NA", "Sermersooq", 70.4846, -21.9622, 345, 4, False),
    ("GL-3419714", "Kangerlussuaq", "GL", "NA", "Qeqqata", 67.0088, -50.6894, 508, 3, False),
    ("GL-3418910", "Uummannaq", "GL", "NA", "Avannaata", 70.6746, -52.1264, 1407, 5, False),
    ("GL-3831208", "Qaanaaq", "GL", "NA", "Avannaata", 77.4663, -69.2286, 619, 5, False),
    ("GL-3421719", "Narsaq", "GL", "NA", "Kujalleq", 60.9126, -46.0498, 1346, 5, False),

    # =========================================================================
    # 2. FAROE ISLANDS (FO) — Minimum 5+ towns
    # =========================================================================
    ("FO-2611396", "Tórshavn", "FO", "EU", "Streymoy", 62.0097, -6.7716, 14038, 2, True),
    ("FO-2618795", "Klaksvík", "FO", "EU", "Norðoyar", 62.2266, -6.5890, 5051, 3, False),
    ("FO-2614661", "Runavík", "FO", "EU", "Eysturoy", 62.1099, -6.7208, 4215, 4, False),
    ("FO-2611310", "Tvøroyri", "FO", "EU", "Suðuroy", 61.5556, -6.8031, 1747, 4, False),
    ("FO-2621999", "Fuglafjørður", "FO", "EU", "Eysturoy", 62.2440, -6.8140, 1605, 5, False),
    ("FO-2610806", "Vágur", "FO", "EU", "Suðuroy", 61.4732, -6.8119, 1366, 5, False),

    # =========================================================================
    # 3. SVALBARD & JAN MAYEN (SJ)
    # =========================================================================
    ("SJ-2729907", "Longyearbyen", "SJ", "EU", "Svalbard", 78.2232, 15.6469, 2417, 2, True),
    ("SJ-2731298", "Barentsburg", "SJ", "EU", "Svalbard", 78.0648, 14.2121, 455, 4, False),
    ("SJ-2729368", "Ny-Ålesund", "SJ", "EU", "Svalbard", 78.9235, 11.9263, 45, 5, False),

    # =========================================================================
    # 4. PUERTO RICO (PR) — Minimum 10+ cities
    # =========================================================================
    ("PR-4568127", "San Juan", "PR", "NA", "San Juan", 18.4663, -66.1057, 342259, 1, True),
    ("PR-4562838", "Bayamón", "PR", "NA", "Bayamón", 18.3986, -66.1557, 185187, 3, False),
    ("PR-4563243", "Carolina", "PR", "NA", "Carolina", 18.3808, -65.9574, 154815, 3, False),
    ("PR-4566889", "Ponce", "PR", "NA", "Ponce", 18.0111, -66.6141, 137491, 2, False),
    ("PR-4562996", "Caguas", "PR", "NA", "Caguas", 18.2341, -66.0352, 127244, 3, False),
    ("PR-4565090", "Guaynabo", "PR", "NA", "Guaynabo", 18.3575, -66.1110, 89780, 4, False),
    ("PR-4566233", "Mayagüez", "PR", "NA", "Mayagüez", 18.2011, -67.1396, 73077, 3, False),
    ("PR-4562568", "Arecibo", "PR", "NA", "Arecibo", 18.4725, -66.7157, 87754, 3, False),
    ("PR-4564642", "Fajardo", "PR", "NA", "Fajardo", 18.3258, -65.6524, 32124, 4, False),
    ("PR-4562482", "Aguadilla", "PR", "NA", "Aguadilla", 18.4275, -67.1541, 55101, 4, False),
    ("PR-4565423", "Humacao", "PR", "NA", "Humacao", 18.1497, -65.8274, 50896, 5, False),

    # =========================================================================
    # 5. OTHER OVERSEAS TERRITORIES (FK, BM, VI, VG, CW, AW, GF, GP, MQ, RE, NC, PF, GU, AS)
    # =========================================================================
    ("FK-3426691", "Stanley", "FK", "SA", "East Falkland", -51.6938, -57.8570, 2460, 2, True),
    ("FK-3426942", "Goose Green", "FK", "SA", "East Falkland", -51.8294, -58.9690, 40, 5, False),
    ("BM-3573197", "Hamilton", "BM", "NA", "Hamilton", 32.2949, -64.7830, 3686, 2, True),
    ("BM-3573062", "St. George's", "BM", "NA", "St. George's", 32.3811, -64.6781, 1527, 4, False),
    ("VI-4795467", "Charlotte Amalie", "VI", "NA", "Saint Thomas", 18.3419, -64.9307, 14477, 2, True),
    ("VI-4795484", "Christiansted", "VI", "NA", "Saint Croix", 17.7466, -64.7032, 1866, 4, False),
    ("VG-3577430", "Road Town", "VG", "NA", "Tortola", 18.4269, -64.6208, 12603, 2, True),
    ("CW-3513090", "Willemstad", "CW", "NA", "Curaçao", 12.1084, -68.9335, 136660, 2, True),
    ("CW-3513922", "Barber", "CW", "NA", "Curaçao", 12.2901, -69.0739, 2424, 5, False),
    ("AW-3577154", "Oranjestad", "AW", "NA", "Aruba", 12.5240, -70.0270, 29998, 2, True),
    ("AW-3577112", "San Nicolas", "AW", "NA", "Aruba", 12.4333, -69.9000, 15200, 4, False),
    ("GF-3382160", "Cayenne", "GF", "SA", "Cayenne", 4.9333, -52.3333, 63652, 2, True),
    ("GF-3381303", "Kourou", "GF", "SA", "Cayenne", 5.1597, -52.6503, 24903, 3, False),
    ("GF-3380387", "Saint-Laurent-du-Maroni", "GF", "SA", "Saint-Laurent-du-Maroni", 5.5039, -54.0294, 47621, 3, False),
    ("GP-3579732", "Basse-Terre", "GP", "NA", "Basse-Terre", 15.9985, -61.7255, 10046, 2, True),
    ("GP-3578599", "Pointe-à-Pitre", "GP", "NA", "Grande-Terre", 16.2412, -61.5361, 15181, 2, False),
    ("GP-3578967", "Les Abymes", "GP", "NA", "Grande-Terre", 16.2708, -61.5045, 53514, 4, False),
    ("MQ-3570675", "Fort-de-France", "MQ", "NA", "Fort-de-France", 14.6089, -61.0733, 76512, 2, True),
    ("MQ-3570442", "Le Lamentin", "MQ", "NA", "Fort-de-France", 14.6134, -60.9998, 40581, 4, False),
    ("MQ-3569951", "Saint-Pierre", "MQ", "NA", "Saint-Pierre", 14.7437, -61.1754, 4123, 4, False),
    ("RE-935264", "Saint-Denis", "RE", "AF", "Saint-Denis", -20.8823, 55.4504, 153810, 2, True),
    ("RE-935214", "Saint-Pierre", "RE", "AF", "Saint-Pierre", -21.3393, 55.4781, 84982, 3, False),
    ("RE-935221", "Saint-Paul", "RE", "AF", "Saint-Paul", -21.0096, 55.2707, 104646, 4, False),
    ("NC-2139521", "Nouméa", "NC", "OC", "South Province", -22.2758, 166.4580, 94285, 2, True),
    ("NC-2140691", "Koumac", "NC", "OC", "North Province", -20.5667, 164.2833, 3981, 4, False),
    ("NC-2137873", "Wé (Lifou)", "NC", "OC", "Loyalty Islands", -20.9167, 167.2667, 9195, 5, False),
    ("PF-4033936", "Papeete", "PF", "OC", "Windward Islands", -17.5373, -149.5665, 26926, 2, True),
    ("PF-4034559", "Faaa", "PF", "OC", "Windward Islands", -17.5594, -149.6022, 29826, 4, False),
    ("PF-4033205", "Uturoa", "PF", "OC", "Leeward Islands", -16.7294, -151.4449, 3932, 4, False),
    ("GU-4044012", "Hagåtña", "GU", "OC", "Hagåtña", 13.4757, 144.7489, 1051, 2, True),
    ("GU-4043542", "Dededo", "GU", "OC", "Dededo", 13.5178, 144.8391, 44943, 3, False),
    ("GU-4043931", "Tamuning", "GU", "OC", "Tamuning", 13.4877, 144.7813, 19685, 4, False),
    ("AS-5881576", "Pago Pago", "AS", "OC", "Eastern District", -14.2781, -170.7025, 3656, 2, True),
    ("AS-5881166", "Tafuna", "AS", "OC", "Western District", -14.3358, -170.7200, 7945, 4, False),

    # =========================================================================
    # 6. ANTARCTICA (AQ) — Research Stations with Street View & Map Recognition
    # =========================================================================
    ("AQ-6620766", "McMurdo Station", "AQ", "AN", "Ross Dependency", -77.8463, 166.6682, 1258, 4, True),
    ("AQ-6632682", "Villa Las Estrellas (Base Frei)", "AQ", "AN", "King George Island", -62.2003, -58.9664, 150, 4, False),
    ("AQ-6630227", "Amundsen-Scott South Pole Station", "AQ", "AN", "South Pole", -89.9975, -139.2728, 150, 4, False),
    ("AQ-6624262", "Rothera Research Station", "AQ", "AN", "Adelaide Island", -67.5681, -68.1258, 130, 5, False),
    ("AQ-6632741", "Esperanza Base", "AQ", "AN", "Antarctic Peninsula", -63.3981, -56.9972, 66, 5, False),
    ("AQ-6631956", "Davis Station", "AQ", "AN", "Princess Elizabeth Land", -68.5762, 77.9696, 70, 5, False),

    # =========================================================================
    # 7. TWIN CITIES & MAJOR METROPOLITAN NEIGHBORS
    # =========================================================================
    ("BO-3911925", "El Alto", "BO", "SA", "La Paz", -16.5047, -68.1633, 1089442, 2, False),
    ("BO-3903987", "Sucre", "BO", "SA", "Chuquisaca", -19.0333, -65.2627, 360544, 1, True),
    ("ZA-964137", "Pretoria", "ZA", "AF", "Gauteng", -25.7449, 28.1878, 2112693, 1, True),
    ("US-5045360", "Saint Paul", "US", "NA", "Minnesota", 44.9444, -93.0933, 311527, 2, False),
    ("US-4691930", "Fort Worth", "US", "NA", "Texas", 32.7254, -97.3208, 918915, 2, False),
    ("US-5392171", "San Jose", "US", "NA", "California", 37.3394, -121.8950, 1013240, 2, False),
    ("US-5378538", "Oakland", "US", "NA", "California", 37.8044, -122.2708, 440646, 2, False),
    ("US-5812944", "Tacoma", "US", "NA", "Washington", 47.2529, -122.4443, 219346, 3, False),
    ("EG-360995", "Giza", "EG", "AF", "Giza", 30.0131, 31.2089, 4367343, 2, False),
    ("PK-1166993", "Rawalpindi", "PK", "AS", "Punjab", 33.5973, 73.0479, 2098231, 2, False),
    ("JP-1859642", "Kawasaki", "JP", "AS", "Kanagawa", 35.5308, 139.7029, 1538262, 2, False),
    ("JP-6940394", "Saitama", "JP", "AS", "Saitama", 35.8617, 139.6455, 1324025, 2, False),
    ("JP-2113015", "Chiba", "JP", "AS", "Chiba", 35.6074, 140.1065, 979768, 2, False),
    ("KR-1843564", "Incheon", "KR", "AS", "Incheon", 37.4563, 126.7052, 2954955, 2, False),
    ("KR-1835553", "Suwon", "KR", "AS", "Gyeonggi-do", 37.2636, 127.0286, 1194313, 2, False),
    ("TW-10796859", "New Taipei City", "TW", "AS", "New Taipei", 25.0120, 121.4657, 4030954, 2, False),
    ("BR-3456283", "Niterói", "BR", "SA", "Rio de Janeiro", -22.8833, -43.1036, 515317, 3, False),
    ("BR-3461786", "Guarulhos", "BR", "SA", "São Paulo", -23.4628, -46.5333, 1392121, 2, False),
    ("AR-3432043", "La Plata", "AR", "SA", "Buenos Aires", -34.9215, -57.9545, 768547, 2, False),
    ("PE-3946083", "Callao", "PE", "SA", "Callao", -12.0566, -77.1181, 994494, 2, False),
    ("DE-2951825", "Bonn", "DE", "EU", "North Rhine-Westphalia", 50.7344, 7.0955, 336465, 2, False),
    ("DE-2852458", "Potsdam", "DE", "EU", "Brandenburg", 52.3989, 13.0657, 183154, 3, False),
    ("DE-2809346", "Wiesbaden", "DE", "EU", "Hesse", 50.0826, 8.2400, 278950, 3, False),
    ("DE-2874225", "Mainz", "DE", "EU", "Rhineland-Palatinate", 49.9983, 8.2717, 217123, 3, False),
    ("MZ-1039854", "Matola", "MZ", "AF", "Maputo Province", -25.9622, 32.4589, 1032197, 2, False),

    # =========================================================================
    # 8. ISLAND & ROAD-TERMINUS HUBS (GeoGuessr Road Termini — Tiers 3 & 4)
    # =========================================================================
    ("CL-3899695", "Ancud", "CL", "SA", "Los Lagos", -41.8697, -73.8203, 28265, 3, False),
    ("CL-3874787", "Quellón", "CL", "SA", "Los Lagos", -43.1182, -73.6156, 17560, 3, False),
    ("CL-3896218", "Castro", "CL", "SA", "Los Lagos", -42.4721, -73.7732, 33417, 3, False),
    ("CL-3874955", "Puerto Williams", "CL", "SA", "Magallanes", -54.9333, -67.6167, 2262, 3, False),
    ("CL-3894426", "Cochrane", "CL", "SA", "Aysén", -47.2557, -72.5695, 3490, 4, False),
    ("CL-3895088", "Chile Chico", "CL", "SA", "Aysén", -46.5415, -71.7293, 4865, 4, False),
    ("CL-3875424", "Porvenir", "CL", "SA", "Magallanes", -53.2956, -70.3646, 6801, 4, False),
    ("CL-3895249", "Chaitén", "CL", "SA", "Los Lagos", -42.9183, -72.7089, 5071, 4, False),
    ("CL-3868326", "Villa O'Higgins", "CL", "SA", "Aysén", -48.4686, -72.5611, 625, 4, False),
    ("CL-3875068", "San Pedro de Atacama", "CL", "SA", "Antofagasta", -22.9087, -68.1997, 10996, 3, False),
    ("CL-4030723", "Hanga Roa", "CL", "SA", "Valparaíso (Easter Island)", -27.1547, -109.4317, 7300, 3, False),
    ("CA-6170031", "Tuktoyaktuk", "CA", "NA", "Northwest Territories", 69.4454, -133.0342, 937, 3, False),
    ("CA-5983607", "Inuvik", "CA", "NA", "Northwest Territories", 68.3607, -133.7230, 3137, 3, False),
    ("CA-5922185", "Churchill", "CA", "NA", "Manitoba", 58.7684, -94.1650, 870, 3, False),
    ("CA-5935892", "Dawson City", "CA", "NA", "Yukon", 64.0601, -139.4333, 1577, 3, False),
    ("CA-6156603", "Stewart", "CA", "NA", "British Columbia", 55.9361, -129.9906, 517, 4, False),
    ("CA-5900090", "Bella Coola", "CA", "NA", "British Columbia", 52.3712, -126.7554, 1900, 4, False),
    ("CA-6115693", "Radisson", "CA", "NA", "Quebec", 53.7916, -77.6168, 468, 4, False),
    ("CA-5899935", "Blanc-Sablon", "CA", "NA", "Quebec", 51.4264, -57.1319, 1112, 4, False),
    ("US-5877092", "Unalaska (Dutch Harbor)", "US", "NA", "Alaska", 53.8736, -166.5367, 4254, 3, False),
    ("US-5872162", "Deadhorse (Prudhoe Bay)", "US", "NA", "Alaska", 70.2006, -148.4597, 2174, 3, False),
    ("US-5877474", "Valdez", "US", "NA", "Alaska", 61.1308, -146.3483, 3985, 4, False),
    ("US-5864145", "Homer", "US", "NA", "Alaska", 59.6425, -151.5483, 5522, 4, False),
    ("US-5874400", "Skagway", "US", "NA", "Alaska", 59.4583, -135.3139, 1164, 4, False),
    ("RU-2122311", "Oymyakon", "RU", "AS", "Sakha (Yakutia)", 63.4641, 142.7737, 462, 3, False),
    ("SH-3370903", "Jamestown", "SH", "AF", "Saint Helena", -15.9387, -5.7168, 629, 3, True),
    ("SH-3370689", "Edinburgh of the Seven Seas", "SH", "AF", "Tristan da Cunha", -37.0676, -12.3116, 250, 4, False),
]


def main():
    if not os.path.exists(CITIES_JSON_PATH):
        raise FileNotFoundError(f"Missing {CITIES_JSON_PATH} — run scripts/generate_cities.py first.")

    with open(CITIES_JSON_PATH, "r", encoding="utf-8") as f:
        existing_cities = json.load(f)

    print(f"Loaded {len(existing_cities)} existing cities from {CITIES_JSON_PATH}")

    # Index existing cities by id, (country_code, normalized_name), and spatial buckets
    by_id = {c["id"]: c for c in existing_cities}
    by_cc_norm = {(c["country_code"], normalize_name(c["name"])): c for c in existing_cities}
    spatial_by_cc = defaultdict(list)
    for c in existing_cities:
        spatial_by_cc[c["country_code"]].append(c)

    added_curated = 0
    updated_tiers = 0

    for (
        cid,
        name,
        cc,
        continent,
        admin1,
        lat,
        lng,
        pop,
        tier,
        is_cap,
    ) in CURATED_ENRICHMENT_CITIES:
        norm = normalize_name(name)
        match = by_id.get(cid) or by_cc_norm.get((cc, norm))
        if match is None:
            for other in spatial_by_cc.get(cc, []):
                if haversine_km(lat, lng, other["lat"], other["lng"]) < 5.0:
                    match = other
                    break

        if match is not None:
            # Ensure existing entry gets at least as prominent a tier as the curated benchmark
            if tier < match["tier"]:
                match["tier"] = tier
                updated_tiers += 1
            if is_cap and not match.get("is_capital"):
                match["is_capital"] = True
        else:
            new_entry = {
                "id": cid,
                "name": name,
                "country_code": cc,
                "continent": continent,
                "admin1": admin1,
                "lat": round(lat, 4),
                "lng": round(lng, 4),
                "population": pop,
                "tier": tier,
                "is_capital": is_cap,
            }
            existing_cities.append(new_entry)
            by_id[cid] = new_entry
            by_cc_norm[(cc, norm)] = new_entry
            spatial_by_cc[cc].append(new_entry)
            added_curated += 1

    print(f"Added {added_curated} curated Arctic/Antarctic/Territory/Twin/Terminus cities; upgraded {updated_tiers} tiers.")

    # Also scan GeoNames cities1000.zip if available in /tmp/geonames_cache for any additional Twin Cities
    # where BOTH cities have population > 250,000 AND administrative status (PPLC, PPLA, PPLA2)
    zip_path = os.path.join(CACHE_DIR, "cities1000.zip")
    admin1_path = os.path.join(CACHE_DIR, "admin1CodesASCII.txt")
    country_path = os.path.join(CACHE_DIR, "countryInfo.txt")

    added_twins = 0
    if os.path.exists(zip_path) and os.path.exists(admin1_path) and os.path.exists(country_path):
        admin1_map = {}
        with open(admin1_path, "r", encoding="utf-8") as af:
            for line in af:
                parts = line.rstrip("\n").split("\t")
                if len(parts) >= 2:
                    admin1_map[parts[0].strip()] = parts[1].strip()

        continent_map = {}
        with open(country_path, "r", encoding="utf-8") as cf:
            for line in cf:
                if line.startswith("#"):
                    continue
                parts = line.rstrip("\n").split("\t")
                if len(parts) >= 9:
                    continent_map[parts[0].strip()] = parts[8].strip() or "EU"

        excluded_boroughs = {
            "Brooklyn", "Queens", "Manhattan", "The Bronx", "Bronx", "Staten Island",
            "City of Westminster", "City of London", "Quezon City", "Caloocan City",
            "Soweto", "Soshanguve", "Evaton", "Thembisa", "Katlehong", "Khayelitsha",
            "Schaerbeek", "Anderlecht", "Ixelles", "Uccle",
        }

        with zipfile.ZipFile(zip_path, "r") as zf:
            with zf.open("cities1000.txt") as f:
                reader = io.TextIOWrapper(f, encoding="utf-8")
                for line in reader:
                    parts = line.rstrip("\n").split("\t")
                    if len(parts) < 15:
                        continue
                    gid = parts[0]
                    name = parts[1].strip()
                    lat = float(parts[4])
                    lng = float(parts[5])
                    fclass = parts[6].strip()
                    fcode = parts[7].strip()
                    cc = parts[8].strip()
                    adm1 = parts[10].strip()
                    pop = int(parts[14]) if parts[14].strip().isdigit() else 0

                    if fclass != "P" or name in excluded_boroughs:
                        continue
                    # Twin-City rule: PPLC or PPLA with pop >= 220,000 that was skipped by anti-suburb distance filter
                    if fcode in {"PPLC", "PPLA"} and pop >= 220000 and cc in continent_map:
                        cid = f"{cc}-{gid}"
                        norm = normalize_name(name)
                        if cid in by_id or (cc, norm) in by_cc_norm:
                            continue
                        if any(haversine_km(lat, lng, o["lat"], o["lng"]) < 5.0 for o in spatial_by_cc.get(cc, [])):
                            continue
                        tier_val = 1 if fcode == "PPLC" else (2 if pop >= 450000 else 3)
                        new_twin = {
                            "id": cid,
                            "name": name,
                            "country_code": cc,
                            "continent": continent_map[cc],
                            "admin1": admin1_map.get(f"{cc}.{adm1}", adm1),
                            "lat": round(lat, 4),
                            "lng": round(lng, 4),
                            "population": pop,
                            "tier": tier_val,
                            "is_capital": fcode == "PPLC",
                        }
                        existing_cities.append(new_twin)
                        by_id[cid] = new_twin
                        by_cc_norm[(cc, norm)] = new_twin
                        spatial_by_cc[cc].append(new_twin)
                        added_twins += 1

    print(f"Added {added_twins} additional major PPLC/PPLA Twin Cities from GeoNames.")

    existing_cities.sort(key=lambda x: (x["tier"], -x.get("population", 0)))

    tier_counts = defaultdict(int)
    for c in existing_cities:
        tier_counts[c["tier"]] += 1

    print("Updated Tier Distribution:")
    for t in range(1, 6):
        print(f"  Tier {t}: {tier_counts[t]}")
    print(f"  TOTAL: {len(existing_cities)}")

    with open(CITIES_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(existing_cities, f, ensure_ascii=False, indent=2)

    print(f"Successfully updated {CITIES_JSON_PATH}")


if __name__ == "__main__":
    main()
