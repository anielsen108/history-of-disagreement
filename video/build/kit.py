"""kit.py: rough-ink drawing on paper. Scenes draw in panel coordinates (PW x PH)."""
import math, os, random, subprocess
import numpy as np, skia

W, H, FPS = 1920, 1080, 30
PX, PY, PW, PH = 110, 70, 1700, 740
PAPER, BOARD, INK = (236, 230, 216), (247, 243, 233), (27, 26, 23)
GRAPH, PALE, RED, BLUE = (112, 106, 95), (198, 190, 172), (196, 62, 40), (40, 88, 140)


def _tf(name, pattern):
    p = '/usr/share/texmf/fonts/opentype/public/lm/' + name
    if not os.path.exists(p):
        p = subprocess.run(['fc-match', '-f', '%{file}', pattern], capture_output=True, text=True).stdout
    return skia.Typeface.MakeFromFile(p)


T_MONO, T_MONOB = _tf('lmmono10-regular.otf', 'monospace'), _tf('lmmonolt10-bold.otf', 'monospace:bold')
T_ROM, T_ROMI = _tf('lmroman10-regular.otf', 'serif'), _tf('lmroman10-italic.otf', 'serif:italic')
T_ROMB, T_CAPS = _tf('lmroman10-bold.otf', 'serif:bold'), _tf('lmromancaps10-regular.otf', 'serif')
_fc = {}


def F(tf, size):
    k = (id(tf), round(size, 1))
    if k not in _fc:
        _fc[k] = skia.Font(tf, size)
        _fc[k].setSubpixel(True)
    return _fc[k]


def col(c, a=1.0):
    return skia.Color(c[0], c[1], c[2], int(max(0.0, min(1.0, a)) * 255))


def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def ramp(t, a, b):
    """0 before a, 1 after b, smooth between. The basic timing tool: alpha or draw-on progress."""
    x = clamp((t - a) / (b - a)) if b > a else float(t >= a)
    return x * x * (3 - 2 * x)


def lerp(a, b, u):
    return a + (b - a) * u


def rr_pts(x, y, w, h, r, step=30):
    r, pts = min(r, w / 2, h / 2), []

    def seg(x0, y0, x1, y1):
        n = max(1, int(math.hypot(x1 - x0, y1 - y0) / step))
        pts.extend((x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n) for i in range(n))

    def arc(cx, cy, a0):
        pts.extend((cx + r * math.cos(a0 + math.pi / 8 * i), cy + r * math.sin(a0 + math.pi / 8 * i)) for i in range(4))
    seg(x + r, y, x + w - r, y); arc(x + w - r, y + r, -math.pi / 2)
    seg(x + w, y + r, x + w, y + h - r); arc(x + w - r, y + h - r, 0)
    seg(x + w - r, y + h, x + r, y + h); arc(x + r, y + h - r, math.pi / 2)
    seg(x, y + h - r, x, y + r); arc(x + r, y + r, math.pi)
    return pts


def ell_pts(cx, cy, rx, ry, a0=0.0, a1=2 * math.pi):
    n = max(10, int((rx + ry) * abs(a1 - a0) / 52))
    m = n if abs(a1 - a0) >= 2 * math.pi - 1e-6 else n + 1
    return [(cx + rx * math.cos(a0 + (a1 - a0) * i / n), cy + ry * math.sin(a0 + (a1 - a0) * i / n)) for i in range(m)]


def mkpath(pts, closed=False, smooth=True):
    p, n = skia.Path(), len(pts)
    p.moveTo(*pts[0])
    if not smooth or n < 3:
        for q in pts[1:]:
            p.lineTo(*q)
    else:
        P = (lambda i: pts[i % n]) if closed else (lambda i: pts[max(0, min(n - 1, i))])
        for i in range(n if closed else n - 1):
            a, b, c, d = P(i - 1), P(i), P(i + 1), P(i + 2)
            p.cubicTo(b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6, c[0] - (d[0] - b[0]) / 6, c[1] - (d[1] - b[1]) / 6, c[0], c[1])
    if closed:
        p.close()
    return p


