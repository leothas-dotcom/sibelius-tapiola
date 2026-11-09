// Tapiolan kohtaus: puhdas aikafunktio seek(t). Ei tilaa ruutujen välillä, ei ajastimia, ei satunnaisuutta.
// Kaikki ajat tulevat ankkureista (annotations/cues.json); tässä tiedostossa ei ole sekunteja.
// VEDOS 2: jokaisella tunnelmalla on oma kuvatapansa (tyyliohje 4b, kuvakäsikirjoitus luku 1), ja ääni ohjaa kuvaa:
// säikeet piirtävät ylälinjan korkeuden (kanava ylalinja_midi) ja valon määrä seuraa äänen tasoa (taso_dbfs).
// Metsä elää äänestä: latvat huojuvat äänen liikkeen tiheyden mukaan (uusia_keski, uusia_korkea), matala isku liikauttaa maata
// ja nostaa aallon runkoja ylös, ja muu isku saa metsän massan etääntymään hetkeksi (ohjaustiedoston iskut).
// Kulut kuvatavasta toiseen ovat vielä pelkkä liuku parametreissa.

import { VERT, FRAG } from './metsa.glsl.js';

const lin = (hex, k = 1) => [1, 3, 5].map((i) => Math.pow(parseInt(hex.slice(i, i + 2), 16) / 255, 2.2) * k);

// Paletti (tyyliohje luku 3). Heksat ovat vedoksen ehdotus, ei lukittu.
export const PALETTI = { hamy: '#0b1719', salo: '#163a66', halla: '#cfe1ee', noki: '#0c0a09', punainen: '#c8281c', kajo: '#f3ead6' };
const C = PALETTI;

const PERUS = {
  camY: 1.6, pitch: 0, speed: 0.5, fov: 0.5, far: 120,
  cell: 3.4, density: 0.82, path: 0.9, trunkR: 0.16, treeH: 17, canopyBase: 4.6, canopyR: 1.25, tier: 2.2, baseY: 0,
  ground: 1, terrain: 0.5, ceil: 0, frost: 0, snow: 0.8, ice: 0, clear: [1e9, 1e9],
  trunkCol: lin(C.noki, 2), needleCol: lin(C.hamy, 0.8), snowCol: lin(C.halla, 0.38), frostCol: lin(C.halla, 0.5),
  fogCol: lin(C.salo, 0.24), amb: lin(C.salo, 0.16), fogDen: 0.055, fogDown: 0.6, fogLow: 0,
  slit: [0, 0.03, 0.012, 0], slitTall: 0.14, slitCol: lin('#7fa6d8', 2.4),
  cut: [0.7, 0.14, 0, 70], cutCol: lin(C.halla, 1.6),
  sun: [1.0, 0.22, 30, 0], sunCol: lin(C.punainen, 2.2),
  horizon: 0, treeline: 0, glow: [0, 0.05, 0, 1.0], glowCol: lin(C.kajo), line: [0, 0.003, 0, 0], lineCol: lin('#7fa6d8', 2.0),
  band: [0, 0.03, 0.6, 0], bandCol: lin(C.halla, 0.8),
  spark: 0, sparkY: 2, strand: [0, 2.2, 6, 0.008], strandCol: lin('#9db9df', 1.5), melRange: 2.2, step: [8, 0, 0, 0],
  flake: [0, 0.5, 0.3], flakeCol: lin(C.halla, 0.7),
  mist: 0, zen: 0, zenCol: lin('#aebdc6', 1.0), drift: 0, ripple: 0,
  ridge: [0, 0.03, 0.01, 0.02], ridgeCol: lin(C.hamy, 0.6), ridgeMist: lin(C.salo, 0.5), ridgeFade: 0, tooth: 0.012,
  spot: [0, 0, 0, 3], spotCol: lin('#9db9df', 1.2),
};
const m = (...os) => Object.assign({}, PERUS, ...os);

