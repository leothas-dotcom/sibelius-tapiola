# Maailma 5 (Väike): tarkistus, vedos 5 kierros 4 (10.11.2026)

Moduuli `visual/maailma_05.js` = vedoksen 4 moduuli (`runs/v5_05/maailma_05_vedos4.js`) + vain kierroksen 4 muutokset. 203,0 s (3:23) -> 336,8 s (5:36),
Rattle / LSO 2022 (kuuntelukopio). Renderi `runs/maailma_05/osa.mp4` (133,8 s, 4014 ruutua, aa=2). Todisteet: `runs/maailma_05/tark_k4/`.
Videon aika = teoksen aika - 203,0 s. Vertailu vedokseen 4: `runs/v5_05/osa_vedos4.mp4`.

## Kierroksen 4 kohdat
| # | Kohta | Tila | Todiste |
|---|---|---|---|
| 1a | Nymfit: `pohja_katoaa` harvat ensimmäiset valot | tehty (harvat, 1-2 kerrallaan) | `k_kontakti.png` 0:06, 0:30 |
| 1b | `puhaltimet_staccato`: parit samaa polkua | tehty: kaksi valoa vierekkäin (+-0,026 kuvan korkeudesta), polku hyppää edestakaisin; osa äänistä on yksittäisiä, kun paria ei mitatusta äänestä löydy | `k_staccato.png` (28,5-30,7 s) |
| 1c | `D_pikkolo`: juova ylös ja takaisin | tehty: valot kiitävät pystysuoraan kuvan yläreunaan ja laskevat (44,2-45,3 s). **Heikkous:** juova on pystypalkki, x ei etene laaksoa pitkin (juoksu on lyhyt) | `k_D.png` |
| 1d | Grazioso-tanssi: kolme paikkaa, sama paikka palaa, painotettu kirkkaampi | tehty: vasen matala / oikea keski / keskellä korkea vuorottelevat ja palaavat; 1-7 valoa kerrallaan; painotettu ääni on voimakkaampi ja häipyy hitaammin | `k_tanssi.png` (80-84,4 s), `k_kontakti.png` 1:24, 1:30 |
| 1e | Valon muoto: pehmeä ydin noin 8 px, kehä, kylmä hopea, häivytys 0,38-0,5 s, ei tähtiä | tehty | kaikki sarjat |
| 1f | Valaisee harjannetta | **osin:** pehmeä valoallas valon alla; kuvassa se näkyy vain valoilla, jotka ovat lähellä harjannetta (vasen paikka) | `k_tanssi.png` |
| 1g | Vedoksen 4 väike säilyy `e_pitka_ja_kuviot`-kohdissa | tehty: vanhat pisteet vain 240-243,6 s ja 252-280 s; linnojen ikkunat kuten ennen, mutta päättyvät F:ään | `k_kontakti.png` 0:42-1:18 |
| 2 | Lumi liikkuu aina | tehty: lumen kertymä (sivu + putoaminen, 0,6-1,4 m/s) seuraa jousten voimaa; ei vakiopisteitä | `kuvaus`: lumiAlas kasvaa joka kohdassa; `k_eteneminen.png` |
| 3 | Kamera etenee näkyvästi | **osin:** vauhti 2,6 -> 5,0 m/s ja lähiharjanteet nostettu kuvaan (parallaksi alaosassa; harjanteet liukuvat ohi), reitti ennallaan. Kaukainen horisonttiharjanne pysyy lähes paikallaan (kaukana) | `k_eteneminen.png` (12-19 s), `k_kontakti.png` |
| 4 | Kirjain F: valot pois samassa ruudussa, pimeys nousee alhaalta | tehty: tanssin viimeinen valo 301,4-301,6 s, ruudusta 98,6 s ei valoja (`k_F.png`); pimeys nousee 5 s aikana (`pimeysNousee` 0 -> 1) ja nousee pois ennen pisaraa | `k_F.png`, `k_kontakti.png` 1:42-1:48 |
| 5 | Horisontin ellipsi pehmeäksi | tehty: hehku nousee horisontin takaa (terävä alareuna, pitkä häntä ylös, leveä). **Heikkous:** lukee nyt vaakasuorana vyöhykkeenä, ei soikiona | `k_kontakti.png` verrattuna vedokseen 4 |
| 6 | Kumipuusääntö (`uSway`) | tehty: tuulen siirtymä pienennetty (0,3+1,3j+0,6l -> 0,15+0,5j+0,2l) ja vaimenee nollaan yli 110 m päässä; harjanteiden muoto ei muutu ajan mukana | koodi; ei liikesarjaa voimakkaimmasta puuskasta (ei otettu) |

