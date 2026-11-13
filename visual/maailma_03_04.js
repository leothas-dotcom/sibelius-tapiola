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

const TAIKA = new URLSearchParams(location.search).get('taika') === '1' ? 1 : 0;   // vedos 8 (S1): taikalisäykset vain kytkimellä taika=1
const DBG = Number(new URLSearchParams(location.search).get('dbg') || 0);   // vain vianetsintään (0 = normaali)
const FS = FS_ALKU + `
const int DBG = ${DBG};
const float TAIKA = ${TAIKA.toFixed(1)};
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
uniform vec2 uAv;       // rivi 115: hiutaleiden lisäsiirtymä (m): sivu, nosto; nopeuden kertymä
uniform vec4 uAl[4];    // alttojen fraasi: ikä, voima, kameran z fraasin hetkellä, siemen
uniform vec4 uOk[3];
uniform float uOkD[3];  // vedos 8 (rivi 153): alttoviulun tuuli kuljettaa oksalta tippuvaa lunta: siirtymä tipahduksen alusta (m)    // vedos 8 (rivi 135, taika): oksan lumi putoaa alttoviulujen soidessa: sivusiirtymä polusta (m), kerros k, ikä (s), voima
uniform vec4 uWn;      // vedos 8 (taika T2): kaukaisten ikkunoiden voima
uniform vec4 uEnd;      // kiteen x, z, korkeus maasta, suuren petäjän kerros
` + GLSL_YHTEINEN + `
const vec3 AMB = vec3(0.0075, 0.0135, 0.0255);        // sininen usva (salo)
const vec3 GLOWC = vec3(0.50, 0.64, 0.88);            // horisontin valo (halla)
const vec3 DLC = vec3(0.56, 0.70, 0.76);              // kelmeä, hämärä välähdys: ei keltainen, ei lämmin
const vec3 SNOWC = vec3(0.55, 0.62, 0.75);
const float PILLAR_A = 0.42;

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

// kohina, jonka korkeat taajuudet sulavat tasaiseksi keskiarvoksi, kun ne olisivat pikselin jalanjälkeä (pwv) hienompia: ei aliasoivaa vilkuntaa
float vnF(vec2 p, float fr, float pwv) { return mix(0.5, vnoise(p), 1.0 - smoothstep(0.10, 0.40, pwv * fr)); }
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
    float w = smoothstep(0.0, 0.22, pu.x) * exp(-pu.x * 1.6) * pu.y;
    lit += GLOWC * w * 0.22 * (1.0 + 0.40 * TAIKA) * exp(-pow((gp.z - zc) / ((2.5 + 2.0 * pu.x) * (1.0 + 0.12 * TAIKA)), 2.0)) * exp(-pow((gp.x - xc) / (3.0 * (1.0 + 0.15 * TAIKA)), 2.0)); }
  // kummun selänne hohtaa valoa vasten
  lit += gcol * I * 0.06 * exp(-ang * 12.0) * smoothstep(0.0, -0.5, ndl - 0.2) * stripe;
  return snow + lit;
}

// vedos 8 (taika T3): lähin kuusi kohdan xT vieressä samalla puolella polkua (sama kaava kuin runkojen silmukassa): (tx, maan korkeus, korkeus, löytyi)
vec4 pickTree(float kE, float zE, float xT, float sgn) {
  float laneE = laneX(zE), best = 1e5; vec4 o = vec4(0.0);
  for (int c = -2; c <= 2; c++) { float ci = floor(xT / 5.4) + float(c);
    float h1 = hash(vec2(ci, kE)), h2 = hash(vec2(ci + 7.3, kE + 1.7)), h3 = hash(vec2(ci - 3.1, kE + 5.9)), h4 = hash(vec2(ci + 2.2, kE - 4.4));
    if (h1 > 0.86) continue;
    float tx = (ci + 0.10 + 0.80 * h2) * 5.4, rr = 0.20 + 0.30 * h3 * h3 + 0.12 * h3;
    if (abs(tx - laneE) < rr + 0.8 || sign(tx - laneE) != sgn) continue;
    float dd = abs(tx - xT); if (dd < best) { best = dd; o = vec4(tx, gnd(tx, zE), 17.0 + 8.0 * h4, 1.0); } }
  return o; }
// lumi putoaa latvasta: tiivis valuma, joka laajenee ja hajoaa (ikä a, s)
float snowFall(float wx, float yw, float gG, float bx, float y0, float a) {
  float fall = 0.45 * a + 2.3 * a * a, aa = max(a - 0.28, 0.0);
  float rg1 = vnoise(vec2(wx * 2.6 + bx * 1.7, y0 * 0.7)) - 0.5, rg2 = vnoise(vec2(wx * 3.4 - bx * 1.3, y0 * 1.3 + 4.0)) - 0.5;   // vedos 8 (kriitikko B1): rosoinen rintama, ei laatikkoa
  float yB = y0 - 0.10 - fall + (0.25 + 0.60 * a) * rg1, yT = y0 - 0.15 - 0.8 * aa - 2.0 * aa * aa + (0.20 + 0.40 * a) * rg2;
  float w = 1.0 * (0.20 + 0.32 * a + 0.08 * max(y0 - yw, 0.0)), cx = bx + 0.10 * a;
  return smoothstep(yB - 0.30, yB + 0.30, yw) * smoothstep(yT + 0.25, yT - 0.25, yw) * exp(-pow((wx - cx) / w, 2.0))
       * smoothstep(0.0, 0.06, a) * (1.0 - smoothstep(1.4, 2.7, a)) * smoothstep(gG - 0.05, gG + 0.35, yw); }
// vedos 8 (taika T2): pehmeä kylmä valoaukko (b = keskipiste, puolileveys, puolikorkeus)
float winG(float x, float y, vec4 b) { vec2 q = abs(vec2(x - b.x, y - b.y)) / b.zw;
  return smoothstep(1.35, 0.55, pow(pow(q.x, 4.0) + pow(q.y, 4.0), 0.25)) + 0.40 * exp(-dot(q, q) * 0.8); }

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
  float ts = uTime - uT0;                                   // aika maailman alusta
  float up = smoothstep(0.03, 0.30, uCam.w);                // katse ylös: latvukset tulevat näkyviin

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

  // vedos 8 (rivi 135): oksan lumen putoamisen puu: lähin olemassa oleva kuusi kohteen vierellä samalla puolella polkua (sama kaava kuin alla)
  float okCi[3]; vec4 okP[3];                                // valitun puun solu ja (tx, maan korkeus, oksan korkeus maasta, puoli polkuun päin)
  for (int e = 0; e < 3; e++) { okCi[e] = -1e5; okP[e] = vec4(0.0); vec4 ev = uOk[e]; if (ev.w <= 0.0) continue;
    float kE = ev.y, zE = kE * DZ, laneE = laneX(zE), xT = laneE + ev.x, best = 1e5;
    for (int c = -2; c <= 2; c++) { float ci = floor(xT / 5.4) + float(c);
      float h1 = hash(vec2(ci, kE)), h2 = hash(vec2(ci + 7.3, kE + 1.7)), h3 = hash(vec2(ci - 3.1, kE + 5.9)), h4 = hash(vec2(ci + 2.2, kE - 4.4));
      if (h1 > 0.86) continue;
      float tx = (ci + 0.10 + 0.80 * h2) * 5.4, rr = 0.20 + 0.30 * h3 * h3 + 0.12 * h3;
      if (abs(tx - laneE) < rr + 0.8 || sign(tx - laneE) != sign(ev.x)) continue;
      float dd = abs(tx - xT); if (dd < best) { best = dd; okCi[e] = ci; okP[e] = vec4(tx, gnd(tx, zE), 3.0 + 2.0 * h4 + 0.9 + 0.8 * h3, sign(laneE - tx)); } } }

  float kf = floor((ro.z + ZF) / DZ);
  for (int i = 0; i < 64; i++) {
    float k = kf - float(i);
    float zk = k * DZ;
    float zr = zk - ro.z;
    bool special = abs(k - uEnd.w) < 0.5;
    if (zr < ZN && !special) break;
    if (zr < 0.004) break;
    if (zr < 46.0 && zr >= 46.0 - DZ && up < 0.99) {   // korjaus B2: käytävän pään valon pylväs (valaistu usva) kaukaisen havuston päällä, lähempien puiden takana; seuraa käytävän akselia
      float zref = 70.0;
      float wxr = ro.x + r.x * zref / r.z, yar = ro.y + r.y * zref / r.z - gc;
      float mx = exp(-pow((wxr - laneX(ro.z + zref)) / 1.15, 2.0));
      float my = smoothstep(-0.3, 1.2, yar) * exp(-max(yar, 0.0) / 9.0);
      float prt2 = 0.0;
      for (int i5 = 0; i5 < 4; i5++) { vec4 pu = uPulse[i5]; if (pu.y <= 0.0) continue;
        prt2 += pu.y * smoothstep(0.0, 0.25, pu.x) * exp(-pu.x * 1.3); }
      float gate = (hit && sg < zref) ? 0.0 : 1.0;
      col += gcol * I * PILLAR_A * (1.0 + 0.35 * min(prt2, 1.0)) * mx * my * gate * (1.0 - up) * (1.0 - 0.30 * uFx.x);
    }
    if (TAIKA > 0.5 && uWn.x > 0.001 && zr < 30.0 && zr >= 30.0 - DZ && up < 0.99) {   // vedos 8 (T2): Tapion talon kolme ikkunaa kaukana (säteen leikkaus 52 m:ssä; piirto kerroksessa 30 m, jotta kaukohavusto ei peitä niitä), runkojen välissä
      float zw = 52.0, wxw = ro.x + r.x * zw / r.z - laneX(ro.z + zw), yaw = ro.y + r.y * zw / r.z - gc;
      float gW = (hit && sg < zw) ? 0.0 : 1.0;
      float ws = winG(wxw, yaw, vec4(-1.9, 2.3, 0.55, 0.80)) + winG(wxw, yaw, vec4(3.0, 3.7, 0.40, 0.58)) + winG(wxw, yaw, vec4(-3.7, 1.4, 0.65, 0.50));
      col += HALLA * uWn.x * 0.60 * ws * gW * (1.0 - up);
    }
    if (hit && zr > sg) continue;
    float s = zr / r.z;
    float wx = ro.x + r.x * s, yw = ro.y + r.y * s;
    float ya = yw - gc;
    float pw = zr / (F * uRes.y) * 1.1;
    float lane = laneX(zk);
    float sgn = sign(uGl.x - dx);
    float farF = smoothstep(ZF, ZF - 20.0, zr) * (1.0 - up * (1.0 - smoothstep(10.0, 24.0, zr)));   // katse ylös: lähimmät rungot häipyvät usvaan
    float clearL = smoothstep(0.6, 1.9, abs(wx - lane));       // polku: oksat eivät kasva sen yli
    float clearFar = mix(clearL, 1.0, smoothstep(14.0, 32.0, zr));   // korjaus B: raivaus vain lähietäisyydellä; 32 m:stä kauemmas käytävän puut saavat havuston (kapea rako jätti teräviä viipaleita)

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
        + 0.18 * (0.05 + 1.1 * uTop.z) * hn * hn * Hh * 0.05 * (sin(wx * 0.03 - uTime * 0.55 + k * 0.35 + h2 * 3.0) + 0.4 * sin(uTime * 1.3 + h3 * 20.0 + hy * 0.2));   // tuuli: latvat taipuvat, tyvi pysyy
      float dxn = wx - tx - lean;
      float rw = rr * (1.0 - mix(0.45, 0.88, up) * clamp(hn, 0.0, 1.0)) * (1.0 + 0.6 * exp(-hy * 1.4)) * (0.93 + 0.14 * vnoise(vec2(hy * 0.25, h3 * 40.0)));
      float far12 = smoothstep(7.0, 9.5, zr);                     // vedos 7b: yli ~12 m kauempana puut ovat kuusia (havusto, ei paljas runko)
      rw *= mix(1.0, clamp((1.0 - hn) / 0.22, 0.0, 1.0), far12);   // korjaus B: kaukainen runko suipenee piikiksi latvassa, ei tasaista katkaistua päätä
      float h0f = 3.0 + 2.0 * h4;                                    // havusto alkaa 3-5 m:n korkeudelta
      float okSp = 0.0, okCut = 0.0;                                 // vedos 8 (rivi 135): tämän puun oksan heilahdus ja lumen lähtö
      for (int e = 0; e < 3; e++) { vec4 ev = uOk[e]; if (ev.w <= 0.0 || abs(k - ev.y) > 0.5 || abs(ci - okCi[e]) > 0.5) continue;
        float a = ev.z, okM = smoothstep(0.15, 0.9, dxn * okP[e].w) * exp(-pow((hy - okP[e].z) / 0.85, 2.0));
        okSp = ev.w * okM * 0.16 * exp(-a / 0.65) * sin(min(a, 6.0) * 8.0) * smoothstep(0.0, 0.06, a);   // kevennyt oksa nousee ja heilahtaa, vaimenee noin 2 s:ssa
        okCut = okM * sstep(0.05, 0.45, a); }
      float kin = 0.07 + 0.17 * vnoise(vec2(dxn * 1.4 + h2 * 30.0, k * 2.3 + ci));   // rivi 111: kinos tyvellä: runko uppoaa lumeen pehmeää, aaltoilevaa rajaa pitkin (10-38 cm), ei suoraa viivaa
      float aT = smoothstep(pw, -pw, abs(dxn) - rw) * step(hy, Hh) * farF * (1.0 - up * smoothstep(0.40, 0.65, hn));   // runkoa näkyy tyvi ja välähdyksiä oksien välistä   // katse ylös: rungon yläosa on latvusmassan sisällä, ohut runko ei jatku latvuksen yli
      // oksamassa: alta harva, päältä tiheä; hulmuavat riippuvat oksat, repaleinen reuna, raot
      float sk = smoothstep(0.20, 0.42, hn) * (1.0 - smoothstep(0.92, 1.02, hn));
      float tier = 0.50 + 0.95 * vnoise(vec2(hy * 0.50 + k * 3.1, k * 1.7 + ci));
      float Bw = (1.3 + 1.9 * h3) * pow(max(1.0 - hn * mix(0.80, 0.97, up), 0.0), 0.7) * tier * (1.0 + 0.22 * uFx.x);
      float edgeF = abs(dxn) - rw - Bw * (1.0 + 0.35 * sign(dxn) * (h2 - 0.5) * 2.0) * sk;
      float rag = (vnoise(vec2(wx * 3.0 + k * 1.3, yw * 0.75)) - 0.5) * 1.1 + (vnoise(vec2(wx * 9.0, yw * 2.4 + k)) - 0.5) * 0.35;
      float aF = smoothstep(mix(0.20, 0.90, up), -mix(0.20, 0.90, up), edgeF + rag * (1.0 - 0.6 * up)) * sk * farF;
      float holes = smoothstep(0.62, 0.82, vnoise(vec2(wx * 2.4 + k * 2.0, yw * 1.5 + 4.0)));
      aF *= (1.0 - (0.50 - 0.30 * uFx.x) * holes * (1.0 - 0.8 * smoothstep(0.05, 0.3, uCam.w) * smoothstep(7.0, 13.0, ya)) * (1.0 - 0.85 * up)) * clearFar;
      aF = max(aF, 0.94 * up * sk * farF * clearFar * smoothstep(0.35, -0.35, abs(dxn) - 0.50 * Bw));   // katse ylös: latvuksen ydin on yhtenäinen tumma massa
      float snowF = 0.0;
      {  // kaukainen ja keskietäisyyden kuusi: alaspäin riippuva havusto kerroksittain, levenee alaspäin, kärki suippo, reuna sahalaitainen
        float hyS = hy; hy -= okSp;                                   // vedos 8: oksan heilahdus siirtää havuston muotoa paikallisesti
        float hr = clamp((hy - h0f) / (Hh - h0f), 0.0, 1.0);
        // orgaaninen havusto: oksakerrokset eri korkeuksilla ja eri pituisina (kerroskoordinaatti kohinalla vääristetty), alaspäin kaartuvat riippuvat kärjet, repaleinen reuna, pehmeä usvareuna
        float tierH = 1.1 + 0.7 * h3;
        float uT = (hy - h0f) / tierH + 1.3 * vnoise(vec2(hy * 0.55 + k * 2.3 + ci * 3.1, 4.0 + h2 * 11.0)) + 0.3 * h2;
        float ph = fract(uT + 0.55 * abs(dxn) / tierH);                         // kärki alempana kuin tyvi
        float lenN = 0.55 + 0.9 * vnoise(vec2(floor(uT + 0.55 * abs(dxn) / tierH) * 1.7 + ci * 2.9, k * 0.7 + h3 * 13.0));   // jokaisen oksan pituus eri
        float Wf = (1.2 + 1.0 * h3) * pow(1.0 - hr, 0.85) * (0.28 + 0.72 * lenN * (0.55 + 0.45 * pow(1.0 - ph, 1.4))) * (0.30 + 0.70 * smoothstep(0.0, 2.5, hy - h0f)) * mix(0.60, 1.0, smoothstep(4.0, 10.0, zr));
        float lx = dxn + ci * 7.13 + k * 3.1;   // puun oma koordinaatti (sisältää latvan liikkeen): kohina ja lumi pysyvät kiinni oksassa eivätkä liu'u sen päällä
        float jag = (vnF(vec2(lx * 3.5 + k * 1.9, hy * 2.1), 3.5, pw) - 0.5) * 0.95 + (vnF(vec2(lx * 9.0 + k, hy * 5.0), 9.0, pw) - 0.5) * 0.35;
        jag *= 1.0 - smoothstep(0.80, 1.0, hr);   // kärki suippenee, ei leveää katkaisua
        float sw = pw * 1.5 + 0.10 * smoothstep(8.0, 60.0, zr);                // reuna pehmenee etäisyyden mukana
        float bot = h0f + (vnF(vec2(lx * 2.2 + k, 3.0), 2.2, pw) - 0.5) * 1.4;
        float aFf = smoothstep(sw, -sw, abs(dxn) - rw - Wf - jag * (1.0 - 0.4 * hr)) * smoothstep(-sw, sw, hy + 0.5 * abs(dxn) - bot) * step(hy, Hh) * farF * clearFar * (1.0 - 0.30 * smoothstep(40.0, 110.0, zr));
        // lumi: pehmeä epäsäännöllinen kerros oksan yläpinnalla, paksuus kohinasta, reuna liukuu, paikoin paljas
        float thick = vnF(vec2(lx * 2.6 + k * 1.1, hy * 2.0 + 2.0), 2.6, pw) * 0.8 + vnF(vec2(lx * 6.0, hy * 4.5 + k), 6.0, pw) * 0.2;
        float phS = ph + 0.20 * (vnF(vec2(lx * 1.5 + k * 3.7, hy * 1.2), 1.5, pw) - 0.5);   // lumen alareuna myötäilee oksan kaarta, ei suoraa vaakaviivaa
        float topW = smoothstep(0.12, 0.70, phS) * (1.0 - smoothstep(0.78, 1.0, phS));
        float tipT = 1.0 - smoothstep(0.35, 1.0, clamp((abs(dxn) - rw) / max(Wf, 0.15), 0.0, 1.0));   // lumi ohenee oksan kärkeä kohti
        snowF = far12 * aFf * topW * tipT * smoothstep(0.25, 0.90, thick) * (1.0 - 0.8 * okCut);   // vedos 8: pudonnut lumi on poissa oksalta
        aF = mix(aF, aFf, far12);
        hy = hyS;
      }
      if (zr < 9.0) aF *= mix(1.0, smoothstep(0.9, 3.0, length(vec2(wx - ro.x, yw - ro.y))), 1.0 - smoothstep(4.0, 9.0, zr));
      // alarungon kuivat oksantynkät
      float aS = 0.0;
      if (zr < 30.0 && hy < 7.0) {
        float swS = pw + 0.015 * smoothstep(9.0, 2.0, zr);          // vedos 8 (P3): lähellä oksantynkä on epätarkka
        for (int q = 0; q < 3; q++) { float fq = float(q);
          float hs = 1.2 + 2.2 * fq + 0.9 * hash(vec2(ci + fq, k + 3.3));
          float sdg = (hash(vec2(ci + fq * 5.0, k + 9.1)) > 0.5) ? 1.0 : -1.0;
          vec2 qa = vec2(tx + lean + sdg * rw * 0.8, gT + hs);
          float dtw = seg(vec2(wx, yw), qa, qa + vec2(sdg * (0.35 + 0.5 * hash(vec2(ci, k + fq))), -0.18), 0.012, 0.004);
          aS = max(aS, smoothstep(swS, -swS, dtw)); } }
      aS *= (1.0 - aF) * (1.0 - aT) * farF * smoothstep(2.5, 6.0, zr);   // vedos 8 (P3): tynkä näkyy vain rungon ulkopuolella (kiinni rungossa, ei sen pinnan poikki)
      if (DBG == 1) aS = 0.0;
      if (DBG == 2 && zr < 9.0) aF = 0.0;
      if (aT + aF + aS <= 0.001) continue;
      float shl = shaftH(tx, yw, zk);
      float side = smoothstep(-0.15, 0.55, sgn * sign(dxn));
      float tl = uTop.x * sstep(uTop.y - 7.0, uTop.y, ya);
      float vt = fract(hy * 0.85 + h2 * 7.0 + 0.25 * vnoise(vec2(wx * 0.7, k)));
      float edgeM = clamp(4.0 * aF * (1.0 - aF), 0.0, 1.0) * (1.0 - 0.9 * up);
      vec3 fol = HAMY * (0.5 + 0.9 * vnoise(vec2(wx * 1.1 + k, yw * 0.8)));
      fol = mix(fol, HAMY * (0.70 + 0.25 * vnF(vec2((dxn + ci * 7.13 + k * 3.1) * 3.0 + k, hy * 2.2), 3.0, pw)) + AMB * 0.5 * (1.0 - exp(-zr / 35.0)), far12);   // kaukohavusto: umpinainen tumma, ei hidasta liukuvaa harmaata
      fol += gcol * I * 0.17 * snowF * mix(0.2, 1.0, side) * shl * exp(-zr / 60.0);   // hallan valo lumessa
      fol += gcol * I * 0.09 * edgeM * side * shl * exp(-zr / 55.0) * (1.0 - far12);   // kaukohavustossa ei reunavaloa
      fol += (1.0 - far12) * DLC * tl * (0.08 + 0.45 * edgeM) * mix(smoothstep(0.45, 1.0, vt), 1.0, up) * mix(0.5 + 0.5 * shaftT(wx, yw, zk), 0.75, up) + (1.0 - far12) * DLC * tl * 0.05 * up * 0.7;
      col = mix(col, fol, aF);
      float u = clamp(dxn / rw, -1.0, 1.0);
      float strk = vnoise(vec2(u * 4.0 + h2 * 20.0, hy * 0.30 + k)) * 0.6 + vnoise(vec2(u * 11.0 + h3 * 9.0, hy * 0.9)) * 0.4;
      float rim = pow(abs(u), 6.0) * smoothstep(-0.15, 0.55, sgn * u) * (1.0 - far12) * (1.0 - smoothstep(0.015, 0.07, uCam.w));   // vaaleat reunaviivat pois kaukaisilta rungoilta; vedos 8 (P1): katseen noustessa ei reunavaloa (tumma runko + reunaviiva näytti rungottomalta vaalealta viivalta yläreunaan)
      if (DBG == 5) rim = 0.0;
      float snowB = smoothstep(0.30, 0.85, u * (h4 > 0.5 ? 1.0 : -1.0)) * smoothstep(0.35, 0.75, vnoise(vec2(hy * 0.8 + h2 * 10.0, h3 * 7.0))) * smoothstep(0.0, 0.7, hn);   // tuulen puolelle tarttunut lumi
      if (DBG == 4) snowB = 0.0;
      vec3 tcol = HAMY * (0.35 + 1.3 * strk) + gcol * I * rim * shl * 0.34 * exp(-zr / 60.0)
                + AMB * (0.30 + 0.9 * snowB) * 0.55 * exp(-zr / 40.0) + SNOWC * 0.020 * snowB * exp(-zr / 30.0) * (0.3 + I)
                + DLC * tl * 0.05 * smoothstep(0.55, 1.0, strk) * (1.0 - abs(u));
      // rivi 125: kinos rungon juurella on maata: sama väri kuin lumella sen vieressä (ei tummennusta, ei rajaa), rungon edessä ja sitä leveämpi (häipyy 0,55 m:n päässä nollaan),
      // yläreuna aaltoileva ja pehmeä. Runko piirretään ensin maahan asti, kinos sen päälle: runko nousee kinoksesta eikä leiju.
      col = mix(col, tcol, aT * (1.0 - mix(0.75, 0.97, up) * aF));
      if (zr < 45.0 && hy < 0.5) { float kh = kin * (1.0 - smoothstep(rw * 0.5, rw + 0.55, abs(dxn)));
        col = mix(col, groundCol(vec3(wx, gT, zk), zr, rd, Lw, ang), smoothstep(kh + 0.035 + pw, kh - 0.035 - pw, hy) * step(0.012, kh) * farF); }
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
        float Hp = 27.0 + 2.0 * float(js % 3);                                   // ikihongan korkeus: äärellinen, runko päättyy omaan latvukseensa (katse ylös)
        float hnp = hy / Hp;
        float kinP = 0.09 + 0.21 * vnoise(vec2(dxn * 0.9 + float(js) * 7.0, k * 2.3));   // rivi 111: kinos ikihongan tyvellä
        float aT = smoothstep(pw, -pw, abs(dxn) - rw) * step(-0.05, hy) * farF * (1.0 - smoothstep(0.55, 0.80, hnp));
        float u = clamp(dxn / rw, -1.0, 1.0);
        float fur = 0.55 * vnoise(vec2(u * 9.0 + float(js) * 3.0, hy * 0.20)) + 0.45 * vnoise(vec2(u * 3.0 + 2.0, hy * 0.9 + float(js)));
        vec3 bark = HAMY * (0.35 + 1.5 * fur);
        float rim = pow(abs(u), 3.0) * smoothstep(-0.15, 0.55, sgn * u);
        if (DBG == 6) rim = 0.0;
        float shl = shaftH(tx, yw, zk);
        bark += gcol * I * rim * shl * 0.60 * exp(-zr / 70.0);
        float tl = uTop.x * sstep(uTop.y - 7.0, uTop.y, ya);
        bark += DLC * tl * 0.06 * smoothstep(0.55, 1.0, fur) * (1.0 - abs(u));
        float bl = 0.045;   // vedos 8 (kriitikko): perushohde himmeämmäksi, askelten syke ennallaan
        for (int q = 0; q < 6; q++) if (abs(uBl[q].x - float(js)) < 0.5) bl += uBl[q].z * 0.9 * smoothstep(0.0, 0.35, uBl[q].y) * exp(-uBl[q].y * 1.5);
        float bn = vnoise(vec2(hy * 3.1 + float(js), dxn * 5.0)) - 0.5, bn2 = vnoise(vec2(hy * 9.0, dxn * 11.0 + 3.0)) - 0.5;
        float bm = smoothstep(0.05, -0.04, abs(dxn + sd * rw * 0.42 + 0.03 * bn) - (0.07 + 0.03 * smoothstep(1.6, 2.2, hy) * (1.0 - 0.8 * smoothstep(2.2, 2.7, hy)) + 0.03 * bn2)) * smoothstep(1.35 + 0.1 * bn, 1.65, hy) * smoothstep(2.85 + 0.12 * bn2, 2.55, hy) * step(abs(u), 0.97);
        float pk = smoothstep(7.0, 15.0, zr);   // vedos 8 (P3): pilkka on merkki polulla kaukana; aivan kameran vierellä se näyttäisi kasvolta, joten se häipyy pehmeästi lähestyessä
        bm *= pk;
        if (DBG == 3) bm = 0.0;
        bark = mix(bark, HOPEA * bl * (0.55 + 0.7 * vnoise(vec2(dxn * 14.0, hy * 0.7))), bm * 0.85);   // vedos 8 (P3): kaarnan suuntainen pystyjuova, ei läikkää
        bark += HOPEA * bl * 0.10 * exp(-pow((hy - 2.1) / 1.5, 2.0)) * exp(-pow((dxn + sd * rw * 0.42) / 0.22, 2.0)) * (1.0 - bm) * pk;
        // rivi 125: sama kinos ikihongan juurella
        col = mix(col, bark, aT);
        if (zr < 45.0 && hy < 0.6) { float khP = kinP * (1.0 - smoothstep(rw * 0.5, rw + 0.7, abs(dxn)));
          col = mix(col, groundCol(vec3(wx, gT, zk), zr, rd, Lw, ang), smoothstep(khP + 0.04 + pw, khP - 0.04 - pw, hy) * step(0.012, khP) * step(-0.05, hy) * farF); }
        // latvus: alhaalta leveä, ylöspäin kapeneva tumma massa; yötaivas ja lumi näkyvät latvusten välistä
        float skp = smoothstep(0.38, 0.55, hnp) * (1.0 - smoothstep(0.96, 1.02, hnp));
        float Bp = (2.4 + 0.4 * float(js % 3)) * pow(max(1.0 - hnp * 0.97, 0.0), 0.7) * (0.75 + 0.5 * vnoise(vec2(hy * 0.45 + float(js) * 3.0, 1.7)));
        float aCp = skp * farF * smoothstep(0.6, -0.6, abs(dxn) - rw - Bp + (vnoise(vec2(wx * 3.0, yw * 0.8 + float(js))) - 0.5) * 0.8);
        col = mix(col, HAMY * (0.5 + 0.9 * vnoise(vec2(wx * 1.1 + k, yw * 0.8))), aCp * 0.96);
      }
    }

    // vedos 8 (rivi 135, taika): oksalta putoava lumi: ensin tiivis valuma, joka hajoaa pölyksi ja laskeutuu maahan; hienovarainen, vain valossa näkyvä
    for (int e = 0; e < 3; e++) { vec4 ev = uOk[e]; if (ev.w <= 0.0 || abs(k - ev.y) > 0.5 || ev.z > 2.8 || okCi[e] < -1e4) continue;
      vec4 o = okP[e]; float a = ev.z;
      float bx = o.x + o.w * 1.35, y0 = o.y + o.z;
      float fall = 0.45 * a + 2.3 * a * a, aa = max(a - 0.28, 0.0);
      float rg1 = vnoise(vec2(wx * 2.6 + bx * 1.7, y0 * 0.7)) - 0.5, rg2 = vnoise(vec2(wx * 3.4 - bx * 1.3, y0 * 1.3 + 4.0)) - 0.5;   // vedos 8 (kriitikko B1): rosoinen rintama
      float yB = y0 - 0.10 - fall + (0.25 + 0.60 * a) * rg1, yT = y0 - 0.15 - 0.8 * aa - 2.0 * aa * aa + (0.20 + 0.40 * a) * rg2;
      float w = 0.20 + 0.32 * a + 0.08 * max(y0 - yw, 0.0), cx = bx + o.w * 0.15 * a + 0.10 * a - uOkD[e];   // rivi 153: tuuli kuljettaa valumaa
      float gG = gnd(wx, zk);
      float D = smoothstep(yB - 0.30, yB + 0.30, yw) * smoothstep(yT + 0.25, yT - 0.25, yw) * exp(-pow((wx - cx) / w, 2.0))
              * smoothstep(0.0, 0.06, a) * (1.0 - smoothstep(1.4, 2.7, a)) * smoothstep(gG - 0.05, gG + 0.35, yw);
      if (D <= 0.001) continue;
      // pöly on pieniä pyöreitä hiutaleita (ei kohinan ruutuja), jotka putoavat valuman mukana, ja niiden alla ohut pehmeä utu
      float fl = 0.0;
      for (int g = 0; g < 2; g++) { float sc = g == 0 ? 9.0 : 6.7, pr = g == 0 ? 0.28 : 0.22;   // vedos 8 (kriitikko B1): kaksi hilaa eri mittakaavassa (ei ruudukkoa); rivi 153: tiheämpi, koska harvinainen
        vec2 pq = vec2((wx + uOkD[e]) * sc + float(e) * 17.0 + 13.7 * float(g), (yw + fall * (0.80 + 0.10 * float(g))) * sc), pc = floor(pq), pf = fract(pq);
        if (hash(pc + 3.1 * float(e) + 2.1 * float(g)) < pr) { vec2 c0 = 0.15 + 0.7 * vec2(hash(pc + 1.3 + float(g)), hash(pc + 7.7 - float(g))); float rr2 = max(0.16, pw * sc * 0.9); fl = max(fl, smoothstep(rr2, rr2 * 0.3, length(pf - c0))); } }
      col += SNOWC * ev.w * D * (0.06 + 0.95 * fl) * (0.30 + 0.70 * I * shaftH(wx, yw, zk)) * exp(-zr / 50.0) * farF;
    }

    // vedos 8 (rivi 148): askelten lumen variseminen (taika T3) poistettu: käyttäjä: "NE EIVÄT SAA TAPAHTUA MUUTEN". Askeleen valo jää (Tapion askeleet).

    // suuri petäjä: kiteen kantaja, loppukulun kohde (oma kerroksensa)
    if (special) {
      vec2 Ep = vec2(uEnd.x, gnd(uEnd.x, zk) + uEnd.z);
      vec2 q = vec2(wx, yw);
      // latvuksen aukosta tuleva hallan valo kirkastuu (D-duuri): pehmeä, vaalea huurremassa kiteen ympärillä, ei viivoja eikä piikkejä
      float rE = length(q - Ep);
      float facFade0 = sstep(uT1 - 3.0, uT1 - 0.5, uTime);
      float gapL = clamp(0.30 + 0.70 * uTop.x, 0.0, 1.0);
      float soft = 0.75 + 0.5 * vnoise(q * 2.2 + 3.0);
      col += HALLA * gapL * soft * (0.34 * exp(-rE * rE / 0.55) + 0.09 * exp(-rE / 2.4)) * (1.0 - facFade0);
      // kide
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

    // hiutaleet: tummassa usvassa kohtuullinen lumisade. Paikka on vakionopeuden kertymä (alas 0,5 m/s, sivulle 0,10 m/s yhteen suuntaan; Y2).
    // Alttoviulujen fraasi (kommentti) kasvattaa lumen määrää ja kirkkautta pehmeästi (nousu 0,5 s, lasku 1 s): ei siirrä eikä käännä lunta.
    float ex = 0.0;
    {
      if (uAl[0].y + uAl[1].y + uAl[2].y + uAl[3].y > 0.0) {
        for (int i3 = 0; i3 < 4; i3++) { vec4 pa = uAl[i3]; if (pa.y <= 0.0) continue;
          float zc = pa.z + 9.0 + 7.0 * pa.w, xc = laneX(zc) + (pa.w - 0.5) * 5.0;
          float env = smoothstep(0.0, 0.8, pa.x) * (1.0 - smoothstep(1.4, 3.4, pa.x));
          ex = max(ex, pa.y * env * exp(-pow((zk - zc) / 11.0, 2.0)) * exp(-pow((wx - xc) / 8.0, 2.0)) * exp(-pow((ya - 6.0) / 8.0, 2.0))); }
      }
    }
    if (zr < 46.0) {
      vec2 fq = vec2(wx + 0.10 * ts + uAv.x, yw + 0.5 * ts - uAv.y + 3.7 * k) * 1.1;
      vec2 ic = floor(fq), fr = fract(fq);
      float hh = hash(ic + k * 1.37);
      float thr = 0.040;                 // rivi 110: kommentti ei lisää hiutaleita (uudet hiutaleet välkkyivät), vain valaisee olemassa olevia
      if (hh < thr) {
        vec2 c0 = 0.2 + 0.6 * vec2(hash(ic + 1.7), hash(ic + 5.3));
        float rf = max(0.0020 * zr / F, 0.002);
        float shA = 0.55 + 0.8 * shaftH(wx, yw, zk);
        col += SNOWC * 0.40 * (1.0 + 1.2 * ex * shA) * smoothstep(0.0, 0.015, thr - hh) * smoothstep(rf, rf * 0.3, length(fr - c0) / 1.1) * smoothstep(48.0, 28.0, zr) * smoothstep(0.8, 2.5, zr);
      }
    }

    // usvalaatta tämän kerroksen ja seuraavan lähemmän välissä: ääni ei muuta sen paikkaa, vain valon
    float seglen = DZ * length(r) / r.z;
    float dens = 0.0115 * (0.50 + 1.0 * exp(-max(ya, 0.0) / 3.0)) * (1.0 + 0.16 * (uFx.y - 0.5));
    float part = 0.0;
    for (int i2 = 0; i2 < 4; i2++) { vec4 pu = uPulse[i2]; if (pu.y <= 0.0) continue;
      float zc = pu.z + 14.0 + 16.0 * pu.x;
      part += pu.y * smoothstep(0.0, 0.25, pu.x) * exp(-pu.x * 1.3) * exp(-pow((zk - zc) / 6.0, 2.0)) * exp(-pow((wx - lane) / 8.0, 2.0)); }
    part = min(part, 1.0);
    float tcl = 1.2 - 0.6 * clamp(zr / 50.0, 0.0, 1.0);          // alun usva ohenee: kaukaa ensin, läheltä viimeisenä (yhden sekunnin sisällä)
    dens *= (1.0 - 0.45 * part) * (1.0 + 6.0 * (1.0 - sstep(tcl - 0.9, tcl, ts)));
    float T = exp(-dens * seglen);
    float ph = 1.1 * exp(-ang * 190.0) + 0.28 * exp(-ang * 24.0) + 0.05 * exp(-ang * 3.0);
    float sh = mix(shaftH(wx, yw, zk), 0.6, 0.7 * up);   // katse ylös: ei valoviiruja
    float topV = 0.25 + 0.75 * smoothstep(0.0, 14.0, ya);
    vec3 Lf = AMB * (0.85 - 0.30 * uFx.x + 0.15 * uFx.y)
            + gcol * I * (0.85 + 0.30 * uFx.y) * (1.0 + 0.35 * part) * ph * sh * (0.55 + 0.45 * exp(-max(ya, 0.0) / 6.0)) * (1.0 - 0.30 * uFx.x)
            + DLC * (uTop.x + 0.45 * uFx.z) * 0.07 * mix(shaftT(wx, yw, zk), 0.35, up) * topV;   // katse ylös: ei viirumaisia hunnutuksia
    Lf += HALLA * 0.16 * ex * (0.5 + 0.5 * sh);     // rivi 110: alttojen kommentti = usva hohtaa hetken pehmeästi kommentin kohdalla
    col = col * T + Lf * (1.0 - T);
  }

  // rajakuva: pimeä massa on oksisto, jonka läpi kamera laskeutuu. Oksakerrokset ovat linssin edessä (pehmeitä, epätarkkoja), laajenevat
  // kameran kulkiessa ja ohenevat kaukaisimmasta lähimpään; ensimmäinen ruutu on täsmälleen rajakuva.
  float cov = 0.0, covE = 0.0;
  for (int c = 0; c < 4; c++) {
    float fc = float(c);
    float ec = 0.55 + 0.13 * (3.0 - fc) * 1.0 + 0.0;                 // kerroksen loppuhetki: kaukainen (c=3) 0,55 s ... lähin (c=0) 0,94 s
    vec2 ctr = vec2(0.5 * asp, 0.5);
    vec2 q = ctr + (p - ctr) / (1.0 + (0.45 + 0.30 * (3.0 - fc)) * ts);
    float n = vnoise(vec2(q.x * 5.5 + fc * 7.0, q.y * 2.2 + fc * 2.0)) * 0.50 + vnoise(vec2(q.x * 13.0 + fc * 3.0, q.y * 5.0)) * 0.32 + vnoise(vec2(q.x * 30.0 + fc, q.y * 11.0)) * 0.18;
    n += 0.06 + 0.28 * smoothstep(0.2, 1.0, p.y) - 0.05 * fc;
    float cc = clamp(smoothstep(0.36, 0.60, n) + (1.0 - clamp(ts / 0.25, 0.0, 1.0)), 0.0, 1.0) * (1.0 - sstep(0.15 * ec, ec, ts));
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
  // hallan valo kohoaa rungoista latvoihin nousun mukana: valaistun alueen alareuna nousee 3 metristä 15 metriin (`uTop.y` = alareuna + 7)
  const hFront = (t) => 10 + 12 * sstep(TT - 0.3, TH, t);
  // alttoviulujen kommenttien alut: ohjaajan mittaamat (`fis_hengittaa.iskut_t`): keskirekisterin paisutukset, kun puhaltimet ovat hiljaa
  const fraasit = [];                                        // rivi 115: erillisten kommenttien lista poistettu (ensimmäinen mitattu kohta oli vaskien sointu); alttojen linja ohjaa hiutaleita jatkuvana
  // rivi 115: pieni ilmavirta alttojen tahtiin. Partituuri s. 7-9 (t. 52-95): alttoviulut div. in 4 soittavat ydinmotiivia kolmen tahdin fraaseina.
  // Voima = keskirekisterin jouset (jou), kaari = melodian korkeus suhteessa omaan hitaaseen keskiarvoonsa. Rivi 117: liike näkyvämmäksi: nosto enintään 0,60 m/s (hiutale leijuu ja nousee huipussa enintään 0,1 m/s), sivulle 0-0,20 m/s.
  const kaari = (t) => clamp((d.melodia(t, 0.9) - d.melodia(t, 5.0)) / 3.0, -1, 1);
  const altIkk = (t) => sstep(TA + 6.0, TA + 9.0, t) * (1 - sstep(T4 - 2.0, T4 + 2.0, t));
  // vedos 8 (rivi 134): nopeus kulkee epäsymmetrisen alipäästön läpi (kiihtyy tau 0,6 s, hidastuu tau 1,5 s): ilmavirta tulee pehmeästi ja
  // hiutaleet laskeutuvat hitaasti, kevyesti, kun alttoviulut vaikenevat (rivi 115); ei nykäyksiä
  const pehmea = (fn, tauUp, tauDown) => { const o = new Float32Array(d.NF); const f0p = Math.max(0, Math.round((T0 - 4) * FPS)), f1p = Math.min(d.NF - 1, Math.round((T1 + 4) * FPS));
    let y = fn(f0p / FPS); for (let f = f0p; f <= f1p; f++) { const x = fn(f / FPS); y += (x - y) * (1 - Math.exp(-1 / (FPS * (Math.abs(x) > Math.abs(y) ? tauUp : tauDown)))); o[f] = y; }
    o.fill(o[f0p], 0, f0p); o.fill(o[f1p], f1p + 1); return o; };
  const alttoA = (t) => clamp(jou(t) * (0.55 + 0.45 * kaari(t)), 0, 1) * altIkk(t);
  // vedos 8 (rivi 153): käyttäjä: "alttoviulu on se tuuli, joka liikuttaa sitä SATAVAA LUNTA MYÖS ... hellävaroen (dolce) ... nyt se on ihan staattinen".
  // Ennen nosto 0,46 m/s lähes pysäytti putoamisen (0,5 m/s), ja sivutuuli oli 0,10 m/s: lumi näytti staattiselta. Nyt alttoviulun tuuli kuljettaa lunta
  // sivulle enintään 0,42 m/s aina samaan suuntaan kuin perusajautuma (4d.32) ja keventää hieman (enintään 0,14 m/s), joten lumi putoaa koko ajan.
  const avX = pehmea((t) => 0.42 * alttoA(t), 0.6, 1.5), avY = pehmea((t) => 0.14 * alttoA(t) * (0.6 + 0.4 * Math.max(kaari(t), 0)), 0.6, 1.5);
  const kAvX = d.sarja((f) => avX[f] / FPS);
  const kAvY = d.sarja((f) => avY[f] / FPS);
  // vedos 8 (rivi 135, taika): oksa heilahtaa ja lumi putoaa alttoviulujen ilmavirran huipuissa (sama mitattu ajuri kuin yllä), vähintään 9 s välein,
  // enintään seitsemän kertaa kohdasta TA + 9,5 s nousuun asti. Paikka valitaan kameran reitistä alempana (OKSAT).
  const sAlt = d.sarja((f) => alttoA(f / FPS));
  const altS = (t) => d.ka(sAlt, t * FPS, 0.3 * FPS);
  // vedos 8 (rivit 148, 151): käyttäjä: "Ajoita ne tarkemmin alttoviulujen kommentteihin ... NE EIVÄT SAA TAPAHTUA MUUTEN. Eli lunta tippuu paljon harvemmin."
  // ja "efekti on tehokkaampi, kun sitä ei käytä koko ajan". Lumi tippuu vain alttoviulujen fraasin alussa (`fis_hengittaa.iskut_t`, mitattu partituurin tahdeista),
  // jokaisessa alttoviulujen kommentissa tahdista 53 (käyttäjä: "Tahti 53 eteenpäin alkaa") eikä koskaan muulloin; koko pienenee poco f:stä ppp:hen.
  const KOMM = (d.cues.cues.find((c) => c.id === 'fis_hengittaa') || {}).iskut_t || [];
  const OKHET = (() => { const out = []; let viime = -99; for (const tk of KOMM) { if (tk < a.valo_D_duuri + 21.1 + 2.0 || tk > T4 + 2.0) continue; out.push({ t: tk }); viime = tk; }
    // käyttäjä: "ne alkavat poco f ja pienenevät pois piano pianissimo asti": tipahdus pienenee kommentista toiseen (1,0 → 0,25)
    out.forEach((x, i) => { x.v = 1.0 - 0.75 * i / Math.max(out.length - 1, 1); }); return out; })();
  // usvan ajautuma: koneen kuulema liike nopeuttaa sitä (kertymä, ei nopeus kertaa aika)
  const lik = new Float32Array(d.NF);
  for (let f = 0; f < d.NF; f++) lik[f] = d.tapahtuu('liike', f / FPS) ? 1 : 0;
  const lsum = d.sarja((f) => lik[f]);
  const kFog = d.sarja((f) => (0.04 + 0.10 * d.ka(lsum, f, 1.5 * FPS)) / FPS);

  // ---- askeleet: matalan kaistan alut (d.alut) ja tiheämpi tunnistus askelten jaksolla ----
  const sm = d.sarja((f) => d.huippu(28, 47, f));
  const nAskel = (f) => d.huippu(28, 47, f) - Math.min(d.huippu(28, 47, f - 5), d.huippu(28, 47, f - 4), d.huippu(28, 47, f - 3), d.huippu(28, 47, f - 2));
  const omat = [];                                           // moduulin oma tunnistus (vedos 7b)
  { let viime = -99;
    for (let f = Math.floor((TA - 0.5) * FPS) + 8; f < Math.floor(T4 * FPS); f++) {
      const n = nAskel(f);
      if (n >= 0.06 && d.huippu(28, 47, f) > 0.2 && f - viime >= 34) { omat.push({ t: f / FPS, v: clamp(n / 0.2, 0.45, 1) }); viime = f; } } }
  // korjaus B: askellista = ohjaajan mittaamat kontrabassoalut (`askeleet_alkavat.iskut_t`) + oman tunnistuksen askeleet niiden jälkeen; alle 0,5 s toisistaan olevista iskut_t voittaa
  const mitatut = (d.cues.cues.find((c) => c.id === 'askeleet_alkavat').iskut_t || []).map((t) => {
    const f0m = Math.round(t * FPS); let n = 0; for (let f = f0m - 2; f <= f0m + 5; f++) n = Math.max(n, nAskel(f));
    return { t, v: clamp(n / 0.2, 0.45, 1) }; });
  const viimeMit = mitatut.length ? mitatut[mitatut.length - 1].t : -99;
  const askeleet = mitatut.concat(omat.filter((o) => o.t > viimeMit && mitatut.every((m) => Math.abs(m.t - o.t) >= 0.5))).sort((x, y) => x.t - y.t);
  window.askelLista = { ennen: omat.map((x) => +x.t.toFixed(2)), jalkeen: askeleet.map((x) => +x.t.toFixed(2)) };
  // vedos 8 (taika T2): ikkunat häämöttävät alttoviulufraasien välissä (fraasin loppu: voima laskee alle 0,12 oltuaan neljän sekunnin sisällä yli 0,30)
  // ja sammuvat seuraavaan askeleeseen (0,5 s); eivät D-duurin valon aikana (D0 ... D1). Ajat johdetaan äänestä alla (`IKK`), ei kovakoodattuja sekunteja.
  const IKK = (() => { const w = []; const lo = Math.max(TA + 6.0, a.valo_D_duuri + 21.1 + 0.5), hi = T4 - 2.0; let t = lo;
    while (t < hi) { let on = false; for (let u = t - 4.0; u < t; u += 0.1) if (altS(u) > 0.30) on = true;
      if (on && altS(t) < 0.12 && (!w.length || t - w[w.length - 1].e > 6.0)) {
        const nx = askeleet.map((x) => x.t).filter((x) => x > t)[0]; const e = Math.min(nx === undefined ? t + 6 : nx, t + 6.0, T4 - 0.5);   // sammuu seuraavaan askeleeseen
        if (e - t >= 1.5) { w.push({ s: t, e }); t = e; continue; } }
      t += 0.1; }
    return w; })();
  const ikkA = (t) => { let v = 0; for (const x of IKK) v = Math.max(v, sstep(x.s, x.s + 2.0, t) * (1 - sstep(x.e, x.e + 1.5, t))); return v; };   // rivi 151: valot esiin ja pois sulavasti
  window.ikkunat = IKK.map((x) => ({ s: +x.s.toFixed(2), e: +x.e.toFixed(2) }));

  // ---- kamera: reitti lasketaan ruuduittain ----
  const V3 = 2.0, V4 = 3.0, PHI = 50 * Math.PI / 180, SB = 4.6;
  const KC = 0.32;                                           // nousu on vain osa matkasta: kamera jää latvusten alle (rungot päättyvät latvuksiin, eivät kuvan yläreunaan)
  const pitchAt = (t) => PHI * (0.28 * sstep(T4, TT, t) + 0.72 * sstep(TT - 1.0, TH, t));
  const eyeAt = (t) => 1.6 - 1.0 * sstep(TA, TA + 7.0, t);
  const vAt = (t) => V3 + (V4 - V3) * sstep(T4, T4 + 8.0, t);
  const f0 = Math.floor(T0 * FPS), fB = Math.ceil(TH * FPS);
  const zr = new Float64Array(fB - f0 + 2), hc = new Float64Array(fB - f0 + 2);
  for (let i = 1; i < zr.length; i++) { const t = (f0 + i - 1) / FPS, ph = pitchAt(t), v = vAt(t), dzz = v * Math.cos(ph) / FPS;
    zr[i] = zr[i - 1] + dzz; hc[i] = hc[i - 1] + v * Math.sin(ph) / FPS; }
  const lerpArr = (arr, t) => { const x = clamp(t * FPS - f0, 0, arr.length - 1.001), i = Math.floor(x); return arr[i] + (arr[i + 1] - arr[i]) * (x - i); };
  const iB = Math.round(TH * FPS) - f0;
  const zB = lerpArr(zr, TH), hB = eyeAt(TH) + KC * lerpArr(hc, TH);
  const zE = zB + SB * Math.cos(PHI), hE = hB + SB * Math.sin(PHI);
  const kP = Math.ceil((zE + 0.5) / DZ);
  const Z0 = kP * DZ - zE;                                   // kameran alku: kide on tasan kerroksella kP
  const Z1 = Z0 + zB;                                        // tästä eteenpäin polku on suora (loppukulku)
  const laneX = (z) => LANE * z + (2.2 * Math.sin(0.045 * z + 0.6) + 0.9 * Math.sin(0.11 * z + 2.0)) * (1 - sstep(Z1 - 25, Z1, z));
  const kk = V4 / SB;
  const cam = (t) => {
    if (t <= TH) { const z = Z0 + lerpArr(zr, t); return { x: laneX(z), z, h: eyeAt(t) + KC * lerpArr(hc, t), p: pitchAt(t) }; }
    const s = SB * Math.exp(-kk * (t - TH));
    return { x: laneX(Z1), z: Z0 + zE - s * Math.cos(PHI), h: hE - s * Math.sin(PHI), p: PHI };
  };
  const EX = laneX(Z1), EZ = kP * DZ;

  // ikihongat: sama kaava kuin varjostimessa (kokonaislukuaritmetiikka)
  const pineZ = (j) => (j * PL + ((j * 5 + 3) % PL)) * DZ;
  const hasPine = (j) => (j % 5) !== 2;
  const nextPine = (z) => { for (let j = Math.max(0, Math.floor(z / (PL * DZ)) - 1); j < 400; j++) if (hasPine(j) && pineZ(j) > z + 6) return j; return 0; };
  const evs = askeleet.map((x) => ({ t: x.t, v: x.v, j: nextPine(Z0 + lerpArr(zr, x.t)), z: Z0 + lerpArr(zr, x.t) }));
  // oksat: kohde 12,5-16 m kameran edessä, polun puolet vuorotellen; ikihongan kerros ohitetaan (jättiläinen peittäisi kuusen)
  const onPine = (kk) => { const js = Math.floor(kk / PL); return kk === js * PL + ((js * 5 + 3) % PL) && hasPine(js); };
  const OKSAT = OKHET.map((x, i) => { const sd = fract(x.t * 7.13), zc = Z0 + lerpArr(zr, x.t), zT = zc + 12.5 + 3.5 * sd;
    let kE = Math.round(zT / DZ); if (onPine(kE)) kE += 1;
    // ikihonka polun vierellä peittäisi kuusen: valitaan polun se puoli, jolla lähin ikihonka ei ole kameran ja kuusen välissä
    const jp = nextPine(zc - 6), pz = pineZ(jp), psd = jp % 2 === 0 ? -1 : 1;
    const side = pz < zT + 4 ? -psd : (i % 2 === 0 ? 1 : -1);
    return { t: x.t, k: kE, xo: side * (4.4 + 1.2 * sd), w: x.v }; });
  window.oksat = OKSAT.map((o) => ({ t: +o.t.toFixed(2), k: o.k, xo: +o.xo.toFixed(2) }));

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
    const al = new Float32Array(16), ai = fraasit.filter((e) => e.t <= t && t - e.t < 3.5).slice(-4);
    ai.forEach((e, i) => al.set([t - e.t, e.v, Z0 + lerpArr(zr, e.t), e.s], i * 4));
    gl.uniform4fv(U('uAl'), al);
    gl.uniform2f(U('uAv'), d.kohta(kAvX, t), d.kohta(kAvY, t));
    const ok = new Float32Array(12), oi = OKSAT.filter((o) => o.t <= t && t - o.t < 9.0).slice(-3);
    oi.forEach((o, i) => ok.set([o.xo, o.k, t - o.t, o.w], i * 4));
    gl.uniform4fv(U('uOk'), ok);
    const okd = new Float32Array(3); oi.forEach((o, i) => { okd[i] = d.kohta(kAvX, t) - d.kohta(kAvX, o.t); }); gl.uniform1fv(U('uOkD'), okd);
    gl.uniform4f(U('uWn'), 0, 0, 0, 0);   // vedos 8 (rivi 153): ikkunat pois: ne seurasivat alttoviulujen taukoja ja askelia, tyyliohjeen 4d.11 mukaan ikkunat ovat käyrätorvien
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
      askelAika: askeleet.map((e) => +e.t.toFixed(1)).join(' '), alttoFraaseja: fraasit.filter((e) => e.t <= t).length, alttoAlut: fraasit.filter((e) => e.t > t - 3.5 && e.t <= t).map((e) => +e.t.toFixed(2)).join(' ') }; },
    seek: seekT,
  });
}
alusta().catch((e) => { console.error(e); window.sceneError = String(e.message || e); });
