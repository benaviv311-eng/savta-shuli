#!/usr/bin/env python3
"""One-time import of two Eyal illustrations into permanent repository assets.
Source URLs are Canva-signed imports of the two exact ChatGPT-generated images;
once saved locally, later site builds no longer rely on external URLs.
"""
import io
import json
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import urlparse
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
manifest=json.loads((ROOT/"scripts/eyal_import_manifest.json").read_text(encoding="utf-8"))
for pic in manifest["photos"]:
    output=ROOT / pic["file"]
    if output.exists() and output.stat().st_size>1000:
        print(f"Already stored locally: {pic['file']}, {output.stat().st_size} bytes")
        continue
    url=pic["url"]
    # Attempt to request the image at original dimensions. Signed transforms
    # may not allow this, in which case preserve the valid Canva export.
    variants=[
        ("original-size",url.replace("height:200","height:1536").replace("width:133","width:1024").replace("x-canva-quality=thumbnail","x-canva-quality=original")),
        ("preview",url),
    ]
    got=None
    errors=[]
    for variant,u in variants:
        try:
            req=Request(u,headers={"User-Agent":"Mozilla/5.0 (compatible; family-photo-archive/1.0)"})
            with urlopen(req,timeout=45) as r:
                data=r.read()
                if len(data)<4000:raise ValueError("Image too small")
            im=Image.open(io.BytesIO(data))
            im.load()
            if im.width<100 or im.height<150:raise ValueError("Image dimensions too small")
            got=(variant,data,im)
            print(f"Retrieved {pic['file']}: {variant}, dimensions {im.width}x{im.height}, {len(data)} bytes")
            break
        except Exception as e:
            errors.append(f"{variant}: {type(e).__name__}: {e}")
    if got is None:raise RuntimeError(f"Cannot import {pic['file']}: {errors}")
    variant,data,im=got
    output.parent.mkdir(parents=True,exist_ok=True)
    # Store original pixels as a portable PNG, with no crop or image redesign.
    im.save(output,format="PNG",optimize=True)
    print(f"Saved {output.relative_to(ROOT)}, {output.stat().st_size} bytes")
