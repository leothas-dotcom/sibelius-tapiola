// Tapiola: maailma 6, "Metsä liikkuu kokonaisena" (jään pinta ja peilikuva), ankkurista pohja_vaihtuu_D ankkuriin
// jousijakso_urkupiste_E_alku. Alkaa rajakuvasta RAJA.JAA, päättyy rajakuvaan RAJA.PIMEYS (visual/yhteinen.js).
// Suunnitelma: docs/kuvakasikirjoitus.md "Maailma 6"; säännöt: docs/visuaalinen_tyyli.md luvut 1, 2, 5 ja 4d; brief: runs/maailma_06/brief.md.
//
// Paikka: musta talvijää, jonka toisella rannalla on siemenen kuva: horisontin valo (teoksen pitkä ääni), sen alla tumma metsän massa
// kerroksittain ja sileät loivat kummut. Kamera on jään tasalla (1 m) ja kulkee jään pintaa pitkin kohti rantaa; ranta on jäässä
// ylösalaisin. Kuva on oikea 3D-säteenseuranta: jään taso y = 0, metsäkerrokset tasoina rannan takana, peilikuva on säteen heijastus.
// - Alku: kamera katsoo suoraan alas jäähän (kuva = rajakuva JAA) ja nousee ja kääntyy hitaasti (alle 13 °/s) vaakaan: jään musta
//   pinta osoittautuu järven pinnaksi, jonka takana on ranta. Kamera ei koskaan mene jään läpi (korkeus aina yli 0,45 m).
// - Metsä liikkuu kokonaisena: koko latvuston massa ja koko peilikuva velloo yhtenä aaltona (jousten voima, vyöry); yksittäinen puu ei liiku.
// - gis (teoksen pitkä ääni) on horisontin valo kaukaisten kumpujen takana; kumpujen muoto seuraa melodian kaarta hitaasti.
// - väike (lyhyet korkeat äänet) on valoa jään alla; matalan kaistan alut ovat valon rengas, joka kulkee jään pinnassa.
// - Pakkanen: käyrätorvien ja puhaltimien sykkeet piirtävät huurretta säröjen ympärille sykäyksittäin; huurre jää.
// - Loppu: musiikki hajoaa; rannalla kaksi valtavaa runkoa tulee usvasta näkyviin ja niiden välinen pimeä kasvaa täyttämään kuvan.
// Kohtaus on puhdas aikafunktio seek(t): kaikki kertymät lasketaan alussa ruuduittain.
import { lataa, luoGL, julkaise, FS_ALKU, GLSL_YHTEINEN, FS_LOPPU, clamp, smooth, sstep, lerp } from './yhteinen.js';

