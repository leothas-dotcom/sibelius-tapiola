# Vaiheiden 3–4 raportti: koko Rattle / LSO 2022 -äänitys

*Tehty 1.11.2026 briefin `docs/briefit/vaihe3_4_rattle.md` mukaan. Raportoidaan vain se, minkä mittaus näytti; komento on kirjattu jokaisen luvun kohdalle.
Python on ajettu aina `.venv\Scripts\python.exe -I`. Mitään ei ole commitattu, `CLAUDE.md`:tä ei ole muutettu, `docs/`-tiedostoista on muutettu vain `docs/kanavakortti.md`
(luku lisätty loppuun). Ajat ovat Rattlen kuuntelukopion aikaa (`build/kuuntelu/rattle_kuuntelu.wav`) tiedoston alusta, digitaalinen hiljaisuus mukaan lukien; alkua ei ole leikattu.
Tahtinumeroita ei lasketa äänestä. **Mitään aikaa ei ole kuultu: kaikki V1–V8-ajat ovat varmuudeltaan "analyysi".** Rattle-ääni ei ole gitissä (`audio/`, `build/`, `*.wav`, `*.webm` on rajattu `.gitignore`:ssa).*

## 1. Yhteenveto

- **Koko teos (1078,016 s) toimi yhtenä pakettina** (`build/rattle_koko`); osia ja `stitch`:iä ei tarvittu. GPU-vaiheet kestivät yhteensä 229 s, näytönmuistin huippu 2792 Mt (CREPE), koko kortin muisti 6051 Mt (perustaso 2450 Mt, muut sovellukset mukana).
- **Kellot: 0,00 ms** kaikille johdetuille äänille ja kuuntelunäytteille kuuntelukopiota vasten; kuuntelukopio 0,00 ms lähteen neljää dekoodausta vasten.
- **Alku ja loppu:** digitaalinen hiljaisuus 0–5,054 s, huoneen kohina 5,054 s alkaen, ensimmäinen ääni 7,6 s; musiikki loppuu 1051,6 s, viimeinen ei-nolla-näyte 1057,995 s, sitten 20,0 s digitaalista hiljaisuutta tiedoston loppuun. **Aplodeja ei ole.**
- **Aikajana löysi 105 jaksoa (104 jaksorajaa jaksojen välillä)**; `segments.py` 110 jaksoa ennen yhdistämistä. Kaksi lähes hiljaista kohtaa: 58,1–61,4 s ja 845,6–865,2 s (taso huoneen kohinan tasolla).
- **V1–V8 ehdokasajat (analyysi):** V1 7,68 s · V2 8,93 s · V3 26,4 s (vaihtoehto 13,1 s) · V4 45,33 s · V5 383,0 s (heikko) · V6 680,0–685,1 s · V7 685,13 s · V8 1025,5–1051,4 s.
- **Soitinluokat:** kontrabasso (suurin 0,049), saksofoni (0,019) ja rumpujen pyörre (0,0004) eivät koskaan ylitä 0,05:tä. Käyrätorvi erottuu osittain trumpetista ja pasuunasta; trumpetti ja pasuuna eivät erotu toisistaan. Huilu ja klarinetti vuorottelevat. Sello erottuu kontrabassosta vain siksi, ettei kontrabasso nouse lainkaan. Oboeta, fagottia ja englannintorvea ei ole mallin luokissa.
- **Vire:** avaus 0–60 s +4,8 c A=440:stä (14 säveltä); koko teos +5,6 c (98 säveltä). Ei korjattu.
- Kuolleet kanavat: `jousitremolo`, `patarumpu_stemmi` V1:ssä, `patarumpu_tremolo`, `soitin_double_bass`.

## 2. Konfiguraatio ja levytykset

`analysis/config.json`: `lahde` = `audio/vertailu/rattle_lso_2022.webm`, `kuuntelukopio` = `build/kuuntelu/rattle_kuuntelu.wav`, lisäksi `levytys` = `rattle2022` ja `lahde_vertailu` = `audio/vertailu/rattle_lso_2022_44k.wav`.
Kajanuksen asetukset on säilytetty tiedostossa `analysis/config_kajanus1932.json`; arkisto ajetaan `$env:TAPIOLA_CONFIG = "analysis\config_kajanus1932.json"` (lisäys `lahde.py`:hin; testattu: polut osoittavat `05_Tapiola.mp3`:een ja `tapiola_kuuntelu.wav`:iin, pitkää ajoa ei tehty).
`annotations/levytykset.json`: `rattle2022` rooli "työ" (kesto 1078,016 s), `kajanus1932` rooli "arkisto" (1062,844 s).

webm/opus toimii suoraan ffmpegillä (`lahde.py`:n kautta, kuten ennen); `rattle_lso_2022_44k.wav`:iin ei tarvinnut turvautua analyysissä (se on vain vertailu kelloissa). ffmpeg poistaa opuksen alkuviiveen (`initial_padding` 312 näytettä = 6,5 ms), joten kuuntelukopion nolla on dekoodatun virran ensimmäinen näyte. `soundfile` ei lue webm:ää ("Format not recognised"), joten mp3:n "riippumaton libmpg123" -vertailu korvattiin muilla (luku 3).

## 3. Kuuntelukopio ja kellot

Komento: `.venv\Scripts\python.exe -I analysis\kuuntelukopio.py` (50 s; loki `build/kuuntelu/rattle_kuuntelukopio.log`, tulos `build/kuuntelu/rattle_kuuntelukopio.json`).
Komento sisällä: `ffmpeg -v error -y -i audio\vertailu\rattle_lso_2022.webm -ar 48000 -ac 2 -c:a pcm_s24le build\kuuntelu\rattle_kuuntelu.wav`; 51 744 768 näytettä = 1078,0160 s; SHA-256 `e3efd334802e1722b56d4a453d523c2bc0358854e968b1e43a70aa6fdb20724d`.
(`kuuntelukopio.py` muutettu: vertailutiedostot nimetään levytyksen mukaan, jotta Kajanuksen `lahde_44k.wav` ja `kuuntelukopio.json` jäävät koskematta.)

| Mitattu | Vertailu | Suurin ero | Ajautuminen |
|---|---|---|---|
| `rattle_kuuntelu.wav` (16 mitattua ikkunaa, 5–1070 s; kaksi alle −45 dBFS ikkunaa ohitettu) | ffmpeg-dekoodaus natiivilla 44,1 kHz:llä | 0,00 ms | 0,0 ppm |
| sama | ffmpeg, opus-dekooderi `opus`, 48 kHz | 0,00 ms | 0,0 ppm |
| sama | ffmpeg, opus-dekooderi `libopus`, 48 kHz | 0,00 ms | 0,0 ppm |
| sama | aiemmin dekoodattu `rattle_lso_2022_44k.wav` | 0,00 ms | 0,0 ppm |
| `soundtrack.wav`, `orig_mono.wav`, `declick_mono.wav`, `clean_mono.wav`, `clean_44k.wav`, stemmit yhteen laskettuna | kuuntelukopio | 0,00 ms | 0,0 ppm |
| kuuntelunäytteet `rattle2022_0000-0060.wav`, `_0660-0720.wav`, `_1020-1080.wav` | kuuntelukopio | 0,00 ms | −0,0 / +0,0 ppm (viimeisessä vain yksi mitattava ikkuna: ajautumista ei lasketa) |

