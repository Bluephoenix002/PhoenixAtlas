#!/usr/bin/env python3
"""
Standalone global cities dataset generator for Map Quiz (MapTap.gg style).
Downloads official GeoNames `cities1000.zip`, `admin1CodesASCII.txt`, and `countryInfo.txt`,
computes Global Recognition Score (GRS) + Isolation Bonus, applies Country Quota Caps,
Anti-Suburb Spatial Clustering Filters, and Spatial 2x2-deg Gap-Filling, and exports ~5,650 cities
across 5 balanced tiers to `public/data/cities.json`.
"""

import io
import json
import math
import os
import re
import urllib.request
import zipfile
from collections import defaultdict

GEONAMES_CITIES_URL = "https://download.geonames.org/export/dump/cities1000.zip"
GEONAMES_ADMIN1_URL = "https://download.geonames.org/export/dump/admin1CodesASCII.txt"
GEONAMES_COUNTRY_URL = "https://download.geonames.org/export/dump/countryInfo.txt"

CACHE_DIR = "/tmp/geonames_cache"
OUTPUT_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "public",
    "data",
    "cities.json",
)

VALID_FEATURE_CODES = {
    "PPLC",
    "PPLG",
    "PPLA",
    "PPLA2",
    "PPLA3",
    "PPLA4",
    "PPL",
    "PPLS",
    "PPLF",
    "PPLL",
    "PPLR",
}

# Explicit exclusions of sub-municipalities / boroughs / wards / townships that GeoNames lists separately
EXCLUDED_BOROUGH_NAMES = {
    ("US", "Brooklyn"),
    ("US", "Queens"),
    ("US", "Manhattan"),
    ("US", "The Bronx"),
    ("US", "Bronx"),
    ("US", "Staten Island"),
    ("GB", "City of Westminster"),
    ("GB", "City of London"),
    ("GB", "Islington"),
    ("GB", "Camden Town"),
    ("GB", "Brixton"),
    ("GB", "Canary Wharf"),
    ("DE", "Mitte"),
    ("DE", "Charlottenburg"),
    ("DE", "Kreuzberg"),
    ("DE", "Neukölln"),
    ("DE", "Pankow"),
    ("DE", "Spandau"),
    ("DE", "Steglitz"),
    ("DE", "Tempelhof"),
    ("DE", "Marzahn"),
    ("AT", "Favoriten"),
    ("AT", "Donaustadt"),
    ("AT", "Floridsdorf"),
    ("AT", "Ottakring"),
    ("ES", "Puente de Vallecas"),
    ("ES", "Carabanchel"),
    ("ES", "Fuencarral-El Pardo"),
    ("ES", "Latina"),
    ("ES", "Eixample"),
    ("ES", "Sants-Montjuïc"),
    ("FR", "Paris 15e Arrondissement"),
    ("BE", "Schaerbeek"),
    ("BE", "Anderlecht"),
    ("BE", "Molenbeek-Saint-Jean"),
    ("BE", "Ixelles"),
    ("BE", "Uccle"),
    ("BE", "Forest"),
    ("BE", "Woluwe-Saint-Lambert"),
    ("BE", "Saint-Gilles"),
    ("BE", "Etterbeek"),
    ("BE", "Evere"),
    ("BE", "Jette"),
    ("PH", "Quezon City"),
    ("PH", "Caloocan City"),
    ("PH", "Budta"),
    ("PH", "Malingao"),
    ("ZA", "Soweto"),
    ("ZA", "Soshanguve"),
    ("ZA", "Evaton"),
    ("ZA", "Thembisa"),
    ("ZA", "Katlehong"),
    ("ZA", "Khayelitsha"),
    ("ZA", "Mitchells Plain"),
    ("ZA", "Botshabelo"),
    ("ZA", "Mdantsane"),
    ("ZA", "Umlazi"),
    ("ZA", "Ibhayi"),
}

