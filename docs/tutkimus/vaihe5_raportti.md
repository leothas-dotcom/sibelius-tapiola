# Vaiheen 5 raportti: teemakartta, ajat (Rattle 2022), cues- ja opastyökalut

*Tehty 1.11.2026 briefin `docs/briefit/vaihe5_teemakartta.md` mukaan. Python on ajettu aina `.venv\Scripts\python.exe -I`. GPU-vaiheita ei ajettu uudelleen: kaikki mittaus tehtiin `build/rattle_koko`-paketista
(kanavat, analyysi, aikajana, aksentit, segmentit, tapahtumat, nuotit). Mitään ei ole commitattu. `docs/`-tiedostoista on luotu vain `docs/aikajana_tulkinta.md` ja tämä raportti. Ajat ovat Rattlen kuuntelukopion
(`build/kuuntelu/rattle_kuuntelu.wav`) aikaa tiedoston alusta. **Mitään aikaa ei ole kuultu: yksikään ei ole `vahvistettu`.***

## 1. Tulokset lyhyesti
- **39 ankkuria** `annotations/teemat.json`:ssa (briefin 15 pakollista id:tä + 24 aikajanasta ja varmoista kohdista). Jaksot ovat `*_alku`/`*_loppu`-pareja: 10 jaksoa (20 ankkuria), 19 hetkeä.
- **36 ankkurille aika** (`varmuus: analyysi`, `peruste` mitatuista piirteistä), **3 ilman aikaa** (`t: null`, `varmuus: arvio`): `tuulenpuuska`, `askeleet_B`, `con_sord_J`.
- **Luottamus** (uusi kenttä ajat-tiedostossa): hyvä 17, kohtalainen 15, heikko 4 (`peikot_G_alku`, `peikot_G_loppu`, `myrsky_iskee`, `huuto`), ei 3 (aika puuttuu).
- Tarina-kenttä on tyhjä kaikilla. `teemat.json`:ssa ei ole sekunteja (tarkistettu hakemalla).
- `make_cues.py --levytys rattle2022` ja `kuunteluopas.py --levytys rattle2022` toimivat uudella rakenteella; `check_package.py --cues-only`: "Kaikki tarkistukset kunnossa".

## 2. Ankkurit ja ajat (Rattle 2022)

| id | aika (s) | luottamus | piirre, johon aika perustuu |
|---|---|---|---|
| avaus_patarumpu | 7,675 | hyvä | ensimmäinen ääni, iskut z 12,0, patarumpu_matala 1,00 |
| jouset_tulevat | 8,93 | kohtalainen | taso +5,8 dB soolon päättyessä; perhe viiveellisistä luokista (viulu 11,5 s) |
| kayratorvet_vastaavat | 13,13 | kohtalainen | vaskikanava 0,30 → 0,45, käyrätorvi 0,10–0,17 |
| puhaltimet_tulevat | 26,43 | kohtalainen | puupuhaltimet-kanava > 0,5, klarinetti 27,3 s |
| tuulenpuuska | null | – | oktatonista piirrettä ei voi mitata; ehdokas 48 s |
| vaskien_isku | 45,327 | hyvä | aksentti z 32,9 |
| hiljaisuus_1 | 58,1 – 61,4 | hyvä | taso < −60 dBFS 3,3 s |
| askeleet_B | null | – | askel-kanavaa ei ole; ehdokkaat 129,67 / 124,6 s |
| urkupiste_H1 | 179,33 – 191,83 | kohtalainen | sama sävel midi 35,1 12,5 s |
| nopea_liike_1 | 280,9 – 303,7 | kohtalainen | liiketiheys ≥ 2,5/s |
| peikot_G | 383,04 – 390,3 | heikko | V5-sääntö, teoksen suurin liiketiheys, huilu 0,37 |
| con_sord_J | null | – | sordiinoa ei voi mitata; ehdokkaat 519,9 / 496,3 s |
| jousijakso_urkupiste_E | 496,3 – 502,4 | kohtalainen | jouset > 0,6, urkupiste E3, matalin painopiste |
| hiljainen_jakso | 597,2 – 613,6 | hyvä | taso < −50 dBFS 16,4 s |
| vaski_tutti_620 | 621,607 | hyvä | aksentti z 8,5, vaskit ja patarummut sisään |
| auringonsade | 680,03 (– 685,13) | kohtalainen | V6: C+E+G 58 % chromasta, 5,1 s |
| M_ennakko | 685,13 (– 710,7) | hyvä | tekstuurimuutos: liike 0,05 → 2,21/s, vaski 0,01 → 0,34 |
| jannitejakso | 711,0 – 755,5 | kohtalainen | jännite > 0,7, selkeys < 0,5, jouset |
| allegro_moderato_O | 756,5 – 768,9 | kohtalainen | käyrätorvi- ja trumpetti/pasuunapaisunnat vuorottelevat |
| hiljaisuus_2 | 845,6 – 865,2 | hyvä | taso < −60 dBFS 19,6 s |
| myrsky_nakyy | 857,1 | kohtalainen | jouset-kanava > 0,05 hiljaisuuden jälkeen, taso ≤ −60 dBFS |
| myrsky_kasvu | 867,4 | hyvä | jouset 0,10 → 0,74, +31 dB 865–875 s |
| myrsky_iskee | 890,5 | heikko | taso −29 → −17 dBFS, +8,8 dB/s; kolme ehdokasta |
| myrsky_huippu | 910,6 | hyvä | koko äänitteen suurin 1 s taso −15,2 dBFS |
| toinen_paisunta | 935,9 | hyvä | taso −50 → −32 dBFS 2 s:ssa |
| huuto | 970,0 | heikko | jouset nousevat esiin myrskyn laannuttua, viulu 0,21 |
| loppuhuipennus | 1012,7 | hyvä | taso −16,8 dBFS (2. suurin) |
| loppu_Hduuri | 1024,65 – 1051,43 | hyvä | iskunomainen H-duurin alku, V8-chroma |
| musiikki_loppuu | 1051,6 | hyvä | RMS < huoneen kohina + 10 dB |

