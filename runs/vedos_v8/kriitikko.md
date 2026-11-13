# Kriitikko, vedos 8 (runs/vedos_v8/koko.mp4, 1920x1080, 30 fps, 32340 ruutua)

Mitattu valmiista koko.mp4:stä, vertailu runs/vedos_v7b/koko.mp4, 720p-katselu runs/vedos_v8/tapiola_vedos8_720p.mp4. Todisteet kansiossa runs/vedos_v8/krit/ (liikesarjat `s_*.png`, vertailut `cmp_*.png`, `f_*.png`, mittaukset `mean_0_40.txt`, `vertaa_1s.txt`, `vertaa_koko_2s.txt`, `snow_vx.txt`; skriptit `mean.py`, `flow.py`, `snow.py`). Ajat ovat teoksen aikaa. Mitään ei renderöity, koodiin tai dataan ei koskettu. Tarkistus: koko.mp4:n ja osien eroalueet ovat samat (`vertaa_koko_2s.txt` vs `vertaa_1s.txt`), eli koko.mp4 on osista koottu; 11_12 md5 sama (70144cc9...).

## A. Vedoksen 8 korjaukset ja edellisen kriitikon bugit

| Kohta | Tulos | Todiste |
|---|---|---|
| Alun lataus 0:41,5-0:45,3 | KORJATTU | s_0_41_lataus.png: horisontin hohde kasvaa 0:42,5 -> 0:45, valopylväs iskun ruudussa 0:45,5 ilman uutta lähdettä. mean_0_40.txt: keskikirkkaus 65,6 -> 68,5, mutta vain +1 % v7b:hen (kertyminen on hento). |
| Purkaus ff 0:52,30 | KORJATTU | s_0_51_purkaus.png: horisontin kaista kirkastuu 0:52,43, laskee 0:53. mean_0_40.txt: 69,4 (0:52,5) -> 61,5 (0:53,0). |
| Yleistauko 0:57,25-1:01 | KORJATTU (P8 päätös) | mean_0_40.txt: 0:57,5 33,1 -> 0:59,0 40,4 (+22 %; v7b +36 %); suurin nousu 0,5 s:ssa 3,6 harmaasävyä (brief: 4). Kuva laskee 1:00 jälkeen, ei vaakarajaa, sauma 1:01,5 mse 0,0. Päätös on tyyliohjeen sääntö 18 ja 4d.10, perusteltu. |
| Tuuli ja lumi ilman edestakaista liikettä (4d.40) | OSITTAIN (mitattu vain osin) | snow.py (hiutalekohtainen vx, 30 fps): 4:00-4:10 tasoitetun suunnan vaihdot 3 (v7b 10), 7:03-7:13 0 vaihtoa, 15:00-15:06 1 (sama kuin v7b), 13:38-13:46 1. 5:38-5:48 3 vaihtoa (v7b 4): kamera kääntyy siinä, lumi on tarkoituksella muuttunut (uSnR). E1:n oikealla kolmanneksella suunta muuttuu enintään 7,2 astetta ruutujen välillä. Koko videota en mitannut. |
| Yksi puuska 4:06 | KORJATTU | s_4_04_fairy.png 4:06-4:08: yksi valoparvi nousee kerran (ylin 4:08), ei toistoja. |
| Paisutukset tuulena | OSITTAIN | 13:04-13:07 (mean/vertaa) voimakkaampi puuska ja ryöppy, s_13_01_v8.png vs _v7b.png; 13:41,5-13:43 usvaryöppy s_13_41_puuska.png (pehmeä, ei välähdystä). Muita paisutuksia (4d.38) en käynyt läpi yksitellen. |
| Jään alun lumi (5:37-5:47) | KORJATTU (heikosti mitattu) | vertaa_1s.txt 5:37,8-5:46,8 mse 7,1: lumi eri kuin v7b (tarkoitettu), kuva muuten sama; ei töksähdyksiä sarjassa. |
| Kolme valoa kirjaimessa J (7:44-8:13) | KORJATTU | Blobilaskenta 5 r/s: v8 3 valoa 7:57 -> 8:13, v7b 2 koko jakson. s_7_44_J.png. Kolmas valo ilmestyy vasta 7:57. |
| Puuskat 13:40 | KORJATTU | s_13_41_puuska.png, usvaryöppy kulkee kuvan läpi ilman hyppyä. |
| E1 14:59,0 | EI BUGI (mitattu) | Oikea kolmannes max 7,2 astetta, v7b sama (7,3). Vasen kolmannes kohisee 29 astetta 14:58,5 (ei iskun ruudussa, sama v7b:ssä): harva lumi pyörteen silmässä. Päätös perusteltu 4d.32:lla. |
| E2 15:03,3 | KORJATTU | s_15_03_v8.png vs s_15_03_v7b.png: v7b:ssä horisontti palaa terävänä ruudussa 15:03,33, v8:ssa ei. |
| E3 6:30,7 | KORJATTU | s_6_30_e3.png (0,1 s välein): valoja 2 -> 3 (6:30,8) -> 4 (6:31,1); s_6_22_maahinen.png: 8 valoa vasta 6:33 (2 s ankkurin jälkeen). Ei "viisi samassa ruudussa". |
| P1 3:01-3:04 | KORJATTU | s_3_00_p1.png: ei ohuita kaarevia viivoja; rungot menevät yhä yläreunaan (sallittu, tyyli: puut). |
| P2 3:08-3:25 | KORJATTU | s_3_18_p2.png: kiteen pinta ja kalvo hienoa huurretta, siirtymä jatkuva. |
| P3 1:02,0-1:02,8 | KORJATTU | s_1_02_p3.png: vasen runko puhdas, ei laikkua eikä keppiä. |
| P4 13:28-13:33,6 | KORJATTU | f_812.2.png vs f_812.2_v7b.png: v7b:ssä kovat portaat ja tumma laatikko, v8:ssa pehmeä. |
| P5 4:04-4:49 | KORJATTU (PIENI jäännös) | s_4_36_p5.png: ei suorakulmia, mutta terävä-reunaisia tummia kaarevia "sirpaleita" etualalla 4:36-4:40. |
| P6 5:26,5-5:28 | KORJATTU | s_5_26_p6.png: ei kovaa vaakakaistaa. |
| P7 10:36-11:14 | PERUSTELTU PÄÄTÖS | vertaa_koko_2s.txt: 8:44-13:04 ei yhtään muutosta, eli kohta on v7b:n kaltainen; lähikerroksen rungot (kuvasääntö 6), lempikohta (S6). |
| P8 | PERUSTELTU PÄÄTÖS | ks. yleistauko. |

## B. Käyttäjän kehumat kohdat (ei saa muuttua)

| Kohta | Tulos | Todiste |
|---|---|---|
| Pimeän metsän valo ja sykkeet (1:16-1:18, 1:26-1:30, 1:36-1:42, 2:24-2:26) | SÄILYNYT | Keskialueen huippu v8/v7b 154,4/154,4; 129,3/129,2; 157,9/158,0; 97,1/96,7. Kokonaiskirkkaus -0,0...+4,4 % (askelvalo ja lumi, tarkoitettu). 1:16-1:18 mse 0,3. |
| Salin lumisade 9:00 eteenpäin, salin valot 9:40, trumpetit 10:26, aurinko ja C-duuri, varjot 11:32 | SÄILYNYT | vertaa_koko_2s.txt: 8:44-13:04 ei yhtään muuttunutta jaksoa (raja mse 2,0), joten ruudulleen sama. |
| Jään askeleet 7:03-7:42 | SÄILYNYT | Jään alapuolen keskikirkkaus 10 r/s: huippu-pohja-rytmi sama kuin v7b (esim. 57 53 64 83 80 62 89 vs sama); pakkanen lisää +5...+8. Kameran nyökkäystä en mitannut erikseen. |
| 15:10 viisi iskua, loppu | SÄILYNYT | vertaa_koko_2s.txt: 15:04-end ei muutoksia; 11_12 md5 sama. |

