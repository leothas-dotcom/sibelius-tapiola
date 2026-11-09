// Tapiola: maailma 9, Petos ja hermo. M_raskaat_askeleet -> hiljaisuus_2_alku. Rakentaja-agentin moduuli.
// Alku: RAJA.PIMEYS, loppu: RAJA.PIMEA_MASSA (visual/yhteinen.js). Suunnitelma: runs/maailma_09/tarkistus.md ja brief.md.
// Pimeä Kalevalan metsä, josta valo on viety vuoreen yhdeksän oven taakse (K49). Katsoja ajaa silmänkorkeudella tasaisen
// lumisen maan yli; metsä on parvia runkoja eri etäisyyksillä, latvusto päällä, usva kaikkialla. Mikään ei näy, ellei jokin
// valaise sitä: maasta nouseva valo (askeleet, aksentit), nimetyn iskun pystyvalo ja himmeä jälkihohto. Yhdeksän ovea ovat
// sileitä tummia kumpuja polun poikki, joihin on avattu kaareva aukko; niiden läpi ajetaan. Yhdeksäs kumpu on umpinainen.
// Siemenen kuva: kaukana polun päässä heikko kajo (horisontti), sen alla tumma massa, sileät kummut, lumi.
// Kohtaus on puhdas aikafunktio seek(t): kamera on äänestä lasketun vauhdin integraali (kertymä), ei ajastimia.
import { lataa, luoGL, julkaise, FS_ALKU, GLSL_YHTEINEN, FS_LOPPU, RAJA, clamp, smooth, sstep, fract, lerp } from './yhteinen.js';

const NS = 52;          // runkokerrosten lukumäärä (kauimmaisesta lähimpään)
const NDOOR = 9;

