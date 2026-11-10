// Tapiola: maailmat 1 (Horisontti ja siemen) ja 2 (Repeämä), tiedoston alusta ankkuriin fis_pitka_aani. Vedos 6 (täsmäkorjaukset; vedos 5: runs/v6_01_02/maailma_01_02_vedos5.js).
// Vedos 6: vaarat tulevat esiin vähintään 6 s pehmeällä käyrällä ja harjan valo on hillitty (rivi 60); puuska kasvaa mitatun tason mukana (rivi 61);
// yleistauko = tuuli ja lumi rauhoittuvat 0,6 s:ssa ja kamera laskeutuu latvojen väliin koko tauon ajan (rivit 61, 62); äkilliset muutokset pehmeiksi.
// Päättyy rajakuvaan PIMEA_MASSA (visual/yhteinen.js): kamera laskeutuu latvojen väliin, josta maailma 3 avautuu.
// Suunnitelma: runs/v5_01_02/brief.md; säännöt: docs/visuaalinen_tyyli.md luvut 4d, 7b ja 12.
// - Katsoja on latvojen yläpuolella matalalla ja kulkee eteenpäin metsän yli kohti horisonttia, hieman viistoon (parallaksi).
//   Metsä on sama korkeuskenttä (kuusten kruunut) kuin lopussa (maailma 11_12): käyttäjä piti siitä. Ei revontulia, ei lämpöä.
// - Maa ja rungot eivät liiku. Puu on jäykkä: tuuli taivuttaa latvaa sivulle (tyvi paikallaan, vedos 7: enintään noin 1,5 % korkeudesta,
//   tavallisesti alle 1 %, päätaajuus 0,15 Hz, naapuripuut eri vaiheessa). Kaukana (yli 150 m) latvat eivät taivu.
// - Gis on horisontin valo: suora valon viiva (unisono). Vaarat eivät nouse: jokainen puhaltajan paisutus paljastaa yhden
//   vaaran usvasta, ja valo kulkee sen harjaa pitkin. Vaara ei muuta muotoaan; se vajoaa hitaasti usvaan ja jää siintämään.
// - Jouset ovat metsä: niiden tullessa tummuus ja terävyys kulkevat lähimmistä latvoista kauemmas; kun ne lakkaavat, metsä väistyy
//   usvaan kaukaa alkaen ja takana ollut valo paljastuu.
// Kohtaus on puhdas aikafunktio seek(t): kaikki keskiarvot ja kertymät lasketaan alussa ruuduittain.
import { lataa, luoGL, julkaise, FS_ALKU, GLSL_YHTEINEN, FS_LOPPU, clamp, smooth, sstep, fract, lerp } from './yhteinen.js';

const NV = 11;   // pienet vaarat; Tapion talo on kahdestoista

