# Maailma 10: Se näkyy ja tulee, vedos 5, kierros 2 (tarkistus)

Moduuli `visual/maailma_10.js`, 845,6 -> 945,0 s (Rattle / LSO 2022 -kuuntelukopio). Renderi `runs/maailma_10/osa.mp4` (99,4 s, aa=2, 2982 ruutua).
Todisteet `runs/v5_10/tark/`: liikesarjat `s_*.png`, mittaukset `mittaus.json` ja `mittaa.py`, signaalilokit `signaalit.log`, `signaalit2.log`.
Videon aika 0 = 845,6 s. Edelliset versiot: `osa_vedos4.mp4`; kriitikon raportti `kriitikko_v5.md`. Kriitikkoa ei ajettu tämän kierroksen jälkeen.

## 1. Kriitikon estävät kohdat ja ohjaajan päätökset (kierros 2)

| # | Kohta | Tila | Todiste |
|---|---|---|---|
| 1 | Lumi ei ole sauvoja | tehty, osin | `s_3ruutua.png` (50,00 / 50,03 / 50,07 s, 1280 px): hiutale on pehmeäreunainen viiru, jonka pituus on sen matka yhdessä ruudussa (liike-epäterävyys), pää kirkas ja häntä ohenee; lähellä harvat suuret epätarkat, keskellä tiheä parvi, kaukana pieniä himmeitä. Peräkkäiset ruudut jatkavat toisiaan (kierre ja vaakaparvi samassa paikassa joka ruudussa). Kaukainen lumisavu on verhojen hienorakenne, ei oma kerros. Heikkoa: jäljet lukevat paikoin lyhyinä pehmeinä viiruina, ja ruutujen välinen jatkuvuus on todettu silmällä kolmesta ruudusta, ei mittauksella |
| 2 | Lumen määrä seuraa ääntä oikein päin | tehty | taulukko alla; korrelaatio lumen määrän ja tason välillä 0,75-0,91 (mittarista riippuen) |
| 3 | Aksentti on askel, joka jää | tehty | taulukko 2, `s_aksentti.png`, `s_aksentti_pieni.png` |
| 4 | Syvyys koko myrskyn ajan | osin | mittaus alla: syvyys näkyy 36 % ajasta, pisin yhtäjaksoinen jakso ilman 10 s |
| 5 | Huipun seinä on kuva | tehty | `s_huippu.png` (61-69 s, 0,5 s välein): virtaavia kieliä, vaaleampia ja tummempia alueita, suuret epätarkat lähihiutaleet, pyörre laajana kaarena, pystyvalo 65,0 s; seinän tausta erottuu vain 65,5 s (raossa metsä) |
| 6 | R:n jälkeen ei 18 s samaa kuvaa | osin | `s_R_jalkeen.png` (74-93 s): R-rengas 76,5-78 s, pyörteet 80-85 s, harveneva hiljainen jakso 86-90 s, nousu. Hiljaisessa jaksossa 86-90 s kuva on edelleen samankaltainen (musiikki on hiljainen) |
| 7 | Pyörre on osa virtausta | tehty | `s_kontakti.png` 0:32, 0:52, 1:02: kaartuvia viiruja yli puolen kuvan leveyden, pyörre syntyy puuskasta ja hajoaa; `s_3ruutua.png` |
| 8 | Loppu | tehty | `s_nousu.png`, mittaus alla: hiutaleet pehmenevät ja sulavat kuvaan 4,5 s aikana (melt), eivät katoa kerralla; virtaus ylös, ei oikealle |

