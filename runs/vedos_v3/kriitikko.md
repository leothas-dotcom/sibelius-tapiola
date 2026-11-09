# Kriitikko: vedos 3, teoksen alku 0:00-1:15, toinen kierros (Rattle/LSO 2022, ajat sen aikaa)

Luettu: tyyliohje kokonaan (luvut 4c ja 12 erityisesti), haastattelun kaksi viimeistä lukua, kuunteluopas 0:00-1:15, ensimmäisen kierroksen lista (`k1/kriitikko.md`). Avattu kaikki kahdeksan `koko_2fps`-ruudukkoa ja kaikki 15 `liike_*`-ruudukkoa (rumpu 2, paljastuu 2, kukkula 3, varina 3, isku 2, tauko 3). Ruudukoista on lisäksi mitattu pikselitasolla: puiden latvojen sivusiirtymä (11,5-12,0 s ja 9,0-9,3 s), viivan korkeus (8,5 / 20 / 27 / 40 / 62 / 64 / 74,5 s) ja taivaan muutos 0-7 s. Zoomattu kolme ruutua (9,2 / 22,5 / 45,7 / 52,0 s). Mitä en erota ruuduista, on sanottu. Ääntä en kuule enkä arvaa koodista.

Yleiskuva: kuva on parantunut selvästi. Viiva pysyy kuvassa koko ajan, kukkulat ovat pehmeitä, pystysäteet kukkuloiden alta ovat poissa, pilkahdukset ilman syytä ovat poissa. Jäljellä: puut eivät huoju, lumi on yhä yhtä kerrosta puiden päällä, metsä ei lue metsänä noin 19 sekuntia (26-45 s) eikä 0-7,4 s, siemen ei palaa samana.

## 0. Ensimmäisen kierroksen 18 virhettä: korjattu / osin / ennallaan

