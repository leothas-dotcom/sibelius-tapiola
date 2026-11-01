# Brief: vaiheet 3–4 Rattle/LSO 2022 -äänityksellä (koko teos)

Lue ensin kokonaan: `CLAUDE.md`, `docs/analyysisuunnitelma.md`, `docs/teemakartta_rakenne.md`,
`docs/kanavakortti.md`, `docs/tutkimus/vaihe1_raportti.md`, `README.md`. Ne sitovat.

## Tilanne
Vaihe 1 teki putken ja ajoi sen 60 s paketeille `build/testi60` (Kajanus 1932) ja `build/vertailu60` (Rattle 2022).
Käyttäjä päätti 1.11.2026: **työäänitys on Rattle/LSO 2022**, `audio/vertailu/rattle_lso_2022.webm` (opus 48 kHz,
1078,04 s; dekoodattu `audio/vertailu/rattle_lso_2022_44k.wav`). Kajanus on arkisto. Lopullinen äänitys tulee
myöhemmin käyttäjältä, ja silloin sama putki ajetaan sille.

## Tavoite
Koko Rattle-äänitys on analysoitu, kuuntelukopio on totuus, ja ohjaaja voi kirjoittaa teemakartan ankkureille ajat
aikajanasta ja pöytäkirjoista. Raportti sanoo vain mitatun.

## Järjestys
1. **Konfiguraatio.** `analysis/config.json`: `lahde` → `audio/vertailu/rattle_lso_2022.webm` (dekoodaus ffmpegillä
   `lahde.py`:n kautta kuten ennen; jos webm/opus ei toimi suoraan, käytä `rattle_lso_2022_44k.wav` ja kirjaa se),
   `kuuntelukopio` → `build/kuuntelu/rattle_kuuntelu.wav`. Säilytä Kajanuksen asetukset `analysis/config_kajanus1932.json`
   -tiedostona, jotta arkisto on ajettavissa. Lisää `annotations/levytykset.json` (`docs/teemakartta_rakenne.md`):
   `rattle2022` rooli "työ", `kajanus1932` rooli "arkisto".
2. **Kuuntelukopio** `kuuntelukopio.py` → `build/kuuntelu/rattle_kuuntelu.wav` (48 kHz stereo 24 bit). `kellot.py`:
   0,00 ms lähteen suoraa dekoodausta vasten. Kirjaa alku- ja loppuhiljaisuus (tiedosto alkaa digitaalisella
   hiljaisuudella, ensimmäinen ääni noin 7,6 s; lopussa mahdollisesti aplodit: mittaa ja kirjaa, missä musiikki loppuu).
3. **Kohinaikkuna** `kohinaikkuna.py` Rattlelle (hiljaisin ei-digitaalinen 1 s ikkuna; vertailu60 käytti 4,10–5,10 s,
   −108 dBFS). Tarkista, ettei `prepare.py`:n `afftdn` tee mitään haitallista näin puhtaalle lähteelle: vertaa
   `clean_mono` ja `orig_mono` spektrejä yhdessä hiljaisessa kohdassa ja kirjaa ero.
4. **Koko teos paketteina.** Yritä ensin yhtenä pakettina `build/rattle_koko` (1078 s); jos GPU-muisti ei riitä
   (listen.py), aja 420 s osina limittäin (`build/rattle_A1`, `_A2`, `_A3`, limitys 30 s) ja `themes.stitch`.
   Jokaiselle: prepare → analyze → listen (stemmit, soittimet, sävelet; `--beats` myös, mutta tahteja ei raportoida
   tahtinumeroina) → aksentit → kanavat → interpret → segments → check_package. Yksi GPU-ajo kerrallaan. Kirjaa
   ajat ja näytönmuistin huiput.
5. **Aikajana** `aikajana.py` koko teokselle → `build/rattle_koko/aikajana.md`: jaksorajat (±0,5 s), soittimien
   tulot ja lähdöt, soolot, tunnelman muutokset, dynamiikka, liiketiheys. Tämä on teemakartan aikojen lähde.
