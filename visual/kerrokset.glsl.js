// Kerrosmaisema: kuva on kolme kerrostumaa, jotka ovat orkesterin kerrokset (tyyliohje 4c).
//   maa            bassot ja patarummut: alin kaista, joka sykkii ja värisee
//   metsä          jouset: tummat kuuset edessä; jokainen ääni on kuusiryhmä, jonka latvan korkeus on sävelkorkeus.
//                  Metsän reuna on kuvassa aina, myös hiljaisuudessa.
//   valo takana    teoksen pitkä ääni on horisontin viiva; paisutus on kukkula; puhaltimen ääni on harju
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
uniform vec3 uBand;        // metsän reuna: korkeus maasta, tummuus, tuuli
uniform int uNTree, uNRidge, uNHill, uNGlint;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
vec2 hash2(vec2 p) { float n = hash(p); return vec2(n, hash(p + n + 17.13)); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}

// Kuusen siluetti: 1 puun sisällä. Jokainen puu on eri: oksakerrosten määrä, toispuoleisuus ja latvan kallistus
// tulevat siemenestä. Huojunta kasvaa latvaa kohti; tuuli taivuttaa.
float spruce(vec2 p, float x0, float gy, float top, float w, float soft, float seed, float sway, float shim) {
  float h = max(top - gy, 0.001);
  float v = (p.y - gy) / h;
  if (v > 1.03 || v < -0.05) return 0.0;
  float vv = clamp(v, 0.0, 1.0);
  float s1 = fract(seed * 7.31), s2 = fract(seed * 3.17 + 0.4), s3 = fract(seed * 11.9 + 0.7);
  float wind = uBand.z;
  float bend = sway * vv * vv * (sin(uTime * (1.5 + 1.2 * s1) * (1.0 + 1.5 * wind) + seed * 6.283) + 0.45 * sin(uTime * (3.4 + s2) + seed * 11.0))
             - wind * 0.012 * vv * vv + (s2 - 0.5) * 0.10 * w * vv * vv;
  float dx = p.x - x0 - bend + shim * 0.0016 * sin(uTime * 34.0 + p.y * 260.0 + seed * 9.0);
  float cv = clamp((vv - 0.08 - 0.10 * s3) / (0.92 - 0.10 * s3), 0.0, 1.0);
  float tiers = 5.0 + 5.0 * s1 + h * 22.0;
  float side = dx > 0.0 ? 1.0 : -1.0;
  float ww = w * (1.0 + 0.22 * (s3 - 0.5) * side);
  float adx = abs(dx);
  float ti = cv * tiers + adx / ww * 1.5 + seed;
  float tier = 1.0 - fract(ti);
  float jag = 0.72 + 0.56 * vnoise(vec2(floor(ti) * 1.7 + side * 5.0, seed * 13.0));
  float sag = 0.03 * sin(uTime * (1.1 + s2) + floor(ti) * 1.9 + seed * 5.0) * sway / 0.02;
  float crown = ww * pow(1.0 - cv, 0.72 + 0.3 * s2) * (0.36 + 0.64 * tier) * jag * (1.0 + sag) * step(0.08 + 0.10 * s3, vv);
  float trunk = w * 0.07 * (1.0 - 0.5 * vv);
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
  vec2 g = vec2(p.x + uTime * uSnow.y * sp * 0.22, p.y + uTime * uSnow.z * sp * 0.09) * sc + seed * 37.0;
  g.x += 0.7 * sin(g.y * 0.33 + seed * 5.0 + uTime * 0.5 * sp);
  vec2 ic = floor(g), f = fract(g);
  float h = hash(ic + seed);
  if (h > uSnow.x * dens * 0.5) return 0.0;
  vec2 c = 0.2 + 0.6 * hash2(ic + seed + 1.7);
  vec2 d = (f - c) * vec2(1.0 / (1.0 + abs(uSnow.y) * 0.8), 1.0);
  float r = mix(0.26, 0.11, depth) * (0.6 + 0.8 * fract(h * 53.0));
  return smoothstep(r, r * mix(0.15, 0.6, depth), length(d)) * (0.5 + 0.5 * fract(h * 37.0));
}

