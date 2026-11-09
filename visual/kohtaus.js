// Tapiolan kohtaus: puhdas aikafunktio seek(t). Ei tilaa ruutujen välillä, ei ajastimia, ei satunnaisuutta.
// Kaikki musiikin ajat tulevat ohjaustiedostosta (annotations/cues.json): ankkurit, nuotit, iskut ja spektri.
//
// KUVA ON ÄÄNI. Jokainen nuotti, jonka kuuntelutyökalu kuuli, on kuvan tapahtuma:
//   jousten ääni        puu: tumma kuusi, jonka latvan korkeus on sävelkorkeus; se kasvaa äänen alkaessa ja väistyy sen lakatessa
//   teoksen pitkä ääni  horisontin viiva (alussa gis): valon määrä on äänen voima ruutu ruudulta
//   paisutus viivalla   kukkula, joka nousee viivasta ja painuu takaisin; terävyys ja hartiat tulevat yläsävelistä (kuka soittaa)
//   puhaltimen ääni     harju korkeutensa kohdalla metsän takana
//   lyhyt korkea ääni   pilkahdus korkeutensa kohdalla
//   basso, patarummut   maa: sysäys, värinä, hohto
//   vaskien isku        pystysuora leikkaus kaikkien kerrosten läpi
// Aikajana alla sanoo vain, KUKA soittaa missäkin (jouset vai puhaltimet) ja mikä on pitkä ääni; ne tulevat kuunteluoppaasta.

import { VERT, FRAG } from './kerrokset.glsl.js';

const lin = (hex, k = 1) => [1, 3, 5].map((i) => Math.pow(parseInt(hex.slice(i, i + 2), 16) / 255, 2.2) * k);
export const PALETTI = { hamy: '#0b1719', salo: '#163a66', halla: '#cfe1ee', noki: '#0c0a09', punainen: '#c8281c', kajo: '#f3ead6' };
const C = PALETTI;

const PERUS = {
  jouset: 1, viiva: 68, viivaVoima: 1, harjut: 1, vaike: 0.5, leikkaus: 0, tuuli: 0,
  maaY: 0.11, pLo: 50, pHi: 98, zoom: 1, mist: 0.6, dark: 0,
  snow: [0, 0.4, 0.5, 0.5],
  skyTop: lin(C.salo, 0.08), skyLow: lin(C.salo, 0.30), mistCol: lin('#6d86a3', 0.35), treeNear: lin(C.noki, 0.55), treeFar: lin('#16243a', 0.38),
  groundCol: lin(C.noki, 0.6), lightCol: lin('#a9c4e6', 1.5), snowCol: lin(C.halla, 0.5), cutCol: lin(C.halla, 2.2), warmCol: lin(C.kajo, 1.0), sunCol: lin(C.punainen, 2.0),
  glow: [0.5, 0.08, 0, 1.2], sun: [0.3, 0.6, 0, 0.2],
};
// Nämä vaihtuvat ankkurissa kerralla (kuka soittaa); kaikki muu liukuu ankkurista seuraavaan.
const ASKEL = new Set(['jouset', 'viiva']);
const m = (...os) => Object.assign({}, PERUS, ...os);

// Aikajana: ankkuri → tila. Roolit kuunteluoppaasta.
const AVAIMET = [
  ['tiedoston_alku', m({ jouset: 1 })],
  ['jouset_tulevat', m({ jouset: 1 })],                       // siemen: jouset piirtävät ensimmäisen metsän
  ['gis_paljastuu', m({ jouset: 0, zoom: 1.03 })],            // jouset väistyvät, takana ollut gis jää
  ['siemen_toistuu', m({ jouset: 1, zoom: 1.06 })],           // sama metsä uudestaan
  ['puhallinkuviot_alku', m({ jouset: 0, zoom: 1.09 })],      // puhaltajat nousevat viivasta kukkuloina yksi kerrallaan
  ['puhallinkuviot_loppu', m({ jouset: 0, zoom: 1.16 })],
  ['patarumpu_paisuu', m({ jouset: 0, zoom: 1.18, snow: [0.05, 0.4, 0.5, 0.4] })],
  ['vaskien_isku', m({ jouset: 1, leikkaus: 1, zoom: 1.2, snow: [0.25, 1.6, 0.4, 0.6], tuuli: 1 })],
  ['fraasi_ennen_taukoa', m({ jouset: 1, leikkaus: 0, zoom: 1.26, snow: [0.7, 2.2, 0.5, 0.7], mist: 0.9, tuuli: 0.5 })],
  ['hiljaisuus_1_alku', m({ jouset: 1, zoom: 1.3, snow: [1.0, 0.8, 0.9, 0.8], mist: 1.2 })],
  ['hiljaisuus_1_loppu', m({ jouset: 1, viiva: 66, zoom: 1.34, snow: [0.5, 0.3, 0.7, 0.6], mist: 0.9 })],
  ['fis_pitka_aani', m({ jouset: 1, viiva: 66, zoom: 1.36, snow: [0.2, 0.2, 0.6, 0.5] })],
  ['valo_D_duuri', m({ jouset: 0, viiva: 66, zoom: 1.42 })],
  ['askeleet_alkavat', m({ jouset: 1, viiva: 66, zoom: 1.5 })],
  ['tiedoston_loppu', m({ jouset: 1, viiva: 66, zoom: 1.5 })],
];

