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