Komennot: `kellot.py build\rattle_koko` (64 s, loki `build/logs/rattle_koko_kellot.log`), `kellot.py --file build\kuuntelu\otteet\rattle2022_<alku>-<loppu>.wav --start <alku>` (loki `build/logs/rattle_otteet_kellot.log`).
`afftdn` viivästi ääntä 551 näytettä (22,05 kHz) ja 1102 näytettä (44,1 kHz); `prepare.py` korjasi sen, minkä jälkeen mittaus on 0,00 ms.

**Alku- ja loppuhiljaisuus** (`.venv\Scripts\python.exe -I analysis\kohinaikkuna.py --choose start`, loki `build/kuuntelu/rattle_kohinaikkuna.log`; 100 ms RMS-verhokäyrä):

| Mitattu | Arvo |
|---|---|
| digitaalinen hiljaisuus alussa (kaikki näytteet 0) | 0–5,054 s (ensimmäinen ei-nolla-näyte 5,0538 s) |
| huoneen kohina ennen musiikkia | alkaa 5,054 s (−98 dBFS nousee −66 dBFS:iin 1 s:ssa); mediaani −67,6 dBFS (5,35–7,05 s) |
| ensimmäinen ääni | 7,6 s (verhokäyrä > huoneen kohina + 10 dB); 5 ms RMS > kohina + 20 dB: **7,675 s**; `analyze.py` musiikin alku 7,63 s |
| musiikki loppuu | **1051,6 s** (viimeinen 100 ms RMS > huoneen kohina + 10 dB); taso sen jälkeen −59…−97 dBFS (hiljenemishäntä) |
| viimeinen ei-nolla-näyte | 1057,9946 s |
| digitaalinen hiljaisuus lopussa | 1057,995–1078,016 s (20,021 s) |
| aplodit | ei ole: tason loppu laskee tasaisesti −47 dBFS:stä (1050 s) digitaaliseen nollaan |

## 4. Kohinaikkuna ja `afftdn`-vertailu

**Ensimmäinen ajo ei kelvannut:** `kohinaikkuna.py` valitsi hiljaisimmaksi ikkunaksi 0–1 s, −240 dBFS, eli digitaalisen hiljaisuuden. Skripti korjattiin: ikkunat, joissa on yli 0,1 % täsmälleen nollanäytteitä, jätetään pois ("hiljaisin ei-digitaalinen ikkuna"); digitaaliset jaksot ja huoneen kohina kirjataan erikseen.

Ehdokkaat (`config.json` → `kohinaikkuna.ehdokkaat`):

| Haku | Ikkuna | Taso |
|---|---|---|
| alku (ensimmäiset 30 s digitaalisen hiljaisuuden jälkeen) | **5,100–6,100 s** | **−70,83 dBFS** |
| loppu | 1056,950–1057,950 s | −77,24 dBFS |
| koko tiedosto | 1056,950–1057,950 s | −77,24 dBFS |

**Valinta poikkeaa briefin kirjaimesta ("hiljaisin"): kirjattu on alun ikkuna (`--choose start`), ei koko tiedoston hiljaisin.** Syy (mitattu): loppuikkuna on viimeisen soinnun hiljenemishännässä (taso laskee −59 → −97 dBFS), ei huoneen kohinaa; sillä `analyze.py` ilmoitti musiikin alkavan 6,43 s (huoneen kohina luettiin musiikiksi, pintakohina −77,24 dBFS), alun ikkunalla 7,63 s (vastaa ensimmäistä ääntä 7,6 s; pintakohina −70,83 dBFS, `afftdn nf=-71`). Alun ikkuna sisältää huoneen kohinan nousun, joten se on hieman hiljaisempi (−70,8) kuin tasainen huoneen kohina (−67,6 dBFS).

**`afftdn`-vertailu** (`.venv\Scripts\python.exe -I analysis\afftdn_vertailu.py build\rattle_koko`, loki `build/logs/rattle_koko_afftdn_vertailu.log`): `orig_mono.wav` vs `clean_mono.wav` (22,05 kHz, Welch-kaistat, dB; ero = clean − orig):

| Ikkuna | RMS orig / clean | 100–300 Hz | 300–1000 | 1–3 kHz | 3–6 kHz | 6–10 kHz | korrelaatio |
|---|---|---|---|---|---|---|---|
| huoneen kohina 6,0–7,4 s (ei musiikkia) | −65,5 / −65,9 dBFS | −7,5 | −11,2 | −12,0 | −12,0 | −12,1 | 0,985 |
| hiljainen musiikki 569–575 s (−46 dBFS) | −46,2 / −46,2 | −0,04 | −0,01 | −0,89 | −5,9 | −12,0 | 0,998 |
| keskitaso 400–406 s (−33 dBFS) | −33,1 / −33,1 | 0,00 | 0,00 | −0,01 | −0,6 | −2,8 | 1,000 |
| hiljaisin 6 s 849,6–855,6 s (−65,6 dBFS, tauon alku) | −65,6 / −66,7 | −8,8 | −3,0 | −9,9 | −12,0 | −12,0 | 0,964 |

Tulos: `afftdn` vaimentaa pelkkää huoneen kohinaa 7–12 dB ja kaiken muun sisällön saman verran, kun kaistan taso on lähellä kohinaa (−73…−100 dBFS kaistalla); musiikissa ≥ −50 dBFS se ei muuta spektriä alle 3 kHz:n (alle 0,01 dB) ja vaimentaa 6–10 kHz:ä 2,8 dB (400 s). Hiljaisissa kohdissa (569 s, 850 s) se ohentaa ylätaajuuksia ja pp-kohdan 0,3–3 kHz:n kaistoja 3–10 dB. Haitta on siis ohut ja rajoittuu hiljaisiin kohtiin; mitään ei muutettu (päätös käyttäjälle).

## 5. Koko teos yhtenä pakettina

Komennot (kaikki `.venv\Scripts\python.exe -I`, loki `build/logs/rattle_koko_*.log`):

| Vaihe | Komento | Aika | Näytönmuisti |
|---|---|---|---|
| prepare | `analysis\prepare.py --start 0 --duration 1078.016 --out build\rattle_koko` | 32 s | – |
| analyze | `analysis\analyze.py build\rattle_koko` | 11 s | – |
| listen: Demucs `htdemucs_ft` | `analysis\listen.py build\rattle_koko --steps stemmit,soittimet,savelet` | 123,8 s | huippu 554 Mt (varattu 742 Mt) |
| listen: PANNs | (sama ajo) | 2,0 s | 635 Mt (806 Mt) |
| listen: CREPE | (sama ajo) | 100,9 s | **2792 Mt** (3362 Mt) |
| listen yhteensä | | 229,4 s | kortin muisti 2450 → 6051 Mt (+3601), käyttöaste keskim. 84 %, huippu 100 % |
| listen: beat_this | `analysis\listen.py build\rattle_koko --steps iskut --beats` | 1,7 s (kokonaisaika 5,9 s) | 698 Mt (1000 Mt); kortti 3441 Mt |
| aksentit | `analysis\aksentit.py build\rattle_koko` | 4,5 s | – |
| kanavat | `analysis\kanavat.py build\rattle_koko` | 6,4 s | – |
| interpret | `analysis\interpret.py build\rattle_koko` | 2,0 s | – |
| segments | `analysis\segments.py build\rattle_koko` | 1,1 s | – |
| check_package | `analysis\check_package.py build\rattle_koko` | – | "Kaikki tarkistukset kunnossa" |