const lerp = (a, b, k) => (Array.isArray(a) ? a.map((x, i) => x + (b[i] - x) * k) : a + (b - a) * k);
const smooth = (k) => k * k * (3 - 2 * k);
const clamp = (x, a, b) => Math.min(Math.max(x, a), b);
const fract = (x) => x - Math.floor(x);
const KULTA = 0.6180339887;

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

  // Spektri ruututarkkuudella: puolisävelaskelet, dB.
  const oh = cues.ohjaus, sm = oh.spektri;
  if (!sm) throw new Error('ohjaustiedostossa ei ole spektriä: aja analysis/korvat.py ja make_cues.py');
  const SP = new Uint8Array(await (await fetch('/' + sm.tiedosto)).arrayBuffer());
  const NB = sm.kaistoja, FPS = oh.fps, NF = oh.frames;
  if (SP.length !== NF * NB) throw new Error('spektri.u8: koko ei vastaa ruutuja');
  const dbRuutu = (midi, f) => { const b = Math.round(midi) - sm.midi_alin; if (b < 0 || b >= NB) return sm.db_alin; return SP[clamp(f, 0, NF - 1) * NB + b] / 255 * -sm.db_alin + sm.db_alin; };
  // kaistan taso dB hetkellä t, viiden ruudun painotettuna keskiarvona (ei nyi)
  const dB = (midi, t) => { const f = t * FPS; const f0 = Math.floor(f), k = f - f0; let s = 0, w = 0;
    for (let i = -2; i <= 3; i++) { const ww = Math.max(0, 1 - Math.abs(i - k) / 3); s += ww * dbRuutu(midi, f0 + i); w += ww; } return s / w; };
  const voima = (midi, t) => clamp((dB(midi, t) + 48) / 40, 0, 1);
  const matala = (t) => { let mx = -60; for (let mi = 28; mi <= 47; mi++) mx = Math.max(mx, dB(mi, t)); return mx; };

  const NUOTIT = cues.nuotit;                      // [alku, kesto, midi], aikajärjestyksessä
  const ISKUT = cues.iskut.map((x) => ({ t: x.t, v: clamp(x.pisteet / 70, 0.15, 1) }));
  const ensimmainen = (lista, t, avain) => { let a = 0, b = lista.length; while (a < b) { const c = (a + b) >> 1; if (avain(lista[c]) < t) a = c + 1; else b = c; } return a; };
  const PISIN = NUOTIT.reduce((s, n) => Math.max(s, n[1]), 0);

  function tila(t) {
    t = clamp(t, 0, aika.tiedoston_loppu);
    let i = 0;
    while (i + 2 < avaimet.length && avaimet[i + 1].t <= t) i++;
    const a = avaimet[i], b = avaimet[i + 1];
    const s = smooth(clamp((t - a.t) / (b.t - a.t), 0, 1));
    const p = {};
    for (const key of Object.keys(PERUS)) p[key] = ASKEL.has(key) ? a.p[key] : lerp(a.p[key], b.p[key], s);
    return p;
  }
  const rooli = (t) => tila(t);

  // Viivan paisutukset: äänen tason huiput viivan sävelellä. Jokainen on yksi soittaja, joka tulee esiin.
  const paisutukset = new Map();
  function viivanPaisutukset(midi) {
    if (paisutukset.has(midi)) return paisutukset.get(midi);
    const e = new Float32Array(NF);
    for (let f = 0; f < NF; f++) { let s = 0; for (let i = -4; i <= 4; i++) s += dbRuutu(midi, f + i); e[f] = s / 9; }
    const out = [];
    let f = 5;
    while (f < NF - 5) {
      if (e[f] > -36 && e[f] >= e[f - 1] && e[f] > e[f + 1]) {
        let l = f, r = f;
        while (l > 1 && e[l - 1] <= e[l] && f - l < 3 * FPS) l--;
        while (r < NF - 2 && e[r + 1] <= e[r] && r - f < 3 * FPS) r++;
        const pohja = Math.max(e[l], e[r]);
        if (e[f] - pohja >= 1.2 && (!out.length || f - out[out.length - 1].f > 0.8 * FPS)) {
          const run = Math.max(dbRuutu(midi + 12, f), dbRuutu(midi + 19, f), dbRuutu(midi + 24, f), dbRuutu(midi + 28, f)) - e[f];
          out.push({ f, t0: l / FPS, t1: r / FPS, tp: f / FPS, pohja: Math.min(e[l], e[r]), huippu: e[f], runsaus: clamp((run + 26) / 20, 0, 1), k: out.length });
        }
        f = r + 1;
      } else f++;
    }
    paisutukset.set(midi, { e, out });
    return paisutukset.get(midi);
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
  const U = (n) => gl.getUniformLocation(prog, n);
  const aa = Number(q.get('aa') || (q.get('mode') === 'render' ? 2 : 1));
  const ASP = canvas.width / canvas.height;

  // Mitä kuvassa on hetkellä t: lasketaan äänestä joka kerta alusta.
  function kuva(t) {
    const p = tila(t);
    const Y = (midi) => p.maaY + 0.03 + (midi - p.pLo) / (p.pHi - p.pLo) * (0.95 - p.maaY);
    const puut = [], harjut = [], kukkulat = [], pilk = [];
    const i0 = ensimmainen(NUOTIT, t - PISIN - 1.2, (n) => n[0]);
    for (let i = i0; i < NUOTIT.length && NUOTIT[i][0] <= t + 0.05; i++) {
      const [alku, kesto, midi] = NUOTIT[i];
      const ika = t - alku, jalki = t - (alku + kesto);
      if (jalki > 1.2 || midi < 48) continue;
      const r = rooli(alku + 0.05);
      const L = voima(midi, Math.min(t, alku + kesto));
      if (Math.abs(midi - r.viiva) < 0.5) continue;                       // teoksen pitkä ääni on viiva, ei puu
      if (kesto < 0.35 && midi >= 76) {                                    // lyhyt korkea ääni: pilkahdus
        if (jalki < 0.25) pilk.push({ x: ASP * fract(alku * 7.13 + midi * 0.17), y: Y(midi), v: p.vaike * L * Math.sin(Math.PI * clamp(ika / (kesto + 0.25), 0, 1)), koko: 0.004 + 0.004 * L });
        continue;
      }
      if (kesto < 0.3) continue;
      const nousu = smooth(clamp(ika / 0.45, 0, 1));
      const lasku = 1 - smooth(clamp(jalki / 0.9, 0, 1));
      if (r.jouset > 0.5) {
        // jousten ääni on puuryhmä: paikka on sävelen oma, joten sama sävel palaa samana ryhmänä samaan paikkaan.
        // Korkein puu yltää sävelen korkeuteen; voimakas ääni on lähellä (suuri ja tumma), hiljainen kaukana.
        const x0 = ASP * (0.07 + 0.86 * fract(midi * KULTA + 0.31));
        const Lk = voima(midi, alku + Math.min(kesto, 0.6));
        const n = kesto >= 1.2 ? 6 : 3;
        for (let j = 0; j < n; j++) {
          const h1 = fract(midi * 0.754 + j * 0.3819 + 0.11), h2 = fract(midi * 0.317 + j * 0.6180 + 0.53);
          const syv = clamp(1.05 - 1.1 * Lk + (h2 - 0.5) * 0.5, 0.04, 0.96);
          const kork = (Y(midi) - p.maaY) * (j === 0 ? 1 : 0.55 + 0.4 * h1);
          const viive = j * 0.07;
          const nj = smooth(clamp((ika - viive) / 0.5, 0, 1));
          const top = p.maaY + kork * (0.12 + 0.88 * nj) * (0.8 + 0.2 * lasku);
          puut.push({ x: x0 + ASP * (j === 0 ? 0 : (h1 - 0.5) * 0.16 + (j % 2 ? 0.035 : -0.035)), top, w: kork * 0.17 * (1.3 - 0.4 * syv), syv,
            a: nj * lasku * clamp(kesto / 0.8, 0.4, 1), huoj: (0.004 + 0.016 * L) * (1 + 3 * p.tuuli), tarkeys: kesto * (0.3 + Lk) * (j === 0 ? 2 : 1) });
        }
      } else if (kesto >= 0.6) {
        // puhaltimen ääni on harju metsän takana; lyhyt kuvio viivan yläpuolella on kaari, joka nousee viivasta ja palaa
        const kaari = midi > r.viiva && midi <= r.viiva + 10 && kesto < 1.6;
        if (kaari) kukkulat.push({ x: ASP * (0.15 + 0.7 * fract(alku * 0.41 + 0.2)), h: (Y(midi) - Y(r.viiva)) * Math.sin(Math.PI * clamp(ika / (kesto + 0.3), 0, 1)) * (0.4 + 0.6 * L), w: 0.035, ter: 0.2 });
        else harjut.push({ y: Y(midi), v: p.harjut * 0.5 * L * nousu * lasku, x: ASP * (0.1 + 0.8 * fract(alku * 0.37 + midi * 0.21)), h: 0.012 + 0.05 * L * L,
          ter: clamp((Math.max(dB(midi + 12, t), dB(midi + 19, t)) - dB(midi, t) + 26) / 20, 0, 1), w: 0.10, tarkeys: L * kesto });
      }
    }
    // viiva ja sen kukkulat
    const vm = Math.round(p.viiva);
    const vv = p.viivaVoima * voima(vm, t);
    const { e, out } = viivanPaisutukset(vm);
    const fNyt = clamp(Math.round(t * FPS), 0, NF - 1);
    for (let k = out.length - 1; k >= 0 && kukkulat.length < 12; k--) {
      const s = out[k];
      if (s.t0 > t || t - s.t1 > 40) continue;
      const kork = 0.13 * clamp((s.huippu - s.pohja) / 6, 0.35, 1.3);
      let g = t <= s.t1 ? clamp((e[fNyt] - s.pohja) / Math.max(s.huippu - s.pohja, 0.5), 0, 1.1) : 0;
      const jaanne = t > s.tp ? 0.18 * Math.exp(-(t - s.tp) / 30) : 0;      // jokaisesta paisutuksesta jää maisemaan matala kumpu
      g = Math.max(smooth(clamp(g, 0, 1)), jaanne);
      kukkulat.push({ x: ASP * (0.12 + 0.76 * fract(s.k * KULTA + 0.15)), h: kork * g, w: 0.06 + 0.06 * (1 - s.runsaus), ter: s.runsaus });
    }
    // maa: basson taso on hohto, tason muutos on värinä, matala alku on sysäys
    const ml = matala(t);
    let var_ = 0;
    for (let i = -3; i <= 0; i++) var_ += Math.abs(matala(t + i / FPS) - matala(t + (i - 1) / FPS));
    const sys = [];
    const j0 = ensimmainen(NUOTIT, t - 1.6, (n) => n[0]);
    for (let i = j0; i < NUOTIT.length && NUOTIT[i][0] <= t; i++) {
      const [alku, kesto, midi] = NUOTIT[i];
      if (midi >= 48) continue;
      sys.push({ x: ASP * (0.2 + 0.6 * fract(midi * KULTA + 0.5)), ika: t - alku, v: voima(midi, alku + 0.1) });
    }
    sys.sort((a, b) => b.v * Math.exp(-b.ika) - a.v * Math.exp(-a.ika));
    // vaskien isku: leikkaus
    let leik = 0;
    if (p.leikkaus > 0.01) { const ii = ensimmainen(ISKUT, t + 1e-6, (x) => x.t) - 1; if (ii >= 0) leik = p.leikkaus * ISKUT[ii].v * Math.exp(-(t - ISKUT[ii].t) / 0.7); }
    puut.sort((a, b) => b.tarkeys - a.tarkeys); puut.length = Math.min(puut.length, 72); puut.sort((a, b) => b.syv - a.syv);
    harjut.sort((a, b) => b.tarkeys - a.tarkeys); harjut.length = Math.min(harjut.length, 16); harjut.sort((a, b) => b.y - a.y);
    pilk.length = Math.min(pilk.length, 32);
    let kes = -60; for (let mi = 55; mi <= 76; mi++) if (Math.abs(mi - vm) > 0.5) kes = Math.max(kes, dB(mi, t));
    const reuna = 0.045 + 0.07 * p.jouset * clamp((kes + 40) / 30, 0, 1);
    return { p, Y, puut, harjut, kukkulat, pilk, viivaY: Y(p.viiva), vv, ml, var_, sys, leik, reuna };
  }

  const fTree = new Float32Array(72 * 4), fTreeB = new Float32Array(72 * 4), fRidge = new Float32Array(16 * 4), fRidgeB = new Float32Array(16 * 4);
  const fHill = new Float32Array(12 * 4), fGlint = new Float32Array(32 * 4), fPulse = new Float32Array(4 * 4);

  window.duration = aika.tiedoston_loppu;
  window.contextOk = () => !gl.isContextLost();
  window.seek = (t) => {
    if (gl.isContextLost()) return false;
    const k = kuva(t), p = k.p;
    fTree.fill(0); fTreeB.fill(0); fRidge.fill(0); fRidgeB.fill(0); fHill.fill(0); fGlint.fill(0); fPulse.fill(0);
    k.puut.forEach((x, i) => { fTree.set([x.x, x.top, x.w, x.syv], i * 4); fTreeB.set([x.a, 0, x.huoj, 0], i * 4); });
    k.harjut.forEach((x, i) => { fRidge.set([x.y, x.v, x.x, x.h], i * 4); fRidgeB.set([x.ter, x.w, 0, 0], i * 4); });
    k.kukkulat.slice(0, 12).forEach((x, i) => fHill.set([x.x, x.h, x.w, x.ter], i * 4));
    k.pilk.forEach((x, i) => fGlint.set([x.x, x.y, x.v, x.koko], i * 4));
    k.sys.slice(0, 4).forEach((x, i) => fPulse.set([x.x, x.ika, x.v, 0], i * 4));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(U('uRes'), canvas.width, canvas.height);
    gl.uniform1f(U('uAA'), aa); gl.uniform1f(U('uTime'), t); gl.uniform1f(U('uZoom'), p.zoom); gl.uniform1f(U('uMist'), p.mist); gl.uniform1f(U('uDark'), p.dark);
    for (const n of ['skyTop', 'skyLow', 'mistCol', 'treeNear', 'treeFar', 'groundCol', 'lightCol', 'snowCol', 'cutCol', 'warmCol', 'sunCol']) gl.uniform3fv(U('u' + n[0].toUpperCase() + n.slice(1)), p[n]);
    gl.uniform4fv(U('uTree'), fTree); gl.uniform4fv(U('uTreeB'), fTreeB); gl.uniform4fv(U('uRidge'), fRidge); gl.uniform4fv(U('uRidgeB'), fRidgeB);
    gl.uniform4fv(U('uHill'), fHill); gl.uniform4fv(U('uGlint'), fGlint); gl.uniform4fv(U('uPulse'), fPulse);
    gl.uniform1i(U('uNTree'), k.puut.length); gl.uniform1i(U('uNRidge'), k.harjut.length); gl.uniform1i(U('uNHill'), Math.min(k.kukkulat.length, 12)); gl.uniform1i(U('uNGlint'), k.pilk.length);
    gl.uniform4f(U('uLine'), k.viivaY, 0.9 * k.vv, 0.0022, 0.03);
    gl.uniform4f(U('uGround'), p.maaY, clamp(k.var_ / 14, 0, 1.5), clamp((k.ml + 45) / 35, 0, 1), 0.10);
    gl.uniform4f(U('uCut'), ASP * 0.47, 2.2 * k.leik, 0.0035, 0);
    gl.uniform3f(U('uBand'), k.reuna, 0.92, p.tuuli);
    gl.uniform4fv(U('uSnow'), p.snow); gl.uniform4fv(U('uGlow'), p.glow); gl.uniform4fv(U('uSun'), [p.sun[0] * ASP, p.sun[1], p.sun[2], p.sun[3]]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.finish();
    return true;
  };
  // Tarkistuksia varten: mitä kuvassa on hetkellä t (ei piirrä).
  window.kuvaus = (t) => { const k = kuva(t); return { puita: k.puut.length, harjuja: k.harjut.length, kukkuloita: k.kukkulat.filter((x) => x.h > 0.004).length, pilkahduksia: k.pilk.length, viiva: +k.vv.toFixed(2), jouset: k.p.jouset }; };
  window.camProbe = (t) => ({ p: [0, 0, tila(t).zoom], q: [0, 0, 0, 1], shot: 'yksi ajo', cut: 0, trans: false });
  window.seek(Number(q.get('t') || 0));
  window.sceneReady = true;
}

alusta().catch((e) => { console.error(e); window.sceneError = String(e.message || e); });
