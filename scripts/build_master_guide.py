# -*- coding: utf-8 -*-
"""
MuleSoo Digital Services — Corporate Website Master Guide
A client-friendly, fill-in questionnaire PDF with premium branding,
corporate stamp/seal, and a MuleSoo watermark on every page.
"""
import math
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, Color
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.lib.utils import ImageReader

# Real MuleSoo logo mark (tightly-trimmed, transparent background)
LOGO_PATH = "c:/Users/mule/OneDrive/Desktop/mulesoo/public/mulesoo-logo-icon-trim.png"
_LOGO = ImageReader(LOGO_PATH)
_LOGO_W, _LOGO_H = _LOGO.getSize()          # 400 x 254
_LOGO_ASPECT = _LOGO_W / _LOGO_H

# ----------------------------------------------------------------------------
# Fonts
# ----------------------------------------------------------------------------
F = "C:/Windows/Fonts/"
pdfmetrics.registerFont(TTFont("Sans",       F + "segoeui.ttf"))
pdfmetrics.registerFont(TTFont("Sans-Bold",  F + "segoeuib.ttf"))
pdfmetrics.registerFont(TTFont("Sans-Light", F + "segoeuil.ttf"))
pdfmetrics.registerFont(TTFont("Sans-Ital",  F + "segoeuii.ttf"))
pdfmetrics.registerFont(TTFont("Serif",      F + "georgia.ttf"))
pdfmetrics.registerFont(TTFont("Serif-Bold", F + "georgiab.ttf"))
pdfmetrics.registerFont(TTFont("Serif-Ital", F + "georgiai.ttf"))

# ----------------------------------------------------------------------------
# Brand palette
# ----------------------------------------------------------------------------
BG_DARK   = HexColor("#050810")
BG_DARK2  = HexColor("#0C1428")
CARD      = HexColor("#0D1528")
BLUE      = HexColor("#00C8FF")
BLUE_DEEP = HexColor("#0784B0")   # readable blue on white
PURPLE    = HexColor("#7B2FFF")
GOLD      = HexColor("#E8B84B")
GOLD_DEEP = HexColor("#9C7A1E")   # readable gold on white
GREEN     = HexColor("#00B36B")
INK       = HexColor("#141A2C")   # body text on light pages
MUTED     = HexColor("#5B6479")
FAINT     = HexColor("#9AA3B5")
LINE      = HexColor("#D5DBE6")   # write-line grey
BOXLINE   = HexColor("#AEB7C8")   # checkbox outline
PAGE_BG   = HexColor("#FCFDFF")
BAND_BG   = HexColor("#F2F5FB")
WATER     = HexColor("#EEF1F7")
FIELD_BG  = HexColor("#EEF4FF")   # fillable form-field background
WHITE     = HexColor("#FFFFFF")

# ----------------------------------------------------------------------------
# Geometry
# ----------------------------------------------------------------------------
PW, PH = A4
LM, RM = 52, 52
TOP    = PH - 92          # first content baseline area
BOTTOM = 70
CW     = PW - LM - RM     # content width


# ----------------------------------------------------------------------------
# Low-level helpers
# ----------------------------------------------------------------------------
def wrap(text, font, size, maxw):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        test = w if not cur else cur + " " + w
        if stringWidth(test, font, size) <= maxw:
            cur = test
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def lerp_color(c1, c2, t):
    return Color(c1.red + (c2.red - c1.red) * t,
                 c1.green + (c2.green - c1.green) * t,
                 c1.blue + (c2.blue - c1.blue) * t)


def v_gradient(c, x, y, w, h, c1, c2, steps=120):
    """Vertical gradient rectangle (c1 top -> c2 bottom)."""
    sh = h / steps
    for i in range(steps):
        t = i / (steps - 1)
        c.setFillColor(lerp_color(c1, c2, t))
        c.rect(x, y + h - (i + 1) * sh, w, sh + 0.8, stroke=0, fill=1)


def h_gradient_text(c, x, y, text, font, size, c1, c2):
    """Draw text with a left->right colour gradient by tinting each glyph."""
    n = len(text)
    cx = x
    for i, ch in enumerate(text):
        t = i / max(1, n - 1)
        c.setFillColor(lerp_color(c1, c2, t))
        c.setFont(font, size)
        c.drawString(cx, y, ch)
        cx += stringWidth(ch, font, size)


def soft_glow(c, cx, cy, r, base, max_alpha=0.11, rings=18):
    """Soft radial glow built from overlapping translucent circles."""
    a = max_alpha / rings * 2.2
    c.saveState()
    for i in range(rings):
        rr = r * (1 - i / rings)
        c.setFillColor(Color(base.red, base.green, base.blue, a))
        c.circle(cx, cy, rr, stroke=0, fill=1)
    c.restoreState()


def logo(c, x, y, size=15, dark=True):
    """MULE(dot)SOO wordmark. Returns width. y = baseline."""
    c.setFont("Sans-Bold", size)
    c.setFillColor(BLUE)
    c.drawString(x, y, "MULE")
    w1 = stringWidth("MULE", "Sans-Bold", size)
    dot_r = size * 0.11
    dcx = x + w1 + size * 0.16
    c.setFillColor(GOLD)
    c.circle(dcx, y + size * 0.33, dot_r, stroke=0, fill=1)
    x2 = dcx + size * 0.16 + dot_r
    c.setFillColor(HexColor("#F0F2FA") if dark else INK)
    c.drawString(x2, y, "SOO")
    w2 = stringWidth("SOO", "Sans-Bold", size)
    return (x2 + w2) - x


