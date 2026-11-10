# Tarkistus: maailmat 7 (Ikisalo) ja 8 (Väärä valo), `visual/maailma_07_08.js`

Aikaväli: `jousijakso_urkupiste_E_alku` (496,3 s) → `M_raskaat_askeleet` (691,6 s), Rattle/LSO 2022. Kaikki ajat tulevat `d.aika`sta.
Tarkistuskuvat: `runs/maailma_07_08/tark/` (viimeisin arkki `arkki.png`; stillit `stills/`). Mittaus: sivun `?mittaa=t1,t2,...` tulostaa `window.kuvaus(t)`.

## (0) Suunnitelma (kirjoitettu ennen koodia)

**Maailma yhdellä kappaleella.** Tapion talo sisältä: valtava, matalan kameran näkemä sali, jonka pylväät ovat jättiläisen metsän rungot
(säde 2–5 m, katto 90 m korkeudella). Kaikki on sinistä; usva kerroksina; hitainta koko teoksessa. Rungoista riippuu harmaata naavaa.
Valo tulee katon aukoista viistoina, kylminä keiloina. Salin päässä, kolmen ikihongan edessä, on vaakasuora valon lauta: Tapion pöytä.
Sen takana on loivien kumpujen reuna. Lattia on lumen peittämä ja kumpuileva. Maailma 8: sama sali väärässä valossa: punainen taottu
aurinko nousee kumpujen takaa, pylväät pysyvät mustina ja vain usva punertuu. M:ssä pimeys kasvaa katosta kuin jättitammi.

**Siemenen kuva.** Horisontin valo = pöydän lauta; sen alla tumma massa = rungot ja lattia; sileät kummut = lattian korkeuserot ja takana
oleva kumpureuna (siluetti auringon edessä); lumi = lattia ja valokeilassa putoavat hiutaleet. Sama kuva jättiläisen koossa.

**Kamera.** Rajakuvasta PIMEYS: kamera ajaa kahden jättirungon välistä (rungot liukuvat ruudun reunoille, ja sali avautuu 6,5 s aikana
`uOpen`: rajakuva → kohtaus). Sitten tasainen hidas ajo (0,72 m/s) salin keskikäytävää kohti pöytää, sali aukeaa pöytää kohti. Maailmassa 8
vauhti kasvaa liikkeen (`liike`-tapahtumat) hitaasta keskiarvosta ja hidastuu 5 s ennen `auringonsade`-ankkuria: **pysähdys** ankkurissa
ja seisoo M_ennakkoon asti (nimetty pysähdys). M_ennakosta kamera lähtee uudestaan kiihtyen (0 → 4,8 m/s), ja pimeys leviää kuvan yli:
loppu on rajakuva PIMEYS. Kamera ei pyöri; korkeus = lattia + 1,55 m kameran omalla kohdalla (lattian korkeus lasketaan varjostimessa).

