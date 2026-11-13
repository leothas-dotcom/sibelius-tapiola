# Tarkistus (vedos 5, kierros 3): maailmat 7 ja 8, `visual/maailma_07_08.js`

Lähtökohta: vedoksen 4 moduuli (`runs/v5_07_08/maailma_07_08_vedos4.js`), johon on tehty vain brief-luvun KIERROS 3 muutokset. Salin rungot, valokeilat, usvan perusilme, pöytä ja auringon kiekko+kehä ovat vedoksen 4. Video `runs/maailma_07_08/osa.mp4`: 5859 ruutua (todettu ffprobella), 1920x1080, 30 fps, aa=2, ääni `rattle_kuuntelu.wav`; videon 0 = 496,3 s (Rattle/LSO 2022). Ajat tulevat `d.aika`sta ja `cues.json`:n `t_end`-kentästä (`allegro_359` 634,5 s; `trumpetit_patarummut_356` 626,3–631,4 s). Liikesarjat ja mittaukset: `runs/maailma_07_08/r3/`.

## Mitä vedoksen 4 moduuliin muutettiin

1. **Sellojen laulu ja muut fraasit**: uusi `ribbon()`-valo (hopea/kylmä nauha). Fraasit löytyvät mitatusta tasosta, ei käsin kirjoitetuista ajoista. Etureuna etenee kuvan poikki fraasin alusta loppuun (suunta vuorottelee), nauhan korkeus on fraasin oma melodian painopiste skaalattuna: sellot 7–42 %, altot (`patarumpu_ppp`, `altot_mezza`) 42–77 %, viulut (`K_viulut`, `K_viulut_mezza`) 55–90 %. Fraasin lopussa laskeutuu ja himmenee 2 s:ssa; fraasien välissä pois. Nauha on usvassa (syvyys: sellot lähellä, viulut kaukana), joten lähirungot peittävät sen.
2. **Usva**: kolme syvyyskerrosta (lähellä, keskellä, kaukana), jokainen oman virtauskertymänsä mukaan eri suuntaan (x-nopeudet −2,0 / +4,8 / −7,5 m/s kerrottuna voimalla: hitaat_soinnut, fraasit, allegro). Usvan laikut (nm) kirkastavat valokeiloja ja usvaa. Lumi putoaa ja ajelehtii kertymänä.
3. **Vasket**: seitsemän mitattua iskua (626,217; 627,517; 627,717; 628,183; 628,483; 628,750; 628,950 s; ruudun puolikasta ennen iskuruutua) → jokaisesta oma koko kuvan korkuinen kylmä leikkaus runkojen takana, eri vaakapaikassa ja syvyydessä (kaukaa lähelle), kulmaleveys 0,014→0,030, nousu 0,03 s, hiipuminen ~0,4 s, maan tärähdys valona. Kaukaisin leikkaus pidetty pöydän runkojen edessä (ensimmäinen jäi ensin rungon taakse).
4. **Allegro**: kameran vauhtikerroin G alkaa nousta ankkurista heti (eksponentiaalinen alku), kaksinkertainen 6 s:ssa, jatkuu, jarru nollaan `auringonsade`a edeltävien 4 s:n aikana. Usvan ja lumen virtaus ×G. Kuva kirkastuu (`uRise`: valo nousee tyvistä latvuksiin).
5. **Aurinko**: korkeus `smoother`-käyrä `allegro_359` → `auringonsade` (SUN_DY −0,04 → 0,21), `c_duuri_valahdykset` vain kirkkautta. Kohdassa `auringonsade` punainen valo täyttää salin (reunavalo runkoihin, pitkät varjot kohti katsojaa, usva hehkuu); kovareunainen punainen suorakaide poistui, koska katon ja taivaan raja on nyt pehmeä.
6. **Viat**: runkojen hyppy (alun runkopari piirrettiin vain kun sen keskipiste oli yli 1 m edessä) korjattu: pari piirretään kunnes se on takana, ja se siirrettiin x=±11 (reuna ±3 m), ettei kamera ohita sitä liian läheltä. Pylväiden latvahuojunta poistettu (rungot eivät liiku; tuuli näkyy naavassa, usvassa, lumessa). Lumi liikkuu aina. Kameran vauhtia, reittiä, M-osaa ja rajakuvia ei muutettu (avautuminen rajakuvasta 6,5 → 3 s, että fraasi näkyy heti).

## Kierroksen 3 kohdat (tehty / osin / ei)