## Muut muutokset (kierroksella löydetyt virheet)
- Pisaran etäisyys skaalattu kameran vauhdin mukaan (17 m * 5/2,6), muuten kamera ohitti pisaran: pisara putoaa kuten vedoksessa 4 (`k_kontakti.png` 1:54-2:06).
- Lähiharjanteiden kohotus aiheutti kerroksen poksahduksen kameran lähellä (kerrosikkuna alkaa nyt kameran takaa, lähin kerros vaimenee pois pehmeästi) ja basson askeleen välähdyksen alaosassa (vaimennettu lähiharjanteilla). Mittaus: suurin ruutujen välinen alaosan kirkkausero 13,2 -> 3,6 (harmaasävy 0-255; `pop.py`-mittaus).

## Säilytetty vedoksesta 4 (verrattu `k_kontakti.png` vs. `v4`)
Rajakuvat HUURRE ja JAA, pisara ja sen kulku, linnat (kolme kumpua), basson askeleet, harjanteiden ulkonäkö, kiteen valon pitkä ääni, lopun paisutus. Loppu (moduuli 11_12) ei koskettu.

## Auki
- `D_pikkolo`-juova on pystypalkki yläreunassa, ei kulje laaksoa pitkin.
- Parit eivät kulje kahta eri harjannetta pitkin vaan kahta vierekkäistä valoa taivaalla; valo ei osu harjanteeseen lähellä horisonttia.
- Etenemisen parallaksi näkyy alaosan lähiharjanteissa, ei isossa kuvassa; yli 10 s jaksoja, joissa vain lumi ja lähiharjanteet liikkuvat (esim. 12-25 s), on.
- Ei tehty: kumipuutodiste voimakkaimmasta puuskasta liikesarjana; kuunteluoppaan taulukko (3:23-5:36 rivi riviltä) vain yllä olevilta osin.
- Kriitikkoa ei ajettu.


# Vedos 6 (10.11.2026): keijujen valot äänten aluissa, pisaran sulava lasku

Moduuli `visual/maailma_05.js` = vedos 5 + vain alla nimetyt muutokset (vanha: `runs/v6_05/maailma_05_vedos5.js`, vanha renderi `runs/v6_05/osa_vedos5.mp4`).
Renderi `runs/maailma_05/osa.mp4`, 4014 ruutua (ffprobe), 203,0-336,8 s, lukon kautta. Videon aika = teoksen aika - 203,0 s. Todisteet: `runs/v6_05/tark/`.

