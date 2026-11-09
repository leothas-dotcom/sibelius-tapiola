# Kuvakäsikirjoitus: Tapiola

*Versio 1.2, 9.11.2026. Luvut 1 ja 2 on ajateltu uudestaan vedoksen 1 palautteen jälkeen: jokaisella hetkellä on oma
kuvatapansa (tyyliohje luku 4b). Ottojen rivit Näkyy ja Kamera puhuvat vielä paikoin vedoksen 1 runkometsästä; ne
kirjoitetaan uudestaan maailma kerrallaan, kun käyttäjä on nähnyt vedoksen 2. Versio 1.1: Tuore lukija tarkisti tekstin tyyliohjetta vasten (`runs/kk_tarkistus_v1/kriitikko.md`), ja
löydökset on korjattu. Käyttäjä hyväksyi kahdeksan maailmaa rungoksi 9.11.2026 ("Hyväksyn maailmat") sekä C-duurin punaisen valon ja D-duurin hämärät välähdykset;
luvun 8 muut päätökset ovat auki. Noudattaa tyyliohjetta
(`docs/visuaalinen_tyyli.md` v1.4): jos tämä ja tyyliohje ovat ristiriidassa, tyyliohje voittaa. Ajat ottojen
otsikoissa ovat generoituja (`analysis/make_cues.py`, levytys Rattle 2022) ja vaihtuvat, kun levytys vaihtuu.
Kaikki muu viittaa ankkureihin (`annotations/teemat.json`), ei sekunteihin. Kuunteluoppaan sisältöä (lähteet,
tulkinnat) ei toisteta tässä: ankkurin nimi vie sinne.*

## 0. Miten tämä on tehty ja miten sitä luetaan

**Mitä hyvä kuvakäsikirjoitus on** (haettu 9.11.2026, lähteet lopussa):
1. Ensin tunteen kaari, sitten otot. Jokainen otto palvelee yhtä kaaren hetkeä; otto, joka ei palvele, poistetaan.
2. Yksi ajatus per otto. Katsoja katsoo yhtä asiaa kerrallaan.
3. Otosta kirjataan: numero, mitä tapahtuu, mikä on katseen kohde, kamera, valo, siirtymä, ajoitus ja ääni.
4. Värin ja valon kaari kulkee rinnalla: suuri tunteen muutos on myös valon muutos.
5. Hengähdykset merkitään: otto, jossa mitään ei tapahdu, on valinta ja saa nimen.
6. Ajoitus sidotaan musiikkiin etukäteen (animaation tahtikaavio). Meillä tahtikaavio on teemakartta.
7. Käsikirjoitus on työkalu, ei taideteos: se toimii, jos tekijä ymmärtää siitä, mitä piirtää.

**Otto** tarkoittaa tässä jaksoa kahden ankkurin välillä. Leikkauksia ei ole: kuva on yksi ajo. Otsikossa on oton
alku- ja loppuankkuri. Kentät:
- **Teko:** yksi lause siitä, mitä otossa tapahtuu.
- **Tunne ja johtaja:** mitä katsoja kokee, ja mikä elementti puhuu (tyyliohje luku 7).
- **Näkyy:** ankkuri tai koneen kuulema tapahtuma ja sen vastine kuvassa.
- **Kamera:** vain, jos se poikkeaa maailman perusliikkeestä.
- **Iskut:** mikä ympäristössä vastaa iskuun tässä otossa.

**Yleissääntö:** jokainen koneen kuulema tapahtuma (`cues.json`, kenttä tapahtumat) näkyy tyyliohjeen luvun 7b
mukaan, vaikka sitä ei tässä nimetä. Tässä nimetään oton pääasia ja se, mikä poikkeaa. Enintään kolme elementtiä
liikkuu yhtä aikaa: jos tapahtuma toisi neljännen, se vastaa valollaan omassa kerroksessaan liikkumatta.

## 1. Kaari: kaksitoista hetkeä

| # | Hetki | Ankkurit | Katsoja kokee | Kuvatapa (tyyliohje 4b) | Miten tunne tehdään kuvassa |
|---|---|---|---|---|---|
| 1 | Metsä on jo siinä | `avaus_patarumpu` – `patarumpu_paisuu` | läsnäolon: jokin on ollut täällä ennen minua | 1 Usvan läpi | kuva on melkein pelkkää usvaa; lähellä mustat oksat, niiden takana rungot vain vihjeinä; valo on usvan sisällä eikä näytä lähdettään |
| 2 | Ensimmäinen repeämä | `vaskien_isku` – `hiljaisuus_1_loppu` | säikähdyksen ja pidätetyn hengityksen | 1 Usvan läpi, repeää | valo leikkaa usvan ja näyttää hetkeksi koko metsän; sitten lumi peittää kaiken paitsi runkojen varjot |
| 3 | Jokin kulkee edellä | `fis_pitka_aani` – `askeleet_B` | painon, jota ei näe, ja halun seurata | 2 Maan tasalta | kamera laskeutuu lumen pintaan; maa täyttää puolet kuvasta, ja paino painaa lunta linssin edessä |
| 4 | Metsä kohoaa, maa katoaa | `urkupiste_H1_alku` – `pohja_katoaa` | hetken valon ja sitten pohjattomuuden | 3 Ylös runkoja pitkin | katse nousee nousun mukana rungoista latvoihin; valo on latvojen aukossa; kun pohja katoaa, maata ei enää ole kuvassa |
| 5 | Väike | `e_pitka_ja_kuviot` – `peikot_G_loppu` | leikin, jota ei saa kiinni | 4 Lähikuva | yksi huurteinen oksa täyttää kuvan; pilkahdukset syttyvät kiteissä äänen korkeuden mukaan ja ovat poissa, kun niihin katsoo |
| 6 | Metsä liikkuu kokonaisena | `peikot_G_loppu` – `hajoaa_hiljaisuuteen` | ensimmäisen pelon | 5 Pinnan sisään | katse painuu mustaan jäähän; metsä on pinnan alla ylösalaisin, ja syke kulkee pinnassa aaltona |
| 7 | Ikisalo | `jousijakso_urkupiste_E_alku` – `hiljainen_jakso_loppu` | oman pienuutensa, ajan pysähtymisen | 6 Runkojen rytmi | ei maata, ei taivasta: valtavat rungot pystyraitoina, jotka liukuvat hitaasti; sävyt porrastuvat sinisestä usvaan |
| 8 | Väärä valo | `hiljainen_jakso_loppu` – `auringonsade` | toivon, joka on väärän värinen | 6 Runkojen rytmi, punainen | sama rytmi; punainen valo sytyttää raidat toiselta reunaltaan, ja varjot lankeavat kuvan poikki |
| 9 | Petos ja hermo | `M_ennakko` – `dim_possibile` | ahdistuksen: liikettä ei voi pysäyttää | 7 Pimeä ja välähdys | kuva on musta; metsä on olemassa vain silloin, kun valo leikkaa, ja joka kerta se on lähempänä |
| 10 | Se näkyy ja tulee | `hiljaisuus_2_alku` – `R_vasket` | kauhun ja ylivoiman | 8 Ulkoa ja kaukaa, sitten 9 Tuulen sisällä | metsän reuna ja vaarat kerroksina usvassa; myrsky nielee kerroksen kerrallaan kauimmasta alkaen, kunnes se on päällä |
| 11 | Huuto ja jälki | `toinen_paisunta` – `yksinaiset_aanet` | paljauden | 10 Ylhäältä | kamera nousee myrskyn läpi; vaarat ja metsä kerroksina horisonttiin, ja yksittäiset äänet ovat valoja eri laaksoissa |
| 12 | Oikea valo | `S_sempre_mf` – `musiikki_loppuu` | hellyyden, levon, kunnioituksen | 10 Ylhäältä, pysähtyy | sama näkymä; kajo nousee kauimman vaaran takaa, usva laaksoissa alkaa hehkua, ja kaikki lakkaa liikkumasta |

Joka hetkessä pätee kolme asiaa (tyyliohje 4b): metsä elää äänen mukana, äänen korkeus on korkeus kuvassa ja äänen voima
on valon määrä ja läheisyys, ja kuvatapa vaihtuu kulussa tai hitaalla katseen muutoksella.

## 2. Maailmat ja kulut

Käyttäjän idea: kamera ajaa jonkin sisään, se suurenee, ja sieltä löytyy uusi maailma. Jokainen maailma on metsä,
mutta nähty eri paikasta (luku 1, sarake Kuvatapa): maailma ei ole uusi rivi puita vaan uusi tapa nähdä metsä.
Jokainen löytyy jostakin pienestä edellisen sisältä ja on silti edellistä suurempi. Maailmat ja kulut ovat
ohjaajan ehdotus, jonka **käyttäjä hyväksyi 9.11.2026**; perustelu on musiikissa, ei mytologiassa, ellei toisin sanota.

