# Maailma 9: Petos ja hermo (`visual/maailma_09.js`), tarkistus, vedos 5 kierros 2 (10.11.2026)

Aikaväli `M_raskaat_askeleet` (691,6 s) -> `hiljaisuus_2_alku` (845,6 s), Rattle / LSO 2022. Video `runs/maailma_09/osa.mp4`
(154,000 s, 4620 ruutua, `--workers 2 --chunk 40`, `aa=2`). Videon aika alkaa moduulin alusta. Liikesarjat: `runs/maailma_09/ruudut_v5/k2/`
(`render/sarja.py`). Huom: sarjat `laatta_6_7`, `laatta_119_123`, `O_ankkuri`, `vuorottelu`, `P_paisutus`, `hermo_30`, `askeleet_0_5`, `kontakti`
(vanha versio, ks. alla) on otettu renderistä, jossa oksan tyvi oli vielä pystysuoraan leikattu; ero lopulliseen on vain lopun oksat (aika 133-154 s),
jotka on otettu uudelleen lopullisesta videosta (`loppu_133_154`, `loppu_148_154`, `lasku_26_nousu_37`, `s1_8`, `s1_116`).
Kriitikon raportti: `runs/maailma_09/kriitikko_v5.md`; päätökset: `runs/v5_09/brief.md` luku KIERROS 2.

## 1. Kierroksen 2 kohdat

| # | Kohta | Mitä tehtiin | Mitä kuva näyttää | Tila | Todiste |
|---|---|---|---|---|---|
| 1 | Loppu 133-154 s: metsä pysyy metsänä | runkotiheyden ohennus ja yhdeksäs umpikumpu poistettu; vauhti ei hidastu; viimeinen kajo hiipuu, tumma aalto 138-145 s; lumiset kuusenoksat tulevat polun reunoilta lähelle ja ohi (maailmassa kiinteät oksat), kasvavat ja täyttävät kuvan vain viimeisinä ~2,4 s, sitten rajakuva | suorakaideseinä ja massa pois: rungot, kolme syvyyskerrosta ja lumi näkyvät 2:13-2:30; oksat 2:20-2:33; viimeinen ruutu rajakuva. Videon kirkkaus (YAVG) 133-154 s: pienin 27,2, ei yhtään alle 24 (aiemmin 6,4 s alle 24) | toteutuu; oksat ovat tummia haaravuoria, rosoisia, tosin hieman graafisia | `k2/loppu_133_154.png`, `k2/loppu_148_154.png`, `yavg`-luvut `runs/v5_09/yavg.txt` |
| 2 | Laattarungot pois | runkojen säde rajattu (enintään ~0,9 m, harvoin 1,3 m; ennen 1,65 m), vapaa kaista polun ympärillä 2,6 m + säde, juurenniska (leveä tyvi, joka kapenee), lumikinos tyvellä (tyvi sulaa lumen väriin, ei leikkausviivaa), kaarnan pystysuuntainen pinta sidottuna runkoon, valoreuna ei pääty tyvessä koukkuun; ovikumpu ei ole enää umpiseinä (reunat kuultavat, aukon tyvi sulaa) | 36-41 s, 119-123 s ja 129-131 s ei enää leveitä suorakaiteita: rungot ovat kapenevia, tyvet uppoavat lumeen; sivuilla matalat tummat kumpumassat näkyvät yhä oven kaaren vierellä (`laatta_119_123`) | pääosin korjattu; **6,4-6,8 s lähirunko kirkastuu askeleen renkaassa leveäksi vaaleaksi pilariksi (`laatta_6_7`)** ja oven aukon lattia näkyy suorakulmaisena laikkuna: jäi | `k2/laatta_6_7.png`, `k2/laatta_119_123.png` |
| 3 | Kirjain P: paisutus | valo seuraa mitattua tason käyrää (`pkAt`, `P_vaskipaisunta` -> huippu): syttyy ankkurin ruudussa, kasvaa kerros kerrokselta lähemmäs (rungot siluetteina, valon etureuna 170 m -> 6 m), huippu 810-812 s, sitten vetäytyy; pystyleikkaus vain iskun ruudussa | mitattu paisutus: 806,6 s 0,02; 808 s 0,49; 810 s 0,98; 812 s 1,00; 814 s 0,65; 817 s 0,37; 820 s 0,29. Ruuduissa 1:55-2:11 (115-131 s) kaari ja keila kirkastuvat ja palautuvat, yli 10 s | näkyy | `k2/P_paisutus.png` (115-126 s, 3 s välein) |
| 4 | Askeleet 18 | herkempi mittaus: ais:n (midi 34) tason nousut, kynnys 0,05 minimistä 12 ruudun ikkunassa, väh. 14 ruutua välein | löytyi **19 sykettä** 0-19,2 s: 0,07; 1,57; 2,53; 3,27; 3,73; 4,87; 5,33; 6,40; 8,13; 8,60; 9,60; 10,10; 11,60; 12,07; 14,80; 15,27; 17,50; 18,50; 19,20 s. Aukot 6,4->8,1, 12,1->14,8, 15,3->17,5 s ovat äänessä (mittaus ei löydä sykettä niistä; rytmiä ei ole keksitty). Jokainen syke on pehmeä maan renkaan valo | toteutuu (19 >= 18) | `k2/askeleet_0_5.png`, ajat `window.kuvaus().askel_ajat` |
| 5 | Jousten hermo 19,4-43 s | usvan ja valon nopea hienojakoinen väre (vaihe = liiketiheyteen sidottu kertymä, 4-6 Hz), kajon pimeneminen ja terävöityminen jousten voiman mukana, lumi nopeampaa ja puuskissa suunta vaihtuu, lumen määrä purskeina, tuulenpuuskat; rungot eivät liiku | `hermo_30`: usva ja valo väreilevät ja tummat juovat kulkevat ruudun yli 0,5 s välein, lumi virtaa vaihtelevasti | näkyy; väre on silti hienovarainen | `k2/hermo_30.png`, `k2/lasku_26_nousu_37.png` (24-35 s) |
| 6 | Kirjain O ajallaan | vastine alkaa ankkurin ruudussa: vasket matalana hehkuna (alkaa 42,85 s), oboet = ohut valojuova kaukana runkojen välissä (nuotin korkeus = sivuasema), klarinetit = puoliksi näkyvä liike keskellä, pilkahdukset runkojen välissä | 43,0-43,2 s valojuova ja hehku syttyvät; 44-46 s juovia ja pisteitä (44,6 s kaksi pistettä oikealla) | näkyy | `k2/O_ankkuri.png`, `k2/O_myohemmin.png` |
| 7 | Hehku ei suorakaiteeksi, vuorottelun lähde | pilkun kehä pienennetty; vuorottelun kaksi valoa ovat pystysuoria keiloja horisontista ylös runkojen takaa (rungot peittävät, keilat usvassa), ei palloja | 65-69,5 s: vasen ja oikea keila vuorotellen, ei suorakaidetta | näkyy | `k2/vuorottelu.png` |
| 8 | Nousut/laskut ja tremolo | nousu/lasku: kajon korkeus siirtyy 0,28 kuvan korkeudesta (ennen 0,11) ja kajo kirkastuu (väh. 0,40) niiden aikana; tremolo: usvan ja valon väre | siirtymää ja väreitä on lähes kaikissa sarjoissa, mutta nousun/laskun korkeuden muutos ei lue erillisenä tapahtumana ruuduista | osin / en erota luotettavasti | `k2/lasku_26_nousu_37.png`, `k2/tremolo_10.png` |