**Yhtenä pakettina riitti:** 12 Gt:n kortilla korkein yksittäinen vaihe oli CREPE (2792 Mt), ja koko kortin muisti pysyi alle 6,1 Gt muiden sovellusten (noin 2,4 Gt) kanssa. 420 s osia (`rattle_A1`–`_A3`) ei ajettu. Beat_this ajettiin erillisenä osa-ajona (`--steps iskut`), jotta mahdollinen muistivirhe ei olisi kaatanut jo tehtyjä vaiheita; se löysi 492 tahdinalkua (tunnistettu 248, iskusta 76, laskettu 168; mediaanitempo 114,8 bpm), joita ei raportoida tahtinumeroina (pulssi on usein piilossa). Tulokset: 29 → 32 `listen`-kanavaa, 36 `analysis`-kanavaa, 36 `kanavat`-kanavaa (17 `soitin_*`), 1008 nuottia, 90 iskua, 675 patarummun lyöntiä, 198 tapahtumaa, 110 jaksoa. `patina.json`: 10 675 "naksahdusta" (594/min): puhtaalla lähteellä ne ovat `adeclick`-tunnistimen väärää tulkintaa eikä niitä käytetä.
`listen.py` muutettu: PANNs-luokkiin lisätty `Saxophone` (diagnostiikka, ks. luku 9). Pöytäkirjojen ja kanavien käyttämät `soitin_*`-kanavat tulevat `kanavat.py`:stä.

## 6. Aikajana

Komento: `.venv\Scripts\python.exe -I analysis\aikajana.py build\rattle_koko --out build\rattle_koko` → `build/rattle_koko/aikajana.md` ja `aikajana.json` (loki `build/logs/rattle_koko_aikajana.log`).
`aikajana.py` muutettu: ajo päättyy viimeiseen ei-digitaaliseen näytteeseen (rajat digitaalisen hiljaisuuden sisällä pois), uusi osio "Hiljaiset kohdat" ja osio "10 vahvinta jaksorajaa" (`segments.py` tallentaa nyt uutuuskäyrän arvon rajalla: `alku_uutuus`); `themes.mmss` ei enää tulosta "14:60.0".

**Jaksoja 105 (jaksorajoja 104 jaksojen välillä; ensimmäinen jakso alkaa musiikin alusta 7,63 s ja viimeinen päättyy 1058,0 s).** `segments.py` löysi 110 jaksoa; aikajanassa alle 2 s päässä toisistaan olevat rajat on yhdistetty. Jakson kesto: pienin 2,6 s, mediaani 8,9 s, suurin 27,6 s. Tapahtumia (`interpret.py`) 198: soitin sisään 71, soitin ulos 77, äkillinen voimistuminen 15, äkillinen hiljeneminen 16, tempomuutos 11, rakenteen muutos 8.

**Huomiot jaksoista (mitattu, ei tulkittu):**
- Tunnelman muutoksia (dynamiikka muuttuu ≥ 2 astetta): 8 (57,5 s ff → p; 62,2 s p → f; 620,4 s mf → ff; 845,6 s f → p; 868,4 s p → f; 935,2 s mf → ff; 1016,1 s ff → mf; 1051,7 s f → pp). Liikkeen harvenemisia 27, tihenemisiä 3. Soolo/ohut tekstuuri: 0 osumaa (kynnys ei lauennut: tämä tunnistin ei löydä yhtään sooloa).
- **Dynamiikkamerkit saturoituvat:** 56 jaksoa "f", 31 "ff", 14 "mf", 2 "p", 2 "pp", 1 "mp" (asteikko on suhteellinen koko äänitteen 99. persentiiliin); älä käytä niitä absoluuttisena dynamiikkana, vaan taso-dBFS-kanavaa.
- Lähes hiljaiset kohdat (taso < −60 dBFS, vähintään 1,5 s; huoneen kohina −66 dBFS): **58,1–61,4 s (3,3 s, −66,6 dBFS)** ja **845,6–865,2 s (19,6 s, −64,3 dBFS)**; lisäksi lopun hiljenemishäntä 1051,8–1058,0 s. Kohdassa 58,1–61,4 s spektrivuo on lähes nolla (keskiarvo 0,004) ja soitinluokkien suurin arvo 0,17 (jakson reunoilla); kohdan 845,6–865,2 s alkupuolella (846–855 s) soitinluokat ovat 0,00 ja loppupuolella (856–865 s) soitetaan hyvin hiljaa (taso −65…−60 dBFS, viulu 0,11 kohdassa 858 s, jännite 0,9–1,0).
- Jaksojen suurimmat liiketiheydet (alkua/s): 390,3 s (6,3/s), 383,0 s (5,8/s), 374,1 s (3,4/s), 712,1 s (3,3/s), 724,0 s (3,2/s).
- Jännite (`analysis.tension`) > 0,7 (2 s tasoitus) vähintään 5 s: 237–243, 495–501, 713–762 (katkoen), 770–778, 856–875, 887–897 s.

**10 vahvinta jaksorajaa** (uutuuskäyrän arvo rajalla, kaikkien rajojen mediaani 10,3; peruste = mitattu muutos 3 s ennen vs. 3 s jälkeen, normalisoidut kanavat; sävellaji vain ehdotus):

| # | Aika | Uutuus | Peruste (mitattu) |
|---|---|---|---|
| 1 | 62,2 s (1:02,2) | 25,4 | tauon 58,1–61,4 s jälkeen: voimakkuus 0,19 → 0,78; rekisteri 0,32 → 0,77; viulut, jouset, sellot ja kontrabassot tulevat (viulut 0,33 → 1,35, jouset 0,09 → 1,16) |
| 2 | 634,6 s (10:34,6) | 21,9 | vain sävellaji-ehdotus h-molli → as-molli; voimakkuus ja soitinperheet eivät muutu yli kynnysten (muutos on chromassa) |
| 3 | 620,4 s (10:20,4) | 20,4 | voimakkuus 0,64 → 0,76; käyrätorvet (0,08 → 0,92), trumpetit ja pasuunat (0,04 → 1,09) ja patarummut (0,01 → 0,96) tulevat |
| 4 | 506,3 s (8:26,3) | 20,2 | rekisteri nousee 0,40 → 0,79; sävellaji-ehdotus h-molli → Fis-duuri |
| 5 | 935,2 s (15:35,2) | 19,9 | voimakkuus 0,43 → 0,60; sävellaji-ehdotus fis-molli → d-molli |
| 6 | 549,6 s (9:09,6) | 19,5 | vain sävellaji-ehdotus h-molli → f-molli |
| 7 | 530,9 s (8:50,9) | 18,9 | voimakkuus 0,35 → 0,49; rekisteri 0,32 → 0,78; sävellaji-ehdotus D-duuri → Fis-duuri |
| 8 | 44,2 s (0:44,2) | 18,6 | voimakkuus 0,59 → 0,70; käyrätorvet (0,00 → 0,45), trumpetit ja pasuunat (0,00 → 0,71) ja patarummut (0,00 → 0,75) tulevat; ks. V4 |
| 9 | 124,6 s (2:04,6) | 18,4 | käyrätorvet (0,50 → 0,00) ja trumpetit ja pasuunat (0,45 → 0,00) poistuvat; viulut, sellot ja kontrabassot tulevat |
| 10 | 69,7 s (1:09,7) | 17,8 | käyrätorvet ja trumpetit ja pasuunat poistuvat (0,56 / 0,51 → 0,00); viulut (0,14 → 1,32), jouset (0,10 → 1,11), sellot ja kontrabassot tulevat |

