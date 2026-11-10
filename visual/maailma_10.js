// Tapiola: maailma 10 "Se näkyy ja tulee": ankkurista hiljaisuus_2_alku ankkuriin huuto.
// Alku RAJA.PIMEA_MASSA, loppu RAJA.LUMI (visual/yhteinen.js). Suunnitelma: runs/maailma_10/tarkistus.md ja
// docs/kuvakasikirjoitus.md "Kaksitoista maailmaa", maailma 10; säännöt: docs/visuaalinen_tyyli.md luvut 1, 2, 4d, 5, 7b ja 12.
//
// - Metsä loppuu: alku on viimeinen tumma kerros (lehvästö ja rungot, viisi kerrosta), jonka läpi kamera ajaa avoimelle jäälle.
//   Kerrosten aukot kasvavat maailmassa; mikä täytti kuvan, osoittautuu metsän reunaksi, joka valuu kuvan reunoille.
// - Avoin tila: raskas pilvitaivas, tasainen lumen peittämä jää, tummat paljaan jään laikut (peilikuva), horisontissa matala
//   musta metsän reuna sileiden kumpujen päällä. Siemenen kuva palaa ilman valoa. Lumi on lähes paikallaan.
// - Myrsky = lunta ja jäätä, joka tulee kaukaa (tulkinta, ei esipuheen asia): kuusi lumiseinän kerrosta; lähestyminen on
//   jousten voiman kertymää, joka päättyy täsmälleen ankkuriin myrsky_iskee. Sisällä kerrokset menettävät eronsa (sama valo,
//   väri ja suunta), lumi on viiruja joka syvyydessä (3D-lumi kuten maailmassa 1), massa virtaa pimeän pyörteen ympäri.
// - Nimetyt iskut Q, huippu, R: pystysuora valo kerrosten läpi (Ukon tuli), joka näyttää hetkeksi metsän reunan.
// - toinen_paisunta: nousu pyörteen läpi (ensimmäinen ja ainoa nousu), pimeä keskus sulkeutuu lumeen, lumi tihenee
//   vaaleaksi seinäksi ja kuva päättyy täsmälleen rajakuvaan LUMI.
// Kohtaus on puhdas aikafunktio seek(t): kaikki kertymät lasketaan alussa ruuduittain, ei ajastimia, ei satunnaisuutta.
import { lataa, luoGL, julkaise, FS_ALKU, GLSL_YHTEINEN, FS_LOPPU, clamp, smooth, sstep, lerp } from './yhteinen.js';