## 2. Säilytetyt (mitattu / katsottu uudelleen)
- **Runkojen paikallaan pysyminen:** nopeus 1,3-2,4 m/s (mitattu koko väli: suurin 2,40, pienin 1,30 välillä 700-835 s; matka 266,9 m). 1 ruudun sarjoissa 8 s, 56 s ja 116 s lähimmän rungon reuna siirtyy 2-6 px / ruutu 1920 px leveydellä (<= 0,3 % leveydestä; raja 2 %); `k2/s1_8.png`, `k2/s1_116.png`, siirtomittaus korrelaatiolla (8 s: 2-3 px, 56 s: 4-5 px, 116 s: 2 px).
- Kumipuusääntö: taipuma enintään 3,7 % korkeudesta (0,12 Hz, vaimenee yli 80 m), ei muodonmuutoksia.
- Vauhti ei hidastu lopussa (1,31 m/s 840 s kohdassa; ennen 0,99).
- Vaskien vuorottelu, harva kuviointi, pohjan katoaminen (usvapankki), valo ja lumen valuminen, siirtymien paikat (rajat ennallaan, alku PIMEYS ja loppu PIMEA_MASSA).
- Kirkkaus (YAVG) alueittain: 0-20 s keski 34,8 (alku 15,4 = rajakuvan pimeys); 20-43 s 29,2; 43-64 s 32,6; 64-88 s 30,6; 88-115 s 35,9; 115-133 s 42,0; 133-154 s 32,6. Missään osassa ei ole yli 10 s lähes mustaa.

## 3. Mikä jäi auki tai heikoksi
- 6,4-6,8 s (11:38) askeleen rengas kirkastaa lähirungon leveäksi vaaleaksi pilariksi; ratkaisu olisi himmentää renkaan valoa alle 3-9 m:n päässä oleviin runkoihin.
- Oven aukko 6-7 s näkyy suorakulmaisena lattialaikkuna (lähellä oleva ensimmäinen ovi).
- Lopun oksat ovat tummia ja kulmikkaita kuusenhaaroja, eivät vielä valokuvamaisia; lumireuna on ohut.
- Nousun ja laskun korkeuden muutos (8) ei lue erillisenä liikkeenä; tremolon väre ei erotu omana tapahtumanaan.
- Askelten aukot (6,4->8,1, 12,1->14,8, 15,3->17,5 s) ovat äänessä, eivät kuvan puutteita.
- Kriitikko ei ole katsonut tätä versiota; pikseliyhtäpitävyyttä rajakuvaan ei ole mitattu erikseen.
- Ei erillistä mittausta tuulesta kymmenen sekunnin liikesarjana; taipuma on laskennallinen.

## Loppukorjaus 10.11.2026: lopun piirretyt oksat pois
- **Poistettu:** `branchAt` (lumiset kuusenoksat) ja sen kutsu kokonaan; uniformit `uBranch`/`uFill` korvattu yhdellä `uDense`.
- **Lisätty (metsän omilla aineksilla):** `uDense` = sstep(t1-11, t1-2.5): samat rungot tihenevät (dens 0,60 -> 0,97) ja usva tummuu runkojen välissä (-50 %). Rajakuvan ristihäivytys ennallaan (viimeiset 1,5 s, `RAJA.PIMEA_MASSA`), viimeinen ruutu rajakuva kuten ennen.
- **Renderi:** 4620 ruutua (ffprobe). Talteen: `osa_v5_kierros2.mp4` (identtinen edellisen renderin kanssa).
- **Todiste:** `liikesarja_142_154_loppukorjaus.png` (142-154 s, 0,5 s välein): ei oksia eikä kuusihahmoja, ei suorakaideseinää; rungot, kolme syvyyskerrosta ja kameran liike näkyvät 153 s asti. Ruudut 8 s, 60 s, 116 s: PSNR inf (ruudulleen ennallaan); 140 s: 56,9 dB (vanhat oksat alkoivat jo ~138 s).
- **Auki:** 153,5 s ruudussa rakenne on jo hyvin himmeä (häivytys 1,5 s, ei muutettu); jos halutaan selvemmin, häivytystä voi lyhentää. Tihentyneen metsän maavarjot (`trunkProbe`) eivät seuraa tihentymistä.

## Vedos 6 (10.11.2026): viisi täsmäkorjausta
Renderi `runs/maailma_09/osa.mp4`, 4620 ruutua (ffprobe). Vedoksen 5 renderi talteen `runs/v6_09/osa_vedos5.mp4`, vanha koodi `runs/v6_09/maailma_09_vedos5.js.bak`. Liikesarjat: ennen `runs/v6_09/ennen/*.png`, jälkeen `runs/v6_09/uusi/*.png`. Muutettu vain `visual/maailma_09.js`. Kaikissa rytmisissä tapahtumissa käytetään `cues.alut`-aikoja ruutuun pyöristettynä (`Math.round(t*30)`), alku täydellä voimalla ilman nousua.

| # | Kohta | Tulos | Todiste | Nojaa |
|---|---|---|---|---|
| 1 | `N_vasket_takovat` 11:46 | **tehty.** Mitatut alut (keski+matala, voima ≥ 0,3, väh. 0,2 s välein, enintään 8) antavat kukin oman koko kuvan korkuisen kylmän leikkauksen runkojen takana, eri sivuasemissa ja leveyksissä, voima kasvaa kohti loppua; maa saa rengasvalon. Sama ele kuin moduulissa 07_08 (10:26). Vanha keskileikkaus säilyi ensimmäisellä iskulla. | `uusi/n_takovat.png` (13,8 s alkaen) | tyyliohje 7b (isku, sforzato: ympäristö reagoi iskun ruudussa; vaskien isku = leikkaus), kuvasäännöt 10, 11; kuvakäsikirjoitus: vaskien takominen (10:26 ele) |
| 2 | `jousten_kommentit` 12:44–13:01 | **tehty.** Mitattuja eleitä 6 (keski+yläkaista, voima ≥ 0,3, väh. 1,5 s välein; väli 1,6–4,8 s, ei tasan 5 s). Jokaisessa: tumma aalto kuvan poikki, valopilari runkojen välissä (nousee alun ruudussa, laskee ~1 s), lumi pöllähtää, usva liikahtaa sivuun. Eleet erottuvat selvästi (1:14,0, 1:20,0, 1:23,5 jne.). Rungot eivät liiku. | `uusi/kommentit.png` (73,0 s alkaen, 0,5 s välein) | tyyliohje 7b (ketkä soittavat, tason nousu), 4d kohta 1 (metsä reagoi tuulena, ei kumia), kuvasäännöt 9, 12; käsikirjoitus: vaskivuorottelu + jousten kommentit |
| 3 | `jousten_nousu_473` 13:01–13:05 | **tehty.** Rintama nousee maasta latvoihin askelin jokaisella mitatulla alulla (kaikki kaistat, voima ≥ 0,25); askel liukuu 0,15 s eikä loikkaa, välähdys alkaa alun ruudussa. Valo on vain usvassa; rungot pysyvät tummina. Nousun jälkeen valo jää keinumaan ~12 s ja pohja katoaa jo olemassa olevasta tapahtumasta (`kerros katoaa`, 785 s). Ensimmäisessä versiossa rungot valaistiin ja syntyi vaaleita portaikkopilareita; valaisu poistettu. | `uusi/nousu.png` (89,2 s alkaen) | tyyliohje 7b (nousu: valo kohoaa rungoista latvoihin; kerros katoaa), kuvasäännöt 0, 14 (valon lähde usvassa); käsikirjoitus: jousten nousu |
| 4 | `P_taite_494` 13:33 | **tehty.** Paisutus säilyy. Taitteen ruudussa vaskien valo sammuu (0,27 s), ja noin sekunnissa usva vaalenee ja kylmenee tasaisesti koko kuvassa, maan lumi kirkastuu, lumi leijuu hitaasti; tila kestää `dim_possibile`en (825 s) ja sulkeutuu 8 s kuluessa. Rungot tummia siluetteja. Keskikirkkaus (YAVG) 123 s: 39,7 -> 53,8; 125 s: 40,4 -> 55,7; 127 s: 39,7 -> 54,5 (noin +36–38 %). Yläpuolinen valo ja keilat jätettiin pois, koska ne tekivät vaaleita tasalatvaisia pilareita; usvan ohentaminen (`uFogL`) jätettiin pois samasta syystä, eli "rungot erottuvat syvemmälle" toteutuu vain usvan kontrastina. | `uusi/taite.png` (120,8 s alkaen) | tyyliohje 4d kohta 27 (taite = tilan muutos, jatkuva), 3 (halla, ei lämmintä), kuvasäännöt 14, 16; käsikirjoitus: P-kirjain ja taite |
| 5 | `puuska_499` 13:41 | **tehty.** Lumi ryöpsähtää vaakaraidoin kuvan poikki, usva virtaa, valo värähtää, laantuu ~1 s kuluessa. Rungot eivät liiku (tuuli ei kasva). Vanha pystyleikkaus puuskan alussa poistettu (huilun juoksu ei ole vaskien isku; ohjaaja hyväksyi). | `uusi/puuska.png` (128,6 s alkaen) | tyyliohje 4d kohdat 25, 26 (ei staattista lunta, ei kumipuuta), 7b (nopea, staccato), kuvasäännöt 9, 10 |