| # | Maailma | Alkaa | Mikä se on | Kulku sinne | Miksi juuri tässä |
|---|---|---|---|---|---|
| 1 | **Kuusikko** | `tiedoston_alku` | tumma kuusimetsä sisältä: rungot lähellä, lunta maassa, usvaa | ei kulkua: metsä on jo siinä | esipuhe: sankat, tummat metsät |
| 2 | **Askelten metsä** | `hiljaisuus_1_loppu` | sama metsä syvempänä: rungot paksumpia, maa ja lumi painavia | **repeämän ja lumipölyn läpi:** vaskien iskussa valo leikkaa raon kohdalta kerrosten läpi, puuska nostaa lumen ilmaan, ja kamera, joka on ajanut rakoa kohti alusta asti, ajaa lumipölyyn | yleistauko on sokea lumi: polku päättyy, ja kun näkyvyys palaa, metsä on toinen |
| 3 | **Huurremetsä** | `pohja_katoaa` | metsä oksan huurteessa: kiteet ovat kuusten kokoisia, maata ei ole, kaikki leijuu | **oksan huurteeseen:** nousu vie valon latvoihin, kamera ajaa edessään olevan lumisen oksan pintaan, kiteet kasvavat rungoiksi | pohja katoaa äänestä: maailma, jolla ei ole maata |
| 4 | **Jäänalainen metsä** | `pohja_vaihtuu_D` | hämärä metsä mustan jään alla: jää on kattona latvojen yllä, lumi maassa heijastaa kaukaista valoa | **mustan pinnan läpi:** huurremetsän alla on tumma jään pinta, kamera painuu sen läpi | pohja vaihtuu toiseksi säveleksi: sama metsä, toinen pohja; ja alun valo palaa muistona |
| 5 | **Ikisalo** | `jousijakso_urkupiste_E_alku` | ikimetsä puun sisällä: valtavat rungot kaukana toisistaan, kaikki sinistä, hitainta | **rungon kaarnaan:** metsä harvenee, yksi runko täyttää kuvan, kaarnan uurteet syvenevät rungoiksi | matalin ja hiljaisin jakso; esipuhe: ne ikisalat |
| 6 | **Pilkkopimeä** | `M_raskaat_askeleet` | metsä, josta valo on viety: musta, rungot niin kaukana, että tila on liian suuri | **väärän valon läpi:** kamera ajaa siihen, missä taottu aurinko on; kylmät leikkaukset tulevat sen eteen, ja punainen haalistuu pois | C-duuri ei johda mihinkään; Kalevala 47 ja 49: valo suljetaan vuoreen, yö on pilkkopimeä (tulkinta) |
| 7 | **Aukea** | `hiljaisuus_2_alku` | metsän takana avautuva jäinen aukea, jonka takana on vastarannan kuusikon tumma reuna: ensimmäinen horisontti | **pimeän läpi:** metsä tyhjenee, kamera ajaa kahden viimeisen rungon välistä pimeään usvaan | myrsky näkyy ensin kaukana: tarvitaan etäisyys, jonka yli se tulee |
| 8 | **Metsä myrskyn jälkeen** | `yksinaiset_aanet` | koko metsä ylhäältä latvojen tasalta: uusi lumi, tyyni kylmä ilma, horisontti | **myrskyn läpi ylös:** huudossa kamera nousee lumen ja jään läpi tyyneen | huuto vie katseen ylös; sen jälkeen jää vain yksittäisiä ääniä |

Kulkujen säännöt (tyyliohje 2.4 ja 8.4): jokainen kulku kestää vähintään neljä sekuntia, mittakaava muuttuu
jatkuvasti, eikä katsoja huomaa rajaa. Kulkujen ankkurit (kesto mitataan: `analysis/check_package.py`):
- Kulku 1: `tuulenpuuska` → `hiljaisuus_1_loppu`
- Kulku 2: `nousu_huippu_D` → `pohja_katoaa`
- Kulku 3: `jannitesoinnut` → `pohja_vaihtuu_D`
- Kulku 4: `hajoaa_hiljaisuuteen` → `jousijakso_urkupiste_E_alku`
- Kulku 5: `M_ennakko` → `M_raskaat_askeleet`
- Kulku 6: `dim_possibile` → `myrsky_nakyy`
- Kulku 7: `toinen_paisunta` → `yksinaiset_aanet`

## 3. Valon ja värin kaari

| Maailma | Perusväri | Valon lähde ja suunta | Kirkkain hetki | Ei koskaan |
|---|---|---|---|---|
| 1 Kuusikko | hämy, noki | kapea valo runkojen välistä suoraan edestä kaukaa (käyrätorvien kajo, salon värinen) | `vaskien_isku`: valon leikkaus raon kohdalta; leikkaus on hallan värinen, rako pysyy salon värisenä | yleisvaloa |
| 2 Askelten metsä | hämy, salo | sama rako, askelta alempana ja himmeämpänä | `nousu_huippu_D`: kelmeä, hämärä valo kaikissa kerroksissa (ei keltaista; käyttäjä 9.11.2026, ks. luku 8) | lämpöä |
| 3 Huurremetsä | salo, halla | kaukaisin kidekerros, josta valo siroaa lähempiin kiteisiin (väike) | `nopea_liike_1_alku`: tihein kimallus | lunta tai maata alla, varjoja maassa |
| 4 Jäänalainen metsä | hämy, lähes noki | kaukainen valorako edestä; lumi maassa heijastaa sen, joten valoisin on alhaalla; jääkatto ylhäällä himmeä | `h_urkupiste_vyory`: koko metsä samassa himmeässä valossa | suoraa valoa ylhäältä |
| 5 Ikisalo | salo | kaukaa edestä, hyvin heikko; lopussa taottu aurinko **sivulta** latvojen korkeudelta | `auringonsade`: punainen valo (käyttäjä hyväksyi 9.11.2026) | punaista ennen `c_duuri_valahdykset` |
| 6 Pilkkopimeä | noki | ei pysyvää lähdettä: vain vaskien leikkaukset ja kaukainen kajo | `P_vaskipaisunta` | punaista, lämpöä |
| 7 Aukea | noki, halla | horisontin kapea hallanvalkea nauha, joka kasvaa myrskyksi | `myrsky_huippu`: tihein, hallaa ja nokea koko kuvassa; himmeämpi kuin taottu aurinko | kerrosten omia värejä myrskyn sisällä |
| 8 Myrskyn jälkeen | salo, lopussa kajo | suoraan edestä kerrosten takaa, matalalta | `loppu_Hduuri_alku`: kajo, hellä, ei häikäisevä | häivytystä mustaan |

**Kolme valoa, kolme suuntaa.** Metsän oma valo tulee edestä kerrosten takaa ja on kylmä (rako, D-duurin välähdykset).
Lumi ja jää heijastavat sitä, mutta lähde on aina edessä.
Väärä valo tulee sivulta ja on punainen: varjot lankeavat kuvan poikki, eivät katsojaa kohti. Oikea valo tulee
samasta suunnasta kuin metsän oma valo, mutta on kajon värinen. Katsojan ei tarvitse tietää tätä: hän näkee, että
C-duurin valo on väärässä paikassa.

## 4. Neljä lankaa läpi koko teoksen

1. **Valon viiva.** Kapea valo kaukana runkojen välissä. Se on alun pitkä gis (`gis_pitka_aani_alku`), laskee
   yleistauon jälkeen (`fis_pitka_aani`), laskee vielä (`e_pitka_ja_kuviot`), palaa muistona (`gis_palaa`) ja on
   lopussa viulujen ääni, joka ei enää lakkaa (`S_sempre_mf`). Korkeus kuvassa on sävelkorkeus. Lopun kajo on sama
   valo kokonaan nähtynä: se, mikä oli koko ajan takana, jää, kun kaikki muu on viety pois.
2. **Askeleet.** Paino maassa, aina kameran edellä, ei koskaan saavutettu. Kamera seuraa sitä sisään. Alkavat
   `askeleet_alkavat`, kuuluvat kaukaa alhaalta (`askeleet_fis`), ovat kovat ja lähellä (`M_raskaat_askeleet`) ja
   pysähtyvät (`viimeiset_askeleet`). Kun ne pysähtyvät, kuva lakkaa muuttumasta.
3. **Väärä ja oikea valo.** Luku 3.
4. **Kolme tyhjyyttä.** Yleistauko on sokea lumi lähellä (`hiljaisuus_1_alku`). Hiljaisuus ennen myrskyä on tumma
   aukea: jää, usva ja reunoille jäävät viimeiset rungot (`hiljaisuus_2_alku`). Teoksen jälkeinen hiljaisuus on kuva, joka ei enää
   muutu (`musiikki_loppuu`). Kaikissa kamera jatkaa tai on jo pysähtynyt nimetysti; elementit ovat poissa, metsä jää.

## 5. Otot

### Maailma 1: Kuusikko

Perusliike: hidas ajo suoraan sisään runkojen välistä. Kerrokset: lähellä mustat rungot ja oksat, keskellä rungot
ja usva, kaukana siniset rungot ja valorako.

#### 01 Metsä ennen ääntä · `tiedoston_alku` → `avaus_patarumpu` · <!--aika-->0:00–0:07<!--/aika-->
- **Teko:** kuva on auki ja kamera jo liikkeessä, ennen kuin mikään soi.
- **Tunne ja johtaja:** odotus. Ei johtajaa: metsä yksin, lähes musta.
- **Näkyy:** rungot erottuvat juuri ja juuri kaukaisinta kerrosta vasten, joka on aavistuksen vaaleampi: se on ainoa
  valo. Ei elementtejä; valorako on vielä peitossa.