| # | Kohta | Tila | Todiste, mittaluku |
|---|---|---|---|
| 1 | Keijujen valot syttyvät täsmälleen puhaltimien äänten aluissa (`d.cues.alut`, rivi 65) | **tehty** neljässä nimetyssä kohdassa; valo täydellä kirkkaudella alun ruudussa (`Math.round(t*30)`), paikka vaihtuu samassa ruudussa, ei nousua, ei viivettä, ei omaa sykettä (`tw`-väreily poistettu), valo on poissa 0,5 s sisällä (elinaika enintään 0,15 s + häivytys 0,34-0,38 s) | `alut_203_231_korkea.txt` (pohja_katoaa, korkea): 27 alkua, 27 syttyy alun ruudussa. `alut_231_240.txt` (staccato, korkea+keski): 17/17. `alut_244_250.txt` (D_pikkolo): 8/8. `alut_281_301.txt` (grazioso): 100/108; 8 puuttuvaa ovat saman äänen toinen kaista 12-30 ms ensimmäisen jälkeen (yhdistetty yhdeksi valoksi, sama valo syttyy 0-1 ruutua aikaisemmin). Syttymisruutuja ilman alkua: 0 kaikissa. 10 s tanssista (285-295 s): `alut_285_295.txt`, alkujen ajat ja ruudut rinnakkain (52/56, loput samat yhdistetyt). Kuvassa: `tanssi_v6_82.png` (82,0-82,5 s, ruutu ruudulta: valo ilmestyy ruudussa 1:22.33 = alku 285,327 s, ei ruutua aiemmin; vanha `tanssi_v5_82.png` häipyy hitaasti) |
| 1a | `pohja_katoaa`: harvat valot | tehty: vain korkean kaistan alut, ei muuta | `alut_203_231_korkea.txt` |
| 1b | `puhaltimet_staccato`: parit | tehty: korkean kaistan alku + keskikaistan alku samassa hetkessä (+-0,05 s) = pari vierekkäin; yksittäiset alut yksittäisinä | `alut_231_240.txt` |
| 1c | `D_pikkolo`: juova, jokainen juoksun ääni on askel | **osin:** jokainen mitattu alku on askel (8/8), mutta kaistoilta (korkea+keski) alkuja tulee vain 8 kpl 244,6-250 s: juoksun 247-249 s kuvioissa ei ole erillisiä alkuja (legato), joten juova on harva. Alkuja ei keksitty | `alut_244_250.txt` |
| 1d | grazioso: painotettu ääni (`voima` > 0,45) kirkkaampi | tehty: voima > 0,45 = laji 1 + 0,35 lisäkirkkaus; kolme paikkaa ja polut kuten ennen | `alut_281_301.txt`, `tanssi_v6_82.png` |
| 1e | Kun alkuja ei tule yli 0,5 s, valoja ei ole | tehty: kuvassa 1:22.20-1:22.30 ei uusia valoja, vanhat sammuvat | `tanssi_v6_82.png` |
| 2 | Pallo (pisara) liikkuu sulavasti (rivi 66) | **tehty (mitattu)**. Syy: pisaran putoaminen oli vapaata putoamista (nopeus 5,9 m/s), joka katkesi jäähän ruudussa 128,67 s (`max(ICEY+0.9, ...)`), nopeus meni nollaan yhdessä ruudussa. Korjaus: lasku smootherstep-käyrällä 8,6 s, nopeus ja kiihtyvyys nolla molemmissa päissä; kuvaan projisoitu keskipiste, sama kamera | `pisara_v5_paikka.csv` vs `pisara_v6_paikka.csv` (ruutu ruudulta x, y, säde, 1. ja 2. erotus): suurin 2. erotus (y) 0,0086 -> 0,00052 kuvan korkeutta/ruutu²; suurin kaikkien akselien 2. erotuksen summa 0,0102 (piikki 128,67 s) -> 0,00068 (loiva nousu 133 s, kameran asettuminen). Ei piikkejä. Liikesarja `pisara_v6_seq.png` (122-135 s, 6 ruudun välein) vs `pisara_v5_seq.png` |

## Nojaa kohtiin (rivi 79: tyyli, tutkimus, käsikirjoitus)
- Valojen alut: tyyliohje 7b (staccato = erilliset pisteet ja välähdykset; isku/alku näkyy alun ruudussa, 12 kohta 10) ja luku 4d kohta 24 (nymfit hienovaraisesti, oikeissa kohdissa, käyttäjän "valot kuin keijut" säilyy; valon ulkonäkö ennallaan); tutkimus luku 13 (mitä äänestä voi mitata: alut); käsikirjoitus "Maailma 5. Väike" (yksi lyhyt ääni = yksi pilkahdus).
- Pisara: tyyliohje 4d kohta 28 (hidas, ei nykimistä) ja rivin 61 sääntö (kaikki liike sulavaa, äkillinen vain äänen iskussa; pisaran laskeutumisessa ei ole iskua), luku 5 (liike jatkuvaa); käsikirjoitus "Maailma 5": kide sulaa pisaraksi, pisara putoaa jäälle.

