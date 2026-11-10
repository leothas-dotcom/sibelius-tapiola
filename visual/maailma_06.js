// Tapiola: maailma 6 (jään pinta ja peilikuva), ankkurista pohja_vaihtuu_D ankkuriin jousijakso_urkupiste_E_alku.
// Alkaa rajakuvasta RAJA.JAA, päättyy rajakuvaan RAJA.PIMEYS (visual/yhteinen.js).
// v5 (10.11.2026): moduuli rakennettiin uudelleen kuunteluoppaan mukaan: nymfien leikki jäällä, taite (I_ratsastus), Tapio (bassot), englannintorven laulu.
// Brief: runs/v5_06/brief.md; säännöt: docs/visuaalinen_tyyli.md luvut 1, 2, 5, 7b, 4d ja 12.
//
// Paikka (säilyy): musta talvijää, jonka toisella rannalla on siemenen kuva: horisontin valo (teoksen pitkä ääni), tumma metsän massa kerroksittain ja
// sileät kummut. Kamera kulkee jään pintaa pitkin kohti rantaa; ranta on jäässä ylösalaisin. Kuva on säteenseurantaa: jää y = 0, metsäkerrokset tasoina.
// - Puu on jäykkä kappale: siluetti ei muuta muotoaan; ainoa liike on taipuma sivulle tyvestä latvaan (enintään 2-4 % korkeudesta, enintään 0,3 Hz,
//   vaihe paikan mukaan, voima = jousten voima 1,6 s tasoitettuna). Yli 150 m päässä ei taivuta. Ei latvuston vellontaa.
// - Valot ovat mitattuja alkuja: HP (ylä- ja keskirekisteri) ja LP (matala kaista) lasketaan d.taso:sta (spektri); mikään ei ole keksittyä rytmiä.
// - Lumi liikkuu aina: sijainti on tuulen nopeuden kertymä (jousten voima, paisutus, äänen alkujen puuskat).
// - Kamera: nopeus kasvaa tasaisesti I_ratsastus -> h_urkupiste_vyory + 10 s ja hidastuu vaskipulssit-kohdassa; ei pyöri.
// v6 (10.11.2026, rivit 67-69): hyppijän jokainen kosketus on yksi mitattu alku (d.cues.alut, ruudun tarkkuus), ei autokorrelaatiota; 6:30 on enintään kahdeksan hyppijää
// jotka koskettavat jäätä yhtä aikaa tutin alulla ja pysähtyvät H_puhaltimissa; jäällä ei ole renkaita vaan halkeamia (kosketus jatkaa halkeamaa, patarummun isku on pitkä halkeama).
// Kohtaus on puhdas aikafunktio seek(t): kaikki kertymät lasketaan alussa ruuduittain.
import { lataa, luoGL, julkaise, FS_ALKU, GLSL_YHTEINEN, FS_LOPPU, clamp, smooth, sstep, lerp } from './yhteinen.js';

