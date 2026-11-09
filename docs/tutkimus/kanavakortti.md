# Kanavakortti

*Soitin → mitattu kanava → tulos varmassa kohdassa → luotettavuus → korvaava lähde. Kanava on käytössä kuvan
ajoitukseen vasta, kun rivillä on ✅ ja käyttäjä on kuullut otteen. Mittaukset: `docs/tutkimus/vaihe1_raportti.md`,
pöytäkirja `build/testi60/poytakirja_0000-0060.md`. Ajat ovat kuuntelukopion aikaa (`build/kuuntelu/tapiola_kuuntelu.wav`).*

Tila 1.11.2026: vain 0–60 s mitattu (V1–V3). V4–V8 mittaamatta.

**Käyttäjän korvahavainnot otteesta 0–60 s (1.11.2026, käyttäjän sanat):**
- 1,6 s: "nopea patarumputremolo. Tututum." → V1 ✅ kuultu. Huom: käyttäjä kuulee tremolon, aksentit löysi kolme
  iskua 1,61 / 1,79 / 1,88 s. Tremolokanavan pitäisi näyttää tämä; se ei näyttänyt.
- 4,6–5,2 s: "Jouset, taustalla vasket." → V2 ✅ kuultu. **Vaskikanavan nousu 3–6 s (0,18–0,32) ei ollutkaan
  väärä positiivinen**: vasket ovat jousten alla. Perhekanavat eivät silti erottele, koska ne nousevat yhtä aikaa.
- "Tässä nousee ja laskee vaskia ja puhaltajia jousten alta. Äänitys on huono, tai sitten työkalut ei toimi."
  → Testataan modernilla äänityksellä (kalibrointi, ei totuus).

| Soitin / ilmiö | Kanava | Varma kohta | Mitattu | Luotettavuus | Korvaava lähde |
|---|---|---|---|---|---|
| Patarummut, lyönnit | `aksentit` (10 ms) | V1 avaus | iskut 1,61 / 1,79 / 1,88 s, z 14 ja 12 | ✅ käyttäjä kuuli: patarumputremolo 1,6 s | partituuri + spektrogrammi |
| Patarummut, läsnäolo | `patarumpu_matala` (50–200 Hz iskuvoima) | V1 | huippu 1,60 s (arvo 1,00) | 🔶 näyttää V1:n, **ei selektiivinen** (mediaani 0,10, p95 0,68): reagoi kaikkiin matalan kaistan alkuihin | aksentit + partituuri |
| Patarummut, Demucs | `patarumpu_stemmi` (drums-stemmi) | V1 | 0,00 koko avauksessa | ❌ **kuollut**: Demucs laittaa patarummut other-stemmiin | ei käytetä |
| Patarummut, tremolo | `patarumpu_tremolo` | ei varmaa kohtaa 60 s:ssa | antaa 1 kohdissa, joissa aksentit ei löydä tremoloa | ❌ epäluotettava | aksentit.py:n tremolo + partituuri |
| PANNs timpani | `listen` timpani-luokka | V1 | huippu 1,93 s, arvo 0,16 | 🔶 heikko ja myöhässä (ikkuna) | aksentit |
| Jouset | `jouset` (perhekanava) | V2 jousten tulo | nousee 2,9–3,0 s yhtä aikaa puhaltimien ja vaskien kanssa (yhteinen other-stemmi) | ❌ ei erottele V2:ta | PANNs jouset (alla) + partituuri |
| Jouset | PANNs jousiluokat | V2 | yli 0,10 vasta 4,63 s, yli 0,20 vasta 5,23 s, huippu 5,13 s | ✅ käyttäjä kuuli jouset 4,6–5,2 s; kanava heikko (0,01–0,08 raaka) ja hidas | partituuri + käyttäjän korva |
| Puupuhaltimet | `puupuhaltimet` (perhekanava) | V3 puhaltimien tulo | yli 0,15 vasta 16,17 s; kuvassa selvä huippu 17–19 s ja 28–31 s | 🔶 näyttää V3:n myöhässä; ei erota avauksessa | PANNs clarinet 16,97 s, wind 18,27 s |
| Vasket | `vasket` (perhekanava) | V2: käyttäjä kuulee vasket jousten taustalla 4,6–5,2 s | 0,18–0,32 välillä 3–6,5 s | 🔶 ei väärä positiivinen, mutta ei erottele jousista (nousee samaan aikaan) | V4 mitataan |
| Jousitremolo | `jousitremolo` | V7 ei pätkässä | yli 0,2 vain iskujen kohdalla (13,0 s, 54,2 s) | ❌ herkkä transienteille; V7 mittaamatta | aksentit + spektrogrammi |
| Urkupiste | `urkupiste` (bass-CREPE > 4 s) | ei pätkässä | ei löytynyt | ⬜ testaamatta | – |
| Liiketiheys | `liiketiheys` | V5 ei pätkässä | 0–16 alkua/s | ⬜ testaamatta | – |
| Sävellaji | `vihje_*` (chroma) | V6, V8 ei pätkässä | 0–35 s "As-molli", 45–60 s "h-molli" | ⬜ vain vihje; avauksen sävellaji tarkistettava partituurista | partituuri |
| Vire | `vire.py` (CREPE, pitkät sävelet) | avaus 0–60 s | +7,8 c A=440:stä (14 säveltä, hajonta 4,9 c), pitkät sävelet As3, As4, D3 | 🔶 mitattu modulo puolisävelaskel; ei korjattu | käyttäjän päätös |

