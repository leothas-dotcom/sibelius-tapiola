# Tarkistus: maailmat 3 ja 4 (`visual/maailma_03_04.js`)

*Aikaväli: `fis_pitka_aani` (61,6 s) → `pohja_katoaa` (203,0 s), Rattle / LSO 2022. Alku: rajakuva PIMEA_MASSA, loppu: rajakuva HUURRE.*

## 1. Suunnitelma (kirjoitettu ennen koodia)

**Maailma yhdellä kappaleella.** Vanha kuusimetsä talviyönä sisältä. Kamera kulkee polkua, jonka molemmin puolin runkoja
on kaikilla etäisyyksillä sataankolmeenkymmeneen metriin asti. Metsä on massaa ja usvaa: jokainen runko on oma
syvyyskerroksensa, kuusen oksat ovat tumma, repaleinen massa runkojen ympärillä (alta harva, päältä tiheä), ja kerrosten
väliin jää usva, joka on sitä sinisempää ja tasaisempaa, mitä kauempana ollaan. Kaukana, runkojen välissä, on valo: teoksen
pitkä ääni (nyt fis) on sama horisontin valo kuin alussa, nyt sisältä nähtynä: usva hehkuu sen suunnassa, rungot ovat sen
edessä tummia siluetteja, ja valo siivilöityy runkojen ja oksien välistä juovina. Maa on lumen peittämää, loivia kumpuja
(sileät, jääkauden muokkaamat), ja kaukana lumi on yhtä usvaa. Sää: tyyni pakkasyö, hiljaista lumihiutaletta. Mittakaava:
rungot 0,25–0,8 m, ikihongat yli metrin, näkyvyys sata metriä, kamera aluksi silmänkorkeudella (1,6 m).

**Miten siemenen kuva näkyy.** Horisontin valo kaukana (fis-hehku), sen edessä tumma massa (metsä itse, rungot ja oksat
siluetteina), kummut (lumen loivat selänteet, jotka nousevat valoa vasten ja joiden harjat hohtavat), lumi. Se on alun kuva
sisältä katsottuna: valo ei ole enää yläpuolella vaan keskellä, massa ei ole kaukana vaan ympärillä. Maailmassa 4 sama kuva
kääntyy ylöspäin: latvusto on horisontti ja sen yllä on valo (D-duurin hallan valo).

**Kameran reitti.** (a) Rajakuva PIMEA_MASSA: kamera on metsän reunan oksamassassa. Pimeä on neljä peräkkäistä oksaseinää,
joiden aukot avautuvat sitä mukaa kuin kamera ajaa niiden läpi (kuuden sekunnin sisällä): se, mikä täytti kuvan, osoittautuu
metsän reunan oksistoksi ja takana on runkojen välinen hämärä ja valo. (b) Maailma 3: tasainen kulku polkua eteen (2 m/s),
silmänkorkeus, ja kun askeleet alkavat (`askeleet_alkavat`) kamera laskeutuu lumen pintaan (0,6 m, seitsemässä sekunnissa).
Ikihongat ohittavat kameran 3–4,5 metrin päästä. (c) Maailma 4 (`urkupiste_H1_alku`): kamera kallistuu hitaasti ylös
(yhteensä 50°, huippunopeus alle 8 °/s) ja nousee samalla ylöspäin liikkuessaan eteen, joten maa jää kuvan alle ja metsä
leijuu. (d) Kulku loppuun (`nousu_huippu_D` → `pohja_katoaa`): kamera ajaa suuren petäjän latvan huurteiseen oksaan ja yhteen
kiteeseen eksponentiaalisesti hidastuen; kide kasvaa ja täyttää kuvan, ja viimeinen ruutu on rajakuva HUURRE.

**Taulukko: kuunteluoppaan rivi → kuva → signaali** (ajat Rattle 2022)

| Rivi | Mitä kuvassa tapahtuu | Signaali |
|---|---|---|
| 1:01 Yleistauon jälkeen: pitkä fis | oksaseinät avautuvat, runkojen välinen hämärä ja kaukainen valo paljastuvat; valo on alun gis-horisonttia alempana | `fis_pitka_aani`; `d.pitka` (valon voima), `d.pitkaSavel` + `d.melodia` (valon korkeus) |
| 1:15 Ensimmäinen valon välähdys: D ja H pitkinä | kelmeä, hämärä halla-valo (ei keltainen, ei lämmin) täyttää usvan ja juovittuu runkojen väliin, jouset väistyvät | `valo_D_duuri`; D- ja H-sävelten taso (`d.taso`) |
| 1:40 Basson eritahtiset iskut | valo kulkee lumen pinnassa edellä, usva väistyy kauempana edessä, pilkka syttyy ohitettavaan ikihonkaan | `askeleet_alkavat`, matalan kaistan alut |
| 1:40 Sointumatto hengittää | usvan hehku kirkastuu ja himmenee kahden sekunnin tahdissa | `fis_hengittaa`; `d.keski` lyhyt ja pitkä keskiarvo |
| jousten intensiteetti | oksamassa tihenee ja metsä tummuu, hehku himmenee | `d.keski` (0,5 s), rajattu jousten väleihin |
| 2:09 Matalat äänet "askeleina" | kamera on lumen pinnassa, askeleen valo kulkee maassa, pilkat syttyvät | `askeleet_B`, `d.alut` |
| 2:56 Nousu h-urkupisteen päällä | kamera kallistuu ylös runkoja pitkin ja nousee; maa väistyy kuvan alle | `urkupiste_H1_alku`, `nousu` |
| 3:06 Ylimmät äänet värisevät | valo alkaa laskeutua latvoihin ylhäältä: pehmeät pilarit oksien raoista | `nousu_tremolo`, `d.korkea` |
| 3:11 Basso lähtee liikkeelle | kameran vauhti kasvaa jatkuvasti (ei iskussa) | `urkupiste_H1_loppu` |
| 3:15 Nousu päätyy D-duuriin | hallan valo osuu suuren petäjän latvaan ensimmäisenä ja siivilöityy oksien välistä | `nousu_huippu_D`; D-soinnun sävelten taso |
| 3:23 Pohja katoaa | kamera on kiteessä; kuva = HUURRE | `pohja_katoaa` |


**Miten metsä elää (ohjaajan korjaus 10.11.2026).** Rungot, oksamassa ja maa ovat maailman kiinteitä: mikään ei kasva, kutistu,
pompi tai vaihda paikkaa. Tuuli liikuttaa niitä kuten puita: latvat taipuvat sivulle korkeuden neliössä (tyvi pysyy), oksamassa
kulkee mukana, ja pieni nopeampi värinä on päällä. Tuulen voima on `tuuli(t)` = koko orkesterin taso (`d.koko`, 1,2 s keskiarvo),
eli jousten intensiteetti ja puuskat; isku kasvattaa tasoa ja latvat taipuvat ja palaavat hitaasti. Lumi putoaa (aika ajaa), usva
ajautuu koneen kuulemasta liikkeestä (`liike`, kertymä). Tuulen amplitudi on pieni (alle 0,3 m latvassa); **en ole katsonut
liikesarjasta, että huojunta erottuu**, vain todennut koodista ja kuvaus(t)-luvusta (`tuuli`).

