// Esimerkkimoduuli ja rajakuvien tarkistus: näyttää viisi rajakuvaa peräkkäin (4 s kukin) ja niiden välissä ristihäivytyksen.
// Tämä on myös malli siitä, miten maailman moduuli käyttää yhteistä pohjaa (visual/yhteinen.js).
// Katsominen: node render/lukittu.mjs --data build/rattle_koko --page "visual/maailma.html?m=rajat" --stills 2,6,10,14,18 --dir runs/rajat/stills
import { lataa, luoGL, julkaise, FS_ALKU, GLSL_YHTEINEN, FS_LOPPU, clamp } from './yhteinen.js';

const FS = FS_ALKU + `
uniform float uTime;
uniform float uKeski;     // keskirekisterin voima 0..1 (esimerkki äänestä mitatusta signaalista)
` + GLSL_YHTEINEN + `
vec3 scene(vec2 p) {
  float k = uTime / 4.0;
  int a = int(clamp(floor(k), 0.0, 4.0)), b = min(a + 1, 4);
  vec3 col = mix(rajakuva(p, a, uTime), rajakuva(p, b, uTime), smoothstep(0.75, 1.0, fract(k)));
  col += HALLA * 0.02 * uKeski;       // esimerkki: ääni ohjaa valoa
  return col;
}
` + FS_LOPPU;

async function alusta() {
  const d = await lataa();
  const { gl, U, piirra } = luoGL(FS);
  julkaise({
    gl, aika: d.aika,
    kuvaus: (t) => ({ keski: +d.keski(t).toFixed(2), pitka: +d.pitka(t).toFixed(2), melodia: +d.melodia(t).toFixed(1), alkuja: d.alut.length, iskuja: d.iskut.length }),
    seek: (t) => { gl.uniform1f(U('uTime'), clamp(t, 0, 20)); gl.uniform1f(U('uKeski'), d.keski(t)); piirra(); },
  });
}
alusta().catch((e) => { console.error(e); window.sceneError = String(e.message || e); });
