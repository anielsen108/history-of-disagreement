"""scenes.py: the banner film. Seventeen categories of the site, one board each. Timings are NOMINAL.
Each category keeps the colour the site gives it; colour is used for nothing else."""
import os
from kit import *

IMG_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'img')
_img = {}
C = 5.0
SAY = {'Nāgārjuna': 'Naagaarjuna', 'jalpa': 'jalpa', 'Zhuangzi': 'Jwahng-dzuh', 'Havruta': 'Khavroota', 'Asante': 'Ashanti'}


def hx(s):
    return tuple(int(s[i:i + 2], 16) for i in (1, 3, 5))


# (id, plain name, site term, colour) in the site's order
VIEWS = [('epistemic', 'what is true', 'Epistemic', hx('#4d729a')), ('linguistic', 'words', 'Linguistic', hx('#7f679d')),
         ('power', 'who rules', 'Power', hx('#8e3d3d')), ('axiological', 'values', 'Axiological', hx('#a88c3c')),
         ('interest', 'what people want', 'Interest', hx('#458364')), ('relational', 'us', 'Relational', hx('#a7477f')),
         ('psyche', 'what is happening inside', 'Psyche', hx('#b0643d')), ('contemplative', 'attachment', 'Contemplative', hx('#6e8d97')),
         ('generative', 'no trouble at all', 'Generative', hx('#636f44'))]
AIMS = [('truth', 'truth', hx('#4170a1')), ('formation', 'formation', hx('#9c803c')), ('victory', 'victory', hx('#af4444')),
        ('plurality', 'plurality', hx('#5a8846')), ('decision', 'decision', hx('#6f54ad')), ('settlement', 'settlement', hx('#47968b')),
        ('understanding', 'understanding', hx('#ca7841')), ('release', 'release', hx('#9d6a8b'))]
# methods counted by (domain of primary view, aim), from the site's data
LINKS = [[17, 3, 1, 1, 3, 0, 2, 1], [3, 0, 0, 0, 2, 0, 1, 0], [0, 1, 3, 1, 1, 0, 0, 0], [0, 0, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 2, 4, 0, 0],
         [0, 0, 0, 0, 2, 0, 4, 0], [0, 0, 1, 0, 0, 0, 6, 0], [0, 0, 0, 2, 2, 0, 0, 3], [2, 1, 0, 0, 2, 1, 1, 0]]


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
    if a <= 0:
        return
    im = img(key)
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
    if a <= 0:
        return
    wd = F(tf, size).measureText(txt)
    x0 = x - (wd / 2 if align == 'c' else wd if align == 'r' else 0)
    g.c.drawRect(skia.Rect.MakeXYWH(x0 - pad, y - size * .95, wd + 2 * pad, size * 1.4), g.fillp(BOARD, a * .93))
    g.text(txt, x0, y, size, tf, color, 'l', a)


def para(g, txt, x, y, size, tf, color, a, maxw, lh=1.3):
    """Wrapped text; returns the y of the line after the last."""
    for i, ln in enumerate(wrap(txt, F(tf, size), maxw)):
        g.text(ln, x, y + i * size * lh, size, tf, color, 'l', a)
    return y + len(wrap(txt, F(tf, size), maxw)) * size * lh


def mark(g, x, y, r, color, square, a=1.0, fill=None, lw=3.0, p=1.0):
    if square:
        g.box(x - r, y - r, 2 * r, 2 * r, color, lw, p, a, fill=fill, over=3)
    else:
        g.ellipse(x, y, r, r, color, lw, p, a, fill=fill)


def person(g, x, y, s=1.0, color=INK, p=1.0, a=1.0, arm=0):
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


# ---------------------------------------------------------------- the rail
def rail_y(i):
    return 62 + i * 37 + (26 if i >= 9 else 0)


def rail(g, cur, a=1.0):
    """All seventeen marks down the left edge: circles for views, squares for aims. The current one is lit."""
    for i in range(17):
        sq = i >= 9
        colr = (AIMS[i - 9][2] if sq else VIEWS[i][3])
        y = rail_y(i)
        if i == cur:
            mark(g, 78, y, 15, colr, sq, a, fill=colr, lw=3.2)
        elif i < cur:
            mark(g, 78, y, 9, colr, sq, a * .9, fill=colr, lw=2.0)
        else:
            mark(g, 78, y, 9, GRAPH, sq, a * .7, lw=2.0)