## Huomiot mittauksista
- Tiedosto alkaa 1,6 s digitaalisella hiljaisuudella (−72 dBFS) ja tauko 47,5–50,5 s on −70 dBFS, selvästi
  hiljaisempi kuin levyn rahina musiikin alla. Siirto on todennäköisesti kohinaportitettu tai editoitu
  hiljaisissa kohdissa [tarkista kuulemalla]. Hiljaisin ikkuna 49,6–50,6 s on tämän tauon sisällä.
- Kellot: kaikki johdetut äänet 0,00 ms kuuntelukopiota vasten; kuuntelukopio 0,00 ms lähteen suoraa dekoodausta
  vasten. mp3:ssa ei LAME-otsikkoa, joten dekoodausviive on sama kaikissa eikä sitä korjata.
- 2,4–4,5 s: mikään perhekanava ei tunnista, mitä soi. Käyttäjän korva ja partituuri.

## Mitä kuuntelupöytäkirja osaa nyt ja mitä ei
- Osaa: iskut 10 ms (patarumpu), voimakkuus, liiketiheys, hiljaisuudet, karkea perhevihje PANNsista, spektrogrammi.
- Ei osaa: erottaa jousia, puupuhaltimia ja vaskia hetken tarkkuudella Demucs-stemmien kautta (orkesteri on yksi
  "other"). Tähän tarvitaan toinen ote: perhekanavat spektristä (kaistat, harmonisuus, attakki) eikä stemmeistä,
  tai PANNs lyhyemmällä ikkunalla. Päätetään, kun käyttäjä on kuullut otteen ja sanonut, mitä hän kuulee missäkin.

## Vertailu moderniin äänitykseen (1.11.2026): äänitys vai työkalut?

Käyttäjä: "Äänitys on huono, tai sitten työkalut ei toimi. Kokeillaan jotain modernia äänitystä."
Vertailuäänitys: Rattle / LSO 2022, LSO:n YouTube-kanava (gkX-Uc0e3TQ), 17:58, opus 48 kHz →
`audio/vertailu/rattle_lso_2022_44k.wav` (ei gitissä). **Vain kalibrointiin.** Se ei ole aikojen totuus eikä
sitä käytetä videossa. Sama putki, 60 s, paketti `build/vertailu60`, pöytäkirja `build/vertailu60/poytakirja_0000-0060.md`.