const FS = FS_ALKU + `
uniform float uWind, uTime, uCamS, uCamX, uGlow, uShake, uEnd, uStart, uThin0, uThin1, uFogL, uGround, uLift;
uniform vec2 uCut;        // pystyvalo: nopea välähdys, hidas jälkihohto (vain nimetyt iskut)
uniform vec2 uTwo;        // kaksi valon paikkaa: vasen (käyrätorvet), oikea (trumpetit)
uniform vec4 uPulse[6];   // maan valo: ikä (s), voima, renkaan lähtö (m kamerasta), -
uniform vec4 uDot[24];    // väike: sivuasema (m kamerasta), etäisyys (m), voima, korkeus (m)
uniform int uNDot;
uniform float uDoorZ[9];  // oven etäisyys kamerasta (m)
uniform float uDoorX[9];  // oven keskikohdan sivuasema kamerasta (m)
uniform vec4 uDoorP[9];   // aukon puolileveys, aukon korkeus, kummun korkeus, kummun leveys
uniform float uProf[16];  // horisontin muoto: melodian kaari
` + GLSL_YHTEINEN + `
const float F = 1.07, CAMH = 1.7, HOR = 0.40;
const int NS = ${NS};
const float DZ = 3.3, ZMAX = 168.0;
const vec3 TRUNK = vec3(0.0030, 0.0038, 0.0044);

float xPath(float S) { return 0.085 * S + 2.2 * sin(S * 0.011 + 0.7) + 0.9 * sin(S * 0.027 + 2.0); }
float h1(float n) { return fract(sin(n * 12.9898) * 43758.5453); }
float sliceS(float n) { return (n + 0.9 * h1(n * 1.37 + 0.3)) * DZ; }

// maan valo: rengas kulkee lumen pintaa poispäin kameran edestä
float ringAt(float z) {
  float s = 0.0;
  for (int i = 0; i < 6; i++) {
    vec4 pu = uPulse[i]; if (pu.y <= 0.0) continue;
    float R = pu.z + 26.0 * pu.x, w = 2.2 + 0.16 * max(R, 0.0), k = (z - R) / w;
    s += pu.y * exp(-pu.x * 1.8) * exp(-k * k);
  }
  return s;
}

// usva, jonka läpi kaikki nähdään: kajo kaukana polun päässä, pystyvalo, kaksi valon paikkaa
vec3 fogAt(float dx, float dy, float asp) {
  float gy = dy - 0.035 - uLift;
  vec2 q = vec2(dx / (0.60 * asp), gy / 0.40);
  float g = exp(-dot(q, q) * 1.5);
  float ang = atan(dy, dx);
  float rr0 = length(vec2(dx, dy));
  float ray = 1.0 + 0.45 * (vnoise(vec2(ang * 3.2 + 3.0, uCamS * 0.010)) - 0.5) * smoothstep(0.03, 0.30, rr0);
  float drift = 0.80 + 0.40 * vnoise(vec2(dx * 2.6 + uTime * 0.012, dy * 4.0 - uTime * 0.008));
  vec3 c = SALO * (0.075 + 0.05 * drift);
  c += HALLA * 0.13 * uGlow * g * ray * drift;
  // pystyvalo (nimetyt iskut): kapea kolonni keskellä, kerrosten läpi
  float w = 0.006 + 0.004 * vnoise(vec2(dy * 12.0, 1.0));
  float cd = abs(dx - 0.012 * (vnoise(vec2(dy * 5.0, 7.0)) - 0.5));
  float col1 = exp(-cd * cd / (w * w)) + 0.30 * exp(-cd / 0.05);
  c += LEIKKAUS * uCut.x * (col1 * 0.9 + 0.16 * g * ray) * smoothstep(-0.45, 0.10, dy + 0.35);
  c += HALLA * uCut.y * (0.9 * g * ray + 0.25 * exp(-cd / 0.30)) * 0.30;
  // kaksi valon paikkaa pimeässä
  vec2 a1 = vec2(dx + 0.62, gy), a2 = vec2(dx - 0.62, gy);
  c += HALLA * uTwo.x * 0.42 * exp(-(a1.x * a1.x / 0.060 + a1.y * a1.y / 0.014));
  c += HOPEA * uTwo.y * 0.46 * exp(-(a2.x * a2.x / 0.045 + a2.y * a2.y / 0.010));
  return c;
}

// rungon varjon haku maassa (valo tulee kaukaa polun päästä, varjot ovat kohti katsojaa)
float trunkProbe(float n, float rel, out float rr) {
  const float CW = 3.7;
  float c0 = floor(rel / CW), best = 1e3; rr = 0.3;
  float S = sliceS(n);
  float dens = 0.60 * (1.0 - 0.86 * smoothstep(uThin0, uThin1, S));
  for (int j = -1; j <= 1; j++) {
    float c = c0 + float(j);
    if (hash(vec2(c * 1.13 + 0.5, n * 0.731 + 2.1)) > dens) continue;
    float xt = (c + 0.12 + 0.76 * hash(vec2(c * 0.37 + 9.0, n * 1.19))) * CW;
    float r = 0.17 + 0.62 * pow(hash(vec2(c * 2.9 + 4.0, n * 0.53 + 1.0)), 1.6);
    if (hash(vec2(c + 31.0, n * 2.3)) > 0.95) r *= 2.1;
    if (abs(xt) < 1.8 + r) continue;
    float dd = abs(rel - xt) - r;
    if (dd < best) { best = dd; rr = r; }
  }
  return best;
}

vec3 groundAt(float dx, float dy, vec3 fog, float n0) {
  float zg = CAMH * F / max(-dy, 1e-4);
  float wx = dx * zg / F + uCamX, wz = zg + uCamS;
  float hum = vnoise(vec2(wx * 0.25, wz * 0.12)), hum2 = vnoise(vec2(wx * 1.3, wz * 0.55));
  vec3 g = vec3(0.0075, 0.0115, 0.0200) * (0.5 + 0.9 * hum) * (0.8 + 0.4 * hum2);
  g += HALLA * 0.030 * uGlow * (0.3 + 0.7 * hum) * exp(-zg / 130.0);
  g += HALLA * 0.38 * ringAt(zg) * (0.35 + 0.65 * hum2);
  float lc = 0.55 * uCut.x + 0.40 * uCut.y;
  if (lc > 0.004) {
    float sh = 1.0;
    for (int k = 0; k < NS; k++) {
      float n = n0 + float(k), S = sliceS(n), z = S - uCamS;
      if (z <= zg + 0.2 || z > zg + 60.0) continue;
      float rr, dd = trunkProbe(n, wx - xPath(S), rr);
      float pen = 0.10 + 0.030 * (z - zg);
      sh *= 1.0 - 0.93 * smoothstep(pen, -pen, dd);
    }
    g += LEIKKAUS * 0.16 * lc * (0.55 + 0.45 * hum2) * sh * smoothstep(1.5, 18.0, zg);
  }
  g = mix(fog * 0.5, g, uGround);
  return mix(g, fog, 1.0 - exp(-zg / uFogL));
}

// vuorikumpu ja sen aukko (ovi)
vec4 doorLayer(int i, float zd, float dx, float dy, vec3 fog, float ring) {
  vec4 P = uDoorP[i];
  float u = dx * zd / F - uDoorX[i];
  float yw = CAMH + dy * zd / F;
  if (yw < -0.3) return vec4(0.0);
  float fi = float(i);
  float h = P.z * exp(-pow(abs(u) / P.w, 2.3)) + 0.9 * (vnoise(vec2(u * 0.30 + fi * 7.1, 1.7)) - 0.5) + 0.40 * (vnoise(vec2(u * 1.9 + fi, 3.0)) - 0.5);
  float body = smoothstep(h + 0.22, h - 0.22, yw);
  body *= smoothstep(-0.30, 0.15, yw);
  float len = 9.0, hole = 0.0;
  if (P.x > 0.0) { len = length(vec2(u / P.x, yw / P.y)); hole = (1.0 - smoothstep(0.90, 1.0, len)) * step(-0.25, yw); }
  float a = body * (1.0 - hole);
  if (a <= 0.0) return vec4(0.0);
  float f = (1.0 - exp(-zd / uFogL)) * (P.x > 0.0 ? 1.0 : 0.25);     // yhdeksäs kumpu erottuu tummana kajoa vasten
  float tex = vnoise(vec2(u * 0.55, yw * 0.22 + fi * 3.0));
  float stripes = smoothstep(0.55, 0.85, vnoise(vec2(u * 2.6 + fi * 5.0, yw * 0.12)));
  vec3 dark = HAMY * (0.9 + 0.8 * tex) * (1.0 - 0.3 * stripes);
  vec3 lit = HALLA * 0.34 * ring * exp(-max(yw, 0.0) / 5.0) * (0.35 + 0.65 * stripes) * (0.6 + 0.4 * tex);
  float rimB = smoothstep(0.72, 0.97, len) * (1.0 - smoothstep(0.97, 1.0, len));
  vec3 tone = mix(dark + lit, fog, f) + fog * 0.40 * rimB * (1.0 - 0.5 * f);
  // maa katoaa alta: kummun tyvi sulaa usvaan
  a *= 1.0 - (1.0 - uGround) * smoothstep(3.0, 0.0, yw);
  return vec4(tone, a * smoothstep(ZMAX * 1.4, ZMAX * 0.9, zd));
}

// yksi runkokerros (ja sen latvusto) etäisyydellä z; palauttaa rungon, latvuston tulee out-parametrina
vec4 trunkLayer(float n, float S, float z, float dx, float dy, vec3 fog, float ring, out vec4 crown) {
  crown = vec4(0.0);
  float rel = dx * z / F - (xPath(S) - uCamX);
  float yw = CAMH + dy * z / F;
  if (yw < 0.0) return vec4(0.0);
  const float CW = 3.7;
  float dens = 0.60 * (1.0 - 0.86 * smoothstep(uThin0, uThin1, S));
  float f = 1.0 - exp(-z / uFogL);
  float fade = smoothstep(ZMAX, ZMAX * 0.72, z);
  float cover = 0.0, uu = 0.0, idd = 0.0, xcs = 0.0;
  float c0 = floor(rel / CW);
  for (int j = -1; j <= 1; j++) {
    float c = c0 + float(j);
    if (hash(vec2(c * 1.13 + 0.5, n * 0.731 + 2.1)) > dens) continue;
    float xt = (c + 0.12 + 0.76 * hash(vec2(c * 0.37 + 9.0, n * 1.19))) * CW;
    float rr = 0.17 + 0.62 * pow(hash(vec2(c * 2.9 + 4.0, n * 0.53 + 1.0)), 1.6);
    if (hash(vec2(c + 31.0, n * 2.3)) > 0.95) rr *= 2.1;
    if (abs(xt) < 1.8 + rr) continue;
    float H = 15.0 + 11.0 * hash(vec2(c * 0.61 + 2.0, n + 7.0));
    if (yw > H) continue;
    float lean = (hash(vec2(c + 3.0, n * 0.41)) - 0.5) * 0.03;
    float swp = S * 0.045 - uTime * 0.75 + c * 0.9;                       // tuuli: aalto kulkee metsän läpi, latvat taipuvat ja palaavat
    float xc = xt + lean * yw + 0.12 * sin(yw * 0.55 + c) + uWind * 0.0065 * yw * yw * (sin(swp) + 0.45 * sin(swp * 2.3 + 1.0));
    float re = rr * (1.0 + 0.55 * exp(-yw * 1.2)) * (1.0 - 0.3 * yw / H);
    // oksantyngät: leveämpi runko tietyillä korkeuksilla
    re *= 1.0 + 0.16 * smoothstep(0.80, 0.95, vnoise(vec2(yw * 3.1, c * 3.1 + n)));
    re *= 1.0 + uShake * 0.09 * sin(yw * 8.0 + uTime * 44.0 + c * 2.7);       // tremolo: väre paikallaan
    float cv = smoothstep(re, re * 0.9, abs(rel - xc));
    if (cv > cover) { cover = cv; uu = (rel - xc) / re; idd = c + n * 13.0; xcs = xc; }
  }
  // latvusto: päältä tiheä, oksien välissä aukkoja, joista valo siivilöityy
  float cb = 8.0 + 4.0 * hash(vec2(n, 9.1));
  if (yw > cb - 3.0) {
    float csw = uWind * 0.0065 * yw * yw * (sin(S * 0.045 - uTime * 0.75 + n * 0.9) + 0.45 * sin((S * 0.045 - uTime * 0.75 + n * 0.9) * 2.3 + 1.0));
    float g = vnoise(vec2((rel - csw) * 0.38 + n * 5.3, yw * 0.42)), g2 = vnoise(vec2((rel - csw) * 1.6 + n * 2.1, yw * 1.5 + 4.0));
    float rise = smoothstep(cb - 2.0, cb + 4.0, yw + 3.0 * (g - 0.5));
    float ca = rise * smoothstep(0.26, 0.58, 0.7 * g + 0.4 * g2 + 0.35 * rise) * 0.90;
    vec3 ct = mix(HAMY * (0.7 + 0.5 * g2), fog, f * 0.9);
    crown = vec4(ct, ca * fade);
  }
  if (cover <= 0.0) return vec4(0.0);
  float bark = 0.75 + 0.5 * vnoise(vec2(yw * 1.3, idd));
  float streak = vnoise(vec2(uu * 7.0 + idd, yw * 0.35));
  vec3 dark = TRUNK * bark * (0.8 + 0.4 * streak);
  float shade = sqrt(max(1.0 - uu * uu, 0.0));
  float sgn = xcs < 0.0 ? 1.0 : -1.0, sgn0 = sgn;
  vec3 lit = HALLA * 0.26 * ring * shade * shade * exp(-yw / 2.6) * (0.5 + 0.7 * bark) * (0.75 + 0.5 * smoothstep(-1.0, 1.0, uu * -sgn0));
  float rimK = 0.10 * uGlow + 0.55 * uCut.y + 1.30 * uCut.x;
  vec3 rim = LEIKKAUS * rimK * 0.5 * smoothstep(0.55, 0.98, uu * sgn) * exp(-z / 25.0) * (1.0 - f);
  vec3 tone = mix(dark + lit + rim, fog, f);
  float al = cover * fade;
  al *= 1.0 - (1.0 - uGround) * smoothstep(5.0, 0.0, yw);           // pohja katoaa: metsä leijuu
  return vec4(tone, al);
}

vec3 dotsBetween(vec3 col, float zn, float zf, float dx, float dy) {
  for (int i = 0; i < 24; i++) {
    if (i >= uNDot) break;
    vec4 dd = uDot[i];
    if (dd.y > zn && dd.y <= zf) {
      vec2 d = (vec2(dx, dy) - vec2(dd.x * F / dd.y, (dd.w - CAMH) * F / dd.y)) / (0.0030 + 0.40 / dd.y);
      col += HOPEA * dd.z * (1.3 * exp(-dot(d, d)) + 0.14 * exp(-dot(d, d) * 0.05)) * exp(-dd.y / (uFogL * 1.4));
    }
  }
  return col;
}

vec3 scene(vec2 p) {
  float asp = uRes.x / uRes.y;
  float dx = p.x - asp * 0.5, dy = p.y - HOR;
  vec3 fog = fogAt(dx, dy, asp);
  float n0 = floor(uCamS / DZ);
  vec3 col;
  if (dy >= 0.0) {
    // kaukainen horisontti: sileät kummut kajoa vasten
    float u = clamp(p.x / asp, 0.0, 1.0) * 15.0; int i = int(floor(u)); float fr = fract(u);
    float pr = mix(uProf[i], uProf[min(i + 1, 15)], fr);
    float hl = 0.032 + 0.030 * vnoise(vec2(p.x * 1.1, 3.0)) + pr;
    float above = dy - hl;
    col = fog * (1.0 - 0.35 * smoothstep(0.0, 0.7, dy));
    col += HALLA * 0.22 * uGlow * exp(-max(above, 0.0) / 0.030) * smoothstep(-0.004, 0.004, above);
    float hillM = smoothstep(0.004, -0.004, above);
    col = mix(col, HAMY * 1.2 + fog * 0.16, hillM);
  } else {
    col = groundAt(dx, dy, fog, n0);
  }
  float zPrev = 1e9;
  for (int k = NS - 1; k >= 0; k--) {
    float n = n0 + float(k), S = sliceS(n), z = S - uCamS;
    if (z < 0.5 || z > ZMAX) continue;
    col = dotsBetween(col, z, zPrev, dx, dy);
    for (int i = NDOOR_M1; i >= 0; i--) {
      float zd = uDoorZ[i];
      if (zd > z && zd <= zPrev && zd > 0.2) { vec4 dl = doorLayer(i, zd, dx, dy, fog, ringAt(zd)); col = mix(col, dl.rgb, dl.a); }
    }
    vec4 cr; vec4 tr = trunkLayer(n, S, z, dx, dy, fog, ringAt(z), cr);
    col = mix(col, cr.rgb, cr.a);
    col = mix(col, tr.rgb, tr.a);
    zPrev = z;
  }
  for (int i = NDOOR_M1; i >= 0; i--) {
    float zd = uDoorZ[i];
    if (zd > 0.2 && zd <= zPrev) { vec4 dl = doorLayer(i, zd, dx, dy, fog, ringAt(zd)); col = mix(col, dl.rgb, dl.a); }
  }
  col = dotsBetween(col, 0.2, zPrev, dx, dy);
  col = mix(col, rajakuva(p, 0, uTime), uEnd);          // loppu: RAJA.PIMEA_MASSA
  col = mix(col, rajakuva(p, 3, uTime), uStart);        // alku: RAJA.PIMEYS
  return col;
}
`.replace(/NDOOR_M1/g, String(NDOOR - 1)) + FS_LOPPU;