# ---------------------------------------------------------------- the two-column map
def col_y(i, n):
    return 138 + i * (490 / (n - 1))


def twocol(g, t, tv, ta, tl=None, dim_views=0.0, names=True, lx=560, rx=1140):
    """Views on the left (circles), aims on the right (squares). tv, ta = times the columns start to appear; tl = threads."""
    if tl is not None:
        for i in range(9):
            for j in range(8):
                n = LINKS[i][j]
                if n:
                    t0 = tl + (i * 8 + j) * .03
                    g.line(lx + 22, col_y(i, 9), rx - 22, col_y(j, 8), GRAPH, 1.2 + n * .9, ramp(t, t0, t0 + .8), .55, amp=.6)
    g.text('what it is really about', lx, 84, 30, T_ROMI, GRAPH, 'r', ramp(t, tv, tv + .5) * (1 - .5 * dim_views))
    g.text('what the exchange is for', rx, 84, 30, T_ROMI, GRAPH, 'l', ramp(t, ta, ta + .5))
    for i, (_, plain, term, colr) in enumerate(VIEWS):
        t0 = tv + .2 + i * .22
        a = ramp(t, t0, t0 + .4) * (1 - .55 * dim_views)
        mark(g, lx, col_y(i, 9), 15, colr, False, a, fill=colr)
        if names:
            g.text(plain, lx - 34, col_y(i, 9) + 11, 32, T_ROM, INK, 'r', a)
    for j, (_, plain, colr) in enumerate(AIMS):
        t0 = ta + .2 + j * .22
        a = ramp(t, t0, t0 + .4)
        mark(g, rx, col_y(j, 8), 15, colr, True, a, fill=colr)
        if names:
            g.text(plain, rx + 34, col_y(j, 8) + 11, 32, T_ROM, INK, 'l', a)


# ---------------------------------------------------------------- generic category board
TX, TW = 880, 770


def category(g, t, d, idx, kicker, plain, term, colr, lead, rows, ends, art, credit_txt):
    rail(g, idx)
    u = t / d
    art(g, t, u)
    if credit_txt:
        g.text(credit_txt, 180, 722, 21, T_ROMI, GRAPH, 'l', ramp(t, .8, 1.3))
    g.text(kicker, TX, 82, 28, T_ROMI, GRAPH, 'l', ramp(t, .2, .6))
    size = 64 if F(T_ROMB, 64).measureText(plain) <= TW else 52
    g.text(plain, TX, 152, size, T_ROMB, colr, 'l', p=ramp(t, .4, 1.3))
    if term:
        g.text('the site’s term: ' + term, TX, 192, 24, T_ROMI, GRAPH, 'l', ramp(t, 1.4, 1.9))
    para(g, lead, TX, 252, 30, T_ROMI, INK, ramp(t, 1.8, 2.5), TW)
    y = 366
    for i, (nm, ph) in enumerate(rows):
        t0 = k(1, .5 + i * 1.3)
        a = ramp(t, t0, t0 + .5)
        g.text(nm, TX, y, 30, T_ROMB, INK, 'l', a)
        y = (para(g, ph, TX, y + 34, 27, T_ROM, GRAPH, a, TW, 1.2) + 14) if ph else y + 52
    if ends:
        t0 = k(2, .8)
        g.line(TX, 590, TX + 110, 590, colr, 3.0, ramp(t, t0, t0 + .5))
        g.text('ends with', TX, 624, 24, T_ROMI, GRAPH, 'l', ramp(t, t0 + .2, t0 + .6))
        para(g, ends, TX, 664, 30, T_ROMB, colr, ramp(t, t0 + .5, t0 + 1.1), TW, 1.2)


def art_pic(key, cx=.5, cy=.5, zoom=1.0, dz=.05, dy=0.0):
    def f(g, t, u):
        pic(g, key, 180, 50, 640, 640, ramp(t, 0, 1.0), cx, cy + dy * u, zoom + dz * u)
    return f