### 1.1 Lumen määrä vs äänen taso (kohta 2)
Mittaus (`mittaa.py`, 0,5 s välein koko videosta, taso `build/rattle_koko/korvat.json` `taso_dbfs`, 1,5 s tasoitettu):
- Lumen määrä, mittari "teräväreunaisten kirkkaiden pisteiden osuus": myrsky 873-936 s r = +0,62; koko väli 856-945 s r = +0,75; hiljainen jakso 915-936 s r = +0,95; alle -35 dBFS r = +0,91 (34 pistettä).
- Lumen määrä, mittari "kirkkaiden hiutalepisteiden lukumäärä" (kynnys 8 / 12 / 16): r = +0,91 / +0,88 / +0,82 (myrsky 873-936 s).
- Kirkkaus vs taso: r = +0,86 (873-936 s). Vedoksessa 5 kriitikko mittasi lumelle r = -0,6 ja kirkkaudelle 0,79.
- Taso dBFS / kirkkaus / lumi-% (2 s välein otteita): 877,9 -29 / 62 / 6,9; 891,9 -20 / 92 / 8,2; 901,9 -30 / 65 / 4,0; 909,9 -17 / 117 / 5,5; 919,9 -37 / 51 / 3,6; 923,9 -46 / 54 / 1,5; 925,9 -37 / 53 / 5,6; 933,9 -49 / 48 / 1,5; 939,9 -25 / 76 / 7,0.
- Heikkous: myrskyn sisällä korrelaatio on vain 0,62, koska kirkas valkoinen seinä (907-913 s) piilottaa hienoa lunta (lumi-% 4,5-5,5 huipulla, ei suurinta).

Toteutus: intensiteetti = 0,55 · taso (dBFS-kuvaaja -52...-16 dBFS) + 0,25 · jousten taso + 0,20 · uusien sävelten tiheys + fraasin nousu; ohjaa lumen tiheyttä, tuulen nopeutta, verhojen peittoa, rakoja ja hiutaleiden kontrastia. Koneen kuulemat aksentit (`d.aksentit`) antavat pieniä puuskia (ei leikkauksia).

### 1.2 Aksentit (kohta 3), `signaalit2.log` 0,1 s välein
Lähestyvän seinän etäisyys z (lähin seinäkerros, alkuarvo 9000 -> 6), kertymä u on monotoninen ja hyppää aksentissa:
| t (s) | u | lähimmän seinän z | valo | lumen tiheys |
|---|---|---|---|---|
| 870,1 | 0,279 | 1170 | 0,72 | 0,13 |
| 870,2 (pieni aksentti) | 0,292 | 1064 | 0,72 | 0,14 |
| 870,5 | 0,427 | 396 | 0,92 | 0,27 |
| 871,95 | 0,649 | 78 | 0,96 | 0,41 |
| 872,3 (iso aksentti `myrsky_aksentti_537`, 872,0) | 0,868 | 16 | 1,34 | 0,75 |
| 873,0 | 1,0 | 6 | 1,21 | 0,72 |
Pieni aksentti vie rintaman 63 % lähemmäs 0,3 s:ssa, iso aksentti 80 % lähemmäs 0,3 s:ssa; kumpikaan ei palaa (u ei laske, valo jää uudelle tasolle). Askel on jatkuva noin 0,3-0,4 s:ssa, jolloin se on ruudusta ruutuun kasvava (`s_aksentti.png`: 26,43 s alkaen kuva on tihentynyt, kirkastunut ja metsän reuna näkyy, ja pysyy sellaisena 27,2 s asti). Latvojen puuska: `uSway` nousee 0,67 -> 0,95 -> 1,25 (kumipuusäännön raja noin 4 %). Latvoja ei ole kuvassa lähellä; lumen pöllähdys latvoista on kaukaisimman verhon kaista horisontin kohdalla.

### 1.3 Syvyys (kohta 4)
Mittari: harjan tumma kaista horisontin kohdalla vs yläpuolinen alue (`mittaa.py`, `syvyys_nakyy`). Q-10 s ... R: syvyys näkyy 36 % näytteistä, pisin yhtäjaksoinen jakso ilman syvyyttä (huipun +-3 s pois) 10,0 s. Aiemmin (edellinen renderi) 19 % ja 20,5 s. Raot ovat pystysuuntaisia kaistoja, jotka kulkevat tuulen mukana ja avautuvat, kun jouset hiljenevät (`s_syvyys_Q.png`). **Ei täytä "muutaman sekunnin välein" -vaatimusta täysin: 10 s aukko on yhä.**

