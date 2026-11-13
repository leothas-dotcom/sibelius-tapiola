// Tapiola: maailmat 11 (Huuto ja jälki) ja 12 (Oikea valo), ankkurista huuto tiedoston loppuun.
// Alkaa rajakuvasta LUMI (myrskyn vaalea seinä, visual/yhteinen.js); loppurajakuvaa ei ole: kuva jää.
// Suunnitelma: docs/kuvakasikirjoitus.md "Kaksitoista maailmaa" 11 ja 12 sekä "Loppu: tähän se loppui"; säännöt: tyyliohje 4d ja 12.
// - Katsoja on noussut myrskyn läpi latvojen yläpuolelle. Seinä harvenee alhaalta ylös ja alta avautuu koko metsä ylhäältä:
//   kuusten matto, joka jatkuu sileään vaaraan asti. Metsä on korkeuskenttä (kuusikruunut tasoina, lumi tasoilla), jonka
//   muodon tekevät valo ja varjo; kaukana se sulaa usvaan. Mikään metsän osa ei liiku äänen mukana.
// - Alun kuva kokonaisena: sama horisontin valo, sama sileä vaara ja Tapion talon ikkunat kuin maailmassa 1 (sama profiili
//   ja ikkunoiden paikat, pienennettynä), nyt ylhäältä. Gis-horisontti muodostaa mäkiä melodian kaaren mukaan.
// - Maailma 11: huuto nostaa horisontin valon korkeuteen; revontulet syttyvät tässä ja vain tässä, laskeutuvat kohti lunta,
//   jousten tremolo on niiden väre. Maailma 12: kamera hidastuu S:stä ja pysähtyy H-duurin alussa; kajo nousee horisontin
//   takaa ja kulkee metsän yli latva latvalta kohti katsojaa; revontulet himmenevät; basson viimeiset askeleet ovat valoa maassa.
//   Musiikin loputtua äänen elementit lakkaavat, mutta kuva ei pimene: lumi sataa ja usva liikkuu tiedoston loppuun.
// Kohtaus on puhdas aikafunktio seek(t): kaikki keskiarvot ja kertymät lasketaan alussa ruuduittain.
import { lataa, luoGL, julkaise, FS_ALKU, GLSL_YHTEINEN, FS_LOPPU, clamp, smooth, sstep, fract, lerp } from './yhteinen.js';