const FS = FS_ALKU + `
uniform float uTime, uT0, uOpen, uCP, uSP, uG, uLevel, uNl, uFrost, uSwell, uSwI, uPh, uPhI, uEnd, uTrunk, uGap, uXT, uMaa, uMist, uFogL;
uniform vec3 uCam;
uniform float uProf[32];   // horisontin kumpujen muoto: melodian kaari, piirtyy vasemmalta oikealle
uniform float uLive[6];    // jousten voima kerroksittain: tummuus vyöryy rannasta kauas
uniform vec4 uPulse[4];    // matalan kaistan alut: ikä, voima
uniform vec4 uSp[24];      // väike jään alla: x, z (m), voima, -
uniform int uNSp;
` + GLSL_YHTEINEN + `
const float F = 1.07;
const float H0 = 0.45;          // alun kamerankorkeus: kuva = rajakuva JAA
const float ZS = 110.0;         // ranta: jää loppuu tähän
const float ZT = 104.0;         // kahden rungon taso
const int NL = 6;
const float LZ[6] = float[6](110.0, 135.0, 170.0, 220.0, 290.0, 390.0);   // metsäkerroksen etäisyys (m)
const float LE[6] = float[6](0.0, 2.0, 5.0, 10.0, 18.0, 30.0);            // maan korkeus: rannan takana kohoava loiva rinne
const float LH[6] = float[6](30.0, 32.0, 34.0, 36.0, 38.0, 40.0);         // latvuston korkeus
const vec3 SKY_TOP = vec3(0.003, 0.005, 0.010), SKY_LOW = vec3(0.011, 0.020, 0.040);
const vec3 FOG = vec3(0.024, 0.040, 0.070);
const vec3 GLOW = vec3(0.56, 0.68, 0.88), SILVER = vec3(0.80, 0.86, 0.95);
const vec3 PIMEYS = vec3(0.0016, 0.0022, 0.0030);

float prof(float u) { u = clamp(u, 0.0, 31.0); int i = int(floor(u)); return mix(uProf[i], uProf[min(i + 1, 31)], fract(u)); }
float tips(float wx, float k, float cell) {
  float tip = 0.0, c = floor(wx / cell);
  for (int j = -1; j <= 1; j++) {
    float ci = c + float(j), h = hash(vec2(ci, k * 5.0 + cell)), sh = hash(vec2(ci, k + 4.0 + cell));
    float xi = (ci + 0.15 + 0.7 * hash(vec2(ci, k + 9.0 + cell))) * cell;
    float w = cell * (0.5 + 1.0 * hash(vec2(ci, k + 2.0)));
    float e = sh > 0.55 ? 1.6 : 0.95;
    tip = max(tip, (0.18 + 0.82 * h * h) * (sh > 0.72 ? 0.7 : 1.0) * max(0.0, 1.0 - pow(abs(wx - xi) / w, e)));
  }
  return tip;
}
float canopy(float wx, float k, float sc) {
  float big = vnoise(vec2(wx * 0.010 + k * 7.1, k * 3.3));
  float mid = vnoise(vec2(wx * 0.045 + k * 1.7, k * 9.1));
  float tp = max(tips(wx, k, 4.3 * sc), 0.6 * tips(wx + 11.0, k + 0.5, 2.3 * sc));
  return 0.34 + 0.40 * big + 0.10 * mid + 0.13 * tp + 0.012 * (vnoise(vec2(wx * 2.6, k)) - 0.5);
}

// kaukainen tausta suunnan mukaan: taivas, horisontin valo ja sileät kummut (äärettömän kaukana, ei parallaksia)
vec3 backdrop(float el, float az, vec3 fogc) {
  float asp = uRes.x / uRes.y;
  vec3 col = mix(SKY_LOW, SKY_TOP, smoothstep(0.05, 0.6, el)) * uLevel;
  float m1 = 0.5 + 0.5 * sin(az * 2.1 + 1.6 * sin(el * 5.3));
  float m2 = vnoise(vec2(az * 3.0, el * 9.0));
  col += FOG * 0.16 * (0.6 * m1 + 0.4 * m2 - 0.4) * exp(-max(el - 0.2, 0.0) / 0.25);
  float u = clamp(0.5 + az * F / asp, 0.0, 1.0) * 31.0;
  float et = 0.235 + 0.025 * (0.5 + 0.5 * sin(az * 3.1 + 0.7)) + 0.012 * exp(-pow((az - 0.22) / 0.30, 2.0)) + 0.018 * uNl;
  et += 0.10 * prof(u - 1.6) + 0.20 * prof(u - 0.8) + 0.40 * prof(u) + 0.20 * prof(u + 0.8) + 0.10 * prof(u + 1.6);
  et += 0.003 * (vnoise(vec2(az * 3.0, 3.0)) - 0.5);
  float above = el - et;
  if (above > 0.0) {
    col += GLOW * uG * (0.34 * exp(-above / 0.055) + 0.035 * exp(-above / 0.22)) * uLevel;
  } else {
    col = mix(FOG * 0.34, FOG * 0.60 + GLOW * uG * 0.03, smoothstep(-0.09, 0.0, above)) * (0.75 + 0.9 * uG) * uLevel;
  }
  col += GLOW * uG * 0.10 * exp(-pow(above / 0.0065, 2.0)) * uLevel;           // kummun reunan valo, pehmeä
  return col;
}

// metsän massa: kuusi kerrosta rannan takana, tasoina; palauttaa värin kerrosten päälle. base = matka kameralta säteen alkuun.
vec3 forest(vec3 col, vec3 o, vec3 d, float base, float mir, vec3 fogc) {
  for (int k = NL - 1; k >= 0; k--) {
    float z = LZ[k] - o.z;
    if (z < 1.5 || d.z < 1e-4) continue;
    float t = z / d.z;
    float wx = o.x + d.x * t, yw = o.y + d.y * t;
    float fk = float(k), pk = 1.0 - fk / 5.0;
    float live = uLive[k];
    float dist = base + t;
    float fg = (1.0 - exp(-dist / uFogL)) * (1.0 - 0.70 * min(live, 1.0) * mix(0.62, 1.0, pk));
    if (yw < LE[k]) { col = mix(vec3(0.007, 0.011, 0.019) * uLevel, fogc, min(fg + 0.30, 1.0)); continue; }
    float hn = (yw - LE[k]) / LH[k];
    if (hn > 1.45) continue;
    float amp = 0.3 + 1.2 * min(live, 1.2);
    float ph = wx * 0.040 - uPh * 0.8 + fk * 1.3;
    float swl = 0.6 * sin(wx * 0.026 - uPh + fk * 0.8) + 0.4 * sin(wx * 0.009 - uPh * 0.55 + 2.1);   // koko massan hidas vellonta
    float sa = uSwell * (1.0 + 0.8 * mir);
    float xs = wx - hn * hn * amp * sin(ph) - hn * 0.3 * amp * sin(wx * 0.31 + uPh * 1.4 + fk) - sa * swl * (1.5 + 5.0 * hn);
    float top = canopy(xs, fk, LZ[k] / 260.0) * (1.0 + sa * 0.10 * swl);
    float a = smoothstep(0.012, -0.012, hn - top);
    if (a <= 0.0) continue;
    float gap = smoothstep(0.68, 0.92, vnoise(vec2(xs * 0.8 + fk * 4.0, hn * 3.0 + fk))) * (0.3 + 0.7 * vnoise(vec2(xs * 3.1, hn * 9.0 + fk + 2.0)))
              * pow(max(0.0, 1.0 - hn / (0.14 + 0.16 * vnoise(vec2(xs * 0.5, fk + 5.0)))), 1.8);
    float veil = 0.34 * exp(-pow((hn - 0.26) / 0.15, 2.0)) * (0.3 + 0.7 * vnoise(vec2(wx * 0.025 - uPh * 0.2, hn * 4.0 + fk * 2.0)));
    vec3 dark = mix(HAMY, FOG * 0.26, 0.30 * fk / 5.0) * (0.72 + 0.6 * vnoise(vec2(xs * 0.8 + fk * 3.0, hn * 7.0 + fk)) * smoothstep(0.8, 0.2, hn));
    vec3 tone = mix(dark, fogc, clamp(fg + veil * (1.0 - 0.6 * min(live, 1.0)), 0.0, 1.0));
    float crest = smoothstep(top - 0.20, top, hn) * (0.5 + 0.5 * sin(ph + 1.2));
    tone += GLOW * (uG * 0.045) * (0.25 + 1.0 * min(live, 1.2)) * crest * crest * (1.0 - 0.7 * fg);
    a *= (1.0 - 0.35 * gap) * (1.0 - 0.55 * fg * fg);
    col = mix(col, tone, a);
  }
  return col;
}

// koko näkymä (taivas, kummut, metsä) säteelle; peilikuvassa sama, säde on heijastunut
vec3 world(vec3 o, vec3 d, float base, float mir, vec3 fogc) {
  float el = d.y / max(length(d.xz), 1e-4);
  float az = d.x / max(d.z, 1e-3);
  vec3 col = backdrop(el, az, fogc);
  col = forest(col, o, d, base, mir, fogc);
  return col;
}

// kaksi valtavaa runkoa rannalla ja niiden välinen pimeä (näkyy myös peilikuvassa)
vec3 pillars(vec3 col, vec3 o, vec3 d) {
  if (uTrunk <= 0.0 && uGap <= 0.0) return col;
  float zt = ZT - o.z;
  if (zt < 0.5 || d.z < 1e-4) return col;
  float t = zt / d.z;
  float wx = o.x + d.x * t, yw = o.y + d.y * t;
  if (yw <= 0.0) return col;
  float fw = t * 8.65e-4 * 1.4 + 1.2;
  float xl = uXT - 12.5, xr = uXT + 12.5, rad = 4.5;
  float inner = smoothstep(xl + rad - 0.5 - fw, xl + rad + 0.5, wx) * smoothstep(xr - rad + 0.5 + fw, xr - rad - 0.5, wx);
  float gapA = uGap * inner * smoothstep(0.0, 1.5, yw) * smoothstep(135.0, 100.0, yw);
  col = mix(col, PIMEYS, gapA);
  float ta = (smoothstep(rad + fw, rad - fw, abs(wx - xl)) + smoothstep(rad + fw, rad - fw, abs(wx - xr))) * smoothstep(0.0, 0.6, yw) * smoothstep(130.0, 95.0, yw);
  float bark = 0.6 + 0.9 * vnoise(vec2(wx * 1.3, yw * 0.08)) + 0.4 * (vnoise(vec2(wx * 6.0, yw * 0.05)) - 0.5);
  vec3 tcol = mix(HAMY, NOKI, 0.5) * bark;
  tcol = mix(tcol, FOG * 0.8, 0.55 * exp(-yw / 7.0));
  tcol = mix(tcol, FOG * 0.7, 1.0 - exp(-t / uFogL));
  return mix(col, tcol, clamp(ta * uTrunk, 0.0, 1.0));
}

// jään pinta: pohjasävy (rajakuva), säröt, huurre, lumi, valon rengas, väike jään alla ja metsän peilikuva
float rid(vec2 q) { return 1.0 - abs(2.0 * vnoise(q) - 1.0); }
vec3 vor(vec2 p, float warp) {
  p += warp * (vec2(vnoise(p * 0.7), vnoise(p * 0.7 + 5.2)) - 0.5);
  vec2 ip = floor(p), fp = fract(p);
  float d1 = 8.0, d2 = 8.0; vec2 id1 = vec2(0.0), id2 = vec2(0.0);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j)), c = ip + g;
    vec2 pt = g + vec2(hash(c), hash(c + 17.3)) - fp;
    float dd = dot(pt, pt);
    if (dd < d1) { d2 = d1; id2 = id1; d1 = dd; id1 = c; } else if (dd < d2) { d2 = dd; id2 = c; }
  }
  return vec3((sqrt(d2) - sqrt(d1)) * 0.5, hash(id1 + id2 * 1.31 + 3.7), 0.0);
}
vec3 iceShade(vec3 o, vec3 d, float t, vec3 hit, vec3 fogc) {
  vec2 xz = hit.xz;
  float cosT = max(-d.y, 0.012);
  float fp = t * 8.65e-4 * 1.3;                  // pikselin jalanjälki säteen poikki (m)
  float fz = fp / cosT;                          // jalanjälki jään pinnalla katseen suunnassa
  // pohjasävy: tarkalleen rajakuva JAA alussa, hälvenee keskiarvoksi, kun kuvion koko alittaa pikselin
  vec2 P = vec2(1.7777778 * 0.5 + xz.x * F / H0, 0.5 + xz.y * F / H0);
  float amp0 = (1.0 - smoothstep(0.30, 1.0, fz / 0.047)) * (1.0 - smoothstep(0.30, 1.0, fp / 0.14));
  float vn = mix(0.5, vnoise(vec2(P.x * 3.0, P.y * 9.0 + uT0 * 0.02)), amp0);
  vec3 base = vec3(0.004, 0.009, 0.016) * (1.0 + 0.8 * vn);
  // säröt: kaksi kokoluokkaa; reunat ovat vain osassa soluja
  vec3 v1 = vor(xz / 4.6, 1.1), v2 = vor(xz / 1.1 + 9.0, 0.9);
  float w1 = 0.016 / 4.6 + fz / 4.6 * 1.1, w2 = 0.007 / 1.1 + fz / 1.1 * 1.1;
  float brk = 0.35 + 0.65 * smoothstep(0.30, 0.65, vnoise(xz * vec2(0.6, 0.6) + 21.0));
  float on1 = step(0.50, v1.y) * brk, on2 = step(0.70, v2.y) * brk;
  float cr = on1 * (1.0 - smoothstep(0.0, w1, v1.x)) * (0.016 / 4.6) / w1 + on2 * (1.0 - smoothstep(0.0, w2, v2.x)) * (0.007 / 1.1) / w2 * 0.8;
  float crHalo = on1 * exp(-v1.x * 4.6 / 0.07) * 0.22;                       // särön ympärillä hieman vaaleampaa jäätä
  // huurre: kasvaa säröistä ulospäin sykäyksittäin (uFrost), jää
  float feather = 0.45 * fbm(xz * 1.6 + 7.0) + 0.55 * vnoise(xz * 11.0) * (1.0 - smoothstep(0.3, 1.0, fp / 0.05)) + 0.25 * pow(rid(xz.yx * vec2(13.0, 3.1) + 4.0), 5.0) * (1.0 - smoothstep(0.3, 1.0, fp / 0.06));
  float frost = 0.0;
  if (uFrost > 0.002) {
    float reach = uFrost * 1.5 * (0.55 + 0.9 * feather);
    frost = smoothstep(reach, reach * 0.15, v1.x * 4.6) * on1;
    float reach2 = uFrost * 0.45 * (0.55 + 0.9 * feather);
    frost = max(frost, smoothstep(reach2, reach2 * 0.15, v2.x * 1.1) * on2);
    frost *= (0.30 + 0.70 * feather);
  }
  // lumi jään pinnalla: tuulen ajamia viiruja
  float sn = smoothstep(0.66, 0.86, fbm(vec2(xz.x * 0.09, xz.y * 0.33) + 3.0)) * (0.7 + 0.3 * vnoise(xz * 7.0));
  float cover = clamp(sn + 0.75 * frost, 0.0, 1.0);
  // peilikuva: heijastus jään pinnasta; kaltevuus = pieni epätasaisuus + vellova aalto koko kuvassa
  vec3 rd = vec3(d.x, -d.y, d.z);
  float psi = (rd.x / max(rd.z, 1e-3)) * 5.0 - uPhI;
  rd.y += uSwI * (0.0065 * sin(psi) + 0.0040 * sin(psi * 2.3 + 1.7 * rd.y / max(length(rd.xz), 1e-3) * 20.0 - uPhI * 0.5));
  rd.x += uSwI * 0.0040 * sin(psi * 0.7 + 1.0);
  rd.y += 0.0012 * (vnoise(xz * vec2(0.9, 0.5)) - 0.5) * (1.0 - smoothstep(0.3, 1.0, fz / 1.0));
  rd = normalize(rd);
  vec3 refl = vec3(0.0);
  for (int i = 0; i < 3; i++) { vec3 r2 = rd; r2.y += (float(i) - 1.0) * 0.011; r2 = normalize(r2);
    refl += (i == 1 ? 0.5 : 0.25) * pillars(world(hit, r2, t, 1.0, fogc), hit, r2); }
  float fr = 0.02 + 0.98 * pow(1.0 - cosT, 5.0);
  vec3 col = base + refl * fr * 0.80 * (1.0 - cover) * uOpen;
  // särön ja huurteen valo: horisontin valo valaisee
  vec3 lit = HALLA * (0.05 + 0.65 * uG) * uOpen;
  col += lit * (0.55 * cr + crHalo * 0.25);
  col += lit * 0.30 * frost * (0.45 + 0.9 * feather);
  col += HALLA * (0.006 + 0.040 * uG) * sn * (1.0 - frost) * uOpen;
  // huurteen kimmellys: pysyviä kiteen pisteitä, ei vilku
  float gl = step(0.992, hash(floor(xz * 55.0))) * frost * (1.0 - smoothstep(0.3, 1.0, fp / 0.03));
  col += SILVER * 0.22 * gl * (0.2 + uG) * uOpen;
  // valon rengas jään pinnassa: matalan kaistan alut (maan sysäys)
  for (int i = 0; i < 4; i++) { vec4 pu = uPulse[i]; if (pu.y <= 0.0) continue;
    float r = length(vec2(xz.x - uCam.x, (xz.y - uCam.z - 22.0) * 0.5)) - pu.x * 9.0;
    col += GLOW * pu.y * 0.040 * exp(-pu.x * 0.9) * exp(-r * r / 60.0) * uOpen; }
  col += HALLA * 0.012 * uMaa * exp(-t / 30.0) * uOpen;                       // maan hohto: basso soi
  // väike jään alla: lyhyet korkeat äänet, pehmeä valo pinnan alla
  for (int i = 0; i < 24; i++) { if (i >= uNSp) break; vec4 sp = uSp[i];
    float sx = 0.0065 * t, sz = 0.0065 * t * t / max(o.y, 0.3);
    vec2 q = (xz - sp.xy) / vec2(sx, sz);
    float rr = dot(q, q);
    col += SILVER * sp.z * (0.9 * exp(-rr) + 0.17 * exp(-rr * 0.07)) * 0.85 * uOpen; }
  return col * (1.0 - 0.75 * uGap);
}

vec3 scene(vec2 p) {
  float asp = uRes.x / uRes.y;
  float dx = p.x - asp * 0.5, dy = p.y - 0.5;
  vec3 d = normalize(vec3(dx, dy * uCP + F * uSP, F * uCP - dy * uSP));
  vec3 o = uCam;
  vec3 fogc = FOG * (0.62 + 1.0 * uG) * uLevel;
  vec3 col;
  float tIce = d.y < -1e-4 ? -o.y / d.y : 1e9;
  vec3 hit = o + d * tIce;
  if (d.y < -1e-4 && hit.z < ZS) col = iceShade(o, d, tIce, hit, fogc);
  else col = world(o, d, 0.0, 0.0, fogc) * uOpen;
  col = pillars(col, o, d);
  float elg = abs(d.y) / max(length(d.xz), 1e-4);
  col += fogc * 1.1 * uMist * exp(-elg / 0.018) * uOpen;                      // matala usva rannan ja jään rajalla
  col = mix(col, PIMEYS, uEnd);
  return col;
}
` + FS_LOPPU;

