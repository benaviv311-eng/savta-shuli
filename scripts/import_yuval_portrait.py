#!/usr/bin/env python3
"""Preserve Yuval's approved full-body portrait unchanged in the family album."""
import io,json,urllib.request
from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parents[1]
item=json.loads((root/"scripts/yuval_portrait_source.json").read_text(encoding="utf-8"))
target=root/item["file"]
if not target.is_file():
    request=urllib.request.Request(item["source_url"],headers={"User-Agent":"Mozilla/5.0 (savta-shuli-family-archive)"})
    with urllib.request.urlopen(request,timeout=75) as response:
        data=response.read(10_000_001)
    if not 10000<len(data)<=10_000_000:raise RuntimeError(f"Unexpected portrait bytes: {len(data)}")
    im=Image.open(io.BytesIO(data));im.load()
    if im.format!="PNG" or list(im.size)!=item["expected_dimensions"]:
        raise RuntimeError(f"Unexpected image: {im.format}, {im.size}")
    target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(data)
with Image.open(target) as image:image.verify()
print(f"Yuval's portrait ready: {target}, {target.stat().st_size} bytes")