## C. Taika kohtauksittain (huomaako ensimmäisellä katselulla, myös 720p; tyylikäs?)

| Kohtaus | Taika | Huomaako | Tyylikäs | Todiste |
|---|---|---|---|---|
| 01_02 | T1 kimallus 25,4-39,5 | HEIKOSTI: pisteet muistuttavat lumihiutaleita ja tähtiä, tuntuu vain 27,1-27,5 | kyllä, ei kasvoja | cmp_27.3.png, s_0_25_t1.png, p720_montage.png |
| 01_02 | U3 kulkeva varjo 9-25 | KYLLÄ 0:10-0:13 (tumma pehmeä juova metsämatolla), loppupuolella heikko | kyllä | s_0_09_u3.png |
| 03_04 | T3 askelten lumi | NÄKYY, mutta VIRHE: ks. B1 | EI (ruutumaisia laikkuja) | s_1_42_t3_fine.png, f_102.5.png |
| 03_04 | T2 kolme ikkunaa | heikosti (pieni valkoinen pilleri polun päässä 1:43), huomataan vain jos katsoo | kohtalainen | s_1_42_t2.png, f_104.0.png |
| 05 | Kimallusvanat keijuvaloissa | KYLLÄ 4:05-4:08 (hopeinen vana, tähtiryhmä) | kyllä, joskin ristikuvio on hieman "kimalleklisee" | s_4_04_fairy.png, p720_montage.png |
| 05 | T1 huurre 4:37, askelleikki 4:24 | EI (muutama piste, himmennys alle 10 %) | kyllä | s_4_37_t1.png, s_4_24_askel.png |
| 06 | Maahisen varjo 5:59-6:30 | HEIKOSTI (tumma alue 6:27-6:28) | kyllä, muodoton | s_6_22_maahinen.png |
| 06 | U2 pakkanen + tähdet 7:03-7:40 | KOHTALAISESTI (hopeiset pisteet horisontilla 7:03-7:16, jään huurre) | kyllä | s_7_03_pakkanen.png, snow_vx.txt |
| 07_08 | T3 lumipölyn hunta 8:19-8:24 | KYLLÄ (leveä vaalea usvapankki salin poikki) | hieman raskas, mutta pehmeä; ei ruutumainen | s_8_19_t3.png |
| 07_08 | T1 timanttipöly 8:29-8:50 | KYLLÄ (tähtipisteet hehkuineen) | kyllä | s_8_29_t1.png, p720_montage.png (511,0) |
| 09 | T2 kuusi ikkunaa, U1 metsänpeitto | KYLLÄ (pehmeät soikeat valot polun päässä 13:35-13:50, sammuvat yksi kerrallaan) | kyllä, ei silmäpareja, ei mökin ikkunaa | z_827.png, z_818.png, s_13_35_t2.png, s_13_45_u1.png |
| 10 | T1 huurre ennen myrskyä 14:17-14:20 | HEIKOSTI (ohut kimalluspolku kaukaisella reunalla ~2 s) | kyllä | s_14_17_t1.png |

Huomio: 05:n (4:24 askelleikki), 06:n (maahinen) ja 10:n (T1) taika jää alle "huomaa ensimmäisellä katselulla" -rajan (S3); 10:ssä se on kohtauksen ainoa taika.

## D. Bugilista

### ESTÄVÄT
- **B1. 1:26-2:57 (03_04), kaikki askelten T3-variseminen, selvimmin 1:42,0-1:44,5, 2:08,4-2:09,9.** Lumi ei varise lumena vaan vaaleina, pehmeäreunaisina SUORAKULMAISINA harmaina laatikoina (tasainen alareuna, pisteet laatikon sisällä ruudukkomaisessa asettelussa), jotka välkkyvät ja lipuvat ilmassa polun varrella. Rikkoo briefin S5:n ("ei ruutumaisia kuvioita") ja tyylisäännön 8 (ei pahvia/tasoa) sekä 4d.41:n ("kaunista"). Näkyy myös 720p:llä. Todiste: krit/s_1_42_t3_fine.png (12 ruutua 1:42,2-1:43,7), krit/f_102.5.png, krit/f_104.0.png, krit/s_2_08_t3.png. Korjaus: pehmeä, pyöreä tai pilvimäinen hiutalejuova ilman suoria reunoja, pisteet epäsäännöllisesti.

### PIENET
- **P-a. 1:26-2:57, ikihongan pilkka.** Rungon vaalea pystysuora soikio (f_102.5.png, f_104.0.png, s_2_08_t3.png) muistuttaa edelleen kasvoa/silmää; häipyy vasta alle 7 m:ssä. Sama oli v7b:ssä; P3:n kasvomainen laikku on korjattu mutta pilkka luetaan edelleen vaaleana laikkuna.
- **P-b. S3 (huomattavuus): 0:25-0:40 T1, 4:24-4:49 leikki ja T1, 5:59-6:30 maahinen, 14:17-14:20 T1.** Vain heikosti havaittavissa 720p:llä; kohtauksessa 10 ainoa taika on tämä. Ks. taulukko C.
- **P-c. 4:36-4:40, etualan tummat sirpaleet.** P5-korjaus poisti suorat kulmat, mutta tummat kaarevat laikut ovat terävä-reunaisia (s_4_36_p5.png).
- **P-d. 7:17-7:18 ja 8:31 (vanhoja, ei uusia).** Valkoinen vaakaviiva jään horisontin yläpuolella (g_447_v7b.png, p720_montage.png) ja valkoinen vaakaviiva salin keskellä (g_511_v7b.png) ovat v7b:ssäkin. Eivät vedoksen 8 vika, mutta luetaan "valoviivana ilman lähdettä".
- **P-e. 3:01-3:03 vasen reuna.** Hieno kolmio-/suorakulmaleikkaus kuvan vasemmassa alareunassa 3:02,4 (s_3_00_p1.png), ei briefin ikkuna; olisi sama kuin v7b.
- **P-f. 0:58-0:59,5.** Kirkastuminen +22 % tauon alussa säilyy päätöksenä (P8), mutta nousu on näkyvä; pidä "perusteltu päätös" tai pehmennä.

ESTÄVIÄ 1 kpl

## E. Mitä en ehtinyt tai pystynyt mittaamaan
- **Lumen edestakaisuus koko videosta (4d.40):** mittasin hiutalekohtaisen vx:n vain kuudesta ikkunasta (snow.py, kohinainen, kameran kääntyessä ei erota lumea maailmasta); loput silmämääräisesti sarjoista.
- **Kaikki paisutukset (4d.38):** vain 4:06-4:08, 13:04-13:07, 13:41-13:43 sarjoista; muut jäivät käymättä.
- **Kamera 20 °/s ja pyörimättömyys:** ei mitattu (v8 ei muuttanut kameraa; vertaa ei näytä sen muutoksia).
- **720p-näkyvyys:** arvioitu silmällä 8 pysäytyskuvasta (p720_montage.png), ei vastaajilla eikä puhelimella.
- **Taian kirkkausraja (S3, +10 %):** luotan rakentajien lukuihin (01_02 -2 %, 03_04 +10,2 % ruutu / +6,6 % 1 s, 05 -6,6...+0,3 %, 06 +9,6 %, 07_08 +1,1 %, 09 +0,7 %, 10 +-0,4 %); en mitannut itse.
- **Iskujen ruudut (5 iskua 10:28, 15:10):** vertaa osoittaa ne muuttumattomiksi (ei jaksoa), mutta en toistanut ruutumittausta.
- **Kuunteluoppaan jokainen lihavoitu kohta:** ei läpikäyty.

ESTÄVIÄ 1 kpl

## Uusintatarkistus (korjausten jälkeen)

Mitattu valmiista `runs/vedos_v8/koko.mp4`:stä (1080p) ja `runs/vedos_v8/tapiola_vedos8_720p.mp4`:stä; todisteet kansiossa `runs/vedos_v8/krit2/`. Mitään ei renderöity, koodiin tai dataan ei koskettu. Ajat ovat teoksen aikaa.