Sävellaji-ehdotukset ovat `analyze.py`:n Krumhansl–Schmuckler-arvioita ja vaihtelevat paljon (5 s jaksoissa "As molli", "H duuri", "D duuri"…); älä käytä niitä sointuanalyysinä.

## 7. Pöytäkirjat

Komennot (`--package build\rattle_koko`; 18 kpl, 3–4 s per kpl, yhteensä alle 70 s koko loki `build/logs/rattle_koko_kuuntele.log`):
`.venv\Scripts\python.exe -I analysis\kuuntele.py --from 0 --to 60 --package build\rattle_koko`, sitten `60 120`, …, `1020 1080` (viimeinen loppuu tiedoston loppuun 1078,016 s).
Tulokset `build/rattle_koko/poytakirja_0000-0060.md/.png` … `poytakirja_1020-1080.md/.png`; kuuntelunäytteet `build/kuuntelu/otteet/rattle2022_0000-0060.wav` … `rattle2022_1020-1080.wav` (kuuntelukopiosta, 48 kHz, 24 bit; **ei kuultu**; kellot 0,00 ms, luku 3).
Yleiskuva: `.venv\Scripts\python.exe -I analysis\kuuntele.py --from 0 --to 1078.016 --step 1.0 --no-sample --name koko --package build\rattle_koko` → `build/rattle_koko/poytakirja_koko.png` ja `.md`.
`kuuntele.py` muutettu: jokaiseen pöytäkirjaan tulee taulukko yksittäisistä PANNs-soitinluokista (raaka-arvo, ruudun suurin) ja kuvaan soitinluokkien lämpökartta; `--name` antaa tulostiedostolle nimen; kuuntelunäytteen nimessä on levytys (`rattle2022_`), jotta Kajanuksen `0000-0060.wav` ei ylikirjoitu.

## 8. Varmat kohdat V1–V8: ehdokasajat (analyysi, ei kuultu)

Komento: `.venv\Scripts\python.exe -I analysis\varmat_kohdat.py build\rattle_koko` → `build/rattle_koko/varmat_kohdat.md` ja `.json` (loki `build/logs/rattle_koko_varmat_kohdat.log`).
Säännöt on kirjattu skriptiin (ei käsin kirjattuja sekunteja). Partituurin kuvaus on käyttäjän (1.11.2026). **Varmuus kaikilla: analyysi. Älä väitä, että kohta on kuultu.**

| # | Kohta | Ehdokasaika | Väli | Peruste lyhyesti |
|---|---|---|---|---|
| V1 | patarumpusoolo avaa | **7,68 s** | 7,68–8,68 s | ensimmäinen ääni; iskut 7,73 / 7,83 s; PANNs patarumpu huippu 7,70 s |
| V2 | jouset | **8,93 s** | 8,93–12,93 s | taso +5,8 dB heti soolon jälkeen; PANNs viulu vasta 11,5 s |
| V3 | puhaltimet mukaan | **26,4 s** | 26,4–29,4 s (kanava yli 0,5 jaksoina 26,4–29,5 ja 30,6–39,3 s) | puupuhallinkanava > 0,5 ja klarinettiluokka 0,05 → 0,118 |
| V4 | vaskien isku, Allegro moderato | **45,33 s** | vaskien nousu 44,4–45,3 s | aksentit z 32,9, +10 dB piikki |
| V5 | puupuhallinjakso G | **383,0 s** (heikko) | 383,0–390,2 s | puupuhaltimet × liiketiheys paras 8 s ikkuna; huilu 0,37 |
| V6 | C-duuri ennen M | **680,0–685,1 s** | 5,1 s | C+E+G 58 % chromasta, jännite 0,14, selkeys 0,81 |
| V7 | kirjain M, myrsky | **685,13 s** | 685–720 s (jännite-huippu 713–762 s) | C-duurin loppu; liiketiheys 0,05 → 2,21/s; vaski 0,01 → 0,34; tutti-isku 685,23 s |
| V8 | loppu H-duuri | **1025,5 s** | 1025,5–1051,4 s | H-duurivihje 0,66; chroma H, Fis, Es; patarumpu 0 |

### V1 patarumpusoolo: 7,68 s
- Ensimmäinen ääni 7,675 s (5 ms RMS > pintakohina −70,8 dBFS + 20 dB); sitä ennen vain huoneen kohinaa ja digitaalista hiljaisuutta. `analyze.py`: musiikki alkaa 7,63 s; interpret: "Musiikki voimistuu äkkiä (+33 dB sekunnissa)" 7,63 s.
- `aksentit.py`: iskut 7,73 s (z 12,0, kontrasti 31 dB) ja 7,83 s (z 10,9); drums-stemmin lyönnit 7,81 / 7,88 / 7,97 s; `patarumpu_matala` huippu 7,67 s (1,00); PANNs patarumpu huippu 7,70 s (0,177), laskee alle 0,02:n 8,68 s (soolo päättyy).
- Chroma soolon aikana: Fis 0,97, H 0,86 (patarumpujen sävelet), muut pienet.
- Kanavat soolon aikana: `jouset` 0,02, `puupuhaltimet` 0,01, `patarumpu_stemmi` 0,00; `vasket` 0,49 on iskun attakkiosa (PANNs-vaskiluokat 0,00). Soitinluokat: patarumpu 0,18, orkesteri 0,03, muut < 0,01. `patarumpu_tremolo` 0.
- Kanavakortti: `patarumpu_stemmi` kuollut V1:ssä; `patarumpu_matala` ja `aksentit` näyttävät V1:n.