const FS = FS_ALKU + `
uniform float uTime, uT0, uOpen, uCP, uSP, uG, uLevel, uNl, uFrost, uPh, uZI, uRideK, uRideD, uEnd, uTrunk, uGap, uXT, uLow, uMist, uFogL;
uniform float uIceDim, uDuck;
uniform float uSnX, uSnY, uStr, uIceD, uGustF, uGustK, uTop, uPuffK;
uniform vec3 uCam;
uniform float uProf[32];   // horisontin kumpujen muoto: melodian kaari, piirtyy vasemmalta oikealle
uniform float uLive[6];    // jousten voima kerroksittain: tummuus ja terävyys (ei muodon muutosta)
uniform vec4 uRg[8];       // jään alla olevat pehmeät hehkut (kummut, sykäykset): x, z (m), ikä 0..1, voima
uniform vec4 uRh[8];       // hehkun säde alussa (m), lopussa (m), -, liuku (m)
uniform int uNRg;
uniform vec4 uCrA[80];     // halkeaman jana jään koordinaateissa: ax, az, bx, bz (m)
uniform vec4 uCrB[80];     // voima (0..1), leveys (m), huurteen kukan koko (m, 0 = ei kukkaa), siemen
uniform int uNCr;
uniform vec4 uL[40];       // valon pilkahdukset: ruutupaikka x, y, heijastuksen y, voima
uniform vec4 uM[40];       // ytimen koko (p-yksikköä), tähti, heijastuksen voima, -
uniform int uNL;
uniform vec4 uStripe;      // englannintorven valojuova: x, y keski, puolipituus, voima
uniform vec4 uTrill;       // huilun trillit: voima, -, -, -
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
    float w = cell * (0.55 + 0.9 * hash(vec2(ci, k + 2.0)));
    float e = sh > 0.80 ? 1.8 : 1.05;                                   // v5: useimmat kapeita kuusen latvoja (kärki), harvat pyöreämpiä; eri korkuisia
    tip = max(tip, (0.12 + 0.88 * h * h) * max(0.0, 1.0 - pow(abs(wx - xi) / w, e)));
  }
  return tip;
}
float canopy(float wx, float k, float sc) {
  float big = vnoise(vec2(wx * 0.010 + k * 7.1, k * 3.3));
  float mid = vnoise(vec2(wx * 0.045 + k * 1.7, k * 9.1)) + 0.6 * vnoise(vec2(wx * 0.15 + k * 3.1, k * 2.3));
  float tp = max(tips(wx, k, 4.3 * sc), 0.6 * tips(wx + 11.0, k + 0.5, 2.3 * sc));
  return 0.32 + 0.34 * big + 0.10 * mid + 0.17 * tp + 0.012 * (vnoise(vec2(wx * 2.6, k)) - 0.5);
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
  col += GLOW * uG * 0.05 * exp(-pow(above / 0.011, 2.0)) * uLevel;            // kummun reunan valo, pehmeä (v5: pehmennetty, ei kovaa reunaviivaa)
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
    // v5 kierros 2: ranta on yli sadan metrin päässä, joten sen siluetti on täysin jäykkä: ei taipumaa, ei pulssia, ei läpikuultavuutta.
    // Jokainen kerros on peittävä; jousten voima (hitaasti tasoitettu) muuttaa vain usvan määrää ja valoa kerrosten välissä.
    float xs = wx;
    float top = canopy(xs, fk, LZ[k] / 260.0);
    float ew = 0.012 + mir * (0.04 + 0.10 * clamp(dist / 200.0, 0.0, 1.0));                      // kierros 3: peilikuvassa latvojen reuna pehmeä (ei teräviä hampaita)
    float a = smoothstep(ew, -ew, hn - top);
    if (a <= 0.0) continue;
    // kierros 3: kerroksen runko on tasainen (ei pystyraitaa eikä läpikuultavia kolmioita latvojen alla)
    float veil = 0.10 * exp(-pow((hn - 0.26) / 0.25, 2.0)) * (0.55 + 0.45 * vnoise(vec2(wx * 0.012, fk * 2.0)));
    vec3 dark = mix(HAMY, FOG * 0.26, 0.30 * fk / 5.0) * (0.80 + 0.30 * vnoise(vec2(xs * 0.10 + fk * 3.0, hn * 1.5 + fk)));
    vec3 tone = mix(dark, fogc, clamp(fg + veil * (1.0 - 0.6 * min(live, 1.0)), 0.0, 1.0));
    float crest = 0.25 * smoothstep(top - 0.30, top, hn) * (0.7 + 0.3 * sin(wx * 0.02 + fk - uPh * 0.12));      // hidas valon kulku latvojen reunalla (ei muodon muutosta)
    tone += GLOW * (uG * 0.045) * (0.25 + 1.0 * min(live, 1.2)) * crest * crest * (1.0 - 0.7 * fg);
    a *= (1.0 - 0.65 * uTrunk);
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
  float fw = t * 8.65e-4 * 1.4 + 0.4;
  float xl = uXT - 12.5, xr = uXT + 12.5, rad = 4.5;
  float edgeN = 1.2 * (vnoise(vec2(yw * 0.35, 3.0)) - 0.5);
  // runko: reunavalo horisontin valosta ja usvan tummuus tyvessä
  float dl = abs(wx - xl) + edgeN, dr = abs(wx - xr) + edgeN;
  float ta = (smoothstep(rad + fw, rad - fw, dl) + smoothstep(rad + fw, rad - fw, dr)) * smoothstep(0.0, 0.6, yw) * smoothstep(130.0, 95.0, yw);
  float inl = clamp((rad - dl) / rad, 0.0, 1.0), inr = clamp((rad - dr) / rad, 0.0, 1.0);
  float side = (wx < uXT) ? inl : inr;
  // kierros 3: tumma runko, kaarnan sävy (harmaanruskea), pystysuora uurteinen kaarna; ei vaalea usvapylväs. Vain ohut valo aukkoa kohti olevalla reunalla.
  float bark = 0.55 + 0.9 * vnoise(vec2(wx * 2.4, yw * 0.04)) + 0.6 * (vnoise(vec2(wx * 9.0, yw * 0.02)) - 0.5);
  vec3 tcol = vec3(0.0105, 0.0082, 0.0066) * max(bark, 0.15) * (0.55 + 0.45 * side) + GLOW * (0.0012 + 0.0045 * uG) * pow(1.0 - side, 4.0);
  col = mix(col, tcol, clamp(ta * uTrunk, 0.0, 1.0));
  // pimeä väli: aukko kasvaa keskeltä, pehmeät epäsäännölliset reunat
  float wA = 1.5 + 11.0 * pow(uGap, 1.1);
  float ap = smoothstep(wA + 2.0 + fw, wA - 2.0, abs(wx - uXT) + 2.0 * (vnoise(vec2(yw * 0.18, 9.0)) - 0.5)) * smoothstep(0.0, 4.0, yw) * smoothstep(135.0, 100.0, yw);
  return mix(col, PIMEYS, clamp(ap * min(uGap * 3.0, 1.0), 0.0, 1.0));
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
  vec2 xz = hit.xz + vec2(0.0, uZI);              // jään oma koordinaatisto: jää virtaa katsojan ali nopeammin kuin ranta lähenee
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
  vec2 xd = vec2(xz.x - uIceD, xz.y);                                         // ajelehtiva lumi: kuvio liikkuu jään yli (uIceD = kertymä, m)
  float sn = smoothstep(0.66, 0.86, fbm(vec2(xd.x * 0.09, xd.y * 0.33) + 3.0)) * (0.7 + 0.3 * vnoise(vec2(xd.x * 3.0 + xd.y * 4.0, xd.y * 9.0))) * (0.75 + 0.25 * vnoise(vec2(xd.x * 0.6, xd.y * 1.7)));
  float cover = clamp(0.6 * sn + 0.35 * frost, 0.0, 0.55);
  // peilikuva: heijastus jään pinnasta; kaltevuus = pieni epätasaisuus + vellova aalto koko kuvassa
  vec3 rd = vec3(d.x, -d.y, d.z);
  float psi = (rd.x / max(rd.z, 1e-3)) * 1.5;
  rd.y += 0.04 * (0.0065 * sin(psi) + 0.0040 * sin(psi * 2.3 + 1.7 * rd.y / max(length(rd.xz), 1e-3) * 20.0));   // v5: kiinteä pieni epätasaisuus, ei vellovaa pintaa
  rd.x += 0.04 * 0.0040 * sin(psi * 0.7 + 1.0);
  rd.y += 0.0012 * (vnoise(xz * vec2(0.9, 0.5)) - 0.5) * (1.0 - smoothstep(0.3, 1.0, fz / 1.0));
  rd = normalize(rd);
  vec3 refl = vec3(0.0);
  { vec3 r2 = rd;                                                  // v5: yksi heijastussäde (käännösaika); pehmennys tehdään jäljempänä
    refl = pillars(world(hit, r2, t, 1.0, fogc), hit, r2); }
  float fr = 0.02 + 0.98 * pow(1.0 - cosT, 5.0);
  vec3 col = base + refl * fr * 0.8 * (1.0 - cover) * uOpen;
  // särön ja huurteen valo: horisontin valo valaisee
  vec3 lit = HALLA * (0.05 + 0.65 * uG) * uOpen;
  col += lit * (0.55 * cr + crHalo * 0.25);
  col += lit * 0.30 * frost * (0.45 + 0.9 * feather);
  col += HALLA * (0.006 + 0.040 * uG) * sn * (1.0 - frost) * uOpen;
  // huurteen kimmellys: pysyviä kiteen pisteitä, ei vilku
  float gl = step(0.992, hash(floor(xz * 55.0))) * frost * (1.0 - smoothstep(0.3, 1.0, fp / 0.03));
  col += SILVER * 0.22 * gl * (0.2 + uG) * uOpen;
  // jään alla olevat valot (matalan kaistan alut): pehmeä hehku A * exp(-r^2 / R^2) (ei reunaa, ei rengasta, ei säteitä); v6: renkaita ei ole lainkaan.
  vec3 hump = vec3(0.0);                                                       // loppukorjaus: kummun valo erikseen, jään perusvalo himmennetään sen alta
  for (int i = 0; i < 8; i++) { if (i >= uNRg) break; vec4 rg = uRg[i], rh = uRh[i];
    float ag = rg.z, r = length(xz - vec2(rg.x, rg.y - rh.w * ag));
    float R = rh.x + (rh.y - rh.x) * (1.0 - (1.0 - ag) * (1.0 - ag));
    float A = rg.w * (0.25 + 0.75 * pow(4.0 * ag * (1.0 - ag), 0.8)) * pow(1.0 - ag, 0.6) * smoothstep(0.0, 0.05, ag);
    hump += SILVER * 0.85 * A * exp(-r * r / (R * R)) * uOpen; }
  // v6: halkeamat. Jana (a -> b) piirtyy kokonaan syntyruudussaan; paksuus epäsäännöllinen, reunoilla huurretta, janan päässä pieni huurteen kukka.
  // Halkeama pysyy jään koordinaatistossa (virtaa katsojan ali jään mukana); voima (B.x) tulee ajasta (pehmeä himmeneminen).
  { float crk = 0.0, crh = 0.0, flw = 0.0;
    for (int i = 0; i < 80; i++) { if (i >= uNCr) break; vec4 A = uCrA[i], B = uCrB[i];
      vec2 a = A.xy, ab = A.zw - A.xy; float L2 = max(dot(ab, ab), 1e-4);
      vec2 m = a + 0.5 * ab; float rl = 0.5 * sqrt(L2) + 0.5 + 4.0 * fz;
      if (abs(xz.x - m.x) > rl || abs(xz.y - m.y) > rl) continue;
      float s = clamp(dot(xz - a, ab) / L2, 0.0, 1.0); vec2 pq = xz - (a + ab * s); float dd = length(pq);
      float w0 = B.y * (0.45 + 1.1 * vnoise(vec2(s * 5.0 + B.w, B.w * 1.7))), w = max(w0, 0.8 * fz);
      crk += B.x * exp(-dd * dd / (w * w)) * (w0 / w);
      crh += B.x * exp(-dd / 0.11) * (0.25 + 0.75 * vnoise(xz * 7.0 + B.w)) * (w0 / w);
      if (B.z > 0.0) { vec2 pb = xz - A.zw; float rb = length(pb);
        if (rb < 3.0 * B.z) { float an = atan(pb.y, pb.x), pet = 0.5 + 0.5 * cos(6.0 * an + B.w * 6.0);
          flw += B.x * (exp(-rb * rb / (B.z * B.z * 0.35)) * (0.35 + 0.65 * pet * pet) + 0.6 * exp(-rb * rb / (B.z * B.z * 0.03)) * 0.5); } } }
    col += HALLA * (0.14 + 0.55 * uG) * (1.5 * min(crk, 1.2) + 0.30 * min(crh, 1.0) + 0.9 * min(flw, 1.0)) * uOpen; }
  col += HALLA * uLow * exp(-length(xz - vec2(uCam.x, uCam.z + uZI + 14.0)) / 22.0) * uOpen;
  // ajolumi: pitkiä viiruja jään pintaa pitkin katsojaa kohti ja ohi, rytmikkäinä puuskina (uRideD = kertymä m)
  // kierros 3: ei yhtenäisiä säteitä eikä puolisuunnikkaita: erillisiä matalia, pehmeitä lumiviiruja (kaksi solukokoa), jotka virtaavat katsojaa kohti
  if (uRideK > 0.0) { float rz = xz.y + uRideD, rs = 0.0;
    for (int i = 0; i < 2; i++) { float sc = (i == 0) ? 1.0 : 1.6; vec2 cs = vec2(1.7, 7.0) * sc;
      vec2 q = vec2(xz.x / cs.x + 3.1 * float(i), rz / cs.y), ic = floor(q), f = fract(q);
      if (hash(ic + 11.0 * float(i)) < 0.50) {
        vec2 c = vec2(0.2 + 0.6 * hash(ic + 3.3), 0.30 + 0.40 * hash(ic + 8.8)); vec2 dm = (f - c) * cs;           // metriä
        float hl = cs.y * (0.07 + 0.09 * hash(ic + 1.1)), wd = max(0.035 * sc, 0.8 * fp);                        // puolipituus ja leveys (m)
        rs += exp(-dm.x * dm.x / (2.0 * wd * wd) - dm.y * dm.y / (2.0 * hl * hl)) * (0.035 * sc / wd) * (0.6 + 0.4 * hash(ic + 5.5)); } }
    col += HALLA * 0.13 * uRideK * min(rs, 1.0) * uOpen; }
  return (col * uIceDim + hump) * (1.0 - 0.75 * uGap);
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
  if (d.y < -1e-4 && hit.z < ZS) { col = iceShade(o, d, tIce, hit, fogc); col = mix(col, fogc * 0.75 + col * 0.25, 0.85 * smoothstep(60.0, 8.0, ZS - hit.z)); }
  else col = world(o, d, 0.0, 0.0, fogc) * uOpen * (1.0 - 0.30 * uDuck);
  col = pillars(col, o, d);
  // pilkahdukset (nymfit, väike): pieni kylmä ydin, pehmeä kehä, ristikkäiset hennot säteet ja heijastus mustassa jäässä
  for (int i = 0; i < 40; i++) { if (i >= uNL) break; vec4 L = uL[i], M = uM[i];
    float sg = M.x; vec2 dv = p - L.xy; float far = max(abs(dv.x), abs(dv.y));
    if (far < 0.16) {
      float r2 = dot(dv, dv);
      float st = M.y * (exp(-abs(dv.x) / (5.0 * sg)) * exp(-dv.y * dv.y / (0.5 * sg * sg)) + exp(-abs(dv.y) / (5.0 * sg)) * exp(-dv.x * dv.x / (0.5 * sg * sg)));
      col += SILVER * L.w * 2.4 * (exp(-r2 / (2.0 * sg * sg)) + 0.22 * exp(-r2 / (60.0 * sg * sg)) + 0.6 * st) * uOpen;
    }
    if (M.z > 0.0) { vec2 dr = p - vec2(L.x, L.z);
      if (max(abs(dr.x), abs(dr.y)) < 0.16) col += SILVER * L.w * 2.0 * M.z * (exp(-dr.x * dr.x / (2.0 * sg * sg) - dr.y * dr.y / (12.0 * sg * sg)) + 0.12 * exp(-dot(dr, dr) / (60.0 * sg * sg))) * uOpen; } }
  // englannintorven valojuova kaukana rannan runkojen välissä ja huilun trillien väike
  if (uStripe.w > 0.0) { float dys = abs(p.y - uStripe.y), dxs = abs(p.x - uStripe.x);          // vaakasuora, kapea valojuova rannan runkojen raoissa; rungot katkovat sitä
    float rungot = smoothstep(0.30, 0.62, vnoise(vec2(p.x * 22.0, 4.0)));
    col += HALLA * uStripe.w * exp(-dys * dys / (2.0 * 0.0035 * 0.0035)) * smoothstep(uStripe.z, uStripe.z * 0.3, dxs) * (0.30 + 0.70 * rungot) * uOpen; }
  if (uTrill.x > 0.0) for (int i = 0; i < 3; i++) { float fi = float(i);
    vec2 tp = vec2(uRes.x / uRes.y * (0.34 + 0.20 * fi), 0.80 + 0.045 * sin(fi * 2.6));
    float fl = 0.55 + 0.45 * sin(uTime * (44.0 + 7.0 * fi) + fi * 2.1);
    vec2 dv = p - tp; col += SILVER * uTrill.x * fl * (exp(-dot(dv, dv) / (2.0 * 0.0016 * 0.0016)) + 0.12 * exp(-dot(dv, dv) / (2.0 * 0.011 * 0.011))) * uOpen; }
  // lumi: kolme kerrosta (lähellä suuret ja epätarkat, kaukana pienet), sijainti on tuulen nopeuden kertymä (uSnX, uSnY): lumi liikkuu aina.
  // Tuulen voimistuessa hiutale venyy viiruksi (viirun pituus = matka ruudussa).
  // kierros 3: tavallisesti enintään noin 40 pyöreää pehmeää hiutaletta; puuskassa hiutale on ohut pehmeä viiru liikkeen suuntaan (viirun pituus = matka ruudussa, paksuus ennallaan).
  for (int i = 0; i < 3; i++) { float fi = float(i); float sc = 10.0 + 14.0 * fi, lf = 1.5 - 0.45 * fi, stk = min(uStr, 4.0) * (0.5 - 0.12 * fi), st = 1.0 + 1.5 * stk;
    vec2 q = vec2((p.x * sc - uSnX * lf * sc) / st, p.y * sc + uSnY * lf * sc) + vec2(fi * 13.0, fi * 7.0);
    vec2 ic = floor(q), fr = fract(q); float h = hash(ic);
    float d0 = (i == 0) ? 0.060 : ((i == 1) ? 0.015 : 0.0045), dg = (i == 0) ? 0.22 : ((i == 1) ? 0.10 : 0.03);
    float dens = d0 + dg * (uGustK * exp(-pow((p.x + 0.25 * p.y - uGustF) / 0.25, 2.0)) + uPuffK * exp(-pow((p.y - uTop) / 0.11, 2.0)));
    if (h < dens) { vec2 c = 0.25 + 0.5 * vec2(hash(ic + 1.7), hash(ic + 5.1));
      float hl = (st - 1.0) * 0.20;                                                       // hl: viirun puolipituus (y-yksikköinä)
      float r = (0.21 - 0.05 * fi) * mix(1.0, 0.30, clamp(hl / 0.10, 0.0, 1.0)), soft = 0.85 - 0.30 * fi;   // viiru on ohut: paksuus noin kolmasosa
      vec2 dd = vec2(max(abs(fr.x * st - c.x * st) - hl, 0.0), fr.y - c.y);
      float fl = smoothstep(r, r * (1.0 - soft), length(dd));
      col += vec3(0.60, 0.67, 0.80) * 0.5 * fl * smoothstep(dens, dens * 0.5, h) * (0.24 + 0.55 * uG) * uOpen * (1.0 - uEnd) * (0.65 + 0.35 * fi) * (1.0 - 0.35 * clamp(hl / 0.10, 0.0, 1.0)); } }
  float elg = abs(d.y) / max(length(d.xz), 1e-4);
  col += fogc * 1.2 * uMist * (exp(-elg / 0.012) + 0.5 * exp(-elg / 0.05)) * uOpen;                      // matala usva rannan ja jään rajalla
  col = mix(col, PIMEYS, uEnd);
  return col;
}
` + FS_LOPPU;

