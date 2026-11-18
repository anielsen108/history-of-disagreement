"""scenes.py: the boards. Timings here are NOMINAL (brisk); build.py plays them at half speed or slower.
Colour meanings, fixed on every board: BLUE = the dispute is located in belief; RED = in the psyche or the relationship."""
import os
from kit import *

IMG_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'img')
_img = {}
C = 5.0     # nominal seconds per caption

SAY = {'Nyāya-sūtra': 'Nyaaya Sootra', 'vāda': 'vaada', 'Caraka': 'Charaka', 'Sic et Non': 'Sick et Non'}


def caps(*texts):
    return dict(dur=C * len(texts), caps=[(C * i, s) for i, s in enumerate(texts)])


def k(i, off=0.0):
    return C * i + off


def img(key):
    if key not in _img:
        _img[key] = None
        for ext in ('.jpg', '.png'):
            p = os.path.join(IMG_DIR, key + ext)
            if os.path.exists(p) and os.path.getsize(p):
                _img[key] = skia.Image.open(p)
    return _img[key]


def pic(g, key, x, y, w, h, a=1.0, cx=.5, cy=.5, zoom=1.0, frame=True):
    """Draw image `key` cropped to cover the rect. zoom 1 = the largest crop of that aspect; cx, cy = crop centre (0..1)."""
    if a <= 0:
        return
    im = img(key)
    if im is None:
        g.c.drawRect(skia.Rect.MakeXYWH(x, y, w, h), g.fillp(PALE, a))
        g.text('[' + key + ']', x + w / 2, y + h / 2, 30, T_MONO, INK, 'c', a)
    else:
        iw, ih = im.width(), im.height()
        sw = min(iw, ih * w / h) / zoom
        sh = sw * h / w
        sx = clamp(cx * iw - sw / 2, 0, iw - sw)
        sy = clamp(cy * ih - sh / 2, 0, ih - sh)
        p = skia.Paint(AntiAlias=True)
        p.setAlphaf(clamp(a))
        g.c.drawImageRect(im, skia.Rect.MakeXYWH(sx, sy, sw, sh), skia.Rect.MakeXYWH(x, y, w, h),
                          skia.SamplingOptions(skia.FilterMode.kLinear, skia.MipmapMode.kLinear), p)
    if frame:
        g.box(x, y, w, h, INK, 3.0, a=a, over=5)


def tag(g, txt, x, y, size=30, a=1.0, color=INK, align='l', tf=T_ROM, pad=12):
    """Text on a paper plaque, legible over a picture. y is the baseline."""
    if a <= 0:
        return
    wd = F(tf, size).measureText(txt)
    x0 = x - (wd / 2 if align == 'c' else wd if align == 'r' else 0)
    g.c.drawRect(skia.Rect.MakeXYWH(x0 - pad, y - size * .95, wd + 2 * pad, size * 1.4), g.fillp(BOARD, a * .93))
    g.text(txt, x0, y, size, tf, color, 'l', a)


def credit(g, txt, a):
    tag(g, txt, 54, PH - 34, 23, a, GRAPH, 'l', T_ROMI, 9)


def about(g, txt, x, y, a, color=INK, align='l', size=38):
    """The recurring line that names a tradition's diagnosis."""
    if a <= 0:
        return
    wd0 = F(T_ROMI, 26).measureText('really about')
    wd1 = F(T_ROMB, size).measureText(txt)
    w = max(wd0, wd1)
    x0 = x - (w / 2 if align == 'c' else w if align == 'r' else 0)
    g.c.drawRect(skia.Rect.MakeXYWH(x0 - 16, y - 78, w + 32, 104), g.fillp(BOARD, a * .93))
    g.text('really about', x0, y - 44, 26, T_ROMI, GRAPH, 'l', a)
    g.text(txt, x0, y, size, T_ROMB, color, 'l', a)


def person(g, x, y, s=1.0, color=INK, p=1.0, a=1.0, arm=0):
    """A standing figure about 150*s tall, feet at y. arm: -1 points left, 1 points right, 0 at rest."""
    g.ellipse(x, y - 132 * s, 17 * s, 19 * s, color, 3.2, clamp(p * 3), a, fill=BOARD)
    g.line(x, y - 112 * s, x, y - 52 * s, color, 3.2, clamp(p * 3 - .8), a)
    g.line(x, y - 52 * s, x - 20 * s, y, color, 3.2, clamp(p * 3 - 1.4), a)
    g.line(x, y - 52 * s, x + 20 * s, y, color, 3.2, clamp(p * 3 - 1.6), a)
    if arm:
        g.line(x, y - 98 * s, x + arm * 40 * s, y - 108 * s, color, 3.2, clamp(p * 3 - 1.9), a)
        g.line(x, y - 98 * s, x - arm * 22 * s, y - 66 * s, color, 3.2, clamp(p * 3 - 1.9), a)
    else:
        g.line(x, y - 98 * s, x - 24 * s, y - 62 * s, color, 3.2, clamp(p * 3 - 1.9), a)
        g.line(x, y - 98 * s, x + 24 * s, y - 62 * s, color, 3.2, clamp(p * 3 - 1.9), a)


def house(g, x, y, s=1.0, p=1.0, a=1.0):
    """A plain house, base centred at (x, y)."""
    g.box(x - 110 * s, y - 130 * s, 220 * s, 130 * s, INK, 3.4, clamp(p * 2), a, fill=BOARD)
    g.poly([(x - 135 * s, y - 126 * s), (x, y - 222 * s), (x + 135 * s, y - 126 * s)], INK, 3.4, False, clamp(p * 2 - .6), a, smooth=False)
    g.box(x - 22 * s, y - 70 * s, 44 * s, 70 * s, INK, 2.8, clamp(p * 2 - 1), a, over=3)
    g.box(x + 45 * s, y - 100 * s, 40 * s, 36 * s, INK, 2.4, clamp(p * 2 - 1), a, over=3)
    g.box(x - 85 * s, y - 100 * s, 40 * s, 36 * s, INK, 2.4, clamp(p * 2 - 1), a, over=3)


