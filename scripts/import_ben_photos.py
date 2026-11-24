#!/usr/bin/env python3
"""Archive Ben's two approved childhood portraits unmodified."""
import io
import json
import urllib.request
from pathlib import Path
from PIL import Image

root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/"scripts/ben_photo_sources.json").read_text(encoding="utf-8"))
for photo in manifest["photos"]:
    target=root/photo["file"]
    if not target.is_file():
        req=urllib.request.Request(photo["url"],headers={"User-Agent":"Mozilla/5.0 (family-album-import)"})
        with urllib.request.urlopen(req,timeout=65) as resp:
            data=resp.read(10_000_001)
        if len(data)<10_000 or len(data)>10_000_000:
            raise RuntimeError(f"Invalid source size for Ben portrait {photo['order']}: {len(data)}")
        im=Image.open(io.BytesIO(data))
        im.load()
        if im.format!="PNG" or im.size!=(1024,1536):
            raise RuntimeError(f"Unexpected image format/dimensions: {im.format}, {im.size}")
        target.parent.mkdir(parents=True,exist_ok=True)
        target.write_bytes(data)
        print(f"Archived original Ben portrait {photo['order']}: {len(data)} bytes")
    else:
        print(f"Ben portrait already present: {target} ({target.stat().st_size} bytes)")
    with Image.open(target) as im:
        im.verify()
print("Both Ben portraits ready for publishing")