| # | Ensimmäisen kierroksen virhe | Tila | Mistä ruudusta näkee |
|---|---|---|---|
| 1 | Viiva katoaa 17,5-20,4 s | **Korjattu** | `koko_2fps_2` 17,5-19,5 s ja `koko_2fps_3` 20,0 s: viiva on himmeänä näkyvissä joka ruudussa, 20,5 s täysvahva. |
| 2 | Metsä ei huoju | **Ennallaan** | `liike_paljastuu_1` 11,5-12,0 s: latvan x-siirtymä alle 1 px (480 px leveässä ruudussa) puolen sekunnin aikana; `liike_rumpu_2` 9,0-9,3 s: 0,1-0,2 px. Silmin puut ovat paikallaan. Vain iskussa 45,4-48 s puut ovat kallellaan (ks. virhe 5). |
| 3 | Leikkaus on 2,5 s paikallaan seisova ohut valkoinen viiva | **Osin** | `liike_isku_1` 45,3 s: leveä valopylväs, jonka sisällä ohut kirkas ydin; lähimmät puut jäävät sen eteen siluetteina 45,4-46,0 s. Mutta pylväs seisoo samassa x-kohdassa ja himmenee hitaasti 45,3-48,3 s (`liike_isku_2`): kolme sekuntia pystysuoraa valoa yhdestä iskusta. |
| 4 | Lumi on maski kaiken päällä | **Ennallaan** | `koko_2fps_6` 52,0 s (zoomattu) ja `liike_isku_1` 45,7 s: pieniä hiutaleita samalla kirkkaudella puiden tummien runkojen päällä; lähempi puu ei peitä kauempaa lunta. Hiutaleiden koko vaihtelee ja isoimmat ovat sumeita, mutta mikään hiutale ei jää puun taakse. |
| 5 | Hiljaisuudessa metsä ja viiva katoavat | **Osin** | `liike_tauko_2` ja `_3` 58,5-61,4 s: lumi harvenee kerralla 58,4 -> 58,7 s, jäljelle jää harvaa isoa hiutaletta ja alareunassa matala himmeä kuusirivi. Viiva puuttuu (gis ei soi). "Metsä jää" toteutuu vain matalana kaistana, ks. K10. |
| 6 | Viiva puiden päällä 9-11,5 s | **Korjattu** | `liike_rumpu_2` 9,0-9,4 s ja zoom 9,2 s: puiden rungot peittävät viivan. |
| 7 | Paljastuessa tuodaan uutta (harjut 12,5-14,5 s) | **Osin** | `liike_paljastuu_1` 12,7-13,3 s ja `_2` 14,0-14,2 s: toinen ja kolmas harjuviiva tulevat edelleen, mutta pehmeästi häivyttäen eikä enää kovareunaisena kaistana ylhäällä. Sisältö on yhä "uutta". |
| 8 | Kukkulat ja kerrokset ilmestyvät/katoavat yhdessä ruudussa | **Osin** | Viivan katoaminen 47,2 -> 47,3 s on poissa (viiva pysyy koko `liike_isku_2`:n). Yläharjukaista ei enää ilmesty. Mutta `liike_kukkula_2` 29,3 -> 29,4 s: iso kukkula (n. 35 px) on nollassa yhdessä ruudussa; 30,1 -> 30,2 s sama. |
| 9 | Pystysäteet kukkuloiden alla | **Korjattu** | `liike_kukkula_1`-`_3` 27-31,4 s: kukkulan alla vain pehmeä vaalea täyttö, ei palkkeja. |
| 10 | Isku 0,3 s myöhässä | **Korjattu** | `liike_isku_1`: 45,2 s ei mitään, 45,3 s täysi leikkaus. Äänitteessä isku on 45,33 s. |
| 11 | Puut ilmestyvät iskun jälkeen 0,3 s:ssa ja ovat vinoja | **Ennallaan** | `liike_isku_1` 45,2 s ei lähipuita; 45,3 s matala kumpu pylvään tyvessä; 45,4 s puoliksi; 45,5 s täydet puut (yli 200 px 0,2 s:ssa). Oikealla ja alhaalla vinoja, katkenneen näköisiä kiiloja 45,6-47,9 s; 47,2-47,5 s ristikkäisiä piikkejä (ks. virhe 5 alla). |
| 12 | Fis-viiva himmenee/katoaa 65,5-66,0 ja 73,5-74,5 s | **Korjattu** | `koko_2fps_7` 66,0 s ja `koko_2fps_8` 73,5-74,5 s: viiva on joka ruudussa. |
| 13 | Viiva ilmestyy 61,4 -> 61,5 s täysvahvana | **Osin** | `liike_tauko_3` 61,4 s: heikko ohut viiva; `koko_2fps_7` 61,5 s täysi. Kaksiruutuinen häivytys, ei vielä pehmeä, mutta ei enää pamahdus. |
| 14 | Pilkahduksia ilman syytä (pisteitä taivaalla) | **Korjattu** | `koko_2fps_1`-`_4` 9-38 s: taivaalla ei pisteitä. (Pienet pisteet 40-43 s ovat lumen alku, ks. virhe 12.) |
| 15 | Harjut 14-20 s ja kukkulat 50-55 s ilman syytä | **Osin** | 50-57 s kukkuloita ei ole: korjattu. 13-20 s on yhä viiva ja kaksi samannäköistä harjuviivaa (`koko_2fps_2`, 14,0-19,5 s), joille opas ei anna riviä (ks. virhe 9). |
| 16 | Maa ei luonnu maaksi, harmaa laatta | **Osin** | 7,4-8,4 s maa aaltoilee (`liike_rumpu_1`), 13,5-20 s maa on aaltoileva kaista pienine kuusineen. Mutta 0-7,4 s ja 9-13 s alareunassa on yhä tasainen tumman harmaa laatta (`koko_2fps_1`, `koko_2fps_2` 10-12,5 s). |
| 17 | Kuusten samannäköisyys | **Ennallaan** | `koko_2fps_3` 22,5 s (zoom): sama kolmio-ääriviiva eri korkeuksina, tiheä rivi viivan alla. Lukee metsänä, ei tilana. |
| 18 | Taivas 0-7,4 s lähes staattinen | **Ennallaan** | `koko_2fps_1` 0,0-7,0 s: sumu ajelehtii mitattuna 0,27/255 puolessa sekunnissa; silmin ruudut ovat samat. Ainoa muutos on 7,4 s. |