## Koskemattomat kohdat (vedos 5 vs vedos 6, ffmpeg psnr 2 s jaksoilta)
105-107 s, 112-114 s, 116-118 s (kide, pisaran odotus): identtiset (inf dB). 1-3 s, 50-52 s, 60-62 s, 100-102 s: 43-56 dB, eroa-kuva (50 s) tasainen, ei paikallista eroa (valon syttymisaika/häivytys vaikuttaa vain keijuvalojen ruutuihin; kooderin kohina). 133,5 s: 63 dB. Jään, lumen, kameran ja harjanteiden ulkonäkö ei muuttunut koodissa.

## Auki
- D_pikkolo-juova on harva, koska juoksun äänissä ei ole kaistoilla erillisiä alkuja (mitattu 8 alkua 5,4 s aikana).
- Grazioso: 8/108 alkua yhdistetty edelliseen (12-30 ms) yhdeksi valoksi.
- Alun 1 s (43 dB) eroa ei eritelty ruutu ruudulta; ei vaikuta tämän kierroksen kohtiin (valot alkavat vasta ensimmäisestä korkeasta alusta).
- `kuvaus()`:iin lisättiin mittakentät `pisaraRuutu`, `syttyy`, `kirkkain` (ei vaikuta kuvaan). Mittaskriptit: `runs/v6_05/pisara_mittaus.mjs`, `alut_todiste.mjs`.


# Vedos 7 (10.11.2026): keijuvalot vedoksen 5 logiikalla tarkoista nuoteista

Moduuli `visual/maailma_05.js` = vedos 6 + vain nämä muutokset (rivit 373-439, `// keijuvalot: vedoksen 5 valologiikka`):
1. Valojen valinta, paikat, korkeuden laskenta ja kynnykset palautettu täsmälleen vedoksen 5 mukaisiksi (`git show 09eac76`): pohja_katoaa (harvat), staccato (parit), D_pikkolon juova, grazioso-tanssi. `accent`, `painotettu`, `voima` kuten v5.
2. Nuottien lähde: `d.cues.alut.nuotit` (`tn`) vanhan `d.nuotit`-listan sijaan; valon alku ruudussa `Math.round(t*30)` (`lisaa`: `tt`). Kaistapohjaiset `onsets`/`lahin` poistettu. Valon elinaika ja häivytys säilytettiin vedoksen 6 arvoissa (elinaika 0,06-0,15 s, häivytys 0,34/0,38 s) ja varjostin ennallaan, koska alku-ruudun täysi kirkkaus on vedoksen 6 ratkaisu. Kamera, lumi, linnat, legato jne. käyttävät edelleen `d.nuotit`-listaa (ennallaan).
3. Puuska D_pikkolo (4:06-4:08): palautui kohdan 1 mukana.
4. Y1 (latvojen huojunta pois) PERUTTU ohjaajan viestillä: `uSway` ja latvojen liike ovat täsmälleen ennallaan (tiedoston osat ennen riviä 373 ja `FA.sort`-rivin jälkeen ovat tavu tavulta samat kuin vedoksessa 6; tarkistettu `diff`). Poistin huojunnan hetkeksi ja palautin sen; ensimmäinen renderi hylättiin ja koko osa renderöitiin uudelleen palautetulla koodilla.
5. Pisaran liike (5:25-5:33) ennallaan.

Renderi: `runs/maailma_05/osa.mp4`, `--start 203.0 --end 336.8`, lukon kautta, ffprobe: 4014 ruutua. Todisteet: `runs/maailma_05/v7/`.

