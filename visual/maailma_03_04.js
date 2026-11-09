// Tapiola: maailmat 3 (Jokin kulkee edellä) ja 4 (Metsä kohoaa, maa katoaa), ankkurista fis_pitka_aani ankkuriin pohja_katoaa.
// Alku: rajakuva PIMEA_MASSA (kamera on metsän reunan oksamassassa). Loppu: rajakuva HUURRE (kamera on kiteessä).
// Suunnitelma: docs/kuvakasikirjoitus.md "Kaksitoista maailmaa" (3 ja 4); säännöt: docs/visuaalinen_tyyli.md luvut 1, 2, 5, 4d, 12.
//
// Maailma: vanha kuusimetsä talviyönä sisältä. Metsä on kerroksia: jokainen runko on oma syvyyskerroksensa (maailman koordinaateissa,
// kamera ajaa niiden ohi), runkojen ympärillä on tumma oksamassa, ja kerrosten välissä on usva, jonka valaisee kaukainen valo
// (teoksen pitkä ääni fis = sama horisontin valo kuin alussa, nyt metsän sisältä). Usva lasketaan kerros kerrokselta
// (säteenseuranta syvyyssuunnassa), joten valo siivilöityy runkojen ja oksien välistä juovina.
// - Ei mikään metsän osa liiku äänestä: rungot, oksat ja maa ovat maailman kiinteitä asioita; vain kamera liikkuu (tasaisesti).
// - Ääni ohjaa valoa: fis-valon voima ja korkeus (pitkä ääni, melodian kaari), jousten tummuus ja sointumaton hengitys,
//   D-duurin kelmeä välähdys, basson askeleet (valo lumessa, usvan väistyminen edessä, pilkka ikihongassa),
//   nousun hallan valo latvoissa ylhäältä.
// - Kamera: kulkee polkua eteen; laskeutuu lumen pintaan askelten alkaessa; maailmassa 4 kallistuu ylös (enintään 50 astetta,
//   huippunopeus alle 8 astetta sekunnissa) ja nousee; lopussa ajaa suuren petäjän huurteiseen oksaan ja kiteeseen.
// Kohtaus on puhdas aikafunktio seek(t): kaikki kertymät ja kameran reitti lasketaan alussa ruuduittain.
import { lataa, luoGL, julkaise, FS_ALKU, GLSL_YHTEINEN, FS_LOPPU, RAJA, clamp, smooth, sstep, fract } from './yhteinen.js';

const DZ = 2.4;          // kerrosten väli (m)
const ZF = 140.0;        // näkyvyys (m)
const LANE = 0.06;       // polun viistous (m sivuun per m eteen)
const PL = 11;           // ikihonkien väli kerroksina
const F = 1.07;          // polttoväli: sama kuin muissa maailmoissa