const FS = FS_ALKU + `
uniform float uTime, uCamX, uCamZ, uCamH, uHor, uGis, uVeil, uGust, uLint, uLow, uFogL, uElev, uSv, uHB, uSway, uEnter, uWin, uAmb;
uniform float uHK, uTK, uTop, uDrift, uBuild, uGround;
uniform float uCamXv, uHSh, uEnd, uVK;   // vaarojen sivuttaisliike (m), talon liuku, kulku metsän sisään, vaarojen liikkeen suhde
uniform float uFr[8];                    // fraasin tumma aalto etäisyyden mukaan
uniform vec4 uVP[11];                    // vaaran harjan valon kohdat (viimeiset neljä askelta)
uniform vec4 uVW[11];                    // niiden painot
uniform vec4 uHP, uHW;                   // sama Tapion talolle
uniform vec3 uCut;          // iskun leikkauksen voima, jälkihohto, nousu (0..1)
uniform vec4 uSnow;         // tiheys, sivutuulen matka, putoamisen matka, lähestymisen matka
uniform float uHill[32];    // horisontin kummut (Tapion talon vaara): melodian kaari, kiinteä
uniform vec4 uPulse[6];     // matalan kaistan paino: ikä, voima
uniform float uJ[8];        // jousten voima etäisyyden mukaan: lähin heti, kaukaiset viiveellä
uniform vec4 uVx[11];       // vaara: paikka x (alussa), leveys, korkeus, etäisyys D (m)
uniform vec4 uVt[11];       // vaara: näkyvyys, harjan valo, valon kohta x, -
uniform vec4 uHouse;        // Tapion talon vaara: näkyvyys, harjan valo, valon kohta x, -
const float F = 1.07;
const float CELL = 6.4;
const vec3 SKY_TOP = vec3(0.003, 0.005, 0.010), SKY_LOW = vec3(0.011, 0.020, 0.040);
const vec3 NEEDLE = vec3(0.0042, 0.0085, 0.0100);         // hämy: havun tumma sinivihreä
const vec3 SNOWA = vec3(0.60, 0.69, 0.82);                // halla: lumi
const vec3 AMB = vec3(0.050, 0.080, 0.130);               // taivaan valo
const vec3 SNOWC = vec3(0.55, 0.62, 0.75);
` + GLSL_YHTEINEN + `
float prof(float u) { u = clamp(u, 0.0, 31.0); int i = int(floor(u)); return mix(uHill[i], uHill[min(i + 1, 31)], fract(u)); }
// vaaran laen havuhattu: pienet latvojen kärjet
float tips(float wx, float k, float cell) {
  float tip = 0.0, c = floor(wx / cell);
  for (int j = -1; j <= 1; j++) {
    float ci = c + float(j), h = hash(vec2(ci, k * 5.0 + cell)), sh = hash(vec2(ci, k + 4.0 + cell));
    float xi = (ci + 0.15 + 0.7 * hash(vec2(ci, k + 9.0 + cell))) * cell;
    float w = cell * (0.5 + 1.0 * hash(vec2(ci, k + 2.0)));
    float e = sh > 0.72 ? 1.7 : 0.60;
    tip = max(tip, (0.18 + 0.82 * h * h) * (sh > 0.72 ? 0.7 : 1.0) * max(0.0, 1.0 - pow(abs(wx - xi) / w, e)));
  }
  return tip;
}

// ---------- maasto ja latvusto: korkeuskenttä, kuusikruunut (sama kuin maailmassa 11_12) ----------
float terr(vec2 xz) { return uTK * (6.5 * vnoise(xz * 0.0031) + 2.0 * vnoise(xz * 0.011 + 7.0)); }
// det 1 = kaikki yksityiskohdat, 0 = sileä kartio; lod 1 = vain tiheyden keskikorkeus (kaukana)
float canopyH(vec2 xz, float det, float lod, out float cid, out float crel) {
  float E = terr(xz), h = 0.0; cid = 0.5; crel = 0.0;
  float dens = smoothstep(0.16, 0.48, vnoise(xz * 0.0085 + 3.0)) * (0.85 + 0.55 * smoothstep(0.30, 0.65, vnoise(xz * 0.03 + 9.0)));
  dens = 0.34 + 0.66 * clamp(dens, 0.0, 1.0);
  if (lod >= 1.0) return E + dens * 24.0 * uHK;
  xz = mat2(0.8776, -0.4794, 0.4794, 0.8776) * xz;
  vec2 ic = floor(xz / CELL - 0.5);
  float swayK = smoothstep(0.68, 0.80, det);                              // yli 150 m: latvat eivät taivu näkyvästi
  for (int j = 0; j < 2; j++) for (int i = 0; i < 2; i++) {
    vec2 c = ic + vec2(float(i), float(j));
    float r1 = hash(c), r2 = hash(c + 17.3), r3 = hash(c + 41.7);
    if (r3 > dens * 1.08 + 0.06) continue;                              // aukot, suot ja harvat kohdat
    vec2 ctr = (c + 0.5 + 0.85 * (vec2(r1, r2) - 0.5)) * CELL;
    float stand = vnoise(ctr * 0.0060 + 11.0);                          // vanhan metsän laikut
    float ht = ((17.0 + 18.0 * stand) * (0.72 + 0.28 * r1) * mix(0.40, 1.0, dens) + (r2 > 0.95 ? 3.0 : 0.0)) * uHK;
    float rad = (1.0 + 0.092 * ht / uHK) * (0.8 + 0.4 * r3) * mix(1.0, uHK, 0.5);
    vec2 dv = xz - ctr;
    { // tuuli: jäykkä puu taipuu sivulle, tyvi paikallaan, latva eniten (enintään 2 % / 4 % korkeudesta); aalto kulkee maton yli
      float ph = dot(ctr, vec2(0.021, 0.034)) - uTime * 0.95 + 1.7 * vnoise(ctr * 0.012);
      float u0 = clamp(length(dv) / rad, 0.0, 1.0);
      float ph2 = dot(ctr, vec2(0.047, -0.031)) - uTime * 0.61 + 2.3 * vnoise(ctr * 0.021 + 5.0);   // vedos 7: toinen, yhteismitaton vaihe: naapuripuut eivät keinu yhdessä
      vec2 sw = vec2(0.7 * sin(ph) + 0.3 * sin(ph2), 0.4 * sin(ph * 0.8 + 1.0)) * uSway * 0.0185 * ht * pow(1.0 - u0, 2.5) * swayK;
      dv -= sw; }
    float an = atan(dv.y, dv.x);
    float u = sqrt(dot(dv, dv) + 0.10) / (rad * (1.0 + 0.10 * sin(an * 3.0 + r1 * 6.0 + 1.0) + 0.06 * sin(an * 7.0 + r2 * 9.0)));
    if (u >= 1.0) continue;
    float nt = 5.0 + ht / uHK * 0.13, tt = u * nt, ti = floor(tt), f = fract(tt);
    float uq = (ti + mix(0.30 * f, 1.0, smoothstep(0.55, 0.97, f))) / nt;       // kerrokset: loivat hyllyt ja jyrkät reunat
    float uu = mix(u, uq, det);
    float hh = (ht * 1.10) * pow(max(1.0 - uu, 0.0), 1.15);
    hh += det * 0.05 * (vnoise(xz * 1.7) - 0.5);
    if (hh > h) { h = hh; cid = r2 * 0.6 + r3 * 0.4; crel = clamp(hh / ht, 0.0, 1.2); }
  }
  return E + mix(h, dens * 24.0 * uHK, lod);
}
float canopyQ(vec2 xz, float det, float lod) { float a, b; return canopyH(xz, det, lod, a, b); }

float snowAt(int s, float zz, float dx, float dy) {
  vec2 w2 = vec2(dx * zz / F + uCamX + uSnow.y * (0.6 + 0.05 * float(s)), dy * zz / F + uSnow.z) / 0.9 + float(s) * 17.3 + floor((float(s) * 5.5 - uSnow.w) / 44.0) * 3.7;
  vec2 ic = floor(w2), fr = fract(w2);
  float h = hash(ic);
  if (h >= uSnow.x) return 0.0;
  vec2 c = 0.15 + 0.7 * vec2(hash(ic + 1.7), hash(ic + 5.1));
  float dd = length(fr - c) * 0.9, r = 0.030 + 0.02 * fract(h * 53.0);
  return 0.50 * smoothstep(r, r * 0.25, dd) * smoothstep(1.5, 4.0, zz) * smoothstep(45.5, 38.0, zz);
}

// Tapion talon vaara: sama profiili kuin maailmassa 11_12 (siellä pienennettynä uSv:llä): talo ja kummut
float ridgeAt(float x, float asp, out float house) {
  float xd = asp * 0.64, xr = x - xd;
  house = 0.150 * exp(-pow(xr / 0.25, 2.0)) + 0.040 * exp(-pow((xr + 0.34) / 0.22, 2.0));
  float u = clamp(x / asp, 0.0, 1.0) * 31.0;
  float hh = 0.10 * prof(u - 1.6) + 0.20 * prof(u - 0.8) + 0.40 * prof(u) + 0.20 * prof(u + 0.8) + 0.10 * prof(u + 1.6);
  return (0.065 + house + hh) * uSv;
}
float vprof(float xl, float w, float sd) {   // vaaran muoto: kolmen leveän kummun summa, epäsymmetrinen (pitkä loiva rinne toisella puolella)
  float kl = sd > 0.5 ? 1.0 : 0.42, kr = sd > 0.5 ? 0.42 : 1.0;
  float k = mix(kl, kr, smoothstep(-0.15 * w, 0.15 * w, xl));
  float m1 = exp(-pow(xl / (w * k), 2.0));
  float m2 = exp(-pow((xl - 0.9 * w * (0.4 + sd)) / (0.55 * w), 2.0));
  float m3 = exp(-pow((xl + 1.2 * w) / (0.7 * w), 2.0));
  return (m1 + 0.55 * m2 + 0.4 * m3) / 1.25;
}
float distTex(float x, float dy) { return 0.86 + 0.28 * (0.55 * vnoise(vec2(x * 130.0, dy * 520.0)) + 0.45 * vnoise(vec2(x * 48.0, dy * 190.0))); }
float frAt(float s) { float x = clamp(s, 0.0, 1.0) * 7.0; int i = int(floor(x)); return mix(uFr[i], uFr[min(i + 1, 7)], fract(x)); }
float jouAt(float s) { float x = clamp(s, 0.0, 1.0) * 7.0; int i = int(floor(x)); return mix(uJ[i], uJ[min(i + 1, 7)], fract(x)); }

vec3 world(vec2 p, float asp, float dx, float dy, out float thit, out float cov) {
  vec3 ro = vec3(uCamX, uCamH, uCamZ);
  vec3 rd = normalize(vec3(dx, dy, F));
  float gx = asp * 0.14;
  float hz = exp(-pow((dx - gx) / 0.80, 2.0));
  float G = uGis;
  vec3 fogBase = SALO * (0.50 + 0.55 * G) * (1.0 + 0.9 * hz) + HALLA * G * 0.040 * hz + SALO * 0.9 * uVeil + HALLA * uVeil * 0.010;
  vec3 col;
  thit = 1e5; cov = 0.0;
  if (dy > -0.0004) {
    // ----- taivas: usva ja horisontin valo -----
    col = mix(SKY_LOW, SKY_TOP, smoothstep(0.0, 0.55, dy));
    float m1 = 0.5 + 0.5 * sin(p.x * 2.1 + uTime * 0.05 + 1.6 * sin(p.y * 5.3 - uTime * 0.03));
    float m2 = vnoise(vec2(p.x * 3.0 + uTime * 0.04, p.y * 9.0));
    col += SALO * 0.16 * (0.6 * m1 + 0.4 * m2 - 0.4) * exp(-max(dy - 0.3, 0.0) / 0.25);
    float sH = 0.036;
    float aB = dy - uHB;
    float cx0 = asp * 0.36 - uCamX * 0.00004;
    col += HALLA * G * (0.55 * exp(-max(aB, 0.0) / sH) + 0.08 * exp(-max(aB, 0.0) / (sH * 4.0))) * (0.85 + 0.3 * m2);
    // iskun valo kerääntyy viivalle siihen kohtaan, josta leikkaus nousee
    col += HALLA * uBuild * exp(-pow((p.x - cx0) / 0.12, 2.0)) * (0.55 * exp(-max(aB, 0.0) / (sH * 1.5)) + 0.10 * exp(-max(aB, 0.0) / (sH * 5.0)));
    // kaukainen metsämassa horisontin alla: kuusten latvojen hieno rakenne sulaa usvaan; ainoa suora vaakaviiva on valon viiva
    {
      vec3 bodyP = mix(fogBase * 0.62, fogBase * 1.0 + HALLA * G * 0.02, smoothstep(-0.07, 0.0, aB));
      bodyP = mix(fogBase * 0.80, bodyP, smoothstep(0.0, 0.05, dy)) * distTex(p.x, dy);
      // kaukaiset latvarivit horisontin alla: pienet kuusenkärjet, kukin rivi lähempänä isompi ja tummempi (ei piirteetöntä kaistaa)
      float rows = 1.0;
      rows *= 1.0 - 0.20 * smoothstep(0.0026, -0.0026, aB + 0.0050 + 0.0042 * tips(p.x * 400.0, 3.0, 1.0));
      rows *= 1.0 - 0.18 * smoothstep(0.0030, -0.0030, aB + 0.0135 + 0.0058 * tips(p.x * 250.0, 5.0, 1.0));
      rows *= 1.0 - 0.18 * smoothstep(0.0034, -0.0034, aB + 0.0235 + 0.0075 * tips(p.x * 150.0, 7.0, 1.0));
      bodyP *= mix(1.0, rows, smoothstep(0.0, 0.010, dy));
      // kaukametsän yläreuna on epätasainen ja pehmeä; vain valon viiva on suora
      float aR = aB - 0.0042 * tips(p.x * 330.0, 11.0, 1.0) - 0.0012 * vnoise(vec2(p.x * 90.0, 2.0));
      col = mix(col, bodyP, smoothstep(0.0045, -0.0045, aR));
      cov = smoothstep(0.0045, -0.0045, aR);
      col += HALLA * G * 0.16 * exp(-pow(aB / 0.0035, 2.0));
    }
    // Tapion talon vaara: kaukaisin ja suurin, paljastuu viimeisenä; talon ikkunat hopeisina
    {
      float hxp = p.x - uHSh;                                                  // talo liukuu hitaasti kameran mukana (kaukaisin taso)
      float house; float rH = max(ridgeAt(hxp, asp, house), uHB + 0.004);
      float hat = (0.010 + 0.012 * smoothstep(0.02, 0.12, house)) * uSv * tips(hxp * 60.0, 9.0, 1.3);
      float ab = dy - rH, abh = ab - hat;
      float gi = 0.0, hdx = hxp - asp * 0.64, hsg = 0.065;
      for (int k = 0; k < 4; k++) gi = max(gi, uHW[k] * exp(-pow((hdx - uHP[k]) / hsg, 2.0)));
      gi = max(gi, 0.30 * uHW[0] * exp(-pow((hdx - uHP[0]) / 0.18, 2.0)));
      gi *= uHouse.y;
      col += HALLA * gi * (0.50 * exp(-max(ab, 0.0) / (sH * 0.40)) + 0.08 * exp(-max(ab, 0.0) / (sH * 2.0))) * smoothstep(-0.02, 0.004, ab);
      float depthF = clamp((rH + hat - dy) / (rH + hat - uHB + 0.03), 0.0, 1.0);
      float alpha = clamp(uHouse.x * 1.6 - depthF * 0.6, 0.0, 1.0);
      vec3 top = SALO * 2.1 * (0.8 + 0.5 * G);
      vec3 body = mix(fogBase * 0.80, top, pow(1.0 - depthF, 0.7)) * (0.93 + 0.14 * vnoise(vec2(p.x * 38.0, dy * 70.0)));
      col = mix(col, body, smoothstep(0.0016, -0.0016, abh) * alpha);
      cov = max(cov, smoothstep(0.0016, -0.0016, abh) * alpha);
      for (int i = 0; i < 6; i++) {
        vec2 wp = vec2(asp * 0.64 + uSv * (-0.050 + 0.050 * float(i % 3) + 0.010 * float(i / 3)), uSv * (0.100 + 0.046 * float(i / 3) + 0.008 * sin(float(i) * 2.3)));
        vec2 d = (vec2(hxp, dy) - wp) / (uSv * vec2(0.0036, 0.0060));
        float tw = 0.60 + 0.40 * sin(uTime * (0.5 + 0.13 * float(i)) + float(i) * 1.9);
        col += HOPEA * uWin * uHouse.x * tw * (1.2 * exp(-pow(dot(d, d), 1.6)) + 0.07 * exp(-dot(d, d) * 0.06));
      }
      col += HALLA * gi * 0.30 * exp(-pow(ab / (0.0075 * uSv), 2.0)) * smoothstep(0.0, 0.01, uHouse.x);
    }
    // pienet vaarat: kaukaisimmasta lähimpään; kukin on maailmassa omalla etäisyydellään D (parallaksi: lähin liukuu ja kasvaa, kaukaisin lähes ei)
    for (int i = 0; i < 11; i++) {
      vec4 vx = uVx[i], vt = uVt[i];
      if (vt.x <= 0.002 && vt.y <= 0.002) continue;
      float Dz = max(vx.w - uCamZ, 60.0), s = vx.w / Dz;
      // paikka: näkyville tullessa suunniteltu kohta; sen jälkeen sivuttaisliike (parallaksi: lähin liukuu eniten) ja eteneminen (kasvu)
      float sR = vx.w / max(vx.w - vt.w, 60.0);
      float cxs = asp * 0.5 + (vx.x - asp * 0.5) * s / sR - (uCamXv - vt.w * uVK) * F / Dz;
      float xl = (p.x - cxs) / s;
      float r = uHB + s * vx.z * vprof(xl, vx.y, fract(vx.x * 7.31));
      float ab = dy - r;
      float gi = 0.0;
      for (int k = 0; k < 4; k++) gi = max(gi, uVW[i][k] * exp(-pow((xl - uVP[i][k]) / (0.22 * vx.y), 2.0)));
      gi = max(gi, 0.30 * uVW[i][0] * exp(-pow((xl - uVP[i][0]) / (0.60 * vx.y), 2.0)));
      gi *= vt.y;
      col += HALLA * gi * (0.45 * exp(-max(ab, 0.0) / (sH * 0.40)) + 0.07 * exp(-max(ab, 0.0) / (sH * 2.0))) * smoothstep(-0.02, 0.004, ab);
      float depthF = clamp((r - dy) / (r - uHB + 0.03), 0.0, 1.0);          // paljastuminen ylhäältä alas: harja ensin, sitten rinne
      float alpha = clamp(vt.x * 1.6 - depthF * 0.6, 0.0, 1.0);
      float lv = clamp((vx.w - 1400.0) / 2600.0, 0.0, 1.0);                  // kaukaiset vaaleampia ja sinisempiä
      vec3 top = mix(SALO * 0.95, SALO * 1.9, lv) * (0.8 + 0.5 * G);
      vec3 body = mix(fogBase * 0.80, top, pow(1.0 - depthF, 0.7)) * (0.94 + 0.12 * vnoise(vec2(xl * 31.0, dy * 61.0)));
      col = mix(col, body, smoothstep(0.003, -0.003, ab) * alpha);
      cov = max(cov, smoothstep(0.003, -0.003, ab) * alpha);
      col += HALLA * gi * 0.32 * exp(-pow(ab / 0.0035, 2.0));
    }
    // puuska peittää vaarat ja valon viivan: lumi ja usva horisontin kohdalla
    col = mix(col, fogBase * 1.15 + SNOWC * 0.05, uVeil * 0.55 * exp(-abs(dy - 0.06) / 0.20));
  }
  // laskeutuminen (vedos 6): kun kamera on latvojen tasolla, myös ylöspäin menevät säteet voivat osua kruunuihin: kruunukentän omat latvat nousevat kameran ohi
  bool upr = dy > -0.0004;
  if (!upr || uEnd > 0.0) {
    // ----- metsä: säde kamerasta latvuston pintaan -----
    vec3 col0 = col;
    float tstart = max((uCamH - uTop) / max(-rd.y, 1e-4), 2.0);
    float t = tstart, tp = t;
    bool hit = false;
    float cidH = 0.5, crelH = 0.0;
    for (int i = 0; i < 260; i++) {
      if (t > 3400.0) break;
      vec3 q = ro + rd * t;
      if (upr && q.y > uTop) break;
      float lod = smoothstep(1100.0, 2700.0, t), det = 1.0 - smoothstep(110.0, 300.0, t);
      float c1, c2; float dh = q.y - canopyH(q.xz, det, lod, c1, c2);
      if (dh < 0.03) { hit = true; break; }
      tp = t; t += max(0.25 + t * 0.003, dh * 0.30) * (1.0 + min(t, 800.0) * 0.004);
    }
    if (!upr) col = fogBase;
    if (hit) {
      float lod = smoothstep(1100.0, 2700.0, t), det = 1.0 - smoothstep(110.0, 300.0, t);
      for (int i = 0; i < 6; i++) { float tm = 0.5 * (tp + t); vec3 q = ro + rd * tm; float c1, c2; if (q.y - canopyH(q.xz, det, lod, c1, c2) < 0.03) t = tm; else tp = tm; }
      vec3 q = ro + rd * t;
      thit = t;
      float h0 = canopyH(q.xz, det, lod, cidH, crelH);
      float E = terr(q.xz);
      float e = 0.20 + t * 0.0016;
      vec3 n = normalize(vec3(canopyQ(q.xz - vec2(e, 0.0), det, lod) - canopyQ(q.xz + vec2(e, 0.0), det, lod), 2.0 * e, canopyQ(q.xz - vec2(0.0, e), det, lod) - canopyQ(q.xz + vec2(0.0, e), det, lod)));
      float hab = h0 - E;                                                    // korkeus maasta
      float dk = jouAt(t / 450.0);                                           // jouset: tummuus ja terävyys kulkevat lähimmistä latvoista kauemmas
      float fk = frAt(t / 450.0);                                            // fraasi: tumma aalto läheltä kauas
      float az = 1.0;
      vec3 L = normalize(vec3(sin(az) * cos(uElev), sin(uElev), cos(az) * cos(uElev)));
      float sh = 1.0;
      if (t < 700.0) { float s = 0.9; for (int i = 0; i < 9; i++) { vec3 ql = q + vec3(0.0, 0.05, 0.0) + L * s;
          float c1, c2; sh = min(sh, clamp((ql.y - canopyH(ql.xz, 0.0, smoothstep(400.0, 700.0, t), c1, c2)) / (0.16 * s) + 0.5, 0.0, 1.0)); s *= 1.85; } }
      float rr = 3.2 + 0.01 * t;
      float ring4 = 0.25 * (canopyQ(q.xz + vec2(rr, 0.0), det, lod) + canopyQ(q.xz - vec2(rr, 0.0), det, lod) + canopyQ(q.xz + vec2(0.0, rr), det, lod) + canopyQ(q.xz - vec2(0.0, rr), det, lod));
      float ao = clamp(0.62 + 0.42 * (h0 - ring4) / 7.0, 0.20, 1.0);
      float tree = smoothstep(0.4, 2.0, hab);
      float tread = smoothstep(0.30, 0.72, n.y);
      float snowAmt = mix(1.0, clamp(0.18 + 0.55 * tread + 0.65 * smoothstep(0.50, 0.92, crelH) * (0.7 + 0.3 * vnoise(q.xz * 0.35 + 3.0)), 0.0, 1.0) * (0.70 + 0.30 * fract(cidH * 37.0)), tree);
      float farK = smoothstep(420.0, 900.0, t);
      float densF = smoothstep(0.16, 0.48, vnoise(q.xz * 0.0085 + 3.0));
      snowAmt = mix(snowAmt, mix(1.0, 0.30 + 0.25 * vnoise(q.xz * 0.05), densF), farK);
      float nearK = 1.0 - smoothstep(120.0, 700.0, t);                       // vedos 7 (2): ilmaperspektiivi: lähin kuusirivi tumma (vähemmän lunta pinnoilla), kaukainen vaalea
      vec3 alb = mix(NEEDLE, SNOWA, clamp(snowAmt * (1.0 - 0.30 * dk) * (1.0 - 0.60 * nearK), 0.0, 1.0)) * (1.0 - 0.15 * dk) * (1.0 - 0.35 * nearK);
      float dif = max(dot(n, L), 0.0) * sh;
      float rim = pow(1.0 - max(dot(n, -rd), 0.0), 3.0) * max(dot(normalize(rd.xz), normalize(L.xz)), 0.0);
      float pool = 0.55 + 0.95 * smoothstep(0.30, 0.75, vnoise(q.xz * 0.011 + 5.0));
      float lint = uLint * pool * (1.0 - 0.30 * dk);
      vec3 lightc = HALLA * lint * (0.45 * dif + 1.0 * rim * (0.35 + 0.65 * sh) + 0.25 * pow(n.y, 1.6) * (0.4 + 0.6 * sh)) * (0.55 + 0.45 * smoothstep(0.0, 14.0, hab));
      lightc += HALLA * (dk * 0.045 + fk * 0.055) * rim * (0.4 + 0.6 * sh);    // jouset: latvojen kärjet saavat ohuen reunan
      // painon valo maassa: aukoissa ja tyvellä; patarummun ja basson alut kulkevat kehänä
      float low = uLow * (0.5 + 0.5 * (1.0 - smoothstep(0.0, 9.0, hab))) * (1.0 - 0.4 * sh);
      float ring = 0.0;
      for (int i = 0; i < 6; i++) { vec4 pu = uPulse[i]; if (pu.y <= 0.0) continue;
        float rg = length(q.xz - vec2(uCamX, uCamZ + 35.0)) - pu.x * 110.0; ring += pu.y * smoothstep(0.0, 0.4, pu.x) * exp(-pu.x * 0.9) * exp(-rg * rg / 1500.0); }
      float gr = (1.0 - smoothstep(0.0, 10.0, hab)) * 0.8 + 0.2;
      vec3 c = alb * (AMB * uAmb * (0.45 + 0.75 * n.y) * ao + lightc * ao + HALLA * (0.30 * low + 0.20 * ring * gr) * (0.4 + 0.6 * n.y));
      // puuska pöllyttää lunta latvoista
      float plume = uGust * smoothstep(0.55, 0.95, crelH) * smoothstep(0.30, 0.75, vnoise(q.xz * vec2(0.20, 0.12) - vec2(uSnow.y * 1.4, 0.0) + uTime * 0.0));
      c += SNOWC * plume * 0.22 * (0.4 + 0.6 * n.y);
      // maan valo latvojen väleissä (patarumpujen paisutus): pehmeä, epätasainen, ei reunaa; lumi puiden alla hohtaa ja värisee
      float gd = smoothstep(50.0, 200.0, t) * (1.0 - smoothstep(260.0, 650.0, t));
      float gp = 0.30 + 0.70 * smoothstep(0.28, 0.72, vnoise(q.xz * 0.028 + vec2(uDrift * 0.0020, 5.0)));
      float gtw = 0.80 + 0.20 * sin(uTime * 3.3 + 8.0 * vnoise(q.xz * 0.045));
      c += HALLA * 0.70 * uGround * gp * gtw * (0.15 + 0.85 * gr * gr) * gd;
      // avauksen patarumpu: rengas kulkee maassa ulospäin latvojen välissä
      c += HALLA * 0.55 * ring * (0.25 + 0.75 * gr) * smoothstep(20.0, 90.0, t) * (1.0 - smoothstep(500.0, 1100.0, t));
      // usva: laikuttaista, ajelehtii; laaksoissa sakeampaa; jousten tullessa se väistyy
      float mistP = vnoise(q.xz * 0.0042 + vec2(uDrift * 0.0014, uDrift * 0.0006));
      float pm = 0.70 + 0.9 * mistP;
      float mistTop = 9.0 + 17.0 * vnoise(q.xz * 0.0055 + vec2(uDrift * 0.0013, 3.0 - uDrift * 0.0007));
      float mistF = smoothstep(mistTop + 2.0, mistTop - 10.0, q.y) * 0.72 * (1.0 - 0.55 * dk);
      float te = t < 250.0 ? t : 250.0 + (t - 250.0) * 0.28;                 // kaukametsä näkyy usvan läpi horisonttiin asti
      float fg = 1.0 - exp(-te / uFogL * pm * (1.0 + 1.5 * smoothstep(5.0, 0.5, E)) * (1.0 - 0.45 * dk));
      fg = 1.0 - (1.0 - fg) * (1.0 - mistF);
      float farC = smoothstep(250.0, 700.0, t) * (1.0 - smoothstep(2200.0, 3300.0, t));      // kaukametsän latvat erottuvat pienenä kuviona, eivät tasaisena kaistana
      c *= 1.0 + farC * (1.7 * (ao - 0.55) + 0.70 * (vnoise(q.xz * 0.06) - 0.5));
      c += HALLA * uGis * 0.030 * farC * smoothstep(0.35, 1.0, ao) * (0.5 + 0.5 * n.y);       // horisontin valo nostaa kaukaisten latvojen kärjet usvasta
      c = mix(c, c * (0.45 + 1.1 * ao), clamp(0.55 * dk, 0.0, 0.95));        // jouset: kontrasti kasvaa (terävyys)
      c = mix(c, c * (0.25 + 0.85 * ao), 0.70 * fk * smoothstep(0.0, -0.10, dy));   // fraasi: terävämpi; vedos 7 (3): vaikutus häipyy horisontilla, ei vaakarajaa
      vec3 fogT = fogBase * mix(1.0, 0.80 * distTex(p.x, dy), smoothstep(500.0, 2600.0, t));
      col = mix(c, fogT, fg);
      if (!upr) col = mix(col, fogBase * 0.80 * distTex(p.x, dy), smoothstep(-0.006, 0.0, dy));
    } else {
      col = upr ? col0 : fogBase * 0.80 * distTex(p.x, dy);
    }
  }
  // vedos 7 (3): fraasin tummuminen on koko kuvan yhteinen, pehmeä (uFr on kaikilla etäisyyksillä sama), ei vaakarajaa horisontilla
  col *= 1.0 - 0.50 * uFr[0];
  // lumi ilmassa
  for (int s = 0; s < 8; s++) { float zz = 1.5 + mod(float(s) * 5.5 - uSnow.w, 44.0); col += SNOWC * snowAt(s, zz, dx, dy) * (0.55 + 0.9 * (uGis + uLint * 0.3) * 0.5); }
  return col;
}

vec3 scene(vec2 p) {
  float asp = uRes.x / uRes.y;
  float dx = p.x - asp * 0.5, dy = p.y - uHor;
  float th, cov;
  vec3 col = world(p, asp, dx, dy, th, cov);
  // vaskien isku: leikkaus kasvaa horisonttiin kertyneestä hehkusta ylöspäin ja leikkaa metsän ja vaarojen takaa; leveä ja pehmeä, ei kyllästy;
  // lähimmät latvat jäävät sen eteen siluetteina
  {
    float cx0 = asp * 0.36 - uCamX * 0.00004;
    float w = 0.022 + 0.006 * vnoise(vec2(p.y * 8.0, 1.0));
    float d = abs(p.x - cx0);
    float Hc = 0.02 + 0.62 * uCut.z;
    float env = smoothstep(Hc, Hc - 0.22, dy);
    float m = smoothstep(0.0, 0.03, dy) * env * (1.0 - 0.92 * cov);   // vaarat ja kaukametsä peittävät leikkauksen
    col += LEIKKAUS * (uCut.x * (0.55 * exp(-d * d / (w * w)) + 0.28 * exp(-d / 0.07)) + uCut.y * (0.22 * exp(-d / 0.20) + 0.12 * exp(-d / 0.55))) * m;
  }
  // kulku metsän sisään: kruunukenttä tummuu ja usva nousee (ei piirrettyjä puita); viimeiset 1,5 s ristihäivytys rajakuvaan
  if (uEnd > 0.0) {
    float tau = uEnd, wt = smoothstep(0.0, 1.6, tau);
    col = mix(col, col * (1.0 - 0.38 * smoothstep(1.4, 3.1, tau)), wt);
  }
  return mix(col, rajakuva(p, 0, uTime), uEnter);
}
` + FS_LOPPU;

