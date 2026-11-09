// Kerrosmaisema: kuva on kolme kerrostumaa, jotka ovat orkesterin kerrokset (tyyliohje 4c).
//   maa            bassot ja patarummut: alin kaista, joka sykkii ja värisee
//   metsä          jouset: tummat kuuset. Metsä on kuvassa aina, viidessä syvyydessä; se huojuu äänen liikkeestä ja kohoaa
//                  rekisterin voimasta (kaukaiset pienet puut ylärekisteristä, lähimmät suuret matalasta).
//                  Jokainen jousten ääni on lisäksi oma kuusiryhmänsä, jonka latvan korkeus on sävelkorkeus.
//   valo takana    teoksen pitkä ääni on horisontin viiva; paisutus on kukkula; puhaltimen ääni on harju
// Vasket leikkaavat pystysuoraan läpi, lyhyet korkeat äänet ovat pilkahduksia, lumi kulkee kerrosten välissä.
// Kuvatavat (tyyliohje 4b) ovat tämän saman maiseman rajauksia: katseen korkeus, etäisyys, peilaus, pimeys.
// Varjostin vain piirtää: mitä piirretään, laskee visual/kohtaus.js äänestä joka ruudulle erikseen (ei tilaa).

export const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

export const FRAG = `#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2 uRes;
uniform float uAA, uTime, uZoom, uMist, uDark, uStack, uDrift, uSway, uTrunk, uFrost, uReflect, uCrown;
uniform vec2 uPan;
uniform vec3 uSkyTop, uSkyLow, uMistCol, uTreeNear, uTreeFar, uGroundCol, uLightCol, uSnowCol, uCutCol, uWarmCol, uSunCol, uReg;
uniform vec4 uTree[72];    // x, latvan korkeus, leveys, syvyys (0 lähellä .. 1 kaukana)
uniform vec4 uTreeB[72];   // läsnäolo, muodon siemen, huojunnan laajuus, värinä
uniform vec4 uRidge[16];   // harjun korkeus, valon voima, kukkulan paikka, kukkulan korkeus
uniform vec4 uRidgeB[16];  // terävyys (soinnin runsaus), kukkulan leveys, -, -
uniform vec4 uLine;        // viivan korkeus, valon voima, paksuus, hohto
uniform vec4 uHill[12];    // viivan kukkulat: paikka, korkeus, leveys, terävyys
uniform vec4 uGlint[32];   // paikka x, korkeus y, voima, koko
uniform vec4 uGround;      // maan korkeus, värinä, hohto, lumen kirkkaus
uniform vec4 uPulse[4];    // maan sysäys: paikka, ikä (s), voima, -
uniform vec4 uCut;         // leikkaus: paikka, välähdys, jälkihohto, siemen
uniform vec4 uSnow;        // lumi: tiheys, tuuli, putoaminen, kirkkaus
uniform vec4 uGlow;        // kajo: korkeus, pystyleveys, voima, vaakaleveys
uniform vec4 uSun;         // taottu aurinko: paikka x, korkeus y, voima, leveys
uniform vec3 uBand;        // (ei käytössä), metsän tummuus, tuuli
uniform vec4 uForest;      // pysyvä metsä: kerrosten määrä (0..5), tiheys, kaukaisimman kerroksen puun korkeus, lähimmän korkeuden kerroin
uniform int uNTree, uNRidge, uNHill, uNGlint;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
vec2 hash2(vec2 p) { float n = hash(p); return vec2(n, hash(p + n + 17.13)); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}

// Kuusen siluetti: 1 puun sisällä. Jokainen puu on eri (siemen). Huojunta kasvaa latvaa kohti; tuuli taivuttaa.
float spruce(vec2 p, float x0, float gy, float top, float w, float soft, float seed, float sway, float shim) {
  float h = max(top - gy, 0.001);
  float v = (p.y - gy) / h;
  if (v > 1.03 || v < -0.05) return 0.0;
  float vv = clamp(v, 0.0, 1.0);
  float s1 = fract(seed * 7.31), s2 = fract(seed * 3.17 + 0.4), s3 = fract(seed * 11.9 + 0.7);
  float wind = uBand.z;
  float bend = sway * pow(vv, 1.3) * (sin(uTime * (1.9 + 1.3 * s1) * (1.0 + 1.2 * wind) + seed * 6.283) + 0.5 * sin(uTime * (4.1 + s2) + seed * 11.0))
             - wind * 0.006 * vv * vv * min(h / 0.3, 1.5) + (s2 - 0.5) * 0.10 * w * vv * vv;
  float dx = p.x - x0 - bend + shim * 0.0016 * sin(uTime * 34.0 + p.y * 260.0 + seed * 9.0);
  float cb = mix(0.08 + 0.10 * s3, 0.97, uCrown);       // runkojen rytmi: oksisto on kuvan yläpuolella
  float cv = clamp((vv - cb) / (1.0 - cb), 0.0, 1.0);
  float tiers = 5.0 + 5.0 * s1 + min(h, 0.6) * 22.0;
  float side = dx > 0.0 ? 1.0 : -1.0;
  float ww = w * (1.0 + 0.22 * (s3 - 0.5) * side);
  float adx = abs(dx);
  float ti = cv * tiers + adx / ww * 1.5 + seed;
  float tier = 1.0 - fract(ti);
  float jag = 0.72 + 0.56 * vnoise(vec2(floor(ti) * 1.7 + side * 5.0, seed * 13.0));
  float sag = 0.03 * sin(uTime * (1.1 + s2) + floor(ti) * 1.9 + seed * 5.0) * clamp(sway / 0.02, 0.0, 2.0);
  float crown = ww * pow(1.0 - cv, 0.72 + 0.3 * s2) * (0.36 + 0.64 * tier) * jag * (1.0 + sag) * step(cb, vv);
  float trunk = w * uTrunk * (1.0 - 0.45 * vv) * (0.9 + 0.2 * vnoise(vec2(p.y * 30.0, seed * 5.0)));
  float hw = max(crown, trunk);
  return smoothstep(soft, -soft, adx - hw) * smoothstep(1.03, 0.99, v);
}

float groundLine(float x) {
  float g = uGround.x + 0.014 * (vnoise(vec2(x * 1.3, 3.0)) - 0.5) + 0.006 * (vnoise(vec2(x * 6.0, 7.0)) - 0.5);
  g += uGround.y * 0.007 * sin(x * 90.0 + uTime * 47.0) * (0.55 + 0.45 * sin(x * 11.0 - uTime * 6.0));
  for (int i = 0; i < 4; i++) {
    vec4 pu = uPulse[i];
    if (pu.z <= 0.0) continue;
    float d = abs(x - pu.x);
    float front = pu.y * 1.4;
    g += pu.z * 0.045 * exp(-pu.y * 2.4) * exp(-pow((d - front) / 0.09, 2.0)) + pu.z * 0.03 * exp(-pu.y * 7.0) * exp(-d * d / 0.02);
  }
  return g;
}

// Lumi yhdessä syvyydessä: koko ja nopeus tulevat etäisyydestä (lähellä suuri, pehmeä ja nopea; kaukana pieni ja hidas).
float snowSlab(vec2 p, float depth, float seed, float dens) {
  if (uSnow.x * dens <= 0.001) return 0.0;
  float sc = mix(22.0, 170.0, pow(depth, 0.7));
  float sp = mix(1.0, 0.18, depth);
  float wn = clamp(abs(uSnow.y), 0.0, 4.0);
  vec2 g = vec2(p.x + uTime * uSnow.y * sp * 0.22, p.y + uTime * uSnow.z * sp * 0.09 + (p.x) * 0.12 * wn) * sc + seed * 37.0;
  g.x += 0.7 * sin(g.y * 0.33 + seed * 5.0 + uTime * 0.5 * sp);
  vec2 ic = floor(g), f = fract(g);
  float h = hash(ic + seed);
  float fl = 0.0;
  if (h <= uSnow.x * dens * 0.5) {
    vec2 c = 0.3 + 0.4 * hash2(ic + seed + 1.7);
    vec2 d = (f - c) * vec2(1.0 / (1.0 + min(wn, 1.2) * 0.6), 1.0);
    float r = mix(0.22, 0.11, depth) * (0.6 + 0.8 * fract(h * 53.0));
    fl = smoothstep(r, r * mix(0.15, 0.6, depth), length(d)) * (0.5 + 0.5 * fract(h * 37.0));
  }
  // kova tuuli: lumi on pitkiä viiruja, ei pisteitä
  if (wn > 1.2) {
    vec2 q = vec2(p.x + uTime * uSnow.y * sp * 0.22, p.y + p.x * 0.12 * wn) ;
    float ln = vnoise(vec2(q.x * sc * 0.05, q.y * sc * 1.6 + seed * 9.0));
    fl += (wn - 1.2) * 0.45 * smoothstep(0.80 - 0.25 * uSnow.x * dens, 0.98, ln);
  }
  return fl;
}

float regFor(float fl) { return fl < 0.5 ? mix(uReg.z, uReg.y, fl * 2.0) : mix(uReg.y, uReg.x, (fl - 0.5) * 2.0); }

vec3 scene(vec2 p) {
  float asp = uRes.x / uRes.y;
  vec2 c0 = vec2(asp * 0.5, uLine.x);
  vec2 pf = c0 + (p - c0) / uZoom;

  // tausta: tumma ylhäällä, vaaleampi horisontin korkeudella; usvan lautat ajelehtivat koko ajan
  vec3 col = mix(uSkyLow, uSkyTop, smoothstep(uLine.x - 0.08, uLine.x + 0.55, pf.y));
  col = mix(col, uSkyLow * 0.5, smoothstep(uLine.x, uGround.x - 0.05, pf.y));
  // usvan lautat: pehmeät, vaakasuorat, ajelehtivat; aaltoina, jotta ne eivät koskaan ruudutu
  float m1 = 0.5 + 0.5 * sin(pf.x * 2.1 + uTime * 0.05 + 1.6 * sin(pf.y * 5.3 - uTime * 0.021) + 0.7 * sin(pf.x * 0.9 - uTime * 0.013));
  float m2 = 0.5 + 0.5 * sin(pf.x * 5.7 - uTime * 0.071 + 2.3 * sin(pf.y * 12.1 + uTime * 0.017) + 1.1 * sin(pf.x * 3.1 + pf.y * 7.0));
  float m3 = 0.5 + 0.5 * sin(pf.y * 31.0 + 2.0 * sin(pf.x * 1.7 + uTime * 0.03));
  float mistv = 0.5 * m1 + 0.3 * m2 + 0.2 * m3;
  col += uMistCol * uMist * (mistv - 0.45) * 0.5;

  if (uGlow.z > 0.0) col += uWarmCol * uGlow.z * exp(-pow((pf.y - uGlow.x) / uGlow.y, 2.0)) * exp(-pow((pf.x - asp * 0.5) / uGlow.w, 2.0)) * (0.8 + 0.4 * mistv);
  if (uSun.z > 0.0) { vec2 ds = (pf - uSun.xy) / uSun.w; col += uSunCol * uSun.z * (0.8 * exp(-dot(ds, ds)) + 0.30 * exp(-dot(ds, ds) * 0.07)) * (0.8 + 0.4 * mistv); }

  // harjut: puhaltimen pitkä ääni on usvainen harju korkeutensa kohdalla; ylimmät ovat kauimpana
  for (int i = 0; i < 16; i++) {
    if (i >= uNRidge) break;
    vec4 r = uRidge[i]; vec4 rb = uRidgeB[i];
    if (r.y <= 0.001) continue;
    float e = (pf.x - r.z) / rb.y;
    float bump = r.w * exp(-pow(abs(e), mix(2.0, 1.3, rb.x)));
    float crest = r.x + bump + 0.010 * (vnoise(vec2(pf.x * 2.2 + float(i) * 7.0, float(i))) - 0.5) + 0.004 * (vnoise(vec2(pf.x * 9.0, float(i) + 3.0)) - 0.5);
    float d = pf.y - crest;
    float body = d < 0.0 ? exp(d / (0.035 + 0.6 * bump)) : exp(-d / 0.010);
    col += uLightCol * r.y * (0.45 + 0.55 * exp(-e * e * 0.3)) * (0.7 * body + 0.18 * exp(-pow(d / 0.003, 2.0))) * (0.75 + 0.5 * mistv);
  }

  // viiva: unisono on horisontti, kaukainen ja usvan pehmentämä. Kukkulat nousevat siitä ja ovat valoisaa massaa.
  if (uLine.y > 0.001) {
    float base = uLine.x + 0.005 * (vnoise(vec2(pf.x * 0.9, 11.0)) - 0.5) + 0.002 * (vnoise(vec2(pf.x * 5.0, 13.0)) - 0.5);
    float ly = base, lit = 0.0;
    for (int i = 0; i < 12; i++) {
      if (i >= uNHill) break;
      vec4 hl = uHill[i];
      if (hl.y <= 0.0005) continue;
      float e = abs(pf.x - hl.x) / hl.z;
      float b = hl.y * exp(-pow(e, mix(2.0, 1.25, hl.w)));
      b += hl.y * hl.w * 0.33 * (exp(-pow((e - 1.3) / 0.5, 2.0)) + 0.55 * exp(-pow((e - 2.2) / 0.45, 2.0)));
      ly += b; lit += b;
    }
    float d = pf.y - ly;
    float veil = 0.7 + 0.6 * mistv;
    float core = exp(-pow(d / uLine.z, 2.0));
    float halo = exp(-abs(pf.y - base) / uLine.w) * 0.16;
    float inside = smoothstep(base - 0.004, base + 0.003, pf.y) * smoothstep(0.002, -0.004, d);
    float body = inside * (0.25 + 0.75 * smoothstep(base, ly + 0.0001, pf.y)) * 0.55;
    col += uLightCol * uLine.y * veil * (core * 0.95 + halo + body + 0.35 * exp(-max(d, 0.0) / 0.02) * clamp(lit * 14.0, 0.0, 1.0) * step(0.0, d));
  }

  for (int i = 0; i < 32; i++) {
    if (i >= uNGlint) break;
    vec4 g = uGlint[i];
    if (g.z <= 0.001) continue;
    vec2 d = (pf - g.xy) / g.w;
    col += uLightCol * g.z * (exp(-dot(d, d)) + 0.2 * exp(-dot(d, d) * 0.08));
  }

  // lumi kaukana: harjujen edessä, koko metsän takana
  col += uSnowCol * uSnow.w * (0.22 * snowSlab(pf, 1.0, 1.0, 1.0) + 0.30 * snowSlab(pf, 0.88, 4.0, 1.0));

  // leikkaus: vasket repäisevät pystysuoraan kaikkien kerrosten läpi. Välähdys on lyhyt ja kapeneva, jälki on usvan hohto.
  if (uCut.y + uCut.z > 0.001) {
    float wob = 0.006 * (vnoise(vec2(pf.y * 9.0, uCut.w)) - 0.5) + 0.002 * (vnoise(vec2(pf.y * 40.0, uCut.w + 2.0)) - 0.5);
    float d = abs(pf.x - uCut.x - wob);
    float taper = 0.4 + 0.6 * smoothstep(0.0, 1.0, pf.y) + 0.5 * vnoise(vec2(pf.y * 14.0, uCut.w + 5.0));
    col += uCutCol * (uCut.y * exp(-pow(d / (0.0028 * taper), 2.0)) + (uCut.y * 0.35 + uCut.z) * exp(-d / 0.05) * (0.6 + 0.6 * mistv));
  }

  // metsä. Viisi pysyvää kerrosta kauimmasta lähimpään; jousten äänten kuusiryhmät seisovat kolmannen jälkeen.
  for (int L = 0; L < 5; L++) {
    float fl = float(L) / 4.0;
    float vis = clamp(uForest.x - float(L), 0.0, 1.0);
    if (L == 3) {
      float lastDepth = 0.62;
      for (int i = 0; i < 72; i++) {
        if (i >= uNTree) break;
        vec4 t = uTree[i]; vec4 tb = uTreeB[i];
        if (tb.x <= 0.002) continue;
        float near = 1.0 - t.w;
        float zk2 = pow(uZoom, 1.0 + 1.6 * near);
        vec2 pk2 = c0 + (p - c0) / zk2; pk2.x += uDrift * (0.25 + 0.5 * near);
        if (lastDepth - t.w > 0.12) { col += uSnowCol * uSnow.w * mix(0.75, 0.4, t.w) * snowSlab(pk2, t.w * 0.5 + 0.3, 2.0 + t.w * 5.0, 0.8); lastDepth = t.w; }
        float gy = groundLine(pk2.x) + uStack * 0.45 - 0.012;
        float a = spruce(pk2, t.x + uDrift * (0.25 + 0.5 * near), gy, t.y + uStack * 0.45, t.z, mix(0.0011, 0.0035, t.w), tb.y, tb.z, tb.w);
        vec3 tone = mix(uTreeNear, uTreeFar, t.w * 0.85);
        tone += uMistCol * uMist * 0.22 * t.w * smoothstep(0.3, 0.0, (pk2.y - gy) / max(t.y + uStack * 0.45 - gy, 0.01));
        tone = mix(tone, uSnowCol * 0.9, uFrost * 0.55);
        col = mix(col, tone, a * tb.x);
      }
    }
    if (vis <= 0.001) continue;
    float zk = pow(uZoom, 1.0 + 2.6 * fl * fl);
    vec2 pk = c0 + (p - c0) / zk;
    pk.x += uDrift * (0.12 + 1.2 * fl * fl);
    float base = groundLine(pk.x) + uStack * (1.0 - fl) - 0.012 * fl
               + uStack * 0.16 * (vnoise(vec2(pk.x * (0.9 + 1.2 * (1.0 - fl)) + float(L) * 13.0, float(L))) - 0.5) * (0.5 + 0.5 * fl);
    float cells = mix(36.0, 4.2, pow(fl, 1.25)) * uForest.y;
    float x = pk.x * cells + fl * 7.3;
    float ii = floor(x);
    float a = 0.0;
    float H0 = uForest.z * mix(1.0, uForest.w, fl * fl) * (1.0 + 0.22 * regFor(fl));
    for (int k = -1; k <= 1; k++) {
      float ci = ii + float(k);
      float hh = hash(vec2(ci, 4.0 + fl * 9.0));
      if (hh < 0.22 * fl) continue;
      float tx = (ci + 0.5 + 0.5 * (hash(vec2(ci, 9.0 + fl)) - 0.5) - fl * 7.3) / cells;
      float H = H0 * (0.5 + 0.7 * hh);
      a = max(a, spruce(pk, tx, base, base + H, H * (0.15 + 0.07 * hh), mix(0.003, 0.0012, fl), hh * 7.0 + ci * 0.37 + fl, uSway * (0.4 + 0.9 * fl) * (H / 0.25), 0.0));
    }
    vec3 tone = mix(mix(uTreeFar, uMistCol * 0.5, 0.45), uTreeNear, pow(fl, 0.8));
    tone += uMistCol * uMist * 0.2 * (1.0 - fl) * smoothstep(0.35, 0.0, (pk.y - base) / max(H0, 0.01));
    tone += uSunCol * uSun.z * 0.16 * (1.0 - 0.6 * fl) * exp(-pow((pk.x - uSun.x) / 1.1, 2.0));
    tone = mix(tone, mix(uSnowCol * 0.85, uTreeFar * 1.6 + uSnowCol * 0.12, fl) * (0.75 + 0.25 * vnoise(pk * vec2(40.0, 70.0))), uFrost * 0.8);
    if (uStack > 0.01) {
      float fill = smoothstep(0.004, -0.004, pk.y - base - H0 * 0.18);
      vec3 ft = mix(tone, uMistCol * 0.75 + uWarmCol * uGlow.z * 0.25 * (1.0 - fl), clamp((base - pk.y) / (uStack * 0.30 + 0.02), 0.0, 1.0) * (0.9 - 0.5 * fl));
      col = mix(col, ft, fill * vis * clamp(uStack * 6.0, 0.0, 1.0));
    }
    col = mix(col, tone, a * uBand.y * vis);
    col += uSnowCol * uSnow.w * mix(0.36, 0.7, fl) * snowSlab(pk, 0.8 - 0.65 * fl, 6.0 + float(L), mix(1.0, 0.45, fl));
    if (uFrost > 0.0 && a > 0.5) {                                        // huurteen kiteet välkkyvät
      vec2 gq = floor(pk * 380.0); float hs = hash(gq);
      col += uLightCol * uFrost * 0.9 * step(0.992, hs) * step(0.55, fract(hs * 91.0 + floor(uTime * 5.0) * 0.618));
    }
  }

  // maa: bassot ja patarummut. Lumen pinta on vaaleampi reunastaan.
  vec2 pg = c0 + (p - c0) / pow(uZoom, 2.4);
  pg.x += uDrift * 1.4;
  float gl = groundLine(pg.x);
  float ga = smoothstep(0.003, -0.003, pg.y - gl);
  float dep = (gl - pg.y);
  vec3 gcol = uGroundCol * (0.5 + 0.3 * vnoise(vec2(pg.x * 5.0, pg.y * 30.0)));
  gcol += uSnowCol * uGround.w * (0.03 + 0.97 * exp(-dep / 0.012)) * (0.7 + 0.3 * vnoise(vec2(pg.x * 7.0, pg.y * 45.0)));
  gcol += uLightCol * uGround.z * 0.10 * exp(-dep / 0.03);
  col = mix(col, gcol, ga * (1.0 - uStack * 2.0 > 0.0 ? 1.0 : 0.0));

  // lumi lähellä: vain muutama suuri, pehmeä hiutale aivan katsojan edessä
  col += uSnowCol * uSnow.w * 0.55 * snowSlab(c0 + (p - c0) / pow(uZoom, 3.2), 0.0, 9.0, 0.22);
  return col;
}

vec3 render(vec2 frag) {
  vec2 p = vec2(frag.x / uRes.y, frag.y / uRes.y) + uPan;
  vec3 col = scene(p);
  // musta jää: maan alapuolella metsä näkyy ylösalaisin, ja sysäys kulkee pinnassa aaltona
  if (uReflect > 0.001) {
    float gy = uGround.x;
    if (p.y < gy) {
      float rip = 0.0;
      for (int i = 0; i < 4; i++) { vec4 pu = uPulse[i]; if (pu.z > 0.0) rip += pu.z * 0.012 * exp(-pu.y * 1.5) * sin(abs(p.x - pu.x) * 40.0 - pu.y * 14.0); }
      vec2 q = vec2(p.x + rip + 0.003 * sin(p.y * 90.0 + uTime * 1.3), 2.0 * gy - p.y + rip);
      vec3 rc = scene(q) * mix(0.75, 0.35, clamp((gy - p.y) / 0.5, 0.0, 1.0));
      float crack = smoothstep(0.012, 0.0, abs(vnoise(p * vec2(3.0, 9.0)) - 0.5)) * 0.04;
      col = mix(col, rc + uSnowCol * crack, uReflect);
    }
  }
  float reveal = clamp(uCut.y * 0.5 + uCut.z * 2.2 + uSun.z * 0.6 + uGlow.z, 0.0, 1.0);
  return col * (1.0 - uDark * (1.0 - reveal));
}

void main() {
  vec3 c = vec3(0.0);
  int n = int(uAA);
  for (int j = 0; j < n; j++) for (int i = 0; i < n; i++) {
    c += render(gl_FragCoord.xy + (vec2(float(i), float(j)) + 0.5) / float(n) - 0.5);
  }
  c /= float(n * n);
  c = c / (1.0 + 0.3 * c);
  c = pow(max(c, 0.0), vec3(1.0 / 2.2));
  c += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  outColor = vec4(c, 1.0);
}`;