# Iconic isolated / remote settlements that receive an extra remote-anchor boost
ICONIC_ISOLATED_CITIES = {
    ("AR", "Ushuaia"),
    ("CL", "Punta Arenas"),
    ("CL", "Puerto Williams"),
    ("CL", "Coyhaique"),
    ("CL", "Arica"),
    ("CL", "Iquique"),
    ("CL", "Calama"),
    ("AU", "Alice Springs"),
    ("AU", "Broome"),
    ("AU", "Darwin"),
    ("AU", "Cairns"),
    ("AU", "Mount Isa"),
    ("AU", "Kalgoorlie"),
    ("AU", "Port Hedland"),
    ("AU", "Karratha"),
    ("AU", "Esperance"),
    ("AU", "Coober Pedy"),
    ("AU", "Katherine"),
    ("AU", "Carnarvon"),
    ("AU", "Exmouth"),
    ("AU", "Ceduna"),
    ("AU", "Broken Hill"),
    ("AU", "Bourke"),
    ("AU", "Longreach"),
    ("AU", "Charleville"),
    ("AU", "Tennant Creek"),
    ("US", "Nome"),
    ("US", "Fairbanks"),
    ("US", "Anchorage"),
    ("US", "Juneau"),
    ("US", "Ketchikan"),
    ("US", "Kodiak"),
    ("US", "Utqiaġvik"),
    ("US", "Barrow"),
    ("US", "Bethel"),
    ("US", "Key West"),
    ("US", "Moab"),
    ("CA", "Yellowknife"),
    ("CA", "Iqaluit"),
    ("CA", "Whitehorse"),
    ("CA", "Churchill"),
    ("CA", "Inuvik"),
    ("CA", "Goose Bay"),
    ("CA", "Happy Valley-Goose Bay"),
    ("CA", "Prince George"),
    ("CA", "Prince Rupert"),
    ("CA", "Thunder Bay"),
    ("CA", "Timmins"),
    ("CA", "Chibougamau"),
    ("CA", "Thompson"),
    ("CA", "Dawson City"),
    ("SJ", "Longyearbyen"),
    ("NO", "Longyearbyen"),
    ("NO", "Tromsø"),
    ("NO", "Bodø"),
    ("NO", "Narvik"),
    ("NO", "Hammerfest"),
    ("NO", "Kirkenes"),
    ("NO", "Alta"),
    ("SE", "Kiruna"),
    ("SE", "Luleå"),
    ("SE", "Östersund"),
    ("FI", "Rovaniemi"),
    ("FI", "Inari"),
    ("GL", "Nuuk"),
    ("GL", "Ilulissat"),
    ("FO", "Tórshavn"),
    ("IS", "Akureyri"),
    ("IS", "Ísafjörður"),
    ("IS", "Egilsstaðir"),
    ("IS", "Höfn"),
    ("RU", "Yakutsk"),
    ("RU", "Norilsk"),
    ("RU", "Magadan"),
    ("RU", "Petropavlovsk-Kamchatsky"),
    ("RU", "Murmansk"),
    ("RU", "Vorkuta"),
    ("RU", "Anadyr"),
    ("RU", "Salekhard"),
    ("RU", "Naryan-Mar"),
    ("RU", "Khatanga"),
    ("RU", "Tiksi"),
    ("RU", "Pevek"),
    ("RU", "Mirny"),
    ("RU", "Bratsk"),
    ("RU", "Chita"),
    ("RU", "Ulan-Ude"),
    ("RU", "Khabarovsk"),
    ("RU", "Vladivostok"),
    ("RU", "Yuzhno-Sakhalinsk"),
    ("PE", "Iquitos"),
    ("PE", "Puerto Maldonado"),
    ("CO", "Leticia"),
    ("BR", "Manaus"),
    ("BR", "Boa Vista"),
    ("BR", "Rio Branco"),
    ("BR", "Porto Velho"),
    ("BR", "Macapá"),
    ("BR", "Santarém"),
    ("ZA", "Upington"),
    ("ZA", "Springbok"),
    ("ZA", "Beaufort West"),
    ("NA", "Walvis Bay"),
    ("NA", "Swakopmund"),
    ("NA", "Lüderitz"),
    ("NA", "Keetmanshoop"),
    ("NA", "Katima Mulilo"),
    ("BW", "Maun"),
    ("BW", "Francistown"),
    ("BW", "Ghanzi"),
    ("BW", "Kasane"),
    ("DZ", "Tamanrasset"),
    ("DZ", "Adrar"),
    ("DZ", "Tindouf"),
    ("DZ", "Ghardaïa"),
    ("NE", "Agadez"),
    ("ML", "Timbuktu"),
    ("NZ", "Invercargill"),
    ("NZ", "Queenstown"),
    ("NZ", "Gisborne"),
    ("JP", "Wakkanai"),
    ("JP", "Kushiro"),
    ("JP", "Abashiri"),
    ("JP", "Naha"),
    ("CN", "Lhasa"),
    ("CN", "Kashi"),
    ("CN", "Kashgar"),
    ("CN", "Hotan"),
    ("CN", "Hami"),
    ("CN", "Golmud"),
    ("CN", "Hailar"),
}