6. **Pöytäkirjat** `kuuntele.py` koko teokselle 60 s paloina (`--from 0 --to 60`, `60 120`, …, 18 kpl), jokaiselle
   PNG, md ja kuuntelunäyte `build/kuuntelu/otteet/`. Lisäksi 1 s askeleella yksi koko teoksen yleiskuva
   `build/rattle_koko/poytakirja_koko.png` (`--step 1.0`, ilman näytettä).
7. **Varmat kohdat.** Partituurin mukaan (käyttäjä): V1 patarumpusoolo avaa; V2 jouset; V3 puhaltimet mukaan; V4
   vaskien isku avaa Allegro moderaton; V5 puupuhallinjakso kirjain G (nopeat kuviot); V6 noin 5 tahtia C-duuria
   juuri ennen kirjainta M; V7 kirjain M, myrsky, kromaattinen jousitremolo; V8 loppu H-duuri divisi-jousissa.
   Etsi jokaiselle ehdokasaika Rattlessa aikajanan, kanavien ja aksenttien perusteella, kirjaa **miksi** (mitattu
   piirre), ja merkitse varmuus "analyysi". Kirjaa myös, mitä kanava näyttää siinä kohdassa, kanavakortin riveiksi.
   Älä väitä, että kohta on kuultu.
8. **Vire** `vire.py` Rattlen avaukselle (raportoi sentit; ei korjata).
9. **Kanavakortti** täydennetään: `docs/kanavakortti.md`:n loppuun luku "Rattle 2022, koko teos" samalla
   taulukkomuodolla (soitin → kanava → varma kohta → mitattu → luotettavuus → korvaava lähde). Tämä on ainoa
   `docs/`-tiedosto, jota saat muokata, ja vain lisäämällä luvun loppuun.

10. **Yksittäiset soittimet (käyttäjän kysymys 1.11.2026: "pitäisi tarkemmin pystyä erottelemaan vielä eri
    soittimet").** Lisää pöytäkirjaan ja `kanavat.py`:hin PANNsin yksittäiset soitinluokat sellaisinaan
    (violin/fiddle, cello, double bass, flute, clarinet, oboe [jos luokka on], bassoon, French horn, trumpet,
    trombone, timpani, brass section, string section, woodwind) 30 fps -kanavina `soitin_<nimi>`. Raportoi
    V1–V8-ehdokaskohdissa, mitkä luokat nousevat ja kuinka korkealle (raaka-arvot), ja erityisesti: erottuvatko
    käyrätorvet trumpeteista ja pasuunoista, huilu klarinetista, sello kontrabassosta. Jos luokka ei koskaan
    ylitä 0,05 koko teoksessa, sano se. Tämä on mittaus nykyisen mallin rajoista, ei uusi menetelmä.

## Raportti
`docs/tutkimus/vaihe3_4_raportti.md` suomeksi: komennot, ajat, muistit; kellot; kohinaikkuna ja afftdn-vertailu;
paketit ja mahdolliset osat; aikajanan jaksot (lukumäärä, 10 vahvinta rajaa aikoineen ja perusteineen); V1–V8
ehdokasajat perusteineen; vire; mikä ei toiminut; mitä jäi tekemättä. Päivitä `README.md`:n komennot. Älä committaa.

## Säännöt
- Raportoi vain mitattu; kirjaa komento jokaisen luvun kohdalle.
- Ajat ovat Rattlen kuuntelukopion aikaa tiedoston alusta (digitaalinen hiljaisuus mukaan lukien). Älä leikkaa alkua.
- Musiikkisanasto muusikon suomeksi (sordiino, divisi, tremolo, urkupiste, patarummut; sävelnimet h-molli, H-duuri,
  C-duuri). Tahtinumeroita ei lasketa äänestä.
- Ei visuaalisia ehdotuksia, ei edellisen projektin termejä.
- Python `.venv\Scripts\python.exe -I`; ei käsin asennettuja paketteja; yksi GPU-ajo kerrallaan; pitkät ajot
  taustalla tai riittävällä aikakatkaisulla.
- Rattle-äänitys ei mene gittiin eikä videoon.
