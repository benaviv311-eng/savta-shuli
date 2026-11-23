#!/usr/bin/env python3
"""Replace thumbnail-sized Eyal story images with originals already on the site.
The full-resolution historic panels exactly match story panels 2, 3 and 4.
Never upscale thumbnails: use real originals only.
"""
from pathlib import Path
from PIL import Image
import shutil,hashlib
root=Path(__file__).resolve().parents[1]
mapping={2:1,3:2,4:4}
for story,old in mapping.items():
    src=root/f"assets/comics/eyal-panel-{old}.png"
    target=root/f"assets/stories/eyal-memory-{story}.png"
    with Image.open(src) as image:
        image.verify()
    with Image.open(src) as image:
        if image.size!=(1536,1024):raise RuntimeError(f"Unexpected source dimensions: {src} {image.size}")
    shutil.copyfile(src,target)
    print(f"Replaced story panel {story} with exact {src} at 1536x1024 pixels.")
first=root/"assets/stories/eyal-memory-1.png"
with Image.open(first) as im:
    print(f"First panel current dimensions: {im.size}")
