// Tapiolan kohtaus: puhdas aikafunktio seek(t). Ei tilaa ruutujen välillä, ei ajastimia, ei satunnaisuutta.
// Kaikki musiikin ajat tulevat ohjaustiedostosta (annotations/cues.json): ankkurit, nuotit, iskut ja spektri.
//
// KUVA ON ÄÄNI. Jokainen nuotti, jonka kuuntelutyökalu kuuli, on kuvan tapahtuma:
//   jousten ääni        puu: tumma kuusi, jonka latvan korkeus on sävelkorkeus; se kasvaa äänen alkaessa ja väistyy sen lakatessa
//   teoksen pitkä ääni  horisontin viiva (alussa gis): valon määrä on äänen voima ruutu ruudulta
//   paisutus viivalla   kukkula, joka nousee viivasta ja painuu takaisin; terävyys ja hartiat tulevat yläsävelistä (kuka soittaa)
//   puhaltimen ääni     harju korkeutensa kohdalla metsän takana
//   lyhyt korkea ääni   pilkahdus korkeutensa kohdalla
//   basso, patarummut   maa: sysäys, värinä, hohto
//   vaskien isku        pystysuora leikkaus kaikkien kerrosten läpi
// Aikajana alla sanoo vain, KUKA soittaa missäkin (jouset vai puhaltimet) ja mikä on pitkä ääni; ne tulevat kuunteluoppaasta.

import { VERT, FRAG } from './kerrokset.glsl.js';

const lin = (hex, k = 1) => [1, 3, 5].map((i) => Math.pow(parseInt(hex.slice(i, i + 2), 16) / 255, 2.2) * k);
export const PALETTI = { hamy: '#0b1719', salo: '#163a66', halla: '#cfe1ee', noki: '#0c0a09', punainen: '#c8281c', kajo: '#f3ead6' };
const C = PALETTI;

const PERUS = {
  jouset: 1, viiva: 68, viivaVoima: 1, viivaPohja: 0.3, kukkulat: 1, harjut: 1, vaike: 0, leikkaus: 0, tuuli: 0, reuna: 0.05, puut: 1, kt: 1, seis: 0, kulku: '',
  kerroksia: 2, tiheys: 1, lahi: 4, stack: 0, pan: [0, 0], trunk: 0.07, frost: 0, reflect: 0, crown: 0,
  maaY: 0.13, pLo: 50, pHi: 98, zoom: 1, mist: 0.6, dark: 0,
  snow: [0, 0.4, 0.5, 0.5],
  skyTop: lin(C.salo, 0.08), skyLow: lin(C.salo, 0.30), mistCol: lin('#6d86a3', 0.35), treeNear: lin(C.noki, 0.55), treeFar: lin('#16243a', 0.38),
  groundCol: lin(C.noki, 0.6), lightCol: lin('#a9c4e6', 1.5), snowCol: lin(C.halla, 0.5), cutCol: lin(C.halla, 2.2), warmCol: lin(C.kajo, 1.0), sunCol: lin(C.punainen, 2.0),
  glow: [0.5, 0.08, 0, 1.2], sun: [0.3, 0.6, 0, 0.2],
};
// Nämä vaihtuvat ankkurissa kerralla (kuka soittaa); kaikki muu liukuu ankkurista seuraavaan.
const ASKEL = new Set(['jouset', 'viiva', 'kt', 'seis', 'kulku']);
// Kulku jonkin läpi: kuvatapa vaihtuu verhon takana, ja lähestyminen jatkuu sen läpi (kamera ei peruuta).
const VERHOT = { lumi: lin('#8b98a5', 0.9), usva: lin('#22364f', 0.9), pimea: [0.0015, 0.002, 0.003], huurre: lin('#9fb4c8', 0.8) };
const m = (...os) => Object.assign({}, PERUS, ...os);

// Aikajana: ankkuri → tila. Roolit kuunteluoppaasta.
const KELMEA = lin('#b9c2c4', 1.3);
// Kuvatavat (tyyliohje 4b) saman kerrosmaiseman rajauksina. Jokainen on katsojan paikka; kerrostumat pysyvät samoina.
const K2_MAASTA = { kt: 2, maaY: 0.30, pHi: 90, kerroksia: 5, tiheys: 0.8, reuna: 0.06, lahi: 12, zoom: 1.32 };
const K3_YLOS = { kt: 3, maaY: 0.30, pHi: 90, kerroksia: 5, tiheys: 0.8, reuna: 0.07, lahi: 16, zoom: 1.52, pan: [0, 0.36] };
const K4_LAHI = { kt: 4, maaY: 0.30, pHi: 90, kerroksia: 5, tiheys: 1.2, reuna: 0.07, lahi: 10, zoom: 2.1, pan: [0, 0.22], frost: 1, vaike: 1,
  treeNear: lin('#101c2b', 0.9), treeFar: lin('#3a587c', 0.8), mist: 0.9, skyLow: lin(C.salo, 0.22), snowCol: lin(C.halla, 0.42) };
const K5_PINTA = { kt: 5, maaY: 0.45, pHi: 98, kerroksia: 4.5, tiheys: 0.9, reuna: 0.075, lahi: 8, zoom: 1.2, reflect: 1, groundCol: lin(C.noki, 0.3) };
const K6_RYTMI = { kt: 6, maaY: 0.05, pHi: 110, kerroksia: 5, tiheys: 0.42, reuna: 1.8, lahi: 1.8, zoom: 1.1, pan: [0, 0.42], trunk: 0.20, crown: 1, mist: 1.2, puut: 0.3,
  treeFar: lin('#2c4a73', 0.8), treeNear: lin(C.noki, 0.9), skyLow: lin(C.salo, 0.6), skyTop: lin(C.salo, 0.5), mistCol: lin('#7f9bbd', 0.5) };
