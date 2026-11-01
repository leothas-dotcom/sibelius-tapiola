# Tapiola: kuunteluopas

*Tämän oppaan tarinaosat kirjoittaa käyttäjä haastattelussa; ne ovat tässä tyhjiä otsikoita. Generoidut osat (GEN-merkkien välissä)
täytetään komennolla `.venv\Scripts\python.exe -I analysis/kuunteluopas.py --levytys rattle2022` teemakartasta
(`annotations/teemat.json`) ja levytyksen ajoista (`annotations/ajat_<levytys>.json`): älä muokkaa niitä käsin.*

## Teos lyhyesti

## Tarina

## Soittimet ja mitä ne merkitsevät

## Ankkurit aikakoodein

<!-- GEN:ankkurit -->
Levytys: **Rattle / London Symphony Orchestra 2022 (LSO:n YouTube-kanava, gkX-Uc0e3TQ)**, kuuntelukopio `build/kuuntelu/rattle_kuuntelu.wav`. Ajat ovat kuuntelukopion aikaa tiedoston alusta. **Mikään aika ei ole kuultu**: kaikki ovat analyysin ehdotuksia (varmuus *analyysi*), kunnes käyttäjä vahvistaa ne korvalla. Luottamus kertoo, kuinka hyvin mitattu piirre vastaa kuvausta (hyvä / kohtalainen / heikko).