#### 02 Maa sysää, siemen · `avaus_patarumpu` → `gis_paljastuu` · <!--aika-->0:07–0:12<!--/aika-->
- **Teko:** maa tärähtää, ja säikeet piirtävät siemenen ensimmäisen kerran.
- **Tunne ja johtaja:** jokin suuri lähtee liikkeelle. Ensin pohjan tärähdys, sitten metsän säikeet.
- **Näkyy:** `avaus_patarumpu`: lumi maassa liikahtaa kahdesti, aalto kulkee runkoja ylös ja tuo ne näkyviin.
  `jouset_tulevat`: valosäikeet lähikerroksessa kulkevat runkojen välissä melodian korkeuksia pitkin, vahvoina.
  `gis_pitka_aani_alku`: kaukana säikeiden takana on kapea valo. Se on jo siinä, mutta säikeet peittävät sen.
- **Iskut:** pohjan tärähdys; aalto etenee ylös.

#### 03 Mikä oli takana, jää · `gis_paljastuu` → `siemen_toistuu` · <!--aika-->0:12–0:20<!--/aika-->
- **Teko:** säikeet väistyvät, ja takana ollut valo jää näkyviin.
- **Tunne ja johtaja:** paljastuminen, hiljainen. Kaukainen kajo.
- **Näkyy:** `gis_paljastuu`: mitään uutta ei tuoda. Lähikerros himmenee ja kaukainen valorako on yksin.
  `kerros tulee` (pohja): maa tummuu ja painuu näkyviin valon alle.

#### 04 Siemen toisen kerran · `siemen_toistuu` → `puhallinkuviot_alku` · <!--aika-->0:20–0:25<!--/aika-->
- **Teko:** säikeet piirtävät saman kuvion samaa reittiä.
- **Tunne ja johtaja:** sama uudestaan, siksi se jää mieleen. Metsän säikeet.
- **Näkyy:** `siemen_toistuu`: täsmälleen sama liike kuin otossa 02, ei muunnelmaa. Valorako jää taas taakse.
- **Iskut:** metsän massa etääntyy hetkeksi.

#### 05 Kummut · `puhallinkuviot_alku` → `puhallinkuviot_loppu` · <!--aika-->0:25–0:39<!--/aika-->
- **Teko:** valorako hengittää, ja siitä nousee pieniä valon kaaria, jotka painuvat takaisin.
- **Tunne ja johtaja:** autius, ensimmäinen liike. Kaukainen kajo hengittää; väike ja hämyn äänet vuorotellen samalla
  viivalla.
- **Näkyy:** `puhaltimet_tulevat`: valorako kirkastuu ja himmenee paisutus kerrallaan, ja sen sävy vaihtuu joka
  kerta hieman (sama viiva, eri soitin), aina kylmän sisällä. Väliin matalat kaaret nousevat viivasta ja palaavat
  siihen. Käyttäjä: "pienet nousevat ja laskevat kuviot (ovatko mäkiä??) ... esiin sieltä metsän siimeksestä".
- **Iskut:** kajo välähtää: valorako, joka on jo kuvassa, kirkastuu iskun ruudussa.

#### 06 Maa alkaa väristä · `puhallinkuviot_loppu` → `vaskien_isku` · <!--aika-->0:39–0:45<!--/aika-->
- **Teko:** kaaret lakkaavat, ja lumi maassa alkaa väristä.
- **Tunne ja johtaja:** varoitus. Pohjan tärähdys.
- **Näkyy:** `puhallinkuviot_loppu`: valorako yksin, tasaisena. `patarumpu_paisuu`: lumi värisee paikallaan,
  värinä kasvaa ja tihenee, matalaa lumipölyä irtoaa.

#### 07 Repeämä ja puuska · `vaskien_isku` → `fraasi_ennen_taukoa` · <!--aika-->0:45–0:54<!--/aika-->
- **Teko:** valo leikkaa raon kohdalta kaikkien kerrosten läpi, ja puuska nostaa lumen ilmaan.
- **Tunne ja johtaja:** säikähdys. Läpi tuleva valo, sitten metsän säikeet.
- **Näkyy:** `vaskien_isku`: valon leikkaus kulkee pystysuoraan raon kohdalta takaa eteen kaikkien kerrosten läpi.
  Leikkaus on vaskien valoa ja hallan värinen kuten aina; rako itse pysyy salon värisenä. `tuulenpuuska`: säikeet ryntäävät kaikissa kerroksissa, lumi irtoaa oksilta. `gis_pitka_aani_loppu`:
  valon viiva ei sammu, se peittyy lumeen.
- **Kamera:** ei reagoi: suunta ja nopeus ovat samat kuin alusta asti. **Kulku 1 alkaa** `tuulenpuuska`: lumipöly
  alkaa peittää näkymää.
- **Iskut:** valon leikkaus iskun ruudussa.

#### 08 Lause, joka jää kesken · `fraasi_ennen_taukoa` → `hiljaisuus_1_alku` · <!--aika-->0:54–0:58<!--/aika-->
- **Teko:** säikeet sanovat yhden lauseen lumipölyn seassa, ja se katkeaa.
- **Tunne ja johtaja:** kesken jääminen. Metsän säikeet.
- **Näkyy:** `fraasi_ennen_taukoa`: säikeet erottuvat vielä lumen läpi. `äkillinen hiljeneminen`: valo ja liike
  katkeavat samassa ruudussa.

#### 09 Ensimmäinen tyhjyys · `hiljaisuus_1_alku` → `hiljaisuus_1_loppu` · <!--aika-->0:58–1:01<!--/aika-->
- **Teko:** lumipöly peittää kaiken paitsi runkojen varjot, ja kamera jatkaa.
- **Tunne ja johtaja:** pidätetty hengitys. Ei johtajaa. **Nimetty hengähdys.**
- **Näkyy:** harmaanvalkea lumipöly koko kuvassa kolmessa syvyydessä (lähin nopein). Sen läpi erottuvat runkojen
  tummat varjot, jotka liukuvat ohi ja paksunevat: mittakaava muuttuu jatkuvasti. Edessä pöly on vaaleinta: raon valo
  siroaa sen läpi. Ei elementtejä. Kuva ei pimene.
- **Kamera:** sama nopeus kuin ennen. **Kulku 1 päättyy** `hiljaisuus_1_loppu`.

### Maailma 2: Askelten metsä

Perusliike: sama ajo, hieman hitaampi; urkupisteillä hitain. Kerrokset: lähellä paksut rungot ja lumiset juuret,
keskellä runkoryhmät (sointumatto), kaukana valorako, nyt alempana. Maa on tässä maailmassa näkyvin.

#### 10 Toinen asento · `hiljaisuus_1_loppu` → `valo_D_duuri` · <!--aika-->1:01–1:15<!--/aika-->
- **Teko:** lumi laskeutuu, ja metsä on toinen: valon viiva on alempana.
- **Tunne ja johtaja:** helpotus, joka ei kestä. Metsän säikeet ja läpi tuleva valo vuorotellen.
- **Näkyy:** `fis_pitka_aani`: valorako askelta alempana ja himmeämpänä kuin maailmassa 1. Säikeet ja vaskien
  valo vuorottelevat sen ympärillä lohkoina. `purske`: säikeet välähtävät nopeasti latvoissa.
- **Iskut:** metsän massa etääntyy hetkeksi.

#### 11 Ensimmäinen välähdys · `valo_D_duuri` → `askeleet_alkavat` · <!--aika-->1:15–1:40<!--/aika-->
- **Teko:** kelmeä valo tulee runkojen välistä eteen kahdesti ja vetäytyy.
- **Tunne ja johtaja:** hetkellinen valo, metsän oma. Kaukainen kajo ja hämyn äänet pitkinä.
- **Näkyy:** `valo_D_duuri`: valo levenee raosta kahdessa korkeudessa (kaksi oktaavia), säikeet väistyvät.
  `urkupiste`: maa ei liiku. Käyttäjä: "synkkä suomalainen metsä, jossa on hetkellisiä valon välähdyksiä".

#### 12 Maa liikahtaa, askeleet alkavat · `askeleet_alkavat` → `askeleet_B` · <!--aika-->1:40–2:09<!--/aika-->
- **Teko:** maa liikahtaa, ja jokin painava alkaa kulkea kameran edellä.
- **Tunne ja johtaja:** aavistus. Pohjan askeleet; sointumatto hengittää keskellä.
- **Näkyy:** `basso liikkuu`: koko maa siirtyy kerran. `askeleet_alkavat`: lumen pinta painuu ja palautuu
  paikassa, joka on aina edellä ja siirtyy syvemmälle omassa ajassaan. Ei jalkaa, ei jälkeä: paino.
  `fis_hengittaa`: kaksi runkoryhmää keskikerroksessa kirkastuu ja himmenee vuorotellen. Väike välähtää latvoissa
  harvakseltaan. Kolme liikkuvaa elementtiä, ei enempää.

