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
uniform float uWind, uTime, uCamS, uCamX, uGlow, uShake, uEnd, uStart, uThin0, uThin1, uFogL, uGround, uLift, uSurge;
uniform float uNerve, uPh, uReach, uZl, uDense;
uniform vec2 uObo[4];     // oboet: ohut valojuova (sivuasema, voima)
uniform vec3 uKla[3];     // klarinetit: puoliksi näkyvä liike (sivuasema, korkeus, voima)
uniform vec3 uSnow;       // lumi: pudotus (kertymä), ajautuma (kertymä), määrä
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

// tuulen taipuma: puu on jäykkä, tyvi paikallaan; taipuma sivulle kasvaa neliöllisesti korkeuden mukana (latva enintään ~3,7 % korkeudesta),
// vaihe kulkee metsän yli (syvyys + sivu), ei puukohtaista satunnaisvaihetta. Päätaajuus 0,12 Hz, toinen yläsävel 0,27 Hz. Kaukana (yli 80 m) vaimenee nollaan.
float sway(float yw, float H, float S, float xt, float z) {
  float ph = S * 0.045 + xt * 0.021 - uTime * 0.75;
  return uWind * 0.030 * yw * yw / H * (sin(ph) + 0.30 * sin(ph * 2.3 + 1.0)) * (1.0 - smoothstep(80.0, 150.0, z));
}

// lumi: kolme syvyyttä, pudotus ja ajautuma ovat äänestä laskettuja kertymiä (ei ajastimia)
vec3 snowAt(vec2 p) {
  vec3 s = vec3(0.0);
  for (int L = 0; L < 3; L++) {
    float fl = float(L);
    float sc = L == 0 ? 11.0 : (L == 1 ? 21.0 : 38.0);
    float spd = 1.0 - 0.32 * fl;
    vec2 q = vec2(p.x - uSnow.y * spd + 0.01 * sin(uTime * 0.6 + fl * 2.0), p.y + uSnow.x * spd);
    vec2 g = q * sc, id = floor(g), f = fract(g) - 0.5;
    float h = hash(id + fl * 37.1);
    if (h > 0.30) continue;
    vec2 off = (vec2(hash(id + 3.7 + fl), hash(id + 8.1 + fl)) - 0.5) * 0.50;
    off.x += 0.12 * sin(uTime * 1.1 + h * 60.0);
    float r = 0.075 + 0.05 * hash(id + 5.5);
    float dd = length(f - off) / r;
    s += HALLA * exp(-dd * dd * 1.7) * (L == 0 ? 0.055 : (L == 1 ? 0.040 : 0.028)) * (0.4 + 0.6 * hash(id + 1.9));
  }
  return s * uSnow.z;
}

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
  vec2 q = vec2(dx / (0.60 * asp * (1.0 + 1.2 * uReach)), gy / (0.40 * (1.0 + 0.8 * uReach)));
  float g = exp(-dot(q, q) * 1.5);
  float ang = atan(dy, dx);
  float rr0 = length(vec2(dx, dy));
  float ray = 1.0 + 0.45 * (vnoise(vec2(ang * 3.2 + 3.0, uCamS * 0.010)) - 0.5) * smoothstep(0.03, 0.30, rr0);
  float drift = 0.80 + 0.40 * vnoise(vec2(dx * 2.6 + uTime * 0.012, dy * 4.0 - uTime * 0.008));
  // jousten hermo ja tremolo: väre on valossa ja usvassa (kulkeva himmeä aalto), ei rungon muodossa
  float shim = 1.0 + uShake * (0.95 * (vnoise(vec2(dx * 4.0 + uTime * 0.7, dy * 3.0 - uTime * 0.5)) * 2.0 - 1.0) * sin(uTime * 17.0 + dx * 9.0 + dy * 5.0) + 0.28 * sin(uTime * 11.0 + dx * 2.0));
  float shN = vnoise(vec2(dx * 9.0 + uPh * 0.30, dy * 7.0 - uPh * 0.20)) * 2.0 - 1.0;
  shim += uNerve * (0.95 * shN * sin(uPh + dx * 14.0 + dy * 9.0) + 0.40 * sin(uPh * 0.63 + dx * 3.0));   // jousten hermo: nopea hienojakoinen väre valossa ja usvassa
  shim = max(shim, 0.15);
  vec3 c = SALO * (0.075 + 0.05 * drift) * shim * (1.0 - 0.25 * uNerve);
  c += HALLA * 0.13 * uGlow * g * ray * drift * shim;
  // äkillinen dynamiikan nousu: kajo välähtää ja usva kirkastuu (ei pystyleikkausta)
  c += HALLA * uSurge * (0.10 * g * ray + 0.012 * drift);
  // pystyvalo (nimetyt iskut): kapea kolonni keskellä, kerrosten läpi
  float w = 0.012 + 0.006 * vnoise(vec2(dy * 12.0, 1.0));
  float cd = abs(dx - 0.012 * (vnoise(vec2(dy * 5.0, 7.0)) - 0.5));
  float col1 = 0.65 * exp(-cd * cd / (w * w)) + 0.45 * exp(-cd / 0.05);
  c += LEIKKAUS * uCut.x * (col1 * 0.8 + 0.07 * g * ray) * smoothstep(-0.45, 0.10, dy + 0.35);
  c += HALLA * uCut.y * (0.9 * g * ray + 0.25 * exp(-cd / 0.30)) * 0.16;
  // kaksi valon paikkaa pimeässä
  vec2 a1 = vec2(dx + 0.62, gy), a2 = vec2(dx - 0.62, gy);
  // keilat runkojen takaa: pystysuora pehmeä keila horisontista ylös usvassa (rungot peittävät sen), ei irrallista palloa
  float bm1 = exp(-a1.x * a1.x / 0.0040) * exp(-max(gy, 0.0) / 0.34) * smoothstep(-0.10, 0.03, gy) + 0.45 * exp(-(a1.x * a1.x / 0.014 + a1.y * a1.y / 0.0030));
  float bm2 = exp(-a2.x * a2.x / 0.0034) * exp(-max(gy, 0.0) / 0.30) * smoothstep(-0.10, 0.03, gy) + 0.45 * exp(-(a2.x * a2.x / 0.012 + a2.y * a2.y / 0.0026));
  c += HALLA * uTwo.x * 0.34 * bm1;
  c += HOPEA * uTwo.y * 0.34 * bm2;
  // kirjain O: oboet = ohut valojuova kaukana runkojen välissä, klarinetit = puoliksi näkyvä liike keskellä
  for (int i = 0; i < 4; i++) { vec2 o = uObo[i]; if (o.y > 0.0) { float lx = dx - o.x; c += HOPEA * o.y * 0.26 * exp(-lx * lx / 0.00008) * smoothstep(-0.02, 0.04, dy) * exp(-max(dy, 0.0) / 0.16); } }
  for (int i = 0; i < 3; i++) { vec3 k = uKla[i]; if (k.z > 0.0) { vec2 kk = vec2(dx - k.x, dy - k.y); c += HALLA * k.z * 0.10 * exp(-(kk.x * kk.x / 0.020 + kk.y * kk.y / 0.0035)); } }
  return c;
}