### V2 jouset: 8,93 s
- Taso nousee 5,8 dB 0,5 s mediaaniin nähden kohdassa 8,93 s, 0,25 s patarumpusoolon päättymisen jälkeen (taso −33 → −28 dBFS, flux 0,66). `jouset`-kanava on tuolloin vasta 0,03, 0,3 kohdassa 11,4 s ja huippu 0,68 kohdassa 12,2 s.
- PANNs viulu ylittää 0,05 kohdassa 11,5 s (huippu 0,24, 11,9 s), jousisoitin huippu 0,08; interpret: "Jouset tulevat sisään" 9,9 s. Patarumpu: PANNs 0,010 (loppuu), `patarumpu_matala` laskee.
- Samassa ikkunassa (8,93–16,9 s) **vaski 0,24, käyrätorvi 0,17** (13,1–13,5 s): PANNs kuulee käyrätorvet jousten jälkeen, mikä vastaa Kajanus-mittauksessa kirjattua "vaskia jousten alla".
- Raaka-arvot: viulu 0,24, vaski 0,24, käyrätorvi 0,17, orkesteri 0,14, jousisoitin 0,08, trumpetti 0,07, pasuuna 0,07, sello 0,04.

### V3 puhaltimet mukaan: 26,4 s (vaihtoehto 13,1 s)
- Sääntö: ensimmäinen kohta V2:n jälkeen, jossa `puupuhaltimet`-kanava > 0,5 ja PANNs huilu + klarinetti + puupuhallin ≥ 0,05 seuraavan 2 s:n aikana → 26,43 s. Kanava 0,59 → 0,86 (27–29 s); PANNs klarinetti yli 0,05 kohdassa 27,3 s (ikkunassa 0,118), huilu 0,020, puupuhallin 0,021. interpret: puupuhaltimet tulevat sisään 25,5 s (0,001 → 0,074, ×40).
- **Vaihtoehto 13,1 s:** vaskit (PANNs vaski 0,24, käyrätorvi 0,17) tulevat jousten jälkeen 13,1–13,5 s ja `puupuhaltimet`-kanava nousee 0,40–0,56, **mutta huilu 0,001 ja klarinetti 0,012**: kanavan nousu on käyrätorvi, ei puupuhaltimet. Onko V3 "puhaltimet" = käyrätorvien vastaus (13 s) vai puupuhaltimet (26 s), ratkaisevat korva ja partituuri.
- Raaka-arvot V3-ikkunassa: klarinetti 0,12, vaski 0,05, orkesteri 0,04, viulu 0,04, käyrätorvi 0,03, jousisoitin 0,03, puupuhallin 0,02, huilu 0,02.

### V4 vaskien isku, Allegro moderaton alku: 45,33 s
- `aksentit.py`: vahvin isku välillä 30–120 s on 45,33 s (z 32,9; tyyppi "korkea isku"; kaistat m/k/k 1,5 / 32,6 / 99; kontrasti 12 dB). Taso nousee −40 → −32 dBFS kohdassa 44,2–45,2 s (vaskien crescendo: PANNs vaski 0,005 → 0,17 ja `vasket`-kanava 0,07 → 0,49 kohdassa 44,4–45,0 s) ja piikkaa −21,9 dBFS:iin kohdassa 45,4 s (flux 0,86).
- PANNs 3 s iskun jälkeen: vaski 0,29, orkesteri 0,25, käyrätorvi 0,12, pasuuna 0,11, trumpetti 0,07; pasuuna ylittää 0,1 ja orkesteri 0,2 kohdassa 45,4 s. `patarumpu_matala` 0,79.
- interpret: vaskipuhaltimet tulevat sisään 44,0 s; patarummut 43,2 s; jouset 45,1 s. Jaksoraja 44,2 s on 8. vahvin raja (luku 6).
- Raaka-arvot (44,3–48,3 s): vaski 0,29, orkesteri 0,25, viulu 0,13, käyrätorvi 0,12, pasuuna 0,11, jousisoitin 0,08, trumpetti 0,07, sello 0,06, patarumpu 0,04.

### V5 puupuhallinjakso, kirjain G: 383,0 s (heikko ehdokas)
- Sääntö: 8 s keskiarvo `puupuhaltimet` × `liiketiheys`, haettu V4:n ja V6:n välillä. Paras ikkuna **382,2–390,2 s**: puupuhaltimet 0,72, liiketiheys 5,29 alkua/s (teoksen suurin), huilu 0,37, klarinetti 0,13, puupuhallin 0,18, taso −40,4 dBFS, rekisteri 0,73; jakson alku = lähin `segments.py`-raja 383,04 s. interpret: puupuhaltimet tulevat sisään 6:22,3 (382,3 s; 0,015 → 0,329).
- Muut ehdokkaat samalla säännöllä: **282,2–290,2 s** (puu 0,59, liike 4,54/s, huilu 0,26), 349,2–357,2 s (puu 0,62, liike 2,70/s, huilu 0,06), 207,7–215,7 s (puu 0,57, liike 1,55/s, klarinetti 0,10).
- **Tämä on V-kohdista epävarmin:** kirjain G:n paikkaa ei voi päätellä sekunneista; ehdokkaat on järjestetty säännön pistein. Pisteet: 382 s 3,81; 282 s 2,67; 349 s 1,68; 208 s 0,89, eli kaksi ensimmäistä ovat selvästi muita edellä, mutta korva ja partituuri ratkaisevat.

### V6 C-duuri ennen kirjainta M: 680,0–685,1 s
- Pisin C-duuri-vihjejakso (`vihje_Cduuri` > 0,3 vähintään 3 s): **680,03–685,13 s (5,1 s)**. Chroma: C 0,89–1,0, E 0,66–0,95, G 0,58–0,76 (C+E+G = 58 % koko chromasta); vihje keskiarvo 0,43, huippu 0,52; sävellajin selkeys 0,81, jännite 0,14 (matala); taso −29 dBFS.
- Heti jakson jälkeen (685,13 s): liiketiheys 0,50 → 2,21 alkua/s, PANNs vaski 0,34, taso −28,6 → −23,8 dBFS (ks. V7).
- **Toinen ehdokas 641,6–645,1 s (3,5 s)**: vihje 0,47, C+E+G 62 %, selkeys 0,73, jännite 0,29; sen jälkeen liiketiheys 1,92 → 1,51 ja vaski 0,08 (ei tekstuurimuutosta). Valittu on pidempi jakso, jota seuraa selvä muutos. "Noin 5 tahtia" voidaan verrata vain kestoon (5,1 s), ei tahtimäärään.
- Raaka-arvot: vaski 0,28, orkesteri 0,22, käyrätorvi 0,14, pasuuna 0,11, viulu 0,10, trumpetti 0,08. `jousitremolo` 0,00.

