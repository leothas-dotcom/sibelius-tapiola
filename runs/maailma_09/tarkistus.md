# Maailma 9: Petos ja hermo (`visual/maailma_09.js`)

Aikaväli: `M_raskaat_askeleet` → `hiljaisuus_2_alku` (Rattle / LSO 2022, kuuntelukopion ajat; ajat tulevat `d.aika`sta ja
`annotations/cues.json`:sta, ei käsin kirjoitettuja sekunteja). Alku: `RAJA.PIMEYS`, loppu: `RAJA.PIMEA_MASSA`.

## 1. Suunnitelma (kirjoitettu ennen koodia)

**Maailma yhdellä kappaleella.** Kalevalan pimeä metsä, josta valo on viety vuoreen yhdeksän oven taakse ("yö pitkä,
pilkkoisen pimeä", K49). Katsoja ajaa silmänkorkeudella tasaisen lumisen maan yli vanhan metsän läpi: rungot eri
etäisyyksillä (parvet, ei rivi), latvusto päällä, usva kaikkialla, kaukana heikko kajo. Mikään ei ole näkyvissä, ellei
jokin valaise sitä: maasta nouseva valo (askeleet, aksentit), iskun pystyvalo ja himmeä jälkihohto. Yhdeksän ovea ovat
yhdeksän tummaa, sileää kumpua (vuori) polun poikki, joihin on avattu kaareva aukko; niiden läpi ajetaan yksi
kerrallaan. Yhdeksäs kumpu on umpinainen: se kasvaa ja täyttää kuvan. Ahdistus on sallittu (tyyliohje 2.10): vauhti on
teoksen suurin, eikä liikettä voi pysäyttää.

**Siemenen kuva tässä maailmassa.** Horisontin heikko kajo kaukana polun päässä (gis-horisontti pimeässä), sen alla tumma
massa, sileät loivat kummut kajoa vasten (horisontin profiili seuraa melodian kaarta hitaasti; kummut ovat myös ovet),
lumi maassa ja usvana. Joka valaistuksessa sama asetelma: valo keskellä kaukana, tumma massa sen ympärillä, kummut.

**Kameran reitti.** Alku: pimeys täyttää kuvan (rajakuva) ja osoittautuu ensimmäisen kummun seinäksi, jonka aukko
kasvaa kolmessa-neljässä sekunnissa koko kuvan kokoiseksi (jatkuva mittakaavan muutos), kamera lähtee levosta ja
kiihtyy. Kamera kulkee suoraan eteen ilman pyörimistä; sivusuuntainen ajautuminen (viistoon) antaa parallaksin. Korkeus
on vakio 1,7 m tasaisen maan yllä. Ovet 1–8 ylitetään musiikin rakennekohdissa (ankkurit), vauhti = soivien nuottien
tiheyden hidas keskiarvo (4 s). Loppu: rungot harvenevat dim_possibilen aikana, yhdeksäs kumpu kasvaa horisontista
koko kuvaksi ja kuva sulaa täsmälleen rajakuvaan PIMEA_MASSA.

**Kuunteluoppaan rivi → kuvassa → signaali.**

| Rivi (kuunteluopas) | Mitä kuvassa tapahtuu | Signaali |
|---|---|---|
| 11:31 raskaat askeleet | maasta välähtää valo: rengas kulkee lumen pintaa eteenpäin ja valaisee runkojen tyvet ja kummun seinän | `d.alut` (matalan kaistan alut) |
| 11:42 tremolo | massan reunat väreilevät paikallaan, hienojakoisesti (ei pomppua) | `d.tapahtuu("tremolo")` |
| 11:51 jännitteinen jousijakso | jousten hermo: väre massassa, kajo seuraa jousten voimaa, vauhti nousee | `d.keski`, jakson ankkurit |
| aksentit jaksossa | pieni maan valo (rengas), ei pystyleikkausta | `d.aksentit` |
| 11:58 / 12:09 laskut ja nousut | kajon korkeus laskee ja nousee | `d.tapahtumat` nousu, lasku |
| 12:14 kirjain O | puupuhaltimien pilkahdukset (väike) syttyvät usvaan jousten värinän lomaan | `d.nuotit` ankkurien välissä |
| 12:36 vaskivuorottelu | kaksi valon paikkaa vasemmalla ja oikealla pimeässä, vuorotellen | matalan rekisterin voima (käyrätorvet), vastakohta (trumpetit, tulkinta) |
| 13:00 harva kuviointi | lähes täysi pimeys, yksittäisiä pisteitä usvassa | `d.nuotit`, `d.keski` |
| 13:05 pohja katoaa | maa ja runkojen tyvet häviävät alta, metsä leijuu | tapahtuma "kerros katoaa" |
| 13:26 kirjain P | nimetty isku: pystyvalo kerrosten läpi, rungot, usva ja varjot kohti katsojaa; sitten kajo paisuu ja laskee | `d.iskut`, `d.keski` |
| 13:45 vasket häipyvät → 14:05 | rungot harvenevat, valo hiipuu, yhdeksäs kumpu edessä kasvaa ja täyttää kuvan | taso, ankkurit |


## 2. Toteutus lyhyesti
Varjostin laskee maiseman ruutu ruudulta aikafunktiona: 52 runkokerrosta (parvet eri etäisyyksillä, sijainti hajautettu, ei rivi),
latvusto, lumen pinta, usva, yhdeksän kumpua (ovet) ja kaukainen horisontti. Kamera on vauhdin integraali (`d.sarja`), vauhti =
alkavien nuottien tiheyden 4 s keskiarvo (3 -> noin 10 m/s, alku levosta). Ovet 1-8 ylitetään ankkureissa
(`M_raskaat_askeleet`+3,8 s, `jannitejakso_alku`, `O_kirjain`, `jannitejakso_loppu`, `allegro_moderato_O_loppu`,
`harva_kuviointi`, `P_vaskipaisunta` t_end, `dim_possibile`); yhdeksäs on umpinainen ja saavutetaan `hiljaisuus_2_alku`:ssa.
Mittaus: `window.kuvaus(t)` (vauhti, kajo, pystyvalo, väre, tuuli, kaksi valoa, maa, renkaat, pilkut, seuraava ovi).

**Miten metsä elää (ohjaajan korjaus 10.11.2026).** Puut huojuvat tuulessa: runko taipuu latvaa kohti (siirtymä ~ korkeus^2),
latvusto kulkee mukana, ja tuuliaalto kulkee metsän läpi syvyyssuunnassa. Tuulen voima (`wind`) = jousten/kokonaistason hidas
keskiarvo (`lvl`, 1 s) + nimetyn iskun puuska (hidas jälkihohto 4 s). Puut eivät kasva, kutistu, pompi eivätkä vaihda paikkaa;
maa ei liiku. Tremolo on erillinen pieni väre rungon leveydessä (jännitejakso ja `tremolo`-tapahtuma). Huojunta näkyy
ruuduissa 806,6-807,4 s (kaarevat rungot) ja arkissa `ruudut/liike_O_ja_P.png`.

## 3. Säännöt (tyyliohje luku 12 ja 4d)
Kaikki tarkistettu stilleistä 691,6-845,6 s (arkit `tark/`, `ruudut/`). Ei koko liikesarjaa jokaisesta kohdasta: vain O (734,2-735,2) ja P (806,4-807,4).

| Sääntö | Tila | Peruste / ruutu |
|---|---|---|
| 0 ääni ohjaa (korkeus, voima, tapahtumat) | osin | kajo = taso, askeleet = renkaat, tremolo = väre, vuorottelu = kaksi valoa, pohja katoaa = maa sulaa, pilkut = korkeus; nousu/lasku siirtää kajoa vain 0,045 (vaikea erottaa) |
| 1 kamera sisään ja eteen | toteutuu | koko väli |
| 2 pysähdys vain nimetyissä | toteutuu | alkuhetki levosta (kiihdytys), muuten ei pysähdystä |
| 3 ei pyöri, alle 20 °/s | toteutuu | ei kiertoa lainkaan |
| 4 kamera ei reagoi iskuun | toteutuu | vauhti vain 4 s keskiarvosta |
| 5 siirtymä kulku, vähintään 4 s | toteutuu | alku: kummun aukko kasvaa 691,6-695,4; loppu: yhdeksäs kumpu 828-840 |
| 6 vähintään kolme syvyyskerrosta | toteutuu | 705 s, 745 s |
| 7 puhuva tulee lähemmäs | osin | pilkut tulevat kameraa kohti, mutta eivät erikseen "etualalle" |
| 8 kerrokset etäisyyttä, reunat eivät vuoda | toteutuu | usva ja kerrokset; ei tyhjää reunaa |
| 9 metsä näkyy, ei rivi, ei esineitä | toteutuu | 705, 730 s; latvusto heikosti näkyvä (heikkous) |
| 10 iskun elementti ympäristössä | toteutuu | P 806,6: pystyvalo ja varjot maassa; askeleet: maan rengas |
| 11 ei ilmesty/katoa/loiki iskussa | toteutuu | 806,4-807,4 |
| 12 enintään kolme elementtiä liikkuu | toteutuu | tuuli, värinä, valo |
| 13 väikkeen koti kaukana | toteutuu | pilkut 20-110 m päässä |
| 14 valolla lähde | toteutuu | kajo kaukana, maa, kolonni |
| 15-16 ei punaista, ei kajoa (H-duuri) | toteutuu | väri vain hämy, salo, halla |
| 17 värit eivät vaihdu iskussa | toteutuu | |
| 18 hiljaisuus | ei koske | väli päättyy hiljaisuuden alkuun; musiikin häipyessä kajo ja rungot häviävät, kumpu täyttää |
| 19-21 ei edellistä tyyliä, kliseitä, tekoälyä | toteutuu | koodilla |
| 4d.1 puut käyttäytyvät kuin puut | toteutuu | huojunta, ei pomppua |
| 4d.2 metsä laaja ja syvä | toteutuu | 705, 745 s |
| 4d.3 kamera eteen, puut ohi | toteutuu | |
| 4d.4 maailmoja sisäkkäin | toteutuu | ovet, kaukainen oven aukko näkyy jo kaukaa (705, 730, 765 s) |
| 4d.5 gis-horisontti hitaasti | osin | horisontti piirtyy vain aukkojen kautta, melodian kaari 0,8 s portain |
| 4d.6 mystiset olennot | ei koske | tämän maailman brief ei vaadi; väike on ainoa |
| 4d.9 metsä massa, 4d.10 jouset näkyvät | osin | jousten voima = tuuli ja kajo; massa on enemmän runkoja kuin latvuston massaa |
| 4d.11-12 Tapion talo, revontulet | ei koske | |
| 4d.13 kamera ei maan läpi | toteutuu | tasainen maa, korkeus 1,7 m; polku vapaa rungoista |
| 4d.14 yksittäinen puu | toteutuu | ei yksittäisiä puita |
| 4d.16 parallaksi | toteutuu | viisto ajautuminen |
| 4d.17 mikään ei väri spektrin tahdissa | toteutuu | signaalit 0,4-4 s keskiarvoja; väre 7 Hz on vain tremolon vastine |
| 4d.18 ei teräviä vuoria | toteutuu | kummut sileitä |
| 4d.19-22 | toteutuu / ei koske | |

## 4. Kuunteluoppaan rivit
| Rivi | Tila |
|---|---|
| 11:31 raskaat askeleet | osin: renkaat vain `d.alut`:n kohdista (8 kpl, ei 18) |
| 11:42 tremolo | osin: väre on pieni, vain liikesarjalla nähtävä |
| 11:51 jännitejakso | osin: tuuli, kajo ja vauhti seuraavat; hermoa on vähän |
| 11:58/12:09 lasku ja nousu | en erota |
| 12:14 O | näkyy: pilkkuja 735 s |
| 12:36 vaskivuorottelu | näkyy: kaksi valoa 765 s (trumpetit tulkittu käyrätorvien vastakohdaksi) |
| 13:00 harva kuviointi | näkyy: 795, 805 s pilkut pimeässä |
| 13:05 pohja katoaa | osin: maa sulaa (795 s), pieni ero |
| 13:26 P | näkyy: 806,6-809 s |
| 13:45 vasket häipyvät, 14:05 | näkyy: 828-845,6 s |

## 5. Rajakuvat
- Alku: 691,6 s on tasainen PIMEYS (`rajakuva(p,3)` sekoitettu painolla 1 hetkellä t0, mitattu stillistä: koko ruutu yhtenäinen). Jatkuva avautuminen 692,6-695,6 s: kummun aukko kasvaa kuvan täyttäväksi.
- Loppu: 845,6 s sekoitus `rajakuva(p,0,t)` painolla 1 (t on tiedoston aika, jolla rajakuva on tässä kutsuttu). Edellä 828-840 s yhdeksäs kumpu kasvaa.
- Huom: stillit 845,2 ja 845,6 s ovat lähes tasaisen tummat. Pikseliyhtäpitävyyttä ei ole mitattu erikseen.

## 6. Omat lisäykset
- Ovet kumpuina ja kaarevana aukkona: perustelu "vuorehen teräksisehen" (K49) ja siemenen sileät kummut.
- Maan rengas askeleille: brief "valo joka välähtää pohjasta".
- Vuorottelun trumpetti = käyrätorvien vastakohta: kanavakortti ei erota trumpettia.

## 7. Mikä jäi heikoksi
- P-iskussa kauimmaiset rungot valaistuvat vaaleina juovina ja maa on lähes valkoinen usvaa; siluettivaikutelma ei toteudu täysin, horisontin raja on kova.
- Latvusto näkyy huonosti: yläosa on tumma kaista; "siivilöityvä valo oksien välistä" toteutuu vain heikosti.
- Kapea vertikaalinen valopylväs on ruudussa muutaman sekunnin ja on viivamainen.
- Yli 20 sekuntia saman näköistä metsää on kohdissa 712-730 s ja 745-780 s (ovet ja pilkut elävöittävät, mutta ilme on yhtenäinen).
- Loppuosassa (838-845 s) kuva on lähes tasainen tumma.
- Tuulen huojunnan liikesarjaa ei katsottu pitkältä väliltä; pomppua ei ole todennettu 0,2 s ruuduilla muualla kuin kohdissa O ja P.

## 8. Kriitikkokierroksen korjaukset (10.11.2026)
Korjattu ja katsottu stilleistä (693,6, 705, 730, 757, 790, 806,7, 808, 832, 836, 840, 845,6 s):
- Horisontti: profiili interpoloidaan sileästi ja pienemmällä amplitudilla; kampamainen reuna oli kaukaisten runkojen päitä, joille on nyt latvusto. 832 ja 836 s: yhdeksäs kumpu on sileä, loiva muoto.
- Loppu: viimeinen kajo pysyy 0,42:ssa kunnes musiikki häipyy, yhdeksäs kumpu on isompi (korkeus 11 m, leveys 34 m) ja fogattu vähän, joten se erottuu tummana ja kasvaa 828-840 s; täyttää kuvan ennen rajakuvaa.
- Rajakuva: viimeinen ruutu on `rajakuva(p, 0, uTime)` painolla `uEnd`=1 hetkellä `hiljaisuus_2_alku`, uTime = tiedoston aika. Yhtäpitävyys on rakenteellinen (sama GLSL-funktio ja sama FS_LOPPU-putki); erillistä pikselivertailua ei tehty.
- Latvusto: jokaisella rungolla ragged kartiomainen latvus 40 % korkeudesta ylöspäin, huojuu rungon mukana. Näkyy 705, 730, 806,7 s.
- Maan kova viiva: pohjan katoaessa maa sulaa usvan väriin (ei erillistä tummaa väriä). Katsottu 790 s: viiva ei erotu.
- Valoläiskät: kaksi valon paikkaa ovat pienempiä ja pehmeämpiä (757 s), pilkut ovat vähintään 28 m päässä ja pieniä. Aikaisempia läiskiä ei ole katsottu uudestaan 12:41-12:49 liikesarjalla.
- P-isku: rungot pysyvät siluetteina ja maa on harmaa, ei valkoinen (806,7 ja 808 s); metsä on sama kuin ympärillä. Pystyvalo on yhä viivamainen.
- Ovet: tumma metsäinen massa (ei teal), ohut kaariviiva lähes poistettu, aukosta näkyy seuraava metsä (705, 730 s).
- Huojunta pienempi (amplitudi puolitettu, tuuli enintään 0,95): nuudelimaisuutta ei enää ruuduissa.
- Alun avautuminen pidennetty: ensimmäinen ovi ylitetään 4,6 s alusta.
Jäi: tremolon, nousun ja laskun vastinetta ei erota ruuduista; yli 20 s tummaa kohdassa 13:05-13:25; vauhdin tunne kohtalainen.