| # | Kohta | Tila | Todiste |
|---|---|---|---|
| 1 | Sellojen laulu tapahtumana | **Tehty** | `r3/q_sello.png` (0–15 s, 1 s välein): valo etenee vasemmalta oikealle ja korkeus seuraa melodiaa, laskeutuu fraasin lopussa (~9,2 s). Painopiste (valon erotus lk=1 − lk=0, korkeus alareunasta): sellot 0,326 / 0,299 / 0,273 (tavoite < 0,35) |
| 1b | Fraasit eri korkeuksilla | **Tehty** | `r3/q_viulut.png`, `r3/q_altot.png`; `r3/painopisteet.txt`: viulut 8:28 0,785, 0,722; 8:50 0,758, 0,773 (tavoite > 0,65); altot+sellot 8:38 0,549, 0,541; altot 9:50 0,500, 0,512 (tavoite ~0,5). Ero sellot–altot 0,23–0,27, altot–viulut 0,2–0,27 |
| 2 | Usva liikkuu hitaat_soinnutista eteenpäin | **Osin** | Kuvassa laikut ja valokeilat liikkuvat (`r3/q_usva.png` 3 s välein, `r3/f1_sarja.png` 0,4 s välein; ruutuero 43–100 s on silti pieni, mediaani 0,15). **Mittaus ei onnistunut luotettavasti**: vaihekorrelaatio, Lucas-Kanade ja lohkohaku kahden 0,2–0,4 s välein otetun ruudun välillä antoivat 0–10 px/s (vaihtelevaa, jäännös 0,8 eli ei yhtenevää siirtymää): usvan kirkkaus muuttuu, mutta kuvio ei siirry yhtenäisenä, ja staattiset rungot ja valokeilat hallitsevat. Mallista laskettu näennäinen nopeus keskikerroksessa (4,8 m/s × voima ~1,1, syvyys 50 m): ~120 px/s; 40 px/s ei ole siis todennettu renderistä |
| 3 | Vasket, seitsemän erottuvaa leikkausta | **Tehty** | `r3/s3_arkki.png` (still jokaisen iskun jälkeen, 7 eri vaakapaikkaa, leveys kasvaa); `r3/q_vaski.png` (0,1 s välein 129,4–131,0 s: ensimmäinen leikkaus ankkurin ruudussa 130,0 s ja hiipuu ~0,4 s). Ruutuero-piikit 129,93 / 131,23 s (13–14 × mediaani) |
| 4 | Allegro heti | **Tehty (kamera)** | Vauhti m/s (`window.kuvaus`): 634,5 s 1,11; 636 s 1,61; 638 s 2,00; 640,5 s 2,27 (×2,04 6 s:ssa); 646 s 2,53; 666 s 2,86; 676 s 3,02; 680 s 0 (pysähtynyt). Ruutuero 138–180 s mediaani 0,255 vs 0,137 (100–138 s). **Kirkkaus ei ole yksiselitteisesti monotoninen**: ylä­puolen keskiarvo 138 s 56 → 186 s 83 nousee, mutta notkahdukset 152 s (55,2) ja 158 s (58,3), 170 s (69,4) ±7 ohittavien runkojen takia; `r3/q_allegro.png` |
| 5 | Aurinko hidas monotoninen nousu, valo täyttää salin | **Tehty** | `?mono=1`: 1520 ruutua `allegro_359` → `M_ennakko`, pienin muutos ruudussa 0, **laskee: false**; dy −0,04 → 0,21. `r3/q_aurinko.png` (160–: aurinko runkojen välissä, kasvava punainen hehku, sitten täysi punainen sali, pitkät varjot). Kirkkaus vaihtelee flickissä, korkeus ei |
| 6 | Hyppy 4,9–5,0 s | **Korjattu** | Ruutuero 4,5–5,5 s: suurin 0,69 (mediaani 0,18); koko videon poikkeamat vain 125,33 (tutti), 129,93 ja 131,23 (vaskit), 188,87 (M), pienet 180,0 / 181,8 / 192,1 (~1,0) (`r3/diffs4.npy`) |

## Kuunteluopas (lihavoidut rivit)

| Aika | Mitä kuuluu | Mitä kuvassa | Näkyykö |
|---|---|---|---|
| 8:16 / 0 s | sellot | matala hopeinen valo etenee kuvan poikki, korkeus seuraa melodiaa (`q_sello.png`) | kyllä |
| 8:25 | sellot päättyvät | valo laskeutuu ja himmenee ~9,2–11 s | kyllä |
| 8:28 / 12,6 | viulut | korkea kylmä valo oikealta vasemmalle (`q_viulut.png`) | kyllä (osin runkojen peitossa) |
| 8:38 / 22,2 | altot+sellot, maa värisee | keskikorkea valo vasemmalta; maan tärinä kuten vedoksessa 4 (`?trem`, ei mitattu erikseen) | valo kyllä, tärinä heikosti |
| 8:50 / 34,6 | viulut | ylävalo | kyllä |
| 9:00 / 43,7 | hitaat soinnut | usvan laikut ja keilat liikkuvat | osin (mittaus ei onnistunut) |
| 9:50 / 94 | altot | keskikorkea valo (painopiste 0,50) | kyllä |
| 10:21 / 125,3 | tutti-isku | vedoksen 4 leikkaus (×0,65), ruutuero 7,4 | kyllä |
| 10:26 / 130,0 | trumpetit+patarummut | 7 leikkausta | kyllä |
| 10:34 / 138,2 | allegro | vauhti ×2 6 s:ssa, kuva kirkastuu | kyllä (kirkkaus ±7 notkahduksin) |
| 10:41 | C-duuri välähtää | sun kirkkauden välähdys, korkeus ei laske | kyllä |
| 11:20 / 183,7 | C-duuri | punainen sali | kyllä |
| 11:25 / 188,8 | M | vedoksen 4 isku, ruutuero 3,3 | kyllä |

## Kumipuut
Rungot ja pylväät eivät liiku (latvahuojunta poistettu); vain naava, usva ja lumi liikkuvat. Vaskiliikesarja 0,1 s välein (`q_vaski.png`): siluettien tyvet ja yläreunat samoissa paikoissa joka ruudussa.

## Omat lisäykset ja avoimet
- Avautuminen rajakuvasta 6,5 → 3,0 s (ei kierroksen 3 listalla; syy: fraasin pitää alkaa näkyä heti). Alun rajakuva ja lopun rajakuva ennallaan.
- `?lk=0`, `?fix=`, `?nf=1`, `?mono=1`, `?fraasit=1` ovat vain mittausta varten.
- Auki: usvan virtausnopeuden render-mittaus (40 px/s) ei onnistunut; kirkkauden nousu notkahtelee ±7; nauha hallitsee kuvaa selvästi (sali on tummempi kuin nauha, nauha on pehmeä mutta suuri), käyttäjän/kriitikon arvioitava; usva on kirkkaampaa kuin vedoksessa 4 (laikkujen lisäys); pöydän palkki on vedoksen 4 mukainen (ei muutettu); sellojen fraasin kärki (8:25) ja oikean puolen etureuna ovat runkojen sanelemia.