### V7 kirjain M, myrsky: 685,13 s
- V6:n C-duuri päättyy 685,13 s, ja samassa kohdassa tekstuuri muuttuu: liiketiheys 0,05 → 2,21 alkua/s, PANNs vaski 0,01 → 0,34, taso −28,6 → −23,8 dBFS. `patarumpu_stemmi` piikki 685,23 s (0,80; koko teoksen ainoa yli 0,3 oleva kohta); `aksentit.py` ei listaa iskua (z ≥ 5) ikkunassa 684–688 s.
- Myrskyikkuna 685–720 s: jännite 0,67 (V6:ssa 0,14), sävellajin selkeys 0,51 (V6:ssa 0,81), liiketiheys 2,35/s. **Kromaattisin osa on 713–762 s**: jännite > 0,7 ja selkeys < 0,45 kohdissa 717–723 s ja 735–757 s; samassa ikkunassa PANNs viulu 0,71 (730,9 s), jousisektio 0,09 ja pizzicato 0,08 (729–732 s) – ainoat kohdat, joissa nämä luokat ylittävät 0,05.
- **`jousitremolo`-kanava on kuollut myrskyssä:** keskiarvo 0,014, huippu 0,23, 20 ruutua / 1050 yli 0,2. Kromaattinen jousitremolo tunnistetaan siis jännitteestä, selkeydestä ja liiketiheydestä, ei tremolokanavasta.
- Raaka-arvot 685–720 s: orkesteri 0,36, vaski 0,34, pasuuna 0,17, käyrätorvi 0,15, patarumpu 0,15, trumpetti 0,15, viulu 0,09, jousisoitin 0,08.
- Jännite on korkea myös tauon 845,6–865,2 s jälkeen (856–875 s ja 887–897 s); jos käyttäjän "M" tarkoittaa myrskyn toista aaltoa, ehdokas on siellä. Tätä ei ole tutkittu pidemmälle.
- **Huomio:** tämän raportin teon aikana ohjaaja kirjasi käyttäjän partituuritiedon (`docs/analyysisuunnitelma.md`, V7a/V7): M = t. 397 on myrskyn ennakko ja talvimyrsky alkaa t. 540. Mitattu V6/V7 (680,0–685,1 s ja 685,13 s) vastaa silloin kirjainta M (V7a), ja talvimyrskyn ehdokas on mitatuista kohdista jännite-/selkeysjakso 856–897 s heti 19,6 s hiljaisen kohdan jälkeen. Sitä ei ole tutkittu pidemmälle, koska se ei kuulunut tämän vaiheen briefiin.

### V8 loppu, H-duuri divisi-jousissa: 1025,5 s
- Viimeinen jakso, jossa `vihje_Hduuri` (3 s tasoitus) > 0,5 vähintään 10 s: **1025,47–1051,43 s (26,0 s)**; musiikki loppuu 1051,6 s, digitaalinen hiljaisuus alkaa 1057,995 s.
- Chroma jaksossa: H 0,37, Fis 0,28, Es (Dis) 0,08, B 0,06, D 0,02 (H = perusääni, Fis = kvintti, Es = suuri terssi; D = pieni terssi): suuri terssi ylittää pienen, mutta heikosti. `vihje_Hduuri` 0,66, `vihje_hmolli` 0,58 (H ja Fis ovat yhteiset). Krumhansl–Schmuckler: H-duuri, selkeys 0,84. Taso −41 dBFS (teoksen huippu −12 dBFS). Sävellajiarvio 1025–1050 s H-duuri (5 s jaksoissa 0,82–0,86).
- Patarumpu 0: PANNs 0,000, `patarumpu_stemmi` 0,00. **`patarumpu_matala` kuitenkin 0,48** (ei selektiivinen).
- Soitinluokat: viulu 0,020, orkesteri 0,015, jousisoitin 0,013; muut < 0,01. **Divisi-jouset eivät näy soitinluokissa** hiljaisessa kohdassa; H-duuri tulee chromasta. Urkupiste: H1 (MIDI 35,1) kohdassa 1033,5–1038,1 s.

## 9. Yksittäiset soittimet: PANNs-luokat sellaisinaan

Komento: `listen.py` ajaa luokat (16 + `Saxophone`), `kanavat.py` kirjoittaa ne kanaviksi `soitin_<luokka>` (raaka-arvo 0..1, 30 fps, ei normalisointia; 17 kanavaa), `kuuntele.py` pöytäkirjan taulukkoon ja lämpökarttaan, `varmat_kohdat.py` tilastot (`varmat_kohdat.md`).
**Oboe, fagotti ja englannintorvi:** AudioSetin 527 luokan listassa (`models/panns/class_labels_indices.csv`) ei ole niitä; "brass section" ei ole luokka (käytetty `Brass instrument`); `Saxophone` lisättiin diagnostiikaksi (lähin puupuhallinluokka, jonka alle oboe tai fagotti voisi valua): suurin 0,019, ei koskaan yli 0,05, eli ne eivät valu saksofoniksi.

### Koko teos (musiikin aikana 7,63–1051,6 s)

| Luokka | Suurin | Missä | > 0,05 (% ruuduista) | ensimmäinen > 0,05 |
|---|---|---|---|---|
| viulu (`violin_fiddle`) | 0,715 | 12:10,9 | 24,8 | 0:11,5 |
| sello (`cello`) | 0,377 | 8:17,6 | 7,2 | 0:47,7 |
| **kontrabasso (`double_bass`)** | **0,049** | 1:25,7 | **0,0** | **ei koskaan** |
| jousisektio (`string_section`) | 0,092 | 12:12,1 | 0,8 | 12:09,9 |
| jousisoitin (`bowed_string_instrument`) | 0,316 | 8:17,9 | 15,3 | 0:11,8 |
| pizzicato | 0,084 | 12:09,3 | 0,15 | 12:08,9 |
| huilu (`flute`) | 0,431 | 7:47,3 | 1,8 | 3:23,8 |
| klarinetti (`clarinet`) | 0,307 | 0:37,9 | 1,6 | 0:27,3 |
| **saksofoni** (diagnostiikka) | **0,019** | 0:38,5 | **0,0** | **ei koskaan** |
| puupuhallin (`wind_instrument_woodwind_instrument`) | 0,185 | 6:23,2 | 0,6 | 0:37,6 |
| käyrätorvi (`french_horn`) | 0,437 | 7:40,6 | 8,4 | 0:13,4 |
| trumpetti (`trumpet`) | 0,256 | 12:45,4 | 2,9 | 0:13,8 |
| pasuuna (`trombone`) | 0,265 | 12:45,4 | 4,4 | 0:13,8 |
| vaski (`brass_instrument`) | 0,559 | 12:45,1 | 11,9 | 0:13,1 |
| patarumpu (`timpani`) | 0,177 | 0:07,7 | 1,0 | 0:07,6 |
| **rumpujen pyörre (`drum_roll`)** | **0,0004** | 11:36,6 | **0,0** | **ei koskaan** |
| orkesteri | 0,420 | 11:01,3 | 44,3 | 0:11,5 |

**Luokat, jotka eivät koskaan ylitä 0,05:tä koko teoksessa: kontrabasso (0,049), saksofoni (0,019), rumpujen pyörre (0,0004).**

### V1–V8-ehdokaskohdissa (raaka-arvo, suurin arvo välillä)

