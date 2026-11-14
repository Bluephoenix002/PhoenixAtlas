#!/usr/bin/env python3
import json
import math
import urllib.request
from collections import defaultdict

def fetch_gadm(code_lvl):
    url = f"https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_{code_lvl}.json"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=25) as r:
        return json.loads(r.read().decode("utf-8"))

def simplify_ring(ring, tol=0.0012):
    if len(ring) <= 4:
        return ring
    out = [ring[0]]
    for pt in ring[1:-1]:
        if math.hypot(pt[0] - out[-1][0], pt[1] - out[-1][1]) >= tol:
            out.append(pt)
    out.append(out[0])
    if len(out) < 4:
        return ring
    return out

def dissolve_polygons_by_group(features, group_fn, props_fn, snap_digits=4):
    """
    Takes GeoJSON features, groups them by group_fn(feat), and dissolves shared interior boundaries
    between polygons in the same group by canceling opposite directed edges on a quantized grid.
    """
    grouped_feats = defaultdict(list)
    for f in features:
        gkey = group_fn(f)
        if gkey is not None:
            grouped_feats[gkey].append(f)

    out_geoms = []
    out_arcs = []

    def snap(pt):
        return (round(pt[0], snap_digits), round(pt[1], snap_digits))

    for gkey, flist in grouped_feats.items():
        # Collect all directed edges (u -> v) across all exterior/interior rings of features in flist
        edge_count = defaultdict(int)
        for f in flist:
            geom = f["geometry"]
            polys = geom["coordinates"] if geom["type"] == "MultiPolygon" else [geom["coordinates"]]
            for poly in polys:
                for ring in poly:
                    pts = [snap(p) for p in ring]
                    # remove consecutive duplicates
                    clean = [pts[0]]
                    for p in pts[1:]:
                        if p != clean[-1]:
                            clean.append(p)
                    if len(clean) < 4:
                        continue
                    if clean[-1] != clean[0]:
                        clean.append(clean[0])
                    for i in range(len(clean) - 1):
                        u, v = clean[i], clean[i + 1]
                        if u == v:
                            continue
                        # If reverse edge exists, cancel it out!
                        if edge_count.get((v, u), 0) > 0:
                            edge_count[(v, u)] -= 1
                            if edge_count[(v, u)] == 0:
                                del edge_count[(v, u)]
                        else:
                            edge_count[(u, v)] += 1

        # Reconstruct closed rings from remaining directed edges
        adj = defaultdict(list)
        for (u, v), cnt in edge_count.items():
            for _ in range(cnt):
                adj[u].append(v)

        rings = []
        while adj:
            start = next(iter(adj.keys()))
            ring = [start]
            curr = start
            while True:
                next_list = adj.get(curr)
                if not next_list:
                    break
                nxt = next_list.pop()
                if not next_list:
                    del adj[curr]
                ring.append(nxt)
                curr = nxt
                if curr == start:
                    break
            if len(ring) >= 4 and ring[0] == ring[-1]:
                sring = simplify_ring([[p[0], p[1]] for p in ring], tol=0.0012)
                if len(sring) >= 4:
                    rings.append(sring)

        if not rings:
            continue

        poly_arcs = []
        for r in rings:
            arc_idx = len(out_arcs)
            out_arcs.append(r)
            poly_arcs.append([[arc_idx]])

        out_geoms.append({
            "type": "MultiPolygon",
            "properties": props_fn(gkey, flist),
            "arcs": poly_arcs
        })

    return {
        "type": "Topology",
        "objects": {
            "subdivisions": {
                "type": "GeometryCollection",
                "geometries": out_geoms
            }
        },
        "arcs": out_arcs
    }

def polygon_centroid(flist):
    xs, ys, n = 0.0, 0.0, 0
    for f in flist:
        geom = f["geometry"]
        polys = geom["coordinates"] if geom["type"] == "MultiPolygon" else [geom["coordinates"]]
        for poly in polys:
            for pt in poly[0]:
                xs += pt[0]
                ys += pt[1]
                n += 1
    if n == 0:
        return (14.0, 47.5)
    return (round(xs / n, 3), round(ys / n, 3))

# 1. Load GADM 4.1 AUT_2 (94 real Austrian Bezirke)
print("Fetching GADM 4.1 AUT_2...")
aut2 = fetch_gadm("AUT_2")
aut_feats = aut2["features"]

