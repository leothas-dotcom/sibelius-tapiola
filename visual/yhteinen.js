// Tapiola: yhteinen pohja maailmojen moduuleille (visual/maailma_XX.js). VAIN OHJAAJA MUOKKAA TÄTÄ TIEDOSTOA.
// Maailman moduuli: import { ... } from './yhteinen.js'; lataa data, rakenna varjostin (FS_ALKU + GLSL_YHTEINEN + oma scene()
// + FS_LOPPU), ja kutsu julkaise(). Kohtaus on puhdas aikafunktio seek(t): ei tilaa ruutujen välillä, ei ajastimia, ei
// siemenetöntä satunnaisuutta. Kaikki ajat tulevat ankkureista (aika.<id>), ei käsin kirjoitetuista sekunneista.
export const clamp = (x, a, b) => Math.min(Math.max(x, a), b);
export const smooth = (k) => k * k * (3 - 2 * k);
export const sstep = (a, b, x) => smooth(clamp((x - a) / (b - a), 0, 1));
export const fract = (x) => x - Math.floor(x);
export const lerp = (a, b, k) => a + (b - a) * k;

// Rajakuvat: jokainen moduuli alkaa edellisen maailman rajakuvasta ja päättyy omaansa. Rajalla kuva ON rajakuva (koko ruutu).
export const RAJA = { PIMEA_MASSA: 0, HUURRE: 1, JAA: 2, PIMEYS: 3, LUMI: 4 };

export const FS_ALKU = `#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2 uRes;
uniform float uAA;
`;

// Paletti (tyyliohje luku 3), kohina ja rajakuvat. p on kuvan paikka: y 0..1 alhaalta ylös, x 0..kuvasuhde.
export const GLSL_YHTEINEN = `
const vec3 HAMY = vec3(0.0022, 0.0046, 0.0054);    // hämy: lähes musta sinivihreä; metsän massa lähellä
const vec3 SALO = vec3(0.024, 0.040, 0.070);       // salo: syvä sininen; usva ja kaukaiset kerrokset
const vec3 HALLA = vec3(0.56, 0.68, 0.88);         // halla: kylmä sinivalkoinen; lumi, jää, kylmä valo
const vec3 HOPEA = vec3(0.80, 0.86, 0.95);         // hopea: ikkunat, pilkat, väike
const vec3 NOKI = vec3(0.006, 0.005, 0.004);       // noki: musta, lämmin; varjot lähellä
const vec3 PUNAINEN = vec3(0.62, 0.07, 0.04);      // taottu aurinko: VAIN C-duuri (maailma 8)
const vec3 KAJO = vec3(0.92, 0.86, 0.74);          // kajo: VAIN H-duuri (maailma 12)
const vec3 LEIKKAUS = vec3(0.92, 0.96, 1.0);       // vaskien pystysuora valo
float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p) { float s = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { s += a * vnoise(p); p = p * 2.03 + 11.7; a *= 0.5; } return s; }
vec3 rajakuva(vec2 p, int tyyppi, float t) {
  if (tyyppi == 0) return HAMY * (1.0 + 1.5 * vnoise(vec2(p.x * 2.0 + t * 0.05, p.y * 3.0))) + SALO * 0.03;          // pimeä massa: metsän reunan sisus
  if (tyyppi == 1) {     // huurre: vaalea sininen kide läheltä. Vedos 8 (kriitikko P2): hieno huurteen syy kahdessa mittakaavassa, kierretty
                         // ruudukosta (ei näkyviä soluja eikä laikkuja), ja pehmeä valo keskeltä: läpikuultava pinta, ei tasainen ruutu (kuvasääntö 8)
    vec2 q = mat2(0.80, -0.60, 0.60, 0.80) * p;
    float n = 0.60 * fbm(q * 13.0 + t * 0.03) + 0.40 * fbm(q * 47.0 - t * 0.02);
    vec2 dc = (p - vec2(0.8889, 0.5)) * vec2(0.62, 1.0);
    return vec3(0.30, 0.37, 0.50) * (0.97 + 0.20 * (n - 0.47) - 0.22 * dot(dc, dc));
  }
  if (tyyppi == 2) return vec3(0.004, 0.009, 0.016) * (1.0 + 0.8 * vnoise(vec2(p.x * 3.0, p.y * 9.0 + t * 0.02)));   // jää: musta pinta
  if (tyyppi == 3) return vec3(0.0016, 0.0022, 0.0030);                                                              // pimeys
  return vec3(0.20, 0.23, 0.29) * (0.80 + 0.30 * vnoise(vec2(p.x * 6.0 + t * 0.9, p.y * 2.0)));                      // lumi: myrskyn vaalea seinä
}
`;