Täydet perusteet, vaihtoehdot ja ehdokkaat: `annotations/ajat_rattle2022.json`.

### Valintaperusteet, joita pitää katsoa kriittisesti
- **Tahtinumeroita ei ole laskettu äänestä.** Käyttäjän antamia tahtinumeroita (B 69, M 397, O 462, ppp 523, isku 540, H-duuri 624) käytettiin kuitenkin **valitsemaan ehdokkaiden välillä**:
  mitattujen ankkurien aikojen suhde tahtimäärään (lineaarinen interpolointi). Näin valittiin `myrsky_iskee` (890,5 s; ehdokkaat 867,4 ja 897 s antaisivat ppp-alun 835 ja 871 s, mitattu 857,1 s),
  `allegro_moderato_O` (interpoloitu 773,9 s; valittu 756,5–768,9 s, toinen vaskiehdokas 806–813 s) ja `huuto` (interpoloitu 964 s; valittu 970 s). Mitään tahtinumeroa ei kirjattu äänen perusteella. `beats.json`-tahtiruudukkoa ei käytetty: sen tahtinumerointi ei vastaa partituuria (ruudukon "tahti 397" on 855,8 s, M on 685,13 s).
- `myrsky_iskee` on **paisunta, ei terävä isku**: `aksentit.py` ei listaa iskua (z ≥ 5) 840–1000 s:ssa. Samanlaisia tutti-aaltoja on 890, 897 ja 904–912 s.
- `peikot_G` on V5:n heikko ehdokas: kirjaimen G paikkaa ei voi päätellä sekunneista.
- `jouset_tulevat` 8,93 s on hetki, jolloin uusi ääni alkaa; soitinperhe tunnistetaan vasta viiveellä (PANNs).
- Briefin 'M = noin 10:54' (haastattelumuistiinpano) ei vastaa mittausta: `varmat_kohdat.md` V6/V7 antaa C-duurille 680,03 ja M:lle 685,13 s (11:20 / 11:25). Käytettiin V6/V7.
- `con_sord_J`: sordiino tummentaa spektriä, mutta spektrin painopiste vaihtelee jousilohkoissa 0,10–0,79 rekisterin ja voimakkuuden mukana; erottelevaa mittaria ei ole.