def art_relational(g, t, u):
    g.box(180, 50, 640, 640, INK, 3.0, ramp(t, 0, 1.0), over=5)
    person(g, 300, 470, 1.3, INK, ramp(t, .4, 1.4), arm=1)
    person(g, 700, 470, 1.3, INK, ramp(t, .7, 1.7), arm=-1)
    g.arrow(360, 300, 640, 300, INK, 3.2, ramp(t, 1.6, 2.3))
    g.text('what is said', 500, 280, 28, T_ROM, INK, 'c', ramp(t, 2.0, 2.4))
    g.arrow(360, 380, 640, 380, hx('#a7477f'), 3.6, ramp(t, k(1, .6), k(1, 1.4)))
    g.text('what it says about us', 500, 424, 28, T_ROMI, hx('#a7477f'), 'c', ramp(t, k(1, 1.2), k(1, 1.7)))
    g.text('“the dishes”', 500, 560, 34, T_ROM, INK, 'c', ramp(t, k(1, 2.2), k(1, 2.7)))
    g.text('dominance and care', 500, 610, 30, T_ROMI, hx('#a7477f'), 'c', ramp(t, k(1, 3.0), k(1, 3.5)))


def art_understanding(g, t, u):
    colr = hx('#ca7841')
    g.box(180, 50, 640, 640, INK, 3.0, ramp(t, 0, 1.0), over=5)
    person(g, 300, 500, 1.3, INK, ramp(t, .4, 1.4), arm=1)
    person(g, 700, 500, 1.3, INK, ramp(t, .7, 1.7), arm=-1)
    g.arrow(360, 300, 640, 300, INK, 3.2, ramp(t, 1.6, 2.3))
    g.text('says it', 500, 280, 28, T_ROM, INK, 'c', ramp(t, 2.0, 2.4))
    g.arrow(640, 380, 360, 380, colr, 3.6, ramp(t, k(1, .5), k(1, 1.3)))
    g.text('says it back, accurately', 500, 424, 28, T_ROMI, colr, 'c', ramp(t, k(1, 1.0), k(1, 1.5)))
    g.text('agreement optional', 500, 610, 30, T_ROMI, GRAPH, 'c', ramp(t, 3.0, 3.5))


def art_release(g, t, u):
    colr = hx('#9d6a8b')
    g.box(180, 50, 640, 640, INK, 3.0, ramp(t, 0, 1.0), over=5)
    g.line(500, 190, 500, 520, INK, 3.4, ramp(t, .5, 1.2))
    g.line(420, 520, 580, 520, INK, 3.4, ramp(t, 1.0, 1.5))
    g.line(300, 230, 700, 230, INK, 3.4, ramp(t, 1.2, 1.9))
    for x, lab, t0 in ((300, 'for', 1.8), (700, 'against', 2.2)):
        g.line(x, 230, x - 60, 350, INK, 2.4, ramp(t, t0, t0 + .4))
        g.line(x, 230, x + 60, 350, INK, 2.4, ramp(t, t0, t0 + .4))
        g.poly(ell_pts(x, 350, 70, 16), INK, 3.0, True, ramp(t, t0 + .3, t0 + .8), fill=BOARD)
        g.text(lab, x, 410, 30, T_ROM, INK, 'c', ramp(t, t0 + .6, t0 + 1.0))
    g.text('equal force', 500, 172, 28, T_ROMI, GRAPH, 'c', ramp(t, 3.0, 3.5))
    g.text('judgment suspended', 500, 610, 32, T_ROMI, colr, 'c', ramp(t, k(1, .8), k(1, 1.4)))


def view_board(i, lead, rows, ends, art, credit_txt):
    _, plain, term, colr = VIEWS[i]
    return lambda g, t, d: category(g, t, d, i, 'It is really about', plain, term, colr, lead, rows, ends, art, credit_txt)


def aim_board(j, lead, rows, art, credit_txt):
    _, plain, colr = AIMS[j]
    return lambda g, t, d: category(g, t, d, 9 + j, 'The exchange is for', plain, None, colr, lead, rows, None, art, credit_txt)