Yhteensä: korjattu 6 (1, 6, 9, 10, 12, 14), osin 7 (3, 5, 7, 8, 13, 15, 16), ennallaan 5 (2, 4, 11, 17, 18).

## 1. Virhelista (vakavin ensin; jäljellä olevat ja uudet)

1. **Metsä ei huoju eikä tuule.** (Edellisen kierroksen virhe 2, ennallaan.) `liike_paljastuu_1` 11,5-12,0 s, `liike_rumpu_2` 9,0-9,3 s, `koko_2fps_7` 62-68 s: puut kasvavat ja häipyvät mutta niiden latvat eivät liiku sivulle (mitattuna alle 1 px puolessa sekunnissa, ruudun leveys 480 px). Käyttäjä: "Puiden huojunta ei näy." Pitäisi näkyä: metsä elää äänen mukana (4b sääntö 1, 4c "mikään ei ole staattinen"). Vain 45,4-48 s puut ovat kallellaan (puuska). **Estää.**
2. **Lumi on yhä yksi kerros puiden päällä.** (Virhe 4, ennallaan.) `koko_2fps_6` 50,0-55,5 s ja zoom 52,0 s; `liike_isku_1` 45,6-46,0 s: pieniä, kirkkaita hiutaleita on puiden tummien runkojen päällä ja taivaalla samalla tavalla. Isot sumeat hiutaleet ovat selvästi lähellä, mutta pienet eivät mene puun taakse. Pitäisi näkyä: lähempi puu peittää kauemman lumen, kaukainen lumi on puiden takana pienenä (4c: "lähempi kerros peittää kauemman lumen"). **Estää.**
3. **Metsä ei lue metsänä 0-7,4 s, 26-45 s eikä 58,5-61,4 s.** (K10; ennallaan koskien 0-7,4 s, uusi muotoilu muille.) `koko_2fps_1` 0-7,0 s: alareunassa tumma tasainen laatta ja siinä pieni sahalaitareuna. `koko_2fps_3`-`_5` 26-45 s (19 s yhtäjaksoisesti): alareunassa matala himmeä hammasrivi (kuusenlatvoja alle 20 px korkeina), muuten pelkkä horisontti ja taivas; hammasrivi lukee ruohoksi tai sahalaidaksi, ei metsäksi. `liike_tauko_2` 58,5-61,4 s sama. Käyttäjä: "Ei ole mielestäni oikein että metsää ei tuotaisi esille." Sääntö 18: hiljaisuudessa metsä jää, mutta tässä se jää niin pieneksi ja himmeäksi, ettei se lue. **Haittaa.**
4. **Siemen ei palaa tunnistettavasti samana.** (K3; uusi.) Ensimmäinen kerta `koko_2fps_1` 9,0-11,5 s ja `liike_rumpu_2`: kaksi erillistä ryhmää, vasen ja oikea, viiva täysin suora. Toinen kerta `koko_2fps_3` 21,5-25,0 s ja zoom 22,5 s: tiheä seinä koko leveydeltä, viiva aaltoileva. Puiden paikat, määrä ja korkeudet eivät täsmää. Tyyliohje 4c: "sama sävel palaa samana ryhmänä samaan paikkaan, siksi siemen tunnistuu". **Haittaa.**
5. **Iskun puut ilmestyvät 0,2 s:ssa iskun jälkeen ja ovat vinoja kiiloja.** (Virhe 11, ennallaan.) `liike_isku_1` 45,2 s: lähipuita ei ole; 45,3 s matala kumpu; 45,5 s täydet puut. Sääntö 11: elementti ei ilmesty iskussa. 45,6-47,9 s oikealla ja alhaalla vasemmalle kallistuneita terävä-kärkisiä kiiloja, 47,2-47,5 s ristikkäisiä piikkejä (`liike_isku_2`), jotka näyttävät katkenneilta paaluilta eivätkä kuusilta. Leikkauspylväs jää lisäksi 3 s samaan kohtaan (45,3-48,3 s). **Haittaa.**
6. **Kukkula sammuu yhdessä ruudussa.** (Virhe 8, osin.) `liike_kukkula_2` 29,3 -> 29,4 s ja 30,1 -> 30,2 s: iso kukkula nollaan 0,1 s:ssa. Muut kukkulat (esim. 27,7 -> 27,9 s, 30,9 -> 31,1 s) laskevat pehmeästi. Pitäisi näkyä: pehmeä häipyminen ja matala jälki (4c). **Haittaa.**
7. **Jouset puuttuvat 54,5-58 s, vaikka opas sanoo "jouset edessä" (0:54).** (Uusi.) `koko_2fps_6` 54,0 s: puut haamuina, 54,5 s poissa, 55-58 s vain matala hammasrivi ja tiheä lumi. Opas 0:54: "jousten fraasi ennen yleistaukoa, jouset edessä, tunnelma kesken jäävä." Pitäisi näkyä: kuusiryhmä(t) soivien sävelten kohdalla. Hiljaisuus alkaa vasta 58,4 s, joten ero hiljaisuuteen ei lue. **Haittaa.**
8. **Opaskohtia, joita ei näy:** 0:35 "Isku (kone)" ei saa mitään vastinetta (34,5-36,0 s vain tavallinen kukkula); 1:10 "liike kiihtyy" ja 1:11 "ylhäällä välähtää nopea kuvio" eivät lue (70,5-72,0 s taivaalla vain sumeita hiutaleita tai pisteitä, joita en erota pilkahduksista). Tyyliohje 7b: tapahtuma ilman vastinetta on virhe. **Haittaa (0:35), pieni (1:10-1:11).**
9. **Kaksi ylimääräistä harjuviivaa 12,7-20,4 s ja viidestä kukkulasta kolme ilman oppaan riviä.** (Virheet 7 ja 15, osin.) `koko_2fps_2` 13,0 / 14,0 / 15,5 / 16,0 / 17,0 s: isoja kukkuloita, joita opas ei listaa (opas luettelee kukkulat vasta 23,2 s alkaen; 0:12 "mikään uusi ei tule"). Viiva ja kaksi samannäköistä viivaa ovat vierekkäin: lukija ei tiedä, mikä on horisontti. Gis-tason putoaminen 17,8 s alkaen selittäisi viimeiset, mutta ei viivan kolminkertaistumista. **Pieni.**
10. **Maa on yhä harmaa laatta 0-7,4 s ja 9-13 s.** (Virhe 16, osin.) `koko_2fps_1` 0-7,0 s ja `koko_2fps_2` 10-12,5 s: tasainen tumma vaakakaista alareunassa, kevyt reunavalo. Patarumpusoolon 7,4 s kumpu lukee, mutta kaista ei muuten ole maa. **Pieni.**
11. **Viiva on viivoitinsuora 7,5-9,5 s ja 46-57 s.** (Uusi.) `liike_rumpu_1`-`_2` 7,5-9,4 s, `koko_2fps_5`-`_6` 46-57 s: ohut täysin suora vaakaviiva ilman aaltoa tai hohtoa; näyttää laserilta. Muualla viiva aaltoilee pehmeästi. **Pieni.**
12. **Lumi alkaa 40 s pisteinä ennen puuskaa.** (Uusi.) `liike_varina_1` 40,0-41,9 s ja `koko_2fps_5` 40-44,5 s: yksittäisiä kirkkaita pisteitä taivaalla, 43 s alkaen lisää. Opas: lumi on 0:45 tuulenpuuska. 40-44 s opas sanoo "pitkä ääni yksin". **Pieni.**
13. **Isot hiutaleet ovat sumeita harmaita suorakulmaisia laattoja.** (Uusi.) Zoom `liike_isku_1` 45,7 s ja `liike_isku_2` 46,8-48,2 s: kaksi viereistä sumeaa laattaa vierekkäin, kovareunainen suorakulmio sumeana. Näyttää viallisen renderin jäljeltä, ei hiutaleelta. **Pieni.**
14. **Patarumpujen paisutus 0:41 näkyy vasta 43,1 s ja on harju, ei värinää.** (Uusi.) `liike_varina_2` 41,0-43,0 s: maa ei värise; 43,1 s alareunaan ilmestyy uusi himmeä harjuviiva ja kuusirivi tihenee (`liike_varina_3`). Tyyliohje: maa värisee tremolossa. **Pieni.**
15. **Kulmikas kristallimainen kukkula 45,3-45,6 s.** (Uusi.) `liike_isku_1`: vasemmalle ilmestyy sahalaitainen terävä kukkula yhdessä ruudussa (45,2 -> 45,3 s) ja katoaa 45,7 s mennessä. Käyttäjä: "kulmikas, nykivä." **Pieni.**
16. **Taivas 0-7,4 s lähes staattinen.** (Virhe 18, ennallaan.) Mitattu 0,27/255 muutos 0,5 s:ssa. Hiljaisuus selittää, mutta "kamera liikkuu aina" ei lue. **Pieni.**
17. **Kuuset samaa kolmiota.** (Virhe 17, ennallaan.) Zoom 22,5 s ja 9,2 s. **Pieni.**
Jäljellä olevia virheitä on 17 (vinot X-muotoiset piikit 47,2-47,5 s sisältyvät kohtaan 5). Ensimmäiseen listaan verrattuna uusia ovat kohdat 4, 7, 8, 11, 12, 13, 14, 15 (8 kappaletta) sekä kohta 3 osittain (26-45 s ja 58,5-61,4 s).