## 2. Tyyliohjeen säännöt (rakentajan oma arvio ruuduista; kriitikko tarkistaa erikseen)

| Sääntö | Tila | Ruutu / perustelu |
|---|---|---|
| 0 Ääni ohjaa (korkeus ja voima) | osin | valon voima ja korkeus seuraavat pitkää ääntä ja melodian kaarta (`kuvaus`: valo, valoY); 100 s ja 130 s ruuduissa hehku ja lumen valojuovat. Korkeus näkyy vain ±0,04 kuvan korkeudesta |
| 1 Kamera eteen ja sisään | toteutuu | koko väli; ei peruuta |
| 2 Pysähdys vain nimetyissä | toteutuu | ei pysähdystä; loppukulku hidastuu eksponentiaalisesti kiteeseen (kulun osa, ei pysähdys) |
| 3 Ei kallistusta, alle 20 °/s | toteutuu | kallistus vain ylös, `kuvaus(t).kamera.kallistusnopeus_asteta_s` huippu alle 8 °/s (tarkistettu laskennallisesti: 0,28 + 0,72 -askelfunktiot, 50 °) |
| 4 Kamera ei reagoi iskuun | toteutuu | reitti on puhdas aikafunktio |
| 5 Siirtymä kulku, yli 4 s, mittakaava jatkuva | osin | alku: oksaseinät avautuvat 61,6–65 s (63,8 s ruutu); loppu: kide kasvaa 195,7–203 s (198, 200, 201,5 s). Alun avautuminen on ~3 s, kovin nopea 63–64 s välillä |
| 6 Kolme syvyyskerrosta | toteutuu | 70 s, 130 s: lähirungot, keskirungot, usvaan häviävät kaukaiset |
| 7 Puhuja tulee lähemmäs | ei koske | ei etualan vaihtoa tässä jaksossa |
| 8 Kerrokset etäisyyttä, ei pahvia | osin | rungot ovat kerroksia usvassa; lähirungot ovat sileitä sylintereitä (liian puhtaita) |
| 9 Metsä näkyy, ei soittimia | toteutuu | rungot, oksamassa, lumi, usva; ei esineitä |
| 10 Iskun elementti ympäristössä | ei koske | jaksossa ei nimettyjä iskuja (`d.iskut`: vain urkupiste_H1_loppu) |
| 11 Ei ilmesty/katoa iskussa | toteutuu | kaikki kiinteää |
| 12 Enintään kolme elementtiä liikkuu | toteutuu | liikkuvat: valo, askelvalo, pilkka |
| 13 Väike/kajo kaukana | ei koske | |
| 14 Valolla lähde | toteutuu | horisontin valo ja ylhäältä tuleva halla-valo; kiteen oma valo |
| 15 Ei lämpöä, ei punaista | toteutuu | paletti salo/halla/hopea; D-välähdys vihertävän kelmeä |
| 16 Aurinko/kajo vain C/H | toteutuu | ei kumpaakaan |
| 17 Värit eivät vaihdu iskussa | toteutuu | |
| 18 Hiljaisuus | ei koske | jaksossa ei hiljaisuutta |
| 19–21 Ei edellisen tyyliä, kliseitä, tekoälykuvia | toteutuu | kaikki koodilla; ei kansikuvia |

Luvun 4d kohdat: 1 metsä pysyvä ja elää tuulessa (ks. yllä) toteutuu; 2 laaja ja syvä, ei rivi: toteutuu osin (polun varrella rungot
ovat satunnaisesti kaikilla etäisyyksillä, mutta lähimmät ovat liian samanlaisia); 3 kamera eteen: toteutuu; 4 maailmat sisäkkäin:
toteutuu (reunan oksaseinistä sisään, latvan kiteeseen); 5 gis-horisontti: tässä fis-valo, liukuu hitaasti; 6 mystiset olennot:
ei koske tähän jaksoon (ohjaajan ehdotus, ei toteutettu: perustelu alla); 7 hämäryys: usva ja siluetit; 8 loppu hyväksyvä: ei koske;
9 metsä on massa: osin (oksamassa on repaleista, mutta rungot erottuvat yksittäin); 10 jousten intensiteetti: toteutuu
(`jouset` ohjaa tummuutta ja oksamassan tiheyttä); 11 Tapion talo: ei koske; 12 revontulet: ei ole (oikein); 13 kamera ei maan
läpi: kamera on aina vähintään 0,55 m maan yläpuolella (ground-march käyttää samaa korkeuskenttää); 14 yksittäinen puu harkittu:
ikihongat (pilkka) ja suuri petäjä (kide), ei muita; 16 parallaksi: toteutuu, polku mutkittelee ja kamera liukuu viistoon;
17 horisontti seuraa melodian kaarta: valon korkeus ±0,04; 18 ei teräviä vuoria: ei vuoria, kummut loivia; 19 etualan puuta ei:
ikihongat ovat polun vieressä, eivät etualalla keskellä; 20 valo ja varjo: valojuovat lumessa ja runkojen reunavalo (70, 100, 130 s);
21–22 luettu ja noudatettu.

## 3. Kuunteluoppaan rivit

| Rivi | Näkyy? | Huomio |
|---|---|---|
| 1:01 pitkä fis | näkyy | hehku keskellä, 100 s ruutu |
| 1:15 D ja H pitkinä | osin | `dValo` kasvattaa hehkua ja vihertävää sävyä; ei katsottu ruudusta erikseen (ei still-ajoa 75–96 s tällä versiolla) |
| 1:40 askeleet | osin | valopulssit, usvan väistyminen ja pilkka koodattu; pilkka nähty ruuduissa 130 s ja 176 s; askelten tunnistus `kuvaus.askelAika` (matalan kaistan alut, harvempi kuin käyttäjän 28 askelta) |
| 1:40 sointumatto hengittää | osin | `hengitys` ohjaa hehkua; liikesarjaa ei katsottu |
| 2:09 matalat äänet | osin | kamera 0,6 m, 130 s ruutu |
| 2:56 nousu | näkyy | 182–192 s: kallistus ja nousu |
| 3:06 ylimmät värisevät | osin | latvojen valo ylhäältä (192 s) |
| 3:11 basso liikkuu | ei erotu | kameran vauhti kasvaa tasaisesti |
| 3:15 D-duuri | osin | hallan valo ja kide; petäjän latva on ruudussa pieni ja litteä |
| 3:23 pohja katoaa | näkyy | 203 s = HUURRE |

## 4. Rajakuvat