def method_view(g, x0, x1, y, t, a0, a1, a2, mlabel='', vlabel='', s=1.0):
    """Square (a method) joined by a thread to a circle (a view)."""
    g.line(x0, y, x1, y, GRAPH, 3.0, ramp(t, a1, a1 + .8))
    g.box(x0 - 46 * s, y - 46 * s, 92 * s, 92 * s, INK, 3.6, ramp(t, a0, a0 + .7), fill=BOARD)
    g.ellipse(x1, y, 50 * s, 50 * s, INK, 3.6, ramp(t, a2, a2 + .7), fill=BOARD)
    if mlabel:
        g.text(mlabel, x0, y + 100 * s, 30, T_ROM, INK, 'c', ramp(t, a0 + .4, a0 + .8))
    if vlabel:
        g.text(vlabel, x1, y + 100 * s, 30, T_ROM, INK, 'c', ramp(t, a2 + .4, a2 + .8))


# ---------------------------------------------------------------- 1 title
def s_title(g, t, d):
    g.text('THE HISTORY OF DISAGREEMENT', PW / 2, 330, 80, T_CAPS, INK, 'c', p=ramp(t, .3, 2.0))
    g.line(300, 374, 1400, 374, INK, 3.4, ramp(t, 1.8, 2.8))
    g.text('from ancient Greece to the present', PW / 2, 446, 40, T_ROMI, GRAPH, 'c', ramp(t, 2.6, 3.3))


# ---------------------------------------------------------------- 2 Euthyphro
def s_euthyphro(g, t, d):
    u = t / d
    pic(g, 'socrates', 0, 0, PW, PH, ramp(t, 0, 1.0), .5, lerp(.44, .47, u), lerp(1.0, 1.07, u), frame=False)
    credit(g, 'Jacques-Louis David, The Death of Socrates, 1787', ramp(t, 1.0, 1.6))
    tag(g, 'Plato, Euthyphro 7b–c', 1646, 70, 30, ramp(t, 1.4, 2.0) * (1 - ramp(t, k(2), k(2, .5))), INK, 'r')
    tag(g, 'trans. Benjamin Jowett, 1892', 1646, 116, 24, ramp(t, k(1, .4), k(1, 1.0)) * (1 - ramp(t, k(2), k(2, .5))), GRAPH, 'r', T_ROMI)
    tag(g, 'a number, a length, a weight:  settled by measuring', 1646, 70, 30, ramp(t, k(2, .5), k(2, 1.1)), INK, 'r')
    tag(g, 'the just, the good:  no sum', 1646, 124, 30, ramp(t, k(2, 2.4), k(2, 3.0)), INK, 'r', T_ROMB)


# ---------------------------------------------------------------- 3 the claim
def s_claim(g, t, d):
    method_view(g, 520, 1180, 250, t, .3, 1.0, 1.6)
    g.text('a method', 520, 350, 34, T_ROMB, INK, 'c', ramp(t, .8, 1.2))
    g.text('a diagnosis', 1180, 350, 34, T_ROMB, INK, 'c', ramp(t, 2.0, 2.4))
    g.text('measure it', 520, 396, 30, T_ROMI, GRAPH, 'c', ramp(t, 2.6, 3.0))
    g.text('some disputes have no measure', 1180, 396, 30, T_ROMI, GRAPH, 'c', ramp(t, 3.4, 3.8))
    g.text('What is this disagreement really about?', PW / 2, 560, 52, T_ROMI, INK, 'c', p=ramp(t, k(1, 1.6), k(1, 3.6)))
    g.line(420, 588, 1280, 588, INK, 2.6, ramp(t, k(1, 3.4), k(1, 4.2)))
    g.text('assumes', 850, 228, 28, T_ROMI, GRAPH, 'c', ramp(t, k(1, .4), k(1, .9)))
    g.text('accepted with the method, usually unnoticed', PW / 2, 660, 32, T_ROM, GRAPH, 'c', ramp(t, k(2, .8), k(2, 1.5)))


# ---------------------------------------------------------------- 4 sophists
def s_sophists(g, t, d):
    u = t / d
    pic(g, 'protagoras', 70, 50, 448, 640, ramp(t, 0, 1.0), .5, lerp(.42, .46, u), lerp(1.0, 1.05, u))
    g.text('Salvator Rosa, Democritus and Protagoras, 1663–64', 70, 722, 22, T_ROMI, GRAPH, 'l', ramp(t, 1.0, 1.6))
    g.text('Athens, fifth century BCE', 640, 110, 34, T_ROM, GRAPH, 'l', ramp(t, .6, 1.2))
    g.text('Protagoras', 640, 170, 52, T_ROMB, INK, 'l', ramp(t, 1.2, 1.8))
    # two opposed arguments
    g.arrow(700, 290, 1080, 290, INK, 3.6, ramp(t, 2.4, 3.2))
    g.text('one argument', 700, 268, 30, T_ROM, INK, 'l', ramp(t, 2.6, 3.0))
    g.arrow(1500, 360, 1120, 360, INK, 3.6, ramp(t, 3.2, 4.0))
    g.text('its opposite', 1500, 400, 30, T_ROM, INK, 'r', ramp(t, 3.4, 3.8))
    # the drill
    g.text('the drill:', 640, 480, 30, T_ROMI, GRAPH, 'l', ramp(t, k(1, .4), k(1, .8)))
    g.text('argue the case', 790, 480, 34, T_ROM, INK, 'l', ramp(t, k(1, 1.0), k(1, 1.5)))
    g.text('then its contrary, with equal force', 790, 528, 34, T_ROM, INK, 'l', ramp(t, k(1, 2.0), k(1, 2.6)))
    g.text('the eristic argues only to win', 640, 610, 32, T_ROM, INK, 'l', ramp(t, k(2, .4), k(2, 1.0)))
    about(g, 'a contest', 1330, 660, ramp(t, k(2, 2.4), k(2, 3.0)))


