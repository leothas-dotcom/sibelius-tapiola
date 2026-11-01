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
