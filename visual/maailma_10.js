// Tapiola: maailma 10 "Se näkyy ja tulee": ankkurista hiljaisuus_2_alku ankkuriin huuto.
// Alku RAJA.PIMEA_MASSA, loppu RAJA.LUMI (visual/yhteinen.js). Suunnitelma: runs/maailma_10/tarkistus.md ja
// docs/kuvakasikirjoitus.md "Kaksitoista maailmaa", maailma 10; säännöt: docs/visuaalinen_tyyli.md luvut 1, 2, 4d, 5, 7b ja 12.
//
// - Metsä loppuu: alku on viimeinen tumma kerros (lehvästö ja rungot, viisi kerrosta), jonka läpi kamera ajaa avoimelle jäälle.
//   Kerrosten aukot kasvavat maailmassa; mikä täytti kuvan, osoittautuu metsän reunaksi, joka valuu kuvan reunoille.
// - Avoin tila: raskas pilvitaivas, tasainen lumen peittämä jää, tummat paljaan jään laikut (peilikuva), horisontissa matala
//   musta metsän reuna sileiden kumpujen päällä. Siemenen kuva palaa ilman valoa. Lumi on lähes paikallaan.
// - Myrsky = lunta ja jäätä, joka tulee kaukaa (tulkinta, ei esipuheen asia): kuusi lumiseinän kerrosta; lähestyminen on
//   jousten voiman kertymää, joka päättyy täsmälleen ankkuriin myrsky_iskee (vedos 5: tämä nousu säilyy sellaisenaan).
// - Vedos 5, myrsky_iskee -> huuto: myrsky on PINTAKERROS ja sen takana on syvyyttä. Neljä lumiverhoa (kaukainen, kaksi keskellä,
//   lähin) kulkevat eri nopeuksilla; niiden peitto seuraa jousten tasoa (keski- ja ylärekisteri, uusien sävelten tiheys) puuskina,
//   ja puuskien raoista näkyy se, mitä myrsky peittää: horisontin valo, metsän tumma massa, sileät kummut, jää. Pyörteitä syntyy
//   puuskien huipuissa (jousten tason paikalliset maksimit) ja ankkureissa; ne kulkevat hitaasti, ja silmä avaa verhon takana
//   olevaan. Vain myrskyn huipulla (myrsky_huippu ympärillä) kaikki on yhtä valkoista seinää.
// - Nimetyt iskut Q, huippu, R: pystysuora valo kerrosten läpi (Ukon tuli), joka näyttää hetkeksi metsän reunan.
// - toinen_paisunta: nousu pyörteen läpi (ensimmäinen ja ainoa nousu), pimeä keskus sulkeutuu lumeen, lumi tihenee
//   vaaleaksi seinäksi ja kuva päättyy täsmälleen rajakuvaan LUMI.
// Kohtaus on puhdas aikafunktio seek(t): kaikki kertymät lasketaan alussa ruuduittain, ei ajastimia, ei satunnaisuutta.
import { lataa, luoGL, julkaise, FS_ALKU, GLSL_YHTEINEN, FS_LOPPU, clamp, smooth, sstep, lerp } from './yhteinen.js';