// rungon säde: ei laattoja (enintään ~0,9 m, harvoin paksumpi); leveä tyvi tulee juurenniskasta
float trunkR(float c, float n) {
  float r = 0.17 + 0.46 * pow(hash(vec2(c * 2.9 + 4.0, n * 0.53 + 1.0)), 1.6);
  if (hash(vec2(c + 31.0, n * 2.3)) > 0.95) r *= 1.45;
  return r;
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
    float r = trunkR(c, n);
    if (abs(xt) < 2.6 + r) continue;
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
  g = mix(fog, g, uGround);
  return mix(g, fog * (1.0 - 0.45 * clamp(uCut.x * 0.4 + uCut.y, 0.0, 1.0)), 1.0 - exp(-zg / uFogL));
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
  if (P.x > 0.0) { len = length(vec2(u / P.x, yw / P.y)); hole = (1.0 - smoothstep(0.80, 1.0, len)) * smoothstep(-0.35, 0.25, yw); }
  float a = body * (1.0 - hole) * (0.88 - 0.25 * smoothstep(0.6, 0.0, abs(u) / P.w));   // kumpu ei ole umpiseinä: metsä kuultaa reunoilla, tyvi sulaa pehmeästi
  if (a <= 0.0) return vec4(0.0);
  float f = (1.0 - exp(-zd / uFogL)) * (P.x > 0.0 ? 1.0 : 0.25);     // yhdeksäs kumpu erottuu tummana kajoa vasten
  float tex = vnoise(vec2(u * 0.55, yw * 0.22 + fi * 3.0));
  float stripes = smoothstep(0.55, 0.85, vnoise(vec2(u * 2.6 + fi * 5.0, yw * 0.12)));
  float crownN = vnoise(vec2(u * 0.9 + fi * 2.0, yw * 0.5));
  vec3 dark = mix(TRUNK, HAMY, 0.25) * (0.6 + 0.9 * tex) * (1.0 - 0.45 * stripes) * (0.55 + 0.9 * crownN);
  vec3 lit = HALLA * 0.16 * ring * exp(-max(yw, 0.0) / 5.0) * (0.35 + 0.65 * stripes) * (0.6 + 0.4 * tex);
  float rimB = smoothstep(0.72, 0.97, len) * (1.0 - smoothstep(0.97, 1.0, len));
  vec3 tone = mix(dark + lit, fog, f) + fog * 0.10 * rimB * (1.0 - 0.5 * f);
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
  float dens = mix(0.60 * (1.0 - 0.86 * smoothstep(uThin0, uThin1, S)), 0.97, uDense);   // lopun tihentyminen: samat rungot tiheämmin
  float f = 1.0 - exp(-z / uFogL);
  float fade = smoothstep(ZMAX, ZMAX * 0.72, z);
  float cover = 0.0, uu = 0.0, idd = 0.0, xcs = 0.0, crownCv = 0.0;
  float c0 = floor(rel / CW);
  for (int j = -1; j <= 1; j++) {
    float c = c0 + float(j);
    if (hash(vec2(c * 1.13 + 0.5, n * 0.731 + 2.1)) > dens) continue;
    float xt = (c + 0.12 + 0.76 * hash(vec2(c * 0.37 + 9.0, n * 1.19))) * CW;
    float rr = trunkR(c, n);
    if (abs(xt) < 2.6 + rr) continue;
    float H = 15.0 + 11.0 * hash(vec2(c * 0.61 + 2.0, n + 7.0));
    if (yw > 0.4 * H && yw < H + 0.8) {
      float swc = sway(yw, H, S, xt, z);
      float wm = (1.6 + 2.6 * hash(vec2(c + 8.0, n))) * clamp((H - yw) / (0.6 * H), 0.0, 1.0);
      wm *= (0.72 + 0.5 * vnoise(vec2(yw * 1.3 + c, n * 3.0))) * (0.85 + 0.2 * sin(yw * 2.6 + c));
      crownCv = max(crownCv, smoothstep(wm, wm * 0.7, abs(rel - xt - swc)));
    }
    if (yw > H) continue;
    float lean = (hash(vec2(c + 3.0, n * 0.41)) - 0.5) * 0.03;
    // tuuli: aalto kulkee metsän läpi, latva taipuu ja palaa; tyvi on paikallaan; rungon muoto ei riipu ajasta eikä äänestä
    float xc = xt + lean * yw + 0.05 * sin(yw * 0.55 + c) + sway(yw, H, S, xt, z);
    float re = rr * (1.0 + 0.38 * exp(-yw * 1.6) + 0.35 * exp(-yw * 6.0)) * (1.0 - 0.3 * yw / H);   // juurenniska
    // reuna: pehmennys vähintään 0,8 kuvapistettä, jottei ohut kaukainen runko välky
    float ee = max(re * 0.06, 0.8 * z / (F * uRes.y));
    float cv = (1.0 - smoothstep(re - ee, re + ee, abs(rel - xc))) * min(1.0, re / (ee * 1.2));
    if (cv > cover) { cover = cv; uu = (rel - xc) / re; idd = c + n * 13.0; xcs = xc; }
  }
  // latvusto: päältä tiheä, oksien välissä aukkoja, joista valo siivilöityy
  float cb = 8.0 + 4.0 * hash(vec2(n, 9.1));
  if (yw > cb - 3.0) {
    float csw = sway(yw, 20.0, S, rel, z);
    float g = vnoise(vec2((rel - csw) * 0.38 + n * 5.3, yw * 0.42)), g2 = vnoise(vec2((rel - csw) * 1.6 + n * 2.1, yw * 1.5 + 4.0));
    float rise = smoothstep(cb - 2.0, cb + 4.0, yw + 3.0 * (g - 0.5));
    float ca = rise * smoothstep(0.26, 0.58, 0.7 * g + 0.4 * g2 + 0.35 * rise) * 0.90;
    vec3 ct = mix(HAMY * (0.7 + 0.5 * g2), fog, f * 0.9);
    crown = vec4(ct, ca * fade);
  }
  if (crownCv > 0.0) { vec3 ct2 = mix(HAMY * 0.8, fog, f * 0.9); crown = vec4(ct2, max(crown.a, crownCv * 0.92 * fade)); }
  if (cover <= 0.0) return vec4(0.0);
  float bark = 0.75 + 0.5 * vnoise(vec2(yw * 1.3, idd));
  float streak = vnoise(vec2(uu * 7.0 + idd, yw * 0.35));
  float ridge = vnoise(vec2(uu * 16.0 + idd * 3.0, yw * 0.15));
  vec3 dark = TRUNK * bark * (0.8 + 0.4 * streak) * (1.0 + (ridge - 0.5) * 1.0 * (1.0 - f));   // kaarnan pystysuuntainen pinta, sidottu runkoon
  float shade = sqrt(max(1.0 - uu * uu, 0.0));
  float sgn = xcs < 0.0 ? 1.0 : -1.0, sgn0 = sgn;
  vec3 lit = HALLA * 0.26 * ring * shade * shade * exp(-yw / 2.6) * (0.5 + 0.7 * bark) * (0.75 + 0.5 * smoothstep(-1.0, 1.0, uu * -sgn0));
  float front = max(smoothstep(uZl - 12.0, uZl + 25.0, z), clamp(uCut.x, 0.0, 1.0));   // paisutuksen valo tulee kerros kerrokselta lähemmäs
  float rimK = 0.10 * uGlow + (0.55 * uCut.y + 1.30 * uCut.x) * front;
  vec3 rim = LEIKKAUS * rimK * 0.5 * smoothstep(0.55, 0.98, uu * sgn) * exp(-z / 25.0) * (1.0 - f) * smoothstep(0.0, 1.5, yw);
  vec3 tone = mix(dark + lit + rim, fog * (1.0 - 0.55 * clamp(uCut.x * 0.4 + uCut.y, 0.0, 1.0)), f);   // iskussa rungot pysyvät siluetteina
  float snowK = smoothstep(0.9, 0.0, yw) * 0.92;   // lumikinos tyvellä: runko uppoaa lumeen ilman leikkausviivaa
  tone = mix(tone, mix(vec3(0.0075, 0.0115, 0.0200) * 0.9 + HALLA * 0.02 * uGlow * exp(-z / 130.0), fog, f), snowK);
  float al = cover * fade;
  al *= 1.0 - (1.0 - uGround) * max(smoothstep(mix(1.2, 5.0, smoothstep(10.0, 40.0, z)), 0.0, yw), smoothstep(0.02, -0.16, dy) * smoothstep(12.0, 45.0, z));           // pohja katoaa: metsä leijuu, tyvet sulavat pehmeästi (ei vaakaviivaa)
  return vec4(tone, al);
}