// ---------------------------------------------------------------------------------------------------------------------
// Signaalit (puhtaat aikafunktiot). Viedään, jotta samat luvut voi mitata Nodessa ilman selainta.
const ASP = 16 / 9, FOC = 1.07, ICE_K = 3.5;   // ICE_K: jään oma etenemä on 3,5-kertainen rannan lähestymiseen verrattuna (jää virtaa katsojan ali koko ajan)
const hh = (a, b) => { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x); };   // deterministinen "satunnaisuus"
export function signaalit(d) {
  const A = d.aika, FPS = d.FPS;
  d.vaadi('pohja_vaihtuu_D', 'gis_palaa', 'peikot_G_alku', 'peikot_G_loppu', 'H_puhaltimet', 'I_ratsastus', 'h_urkupiste_vyory', 'vaskipulssit', 'hajoaa_hiljaisuuteen', 'J_huilut', 'jousijakso_urkupiste_E_alku');
  const T0 = A.pohja_vaihtuu_D, T1 = A.jousijakso_urkupiste_E_alku;
  const tG0 = A.peikot_G_alku, tG1 = A.peikot_G_loppu, tH = A.H_puhaltimet, tI = A.I_ratsastus, tV = A.h_urkupiste_vyory, tVP = A.vaskipulssit, tHJ = A.hajoaa_hiljaisuuteen, tJ = A.J_huilut;
  const evU = d.tapahtumat.find((e) => e.tyyppi === 'kerros katoaa' && e.alku >= tH && e.alku <= tI);   // ylärekisteri sammuu (H:n purskeen jälkeen)
  const TU = evU ? evU.alku : tH + 7;
  const evK = d.tapahtumat.find((e) => e.tyyppi === 'kerros tulee' && e.alku >= tG0 && e.alku <= tG1);  // 6:22 matalat soittimet palaavat
  const TK = evK ? evK.alku : tG1 - 8;
  const TIN = 12;                                       // alun avautuminen: katse alas -> vaakaan (s)
  const PHI0 = -Math.PI / 2, PHI1 = 0;
  const H_0 = 0.45, H_1 = 1.0, ZEND = 101, DRIFT = 0.10, ZT_ = 104, ZS_ = 110;
  const urku = (t) => d.tapahtuu('urkupiste', t);
  const lev = (t) => d.koko(t, 0.25);
  const Sj = (t) => sstep(0.28, 0.85, d.keski(t, 3.0));                 // jousten voima, tasoitus 6 s: vaikuttaa vain usvaan ja valoon kerrosten välissä
  const tapio = (t) => sstep(tV - 1.5, tV + 3, t) * (1 - sstep(tVP - 1, tVP + 6, t));
  const kat = (t) => 1 - sstep(tG0 - 0.02, tG0 + 0.10, t);                 // fortissimo katkeaa samassa ruudussa kuin ääni
  const paisu = (t) => sstep(T0, tG0 - 0.3, t) * kat(t);
  const mfPorras = (t) => sstep(tG1 - 0.02, tG1 + 0.15, t) * (1 - sstep(tH, tH + 2.5, t));   // 6:30: kuvan kirkkaus nousee portaana ja jää ylös jakson ajan
  const wG = (t) => 0.55 + 0.45 * sstep(A.gis_palaa - 1, A.gis_palaa + 4, t);
  const upDim = (t) => 0.5 * sstep(TU, TU + 2.5, t) * (1 - sstep(tI + 0.5, tI + 3.5, t));       // ylärekisteri pimenee (kuunteluopas 6:45)
  const nousu = (t) => 0.26 * sstep(tG0, A.gis_palaa, t) * (1 - sstep(tG1, tG1 + 4, t));
  const G = (t) => (clamp(0.10 + 0.95 * wG(t) * sstep(0.04, 0.70, d.pitka(t, 1.2)), 0.22 * (1 - sstep(T1 - 12, T1 - 3, t)) + nousu(t), 1.1) + 0.24 * mfPorras(t)) * (1 - upDim(t));

  // ---- koneen kuulemat alut
  const flux = (f, lo, hi) => { let s = 0; for (let m = lo; m <= hi; m++) s += Math.max(0, d.taso(m, f) - Math.min(d.taso(m, f - 1), d.taso(m, f - 2), d.taso(m, f - 3))); return s; };
  const bestBin = (f, lo, hi) => { let bm = 0, bv = 0; for (let m = lo; m <= hi; m++) { const n = d.taso(m, f) - Math.min(d.taso(m, f - 1), d.taso(m, f - 2), d.taso(m, f - 3)); if (n > bv) { bv = n; bm = m; } } return [bm, bv]; };
  const peaks = (lo, hi, thr, gapF, t0, t1) => { const out = []; let last = -99;
    for (let f = Math.round(t0 * FPS); f < Math.round(t1 * FPS); f++) { const v = flux(f, lo, hi);
      if (v > thr && v >= flux(f - 1, lo, hi) && v > flux(f + 1, lo, hi) && f - last >= gapF) { out.push({ t: f / FPS, v, m: bestBin(f, lo, hi)[0] }); last = f; } }
    return out; };
  const HP = peaks(60, 100, 0.55, 5, T0, T1);          // ylä- ja keskirekisterin alut
  const LP = peaks(30, 52, 0.25, 4, T0, T1);           // matalan kaistan alut: bassot, patarummut
  // ---- v6: äänten alut (cues.alut, noin 6 ms tarkkuus). Jokainen rytminen kuvan tapahtuma alkaa alun ruudussa (Math.round(t * FPS)), täydellä voimalla; ei tasoitusta, ei omaa sykettä.
  const FR = (t) => Math.round(t * FPS);
  const onsets = (bands, lo, hi, vmin) => { const raw = [];
    for (const b of bands) for (const [t, v] of d.cues.alut[b]) if (t >= lo && t < hi && v >= vmin) raw.push({ f: FR(t), v });
    raw.sort((a, b) => a.f - b.f || b.v - a.v);
    const out = []; for (const r of raw) { const l = out[out.length - 1]; if (l && r.f - l.f < 2) { l.v = Math.max(l.v, r.v); continue; } out.push({ f: r.f, t: r.f / FPS, v: r.v }); }
    return out; };                                                                    // alut alle kahden ruudun päässä toisistaan ovat yksi alku
  const midiAt = (t, prev) => { let best = null; for (const n of d.nuotit) { if (Math.abs(n[0] - t) <= 0.06) { if (best === null || n[2] > best) best = n[2]; } else if (n[0] > t + 0.07) break; } return best ?? prev; };   // korkein nuotti, jonka alku on +-60 ms:n sisällä; muuten edellinen
  const MF = onsets(['matala', 'keski', 'korkea'], tG1 - 0.05, tH, 0.22);            // 6:30 tutin alut (kaikki kolme kaistaa)
  const tMF = MF.length ? MF[0].t : tG1;
  const PP = onsets(['keski', 'korkea'], tG0, tMF, 0).filter((o) => o.t < tMF - 1e-4);   // pp: kuvion alut (keski ja korkea kaista)
  { let lm = 70; for (const o of PP) { o.m = midiAt(o.t, lm); lm = o.m; } }
  const TOUCH = PP;                                                                    // (viedään mittausta varten)

  // ---- kameran vauhti: tasainen kiihdytys I_ratsastus -> h_urkupiste_vyory + 10 s (kolminkertainen), sitten hidastuminen (vaskipulssit)
  const sLiike = d.sarja((f) => (d.tapahtuu('liike', f / FPS) ? 1 : 0));
  // kierros 3: taite. Nopeus alkaa kasvaa ankkurista I_ratsastus: kaksinkertainen 3 s kuluttua, kolminkertainen kohdassa h_urkupiste_vyory, pysyy suurena fortissimon yli,
  // hidastuu vaskipulsseissa. Jatkuva (nopeus kasvaa ilman hyppyä).
  const tV10 = tV + 10, TAU_I = 5, KN_I = 1 - Math.exp(-(tV - tI) / TAU_I);
  const kiihdy = (t) => t < tI ? 1 : 1 + 2.4 * (1 - Math.exp(-(t - tI) / TAU_I)) / KN_I;
  const profiili = (t) => lerp(kiihdy(t), 0.9, sstep(tVP - 5, tVP + 6, t));
  const vauhti = (t) => sstep(T0 + 2, T0 + TIN + 6, t) * profiili(t) * (0.92 + 0.16 * d.ka(sLiike, t * FPS, 5 * FPS));
  const sV = d.sarja((f) => vauhti(f / FPS) / FPS);
  const sVkoko = d.kohta(sV, T1) - d.kohta(sV, T0);
  const camZ = (t) => ZEND * (d.kohta(sV, clamp(t, T0, T1)) - d.kohta(sV, T0)) / sVkoko;
  const camX = (t) => DRIFT * camZ(t);
  const camV = (t) => ZEND * vauhti(clamp(t, T0, T1)) / sVkoko;          // m/s (ranta)
  const pitch = (t) => lerp(PHI0, PHI1, smooth(clamp((t - T0) / TIN, 0, 1)));
  const camH = (t) => lerp(H_0, H_1, smooth(clamp((t - T0) / TIN, 0, 1)));
  const cam = (t) => ({ x: camX(t), h: camH(t), z: camZ(t), pitch: pitch(t) });
  const ci = (t) => ({ x: camX(t), h: camH(t), z: ICE_K * camZ(t), pitch: pitch(t) });     // jään koordinaatisto
  const proj = (c, X, Y, Z) => { const rx = X - c.x, ry = Y - c.h, rz = Z - c.z, cp = Math.cos(c.pitch), sp = Math.sin(c.pitch);
    const vy = cp * ry - sp * rz, vz = sp * ry + cp * rz; if (vz < 0.4) return null;
    return [ASP / 2 + FOC * rx / vz, 0.5 + FOC * vy / vz, vz]; };

  // ---- tuulen vaihe (vain usvan ja latvojen valon hidas kulku), lumi ja ajolumi: nopeuden kertymät
  const sPh = d.sarja((f) => (0.50 + 0.80 * Sj(f / FPS) + 0.50 * tapio(f / FPS)) / FPS);
  const PUFF = [{ t: tG1, a: 2.6, tau: 1.4 }];                                 // 6:30: lumipuuska pyyhkäisee jään yli, vauhti moninkertaistuu
  for (const p of HP) { if (p.t >= tI && p.t < tVP && p.v > 0.8) PUFF.push({ t: p.t, a: 0.16 + 0.16 * tapio(p.t), tau: 0.30 });
    if (p.t >= tVP && p.t < tHJ && p.v > 0.8) PUFF.push({ t: p.t, a: 0.08, tau: 0.35 }); }
  const puffs = (t) => { let s = 0; for (const q of PUFF) { const a = t - q.t; if (a >= 0 && a < 5 * q.tau) s += q.a * Math.exp(-a / q.tau); } return s; };
  const lumiV = (t) => 0.055 + 0.26 * lev(t) ** 2 + 0.40 * paisu(t) + puffs(t) + 0.14 * sstep(tI, tV10, t) * (1 - sstep(tV10, tV10 + 12, t));
  const sSnX = d.sarja((f) => lumiV(f / FPS) / FPS);
  const sSnY = d.sarja((f) => (0.030 + 0.06 * lev(f / FPS)) / FPS);
  const sIce = d.sarja((f) => 7.0 * lumiV(f / FPS) / FPS);
  const lumiStr = (t) => clamp((lumiV(t) - 0.45) * 3.2, 0, 2.6);
  const rideEnv = (t) => sstep(tI, tI + 0.4, t) * (1 - sstep(tVP, tVP + 8, t));                       // ajolumi: taitteesta vaskipulsseihin
  const rideK = (t) => rideEnv(t) * (0.45 + 0.55 * sstep(0.3, 0.9, d.keski(t, 0.12)));
  const sRide = d.sarja((f) => (3 + 15 * sstep(0.3, 0.9, d.keski(f / FPS, 0.12)) * (0.5 + 0.5 * sstep(tI, tV10, f / FPS))) / FPS);

  // ---- valot
  const LI = [], RG = [], CR = [];
  const pxs = (px) => px / 1080;
  const ahead = (c, ys) => FOC * c.h / Math.max(0.5 - ys, 0.02);
  const halfW = (c, Z) => ASP * 0.5 * (Z - c.z) / FOC;
  const grp = (m) => m >= 74 ? 0 : m >= 62 ? 1 : 2;                                                    // viulut (kaukana) / alttoviulut (keskellä) / sellot (lähellä), sävelkorkeus lähimmästä nuotista
  // hyppijän sijainti on kameran suhteen (x sivulle, z eteen, m). Hyppy kosketuksesta toiseen: pituus 0,35-2 m, suunta vaeltaa, kaaren korkeus h = 0,3-0,8 m.
  // v6: kosketus = yksi mitattu alku; hyppy kulkee vain, jos seuraava alku on enintään 0,5 s päässä; muuten hyppijä jää paikalleen ja himmenee.
  const BAND = [[18, 28], [10, 15], [5.5, 8.5]];                                // syvyyskaistat (m)
  const hw = (z) => 0.83 * z * 0.85;
  const hopSig = (z) => 1.6 + 3.2 * clamp(1 - (z - 4) / 36, 0, 1);               // ytimen sigma (px): lähin on suurin
  const stepH = (s, L, g, n, wob) => { s.th += (hh(n, 2) - 0.5) * wob; s.x += L * Math.sin(s.th); s.z += L * Math.cos(s.th);
    if (g >= 0) { const [z0, z1] = BAND[g]; if (s.z < z0) { s.z = z0 + (z0 - s.z); s.th = Math.PI - s.th; } else if (s.z > z1) { s.z = z1 - (s.z - z1); s.th = Math.PI - s.th; } s.z = clamp(s.z, z0, z1); }
    else if (g === -2) { if (s.z < 2.5) { s.z = 2.5 + (2.5 - s.z); s.th = Math.PI - s.th; } else if (s.z > 30) { s.z = 30 - (s.z - 30); s.th = Math.PI - s.th; } s.z = clamp(s.z, 2.5, 30); }
    else s.z = Math.max(s.z, 0.8);
    const w = hw(s.z); if (s.x > w) { s.x = w - (s.x - w); s.th = -s.th; } else if (s.x < -w) { s.x = -w + (-w - s.x); s.th = -s.th; } s.x = clamp(s.x, -w, w); };
  const arcH = (L) => 0.3 + 0.5 * clamp((L - 0.35) / 1.65, 0, 1);
  // halkeama (jään koordinaatisto): jokainen kosketus jatkaa ryhmän halkeamaa yhden askeleen hyppijän reittiä, välillä haarautuu; kosketuskohdassa pieni huurteen kukka.
  const addSeg = (t, ax, az, bx, bz, w, s, T, fl, seed) => CR.push({ t0: t, ax, az, bx, bz, w, s, T, fl, seed });
  const chain = [null, null, null];
  const addCrack = (g, t, X, Z, v, n, T) => {
    const prev = chain[g]; chain[g] = { t, X, Z }; const w = 0.013 + 0.012 * v, fl = 0.18 + 0.16 * v, sd = hh(n, 41) * 40, st = 0.65 + 0.35 * v;
    const dx = prev ? X - prev.X : 0, dz = prev ? Z - prev.Z : 0, len = Math.hypot(dx, dz);
    if (!prev || t - prev.t > 1.6 || len < 0.05) { const a = hh(n, 42) * 6.28; addSeg(t, X - 0.28 * Math.sin(a), Z - 0.28 * Math.cos(a), X, Z, w, st, T, fl, sd); return; }
    if (len > 0.8) { const off = (hh(n, 43) - 0.5) * 0.36 * len, mx = prev.X + 0.5 * dx - dz / len * off, mz = prev.Z + 0.5 * dz + dx / len * off;
      addSeg(t, prev.X, prev.Z, mx, mz, w, st, T, 0, sd); addSeg(t, mx, mz, X, Z, w, st, T, fl, sd + 3); }
    else addSeg(t, prev.X, prev.Z, X, Z, w, st, T, fl, sd);
    if (hh(n, 44) < 0.25) { const th = Math.atan2(dx, dz) + (hh(n, 45) > 0.5 ? 1 : -1) * (0.6 + 0.5 * hh(n, 46)), bl = Math.max(0.3, (0.35 + 0.5 * hh(n, 47)) * len), mx = prev.X + 0.5 * dx, mz = prev.Z + 0.5 * dz;
      addSeg(t, mx, mz, mx + bl * Math.sin(th), mz + bl * Math.cos(th), w * 0.7, st * 0.85, T, 0, sd + 7); } };
  const HOP = [[], [], []], hsEnd = [];   // pp: hyppijät ryhmittäin
  { const hs = [{ x: 3, z: 22, th: 0.4 }, { x: -3, z: 12, th: -0.5 }, { x: 1, z: 7, th: 1.0 }];
    for (const p of PP) { const t = p.t, c = ci(t), g = grp(p.m), s = hs[g], arr = HOP[g], prev = arr[arr.length - 1], n = arr.length + 100 * g; let L = 0;
      if (prev && t - prev.t <= 0.5) { const dt = t - prev.t; L = clamp(0.26 * s.z * dt * (0.6 + 0.4 * hh(n, 1)), 0.35, 2.0); stepH(s, L, g, n, 1.5); }
      else if (prev) stepH(s, 0.45, g, n, 1.5);                                       // yli 0,5 s: ei hypätä tyhjää, vain pieni laskeutuminen uuteen kosketuskohtaan
      arr.push({ t, x: s.x, z: s.z, I: 0.80 * clamp(0.5 + 0.8 * p.v, 0.6, 1), L, h: arcH(L) });
      addCrack(g, t, c.x + s.x, c.z + s.z, p.v, n, 6.0); }
    for (let g = 0; g < 3; g++) hsEnd.push({ ...hs[g] }); }
  // 6:30 tutti: enintään kahdeksan hyppijää (kolme pp-hyppijää jatkaa, viisi muuta samasta joukosta), jotka koskettavat jäätä yhtä aikaa JOKAISELLA tutin alulla (kaikki samassa ruudussa)
  const NC = 8, ROWP = [], ROW = MF;
  { const cs = []; for (let j = 0; j < NC; j++) { if (j < 3) cs.push({ ...hsEnd[j] }); else { const z = 6 + 10 * hh(j, 5); cs.push({ x: (hh(j, 6) * 2 - 1) * hw(z) * 0.8, z, th: (hh(j, 7) > 0.5 ? 1 : -1) * (1.9 + 0.5 * hh(j, 8)) }); } }
    for (let n = 0; n < MF.length; n++) { const row = [], dt = n ? MF[n].t - MF[n - 1].t : 0, c = ci(MF[n].t);
      for (let j = 0; j < NC; j++) { const s = cs[j]; let L = 0;
        if (n) { L = Math.min(0.30 + 0.45 * hh(j * 13 + n, 1), 0.7 * s.z * dt); if (L > 0.01) stepH(s, L, -2, j * 31 + n, 1.0); }
        row.push({ x: s.x, z: s.z, h: arcH(L * 1.5) }); }
      ROWP.push(row);
      const j = n % 3, a = row[j]; addCrack(j, MF[n].t, c.x + a.x, c.z + a.z, MF[n].v, 500 + n, 4.5); } }
  // puhaltimien parvi (H) ja valuminen (purskeen loppu), kiitävät valot (I, Tapio)
  { const cr = (t) => cam(t);
    let n = 0;
    { let lm = 70; for (const p of onsets(['keski', 'korkea'], tH, TU - 0.4, 0)) { const t = p.t, c = cr(t), gr = sstep(tH, TU - 1, t), m = midiAt(t, lm), k = clamp((m - 60) / 34, 0, 1); lm = m;
        for (let j = 0; j < 3; j++) { n++; const Z = 100; LI.push({ t0: t, life: 0.18, fade: 0.32, hard: true, kind: 'parvi', fr: 'r', X: c.x + (0.4 * Math.sin(0.55 * (t - tH)) + 0.55 * (hh(n, 3) * 2 - 1)) * halfW(c, Z) * 0.95, Y: 1.5 + 20 * k + 2.0 * (hh(n, 8) - 0.5), Z,
          I: (0.28 + 0.72 * gr) * clamp(0.35 + 1.0 * p.v, 0.5, 1), sig: 1.5, star: 0.35 + 0.3 * gr, refl: 0.40 }); } } }
    for (let j = 0; j < 34; j++) { const t = TU - 1.7 + 1.5 * hh(j, 11), c = cr(t); LI.push({ t0: t, life: 1.2, fade: 0.1, kind: 'putoaja', fr: 'r', X: c.x + (hh(j, 12) * 2 - 1) * halfW(c, 98) * 0.95, Y: 3 + 17 * hh(j, 13), Z: 98, I: 0.75, sig: 1.5, star: 0.35, refl: 0.4 }); }
    let last = -9, nr = 0;
    for (const p of [{ t: tI, v: 1 }, ...HP.filter((q) => q.t > tI + 0.2)]) { const t = p.t; if (t < tI || t >= tVP || p.v < 0.45 || t - last < 0.18) continue; last = t; nr++; const c = ci(t), Z0 = c.z + 3 + 9 * hh(nr, 4);
      LI.push({ t0: t, life: 1.3, fade: 0.4, kind: 'kiita', fr: 'i', X: c.x + (hh(nr, 6) * 2 - 1) * 0.95 * halfW(c, Z0), Y: 0.35, Z: Z0, I: (0.40 + 0.60 * lev(t)) * (t < tV ? 0.85 : 1.1), sig: 2.2, star: 0, refl: 0.5, vz: ICE_K * camV(t) + 10 }); } }
  // matalan kaistan alut: pehmeät sykäykset ja kummut jään alla (v6: ei renkaita). Patarummun isku = pitkä halkeama (DRUM, alla).
  const TAPIO_A = 0.3;
  const pulse = (t, X, Z, amp, R0, R1, T) => RG.push({ t0: t, T, X, Z, amp, R: R0, w: R1, dome: 1 });
  { let lastR = -9, lastH = -9, sg = 0;
    for (const p of LP) { const t = p.t, c = ci(t);
      if (t < tG0) {                                                         // paisutus: himmeä sykäys jään alla jokaisesta basson alusta; koko ja voima kasvavat, kuva ei vilku
        if (t - lastR < 0.40) continue; lastR = t; const ps = sstep(T0, tG0, t), Zz = c.pitch < -0.12 ? c.z + Math.min(c.h / Math.tan(-c.pitch), 16) : c.z + 16, pk = clamp(p.v / 0.8, 0.6, 1);
        const R0 = 2.5 + 4.5 * ps; pulse(t, c.x, Zz, 0.35 * (0.012 + 0.095 * sstep(T0 + 3, T0 + TIN + 4, t)) * (0.6 + 0.5 * ps) * pk, R0, R0 * 1.9, 2.0);
      } else if (t < tI) {                                                   // pp, tutti, H -> taite: patarummut ovat halkeamia (DRUM), ei renkaita
        continue;
      } else if (t < tV - 0.1) {                                            // taite: patarumpujen syke on pehmeä hehku (ei rengasta)
        if (p.v < 0.3 || t - lastR < 0.40) continue; lastR = t; RG.push({ t0: t, T: 0.9, X: c.x, Z: c.z + 9, amp: 0.012 * clamp(p.v / 0.8, 0.6, 1.3), R: 4, w: 10, dome: 1 });
      } else if (t < tVP) {                                                  // Tapio: bassojen raskas ääni = yksi pehmeä hehku jään alla: A * exp(-r^2 / R^2), R 15 -> 60 m 2,5 s
        if (p.v < 0.45 || t - lastH < 0.9) continue; lastH = t; sg++;
        RG.push({ t0: t, T: 2.5, X: c.x + (sg % 2 ? 4 : -4), Z: c.z + 26, amp: TAPIO_A * (0.7 + 0.5 * lev(t)) * clamp(p.v / 1.0, 0.8, 1.3), R: 5, w: 9, dome: 1, vx: 21 });
      } else if (t < tHJ) {                                                  // bassojen näppäilyt: pieniä himmeitä sykäyksiä (ei renkaita)
        if (p.v < 0.3 || t - lastR < 0.4) continue; lastR = t; pulse(t, c.x - 0.5, c.z + 6, 0.014, 1.6, 4, 1.0); } } }
  // patarummun isku: pitkä halkeama, joka juoksee jään poikki iskun ruudussa (kaikki janat syntyvät samassa ruudussa), ja himmeä valon sykäys jään alla
  { const DRUM = onsets(['matala'], tG0, tI, 0.4).filter((o) => o.t < tH || o.t >= TU); let last = -9, nd = 0;
    for (const q of DRUM) { if (q.t - last < 0.8) continue; last = q.t; nd++; const t = q.t, c = ci(t), n = 900 + nd;
      const z0 = 9 + 22 * hh(n, 21), W = hw(z0) * 0.95, dir = nd % 2 ? 1 : -1, xs = c.x - dir * W * (0.8 + 0.2 * hh(n, 22)), xe = c.x + dir * W * (0.8 + 0.2 * hh(n, 23)), ze = z0 + (hh(n, 24) - 0.5) * 9;
      const sA = 0.75 + 0.25 * clamp((q.v - 0.4) / 0.4, 0, 1), pts = [];
      for (let i = 0; i <= 7; i++) { const u = i / 7; pts.push([lerp(xs, xe, u) + (hh(n, 30 + i) - 0.5) * 1.0, c.z + lerp(z0, ze, u) + (hh(n, 40 + i) - 0.5) * 1.8]); }
      for (let i = 0; i < 7; i++) { addSeg(t, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], 0.034 * (0.7 + 0.6 * hh(n, 50 + i)), sA, 7.0, 0, hh(n, 60 + i) * 40);
        if (hh(n, 70 + i) < 0.30) { const th = Math.atan2(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]) + (hh(n, 80 + i) > 0.5 ? 1 : -1) * (0.55 + 0.5 * hh(n, 90 + i)), bl = 1.2 + 2.2 * hh(n, 100 + i);
          addSeg(t, pts[i][0], pts[i][1], pts[i][0] + bl * Math.sin(th), pts[i][1] + bl * Math.cos(th), 0.020, sA * 0.8, 7.0, 0, hh(n, 110 + i) * 40); } }
      pulse(t, c.x, c.z + z0, 0.05 * sA, 5, 14, 0.9); } }
  const HUMPS = RG.filter((r) => r.vx);
  const duck = (t) => { let m = 0; for (const h of HUMPS) { const a = (t - h.t0) / h.T; if (a > 0 && a < 1) m = Math.max(m, Math.sin(Math.PI * a)); } return m; };
  const iceDim = (t) => 1 - 0.6 * sstep(tV - 0.3, tV + 0.3, t) * (1 - sstep(tVP - 1, tVP + 4, t));
  const envF = (e, a) => (e.hard ? (a >= -1e-4 ? 1 : 0) : smooth(clamp(a / 0.04, 0, 1))) * (1 - smooth(clamp((a - e.life) / e.fade, 0, 1)));
  const lastIdx = (arr, t) => { let lo = 0, hi = arr.length - 1, r = -1; while (lo <= hi) { const mid = (lo + hi) >> 1; if (arr[mid].t <= t + 1e-4) { r = mid; lo = mid + 1; } else hi = mid - 1; } return r; };
  const lightsAt = (t, cI, cR) => {
    const out = [];
    const dk = 1 - 0.5 * duck(t);
    const add = (c, X, Y, Z, I0, sig, star, refl) => { const I = I0 * dk; const a = proj(c, X, Y, Z); if (!a || I < 0.004) return; const b = refl > 0 ? proj(c, X, -Y, Z) : null;
      out.push([a[0], a[1], b ? b[1] : 0, I, pxs(sig), star, refl > 0 ? refl : 0]); };
    // pp (v6): 2-3 hyppijää eri syvyyksillä. Kosketus on mitattu alku: hyppijä on kaarensa alimmassa kohdassa alun ruudussa täydellä kirkkaudella (nousu enintään yhden ruudun).
    // Hyppy kulkee vain, jos seuraava alku on enintään 0,5 s päässä; muuten hyppijä jää paikalleen ja himmenee (ei hypi tyhjää). Heijastus jäässä kulkee kaaren mukana.
    if (t >= tG0 && t < tMF - 1e-4) for (let g = 0; g < 3; g++) { const arr = HOP[g], i = lastIdx(arr, t); if (i < 0) continue; const a = arr[i], b = arr[i + 1];
      if (b && b.t - a.t <= 0.5 + 1e-6 && b.t < tMF - 1e-4) { const s = (t - a.t) / (b.t - a.t), e = Math.max(Math.exp(-(t - a.t) / 0.05), Math.exp(-(b.t - t) / 0.04)), hy = 0.06 + b.h * 4 * s * (1 - s), z = lerp(a.z, b.z, s);
        add(cI, cI.x + lerp(a.x, b.x, s), hy, cI.z + z, lerp(a.I, b.I, s) * (0.40 + 0.60 * e), hopSig(z), 0, 0.55); }
      else { const age = t - a.t; if (age < 2.4) add(cI, cI.x + a.x, 0.06, cI.z + a.z, a.I * (0.45 * Math.exp(-age / 0.45) + 0.55 * Math.exp(-age / 0.05)), hopSig(a.z), 0, 0.5); } }
    // mf (v6): sama joukko (enintään kahdeksan hyppijää) on ankkurin ruudusta alkaen kirkkaampi, suurempi ja lähempänä; kaikki koskettavat jäätä yhtä aikaa jokaisella tutin alulla.
    // H_puhaltimissa hyppiminen loppuu: alkuja ei enää ole, valot jäävät paikalleen ja himmenevät.
    if (MF.length && t >= tMF - 1e-4 && t < tH + 2.5) { const i = lastIdx(MF, t); if (i >= 0) { const stl = t >= tH ? 1 - sstep(tH, tH + 2.3, t) : 1, age = t - MF[i].t, nx = MF[i + 1];
      for (let j = 0; j < NC; j++) { const a = ROWP[i][j]; let x = a.x, z = a.z, hy = 0.06, I;
        if (nx && nx.t - MF[i].t <= 0.5 + 1e-6) { const b = ROWP[i + 1][j], s = age / (nx.t - MF[i].t), e = Math.max(Math.exp(-age / 0.05), Math.exp(-(nx.t - t) / 0.04));
          x = lerp(a.x, b.x, s); z = lerp(a.z, b.z, s); hy = 0.06 + b.h * 4 * s * (1 - s); I = 0.40 + 0.60 * e; }
        else I = 0.45 * Math.exp(-age / 0.9) + 0.55 * Math.exp(-age / 0.05);
        if (z < 1.6) continue;
        add(cI, cI.x + x, hy, cI.z + z, (0.80 + 0.20 * clamp(1 - (z - 5) / 40, 0, 1)) * I * stl, hopSig(z) * 1.5, 0, 0.55); } } }
    for (const e of LI) { const age = t - e.t0; if (age < (e.hard ? -1e-4 : -0.03) || age > e.life + e.fade + 0.05) continue; const c = e.fr === 'i' ? cI : cR; let I = e.I * envF(e, age);
      if (e.kind === 'kiita') add(c, e.X, e.Y, e.Z + e.vz * Math.max(age, 0), I, e.sig, e.star, e.refl);
      else if (e.kind === 'putoaja') { const s = clamp(age / e.life, 0, 1); add(c, e.X, 0.1 + (e.Y - 0.1) * Math.pow(1 - s, 1.7), e.Z, e.I * Math.pow(Math.sin(Math.PI * s), 0.6), e.sig, e.star, e.refl); }
      else add(c, e.X, e.Y, e.Z, I, e.sig, e.star, e.refl); }
    out.sort((p, q) => q[3] - p[3]);
    return out.slice(0, 40); };
  const crackAt = (t, cI) => { const out = [];
    for (const q of CR) { const age = t - q.t0; if (age < -1e-4 || age > q.T) continue;
      const z0 = Math.min(q.az, q.bz) - cI.z, z1 = Math.max(q.az, q.bz) - cI.z; if (z1 < -2 || z0 > 140) continue; out.push({ q, age }); }
    out.sort((a, b) => b.q.t0 - a.q.t0);
    return out.slice(0, 80).map(({ q, age }) => [[q.ax, q.az, q.bx, q.bz], [q.s * (0.28 + 0.72 * Math.exp(-Math.max(age, 0) / 0.25)) * (1 - sstep(0.3 * q.T, q.T, age)), q.w, q.fl, q.seed]]); };
  const ringsAt = (t) => { const out = [];
    for (const r of RG) { const a = (t - r.t0) / r.T; if (a < 0 || a >= 1) continue; out.push({ r, a }); }
    out.sort((p, q) => q.r.t0 - p.r.t0);
    return out.slice(0, 8).map(({ r, a }) => [[r.X, r.Z, a, r.amp], [r.R, r.w, 0, r.vx || 0]]); };
  // ---- melodia: kumpujen muoto
  const kaari = (t) => clamp((d.melodia(t, 2.6) - 68) * 0.0050, -0.05, 0.075);
  const sNl = d.sarja((f) => (d.tapahtuu('nousu', f / FPS) ? 1 : 0) - (d.tapahtuu('lasku', f / FPS) ? 1 : 0));
  // ---- pakkanen: pitkän äänen alut vaskipulssien jaksolla (huurre)
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
  const trunkVis = (t) => sstep(tHJ - 4, tHJ + 18, t);
  const gap = (t) => sstep(tHJ + 2, T1 - 5, t);
  const stripeOn = (t) => sstep(tVP, tVP + 3, t) * (1 - sstep(tHJ - 2, tHJ + 5, t));
  const trillOn = (t) => sstep(tVP + 1, tVP + 4, t) * (1 - sstep(tHJ - 2, tHJ + 3, t));
  const pairOn = (t) => sstep(tJ, tJ + 3, t) * (1 - sstep(T1 - 12, T1 - 6, t));
  function tila(t) {
    const f = t * FPS, c = cam(t), cI = ci(t), L = d.koko(t, 1.5), Gt = G(t);
    const live = []; for (let k = 0; k < 6; k++) live.push(Sj(t - 1.6 * (k / 5)));
    const hills = []; for (let i = 0; i < 32; i++) { const ti = T0 + (i / 31) * (T1 - T0); hills.push(ti > t ? 0 : kaari(ti) * sstep(0, 3.0, t - ti)); }
    const nl = d.ka(sNl, f, 2.0 * FPS);
    const lights = lightsAt(t, cI, c);
    const po = pairOn(t);
    if (po > 0) { const g = proj(c, camX(T1), 0, ZT_), gx = g ? g[0] : ASP / 2, mel = clamp((d.melodia(t, 1.2) - 64) / 20, 0, 1);
      const sp = 1 - 0.55 * smooth(clamp((t - tJ) / 14, 0, 1)), ys = 0.60 + 0.12 * mel, I = 0.50 * po * (0.5 + 0.7 * d.keski(t, 0.6));
      for (const sgn of [-1, 1]) lights.push([gx + sgn * (0.035 + 0.16 * sp) + 0.02 * Math.sin(0.4 * (t - tJ)), ys + 0.015 * sgn, 0, I, pxs(2.2), 0.4, 0]); }
    const top = proj(c, c.x, 15, ZS_), topY = top ? clamp(top[1], 0.2, 0.95) : 0.7;
    const sh = proj(c, c.x, 0, ZS_), shY = sh ? sh[1] : 0.45;
    const mel = clamp((d.melodia(t, 1.0) - 62) / 20, 0, 1);
    return { t, c, G: Gt, L, live, hills, nl, lights: lights.slice(0, 40), rings: ringsAt(t), cracks: crackAt(t, cI), frost: frost(t), ph: d.kohta(sPh, t),
      trunk: trunkVis(t), gap: gap(t), xt: camX(T1), open: sstep(T0, T0 + 1.5, t), end: sstep(T1 - 6, T1, t), zi: cI.z - c.z, bright: 1 + 0.30 * mfPorras(t),
      low: (0.040 * (0.25 + 0.75 * d.matala(t, 0.8)) * (1 - 0.6 * tapio(t)) + 0.050 * sstep(TU - 0.5, TU + 1.5, t) * (1 - sstep(tI - 0.5, tI + 1.0, t)) + 0.030 * sstep(TK, TK + 2.5, t) * (1 - sstep(tG1, tG1 + 0.4, t))) * (1 - sstep(tJ, tJ + 8, t)),
      snX: d.kohta(sSnX, t), snY: d.kohta(sSnY, t), iceD: d.kohta(sIce, t), str: lumiStr(t), rideK: rideK(t), rideD: d.kohta(sRide, t),
      gustF: -0.4 + (t - tG1) * 0.62, gustK: sstep(tG1 - 0.03, tG1 + 0.03, t) * (1 - sstep(tG1 + 2.0, tG1 + 2.6, t)),
      top: topY, puffK: 0.9 * tapio(t) * (1 - sstep(tV10, tV10 + 12, t) * 0.8),
      stripe: [ASP * 0.58, shY + 0.035 + 0.05 * mel, 0.30, 0.30 * stripeOn(t) * (0.55 + 0.9 * d.keski(t, 0.4))],
      trill: clamp(d.korkea(t, 0.2) * 1.8 - 0.1, 0, 0.9) * trillOn(t), vauhti: camV(t),
      vyor: tapio(t), sj: Sj(t), iceDim: iceDim(t), duck: duck(t) };
  }
  return { T0, T1, tila, PUL, urku, Sj, G, trunkVis, gap, frost, camZ, camX, camV, pitch, camH, ZEND, tapio, lumiV, HP, LP, LI, RG, CR, MF, PP, ROWP, TOUCH, HOP, ROW, TU, lightsAt, ringsAt, cam, ci, proj, puffs, kat, paisu, upDim, mfPorras, ICE_K };
}

