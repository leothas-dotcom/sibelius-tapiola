// Tapiolan kohtaus: puhdas aikafunktio seek(t). Ei tilaa ruutujen välillä, ei ajastimia, ei satunnaisuutta.
// Kaikki ajat tulevat ankkureista (annotations/cues.json); tässä tiedostossa ei ole sekunteja.
// Maailmat ovat kuvakäsikirjoituksen luvun 2 maailmat. VEDOS 1: maailmat, valo ja väri. Ääni ei vielä ohjaa
// liikettä (ruutukanavia ei lueta), ja kulut maailmasta toiseen ovat pelkkä liuku parametreissa.

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
  horizon: 0, treeline: 0.012, glow: [0, 0.05, 0, 1.0], glowCol: lin(C.kajo), line: [0, 0.003, 0, 0], lineCol: lin('#7fa6d8', 2.0),
  band: [0, 0.03, 0.6, 0], bandCol: lin(C.halla, 0.8),
  spark: 0, strand: [0, 2.2, 6, 0.008], strandCol: lin('#9db9df', 1.5), step: [8, 0, 0, 0],
  flake: [0, 0.5, 0.3], flakeCol: lin(C.halla, 0.7),
};
const m = (...os) => Object.assign({}, PERUS, ...os);

// Kahdeksan maailmaa (kuvakäsikirjoitus luku 2).
const KUUSIKKO = {};
const ASKELTEN = { cell: 4.8, trunkR: 0.32, treeH: 24, canopyBase: 6.5, canopyR: 1.8, tier: 1.8, path: 1.2, terrain: 0.8, snow: 1.0, speed: 0.42,
  slit: [0, -0.02, 0.012, 0.55] };
const D_VALO = { slit: [0, 0.0, 0.11, 0.42], slitTall: 0.32, slitCol: lin('#aebdc6', 1.5) };
const HUURRE = { ground: 0, baseY: -7, cell: 3.0, trunkR: 0.09, treeH: 15, canopyBase: 1.0, canopyR: 1.2, tier: 2.4, density: 0.85,
  frost: 1, snow: 0, path: 0.8, fogCol: lin(C.salo, 0.42), fogDown: 0.12, fogDen: 0.05, amb: lin(C.salo, 0.9),
  slit: [0, 0.06, 0.55, 0.30], slitTall: 0.32, slitCol: lin(C.halla, 1.0), speed: 0.4 };
const JAANALAINEN = { ceil: 9, treeH: 6.2, canopyBase: 2.4, fogCol: lin(C.salo, 0.2), amb: lin(C.salo, 0.3), fogDen: 0.05, slit: [0, 0.03, 0.012, 0.75], speed: 0.45 };
const IKISALO = { cell: 15, density: 0.7, trunkR: 1.25, treeH: 90, canopyBase: 45, canopyR: 7, tier: 0.25, path: 3.4, terrain: 1.2, far: 420,
  fogDen: 0.011, fogCol: lin(C.salo, 0.42), amb: lin(C.salo, 0.22), trunkCol: lin(C.salo, 0.25), snow: 0.6,
  slit: [0, 0.03, 0.22, 0.10], slitTall: 0.5, speed: 0.25, fogLow: 0.12 };
const PILKKOPIMEA = { cell: 24, density: 0.55, trunkR: 0.55, treeH: 45, canopyBase: 16, canopyR: 5, tier: 0.4, path: 4, terrain: 0.8, far: 420,
  fogDen: 0.016, fogCol: lin(C.salo, 0.10), amb: lin(C.salo, 0.10), speed: 1.6 };
const AUKEA = { ice: 1, terrain: 0, density: 0, far: 700, fogDen: 0.004, fogLow: 0.9, fogCol: lin(C.salo, 0.12), amb: lin(C.salo, 0.2),
  speed: 0.2, treeline: 0.016 };
const MYRSKY = { fogDen: 0.3, fogLow: 0, fogCol: lin('#55616c', 1.0), amb: lin('#55616c', 1.0), flake: [0.75, 0.55, 1.0], horizon: 0, speed: 0.6 };
const JALKEEN = { camY: 21.5, pitch: -0.09, cell: 3.6, treeH: 12, canopyBase: 2.5, canopyR: 1.5, tier: 2.0, terrain: 5, snow: 1.7, path: 0, far: 340,
  fogDen: 0.010, fogLow: 0.10, fogCol: lin(C.salo, 0.32), amb: lin(C.salo, 0.75), horizon: 1, treeline: 0.004, speed: 0.35 };

