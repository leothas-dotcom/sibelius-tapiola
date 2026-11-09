# Ohjaajan todennus: kriitikon löydökset käsikirjoituksesta (kk_tarkistus_v1, 9.11.2026)

Kriitikon raportti: `kriitikko.md` (27 löydöstä, 12 tyyliohjeen omaa ristiriitaa). Jokainen löydös on luettu
käsikirjoituksen ja tyyliohjeen tekstiä vasten, ja väitteet datasta on tarkistettu `annotations/cues.json`:sta.
Korjaukset: `docs/kuvakasikirjoitus.md` v1.1 ja `docs/visuaalinen_tyyli.md` v1.3.

Mitattu korjausten jälkeen (`analysis/check_package.py --cues-only`): 60 ottoa, 78/78 ankkuria käytetty, ei vieraita
tunnisteita, ei käsin kirjoitettuja aikoja, kaksi nimettyä pysähdystä, seitsemän kulkua ja jokainen vähintään 4 s
(lyhin kulku 5, 6 s). Tuore lukija ei ole lukenut korjattua tekstiä uudestaan.

## Löydökset

| # | Kriitikon luokka | Todennus | Mitä tehtiin |
|---|---|---|---|
| 1 | RIKKOMUS | pitää | Luvun 6 poikkeus poistettu: jokainen isku saa ympäristön vastineen iskun ruudussa. Oletus ilman Iskut-riviä: matala kaista on pohjan tärähdys, muu on massan etääntyminen; suuruus seuraa iskun voimaa. Otot 05, 17 ja 19 korjattu; "pilkahdus syttyy" poistettu. |
| 2 | RIKKOMUS | pitää | Otto 07 ja luvut 2 ja 3: rako ei vaihda väriä. Iskussa on valon leikkaus raon kohdalta, ja se on hallan värinen kuten vaskien valo aina. |
| 3 | RIKKOMUS | pitää | Otto 38: punainen ei sammu iskussa vaan jää leikkausten taakse ja haalistuu oton ajan. Leikkausten lähde nimetty. Säikeet pysyvät paikallaan, joten liikkuvia on kolme. |
| 4 | RIKKOMUS | pitää | Otto 09: runkojen varjot näkyvät lumipölyn läpi ja paksunevat. Otto 46: viimeiset rungot reunoilla, kaukana sininen usvaseinä. Otto 54: lumiset latvat nousevat vajoavasta myrskystä. |
| 5 | RISTIRIITA | pitää | Maailma 7 on aukea metsän sisällä: horisontissa on vastarannan kuusikon sahalaita. Maailmaa ei vaihdettu; lisäys on hyväksytyn rungon sisällä. |
| 6 | RIKKOMUS | pitää | Maailma 6: kaukana sinimusta usva, jossa runkojen varjot erottuvat. Otto 46 korjattu kohdassa 4. |
| 7 | RIKKOMUS | osittain: tyyliohje oli ristiriidassa itsensä kanssa | Tyyliohjeeseen nimetty poikkeus (kohta 2.1, sääntö 6). Käsikirjoitus: kerrokset menettävät eronsa, mutta lumi kulkee kolmessa etäisyydessä ja leikkaukset näyttävät kuusikon. |
| 8 | RISTIRIITA | pitää | Otto 51 ja luku 3: tihein kuva, ei vaalein; himmeämpi kuin taottu aurinko. |
| 9 | RIKKOMUS | ei pidä, kun tyyliohjeen ristiriita G1 on ratkaistu | Tyyliohje: väikkeen ja kajon koti on kaukana, ja johtaessaan elementti tulee lähemmäs. Otot 17 ja 33 ovat tämän mukaisia; otto 17 sanoo nyt syyn. |
| 10 | RIKKOMUS | pitää sanamuodon osalta | Otto 56: viiva ei kasva vaan paljastuu koko pituudeltaan. Otto 48: seinä täyttää kuvan lähestyessään. |
| 11 | RIKKOMUS | pitää (`cues.json`: klarinetti, pikkolo, bassoklarinetti) | Otto 55: kolmas ääni on toinen, matalampi hämyn ääni keskikerroksessa. |
| 12 | RISTIRIITA | pitää | Luku 3: "häivytystä mustaan". Otto 57: hiljaisin kuva, ei pimene. Otto 59: massan liike lakkaa, kajo jää ennalleen. |
| 13 | RISTIRIITA | pitää | Maailma 4: lähde on kaukainen valorako, lumi heijastaa. Otto 37: valo nousee sivulla latvojen taakse. Otto 07: leikkaus kulkee takaa eteen. |
| 14 | RISTIRIITA | pitää | Maailma 3: alla tumma usva, ja sen alta erottuu musta jään pinta, kun pohja soi. Sama sana otoissa 18 ja 20. |
| 15 | AUKKO | pitää otoissa 01, 09, 16, 28 ja 46; ei otossa 08 | Lähde nimetty viidessä otossa. Otossa 08 ei ole uutta valoa: valo katkeaa. |
| 16 | AUKKO | pitää | Otot 35 ja 38 nimeävät kolme liikkuvaa. Yleissääntöön: neljäs vastaa valollaan liikkumatta. Otossa 07 lumi on ympäristöä, ei elementti. |
| 17 | AUKKO | pitää | Luvussa 2 on kulkujen ankkurit, ja tarkistus mittaa keston. Kulut 2, 3 ja 4 on sidottu ankkureihin. |
| 18 | AUKKO | pitää | Otto 46: jouset soittavat kuulokynnyksellä, vastine on tuskin näkyvä väreily kaukaisessa usvassa. Otto 47 sanoo, miksi nauha väreilee jo ennen mitatun hiljaisuuden loppua. |
| 19 | AUKKO | ei pidä | `toinen_paisunta` on nimeltään "Huuto alkaa" ja tahdeissa 586–587, joten nousu alkaa huudosta, kuten tyyliohje sanoo. Otto 53 ja luku 7 sanovat sen nyt. |
| 20 | HUOMIO | pitää sanamuodon osalta | Otto 20: "elementit pysähtyvät". Painuminen on nimetty kohta; tyyliohjeen kohta 2.2 nimeää uppoamisen kameran teoksi. |
| 21 | HUOMIO | pitää | Kulku 1 alkaa `tuulenpuuska`, ja kamera ei muutu iskussa. Otto 38: jatkuva kiihdytys, ei nykäystä; tyyliohjeen luku 5 tarkennettu. |
| 22 | HUOMIO | pitää | Ottojen 38 ja 45 Teko on yksi asia. |
| 23 | HUOMIO | ei muutosta | Sointumatto ja pitkä säie ovat tyyliohjeen luvussa 7b. Rengas korjattu kohdassa 25. |
| 24 | HUOMIO | pitää | Tyyliohjeen 7b: `basso vaikenee` ja `paisuva sointu` lisätty riveille. Otot 19 ja 35: kameran nopeus hitaana keskiarvona. |
| 25 | HUOMIO | pitää | Otto 21: aalto jääkatossa, ei sisäkkäisiä ympyröitä. Otto 37: ei kiekkoa, ei horisonttia, ei lämmintä taivasta. |
| 26 | HUOMIO | pitää | Otto 05: kaukainen kajo nimetty johtajaksi. |
| 27 | HUOMIO | pitää | Maailma 3: kiteet ovat kuusen muotoisia. |