# ---------------------------------------------------------------- opening, hinge, close
def s_title(g, t, d):
    g.text('WHAT IS THIS DISAGREEMENT', PW / 2, 280, 76, T_CAPS, INK, 'c', p=ramp(t, .3, 1.6))
    g.text('REALLY ABOUT?', PW / 2, 372, 76, T_CAPS, INK, 'c', p=ramp(t, 1.4, 2.4))
    g.line(420, 414, 1280, 414, INK, 3.4, ramp(t, 2.2, 3.0))
    g.text('a map of the site History of Disagreement', PW / 2, 480, 38, T_ROMI, GRAPH, 'c', ramp(t, 2.8, 3.4))
    for i in range(17):
        sq = i >= 9
        colr = AIMS[i - 9][2] if sq else VIEWS[i][3]
        t0 = 3.2 + i * .08
        mark(g, 850 + (i - 8) * 52 + (14 if sq else -14), 590, 13, colr, sq, ramp(t, t0, t0 + .4), fill=colr, lw=2.4)


def s_socrates(g, t, d):
    u = t / d
    pic(g, 'socrates', 0, 0, PW, PH, ramp(t, 0, 1.0), .5, lerp(.44, .47, u), lerp(1.0, 1.07, u), frame=False)
    tag(g, 'Jacques-Louis David, The Death of Socrates, 1787', 54, PH - 34, 23, ramp(t, 1.0, 1.6), GRAPH, 'l', T_ROMI, 9)
    tag(g, 'Plato, Euthyphro 7b–d', 1646, 70, 30, ramp(t, 1.4, 2.0), INK, 'r')
    tag(g, 'a number:  settled by a sum', 1646, 150, 32, ramp(t, 2.6, 3.2), INK, 'r')
    tag(g, 'the just and the unjust:  no sum', 1646, 206, 32, ramp(t, k(1, 1.5), k(1, 2.1)), INK, 'r', T_ROMB)


def s_claim(g, t, d):
    g.text('how to argue', 1140, 96, 30, T_ROMI, GRAPH, 'l', ramp(t, .4, .9) * (1 - ramp(t, k(1, 0), k(1, .4))))
    g.text('what the argument is about', 560, 96, 30, T_ROMI, GRAPH, 'r', ramp(t, 1.2, 1.7) * (1 - ramp(t, k(1, 0), k(1, .4))))
    g.arrow(1110, 86, 600, 86, INK, 3.0, ramp(t, 2.2, 3.2), 1 - ramp(t, k(1, 0), k(1, .4)))
    g.text('every method assumes an answer', 850, 60, 28, T_ROM, INK, 'c', ramp(t, 3.0, 3.6) * (1 - ramp(t, k(1, 0), k(1, .4))))
    if t >= k(1, .2):
        twocol(g, t, k(1, .5), k(1, 2.6), k(2, .4))
    g.text('find the diagnosis, then the method', PW / 2, 706, 30, T_ROMI, INK, 'c', ramp(t, k(2, 2.6), k(2, 3.2)))


def s_hinge(g, t, d):
    twocol(g, t, -9, 1.4, None, dim_views=ramp(t, .6, 1.6))
    g.text('the same quarrel, eight possible ends', PW / 2, 706, 30, T_ROMI, INK, 'c', ramp(t, 3.4, 4.0))


def s_threads(g, t, d):
    twocol(g, t, -9, -9, .5)
    g.text('each thread: methods that presuppose that view', PW / 2, 706, 28, T_ROMI, GRAPH, 'c', ramp(t, 2.6, 3.2) * (1 - ramp(t, k(1, 0), k(1, .5))))
    a = ramp(t, k(1, .4), k(1, 1.0))
    if a > 0:
        # two parties with different diagnoses
        g.text('A’s remedy looks to B like a dodge', PW / 2, 706, 32, T_ROMB, INK, 'c', ramp(t, k(1, 1.8), k(1, 2.4)) * (1 - ramp(t, k(2, 0), k(2, .5))))
        g.text('several things at once: no one method hears everyone', PW / 2, 706, 32, T_ROMB, INK, 'c', ramp(t, k(2, .8), k(2, 1.4)))
        g.ellipse(560, col_y(0, 9), 26, 26, INK, 3.4, ramp(t, k(1, .6), k(1, 1.2)), 1 - ramp(t, k(2, 0), k(2, .5)))
        g.text('A', 560, col_y(0, 9) - 32, 28, T_ROMB, INK, 'c', ramp(t, k(1, .8), k(1, 1.2)) * (1 - ramp(t, k(2, 0), k(2, .5))))
        g.ellipse(560, col_y(6, 9), 26, 26, INK, 3.4, ramp(t, k(1, 1.0), k(1, 1.6)), 1 - ramp(t, k(2, 0), k(2, .5)))
        g.text('B', 560, col_y(6, 9) - 32, 28, T_ROMB, INK, 'c', ramp(t, k(1, 1.2), k(1, 1.6)) * (1 - ramp(t, k(2, 0), k(2, .5))))