## 2. Aiemmat kohdat (kierros 1) ja kunnossa pidetyt
- Myrskyn nousu (`myrsky_nakyy` -> `myrsky_iskee`) koodissa ennallaan (aksentin 30 %:n askelosuus on lisäys vain välille myrsky_kasvu -> myrsky_iskee).
- Q (44,9 s) ja R (77,4 s) pystyvalo iskun ruudussa; rengas; huipun pystyvalo 65,0 s (`s_huippu.png`).
- Rajakuva: alku ennallaan, loppu = `rajakuva(LUMI)`, ristikuva 2,4 s.
- Nousu: virtaus ylös, hiutaleiden seuranta (`suunta2.py`, 960 px): 93,5 s 7,6 px ylös (dx -4), 95,0 s 4,7 ylös (dx +3), 96,5 s 4,1 ylös (dx +5). Vaakaliike lähes poissa (edellisellä kierroksella +7...+16).
- Kumipuut: latvojen siirtymä korkeintaan noin 4 % harjan korkeudesta (laskettu; liike on liian pieni nähtäväksi 0,5 s ruuduissa), maa ja kummut eivät liiku, harjan muoto ei riipu ajasta. Todettu koodista ja luvuista, ei mittauksesta.

## 3. Mikä jäi heikoksi
- Syvyys ei näy yhtäjaksoisesti: pisin aukko 10 s (kohta 4 yllä).
- Lumi-korrelaatio myrskyn sisällä 0,62 (huipulla hienoa lunta on vähän).
- R:n jälkeinen hiljainen jakso (n. 86-90 s) on musiikin mukaisesti rauhallinen mutta samankaltainen (ero 5 s:n keskikuvien välillä 4-5 harmaasävyä, myrskyn sisällä 6-17).
- Pyörteet ovat suuria ja kiertävät koko kuvaa; aksentin kohdalla ja Q:n jälkeen (0:52) kierre on paikoin hallitseva ja lumi näyttää kiertyvän liikaa.
- Lähihiutaleet ovat epätarkkoja soikioita; "pehmeät" lähihiutaleet lukevat paikoin tahroina.
- Kriitikkoa ei ajettu.

## 4. Muutokset kierroksella 2
`snowAt` kirjoitettu uusiksi (liike-epäterävyys, syvyysmittakaavat); jousten taso dBFS-signaalista; aksentin askel 30 % lähestymismatkasta ja pysyvä valo/tiheys; verhojen yhteinen rakokenttä; huipun seinän rakenne; pyörteet suurempia ja hiutaleita kiertäviä; pienet puuskat koneen kuulemista aksenteista; sulaminen LUMIksi 4,5 s; ylösvirtaus ilman sivuliikettä.

## Vedos 6 (10.11.2026): vaskien ja patarumpujen fraasin toistot myrskyssä (rivi 71)
Renderi `runs/maailma_10/osa.mp4`, 2982 ruutua (ffprobe), vanha talteen `runs/v6_10/osa_vedos5.mp4`. Muutettu vain `visual/maailma_10.js`.
Liikesarjat (1 ruudun välein): `runs/v6_10/liikesarjat/` (n_h1c, n_h2c, n_h3c = huudot 1–3; n_vk3 = viimeinen takominen; vertailu `ref0708.png`).