| Kohta (väli, s) | viulu | sello | kb | jousisekt. | jousisoitin | huilu | klar. | puupuh. | torvi | trumpetti | pasuuna | vaski | patarumpu | orkesteri |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| V1 (7,68–8,68) | 0,00 | 0,00 | 0,00 | 0,00 | 0,00 | 0,00 | 0,00 | 0,00 | 0,00 | 0,00 | 0,00 | 0,00 | **0,18** | 0,03 |
| V2 (8,93–16,93) | **0,24** | 0,04 | 0,01 | 0,01 | 0,08 | 0,00 | 0,01 | 0,00 | 0,17 | 0,07 | 0,07 | **0,24** | 0,01 | 0,14 |
| V3 (25,93–29,43) | 0,04 | 0,02 | 0,01 | 0,00 | 0,03 | 0,02 | **0,12** | 0,02 | 0,03 | 0,01 | 0,01 | 0,05 | 0,00 | 0,04 |
| V4 (44,33–48,33) | 0,13 | 0,06 | 0,01 | 0,01 | 0,08 | 0,00 | 0,00 | 0,00 | 0,12 | 0,07 | 0,11 | **0,29** | 0,04 | **0,25** |
| V5 (382,2–390,2) | 0,12 | 0,05 | 0,01 | 0,01 | 0,10 | **0,37** | 0,13 | 0,18 | 0,03 | 0,01 | 0,01 | 0,03 | 0,00 | 0,17 |
| V6 (680,0–685,1) | 0,10 | 0,02 | 0,00 | 0,01 | 0,04 | 0,00 | 0,00 | 0,00 | 0,14 | 0,08 | 0,11 | **0,28** | 0,02 | 0,22 |
| V7 (685,1–720,1) | 0,09 | 0,03 | 0,01 | 0,02 | 0,08 | 0,01 | 0,02 | 0,02 | 0,15 | 0,14 | 0,17 | **0,34** | 0,15 | **0,36** |
| V8 (1025,5–1051,4) | 0,02 | 0,01 | 0,00 | 0,00 | 0,01 | 0,00 | 0,00 | 0,00 | 0,00 | 0,00 | 0,00 | 0,01 | 0,00 | 0,01 |

### Erottuvatko soittimet toisistaan?
Mitattu ruuduissa, joissa jompikumpi luokka on yli 0,05 (`varmat_kohdat.md`); mallilla ei ole oikeaa vastausta tarkistettavana, joten kyse on siitä, antaako malli luokille eri arvot, ei siitä, ovatko arvot oikein.

| Pari | Ruutuja | a > 2 × b | b > 2 × a | alle 2 × ero | korrelaatio (1 s) | Tulos |
|---|---|---|---|---|---|---|
| käyrätorvi / trumpetti | 2647 | 72,6 % | 1,1 % | 26,3 % | 0,55 | käyrätorvi hallitsee; trumpetti ei koskaan yli 2 × käyrätorvi (≥ 0,08) |
| käyrätorvi / pasuuna | 2734 | 62,7 % | 2,1 % | 35,2 % | 0,66 | käyrätorvi hallitsee; pasuuna yli 2 × käyrätorvi vain 2,1 % |
| trumpetti / pasuuna | 1427 | 0,7 % | 12,2 % | 87,1 % | **0,87** | **eivät erotu**: kulkevat yhdessä |
| huilu / klarinetti | 929 | 53,8 % | 39,7 % | 6,5 % | −0,07 | vuorottelevat: huilu 287,0–289,9, 382,5–384,1, 464,8–468,6 s; klarinetti 27,7–28,9, 36,0–38,9 s |
| sello / kontrabasso | 2245 | 100,0 % | 0,0 % | 0,0 % | 0,82 | kontrabasso ei nouse lainkaan (≤ 0,049): sello hallitsee kaikkialla |
| viulu / sello | 7778 | 89,2 % | 0,0 % | 10,8 % | 0,63 | viulu hallitsee; sello hallitsee 2 × vain 0 % ruuduista |

- **Käyrätorvet vs. trumpetit ja pasuunat:** vaskiruuduissa (vaski > 0,1; 2360 ruutua) käyrätorvi hallitsee 60,8 %, pasuuna 0,4 %, trumpetti 0,0 %; keskimääräiset osuudet käyrätorvi 0,53, trumpetti 0,21, pasuuna 0,26. Käyrätorvi-painotteisia jaksoja: 13,5–15,1 s, 75,0–76,6 s, 77,9–80,6 s, 437–462 s, 808–810 s, 924–928 s (käyrätorvi > 2 × trumpetti ja > 0,08). Trumpetti ja pasuuna eivät erotu: korrelaatio 0,87, ja suurimmissa vaskihuipuissa (V7 685–720 s) kaikki kolme ovat 0,14–0,17 yhtä aikaa.
- **Huilu vs. klarinetti:** luokat nousevat eri kohdissa (korrelaatio −0,07), eli malli erottaa ne luokkina; V3-kohdassa (26,4 s) nousee klarinetti (0,12) eikä huilu (0,02); V5-ehdokkaassa 383 s nousee huilu (0,37) ja klarinetti jää 0,13:een.
- **Sello vs. kontrabasso:** kontrabassoluokka ei koskaan ylitä 0,049:ää; sellon ja kontrabasson erottelu ei onnistu tällä mallilla. Matalat jouset tulee ottaa bass-stemmistä ja CREPE-`basso`-kanavasta.

### Muut havainnot luokista
- Jousisektio ja pizzicato ylittävät 0,05:n vain kohdissa 729–732 s (myrskyn kromaattinen osa).
- Orkesteri (0,42) on yli 0,05 ruuduista 44 %; se on yleinen tutti-merkki, ei soitin.
- Luokat nousevat 2,5–3 s jäljessä tason ja spektrin muutoksesta (V2: taso 8,93 s, viulu 11,5 s): PANNs-ikkuna on liian pitkä hetken ajoitukseen. Hetki tulee `aksentit`ista ja jaksorajoista.

## 10. Vire

Komento: `.venv\Scripts\python.exe -I analysis\vire.py build\rattle_koko --from 0 --to 60` (loki `build/logs/rattle_koko_vire.log`, `build/rattle_koko/vire.json`); lisäksi koko teos `--from 0 --to 1078` (`vire_koko.json`, loki `rattle_koko_vire_koko.log`).

| Väli | Säveliä | Mediaani | Ympyräkeskiarvo | Keskihajonta | MAD |
|---|---|---|---|---|---|
| **avaus 0–60 s** | **14** | **+4,8 c** | +2,5 c | 11,2 c | 1,6 c |
| avaus: other-stemmi (jousisävelet) | 5 | +6,2 c | +6,4 c | 1,7 c | 0,1 c |
| avaus: vocals-stemmi | 5 | +5,0 c | +6,3 c | 14,3 c | 1,5 c |
| avaus: bass-stemmi | 4 | −8,3 c | −7,5 c | 8,6 c | 5,7 c |
| koko teos | 98 | +5,6 c | +5,2 c | 9,3 c | 1,0 c |

Avauksen pitkät sävelet: As4 (MIDI 68, +4,5…+6,2 c, neljässä pätkässä 25,4–42,0 s) ja As3 (+9,1 c, 12,6–14,2 s); `vocals`-stemmin kaksi poikkeamaa (As4 −8,7 c, As3 +30,6 c) ja bass-stemmin sävelet (−17…+3 c) ovat Demucs-erottelun epävarmoja pätkiä. Vahvin mitta on `other`-stemmin +6,2 c (hajonta 1,7 c, MAD 0,1 c) ja koko teoksen mediaani +5,6 c (MAD 1,0 c): äänitys on noin 5–6 senttiä A=440:n yläpuolella (A ≈ 441,4 Hz), eli Kajanuksen +7,8 c:n kaltainen suuruusluokka mutta pienempi. Mitattu vain modulo puolisävelaskel; vireeseen ei ole koskettu.