def emblem(c, cx, cy, r, color, lw=1.4):
    """Ethiopian-inspired 8-point starburst / cross motif."""
    c.setStrokeColor(color)
    c.setLineWidth(lw)
    for k in range(8):
        a = math.radians(k * 45)
        r0 = r * 0.32
        c.line(cx + r0 * math.cos(a), cy + r0 * math.sin(a),
               cx + r * math.cos(a), cy + r * math.sin(a))
    c.circle(cx, cy, r * 0.30, stroke=1, fill=0)
    c.circle(cx, cy, r * 0.12, stroke=1, fill=0)


def circular_text(c, cx, cy, radius, text, font, size, color,
                  center_angle=90, clockwise=True, letter_gap=1.0):
    """Draw text along a circular arc, centered on center_angle (degrees)."""
    c.setFillColor(color)
    widths = [stringWidth(ch, font, size) * letter_gap for ch in text]
    total_arc = sum(w / radius for w in widths)  # radians
    direction = -1 if clockwise else 1
    ang = math.radians(center_angle) - direction * total_arc / 2.0
    for ch, w in zip(text, widths):
        step = w / radius
        ang += direction * step / 2.0
        gx = cx + radius * math.cos(ang)
        gy = cy + radius * math.sin(ang)
        c.saveState()
        c.translate(gx, gy)
        rot = math.degrees(ang) - 90 if clockwise else math.degrees(ang) + 90
        c.rotate(rot)
        c.setFont(font, size)
        c.drawCentredString(0, 0, ch)
        c.restoreState()
        ang += direction * step / 2.0


def _seal_diamond(c, cx, cy, s, color):
    c.saveState()
    c.setFillColor(color)
    c.translate(cx, cy)
    c.rotate(45)
    c.rect(-s, -s, 2 * s, 2 * s, stroke=0, fill=1)
    c.restoreState()


def credit_seal(c, cx, cy, r, dark=False, alpha=1.0, logo=True):
    """Corporate 'Designed & built by MuleSoo' credit seal with the real logo.

    Rings, text band and centred logo are laid out so the circular text never
    touches either ring. Two palettes: `dark` for dark backgrounds (gold ring,
    warm ivory text), otherwise a deep gold/navy palette for light pages.
    """
    if dark:
        ring, txt, acc = GOLD, HexColor("#EFE6C9"), GOLD
    else:
        ring, txt, acc = GOLD_DEEP, HexColor("#243049"), GOLD_DEEP

    c.saveState()
    if alpha < 1.0:
        c.setFillAlpha(alpha)
        c.setStrokeAlpha(alpha)

    # --- rings ---
    c.setStrokeColor(ring)
    c.setLineWidth(max(0.5, r * 0.050))
    c.circle(cx, cy, r, stroke=1, fill=0)                 # bold outer
    c.setLineWidth(max(0.3, r * 0.012))
    c.circle(cx, cy, r * 0.92, stroke=1, fill=0)          # hairline inner-of-outer
    c.setLineWidth(max(0.3, r * 0.016))
    c.circle(cx, cy, r * 0.58, stroke=1, fill=0)          # ring around the logo

    # --- circular text (sits in the clear band 0.58r .. 0.92r) ---
    tr = r * 0.75
    circular_text(c, cx, cy, tr, "DESIGNED  &  BUILT  BY  MULESOO",
                  "Sans-Bold", r * 0.108, txt,
                  center_angle=90, clockwise=True, letter_gap=1.06)
    circular_text(c, cx, cy, tr, "DIGITAL  SERVICES  ·  MULESOO.COM",
                  "Sans", r * 0.098, txt,
                  center_angle=270, clockwise=False, letter_gap=1.06)

    # --- side separators ---
    for a in (0, 180):
        ar = math.radians(a)
        _seal_diamond(c, cx + tr * math.cos(ar), cy + tr * math.sin(ar),
                      r * 0.035, acc)

    # --- centred real logo (transparent) ---
    if logo:
        lw = r * 0.92
        lh = lw / _LOGO_ASPECT
        c.drawImage(_LOGO, cx - lw / 2, cy - lh / 2, lw, lh,
                    mask="auto", preserveAspectRatio=True)
    c.restoreState()