const K7_PIMEA = { kt: 7, maaY: 0.2, pHi: 98, kerroksia: 5, tiheys: 0.7, reuna: 0.06, lahi: 10, zoom: 1.3, dark: 0.86 };
const K8_ULKOA = { kt: 8, maaY: 0.30, pHi: 120, kerroksia: 3, tiheys: 1.2, reuna: 0.06, lahi: 3, zoom: 1.0, reflect: 0.6, groundCol: lin(C.noki, 0.3), mist: 1.0, skyLow: lin(C.salo, 0.4) };
const K9_TUULI = { kt: 9, maaY: 0.24, pHi: 110, kerroksia: 4.5, tiheys: 0.8, reuna: 0.05, lahi: 9, zoom: 1.3, mist: 1.3,
  skyLow: lin('#55616c', 0.8), skyTop: lin('#3a444e', 0.6) };
const K10_YLHAALTA = { kt: 10, maaY: 0.08, pLo: 50, pHi: 74, kerroksia: 5, tiheys: 1.0, reuna: 0.04, lahi: 4.5, stack: 0.62, zoom: 1.0, puut: 0.5, mist: 0.9 };
const SUN = (v) => [0.80, 0.92, v, 0.34];
const KAJO = { glow: [0.82, 0.07, 0.75, 1.1], warmCol: lin(C.kajo, 1.0), lightCol: lin(C.kajo, 1.2) };