# Map each of the 94 GADM NAME_2 Bezirke to:
# (a) The 35 official Austrian NUTS-3 Regionalbezirke in aut_adm2.topo.json
NUTS3_MAP = {
    # Burgenland (3)
    "Oberpullendorf": ("Burgenland", "Mittelburgenland (Oberpullendorf)"),
    "Eisenstadt-Umgebung": ("Burgenland", "Nordburgenland (Eisenstadt)"),
    "EisenstadtStadt": ("Burgenland", "Nordburgenland (Eisenstadt)"),
    "Mattersburg": ("Burgenland", "Nordburgenland (Eisenstadt)"),
    "NeusiedlamSee": ("Burgenland", "Nordburgenland (Eisenstadt)"),
    "RustStadt": ("Burgenland", "Nordburgenland (Eisenstadt)"),
    "Güssing": ("Burgenland", "Südburgenland (Oberwart/Güssing)"),
    "Jennersdorf": ("Burgenland", "Südburgenland (Oberwart/Güssing)"),
    "Oberwart": ("Burgenland", "Südburgenland (Oberwart/Güssing)"),
    # Kärnten (3)
    "KlagenfurtLand": ("Kärnten", "Klagenfurt-Villach"),
    "KlagenfurtStadt": ("Kärnten", "Klagenfurt-Villach"),
    "VillachLand": ("Kärnten", "Klagenfurt-Villach"),
    "VillachStadt": ("Kärnten", "Klagenfurt-Villach"),
    "Feldkirchen": ("Kärnten", "Oberkärnten (Spittal/Hermagor)"),
    "Hermagor": ("Kärnten", "Oberkärnten (Spittal/Hermagor)"),
    "SpittalanderDrau": ("Kärnten", "Oberkärnten (Spittal/Hermagor)"),
    "SanktVeitanderGlan": ("Kärnten", "Unterkärnten (Wolfsberg/Völkermarkt)"),
    "Völkermarkt": ("Kärnten", "Unterkärnten (Wolfsberg/Völkermarkt)"),
    "Wolfsberg": ("Kärnten", "Unterkärnten (Wolfsberg/Völkermarkt)"),
    # Niederösterreich (7)
    "Amstetten": ("Niederösterreich", "Mostviertel-Eisenwurzen (Amstetten)"),
    "Melk": ("Niederösterreich", "Mostviertel-Eisenwurzen (Amstetten)"),
    "Scheibbs": ("Niederösterreich", "Mostviertel-Eisenwurzen (Amstetten)"),
    "WaidhofenanderYbbsStadt": ("Niederösterreich", "Mostviertel-Eisenwurzen (Amstetten)"),
    "Lilienfeld": ("Niederösterreich", "Niederösterreich-Süd (Wiener Neustadt)"),
    "Neunkirchen": ("Niederösterreich", "Niederösterreich-Süd (Wiener Neustadt)"),
    "WienerNeustadtLand": ("Niederösterreich", "Niederösterreich-Süd (Wiener Neustadt)"),
    "WienerNeustadtStadt": ("Niederösterreich", "Niederösterreich-Süd (Wiener Neustadt)"),
    "SanktPöltenLand": ("Niederösterreich", "Sankt Pölten"),
    "SanktPöltenStadt": ("Niederösterreich", "Sankt Pölten"),
    "Gmünd": ("Niederösterreich", "Waldviertel (Krems/Gmünd/Zwettl)"),
    "Horn": ("Niederösterreich", "Waldviertel (Krems/Gmünd/Zwettl)"),
    "KremsanderDonauStadt": ("Niederösterreich", "Waldviertel (Krems/Gmünd/Zwettl)"),
    "KremsLand": ("Niederösterreich", "Waldviertel (Krems/Gmünd/Zwettl)"),
    "WaidhofenanderThaya": ("Niederösterreich", "Waldviertel (Krems/Gmünd/Zwettl)"),
    "Zwettl": ("Niederösterreich", "Waldviertel (Krems/Gmünd/Zwettl)"),
    "Hollabrunn": ("Niederösterreich", "Weinviertel (Mistelbach/Hollabrunn)"),
    "Mistelbach": ("Niederösterreich", "Weinviertel (Mistelbach/Hollabrunn)"),
    "Korneuburg": ("Niederösterreich", "Wiener Umland-Nordteil (Korneuburg/Tulln)"),
    "Tulln": ("Niederösterreich", "Wiener Umland-Nordteil (Korneuburg/Tulln)"),
    "Gänserndorf": ("Niederösterreich", "Wiener Umland-Nordteil (Korneuburg/Tulln)"),
    "Baden": ("Niederösterreich", "Wiener Umland-Südteil (Baden/Mödling/Bruck)"),
    "BruckanderLeitha": ("Niederösterreich", "Wiener Umland-Südteil (Baden/Mödling/Bruck)"),
    "Mödling": ("Niederösterreich", "Wiener Umland-Südteil (Baden/Mödling/Bruck)"),
    # Oberösterreich (5)
    "BraunauamInn": ("Oberösterreich", "Innviertel (Braunau/Ried/Schärding)"),
    "Grieskirchen": ("Oberösterreich", "Innviertel (Braunau/Ried/Schärding)"),
    "RiedimInnkreis": ("Oberösterreich", "Innviertel (Braunau/Ried/Schärding)"),
    "Schärding": ("Oberösterreich", "Innviertel (Braunau/Ried/Schärding)"),
    "Eferding": ("Oberösterreich", "Linz-Wels"),
    "LinzLand": ("Oberösterreich", "Linz-Wels"),
    "LinzStadt": ("Oberösterreich", "Linz-Wels"),
    "WelsLand": ("Oberösterreich", "Linz-Wels"),
    "WelsStadt": ("Oberösterreich", "Linz-Wels"),
    "Freistadt": ("Oberösterreich", "Mühlviertel (Freistadt/Rohrbach)"),
    "Perg": ("Oberösterreich", "Mühlviertel (Freistadt/Rohrbach)"),
    "Rohrbach": ("Oberösterreich", "Mühlviertel (Freistadt/Rohrbach)"),
    "Urfahr-Umgebung": ("Oberösterreich", "Mühlviertel (Freistadt/Rohrbach)"),
    "KirchdorfanderKrems": ("Oberösterreich", "Steyr-Kirchdorf"),
    "SteyrLand": ("Oberösterreich", "Steyr-Kirchdorf"),
    "SteyrStadt": ("Oberösterreich", "Steyr-Kirchdorf"),
    "Gmunden": ("Oberösterreich", "Traunviertel (Gmunden/Vöcklabruck)"),
    "Vöcklabruck": ("Oberösterreich", "Traunviertel (Gmunden/Vöcklabruck)"),
    # Salzburg (3)
    "Tamsweg": ("Salzburg", "Lungau (Tamsweg)"),
    "SanktJohannimPongau": ("Salzburg", "Pinzgau-Pongau (Zell am See/St. Johann)"),
    "ZellamSee": ("Salzburg", "Pinzgau-Pongau (Zell am See/St. Johann)"),
    "Hallein": ("Salzburg", "Salzburg und Umgebung (Flachgau/Tennengau)"),
    "Salzburg-Umgebung": ("Salzburg", "Salzburg und Umgebung (Flachgau/Tennengau)"),
    "SalzburgStadt": ("Salzburg", "Salzburg und Umgebung (Flachgau/Tennengau)"),
    # Steiermark (6)
    "Graz-Umgebung": ("Steiermark", "Graz"),
    "GrazStadt": ("Steiermark", "Graz"),
    "Voitsberg": ("Steiermark", "Graz"),
    "Liezen": ("Steiermark", "Liezen (Ennstal)"),
    "Bruck-Mürzzuschlag": ("Steiermark", "Östliche Obersteiermark (Leoben/Bruck-Mürzzuschlag)"),
    "Leoben": ("Steiermark", "Östliche Obersteiermark (Leoben/Bruck-Mürzzuschlag)"),
    "Hartberg-Fürstenfeld": ("Steiermark", "Oststeiermark (Hartberg-Fürstenfeld/Weiz/Südoststeiermark)"),
    "Südoststeiermark": ("Steiermark", "Oststeiermark (Hartberg-Fürstenfeld/Weiz/Südoststeiermark)"),
    "Weiz": ("Steiermark", "Oststeiermark (Hartberg-Fürstenfeld/Weiz/Südoststeiermark)"),
    "Deutschlandsberg": ("Steiermark", "West- und Südsteiermark (Leibnitz/Deutschlandsberg)"),
    "Leibnitz": ("Steiermark", "West- und Südsteiermark (Leibnitz/Deutschlandsberg)"),
    "Murau": ("Steiermark", "Westliche Obersteiermark (Murau/Murtal)"),
    "Murtal": ("Steiermark", "Westliche Obersteiermark (Murau/Murtal)"),
    # Tirol (5)
    "Reutte": ("Tirol", "Außerfern (Reutte)"),
    "InnsbruckLand": ("Tirol", "Innsbruck"),
    "InnsbruckStadt": ("Tirol", "Innsbruck"),
    "Lienz": ("Tirol", "Osttirol (Lienz)"),
    "Imst": ("Tirol", "Tiroler Oberland (Imst/Landeck)"),
    "Landeck": ("Tirol", "Tiroler Oberland (Imst/Landeck)"),
    "Kitzbühel": ("Tirol", "Tiroler Unterland (Kufstein/Kitzbühel/Schwaz)"),
    "Kufstein": ("Tirol", "Tiroler Unterland (Kufstein/Kitzbühel/Schwaz)"),
    "Schwaz": ("Tirol", "Tiroler Unterland (Kufstein/Kitzbühel/Schwaz)"),
    # Vorarlberg (2)
    "Bludenz": ("Vorarlberg", "Bludenz-Bregenzer Wald"),
    "Bregenz": ("Vorarlberg", "Rheintal-Bodenseegebiet (Bregenz/Dornbirn/Feldkirch)"),
    "Dornbirn": ("Vorarlberg", "Rheintal-Bodenseegebiet (Bregenz/Dornbirn/Feldkirch)"),
    "Feldkirch": ("Vorarlberg", "Rheintal-Bodenseegebiet (Bregenz/Dornbirn/Feldkirch)"),
    # Wien (1)
    "WienStadt": ("Wien", "Wien (Vienna)"),
}