#### 13 Askeleet tulevat lähemmäs · `askeleet_B` → `urkupiste_H1_alku` · <!--aika-->2:09–2:56<!--/aika-->
- **Teko:** painumat tulevat kerros kerrokselta lähemmäs, ja valo vähenee.
- **Tunne ja johtaja:** painava, näkymätön läsnäolo. Pohjan askeleet.
- **Näkyy:** `askeleet_B`: askeleet ovat nyt lähikerroksen maassa, mutta yhä edellä. `urkupiste`: maan taso
  pysyy, kaikki muu liikkuu sen päällä. `paisuva sointu`: runkoryhmä kirkastuu ja himmenee.
- **Kamera:** hidastuu urkupisteen ajaksi.

#### 14 Metsä kohoaa · `urkupiste_H1_alku` → `urkupiste_H1_loppu` · <!--aika-->2:56–3:11<!--/aika-->
- **Teko:** valo ja kerrokset nousevat rungoista latvoihin porras portaalta, maa pysyy.
- **Tunne ja johtaja:** kasvu. Kerrokset yhtenä.
- **Näkyy:** `urkupiste_H1_alku`: maa paikallaan. `nousu`: valaistu vyöhyke kiipeää runkoja ylös portaittain,
  ja metsä kasvaa kameran ohi ylöspäin. `nousu_tremolo`: ylin valo alkaa väreillä latvoissa.
- **Kamera:** pysyy suunnassaan.

#### 15 Maa lähtee mukaan · `urkupiste_H1_loppu` → `nousu_huippu_D` · <!--aika-->3:11–3:15<!--/aika-->
- **Teko:** maa itse alkaa nousta.
- **Tunne ja johtaja:** käännekohta: kaikki on liikkeessä. Pohjan askeleet.
- **Näkyy:** `basso liikkuu`: lumen pinta kohoaa neljässä portaassa muiden mukana.

#### 16 Metsän oma valo · `nousu_huippu_D` → `pohja_katoaa` · <!--aika-->3:15–3:23<!--/aika-->
- **Teko:** kelmeä valo täyttää kaikki kerrokset maasta latvoihin ja hiipuu.
- **Tunne ja johtaja:** valo, hetken. Kerrokset yhtenä.
- **Näkyy:** `nousu_huippu_D`: valo tulee raosta edestä. Alkupuolen kirkkain hetki, silti kylmä, hämärä ja selvästi
  himmeämpi kuin taottu aurinko.
  Valo hiipuu, ja lumen painama oksa on kameran edessä.
- **Kamera:** **Kulku 2** alkaa `nousu_huippu_D` ja päättyy `pohja_katoaa`: suunta on yhden oksan huurre, ja kiteet
  kasvavat rungon kokoisiksi.

### Maailma 3: Huurremetsä

Perusliike: hidas ajo eteen; koska kaikki vajoaa ja kamera pitää linjansa, kuva tuntuu leijuvan. Kerrokset: lähellä
suuret kiteet ja niiden oksat, keskellä kiderungot, kaukana sininen kidemetsä. Kiteet ovat kuusen muotoisia (runko,
oksat ja neulaset huurretta), joten metsä on yhä metsä. Alla ei ole maata vaan tumma usva: kerros, ei tyhjä tausta.
Kun pohja soi, usvan alta erottuu syvällä musta jään pinta, seuraavan maailman katto.

#### 17 Pohja katoaa · `pohja_katoaa` → `e_pitka_ja_kuviot` · <!--aika-->3:23–4:00<!--/aika-->
- **Teko:** maa ja juuret häviävät alta, ja metsä jää leijumaan ja vajoaa hitaasti keinuen.
- **Tunne ja johtaja:** leijuva, pohjaton, lempeä. Väike johtaa ja on siksi tullut lähioksiin ylhäälle; metsän massa on
  hidas kerros keskellä.
- **Näkyy:** `pohja_katoaa`: maa ja juuret häviävät usvaan. `ylarekisteri_heraa`: pienet pilkahdukset lähioksissa,
  hiljaa. Keskikerroksen massat keinuvat pareittain ja vajoavat. Käyttäjä: "mitä viulut tekevät? Tärkeä!"
- **Iskut:** kidemassa etääntyy hetkeksi; väike ei reagoi iskuun.

#### 18 Kolme aikaa päällekkäin · `e_pitka_ja_kuviot` → `nopea_liike_1_alku` · <!--aika-->4:00–4:40<!--/aika-->
- **Teko:** ylhäällä kimaltaa nopeasti, keskellä on yksi pysyvä viiva, ja syvällä alla paino liikkuu taas.
- **Tunne ja johtaja:** levoton. Väike johtaa; valon viiva ja askeleet pysyvät kerroksissaan.
- **Näkyy:** `e_pitka_ja_kuviot`: valon viiva on taas kuvassa, alempana kuin koskaan. `kerros tulee` (pohja):
  usvan alta paljastuu syvällä musta jään pinta. `askeleet_fis`: paino liikkuu sen pinnassa, kaukana.

#### 19 Pilkahdukset, joita ei saa kiinni · `nopea_liike_1_alku` → `jannitesoinnut` · <!--aika-->4:40–5:10<!--/aika-->
- **Teko:** erilliset valopisteet syttyvät ja sammuvat kerrosten välissä nopeammin kuin katse ehtii.
- **Tunne ja johtaja:** väike, levoton leikki. Väike ja hämyn äänet.
- **Näkyy:** `nopea_liike_1_alku`: staccato on pisteitä, ei viivoja. `basso vaikenee`: tumma pinta alla häviää
  taas. `nopea_liike_1_loppu`: pisteet katoavat, kun niitä katsoo; kimallus laantuu.
- **Kamera:** nopeutuu jakson ajaksi (`uusia_korkea` hitaana keskiarvona: suuri muutos, ei yksittäinen ääni).
- **Iskut:** kidemassa etääntyy hetkeksi, sitä vähemmän mitä heikompi isku. Väike ei reagoi iskuun: pisteet seuraavat
  staccatoa.

#### 20 Metsä pidättää hengitystä · `jannitesoinnut` → `pohja_vaihtuu_D` · <!--aika-->5:10–5:36<!--/aika-->
- **Teko:** elementit pysähtyvät paikalleen kahdesti, ja tumma pinta alla lähestyy.
- **Tunne ja johtaja:** uhka, odotus. Metsän massa, liikkumatta.
- **Näkyy:** `jannitesoinnut`: kiteet lakkaavat kimaltamasta, valo kiristyy ja himmenee kaksi kertaa.
  `urkupiste`: tumma pinta alla on taas näkyvissä ja pysyy.
- **Kamera:** jatkaa hitaasti; linja painuu vähitellen kohti pintaa (nimetty painuminen, luku 7). **Kulku 3** alkaa
  `jannitesoinnut` ja päättyy `pohja_vaihtuu_D`. Tämä ei ole pysähdys.

### Maailma 4: Jäänalainen metsä

Perusliike: hidas ajo eteen jääkaton alla. Kerrokset: lähellä mustat rungot, keskellä hämärät rungot ja puoliksi
näkyvä liike, kaukana valorako kuten maailmassa 1. Ylimpänä jääkatto, joka on tämän maailman taivas.

#### 21 Pinnan läpi · `pohja_vaihtuu_D` → `gis_palaa` · <!--aika-->5:36–6:06<!--/aika-->
- **Teko:** kamera on painunut mustan pinnan läpi, ja sen alla on sama metsä toisella pohjalla.
- **Tunne ja johtaja:** vieras, tummuva. Pohjan askeleet.
- **Näkyy:** `pohja_vaihtuu_D`: pinta on nyt jääkatto kameran yllä, ja jokainen sykäys on aalto, joka kulkee sitä
  pitkin (ei sisäkkäisiä ympyröitä). Lumi maassa heijastaa kaukaista valoa: valoisin on alhaalla.
  `äkillinen hiljeneminen`: aallot lakkaavat samassa ruudussa. `lasku`: valo painuu maahan.
- **Kamera:** kulku 3 on päättynyt; linja on taas vaakasuora.
- **Iskut:** metsän massa etääntyy hetkeksi.

#### 22 Muisto alusta · `gis_palaa` → `peikot_G_alku` · <!--aika-->6:06–6:23<!--/aika-->
- **Teko:** alun valorako näkyy vielä kerran, yksin ja hiljaa.
- **Tunne ja johtaja:** muisto. Kaukainen kajo.
- **Näkyy:** `gis_palaa`: sama kapea valo samalla korkeudella kuin maailmassa 1, nyt jään alta nähtynä.
  `artikulaatio` (staccato): ensimmäiset yksittäiset pilkahdukset.

#### 23 Hämyn äänet · `peikot_G_alku` → `peikot_G_loppu` · <!--aika-->6:23–6:30<!--/aika-->
- **Teko:** runkojen välit täyttyvät liikkeestä, jolla ei ole tekijää.
- **Tunne ja johtaja:** väike, teoksen tihein liike. Väike ja hämyn äänet.
- **Näkyy:** `peikot_G_alku`: pilkahduksia kaikissa väleissä ja niiden takana muoto, joka ei tarkennu. Ei
  olentoja: liike, joka on poissa, kun siihen katsoo. `peikot_G_loppu`: liike jatkuu hetken ilman pilkahduksia.