// ---------------------------------------------------------------------------------------------------------------------
// Signaalit (puhtaat aikafunktiot). Viedään, jotta samat luvut voi mitata Nodessa ilman selainta.
export function signaalit(d) {
  const A = d.aika, FPS = d.FPS;
  d.vaadi('pohja_vaihtuu_D', 'gis_palaa', 'peikot_G_alku', 'peikot_G_loppu', 'h_urkupiste_vyory', 'vaskipulssit', 'hajoaa_hiljaisuuteen', 'jousijakso_urkupiste_E_alku');
  const T0 = A.pohja_vaihtuu_D, T1 = A.jousijakso_urkupiste_E_alku;
  const TIN = 12;                                       // alun avautuminen: katse alas -> vaakaan (s)
  const PHI0 = -Math.PI / 2, PHI1 = 0;
  const H_0 = 0.45, H_1 = 1.0, ZEND = 101, DRIFT = 0.10;
  const urku = (t) => d.tapahtuu('urkupiste', t);
  // kuunteluoppaan ankkureista: vyöry (H-urkupiste, koko orkesteri) ja jousten voima
  const vy = (t) => sstep(A.h_urkupiste_vyory - 0.5, A.h_urkupiste_vyory + 3, t) * (1 - sstep(A.vaskipulssit - 0.5, A.vaskipulssit + 3, t));
  const Sj = (t) => sstep(0.28, 0.85, d.keski(t, 0.8));
  // horisontin valo: teoksen pitkä ääni; gis palaa (gis_palaa) vahvempana kuin sitä edeltävä pitkä e
  const wG = (t) => 0.55 + 0.45 * sstep(A.gis_palaa - 1, A.gis_palaa + 1, t);
  const G = (t) => clamp(0.10 + 0.95 * wG(t) * sstep(0.04, 0.70, d.pitka(t, 1.2)), 0, 1.1);
  // kameran vauhti: hidas keskiarvo koneen kuulemasta liikkeestä; alussa nousee nollasta
  const sLiike = d.sarja((f) => (d.tapahtuu('liike', f / FPS) ? 1 : 0));
  const vauhti = (t) => sstep(T0 + 2, T0 + TIN + 6, t) * (0.8 + 0.4 * d.ka(sLiike, t * FPS, 5 * FPS));
  const sV = d.sarja((f) => vauhti(f / FPS) / FPS);
  const sVkoko = d.kohta(sV, T1);
  const camZ = (t) => ZEND * d.kohta(sV, clamp(t, T0, T1)) / sVkoko;
  const camX = (t) => DRIFT * camZ(t);
  const pitch = (t) => lerp(PHI0, PHI1, smooth(clamp((t - T0) / TIN, 0, 1)));
  const camH = (t) => lerp(H_0, H_1, smooth(clamp((t - T0) / TIN, 0, 1)));
  // vellonnan vaihe: kertymä; hidas, raskas
  const sPh = d.sarja((f) => (0.20 + 0.45 * Sj(f / FPS) + 0.9 * vy(f / FPS)) / FPS);
  const sPhI = d.sarja((f) => (0.25 + 0.40 * Sj(f / FPS) + 0.9 * vy(f / FPS)) / FPS);
  // nousu ja lasku: hidas keskiarvo
  const sNl = d.sarja((f) => (d.tapahtuu('nousu', f / FPS) ? 1 : 0) - (d.tapahtuu('lasku', f / FPS) ? 1 : 0));
  // melodian kaari: kumpujen muoto
  const kaari = (t) => clamp((d.melodia(t, 2.6) - 68) * 0.0050, -0.05, 0.075);
  // pakkasen sykkeet: käyrätorvien ja puhaltimien pitkän äänen alut vaskipulssien jaksolla (kuunneltu: noin 4 s välein)
  const PUL = (() => {
    const g = new Float32Array(d.NF); for (let f = 0; f < d.NF; f++) g[f] = d.taso(68, f);
    const c = []; const lo = Math.round((A.vaskipulssit - 6) * FPS), hi = Math.round((A.hajoaa_hiljaisuuteen + 2) * FPS);
    for (let f = lo; f < hi; f++) { let mn = 9; for (let k = 3; k <= 36; k++) mn = Math.min(mn, g[f - k]);
      if (g[f] > 0.3 && g[f - 1] <= 0.3 && mn < 0.12) c.push(f / FPS); }
    const p = (t) => d.pitka(t, 0.3);
    for (let t = A.vaskipulssit - 6; t < A.hajoaa_hiljaisuuteen + 2; t += 0.1) if (p(t) > p(t - 0.4) + 0.12 && p(t - 0.4) < p(t - 1.2) + 0.5) c.push(t);
    c.sort((a, b) => a - b); const out = [];
    for (const x of c) if (x >= A.vaskipulssit - 0.5 && x <= A.hajoaa_hiljaisuuteen && (!out.length || x - out[out.length - 1] > 2.0)) out.push(x);
    return out; })();
  const frost = (t) => Math.min(1, PUL.reduce((s, tp) => s + (t > tp ? 0.125 * smooth(clamp((t - tp) / 1.4, 0, 1)) : 0), 0));
  // väike: lyhyet korkeat äänet; paikka jään pinnalla kameran edessä, korkeus -> etäisyys (korkea = kauempana)
  const VAIKE = d.nuotit.filter((n) => n[2] >= 72 && n[1] < 0.9 && n[0] >= T0 && n[0] <= T1).map((n) => {
    const h1 = (Math.sin(n[0] * 12.9898 + n[2] * 3.7) * 43758.5453) % 1, h2 = (Math.sin(n[0] * 78.233 + n[2] * 1.3) * 12345.6789) % 1;
    const a1 = Math.abs(h1), a2 = Math.abs(h2);
    const ahead = 6 + 62 * Math.pow(clamp((n[2] - 72) / 28, 0, 1), 1.2);
    const cx = camX(n[0]), cz = camZ(n[0]);
    return { t: n[0], dur: n[1], x: cx + (a1 - 0.5) * ahead * 1.3, z: cz + ahead * (0.9 + 0.2 * a2), n };
  });
  const peikot = (t) => sstep(A.peikot_G_alku - 0.2, A.peikot_G_alku + 0.3, t) * (1 - sstep(A.peikot_G_loppu - 0.1, A.peikot_G_loppu + 1.0, t));
  const sparks = (t) => {
    const out = [];
    for (const v of VAIKE) { const ika = t - v.t; if (ika < -0.05 || ika > v.dur + 0.7) continue;
      const k = 0.95 * Math.sin(Math.PI * clamp((ika + 0.05) / (v.dur + 0.75), 0, 1)) ** 1.5 * (0.35 + 0.65 * peikot(t));
      out.push([v.x, v.z, k, 0]); }
    return out.slice(-24);
  };
  const trunkVis = (t) => sstep(A.hajoaa_hiljaisuuteen - 4, A.hajoaa_hiljaisuuteen + 18, t);
  const gap = (t) => sstep(A.hajoaa_hiljaisuuteen + 2, T1 - 9, t);
  function tila(t) {
    const f = t * FPS, L = d.koko(t, 1.5);
    const live = []; for (let k = 0; k < 6; k++) live.push(Sj(t - 1.6 * (k / 5)) * (1 - 0.4 * (urku(t) ? 0 : 0)));
    const hills = []; for (let i = 0; i < 32; i++) { const ti = T0 + (i / 31) * (T1 - T0); hills.push(ti > t ? 0 : kaari(ti) * sstep(0, 3.0, t - ti)); }
    const pulssit = d.alut.filter((x) => x.t <= t && t - x.t < 5).slice(-4).map((x) => [t - x.t, x.v]);
    const nl = d.ka(sNl, f, 2.0 * FPS);
    const vyor = vy(t);
    return { t, pitch: pitch(t), h: camH(t), z: camZ(t), x: camX(t), G: G(t), L, live, hills, pulssit, sp: sparks(t), nl,
      frost: frost(t), swell: 0.22 + 0.45 * Sj(t) + 0.55 * vyor, swI: 0.30 + 0.45 * Sj(t) + 0.85 * vyor,
      ph: d.kohta(sPh, t), phI: d.kohta(sPhI, t), trunk: trunkVis(t), gap: gap(t), xt: camX(T1),
      open: sstep(T0, T0 + 1.5, t), end: sstep(T1 - 6, T1, t), maa: d.matala(t, 0.8) * (urku(t) ? 1 : 1), mist: 0.30,
      vyor, sj: Sj(t) };
  }
  return { T0, T1, tila, PUL, urku, vy, Sj, G, trunkVis, gap, frost, sparks, VAIKE, camZ, camX, pitch, camH, ZEND };
}

