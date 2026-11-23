#!/usr/bin/env python3
"""Archive the four approved story panels as local static files on GitHub Pages."""
import io
import json
import hashlib
import urllib.request
from pathlib import Path
from PIL import Image

root=Path(__file__).resolve().parents[1]
sources=sorted(json.loads((root/"scripts/eyal_story_sources.json").read_text(encoding="utf-8"))["sources"],key=lambda e:e["order"])
assert [p["order"] for p in sources]==[1,2,3,4]
for p in sources:
    target=root/p["path"]
    if target.exists() and target.stat().st_size>10_000:
        with Image.open(target) as pic:
            pic.verify()
        print(f"Panel {p['order']} available from repository: {target.name}")
        continue
    signed=p["url"]
    # The platform's media CDN may sign resize params. Prefer the full original
    # illustration, fall back to the authenticated thumbnail only if necessary.
    tries=[
        ("full",signed.replace("/height:133/","/height:1024/").replace("/width:200","/width:1536")),
        ("medium",signed.replace("/height:133/","/height:683/").replace("/width:200","/width:1024")),
        ("provided",signed)
    ]
    best=None
    problems=[]
    for label,url in tries:
        try:
            request=urllib.request.Request(url,headers={"User-Agent":"Mozilla/5.0 (compatible; family-comic-gallery/1.0)"})
            with urllib.request.urlopen(request,timeout=30) as response:
                raw=response.read(15_000_001)
            if not 5_000<len(raw)<15_000_001:raise ValueError(f"Unexpected bytes {len(raw)}")
            image=Image.open(io.BytesIO(raw))
            image.load()
            if image.width<180 or image.height<120:raise ValueError("Incorrect image dimensions")
            if image.format!="PNG":raise ValueError(f"Expected PNG, got {image.format}")
            best=raw
            print(f"Panel {p['order']} downloaded {label} ({image.width}x{image.height}), {len(raw)} bytes.")
            break
        except Exception as exc:
            problems.append(label+":"+type(exc).__name__)
    if best is None:
        raise RuntimeError(f"Unable to archive illustration {p['order']}: {problems}")
    target.parent.mkdir(parents=True,exist_ok=True)
    target.write_bytes(best)
    print(f"Saved {p['path']} sha256={hashlib.sha256(best).hexdigest()[:16]}")
print("All four approved artworks are archived.")
