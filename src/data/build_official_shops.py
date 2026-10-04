#!/usr/bin/env python3
"""
Parser for the official TNCSC Table 2 data into structured JSON
"""
import re
import json

def parse_html_table(html_file, output_json):
    with open(html_file, 'r', encoding='utf-8') as f:
        html = f.read()

    # Find table2
    table2_match = re.search(r'<table[^>]*id="table2"[^>]*>(.*?)</table>', html, re.DOTALL | re.IGNORECASE)
    if not table2_match:
        print("table2 not found")
        return

    table_content = table2_match.group(1)
    
    # Extract rows
    rows = re.findall(r'<tr[^>]*>(.*?)</tr>', table_content, re.DOTALL | re.IGNORECASE)
    
    shops = []
    
    for row in rows:
        tds = re.findall(r'<td[^>]*>(.*?)</td>', row, re.DOTALL | re.IGNORECASE)
        if len(tds) < 9:
            continue
        
        # Clean text
        def clean(s):
            s = re.sub(r'<[^>]+>', ' ', s)
            s = re.sub(r'\s+', ' ', s).strip()
            return s

        try:
            sno_str = clean(tds[0])
            if not sno_str.isdigit():
                continue
            sno = int(sno_str)
            region = clean(tds[1])
            taluk = clean(tds[2])
            address = clean(tds[3])
            name = clean(tds[4])
            code = clean(tds[5])
            area_type = 'Rural' if 'rural' in clean(tds[6]).lower() else 'Urban'
            cat_text = clean(tds[7]).lower()
            category = 'Part Time' if 'part' in cat_text else 'Full Time'
            
            geo_cell = tds[8]
            # Extract coordinates from link or text
            coord_match = re.search(r'([0-9]+\.[0-9]+)\s*,\s*([0-9]+\.[0-9]+)', geo_cell)
            if not coord_match:
                continue
            lat = float(coord_match.group(1))
            lng = float(coord_match.group(2))
            
            # Basic sanity check for Tamil Nadu coordinates
            # TN latitude roughly 8.0 - 14.0, longitude 76.0 - 81.0
            # Some entries in raw table have lat and lng swapped, e.g. 78.070216, 10.957486 (Karur) or 712.5998
            if lat > 70.0 and lng < 20.0:
                # Swapped lat/lng
                lat, lng = lng, lat
            elif lat > 700.0:
                # Typo in source like 712.5998 -> 12.5998
                lat = float(str(lat)[1:])

            shops.append({
                "sno": sno,
                "region": region,
                "taluk": taluk,
                "address": address,
                "name": name,
                "code": code if code else f"TNCSC-{sno}",
                "areaType": area_type,
                "category": category,
                "lat": round(lat, 6),
                "lng": round(lng, 6)
            })
        except Exception as e:
            continue

    print(f"Parsed {len(shops)} official shops successfully.")
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(shops, f, indent=2, ensure_ascii=False)

if __name__ == '__main__':
    import sys
    html_f = sys.argv[1] if len(sys.argv) > 1 else 'src/data/raw_table.html'
    out_f = sys.argv[2] if len(sys.argv) > 2 else 'src/data/officialShops.json'
    parse_html_table(html_f, out_f)