**Koskemattomuus** (vedoksen 5 renderiä vasten, PSNR): 8 s inf (ruudulleen sama), 30 s 51,5 dB, 60 s 54,3 dB, 100 s 30,4 dB, 150 s 41,6 dB. 8 s on bitilleen sama; muissa lumen kertymä (pudotus/ajautuma) on siirtynyt hieman, koska uudet eleet lisäävät lumen kertymää, ja 100 s:n ero on kommenttieleistä (73–89 s). Rakenne, rungot, kamera ja varjot (60 s, 150 s) ovat ennallaan.

**Auki:** usvan ohennus taitteessa ei toteudu; puuskan jälkeen (2:11–2:12) kaksi tummaa latvuston kolmiomuotoa kuvan vasemmassa yläkulmassa on näkyvissä (olemassa oleva latvusto kirkkaassa usvassa, ei uusi); kriitikko ei ole katsonut tätä versiota.

## Vedos 7 (11.11.2026): täsmäkorjaukset (brief `runs/vedos_v7/brief.md`, luku Moduuli 09 + LISÄYS rivi 92)
Muutettu vain `visual/maailma_09.js` (vanha: `runs/maailma_09/v7/maailma_09_vedos6.js.bak`; vedoksen 6 renderi `runs/maailma_09/v7/osa_vedos6_ennen_v7.mp4`). Renderi `runs/maailma_09/osa.mp4`, 4620 ruutua (ffprobe), `--start 691.6 --end 845.6 --workers 2 --chunk 40`, aa=2.
Liikesarjat (valmiista renderistä, `render/sarja.py`), kansio `runs/maailma_09/v7/`: `s_1300_1307.png` (13:00-13:07, 0,33 s), `s_1324_1348.png` (1 s), `s_1332_1338.png` (0,2 s), `s_1340_1345.png` (0,2 s; huom. tämä on edellisen kierroksen renderistä, ks. auki), `s_1244_1252.png` ja `_v5` (jousten kommentit, vedoksen 5 rinnalla), `s_1144_1152.png` ja `_v5` (N), `raja_*.png`.

**Y1 PERUTTU:** funktio `sway` ja puiden liike ovat ennallaan. Raportoitava: sway-taipuma on koodissa 3,0 % * yw²/H (latva noin 3,7 % korkeudesta), eli yli uuden 1 % / 1,5 % rajan; ohjeen mukaan ei korjattu omin päin. Tuuli (`wind`) lasketaan vedoksen 5 iskuista (`ISKUTW` = `d.iskut` ilman vedoksen 6 uusia ankkureita), jotta puiden liike on v5:n mukainen.

### Muutokset
| Kohta | Mitä |
|---|---|
| Lisäys a | poistettu `uGes`/`uSweep`/`uRise` ja kaikki niiden termit (koko tilan välähdys, tumma aalto, `drift`-voimistus, `fo.x`-venytys, `h > 0.30+0.22*uGes.z`), `gestAt`/`gustAtF`/`sSweep`/`riseAt`; `0.20*nerveAt*sin(1.7 t)` pois `sDrift`:stä; kajon `lift`-lisäys jousten nousun jälkeen pois (kuului vanhaan nousuun) |
| Lisäys b | jousten kommentit: yksi ohut hallan valosäie (`uThr[2]`) runkojen keskikorkeudella, kulkee 40 % leveydestä 1,6 s:ssa (syttyy 0,15 s, sammuu 1,2 s), vuorotellen vasemmalta ja oikealta; alut `cues.alut` keski+korkea, voima >= 0,3, väh. 1,5 s välein (6 kpl); amplitudi 0,30 = sama kuin uTwo-pylväissä |
| Lisäys c | N: enintään 4 kirkkainta mitattua iskua (`HITS`), ydin 1,1 % kuvan leveydestä, halo 0,03, maan syke pois. **Juurisyy:** `N_vasket_takovat` ja `puuska_499` ovat `luokka: isku`, joten `d.iskut` antoi niistä pystyleikkauksen ja rungon valoreunat (`uCut`); `UUDET6`-lista suodattaa vedoksen 6 uudet ankkurit pois iskuista ja tuulesta |
| Lisäys d | kameran vauhti ja rata ennen taitetta ennallaan; vain `openAt` tuotu aikaisemmaksi |
| 2 (P) | 4 kaistaa: `P_vaskipaisunta.iskut_t` (806,44 / 809,94 / 810,70 / 812,57). Maailmassa kiinni (etäisyydet 140/105/78/56 m, leveydet 4,5/7/10/14 m, sivuasema lasketaan kameran radasta joka ruudulla), jokainen edellistä lähemmäs ja leveämpi; ensimmäinen välähtää ja vetäytyy ~40 %:iin 0,4 s:ssa; voima = `bandCm` (150-1500 Hz paisutuksen kertymä, vain kasvava) x kaistan paino x `BAMP` 3,4; sammuvat taitteessa 0,25 s. P:n keskipylväs (ISKUT P-ruuduissa) pois, jotta kaistoja on neljä. Varjot lumelle: olemassa oleva `uCut.y`-maavalo |
| 3 (taite) | `openAt` 3 s (ennen 1 s); sininen `TAITE`-valo usvaan ylhäältä ja kaikkialle, rungot siniharmaiksi (`mix(tone, fog*0.62, 0.55*uOpen)`), latvukset ja kaukaiset rungot usvaan (`uFogL` 85 -> 42,5), maan lumi hohtaa tasaisesti, varjot pois; kameran vauhti x(1-0,40*open) (60 %:iin 3 s:ssa); lumen nopeus 40 %:iin ja kulma -> 1,6 astetta; väikkeet: `cues.alut.nuotit` midi >= 72, enintään kolme kerrallaan, taitteesta `dim_possibile`een |
| 4 (nousu) | `jousten_nousu_473`: pölyhuntu (`uDustA`, tiheys 0,6, hiukkaset noin 2-4 px) nousee tasaisesti alhaalta ylös ankkurin alusta loppuun, ajelehtii lumen suuntaan; nouseva usvavyö poistettu; maa jää kirkkaammaksi (`uGrB`) |
| 5 (puuska) | `puuska_499`: lumipölyn huntu (`uDustB`, tiheys 1,0), sisään 0,4 s ennen, tihein ankkurin keskellä, poissa 1,5 s ankkurin lopun jälkeen, kulkee kuvan läpi +x (lumen suuntaan); koko ruudun soikiot, valon värähtely ja pystyleikkaus pois |
| 6 (Y2) | lumen kertymät `vFall`/`vDrift`-taulukoista: nopeusrajoitin (nousu 0,30/s = koko väli 0,6 s, lasku 0,10/s = 1,7 s), kulma vakio 15,6 astetta (drift = 0,28 x fall), isku/kommentti/puuska ei vaikuta nopeuteen, lumen määrän `surge`-osa pehmennetty (nousu 0,5 s) |