#### 24 Jokin hengittää puiden takana · `peikot_G_loppu` → `h_urkupiste_vyory` · <!--aika-->6:30–7:00<!--/aika-->
- **Teko:** kaukainen valo sykkii hitaasti, ja jääkatto pimenee hetkeksi.
- **Tunne ja johtaja:** hidas hengitys. Kaukainen kajo.
- **Näkyy:** kajo sykkii pitkin sykäyksin. `nousu` ja `lasku`: valo kohoaa latvoihin ja putoaa maahan.
  `kerros katoaa` (ylärekisteri): jääkatto ja latvat pimenevät, jäljelle jää vain tumma maa.

#### 25 Metsä velloo · `h_urkupiste_vyory` → `vaskipulssit` · <!--aika-->7:00–7:16<!--/aika-->
- **Teko:** koko metsä liikkuu yhtenä kuin virta kulkisi sen läpi.
- **Tunne ja johtaja:** ensimmäinen pelko. Kerrokset yhtenä; maa sykkii.
- **Näkyy:** `h_urkupiste_vyory`: kaikki rungot ja oksat huojuvat samaan suuntaan, maa sykkii tiheästi mutta pysyy
  tasollaan. Käyttäjä: "vyöryviä kohtia, jotka velloo ja on tosi pelottaviakin".
- **Kamera:** nopeutuu hieman, ei heilu mukana.

#### 26 Hengitys palaa · `vaskipulssit` → `hajoaa_hiljaisuuteen` · <!--aika-->7:16–7:42<!--/aika-->
- **Teko:** vellonta laantuu, ja kaukainen valo hengittää taas.
- **Tunne ja johtaja:** hidas hengitys. Kaukainen kajo; säikeet hiljaa välissä.
- **Näkyy:** `vaskipulssit`: kajo kirkastuu ja himmenee hitaasti. `urkupiste`: maa paikallaan.

#### 27 Metsä harvenee · `hajoaa_hiljaisuuteen` → `jousijakso_urkupiste_E_alku` · <!--aika-->7:42–8:16<!--/aika-->
- **Teko:** rungot harvenevat, ja yksi valtava runko täyttää vähitellen kuvan.
- **Tunne ja johtaja:** syveneminen. Metsän massa lohkoina, tyhjää välissä.
- **Näkyy:** `hajoaa_hiljaisuuteen`: runkoryhmä, tyhjä, runkoryhmä. `basso vaikenee`: maa himmenee pois.
  `lasku`: valo putoaa latvoista maahan asti. Edessä yhden rungon kaarna.
- **Kamera:** **Kulku 4** alkaa `hajoaa_hiljaisuuteen` ja päättyy `jousijakso_urkupiste_E_alku`: kaarnan uurteet
  ovat syventyneet rungoiksi.
- **Iskut:** metsän massa etääntyy hetkeksi.

### Maailma 5: Ikisalo

Perusliike: teoksen hitain ajo. Kerrokset ovat kauimpana toisistaan: lähellä yksi runko kerrallaan, keskellä
harvat rungot, kaukana sininen seinä. Kaikki on salon sinistä.

#### 28 Ikisalo · `jousijakso_urkupiste_E_alku` → `patarumpu_ppp` · <!--aika-->8:16–8:38<!--/aika-->
- **Teko:** valtavat rungot liukuvat ohi hitaasti, ja sitten kaikki himmenee.
- **Tunne ja johtaja:** syvä, tumma, kaukainen. Metsän massa matalalla.
- **Näkyy:** `jousijakso_urkupiste_E_alku`: massa on maan tasalla, latvoja ei näy. `jousijakso_urkupiste_E_loppu`:
  kerrokset väistyvät. `kerros tulee` (ylärekisteri): hyvin korkealla latvojen välistä paljastuu ohut valo kaukaisimmasta
  kerroksesta.

#### 29 Maa ei ole hiljaa · `patarumpu_ppp` → `hitaat_soinnut` · <!--aika-->8:38–9:00<!--/aika-->
- **Teko:** tyhjässä metsässä maa värisee tuskin näkyvästi.
- **Tunne ja johtaja:** pidätetty. Pohjan tärähdys, hiljaisin koko teoksessa.
- **Näkyy:** `patarumpu_ppp`: lumen pinta värisee paikallaan. `kerros katoaa` (pohja): maa häviää usvaan ja rungot
  jäävät leijumaan.

#### 30 Aika lakkaa · `hitaat_soinnut` → `h_palaa_ennen_hiljaisuutta` · <!--aika-->9:00–9:40<!--/aika-->
- **Teko:** kerrokset vaihtavat sävyä yksi kerrallaan, eikä mikään tule eteen.
- **Tunne ja johtaja:** ajaton. Ei johtajaa: ei etualaa, kaikki on kaukana.
- **Näkyy:** `hitaat_soinnut`: yksi kerros kerrallaan kirkastuu tai tummuu hitaasti, ilman rytmiä. Maa tulee ja
  häviää (`kerros tulee`, `kerros katoaa`).
- **Kamera:** hitain nopeus, jolla liike vielä näkyy.

#### 31 Askeleet käyvät kotona · `h_palaa_ennen_hiljaisuutta` → `hiljainen_jakso_alku` · <!--aika-->9:40–9:57<!--/aika-->
- **Teko:** paino sykkii maassa vielä hetken ja vaimenee.
- **Tunne ja johtaja:** hiipuva. Pohjan askeleet.
- **Näkyy:** `h_palaa_ennen_hiljaisuutta`: painumat edellä, yhä pienempinä. `urkupiste`: maa paikallaan.

#### 32 Kuinka vähän tapahtuu · `hiljainen_jakso_alku` → `hiljainen_jakso_loppu` · <!--aika-->9:57–10:13<!--/aika-->
- **Teko:** metsä on lähes tyhjä, ja kamera jatkaa.
- **Tunne ja johtaja:** tyhjyys, odotus. Ei johtajaa. **Nimetty hengähdys** (ei yksi kolmesta tyhjyydestä: rungot
  näkyvät).
- **Näkyy:** `kerros katoaa` (pohja): maa usvassa. Heikko väreily kaukaisissa massoissa.

#### 33 Jokin lähestyy kaukaa · `hiljainen_jakso_loppu` → `vaski_tutti_620` · <!--aika-->10:13–10:21<!--/aika-->
- **Teko:** kaukainen valo ja maan värinä kasvavat yhtä aikaa.
- **Tunne ja johtaja:** lähestyvä. Kaukainen kajo ja pohjan tärähdys.
- **Näkyy:** `hiljainen_jakso_loppu`: kajo paisuu, lumi alkaa väristä, molemmat tulevat lähemmäs kerroksissa.

#### 34 Isku, joka käynnistää · `vaski_tutti_620` → `allegro_359` · <!--aika-->10:21–10:32<!--/aika-->
- **Teko:** valo leikkaa ikisalon läpi, ja maa tärähtää.
- **Tunne ja johtaja:** vyöryvä. Läpi tuleva valo.
- **Näkyy:** `vaski_tutti_620`: leikkaus kaikkien kerrosten läpi, hallan värinen. `purske`: säikeet ryöpsähtävät
  latvoissa. Valo vaimenee nopeasti.
- **Iskut:** valon leikkaus ja pohjan tärähdys samassa ruudussa.

#### 35 Liike palaa · `allegro_359` → `c_duuri_valahdykset` · <!--aika-->10:32–10:41<!--/aika-->
- **Teko:** pilkahdukset ja säikeet lähtevät liikkeelle, ja kamera kiihtyy.
- **Tunne ja johtaja:** levoton, kiihtyvä. Ensin väike ja pohjan toinen ääni, sitten säikeet väikkeen tilalle.
- **Näkyy:** `allegro_359`: nopea kuviointi lähikerroksessa. `nousu`: valo kiipeää pitkään.
- **Kamera:** nopeutuu (`uusia_keski`, `uusia_korkea` hitaana keskiarvona).

#### 36 Väärä valo käy katsomassa · `c_duuri_valahdykset` → `auringonsade` · <!--aika-->10:41–11:20<!--/aika-->
- **Teko:** punainen valo vilahtaa sivulla kerrosten takana kolme kertaa ja katoaa.
- **Tunne ja johtaja:** väärä valo lähestyy. Metsän säikeet; taottu aurinko takana.
- **Näkyy:** `c_duuri_valahdykset`: valo ei tule edestä vaan sivulta, latvojen korkeudelta. Jokainen vilahdus on
  edellistä selvempi. `tremolo`: korkeat säikeet värisevät. `lasku`: liike painuu ja hidastuu.
- **Kamera:** hidastuu jatkuvasti laskun aikana kohti pysähdystä.
- **Puuttuu datasta:** kolmen vilahduksen omat ajat (luku 8).