async function alusta() {
  const d = await lataa();
  d.vaadi('avaus_patarumpu', 'gis_pitka_aani_alku', 'jouset_tulevat', 'gis_paljastuu', 'siemen_toistuu', 'puhallinkuviot_alku', 'puhallinkuviot_loppu',
    'patarumpu_paisuu', 'vaskien_isku', 'tuulenpuuska', 'gis_pitka_aani_loppu', 'fraasi_ennen_taukoa', 'hiljaisuus_1_alku', 'hiljaisuus_1_loppu', 'fis_pitka_aani');
  const A = d.aika, FPS = d.FPS, NF = d.NF, TE = A.fis_pitka_aani;
  const VQ = new URLSearchParams(location.search).get('vain'), VAIN = VQ === null ? -1 : Number(VQ), VFIX = new URLSearchParams(location.search).get('kiintea') !== null;   // mittausta varten
  const ka = (s, t, w) => d.ka(s, t * FPS, w * FPS);

  // ----- kamera: tasainen ajo eteen ja viistoon; laskeutuminen latvojen väliin vasta hiljaisuuden aikana -----
  const V = 9.0, VXK = 0.25;                                              // vauhti eteen (m/s) ja viistoon (osuus)
  const H0 = 50, HLOW = 7;                                                 // kameran korkeus maasta (m), lasku latvojen väliin: kuten vedoksessa 6
  const HYLA = 100;                                                // vedos 7 (2): ajo latvaston yläpuolella kuten lopussa (11_12: 58-82 m); lähin kuusirivi kauas kamerasta
  const TDESC = A.hiljaisuus_1_alku, TDEND = TE - 0.15;                    // vedos 6: laskeutuminen koko tauon ajan (hiljaisuus_1_alku -> rajakuva), tasaisesti
  const kZ = d.sarja(() => V / FPS);
  const camZ = (t) => d.kohta(kZ, t), camX = (t) => VXK * camZ(t);
  const camH = (t) => { const k = clamp((t - TDESC) / (TDEND - TDESC), 0, 1); return lerp(H0, HLOW, 0.6 * k + 0.4 * smooth(k)) + (HYLA - H0) * (1 - sstep(0.0, 0.5, k)); };   // vedoksen 6 laskeutuminen; ylimääräinen korkeus (HYLA - H0) tasoittuu pois laskeutumisen alkupuoliskolla

  // ----- jouset: ankkureista (käyttäjän kuulemat); voima mitataan äänestä -----
  const sJou = d.sarja((f) => { const pv = f / FPS < A.fis_pitka_aani ? 68 : 66; let mx = 0; for (let mi = 48; mi <= 79; mi++) if (Math.abs(mi - pv) > 1) mx = Math.max(mx, d.taso(mi, f)); return mx; });
  const JOUSET = [[A.jouset_tulevat, A.gis_paljastuu], [A.siemen_toistuu, A.puhallinkuviot_alku], [A.tuulenpuuska, A.hiljaisuus_1_alku]];
  const hilj = (t) => sstep(A.hiljaisuus_1_alku, A.hiljaisuus_1_alku + 0.6, t) * (1 - sstep(A.hiljaisuus_1_loppu, A.hiljaisuus_1_loppu + 1.5, t));
  // jousten voima lähimmässä latvustossa; kaukaisempi (s 0..1) saa tulon viiveellä ja lopun etuajassa: tummuus kulkee lähimmistä kauemmas,
  // usvaan väistyminen alkaa kaukaa
  const VY = 1.6;
  const fraasi = (t) => 0.30 + 0.70 * sstep(A.fraasi_ennen_taukoa - 0.6, A.fraasi_ennen_taukoa + 2.6, t);   // puuskan jälkeen jouset vaimeammin, fraasissa taas täysin
  const jouInt = (t) => (t < 0 ? 0 : 0.25 + 0.75 * sstep(0.40, 0.85, ka(sJou, t, 0.35)));
  const jouD = (t, dOn, dOff) => { let m = 0;
    JOUSET.forEach(([a, b], k) => { const on = sstep(a - 0.05, a + 0.3, t - dOn), off = 1 - sstep(b - 0.1 + dOff, b + 0.9 + dOff, t);
      m = Math.max(m, on * off * (k === 2 ? fraasi(t) : 1)); });
    return m * jouInt(t - dOn) * (1 - hilj(t)); };
  const jouS = (t, s) => jouD(t, VY * s, VY * (1 - s));                        // lähin: tulo heti, lähtö viiveellä; kaukaisin: tulo viiveellä, lähtö heti
  const jou = (t) => jouD(t, 0, 0);                                           // nimellinen: horisontin valo ja puiden liike seuraavat ankkureita

  // ----- gis: horisontin valo; paisutukset paljastavat vaaroja -----
  const sGis = d.sarja((f) => d.taso(68, f));
  const gisAct = (t) => sstep(A.gis_pitka_aani_alku - 0.3, A.gis_pitka_aani_alku + 1.0, t) * (1 - sstep(A.gis_pitka_aani_loppu - 0.2, A.gis_pitka_aani_loppu + 0.8, t));
  const gisRaw = (t) => clamp(ka(sGis, t, 1.0) / 0.8, 0, 1.15);
  // puuska (vedos 6, rivi 61): jousten kuvio tihenee ja voimistuu tuulenpuuskasta (0:45,4) noin 0:52 asti (cresc. molto fff) ja laantuu fraasiin 0:54.
  // Voima = mitattu ylärekisterin + keskirekisterin taso ja äänten alkujen tiheys (d.cues.alut.keski + korkea), normalisoituna jaksolla; sulavasti, ei portaita.
  const PT0 = A.tuulenpuuska, PT1 = (d.cues.cues.find((c) => c.id === 'tuulenpuuska') || {}).t_end || PT0 + 6.6;
  const sKK = d.sarja((f) => d.huippu(48, 100, f));
  const ALKU_KK = [].concat(d.cues.alut.keski, d.cues.alut.korkea).map((x) => x[0]).sort((a, b) => a - b);
  const tiheys = (t) => { let n = 0; for (const x of ALKU_KK) { if (x > t + 0.75) break; if (x >= t - 0.75) n++; } return n / 1.5; };   // alkuja sekunnissa
  const kkTaso = (t) => ka(sKK, t, 0.6);
  let KKMAX = 1e-6, TIHMAX = 1e-6;
  for (let f = Math.round(PT0 * FPS); f <= Math.round(PT1 * FPS); f++) { KKMAX = Math.max(KKMAX, kkTaso(f / FPS)); TIHMAX = Math.max(TIHMAX, tiheys(f / FPS)); }
  const sMit = d.sarja((f) => { const t = f / FPS; return t < PT0 - 3 || t > PT1 + 3 ? 0 : clamp(0.5 * kkTaso(t) / KKMAX + 0.5 * tiheys(t) / TIHMAX, 0, 1); });
  const puuska = (t) => { if (t < PT0) return 0;
    const kasvu = clamp(0.30 + 0.70 * (0.6 * sstep(PT0, PT1, t) + 0.4 * ka(sMit, t, 0.5) / 0.85), 0, 1);       // tasoittuva kasvu huippuun
    const lasku = 1 - 0.70 * sstep(PT1 + 0.2, A.fraasi_ennen_taukoa, t);                                         // laantuu fraasiin
    return sstep(PT0, PT0 + 1.0, t) * kasvu * lasku * Math.exp(-Math.max(t - A.fraasi_ennen_taukoa, 0) / 4); };
  // paisutuksen huiput: gis-tason paikalliset maksimit 0,35 s tasoitettuna jaksossa puhallinkuviot_alku -> gis_pitka_aani_loppu
  const PUHT = (() => {
    const f0 = Math.round(A.puhallinkuviot_alku * FPS), f1 = Math.round(A.gis_pitka_aani_loppu * FPS), W = Math.round(0.5 * FPS);
    const sm = (f) => d.ka(sGis, f, 10);
    const pk = []; for (let f = f0; f < f1; f++) { const v = sm(f); let ok = true; for (let g = f - W; g <= f + W; g++) if (g !== f && sm(g) > v + 1e-9) { ok = false; break; } if (ok) pk.push({ f, v }); }
    const out = []; for (const p of pk) { const l = out[out.length - 1]; if (l && p.f - l.f < Math.round(1.1 * FPS)) { if (p.v > l.v) out[out.length - 1] = p; } else out.push(p); }
    return out.map((p) => p.f / FPS);
  })();
  const NP = PUHT.length;
  if (NP < 6) throw new Error('paisutuksia liian vähän: ' + NP);
  const TP = PUHT.slice(-(NV + 1));                                         // viimeiset kaksitoista: viimeinen on Tapion talo
  // vaarojen paikat ja koot: siemenestä (deterministinen); korkeus paisutuksen aikana soivan kulun ylimmästä sävelestä
  const asp = 16 / 9, xd = asp * 0.64;
  const LVL = [1, 0, 2, 1, 2, 0, 1, 2, 0, 2, 1];
  const hs = (n, k) => fract(Math.sin(n * 12.9898 + k * 78.233) * 43758.5453);
  const ylin = (tp) => { let m = 0; for (const n of d.nuotit) { if (n[0] > tp + 0.6) break; if (n[0] + n[1] < tp - 1.4 || n[1] < 0.3) continue; if (n[2] >= 69 && n[2] <= 84) m = Math.max(m, n[2]); } return m || 76; };
  const DL = [1100, 1650, 4200];                                                    // vaaran etäisyys maailmassa (m) tason mukaan (lähin tuotu lähemmäs)
  const VXV = 12;                                                                    // vaarojen sivuttaisliike (m/s): lähin taso liukuu 15-25 px/s, keskimmäinen 8-12, kaukaisin 2-5
  const XK = [0.6, 0.8, 1.0];                                                        // tason x:n tiivistys keskustaa kohti (laitaan jäävä ei liu'u ulos)
  const vprof = (xl, w, sd) => { const kl = sd > 0.5 ? 1.0 : 0.42, kr = sd > 0.5 ? 0.42 : 1.0;
    const k = lerp(kl, kr, sstep(-0.15 * w, 0.15 * w, xl));
    return (Math.exp(-((xl / (w * k)) ** 2)) + 0.55 * Math.exp(-(((xl - 0.9 * w * (0.4 + sd)) / (0.55 * w)) ** 2)) + 0.4 * Math.exp(-(((xl + 1.2 * w) / (0.7 * w)) ** 2))) / 1.25; };
  // puupuhaltimien kulku: harjalla jokainen sävel on askel (valon kohta siirtyy säveleen mukaan); korkeampi sävel = kauempana oikealla
  const askeleet = (tp, w) => { const L = [];
    for (const n of d.nuotit) { if (n[0] > tp + 1.4) break; if (n[0] < tp - 1.4 || n[1] < 0.12 || n[2] < 69 || n[2] > 90) continue;
      const pos = (clamp((n[2] - 69) / 18, 0, 1) * 2.6 - 1.3) * w; const l = L[L.length - 1];
      if (l && n[0] - l.a < 0.08) { if (pos > l.pos) l.pos = pos; } else L.push({ a: n[0], pos }); }
    return L; };
  // vedos 6 lisäkorjaus: paljastus on etäisyysjärjestys. i. paisutus paljastaa i. lähimmän vaaran; kukin uusi on edellisten takana ja korkeammalla
  // (harjan korkeus kuvassa kasvaa etäisyyden mukana, ilmaperspektiivi: kauempi vaaleampi ja sinisempi, shaderin `lv`); Tapion talo kaukaisin ja viimeinen
  const NVV = TP.length - 1, DNEAR = 1100, DFAR = 4200, TREF = TP[TP.length - 1];
  const VAARAT = (() => {
    const out = []; let edTop = 0;
    TP.slice(0, NVV).forEach((tp, i) => {
      const r = i / Math.max(NVV - 1, 1), lv = r < 0.34 ? 0 : r < 0.67 ? 1 : 2;
      let x = asp * (0.10 + 0.80 * fract(0.618034 * (i + 1) + 0.21 + 0.1 * hs(i, 1))); const x0 = x;
      const m = ylin(tp), D = DNEAR + (DFAR - DNEAR) * Math.pow(r, 0.85);
      x = asp / 2 + (x - asp / 2) * XK[lv];
      const w = asp * (0.15 + 0.17 * hs(i, 2)) * (1 + 0.12 * lv);
      const kauas = Math.abs(x0 - xd), sc = D / Math.max(D - camZ(TREF), 60);
      // korkeus kuvassa: kasvaa etäisyyden mukana; soittajan kulku antaa +-10 % (ylin sävel)
      const base = (0.050 + 0.062 * r) * (0.90 + 0.20 * clamp((m - 69) / 15, 0, 1)) * (0.85 + 0.15 * hs(i, 3)) * (0.75 + 0.25 * sstep(0.2, 0.7, kauas));
      const top = Math.max(base, edTop + 0.011); edTop = top;
      out.push({ tp, x, w, A: top / sc, lv, m, D, st: askeleet(tp, w) });
    });
    return out.sort((a, b) => b.D - a.D);                                              // piirtojärjestys: kaukaisin ensin
  })();
  const TH = TP[TP.length - 1];                                                                  // Tapion talo: viimeinen paisutus
  const stH = askeleet(TH, 0.30);
  // vaaran näkyvyys: pehmeä tulo 1,4 s (10 -> 90 %), sitten vajoaminen aikavakiolla 8 s lattiaan 0,35; harjan valo: nousu paisutuksen mukaan, hiipuu noin 3 s
  const FLOOR = 0.35;
  // maamassa tulee näkyviin ensin (10 -> 90 % 1,4 s), harjan valo noin 0,3 s myöhemmin ja hitaammin (10 -> 90 % 1,2 s), laskee puoleen 2,8 s:ssa
  // vedos 6: tulo 6 s (tp-2,2 -> tp+3,8), ei ruutujen muutosta yli 1,5 %; vajoaminen hitaasti lattiaan
  const VIS0 = 2.2, VIS1 = 3.8;
  // vedos 7 (4): ensimmäisen (lähimmän) vaaran tulo 10 s, jotta näkyvyys nollasta täyteen kestää vähintään 5 s (varjostin pakkaa alphan 1,6-kertaiseksi); muut ennallaan
  const vis = (tp, t) => { const e = tp === TP[0], v0 = e ? 3.5 : VIS0, v1 = e ? 6.5 : VIS1; return sstep(tp - v0, tp + v1, t) * (FLOOR + (1 - FLOOR) * Math.exp(-Math.max(t - (tp + v1), 0) / 10)); };
  const BUMPK = 0.40;                                                  // vedos 6: harjan valo enintään 40 % entisestä huipusta, nousu 3 s, ei välähdystä
  const bump = (tp, t) => BUMPK * sstep(tp - 2.4, tp + 0.6, t) * Math.exp(-Math.max(t - (tp + 0.6), 0) / 4.0);
  // harjan valo etenee kulun sävelten mukaan askelittain: jokainen sävel sytyttää pisteen harjalle ja jättää hiipuvan jäljen (neljä viimeistä)
  const spot = (st, tp, w, t) => {
    const P = [0, 0, 0, 0], W = [0, 0, 0, 0];
    if (st.length < 2) { P[0] = w * (-1.4 + 2.8 * sstep(tp - 1.2, tp + 1.4, t)); W[0] = 1; return { P, W }; }
    const L = [{ a: tp - 1.5, pos: -1.3 * w }].concat(st).filter((e) => e.a - 0.04 <= t).slice(-4).reverse();
    L.forEach((e, k) => { P[k] = e.pos; W[k] = sstep(e.a - 0.04, e.a + 0.50, t) * Math.exp(-Math.max(t - e.a, 0) / 2.0); });
    return { P, W }; };

  // ----- tuuli: jousten voima ja puuska, tasoitettuna (vähintään 1,2 s) -----
  const jouSlow = (t) => ka(sJouSlow, t, 1.2);
  const sJouSlow = d.sarja((f) => jou(f / FPS));
  // fraasin puuska (0:54): jousten tumma aalto ja sen mukana tuuli: taipuma säännön rajoissa (enintään 4 %), lumi pöllähtää latvoista
  const FR0 = A.fraasi_ennen_taukoa;
  const frGust = (t) => sstep(FR0 - 0.2, FR0 + 0.6, t) * Math.exp(-Math.max(t - FR0 - 0.6, 0) / 2.2) * (1 - sstep(A.hiljaisuus_1_alku - 0.2, A.hiljaisuus_1_alku + 0.3, t));
  const frS = (t, s) => sstep(FR0 - 0.6, FR0 + 3.4, t) * (1 - sstep(A.hiljaisuus_1_alku - 0.2, A.hiljaisuus_1_alku + 0.9, t));
  const swayAmp = (t) => clamp(0.30 + 0.25 * jouSlow(t) + 0.20 * ka(sPuuska, t, 1.5), 0.25, 0.80) * (1 - 0.5 * hilj(t));   // vedos 7: ei suoraan puuskasta eikä fraasin puuskasta; latva enintään noin 1,5 % korkeudesta
  const sFrG = d.sarja((f) => frGust(f / FPS));
  const sPuuska = d.sarja((f) => puuska(f / FPS));

  // ----- äkilliset dynamiikan muutokset (vähintään 8 dB alle 0,3 s): valo ja lumi vastaavat samassa ruudussa -----
  const lev = await (async () => { const buf = new Float32Array(await (await fetch('/' + d.cues.ohjaus.tiedosto)).arrayBuffer()); const nc = d.cues.ohjaus.channels.length;
    const a = new Float32Array(NF); for (let f = 0; f < NF; f++) a[f] = buf[f * nc]; return a; })();
  const HYPYT = (() => { const o = []; const f0 = Math.round((A.avaus_patarumpu - 0.3) * FPS), f1 = Math.round(A.hiljaisuus_1_alku * FPS);
    for (let f = f0; f < f1; f++) { const dd = lev[f] - lev[f - 9]; if (dd >= 8 && lev[f - 9] > -80) { const t = f / FPS; const l = o[o.length - 1];
      if (Math.abs(t - A.vaskien_isku) < 0.8 || Math.abs(t - A.tuulenpuuska) < 0.8) continue;
      if (l && t - l.t < 1.0) { l.v = Math.max(l.v, clamp((dd - 8) / 14 + 0.4, 0.4, 1)); } else o.push({ t, v: clamp((dd - 8) / 14 + 0.4, 0.4, 1) }); } }
    return o; })();
  const hyppy = (t) => { let s = 0; for (const h of HYPYT) { const k = t - h.t; if (k < 0 || k > 4) continue; s += h.v * sstep(0, 0.6, k) * Math.exp(-k / 0.8); } return Math.min(s, 1.2); };
  const sHyppy = d.sarja((f) => hyppy(f / FPS));

  // ----- patarummun ja basson alut: kehä maassa -----
  const PULSSIT = d.alut.filter((a) => a.t >= A.avaus_patarumpu - 0.3 && a.t <= A.hiljaisuus_1_alku);
  const paisu = (t) => sstep(A.patarumpu_paisuu, A.patarumpu_paisuu + 3.0, t) * (1 - sstep(A.vaskien_isku, A.vaskien_isku + 4.0, t));   // hiipuu iskun jälkeen noin 4 s

  // ----- horisontin kummut (Tapion talon vaara): sama kiinteä profiili kuin lopussa -----
  const k0 = A.jouset_tulevat - 0.3, k1 = A.hiljaisuus_1_alku;
  const kaari1 = []; for (let i = 0; i < 32; i++) kaari1.push(clamp((d.melodia(k0 + (i / 31) * (k1 - k0), 2.6) - 68) * 0.0050, -0.05, 0.075));

  // ----- lumi: sataa ja ajelehtii aina; nopeus ja suunta äänen voimasta kertymänä -----
  const sEner = d.sarja((f) => d.koko(f / FPS, 1.2));
  const ener = (t) => ka(sEner, t, 0.5);
  const kPut = d.sarja((f) => (0.75 + 0.9 * ener(f / FPS)) / FPS);
  const kTuuli = d.sarja((f) => (0.30 + 1.2 * jouSlow(f / FPS) + 3.0 * puuska(f / FPS) + 2.5 * ka(sFrG, f / FPS, 0.3) + 2.0 * ka(sHyppy, f / FPS, 0.1)) * (1 - hilj(f / FPS)) / FPS);   // tauolla lumi putoaa suoraan alas
  const kLahe = d.sarja((f) => (V + 5 * puuska(f / FPS)) / FPS);
  const kDrift = d.sarja((f) => (1.0 + 3.0 * paisu(f / FPS) + 6.0 * puuska(f / FPS)) / FPS);

  function tila(t) {
    const f = t * FPS, hil = hilj(t), j = jou(t), pu = puuska(t), hy = hyppy(t);
    const act = gisAct(t);
    const lineB = act * Math.max(gisRaw(t), 0.30);
    const lineRaw = lineB * (0.20 + 0.80 * (1 - j));                         // jouset edessä: horisontin valo himmeänä metsän takana
    const G = lineRaw * (1 - 0.88 * clamp(pu * 1.1, 0, 1)) * (1 - hil);
    const ti = t - A.vaskien_isku;
    // leikkaus kasvaa horisontin hehkusta ylöspäin 0,15 s ja on huipussaan iskun ruudussa; pehmeä jälkihohto
    const ris = clamp((t - (A.vaskien_isku - 0.15)) / 0.15, 0, 1);
    const cut = ti < 0 ? [0.75 * ris, 0, ris] : [0.75 * Math.exp(-ti / 0.45), 0.55 * (1 - Math.exp(-ti / 0.6)) * Math.exp(-ti / 1.3), 1];
    const frk = frS(t, 0.15);                                               // fraasin aikana basson maan valo ja hyppy eivät vaalenna metsää
    const lint = (0.30 + 0.12 * G + 0.10 * hy * (1 - 0.8 * frk) + 0.05 * cut[1]) * (1 - hil) + 0.26 * hil;
    const low = clamp(Math.max(d.matala(t, 0.5) * 1.2, 0.20 * paisu(t)), 0, 1) * (1 - 0.7 * hil) * (1 - 0.6 * frk) * (1 + 0.10 * paisu(t) * Math.sin(t * 5.0));
    const veil = clamp(pu * 1.15, 0, 1);
    const sway = swayAmp(t);
    const live = []; for (let k = 0; k < 8; k++) live.push(jouS(t, k / 7));
    const fr = []; for (let k = 0; k < 8; k++) fr.push(frS(t, k / 7));
    const fg = frGust(t);
    const pulssit = PULSSIT.filter((x) => x.t <= t && t - x.t < 4).slice(-6).map((x) => [t - x.t, x.v, 0, 0]);
    // vaarat
    const vx = [], vt = [], vP = [], vW = [];
    VAARAT.forEach((v, i) => { const b = bump(v.tp, t); const sp = spot(v.st, v.tp, v.w, t); const on = VAIN < 0 || VAIN === i ? 1 : 0;   // ?vain=i: yksi vaara erillään (mittausta varten)
      vx.push(v.x, v.w, v.A, v.D); vt.push(on * (VFIX ? 1 : vis(v.tp, t)) * (1 - 0.8 * veil), VFIX ? 0 : on * b * (1 - veil) * (1 - hil), 0, camZ(v.tp)); vP.push(...sp.P); vW.push(...sp.W); });
    const hOn = VAIN < 0 ? 1 : 0;
    const hVis = hOn * vis(TH, t) * (1 - 0.8 * veil), hGl = hOn * bump(TH, t) * (1 - veil) * (1 - hil); const hs0 = spot(stH, TH, 0.30, t);
    const win = clamp(0.15 + 0.85 * clamp(gisRaw(Math.max(t - 1.0, 0)) * act * (1 - j), 0, 1), 0, 1) * (1 - 0.8 * veil) * (1 - hil);
    return { f, hil, j, pu, G, lineRaw, cut, lint, low, veil, sway, live, fr, fg, pulssit, vx, vt, vP, vW, hVis, hGl, hs0, win, hy };
  }

  const { gl, U, piirra } = luoGL(FS);
  const entry = (t) => sstep(TE - 1.5, TE - 0.04, t);                       // ristihäivytys rajakuvaan viimeisen 1,5 s aikana (rajakuvan oma kohinarakenne näkyy jo häivytyksessä)
  julkaise({
    gl, aika: A,
    kamera: (t) => ({ p: [camX(t), camH(t), camZ(t)], q: [0, 0, 0, 1], shot: 'matka', cut: 0, trans: false }),
    kuvaus: (t) => { const s = tila(t);
      const gl2 = s.vt.filter((x, i) => i % 4 === 1 && x > 0.05).length + (s.hGl > 0.05 ? 1 : 0);
      const nakyvia = s.vt.filter((x, i) => i % 4 === 0 && x > 0.05).length + (s.hVis > 0.05 ? 1 : 0);
      return { kamera: { korkeus: +camH(t).toFixed(1), z: +camZ(t).toFixed(1) }, jouset: +s.j.toFixed(2), kerrokset: s.live.map((x) => +x.toFixed(2)), horisontinValo: +s.G.toFixed(2), puuska: +s.pu.toFixed(2),
        tuuli: +s.sway.toFixed(2), vaaroja_nakyvissa: nakyvia, vaaroja_kirkastuu: gl2, hyppy: +s.hy.toFixed(2), fraasi: s.fr.map((x) => +x.toFixed(2)), fraasiPuuska: +s.fg.toFixed(2), lint: +s.lint.toFixed(2), maa: +s.low.toFixed(2), hiljaisuus: +s.hil.toFixed(2), rajakuva: +entry(t).toFixed(2) }; },
    seek: (t) => {
      const s = tila(t);
      const pu = new Float32Array(24); s.pulssit.forEach((x, i) => pu.set(x, i * 4));
      gl.uniform1f(U('uTime'), t); gl.uniform1f(U('uCamX'), camX(t)); gl.uniform1f(U('uCamZ'), camZ(t)); gl.uniform1f(U('uCamH'), camH(t)); gl.uniform1f(U('uHor'), 0.60);
      gl.uniform1f(U('uGis'), s.G); gl.uniform1f(U('uVeil'), s.veil); gl.uniform1f(U('uGust'), Math.max(clamp(s.pu * 1.4, 0, 1), 0.35 * s.fg)); gl.uniform1f(U('uLint'), s.lint); gl.uniform1f(U('uLow'), s.low);
      gl.uniform1f(U('uFogL'), 900); gl.uniform1f(U('uElev'), 0.17); gl.uniform1f(U('uSv'), 0.66); gl.uniform1f(U('uHB'), 0.035);
      gl.uniform1f(U('uBuild'), (t < A.vaskien_isku ? Math.pow(sstep(A.patarumpu_paisuu - 0.5, A.vaskien_isku - 0.02, t), 1.5) : Math.exp(-(t - A.vaskien_isku) / 0.15)) * (1 - 0.9 * s.veil));
      gl.uniform1f(U('uSway'), s.sway); gl.uniform1f(U('uEnter'), entry(t)); gl.uniform1f(U('uWin'), s.win);
      gl.uniform1f(U('uAmb'), 0.95); gl.uniform1f(U('uGround'), paisu(t) * (1 + 0.10 * Math.sin(t * 5.0)));
      gl.uniform1f(U('uHK'), 1.0); gl.uniform1f(U('uTK'), 0.6); gl.uniform1f(U('uTop'), 8.5 * 0.6 + 42 + 3);
      gl.uniform1f(U('uDrift'), d.kohta(kDrift, t));
      gl.uniform3f(U('uCut'), s.cut[0], s.cut[1], s.cut[2]);
      gl.uniform4f(U('uSnow'), 0.13 + 0.30 * clamp(s.pu * 2.5, 0, 1) + 0.10 * s.fg + 0.06 * s.hy + 0.05 * clamp(ener(t), 0, 1), d.kohta(kTuuli, t), d.kohta(kPut, t), d.kohta(kLahe, t));
      gl.uniform1fv(U('uHill'), new Float32Array(kaari1)); gl.uniform4fv(U('uPulse'), pu); gl.uniform1fv(U('uJ'), new Float32Array(s.live));
      gl.uniform4fv(U('uVx'), new Float32Array(s.vx)); gl.uniform4fv(U('uVt'), new Float32Array(s.vt));
      gl.uniform4f(U('uHouse'), s.hVis, s.hGl, 0, 0);
      gl.uniform4fv(U('uVP'), new Float32Array(s.vP)); gl.uniform4fv(U('uVW'), new Float32Array(s.vW));
      gl.uniform4f(U('uHP'), ...s.hs0.P); gl.uniform4f(U('uHW'), ...s.hs0.W);
      gl.uniform1fv(U('uFr'), new Float32Array(s.fr));
      gl.uniform1f(U('uCamXv'), VXV / V * camZ(t)); gl.uniform1f(U('uVK'), VXV / V); gl.uniform1f(U('uHSh'), -(3 / 1080) * (t - TH));
      gl.uniform1f(U('uEnd'), t > TDESC ? t - TDESC + 1e-3 : 0);
      piirra();
    },
  });
  window.vaaraKuva = (t, i) => { const v = VAARAT[i], Dz = Math.max(v.D - camZ(t), 60), sc = v.D / Dz, sR = v.D / Math.max(v.D - camZ(v.tp), 60);
    const cxs = asp * 0.5 + (v.x - asp * 0.5) * sc / sR - (VXV / V * (camZ(t) - camZ(v.tp))) * 1.07 / Dz; const r = 0.035 + sc * v.A * vprof(0, v.w, fract(v.x * 7.31));
    return { tp: v.tp, vis: vis(v.tp, t), valo: bump(v.tp, t), xKuva: cxs / asp, kasvu: sc, harjaY: 1 - (0.60 + r), D: v.D, w: v.w * sc / asp }; };
  window.vaarat = { TP, VAARAT: VAARAT.map((v) => ({ tp: +v.tp.toFixed(2), x: +v.x.toFixed(2), w: +v.w.toFixed(2), A: +v.A.toFixed(3), taso: v.lv, midi: v.m })), HYPYT: HYPYT.map((h) => +h.t.toFixed(2)), PUHT };
}
alusta().catch((e) => { console.error(e); window.sceneError = String(e.message || e); });