export const FS_LOPPU = `
void main() {
  vec3 c = vec3(0.0);
  int n = int(uAA);
  for (int j = 0; j < n; j++) for (int i = 0; i < n; i++) {
    vec2 fc = gl_FragCoord.xy + (vec2(float(i), float(j)) + 0.5) / float(n) - 0.5;
    c += scene(fc / uRes.y);
  }
  c /= float(n * n);
  c = c / (1.0 + 0.3 * c);
  c = pow(max(c, 0.0), vec3(1.0 / 2.2));
  c += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  outColor = vec4(c, 1.0);
}`;

const VS = `#version 300 es
in vec2 a; void main() { gl_Position = vec4(a, 0.0, 1.0); }`;

// Piirtopohja: yksi kolmio koko ruudun yli. Palauttaa gl:n, uniformien haun ja piirtokutsun.
export function luoGL(fragmentSource) {
  const canvas = document.getElementById('c');
  const gl = canvas.getContext('webgl2', { antialias: false, preserveDrawingBuffer: true });
  if (!gl) throw new Error('WebGL2 ei käytettävissä');
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error('varjostin: ' + gl.getShaderInfoLog(s)); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fragmentSource)); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('linkitys: ' + gl.getProgramInfoLog(prog));
  gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const muisti = new Map();
  const U = (n) => { if (!muisti.has(n)) muisti.set(n, gl.getUniformLocation(prog, n)); return muisti.get(n); };
  const aa = Number(new URLSearchParams(location.search).get('aa') || 2);
  const piirra = () => { gl.viewport(0, 0, canvas.width, canvas.height); gl.uniform2f(U('uRes'), canvas.width, canvas.height); gl.uniform1f(U('uAA'), aa);
    gl.drawArrays(gl.TRIANGLES, 0, 3); gl.finish(); };
  return { gl, canvas, U, piirra };
}