# Curated Tier 1 non-capital world alpha metropolises (~85 globally -> ~280 total Tier 1 with capitals)
WORLD_TIER_1_NON_CAPITALS = {
    ("US", "New York City"),
    ("US", "New York"),
    ("US", "Los Angeles"),
    ("US", "Chicago"),
    ("US", "Houston"),
    ("US", "San Francisco"),
    ("US", "Miami"),
    ("US", "Seattle"),
    ("US", "Boston"),
    ("US", "Dallas"),
    ("US", "Atlanta"),
    ("CA", "Toronto"),
    ("CA", "Montreal"),
    ("CA", "Vancouver"),
    ("MX", "Guadalajara"),
    ("MX", "Monterrey"),
    ("BR", "São Paulo"),
    ("BR", "Rio de Janeiro"),
    ("BR", "Belo Horizonte"),
    ("BR", "Salvador"),
    ("AR", "Córdoba"),
    ("AR", "Rosario"),
    ("CO", "Medellín"),
    ("CO", "Cali"),
    ("EC", "Guayaquil"),
    ("BO", "Santa Cruz de la Sierra"),
    ("ES", "Barcelona"),
    ("ES", "Valencia"),
    ("ES", "Seville"),
    ("IT", "Milan"),
    ("IT", "Naples"),
    ("IT", "Venice"),
    ("DE", "Munich"),
    ("DE", "Hamburg"),
    ("DE", "Frankfurt"),
    ("DE", "Cologne"),
    ("FR", "Lyon"),
    ("GB", "Manchester"),
    ("GB", "Birmingham"),
    ("GB", "Edinburgh"),
    ("NL", "Rotterdam"),
    ("NL", "The Hague"),
    ("CH", "Zurich"),
    ("CH", "Geneva"),
    ("PL", "Kraków"),
    ("PT", "Porto"),
    ("GR", "Thessaloniki"),
    ("TR", "Istanbul"),
    ("TR", "İzmir"),
    ("UA", "Kharkiv"),
    ("UA", "Odesa"),
    ("RU", "Saint Petersburg"),
    ("RU", "Novosibirsk"),
    ("RU", "Yekaterinburg"),
    ("KZ", "Almaty"),
    ("AE", "Dubai"),
    ("SA", "Jeddah"),
    ("SA", "Mecca"),
    ("IL", "Tel Aviv"),
    ("IN", "Mumbai"),
    ("IN", "Bengaluru"),
    ("IN", "Hyderabad"),
    ("IN", "Chennai"),
    ("IN", "Kolkata"),
    ("PK", "Karachi"),
    ("PK", "Lahore"),
    ("CN", "Shanghai"),
    ("CN", "Guangzhou"),
    ("CN", "Shenzhen"),
    ("CN", "Chengdu"),
    ("CN", "Chongqing"),
    ("CN", "Wuhan"),
    ("CN", "Xi'an"),
    ("CN", "Hong Kong"),
    ("TW", "Kaohsiung"),
    ("JP", "Yokohama"),
    ("JP", "Nagoya"),
    ("KR", "Busan"),
    ("VN", "Ho Chi Minh City"),
    ("ID", "Surabaya"),
    ("ID", "Medan"),
    ("PH", "Cebu City"),
    ("PH", "Davao"),
    ("AU", "Sydney"),
    ("AU", "Melbourne"),
    ("AU", "Brisbane"),
    ("AU", "Perth"),
    ("NZ", "Auckland"),
    ("MA", "Casablanca"),
    ("EG", "Alexandria"),
    ("NG", "Lagos"),
    ("TZ", "Dar es Salaam"),
    ("ZA", "Johannesburg"),
    ("ZA", "Cape Town"),
    ("ZA", "Durban"),
}

# Explicit canonical tier overrides for benchmark cities mentioned in the specification
BENCHMARK_TIER_OVERRIDES = {
    # Tier 2 benchmark anchors
    ("BE", "Antwerp"): 2,
    ("BE", "Ghent"): 2,
    ("BE", "Liège"): 2,
    ("BE", "Charleroi"): 2,
    ("NL", "Utrecht"): 2,
    ("NL", "Eindhoven"): 2,
    ("FR", "Marseille"): 2,
    ("FR", "Bordeaux"): 2,
    ("FR", "Lille"): 2,
    ("FR", "Nice"): 2,
    ("FR", "Toulouse"): 2,
    ("JP", "Osaka"): 2,
    ("JP", "Sapporo"): 2,
    ("JP", "Fukuoka"): 2,
    ("JP", "Kyoto"): 2,
    ("AU", "Alice Springs"): 2,
    ("AU", "Broome"): 2,
    ("AU", "Darwin"): 2,
    ("AU", "Cairns"): 2,
    ("AU", "Adelaide"): 2,
    ("AU", "Hobart"): 2,
    ("AR", "Ushuaia"): 2,
    ("CL", "Punta Arenas"): 2,
    ("US", "Nome"): 2,
    ("US", "Anchorage"): 2,
    ("CA", "Yellowknife"): 2,
    ("CA", "Iqaluit"): 2,
    ("CA", "Whitehorse"): 2,
    ("SJ", "Longyearbyen"): 2,
    ("NO", "Longyearbyen"): 2,
    ("ZA", "Port Elizabeth (Gqeberha)"): 2,
    ("ZA", "Bloemfontein"): 2,
    ("ZA", "East London"): 2,
    ("ZA", "Pietermaritzburg"): 2,
    ("PH", "Zamboanga"): 2,
    ("PH", "Cagayan de Oro"): 2,
    ("PH", "General Santos"): 2,
    ("PH", "Iloilo"): 2,
    ("PH", "Bacolod City"): 2,
    ("PH", "Baguio"): 2,
    ("PH", "Puerto Princesa"): 2,
    # Tier 3 benchmark provincial capitals & regional hubs
    ("BE", "Bruges"): 3,
    ("BE", "Hasselt"): 3,
    ("BE", "Mons"): 3,
    ("BE", "Namur"): 3,
    ("BE", "Leuven"): 3,
    ("BE", "Ostend"): 3,
    ("NL", "Groningen"): 3,
    ("NL", "Breda"): 3,
    ("NL", "Nijmegen"): 3,
    ("NL", "Arnhem"): 3,
    ("NL", "Maastricht"): 3,
    ("NL", "Enschede"): 3,
    ("NL", "Zwolle"): 3,
    ("NL", "Leeuwarden"): 3,
    ("NL", "'s-Hertogenbosch"): 3,
    # Tier 4 benchmark secondary regional cities
    ("BE", "Kortrijk"): 4,
    ("BE", "Mechelen"): 4,
    ("BE", "Aalst"): 4,
    ("BE", "Sint-Niklaas"): 4,
    ("BE", "Tournai"): 4,
    ("BE", "Genk"): 4,
    ("BE", "Roeselare"): 4,
    ("BE", "Turnhout"): 4,
    ("BE", "Verviers"): 4,
    ("BE", "Arlon"): 4,
    ("NL", "Tilburg"): 4,
    ("NL", "Haarlem"): 4,
    ("NL", "Amersfoort"): 4,
    ("NL", "Apeldoorn"): 4,
    ("NL", "Leiden"): 4,
    ("NL", "Dordrecht"): 4,
    ("NL", "Alkmaar"): 4,
    ("NL", "Venlo"): 4,
    ("NL", "Deventer"): 4,
    ("NL", "Lelystad"): 4,
    ("NL", "Assen"): 4,
    ("NL", "Middelburg"): 4,
    ("BW", "Francistown"): 4,
    ("LU", "Esch-sur-Alzette"): 4,
    # Tier 5 benchmark obscure / remote towns
    ("BE", "Bastogne"): 5,
    ("BE", "Dinant"): 5,
    ("BE", "Ieper"): 5,
    ("BE", "Ypres"): 5,
    ("BE", "Knokke-Heist"): 5,
    ("AU", "Coober Pedy"): 5,
    ("BW", "Maun"): 5,
    ("LU", "Diekirch"): 5,
}