# ---------------------------------------------------------------- 5 Socrates
def s_socrates(g, t, d):
    u = t / d
    pic(g, 'socrates', 0, 0, PW, PH, 1, lerp(.5, .49, u), .40, lerp(1.45, 1.55, u), frame=False)
    credit(g, 'detail of David, The Death of Socrates', ramp(t, .4, 1.0))
    y = 86
    tag(g, 'a definition', 90, y, 32, ramp(t, .8, 1.3))
    g.arrow(292, y - 10, 356, y - 10, BOARD, 5, ramp(t, 1.6, 2.0))
    tag(g, 'further premises, agreed', 376, y, 32, ramp(t, 2.0, 2.5))
    g.arrow(736, y - 10, 800, y - 10, BOARD, 5, ramp(t, 3.0, 3.4))
    tag(g, 'they contradict it', 820, y, 32, ramp(t, 3.4, 3.9), INK, 'l', T_ROMB)
    about(g, 'beliefs that do not fit together', 1100, 250, ramp(t, k(1, 1.0), k(1, 1.7)), BLUE)
    tag(g, 'Plato, Gorgias 458a, trans. Jowett', 1646, 690, 26, ramp(t, k(2, .6), k(2, 1.2)), GRAPH, 'r', T_ROMI)


# ---------------------------------------------------------------- 6 Aristotle and stasis
def s_stasis(g, t, d):
    u = t / d
    x = ramp(t, k(1, 0), k(1, 1.2))
    pic(g, 'athens', 0, 0, PW, PH, 1 - x, .5, lerp(.50, .53, u * 3), lerp(1.0, 1.06, u * 3), frame=False)
    pic(g, 'cicero', 0, 0, PW, PH, x, lerp(.42, .46, u), .5, lerp(1.0, 1.06, u), frame=False)
    credit(g, 'Raphael, The School of Athens, 1509–11', ramp(t, .6, 1.2) * (1 - x))
    credit(g, 'Cesare Maccari, Cicero Denounces Catiline, 1888', ramp(t, k(1, 1.2), k(1, 1.8)))
    tag(g, 'Aristotle, Topics', 1646, 80, 36, ramp(t, 1.4, 2.0) * (1 - x), INK, 'r', T_ROMB)
    tag(g, 'the places from which arguments are drawn', 1646, 132, 28, ramp(t, 2.4, 3.0) * (1 - x), INK, 'r')
    tag(g, 'Hermagoras, 2nd century BCE', 1646, 80, 32, ramp(t, k(1, 1.4), k(1, 2.0)), INK, 'r', T_ROMB)
    tag(g, 'locate the dispute before arguing it', 1646, 130, 28, ramp(t, k(1, 2.6), k(1, 3.2)), INK, 'r')
    for i, q in enumerate(['1   did it happen', '2   what to call it', '3   was it justified', '4   who decides']):
        t0 = k(2, .5 + i * 1.0)
        tag(g, q, 1250, 250 + i * 62, 34, ramp(t, t0, t0 + .5))


# ---------------------------------------------------------------- 7 vāda
def s_vada(g, t, d):
    g.text('India', 120, 110, 34, T_ROM, GRAPH, 'l', ramp(t, .3, .8))
    g.text('Nyāya-sūtra, about the second century CE', 120, 160, 34, T_ROM, INK, 'l', ramp(t, .8, 1.4))
    for i, (nm, x) in enumerate([('teacher', 330), ('pupil', 560), ('peer', 790)]):
        t0 = 1.6 + i * .6
        person(g, x, 500, 1.15, INK, ramp(t, t0, t0 + .9), arm=(1 if i == 0 else -1 if i == 2 else 0))
        g.text(nm, x, 548, 30, T_ROM, INK, 'c', ramp(t, t0 + .5, t0 + .9))
    g.text('vāda', 1230, 300, 76, T_ROMI, INK, 'c', ramp(t, 3.2, 3.8))
    g.text('debate in good faith', 1230, 362, 36, T_ROM, INK, 'c', ramp(t, 3.6, 4.1))
    g.text('aimed at truth', 1230, 410, 36, T_ROM, BLUE, 'c', ramp(t, 4.0, 4.5))
    # Caraka: two kinds, etiquette for each
    g.line(1020, 480, 1440, 480, GRAPH, 2.4, ramp(t, k(1, .3), k(1, .9)))
    g.text('Caraka-saṃhitā', 1230, 536, 32, T_ROM, GRAPH, 'c', ramp(t, k(1, .5), k(1, 1.0)))
    g.text('friendly discussion', 1050, 610, 34, T_ROM, INK, 'c', ramp(t, k(1, 1.4), k(1, 1.9)))
    g.line(1230, 572, 1230, 650, GRAPH, 2.4, ramp(t, k(1, 2.0), k(1, 2.5)))
    g.text('hostile disputation', 1420, 610, 34, T_ROM, INK, 'c', ramp(t, k(1, 2.4), k(1, 2.9)))
    g.text('etiquette for each', 1230, 706, 28, T_ROMI, GRAPH, 'c', ramp(t, k(1, 3.4), k(1, 3.9)))