# ============================================================================
# Document builder
# ============================================================================
class Guide:
    def __init__(self, path):
        self.c = canvas.Canvas(path, pagesize=A4)
        self.c.setTitle("MuleSoo Corporate Website Master Guide")
        self.c.setAuthor("MuleSoo Digital Services")
        self.c.setSubject("Client Website Requirements Questionnaire")
        self.page = 0
        self.y = TOP
        self.section = ""
        self.fld = 0            # unique form-field counter
        # ask viewers to render field appearances (typed text / ticks)
        try:
            self.c.acroForm.needAppearances = "true"
        except Exception:
            pass

    # ---- page furniture ----
    def _page_bg(self):
        c = self.c
        c.setFillColor(PAGE_BG)
        c.rect(0, 0, PW, PH, stroke=0, fill=1)
        # watermark: big diagonal wordmark
        c.saveState()
        c.translate(PW / 2, PH / 2)
        c.rotate(32)
        c.setFont("Sans-Bold", 74)
        c.setFillColor(WATER)
        c.drawCentredString(0, 40, "MULESOO")
        c.setFont("Sans", 20)
        c.drawCentredString(0, 4, "DIGITAL  SERVICES")
        c.restoreState()

    def _header(self):
        c = self.c
        logo(c, LM, PH - 52, size=14, dark=False)
        c.setFont("Sans", 8.5)
        c.setFillColor(MUTED)
        c.drawRightString(PW - RM, PH - 50, self.section.upper())
        c.setStrokeColor(LINE)
        c.setLineWidth(0.8)
        c.line(LM, PH - 64, PW - RM, PH - 64)
        # gold accent tick
        c.setStrokeColor(GOLD_DEEP)
        c.setLineWidth(2)
        c.line(LM, PH - 64, LM + 46, PH - 64)

    def _footer(self):
        c = self.c
        seal_cx, seal_cy, seal_r = PW - RM - 27, 41, 27
        # rule stops short of the seal, which breaks the line (corporate look)
        c.setStrokeColor(LINE)
        c.setLineWidth(0.8)
        c.line(LM, 52, seal_cx - seal_r - 10, 52)
        c.setFont("Sans", 8)
        c.setFillColor(MUTED)
        c.drawString(LM, 40, "MuleSoo Digital Services  ·  Corporate Website Master Guide")
        c.setFont("Sans", 7.5)
        c.drawString(LM, 28, "mulesoo.com")
        c.setFont("Sans-Bold", 8)
        c.setFillColor(MUTED)
        c.drawString(LM + 60, 28, f"Page {self.page}")
        # per-page corporate credit seal (real logo)
        credit_seal(c, seal_cx, seal_cy, seal_r, dark=False)

    def new_page(self, section=None):
        if section is not None:
            self.section = section
        if self.page > 0:
            self.c.showPage()
        self.page += 1
        self._page_bg()
        self._header()
        self._footer()
        self.y = PH - 92

    def space(self, h):
        if self.y - h < BOTTOM + 8:
            self.new_page()

    # ---- content blocks ----
    def section_title(self, num, title, subtitle=""):
        self.space(78)
        c = self.c
        y = self.y
        # number badge (gradient pill)
        bw, bh = 44, 30
        v_gradient(c, LM, y - bh + 8, bw, bh, BLUE, PURPLE, steps=40)
        if num == 0:
            emblem(c, LM + bw / 2, y - 2, 9, HexColor("#FFFFFF"), lw=1.3)
        else:
            c.setFillColor(HexColor("#FFFFFF"))
            c.setFont("Sans-Bold", 17)
            c.drawCentredString(LM + bw / 2, y - 8, str(num))
        # title
        c.setFillColor(INK)
        c.setFont("Sans-Bold", 19)
        c.drawString(LM + bw + 14, y - 5, title)
        yy = y - 5 - 22
        if subtitle:
            c.setFont("Serif-Ital", 11.5)
            c.setFillColor(MUTED)
            for ln in wrap(subtitle, "Serif-Ital", 11.5, CW - bw - 14):
                c.drawString(LM + bw + 14, yy, ln)
                yy -= 15
        # under rule
        rule_y = min(y - bh + 2, yy - 4)
        c.setStrokeColor(GOLD_DEEP)
        c.setLineWidth(1.4)
        c.line(LM, rule_y, PW - RM, rule_y)
        self.y = rule_y - 22

    def sub(self, text):
        self.space(30)
        c = self.c
        c.setFillColor(BLUE_DEEP)
        c.setFont("Sans-Bold", 12.5)
        c.drawString(LM, self.y, text)
        self.y -= 19

    def para(self, text, color=INK, font="Sans", size=10.5, gap=4, lead=14.5):
        for ln in wrap(text, font, size, CW):
            self.space(lead)
            self.c.setFillColor(color)
            self.c.setFont(font, size)
            self.c.drawString(LM, self.y, ln)
            self.y -= lead
        self.y -= gap

    def question(self, text):
        self.y -= 9          # breathing room above each new question
        self.space(20)
        c = self.c
        # small blue diamond marker
        c.setFillColor(BLUE_DEEP)
        cy = self.y + 3.4
        c.saveState(); c.translate(LM + 3, cy); c.rotate(45)
        c.rect(-2.4, -2.4, 4.8, 4.8, stroke=0, fill=1); c.restoreState()
        indent = LM + 16
        c.setFont("Sans-Bold", 10.8)
        c.setFillColor(INK)
        lines = wrap(text, "Sans-Bold", 10.8, CW - 16)
        for i, ln in enumerate(lines):
            if i > 0:
                self.space(14)
            c.setFont("Sans-Bold", 10.8)
            c.setFillColor(INK)
            c.drawString(indent, self.y, ln)
            self.y -= 15
        self.y -= 2

    def choices(self, options, cols=2, boxed=True):
        colw = CW / cols
        rows = math.ceil(len(options) / cols)
        for r in range(rows):
            self.space(17)
            rowy = self.y
            for ccol in range(cols):
                idx = r * cols + ccol
                if idx >= len(options):
                    continue
                x = LM + ccol * colw
                self._checkbox(x + 2, rowy - 8.5, options[idx], colw - 14)
            self.y = rowy - 17
        self.y -= 7

    def _checkbox(self, x, y, label, maxw):
        c = self.c
        s = 11
        # interactive checkbox — ticks when the client clicks it
        self.fld += 1
        c.acroForm.checkbox(
            name=f"cb{self.fld}", x=x, y=y - 1, size=s,
            buttonStyle="check", shape="square", borderStyle="solid",
            borderColor=BOXLINE, fillColor=FIELD_BG, textColor=BLUE_DEEP,
            borderWidth=1, forceBorder=True,
            tooltip=label if isinstance(label, str) else "")
        c.setFont("Sans", 10)
        c.setFillColor(INK)
        txt = label
        while stringWidth(txt, "Sans", 10) > maxw - (s + 9) and len(txt) > 4:
            txt = txt[:-2]
        if txt != label:
            txt = txt.rstrip() + "…"
        c.drawString(x + s + 8, y + 1, txt)

    def bullet(self, text, mark="✓", mcolor=GREEN):
        for i, ln in enumerate(wrap(text, "Sans", 10.3, CW - 18)):
            self.space(14)
            c = self.c
            if i == 0:
                c.setFillColor(mcolor)
                c.setFont("Sans-Bold", 10.3)
                c.drawString(LM + 2, self.y, mark)
            c.setFillColor(INK)
            c.setFont("Sans", 10.3)
            c.drawString(LM + 18, self.y, ln)
            self.y -= 14.5
        self.y -= 1

    def write_lines(self, n=2, label=None, gap=19):
        if label:
            self.space(14)
            self.c.setFont("Sans-Ital", 9)
            self.c.setFillColor(FAINT)
            self.c.drawString(LM, self.y, label)
            self.y -= 14
        h = n * gap
        self.space(h + 8)
        top = self.y + 4
        bottom = top - h
        # interactive text box — client clicks and types directly here
        self.fld += 1
        self.c.acroForm.textfield(
            name=f"tx{self.fld}", x=LM, y=bottom, width=CW, height=h,
            fontName="Helvetica", fontSize=10.5,
            borderColor=LINE, fillColor=FIELD_BG, textColor=INK,
            borderWidth=0.8, borderStyle="solid", forceBorder=True,
            fieldFlags="multiline" if n > 1 else "")
        self.y = bottom - 8

    def note_box(self, title, body_lines, accent=BLUE_DEEP):
        # estimate height
        wrapped = []
        for b in body_lines:
            wrapped.extend(wrap(b, "Sans", 10, CW - 40))
        h = 26 + len(wrapped) * 14 + 12
        self.space(h + 6)
        c = self.c
        x, y = LM, self.y - h
        c.setFillColor(BAND_BG)
        c.roundRect(x, y, CW, h, 8, stroke=0, fill=1)
        c.setFillColor(accent)
        c.roundRect(x, y, 5, h, 2, stroke=0, fill=1)
        ty = self.y - 20
        c.setFont("Sans-Bold", 11)
        c.setFillColor(accent)
        c.drawString(x + 18, ty, title)
        ty -= 17
        c.setFont("Sans", 10)
        c.setFillColor(INK)
        for ln in wrapped:
            c.drawString(x + 18, ty, ln)
            ty -= 14
        self.y = y - 14

    def gap(self, h):
        self.y -= h

    # ---- special full pages ----
    def cover(self):
        self.page += 1
        c = self.c
        v_gradient(c, 0, 0, PW, PH, HexColor("#070B18"), HexColor("#0B1122"))
        # soft ambient glows (kept clear of the centred logo/title)
        soft_glow(c, PW * 0.02, PH * 1.00, 190, BLUE, max_alpha=0.10)
        soft_glow(c, PW * 0.98, PH * 0.86, 200, PURPLE, max_alpha=0.10)
        soft_glow(c, PW * 0.5, 300, 150, BLUE, max_alpha=0.06)
        # border frame
        c.setStrokeColor(HexColor("#1E2A45"))
        c.setLineWidth(1)
        c.rect(30, 30, PW - 60, PH - 60, stroke=1, fill=0)
        c.setStrokeColor(GOLD)
        c.setLineWidth(1.4)
        c.rect(38, 38, PW - 76, PH - 76, stroke=1, fill=0)
        # corner emblems
        for (ex, ey) in [(38, 38), (PW - 38, 38), (38, PH - 38), (PW - 38, PH - 38)]:
            emblem(c, ex, ey, 14, GOLD, lw=1.0)

        # logo lockup
        lw = stringWidth("MULE", "Sans-Bold", 34) + stringWidth("SOO", "Sans-Bold", 34) + 34 * 0.5
        lx = (PW - lw) / 2
        logo(c, lx, PH - 165, size=34, dark=True)
        c.setFont("Sans", 11)
        c.setFillColor(FAINT)
        c.drawCentredString(PW / 2, PH - 190, "D I G I T A L   S E R V I C E S")

        # divider
        c.setStrokeColor(GOLD)
        c.setLineWidth(1)
        c.line(PW / 2 - 60, PH - 210, PW / 2 + 60, PH - 210)
        emblem(c, PW / 2, PH - 210, 8, GOLD, lw=0.9)

        # title
        c.setFont("Serif-Ital", 15)
        c.setFillColor(GOLD)
        c.drawCentredString(PW / 2, PH - 262, "The Corporate")
        h_size = 46
        t1 = "WEBSITE MASTER"
        t2 = "GUIDE"
        c.setFont("Sans-Bold", h_size)
        c.setFillColor(HexColor("#F0F2FA"))
        c.drawCentredString(PW / 2, PH - 312, t1)
        # gradient GUIDE
        gw = stringWidth(t2, "Sans-Bold", h_size)
        h_gradient_text(c, (PW - gw) / 2, PH - 362, t2, "Sans-Bold", h_size, BLUE, PURPLE)

        c.setFont("Serif-Ital", 15.5)
        c.setFillColor(HexColor("#C7CEDE"))
        c.drawCentredString(PW / 2, PH - 398,
                            "A simple, guided questionnaire for your new website.")
        c.setFont("Sans", 11)
        c.setFillColor(FAINT)
        for i, ln in enumerate([
            "No technical knowledge needed. Just tick the boxes,",
            "answer easy questions, and fill in the blanks."]):
            c.drawCentredString(PW / 2, PH - 420 - i * 16, ln)

        # big central seal
        credit_seal(c, PW / 2, 300, 92, dark=True)

        # prepared-for band
        by = 150
        c.setFillColor(HexColor("#0E1830"))
        c.roundRect(PW / 2 - 190, by - 34, 380, 58, 10, stroke=0, fill=1)
        c.setStrokeColor(HexColor("#243357")); c.setLineWidth(1)
        c.roundRect(PW / 2 - 190, by - 34, 380, 58, 10, stroke=1, fill=0)
        c.setFont("Sans", 9)
        c.setFillColor(FAINT)
        c.drawCentredString(PW / 2, by + 6, "PREPARED FOR")
        # fillable company-name field
        fw = 300
        self.fld += 1
        c.acroForm.textfield(
            name=f"tx{self.fld}", x=PW / 2 - fw / 2, y=by - 20, width=fw, height=20,
            fontName="Helvetica", fontSize=12,
            borderColor=GOLD, fillColor=HexColor("#16223E"),
            textColor=HexColor("#F0F2FA"), borderWidth=0.8,
            borderStyle="underlined", forceBorder=True,
            tooltip="Type your company name")
        c.setFont("Sans-Ital", 8.5)
        c.setFillColor(FAINT)
        c.drawCentredString(PW / 2, by - 30, "(click and type your company name)")

        # footer tagline
        c.setFont("Serif-Ital", 12)
        c.setFillColor(GOLD)
        c.drawCentredString(PW / 2, 74,
                            "“World-class digital products for Africa’s boldest businesses.”")
        c.setFont("Sans", 8.5)
        c.setFillColor(FAINT)
        c.drawCentredString(PW / 2, 56, "Pretoria, South Africa   •   hello@mulesoo.com   •   mulesoo.com")

    def back_cover(self):
        self.c.showPage()
        self.page += 1
        c = self.c
        v_gradient(c, 0, 0, PW, PH, HexColor("#070B18"), HexColor("#0B1122"))
        c.setStrokeColor(GOLD); c.setLineWidth(1.4)
        c.rect(38, 38, PW - 76, PH - 76, stroke=1, fill=0)
        for (ex, ey) in [(38, 38), (PW - 38, 38), (38, PH - 38), (PW - 38, PH - 38)]:
            emblem(c, ex, ey, 14, GOLD, lw=1.0)

        lw = logo(c, 0, -999, size=30)  # measure only (offscreen)
        lx = (PW - lw) / 2
        logo(c, lx, PH - 200, size=30, dark=True)

        c.setFont("Serif-Ital", 17)
        c.setFillColor(GOLD)
        c.drawCentredString(PW / 2, PH - 250, "Ready to build something the world will notice?")

        lines = [
            ("Once you’ve completed this guide — or generated your", FAINT),
            ("customised requirements PDF with an AI tool — send it to us.", FAINT),
            ("We’ll turn it into a real, world-class website.", FAINT),
        ]
        yy = PH - 288
        c.setFont("Sans", 12)
        for t, col in lines:
            c.setFillColor(col)
            c.drawCentredString(PW / 2, yy, t)
            yy -= 20

        # contact card
        cardw, cardh = 380, 150
        cx0 = (PW - cardw) / 2
        cy0 = PH / 2 - 150
        c.setFillColor(HexColor("#0E1830"))
        c.roundRect(cx0, cy0, cardw, cardh, 14, stroke=0, fill=1)
        c.setStrokeColor(HexColor("#243357")); c.setLineWidth(1)
        c.roundRect(cx0, cy0, cardw, cardh, 14, stroke=1, fill=0)
        items = [
            ("Email", "hello@mulesoo.com"),
            ("WhatsApp", "+27 — chat with us anytime"),
            ("Website", "mulesoo.com"),
            ("Location", "Pretoria, South Africa"),
        ]
        iy = cy0 + cardh - 30
        for lab, val in items:
            c.setFont("Sans-Bold", 10)
            c.setFillColor(BLUE)
            c.drawString(cx0 + 28, iy, lab.upper())
            c.setFont("Sans", 11)
            c.setFillColor(HexColor("#F0F2FA"))
            c.drawRightString(cx0 + cardw - 28, iy, val)
            iy -= 30

        credit_seal(c, PW / 2, 190, 66, dark=True)
        c.setFont("Sans", 9)
        c.setFillColor(FAINT)
        c.drawCentredString(PW / 2, 74, "© 2025 MuleSoo Digital Services. All rights reserved.")
        c.setFont("Serif-Ital", 10)
        c.setFillColor(GOLD)
        c.drawCentredString(PW / 2, 58, "Built with precision. Delivered with pride.")

    def save(self):
        self.c.showPage()
        self.c.save()