const FS = FS_ALKU + `
const float F = ${F.toFixed(3)}, DZ = ${DZ.toFixed(3)}, ZF = ${ZF.toFixed(1)}, ZN = 0.7, LANE = ${LANE.toFixed(4)};
const int PL = ${PL};
uniform float uTime, uT0, uT1, uZ0, uZ1;
uniform vec4 uCam;      // x, z, korkeus maasta, kallistus (rad)
uniform vec3 uL;        // valon suunta x, y; voima
uniform vec2 uGl;       // valon paikka kuvassa (dx, dy)
uniform vec4 uFx;       // jousten tummuus, hengitys, D-välähdys, usvan ajautuma
uniform vec4 uTop;      // ylhäältä tuleva valo: voima, rintaman korkeus, -, -
uniform vec4 uPulse[4]; // askel: ikä, voima, kameran z askeleen hetkellä
uniform vec4 uBl[6];    // pilkka: ikihongan numero, ikä, voima
uniform vec4 uEnd;      // kiteen x, z, korkeus maasta, suuren petäjän kerros
` + GLSL_YHTEINEN + `
const vec3 AMB = vec3(0.0075, 0.0135, 0.0255);        // sininen usva (salo)
const vec3 GLOWC = vec3(0.50, 0.64, 0.88);            // horisontin valo (halla)
const vec3 DLC = vec3(0.56, 0.70, 0.76);              // kelmeä, hämärä välähdys: ei keltainen, ei lämmin
const vec3 SNOWC = vec3(0.55, 0.62, 0.75);

float sstep(float a, float b, float x) { float k = clamp((x - a) / (b - a), 0.0, 1.0); return k * k * (3.0 - 2.0 * k); }
float laneX(float z) { return LANE * z + (2.2 * sin(0.045 * z + 0.6) + 0.9 * sin(0.11 * z + 2.0)) * (1.0 - sstep(uZ1 - 25.0, uZ1, z)); }
float gnd(float x, float z) { return 0.95 * (vnoise(vec2(x, z) * 0.042) - 0.5) + 0.30 * (vnoise(vec2(x, z) * 0.12 + 5.0) - 0.5); }

// valon juovat: valon suuntaisia, runkojen ja oksien rajaamia kaistoja (kaistan paikka on maailman kiinteä)
float shaftH(float wx, float yw, float zk) {
  float u = wx - zk * uL.x + uFx.w, v = yw - zk * uL.y;
  float a = vnoise(vec2(u * 0.36 + 1.3, v * 0.10 + 2.0));
  float b = vnoise(vec2(u * 1.25 + 9.0, v * 0.22 + zk * 0.02));
  return mix(0.16, 1.0, smoothstep(0.30, 0.68, 0.7 * a + 0.3 * b));
}
// ylhäältä tulevat valopilarit latvuston raoista
float shaftT(float wx, float yw, float zk) {
  float u = wx + 0.28 * yw + uFx.w * 0.6;
  float a = vnoise(vec2(u * 0.40 + 3.0, zk * 0.33 + 1.1));
  float b = vnoise(vec2(u * 1.7 + 5.0, zk * 0.9 + yw * 0.05));
  return smoothstep(0.50, 0.74, 0.75 * a + 0.25 * b);
}

float seg(vec2 q, vec2 a, vec2 b, float w0, float w1) { vec2 pa = q - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - mix(w0, w1, h); }
float tuft(vec2 q, vec2 c, vec2 r, float sd, out float ly) { vec2 d = (q - c) / r; ly = d.y; float an = atan(d.y, d.x);
  float n = vnoise(vec2(an * 2.5 + sd, sd)), n2 = vnoise(vec2(an * 11.0 + sd * 3.0, sd + 4.0));
  float under = smoothstep(0.1, -0.5, d.y);
  return (length(d) - (0.50 + 0.45 * n + (0.18 + 0.30 * under) * n2 - 0.12 * d.x)) * min(r.x, r.y); }

vec3 skyCol(vec3 rd, vec3 Lw, float ang) {
  vec3 c = mix(vec3(0.0050, 0.0085, 0.0160), vec3(0.0016, 0.0030, 0.0075), smoothstep(-0.05, 0.9, rd.y));
  vec2 q = vec2(atan(rd.x, rd.z), asin(clamp(rd.y, -1.0, 1.0))) / 0.011;
  vec2 ic = floor(q), fr = fract(q);
  float h = hash(ic + 3.7);
  if (h > 0.972) { vec2 c0 = 0.25 + 0.5 * vec2(hash(ic + 1.3), hash(ic + 8.1));
    c += vec3(0.5, 0.6, 0.8) * (0.15 + 0.5 * fract(h * 37.0)) * smoothstep(0.17, 0.03, length(fr - c0)); }
  float g = 1.1 * exp(-ang * 190.0) + 0.28 * exp(-ang * 24.0) + 0.05 * exp(-ang * 3.0)
          + 0.10 * exp(-abs(rd.y - Lw.y) * 9.0) * exp(-abs(rd.x - Lw.x) * 1.2);
  vec3 gcol = mix(GLOWC, DLC, uFx.z * 0.7);
  c += gcol * uL.z * (1.0 + 0.7 * uFx.z) * g;
  c += DLC * (uTop.x + 0.4 * uFx.z) * 0.030 * smoothstep(0.0, 0.9, rd.y);
  return c;
}

vec3 groundCol(vec3 gp, float zr, vec3 rd, vec3 Lw, float ang) {
  float e = 0.9;
  float hx = gnd(gp.x + e, gp.z) - gnd(gp.x - e, gp.z), hz = gnd(gp.x, gp.z + e) - gnd(gp.x, gp.z - e);
  vec3 n = normalize(vec3(-hx, 2.0 * e, -hz));
  float ndl = dot(n, Lw);
  float tex = vnoise(vec2(gp.x * 0.9, gp.z * 0.45)) * 0.6 + vnoise(vec2(gp.x * 3.1, gp.z * 1.4)) * 0.4;
  vec3 snow = vec3(0.0125, 0.0200, 0.0350) * (0.65 + 0.7 * tex);
  float u = gp.x - gp.z * Lw.x / Lw.z + uFx.w;
  float stripe = mix(0.10, 1.0, smoothstep(0.30, 0.60, 0.75 * vnoise(vec2(u * 0.55, gp.z * 0.006 + 3.0)) + 0.25 * vnoise(vec2(u * 2.4 + 8.0, gp.z * 0.02))));
  float graz = 1.0 - clamp(-rd.y * 5.0, 0.0, 1.0);
  vec3 gcol = mix(GLOWC, DLC, uFx.z * 0.7);
  float I = uL.z * (1.0 + 0.7 * uFx.z);
  vec3 lit = gcol * I * stripe * (0.028 * clamp(ndl * 3.0 + 0.5, 0.0, 1.0) + 0.20 * exp(-ang * 30.0) * graz);
  // askel: valo kulkee lumen pinnassa edellä
  for (int i = 0; i < 4; i++) { vec4 pu = uPulse[i]; if (pu.y <= 0.0) continue;
    float zc = pu.z + 3.0 + 9.0 * pu.x, xc = laneX(gp.z);
    float w = exp(-pu.x * 0.85) * pu.y;
    lit += GLOWC * w * 0.16 * exp(-pow((gp.z - zc) / (3.0 + 2.5 * pu.x), 2.0)) * exp(-pow((gp.x - xc) / 4.5, 2.0)); }
  // kummun selänne hohtaa valoa vasten
  lit += gcol * I * 0.06 * exp(-ang * 12.0) * smoothstep(0.0, -0.5, ndl - 0.2) * stripe;
  return snow + lit;
}

vec3 scene(vec2 p) {
  float asp = uRes.x / uRes.y;
  float dx = p.x - 0.5 * asp, dy = p.y - 0.5;
  float cph = cos(uCam.w), sph = sin(uCam.w);
  vec3 r = vec3(dx, dy * cph + F * sph, max(F * cph - dy * sph, 0.05));
  vec3 rd = normalize(r);
  vec3 Lw = normalize(vec3(uL.x, uL.y, 1.0));
  float ang = 1.0 - dot(rd, Lw);
  float gc = gnd(uCam.x, uCam.y);
  vec3 ro = vec3(uCam.x, gc + uCam.z, uCam.y);
  vec3 col = skyCol(rd, Lw, ang);
  vec3 gcol = mix(GLOWC, DLC, uFx.z * 0.7);
  float I = uL.z * (1.0 + 0.7 * uFx.z);

  // maa: korkeuskenttä, säteenseuranta syvyyden suhteen
  float sg = 1e5; bool hit = false;
  float slope = r.y / r.z;
  if (slope < 0.10) {
    float z = 0.5, zp = 0.5, fp = 1.0;
    for (int i = 0; i < 70; i++) {
      float f = ro.y + slope * z - gnd(ro.x + (r.x / r.z) * z, ro.z + z);
      if (f < 0.0) {
        float a = zp, b = z;
        for (int j = 0; j < 5; j++) { float m = 0.5 * (a + b); float fm = ro.y + slope * m - gnd(ro.x + (r.x / r.z) * m, ro.z + m); if (fm < 0.0) b = m; else a = m; }
        sg = 0.5 * (a + b); hit = true; break; }
      zp = z; z += max(0.2, 0.082 * z);
      if (z > ZF) break;
    }
    if (hit) { vec3 gp = ro + r * (sg / r.z); col = groundCol(gp, sg, rd, Lw, ang); }
  }

  float kf = floor((ro.z + ZF) / DZ);
  for (int i = 0; i < 64; i++) {
    float k = kf - float(i);
    float zk = k * DZ;
    float zr = zk - ro.z;
    bool special = abs(k - uEnd.w) < 0.5;
    if (zr < ZN && !special) break;
    if (zr < 0.004) break;
    if (hit && zr > sg) continue;
    float s = zr / r.z;
    float wx = ro.x + r.x * s, yw = ro.y + r.y * s;
    float ya = yw - gc;
    float pw = zr / (F * uRes.y) * 1.1;
    float lane = laneX(zk);
    float sgn = sign(uGl.x - dx);
    float farF = smoothstep(ZF, ZF - 20.0, zr);
    float clearL = smoothstep(0.6, 1.9, abs(wx - lane));       // polku: oksat eivät kasva sen yli

    // tavalliset rungot: kuusia, joiden ympärillä on tumma oksamassa
    float cs = 5.4;
    float cI = floor(wx / cs);
    for (int j = -1; j <= 1; j++) {
      float ci = cI + float(j);
      float h1 = hash(vec2(ci, k)), h2 = hash(vec2(ci + 7.3, k + 1.7)), h3 = hash(vec2(ci - 3.1, k + 5.9)), h4 = hash(vec2(ci + 2.2, k - 4.4));
      if (h1 > 0.86) continue;
      float tx = (ci + 0.10 + 0.80 * h2) * cs;
      float rr = 0.20 + 0.30 * h3 * h3 + 0.12 * h3;
      if (abs(tx - lane) < rr + 0.8) continue;
      float Hh = 17.0 + 8.0 * h4;
      if (abs(wx - tx) > rr + 3.6) continue;
      float gT = gnd(tx, zk);
      float hy = yw - gT;
      if (hy < -0.05) continue;
      float hn = hy / Hh;
      float lean = 0.45 * sin(hy * 0.065 + h2 * 6.28) * smoothstep(0.0, 10.0, hy)
        + (0.05 + 1.1 * uTop.z) * hn * hn * Hh * 0.05 * (sin(wx * 0.03 - uTime * 0.55 + k * 0.35 + h2 * 3.0) + 0.4 * sin(uTime * 1.3 + h3 * 20.0 + hy * 0.2));   // tuuli: latvat taipuvat, tyvi pysyy
      float dxn = wx - tx - lean;
      float rw = rr * (1.0 - 0.45 * clamp(hn, 0.0, 1.0)) * (1.0 + 0.6 * exp(-hy * 1.4)) * (0.93 + 0.14 * vnoise(vec2(hy * 0.25, h3 * 40.0)));
      float aT = smoothstep(pw, -pw, abs(dxn) - rw) * step(hy, Hh) * farF;
      // oksamassa: alta harva, päältä tiheä; hulmuavat riippuvat oksat, repaleinen reuna, raot
      float sk = smoothstep(0.20, 0.42, hn) * (1.0 - smoothstep(0.92, 1.02, hn));
      float tier = 0.50 + 0.95 * vnoise(vec2(hy * 0.50 + k * 3.1, k * 1.7 + ci));
      float Bw = (1.3 + 1.9 * h3) * pow(max(1.0 - hn * 0.80, 0.0), 0.7) * tier * (1.0 + 0.22 * uFx.x);
      float edgeF = abs(dxn) - rw - Bw * (1.0 + 0.35 * sign(dxn) * (h2 - 0.5) * 2.0) * sk;
      float rag = (vnoise(vec2(wx * 3.0 + k * 1.3, yw * 0.75)) - 0.5) * 1.1 + (vnoise(vec2(wx * 9.0, yw * 2.4 + k)) - 0.5) * 0.35;
      float aF = smoothstep(0.20, -0.20, edgeF + rag) * sk * farF;
      float holes = smoothstep(0.62, 0.82, vnoise(vec2(wx * 2.4 + k * 2.0, yw * 1.5 + 4.0)));
      aF *= (1.0 - (0.50 - 0.30 * uFx.x) * holes) * clearL;
      if (zr < 9.0) aF *= mix(1.0, smoothstep(0.9, 3.0, length(vec2(wx - ro.x, yw - ro.y))), 1.0 - smoothstep(4.0, 9.0, zr));
      // alarungon kuivat oksantynkät
      float aS = 0.0;
      if (zr < 30.0 && hy < 7.0) {
        for (int q = 0; q < 3; q++) { float fq = float(q);
          float hs = 1.2 + 2.2 * fq + 0.9 * hash(vec2(ci + fq, k + 3.3));
          float sdg = (hash(vec2(ci + fq * 5.0, k + 9.1)) > 0.5) ? 1.0 : -1.0;
          vec2 qa = vec2(tx + lean + sdg * rw * 0.8, gT + hs);
          float dtw = seg(vec2(wx, yw), qa, qa + vec2(sdg * (0.35 + 0.5 * hash(vec2(ci, k + fq))), -0.18), 0.012, 0.004);
          aS = max(aS, smoothstep(pw, -pw, dtw)); } }
      aS *= (1.0 - aF) * farF;
      if (aT + aF + aS <= 0.001) continue;
      float shl = shaftH(tx, yw, zk);
      float side = smoothstep(-0.15, 0.55, sgn * sign(dxn));
      float tl = uTop.x * sstep(uTop.y - 7.0, uTop.y, ya);
      float vt = fract(hy * 0.85 + h2 * 7.0 + 0.25 * vnoise(vec2(wx * 0.7, k)));
      float edgeM = clamp(4.0 * aF * (1.0 - aF), 0.0, 1.0);
      vec3 fol = HAMY * (0.5 + 0.9 * vnoise(vec2(wx * 1.1 + k, yw * 0.8)));
      fol += gcol * I * 0.09 * edgeM * side * shl * exp(-zr / 55.0);
      fol += DLC * tl * (0.04 + 0.16 * edgeM) * smoothstep(0.55, 1.0, vt) * (0.4 + 0.6 * shaftT(wx, yw, zk));
      col = mix(col, fol, aF);
      float u = clamp(dxn / rw, -1.0, 1.0);
      float strk = vnoise(vec2(u * 4.0 + h2 * 20.0, hy * 0.30 + k)) * 0.6 + vnoise(vec2(u * 11.0 + h3 * 9.0, hy * 0.9)) * 0.4;
      float rim = pow(abs(u), 6.0) * smoothstep(-0.15, 0.55, sgn * u);
      float snowB = smoothstep(0.30, 0.85, u * (h4 > 0.5 ? 1.0 : -1.0)) * smoothstep(0.35, 0.75, vnoise(vec2(hy * 0.8 + h2 * 10.0, h3 * 7.0))) * smoothstep(0.0, 0.7, hn);   // tuulen puolelle tarttunut lumi
      vec3 tcol = HAMY * (0.35 + 1.3 * strk) + gcol * I * rim * shl * 0.34 * exp(-zr / 60.0)
                + AMB * (0.30 + 0.9 * snowB) * 0.55 * exp(-zr / 40.0) + SNOWC * 0.020 * snowB * exp(-zr / 30.0) * (0.3 + I)
                + DLC * tl * 0.05 * smoothstep(0.55, 1.0, strk) * (1.0 - abs(u));
      col = mix(col, tcol, aT * (1.0 - 0.75 * aF));
      col = mix(col, HAMY * 1.2, aS);
    }

    // ikihonka: jättiläisrunko polun vierellä; pilkka (veistetty vaalea merkki) syttyy askelten tahdissa
    int ki = int(k + 0.5);
    int js = ki / PL;
    int kpn = js * PL + (js * 5 + 3) % PL;
    if (ki == kpn && (js % 5) != 2 && !special) {
      float sd = (js % 2 == 0) ? -1.0 : 1.0;
      float off = 3.2 + 0.5 * float((js * 3) % 4);
      float rP = 0.95 + 0.11 * float((js * 5) % 4);
      float tx = lane + sd * off;
      float dxn = wx - tx;
      if (abs(dxn) < rP * 1.8) {
        float gT = gnd(tx, zk);
        float hy = yw - gT;
        float rw = rP * (1.0 - 0.30 * clamp(hy / 30.0, 0.0, 1.0)) * (1.0 + 0.5 * exp(-hy * 1.1));
        float aT = smoothstep(pw, -pw, abs(dxn) - rw) * step(-0.05, hy) * farF;
        float u = clamp(dxn / rw, -1.0, 1.0);
        float fur = 0.55 * vnoise(vec2(u * 9.0 + float(js) * 3.0, hy * 0.20)) + 0.45 * vnoise(vec2(u * 3.0 + 2.0, hy * 0.9 + float(js)));
        vec3 bark = HAMY * (0.35 + 1.5 * fur);
        float rim = pow(abs(u), 3.0) * smoothstep(-0.15, 0.55, sgn * u);
        float shl = shaftH(tx, yw, zk);
        bark += gcol * I * rim * shl * 0.60 * exp(-zr / 70.0);
        float tl = uTop.x * sstep(uTop.y - 7.0, uTop.y, ya);
        bark += DLC * tl * 0.06 * smoothstep(0.55, 1.0, fur) * (1.0 - abs(u));
        float bl = 0.02;
        for (int q = 0; q < 6; q++) if (abs(uBl[q].x - float(js)) < 0.5) bl += uBl[q].z * exp(-uBl[q].y * 2.2);
        float bm = smoothstep(0.17, 0.11, abs(dxn + sd * rw * 0.42)) * smoothstep(1.4, 1.55, hy) * smoothstep(2.75, 2.6, hy) * step(abs(u), 0.97);
        bark = mix(bark, HOPEA * bl * (0.75 + 0.5 * vnoise(vec2(dxn * 14.0, hy * 6.0))), bm);
        bark += HOPEA * bl * 0.10 * exp(-pow((hy - 2.1) / 1.0, 2.0)) * exp(-pow((dxn + sd * rw * 0.42) / 0.45, 2.0)) * (1.0 - bm);
        col = mix(col, bark, aT);
      }
    }

    // suuri petäjä: kiteen kantaja, loppukulun kohde (oma kerroksensa)
    if (special) {
      vec2 Ep = vec2(uEnd.x, gnd(uEnd.x, zk) + uEnd.z);
      float Px = uEnd.x - 3.4, gP = gnd(Px, zk);
      float Hp = Ep.y - gP + 3.2;
      vec2 q = vec2(wx, yw);
      float hy = yw - gP, dxn = wx - Px;
      float rw = 0.95 * (1.0 - 0.55 * clamp(hy / Hp, 0.0, 1.0)) * (1.0 + 0.5 * exp(-hy * 1.1));
      float aT = smoothstep(pw, -pw, abs(dxn) - rw) * step(-0.05, hy) * step(hy, Hp);
      float u = clamp(dxn / rw, -1.0, 1.0);
      float fur = 0.55 * vnoise(vec2(u * 9.0, hy * 0.20)) + 0.45 * vnoise(vec2(u * 3.0 + 2.0, hy * 0.9));
      float shl = shaftH(Px, yw, zk);
      float sideP = smoothstep(-0.15, 0.55, sgn * u);
      float topP = clamp(uTop.x * (0.45 + 0.55 * sstep(uTop.y - 9.0, uTop.y, yw - gc + 4.0)), 0.0, 1.0);
      vec3 bark = HAMY * (0.35 + 1.5 * fur) + gcol * I * pow(abs(u), 3.0) * sideP * shl * 0.5 + DLC * topP * 0.10 * smoothstep(0.5, 1.0, fur) * (1.0 - abs(u));
      col = mix(col, bark, aT);
      // oksat ja neulastupsut
      float ey = Ep.y;
      float d = 1e3, ly = 0.0, lyBest = 0.0, dd;
      float limbD = 1e3;
      vec2 a1 = vec2(Px, ey - 1.7), m1 = vec2(Px + 1.9, ey - 0.75);
      limbD = min(limbD, min(seg(q, a1, m1, 0.15, 0.09), seg(q, m1, Ep, 0.09, 0.02)));
      limbD = min(limbD, seg(q, vec2(Px, ey - 2.6), vec2(Px - 3.4, ey - 2.0), 0.13, 0.03));
      limbD = min(limbD, seg(q, vec2(Px, ey - 0.2), vec2(Px - 2.2, ey + 0.9), 0.11, 0.03));
      limbD = min(limbD, seg(q, vec2(Px, ey - 4.4), vec2(Px + 3.6, ey - 3.7), 0.15, 0.03));
      limbD = min(limbD, seg(q, vec2(Px, ey - 6.5), vec2(Px + 2.8, ey - 6.0), 0.15, 0.03));
      limbD = min(limbD, seg(q, vec2(Px, ey - 8.3), vec2(Px - 2.9, ey - 7.7), 0.15, 0.03));
      float needle = 1e3; float nly = 0.0;
      // tupsut oksien päissä ja E-oksan varrella
      vec2 tc[9] = vec2[9](Ep + vec2(-0.15, 0.04), vec2(Px + 1.2, ey - 1.15), vec2(Px + 2.4, ey - 0.55), vec2(Px - 3.4, ey - 1.95), vec2(Px - 2.2, ey + 0.95),
                           vec2(Px + 3.6, ey - 3.65), vec2(Px + 2.8, ey - 5.95), vec2(Px - 2.9, ey - 7.65), vec2(Px + 0.2, gP + Hp - 0.5));
      vec2 tr[9] = vec2[9](vec2(0.36, 0.14), vec2(0.34, 0.12), vec2(0.40, 0.14), vec2(1.10, 0.38), vec2(0.90, 0.32), vec2(1.10, 0.36), vec2(0.95, 0.32), vec2(1.00, 0.34), vec2(1.2, 0.55));
      for (int j = 0; j < 9; j++) { float l2; float dj = tuft(q, tc[j], tr[j], float(j) * 3.1, l2); if (dj < needle) { needle = dj; nly = l2; } }
      float aL = smoothstep(pw, -pw, limbD);
      float aN = smoothstep(pw * 1.5, -pw * 1.5, needle);
      float ya2 = yw - gc;
      float lit = clamp(uTop.x * (0.40 + 0.60 * sstep(uTop.y - 9.0, uTop.y, ya2 + 5.0)) * (0.5 + 0.5 * shaftT(wx, yw, zk)), 0.0, 1.0);
      vec3 needleC = HAMY * 1.1 + HALLA * 0.20 * lit * smoothstep(-0.2, 0.7, nly) + DLC * 0.05 * lit;
      vec3 limbC = HAMY * 1.4 + HALLA * 0.12 * lit * smoothstep(0.0, 0.1, -limbD - 0.02);
      col = mix(col, limbC, aL);
      col = mix(col, needleC, aN);
      // kide oksan kärjessä
      vec2 qc = (q - Ep) / 0.075;
      vec2 ab = abs(qc);
      float hd = max(ab.x * 0.8660254 + ab.y * 0.5, ab.y) - 1.0;
      float an = atan(qc.y, qc.x);
      float a2 = abs(mod(an + 0.5235988, 1.0471976) - 0.5235988);
      vec2 pf = length(qc) * vec2(cos(a2), sin(a2));
      float armD = max(pf.y - 0.10 * (1.0 - pf.x / 2.8), pf.x - 2.8);
      float px1 = pw / 0.075;
      float aC = max(smoothstep(px1, -px1, hd), smoothstep(px1, -px1, armD) * 0.9);
      float fac = 0.80 + 0.40 * hash(vec2(floor((an + 3.14159) / 1.0471976), 3.0));
      float facFade = sstep(uT1 - 3.0, uT1 - 0.5, uTime);
      vec3 base = rajakuva(p, 1, uTime);
      vec3 cr = base * mix(fac, 1.0, facFade) + HOPEA * 0.30 * smoothstep(-0.07, 0.0, hd) * smoothstep(0.02, -0.02, hd) * (1.0 - facFade);
      col += HALLA * 0.10 * (0.4 + uTop.x) * exp(-dot(qc, qc) / 40.0) * (1.0 - facFade);
      col = mix(col, cr, aC);
    }

    // hiutaleet: tummassa usvassa kohtuullinen lumisade
    if (zr < 46.0) {
      vec2 fq = vec2(wx + 0.25 * sin(uTime * 0.6 + k), yw + 0.5 * (uTime - uT0) + 3.7 * k) * 1.1;
      vec2 ic = floor(fq), fr = fract(fq);
      float hh = hash(ic + k * 1.37);
      if (hh < 0.040) {
        vec2 c0 = 0.2 + 0.6 * vec2(hash(ic + 1.7), hash(ic + 5.3));
        float rf = max(0.0020 * zr / F, 0.002);
        col += SNOWC * 0.40 * smoothstep(rf, rf * 0.3, length(fr - c0) / 1.1) * smoothstep(48.0, 28.0, zr) * smoothstep(0.8, 2.5, zr);
      }
    }

    // usvalaatta tämän kerroksen ja seuraavan lähemmän välissä: ääni ei muuta sen paikkaa, vain valon
    float seglen = DZ * length(r) / r.z;
    float dens = 0.0115 * (0.50 + 1.0 * exp(-max(ya, 0.0) / 3.0)) * (1.0 + 0.16 * (uFx.y - 0.5));
    float part = 0.0;
    for (int i2 = 0; i2 < 4; i2++) { vec4 pu = uPulse[i2]; if (pu.y <= 0.0) continue;
      float zc = pu.z + 14.0 + 16.0 * pu.x;
      part += pu.y * exp(-pu.x * 0.7) * exp(-pow((zk - zc) / 9.0, 2.0)) * exp(-pow((wx - lane) / 14.0, 2.0)); }
    part = min(part, 1.0);
    dens *= 1.0 - 0.45 * part;
    float T = exp(-dens * seglen);
    float ph = 1.1 * exp(-ang * 190.0) + 0.28 * exp(-ang * 24.0) + 0.05 * exp(-ang * 3.0);
    float sh = shaftH(wx, yw, zk);
    float topV = 0.25 + 0.75 * smoothstep(0.0, 14.0, ya);
    vec3 Lf = AMB * (0.85 - 0.30 * uFx.x + 0.15 * uFx.y)
            + gcol * I * (0.85 + 0.30 * uFx.y) * (1.0 + 0.9 * part) * ph * sh * (0.55 + 0.45 * exp(-max(ya, 0.0) / 6.0)) * (1.0 - 0.30 * uFx.x)
            + DLC * (uTop.x + 0.45 * uFx.z) * 0.07 * shaftT(wx, yw, zk) * topV;
    col = col * T + Lf * (1.0 - T);
  }

  // rajakuva: metsän reunan oksaseinät (riippuvia, repaleisia oksamassoja; aukeavat kameran kulun mukana) → maailma 3
  float ts = uTime - uT0;
  float cov = 0.0, covE = 0.0;
  for (int c = 0; c < 4; c++) {
    float fc = float(c);
    float zrc = uZ0 + 1.8 + 2.6 * fc + 0.5 * fc * fc - ro.z;
    if (zrc < 0.15) continue;
    float s = zrc / r.z;
    vec2 w = vec2(ro.x + r.x * s, ro.y + r.y * s - gc);
    float n = vnoise(vec2(w.x * 0.95 + fc * 7.0, w.y * 0.30 + fc * 2.0)) * 0.50 + vnoise(vec2(w.x * 3.1 + fc * 3.0, w.y * 0.85)) * 0.32 + vnoise(vec2(w.x * 9.0 + fc, w.y * 2.6)) * 0.18;
    n += 0.10 * smoothstep(0.0, 3.0, w.y) - 0.06 * fc;
    float open = 1.0 - sstep(0.0, 1.6 + 1.0 * fc, ts);
    float cc = smoothstep(0.575, 0.605, n + 1.05 * open - 0.30);
    cov = max(cov, cc);
    covE = max(covE, cc * (1.0 - cc) * 4.0);
  }
  vec3 raja0 = rajakuva(p, 0, uTime);
  col = mix(col, raja0, cov);
  col += GLOWC * uL.z * 0.020 * covE * (1.0 - cov) * exp(-ang * 12.0);
  // loppu: kide täyttää kuvan, ja viimeinen ruutu on rajakuva HUURRE
  col = mix(col, rajakuva(p, 1, uTime), sstep(uT1 - 0.35, uT1, uTime));
  return col;
}
` + FS_LOPPU;