// Aikajana: ankkuri → tila. Kahden ankkurin välissä tila liukuu tasaisesti edellisestä seuraavaan.
const AVAIMET = [
  ['tiedoston_alku', m(KUUSIKKO)],
  ['jouset_tulevat', m(KUUSIKKO, { strand: [0.9, 2.2, 6, 0.008], slit: [0, 0.03, 0.012, 0.25] })],
  ['gis_paljastuu', m(KUUSIKKO, { strand: [0.5, 2.2, 6, 0.008], slit: [0, 0.03, 0.012, 0.5] })],
  ['siemen_toistuu', m(KUUSIKKO, { slit: [0, 0.03, 0.012, 0.95] })],
  ['patarumpu_paisuu', m(KUUSIKKO, { slit: [0, 0.03, 0.012, 0.9] })],
  ['vaskien_isku', m(KUUSIKKO, { slit: [0, 0.03, 0.012, 0.9], cut: [0.7, 0.14, 1, 70], flake: [0.1, 0.5, 0.6] })],
  ['fraasi_ennen_taukoa', m(KUUSIKKO, { slit: [0, 0.03, 0.012, 0.6], cut: [0.7, 0.14, 0, 70], flake: [0.5, 0.5, 0.6], fogDen: 0.12, fogCol: lin('#3b4a58', 0.8) })],
  ['hiljaisuus_1_alku', m(KUUSIKKO, { slit: [0, 0.03, 0.2, 0.25], slitTall: 0.3, flake: [0.7, 0.45, 0.5], fogDen: 0.22, fogCol: lin('#4a5966', 0.9), amb: lin('#4a5966', 0.9) })],
  ['hiljaisuus_1_loppu', m(ASKELTEN, { flake: [0.3, 0.4, 0.3], fogDen: 0.1, fogCol: lin('#3b4a58', 0.7) })],
  ['fis_pitka_aani', m(ASKELTEN)],
  ['valo_D_duuri', m(ASKELTEN, D_VALO)],
  ['askeleet_alkavat', m(ASKELTEN, { step: [9, 0.3, 0, 0] })],
  ['urkupiste_H1_alku', m(ASKELTEN, { step: [5, 0.35, 0, 0], slit: [0, -0.02, 0.012, 0.3], speed: 0.3 })],
  ['nousu_huippu_D', m(ASKELTEN, D_VALO, { slit: [0, 0.03, 0.16, 0.6], slitTall: 0.5 })],
  ['pohja_katoaa', m(HUURRE)],
  ['nopea_liike_1_alku', m(HUURRE, { spark: 1.0, speed: 0.6 })],
  ['jannitesoinnut', m(HUURRE, { slit: [0, 0.06, 0.55, 0.18], camY: 1.0 })],
  ['pohja_vaihtuu_D', m(JAANALAINEN, { slit: [0, 0.03, 0.012, 0.2] })],
  ['gis_palaa', m(JAANALAINEN)],
  ['peikot_G_alku', m(JAANALAINEN, { spark: 0.8 })],
  ['peikot_G_loppu', m(JAANALAINEN, { slit: [0, 0.03, 0.03, 0.6] })],
  ['hajoaa_hiljaisuuteen', m(JAANALAINEN, { slit: [0, 0.03, 0.03, 0.4] })],
  ['jousijakso_urkupiste_E_alku', m(IKISALO)],
  ['c_duuri_valahdykset', m(IKISALO)],
  ['auringonsade', m(IKISALO, { sun: [1.0, 0.22, 30, 1.0], speed: 0 })],
  ['M_ennakko', m(IKISALO, { sun: [1.0, 0.22, 30, 1.0], speed: 0, cut: [1.5, 0.1, 0, 160] })],
  ['M_raskaat_askeleet', m(PILKKOPIMEA, { cut: [1.6, 0.1, 0.7, 160], step: [10, 0.4, 0, 0] })],
  ['jannitejakso_alku', m(PILKKOPIMEA)],
  ['P_vaskipaisunta', m(PILKKOPIMEA, { cut: [1.6, 0.14, 1.0, 160] })],
  ['dim_possibile', m(PILKKOPIMEA, { speed: 0.8 })],
  ['hiljaisuus_2_alku', m(AUKEA)],
  ['myrsky_nakyy', m(AUKEA, { horizon: 1, band: [0.45, 0.02, 0.3, 0] })],
  ['myrsky_kasvu', m(AUKEA, { horizon: 1, band: [1.0, 0.07, 0.5, 0] })],
  ['myrsky_iskee', m(AUKEA, MYRSKY)],
  ['myrsky_huippu', m(AUKEA, MYRSKY, { cut: [1.2, 0.1, 0.7, 60] })],
  ['R_vasket', m(AUKEA, MYRSKY, { flake: [0.6, 0.5, 1.0], fogDen: 0.2 })],
  ['toinen_paisunta', m(AUKEA, MYRSKY, { flake: [0.5, 0.5, 1.0], fogDen: 0.15 })],
  ['huuto', m(JALKEEN, { fogDen: 0.06, fogLow: 0.35, fogCol: lin('#55616c', 0.8), strand: [1.0, 23.5, 9, 0.012], flake: [0.2, 0.3, 0.6] })],
  ['yksinaiset_aanet', m(JALKEEN)],
  ['S_sempre_mf', m(JALKEEN, { line: [0.006, 0.0022, 0.55, 0] })],
  ['loppuhuipennus', m(JALKEEN, { line: [0.006, 0.0022, 0.9, 0], speed: 0.2 })],
  ['loppu_Hduuri_alku', m(JALKEEN, { line: [0.006, 0.0022, 0.9, 0], lineCol: lin(C.kajo, 1.0), glow: [0.012, 0.075, 0.85, 1.3], speed: 0 })],
  ['musiikki_loppuu', m(JALKEEN, { line: [0.006, 0.0022, 0.9, 0], lineCol: lin(C.kajo, 1.0), glow: [0.012, 0.075, 0.85, 1.3], speed: 0 })],
  ['tiedoston_loppu', m(JALKEEN, { line: [0.006, 0.0022, 0.9, 0], lineCol: lin(C.kajo, 1.0), glow: [0.012, 0.075, 0.85, 1.3], speed: 0 })],
];