| Kohta | Tulos | Todiste |
|---|---|---|
| **B1** askelten lumen variseminen (1:42-1:45, 2:05-2:10, 2:16-2:19) | **KORJATTU** | Liikesarjat `krit2/s_1_42.png`, `s_1_43b.png` (1:42,0-1:44,7), `s_2_05.png`, `s_2_08.png` (2:08,0-2:09,5), `s_2_16.png`, `s_2_17.png` (2:16,0-2:18,5): ei suorakaidetta, ei suoraa vaakarajaa eikä ruudukkoa. Hiutaleet ovat epäsäännöllinen, rosoreunainen piste-ryhmä ja heikko hunnu; ryhmä alkaa ylhäältä latvojen tasolta ja laskeutuu (1:43,73 -> 1:44,40) eli varisee latvoista. 1:1-rajaukset `crop_104.0_1to1.png`, `crop_128.4_1to1.png`, `crop_137.8_1to1.png`, koko ruutu `full_102.65.png`: pisteet ovat 1-3 px, harvoja ja eri kokoisia, ei sileää taustalaatikkoa. Luonnollinen lumi: kohtalaisesti (ryhmät kimaltavat hieman pölypilvenä, ks. P-h), mutta ei virhe. |
| **P-a** ikihongan pilkka (1:44-1:47, 2:08-2:10, 2:52-2:56) | **KORJATTU** (pieni jäännös) | Pilkka on nyt kapea pystyviilto (leveys noin 25 px, pituus noin 130 px, 1080p), ei soikio; 1:44 `crop_104.0_1to1.png` ja 2:52-2:56 `s_2_52.png`: himmeä, ei lue kasvoksi eikä silmäksi (yksi, ei paria). 2:08,0-2:08,4 (`crop_128.4_1to1.png`, `s_2_08.png`) se on kirkkaimmillaan ja päistä pyöristetty, mutta silti kapea viilto, ei kasvomainen. |
| **P-b 1** 01_02 kimallusaalto 0:25-0:40 | **KORJATTU** | `m1_0_25.png` (720p, 0:25-0:41,5) ja `cmp_28.0.png` (v7b vasen, v8 oikea): kirkkaita hopeapisteitä ja hehkuja metsämatolla joka ruudussa 0:28, 0:31 ja 0:38,5, aaltona katsojaa kohti; v7b:ssä samassa kohdassa vain hento lumi. Huomaa ensimmäisellä katselulla 720p:llä. Tyylikäs: pieniä kylmiä pisteitä, ei kimalleklisettä, ei hahmoa; vähän kuin tulikärpäsiä, mutta ei ristisäteitä. |
| **P-b 2** 05 huurre pitkän e:n aikana 4:24-4:58 | **KORJATTU** (PIENI huomautus P-g) | `m2_4_24.png` (720p): selvät kirkkaat tähtipisteet hehkuineen 4:41, 4:43,8, 4:49,5 ja 4:52,3 sekä horisontin pisteistö 4:24-4:52; `n_289.5.png` (4:49,5, 1080p). Huomaa selvästi ensimmäisellä katselulla. Tyylikkyys: kohtalainen, ks. P-g. |
| **P-b 3** 06 maahisen varjo 5:59-6:30 | **KORJATTU** | Jään alueen keskikirkkaus (rivit 57-79 % korkeudesta, 1 r/s) v8 vs v7b: 6:01 -9,3; 6:13 -6,7; 6:14 -4,4; 6:23 -10,5; 6:25 -13,6; 6:27 -11,6; 6:28 -9,7 harmaasävyä (noin 10-25 %), muuten ero alle 1,2. Kuva `m3b_6_08.png` (6:12,5-6:13,5) ja `cmp_372.33.png`: muodoton pehmeä tumma juova jään yli, halkeamat painuvat sen alle; ei raajoja, ei silmiä, ei siluettia. Huomaa 720p:llä kohtalaisesti (kolme kulkua; 6:01 ja 6:13 hennompia, 6:23-6:30 selkein). Tyylikäs. |
| **P-b 4** 10 metsänreunan hopea 14:17-14:20 | **KORJATTU** | `m4_14_17.png` (720p, 14:17,0-14:19,9): hopeinen kimalluspolku kulkee kaukaisella metsänreunalla vasemmalta oikealle 14:17,5 -> 14:19,4 (noin 2 s), selkeä ja huomattava jo ensimmäisellä katselulla, rintama jatkaa sen perään; tyylikäs, ei ristisäteitä. Edellisen kriitikon "heikosti" ei enää päde. |
| **Regressiot** | **EI REGRESSIOITA** | `krit2/vertaa_koko_2s.txt` (`render/vertaa.py runs/vedos_v7b/koko.mp4 runs/vedos_v8/koko.mp4 0 2 2.0`): 19 muuttunutta jaksoa, kaikki sallituissa ikkunoissa: 0:00-1:02, 1:26-3:10 (03_04), 3:20-5:30 (05), 5:38-8:14 (06), 8:30-8:44 (07_08 ennen 9:00), 13:04-14:04 (09), 14:18-14:20 (10 T1), 15:02-15:04 (E2). **Ei yhtään muuttunutta jaksoa välillä 8:44-13:04 eikä 15:04 jälkeen** (viimeinen jakso päättyy 15:04, 15:06 -> loppu muuttumaton). Sama kuin `runs/vedos_v8/vertaa_v7b.txt` (osittain, ohjaaja); 11_12 ennallaan. |

## Bugilista (uusintatarkistus)

### ESTÄVÄT
(ei yhtään)

### PIENET
- **P-g. 4:41-4:52 (05) huurretähdet.** Kirkkaat ristisäteiset tähtipisteet halolla kelluvat taivaalla horisontin yläpuolella (ei harjanteella), ja osa on kahden vierekkäisen valon pareja samalla korkeudella (4:49,5: `n_289.5.png`, kohdat (860,300) ja (1690,500) 1080p:ssä). Briefin S5: "ei kahta valoa vierekkäin samalla korkeudella"; ristisäteet lähestyvät "kimalleklisettä". Näkyvyys on kunnossa, mutta pareja ja ristisäteitä kannattaa karsia. Ei estävä.
- **P-h. 1:42-1:45 ja 2:08 (03_04).** Varisevat lumiryhmät kimaltavat hieman pölypilvenä (pistemäisiä sävyvaloja), eivät aivan tavallisena lumena; ruutumaisuus on poistunut. Jäännös, ei virhe.
- Aiemmat PIENET P-c (4:36-4:40 tummat sirpaleet), P-d (7:17-7:18 ja 8:31 vanhat vaakaviivat), P-e (3:02 vasen reuna) ja P-f (0:58 kirkastuminen, päätös) ovat ennallaan eikä niitä tarkistettu tässä kierroksessa.

ESTÄVIÄ 0 kpl

## Kolmas tarkistus (käyttäjän rivit 148–153)

Mitattu valmiista `runs/vedos_v8/koko.mp4`:stä (tiedosto 13.11. 09:37, uudempi kuin edellinen tarkistus) ja vertailuna `runs/vedos_v7b/koko.mp4`. Mitään ei renderöity, koodiin tai dataan ei koskettu. Todisteet kansiossa `runs/vedos_v8/krit3/`. Ajat ovat teoksen aikaa. Menetelmä: hiutaleiden ja valojen pistetunnistus (DoG) ja ruutukohtainen seuranta ffmpeg-putkella (skriptit istunnon työkansiossa, tulokset `krit3/*.txt` ja `*.npy`). Hiutalevirtauksen mittaus on karkea (1280 px, kokonaispikselitarkkuus): käytetään suuntana ja suhteina, ei tarkkoina nopeuksina.

