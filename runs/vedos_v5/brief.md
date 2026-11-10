**Lue ensin `docs/visuaalinen_tyyli.md` kokonaan (kuvasäännöt luvussa 12, käyttäjän sanat luvussa 4d) ja `runs/maailmat/brief.md` kokonaan sekä kaikki, mitä se käskee lukea. Vasta sitten tämä ja oman moduulisi korjausbrief `runs/v5_<moduuli>/brief.md`.**

# Vedos 5: korjauskierros käyttäjän palautteen jälkeen (10.11.2026)

Käyttäjä katsoi vedoksen 4 (koko teos kahtenatoista maailmana). Hänen palautteensa on sanatarkasti tiedostossa
`docs/tutkimus/haastattelu.md`, luvut "10.11.2026: palaute vedoksesta 4" ja "10.11.2026: alku ja gis-idea". **Lue ne.**
Palautelista: `docs/projekti.md` luku 2, rivit 44–57. Tyyliohje voittaa tämän briefin; jos ne ovat ristiriidassa, kirjoita
se `pyynnot.md`:hen äläkä arvaa.

## Mikä muuttui musiikin ymmärryksessä (lue ennen kuin kosket kuvaan)

Ohjaaja kuunteli teoksen uudelleen ja luki partituurin sivut, joita ei ollut luettu. **Kuunteluopas
`annotations/kuunteluopas.md` on päivitetty: lue oman aikavälisi rivit sanasta sanaan.** Teemakartassa on uusia ankkureita
ja korjattuja aikoja (`annotations/cues.json`; käytä `d.vaadi(...)` ja `d.aika`). Tärkeimmät:

| Ankkuri | Mitä soi |
|---|---|
| `puhaltimet_staccato` | huilut, oboet, klarinetit: lyhyet kuviot rinnakkain (nymfit, parit) |
| `D_pikkolo` | huilun ja pikkolon nopea juoksu ylös ja takaisin |
| `nopea_liike_1_alku` → `nopea_liike_1_loppu` | puupuhaltimien grazioso-tanssi jousten keinunnan päällä; loppu = kirjain F, tumma sointu |
| `pohja_vaihtuu_D` | bassot toistavat säveltä, paisutus fortissimoon |
| `peikot_G_alku` (**aika muuttui**) | fortissimo katkeaa; jouset kärjessä hyppien (coll' punto, quasi saltato), pp; kuvio hyppää ryhmästä toiseen ylhäältä alas |
| `peikot_G_loppu` (**aika ja sisältö muuttuivat**) | sama kuvio äkkiä mezzoforte kaikilla jousilla yhdessä, patarummut marcato (+18 dB viidesosasekunnissa) |
| `H_puhaltimet` | jouset pysähtyvät sointuun, puupuhaltimet juoksevat ja kasvavat; purske syöksyy alas, ylärekisteri sammuu |
| `I_ratsastus` | **taite:** uusi tahtilaji, jousten nopea toistuva eteenpäin vievä kuvio, patarumpujen syke, poco a poco cresc. |
| `h_urkupiste_vyory` (**nimi oli väärä: ei vyöry**) | nopea kuvio jatkuu voimakkaana, alle tulevat bassojen raskaat painotetut äänet (Tapio); ff, sitten dim. |
| `vaskipulssit` (**sisältö oli väärä**) | englannintorven laulu, huilun trillit, kuvion kaiut pp, bassot pizz. |
| `J_huilut` | kaksi huilua rinnakkain, pohja häipyy |
| `jousijakso_urkupiste_E_alku` → `_loppu` | kirjain K: sellot neljään jaettuina laulavat sordiinolla (käyttäjä: "sellosoolo? Kaunis!") |
| `K_viulut`, `patarumpu_ppp`, `K_viulut_mezza`, `hitaat_soinnut`, `altot_mezza` | jousiryhmät laulavat vuorollaan; fraasien välissä hiljaisuus |

## Neljä asiaa, jotka koskevat jokaista moduulia

### 1. Kumipuut (käyttäjä: "kumiset puut tulivat takaisin"; "erittäin hienovaraista, milloin puiden heilunta näyttää kumiselta")
Puu on jäykkä kappale, jonka tyvi on maassa. Siksi:
- **Mikään siluetti ei muuta muotoaan ajan mukana.** Latvuston tai latvan korkeus ei riipu ajasta eikä äänestä. Ei
  pystysuuntaista siirtymää, ei venymistä, ei vellomista, ei "koko massa aaltoilee".
- **Sallittu liike on taipuma sivulle**, joka kasvaa tyvestä latvaan (tyvi ei liiku): latvan siirtymä enintään 2 % puun
  korkeudesta tavallisessa tuulessa ja enintään 4 % voimakkaimmassa puuskassa.
- **Taipuma on hidas:** päätaajuus enintään 0,3 Hz, ja puuskan aalto kulkee massan yli (vaihe paikan mukaan), ei jokainen
  puu erikseen eikä kaikki yhtä aikaa. Tuulen voima on äänen verhokäyrä vähintään 1,2 s tasoitettuna, kertymänä (ei
  parametri × aika). Ei koskaan nuotti nuotilta, ei spektristä ruutu ruudulta.
- **Kaukainen metsä (yli 150 m) ei taivu näkyvästi lainkaan.** Kaukana tuuli näkyy lumena, joka pöllyää latvoista, usvan
  liikkeenä ja valona. **Rungot eivät liiku koskaan. Maa ei liiku koskaan.**
- Todiste: liikesarja voimakkaimmasta kohdasta (`render/sarja.py`, 12 ruutua 0,1 s välein); siluettien tyvet ovat samassa
  paikassa joka ruudussa ja latvojen ero on pieni.

### 2. Nymfit (käyttäjä: "nymphit ei oikein nyt näy - se kappaleen leikkisä puoli ... älä laita liikaa. Vain oikeisiin kohtiin")
Nymfit ovat **väikettä** (tyyliohje luvut 6 ja 7): pieniä kylmiä valon pilkahduksia, jotka hyppäävät ja katoavat. Käyttäjä
piti vedoksen 4 valoista, "jotka olivat kuin keijut": sellaisia, ei hahmoja, ei siipiä, ei kasvoja.
- Yksi lyhyt ääni = yksi pilkahdus. Korkeus kuvassa on sävelkorkeus. Elinaika on äänen kesto ja lyhyt häivytys (0,15–0,3 s).
  Mikään pilkahdus ei jää roikkumaan.
- Peräkkäiset äänet kulkevat **polkua** pitkin (hyppy hypyltä), eivät ilmesty satunnaisiin paikkoihin. Kun kuvio siirtyy
  soitinryhmästä toiseen, polku siirtyy paikasta toiseen.
- Valon väri on halla tai hopea, ei lämmin. Ydin on pieni (noin 3–6 pikseliä 1080p:ssä) ja sillä on pehmeä kehä. Ympäristö
  vastaa: heijastus jäässä, kimallus lumessa, välähdys oksassa.
- **Vain kuunteluoppaan nimeämissä kohdissa** (ankkurit yllä). Muualla niitä ei ole. Vastakohta on Tapio: kun bassot
  jyrisevät, paino on maassa suurena ja pehmeänä (käyttäjä piti askelista: "isoina, mutta pehmeinä").
- Äänet saat `d.nuotit`ista ([alku, kesto, midi]) ja ylärekisterin alut voit laskea `d.taso(midi, f)`:stä samalla tavalla
  kuin `d.alut` lasketaan matalasta kaistasta. Rytmiä ei keksitä: pilkahdus tulee vain mitatusta äänestä.

### 3. Ei staattista lunta (käyttäjä: "Lumi on stattinen. Ei staattista lunta.")
Lumi liikkuu aina: sataa, ajelehtii, pöllyää. Sen nopeus ja suunta tulevat äänen voimasta kertymänä (ei hyppäyksiä).
Paikallaan seisovat pisteet ovat virhe.

### 4. Ääni tapahtuu, kuva vastaa (tyyliohje 7b ja kuvasääntö 0)
Käyttäjä: "6:30 on yllättäen paljon kovempi dynamiikka: Kuvassa ei tapahdu mitään." ja "kriitikon pitäisi tarkemmin vahtia
sitä, onko tyyliopas toteutunut. Ja onko nuo kuunteluoppaassa mainitut asiat näkyvissä."
- **Jokaisella oman aikavälisi kuunteluoppaan lihavoidulla rivillä on kuvassa vastine**, joka alkaa samassa ruudussa.
- Äkillinen dynamiikan muutos (vähintään 8 dB alle 0,3 sekunnissa) näkyy ympäristössä samassa ruudussa: valo, puuska, lumi.
  Mikään ei silti ilmesty, katoa eikä loikkaa (kuvasäännöt 10 ja 11).
- `tarkistus.md`:n alkuun taulukko: kuunteluoppaan rivi (aika ja nimi) → mitä kuvassa näkyy → todisteen tiedosto.

## Mitä ei saa rikkoa (käyttäjä piti näistä)
Loppu kokonaan (moduuliin 11_12 ei kosketa). Valo ja lumen valuminen. Metsän ulkonäkö. Keijumaiset valot. Siirtymien paikat
(moduulien rajat ja rajakuvat pysyvät). Jättiläisen askeleet isoina ja pehmeinä. Myrskyn nousu.

## Työn kulku
1. Lue yllä mainitut. Katso oman moduulisi nykyinen renderi (`runs/maailma_<k>/osa.mp4`, moduulilla 01_02 `runs/alku_v4/osa.mp4`)
   liikesarjoina kohdista, joita korjausbrief nimeää: `.venv\\Scripts\\python.exe -I render/sarja.py <video> <alku_s> <askel_ruutuja> <n> <ulos.png> [leveys] [palstat]`.
   Videon aika alkaa moduulin alusta (nolla = moduulin ensimmäinen ruutu).
2. Korjaa vain oma moduulisi `visual/maailma_<k>.js`. Yhteisiin tiedostoihin ei kosketa (`pyynnot.md`).
3. Stillit ja lyhyet koerenderit lukon kautta (`node render/lukittu.mjs ...`, ohje `runs/maailmat/brief.md` luku Tekniikka).
   Yksi renderi kerrallaan koneella: lukko hoitaa jonon, älä kierrä sitä. Koerenderi enintään 30 s pätkiä.
4. Kun korjaukset ovat valmiit, renderöi koko aikaväli tiedostoon `runs/maailma_<k>/osa.mp4` (01_02: `runs/alku_v4/osa.mp4`)
   samalla komennolla kuin ennen (`--workers 2 --chunk 40`, `aa=2`), ruututarkoilla rajoilla (pyöristä ankkurin aika lähimpään
   ruutuun: `round(t*30)/30`).
5. Katso valmis renderi **liikkeenä**: liikesarjat jokaisesta korjausbriefin kohdasta. Still ei riitä todisteeksi liikkeestä.
6. Kirjoita `runs/maailma_<k>/tarkistus.md` uudelleen (01_02: `runs/alku_v4/tarkistus.md`): kuunteluoppaan taulukko (kohta 4),
   korjausbriefin jokainen kohta (tehty / ei, todiste), kumipuutodiste, mitä jäi auki. **Raportoi vain se, minkä kuva näyttää.**

Aikaa ei ole rajattu kellolla, mutta älä hio loputtomiin: kun jokainen korjausbriefin kohta näkyy liikesarjassa, olet valmis.