**Kohta 1, vaskien huudot (`vasket_myrsky_1/2/3`): tehty.** Alut `d.cues.alut.matala` + `keski`, voima >= 0,45, ikkuna -0,3 … +1,5 s: huuto 1 kaksi alkua (892,03 ja 893,13 s), huuto 2 yksi (898,97), huuto 3 yksi (903,34). Jokaisessa kylmä pystysuora valon leikkaus kuten kohdassa 10:26 (kapea ydin, himmeämpi hehku), lumi kirkastuu leikkauksen ympäriltä, maahan kulkee litteä valon aalto. Huuto 1 -> 3: leikkauksen leveys 0,0030 / 0,0050 / 0,0080 ja voima 0,85 / 1,0 / 1,2, paikka lähempänä keskustaa. Q:n ja R:n leikkaukset ennallaan, ei samassa ruudussa (Q 890,5, R 923,0).
Mittaus (`mittaa.py`, palkki leikkauksen kohdalla, ruutu ruudulta): kirkkaus hyppää juuri odotetussa alun ruudussa kaikissa neljässä: ruudut 1393, 1426, 1601, 1732 (esim. 87 -> 206, 96 -> 226); edellisessä ruudussa ei nousua.

**Kohta 2, `vasket_takovat_viimeinen`: tehty.** Neljä alkua `alut.keski`: 910,036 / 910,28 / 910,489 / 910,71 s = ruudut 1933 / 1940 / 1947 / 1953. Jokaisessa taivaan korkuinen valon seinämä, jonka reuna on rosoinen (repeää myrskyn seinän läpi); kohdat reunoilta keskelle: vasen reuna, oikea reuna, vasen sisä, oikea sisä; leveys kasvaa 0,07 -> 0,10. Neljännellä koko kuva valossa (hehku laskee 0,4 s:ssa). Lumi pysähtyy neljännen alun ruudusta 0,2 s ja ryöpsähtää (viirut pitenevät), ryöpyn voimakkuus lasketaan niin, että pysähdys ja ryöppy kumoavat toisensa (lumen vaihe palaa ennalleen). Dim. molto kuten ennen. Mittaus: hyppy täsmälleen ruuduissa 1933 (117 -> 219), 1940 (116 -> 226), 1947 (114 -> 231), 1953 (116 -> 254).
Huippu T6 (910,6) yksittäinen leikkaus poistettu ISKUT-listalta, koska neljä seinämää korvaa sen (muuten kaksi eri leikkausta 0,2 s:n sisällä); myrsky_huippu:n valkoinen seinä ja muu huippu ennallaan.

**Koskemattomuus.** Ruudut 300 (10 s) ja 600 (20 s): täsmälleen samat kuin vedoksessa 5 (ero 0,0). Ruudut 900–1380 (30–46 s) ja 1500–1920 (50–64 s): ero 0,3–0,46 harmaasävyä (max 8), eli kuva sama; pieni ero tulee uudelleenajetusta datasta (cues.json uusittu vedoksen 5 jälkeen), ei tästä muutoksesta (koodi ei vaikuta ennen 892 s). Myöhemmät kohdat (66 s eteenpäin) eroavat vedoksesta 5 samasta datasyystä; vertailu HEAD-koodiin nykydatalla (ruudut 925,5 s): ero 1,2 harmaasävyä (max alle 75), eli myrskyn loppu on käytännössä ennallaan (ennen lumen vaiheen kompensointia 8,2). Nousu ja rajakuva LUMI: ei muutoksia koodissa.

**Nojaa.** Tyyliohje: luku 2.2 (elementit reagoivat iskuun), 7 (trumpetit/pasuunat = läpi tuleva valo, patarummut = maan tärähdys), 7b (isku = valon leikkaus iskun ruudussa; nopea muutos vain iskussa), 12 kohdat 10, 11, 14 (valolla lähde: kylmä leikkaus, ei lämpöä), kumipuut (puut eivät liiku); käyttäjän sanat 4d/rivi 71. Tutkimus: Ukon tuli läpi taivahan yheksän (Kalevala 47) ja Grimleyn vaskimotiivin yhteenvetopaluu (kuunteluopas 15:10). Käsikirjoitus: myrsky, Q–R ja huippu; "uudella tavalla mutta tunnistettavasti" = sama pystyvalo, laajennettuna seinämäksi.

