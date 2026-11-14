#!/usr/bin/env python3
import json
import os
import time
import urllib.parse
import urllib.request

UA = "GeoGlobeQuizApp/1.0 (https://aistudio.google.com; tom.vanderhoydonck@gmail.com) Python/3.10"
OUT_DIR = "public/flags/subdivisions"
os.makedirs(OUT_DIR, exist_ok=True)

# 1. Query Wikidata for all ISO 3166-2 -> Commons SVG filenames
sparql = """
SELECT ?iso ?flag WHERE {
  ?item wdt:P300 ?iso .
  ?item wdt:P41 ?flag .
  FILTER(REGEX(?iso, "^(BE|NL|AT|DE|CH|ES|CA|AU|MY|BR)-"))
}
"""
sparql_url = "https://query.wikidata.org/sparql?" + urllib.parse.urlencode({"query": sparql, "format": "json"})
req = urllib.request.Request(sparql_url, headers={"User-Agent": UA})
with urllib.request.urlopen(req, timeout=20) as r:
    data = json.loads(r.read().decode("utf-8"))

iso_to_file = {}
for b in data["results"]["bindings"]:
    iso = b["iso"]["value"].lower()
    fl = b["flag"]["value"]
    fn = urllib.parse.unquote(fl.split("/")[-1])
    if fn.lower().endswith(".svg"):
        if iso not in iso_to_file:
            iso_to_file[iso] = fn

# Override Austria & Germany & Spain & Belgium with their official Coat-of-Arms / standard SVG files where applicable
OVERRIDES = {
    "at-1": "Flag of Burgenland (state).svg",
    "at-2": "Flag of Carinthia (state).svg",
    "at-3": "Flag of Lower Austria (state).svg",
    "at-4": "Flag of Upper Austria (state).svg",
    "at-5": "Flag of Salzburg (state).svg",
    "at-6": "Flag of Styria (state).svg",
    "at-7": "Flag of Tirol (state).svg",
    "at-8": "Flag of Vorarlberg (state).svg",
    "at-9": "Flag of Vienna (state).svg",
    "de-bw": "Flag of Baden-Württemberg (state, lesser arms).svg",
    "de-by": "Flag of Bavaria (lozengy).svg",
    "de-he": "Flag of Hesse (state).svg",
    "de-mv": "Flag of Mecklenburg-Western Pomerania (state).svg",
    "de-nw": "Flag of North Rhine-Westphalia (state).svg",
    "de-sh": "Flag of Schleswig-Holstein (state).svg",
    "de-sn": "Flag of Saxony (state).svg",
    "de-st": "Flag of Saxony-Anhalt (state).svg",
    "de-th": "Flag of Thuringia (state).svg",
    "es-cn": "Flag of the Canary Islands.svg",
    "es-as": "Flag of Asturias.svg",
}
for k, v in OVERRIDES.items():
    iso_to_file[k] = v

# Keep only the 133 needed ISO codes (excluding Spain's 50 provinces since ES quiz uses the 19 autonomous communities)
ES_AUTO = {
    "es-an", "es-ar", "es-as", "es-cb", "es-ce", "es-cl", "es-cm", "es-cn",
    "es-ct", "es-ex", "es-ga", "es-ib", "es-mc", "es-md", "es-ml", "es-nc",
    "es-pv", "es-ri", "es-vc"
}
NL_PROV = {
    "nl-dr", "nl-fl", "nl-fr", "nl-ge", "nl-gr", "nl-li",
    "nl-nb", "nl-nh", "nl-ov", "nl-ut", "nl-ze", "nl-zh"
}

filtered_iso_to_file = {}
for iso, fn in sorted(iso_to_file.items()):
    if iso.startswith("es-") and iso not in ES_AUTO:
        continue
    if iso.startswith("nl-") and iso not in NL_PROV:
        continue
    filtered_iso_to_file[iso] = fn

print("Total non-US subdivision flags to verify/download:", len(filtered_iso_to_file))

# Batch query Commons API (up to 45 titles per batch) to get direct upload.wikimedia.org URLs
items = list(filtered_iso_to_file.items())
file_to_url = {}
for i in range(0, len(items), 40):
    batch = items[i:i+40]
    titles = "|".join("File:" + fn.replace("_", " ") for _, fn in batch)
    api_url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode({
        "action": "query",
        "titles": titles,
        "redirects": "1",
        "prop": "imageinfo",
        "iiprop": "url",
        "format": "json"
    })
    req = urllib.request.Request(api_url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=20) as r:
        res = json.loads(r.read().decode("utf-8"))
    q = res.get("query", {})
    norm_map = {n["from"]: n["to"] for n in q.get("normalized", [])}
    red_map = {r["from"]: r["to"] for r in q.get("redirects", [])}
    title_to_url = {}
    for p in q.get("pages", {}).values():
        t = p.get("title", "")
        ii = p.get("imageinfo", [])
        if ii and "url" in ii[0]:
            title_to_url[t] = ii[0]["url"].split("?")[0]
    for iso, fn in batch:
        orig = "File:" + fn.replace("_", " ")
        t1 = norm_map.get(orig, orig)
        t2 = red_map.get(t1, t1)
        if t2 in title_to_url:
            file_to_url[iso] = title_to_url[t2]
        else:
            print("  Fallback Special:FilePath for", iso, fn)
            file_to_url[iso] = "https://commons.wikimedia.org/wiki/Special:FilePath/" + urllib.parse.quote(fn)

opener = urllib.request.build_opener()
opener.addheaders = [("User-Agent", UA)]

downloaded = 0
for iso, u in sorted(file_to_url.items()):
    dest = os.path.join(OUT_DIR, f"{iso}.svg")
    if os.path.exists(dest) and os.path.getsize(dest) > 500:
        downloaded += 1
        continue
    for attempt in range(3):
        try:
            with opener.open(u, timeout=20) as r:
                svg_bytes = r.read()
            if len(svg_bytes) > 200:
                with open(dest, "wb") as f:
                    f.write(svg_bytes)
                downloaded += 1
                break
        except Exception as e:
            print(f"  Retry {attempt+1} for {iso} ({u}): {e}")
            time.sleep(1.5 * (attempt + 1))
    time.sleep(0.08)

print(f"Downloaded {downloaded}/{len(file_to_url)} non-US subdivision SVG flags!")

# Also download all 51 US State + DC SVG flags from flagcdn.com so they are 100% local & offline!
US_CODES = [
    "al","ak","az","ar","ca","co","ct","de","dc","fl","ga","hi","id","il","in","ia","ks","ky","la","me",
    "md","ma","mi","mn","ms","mo","mt","ne","nv","nh","nj","nm","ny","nc","nd","oh","ok","or","pa","ri",
    "sc","sd","tn","tx","ut","vt","va","wa","wv","wi","wy"
]
us_ok = 0
for st in US_CODES:
    dest = os.path.join(OUT_DIR, f"us-{st}.svg")
    if os.path.exists(dest) and os.path.getsize(dest) > 200:
        us_ok += 1
        continue
    try:
        with opener.open(f"https://flagcdn.com/us-{st}.svg", timeout=15) as r:
            data = r.read()
        with open(dest, "wb") as f:
            f.write(data)
        us_ok += 1
    except Exception as e:
        print("US err:", st, e)

print(f"Downloaded {us_ok}/51 US state SVG flags!")