| Aika | Ankkuri | Partituuri | Mitä kuuluu | Mistä tunnistaa (mitattu) | Varmuus |
|---|---|---|---|---|---|
| **0:07.7–0:08.7** | Avaus: patarumpusoolo (`avaus_patarumpu`) | t. 1, teoksen alku | patarumpusoolo ("tututum"), ei muita soittimia | Ensimmäinen ääni: 5 ms RMS ylittää pintakohinan (−70,8 dBFS) + 20 dB kohdassa 7,675 s (V1). aksentit.py: iskut 7,732 s (z 12,0) ja 7,832 s (z 10,9). patarumpu_matala-kanava huippu 7,67 s (1,00). | analyysi (ei kuultu), luottamus hyvä |
| **0:08.9** | Jouset tulevat (`jouset_tulevat`) | heti patarumpusoolon jälkeen, alku | ydinmotiivi tulee jousissa patarumpusoolon jälkeen | V2: taso nousee 5,8 dB 0,5 s mediaaniin verrattuna kohdassa 8,93 s, 0,25 s soolon päättymisen jälkeen; | analyysi (ei kuultu), luottamus kohtalainen |
| **0:13.1** | Käyrätorvet vastaavat jousille (`kayratorvet_vastaavat`) | jousten jälkeen, alku | vaskipuhaltimet, ensin käyrätorvet, vastaavat jousille jousten jälkeen | V3-vaihtoehto: vaskikanava 0,30 → 0,45 kohdissa 13,0–13,2 s, PANNs käyrätorvi 0,10 kohdassa 13,5 s (huippu 0,17), vaski 0,24; jouset-kanava laskee 0,67 (12,0 s) → 0,21 (13,2 s). | analyysi (ei kuultu), luottamus kohtalainen |
| **0:26.4** | Puupuhaltimet tulevat mukaan (`puhaltimet_tulevat`) | jousten jälkeen, alku | puupuhaltimet tulevat mukaan jousten jälkeen | V3-sääntö: puupuhaltimet-kanava ylittää 0,5 kohdassa 26,43 s (0,59 → 0,86 kohdissa 27–29 s) ja PANNs klarinetti ylittää 0,05 kohdassa 27,3 s (ikkunassa 0,118). | analyysi (ei kuultu), luottamus kohtalainen |
| **0:45.3** | Vaskien isku (`vaskien_isku`) | Allegro moderaton alku | vaskien isku avaa Allegro moderaton | aksentit.py: vahvin isku välillä 30–120 s kohdassa 45,327 s: z 32,9 (korkea isku), kontrasti 12,0 dB, taso −21,5 dBFS, kaistat matala/keski/korkea 1,5/32,6/99,0. Vaskikanava 0,07 → 0,49 kohdissa 44,4–45,0 s; | analyysi (ei kuultu), luottamus hyvä |
| **0:58.1** | Ensimmäinen hiljaisuus alkaa (`hiljaisuus_1_alku`) | ei tiedossa [tarkista] | ääni hiljenee lähes täydelliseen hiljaisuuteen | aikajana.py hiljaiset kohdat: taso alle −60 dBFS vähintään 1,5 s: 58,1–61,4 s (3,3 s, keskitaso −66,6 dBFS = huoneen kohinan taso). Edellä äkillinen hiljeneminen 57,5 s (−25 dB/s; ff → p, jaksoraja 57,53 s). | analyysi (ei kuultu), luottamus hyvä |
| **1:01.4** | Ensimmäinen hiljaisuus päättyy (`hiljaisuus_1_loppu`) | ei tiedossa [tarkista] | musiikki palaa; jouset aloittavat | Taso nousee −66,7 → −37,2 dBFS (1,5 s ennen/jälkeen). aksentit.py: 61,39 s (z 5,4), 61,59 s (z 9,4, kontrasti 15,0 dB), 61,79 s (z 8,4, kontrasti 18,8 dB). | analyysi (ei kuultu), luottamus hyvä |
| **2:59.3** | Pitkä urkupiste H:lla alkaa (`urkupiste_H1_alku`) | ei tiedossa [tarkista] | pitkä urkupiste H:lla (H1) | kanavat.py urkupiste: sama sävel midi 35,1 (H1; englanniksi B1) yhtäjaksoisesti 179,33–191,83 s (12,5 s; vähimmäiskesto 4 s). Liiketiheys keskimäärin 0,1 alkua/s, taso −42…−28 dBFS (keskiarvo −34,1), jännite 0,0–0,7. | analyysi (ei kuultu), luottamus kohtalainen |
| **3:11.8** | Pitkä urkupiste H:lla päättyy (`urkupiste_H1_loppu`) | ei tiedossa [tarkista] | pitkä urkupiste H:lla (H1) | kanavat.py urkupiste päättyy kohdassa 191,83 s (sama sävel midi 35,1 yhtäjaksoisesti 179,33 s alkaen, 12,5 s). Jaksoraja 193,49 s (uutuus 8,2); jännite 0,04 (179,3 s) → 0,46 (191,8 s). | analyysi (ei kuultu), luottamus kohtalainen |
| **4:40.9** | Nopean kuvioinnin jakso alkaa (`nopea_liike_1_alku`) | ei tiedossa [tarkista] | nopea kuviointi, puupuhaltimia ja jousia | liiketiheys (0,5 s tasoitus) ylittää 2,5 alkua/s kohdassa 280,9 s ja pysyy sen yli 303,7 s asti (keskiarvo 3,8, suurin 5,5; 22,8 s). | analyysi (ei kuultu), luottamus kohtalainen |
| **5:03.7** | Nopean kuvioinnin jakso päättyy (`nopea_liike_1_loppu`) | ei tiedossa [tarkista] | nopea kuviointi päättyy | liiketiheys (0,5 s tasoitus) putoaa alle 2,5 alkua/s kohdassa 303,7 s (0,8 alkua/s 304 s, 0,0 alkua/s 308 s); puupuhaltimet-kanava 0,12 → 0,03; taso −42 → −48 dBFS 303–304 s; jännite 0,76–0,85. | analyysi (ei kuultu), luottamus kohtalainen |
| **6:23.0** | Puupuhallinkuviot G:ssä alkavat (`peikot_G_alku`) | kirjain G | puupuhallinkuviot, nopeat kahdeksasosat | V5-sääntö (puupuhaltimet-kanava × liiketiheys, 8 s ikkuna, haku V4:n ja V6:n välillä): paras ikkuna 382,2–390,2 s: puupuhaltimet 0,72, liiketiheys 5,29 alkua/s (teoksen suurin), PANNs huilu 0,37 (0,33 kohdassa 383 s), taso −40,4 d… | analyysi (ei kuultu), luottamus heikko |
| **6:30.3** | Puupuhallinkuviot G:ssä päättyvät (`peikot_G_loppu`) | kirjain G | puupuhallinkuviot päättyvät | segments.py-raja 390,3 s (uutuus 16,6): puupuhaltimet-kanava 0,72 (389 s) → 0,13 (390,3–392,3 s), taso −41,3 → −32,8 dBFS; interpret.py: voimistuu äkkiä 390,8 s; aksentti 390,51 s (z 5,7). V5-ikkunan loppu 390,2 s. | analyysi (ei kuultu), luottamus heikko |
| **8:16.3** | Jousijakso urkupisteen päällä alkaa (`jousijakso_urkupiste_E_alku`) | ei tiedossa [tarkista] | jousivaltainen matalarekisterinen jakso, urkupiste E:llä | jouset-kanava > 0,6 yhtäjaksoisesti 496,3–502,4 s (6,1 s, keskiarvo 0,9). Urkupiste midi 52,0 (E3) 494,97–501,10 s. | analyysi (ei kuultu), luottamus kohtalainen |
| **8:22.4** | Jousijakso urkupisteen päällä päättyy (`jousijakso_urkupiste_E_loppu`) | ei tiedossa [tarkista] | jousivaltainen matalarekisterinen jakso, urkupiste E:llä | jouset-kanava putoaa alle 0,6 kohdassa 502,4 s (0,36 → 0,19 kohdissa 502–504 s); interpret.py: jouset vaikenevat 502,0 s; taso −37 → −51 dBFS 502–504 s. | analyysi (ei kuultu), luottamus kohtalainen |
| **9:57.2** | Hiljainen jakso alkaa (`hiljainen_jakso_alku`) | ei tiedossa [tarkista] | pitkä hiljainen jakso, vähän liikettä | taso (1 s keskiarvo) alle −50 dBFS yhtäjaksoisesti 597,2–613,6 s (16,4 s; keskitaso −55,2 dBFS, minimi −69,3 dBFS). jouset-kanava keskiarvo 0,11, vaskikanava 0,03, liiketiheys keskimäärin 0,07 alkua/s. | analyysi (ei kuultu), luottamus hyvä |
| **10:13.6** | Hiljainen jakso päättyy (`hiljainen_jakso_loppu`) | ei tiedossa [tarkista] | hiljainen jakso päättyy, vaskit ja patarummut kasvattavat | taso nousee yli −50 dBFS kohdassa 613,6 s ja −36 dBFS kohdassa 618 s; interpret.py: vaskipuhaltimet tulevat sisään 619,9 s ja patarummut 620,0 s (ks. vaski_tutti_620). | analyysi (ei kuultu), luottamus hyvä |
| **10:21.6** | Vaskien ja patarumpujen tutti-isku (`vaski_tutti_620`) | ei tiedossa [tarkista] | vaskien ja patarumpujen tutti-isku, jakson voimakkain kohta | aksentit.py: aksentti 621,607 s (z 8,5, kontrasti 9,6 dB, taso −21,3 dBFS); taso −33 → −25 dBFS kohdissa 621,0 → 621,5 s. interpret.py: vaskipuhaltimet tulevat sisään 619,9 s, patarummut 620,0 s. | analyysi (ei kuultu), luottamus hyvä |
| **11:20.0–11:25.1** | C-duuri ennen kirjainta M (`auringonsade`) | t. 392–396, noin 5 tahtia ennen kirjainta M | yllättävä C-duuri, noin viisi tahtia | V6: pisin C-duuri-vihjejakso (vihje_Cduuri > 0,3, vähintään 3 s) 680,03–685,13 s (5,1 s). C, E ja G muodostavat 58 % chromasta, vihje keskiarvo 0,43 (huippu 0,52); | analyysi (ei kuultu), luottamus kohtalainen |
| **11:25.1–11:50.7** | Kirjain M: vaskien jyrinä (`M_ennakko`) | kirjain M, t. 397 | vaskien jyrinä, myrskyn ennakko (ei vielä talvimyrsky) | V7: C-duuri-jakson loppu; samassa kohdassa tekstuuri muuttuu: liiketiheys 0,05 → 2,21 alkua/s, PANNs-vaski 0,01 → 0,34, taso −28,6 → −23,8 dBFS, vaskikanava 0,54. | analyysi (ei kuultu), luottamus hyvä |
| **11:51.0** | Jännitteinen jousijakso alkaa (`jannitejakso_alku`) | ei tiedossa [tarkista] | jousivaltainen jakso, korkea jännite ja nopea liike | Jännite > 0,7 ja sävellajin selkeys < 0,5 (2 s tasoitus) yhtäjaksoisesti 706,4–777,9 s; | analyysi (ei kuultu), luottamus kohtalainen |
| **12:35.5** | Jännitteinen jousijakso päättyy (`jannitejakso_loppu`) | ei tiedossa [tarkista] | jousijakso päättyy, vaskit tulevat | jouset-kanava putoaa 0,85 → 0,13 kohdissa 753,5–756,0 s, liiketiheys 3,3 (753 s) → 1,2 (756,5 s) alkua/s, vaskikanava 0,19 → 0,36 kohdassa 756,5 s; interpret.py: jouset vaikenevat 755,2 s, vaskipuhaltimet tulevat sisään 755,4 s; | analyysi (ei kuultu), luottamus kohtalainen |
| **12:36.5** | Allegro moderato O:n jälkeen: vaskivuorottelu alkaa (`allegro_moderato_O_alku`) | kirjain O, t. 462, O:n jälkeen | käyrätorvien < > ja trumpettien hidas vuorottelu | Jousten liike päättyy (liiketiheys 3,3 → 1,2 alkua/s) ja vaskikanava nousee 0,19 → 0,36 → 0,53 kohdissa 756,0–757,0 s; PANNs käyrätorvi 0,03 → 0,18 (757,5 s), trumpetti 0,07 ja pasuuna 0,09; jaksoraja 756,2 s (uutuus 16,0). | analyysi (ei kuultu), luottamus kohtalainen |
| **12:48.9** | Allegro moderato O:n jälkeen: vaskivuorottelu päättyy (`allegro_moderato_O_loppu`) | kirjain O, t. 462, O:n jälkeen | käyrätorvien < > ja trumpettien hidas vuorottelu päättyy | vaskikanava 0,60 → 0,16 kohdissa 768,5–769,5 s, jouset-kanava 0,05 → 0,49; interpret.py: jouset tulevat sisään 768,2 s, vaskipuhaltimet vaikenevat 769,3 s; jaksoraja 769,68 s (uutuus 15,1). | analyysi (ei kuultu), luottamus kohtalainen |
| **14:05.6** | Toinen hiljaisuus alkaa (`hiljaisuus_2_alku`) | ei tiedossa [tarkista] | ääni hiljenee lähes täydelliseen hiljaisuuteen ennen myrskyä | aikajana.py hiljaiset kohdat: taso alle −60 dBFS vähintään 1,5 s: 845,6–865,2 s (19,6 s, keskitaso −64,3 dBFS). Edellä taso laskee −35 → −59 dBFS kohdissa 841–845 s; interpret.py: hiljenee äkkiä 845,13 s; jaksoraja 845,58 s. | analyysi (ei kuultu), luottamus hyvä |
| **14:17.1** | Myrsky näkyy (`myrsky_nakyy`) | t. 523 | ppp, hiljainen jousten kuviointi, crescendo alkaa | Hiljaisuuden (845,6–856 s, taso −61…−69 dBFS, soitinluokat 0,00) jälkeen jouset-kanava ylittää 0,02 kohdassa 856,5 s ja 0,05 kohdassa 857,13 s; interpret.py: jouset tulevat sisään 856,3 s; | analyysi (ei kuultu), luottamus kohtalainen |
| **14:25.2** | Toinen hiljaisuus päättyy (`hiljaisuus_2_loppu`) | ei tiedossa [tarkista] | hiljaisuus päättyy; ppp-soitto on jo alkanut jakson sisällä | taso nousee yli −60 dBFS (3 s keskiarvo) kohdassa 865,2 s; jouset-kanava 0,09, liiketiheys 1,7 alkua/s, jännite 0,74; interpret.py: jouset tulevat sisään 866,4 s. | analyysi (ei kuultu), luottamus hyvä |
| **14:27.4** | Nopea voimistuminen alkaa (`myrsky_kasvu`) | ei tiedossa [tarkista] | jouset tulevat selvästi esiin, nopea crescendo | jouset-kanava 0,10 → 0,74 kohdissa 866,5–867,5 s (ylittää 0,5 kohdassa 867,43 s); PANNs viulu 0,02 → 0,28; taso −56 → −46 dBFS kohdissa 867,0–868,5 s; liiketiheys 2,0 → 3,0 alkua/s; interpret.py: jouset tulevat sisään 866,4 s; | analyysi (ei kuultu), luottamus hyvä |
| **14:50.5** | Talvimyrsky iskee (`myrsky_iskee`) | t. 540 | talvimyrsky iskee: kromaattinen jousitremolo, vaskit täydellä voimalla | Taso nousee −28,9 → −16,8 dBFS kohdissa 890,0–892,0 s; jyrkin nousu +8,8 dB/s kohdassa 890,8 s (jakson 840–930 s suurin, lukuun ottamatta 924 s:n nousua hiljaisuuden jälkeen). | analyysi (ei kuultu), luottamus heikko |
| **15:10.6** | Myrskyn voimakkain kohta (`myrsky_huippu`) | ei tiedossa [tarkista] | koko äänitteen voimakkain jakso, tiheä tutti | 1 s keskiarvon suurin taso koko äänitteessä: −15,2 dBFS kohdassa 910,6 s (huippunäyte −13,2 dBFS); 904–912 s taso −17…−21 dBFS yhtäjaksoisesti; vaskikanava 0,10, jouset 0,02 (tiheä tutti, luokitus ei tunnista); jännite 0,49. | analyysi (ei kuultu), luottamus hyvä |
| **15:35.9** | Toinen paisunta myrskyn jälkeen (`toinen_paisunta`) | ei tiedossa [tarkista] | äkillinen voimistuminen hiljaisesta kohdasta | taso −50,4 dBFS (935,0 s) → −40,1 (936,0 s) → −32,3 (937,0 s); interpret.py: voimistuu äkkiä 935,9 s (+11 dB/s); jaksoraja 935,2 s (teoksen 5. vahvin, uutuus 19,9; voimakkuus 0,43 → 0,60); vaskikanava 0,07 → 0,20; | analyysi (ei kuultu), luottamus hyvä |
| **16:10.0** | Huuto (`huuto`) | t. 586–587 | korkeat jouset ("huuto") myrskyn jälkeen | Myrskyn laannuttua taso laskee −31 dBFS (964 s) → −41,7 dBFS (970 s), minkä jälkeen jouset-kanava nousee 0,15 → 0,64 ja PANNs viulu 0,03 → 0,21 kohdassa 970,0 s (jouset 0,2–0,5 vielä 976 s asti); | analyysi (ei kuultu), luottamus heikko |
| **16:52.7** | Loppuhuipennus (`loppuhuipennus`) | ei tiedossa [tarkista] | viimeinen suuri huipennus ennen H-duuria | taso nousee −34 → −17 dBFS kohdissa 1008–1012 s ja saavuttaa −16,8 dBFS (1 s keskiarvo) kohdassa 1012,7 s (koko äänitteen 2. suurin); | analyysi (ei kuultu), luottamus hyvä |
| **17:04.7** | H-duuri-loppu alkaa (`loppu_Hduuri_alku`) | t. 624–634 | H-duurisointu monijakoisissa jousissa (divisi); dynamiikka partituurista [tarkista] | taso nousee −64,6 → −46,5 dBFS 0,2 s:ssa (1024,5 → 1024,7 s), flux 0,59; aksentit.py ei listaa iskua (z < 5); interpret.py: voimistuu äkkiä 1024,73 s. | analyysi (ei kuultu), luottamus hyvä |
| **17:31.4** | H-duuri-loppu päättyy (`loppu_Hduuri_loppu`) | t. 624–634 | H-duurisointu hiljenee | V8: vihje_Hduuri laskee alle 0,5 kohdassa 1051,43 s (jakso 1025,47–1051,43 s, 26,0 s); taso −49,4 → −61,5 dBFS (1,5 s ennen/jälkeen); jaksoraja 1051,67 s; interpret.py: hiljenee äkkiä 1051,67 s. | analyysi (ei kuultu), luottamus hyvä |
| **17:31.6–17:38.0** | Musiikki loppuu (`musiikki_loppuu`) | t. 634, viimeinen ääni | teoksen viimeinen ääni | kohinaikkuna.py: viimeinen 100 ms RMS, joka ylittää huoneen kohinan + 10 dB, on kohdassa 1051,6 s; taso sen jälkeen −59…−97 dBFS (hiljenemishäntä); viimeinen ei-nolla-näyte 1057,9946 s; | analyysi (ei kuultu), luottamus hyvä |