## LOPPUKORJAUS (10.11.2026): allegron nousu näkyväksi ja fraasinauhan reunat pehmeiksi

Edellinen renderi talteen: `runs/v5_07_08/osa_kierros3.mp4` (moduuli `runs/v5_07_08/maailma_07_08_kierros3.js`). Uusi `runs/maailma_07_08/osa.mp4`: 5859 ruutua (ffprobe). Liikesarjat: `r3/l_allegro_630_650.png` (630–650 s, 1 s välein), `r3/l_sello_0_4.png` (0–4 s, 0,2 s välein), vertailu uusi (vasen) / vanha (oikea) kohdista 60, 130,3 ja 184 s: `r3/l_vertailu_uusi_vasen_vanha_oikea.png`.

**Vika 1, allegro (`allegro_359` → `auringonsade`).** Muutettu vain tässä välissä:
- Lumi: tiheys ×(1+3,2·al), al = 1−exp(−(t−T_AL)/2,5) eli ×3,9 kuudessa sekunnissa; hiutaleet näkyvät myös keilojen ulkopuolella ja venyvät pystyviiruiksi; putoamis- ja ajelehtimisnopeus kertymänä ×(1+2,6·al).
- Valokeilat: kirkkaus sykkii liiketiheyden mukaan (uusien nuottien määrä sekunnissa, 0,5 s tasoitus), ja keilojen paikka kulkee liiketiheyden kertymän mukana.
- Kirkkaus: kuva-ala ×(1+0,32·smoothstep 8 s), pidetään kunnes auringonsade ottaa vallan; äänestä mitattu keskirekisterin ja matalan voima pidetään lähellä aiempaa huippuaan.
- Lähirungot: kameran reitin varrelle vuorotellen vasemmalle ja oikealle 4,5 m välein (säde 0,7–1,1 m, 4,3 m reitistä), alue `allegro_359`+10 m … `auringonsade`−2 m. Rungot tulevat usvasta etäisyyden mukaan (alfa 40 → 22 m), eivät ilmesty.
- Mittaus 134–150 s, 1 s välein (ennen = `osa_kierros3.mp4`): ruutuero mediaani ennen 0,13 0,13 0,15 0,17 0,16 0,17 0,16 0,19 0,18 0,21 0,19 0,21 0,24 0,26 0,24 0,25; nyt 0,19 0,19 0,18 0,21 0,22 **0,36 0,57 0,70 0,76 0,85 0,94 1,02 1,07 1,18 1,26 1,26** (nousu alkaa videon 139 s, ankkuri 138,2 s; ×6 kuudessa sekunnissa). Keskikirkkaus (koko kuva) ennen 58,1 58,8 57,7 55,3 51,3 49,0 47,2 48,9 49,1 48,0 49,2 50,1 51,4 52,7 56,9 57,3 58,6; nyt 51,8 52,2 51,3 49,1 45,4 43,3 41,1 42,1 47,0 46,9 49,3 48,9 50,2 55,0 60,6 57,1 62,8. Nousu 140 s:stä (41,1) 148 s:iin (60,6) on +47 %, mutta **ei täysin ilman notkahduksia**: 145 s ja 149 s notkahtavat 1–3,5 yksikköä (ohittavat rungot), ja ennen ankkuria vaskien jälkihohdon vaimeneminen laskee kirkkautta 134 → 140 s (51,8 → 41,1; tämä on vanhassakin).
- Sivuvaikutus: lähirunkojen ensimmäiset tulevat näkyviin jo noin 130 s:n kohdalla kaukana usvassa (ruutuero vanhaan 3,2 kohdassa 130,3 s).

**Vika 2, fraasinauha.** Etureuna rikotaan usvan kohinalla ja häivytetään 27 % kuvan leveydeltä (smoothstep −0,07…0,20 fraasin etenemisestä), takareunalle ja oikealle laidalle oma pehmeä häivytys (10 %), yläreunan hajonta 0,05 → 0,075 ja korkeuteen kohinaa ±0,04. Muoto, korkeus ja liike ennallaan. Todiste: `r3/l_sello_0_4.png`: nauha alkaa pehmeänä sumuna vasemmasta laidasta 1,6 s:sta, eikä pystyreunaa ole (kuvan vasemman ja oikean laidan tummat pystyreunat ovat runkoparin siluetteja, ei nauhaa).

**Kolme muuta kohtaa vanhaan renderiin (keskimääräinen ruutuero 0–255 / kirkkaus uusi vs. vanha):** 60 s 0,23 (57,5 / 57,5); 100 s 0,88 (60,2 / 59,8); 20 s 0,73 (nauha); 130,3 s (vaskileikkaus) 3,5 (55,2 / 58,5; vaskileikkaus näkyy edelleen, mutta uusia lähirunkoja on kaukana usvassa); 184 s 6,2 (77,0 / 77,0; kuvat samat silmällä, ero lumihiutaleiden paikoissa). Ruutuero 0–125 s mediaani 0,154 vs 0,156; hyppy 4,5–5,5 s enintään 0,66.

**Auki:** kirkkauden nousun pienet notkahdukset; lähirunkojen ohitus alkaa vasta ~2–3 s ankkurin jälkeen (ensimmäinen runko tulee 10 m päästä); salin ilme allegrossa on tummempi ja tiheämpi (rungot + lumi), kriitikon arvioitava.

