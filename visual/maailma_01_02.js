// Tapiola: maailmat 1 (Horisontti ja siemen) ja 2 (Repeämä), tiedoston alusta ankkuriin fis_pitka_aani. Ohjaajan moduuli.
// Päättyy rajakuvaan PIMEA_MASSA (visual/yhteinen.js): kamera ajaa metsän reunan pimeään, josta maailma 3 avautuu.
// Suunnitelma: docs/kuvakasikirjoitus.md "Kaksitoista maailmaa";
// säännöt: docs/visuaalinen_tyyli.md luvut 1, 2, 5 ja 4d.
// - Metsä on yhtenäinen massa, joka nousee suurta vaaran rinnettä kerros kerrokselta usvaan. Se ei kasva, kutistu eikä siirry.
// - Jousten intensiteetti on metsän tummuus ja latvuston yli kulkeva valon aalto. Siemen: tummuus vyöryy massan läpi kaukaa
//   (toteutus: tummuus alkaa lähimmästä kerroksesta heti jousten tullessa ja vyöryy rinnettä ylös Tapion taloon).
// - Gis on horisontin valo vaaran takana; se muodostaa mäkiä hitaasti. Vaaran laki on Tapion talo (havuhattu); sen ikkunat
//   kuumottavat hopeisina hetkeä sen jälkeen, kun käyrätorvien gis paljastuu jousten alta (kaiku).
// - Kamera kulkee suoraan eteen tasaista vauhtia tasaisen suon yli silmänkorkeudella. Suon usva ajelehtii vastaan.
// - Ainoa yksittäinen puu on pilkkapuu: suon käkkyrämänty, jonka runkoon on veistetty pilkka (Kalevala 14).
// Kohtaus on puhdas aikafunktio seek(t): kaikki keskiarvot ja kertymät lasketaan alussa ruuduittain.
const clamp = (x, a, b) => Math.min(Math.max(x, a), b);
const smooth = (k) => k * k * (3 - 2 * k);
const sstep = (a, b, x) => smooth(clamp((x - a) / (b - a), 0, 1));
const fract = (x) => x - Math.floor(x);

const VS = `#version 300 es
in vec2 a; void main() { gl_Position = vec4(a, 0.0, 1.0); }`;