def s_doors(g, t, d):
    doors = [('Use', 'I have a dispute', 'Diagnose it: where it lives,', 'and methods built for that'),
             ('Browse', 'I want the map', 'Every method joined to', 'the views it presupposes'),
             ('Read', 'I want to read', 'Short paths of entries', 'across traditions')]
    for i, (verb, h, l1, l2) in enumerate(doors):
        x, t0 = 180 + i * 480, .4 + i * 1.3
        g.box(x, 110, 380, 500, INK, 3.4, ramp(t, t0, t0 + 1.0), fill=BOARD)
        g.ellipse(x + 330, 370, 9, 9, INK, 2.6, ramp(t, t0 + .8, t0 + 1.1))
        g.text(verb, x + 190, 220, 64, T_ROMB, INK, 'c', ramp(t, t0 + .6, t0 + 1.0))
        g.text(h, x + 190, 290, 32, T_ROMI, GRAPH, 'c', ramp(t, t0 + .9, t0 + 1.3))
        g.text(l1, x + 190, 440, 27, T_ROM, INK, 'c', ramp(t, t0 + 1.1, t0 + 1.5))
        g.text(l2, x + 190, 478, 27, T_ROM, INK, 'c', ramp(t, t0 + 1.1, t0 + 1.5))
    g.text('a curated sample, with its own uncertainty flagged on each entry', PW / 2, 690, 28, T_ROMI, GRAPH, 'c', ramp(t, k(1, .6), k(1, 1.2)))


CREDITS = [
    'Jacques-Louis David, The Death of Socrates, 1787. Metropolitan Museum of Art. CC0.',
    'Raphael, The School of Athens, 1509–11.   Pieter Bruegel the Elder, The Tower of Babel, 1563.',
    'Abraham Bosse, frontispiece of Leviathan, 1651. British Library. CC0.',
    'Annibale Carracci, The Choice of Hercules, 1596.   Quentin Massys, The Moneylender and His Wife, 1514.',
    'Francisco Goya, The Sleep of Reason Produces Monsters, 1799. Metropolitan Museum of Art. CC0.',
    'Lu Zhi, Zhuangzi Dreaming of a Butterfly, mid-16th century.',
    'Laurentius de Voltolina, university lecture, 14th century.   Cesare Maccari, Cicero Denounces Catiline, 1888.',
    'Babylonian Talmud, printed by Daniel Bomberg, 1519–23.   Karl Anton Hickel, The House of Commons 1793–94.',
    'Gerard ter Borch, The Ratification of the Treaty of Münster, 1648.',
]


def s_credits(g, t, d):
    g.text('HISTORY OF DISAGREEMENT', PW / 2, 96, 46, T_CAPS, INK, 'c', ramp(t, .2, .8))
    g.text('Every claim here is drawn from the site.  Plato in the translation of Benjamin Jowett, 1892.', PW / 2, 150, 27, T_ROM, INK, 'c', ramp(t, .6, 1.2))
    g.text('Images from Wikimedia Commons, public domain unless marked', 120, 230, 28, T_ROMB, INK, 'l', ramp(t, 1.2, 1.7))
    for i, c in enumerate(CREDITS):
        g.text(c, 120, 278 + i * 42, 25, T_ROM, INK, 'l', ramp(t, 1.4 + i * .15, 1.9 + i * .15))
    g.text('The narration is a synthetic voice.', 120, 706, 25, T_ROMI, GRAPH, 'l', ramp(t, 3.4, 3.9))


def sc(fn, extra, *texts, **kw):
    """extra = seconds of reading time for what is drawn on the board (at most 6)."""
    return dict(fn=fn, extra=extra, **caps(*texts), **kw)