| Kohta | Kajanus 1932 (totuus) | Rattle 2022 (vertailu) |
|---|---|---|
| V1 patarumpu | iskut 1,61 / 1,79 / 1,88 s; matala kanava 1,00; drums-stemmi 0 | iskut 7,64 / 7,72 / 7,83 s (z 5–10); matala kanava 1,00; drums-stemmi 0 |
| V2 jouset | PANNs-jouset 0,10–0,20 vasta 4,6–5,2 s; perhekanava ei erotu | **jouset 0,75–0,85 jo 11,5–12,5 s**, selvä huippu |
| vasket jousten alta | 0,18–0,32, nousee yhtä aikaa jousten kanssa | **vasket 0,45–0,60 kohdassa 13–15 s**, nousevat jousten jälkeen ja laskevat; toinen nousu 17–18 s |
| V3 puupuhaltimet | 0,15 vasta 16 s; huiput 17–19 ja 28–31 s | **0,8 kohdassa 27–29 s ja 34–38 s**, selvät huiput |
| Tutti-isku | – | 45,34 s z 32 (kaistat 8,5 / 22,9 / 68,6) |

**Päätelmä:** työkalut toimivat modernilla äänityksellä: jouset, vasket ja puupuhaltimet erottuvat ja "vaskia nousee
ja laskee jousten alta" näkyy kanavissa. Vuoden 1932 äänityksessä kaistanleveys ja rahina tekevät Demucsin ja
PANNsin perhekanavista erottelemattomia. **Ongelma on äänitys, ei menetelmä.** Patarummut menevät molemmissa
other-stemmiin, joten drums-stemmi on kuollut yleisesti; matala kanava ja aksentit toimivat molemmissa.

**Ehdotettu korvaava lähde (vaihe 4):** vertailukartta. Kohdistetaan Rattle-äänitys Kajanus-kuuntelukopioon
ajan suhteen (DTW chroma- ja onset-piirteillä), ja siirretään modernin äänityksen soitinkanavat (kuka soittaa)
Kajanuksen aikaan. Hetken tarkkuus tulee Kajanuksen omista iskuista ja jaksorajoista (10 ms / ±0,5 s), soittimen
tunnistus modernista. Varmistus: V1 7,64 s → 1,61 s, V2 ja V3 samoin. Tahtinumeroita tämä ei anna.

## Rattle 2022, koko teos (työäänitys, 1.11.2026)

*Soitin → kanava → varma kohta → mitattu → luotettavuus → korvaava lähde. Äänitys: Rattle / LSO 2022, kuuntelukopio `build/kuuntelu/rattle_kuuntelu.wav`
(1078,016 s), paketti `build/rattle_koko` (koko teos yhtenä pakettina). Ajat ovat kuuntelukopion aikaa tiedoston alusta (digitaalinen hiljaisuus mukaan
lukien). Mittaukset ja ehdokasajat: `docs/tutkimus/vaihe3_4_raportti.md`, `build/rattle_koko/varmat_kohdat.md`, pöytäkirjat `build/rattle_koko/poytakirja_*.md`.
**Yhtään V-kohtaa ei ole kuultu: kaikki ajat ovat varmuudeltaan "analyysi"**, joten ✅ ei ole yhdelläkään rivillä. 🔶 = mitattu, ei kuultu; ❌ = ei toimi.*

V-kohtien ehdokasajat (analyysi, ei kuultu): V1 7,68 s · V2 8,93 s · V3 26,4 s (vaihtoehto: vaski/käyrätorvet 13,1 s) · V4 45,33 s · V5 383,0 s (heikko; muut 282–290 s, 349–357 s) ·
V6 680,0–685,1 s (muu ehdokas 641,6–645,1 s) · V7 685,1 s · V8 1025,5–1051,4 s (musiikki loppuu 1051,6 s; digitaalinen hiljaisuus alkaa 1057,995 s).