### T1: mittaukset renderistä (ffmpeg-ruutu 480 px, keskikirkkaus = (R+G+B)/3, kontrasti = std/keskiarvo)
| Kohta (osan s) | keskikirkkaus | B/R | kontrasti | huomio |
|---|---|---|---|---|
| 13:24 (112,4), vertailu | 37,27 | 1,305 | 0,348 | |
| 13:30 (118,4) | 59,04 | 1,188 | 0,349 | kaistat 1-3 |
| iskut_t[3] = 120,97 | 94,94 | 1,110 | 0,354 | **2,55 x** 13:24 (vaatimus >= 2,5) |
| huippu 121,9 | 100,66 | 1,091 | 0,405 | 2,70 x, moduulin kirkkain |
| 13:34 (122,8), taite | 39,03 | 1,408 | 0,239 | hämärä hetki |
| **13:37 (125,4)** | 71,14 | 1,455 | 0,156 | **1,91 x** (>= 1,8); B/R **+11,5 %** (>= +10 %); kontrasti **0,45 x** (<= 0,6) |
| 13:40 (128,4) | 70,26 | 1,461 | 0,196 | |
| 13:44 (132,4) | 81,71 | 1,473 | 0,081 | |
| 135,4 / 140,4 | 74,11 / 35,53 | 1,471 / 1,399 | 0,094 / 0,303 | tunnelma sulkeutuu pimeään |
N (11:46-11:51), uusi / vedos 5: 14,9 s 37,86 / 37,40; 15,4 s 43,35 / 43,33; 16,8 s 37,00 / 36,52; 18,0 s 44,54 / 43,77 = **1,01-1,02 x** (vaatimus <= 1,35). Jousten kommentit (74,2-86,0 s) uusi / v5: 26,92 / 26,66; 28,61 / 28,61; 32,61 / 32,45; 28,79 / 28,60; 32,57 / 32,59 = **<= 1,01 x** (vaatimus <= 1,15).
Y2, koko moduuli (`kuvaus()` joka ruudulta): suurin kulman muutos **7,2 astetta/s** (<= 10); vaakanopeus > 0 koko ajan (pienin 0,001, etumerkki sama); kulma 1,6-15,6 astetta; nousu enintään 0,30/s (vaihteluväli 0,177 -> 0,59 s), lasku enintään 0,10/s (1,7 s). Taulukko (aika: nopeus / vaakanopeus / kulma): 806,2: 0,068 / 0,0190 / 15,6; 807,2: 0,084 / 0,0235 / 15,6; 812,6: 0,136 / 0,0380 / 15,6; 813,6 (taite): 0,122 / 0,0341 / 15,6; 814,6: 0,089 / 0,0194 / 12,3; 815,6: 0,051 / 0,0047 / 5,3; 820-823 (puuska): 0,035-0,041 / 0,0010 / 1,6; 825: 0,042 / 0,0012 / 1,6; 789,3: 0,048 / 0,0133 / 15,6 (ei hyppyä). (Luvut mitattu ennen viimeistä `BAMP`-säätöä; lumeen se ei vaikuta.)

### T2: regressiomittari
`vertaa.py runs/vedos_v5/osat/09.mp4 runs/maailma_09/osa.mp4 691.6 2 5` (raja 5; v5 on lisäyksen vertailu):
```
11:45.6 - 11:51.6  8,1   lisäys c (N: ohuet leikkaukset; vaatimus <= 40)
11:53.6 - 11:55.6  6,6   lisäys c
12:01.6 - 12:05.6  5,7   Y2 (lumen vaihe)
12:07.6 - 12:09.6  5,4   Y2
12:11.6 - 12:13.6  6,2   Y2
12:15.6 - 12:17.6  5,2   Y2
12:19.6 - 12:21.6  5,3   Y2
12:23.6 - 12:27.6  5,7   Y2
12:29.6 - 12:31.6  6,1   Y2
12:33.6 - 12:35.6  6,1   Y2
13:01.6 - 13:05.6  15,2  kohta 4 (pölyhuntu)
13:23.6 - 14:05.6  1798  kohdat 2, 3, 5, 6 (kaistat, taite, vauhti 60 %, puuska)
```
Raja 15: vain 13:03,6-13:05,6 (15,2, kohta 4) ja 13:25,6-14:03,6 (kohdat 2-3, 5-6). **Ennen 13:01 jokaisen jakson suurin mse <= 8,1** (vaatimus <= 15, N <= 40). Jousten kommenttien jaksossa 12:44-13:01 ei mse-jaksoja yli 5 (säie hillitty). Selittämätöntä jaksoa ei ole. Vedos 6:ta vastaan (raja 5): 11:45,6-11:59,6 (228, N-muutos), 12:43,6-13:17,6 (122, kommenttien välähdykset poistuneet), 13:23,6- (P/taite): kaikki määrättyjä.

### T3: sauma
Ruutu 0: mse vs vedos 5 **0,0018**; viimeinen ruutu (4619): mse **0,034** (rajakuva). Sauma ennallaan.

### Auki / epävarmaa
- `s_1340_1345.png` (puuskan liikesarja) ja `s_1300_1307.png` on otettu renderistä ennen viimeistä `BAMP`- ja lumirajoitinsäätöä; ne eivät eroa muuten (P:n kaistat ja lumen nopeusrajoitin eivät vaikuta 13:00- ja 13:40-jaksoihin paitsi lumen vaihe). `s_1324_1348.png` ja `s_1332_1338.png` ovat lopullisesta.
- Taitteen jälkeen kameran vauhti on pienempi, joten rungot ja ovet ovat eri paikoissa kuin vedoksessa 6 (osa jakson 13:23,6-14:05,6 erosta). Rajakuva ei muutu.
- Pölyhunnuissa kierretty ruudukko jättää heikkoja vinoja viivamaisia kuvioita (puuskan sarjassa 2:10,0-2:10,6); ei korjattu enempää.
- P:n huipulla (121,4 s) vanha paisutuksen valo (`pk`) ja kaistat yhdessä tekevät kuvasta vaalean usvan; kaistat erottuvat selvimmin 1:55-2:00 (115-120 s). Keskikirkkaus 100/255, ei koko ruudun valkaisu, mutta lähellä rajaa.
- Sway-taipuma 3,7 % > uusi raja 1 %: ohjaajan päätettävä.
- Lumen kirkkauden reaktio iskuun/kommenttiin/puuskaan on poistettu (Y2).
- Kriitikko ei ole katsonut tätä versiota.

### Vedos 7, viimeistely (ohjaajan neljä kohtaa A-D, lopullinen renderi `runs/maailma_09/osa.mp4`, 4620 ruutua)
- **A pölyhunnut:** hiukkasten paikka ja koko satunnaistettu solun sisällä (sin-hash, kolme kerrosta eri kierrolla ja solukoolla), hunnun runko on fbm-kohinaa, hiukkaset pintaa. Liikesarjat `s_1300_1307.png` ja `s_1340_1345.png`: ei vinoja pisteviivoja, näyttää leijuvalta pölyltä.
- **B taitteen kerrosreunat:** `doorLayer`-alfa x (1 - 0,85 x opn). Holvikaari ja porras poissa avoimessa tilassa (`s_1340_1345.png`, 128-133 s ja `s_1324_1348.png`).
- **C sway:** kerroin 0,030 -> 0,0122, latva enintään ~1,5 % korkeudesta (muoto ja vaiheet ennallaan).
- **D kommenttisäie:** yksi yhtenäinen, kaareva (0,30 lx²), kalteva (0,123 = noin 7 astetta) pehmeäpäinen säie, piirretään runkojen päälle (ei katkoja); kirkkaus ja kesto ennallaan (`s_1244_1252.png`).
- Mittaus uudelleen (osan s: kirkkaus / B/R / kontrasti): 112,4: 37,22 / 1,305 / 0,349; 118,4: 59,04 / 1,188 / 0,349; 120,97: 94,94 / 1,110 / 0,354 (2,55 x); 121,9: 100,67 / 1,091 / 0,405; 122,8: 39,54 / 1,409 / 0,231; **125,4 (13:37): 79,87 / 1,461 / 0,116** (2,15 x, B/R +12,0 %, kontrasti 0,33 x); 128,4: 79,82 / 1,471 / 0,098; 132,4: 81,67 / 1,473 / 0,081; 135,4: 74,10 / 1,471 / 0,094; 140,4: 35,52 / 1,399 / 0,303. Kommenttien kirkkaus 74,2/80,1/86,0 s: 27,65 / 33,24 / 32,82 (vedos 5: 26,66 / 32,45 / 32,59, <= 1,04 x).
- `vertaa.py` vedos 5 vastaan (raja 5), ennen 13:01: N 8,3 / 6,7; 12:01-12:35 5,3-6,3 (Y2 ja sway-skaalaus); **12:45,6-12:47,6 15,8 ja 12:49,6-12:59,6 17,2** (kommenttisäie, nyt runkojen päällä, ja sway-skaalaus, hieman yli rajan 15); 13:01,6-13:05,6 21,6 (kohta 4, pölyhuntu; kohdan 4 jakso); 13:23,6- 1798,5. Epävarma: 12:45-13:00 ylittää rajan 15 hieman (kommenttisäie piirretty runkojen päälle D:n mukaan).