# ---------------------------------------------------------------- 8 machloket
def s_talmud(g, t, d):
    u = t / d
    pic(g, 'talmud', 0, 0, PW, PH, ramp(t, 0, 1.0), .5, lerp(.42, .5, u), lerp(1.0, 1.06, u), frame=False)
    credit(g, 'Babylonian Talmud, printed by Daniel Bomberg, Venice, 1519–23', ramp(t, 1.0, 1.6))
    tag(g, 'a dispute for the sake of Heaven will endure', 1646, 80, 32, ramp(t, 1.6, 2.2), INK, 'r')
    tag(g, 'Mishnah, Avot 5:17', 1646, 124, 24, ramp(t, 2.0, 2.6), GRAPH, 'r', T_ROMI)
    tag(g, 'Hillel', 1330, 230, 44, ramp(t, 3.2, 3.7), INK, 'r', T_ROMB)
    tag(g, 'Shammai', 1420, 230, 44, ramp(t, 3.7, 4.2), INK, 'l', T_ROMB)
    tag(g, '“these and those are the words of the living God”', 1646, 330, 30, ramp(t, k(1, 1.0), k(1, 1.6)), INK, 'r', T_ROMI)
    tag(g, 'Eruvin 13b', 1646, 374, 24, ramp(t, k(1, 1.4), k(1, 2.0)), GRAPH, 'r', T_ROMI)
    tag(g, 'the law follows Hillel', 1646, 440, 32, ramp(t, k(1, 3.0), k(1, 3.6)), INK, 'r')
    tag(g, 'the minority view is recorded', 1646, 520, 32, ramp(t, k(2, .8), k(2, 1.4)), INK, 'r')
    about(g, 'a truth with more than one voice', 1646, 650, ramp(t, k(2, 2.6), k(2, 3.2)), INK, 'r')


# ---------------------------------------------------------------- 9 disputatio
def s_disputatio(g, t, d):
    u = t / d
    pic(g, 'lecture', 0, 0, PW, PH, ramp(t, 0, 1.0), .5, lerp(.36, .44, u), lerp(1.0, 1.06, u), frame=False)
    credit(g, 'Laurentius de Voltolina, a university lecture, 14th century', ramp(t, 1.0, 1.6))
    tag(g, 'Abelard, Sic et Non', 90, 86, 40, ramp(t, 1.4, 2.0), INK, 'l', T_ROMB)
    tag(g, 'Yes and No', 90, 138, 30, ramp(t, 3.0, 3.5), INK, 'l', T_ROMI)
    for i, q in enumerate(['check the text', 'check the context', 'above all, the senses of words']):
        t0 = k(1, .8 + i * 1.0)
        tag(g, q, 90, 230 + i * 58, 32, ramp(t, t0, t0 + .5), INK, 'l', T_ROMB if i == 2 else T_ROM)
    for i, q in enumerate(['one objects', 'one answers', 'the master determines']):
        t0 = k(2, 1.0 + i * .9)
        tag(g, q, 1646, 90 + i * 58, 32, ramp(t, t0, t0 + .5), INK, 'r')


# ---------------------------------------------------------------- 10 seventeenth century
def s_three(g, t, d):
    u = t / d
    items = [('areopagitica', 'Milton, 1644', 'truth, tested by collision', .5, .40),
             ('leviathan', 'Hobbes, 1651', 'who decides', .5, .30),
             ('leibniz', 'Leibniz, 1685', 'an error of calculation', .5, .34)]
    for i, (key, nm, ab, cx, cy) in enumerate(items):
        t0 = k(i, .2)
        x = 150 + i * 500
        pic(g, key, x, 40, 400, 470, ramp(t, t0, t0 + 1.0), cx, cy, lerp(1.0, 1.05, u))
        g.text(nm, x + 200, 560, 38, T_ROMB, INK, 'c', ramp(t, t0 + .8, t0 + 1.3))
        g.text('really about', x + 200, 618, 24, T_ROMI, GRAPH, 'c', ramp(t, t0 + 2.4, t0 + 2.9))
        g.text(ab, x + 200, 660, 32, T_ROMB, BLUE if i == 2 else INK, 'c', ramp(t, t0 + 2.6, t0 + 3.1))
    g.text('Areopagitica, title page.  Leviathan, frontispiece by Abraham Bosse.  Leibniz, portrait by C. B. Francke, about 1695.',
           PW / 2, 718, 21, T_ROMI, GRAPH, 'c', ramp(t, k(2, 1.5), k(2, 2.1)))


# ---------------------------------------------------------------- 11 parliament
def s_parliament(g, t, d):
    u = t / d
    pic(g, 'commons', 0, 0, PW, PH, ramp(t, 0, 1.0), .5, lerp(.42, .47, u), lerp(1.0, 1.07, u), frame=False)
    credit(g, 'Karl Anton Hickel, The House of Commons 1793–94', ramp(t, 1.0, 1.6))
    tag(g, 'rules of order', 1646, 80, 38, ramp(t, 1.6, 2.2), INK, 'r', T_ROMB)
    tag(g, 'to decide while still divided', 1646, 134, 30, ramp(t, 2.8, 3.4), INK, 'r')
    tag(g, 'the loyal opposition, 1826', 1646, 230, 34, ramp(t, k(1, .8), k(1, 1.4)), INK, 'r', T_ROMB)
    tag(g, 'disagreement as a permanent office', 1646, 280, 30, ramp(t, k(1, 2.2), k(1, 2.8)), INK, 'r')


# ---------------------------------------------------------------- bars
BARS = [('before 1500', 13 / 27, 0.0), ('1500 to 1900', 5 / 16, 1 / 16), ('1900 to 1975', 3 / 11, 5 / 11), ('since 1975', 7 / 20, 7 / 20)]
BX, BW, BH = 420, 1080, 62