const FS = `#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2 uRes;
uniform float uAA, uTime, uCamZ, uCamX, uCamH, uHor, uGis, uReveal, uWind, uFogL, uTreeZ, uPen;
uniform float uProf[32];  // horisontin muoto: melodian kaari, piirtyy vasemmalta oikealle
uniform float uLive[8];   // jousten intensiteetti kerroksittain: tummuus vyöryy kaukaa lähelle
uniform vec3 uCut;        // välähdys, jälkihohto, -
uniform vec4 uSnow;       // tiheys, sivutuulen matka, putoamisen matka, lähestymisen matka
uniform vec4 uPulse[4];   // patarumpu: ikä, voima
uniform vec4 uSpark[24];  // väike: paikka x (m), kerros, voima, korkeus latvustossa
uniform int uNSpark;
const float F = 1.07;
const int NL = 8;
const float LZ[8] = float[8](175.0, 192.0, 213.0, 240.0, 276.0, 326.0, 396.0, 500.0);   // kerroksen etäisyys lähdöstä (m)
const float LE[8] = float[8](0.0, 4.0, 11.0, 21.0, 35.0, 54.0, 80.0, 115.0);            // maan korkeus: vaaran rinne
const float LH[8] = float[8](23.0, 24.0, 25.0, 26.0, 27.0, 28.0, 30.0, 32.0);           // latvuston korkeus
const vec3 SKY_TOP = vec3(0.003, 0.005, 0.010), SKY_LOW = vec3(0.011, 0.020, 0.040);
const vec3 FOG = vec3(0.024, 0.040, 0.070);          // salo: sininen usva
const vec3 HAMY = vec3(0.0022, 0.0046, 0.0054);       // hämy: lähes musta sinivihreä
const vec3 GLOW = vec3(0.56, 0.68, 0.88), SILVER = vec3(0.80, 0.86, 0.95), SNOWC = vec3(0.55, 0.62, 0.75), CUTC = vec3(0.92, 0.96, 1.0);

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }

float prof(float u) { u = clamp(u, 0.0, 31.0); int i = int(floor(u)); return mix(uProf[i], uProf[min(i + 1, 31)], fract(u)); }
// latvojen kärjet: kuusen terävä kärki tai männyn pyöreä latvus, erikokoisia, epätasaisin välein
float tips(float wx, float k, float cell) {
  float tip = 0.0, c = floor(wx / cell);
  for (int j = -1; j <= 1; j++) {
    float ci = c + float(j), h = hash(vec2(ci, k * 5.0 + cell)), sh = hash(vec2(ci, k + 4.0 + cell));
    float xi = (ci + 0.15 + 0.7 * hash(vec2(ci, k + 9.0 + cell))) * cell;
    float w = cell * (0.5 + 1.0 * hash(vec2(ci, k + 2.0)));
    float e = sh > 0.72 ? 1.7 : 0.60;                                  // osa latvuksista on pyöreitä (mänty), useimmat teräviä (kuusi)
    tip = max(tip, (0.18 + 0.82 * h * h) * (sh > 0.72 ? 0.7 : 1.0) * max(0.0, 1.0 - pow(abs(wx - xi) / w, e)));
  }
  return tip;
}
// latvuston yläreuna (0..noin 1.15 latvuston korkeudesta): suuret ryhmät ja aukot, latvukset, kärjet kahdessa mittakaavassa
float canopy(float wx, float k) {
  float big = vnoise(vec2(wx * 0.010 + k * 7.1, k * 3.3));
  float mid = vnoise(vec2(wx * 0.045 + k * 1.7, k * 9.1));
  float tp = max(tips(wx, k, 4.3), 0.6 * tips(wx + 11.0, k + 0.5, 2.3));
  return 0.30 + 0.44 * big + 0.10 * mid + 0.30 * tp + 0.012 * (vnoise(vec2(wx * 2.6, k)) - 0.5);
}

float snowAt(int s, float zz, float dx, float dy) {
  vec2 w2 = vec2(dx * zz / F + uCamX + uSnow.y * (0.6 + 0.05 * float(s)), dy * zz / F + uSnow.z) / 0.9 + float(s) * 17.3 + floor((float(s) * 5.5 - uSnow.w) / 44.0) * 3.7;
  vec2 ic = floor(w2), fr = fract(w2);
  float h = hash(ic);
  if (h >= uSnow.x) return 0.0;
  vec2 c = 0.15 + 0.7 * vec2(hash(ic + 1.7), hash(ic + 5.1));
  float dd = length(fr - c) * 0.9, r = 0.030 + 0.02 * fract(h * 53.0);
  return 0.55 * smoothstep(r, r * 0.25, dd) * smoothstep(1.5, 4.0, zz) * smoothstep(45.5, 38.0, zz) * exp(-zz / uFogL * 0.5);
}

// suon usva: matala, repaleinen lautta etäisyydellä zm; näyttää kulkijan etenemisen ja kätkee metsän tyven
float mistAt(int m, float zm, float dx, float dy) {
  float yw = uCamH + dy * zm / F, wx = dx * zm / F + uCamX;
  float top = 2.2 + 2.6 * vnoise(vec2(wx * 0.035 + float(m) * 5.0, float(m)));
  if (yw < -0.2 || yw > top) return 0.0;
  float body = smoothstep(top, top * 0.35, yw) * smoothstep(-0.2, 0.5, yw);
  float holes = smoothstep(0.30, 0.72, vnoise(vec2(wx * 0.045 + float(m) * 9.0 + uTime * 0.012, float(m) * 3.0 + uTime * 0.02)));
  return 0.42 * body * holes * smoothstep(6.0, 22.0, zm) * smoothstep(150.0, 120.0, zm);
}

// pilkkapuu: suon käkkyrämänty. Runko on mutkainen, oksia on viisi ja jokaisen päässä on neulastupsu; q tyvestä metreinä
float seg(vec2 q, vec2 a, vec2 b, float w0, float w1) { vec2 pa = q - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - mix(w0, w1, h); }
float tuft(vec2 q, vec2 c, vec2 r, float sd) { vec2 d = (q - c) / r; float an = atan(d.y, d.x);
  float n = vnoise(vec2(an * 2.5 + sd, sd)), n2 = vnoise(vec2(an * 11.0 + sd * 3.0, sd + 4.0));
  float under = smoothstep(0.1, -0.5, d.y);                                   // alapinta on rosoinen, yläpinta tasaisempi
  return (length(d) - (0.50 + 0.45 * n + (0.18 + 0.30 * under) * n2 - 0.12 * d.x)) * min(r.x, r.y); }
float cxOf(float y) { return 0.42 * sin(y * 0.52 + 0.4) + 0.05 * sin(y * 1.9) - 0.035 * y; }
float bogPine(vec2 q, out float trunk) {
  trunk = 0.0;
  if (q.y < -0.1 || q.y > 10.2 || abs(q.x) > 4.2) return 0.0;
  float d = 1e3;
  float tw = 0.15 * (1.0 - 0.075 * q.y) + 0.06 * exp(-q.y * 2.5);
  float dt = abs(q.x - cxOf(q.y)) - tw; if (q.y > 9.0) dt = 1e3;
  d = min(d, dt);
  for (int i = 0; i < 5; i++) {
    float fi = float(i), y0 = 3.3 + 1.15 * fi, sgn = (i % 2 == 0) ? 1.0 : -1.0;
    float L = 2.3 - 0.28 * fi + 0.5 * hash(vec2(fi, 3.0)), rise = 0.35 + 0.22 * fi;
    vec2 a = vec2(cxOf(y0), y0), m = a + vec2(sgn * L * 0.55, rise * 0.25), b = a + vec2(sgn * L, rise);
    d = min(d, min(seg(q, a, m, 0.055, 0.035), seg(q, m, b, 0.035, 0.015)));
    d = min(d, tuft(q, b + vec2(0.0, 0.08), vec2(0.95 - 0.08 * fi, 0.24), fi * 3.1));
    d = min(d, tuft(q, m + vec2(sgn * 0.1, 0.20), vec2(0.50, 0.15), fi * 5.7 + 1.0));
    if (i < 2) d = min(d, seg(q, vec2(cxOf(y0 - 0.9), y0 - 0.9), vec2(cxOf(y0 - 0.9) - sgn * 0.55, y0 - 0.75), 0.03, 0.008));      // kuiva oksantynkä
  }
  d = min(d, tuft(q, vec2(cxOf(9.0) - 0.15, 9.2), vec2(1.15, 0.36), 9.0));
  trunk = smoothstep(0.012, -0.012, dt);
  return smoothstep(0.02, -0.02, d);
}

vec3 scene(vec2 p) {
  float asp = uRes.x / uRes.y;
  float dx = p.x - asp * 0.5, dy = p.y - uHor;
  // usva on tumma, kun mikään ei soi; horisontin valo ja vaskien repeämä valaisevat sen
  vec3 fogc = FOG * (0.62 + 1.0 * uGis) + CUTC * uCut.y * 0.22 * exp(-abs(dx - (24.0 - uCamX) * 0.008) / 0.55);
  // taivas
  vec3 col = mix(SKY_LOW, SKY_TOP, smoothstep(0.25, 0.75, dy));
  float m1 = 0.5 + 0.5 * sin(p.x * 2.1 + uTime * 0.05 + 1.6 * sin(p.y * 5.3 - uTime * 0.03));
  float m2 = vnoise(vec2(p.x * 3.0 + uTime * 0.04, p.y * 9.0));
  col += FOG * 0.16 * (0.6 * m1 + 0.4 * m2 - 0.4) * exp(-max(dy - 0.3, 0.0) / 0.25);
  // kaukaisin harjanne: gis muodostaa siihen mäkiä hitaasti; sen laella Tapion talo, havuhattu
  float xd = asp * 0.64, xr = (p.x - xd);
  float house = 0.150 * exp(-pow(xr / 0.25, 2.0)) + 0.040 * exp(-pow((xr + 0.34) / 0.22, 2.0));      // sileä vaara: jääkauden muokkaama
  float hl = 0.335 + house;
  { float u = clamp(p.x / asp, 0.0, 1.0) * 31.0;          // loivat, sileät kummut: leveä painotettu keskiarvo
    hl += 0.10 * prof(u - 1.6) + 0.20 * prof(u - 0.8) + 0.40 * prof(u) + 0.20 * prof(u + 0.8) + 0.10 * prof(u + 1.6); }
  hl += 0.004 * (vnoise(vec2(p.x * 3.0, 3.0)) - 0.5);
  float hat = (0.010 + 0.012 * smoothstep(0.02, 0.12, house)) * tips(p.x * 60.0, 9.0, 1.3);
  float above = dy - hl, edge = above - hat;
  if (dy > 0.0) {
    col += GLOW * uGis * (0.55 * exp(-max(above, 0.0) / 0.036) + 0.08 * exp(-max(above, 0.0) / 0.15)) * (0.85 + 0.3 * m2);
    if (edge < 0.0) {
      col = mix(FOG * 0.34, FOG * 0.60 + GLOW * uGis * 0.03, smoothstep(-0.09, 0.0, edge)) * (0.75 + 0.9 * uGis);
      // Tapion talon ikkunat: kolme ja kolme, hopeisina; ne vastaavat, kun käyrätorvien gis paljastuu
      for (int i = 0; i < 6; i++) {
        vec2 wp = vec2(xd - 0.050 + 0.050 * float(i % 3) + 0.010 * float(i / 3), 0.370 + 0.046 * float(i / 3) + 0.008 * sin(float(i) * 2.3));
        vec2 d = (vec2(p.x, dy) - wp) / vec2(0.0050, 0.0085);
        float tw = 0.60 + 0.40 * sin(uTime * (0.5 + 0.13 * float(i)) + float(i) * 1.9);
        col += SILVER * uReveal * tw * (1.5 * exp(-pow(dot(d, d), 1.6)) + 0.16 * exp(-dot(d, d) * 0.05));
      }
    }
    col += GLOW * uGis * 0.60 * exp(-pow(edge / 0.0028, 2.0)) * (1.0 + 0.9 * exp(-pow((p.x / asp - uPen) / 0.07, 2.0)));     // kohta, jossa melodia on nyt
  }
  // metsä: kahdeksan massakerrosta kaukaa lähelle; lumi syvyysjärjestyksessä
  float zs[8];
  for (int s = 0; s < 8; s++) zs[s] = 1.5 + mod(float(s) * 5.5 - uSnow.w, 44.0);
  float zPrev = 1e5;
  for (int k = NL - 1; k >= 0; k--) {
    float z = LZ[k] - uCamZ;
    if (z < 2.0) continue;
    for (int s = 0; s < 8; s++) if (zs[s] <= zPrev && zs[s] > z) col += SNOWC * snowAt(s, zs[s], dx, dy);
    zPrev = z;
    if (k == 2) {   // leikkaus: vasket repäisevät valon pystyyn syvällä metsässä; kolme lähintä kerrosta jäävät sen eteen
      float w = 0.004 + 0.003 * vnoise(vec2(p.y * 12.0, 1.0));
      float d = abs(dx - (24.0 - uCamX) * F / z - 0.012 * (vnoise(vec2(p.y * 5.0, 7.0)) - 0.5));
      col += CUTC * (uCut.x * (exp(-d * d / (w * w)) + 0.30 * exp(-d / 0.05)) + uCut.y * (0.45 * exp(-d / 0.07) + 0.16 * exp(-d / 0.45))) * smoothstep(-0.12, 0.05, dy);
    }
    float fk = float(k), pk = 1.0 - fk / 7.0;
    float wx = dx * z / F + uCamX, yw = uCamH + dy * z / F;
    float live = uLive[k];
    float fg = (1.0 - exp(-z / uFogL)) * (1.0 - 0.70 * min(live, 1.0) * mix(0.62, 1.0, pk));     // jouset: usva väistyy, massa tummuu; kaukaiset pysyvät sinisempinä
    if (yw < LE[k]) { col = mix(vec3(0.007, 0.011, 0.019), fogc, min(fg + 0.30, 1.0)); continue; }      // rinteen lumi kerroksen alla
    float hn = (yw - LE[k]) / LH[k];
    if (hn > 1.25) continue;
    float amp = 0.5 + 2.0 * min(live, 1.2) + 3.2 * uWind;
    float ph = wx * 0.040 - uTime * (0.50 + 0.3 * uWind) + fk * 1.3;
    float xs = wx - hn * hn * amp * sin(ph) - hn * 0.3 * amp * sin(wx * 0.31 + uTime * 1.3 + fk);       // latvat taipuvat yhdessä; tyvi ei liiku
    float top = canopy(xs, fk);
    float a = smoothstep(0.012, -0.012, hn - top);
    float tuuli = 0.22 * min(live, 1.2) + 1.1 * uWind;
    if (tuuli > 0.01 && hn > top - 0.02) {
      float pl = smoothstep(top + 0.34, top, hn) * vnoise(vec2(wx * 0.05 - uTime * (0.5 + 1.6 * uWind) + fk * 3.0, hn * 5.0 - uTime * 0.3));
      col += SNOWC * 0.16 * tuuli * pl * pl * (1.0 - 0.6 * fg) * (0.35 + uGis + uCut.y);
    }
    if (a <= 0.0) continue;
    // alta harva, keskeltä läpinäkyvä, päältä tiheä
    float gap = smoothstep(0.68, 0.92, vnoise(vec2(xs * 0.8 + fk * 4.0, fk))) * (0.3 + 0.7 * vnoise(vec2(xs * 3.1, fk + 2.0)))
              * pow(max(0.0, 1.0 - hn / (0.14 + 0.16 * vnoise(vec2(xs * 0.5, fk + 5.0)))), 1.8);
    float veil = 0.34 * exp(-pow((hn - 0.26) / 0.15, 2.0)) * (0.3 + 0.7 * vnoise(vec2(wx * 0.025 - uTime * (0.03 + 0.08 * live), fk * 2.0)));
    vec3 dark = mix(HAMY, FOG * 0.26, 0.30 * fk / 7.0) * (0.72 + 0.6 * vnoise(vec2(xs * 0.8 + fk * 3.0, 0.5)) * smoothstep(0.8, 0.2, hn));
    vec3 tone = mix(dark, fogc, clamp(fg + veil * (1.0 - 0.6 * min(live, 1.0)), 0.0, 1.0));
    // tuulen aalto: latvat, jotka taipuvat valoa kohti, saavat horisontin valon reunaansa; aalto kulkee massan yli
    float crest = smoothstep(top - 0.20, top, hn) * (0.5 + 0.5 * sin(ph + 1.2));
    tone += GLOW * (uGis * 0.045 + uCut.y * 0.05) * (0.25 + 1.0 * min(live, 1.2) + 1.4 * uWind) * crest * crest * (1.0 - 0.7 * fg);
    a *= (1.0 - 0.35 * gap) * (1.0 - 0.55 * fg * fg);
    col = mix(col, tone, a);
    // väike: puupuhaltimien valo latvustossa; vaihtaa paikkaa, ei vilku paikallaan
    for (int i = 0; i < 24; i++) { if (i >= uNSpark) break; vec4 sp = uSpark[i]; if (int(sp.y) != k) continue;
      float sy = (LE[k] + LH[k] * sp.w * canopy(sp.x, fk) - uCamH) * F / z;
      vec2 d = (vec2(dx, dy) - vec2((sp.x - uCamX) * F / z, sy)) / (0.0034 + 0.30 / z);
      col += SILVER * sp.z * (1.2 * exp(-dot(d, d)) + 0.16 * exp(-dot(d, d) * 0.05)) * (1.0 - 0.5 * fg); }
  }
  // suo: tasainen lumen peittämä aukea kameran alla ja edessä metsän reunaan asti
  float z0 = LZ[0] - uCamZ;
  if (dy < -uCamH * F / max(z0, 2.0)) {
    float z = uCamH * F / max(-dy, 1e-4);
    float wx = dx * z / F + uCamX, wz = z + uCamZ;
    float hum = vnoise(vec2(wx * 0.20, wz * 0.10)), pool = smoothstep(0.58, 0.74, vnoise(vec2(wx * 0.035 + 3.0, wz * 0.022)));
    float tuss = smoothstep(0.70, 0.86, vnoise(vec2(wx * 0.55, wz * 0.28)));                    // mättäät
    vec3 g = vec3(0.011, 0.017, 0.029) * (0.55 + 0.8 * hum) * (1.0 - 0.6 * pool) * (1.0 + 0.5 * tuss) + GLOW * uGis * 0.05 * (0.4 + 0.6 * hum) * exp(-z / 110.0);
    for (int i = 0; i < 4; i++) { vec4 pu = uPulse[i]; if (pu.y <= 0.0) continue;        // patarumpu: valo kulkee lumen pinnassa poispäin
      float r = length(vec2(wx - uCamX, z - 22.0)) - pu.x * 9.0;
      g += GLOW * pu.y * 0.11 * exp(-pu.x * 0.9) * exp(-r * r / 12.0); }
    g += CUTC * uCut.y * 0.020 * exp(-abs(wx - 24.0) / (5.0 + 0.2 * z)) * smoothstep(2.0, 25.0, z);
    col = mix(g, fogc, 1.0 - exp(-z / uFogL));
  }
  // suon usvalautat, lumi ja pilkkapuu syvyysjärjestyksessä
  for (int m = 5; m >= 0; m--) { float zm = 6.0 + mod(float(m) * 24.0 - uCamZ, 144.0); if (zm > uTreeZ) col = mix(col, fogc * 1.25, mistAt(m, zm, dx, dy)); }
  for (int s = 0; s < 8; s++) if (zs[s] <= zPrev && zs[s] > uTreeZ) col += SNOWC * snowAt(s, zs[s], dx, dy);
  if (uTreeZ > 0.6) {
    float sc = uTreeZ / F;
    vec2 q = vec2(dx * sc - 3.6, dy * sc + uCamH);
    float trunk; float a = bogPine(q, trunk);
    if (a > 0.0) {
      vec3 tone = mix(HAMY, fogc, 1.0 - exp(-uTreeZ / uFogL));
      // pilkka: veistetty vaalea lovi rungossa silmän korkeudella; horisontin valo osuu siihen
      float cxm = q.x - cxOf(q.y);
      float mark = trunk * smoothstep(0.26, 0.0, abs(q.y - 1.55)) * smoothstep(0.075, 0.02, abs(cxm + 0.03));
      tone = mix(tone, SILVER * (0.03 + 0.15 * uGis + 0.18 * uReveal), mark * exp(-uTreeZ / 55.0));
      col = mix(col, tone, a);
    }
  }
  for (int m = 5; m >= 0; m--) { float zm = 6.0 + mod(float(m) * 24.0 - uCamZ, 144.0); if (zm <= uTreeZ) col = mix(col, fogc * 1.25, mistAt(m, zm, dx, dy)); }
  for (int s = 0; s < 8; s++) if (zs[s] <= min(zPrev, uTreeZ)) col += SNOWC * snowAt(s, zs[s], dx, dy);
  float enter = smoothstep(17.0, 5.6, z0);
  col = mix(col, HAMY * (1.0 + 1.5 * vnoise(vec2(p.x * 2.0 + uTime * 0.05, p.y * 3.0))) + FOG * 0.03, enter);
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
  for (const id of ['vaskien_isku', 'tuulenpuuska', 'hiljaisuus_1_alku', 'hiljaisuus_1_loppu', 'puhallinkuviot_alku', 'puhallinkuviot_loppu', 'gis_pitka_aani_loppu', 'fis_pitka_aani', 'jouset_tulevat', 'gis_paljastuu', 'siemen_toistuu'])
    if (aika[id] == null) throw new Error('ankkuri puuttuu: ' + id);
  const oh = cues.ohjaus, sm = oh.spektri;
  const SP = new Uint8Array(await (await fetch('/' + sm.tiedosto)).arrayBuffer());
  const NB = sm.kaistoja, FPS = oh.fps, NF = oh.frames;
  if (SP.length !== NF * NB) throw new Error('spektri.u8: koko ei vastaa ruutuja');
  const taso = (midi, f) => clamp((SP[f * NB + (midi - sm.midi_alin)] / 255 * -sm.db_alin + sm.db_alin + 48) / 40, 0, 1);
  // hitaat keskiarvot ruuduittain (kertymäsummilla): kuva seuraa ääntä liukuen, ei ruutu ruudulta
  const sarja = (fn) => { const a = new Float32Array(NF + 1); for (let f = 0; f < NF; f++) a[f + 1] = a[f] + fn(f); return a; };
  const ka = (a, f, w) => { const lo = clamp(Math.round(f - w), 0, NF), hi = clamp(Math.round(f + w), 0, NF); return hi > lo ? (a[hi] - a[lo]) / (hi - lo) : 0; };
  const fFis = Math.round(aika.fis_pitka_aani * FPS);
  const savel = (f) => (f < fFis ? 68 : 66);                           // teoksen pitkä ääni: gis, sitten fis
  const YLA = [0, 12, 19, 24, 28];
  const sGis = sarja((f) => taso(savel(f), f));
  const sYla = YLA.map((o) => sarja((f) => taso(savel(f) + o, f)));
  const sJou = sarja((f) => { let mx = 0; const pv = savel(f); for (let mi = 48; mi <= 79; mi++) if (Math.abs(mi - pv) > 1) mx = Math.max(mx, taso(mi, f)); return mx; });
  // ketkä soittavat, tulee kuunteluoppaan ankkureista (käyttäjän kuulemat): jouset soivat näillä väleillä; voima mitataan
  const JOUSET = [[aika.jouset_tulevat, aika.gis_paljastuu], [aika.siemen_toistuu, aika.puhallinkuviot_alku], [aika.tuulenpuuska, aika.hiljaisuus_1_alku], [aika.fis_pitka_aani, aika.fis_pitka_aani + 30]];
  const jousia = (t) => JOUSET.reduce((m, [a, b]) => Math.max(m, sstep(a - 0.05, a + 0.3, t) * (1 - sstep(b - 0.1, b + 0.9, t))), 0);
  const puuska = (t) => (t < aika.tuulenpuuska ? 0 : smooth(clamp((t - aika.tuulenpuuska) / 0.5, 0, 1)) * Math.exp(-(t - aika.tuulenpuuska) / 5));
  const hilj = (t) => smooth(clamp((t - aika.hiljaisuus_1_alku) / 1.5, 0, 1)) * (1 - smooth(clamp((t - aika.hiljaisuus_1_loppu) / 1.5, 0, 1)));
  const jou = (t) => (t < 0 ? 0 : (0.25 + 0.75 * sstep(0.40, 0.85, ka(sJou, t * FPS, 0.35 * FPS))) * jousia(t) * (1 - hilj(t)));
  // melodian kaari: korkein soiva sävel keskirekisterissä (ei pitkä ääni), hitaana keskiarvona; horisontti seuraa sitä
  const sMel = (() => { const N = cues.nuotit, m = new Float32Array(NF); let j0 = 0, viime = 68;
    for (let f = 0; f < NF; f++) { const t = f / FPS; let top = -1;
      while (j0 < N.length && N[j0][0] + N[j0][1] < t - 8) j0++;
      for (let j = j0; j < N.length && N[j][0] <= t; j++) { const a = N[j][0], d = N[j][1], mi = N[j][2]; if (d >= 0.2 && t <= a + d && mi >= 59 && mi <= 83 && Math.abs(mi - savel(f)) > 0.5) top = Math.max(top, mi); }
      if (top > 0) viime = top; m[f] = viime; }
    return sarja((f) => m[f]); })();
  const kaari = (t) => clamp((ka(sMel, t * FPS, 2.6 * FPS) - 68) * 0.0050, -0.05, 0.075);
  const K0 = aika.jouset_tulevat - 0.3, K1 = aika.hiljaisuus_1_alku;      // horisontti piirtyy tällä välillä vasemmalta oikealle
  const VX = 0.45;                                                     // viisto eteneminen: sivuttaisvauhti m/s (parallaksi)
  const VYORY = 1.6;                                                   // siemen: tummuus kulkee lähimmästä kerroksesta rinnettä ylös tässä ajassa (s)
  // patarummun ja basson alut: matalan kaistan tason nousut
  const ALUT = [];
  { const m = new Float32Array(NF); for (let f = 0; f < NF; f++) { let mx = 0; for (let mi = 28; mi <= 47; mi++) mx = Math.max(mx, taso(mi, f)); m[f] = mx; }
    let viime = -99; for (let f = 5; f < NF; f++) { const n = m[f] - Math.min(m[f - 5], m[f - 4], m[f - 3], m[f - 2]); if (n >= 0.1 && m[f] > 0.2 && f - viime >= 8) { ALUT.push({ t: f / FPS, v: clamp(n / 0.22, 0.4, 1) }); viime = f; } } }
  // väike: puupuhaltimien lyhyet korkeat äänet kuunteluoppaan nimeämässä jaksossa
  const VAIKE = cues.nuotit.filter((n) => n[2] >= 72 && n[1] < 0.9 && n[0] >= aika.puhallinkuviot_alku - 0.5 && n[0] <= aika.puhallinkuviot_loppu);
  const V = 2.75;                                                      // kulkijan vauhti m/s: tasainen, ei reagoi; metsän reuna saavutetaan fis:n alkaessa
  const kPut = sarja((f) => (0.5 * (1 - 0.85 * hilj(f / FPS)) + 0.5 * puuska(f / FPS)) / FPS);
  const kTuuli = sarja((f) => (0.12 + 2.6 * puuska(f / FPS)) / FPS);
  const kLahe = sarja((f) => (V + 6 * puuska(f / FPS)) / FPS);
  const kohta = (a, t) => { const x = clamp(t * FPS, 0, NF - 1e-3), i = Math.floor(x); return a[i] + (a[i + 1] - a[i]) * (x - i); };
  const PUU_Z = 48;                                                    // pilkkapuun paikka (m lähdöstä): ohitetaan siemenen toiston jälkeen

  function tila(t) {
    const f = t * FPS, h = hilj(t);
    const gis = ka(sGis, f, 1.0 * FPS) * (1 - 0.8 * h);
    const hills = []; for (let i = 0; i < 32; i++) { const ti = K0 + (i / 31) * (K1 - K0); hills.push(ti > t ? 0 : kaari(ti) * sstep(0, 3.0, t - ti)); }      // muodostuu kolmessa sekunnissa
    const pen = clamp((t - K0) / (K1 - K0), -0.2, 1.2);
    const live = []; for (let k = 0; k < 8; k++) live.push(jou(t - VYORY * (k / 7)));       // lähin kerros heti, sitten rinnettä ylös Tapion taloon
    const j = jou(t);
    const ti = t - aika.vaskien_isku;
    const cut = ti < 0 ? [0, 0] : [2.4 * (1 - Math.exp(-ti / 0.09)) * Math.exp(-ti / 0.35), 0.9 * (1 - Math.exp(-ti / 0.6)) * Math.exp(-ti / 3.0)];
    const pulssit = ALUT.filter((x) => x.t <= t && t - x.t < 5).slice(-4).map((x) => [t - x.t, x.v]);
    const kipinat = [];
    for (const n of VAIKE) { const ika = t - n[0]; if (ika < -0.05 || ika > n[1] + 0.7) continue;
      const h1 = fract(n[0] * 7.13 + n[2] * 0.37), h2 = fract(n[0] * 3.71 + n[2] * 0.19);
      kipinat.push([(h1 - 0.5) * 190, Math.floor(h2 * 4), 0.95 * Math.sin(Math.PI * clamp((ika + 0.05) / (n[1] + 0.75), 0, 1)) ** 1.5 * (1 - h), 0.55 + 0.4 * fract(h1 * 9.7)]); }
    return { f, j, live, gis, paljastus: gis * (1 - j) * sstep(0.25, 0.6, gis), hills, pen, cut, pulssit, kipinat: kipinat.slice(0, 24), camZ: V * t, camX: VX * t, h };
  }

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

  window.duration = aika.tiedoston_loppu;
  window.contextOk = () => !gl.isContextLost();
  window.camProbe = (t) => ({ p: [0, 1.6, V * t], q: [0, 0, 0, 1], shot: 'matka', cut: 0, trans: false });
  // mittausta varten: mitä ääni ohjaa hetkellä t
  window.kuvaus = (t) => { const s = tila(t); return { jouset: +s.j.toFixed(2), kerrokset: s.live.map((x) => +x.toFixed(2)), gis: +s.gis.toFixed(2), paljastus: +s.paljastus.toFixed(2), kaari: s.hills.filter((x, i) => i % 4 === 0).map((x) => Math.round(x * 1000)), kipinoita: s.kipinat.length }; };
  window.seek = (t) => {
    if (gl.isContextLost()) return false;
    const s = tila(t);
    const pu = new Float32Array(16); s.pulssit.forEach((x, i) => pu.set([x[0], x[1], 0, 0], i * 4));
    const sp = new Float32Array(96); s.kipinat.forEach((x, i) => sp.set(x, i * 4));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(U('uRes'), canvas.width, canvas.height);
    gl.uniform1f(U('uAA'), aa); gl.uniform1f(U('uTime'), t); gl.uniform1f(U('uCamZ'), s.camZ); gl.uniform1f(U('uCamH'), 1.6); gl.uniform1f(U('uHor'), 0.27);
    gl.uniform1f(U('uGis'), s.gis); gl.uniform1f(U('uWind'), puuska(t));
    gl.uniform1f(U('uReveal'), tila(Math.max(0, t - 1.0)).paljastus);      // kaiku: valo vastaa vaaralta hetkeä myöhemmin
    gl.uniform1f(U('uFogL'), 290); gl.uniform1f(U('uTreeZ'), 0);      // etualan puuta ei piirretä (käyttäjä 9.11.2026)
    gl.uniform1f(U('uCamX'), s.camX); gl.uniform1f(U('uPen'), s.pen);
    gl.uniform1fv(U('uProf'), new Float32Array(s.hills)); gl.uniform1fv(U('uLive'), new Float32Array(s.live));
    gl.uniform3f(U('uCut'), s.cut[0], s.cut[1], 0);
    gl.uniform4f(U('uSnow'), 0.10 + 0.30 * Math.min(1, 3 * puuska(t)) + 0.10 * s.h, kohta(kTuuli, t), kohta(kPut, t), kohta(kLahe, t));
    gl.uniform4fv(U('uPulse'), pu); gl.uniform4fv(U('uSpark'), sp); gl.uniform1i(U('uNSpark'), s.kipinat.length);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.finish();
    return true;
  };
  window.sceneReady = true;
}
alusta().catch((e) => { console.error(e); window.sceneError = String(e.message || e); });
