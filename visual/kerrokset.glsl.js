// Kerrosmaisema: kuva on kolme kerrostumaa, jotka ovat orkesterin kerrokset.
//   maa            bassot ja patarummut: alin kaista, joka sykkii ja värisee
//   metsä          jouset: tummat kuuset edessä; jokainen pitkä ääni on puu, jonka latvan korkeus on sävelkorkeus
//   valo takana    käyrätorvet ja puhaltimet: horisontin viiva (unisono) ja siitä nousevat kukkulat, kauempana harjut
// Vasket leikkaavat pystysuoraan läpi, lyhyet korkeat äänet ovat pilkahduksia, lumi kulkee kerrosten välissä.
// Varjostin vain piirtää: mitä piirretään, laskee visual/kohtaus.js äänestä joka ruudulle erikseen (ei tilaa).

export const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

export const FRAG = `#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2 uRes;
uniform float uAA, uTime, uZoom, uMist, uDark;
uniform vec3 uSkyTop, uSkyLow, uMistCol, uTreeNear, uTreeFar, uGroundCol, uLightCol, uSnowCol, uCutCol, uWarmCol, uSunCol;
uniform vec4 uTree[72];    // x, latvan korkeus, leveys, syvyys (0 lähellä .. 1 kaukana)
uniform vec4 uTreeB[72];   // läsnäolo, huojunnan vaihe, huojunnan laajuus, värinä
uniform vec4 uRidge[16];   // harjun korkeus, valon voima, kukkulan paikka, kukkulan korkeus
uniform vec4 uRidgeB[16];  // terävyys (soinnin runsaus), kukkulan leveys, -, -
uniform vec4 uLine;        // viivan korkeus, valon voima, paksuus, hohto alas
uniform vec4 uHill[12];    // viivan kukkulat: paikka, korkeus, leveys, terävyys
uniform vec4 uGlint[32];   // paikka x, korkeus y, voima, koko
uniform vec4 uGround;      // maan korkeus, värinä, hohto, lumen kirkkaus
uniform vec4 uPulse[4];    // maan sysäys: paikka, ikä (s), voima, -
uniform vec4 uCut;         // leikkaus: paikka, voima, leveys, -
uniform vec4 uSnow;        // lumi: tiheys, tuuli, putoaminen, kirkkaus
uniform vec4 uGlow;        // kajo: korkeus, pystyleveys, voima, vaakaleveys
uniform vec4 uSun;         // taottu aurinko: paikka x, korkeus y, voima, leveys
uniform int uNTree, uNRidge, uNHill, uNGlint;
uniform vec3 uBand;        // metsän reuna, joka on aina kuvassa: korkeus maasta, tummuus, tuuli (taipuminen)

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
vec2 hash2(vec2 p) { float n = hash(p); return vec2(n, hash(p + n + 17.13)); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}

// Kuusen siluetti: 1 puun sisällä. p ruudun mitoissa (x 0..kuvasuhde, y 0..1).
float spruce(vec2 p, float x0, float gy, float top, float w, float soft, float phase, float sway, float shim) {
  float h = max(top - gy, 0.001);
  float v = (p.y - gy) / h;
  if (v > 1.02) return 0.0;
  float vv = clamp(v, 0.0, 1.0);
  float dx = p.x - x0 - sway * vv * vv * sin(uTime * (0.8 + 0.4 * fract(phase * 3.7)) * (1.0 + 2.0 * uBand.z) + phase * 6.283) - uBand.z * 0.035 * vv * vv;
  dx += shim * 0.002 * sin(uTime * 31.0 + p.y * 240.0 + phase * 9.0);
  float adx = abs(dx);
  float cv = clamp((vv - 0.10) / 0.90, 0.0, 1.0);
  float tiers = 6.0 + h * 26.0;
  float tier = 1.0 - fract(cv * tiers + adx / w * 1.6 + phase);
  float crown = w * pow(1.0 - cv, 0.8) * (0.42 + 0.58 * tier) * step(0.10, vv);
  crown *= 0.86 + 0.28 * vnoise(vec2(p.y * 90.0 + phase * 40.0, floor(cv * tiers) + sign(dx) * 3.0));
  float trunk = w * 0.075 * (1.0 - 0.5 * vv);
  float hw = max(crown, trunk);
  return smoothstep(soft, -soft, adx - hw) * smoothstep(1.02, 0.985, v);
}

float groundLine(float x) {
  float g = uGround.x + 0.012 * (vnoise(vec2(x * 1.7, 3.0)) - 0.5) + 0.004 * vnoise(vec2(x * 9.0, 7.0));
  g += uGround.y * 0.006 * sin(x * 70.0 + uTime * 43.0) * (0.6 + 0.4 * sin(x * 13.0 - uTime * 7.0));
  for (int i = 0; i < 4; i++) {
    vec4 pu = uPulse[i];
    if (pu.z <= 0.0) continue;
    float d = abs(x - pu.x);
    g += pu.z * 0.02 * exp(-pu.y * 2.2) * sin(d * 26.0 - pu.y * 15.0) * exp(-d * 2.6);
  }
  return g;
}

// Lumi yhdessä syvyydessä: koko ja nopeus tulevat etäisyydestä (lähellä suuri ja nopea, kaukana pieni ja hidas).
float snowSlab(vec2 p, float depth, float seed) {
  if (uSnow.x <= 0.001) return 0.0;
  float sc = mix(34.0, 150.0, depth);
  float sp = mix(1.0, 0.25, depth);
  vec2 g = vec2(p.x + uTime * uSnow.y * sp * 0.25, p.y + uTime * uSnow.z * sp * 0.10) * sc + seed * 37.0;
  g.x += 0.6 * sin(g.y * 0.35 + seed * 5.0 + uTime * 0.6 * sp);
  vec2 ic = floor(g), f = fract(g);
  float h = hash(ic + seed);
  if (h > uSnow.x * 0.5) return 0.0;
  vec2 c = 0.2 + 0.6 * hash2(ic + seed + 1.7);
  vec2 d = (f - c) * vec2(1.0 / (1.0 + 3.0 * abs(uSnow.y) * 0.3), 1.0);
  return smoothstep(0.10 + 0.14 * fract(h * 53.0), 0.0, length(d)) * (0.5 + 0.5 * fract(h * 37.0));
}

vec3 render(vec2 frag) {
  float asp = uRes.x / uRes.y;
  vec2 c0 = vec2(asp * 0.5, uLine.x > 0.0 ? uLine.x : 0.5);
  vec2 p = vec2(frag.x / uRes.y, frag.y / uRes.y);
  vec2 pf = c0 + (p - c0) / uZoom;                    // kaukaiset: hidas lähestyminen

  // tausta: tumma ylhäällä, hieman vaaleampi horisontin korkeudella; usvan lautat ajelehtivat
  float hy = uLine.x > 0.0 ? uLine.x : uGround.x + 0.25;
  vec3 col = mix(uSkyLow, uSkyTop, smoothstep(hy - 0.05, 1.0, pf.y));
  col = mix(col, uSkyLow * 0.55, smoothstep(hy, uGround.x - 0.1, pf.y));
  float m1 = vnoise(vec2(pf.x * 1.6 + uTime * 0.010, pf.y * 9.0 - uTime * 0.004));
  float m2 = vnoise(vec2(pf.x * 4.3 - uTime * 0.016, pf.y * 23.0));
  col += uMistCol * uMist * (0.55 * m1 + 0.3 * m2 - 0.4) * 0.5;

  // kajo ja taottu aurinko: kaikkein kauimpana
  if (uGlow.z > 0.0) col += uWarmCol * uGlow.z * exp(-pow((pf.y - uGlow.x) / uGlow.y, 2.0)) * exp(-pow((pf.x - asp * 0.5) / uGlow.w, 2.0));
  if (uSun.z > 0.0) { vec2 ds = (pf - uSun.xy) / uSun.w; col += uSunCol * uSun.z * (exp(-dot(ds, ds)) + 0.25 * exp(-dot(ds, ds) * 0.12)); }

  // harjut: jokainen puhaltimen pitkä ääni on vaaleneva harju korkeutensa kohdalla; ylimmät ovat kauimpana
  for (int i = 0; i < 16; i++) {
    if (i >= uNRidge) break;
    vec4 r = uRidge[i]; vec4 rb = uRidgeB[i];
    if (r.y <= 0.001) continue;
    float e = (pf.x - r.z) / rb.y;
    float bump = r.w * exp(-pow(abs(e), mix(2.0, 1.2, rb.x)));
    float crest = r.x + bump + 0.006 * (vnoise(vec2(pf.x * 3.0 + float(i) * 7.0, float(i))) - 0.5);
    float d = pf.y - crest;
    float under = d < 0.0 ? exp(d / (0.05 + 0.5 * bump)) : exp(-d / 0.006);
    float nearHill = 0.35 + 0.65 * exp(-e * e * 0.35);
    col += uLightCol * r.y * nearHill * (0.75 * under + 0.35 * exp(-pow(d / 0.0022, 2.0)));
  }

  // viiva: unisono on horisontti. Kukkulat nousevat siitä, kun soittaja paisuttaa.
  if (uLine.y > 0.001) {
    float ly = uLine.x; float lit = 0.0;
    for (int i = 0; i < 12; i++) {
      if (i >= uNHill) break;
      vec4 hl = uHill[i];
      if (hl.y <= 0.0005) continue;
      float e = abs(pf.x - hl.x) / hl.z;
      float b = hl.y * exp(-pow(e, mix(2.0, 1.15, hl.w)));
      b += hl.y * hl.w * 0.35 * (exp(-pow((e - 1.25) / 0.45, 2.0)) + 0.6 * exp(-pow((e - 2.1) / 0.4, 2.0)));   // yläsävelet ovat hartioita
      ly += b; lit += b;
    }
    float d = pf.y - ly;
    float core = exp(-pow(d / uLine.z, 2.0));
    float under = d < 0.0 ? exp(d / (uLine.w + 1.2 * lit)) : exp(-d / 0.012);
    col += uLightCol * uLine.y * (core * 1.3 + under * (0.22 + 7.0 * lit));
  }

  // pilkahdukset: lyhyet korkeat äänet, korkeus on sävelkorkeus
  for (int i = 0; i < 32; i++) {
    if (i >= uNGlint) break;
    vec4 g = uGlint[i];
    if (g.z <= 0.001) continue;
    vec2 d = (pf - g.xy) / g.w;
    col += uLightCol * g.z * (exp(-dot(d, d)) + 0.2 * exp(-dot(d, d) * 0.08));
  }

  // lumi kaukana: harjujen edessä, metsän takana
  col += uSnowCol * uSnow.w * (0.30 * snowSlab(pf, 1.0, 1.0) + 0.38 * snowSlab(pf, 0.85, 4.0));

  // leikkaus: vasket leikkaavat pystysuoraan kaikkien kerrosten läpi; lähimmät puut jäävät sen eteen siluetteina
  if (uCut.y > 0.001) {
    float d = abs(pf.x - uCut.x) / uCut.z;
    col += uCutCol * uCut.y * (exp(-d * d) + 0.10 * exp(-d * 0.35)) * (0.85 + 0.15 * sin(pf.y * 60.0 + uTime * 40.0));
  }

  // metsän reuna: tumma sahalaita, joka on aina kuvassa; se kohoaa, kun jouset soittavat
  {
    float gy0 = groundLine(pf.x);
    float x = pf.x * 46.0 + 0.4 * sin(pf.x * 9.0); float ii = floor(x), ff = fract(x);
    float hh = hash(vec2(ii, 4.0));
    float bend = uBand.z * 0.25 * sin(uTime * 2.3 + ii);
    float tooth = pow(1.0 - abs(ff - 0.5 - bend * 0.3) * 2.0, 1.3) * (0.35 + 0.65 * hh);
    float top = gy0 + uBand.x * (0.30 + 0.70 * tooth) * (0.8 + 0.4 * vnoise(vec2(pf.x * 2.1, 5.0)));
    top += 0.0015 * sin(uTime * (1.0 + hh) + ii * 2.0) * (1.0 + 3.0 * uBand.z);
    float a = smoothstep(0.003, -0.003, pf.y - top);
    col = mix(col, mix(uTreeFar, uMistCol * 0.5, 0.25) , a * uBand.y);
  }
  // metsä: jouset. Puut kauimmasta lähimpään; lumi kulkee niiden välissä.
  float lastDepth = 1.0;
  for (int i = 0; i < 72; i++) {
    if (i >= uNTree) break;
    vec4 t = uTree[i]; vec4 tb = uTreeB[i];
    if (tb.x <= 0.002) continue;
    float near = 1.0 - t.w;
    float zk = pow(uZoom, 1.0 + 2.5 * near);
    vec2 pk = c0 + (p - c0) / zk;
    if (lastDepth - t.w > 0.13) { col += uSnowCol * uSnow.w * mix(0.9, 0.45, t.w) * snowSlab(pk, t.w + 0.1, 2.0 + t.w * 5.0); lastDepth = t.w; }
    float gy = groundLine(pk.x) - 0.01;
    float a = spruce(pk, t.x, gy, t.y, t.z, mix(0.0012, 0.004, t.w), float(i) * 0.37 + t.x, tb.z, tb.w);
    vec3 tone = mix(uTreeNear, uTreeFar, t.w * t.w * 0.9 + 0.1 * t.w);
    tone += uMistCol * uMist * 0.25 * t.w * smoothstep(0.25, 0.0, (pk.y - gy) / max(t.y - gy, 0.01));   // usva kerääntyy tyveen
    col = mix(col, tone, a * tb.x);
  }

  // maa: bassot ja patarummut
  vec2 pg = c0 + (p - c0) / pow(uZoom, 2.4);
  float gl = groundLine(pg.x);
  float ga = smoothstep(0.003, -0.003, pg.y - gl);
  vec3 gcol = uGroundCol * (0.5 + 0.5 * smoothstep(0.0, gl, pg.y)) + uLightCol * uGround.z * 0.25 * exp(-(gl - pg.y) / 0.03);
  gcol += uSnowCol * uGround.w * (0.25 + 0.75 * exp(-(gl - pg.y) / 0.08)) * (0.75 + 0.25 * vnoise(vec2(pg.x * 6.0, pg.y * 40.0)));
  col = mix(col, gcol, ga);

  // lumi lähellä: kaiken edessä vain se, mikä on katsojaa lähimpänä
  col += uSnowCol * uSnow.w * 1.2 * snowSlab(c0 + (p - c0) / pow(uZoom, 3.2), 0.0, 9.0);
  return col * (1.0 - uDark);
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