| Kohta | Tulos | Todiste |
|---|---|---|
| **(a)** Pimeä metsä 1:38-2:57: lumi vain alttoviulujen kommenteissa, tipahdus pienenee, satava lumi liikkuu sivulle, askeleet valoina, ei ikkunoita | **KORJATTU** (huomautukset P-i, P-j) | Tipahdukset: kommentti 98,81 -> ryhmä 1:39,3-1:40,3 (`krit3/d98.png`; 1:1-rajaus `drop_99.7_zoom.png`: pyöreitä, epäsäännöllisiä, kylmänharmaita pisteitä, ei laatikkoa, keskiväri RGB 57/62/68); 104,4 -> 1:45,0-1:45,8 (`d104.png`); 113,9 -> 1:54,4-1:55,8 (`d113.8.png`, kulkee oikealle alas); 121,4 -> 2:01,9-2:02,7 (`d121.3.png`); 169,49 (ppp) -> ei erotu (`d169b.png`). Tipahdus alkaa 0,4-0,6 s kommentin alusta ja kestää 1-1,5 s; koko pienenee 98,8 -> 121,4. Ei lunta muulloin: välit 1:46,4-1:52,4 (`gap106.png`) ja 2:18-2:24 (`gap138.png`) ilman ryhmiä. Kuusi kommenttia (129,5; 135,25; 145,5; 149,43; 161,85; 176,87) ei käyty ruutu ruudulta. Satava lumi: ei staattinen; sivuttaisvirtaus (radiaalivirtaus poistettu vasemman ja oikean kolmanneksen keskiarvolla, kameran vaaka-ajautuma 0) on vasemmalle -1...-2 px/ruutu (1280 px) alttoviulujen jaksoissa 1:47-1:59, 2:05-2:23, 2:43-2:51 ja lähes 0 niiden välissä: `krit3/lat_0304.txt`. Ei ikkunoita 1:26-3:05 sarjoissa `a_98.5.png`, `a_104.1.png`, `d113.8.png`. Askeleet valona lumessa: polun pään hohde pulssaa kuten v7b:ssä (`step115_v8.png` vs `step115_v7b.png`, vain tippuva lumiryhmä on uusi); lumen askelvariseminen puuttuu. |
| **(b)** Kide 3:23-5:36: paisutukset tuulena, keijuvalot eivät säpsähdä askeleista | **OSITTAIN** (**ESTÄVÄ B1**) | Hiutaleiden sivuttaisvirtaus taivaskaistalla: 3:36-3:43 -0,17 -> -0,57 (3:37) -> -0,37 -> -0,55 (3:40) -> -0,18 (3:42) px/ruutu, kun lähtötaso 3:30-3:36 on -0,15...-0,47: moduloituminen 0,3-0,4 px/ruutu, lähes taustan vaihtelun suuruinen (v7b: +0,02...+0,26, tasainen). 4:22-4:33: -0,26 (4:23) -> -0,76/-1,04 (4:24-4:25), pysyy -0,8...-1,0 eikä laske diminuendossa. 5:15-5:23: -0,44 -> -1,36 (5:17) -> -0,72 (5:19) -> -0,31 (5:23): selvä nousu ja lasku (kolminkertainen). Harjanteilta ei nouse näkyvää lumipölyä missään kolmesta ikkunasta: `b_215.png`, `b216_ridge.png` (3:36-3:42), `b_261.png` (4:21-4:27), `b_313.png`, `b316_ridge.png` (5:13-5:20); v8-vs-v7b-diff 3:39,5 (`diff_219.5.png`) näyttää vain harjanteiden reunavalon ja hiutalesijaintien eron, ei tuiskua. Käyttäjän oma esimerkkikohta 3:40 on heikoin kolmesta. Keijuvalot: sarjoissa valot syttyvät ja sammuvat omalla tahdillaan; 05:n aikavälillä ainoa mitattu iskulista on `D_pikkolo` (246,8 ja 247,4) ja shaderin `uStp` ei ole käytössä; säpsähtämättömyyttä ei mitattu numeerisesti (P-o). |
| **(c)** Jää 7:44-8:13: kaksi valoa lähestyvät huilun linjan mukaan, ei kolmatta, ei himmenemistä askeleista | **KORJATTU** | Kahden kirkkaimman pisteen seuranta (`lights_463.npy`, `c_463.png`): kaksi valoa tasolla 97-111 (DoG), kolmanneksi kirkkain piste 52-76 eli hiutaleiden taso. Etäisyys (1280 px): 465 s 281; 467 266; 469-475 252 (tasanne, huilulinja pysyy, `linjat.huilu1` 91-90); 477 224; 483 210; 485 181; 487 167; 489 138; 491 93; 493 54: yksisuuntainen lähestyminen. Syttyminen: taso 54 -> 102 välillä 464,67-465,33 (noin 0,5 s, tasainen); suurin ruutuhyppy sen jälkeen 4,2/ruutu; sammuminen 492,8-493 huilun lopussa. Askelia ei jaksossa ole (`h_urkupiste_vyory.iskut_t` päättyy 460,3). Jään askelkohdissa 7:03-7:40 valojen taso ei laske: kuuden kirkkaimman pisteen summa askelhetken jälkeen vs ennen, 24 askelta: mediaani 1,00 (min 0,70, max 1,41, satunnaisesti), `c_423.png`. |
| **(d)** Pimeä metsä 2 13:34-14:05: ikkunat käyrätorvien mukana, syttyvät taitteesta sulavasti, sammuvat dim. possibilessa, paisutukset tuulena | **KORJATTU** (P-k) | Taite 13:33,6 (`P_taite_494` 813,6). Ikkunat syttyvät 13:34,5-13:35,2 (noin 0,7 s, `d_813_ramp.png`); 3-4 pehmeää soikiota eri korkeuksilla ja syvyyksillä, ei samalla korkeudella vierekkäin (`d_821_win.png`). Kirkkaus 13:35-13:46 tasolla 47-55 ja heilahtelee jakson mukana, laskee 13:46,5 -> 13:52 (53 -> 10, tasaisesti 5 s, ei ruutuhyppyä; `d_812.png`): `dim_possibile` 825,0 (13:45) + 1,5 s. Yksittäinen terävä valopiste vasemmalla syttyy 814,40-814,93 (50 -> 239, noin 0,5 s) ja sammuu 815,3-815,5. Paisutukset tuulena: hiutalevirtaus 13:48-14:04 pulssaa 0,75...2,4 px/ruutu 2-4 s jaksoin (13:48 2,32; 13:51 0,75; 13:52 2,10; 13:55 2,30; 13:57 1,23; 13:59 2,41; 14:01 0,96; 14:02 2,04), yhteen suuntaan. |
| **(e)** Koko video, 4d.42: kaksi ääntä yhden elementin ajurina / töksähtävät valot | **OSITTAIN** (P-l, P-m) | Ei löytynyt kuvaa, jota mitattavasti liikuttaisi kaksi eri ääntä. Tarkistetut: jään askelkohdat (koko ruudun keskikirkkaus askelhetken jälkeen vs ennen, 24 askelta: v8 mediaani 0,997, v7b 0,995); 03_04:n ikkunat ja askelten lumi poissa (a); 09:n ikkunat käyrätorvissa (d); 01_02:n jousivarjo ei sammuta puhaltimien kimallusta (vain koodista, `maailma_01_02.js` rivi 341; kuvaa ei mitattu). Jäännökset: P-l (koodi), P-m (yhden ruudun syttymiset). |
| **(f)** Ei regressioita | **EI REGRESSIOITA** (P-n) | `krit3/vertaa_koko.txt` (`render/vertaa.py runs/vedos_v7b/koko.mp4 runs/vedos_v8/koko.mp4 0 2 2.0`): 19 jaksoa, kaikki briefin ikkunoissa (0:00-1:02; 1:26-3:10 03_04; 3:20-5:30 05; 5:38-8:14 06; 8:30-8:44 07_08 ennen 9:00; 13:04-14:04 09; 14:18-14:20 10 T1; 15:02-15:04 E2). **Ei muutosta 8:44-13:04 eikä 15:04 jälkeen**: salin lumisade 9:00 ->, valot 9:40, trumpetit 10:26, aurinko ja C-duuri, varjojen metsä 11:32 ja loppu 11_12 ennallaan. Jään askeleet 7:03-7:40: jää, horisontti ja askelhohde samat kuin v7b, uusi vain rannasta etenevä huurre (`ice_440.9_v7b_vs_v8.png`). Pimeän metsän polun hohde ja pulssit ennallaan (`step115_*`). P4 (13:28-13:33,6) pehmeä, ei portaita (`p4_810.5.png`). E3 (6:30,5-6:31,3): kolme valoa jatkuu ja kirkastuu, uudet liittyvät hitaasti (`e3_389.png`). Kriitikon 2. kierroksen B1 (laatikkolumi) ja P-a (pilkku) eivät ole palanneet (`drop_99.7_zoom.png`). |

