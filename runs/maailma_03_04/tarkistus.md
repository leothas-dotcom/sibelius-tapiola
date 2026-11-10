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