**Ilman aikaa** (mittaus ei riitä; ehdokkaat vain korvan tarkistettavaksi):

- **Tuulenpuuska** (`tuulenpuuska`, t. 21–25): oktatoninen "tuulenpuuska". Ehdokkaat: 0:48.0 (nopea kuviointi, liiketiheys 4,0/s kohdassa 49 s; aksentti 48,79 s (z 6,4); ei oktatonista mittaa).
- **Matalat äänet "askeleina"** (`askeleet_B`, kirjain B, t. 69): matalat äänet tulevat eri tahtiin kuin muu orkesteri. Ehdokkaat: 2:09.7 (bassolinjan H1-sävelet erillisinä iskuina); 2:04.6 (jaksoraja: vaskit pois, sellot ja kontrabassot sisään).
- **Ensimmäinen sordiino** (`con_sord_J`, kirjain J, kirjaimen J jälkeen): ensimmäinen con sord. (sordiino). Ehdokkaat: 8:39.9 (jousilohko hiljaisuuden jälkeen, painopiste 0,29); 8:16.3 (matalin painopiste (0,10), urkupiste E).
<!-- /GEN:ankkurit -->

## Minuutti minuutilta

<!-- GEN:minuutit -->
##### 0:00–1:00

Mitattu: taso -86…-19 dBFS (keskiarvo -37); liike 1.0 alkua/s; soittimia aikajanassa (PANNs, vähintään 8 s): patarummut, puupuhaltimet, kontrabassot, sellot.