const AVAIMET = [
  // 1 Metsän idea: horisontti, josta kaikki kasvaa
  ['tiedoston_alku', m({ jouset: 1, reuna: 0.03, viivaPohja: 0 })],
  ['avaus_patarumpu', m({ jouset: 1, reuna: 0.032, viivaPohja: 0, zoom: 1.01 })],
  ['gis_pitka_aani_alku', m({ jouset: 1, reuna: 0.035, zoom: 1.015 })],
  ['jouset_tulevat', m({ jouset: 1, reuna: 0.04, zoom: 1.02 })],
  ['gis_paljastuu', m({ jouset: 0, zoom: 1.03, reuna: 0.05 })],
  ['siemen_toistuu', m({ jouset: 1, zoom: 1.06, reuna: 0.055 })],
  ['puhallinkuviot_alku', m({ jouset: 0, zoom: 1.09, reuna: 0.06 })],
  ['puhallinkuviot_loppu', m({ jouset: 0, zoom: 1.16, reuna: 0.07, kerroksia: 2.5 })],
  ['patarumpu_paisuu', m({ jouset: 0, zoom: 1.18, snow: [0.03, 0.3, 0.5, 0.4], reuna: 0.075, kerroksia: 2.5 })],
  ['vaskien_isku', m({ jouset: 1, leikkaus: 1, zoom: 1.2, snow: [0.16, 1.8, 0.4, 0.6], tuuli: 1, reuna: 0.085, kerroksia: 3 })],
  ['gis_pitka_aani_loppu', m({ jouset: 1, leikkaus: 0.8, zoom: 1.21, snow: [0.3, 2.0, 0.4, 0.65], tuuli: 1, reuna: 0.09, kerroksia: 3, viivaVoima: 0.3, viivaPohja: 1, kukkulat: 0 })],
  ['fraasi_ennen_taukoa', m({ jouset: 1, zoom: 1.26, snow: [0.45, 1.4, 0.5, 0.7], mist: 0.9, tuuli: 0.4, reuna: 0.09, kerroksia: 4, lahi: 6, maaY: 0.16, viivaVoima: 0.25, viivaPohja: 1, kukkulat: 0 })],
  ['hiljaisuus_1_alku', m({ jouset: 1, zoom: 1.3, snow: [0.55, 0.4, 0.8, 0.7], mist: 1.1, reuna: 0.08, kerroksia: 4.6, lahi: 9, maaY: 0.22, viivaVoima: 0, kukkulat: 0 })],
  // 2 Maan tasalta: yleistauon lumessa katse laskeutuu maahan; fis on viiva; bassot ovat maa
  ['hiljaisuus_1_loppu', m(K2_MAASTA, { jouset: 1, viiva: 66, snow: [0.35, 0.25, 0.7, 0.6], mist: 0.9, viivaVoima: 0, kukkulat: 0 })],
  ['fis_pitka_aani', m(K2_MAASTA, { jouset: 1, viiva: 66, snow: [0.3, 0.2, 0.6, 0.55] })],
  ['valo_D_duuri', m(K2_MAASTA, { jouset: 0, viiva: 66, snow: [0.1, 0.2, 0.6, 0.5], harjut: 1.5, lightCol: KELMEA })],
  ['askeleet_alkavat', m(K2_MAASTA, { jouset: 1, viiva: 66 })],
  ['askeleet_B', m(K2_MAASTA, { jouset: 1, viiva: 66 })],
  // 3 Ylös runkoja pitkin: katse nousee nousun mukana
  ['urkupiste_H1_alku', m(K2_MAASTA, { jouset: 1, viiva: 66 })],
  ['urkupiste_H1_loppu', m(K3_YLOS, { jouset: 1, viiva: 66 })],
  ['nousu_huippu_D', m(K3_YLOS, { jouset: 0, viiva: 66, harjut: 1.5, lightCol: KELMEA, warmCol: KELMEA, glow: [1.15, 0.22, 0.5, 1.4] })],
  // 4 Lähikuva: huurteinen oksisto, pilkahdukset
  ['pohja_katoaa', m(K4_LAHI, { jouset: 1, viiva: 66 })],
  ['e_pitka_ja_kuviot', m(K4_LAHI, { jouset: 0, viiva: 64 })],
  ['nopea_liike_1_alku', m(K4_LAHI, { jouset: 0, viiva: 64 })],
  ['jannitesoinnut', m(K4_LAHI, { jouset: 1, viiva: 64, vaike: 0.3 })],
  // 5 Pinnan sisään: metsä ylösalaisin mustassa jäässä
  ['pohja_vaihtuu_D', m(K5_PINTA, { kulku: 'huurre', jouset: 1, viiva: 64 })],
  ['gis_palaa', m(K5_PINTA, { jouset: 0, viiva: 68 })],
  ['peikot_G_alku', m(K5_PINTA, { jouset: 0, viiva: 68, vaike: 1 })],
  ['peikot_G_loppu', m(K5_PINTA, { jouset: 0, viiva: 68 })],
  ['h_urkupiste_vyory', m(K5_PINTA, { jouset: 1, viiva: 68, tuuli: 0.6 })],
  ['vaskipulssit', m(K5_PINTA, { jouset: 0, viiva: 68 })],
  ['hajoaa_hiljaisuuteen', m(K5_PINTA, { jouset: 1, viiva: 68, reflect: 0.6 })],
  // 6 Runkojen rytmi: ikisalo; lopussa punainen väärä valo sivulta
  ['jousijakso_urkupiste_E_alku', m(K6_RYTMI, { kulku: 'usva', jouset: 1, viiva: 66, viivaVoima: 0.4 })],
  ['patarumpu_ppp', m(K6_RYTMI, { jouset: 1, viiva: 66, viivaVoima: 0.4 })],
  ['hitaat_soinnut', m(K6_RYTMI, { jouset: 1, viiva: 66, viivaVoima: 0.4 })],
  ['h_palaa_ennen_hiljaisuutta', m(K6_RYTMI, { jouset: 1, viiva: 66, viivaVoima: 0.4 })],
  ['hiljainen_jakso_alku', m(K6_RYTMI, { jouset: 1, viiva: 66, viivaVoima: 0.4 })],
  ['hiljainen_jakso_loppu', m(K6_RYTMI, { jouset: 0, viiva: 66, viivaVoima: 0.4, harjut: 1.5 })],
  ['vaski_tutti_620', m(K6_RYTMI, { jouset: 1, viiva: 66, viivaVoima: 0.4, leikkaus: 1 })],
  ['allegro_359', m(K6_RYTMI, { jouset: 1, viiva: 66, viivaVoima: 0.4, vaike: 1 })],
  ['c_duuri_valahdykset', m(K6_RYTMI, { jouset: 1, viiva: 66, viivaVoima: 0.4, sun: SUN(0.12) })],
  ['auringonsade', m(K6_RYTMI, { seis: 1, jouset: 1, viiva: 66, viivaVoima: 0.4, sun: SUN(0.9) })],
  // 7 Pimeä ja välähdys: väärä valo viedään; metsä näkyy vain, kun vasket leikkaavat
  ['M_ennakko', m(K6_RYTMI, { jouset: 0, viiva: 66, viivaVoima: 0.2, leikkaus: 1, sun: SUN(0.9) })],
  ['M_raskaat_askeleet', m(K7_PIMEA, { kulku: 'pimea', jouset: 0, viiva: 66, leikkaus: 0.9 })],
  ['jannitejakso_alku', m(K7_PIMEA, { jouset: 1, viiva: 66, dark: 0.7 })],
  ['O_kirjain', m(K7_PIMEA, { jouset: 0, viiva: 66, dark: 0.6 })],
  ['allegro_moderato_O_alku', m(K7_PIMEA, { jouset: 0, viiva: 66, harjut: 1.6, dark: 0.55 })],
  ['allegro_moderato_O_loppu', m(K7_PIMEA, { jouset: 0, viiva: 66, vaike: 1, dark: 0.6 })],
  ['P_vaskipaisunta', m(K7_PIMEA, { jouset: 0, viiva: 66, leikkaus: 1, harjut: 1.6, dark: 0.7 })],
  ['dim_possibile', m(K7_PIMEA, { jouset: 1, viiva: 66, dark: 0.6 })],
  // 8 Ulkoa ja kaukaa: jään yli; myrsky näkyy ensin kaukana
  ['hiljaisuus_2_alku', m(K8_ULKOA, { kulku: 'pimea', jouset: 1, viiva: 66, viivaVoima: 0, kukkulat: 0, dark: 0.25 })],
  ['myrsky_nakyy', m(K8_ULKOA, { jouset: 1, viiva: 66, viivaVoima: 0, kukkulat: 0, snow: [0.15, 0.8, 0.4, 0.5], tuuli: 0.2 })],
  ['myrsky_kasvu', m(K8_ULKOA, { jouset: 1, viiva: 66, viivaVoima: 0, kukkulat: 0, snow: [0.5, 1.8, 0.4, 0.7], tuuli: 0.6, kerroksia: 3 })],
  // 9 Tuulen sisällä
  ['myrsky_iskee', m(K9_TUULI, { jouset: 1, viiva: 66, viivaVoima: 0, kukkulat: 0, snow: [0.9, 2.6, 0.5, 0.8], tuuli: 1.3 })],
  ['Q_koko_metsa', m(K9_TUULI, { jouset: 1, viiva: 66, viivaVoima: 0, kukkulat: 0, snow: [0.9, 2.8, 0.5, 0.8], tuuli: 1.4, leikkaus: 0.8 })],
  ['myrsky_huippu', m(K9_TUULI, { jouset: 1, viiva: 66, viivaVoima: 0, kukkulat: 0, snow: [1.0, 3.0, 0.5, 0.8], tuuli: 1.5, leikkaus: 0.8 })],
  ['R_vasket', m(K9_TUULI, { jouset: 0, viiva: 66, viivaVoima: 0, kukkulat: 0, snow: [0.7, 2.2, 0.5, 0.7], tuuli: 1.0, leikkaus: 1, harjut: 1.6 })],
  ['toinen_paisunta', m(K9_TUULI, { jouset: 1, viiva: 66, viivaVoima: 0, kukkulat: 0, snow: [0.5, 1.8, 0.5, 0.7], tuuli: 0.8 })],
  // 10 Ylhäältä: vaarat kerroksina; lopussa kajo
  ['huuto', m(K10_YLHAALTA, { kulku: 'lumi', jouset: 1, viiva: 68, viivaVoima: 0.5, kukkulat: 0, snow: [0.3, 1.0, 0.5, 0.6], tuuli: 0.4, puut: 1 })],
  ['yksinaiset_aanet', m(K10_YLHAALTA, { jouset: 0, viiva: 68, snow: [0.12, 0.3, 0.5, 0.5] })],
  ['S_sempre_mf', m(K10_YLHAALTA, { jouset: 1, viiva: 68 })],
  ['loppuhuipennus', m(K10_YLHAALTA, { jouset: 1, viiva: 68 })],
  ['loppu_Hduuri_alku', m(K10_YLHAALTA, KAJO, { seis: 1, jouset: 1, viiva: 68 })],
  ['viimeiset_askeleet', m(K10_YLHAALTA, KAJO, { seis: 1, jouset: 1, viiva: 68 })],
  ['musiikki_loppuu', m(K10_YLHAALTA, KAJO, { seis: 1, jouset: 1, viiva: 68 })],
  ['tiedoston_loppu', m(K10_YLHAALTA, KAJO, { seis: 1, jouset: 1, viiva: 68 })],
];