## 2. K1: kuunteluopas rivi riviltä (0:00-1:15)

| Opas | Näkyykö oikeaan aikaan? | Mitä näkyy (ruudukko) |
|---|---|---|
| **0:07 Avaus: patarumpusoolo** | Kyllä. | Maa aaltoilee 7,4-8,4 s: kumpu oikealla 7,5 s, keskellä 7,8 s, tasoittuu 8,4 s (`liike_rumpu_1`). Aiemmin tasainen laatta (virhe 10). |
| **0:08 Pitkä gis: alkaa** | Kyllä, mahdollisesti 0,5 s aikaisin. | Ohut viiva ilmestyy 7,5 s (`liike_rumpu_1`). Opas pyöristää 0:08, joten en voi sanoa tarkemmin. Viiva on viivoitinsuora (virhe 11). |
| **0:08 Jouset tulevat** | Kyllä. | Pienet kuuset kasvavat 7,9-9,0 s, täysi ryhmä 9,0 s (`liike_rumpu_1`, `_2`). Latvojen korkeus vaihtelee; sävelkorkeutta en erota. Ei huojuntaa (virhe 1). |
| **0:12 Jouset lopettavat: gis paljastuu** | Kyllä, osin. | Puut häipyvät 11,8-13,9 s, viiva jää (`liike_paljastuu_1`). Samalla tulevat kaksi uutta harjuviivaa 12,7-14,2 s (virhe 9). |
| **0:20 Siemen toisen kerran** | Kyllä, 1-1,5 s myöhässä; ei samana. | 20,0 s ei puita (viiva himmeänä), 20,5 s pieniä puita oikealla, 21,5 s täysi seinä (`koko_2fps_3`). Ryhmä ei ole sama (virhe 4). |
| **0:25 Puhaltimien pienet kuviot: alkaa** | Kyllä. | Kukkula 23,0 s, 25,0-25,7 s (`koko_2fps_3`). |
| **0:26 Puupuhaltimet tulevat mukaan** | Kyllä. | Puut häipyvät 25,5 -> 26,0 s, viiva ja kukkulat jäävät (`koko_2fps_3`). |
| 0:35 Isku (kone) | **Ei.** | Ei vastinetta 34,5-36,0 s: vain tavallinen kukkula 34,5 s ja 36,0 s (`koko_2fps_4`). Virhe 8. |
| **0:39 Puhaltimien kuviot päättyy** | Kyllä. | 38,5-41 s viiva tasainen, vain matalat pyöreät kumpuset (`koko_2fps_4`-`_5`). |
| **0:41 Patarumpujen paisutus** | Osin, 2 s myöhässä. | 41-43 s maa ei värise; 43,1 s uusi harju alhaalla ja kuusirivi tihenee (`liike_varina_2`, `_3`). Virhe 14. |
| **0:45 Vaskien isku** | **Kyllä.** | Leikkaus 45,3 s täysi, ei 45,2 s (`liike_isku_1`); äänitteen isku 45,33 s. |
| **0:45 Tuulenpuuska** | Kyllä. | Lumi tihenee 45,1-45,2 s, puut kasvavat ja kallistuvat 45,3-46,0 s. Kallistus on ainoa kohta, jossa puut liikkuvat. |
| **0:46 Pitkä gis: päättyy (peittyy)** | Osin. | Viiva ei sammu vaan muuttuu ohueksi suoraksi viivaksi ja pysyy 46-57 s lumen ja puiden takana. "Peittyy" lukee, "päättyy" ei. |
| **0:54 Jousten fraasi ennen yleistaukoa** | **Ei.** | Puut häipyvät 54,0-54,5 s, jäljellä vain matala kuusirivi ja lumi (`koko_2fps_6`). Virhe 7. |
| **0:58 Ensimmäinen hiljaisuus alkaa** | Kyllä. | Pienet hiutaleet katoavat kerralla 58,4 -> 58,7 s, jäljelle harva iso lumi ja matala kuusirivi, viiva pois (`liike_tauko_2`). |
| **1:01 Hiljaisuus päättyy / jouset aloittavat** | Kyllä, 0,4-0,5 s myöhässä. | Viiva 61,4 s heikkona, 61,5 s täysi; ensimmäiset puut 61,5-62,0 s (`liike_tauko_3`, `koko_2fps_7`). |
| **1:01 Pitkä fis** | Kyllä. | Viiva mitattuna n. 10 px alempana kuin gis 62-64 s (150 vs 136-143 px, ruudun korkeus 270) ja pysyy koko 62-75 s, myös 66,0 s ja 73,5-74,5 s. Kukkuloita 64,5 / 65,0 / 66,5 / 67,0 / 68,5 s (`koko_2fps_7`). |
| 1:10 Liike kiihtyy | Ei erotu. | 69,0-69,5 s puut häipyvät, 70,0 s isoja puita ja kukkula vasemmalla, 71,0 s oikealla, 72,5 s vasemmalla. Tiheys ei eroa aiemmasta (`koko_2fps_7`-`_8`). |
| 1:11 Ylhäällä välähtää nopea kuvio | Ei näy. | 70,5-72,0 s taivaalla vain sumeita, lumeen näyttäviä pisteitä (`koko_2fps_8`). |
| **1:15 Ensimmäinen valon välähdys** | Ei näy (pätkä loppuu). | 74,5 s puut haamuina, viiva täysi, kukkulaa ei ole. |

