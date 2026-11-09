// Tapiola: maailmat 7 (Ikisalo) ja 8 (Väärä valo), ankkurista jousijakso_urkupiste_E_alku ankkuriin M_raskaat_askeleet.
// Alkaa rajakuvalla PIMEYS (kahden rungon välinen pimeys) ja päättyy siihen (pimeys kasvaa kuin jättitammi, K2).
// Suunnitelma: docs/kuvakasikirjoitus.md "Kaksitoista maailmaa" 7 ja 8; säännöt: docs/visuaalinen_tyyli.md luvut 1, 2, 4d, 5, 7b, 12.
//
// Maailma: Tapion talo sisältä. Valtavat rungot pylväinä jättiläisen mittakaavassa, kaikki sinistä, usva kerroksina, hitainta.
// Pylväistä riippuu harmaata naavaa (halliparta, naavaturkki). Kaukana, kolmen ikihongan välissä, on vaakasuora valon lauta,
// Tapion pöytä (SKVR IX3 982): tämän maailman horisontti. Sen takana on loivien kumpujen reuna, ja lattia on lumen peittämä.
// Valo siivilöityy katon aukoista pylväiden väliin (referenssi 4), kylmänä. Kamera kulkee matalalla pylväiden ohi kohti pöytää.
// - Matalat jouset: massan tummuus ja usvan paksuus. Keskirekisteri: valokeilojen voima. Melodian kaari: keilojen hidas siirtymä.
// - Urkupiste ja matala taso: pöydän valo. patarumpu_ppp: maan valo värähtää. hitaat_soinnut: usvakerrokset (korkeus = sävelkorkeus).
// - h_palaa_ennen_hiljaisuutta: neljätoista sykettä kulkevat valona pöydän lautaa pitkin. hiljainen_jakso: pöytä sammuu, usva peittää.
// - Maailma 8: vaski_tutti_620 on pystysuora valo; C-duurin kolme välähdystä (mitattu sointuvärin osuudesta) nostavat punaisen
//   taotun auringon kumpujen takaa, ja se jää auringonsade-ankkurissa; kamera pysähtyy. Aurinko ei valaise pylväitä: vain usva punertuu.
// - M_ennakko: vaskien pystyvalo sulkee auringon, ja latvuston pimeys leviää taivaan yli, kunnes ruutu on rajakuva PIMEYS.
// Kohtaus on puhdas aikafunktio seek(t): kaikki kertymät lasketaan alussa ruuduittain, mikään ei muista edellistä ruutua.
import { lataa, luoGL, julkaise, FS_ALKU, GLSL_YHTEINEN, FS_LOPPU, RAJA, clamp, smooth, sstep } from './yhteinen.js';