#### 37 Taottu aurinko · `auringonsade` → `M_ennakko` · <!--aika-->11:20–11:25<!--/aika-->
- **Teko:** kamera pysähtyy, ja punainen valo nousee sivulla latvojen taakse.
- **Tunne ja johtaja:** väärä toivo, pysähtynyt. Metsän säikeet korkealla, suorina ja liikkumatta.
- **Näkyy:** `auringonsade`: punainen valo sinisen metsän läpi sivulta. Runkojen reunat hehkuvat, varjot lankeavat
  kuvan poikki, lumi varjossa pysyy kylmän sinisenä. Valo on vahva (forte), ei hento. Ei kiekkoa, ei horisonttia, ei
  lämmintä taivasta: tämä ei ole auringonlasku. `urkupiste`: maa paikallaan.
  Käyttäjä: "auringon säde synkän metsän läpi"; "groteski valo"; "toivo on turha".
- **Kamera:** **Nimetty pysähdys 1.** Ensimmäinen koko teoksessa.

#### 38 Petos · `M_ennakko` → `M_raskaat_askeleet` · <!--aika-->11:25–11:31<!--/aika-->
- **Teko:** kylmät leikkaukset tulevat punaisen valon eteen, ja kamera lähtee liikkeelle.
- **Tunne ja johtaja:** isku, pelottava. Läpi tuleva valo ja pohjan tärähdys; säikeet pysyvät paikallaan ja jäävät
  leikkausten taakse.
- **Näkyy:** `M_ennakko`: useita pystysuoria leikkauksia peräkkäin (jyrinä). Ne tulevat edestä kerrosten takaa,
  ikisalon omasta heikosta valosta, ja ovat hallan värisiä. Punainen valo ei sammu iskussa: se jää leikkausten taakse
  ja haalistuu koko oton ajan. Punaista ei ole oton jälkeen. Liikkuu kolme: leikkaukset, tärähdys ja haalistuva punainen.
- **Kamera:** lähtee liikkeelle jatkuvalla kiihdytyksellä (ei nykäystä iskun ruudussa) ja kääntyy hitaasti siihen,
  missä väärä valo on. Nopein ajo tähän asti. **Kulku 5** alkaa `M_ennakko`.
- **Iskut:** valon leikkaukset ja pohjan tärähdys.

### Maailma 6: Pilkkopimeä

Perusliike: teoksen nopein ajo ennen myrskyä; liikettä ei voi pysäyttää. Kerrokset: rungot niin kaukana toisistaan,
että kuvassa on kerrallaan yksi lähellä, muutama keskellä ja kaukana sinimusta usva, jossa runkojen varjot juuri ja
juuri erottuvat. Pysyvää valoa ei ole.

#### 39 Askeleet ovat täällä · `M_raskaat_askeleet` → `jannitejakso_alku` · <!--aika-->11:31–11:51<!--/aika-->
- **Teko:** maa painuu lähellä kameraa raskaasti, isku iskulta.
- **Tunne ja johtaja:** raskas, väistämätön. Pohjan askeleet ja läpi tuleva valo.
- **Näkyy:** `M_raskaat_askeleet`: painumat ovat lähempänä kuin koskaan, mutta yhä edellä. Leikkaukset valaisevat
  ne. `tremolo`: korkea valo värisee ylhäällä.
- **Kamera:** **Kulku 5 päättyy** `M_raskaat_askeleet`.

#### 40 Hermo · `jannitejakso_alku` → `O_kirjain` · <!--aika-->11:51–12:14<!--/aika-->
- **Teko:** säikeet täyttävät lähikerroksen nykivällä liikkeellä, joka ei asetu viivaksi.
- **Tunne ja johtaja:** ahdistava, hermostunut. Metsän säikeet.
- **Näkyy:** `jannitejakso_alku`: lyhyitä, katkeilevia säikeitä tiheästi, ei yhtään pitkää. Maa häviää hetkeksi
  (`kerros katoaa`). `lasku`, `nousu`: säikeiden parvi painuu ja kohoaa.
- **Iskut:** metsän massa etääntyy hetkeksi.

#### 41 Hermo saa äänen · `O_kirjain` → `jannitejakso_loppu` · <!--aika-->12:14–12:35<!--/aika-->
- **Teko:** ohut valojuova ja puoliksi näkyvä muoto työntyvät säikeiden läpi.
- **Tunne ja johtaja:** tihenevä. Ohut linja ja hämyn äänet; säikeet jatkavat.
- **Näkyy:** `O_kirjain`: linja tulee kaukaa lähemmäs säikeiden välistä. Vaskien valo pysyy alla himmeänä ja liikkumatta. Lopussa kaikki
  kirkastuu yhdessä ja katkeaa `jannitejakso_loppu`.
- **Iskut:** valon leikkaus.

#### 42 Kaksi hengitystä · `allegro_moderato_O_alku` → `allegro_moderato_O_loppu` · <!--aika-->12:36–12:48<!--/aika-->
- **Teko:** kaksi valoa pimeän takana paisuu ja laskee vuorotellen.
- **Tunne ja johtaja:** hidas, painava hengitys. Kaukainen kajo ja läpi tuleva valo vuorotellen.
- **Näkyy:** `allegro_moderato_O_alku`: kajo kaukana paisuu ja himmenee; kun se himmenee, läpi tuleva valo toisessa
  kohdassa paisuu. Kaksi paikkaa, sama tahti. Käyttäjä: "hitaat vuorottelut kornojen <> ja trumpettien välillä".
- **Kamera:** hidastuu selvästi.
- **Puuttuu datasta:** kumpi paisutus on kumman (luku 8).

#### 43 Tyven · `allegro_moderato_O_loppu` → `P_vaskipaisunta` · <!--aika-->12:48–13:26<!--/aika-->
- **Teko:** pienet kuviot liikkuvat keskellä, ja niiden ympärillä on paljon tyhjää.
- **Tunne ja johtaja:** tyven ennen viimeistä varoitusta. Väike ja ohut linja harvakseltaan.
- **Näkyy:** `harva_kuviointi`: yksittäiset pisteet ja lyhyet viivat. `kerros katoaa` (pohja): maa poissa pitkään.

#### 44 Viimeinen varoitus · `P_vaskipaisunta` → `dim_possibile` · <!--aika-->13:26–13:45<!--/aika-->
- **Teko:** valo tulee takaa eteen yhdellä paisutuksella, ja maa palaa sen alle.
- **Tunne ja johtaja:** viimeinen varoitus. Läpi tuleva valo ja pohjan tärähdys.
- **Näkyy:** `P_vaskipaisunta`: yksi leveä leikkaus, joka kasvaa hiljaisesta täyteen ja kulkee kaikkien kerrosten
  läpi. Säikeet mukana. Pilkkopimeän kirkkain hetki.
- **Iskut:** valon leikkaus.

#### 45 Metsä tyhjenee · `dim_possibile` → `hiljaisuus_2_alku` · <!--aika-->13:45–14:05<!--/aika-->
- **Teko:** metsä tyhjenee: leikkaukset himmenevät pois, ja rungot harvenevat kahteen viimeiseen.
- **Tunne ja johtaja:** tyhjenevä. Metsän säikeet.
- **Näkyy:** `dim_possibile`: leikkaukset himmenevät pois. Säikeet lähellä, lämpimimmillään muodoltaan (pitkä,
  kaartuva viiva), eivät väriltään. `kerros katoaa` (ylärekisteri): latvat ja taivas pimenevät.
- **Kamera:** hidastuu. **Kulku 6 alkaa** `dim_possibile`: suunta on kahden viimeisen rungon väli.

### Maailma 7: Aukea

Perusliike: hyvin hidas ajo suoraan kohti horisonttia. Aukea on metsän sisällä: jäinen selkä, jonka takana on
vastarannan kuusikko. Kerrokset: lähellä musta jää ja reunoilla viimeiset rungot, keskellä jäätä pitkin ajelehtiva
pakkasusva, kaukana horisontti ja kuusikon tumma sahalaita. Tila on ensimmäisen kerran suurempi kuin katsoja.
Myrskyssä kerrokset menettävät eronsa (tyyliohjeen nimetty poikkeus): sama valo, sama väri, sama suunta. Lumi kulkee
silti kolmessa etäisyydessä, joten ajo näkyy.

#### 46 Toinen tyhjyys · `hiljaisuus_2_alku` → `myrsky_nakyy` · <!--aika-->14:05–14:17<!--/aika-->
- **Teko:** viimeiset rungot jäävät reunoille ja taakse, ja edessä on tumma jää ja usva.
- **Tunne ja johtaja:** tyhjä, uhkaava. Ei johtajaa: jouset soittavat kuulokynnyksellä, ja niiden vastine on tuskin
  näkyvä väreily kaukaisessa usvassa. **Nimetty hengähdys.**
- **Näkyy:** `hiljaisuus_2_alku`: ei elementtejä, ei horisonttia vielä. Kuva ei ole musta: lähellä jään pinta erottuu
  juuri ja juuri kameran alla ja liukuu ohi, ja viimeiset rungot jäävät reunoilla taakse; keskellä usva liikkuu
  hitaammin; kaukana on sininen usvaseinä ilman viivaa, ja sen heikko hämärä on kuvan ainoa valo.
