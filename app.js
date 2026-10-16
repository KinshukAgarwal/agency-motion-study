// TRIONN clone engine — original implementation observing reference behavior
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const vh = () => innerHeight;
/* loader */
let ln = 0; const ldN = $('#ldNum');
const lti = setInterval(() => { ln += 3 + Math.random() * 9; if (ln >= 100) { ln = 100; clearInterval(lti); setTimeout(() => $('#loader').classList.add('done'), 400); } ldN.textContent = Math.floor(ln); }, 70);
/* menu / cookie / cursor / clock */
const ov = $('#menuOverlay');
$('#menuBtn').onclick = () => ov.classList.add('open');
$('#menuClose').onclick = () => ov.classList.remove('open');
ov.querySelectorAll('a').forEach(a => a.onclick = () => ov.classList.remove('open'));
$('#cookie').addEventListener('click', e => { if (e.target.tagName === 'BUTTON') $('#cookie').style.display = 'none'; });
const cur = $('#cursor'); addEventListener('mousemove', e => { cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px'; });
setInterval(() => { try { $('#ist').textContent = 'IST → ' + new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }); } catch (e) {} }, 1000);
/* reveal + counters */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
$$('.reveal').forEach(el => io.observe(el));
const cio = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; const el = e.target; cio.unobserve(el); const to = parseFloat(el.dataset.to), dec = +(el.dataset.dec || 0), t0 = performance.now(); const step = t => { const p = Math.min(1, (t - t0) / 1600), ez = 1 - Math.pow(1 - p, 4); el.textContent = (to * ez).toFixed(dec); if (p < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); }), { threshold: .4 });
$$('.count').forEach(el => cio.observe(el));
/* curtain wipe on big-section enter */
let lastWipe = 0;
const wipeSecs = ['#facts', '#work', '#services', '#clients', '#motionWrap', '#contact'];
const wio = new IntersectionObserver(es => es.forEach(e => { const now = Date.now(); if (e.isIntersecting && now - lastWipe > 2500) { lastWipe = now; const w = $('#wipe'); w.classList.remove('go'); void w.offsetWidth; w.classList.add('go'); } }), { threshold: .08 });
wipeSecs.forEach(s => { const el = $(s); if (el) wio.observe(el); });
/* ---------- HERO canvas: dark shards + orange blades + wire mark ---------- */
const cv = $('#shards'), cx = cv.getContext('2d');
let W, H, shards = [], motes = [], parts = [], mx = -999, my = -999, holding = false, charge = 0, shock = 0;
function sizeCv() { W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight; }
addEventListener('resize', sizeCv); sizeCv();
for (let i = 0; i < 30; i++) shards.push({ x: Math.random(), y: Math.random(), w: .06 + Math.random() * .22, h: .02 + Math.random() * .07, r: Math.random() * Math.PI, vr: (Math.random() - .5) * .0012, vx: (Math.random() - .5) * .0004, vy: (Math.random() - .5) * .0004, a: .05 + Math.random() * .16, blade: i < 6 });
for (let i = 0; i < 90; i++) motes.push({ x: Math.random(), y: Math.random(), s: Math.random() * 1.8 + .4, vx: (Math.random() - .5) * .0006, vy: (Math.random() - .5) * .0006, o: Math.random() * .5 + .1 });
function drawMark(t) {
  cx.save(); cx.translate(W * .52, H * .52); cx.globalAlpha = .5;
  cx.strokeStyle = 'rgba(160,170,190,.28)'; cx.lineWidth = 2;
  const s = Math.min(W, H) * .0016;
  cx.scale(s, s);
  const P = [[-150, -110, -60, -110, -110, 110, -200, 110], [30, -110, 120, -110, 70, 110, -20, 110], [-90, 0, 60, 0]];
  P.forEach(p => { cx.beginPath(); cx.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) cx.lineTo(p[i], p[i + 1]); cx.closePath(); cx.stroke(); });
  // orange blade
  const g = cx.createLinearGradient(-60, 40, 90, 40);
  g.addColorStop(0, 'rgba(255,92,0,0)'); g.addColorStop(.4, 'rgba(255,92,0,.95)'); g.addColorStop(1, 'rgba(255,92,0,.15)');
  cx.fillStyle = g; cx.beginPath();
  cx.moveTo(-60, 30); cx.lineTo(80, 30); cx.lineTo(95, 52); cx.lineTo(-45, 52); cx.closePath(); cx.fill();
  cx.restore();
}
function heroFrame(t) {
  cx.clearRect(0, 0, W, H);
  const px = (mx / W - .5) || 0, py = (my / H - .5) || 0;
  for (const s of shards) {
    s.x += s.vx; s.y += s.vy; s.r += s.vr;
    if (holding) { const dx = s.x - .5, dy = s.y - .5, d = Math.hypot(dx, dy) + .05; s.x += dx / d * charge * .00004; s.y += dy / d * charge * .00004; }
    const X = (s.x + px * .03 * s.w * 10) * W, Y = (s.y + py * .03 * s.w * 10) * H;
    cx.save(); cx.translate(X, Y); cx.rotate(s.r);
    if (s.blade) {
      const g = cx.createLinearGradient(-s.w * W / 2, 0, s.w * W / 2, 0);
      g.addColorStop(0, 'rgba(255,92,0,0)'); g.addColorStop(.5, `rgba(255,110,20,${s.a + .25})`); g.addColorStop(1, 'rgba(255,92,0,0)');
      cx.fillStyle = g; cx.shadowColor = 'rgba(255,92,0,.8)'; cx.shadowBlur = 24;
      cx.fillRect(-s.w * W / 2, -3, s.w * W, 6);
    } else {
      const g = cx.createLinearGradient(0, -s.h * H / 2, 0, s.h * H / 2);
      g.addColorStop(0, `rgba(70,80,100,${s.a})`); g.addColorStop(1, `rgba(20,24,34,${s.a})`);
      cx.fillStyle = g; cx.fillRect(-s.w * W / 2, -s.h * H / 2, s.w * W, s.h * H);
      cx.strokeStyle = `rgba(150,160,180,${s.a * .8})`; cx.lineWidth = 1; cx.strokeRect(-s.w * W / 2, -s.h * H / 2, s.w * W, s.h * H);
    }
    cx.restore();
  }
  drawMark(t);
  // diamond
  cx.save(); cx.translate(W * .34, H * .56 + Math.sin(t * .001) * 8); cx.rotate(Math.PI / 4);
  const dg = cx.createLinearGradient(-9, -9, 9, 9); dg.addColorStop(0, '#fff'); dg.addColorStop(1, '#5a6272');
  cx.fillStyle = dg; cx.fillRect(-9, -9, 18, 18); cx.restore();
  for (const m of motes) {
    m.x += m.vx; m.y += m.vy;
    if (m.x < 0 || m.x > 1) m.vx *= -1; if (m.y < 0 || m.y > 1) m.vy *= -1;
    cx.fillStyle = `rgba(255,255,255,${m.o})`; cx.fillRect(m.x * W, m.y * H, m.s, m.s);
  }
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i]; p.x += p.vx; p.y += p.vy; p.vx *= .982; p.vy *= .982; p.life -= .014;
    if (p.life <= 0) { parts.splice(i, 1); continue; }
    cx.fillStyle = `rgba(255,${p.hot ? 100 : 255},${p.hot ? 30 : 255},${p.life})`;
    cx.fillRect(p.x, p.y, p.s, p.s);
  }
  if (shock > 0) { cx.strokeStyle = `rgba(255,120,30,${shock / 100})`; cx.lineWidth = 3; cx.beginPath(); cx.arc(W / 2, H / 2, (100 - shock) * 9, 0, 7); cx.stroke(); shock -= 2; }
  if (holding && charge < 100) charge += 1.5;
  requestAnimationFrame(heroFrame);
}
requestAnimationFrame(heroFrame);
function blast(x, y, big) {
  const c = big ? 170 : 40;
  for (let i = 0; i < c; i++) { const a = Math.random() * 6.283, s = (big ? 4 : 2) + Math.random() * (big ? 15 : 6); parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: .6 + Math.random() * .6, s: 1 + Math.random() * 2.6, hot: Math.random() < .45 }); }
  if (big) shock = 100;
}
const heroEl = $('.hero');
heroEl.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
heroEl.addEventListener('pointerdown', e => { holding = true; charge = 0; const r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
addEventListener('pointerup', () => { if (holding) { blast(mx, my, charge > 22); holding = false; charge = 0; } });
/* ---------- hero title: split chars + rotating word + scroll scatter ---------- */
const rotEl = $('#rotWord'), rotWords = ['something.', 'purpose.', 'impact.'];
let ri = 0; setInterval(() => { ri = (ri + 1) % 3; rotEl.style.transition = 'opacity .3s,filter .3s'; rotEl.style.opacity = 0; rotEl.style.filter = 'blur(10px)'; setTimeout(() => { rotEl.textContent = rotWords[ri]; rotEl.style.opacity = 1; rotEl.style.filter = 'none'; }, 300); }, 3000);
const hTitle = $('#heroTitle');
hTitle.childNodes.forEach(n => {
  if (n.nodeType === 3) {
    const frag = document.createDocumentFragment();
    n.textContent.split('').forEach(c => { const s = document.createElement('span'); s.className = 'ch'; s.innerHTML = c === ' ' ? '&nbsp;' : c; frag.appendChild(s); });
    n.replaceWith(frag);
  } else if (n.tagName === 'BR') return; else if (n.classList && !n.classList.contains('rot')) {
    n.innerHTML = n.textContent.split('').map(c => `<span class="ch">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
  }
});
const chs = [...hTitle.querySelectorAll('.ch')].map(el => ({ el, x: 0, y: 0, b: 0 }));
let lastSY = scrollY, vel = 0;
addEventListener('scroll', () => { vel = vel * .8 + Math.min(60, Math.abs(scrollY - lastSY)) * .2; lastSY = scrollY; }, { passive: true });
(function scatter() {
  vel *= .94;
  const k = Math.min(1, vel / 40);
  chs.forEach((c, i) => {
    c.x += ((Math.random() - .5) * 90 * k - c.x) * .12;
    c.y += ((Math.random() - .5) * 60 * k - c.y) * .12;
    c.b += ((Math.random() * 8 * k) - c.b) * .12;
    c.el.style.transform = `translate(${c.x.toFixed(1)}px,${c.y.toFixed(1)}px)`;
    c.el.style.filter = c.b > .4 ? `blur(${c.b.toFixed(1)}px)` : 'none';
    c.el.style.opacity = 1 - Math.min(.85, Math.abs(c.x) / 130);
  });
  requestAnimationFrame(scatter);
})();
/* ---------- about word reveal ---------- */
const ab = $('#aboutBig');
ab.innerHTML = ab.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
const abWords = [...ab.querySelectorAll('.w')];
/* ---------- horizontal drivers ---------- */
function progOf(wrap) { const r = wrap.getBoundingClientRect(); const total = wrap.offsetHeight - vh(); return Math.min(1, Math.max(0, -r.top / total)); }
const hDrivers = [ ['#workWrap', '#workTrack'], ['#svcWrap', '#svcTrack'] ].map(([w, t]) => ({ wrap: $(w), track: $(t) }));
/* ---------- stone sequence ---------- */
const stoneCv = $('#stone'), sx = stoneCv.getContext('2d');
const FRAMES = 200, stoneImgs = new Array(FRAMES), loaded = new Set();
let stoneIdx = -1;
function loadFrame(i) {
  if (loaded.has(i) || i < 0 || i >= FRAMES) return;
  loaded.add(i);
  const im = new Image();
  im.onload = () => { stoneImgs[i] = im; if (i === stoneIdx) drawStone(); };
  im.src = `public/images/stone_frame_${String(i + 1).padStart(4, '0')}.webp`;
}
for (let i = 0; i < 40; i++) loadFrame(i);
let idleN = 40; (function idle() { if (idleN < FRAMES) { for (let k = 0; k < 8 && idleN < FRAMES; k++) loadFrame(idleN++); setTimeout(idle, 120); } })();
function drawStone() { const im = stoneImgs[stoneIdx]; if (!im) return; sx.clearRect(0, 0, 640, 360); sx.drawImage(im, 0, 0, 640, 360); }
/* ---------- motion orbit ---------- */
const orbit = $('#orbit'), ocards = [...orbit.querySelectorAll('.ocard')];
const N = ocards.length;
function orbitLayout(p) {
  const R = Math.min(innerWidth * .42, 640), w = ocards[0].offsetWidth || 380;
  const rot = p * Math.PI * 1.15;
  ocards.forEach((c, i) => {
    const a = (i / N) * Math.PI * 2 + rot - Math.PI / 2;
    let x = Math.sin(a) * R, z = Math.cos(a) * R * .55, y = -Math.cos(a) * 60;
    let ry = -Math.sin(a) * 38, sc = .72 + (z / (R * .55)) * .28, op = z < -R * .4 ? 0 : 1;
    if (p > .78) { // morph to grid
      const k = Math.min(1, (p - .78) / .22), gx = (i % 3 - 1) * (w + 26), gy = (Math.floor(i / 3) - 1) * 240;
      x = x * (1 - k) + gx * k; y = y * (1 - k) + gy * k; z = z * (1 - k); ry = ry * (1 - k); sc = sc * (1 - k) + k; op = 1;
    }
    c.style.transform = `translate(calc(-50% + ${x.toFixed(0)}px), calc(-50% + ${y.toFixed(0)}px)) translateZ(${z.toFixed(0)}px) rotateY(${ry.toFixed(1)}deg) scale(${sc.toFixed(3)})`;
    c.style.opacity = op; c.style.zIndex = Math.round(100 + z);
  });
}
/* ---------- float letters ---------- */
const fl = [...$('#floatLetters').children];
fl.forEach((s, i) => {
  s.style.left = (4 + (i * 37) % 92) + '%'; s.style.top = (6 + (i * 53) % 82) + '%';
  s.style.fontSize = (60 + (i * 47) % 130) + 'px';
});
/* ---------- master scroll ---------- */
const band = $('#bandTrack');
const svcWrap = $('#svcWrap'), motionWrap = $('#motionWrap'), heroWrap = $('#heroWrap');
function onScroll() {
  const sy = scrollY;
  // band
  const br = band.getBoundingClientRect();
  band.style.transform = `translateX(${-(sy * .25 % 900)}px)`;
  // about words
  const ar = ab.getBoundingClientRect();
  const ap = Math.min(1, Math.max(0, (vh() * .85 - ar.top) / (vh() * .7)));
  abWords.forEach((w, i) => { w.style.color = (i / abWords.length) < ap ? '#D8D8D8' : 'rgba(216,216,216,.14)'; });
  // horizontals
  hDrivers.forEach(({ wrap, track }) => {
    const p = progOf(wrap);
    const max = track.scrollWidth - innerWidth + 68;
    track.style.transform = `translate3d(${(-p * max).toFixed(0)}px,0,0)`;
  });
  // stone scrub
  const sp = progOf(svcWrap);
  const fi = Math.min(FRAMES - 1, Math.floor(sp * (FRAMES - 1)));
  for (let k = fi - 3; k <= fi + 6; k++) loadFrame(k);
  if (fi !== stoneIdx && stoneImgs[fi]) { stoneIdx = fi; drawStone(); } else stoneIdx = fi;
  // stone scale with progress
  const sc = .7 + sp * .7;
  stoneCv.style.width = `min(${60 * sc}vh,${560 * sc}px)`; stoneCv.style.height = `min(${60 * sc}vh,${560 * sc}px)`;
  // motion
  orbitLayout(progOf(motionWrap));
  // float letters drift
  fl.forEach((s, i) => { s.style.transform = `translateY(${((sy * (.04 + i * .012)) % 120 - 60).toFixed(0)}px) rotate(${(sy * .01 + i * 20) % 30 - 15}deg)`; });
}
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', onScroll);
onScroll(); orbitLayout(0);
/* drag strips */
[['#tStrip']].forEach(([sel]) => {
  const el = $(sel); let d = false, sx0 = 0, sl = 0;
  el.addEventListener('pointerdown', e => { d = true; sx0 = e.clientX; sl = el.scrollLeft; });
  addEventListener('pointermove', e => { if (d) el.scrollLeft = sl - (e.clientX - sx0); });
  addEventListener('pointerup', () => d = false);
});
/* rushi video on view */
const rio = new IntersectionObserver(es => es.forEach(e => { const v = e.target; if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }), { threshold: .3 });
$$('.t video').forEach(v => rio.observe(v));
/* sound fake */
let snd = true;
$('#soundBtn').onclick = () => { snd = !snd; $('#soundBtn').style.opacity = snd ? 1 : .4; };