## 3. Mitä työkaluissa muutettiin
- `analysis/make_cues.py` kirjoitettu uusiksi: `--levytys <id>` (+ `--paketti`). Lukee `teemat.json` (ankkurit), `ajat_<levytys>.json` ja `levytykset.json`; kirjoittaa `cues.json`: `recording`, `themes` (ankkuriluokat), `sections` (jaksot ankkuripareista),
  `cues` (yksi per ankkuri; isku-ankkureihin liitetään lähin levytyksen isku ±0,15 s), `iskut` (aksentit.json, 90 kpl), `analyses`, `puuttuu`. Validoi: id:t, varmuus ↔ `t: null`, `t` 0–kesto, jaksoparit.
  **Poistettu:** `bars`/tahtiruudukko ja paketin `events.json`-tapahtumat (vanha `cue_*`-rakenne), koska ne olivat tahtinumeroita äänestä ja vanhan rakenteen jäänne; ajat-tiedostoa ei koskaan kirjoiteta (vahvistetut ajat säilyvät).
- `analysis/kuunteluopas.py` kirjoitettu uusiksi: `--levytys <id>`; täyttää GEN-osat `ankkurit` (aikajärjestyksessä + ilman aikaa), `minuutit` (jaksot, taso ja liike `kanavat.f32`:stä, soittimet `aikajana.json`:sta, ankkurit) ja `tarkista`
  (ei aikaa / heikko luottamus / partituuripaikka puuttuu). Luo tyhjän rungon, jos `annotations/kuunteluopas.md` puuttuu; tarinaotsikot jäävät tyhjiksi.
- `analysis/check_package.py`: `check_cues` uusittu (avaimet, id:t, `t` kelvollinen, varmuus ↔ `t`, jaksot, iskut järjestyksessä, ristiintarkistus `teemat.json` ↔ ajat ↔ `cues.json` vanhentuneisuuden varalta, ankkureita 30–60); käyttöohjeen rikkinäiset polut korjattu.
- `annotations/levytykset.json`: `rattle2022`-riville lisätty `paketti: "build/rattle_koko"`.
- `README.md`: komennot ja taulukkorivi; `annotations/kuunteluopas.md` luotu rungosta.
- Poikkeamat `docs/teemakartta_rakenne.md`:n kentistä (docs-tiedostoa ei muutettu): ankkureilla lisäksi `nimi`, `tahti_loppu`, `soittimet`, `jakso`+`reuna`, `tarkista`, ja `teemat.json`:ssa `luokat` ja `jaksot`; ajat-tiedostossa lisäksi `luottamus`, `t_loppu`, `vaihtoehdot`, `ehdokkaat`.

## 4. Mikä ei toiminut tai jäi tekemättä
- **Ilman aikaa:** `tuulenpuuska` (oktatonisuus ei erotu chromasta), `askeleet_B` (ei askel-kanavaa; `docs/analyysisuunnitelma.md` luvun 3.2 kanava on rakentamatta), `con_sord_J` (sordiinoa ei voi mitata). Ehdokkaat on kirjattu ajat-tiedostoon korvalla tarkistettavaksi.
- **Askel-kanava ja vaskiaalto-kanava** (V9, V10) rakentamatta: `allegro_moderato_O` perustuu käsin luettuihin PANNs-luokkiin, ei omaan kanavaan.
- `jousitremolo`-kanava on edelleen kuollut: `jannitejakso`n ja myrskyn "tremoloa" ei ole mitattu.
- **Kirjaimia ja tahteja ei täydennetty:** `kirjain`/`tahti` ovat null ankkureilla, joiden paikkaa lähteet eivät anna (`tarkista: true`, 29 ankkuria); käyttäjä täydentää partituurista.
- Kuunteluoppaan tarina-, soitin- ja teososat ovat tyhjiä otsikoita (käyttäjän kirjoitettavaa). Mitään aikaa ei ole vahvistettu: seuraava askel on käyttäjän kuuntelu (`annotations/kuunteluopas.md` "Tarkistuslista": ilman aikaa, heikko luottamus ensin).
- Ei ajettu: kajanus1932-levytyksen ajat (ei briefissä), `kohdista.py` (DTW-siirto uuteen levytykseen; ei vielä olemassa).

## 5. Komennot
```powershell
$py = ".venv\Scripts\python.exe"
& $py -I analysis\make_cues.py --levytys rattle2022      # 39 ankkuria (36 ajalla, 3 ilman), 10 jaksoa, 90 iskua
& $py -I analysis\kuunteluopas.py --levytys rattle2022   # 39 ankkuria, GEN-osat täytetty
& $py -I analysis\check_package.py --cues-only           # Kaikki tarkistukset kunnossa.
& $py -I analysis\check_package.py build\rattle_koko     # paketti + cues: Kaikki tarkistukset kunnossa.
```
