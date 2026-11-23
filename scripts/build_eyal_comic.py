#!/usr/bin/env python3
"""Build Eyal's approved four-panel family comic. The source panels are unmodified."""
from __future__ import annotations
import io
import json
import os
import random
import urllib.request
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT=Path(__file__).resolve().parents[1]
INPUT=ROOT/"scripts/eyal_comic_sources.json"
sources=json.loads(INPUT.read_text(encoding="utf-8"))["sources"]
images=[]
for item in sorted(sources,key=lambda x:x["order"]):
    target=ROOT/item["path"]
    if not target.is_file():
        request=urllib.request.Request(item["url"],headers={"User-Agent":"Mozilla/5.0 (family-album-archival-import)"})
        try:
            with urllib.request.urlopen(request,timeout=60) as resp:
                data=resp.read(15_000_001)
        except Exception as e:
            raise RuntimeError(f"Could not retrieve approved panel {item['order']}") from e
        if len(data)>15_000_000 or len(data)<10_000:
            raise RuntimeError(f"Invalid source size for panel {item['order']}: {len(data)}")
        source=Image.open(io.BytesIO(data))
        source.load()
        if source.size!=(1536,1024):
            raise RuntimeError(f"Unexpected resolution for panel {item['order']}: {source.size}")
        if source.format!="PNG":
            raise RuntimeError(f"Unexpected image format: {source.format}")
        target.parent.mkdir(parents=True,exist_ok=True)
        target.write_bytes(data)   # exact, unchanged image data
        print(f"Imported original panel {item['order']} ({len(data)} bytes)")
    im=Image.open(target)
    im.load()
    if im.size!=(1536,1024) or im.format!="PNG":
        raise RuntimeError(f"Unexpected stored panel: {target.name} {im.size}, {im.format}")
    images.append(im.convert("RGB"))

# Single vertical page: two full-width panels, then two side by side (right-to-left).
W,H=3000,4500
paper=Image.new("RGB",(W,H),(251,246,237))
d=ImageDraw.Draw(paper)
rng=random.Random(41)
for _ in range(3500):
    x=rng.randrange(W);y=rng.randrange(H)
    d.point((x,y),fill=rng.choice([(249,241,231),(246,236,225),(241,233,226),(237,226,215)]))

font_candidates=[
"/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
"/usr/share/fonts/truetype/noto/NotoSansHebrew-Bold.ttf"
]
font_path=next((p for p in font_candidates if Path(p).exists()),None)
if font_path:
    font=ImageFont.truetype(font_path,80)
    sub=ImageFont.truetype(font_path,37)
    d.text((W//2,45),"הפטנט של סבתא",anchor="ma",font=font,fill=(105,57,75),direction="rtl")
    d.text((W//2,151),"הסיפור של אייל וסבתא שולי",anchor="ma",font=sub,fill=(127,97,105),direction="rtl")
else:
    print("Hebrew font not available: leaving heading area blank")
d.line((580,225,2420,225),fill=(218,177,175),width=3)

margin=320
full_w=W-2*margin
gap_y=27
gap_x=24
sizes=[
 (full_w,round(images[0].height*full_w/images[0].width)),
 (full_w,round(images[1].height*full_w/images[1].width)),
]
half_w=(full_w-gap_x)//2
sizes += [(half_w,round(images[i].height*half_w/images[i].width)) for i in (2,3)]
y1=264
y2=y1+sizes[0][1]+gap_y
y3=y2+sizes[1][1]+gap_y
positions=[
 (margin,y1),
 (margin,y2),
 (margin+half_w+gap_x,y3),   # right: panel 3 in Hebrew reading direction
 (margin,y3)                 # left: panel 4
]
max_bottom=max(y+size[1] for (x,y),size in zip(positions,sizes))
if max_bottom > H-45: raise RuntimeError(f"Panel layout overflows page {max_bottom}")

for im,(x,y),(w,h) in zip(images,positions,sizes):
    shadow=Image.new("RGBA",(w+42,h+42),(0,0,0,0))
    sd=ImageDraw.Draw(shadow)
    sd.rectangle((15,14,w+29,h+29),fill=(86,58,54,75))
    shadow=shadow.filter(ImageFilter.GaussianBlur(12))
    paper.paste(shadow,(x-12,y-12),shadow)
    d=ImageDraw.Draw(paper)
    d.rectangle((x-7,y-7,x+w+6,y+h+6),fill=(255,253,250),outline=(109,76,81),width=5)
    # The originals themselves are never cropped. Resizing only fits each panel in its allotted slot.
    paper.paste(im.resize((w,h),Image.Resampling.LANCZOS),(x,y))
    d.rectangle((x-2,y-2,x+w+1,y+h+1),outline=(115,82,82),width=2)

out=ROOT/"eyal-comic-page.png"
paper.save(out,format="PNG",optimize=True,dpi=(300,300))
small=ROOT/"eyal-comic-page.webp"
paper.save(small,format="WEBP",quality=85,method=5)
print(f"Eyal comic page complete: {out.stat().st_size} PNG bytes, {small.stat().st_size} WebP bytes")
