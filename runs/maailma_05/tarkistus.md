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
