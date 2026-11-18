#!/usr/bin/env python3
"""build.py proof <scene#> <nominal_t> <out.png> | voice | scene <scene#> | finish <out.mp4>"""
import json, os, re, subprocess, sys
import numpy as np, skia, soundfile as sf
from kit import *
from scenes import SCENES, SAY

SLOW = 2.0     # picture runs at 1/SLOW of the nominal timings written in scenes.py
LEAD = 0.3     # seconds between a caption appearing and its first sentence
BREATH = 0.45  # silence after every sentence
TAIL = 2.0     # extra hold at the end of every board
PAUSE = float(os.environ.get('PAUSE', 2.0))    # minimum silence after every sentence
SR = 44100
VOICE_ID, MODEL_ID = 'onwK4e9ZLuTAKqWW03F9', 'eleven_multilingual_v2'     # Daniel
SETTINGS = dict(stability=0.55, similarity_boost=0.75, speed=0.94)
ENC = ['-c:v', 'libx264', '-crf', '18', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-r', str(FPS), '-video_track_timescale', '15360']


def tts(sent, prev, nxt, fn):
    """One sentence from ElevenLabs, cached by content. The key is supplied by the environment, not by this file."""
    import hashlib
    h = hashlib.sha1(json.dumps([VOICE_ID, MODEL_ID, SETTINGS, sent, prev, nxt]).encode()).hexdigest()[:16]
    cache = 'vo/cache/%s.wav' % h
    if not os.path.exists(cache):
        body = dict(text=sent, model_id=MODEL_ID, voice_settings=SETTINGS)
        if prev:
            body['previous_text'] = prev
        if nxt:
            body['next_text'] = nxt
        hdr = ['-H', 'content-type: application/json']
        if os.environ.get('ELEVENLABS_API_KEY'):
            hdr += ['-H', 'xi-api-key: ' + os.environ['ELEVENLABS_API_KEY']]
        for attempt in range(4):
            r = subprocess.run(['curl', '-sS', '-m', '120', '-o', 'vo/tmp.mp3', '-w', '%{http_code}', '-X', 'POST',
                                'https://api.elevenlabs.io/v1/text-to-speech/%s?output_format=mp3_44100_128' % VOICE_ID] + hdr +
                               ['-d', json.dumps(body)], capture_output=True, text=True)
            if r.stdout.strip() == '200':
                break
            print('tts retry', r.stdout, open('vo/tmp.mp3', 'rb').read()[:300])
            import time; time.sleep(5 * (attempt + 1))
        else:
            sys.exit('tts failed: ' + sent)
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'vo/tmp.mp3', '-ac', '1', '-ar', str(SR), cache], check=True)
    x, sr = sf.read(cache, dtype='float32')
    assert sr == SR
    nz = np.nonzero(np.abs(x) > .006)[0]
    x = x[max(0, nz[0] - 800): nz[-1] + 2400]
    sf.write(fn, x, SR)
    return len(x) / SR


def voice():
    """One clip per sentence, then a window per caption: long enough for the picture at 1/SLOW AND for
    its sentences with PAUSE after each. Spare time is shared equally after the sentences."""
    os.makedirs('vo/cache', exist_ok=True)
    plan, start, chars = [], 0, 0
    for si, sc in enumerate(SCENES):
        segs = []
        for ci, (t0, text) in enumerate(sc['caps']):
            t1 = sc['caps'][ci + 1][0] if ci + 1 < len(sc['caps']) else sc['dur']
            clips = []
            sents = [x for x in re.split(r'(?<=[.!?"\u201d])\s+', text.strip()) if x]
            for j, sent in enumerate(sents):
                def say(z):
                    for a, b in SAY.items():
                        z = z.replace(a, b)
                    return z
                fn = 'vo/%02d_%d_%d.wav' % (si + 1, ci, j)
                d = tts(say(sent), say(' '.join(sents[:j])), say(' '.join(sents[j + 1:])), fn)
                chars += len(sent)
                clips.append([fn, d])
            speech = sum(d for _, d in clips)
            # Board length = speech + a breath between sentences + TAIL + reading time for diagrams (sc['extra'], at most 6 s).
            # The reading time is shared equally among the board's captions; TAIL falls after the last one.
            last = ci + 1 == len(sc['caps'])
            spare = min(6.0, sc.get('extra', 0.0)) / len(sc['caps']) + (TAIL if last else 0.0)
            gap = BREATH + spare / len(clips)
            frames = int(round((LEAD + speech + gap * len(clips)) * FPS))
            gap = (frames / FPS - LEAD - speech) / len(clips)
            segs.append(dict(t0=t0, t1=t1, frames=frames, gap=gap, clips=clips))
            print('scene %d caption %d: window %.1fs, %d sentence(s), speech %.1fs, %.1fs after each%s' % (
                si + 1, ci, frames / FPS, len(clips), speech, gap, ''))
        n = sum(g['frames'] for g in segs)
        plan.append(dict(start=start, frames=n, segs=segs))
        start += n
    json.dump(dict(total=start, scenes=plan), open('vo/plan.json', 'w'))
    sp = sum(d for p in plan for g in p['segs'] for _, d in g['clips'])
    print('running time %.1fs, speech %.1fs (%.0f%% silence), %d characters' % (start / FPS, sp, 100 * (1 - sp / (start / FPS)), chars))