Jaksot: **Ensimmäinen hiljaisuus** 0:58.1–1:01.4 (ääni hiljenee lähes täydelliseen hiljaisuuteen)

| Aika | Mitä | Mitä kuuluu | Merkitys (käyttäjä) | Varmuus |
|---|---|---|---|---|
| **0:07.7** | Avaus: patarumpusoolo | patarumpusoolo ("tututum"), ei muita soittimia (t. 1, teoksen alku) |  | analyysi (ei kuultu), luottamus hyvä |
| **0:08.9** | Jouset tulevat | ydinmotiivi tulee jousissa patarumpusoolon jälkeen (heti patarumpusoolon jälkeen, alku) |  | analyysi (ei kuultu), luottamus kohtalainen |
| **0:13.1** | Käyrätorvet vastaavat jousille | vaskipuhaltimet, ensin käyrätorvet, vastaavat jousille jousten jälkeen (jousten jälkeen, alku) |  | analyysi (ei kuultu), luottamus kohtalainen |
| **0:26.4** | Puupuhaltimet tulevat mukaan | puupuhaltimet tulevat mukaan jousten jälkeen (jousten jälkeen, alku) |  | analyysi (ei kuultu), luottamus kohtalainen |
| **0:45.3** | Vaskien isku | vaskien isku avaa Allegro moderaton (Allegro moderaton alku) |  | analyysi (ei kuultu), luottamus hyvä |
| 0:58.1 | Ensimmäinen hiljaisuus: alkaa | | | analyysi (ei kuultu), luottamus hyvä |