## T1 liikesarjat (katsottu itse)
- `sarja_puuska_4_04.png` (4:04-4:10, 0,2 s välein): puuska näkyy. 4:06,4 (video 43,4) alkaen valojen parvi nousee kuvan yläosaan ja laskee takaisin (44,2-46,8 s, pystysuora juova ja hajaantuvia valoja), 41,8 ja 42,0 s yksittäisiä valoja ennen. Ei tyhjää kohtaa puuskan aikana.
- `sarja_tanssi_4_42.png` (4:42-4:52, 0,33 s välein): valoja ilmestyy ja häipyy kolmessa paikassa (vasen matala, oikea keski, keskellä korkea), sama paikka palaa; tyhjiä ruutuja on vain nuottien välissä.
- `sarja_staccato_3_51.png` (3:51-3:58, 0,33 s välein): parit ja yksittäiset valot (kaksi vierekkäin 30,0-31,0 s ja 32,3 s).
Huomio: kuvissa ei näy puiden muodon muutosta; latvat (harjanteet) liikkuvat vain kuten vedoksessa 6.

## T1 taulukko 4:42-4:52 (282-292 s)
`valot_282_292_v7.txt` (jokaisen valon alkuruutu, lähin tarkka nuotti, ero ruutuina; skripti `valot_taulukko.mjs`, lukee sivun `kuvaus()`:n `syttyy`-kentän):
- v7: 35 syttymisruutua, 40 valoa, **osuu tarkan nuotin ruutuun 35/35 = 100 %**.
- v5 (sama moduuli vanhalla listalla, mitattu samalla skriptillä): 19 syttymisruutua, 20 valoa; vain 3/19 osuu tarkan nuotin ruutuun (vanhan listan ajat 20-40 ms myöhässä).
- Valojen lukumäärä v7 / v5 = 40 / 20 (2,0-kertainen; vaatimus "ei putoa yli 20 %" täyttyy, mutta valoja on selvästi enemmän kuin v5:ssä: tarkka lista sisältää enemmän nuotteja ja grazioso-ryhmän 0,2 s tihennys per paikka antaa enemmän valoja. Ohjaajan harkittavaksi, ei muutettu, koska brief sanoo "samat kynnykset").
- Puuska 246-248,5 s (`D_pikkolo`): 13 syttymisruutua, 16 valoa, 13/13 osuu nuotin ruutuun; ylin nuotti 247,374 s midi 104 (4:07,4) kuten ohjaajan mittaus.

## T2 regressiomittari
Vs. vedos 6 (`vertaa_v6.txt`, `runs/vedos_v6u/osat/05.mp4`, osan alku 203,0 s):
```
669 ruutua, 6 muuttunutta jaksoa (raja mse 2.0)
  3:25.0 - 3:29.0   2.5   -> kohta 1/2: pohja_katoaa-valot (vanha lähde, uudet paikat)
  3:43.0 - 3:47.0   4.3   -> kohta 1/2: pohja_katoaa-valot
  3:49.0 - 3:51.0   4.2   -> kohta 1/2: pohja_katoaa/staccato-valot
  3:53.0 - 3:59.0  10.4   -> kohta 1/2: staccato-parit
  4:07.0 - 4:11.0  22.3   -> kohta 3: puuska D_pikkolo palautui
  4:41.0 - 5:01.0  19.6   -> kohta 1/2: grazioso-tanssi
```
Kaikki erot ovat valojen alueilla (keijuvalot); ei jaksoja kierroksen ulkopuolelta. Pisara 5:25-5:33 ei näy erona.
Vs. vedos 5 (`vertaa_v5.txt`): jaksot 3:25-3:35, 3:45-3:47, 3:49-3:59, 4:07-4:11, 4:41-5:03 ovat valoja (ajoitus ja v6:n valojen muoto); **5:25-5:33 (mse 225,6) on pisara** (vedoksen 6 tasainen liike, kohta 5). Latvoissa ei eroa vedokseen 5 (Y1 peruttu, huojunta ennallaan), joten latvaeroja ei listalla ole.

