# Yhteinen brief: Tapiolan maailmat (rakentajille ja kriitikolle)

**Lue ennen mitään muuta, kokonaan ja tässä järjestyksessä:** (1) `docs/visuaalinen_tyyli.md` kokonaan (kuvasäännöt luvussa 12,
soitinroolit luvussa 7, äänen tapahtumien vastineet luvussa 7b, käyttäjän viimeisimmät sanat luvussa 4d: se voittaa
vanhemmat luvut; luku 4c on hylätty); (2) `docs/tapiola_tutkimus.md` kokonaan (erityisesti luvut 2, 4, 5 ja 8);
(3) `docs/kuvakasikirjoitus.md` luku "Uusi runko" kokonaan (kamera, "Miten maailmat ovat toistensa sisällä", "Mytologian
ainekset maailmoittain", kaikki kaksitoista maailmaa, "Loppu"); vanhemmat luvut 0–9 on hylätty, niistä pätevät vain ankkurit
ja "Kuuluu"-rivit; (4) `annotations/kuunteluopas.md`:stä oman maailmasi aikaväli rivi riviltä; (5) `docs/tutkimus/haastattelu.md`:n
luvut 9.11.2026 alkaen "palaute vedoksesta 3" loppuun asti (käyttäjän sanat sanasta sanaan); (6) oman moduulisi brief
`runs/maailma_XX/brief.md`; (7) `visual/yhteinen.js`, `visual/maailma_rajat.js` (malli) ja `visual/maailma_01_02.js`
(ohjaajan tekemät maailmat 1 ja 2: tästä näet tason, jonka käyttäjä hyväksyi: "nyt se metsä alkaa näyttää siltä mitä pitää").

## Mitä tehdään

Jean Sibeliuksen *Tapiola* (1926) musiikkivideoksi, kokonaan koodilla. Teos on jaettu kahteentoista maailmaan, jotka ovat
toistensa sisällä. Jokainen moduuli on yksi tai kaksi maailmaa. Sinä rakennat yhden moduulin: `visual/maailma_XX.js`.
Käyttäjä on orkesterimuusikko. Hän on hylännyt kolme aiempaa versiota; syyt ovat alla, älä toista niitä.

## Idea, jota jokaisen maailman pitää heijastaa

**Siemen on alun kuva:** horisontin valo (teoksen pitkä ääni), sen alla tumma metsän massa, sileät loivat kummut, lumi.
Tämä sama kuva löytyy jokaisen maailman sisältä uudessa aineessa ja uudessa mittakaavassa (huurteen harjanteet, jään
peilikuva, pylväiden väli, myrskyn takaa, ylhäältä). Katsojan pitää tunnistaa se. **Kamera on juoni:** se kulkee aina
eteen ja sisään, kohti kuvan valoa; se, mikä oli kaukana ja pieni, kasvaa, täyttää kuvan ja on uusi maailma. Käyttäjä:
"MAAILMOITA! JOIDEN SISÄLTÄ LÖYTYY MAAILMOITA!!!! SIEMEN-IDEA, JOKA KASVAA." ja "Meidän piti sukeltaa johonkin maailmaan
sisään, mistä avautuu uusia maailmoita." Maailman pitää olla **uskottava**: paikka, jossa on tila, valo, etäisyydet ja sää,
ei kuvio ruudulla.

## Mikä on mennyt pieleen (älä toista)

1. **Pomppivat puut.** Mikään metsän osa (puu, maa, horisontti) ei kasva, kutistu, pompi, heilahda iskusta eikä vaihda
   paikkaa äänen mukana. Käyttäjä: "EN halua mitään helvetin puita siihen pomppimaan."
2. **Metsä rivinä tai kuutena puuna.** Käyttäjä: "EI METSÄ tarkoita sitä että piirrä 6 puuta=metsä. Se on tylsä." ja
   "METSÄN VOI TEHDÄ MUUTENKIN KUIN PIIRTÄMÄLLÄ JOKAISEN PUUN ERIKSEEN". Metsä on massa, jonka muodon tekevät **valo ja
   varjo**: "pidän erityisesti siitä miten valo osuu puun latvoihin, siivilöityy tuolta oksien välistä". Taidehistoria
   (`docs/tutkimus/taide1920.md` luku 7): vaikutelma syntyy muodosta, usvasta ja rajauksesta, ei puiden lukumäärästä.
3. **Kuva ei reagoi musiikkiin.** "VALON PITÄÄ reagoida musiikkiin, elää sen kanssa." Jousten intensiteetin kasvu näkyy
   aina. Mutta: "minkään kappaleen (tai ainakaan kaikkien, voi käyttää hillitysti) ei tarvitse värähdellä kuin spektri,
   enemmän seurata sen melodian kaarta." Signaalit ovat hitaita keskiarvoja (vähintään 0,3 s), ei ruutu ruudulta.
4. **Kamera ajoi maan läpi.** Kameran korkeus mitataan maasta sen omalla kohdalla. Kamera ei koskaan mene maan, rungon tai
   muun kiinteän läpi muuten kuin nimetyssä kulussa.
5. **Terävät vuoret, joulukuuset, pahvi.** "Ei teräviä vuoria. ... vaaroja, kumpuja ja korkeintaan tuntureita. Ne ovat aina
   sileitä." Ei symmetrisiä kolmiokuusia, ei leikattuja tasoja, ei neonviivoja.
6. **Ohjaajan oma keksintö ilman perustetta.** Jokaisella kuvan asialla on lähde: tyyliohje, suunnitelma, tutkimus tai
   kuunteluopas. Jos lisäät jotain, mitä niissä ei ole, kirjoita se `tarkistus.md`:hen kohtaan "Omat lisäykset" perusteineen.
7. **Yksittäinen puu ilman tarinaa.** Yksittäisiä puita on vain siellä, missä suunnitelma ne nimeää (ikihongat, petäjä,
   Tapion pöytä). Pilkkapuu on poistettu.

## Säännöt, jotka kriitikko tarkistaa yksi kerrallaan

Tyyliohjeen luvun 12 säännöt 0–21 ja luvun 4d kohdat 1–19, jokainen. Lisäksi: revontulet vain maailmassa 11; punainen vain
maailmassa 8 (taottu aurinko, C-duuri); lämmin kajo vain maailmassa 12 (H-duuri); pystysuora valon leikkaus vain nimetyissä
iskuissa (`d.iskut`); muut aksentit ovat maan valoa tai metsän liikettä; hiljaisuudessa äänen elementit lakkaavat ja metsä,
maa ja lumi jäävät, kamera jatkaa; ei kasvoja, eläimiä, ihmisiä, tekstiä; Tapio on mittakaava ja valo.

## Tekniikka

- Tiedostosi: `visual/maailma_XX.js` (ES-moduuli). Sivu: `visual/maailma.html?m=XX`. **Et muokkaa muita tiedostoja.**
  Jos tarvitset jotain yhteiseen pohjaan, kirjoita pyyntö tiedostoon `runs/maailma_XX/pyynnot.md` ja kierrä se omassa
  moduulissasi siihen asti.
- `import { lataa, luoGL, julkaise, FS_ALKU, GLSL_YHTEINEN, FS_LOPPU, RAJA, clamp, smooth, sstep, fract, lerp } from './yhteinen.js';`
  Varjostin on `FS_ALKU + omat uniformit + GLSL_YHTEINEN + omat funktiot ja vec3 scene(vec2 p) + FS_LOPPU`. `p` on kuvan
  paikka: y 0..1 alhaalta ylös, x 0..16/9. `FS_LOPPU` hoitaa reunanpehmennyksen, sävykäyrän ja gamman.
- `const d = await lataa();` antaa: `d.aika.<ankkuri>` (sekunnit; kaikki ajat tulevat näistä, **ei käsin kirjoitettuja
  sekunteja**), `d.vaadi(...idt)`, `d.pitka(t, w)` teoksen pitkän äänen voima, `d.matala/keski/korkea/koko(t, w)`
  rekisterien voima 0..1 (w = keskiarvon puolileveys sekunteina), `d.melodia(t, w)` melodian korkeus midinä hitaana kaarena,
  `d.pitkaSavel(t)`, `d.alut` matalat alut (basson askeleet, patarumpu), `d.iskut` nimetyt iskut, `d.aksentit`, `d.nuotit`
  `[alku, kesto, midi]`, `d.tapahtumat` ja `d.tapahtuu(tyyppi, t)` (nousu, lasku, tremolo, purske, hiljaisuus, urkupiste,
  kerros katoaa, kerros tulee, basso liikkuu, basso vaikenee, paisuva sointu, liike, artikulaatio), `d.sarja(fn)`,
  `d.ka(a, f, w)`, `d.kohta(a, t)` omia kertymiä varten, `d.taso(midi, f)`, `d.huippu(lo, hi, f)`, `d.FPS`, `d.NF`.
- **Ketkä soittavat** tulee kuunteluoppaasta ja ankkureista, ei arvaamalla spektristä: rajaa signaali ankkurien väliin
  (katso `JOUSET` tiedostossa `visual/maailma_01_02.js`).
- **Kertymät:** jos nopeus muuttuu ajassa (tuuli, kameran vauhti, lumen putoaminen), matka on nopeuden integraali
  (`d.sarja` ja `d.kohta`), ei nopeus kertaa aika. Muuten kuva hyppää.
- **Puhdas aikafunktio:** `seek(t)` piirtää hetken t ilman muistia edellisestä ruudusta. Ei ajastimia, ei `Math.random()`.
- **Rajakuvat** (`RAJA`, GLSL `rajakuva(p, tyyppi, t)`): moduulisi alkaa edellisen maailman rajakuvasta ja päättyy omaansa.
  Rajan hetkellä koko ruutu on täsmälleen `rajakuva(...)`. Alun rajakuvasta maailma avautuu vähintään kolmessa sekunnissa
  (mittakaava muuttuu jatkuvasti: se, mikä täytti kuvan, osoittautuu maailman osaksi). Lopun rajakuvaan ajetaan vähintään
  neljässä sekunnissa: kamera kulkee kohti jotain maailman kohtaa, joka kasvaa ja täyttää kuvan. Ei ristihäivytystä tyhjän
  kautta, ei leikkausta.
- **Renderöinti vain lukon kautta** (näytönohjain on yhteinen, muita agentteja on töissä):
  `node render/lukittu.mjs --data build/rattle_koko --page "visual/maailma.html?m=XX&aa=2" --stills 62,70,80 --dir runs/maailma_XX/tark/stills`
  ja arkki: `.venv/Scripts/python.exe -I render/arkki.py runs/maailma_XX/tark 4 480` (kirjoittaa `tark/arkki.png`, jonka
  luet Read-työkalulla). Tyhjennä `tark/stills` ajojen välissä. Liikkeen tarkistus: stillit 0,2 s välein neljän sekunnin
  ajalta jokaisesta iskusta, kulusta ja kohdasta, jossa jokin alkaa tai lakkaa. Yksi still saa kestää enintään noin kaksi
  sekuntia: pidä silmukat kohtuullisina.
- Mittaus: `window.kuvaus(t)` palauttaa luvut, joilla näytät, mitä ääni ohjaa (katso malli). "Valmis tarkoittaa mitattua."
- Kieli: koodin kommentit ja raportit suomeksi. Musiikkisanasto muusikon suomea (sordiino, urkupiste, tremolo). H = englannin B.

## Työn kulku ja mitä palautat

1. Lue yllä luetellut. Kirjoita `runs/maailma_XX/tarkistus.md`:n alkuun **suunnitelmasi** ennen koodia: maailma yhdellä
   kappaleella (paikka, valo, sää, mittakaava); miten siemenen kuva näkyy tässä maailmassa; kameran reitti rajakuvasta
   rajakuvaan; taulukko "kuunteluoppaan rivi → mitä kuvassa tapahtuu → mistä signaalista".
2. Kirjoita moduuli. Katso stillejä ja liikesarjoja itse, monta kierrosta. Ole itsellesi ankara: käyttäjä näkee heti,
   jos jokin on rumaa, halpaa, litteää tai staattista.
3. Täydennä `tarkistus.md`: (a) tyyliohjeen luvun 12 säännöt 0–21 ja luvun 4d kohdat 1–19 taulukkona: toteutuu / ei koske /
   ei toteudu, ja mistä ruudusta sen näkee; (b) kuunteluoppaan rivit: näkyy / osin / ei; (c) rajakuvat: alku ja loppu
   todettu stilleistä; (d) omat lisäykset perusteineen; (e) mikä jäi heikoksi, rehellisesti.
4. Lopullinen vastauksesi: lyhyt yhteenveto ja tiedostot. Älä väitä valmiiksi sellaista, mitä et ole katsonut ruuduista.

## Kriitikolle (kun ohjaaja pyytää arviota moduulista)

Lue samat dokumentit kuin rakentaja (kohdat 1–6 yllä) ja moduulin `tarkistus.md`. Katso ohjaajan tekemät ruudukot kansiosta
`runs/maailma_XX/ruudut/` (kaikki). Älä lue koodia. **Mitta on käyttäjän sanat ja tyyliohje, ei rakentajan selitys.**
Kirjoita `runs/maailma_XX/kriitikko.md`:
1. Tyyliohjeen luvun 12 säännöt 0–21 ja luvun 4d kohdat 1–19, **jokainen omalla rivillään**: toteutuu / rikkoo / ei koske /
   en erota, ja ruutu ja aika.
2. Onko maailma **uskottava** paikka (tila, valo, etäisyydet, sää)? Lukeeko metsä massana valon ja varjon kautta?
3. **Siemen:** näkyykö alun kuva (horisontin valo, tumma massa, sileät kummut, lumi) tässä maailmassa, ja tunnistaako sen?
4. **Kamera juonena:** näkyykö eteneminen; miten maailmaan tullaan rajakuvasta ja miten siitä lähdetään; onko kulku
   jatkuva (mittakaava muuttuu) vai häivytys; meneekö kamera jonkin läpi väärin?
5. **Reagoiko valo musiikkiin** kuunteluoppaan rivien kohdalla (rivi riviltä: näkyy / osin / ei / en erota)? Väriseekö jokin
   spektrin tahdissa tai pomppiiko mikään?
6. Mikä on rumaa, halpaa, litteää, staattista tai kliseetä? Yli 20 sekuntia samannäköistä?
7. Virhelista vakavin ensin ja kolmijako: (a) estää näyttämästä käyttäjälle, (b) haittaa, (c) käyttäjän makuasia.
Raportoi vain se, minkä näet ruuduista; "en erota" on eri asia kuin "ei ole".
