// Tapiola: maailma 5 (Väike), `pohja_katoaa` -> `pohja_vaihtuu_D`. Moduuli: visual/maailma_05.js, sivu visual/maailma.html?m=05.
// Alkaa rajakuvasta HUURRE (vaalea huurrepinta aivan läheltä) ja päättyy rajakuvaan JAA (musta jään pinta).
// Suunnitelma: docs/kuvakasikirjoitus.md "Maailma 5. Väike"; säännöt: docs/visuaalinen_tyyli.md luvut 1, 2, 4d, 7b, 12.
//
// Maailma: huurteen kiteen sisäpuoli. Kamera leijuu sinisessä hämärässä ja kulkee tasaisesti eteen laaksoa pitkin, jonka
// molemmin puolin nousevat tykkylumen pyöristämät harjanteet kerroksittain usvaan. Harjanteet ovat metsä (tumma massa, latvat
// ottavat kylmän valon reunaansa, alaosa on harva ja liukenee usvaan). Ei maata: harjanteet leijuvat. Laakson päässä
// horisontissa on kiteen läpi tuleva valo (pitkä ääni). Siemenen kuva: horisontin valo, alla tumma massa, sileät kummut, lumi.
// Ääni: pitkä e / viulujen matto on kiteen valo; jousten intensiteetti on harjanteiden tummuus; pohja (matala rekisteri)
// on harjanteiden alaosan massa; basson askeleet nostavat valon alhaalta harjanteiden alapintaan; lyhyet korkeat äänet ovat
// väikettä (pisteitä, jotka vaihtavat paikkaa ja jättävät polun); pitkät sidotut äänet sytyttävät latvan reunan säikeeksi;
// kolme linnaa (puinen, luinen, kivinen) ovat kuusi-ikkunaisia kumpuja, joiden ikkunat syttyvät rekisterin mukaan.
// Loppu: kide sulaa pisaraksi, pisara putoaa, musta jään pinta täyttää kuvan.
// Kohtaus on puhdas aikafunktio seek(t): kertymät lasketaan alussa, ei satunnaisuutta, ei ajastimia.
import { lataa, luoGL, julkaise, FS_ALKU, GLSL_YHTEINEN, FS_LOPPU, RAJA, clamp, smooth, sstep, fract, lerp } from './yhteinen.js';