| Kuunteluoppaan rivi | Kuvassa | Signaali |
|---|---|---|
| 8:16 jousijakso urkupisteen päällä (matalat jouset) | pylväät, tummuus ja usvan paksuus | `d.matala` (1 s) → `uMass`, `uFogK` |
| urkupiste (E, D2, H2) | pöydän valo | `urkupiste`-tapahtumat + `d.matala` → `uTable` |
| 8:28, 8:52 ylärekisteri/keskirekisteri | valokeilojen voima | `d.keski` (0,7 s) → `uKes` |
| melodian kaari | keilojen hidas sivuttaissiirtymä (±5 m) | `d.melodia` (2,5 s) → `uMel` |
| 8:38 patarumpu_ppp (matala d värisee 8 s) | pöydän valo lattialla värähtää hiljaa | ikkuna `patarumpu_ppp`+8 s, 4,3 Hz, amplitudi 0,30 → `uTrem` |
| 9:00 hitaat_soinnut | usvakerrokset vaihtuvat: pitkän sävelen korkeus = usvakerroksen korkeus, tiheys ja kirkkaus | pitkät nuotit (≥1,4 s) → `uBand[6]` |
| 9:25 pohja katoaa, 9:33 nousu | pöydän valo laskee/nousee matalan tason mukana | `d.matala` |
| 9:40 h_palaa (14 sykettä) | syke kulkee valona pöydän lautaa pitkin vasemmalta oikealle | `d.alut` ikkunassa → `uPulse` |
| 9:57 hiljainen jakso alkaa | pöytä sammuu (2,7 s), usva sakenee ja peittää kaukaiset pylväät; kamera jatkaa | `hilj(t)` → `uTable`, `uVeil` |
| 10:13 hiljainen jakso päättyy (vasket nousevat) | pöydän valo nousee takaa, usva ohenee | `d.matala` ankkurista |
| 10:21 vaski_tutti_620 | pystysuora valo repeää pylväiden läpi; usvan välähdys ja jälkihohto | nimetty isku `iskuK` → `uRodA`, `uCut` |
| 10:41 c_duuri_valahdykset (3 välähdystä) | punainen aurinko nousee kumpujen takaa kolmesti | C-duurin sointuväriosuus (do-mi-sol) `cdur` |
| 11:20 auringonsade | aurinko jää; kehä; kamera seisoo | ankkuri; nousu ei enää laske |
| 11:25 M_ennakko | vaskien pystyvalo auringon kohdalla; pimeys alkaa kasvaa | nimetty isku → `uRodB`, `uDark` |
| 11:31 M_raskaat_askeleet | ruutu = rajakuva PIMEYS | `uDark` |

## (a) Taulukot


### (a) Tyyliohjeen luku 12 (säännöt 0-21)

Perusteena stillit `tark/stills/` ja arkit. "Koodissa" = on toteutettu ja mitattu `kuvaus(t)`:llä, mutta ei todennettu liikesarjasta.

| # | Sääntö | Tila | Mistä näkee |
|---|---|---|---|
| 0 | ääni ohjaa (korkeus = korkeus, voima = valo) | osin | usvakerrokset: pitkän sävelen korkeus = kerroksen korkeus (`kerrokset` mitattu t=581-595); voima = keilat ja pöydän valo (`keski`, `poyta`) |
| 1 | kamera hitaasti sisään ja eteen | toteutuu | `camZ` kasvaa: 0 -> 153,2 m (t=680) -> 174,6 m (t=691,6) |
| 2 | pysähdys vain nimetyissä kohdissa | toteutuu | `vauhti` 0 välillä auringonsade -> M_ennakko (t=680 ja 685,0); muualla > 0,5 m/s |
| 3 | ei pyörimistä, 20 °/s | toteutuu | kamera vain siirtyy +z-suuntaan; sivuttaissiirtymä enintään 3,4 m (34 m:n aallolla) |
| 4 | kamera ei reagoi iskuun | toteutuu | vauhti ei muutu t=621,6; M:ssä lähtö on 4 s:n ramppi (vauhti 0,06 t=685,4) |
| 5 | siirtymä kulku, vähintään 4 s, mittakaava jatkuva | toteutuu | alku: kahden rungon (r=8 m) välistä, `auki` 0 -> 1 kuudessa ja puolessa sekunnissa (stillit t496.3, t500.0); loppu: 6,5 s (stillit t683, t689, t691.6) |
| 6 | vähintään kolme syvyyskerrosta | toteutuu | lähirungot, keskipylväät, sumuinen sali ja pöytä (t504, t540) |
| 7 | puhuja lähemmäs | ei koske | |
| 8 | kerros etäisyys ja valo, ei pahvi | osin | pylväät ovat sylintereitä usvassa, mutta pinta on litteä (ks. heikkoudet) |
| 9 | metsä näkyy, ei runkorivi | osin | pylväät satunnaisilla syvyyksillä ja leveyksillä; keskikäytävä tyhjä, joten voi lukea kahtena seinänä |
| 10-11 | iskun elementti ympäristössä, ei ilmesty iskussa | toteutuu | t=621,5 ei valoa, t=621,63 pystyvalo; sali on jo kuvassa |
| 12 | enintään kolme liikkuvaa | toteutuu | liikkeessä vain tuuli (naava, huojunta), usvakerrokset ja hiutaleet |
| 13 | väike/kajo kaukana | ei koske | |
| 14 | valolla lähde | toteutuu | katon aukot, pöydän lauta, aurinko, pystyvalo |
| 15-16 | punainen vain taotussa auringossa, vain C-duuri | toteutuu | `PUNA` vain auringossa ja sen usvassa; still t640 (ei punaista), t641.5, t680.5 (punainen); nousu vain `cdur`-mittauksesta ja pidosta auringonsade-ankkurista |
| 17 | värit eivät vaihdu iskussa | toteutuu | iskun väri valkoinen |
| 18 | hiljaisuus: elementit lakkaavat, metsä jää | toteutuu | still t600: pöytä pois, usva peittää (`usvaVeil` 0,85), pylväät, lattia, lumi jäävät, kamera jatkaa |
| 19-21 | ei edellisen projektin tyyliä, kliseitä, tekoälykuvia, hahmoja | toteutuu | kaikki koodilla, ei hahmoja |