async function alusta() {
  const d = await lataa();
  const A = d.aika, FPS = d.FPS, NF = d.NF;
  d.vaadi('M_raskaat_askeleet', 'jannitejakso_alku', 'O_kirjain', 'jannitejakso_loppu', 'allegro_moderato_O_alku', 'allegro_moderato_O_loppu',
    'harva_kuviointi', 'P_vaskipaisunta', 'dim_possibile', 'hiljaisuus_2_alku');
  const cue = (id) => d.cues.cues.find((c) => c.id === id);
  const t0 = A.M_raskaat_askeleet, t1 = A.hiljaisuus_2_alku;
  const tAskEnd = cue('M_raskaat_askeleet').t_end ?? t0 + 12;
  const tPend = cue('P_vaskipaisunta').t_end ?? A.P_vaskipaisunta + 10;
  const inside = (t) => t >= t0 - 0.01 && t <= t1 + 0.01;

  // ---------- äänestä lasketut hitaat signaalit ----------
  // liikkeen tiheys: alkavien nuottien määrä sekunnissa, hidas keskiarvo (4 s): kameran vauhti seuraa vain suuria muutoksia
  const alkuja = new Float32Array(NF); for (const n of d.nuotit) { const f = Math.floor(n[0] * FPS); if (f >= 0 && f < NF) alkuja[f]++; }
  const sRate = d.sarja((f) => alkuja[f]);
  const rate = (t) => d.ka(sRate, t * FPS, 4.0 * FPS) * FPS;
  const mot = (t) => sstep(5, 30, rate(t));
  const vauhti = (t) => (t < t0 ? 0 : (3.0 + 7.5 * mot(t)) * sstep(0, 9, t - t0) * (1 - 0.30 * sstep(A.dim_possibile, t1, t)));
  const kS = d.sarja((f) => vauhti(f / FPS) / FPS);               // kuljettu matka (m): nopeuden integraali
  const S = (t) => d.kohta(kS, t);
  // kamera: sivuttaisliike sama funktio kuin varjostimessa
  const xPath = (s) => 0.085 * s + 2.2 * Math.sin(s * 0.011 + 0.7) + 0.9 * Math.sin(s * 0.027 + 2.0);
  // kokonaistaso (soittimien keskimääräinen voima) -> kajo
  const sLvl = d.sarja((f) => { let s = 0; for (let mi = 36; mi <= 90; mi++) s += d.taso(mi, f); return s / 55; });
  const lvl = (t, w = 1.0) => d.ka(sLvl, t * FPS, w * FPS);
  const sTrem = d.sarja((f) => (d.tapahtuu('tremolo', f / FPS) ? 1 : 0));
  const sHorn = d.sarja((f) => d.huippu(36, 50, f));
  const ikkuna = (t, a, b, e = 1.0) => sstep(a - e, a + e * 0.5, t) * (1 - sstep(b - e * 0.5, b + e, t));
  const tev = (tyyppi, sisaltaa) => d.tapahtumat.filter((e) => e.tyyppi === tyyppi && (!sisaltaa || (e.kuvaus || '').includes(sisaltaa)) && e.alku <= t1 + 5 && (e.loppu ?? e.alku) >= t0 - 5);
  const POHJA_POIS = tev('kerros katoaa', 'pohja');
  const PAISU = tev('paisuva sointu');
  const NOUSUT = [...tev('nousu'), ...tev('lasku')];

  // ---------- ovet: ylitetään rakennekohdissa (ankkurit) ----------
  const tc = [t0 + 3.8, A.jannitejakso_alku, A.O_kirjain, A.jannitejakso_loppu, A.allegro_moderato_O_loppu, A.harva_kuviointi, tPend, A.dim_possibile];
  const doorS = tc.map(S); doorS.push(S(t1) + 0.35);                // yhdeksäs: umpinainen kumpu, jonka kohdalle saavutaan jakson lopussa
  const doorP = [[1.0, 2.4, 14, 36], [2.8, 5.2, 19, 52], [3.2, 6.0, 23, 66], [2.6, 4.9, 16, 48], [3.4, 6.4, 21, 60], [2.9, 5.4, 24, 72], [3.3, 6.1, 18, 54], [2.7, 5.0, 22, 64], [0, 1, 7.5, 26]];
  const thin0 = S(A.dim_possibile), thin1 = S(t1) + 0.35;

  // ---------- valon tapahtumat ----------
  const alueella = (x) => x.t >= t0 - 0.01 && x.t <= t1;
  const PULSSIT = [
    ...d.alut.filter(alueella).map((x) => ({ t: x.t, v: (x.t <= tAskEnd + 0.5 ? 0.95 : 0.35) * x.v })),
    ...d.aksentit.filter(alueella).map((x) => ({ t: x.t, v: 0.50 * x.v })),
  ].sort((a, b) => a.t - b.t);
  const ISKUT = d.iskut.filter(alueella);
  const noteDots = [];    // väike: puupuhaltimien jaksossa (O -> jännitteen loppu) ja harvassa kuvioinnissa
  d.nuotit.forEach((n, idx) => {
    const O = n[0] >= A.O_kirjain && n[0] < A.jannitejakso_loppu && n[2] >= 70 && n[1] >= 0.18 && n[1] < 1.2;
    const H = n[0] >= A.harva_kuviointi && n[0] < A.P_vaskipaisunta - 0.3 && n[2] >= 62 && n[1] < 1.6;
    if (!(O || H)) return;
    const h1 = fract(n[0] * 7.13 + n[2] * 0.37), h2 = fract(n[0] * 3.71 + n[2] * 0.19), h3 = fract(n[0] * 11.3 + n[2] * 0.53);
    const side = (h1 < 0.5 ? -1 : 1) * (3.0 + h3 * 24);
    noteDots.push({ t: n[0], dur: n[1], x0: side, Sabs: S(n[0]) + 16 + 90 * h2, y: 2.0 + Math.max(0, n[2] - 60) * 0.26 + 5 * fract(h1 * 9.7), O });
  });
  const KIPINOITA = noteDots.length;

  // ---------- tila hetkellä t ----------
  function tila(t) {
    const tt = clamp(t, t0, t1);
    const camS = S(tt);
    const n = clamp((lvl(tt, 1.0) - 0.05) / 0.50, 0, 1);
    const secGain = lerp(0.55, 1, sstep(tAskEnd - 1, tAskEnd + 2, tt));
    let glow = (0.04 + 0.96 * Math.pow(n, 1.5)) * secGain * sstep(0, 4, tt - t0) * (1 - sstep(t1 - 3.0, t1 - 0.3, tt));
    // paisuva sointu: kajo hengittää
    let bump = 0; for (const e of PAISU) { const k = (tt - e.alku) / Math.max(0.5, (e.loppu ?? e.alku) - e.alku); if (k > 0 && k < 1) bump += 0.55 * Math.sin(Math.PI * k); }
    glow = clamp(glow * (1 + bump), 0, 1.4);
    glow = Math.max(glow, 0.24 * sstep(A.dim_possibile, A.dim_possibile + 3, tt) * (1 - sstep(t1 - 3.0, t1 - 0.3, tt)));   // viimeinen kajo: yhdeksäs kumpu piirtyy sitä vasten
    // nousu ja lasku: kajon korkeus
    let lift = 0; for (const e of NOUSUT) { const k = (tt - e.alku) / Math.max(0.5, (e.loppu ?? e.alku) - e.alku); if (k > 0 && k < 1) lift += (e.tyyppi === 'nousu' ? 1 : -1) * Math.sin(Math.PI * k) * (0.25 + 0.75 * clamp((e.voima || 0) / 12, 0, 1)) * 0.045; }
    // pystyvalo: vain nimetyt iskut
    let cx = 0, cy = 0;
    for (const e of ISKUT) { const ti = tt - e.t; if (ti < 0) continue;
      cx = Math.max(cx, 2.4 * (1 - Math.exp(-ti / 0.05)) * Math.exp(-ti / 0.45));
      cy = Math.max(cy, 0.9 * (1 - Math.exp(-ti / 0.5)) * Math.exp(-ti / 4.0)); }
    // jousten hermo: tremolo ja jännitejakso, väre paikallaan
    const trem = d.ka(sTrem, tt * FPS, 0.6 * FPS);
    const nerve = ikkuna(tt, A.jannitejakso_alku, A.jannitejakso_loppu, 1.5) * (0.35 + 0.65 * clamp((d.keski(tt, 0.6) - 0.45) / 0.45, 0, 1));
    const wind = clamp(0.22 + 0.55 * n + 1.1 * cy + 0.5 * cx * 0, 0, 1.6);
    const shake = clamp(Math.max(0.9 * trem, nerve), 0, 1);
    // kaksi valon paikkaa: käyrätorvet (matala rekisteri) ja vastakohta (trumpetit, tulkinta)
    const w2 = ikkuna(tt, A.allegro_moderato_O_alku, A.allegro_moderato_O_loppu, 0.8);
    const horn = sstep(0.30, 0.80, d.ka(sHorn, tt * FPS, 0.4 * FPS));
    const two = [w2 * horn, w2 * (1 - horn) * 0.9];
    // maa: pohja katoaa -> maa ja juuret katoavat alta
    let pohja = 1; for (const e of POHJA_POIS) pohja = Math.min(pohja, 1 - ikkuna(tt, e.alku, e.loppu ?? e.alku, 1.2));
    // maan valo: renkaat
    const pu = PULSSIT.filter((x) => x.t <= tt && tt - x.t < 4).slice(-6).map((x) => [tt - x.t, x.v, S(x.t) - camS, 0]);
    // väike
    const dots = [];
    for (const k of noteDots) { const ika = tt - k.t; if (ika < -0.05 || ika > k.dur + 0.85) continue;
      const z = k.Sabs - camS; if (z < 4) continue;
      const v = (k.O ? 0.75 : 1.0) * 0.95 * Math.pow(Math.sin(Math.PI * clamp((ika + 0.05) / (k.dur + 0.9), 0, 1)), 1.5);
      dots.push([k.x0, z, v * (1 - 0.6 * pohja * 0), k.y]); }
    // horisontin muoto: melodian kaari hitaasti, vasen reuna on vanhempaa
    const prof = []; for (let i = 0; i < 16; i++) { const ti = tt - (15 - i) * 0.8; const m = d.melodia(Math.max(ti, t0), 2.5); prof.push(clamp((m - 72) * 0.0035, -0.03, 0.05)); }
    const s = clamp((tt - (t1 - 1.5)) / 1.5, 0, 1);
    return { t: tt, camS, camX: xPath(camS), v: vauhti(tt), wind, glow, lift, cut: [cx, cy], shake, two, pohja, pu, dots: dots.slice(0, 24), prof,
      end: smooth(s), start: 1 - sstep(0, 0.9, tt - t0), rate: rate(tt) };
  }

  const { gl, U, piirra } = luoGL(FS);
  const doorX = (s) => doorS.map((x) => xPath(x) - xPath(s));
  julkaise({
    gl, aika: A,
    kamera: (t) => { const s = tila(t); return { p: [s.camX, 1.7, s.camS], q: [0, 0, 0, 1], shot: 'matka', cut: 0, trans: false }; },
    kuvaus: (t) => { const s = tila(t);
      const dz = doorS.map((x) => +(x - s.camS).toFixed(1)).filter((x) => x > 0);
      return { vauhti_m_s: +s.v.toFixed(2), liike_per_s: +s.rate.toFixed(1), matka_m: +s.camS.toFixed(1), kajo: +s.glow.toFixed(2), pystyvalo: s.cut.map((x) => +x.toFixed(2)),
        vare: +s.shake.toFixed(2), tuuli: +s.wind.toFixed(2), kaksi: s.two.map((x) => +x.toFixed(2)), maa: +s.pohja.toFixed(2), renkaita: s.pu.length, pilkkuja: s.dots.length, nostoa: +s.lift.toFixed(3),
        seuraava_ovi_m: dz[0] ?? null, ovia_edessa: dz.length, kipinoita_yht: KIPINOITA }; },
    seek: (t) => {
      const s = tila(t);
      gl.uniform1f(U('uTime'), s.t); gl.uniform1f(U('uCamS'), s.camS); gl.uniform1f(U('uCamX'), s.camX);
      gl.uniform1f(U('uWind'), s.wind); gl.uniform1f(U('uGlow'), s.glow); gl.uniform1f(U('uShake'), s.shake); gl.uniform1f(U('uEnd'), s.end); gl.uniform1f(U('uStart'), s.start);
      gl.uniform1f(U('uThin0'), thin0); gl.uniform1f(U('uThin1'), thin1); gl.uniform1f(U('uFogL'), 85);
      gl.uniform1f(U('uGround'), s.pohja); gl.uniform1f(U('uLift'), s.lift);
      gl.uniform2f(U('uCut'), s.cut[0], s.cut[1]); gl.uniform2f(U('uTwo'), s.two[0], s.two[1]);
      const pu = new Float32Array(24); s.pu.forEach((x, i) => pu.set(x, i * 4)); gl.uniform4fv(U('uPulse'), pu);
      const dt = new Float32Array(96); s.dots.forEach((x, i) => dt.set(x, i * 4)); gl.uniform4fv(U('uDot'), dt); gl.uniform1i(U('uNDot'), s.dots.length);
      gl.uniform1fv(U('uDoorZ'), new Float32Array(doorS.map((x) => x - s.camS)));
      gl.uniform1fv(U('uDoorX'), new Float32Array(doorS.map((x) => xPath(x) - s.camX)));
      gl.uniform4fv(U('uDoorP'), new Float32Array(doorP.flat()));
      gl.uniform1fv(U('uProf'), new Float32Array(s.prof));
      piirra();
    },
  });
}
alusta().catch((e) => { console.error(e); window.sceneError = String(e.message || e); });