## 3. K2-K10

**K2.** 12-14 s: kyllä, jousten puut väistyvät 11,8-13,9 s ja viiva jää (`koko_2fps_2`, `liike_paljastuu_1`). Samalla tulee uusia harjuviivoja (virhe 9), joten "mitään uutta ei tuoda" ei toteudu täysin. 23-45 s: kyllä, soittajat nousevat yksi kerrallaan. Lasken kuvasta noin **12 erillistä kukkulaa 23-38 s** (23,0 / 25,0-25,7 / 27,0-27,9 / 28,0-28,5 kapea terävä / 28,6-29,3 / 29,7-30,1 / 30,5-31,1 / 31,3-31,5 kapea / 32,5 / 34,5 / 36,0 / 37,5-38,0) ja kolme matalaa pyöreää kumpua 38,5, 42,4-42,9 ja 44,3-44,6 s, yhteensä 15. Opas: 23,2 / 25,6 / 27,5 / 29,0 / 30,8 / 32,4 / 34,1 / 36,5 / 39,5 / 40,9 / 42,7 / 44,6 s. Ensimmäiset kahdeksan täsmäävät noin ±0,5 s (36,5 s opas, kukkula kuvassa 36,0 s). 42,7 s ja 44,6 s (puhdas perusääni) lukevat nyt matalina pyöreinä kumpuina; 39,5 s ja 40,9 s eivät näy. Kuvassa on kolme kapeaa kukkulaa tai piikkiä (28,0, 29,8, 31,4 s) ja isompi 37,5-38,0 s, joita opas ei listaa; kapeat voivat olla "pienet kuviot", mitä en voi todentaa.