### Vedos 7, kaksi viimeistä korjausta (ohjaajan viesti, lopullinen renderi `runs/maailma_09/osa.mp4`, 4620 ruutua)
- **Kommenttisäie takaisin runkojen taakse** (`fogAt`): lievä kaari ja kallistus ennallaan, pystysuunnan leveys 2 x (ly²/0,0008), huippukirkkaus 0,18 (60 % edellisestä 0,30), reunat hiipuvat. Liikesarja `s_1244_1252.png`: usvan juova, rungot peittävät sen. Kirkkaus 74,2/80,1/86,0 s: 27,10 / 32,78 / 32,69 (vedos 5: 26,66 / 32,45 / 32,59). vertaa.py: 12:44-13:01 ei jaksoja yli 5 (12:57,6-12:59,6: 5,1), eli aiempi ylitys 15,8-17,2 on poistunut.
- **Huipun kerrosreunat (P, 118-122 s) pois** `uBandK` (kaistojen yhteisvoima, = min(1, 1,3 x kertymä) x sammutus) : ovikerrosten peitto x(1 - 0,85 uBandK), latvusten peitto x(1 - 0,85 uBandK) ja sävy kohti usvaa, rungot tummina siluetteina (usvasävy x(1 - 0,72 uBandK)) ja haihtuvat latvaa kohti usvaan (rungon peitto x(1 - 0,95 uBandK smoothstep(0,38 H, 0,92 H, yw)), jotta latvat eivät ole leikattuja). Kokeilu, jossa latvukset värjättiin täysin usvaksi alfa säilyttäen, tuotti leikattuja pilareita ja hylättiin. Liikesarja `s_1330_1336.png` (13:30-13:38, 0,33 s välein): ei portaita eikä holvikaaren ääriviivaa.
- Mittaus: 13:24 (112,4): 37,22; 13:30 (118,4): 65,04; **iskut_t[3] (120,97): 101,07 = 2,71 x (>= 2,5)**; huippu 121,9: 107,81 (2,90 x); **13:37 (125,4): 79,91 / B/R 1,461 / kontrasti 0,116** (2,15 x, +12,0 %, 0,33 x). Sauma: ruutu 0 mse 0,0027, viimeinen 0,036.
- Auki: huipun kontrasti nousi 0,35 -> 0,53; kaistojen reunat ovat rungoissa hieman kovia (kaksi vaaleaa rungon reunaa 1:59-2:01 sarjassa).

## Vedos 7b (11.11.2026): tuulenpuuska nostaa jo kuvassa olevaa lunta (rivit 97 ja 98; brief `runs/vedos_v7/brief.md`, luku "09 (rivit 97 ja 98)")
Muutettu vain `visual/maailma_09.js` (vedoksen 7 koodi: git HEAD; vedoksen 7 osa `runs/vedos_v7/osat/09.mp4`; kopio edellisestä renderistä `runs/maailma_09/v7b/osa_vedos7_ennen.mp4`). Renderi `runs/maailma_09/osa.mp4`, 4620 ruutua (ffprobe), `--start 691.6 --end 845.6 --workers 2 --chunk 40`, aa=2.

### Mitä muutettiin
1. **Hunnut pois:** `dustAt`, `dustCell`, `dh`, uniformit `uDustA/uDustB`, JS:n `dustA/dustB`/`gA,gB,gM` sekä maan kirkastuminen (`uGrB`, `grB`) poistettu.
2. **Nostopuuska lumen kertymänä:** `snowAt`-funktion hiutalekerrosten pudotuskertymästä vähennetään nostosiirtymä `lf.x` (`q.y = p.y + (uSnow.x - lf.x) * spd`), joten samat hiutaleet hidastuvat, pysähtyvät, kääntyvät ylös ja laskeutuvat takaisin. Siirtymä on nostonopeuden kertymä (taulukot `LFA`/`LFB`, 48 pistettä, lineaari-interpolaatio shaderissa), ei hetkellisen arvon funktio. Rintama kulkee +x (lumen ajelehtimissuunta): paikallinen aika `uTime - Tf * x/leveys` (A: Tf 1,0 s, B: Tf 0,6 s). Painotus maan lähellä: `w = mix(0.6, 1.0, smoothstep(0.85, 0.05, p.y))` (alareunassa 1,0, yläreunassa 0,6). Neljäs kerros on hieno pintalunta (tiheys 0,05/0,30 eli 1/6 hiutaleiden määrästä, noin 2 px), joka näkyy vain puuskan voimakkuudella ja kuvan alapuoliskossa samassa siirtymäkentässä. Hiutaleiden kirkkaus kerrotaan enintään 1,2:lla puuskan aikana (raja 1,3).
3. **A (`jousten_nousu_473`, 782,95-785,2 s):** nostonopeuden verhokäyrä alkaa ankkurin alusta, u²(3-2u) ankkurin kestolle + yksi pehmeä sykäys viimeisellä kolmanneksella (sin², leveys 0,77 s), laskee pehmeästi 2,5 s ankkurin lopun jälkeen. Huippu mitoitettu niin, että netto (nosto miinus pudotus) = 1,5 x tavallinen putoamisnopeus (`FALL0` = 0,10 kuvan korkeutta/s, ks. alla).
4. **B (`puuska_499`, 820,75-822,1 s, `iskut_t[0]` 821,6):** alkaa ankkurin alusta, huippu `iskut_t[0]`:ssa (nousu 0,85 s), laskee 2,5 s huipusta eli 2,0 s ankkurin lopun jälkeen; netto huipussa 2,5 x tavallinen putoamisnopeus; rintama ylittää kuvan 0,6 s:ssa. Taitteen sininen tila ja hidas lumi (vFall 0,035-0,043) ennallaan.
5. Rungot, latvat ja valo eivät reagoi (sway ei koskettu, ei välähdystä, ei uusia valouniformeja).
Päätös, jonka ohjaaja voi kumota: ensimmäisessä kokeessa "tavallinen putoamisnopeus" oli moduulin hetkellinen vFall (0,06 A:ssa, 0,04 B:ssä), jolloin nosto jäi noin 1 px/ruutu (vaivin havaittava). Nyt vertailuyksikkö on kiinteä 0,10 (moduulin vFall vaihtelee 0,045-0,145), eli nettonopeus ylöspäin A:ssa 0,15 ja B:ssä 0,25 kuvan korkeutta/s. Jos halutaan sanatarkka tulkinta (hetkellinen vFall), vaihda `FALL0` mallin `mkLift`-funktiossa arvoon `fPk`.