## Bugilista (kolmas tarkistus)

### ESTÄVÄT
- **B1. 3:36-3:43 (05), jousten paisutus ei näy tuulena (käyttäjän rivit 149 ja 152; hänen oma esimerkkinsä "3:40 alkaen").** Ainoa mitattava vaste on hiutalevirran heikko nousu (-0,17 -> -0,57 px/ruutu 1280 px:ssä, lähes taustan vaihtelun luokkaa), eikä harjanteilta nouse lumipölyä (`krit3/b216_ridge.png`, `krit3/b_215.png`, `krit3/diff_219.5.png`). Tyyliohje 4d.38: paisutus on tuulenvire, lumi kiihtyy sivulle ja kevenee, maasta irtoaa lunta. Kohdat 4:22-4:33 (virtaus ei laske diminuendossa) ja 5:15-5:23 (selvä nousu ja lasku) toimivat paremmin; korjaus kohdistuu 3:36-3:43:een ja 4:30:n diminuendoon (voimista vastetta tai nopeuta laskua). Katsoja ei todennäköisesti huomaa 3:36-3:43:n paisutusta ensikatselulla.

### PIENET
- **P-i. 2:49,5-2:52 (03_04), viimeinen (ppp) tipahdus ei erotu lainkaan** (`d169b.png`, gamma 2,4). Sääntö "pienenee pois ppp asti" toteutuu, mutta viimeinen kommentti (t. 93) on käytännössä tyhjä; kerroin 0,25 voisi olla noin 0,4.
- **P-j. 2:29-2:38 (03_04), hiutalevirran suunta kääntyy mittauksessa oikealle** (+0,5...+1,0 px/ruutu vs. -1...-2 muualla; `lat_0304.txt`; kameran vaaka-ajautuma 0). Ei varmistettu silmällä, voi johtua polun kaarteen vaikutuksesta radiaalivirtauksen keskipisteeseen. Jos kääntyminen on todellinen, se rikkoo kohtia 4d.32 ja 4d.40 (nyt noin 3 s suuntaan ja takaisin, vaadittu vähintään 4 s).
- **P-k. 13:35-13:47 (09), ikkunoita erottuu 3-4, briefin mukaan kuusi** (kaksi kolmen ryhmää). Loput hukkuvat usvaan (`d_821_win.png`). Tyylillisesti sopii; ikkunat ovat pyöreitä pystysoikioita, joista vasen luetaan 1:1-kuvassa hieman haamuna.
- **P-l. `visual/maailma_06.js` rivi 607: `dk = 1 - 0.5 * duck(t)` himmentää yhä jään valoja enintään 50 % askelhumpuissa (`HUMPS`), vaikka rivin 608 kommentti sanoo leikin poistetuksi** (lisäksi rivi 307: `uDuck` himmentää maailman 30 %). Videosta mitattuna vaikutus ei näy (askelhetken valojen summa mediaani 1,00; maailman keskikirkkaus identtinen v7b:n kanssa), joten ei estävä; koodi ei kuitenkaan vastaa kommenttia ja on 4d.42:n vastainen, jos `HUMPS` osuu valojen aikaan muualla.
- **P-m. 6:30-8:00 (06), hyppijöiden kosketusvälähdys syttyy yhdessä ruudussa** (6:42,00: 32 -> 255 yhdessä ruudussa, pysyy 0,3 s, sammuu 0,2 s; `pop_all.npy`). Se on 4d.33:n mukainen (alkaa soitetun äänen ruudussa), mutta rivin 151 "kaikki valot esiin sulavasti" kanssa jännitteessä; jos käyttäjä tarkoitti nämäkin, nousu pitäisi venyttää 3-5 ruutuun.
- **P-n. 5:38-5:46 (06), ei briefattu muutos:** hiutaleiden paikat eroavat v7b:stä (mse 6,3; `diff_341.png`: vain hiutaleet ja yksi halkeama). Mikään ei näy rikkinäisenä, mutta ikkuna ei ole briefin nimeämä (todennäköisesti lumen kertymän tai tuulen vaihe muuttui).
- **P-o. Ei tarkistettu:** 05:n keijuvalojen säpsähtämättömyys numeerisesti; 03_04:n kommentit 129,5-176,87 s ruutu ruudulta; 4:30-4:34:n diminuendon tuuli.
- Aiemmat PIENET P-c, P-d, P-e, P-f, P-g ja P-h ennallaan eikä niitä tarkistettu tässä kierroksessa.

ESTÄVIÄ 1 kpl

## Neljäs tarkistus (B1, paisutukset tuulena)

Mitattu valmiista `runs/vedos_v8/koko.mp4`:stä (1080p) ja `tapiola_vedos8_720p.mp4`:stä, vertailuna `runs/vedos_v7b/koko.mp4`. Mitään ei renderöity, koodiin tai dataan ei koskettu. Liikesarjat `render/sarja.py` 0,5 s välein (`krit4/s_3m35_*`, `s_4m21_*`, `s_5m14_*`, kutakin v8 ja v7b), lisäksi gammakorostetut 1:1-rajaukset harjanteilta (`krit4/ridge_3m36_3m42.png` 720p:llä, `r264_5.png` ja `z_266.5.png` 1080p:llä, `r317_vedos_v8.png` vs `r317_vedos_v7b.png`) ja hiutalemäärän aikasarja alaosasta (720p).

**B1: EI KORJATTU.** Lumipölyä ei nouse harjanteilta yhdessäkään kolmesta ikkunasta, ei 1080p:llä eikä 720p:llä.

| Kysymys | Tulos | Todiste |
|---|---|---|
| Näkyykö paisutus tuulena (nousu crescendossa, lasku diminuendossa)? | **Ei.** Harjanteiden yläpuolella ei ole juovaista tuiskua. Paisutusten huipuilla (3:37-3:38, 3:40,5-3:41, 3:44-3:44,5, 4:24,5, 5:17,5) harjanne ja taivas näyttävät samalta kuin hiljaisissa kohdissa, myös gamma 1,8-2,0 -korostettuna. | `ridge_3m36_3m42.png` (3:36,5 / 3:38 / 3:40,75 / 3:42,5: ei juovia, vain hiutaleita), `r264_5.png` (4:24,5), `r317_vedos_v8.png` (5:17,5); sarjat s_*_vedos_v8 |
| Mikä paisutuksilla sentään muuttuu? | Alaosan hiutalemäärä (kirkkaat pistemäiset pienrakenteet) pulssaa paisutusten tahtiin: 3:36,5 -> 3:38 noin +25 %, 3:40,5, 3:44,5 samoin; 4:21-4:34 ja 5:14-5:24 samaa suuruusluokkaa. v7b:ssä vaihtelu on satunnaista, noin ±10 %. Eli lisälunta syttyy, mutta se on hajanaisia pisteitä, ei tuulta. Sivuttaisvirtausta ei saatu luotettavasti mitattua (hiutaleet harvoja, korrelaatiohuippu 0,01-0,02; 720p:llä ruutujen välinen siirtymä on 1-2 px). | `tuisk.py`-aikasarja (työkansio): low_pos 0,11 -> 0,32 -> 0,15 -> 0,29 ... 3:36-3:45; flakeSum 31,6k -> 37,4k -> 40,5k |
| Lukeeko se lumena, ei valona, reunaviivana tai pahvina (sääntö 8)? | Ei sovellu: tuiskua ei erotu. Huomio: harjanteiden päällä on nyt pieniä ristikimalluksia (4:21-4:31, `z_266.5.png`, `r264_5.png`); ne ovat brief 8:n taikakimallus (T1), eivät paisutuksen tuisku, eivätkä ne muutu paisutuksen mukana. Harjanteiden pehmeä reunavalo (`r317_*`) on molemmissa vedoksissa sama. | `z_266.5.png`, `r317_vedos_v8.png` vs `_v7b.png` |
| Virtaako kuvio yhteen suuntaan (4d.32, 4d.40)? | Ei arvioitavissa, koska kuviota ei ole. Edestakaista liikettä ei havaittu sarjoissa. | sarjat |
| Pysyvätkö puut ja maa paikallaan (4d.31)? | Kyllä. Puita ei ole kiteessä; harjanteet ja horisontti etenevät vain kameran mukana, eikä siluetti muuta muotoaan paisutuksissa. Huom. harjanteiden alaosan laikkukuvio on eri kuin v7b:ssä (`s_3m35_*`: pehmeät kaarevat reunat, ei suorakulmaisia laikkuja): se on aiemmin briefattu P5-korjaus (`wn()`), ei regressio. | `s_3m35_vedos_v8.png` vs `_v7b.png`, `r317_*` |
| Onko tuiskulla muu syy kuin jousten paisutus tai puhaltajien puuska (4d.42)? | Ei: koodissa tuiskun voima on `max(svell, puuskaD)`, `svell` = keski- ja yläkaistan paisutus, `puuskaD` = D_pikkolo-juoksu. Mitattu pulssimuoto vastaa paisutusten ajankohtia. Ei toista ääntä. | `visual/maailma_05.js` rivit 413-420 (vain luettu) |