async function alusta() {
  const d = await lataa();
  const a = d.aika, FPS = d.FPS;
  d.vaadi('fis_pitka_aani', 'valo_D_duuri', 'askeleet_alkavat', 'fis_hengittaa', 'urkupiste_H1_alku', 'nousu_tremolo', 'nousu_huippu_D', 'pohja_katoaa', 'hiljaisuus_1_loppu');
  const T0 = a.fis_pitka_aani, T4 = a.urkupiste_H1_alku, TT = a.nousu_tremolo, TH = a.nousu_huippu_D, T1 = a.pohja_katoaa;
  const TA = a.askeleet_alkavat;

  // ---- ääni: hitaita signaaleja (vähintään 0,3 s keskiarvo) ----
  const norm = (x, lo, hi) => clamp((x - lo) / (hi - lo), 0, 1);
  // jouset: keskirekisteri; puhaltimien D-välähdyksen aikana jouset väistyvät (kuunteluopas 1:15)
  const D0 = a.valo_D_duuri, D1 = D0 + 21.1;
  const jousia = (t) => 1 - 0.75 * sstep(D0 - 0.3, D0 + 0.4, t) * (1 - sstep(D1 - 0.4, D1 + 0.6, t));
  const jou = (t) => norm(d.keski(t, 0.7), 0.40, 0.90) * jousia(t) * sstep(T0, T0 + 1.0, t);
  // sointumaton hengitys (kuunteluopas 1:40): keskirekisterin lyhyt ja pitkä keskiarvo
  const hengitys = (t) => (t < a.fis_hengittaa - 0.5 ? 0.5 : clamp(0.5 + 2.4 * (d.keski(t, 0.45) - d.keski(t, 3.0)), 0, 1));
  // fis-valo: pitkän äänen voima hitaana keskiarvona; korkeus: pitkän äänen sävel ja melodian kaari hienovaraisesti
  const valo = (t) => 0.50 + 0.85 * norm(d.pitka(t, 1.3), 0.12, 0.58);
  const valoY = (t) => clamp(0.025 + 0.0030 * (d.melodia(t, 2.5) - 74), -0.03, 0.07);
  // D- ja H-sävelet (kuunteluopas 1:15; 3:15): sointu soi vain tällä välillä
  const sD = d.sarja((f) => Math.max(d.taso(50, f), d.taso(62, f), d.taso(74, f), d.taso(59, f), d.taso(71, f)));
  const dValo = (t) => norm(d.ka(sD, clamp(t, 0, 1e4) * FPS, 0.5 * FPS), 0.35, 0.80) * sstep(D0 - 0.3, D0 + 0.8, t) * (1 - sstep(D1 - 0.5, D1 + 0.8, t));
  const sC = d.sarja((f) => Math.max(d.taso(50, f), d.taso(62, f), d.taso(74, f), d.taso(66, f), d.taso(78, f), d.taso(69, f)));
  const dTop = (t) => (0.30 * sstep(TT - 0.3, TT + 3.0, t) * (0.7 + 0.3 * norm(d.korkea(t, 0.6), 0.3, 0.7))
    + 0.70 * sstep(TH - 0.6, TH + 1.0, t) * norm(d.ka(sC, clamp(t, 0, 1e4) * FPS, 0.5 * FPS), 0.30, 0.80));
  // tuuli = musiikin voima: koko orkesterin taso hitaana keskiarvona (1,2 s); latvat taipuvat sen mukana
  const tuuli = (t) => norm(d.koko(t, 1.2), 0.35, 0.95);
  const hFront = (t) => 38 - 16 * sstep(TT - 0.3, T1 + 1.0, t);
  // usvan ajautuma: koneen kuulema liike nopeuttaa sitä (kertymä, ei nopeus kertaa aika)
  const lik = new Float32Array(d.NF);
  for (let f = 0; f < d.NF; f++) lik[f] = d.tapahtuu('liike', f / FPS) ? 1 : 0;
  const lsum = d.sarja((f) => lik[f]);
  const kFog = d.sarja((f) => (0.04 + 0.10 * d.ka(lsum, f, 1.5 * FPS)) / FPS);

  // ---- askeleet: matalan kaistan alut (d.alut) ja tiheämpi tunnistus askelten jaksolla ----
  const sm = d.sarja((f) => d.huippu(28, 47, f));
  const askeleet = [];
  { const m = (f) => d.ka(sm, f + 0.5, 0.5); let viime = -99;
    for (let f = Math.floor((TA - 0.5) * FPS) + 8; f < Math.floor(T4 * FPS); f++) {
      const n = d.huippu(28, 47, f) - Math.min(d.huippu(28, 47, f - 5), d.huippu(28, 47, f - 4), d.huippu(28, 47, f - 3), d.huippu(28, 47, f - 2));
      if (n >= 0.06 && d.huippu(28, 47, f) > 0.2 && f - viime >= 34) { askeleet.push({ t: f / FPS, v: clamp(n / 0.2, 0.45, 1) }); viime = f; } } }

  // ---- kamera: reitti lasketaan ruuduittain ----
  const V3 = 2.0, V4 = 3.0, PHI = 50 * Math.PI / 180, SB = 4.6;
  const pitchAt = (t) => PHI * (0.28 * sstep(T4, TT, t) + 0.72 * sstep(TT - 1.0, TH, t));
  const eyeAt = (t) => 1.6 - 1.0 * sstep(TA, TA + 7.0, t);
  const vAt = (t) => V3 + (V4 - V3) * sstep(T4, T4 + 8.0, t);
  const f0 = Math.floor(T0 * FPS), fB = Math.ceil(TH * FPS);
  const zr = new Float64Array(fB - f0 + 2), hc = new Float64Array(fB - f0 + 2);
  for (let i = 1; i < zr.length; i++) { const t = (f0 + i - 1) / FPS, ph = pitchAt(t), v = vAt(t), dzz = v * Math.cos(ph) / FPS;
    zr[i] = zr[i - 1] + dzz; hc[i] = hc[i - 1] + v * Math.sin(ph) / FPS; }
  const lerpArr = (arr, t) => { const x = clamp(t * FPS - f0, 0, arr.length - 1.001), i = Math.floor(x); return arr[i] + (arr[i + 1] - arr[i]) * (x - i); };
  const iB = Math.round(TH * FPS) - f0;
  const zB = lerpArr(zr, TH), hB = eyeAt(TH) + lerpArr(hc, TH);
  const zE = zB + SB * Math.cos(PHI), hE = hB + SB * Math.sin(PHI);
  const kP = Math.ceil((zE + 0.5) / DZ);
  const Z0 = kP * DZ - zE;                                   // kameran alku: kide on tasan kerroksella kP
  const Z1 = Z0 + zB;                                        // tästä eteenpäin polku on suora (loppukulku)
  const laneX = (z) => LANE * z + (2.2 * Math.sin(0.045 * z + 0.6) + 0.9 * Math.sin(0.11 * z + 2.0)) * (1 - sstep(Z1 - 25, Z1, z));
  const kk = V4 / SB;
  const cam = (t) => {
    if (t <= TH) { const z = Z0 + lerpArr(zr, t); return { x: laneX(z), z, h: eyeAt(t) + lerpArr(hc, t), p: pitchAt(t) }; }
    const s = SB * Math.exp(-kk * (t - TH));
    return { x: laneX(Z1), z: Z0 + zE - s * Math.cos(PHI), h: hE - s * Math.sin(PHI), p: PHI };
  };
  const EX = laneX(Z1), EZ = kP * DZ;

  // ikihongat: sama kaava kuin varjostimessa (kokonaislukuaritmetiikka)
  const pineZ = (j) => (j * PL + ((j * 5 + 3) % PL)) * DZ;
  const hasPine = (j) => (j % 5) !== 2;
  const nextPine = (z) => { for (let j = Math.max(0, Math.floor(z / (PL * DZ)) - 1); j < 400; j++) if (hasPine(j) && pineZ(j) > z + 6) return j; return 0; };
  const evs = askeleet.map((x) => ({ t: x.t, v: x.v, j: nextPine(Z0 + lerpArr(zr, x.t)), z: Z0 + lerpArr(zr, x.t) }));

  const { gl, U, piirra } = luoGL(FS);

  function seekT(t) {
    const c = cam(t);
    const ph = c.p, cphi = Math.cos(ph), sphi = Math.sin(ph);
    const ly = valoY(t), lx = 0.12;
    const cx_ = lx, cy_ = ly * cphi - sphi, cz_ = ly * sphi + cphi;
    const gdx = cz_ > 0.05 ? F * cx_ / cz_ : 0, gdy = cz_ > 0.05 ? F * cy_ / cz_ : -9;
    gl.uniform1f(U('uTime'), t); gl.uniform1f(U('uT0'), T0); gl.uniform1f(U('uT1'), T1); gl.uniform1f(U('uZ0'), Z0); gl.uniform1f(U('uZ1'), Z1);
    gl.uniform4f(U('uCam'), c.x, c.z, c.h, c.p);
    gl.uniform3f(U('uL'), lx, ly, valo(t));
    gl.uniform2f(U('uGl'), gdx, gdy);
    gl.uniform4f(U('uFx'), jou(t), hengitys(t), dValo(t), d.kohta(kFog, t));
    gl.uniform4f(U('uTop'), dTop(t), hFront(t), tuuli(t), 0);
    const pu = new Float32Array(16), pi = evs.filter((e) => e.t <= t && t - e.t < 4.0).slice(-4);
    pi.forEach((e, i) => pu.set([t - e.t, e.v, e.z, 0], i * 4));
    gl.uniform4fv(U('uPulse'), pu);
    const bl = new Float32Array(24), bi = evs.filter((e) => e.t <= t && t - e.t < 3.0).slice(-6);
    bi.forEach((e, i) => bl.set([e.j, t - e.t, e.v, 0], i * 4)); for (let i = bi.length; i < 6; i++) bl[i * 4] = -9;
    gl.uniform4fv(U('uBl'), bl);
    gl.uniform4f(U('uEnd'), EX, EZ, hE, kP);
    piirra();
  }

  julkaise({
    gl, aika: a,
    kamera: (t) => { const c = cam(t); return { p: [c.x, c.h, c.z], q: [0, 0, 0, 1], shot: 'matka', cut: 0, trans: false }; },
    kuvaus: (t) => { const c = cam(t), c2 = cam(t + 0.5); return {
      kamera: { x: +c.x.toFixed(2), z: +c.z.toFixed(2), korkeus: +c.h.toFixed(2), kallistus_aste: +(c.p * 180 / Math.PI).toFixed(1),
        kallistusnopeus_asteta_s: +(((c2.p - c.p) / 0.5) * 180 / Math.PI).toFixed(2), vauhti: +(Math.hypot(c2.z - c.z, c2.h - c.h, c2.x - c.x) / 0.5).toFixed(2) },
      tuuli: +tuuli(t).toFixed(2), valo: +valo(t).toFixed(2), valoY: +valoY(t).toFixed(3), jouset: +jou(t).toFixed(2), hengitys: +hengitys(t).toFixed(2), dValo: +dValo(t).toFixed(2),
      ylhaalta: +dTop(t).toFixed(2), rintama: +hFront(t).toFixed(1), askelia: askeleet.filter((e) => e.t <= t).length,
      askelAika: askeleet.map((e) => +e.t.toFixed(1)).join(' ') }; },
    seek: seekT,
  });
}
alusta().catch((e) => { console.error(e); window.sceneError = String(e.message || e); });