const FS = FS_ALKU + `
uniform float uTime, uTL, uHor, uCamH, uCamZ, uCamX, uLight, uVis, uU, uWi, uDens, uWindX, uFall, uStreak, uMass, uSwirl, uFin, uHush, uSway, uGl, uWAng;
uniform vec4 uVor;     // pyörre: x (dx), y (dy), säde, tummuus
uniform vec4 uCut;     // pystyvalo: x (dx), voima, metsän reunan paljastus, -
const float F = 1.07;
const vec3 SKY_TOP = vec3(0.0035, 0.0062, 0.0120), SKY_LOW = vec3(0.019, 0.032, 0.056);
const vec3 FLAKE = vec3(0.60, 0.69, 0.84);
const vec3 HZC = vec3(0.040, 0.058, 0.092);            // horisontin kalpea pilvikerroksen valo (ei lähdettä: hajavalo)
const vec3 STORM = vec3(0.105, 0.130, 0.180);          // myrskyn yhteinen valo ja väri (kerrokset menettävät eronsa)
` + GLSL_YHTEINEN + `
float asp() { return uRes.x / uRes.y; }
vec3 stormBase(float dens) { return STORM * (0.14 + 0.45 * dens * dens); }   // myrskyn yhteinen valo: nousee lumen tiheyden mukana
float sstep(float a, float b, float x) { return smoothstep(a, b, x); }

// metsän reunan ääriviiva: sileät loivat kummut, päällä hento latvusten tekstuuri; korkeus horisontin yläpuolella (kuvan yksikköä)
float ridgeFar(float px0) {
  float xs = px0 / asp();
  float px = px0 + uSway * 0.007 * sin(px0 * 11.0 + uTime * 0.7) + uSway * 0.004 * sin(px0 * 29.0 - uTime * 1.3);   // latvat huojuvat tuulessa; kummut ja maa pysyvät
  float m = 0.042 * exp(-pow((xs - 0.17) / 0.16, 2.0)) + 0.070 * exp(-pow((xs - 0.60) / 0.20, 2.0))
          + 0.034 * exp(-pow((xs - 0.93) / 0.12, 2.0)) + 0.018 * exp(-pow((xs - 0.38) / 0.10, 2.0));
  // latvusto: suuret ryhmät, latvat ja hienojako (kuten maailman 1 canopy)
  float cr = 0.016 * vnoise(vec2(px * 14.0, 2.0)) + 0.010 * vnoise(vec2(px * 46.0, 7.0)) + 0.008 * pow(vnoise(vec2(px * 120.0, 1.0)), 1.5) + 0.005 * pow(vnoise(vec2(px * 300.0, 4.0)), 2.0);
  return 0.012 + m + cr;
}
float ridgeNear(float px0) {
  float xs = px0 / asp();
  float px = px0 + uSway * 0.008 * sin(px0 * 13.0 + uTime * 0.9 + 1.0) + uSway * 0.004 * sin(px0 * 37.0 - uTime * 1.6);
  float m = 0.016 * exp(-pow((xs - 0.30) / 0.22, 2.0)) + 0.022 * exp(-pow((xs - 0.80) / 0.18, 2.0)) + 0.006 * exp(-pow((xs - 0.55) / 0.30, 2.0));
  float tex = 0.0028 * vnoise(vec2(px * 55.0, 11.0)) + 0.0020 * vnoise(vec2(px * 170.0, 5.0)) + 0.0020 * pow(vnoise(vec2(px * 420.0, 2.0)), 2.0);
  return 0.0035 + m + tex;
}

// taivas: raskas pilvikansi, perspektiivi puristaa pilvet horisonttiin; horisontin kalpea valo vain jousten soidessa
vec3 skyAt(float dx, float dy) {
  float h = max(dy, 0.0);
  vec3 hzc = HZC;
  vec3 col = mix(hzc, SKY_TOP, pow(smoothstep(0.0, 0.80, h), 0.60));
  float s = 1.0 / (h + 0.040);
  vec2 cp = vec2(dx * s * 0.45 + uTime * 0.012, s * 1.1 + uTime * 0.004);
  float cl = fbm(cp * vec2(0.50, 1.0)) * 0.62 + 0.38 * fbm(cp * vec2(1.6, 2.4) + 7.0);
  float band = smoothstep(0.30, 0.72, cl);
  col *= 0.50 + 1.15 * band * (0.45 + 0.8 * exp(-h / 0.30)) + 0.25 * smoothstep(0.0, 0.05, h) * 0.0;
  col += SALO * 0.30 * smoothstep(0.42, 0.80, cl) * smoothstep(0.0, 0.20, h) * exp(-h / 0.45);
  col += HALLA * uLight * (0.075 * exp(-h / 0.050) + 0.014 * exp(-h / 0.25));
  return col;
}

// jää ja suo: tasainen lumen peittämä avoin maa, tuulen muotoilemat matalat kummut, tummia paljaan jään laikkuja
vec3 groundAt(float dx, float dy) {
  float z = uCamH * F / max(-dy, 1e-4);
  float wx = dx * z / F + uCamX, wz = z + uCamZ;
  float lod = exp(-z / 60.0);
  // lumen peittämä suo: leveät kumpareet, tuulen suuntaiset harjanteet (x), pienet pykälät
  float big = fbm(vec2(wx * 0.026, wz * 0.0075));
  float drift = fbm(vec2(wx * 0.09, wz * 0.55) + 3.0);
  float drift2 = fbm(vec2((wx + 2.5) * 0.09, (wz + 0.9) * 0.55) + 3.0);
  float rip = vnoise(vec2(wx * 0.8, wz * 3.0)) * exp(-z / 120.0), rip2 = vnoise(vec2((wx + 0.5) * 0.8, (wz + 0.15) * 3.0)) * exp(-z / 120.0);
  float hh = 0.45 * big + 0.40 * drift * (0.35 + 0.65 * lod) + 0.15 * rip;
  float hh2 = 0.45 * big + 0.40 * drift2 * (0.35 + 0.65 * lod) + 0.15 * rip2;
  float lit = clamp(0.5 + 5.0 * (hh - hh2) * (0.4 + 0.6 * lod), 0.0, 1.0);
  vec3 horiz = HZC + HALLA * uLight * 0.040;
  float near = exp(-z / 240.0);
  vec3 snow = vec3(0.019, 0.029, 0.049) * (0.55 + 0.9 * big)
            + (HALLA * 0.060 + horiz * 0.6) * (0.05 + 0.50 * lit) * (0.45 + 0.55 * (1.0 - near))
            + horiz * 0.30 * (1.0 - near);
  // lammet ja paljaan jään laikut: tummia, peilaavat pilvet ja metsän reunan
  float pm = fbm(vec2(wx * 0.014, wz * 0.0075) + 7.0);
  float pond = 0.55 * smoothstep(0.585, 0.605, pm + 0.05 * (vnoise(vec2(wx * 0.4, wz * 0.9)) - 0.5));
  float rf = ridgeFar(dx + asp() * 0.5);
  vec3 refl = skyAt(dx * 1.0, -dy * 0.9) * 0.9;
  refl = mix(refl, vec3(0.0035, 0.0058, 0.0095), smoothstep(0.0010, -0.0010, -dy - rf * 0.8));
  vec3 icec = refl * (0.40 + 0.60 * exp(-z / 500.0)) + vec3(0.0016, 0.0030, 0.0055);
  vec3 col = mix(snow, icec, pond * 0.95);
  // lammen reuna: ohut vaalea lumipenger
  col += HALLA * 0.020 * (smoothstep(0.52, 0.545, pm) - smoothstep(0.545, 0.575, pm)) * (0.4 + 0.6 * lod);
  return mix(col, horiz * 0.95, 1.0 - exp(-z / 650.0));
}

// lehvästö ja rungot: yksi kerros, jonka aukko kasvaa (oksat väistyvät); q = tuloksena [väri, peitto]
vec4 veilLayer(vec2 p, int k, float dx, float dy, vec3 rk) {
  const float VZ[5] = float[5](1.1, 2.0, 3.2, 4.8, 6.8);
  const float VW[5] = float[5](1.4, 2.5, 4.2, 6.5, 10.0);
  const float VH[5] = float[5](3.6, 4.8, 6.4, 8.5, 11.0);
  float fk = float(k);
  float z = VZ[k] - uCamZ;
  if (z < 0.26) return vec4(0.0);
  float wxr = dx * z / F;                  // vaakapaikka suhteessa kameraan
  float yw = uCamH + dy * z / F;
  if (yw < 0.0) return vec4(0.0);
  float wx = wxr + uCamX + (0.05 + 0.10 * uSway) * yw * sin(uTime * 0.8 + 0.5 * yw + fk * 1.7 + wxr * 0.4);   // oksat ja rungot taipuvat tuulessa, tyvi pysyy
  float open = sstep(0.15, 3.2 + 1.3 * fk, uTL);
  // aukko: kaareva, rosoinen; keskellä kameran reitti
  float rag = 0.65 * (fbm(vec2(wx * 0.9 + fk * 5.0, yw * 0.9)) - 0.5);
  float e1 = length(vec2(wxr / (VW[k] * open + 0.02), (yw - 3.2) / (0.5 * VH[k] * open + 0.02)));
  float e2 = length(vec2((wxr - 0.45 * VW[k]) / (0.55 * VW[k] * open + 0.02), (yw - 2.9) / (0.45 * VH[k] * open + 0.02)));
  float e3 = length(vec2((wxr + 0.35 * VW[k]) / (0.60 * VW[k] * open + 0.02), (yw - 0.9) / (0.40 * VH[k] * open + 0.02)));
  float e = min(e1, min(e2, e3)) + rag + 0.30 * (vnoise(vec2(wxr * 3.0 + fk, yw * 2.5)) - 0.5);
  float hole = smoothstep(1.0, 0.72, e) * sstep(0.0, 0.05, open);
  // massa: runkoja, ylhäällä tiheä latvusto, alhaalla ja keskellä harvaa oksistoa
  float cw = 1.5 + 0.3 * fk;
  float id = floor(wx / cw), fr = fract(wx / cw);
  float h1 = hash(vec2(id, fk * 13.0 + 1.0)), h2 = hash(vec2(id, fk * 7.0 + 5.0));
  float tc = 0.25 + 0.5 * h2, thw = 0.045 + 0.075 * h1;
  float trunk = (h1 < 0.60 ? 1.0 : 0.0) * smoothstep(thw, thw * 0.80, abs(fr - tc)) * smoothstep(1.4, 0.8, e);
  float crown = smoothstep(3.2 + 0.4 * fk, 6.0 + 0.5 * fk, yw + 1.6 * (fbm(vec2(wx * 0.7 + fk, 2.0)) - 0.5));
  // oksisto: tuuheita tupsuja, joiden reuna on neulasten sahalaitaa (iso muoto + hienojako), viistossa kuten riippuvat oksat
  float sx = wx + 0.45 * yw + fk * 3.3, sy = yw * 1.3 + fk;
  float c1 = fbm(vec2(sx * 1.1, sy * 1.0 + 0.3 * sin(sx * 1.7)));
  float c2 = fbm(vec2(sx * 6.5 + 4.0, sy * 5.0 - 0.8 * sx));
  float bf = 0.62 * c1 + 0.38 * c2;
  float brush = smoothstep(0.50, 0.525, bf) * (0.25 + 0.75 * smoothstep(0.2, 3.0, yw));
  float mass = max(max(trunk, crown), brush);
  mass = max(mass, 1.0 - sstep(0.0, 0.30, open));     // alussa kerros on umpinainen (rajakuva)
  float a = mass * (1.0 - hole);
  // väri: alussa täsmälleen rajakuva; aukon avautuessa lehvästö saa valoa aukon reunalle (vastavalo)
  float seen = sstep(0.0, 1.4, uTL);
  float shade = 0.55 + 0.9 * vnoise(vec2(wx * 2.3 + fk, yw * 2.0));
  vec3 c = rk * mix(1.0, shade, seen);
  float rim = (exp(-abs(e - 1.05) / 0.10) * 0.6) * open * (0.35 + 0.65 * vnoise(vec2(wx * 3.1, yw * 2.2 + fk)));
  c += (SALO * 1.2 + HALLA * 0.012) * rim * seen;
  return vec4(c, a);
}

// 3D-lumi: soluruudukko maailmassa, kerrokset eri syvyyksillä; kamera etenee, joten lumi virtaa ulospäin. Viiru = suuntaan venytetty piste.
float snowAt(int s, float zz, float dx, float dy, float thr) {
  float cs = 0.9 * (1.0 + zz / 28.0);
  vec2 w2 = (vec2(dx * zz / F + uCamX + uWindX * (0.6 + 0.04 * float(s)), dy * zz / F + uFall * (0.85 + 0.03 * float(s)))) / cs
          + float(s) * 17.3 + floor((float(s) * 3.7 - uCamZ) / 44.4) * 3.7;
  vec2 ic = floor(w2), fr = fract(w2);
  float h = hash(ic);
  if (h >= thr) return 0.0;
  vec2 c = 0.22 + 0.56 * vec2(hash(ic + 1.7), hash(ic + 5.1));
  vec2 dirc = normalize(vec2(-uWindX * 0.0 + 1.0, 0.0) + vec2(0.0, 0.0) + vec2(0.0));
  // viivan suunta: tuuli vasemmalle ja alas; pyörteen ympärillä virtaus kiertää tangentin suuntaan
  vec2 v = vec2(dx - uVor.x, dy - uVor.y);
  float rv = length(v) + 1e-3;
  vec2 tang = vec2(-v.y, v.x) / rv;
  vec2 wind = normalize(vec2(cos(0.40 + uWAng), sin(0.40 + uWAng)));
  float sw = uSwirl * exp(-rv / (1.6 * uVor.z + 0.20));
  float an = (hash(ic + 3.3) - 0.5) * 0.30;
  dirc = normalize(mix(wind, tang, clamp(sw, 0.0, 0.85)));
  dirc = vec2(dirc.x * cos(an) - dirc.y * sin(an), dirc.x * sin(an) + dirc.y * cos(an));
  float lenc = 0.04 + 0.40 * uStreak;
  vec2 q = fr - c;
  float tp = clamp(dot(q, dirc), -lenc * 0.5, lenc * 0.5);
  float dd = length(q - dirc * tp) * 0.9;
  float nearK = smoothstep(11.0, 2.5, zz);                          // lähellä: leveä, sumea, himmeä (epätarkka)
  float r = (0.014 + 0.012 * fract(h * 53.0)) * (0.8 + 0.2 * cs / 0.9) * mix(1.4, 1.0, uWi) * (1.0 + 0.0 * nearK);
  float b = 0.85 * smoothstep(r, r * (0.20 + 0.6 * nearK), dd) / (1.0 + 1.6 * lenc) / (1.0 + 2.5 * nearK);
  return b * smoothstep(1.5, 4.0, zz) * smoothstep(45.5, 38.0, zz) * exp(-zz / 70.0);
}

vec3 scene(vec2 p) {
  float A = asp();
  float dx = p.x - A * 0.5, dy = p.y - uHor;
  vec3 rk = rajakuva(p, 0, uTime);
  vec3 col;
  // --- avoin maailma: taivas, metsän reuna, maa ---
  if (uFin < 1.0) {
    if (dy >= 0.0) {
      col = skyAt(dx, dy);
      float rf = ridgeFar(p.x), rn = ridgeNear(p.x);
      vec3 hz = HZC + HALLA * uLight * 0.030;
      float aF = smoothstep(0.0012, -0.0012, dy - rf), aN = smoothstep(0.0010, -0.0010, dy - rn);
      vec3 farc = vec3(0.0040, 0.0068, 0.0120) * (0.7 + 0.6 * vnoise(vec2(p.x * 31.0, dy * 70.0))) + hz * 0.05 * smoothstep(0.0, ridgeFar(p.x), dy);
      vec3 nearc = vec3(0.0034, 0.0056, 0.0090) + HALLA * uLight * 0.0010;
      col = mix(col, farc, aF);
      col = mix(col, nearc, aN);
      // metsän reunan yläpuolella matala usva
      col += SALO * 0.5 * exp(-max(dy, 0.0) / 0.016) * (1.0 - aF) * 0.5;
    } else {
      col = groundAt(dx, dy);
      float rn = ridgeNear(p.x);
      col = mix(col, vec3(0.0034, 0.0056, 0.0090), smoothstep(-0.0005, 0.0012, rn * 0.0 + 0.0012 + dy) * 0.0);
    }
    vec3 base0 = col;
    // --- myrskyn lumiseinä: kuusi kerrosta, kaukaa lähelle ---
    if (uVis > 0.0) {
      const float WZ[6] = float[6](2600.0, 3400.0, 4400.0, 5600.0, 7000.0, 9000.0);
      const float WH[6] = float[6](260.0, 320.0, 380.0, 440.0, 520.0, 600.0);
      const float WA[6] = float[6](0.55, 0.64, 0.73, 0.82, 0.91, 1.00);
      const float WX[6] = float[6](500.0, -900.0, 1500.0, -2200.0, 600.0, 0.0);
      const float WW[6] = float[6](1700.0, 2500.0, 3500.0, 4800.0, 6500.0, 9000.0);
      for (int j = 5; j >= 0; j--) {
        float fj = float(j);
        float z = WZ[j] * pow(6.0 / WZ[j], min(uU / WA[j], 1.0));
        float wx = dx * z / F, yw = uCamH + dy * z / F;
        float H = WH[j];
        float top = H * (0.55 + 0.45 * fbm(vec2(wx / (H * 2.4) + fj * 3.7, fj)));
        float prof = smoothstep(top, top * 0.28, yw);
        float cs = H * 0.07;
        float st1 = vnoise(vec2((wx + 0.25 * yw) / (cs * 6.0) + fj * 5.0, yw / (H * 0.45)));
        float st2 = vnoise(vec2(wx / (cs * 3.0) + fj * 9.0, yw / (H * 0.3)));
        float dens = prof * (0.28 + 0.72 * st1 * (0.55 + 0.45 * st2));
        float lat = smoothstep(WW[j], WW[j] * 0.55, abs(wx - WX[j]));
        float gnd = mix(1.0, smoothstep(0.0, 0.004 * z / F, yw), smoothstep(40.0, 400.0, z));
        float al = clamp(dens * lat * gnd * uVis * (0.45 + 0.55 * sstep(0.05, 0.6, uU)) * (0.55 + 0.10 * fj) * 2.6, 0.0, 0.90);
        float fogk = 1.0 - exp(-z / 4200.0);
        vec3 wc = mix(vec3(0.090, 0.118, 0.160), HZC * 2.0, fogk) * (0.70 + 0.55 * uLight);
        wc *= 0.72 + 0.55 * smoothstep(0.2, 1.0, yw / max(top, 1.0));
        wc = mix(wc, stormBase(max(uDens, 0.45)) * (0.55 + 0.9 * st1) * (0.60 + 0.8 * exp(-abs(dy) / 0.28)), 1.0 - smoothstep(30.0, 900.0, z));
        al *= 1.0 - 0.85 * sstep(0.70, 0.95, uU);
        col = mix(col, wc, al);
      }
    }
    // --- myrskyn sisus: yhteinen valo ja väri, massa virtaa pyörteen ympäri ---
    if (uWi > 0.0) {
      vec2 v = vec2(dx - uVor.x, dy - uVor.y);
      float r = length(v) + 1e-4, a = atan(v.y, v.x);
      float R = max(uVor.z, 0.01);
      float ang = uMass * 0.10 / (r * 3.0 + 0.45);
      vec2 qv = vec2(cos(a - ang), sin(a - ang)) * r;
      float m1 = fbm(qv * vec2(1.7, 2.3) + vec2(0.0, 3.0));
      float m2 = fbm(qv * vec2(4.6, 6.0) + 9.0 + vec2(uMass * 0.12, 0.0));
      float arm = 0.5 + 0.5 * sin(3.0 * a - 3.6 * log(r / R + 0.25) + uMass * 0.12);
      vec3 hz = stormBase(uDens) * (0.55 + 0.95 * m1 * (0.6 + 0.8 * m2)) * (0.85 + 0.35 * arm * exp(-r / (3.0 * R + 0.2))) * (0.80 + 0.40 * exp(-abs(dy) / 0.35));
      float core = exp(-pow(r / R, 2.0)) * uVor.w;
      hz *= 1.0 - 0.93 * core;
      hz += stormBase(uDens) * 0.30 * exp(-pow((r - 1.55 * R) / (0.55 * R + 0.02), 2.0)) * (1.0 - 0.9 * core);
      col = mix(col, hz, uWi);
      // maa ja metsän reuna vilahtavat lumen takaa, kun puuska hellittää
      float gm = uGl * smoothstep(0.48, 0.78, fbm(vec2(dx * 1.3 + uMass * 0.20, dy * 2.4 + 3.0)));
      col = mix(col, base0 * (1.1 + 1.0 * uLight) + hz * 0.5, gm * uWi);
    }
  } else {
    col = vec3(0.0);
  }
  // --- lumi kaikissa syvyyksissä ---
  if (uDens > 0.0 && uFin < 1.0) {
    float thr = 0.05 + 0.40 * uDens;
    float acc = 0.0;
    float core = exp(-pow((length(vec2(dx - uVor.x, dy - uVor.y))) / max(uVor.z, 0.01), 2.0)) * uVor.w;
    for (int s = 0; s < 12; s++) {
      float zz = 1.5 + mod(float(s) * 3.7 - uCamZ, 44.4);
      acc += snowAt(s, zz, dx, dy, thr + 0.55 * uFin * (1.0 - 0.7 * float(s) / 11.0));
    }
    col += FLAKE * acc * (1.0 - 0.8 * core) * (0.65 + 0.9 * uLight) * mix(0.28, 1.0, uWi);
  }
  // --- lehvästö ja rungot: viimeinen tumma kerros ---
  if (uTL < 12.0) {
    for (int k = 4; k >= 0; k--) {
      vec4 vl = veilLayer(p, k, dx, dy, rk);
      col = mix(col, vl.rgb, vl.a);
    }
  }
  // --- Ukon tuli: pystysuora valo kerrosten läpi, metsän reuna hetkeksi näkyviin ---
  if (uCut.y > 0.001 && uFin < 1.0) {
    float jag = (vnoise(vec2(p.y * 6.0, 3.0)) - 0.5) * 0.004;
    float d = abs(dx - uCut.x - jag);
    float beam = exp(-d * d / (0.0030 * 0.0030)) * (0.9 + 0.2 * vnoise(vec2(p.y * 14.0, 1.0))) + 0.30 * exp(-d / 0.030) + 0.10 * exp(-d / 0.32);
    col += LEIKKAUS * uCut.y * beam * 0.55;
    col += HALLA * 0.060 * uCut.y * (0.25 + exp(-abs(dy) / 0.12));
    float rg = ridgeFar(p.x);
    float m = smoothstep(0.004, -0.001, dy - rg) * smoothstep(-0.040, -0.006, dy);
    col = mix(col, vec3(0.0016, 0.0024, 0.0034), m * clamp(uCut.z, 0.0, 1.0) * 0.92);
  }
  // --- loppu: lumi tihenee vaaleaksi seinäksi, joka on täsmälleen rajakuva LUMI ---
  col = mix(col, rajakuva(p, 4, uTime), uFin);
  // --- alku: rajakuva PIMEA_MASSA (veilLayer tuottaa sen täsmälleen, kun uTL = 0) ---
  return col;
}
` + FS_LOPPU;