## 11. Kanavakortti

`docs/kanavakortti.md`:n loppuun on lisätty luku "Rattle 2022, koko teos" samalla taulukkomuodolla (soitin → kanava → varma kohta → mitattu → luotettavuus → korvaava lähde). Mitään edellistä sisältöä ei ole muutettu (alkuosa on tavu tavulta ennallaan). Yhtään riviä ei ole merkitty ✅, koska mitään ei ole kuultu.

## 12. Mikä ei toiminut tai on rajoittunutta

- `kohinaikkuna.py` valitsi ensin digitaalisen hiljaisuuden (−240 dBFS); korjattu. Alun ikkuna valittiin briefin "hiljaisin"-säännön sijaan (luku 4).
- `soundfile` ei lue webm:ää, joten riippumaton libmpg123-vertailu ei ole mahdollinen; vertailuina on kaksi ffmpegin opus-dekooderia (`opus`, `libopus`), natiivi 44,1 kHz -dekoodaus ja aiempi wav (kaikki 0,00 ms). Kaikki ovat saman ffmpegin dekoodauksia.
- **Kanavat:** `jousitremolo` kuollut (myrsky 0,014 keskiarvo); `patarumpu_stemmi` kuollut V1:ssä (herää vain M-iskussa 685,2 s); `patarumpu_tremolo` epäluotettava (19 lyhyttä pätkää, V1:ssä 0); `patarumpu_matala` ei selektiivinen (0,48 V8:ssa); `soitin_double_bass` kuollut; `puupuhaltimet`- ja `vasket`-perhekanavat sekoittuvat toisiinsa ja attakkiin (13 s: käyrätorvi nostaa puupuhallinkanavaa, 7,6 s: patarumpuiskun attakki nostaa vaskikanavaa).
- **Aikajana:** dynamiikka saturoituu ("f"/"ff" 87 jaksolla 105:stä); soolotunnistin ei löytänyt yhtään sooloa; sävellaji-ehdotukset (Krumhansl–Schmuckler) ovat epävakaita ja puolet 10 vahvimmasta rajasta perustuu vain niihin.
- **PANNs:** ikkuna 2,5–3 s jäljessä (V2); kontrabasso ja rumpujen pyörre eivät nouse; vaskiluokat (trumpetti/pasuuna) eivät erotu; mallilla ei ole oboe-, fagotti- eikä englannintorviluokkaa; divisi-jouset hiljaisessa loppusoinnussa eivät näy.
- **V5 (kirjain G)** on heikko ehdokas; **V3** on kaksitulkintainen (13 s käyrätorvet / 26 s klarinetti); **V7:n M** on pääteltävissä vain V6:n lopusta (685,13 s).
- Demucs ei ole bitilleen toistettavissa (`shifts=2` satunnainen), joten pienet erot (iskujen ja stemmien tasot, vireen säveljoukko) ovat mahdollisia uudessa ajossa. Toistoa ei ajettu.
- `patina.json`: 10 675 "naksahdusta" puhtaalla lähteellä (`adeclick` tulkitsee transientteja naksahduksiksi); `aksentit.py` hylkäsi 44 iskua niiden vuoksi.
- `aksentit.py`:n `rumpu_z` saa kymmenien tuhansien arvoja drums-stemmin digitaalisen nollan lähellä (MAD → 0), joten sarake on käyttökelvoton hiljaisten kohtien jälkeen.
- Ensimmäisen `listen.py`-ajon loki on PowerShell-uudelleenohjauksen vuoksi väärällä merkistöllä (`build/logs/rattle_koko_listen.log`); luvut on luettu siitä ja ne ovat tässä raportissa oikein; `listen.json`:n `total_s` ja `gpu_seuranta` ovat beat_this-osa-ajon (1,9 s), vaiheiden `gpu`-taulukko on yhdistetty.

## 13. Mitä jäi tekemättä

- Yhtään kuuntelunäytettä ei ole kuultu eikä yhtäkään V-aikaa vahvistettu; `annotations/ajat_rattle2022.json` ja `annotations/teemat.json` eivät ole olemassa (vaihe 5, käyttäjän kuuntelun jälkeen). `make_cues.py` ja `kuunteluopas.py` eivät ole ajettu Rattlella.
- 420 s osia ei ajettu (ei tarvittu). Kajanus-arkistoa ei ajettu uudelleen uusilla työkaluilla (`TAPIOLA_CONFIG` vain testattu osoittavan oikeisiin polkuihin).
- Demucs-ajon toistettavuutta ei testattu toisella ajolla. `setup.ps1 -CheckOnly` ajettiin vaiheessa 1; tässä vaiheessa riippuvuuksiin ei ole koskettu.
- Tahtinumeroita ei raportoida; V-kohtia ei ole kohdistettu partituurin kirjaimiin (partituuria ei ole kansiossa).
- Kirjain G:n ja kirjain M:n paikkoja ei ole varmistettu muulla kuin analyysillä; vaihtoehtoiset ehdokkaat on listattu `varmat_kohdat.md`:ssä.
- `check_package.py` ei tarkista `soitin_*`-kanavien lukumäärää erikseen (vain pituudet, NaN ja nimien yksilöllisyys).

## 14. Muuttuneet ja uudet tiedostot (ei commitattu)

- Uusi: `analysis/config_kajanus1932.json`, `annotations/levytykset.json`, `analysis/afftdn_vertailu.py`, `analysis/varmat_kohdat.py`, `docs/tutkimus/vaihe3_4_raportti.md`.
- Muutettu: `analysis/config.json` (Rattle; kohinaikkuna `start`, huone-, digitaaliset jaksot), `analysis/lahde.py` (`TAPIOLA_CONFIG`), `analysis/kuuntelukopio.py` (webm/opus-vertailut, levytyskohtaiset nimet), `analysis/kohinaikkuna.py` (digitaalinen hiljaisuus, huone, musiikin alku/loppu),
  `analysis/listen.py` (+ `Saxophone`), `analysis/kanavat.py` (`soitin_*`), `analysis/kuuntele.py` (soitinluokkataulukko, lämpökartta, `--name`, näytteen nimi), `analysis/segments.py` (`alku_uutuus`), `analysis/aikajana.py` (10 vahvinta rajaa, hiljaiset kohdat, päättyminen viimeiseen ei-nollaan),
  `analysis/themes.py` (`mmss`), `README.md`, `docs/kanavakortti.md` (luku lisätty loppuun).
- Tulokset `build/rattle_koko/` (1,6 Gt): `aikajana.md/.json`, `aikajana_vahvimmat.json`, `varmat_kohdat.md/.json`, `poytakirja_*.md/.png` (18 + `koko`), `aksentit.md`, `segments.md`, `yhteenveto.md`, `vire.json`, `vire_koko.json`, `LUE_MINUT.md`; kuuntelunäytteet `build/kuuntelu/otteet/rattle2022_*.wav`; lokit `build/logs/`.
