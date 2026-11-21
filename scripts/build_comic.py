#!/usr/bin/env python3
"""Generate Milen's approved 4-panel single-page comic for GitHub Pages.
The 4 embedded illustrated panels are extracted unchanged, never cropped or edited.
Only layout, paper, borders and title are constructed around them.
"""
from pathlib import Path
from io import BytesIO
import base64
import re
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT=Path(__file__).resolve().parents[1]
html="".join((ROOT/"v2/parts"/f"{i:02d}.txt").read_text(encoding="utf-8") for i in range(19))
sources=[]
for key in ("panel1","panel2","panel3","panel4"):
    match=re.search(r'\b'+key+r':"data:image/[^;]+;base64,([A-Za-z0-9+/=]+)"',html)
    if not match:
        raise RuntimeError(f"Missing approved source illustration {key}")
    data=base64.b64decode(match.group(1),validate=True)
    sources.append(Image.open(BytesIO(data)).convert("RGB"))
assert len(sources)==4
W,H=3000,4500
paper=Image.new("RGB",(W,H),(251,246,235))
draw=ImageDraw.Draw(paper)
rng=random.Random(63)
for _ in range(2500):
    px=rng.randrange(W);py=rng.randrange(H)
    col=rng.choice([(246,237,226),(248,239,230),(238,229,221),(251,241,233)])
    draw.point((px,py),fill=col)
for side in (0,1):
    for k in range(15):
        yy=270+k*278
        xx=180 if side==0 else W-180
        c=(223,211,205) if k%3 else (230,212,211)
        draw.arc((xx-50,yy-36,xx+50,yy+38),start=25 if side==0 else 175,end=300 if side==0 else 450,fill=c,width=2)
        draw.line([(xx-9,yy+35),(xx+14,yy+55)],fill=(236,219,209),width=2)
font_paths=[
    "/usr/share/fonts/truetype/noto/NotoSerifHebrew-SemiBold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
]
found=next((p for p in font_paths if Path(p).exists()),None)
if found is None: raise RuntimeError("No Hebrew font installed")
large=ImageFont.truetype(found,92)
small=ImageFont.truetype(found,40)
draw.text((W//2,44),"צמה לכל יום",anchor="ma",font=large,fill=(110,60,77),direction="rtl")
draw.text((W//2,152),"הזיכרון של מילן וסבתא שולי",anchor="ma",font=small,fill=(137,104,109),direction="rtl")
draw.line((710,215,2290,215),fill=(222,185,180),width=3)
for x in (695,2305):
    draw.ellipse((x-7,208,x+7,222),outline=(190,137,148),width=3)

width=2340
left=(W-width)//2
gap_y=27
gap_x=28
sizes=[]
for i,img in enumerate(sources):
    target_w=width if i<2 else (width-gap_x)//2
    sizes.append((target_w,round(img.height*target_w/img.width)))
y1=252
y2=y1+sizes[0][1]+gap_y
y3=y2+sizes[1][1]+gap_y
positions=[
    (left,y1),(left,y2),
    (left+sizes[2][0]+gap_x,y3),
    (left,y3)
]
assert max(y+h for (x,y),(w,h) in zip(positions,sizes)) < H-45
for img,(x,y),(w,h) in zip(sources,positions,sizes):
    shadow=Image.new("RGBA",(w+44,h+48),(0,0,0,0))
    sd=ImageDraw.Draw(shadow)
    sd.rectangle((22,17,w+30,h+25),fill=(78,46,44,78))
    shadow=shadow.filter(ImageFilter.GaussianBlur(13))
    paper.paste(shadow,(x-16,y-14),shadow)
    draw=ImageDraw.Draw(paper)
    draw.rectangle((x-7,y-7,x+w+6,y+h+6),fill=(255,252,247),outline=(105,66,73),width=5)
    paper.paste(img.resize((w,h),Image.Resampling.LANCZOS),(x,y))
    draw.rectangle((x-2,y-2,x+w+1,y+h+1),outline=(108,69,78),width=3)

page=ROOT/"comic-milen.png"
paper.save(page,format="PNG",dpi=(300,300),optimize=True)
paper.save(ROOT/"comic-milen.webp",format="WEBP",quality=89,method=5)
print(f"Created {page} ({page.stat().st_size} bytes) and comic-milen.webp")