**Todennäköinen syy:** tuiskun shader-haara (`maailma_05.js` rivi 306-312) ei tuota näkyvää vaikutusta lopullisessa kuvassa: ehto `dd < 0.8 && dd > -14.0` ja kerroin `zf`/`uGlow` pitävät lisäyksen niin himmeänä, ettei se erotu pimeää taustaa vasten, tai juovat osuvat alueelle, jossa kerroksen kattavuus (`a`) on jo nolla. Tätä en voi todentaa ilman renderiä; mitattu tulos on, että tuiskua ei kuvassa näy.

## Bugilista (neljäs tarkistus)

### ESTÄVÄT
- **B1 (jatkuu). 3:36-3:43, 4:21-4:34 ja 5:14-5:24 (05), jousten paisutus ei näy tuulena eikä harjanteilta nouse lumipölyä.** Käyttäjän rivit 149 ja 152 ("Jousten cresc dim 3:40 alkaen ei näy", "svellarit eivät näy kunnolla"), tyyliohje 4d.38. Ainoa vaste on hajanaisten hiutaleiden määrän pieni pulssi (noin +25 %), joka ei lue tuulena eikä ole paisutuksena ensikatselulla tunnistettavissa, myös 720p:llä heikompi. Korjausehdotus: tuisku tehtävä silmin nähtäväksi (leveämmät, kirkkaammat juovat harjanteen reunalta tuulen suuntaan, selvästi hiutaleita suurempi kuvapinta-ala; tarkista että haara ylipäätään osuu kerroksiin, joiden `a` > 0) ja tarkistettava gammakorostamattomasta ruudusta.

### PIENET
- **P-p. 4:21-4:31 (05), harjanteiden päällä ristikimalluksia (taika T1) joiden ei pitäisi luettua paisutuksen tuuleksi.** Eivät virhe sinänsä, mutta jos tuisku korjataan, kimallukset ja tuisku pitää erottaa toisistaan (4d.42: yksi asia yhdestä äänestä).
- **P-q.** Aiemmat PIENET P-i...P-o ennallaan eikä niitä tarkistettu tässä kierroksessa.

ESTÄVIÄ 1 kpl

## Viides tarkistus (B1)

Mitattu valmiista `runs/vedos_v8/koko.mp4`:stä (1080p) ja `tapiola_vedos8_720p.mp4`:stä, vertailuna `runs/vedos_v7b/koko.mp4` ja `tapiola_vedos7b_720p.mp4`. Mitään ei renderöity, koodiin tai dataan ei koskettu. Liikesarjat `render/sarja.py` 0,5 s välein (`krit5/s_3m35_*`, `s_4m00_*`, `s_5m14_*`, kutakin v8 720p, v8 1080p ja v7b 720p), gammakorostetut harjanneleikkeet (`krit5/g_a_*`, `g_b_*`, `g_c_*`: 3:35,5 / 3:38 / 3:40,5, 4:00 / 4:02,5 / 4:03,5, 5:14 / 5:17,5 / 5:19) ja 1:1-rajaukset (`krit5/z_4m03.png`, `z_4m08.png`: 4:03,5, 4:02, 4:04,5, 4:08, 4:10, 4:17,5 ja v7b). Lisäksi hiutale- ja pistemäärän aikasarja 720p:llä (ylä- ja alaosa erikseen).

**B1: EI KORJATTU.** Harjanteilta ei nouse lumipölyä: ei juovaa, ei sumumaista tuiskua, ei tuulen suuntaan kulkevaa verhoa yhdessäkään paisutuksessa tai puhaltimien puuskassa (3:38, 4:02-4:04, 4:08, 5:17-5:19), ei 1080p:llä eikä 720p:llä, eikä gammakorostettuna.

| Kysymys | Tulos | Todiste |
|---|---|---|
| Nouseeko harjanteilta lumipöly crescendossa ja laskeutuuko diminuendossa? | **Ei.** Harjanteiden yläpuolella ei ole hajapilveä. Ainoa mitattava vaste on, että harjanteiden reunoille ja rinteille syttyy enemmän pieniä pisteitä: ruudun alaosan kirkkaiden pienrakenteiden osuus nousee paisutuksissa noin 3:37-3:39 +30 %, 4:01-4:04 +40 % ja 5:15-5:19 +60 % ja laskee niiden välissä; v7b:ssä vastaavaa pulssia ei ole (vaihtelu ±10 %). Pulssi on siis uusi ja osuu paisutuksiin, mutta se on pistejoukko, ei pöly. Yläosassa (taivas) ei muutosta. | `s_3m35_v8_720.png`, `s_4m00_v8_720.png`, `s_5m14_v8_720.png`; `g_b_v8.png` (4:03,5: pistejoukko harjanteilla, 4:00: ei); `z_4m03.png` |
| Erottuuko puuska selvästi paisutusten välisestä hetkestä? | **Ei lumena.** 720p:n liikesarjassa 4:02,5-4:03,5 harjanteilla näkyy hieno pisteparvi, jota ei ole 4:00-4:01 eikä 4:04,5; se lukee kimmellyksenä, ei tuiskuna. 3:38 ja 5:17,5 eroavat taukohetkistä lähinnä hiutaleiden määrässä, ensikatselulla ei tunnistettavissa. Puhaltimien puuska 4:08 (`z_4m08.png`) näyttää samoilta tähtimäisiltä pisteiltä, ei puuskalta. | `s_4m00_v8_720.png`, `z_4m08.png` |
| Lukeeko se lumena eikä valona tai reunaviivana? | **Ei, lukee valona.** Pisteet ovat ristikuvioisia, terävästi säteileviä tähtiä (`z_4m03.png` ylin rivi, `z_4m08.png` ylin rivi), jotka näyttävät valon kimalluksilta, eivät lumihiutaleilta. Ei vedä juovaa, ei kulje yhteen suuntaan, ei jätä jälkeä. Reunaviivaa tai pahvia ei ole. | `z_4m03.png`, `z_4m08.png` |
| Virtaako se yhteen suuntaan (4d.32, 4d.40)? | **Ei arvioitavissa, koska virtaavaa kuviota ei ole.** Pisteiden keskimääräinen siirtymä 3 ruudun välillä on 0-1 px (harjanteiden mukana). Edestakaista liikettä tai töksähtelyä ei havaittu sarjoissa. | pisteiden siirtymämittaus 1080p:llä 3:36, 3:38, 4:02, 4:03-4:04,5, 5:17-5:19 |
| Pysyvätkö puut ja maa paikallaan (4d.31)? | **Kyllä.** Kiteessä ei ole puita; maa ja harjanteet etenevät vain kameran mukana, siluetti ei muuta muotoaan paisutuksissa. | `s_*_v8_*.png`, `g_*_v8.png` |
| Onko tuiskulla muu syy kuin jousten paisutus tai puhaltajien puuska (4d.42)? | Kooditason luku (vain luettu): `svellT` = keski- ja yläkaistan 1 s miinus 4 s, `puuskaD` = D_pikkolo. Ei toista ääntä. Mutta kuvassa näkyvä pistemäärän pulssi voi olla `tuiskV`:n kerroin hiutalemäärään tai taika-T1:n kimallus; kumpi, ei selviä kuvasta. Jos kimallus nousee paisutuksen mukana, siinä on kaksi syytä (kimallus ja tuuli), vastoin 4d.42:ta. | `visual/maailma_05.js` rivit 304-312, 418-424 |