vec3 dotsBetween(vec3 col, float zn, float zf, float dx, float dy) {
  for (int i = 0; i < 24; i++) {
    if (i >= uNDot) break;
    vec4 dd = uDot[i];
    if (dd.y > zn && dd.y <= zf) {
      vec2 d = (vec2(dx, dy) - vec2(dd.x * F / dd.y, (dd.w - CAMH) * F / dd.y)) / (0.0020 + 0.10 / dd.y);
      col += HOPEA * dd.z * (3.2 * exp(-dot(d, d)) + 0.22 * exp(-dot(d, d) * 0.10)) * exp(-dd.y / (uFogL * 1.4));   // väike: ydin + pehmeä kehä, erottuu lumesta kirkkaudella ja kehällä
    }
  }
  return col;
}

vec3 scene(vec2 p) {
  float asp = uRes.x / uRes.y;
  float dx = p.x - asp * 0.5, dy = p.y - HOR;
  vec3 fog = fogAt(dx, dy, asp) * (1.0 - 0.50 * uDense);   // usva tummuu runkojen välissä
  float n0 = floor(uCamS / DZ);
  vec3 col;
  if (dy >= 0.0) {
    // kaukainen horisontti: sileät kummut kajoa vasten
    float u = clamp(p.x / asp, 0.0, 1.0) * 15.0; int i = int(floor(u)); float fr = fract(u);
    float pr = mix(uProf[i], uProf[min(i + 1, 15)], fr * fr * (3.0 - 2.0 * fr)) * 0.6;
    float hl = 0.030 + 0.030 * smoothstep(0.0, 1.0, vnoise(vec2(p.x * 0.7, 3.0))) + pr;
    float above = dy - hl;
    col = fog * (1.0 - 0.45 * clamp(uCut.x * 0.4 + uCut.y, 0.0, 1.0)) * (1.0 - 0.35 * smoothstep(0.0, 0.7, dy));   // sama sävy kuin maan etäisin osa: ei kovaa horisonttiviivaa
    col += HALLA * 0.22 * uGlow * exp(-max(above, 0.0) / 0.030) * smoothstep(-0.004, 0.004, above);
    float hillM = smoothstep(0.004, -0.004, above);
    col = mix(col, HAMY * 1.2 + fog * 0.16, hillM);
  } else {
    col = groundAt(dx, dy, fog, n0);
  }
  float zPrev = 1e9;
  bool hazed = false;
  for (int k = NS - 1; k >= 0; k--) {
    float n = n0 + float(k), S = sliceS(n), z = S - uCamS;
    if (z < 0.5 || z > ZMAX) continue;
    // pohja katoaa: usvapankki, johon kaukaisten runkojen tyvet sulavat (ei vaakaviivaa horisontissa); lähirungot jäävät sen eteen
    if (!hazed && z < 16.0) { hazed = true; col = mix(col, fog * (1.0 - 0.45 * clamp(uCut.x * 0.4 + uCut.y, 0.0, 1.0)), (1.0 - uGround) * 0.80 * smoothstep(0.17, -0.03, dy)); }
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
  if (!hazed) col = mix(col, fog * (1.0 - 0.45 * clamp(uCut.x * 0.4 + uCut.y, 0.0, 1.0)), (1.0 - uGround) * 0.80 * smoothstep(0.17, -0.03, dy));
  col += snowAt(p) * (1.0 - uEnd) * (1.0 - uStart);
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
  // kulkijan ja hitaan ajon vauhti: 1,3 -> 2,4 m/s (lähin runko ohittaa katsojan sekunneissa, ei ruuduissa; enintään ~2 % kuvan leveydestä ruudussa)
  const vauhti = (t) => (t < t0 ? 0 : (1.3 + 1.1 * mot(t)) * sstep(0, 7, t - t0));
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
  // äkillinen dynamiikan nousu (vähintään 8 dB alle 0,3 s): kajo ja usva välähtävät samassa ruudussa; lumi saa puuskan
  const sLvl3 = new Float32Array(NF); for (let f = 0; f < NF; f++) sLvl3[f] = d.ka(sLvl, f, 2);
  const dB = (f) => 20 * Math.log10(sLvl3[Math.max(0, Math.min(NF - 1, f))] + 1e-4);
  const SURGE = [];
  { let viime = -999; for (let f = Math.floor(t0 * FPS) + 12; f < Math.ceil(t1 * FPS); f++) {
      if (dB(f) - dB(f - 9) >= 8 && sLvl3[f] > 0.02 && f - viime > 45) { SURGE.push(f - 7); viime = f; } } }
  const POHJA_POIS = tev('kerros katoaa', 'pohja');
  const PAISU = tev('paisuva sointu');
  const NOUSUT = [...tev('nousu'), ...tev('lasku')];

  // ---------- ovet: ylitetään rakennekohdissa (ankkurit) ----------
  const tc = [t0 + 8.0, A.jannitejakso_alku, A.O_kirjain, A.jannitejakso_loppu, A.allegro_moderato_O_loppu, A.harva_kuviointi, tPend, A.dim_possibile];
  const doorS = tc.map(S); doorS.push(-1e4);                // yhdeksäs: umpinainen kumpu, jonka kohdalle saavutaan jakson lopussa
  const doorP = [[1.0, 2.4, 14, 36], [2.8, 5.2, 19, 52], [3.2, 6.0, 23, 66], [2.6, 4.9, 16, 48], [3.4, 6.4, 21, 60], [2.9, 5.4, 24, 72], [3.3, 6.1, 18, 54], [2.7, 5.0, 22, 64], [0, 1, 11, 34]];
  const thin0 = 1e9, thin1 = 1e9 + 1;   // runkotiheys ei ohene: metsä pysyy metsänä loppuun

  // ---------- valon tapahtumat ----------
  const alueella = (x) => x.t >= t0 - 0.01 && x.t <= t1;
  const ISKUT = d.iskut.filter(alueella);
  // raskaat askeleet: matalan ais:n (midi 34) tason nousut. Alku = taso nousee vähintään 0,05 edellisten 12 ruudun minimistä ja nousu on jyrkkenevä (väh. 14 ruutua välein).
  // Kynnys 0,05 antaa 19 sykettä 0-19,2 s (oppaan 18); rytmiä ei keksitä: ajat ovat mitattuja.
  const ASKELEET = [];
  { const f0 = Math.floor(t0 * FPS), f1 = Math.ceil(A.jannitejakso_alku * FPS); const T = []; for (let f = f0 - 20; f < f1 + 20; f++) T.push(d.taso(34, f)); const g = (f) => T[f - f0 + 20]; let viime = -99;
    for (let f = f0; f < f1; f++) { let lo = 9; for (let k = 1; k <= 12; k++) lo = Math.min(lo, g(f - k)); const up = g(f) - lo, sl = g(f) - g(f - 2);
      if (up >= 0.05 && sl > 0.008 && g(f - 1) - g(f - 3) <= sl + 1e-6 && f - viime >= 14) { ASKELEET.push({ t: f / FPS, v: clamp(0.6 + 2.0 * up, 0.6, 1) }); viime = f; } } }
  const PULSSIT = [
    ...ASKELEET.map((x) => ({ t: x.t, v: 0.95 * x.v })),                                                  // raskaat askeleet: mitatut ais-sykkeet
    ...d.alut.filter((x) => alueella(x) && x.t >= A.jannitejakso_alku).map((x) => ({ t: x.t, v: 0.35 * x.v })),
    ...d.aksentit.filter(alueella).map((x) => ({ t: x.t, v: 0.50 * x.v })),
  ].sort((a, b) => a.t - b.t);
  const noteDots = [];    // väike: puupuhaltimien jaksossa (O -> jännitteen loppu) ja harvassa kuvioinnissa
  d.nuotit.forEach((n, idx) => {
    const O = n[0] >= A.O_kirjain && n[0] < A.jannitejakso_loppu && n[2] >= 70 && n[1] >= 0.18 && n[1] < 1.2;
    const H = n[0] >= A.harva_kuviointi && n[0] < A.P_vaskipaisunta - 0.3 && n[2] >= 62 && n[1] < 1.6;
    if (!(O || H)) return;
    const h1 = fract(n[0] * 7.13 + n[2] * 0.37), h2 = fract(n[0] * 3.71 + n[2] * 0.19), h3 = fract(n[0] * 11.3 + n[2] * 0.53);
    const side = (h1 < 0.5 ? -1 : 1) * (3.0 + h3 * 24);
    noteDots.push({ t: n[0], dur: n[1], x0: side, Sabs: S(n[0]) + 34 + 80 * h2, y: 1.6 + clamp(n[2] - 60, 0, 30) * 0.12 + 1.2 * fract(h1 * 9.7), O });   // korkeus 1,6-6,4 m: pysyy runkojen välissä, latvusten alla (korkeammat jäisivät nähtävien latvustojen taakse)
  });
  const KIPINOITA = noteDots.length;
  const OBOE = d.nuotit.filter((n) => n[0] >= A.O_kirjain - 0.05 && n[0] < A.jannitejakso_loppu && n[2] >= 70 && n[1] >= 0.10);
  const KLAR = d.nuotit.filter((n) => n[0] >= A.O_kirjain - 0.05 && n[0] < A.jannitejakso_loppu && n[2] >= 56 && n[2] < 70 && n[1] >= 0.15);

  // lumi: pudotus ja ajautuma ovat kertymiä (nopeuden integraali), nopeus tulee 1,5 s tasoitetusta tasosta ja äkillisistä nousuista
  const surgeAt = (t) => { let v = 0; for (const f of SURGE) { const ti = t - f / FPS; if (ti < 0) continue; v = Math.max(v, (1 - Math.exp(-ti / 0.12)) * Math.exp(-ti / 1.6)); } return v; };
  const nerveAt = (t) => ikkuna(t, A.jannitejakso_alku, A.jannitejakso_loppu, 0.1) * (0.55 + 0.45 * clamp((d.keski(t, 0.6) - 0.45) / 0.45, 0, 1));
  const gustAt = (t) => 0.5 + 0.5 * Math.sin(1.7 * t);
  // hermon vaihe on kertymä: taajuus nousee liiketiheyden mukana (ei parametri x aika)
  const sPh = d.sarja((f) => 2 * Math.PI * (1.6 + 0.10 * Math.min(rate(f / FPS), 30)) / FPS);
  // kirjain P: paisutuksen taso (vasket ja patarummut) normalisoituna ankkurista huippuun
  const tPs = A.P_vaskipaisunta, pkBase = lvl(tPs - 0.5, 1.2);
  let pkMax = 0, pkT = tPs; for (let t = tPs; t < tPend + 3; t += 0.1) { const v = lvl(t, 1.2); if (v > pkMax) { pkMax = v; pkT = t; } }
  const pkAt = (t) => (t < tPs ? 0 : clamp((lvl(t, 1.2) - pkBase) / (pkMax - pkBase + 1e-6), 0, 1) * sstep(tPs, tPs + 0.4, t) * (1 - sstep(tPend + 2, tPend + 6, t)));
  const nLvl = (t) => clamp((lvl(t, 1.5) - 0.05) / 0.50, 0, 1);
  const sFall = d.sarja((f) => (0.045 + 0.10 * nLvl(f / FPS) + 0.22 * surgeAt(f / FPS) + 0.14 * nerveAt(f / FPS) * gustAt(f / FPS)) / FPS);
  const sDrift = d.sarja((f) => (0.012 + 0.030 * nLvl(f / FPS) + 0.10 * surgeAt(f / FPS) + 0.20 * nerveAt(f / FPS) * Math.sin(1.7 * f / FPS)) / FPS);   // puuskissa suunta vaihtuu
  const ikkunaHarva = (t) => ikkuna(t, A.harva_kuviointi, tPend, 1.5);

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
    glow = Math.max(glow, 0.42 * sstep(A.dim_possibile, A.dim_possibile + 3, tt) * (1 - sstep(t1 - 3.0, t1 - 0.3, tt)));
    // harva kuviointi ja pohjaton ääni: kajo ei sammu, se hengittää hitaasti ja kohoaa liikkeen tiheyden mukana (13:20 kiihtyy)
    const harva = ikkunaHarva(tt);
    glow = Math.max(glow, harva * (0.50 + 0.25 * mot(tt) + 0.06 * Math.sin(tt * 0.9)));   // viimeinen kajo: yhdeksäs kumpu piirtyy sitä vasten
    // nousu ja lasku: kajon korkeus
    let lift = 0; for (const e of NOUSUT) { const k = (tt - e.alku) / Math.max(0.5, (e.loppu ?? e.alku) - e.alku); if (k > 0 && k < 1) lift += (e.tyyppi === 'nousu' ? 1 : -1) * Math.sin(Math.PI * k) * (0.25 + 0.75 * clamp((e.voima || 0) / 12, 0, 1)) * 0.28; }
    // kirjain O: vasket hiljaa alla matalana hehkuna (alkaa ankkurin ruudussa)
    glow = Math.max(glow, 0.26 * ikkuna(tt, A.O_kirjain, A.jannitejakso_loppu - 8, 0.15));
    // nousu ja lasku näkyvät kajon liikkeenä ja kirkkautena
    for (const e of NOUSUT) { const k = (tt - e.alku) / Math.max(0.5, (e.loppu ?? e.alku) - e.alku); if (k > 0 && k < 1) glow = Math.max(glow, 0.40 * Math.sin(Math.PI * k)); }
    // lopun tumma aalto: jouset sanovat vielä kerran, kajo hiipuu
    const lopAalto = ikkuna(tt, A.dim_possibile + 5, A.dim_possibile + 12, 1.5);
    glow = Math.max(glow, 0.42 * sstep(A.dim_possibile, A.dim_possibile + 3, tt) * (1 - sstep(t1 - 3.0, t1 - 0.3, tt)) * (1 + 0.35 * lopAalto));
    // kirjain P: paisutus on valo, joka kasvaa ja tulee lähemmäs koko paisutuksen ajan
    const pk = pkAt(tt);
    glow = Math.max(glow, 1.15 * pk);
    // pystyvalo: vain nimetyt iskut
    let cx = 0, cy = 0;
    for (const e of ISKUT) { const ti = tt - e.t; if (ti < 0) continue;
      cx = Math.max(cx, 2.4 * (1 - Math.exp(-ti / 0.05)) * Math.exp(-ti / 0.45));
      cy = Math.max(cy, 0.9 * (1 - Math.exp(-ti / 0.5)) * Math.exp(-ti / 4.0)); }
    cy = Math.max(cy, 0.9 * pk);
    // jousten hermo: tremolo ja jännitejakso, väre paikallaan
    const trem = d.ka(sTrem, tt * FPS, 0.6 * FPS);
    const nerve = nerveAt(tt);
    // tuuli: äänen verhokäyrä vähintään 1,5 s tasoitettuna; nimetyn iskun puuska nousee hitaasti (1,2 s)
    let cyW = 0; for (const e of ISKUT) { const ti = tt - e.t; if (ti < 0) continue; cyW = Math.max(cyW, 0.9 * (1 - Math.exp(-ti / 1.2)) * Math.exp(-ti / 4.5)); }
    const wind = clamp(0.22 + 0.45 * nLvl(tt) + 0.5 * cyW + 0.25 * nerve * gustAt(tt) + 0.2 * lopAalto, 0, 0.95);
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
      const z = k.Sabs - camS; if (z < 28) continue;
      const v = (k.O ? 0.9 : 1.0) * 0.95 * Math.pow(Math.sin(Math.PI * clamp((ika + 0.05) / (k.dur + 0.9), 0, 1)), 1.5);
      dots.push([k.x0, z, v * (1 - 0.6 * pohja * 0), k.y]); }
    const obo = []; for (const n of OBOE) { const ika = tt - n[0]; if (ika < 0 || ika > n[1] + 0.6) continue;
      obo.push([clamp((n[2] - 76) * 0.030, -0.5, 0.5), (1 - Math.exp(-ika / 0.05)) * Math.exp(-Math.max(0, ika - n[1]) / 0.25)]); }
    obo.sort((a, b) => b[1] - a[1]);
    const kla = []; for (const n of KLAR) { const ika = tt - n[0]; if (ika < 0 || ika > n[1] + 1.0) continue;
      kla.push([clamp((n[2] - 64) * 0.05, -0.5, 0.5) + 0.03 * Math.sin(tt * 0.8 + n[2]), 0.05 + 0.012 * (n[2] - 56), (1 - Math.exp(-ika / 0.12)) * Math.exp(-Math.max(0, ika - n[1]) / 0.45)]); }
    kla.sort((a, b) => b[2] - a[2]);
    // horisontin muoto: melodian kaari hitaasti, vasen reuna on vanhempaa
    const prof = []; for (let i = 0; i < 16; i++) { const ti = tt - (15 - i) * 0.8; const m = d.melodia(Math.max(ti, t0), 2.5); prof.push(clamp((m - 72) * 0.0035, -0.03, 0.05)); }
    const s = clamp((tt - (t1 - 1.5)) / 1.5, 0, 1);
    const surge = surgeAt(tt) * (1 - sstep(t1 - 3.0, t1 - 0.3, tt));
    const snow = [d.kohta(sFall, tt), d.kohta(sDrift, tt), (0.45 + 0.7 * Math.min(glow, 1) + 0.5 * surge) * (1 + 1.0 * nerve * gustAt(tt))];
    const dense = sstep(t1 - 11, t1 - 2.5, tt);
    return { surge, snow, nerve, ph: d.kohta(sPh, tt), pk, dense, obo: obo.slice(0, 4), kla: kla.slice(0, 3), t: tt, camS, camX: xPath(camS), v: vauhti(tt), wind, glow, lift, cut: [cx, cy], shake, two, pohja, pu, dots: dots.slice(0, 24), prof,
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
        vare: +s.shake.toFixed(2), tuuli: +s.wind.toFixed(2), kaksi: s.two.map((x) => +x.toFixed(2)), maa: +s.pohja.toFixed(2), renkaita: s.pu.length, pilkkuja: s.dots.length, nostoa: +s.lift.toFixed(3), puuska: +s.surge.toFixed(2), lumi_pudotus: +s.snow[0].toFixed(2), lumi_maara: +s.snow[2].toFixed(2), puuskia_yht: SURGE.length, hermo: +s.nerve.toFixed(2), paisutus: +s.pk.toFixed(2), oboeita: s.obo.length, klar: s.kla.length, tiheys: +s.dense.toFixed(2), askelia: ASKELEET.length, askel_ajat: ASKELEET.map((x) => +(x.t - t0).toFixed(2)), puuskat_s: SURGE.map((f) => +(f / FPS).toFixed(2)),
        seuraava_ovi_m: dz[0] ?? null, ovia_edessa: dz.length, kipinoita_yht: KIPINOITA }; },
    seek: (t) => {
      const s = tila(t);
      gl.uniform1f(U('uTime'), s.t); gl.uniform1f(U('uCamS'), s.camS); gl.uniform1f(U('uCamX'), s.camX);
      gl.uniform1f(U('uWind'), s.wind); gl.uniform1f(U('uGlow'), s.glow); gl.uniform1f(U('uShake'), s.shake); gl.uniform1f(U('uEnd'), s.end); gl.uniform1f(U('uStart'), s.start);
      gl.uniform1f(U('uThin0'), thin0); gl.uniform1f(U('uThin1'), thin1); gl.uniform1f(U('uFogL'), 85);
      gl.uniform1f(U('uGround'), s.pohja); gl.uniform1f(U('uLift'), s.lift);
      gl.uniform1f(U('uNerve'), s.nerve); gl.uniform1f(U('uPh'), s.ph); gl.uniform1f(U('uReach'), s.pk); gl.uniform1f(U('uZl'), lerp(170, 6, s.pk));
      gl.uniform1f(U('uDense'), s.dense);
      const ob = new Float32Array(8); s.obo.forEach((x, i) => ob.set(x, i * 2)); gl.uniform2fv(U('uObo'), ob);
      const kl = new Float32Array(9); s.kla.forEach((x, i) => kl.set(x, i * 3)); gl.uniform3fv(U('uKla'), kl);
      gl.uniform1f(U('uSurge'), s.surge); gl.uniform3f(U('uSnow'), s.snow[0], s.snow[1], s.snow[2]);
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