// Kymmenen kuvatapaa (tyyliohje 4b).
const USVA = { fogDen: 0.15, mist: 0.9, fogCol: lin(C.salo, 0.30), canopyBase: 3.3, density: 0.78, far: 90,
  slit: [0, 0.04, 0.09, 0.5], slitTall: 0.2, slitCol: lin('#8fb0d8', 1.6), speed: 0.4 };
const MAA = { camY: 0.28, pitch: 0.09, cell: 4.8, trunkR: 0.34, treeH: 26, canopyBase: 9, canopyR: 1.8, tier: 1.8, path: 1.3, terrain: 0.6,
  drift: 0.3, snow: 1.0, fogDen: 0.075, mist: 0.5, slit: [0, 0.0, 0.03, 0.5], slitTall: 0.1, speed: 0.4 };
const D_VALO = { slit: [0, 0.02, 0.2, 0.45], slitTall: 0.25, slitCol: lin('#aebdc6', 1.4) };
const YLOS = { camY: 1.3, cell: 4.8, trunkR: 0.34, treeH: 26, canopyBase: 7, canopyR: 2.0, tier: 1.8, path: 1.3, terrain: 0.6, snow: 1.0,
  fogDen: 0.045, mist: 0.4, zen: 0.10, speed: 0.3 };
const LAHIKUVA = { ground: 0, baseY: -7, cell: 3.0, trunkR: 0.09, treeH: 15, canopyBase: 1.0, canopyR: 1.2, tier: 2.4, density: 0.85,
  frost: 1, snow: 0, path: 0.55, fov: 0.27, pitch: 0.2, fogCol: lin(C.salo, 0.42), fogDown: 0.12, fogDen: 0.11, mist: 0.6,
  amb: lin(C.salo, 0.9), slit: [0, 0.1, 0.5, 0.35], slitTall: 0.35, slitCol: lin(C.halla, 1.0), speed: 0.25 };
const PINTA = { camY: 1.7, pitch: -0.33, ice: 1, terrain: 0, canopyBase: 7, path: 1.5, density: 0.8, fogDen: 0.035, mist: 0.4, fogCol: lin(C.salo, 0.26),
  amb: lin(C.salo, 0.3), slit: [0, 0.06, 0.02, 1.0], slitTall: 0.2, speed: 0.4 };
const RYTMI = { camY: 9, ground: 0, baseY: -70, cell: 7.5, density: 0.8, trunkR: 0.95, treeH: 220, canopyBase: 400, canopyR: 1, tier: 0.2,
  path: 3.0, far: 320, fogDen: 0.02, mist: 0.35, fogCol: lin(C.salo, 0.5), fogDown: 0.8, amb: lin(C.salo, 0.25), trunkCol: lin(C.salo, 0.22),
  slit: [0, 0.0, 0.3, 0.12], slitTall: 0.6, speed: 0.22 };
const PIMEA = { cell: 24, density: 0.55, trunkR: 0.55, treeH: 45, canopyBase: 16, canopyR: 5, tier: 0.4, path: 4, terrain: 0.8, far: 420,
  fogDen: 0.016, fogCol: lin(C.salo, 0.10), amb: lin(C.salo, 0.10), speed: 1.6 };
const ULKOA = { ice: 1, terrain: 0, density: 0, far: 700, fogDen: 0.004, fogLow: 0.9, fogCol: lin(C.salo, 0.34), amb: lin(C.salo, 0.2),
  horizon: 1, mist: 0.3, speed: 0.2, ridge: [6, 0.085, 0.02, 0.024], tooth: 0.013, ridgeCol: lin(C.noki, 0.8), ridgeMist: lin('#6d86a3', 0.45) };
const TUULI = { fogDen: 0.3, fogLow: 0, mist: 0.8, fogCol: lin('#55616c', 1.0), amb: lin('#55616c', 1.0), flake: [0.75, 0.55, 1.2], horizon: 0,
  ridge: [2, 0.05, 0.016, 0.02], ridgeFade: 6.4, speed: 0.6 };