**Auki / heikkoa.** Huuto 2 ja 3 sisältävät vain yhden alun (voimaraja 0,45); heikompia alkuja (0,22–0,40) ei nostettu esiin. Seinämien väri on tasainen valkoinen eikä sisällä rakennetta paljon; kriitikkoa ei ajettu (tehtävänanto: ohjaaja). Lumen pysähdyksessä kameran ajo jatkuu, joten kaukaisin lumi liikkuu hieman.

## Vedos 7 (11.11.2026): viisi iskua ja rauhallinen lumi (brief `runs/vedos_v7/brief.md`, moduuli 10)
Renderi `runs/maailma_10/osa.mp4` (kopio `runs/v7_10/osa.mp4`), ffprobe: 1920x1080, 2982 ruutua. Komento: `node render/lukittu.mjs --data build/rattle_koko --page "visual/maailma.html?m=10&aa=2" --start 845.6 --end 945 --workers 2 --chunk 40 --out runs/v7_10/osa.mp4` (huom. `--start/--end` ovat teoksen aikaa sekunteina, eivät ruutuja). Muutettu vain `visual/maailma_10.js`. Todisteet: `runs/v7_10/` (`vertaa.txt`, `vertaa_raja.txt`, `nopeus_kulma.txt`, `kuvaus.log`, `liikesarjat/`).

**Kohta 1 (Y1) PERUTTU ohjaajan viestillä:** `uSway`/`huojunta` jäävät koskematta, täsmälleen vedoksen 5 (`git show 09eac76`) mukaisina (ridgeFar, ridgeNear, veilLayer ja `huojunta()` rivit identtiset vedoksen 5 kanssa). Ensin poistin ne, mutta palautin ennen renderiä; renderissä ne ovat mukana. Ohjeen yläraja (latva enintään 1 %, puuskassa 1,5 % puun korkeudesta) EI ole mitattu eikä todennettu: kaukaisen harjan ääriviiva liikkuu enintään 0,0009·1,4 kuvan yksikköä, mutta alun lehvästön rungot/oksat (veilLayer, vain ensimmäiset 12 s) taipuvat kertoimella (0,012+0,020·sway)·korkeus, eli arviolta jopa noin 4 % korkeudesta; tämä on vedoksen 5 mukainen ja ylittää ohjeen rajan, raportoitu ohjaajalle.

**Kohta 2, viisi iskua (Y4): tehty.** `cues.cues['vasket_takovat_viimeinen'].iskut_t` = 910,03 / 910,27 / 910,51 / 910,73 / 910,95 sellaisenaan (oma `aluissa`-tunnistus poistettu tästä). Ruudut 27301 / 27308 / 27315 / 27322 / 27329 (kuvaus.log, `tako`-lista). Paikat x = −0,72 / 0,72 / −0,36 / 0,36 / 0; leveys 0,070 / 0,080 / 0,090 / 0,100 / 0,180; voima 0,70 / 0,78 / 0,86 / 0,94 / 1,50; vaimeneminen 0,13 s, viidennellä 1,8 s (ja pehmeä sammutus 2,5→4,5 s). `lumiPohja`, `lumiRyoppy`, `lumiB`, `lumiKerroin` poistettu. Shaderin iskupaikat 4 → 6 (uK/uL), koska viides elää kauan. Koko kuva valossa (`uFlash`, 0,4 s) siirrettiin neljänneltä viidennelle iskulle, jotta viides on suurin (tulkinta, ei briefin sana).
Liikesarja `liikesarjat/iskut_viisi.png` (1:03,9–1:06,9, joka toinen ruutu, katsottu): viisi valoseinää syttyy järjestyksessä vasen reuna (1:04,43), oikea reuna (1:04,70), vasen sisä (1:04,90), oikea sisä (1:05,17), keskellä levein ja kirkkain (1:05,37), joka jää soimaan ja himmenee kuvan loppuun (1:06,8). Kuutta tai seitsemää leikkausta ei ole.