unmapped = [f["properties"]["NAME_2"] for f in aut_feats if f["properties"]["NAME_2"] not in NUTS3_MAP]
if unmapped:
    print("WARNING unmapped AUT_2:", unmapped)

topo_aut_adm2 = dissolve_polygons_by_group(
    aut_feats,
    lambda f: NUTS3_MAP.get(f["properties"]["NAME_2"]),
    lambda gkey, flist: {
        "COUNTRY": "Austria",
        "NAME_1": gkey[0],
        "NAME_2": gkey[1],
        "name": gkey[1],
        "TYPE_2": "Regionalbezirk"
    }
)
with open("public/maps/subdivisions/aut_adm2.topo.json", "w") as f:
    json.dump(topo_aut_adm2, f, separators=(",", ":"))
print("Wrote aut_adm2.topo.json with", len(topo_aut_adm2["objects"]["subdivisions"]["geometries"]), "organic NUTS-3 regions!")

# (b) Map each of the 94 GADM Bezirke to its official Austrian 2-digit / city AreaCode (38 zones)
AUT_AREACODE_2D_MAP = {
    "WienStadt": ("1", "Vienna"),
    "NeusiedlamSee": ("21", "Parndorf"),
    "BruckanderLeitha": ("21", "Parndorf"),
    "Tulln": ("22", "Tulln an der Donau"),
    "Korneuburg": ("22", "Tulln an der Donau"),
    "Mödling": ("22", "Tulln an der Donau"),
    "Gänserndorf": ("25", "Mistelbach an der Zaya"),
    "Mistelbach": ("25", "Mistelbach an der Zaya"),
    "Baden": ("26", "Wiener Neustadt"),
    "WienerNeustadtLand": ("26", "Wiener Neustadt"),
    "WienerNeustadtStadt": ("26", "Wiener Neustadt"),
    "Neunkirchen": ("26", "Wiener Neustadt"),
    "Eisenstadt-Umgebung": ("26", "Wiener Neustadt"),
    "EisenstadtStadt": ("26", "Wiener Neustadt"),
    "Mattersburg": ("26", "Wiener Neustadt"),
    "RustStadt": ("26", "Wiener Neustadt"),
    "Oberpullendorf": ("26", "Wiener Neustadt"),
    "SanktPöltenLand": ("27", "Sankt Pölten"),
    "SanktPöltenStadt": ("27", "Sankt Pölten"),
    "Lilienfeld": ("27", "Sankt Pölten"),
    "KremsanderDonauStadt": ("27", "Sankt Pölten"),
    "KremsLand": ("27", "Sankt Pölten"),
    "Melk": ("27", "Sankt Pölten"),
    "Gmünd": ("28", "Zwettl"),
    "WaidhofenanderThaya": ("28", "Zwettl"),
    "Zwettl": ("28", "Zwettl"),
    "Horn": ("29", "Horn"),
    "Hollabrunn": ("29", "Horn"),
    "Graz-Umgebung": ("31", "Graz"),
    "GrazStadt": ("31", "Graz"),
    "Voitsberg": ("31", "Graz"),
    "Weiz": ("31", "Graz"),
    "Hartberg-Fürstenfeld": ("33", "Hartberg"),
    "Oberwart": ("33", "Hartberg"),
    "Güssing": ("33", "Hartberg"),
    "Jennersdorf": ("33", "Hartberg"),
    "Deutschlandsberg": ("34", "Leibnitz"),
    "Leibnitz": ("34", "Leibnitz"),
    "Südoststeiermark": ("34", "Leibnitz"),
    "Murau": ("35", "Zeltweg"),
    "Murtal": ("35", "Zeltweg"),
    "Liezen": ("36", "Liezen"),
    "Bruck-Mürzzuschlag": ("38", "Kapfenberg"),
    "Leoben": ("38", "Kapfenberg"),
    "VillachLand": ("42", "Villach"),
    "VillachStadt": ("42", "Villach"),
    "Feldkirchen": ("42", "Villach"),
    "SanktVeitanderGlan": ("42", "Villach"),
    "KlagenfurtLand": ("42", "Villach"),
    "KlagenfurtStadt": ("46", "Klagenfurt"),
    "Wolfsberg": ("43", "Wolfsberg"),
    "Völkermarkt": ("43", "Wolfsberg"),
    "SpittalanderDrau": ("47", "Spittal an der Drau"),
    "Hermagor": ("47", "Spittal an der Drau"),
    "Lienz": ("48", "Lienz"),
    "InnsbruckStadt": ("51", "Innsbruck"),
    "InnsbruckLand": ("52", "Schwaz"),
    "Schwaz": ("52", "Schwaz"),
    "Kufstein": ("53", "Wörgl"),
    "Kitzbühel": ("53", "Wörgl"),
    "Imst": ("54", "Imst"),
    "Landeck": ("54", "Imst"),
    "Bregenz": ("55", "Bregenz"),
    "Dornbirn": ("55", "Bregenz"),
    "Feldkirch": ("55", "Bregenz"),
    "Bludenz": ("55", "Bregenz"),
    "Reutte": ("56", "Reutte"),
    "Gmunden": ("61", "Bad Ischl"),
    "Salzburg-Umgebung": ("62", "Hallein"),
    "Hallein": ("62", "Hallein"),
    "SalzburgStadt": ("662", "Salzburg"),
    "SanktJohannimPongau": ("64", "Sankt Johann im Pongau"),
    "Tamsweg": ("64", "Sankt Johann im Pongau"),
    "ZellamSee": ("65", "Zell am See"),
    "WelsLand": ("72", "Wels"),
    "WelsStadt": ("72", "Wels"),
    "Eferding": ("72", "Wels"),
    "Grieskirchen": ("72", "Wels"),
    "LinzLand": ("72", "Wels"),
    "Perg": ("72", "Wels"),
    "Urfahr-Umgebung": ("72", "Wels"),
    "Rohrbach": ("72", "Wels"),
    "LinzStadt": ("732", "Linz"),
    "SteyrStadt": ("735", "Weyer"),
    "SteyrLand": ("735", "Weyer"),
    "Amstetten": ("74", "Amstetten"),
    "Scheibbs": ("74", "Amstetten"),
    "WaidhofenanderYbbsStadt": ("74", "Amstetten"),
    "KirchdorfanderKrems": ("75", "Kirchdorf an der Krems"),
    "Vöcklabruck": ("76", "Gmunden"),
    "BraunauamInn": ("77", "Braunau am Inn"),
    "RiedimInnkreis": ("77", "Braunau am Inn"),
    "Schärding": ("77", "Braunau am Inn"),
    "Freistadt": ("79", "Freistadt"),
}

