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