### Luvun 4d kohdat 1-19

| # | Kohta | Tila | Perustelu |
|---|---|---|---|
| 1 | puut kuin puut: huojuvat tuulessa, eivät pompi | koodissa, liikettä ei katsottu sarjana | pylvään akseli taipuu korkeuden neliössä (`uWind`, enintään 0,9 m latvassa, jakso ~18 s), naava heiluu tuulen mukana; tuuli = `d.koko` (1,2 s) + puuska vaskin iskuista t=621,6 ja 685,1 (`tuuli` 0,68-1,30). Ei kasvua, ei paikan vaihtoa, maa ei pompi. |
| 2 | laaja ja syvä | osin | ks. 12/9 |
| 3 | kamera eteenpäin | toteutuu | paitsi nimetty pysähdys 680-685,1 |
| 4 | maailmoja sisäkkäin | toteutuu | alku kahden rungon välistä, loppu pimeyteen |
| 5 | gis horisontti | ei koske | horisontti on pöytä ja sileä kumpureuna |
| 6 | kalevalainen | toteutuu | Tapion pöytä, naava, taottu aurinko |
| 7 | hämäryys taidehistoriasta | osin | usva, kapea valokiila (Davis), Friedrichin mittakaava |
| 8, 12 | loppu hyväksyvä; revontulet | ei koske / ei revontulia | |
| 9 | massa, ei puita | osin | pylväät massana; yksittäiset: vain pöydän kolme runkoa |
| 10 | jousten intensiteetti näkyy | toteutuu | `massa` -> tummuus ja usvan paksuus; `keski` -> keilat |
| 11, 14, 19 | Tapion talo ilman kasvoja; harkitut puut; ei etualan puuta | toteutuu | |
| 13 | kamera ei aja maan läpi | toteutuu | kameran korkeus = lattia + 1,55 m kameran omalla kohdalla; pylväät vähintään ~4 m kameran reitistä |
| 16 | parallaksi | toteutuu | viisto sivuttaisliike |
| 17 | horisontti seuraa melodian kaarta | osin | valokeilojen siirtymä `melodia` (2,5 s) |
| 18 | ei teräviä vuoria | toteutuu | sileä kumpureuna |
| 20-22 | valo ja varjo; uskottava; siemen | osin | katon aukkojen keilat; siemen = pöydän valo horisonttina, tumma massa, kummut, lumi |

### (b) Kuunteluoppaan rivit

| Rivi | Näkyy? | Huomio |
|---|---|---|
| 8:16 jousijakso urkupisteen päällä | näkyy | sali avautuu, tummat pylväät |
| 8:22 päättyy | osin | `matala` laskee, ei erillistä korostusta |
| 8:38 maan värinä | osin | 4,3 Hz värinä lattian valossa, hento; ei katsottu erikseen |
| 9:00 hitaat soinnut | näkyy mittauksena | `kerrokset` vaihtelevat; vaikutus kuvassa hento |
| 9:25-9:33 pohja katoaa / nousu | osin | pöydän valo seuraa matalaa tasoa |
| 9:40 H, 14 sykettä | osin | pieni kirkas piste laudalla (stillit t583-584,5), heikko |
| 9:57 hiljainen jakso | näkyy | still t600 |
| 10:13 hiljainen jakso päättyy | osin | pöytä palaa, usva ohenee |
| 10:21 tutti-isku | näkyy | pystyvalo ruudussa 621,63; jälkihohto 3 s |
| 10:32 Allegro | osin | kameran vauhti 1,0-1,3 m/s liikkeen hitaasta keskiarvosta |
| 10:41 C-duuri kolmesti | osin | aurinko nousee sointuväristä (osuus 0,73 / 0,54 / 0,61 t~642 / 655 / 677); ensimmäinen selvä, kaksi muuta heikkoja |
| 11:20 auringonsade | näkyy | aurinko, kehä, kamera seisoo (t680.5, t683) |
| 11:25 M | näkyy | pystyvalo auringon kohdalla t=685,2; pimeys alkaa |
| 11:31 raskaat askeleet | ei koske | rajakuva |

