#!/usr/bin/env python3
"""Archive the approved Yuval family catchphrase image, with no visual alterations."""
import io,json,urllib.request
from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parents[1]
source=json.loads((root/"scripts/yuval_quote_source.json").read_text(encoding="utf-8"))
path=root/source["file"]
if not path.is_file():
    request=urllib.request.Request(source["source_url"],headers={"User-Agent":"Mozilla/5.0 (savta-shuli-family-archive)"})
    with urllib.request.urlopen(request,timeout=75) as response:
        data=response.read(12_000_001)
    if not 10_000<len(data)<=12_000_000: raise RuntimeError("Unexpected Yuval quote image size")
    image=Image.open(io.BytesIO(data))
    image.load()
    if list(image.size)!=source["expected_dimensions"] or image.format not in ("PNG","JPEG"):
        raise RuntimeError(f"Unexpected Yuval quote image: {image.format}, {image.size}")
    path.parent.mkdir(parents=True,exist_ok=True)
    if image.format=="PNG":
        path.write_bytes(data)
    else:
        # Lossless PNG re-encoding if the uploaded source is stored as JPEG.
        image.save(path,format="PNG")
    print("Archived Yuval quote image:",path,path.stat().st_size)
with Image.open(path) as check:
    if check.format!="PNG" or list(check.size)!=source["expected_dimensions"]:
        raise RuntimeError("Stored quote image is invalid")
    check.verify()
print("Yuval quote image validated")