async function alusta() {
  const d = await lataa();
  const A = d.aika;
  d.vaadi('hiljaisuus_2_alku', 'myrsky_nakyy', 'hiljaisuus_2_loppu', 'myrsky_kasvu', 'myrsky_iskee', 'Q_koko_metsa', 'myrsky_huippu', 'R_vasket', 'toinen_paisunta', 'huuto');
  const T0 = A.hiljaisuus_2_alku, T1 = A.myrsky_nakyy, T2 = A.hiljaisuus_2_loppu, T3 = A.myrsky_kasvu, T4 = A.myrsky_iskee;
  const T5 = A.Q_koko_metsa, T6 = A.myrsky_huippu, T7 = A.R_vasket, T8 = A.toinen_paisunta, T9 = A.huuto;
  const FPS = d.FPS;
  const kohta = d.kohta;

  // --- äänestä mitatut hitaat signaalit (keskiarvo vähintään 0,3 s) ---
  const voima = (t) => d.koko(t, 0.7);                 // jousten (Q:sta koko orkesterin) voima
  const voimaH = (t) => d.koko(t, 1.6);
  const matala = (t) => d.matala(t, 0.6);
  const korkea = (t) => d.korkea(t, 0.8);
  const kalpea = (t) => d.pitka(t, 1.6);               // teoksen pitkä ääni (fis): horisontin kalpea valo

  // --- kamera: tasainen hidas ajo, vauhti kasvaa vain suuressa käänteessä (jousten voimistuminen kasvusta Q:hun) ---
  const nopeus = (t) => 0.70 + 1.5 * sstep(T3, T5, t) * (1 - 0.55 * sstep(T7, T8, t));
  const kZ = d.sarja((f) => nopeus(f / FPS) / FPS);
  const kX = d.sarja((f) => 0.30 * nopeus(f / FPS) / FPS);          // viisto eteneminen: parallaksi
  const kZ0 = kohta(kZ, T0), kX0 = kohta(kX, T0);

  // --- myrskyn lähestyminen: jousten voiman kertymä, joka on tasan 1 ankkurissa myrsky_iskee ---
  const rate = (t) => 0.02 + Math.pow(d.koko(t, 1.0), 1.5);
  const kU = d.sarja((f) => rate(f / FPS) / FPS);
  const uOf = (t) => clamp((kohta(kU, t) - kohta(kU, T1)) / (kohta(kU, T4) - kohta(kU, T1)), 0, 1);

  // --- pyörteen kasvu: lähestyminen jousten ja orkesterin voiman mukana; säde 0,035 (iskee) → 0,55 (R), sisällä R:stä nousuun ---
  const kV = d.sarja((f) => (0.5 + d.koko(f / FPS, 2.0)) / FPS);
  const lr = (t) => (kohta(kV, t) - kohta(kV, T4)) / (kohta(kV, T7) - kohta(kV, T4));
  const vSade = (t) => (t < T4 ? 0 : 0.05 * Math.exp(Math.log(0.55 / 0.05) * Math.min(lr(t), 1.25)) * (1 - sstep(T8, T9 - 0.7, t)));
  // pyörteen tummuus hengittää matalan rekisterin mukana (patarummut)
  const vTumma = (t) => (t < T4 ? 0 : (0.80 + 0.18 * matala(t)) * sstep(T4, T4 + 3, t));
  // massan virtaus ja pyörteen kierto: kertymä, nopeus kasvaa myrskyn voimalla
  const kM = d.sarja((f) => { const t = f / FPS; return (0.05 + 0.55 * sstep(T3, T5, t) * (0.5 + voimaH(t))) / FPS; });
  const massa = (t) => kohta(kM, t) - kohta(kM, T0);

  // --- lumi: tiheys ja viivojen pituus; tuuli ja putoaminen kertyminä ---
  const uuOut = (t) => uOf(t);
  const wiOf = (t) => sstep(0.55, 1.0, uOf(t));
  const tiheys = (t) => {
    const ulko = 0.035 + 0.50 * Math.pow(uuOut(t), 1.3);
    const sisa = 0.38 + 0.50 * Math.sqrt(clamp(voimaH(t) * 1.05, 0, 1));
    const wi = wiOf(t);
    const nousu = sstep(T8, T9, t);
    return clamp(lerp(ulko, sisa, wi) + 0.18 * nousu, 0, 0.92);
  };
  const viiru = (t) => sstep(T3, T4 + 1.5, t) * (0.75 + 0.25 * voimaH(t)) * (1 - 0.35 * sstep(T8, T9, t));
  const tuulenNopeus = (t) => 0.02 + 14 * sstep(T3 - 1, T4 + 2, t) * (0.7 + 0.5 * voimaH(t));
  const kW = d.sarja((f) => tuulenNopeus(f / FPS) / FPS);
  const putoamisNopeus = (t) => 0.06 + 1.1 * sstep(T3, T4 + 2, t) + 7 * Math.pow(sstep(T8, T9, t), 1.5) * (0.6 + 0.8 * korkea(t));
  const kF = d.sarja((f) => putoamisNopeus(f / FPS) / FPS);
  const kierto = (t) => clamp(0.18 + 0.45 * sstep(T4, T5, t), 0, 0.85);

  // --- nousu: kamera nousee T8:sta; horisontti vajoaa hitaasti (alle 20 °/s) ---
  const nousuK = (t) => sstep(T8, T9, t);
  const korkeus = (t) => 1.7 + 70 * Math.pow(nousuK(t), 2);
  const horisontti = (t) => 0.31 - 0.14 * nousuK(t);

  // --- valo: horisontin kalpea hohto elää jousten voiman ja pitkän äänen mukana; hiljaisuudessa pois ---
  const hilj = (t) => sstep(T0 - 0.1, T0 + 2.0, t) * (1 - sstep(T2, T2 + 3, t)) * (t < T2 ? 1 : 0) + 0;
  const melKaari = (t) => clamp((d.melodia(t, 3.0) - 68) * 0.03, -0.35, 0.45);   // tuulen suunta seuraa melodian kaarta hitaasti
  const lasna = (t) => { const k = Math.pow(1 - clamp(voimaH(t) * 1.1, 0, 1), 1.3) * 0.9; return clamp(k + 0.55 * Math.exp(-Math.pow((t - (T8 + 1.5)) / 1.8, 2)) * (1 - sstep(T8 + 3, T9 - 1.5, t)), 0, 0.9) * sstep(T4 - 0.5, T4 + 1.5, t) * (1 - sstep(T9 - 3, T9 - 0.3, t)); };
  const huojunta = (t) => clamp(0.12 + 0.9 * voimaH(t) + 0.5 * sstep(T3, T4, t), 0, 1.4);   // tuuli = jousten voima (hidas keskiarvo); hiljaisuudessakin heikko huojunta
  const valo = (t) => clamp(0.28 + 0.9 * voimaH(t) * sstep(T2 - 1, T3 + 1, t) + 0.5 * kalpea(t), 0, 1.3);

  // --- seinän näkyvyys: nousee hitaasti ankkurin myrsky_nakyy ympärillä (ei ilmesty) ---
  const nakyvyys = (t) => sstep(T1 - 2.5, T1 + 3.5, t);

  // --- pystyvalot: vain nimetyt iskut (d.iskut: Q_koko_metsa, myrsky_huippu, R_vasket) ---
  const ISKUT = [[T5, 0.38], [T6, -0.30], [T7, 0.14]];
  const valoLeikkaus = (t) => {
    let k = 0, x = 0, paljas = 0;
    for (const [ta, xs] of ISKUT) {
      const ti = t - ta; if (ti < 0 || ti > 3) continue;
      const v = Math.exp(-ti / 0.32) + 0.45 * (ti > 0.20 ? Math.exp(-(ti - 0.20) / 0.10) : 0);
      if (v > k) { k = v; x = xs; paljas = Math.exp(-ti / 0.55); }
    }
    return [x, Math.min(k, 1.2), paljas];
  };

  const { gl, U, piirra } = luoGL(FS);

  const tila = (t) => {
    const tc = clamp(t, T0, T9);
    const u = uOf(tc);
    const wi = wiOf(tc);
    const [cx, ck, cr] = valoLeikkaus(tc);
    const ps = new URLSearchParams(location.search);
    return {
      tc, u, wi, tiheys: tiheys(tc), viiru: viiru(tc), valo: valo(tc), nak: nakyvyys(tc),
      camZ: kohta(kZ, tc) - kZ0, camX: kohta(kX, tc) - kX0, camH: korkeus(tc), hor: horisontti(tc),
      tuuli: kohta(kW, tc), putoaa: kohta(kF, tc), massa: massa(tc), kierto: kierto(tc),
      vor: [0.0, 0.07 + 0.03 * (1 - sstep(T4, T6, tc)), vSade(tc), vTumma(tc) * (1 - sstep(T8, T9 - 0.7, tc))],
      cut: [cx, ck, cr], fin: sstep(T8 + 1.0, T9, tc), ps, sway: huojunta(tc), gl: lasna(tc), wang: melKaari(tc),
    };
  };

  // mittausta varten: mitä ääni ohjaa hetkellä t
  const kuvaus = (t) => {
    const s = tila(t);
    return { t: +t.toFixed(2), u: +s.u.toFixed(3), sisus: +s.wi.toFixed(2), tiheys: +s.tiheys.toFixed(2), viiru: +s.viiru.toFixed(2),
      voima: +voima(t).toFixed(2), matala: +matala(t).toFixed(2), valo: +s.valo.toFixed(2), nakyvyys: +s.nak.toFixed(2),
      vauhti: +nopeus(t).toFixed(2), matka: +s.camZ.toFixed(1), korkeus: +s.camH.toFixed(1), horisontti: +s.hor.toFixed(3),
      pyorre: +s.vor[2].toFixed(3), leikkaus: +s.cut[1].toFixed(2), loppu: +s.fin.toFixed(2), huojunta: +s.sway.toFixed(2) };
  };

  julkaise({
    gl, aika: A, kuvaus,
    kamera: (t) => { const s = tila(t); return { p: [s.camX, s.camH, s.camZ], q: [0, 0, 0, 1], shot: 'myrsky', cut: 0, trans: false }; },
    seek: (t) => {
      const s = tila(t);
      gl.uniform1f(U('uTime'), clamp(t, T0, T9)); gl.uniform1f(U('uTL'), clamp(t, T0, T9) - T0);
      gl.uniform1f(U('uHor'), s.hor); gl.uniform1f(U('uCamH'), s.camH); gl.uniform1f(U('uCamZ'), s.camZ); gl.uniform1f(U('uCamX'), s.camX);
      gl.uniform1f(U('uLight'), s.valo); gl.uniform1f(U('uVis'), s.nak); gl.uniform1f(U('uU'), s.u); gl.uniform1f(U('uWi'), s.wi);
      gl.uniform1f(U('uDens'), s.tiheys); gl.uniform1f(U('uWindX'), s.tuuli); gl.uniform1f(U('uFall'), s.putoaa);
      gl.uniform1f(U('uStreak'), s.viiru); gl.uniform1f(U('uMass'), s.massa); gl.uniform1f(U('uSwirl'), s.kierto);
      gl.uniform1f(U('uFin'), s.fin); gl.uniform1f(U('uHush'), 0); gl.uniform1f(U('uSway'), s.sway); gl.uniform1f(U('uGl'), s.gl); gl.uniform1f(U('uWAng'), s.wang);
      gl.uniform4f(U('uVor'), s.vor[0], s.vor[1], s.vor[2], s.vor[3]);
      gl.uniform4f(U('uCut'), s.cut[0], s.cut[1], s.cut[2], 0);
      piirra();
    },
  });
  if (new URLSearchParams(location.search).get('kuvaus')) {
    for (let t = T0; t <= T9 + 0.01; t += 2.5) console.log(JSON.stringify(kuvaus(t)));
  }
}
alusta().catch((e) => { console.error(e); window.sceneError = String(e.message || e); });