def bar(g, i, y, t, t0, tb=None, tr=None, label=True):
    """One period: blue share from the left (belief first), red share from the right (psyche or relationship first)."""
    nm, b, r = BARS[i]
    tb = t0 + .8 if tb is None else tb
    tr = t0 + 1.6 if tr is None else tr
    if label:
        g.text(nm, BX - 30, y + BH * .68, 32, T_ROM, INK, 'r', ramp(t, t0, t0 + .5))
    pb, pr = ramp(t, tb, tb + 1.0), ramp(t, tr, tr + 1.0)
    if pb > 0:
        g.c.drawRect(skia.Rect.MakeXYWH(BX, y, BW * b * pb, BH), g.fillp(BLUE, .85))
    if pr > 0 and r > 0:
        g.c.drawRect(skia.Rect.MakeXYWH(BX + BW - BW * r * pr, y, BW * r * pr, BH), g.fillp(RED, .85))
    g.box(BX, y, BW, BH, INK, 3.0, ramp(t, t0 + .2, t0 + 1.0), over=5)


def legend(g, y, t, t0, t1):
    g.c.drawRect(skia.Rect.MakeXYWH(BX, y, 34, 34), g.fillp(BLUE, .85 * ramp(t, t0, t0 + .4)))
    g.text('belief comes first', BX + 50, y + 27, 30, T_ROM, INK, 'l', ramp(t, t0, t0 + .4))
    g.c.drawRect(skia.Rect.MakeXYWH(BX + 520, y, 34, 34), g.fillp(RED, .85 * ramp(t, t1, t1 + .4)))
    g.text('the psyche or the relationship comes first', BX + 570, y + 27, 30, T_ROM, INK, 'l', ramp(t, t1, t1 + .4))


# ---------------------------------------------------------------- 12 the older methods
def s_older(g, t, d):
    g.text('Each method, sorted by the diagnosis it puts first', PW / 2, 120, 40, T_ROM, INK, 'c', ramp(t, .3, .9))
    bar(g, 0, 300, t, 1.2, 2.4, 99)
    legend(g, 200, t, 2.4, k(1, .4))
    g.text('about half', BX + BW * 13 / 54, 420, 34, T_ROMB, BLUE, 'c', ramp(t, 3.4, 3.9))
    g.text('none', BX + BW - 60, 420, 34, T_ROMB, RED, 'c', ramp(t, k(1, 1.2), k(1, 1.7)))
    g.line(BX + BW - 60, 380, BX + BW - 60, 366, RED, 3, ramp(t, k(1, 1.2), k(1, 1.6)))
    g.text('vanity and character are noticed, as secondary concerns', PW / 2, 560, 34, T_ROMI, GRAPH, 'c', ramp(t, k(1, 2.8), k(1, 3.5)))
    g.text('the unshaded part: words, power, release and other diagnoses', PW / 2, 650, 26, T_ROMI, GRAPH, 'c', ramp(t, 4.0, 4.5))


# ---------------------------------------------------------------- 13 the turn
def s_turn(g, t, d):
    fade = 1 - ramp(t, k(4, 0), k(4, .6))
    g.text('1951', 120, 110, 44, T_ROMB, INK, 'l', ramp(t, .4, .9) * fade)
    g.text('Carl Rogers', 240, 110, 44, T_ROM, INK, 'l', ramp(t, .7, 1.2) * fade)
    g.text('the barrier: our tendency to judge', 120, 164, 32, T_ROMI, RED, 'l', ramp(t, 2.4, 3.0) * fade)
    person(g, 260, 520, 1.25, INK, ramp(t, 1.2, 2.2), fade, arm=1)
    person(g, 760, 520, 1.25, INK, ramp(t, 1.6, 2.6), fade, arm=-1)
    # caption 1: say it back first
    g.arrow(330, 330, 690, 330, INK, 3.4, ramp(t, k(1, .4), k(1, 1.2)), fade)
    g.text('ideas and feelings', 510, 308, 28, T_ROM, INK, 'c', ramp(t, k(1, .8), k(1, 1.3)) * fade)
    g.arrow(690, 400, 330, 400, RED, 3.8, ramp(t, k(1, 1.8), k(1, 2.8)), fade)
    g.text('restated, to the speaker’s satisfaction', 510, 452, 28, T_ROM, RED, 'c', ramp(t, k(1, 2.4), k(1, 2.9)) * fade)
    g.text('only then, a reply', 510, 590, 28, T_ROMI, GRAPH, 'c', ramp(t, k(1, 3.6), k(1, 4.1)) * fade)
    # caption 2: Rapoport
    g.line(960, 80, 960, 660, PALE, 2.4, ramp(t, k(2, .2), k(2, 1.0)), fade)
    g.text('1960', 1020, 150, 40, T_ROMB, INK, 'l', ramp(t, k(2, .4), k(2, .9)) * fade)
    g.text('Anatol Rapoport', 1130, 150, 40, T_ROM, INK, 'l', ramp(t, k(2, .7), k(2, 1.2)) * fade)
    g.text('first reduce the sense of threat', 1020, 204, 32, T_ROMI, RED, 'l', ramp(t, k(2, 2.0), k(2, 2.6)) * fade)
    # caption 3: NVC
    g.text('Nonviolent Communication', 1020, 340, 40, T_ROM, INK, 'l', ramp(t, k(3, .4), k(3, 1.0)) * fade)
    g.ellipse(1130, 470, 62, 46, RED, 3.4, ramp(t, k(3, 1.2), k(3, 1.9)), fade)
    g.ellipse(1430, 470, 62, 46, RED, 3.4, ramp(t, k(3, 1.5), k(3, 2.2)), fade)
    g.text('need', 1130, 480, 28, T_ROM, RED, 'c', ramp(t, k(3, 1.7), k(3, 2.1)) * fade)
    g.text('need', 1430, 480, 28, T_ROM, RED, 'c', ramp(t, k(3, 2.0), k(3, 2.4)) * fade)
    g.text('needs never conflict', 1280, 400, 28, T_ROMI, GRAPH, 'c', ramp(t, k(3, 2.2), k(3, 2.7)) * fade)
    g.arrow(1130, 540, 1268, 620, INK, 3.2, ramp(t, k(3, 3.0), k(3, 3.6)), fade)
    g.arrow(1430, 540, 1292, 620, INK, 3.2, ramp(t, k(3, 3.0), k(3, 3.6)), fade)
    g.cross(1280, 632, 26, INK, ramp(t, k(3, 3.6), k(3, 3.9)) * fade, 4)
    g.text('strategies collide', 1280, 690, 28, T_ROMI, GRAPH, 'c', ramp(t, k(3, 3.8), k(3, 4.3)) * fade)
    # caption 4: the count
    if t >= k(4, .4):
        g.text('New methods, 1900 to 1975', PW / 2, 160, 40, T_ROM, INK, 'c', ramp(t, k(4, .6), k(4, 1.1)))
        bar(g, 2, 320, t, k(4, .8), k(4, 2.6), k(4, 1.6))
        legend(g, 230, t, k(4, 2.6), k(4, 1.6))
        g.text('nearly half', BX + BW - BW * 5 / 22, 440, 34, T_ROMB, RED, 'c', ramp(t, k(4, 2.8), k(4, 3.3)))