const FS = FS_ALKU + `
uniform float uSway, uNear;
uniform float uTime, uCamX, uCamY, uCamZ, uPitch, uYc, uGlow, uCore, uHorE, uDark, uBottom, uLeg, uVeil, uMelt, uFogL, uIceW, uIceY, uEnd, uDropA, uUrk, uTwk;
uniform vec4 uDrop;       // pisara: x, y, z, säde
uniform vec4 uLow[6];     // basson askeleet: ikä, voima
uniform vec4 uCas[3];     // linna: z, x, korkeus, siemen
uniform float uWin[18];   // linnojen ikkunat (3 x 6)
uniform vec4 uSA[24];     // väike: alkupiste x, y, loppupiste x, y (maailman metrit)
uniform vec4 uSB[24];     // väike: z, ikä (s), voima, -
uniform int uNS;
uniform vec4 uFA[32];     // keijuvalo: x, y (kuvan paikka), ikä (s), voima
uniform vec4 uFB[32];     // keijuvalo: elinaika, häivytys, laji, -
uniform vec4 uFC[32];     // keijuvalo: edellisen valon paikka (polku)
uniform int uNF;
uniform float uRise;      // F:n pimeys nousee alhaalta (0..1)
uniform vec2 uSnow;       // lumen kertymä: sivu, putoaminen (m)
const float F = 1.07, DEL = 20.0;
const int NL = 14;
const vec3 VOID = vec3(0.0016, 0.0030, 0.0052);
const vec3 SILV = vec3(0.80, 0.86, 0.95);

float xcf(float z) { return 7.0 * sin(z * 0.011 + 0.6) + 3.5 * sin(z * 0.027 + 2.0); }     // laakson keskiviiva
float layerZ(float n) { return n * DEL + (hash(vec2(n, 3.1)) - 0.5) * 8.0; }
// pyöreät lohkareet: parabolisia kumpuja, joiden välissä pehmeä sola (tykkylumen painamat latvat)
float bumps(float x, float cell, float sd) {
  float c = floor(x / cell), m = 0.0;
  for (int j = -1; j <= 1; j++) {
    float ci = c + float(j), h = hash(vec2(ci, sd));
    float xi = (ci + 0.2 + 0.6 * hash(vec2(ci, sd + 3.1))) * cell, w = cell * (0.55 + 0.7 * hash(vec2(ci, sd + 7.3)));
    float q = clamp(1.0 - pow(abs(x - xi) / w, 2.0), 0.0, 1.0);
    m = max(m, (0.35 + 0.65 * h) * sqrt(q) * q);
  }
  return m;
}
float crestAt(float wx, float n, float zl, out float lm) {
  float sx = wx - xcf(zl) - 3.0 * (hash(vec2(n, 8.8)) - 0.5), u = abs(sx);
  float wall = (sx < 0.0 ? 1.5 + 2.6 * vnoise(vec2(n * 0.37, 1.3)) : 1.5 + 2.6 * vnoise(vec2(n * 0.41, 7.7)));
  wall *= 0.6 + 0.8 * vnoise(vec2(wx * 0.02 + n * 1.7, n));
  float k = smoothstep(6.0, 60.0, u + 7.0 * (vnoise(vec2(n * 2.3, 4.0)) - 0.5));
  // pyöreät tykkylumilatvukset: leveitä pehmeitä möykkyjä erikokoisina ryhminä, ei korkeataajuista rosoa
  lm = 0.62 * bumps(wx, 14.0, n) + 0.38 * bumps(wx + 4.1, 6.5, n + 9.0);
  return -2.2 + wall * pow(k, 1.1) + (1.2 + 1.8 * k) * lm;
}
vec3 glowAt(float gx, float gy) {      // kiteen valo horisontissa: leveä vyö ja tiivis ydin (tan-avaruus)
  float up = max(gy - uHorE, 0.0), dn = max(uHorE - gy, 0.0);
  float prof = exp(-up / 0.085) * exp(-dn * dn / 0.012);                       // hehku nousee horisontin takaa: terävä alareuna, pitkä häntä ylös
  float band = prof * exp(-pow(gx / 1.0, 2.0));
  float wide = exp(-up / 0.30) * 0.10 * exp(-pow(gx / 1.4, 2.0));
  float core = exp(-pow(gx / 0.60, 2.0)) * exp(-up / 0.050) * exp(-dn * dn / 0.010);
  return HALLA * (uGlow * (0.55 * band + wide) + uCore * 1.15 * core);
}

// linna: kuusi-ikkunainen pyöreä kumpu; ainesta kolmea lajia (0 puu, 1 luu, 2 kivi)
vec4 castleAt(int ci, vec3 rd, float fogA) {
  vec4 cs = uCas[ci];
  float z = cs.x - uCamZ;
  if (z < 4.0 || rd.z <= 0.02) return vec4(0.0);
  float s = z / rd.z, wx = uCamX + rd.x * s, wy = uCamY + rd.y * s;
  float W = 9.5, yb = -5.0, u = (wx - cs.y) / W;
  if (abs(u) > 1.2) return vec4(0.0);
  float hD = cs.z * pow(max(1.0 - u * u, 0.0), 1.25) + 0.12 * vnoise(vec2(wx * 1.7, cs.w));
  float dd = yb + hD - wy;
  float ew = z / (F * uRes.y);
  float a = smoothstep(-ew, ew, dd) * step(0.001, hD) * exp(-pow(max(dd, 0.0) / (uBottom * 8.0 + 3.0), 1.5));
  if (a <= 0.0) return vec4(0.0);
  vec3 base; float tex;
  if (ci == 0) {         // puun syy: pitkiä, virtaavia pystyjuovia
    tex = smoothstep(0.42, 0.62, vnoise(vec2(wx * 2.6 + 3.0 * vnoise(vec2(wx * 0.3, wy * 0.12)), wy * 0.22)));
    base = HAMY * (1.5 + 1.5 * tex) + SALO * (0.10 + 0.20 * tex);
  } else if (ci == 1) {  // luun vaalea huokoisuus: vaaleita pintoja, pieniä tummia huokosia
    vec2 g = vec2(wx, wy) * 1.9; vec2 f = fract(g) - 0.5; float cell = hash(floor(g));
    tex = smoothstep(0.30, 0.20, length(f - 0.25 * (vec2(hash(floor(g) + 1.3), hash(floor(g) + 4.1)) - 0.5))) * step(0.35, cell);
    base = (SALO * 0.45 + HALLA * 0.011) * (1.0 - 0.7 * tex);
  } else {               // kiven tumma kide: suuria tasoja, joilla eri sävy
    float fc = floor(wx * 0.55 + wy * 0.28 + 0.4 * sin(wy * 0.35));
    tex = hash(vec2(fc, cs.w));
    base = HAMY * (0.9 + 0.8 * tex) + SALO * 0.07 * tex;
  }
  float rim = exp(-max(dd, 0.0) / 0.9);
  vec3 tone = base * (1.0 - 0.45 * uDark) + HALLA * (0.05 + 0.16 * uGlow) * rim * (1.0 - 0.4 * uDark);
  // kuusi ikkunaa: kaksi riviä, kolme saraketta; syttyvät rekisterin mukaan, eivät koskaan kaikki yhtä aikaa
  for (int i = 0; i < 6; i++) {
    float r = float(i / 3), c = float(i % 3);
    vec2 wp = vec2(cs.y + W * (-0.40 + 0.40 * c), yb + cs.z * (0.30 + 0.27 * r));
    vec2 q = (vec2(wx, wy) - wp) / vec2(0.55, 0.85);
    float ww = uWin[ci * 6 + i];
    tone += SILV * ww * (0.02 + 1.7 * exp(-pow(dot(q, q), 2.0)) + 0.20 * exp(-dot(q, q) * 0.25));
  }
  tone = mix(tone, SALO * (0.5 + 0.9 * uGlow), fogA);
  return vec4(tone, a * (1.0 - smoothstep(170.0, 215.0, z)) * smoothstep(30.0, 75.0, z));
}

// väike: kiihtyvä piste, joka siirtyy paikasta A paikkaan B ja jättää polun, joka himmenee
vec3 sparkAt(int i, vec3 rd, float fogA) {
  vec4 A = uSA[i], B = uSB[i];
  float z = B.x - uCamZ;
  if (z < 4.0 || rd.z <= 0.02) return vec3(0.0);
  float s = z / rd.z, wx = uCamX + rd.x * s, wy = uCamY + rd.y * s;
  float mv = smoothstep(0.0, 0.20, B.y);                     // kärki ehtii perille 0,2 s:ssa
  vec2 a = A.xy, b = A.xy + (A.zw - A.xy) * mv, pq = vec2(wx, wy);
  vec2 ba = b - a; float L2 = dot(ba, ba), h = L2 > 1e-6 ? clamp(dot(pq - a, ba) / L2, 0.0, 1.0) : 1.0;
  float dist = length(pq - (a + ba * h));
  float pix = z / (F * uRes.y);
  float wd = 0.07 + 0.9 * pix;
  float trail = exp(-B.y / 0.85) * smoothstep(0.0, 0.05, B.y) * (0.20 + 0.80 * h);     // polku: vanhin pää himmeämpi
  float head = exp(-B.y / 0.28) * smoothstep(0.0, 0.03, B.y);
  float line = exp(-pow(dist / wd, 2.0)) * trail * 0.10;
  float dh = length(pq - b);
  float pt = exp(-pow(dh / (wd * 2.2), 2.0)) * head * 1.6 + 0.10 * exp(-pow(dh / (wd * 9.0), 2.0)) * head;
  return SILV * B.z * (line + pt) * (1.0 - 0.6 * fogA);
}

// keijuvalot (nymfit): yksi mitattu ääni = yksi valo. Pehmeä hohtava ydin (noin 8 px), laajempi kehä, kylmä hopea, hidas häivytys.
// Valo hyppää edellisestä paikastaan uuteen (polku) ja valaisee hieman sen alla olevaa harjannetta.
vec3 fairyAt(vec2 p) {
  vec3 s = vec3(0.0);
  for (int i = 0; i < 32; i++) {
    if (i >= uNF) break;
    vec4 A = uFA[i], B = uFB[i], C = uFC[i];
    float age = max(A.z, 0.0);
    float env = 1.0 - smoothstep(B.x, B.x + B.y, age);     // täysi kirkkaus alun ruudussa
    if (env <= 0.001) continue;
    float mv = 1.0;                                          // hyppy uuteen paikkaan samassa ruudussa
    vec2 cur = A.xy, prv = C.xy, hd = mix(prv, cur, mv);
    vec2 dd = p - hd; float r2 = dot(dd, dd);
    vec2 ba = cur - prv; float L2 = dot(ba, ba), tr = 0.0;
    if (L2 > 1e-7) { float h = clamp(dot(p - prv, ba) / L2, 0.0, mv); vec2 q = p - (prv + ba * h); tr = exp(-dot(q, q) / 0.000012) * 0.10 * (0.25 + 0.75 * h) * smoothstep(0.30, 0.0, age); }
    float core = exp(-r2 / 0.000016), halo = exp(-r2 / 0.00028), outer = exp(-r2 / 0.0040);
    float lit = exp(-dd.x * dd.x / 0.004) * exp(-pow((dd.y + 0.065) / 0.05, 2.0));   // harjanteen latva valon alla
    s += SILV * A.w * env * (1.7 * core + 0.32 * halo + 0.07 * outer + 0.07 * lit + tr);
  }
  return s;
}

// pisara: ylösalaisin kuva sisällä (taittuminen): horisontin valo alhaalla, tumma massa ylhäällä
vec3 dropShade(vec3 ro, vec3 rdn, out float cov) {
  cov = 0.0;
  vec3 oc = ro - uDrop.xyz; float b = dot(oc, rdn), c = dot(oc, oc) - uDrop.w * uDrop.w, h = b * b - c;
  if (h <= 0.0) return vec3(0.0);
  float t0 = -b - sqrt(h); if (t0 <= 0.0) return vec3(0.0);
  vec3 pos = ro + rdn * t0, nrm = (pos - uDrop.xyz) / uDrop.w;
  vec2 q = vec2(nrm.x, nrm.y);
  float edge = pow(1.0 - max(dot(-rdn, nrm), 0.0), 3.0);
  float top = 0.30 + 0.10 * sin(q.x * 6.5 + 1.0) + 0.06 * sin(q.x * 15.0);            // käännetty harjanne
  float mass = smoothstep(top - 0.02, top + 0.02, q.y);
  vec3 inner = HALLA * (0.75 * exp(-pow((q.y + 0.22) / 0.16, 2.0)) * (1.0 - 0.7 * q.x * q.x) + 0.10 * exp(-dot(q + vec2(0.0, 0.5), q + vec2(0.0, 0.5)) / 0.10)) * (1.0 - 0.9 * mass);
  inner += SALO * (0.4 + 0.6 * (1.0 - mass));
  vec3 refl = SILV * (0.9 * edge + 0.5 * exp(-dot(q - vec2(-0.35, 0.45), q - vec2(-0.35, 0.45)) / 0.012));
  cov = 1.0;
  return (inner + refl) * uDropA;
}
float dropHalo(vec3 ro, vec3 rdn, vec3 ctr) {
  vec3 oc = ctr - ro; float tt = max(dot(oc, rdn), 0.0); float d = length(oc - rdn * tt);
  return exp(-pow(d / (uDrop.w * 2.6), 2.0)) * 0.22 + exp(-pow(d / (uDrop.w * 9.0), 2.0)) * 0.05;
}

vec3 scene(vec2 p) {
  float asp = uRes.x / uRes.y;
  float dx = p.x - asp * 0.5, dyy = p.y - uYc;
  float cp = cos(uPitch), sp = sin(uPitch);
  vec3 rd = vec3(dx, sp * F + cp * dyy, cp * F - sp * dyy);
  vec3 ro = vec3(uCamX, uCamY, uCamZ), rdn = normalize(rd);
  float gx = rd.z > 0.02 ? rd.x / rd.z : 50.0, gy = rd.z > 0.02 ? rd.y / rd.z : (rd.y > 0.0 ? 50.0 : -50.0);
  // tausta: tyhjyys, kiteen valo horisontissa
  vec3 col = VOID * (0.6 + 1.2 * smoothstep(-0.5, 0.2, gy));
  col += glowAt(gx, gy);
  vec3 fogc = SALO * (0.50 + 0.80 * uGlow) * (1.0 + 1.5 * exp(-pow((gy - uHorE) / 0.16, 2.0)) * exp(-pow(gx / 2.2, 2.0)));
  // jään pinta: musta peili, vain lopussa
  float sIce = 1e9;
  if (uIceW > 0.0 && rd.y < -1e-4) {
    sIce = (uIceY - uCamY) / rd.y;
    vec3 hp = ro + rd * sIce;
    vec3 ic = vec3(0.004, 0.009, 0.016) * (0.8 + 0.5 * vnoise(vec2(hp.x * 0.4, hp.z * 0.4)));
    vec3 rr = normalize(vec3(rd.x, -rd.y, rd.z));
    float fr = pow(1.0 - clamp(-rdn.y, 0.0, 1.0), 4.0);
    ic += glowAt(rr.x / max(rr.z, 0.05), rr.y / max(rr.z, 0.05)) * 0.10 * (0.2 + fr) * smoothstep(0.0, 0.2, rr.z);
    vec3 mc = vec3(uDrop.x, 2.0 * uIceY - uDrop.y, uDrop.z);
    ic += SILV * dropHalo(hp, rr, mc) * 0.55 * uDropA;
    col = mix(col, ic, uIceW * smoothstep(0.0, 0.02, -rd.y));
  }
  // zs: lumihiutaleiden kuoret (hiutaleet kulkevat ohi kameran liikkeen mukana)
  float zs[10];
  for (int s = 0; s < 10; s++) zs[s] = 3.0 + mod(float(s) * 9.1 - uCamZ, 91.0);
  float zPrev = 1e5;
  float nlo = floor((uCamZ + 4.0) / DEL) - 2.0;     // ikkuna alkaa kameran takaa: lähin kerros ei katoa kesken kuvan
  float low = 0.0;
  for (int i = 0; i < 6; i++) low = max(low, uLow[i].y * exp(-uLow[i].x * 0.9) * smoothstep(0.0, 0.08, uLow[i].x));
  for (int i = NL - 1; i >= 0; i--) {
    float n = nlo + float(i);
    float zl = layerZ(n), z = zl - uCamZ;
    if (z < 3.0 || rd.z <= 0.02) continue;
    float s = z / rd.z;
    if (s > sIce) continue;
    float wx = uCamX + rd.x * s, wy = uCamY + rd.y * s;
    float fogA = 1.0 - exp(-z / uFogL);
    // väike ja linnat tämän kerroksen takana (kauempana kuin tämä, lähempänä kuin edellinen)
    for (int k = 0; k < 24; k++) { if (k >= uNS) break; float zk = uSB[k].x - uCamZ; if (zk > z && zk <= zPrev) col += sparkAt(k, rd, 1.0 - exp(-zk / uFogL)); }
    for (int c = 0; c < 3; c++) { float zc = uCas[c].x - uCamZ; if (zc > z && zc <= zPrev) { vec4 cc = castleAt(c, rd, 1.0 - exp(-zc / uFogL)); col = mix(col, cc.rgb, cc.a); } }
    for (int q = 0; q < 10; q++) if (zs[q] <= zPrev && zs[q] > z) {
      vec2 w2 = (vec2(wx, wy) * 0.0 + vec2(uCamX + rd.x * zs[q] / rd.z, uCamY + rd.y * zs[q] / rd.z) + uSnow) / 2.4 + float(q) * 17.3 + floor((float(q) * 9.1 - uCamZ) / 91.0) * 3.7;
      vec2 ic = floor(w2), fr = fract(w2); float hh = hash(ic);
      if (hh < 0.34 * (1.0 - 0.97 * smoothstep(20.0, 60.0, zs[q]))) { vec2 cc = 0.2 + 0.6 * vec2(hash(ic + 1.7), hash(ic + 5.1)); float dd2 = length(fr - cc) * 2.4, rr = 0.07 + 0.00045 * zs[q];
        float tw = 0.65 + 0.35 * sin(uTime * (0.7 + 2.0 * hash(ic + 9.0)) + hash(ic) * 40.0);
        col += HALLA * 0.34 * (0.25 + 0.75 * uGlow) * smoothstep(rr, rr * 0.2, dd2) * smoothstep(2.5, 7.0, zs[q]) * smoothstep(94.0, 70.0, zs[q]) * exp(-zs[q] / uFogL * 0.6) * mix(1.0, tw, uTwk); }
    }
    zPrev = z;
    // harjanne
    // tuuli: latvat huojuvat yhdessä, aalto kulkee harjanteen yli (luonnon liikettä, ei pomppua); amplitudi seuraa jousten intensiteettiä
    float lm; float lm0; float wxs = wx - uSway * (1.0 - smoothstep(35.0, 110.0, z)) * sin(wx * 0.05 - uTime * 0.55 + n * 1.3) * (0.4 + 0.6 * smoothstep(-2.0, 8.0, crestAt(wx, n, zl, lm0)));
    float crest = crestAt(wxs, n, zl, lm) + uNear * (1.0 - smoothstep(30.0, 150.0, z)) * (0.35 + 0.65 * lm);   // lähiharjanteet kohoavat kuvaan: etenemisen parallaksi
    float dd = crest - wy;
    float ew = z / (F * uRes.y);
    // massa: tumma latvaosa, jonka alla se liukenee vaaleaan usvaan (leijuu); pohjan palatessa massa ulottuu syvemmälle
    float Lb = mix(3.2, 15.0, uBottom) * (0.8 + 0.5 * vnoise(vec2(n * 1.1, wx * 0.02)));
    float a = smoothstep(-ew, ew, dd) * (1.0 - smoothstep(3.0 * Lb, 7.0 * Lb, dd));
    a *= 1.0 - smoothstep(170.0, 215.0, z);
    a *= smoothstep(3.0, 16.0, z);                                          // lähin kerros vaimenee pois pehmeästi (ei poksahdusta)
    a *= mix(1.0, smoothstep(5.0, 38.0, z), uMelt);                       // sulaessa lähimmät harjanteet muuttuvat usvaksi: kamera menee usvan läpi
    if (a <= 0.002) continue;
    float gapT = smoothstep(0.64, 0.82, vnoise(vec2(wx * 0.9, wy * 1.5 + n * 2.0))) * smoothstep(0.15, 0.8, dd) * (1.0 - smoothstep(2.5, 5.0, dd));   // valo siivilöityy latvojen välistä
    a *= 1.0 - 0.75 * gapT;
    float holes = smoothstep(0.55, 0.80, vnoise(vec2(wx * 0.22 + n * 3.0, wy * 0.35 + n * 5.1 + uTime * 0.12))) * smoothstep(0.8, 7.0, dd);   // alta harva
    a *= 1.0 - 0.75 * holes;
    float lv = (0.35 + 0.65 * smoothstep(0.25, 0.70, vnoise(vec2(wx * 0.05 + n * 2.9, n)))) * (0.6 + 0.6 * lm) * (0.75 + 0.25 * uSway * sin(wx * 0.11 - uTime * 1.6 + n));
    float rimW = 0.9 + 1.6 * lm;
    float rim = exp(-max(dd, 0.0) / rimW);
    vec3 dark = mix(HAMY, SALO * 0.20, 0.30) * (0.85 + 0.3 * vnoise(vec2(wx * 0.15, wy * 0.15 + n)));
    // huurteen kimallus latvan reunalla: kiteet, jotka ottavat valon
    vec2 sg = vec2(wx, wy) * 1.6 + n * 3.3; vec2 sc = floor(sg); float sh = hash(sc);
    float spk = step(0.94, sh) * smoothstep(0.20, 0.03, length(fract(sg) - 0.2 - 0.6 * vec2(hash(sc + 1.1), hash(sc + 2.7)))) * exp(-max(dd, 0.0) / 1.1);
    float side = 0.55 + 0.45 * exp(-pow((wx - xcf(zl)) / 36.0, 2.0));
    vec3 rimc = HALLA * (0.010 + 0.085 * uGlow * (1.0 - 0.45 * uDark)) * side * exp(-z / 110.0);
    vec3 tone = (dark * (1.0 - 0.40 * uDark)) + rimc * rim * lv + HALLA * 0.012 * spk * (0.35 + 0.65 * uGlow) * exp(-z / 130.0) * mix(1.0, 0.55 + 0.45 * sin(uTime * 0.9 + sh * 30.0), uTwk);
    vec3 mist = fogc * (0.30 + 0.45 * uGlow) * exp(-dd / (2.4 * Lb));
    tone = mix(tone, mist, smoothstep(0.5 * Lb, 1.6 * Lb, dd));          // alaosa: usva, joka pimenee syvyyteen
    // legato: latvan reuna syttyy yhtenäiseksi säikeeksi
    float lg = exp(-pow(dd / (0.05 + 0.0016 * z), 2.0)) * uLeg * smoothstep(18.0, 40.0, z) * smoothstep(190.0, 120.0, z) * step(0.55, hash(vec2(n, 6.6))) * smoothstep(0.35, 0.60, vnoise(vec2(wx * 0.035 + n * 5.0, n)));
    tone += SILV * 0.16 * lg;
    // basson askel: valo alhaalta harjanteiden alapintaan
    tone += HALLA * 0.20 * low * exp(-pow((dd - 4.5) / 4.0, 2.0)) * smoothstep(0.0, 1.0, uBottom) * mix(0.15, 1.0, smoothstep(30.0, 120.0, z));   // lähiharjanteilla askel on vaimea (ei välähdä alaosaa)
    tone += HALLA * 0.10 * uUrk * exp(-pow((dd - 5.0) / 4.5, 2.0)) * smoothstep(0.0, 1.0, uBottom);
    tone = mix(tone, fogc, clamp(fogA, 0.0, 1.0));
    col = mix(col, tone, a);
  }
  // lähimmät: väike, linnat ja hiutaleet viimeisen kerroksen edessä
  for (int k = 0; k < 24; k++) { if (k >= uNS) break; float zk = uSB[k].x - uCamZ; if (zk <= zPrev) col += sparkAt(k, rd, 1.0 - exp(-max(zk, 1.0) / uFogL)); }
  for (int c = 0; c < 3; c++) { float zc = uCas[c].x - uCamZ; if (zc <= zPrev) { vec4 cc = castleAt(c, rd, 1.0 - exp(-max(zc, 1.0) / uFogL)); col = mix(col, cc.rgb, cc.a); } }
  for (int q = 0; q < 10; q++) if (zs[q] <= zPrev && rd.z > 0.02) {
    vec2 w2 = (vec2(uCamX + rd.x * zs[q] / rd.z, uCamY + rd.y * zs[q] / rd.z) + uSnow) / 2.4 + float(q) * 17.3 + floor((float(q) * 9.1 - uCamZ) / 91.0) * 3.7;
    vec2 ic = floor(w2), fr = fract(w2); float hh = hash(ic);
    if (hh < 0.34 * (1.0 - 0.97 * smoothstep(20.0, 60.0, zs[q]))) { vec2 cc = 0.2 + 0.6 * vec2(hash(ic + 1.7), hash(ic + 5.1)); float dd2 = length(fr - cc) * 2.4, rr = 0.07 + 0.00045 * zs[q];
      float tw = 0.65 + 0.35 * sin(uTime * (0.7 + 2.0 * hash(ic + 9.0)) + hash(ic) * 40.0);
      col += HALLA * 0.34 * (0.25 + 0.75 * uGlow) * smoothstep(rr, rr * 0.2, dd2) * smoothstep(2.5, 7.0, zs[q]) * smoothstep(94.0, 70.0, zs[q]) * exp(-zs[q] / uFogL * 0.6) * mix(1.0, tw, uTwk); }
  }
  // kirjain F: pimeys nousee alhaalta, ylhäällä ei mitään
  if (uRise > 0.001) { float rm = 1.0 - smoothstep(uRise * 0.85 - 0.35, uRise * 0.85, p.y); col *= 1.0 - 0.62 * rm * smoothstep(0.0, 0.05, uRise); }
  col += fairyAt(p);
  // pisara
  if (uDropA > 0.0) {
    float cov; vec3 dc = dropShade(ro, rdn, cov);
    col += HALLA * dropHalo(ro, rdn, uDrop.xyz) * uDropA;
    col = mix(col, dc, cov);
  }
  // alku: huurteen ulkokalvo. Kamera ajaa sen läpi: kalvo aukeaa keskeltä ulospäin ja sen kuvio suurenee (mittakaava jatkuva)
  if (uVeil < 1.0) {
    vec2 c0 = vec2(asp * 0.5, 0.40);
    float e = uVeil;
    float zr = 1.0 - 0.60 * e;
    vec2 pv = c0 + (p - c0) * zr;
    float rad = length((p - c0) * vec2(1.0, 1.15)) + 0.34 * (fbm(p * 2.6 + 3.0) - 0.45) + 0.08 * (fbm(p * 9.0 + 7.0) - 0.5);
    float R = mix(-0.55, 1.85, e);
    float va = smoothstep(R - 0.30, R, rad);
    vec3 vc = mix(rajakuva(pv, RAJA_HUURRE, uTime), vec3(0.30, 0.37, 0.50) * (0.72 + 0.55 * fbm(pv * 3.5 + uTime * 0.04)), smoothstep(0.0, 0.18, e));
    vc *= 1.0 + 0.45 * exp(-pow((rad - R) / 0.14, 2.0)) * smoothstep(0.0, 0.06, e);
    col = mix(col, vc, va);
  }
  // loppu: rajakuva JAA
  if (uEnd > 0.0) col = mix(col, rajakuva(p, RAJA_JAA, uTime), uEnd);
  return col;
}
`;