**Mitä muuttui edelliseen kierrokseen:** pulssi on nyt paisutusten välillä selvempi kuin neljännessä tarkistuksessa (+30-60 % vs. +25 %) ja laskee niiden välissä, joten mittari toimii. Itse tuiskun juovahaara (`maailma_05.js` rivi 306-312) ei kuitenkaan tuota kuvaan mitään luettavaa: gammakorostetuissa ruuduissa harjanteiden yläpuolella ei ole lisävaloa eikä juovia. Todennäköinen syy: juovien kokonaisvoima (`1.1 * uTuisk.x * plume * zf * (0.45+0.55*uGlow) * (1-0.6*fogA)`) jää usvan peittäessä alle näkyvyysrajan, tai `plume`-kynnys (0,44-0,80) ja `dd`-ehto jättävät sen reunan ulkopuolelle. Tätä en voi todentaa ilman renderiä.

## Bugilista (viides tarkistus)

### ESTÄVÄT
- **B1 (jatkuu). 3:36-3:43, 4:00-4:10 ja 5:14-5:22 (05), jousten paisutus ei näy tuulena: harjanteilta ei nouse lumipölyä, vaan ainoastaan pistemäinen tähtikimallus, joka lukee valona.** Käyttäjän rivit 149 ja 152, tyyliohje 4d.38 ("Samanlaiset paisumiset pitää aina näkyä ... kuin tuuli", ei valon välähdystä) ja 4d.40. Mittari tunnistaa paisutukset oikein ja pulssi on näkyvä numeroina, mutta kuvassa se on ristikuvioisia pisteitä, ei tuuleen kulkevaa lunta. Korjausehdotus: juovahaaran voimaa nostettava, kunnes harjanteen yläpuolella näkyy gammakorostamattomassa 720p-ruudussa pehmeä, viistoon yhteen suuntaan virtaava lumiverho (kymmeniä pikseleitä leveä, ei pistemäinen); pistepulssi (hiutalemäärän kerroin) pidettävä pehmeinä, ei ristikuvioisina pisteinä.

### PIENET
- **P-r. 4:02-4:10 (05), tähtimäiset ristikimallukset harjanteilla (`z_4m03.png`, `z_4m08.png`) näyttävät samalta kuin taika T1; jos ne ovat tuiskun hiutaleita, niiden muoto on väärä (valo, ei lumi), jos ne ovat T1, ne pulssaavat paisutuksen mukana ja rikkovat 4d.42:ta.** Selvitettävä, kumpi ne ovat.
- **P-s.** Harjanteiden alaosan laikkukuvio on edelleen eri kuin v7b:ssä (aiemmin kirjattu P5-korjaus, ei regressio); ei muuta huomautettavaa.
- **P-q ja aiemmat PIENET P-i...P-o ennallaan, ei tarkistettu tässä kierroksessa.**

ESTÄVIÄ 1 kpl

## 6. kierros

Kohde `runs/vedos_v8/koko.mp4`, vertailu `runs/vedos_v7b/koko.mp4` (30 fps, 1080p, ajat teoksen aikaa). Mitattu ruuduista ffmpeg-putkella ja Pythonilla (`-I`), katsottu liikesarjoja kuvina. Mitään ei renderöity, muita tiedostoja ei muutettu; työtiedostot `runs/vedos_v8/testi/kriitikko6/`. Luvut ovat 1080p-pikseleitä sekunnissa, ellei toisin mainita.

### Tulokset kohdittain

**1. Jään alku 5:36-5:56 (rivi 154): KORJATTU, mutta lumi puuttuu 5:37-5:41,4 (ks. E1).** Kirkkaiden hiutaleiden vaakanopeus ruutuparista kerrallaan (`flake3.py`: täpläpoiminta, siirtymähistogrammi):
- v8: 5:41,5-5:58 luotettavissa ruuduissa (465/570) hiutaleiden dx on oikealle; pienin arvo -25 px/s (5 ruutua, kohinaa); yhtään suunnanvaihtojaksoa ei ole. Nopeus kasvaa tasaisesti 470 (5:41,5) -> 630 (5:44) -> 720 (5:47,5), sitten laskee 550 (5:48,5) -> 340 (5:49,5) -> 140 (5:52) -> 235 (5:54-5:56). Ei portaita.
- v7b samalla mittarilla: 5:44-5:48,5 dx vaihtelee -1400...+1200, ja 5:46,0-5:46,5 -1256 / -1147 (selvä edestakainen). Vika oli 7b:ssä ja on poistunut v8:sta.
- Jään pinnan piirteet liikkuvat 5:40-5:44 vain pystyyn (dx +-20, dy 375-420): kameran kallistus, ei lunta.

**2. Alku -> metsä 0:54-1:02 (rivi 160): EI TODENNETTAVISSA mittarilla; virhettä ei havaittu.** Kameran liikettä ei saa globaalisti mitattua: horisontin harja pysyy rivillä 264-267 molemmissa, pimeän kuvan vaihekorrelaation huippu on 0,05-0,14, ja Lucas-Kanade-kohina on yhtä suuri molemmissa (ruutujen välinen pystynopeuden muutos enintään 15,7 px/s sekä v8:ssa että v7b:ssä, 960x540). Mitattavissa oli tasoitettu (5 ruutua) pystynopeus ty (960x540 px/s, 56-61,3 s):
- v8: lasku alkaa 57,25 s tasaisesti (-5 -> -20 -> -36 -> -50 -> -58 -> -66 noin 0,17 s välein, huippu -90 @58,9); suurin muutosvauhti 0,5 s ikkunassa 126 px/s^2 @59,2; etumerkki vaihtuu kerran (59,7).
- v7b: lasku alkaa vasta 58,4 ja kiihtyy jyrkästi (+18 -> -68 puolessa sekunnissa); suurin muutosvauhti 171 px/s^2 @58,3; etumerkki vaihtuu kolmesti (56,5; 58,4; 60,1).
- Liikesarjat (`s_lasku_v8.png`, `s_lasku_v7b.png`, 0,5 s välein): v8:ssa metsä laskeutuu jatkuvasti 0:57,5 -> 1:00,5 ilman katkoja; siirtymä pimeään 1:01-1:02 on sama molemmissa. v8 on alun osalta 7b:tä tasaisempi, mutta absoluuttista "ei nykimistä" en voi osoittaa. Ei mitattu: nykiikö kuva 1:1-nopeudella katsottaessa.

