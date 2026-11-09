// Tapiolan tila: yksi säteenseurantavarjostin, jossa metsä on paikan funktio. Ei tilaa ruutujen välillä.
// Kuvatavat (tyyliohje 4b) ovat saman tilan eri katsomispaikkoja: usva, maan taso, katse ylös, lähikuva, heijastus
// jäässä, runkojen rytmi, pimeä ja välähdys, vaarat kerroksina usvassa, tuuli.
// Maailmat (kuvakäsikirjoitus luku 2) ovat tämän saman funktion parametreja; ne asettaa visual/kohtaus.js.

export const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

export const FRAG = `#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2 uRes;
uniform float uAA;
uniform vec3 uCam;
uniform float uPitch, uFov, uFar, uTime;
// metsä
uniform float uCell, uDensity, uPath, uTrunkR, uTreeH, uCanopyBase, uCanopyR, uTier, uBaseY;
uniform float uGround, uTerrain, uCeil, uFrost, uSnow, uIce;
uniform vec2 uClear;
uniform vec3 uTrunkCol, uNeedleCol, uSnowCol, uFrostCol;
// ilma
uniform vec3 uFogCol, uAmb;
uniform float uFogDen, uFogDown, uFogLow;
// valot
uniform vec4 uSlit;      // suunta sivulle (rad), korkeus (rad), leveys (rad), voimakkuus
uniform float uSlitTall;
uniform vec3 uSlitCol;
uniform vec4 uCut;       // sivusiirtymä kameran kohdalla (m), paksuus (m), voimakkuus, kohtaamisetäisyys (m)
uniform vec3 uCutCol;
uniform vec4 uSun;       // suunta sivulle (rad), korkeus (rad), terävyys, voimakkuus
uniform vec3 uSunCol;
// horisontti
uniform float uHorizon, uTreeline;
uniform vec4 uGlow;      // korkeus, pystyleveys, voimakkuus, vaakaleveys
uniform vec3 uGlowCol;
uniform vec4 uLine;      // korkeus, paksuus, voimakkuus, -
uniform vec3 uLineCol;
uniform vec4 uBand;      // voimakkuus, korkeus puurajan yllä, väreily, -
uniform vec3 uBandCol;
// elementit
uniform float uSpark;
uniform vec4 uStrand;    // voimakkuus, korkeus (m), etäisyys (m), paksuus (m)
uniform vec3 uStrandCol;
uniform vec4 uStep;      // etäisyys kamerasta (m), syvyys (m), -, -
uniform vec3 uFlake;     // tiheys, kirkkaus, viiru
uniform vec3 uFlakeCol;
// kuvatavat
uniform float uMist, uZen, uDrift, uRipple, uRidgeFade, uTooth, uSparkY, uMelOn, uMelRange;
uniform vec3 uZenCol, uRidgeCol, uRidgeMist, uSpotCol;
uniform vec4 uRidge;     // näkyviä kerroksia, kauimman harjan korkeus (rad), lähimmän harjan korkeus (rad), harjan vaihtelu (rad)
uniform vec4 uSpot;      // suunta sivulle (rad), korkeus (rad), voimakkuus, kerros jonka takana (0 kaukana .. 6 lähellä)
uniform float uMel[32];  // ylälinjan korkeus ajan yli: vasen reuna on mennyttä, oikea tulevaa; alle 0 on tauko

const float PI = 3.14159265;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
vec2 hash2(vec2 p) { float n = hash(p); return vec2(n, hash(p + n + 17.13)); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
float erfa(float x) { float s = sign(x); x = abs(x); float t = 1.0 / (1.0 + 0.3275911 * x);
  float y = 1.0 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * exp(-x * x);
  return s * y; }
vec3 dirFrom(float az, float el) { return vec3(sin(az) * cos(el), sin(el), cos(az) * cos(el)); }

float gH(vec2 xz) {
  float h = uTerrain * (vnoise(xz * 0.017) * 2.0 - 1.0) + 0.10 * (1.0 - uIce) * vnoise(xz * 0.8) + uDrift * (vnoise(xz * 0.45 + 3.1) * 2.0 - 1.0);
  vec2 d = xz - vec2(0.0, uCam.z + uStep.x);
  h -= uStep.y * exp(-dot(d, d) / 0.35);
  return h;
}

// Kuusi: runko ja kerroksittain riippuvat oksat. mat: 0 runko, 1 oksisto.
float sdTree(vec3 p, float h, out float mat) {
  float H = uTreeH * (0.7 + 0.6 * h);
  float y01 = clamp(p.y / H, 0.0, 1.0);
  float ang = atan(p.z, p.x);
  float rad = length(p.xz);
  float r = uTrunkR * (0.7 + 0.6 * fract(h * 7.3)) * (1.0 - 0.65 * y01) * (1.0 + 0.12 * vnoise(vec2(ang * 5.0 + h * 9.0, p.y * 1.3)));
  float dT = max(rad - r, p.y - H);
  float sag = mix(0.45, 0.15, uFrost);
  float ys = p.y + sag * rad;
  float cb = uCanopyBase * (0.6 + 0.8 * fract(h * 3.1));
  float c01 = clamp((p.y - cb) / max(H - cb, 0.01), 0.0, 1.0);
  float ty = ys * uTier - h * 10.0;
  float tier = 1.0 - fract(ty);
  float fl = floor(ty);
  float R = uCanopyR * (0.6 + 0.8 * fract(h * 5.7)) * pow(1.0 - c01, 0.8) * (0.55 + 0.45 * tier);
  float lobes = mix(0.6 * sin(ang * 7.0 + h * 40.0 + fl * 2.4) + 0.4 * sin(ang * 13.0 + fl * 4.1), cos(ang * 6.0 + fl * 0.5236), uFrost);
  R *= 0.72 + 0.28 * lobes;
  R *= 0.88 + 0.24 * vnoise(vec2(ang * 9.0, p.y * 4.0 + h * 3.0));
  float dC = max(max(rad - R, cb - ys), p.y - H);
  mat = dC * 0.4 < dT ? 1.0 : 0.0;
  return min(dT, dC * 0.4);
}

// mat: 0 maa, 1 runko, 2 oksisto, 3 jääkatto
float map(vec3 p, out float mat) {
  float d = 1e5; mat = 0.0;
  if (uGround > 0.5) { d = (p.y - gH(p.xz)) * 0.8; }
  if (uCeil > 0.0) { float c = uCeil - p.y + 0.4 * vnoise(p.xz * 0.15); if (c < d) { d = c; mat = 3.0; } }
  vec2 q = p.xz / uCell; vec2 ic = floor(q); vec2 o = step(0.5, fract(q)) - 1.0;
  for (int j = 0; j < 2; j++) for (int i = 0; i < 2; i++) {
    vec2 c = ic + o + vec2(float(i), float(j));
    float h = hash(c);
    if (h >= uDensity) continue;
    vec2 tp = (c + 0.25 + 0.5 * hash2(c + 3.3)) * uCell;
    if (abs(tp.x) < uPath) continue;
    if (tp.y > uClear.x && tp.y < uClear.y) continue;
    float base = uGround > 0.5 ? gH(tp) - 0.3 : uBaseY - 5.0 * hash(c + 9.1);
    float m; float dt = sdTree(vec3(p.x - tp.x, p.y - base, p.z - tp.y), fract(h * 91.7), m);
    if (dt < d) { d = dt; mat = 1.0 + m; }
  }
  return d;
}

vec3 normalAt(vec3 p, float e) {
  float m; vec2 k = vec2(1.0, -1.0);
  return normalize(k.xyy * map(p + k.xyy * e, m) + k.yyx * map(p + k.yyx * e, m) + k.yxy * map(p + k.yxy * e, m) + k.xxx * map(p + k.xxx * e, m));
}

float treeline(float az) {
  float x = az * 95.0 + 0.3 * sin(az * 31.0); float i = floor(x), f = fract(x);
  float tip = (1.0 - abs(f - 0.5) * 2.0) * (0.3 + 0.7 * hash(vec2(i, 3.0)));
  return uTreeline * (0.45 + 0.55 * tip + 0.5 * vnoise(vec2(az * 24.0, 1.0)));
}

// Se, mitä näkyy kaiken takana ja mihin kaukainen häipyy. k: terävien valojen osuus (0..1).
vec3 sky(vec3 rd, float k) {
  float az = atan(rd.x, rd.z), el = asin(clamp(rd.y, -1.0, 1.0));
  vec3 c = uFogCol * mix(1.0, uFogDown, smoothstep(0.0, -0.5, el)) * mix(1.0, 0.4, smoothstep(0.0, 0.45, el));
  // usvan lautat: vaakasuoria vaaleampia ja tummempia vöitä, jotka ajelehtivat
  c *= 1.0 + uMist * 0.7 * (vnoise(vec2(az * 2.2 + uTime * 0.012, el * 11.0 - uTime * 0.004)) + 0.5 * vnoise(vec2(az * 7.0 - uTime * 0.02, el * 30.0)) - 0.75);
  c += uZenCol * uZen * smoothstep(0.25, 1.0, rd.y);
  float sa = (az - uSlit.x) / uSlit.z, se = (el - uSlit.y) / uSlitTall;
  float halo = exp(-pow((az - uSlit.x) / (uSlit.z * 7.0 + 0.06), 2.0)) * exp(-pow((el - uSlit.y) / (uSlitTall * 2.2), 2.0));
  c += uSlitCol * uSlit.w * (k * exp(-sa * sa) * exp(-se * se) + 0.10 * halo);
  float sd = max(dot(rd, dirFrom(uSun.x, uSun.y)), 0.0);
  c += uSunCol * uSun.w * (0.8 * k * pow(sd, uSun.z) + 0.05 * pow(sd, 4.0));
  if (uHorizon > 0.0) {
    float tl = treeline(az);
    float above = smoothstep(tl - 0.0012, tl + 0.0012, el);
    vec3 hc = uGlowCol * uGlow.z * exp(-pow((el - uGlow.x) / uGlow.y, 2.0)) * exp(-pow(az / uGlow.w, 2.0));
    hc += uLineCol * uLine.z * exp(-pow((el - uLine.x) / uLine.y, 2.0));
    float wv = 1.0 + uBand.z * (vnoise(vec2(az * 14.0 + uTime * 0.7, uTime * 0.3)) - 0.5);
    hc += uBandCol * uBand.x * wv * smoothstep(uBand.y, 0.0, el - tl) * step(tl, el);
    c = mix(c * 0.55, c + hc * uHorizon, above);
    c += hc * uHorizon * 0.10 * (1.0 - above) * k;
  }
  // vaarat kerroksina usvassa: kauimmasta lähimpään; puu on vain reunan vihje
  if (uRidge.x > 0.0) {
    for (int kk = 0; kk < 7; kk++) {
      float fk = float(kk) / 6.0;
      if (float(kk) < 7.0 - uRidge.x) continue;
      if (uSpot.z > 0.0 && abs(float(kk) - uSpot.w) < 0.5) {
        float ga = (az - uSpot.x) / 0.10, ge = (el - uSpot.y) / 0.022;
        c += uSpotCol * uSpot.z * exp(-ga * ga - ge * ge);
      }
      float crest = mix(uRidge.y, uRidge.z, fk * (0.55 + 0.45 * fk));
      float prof = crest + uRidge.w * (0.35 + 0.65 * fk) * ((vnoise(vec2(az * (1.6 + 4.0 * (1.0 - fk)) + float(kk) * 17.3, float(kk) + uCam.z * 0.0006 * fk)) - 0.5) * 2.0
        + 0.35 * (vnoise(vec2(az * 9.0 + float(kk) * 5.1, float(kk))) - 0.5));
      float tw = mix(0.0035, uTooth, fk * fk * fk);
      float x = az / tw + float(kk) * 3.7; float i = floor(x), f = fract(x);
      float hh = hash(vec2(i, float(kk) + 0.5));
      float tooth = pow(1.0 - abs(f - 0.5) * 2.0, 1.4) * (0.35 + 1.0 * hh) * tw * 3.0;
      // kuusen oksakerrokset: reuna on porrastettu, ei sileä kolmio
      tooth *= 0.86 + 0.14 * step(0.5, fract((el - prof) / (tw * 0.42)));
      float d = prof + tooth - el;
      float soft = mix(0.0022, 0.0007, fk);
      float a = smoothstep(-soft, soft, d);
      vec3 tone = mix(uRidgeMist, uRidgeCol, fk * fk);
      float below = clamp(d / (uRidge.w * 1.3 + 0.03), 0.0, 1.0);
      vec3 mistc = uRidgeMist + uGlowCol * uGlow.z * 0.5 * (1.0 - fk) * exp(-pow(az / uGlow.w, 2.0));
      tone = mix(tone, mistc, below * (0.85 - 0.55 * fk));
      tone *= 1.0 + uMist * 0.5 * (vnoise(vec2(az * 5.0 + float(kk) * 9.0 + uTime * 0.01, el * 40.0)) - 0.5);
      float sw = clamp(uRidgeFade - float(kk), 0.0, 1.0);
      tone = mix(tone, uBandCol * (0.55 + 0.45 * uBand.x), sw);
      c = mix(c, tone, a * mix(1.0, 0.75, sw));
    }
  }
  return c;
}

float fogAmount(vec3 ro, vec3 rd, float t) {
  float low = exp(-max(ro.y + rd.y * t * 0.5, 0.0) * uFogLow);
  vec3 pm = ro + rd * t * 0.6;
  float bank = 1.0 + uMist * (vnoise(vec2(pm.x * 0.09 + uTime * 0.02, pm.y * 0.4 + pm.z * 0.06)) * 2.0 - 1.0);
  return 1.0 - exp(-uFogDen * bank * t * mix(1.0, low * 2.5, step(0.0001, uFogLow)));
}

float flakes(vec3 ro, vec3 rd, float thit) {
  float a = 0.0;
  for (int k = 0; k < 3; k++) {
    float dk = k == 0 ? 1.2 : (k == 1 ? 3.5 : 9.0);
    float tk = dk / max(rd.z, 0.05);
    if (tk > thit) continue;
    vec3 p = ro + rd * tk;
    float s = k == 0 ? 0.07 : (k == 1 ? 0.11 : 0.2);
    vec2 g = (p.xy + vec2(uTime * (2.0 + float(k)) * uFlake.z, -uTime * 0.6)) / s + float(k) * 13.7;
    g.y += p.z * 0.37 + 7.0 * hash(vec2(floor(g.x), float(k)));
    vec2 ic = floor(g), f = fract(g);
    float h = hash(ic);
    if (h > uFlake.x * 0.45) continue;
    vec2 c = 0.15 + 0.7 * hash2(ic + 1.7);
    vec2 d = (f - c) * vec2(1.0 / (1.0 + 2.5 * uFlake.z), 1.0);
    a += smoothstep(0.03 + 0.07 * fract(h * 53.0), 0.0, length(d)) * (0.5 + 0.5 * fract(h * 37.0)) / float(k + 1);
  }
  return a;
}

vec3 render(vec2 frag) {
  vec2 uv = (frag - 0.5 * uRes) / (0.5 * uRes.y);
  vec3 rd = normalize(vec3(uv.x * uFov, uv.y * uFov, 1.0));
  float cp = cos(uPitch), sp = sin(uPitch);
  rd = vec3(rd.x, rd.y * cp + rd.z * sp, rd.z * cp - rd.y * sp);
  vec3 ro = uCam;

  float t = 0.05, mat = 0.0; bool hit = false;
  for (int i = 0; i < 340; i++) {
    float m; float d = map(ro + rd * t, m);
    if (d < 0.0015 * t + 0.0005) { hit = true; mat = m; break; }
    t += clamp(d * 0.7, 0.01, uCell * 0.5);
    if (t > uFar) break;
  }

  vec3 col;
  float thit = hit ? t : uFar;
  vec3 Lslit = dirFrom(uSlit.x, uSlit.y);
  vec3 Lsun = dirFrom(uSun.x, uSun.y);
  // valon leikkaus: pystytaso, joka tulee kaukaa edestä kameran ohi
  vec3 cn = normalize(vec3(1.0, 0.0, uCut.x / uCut.w));
  vec3 cp0 = vec3(uCut.x, 0.0, uCam.z);
  float s0 = dot(cn, ro - cp0), sn = dot(cn, rd);

  if (hit) {
    vec3 p = ro + rd * t;
    vec3 n = normalAt(p, 0.002 * t + 0.002);
    vec3 alb; float snow = 0.0;
    if (mat < 0.5) {
      alb = mix(uSnowCol, vec3(0.012, 0.016, 0.022), uIce);
      snow = 1.0 - uIce;
    } else if (mat < 2.5) {
      alb = mat < 1.5 ? uTrunkCol * (0.6 + 0.8 * vnoise(vec2(atan(n.z, n.x) * 6.0, p.y * 3.0))) : uNeedleCol;
      snow = smoothstep(0.25, 0.6, n.y) * uSnow * (mat < 1.5 ? 0.3 : 1.0);
      alb = mix(alb, uSnowCol, snow);
      alb = mix(alb, uFrostCol * (0.5 + 0.5 * abs(n.x + n.z)), uFrost);
    } else {
      alb = vec3(0.03, 0.05, 0.07) * (0.5 + vnoise(p.xz * 0.6));
    }
    vec3 sunLit = vec3(0.0);
    vec3 lit = uAmb * (0.35 + 0.65 * max(n.y, 0.0));
    lit += uSlitCol * uSlit.w * 0.25 * max(dot(n, Lslit), 0.0);
    float sheen = pow(max(dot(reflect(rd, n), Lslit), 0.0), 6.0);
    lit += uSlitCol * uSlit.w * sheen * (0.3 + 1.2 * snow + 1.5 * uFrost + 2.0 * uIce);
    if (uSun.w > 0.001) {
      float sh = 1.0, ts = 0.15;
      for (int i = 0; i < 28; i++) { float m; float d = map(p + n * 0.03 + Lsun * ts, m); sh = min(sh, 9.0 * d / ts); ts += clamp(d, 0.08, 1.5); if (sh < 0.02) break; }
      sh = clamp(sh, 0.0, 1.0);
      sunLit = uSunCol * uSun.w * sh * (0.55 * max(dot(n, Lsun), 0.0) + 0.2 * pow(max(dot(reflect(rd, n), Lsun), 0.0), 4.0));
    }
    float sc = dot(cn, p - cp0);
    lit += uCutCol * uCut.z * 0.7 * exp(-pow(sc / (uCut.y * 4.0), 2.0)) * (0.4 + 0.6 * abs(dot(n, cn)));
    lit += (uGlowCol * uGlow.z * 0.22 + uLineCol * uLine.z * 0.05) * uHorizon * (0.4 + 0.6 * max(n.y, 0.0)) * (0.4 + snow);
    if (mat > 2.5) lit += uSlitCol * uSlit.w * 0.5 * pow(max(dot(reflect(rd, n), Lslit), 0.0), 10.0);
    col = alb * lit + sunLit * (0.10 + 0.5 * dot(alb, vec3(0.333)));
    // musta jää: metsä näkyy pinnassa ylösalaisin; syke kulkee pinnassa aaltona
    if (uIce > 0.0 && mat < 0.5) {
      vec2 dc = p.xz - uCam.xz;
      vec3 nn = normalize(n + vec3(dc.x, 0.0, dc.y) / (length(dc) + 0.3) * uRipple * 0.05 * sin(length(dc) * 5.0 - uTime * 5.0));
      vec3 rr = reflect(rd, nn);
      float tr = 0.1, rm = 0.0; bool rh = false;
      for (int i = 0; i < 150; i++) {
        float m2; float d2 = map(p + rr * tr, m2);
        if (d2 < 0.003 * tr + 0.001) { rh = true; rm = m2; break; }
        tr += clamp(d2 * 0.8, 0.02, uCell * 0.5);
        if (tr > uFar * 0.6) break;
      }
      vec3 rc = sky(rr, 1.0);
      if (rh) { float fr = fogAmount(p, rr, tr); rc = mix(uTrunkCol * uAmb, sky(rr, fr * fr), fr); }
      float crack = smoothstep(0.018, 0.0, abs(vnoise(p.xz * 0.7) - 0.5)) + 0.6 * smoothstep(0.012, 0.0, abs(vnoise(p.xz * 2.3 + 9.0) - 0.5));
      col = mix(col, rc, uIce * 0.9) + uSnowCol * 0.018 * crack * uIce;
    }
    // väike: pilkahdukset oksiston pinnalla
    if (uSpark > 0.0 && mat > 1.5) {
      vec3 g = floor(p * 26.0);
      float hs = hash(g.xy + g.z * 7.31);
      float tw = step(0.6, fract(hs * 91.0 + floor(uTime * 6.0) * 0.618));
      float band = exp(-pow((p.y - uSparkY) / 0.7, 2.0));
      col += uSlitCol * 4.0 * uSpark * step(0.985, hs) * tw * (0.15 + band);
    }
    float f = fogAmount(ro, rd, t);
    col = mix(col, sky(rd, f * f), f);
  } else {
    col = sky(rd, 1.0);
  }

  // valon leikkaus ilmassa
  if (uCut.z > 0.001) {
    float w = uCut.y;
    float I = abs(sn) > 1e-4 ? (w * 0.8862 / abs(sn)) * abs(erfa((s0 + thit * sn) / w) - erfa(s0 / w)) : thit * exp(-s0 * s0 / (w * w));
    col += uCutCol * uCut.z * 0.004 * min(I * I, 160.0);
  }
  // säikeet: ohuiden valoviivojen kimput kolmessa syvyydessä. Kun ylälinja on mitattu, viiva piirtää sen korkeuden
  // ajan yli: kuvan vasen reuna on juuri mennyttä, oikea juuri tulevaa.
  if (uStrand.x > 0.001) {
    float su = clamp(frag.x / uRes.x, 0.0, 1.0) * 31.0;
    int i0 = int(floor(su)); int i1 = min(i0 + 1, 31);
    float m0 = uMel[i0], m1 = uMel[i1];
    float fm = smoothstep(0.0, 1.0, fract(su));
    float mel = mix(m0, m1, fm);
    float on = uMelOn > 0.5 ? smoothstep(-0.2, 0.05, min(m0, m1)) : 1.0;
    for (int k = 0; k < 3; k++) {
      float dk = uStrand.z * (k == 0 ? 1.0 : (k == 1 ? 1.9 : 3.4));
      float tk = dk / max(rd.z, 0.05);
      if (tk > thit) continue;
      vec3 p = ro + rd * tk;
      float fk = float(k);
      float tr = 1.0 - fogAmount(ro, rd, tk);
      float base = uMelOn > 0.5 ? uStrand.y + uMelRange * (mel - 0.5) * (1.0 + 0.9 * fk) + fk * 0.5
                                : uStrand.y + fk * 0.9 + 0.5 * sin(p.x * 0.45 + fk * 2.1 + uTime * 0.5);
      for (int f = 0; f < 4; f++) {
        float ff = float(f);
        float y = base + (0.06 + 0.03 * ff) * sin(p.x * (1.3 + 0.37 * ff) + fk * 5.0 + ff * 1.9 - uTime * 0.8) + 0.04 * ff;
        float d = abs(p.y - y) / (uStrand.w * (1.0 + 0.6 * fk));
        col += uStrandCol * uStrand.x * on * 0.45 * exp(-d * d) * tr / (1.0 + 0.6 * fk);
      }
    }
  }
  if (uFlake.x > 0.001) {
    col *= 1.0 + 0.5 * uFlake.z * uFlake.x * (vnoise(rd.xy * vec2(5.0, 9.0) + uTime * vec2(1.3, 0.2)) + 0.5 * vnoise(rd.xy * 21.0 - uTime) - 0.75);
    col += uFlakeCol * uFlake.y * flakes(ro, rd, thit);
    // tuuli näkyy viivoina, kun viiru on suuri
    vec2 wd = normalize(vec2(1.0, -0.22));
    float wl = vnoise(vec2(dot(rd.xy, vec2(-wd.y, wd.x)) * 130.0, dot(rd.xy, wd) * 2.5 - uTime * 3.0));
    col += uFlakeCol * uFlake.y * 0.9 * max(uFlake.z - 0.6, 0.0) * smoothstep(0.70, 0.96, wl);
  }
  return col;
}

void main() {
  vec3 c = vec3(0.0);
  int n = int(uAA);
  for (int j = 0; j < n; j++) for (int i = 0; i < n; i++) {
    c += render(gl_FragCoord.xy + (vec2(float(i), float(j)) + 0.5) / float(n) - 0.5);
  }
  c /= float(n * n);
  c = c / (1.0 + 0.35 * c);
  c = pow(max(c, 0.0), vec3(1.0 / 2.2));
  c += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  outColor = vec4(c, 1.0);
}`;