// Data ja äänestä mitatut signaalit. Kaikki keskiarvot lasketaan kertymäsummista: kuva seuraa ääntä liukuen, ei ruutu ruudulta.
export async function lataa() {
  const cues = await (await fetch('/annotations/cues.json')).json();
  const aika = Object.fromEntries(cues.cues.filter((c) => c.t != null).map((c) => [c.id, c.t]));
  aika.tiedoston_alku = 0; aika.tiedoston_loppu = cues.recording.kesto_s;
  const vaadi = (...idt) => { for (const id of idt) if (aika[id] == null) throw new Error('ankkuri puuttuu: ' + id); };
  const oh = cues.ohjaus, sm = oh.spektri;
  const SP = new Uint8Array(await (await fetch('/' + sm.tiedosto)).arrayBuffer());
  const NB = sm.kaistoja, FPS = oh.fps, NF = oh.frames;
  if (SP.length !== NF * NB) throw new Error('spektri.u8: koko ei vastaa ruutuja');
  // kaistan taso ruudussa f: 0 (hiljaa, -48 dB) .. 1 (-8 dB); midi 24..107
  const taso = (midi, f) => { const b = Math.round(midi) - sm.midi_alin; if (b < 0 || b >= NB) return 0;
    return clamp((SP[clamp(Math.round(f), 0, NF - 1) * NB + b] / 255 * -sm.db_alin + sm.db_alin + 48) / 40, 0, 1); };
  // Paisutukset (< >) kaistoittain (vedos 8, rivit 158, 163; käyttäjä: "katsomaan millä kaistalla se ääni on, ja katsomaan sen volyymimuutosta ajan yli").
  // Kaista (puolisävel) kerrallaan: tason huippu, jota ennen taso nousee ja jonka jälkeen se laskee vähintään D dB (kumpikin vähintään 0,67 s, enintään 8 s).
  // Samaan aikaan (0,6 s) huipentuvat kaistat ovat yksi paisutus; yksittäinen ääni osuu 2-5 kaistalle, jousiston paisutus vähintään minKaistat kaistalle.
  // Palauttaa tapahtumat (alku, huippu, loppu, syvyys dB, kaistat) ja verhokäyrän ruuduittain (0..1): paisutuksen omien kaistojen keskitaso
  // skaalattuna alusta huippuun ja huipusta loppuun. Kuva seuraa siis itse äänen tasoa, ei viivästettyä arviota.
  const paisut = (ta, tb, D = 4, minKaistat = 8) => {
    const f0 = clamp(Math.round(ta * FPS) - 150, 0, NF - 1), f1 = clamp(Math.round(tb * FPS) + 150, 0, NF - 1), n = f1 - f0 + 1;
    const dB = (f, k) => SP[f * NB + k] / 255 * -sm.db_alin + sm.db_alin;
    const X = []; for (let k = 0; k < NB; k++) { const c = new Float64Array(n + 1); for (let i = 0; i < n; i++) c[i + 1] = c[i] + dB(f0 + i, k);
      const x = new Float32Array(n); for (let i = 0; i < n; i++) { const lo = Math.max(0, i - 7), hi = Math.min(n, i + 8); x[i] = (c[hi] - c[lo]) / (hi - lo); } X.push(x); }
    const hu = [];
    for (let k = 0; k < NB; k++) { const x = X[k];
      for (let i = 150; i < n - 150; i++) { if (x[i] < sm.db_alin + 14) continue; let mx = true; for (let j = i - 30; j <= i + 30; j++) if (x[j] > x[i] || (x[j] === x[i] && j < i)) { mx = false; break; } if (!mx) continue;
        const kulje = (st) => { let j = i, m = x[i], jm = i; while (j + st > 0 && j + st < n && Math.abs(j - i) < 240) { j += st; if (x[j] < m) { m = x[j]; jm = j; } else if (x[j] > m + 1.2) break; } return [jm, m]; };
        const [jl, ml] = kulje(-1), [jr, mr] = kulje(1);
        if (x[i] - ml >= D && x[i] - mr >= D && i - jl >= 20 && jr - i >= 20) hu.push({ i, jl, jr, k, s: Math.min(x[i] - ml, x[i] - mr) }); } }
    hu.sort((p, q) => p.i - q.i);
    const G = []; for (const e of hu) { const g = G[G.length - 1]; if (g && e.i - g[g.length - 1].i < 18) g.push(e); else G.push([e]); }
    const med = (v) => { const w = [...v].sort((p, q) => p - q); return w[Math.floor(w.length / 2)]; };
    const env = new Float32Array(NF), tap = [];
    for (const g of G) { const ks = [...new Set(g.map((e) => e.k))]; if (ks.length < minKaistat) continue;
      const ip = med(g.map((e) => e.i)), ia = med(g.map((e) => e.jl)), il = med(g.map((e) => e.jr)), syv = g.reduce((q, e) => q + e.s, 0) / g.length;
      if ((f0 + ip) / FPS < ta || (f0 + ip) / FPS > tb) continue;
      const L = (i) => { let q = 0; for (const k of ks) q += X[k][i]; return q / ks.length; };
      const La = L(ia), Lp = L(ip), Ll = L(il), amp = clamp(syv / 12, 0.45, 1);
      for (let i = ia; i <= il; i++) { const e = i <= ip ? (L(i) - La) / Math.max(Lp - La, 0.5) : (L(i) - Ll) / Math.max(Lp - Ll, 0.5); env[f0 + i] = Math.max(env[f0 + i], amp * clamp(e, 0, 1)); }
      tap.push({ alku: +((f0 + ia) / FPS).toFixed(2), huippu: +((f0 + ip) / FPS).toFixed(2), loppu: +((f0 + il) / FPS).toFixed(2), syvyys: +syv.toFixed(1), kaistoja: ks.length }); }
    const out = new Float32Array(NF); for (let f = 2; f < NF - 2; f++) out[f] = (env[f - 2] + env[f - 1] + env[f] + env[f + 1] + env[f + 2]) / 5;
    return { tapahtumat: tap, env: out };
  };
  const sarja = (fn) => { const a = new Float32Array(NF + 1); for (let f = 0; f < NF; f++) a[f + 1] = a[f] + fn(f); return a; };   // kertymäsumma ruuduittain
  const ka = (a, f, w) => { const lo = clamp(Math.round(f - w), 0, NF), hi = clamp(Math.round(f + w), 0, NF); return hi > lo ? (a[hi] - a[lo]) / (hi - lo) : 0; };   // keskiarvo f +- w ruutua
  const kohta = (a, t) => { const x = clamp(t * FPS, 0, NF - 1e-3), i = Math.floor(x); return a[i] + (a[i + 1] - a[i]) * (x - i); };            // kertymän arvo hetkellä t
  const huippu = (lo, hi, f, paitsi = -1) => { let mx = 0; for (let mi = lo; mi <= hi; mi++) if (Math.abs(mi - paitsi) > 1) mx = Math.max(mx, taso(mi, f)); return mx; };
  // teoksen pitkä ääni (ohjaajan luenta kuunteluoppaasta; tarkista oman maailmasi kohdalta): gis, fis, e, gis, fis, huuto gis2, gis
  const PITKA = [[0, 68], [aika.fis_pitka_aani, 66], [aika.e_pitka_ja_kuviot, 64], [aika.gis_palaa, 68], [aika.jousijakso_urkupiste_E_alku, 66], [aika.huuto, 80], [aika.yksinaiset_aanet, 68]];
  const pitkaSavel = (t) => { let m = 68; for (const [a, s] of PITKA) if (a != null && t >= a) m = s; return m; };
  const sPitka = sarja((f) => taso(pitkaSavel(f / FPS), f));
  const sMatala = sarja((f) => huippu(28, 47, f)), sKeski = sarja((f) => huippu(48, 71, f, pitkaSavel(f / FPS))), sKorkea = sarja((f) => huippu(72, 100, f, pitkaSavel(f / FPS)));
  const sKoko = sarja((f) => Math.max(huippu(28, 47, f), huippu(48, 100, f)));
  // melodian kaari: korkein soiva sävel keskirekisterissä (ei pitkä ääni)
  const sMel = (() => { const N = cues.nuotit, m = new Float32Array(NF); let j0 = 0, viime = 68;
    for (let f = 0; f < NF; f++) { const t = f / FPS; let top = -1; const pv = pitkaSavel(t);
      while (j0 < N.length && N[j0][0] + N[j0][1] < t - 8) j0++;
      for (let j = j0; j < N.length && N[j][0] <= t; j++) { const a = N[j][0], d = N[j][1], mi = N[j][2]; if (d >= 0.2 && t <= a + d && mi >= 59 && mi <= 83 && Math.abs(mi - pv) > 0.5) top = Math.max(top, mi); }
      if (top > 0) viime = top; m[f] = viime; }
    return sarja((f) => m[f]); })();
  // matalan kaistan alut: patarummun ja basson iskut ja askeleet (mitattu: 9:40-9:57 antaa kuunteluoppaan 14 sykettä)
  const alut = [];
  { const m = new Float32Array(NF); for (let f = 0; f < NF; f++) m[f] = huippu(28, 47, f);
    let viime = -99; for (let f = 5; f < NF; f++) { const n = m[f] - Math.min(m[f - 5], m[f - 4], m[f - 3], m[f - 2]); if (n >= 0.1 && m[f] > 0.2 && f - viime >= 8) { alut.push({ t: f / FPS, v: clamp(n / 0.22, 0.4, 1) }); viime = f; } } }
  // nimetyt iskut: kuunteluoppaan ja käsikirjoituksen iskut; pystysuora leikkaus kuuluu vain näihin
  const NIMETYT = new Set(['Q_koko_metsa', 'myrsky_huippu', 'R_vasket', 'P_vaskipaisunta', 'vaski_tutti_620', 'M_ennakko']);
  const iskut = cues.cues.filter((c) => c.t != null && (c.luokka === 'isku' || NIMETYT.has(c.id))).map((c) => ({ t: c.t, id: c.id }));
  const T = (t) => clamp(t, 0, aika.tiedoston_loppu) * FPS;
  return {
    cues, aika, vaadi, FPS, NF, taso, sarja, ka, kohta, huippu, pitkaSavel,
    // valmiit signaalit hetkellä t (s), keskiarvo +- w sekuntia; arvot 0..1
    pitka: (t, w = 1.0) => ka(sPitka, T(t), w * FPS),          // teoksen pitkän äänen voima (käyrätorvet, puhaltimet)
    matala: (t, w = 0.4) => ka(sMatala, T(t), w * FPS),        // bassot, sellot, patarummut
    keski: (t, w = 0.4) => ka(sKeski, T(t), w * FPS),          // keskirekisteri ilman pitkää ääntä (jousten runko)
    korkea: (t, w = 0.4) => ka(sKorkea, T(t), w * FPS),        // ylärekisteri (viulut ylhäällä, huilut)
    koko: (t, w = 0.4) => ka(sKoko, T(t), w * FPS),            // koko orkesterin voima
    melodia: (t, w = 2.0) => ka(sMel, T(t), w * FPS),          // melodian korkeus midinä (60 = c1), hitaana kaarena
    alut,                                                      // [{ t, v }] matalat alut
    iskut,                                                     // [{ t, id }] nimetyt iskut
    aksentit: cues.iskut.map((x) => ({ t: x.t, v: clamp(x.pisteet / 70, 0.15, 1) })),      // koneen kuulemat aksentit (ei leikkauksia)
    nuotit: cues.nuotit,                                       // [alku, kesto, midi]
    paisut,                                                    // (ta, tb) -> { tapahtumat, env }: jousten paisutukset kaistoittain
    db: (midi, f) => { const b = Math.round(midi) - sm.midi_alin; return (b < 0 || b >= NB) ? sm.db_alin : SP[clamp(Math.round(f), 0, NF - 1) * NB + b] / 255 * -sm.db_alin + sm.db_alin; },   // kaistan taso desibeleinä (db_alin..0)
    tapahtumat: cues.tapahtumat,                               // [{ tyyppi, alku, loppu, ... }] koneen kuulemat tapahtumat
    tapahtuu: (tyyppi, t) => cues.tapahtumat.some((e) => e.tyyppi === tyyppi && t >= e.alku && t <= (e.loppu ?? e.alku)),
  };
}

// Julkaisee kohtauksen renderöintityökalulle (render/render.mjs). seek(t) piirtää hetken t; kuvaus(t) palauttaa mitattavat luvut.
export function julkaise({ gl, aika, seek, kuvaus, kamera }) {
  window.duration = aika.tiedoston_loppu;
  window.contextOk = () => !gl.isContextLost();
  window.camProbe = kamera || ((t) => ({ p: [0, 0, t], q: [0, 0, 0, 1], shot: 'matka', cut: 0, trans: false }));
  window.kuvaus = kuvaus || (() => ({}));
  window.seek = (t) => { if (gl.isContextLost()) return false; seek(t); return true; };
  window.sceneReady = true;
}