async function alusta() {
  const d = await lataa();
  const S = signaalit(d);
  const { T0, T1 } = S;
  const { gl, U, piirra } = luoGL(FS);
  julkaise({
    gl, aika: d.aika,
    kamera: (t) => { const s = S.tila(t); return { p: [s.x, s.h, s.z], q: [Math.sin(s.pitch / 2), 0, 0, Math.cos(s.pitch / 2)], shot: 'jaa', cut: 0, trans: t - T0 < 12 || T1 - t < 6 }; },
    kuvaus: (t) => { const s = S.tila(t); return { t: +(t - T0).toFixed(1), pitchDeg: +(s.pitch * 180 / Math.PI).toFixed(1), kork: +s.h.toFixed(2), z: +s.z.toFixed(1), valo: +s.G.toFixed(2),
      jouset: +s.sj.toFixed(2), vyory: +s.vyor.toFixed(2), huurre: +s.frost.toFixed(2), vaihe: +s.ph.toFixed(1), vaike: s.sp.length, renkaita: s.pulssit.length, runko: +s.trunk.toFixed(2), pimea: +s.gap.toFixed(2), urkupiste: S.urku(t) }; },
    seek: (t) => {
      const s = S.tila(t);
      gl.uniform1f(U('uTime'), t); gl.uniform1f(U('uT0'), T0); gl.uniform1f(U('uOpen'), s.open);
      gl.uniform1f(U('uCP'), Math.cos(s.pitch)); gl.uniform1f(U('uSP'), Math.sin(s.pitch));
      gl.uniform1f(U('uG'), s.G); gl.uniform1f(U('uLevel'), 0.80 + 0.35 * s.L); gl.uniform1f(U('uNl'), s.nl);
      gl.uniform1f(U('uFrost'), s.frost); gl.uniform1f(U('uSwell'), s.swell); gl.uniform1f(U('uSwI'), s.swI);
      gl.uniform1f(U('uPh'), s.ph); gl.uniform1f(U('uPhI'), s.phI);
      gl.uniform1f(U('uEnd'), s.end); gl.uniform1f(U('uTrunk'), s.trunk); gl.uniform1f(U('uGap'), s.gap); gl.uniform1f(U('uXT'), s.xt);
      gl.uniform1f(U('uMaa'), s.maa); gl.uniform1f(U('uMist'), s.mist); gl.uniform1f(U('uFogL'), 520);
      gl.uniform3f(U('uCam'), s.x, s.h, s.z);
      gl.uniform1fv(U('uProf'), new Float32Array(s.hills)); gl.uniform1fv(U('uLive'), new Float32Array(s.live));
      const pu = new Float32Array(16); s.pulssit.forEach((x, i) => pu.set([x[0], x[1], 0, 0], i * 4)); gl.uniform4fv(U('uPulse'), pu);
      const sp = new Float32Array(96); s.sp.forEach((x, i) => sp.set(x, i * 4)); gl.uniform4fv(U('uSp'), sp); gl.uniform1i(U('uNSp'), s.sp.length);
      piirra();
    },
  });
}
if (typeof document !== 'undefined') alusta().catch((e) => { console.error(e); window.sceneError = String(e.message || e); });