- **Kamera:** jatkaa hyvin hitaasti. **Kulku 6 päättyy** `myrsky_nakyy`.

#### 47 Se näkyy · `myrsky_nakyy` → `myrsky_kasvu` · <!--aika-->14:17–14:27<!--/aika-->
- **Teko:** horisontti paljastuu usvan takaa kapeana vaaleana nauhana, ja nauha alkaa liikkua.
- **Tunne ja johtaja:** etäinen uhka. Metsän säikeet hyvin kaukana, tuskin erottuvina.
- **Näkyy:** `myrsky_nakyy`: usvaseinä ohenee, ja sen takaa paljastuu ensimmäinen horisontti koko teoksessa:
  vastarannan kuusikon sahalaita ja sen yllä kapea vaalea nauha. Nauha väreilee, koska jouset soittavat jo.
  `hiljaisuus_2_loppu`: mitattu hiljaisuus päättyy, ja väreily on jo selvää. Käyttäjä: "niinkuin kaukaa tuleva lumi ja jää. Aluksi se vain näkyy".

#### 48 Se tulee · `myrsky_kasvu` → `myrsky_iskee` · <!--aika-->14:27–14:33<!--/aika-->
- **Teko:** nauha kasvaa ja lähestyy paljon nopeammin kuin kamera sitä.
- **Tunne ja johtaja:** lähestyvä, vyöryvä. Metsän säikeet.
- **Näkyy:** `myrsky_kasvu`: vaalea seinä nousee horisontista, peittää kuusikon ja täyttää lähestyessään kuvan
  reunasta reunaan. `nousu`: sen yläreuna kohoaa
  koko kuvan korkeudelle. Säikeet erottuvat siinä yksittäin.
- **Kamera:** ei kiihdytä, ei väistä.

#### 49 Se iskee · `myrsky_iskee` → `Q_koko_metsa` · <!--aika-->14:33–14:50<!--/aika-->
- **Teko:** lumi ja jää ovat päällä, ja kerrosten erot häviävät.
- **Tunne ja johtaja:** pelottava, velloava. Kerrokset yhtenä (vain säikeet: metsä itse).
- **Näkyy:** `myrsky_iskee`: lähellä, keskellä ja kaukana on sama valo, sama väri ja sama suunta. Lumi kulkee silti
  kolmessa etäisyydessä. Hallan valkeaa ja nokea, ei muuta. Käyttäjä: "iskee sitten päälle kuin myrsky".
- **Iskut:** kerrokset menettävät eronsa `myrsky_iskee`; se on tämän oton vastine iskuun.

#### 50 Maa ja taivas liittyvät · `Q_koko_metsa` → `myrsky_huippu` · <!--aika-->14:50–15:10<!--/aika-->
- **Teko:** pystysuorat leikkaukset iskevät massan läpi, ja maa tärähtää sen alla.
- **Tunne ja johtaja:** ylivoimainen. Kerrokset yhtenä; läpi tuleva valo ja pohjan tärähdys sen sisällä.
- **Näkyy:** `Q_koko_metsa`: leikkaukset ylhäältä alas; jokainen näyttää hetkeksi kuusikon rungot lumen läpi: metsä
  on edessä. `äkillinen hiljeneminen`: valo ja liike katkeavat
  ruudussa ja palaavat.
- **Kamera:** on myrskyn sisällä ja ajaa sen läpi samaa suuntaa. Ei tärinää.
- **Iskut:** valon leikkaus ja pohjan tärähdys. Aksentteja ei tässä erotu: ajoitus `taso_dbfs`.

#### 51 Huippu · `myrsky_huippu` → `R_vasket` · <!--aika-->15:10–15:23<!--/aika-->
- **Teko:** kuva on täynnä, mitään yksittäistä ei erota, ja sitten se alkaa ohentua.
- **Tunne ja johtaja:** huippu. Kerrokset yhtenä.
- **Näkyy:** `myrsky_huippu`: teoksen tihein kuva, hallaa ja nokea; ei kirkkaampi kuin taottu aurinko. `lasku`: massa painuu. `kerros katoaa`
  (ylärekisteri): yläosa pimenee. `urkupiste`: maa erottuu taas ja pysyy.

#### 52 Jälkiaalto · `R_vasket` → `toinen_paisunta` · <!--aika-->15:23–15:35<!--/aika-->
- **Teko:** yksi leikkausten aalto kulkee vielä läpi, ja säikeet vastaavat.
- **Tunne ja johtaja:** se ei lopu kerralla. Läpi tuleva valo, sitten säikeet.
- **Näkyy:** `R_vasket`: vaskien valo paisuu ja laskee. `nousu`: kaikki ampaisee ylös, jyrkin nousu koko teoksessa.

#### 53 Nousu · `toinen_paisunta` → `huuto` · <!--aika-->15:35–15:45<!--/aika-->
- **Teko:** säikeet kiipeävät maasta ylös vuoron perään, ja kamera alkaa nousta niiden mukana.
- **Tunne ja johtaja:** velloava, kohoava. Metsän säikeet.
- **Näkyy:** `toinen_paisunta`: ensin lyhyt laskeva välähdys (väike), sitten säieryhmä toisensa jälkeen alhaalta
  ylös.
- **Kamera:** **nousee ensimmäisen kerran**: ylös, ei taakse; eteenpäin kulku jatkuu. `toinen_paisunta` on huudon
  alku (tyyliohje luku 5). **Kulku 7 alkaa.**

#### 54 Huuto · `huuto` → `yksinaiset_aanet` · <!--aika-->15:45–16:00<!--/aika-->
- **Teko:** kamera tulee myrskyn yläpuolelle, ja korkeat säikeet jäävät yksin latvojen ylle.
- **Tunne ja johtaja:** yksinäinen, paljas. Metsän säikeet korkeimmillaan.
- **Näkyy:** `huuto`: muutama pitkä, värisevä säie ylhäällä (`tremolo`), ei muita elementtejä niiden ympärillä. Myrsky
  vajoaa alle, ja siitä nousevat esiin ensimmäiset lumiset latvat; kaukana on himmeä horisontti. Maa tärähtää kaukana
  alhaalla yhä heikommin. Ei hahmoa: ääni, joka jäi.
- **Kamera:** **Kulku 7 päättyy** `yksinaiset_aanet`.

### Maailma 8: Metsä myrskyn jälkeen

Perusliike: hidas ajo eteen latvojen tasalla; hidastuu `S_sempre_mf`:stä alkaen ja pysähtyy H-duuriin. Kerrokset:
lähellä lumiset latvat, keskellä metsän selänteet, kaukana horisontti ja valo sen takana.

#### 55 Yksi kerrallaan · `yksinaiset_aanet` → `S_sempre_mf` · <!--aika-->16:00–16:21<!--/aika-->
- **Teko:** yksi elementti kerrallaan paisuu latvojen yllä ja häipyy.
- **Tunne ja johtaja:** paljas, hiljenevä. Hämyn ääni, väike ja toinen, matalampi hämyn ääni: vuorotellen, ei yhtä
  aikaa.
- **Näkyy:** `yksinaiset_aanet`: puoliksi näkyvä muoto keskellä, pilkahdus ylhäällä, toinen puoliksi näkyvä muoto
  alempana keskikerroksessa. Jokainen
  paisuu ja laskee. `lasku`: näkymä asettuu, ja koko metsä on alla ja edessä uuden lumen alla.

#### 56 Ääni, joka ei enää lakkaa · `S_sempre_mf` → `loppuhuipennus` · <!--aika-->16:21–16:52<!--/aika-->
- **Teko:** valon viiva paljastuu horisontissa ja pysyy, ja metsä alkaa kasvaa sen edessä.
- **Tunne ja johtaja:** rauhoittuva, kokoava. Valon viiva (metsän säikeet yhtenä pitkänä viivana).
- **Näkyy:** `S_sempre_mf`: sama viiva kuin alussa. Se ei kasva: mikään ei enää peitä sitä, ja se näkyy koko
  pituudeltaan horisontissa. `kerros tulee` (pohja) ja
  `urkupiste`: maa palaa ja pysyy. `basso liikkuu`: maa liikahtaa vielä kerran.
- **Kamera:** alkaa hidastua jatkuvasti.

#### 57 Viimeinen aalto · `loppuhuipennus` → `loppu_Hduuri_alku` · <!--aika-->16:52–17:04<!--/aika-->
- **Teko:** kaikki kerrokset kulkevat ohi yhdessä valossa, ja elementit lähtevät yksi kerrallaan.
- **Tunne ja johtaja:** viimeinen aalto, ei voitto. Kerrokset yhtenä.
- **Näkyy:** `loppuhuipennus`: aalto vyöryy kameran ohi, ei sitä kohti. Sen jälkeen leikkaukset, kajo ja tärähdys
  himmenevät pois, kukin vuorollaan. Jäljelle jää metsä ja valon viiva. Lopun hiljaisin kuva ennen kajoa: elementit
  ovat lähteneet, metsä ja viiva pysyvät, eikä kuva pimene.
- **Iskut:** kerrokset yhtenä; ei leikkauksia.

