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