| Soitin / ilmiö | Kanava | Varma kohta | Mitattu | Luotettavuus | Korvaava lähde |
|---|---|---|---|---|---|
| Patarummut, lyönnit | `aksentit` (10 ms) | V1 | ensimmäinen ääni 7,675 s (5 ms RMS > kohina + 20 dB); iskut 7,73 s (z 12,0) ja 7,83 s (z 10,9); drums-stemmin lyönnit 7,81 / 7,88 / 7,97 s | 🔶 mitattu, ei kuultu | partituuri + spektrogrammi |
| Patarummut, läsnäolo | `patarumpu_matala` (50–200 Hz) | V1 | huippu 7,67 s (1,00). Koko teoksessa mediaani 0,08, p95 0,36, yli 0,5 ruuduista 1,7 %; V8:ssa (patarumpu 0) jopa 0,48 | 🔶 näyttää V1:n, **ei selektiivinen** (reagoi kaikkiin matalan kaistan alkuihin) | aksentit + PANNs patarumpu |
| Patarummut, Demucs | `patarumpu_stemmi` | V1 | **0,00 V1:ssä**. Koko teoksessa yli 0,3 vain 685,17–685,60 s (huippu 0,80, V7:n tutti-isku) | ❌ kuollut V1:ssä (kuten Kajanuksella); herää vain yhdessä tutti-iskussa | ei käytetä |
| Patarummut, tremolo | `patarumpu_tremolo` | ei varmaa tremolokohtaa | 0 V1:ssä; 1 vain 19 lyhyessä pätkässä (42,4–956,3 s); `aksentit.py` löytää yhden tremolon 247,05–247,65 s | ❌ epäluotettava | aksentit.py:n tremolo + partituuri |
| Patarummut, PANNs | `soitin_timpani` | V1 | huippu 7,70 s (0,177); yli 0,05 vain 12 jaksossa koko teoksessa, ensimmäinen 7,37–8,63 s; laskee alle 0,02:n 8,68 s | 🔶 heikko mutta oikeassa kohdassa | aksentit |
| Jouset (perhe) | `jouset` | V2 | tason nousu +5,8 dB kohdassa 8,93 s (heti patarumpusoolon jälkeen), kanava vasta 0,03 tuolloin, 0,3 kohdassa 11,4 s, huippu 0,68 kohdassa 12,2 s | 🔶 kanava jää 2,5–3 s jäljelle tason ja spektrin muutoksesta | taso + spektrogrammi, partituuri |
| Viulut | `soitin_violin_fiddle` | V2 | yli 0,05 kohdassa 11,5 s, huippu V2:ssa 0,24 (11,9 s); koko teoksessa suurin 0,715 (12:10,9), yli 0,05 ruuduista 24,8 % | 🔶 vahva luokka, mutta hidas (ikkuna) | |
| Sellot | `soitin_cello` | – | suurin 0,377 (8:17,6); yli 0,05 ruuduista 7,2 %; ensimmäinen 47,7 s | 🔶 | |
| Kontrabassot | `soitin_double_bass` | – | **suurin 0,049 (1:25,7); ei koskaan yli 0,05** | ❌ kuollut: kontrabasso ei erotu sellosta | bass-stemmi + CREPE `basso`, `urkupiste` |
| Puupuhaltimet (perhe) | `puupuhaltimet` | V3 | ylittää 0,5 kohdassa 26,4 s (jaksoina 26,4–29,5 ja 30,6–39,3 s). **Nousee myös 13,3 s (0,40–0,56), mutta siellä huilu 0,001, klarinetti 0,012 ja käyrätorvi 0,17: kanava kuuntelee käyrätorvea** | 🔶 sekoittuu vaskeen ja attakkiin | PANNs klarinetti / huilu |
| Klarinetti | `soitin_clarinet` | V3 | yli 0,05 kohdassa 27,3 s, V3-ikkunassa 0,118; suurin 0,307 (37,9 s) | 🔶 | |
| Huilu | `soitin_flute` | V5 (ehdokas) | V3:ssa 0,020 (ei nouse); suurin 0,431 (7:47,3); V5-ehdokkaassa 382–390 s 0,37; ensimmäinen yli 0,05 kohdassa 3:23,8 | 🔶 | |
| Oboe, fagotti, englannintorvi | – | – | AudioSetissä (527 luokkaa) ei ole näitä luokkia; saksofoni (diagnostiikka) suurin 0,019 | ❌ ei mitattavissa PANNsilla | spektrogrammi + partituuri + korva |
| Vasket (perhe) | `vasket` | V4, V7 | V4:ssä 0,50, V7:ssä keskiarvo 0,26; **V1:ssä 0,49 patarumpuiskun attakista** (PANNs-vaskiluokat 0,00) | 🔶 sekoittuu attakkiin | PANNs `soitin_brass_instrument` + aksentit |
| Vaski, PANNs | `soitin_brass_instrument` | V4, V7 | V4 0,29, V7 0,34, suurin 0,559 (12:45,1); käyrätorvi V4 0,12, V7 0,15; pasuuna V7 0,17; trumpetti V7 0,15 | 🔶 | |
| Käyrätorvi / trumpetti / pasuuna | `soitin_french_horn`, `_trumpet`, `_trombone` | V4, V7 | käyrätorvi hallitsee 60,8 % vaskiruuduista ja on yli 2 × trumpetti 72,6 %:ssa niistä ruuduista, joissa jompikumpi > 0,05; trumpetti ja pasuuna kulkevat yhdessä (korrelaatio 0,87; 87 % ruuduista alle kaksinkertainen ero); trumpetti ei kertaakaan yli 2 × käyrätorvi | 🔶 käyrätorvi erottuu osittain, **trumpetti ja pasuuna eivät** | spektrogrammi + partituuri |
| Huilu / klarinetti | `soitin_flute`, `soitin_clarinet` | V3, V5 | luokat vuorottelevat, eivät nouse yhdessä (korrelaatio −0,07; vain 6,5 % ruuduista alle kaksinkertainen ero); klarinetti 27,7–28,9 s, 36,0–38,9 s; huilu 287,0–289,9 s, 382,5–384,1 s, 464,8–468,6 s | 🔶 erottuvat luokkina; oikeellisuus todettava korvalla | partituuri |
| Sello / kontrabasso | `soitin_cello`, `soitin_double_bass` | – | kontrabasso ei nouse (ks. yllä): sello hallitsee kaikissa 2 245 ruudussa, joissa jompikumpi > 0,05 | ❌ kontrabassoa ei erota | bass-stemmi + CREPE |
| Jousitremolo | `jousitremolo` | V7 | myrskyikkunassa 685–720 s keskiarvo 0,014, huippu 0,23, 20 ruutua / 1050 yli 0,2; koko teoksessa p99 0,21 | ❌ kuollut | jännite + selkeys (`analysis`), liiketiheys, vaski |
| Myrsky / kromaattisuus | `tension`, `key_clarity` (analysis) | V7 | V6:ssa jännite 0,14, selkeys 0,81 → 685–720 s jännite 0,67, selkeys 0,51; 713–762 s jännite > 0,7 (selkeys < 0,45 kohdissa 717–723 s ja 735–757 s) | 🔶 | partituuri |
| Urkupiste | `urkupiste` | V8 | 11 urkupistettä > 4 s koko teoksessa; V8:ssa 1033,5–1038,1 s H1; muut mm. 179,3–191,8 s (H1), 912,7–922,3 s (D2), 999,6–1005,1 s (H1) | 🔶 | bass-stemmi + CREPE |
| Liiketiheys | `liiketiheys` | V5, V7 | V5-ehdokas 382–390 s 5,29 alkua/s (teoksen suurin 8 s keskiarvo); V7: 0,05 → 2,21 alkua/s kohdassa 685,13 s; V7-ikkunan keskiarvo 2,35 | 🔶 | |
| C-duuri | `vihje_Cduuri` | V6 | 680,0–685,1 s: 0,43 (huippu 0,52), C+E+G 58 % chromasta, selkeys 0,81, jännite 0,14, taso −29 dBFS. Toinen ehdokas 641,6–645,1 s (0,47; C+E+G 62 %, 3,5 s) | 🔶 vihje; kaksi ehdokasta | partituuri |
| H-duuri | `vihje_Hduuri` | V8 | 1025,5–1051,4 s: 0,66 (h-molli 0,58, koska H ja Fis ovat yhteiset); chroma H 0,37, Fis 0,28, Es (Dis) 0,08, D 0,02; K–S "H duuri" 0,84; patarumpu: PANNs 0,000, `patarumpu_stemmi` 0,00 | 🔶 vihje; suuri terssi (Es) ylittää pienen (D) | partituuri |
| Divisi-jouset | `jouset`, soitinluokat | V8 | V8:ssa `jouset` 0,09, viulu 0,020, jousisoitin 0,013 (taso −41 dBFS) | ❌ ei näy soitinkanavissa hiljaisessa kohdassa | chroma (H-duuri) |
| Vire | `vire.py` | avaus 0–60 s | **+4,8 c** A=440:stä (14 säveltä, keskihajonta 11,2 c, MAD 1,6 c; other-stemmi +6,2 c, 5 säveltä, MAD 0,1 c); koko teos +5,6 c (98 säveltä, MAD 1,0 c). Pitkät sävelet As4 ja As3 | 🔶 mitattu modulo puolisävelaskel; ei korjattu | käyttäjän päätös |