# ---------------------------------------------------------------- 14 the house
SIB = [('Ana', 380), ('Ben', 1320), ('Cleo', 850)]


def base_house(g, t, t0, y=420, s=1.0, names=True):
    house(g, 850, y - 150 * s, s * .9, ramp(t, t0, t0 + 1.4))
    for i, (nm, x) in enumerate(SIB):
        xx = 850 + (x - 850) * s
        person(g, xx, y + 60 * s, s, INK, ramp(t, t0 + .8 + i * .4, t0 + 1.8 + i * .4), arm=(1 if i == 0 else -1 if i == 1 else 0))
        if names:
            g.text(nm, xx, y + 104 * s, 34 * (s * .5 + .5), T_ROMB, INK, 'c', ramp(t, t0 + 1.4 + i * .4, t0 + 1.9 + i * .4))


def s_house(g, t, d):
    g.text('The house in the will', 120, 100, 44, T_ROM, INK, 'l', ramp(t, .3, .9))
    base_house(g, t, .6, 470, 1.0)
    g.text('equal shares', 850, 92, 30, T_ROMI, GRAPH, 'c', ramp(t, 2.4, 2.9))
    g.text('has debts', 380, 630, 28, T_ROMI, GRAPH, 'c', ramp(t, 3.0, 3.4))
    g.text('“sell it”', 380, 676, 36, T_ROM, INK, 'c', ramp(t, 3.3, 3.8))
    g.text('“keep it for the family”', 1320, 676, 36, T_ROM, INK, 'c', ramp(t, 4.0, 4.5))
    g.text('nursed their mother here', 850, 630, 28, T_ROMI, GRAPH, 'c', ramp(t, k(1, .6), k(1, 1.1)))
    g.text('“it was promised to me”', 850, 676, 36, T_ROM, INK, 'c', ramp(t, k(1, 1.6), k(1, 2.1)))
    g.box(1150, 110, 150, 190, INK, 2.8, ramp(t, k(1, 2.8), k(1, 3.6)), fill=BOARD)
    g.text('the will', 1225, 160, 28, T_ROMB, INK, 'c', ramp(t, k(1, 3.2), k(1, 3.6)))
    for i in range(3):
        g.line(1172, 190 + i * 26, 1278, 190 + i * 26, GRAPH, 2, ramp(t, k(1, 3.4 + i * .15), k(1, 3.8 + i * .15)))
    g.text('silent on the promise', 1225, 336, 26, T_ROMI, GRAPH, 'c', ramp(t, k(1, 3.9), k(1, 4.4)))


# ---------------------------------------------------------------- 15 three readings
COLS = [('Socratic questioning', 'finds', 'beliefs that conflict', BLUE, 'humiliation hardens positions'),
        ('Principled negotiation', 'finds', 'interests under positions', INK, 'payment can feel like an insult'),
        ('Nonviolent Communication', 'finds', 'needs behind accusations', RED, 'the house cannot be both sold and kept')]
DETAIL = ['“her wishes” and “only the will counts”', 'cash  ·  continuity  ·  recognition', 'security  ·  belonging  ·  acknowledgement']


def s_readings(g, t, d):
    base_house(g, t, -9, 190, .5, names=True)
    for i, (nm, _, sees, colr, miss) in enumerate(COLS):
        x = 300 + i * 550
        ts, tm = k(2 * i, .3), k(2 * i + 1, .3)
        g.line(x - 250, 300, x + 250, 300, GRAPH, 2.4, ramp(t, ts, ts + .7))
        g.text(nm, x, 350, 36, T_ROMB, INK, 'c', ramp(t, ts + .3, ts + .8))
        g.text('sees', x, 404, 24, T_ROMI, GRAPH, 'c', ramp(t, ts + 1.0, ts + 1.4))
        g.text(sees, x, 444, 32, T_ROM, colr, 'c', ramp(t, ts + 1.2, ts + 1.7))
        g.text(DETAIL[i], x, 490, 25, T_ROMI, colr if colr != INK else GRAPH, 'c', ramp(t, ts + 2.4, ts + 2.9))
        g.text('misses', x, 556, 24, T_ROMI, GRAPH, 'c', ramp(t, tm + .4, tm + .8))
        g.text(miss, x, 596, 27, T_ROM, INK, 'c', ramp(t, tm + .8, tm + 1.4))
    p = ramp(t, k(6, .6), k(6, 1.8))
    g.poly([(60, 630), (60, 660), (1640, 660), (1640, 630)], INK, 3.0, False, p, smooth=False)
    g.text('one quarrel, about several things at once', PW / 2, 712, 34, T_ROMB, INK, 'c', ramp(t, k(6, 1.8), k(6, 2.4)))