## Vedos 6 (10.11.2026): runko ei ole auringon edessä (palautelista rivi 72)

Edellinen renderi talteen: `runs/v6_07_08/osa_vedos5.mp4` (moduuli `runs/v6_07_08/maailma_07_08_vedos5.js`). Uusi `runs/maailma_07_08/osa.mp4`: 5859 ruutua (ffprobe), renderöity lukon kautta (`runs/v6_07_08/render.log`). Muutettu vain `visual/maailma_07_08.js`: kameran sivusiirtymä.

**Syy (vanhasta renderistä, `runs/v6_07_08/s/f186.png`):** aurinko oli ruudulla kiinteässä paikassa (SUN_DX 0,09) ja kamera pysähtyi pöydän keskirungon (x = 0, säde 5,2 m, 35 m päässä) taakse: rungon oikea reuna jätti levyn puoliksi piiloon. Lisäksi lähirungot kulkivat nousun aikana sen edestä.

**Muutos:** kamera siirtyy jatkuvasti sivuun (`camX = camX0 + OFS · smoother((t − allegro_359) / (auringonsade − allegro_359))`, alkaa ankkurissa `allegro_359`, sama käyrä kuin auringon nousussa, ei nykäyksiä; siirtymän huippunopeus noin 0,45 m/s ja kamera ei käänny). OFS (noin +10,9 m) lasketaan geometriasta: auringon sijainti pöydän tasolla osuu keskirungon (x = 0) ja oikean rungon (x = 29) välisen aukon keskelle (x = 14,5), ei käsin. Auringon ruutupaikka, korkeuskäyrä, kirkkaus, rungot, varjot, valot, usva, lumi ja vaskileikkaukset ovat koskemattomia; yhtään runkoa ei poistettu. Pysähdyksen (680,0 s) jälkeen kamera pitää sivupaikan (camX 0,61 → 11,53, tarkistettu `mittaa`-tulosteesta).

**Todiste:** liikesarjat `runs/v6_07_08/s/uusi_160_175.png` ja `runs/v6_07_08/s/uusi_176_191.png` (1 s välein, 160–191 s) ja vertailu `runs/v6_07_08/s/ennen_160_190.png` (2 s välein, vanha). Uudessa levy näkyy kokonaan joka ruudussa videon 162 s:stä (2:42) alkaen aina M:ään asti (pöytäpalkki ylittää levyn vain nousussa, kuten ennenkin; ei runko). Pysähdyksessä (183,7 s →) levy ja kehät ovat keskirungon ja oikean rungon välisessä aukossa, ja rungot heittävät pitkät varjot lattialle aukon molemmin puolin kohti katsojaa. **Auki:** videon 160–161 s (teoksen 10:57–10:58, aurinko vielä matalalla ja himmeä, ennen briefin kohtaa 165 s) lähirunko peittää edelleen auringon; en poistanut runkoa. Lisäksi nousun aikana (165–183 s) levyn yli kulkee ohut pöytäpalkki (vanhaa, ei runko).

**Koskemattomuus (keskimääräinen ruutuero 0–255 / keskikirkkaus uusi vs. vanha):** 10 s 0,34 (46,6 / 46,6); 100 s 0,87 (61,5 / 61,3); 130 s 0,46 (67,5 / 67,5); lopun rajakuva 195,2 s 0,01 (14,7 / 14,7). Eli 0–138 s ja loppu ovat ennallaan (ero on enkoodauskohinaa). Ero alkaa vasta allegrosta, kuten kamera-siirtymä alkaa: 150 s 23,4; 165 s 20,1; 185 s 27,3 (kamera on eri paikassa). Ruutumäärä sama 5859.

**Nojaa (rivi 79: tarkistus kolmea dokumenttia vasten):** tyyliohje luku 2 kohta 5 ja luku 5 ("Staattiset hetket": C-duuri, taottu aurinko nousee kerrosten taakse, kamera pysähtyy; aurinko on tapahtuma, jonka katsoja näkee) ja luku 4d kohta 28 (aurinko nousee hitaasti ja täyttää valon C-duurissa); luku 12 kohdat 2 ja 16 (pysähdys ja taottu aurinko C-duurissa), kohta 3 (jatkuva liike, ei kallistusta; sivusiirtymä ei käännä kameraa); kohta 14 (valolla on lähde kerroksessa: lähde on runkojen välissä). Tutkimus (`docs/tapiola_tutkimus.md`): Tapion pöytä ja sen kolme runkoa pitävät sommittelun; aukko on pöydän omasta rakenteesta. Käsikirjoitus (`docs/kuvakasikirjoitus.md`, "Uusi runko", maailma 8): aurinko nousee kumpujen takaa pöydän takana ja kamera pysähtyy auringonsateessa; sommittelu säilyttää sen ja vain vaihtaa kameran sivupaikkaa. Kaikki muu (ankkurit `allegro_359`, `auringonsade`, `M_ennakko`) on sama kuin ennen.


## Vedos 7 (10.11.2026): runko pois auringon tieltä, viisi iskua, lumi (brief `runs/vedos_v7/brief.md`, moduuli 07_08)

