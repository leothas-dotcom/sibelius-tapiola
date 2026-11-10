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