const FS = FS_ALKU + `
uniform float uTime, uTL, uHor, uCamH, uCamZ, uCamX, uLight, uVis, uU, uWi, uDens, uWindX, uFall, uStreak, uMass, uSwirl, uFin, uHush, uSway, uGl, uWAng;
uniform float uInt, uWhite, uUp, uBass, uShF, uWindV, uFallV, uMelt, uGap, uPuff;
uniform vec3 uSpF;            // pyörteiden kiertymä hiutaleille (rad)
uniform vec4 uV0, uV1, uV2;   // pyörteet: x (dx), y (dy), säde, voima (etumerkki = kiertosuunta)
uniform vec3 uSp;             // pyörteiden kiertymä (rad)
uniform vec4 uSh;             // iskuaalto: x (dx), y (dy), säde, voima
uniform vec4 uCut;            // pystyvalo: x (dx), voima, metsän reunan paljastus, -
uniform vec4 uK[6], uL[6];    // vedos 6: vaskien fraasin toistot: uK = x (dx), voima, leveys, laji (0 huuto, 1 seinämä); uL = aika alusta (s)
uniform float uFlash;         // vedos 6: viimeisen takomisen neljännellä iskulla koko kuva valossa
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
  float px = px0 + uSway * 0.0009 * sin(px0 * 11.0 + uTime * 0.7) + uSway * 0.0005 * sin(px0 * 29.0 - uTime * 1.3);   // latvat huojuvat tuulessa; kummut ja maa pysyvät
  float m = 0.042 * exp(-pow((xs - 0.17) / 0.16, 2.0)) + 0.070 * exp(-pow((xs - 0.60) / 0.20, 2.0))
          + 0.034 * exp(-pow((xs - 0.93) / 0.12, 2.0)) + 0.018 * exp(-pow((xs - 0.38) / 0.10, 2.0));
  // latvusto: suuret ryhmät, latvat ja hienojako (kuten maailman 1 canopy)
  float cr = 0.016 * vnoise(vec2(px * 14.0, 2.0)) + 0.010 * vnoise(vec2(px * 46.0, 7.0)) + 0.008 * pow(vnoise(vec2(px * 120.0, 1.0)), 1.5) + 0.005 * pow(vnoise(vec2(px * 300.0, 4.0)), 2.0);
  return 0.012 + m + cr;
}
float ridgeNear(float px0) {
  float xs = px0 / asp();
  float px = px0 + uSway * 0.0006 * sin(px0 * 13.0 + uTime * 0.9 + 1.0) + uSway * 0.0003 * sin(px0 * 37.0 - uTime * 1.6);
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
  float wx = wxr + uCamX + (0.006 + 0.007 * min(uSway, 1.3)) * yw * sin(uTime * 0.8 + 0.5 * yw + fk * 1.7 + wxr * 0.4);   // oksat ja rungot taipuvat tuulessa, tyvi pysyy
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
vec2 gTan = vec2(0.0), gWind = vec2(1.0, 0.0), gTd = vec2(1.0, 0.0);
float gSw = 0.0, gEye = 0.0, gMix = 0.0;
void vortexAccum(vec2 q, vec4 v) {
  if (abs(v.w) < 1e-3) return;
  vec2 r = q - v.xy; float rr = length(r) + 1e-3; float R = max(v.z, 0.02);
  float w = exp(-pow(rr / (1.7 * R), 2.0)) * abs(v.w);
  gTan += sign(v.w) * vec2(-r.y, r.x) / rr * w;
  gSw += w;
  gEye += exp(-pow(rr / (0.55 * R), 2.0)) * abs(v.w);
}
vec2 vortexWarp(vec2 q, vec4 v, float sp) {            // pyöräyttää pistettä pyörteen ympäri (kiertymä kasvaa hitaasti)
  if (abs(v.w) < 1e-3) return q;
  vec2 r = q - v.xy; float rr = length(r) + 1e-3; float R = max(v.z, 0.02);
  float ang = (sign(v.w) * abs(v.w) * 0.55 + sp) * exp(-pow(rr / (1.8 * R), 2.0));
  float cs = cos(ang), sn = sin(ang);
  return v.xy + vec2(r.x * cs - r.y * sn, r.x * sn + r.y * cs);
}
// lumiverho j (0 kaukainen ... 3 lähin): [väri, peitto]. Peitto = verhon oma kohina + puuskakenttä + jousten taso (uInt).
vec4 curtain(int j, vec2 qw, float dy) {
  const float SCL[4] = float[4](3.0, 2.1, 1.5, 1.0);
  const float MV[4] = float[4](0.30, 0.62, 1.05, 1.75);
  const float ZJ[4] = float[4](0.25, 0.60, 1.00, 1.60);
  const float TH[4] = float[4](0.00, 0.02, 0.05, 0.09);
  const float AM[4] = float[4](0.62, 0.66, 0.70, 0.72);
  float fj = float(j), f3 = fj / 3.0;
  vec2 qs = qw / (1.0 + 0.004 * uCamZ * ZJ[j]);              // kamera ajaa eteenpäin: verhot laajenevat hitaasti, lähimmät nopeimmin
  float sc = SCL[j];
  float sx = mix(mix(0.55, 0.30, uWhite), 2.2, uUp), sy = mix(2.3, 0.50, uUp);   // viirut: vaakaan myrskyssä, pystyyn nousussa
  vec2 u = vec2((qs.x + 0.30 * qs.y) * sc * sx + uWindX * 0.055 * MV[j], qs.y * sc * sy + uFall * 0.045 * MV[j] + fj * 7.3);
  float n = fbm(u);
  float n2 = vnoise(u * vec2(2.9, 2.3) + 5.0 + fj);
  float gst = fbm(vec2((qs.x + uWindX * 0.0125 * (0.5 + 0.5 * f3)) * 0.60 + fj * 3.1, qs.y * 0.75 + fj * 2.0 + 2.0 + uTime * 0.02 * (1.0 + 0.3 * fj)));
  float bw = j == 0 ? exp(-pow(dy / 0.24, 2.0)) : (j == 1 ? 0.40 + 0.60 * exp(-pow(dy / 0.50, 2.0)) : 1.0);
  float x = 0.30 * n + 0.08 * n2 + 0.80 * gst + (j == 0 ? 0.40 * uBass * exp(-pow((dy + 0.05) / 0.12, 2.0)) : 0.0);
  float th = 0.71 - 0.55 * (uInt - 0.5) + TH[j];                     // kynnys laskee jousten tason noustessa: peitto kasvaa, harvetessa takana oleva näkyy
  float a = smoothstep(th - 0.11, th + 0.11, x) * AM[j] * bw;
  // puuskien raot: yhteinen rakokenttä kulkee tuulen mukana; raossa kaikki verhot ohenevat ja takana oleva näkyy
  float gapf = smoothstep(0.44, 0.58, fbm(vec2((qs.x + uWindX * 0.010) * 0.50 + 9.0, qs.y * 0.10 + uTime * 0.012)));   // raot ovat pystysuuntaisia kaistoja: ne leikkaavat horisontin
  a *= 1.0 - uGap * 0.92 * gapf;
  if (j == 0) a = max(a, 0.5 * uPuff * exp(-pow((dy - 0.04) / 0.06, 2.0)) * (0.5 + n));   // lumi pöllähtää latvojen tasolta
  if (j < 2) { float gr = vnoise(u * vec2(6.0, 16.0) + 3.0); a *= 0.85 + 0.30 * gr; }
  a *= 1.0 - 0.92 * min(gEye, 1.0);                                // pyörteen silmä avaa verhon: takana oleva näkyy
  vec3 cfar = vec3(0.014, 0.022, 0.040), cnear = vec3(0.085, 0.102, 0.140);
  vec3 c = mix(cfar, cnear, f3) * (0.75 + 0.45 * uLight) * (0.85 + 0.30 * exp(-abs(dy) / 0.30)) * (0.45 + 1.00 * n);
  vec3 WH = mix(vec3(0.150, 0.172, 0.220), vec3(0.19, 0.22, 0.28), uUp);
  float texA = 1.0 - 0.8 * uUp;
  vec3 whT = WH * mix(1.0, (0.55 + 1.0 * n) * (0.65 + 0.7 * gst), texA);      // seinässä on rakenne: vaaleampia ja tummempia kieliä, jotka virtaavat
  c = mix(c, whT, uWhite);
  a = mix(a, 0.94, uWhite);
  return vec4(c, a);
}
// hiutale: pehmeä viiru, jonka pituus on täsmälleen sen matka yhden ruudun aikana (liike-epäterävyys), pää kirkas ja häntä ohenee.
// Lähellä harvat suuret ja epätarkat, keskellä tiheä parvi, kaukana pieniä ja himmeitä (hieno lumisavu).
float snowAt(int s, float zz, float dx, float dy, float thr) {
  float fs = float(s);
  float cs = 0.9 * (1.0 + zz / 28.0);
  vec2 off = vec2(0.6 + 0.04 * fs, 0.85 + 0.03 * fs);
  vec2 w2 = (vec2(dx * zz / F + uCamX + uWindX * off.x, dy * zz / F + uFall * off.y)) / cs
          + fs * 17.3 + floor((fs * 3.7 - uCamZ) / 44.4) * 3.7;
  vec2 ic = floor(w2), fr = fract(w2);
  float h = hash(ic);
  float nearK = smoothstep(11.0, 2.5, zz);
  float farK = smoothstep(24.0, 40.0, zz);
  float thrL = thr * mix(1.0, 0.45, nearK) * mix(1.0, 1.35, farK);
  if (h >= thrL) return 0.0;
  vec2 dw = vec2(uWindV * off.x, uFallV * off.y) / cs / 30.0;           // siirtymä yhdessä ruudussa (solun yksikköinä)
  float dl = length(dw);
  vec2 mv = dl > 1e-5 ? -dw / dl : vec2(0.0, -1.0);                      // liikkeen suunta ruudulla
  vec2 dirc = normalize(mix(mv, gTd, gMix) + vec2(1e-5));
  float len = min(dl, 0.90);
  float an = (hash(ic + 3.3) - 0.5) * 0.12;
  dirc = vec2(dirc.x * cos(an) - dirc.y * sin(an), dirc.x * sin(an) + dirc.y * cos(an));
  float r = (0.016 + 0.012 * fract(h * 53.0)) * (1.0 + 2.4 * nearK) * (1.0 - 0.25 * farK) * (1.0 + 2.2 * uMelt);
  float spread = max(0.5 - len * 0.5 - r * 2.2, 0.0);
  vec2 c = 0.5 + (vec2(hash(ic + 1.7), hash(ic + 5.1)) * 2.0 - 1.0) * spread;
  vec2 q = fr - c;
  float along = dot(q, dirc);
  float tp = clamp(along, -len * 0.5, len * 0.5);
  float dd = length(q - dirc * tp);
  float tail = len > 0.02 ? 0.40 + 0.60 * smoothstep(-len * 0.5, len * 0.5, along) : 1.0;   // pää kirkas, häntä ohenee
  float b = exp(-pow(dd / r, 2.0) * 1.1) * tail;
  b *= 0.80 / (1.0 + 1.3 * len) / (1.0 + 2.2 * nearK) * (1.0 - 0.45 * farK) * (1.0 - 0.85 * uMelt);
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
    vec3 colA = col;
    vec2 q0 = vec2(dx, dy);
    // pyörteet ja tuulen suunta: lasketaan kerran per pikseli
    gWind = normalize(vec2(cos(0.40 + uWAng), sin(0.40 + uWAng)));
    gTan = vec2(0.0); gSw = 0.0; gEye = 0.0;
    vortexAccum(q0, uV0); vortexAccum(q0, uV1); vortexAccum(q0, uV2);
    gMix = clamp(gSw * 0.9, 0.0, 0.85);
    gTd = gSw > 1e-4 ? normalize(gTan + vec2(1e-5)) : gWind;
    // --- myrskyn lumiseinä: kuusi kerrosta, kaukaa lähelle ---
    if (uVis > 0.0 && uU < 1.0) {
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
        al *= 1.0 - 0.85 * sstep(0.70, 0.95, uU) - 0.15 * sstep(0.95, 1.0, uU);
        colA = mix(colA, wc, al);
      }
    }
    // --- lumi kaikissa syvyyksissä: kaukaiset (zz > 14) ja lähimmät erikseen, jotta lähin verho peittää kaukaisen lumen ---
    float accF = 0.0, accN = 0.0;
    vec2 qF = vortexWarp(vortexWarp(vortexWarp(q0, uV0, uSpF.x), uV1, uSpF.y), uV2, uSpF.z);    // hiutaleet kiertävät pyörteiden ympäri
    if (uDens > 0.0) {
      float thr = 0.04 + 0.42 * uDens;
      for (int s = 0; s < 12; s++) {
        float zz = 1.5 + mod(float(s) * 3.7 - uCamZ, 44.4);
        float sn = snowAt(s, zz, qF.x, qF.y, thr + 0.55 * uFin * (1.0 - 0.7 * float(s) / 11.0));
        if (zz > 14.0) accF += sn; else accN += sn;
      }
    }
    float flakeK = 0.65 + 0.9 * uLight;
    colA += FLAKE * (accF + accN) * flakeK * 0.28;
    col = colA;
    // --- myrskyn sisus (vedos 5): pintakerros = neljä lumiverhoa, takana horisontti, metsän massa ja jää ---
    if (uWi > 0.0) {
      vec2 qw = vortexWarp(vortexWarp(vortexWarp(q0, uV0, uSp.x), uV1, uSp.y), uV2, uSp.z);
      float eyeK = 1.0 - 0.75 * min(gEye, 1.0);
      vec3 c = base0;
      for (int j = 0; j < 2; j++) { vec4 v = curtain(j, qw, dy); c = mix(c, v.rgb, v.a); }
      c += FLAKE * accF * flakeK * eyeK;
      for (int j = 2; j < 4; j++) { vec4 v = curtain(j, qw, dy); c = mix(c, v.rgb, v.a); }
      c += FLAKE * (accN * (0.8 + 0.9 * uInt) + accF * 0.45 * (0.6 + 1.0 * uInt)) * flakeK * eyeK;   // myös kaukaiset hiutaleet näkyvät verhojen läpi; lumen kontrasti kasvaa tason mukana
      // iskuaalto: Q:ssa maata pitkin (litteä rengas), R:ssä koko kuvan yli (jälkiaalto)
      if (uSh.w > 0.001) {
        vec2 sd = vec2(dx - uSh.x, (dy - uSh.y) * uShF);
        float ring = exp(-pow((length(sd) - uSh.z) / (0.035 + 0.10 * uSh.z), 2.0)) * uSh.w;
        c += HALLA * 0.075 * ring * (dy < 0.0 ? 1.0 : 0.55);
      }
      col = mix(colA, c, uWi);
    }
    // vedos 6: vaskien huuto valaisee lumen leikkauksen ympäriltä (lumi on jo kuvassa; valo vain kirkastaa sen)
    for (int i = 0; i < 6; i++) {
      vec4 k = uK[i];
      if (k.y > 0.002 && k.w < 0.5) col += FLAKE * (accF + accN) * (0.65 + 0.9 * uLight) * k.y * 3.2 * exp(-abs(dx - k.x) / (0.10 + 14.0 * k.z));
    }
  } else {
    col = vec3(0.0);
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
  // --- vedos 6: vaskien fraasin toistot. Huuto: kapea kylmä pystyvalo (sama ele kuin Q ja R), maa tärähtää valona; viimeinen takominen:
  //     neljä taivaan korkuista valon seinämää, jotka repeävät myrskyn seinän läpi, ja neljännellä koko kuva valossa ---
  if (uFin < 1.0) {
    for (int i = 0; i < 6; i++) {
      vec4 k = uK[i], l = uL[i];
      if (k.y < 0.002) continue;
      float fi = float(i);
      if (k.w < 0.5) {
        float jag = (vnoise(vec2(p.y * 6.0 + fi * 3.1, 3.0)) - 0.5) * 0.004;
        float d = abs(dx - k.x - jag), w = k.z;
        // vedos 7: huudon laaja valo ei peitä metsän reunaa (kaista pysyy tummana); ohut ydin kulkee reunan yli
        float rgm = smoothstep(0.004, -0.001, dy - ridgeFar(p.x)) * smoothstep(-0.040, -0.006, dy);
        float peit = 1.0 - 0.85 * rgm;
        float beam = exp(-d * d / (w * w)) * (0.9 + 0.2 * vnoise(vec2(p.y * 14.0 + fi, 1.0))) + peit * (0.30 * exp(-d / (10.0 * w)) + 0.10 * exp(-d / (0.32 + 20.0 * w)));
        col += LEIKKAUS * k.y * beam * 1.7;
        col += peit * LEIKKAUS * 0.16 * k.y * exp(-d / (0.05 + 9.0 * w)) + HALLA * 0.060 * k.y * (0.25 + 0.25 * exp(-abs(dy) / 0.12)) * (0.6 + 40.0 * w);   // vedos 7: huudon valo ei vaalenna horisontin kaistaa (metsänreuna ei katoa iskussa)
        if (dy < 0.0) {
          float rr = 0.50 * l.x, ring = exp(-pow((length(vec2(dx - k.x, dy * 3.2)) - rr) / (0.04 + 0.08 * rr), 2.0));
          col += HALLA * 0.10 * ring * k.y * exp(-l.x / 0.5) + LEIKKAUS * 0.10 * k.y * exp(-d / (0.12 + 10.0 * w)) * smoothstep(0.0, -0.12, dy);
        }
      } else {
        // vedos 7: pehmeäreunainen valoseinä (gaussinen vaakaprofiili, ei rosoa); huippu pehmeästi rajattu, ettei mikään leikkaudu valkoiseksi
        float d = abs(dx - k.x), W = k.z;
        float wall = exp(-d * d / (2.0 * 0.55 * 0.55 * W * W));
        float up = 0.75 + 0.25 * smoothstep(0.0, 1.0, p.y);
        float amp = k.y / (1.0 + 0.22 * k.y * k.y);
        vec3 add = LEIKKAUS * amp * (0.95 * wall * up + 0.30 * exp(-d / (3.0 * W)) * 0.55 * min(k.y, 1.0));
        col += min(add, max(vec3(1.08) - col, 0.0));
      }
    }
    col += min(LEIKKAUS * 0.10 * uFlash * (0.90 + 0.20 * vnoise(vec2(dx * 6.0, dy * 6.0))), max(vec3(1.08) - col, 0.0));
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
  d.vaadi('myrsky_aksentti_537', 'hiljaisuus_2_alku', 'myrsky_nakyy', 'hiljaisuus_2_loppu', 'myrsky_kasvu', 'myrsky_iskee', 'Q_koko_metsa', 'myrsky_huippu', 'R_vasket', 'toinen_paisunta', 'huuto');
  const T0 = A.hiljaisuus_2_alku, T1 = A.myrsky_nakyy, T2 = A.hiljaisuus_2_loppu, T3 = A.myrsky_kasvu, T4 = A.myrsky_iskee;
  const T5 = A.Q_koko_metsa, T6 = A.myrsky_huippu, T7 = A.R_vasket, T8 = A.toinen_paisunta, T9 = A.huuto;
  const FPS = d.FPS;
  const kohta = d.kohta;

  // --- äänestä mitatut hitaat signaalit (keskiarvo vähintään 0,3 s) ---
  const voima = (t) => d.koko(t, 0.7);                 // koko orkesterin voima (mittaus)
  const matala = (t) => d.matala(t, 0.6);
  const kalpea = (t) => d.pitka(t, 1.6);               // teoksen pitkä ääni (fis): horisontin kalpea valo

  // uusien sävelten tiheys (nuottia/s): ylä- ja keskirekisterin alut, d.nuotit
  const NR = new Float32Array(d.NF + 2);
  for (const n of d.nuotit) { const f = Math.floor(n[0] * FPS); if (f >= 0 && f < d.NF && n[2] >= 48 && n[2] <= 100) NR[f] += 1; }
  const sNR = d.sarja((f) => NR[f]);
  const nuotteja = (t, w) => d.ka(sNR, clamp(t, 0, d.NF / FPS) * FPS, w * FPS) * FPS;
  // jousten taso: keski- ja ylärekisteri sekä liiketiheys
  const jousi = (t, w) => 0.5 * d.keski(t, w) + 0.3 * d.korkea(t, w) + 0.2 * clamp(nuotteja(t, w + 0.3) / 38, 0, 1);
  // äänen taso dBFS (analysis/korvat.py, sekunnin tarkkuus) kuuntelukopiosta: kattaa koko dynamiikka-alueen (-51 ... -17 dBFS), myös hiljaiset kohdat
  const hakemisto = d.cues.ohjaus.spektri.tiedosto.replace(/[^/]*$/, '');
  const korvat = await (await fetch('/' + hakemisto + 'korvat.json')).json();
  const dBs = korvat.sekunnit.map((x) => x.taso_dbfs);
  const dBat = (t) => { const x = clamp(t - 0.5, 0, dBs.length - 1.001), i = Math.floor(x); return lerp(Math.max(dBs[i], -60), Math.max(dBs[i + 1], -60), x - i); };
  const taso = (t, w) => { let a = 0, n = 0; for (let o = -w; o <= w + 1e-6; o += w / 3) { a += dBat(t + o); n++; } return clamp((a / n + 52) / 36, 0, 1); };   // 0 = -52 dBFS, 1 = -16 dBFS
  // myrskyn intensiteetti 0..1: taso (0,9 s keskiarvo) + fraasin nousu ja lasku (nopea miinus hidas keskiarvo): puuskat
  const INT = (t) => clamp(0.55 * taso(t, 1.2) + 0.25 * clamp((jousi(t, 0.9) - 0.05) / 0.85, 0, 1) + 0.20 * clamp(nuotteja(t, 1.0) / 38, 0, 1) + 1.6 * (jousi(t, 0.5) - jousi(t, 3.0)), 0, 1);

  // --- kamera: tasainen hidas ajo, vauhti kasvaa vain suuressa käänteessä (jousten voimistuminen kasvusta Q:hun) ---
  const nopeus = (t) => 0.70 + 1.5 * sstep(T3, T5, t) * (1 - 0.55 * sstep(T7, T8, t));
  const kZ = d.sarja((f) => nopeus(f / FPS) / FPS);
  const kX = d.sarja((f) => 0.30 * nopeus(f / FPS) / FPS);          // viisto eteneminen: parallaksi
  const kZ0 = kohta(kZ, T0), kX0 = kohta(kX, T0);

  // --- jousten aksentit välillä myrsky_kasvu -> myrsky_iskee: myrsky ottaa askeleen. Nimetty ankkuri + mitatut nousut (>= 4 dB / 0,2 s = 0,1 d.koko-asteikolla) ---
  const aksentit = [{ t: A.myrsky_aksentti_537, w: 1.0 }];   // pieni (mitattu) saa painon 0,6
  {
    const nousu = (t) => d.koko(t + 0.1, 0.05) - d.koko(t - 0.1, 0.05);
    let paras = null;
    const loydetyt = [];
    for (let t = T3 + 2.5; t < T4 - 0.3; t += 1 / FPS) {   // crescendon oma jyrkkä alku (T3...T3+2,5) ei ole aksentti
      const r = nousu(t);
      if (r >= 0.06) { if (paras && t - paras.t < 0.8) { if (r > paras.r) { paras.r = r; paras.t = t; } } else { paras = { t, r }; loydetyt.push(paras); } }
    }
    for (const e of loydetyt) if (Math.abs(e.t - A.myrsky_aksentti_537) > 0.8) aksentit.push({ t: e.t, w: 0.6 });
  }
  const askel = (t) => aksentit.reduce((s, e) => s + e.w * sstep(e.t - 0.05, e.t + 0.35, t), 0);       // kertynyt askel (osuus)
  const AW = aksentit.reduce((s, e) => s + e.w, 0);
  const askelOsuus = (t) => clamp(askel(t) / AW, 0, 1);   // aksenttien kertynyt askel (0..1): jää voimaan
  const aks = (t) => aksentit.reduce((s, e) => { const x = t - e.t; return s + (x < 0 ? 0 : e.w * (1 - Math.exp(-x / 0.06)) * Math.exp(-x / 0.9)); }, 0);   // puuska ja välähdys, joka laskee hitaasti

  // koneen kuulemat aksentit (d.aksentit) myrskyn sisällä: jokainen on pieni puuska (tuuli, lumen pöllähdys, valo), ei leikkausta
  const pienet = d.aksentit.filter((e) => e.t > T4 + 2 && e.t < T8 - 1 && e.v >= 0.45 && Math.abs(e.t - T5) > 0.4 && Math.abs(e.t - T6) > 0.4 && Math.abs(e.t - T7) > 0.4);
  const aks2 = (t) => pienet.reduce((s0, e) => { const x = t - e.t; return s0 + (x < 0 || x > 5 ? 0 : 0.6 * e.v * (1 - Math.exp(-x / 0.08)) * Math.exp(-x / 1.1)); }, 0);

  // --- myrskyn lähestyminen: jousten voiman kertymä, joka on tasan 1 ankkurissa myrsky_iskee (säilyy vedoksesta 4) ---
  const rate = (t) => 0.02 + Math.pow(d.koko(t, 1.0), 1.5);
  const kU = d.sarja((f) => rate(f / FPS) / FPS);
  const uOf = (t) => clamp((kohta(kU, t) - kohta(kU, T1)) / (kohta(kU, T4) - kohta(kU, T1)) * (1 - 0.30) + 0.30 * clamp(askel(t) / AW, 0, 1), 0, 1);   // askeleet (14 % matkasta) syöksähtävät aksenteissa, loppu jatkuu tasaisesti ankkuriin myrsky_iskee
  const wiOf = (t) => sstep(0.55, 1.0, uOf(t));

  // --- nousu ---
  const nousuK = (t) => sstep(T8, T9, t);                          // kameran nousu
  const ylos = (t) => sstep(T8 + 0.8, T8 + 3.2, t);               // virtaus kääntyy ylöspäin (jousten nouseva asteikko)
  const korkeus = (t) => 1.7 + 70 * Math.pow(nousuK(t), 2);
  const horisontti = (t) => 0.31 - 0.14 * nousuK(t);

  // --- vedos 6: vaskien fraasin toistot, tarkat alut (d.cues.alut): jokainen kuvan tapahtuma alkaa alun ruudussa täydellä voimalla ---
  const fr = (t) => Math.round(t * FPS);
  const aluissa = (lo, hi, vmin, kaistat) => {            // alut ikkunassa, kaistat yhdistettynä (alle 0,1 s eroavat yhdeksi)
    const out = [];
    for (const k of kaistat) for (const [ta, v] of d.cues.alut[k]) if (ta >= lo && ta <= hi && v >= vmin) out.push({ t: ta, v });
    out.sort((a, b) => a.t - b.t);
    const m = [];
    for (const e of out) { const e0 = m[m.length - 1]; if (e0 && e.t - e0.t < 0.1) e0.v = Math.max(e0.v, e.v); else m.push({ ...e }); }
    return m;
  };
  const HUUTO_X = [[-0.38, 0.30], [0.18, 0.18], [-0.12, -0.12]], HUUTO_A = [0.85, 1.0, 1.2], HUUTO_W = [0.0030, 0.0050, 0.0080];
  const TAKO_X = [-0.72, 0.72, -0.36, 0.36, 0.0], TAKO_W = [0.070, 0.080, 0.090, 0.100, 0.180];   // vedos 7: viisi valoseinää reunoilta keskelle
  const TAKO_A = [0.70, 0.78, 0.86, 0.94, 1.50], TAKO_TAU = [0.13, 0.13, 0.13, 0.13, 1.8];          // viides: levein, kirkkain, jää soimaan (dim.)
  const HUUDOT = [], TAKO = [];
  for (let k = 1; k <= 3; k++) {
    const ta = A['vasket_myrsky_' + k];
    aluissa(ta - 0.3, ta + 1.5, 0.45, ['matala', 'keski']).forEach((e, i) =>
      HUUDOT.push({ f: fr(e.t), x: HUUTO_X[k - 1][Math.min(i, 1)], a: HUUTO_A[k - 1] * clamp(e.v / 0.6, 0.6, 1), w: HUUTO_W[k - 1], k }));
  }
  {
    const cv = d.cues.cues.find((c) => c.id === 'vasket_takovat_viimeinen');
    cv.iskut_t.slice(0, 5).forEach((ti, i) => TAKO.push({ f: fr(ti), x: TAKO_X[i], w: TAKO_W[i], a: TAKO_A[i], tau: TAKO_TAU[i], i }));   // mitatut iskut sellaisenaan (Y4)
  }
  const F5 = TAKO.length === 5 ? TAKO[4].f : -1;
  // iskut hetkellä t: neljä paikkaa [x, voima, leveys, laji] ja [aika alusta]
  const huudot = (t) => {
    const f = fr(t), akt = [];
    for (const h of HUUDOT) { const ti = (f - h.f) / FPS; if (ti >= 0 && ti < 3) akt.push({ x: h.x, a: h.a * Math.exp(-ti / 0.30), w: h.w, laji: 0, ti }); }
    for (const h of TAKO) { const ti = (f - h.f) / FPS; if (ti >= 0 && ti < 4.5) akt.push({ x: h.x, a: h.a * Math.exp(-ti / h.tau) * (1 - sstep(2.5, 4.5, ti)), w: h.w * (1 + 0.8 * (1 - Math.exp(-ti / 0.08))), laji: 1, ti }); }
    akt.sort((p, q) => q.a - p.a);
    const K = new Float32Array(24), L = new Float32Array(24);
    akt.slice(0, 6).forEach((e, i) => { K.set([e.x, e.a, e.w, e.laji], i * 4); L.set([e.ti, 0, 0, 0], i * 4); });
    const sal = F5 >= 0 && f >= F5 ? Math.exp(-(f - F5) / FPS / 0.40) : 0;   // koko kuva valossa siirtyi neljänneltä viidennelle iskulle (viides on suurin)
    return { K, L, sal };
  };

  // --- tuuli ja putoaminen kertyminä; puuskat tulevat intensiteetistä, iskut antavat tuulenpuuskan (jatkuva nousu ja lasku) ---
  const huippuK = (t) => sstep(T6 - 4.0, T6 - 1.5, t) * (1 - sstep(T6 + 1.5, T6 + 4.0, t));
  const valkoinen = (t) => Math.max(huippuK(t), sstep(T8 + 2.8, T9 - 0.8, t));
  // vedos 7 (Y2): nopeus on tavoitteen epäsymmetrinen alipäästö (nousu tau 0,30 s = 10-90 % noin 0,66 s; lasku tau 0,80 s = noin 1,76 s);
  // iskut (Q ja R) eivät muuta lumen nopeutta (aks ja aks2 muuttavat, vedos 7b): ne näkyvät valona ja lumipölynä. Paikka on nopeuden kertymä (d.sarja).
  const alipaasto = (fn, tauYl, tauAl) => { const a = new Float32Array(d.NF + 2); let v = fn(0); for (let f = 0; f < d.NF + 2; f++) { const tg = fn(f / FPS); v += (tg - v) * (1 - Math.exp(-1 / FPS / (tg > v ? tauYl : tauAl))); a[f] = v; } return a; };
  const lue = (a, t) => { const x = clamp(t * FPS, 0, d.NF - 1e-3), i = Math.floor(x); return lerp(a[i], a[i + 1], x - i); };
  const tuuliTavoite = (t) => 0.02 + sstep(T3 - 1, T4 + 2, t) * (4 + 14 * INT(t) + 6 * huippuK(t)) * (1 - ylos(t));
  const putoamisTavoite = (t) => (0.06 + sstep(T3, T4 + 2, t) * (0.35 + 0.9 * INT(t))) * (1 - ylos(t)) - (9 + 4 * INT(t)) * ylos(t);
  const aTuuli = alipaasto(tuuliTavoite, 0.30, 0.80), aPutoaa = alipaasto(putoamisTavoite, 0.30, 0.80);
  // vedos 7b (rivi 104): myrskyn alun aksentti (aks, aks2) palautettu vedoksen 6 mukaiseksi: nopea nousu alipäästön ohi (vain nämä; Q ja R eivät)
  const tuulenNopeus = (t) => lue(aTuuli, t) + sstep(T3 - 1, T4 + 2, t) * (12 * aks(t) + 7 * Math.min(aks2(t), 1.5)) * (1 - ylos(t));
  const kW = d.sarja((f) => tuulenNopeus(f / FPS) / FPS);
  const putoamisNopeus = (t) => lue(aPutoaa, t);
  const kF = d.sarja((f) => putoamisNopeus(f / FPS) / FPS);

  // --- lumen tiheys ja viivojen pituus ---
  const tiheys = (t) => {
    const ulko = 0.035 + 0.50 * Math.pow(uOf(t), 1.3);
    const sisa = 0.22 + 0.70 * INT(t);
    return clamp(lerp(ulko, sisa, wiOf(t)) + 0.18 * nousuK(t) + 0.12 * askelOsuus(t) * (1 - sstep(T4, T4 + 3, t)) + 0.06 * Math.min(aks(t) + aks2(t), 1), 0, 0.92);
  };
  const viiru = (t) => sstep(T3, T4 + 1.5, t) * (0.55 + 0.45 * INT(t)) * (1 - 0.35 * ylos(t));

  // --- huippu: kaikki yhtä valkoista seinää (myrsky_huippu ympärillä noin 10 s), ja lopun nousussa LUMIn sävyyn ---

  // --- valo, huojunta ---
  const aMel = alipaasto((t) => clamp((d.melodia(t, 3.0) - 68) * 0.05, -0.55, 0.65), 2.0, 2.0);   // vedos 7 (Y2): kulma muuttuu hitaasti
  const huojunta = (t) => clamp(0.12 + 1.0 * jousi(t, 1.6) + 0.3 * sstep(T3, T4, t) + 0.4 * Math.min(aks(t), 1), 0, 1.4);   // aksentin puuska iskee latvoihin (taipuma pysyy kumipuusäännön rajoissa)
  const melKaari = (t) => lue(aMel, t) + 0.9 * ylos(t);   // tuulen suunta seuraa melodian kaarta; nousussa viirut pystyyn
  const valo = (t) => clamp(0.28 + 0.75 * INT(t) * sstep(T2 - 1, T3 + 1, t) + 0.5 * kalpea(t) + 0.30 * Math.min(aks(t), 1) + 0.25 * askelOsuus(t) * (1 - sstep(T4, T4 + 3, t)) + 0.15 * Math.min(aks2(t), 1), 0, 1.7);   // horisontin valo välähtää lumen läpi
  // vedos 7: basson lumi (horisontin peittyminen ja pöllähdys) on hidas liuku (alipäästö, nousu tau 1,0 s, lasku 1,2 s), joka ei ala eikä pääty iskun ruutuun
  const aPohja = alipaasto((t) => clamp(d.matala(t, 0.35) * sstep(T5 - 0.3, T5 + 0.3, t) * (1 - sstep(T8 - 2, T8, t)), 0, 1), 1.0, 1.2);
  const pohja = (t) => lue(aPohja, t);   // basso ja patarummut: maan lumi pöllähtää
  const rako = (t) => (1 - valkoinen(t)) * (0.75 + 0.25 * (1 - INT(t))) * sstep(T4 - 1, T4 + 2, t);      // puuskien raot: avautuvat, kun jouset hiljenevät; huipulla kiinni
  const poly = (t) => clamp(0.7 * aks(t) + 0.9 * aks2(t) + 0.5 * pohja(t), 0, 1.2);                        // lumi pöllähtää latvoista aksentissa
  const sulaa = (t) => sstep(T9 - 4.5, T9, t);
  const nakyvyys = (t) => sstep(T1 - 2.5, T1 + 3.5, t);

  // --- pyörteet: syntyvät puuskan huipussa (intensiteetin paikallinen maksimi) ja nimetyissä ankkureissa; kulkevat tuulen mukana hitaasti ---
  const hash1 = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const tapahtumat = [];
  {
    const lisaa = (huippu, syntyy, elin, vahvuus) => tapahtumat.push({ huippu, syntyy, elin, vahvuus });
    const ankkurit = [[T4, T4 - 1.5], [T5, T5 - 1.0], [T7, T7 - 1.0]];
    for (const [ta, sy] of ankkurit) lisaa(ta, sy, 15, 1);
    const dt = 0.1, a0 = T4 + 2, b0 = T8 - 3, arr = [];
    for (let t = a0; t <= b0; t += dt) arr.push([t, INT(t)]);
    const jarj = arr.map((x, i) => i).sort((i, j) => arr[j][1] - arr[i][1]);
    for (const i of jarj) {
      const t = arr[i][0], v = arr[i][1];
      if (v < 0.30) break;
      let ok = true;
      for (const e of tapahtumat) if (Math.abs(e.huippu - t) < 6.5) { ok = false; break; }
      for (let k = Math.max(0, i - 25); ok && k <= Math.min(arr.length - 1, i + 25); k++) if (arr[k][1] > v + 1e-6) ok = false;   // paikallinen huippu (+-2,5 s)
      if (ok) lisaa(t, t - 5, 14 + 3 * hash1(t), 0.8);
    }
    tapahtumat.sort((p, q) => p.syntyy - q.syntyy);
    { const vapaa = [-1e9, -1e9, -1e9]; tapahtumat.forEach((e) => { let k0 = vapaa.findIndex((v) => v <= e.syntyy); if (k0 < 0) k0 = vapaa.indexOf(Math.min(...vapaa)); e.slotti = k0; vapaa[k0] = e.syntyy + e.elin; }); }   // vedos 7: pyörteen paikka (slotti) on kiinteä koko sen eliniän: ei vaihdu envelopen järjestyksen mukana
    tapahtumat.forEach((e, i) => { e.merkki = i % 2 ? -1 : 1; e.x0 = -0.15 + 1.0 * hash1(i * 3.1 + 1); e.y0 = 0.00 + 0.30 * hash1(i * 5.3 + 2); e.R0 = 0.26 + 0.16 * hash1(i * 7.7 + 3); e.h = hash1(i * 2.3 + 4); });
  }
  const pyorteet = (t) => {
    const out = [0, 1, 2].map(() => ({ v: [0, 0, 0.1, 0], sp: 0, spF: 0, env: 0 }));
    for (const e of tapahtumat) {
      const k = (t - e.syntyy) / e.elin;
      if (k <= 0 || k >= 1) continue;
      const env = Math.pow(Math.sin(Math.PI * k), 2) * (1 - ylos(t));
      const vx = e.x0 - 0.0065 * (kohta(kW, t) - kohta(kW, e.syntyy));
      const vy = e.y0 + 0.035 * Math.sin(2 * Math.PI * (0.5 * k + e.h));
      const hiipuu = sstep(0, 0.25, env);   // vedos 7 (Y2): kiertymä hiipuu pehmeästi nollaan pyörteen voiman mukana (ennen: kiertymä katkesi yhdessä ruudussa, kun voima alitti 1e-3)
      const uusi = ({ v: [vx, vy, e.R0 * (0.65 + 0.9 * k), e.merkki * e.vahvuus * (0.6 + 0.4 * e.h) * env], sp: e.merkki * Math.min(0.08 * (t - e.syntyy), 0.8) * hiipuu, spF: e.merkki * Math.min(0.16 * (t - e.syntyy), 1.6) * hiipuu, env });
      if (uusi.env >= out[e.slotti].env) out[e.slotti] = uusi;
    }
    return out;
  };

  // --- pystyvalot: vain nimetyt iskut (d.iskut: Q_koko_metsa, R_vasket; huippu korvattu takomisalun seinämillä) ---
  const ISKUT = [[T5, 0.38], [T7, 0.14]];   // vedos 6: huipun (T6) yksittäinen leikkaus korvataan neljän takomisalun seinämillä (TAKO, alla)
  const valoLeikkaus = (t) => {
    let k = 0, x = 0, paljas = 0;
    for (const [ta, xs] of ISKUT) {
      const ti = t - ta; if (ti < 0 || ti > 3) continue;
      const v = Math.exp(-ti / 0.32) + 0.45 * (ti > 0.20 ? Math.exp(-(ti - 0.20) / 0.10) : 0);
      if (v > k) { k = v; x = xs; paljas = (1 - Math.exp(-ti / 0.12)) * Math.exp(-ti / 0.55); }
    }
    return [x, Math.min(k, 1.2), paljas];
  };
  // iskuaalto: Q (maata pitkin, litteä) ja R (koko kuvan yli): rengas laajenee, ei liikuta mitään
  const aalto = (t) => {
    const qx = t - T5, rx = t - T7;
    if (qx >= 0 && qx < 4.5) return [0.38, -0.02, 0.05 + 0.50 * qx, 1.0 * Math.exp(-qx / 1.6) * (1 - Math.exp(-qx / 0.08)), 3.2];
    if (rx >= 0 && rx < 5.5) return [0.14, 0.12, 0.05 + 0.60 * rx, 1.0 * Math.exp(-rx / 2.0) * (1 - Math.exp(-rx / 0.08)), 1.0];
    return [0, 0, 0, 0, 1];
  };

  const { gl, U, piirra } = luoGL(FS);

  const tila = (t) => {
    const tc = clamp(t, T0, T9);
    const u = uOf(tc);
    const wi = wiOf(tc);
    const [cx, ck, cr] = valoLeikkaus(tc);
    return {
      tc, u, wi, tiheys: tiheys(tc), viiru: viiru(tc), valo: valo(tc), nak: nakyvyys(tc),
      camZ: kohta(kZ, tc) - kZ0, camX: kohta(kX, tc) - kX0, camH: korkeus(tc), hor: horisontti(tc),
      tuuli: kohta(kW, tc), putoaa: kohta(kF, tc),
      pyorteet: pyorteet(tc), int: INT(tc) * wi + 0.5 * (1 - wi), valk: valkoinen(tc), ylos: ylos(tc), pohja: pohja(tc), aalto: aalto(tc),
      cut: [cx, ck, cr], fin: sstep(T9 - 2.4, T9, tc), rako: rako(tc), poly: poly(tc), sulaa: sulaa(tc), vW: tuulenNopeus(tc), vF: putoamisNopeus(tc), sway: huojunta(tc), wang: melKaari(tc), hh: huudot(t),
    };
  };

  // mittausta varten: mitä ääni ohjaa hetkellä t
  const kuvaus = (t) => {
    const s = tila(t);
    return { t: +t.toFixed(2), u: +s.u.toFixed(3), sisus: +s.wi.toFixed(2), tiheys: +s.tiheys.toFixed(2), viiru: +s.viiru.toFixed(2),
      aksentti: +aks(t).toFixed(2), intensiteetti: +INT(t).toFixed(2), jousi: +jousi(t, 0.9).toFixed(2), nuotteja_s: +nuotteja(t, 0.9).toFixed(1),
      voima: +voima(t).toFixed(2), matala: +matala(t).toFixed(2), valo: +s.valo.toFixed(2), nakyvyys: +s.nak.toFixed(2),
      vauhti: +nopeus(t).toFixed(2), matka: +s.camZ.toFixed(1), korkeus: +s.camH.toFixed(1), horisontti: +s.hor.toFixed(3),
      pyorteet: s.pyorteet.filter((p) => Math.abs(p.v[3]) > 0.02).map((p) => [+p.v[0].toFixed(2), +p.v[1].toFixed(2), +p.v[2].toFixed(2), +p.v[3].toFixed(2)]),
      pyo_raw: s.pyorteet.map((p) => [+p.v[0].toFixed(3), +p.v[1].toFixed(3), +p.v[2].toFixed(3), +p.v[3].toFixed(3), +p.sp.toFixed(3), +p.spF.toFixed(3)]),
      valkoinen: +s.valk.toFixed(2), ylos: +s.ylos.toFixed(2), leikkaus: +s.cut[1].toFixed(2), loppu: +s.fin.toFixed(2), poly: +s.poly.toFixed(3), rako: +s.rako.toFixed(3), uint: +s.int.toFixed(3), aks2: +aks2(t).toFixed(3), aks: +aks(t).toFixed(3), pohja: +s.pohja.toFixed(3), huojunta: +s.sway.toFixed(2), vW: +s.vW.toFixed(3), vF: +s.vF.toFixed(3), kulma: +(Math.atan2(s.vF * 0.85, s.vW * 0.6) * 180 / Math.PI).toFixed(2), wang: +s.wang.toFixed(3) };
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
      gl.uniform1f(U('uStreak'), s.viiru); gl.uniform1f(U('uFin'), s.fin); gl.uniform1f(U('uSway'), s.sway); gl.uniform1f(U('uWAng'), s.wang);
      gl.uniform1f(U('uInt'), s.int); gl.uniform1f(U('uWhite'), s.valk); gl.uniform1f(U('uUp'), s.ylos); gl.uniform1f(U('uBass'), s.pohja);
      const P = s.pyorteet;
      gl.uniform4f(U('uV0'), ...P[0].v); gl.uniform4f(U('uV1'), ...P[1].v); gl.uniform4f(U('uV2'), ...P[2].v);
      gl.uniform3f(U('uSp'), P[0].sp, P[1].sp, P[2].sp); gl.uniform3f(U('uSpF'), P[0].spF, P[1].spF, P[2].spF);
      gl.uniform1f(U('uWindV'), s.vW); gl.uniform1f(U('uFallV'), s.vF); gl.uniform1f(U('uMelt'), s.sulaa); gl.uniform1f(U('uGap'), s.rako); gl.uniform1f(U('uPuff'), s.poly);
      gl.uniform4f(U('uSh'), s.aalto[0], s.aalto[1], s.aalto[2], s.aalto[3]); gl.uniform1f(U('uShF'), s.aalto[4]);
      gl.uniform4f(U('uCut'), s.cut[0], s.cut[1], s.cut[2], 0);
      gl.uniform4fv(U('uK'), s.hh.K); gl.uniform4fv(U('uL'), s.hh.L); gl.uniform1f(U('uFlash'), s.hh.sal);
      piirra();
    },
  });
  if (new URLSearchParams(location.search).get('kuvaus')) {
    const dt = Number(new URLSearchParams(location.search).get('kuvaus')) || 2;
    console.log(JSON.stringify({ huudot: HUUDOT, tako: TAKO, aksentit, tapahtumat: tapahtumat.map((e) => ({ huippu: +e.huippu.toFixed(1), syntyy: +e.syntyy.toFixed(1), elin: +e.elin.toFixed(1) })) }));
    for (let t = T0; t <= T9 + 0.01; t += dt) console.log(JSON.stringify(kuvaus(t)));
  }
}
alusta().catch((e) => { console.error(e); window.sceneError = String(e.message || e); });