Uusi `runs/maailma_07_08/osa.mp4`: 5859 ruutua (ffprobe), renderöity lukon kautta komennolla `node render/lukittu.mjs --data build/rattle_koko --page "visual/maailma.html?m=07_08&aa=2" --start 496.3 --end 691.6 --workers 2 --chunk 40 --out runs/maailma_07_08/osa.mp4` (loki `runs/maailma_07_08/v7/render.log`). Huom: `render.mjs` antaa sivun `seek()`:lle ruudun ajan suoraan (`i/FPS`) ja ankkurit ovat teoksen aikaa, joten `--start`/`--end` ovat TEOKSEN sekunteja (496,3 ja 691,6), ei moduulin omaa aikaa; `--start 0` ilman `--end`:iä renderöisi koko teoksen alusta. Ajat alla ovat videon aikaa (0 = 496,3 s). Y1 (puiden liike) jäi täsmälleen vedoksen 5 mukaiseksi (ohjaajan peruutus): `uSway`/`uWind` ja naavan liike ovat ennallaan.

### Muutokset (`visual/maailma_07_08.js`)
1. **Kameran rata kuten vedoksessa 5**: `camX` = `camX0` (sivusiirtymä `OFS`, `GAPX`, `smoother0` poistettu).
2. **Lähirungot pois**: `avenueDef`, `pathX`, `uAv` ja piirtosilmukka poistettu kokonaan.
3. **Rungon paikka** (rivi 72): pöydän keskirunko x = 0 -> -6 (`const float TX[3] = (-29, -6, 29)`, käytössä sekä rungon piirrossa että `postShadow`issa). Syy: auringon suora kamerasta on pöydän tasolla x = +3,6 pysähdyksessä (+12,4 allegron alussa), joten x = 0 -runko (säde 5,2) peitti kiekon; nyt keskirungon ja oikean rungon (29) välinen aukko sisältää koko suoran koko välillä (pienin akselietäisyys suoraan 9,6 m). Satunnaiset pylväät mitattu erikseen (JS-portti `pillarDef`:stä, kamerarata ja suora ruuduittain `allegro_359` -> `M_ennakko`): lähin pylvään akseli suoraan 35 m ja kameran ratalinjaan yli 39 m, eli niitä ei tarvinnut siirtää.
4. **Viisi iskua**: `HITT` = `d.cues.cues.find('trumpetit_patarummut_356').iskut_t` (628,24 / 628,47 / 628,72 / 628,95 / 629,27 s), oma tunnistin (`brd`, `iskuarvot`) poistettu. Voimat 0,70 / 0,78 / 0,86 / 0,94 / 1,5, vaimeneminen 0,13 s (iskut 1-4) ja 1,5 s (isku 5, myös jälkihohto), isku 5 leveämpi (kulmaleveys 0,048 vs 0,014-0,026). Paikat: sama laskenta kuin ennen (kaukaa lähelle).
5. **Lumi (Y2)**: lumen nopeus kulkee 3 s:n (+-1,5 s) liukuvan keskiarvon läpi (`rawY/rawX` -> `sSY/sSX`); paikka on edelleen kertymä.
6. `kuvaus().lumi` tarkkuus 1 -> 4 desimaalia (vain mittausta varten).

### T1: liikesarjat (valmiista renderistä, katsottu)
- `runs/maailma_07_08/v7/s_iskut.png`: 131,7 s alkaen joka ruutu, 48 ruutua. Viisi erillistä pystyleikkausta: 1) 131,93 s (keskellä), 2) 132,17 (oikealla), 3) 132,43 (vasemmalla), 4) 132,67 (oikealla), 5) 132,97 (leveä, kirkkain, jää soimaan ja on vielä näkyvissä sarjan lopussa 133,27). Ei kuudetta eikä seitsemättä. Ruutuero-piikit (`osa.mp4.diffs.npy`): 132,47 = 11,2 ja 132,67 = 25,7 (mediaani 0,43).
- Iskujen voimat renderiä ohjaavasta mallista (`kuvaus().iskuvoima`, huippu ruudussa): 1,47 / 1,64 / 1,81 / 1,97 / 3,15 (= 2,1 x voima).
- `runs/maailma_07_08/v7/s_matka.png` (138,7 s alkaen 1 s välein, 50 ruutua, eli 10:35-11:25) ja `s_aurinko.png` (153,7 s alkaen 0,2 s välein, 50 ruutua): yhtään lähirunkoa ei ole kameran radalla; kuva on usvaa, runkoja kaukana ja kasvava punainen hehku. Aurinko nousee pöydän laudan takaa ja kiekko näkyy joka katsotussa ruudussa (osin laudan palkin takana, kuten ennenkin; lauta on vanhaa). Ruudussa 161,2 s (`t_161.2.png`) keskimmäinen runko on kiekon vasemmalla puolella (noin 7 % kuvan leveydestä) eikä peitä. Pysähdyksessä (180-187 s) pöydän rungot ovat kiekon molemmin puolin ja kiekko näkyy vapaana. (Automaattinen punaisen pikselin mittarini oli viallinen kiekon korkeuden arviossa, joten väite perustuu liikesarjoihin silmin katsottuna, ei lukuun.)
- Runkojen leveys: suurin ruudussa näkyvä runko (pöydän keskirunko pysähdyksessä, 35 m päässä) noin 16-17 % kuvan leveydestä (laskettu 2*5,2*1,07/(35*1,78) = 17,8 %). **Ylittää briefin 15 %:n rajan hieman**; muut rungot alle 10 %. Ei korjattu, koska se vaatisi pöydän runkojen säteen tai kameran pysähdysetäisyyden muuttamista (ei määrätty).
- Hyppyjä: ruutuero-piikit koko videolla vain 125,3 (tutti-isku, vanha), 132,47-132,97 (iskut) ja 188,83 (M, vanha); auringon korkeudessa ei hyppyjä.