const YLHAALTA = { camY: 40, pitch: -0.2, ground: 0, density: 0, far: 400, fogCol: lin(C.salo, 0.26), fogDown: 1.0, amb: lin(C.salo, 0.5),
  horizon: 1, mist: 0.5, ridge: [7, -0.015, -0.52, 0.04], tooth: 0.034, ridgeCol: lin(C.noki, 1.0), ridgeMist: lin('#5a7391', 0.5), speed: 0.35 };
const VIIVA = { line: [0.004, 0.0022, 0.8, 0] };
const KAJO = { line: [0.004, 0.0022, 0.9, 0], lineCol: lin(C.kajo, 1.0), glow: [0.012, 0.08, 0.9, 1.3], ridgeMist: lin('#5b6f8a', 0.55), speed: 0 };

// Aikajana: ankkuri → tila. Kahden ankkurin välissä tila liukuu tasaisesti edellisestä seuraavaan.
const AVAIMET = [
  ['tiedoston_alku', m(USVA, { slit: [0, 0.04, 0.09, 0.12] })],
  ['jouset_tulevat', m(USVA, { strand: [1.0, 2.4, 5, 0.008], slit: [0, 0.04, 0.09, 0.2] })],
  ['gis_paljastuu', m(USVA, { strand: [0.5, 2.4, 5, 0.008], slit: [0, 0.04, 0.05, 0.5] })],
  ['siemen_toistuu', m(USVA, { strand: [0.9, 2.4, 5, 0.008], slit: [0, 0.04, 0.03, 0.8] })],
  ['puhallinkuviot_alku', m(USVA, { slit: [0, 0.04, 0.03, 0.8] })],
  ['patarumpu_paisuu', m(USVA, { slit: [0, 0.04, 0.03, 0.8] })],
  ['vaskien_isku', m(USVA, { fogDen: 0.05, mist: 0.4, slit: [0, 0.04, 0.03, 0.9], cut: [0.7, 0.14, 1, 70], flake: [0.1, 0.5, 0.6] })],
  ['fraasi_ennen_taukoa', m(USVA, { cut: [0.7, 0.14, 0, 70], flake: [0.5, 0.5, 0.6], fogDen: 0.14, fogCol: lin('#3b4a58', 0.8), strand: [0.8, 2.4, 5, 0.008] })],
  ['hiljaisuus_1_alku', m(USVA, { slit: [0, 0.03, 0.2, 0.25], slitTall: 0.3, flake: [0.7, 0.45, 0.5], fogDen: 0.24, fogCol: lin('#4a5966', 0.9), amb: lin('#4a5966', 0.9) })],
  ['hiljaisuus_1_loppu', m(MAA, { flake: [0.3, 0.4, 0.3], fogDen: 0.12, fogCol: lin('#3b4a58', 0.7) })],
  ['fis_pitka_aani', m(MAA, { strand: [0.6, 1.6, 5, 0.008] })],
  ['valo_D_duuri', m(MAA, D_VALO)],
  ['askeleet_alkavat', m(MAA, { step: [2.6, 0.10, 0, 0] })],
  ['askeleet_B', m(MAA, { step: [1.8, 0.13, 0, 0] })],
  ['urkupiste_H1_alku', m(MAA, { step: [1.8, 0.13, 0, 0], pitch: 0.12 })],
  ['urkupiste_H1_loppu', m(YLOS, { pitch: 0.8 })],
  ['nousu_huippu_D', m(YLOS, { pitch: 1.05, zen: 0.55 })],
  ['pohja_katoaa', m(LAHIKUVA)],
  ['nopea_liike_1_alku', m(LAHIKUVA, { spark: 1.0 })],
  ['jannitesoinnut', m(LAHIKUVA, { slit: [0, 0.1, 0.5, 0.18], pitch: -0.1 })],
  ['pohja_vaihtuu_D', m(PINTA, { slit: [0, 0.05, 0.02, 0.3] })],
  ['gis_palaa', m(PINTA)],
  ['peikot_G_alku', m(PINTA, { spark: 0.8, ripple: 0.4 })],
  ['h_urkupiste_vyory', m(PINTA, { ripple: 1.0, slit: [0, 0.05, 0.04, 0.6] })],
  ['vaskipulssit', m(PINTA, { ripple: 0.3 })],
  ['hajoaa_hiljaisuuteen', m(PINTA, { pitch: -0.25, slit: [0, 0.05, 0.04, 0.4] })],
  ['jousijakso_urkupiste_E_alku', m(RYTMI)],
  ['c_duuri_valahdykset', m(RYTMI)],
  ['auringonsade', m(RYTMI, { sun: [1.05, 0.05, 24, 1.1], speed: 0 })],
  ['M_ennakko', m(RYTMI, { sun: [1.05, 0.05, 24, 1.1], speed: 0, cut: [1.5, 0.1, 0, 160] })],
  ['M_raskaat_askeleet', m(PIMEA, { cut: [1.6, 0.1, 0.7, 160], step: [10, 0.4, 0, 0] })],
  ['jannitejakso_alku', m(PIMEA)],
  ['P_vaskipaisunta', m(PIMEA, { cut: [1.6, 0.14, 1.0, 160] })],
  ['dim_possibile', m(PIMEA, { speed: 0.8 })],
  ['hiljaisuus_2_alku', m(ULKOA, { ridgeMist: lin(C.salo, 0.2), fogCol: lin(C.salo, 0.12) })],
  ['myrsky_nakyy', m(ULKOA, { band: [0.35, 0.13, 0.3, 0] })],
  ['myrsky_kasvu', m(ULKOA, { band: [1.0, 0.22, 0.5, 0], ridgeFade: 3.2 })],
  ['myrsky_iskee', m(ULKOA, TUULI)],
  ['myrsky_huippu', m(ULKOA, TUULI, { cut: [1.2, 0.1, 0.7, 60] })],
  ['R_vasket', m(ULKOA, TUULI, { flake: [0.6, 0.5, 1.0], fogDen: 0.2 })],
  ['toinen_paisunta', m(ULKOA, TUULI, { flake: [0.5, 0.5, 1.0], fogDen: 0.15 })],
  ['huuto', m(YLHAALTA, { ridgeFade: 2.5, bandCol: lin('#55616c', 0.9), band: [0.8, 0.03, 0.3, 0], strand: [1.0, 46, 12, 0.02], melRange: 5, flake: [0.2, 0.3, 0.6] })],
  ['yksinaiset_aanet', m(YLHAALTA, { spot: [-0.22, -0.13, 0.5, 3] })],
  ['S_sempre_mf', m(YLHAALTA, VIIVA)],
  ['loppuhuipennus', m(YLHAALTA, VIIVA, { speed: 0.2 })],
  ['loppu_Hduuri_alku', m(YLHAALTA, KAJO)],
  ['musiikki_loppuu', m(YLHAALTA, KAJO)],
  ['tiedoston_loppu', m(YLHAALTA, KAJO)],
];