vec3 render(vec2 frag) {
  float asp = uRes.x / uRes.y;
  vec2 c0 = vec2(asp * 0.5, uLine.x);
  vec2 p = vec2(frag.x / uRes.y, frag.y / uRes.y);
  vec2 pf = c0 + (p - c0) / uZoom;

  // tausta: tumma ylhäällä, vaaleampi horisontin korkeudella; usvan lautat ajelehtivat koko ajan
  vec3 col = mix(uSkyLow, uSkyTop, smoothstep(uLine.x - 0.08, 1.0, pf.y));
  col = mix(col, uSkyLow * 0.5, smoothstep(uLine.x, uGround.x - 0.05, pf.y));
  float m1 = vnoise(vec2(pf.x * 1.4 + uTime * 0.030, pf.y * 8.0 - uTime * 0.012));
  float m2 = vnoise(vec2(pf.x * 3.9 - uTime * 0.045, pf.y * 21.0 + uTime * 0.01));
  float mistv = 0.6 * m1 + 0.4 * m2;
  col += uMistCol * uMist * (mistv - 0.42) * 0.55;

  if (uGlow.z > 0.0) col += uWarmCol * uGlow.z * exp(-pow((pf.y - uGlow.x) / uGlow.y, 2.0)) * exp(-pow((pf.x - asp * 0.5) / uGlow.w, 2.0));
  if (uSun.z > 0.0) { vec2 ds = (pf - uSun.xy) / uSun.w; col += uSunCol * uSun.z * (exp(-dot(ds, ds)) + 0.25 * exp(-dot(ds, ds) * 0.12)); }

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

  // metsän reuna: kaksi tummaa sahalaitaa, jotka ovat kuvassa aina (hiljaisuudessakin); ne kohoavat, kun jouset soittavat
  for (int L = 0; L < 2; L++) {
    float fl = float(L);
    float zk = pow(uZoom, 1.0 + 0.8 * fl);
    vec2 pk = c0 + (p - c0) / zk;
    float gy0 = groundLine(pk.x);
    float x = pk.x * mix(38.0, 23.0, fl) + 0.5 * sin(pk.x * 7.0 + fl * 3.0); float ii = floor(x), ff = fract(x);
    float hh = hash(vec2(ii, 4.0 + fl));
    float lean = 0.12 * sin(uTime * (1.3 + hh) + ii) * (1.0 + 2.5 * uBand.z) - 0.25 * uBand.z;
    float tx = (ff - 0.5 - lean * 0.2) * 2.0;
    float prof = pow(max(1.0 - abs(tx), 0.0), 1.2) * (0.3 + 0.7 * hh);
    prof *= 0.8 + 0.2 * step(0.5, fract(prof * (7.0 + 5.0 * hh)));
    float top = gy0 + uBand.x * mix(1.0, 1.45, fl) * (0.28 + 0.72 * prof) * (0.75 + 0.5 * vnoise(vec2(pk.x * 1.7 + fl * 9.0, 5.0)));
    float a = smoothstep(0.0025, -0.0025, pk.y - top);
    vec3 tone = mix(mix(uTreeFar, uMistCol * 0.45, 0.35), uTreeFar, fl);
    col = mix(col, tone, a * uBand.y);
    col += uSnowCol * uSnow.w * 0.36 * snowSlab(pk, 0.78 - 0.1 * fl, 6.0 + fl, 1.0);
  }

  // metsä: jouset. Puut kauimmasta lähimpään, läpinäkymättöminä; lumi kulkee niiden välissä.
  float lastDepth = 0.62;
  for (int i = 0; i < 72; i++) {
    if (i >= uNTree) break;
    vec4 t = uTree[i]; vec4 tb = uTreeB[i];
    if (tb.x <= 0.002) continue;
    float near = 1.0 - t.w;
    float zk = pow(uZoom, 1.0 + 2.5 * near);
    vec2 pk = c0 + (p - c0) / zk;
    if (lastDepth - t.w > 0.12) { col += uSnowCol * uSnow.w * mix(0.75, 0.4, t.w) * snowSlab(pk, t.w + 0.06, 2.0 + t.w * 5.0, 0.8); lastDepth = t.w; }
    float gy = groundLine(pk.x) - 0.012;
    float a = spruce(pk, t.x, gy, t.y, t.z, mix(0.0011, 0.0035, t.w), tb.y, tb.z, tb.w);
    vec3 tone = mix(uTreeNear, uTreeFar, t.w * 0.85);
    tone += uMistCol * uMist * 0.22 * t.w * smoothstep(0.3, 0.0, (pk.y - gy) / max(t.y - gy, 0.01));
    col = mix(col, tone, a * tb.x);
  }

  // maa: bassot ja patarummut. Lumen pinta on vaaleampi reunastaan.
  vec2 pg = c0 + (p - c0) / pow(uZoom, 2.4);
  float gl = groundLine(pg.x);
  float ga = smoothstep(0.003, -0.003, pg.y - gl);
  float dep = (gl - pg.y);
  vec3 gcol = uGroundCol * (0.5 + 0.3 * vnoise(vec2(pg.x * 5.0, pg.y * 30.0)));
  gcol += uSnowCol * uGround.w * (0.03 + 0.97 * exp(-dep / 0.012)) * (0.7 + 0.3 * vnoise(vec2(pg.x * 7.0, pg.y * 45.0)));
  gcol += uLightCol * uGround.z * 0.10 * exp(-dep / 0.03);
  col = mix(col, gcol, ga);

  // lumi lähellä: vain muutama suuri, pehmeä hiutale aivan katsojan edessä
  col += uSnowCol * uSnow.w * 0.55 * snowSlab(c0 + (p - c0) / pow(uZoom, 3.2), 0.0, 9.0, 0.22);
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