class G:
    """One frame's drawing context. Every stroke wobbles, and the wobble re-seeds every 6 frames (line boil).
    Common arguments: p = draw-on progress 0..1, a = opacity 0..1."""

    def __init__(s, c, si, fr):
        s.c, s.si, s.boil, s.n = c, si, fr // 6, 0

    def _r(s):
        s.n += 1
        return random.Random((s.si * 1000003) ^ (s.n * 7919) ^ (s.boil * 104729))

    def stroke(s, color, w, a=1.0, dash=None):
        p = skia.Paint(AntiAlias=True, Color=col(color, a), Style=skia.Paint.kStroke_Style, StrokeWidth=w,
                       StrokeCap=skia.Paint.kRound_Cap, StrokeJoin=skia.Paint.kRound_Join)
        if dash:
            p.setPathEffect(skia.DashPathEffect.Make(list(dash), 0))
        return p

    def fillp(s, color, a=1.0):
        return skia.Paint(AntiAlias=True, Color=col(color, a), Style=skia.Paint.kFill_Style)

    def poly(s, pts, color=INK, w=3.2, closed=False, p=1.0, a=1.0, fill=None, amp=1.3, smooth=True, dash=None):
        r = s._r()
        if p <= 0 or a <= 0:
            return
        jp = [(x + r.uniform(-amp, amp), y + r.uniform(-amp, amp)) for x, y in pts]
        if fill is not None:
            s.c.drawPath(mkpath(jp, True, smooth), s.fillp(fill, a))
        if p < 1:
            seq = jp + [jp[0]] if closed else jp
            k = p * (len(seq) - 1)
            i = int(k)
            sub = seq[:i + 1]
            if i + 1 < len(seq):
                sub.append((lerp(seq[i][0], seq[i + 1][0], k - i), lerp(seq[i][1], seq[i + 1][1], k - i)))
            if len(sub) > 1:
                s.c.drawPath(mkpath(sub, False, smooth), s.stroke(color, w, a, dash))
        else:
            s.c.drawPath(mkpath(jp, closed, smooth), s.stroke(color, w, a, dash))

    def line(s, x0, y0, x1, y1, color=INK, w=3.2, p=1.0, a=1.0, amp=1.3, dash=None):
        n = max(2, int(math.hypot(x1 - x0, y1 - y0) / 70) + 1)
        s.poly([(lerp(x0, x1, i / n), lerp(y0, y1, i / n)) for i in range(n + 1)], color, w, False, p, a, amp=amp, dash=dash)

    def box(s, x, y, w, h, color=INK, lw=3.2, p=1.0, a=1.0, fill=None, over=6, dash=None):
        """Four separate strokes that overshoot the corners, as a hand would."""
        if fill is not None and a > 0 and p > 0:
            s.c.drawRect(skia.Rect.MakeXYWH(x, y, w, h), s.fillp(fill, a * clamp(p * 2)))
        o = over
        for i, q in enumerate([(x - o, y, x + w + o, y), (x + w, y - o, x + w, y + h + o),
                               (x + w + o, y + h, x - o, y + h), (x, y + h + o, x, y - o)]):
            s.line(*q, color, lw, clamp(p * 4 - i), a, dash=dash)

    def ellipse(s, cx, cy, rx, ry, color=INK, w=3.2, p=1.0, a=1.0, fill=None):
        s.poly(ell_pts(cx, cy, rx, ry), color, w, True, p, a, fill=fill)

    def arrow(s, x0, y0, x1, y1, color=INK, w=3.2, p=1.0, a=1.0, head=18):
        s.line(x0, y0, x1, y1, color, w, p, a)
        ang = math.atan2(y1 - y0, x1 - x0)
        for d in (0.45, -0.45):
            s.line(x1, y1, x1 - head * math.cos(ang + d), y1 - head * math.sin(ang + d), color, w, 1, a if p >= .98 else 0, amp=.6)

    def check(s, x, y, size=26, color=BLUE, p=1.0, a=1.0):
        s.poly([(x - size * .5, y), (x - size * .12, y + size * .42), (x + size * .6, y - size * .5)], color, 4.5, False, p, a, smooth=False, amp=.8)

    def cross(s, x, y, size=26, color=RED, a=1.0, w=4.5):
        s.line(x - size / 2, y - size / 2, x + size / 2, y + size / 2, color, w, 1, a, amp=.8)
        s.line(x + size / 2, y - size / 2, x - size / 2, y + size / 2, color, w, 1, a, amp=.8)

    def text(s, txt, x, y, size=28, tf=T_MONO, color=INK, align='l', a=1.0, p=1.0):
        """y is the baseline. p < 1 types the text on; alignment uses the full string so it does not drift."""
        if a <= 0 or not txt:
            return
        f = F(tf, size)
        wd = f.measureText(txt)
        x -= wd / 2 if align == 'c' else wd if align == 'r' else 0
        k = int(clamp(p) * len(txt) + 1e-6)
        if k:
            s.c.drawString(txt[:k], x, y, f, s.fillp(color, a))

    def hatch(s, path, color=PALE, sp=13, w=1.5, a=1.0):
        b = path.getBounds()
        s.c.save()
        s.c.clipPath(path, doAntiAlias=True)
        x = b.left() - b.height()
        while a > 0 and x < b.right():
            s.c.drawLine(x, b.bottom(), x + b.height(), b.top(), s.stroke(color, w, a))
            x += sp
        s.c.restore()

    def capsule(s, cx, cy, w, h, name='', color=INK, a=1.0, p=1.0, size=30, r=None, hatch=True, dash=None):
        """A sealed thing: hatched rounded body, name on a plaque. Use for anything whose inside is hidden."""
        pts = rr_pts(cx - w / 2, cy - h / 2, w, h, min(h / 2, 34) if r is None else r)
        if a > 0 and p > 0:
            clean = mkpath(pts, True)
            s.c.drawPath(clean, s.fillp(BOARD, a * clamp(p * 2)))
            if hatch:
                s.hatch(clean, a=a * clamp(p * 2 - .6))
        s.poly(pts, color, 3.4, True, p, a, dash=dash)
        if name and a > 0 and p > .5:
            wd, aa = F(T_MONO, size).measureText(name), a * clamp(p * 2 - 1)
            s.c.drawRect(skia.Rect.MakeXYWH(cx - wd / 2 - 10, cy - size * .62, wd + 20, size * 1.2), s.fillp(BOARD, aa))
            s.text(name, cx, cy + size * .3, size, T_MONO, color, 'c', aa)


def make_paper():
    n = np.random.default_rng(7).normal(0, 3.2, (H, W, 1))
    yy, xx = np.mgrid[0:H, 0:W]
    v = ((xx / W - .5) ** 2 + (yy / H - .5) ** 2)[..., None] * 26
    rgb = np.clip(np.array(PAPER)[None, None, :] + n - v, 0, 255).astype(np.uint8)
    return skia.Image.fromarray(np.ascontiguousarray(np.dstack([rgb, np.full((H, W), 255, np.uint8)])), colorType=skia.kRGBA_8888_ColorType)


def wrap(txt, font, maxw):
    lines, cur = [], ''
    for word in txt.split():
        trial = (cur + ' ' + word).strip()
        if font.measureText(trial) <= maxw or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = word
    return lines + [cur] if cur else lines