## T3 sauma
Moduulin alku (huurre-rajakuva) ja loppu (JAA-rajakuva, pisara) ovat koodissa ennallaan; vertaa.py vs. v6 ei näytä eroa jaksoilla 3:23-3:25 eikä 5:33-5:36,8. Erillistä rajakuva-ruutuvertailua ei tehty.

## Auki
- Valoja on 2x v5:een verrattuna kohdassa 4:42-4:52 (ks. yllä).
- Latvojen huojunnan 1 % / 1,5 % ylärajaa (brief Y1) ei mitattu renderistä: `uSway` (0,15 + 0,5 jouset + 0,2 legato) on ennallaan, ja se siirtää harjanteen näytteenottoa enintään noin 0,85 m, mikä on pieni harjanteen koon (kymmeniä metrejä) rinnalla; todellista latvan siirtymäprosenttia ei mitattu.
- Lumi (Y2) ei kuulu moduulin 05 kohtiin; ei tarkistettu eikä muutettu.
- `holes`-kohinan ajasta riippuva ajelehtiminen (`uTime*0.12`, harjanteen alaosan läpikuultavuus) jätettiin ennalleen, koska se ei ole latvan ääriviivassa.
- Kriitikkoa ei ajettu.

## Vedos 8: bugit ja taika

Rakentaja: moduuli 05 (`visual/maailma_05.js`), 13.11.2026. Vertailukohta `osa.mp4` (ei ylikirjoitettu), pohja `osa_v8_pohja.mp4` (taika=0, bugit korjattu), lopullinen `osa_v8.mp4` (taika=1). Kokeet ja mittaukset: `runs/maailma_05/v8_koe/`.

### Bugit
**P5 (4:04-4:49, suorakulmaiset laikut etualalla): KORJATTU.** Syy (todistettu kuvasta, `v8_koe/s0` vs `s1`): harjanteen `holes`- ja `gapT`-peitot käyttivät akselin suuntaista arvokohinaa (`vnoise`) kynnystettynä ja epäyhtenäisellä mittakaavalla (x 0,22, y 0,35), joten rungon läpikuultavat aukot olivat suorakaiteita. Korjaus: uusi `wn()` (hila kierretty ja vääristetty, `smoothstep(0,50..0,88)`), käytössä `uFixP5`-kertoimella, joka on 1 ankkureista johdetussa ikkunassa (`D_pikkolo` - 3 s ... `askeleet_fis.t_end` - 8 s, pehmeät reunat). Ikkunan ulkopuolella vanha laskenta ennallaan (S2). Liikesarjat: `sarja_p5_osa.png` (ennen), `sarja_p5_osa_v8_pohja.png` (jälkeen): laikut ovat nyt kaarevia ja pehmeäreunaisia. Pystysuorien terävien reunojen laskuri ei erottanut (reunat pehmeitä jo ennen), joten todiste on kuva.
**P6 (5:26,5-5:28, tumma kaista kovalla vaakareunalla): KORJATTU.** Syy (kuva `v8_koe/s2` vs `s3`): ei jään pinnan sävy vaan kerrosten kova katkaisu `if (s > sIce) continue;`: kerros päättyi vakiokorkeudella ruudulla, kun säde osui jäähän ennen kerrosta. Korjaus: kerros hälvenee pehmeästi (`iceCut = 1 - smoothstep(0.30, 1.0, s/sIce)`). Mittaus (alavasen neljännes, 6 rivin ikkuna, rivit 700-1000, kuva 5:27,5): suurin muutos 3,94 harmaasävyä (osa.mp4, rivillä 815) -> 0,60 (osa_v8_pohja.mp4). Lasipallo 5:25-5:33 ennallaan (kuva `v8_koe/s3/t327.5.png`).
**P2 (kalvo 3:23-3:26): ohjaajan korjaus**, sallittu ikkuna vertaa.py:ssä.