const FS = FS_ALKU + `
uniform float uTime, uCamX, uCamZ, uCamH, uHor, uWallK, uGlow, uGlowH, uLint, uLow, uKajoK, uKajoF, uWaveS, uWaveZ;
uniform float uSway, uAur, uAurLow, uTrem, uCloud, uStarK, uWindow, uPen, uDrift, uFogL, uElev, uSv;
uniform vec4 uSnow;        // tiheys, sivutuulen matka, putoamisen matka, lähestymisen matka
uniform vec2 uAurW;        // vedos 8 (rivi 164): revontulen läpi kulkeva aalto: paikka (-1..1 kuvan leveydellä), korkeus (kuvan korkeuksina)
uniform float uHill[32];   // horisontin kummut: melodian kaari, piirtyy vasemmalta oikealle
uniform vec4 uPulse[6];    // matalan kaistan paino: ikä, voima, -, -
const float F = 1.07;
const float CELL = 6.4;
const vec3 SKY_TOP = vec3(0.003, 0.005, 0.012), SKY_LOW = vec3(0.012, 0.022, 0.044);
const vec3 NEEDLE = vec3(0.0042, 0.0085, 0.0100);         // hämy: havun tumma sinivihreä
const vec3 SNOWA = vec3(0.60, 0.69, 0.82);                // halla: lumi
const vec3 AMB = vec3(0.050, 0.080, 0.130);               // taivaan valo
const vec3 AURC = vec3(0.10, 0.50, 0.34);                 // revontulet: kylmä vihertävä halla, ei kirkas
const vec3 SNOWC = vec3(0.55, 0.62, 0.75);
const vec3 WARM = vec3(1.0, 0.76, 0.52);                  // kajo: lämmin, pehmeä (vain maailma 12)
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

// ---------- maasto ja latvusto: korkeuskenttä, kuusikruunut tiereittäin ----------
float terr(vec2 xz) { return 6.5 * vnoise(xz * 0.0031) + 2.0 * vnoise(xz * 0.011 + 7.0); }
// det 1 = kaikki yksityiskohdat, 0 = sileä kartio; lod 1 = vain tiheyden keskikorkeus (kaukana)
float canopyH(vec2 xz, float det, float lod, out float cid, out float crel) {
  float E = terr(xz), h = 0.0; cid = 0.5; crel = 0.0;
  float dens = smoothstep(0.16, 0.48, vnoise(xz * 0.0085 + 3.0)) * (0.85 + 0.55 * smoothstep(0.30, 0.65, vnoise(xz * 0.03 + 9.0)));
  dens = 0.34 + 0.66 * clamp(dens, 0.0, 1.0);
  if (lod >= 1.0) return E + dens * 24.0;
  xz = mat2(0.8776, -0.4794, 0.4794, 0.8776) * xz;
  vec2 ic = floor(xz / CELL - 0.5);
  for (int j = 0; j < 2; j++) for (int i = 0; i < 2; i++) {
    vec2 c = ic + vec2(float(i), float(j));
    float r1 = hash(c), r2 = hash(c + 17.3), r3 = hash(c + 41.7);
    if (r3 > dens * 1.08 + 0.06) continue;                              // aukot, suot ja harvat kohdat
    vec2 ctr = (c + 0.5 + 0.85 * (vec2(r1, r2) - 0.5)) * CELL;
    float stand = vnoise(ctr * 0.0060 + 11.0);                          // vanhan metsän laikut
    float ht = (17.0 + 18.0 * stand) * (0.72 + 0.28 * r1) * mix(0.40, 1.0, dens) + (r2 > 0.95 ? 3.0 : 0.0);
    float rad = (1.0 + 0.092 * ht) * (0.8 + 0.4 * r3);
    vec2 dv = xz - ctr;
    { // tuuli: latva taipuu tuulen mukana (kärki enemmän kuin tyvi), aalto kulkee maton yli; tuuli on musiikin voima
      float ph = dot(ctr, vec2(0.021, 0.034)) - uTime * 0.95 + 1.7 * vnoise(ctr * 0.012);
      float u0 = length(dv) / (1.0 + 0.092 * ht);
      vec2 sw = vec2(sin(ph), 0.55 * sin(ph * 0.8 + 1.0) + 0.25) * uSway * 2.2 * (ht / 30.0) * (1.25 - clamp(u0, 0.0, 1.0));
      dv -= sw; }
    float an = atan(dv.y, dv.x);
    float u = sqrt(dot(dv, dv) + 0.10) / (rad * (1.0 + 0.10 * sin(an * 3.0 + r1 * 6.0 + 1.0) + 0.06 * sin(an * 7.0 + r2 * 9.0)));
    if (u >= 1.0) continue;
    float nt = 5.0 + ht * 0.13, tt = u * nt, ti = floor(tt), f = fract(tt);
    float uq = (ti + mix(0.30 * f, 1.0, smoothstep(0.55, 0.97, f))) / nt;       // kerrokset: loivat hyllyt ja jyrkät reunat
    float uu = mix(u, uq, det);
    float hh = (ht * 1.10) * pow(max(1.0 - uu, 0.0), 1.15) - 0.25 * ht * 0.0;
    hh += det * 0.05 * (vnoise(xz * 1.7) - 0.5);
    if (hh > h) { h = hh; cid = r2 * 0.6 + r3 * 0.4; crel = clamp(hh / ht, 0.0, 1.2); }
  }
  return E + mix(h, dens * 24.0, lod);
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

// vaaran profiili (sama muoto kuin maailmassa 1, pienennettynä uSv:llä): talo ja kummut
float ridgeAt(float x, float asp, out float house) {
  float xd = asp * 0.64, xr = x - xd;
  house = 0.150 * exp(-pow(xr / 0.25, 2.0)) + 0.040 * exp(-pow((xr + 0.34) / 0.22, 2.0));
  float u = clamp(x / asp, 0.0, 1.0) * 31.0;
  float hh = 0.10 * prof(u - 1.6) + 0.20 * prof(u - 0.8) + 0.40 * prof(u) + 0.20 * prof(u + 0.8) + 0.10 * prof(u + 1.6);
  return (0.065 + house + hh) * uSv;
}

// kajon valaisema osuus kohdassa (etäisyys eteenpäin zrel, kruunun luku cid): latva latvalta, kauimmaisesta lähimpään
float kajoLit(float zrel, float cid) { return smoothstep(-40.0, 40.0, zrel + (cid - 0.5) * 220.0 - uKajoF); }

vec3 world(vec2 p, float asp, float dx, float dy) {
  vec3 ro = vec3(uCamX, uCamH, uCamZ);
  vec3 rd = normalize(vec3(dx, dy, F));
  float gx = asp * 0.14;                                                 // horisontin valon kohta: Tapion talon kohdalla
  float hz = exp(-pow((dx - gx) / 0.80, 2.0));
  vec3 glowc = mix(HALLA, WARM, uKajoK);
  float G = uGlow;
  vec3 fogBase = SALO * (1.0 - 0.45 * uKajoK) * (0.50 + 0.80 * G) * (1.0 + 0.9 * hz) + glowc * G * 0.040 * hz + WARM * uKajoK * (0.020 + 0.050 * hz);
  vec3 col;
  float asp2 = asp;
  if (dy > -0.0004) {
    // ----- taivas -----
    col = mix(SKY_LOW, SKY_TOP, smoothstep(0.0, 0.55, dy));
    // tähdet: näkyvät kun taivas on auki
    vec2 sg = p * 130.0; vec2 si = floor(sg); float sh = hash(si);
    float star = 0.0;
    if (sh > 0.986) { vec2 sf = fract(sg) - 0.5 - 0.3 * (vec2(hash(si + 1.0), hash(si + 2.0)) - 0.5);
      star = (0.25 + 0.75 * fract(sh * 91.0)) * exp(-dot(sf, sf) * 60.0) * (0.75 + 0.25 * sin(uTime * (0.6 + 2.0 * fract(sh * 13.0)) + sh * 50.0)); }
    // horisontin valo: pitkän äänen voima; korkeus seuraa pitkän äänen sävelkorkeutta (huudossa korkealla)
    float house; float hl = ridgeAt(p.x, asp, house);
    float above = dy - hl;
    float sH = 0.036 + 1.7 * (uGlowH - 0.045);
    float gl = exp(-max(above, 0.0) / sH) * 0.55 + 0.09 * exp(-max(above, 0.0) / (sH * 4.0));
    float hxz = 0.55 + 0.45 * exp(-pow((dx - gx) / 0.9, 2.0));
    // pilvet: myrskyn jäänne harvenee huudon jälkeen
    float cl = 0.0;
    { float yy = max(dy, 0.02); float tc = 900.0 / yy; vec2 xzc = vec2(uCamX, uCamZ) * 0.15 + vec2(dx, F) / yy * 900.0 * 0.9;
      float dn = fbm(xzc * 0.0011 + vec2(uDrift * 0.002, 0.0)) * 0.7 + 0.3 * fbm(xzc * 0.0036 + 4.0);
      cl = smoothstep(1.0 - uCloud - 0.10, 1.0 - uCloud + 0.14, dn) * smoothstep(0.015, 0.09, dy); }
    col += star * HALLA * 0.5 * uStarK * (1.0 - cl) * (1.0 - 0.8 * G * exp(-dy / 0.2));
    col = mix(col, mix(SKY_TOP * 2.2, SALO * 0.9, 0.5) , cl * 0.85);
    col += glowc * G * gl * hxz * (1.0 + 0.35 * cl) * (1.0 + 0.6 * uKajoK);
    // revontulet: vain tässä maailmassa; kaari tumman metsän ja vaaran yllä, verho riippuu alas ja laskeutuu kohti lunta
    if (uAur > 0.001) {
      float xn = p.x / asp * 2.0 - 1.0;
      float arcY = 0.12 + 0.12 * (1.0 - uAurLow) + 0.13 * (1.0 - xn * xn) * (1.0 - 0.35 * uAurLow) + 0.018 * sin(xn * 3.1 + uDrift * 0.012) + 0.012 * sin(xn * 7.3 + 1.0)
                 + uAurW.y * exp(-(xn - uAurW.x) * (xn - uAurW.x) / 0.32);   // puhaltimien linjan aalto kulkee kaaren läpi
      float dd = dy - arcY;
      float ext = 0.010 + 0.22 * uAurLow;                                  // verho ulottuu alemmas laskeutuessaan
      float ray = pow(vnoise(vec2(p.x * 38.0 + 0.6 * sin(uDrift * 0.006), 3.0)) * 0.6 + vnoise(vec2(p.x * 95.0, 9.0 + uDrift * 0.002)) * 0.4, 1.4);
      float rip = 0.5 + 0.5 * sin(p.x * 22.0 - uTime * 2.6 + 4.0 * vnoise(vec2(p.x * 6.0, uTime * 0.2)));   // väre kulkee kaarta pitkin: tremolo
      float vern = smoothstep(-ext, 0.0, dd) * (dd < 0.0 ? mix(0.30, 1.0, ray) : 1.0) * exp(-max(dd, 0.0) / (0.034 + 0.030 * ray));
      float fade = smoothstep(0.00, 0.10, dy - hl * 0.6);
      float amp = uAur * (0.50 + 0.50 * ray) * (1.0 - uTrem * 0.55 + uTrem * 0.9 * rip);
      col += AURC * amp * vern * fade * (1.0 - 0.7 * cl);
    }
    // ----- vaara: sileä, jääkauden muokkaama; laella Tapion talo, havuhattu -----
    float hat = (0.010 + 0.012 * smoothstep(0.02, 0.12, house)) * uSv * 0.45;   // vedos 8 (rivi 165): laki sileä, ei latvojen kärkiä ("Noita piikikkäitä mäkiä ei suomessa ole")
    float edge = above - hat;
    if (edge < 0.0) {
      vec3 body = mix(fogBase * 0.62, fogBase * 1.05 + glowc * G * 0.02, smoothstep(-0.10 * uSv, 0.0, edge));
      body = mix(fogBase * 0.80, body, smoothstep(0.0, 0.06 * uSv + 0.01, dy));
      float fine = 0.93 + 0.14 * vnoise(vec2(p.x * 38.0, dy * 70.0));       // pehmeä havutekstuuri
      col = body * fine;
      for (int i = 0; i < 6; i++) {
        vec2 wp = vec2(asp * 0.64 + uSv * (-0.050 + 0.050 * float(i % 3) + 0.010 * float(i / 3)), uSv * (0.100 + 0.046 * float(i / 3) + 0.008 * sin(float(i) * 2.3)));
        vec2 d = (vec2(p.x, dy) - wp) / (uSv * vec2(0.0036, 0.0060));
        float tw = 0.60 + 0.40 * sin(uTime * (0.5 + 0.13 * float(i)) + float(i) * 1.9);
        col += mix(HOPEA, WARM, uKajoK) * uWindow * tw * (1.2 * exp(-pow(dot(d, d), 1.6)) + 0.07 * exp(-dot(d, d) * 0.06));
      }
    }
    col += glowc * G * 0.16 * exp(-pow(edge / (0.0075 * uSv), 2.0)) * (1.0 + 0.9 * exp(-pow((p.x / asp - uPen) / 0.07, 2.0)));
  } else {
    // ----- metsä ylhäältä: säde kamerasta latvuston pintaan -----
    float tstart = max((uCamH - 52.0) / max(-rd.y, 1e-4), 2.0);
    float t = tstart, tp = t;
    bool hit = false;
    float cidH = 0.5, crelH = 0.0;
    for (int i = 0; i < 200; i++) {
      if (t > 1500.0) break;
      vec3 q = ro + rd * t;
      float lod = smoothstep(520.0, 1000.0, t), det = 1.0 - smoothstep(110.0, 300.0, t);
      float c1, c2; float dh = q.y - canopyH(q.xz, det, lod, c1, c2);
      if (dh < 0.03) { hit = true; break; }
      tp = t; t += max(0.25 + t * 0.003, dh * 0.30) * (1.0 + t * 0.004);
    }
    col = fogBase;
    float zrefl = 1.0;
    if (hit) {
      float lod = smoothstep(520.0, 1000.0, t), det = 1.0 - smoothstep(110.0, 300.0, t);
      for (int i = 0; i < 6; i++) { float tm = 0.5 * (tp + t); vec3 q = ro + rd * tm; float c1, c2; if (q.y - canopyH(q.xz, det, lod, c1, c2) < 0.03) t = tm; else tp = tm; }
      vec3 q = ro + rd * t;
      float h0 = canopyH(q.xz, det, lod, cidH, crelH);
      float E = terr(q.xz);
      float e = 0.20 + t * 0.0016;
      vec3 n = normalize(vec3(canopyQ(q.xz - vec2(e, 0.0), det, lod) - canopyQ(q.xz + vec2(e, 0.0), det, lod), 2.0 * e, canopyQ(q.xz - vec2(0.0, e), det, lod) - canopyQ(q.xz + vec2(0.0, e), det, lod)));
      float hab = h0 - E;                                                    // korkeus maasta
      float zrel = q.z - uCamZ;
      float lit = kajoLit(zrel, cidH);                                       // kajo on jo tässä latvassa
      // valo tulee matalalta horisontin valon suunnasta
      float az = 0.80;
      vec3 L = normalize(vec3(sin(az) * cos(uElev), sin(uElev), cos(az) * cos(uElev)));
      // varjo: valon suuntaan; vain lähellä (kaukana ei erotu)
      float sh = 1.0;
      if (t < 700.0) { float s = 0.9; for (int i = 0; i < 9; i++) { vec3 ql = q + vec3(0.0, 0.05, 0.0) + L * s;
          float c1, c2; sh = min(sh, clamp((ql.y - canopyH(ql.xz, 0.0, smoothstep(400.0, 700.0, t), c1, c2)) / (0.16 * s) + 0.5, 0.0, 1.0)); s *= 1.85; } }
      // ympäröivä varjostus: kruunun ja aukon ero
      float rr = 3.2 + 0.01 * t;
      float ring4 = 0.25 * (canopyQ(q.xz + vec2(rr, 0.0), det, lod) + canopyQ(q.xz - vec2(rr, 0.0), det, lod) + canopyQ(q.xz + vec2(0.0, rr), det, lod) + canopyQ(q.xz - vec2(0.0, rr), det, lod));
      float ao = clamp(0.62 + 0.42 * (h0 - ring4) / 7.0, 0.20, 1.0);
      float tree = smoothstep(0.4, 2.0, hab);
      float tread = smoothstep(0.30, 0.72, n.y);
      float snowAmt = mix(1.0, clamp(0.18 + 0.55 * tread + 0.65 * smoothstep(0.50, 0.92, crelH) * (0.7 + 0.3 * vnoise(q.xz * 0.35 + 3.0)), 0.0, 1.0) * (0.70 + 0.30 * fract(cidH * 37.0)), tree);
      snowAmt = mix(snowAmt, 0.55 + 0.4 * tread, smoothstep(300.0, 700.0, t) * 0.0);
      float farK = smoothstep(420.0, 900.0, t);
      float densF = smoothstep(0.16, 0.48, vnoise(q.xz * 0.0085 + 3.0));
      snowAmt = mix(snowAmt, mix(1.0, 0.30 + 0.25 * vnoise(q.xz * 0.05), densF), farK);
      vec3 alb = mix(NEEDLE, SNOWA, clamp(snowAmt, 0.0, 1.0));
      float dif = max(dot(n, L), 0.0) * sh;
      float rim = pow(1.0 - max(dot(n, -rd), 0.0), 3.0) * max(dot(normalize(rd.xz), normalize(L.xz)), 0.0);
      vec3 lc = mix(HALLA, WARM, lit * uKajoK);
      float pool = 0.55 + 0.95 * smoothstep(0.30, 0.75, vnoise(q.xz * 0.011 + 5.0));
      float lint = uLint * pool * (1.0 + 0.8 * uKajoK);
      lint += uWaveS * exp(-pow((zrel - uWaveZ) / 110.0, 2.0)) * 1.3;
      vec3 lightc = lc * lint * (1.0 + 2.6 * lit * uKajoK) * (1.5 * dif + 0.60 * rim * (0.35 + 0.65 * sh) + 0.55 * pow(n.y, 1.6) * (0.4 + 0.6 * sh)) * (0.55 + 0.45 * smoothstep(0.0, 14.0, hab));
      // painon valo maassa: aukoissa ja tyvellä; patarummun ja basson alut ja askeleet kulkevat kehänä
      float low = uLow * (0.5 + 0.5 * (1.0 - smoothstep(0.0, 9.0, hab))) * (1.0 - 0.4 * sh);
      float ring = 0.0;
      for (int i = 0; i < 6; i++) { vec4 pu = uPulse[i]; if (pu.y <= 0.0) continue;
        float rg = length(q.xz - vec2(uCamX, uCamZ + 35.0)) - pu.x * 60.0; ring += pu.y * exp(-pu.x * 0.65) * exp(-rg * rg / 380.0); }
      float gr = (1.0 - smoothstep(0.0, 10.0, hab)) * 0.8 + 0.2;
      vec3 c = alb * (AMB * (0.45 + 0.75 * n.y) * ao * (1.0 + 0.9 * uAur * AURC.g * 2.0) + lightc * ao
                      + mix(HALLA, WARM, uKajoK) * (0.050 * low + 0.075 * ring * gr) * (0.4 + 0.6 * n.y))
              + AURC * uAur * 0.045 * clamp(n.y, 0.0, 1.0) * snowAmt * ao;
      // usva: laikuttaista, ajelehtii; laaksoissa sakeampaa; kajon valaisema usva on lämmin
      float mistP = vnoise(q.xz * 0.0042 + vec2(uDrift * 0.0014, uDrift * 0.0006));
      float pm = 0.70 + 0.9 * mistP;
      float mistTop = 9.0 + 17.0 * vnoise(q.xz * 0.0055 + vec2(uDrift * 0.0013, 3.0 - uDrift * 0.0007));
      float mistF = smoothstep(mistTop + 2.0, mistTop - 10.0, q.y) * 0.72;
      float fg = 1.0 - exp(-t / uFogL * pm * (1.0 + 1.5 * smoothstep(5.0, 0.5, E)));
      fg = 1.0 - (1.0 - fg) * (1.0 - mistF);
      vec3 fogc = fogBase + mix(HALLA, WARM, uKajoK) * (0.030 * uKajoK * lit) + vec3(0.8, 0.9, 1.0) * uWaveS * 0.02 * exp(-pow((zrel - uWaveZ) / 140.0, 2.0));
      col = mix(c, fogc, fg);
      col = mix(col, fogBase * 0.80, smoothstep(-0.03, 0.0, dy));
    } else {
      float zrel = 1500.0;
      col = fogBase * 0.80;
    }
  }
  // lumi ilmassa
  for (int s = 0; s < 8; s++) { float zz = 1.5 + mod(float(s) * 5.5 - uSnow.w, 44.0); col += SNOWC * snowAt(s, zz, dx, dy) * (0.55 + 0.9 * uGlow * 0.5); }
  return col;
}

vec3 scene(vec2 p) {
  float asp = uRes.x / uRes.y;
  float dx = p.x - asp * 0.5, dy = p.y - uHor;
  vec3 wall = rajakuva(p, 4, uTime);
  // seinä harvenee alhaalta ylös: kohta, jossa kynnys ylittyy, paljastaa metsän; alussa koko ruutu on tasan rajakuva
  float th = 0.25 + 0.55 * p.y + 0.25 * (vnoise(p * vec2(5.0, 3.5) + vec2(uTime * 0.05, 3.0)) - 0.5);
  float a = 1.0 - smoothstep(th - 0.10, th + 0.10, uWallK);
  if (a >= 0.9995) return wall;
  vec3 w = world(p, asp, dx, dy);
  // seinän jäänne: näkymä vaalean lumen läpi
  w = mix(w, wall * 0.9, a * (0.35 + 0.35 * smoothstep(0.0, 1.0, 1.0 - uWallK)) );
  return mix(w, wall, a);
}
` + FS_LOPPU;