const FS = FS_ALKU + `
uniform float uWind, uTime, uCamX, uCamZ, uHor, uOpen, uDark, uMass, uKes, uMel, uTable, uTrem, uVeil, uSunRise, uPairZ, uFogK, uSway;
uniform vec2 uSun;         // auringon paikka ruudulla suhteessa horisonttiin (dx, dy)
uniform vec2 uCut;         // vaskien pystyvalo: välähdys, jälkihohto
uniform vec4 uRodA, uRodB; // pystysuoran valon paikka maailmassa (x, z) ja voimakkuudet (välähdys, jälkihohto)
uniform vec4 uPulse[4];    // pöydän laudalla kulkevat sykkeet: paikka 0..1, voima
uniform float uBand[6];    // usvakerrokset (korkeus = sävelkorkeus)
` + GLSL_YHTEINEN + `
const float F = 1.07;
const float DZ = 9.0, CW = 24.0, ZMAX = 330.0, YCAN = 90.0;
const float XT = 0.0, ZT = 255.0, RT = 5.2, YP = 12.0, PLH = 31.0, ZPL = 250.2;
const float BH[6] = float[6](4.0, 10.0, 19.0, 31.0, 46.0, 64.0);
const vec3 PUNA = vec3(1.55, 0.17, 0.08);

float gh(float x, float z) {
  return 5.0 * (vnoise(vec2(x * 0.010 + 7.0, z * 0.0075 + 3.0)) - 0.5) + 1.2 * (vnoise(vec2(x * 0.030 + 1.0, z * 0.025)) - 0.5);
}
float holeF(float xc, float z) { return vnoise(vec2(xc * 0.040, z * 0.028 + 1.3)) * 0.75 + vnoise(vec2(xc * 0.13, z * 0.09)) * 0.25; }
// valokeilat: katon aukoista alas viistosti; voimakkaimmat ylhäällä
float shaftAt(vec3 w) {
  float xc = w.x + 0.33 * (YCAN - w.y) + uMel;
  return smoothstep(0.58, 0.78, holeF(xc, w.z)) * mix(1.0, 0.30, clamp((YCAN - w.y) / YCAN, 0.0, 1.0));
}

// pylvään määrittely: (x, z, säde, olemassa)
vec4 pillarDef(float n, float i) {
  float h0 = hash(vec2(n * 1.37 + 5.1, i * 2.71 + 1.3));
  float h1 = hash(vec2(i * 3.31 - n * 0.57, n * 4.17 + 7.7));
  float h2 = hash(vec2(n * 6.13 + i * 1.77, i * 5.41 - 2.9));
  float h3 = hash(vec2(i * 7.7 + n * 2.13, n * 3.9 + 4.4));
  float cx = (i + 0.10 + 0.80 * h1) * CW;
  float cz = (n + 0.5 + (h2 - 0.5) * 0.9) * DZ;
  float r = 2.2 + 2.5 * h3 * h3 + (h3 > 0.94 ? 1.6 : 0.0);
  float W = 7.5 + 6.0 * vnoise(vec2(cz * 0.021, 4.0)) + 38.0 * clamp(cz / ZT, 0.0, 1.0);   // sali aukeaa kohti pöytää
  bool ok = h0 < 0.60 && abs(cx) > W + r;
  if (abs(cx) < 62.0 && cz > ZT - 6.0) ok = false;            // pöydän takana ja ympärillä on avoin tila
  if (cz < uPairZ + 3.0 && abs(cx) < 30.0) ok = false;         // alun kahden rungon ympäristö
  return vec4(cx, cz, r, ok ? 1.0 : 0.0);
}

// riippuva naava: pystysuoria harmaita säikeitä; a = kaarenpituus rungon ympäri, y = korkeus
float naava(float a, float y, float id, float pm) {
  float amt = hash(vec2(id * 0.37, 11.0));
  if (amt < 0.30) return 0.0;                                   // kaikissa rungoissa ei ole naavaa
  float cw = 1.1, ia = floor(a / cw), fa = fract(a / cw);
  float h = hash(vec2(ia + id * 13.7, id + 2.0));
  if (h > 0.30 + 0.45 * amt) return 0.0;
  float y0 = 7.0 + 8.0 * floor(6.0 * hash(vec2(ia * 1.7 + id, id * 3.1 + 1.0))) + 5.0 * hash(vec2(ia, id));   // riippuu oksien tasoista
  float len = 2.0 + 6.0 * hash(vec2(ia * 2.3 + 4.0, id * 1.3 + 7.0));
  float t = (y0 - y) / len;
  if (t < 0.0 || t > 1.2) return 0.0;
  t += 0.28 * (vnoise(vec2(a * 3.0, y * 0.35 + id)) - 0.5);
  float al = smoothstep(0.0, 0.04, t) * smoothstep(1.0, 0.62, t);
  float fs = fa + (0.10 + 0.30 * uWind) * sin(y * 0.42 + id + uSway * 0.9 + ia) + 0.12 * uWind * sin(a * 0.3 + uSway * 1.7 + y * 0.9);
  float prof = exp(-pow((fs - 0.5) / 0.36, 2.0));
  prof = mix(prof, 0.53, smoothstep(0.08, 0.30, pm));
  return al * prof * 0.80;
}

// pylvään pinta. n = pinnan normaali (x, z), y = korkeus (m), hp = osumapaikka, tab = pöydän runko
vec3 pillarShade(vec2 hp, vec2 n, float y, float r, float id, float tab, float gy) {
  float a = atan(n.x, n.y) * r;
  float bark = 0.55 * vnoise(vec2(a * 1.5, y * 0.08 + id * 3.1)) + 0.30 * vnoise(vec2(a * 4.6, y * 0.28 + id)) + 0.15 * vnoise(vec2(a * 11.0, y * 0.9));
  float alb = 0.10 + 1.30 * bark * bark;
  vec2 tt = vec2(XT - hp.x, ZPL - hp.y);
  float dl = length(tt);
  float lam = clamp(dot(n, tt / max(dl, 1.0)) * 0.5 + 0.5, 0.0, 1.0);
  vec2 ld = normalize(vec2(-sign(hp.x - uCamX) * 0.55, 0.85));                  // valo tulee salin keskeltä edestä: sisäreuna kirkkaampi
  float lm = clamp(dot(n, ld) * 0.5 + 0.5, 0.0, 1.0);
  vec3 L = SALO * 0.7 * (0.5 + 0.5 * uKes) * (0.06 + 2.0 * lm * lm);
  L += HALLA * uTable * 0.16 * lam * lam * lam * lam * exp(-dl / 150.0);
  float sh = shaftAt(vec3(hp.x, y, hp.y));
  L += HALLA * sh * 0.22 * (0.25 + 0.6 * uKes) * (0.45 + 0.55 * clamp(dot(n, vec2(-0.7, -0.7)) * 0.5 + 0.5, 0.0, 1.0));
  if (tab > 0.5) L += HALLA * uTable * 1.6 * exp(-abs(y - (gy + YP)) / 5.5) * smoothstep(-0.2, -0.9, n.y);   // lauta valaisee runkoja
  vec2 ra = uRodA.xy - hp; vec2 rb = uRodB.xy - hp;
  L += LEIKKAUS * (0.22 * uRodA.z + 0.06 * uRodA.w) * clamp(dot(n, normalize(ra)) * 0.5 + 0.5, 0.0, 1.0) * exp(-length(ra) / 70.0);
  L += LEIKKAUS * (0.22 * uRodB.z + 0.06 * uRodB.w) * clamp(dot(n, normalize(rb)) * 0.5 + 0.5, 0.0, 1.0) * exp(-length(rb) / 70.0);
  float low = smoothstep(0.0, 4.5, y - gy);                                                                 // tyvi on varjossa
  return HAMY * 0.8 + alb * L * (0.40 + 0.60 * low) * (1.0 - 0.45 * uMass);
}

vec3 drawPillar(vec3 col, vec2 C, float r, float id, float dxF, float dy, float camY, float zLim, float tab) {
  float yl = clamp(camY + dy * (C.y - uCamZ) / F, 0.0, YCAN);
  C.x += (0.12 + 0.9 * uWind) * pow(yl / YCAN, 2.0) * sin(uSway * 0.55 + id * 1.7 + C.y * 0.01);       // raskas huojunta tuulessa: latvat taipuvat ja palaavat
  vec2 o = vec2(uCamX - C.x, uCamZ - C.y);
  float A = 1.0 + dxF * dxF, B = dxF * o.x + o.y;
  float dmin2 = dot(o, o) - B * B / A, dmin = sqrt(max(dmin2, 0.0));
  float rs = r * 1.05 + 0.32;
  float sc = -B / A;
  if (sc < 0.8 || dmin > rs + 8.0) return col;
  float pm = sc * sqrt(A) / (F * uRes.y);
  float gy = gh(C.x, C.y);
  float cov = clamp((r - dmin) / pm + 0.5, 0.0, 1.0);
  if (cov > 0.0) {
    float s1 = sc - sqrt(max(r * r - dmin2, 0.0) / A);
    if (s1 > 0.8 && s1 < zLim) {
      vec2 hp = vec2(uCamX + dxF * s1, uCamZ + s1);
      vec2 n = normalize(hp - C);
      float y = camY + dy * s1 / F;
      col = mix(col, pillarShade(hp, n, y, r, id, tab, gy), cov);
    }
  }
  float covS = clamp((rs - dmin) / pm + 0.5, 0.0, 1.0);
  if (covS > 0.0 && sc < 230.0) {
    float s2 = sc - sqrt(max(rs * rs - dmin2, 0.0) / A);
    if (s2 > 0.8 && s2 < zLim) {
      vec2 hp = vec2(uCamX + dxF * s2, uCamZ + s2);
      vec2 n = normalize(hp - C);
      float y = camY + dy * s2 / F;
      if (y > gy + 1.0 && y < YCAN) {
        float na = naava(atan(n.x, n.y) * rs, y, id, pm) * covS * smoothstep(230.0, 90.0, s2);
        if (na > 0.0) {
          float sh = shaftAt(vec3(hp.x, y, hp.y));
          vec3 nc = SALO * (0.8 + 0.6 * uKes) + HALLA * (0.03 + 0.20 * sh * (0.3 + uKes)) + HALLA * uTable * 0.10 * exp(-length(vec2(XT - hp.x, ZPL - hp.y)) / 120.0);
          nc *= (1.0 - 0.35 * uMass);
          col = mix(col, nc, na);
        }
      }
    }
  }
  return col;
}

// Tapion pöytä: vaakasuora valon lauta kolmen rungon edessä; sykkeet kulkevat laudalla vasemmalta oikealle
vec3 drawPlank(vec3 col, float dxF, float dy, float camY, float ypl) {
  float s = ZPL - uCamZ;
  if (s < 1.0) return col;
  float x = uCamX + dxF * s, y = camY + dy * s / F;
  float pm = s / (F * uRes.y);
  float a = clamp((PLH - abs(x - XT)) / pm + 0.5, 0.0, 1.0) * clamp((0.85 - abs(y - ypl)) / pm + 0.5, 0.0, 1.0);
  if (a <= 0.0) return col;
  float u = (x - (XT - PLH)) / (2.0 * PLH);
  float e = 2.8 * uTable * (0.78 + 0.22 * vnoise(vec2(u * 9.0, uTime * 0.04)));
  for (int k = 0; k < 4; k++) {
    vec4 pu = uPulse[k]; if (pu.y <= 0.0) continue;
    float du = u - pu.x;
    e += pu.y * (2.6 * exp(-du * du / 0.0018) + (du < 0.0 ? 0.9 * exp(du / 0.10) : 0.0));
  }
  return mix(col, HALLA * e, a);
}

vec3 drawRod(vec3 col, vec4 rod, float dxF, float dy, float camY) {
  float s = rod.y - uCamZ;
  if (s < 1.0 || rod.w + rod.z <= 0.001) return col;
  float x = uCamX + dxF * s, y = camY + dy * s / F;
  if (y > YCAN) return col;
  float pm = s / (F * uRes.y), lat = abs(x - rod.x);
  float core = smoothstep(0.38 + pm, 0.10, lat);
  float halo = exp(-lat / 1.5);
  return col + LEIKKAUS * (rod.z * (1.9 * core + 0.5 * halo) + rod.w * (0.35 * core + 0.30 * halo));
}

vec3 fogS(vec3 w, float zz, vec2 sp) {
  float dim = 1.0 - 0.70 * uSunRise;                                   // väärä valo ei valaise: sali tummuu, vain usva punertuu
  vec3 s = SALO * 0.34 * (1.0 - 0.70 * smoothstep(8.0, 75.0, w.y));
  float sh = shaftAt(w);
  s += HALLA * 0.60 * sh * (0.25 + 0.55 * uKes);
  float bs = 0.0;
  for (int k = 0; k < 6; k++) { float e = (w.y - BH[k]) / (0.45 * BH[k] + 3.0); bs += uBand[k] * exp(-e * e); }
  s *= 1.0 + 0.8 * bs;
  vec3 d = vec3(max(abs(w.x - XT) - PLH, 0.0), w.y - (gh(XT, ZT) + YP), w.z - ZPL);
  s += HALLA * uTable * (0.75 * exp(-length(d * vec3(1.0, 1.7, 1.0)) / 18.0) + 0.16 * exp(-length(d * vec3(0.6, 1.5, 0.35)) / 40.0));
  s *= dim;
  float r2 = dot(sp - uSun, sp - uSun);
  s += PUNA * 0.42 * uSunRise * (0.7 * exp(-r2 / 0.05) + 0.25 * exp(-r2 / 0.45)) * smoothstep(25.0, 150.0, zz);   // vain usva punertuu
  vec2 ra = w.xz - uRodA.xy, rb = w.xz - uRodB.xy;
  s += LEIKKAUS * (uRodA.z * 0.9 + uRodA.w * 0.10) * exp(-dot(ra, ra) / 30.0) + LEIKKAUS * (uRodB.z * 0.9 + uRodB.w * 0.10) * exp(-dot(rb, rb) / 30.0);
  s += LEIKKAUS * (0.020 * (uRodA.z + uRodB.z) + 0.004 * (uRodA.w + uRodB.w));
  return s;
}

vec3 slab(vec3 col, float zf, float zn, float dxF, float dy, float camY, vec2 sp) {
  float dz = zf - zn;
  if (dz <= 0.0) return col;
  vec3 S = vec3(0.0); float bs = 0.0;
  for (int j = 0; j < 2; j++) {
    float zz = zn + dz * (0.25 + 0.5 * float(j));
    vec3 w = vec3(uCamX + dxF * zz, camY + dy * zz / F, uCamZ + zz);
    S += 0.5 * fogS(w, zz, sp);
    for (int k = 0; k < 6; k++) { float e = (w.y - BH[k]) / (0.45 * BH[k] + 3.0); bs += 0.5 * uBand[k] * exp(-e * e); }
    // lumihiutaleet: vain valokeilassa; putoavat hitaasti
    vec2 q = vec2(w.x + 0.25 * sin(w.y * 0.7 + zz), w.y + uTime * 0.55) / 1.5;
    vec2 ic = floor(q), fr = fract(q);
    float hh = hash(ic + floor(w.z / 3.0) * 7.31);
    if (hh < 0.11) {
      vec2 c = 0.2 + 0.6 * vec2(hash(ic + 1.7), hash(ic + 5.3));
      float fl = smoothstep(0.034, 0.008, length(fr - c) * 1.5);
      S += 0.5 * HALLA * 14.0 * fl * shaftAt(w) * (0.25 + uKes) * smoothstep(120.0, 40.0, zz) * smoothstep(1.5, 6.0, zz);
    }
  }
  float sig = uFogK * (1.0 + 1.5 * bs) / 175.0;
  float T = exp(-sig * dz);
  return col * T + S * (1.0 - T);
}

vec3 sunTerm(vec2 sp) {
  vec2 q = sp - uSun; float rr = length(q);
  float Rs = 0.052;
  float tex = 0.70 + 0.18 * vnoise(q * 70.0) + 0.12 * vnoise(q * 190.0);       // taottu: vasaralla lyöty pinta
  float discA = smoothstep(Rs, Rs * 0.93, rr);
  vec3 c = PUNA * uSunRise * (3.2 * discA * tex + 0.7 * exp(-rr * rr / 0.030) + 0.15 * exp(-rr * rr / 0.30));
  c += PUNA * uSunRise * (0.75 * exp(-pow((rr - 0.150) / 0.0042, 2.0)) + 0.20 * exp(-pow((rr - 0.152) / 0.020, 2.0)) + 0.16 * exp(-pow((rr - 0.272) / 0.009, 2.0)));   // kehä
  return c;
}

vec3 scene(vec2 p) {
  float asp = uRes.x / uRes.y;
  float dx = p.x - asp * 0.5, dy = p.y - uHor, dxF = dx / F;
  vec2 sp = vec2(dx, dy);
  float camY = gh(uCamX, uCamZ) + 1.55;
  float ypl = gh(XT, ZT) + YP;
  vec3 raja = rajakuva(p, 3, uTime);
  float zS = ZMAX;
  vec3 col;
  vec3 FAR = SALO * 0.45;
  vec3 RIDGE = SALO * 0.30;
  float ridge = 0.016 + 0.030 * vnoise(vec2(p.x * 1.9, 2.0)) + 0.014 * vnoise(vec2(p.x * 5.0, 7.0));
  bool ground = false, skySun = false, sunDone = false;
  if (dy < 0.0) {
    float z = camY * F / (-dy);
    for (int it = 0; it < 3; it++) { float g = gh(uCamX + dxF * z, uCamZ + z); z = max(camY - g, 0.2) * F / (-dy); }
    if (z < ZMAX) {
      ground = true; zS = z;
      float x = uCamX + dxF * z, wz = uCamZ + z;
      float e = 1.2;
      vec3 nn = normalize(vec3(-(gh(x + e, wz) - gh(x - e, wz)) / (2.0 * e), 1.0, -(gh(x, wz + e) - gh(x, wz - e)) / (2.0 * e)));
      float sn = vnoise(vec2(x * 0.35, wz * 0.35)) * 0.6 + vnoise(vec2(x * 1.7, wz * 1.7)) * 0.4;
      vec3 Ld = normalize(vec3(XT - x, 9.0, ZT - wz));
      float lam = max(dot(nn, Ld), 0.0);
      vec3 g0 = vec3(0.0075, 0.0125, 0.0230) * (0.45 + 0.9 * sn) * (0.55 + 0.9 * lam);
      float sh = shaftAt(vec3(x, gh(x, wz) + 0.5, wz));
      g0 += HALLA * 0.16 * sh * (0.30 + 0.9 * uKes) * (0.6 + 0.8 * sn);                                  // valoläiskät lumella
      float pool = exp(-pow((x - XT) / 52.0, 2.0)) * exp(-abs(wz - ZPL) / 34.0) * (1.0 + uTrem * sin(uTime * 27.0 + wz * 0.0));
      g0 += HALLA * uTable * 0.16 * pool * (0.5 + 0.8 * sn) * (0.6 + 0.8 * lam);                          // pöydän valo maassa
      col = g0;
    } else { col = FAR * 0.8; }
  } else {
    float zc = (YCAN - camY) * F / max(dy, 1e-4);
    if (zc < ZMAX) {
      zS = zc;
      float x = uCamX + dxF * zc, wz = uCamZ + zc;
      float h = holeF(x + uMel, wz);
      float s = smoothstep(0.58, 0.78, h);
      col = mix(HAMY * (1.5 + 2.0 * vnoise(vec2(x * 0.5, wz * 0.5))), HALLA * 0.080 * (0.35 + uKes), s);
      col += PUNA * 0.0;
      col += LEIKKAUS * (uRodA.w * 0.05 + uRodA.z * 0.3) * exp(-pow((x - uRodA.x) / 14.0, 2.0)) * exp(-pow((wz - uRodA.y) / 30.0, 2.0)) * s;
    } else {
      col = FAR * (0.55 + 0.7 * exp(-dy / 0.22));
      if (dy < ridge) { col = RIDGE; }
      else {
        skySun = true;
      }
    }
  }
  // kolme ikihonkaa ja pöytä, pylväät, kerrokset: kaukaa lähelle
  float zc2 = zS;
  float nTop = floor((uCamZ + zS) / DZ), nBot = floor(uCamZ / DZ);
  float nT = floor(ZT / DZ), nRA = floor(uRodA.y / DZ), nRB = floor(uRodB.y / DZ);
  for (int li = 0; li < 44; li++) {
    float n = nTop - float(li);
    if (n < nBot) break;
    float zl = (n + 0.5) * DZ - uCamZ;
    if (zl < 1.0 || zl >= zc2) continue;
    col = slab(col, zc2, zl, dxF, dy, camY, sp);
    zc2 = zl;
    if (skySun && !sunDone && zl < 150.0) { sunDone = true; col += sunTerm(sp); }
    float xr = uCamX + dxF * zl, i0 = floor(xr / CW);
    for (int k = -1; k <= 1; k++) {
      vec4 P = pillarDef(n, i0 + float(k));
      if (P.w < 0.5) continue;
      col = drawPillar(col, P.xy, P.z, n * 7.0 + i0 + float(k), dxF, dy, camY, zS, 0.0);
    }
    if (n == nT) {
      for (int k = -1; k <= 1; k++) col = drawPillar(col, vec2(XT + 29.0 * float(k), ZT), RT, 500.0 + float(k), dxF, dy, camY, zS, 1.0);
      col = drawPlank(col, dxF, dy, camY, ypl);
    }
    if (n == nRA) col = drawRod(col, uRodA, dxF, dy, camY);
    if (n == nRB) col = drawRod(col, uRodB, dxF, dy, camY);
  }
  if (skySun && !sunDone) { sunDone = true; col += sunTerm(sp); }
  // alun kaksi runkoa: kamera kulkee niiden välistä; ne ovat lähimmät
  float zp = uPairZ - uCamZ;
  if (zp > 1.0 && zp < zc2) {
    col = slab(col, zc2, zp, dxF, dy, camY, sp); zc2 = zp;
    col = drawPillar(col, vec2(-9.5, uPairZ), 8.0, 900.0, dxF, dy, camY, zS, 0.0);
    col = drawPillar(col, vec2(9.5, uPairZ), 8.0, 901.0, dxF, dy, camY, zS, 0.0);
  }
  col = slab(col, zc2, 0.0, dxF, dy, camY, sp);
  // alku: rajakuva PIMEYS avautuu rungon pinnaksi ja saliksi
  col = mix(raja, col, uOpen);
  // loppu: latvuston pimeys leviää juuresta yli taivaan ja peittää valon (jättitammi), kunnes ruutu on rajakuva
  if (uDark > 0.0) {
    vec2 q = vec2(p.x - asp * (0.5 + 0.10), p.y - 1.12);
    float ang = atan(q.x, -q.y);
    float dd = length(q * vec2(1.0, 0.9)) * (1.0 + 0.30 * (vnoise(vec2(ang * 2.3 + 1.7, 3.0)) - 0.5) + 0.12 * (vnoise(vec2(ang * 7.0, 9.0)) - 0.5))
             + 0.16 * (fbm(p * 3.5 + vec2(0.0, uTime * 0.02)) - 0.5);
    float m = 1.0 - smoothstep(uDark - 0.22, uDark, dd);
    col = mix(col, raja, m);
  }
  return col;
}
` + FS_LOPPU;

