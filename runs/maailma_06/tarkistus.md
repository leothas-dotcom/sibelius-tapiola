# Maailma 6 tarkistus (visual/maailma_06.js), rakentajan raportti

Aikaväli `pohja_vaihtuu_D` (336,8 s) → `jousijakso_urkupiste_E_alku` (496,3 s), Rattle 2022. Ankkureista, ei käsin kirjoitettuja sekunteja.

## Suunnitelma
**Paikka:** musta talvijää, jonka toisella rannalla on siemenen kuva: horisontin valo (pitkä ääni) kumpujen takana, tumma metsän massa kuudessa kerroksessa, sileät kummut. Kamera 0,45–1 m jään yllä, kulkee jäätä pitkin kohti rantaa (101 m, hitaasti, hieman viistoon). Kuva on säteenseurantaa: jää on taso, metsä tasoina, peilikuva on heijastus. Peilikuva on siis metsän ylösalaisin jäässä.
**Kamera:** alussa katse alas (kuva = rajakuva JAA), 12 s aikana nousu ja käännös vaakaan (enintään noin 12 °/s), sitten tasainen eteneminen. Lopussa kohti kahta runkoa ja niiden väliä, pimeä täyttää kuvan.

| Kuunteluoppaan rivi | Kuvassa | Signaali |
|---|---|---|
| pohja vaihtuu, matala d sykkii | valon rengas kulkee jään pinnassa | `d.alut` (matalan kaistan alut) |
| gis palaa, pitkä ääni | horisontin valo kirkastuu kumpujen takana | `d.pitka` (painotus gis_palaasta) |
| peikot G | pilkahduksia jään alla, korkeus = etäisyys | `d.nuotit` (lyhyet, midi 72+) |
| käyrätorvipulssit | horisontin valo hengittää | `d.pitka` |
| vyöry H-urkupisteellä | aalto koko metsän ja peilikuvan läpi, hidas, raskas | `d.keski` + vyöry-verho (ankkurit) |
| vaskipulssit | huurre leviää säröistä sykäyksittäin ja jää | pitkän äänen alut (`d.taso`/`d.pitka`), 8 sykettä |
| metsä harvenee, hajoaa | glow ja pilkahdukset hiipuvat, runkojen näkyvyys nousee | pitka, nuotit, ankkurit |
| nousu / lasku | kumpujen ja valon korkeus | `tapahtuu('nousu'/'lasku')` hidas keskiarvo |
| urkupiste | jää ja horisontti pysyvät (ei värinää), metsä ja peilikuva liikkuvat | `tapahtuu('urkupiste')` |
| liike | kameran vauhti ±20 % hitaana keskiarvona | `tapahtuu('liike')` |

## Miten metsä elää (ohjaajan korjaus 10.11.)
Metsä huojuu koko ajan tuulessa: latvat taipuvat yhdessä, tyvi ei liiku (`amp`, `ph`), ja koko latvuston massa velloo yhtenä aaltona (`uSwell`: sivuttaissiirtymä ja hidas korkeuden vaihtelu aallossa, jonka vaihe on kertymä). Peilikuva velloo samasta aallosta ja lisäksi jään pinnan vääntyvänä aaltona (`uSwI`). Tuuli on musiikki: amplitudi = jousten voima (`d.keski`), vyöryssä (420–436 s) vahvempi, ja vaihe etenee nopeammin. Tummuus vyöryy rannasta kauas jousten tullessa (`uLive`, viive kerroksittain). Mikään ei kasva tai pompi nuoteista; ei iskuja tällä välillä (`d.iskut` tyhjä).

## Rajakuvat
- **Alku:** still 336,8 s: keskiarvo RGB (24, 35, 46), hajonta 1–2, vastaa RAJA.JAA:n laskettua arvoa. Kaikki lisäykset kerrotaan `uOpen`:lla (0 → 1 yhdessä ja puolessa sekunnissa). Avautuminen: säröt tulevat näkyviin kameran noustessa (337–344 s), horisontti laskeutuu ruudun ylälaidasta paikalleen 344–349 s. Katsottu stilleistä sekunnin välein.
- **Loppu:** still 496,3 s: lineaarinen keskiarvo (0,00160; 0,00220; 0,00298) = PIMEYS, hajonta alle 0,5 (dither). Lopussa viimeiset 6 s sekoitetaan PIMEYS:iin; pimeä väli täyttää kuvan jo ennen sitä (rungot lähtevät kuvasta noin 480 s).

## Tyyliohjeen luku 12 (0–21) ja 4d (1–19)
Toteutuu / ei koske / ei toteudu. Ruudut: `runs/maailma_06/tark/arkki.png` (ajettu 20 hetkeä 352–496 s) ja yksittäiset stillit.