topo_aut_ac2d = dissolve_polygons_by_group(
    aut_feats,
    lambda f: AUT_AREACODE_2D_MAP.get(f["properties"]["NAME_2"]),
    lambda gkey, flist: {
        "AreaCode": gkey[0],
        "City": gkey[1],
        "labelx": polygon_centroid(flist)[0],
        "labely": polygon_centroid(flist)[1]
    }
)
with open("public/maps/areacodes/austria_areacodes_2d.topo.json", "w") as f:
    json.dump(topo_aut_ac2d, f, separators=(",", ":"))
with open("public/maps/areacodes/at_areacodes.topo.json", "w") as f:
    json.dump(topo_aut_ac2d, f, separators=(",", ":"))
print("Wrote austria_areacodes_2d.topo.json & at_areacodes.topo.json with", len(topo_aut_ac2d["objects"]["subdivisions"]["geometries"]), "organic zones!")

# (c) 7 1-digit area code zones (01..07) for austria_areacodes.topo.json
def aut_1d_group(f):
    ac2 = AUT_AREACODE_2D_MAP.get(f["properties"]["NAME_2"], ("2", ""))[0]
    if ac2 == "1":
        return ("01", "Vienna", "Wien")
    d = ac2[0]
    names = {
        "2": ("02", "Wiener Neustadt", "Niederösterreich & Nordburgenland"),
        "3": ("03", "Graz", "Steiermark & Südburgenland"),
        "4": ("04", "Klagenfurt", "Kärnten & Osttirol"),
        "5": ("05", "Innsbruck", "Tirol & Vorarlberg"),
        "6": ("06", "Salzburg", "Salzburg & Salzkammergut"),
        "7": ("07", "Linz", "Oberösterreich & Mostviertel"),
    }
    return names[d]