STREET_VIEW_SMALL_COUNTRIES = {
    "IS", "BW", "SZ", "LS", "EE", "LV", "LT", "SI", "HR", "ME", "MK", "AL",
    "RS", "BA", "SK", "BG", "RO", "GR", "PT", "IE", "DK", "NO", "SE", "FI",
    "CH", "AT", "BE", "NL", "CZ", "HU", "IL", "JO", "AE", "QA", "OM", "KG",
    "MN", "LK", "KH", "LA", "BT", "NP", "KR", "TW", "SG", "MY", "TH", "PH",
    "ID", "VN", "NZ", "UY", "PY", "EC", "BO", "CR", "PA", "GT", "DO", "PR",
    "SN", "GH", "KE", "UG", "RW", "NG", "TN", "NA", "ZA",
}


def download_file(url: str, local_path: str) -> str:
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    if not os.path.exists(local_path):
        print(f"Downloading {url} -> {local_path} ...")
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=60) as resp, open(local_path, "wb") as out:
            out.write(resp.read())
    return local_path


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
    s = re.sub(r"\b(city|stad|ville|municipio|municipality)\b", "", s).strip()
    s = re.sub(r"[^a-z0-9]+", "", s)
    return s


def load_country_info(path: str):
    countries = {}
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            if not line or line.startswith("#"):
                continue
            parts = line.rstrip("\n").split("\t")
            if len(parts) < 9:
                continue
            iso2 = parts[0].strip()
            name = parts[4].strip()
            capital = parts[5].strip()
            area = float(parts[6]) if parts[6].strip() else 1000.0
            pop = int(parts[7]) if parts[7].strip() else 50000
            continent = parts[8].strip() or "EU"
            countries[iso2] = {
                "iso2": iso2,
                "name": name,
                "capital": capital,
                "area": max(1.0, area),
                "population": max(1, pop),
                "continent": continent,
            }
    return countries


def load_admin1_names(path: str):
    admin1_map = {}
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            parts = line.rstrip("\n").split("\t")
            if len(parts) >= 2:
                code = parts[0].strip()
                name = parts[1].strip()
                admin1_map[code] = name
    return admin1_map


def compute_country_quota(iso2: str, area: float, pop: int) -> int:
    if iso2 in {"VA", "MC", "NR", "TV", "TK", "NU", "PN", "BL", "MF", "SX", "GI"}:
        return 1
    if iso2 in {"SM", "LI", "AD", "BM", "KY", "VG", "VI", "AI", "MS", "TC", "SH", "PM", "WF", "CK", "AS", "GU", "MP"}:
        return 2
    if iso2 in {"LU", "MT", "SG", "HK", "MO", "BH", "MV", "BB", "LC", "VC", "GD", "AG", "KN", "DM", "SC", "ST", "KM", "CV", "DJ", "BN", "SZ", "LS", "GM", "GW", "TL", "QA", "KW", "CY"}:
        if iso2 in {"LU", "CY", "SZ", "LS", "QA"}:
            return 7
        return 4

    # Calibrated quotas so global total (including 2x2-deg spatial gap-filler) lands at ~5,650 cities
    explicit_caps = {
        "US": 195,
        "CN": 180,
        "RU": 170,
        "BR": 160,
        "IN": 160,
        "AU": 135,
        "CA": 135,
        "MX": 92,
        "ID": 90,
        "AR": 78,
        "FR": 78,
        "DE": 78,
        "ES": 72,
        "IT": 72,
        "GB": 72,
        "JP": 75,
        "TR": 70,
        "ZA": 72,
        "PH": 68,
        "PL": 54,
        "UA": 54,
        "CO": 52,
        "PE": 50,
        "CL": 50,
        "NG": 52,
        "PK": 52,
        "IR": 52,
        "KZ": 50,
        "TH": 50,
        "VN": 50,
        "MY": 42,
        "EG": 42,
        "MA": 42,
        "DZ": 45,
        "KE": 38,
        "TZ": 38,
        "ET": 38,
        "CD": 42,
        "SE": 40,
        "NO": 40,
        "FI": 36,
        "RO": 40,
        "GR": 36,
        "PT": 32,
        "NL": 38,
        "BE": 36,
        "CH": 28,
        "AT": 28,
        "CZ": 28,
        "HU": 26,
        "DK": 24,
        "IE": 24,
        "NZ": 34,
        "KR": 36,
        "TW": 24,
        "IS": 10,
        "BW": 15,
        "NA": 18,
        "MN": 22,
        "UY": 16,
        "PY": 16,
        "BO": 26,
        "EC": 26,
        "VE": 34,
    }
    if iso2 in explicit_caps:
        return explicit_caps[iso2]

    score = 0.032 * math.sqrt(area) + 0.0032 * math.sqrt(pop)
    cap = int(round(score))
    min_cap = 7 if iso2 in STREET_VIEW_SMALL_COUNTRIES else 5
    return max(min_cap, min(95, cap))