**K3.** Ei tunnistettavasti sama (virhe 4). Eroavat: ryhmien lukumäärä (kaksi erillistä vs. täysi seinä), puiden paikat ja korkeudet, viivan muoto (suora vs. aaltoileva), kasvunopeus (9,0 s täysi vs. 21,5-22,0 s täysi).

**K4.** Staattisuus: 0-7,4 s (taivas ajelehtii alle 0,3/255 per 0,5 s), 39-44 s (vain viiva ja matalat kumpuset, mutta lumi alkaa 40 s ja kumpuset liikkuvat), 58,5-61,4 s (lumi liikkuu, mikään muu ei). Puut eivät liiku sivulle (virhe 1), vaan kasvavat ja häipyvät.

**K5.** 10 fps -sarjoissa ei nykivää viivaa: viiva aaltoilee pehmeästi. Yhdessä ruudussa ilmestyy: leikkaus 45,2 -> 45,3 s (tarkoituksellinen), kulmikas kukkula 45,2 -> 45,3 s (virhe 15), viiva 61,3 -> 61,4 s (heikosti). Yhdessä ruudussa katoaa: kukkula 29,3 -> 29,4 s ja 30,1 -> 30,2 s (virhe 6), pienet hiutaleet 58,4 -> 58,7 s (tarkoituksellinen). Kuusi kasvaa yli 200 px 0,2 s:ssa 45,3-45,5 s (virhe 5).