# ---------------------------------------------------------------- 16 after 1975
def s_after(g, t, d):
    g.text('Each method, sorted by the diagnosis it puts first', PW / 2, 90, 38, T_ROM, INK, 'c', ramp(t, .2, .7))
    legend(g, 130, t, .6, .9)
    for i in range(3):
        bar(g, i, 210 + i * 100, t, .8 + i * .9)
    bar(g, 3, 510, t, k(3, .3), k(3, 1.2), k(3, 2.2))
    g.text('level', BX + BW / 2, 554, 34, T_ROMB, INK, 'c', ramp(t, k(3, 3.4), k(3, 3.9)))
    g.text('adversarial collaboration', 420, 660, 32, T_ROM, BLUE, 'l', ramp(t, k(1, .6), k(1, 1.2)))
    g.text('one study, designed together', 420, 700, 26, T_ROMI, GRAPH, 'l', ramp(t, k(1, 1.8), k(1, 2.3)))
    g.text('the double crux', 980, 660, 32, T_ROM, BLUE, 'l', ramp(t, k(2, .6), k(2, 1.2)))
    g.text('one testable question under both views', 980, 700, 26, T_ROMI, GRAPH, 'l', ramp(t, k(2, 1.8), k(2, 2.3)))


# ---------------------------------------------------------------- 17 the oldest triage
def s_close(g, t, d):
    u = t / d
    pic(g, 'cicero', 0, 0, PW, PH, ramp(t, 0, 1.0) * (1 - .55 * ramp(t, k(2, 0), k(2, 1.0))), lerp(.5, .46, u), .5, lerp(1.06, 1.0, u), frame=False)
    credit(g, 'Cesare Maccari, Cicero Denounces Catiline, 1888', ramp(t, .8, 1.4))
    tag(g, 'before arguing, locate the dispute', 90, 84, 34, ramp(t, 1.0, 1.6), INK, 'l', T_ROMB)
    for i, q in enumerate(['fact', 'name', 'justification', 'who decides']):
        t0 = 2.2 + i * .6
        tag(g, q, 90, 150 + i * 56, 32, ramp(t, t0, t0 + .4))
    tag(g, 'no question for', 1646, 84, 28, ramp(t, k(1, .5), k(1, 1.0)), GRAPH, 'r', T_ROMI)
    for i, q in enumerate(['fear', 'pride', 'a damaged relationship', 'competing interests', 'attachment to being right']):
        t0 = k(1, 1.2 + i * .65)
        tag(g, q, 1646, 140 + i * 54, 32, ramp(t, t0, t0 + .4), RED if i in (0, 1, 2) else INK, 'r')
    a = ramp(t, k(2, .6), k(2, 1.2))
    if a > 0:
        g.c.drawRect(skia.Rect.MakeXYWH(400, 440, 900, 230), g.fillp(BOARD, a * .95))
        method_view(g, 620, 1020, 530, t, k(2, .8), k(2, 1.5), k(2, 2.0), s=.8)
        g.text('a method', 620, 630, 30, T_ROM, INK, 'c', ramp(t, k(2, 1.2), k(2, 1.6)))
        g.text('a claim about the quarrel', 1020, 630, 30, T_ROM, INK, 'c', ramp(t, k(2, 2.4), k(2, 2.8)))
    tag(g, 'a curated sample: rough orientation, not a measurement', 1646, 706, 26, ramp(t, k(3, .6), k(3, 1.2)), GRAPH, 'r', T_ROMI)


# ---------------------------------------------------------------- 18 credits
CREDITS = [
    'Jacques-Louis David, The Death of Socrates, 1787. Metropolitan Museum of Art. CC0.',
    'Salvator Rosa, Democritus and Protagoras, 1663–64. Public domain.',
    'Raphael, The School of Athens, 1509–11. Public domain.',
    'Cesare Maccari, Cicero Denounces Catiline, 1888. Public domain.',
    'Babylonian Talmud, printed by Daniel Bomberg, 1519–23. Public domain.',
    'Laurentius de Voltolina, university lecture, 14th century. Public domain.',
    'John Milton, Areopagitica, title page, 1644. Public domain.',
    'Abraham Bosse, frontispiece of Leviathan, 1651. British Library. CC0.',
    'Christoph Bernhard Francke, portrait of Leibniz, about 1695. Public domain.',
    'Karl Anton Hickel, The House of Commons 1793–94. Public domain.',
]


def s_credits(g, t, d):
    g.text('THE HISTORY OF DISAGREEMENT', PW / 2, 96, 46, T_CAPS, INK, 'c', ramp(t, .2, .8))
    g.text('Drawn from the site History of Disagreement.  Plato in the translation of Benjamin Jowett, 1892.',
           PW / 2, 150, 27, T_ROM, INK, 'c', ramp(t, .6, 1.2))
    g.text('Images from Wikimedia Commons', 120, 226, 28, T_ROMB, INK, 'l', ramp(t, 1.2, 1.7))
    for i, c in enumerate(CREDITS):
        g.text(c, 120, 272 + i * 40, 25, T_ROM, INK, 'l', ramp(t, 1.4 + i * .15, 1.9 + i * .15))
    g.text('The narration is a synthetic voice.', 120, 706, 25, T_ROMI, GRAPH, 'l', ramp(t, 3.4, 3.9))


def sc(fn, *texts, **kw):
    return dict(fn=fn, **caps(*texts), **kw)