### (c) Rajakuvat

- Alku t=496,3: koko ruutu on PIMEYS. Mitattu still: RGB-keskiarvo (13,66; 15,79; 18,13), hajonta 0,4 (vain dither).
- Loppu t=691,6: täsmälleen sama keskiarvo (13,66; 15,79; 18,13), hajonta 0,47. Täsmäävät.
- Avautuminen kuudessa ja puolessa sekunnissa; loppuun ajo 6,5 s.

### (d) Omat lisäykset

- Katon aukot ja viistot kylmät keilat: referenssi 4 ja käyttäjän "siivilöityy oksien välistä".
- Naava ja pylväiden raskas huojunta: Tapion "naavaturkki" (tutkimus luku 8); huojunta ohjaajan korjauksen 10.11. mukaan.
- Avoin tila pöydän ympärillä (pöytä näkyy kokonaan): luettavuus.
- Lumihiutaleet valokeilassa: käyttäjä piti lumisateesta.
- Kumpureuna auringon edessä: siemenen sileät kummut ja nousun peittäminen.
- Sauva: yksi ohut pystyvalo kahdessa nimetyssä iskussa.

### (e) Mikä jäi heikoksi

1. **Pöydän kolme ikihonkaa eivät lue kaukaa**: 250 m:n päässä ne sulavat usvaan ja lauta on pieni palkki; rungot erottuvat vasta lopussa. Pöytä ei ole se kuvan keskus, jonka tarkoitin.
2. **Pylväiden pinta on litteä**: kaarevuus ja kuori lukevat heikosti, lähirungot ovat lähes tasaisia paneeleja. Metsä lukee seinämäisenä salina.
3. **Maailma 8: punainen usva on laatikkomaista**: aurinko ja kehä lukevat, mutta punertava alue rajautuu kovareunaiseen suorakulmioon kumpureunan kohdalla (t641.5, t683). Näyttää halvalta.
4. **Auringon nousu on napsahtava**: ensimmäinen nousu tapahtuu puolessa sekunnissa (t641,0 -> 641,5); kaksi muuta välähdystä ovat heikkoja.
5. **H-sykkeet pöydällä** ovat pieni piste, eivät lue hyvin.
6. **Tuulen liikettä ei tarkistettu sarjana** (aika loppui): huojunta ja naava ovat koodissa ja mitattu signaalina (`tuuli`), mutta 0,2 s:n liikesarjoja ei katsottu. Pomppimista ei pitäisi olla, koska liike on hidas siniliike.
7. **Liikesarjoja ei ajettu**; todennus harvoilla stilleillä (t583-584,5, t621,5-622,2, t685-686).
8. Pimeyden kasvu lopussa on pehmeä pilvimäinen massa, ei oksainen jättitammi.
9. Tutti-iskun hetkellä lähirunkojen naava välähtää kohinaisena (~0,3 s).
10. Hiljaisen jakson aikana (16 s) kuva on sakea ja tasainen; liikettä vain kamerassa, naavassa ja hiutaleissa.
11. Kuvan yleisvalo on paikoin harmaan usvainen (esim. t660, t676) eikä "sininen ja tumma" kuten alussa; maailma 8:n alku on tummempi.
12. Renderiaika: still ~25-60 s aa=1 (jaettu GPU); koko 195 s ei ole ajettu ketjuna, eikä aa=2 ole kokeiltu.