##### 1:00–2:00

Mitattu: taso -71…-26 dBFS (keskiarvo -36); liike 0.7 alkua/s; soittimia aikajanassa (PANNs, vähintään 8 s): kontrabassot, sellot, käyrätorvet, trumpetit ja pasuunat, puupuhaltimet.

Jaksot: **Ensimmäinen hiljaisuus** 0:58.1–1:01.4 (ääni hiljenee lähes täydelliseen hiljaisuuteen)

| Aika | Mitä | Mitä kuuluu | Merkitys (käyttäjä) | Varmuus |
|---|---|---|---|---|
| 1:01.4 | Ensimmäinen hiljaisuus: päättyy | | | analyysi (ei kuultu), luottamus hyvä |

##### 2:00–3:00

Mitattu: taso -44…-26 dBFS (keskiarvo -34); liike 0.3 alkua/s; soittimia aikajanassa (PANNs, vähintään 8 s): sellot, viulut, jouset, kontrabassot.

Jaksot: **Pitkä urkupiste H:lla** 2:59.3–3:11.8 (pitkä urkupiste H:lla (H1))

| Aika | Mitä | Mitä kuuluu | Merkitys (käyttäjä) | Varmuus |
|---|---|---|---|---|
| 2:59.3 | Pitkä urkupiste H:lla: alkaa | | | analyysi (ei kuultu), luottamus kohtalainen |

##### 3:00–4:00

Mitattu: taso -58…-28 dBFS (keskiarvo -38); liike 0.9 alkua/s; soittimia aikajanassa (PANNs, vähintään 8 s): puupuhaltimet.

Jaksot: **Pitkä urkupiste H:lla** 2:59.3–3:11.8 (pitkä urkupiste H:lla (H1))

| Aika | Mitä | Mitä kuuluu | Merkitys (käyttäjä) | Varmuus |
|---|---|---|---|---|
| 3:11.8 | Pitkä urkupiste H:lla: päättyy | | | analyysi (ei kuultu), luottamus kohtalainen |

##### 4:00–5:00

Mitattu: taso -49…-24 dBFS (keskiarvo -37); liike 1.9 alkua/s; soittimia aikajanassa (PANNs, vähintään 8 s): kontrabassot, puupuhaltimet.

Jaksot: **Nopea kuviointi** 4:40.9–5:03.7 (nopea kuviointi, puupuhaltimia ja jousia)

| Aika | Mitä | Mitä kuuluu | Merkitys (käyttäjä) | Varmuus |
|---|---|---|---|---|
| 4:40.9 | Nopea kuviointi: alkaa | | | analyysi (ei kuultu), luottamus kohtalainen |

##### 5:00–6:00

Mitattu: taso -53…-25 dBFS (keskiarvo -39); liike 0.8 alkua/s; soittimia aikajanassa (PANNs, vähintään 8 s): kontrabassot, käyrätorvet, jouset, sellot, puupuhaltimet.

Jaksot: **Nopea kuviointi** 4:40.9–5:03.7 (nopea kuviointi, puupuhaltimia ja jousia)

