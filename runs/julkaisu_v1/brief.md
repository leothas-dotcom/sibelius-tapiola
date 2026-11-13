Lue ensin kokonaan `docs/visuaalinen_tyyli.md`, sitten `docs/tutkimus/haastattelu.md` (käyttäjän omat sanat), `docs/tapiola_tutkimus.md`,
`annotations/kuunteluopas.md` ja `docs/projekti.md`:n luvut "Palautelista" ja "Opit" ennen mitään muuta.

# Brief: YouTube-julkaisun suunnitelma ja Shorts-ideat v1 (13.11.2026)

## Mikä tämä on

Tapiola-video (Sibelius, op. 112, 17:58, jokainen ruutu koodilla) on kuvaltaan lähes valmis (`runs/vedos_v8/koko.mp4`). Käyttäjä (13.11.2026):
"Sitten mietitään youtube-julkaisua: miten tämän markkinoisi niin että ihmiset jaksaa katsoa? Tehdään shorts-videoita ainakin kuusi kappaletta,
katso tuota mun haastattelua vaikka - sieltä saisi varmaan kaivettua hyvää materiaa siihen." ja "taustatutkimusta, miten kone oppi tulkitsemaan
Sibeliusta?"

Edellisen projektin julkaisuopit ovat tiedostoissa `F:\code\heldenleben-video\docs\julkaisu2.md` ja `F:\code\heldenleben-video\docs\youtube.md`
(lue ne; sieltä siirtyy menetelmä ja se, mikä ei toiminut: 20 minuuttia ilman sisäänheittäjää, paketti ei kertonut ideaa viidessä sekunnissa).
Sieltä ei siirry mitään visuaalista.

## Sitovat rajat

1. **Äänitys.** Työäänitys on Rattle / London Symphony Orchestra 2022. Sitä **ei saa julkaista** (tekijänoikeus). Lopullinen äänitys on käyttäjän
   oma ja nauhoitetaan myöhemmin. Suunnitelma kirjoitetaan niin, että jokainen Shorts ja pitkä video tehdään uudestaan omalla äänityksellä: Shortsin
   rajat ovat ankkureita (`annotations/cues.json`, `cues[].id`), ei sekunteja. Sekunnit saa mainita suluissa Rattlen ajassa lukijan avuksi.
2. **Ei tekoälyn tuottamia kuvia.** Kaikki kuva on koodia; tämä on myös julkaisun ydinviesti. Thumbnail tehdään videon omista ruuduista.
3. **Vain tosia väitteitä.** Faktat lähteistä (`docs/tapiola_tutkimus.md`, `docs/tutkimus/*.md`); käyttäjän lainaukset sanatarkasti haastattelusta.
   Älä liioittele koneen osuutta: kone mittasi, ihminen (orkesterimuusikko) kuuli ja korjasi. "Tekoäly ymmärtää Sibeliusta" on väärin.
4. Älä muuta mitään muuta tiedostoa kuin `runs/julkaisu_v1/`-kansion sisältöä. Älä renderöi videota äläkä julkaise mitään. Verkkohaut ovat sallittuja
   YouTuben nykykäytäntöjen tarkistamiseen; merkitse lähde ja päivä, ja epävarma **[tarkista]**.

## Tehtäväsi: kirjoita `runs/julkaisu_v1/suunnitelma.md`

1. **Idea yhdessä lauseessa** ja kolmessa: mitä katsoja saa, miksi hän jaksaa 18 minuuttia. Kolme otsikkovaihtoehtoa (fi ja en), kolme
   thumbnail-ehdotusta (mikä ruutu, ankkuri, mikä teksti kuvassa, enintään neljä sanaa).
2. **Koukku: ensimmäiset 30 sekuntia.** Tapiola alkaa hiljaa. Miten katsoja pidetään? Vaihtoehdot (prologi ennen musiikkia, tekstityksen
   ensimmäiset rivit, kappalemerkit) ja suositus perusteluineen.
3. **Vähintään kuusi Shortsia, mieluummin kahdeksan.** Jokaisesta:
   - nimi ja yhden lauseen koukku (ensimmäinen ruutu ja ensimmäinen teksti)
   - rajat ankkureina (alku ja loppu `cues[].id` + mahdollinen siirtymä), kesto 20–50 s, ja miksi juuri tämä kohta
   - mitä ruudulla lukee (enintään kolme lyhyttä tekstiä, fi ja en) ja mistä lähteestä väite on
   - pystykuva 9:16: mikä osa kuvasta rajataan ja toimiiko se rajattuna vai pitääkö kohtaus renderöidä pystyyn (katso ruudut itse:
     `ffmpeg -ss <t> -i runs/vedos_v8/koko.mp4 -frames:v 1 x.png` ja Read-työkalu)
   - mihin Shorts ohjaa (pitkän videon kohta)
   Aiheita, joita haastattelu ja palautelista tarjoavat (tarkista ne itse ja keksi parempia): Tapion askeleet valoina; alttoviulujen yksitoista
   kommenttia, jotka pudottavat lumen oksilta; revontulen aalto, jonka muusikko osoitti mittauskuvasta ("Tuo c - d - e - fis linja"); Tapion
   pöytä ("aivan älyttömän hieno"); "Noita piikikkäitä mäkiä ei suomessa ole"; myrsky ja aksentti; "miten kone oppi kuulemaan": ihminen korjaa
   konetta; välke, jonka syy löytyi näytönohjaimesta.
4. **"Miten kone oppi tulkitsemaan Sibeliusta"**: 60–90 sekunnin tarinan runko (making-of-prologi tai oma lyhyt video): kolme käännekohtaa
   palautelistasta ja opeista, käyttäjän sanoin. Rehellinen: mikä meni pieleen ja miten se korjattiin.
5. **Kuvaus, kappalemerkit ja tunnisteet**: videon kuvausteksti (fi ja en), kappalemerkit ankkureista (kuunteluoppaan jaksot), kiinnitetty
   kommentti. Tekstitykset tehdään erikseen (`runs/tekstitys_v1/`); viittaa niihin, älä kirjoita niitä.
6. **Julkaisujärjestys ja jakelu**: mikä julkaistaan milloin (Shortsit ennen vai jälkeen), mihin yhteisöihin (klassinen musiikki, Sibelius,
   luova koodaus, suomalaiset), ja mitä mitataan ensimmäisen viikon aikana.
7. **Avoimet päätökset käyttäjälle**: lyhyt lista, enintään viisi, jokaisessa suositus.

Kirjoita tiiviisti ja konkreettisesti: lukija on orkesterimuusikko, ei markkinoija. Ei yleisiä neuvoja ("ole aito"); jokainen ehdotus nimeää
ruudun, ankkurin tai lauseen.

## Valmis tarkoittaa

`runs/julkaisu_v1/suunnitelma.md` olemassa, vähintään kuusi Shortsia ankkurirajoin, jokainen ruutu tarkistettu kuvasta, ja lopussa luku
"Mitä en pystynyt varmistamaan".