const UNIFORMIT = ['far', 'fov', 'pitch', 'cell', 'density', 'path', 'trunkR', 'treeH', 'canopyBase', 'canopyR', 'tier', 'baseY', 'ground', 'terrain',
  'ceil', 'frost', 'snow', 'ice', 'clear', 'trunkCol', 'needleCol', 'snowCol', 'frostCol', 'fogCol', 'amb', 'fogDen', 'fogDown', 'fogLow', 'slit',
  'slitTall', 'slitCol', 'cut', 'cutCol', 'sun', 'sunCol', 'horizon', 'treeline', 'glow', 'glowCol', 'line', 'lineCol', 'band', 'bandCol', 'spark',
  'strand', 'strandCol', 'step', 'flake', 'flakeCol'];

const lerp = (a, b, k) => (Array.isArray(a) ? a.map((x, i) => x + (b[i] - x) * k) : a + (b - a) * k);
const smooth = (k) => k * k * (3 - 2 * k);

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
  // Kameran matka: nopeuden integraali avainten yli (nopeus liukuu kuten muukin tila).
  const N = 64;
  const matka = (a, b, k) => { let z = 0; for (let i = 0; i < N; i++) { const u = (i + 0.5) / N * k; z += lerp(a.p.speed, b.p.speed, smooth(u)); } return z * k * (b.t - a.t) / N; };
  let z = 0;
  for (let i = 0; i < avaimet.length; i++) { avaimet[i].z = z; if (i + 1 < avaimet.length) z += matka(avaimet[i], avaimet[i + 1], 1); }

  function tila(t) {
    t = Math.min(Math.max(t, 0), aika.tiedoston_loppu);
    let i = 0;
    while (i + 2 < avaimet.length && avaimet[i + 1].t <= t) i++;
    const a = avaimet[i], b = avaimet[i + 1];
    const k = Math.min(Math.max((t - a.t) / (b.t - a.t), 0), 1), s = smooth(k);
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

  window.duration = aika.tiedoston_loppu;
  window.seek = (t) => {
    const p = tila(t);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(U('res'), canvas.width, canvas.height);
    gl.uniform1f(U('AA'), aa);
    gl.uniform1f(U('time'), t);
    gl.uniform3f(U('cam'), 0, p.camY, p.camZ);
    for (const n of UNIFORMIT) {
      const v = p[n];
      if (!Array.isArray(v)) gl.uniform1f(U(n), v);
      else if (v.length === 2) gl.uniform2fv(U(n), v);
      else if (v.length === 3) gl.uniform3fv(U(n), v);
      else gl.uniform4fv(U(n), v);
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