async function alusta() {
  const d = await lataa();
  d.vaadi('huuto', 'yksinaiset_aanet', 'S_sempre_mf', 'loppuhuipennus', 'loppu_Hduuri_alku', 'viimeiset_askeleet', 'loppu_Hduuri_loppu', 'musiikki_loppuu', 'jouset_tulevat', 'hiljaisuus_1_alku');
  const A = d.aika, FPS = d.FPS;
  const T0 = A.huuto, T1 = A.yksinaiset_aanet, T2 = A.S_sempre_mf, T3 = A.loppuhuipennus, T4 = A.loppu_Hduuri_alku;
  const T5 = A.viimeiset_askeleet, T6 = A.loppu_Hduuri_loppu, T7 = A.musiikki_loppuu, TE = A.tiedoston_loppu;
  const ka = (s, t, w) => d.ka(s, t * FPS, w * FPS);
  // vedos 8 (rivi 164): puhaltimien linja nousee ja laskee (ankkuri S_puhaltimien_kaari, 16:32,5-16:39,8) ja heiluttaa revontulta, vain tässä kohdassa.
  // Linja (käyttäjä: "tuo c - d - e - fis linja", kokosävelaskelin ylös ja takaisin) mitataan spektristä: kaistat midi 84-92 (mittauksessa askeleet
  // osuvat kaistoille 85, 87, 89, 91), joista 8 s:n mediaani (pitkät äänet) on vähennetty; liikkuvan äänen painopiste ruuduittain,
  // aukot täytetty, 0,5 s:n liukuva keskiarvo kahdesti; 0 = linjan alin, 1 = ylin. Reunoilla 0,8 s:n pehmeä alku ja loppu.
  const KAARI = (() => { const o = new Float32Array(d.NF), cK = d.cues.cues.find((c) => c.id === 'S_puhaltimien_kaari'); if (!cK || cK.t_end == null) return o;
    const fa = Math.round(cK.t * FPS), fb = Math.round(cK.t_end * FPS), n = fb - fa + 1, cen = new Float32Array(n).fill(NaN);
    const res = []; for (let m = 84; m <= 92; m++) { const r = new Float32Array(n); for (let i = 0; i < n; i++) { const f = fa + i; let s5 = 0; for (let j = -2; j <= 2; j++) s5 += d.db(m, f + j);
        const w = []; for (let j = -120; j <= 120; j += 4) w.push(d.db(m, f + j)); w.sort((p, q) => p - q); r[i] = s5 / 5 - w[w.length >> 1]; } res.push(r); }
    for (let i = 0; i < n; i++) { let sw = 0, sm = 0; res.forEach((r, k) => { const w = Math.max(r[i] - 6, 0); sw += w; sm += w * (84 + k); }); if (sw > 3) cen[i] = sm / sw; }
    let last = -1; for (let i = 0; i < n; i++) if (!isNaN(cen[i])) { if (last < 0) for (let j = 0; j < i; j++) cen[j] = cen[i]; else for (let j = last + 1; j < i; j++) cen[j] = cen[last] + (cen[i] - cen[last]) * (j - last) / (i - last); last = i; }
    if (last < 0) return o; for (let j = last + 1; j < n; j++) cen[j] = cen[last];
    const box = (x) => { const y = new Float32Array(n); for (let i = 0; i < n; i++) { let s = 0, c = 0; for (let j = Math.max(0, i - 7); j <= Math.min(n - 1, i + 7); j++) { s += x[j]; c++; } y[i] = s / c; } return y; };
    const sm2 = box(box(cen)); let lo = 1e9, hi = -1e9; for (const v of sm2) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
    for (let i = 0; i < n; i++) o[fa + i] = (sm2[i] - lo) / Math.max(hi - lo, 1) * sstep(0, 24, i) * (1 - sstep(n - 25, n - 1, i));
    return o; })();
  window.kaari = KAARI;
  const KAARI_T = (() => { const cK = d.cues.cues.find((c) => c.id === 'S_puhaltimien_kaari'); return cK && cK.t_end != null ? [cK.t, cK.t_end] : [0, 1]; })();

  // ----- kamera: nousu huudossa (ainoa nousu), tasainen ajo eteen ja viistoon, hidastuu S:stä ja pysähtyy H-duurin alussa -----
  const H0 = 58, H1 = 82;                                                  // kameran korkeus maasta (m): latvusto yltää enintään noin 51 m
  const V0 = 15, VXK = 0.22;                                              // vauhti eteen (m/s) ja viistoon (osuus)
  const vel = (t) => V0 * (1 - sstep(T2, T4, t));                           // hidastuu omasta tahdostaan, nolla pysähdyksessä
  const kZ = d.sarja((f) => vel(f / FPS) / FPS);
  const camZ = (t) => d.kohta(kZ, t), camX = (t) => VXK * camZ(t);
  const camH = (t) => lerp(H0, H1, smooth(clamp((t - T0) / (T1 - T0), 0, 1)));

  // ----- äänestä: hitaat signaalit -----
  const ind = (tyyppi) => d.sarja((f) => (d.tapahtuu(tyyppi, f / FPS) ? 1 : 0));
  const sTrem = ind('tremolo'), sLasku = ind('lasku'), sNousu = ind('nousu');
  const sPit = d.sarja((f) => d.pitkaSavel(f / FPS));
  const pitS = (t) => ka(sPit, t, 2.2);                                    // pitkän äänen sävelkorkeus hitaana (huudossa 80)
  const ener = (t) => clamp(d.koko(t, 1.0) * 1.15, 0, 1);                   // koko orkesterin voima (jouset ensisijaisesti)
  // kajon nousu ja eteneminen (maailma 12): H-duurin alusta; etenemisen reitti horisontilta katsojaan
  const kajoK = (t) => sstep(T4 - 0.5, T4 + 14, t);
  const kajoF = (t) => lerp(1700, -160, sstep(T4 + 1.0, T5 + 4, t));        // valaisemattoman rajan etäisyys: kasvaa -> pienenee
  const waveZ = (t) => lerp(1500, -100, sstep(T3 - 1, T4 - 2, t));          // loppuhuipennuksen aalto kulkee metsän yli
  const waveS = (t) => clamp(d.koko(t, 0.8) * 1.2, 0, 1) * sstep(T3 - 3, T3 + 1.5, t) * (1 - sstep(T4 - 3, T4 + 1, t));
  // matalan kaistan tapahtumat: alut (patarumpu, basso) ja askeleiden huiput (basson paisuvat sykkeet)
  const sLow = d.sarja((f) => d.matala(f / FPS, 0.35));
  const PULSSIT = [];
  for (const a of d.alut) if (a.t >= T0 - 1 && a.t <= T7) PULSSIT.push({ t: a.t, v: 0.9 * a.v });
  { const ts = []; for (let f = Math.round((T0 - 1) * FPS); f < Math.round(T7 * FPS); f++) { const t = f / FPS, m = d.matala(t, 0.35);
      if (m < 0.25) continue; let ok = true; for (let k = -21; k <= 21; k += 3) if (d.matala(t + k / FPS, 0.35) > m + 1e-6) { ok = false; break; }
      const ref = 0.5 * (d.matala(t - 0.9, 0.2) + d.matala(t + 0.9, 0.2));
      if (ok && m - ref > 0.04 && (ts.length === 0 || t - ts[ts.length - 1].t > 0.7)) ts.push({ t, v: clamp(0.45 + 3 * (m - ref), 0.45, 0.8) }); }
    for (const x of ts) if (!PULSSIT.some((a) => Math.abs(a.t - x.t) < 0.6)) PULSSIT.push(x); }
  PULSSIT.sort((a, b) => a.t - b.t);

  // ----- horisontin kummut: melodian kaari; muodostuvat kolmessa sekunnissa; palaavat maailman 1 profiiliin -----
  const K0 = T0, K1 = T2;
  const kaari = (t) => clamp((d.melodia(t, 2.6) - 68) * 0.0050, -0.05, 0.075);
  const kaari1 = (() => { const a = []; const k0 = A.jouset_tulevat - 0.3, k1 = A.hiljaisuus_1_alku; for (let i = 0; i < 32; i++) a.push(clamp((d.melodia(k0 + (i / 31) * (k1 - k0), 2.6) - 68) * 0.0050, -0.05, 0.075)); return a; })();
  const hills = (t) => { const o = []; for (let i = 0; i < 32; i++) { const ti = K0 + (i / 31) * (K1 - K0);
      const live = ti > t ? 0 : kaari(ti) * sstep(0, 3.0, t - ti);
      o.push(lerp(live, kaari1[i], sstep(T2, T3, t))); } return o; };

  const trem0 = (t) => clamp(ka(sTrem, t, 1.2), 0, 1);
  function tila(t) {
    const f = t * FPS;
    const pit = d.pitka(t, 0.9), en = ener(t), ko = d.koko(t, 0.9);
    const kajo = kajoK(t);
    const glPit = clamp(0.22 + 0.95 * pit, 0, 1.25), glKoko = clamp(0.20 + 0.85 * ko, 0, 1.2);
    const wGl = sstep(T4 - 1.0, T4 + 1.5, t);
    const glow = Math.max(lerp(glPit, glKoko, wGl), 0.60 * kajo);          // musiikin loputtua kajo jää: kuva ei pimene
    const mel = d.melodia(t, 2.0) - 68, lasku = ka(sLasku, t, 1.3), nousu = ka(sNousu, t, 1.3);
    const elev = clamp(0.115 + 0.10 * sstep(-3, 12, mel) + 0.03 * nousu - 0.025 * lasku - 0.07 * kajo, 0.05, 0.3);
    const glowH = clamp(0.045 + 0.075 * sstep(68, 80, pitS(t)) + 0.012 * nousu - 0.008 * lasku + 0.05 * kajo, 0.04, 0.17);
    const lint = Math.max(0.30 + 0.70 * en, 0.55 * kajo);
    const low = clamp(d.matala(t, 0.6) * 1.2, 0, 1);
    const sway = clamp(0.30 + 1.1 * en + 0.9 * waveS(t) + 0.6 * trem0(t), 0.30, 2.0) * (1 - 0.25 * sstep(T7, T7 + 8, t));
    const trem = clamp(ka(sTrem, t, 1.2), 0, 1);
    const aur = 0.36 * sstep(T0 + 5, T0 + 17, t) * (1 - sstep(T4 - 5, T4 + 15, t)) * (0.8 + 0.2 * clamp(d.korkea(t, 1.5) * 1.4, 0, 1));
    // vedos 8 (rivi 164): puhaltimien linja (KAARI) kulkee aaltona revontulen läpi vasemmalta oikealle; aallon korkeus on linjan korkeus (enintään 7,5 % kuvan
    // korkeudesta) ja koko kaari nousee aavistuksen. Vain ankkurin S_puhaltimien_kaari aikana.
    const kaariK = KAARI[clamp(Math.round(t * FPS), 0, d.NF - 1)];
    const aurLow = clamp(sstep(T0 + 14, T3 + 4, t) - 0.05 * kaariK, 0, 1);
    const aurW = [-1.25 + 2.5 * clamp((t - KAARI_T[0]) / Math.max(KAARI_T[1] - KAARI_T[0], 1), 0, 1), 0.045 * kaariK];   // käyttäjä 13.11.: "aavistuksen hienovaraisempi ... Ihan vähän tyylikkäämpi": korkeus 7,5 % -> 4,5 %, aalto leveämpi ja loivempi   // aalto vasemmalta oikealle ankkurin aikana; korkeus = linjan korkeus
    const pulssit = PULSSIT.filter((x) => x.t <= t && t - x.t < 4).slice(-6).map((x) => [t - x.t, x.v, 0, 0]);
    const wallK = clamp((t - T0) / 12.5, 0, 1) * 1.45;
    const cloud = lerp(0.95, 0.18, sstep(T0 + 1, T0 + 24, t));
    const reveal = clamp(d.pitka(Math.max(t - 1.0, 0), 0.9) * 1.4, 0, 1);
    const windows = Math.max(0.15 + 0.85 * reveal * (1 - kajo), 0.65 * kajo);
    return { sway, f, pit, en, glow, glowH, elev, lint, low, trem, aur, aurLow, aurW, kajo, pulssit, wallK, cloud, windows, mel };
  }

  // lumi: tiheys alussa suuri ja harvenee hiljaiseksi; putoaminen ja ajelehtiminen tasaisia ja jatkuvat loppuun asti
  const dens = (t) => 0.075 + 0.36 * (1 - sstep(T0, T0 + 16, t));
  const kPut = d.sarja(() => 0.55 / FPS), kTuuli = d.sarja(() => 0.10 / FPS);
  const kLahe = d.sarja((f) => vel(f / FPS) / FPS);
  const kDrift = d.sarja(() => 1.0 / FPS);

  const { gl, U, piirra } = luoGL(FS);
  const SV = 0.66;
  julkaise({
    gl, aika: A,
    kamera: (t) => ({ p: [camX(t), camH(t), camZ(t)], q: [0, 0, 0, 1], shot: 'ylhaalta', cut: 0, trans: false }),
    kuvaus: (t) => { const s = tila(t); return { kamera: { korkeus: +camH(t).toFixed(1), vauhti: +vel(t).toFixed(2), z: +camZ(t).toFixed(1) },
      seina: +s.wallK.toFixed(2), horisontinValo: +s.glow.toFixed(2), valonKorkeus: +s.glowH.toFixed(3), pitkaSavelKaari: +pitS(t).toFixed(1), valoElev: +(s.elev * 57.3).toFixed(1),
      lint: +s.lint.toFixed(2), maa: +s.low.toFixed(2), tuuli: +s.sway.toFixed(2), revontulet: +s.aur.toFixed(2), revLasku: +s.aurLow.toFixed(2), tremolo: +s.trem.toFixed(2),
      kajo: +s.kajo.toFixed(2), kajoRaja: +kajoF(t).toFixed(0), aalto: +waveS(t).toFixed(2), aaltoZ: +waveZ(t).toFixed(0), pilvi: +s.cloud.toFixed(2), pulsseja: s.pulssit.length, pulssejaYht: PULSSIT.length,
      ikkunat: +s.windows.toFixed(2), lumi: +dens(t).toFixed(3) }; },
    seek: (t) => {
      const s = tila(t), hl = hills(t);
      const pu = new Float32Array(24); s.pulssit.forEach((x, i) => pu.set(x, i * 4));
      gl.uniform1f(U('uTime'), t); gl.uniform1f(U('uCamX'), camX(t)); gl.uniform1f(U('uCamZ'), camZ(t)); gl.uniform1f(U('uCamH'), camH(t)); gl.uniform1f(U('uHor'), 0.60);
      gl.uniform1f(U('uWallK'), s.wallK); gl.uniform1f(U('uGlow'), s.glow); gl.uniform1f(U('uGlowH'), s.glowH); gl.uniform1f(U('uLint'), s.lint);
      gl.uniform1f(U('uLow'), s.low); gl.uniform1f(U('uKajoK'), s.kajo); gl.uniform1f(U('uKajoF'), kajoF(t));
      gl.uniform1f(U('uWaveS'), waveS(t)); gl.uniform1f(U('uWaveZ'), waveZ(t));
      gl.uniform1f(U('uSway'), s.sway); gl.uniform1f(U('uAur'), s.aur); gl.uniform1f(U('uAurLow'), s.aurLow); gl.uniform2f(U('uAurW'), s.aurW[0], s.aurW[1]); gl.uniform1f(U('uTrem'), s.trem);
      gl.uniform1f(U('uCloud'), s.cloud); gl.uniform1f(U('uStarK'), 1 - s.cloud); gl.uniform1f(U('uWindow'), s.windows);
      gl.uniform1f(U('uPen'), clamp((t - K0) / (K1 - K0), -0.2, 1.2)); gl.uniform1f(U('uDrift'), d.kohta(kDrift, t));
      gl.uniform1f(U('uFogL'), 820); gl.uniform1f(U('uElev'), s.elev); gl.uniform1f(U('uSv'), SV);
      gl.uniform4f(U('uSnow'), dens(t), d.kohta(kTuuli, t), d.kohta(kPut, t), d.kohta(kLahe, t));
      gl.uniform1fv(U('uHill'), new Float32Array(hl)); gl.uniform4fv(U('uPulse'), pu);
      piirra();
    },
  });
}
alusta().catch((e) => { console.error(e); window.sceneError = String(e.message || e); });