async function alusta() {
  const q = new URLSearchParams(location.search);
  const d = await lataa();
  const A = d.aika;
  d.vaadi('jousijakso_urkupiste_E_alku', 'jousijakso_urkupiste_E_loppu', 'patarumpu_ppp', 'hitaat_soinnut', 'h_palaa_ennen_hiljaisuutta',
    'hiljainen_jakso_alku', 'hiljainen_jakso_loppu', 'vaski_tutti_620', 'c_duuri_valahdykset', 'auringonsade', 'M_ennakko', 'M_raskaat_askeleet');
  const T0 = A.jousijakso_urkupiste_E_alku, T_PPP = A.patarumpu_ppp, T_SO = A.hitaat_soinnut, T_H = A.h_palaa_ennen_hiljaisuutta;
  const T_HA = A.hiljainen_jakso_alku, T_HL = A.hiljainen_jakso_loppu, T_TUTTI = A.vaski_tutti_620, T_CV = A.c_duuri_valahdykset;
  const T_AS = A.auringonsade, T_M = A.M_ennakko, T_END = A.M_raskaat_askeleet;
  const FPS = d.FPS, NF = d.NF;
  const PAIR_Z = 4.6, ZT = 255;

  // ---- äänestä mitatut hitaat signaalit ----
  const urk = d.tapahtumat.filter((e) => e.tyyppi === 'urkupiste');
  const urkupiste = (t) => urk.reduce((m, e) => Math.max(m, sstep(e.alku - 0.6, e.alku + 0.6, t) * (1 - sstep(e.loppu - 0.6, e.loppu + 0.6, t))), 0);
  const hilj = (t) => sstep(T_HA - 0.2, T_HA + 2.5, t) * (1 - sstep(T_HL, T_HL + 4.0, t));       // hiljainen jakso: usva peittää, pöytä sammuu
  const liikeEv = d.tapahtumat.filter((e) => e.tyyppi === 'liike');
  const liikeNyt = (t) => liikeEv.reduce((m, e) => (t >= e.alku && t <= e.loppu ? Math.max(m, clamp(e.voima / 80, 0, 1)) : m), 0);
  const sLi = d.sarja((f) => liikeNyt(f / FPS));
  const liike = (t) => d.ka(sLi, clamp(t, 0, NF / FPS) * FPS, 3 * FPS);
  // C-duurin sointuväri: do, mi, sol -osuus kaikesta äänestä (kolme välähdystä mitataan tästä)
  const sCdur = d.sarja((f) => { let a = 0, b = 0; for (let m = 36; m <= 96; m++) { const v = d.taso(m, f); b += v; const pc = m % 12; if (pc === 0 || pc === 4 || pc === 7) a += v; } return b > 1 ? a / b : 0; });
  const cdur = (t) => d.ka(sCdur, clamp(t, 0, NF / FPS) * FPS, 0.9 * FPS);
  const nousu = (t) => sstep(0.34, 0.50, cdur(t)) * sstep(T_CV - 3, T_CV - 1, t);
  const aurinko = (t) => clamp(Math.max(nousu(t), sstep(T_AS - 1.8, T_AS, t)), 0, 1);                // kolmas välähdys jää auringonsade-ankkurissa

  // ---- kamera: kertymä (vauhti on integraali), matalalla, hitaimmillaan; pysähtyy auringonsateessa; lähtee uudestaan M:ssä ----
  const V7 = 0.72;
  const vauhti = (t) => {
    if (t < T0) return 0;
    let v = V7 + 0.55 * sstep(T_HL, T_HL + 8, t) * (0.55 + 0.45 * liike(t));
    v *= 1 - sstep(T_AS - 5.0, T_AS, t);                                                          // nimetty pysähdys: hidastuu ja seisoo
    if (t > T_M) v = 4.8 * sstep(T_M, T_M + 4.0, t);                                              // M: lähtee uudestaan, kiihtyvästi
    return v;
  };
  const sV = d.sarja((f) => vauhti(f / FPS) / FPS);
  const camZ = (t) => d.kohta(sV, clamp(t, 0, NF / FPS - 0.05)) - d.kohta(sV, T0);
  const camX = (t) => { const z = camZ(t); return 3.4 * Math.sin(z / 34) * sstep(0, 14, z); };
  const swayK = d.sarja((f) => 1 / FPS);   // naavan hidas heilunta: aika

  // ---- pöydän valo: urkupiste ja matala taso; sammuu hiljaisessa jaksossa; punainen aurinko vie sen ----
  const mass = (t) => clamp(d.matala(t, 1.0) * 1.3, 0, 1);
  const kes = (t) => clamp(d.keski(t, 0.7) * 1.0, 0, 1);
  const pohja = (t) => clamp(d.matala(t, 1.2) * 1.5, 0, 1);
  const pöytä = (t) => {
    let l = (0.20 + 0.40 * urkupiste(t) + 0.55 * pohja(t)) * (1 - hilj(t));
    l = Math.min(1, l) * (1 - sstep(T_HL - 0.1, T_HL, t) * 0 );
    if (t >= T_HL) l = Math.min(1, 0.6 * sstep(T_HL + 1, T_TUTTI, t) * (0.4 + 0.8 * pohja(t)) + 0.0);
    return clamp(l * (1 - 0.92 * aurinko(t)), 0, 1);
  };
  const SYKKEET = d.alut.filter((a) => a.t >= T_H - 0.4 && a.t <= T_HA - 0.2);
  const sykkeet = (t) => SYKKEET.filter((a) => t >= a.t && t - a.t < 1.8).slice(-4).map((a) => { const k = (t - a.t) / 1.2; return [clamp(k, 0, 1.15) * 1.0 + 0.0, a.v * sstep(0, 0.08, t - a.t) * (1 - sstep(1.0, 1.8, t - a.t))]; });
  // usvakerrokset: pitkät sävelet (yli 1,4 s) nostavat korkeutensa mukaisen kerroksen; hitaat_soinnut painottaa
  const PITKAT = d.nuotit.filter((n) => n[1] >= 1.4 && n[0] >= T0 - 6 && n[0] <= T_END + 4);
  const BAND_LO = 44, BAND_HI = 92;
  const kerrokset = (t) => {
    const b = [0, 0, 0, 0, 0, 0];
    const paino = 0.30 + 0.70 * sstep(T_SO - 2, T_SO + 1, t) * (1 - sstep(T_H, T_H + 3, t));
    for (const [a, du, m] of PITKAT) { if (t < a - 0.1 || t > a + du + 4) continue;
      const e = sstep(a, a + 1.6, t) * (1 - sstep(a + du, a + du + 2.2, t)); const i = clamp(Math.floor((m - BAND_LO) / (BAND_HI - BAND_LO) * 6), 0, 5); b[i] = Math.min(1, b[i] + 0.55 * e); }
    return b.map((x) => x * paino);
  };
  const iskuK = (T, t) => { const ti = t - T; return ti < 0 ? [0, 0] : [2.4 * (1 - Math.exp(-ti / 0.09)) * Math.exp(-ti / 0.35), 0.9 * (1 - Math.exp(-ti / 0.6)) * Math.exp(-ti / 3.0)]; };
  const SUN_DX = 0.09, SUN_DY0 = -0.07, SUN_DY1 = 0.21;
  const rodA = { x: camX(T_TUTTI) + (-0.34) * 55 / 1.07, z: camZ(T_TUTTI) + 55 };
  const rodB = { x: camX(T_M) + SUN_DX * 60 / 1.07, z: camZ(T_M) + 60 };
  const tumma = (t) => (t <= T_M ? 0 : 2.45 * Math.pow(clamp((t - T_M) / (T_END - T_M), 0, 1), 1.7));
  // tuuli on musiikki: koko orkesterin hidas voima + vaskien iskujen puuska (nousee nopeasti, laskee hitaasti)
  const puuska = (T, t) => (t < T ? 0 : sstep(0, 0.25, t - T) * Math.exp(-(t - T) / 2.5));
  const tuuli = (t) => clamp(0.25 + 0.9 * d.koko(t, 1.2) + 0.9 * puuska(T_TUTTI, t) + 0.9 * puuska(T_M, t), 0, 1.3);
  const ppp = (t) => 0.30 * sstep(T_PPP - 0.3, T_PPP + 0.6, t) * (1 - sstep(T_PPP + 7.5, T_PPP + 8.8, t));

  const tila = (t) => {
    const a = iskuK(T_TUTTI, t), b = iskuK(T_M, t), au = aurinko(t);
    return { t, camZ: camZ(t), camX: camX(t), open: sstep(T0, T0 + 6.5, t), mass: mass(t), kes: kes(t), mel: clamp((d.melodia(t, 2.5) - 72) * 0.35, -5, 5),
      table: pöytä(t), trem: ppp(t), veil: 0.85 * hilj(t), sun: au, sunDy: SUN_DY0 + (SUN_DY1 - SUN_DY0) * au, cutA: a, cutB: b, pulssit: sykkeet(t), bands: kerrokset(t),
      wind: tuuli(t), dark: tumma(t), v: vauhti(t), cdur: cdur(t) };
  };

  const { gl, U, piirra } = luoGL(FS);
  const set1 = (n, v) => gl.uniform1f(U(n), v);
  julkaise({
    gl, aika: A,
    kamera: (t) => ({ p: [camX(t), 1.55, camZ(t)], q: [0, 0, 0, 1], shot: 'matka', cut: 0, trans: false }),
    kuvaus: (t) => { const s = tila(t); return { t: +t.toFixed(2), vauhti: +s.v.toFixed(2), camZ: +s.camZ.toFixed(1), camX: +s.camX.toFixed(2), massa: +s.mass.toFixed(2), keski: +s.kes.toFixed(2),
      melodia: +s.mel.toFixed(2), poyta: +s.table.toFixed(2), usvaVeil: +s.veil.toFixed(2), kerrokset: s.bands.map((x) => +x.toFixed(2)), sykkeita: s.pulssit.length, cdur: +s.cdur.toFixed(2),
      aurinko: +s.sun.toFixed(2), tuuli: +s.wind.toFixed(2), isku: [+s.cutA[0].toFixed(2), +s.cutB[0].toFixed(2)], tumma: +s.dark.toFixed(2), auki: +s.open.toFixed(2) }; },
    seek: (t) => {
      t = clamp(t, 0, NF / FPS - 0.05);
      const s = tila(t);
      set1('uTime', t); set1('uCamX', s.camX); set1('uCamZ', s.camZ); set1('uHor', 0.27); set1('uOpen', s.open); set1('uDark', s.dark);
      set1('uMass', s.mass); set1('uKes', s.kes); set1('uMel', s.mel); set1('uTable', s.table); set1('uTrem', s.trem); set1('uVeil', s.veil);
      set1('uWind', s.wind); set1('uSunRise', s.sun); set1('uPairZ', PAIR_Z); set1('uSway', t * 0.35);
      set1('uFogK', (0.80 + 0.22 * s.mass) * (1 + 2.6 * s.veil));
      gl.uniform2f(U('uSun'), SUN_DX, s.sunDy); gl.uniform2f(U('uCut'), s.cutA[0] + s.cutB[0], s.cutA[1] + s.cutB[1]);
      gl.uniform4f(U('uRodA'), rodA.x, rodA.z, s.cutA[0], s.cutA[1]); gl.uniform4f(U('uRodB'), rodB.x, rodB.z, s.cutB[0], s.cutB[1]);
      const pu = new Float32Array(16); s.pulssit.forEach((x, i) => pu.set([x[0], x[1], 0, 0], i * 4)); gl.uniform4fv(U('uPulse'), pu);
      gl.uniform1fv(U('uBand'), new Float32Array(s.bands));
      piirra();
    },
  });
  if (q.get('mittaa')) for (const x of q.get('mittaa').split(',').map(Number)) console.log(JSON.stringify(window.kuvaus(x)));
}
alusta().catch((e) => { console.error(e); window.sceneError = String(e.message || e); });
