# Palautelista

*Jokainen käyttäjän palaute yhdeksi riviksi. Tila: ✅ todennettu / 🔶 korjattu, ei todennettu / ❌ auki.
Todennus kirjataan riville (mittaus, still, kontaktiarkki tai kriitikon raportti). Mobiilipalaute
kirjataan heti aikakoodeineen (kuuntelukopion aikaa).*

| # | Pvm | Aika | Palaute (käyttäjän sanat) | Tila | Todennus |
|---|---|---|---|---|---|
| 1 | 1.11. | – | "Tämä ei ole LP. Miksi teet oletuksia edellisten projektien perusteella." | ✅ todennettu | LP-oletukset poistettu CLAUDE.md:stä ja suunnitelmasta; grep "puol\|liitos" tyhjä; muistiin kirjattu |
| 2 | 1.11. | – | "B-minor on suomeksi H-molli. Ole tarkka." | ✅ todennettu | grep "B-molli\|B-duuri" docs/ tyhjä; sääntö CLAUDE.md:ssä ja briefeissä |
| 3 | 1.11. | – | "Mykistin ei ole sana. Suomeksi se on sordiino." | ✅ todennettu | grep -i "mykist" docs/ tyhjä; sääntö CLAUDE.md:ssä ja briefeissä |
| 4 | 1.11. | – | "Alussa ei ole sordinoja, ensimmäinen con sord on harjoituskirjain J jälkeen." | ✅ kirjattu | tutkimus ja Geminin lista korjattu; Del Marin t. 130 merkitty [tarkista] |
| 5 | 1.11. | – | "Teos alkaa patarumpusoololla. Se on kiistaton." | ✅ todennettu | aksentit 1,61 s z14; matala kanava 1,60 s; pöytäkirja 0–60 s |
| 6 | 1.11. | – | "Tee sellaiset analyysityökalut että KUULET NÄMÄ ASIAT." | 🔶 osittain | V1 mitattu; V2–V3 vain PANNs, heikko; perhekanavat eivät erottele (kanavakortti) |
| 7 | 1.11. | 1,6 s | "nopea patarumputremolo. Tututum." | ✅ todennettu | käyttäjä kuuli; aksentit 1,61/1,79/1,88 s |
| 8 | 1.11. | 4,6–5,2 s | "Jouset, taustalla vasket." | ✅ todennettu | käyttäjä kuuli; vaskikanava 0,18–0,32 kohdassa 3–6,5 s ei ollut väärä positiivinen |
| 9 | 1.11. | – | "Sibelius on kirjoittanut mestarillisen soitinnuksen, ja se PITÄÄ tunnistaa." | 🔶 osittain | modernilla äänityksellä tunnistuu (vertailu60); 1932-levyllä ei vielä; vertailukartta ehdotettu |
| 10 | 9.11. | – | "Ei ole mielestäni oikein että metsää ei tuotaisi esille." | 🔶 korjattu, ei todennettu | tyyliohje v1.1: metsä näkyy (rungot, kuuset, oksisto, lumi, usva); todennetaan ensimmäisistä stilleistä |
| 11 | 9.11. | – | "Sibelius oli synesteetikko. Miten sitä tuodaan esiin? Tutki." | 🔶 tutkittu | F-duuri vihreä (Ainolan takka, useita toissijaisia lähteitä); C-duuri punainen, D-duuri keltainen (yksi heikko lähde); ehdotus tyyliohjeen lukuun 3, käyttäjä päättää |
| 12 | 9.11. | 0:45 | "tuulenpuuska alkaa heti alun vaski-iskun jälkeen" | ✅ todennettu | käyttäjän korva; ajat: tuulenpuuska 45,4 s vahvistettu |
| 13 | 9.11. | 2:09 | "bassojen jättiläisaskeleet on 2:09 eteenpäin oikein" | ✅ todennettu | käyttäjän korva; ajat: askeleet_B 129,67 s vahvistettu |
| 14 | 9.11. | – | "kuunteluopas on vielä kovin puutteellinen ... paljon lisää detailia - mitä soi, millä hetkellä" | 🔶 osittain | alkuun 5 uutta ankkuria (siemen toistuu, puhallinkuviot, patarumpu paisuu, fraasi ennen taukoa); kerroskartta 338 riviä; soittimen nimeäminen yhä korvan tai partituurin varassa |
| 15 | 9.11. | 0:25–0:45 | "puhaltimet soittavat alkuun lähes unisonossa Gis-ääntä ... Ne puhaltimet nousevat ja laskevat. Yritä kuulla se datasta." | ✅ todennettu | tarkka.py: Gis4 20,6–46,2 s yhtäjaksoisesti; 12 paisutusta 23–45 s; yläsävelprofiili vaihtuu sekunneittain; kuva tarkka_0006-0062.png |
| 16 | 9.11. | 1:25– | "Basson huokaavat askeleet kuuluu melkein koko alun yli" | 🔶 osittain | mitattu 1:24.8 alkaen (17 alkua, väli 1,83 s) ja 2:05–2:57 (28, väli 1,93 s); 0:21–0:43 ei näy yli −55 dB |
| 17 | 9.11. | – | "sitten ei seuraavilla minuuteilla tapahdu mitään? Jokainen minuutti pitää tarkasti miettiä." | 🔶 korjattu, ei todennettu | minuutit.py + 29 uutta ankkuria; jokaisella minuutilla vähintään kolme riviä; ajat analyysia, ei kuultu |
| 18 | 9.11. | 1:40 | "bassojen eritahtiset iskut alkavat, jatkuvat alttoviulujen alla. Altot vuorottelevat puhaltimien kanssa, Sellot tekevät sointumattoa" | ✅ todennettu | linjat.py: basso D2 → H1 1:40.1; sellorekisterin soinnut vuorottelevat 2 s välein < >; ylärekisterin purskeet 7 s välein; ankkurit askeleet_alkavat, fis_hengittaa |
| 19 | 9.11. | 3:00 | "alkaa nousu, koko orkesteri nousee ylöspäin, kuulitko tätä?" | ✅ todennettu | linjat.py: soinnut nousevat 2 s askelin h-urkupisteen päällä 2:56–3:12, ylälinja fis1 → e3; tapahtumat.py tunnisti itse (nousu 3:06, koko orkesteri); aiempi "metsä seisoo" poistettu |
| 20 | 9.11. | 3:20 | "puupuhaltimet, mutta mitä viulut tekevät? Tärkeä!" | 🔶 osittain | mitattu kaksi kerrosta (nopeat korkeat kuviot + hitaasti laskeva pitkien äänten linja, pitkät korkeat äänet värisevät); soitinta ei voi nimetä mittauksesta: käyttäjä kertoo |
| 21 | 9.11. | – | "sinun pitää ITSE pystyä tunnistamaan KAIKKI TUOLLAISET KOHDAT" | 🔶 korjattu, ei todennettu | tapahtumat.py: 271 tapahtumaa (nousu 29, lasku 25, kerros katoaa 8, urkupiste 13, basso liikkuu 6, tremolo 4 ...); löysi kolme esimerkkiä itse; vääriä osumia ei ole karsittu korvalla |
| 22 | 9.11. | – | "kuunteluopas ei ole tekninen kuvaus desibeleistä ... Tekninen data menee json fileen." | ✅ todennettu | kuunteluopas.md: 0 kpl "dBFS"; tekninen data annotations/tekninen_rattle2022.json |
| 23 | 9.11. | 0:12 | "'käyrätorvet vastaavat' ei ole oikein. Ne kuuluvat taustalla soittaen gis-ääntä koko ajan. Ne tulevat vain esiin kun jouset lopettavat." | ✅ todennettu | ankkuri gis_paljastuu; tarkka.py: Gis4 katkeamaton 8,7–17,8 s, jousten sävelet lakkaavat 12,0–12,9 s |
| 24 | 9.11. | – | "NE PITÄÄ NÄKYÄ VISUAALISESTI ... visualisaattoria ÄÄNELLE" | 🔶 kirjattu sääntönä | tyyliohje luku 7b (ääni → kuva), kuvasääntö 0, kriitikon kohta aani_nakyy; todennetaan ensimmäisestä renderistä |
