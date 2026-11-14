"""Generate 15 table QR labels for the deployed Velvet Cafe & Grill ordering site.

Run from the project root:
  python scripts/generate_qr.py --base-url https://your-real-domain.example

For local-only testing, use --base-url http://localhost:3000. Those codes will
NOT work from customers' phones; regenerate after deployment.
"""
import argparse, os
from pathlib import Path
import qrcode
from PIL import Image, ImageDraw, ImageFont
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

parser = argparse.ArgumentParser()
parser.add_argument('--base-url', required=True, help='Public HTTPS site URL (or localhost for local testing)')
parser.add_argument('--out', default='public/qr')
args = parser.parse_args()
base = args.base_url.rstrip('/')
if not (base.startswith('https://') or base.startswith('http://localhost')):
    raise SystemExit('Use your real https:// domain. http:// is allowed only for localhost testing.')
os.makedirs(args.out, exist_ok=True)
font_candidates = [
    '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
    'C:/Windows/Fonts/arialbd.ttf',
    '/Library/Fonts/Arial Bold.ttf',
]
font_path = next((x for x in font_candidates if os.path.exists(x)), None)
try:
    title_font = ImageFont.truetype(font_path, 27) if font_path else ImageFont.load_default()
    small_font = ImageFont.truetype(font_path, 16) if font_path else ImageFont.load_default()
except Exception:
    title_font = small_font = ImageFont.load_default()
files=[]
for n in range(1,16):
    url=f'{base}/table/{n}'
    qr=qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=12, border=3)
    qr.add_data(url); qr.make(fit=True)
    qr_img=qr.make_image(fill_color='#173d30', back_color='white').convert('RGB')
    card=Image.new('RGB',(560,680),'white'); draw=ImageDraw.Draw(card)
    draw.rounded_rectangle((8,8,552,672),radius=28,outline='#dce8e0',width=4)
    draw.text((280,45),'VELVET CAFE & GRILL',font=title_font,fill='#173d30',anchor='mm')
    draw.text((280,88),'SCAN TO ORDER',font=small_font,fill='#718078',anchor='mm')
    qr_img.thumbnail((420,420)); card.paste(qr_img,((560-qr_img.width)//2,130))
    draw.text((280,590),f'TABLE {n:02d}',font=title_font,fill='#173d30',anchor='mm')
    draw.text((280,632),'Freshly made. Just for you.',font=small_font,fill='#718078',anchor='mm')
    path=os.path.join(args.out,f'velvet-table-{n:02d}.png')
    card.save(path,dpi=(300,300)); files.append(path)
W,H=A4; pdf=os.path.join(args.out,'Velvet-Cafe-Grill-15-Table-QR.pdf')
c=canvas.Canvas(pdf,pagesize=A4); margin=22; gap=10
cw=(W-2*margin-2*gap)/3; ch=(H-2*margin-4*gap)/5
for i,path in enumerate(files):
    col=i%3; row=i//3; x=margin+col*(cw+gap); y=H-margin-(row+1)*ch-row*gap
    c.setStrokeColorRGB(.83,.89,.85); c.roundRect(x,y,cw,ch,8,stroke=1,fill=0)
    c.setFillColorRGB(.09,.24,.19); c.setFont('Helvetica-Bold',9); c.drawCentredString(x+cw/2,y+ch-18,'VELVET CAFE & GRILL')
    c.setFillColorRGB(.4,.48,.44); c.setFont('Helvetica',7); c.drawCentredString(x+cw/2,y+ch-29,'SCAN TO ORDER')
    c.drawImage(path,x+cw*.15,y+ch*.19,width=cw*.7,height=cw*.7,preserveAspectRatio=True,anchor='c',mask='auto')
    c.setFillColorRGB(.09,.24,.19); c.setFont('Helvetica-Bold',11); c.drawCentredString(x+cw/2,y+7,f'TABLE {i+1:02d}')
c.save()
print(f'Generated 15 QR PNG files and {pdf}')
print(f'QR target base URL: {base}')