### S2.1: osa.mp4 vs osa_v8_pohja.mp4 (203,0 1 2,0)
    runs/maailma_05/osa_v8_pohja.mp4 vastaan runs/maailma_05/osa.mp4: 669 ruutua, 6 muuttunutta jaksoa (raja mse 2.0)
      3:23.0 - 3:26.0   suurin mse 19.6   (osan aika 0-3 s)
      4:03.0 - 4:15.0   suurin mse 6.4   (osan aika 40-52 s)
      4:18.0 - 4:20.0   suurin mse 2.1   (osan aika 55-57 s)
      4:23.0 - 4:26.0   suurin mse 2.6   (osan aika 60-63 s)
      4:27.0 - 4:29.0   suurin mse 2.1   (osan aika 64-66 s)
      4:35.0 - 4:46.0   suurin mse 4.7   (osan aika 72-83 s)

Jokainen jakso on joko P2 (3:23-3:26) tai P5-ikkuna (4:03-4:46, ikkunan reunat pehmeät). Muuta muutosta ei ole. P6 jää alle rajan 2,0 (kaista on tumma ja matalakontrastinen), joten sen todiste on yllä oleva rivimittaus.

### Taika (taika=1)
- **Kimallus keijuvaloihin (T1):** jokaisesta keijuvalosta lähtee 4 pientä hopeista tähtipistettä (säde noin 3 px, ristikuvio), jotka putoavat ja sammuvat 0,6 s:ssa (`fairyAt`, alku valon alun ruudussa); valot 25 % kirkkaampia (`voima` x 1,25). Valojen paikat ja ajoitus ennallaan. Liikesarja: `sarja_fairy_taika.png` vs `sarja_fairy_pohja.png`.
- **Leikki (askeleet_fis) ja U3:** askeleet = matalat alut (`d.alut`) `askeleet_fis`-jaksossa, vähintään 1,2 s välein. Askel himmentää keijuvalot ja horisontin hohteen 22 % (nousu 0,05 s, palautuu 0,45 s), ja pehmeä varjo (enintään 38 %) kulkee hohteen poikki vasemmalta oikealle 1,6 s:ssa. Mittaus: hohdekaistan (rivit 100-135/270) suhde taika/pohja laskee minimissään 0,90 (10 fps -näyte) ruuduissa 4:24,6, 4:30,7, 4:33,5, 4:35,6, 4:37,6, 4:40,6, 4:48,6, 4:52,2. Liikesarja `sarja_askel_taika.png`.
- **T1 kiteen ja harjanteen huurre pitkän e:n aikana (`e_pitka_ja_kuviot`, ikkuna sen ankkureista):** hopeisia tähtikimalluksia (säde 2,6 px x ristikuvio) latvan reunan alla aallossa, joka kulkee horisontista katsojaa kohti; paljon kimalluksia kerralla (noin 80 kuvassa 4:37), jokainen välkkyy omalla vaiheellaan. Liikesarja `sarja_kimallus_taika.png` vs `sarja_kimallus_pohja.png`.
- **Kirkkaus:** koko kuvan keskikirkkaus taika vs pohja 4:37: +0,32 %; suurin muutos koko osassa -6,6 % (4:33,5, askeleen himmennys; ei nousua). S3:n 10 % ei ylity.