- **Alku (PIMEA_MASSA):** 61,6 s ruutu on tasaisen pimeä rajakuva; maailma aukeaa oksaseinien läpi (63,8 s, 64,5 s). Ruutuja ei verrattu
  pikselitarkasti 01_02:n viimeiseen ruutuun, mutta sama `rajakuva(p,0,t)` kaava ja täysi peitto.
- **Loppu (HUURRE):** 203,0 s ruutu on koko ruudun vaalea sininen kidepinta (`rajakuva(p,1,t)`), 202,5 s ruudussa kide täyttää
  kuvan lähes kokonaan.

## 5. Omat lisäykset

- Mutkitteleva polku (kameran kulkulinja), jotta rungot eivät muodosta suoraa käytävää: ohjaajan perustelu ref 9 (polku metsässä).
- Kide on kuusikulmio, jossa kuusi neulaa: halla/huurre (tyyliohje 7b, huurre; ei lähdettä muodolle, oma valinta).
- Tähdet usvan takana (referenssit 5 ja 13), harvat.

## 6. Mikä jäi heikoksi (rehellisesti)

- Lähirungot ovat liian puhtaita, sileitä sylintereitä; kuorta ja oksia on vähän. Oksamassa on paikoin harmaan pilven näköistä.
- Maailma 4 (190–198 s): kallistettu näkymä on litteä, taivas tasaisen harmaansininen; suuren petäjän latva on pieni eikä erotu
  ennen kiteen kasvua; hallan valon pilarit eivät erotu.
- Alun avautuminen on nopea 63–64 s välillä; roikkuvat tummat läikät 64–66 s ovat blobimaisia.
- Mystisiä olentoja ei ole (ohjaajan ehdotus 4d.6, ei vahvistettu).
- Huojuntaa, hengitystä ja askeleita ei ole katsottu liikesarjoina eikä still-ajoina aikapisteittäin tällä lopullisella versiolla;
  kaikki still-ajot ovat aa=1.

## 7. Korjauskierros kriitikon jälkeen (ohjaajan lista 1–3)

Katsottu stilleistä 62,6 / 64,0 / 100,7 / 190 / 195,7 / 199 s (aa=1, `tark/arkki.png`):
- **Askeleet:** pulssi nousee pehmeästi (0,22 s), häipyy alle sekunnissa, on paikallinen (kapea kaista maassa edellä); usvan väistyminen kavennettu ja himmennetty. Pilkka on jo rungossa himmeänä (`bl` 0,07), syttyy pehmeästi ja on epäsäännöllinen veistetty lovi (100,7 s ruutu). Liikesarjaa ei katsottu.
- **Alku:** usva on aluksi paksu (rungot tulevat esiin hitaasti 4,5 s aikana) ja oksaseinät avautuvat 2,2–5 s; 62,6 s on vielä tasaista pimeää, 64,0 s oksamassat aukeavat. Rungot eivät ole täydessä koossa heti, mutta avautuminen on yhä läikkämäistä.
- **Maailma 4:** latvusto tiheämmäksi ylhäällä, lumiset latvat kirkkaammiksi, petäjän tupsut isommiksi ja valoisammiksi. 190 s ruutu lukee paremmin (tumma latvusto, tähdet); **195,7 s on yhä litteä**: taivas tasaisen harmaa, petäjän latva ja oksat litteitä tupsuja. Ei korjattu loppuun.
- Huojunta tuulessa: ei tehty näkyvämmäksi (aika loppui).

## Vedos 6 (10.11.2026, täsmäkorjaus; rivit 62, 63, 64)

Renderi `runs/maailma_03_04/osa.mp4`: 4242 ruutua (ffprobe), vanha talteen `runs/v6_03_04/osa_vedos5.mp4`, vanha moduuli `runs/v6_03_04/maailma_03_04_vedos5.js`. Liikesarjat ja stillit: `runs/v6_03_04/sarjat/`, `runs/v6_03_04/tark/`, `tark2/`.

| Kohta | Tila | Näyttö |
|---|---|---|
| 1 Alku (rivi 62) | tehty | `alku_v6.png`: 0,00 s täsmälleen rajakuva; 0,2 s ohut usva ja ensimmäiset rungot; 0,4–0,6 s kaukaiset rungot himmeinä ja lähimmät vahvistuvat; 0,8 s metsä on valmis. Ei tasaista ruutua 0,2 s jälkeen, ei lohkareita. 0,4 s ruudussa on pehmeitä usvaläikkiä (epätarkkoja oksakerroksia), jotka häviävät alle sekunnissa. |
| 2 Alttojen lumi ja usva (rivi 63) | osin | Fraasin alku = keskikaistan alku, jota edeltää vähintään 1 s hiljaisuus (d.cues.alut.keski); lumipuuska putoaa oksilta valokeilan läpi ja usvan juovat liikahtavat ohimenevästi. `altto1_v6.png` (35,4–39 s): puuska näkyy vain muutamana hiutaleena valon vieressä, hyvin hienovarainen, ehkä liian vähän. Ei katsottu toista fraasia erikseen. |
| 3 Katse ylös ja kulku kiteeseen (rivi 64) | osin | `nousu_v6.png`: kamera nousee vain 0,32 kertaa entisen (n. 6 m, ei latvojen tasolle); rungot kapenevat ja päättyvät latvuksiin; latvukset ovat tummia massoja, joiden pinnoilla ei enää ole läikkiä; suuri petäjä päättyy kärkeen; levyt korvattu ohuilla riippuvilla neulasilla; valo kohoaa 3 m → 15 m (hFront). Kulku oksaan ja kiteeseen sulava (2:12–2:21), HUURRE viimeisenä ruutuna. Jäi auki: lähimmät rungot ovat edelleen pitkiä viistoja palkkeja 2:06–2:09 ja 2:16–2:17 (kolmen pisteen perspektiivi), latvusten reunoissa on yhä rosoisia vaaleita rajoja (2:08–2:11), ja oksa on suora ja litteä "kalanruoto", ei runsas huurteinen kuusenoksa. |
| Koskemattomuus | ✅ | 20 s, 60 s, 100 s: keskimääräinen kirkkauden ero vanhaan 0,55 / 0,73 / 0,26 (asteikko 0–255), keskikirkkaus sama (39,6 / 42,8 / 41,6); suurimmat erot ovat lumihiutaleissa (kohta 2). |

