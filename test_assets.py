import requests
import re

url = "https://trifecta-astro.vercel.app"
html = requests.get(url).text
print("HTML Content Length:", len(html))

matches = re.findall(r'(?:src|href)="([^"]+)"', html)
print("Assets found:", matches)

all_ok = True
for m in matches:
    if m.startswith("/") or m.endswith(".js") or m.endswith(".css"):
        asset_url = url + m
        r = requests.get(asset_url)
        print(f"Asset {m}: HTTP {r.status_code} ({len(r.content)} bytes, Content-Type: {r.headers.get('content-type')})")
        if r.status_code != 200 or "text/html" in r.headers.get("content-type", ""):
            all_ok = False

if all_ok:
    print("\n>>> ALL ASSETS LOADED WITH CORRECT MIME TYPES (NO BLANK SCREEN)! <<<")
else:
    print("\n>>> ERROR IN ASSET LOADING <<<")