const GLSL_VAKIOT = `const int RAJA_HUURRE = ${RAJA.HUURRE}, RAJA_JAA = ${RAJA.JAA};\n`;
const FS_KOKO = FS_ALKU + GLSL_YHTEINEN + GLSL_VAKIOT + FS.slice(FS_ALKU.length) + FS_LOPPU;

// laakson keskiviiva (sama kaava kuin varjostimessa)
const xcf = (z) => 7.0 * Math.sin(z * 0.011 + 0.6) + 3.5 * Math.sin(z * 0.027 + 2.0);

async function alusta() {
  const d = await lataa();
  d.vaadi('pohja_katoaa', 'puhaltimet_staccato', 'D_pikkolo', 'e_pitka_ja_kuviot', 'askeleet_fis', 'nopea_liike_1_alku', 'nopea_liike_1_loppu', 'jannitesoinnut', 'pohja_vaihtuu_D');
  const A = d.aika, FPS = d.FPS, NF = d.NF;
  const T0 = A.pohja_katoaa, TST = A.puhaltimet_staccato, TD = A.D_pikkolo, TE = A.e_pitka_ja_kuviot, TS = A.askeleet_fis, TN0 = A.nopea_liike_1_alku, TN1 = A.nopea_liike_1_loppu;
  const TJ = A.jannitesoinnut, T1 = A.pohja_vaihtuu_D, SPAN = T1 - TJ;
  const sstep5 = (k) => { k = clamp(k, 0, 1); return k * k * k * (k * (k * 6 - 15) + 10); };   // smootherstep: nopeus ja kiihtyvyys nollassa päissä
  const TFALL = 8.6;                                   // pisaran laskun kesto (s)
  const TVEIL = 8.0;                                   // kalvon aukeamisen kesto (s): vähintään kolme sekuntia
  const F = 1.07;

  // ---- äänestä mitatut hitaat signaalit ----
  const nuotit = d.nuotit.filter((n) => n[0] >= T0 - 3 && n[0] <= T1 + 1);
  // uusien äänten tiheys (kertymä): kameran vauhti seuraa vain suuria muutoksia, hitaana keskiarvona
  const uudet = new Float32Array(NF); for (const n of nuotit) { const f = Math.floor(n[0] * FPS); if (f >= 0 && f < NF) uudet[f] += 1; }
  const sUus = d.sarja((f) => uudet[f]);
  let dMax = 1e-6; for (let t = T0; t <= T1; t += 0.5) dMax = Math.max(dMax, d.ka(sUus, t * FPS, 6 * FPS) * FPS);
  const tiheys = (t) => clamp(d.ka(sUus, t * FPS, 6 * FPS) * FPS / (0.8 * dMax), 0, 1);
  const V0 = 5.0;                                      // kierros 4: etenemisen pitää näkyä (vedoksessa 4 oli 2,6)
  const vauhti = (t) => V0 * (0.80 + 0.55 * tiheys(t)) * (1 - 0.85 * sstep(TJ + 0.45 * SPAN, TJ + 0.85 * SPAN, t));
  const sCz = d.sarja((f) => vauhti(f / FPS) / FPS);
  const camZ = (t) => d.kohta(sCz, clamp(t, 0, T1 + 5)) - d.kohta(sCz, T0);
  const camX = (t) => { const z = camZ(t); return xcf(z) + 2.0 * Math.sin(z * 0.023 + 1.0); };
  const ICEY = -24.0;
  const laskeutuminen = (t) => (ICEY + 2.3) * sstep(TJ + 0.50 * SPAN, T1 - 0.30, t);
  const camY = (t) => 2.0 + 0.5 * Math.sin(camZ(t) * 0.013) + laskeutuminen(t);
  const pitch = (t) => -1.45 * sstep(TJ + 0.46 * SPAN, T1 - 0.5, t);

  // pitkien sidottujen äänten (legato) määrä: kertymä pitkistä äänistä, joiden korkeus on 60-90
  const lg = new Float32Array(NF);
  for (const n of nuotit) if (n[1] >= 0.9 && n[2] >= 60 && n[2] <= 90) { const a = Math.floor(n[0] * FPS), b = Math.min(NF - 1, Math.floor((n[0] + n[1]) * FPS)); for (let f = Math.max(0, a); f <= b; f++) lg[f] += 1; }
  const sLeg = d.sarja((f) => lg[f]);
  const legato = (t) => sstep(0.8, 3.5, d.ka(sLeg, t * FPS, 1.0 * FPS));
  // urkupisteet: tapahtumat, pehmeät reunat
  const URK = d.tapahtumat.filter((e) => e.tyyppi === 'urkupiste');
  const urk = (t) => URK.reduce((m, e) => Math.max(m, sstep(e.alku - 0.2, e.alku + 1.0, t) * (1 - sstep((e.loppu ?? e.alku) - 0.4, (e.loppu ?? e.alku) + 1.0, t))), 0);
  // basson askeleet: matalan kaistan alut ikkunassa
  const jou01 = (t) => sstep(0.30, 0.80, d.keski(t, 1.2));
  const sSnX = d.sarja((f) => (0.30 + 0.5 * jou01(f / FPS)) / FPS), sSnY = d.sarja((f) => (0.60 + 0.8 * jou01(f / FPS)) / FPS);   // lumen kertymä: nopeus seuraa jousia
  const ALUT = d.alut.filter((a) => a.t >= T0 && a.t <= T1);

  // ---- väike ----
  // Vedoksen 4 väike (maailman metreissä kulkevat pisteet) säilyy kohdissa, joissa se jo näkyi (e_pitka_ja_kuviot).
  // Nimetyissä kohdissa (pohja_katoaa, puhaltimet_staccato, D_pikkolo, grazioso-tanssi) leikin tekevät keijuvalot (kuvan paikassa).
  const ASP = 16 / 9;
  const h1 = (x) => fract(Math.sin(x * 12.9898) * 43758.5453);          // deterministinen sekoitus (ei satunnaisuutta)
  const PUR = d.tapahtumat.find((e) => e.tyyppi === 'purske' && e.alku >= TD - 1 && e.alku <= TS);
  const TD1 = (PUR ? PUR.loppu ?? PUR.alku : TD + 4) + 1.0;             // juoksun ikkuna
  const VAIKE_KAIKKI = nuotit.filter((n) => n[2] >= 72 && n[1] < 0.9 && n[0] >= T0 && n[0] < TN1);   // linnojen ikkunat (kuten vedoksessa 4, päättyvät F:ään)
  const VAIKE = VAIKE_KAIKKI.filter((n) => (n[0] >= TE && n[0] < TD - 1.0) || (n[0] >= TD1 && n[0] < TN0 - 1.2));
  const kulkijat = [0, 1, 2].map(() => ({ z: 0, x: 0, y: 0, viime: -99, alku: false }));
  const SP = [];
  for (const n of VAIKE) {
    const g1 = fract(n[0] * 7.13 + n[2] * 0.37), h2 = fract(n[0] * 3.71 + n[2] * 0.19), h3 = fract(n[0] * 11.3 + n[2] * 0.53), h4 = fract(n[0] * 5.9 + n[2] * 0.83);
    const w = kulkijat[Math.floor(h4 * 3) % 3];
    if (n[0] - w.viime < 0.16) continue;
    const cz = camZ(n[0]), cy = camY(n[0]);
    if (!w.alku || n[0] - w.viime > 1.1 || w.z - cz < 20 || w.z - cz > 190) {
      w.z = cz + 32 + 120 * g1; w.x = xcf(w.z) + (h2 - 0.5) * 30; w.y = cy + 1.5; w.alku = true;
    }
    const frac = clamp((n[2] - 72) / 28, 0, 1), zr = w.z - cz;
    const hedef = cy + (-0.03 + 0.34 * frac) * zr / F, lim = 0.03 * zr;
    const by = w.y + clamp(hedef - w.y, -lim, lim);
    const bx = w.x + (h3 - 0.5) * (2 + 0.025 * zr);
    SP.push({ t: n[0], ax: w.x, ay: w.y, bx, by, z: w.z, v: 0.65 + 0.35 * h2 });
    w.x = bx; w.y = by; w.viime = n[0];
  }

  // keijuvalot: vedoksen 5 valologiikka (valinta, paikat, korkeus, kynnykset), nuottien lähteenä d.cues.alut.nuotit
  // ([t, kesto, midi, nousu_dB], alku mitattu nuotin omalta taajuudelta). Valo alkaa ruudussa Math.round(t * FPS).
  // Nuotti, jota tarkassa listassa ei ole, ei saa valoa.
  const tn = d.cues.alut.nuotit.filter((n) => n[0] >= T0 - 3 && n[0] <= T1 + 1);
  const yOf = (m) => lerp(0.40, 0.92, clamp((m - 72) / 28, 0, 1));
  const accent = (n) => { const f = Math.round(n[0] * FPS); const lo = Math.max(d.taso(n[2], f - 4), d.taso(n[2], f - 6)); return clamp((d.taso(n[2], f + 3) - lo) * 3.0, 0, 1); };
  const aksT = d.aksentit.map((x) => x.t);
  const painotettu = (n) => aksT.some((t) => Math.abs(t - n[0]) < 0.09);
  const FA = [];
  const voima = (n, vlk) => clamp(0.62 + 0.55 * accent(n) + (painotettu(n) ? 0.45 : 0), 0.55, 1.5) * vlk;
  const lisaa = (n, x, y, cut, polku, vlk, laji) => {
    const tt = Math.round(n[0] * FPS) / FPS;                             // alun ruutu
    const jatkuu = polku && tt - polku.t < 0.9;
    FA.push({ t: tt, x, y, px: jatkuu ? polku.x : x, py: jatkuu ? polku.y : y, v: voima(n, vlk), life: clamp(n[1], 0.06, 0.15), fade: laji === 1 ? 0.38 : 0.34, cut, laji });
    if (polku) { polku.x = x; polku.y = y; polku.t = tt; }
  };
  const uusiPolku = (xmin, xmax, h) => ({ x: lerp(xmin, xmax, h), xmin, xmax, dir: h > 0.5 ? -1 : 1, t: -99, y: 0 });
  const sijoita = (v, hsh) => {                                          // seuraava paikka polulla: hyppy hypyltä, edestakaisin
    v.x += v.dir * (0.060 + 0.060 * hsh);
    if (v.x > v.xmax) { v.x = v.xmax - 0.02; v.dir = -1; } else if (v.x < v.xmin) { v.x = v.xmin + 0.02; v.dir = 1; }
    return v.x; };
  const HI = tn.filter((n) => n[2] >= 72 && n[1] < 0.7 && n[0] >= T0 && n[0] < TE);
  {
    let vP = uusiPolku(0.25, ASP - 0.25, 0.3), vS = uusiPolku(0.30, ASP - 0.30, 0.6), viime = -99;
    const pS = { x: 0, y: 0, t: -99 }, pS2 = { x: 0, y: 0, t: -99 };      // staccato: kaksi rinnakkaista polkua
    const kaytetty = new Set();
    for (let i = 0; i < HI.length; i++) {
      const n = HI[i]; if (kaytetty.has(i)) continue;
      const hsh = h1(n[0] * 7.13 + n[2]);
      if (n[0] < TST) {                                                  // 1) pohja_katoaa: harvat ensimmäiset huilujen ja klarinettien valot
        if (n[2] < 76 || n[0] - viime < 0.45) continue;
        if (n[0] - vP.t > 1.4) vP = uusiPolku(0.25, ASP - 0.25, hsh);
        const x = sijoita(vP, hsh); lisaa(n, x, yOf(n[2]), TST, vP, 0.85, 0); viime = n[0];
      } else {                                                           // 2) puhaltimet_staccato: parit, kaksi valoa vierekkäin samaa polkua
        let pari = -1;
        for (let j = i + 1; j < HI.length && HI[j][0] - n[0] <= 0.07; j++) { const df = Math.abs(HI[j][2] - n[2]); if (df >= 2 && df <= 6 && !kaytetty.has(j)) { pari = j; break; } }
        if (pari < 0 && n[0] - viime < 0.14) continue;
        if (n[0] - pS.t > 1.2) vS = uusiPolku(0.30, ASP - 0.30, hsh);
        const x = sijoita(vS, hsh);
        if (pari >= 0) { kaytetty.add(pari);
          lisaa(n, x - 0.026, yOf(n[2]), TE, pS, 0.95, 0);
          lisaa(HI[pari], x + 0.026, yOf(HI[pari][2]), TE, pS2, 0.95, 0); }
        else lisaa(n, x, yOf(n[2]), TE, pS, 0.9, 0);
        pS.t = n[0]; viime = n[0];
      }
    }
    // 3) D_pikkolo: juova kiitää ylös kuvan yläosaan ja takaisin (korkeus = sävel, x etenee tasaisesti)
    const vJ = { x: 0, y: 0, t: -99 };
    const pikk = tn.filter((n) => n[0] >= TD && n[0] < TD1 && n[1] < 0.7 && n[2] >= 72);
    for (const n of pikk) {
      const u = clamp((n[0] - TD) / (TD1 - TD), 0, 1);
      lisaa(n, lerp(0.30, ASP - 0.30, u) + 0.03 * Math.sin(n[0] * 9.0), lerp(0.40, 0.97, clamp((n[2] - 72) / 26, 0, 1)), TD1 + 0.5, vJ, 0.9, 1);
    }
    // 4) grazioso-tanssi: kolme paikkaa eri korkeuksilla ja eri puolilla kuvaa vuorottelee, sama paikka palaa
    const RYHMAT = [{ x: 0.36, y: 0.40, sl: 0.20, lo: 66, hi: 76 }, { x: 1.46, y: 0.52, sl: -0.18, lo: 76, hi: 84 }, { x: 0.86, y: 0.72, sl: 0.16, lo: 84, hi: 98 }];
    const viimeR = [-99, -99, -99], polut = RYHMAT.map(() => ({ x: 0, y: 0, t: -99 }));
    for (const n of tn) {
      if (n[0] < TN0 || n[0] >= TN1 || n[2] < 66 || n[1] >= 0.9) continue;
      const g = n[2] < 76 ? 0 : n[2] < 84 ? 1 : 2, R = RYHMAT[g];
      if (n[0] - viimeR[g] < 0.2) continue;
      viimeR[g] = n[0];
      const fr = clamp((n[2] - R.lo) / (R.hi - R.lo), 0.0, 1.0);
      const px = R.x + (fr - 0.5) * 0.46;                                // sävelkorkeus kulkee polkua pitkin
      lisaa(n, px, R.y + R.sl * (px - R.x) + 0.05 * fr, TN1, polut[g], 1.0, painotettu(n) ? 1 : 0);
    }
  }
  FA.sort((x, y) => x.t - y.t);

  // ---- linnat: puinen, luinen, kivinen; paikat tulevat ankkureista ----
  const PASS = [TS + 0.62 * (TN0 - TS), TN0 + 0.05 * (TN1 - TN0), TN0 + 0.70 * (TN1 - TN0)];
  const LATERAL = [-15, 17, -19];
  const KORK = [10.0, 11.5, 12.0];
  const CAS = PASS.map((tp, i) => { const z = camZ(tp) - 2 + 8 * i; return [z, xcf(z) + LATERAL[i], KORK[i], 3.0 + 5.7 * i]; });
  const REG = [[72, 79], [80, 87], [88, 120]];
  const ikkunat = (t) => {
    const out = [];
    for (let c = 0; c < 3; c++) {
      const w = [0, 0, 0, 0, 0, 0];
      for (const n of VAIKE_KAIKKI) { const a = t - n[0]; if (a < -0.02 || a > 1.4) continue; if (n[2] < REG[c][0] || n[2] > REG[c][1]) continue;
        const i = Math.floor(fract(n[0] * 1.37 + n[2] * 0.113) * 6) % 6;
        w[i] = Math.max(w[i], sstep(-0.02, 0.05, a) * Math.exp(-a / 0.55)); }
      const lit = w.filter((x) => x >= 0.12).length;
      if (lit >= 6) { let mi = 0; for (let i = 1; i < 6; i++) if (w[i] < w[mi]) mi = i; w[mi] = Math.min(w[mi], 0.1); }
      out.push(...w);
    }
    return out;
  };

  // ---- tila hetkellä t ----
  function tila(t) {
    const cz = camZ(t), cx = camX(t), cy = camY(t);
    const jouset = sstep(0.30, 0.80, d.keski(t, 1.2));
    const kide = lerp(sstep(0.25, 0.75, d.keski(t, 2.0)) * 0.8, sstep(0.15, 0.80, d.pitka(t, 1.5)), sstep(TE - 1.5, TE + 1.5, t));
    const mel = d.melodia(t, 3.0);
    const sulaa = sstep(TJ, TJ + 0.55 * SPAN, t);
    const glow = (0.42 + 0.85 * kide) * (1 - 0.35 * jouset) * (1 - 0.35 * sulaa);
    const core = (0.20 + 1.00 * kide) * (1 - 0.30 * jouset) * (1 + 0.8 * sulaa * d.koko(t, 1.5));
    const bottom = sstep(0.06, 0.42, d.matala(t, 1.2));
    const horE = 0.020 + 0.100 * clamp((mel - 70) / 14, -1, 1);
    const u = (t - TJ) / SPAN;
    // pisara
    const hold = sstep(TJ + 0.10 * SPAN, TJ + 0.40 * SPAN, t);
    const tR = TJ + 0.50 * SPAN, tau = Math.max(0, t - tR);
    const zD = camZ(tR) + 17 * V0 / 2.6;                 // etäisyys skaalattu kameran vauhdin mukana (vedoksen 4 pisaran kulku säilyy)
    const yD = 0.5 - (0.5 - (ICEY + 0.9)) * sstep5(tau / TFALL);          // vedos 6: lasku pehmenee jäälle (nopeus ja kiihtyvyys jatkuvia, ei iskeytymisnykäystä)
    const vaipuu = 1 - sstep(T1 - 0.20 * SPAN, T1 - 0.02 * SPAN, t);
    const dropA = hold * vaipuu;
    const rD = 1.5 * (0.35 + 0.65 * hold);
    const low = ALUT.filter((a) => a.t <= t && t - a.t < 3).slice(-6).map((a) => [t - a.t, a.v, 0, 0]);
    while (low.length < 6) low.push([9, 0, 0, 0]);
    const sparks = SP.filter((s) => t - s.t >= -0.02 && t - s.t < 1.7).slice(-24);
    const fairies = FA.filter((x) => t - x.t >= -0.001 && t - x.t < x.life + x.fade && t < x.cut).slice(-32);
    const rise = sstep(TN1, TN1 + 5.0, t) * (1 - sstep(TJ + 0.12 * SPAN, TJ + 0.38 * SPAN, t));
    return { fairies, rise, cz, cx, cy, jouset, kide, glow, core, bottom, horE, sulaa, dropA, rD, zD, yD, low, sparks, u,
      leg: legato(t), urk: urk(t) * bottom, mel, pitch: pitch(t), ikkunat: ikkunat(t), twk: 0.5 + 0.5 * kide };
  }

  // mittaus: pisaran keskipisteen ja säteen projektio kuvaan (p.y ylös, yksikkö = kuvan korkeus), sama kamera kuin varjostimessa
  const pisaraRuutu = (t, s) => {
    const uYc = lerp(0.36, 0.5, sstep(TJ + 0.40 * SPAN, T1 - 0.5, t)), pt = pitch(t), sp = Math.sin(pt), cp = Math.cos(pt);
    const vx = xcf(s.zD) - s.cx, vy = s.yD - s.cy, vz = s.zD - s.cz;
    const fw = vy * sp + vz * cp, up = vy * cp - vz * sp;
    if (fw <= 0.01) return null;
    return [+(ASP * 0.5 + vx * F / fw).toFixed(5), +(uYc + up * F / fw).toFixed(5), +(s.rD * F / fw).toFixed(5)];
  };
  const { gl, U, piirra } = luoGL(FS_KOKO);
  const set1 = (n, v) => gl.uniform1f(U(n), v);
  julkaise({
    gl, aika: A,
    kamera: (t) => ({ p: [camX(t), camY(t), camZ(t)], q: [0, 0, 0, 1], shot: 'kide', cut: 0, trans: false, pitchDeg: +(pitch(t) * 180 / Math.PI).toFixed(2) }),
    kuvaus: (t) => { const s = tila(t); return {
      jouset: +s.jouset.toFixed(2), kide: +s.kide.toFixed(2), glow: +s.glow.toFixed(2), pohja: +s.bottom.toFixed(2), legato: +s.leg.toFixed(2), urkupiste: +s.urk.toFixed(2),
      melodia: +s.mel.toFixed(1), vauhti: +vauhti(t).toFixed(2), tiheys: +tiheys(t).toFixed(2), vaikettaKuvassa: s.sparks.length, keijuvaloja: s.fairies.length, syttyy: s.fairies.filter((x) => Math.abs(t - x.t) < 0.001).length, kirkkain: +Math.max(0, ...s.fairies.map((x) => x.v * (1 - sstep(x.life, x.life + x.fade, t - x.t)))).toFixed(2), pimeysNousee: +s.rise.toFixed(2), lumiSivu: +d.kohta(sSnX, t).toFixed(2), lumiAlas: +d.kohta(sSnY, t).toFixed(2),
      askelia: s.low.filter((x) => x[0] < 3).length, ikkunatSyttyneena: [0, 1, 2].map((c) => s.ikkunat.slice(c * 6, c * 6 + 6).filter((x) => x >= 0.12).length),
      pitchAste: +(s.pitch * 180 / Math.PI).toFixed(1), sulaa: +s.sulaa.toFixed(2), pisara: +s.dropA.toFixed(2), pisaraRuutu: pisaraRuutu(t, s) }; },
    seek: (t) => {
      t = clamp(t, T0, T1);
      const s = tila(t);
      const e = clamp((t - T0) / TVEIL, 0, 1);
      set1('uTime', t); set1('uCamX', s.cx); set1('uCamY', s.cy); set1('uCamZ', s.cz); set1('uPitch', s.pitch);
      set1('uYc', lerp(0.36, 0.5, sstep(TJ + 0.40 * SPAN, T1 - 0.5, t)));
      set1('uGlow', s.glow); set1('uCore', s.core); set1('uHorE', s.horE); set1('uDark', s.jouset); set1('uBottom', s.bottom);
      set1('uLeg', s.leg); set1('uVeil', t - T0 >= TVEIL ? 1.0 : smooth(Math.sqrt(e))); set1('uMelt', s.sulaa);
      set1('uFogL', lerp(135, 38, s.sulaa)); set1('uIceW', sstep(TJ + 0.58 * SPAN, TJ + 0.70 * SPAN, t)); set1('uIceY', ICEY);
      set1('uEnd', sstep(T1 - 1.6, T1, t)); set1('uDropA', s.dropA); set1('uUrk', s.urk); set1('uTwk', s.twk); set1('uSway', 0.15 + 0.5 * s.jouset + 0.2 * s.leg); set1('uRise', s.rise); set1('uNear', 2.4 * (1 - s.sulaa)); gl.uniform2f(U('uSnow'), d.kohta(sSnX, t), d.kohta(sSnY, t));
      gl.uniform4f(U('uDrop'), xcf(s.zD) + 0.0, s.yD, s.zD, s.rD);
      const low = new Float32Array(24); s.low.forEach((x, i) => low.set(x, i * 4)); gl.uniform4fv(U('uLow'), low);
      gl.uniform4fv(U('uCas'), new Float32Array(CAS.flat()));
      gl.uniform1fv(U('uWin'), new Float32Array(s.ikkunat));
      const sa = new Float32Array(96), sb = new Float32Array(96);
      s.sparks.forEach((x, i) => { sa.set([x.ax, x.ay, x.bx, x.by], i * 4); sb.set([x.z, t - x.t, x.v, 0], i * 4); });
      const fa = new Float32Array(128), fb = new Float32Array(128), fc = new Float32Array(128);
      s.fairies.forEach((x, i) => { fa.set([x.x, x.y, t - x.t, x.v], i * 4); fb.set([x.life, x.fade, x.laji, 0], i * 4); fc.set([x.px, x.py, 0, 0], i * 4); });
      gl.uniform4fv(U('uFA'), fa); gl.uniform4fv(U('uFB'), fb); gl.uniform4fv(U('uFC'), fc); gl.uniform1i(U('uNF'), s.fairies.length);
      gl.uniform4fv(U('uSA'), sa); gl.uniform4fv(U('uSB'), sb); gl.uniform1i(U('uNS'), s.sparks.length);
      piirra();
    },
  });
}
alusta().catch((e) => { console.error(e); window.sceneError = String(e.message || e); });
