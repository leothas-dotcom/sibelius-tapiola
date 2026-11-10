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
