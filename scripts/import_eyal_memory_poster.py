#!/usr/bin/env python3
"""Import the approved elegant Eyal/Grandma Shuli poster, keeping the exact PNG bytes."""
import io, json, urllib.request
from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parents[1]
data=json.loads((root/"scripts/eyal_memory_poster_source.json").read_text(encoding="utf-8"))
dest=root/data["file"]
if dest.exists() and dest.stat().st_size > 10000:
    raw=dest.read_bytes()
    print(f"Memory poster already archived locally: {len(raw)} bytes")
else:
    req=urllib.request.Request(data["source_url"],headers={"User-Agent":"Mozilla/5.0 (family-album-archiver)"})
    with urllib.request.urlopen(req,timeout=75) as response:
        raw=response.read(12_000_001)
    if not 10_000 < len(raw) <= 12_000_000:
        raise RuntimeError(f"Bad poster data: {len(raw)} bytes")
    image=Image.open(io.BytesIO(raw))
    if image.format!="PNG" or list(image.size)!=data["expected_dimensions"]:
        raise RuntimeError(f"Unexpected poster: {image.format}, {image.size}")
    image.verify()
    dest.parent.mkdir(parents=True,exist_ok=True)
    dest.write_bytes(raw)
    print(f"Saved exact, unmodified approved memory poster: {dest} ({len(raw)} bytes)")
with Image.open(dest) as image:
    image.verify()
print("Eyal memory poster validated.")