| Kohta | Tila |
|---|---|
| 0 ääni ohjaa | toteutuu osin (valo, renkaat, pilkahdukset, huurre, vellonta: kyllä; tremolo: ei tapahtumaa välillä) |
| 1 kamera sisään ja eteen | toteutuu; katseen korkeus muuttuu vain alussa |
| 2 pysähdys | ei koske, ei pysähdystä |
| 3 ei pyöritystä, ≤ 20 °/s | toteutuu (huippu noin 12 °/s, laskettu: 1,5 × 94° / 12 s) |
| 4 kamera ei reagoi iskuun | toteutuu |
| 5 siirtymä kulku, ≥ 4 s | toteutuu (alku 12 s, loppu 20 s), mittakaava jatkuva |
| 6 kolme syvyyskerrosta | toteutuu (jää, kuusi metsäkerrosta, kummut) |
| 7 puhuja tulee lähemmäs | osin: pilkahdukset etenevät korkeuden mukaan etäisyydelle |
| 8 reunat eivät vuoda | toteutuu |
| 9 metsä näkyy massana | toteutuu (ei puuriviä); latvat ovat osin liian piikikkäitä, ks. heikkoudet |
| 10–11 isku ympäristössä, ei ilmesty | ei koske (ei iskuja välillä); rengas on jo jäässä |
| 12 enintään kolme liikkuu | osin: vellonta, huurre, pilkahdukset samaan aikaan |
| 13 väike kaukana | ei toteudu täysin: pilkahdukset jään alla, ei kaukaa |
| 14 valolla lähde | toteutuu (horisontin valo, rengas, jään alla) |
| 15–16 ei lämpöä, ei punaista, ei kajoa | toteutuu |
| 17 värit vaihtuvat ei iskussa | toteutuu |
| 18 hiljaisuus | osin: lopussa elementit hiipuvat, jää ja metsä jäävät |
| 19–21 ei paperia, kliseitä, tekoälykuvia | toteutuu; ei revontulia, ei hahmoja; neonviiva poistettu |
| 4d.1 metsä pysyvä mutta huojuu | toteutuu: ei pomppua, ei kasvua nuoteista |
| 4d.2 laaja ja syvä | osin (kuusi kerrosta, mutta usvaa on vähän) |
| 4d.3 kamera eteen | toteutuu |
| 4d.4 maailmat sisäkkäin | toteutuu (jää → ranta → runkojen väli) |
| 4d.5 gis horisonttina, mäet | toteutuu (hidas, 2,6 s keskiarvo) |
| 4d.6 olennot | ei koske tässä maailmassa |
| 4d.9–10 massa, jousten intensiteetti | toteutuu (tummuus ja vellonta) |
| 4d.11 Tapion talo | ei koske |
| 4d.12 revontulet | ei koske, ei revontulia |
| 4d.13 kamera ei maan läpi | toteutuu (korkeus aina ≥ 0,45 m) |
| 4d.14 yksittäinen puu | kaksi runkoa lopussa, nimetty briefissä (Ikisalon ensimmäiset pylväät) |
| 4d.16 parallaksi | toteutuu (jään raot liukuvat nopeasti, ranta hitaasti, viisto ajo) |
| 4d.17 mikään ei väri spektrin tahdissa | toteutuu (keskiarvot 0,3–2,6 s) |
| 4d.18 ei teräviä vuoria | toteutuu (kummut sileitä) |
| 4d.19 etualan puu | toteutuu (ei puuta) |
| 4d.20 valo ja varjo | osin |
| 4d.22 uskottava, siemen | toteutuu osin: ks. alla |

## Kuunteluoppaan rivit
Näkyy: pohja vaihtuu (renkaat), gis palaa, peikot G (pilkahdukset), käyrätorvipulssit (horisontin valo), vyöry, vaskipulssit (huurre), nousu/lasku (kummut), urkupiste, loppu. Osin: staccato-pilkahdukset muualla (voima 0,35), liike hidastuu/kiihtyy (vain kameran vauhti), ylärekisteri sammuu (kumpujen valo vain epäsuorasti). Ei: tremolo (ei tapahtumaa välillä), `basso vaikenee` erikseen (vain maan hohto hiipuu).

## Omat lisäykset
- Rajan runkojen näkyvyys nousee 458–480 s (usva väistyy): ilman sitä rungot olisivat näkyneet alusta asti; perustelu: brief "jään takaa nousee".
- Matala usvakaista horisontissa (uMist): rannan ja jään raja pehmeäksi, tyyliohje 1 (usva).
- Lumi jään pinnalla viiruina: brief "lunta pinnalla". Putoavaa lunta ei ole toteutettu.

## Heikkoudet (rehellisesti)
- **Loppu on heikko:** rungot erottuvat huonosti tummasta metsästä (tummat tummaa vasten), pimeä väli näkyy aluksi tasaisena suorakulmiona (480–490 s) ja jää pysyy vaaleana huurteisena lähes loppuun; katsottu vain harvoilla stilleillä. 25 viimeistä sekuntia ovat pääosin tasaisen tumma, ja yli 20 s samannäköistä.
- Latvat ovat osin liian piikikkäitä, kun kamera lähestyy (joulukuusivaikutelma); vähennetty mutta ei poistettu.
- Peilikuva peittyy huurteella 450 s jälkeen lähes kokonaan (huurre jää, brief); siemenen peilikuva on selvin 368–445 s.
- Metsän vellontaa ja huojuntaa ei ole katsottu liikesarjana (vain stillit); sen suuruus (±10 % korkeudessa, muutama metri sivusuunnassa) voi olla liian hienovarainen.
- Huurre voi näyttää epäluonnolliselta (läiskäinen), särötiilet ovat paikoin Voronoi-näköisiä.
- Rengasta ei ole tarkistettu jatkuvuuden mittarilla; renderöinnit olivat aa=1.
- Näytönohjainajoja ei tehty videomuodossa.