### Huomiot Rattle-mittauksista
- Tiedosto alkaa digitaalisella hiljaisuudella 0–5,054 s; huoneen kohina (−67,6 dBFS) alkaa 5,054 s; ensimmäinen ääni 7,6 s (5 ms: 7,675 s). Musiikki loppuu 1051,6 s (huoneen kohina + 10 dB),
  lopussa hiljenemishäntä, viimeinen ei-nolla-näyte 1057,995 s ja digitaalinen hiljaisuus 20,0 s tiedoston loppuun. **Aplodeja ei ole.**
- Lähes hiljaiset kohdat (taso < −60 dBFS, huoneen kohina −66 dBFS): 58,1–61,4 s ja 845,6–865,2 s (19,6 s). Alussa soitinluokkien suurin arvo 0,17 (reuna), jälkimmäisessä 846–855 s soitinluokat 0,00 ja 856–865 s hyvin hiljaista soittoa.
- Kellot: kuuntelukopio ja kaikki johdetut äänet 0,00 ms; kuuntelunäytteet 0,00 ms. Kohinanpoisto (`afftdn`) vaimentaa kohinan lähellä olevaa sisältöä enintään 12 dB (ks. raportti luku 4).
- Soitinluokat, jotka eivät koskaan ylitä 0,05:tä: kontrabasso (0,049), saksofoni (0,019), rumpujen pyörre (0,000).