**3. Myrskyn alku 14:17-14:40 (rivi 159): KORJATTU.**
- 14:17-14:29 v8 on pikselintarkasti sama kuin v7b (|v8-v7b| 0,00 jokaisessa 2 s ikkunassa): mitään ei ole lisätty, huurrevälähdys on poissa, tapahtumaa ilman äänen syytä ei ole.
- Lumivirran dx (vaihekorrelaatio): v8 14:17 -16 -> 14:27 -24 -> 14:29 -104 -> 14:31 -330 -> 14:31,5 -506: jatkuva kasvu crescendon mukana. Ruututason hyppy: 14:32,00 (t. 537, aksentti) -558 -> -266; v7b:ssä hyppy samassa ruudussa (-287 -> -370). Muut yli 80 px/s ruutuhypyt (14:31,43 -337 -> -452; 14:37-14:39 +-100) ovat vaihekorrelaation kerrosten välistä kohinaa, jota on v7b:ssäkin yhtä paljon.
- Kirkkauden suurin ruutuaskel 14:17-14:40: v8 3,75 harmaasävyä @14:32,13, v7b 2,84 @14:32,10: molemmat aksentin ruudussa, ei muualla.
- 14:29 alkaen v8 poikkeaa 7b:stä pikselitasolla (|diff| 8-10) 15:45 asti, koska lumen paikka on kertymä; tilastollisesti kuva on sama.

**4. Välke koko teoksessa (rivit 155, 156): LISÄYSTÄ EI HAVAITTU.** Mittari `flick.py`: 320x180, lohkot 4x4 px (= 24 px 1080p:ssä); ruutu on välähdys, kun lohkon ero molempiin naapureihin ylittää naapureiden keskinäisen eron yli 6 harmaasävyllä. Molemmat videot, 32 340 ruutua.
- Ruutuja, joissa vähintään 20 välähdyslohkoa: v8 2988, v7b 3153; vähintään 100: v8 2121, v7b 2135 (valtaosa myrskyn lumea, mittari kyllästyy).
- 10 s ikkunat, joissa v8:ssa on vähintään 4 välähdysruutua enemmän kuin v7b:ssä: EI YHTÄÄN. Ikkunat, joissa v8:ssa vähemmän: 0:40 (1 vs 21), 0:50 (10 vs 49), 5:40 (8 vs 32), 7:00 (69 vs 91), 7:10 (28 vs 57), 14:30 (255 vs 286).
- Sali 8:16-11:32 ja varjojen metsä 11:32-12:44: |v8-v7b| keskiarvo alle 0,05 (8:16-11:30) ja enintään 0,16 (11:32-12:44) jokaisessa 10 s ikkunassa; välkelukumäärät samat (11:02-11:41: 265 vs 265).
- Ei mitattu: valojen syttyminen alle 0,2 s ilman aksenttia (en erottanut sitä lumen kohinasta).

**5. Paisutukset (< >) tuulena (rivi 158, 4d.38): 05 EI KORJATTU, 09 OSITTAIN.**
- Paisutukset äänestä (`rattle_kuuntelu.wav`, taso 1 s miinus 4 s, kynnys 1,5 dB). 3:24-5:23: 23 huippua, esim. 3:24,9 (+3,4 dB), 3:37,5 (+4,0), 3:44,3 (+4,9), 4:07,4 (+4,2), 4:48,0 (+4,3), 5:17,1 (+3,4). 13:46-14:05: 13:48,4 (+2,5), 13:55,2 (+3,1), 13:58,9 (+3,7), 14:02,3 (+2,6).
- 05: hiutalepisteiden määrän korrelaatio paisutuksen tasoon v8 0,23-0,31 (viive 0-1 s), v7b 0,01-0,09: pistemäärä seuraa paisutusta vähän, mutta suurimman paisutuksen 3:44,3 (+4,9 dB) kohdalla (`s_sw344_v8.png`, 3:41-3:47, 0,5 s välein) ei näy sivuttaista lumiliikettä eikä maasta nousevaa lunta. Sivuttaisliikettä en saanut mitattua (vaihekorrelaation siirtymä 480x270:ssä oli 0 px).
- 09 (13:55-14:01, `s_sw1358_v8.png`): matala tuiskuhunnu lattialla näkyy 13:55, 13:57,5 ja 13:58,5 (paisutusten 13:55,2 ja 13:58,9 kohdilla) ja hälvenee 13:59,5; ohut mutta näkyvä. Ei verrattu v7b:hen ruutu ruudulta.

**6. Yksi asia = yksi ääni ja kehutut kohdat: REGRESSIOTA EI HAVAITTU.**
- Sali 8:16-11:32 (9:00 lumisade, 9:40 valot, 10:26 trumpetit, aurinko/C-duuri) ja varjot 11:32-12:44: v8 = v7b (ks. 4).
- Askeleet jäällä 7:03-7:42: ero 7b:hen 1,5-3,9 (taika U2 ja tähdet; sallittu); katsottu 7:25-7:28,3 (`s_ste_v8.png`, `s_ste_v7b.png`): sama kamera ja horisontti, jäällä lisää huurrelaikkuja ja täpliä. Kameran nyökkäystä ja askelvalojen sykettä en mitannut.
- Pimeän metsän 1:02-3:23 ero 7b:hen 0,4-1,4 (P3/P1-korjaukset); 1:02,5 v8:ssa harmaa kasvomainen laikku rungosta on poissa (`s_lasku_v8.png`).
- Keijuvalot 3:45,5-3:46,5 (`z_3m46.png`, 1:1-suurennos): iso valo ja sen alla kaksi pientä kirkasta pistettä (vana) lähes samalla korkeudella vierekkäin; ei silmät, mutta lähellä S5:n rajaa (P-t).

### Bugilista (kuudes tarkistus)

### ESTÄVÄT
- **E1. 5:37-5:41,4 (05 -> 06 jään alku), lumi puuttuu, vaikka 7b:ssä sitä oli.** v7b:ssä kirkkaita hiutaleita 33-47 kpl/ruutu jo 5:38 alkaen (`s_ice_v7b.png`: 5:38, 5:39, 5:40, 5:41); v8:ssa 0-9 kpl (kirkkaat: 0 kpl 5:36-5:41, ensimmäiset 5:41,4) ja 5:42 alkaen 40-140 (`s_ice_v8.png`). Noin 4 s ilman lunta. Tyyliohje 4d.26 ("Lumi liikkuu aina", "ei staattista kuvaa"), kuvasääntö 11 (hiutaleet ilmestyvät tyhjästä 5:41,4-5:42), pyytämätön muutos 7b:hen (käyttäjä: "mikään korjattu ei saa mennä rikki"; rivi 154 koski vain suuntaa). Syy todennäköisesti rivin 154 korjaus. Korjausehdotus: palauta hiutaleiden määrä ja kirkkaus 7b:n tasolle 5:37-5:42 niin, että suunta pysyy oikealle.
- **E2. 3:24-5:23 (05), jousten paisutus ei näy tuulena (rivi 158 yhä auki).** Pistemäärän korrelaatio paisutukseen 0,23-0,31 (v7b 0,01-0,09), mutta suurimmassa paisutuksessa 3:44,3 (+4,9 dB) kuvassa ei sivuttaista lumiliikettä eikä maasta nousevaa lunta. Tyyliohje 4d.38, luku 7b ("Paisutus < >") ja kuvasääntö 0. 5. kierroksen B1 ei ole korjautunut. Korjausehdotus: tuiskun voimaa nostettava, kunnes harjanteilta näkyy 720p-ruudussa viistoon yhteen suuntaan virtaava hunnu (09:ssä sellainen näkyy lattialla 13:55-13:59).

### PIENET
- P-t. 3:45,5-3:46,5 (05), keijuvalon vanan kaksi pistettä lähes samalla korkeudella vierekkäin (`z_3m46.png`); vältä paria (S5).
- P-u. 09, 13:46-14:05 paisutusten tuisku ohut; ei verrattu v7b:hen.
- P-v. Kameran nykiminen 0:54-1:02: mittarini ei erota v7b:tä ja v8:aa kohinasta; v8:n lasku on kuitenkin tasaisempi (ks. 2). Käyttäjän katsottava.
- P-w. Myrskyn lumen suunta- ja vauhtikäyrää 14:40-15:45 en tarkistanut (14:29 jälkeen lumi eroaa 7b:stä odotetusti).

ESTÄVIÄ: 2