### T1: mallitaulukko (`window.kuvaus`: `nosto_netto`, netto ylöspäin, yksikkö 0,10 kuvan korkeutta/s, + = ylös; sarakkeet x=0 (vasen reuna) / x=0,5 / x=1 (oikea reuna), maan taso). Koko taulukko `runs/maailma_09/v7b/malli_taulukko.txt`.
A (teoksen aika s): 782,6: -0,70/-0,70/-0,70; 783,4: -0,57/-0,75/-0,75; 784,2: +0,27/-0,28/-0,67; 785,0: +1,13/+0,87/+0,11; 785,8: +0,90/+1,14/**+1,55**; 786,6: +0,20/+0,70/+1,09; 787,4: -0,43/-0,08/+0,41; 787,8: -0,49/-0,37/+0,02 (peruspudotus palaa noin 2,5 s lopun jälkeen).
B: 820,6: -0,35; 821,0: +0,25/-0,35/-0,35; 821,4: +2,11/+0,70/-0,32; 821,6: **+2,50**/+1,68/+0,24; 822,0: +2,29/+2,47/+2,08; 822,2: +2,06/+2,36/**+2,47**; 823,0: +0,76/+1,27/+1,76; 823,8: -0,30/0,00/+0,43; 824,4: -0,43/-0,43/-0,31 (palaa satamaan noin 2,0 s ankkurin lopun jälkeen: 822,1 -> 824,1).
**Y2:** nopeuden nousu A: 2,25 s (u²(3-2u)), B: 0,85 s (>= 0,5 s); lasku 2,5 s (>= 1,5 s). Siirtymä on kertymä: ei hyppyjä. Lumen kulma ei muutu: 15,64 astetta A:ssa ja 1,6 astetta B:ssä (kuten vedoksessa 7; `lumi_kulma` kuvauksessa), suunta (+x) sama koko ajan. Isku ei vaikuta lumen nopeuteen.

### T1: toteaminen renderistä (`osa.mp4`; `runs/maailma_09/v7b/flow.py`: pystysiirtymä px/ruutu 1920x1080-kuvasta, siirtymä 3 ruudun välein, hiutalesuodatus top-hat; + = alas)
A (osan aika 89,6-99,8 s; ankkuri 91,35-93,6), `flow_A.txt`, vertailu vedoksen 7 renderistä `flow_A_v7.txt`: kuvan alaosa (y 600-1080, lähellä maata): 89,6-92,0 s +1,0 (normaali putoaminen); 92,6: +0,28; 93,0: -0,22; **93,8-94,4: -1,67 px/ruutu (hiutaleet nousevat)**; 95,0: -1,0; 95,6: 0,0; 96,4: +0,67 (normaali). Eli pysähtyy, kääntyy ylös ja palaa satamaan noin 2 s ankkurin lopun jälkeen, jokainen askel pehmeä. Vedoksen 7 renderissä sama mittaus antoi +6,8...+8,0 px/ruutu (hunnun liike), eli nousua ei ollut. Kuvan yläosa: -1,0 huipussa.
B (osan aika 127,6-136,4; ankkuri 129,15-130,5, `iskut_t[0]` 129,95), `flow_B.txt`: kuvan yläosa (y 100-450): +0,67; 129,6: 0,0; 130,0: -1,6; **130,4: -2,94 px/ruutu**; 131,4: -1,06; 132,0: 0,0; 132,8: +0,67 (normaali). Vedoksen 7: +3,7...+4,0 (hunnun liike). Kuvan alaosan mittaus ei kelpaa B:ssä: rungon tyvet ja kameran liikkeen ohi virtaava maa hallitsevat korrelaatiota (`flow_B2.txt` näyttää +1,2...+1,9), joten alaosan nostoa B:ssä ei ole mitattu renderistä, vain mallista ja overlay-kuvasta.
Overlay (punainen = aiempi ruutu, vihreä = 6 ruutua myöhemmin; hiutale nousee, kun vihreä on punaisen yläpuolella): `runs/maailma_09/v7b/B_ov2.png`: 128,4 s vihreä alla (putoaa); 130,3 s vihreät punaisten yläpuolella kaikkialla (nousevat); 131,0 s nousee; 132,2 / 133,5 / 135,0 s putoavat taas.
Ruutusarjat (valmiista renderistä, `render/sarja.py`): **`runs/maailma_09/v7b/s_A_1302_1308.png`** (91,0 s alkaen, 0,2 s välein, 12 ruutua), **`runs/maailma_09/v7b/s_B_1329_1334.png`** (128,9 s alkaen, 0,13 s välein, 12 ruutua); lisäksi `s_A.png` (koerender ennen FALL0-muutosta), `A_crop.png`, `A_ov.png`, `B_ov.png`. Ruudut katsottu itse: hunnut ovat poissa, maa ei kirkastu. 480 px:n stilleissä lumi on hyvin himmeää (B:n sininen tila), joten noston näkee luotettavasti vain liike-overlaystä ja virtausmittauksesta, ei yksittäisistä stilleistä.

### T2: `vertaa.py runs/vedos_v7/osat/09.mp4 runs/maailma_09/osa.mp4 691.6 2 <raja>` (`vertaa.txt`)
Raja 2: 13:01,6-13:31,6 (suurin 20,6), 13:33,6-13:35,6 (2,2), 13:39,6-13:43,6 (4,2), 13:49,6-14:03,6 (4,0). Rajoilla 5, 8 ja 12 vain **13:01,6-13:05,6 (20,6)**: A:n hunnun poisto ja nosto (kohdat 1-3). Muut jaksot (alle 5): B:n hunnun poisto ja nosto (13:39,6-13:43,6) sekä lumen pysyvä vaihe-ero A:n ja B:n jälkeen (13:05-13:31, 13:49-14:03), koska nostosiirtymä ei pura itseään. Ennen 13:01,6 ero ei ylitä 2,0:aa. Rungoissa tai valossa ei ole muutosta (kaikki muut jaksot mse alle 5, lumen vaihetta).
### T3: sauma
Ruutu 0: mse vs vedos 7 **0,0000**; viimeinen ruutu (4619): mse **0,0325** (rajakuva, sama suuruusluokka kuin vedosten välillä aiemmin). Sauma ennallaan.

### Vajaaksi jäi / epävarmaa
- Nosto on lumen siirtymä: lumen vaihe on A:n ja B:n jälkeen pysyvästi eri kohdassa kuin vedoksessa 7 (näkyy `vertaa`-tulosteessa 13:05-13:31 ja 13:49-14:03, mse alle 5). Ei korjattu (palautus vaatisi ylimääräisen pudotuksen).
- Nostoa B:n kuvan alaosassa (maan lähellä) ei saatu mitattua renderistä; malli antaa siellä suurimman noston, overlay näyttää nousun, mutta alaosan numeroa ei ole.
- Taitteen sinisessä tilassa lumi on himmeää: yksittäisistä 480 px:n ruuduista nousua ei erota, ohjaajan kannattaa katsoa liike videolta (osan aika 128-133 s ja 90-97 s).
- `FALL0` = 0,10 on ohjaajan päätettävä tulkinta (ks. yllä).
- Hieno pintalunta (4. kerros) on pieni ja himmeä; ruutusarjoissa se ei erotu omana kerroksenaan.
- Kriitikko ei ole katsonut tätä versiota; sway ennallaan (Y1).
- Huomio prosessista: koerenderin keskeytys jätti orpon renderilukon (`build/render.lock`), jonka poistin itse (ei muuta käynnissä olevaa renderiä), kun mikään renderiprosessi ei ollut käynnissä.

### Vedos 7b, korjaus 2 (ohjaajan viesti: puuska ei näy ensikatsomalta; lopullinen renderi `runs/maailma_09/osa.mp4`, 4620 ruutua (ffprobe))
Edellisen version koodi talteen: `runs/maailma_09/v7b/maailma_09_v7b_ensimmainen.js.bak`. Edellä olevat mittaukset (virtaus, ruutusarjat `s_A_1302_1308.png`, `s_B_1329_1334.png`) ovat ensimmäisestä versiosta; voimassa ovat tämän korjauksen luvut.
Muutokset (`visual/maailma_09.js`):
1. **Pintalumi näkyväksi**: uusi `puffAt(p)` piirretään kohtauksen silmukassa ennen lähintä runkoryhmää (z < 13 m), joten lähirungot peittävät sen ja kaukaiset rungot jäävät sen taakse. (a) hienot hiukkaset (`pcell`, solu 1/48 kuvan korkeudesta, jitter 0,7, säde 1,5-2,6 px eli halkaisija noin 3-5 px, satunnainen paikka solun sisällä), määrä A:ssa = hiutaleiden määrä (osuus 0,26 soluista = noin 600 / kuva-alayksikkö, sama kuin hiutaleilla), B:ssä 1,5-kertainen (lisäkerros 0,13); (b) pehmeä runko: fbm-kohina (`bd`), ei reunaa; nousee kuvan alareunasta samassa siirtymäkentässä kuin hiutaleet (`q.y = p.y + uSnow.x*0.8 - disp*0.8`), korkeus = `H` (nostokertymä / loppukertymä) x 0,33 (A) tai 0,50 (B) kuvan korkeutta, oheten ylöspäin (smoothstep), hajoaa verhokäyrän `E` mukana lumen palatessa satamaan. Näkyvä korkeus on noin 0,6 x nimellinen (smoothstep-häntä).
2. **Hiutaleet erottuvat**: koko x(1 + 0,5 E), kirkkaus x(1 + 0,6 E), E = puuskan verhokäyrä (0..1, pehmeä).
3. **Ryöpsähtäen**: A: nousun verhokäyrä 0,62 x u²(3-2u) + 0,55 x sin²-sykäys viimeisellä kolmanneksella (leveys 1,0 s, sykäyksen nousu 0,5 s), netto huipussa 2,2 x FALL0; B: huippu 3,5 x FALL0. Lasku alkaa nousun loppuarvosta (ei epäjatkuvuutta).
4. Kirkkaudet `PUFF` = [runko A 0,10, runko B 0,40, hiukkaset 0,12], säädetty alla olevalla mittarilla. Kehittäjäkytkin `?puff=0` poistaa pintalumen (vertailuun; oletuksena päällä).
**Mittari (alapuoliskon keskikirkkaus, `runs/maailma_09/v7b/kirk.py`, 480 px, koerenderit `koe2_*.mp4` vs `nopuff_*.mp4` samalla koodilla ilman pintalunta)**: A: suhde (kanssa / ilman) 1,000 (3,0 s) -> 1,022 (4,2) -> 1,057 (4,6) -> 1,091 (5,0) -> **1,125 huipussa (5,8 s = teoksen aika 786,3 s)** -> 1,101 (6,4) -> 1,031 (7,2) -> 1,003 (7,8): **+12,5 % (vaatimus >= 8 %)**, nousu 3,2 s ja paluu 2,0 s, ei välähdystä. B: 1,006 (2,8 s) -> 1,048 (3,4) -> 1,124 (4,0) -> **1,163 huipussa (4,4-4,6 s = 822,9-823,1 s)** -> 1,116 (5,0) -> 1,025 (5,6) -> 1,000 (6,2): **+16,3 % (vaatimus >= 15 %)**, nousuaika vähintään 1,3 s (>= 0,5 s). Lopullisesta renderistä (`osa.mp4`, alapuoliskon keskikirkkaus ennen puuskaa -> huippu, sisältää myös muun valon): A 92,0 s 38,4 -> 94,0-94,4 s 47,7 (+24 %), palaa 42,6:een 96,4 s; B 129,0 s 77,7 -> 131,4 s 91,6 (+18 %), palaa 79,8:aan 133,4 s. Ei toistuvaa kuviota: kumpikin puuska on yksi tapahtuma (kaksi tapahtumaa koko moduulissa).
**Ruutumäärä**: 4620 (ffprobe).
**Ruutusarjat valmiista renderistä (joka neljäs ruutu, 320 px, `render/sarja.py`)**: `runs/maailma_09/v7b/s2_A_1302_1308.png` (13:02,5-13:08, ensimmäinen ruutu osan ajassa 90,9 s = 13:02,5; 42 ruutua; huom. sarjan aikaleimat ovat osan aikaa: 1:30,9 = 13:02,5) ja `runs/maailma_09/v7b/s2_B_1340_1345.png` (13:40,3-13:45; osan aika 128,7 s alkaen; 36 ruutua). Täysikokoiset huippuruudut (koerender, sama koodi, 1920x1080): `runs/maailma_09/v7b/A_huippu.png` (786,3 s), `B_huippu.png` (822,9 s), ilman pintalunta `A_huippu_ilman.png`, `B_huippu_ilman.png`. Katsoin ne: A:ssa kuvan alaosaan nousee maasta pehmeä lumipöllähdys ja hienoja hiukkasia, sarjassa rintama etenee vasemmalta oikealle (osan aika 93,0-94,4 s, pöllähdys on selvimmillään alareunassa), ja se hajoaa 95-96,4 s; B:ssä lumipöllähdys nousee kuvan alaosaan vasemmalta oikealle (osan aika 129,9-132 s, selvimmillään 130,4-131,4 s) ja hajoaa 132,2 s mennessä; lähirungot peittävät sen.
**vertaa.py vedosta 7 vastaan (`vertaa2.txt`)**: raja 5: vain **13:01,6-13:07,6 (suurin 31,2)** ja **13:41,6-13:45,6 (suurin 90,7)**, eli kohdat 1-3; raja 2: lisäksi 13:07,6-13:31,6 (lumen vaihe, ks. edellä), 13:33,6-13:35,6 (2,2), 13:39,6-13:41,6 sekä 13:49,6-14:03,6 (3,9): pieniä lumen vaihe-eroja. Sauma: ruutu 0 mse 0,0000; viimeinen ruutu 0,0327 (rajakuva).
**Vajaaksi jäi**: pöllähdyksen näkyvä korkeus on noin 1/5 (A) ja 1/4 (B) kuvan korkeudesta, ei täysi 1/3 ja 1/2 (smoothstep-häntä); kasvatus nostaisi alapuoliskon kirkkautta lisää, joten kirkkaudet pitäisi säätää uudelleen. B:n runko on paikoin läikikäs (fbm), ei ole mitattu "ei kuviota" -mittarilla vaan silmämääräisesti. Hiutaleiden suurennus 1,5 x näkyy lähihiutaleissa pehmeinä isoina pisteinä. Kriitikko ei ole katsonut tätä versiota.

## Vedos 8: bugit ja taika (13.11.2026; brief `runs/vedos_v8/brief.md`, luku 09)
Muutettu vain `visual/maailma_09.js`. Vertailukohta `runs/maailma_09/osa.mp4` (ei ylikirjoitettu), pohja (taika=0, P4 korjattu) `osa_v8_pohja.mp4`, lopullinen (taika=1) `osa_v8.mp4`, kumpikin 4620 ruutua (ffprobe). Kokeet, ruutusarjat ja mittarit: `runs/maailma_09/v8_koe/`. Ennen-versio: `v8_koe/maailma_09_ennen_v8.js.bak`.

### Bugi P4 (13:28-13:33,6): KORJATTU
**Syy (todistettu kuvasta, `v8_koe/p4_ennen_f.png` ja `p4_diag_f.png`):** (1) rungon kovat vaakaportaat ovat `trunkLayer`in latvuspylväs `crownCv`: ehto `yw > 0.4 * H` alkaa täydellä leveydellä (1,6-4,2 m, rungosta leveämpi) yhdellä vaakaviivalla, ja kaistojen aikana pylvään sävy (60 % usvaa) on rungon sävyä (usva x 0,28) vaaleampi. Kun `crownCv` jätettiin pois (diagnostiikkakoe), portaat katosivat. (2) Keskellä oleva suorakulmainen tumma laatikko on horisontin kumpu (`hillM`, reuna smoothstep(0,004), sävy HAMY): tumma ja terävärajainen kirkasta usvaa vasten. Diagnostiikkakokeessa laatikko jäi, joten se on eri syy.
**Korjaus:** `crownCv`: alareuna alkaa pehmeästi (ehto 0,28 H, kerroin smoothstep(0,28 H, 0,62 H, yw)) ja kumpu: reuna 0,055 ja sävy 78 % usvaa (uniformit `uBandK` ja uusi `uHill` = sstep(P-alku, +3 s) P:stä moduulin loppuun). Ilman soft-voimaa (uBandK = uHill = 0, eli ennen P:tä) laskenta on täsmälleen entinen.
**Mittaus** (`portaat.py`: pystygradientin mediaani 21 px vaakasuunnassa, maan yläpuoli, 1920x1080): kova vaakaraja px>3,5 / suurin. 13:30 (osan 118,4 s): ennen 1407 / 16,0, jälkeen 26 / 4,0. 13:31,2 (811,0+): ennen 2213 / 14,5, jälkeen 30 / 4,0. 13:32,6 (121,0 s): ennen 3042 / 17,0, jälkeen 47 / 4,5. 13:33,5 (121,9 s): ennen 3036 / 19,0, jälkeen 0 / 3,0. Liikesarjat `p4_sarja_ennen.png`, `p4_sarja_jalkeen.png` (13:28-13:34, 0,4 s välein): ei portaita eikä laatikkoa. Katsoin ruudut itse.
**Kirkkauden kasvu ja taite säilyvät** (koko ruudun keskikirkkaus, harmaasävy, osa.mp4 -> pohja, `kirk_taika.txt` ja yllä): 13:24: 36,22 -> 36,18; 13:30: 63,74 -> 63,67; 13:32,6: 99,91 -> 99,86; 13:33,5: 106,78 -> 106,83; taite 13:34,4: 38,02 -> 38,11; 13:37: 76,15 -> 76,23. Muutos alle 0,5 %.
**vertaa.py osa.mp4 vastaan osa_v8_pohja.mp4 (raja 2,0, ikkuna 1 s)**, sellaisenaan:
```
runs/maailma_09/osa_v8_pohja.mp4 vastaan runs/maailma_09/osa.mp4: 770 ruutua, 3 muuttunutta jaksoa (raja mse 2.0)
  13:28.6 - 13:34.6   suurin mse 17.7   (osan aika 117-123 s)
  13:37.6 - 13:42.6   suurin mse 2.4   (osan aika 126-131 s)
  13:43.6 - 13:46.6   suurin mse 2.3   (osan aika 132-135 s)
```
Ensimmäinen jakso on P4:n ikkuna. **Päätös, jonka ohjaaja voi kumota:** kaksi jälkimmäistä (mse 2,3-2,4) ovat samojen kahden korjauksen jatke avoimessa sinisessä tilassa: sama tumma kumpulaatikko oli näkyvissä jo `osa.mp4`:n 13:40:ssä (`v8_koe/osa_820.png`) ja latvuspylväiden kovat alareunat vielä 13:50:ssä (`v8_koe/t2_830_f.png`, taika=1-koerender ennen latvuskorjauksen jatkoa); jos korjaus rajataan vain P:hen (briefin ikkuna 13:28-13:33,6), vaihda `const hill = sstep(tPs, tPs + 3, tt)` arvoon `sstep(tPs,tPs+3,tt) * (1 - sstep(tTaite, tTaite + 0.5, tt))`. En rajannut, koska laatikko olisi jäänyt näkyviin 13:34-14:05.
**Sauma:** ruutu 0 mse 0,0000 (pohja ja taika), viimeinen ruutu 0,0376 (pohja) / 0,0358 (taika), rajakuva, samaa suuruusluokkaa kuin aiemmin (0,033).

### Taika T2 ja U1 (`taika=1`): TEHTY
**T2 Tapion talon kuusi ikkunaa** (`WIN`, `winBetween`, uniformit `uWin`, `uWinS`): kaksi kolmen ryhmää (vasen: x -4,0/-6,5/-2,5 m, oikea: +9,5/+13,0/+5,0 m polun keskilinjasta), etäisyydet 90-150 m, korkeudet 3,6-12,1 m, koot 4,4x7,2 m ... 7,2x8,8 m (puolileveys 2,2-3,8, puolikorkeus 2,2-4,4), kuvan korkeudet (dy) .014/.033/.054/.069/.088/.105 eli ei paria samalla korkeudella eikä samankokoisia vierekkäin. Etäisyys kamerasta on vakio (eivät lähesty), sivuasema seuraa polun mutkaa. Väri HOPEA (kylmä), pehmeäreunainen (superellipsi, reuna 0,35-1,25), ei kulta, ei lämmin. Piirto syvyysjärjestyksessä: lähemmät rungot peittävät, ja puolet voimasta kuultaa keskietäisyyden runkojen läpi (kerroin 0,5 / 0,5), joten kuudesta näkyy rungoista riippuen 3-6. **Syttyminen mitatuista aluista** (`d.cues.alut.nuotit`, midi >= 74, kesto >= 0,25 s, väh. 1,2 s välein, taitteen jälkeen): 814,85, 816,10, 817,42, 818,87, 820,62, 822,63 s; 1,4 s pehmeä nousu; kerrotaan avoimen tilan `opn`illä.
**U1 metsänpeitto:** ikkunat sammuvat kaukaisimmasta alkaen (z 150, 140, 126, 110, 96, 90 m) `dim_possibile`sta (825) hiljaisuuteen (845,6): sammumisen alut 827,1 + 2,26 s portain (osuus 0,10 + 0,11 x sija ankkureiden välistä), kukin 2,2 s pehmeästi. Latvojen väli pimenee ylhäältä alas (kerroin 0,20, rintama kuvan ylälaidasta alas, 825,5 -> 842,6) ja usva sulkee aukon keskellä (42 % usvaan, leveä gaussi). `uU1` = sstep(825,5; 842,6).
**Ikkuna ja kirkkaus:** vertaa.py osa_v8_pohja.mp4 vastaan osa_v8.mp4 (raja 2,0), sellaisenaan:
```
runs/maailma_09/osa_v8.mp4 vastaan runs/maailma_09/osa_v8_pohja.mp4: 770 ruutua, 1 muuttunutta jaksoa (raja mse 2.0)
  13:35.6 - 13:50.6   suurin mse 13.1   (osan aika 124-139 s)
```
Ikkunat 13:34,9-13:44 ja sammuminen 13:45-14:03 (mse alle 2 U1:n osalta). Koko ruudun keskikirkkaus pohja -> taika (`kirk_taika.txt`): 13:36,1: 72,47 -> 72,66; 13:40,1: 76,06 -> 76,48; 13:43,1: 91,43 -> 91,86 (+0,5 %); 13:47,1: 69,97 -> 70,48; 13:51,1: 39,17 -> 39,43; 13:55,1: 37,63 -> 37,66; 14:01,1: 28,95 -> 28,40 (-1,9 %); 14:04,8: 25,89 -> 25,47 (-1,6 %). Lisäys <= +0,7 % (raja 10 %), U1 tummentaa korkeintaan 2,4 % (ylälaita 4,6 %). Liikesarjat taika ja pohja rinnakkain: `t2_sarja_osa_v8.png` / `t2_sarja_osa_v8_pohja.png` (13:35,0-13:44, 0,67 s välein) ja `u1_sarja_osa_v8.png` / `u1_sarja_osa_v8_pohja.png` (13:45,4-13:57, 1 s välein). Katsoin ne itse: ikkunat syttyvät yksi kerrallaan polun päähän, kulkevat metsän mukana kaukana, sammuvat portain ja usva sulkee aukon.
**Varjojen metsään (ennen 12:44) ei lisätty mitään; jousten kommentit 12:44-13:01, jousten nousu 13:03, puuskat ja ryöppy, sivutuuli ja paisutukset sekä varjot 11:32 ovat koskemattomia** (vertaa.py: ennen 13:28,6 ei yhtään jaksoa yli 2,0).
**Auki / epävarmaa:** (1) ikkunat ovat kaukana ja pieniä (kuvan korkeudesta 2-4 %): 720p:n puhelimella noin 15-30 px; ne ryhmittyvät polun päähän, koska vain käytävä on runkojen välistä vapaa, ja runkojen peittämät näkyvät himmeinä. (2) Kriitikko ei ole katsonut tätä. (3) Avoimen tilan kumpulaatikon pehmennys ks. yllä.

Ohjaajan säätö 13.11. (taika=1): ikkunat pyöreämmiksi valoaukoiksi (superellipsi 3 → 2,2) ja kolmas ikkuna pystyksi (2,3 × 3,3 m; oli vaakasuora 3,8 × 2,6 m ja näytti mökin ikkunalta). Uusi `osa_v8.mp4` 4620 ruutua; vertaa.py pohja vs taika: 13:35,6–13:50,6 (mse 11,8).