#### 58 Oikea valo · `loppu_Hduuri_alku` → `viimeiset_askeleet` · <!--aika-->17:04–17:24<!--/aika-->
- **Teko:** kamera pysähtyy, ja kajo tulee kerrosten takaa.
- **Tunne ja johtaja:** hellä, koskettava, avoin. Metsän massa kaikissa kerroksissa, tasaisesti.
- **Näkyy:** `loppu_Hduuri_alku`: valo tulee suoraan edestä matalalta, samasta suunnasta kuin metsän oma valo on
  aina tullut, mutta nyt kajon värisenä. Se ei häikäise eikä kasva: mezzoforte. Pystysuorat rungot ja yksi
  vaakasuora horisontti levossa. `urkupiste`: maa ja horisontti paikallaan. Käyttäjä: "massiivinen päätöspiste,
  mutta ei julistava, vaan hellä".
- **Kamera:** **Nimetty pysähdys 2.** Pysähtyminen on lopun tapahtuma.

#### 59 Viimeiset askeleet · `viimeiset_askeleet` → `musiikki_loppuu` · <!--aika-->17:24–17:31<!--/aika-->
- **Teko:** paino sykkii maassa vielä hetken valon alla ja pysähtyy.
- **Tunne ja johtaja:** viimeinen. Pohjan askeleet.
- **Näkyy:** `viimeiset_askeleet`: painumat lumessa edessä, jokainen edellistä pienempi. Ne eivät enää siirry
  eteenpäin. `loppu_Hduuri_loppu`: massan liike lakkaa, kajo jää ennalleen.

#### 60 Kolmas tyhjyys · `musiikki_loppuu` → `tiedoston_loppu` · <!--aika-->17:31–17:58<!--/aika-->
- **Teko:** kuva lakkaa muuttumasta.
- **Tunne ja johtaja:** hiljaisuus, joka jäi. Ei johtajaa. **Nimetty hengähdys.**
- **Näkyy:** sama kuva kuin oton 59 lopussa, liikkumatta loppuun asti. Ei pimennystä, ei tekstiä.
- **Iskut:** ei mitään. Äänitteen loppukohinan iskut ohitetaan (luku 8).

## 6. Iskut ja ruutukanavat: yleissäännöt

**Iskut** (`cues.json`, kenttä iskut). Jokainen isku saa ympäristön vastineen iskun ruudussa. Otossa, jossa on rivi
**Iskut**, vastine on rivin nimeämä. Muissa otoissa matalan kaistan isku on pohjan tärähdys ja muu isku metsän massan
hetkellinen etääntyminen. Vastineen suuruus seuraa iskun voimaa. Vastaaja on aina jo kuvassa: mikään ei ilmesty eikä
katoa iskussa, väri ei vaihdu iskussa, ja kamera ei reagoi. Väike, hämyn äänet, ohut linja ja pohjan toinen ääni eivät
reagoi iskuun (tyyliohje luku 7).

**Ruutukanavat** (`build/<paketti>/ohjaus.f32`). Luotettavuus: `docs/tapiola_tutkimus.md` luku 13.

| Kanava | Ohjaa kuvassa |
|---|---|
| `taso_dbfs` | valon kokonaismäärä; kuinka lähelle johtava elementti tulee |
| `osuus_matala`, `osuus_keski`, `osuus_korkea` | kuinka näkyvä on maa ja juuret, runkojen korkeus, latvat ja taivas |
| `bassolinja_midi` | maan taso; urkupisteellä se ei liiku |
| `painopiste_matala`, `painopiste_keski`, `painopiste_korkea` | valon korkeus kunkin kerroksen sisällä |
| `ylalinja_midi` | ylimmän säikeen tai pilkahduksen korkeus |
| `uusia_matala`, `uusia_keski`, `uusia_korkea` | liikkeen tiheys kerroksittain; askeleet (`uusia_matala`); kameran nopeus vain hitaana keskiarvona |
| `tremolo` | väreily paikallaan |
| `suunta` | kohoaako vai painuuko valo |
| `jouset`, `puupuhaltimet`, `vasket` | vain hidas painotus siitä, mikä elementtiperhe on esillä; ei koskaan ajoitusta (karkea ja myöhässä) |

## 7. Kameran nimetyt kohdat

| Kohta | Ankkuri | Mitä kamera tekee |
|---|---|---|
| Hengähdys | `hiljaisuus_1_alku` | jatkaa samaa nopeutta sokeassa lumessa |
| Hengähdys | `hiljainen_jakso_alku` | jatkaa hitaimmillaan |
| Painuminen | `jannitesoinnut` | linja painuu vähitellen mustaa pintaa kohti ja sen läpi; eteenpäin kulku jatkuu; linja oikenee `pohja_vaihtuu_D` |
| **Pysähdys 1** | `auringonsade` | seisoo; lähtee `M_ennakko` jatkuvalla kiihdytyksellä ja kääntyy hitaasti väärän valon kohtaan |
| Hengähdys | `hiljaisuus_2_alku` | jatkaa hyvin hitaasti mustan yli |
| Nousu | `toinen_paisunta` | huudon alku: nousee ylös myrskyn läpi; ainoa kerta |
| Hidastus | `S_sempre_mf` | hidastuu jatkuvasti |
| **Pysähdys 2** | `loppu_Hduuri_alku` | seisoo loppuun asti |

Muualla kamera liikkuu aina sisään ja eteen, ei peruuta, ei pyöri eikä ylitä 20 °/s.

## 8. Auki: käyttäjän päätökset ja puuttuva data

**Käyttäjä päättää:**
1. ~~Kahdeksan maailmaa ja seitsemän kulkua (luku 2).~~ **Hyväksytty 9.11.2026.**
2. ~~C-duurin väärä valo: punainen vai messinki.~~ **Punainen, hyväksytty 9.11.2026** ("C duuri voi olla punainen,
   sopii sibeliukseen").
3. D-duurin välähdykset: kelmeä ja hämärä hallan valo, ei keltainen. Käyttäjä 9.11.2026: "H-duuri on D mollin rinnakkaisduuri. Synkkä ja hämärä."
   Lause on kirjattu sanasta sanaan; ohjaajan tulkinta: tarkoittaa D-duuria h-mollin rinnakkaisduurina, kuten haastattelussa ("Sen rinnakkaisduuri on D"); käyttäjä samana päivänä: "tämä oli virhe minun osaltani", eli sävellajit menivät lauseessa ristiin. **Päätetty 9.11.2026.**
4. Tyyliohjeessa sana kajo tarkoittaa kahta asiaa: käyrätorvien kaukaista valoa ja H-duurin väriä. Tässä
   käyrätorvien valo on salon värinen koko teoksen, ja kajon väri tulee vasta H-duurissa. Sopiiko?
5. Loppu: kuva seisoo liikkumatta tiedoston loppuun eikä pimene. Sopiiko YouTube-versioon?

**Puuttuu datasta** (korjataan teemakarttaan tai kuuntelutyökaluun ennen kuin kyseinen otto piirretään):
1. `c_duuri_valahdykset`: kolmen vilahduksen omat ajat.
2. `allegro_moderato_O_alku`: kumpi paisutus on käyrätorvien ja kumpi trumpettien. Mittaus ei erota niitä.
3. Puhaltimien paisutukset alun pitkällä äänellä on mitattu, mutta ne eivät ole tapahtumina: otto 05 nojaa
   kanavaan `taso_dbfs`, ja se on todennettava luonnoksesta.
4. Iskut `musiikki_loppuu` jälkeen ovat kohinaa ja ohitetaan.
5. Myrskyn sisältä (`myrsky_iskee` – `toinen_paisunta`) ei löytynyt yhtään aksenttia.
6. Useimpien ankkurien aika on analyysin ehdotus, ei korvalla vahvistettu.

## 9. Lähteet: millainen on hyvä kuvakäsikirjoitus

- Kentät ja prosessi: [Boords, How to storyboard a video](https://boords.com/how-to-storyboard/video);
  [Mister Chad, Storyboards](https://publish.obsidian.md/mister-chad/animation/storyboards).
- Tunteen kaari, hengähdykset, värikaari: [Pixar Story-Driven Storyboarding](https://www.thepromptindex.com/skill/916-storyboard-pixar-story-driven)
  (yhteisön kirjoittama ohje, ei Pixarin oma); [Color scripting and emotional arc, BINUS](https://animation.binus.ac.id/2025/12/09/color-scripting-and-emotional-arch/).
- Selkeys ja yksi ajatus per ruutu: [StudioBinder, Storyboard rules](https://www.studiobinder.com/blog/storyboard-rules);
  [Mike Milo's advice](https://wrmilleronline.com/mike-milos-advice-for-becoming-a-storyboard-artist/).
- Kuvan ajoitus musiikkiin, tahtikaavio: [Animation Resources, Musical timing rediscovered](https://animationresources.org/?p=637);
  [AWN, Animation and music](https://www.awn.com/print/animationworld/animation-and-music-you-cant-have-one-without-other).
- Valmista skilliä ei otettu käyttöön: hakemiston lähimmät (animation-studio, scripting-and-storyboarding, CineFlo)
  tuovat oman tyylinsä tai ovat näytelmäelokuvaa ja somevideoita varten.