## Tyyliohjeen omat ristiriidat

Tyyliohje on ohjaajan luonnos ja odottaa käyttäjän hyväksyntää. Ristiriidat on ratkaistu ohjaajan valintoina, ja
käyttäjä voi kumota ne.

| # | Ratkaisu tyyliohjeessa v1.3 |
|---|---|
| G1 | Väikkeen ja kajon koti on kaukana; johtaessaan elementti tulee lähemmäs ja palaa sitten (luku 7, sääntö 13). |
| G2 | Myrsky on ainoa nimetty poikkeus kolmen kerroksen sääntöön (kohta 2.1, sääntö 6). |
| G3 | Hiljaisuudessa elementit lakkaavat ja metsä jää (kohta 2.6, sääntö 18). |
| G4 | Kamera lähtee, kun M alkaa, jatkuvalla kiihdytyksellä: rakenteen käänne, ei reaktio iskun ruudussa (luku 5). |
| G5 | Poikkeukset yhteen suuntaan ovat nimettyjä: kaksi pysähdystä ja nousu (kohta 2.3). |
| G6 | Iskun vastine näkyy iskun ruudussa; se, mikä vastaa, on jo kuvassa (kohta 8.5). |
| G7 | H-duuri on t. 624–634 ja C-duuri t. 392–396, ankkurit nimetty (luvut 3 ja 5). Loppu on kameran toinen pysähdys, ei ensimmäinen. |
| G8 | Vältettävää on punainen muualla kuin taotussa auringossa (luku 9). |
| G9 | Kameran nopeus seuraa vain suuria muutoksia (luku 5). |
| G10 | Enintään kolme liikkuu; muut pysyvät kerroksessaan (sääntö 12). |
| G11 | Linja vaihtaa sävyä liukuen, ei iskussa (luku 7b). |
| G12 | Horisontti paljastuu, kun myrsky näkyy; se tapahtuu mitatun hiljaisuuden sisällä (luku 5). |

## Mitä tarkistus ei kata

- Liikkuvien elementtien määrä otoittain on kriitikon arvio tekstistä. Se mitataan vasta kuvasta.
- Korjattua tekstiä ei ole luettu tuoreilla silmillä.
- Käsikirjoituksen luvun 8 avoimet päätökset ja puuttuva data ovat ennallaan.