SCENES = [
    sc(s_title, 'A history of how people have argued, and of what they thought the argument was about.'),
    sc(s_euthyphro,
       'In Plato’s Euthyphro, Socrates makes an observation about quarrels. If two people differ about a number, they do not become enemies.',
       '“Do we not go at once to arithmetic, and put an end to them by a sum?”',
       'The differences that breed anger, he says, are about the just and the unjust, the good and the bad. For those there is no sum.'),
    sc(s_claim,
       'That passage holds a method and a diagnosis. The method is to measure. The diagnosis is that some disputes have no measure.',
       'Every way of arguing works like this. It assumes an answer to a prior question, which is what the disagreement is really about.',
       'Whoever adopts the method accepts its diagnosis, usually without noticing.'),
    sc(s_sophists,
       'Begin in Athens in the fifth century before the common era. Protagoras was reported to say that on every matter there are two opposed arguments.',
       'His drill follows from that. Argue the case, then argue its contrary with equal force. Disagreement is the normal condition of speech.',
       'The eristic went further and argued only to win. For him a dispute is a contest.'),
    sc(s_socrates,
       'Socrates turned question and answer to another end. He asked for a definition, won assent to further premises, and showed that they contradicted it.',
       'His diagnosis is that a person’s beliefs do not fit together.',
       'He called himself “quite as ready to be refuted as to refute.”'),
    sc(s_stasis,
       'Aristotle made the practice a discipline. His Topics catalogues the places from which arguments can be drawn.',
       'In the second century before the common era, Hermagoras told advocates to locate a dispute before arguing it.',
       'He set four questions in order: whether the thing happened, what to call it, whether it was justified, and who gets to decide.'),
    sc(s_vada,
       'Greece was one tradition among several. In India the Nyāya-sūtra defines vāda, debate in good faith among teacher, pupil and peer, aimed at truth.',
       'The medical compendium of Caraka likewise separates friendly discussion from hostile disputation, and gives etiquette for each.'),
    sc(s_talmud,
       'The Mishnah asks which disputes deserve to last. A dispute for the sake of Heaven, it says, will endure. Its model is Hillel and Shammai.',
       'In the Talmud a heavenly voice declares that both schools speak the words of the living God. The law still follows Hillel.',
       'The Mishnah records the minority view so that a later court may rely on it. A decision is made, and the loser is not declared false.'),
    sc(s_disputatio,
       'In the twelfth century Abelard set the authorities against one another in a book called Sic et Non, Yes and No.',
       'His rules for reconciling them say to check the text, the context, and above all the senses of words.',
       'The universities made this a ritual. One scholar objects, another answers, and the master determines.'),
    sc(s_three,
       'The seventeenth century gives three answers within a few decades. Milton trusts the collision. Let truth and falsehood grapple, he writes, in a free and open encounter.',
       'Hobbes holds that no one’s reason is right reason by nature. The parties must set up a judge and agree in advance to obey.',
       'Leibniz hopes for a notation in which disputants could say, let us calculate, and see who is right. No one has built it.'),
    sc(s_parliament,
       'Parliament took another course. Its rules of order let a body decide while it remains divided.',
       'The loyal opposition, named in 1826, makes disagreement a permanent and legitimate office.'),
    sc(s_older,
       'Sort the older methods by the diagnosis each puts first. Before 1500, about half locate disagreement in belief.',
       'None puts the psyche or the relationship first. Vanity and character are noticed, as secondary concerns.'),
    sc(s_turn,
       'The twentieth century changes that. In 1951 Carl Rogers names the tendency to judge as the main barrier to communication.',
       'His test is that each person may speak only after restating the previous speaker’s ideas and feelings, to that speaker’s satisfaction.',
       'Anatol Rapoport adds that a debater must first reduce the opponent’s sense of threat.',
       'Nonviolent Communication holds that needs never conflict, and that only strategies collide.',
       'Of the new methods between 1900 and 1975, nearly half start from the psyche or the relationship.'),
    sc(s_house,
       'Take one dispute. Three siblings inherit their mother’s house in equal shares. Ana has debts and wants to sell. Ben wants to keep it for the family.',
       'Cleo nursed their mother in that house and says it was promised to her. The will does not say so.'),
    sc(s_readings,
       'Socratic questioning finds beliefs that conflict. Ana says she respects her mother’s wishes, and also that only the will counts.',
       'It misses that exposure humiliates, and humiliation hardens positions in a family.',
       'Principled negotiation looks under the positions for interests. Ana needs cash, Ben wants continuity, and Cleo wants recognition. A buyout could serve all three.',
       'It misses that being paid for her care may feel to Cleo like an insult.',
       'Nonviolent Communication hears needs behind the accusations: acknowledgement, security, belonging. Once named, the needs do not conflict.',
       'It misses the arithmetic. The house still cannot be both sold and kept.',
       'Each method sees a real part of the dispute and misses what the others see. The quarrel is about several things at once.'),
    sc(s_after,
       'The therapeutic turn has not been reversed. Belief also came back.',
       'In adversarial collaboration, scientists who disagree design one study together and agree in advance what would count against each of them.',
       'The double crux looks for a single testable question on which both conclusions depend.',
       'Since 1975 the two diagnoses stand level. As many new methods start from belief as from the psyche or the relationship.'),
    sc(s_close,
       'The oldest advice survives this history. Before arguing, locate the dispute: fact, name, justification, or who decides.',
       'Its limit is plain. It has no question for fear, pride, a damaged relationship, competing interests, or attachment to being right.',
       'The choice of a method is already a claim about what the quarrel is.',
       'The methods counted here are a curated sample. The numbers give a rough orientation and do not measure the field.'),
    sc(s_credits, 'This video draws on the site History of Disagreement. The narration is a synthetic voice.'),
]