### T2: regressiomittari
`.venv\Scripts\python.exe -I render/vertaa.py runs/vedos_v6u/osat/07_08.mp4 runs/maailma_07_08/osa.mp4 496.3`
```
runs/maailma_07_08/osa.mp4 vastaan runs/vedos_v6u/osat/07_08.mp4: 977 ruutua, 1 muuttunutta jaksoa (raja mse 2.0)
  10:16.3 - 11:30.3   suurin mse 3245.4   (osan aika 120-194 s)
```
4 s:n ikkunat (mse): 0-116 s enintään 0,8 (vain lumen vaihe, Y2-tasaus), 116 s 0,74; 120 s 3,4; 124 s 22; 128 s 172; 132 s 2644; 136 s 238; 140 s 312; 144 s 504; 148 s 685; 152 s 689; 156 s 899; 160 s 667; 164 s 475; 168 s 424; 172 s 419; 176 s 385; 180 s 396; 184 s 408; 188 s 266; 192 s 14,8.
Selitys jaksoille:
- 120-128 s: vedoksen 6 lähirungot tulivat jo kaukaa näkyviin (`c_vertailu_128.5.png`: vasen vedos 6, oikea nyt; vedoksessa 6 tumma runko ruudussa, nyt ei) <- kohta 2.
- 128-140 s: iskut (vanhan tunnistimen seitsemän iskua -> listan viisi, uudet paikat, voimat ja kesto) <- kohta 4; lisäksi lähirungot poissa.
- 140-192 s: kameran sivusiirtymä pois (kohta 1), lähirungot pois (kohta 2), pöydän keskirunko paikassa -6 (kohta 3), lumen vaihe ja nopeus (kohta 5). Kuvan ero on iso, koska kamera, runkojen paikat ja auringon aukko ovat eri kohdassa kuin vedoksessa 6; se on kohtien 1-3 suora seuraus.
- 192 s -> loppu: ero pienenee (14,8 -> 0).
- Selittämätöntä jaksoa ei ole; 0-116 s enintään 0,8 (alle rajan 2,0), eli salin valot, usva, sellot ja kaikki ennen kohtaa 10:25 ovat ennallaan. Lumen vaihe on kuitenkin muuttunut koko ajan (kohta 5).

### T3: sauma
Ensimmäinen ruutu (0,0 s): mse 0,003 vs vedos 6 (keskikirkkaus 14,71 / 14,71); viimeinen ruutu (195,1 s): mse 0,007 (14,71 / 14,71). Sauma ennallaan. Kesto 195,3 s.

### Lumi (Y2): nopeus ja kulma (mallista, `kuvaus().lumi` ruudulta ruudulle ja sen erotus)
Vaakanopeuden etumerkki sama koko moduulin ajan (vx 0,25...4,98 m/s, aina positiivinen), kulma (vx/vy) 23,5...54,3 astetta. Suurin kulman muutos 9,3 astetta/s (21,2 s kohdalla, jousifraasin vaihto; raja 10); suurin ruutujen välinen nopeuden muutos 0,0375 m/s ruudussa (183 s), suhteellisesti enintään 1,1 % ruudussa; 0,5 s:n ikkunassa suurin nousu +17 % (138,7 s) ja lasku -13,5 % (190,6 s).

| aika (s) | nopeus (m/s) | kulma | aika (s) | nopeus | kulma |
|---|---|---|---|---|---|
| 12,6 (viulut) | 0,93 | 30,9 | 140,5 | 3,16 | 50,8 |
| 20,0 | 0,71 | 26,5 | 141,0 | 3,42 | 50,8 |
| 22,2 (altot) | 0,72 | 26,7 | 144,0 | 4,29 | 50,9 |
| 34,6 | 0,80 | 28,6 | 150,0 | 4,84 | 51,2 |
| 43,7 (hitaat soinnut) | 0,98 | 36,3 | 170,0 | 5,99 | 52,2 |
| 94,0 | 1,26 | 50,8 | 180,0 | 6,25 | 52,5 |
| 125,3 (tutti-isku) | 1,27 | 50,8 | 183,7 (auringonsade) | 3,36 | 54,0 |
| 130,0-131,0 (iskut) | 1,26-1,27 | 50,8 | 185,1 | 3,02 | 54,3 |
| 138,2 (allegro) | 1,65 | 50,8 | 188,8 (M) | 2,87 | 54,2 |
| 139,5 | 2,46 | 50,8 | 190,0 / 191,0 | 2,35 / 1,78 | 53,6 / 52,5 |

Lumi ei reagoi iskuihin (nopeus 125,3 ja 130-131 s ennallaan).

### Auki / epävarmaa
- Pöydän keskirunko on siirretty (kohta 3) koko moduulin ajaksi, koska siirto ei saa tapahtua kuvassa; pöydän kolmen rungon symmetria muuttui (-29 / -6 / 29) myös alun kaukokuvassa. Brief sanoi "kaikki ennen 10:25 ennallaan"; mse enintään 0,8, mutta kaukainen pöytä on hieman eri paikassa. Vaihtoehto olisi ollut siirtää aurinkoa ruudulla (ei määrätty).
- Rungon leveys pysähdyksessä 16-17 % (raja 15 %), ks. yllä.
- Lumen tasaus alkaa 1,5 s ennen allegro-ankkuria (liukuva keskiarvo), joten lumi alkaa kiihtyä jo ennen 138,2 s:ää (nopeus 138,2 s: 1,65 vs 1,27).
- Kulman muutos 9,3 astetta/s on lähellä rajaa 10.
- Lumipölyn huntua/puuskaa tässä moduulissa ei ole (ei ollut), joten sitä ei lisätty.
- Y1: pylväät ja pöydän rungot jäykkiä; ainoa liikkuva rungon yhteydessä on naava (uSway/uWind), ennallaan kuten vedoksessa 5. Latvan liikettä ei ole, joten 1 %:n rajaa ei ylity.