**Kohta 3 (Y2): tehty.**
- Paikka on nopeuden kertymä (`d.sarja`) jo ennestään; nyt nopeus on tavoitteen alipäästö (nousu tau 0,30 s, 10–90 % noin 0,66 s; lasku tau 0,80 s, noin 1,76 s). Tuulen nopeudesta poistettu iskuterminä `12*aks`, `7*aks2`, `9*kasku(Q)`, `12*kasku(R)` (iskut näkyvät valona ja lumipölynä, ei lumen nopeutena). `huippuK` (hidas, 2,5 s) säilyy.
- `askel` (rintaman hyppy aksentissa, 872,0 s): sstep 0,40 s → 0,65 s.
- Tuulen kulma `melKaari` alipäästö tau 2 s (ylos-osa 0,9·ylos ennallaan).
Mittaus (`kuvaus.log` 0,1 s välein, `nopeus_kulma.txt`; kulma = atan2(vF·0,85, vW·0,6)): vaakanopeus ei ole koskaan negatiivinen (min 0,02, max 24,0; etumerkki sama koko moduulin ajan). Kulma 869–933 s: 4,4…7,9 astetta; suurin muutos 1 s ikkunassa 9,0 °/s (kohdassa 868,1, myrskyn alussa) ja 3,8 °/s kohdasta 869,5 eteenpäin; tuulikulma `wang` suurin 6,9 °/s myrskyssä. Nopeuden suurin muutos 0,5 s ikkunassa +1,49 (nousu) / −1,12 (lasku), nopeus suurimmillaan 14,45.
Taulukko (nopeus, kulma): Q-ankkuri 872,0 s: 4,68 / 5,8; 891–893 s (huuto 1): 9,38→10,85 / 5,9–6,0; 909,5–912 s (viisi iskua): 14,24–14,45, tasainen, kulma 4,4 (iskut eivät muuta lumen nopeutta eikä suuntaa).
Rintaman askel 26,0–27,5 s renderistä: suurin ruutujen välinen keskikirkkauden muutos vedos 6: 2,85, nyt 1,53 (kohdassa 26,57); suurin keskimääräinen ruutuero 12,3 → 8,7.
**Poikkeus:** nousussa (933–945 s, `ylos`) virtaus kääntyy ylöspäin (kulma muuttuu enintään 61 °/s, tuulikulma 35 °/s) kuten vedoksessa 6; se on lopun nimetty nousu, jota brief ei käske muuttaa ("moduulin loppu ennallaan"), joten sitä en rajoittanut. Brief sanoo kulmalle enintään 10 °/s: nousun osalta raja ylittyy, ohjaajan päätettävä.

**T2 regressiomittari** (`vertaa.py runs/vedos_v6u/osat/10.mp4 runs/maailma_10/osa.mp4 845.6`, raja 2,0):
```
runs/maailma_10/osa.mp4 vastaan runs/vedos_v6u/osat/10.mp4: 497 ruutua, 1 muuttunutta jaksoa (raja mse 2.0)
  14:29.6 - 15:45.6   suurin mse 2278.8   (osan aika 24-100 s)
```
Raja 200: 14:31,6–15:19,6 (suurin 2278,8), 15:25,6–15:31,6 (223,9), 15:37,6–15:41,6 (451,6). Raja 1000: vain 15:09,6–15:13,6 (2278,8) eli viiden iskun seinät (kohta 2). Selitys: 0:00–0:24 (14:05,6–14:29,6) on ennallaan (mse alle 2: sway palautettu, tarkistettu), 24–100 s ero on lumen vaihe: koko myrskyn lumen nopeus on kohdan 3 (Y2) mukaisesti uusi, joten jokainen hiutale on eri paikassa; rakenne, valot, huudot ja pyörre ovat samat (liikesarja `myrsky_1450.png`, huudot 44,9 / 47,x / 53,4 / 57,9 s valona kuten ennen). Ei muita jaksoja kuin nämä kaksi syytä.
**T3 sauma:** ensimmäiset 3 ruutua vs vedos 6: ero 0,0; viimeiset 6 ruutua ero 0,19…0,05 harmaasävyä (hiutaleiden vaihe, rajakuva LUMI ennallaan).