def scene_time(segs, fr):
    """Real frame -> nominal scene time. Each caption's stretch of animation fills its window."""
    f0 = 0
    for g in segs:
        if fr < f0 + g['frames'] or g is segs[-1]:
            return lerp(g['t0'], g['t1'], min(1.0, (fr - f0) / g['frames']))
        f0 += g['frames']


def draw(surface, paper, si, fr, t):
    c, sc = surface.getCanvas(), SCENES[si]
    c.drawImage(paper, 0, 0)
    c.drawRect(skia.Rect.MakeXYWH(PX, PY, PW, PH), skia.Paint(Color=col(BOARD)))
    c.save()
    c.clipRect(skia.Rect.MakeXYWH(PX, PY, PW, PH), True)
    c.translate(PX, PY)
    scale, dx, dy = sc.get('cam', lambda u: (1.0, 0.0, 0.0))(t / sc['dur'])
    c.translate(PW / 2 + dx, PH / 2 + dy)
    c.scale(scale, scale)
    c.translate(-PW / 2, -PH / 2)
    sc['fn'](G(c, si + 1, fr), t, sc['dur'])
    c.restore()
    g = G(c, 900 + si, fr)
    g.box(PX, PY, PW, PH, INK, 4.2, over=10)
    g.box(PX - 7, PY - 7, PW + 14, PH + 14, GRAPH, 1.6, over=14)
    cap, ct = '', 0
    for t0, s in sc['caps']:
        if t >= t0:
            cap, ct = s, t0
    f = F(T_ROM, 42)
    for i, ln in enumerate(wrap(cap, f, PW - 120)):
        g.text(ln, PX + 60, PY + PH + 76 + i * 52, 42, T_ROM, INK, 'l', ramp(t, ct, ct + .3))


def main():
    cmd = sys.argv[1]
    if cmd == 'voice':
        return voice()
    surface, paper = skia.Surface(W, H), make_paper()
    if cmd == 'proof':
        si, t = int(sys.argv[2]) - 1, float(sys.argv[3])
        draw(surface, paper, si, int(t * FPS * SLOW), t)
        return surface.makeImageSnapshot().save(sys.argv[4], skia.kPNG)
    plan = json.load(open('vo/plan.json'))
    os.makedirs('out', exist_ok=True)
    if cmd == 'scene':
        si = int(sys.argv[2]) - 1
        sp = plan['scenes'][si]
        tmp, fin = 'out/s%02d.tmp.mp4' % (si + 1), 'out/s%02d.mp4' % (si + 1)
        ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', '%dx%d' % (W, H),
                               '-r', str(FPS), '-i', '-'] + ENC + [tmp], stdin=subprocess.PIPE)
        for fr in range(sp['frames']):
            draw(surface, paper, si, fr, scene_time(sp['segs'], fr))
            ff.stdin.write(surface.toarray(colorType=skia.kRGBA_8888_ColorType).tobytes())
        ff.stdin.close()
        if ff.wait():
            sys.exit(1)
        os.replace(tmp, fin)     # a stopped render leaves only the .tmp name
        print('ok', fin)
    elif cmd == 'finish':
        spf = SR // FPS
        track, gaps = np.zeros(plan['total'] * spf, np.float32), []
        for sp in plan['scenes']:
            f = sp['start']
            for g in sp['segs']:
                t = f / FPS + LEAD
                for fn, d in g['clips']:
                    x, _ = sf.read(fn, dtype='float32')
                    a = int(round(t * SR))
                    track[a:a + len(x)] += x
                    t += d + g['gap']
                    gaps.append(g['gap'])
                f += g['frames']
        sf.write('vo/track.wav', track * (.89 / float(np.abs(track).max())), SR, subtype='PCM_16')
        open('out/list.txt', 'w').write(''.join("file 's%02d.mp4'\n" % (i + 1) for i in range(len(SCENES))))
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', 'out/list.txt', '-c', 'copy', 'out/picture.mp4'], check=True)
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', 'out/picture.mp4', '-i', 'vo/track.wav', '-map', '0:v', '-map', '1:a',
                        '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', sys.argv[2]], check=True)
        print('%s: %.1fs, %d sentences, silence after a sentence min %.2fs median %.2fs' % (
            sys.argv[2], plan['total'] / FPS, len(gaps), min(gaps), sorted(gaps)[len(gaps) // 2]))


if __name__ == '__main__':
    main()