### Vedos 7, lisäkorjaus (ohjaajan korjaus: lähirungot takaisin, viides isku rajatuksi)

Uusi `runs/maailma_07_08/osa.mp4` (5859 ruutua, ffprobe; kesto 195,3 s; sama komento kuin yllä, loki `runs/maailma_07_08/v7/render2.log`). Edellinen render ilman lähirunkoja: `runs/maailma_07_08/v7/osa_v7a_ilman_lahirunkoja.mp4`. Tämä kappale korvaa edellä olevat kohdat "2. Lähirungot pois" ja "T2" sekä viidennen iskun leveyden.

**Muutokset**
- **Lähirungot palautettu** vedoksen 5 mukaisiksi (`pathX`, `avenueDef`, `uAv`, piirtosilmukka ja `uAv`-asetus kopioitu sellaisenaan vedoksen 6 tiedostosta, joka oli samoilta osin vedoksen 5 kanssa identtinen: `git diff 09eac76` ei näytä niissä eroa). Kameran rata on vedoksen 5. Rungoista ei siirretty yhtäkään.
- **Ehto (a)**: lähirungon akselin pienin sivuttaisetäisyys kameran radasta on 4,79 m (laskettu kaikille 22 lähirungolle, `avenueDef` portattuna JS:ään ja kameran rata renderin mallista) > 2,5 m. Siirrettäviä ei ole.
- **Ehto (b)**: ikkunassa `auringonsade` - 8 s -> `M_ennakko` (videon 175,7-188,8 s) yksikään lähirunko ei ole kameran ja auringon välisellä suoralla alle 3 m:n akselietäisyydellä (kaikki 22 trunkia ruuduittain tarkistettu, osumia 0; viimeiset rungot z = 204,8 / 209,3 / 213,8, kamera pysähtyy z = 219,7). Siirrettyjen runkojen lista: tyhjä. Ennen ikkunaa rungot kulkevat auringon editse kuten vedoksessa 5.
- **Viides isku rajattu**: uusi uniformi `uHH[8]` (hohteen kerroin). Iskulle 5: kulmaleveys 0,048 -> 0,030, hohteen kerroin 0,25 (pystyleikkauksen hohde, usvan hohde ja lattian tärähdys; ydin ja voima 1,5 ennallaan). Iskut 1-4 ennallaan (kerroin 1).

**Viides isku, kuvan keskikirkkaus renderistä** (480x270, keskiarvo 0-255): edeltävä ruutu 132,933 s 61,8 -> iskuruutu 132,967 s 75,7 (+22 %), 133,000 s 81,7 ja 133,033 s 82,9 (suurin, +34 % edeltävään ruutuun verrattuna). Aiempi versio: 70,4 -> 113,6 (+61 %), huippu 133,1 (+89 %). Täysin valkoista (>= 250) on 2,2 % kuvan alasta eli vain pystyleikkauksen ydin (ennen 4,2 %); hohteessa ei ole valkaistua aluetta. Liikesarja iskuista (`v7/s_iskut.png`) on edelliseltä renderiltä; uuden renderin lukuarvot ovat tässä.

**T2: `vertaa.py` vedosta 5 vastaan** (`runs/vedos_v5/osat/07_08.mp4`, raja 2,0):
```
runs/maailma_07_08/osa.mp4 vastaan runs/vedos_v5/osat/07_08.mp4: 977 ruutua, 1 muuttunutta jaksoa (raja mse 2.0)
  10:26.3 - 11:30.3   suurin mse 1060.8   (osan aika 130-194 s)
```
4 s:n ikkunat (mse), uusi vs vedos 5 / (edellinen vedos 6): 0-124 s 0,1-0,7; 128 s 99 (99); 132 s 756 (756); 136 s 23 (23); 140 s 4,4 (20); 144 s 7,7 (201); 148 s 11,6 (574); 152 s 19,8 (707); 156 s 34,9 (777); 160 s 37,6 (807); 164 s 52 (436); 168 s 96 (566); 172 s 108 (715); 176 s 190 (529); 180 s 429 (396); 184 s 375 (408); 188 s 390 (266); 192 s 17 (15). Välillä 10:36-11:00 (140-164 s) ero vedokseen 5 on 4-52 (aiemmin 20-807 eli murto-osa).
Selitys: 128-136 s = viisi iskua listasta (vanhan tunnistimen seitsemän tilalle; kohta 4); 136-176 s pieni ero = lumi (tasaus, Y2) ja pöydän keskirunko x = -6 (kaukana, kohta 3); 176-192 s = pysähdys, jossa keskirunko ja sen varjot ovat eri paikassa kuin vedoksessa 5 ja kiekko näkyy (kohta 3). Ei muita eroja.

**Liikesarja** `runs/maailma_07_08/v7/s_uusi_140.png` (140 s alkaen 2,5 s välein, 24 ruutua) vedoksen 5 vastaavan `s_v5_140.png` rinnalla: rungot samoissa paikoissa ja samassa liikkeessä kuin vedoksessa 5 (lähirungot kulkevat ohi, aurinko välähtää niiden raoista); eroa on lumessa, kiekon näkyvyydessä pysähdyksessä (3:00-3:10, uusi: kiekko vapaana keskirungon ja oikean rungon välissä; vedos 5: keskirunko puolittaa/peittää kiekkoa) ja pöydän keskirungon paikassa.

