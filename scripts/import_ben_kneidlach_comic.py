#!/usr/bin/env python3
"""Archive the exact approved four-panel Ben and Grandma Shuli kneidlach comic."""
import io,json,urllib.request
from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parents[1]
source=json.loads((root/"scripts/ben_kneidlach_comic_source.json").read_text(encoding="utf-8"))
dest=root/source["file"]
if not dest.is_file():
    req=urllib.request.Request(source["source_url"],headers={"User-Agent":"Mozilla/5.0 (family-comic-archiver)"})
    with urllib.request.urlopen(req,timeout=75) as response:
        data=response.read(15_000_001)
    if not (10000<len(data)<=15_000_000):
        raise RuntimeError(f"Unexpected kneidlach comic byte count: {len(data)}")
    im=Image.open(io.BytesIO(data));im.load()
    if im.format!="PNG" or list(im.size)!=source["expected_dimensions"]:
        raise RuntimeError(f"Unexpected comic image: {im.format} {im.size}")
    dest.parent.mkdir(parents=True,exist_ok=True)
    dest.write_bytes(data)
    print("Saved exact approved kneidlach comic:",dest,len(data))
else: print("Approved kneidlach comic already stored:",dest)
with Image.open(dest) as im:
    if im.format!="PNG" or list(im.size)!=source["expected_dimensions"]:
        raise RuntimeError("Stored kneidlach comic does not match original metadata")
    im.verify()
print("Kneidlach comic image validated.")