**K6.** Lumi on yhä yksi kerros (virhe 2). Parannus: isot sumeat hiutaleet ja pienet terävät ovat eri kokoisia, joten kaksi syvyyttä on vihjattu. Hiutale ei kuitenkaan mene puun taakse. 40-44 s lumi on pisteinä taivaalla, 45 s tiheä, 56-58 s niin tiheä että puut ovat poissa kuvasta; 58,7 s alkaen harva ja iso.

**K7.** Selkeys parani. Horisontti, kukkulat ja puut lukevat; kolmen samanlaisen viivan jakso 13-20 s on sekava (virhe 9). Maa on epäselvä (harmaa laatta tai hammasrivi, virheet 3, 10). Pystypylväs 45,3-48,3 s lukee valoleikkauksena, ei selkeästi iskuna 3 s ajan (virhe 5). Oppaan syytä vailla: 40 s alkava lumi, isot kukkulat 13-17 s, 29,7-30,1 s ja 37,5-38,0 s, kristallikukkula 45,3 s.

**K8.** Luku 4c: kerrostumat, viiva, kukkulat, leikkaus ja puiden siluetit toteutuvat. Rikkoutuu: "mikään ei ole staattinen" (puut, virhe 1), lumi kerrosten välissä (virhe 2), "mikään, mikä soi, ei jää näkymättä" (0:35, 0:54, virheet 7-8), jousten kuusiryhmät puuttuvat 26-45 s ja 54-58 s (opas sanoo jousten soivan 0:54). Luku 12 sääntö 11 (puut ilmestyvät iskussa, virhe 5), sääntö 18 (metsä jää: vain hammasrivi). Halpaa: viivoitinsuora viiva (virhe 11) ja suorakulmaiset sumeat hiutaleet (virhe 13); kukkulat ovat teräväkärkisiä vuoria kärkihohtoineen, ei "pyöreitä kumpuja", mutta opas sallii terävän huipun runsaalla soinnilla. Ei taajuuskorjainpylväitä, ei neonviivaa lukuun ottamatta suoraa viivaa, ei joulukuusiriviä lukuun ottamatta 22,5 s seinää.