const lerp = (a, b, k) => (Array.isArray(a) ? a.map((x, i) => x + (b[i] - x) * k) : a + (b - a) * k);
const smooth = (k) => k * k * (3 - 2 * k);
const clamp = (x, a, b) => Math.min(Math.max(x, a), b);
const fract = (x) => x - Math.floor(x);
const KULTA = 0.6180339887;

async function alusta() {
  const q = new URLSearchParams(location.search);
  const cues = await (await fetch('/annotations/cues.json')).json();
  const aika = Object.fromEntries(cues.cues.map((c) => [c.id, c.t]));
  aika.tiedoston_alku = 0;
  aika.tiedoston_loppu = cues.recording.kesto_s;
  const puuttuu = AVAIMET.filter(([id]) => aika[id] == null).map(([id]) => id);
  if (puuttuu.length) throw new Error('ankkuri puuttuu teemakartasta: ' + puuttuu.join(', '));
  const avaimet = AVAIMET.map(([id, p]) => ({ id, t: aika[id], p }));
  for (let i = 1; i < avaimet.length; i++) if (!(avaimet[i].t > avaimet[i - 1].t)) throw new Error('ankkurit eivät ole aikajärjestyksessä: ' + avaimet[i - 1].id + ' ja ' + avaimet[i].id);

  // Spektri ruututarkkuudella: puolisävelaskelet, dB.
  const oh = cues.ohjaus, sm = oh.spektri;
  if (!sm) throw new Error('ohjaustiedostossa ei ole spektriä: aja analysis/korvat.py ja make_cues.py');
  const SP = new Uint8Array(await (await fetch('/' + sm.tiedosto)).arrayBuffer());
  const NB = sm.kaistoja, FPS = oh.fps, NF = oh.frames;
  if (SP.length !== NF * NB) throw new Error('spektri.u8: koko ei vastaa ruutuja');
  const dbRuutu = (midi, f) => { const b = Math.round(midi) - sm.midi_alin; if (b < 0 || b >= NB) return sm.db_alin; return SP[clamp(f, 0, NF - 1) * NB + b] / 255 * -sm.db_alin + sm.db_alin; };
  // kaistan taso dB hetkellä t, viiden ruudun painotettuna keskiarvona (ei nyi)
  const dB = (midi, t) => { const f = t * FPS; const f0 = Math.floor(f), k = f - f0; let s = 0, w = 0;
    for (let i = -2; i <= 3; i++) { const ww = Math.max(0, 1 - Math.abs(i - k) / 3); s += ww * dbRuutu(midi, f0 + i); w += ww; } return s / w; };
  const voima = (midi, t) => clamp((dB(midi, t) + 48) / 40, 0, 1);
  const matala = (t) => { let mx = -60; for (let mi = 28; mi <= 47; mi++) mx = Math.max(mx, dB(mi, t)); return mx; };

  const NUOTIT = cues.nuotit;                      // [alku, kesto, midi], aikajärjestyksessä
  const ISKUT = cues.iskut.map((x) => ({ t: x.t, v: clamp(x.pisteet / 70, 0.15, 1) }));
  const ensimmainen = (lista, t, avain) => { let a = 0, b = lista.length; while (a < b) { const c = (a + b) >> 1; if (avain(lista[c]) < t) a = c + 1; else b = c; } return a; };
  const PISIN = NUOTIT.reduce((s, n) => Math.max(s, n[1]), 0);
  // Yläsävelet pois: kuuntelutyökalu kirjaa nuotiksi myös vahvan äänen yläsävelet (oktaavi, kvintti, terssi ylempänä).
  // Ne eivät ole soittajia. HARM: jonkin vahvemman äänen yläsävel; BHARM: basson tai patarummun yläsävel.
  const YLA = new Set([12, 19, 24, 28, 31, 34, 36, 38, 40]);
  const HARM = new Uint8Array(NUOTIT.length), BHARM = new Uint8Array(NUOTIT.length);
  for (let i = 0, j0 = 0; i < NUOTIT.length; i++) {
    const [a, k, mi] = NUOTIT[i];
    while (j0 < NUOTIT.length && NUOTIT[j0][0] < a - PISIN) j0++;
    for (let j = j0; j < NUOTIT.length && NUOTIT[j][0] <= a + k; j++) {
      if (j === i) continue;
      const [a2, k2, m2] = NUOTIT[j];
      if (!YLA.has(mi - m2)) continue;
      const yht = Math.min(a + k, a2 + k2) - Math.max(a, a2);
      if (yht < 0.5 * k) continue;
      const f = Math.round((Math.max(a, a2) + yht / 2) * FPS);
      if (m2 < 48) BHARM[i] = 1; else if (dbRuutu(m2, f) >= dbRuutu(mi, f) - 4) HARM[i] = 1;
    }
  }
  const PURSKEET = cues.tapahtumat.filter((e) => e.tyyppi === 'purske');
  const purske = (t) => PURSKEET.some((e) => t >= e.alku && t <= e.loppu);

  // Lähestyminen: jokaisen kuvatavan sisällä kuva lähestyy tasaisesti (paitsi nimetyissä pysähdyksissä).
  // matka = aika ilman pysähdyksiä; jakson alku ja loppu ovat kuvatavan ensimmäinen ja seuraavan ensimmäinen avain.
  let mk = 0;
  avaimet.forEach((a, i) => { a.matka = mk; if (i + 1 < avaimet.length && !a.p.seis) mk += avaimet[i + 1].t - a.t; });
  avaimet.forEach((a, i) => { let j = i; while (j > 0 && avaimet[j - 1].p.kt === a.p.kt) j--; let e = i; while (e + 1 < avaimet.length && avaimet[e + 1].p.kt === a.p.kt) e++;
    a.m0 = avaimet[j].matka; a.m1 = avaimet[Math.min(e + 1, avaimet.length - 1)].matka; });
  const AJO = 0.14;
  const ajo = (a, matkaNyt) => (a.p.kt === 1 ? 1 : 1 + AJO * clamp((matkaNyt - a.m0) / Math.max(a.m1 - a.m0, 1), 0, 1));

  function tila(t) {
    t = clamp(t, 0, aika.tiedoston_loppu);
    let i = 0;
    while (i + 2 < avaimet.length && avaimet[i + 1].t <= t) i++;
    const a = avaimet[i], b = avaimet[i + 1];
    const k = clamp((t - a.t) / (b.t - a.t), 0, 1), s = smooth(k);
    const matkaNyt = a.matka + (a.p.seis ? 0 : t - a.t);
    const p = {};
    if (b.p.kulku) {
      // kulku jonkin läpi: vaihto tapahtuu verhon takana jakson keskellä; lähestyminen kiihtyy verhoon ja jatkuu sen takaa
      const tm = (a.t + b.t) / 2, puoli = Math.min(2.6, (b.t - a.t) / 2);
      const ennen = t < tm;
      for (const key of Object.keys(PERUS)) p[key] = ennen ? a.p[key] : b.p[key];
      const lahella = smooth(clamp(1 - Math.abs(t - tm) / puoli, 0, 1));
      p.zoom = ennen ? a.p.zoom * ajo(a, matkaNyt) * (1 + 0.6 * lahella * lahella) : b.p.zoom * (1 - 0.18 * lahella);
      p.verho = [...VERHOT[b.p.kulku], lahella];
      p.kulku = '';
    } else {
      for (const key of Object.keys(PERUS)) p[key] = ASKEL.has(key) ? a.p[key] : lerp(a.p[key], b.p[key], s);
      p.zoom = lerp(a.p.zoom * ajo(a, matkaNyt), b.p.zoom * (a.p.kt === b.p.kt ? ajo(b, matkaNyt) : 1), a.p.kt === b.p.kt ? 0 : s);
      if (a.p.kt === b.p.kt) p.zoom = lerp(a.p.zoom, b.p.zoom, s) * ajo(a, matkaNyt);
      p.verho = [0, 0, 0, 0];
    }
    return p;
  }
  const rooli = (t) => tila(t);

  // Viivan paisutukset: äänen tason huiput viivan sävelellä. Jokainen on yksi soittaja, joka tulee esiin.
  const paisutukset = new Map();
  function viivanPaisutukset(midi) {
    if (paisutukset.has(midi)) return paisutukset.get(midi);
    const e = new Float32Array(NF);
    for (let f = 0; f < NF; f++) { let s = 0; for (let i = -4; i <= 4; i++) s += dbRuutu(midi, f + i); e[f] = s / 9; }
    const out = [];
    let f = 5;
    while (f < NF - 5) {
      if (e[f] > -36 && e[f] >= e[f - 1] && e[f] > e[f + 1]) {
        let l = f, r = f;
        while (l > 1 && e[l - 1] <= e[l] && f - l < 3 * FPS) l--;
        while (r < NF - 2 && e[r + 1] <= e[r] && r - f < 3 * FPS) r++;
        const pohja = Math.max(e[l], e[r]);
        if (e[f] - pohja >= 0.7 && (!out.length || f - out[out.length - 1].f > 0.8 * FPS)) {
          const run = Math.max(dbRuutu(midi + 12, f), dbRuutu(midi + 19, f), dbRuutu(midi + 24, f), dbRuutu(midi + 28, f)) - e[f];
          out.push({ f, t0: l / FPS, t1: r / FPS, tp: f / FPS, pohja: Math.min(e[l], e[r]), huippu: e[f], runsaus: clamp((run + 26) / 20, 0, 1), k: out.length });
        }
        f = r + 1;
      } else f++;
    }
    paisutukset.set(midi, { e, out });
    return paisutukset.get(midi);
  }

  const canvas = document.getElementById('c');
  const gl = canvas.getContext('webgl2', { antialias: false, preserveDrawingBuffer: true });
  if (!gl) throw new Error('WebGL2 ei käytettävissä');
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error('varjostin: ' + gl.getShaderInfoLog(s)); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('varjostin: ' + gl.getProgramInfoLog(prog));
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = (n) => gl.getUniformLocation(prog, n);
  const aa = Number(q.get('aa') || (q.get('mode') === 'render' ? 2 : 1));
  const ASP = canvas.width / canvas.height;

  // Mitä kuvassa on hetkellä t: lasketaan äänestä joka kerta alusta.
  function kuva(t) {
    const p = tila(t);
    const Y = (midi) => p.maaY + 0.03 + (midi - p.pLo) / (p.pHi - p.pLo) * (0.95 - p.maaY);
    const puut = [], harjut = [], kukkulat = [], pilk = [];
    const i0 = ensimmainen(NUOTIT, t - PISIN - 1.2, (n) => n[0]);
    for (let i = i0; i < NUOTIT.length && NUOTIT[i][0] <= t + 0.25; i++) {
      const [alku, kesto, midi] = NUOTIT[i];
      const ika = t - alku, jalki = t - (alku + kesto);
      if (jalki > 1.2 || midi < 48) continue;
      const r = rooli(alku + 0.05);
      if (BHARM[i] || (ika < 0 && r.jouset <= 0.5)) continue;
      const L = voima(midi, Math.min(t, alku + kesto));
      if (Math.abs(midi - r.viiva) < 0.5) continue;                       // teoksen pitkä ääni on viiva, ei puu
      if (kesto < 0.35 && midi >= 76) {                                    // lyhyt korkea ääni: pilkahdus
        const vg = Math.max(p.vaike, purske(alku) ? 1 : 0);
        if (jalki < 0.25 && ika >= 0 && !HARM[i] && vg > 0) pilk.push({ x: ASP * fract(alku * 7.13 + midi * 0.17), y: Y(midi), v: vg * L * Math.sin(Math.PI * clamp(ika / (kesto + 0.25), 0, 1)), koko: 0.004 + 0.004 * L });
        continue;
      }
      if (kesto < 0.18) continue;
      const nousu = smooth(clamp(ika / 0.45, 0, 1));
      const lasku = 1 - smooth(clamp(jalki / 0.9, 0, 1));
      if (r.jouset > 0.5) {
        if (HARM[i]) continue;
        // jousten ääni on kuusiryhmä. Paikka, syvyys ja muoto ovat sävelen omat: sama sävel palaa samana ryhmänä samaan
        // paikkaan (siemen tunnistuu). Korkein puu yltää sävelen korkeuteen. Äänen voima näkyy huojuntana ja kokona.
        // Ryhmä alkaa kasvaa hieman ennen äänen alkua, jotta se on pystyssä, kun ääni soi; se on aina läpinäkymätön.
        const x0 = ASP * (0.07 + 0.86 * fract(midi * KULTA + 0.31));
        const n = kesto >= 1.2 ? 6 : 3;
        const kasvu = smooth(clamp((ika + 0.2) / 0.45, 0, 1));
        for (let j = 0; j < n; j++) {
          const h1 = fract(midi * 0.754 + j * 0.3819 + 0.11), h2 = fract(midi * 0.317 + j * 0.6180 + 0.53);
          const syv = j === 0 ? 0.12 + 0.3 * h2 : 0.1 + 0.8 * h2;
          const kork = (Y(midi) - p.maaY) * (j === 0 ? 1 : 0.5 + 0.45 * h1) * (0.96 + 0.08 * L);
          const top = p.maaY + kork * (0.06 + 0.94 * kasvu) * (0.12 + 0.88 * lasku);
          puut.push({ x: x0 + ASP * (j === 0 ? 0 : (h1 - 0.5) * 0.17 + (j % 2 ? 0.03 : -0.03)), top, w: kork * (0.15 + 0.06 * h2) * (1.25 - 0.35 * syv), syv,
            a: p.puut * clamp(lasku / 0.12, 0, 1) * clamp((ika + 0.2) / 0.1, 0, 1), siemen: fract(midi * 0.137 + j * 0.291) + 0.01, huoj: (0.014 + 0.045 * L) * (1 + 1.5 * p.tuuli),
            tarkeys: kesto * (0.5 + L) * (j === 0 ? 2 : 1) });
        }
      } else if (kesto >= 0.6 && !HARM[i]) {
        // puhaltimen ääni on harju metsän takana; lyhyt kuvio viivan yläpuolella on kaari, joka nousee viivasta ja palaa
        const kaari = midi > r.viiva && midi <= r.viiva + 10 && kesto < 1.6;
        if (kaari) kukkulat.push({ x: ASP * (0.15 + 0.7 * fract(alku * 0.41 + 0.2)), h: (Y(midi) - Y(r.viiva)) * Math.sin(Math.PI * clamp(ika / (kesto + 0.3), 0, 1)) * (0.4 + 0.6 * L), w: 0.035, ter: 0.2 });
        else harjut.push({ y: Y(midi), v: p.harjut * 0.5 * L * nousu * lasku, x: ASP * (0.1 + 0.8 * fract(alku * 0.37 + midi * 0.21)), h: 0.012 + 0.05 * L * L,
          ter: clamp((Math.max(dB(midi + 12, t), dB(midi + 19, t)) - dB(midi, t) + 26) / 20, 0, 1), w: 0.10, tarkeys: L * kesto });
      }
    }
    // viiva ja sen kukkulat
    const vm = Math.round(p.viiva);
    let vs = 0; for (let i = -4; i <= 4; i++) vs += voima(vm, t + i * 0.07);
    const vv = p.viivaVoima * Math.max(vs / 9, p.viivaPohja);
    const { e, out } = viivanPaisutukset(vm);
    const fNyt = clamp(Math.round(t * FPS), 0, NF - 1);
    for (let k = out.length - 1; k >= 0 && kukkulat.length < 12; k--) {
      const s = out[k];
      if (s.t0 > t || t - s.t1 > 40) continue;
      const kork = p.kukkulat * 0.13 * clamp((s.huippu - s.pohja) / 6, 0.35, 1.3);
      const fr = clamp(t * FPS, 0, NF - 1.001), fa = Math.floor(fr), eN = e[fa] + (e[fa + 1] - e[fa]) * (fr - fa);
      const ala = Math.max(s.huippu - s.pohja, 0.5);
      const eL = e[Math.round(s.t0 * FPS)], eR = e[Math.round(s.t1 * FPS)];
      const pohjaNyt = eL + (eR - eL) * clamp((t - s.t0) / Math.max(s.t1 - s.t0, 0.05), 0, 1);
      let g = t <= s.t1 ? clamp((eN - pohjaNyt) / ala, 0, 1.1) : 0;
      const jaanne = t > s.tp ? 0.18 * Math.exp(-(t - s.tp) / 30) : 0;      // jokaisesta paisutuksesta jää maisemaan matala kumpu
      g = Math.max(smooth(clamp(g, 0, 1)), jaanne);
      kukkulat.push({ x: ASP * (0.12 + 0.76 * fract(s.k * KULTA + 0.15)), h: kork * g, w: 0.06 + 0.06 * (1 - s.runsaus), ter: s.runsaus });
    }
    // maa: basson taso on hohto, tason muutos on värinä, matala alku on sysäys
    const ml = matala(t);
    let var_ = 0;
    for (let i = -3; i <= 0; i++) var_ += Math.abs(matala(t + i / FPS) - matala(t + (i - 1) / FPS));
    const sys = [];
    const j0 = ensimmainen(NUOTIT, t - 1.6, (n) => n[0]);
    for (let i = j0; i < NUOTIT.length && NUOTIT[i][0] <= t; i++) {
      const [alku, kesto, midi] = NUOTIT[i];
      if (midi >= 48) continue;
      sys.push({ x: ASP * (0.2 + 0.6 * fract(midi * KULTA + 0.5)), ika: t - alku, v: voima(midi, alku + 0.1) });
    }
    for (let i = ensimmainen(ISKUT, t - 1.6, (x) => x.t); i < ISKUT.length && ISKUT[i].t <= t; i++) sys.push({ x: ASP * 0.5, ika: t - ISKUT[i].t, v: ISKUT[i].v });
    sys.sort((a, b) => b.v * Math.exp(-b.ika) - a.v * Math.exp(-a.ika));
    // vaskien isku: leikkaus
    let leik = [0, 0, 0];
    if (p.leikkaus > 0.01) { const ii = ensimmainen(ISKUT, t + 1e-6, (x) => x.t) - 1;
      if (ii >= 0) { const ag = t - ISKUT[ii].t, vk = p.leikkaus * ISKUT[ii].v; if (ISKUT[ii].v > 0.45) leik = [vk * 2.6 * Math.exp(-ag / 0.16), vk * 0.35 * Math.exp(-ag / 0.55), ii]; } }
    let heilaus = 0;
    for (let i = ensimmainen(ISKUT, t - 2.0, (x) => x.t); i < ISKUT.length && ISKUT[i].t <= t; i++) heilaus = Math.max(heilaus, ISKUT[i].v * Math.exp(-(t - ISKUT[i].t) / 0.6));
    puut.sort((a, b) => b.tarkeys - a.tarkeys); puut.length = Math.min(puut.length, 72); puut.sort((a, b) => b.syv - a.syv);
    harjut.sort((a, b) => b.tarkeys - a.tarkeys); harjut.length = Math.min(harjut.length, 16); harjut.sort((a, b) => b.y - a.y);
    pilk.length = Math.min(pilk.length, 32);
    let kes = -60; for (let mi = 55; mi <= 76; mi++) if (Math.abs(mi - vm) > 0.5) kes = Math.max(kes, dB(mi, t));
    const reuna = p.reuna * (1 + 0.5 * clamp((kes + 40) / 30, 0, 1));
    const taso3 = (lo, hi) => { let s = 0; for (const dt of [-0.3, 0, 0.3]) { let mx = -60; for (let mi = lo; mi <= hi; mi += 2) mx = Math.max(mx, dB(mi, t + dt)); s += mx; } return clamp((s / 3 + 45) / 32, 0, 1); };
    const reg = [taso3(28, 47), taso3(48, 71), taso3(72, 100)];
    const n0 = ensimmainen(NUOTIT, t - 1.5, (n) => n[0]), n1 = ensimmainen(NUOTIT, t, (n) => n[0]);
    const liike = clamp((n1 - n0) / 22, 0, 1);
    return { p, Y, puut, harjut, kukkulat, pilk, viivaY: Y(p.viiva), vv, ml, var_, sys, leik, reuna, reg, liike, heilaus };
  }

  const fTree = new Float32Array(72 * 4), fTreeB = new Float32Array(72 * 4), fRidge = new Float32Array(16 * 4), fRidgeB = new Float32Array(16 * 4);
  const fHill = new Float32Array(12 * 4), fGlint = new Float32Array(32 * 4), fPulse = new Float32Array(4 * 4);

  window.duration = aika.tiedoston_loppu;
  window.contextOk = () => !gl.isContextLost();
  window.seek = (t) => {
    if (gl.isContextLost()) return false;
    const k = kuva(t), p = k.p;
    fTree.fill(0); fTreeB.fill(0); fRidge.fill(0); fRidgeB.fill(0); fHill.fill(0); fGlint.fill(0); fPulse.fill(0);
    k.puut.forEach((x, i) => { fTree.set([x.x, x.top, x.w, x.syv], i * 4); fTreeB.set([x.a, x.siemen, x.huoj, 0], i * 4); });
    k.harjut.forEach((x, i) => { fRidge.set([x.y, x.v, x.x, x.h], i * 4); fRidgeB.set([x.ter, x.w, 0, 0], i * 4); });
    k.kukkulat.slice(0, 12).forEach((x, i) => fHill.set([x.x, x.h, x.w, x.ter], i * 4));
    k.pilk.forEach((x, i) => fGlint.set([x.x, x.y, x.v, x.koko], i * 4));
    k.sys.slice(0, 4).forEach((x, i) => fPulse.set([x.x, x.ika, x.v, 0], i * 4));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(U('uRes'), canvas.width, canvas.height);
    gl.uniform1f(U('uAA'), aa); gl.uniform1f(U('uTime'), t); gl.uniform1f(U('uZoom'), p.zoom); gl.uniform1f(U('uMist'), p.mist); gl.uniform1f(U('uDark'), p.dark);
    for (const n of ['skyTop', 'skyLow', 'mistCol', 'treeNear', 'treeFar', 'groundCol', 'lightCol', 'snowCol', 'cutCol', 'warmCol', 'sunCol']) gl.uniform3fv(U('u' + n[0].toUpperCase() + n.slice(1)), p[n]);
    gl.uniform4fv(U('uTree'), fTree); gl.uniform4fv(U('uTreeB'), fTreeB); gl.uniform4fv(U('uRidge'), fRidge); gl.uniform4fv(U('uRidgeB'), fRidgeB);
    gl.uniform4fv(U('uHill'), fHill); gl.uniform4fv(U('uGlint'), fGlint); gl.uniform4fv(U('uPulse'), fPulse);
    gl.uniform1i(U('uNTree'), k.puut.length); gl.uniform1i(U('uNRidge'), k.harjut.length); gl.uniform1i(U('uNHill'), Math.min(k.kukkulat.length, 12)); gl.uniform1i(U('uNGlint'), k.pilk.length);
    gl.uniform4f(U('uLine'), k.viivaY, 0.8 * k.vv, 0.0020, 0.035);
    gl.uniform4f(U('uGround'), p.maaY, Math.max(clamp(k.var_ / 14, 0, 1.5), 1.1 * clamp((k.ml + 40) / 22, 0, 1)), clamp((k.ml + 45) / 35, 0, 1), 0.09);
    gl.uniform4f(U('uCut'), ASP * (0.42 + 0.16 * fract(k.leik[2] * KULTA)), k.leik[0], k.leik[1], k.leik[2]);
    gl.uniform3f(U('uBand'), k.reuna, 0.94, p.tuuli);
    gl.uniform4f(U('uForest'), p.kerroksia, p.tiheys, k.reuna, p.lahi);
    gl.uniform1f(U('uStack'), p.stack); gl.uniform1f(U('uDrift'), 0.004 * t); gl.uniform1f(U('uSway'), (0.010 + 0.03 * k.liike + 0.03 * k.heilaus) * (1 + 1.5 * p.tuuli));
    gl.uniform1f(U('uTrunk'), p.trunk); gl.uniform1f(U('uCrown'), p.crown); gl.uniform1f(U('uFrost'), p.frost); gl.uniform1f(U('uReflect'), p.reflect);
    gl.uniform2fv(U('uPan'), p.pan); gl.uniform3fv(U('uReg'), k.reg); gl.uniform4fv(U('uVeil'), p.verho);
    gl.uniform4fv(U('uSnow'), p.snow); gl.uniform4fv(U('uGlow'), p.glow); gl.uniform4fv(U('uSun'), [p.sun[0] * ASP, p.sun[1], p.sun[2], p.sun[3]]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.finish();
    return true;
  };
  // Tarkistuksia varten: mitä kuvassa on hetkellä t (ei piirrä).
  window.kuvaus = (t) => { const k = kuva(t); return { puita: k.puut.length, harjuja: k.harjut.length, kukkuloita: k.kukkulat.filter((x) => x.h > 0.004).length, pilkahduksia: k.pilk.length, viiva: +k.vv.toFixed(2), jouset: k.p.jouset }; };
  window.camProbe = (t) => ({ p: [0, 0, tila(t).zoom], q: [0, 0, 0, 1], shot: 'yksi ajo', cut: 0, trans: false });
  window.seek(Number(q.get('t') || 0));
  window.sceneReady = true;
}

alusta().catch((e) => { console.error(e); window.sceneError = String(e.message || e); });