Nojaus (rivi 79):
- Alku: tyyliohje 2.4 (siirtymä on kulku, ei hyppyjä) ja 7b (paljastuminen: usva väistyy, mitään uutta ei tuoda); tutkimus: metsän syvyys usvalla (4d.2); käsikirjoitus maailma 3 ("kamera ajaa metsän reunan läpi").
- Alttojen lumi: tyyliohje 7b (rytmi, vuorottelu; lumi liikkuu aina, 4.26) ja 4d.1 (tuuli = musiikki); käsikirjoitus maailma 3 ("jouset → tummuus ja hengitys"); tutkimus: kuunteluopas 1:01–2:56.
- Kuvan nousu: tyyliohje 4d.20 (valo siivilöityy latvoissa), 7b (nousu: valo kohoaa rungoista latvoihin), 4b kuvatapa 3; käsikirjoitus maailma 4 (O'Keeffe, SKVR "päivänä petäjän latvat"); tutkimus: noin 40 tahdin jousicrescendo.
- Liike sulavaa (rivi 61): kaikki uudet liikkeet jatkuvia (veilin hajoaminen, usvapotku exp-vaimenee, kamera kuten ennen); kamera <8 °/s ennallaan.

### Vedos 6, toinen kierros (ohjaajan kohdat a, b, c; lumi kaksinkertaiseksi)

Renderi uudelleen lukon kautta, 4242 ruutua (ffprobe). Liikesarja `runs/v6_03_04/sarjat/nousu_v6c.png` (120–141 s, 1 s välein), stillit `runs/v6_03_04/tark3/`.
- **Lumi (kohta 2):** puuskan voima ja hiutaleiden tiheys noin kaksinkertaisiksi (0,50 → 1,00; 0,42 → 0,60), yhä pehmeä. Ei katsottu uudelleen erillisellä sarjalla.
- **(a) Oksa poistettu:** petäjän runko, oksat ja neulaset on poistettu kokonaan. Latvuksen aukosta tuleva hallan valo kirkastuu nousu_huippu_D:n mukana (`uTop.x`), siinä on yksi kimallus (2:06–2:14), kamera lähestyy tasaisesti, sumea vaalea huurremassa täyttää kuvan (2:15–2:17) ja siitä avautuu kuusikulmainen kide kuten ennen (2:17–2:21). Ei viivoja eikä piikkejä massassa; kiteen omat kuusi sädettä ovat ennallaan.
- **(b) Lähimmät rungot:** niiden alfa laskee katseen kallistuessa (`up`) etäisyydellä alle 24 m; 2:06–2:13 kuvassa ei ole yhtään palkkina kuvan poikki kulkevaa runkoa. Hinta: keski- ja kaukorungot näkyvät ohuina, hieman kaarevina juovina (2:03–2:08), ja latvusten tummat massat ovat suurelta osin hävinneet (2:08–2:13 on lähinnä tumma, pehmeä kuva). "Rungot kapenevat latvuksiin" ei siis todennu selvästi.
- **(c) Latvusten reunat:** reunat pehmeiksi (alfa-reunan leveys 0,2 → 0,9), reunavalo vaimennettu 90 %, tilalle pehmeä hehku. Rosoiset vaaleat reunaviivat ovat poissa 2:08–2:11.
- **Auki:** pystysuora kirkas valojuova rungon vierellä 2:06–2:10 (valopilari/lit runko) on yhä; latvukset eivät lukeudu erillisinä massoina; ei vertailtu 2:00–2:05 vanhaan pikselitarkasti.
- **Koskemattomuus:** 20 / 60 / 100 s keskiero vanhaan 0,55 / 0,76 / 0,27, keskikirkkaus ennallaan.

## Vedos 7 (11.11.2026, täsmäkorjaus; brief `runs/vedos_v7/brief.md`, moduulin 03_04 kohdat 1–3)

Renderi: `runs/maailma_03_04/osa.mp4`, 4242 ruutua (ffprobe), `--start 61.6 --end 203.0 --workers 2 --chunk 40`, aa=2, lukon kautta. Tiedosto: `visual/maailma_03_04.js`. Liikesarjat ja stillit: `runs/maailma_03_04/v7/` (`sarja_ylos.png` 3:02–3:23 0,5 s välein, `sarja_altto1.png` ja `sarja_altto2.png` 0,27 s välein, `a5/` ja `a1`–`a4` kehitysvaiheiden stillit, `vanha/` vedoksen 6 ylöskatse, `frmukana/` ja `frilman/` fraasin vertailustillit, `vertaa.txt`).

### Mitä muutin (`visual/maailma_03_04.js`)
**Kohta 1, ylöskatse.** Syy löytyi renderistä: ikihongat (jättiläisrungot polun vieressä) olivat piirrossa **äärettömän korkeita**, eikä niillä ollut latvusta; ne olivat ne pitkät suorat viivat kuvan yläreunaan asti. Lisäksi tavallisten kuusten ohut yläosa jäi yksin viivaksi latvuksen läpi.
- Ikihongalle äärellinen korkeus `Hp` = 27–31 m ja latvus (alhaalta leveä, ylöspäin kapeneva tumma massa, `skp`, `Bp`, `aCp`), runko häipyy latvuksen sisään (`aT * (1 - up * smoothstep(0.55, 0.80, hnp))`). Kaikki `up`-painotettuja, joten ennen ylöskatsetta kuva ei muutu (rivit noin 229–262).
- Tavalliset kuuset: rungon yläosa häipyy latvuksen sisään (`smoothstep(0.40, 0.65, hn)`, rivi 178) ja latvuksen ydin on umpinainen (`aF = max(aF, 0.94 * up * ...)`, rivi 187).
- Viirut ja hunnut pois ylöskatseessa: `shaftT`-viirut `fol`-termissä ja usvan `Lf`-termissä sekä `shaftH`-valoviirut usvassa korvataan tasaisella arvolla `up`:n mukaan (`mix(..., up)`). Näkyviin jää yötaivas tähtineen. Kide, kamera ja valo säilyvät. `farF` (lähirunkojen häipyminen ylöskatseessa) on ennallaan.
**Kohta 2, lumi ja alttoviulut.**
- Vanha lumi: sivuttainen `0.25 * sin(uTime * 0.6 + k)` oli edestakaista heilahtelua (Y2-rikkomus). Nyt hiutaleen paikka on vakionopeuden kertymä: `wx + 0.10 * ts`, `yw + 0.5 * ts` (alas 0,5 m/s, sivulle 0,10 m/s samaan suuntaan).
- Vanha fraasireaktio (erillinen, nopeammin putoava ja sivuun ajelehtiva hiutaleparvi + `usvaPotku`, joka siirsi valojuovia ±1,6 m 0,3 s:ssa ja takaisin) **poistettu kokonaan**. Uusi reaktio on pelkkä lumen määrän ja kirkkauden kasvu samoille, samaa tuulta liikkuville hiutaleille: `thr = 0.04 + 0.40 * ex`, kirkkaus `1 + 2.5 * ex * shA`, nousu 0,5 s (`smoothstep(0, 0.5, ikä)`), lasku 1,2–3,2 s. Ei paikan eikä suunnan muutosta.
**Kohta 3, Y1.** Puiden liikettä ei ole koskettu: `lean`-lauseke on tavun tarkkaan vedoksen 5:n (ohjaajan peruutuksen mukaan palautettu; väliaikaisesti poistettu ja palautettu ennen yhtään tässä käytettyä renderiä).

### T1 liikesarjat (katsottu itse)
- `sarja_ylos.png` (3:02–3:23): 3:02–3:06 metsä normaalisti, 3:06–3:10 rungot päättyvät tummiin latvuksiin, ikihongat (keskellä) päättyvät omiin latvustuppeihinsa, yötaivas ja tähdet näkyvät latvusten yläpuolella; 3:10–3:14 usva ja yötaivas, kide hehkuu; 3:14 eteenpäin kide täyttää kuvan kuten ennen. Yksikään suora viiva ei jatku kuvan yläreunaan.
- `sarja_altto1.png` (0:35–0:38) ja `sarja_altto2.png` (0:48–0:51): lunta tulee lisää pehmeästi noin 0,3 s:ssa ja vähenee noin sekunnissa; hiutaleet liikkuvat samaan suuntaan kuin muu lumi.

### Mitatut luvut
**T1 / Y2 lumen nopeus ja kulma (koodista, koska liike on vakio):** nopeus |v| = sqrt(0,5² + 0,10²) = 0,51 m/s, suunta 11,3° pystystä, vaakanopeuden etumerkki sama koko moduulin ajan; nopeuden ja kulman suurin ruutujen välinen muutos = 0 (vakio, ei riipu äänestä). Fraasin vaikutus on vain määrässä ja kirkkaudessa (nousu 0,5 s, lasku yli 1,2 s). Näin ollen taulukkoa 0,5 s välein ei ole: arvot eivät muutu.
**Fraasireaktion kirkkaus renderistä:** samat ruudut ilman reaktiota (väliaikainen `nofr`-kytkin, poistettu; `frilman/`) ja reaktion kanssa (`frmukana/`), alue = muuttuneiden pikselien ympäristö: hiutalekirkkauden summa mukana/ilman = 2,29 (0:36,4 eli abs 98,0), 1,76 (abs 101,4), 1,71 (abs 110,4). Vaatimus ≥ 1,5 täyttyy. Hiutalepikseleitä aluella 21108→24289, 15227→16798, 13814→15160.
**T2 regressiomittari** (`vertaa.py` vedos_v6u → uusi, `v7/vertaa.txt`):
```
  1:05.6 - 1:07.6   suurin mse 5.9   (osan aika 4-6 s)
  1:11.6 - 1:13.6   suurin mse 2.4   (osan aika 10-12 s)
  1:15.6 - 1:21.6   suurin mse 6.1   (osan aika 14-20 s)
  1:25.6 - 1:33.6   suurin mse 11.0  (osan aika 24-32 s)
  1:35.6 - 1:45.6   suurin mse 6.6   (osan aika 34-44 s)
  1:47.6 - 2:05.6   suurin mse 7.5   (osan aika 46-64 s)
  2:11.6 - 2:19.6   suurin mse 8.9   (osan aika 70-78 s)
  2:23.6 - 2:27.6   suurin mse 4.4   (osan aika 82-86 s)
  2:29.6 - 2:31.6   suurin mse 2.9
  2:35.6 - 2:37.6   suurin mse 2.6
  2:41.6 - 2:43.6   suurin mse 3.7
  2:51.6 - 2:57.6   suurin mse 4.1
  3:01.6 - 3:17.6   suurin mse 16.4   (ylöskatse)
```
Selitys: 1:05–2:57 kaikki jaksot ovat lumen vaihetta (kohta 2: hiutaleiden paikka on nyt vakionopeuden kertymä vanhan sinikäyrän tilalla, joten jokainen hiutale on eri paikassa) ja fraasijaksoilla (1:35–1:45 ym.) reaktion vaihtumista sekä `usvaPotku`n poistoa. Mittaus: keskikirkkaus ennallaan (osan 45 s: 43,04 → 43,04; 100 s: 40,23 → 40,23; 112 s: 39,70 → 39,69), pikseleitä joiden ero > 25 vain 0,06–0,13 % (hiutaleet), paitsi 26 s (2,1 %, alttoviulufraasi + valojuovien paluu paikalleen). Valo, sykkeet ja kamera ovat siis kuvassa samat. 3:01,6–3:17,6 = kohta 1 (ylöskatse), keskikirkkaus 124 s: 32,6 → 34,1, 130 s: 37,0 → 38,2, koska viirut ja hunnut on poistettu ja latvusmassa lisätty.
**T3 sauma:** ensimmäinen ruutu: keskiero vedokseen 6 = 0,0 (max 1); viimeinen ruutu: keskiero 0,10 (max 8).

### Mikä jäi vajaaksi tai epävarmaksi
- **Ruskehtavat viirut:** 3:06–3:13 latvusmassoissa näkyy yhä heikkoja ruskehtavia vinoviiruja (latvusten tummuuden vaihtelu, `HAMY * noise`). Ne ovat paljon himmeämpiä kuin vedoksessa 6, mutta eivät kokonaan poissa; en tiedä syytä varmasti (ei `shaftT`-lähde).
- **Latvusten muoto:** latvukset ovat pehmeitä tummia massoja, eivät yksityiskohtaisia kuusia; 3:10 jälkeen ruutu on lähes pelkkää usvaa ja taivasta. Kuusten latvusten kärkiä ei näy joka rungolla erikseen, koska lähimmät rungot häipyvät `farF`:llä (ennallaan).
- **Y1-raja (ohjaajalle):** puiden liike on vedoksen 5 mukainen (`(0.05 + 1.1 * tuuli) * hn² * Hh * 0.05 * (sin + 0.4 sin)`); suurimmillaan (tuuli = 1, hn = 1, Hh = 25) latva siirtyy laskennallisesti noin 2 m eli noin 8 % puun korkeudesta, mikä ylittää ohjeen 1 % / 1,5 % rajan. En korjannut (kielletty). Tavallisella tuulen tasolla (0,3) noin 0,6 m eli 2,5 %. Ikihongilla ei ole liikettä. Liikettä ei mitattu renderistä.
- **Fraasireaktion mittaus** tehtiin kolmelle fraasille vertailustillillä, ei kaikille; koko renderin whole-frame-mittarit olivat liian meluisia (kamera ja reunat).
- Moduulin 3:03–3:23 aikana kuvan keskikirkkaus nousi hieman (ks. yllä), mikä on seurausta viirujen poistosta.

## Vedos 7b (11.11.2026, rivi 96; brief `runs/vedos_v7/brief.md` luku "03_04 (rivi 96)", kohdat 1-3)

Renderi: `runs/maailma_03_04/osa.mp4`, 4242 ruutua (ffprobe), `--start 61.6 --end 203.0 --workers 2 --chunk 40`, aa=2, lukon kautta. Todisteet: `runs/maailma_03_04/v7b/` (`uusi/t150|164|178|184|188.png` täysikokoiset uudesta, `ref/` samat vedoksen 7 osasta, `sarja_7b.png` ja `sarja_v7.png` 2:28-3:12 2 s välein (ruutujen otsikot ovat osan aikaa: teos = otsikko + 1:01,6), `vertaa.txt`, `kirkkaus.txt`, `a1`-`a4` kehitysvaiheet).

### Mitä muutin (`visual/maailma_03_04.js`, tavallisten runkojen silmukka, rivit noin 175-205 ja 226)
- **Kohta 1:** uusi `far12 = smoothstep(10, 14, zr)`. Yli ~12 m:n päässä oleville puille (a) runko piilotetaan 86 % havuston alta alkaen korkeudelta `h0f` = 3-5 m (tyvi ja välähdykset jäävät); (b) `aF` (havusto) korvataan kuusiprofiililla: alkaa `h0f`:stä, levenee alaspäin, kärki suippo korkeudella Hh, kerroksittain riippuvat oksat (kerroksen korkeus 1,0-1,6 m, oksan alapinta viistoon alas ulospäin `hy + 1.3*|dxn|`), sahalaitainen reuna (`jag`), sama sävy kuin latvuksilla (`HAMY`-kohina); (c) vaalea reunaviiva (`rim`) kerrotaan `(1 - far12)`. Ei ajasta riippuvaa termiä, joten havusto on koko moduulin ajan (myös ennen 2:30). Polkua, valoa, pilkkoja, askeleita, kameraa, lähirunkoja (alle 10 m) ja ikihonkia ei koskettu.
- **Kohta 2:** ylöskatseessa samat puut ovat kuusia, joiden havusto jatkuu kärkeen asti (`sarja_7b.png` otsikot 2:02-2:10 = teos 3:04-3:12; 184 s still: kärjet ja havusto, ei viivoja yläreunaan). Nousun ja kiteen koodiin ei koskettu (`KC`, `uEnd`, `special`-haara ennallaan).
- **Kohta 3:** latvan tuuliterm kerrottu 0,6:lla (`lean`-lausekkeen toinen termi, `0.6 * (0.05 + 1.1 * uTop.z) * ...`); muoto ja vaiheet ennallaan, staattinen mutka (ensimmäinen termi) ennallaan.

### Mitatut luvut
**Keskikirkkaus vedos 7 vs. uusi (osan aika, 10 s välein, `kirkkaus.txt`):** ero 0,0 / 2,9 / 3,3 / 3,8 / 4,0 / 2,5 / 2,3 / 2,6 / 2,9 / 2,5 / 2,2 / 1,4 / 2,1 / 0,3 / 0,0 %; suurin 3,96 % (raja 4 %; rajalla, havusto tummentaa kuvaa hieman: kaikki erot ovat uutta tummempaa).
**T3 sauma:** ensimmäinen ruutu mse 0,001 (max 1), viimeinen mse 0,07 (max 2): ei muutu.
**T2 `vertaa.py`** (`vertaa.txt`): yksi jakso 1:01,6-3:13,6, suurin mse 55,1 (osan aika 0-132 s). Selitys: kohdat 1 ja 3 (kaukaiset puut kautta moduulin, latvojen liike 0,6x); kirkkauden pistemittaus yllä osoittaa, ettei valo siirry. Muuta ei määrätty eikä muutettu. Jakson loppu 3:13,6 on moduulin ylöskatseen/kiteen loppu; 3:14 eteenpäin (kide täyttää kuvan) ei muuttunut.

### Katsottu itse (Read)
Stillit 150, 164, 178, 184, 188 s sekä liikesarja 2:28-3:12: kaukaiset ja keskietäisyyden puut ovat riippuvaoksaisia, kärjellisiä kuusia, jotka sulavat tummaksi seinäksi; paljaita vaaleareunaisia viivoja ei näy; yläreunaan asti ulottuvia viivoja ei ole 3:02 jälkeen.

### Mikä jäi vajaaksi
- Keskikirkkauden ero 3,96 % on aivan rajalla.
- t178 (2:58): keskietäisyyden havustossa näkyy leveitä vaakasuuntaisia pehmeitä kaistoja (usvakerrosten ja päällekkäisten oksakerrosten summa), jotka muistuttavat enemmän levyjä kuin kuusia; en saanut niitä pois ilman tason muutoksia.
- Alin havusto on vain 3-5 m korkeudelta, joten 12-20 m päässä rungosta näkyy tyvi vain noin 1-2 m; "välähdyksiä oksien välistä" on niukasti.
- Y1-ylitys säilyy: tuuliliike 0,6x vedoksen 5 arvosta on yhä ehkä 1,5-5 % korkeudesta suurimmillaan (laskettu, ei mitattu renderistä); 0,6 kertoimella tavallisella tuulella noin 1,5 %.
- Ruskehtava vihreähtävä sävy 3:07-3:12 oli jo vedoksessa 7 (verrattu `sarja_v7.png`), ei korjattu.
- Liikesarjaa 2:28-3:12 katsottu vain 2 s välein; kaikkien jaksojen yksityiskohtia ei käyty ruutu ruudulta.

### Vedos 7b, korjauskierros (ohjaajan huomautus: vaakakaistat t178)
**Syy (bisektoitu magenta-värillä ja kytkimillä, `v7b/b1`-`b13`):** vaakakaistat eivät olleet kuusen muotoa vaan havuston alareunan pehmeä reuna (`smoothstep(h0f-0.5, h0f+0.4, hy)`, osittainen alfa) + siihen lisätty reunavalo (`edgeM`-termi): koko puun levyinen vaalea juova jokaisen puun havuston alarajalla. Lisäksi runko, jolla ei ollut kuusiprofiilia, näkyi kerrosten rakoina.
**Korjaus (`visual/maailma_03_04.js`):** (1) havuston alaraja terävä ja viistoon alas ulospäin (`smoothstep(-pwf, pwf, hy + 0.7*|dxn| - h0f)`); (2) reunavalo pois kaukohavustosta (`* (1 - far12)`), samoin yläkeilan `tl`-lisät; (3) havusto umpinainen tumma, `HAMY*(1.75 + 0.40*kohina)` (kirkkaus mitattu, ei harmaata liukua); (4) kartio: puolileveys `w0*(1-hr)*(0.70+0.30*(1-ph))`, w0 = 1.2-2.2 m, kerros 1.0-1.6 m, kerroksen alapinta viistoon (`hy + 1.6*|dxn|`); (5) kaukokuusen alue alkaa nyt 4-6,5 m:stä (`far12 = smoothstep(4.0, 6.5, zr)`), jotta lähempien puiden vanha lehtimäinen/kiemuraviivoinen havusto korvautuu samalla piirrolla. Runkoja lähempänä kuin ~4 m ei kosketa.
**Renderi:** `runs/maailma_03_04/osa.mp4`, 4242 ruutua. Stillit `v7b/uusi/t150|164|178|184.png`, sarja `v7b/sarja_7b.png`.
**Kirkkaus (`kirkkaus.txt`)**: suurin ero vedokseen 7 5,27 % (raja 6 %). Sauma: eka ruutu mse 0,002, vika 0,10 (max 4). `vertaa.txt`: yksi jakso 1:01,6-3:17,6, mse 67 (kohdat 1 ja 3 ja tämä korjaus).
**Vajaaksi jää:** lähimmät kuusikartiot (4-8 m) ovat suuria suoralinjaisia tummia massoja, joiden alapinta on selvästi viisto viiva; keskietäisyyden puiden kartio erottuu 2:58:ssa huonosti tummaa taustaa vasten (tummaksi seinäksi sulava havusto, ei yksittäisiä kuusia), ja osan puiden tyvi näyttää katkaistulta kantolta, kun kartio alkaa 3-5 m:n korkeudelta. Ylöskatseessa (3:04) kuusien kärjet erottuvat hyvin. Vihertävä sävy on tyylin `HAMY`.

### Vedos 7b, viimeinen kierros (kantomaisuus, näkyvä kuusi)
Muutokset (`visual/maailma_03_04.js`): (1) lumi oksakerrosten yläpinnoilla (`snowF`, kerroksen yläosa ph 0,5-0,85), hallan valo `gcol*I*0.17*shl*exp(-zr/60)*mix(0.2,1,side)`, noin puolet rungon rim-valosta, valon puolella selvempi; pohjasävy pysyy rungon `HAMY`-sävynä; (2) runko peittyy havuston alla liukuen (`smoothstep(h0f-0.3, h0f+2.0, hy)`, 0 -> 86 % noin 2 m:llä) ja alimmat oksat ovat lyhyitä (`Wf *= 0.3+0.7*smoothstep(0,2.5,hy-h0f)`); (3) havusto alkaa vasta 7-9,5 m:stä (`far12 = smoothstep(7,9.5,zr)`), lähempänä kapeampi. Ruudut `v7b/uusi/t150|164|178|184.png`; keskikirkkauden suurin ero vedokseen 7: 1,48 %; sauma eka mse 0,001, vika 0,07; vertaa.txt: yksi jakso 1:01,6-3:17,6. Vajaaksi: lumilevyt ovat yhä kulmikkaita (boksimaisia) ja osa kauempana olevista puista on suurina tasaisina massoina; kantomaisuus on poissa, mutta 7 m:n sisällä puut ovat vanhaa piirtoa.

### Vedos 7b, lopullinen (brief: "03_04, KORJAUS (rivit 99 ja 100): luminen havusto hyvin tehtynä")
Muutokset (`visual/maailma_03_04.js`, kaukohavuston haara, alue 7-9,5 m ja kauemmas): rungot vedoksen 7 piirrolla (peittokerroin poistettu); havusto orgaaninen: kerroskoordinaatti kohinalla vääristetty, jokaisen oksan pituus satunnainen, kärjet alas kaartuvia, repaleinen reuna kahdesta kohinasta, reuna pehmenee etäisyyden mukana; lumi pehmeänä kohinapaksuisena kerroksena oksan yläosassa, paikoin paljas, valo `gcol*I*0.17*...` (noin puolet rungon rim-valosta); havuston sävy `HAMY*(0.70+0.25*kohina)` + hieman `AMB`-usvaa etäisyyden mukana. Latvojen liike 0,6x. Renderi `runs/maailma_03_04/osa.mp4` 4242 ruutua. Ruudut `v7b/uusi/t150|164|178|184.png`, lähennys `v7b/zoom_uusi_178.png`, sarja `v7b/sarja_7b.png`. Keskikirkkauden suurin ero vedokseen 7: 2,56 %; sauma eka mse 0,001, vika 0,08; vertaa.py: yksi jakso 1:01,6-3:17,6, mse 61. Vajaaksi: lähennetyssä 2:58-ruudussa lumilaikut ovat paikoin jäykän näköisiä ja osa reunoista on lähes vaakasuoria; lumi näyttää laikuilta, ei oksien kerroksilta; pehmeys on riittämätön kauempana.

## Vedos 7b, korjaus B (brief: "03_04, KORJAUS B (rivit 101-103)")
Renderi: `runs/maailma_03_04/osa.mp4`, 4242 ruutua (ffprobe), `--start 61.6 --end 203.0 --workers 2 --chunk 40`, aa=2, lukon kautta. Kuvat: `runs/maailma_03_04/v7bB/` (`vertailu_150|172|182.png` = vedos 7b vasemmalla, korjaus B oikealla, keskirajaus crop=800:700:560:0 kohdista 2:30, 2:52, 3:02; yksittäiset `crop_7b_*` ja `crop_B_*`; `askeleet_1_38-2_02.png`, `askel_111_89.png`, `askel_122_42.png`; `vertaa_v7.txt`, `vertaa_7b.txt`; `osa_7b.mp4` = edellinen osa).

### Mitä muutin (`visual/maailma_03_04.js`)
- **Kohta 1 (syy):** `clearL`-rivin (noin 158) alle uusi `clearFar = mix(clearL, 1.0, smoothstep(14.0, 32.0, zr))`; havuston `aF`-rivit (noin 190, 191) ja kaukohavuston `aFf` (noin 204) käyttävät `clearFar`ia `clearL`in sijaan, samoin ylöskatseen latvusydin. Raivaus pysyy lähellä (alle 14 m), 32 m:stä kauemmas ei raivausta. Kokeilin kapeaa kulmaltaan vakiota valorakoa (`gapW`), mutta se jätti käytävän reunalle teräviä pystyviipaleita (näyttivät taas tolpilta), joten hylkäsin sen.
- **Kohta 2:** kaukaisten puiden (`far12`) runko suipenee piikiksi latvassa (`rw *= mix(1, clamp((1-hn)/0.22,0,1), far12)`), ja havuston kohinareunan siirtymä (`jag`) vaimenee kärjessä (`jag *= 1 - smoothstep(0.8,1,hr)`): yksikään kaukainen runko ei pääty tasaiseen katkaistuun päähän.
- **Kohta 3 (välke):** uusi `vnF(p, fr, pw)`: kohina, jonka taajuudet sulavat keskiarvoon, kun ne ovat pikselin jalanjälkeä hienompia; käytössä havuston reunan (`jag`, `bot`), lumen paksuuden (`thick`) ja havuston sävyn kohinoissa. Kohinat ovat jo maailman koordinaateissa eikä niissä ole aikaa. Lumi: alareuna myötäilee oksan kaarta (`phS`), lumi ohenee oksan kärkeä kohti (`tipT`), pehmeämmät rajat (`topW`).
- **Kohta 4 (askeleet):** askellista = `askeleet_alkavat.iskut_t` (15) + oman tunnistuksen askeleet, jotka ovat viimeisen iskut_t:n (135,24) jälkeen eivätkä alle 0,5 s päässä iskut_t:stä; voima mitataan samalla mittarilla kuin ennen. Ei muuta ilmettä (pulssikoodi ennallaan).

### Todisteet
**Keskirajaukset (katsottu itse Readilla):** 2:30, 2:52 ja 3:02: vedoksessa 7b käytävän kaukaiset rungot olivat paljaita tolppia (2:52: kapeat pystytolpat keskellä); nyt keskellä on kuusen muotoisia, tummia, kärjellisiä havupuita, eikä yhtään paljasta tolppaa tai katkaistua päätä näy. 2:30: vasemman keskipuuryhmän tolpat ovat poissa. 3:02: ylöskatseessa kärjet ja havusto ovat kuten ennen, nousu ja kide ennallaan.
**Askeleet (mallista, `window.askelLista`):**
- ennen (oma tunnistus, 32): 98,93 100,43 102,27 110,07 111,2 114,73 116,63 118,33 120,13 121,7 125,43 127,47 129,63 131,17 133,27 135,07 137,07 138,9 140,83 142,63 143,8 144,93 146,4 148,4 154,4 156,03 157,17 159,5 163,33 169,43 172,7 174,47
- jälkeen (31): 99,04 100,5 102,3 111,89 115,03 116,71 118,55 120,35 122,42 125,8 127,74 129,53 131,36 133,24 135,24 137,07 138,9 140,83 142,63 143,8 144,93 146,4 148,4 154,4 156,03 157,17 159,5 163,33 169,43 172,7 174,47 (kaikki 15 iskut_t mukana; 137,07 alkaen oma tunnistus).
Renderistä: liikesarja 1:38-2:02 (`askeleet_1_38-2_02.png`) ja tarkennussarjat 111,89 ja 122,42 (`askel_111_89.png`, `askel_122_42.png`): valo lumessa ja usvan väistyminen toistuvat kuten ennen. En käynyt kaikkien 15 askeleen sarjoja ruutu ruudulta (vain kaksi uutta ja yleissarja).
**Välke (60 ruutua, 2:50-2:52, harmaa, ruutuero):** havustoalue (x760-1000, y100-400) ka 0,613, runkoalue (x1150-1260, y100-500) ka 0,514: suhde 1,19 (raja 1,5); 7b:ssä 1,24. Pikseleistä, joiden kirkkaus muuttuu yli 25 tasoa kahden ruudun välillä: enintään 0,35 % (7b 0,37 %). En erikseen seurannut yksittäisten laikkujen syttymistä ruutusarjalla 2x; mittari on aggregaatti.
**T2 `vertaa.py` vs vedos 7** (`vertaa_v7.txt`): yksi jakso 1:01,6-3:17,6, suurin mse 61,9 (kaukaiset puut koko moduulissa: kohdat 1-3 ja 7b:n havusto; lähellä ei muutosta). **vs 7b** (`vertaa_7b.txt`): 1:01,6-2:19,6 (mse 35, kaukohavusto 32 m:stä, askelvalot), 2:21,6-2:23,6 (2,7), 2:25,6-3:11,6 (17,7). Muuta ei määrätty eikä muutettu.
**Keskikirkkaus 7b vs B (10 s välein):** useimmissa kohdissa ero alle 1,2 %, mutta kaksi poikkeamaa: 1:51,6 (5,7 %) ja 2:11,6 (12,8 %). Ne ovat pistemittauksia askelpulssin kohdalta (askelten ajat siirtyivät 0,1-0,3 s kohdan 4 mukaan, joten pulssin vaihe on eri); en varmistanut muuta syytä.
**Sauma:** ensimmäinen ruutu mse 0,001, viimeinen (141,3 s) 0,11 (7b:llä 0,08-0,10): ei muutu näkyvästi.

### Mikä jäi vajaaksi
- Käytävän pään valo peittyy suurelta osin: keskellä kaukana jää vain kapea valoraita tyvelle (2:52); kapea rako ei toiminut (viipaleet). Jos halutaan enemmän valoa, se vaatii oman ratkaisun.
- Kirkkauspoikkeamat 5,7 % ja 12,8 % askelhetkillä ylittävät aiempia rajoja; syy oletettu, ei todennettu erikseen.
- Lähirungot (alle ~7 m) eivät saaneet suippoa latvaa (latva kuvan ulkopuolella); sitä ei erikseen todennettu ylöskatseessa.
- Lumen välkettä ei mitattu laikku laikulta; ruutusarjaa 2x ei otettu.
- Y1: latvojen liike 0,6x (vedos 7b), ei muutettu.

### Vedos 7b, korjaus B2 (ohjaajan lisäys: käytävän pään valon pylväs)
Syy: korjaus B peitti havustolla sen raivatun käytävän, jonka läpi vedoksen 7 valaistu usva näkyi. Korjaus (`visual/maailma_03_04.js`): kerroslinjan silmukassa, kun kerros ylittää 22 m (kerran per säde), lisätään valon väri `gcol*I*PILLAR_A(0,42)*(1+0,35*askelpulssit)` pehmeänä pystypylväänä käytävän akselille (leveys noin 1,15 m, korkeus `exp(-ya/9)` 70 m:n referenssietäisyydellä, akseli = `laneX`, ei kuvan x): se on kaukaisen havuston päällä ja lähempien puiden takana; ei käytössä ylöskatseessa. Havuston muotoihin ei koskettu (kokeilut valaistusta havustosta ja raivausraosta hylättiin: särmikkäitä kantoja ja viipaleita). Renderi `osa.mp4` 4242 ruutua. Vertailukuvat (vedos 7 vasemmalla, uusi oikealla): `v7bB/pv_101.png`, `pv_152.png`, `pv_172.png`.
**Keskikaista** (120 px pylvään kohdalla, rivit 162-594; kaista seuraa pylvästä), uusi vs vedos 7: 1:41 +2,4 %, 2:10 -4,7 %, 2:32 -6,9 %, 2:52 +7,8 % (kaikki alle 10 %).
**Koko kuva 10 s välein** (uusi vs v7): enintään 4 % paitsi 1:41 (+5,3 %, askelpulssin ajan siirtymä: iskut_t 100,5 ja 102,3), 2:01 (-3,9 % ok), 2:21 (+3,0 % ok) ja 3:11 (-5,3 %: ylöskatse, kaukohavusto 7b:stä, ei pylväs). Muut -2,8...+3,0 %.
**Vajaaksi:** pylväs on matalampi ja pehmeämpi kuin vedoksen 7 teräväreunainen rako (2:52: v7:n pylväs ulottuu ylemmäs), ja leveät hehkut (1:41, 2:32) ovat hieman himmeämpiä; pylväs on paikoin hieman heikompi kuin v7. 3:11 jää -5,3 %. Sykkeiden näkyminen pylväässä on mallinnettu (askelpulssit), mutta sitä ei katsottu ruutusarjasta.