**K9.** 0-7 s pimeä, odottava: välittyy hyvin (tumma sumu, mikään ei liiku), mutta laatta alareunassa on halpa. 8-12 s "synkkä, yksi valoisa sävel": välittyy parhaiten: kirkas viiva tummien kuusten takana. 25-45 s autius: välittyy: sininen tyhjä kenttä, yksi valoisa viiva, kukkula kerrallaan; metsä puuttuu, mutta se sopii siemen-ajatukseen. 0:41 varoitus: ei lue (virhe 14). 0:45 uhka: leikkaus on voimakas ja lähipuut siluetteina, mutta vinot kiilat ja ristikkäiset piikit näyttävät rikkoutuneilta; uhka lukee, kauneus ei. 0:58 pidätetty hengitys: lukee nyt paremmin kuin ensimmäisellä kierroksella (harva iso lumi, hiljainen sumu), mutta metsä on kadonnut. **Heikoin kuva: 54,5-58 s** (ei puita, viiva ohut ja katoaa 56,5 s, vain sakea lumi, jousten fraasi ei näy) ja toiseksi heikoin 0-7,4 s (laatta ja tyhjä).

**K10.** Metsä jossain muodossa joka ruudussa: kyllä muodollisesti (alareunassa hammasrivi tai laatan sahalaitareuna), mutta ei lukevana metsänä 0-7,4 s, 26-45 s ja 58,5-61,4 s. Hiljaisuudessa 58,5-61,4 s elementit lakkaavat (viiva, kukkulat ja puut pois; lumi harvenee), joten sääntö 18 toteutuu elementtien osalta, mutta "metsä jää" näkyy vain 15 % korkeuden hammasrivinä. Viiva on joka ruudussa, paitsi 56,5-61,3 s, joka on ilmeisesti tarkoituksellista (gis päättyy, tauko). Gis-tason putoaminen 17,8-20,4 s: kuva pitää viivan himmeänä näkyvissä (`koko_2fps_2` 18,0-19,5 s, `koko_2fps_3` 20,0 s): kyllä.

## 4. Kolme asiaa, jotka toimivat

- Viiva on kuvassa joka ruudussa 7,5-56,5 s ja 61,4-75 s, myös gis-tason pudotessa (17,8-20,4 s) ja puiden peittäessä sen.
- Kukkulat nousevat viivasta pehmeinä yksi kerrallaan eri kohdissa 23-45 s, ja pystysäteet kukkuloiden alta ovat poissa.
- Iskun leikkaus on ruudussa 45,3 s (äänitteen isku 45,33 s), lähipuut jäävät sen eteen siluetteina, ja lumi tihenee iskun hetkellä; hiljaisuus katkeaa samassa ruudussa 58,4 -> 58,7 s.