topo_aut_ac1d = dissolve_polygons_by_group(
    aut_feats,
    aut_1d_group,
    lambda gkey, flist: {
        "id": None,
        "name": gkey[2],
        "iso": gkey[0][-1],
        "AreaCode": gkey[0],
        "City": gkey[1],
        "labelx": polygon_centroid(flist)[0],
        "labely": polygon_centroid(flist)[1]
    }
)
with open("public/maps/areacodes/austria_areacodes.topo.json", "w") as f:
    json.dump(topo_aut_ac1d, f, separators=(",", ":"))
print("Wrote austria_areacodes.topo.json with", len(topo_aut_ac1d["objects"]["subdivisions"]["geometries"]), "organic 1-digit zones!")

# 2. Fix LUX_2 (12 Cantons of Luxembourg)
print("Fetching GADM 4.1 LUX_2...")
lux2 = fetch_gadm("LUX_2")
topo_lux2 = dissolve_polygons_by_group(
    lux2["features"],
    lambda f: (f["properties"]["NAME_1"], f["properties"]["NAME_2"]),
    lambda gkey, flist: {
        "COUNTRY": "Luxembourg",
        "NAME_1": gkey[0],
        "NAME_2": gkey[1],
        "name": gkey[1],
        "TYPE_2": "Canton",
        "ENGTYPE_2": "Canton"
    }
)
with open("public/maps/subdivisions/lux_adm2.topo.json", "w") as f:
    json.dump(topo_lux2, f, separators=(",", ":"))
print("Wrote lux_adm2.topo.json with", len(topo_lux2["objects"]["subdivisions"]["geometries"]), "organic Cantons!")

# 3. Fix ALB_2 (Albania ADM2)
print("Fetching GADM 4.1 ALB_2...")
alb2 = fetch_gadm("ALB_2")
topo_alb2 = dissolve_polygons_by_group(
    alb2["features"],
    lambda f: (f["properties"]["NAME_1"], f["properties"]["NAME_2"]),
    lambda gkey, flist: {
        "COUNTRY": "Albania",
        "NAME_1": gkey[0],
        "NAME_2": gkey[1],
        "name": gkey[1],
        "TYPE_2": "District"
    }
)
with open("public/maps/subdivisions/alb_adm2.topo.json", "w") as f:
    json.dump(topo_alb2, f, separators=(",", ":"))
print("Wrote alb_adm2.topo.json with", len(topo_alb2["objects"]["subdivisions"]["geometries"]), "organic Districts!")