| Aika | Mitä | Mitä kuuluu | Merkitys (käyttäjä) | Varmuus |
|---|---|---|---|---|
| 5:03.7 | Nopea kuviointi: päättyy | | | analyysi (ei kuultu), luottamus kohtalainen |

##### 6:00–7:00

Mitattu: taso -50…-23 dBFS (keskiarvo -38); liike 3.1 alkua/s; soittimia aikajanassa (PANNs, vähintään 8 s): kontrabassot, puupuhaltimet, jouset, sellot, viulut.

Jaksot: **Puupuhallinkuviot (kirjain G)** 6:23.0–6:30.3 (puupuhallinkuviot, nopeat kahdeksasosat)

| Aika | Mitä | Mitä kuuluu | Merkitys (käyttäjä) | Varmuus |
|---|---|---|---|---|
| 6:23.0 | Puupuhallinkuviot (kirjain G): alkaa | | | analyysi (ei kuultu), luottamus heikko |
| 6:30.3 | Puupuhallinkuviot (kirjain G): päättyy | | | analyysi (ei kuultu), luottamus heikko |

##### 7:00–8:00

Mitattu: taso -46…-23 dBFS (keskiarvo -34); liike 1.0 alkua/s; soittimia aikajanassa (PANNs, vähintään 8 s): puupuhaltimet, käyrätorvet, trumpetit ja pasuunat, patarummut.

*(ei ankkureita: edellinen jatkuu)*

##### 8:00–9:00

Mitattu: taso -73…-27 dBFS (keskiarvo -44); liike 0.6 alkua/s; soittimia aikajanassa (PANNs, vähintään 8 s): viulut, sellot, kontrabassot, jouset, puupuhaltimet.

Jaksot: **Jousijakso urkupisteen päällä (E)** 8:16.3–8:22.4 (jousivaltainen matalarekisterinen jakso, urkupiste E:llä)

| Aika | Mitä | Mitä kuuluu | Merkitys (käyttäjä) | Varmuus |
|---|---|---|---|---|
| 8:16.3 | Jousijakso urkupisteen päällä (E): alkaa | | | analyysi (ei kuultu), luottamus kohtalainen |
| 8:22.4 | Jousijakso urkupisteen päällä (E): päättyy | | | analyysi (ei kuultu), luottamus kohtalainen |

##### 9:00–10:00

Mitattu: taso -69…-31 dBFS (keskiarvo -43); liike 0.5 alkua/s; soittimia aikajanassa (PANNs, vähintään 8 s): kontrabassot, viulut.

Jaksot: **Hiljainen jakso** 9:57.2–10:13.6 (pitkä hiljainen jakso, vähän liikettä)

| Aika | Mitä | Mitä kuuluu | Merkitys (käyttäjä) | Varmuus |
|---|---|---|---|---|
| 9:57.2 | Hiljainen jakso: alkaa | | | analyysi (ei kuultu), luottamus hyvä |

##### 10:00–11:00

Mitattu: taso -63…-16 dBFS (keskiarvo -37); liike 0.8 alkua/s; soittimia aikajanassa (PANNs, vähintään 8 s): sellot, trumpetit ja pasuunat, patarummut, käyrätorvet, viulut.

Jaksot: **Hiljainen jakso** 9:57.2–10:13.6 (pitkä hiljainen jakso, vähän liikettä)

| Aika | Mitä | Mitä kuuluu | Merkitys (käyttäjä) | Varmuus |
|---|---|---|---|---|
| 10:13.6 | Hiljainen jakso: päättyy | | | analyysi (ei kuultu), luottamus hyvä |
| **10:21.6** | Vaskien ja patarumpujen tutti-isku | vaskien ja patarumpujen tutti-isku, jakson voimakkain kohta (ei tiedossa [tarkista]) |  | analyysi (ei kuultu), luottamus hyvä |

##### 11:00–12:00

Mitattu: taso -40…-12 dBFS (keskiarvo -26); liike 1.6 alkua/s; soittimia aikajanassa (PANNs, vähintään 8 s): patarummut, trumpetit ja pasuunat, käyrätorvet, sellot.

Jaksot: **Jännitteinen jousijakso** 11:51.0–12:35.5 (jousivaltainen jakso, korkea jännite ja nopea liike)

| Aika | Mitä | Mitä kuuluu | Merkitys (käyttäjä) | Varmuus |
|---|---|---|---|---|
| **11:20.0** | C-duuri ennen kirjainta M | yllättävä C-duuri, noin viisi tahtia (t. 392–396, noin 5 tahtia ennen kirjainta M) |  | analyysi (ei kuultu), luottamus kohtalainen |
| **11:25.1** | Kirjain M: vaskien jyrinä | vaskien jyrinä, myrskyn ennakko (ei vielä talvimyrsky) (kirjain M, t. 397) |  | analyysi (ei kuultu), luottamus hyvä |
| 11:51.0 | Jännitteinen jousijakso: alkaa | | | analyysi (ei kuultu), luottamus kohtalainen |

##### 12:00–13:00

Mitattu: taso -43…-22 dBFS (keskiarvo -31); liike 2.3 alkua/s; soittimia aikajanassa (PANNs, vähintään 8 s): jouset, viulut, sellot, kontrabassot, trumpetit ja pasuunat.

Jaksot: **Jännitteinen jousijakso** 11:51.0–12:35.5 (jousivaltainen jakso, korkea jännite ja nopea liike); **Vaskivuorottelu (Allegro moderato, O:n jälkeen)** 12:36.5–12:48.9 (käyrätorvien < > ja trumpettien hidas vuorottelu)