const UNIFORMIT = ['far', 'fov', 'pitch', 'cell', 'density', 'path', 'trunkR', 'treeH', 'canopyBase', 'canopyR', 'tier', 'baseY', 'ground', 'terrain',
  'ceil', 'frost', 'snow', 'ice', 'clear', 'trunkCol', 'needleCol', 'snowCol', 'frostCol', 'fogCol', 'amb', 'fogDen', 'fogDown', 'fogLow', 'slit',
  'slitTall', 'slitCol', 'cut', 'cutCol', 'sun', 'sunCol', 'horizon', 'treeline', 'glow', 'glowCol', 'line', 'lineCol', 'band', 'bandCol', 'spark',
  'sparkY', 'strand', 'strandCol', 'melRange', 'step', 'flake', 'flakeCol', 'mist', 'zen', 'zenCol', 'drift', 'ripple', 'ridge', 'ridgeCol',
  'ridgeMist', 'ridgeFade', 'tooth', 'spot', 'spotCol'];

const lerp = (a, b, k) => (Array.isArray(a) ? a.map((x, i) => x + (b[i] - x) * k) : a + (b - a) * k);
const smooth = (k) => k * k * (3 - 2 * k);
const clamp = (x, a, b) => Math.min(Math.max(x, a), b);

async function alusta() {
  const q = new URLSearchParams(location.search);
  const cues = await (await fetch('/annotations/cues.json')).json();
  const aika = Object.fromEntries(cues.cues.map((c) => [c.id, c.t]));
  aika.tiedoston_alku = 0;
  aika.tiedoston_loppu = cues.recording.kesto_s;
  const puuttuu = AVAIMET.filter(([id]) => aika[id] == null).map(([id]) => id);
  if (puuttuu.length) throw new Error('ankkuri puuttuu teemakartasta: ' + puuttuu.join(', '));
  const avaimet = AVAIMET.map(([id, p]) => ({ id, t: aika[id], p }));
  for (let i = 1; i < avaimet.length; i++) if (!(avaimet[i].t > avaimet[i - 1].t)) throw new Error('ankkurit eivät ole aikajärjestyksessä: ' + avaimet[i].id);

  // Ruutukanavat: ääni ohjaa kuvaa. Tiedosto on ruutu kerrallaan, kanavat peräkkäin.
  const oh = cues.ohjaus;
  const kan = new Float32Array(await (await fetch('/' + oh.tiedosto)).arrayBuffer());
  const NK = oh.channels.length;
  if (kan.length !== oh.frames * NK) throw new Error('ohjaus.f32: koko ei vastaa kanavia');
  const ki = Object.fromEntries(oh.channels.map((n, i) => [n, i]));
  for (const n of ['taso_dbfs', 'ylalinja_midi', 'uusia_keski', 'uusia_korkea']) if (ki[n] == null) throw new Error('kanava puuttuu: ' + n);
  const arvo = (n, t) => kan[clamp(Math.round(t * oh.fps), 0, oh.frames - 1) * NK + ki[n]];
  const keski = (n, t, w) => { let s = 0, c = 0; for (let u = -w; u <= w + 1e-9; u += 1 / oh.fps) { s += arvo(n, t + u); c++; } return s / c; };
  // äänen voima 0..1 (hiljainen .. voimakas), puolen sekunnin keskiarvona
  const voima = (t) => clamp((keski('taso_dbfs', t, 0.5) + 52) / 30, 0, 1.2);
  // ylälinjan korkeus 0..1 (matala .. korkea); tauko on -1
  const korkeus = (t) => (arvo('taso_dbfs', t) < -56 ? -1 : clamp((keski('ylalinja_midi', t, 0.12) - 52) / 46, 0, 1));
  // äänen liike 0..1: uusia säveliä sekunnissa keski- ja ylärekisterissä, sekunnin keskiarvona
  const liike = (t) => clamp((keski('uusia_keski', t, 1.0) + keski('uusia_korkea', t, 1.0)) / 80, 0, 1);
  // iskut: viimeisin matala isku ja viimeisin isku ylipäätään ennen hetkeä t
  const iskut = cues.iskut.map((x) => ({ t: x.t, v: clamp(x.pisteet / 70, 0.15, 1), m: clamp((x.kaistat_z.matala || 0) / 12, 0, 1) }));
  const matalat = iskut.filter((x) => x.m > 0.35);
  const viimeisin = (lista, t) => { let a = 0, b = lista.length - 1, r = null; while (a <= b) { const c = (a + b) >> 1; if (lista[c].t <= t) { r = lista[c]; a = c + 1; } else b = c - 1; } return r; };
  const MEL_IKKUNA = 2.5;   // säikeen piirtämä jakso kumpaankin suuntaan nykyhetkestä; kuvan mitta, ei musiikin aika

  // Kameran matka: nopeuden integraali avainten yli (nopeus liukuu kuten muukin tila).
  const N = 64;
  const matka = (a, b, k) => { let z = 0; for (let i = 0; i < N; i++) { const u = (i + 0.5) / N * k; z += lerp(a.p.speed, b.p.speed, smooth(u)); } return z * k * (b.t - a.t) / N; };
  let z = 0;
  for (let i = 0; i < avaimet.length; i++) { avaimet[i].z = z; if (i + 1 < avaimet.length) z += matka(avaimet[i], avaimet[i + 1], 1); }

  function tila(t) {
    t = clamp(t, 0, aika.tiedoston_loppu);
    let i = 0;
    while (i + 2 < avaimet.length && avaimet[i + 1].t <= t) i++;
    const a = avaimet[i], b = avaimet[i + 1];
    const k = clamp((t - a.t) / (b.t - a.t), 0, 1), s = smooth(k);
    const p = {};
    for (const key of Object.keys(PERUS)) p[key] = lerp(a.p[key], b.p[key], s);
    p.camZ = a.z + matka(a, b, k);
    return p;
  }

  const canvas = document.getElementById('c');
  const gl = canvas.getContext('webgl2', { antialias: false, preserveDrawingBuffer: true });
  if (!gl) throw new Error('WebGL2 ei käytettävissä');
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error('varjostin: ' + gl.getShaderInfoLog(s)); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('varjostin: ' + gl.getProgramInfoLog(prog));
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = (n) => gl.getUniformLocation(prog, 'u' + n[0].toUpperCase() + n.slice(1));
  const aa = Number(q.get('aa') || (q.get('mode') === 'render' ? 2 : 1));
  const mel = new Float32Array(32);

  window.duration = aika.tiedoston_loppu;
  window.contextOk = () => !gl.isContextLost();
  window.seek = (t) => {
    if (gl.isContextLost()) return false;
    const p = tila(t);
    // Ääni → kuva: voima on valon määrä, korkeus on säikeen ja pilkahdusten korkeus.
    const v = 0.4 + 0.8 * voima(t);
    p.slit = [p.slit[0], p.slit[1], p.slit[2], p.slit[3] * v];
    p.glow = [p.glow[0], p.glow[1], p.glow[2] * v, p.glow[3]];
    p.band = [p.band[0] * v, p.band[1], p.band[2], p.band[3]];
    p.strand = [p.strand[0] * v, p.strand[1], p.strand[2], p.strand[3]];
    p.zen *= v;
    for (let i = 0; i < 32; i++) mel[i] = korkeus(t + (i / 31 * 2 - 1) * MEL_IKKUNA);
    const im = viimeisin(matalat, t), ia = viimeisin(iskut, t);
    const hitLow = im ? [t - im.t, im.m] : [99, 0];
    if (ia) p.fogDen *= 1 + 0.5 * ia.v * Math.exp(-(t - ia.t) / 0.18);
    const nyt = korkeus(t);
    p.sparkY = p.camY + (nyt < 0 ? 0 : (nyt - 0.5) * 3.0) + 1.0;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(U('res'), canvas.width, canvas.height);
    gl.uniform1f(U('AA'), aa);
    gl.uniform1f(U('time'), t);
    gl.uniform3f(U('cam'), 0, p.camY, p.camZ);
    gl.uniform1fv(gl.getUniformLocation(prog, 'uMel'), mel);
    gl.uniform1f(U('melOn'), 1);
    gl.uniform1f(U('sway'), 0.05 + 0.45 * liike(t));
    gl.uniform2fv(U('hitLow'), hitLow);
    for (const n of UNIFORMIT) {
      const val = p[n];
      if (!Array.isArray(val)) gl.uniform1f(U(n), val);
      else if (val.length === 2) gl.uniform2fv(U(n), val);
      else if (val.length === 3) gl.uniform3fv(U(n), val);
      else gl.uniform4fv(U(n), val);
    }
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.finish();
    return true;
  };
  // camcheck: kameran sijainti ja suunta ilman piirtoa. Suunta on aina eteen; vain pystykulma muuttuu.
  window.camProbe = (t) => {
    const p = tila(t);
    return { p: [0, p.camY, p.camZ], q: [Math.sin(-p.pitch / 2), 0, 0, Math.cos(-p.pitch / 2)], shot: 'yksi ajo', cut: 0, trans: false };
  };
  window.seek(Number(q.get('t') || 0));
  window.sceneReady = true;
}

alusta().catch((e) => { console.error(e); window.sceneError = String(e.message || e); });