async function alusta() {
  const d = await lataa();
  const S = signaalit(d);
  const { T0, T1 } = S;
  const { gl, U, piirra } = luoGL(FS);
  julkaise({
    gl, aika: d.aika,
    kamera: (t) => { const s = S.tila(t); return { p: [s.c.x, s.c.h, s.c.z], q: [Math.sin(s.c.pitch / 2), 0, 0, Math.cos(s.c.pitch / 2)], shot: 'jaa', cut: 0, trans: t - T0 < 12 || T1 - t < 6 }; },
    kuvaus: (t) => { const s = S.tila(t); return { t: +(t - T0).toFixed(1), pitchDeg: +(s.c.pitch * 180 / Math.PI).toFixed(1), kork: +s.c.h.toFixed(2), z: +s.c.z.toFixed(1), vauhti: +s.vauhti.toFixed(2), valo: +s.G.toFixed(2),
      jouset: +s.sj.toFixed(2), tapio: +s.vyor.toFixed(2), huurre: +s.frost.toFixed(2), vaihe: +s.ph.toFixed(1), valoja: s.lights.length, renkaita: s.rings.length, halkeamia: s.cracks.length, lumi: +s.str.toFixed(1), ajolumi: +s.rideK.toFixed(2), runko: +s.trunk.toFixed(2), pimea: +s.gap.toFixed(2), urkupiste: S.urku(t) }; },
    seek: (t) => {
      const s = S.tila(t);
      gl.uniform1f(U('uTime'), t); gl.uniform1f(U('uT0'), T0); gl.uniform1f(U('uOpen'), s.open);
      gl.uniform1f(U('uCP'), Math.cos(s.c.pitch)); gl.uniform1f(U('uSP'), Math.sin(s.c.pitch));
      gl.uniform1f(U('uG'), s.G); gl.uniform1f(U('uLevel'), (0.80 + 0.35 * s.L) * s.bright); gl.uniform1f(U('uNl'), s.nl);
      gl.uniform1f(U('uFrost'), s.frost); gl.uniform1f(U('uPh'), s.ph); gl.uniform1f(U('uZI'), s.zi);
      gl.uniform1f(U('uEnd'), s.end); gl.uniform1f(U('uTrunk'), s.trunk); gl.uniform1f(U('uGap'), s.gap); gl.uniform1f(U('uXT'), s.xt);
      gl.uniform1f(U('uLow'), s.low); gl.uniform1f(U('uMist'), 0.30); gl.uniform1f(U('uFogL'), 520);
      gl.uniform1f(U('uSnX'), s.snX); gl.uniform1f(U('uSnY'), s.snY); gl.uniform1f(U('uStr'), s.str); gl.uniform1f(U('uIceD'), s.iceD);
      gl.uniform1f(U('uIceDim'), s.iceDim); gl.uniform1f(U('uDuck'), s.duck); gl.uniform1f(U('uRideK'), s.rideK); gl.uniform1f(U('uRideD'), s.rideD);
      gl.uniform1f(U('uGustF'), s.gustF); gl.uniform1f(U('uGustK'), s.gustK); gl.uniform1f(U('uTop'), s.top); gl.uniform1f(U('uPuffK'), s.puffK);
      gl.uniform3f(U('uCam'), s.c.x, s.c.h, s.c.z);
      gl.uniform1fv(U('uProf'), new Float32Array(s.hills)); gl.uniform1fv(U('uLive'), new Float32Array(s.live));
      const rg = new Float32Array(32), rh = new Float32Array(32); s.rings.forEach((x, i) => { rg.set(x[0], i * 4); rh.set(x[1], i * 4); });
      gl.uniform4fv(U('uRg'), rg); gl.uniform4fv(U('uRh'), rh); gl.uniform1i(U('uNRg'), s.rings.length);
      const ca = new Float32Array(320), cb = new Float32Array(320); s.cracks.forEach((x, i) => { ca.set(x[0], i * 4); cb.set(x[1], i * 4); });
      gl.uniform4fv(U('uCrA'), ca); gl.uniform4fv(U('uCrB'), cb); gl.uniform1i(U('uNCr'), s.cracks.length);
      const L = new Float32Array(160), M = new Float32Array(160);
      s.lights.forEach((x, i) => { L.set([x[0], x[1], x[2], x[3]], i * 4); M.set([x[4], x[5], x[6], 0], i * 4); });
      gl.uniform4fv(U('uL'), L); gl.uniform4fv(U('uM'), M); gl.uniform1i(U('uNL'), s.lights.length);
      gl.uniform4fv(U('uStripe'), new Float32Array(s.stripe)); gl.uniform4fv(U('uTrill'), new Float32Array([s.trill, 0, 0, 0]));
      piirra();
    },
  });
}
if (typeof document !== 'undefined') alusta().catch((e) => { console.error(e); window.sceneError = String(e.message || e); });