## Tarkka kuuntelu (9.11.2026): mitä spektri kertoo, kun kysymys on tarkka

`analysis/tarkka.py` (CQT 60 kaistaa oktaavissa, 12 ms, CPU). Testattu alussa 6–62 s käyttäjän kolmella havainnolla.

| Käyttäjän havainto | Mitattu | Tulos |
|---|---|---|
| "puhaltimet soittavat alkuun lähes unisonossa gis-ääntä" | Gis4 soi 8,7–17,8 ja 20,6–46,2 s (25,6 s yhtäjaksoisesti), Gis5 sen yllä | ✅ näkyy |
| "ne puhaltimet nousevat ja laskevat" | gis:n taso paisuu ja laskee 12 kertaa 23–45 s, noin 2 s välein, 5–8 dB; yläsävelprofiili vaihtuu sekunneittain (sama sävel, eri soitin); pienet kuviot gis:stä ylös (ais, h, cis) noin 27,8 / 30,7 / 35–37 s | ✅ näkyy; kuvioiden yksittäiset nuotit osittain |
| "basson huokaavat askeleet kuuluu melkein koko alun yli" | matala H: 7,5 s; 13,5–20,3 s pitkänä (alut 13,5 / 14,1 / 14,8); 43,5–45,2 s kuusi sykettä; 21–43 s ei mitään yli −55 dB | 🔶 osittain: välissä ei näy |

**Mitä tämä menetelmä osaa:** pitkän äänen ja sen keston, paisutukset, sävelen, oktaavin, värin vaihtumisen samalla
sävelellä, matalat alut. **Mitä se ei osaa:** nimetä soitinta varmasti (puhdas perusääni viittaa huiluun,
parittomat yläsävelet klarinettiin, mutta se on vihje), eikä löytää asiaa, jota ei osata kysyä. Käyttäjän yksi
lause kertoo, mitä mitata; mittaus kertoo tarkan ajan ja löytää saman muualta.
