#!/usr/bin/env python3
"""Permanently archive Eyal's four latest approved comic panels in GitHub Pages.
Exact original PNG bytes are stored: no crops, captions, re-encoding or visual edits.
"""
import io, json, hashlib, urllib.request
from pathlib import Path
from PIL import Image

root=Path(__file__).resolve().parents[1]
data=json.loads((root/"scripts/eyal_story_sources.json").read_text(encoding="utf-8"))
entries=sorted(data["sources"],key=lambda x:x["order"])
if [x["order"] for x in entries]!=[1,2,3,4]:
    raise RuntimeError("Expected exactly four panels, in story order")
for entry in entries:
    dest=root/entry["path"]
    if dest.exists() and dest.stat().st_size>10000:
        raw=dest.read_bytes()
        print(f"Panel {entry['order']} already archived ({len(raw)} bytes)")
    else:
        req=urllib.request.Request(entry["url"],headers={"User-Agent":"Mozilla/5.0 (compatible; family-comic-archive/1.0)"})
        with urllib.request.urlopen(req,timeout=55) as response:
            raw=response.read(15_000_001)
        if not 10_000<len(raw)<15_000_001:
            raise RuntimeError(f"Panel {entry['order']} returned unexpected bytes: {len(raw)}")
        im=Image.open(io.BytesIO(raw))
        im.verify()
        if im.format!="PNG":
            raise RuntimeError(f"Panel {entry['order']} is not PNG")
        dest.parent.mkdir(parents=True,exist_ok=True)
        dest.write_bytes(raw)
        print(f"Archived exact approved panel {entry['order']} ({len(raw)} bytes; sha256={hashlib.sha256(raw).hexdigest()[:16]})")
    # Never process saved bytes, only validate.
    with Image.open(dest) as image:
        image.verify()
print("All four Eyal story panels available locally.")