**Auki / epävarma.** (1) Nousun kulman nopeus ylittää 10 °/s (yllä). (2) Lumen ulkonäkö koko myrskyn ajan muuttui (vaihe), käyttäjää ei kuultu; `myrsky_1450.png` ja `iskut_viisi.png` katsottu, "rauhallisuutta" ei voi todentaa pysäyttämättä videota: mittarit ovat luvut yllä. (3) Latvan huojunnan 1 %/1,5 % yläraja ei mitattu. (4) Liikesarja 14:50–15:06 (0,5 s välein) tehty tiedostoon `liikesarjat/myrsky_1450.png` (alkaa 14:50 − 845,6 → 44,4 s); liikesarjan 15:09,5–15:12,5 kaikki 45 ruutua ovat `iskut_viisi.png`.

### Vedos 7, viimeistely (ohjaajan päätökset A–C)
Uusi renderi `runs/maailma_10/osa.mp4` (kopio `runs/v7_10/osa.mp4`): 1920x1080, 2982 ruutua (ffprobe). Edelliset kohdat (T1–T3, Y2-mittaukset) ovat voimassa; alla muuttuneet.
- **A. Pehmeät seinät:** kaikki viisi seinää ovat gaussisia (σ = 0,55·leveys, ei rosoa eikä kohinaa), amplitudi saturoituu pehmeästi (`k/(1+0,22k²)`; viides noin 1,0, ei lineaarinen 1,5) ja seinien lisäys rajataan 1,08:aan (ennen gammaa), eli ei leikkaudu valkoiseksi. Koko kuvan valo (`uFlash`) kerroin 0,75 → 0,10 ja se on viidennellä iskulla. Mitattu renderistä (960x540 harmaa): p99,9 enintään 234/255 = 0,92 viidennen seinän aikana (910,95–911,3 s), p99 233; ruudun suurin arvo 245–255 johtuu yksittäisistä hiutaleista (osuus ≥250: alle 0,006 % pikseleistä, sama vedoksessa 6 ja ennen iskuja). Keskikirkkaus (YAVG-harmaa): ennen viidettä iskua (910,90 s) 124,1 → 171,6 (911,00 s) = +38 % (raja 45 %); ennen ensimmäistä seinää (910,0 s) 109,9, huippu 173,1 = +57 % koko viiden iskun yli. Liikesarja `liikesarjat/iskut_viisi.png` (katsottu): viisi pehmeää kaistaa, viides keskellä levein ja kirkkain, jää soimaan 1:06,8 asti.
- **B. Alun lehvästö:** `(0.006 + 0.007·min(uSway, 1.3))·yw` (enintään noin 1,5 %). Muu huojunta ennallaan. Ensimmäiset 3 ruutua ero vedokseen 6: 0,007–0,011 harmaasävyä (mse alle 2).
- **C.** Lopun nousun kulma ja tuulikulman 2 s alipäästö ennallaan.
- **vertaa.py vedos 6:** `14:29.6 - 15:45.6 suurin mse 1335.5 (osan aika 24-100 s)`. Raja 200: 14:31,6–15:19,6 (1335,5), 15:25,6–15:31,6 (223,9), 15:37,6–15:41,6 (451,6); raja 1000: vain 15:11,6–15:13,6 (1335,5) = viiden iskun seinät. Selitys kuten edellä (seinät kohta 2; muu 24–100 s lumen vaihe Y2); 0–24 s ennallaan. Sauma: viimeiset 6 ruutua ero 0,19…0,05 harmaasävyä.