### S2.2: osa_v8_pohja.mp4 vs osa_v8.mp4 (203,0 1 2,0)
    runs/maailma_05/osa_v8.mp4 vastaan runs/maailma_05/osa_v8_pohja.mp4: 669 ruutua, 13 muuttunutta jaksoa (raja mse 2.0)
      3:53.0 - 3:54.0   suurin mse 2.1   (osan aika 30-31 s)
      4:03.0 - 4:04.0   suurin mse 4.6   (osan aika 40-41 s)
      4:05.0 - 4:12.0   suurin mse 8.0   (osan aika 42-49 s)
      4:13.0 - 4:15.0   suurin mse 4.0   (osan aika 50-52 s)
      4:16.0 - 4:17.0   suurin mse 4.7   (osan aika 53-54 s)
      4:18.0 - 4:20.0   suurin mse 3.2   (osan aika 55-57 s)
      4:21.0 - 4:22.0   suurin mse 2.6   (osan aika 58-59 s)
      4:24.0 - 4:28.0   suurin mse 12.6   (osan aika 61-65 s)
      4:29.0 - 4:32.0   suurin mse 10.8   (osan aika 66-69 s)
      4:33.0 - 4:46.0   suurin mse 18.0   (osan aika 70-83 s)
      4:47.0 - 4:54.0   suurin mse 16.7   (osan aika 84-91 s)
      4:55.0 - 4:58.0   suurin mse 5.7   (osan aika 92-95 s)
      5:00.0 - 5:02.0   suurin mse 4.3   (osan aika 97-99 s)

Jokainen jakso on taikalisäyksen ikkuna: 3:53-3:54 ja 4:03-4:22 ja 5:00-5:02 keijuvalojen kimallusvanat ja kirkastus (sama valon logiikka kuin pohjassa), 4:24-4:58 askelleikki ja pitkän e:n huurre.

### Päätökset (kirjattu perusteluineen)
- P5 ja `gapT` (latvan reunan valoraot) sama kohina, koska latvan raot olivat samoja suorakaiteita (kuvasääntö 8, 20).
- P5-korjaus rajattiin ikkunaan (S2), vaikka sama virhe on muuallakin moduulissa; jos ohjaaja haluaa sen koko moduuliin, riittää `uFixP5` = 1 aina.
- Kimalluksen tiheys (kokeet t2-t5) säädettiin kuvasta: ensin ei näkynyt (virhe: ruudukon siirtymää ei vähennetty tähden paikasta), sitten liikaa (koko etuala), nyt vain harjanteen reunan alla ja kaukaisemmissa kerroksissa.
- Ei kosketa vedoksen 8 korjauksiin: D_pikkolo-puuska, paisutukset tuulena, lisälumi, keijuvalojen paikat ja ajoitus, lasipallo.
- Aukot: T2 (ikkunat) ja U1/U2/U3 muut kuin hohteen varjo eivät kuulu moduulin 05 briefiin. Kriitikkoa ei ajettu.

Ohjaajan säädöt 13.11. (taika=1 ja pohja): P5-korjaus koko moduuliin (`uFixP5` = 1; sama suorakaidevika näkyi myös 3:50–4:15 ja 4:57–5:04; kuvasäännöt 8 ja 20); huurrekimallus harvemmaksi (noin neljännes: `step(0,92)`, ennen noin sata kimallusta yhtä aikaa koko pitkän e:n ajan) ja säteet lyhyiksi. Uudet `osa_v8_pohja.mp4` ja `osa_v8.mp4` 4014 ruutua. vertaa.py osa vs pohja: 3:23–3:33 (P2 ja P5), 3:50–4:15, 4:18–4:20, 4:23–4:29, 4:35–4:46, 4:57–5:04 (P5). Pohja vs taika: 3:53–5:02, kymmenen jaksoa, kaikki keijuvalojen, askelten ja huurteen ikkunoita.

Ohjaajan korjaus uusintakriitikon jälkeen 13.11. (P-g): keijuvalon kimallusvana alkaa valon alta (−0,012) eikä sen vierestä, syttyy vasta pudotessaan (0,03–0,12 s) ja säteet ovat lyhyet; ennen ensimmäinen vanan piste näkyi valon vieressä samalla korkeudella (pari kuin silmät, S5). Liikesarja 4:49,0–4:50,1 0,1 s välein: pisteet valon alla, ei pareja. Uusi `osa_v8.mp4` 4014 ruutua. Taian lisäkierros (kriitikko P-b): huurrekimallus `step(0,87)`.
