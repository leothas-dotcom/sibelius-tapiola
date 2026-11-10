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