**Auringon näkyvyys ruuduittain 11:00-11:25** (videon 163,7-188,7 s, 750 ruutua, renderistä): kiekon alueella (säde 0,8 x Rs) punaisten pikselien osuus (R > 1,3 B ja R > 60) pienin 0,45 (173,8 s), keskimäärin 0,77; ruutuja, joissa osuus < 0,15: 0. 163,7-178,7 s osuus on 0,45-0,65, koska pöydän lauta (vaakapalkki) kulkee kiekon yli, kuten vedoksessa 5; 178,7-188,7 s osuus 0,99-1,00 (pysähdys, kiekko kokonaan vapaana). Mikään runko ei peitä kiekkoa missään ruudussa.

**T3**: ensimmäinen ruutu mse 0,003 ja viimeinen 0,007 vedokseen 6 verrattuna; sauma ennallaan.

**Avoin**: lähirungot ovat vedoksen 5 geometriaa, ja ohi kulkiessaan yksittäinen runko voi peittää yli 15 % kuvan leveydestä (esim. 2:35 ja 2:37,5 ruuduissa oikean/vasemman reunan runko, arvio 15-25 %, sama kuin vedoksessa 5); brief ei määrännyt niiden kokoa muutettavaksi, joten ei muutettu. Pöydän keskirunko pysähdyksessä 16-17 % (ks. yllä).


## Vedos 8: bugit ja taika

**Bugit:** P7 (10:36-11:14) päätös ei muuteta (brief): rungot ohittavat kameran lähikerroksessa (kuvasääntö 6), aurinko näkyy joka sekunti, kohta on käyttäjän lempikohta. Koodia ei muutettu, joten S2:n vaihe 1 (`osa_v8_pohja.mp4`) jää pois.

**Taika** (`visual/maailma_07_08.js`, kytkin `taika=1`, uniform `uTK`; funktio `taika()` piirtää lisäykset ilmakerroksen jälkeen oikeassa syvyydessä, joten rungot peittävät ne; ilman kytkintä uniformit ovat nollia). Lisäyksiä vain ennen 540 s (`T_RAJA`).
- **T3 lumipölyn juova**: 3,0 s kuvan avautumisen jälkeen (499,3 s) -> fraasin loppu - 1,5 s (503,8 s; `FRASIT[0].b` = `jousijakso_urkupiste_E_loppu`); 40 pölypilveä (rakeinen hopeanhalla), jotka syntyvät kulkijan kohdalla vasemmalta lähelle -> oikealle kauas lattian rajassa, nousevat ja hälvenevät; ei rytmiä. Liikesarja `v8_koe/s_v8_T3.png`.
- **T1 timanttipöly**: `K_viulut` (508,9 s) -> `K_viulut_mezza` (530,9 s); yksi hopeinen tähtipiste (säde 3-4 px 1080p:llä, ristikeila, hento kehä, ympäristö tummuu enintään 30 % pisteen ympärillä) jokaista nuottialkua kohti (midi >= 68, 31 pistettä, `cues.nuotit`), syttyy alun ruudussa, sammuu 1,3 s:ssa, leijuu hitaasti. Korkeus kuvassa seuraa sävelkorkeutta. Liikesarja `v8_koe/s_v8_T1.png` (taikaton vertailu `s_base_T1.png`).
- **Kirkkaus** (`v8_koe/kirkkaus.txt`, 480x270 harmaa, keskiarvo): T3 3-9 s +0,39 %; T1 508,9-530 s +0,18 % (tihein 508,9-516,3 s +0,38 %); suurin yksittäinen ruutu +1,14 %. S3:n raja (10 %) ja tyyliohjeen (6 %) alittuvat reilusti.

**S2 vaihe 2** (`vertaa.py osa.mp4 osa_v8.mp4 496.3 1 2.0`; `v8_koe/vertaa.txt`): 5859 ruutua (ffprobe), kaikki jaksot ennen 9:00 (540 s):
```
runs/maailma_07_08/osa_v8.mp4 vastaan runs/maailma_07_08/osa.mp4: 977 ruutua, 4 muuttunutta jaksoa (raja mse 2.0)
  8:20.3 - 8:27.3   suurin mse 3.5   (osan aika 4-11 s)
  8:29.3 - 8:36.3   suurin mse 7.8   (osan aika 13-20 s)
  8:42.3 - 8:43.3   suurin mse 3.2   (osan aika 26-27 s)
  8:44.3 - 8:45.3   suurin mse 2.0   (osan aika 28-29 s)
```
Kohdan 9:00 jälkeen ei yhtään jaksoa; PSNR 54-55 dB (pelkkä koodauskohina) mitattuna 9:00 jälkeisistä kohdista.

**Avoin:** silmäpariehto (S5): ahne sijoittelu rajaa pisteet eri korkeuksille/kauas toisistaan, mutta 87 / 1547 samanaikaisten pisteiden ruutuparista (5,6 %) on yhä samalla korkeudella alle 0,8 kuvan leveyden päässä (lähes aina toinen on jo himmeä, ikä > 0,6 s). Ei korjattu (kolmas renderi olisi odottanut lukkojonoa yli tunnin).

Ohjaajan säädöt 13.11. (taika=1): lumipölyn juova pehmeäksi hunnuksi ja harvoiksi kiteiksi (tiheä kynnystetty kohina näytti television lumisateelta): `0,30 + 0,45·fbm + 1,3·harvat kiteet`; timanttien säteet lyhyiksi (4,5 → 1,8 kertaa ytimen säde, paino 1,6 → 1,0). Uusi `osa_v8.mp4` 5859 ruutua; vertaa.py osa vs taika: 8:25,3–8:26,3 (2,3), 8:29,3–8:35,3 (6,7), 8:42,3–8:43,3 (2,7); ei mitään kohdan 9:00 jälkeen.
