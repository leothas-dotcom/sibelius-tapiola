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

(Täydennetään kohtiin 2–5 työn edetessä.)