| Aika | Mitä | Mitä kuuluu | Merkitys (käyttäjä) | Varmuus |
|---|---|---|---|---|
| 12:35.5 | Jännitteinen jousijakso: päättyy | | | analyysi (ei kuultu), luottamus kohtalainen |
| 12:36.5 | Vaskivuorottelu (Allegro moderato, O:n jälkeen): alkaa | | | analyysi (ei kuultu), luottamus kohtalainen |
| 12:48.9 | Vaskivuorottelu (Allegro moderato, O:n jälkeen): päättyy | | | analyysi (ei kuultu), luottamus kohtalainen |

##### 13:00–14:00

Mitattu: taso -51…-15 dBFS (keskiarvo -32); liike 0.9 alkua/s; soittimia aikajanassa (PANNs, vähintään 8 s): viulut, jouset, sellot, kontrabassot, puupuhaltimet.

*(ei ankkureita: edellinen jatkuu)*

##### 14:00–15:00

Mitattu: taso -76…-14 dBFS (keskiarvo -43); liike 1.2 alkua/s; soittimia aikajanassa (PANNs, vähintään 8 s): sellot, kontrabassot, jouset, viulut, patarummut.

Jaksot: **Toinen hiljaisuus** 14:05.6–14:25.2 (ääni hiljenee lähes täydelliseen hiljaisuuteen ennen myrskyä)

| Aika | Mitä | Mitä kuuluu | Merkitys (käyttäjä) | Varmuus |
|---|---|---|---|---|
| 14:05.6 | Toinen hiljaisuus: alkaa | | | analyysi (ei kuultu), luottamus hyvä |
| **14:17.1** | Myrsky näkyy | ppp, hiljainen jousten kuviointi, crescendo alkaa (t. 523) |  | analyysi (ei kuultu), luottamus kohtalainen |
| 14:25.2 | Toinen hiljaisuus: päättyy | | | analyysi (ei kuultu), luottamus hyvä |
| **14:27.4** | Nopea voimistuminen alkaa | jouset tulevat selvästi esiin, nopea crescendo (ei tiedossa [tarkista]) |  | analyysi (ei kuultu), luottamus hyvä |
| **14:50.5** | Talvimyrsky iskee | talvimyrsky iskee: kromaattinen jousitremolo, vaskit täydellä voimalla (t. 540) |  | analyysi (ei kuultu), luottamus heikko |

##### 15:00–16:00

Mitattu: taso -57…-13 dBFS (keskiarvo -31); liike 0.7 alkua/s.

| Aika | Mitä | Mitä kuuluu | Merkitys (käyttäjä) | Varmuus |
|---|---|---|---|---|
| **15:10.6** | Myrskyn voimakkain kohta | koko äänitteen voimakkain jakso, tiheä tutti (ei tiedossa [tarkista]) |  | analyysi (ei kuultu), luottamus hyvä |
| **15:35.9** | Toinen paisunta myrskyn jälkeen | äkillinen voimistuminen hiljaisesta kohdasta (ei tiedossa [tarkista]) |  | analyysi (ei kuultu), luottamus hyvä |

##### 16:00–17:00

Mitattu: taso -51…-15 dBFS (keskiarvo -36); liike 0.3 alkua/s; soittimia aikajanassa (PANNs, vähintään 8 s): patarummut.

| Aika | Mitä | Mitä kuuluu | Merkitys (käyttäjä) | Varmuus |
|---|---|---|---|---|
| **16:10.0** | Huuto | korkeat jouset ("huuto") myrskyn jälkeen (t. 586–587) |  | analyysi (ei kuultu), luottamus heikko |
| **16:52.7** | Loppuhuipennus | viimeinen suuri huipennus ennen H-duuria (ei tiedossa [tarkista]) |  | analyysi (ei kuultu), luottamus hyvä |

##### 17:00–18:00

Mitattu: taso -89…-29 dBFS (keskiarvo -46); liike 0.3 alkua/s.

Jaksot: **H-duuri-loppu** 17:04.7–17:31.4 (H-duurisointu monijakoisissa jousissa (divisi); dynamiikka partituurista [tarkista])

| Aika | Mitä | Mitä kuuluu | Merkitys (käyttäjä) | Varmuus |
|---|---|---|---|---|
| 17:04.7 | H-duuri-loppu: alkaa | | | analyysi (ei kuultu), luottamus hyvä |
| 17:31.4 | H-duuri-loppu: päättyy | | | analyysi (ei kuultu), luottamus hyvä |
| **17:31.6** | Musiikki loppuu | teoksen viimeinen ääni (t. 634, viimeinen ääni) |  | analyysi (ei kuultu), luottamus hyvä |
<!-- /GEN:minuutit -->

## Tarkistuslista

<!-- GEN:tarkista -->
**Kaikki ajat ovat analyysia, ei kuultu.** Kuuntele kohta kuuntelukopiosta ja kirjaa tulos `annotations/ajat_<levytys>.json`:iin (varmuus `vahvistettu` ja korjattu aika); sen jälkeen aja `make_cues.py` ja `kuunteluopas.py` uudelleen.

