# Kanavakortti

*Soitin → mitattu kanava → tulos varmassa kohdassa → luotettavuus → korvaava lähde. Kanava on käytössä kuvan
ajoitukseen vasta, kun rivillä on ✅ ja käyttäjä on kuullut otteen. Mittaukset: `docs/tutkimus/vaihe1_raportti.md`,
pöytäkirja `build/testi60/poytakirja_0000-0060.md`. Ajat ovat kuuntelukopion aikaa (`build/kuuntelu/tapiola_kuuntelu.wav`).*

Tila 1.11.2026: vain 0–60 s mitattu (V1–V3). V4–V8 mittaamatta. **Käyttäjä ei ole vielä kuullut otetta**, joten
yhtäkään kanavaa ei ole hyväksytty.

| Soitin / ilmiö | Kanava | Varma kohta | Mitattu | Luotettavuus | Korvaava lähde |
|---|---|---|---|---|---|
| Patarummut, lyönnit | `aksentit` (10 ms) | V1 avaus | iskut 1,61 / 1,79 / 1,88 s, z 14 ja 12 | 🔶 näyttää V1:n; odottaa korvaa | partituuri + spektrogrammi |
| Patarummut, läsnäolo | `patarumpu_matala` (50–200 Hz iskuvoima) | V1 | huippu 1,60 s (arvo 1,00) | 🔶 näyttää V1:n, **ei selektiivinen** (mediaani 0,10, p95 0,68): reagoi kaikkiin matalan kaistan alkuihin | aksentit + partituuri |
| Patarummut, Demucs | `patarumpu_stemmi` (drums-stemmi) | V1 | 0,00 koko avauksessa | ❌ **kuollut**: Demucs laittaa patarummut other-stemmiin | ei käytetä |
| Patarummut, tremolo | `patarumpu_tremolo` | ei varmaa kohtaa 60 s:ssa | antaa 1 kohdissa, joissa aksentit ei löydä tremoloa | ❌ epäluotettava | aksentit.py:n tremolo + partituuri |
| PANNs timpani | `listen` timpani-luokka | V1 | huippu 1,93 s, arvo 0,16 | 🔶 heikko ja myöhässä (ikkuna) | aksentit |
| Jouset | `jouset` (perhekanava) | V2 jousten tulo | nousee 2,9–3,0 s yhtä aikaa puhaltimien ja vaskien kanssa (yhteinen other-stemmi) | ❌ ei erottele V2:ta | PANNs jouset (alla) + partituuri |
| Jouset | PANNs jousiluokat | V2 | yli 0,10 vasta 4,63 s, yli 0,20 vasta 5,23 s, huippu 5,13 s | 🔶 erottelee, mutta heikko (0,01–0,08 raaka) ja hidas | partituuri + käyttäjän korva |
| Puupuhaltimet | `puupuhaltimet` (perhekanava) | V3 puhaltimien tulo | yli 0,15 vasta 16,17 s; kuvassa selvä huippu 17–19 s ja 28–31 s | 🔶 näyttää V3:n myöhässä; ei erota avauksessa | PANNs clarinet 16,97 s, wind 18,27 s |
| Vasket | `vasket` (perhekanava) | ei varmaa kohtaa 60 s:ssa (V4 myöhemmin) | nousee avauksessa jousten mukana | ❌ ei testattu; avauksessa väärä positiivinen | V4 mitataan |
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
