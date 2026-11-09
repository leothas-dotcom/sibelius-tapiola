// Tapiola, uusi piirto (tyyliohje luvut 1, 2, 5 ja 4d): syvä metsä ja matka sisään.
// Kamera kulkee suoraan eteen tasaista vauhtia. Metsä on pysyvä: puut eivät kasva, kutistu eivätkä hypi äänen mukana.
// Ääni näkyy valona, usvana ja lumena. Kohtaus on puhdas aikafunktio seek(t): kaikki kertymät lasketaan alussa ruuduittain.
const clamp = (x, a, b) => Math.min(Math.max(x, a), b);
const smooth = (k) => k * k * (3 - 2 * k);

const VS = `#version 300 es
in vec2 a; void main() { gl_Position = vec4(a, 0.0, 1.0); }`;

const FS = `#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2 uRes;
uniform float uAA, uTime, uCamZ, uCamH, uHor, uEdge, uGis, uVis, uFogL, uWind;
uniform float uHills[5];
uniform vec3 uCut;        // välähdys, jälkihohto, etäisyys kamerasta
uniform vec4 uSnow;       // tiheys, sivutuulen matka, putoamisen matka, lähestymisen matka
uniform vec4 uPulse[4];   // maan valo: ikä, voima, -, -
const float F = 1.07;     // polttoväli kuvan korkeuksina
const float D = 8.0;      // syvyysviipaleen paksuus (m)
const float W = 5.0;      // puun ruutu sivusuunnassa (m)
const int NS = 40;
const vec3 SKY_TOP = vec3(0.004, 0.006, 0.012), SKY_LOW = vec3(0.016, 0.026, 0.050), FOG = vec3(0.028, 0.042, 0.072);
const vec3 TREE = vec3(0.003, 0.005, 0.009), GLOW = vec3(0.55, 0.66, 0.86), SNOWC = vec3(0.55, 0.62, 0.75), CUTC = vec3(0.92, 0.96, 1.0);

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }

// kuusen siluetti; q on paikka tyvestä (x sivulle, y ylös), h korkeus ja w puolileveys kuvassa
float spruce(vec2 q, float h, float w, float seed, float soft) {
  float v = q.y / h;
  if (v < 0.0 || v > 1.0 || abs(q.x) > w * 1.9) return 0.0;
  float s1 = fract(seed * 7.31), s2 = fract(seed * 3.17 + 0.4), s3 = fract(seed * 5.77 + 0.2);
  float side = q.x > 0.0 ? 1.0 : 5.0;
  if (s3 > 0.86) {                                   // mänty: paljas runko, repaleinen latvus ylhäällä
    float cb = 0.55 + 0.2 * s2;
    float cv = clamp((v - cb) / (1.0 - cb), 0.0, 1.0);
    float lump = 0.25 + 1.1 * vnoise(vec2(v * 14.0 + side * 3.0, seed * 3.0));
    float crown = w * 1.25 * pow(max(sin(3.14159 * pow(cv, 0.7)), 0.0), 0.5) * lump * step(cb, v);
    return smoothstep(soft, -soft, abs(q.x) - max(crown, w * 0.10 * (1.0 - 0.5 * v)));
  }
  if (s3 > 0.80) {                                   // kelo: pelkkä runko ja muutama oksantynkä
    float stub = step(0.82, hash(vec2(floor(v * 11.0), seed * 7.0 + side))) * w * 0.6 * (1.0 - v) * (1.0 - fract(v * 11.0));
    return smoothstep(soft, -soft, abs(q.x) - max(stub, w * 0.09 * (1.0 - 0.6 * v)));
  }
  float cb = 0.06 + 0.16 * s2;
  float cv = clamp((v - cb) / (1.0 - cb), 0.0, 1.0);
  float ti = cv * (9.0 + 9.0 * s1) + abs(q.x) / w * 1.9 + seed;
  float jag = 0.45 + 1.0 * hash(vec2(floor(ti), seed * 13.0 + side));
  float shape = 0.45 + 0.55 * pow(1.0 - cv, 1.6);
  float crown = w * shape * (0.35 + 0.65 * (1.0 - fract(ti))) * jag * step(cb, v) * (0.8 + 0.4 * vnoise(vec2(v * 6.0 + side, seed * 2.0)));
  return smoothstep(soft, -soft, abs(q.x) - max(crown, w * 0.07));
}

// maa: lumikenttä on tasainen; metsän reunasta alkaa vaaran rinne, joten taaemmat puut näkyvät etummaisten yli
float terr(float wx, float wz) {
  float u = max(wz - uEdge + 20.0, 0.0);
  return 0.17 * u * smoothstep(0.0, 70.0, u) / (1.0 + u / 500.0) + 6.0 * smoothstep(0.0, 90.0, u) * (vnoise(vec2(wx * 0.011, wz * 0.011)) - 0.3);
}

float fogAt(float z, float wx, float wz) {      // usvaa on paikoin enemmän: puut tulevat siitä esiin
  float pt = 0.75 + 0.5 * vnoise(vec2(wx * 0.025, wz * 0.025 + uTime * 0.01));
  return 1.0 - exp(-z / uFogL * pt);
}

vec3 scene(vec2 p) {
  float asp = uRes.x / uRes.y;
  float dx = p.x - asp * 0.5, dy = p.y - uHor;
  // taivas ja usva
  vec3 col = mix(SKY_LOW, SKY_TOP, smoothstep(0.0, 0.6, dy));
  float m1 = 0.5 + 0.5 * sin(p.x * 2.1 + uTime * 0.05 + 1.6 * sin(p.y * 5.3 - uTime * 0.03));
  float m2 = vnoise(vec2(p.x * 3.0 + uTime * 0.04, p.y * 9.0));
  col += FOG * 0.22 * (0.6 * m1 + 0.4 * m2 - 0.4) * exp(-max(dy, 0.0) / 0.25);
  // gis: horisontin valo metsän takana; horisontti muodostaa mäkiä hitaasti (spektrin muoto)
  float hl = 0.012;
  for (int i = 0; i < 5; i++) { float xc = asp * (0.14 + 0.18 * float(i)) + 0.05 * sin(float(i) * 2.4); float e = (p.x - xc) / (0.30 + 0.05 * float(i % 2)); hl += uHills[i] * exp(-e * e); }
  hl += 0.004 * (vnoise(vec2(p.x * 3.0, 3.0)) - 0.5);
  float above = dy - hl;
  if (dy > 0.0) {
    col += GLOW * uGis * (0.50 * exp(-max(above, 0.0) / 0.035) + 0.09 * exp(-max(above, 0.0) / 0.14)) * (0.85 + 0.3 * m2);
    if (above < 0.0) col = mix(FOG * 0.55, FOG * 0.75 + GLOW * uGis * 0.03, smoothstep(-0.06, 0.0, above));       // kaukainen maa valon edessä
    col += GLOW * uGis * 0.55 * exp(-pow(above / 0.0025, 2.0));                                                 // horisontin reuna
  } else {
    // lumikenttä: tumma, usva nielee sen kaukana; horisontin valo viistää pintaa
    float z = uCamH * F / max(-dy, 1e-4);
    float wx = dx * z / F, wz = z + uCamZ;
    float drift = 0.5 + 0.5 * vnoise(vec2(wx * 0.22, wz * 0.11)) ;
    vec3 g = vec3(0.012, 0.018, 0.030) * (0.7 + 0.6 * drift) + GLOW * uGis * 0.035 * drift * exp(-z / 120.0);
    for (int i = 0; i < 4; i++) { vec4 pu = uPulse[i]; if (pu.y <= 0.0) continue;        // patarumpu: valo kulkee lumen pinnassa
      float r = length(vec2(wx, z - 26.0)) - pu.x * 9.0;
      g += GLOW * pu.y * 0.10 * exp(-pu.x * 0.9) * exp(-r * r / 14.0); }
    g += CUTC * (uCut.x * 0.008 + uCut.y * 0.012) * exp(-abs(wx) / (4.0 + 0.2 * z)) * smoothstep(2.0, 20.0, z);
    col = mix(g, FOG, fogAt(z, wx, wz));
  }
  // lumi ja metsä syvyysjärjestyksessä kaukaa lähelle
  float zs[8];
  for (int s = 0; s < 8; s++) zs[s] = 1.5 + mod(float(s) * 5.5 - uSnow.w, 44.0);
  float kBase = floor(uCamZ / D);
  float zPrev = 1e5; bool cutDone = false;
  for (int k = NS - 1; k >= -1; k--) {
    float ks = kBase + float(k);
    float zw = (ks + 0.5) * D, z = (k < 0) ? 0.0 : zw - uCamZ;
    // leikkaus: vasket repäisevät valon pystyyn syvällä metsässä; lähemmät puut jäävät sen eteen
    if (!cutDone && z < uCut.z) { cutDone = true;
      float w = 0.004 + 0.003 * vnoise(vec2(p.y * 12.0, 1.0));
      float xo = 0.012 * (vnoise(vec2(p.y * 5.0, 7.0)) - 0.5);
      float d = abs(dx - 0.03 - xo);
      col += CUTC * (uCut.x * exp(-d * d / (w * w)) * smoothstep(-0.01, 0.06, dy) + (uCut.x * 0.25 + uCut.y) * (0.5 * exp(-d / 0.06) + 0.16 * exp(-d / 0.45)) * smoothstep(-0.1, 0.1, dy)); }
    for (int s = 0; s < 8; s++) {        // lumi tämän viipaleen takana
      if (zs[s] > zPrev || zs[s] <= z) continue;
      float zz = zs[s];
      vec2 w2 = vec2(dx * zz / F + uSnow.y * (0.6 + 0.05 * float(s)), dy * zz / F + uSnow.z) / 0.9 + float(s) * 17.3 + floor((float(s) * 5.5 - uSnow.w) / 44.0) * 3.7;
      vec2 ic = floor(w2), fr = fract(w2);
      float h = hash(ic);
      if (h < uSnow.x) { vec2 c = 0.15 + 0.7 * vec2(hash(ic + 1.7), hash(ic + 5.1));
        float dd = length(fr - c) * 0.9, r = 0.030 + 0.02 * fract(h * 53.0);
        col += SNOWC * 0.55 * smoothstep(r, r * 0.25, dd) * smoothstep(1.5, 4.0, zz) * smoothstep(45.5, 38.0, zz) * exp(-zz / uFogL * 0.5); }
    }
    zPrev = z;
    if (k < 0 || z < 1.2) continue;
    float wx = dx * z / F;
    float ci = floor(wx / W);
    float th = terr(wx, zw);
    if (th > 0.02 && dy < (th - uCamH) * F / z) {                      // rinteen lumi tässä syvyydessä
      float fgr = fogAt(z, wx, zw);
      col = mix(vec3(0.010, 0.015, 0.026) * (0.8 + 0.4 * vnoise(vec2(wx * 0.2, zw * 0.3))), FOG, fgr);
    }
    float grove = smoothstep(0.62, 0.80, vnoise(vec2(wx * 0.03 + 7.0, zw * 0.03)));                 // harvat saarekkeet aukealla
    float dens = (0.20 + 0.95 * vnoise(vec2(wx * 0.018, zw * 0.018))) * 0.66 * smoothstep(uEdge - 10.0, uEdge + 40.0, zw) + 0.5 * grove * (1.0 - smoothstep(uEdge - 10.0, uEdge, zw));
    for (int j = -1; j <= 1; j++) {
      vec2 id = vec2(ci + float(j), ks);
      if (hash(id) > dens) continue;
      float xt = (id.x + 0.2 + 0.6 * hash(id + 3.1)) * W;
      if (abs(xt) < 2.4) continue;                                     // kulkijan tie on auki suoraan eteen
      float zt = zw + (hash(id + 9.2) - 0.5) * D * 0.9 - uCamZ;
      if (zt < 1.0) continue;
      float hh = hash(id + 6.4);
      float Ht = mix(7.0, 30.0, hh * hh), hs = Ht * F / zt;
      float base = (terr(xt, zt + uCamZ) - uCamH) * F / zt;
      float sway = (0.004 + 0.012 * uWind) * sin(uTime * (0.7 + 0.5 * hh) + hh * 40.0);
      vec2 q = vec2(dx - xt * F / zt, dy - base);
      q.x -= sway * hs * (q.y / hs) * (q.y / hs) + (hash(id + 4.4) - 0.5) * 0.07 * q.y;      // jokainen puu on hieman kallellaan omaan suuntaansa
      float a = spruce(q, hs, hs * (0.075 + 0.05 * hash(id + 2.2)), hh * 9.0 + id.x * 0.37, 1.2 / uRes.y);
      if (a <= 0.0) continue;
      float fg = fogAt(zt, xt, zt + uCamZ) * mix(1.0, 0.86, uVis);       // jouset: usva ohenee metsän edestä
      vec3 tone = mix(TREE, FOG * (0.95 + 0.4 * uGis * exp(-abs(q.y / hs - 0.2))), fg);
      a *= smoothstep(float(NS) * D, float(NS - 5) * D, zt) * (1.0 - 0.8 * fg * fg);
      col = mix(col, tone, a);
    }
  }
  return col;
}

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

async function alusta() {
  const q = new URLSearchParams(location.search);
  const cues = await (await fetch('/annotations/cues.json')).json();
  const aika = Object.fromEntries(cues.cues.map((c) => [c.id, c.t]));
  aika.tiedoston_loppu = cues.recording.kesto_s;
  for (const id of ['avaus_patarumpu', 'vaskien_isku', 'tuulenpuuska', 'hiljaisuus_1_alku', 'hiljaisuus_1_loppu']) if (aika[id] == null) throw new Error('ankkuri puuttuu: ' + id);
  const oh = cues.ohjaus, sm = oh.spektri;
  const SP = new Uint8Array(await (await fetch('/' + sm.tiedosto)).arrayBuffer());
  const NB = sm.kaistoja, FPS = oh.fps, NF = oh.frames;
  if (SP.length !== NF * NB) throw new Error('spektri.u8: koko ei vastaa ruutuja');
  const taso = (midi, f) => { const b = midi - sm.midi_alin; return clamp((SP[f * NB + b] / 255 * -sm.db_alin + sm.db_alin + 48) / 40, 0, 1); };
  // hitaat keskiarvot ruuduittain (kertymäsummilla): mikään kuvassa ei seuraa ääntä ruutu ruudulta
  const sarja = (fn) => { const a = new Float32Array(NF + 1); for (let f = 0; f < NF; f++) a[f + 1] = a[f] + fn(f); return a; };
  const ka = (a, f, w) => { const lo = clamp(Math.round(f - w), 0, NF), hi = clamp(Math.round(f + w), 0, NF); return hi > lo ? (a[hi] - a[lo]) / (hi - lo) : 0; };
  const GIS = 68, YLA = [0, 12, 19, 24, 28];
  const sGis = sarja((f) => taso(GIS, f));
  const sYla = YLA.map((o) => sarja((f) => taso(GIS + o, f)));
  const sVis = sarja((f) => { let mx = 0; for (let mi = 55; mi <= 76; mi++) if (mi !== GIS) mx = Math.max(mx, taso(mi, f)); return mx; });
  // matalan kaistan tason nousut: patarummun ja basson alut (valo lumen pinnassa)
  const ALUT = [];
  { const m = new Float32Array(NF); for (let f = 0; f < NF; f++) { let mx = 0; for (let mi = 28; mi <= 47; mi++) mx = Math.max(mx, taso(mi, f)); m[f] = mx; }
    let viime = -99; for (let f = 5; f < NF; f++) { const n = m[f] - Math.min(m[f - 5], m[f - 4], m[f - 3], m[f - 2]); if (n >= 0.1 && m[f] > 0.2 && f - viime >= 8) { ALUT.push({ t: f / FPS, v: clamp(n / 0.22, 0.4, 1) }); viime = f; } } }
  // lumen matka: putoaminen hidastuu hiljaisuudessa, puuska tulee vaskien iskusta
  const puuska = (t) => (t < aika.tuulenpuuska ? 0 : smooth(clamp((t - aika.tuulenpuuska) / 0.5, 0, 1)) * Math.exp(-(t - aika.tuulenpuuska) / 5));
  const hilj = (t) => smooth(clamp((t - aika.hiljaisuus_1_alku) / 1.5, 0, 1)) * (1 - smooth(clamp((t - aika.hiljaisuus_1_loppu) / 1.5, 0, 1)));
  const V = 1.9;                                                       // kulkijan vauhti m/s: tasainen, ei reagoi
  const kPut = sarja((f) => (0.5 * (1 - 0.85 * hilj(f / FPS)) + 0.5 * puuska(f / FPS)) / FPS);
  const kTuuli = sarja((f) => (0.12 + 2.6 * puuska(f / FPS)) / FPS);
  const kLahe = sarja((f) => (V + 6 * puuska(f / FPS)) / FPS);
  const kohta = (a, t) => { const x = clamp(t * FPS, 0, NF - 1e-3), i = Math.floor(x); return a[i] + (a[i + 1] - a[i]) * (x - i); };

  const canvas = document.getElementById('c');
  const gl = canvas.getContext('webgl2', { antialias: false, preserveDrawingBuffer: true });
  if (!gl) throw new Error('WebGL2 ei käytettävissä');
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error('varjostin: ' + gl.getShaderInfoLog(s)); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('linkitys: ' + gl.getProgramInfoLog(prog));
  gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = (n) => gl.getUniformLocation(prog, n);
  const aa = Number(q.get('aa') || 2);
  const REUNA = 115;                                                   // metsän reunan paikka (m lähdöstä)

  window.duration = aika.tiedoston_loppu;
  window.contextOk = () => !gl.isContextLost();
  window.camProbe = (t) => ({ p: [0, 1.6, V * t], q: [0, 0, 0, 1], shot: 'matka', cut: 0, trans: false });
  window.seek = (t) => {
    if (gl.isContextLost()) return false;
    const f = t * FPS, camZ = V * t;
    const gis = ka(sGis, f, 1.0 * FPS);
    const hills = sYla.map((s, i) => 0.30 * Math.pow(ka(s, f, 3.0 * FPS), 1.2) * (i === 0 ? 0.8 : 1));
    const vis = ka(sVis, f, 1.5 * FPS);
    const ti = t - aika.vaskien_isku;
    const cut = ti < 0 ? [0, 0] : [2.4 * (1 - Math.exp(-ti / 0.09)) * Math.exp(-ti / 0.35), 0.9 * (1 - Math.exp(-ti / 0.4)) * Math.exp(-ti / 3.0)];
    const pu = new Float32Array(16);
    const kaikki = ALUT.filter((x) => x.t <= t && t - x.t < 5).slice(-4);
    kaikki.forEach((x, i) => pu.set([t - x.t, x.v, 0, 0], i * 4));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(U('uRes'), canvas.width, canvas.height);
    gl.uniform1f(U('uAA'), aa); gl.uniform1f(U('uTime'), t); gl.uniform1f(U('uCamZ'), camZ); gl.uniform1f(U('uCamH'), 1.6);
    gl.uniform1f(U('uHor'), 0.40); gl.uniform1f(U('uEdge'), REUNA); gl.uniform1f(U('uGis'), gis); gl.uniform1f(U('uVis'), vis);
    gl.uniform1f(U('uFogL'), 62 + 22 * vis); gl.uniform1f(U('uWind'), puuska(t));
    gl.uniform1fv(U('uHills'), new Float32Array(hills));
    gl.uniform3f(U('uCut'), cut[0], cut[1], REUNA + 40 - camZ);
    gl.uniform4f(U('uSnow'), 0.10 + 0.30 * Math.min(1, 3 * puuska(t)) + 0.10 * hilj(t), kohta(kTuuli, t), kohta(kPut, t), kohta(kLahe, t));
    gl.uniform4fv(U('uPulse'), pu);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.finish();
    return true;
  };
  window.sceneReady = true;
}
alusta().catch((e) => { console.error(e); window.sceneError = String(e.message || e); });