# ============================================================================
# Build the document content
# ============================================================================
def build(path):
    g = Guide(path)
    g.cover()

    # ---------- Welcome / How to use ----------
    g.new_page("Welcome")
    g.section_title(0, "Welcome — Let’s Plan Your Website",
                    "This guide does the thinking for you. Answer in plain words.")
    g.para("You don’t need to know anything about websites, code, or design to use this "
           "guide. We’ve turned everything a developer needs to know into simple questions "
           "with tick-boxes and blank spaces. Just answer what you can — if you’re unsure "
           "about a question, leave it blank and we’ll help you decide together.")
    g.para("There are two easy ways to use this document:", font="Sans-Bold", size=11, color=INK)

    g.note_box("Option A — Fill it in right on your computer (no printing needed)",
               ["1.  Open this PDF in any free reader (Adobe Acrobat Reader, or your browser).",
                "2.  Click any box to tick it ✓, and click any shaded space to type your answer.",
                "3.  Save the PDF, then email it back to MuleSoo. That’s it — we take it from there."],
               accent=BLUE_DEEP)
    g.note_box("Option B — Let an AI tool interview you (fastest)",
               ["1.  Upload this PDF to any AI assistant (ChatGPT, Claude, Gemini, Copilot, etc.).",
                "2.  Paste the instruction shown on the “For Your AI Tool” page (near the end).",
                "3.  The AI will ask you these questions one by one, in plain language.",
                "4.  Download the finished “Website Requirements PDF” it creates, and send it to us."],
               accent=PURPLE)
    g.para("Either way, the result is the same: a clear picture of the website you want, so "
           "MuleSoo can build the right thing the first time — on time and on budget.",
           color=MUTED, font="Sans-Ital")

    # ---------- 1. About your business ----------
    g.new_page("Section 1 — About You")
    g.section_title(1, "About Your Business",
                    "Tell us who you are, in your own words.")
    g.question("What is your business name?")
    g.write_lines(1)
    g.question("In one or two sentences, what does your business do, and who do you help?")
    g.write_lines(2)
    g.question("Where are you based, and which areas do you serve?")
    g.write_lines(1)
    g.question("Which best describes your business? (tick one or more)")
    g.choices(["Products (a shop)", "Services", "Events / hospitality",
               "Professional / consulting", "Non-profit / community", "Other"], cols=3)
    g.question("How would you describe the size of your business?")
    g.choices(["Just me / solo", "Small team (2–10)", "Growing (11–50)", "Established (50+)"], cols=2)
    g.question("Do you already have a website? If yes, write the web address (URL).")
    g.choices(["No — this is my first website", "Yes — I want a redesign"], cols=2)
    g.write_lines(1, label="If yes, current website address:")

    # ---------- 2. Your goals ----------
    g.new_page("Section 2 — Your Goals")
    g.section_title(2, "What Do You Want the Website to Do?",
                    "A website should have a job. What is its main job for you?")
    g.question("What is the MAIN thing you want your website to achieve? (tick your top choice)")
    g.choices(["Get enquiries / leads", "Sell products online", "Show my work / portfolio",
               "Build trust & credibility", "Take bookings / appointments",
               "Share information", "Grow an audience", "Other"], cols=2)
    g.question("Pick any other goals that matter to you: (tick all that apply)")
    g.choices(["Look professional & premium", "Rank on Google (be found)",
               "Collect email sign-ups", "Let customers download files/brochures",
               "Reduce phone calls with an FAQ", "Accept online payments",
               "Recruit / show job openings", "Add an AI chatbot assistant"], cols=2)
    g.question("How will you know the website is a success in 6–12 months?")
    g.write_lines(2, label="e.g. “20 enquiries a month,” “sell 50 items,” “look credible to big clients.”")
    g.question("Is there a launch date or deadline we should know about?")
    g.choices(["No rush", "Within 2 weeks", "Within 1 month", "Specific date →"], cols=2)
    g.write_lines(1, label="Important date / reason (event, campaign, launch):")

    # ---------- 3. Your customers ----------
    g.new_page("Section 3 — Your Customers")
    g.section_title(3, "Who Are Your Customers?",
                    "The better we know them, the better the website speaks to them.")
    g.question("Describe your ideal customer in a sentence (who they are, what they need).")
    g.write_lines(2)
    g.question("Why do people come to you? What problem are you solving for them?")
    g.write_lines(2)
    g.question("What do you most want a visitor to DO on your website? (tick your top 2)")
    g.choices(["Call or WhatsApp me", "Fill in a contact form", "Buy something",
               "Book a call / appointment", "Download a guide or menu",
               "Read reviews / see my work", "Sign up to a newsletter"], cols=2)
    g.question("List 2–3 websites you like (competitors or not) and what you like about them.")
    g.write_lines(3, label="Website + what you like (design, colours, how easy it is, etc.)")
    g.question("What words might someone type into Google to find a business like yours?")
    g.write_lines(2, label="e.g. “Ethiopian caterer Pretoria,” “affordable logo design South Africa.”")

    # ---------- 4. Pages ----------
    g.new_page("Section 4 — Your Pages")
    g.section_title(4, "Which Pages Do You Need?",
                    "Think of pages as the rooms of your website. Tick the ones you want.")
    g.para("Don’t worry about getting this perfect — we’ll advise you. Just tick what feels right.",
           color=MUTED, font="Sans-Ital")
    g.sub("Common pages")
    g.choices(["Home (the front page)", "About us / our story",
               "Services / what we offer", "Products / shop",
               "Portfolio / our work", "Pricing / packages",
               "Testimonials / reviews", "Gallery / photos",
               "Blog / news", "FAQ (common questions)",
               "Contact us", "Book now / appointments"], cols=2)
    g.sub("Extra pages (only if you need them)")
    g.choices(["Team / staff", "Careers / jobs", "Case studies",
               "Downloads / resources", "Events", "Privacy & terms (we add these for you)"], cols=2)
    g.question("Any other page you have in mind? Write it here.")
    g.write_lines(2)
    g.question("Roughly how many pages do you imagine in total?")
    g.choices(["Small (1–3 pages)", "Standard (4–6 pages)",
               "Larger (7–10 pages)", "Big site (10+ pages)"], cols=2)

    # ---------- 5. Look & feel ----------
    g.new_page("Section 5 — Look & Feel")
    g.section_title(5, "How Should It Look & Feel?",
                    "Your website should feel like YOU. Let’s capture the vibe.")
    g.question("Which style feels most like your brand? (tick one or two)")
    g.choices(["Modern & sleek", "Minimal & clean", "Bold & colourful",
               "Elegant & luxury", "Corporate & trustworthy", "Warm & friendly",
               "Tech / futuristic", "Traditional / classic"], cols=2)
    g.question("What feeling should visitors get? (tick all that apply)")
    g.choices(["Trust", "Premium / high-end", "Innovation", "Reliability",
               "Friendliness", "Excitement", "Calm / simplicity", "Exclusivity"], cols=2)
    g.question("Do you have brand colours already? Write them (or describe them).")
    g.write_lines(1, label="Colour names or codes (e.g. deep blue, gold) — and any colours to AVOID:")
    g.question("Do you have a logo?")
    g.choices(["Yes — I’ll send the files", "I have one but it needs a refresh",
               "No — I’d like MuleSoo to design one"], cols=1)
    g.question("Do you have fonts or a tagline that must be used?")
    g.write_lines(1)
    g.question("Light background or dark background?")
    g.choices(["Light & bright", "Dark & premium", "Not sure — you decide"], cols=3)

    # ---------- 6. Features ----------
    g.new_page("Section 6 — Features")
    g.section_title(6, "What Should the Website Be Able to Do?",
                    "Tick the tools and features you’d like. Unsure? Leave it — we’ll advise.")
    g.sub("Getting in touch & leads")
    g.choices(["Contact form", "WhatsApp button", "Click-to-call",
               "Quote request form", "Newsletter sign-up", "Live AI chatbot"], cols=2)
    g.sub("Selling & bookings")
    g.choices(["Online shop (cart & checkout)", "Card payments (Stripe/PayFast)",
               "Booking / appointment system", "Downloadable products (PDFs)",
               "Price list / packages", "Discount codes"], cols=2)
    g.sub("Content & extras")
    g.choices(["Photo gallery", "Video / embedded YouTube", "Blog / news section",
               "Google Maps location", "Social media links", "Multi-language",
               "Search bar", "Customer login area"], cols=2)
    g.question("Where should form enquiries go? (so you never miss a lead)")
    g.write_lines(1, label="Email address(es) to receive enquiries:")
    g.question("Anything special you’d like that isn’t listed above?")
    g.write_lines(2)

    # ---------- 7. Content & media ----------
    g.new_page("Section 7 — Content")
    g.section_title(7, "Your Words, Photos & Files",
                    "What can you provide, and what should MuleSoo create for you?")
    g.question("Do you already have the text/wording for your pages?")
    g.choices(["Yes — most of it", "Some of it", "No — please write it for me"], cols=3)
    g.question("What images can you provide? (tick all that apply)")
    g.choices(["Product photos", "Team / owner photos", "Photos of my work",
               "Logo files", "None yet — need stock/photography", "Videos"], cols=2)
    g.question("What tone of voice suits your brand?")
    g.choices(["Professional & formal", "Friendly & warm", "Confident & bold",
               "Technical & expert", "Simple & clear"], cols=2)
    g.question("Any documents to make available for download? (menus, brochures, price lists)")
    g.write_lines(2)
    g.question("Do you have social media or a Google Business profile to link?")
    g.write_lines(1, label="Instagram / Facebook / LinkedIn / TikTok / Google — write the links:")

    # ---------- 8. Practical ----------
    g.new_page("Section 8 — Practical")
    g.section_title(8, "A Few Practical Details",
                    "Simple questions — skip any you’re unsure about.")
    g.question("Do you already own a domain name (your web address, e.g. yourname.co.za)?")
    g.choices(["Yes — I own it", "No — please help me get one", "Not sure"], cols=3)
    g.write_lines(1, label="If yes, what is it?")
    g.question("Who will update the website after it launches?")
    g.choices(["MuleSoo (please maintain it)", "Me / my team",
               "A mix of both", "Not sure yet"], cols=2)
    g.question("Would you like ongoing support after launch?")
    g.choices(["Yes — monthly care plan", "Just the 30-day free support", "Decide later"], cols=1)
    g.question("Any privacy or compliance needs? (most SA businesses need POPIA basics — we handle it)")
    g.choices(["Standard privacy & terms", "POPIA compliance", "Not sure — advise me"], cols=3)

    # ---------- 9. Timeline & budget ----------
    g.new_page("Section 9 — Timeline & Budget")
    g.section_title(9, "Timeline & Budget",
                    "Honest numbers help us recommend the right package. No obligation.")
    g.question("When would you like the website to go live?")
    g.choices(["As soon as possible", "Within 2–3 weeks", "Within 1–2 months",
               "Flexible / no deadline"], cols=2)
    g.question("What budget range are you working with?")
    g.choices(["Under R2,000", "R2,000 – R5,000", "R5,000 – R10,000",
               "R10,000 +", "Not sure — advise me"], cols=2)
    g.question("Is your budget fixed, or flexible for the right result?")
    g.choices(["Fixed", "Flexible depending on features"], cols=2)
    g.question("Who is the main decision-maker for this project?")
    g.write_lines(1, label="Name & role:")
    g.question("Anything else you’d like MuleSoo to know?")
    g.write_lines(3)

    # ---------- 10. Checklist ----------
    g.new_page("Section 10 — Final Checklist")
    g.section_title(10, "Your Ready-to-Send Checklist",
                    "Tick these off before you send it back — then we begin.")
    g.para("You don’t need every box ticked to send this to us. It just helps us start faster.",
           color=MUTED, font="Sans-Ital")
    for item in [
        "I described my business and who it’s for (Section 1).",
        "I chose my main goal for the website (Section 2).",
        "I described my customers and search words (Section 3).",
        "I ticked the pages I want (Section 4).",
        "I chose the look, feel, and colours (Section 5).",
        "I ticked the features I need (Section 6).",
        "I noted what content and photos I can provide (Section 7).",
        "I answered the practical details — domain, support (Section 8).",
        "I shared my timeline and budget range (Section 9).",
        "I’ve gathered my logo, photos, and any brand files to send.",
    ]:
        g.space(18)
        g._checkbox(LM + 2, g.y - 8.5, item, CW - 6)
        g.y -= 18
    g.gap(6)
    g.note_box("Send it to MuleSoo",
               ["Email your completed guide (and any logo/photos) to hello@mulesoo.com,",
                "or send it on WhatsApp. We’ll reply within 2 hours on business days with",
                "our recommendation, a clear quote, and the next steps. No pressure — just clarity."],
               accent=GREEN)

    # ---------- AI Tool instruction page ----------
    g.new_page("For Your AI Tool")
    g.section_title(11, "For Your AI Tool (Optional Shortcut)",
                    "Prefer to be interviewed? Hand this whole guide to any AI assistant.")
    g.para("If you’d rather not fill this in by yourself, upload this PDF to any AI assistant "
           "(ChatGPT, Claude, Gemini, Microsoft Copilot, and others) and paste the instruction "
           "in the box below. The AI will read this guide and interview you — one friendly "
           "question at a time — then produce a clean, customised requirements document you "
           "can download and send to MuleSoo.", )
    g.sub("Copy & paste this to your AI tool:")
    # instruction box
    instr = [
        "You are my website planning assistant. I have uploaded the “MuleSoo Corporate",
        "Website Master Guide.” I am not technical, so please guide me gently.",
        "",
        "1.  Read the whole guide and use ONLY its sections and questions as your script.",
        "2.  Ask me the questions STRICTLY ONE AT A TIME. Never send a long list. Wait",
        "     for my answer before you ask the next question.",
        "3.  Before each question, add ONE simple sentence that explains what it means and",
        "     WHY it matters, plus a short real-world example or two sensible options I can",
        "     just pick from. Keep it friendly and jargon-free.",
        "4.  If my answer is unclear or missing, kindly explain further and suggest a good",
        "     default — never make me feel stuck.",
        "5.  Go section by section (About Your Business → Goals → Customers → Pages →",
        "     Look & Feel → Features → Content → Practical → Timeline & Budget).",
        "6.  When we finish, compile all my answers into a clear, professional",
        "     “Website Requirements Document” in corporate tone, under the same headings,",
        "     restating each of my answers one by one.",
        "7.  Then give it to me as a downloadable PDF to send to MuleSoo Digital Services.",
        "",
        "Start now: greet me, explain how this will work in one line, then ask question 1.",
    ]
    # draw the code-style box
    box_h = 20 + len(instr) * 13 + 14
    g.space(box_h + 6)
    c = g.c
    bx, by = LM, g.y - box_h
    c.setFillColor(HexColor("#0E1830"))
    c.roundRect(bx, by, CW, box_h, 8, stroke=0, fill=1)
    c.setStrokeColor(BLUE_DEEP); c.setLineWidth(1)
    c.roundRect(bx, by, CW, box_h, 8, stroke=1, fill=0)
    ty = g.y - 20
    for ln in instr:
        c.setFont("Sans", 9.4)
        c.setFillColor(HexColor("#DCE6F5"))
        c.drawString(bx + 16, ty, ln)
        ty -= 13
    g.y = by - 18
    g.note_box("After the AI makes your document",
               ["Download the PDF it produces, double-check the details are right, and email it to",
                "hello@mulesoo.com along with your logo and photos. We’ll convert it into a",
                "world-class website — built exactly around your answers."],
               accent=GOLD_DEEP)

    g.back_cover()
    g.save()
    return path


if __name__ == "__main__":
    out = "c:/Users/mule/OneDrive/Desktop/mulesoo/MuleSoo_Website_Master_Guide.pdf"
    build(out)
    print("WROTE", out)