def main():
    os.makedirs(CACHE_DIR, exist_ok=True)
    zip_path = download_file(GEONAMES_CITIES_URL, os.path.join(CACHE_DIR, "cities1000.zip"))
    admin1_path = download_file(GEONAMES_ADMIN1_URL, os.path.join(CACHE_DIR, "admin1CodesASCII.txt"))
    country_path = download_file(GEONAMES_COUNTRY_URL, os.path.join(CACHE_DIR, "countryInfo.txt"))

    countries_info = load_country_info(country_path)
    admin1_map = load_admin1_names(admin1_path)

    print("Reading cities1000.zip ...")
    raw_cities = []
    with zipfile.ZipFile(zip_path, "r") as zf:
        with zf.open("cities1000.txt") as f:
            reader = io.TextIOWrapper(f, encoding="utf-8")
            for line in reader:
                parts = line.rstrip("\n").split("\t")
                if len(parts) < 15:
                    continue
                geonameid = parts[0]
                name = parts[1].strip()
                asciiname = parts[2].strip() or name
                lat = float(parts[4])
                lng = float(parts[5])
                fclass = parts[6].strip()
                fcode = parts[7].strip()
                cc = parts[8].strip()
                admin1_code = parts[10].strip()
                pop = int(parts[14]) if parts[14].strip().isdigit() else 0

                if fclass != "P" or fcode not in VALID_FEATURE_CODES:
                    continue
                if not cc or cc not in countries_info:
                    continue
                if (cc, name) in EXCLUDED_BOROUGH_NAMES or (cc, asciiname) in EXCLUDED_BOROUGH_NAMES:
                    continue
                if cc == "JP" and admin1_code == "40" and name != "Tokyo" and haversine_km(lat, lng, 35.6895, 139.6917) < 18.0:
                    continue

                display_name = name
                if cc == "BE":
                    be_names = {
                        "Antwerpen": "Antwerp",
                        "Gent": "Ghent",
                        "Brugge": "Bruges",
                        "Brussel": "Brussels",
                        "Bruxelles": "Brussels",
                        "Oostende": "Ostend",
                        "Ieper": "Ypres",
                        "Bergen": "Mons",
                        "Namen": "Namur",
                        "Luik": "Liège",
                        "Doornik": "Tournai",
                        "Aarlen": "Arlon",
                        "Bastenaken": "Bastogne",
                    }
                    display_name = be_names.get(name, display_name)
                elif cc == "NL" and name in {"'s-Gravenhage", "Den Haag"}:
                    display_name = "The Hague"
                elif cc == "NL" and name == "Almere Stad":
                    display_name = "Almere"
                elif cc == "IT":
                    it_names = {
                        "Roma": "Rome",
                        "Milano": "Milan",
                        "Napoli": "Naples",
                        "Torino": "Turin",
                        "Firenze": "Florence",
                        "Venezia": "Venice",
                        "Genova": "Genoa",
                        "Siracusa": "Syracuse",
                    }
                    display_name = it_names.get(name, display_name)
                elif cc == "DE":
                    de_names = {
                        "München": "Munich",
                        "Köln": "Cologne",
                        "Nürnberg": "Nuremberg",
                        "Frankfurt am Main": "Frankfurt",
                    }
                    display_name = de_names.get(name, display_name)
                elif cc == "AT" and name == "Wien":
                    display_name = "Vienna"
                elif cc == "CH":
                    ch_names = {"Zürich": "Zurich", "Genève": "Geneva", "Luzern": "Lucerne"}
                    display_name = ch_names.get(name, display_name)
                elif cc == "PL" and name == "Warszawa":
                    display_name = "Warsaw"
                elif cc == "CZ" and name == "Praha":
                    display_name = "Prague"
                elif cc == "DK" and name == "København":
                    display_name = "Copenhagen"
                elif cc == "GR" and name in {"Athína", "Athens"}:
                    display_name = "Athens"
                elif cc == "RU" and name in {"Moskva", "Moscow"}:
                    display_name = "Moscow"
                elif cc == "UA" and name in {"Kiev", "Kyiv"}:
                    display_name = "Kyiv"
                elif cc == "EG" and name in {"Al Qāhirah", "Cairo"}:
                    display_name = "Cairo"
                elif cc == "ZA" and name in {"Gqeberha", "Port Elizabeth"}:
                    display_name = "Port Elizabeth (Gqeberha)"

                is_cap = (
                    fcode == "PPLC"
                    or display_name.lower() == countries_info[cc]["capital"].lower()
                    or name.lower() == countries_info[cc]["capital"].lower()
                )

                is_iconic = (
                    (cc, display_name) in ICONIC_ISOLATED_CITIES
                    or (cc, name) in ICONIC_ISOLATED_CITIES
                    or (cc, display_name) in BENCHMARK_TIER_OVERRIDES
                )
                if (
                    pop < 12000
                    and fcode not in {"PPLC", "PPLG", "PPLA", "PPLA2"}
                    and not is_cap
                    and not is_iconic
                    and countries_info[cc]["population"] > 3000000
                    and abs(lat) < 55.0
                ):
                    continue

                admin1_full = admin1_map.get(f"{cc}.{admin1_code}", admin1_code)
                if cc == "BE":
                    if admin1_code == "VLG":
                        admin1_full = "Flanders"
                    elif admin1_code == "WAL":
                        admin1_full = "Wallonia"
                    elif admin1_code == "BRU":
                        admin1_full = "Brussels"

                raw_cities.append(
                    {
                        "id": f"{cc}-{geonameid}",
                        "geonameid": geonameid,
                        "name": display_name,
                        "raw_name": name,
                        "country_code": cc,
                        "continent": countries_info[cc]["continent"],
                        "admin1": admin1_full,
                        "lat": round(lat, 4),
                        "lng": round(lng, 4),
                        "population": pop,
                        "fcode": fcode,
                        "is_capital": bool(is_cap),
                        "is_iconic": is_iconic,
                    }
                )

    # Inject iconic towns < 12k pop if filtered out (Coober Pedy, Bastogne, Dinant, Durbuy)
    extra_iconic_towns = [
        ("AU", "2073968", "Coober Pedy", "OC", "South Australia", -29.0135, 134.7544, 1762),
        ("BE", "2802529", "Bastogne", "EU", "Wallonia", 50.0035, 5.7184, 15894),
        ("BE", "2799349", "Dinant", "EU", "Wallonia", 50.2611, 4.9122, 13544),
        ("BE", "2799015", "Durbuy", "EU", "Wallonia", 50.3529, 5.4563, 11374),
    ]
    for cc_ex, gid_ex, name_ex, cont_ex, adm_ex, lat_ex, lng_ex, pop_ex in extra_iconic_towns:
        if not any(c["country_code"] == cc_ex and c["name"] == name_ex for c in raw_cities):
            raw_cities.append(
                {
                    "id": f"{cc_ex}-{gid_ex}",
                    "geonameid": gid_ex,
                    "name": name_ex,
                    "raw_name": name_ex,
                    "country_code": cc_ex,
                    "continent": cont_ex,
                    "admin1": adm_ex,
                    "lat": lat_ex,
                    "lng": lng_ex,
                    "population": pop_ex,
                    "fcode": "PPL",
                    "is_capital": False,
                    "is_iconic": True,
                }
            )

    print(f"Filtered candidate cities: {len(raw_cities)}")

    # Deduplicate exact normalized name within the same country
    dedup_by_country_name = {}
    for c in raw_cities:
        norm = normalize_name(c["name"])
        key = (c["country_code"], norm)
        prev = dedup_by_country_name.get(key)
        if prev is None:
            dedup_by_country_name[key] = c
        else:
            prev_rank = (prev["is_capital"], prev["fcode"] == "PPLC", prev["fcode"] == "PPLA", prev["population"])
            curr_rank = (c["is_capital"], c["fcode"] == "PPLC", c["fcode"] == "PPLA", c["population"])
            if curr_rank > prev_rank:
                dedup_by_country_name[key] = c

    candidates = list(dedup_by_country_name.values())
    print(f"After same-name deduplication: {len(candidates)}")

    # Spatial index of all cities with population >= 50,000 for fast Isolation Bonus computation
    big_cities = [c for c in candidates if c["population"] >= 50000]
    big_cities.sort(key=lambda x: x["population"], reverse=True)
    big_grid = defaultdict(list)
    for bc in big_cities:
        gx = int(math.floor(bc["lat"] / 5.0))
        gy = int(math.floor(bc["lng"] / 5.0))
        big_grid[(gx, gy)].append(bc)

    top_megacities = [c for c in big_cities if c["population"] >= 1500000]

    print("Computing Global Recognition Score (GRS) + Isolation Bonus ...")
    for c in candidates:
        pop = max(500, c["population"])
        thresh_pop = max(50000, pop * 2)
        lat = c["lat"]
        lng = c["lng"]
        gx = int(math.floor(lat / 5.0))
        gy = int(math.floor(lng / 5.0))

        min_d = 3500.0
        found_local = False
        for r in range(0, 4):
            for dx in range(-r, r + 1):
                for dy in range(-r, r + 1):
                    if abs(dx) != r and abs(dy) != r:
                        continue
                    cell = big_grid.get((gx + dx, gy + dy))
                    if not cell:
                        continue
                    for other in cell:
                        if other["population"] < thresh_pop:
                            break
                        if other["id"] == c["id"]:
                            continue
                        d = haversine_km(lat, lng, other["lat"], other["lng"])
                        if d < min_d:
                            min_d = d
                            found_local = True
            if found_local and min_d < (r * 350.0):
                break

        if not found_local:
            for other in top_megacities:
                if other["id"] == c["id"]:
                    continue
                if other["population"] >= thresh_pop or c["population"] >= 1500000:
                    d = haversine_km(lat, lng, other["lat"], other["lng"])
                    if d < min_d:
                        min_d = d

        c["d_nearest"] = round(min_d, 1)

        log_pop = math.log10(pop)
        fcode = c["fcode"]
        if c["is_capital"] or fcode == "PPLC":
            admin_bonus = 2.8
        elif fcode == "PPLG":
            admin_bonus = 1.65
        elif fcode == "PPLA":
            admin_bonus = 0.92
        elif fcode == "PPLA2":
            admin_bonus = 0.35
        else:
            admin_bonus = 0.0

        iso_weight = 0.72
        iso_bonus = iso_weight * math.log10(max(1.0, min_d))
        if min_d >= 260.0 and (fcode in {"PPLA", "PPLA2"} or pop >= 8000 or c["is_iconic"]):
            iso_bonus += 0.65
        if c["is_iconic"]:
            iso_bonus += 1.35

        c["grs"] = round(log_pop + admin_bonus + iso_bonus, 4)

    # Group candidates by country and apply Country Quotas + Anti-Suburb Spatial Clustering Filter
    by_country = defaultdict(list)
    for c in candidates:
        by_country[c["country_code"]].append(c)

    selected_cities = []
    selected_ids = set()
    occupied_3x3_cells = defaultdict(int)

    for cc, c_list in by_country.items():
        c_info = countries_info[cc]
        quota = compute_country_quota(cc, c_info["area"], c_info["population"])
        c_list.sort(
            key=lambda x: (
                x["is_capital"],
                (cc, x["name"]) in BENCHMARK_TIER_OVERRIDES,
                x["is_iconic"],
                x["grs"],
            ),
            reverse=True,
        )

        area = c_info["area"]
        if area > 1500000:
            base_min_dist = 26.0
        elif area > 250000:
            base_min_dist = 18.0
        elif area > 30000:
            base_min_dist = 12.5
        else:
            base_min_dist = 8.0

        country_picked = []
        for cand in c_list:
            if len(country_picked) >= quota:
                break
            is_bench = (cc, cand["name"]) in BENCHMARK_TIER_OVERRIDES
            if cand["is_capital"] or cand["is_iconic"] or is_bench:
                min_req = 5.5
            elif len(country_picked) < max(3, quota // 5):
                min_req = base_min_dist * 1.45
            else:
                min_req = base_min_dist

            too_close = False
            for existing in country_picked:
                d = haversine_km(cand["lat"], cand["lng"], existing["lat"], existing["lng"])
                # Extra suburb shield around megacities (pop >= 1.5M) so metro suburbs don't crowd out real cities
                eff_req = min_req
                if not is_bench and not cand["is_iconic"] and cand["fcode"] not in {"PPLC", "PPLA"}:
                    if existing["population"] >= 1500000:
                        eff_req = max(eff_req, 38.0)
                    elif existing["population"] >= 600000:
                        eff_req = max(eff_req, 24.0)
                if d < eff_req:
                    too_close = True
                    break
            if not too_close:
                country_picked.append(cand)
                selected_ids.add(cand["id"])
                cell_key = (int(math.floor(cand["lat"] / 2.0)), int(math.floor(cand["lng"] / 2.0)))
                occupied_3x3_cells[cell_key] += 1

        selected_cities.extend(country_picked)

    print(f"Selected after country quotas & anti-suburb clustering: {len(selected_cities)}")

    # Spatial Gap-Filler (2 deg x 2 deg grid across the inhabited world)
    grid_candidates = defaultdict(list)
    for c in candidates:
        if c["id"] not in selected_ids and (c["population"] >= 2500 or c["fcode"] in {"PPLA", "PPLA2"}):
            cell_key = (int(math.floor(c["lat"] / 2.0)), int(math.floor(c["lng"] / 2.0)))
            grid_candidates[cell_key].append(c)

    gap_filled = 0
    for cell_key, cell_list in grid_candidates.items():
        if occupied_3x3_cells.get(cell_key, 0) == 0:
            cell_list.sort(key=lambda x: x["grs"], reverse=True)
            best = cell_list[0]
            best["is_gap_fill"] = True
            selected_cities.append(best)
            selected_ids.add(best["id"])
            occupied_3x3_cells[cell_key] += 1
            gap_filled += 1

    print(f"Added via 2x2-deg Spatial Gap-Filler: {gap_filled} (Total: {len(selected_cities)})")

    # 5-Tier Assignment:
    # - Tier 1 (~280 cities): All sovereign capitals + curated global metropolises
    # - Tier 2 (~850 cities): Major regional hubs, top cities of countries & famous isolated anchors
    # - Tier 3 (~1,400 cities): Province/state capitals & key regional centers
    # - Tier 4 (~1,650 cities): Secondary regional cities
    # - Tier 5 (~1,450 cities): Advanced/obscure cities & remote outposts
    tier1 = []
    remaining = []
    for c in selected_cities:
        cc = c["country_code"]
        is_world_t1 = (cc, c["name"]) in WORLD_TIER_1_NON_CAPITALS or (cc, c["raw_name"]) in WORLD_TIER_1_NON_CAPITALS
        if (c["is_capital"] and countries_info[cc]["population"] >= 30000) or is_world_t1:
            c["tier"] = 1
            tier1.append(c)
        else:
            remaining.append(c)

    by_cc_rem = defaultdict(list)
    for c in remaining:
        by_cc_rem[c["country_code"]].append(c)

    for cc, clist in by_cc_rem.items():
        clist.sort(key=lambda x: x["grs"], reverse=True)
        n = len(clist)
        country_pop = countries_info[cc]["population"]
        for idx, c in enumerate(clist):
            pct_rank = idx / max(1, n)
            # Within-country pyramid bonus for countries with >= 4M inhabitants so medium countries
            # (like BE, NL, SE, NO, AT, CH, PT, GR, ZA, PH) get a balanced pyramid across T2, T3, T4, T5
            if country_pop >= 4000000:
                if pct_rank < 0.12 and c["population"] >= 90000:
                    prom_bonus = 1.45 * (1.0 - pct_rank / 0.12)
                elif pct_rank < 0.34 and c["population"] >= 50000:
                    prom_bonus = 0.85 * (1.0 - (pct_rank - 0.12) / 0.22)
                elif pct_rank < 0.62 and c["population"] >= 25000:
                    prom_bonus = 0.35
                else:
                    prom_bonus = 0.0
            else:
                prom_bonus = 0.0

            # Strict small-town penalty if NOT geographically isolated (prevents Diekirch T2!)
            pop = c["population"]
            d_near = c["d_nearest"]
            if pop < 15000 and d_near < 120.0 and not c["is_iconic"]:
                small_town_penalty = -3.5
            elif pop < 35000 and d_near < 90.0 and not c["is_iconic"]:
                small_town_penalty = -1.8
            elif pop < 65000 and d_near < 70.0 and not c["is_iconic"]:
                small_town_penalty = -0.85
            else:
                small_town_penalty = 0.0

            c["tier_score"] = c["grs"] + prom_bonus + small_town_penalty

    remaining.sort(key=lambda x: x["tier_score"], reverse=True)

    t2_target = 850
    t3_target = 1400
    t4_target = 1650

    t2_count = 0
    t3_count = 0
    t4_count = 0

    # First honor explicit benchmark tier overrides
    unassigned = []
    for c in remaining:
        override = BENCHMARK_TIER_OVERRIDES.get((c["country_code"], c["name"]))
        if override == 2:
            c["tier"] = 2
            t2_count += 1
        elif override == 3:
            c["tier"] = 3
            t3_count += 1
        elif override == 4:
            c["tier"] = 4
            t4_count += 1
        elif override == 5:
            c["tier"] = 5
        else:
            unassigned.append(c)

    for c in unassigned:
        pop = c["population"]
        d_near = c["d_nearest"]
        can_be_t2 = (pop >= 85000) or (c["is_iconic"] and d_near >= 140.0) or (pop >= 25000 and d_near >= 350.0)
        can_be_t3 = (pop >= 28000) or (c["fcode"] == "PPLA" and pop >= 12000) or (d_near >= 150.0 and pop >= 5000) or c["is_iconic"]
        can_be_t4 = (pop >= 9500) or (d_near >= 80.0) or c["fcode"] in {"PPLA", "PPLA2"}

        if t2_count < t2_target and can_be_t2:
            c["tier"] = 2
            t2_count += 1
        elif t3_count < t3_target and can_be_t3:
            c["tier"] = 3
            t3_count += 1
        elif t4_count < t4_target and can_be_t4:
            c["tier"] = 4
            t4_count += 1
        else:
            c["tier"] = 5

    # Cap Tier 5 to ~1,550 cities so total global dataset is ~5,750 cities (within 5,500 - 6,000)
    tier1234 = [c for c in remaining if c.get("tier") in {2, 3, 4}]
    tier5_all = [c for c in remaining if c.get("tier") == 5]

    # Count how many cities each country already has in Tiers 1-4
    cc_t14_counts = defaultdict(int)
    for c in tier1 + tier1234:
        cc_t14_counts[c["country_code"]] += 1

    tier5_all.sort(
        key=lambda x: (
            (x["country_code"], x["name"]) in BENCHMARK_TIER_OVERRIDES,
            x["is_iconic"],
            x.get("is_gap_fill", False),
            x["tier_score"],
        ),
        reverse=True,
    )

    t5_target = 1550
    tier5_kept = []
    tier5_deferred = []
    for c in tier5_all:
        cc = c["country_code"]
        min_country_total = min(7, compute_country_quota(cc, countries_info[cc]["area"], countries_info[cc]["population"]))
        if cc_t14_counts[cc] < min_country_total or (cc, c["name"]) in BENCHMARK_TIER_OVERRIDES or c["is_iconic"]:
            tier5_kept.append(c)
            cc_t14_counts[cc] += 1
        else:
            tier5_deferred.append(c)

    for c in tier5_deferred:
        if len(tier5_kept) >= t5_target:
            break
        tier5_kept.append(c)

    all_final = tier1 + tier1234 + tier5_kept
    all_final.sort(key=lambda x: (x["tier"], -x["population"]))

    tier_counts = defaultdict(int)
    for c in all_final:
        tier_counts[c["tier"]] += 1

    print("Final Tier Distribution:")
    for t in range(1, 6):
        print(f"  Tier {t}: {tier_counts[t]}")
    print(f"  TOTAL: {len(all_final)}")

    export_list = []
    for c in all_final:
        export_list.append(
            {
                "id": c["id"],
                "name": c["name"],
                "country_code": c["country_code"],
                "continent": c["continent"],
                "admin1": c["admin1"],
                "lat": c["lat"],
                "lng": c["lng"],
                "population": c["population"],
                "tier": c["tier"],
                "is_capital": c["is_capital"],
            }
        )

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(export_list, f, ensure_ascii=False, indent=2)
    print(f"Successfully wrote {len(export_list)} cities to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