Q = 'Ask: '
SCENES = [
    sc(s_title, 1, 'What is this disagreement really about?'),
    sc(s_socrates, 1.5,
       'In Plato’s Euthyphro, Socrates notes that people who differ about a number do not become enemies. They go to arithmetic and settle it with a sum.',
       'The quarrels that breed anger, he says, are about the just and the unjust. For those there is no sum.'),
    sc(s_claim, 6,
       'So before asking how to argue, ask what the argument is about. Every method for handling disagreement assumes an answer to that question.',
       'This site maps both. On one side are nine answers to what a dispute is really about. On the other are eight things an exchange can be for.',
       'The site helps you find which answer fits your dispute, and which methods were built for it.'),
    # ---- nine views
    sc(view_board(0, 'Do you disagree about what happened, what is the case, or what will happen?',
                  [('Error', 'two contradictory claims cannot both be true'), ('Divergent priors', 'the parties began from different models'),
                   ('Partial perspectives', 'each sees a real part of something larger')],
                  'evidence, a test, or a better argument', art_pic('athens', .5, .52, 1.0), 'Raphael, The School of Athens, 1509–11'), 4,
       'The first answer: it is about what is true. You disagree about what happened, what is the case, or what will happen.',
       'Most people assume this view without stating it. Two contradictory claims cannot both be true, so someone is wrong. Newer forms say the parties began from different priors, or that each sees a real part of something larger.',
       'A dispute of this kind ends with evidence, a test, or a better argument.'),
    sc(view_board(1, 'Are you using the same words to mean different things, or arguing over what to call something?',
                  [('Confucius', 'when names are not correct, speech will not accord with things'),
                   ('William James', 'does the man go round the squirrel? It depends on “round”')],
                  'agreed definitions, or a dispute over usage made explicit', art_pic('babel', .45, .45, 1.0), 'Pieter Bruegel the Elder, The Tower of Babel, 1563'), 4,
       'The second: it is about words. You use the same word to mean different things, or you are arguing over what to call something.',
       'Confucius held that when names are not correct, speech will not accord with things. William James asked whether a man goes round a squirrel, which depends on what round means.',
       'A dispute about words can matter as much as one about facts, because words have consequences. It ends with agreed definitions, or with the question of usage made explicit.'),
    sc(view_board(2, 'Is the real question who gets to decide, or who has standing to speak?',
                  [('Hobbes', 'private judgment is the seed of civil war'), ('Foucault', 'who may speak is decided before what is said')],
                  'a decision procedure both accept as legitimate', art_pic('leviathan', .5, .25, 1.0, .04), 'Abraham Bosse, frontispiece of Leviathan, 1651'), 4,
       'The third: it is about who rules. The real question is who gets to decide, or who has standing to speak.',
       'For Hobbes, private judgment about right and wrong is the seed of civil war, and only an agreed arbiter ends it. For Foucault, who may speak is decided before what is said.',
       'This kind ends with a decision procedure that both accept as legitimate.'),
    sc(view_board(3, 'Do you weigh what matters differently, even where you agree on the facts?',
                  [('Weber and Berlin', 'goods are many, with no single scale'), ('Sacred values', 'offering money for them provokes outrage')],
                  'a choice of priorities, or an arrangement for coexistence', art_pic('hercules', .5, .5, 1.0), 'Annibale Carracci, The Choice of Hercules, 1596'), 4,
       'The fourth: it is about values. You weigh what matters differently, even where you agree on the facts.',
       'Max Weber and Isaiah Berlin held that the ultimate goods are many and cannot be measured on one scale. On this view a disagreement can be accurate. The parties correctly see that their values are incompatible.',
       'Some values are sacred, and offering money for them provokes outrage. This kind ends with a choice of priorities, or an arrangement for coexistence.'),
    sc(view_board(4, 'Is something scarce at stake: money, time, land, a job, a share?',
                  [('Follett; Fisher and Ury', 'a position is a strategy for an interest'), ('Madison', 'the causes of faction are sown in human nature')],
                  'a deal both can accept', art_pic('moneylender', .5, .5, 1.0), 'Quentin Massys, The Moneylender and His Wife, 1514'), 4,
       'The fifth: it is about what people want. Something scarce is at stake: money, time, land, a job, a share.',
       'Mary Parker Follett, and later Fisher and Ury, separated positions from interests. What people say they want is a strategy for what they need, and the interests often fit together where the positions do not.',
       'Madison thought the causes of faction are sown in human nature and can only be controlled. This kind ends with a deal both can accept.'),
    sc(view_board(5, 'Does it feel as if respect, identity or the relationship itself is on the line?',
                  [('Watzlawick', 'every message also says something about the relationship'), ('Identity', 'conceding the point feels like losing oneself')],
                  'recognition, respect and repair', art_relational, ''), 5,
       'The sixth: it is about us. Respect, identity, or the relationship itself feels on the line.',
       'Every message has a content, and a second message about the relationship. Couples argue about the dishes while negotiating dominance and care.',
       'Conceding the point can feel like losing oneself. This kind ends with recognition, respect and repair.'),
    sc(view_board(6, 'Are fear, pride, hurt or a need for safety driving the exchange?',
                  [('Rogers', 'a person who feels threatened cannot hear'), ('Vanity', 'a stated position becomes a matter of self-regard'),
                   ('Rosenberg', 'conflict is what unmet needs sound like')],
                  'safety and being heard', art_pic('goya', .5, .42, 1.0), 'Francisco Goya, The Sleep of Reason Produces Monsters, 1799'), 4,
       'The seventh: it is about what is happening inside. Fear, pride, hurt, or a need for safety is driving the exchange.',
       'A person who feels threatened cannot hear, so better logic does not help. Once a position is stated, defending it becomes a matter of self-regard. Marshall Rosenberg heard conflict as the sound of unmet needs.',
       'This kind ends with safety and being heard.'),
    sc(view_board(7, 'Is something sacred at stake, or is someone (perhaps you) holding on to being right?',
                  [('Early Buddhist verses', 'suffering in dispute comes from grasping at views'), ('Zhuangzi', 'every “this” is a “that” from the other side'),
                   ('The Talmud', 'both are the words of the living God')],
                  'letting go of the position, or reverence for what is at stake', art_pic('zhuangzi', .5, .62, 1.25), 'Lu Zhi, Zhuangzi Dreaming of a Butterfly, 16th century'), 4,
       'The eighth: it is about attachment. Something sacred is at stake, or someone, perhaps you, is holding on to being right.',
       'The earliest Buddhist verses say that suffering in dispute comes from grasping at views, whichever view is right. Zhuangzi adds that every this is said from a standpoint, and from the other side it is that.',
       'The Talmud takes another road and calls both sides the words of the living God. This kind ends with letting go of the position, or with reverence for what is at stake.'),
    sc(view_board(8, 'Could the disagreement itself be useful, as a source of new ideas or a check on error?',
                  [('Heraclitus', 'war is father of all'), ('Mill', 'truth unchallenged becomes dead dogma'), ('Follett', 'conflict as friction in an engine')],
                  'nothing to end: keep the tension productive', art_pic('athens', .43, .70, 2.8, .1), 'Heraclitus, detail of Raphael, The School of Athens'), 4,
       'The ninth answer denies that there is a trouble. The disagreement itself could be useful, as a source of new ideas or a check on error.',
       'Heraclitus called war the father of all. Mill held that truth unchallenged becomes dead dogma. Follett compared conflict to friction in an engine.',
       'On this view nothing needs ending. The task is to keep the tension productive and leave it open.'),
    # ---- hinge
    sc(s_hinge, 3,
       'Those are nine diagnoses. The second question is what the exchange is for. The same quarrel can be conducted toward eight different ends.'),
    # ---- eight aims
    sc(aim_board(0, 'Someone is wrong. Talk to remove the error; winning is incidental.',
                 [('Socratic questioning', ''), ('Scholastic disputation', ''), ('Peer review', ''), ('The double crux', '')],
                 art_pic('socrates', .5, .40, 1.5), 'detail of David, The Death of Socrates'), 3,
       'The first aim is truth. The parties treat disagreement as a sign that someone is wrong, and they talk to remove the error. Winning is incidental.',
       'Here belong Socratic questioning, the scholastic disputation, peer review, and the double crux.'),
    sc(aim_board(1, 'A gymnasium. The product is a trained disputant; the question may stay open.',
                 [('Tibetan monastic debate', 'standing, clapping, pressing consequences'), ('Havruta', 'two learners argue through a text aloud'),
                  ('Competitive debate', 'sides assigned, often by lot')],
                 art_pic('lecture', .5, .45, 1.0), 'Laurentius de Voltolina, a university lecture, 14th century'), 3,
       'The second is formation. Disputation is a gymnasium. Its product is a trained disputant, and the question may stay open.',
       'Tibetan monks debate standing and clapping. Havruta partners argue through a text aloud. Competitive debaters argue whichever side they are given.'),
    sc(aim_board(2, 'A contest. The product is a winner, a reputation, or an audience persuaded.',
                 [('Eristic', 'the Greek who argues only to win'), ('Jalpa', 'in Indian logic: a hedge of thorns around the seedling of truth')],
                 art_pic('cicero', .25, .55, 1.0), 'Cesare Maccari, Cicero Denounces Catiline, 1888'), 3,
       'The third is victory. The exchange is a contest, and its product is a winner, a reputation, or an audience persuaded.',
       'The Greek eristic argued only to win. Indian logic named the same practice jalpa, and compared it to a hedge of thorns that protects the seedling of truth.'),
    sc(aim_board(3, 'Keep the disagreement on record and honour it. Ending it would be a loss.',
                 [('The Mishnah', 'records the minority opinion'), ('Islamic jurists', 'a science that catalogues their disagreements'),
                  ('Jain logic', 'rival doctrines as partial truths')],
                 art_pic('talmud', .5, .45, 1.0), 'Babylonian Talmud, printed by Daniel Bomberg, 1519–23'), 3,
       'The fourth is plurality. The parties keep the disagreement on record and honour it. Ending it would be a loss.',
       'The Mishnah records the minority opinion. Islamic jurists built a science that catalogues their disagreements and makes no attempt to remove them. Jain logic treats rival doctrines as partial truths.'),
    sc(aim_board(4, 'A group must act. A binding choice is made, and the disagreement stays in place.',
                 [('Parliament: a vote', ''), ('The court: a trial', ''), ('The Quaker meeting: no vote at all', ''), ('Citizens’ assemblies: members chosen by lot', '')],
                 art_pic('commons', .5, .55, 1.0), 'Karl Anton Hickel, The House of Commons 1793–94'), 3,
       'The fifth is decision. A group must act. It turns disagreement into a binding choice and leaves the disagreement in place.',
       'Parliaments do this with a vote, courts with a trial, Quaker meetings with no vote at all, and citizens’ assemblies with members chosen by lot.'),
    sc(aim_board(5, 'The parties want different things. Seek terms both can accept.',
                 [('Mediation', ''), ('Principled negotiation', ''), ('The Asante council', 'talk continues until all can accept a basis for action')],
                 art_pic('munster', .5, .5, 1.0), 'Gerard ter Borch, The Ratification of the Treaty of Münster, 1648'), 3,
       'The sixth is settlement. The parties want different things, and the exchange seeks terms both can accept.',
       'Mediation and principled negotiation work here. So does the Asante council, where talk continues until all can accept a basis for action.'),
    sc(aim_board(6, 'Understand the other accurately and repair the relationship.',
                 [('Carl Rogers', 'restate the other speaker first'), ('Restorative circles', 'name the harm, take responsibility, repair'),
                  ('Truth commissions', 'a public record; no sentence passed')],
                 art_understanding, ''), 4,
       'The seventh is understanding. Each party tries to understand the other accurately and to repair the relationship. Agreement is optional.',
       'Carl Rogers asked each speaker to restate the other first. Restorative circles and truth commissions bring whole communities to the same work.'),
    sc(aim_board(7, 'Freedom from the grip of positions.',
                 [('The Pyrrhonist', 'equal arguments, judgment suspended'), ('Nāgārjuna', 'refutes every thesis and advances none'),
                  ('Zhuangzi', 'lets “this” and “that” both proceed')],
                 art_release, ''), 4,
       'The eighth is release. The parties seek freedom from the grip of positions.',
       'The Pyrrhonist sets equal arguments against each other and suspends judgment. Nāgārjuna refutes every thesis and advances none. Zhuangzi lets this and that both proceed.'),
    # ---- close
    sc(s_threads, 6,
       'The two columns are joined. Each method presupposes a view, and the site draws a thread for every such link.',
       'When two people hold different diagnoses, they talk past each other. Each one’s remedy looks to the other like a dodge.',
       'Most quarrels are about several things at once, so no single method hears everyone.'),
    sc(s_doors, 5,
       'The site has three doors. Use it to diagnose a dispute of your own. Browse the map of methods and views. Read a short path across traditions.',
       'The entries are a curated sample, and each one flags its own uncertainty.'),
    sc(s_credits, 6, 'This film draws on the site History of Disagreement. The narration is a synthetic voice.'),
]