**1. Ei aikaa (mittaus ei riitä): etsi korvalla**
- `tuulenpuuska` (t. 21–25): oktatoninen "tuulenpuuska". Ehdokkaat: 0:48.0 (nopea kuviointi, liiketiheys 4,0/s kohdassa 49 s; aksentti 48,79 s (z 6,4); ei oktatonista mittaa).
- `askeleet_B` (kirjain B, t. 69): matalat äänet tulevat eri tahtiin kuin muu orkesteri. Ehdokkaat: 2:09.7 (bassolinjan H1-sävelet erillisinä iskuina); 2:04.6 (jaksoraja: vaskit pois, sellot ja kontrabassot sisään).
- `con_sord_J` (kirjain J, kirjaimen J jälkeen): ensimmäinen con sord. (sordiino). Ehdokkaat: 8:39.9 (jousilohko hiljaisuuden jälkeen, painopiste 0,29); 8:16.3 (matalin painopiste (0,10), urkupiste E).

**2. Heikko luottamus: kuuntele ensin** (mitattu piirre vastaa kuvausta huonosti tai ehdokkaita on useita)
- **6:23.0** `peikot_G_alku` (kirjain G). Vaihtoehdot: 4:42.2 (V5-ehdokas 2 (kuuluu osin nopea_liike_1-jaksoon)); 5:49.2 (V5-ehdokas 3)
- **6:30.3** `peikot_G_loppu` (kirjain G)
- **14:50.5** `myrsky_iskee` (t. 540). Vaihtoehdot: 14:27.4 (jousten tulo, ensimmäinen suuri nousu); 14:56.5 (toinen vastaava nousu, −30 → −16,7 dBFS 896,5–899 s)
- **16:10.0** `huuto` (t. 586–587). Vaihtoehdot: 15:52.2 (korkein rekisteri, mutta vaski- ja puupuhallinvaltainen); 15:01.4 (jouset 0,68, rekisteri 0,97, mutta vielä myrskyn sisällä)

**3. Partituuripaikka puuttuu tai on kirjallisuudesta [tarkista]**: käyttäjä täydentää kirjaimen ja tahdin partituurista (tahtinumeroita ei lasketa äänestä)
- **0:08.9** `jouset_tulevat`: Jouset tulevat (heti patarumpusoolon jälkeen, alku)
- **0:13.1** `kayratorvet_vastaavat`: Käyrätorvet vastaavat jousille (jousten jälkeen, alku)
- **0:26.4** `puhaltimet_tulevat`: Puupuhaltimet tulevat mukaan (jousten jälkeen, alku)
- **0:45.3** `vaskien_isku`: Vaskien isku (Allegro moderaton alku)
- **0:58.1** `hiljaisuus_1_alku`: Ensimmäinen hiljaisuus alkaa (ei tiedossa [tarkista])
- **1:01.4** `hiljaisuus_1_loppu`: Ensimmäinen hiljaisuus päättyy (ei tiedossa [tarkista])
- **2:59.3** `urkupiste_H1_alku`: Pitkä urkupiste H:lla alkaa (ei tiedossa [tarkista])
- **3:11.8** `urkupiste_H1_loppu`: Pitkä urkupiste H:lla päättyy (ei tiedossa [tarkista])
- **4:40.9** `nopea_liike_1_alku`: Nopean kuvioinnin jakso alkaa (ei tiedossa [tarkista])
- **5:03.7** `nopea_liike_1_loppu`: Nopean kuvioinnin jakso päättyy (ei tiedossa [tarkista])
- **6:23.0** `peikot_G_alku`: Puupuhallinkuviot G:ssä alkavat (kirjain G)
- **6:30.3** `peikot_G_loppu`: Puupuhallinkuviot G:ssä päättyvät (kirjain G)
- **8:16.3** `jousijakso_urkupiste_E_alku`: Jousijakso urkupisteen päällä alkaa (ei tiedossa [tarkista])
- **8:22.4** `jousijakso_urkupiste_E_loppu`: Jousijakso urkupisteen päällä päättyy (ei tiedossa [tarkista])
- **9:57.2** `hiljainen_jakso_alku`: Hiljainen jakso alkaa (ei tiedossa [tarkista])
- **10:13.6** `hiljainen_jakso_loppu`: Hiljainen jakso päättyy (ei tiedossa [tarkista])
- **10:21.6** `vaski_tutti_620`: Vaskien ja patarumpujen tutti-isku (ei tiedossa [tarkista])
- **11:51.0** `jannitejakso_alku`: Jännitteinen jousijakso alkaa (ei tiedossa [tarkista])
- **12:35.5** `jannitejakso_loppu`: Jännitteinen jousijakso päättyy (ei tiedossa [tarkista])
- **12:36.5** `allegro_moderato_O_alku`: Allegro moderato O:n jälkeen: vaskivuorottelu alkaa (kirjain O, t. 462, O:n jälkeen)
- **12:48.9** `allegro_moderato_O_loppu`: Allegro moderato O:n jälkeen: vaskivuorottelu päättyy (kirjain O, t. 462, O:n jälkeen)
- **14:05.6** `hiljaisuus_2_alku`: Toinen hiljaisuus alkaa (ei tiedossa [tarkista])
- **14:25.2** `hiljaisuus_2_loppu`: Toinen hiljaisuus päättyy (ei tiedossa [tarkista])
- **14:27.4** `myrsky_kasvu`: Nopea voimistuminen alkaa (ei tiedossa [tarkista])
- **15:10.6** `myrsky_huippu`: Myrskyn voimakkain kohta (ei tiedossa [tarkista])
- **15:35.9** `toinen_paisunta`: Toinen paisunta myrskyn jälkeen (ei tiedossa [tarkista])
- **16:52.7** `loppuhuipennus`: Loppuhuipennus (ei tiedossa [tarkista])
<!-- /GEN:tarkista -->
