**Lue ensin `docs/visuaalinen_tyyli.md` kokonaan ja `runs/vedos_v5/brief.md` kokonaan (ja kaikki, mitä ne käskevät lukea). Vasta sitten tämä.**

# Korjaus: moduuli `visual/maailma_01_02.js` (alku: horisontti ja siemen), `tiedoston_alku` → `fis_pitka_aani`

Tämä on teoksen tärkein kuva: siemen, josta kaikki kasvaa ja joka palaa lopussa. Käyttäjä on palannut siihen kuusi kertaa.

## Käyttäjän sanat (uusimmat ensin)
- 10.11.: "Se gis idea ei nyt oikein välity sieltä. ... Jousien (eli metsän) takaa pitäsi jotenkin tulla ESIIN ne mäet
  (nousevat ja laskevat kulut). Eli dynaaminen. Mutta miten se tehdää niin että ne mäet ei ole koomisia, vaan hitaita ja
  uljaita. Nythän ne on vaan tuossa kuvassa paikallaan."
- 10.11. (lopusta, moduuli 11_12): "Mielestäni siinä oli paras renderöinti metsästä. Pitäisikö sitä käyttää alussa myös?
  Harkitse? (Ilman revontulia)"
- 9.11.: "Sibelius ajatteli ehkä horisonttia - siksi lähes unisono - josta sitten nousee yksittäisiä soittajia puiden takaa -
  Jouset kuvaa sitä tummaa metsää." · "se Gis on tavallaan niinkuin horisontti - joka sitten hellävaraisesti muodostaa mäkiä."
  · "puhaltajat kukin vuorollaan tulee esiin ja tekevät pienet nousevat ja laskevat kuviot (ovatko mäkiä??) jotka tulevat
  ikäänkuin esiin sieltä metsän siimeksestä" · "Ei teräviä vuoria. ... vaaroja, kumpuja ja korkeintaan tuntureita. Ne ovat
  aina sileitä" · parallaksi: "Lähellä olevat kappaleet liikkuvat nopeamin, kaukana hitaasti" · ei etualan puuta.

## Ohjaajan tulkinta (sitova tälle moduulille): vaarat eivät nouse, ne paljastuvat
Maa on ikiaikainen eikä liiku. **Usva ja valo liikkuvat.** Koomisuus on aina syntynyt siitä, että muoto kasvoi ja kutistui
äänen tahdissa. Perusteet: tyyliohje 7b "Paljastuminen" (etummainen väistyy, takana ollut jää näkyviin, mitään uutta ei
tuoda) ja 4d kohdat 5, 9, 10, 17, 18; Guo Xi: usva erottaa etäisyyden tasot; Järnefelt: katse latvoista vaaroihin ja
horisonttiin; kansanruno: "salo siintääpi sininen" (`docs/tutkimus/taide1920.md` luku 7, `docs/tutkimus/mytologia.md`).

## Lähtökohdat koodissa
- **Metsän piirto: `visual/maailma_11_12.js`** (kuusten matto korkeuskenttänä, valo latvoissa, usva, sileä vaara, Tapion talon
  ikkunat, horisontin valo, lumi). Ota siitä metsän, vaaran, usvan ja lumen piirto. **Ei revontulia, ei kajon lämpöä, ei
  myrskyn seinää.** Loppu (11_12) on tämän kuvan paluu: käytä samaa suuren vaaran profiilia ja ikkunoiden paikkoja, jotta
  katsoja tunnistaa lopussa alun.
- **Äänen kytkennät: `visual/maailma_01_02_suo.js`** (edellinen alku, talletettu): jousten roolit ankkureista, gis-taso,
  patarummun rengas, vaskien iskun valo, puuska, lumi, lopun kulku rajakuvaan PIMEA_MASSA. Ota kytkennät, älä suomaisemaa.
- Moduulin nimi pysyy `visual/maailma_01_02.js`. Renderi: `runs/alku_v4/osa.mp4`, tarkistus `runs/alku_v4/tarkistus.md`.

## Kuva
Katsoja on latvojen yläpuolella matalalla (selvästi matalammalla kuin lopussa: metsä on lähellä ja täyttää kuvan alaosan,
latvat erottuvat edessä ja sulavat usvaan kauempana) ja kulkee eteenpäin metsän yli kohti horisonttia, hieman viistoon
(parallaksi). Kamera ei koskaan mene latvojen läpi ennen loppua. Horisontti on kuvan yläkolmanneksessa. Yö, hämy ja salo.

## Mitä tapahtuu, ankkuri ankkurilta
1. **Ennen ääntä:** pimeä metsä, lumi sataa, horisontissa ei vielä valoa. Kamera kulkee jo.
2. **`avaus_patarumpu`:** pehmeä valon rengas kulkee maassa metsän alla (näkyy latvojen väleistä), ei välähdystä taivaalla.
3. **`jouset_tulevat` (siemen):** jouset ovat metsä. Metsä tulee läsnä olevaksi: tummuus ja terävyys kulkevat aaltona lähimmistä
   latvoista kauemmas, tuuli taivuttaa latvoja (kumipuusääntö) ja lumi pöllyää niistä. Käyrätorvien gis soi jo takana: horisontin
   valo on olemassa, mutta himmeänä metsän ja usvan takana.
4. **`gis_paljastuu`:** jouset lopettavat. Metsä väistyy usvaan (pehmenee, vaalenee kaukaa alkaen), ja takana koko ajan ollut
   valo paljastuu: **suora, yhtenäinen valon viiva horisontissa** (unisono = yksi viiva). Ei vielä yhtään vaaraa.
5. **`siemen_toistuu`:** sama ele kuin kohdassa 3; viiva jää metsän taakse.
6. **`puhallinkuviot_alku` → `gis_pitka_aani_loppu`: vaarat tulevat esiin metsän takaa.** Gis-äänen taso paisuu ja laskee noin
   kaksitoista kertaa (laske huiput `d.taso(68, f)`:stä tasoitettuna; älä kovakoodaa aikoja). **Jokainen paisutus paljastaa yhden
   vaaran:**
   - Vaara on koko ajan paikallaan, mutta usvassa näkymättömänä. Paisutuksen aikana usva laskee sen edestä ja **gis-valo
     kulkee sen harjaa pitkin** vasemmalta oikealle (tai soittajan kulun suuntaan): suora valon viiva kohoaa kaareksi, koska se
     nyt seuraa vaaran harjaa. Harjan muoto on sileä ja loiva, ja sen korkeus tulee paisutuksen aikana soivan kulun ylimmästä
     sävelestä gis:n yläpuolella (`d.nuotit`, midi 69–84): korkeampi kulku, korkeampi vaara. Ei piikkejä, ei hartioita.
   - **Hidas ja uljas:** vaara tulee esiin noin 1,2–1,5 sekunnissa (pehmeä käyrä) ja vajoaa takaisin usvaan hitaasti (noin
     8 s), mutta ei katoa: se **jää siintämään** himmeänä sinisenä (noin neljännes näkyvyydestä). Harjan valo hengittää
     paisutuksen mukana (< >). Enintään kaksi vaaraa kirkastuu yhtä aikaa.
   - Vaarat ovat eri etäisyyksillä (3–4 tasoa, kauimmat sinisimmät ja himmeimmät) ja eri kohdissa horisonttia, paikat
     siemenestä (deterministinen), niin että ne limittyvät. **Maisema kertyy:** ennen vaskien iskua metsän takana on koko
     vaarojen jono. Suurin ja viimeisenä paljastuva on **Tapion talo** (sama profiili ja ikkunat kuin lopussa); ikkunat
     kuumottavat hopeisina gis:n voiman mukaan.
   - Mikään vaara ei muuta muotoaan eikä korkeuttaan missään vaiheessa. Liike on usvan, valon ja kameran (parallaksi).
7. **`patarumpu_paisuu`:** maa värisee metsän alla (valo latvojen väleissä), usva alkaa liikkua.
8. **`vaskien_isku`:** pystysuora valon leikkaus metsän takana (nimetty isku; lähimmät latvat jäävät siluetiksi), ja
   **`tuulenpuuska`:** lumi pyyhkäisee metsän yli, latvat taipuvat (enintään 4 %), lumi pöllyää, ja **puuska peittää vaarat ja
   valon viivan** ("valon viiva ei sammu, se peittyy").
9. **`fraasi_ennen_taukoa`:** jousten lyhyt fraasi: metsän tumma aalto vielä kerran. **`hiljaisuus_1_alku`:** äänen elementit
   lakkaavat samassa ruudussa (ei viivaa, ei valoa, ei tuulta), metsä ja hiljainen lumi jäävät, kamera jatkaa.
10. **Hiljaisuuden aikana ja sen jälkeen:** kamera laskeutuu latvojen väliin ja metsän tumma massa täyttää kuvan: hetkellä
    `fis_pitka_aani` kuva on rajakuva `RAJA.PIMEA_MASSA` (kuten edellisessä versiossa; sauma moduuliin 03_04 mitataan).

## Tarkista liikesarjoista ja stilleistä
- Still ennen ensimmäistä paisutusta: horisontti on suora viiva, ei vaaroja. Still juuri ennen `patarumpu_paisuu`: vaarojen
  jono ja Tapion talo.
- Liikesarja kahdesta peräkkäisestä paisutuksesta (0,2 s välein, 20 ruutua): vaara tulee esiin usvasta, valo kulkee harjaa
  pitkin, muoto ei muutu.
- `gis_paljastuu` ± 2 s: metsä väistyy, viiva paljastuu.
- Kumipuutodiste puuskasta. Kamera ei mene maan eikä latvojen läpi ennen kohtaa 10.
- Vertaa lopun kuvaan (`runs/maailma_11_12/osa.mp4`, loppupuoli): sama vaara, sama metsä, tunnistettavasti sama paikka.

## KIERROS 2 (10.11.2026): kriitikon raportti `runs/alku_v4/kriitikko_v5.md` ja ohjaajan päätökset. Lue raportti kokonaan.

**Suunta on oikea** (kriitikko ja ohjaaja): suora valon viiva, vaarat yksi kerrallaan, Tapion talo viimeisenä, jousten lakkaaminen
paljastaa viivan, kamera etenee, ei kumipuita, lumi liikkuu. **Säilytä nämä.** Renderi ei silti kelpaa: paljastus on nopea tuike,
ei hidas ja uljas tulo. Korjaa kaikki alla olevat; numerot viittaavat kriitikon bugilistaan.

1. **Ajoitus (bugi 1, estävä).** Mitattu nyt: tulo 0,5–0,6 s, lasku alle sekunnissa. Vaadittu ja mitattava valmiista renderistä:
   - **Vaaran näkyvyys** (maamassa usvasta): pehmeä tulo **1,4 s** (alkaa noin 0,8 s ennen paisutuksen huippua, täysi huipussa),
     vajoaminen eksponentiaalisesti **aikavakiolla 8 s** lattiaan **0,35** (jää siintämään). Näkyvyys ei koskaan laske nopeammin.
   - **Harjan valo** on eri käyrä: se seuraa paisutuksen muotoa 0,6 s tasoitettuna ja hiipuu noin 3 sekunnissa, ei alle sekunnissa.
   - Koska paisutuksia on kahden sekunnin välein, vaarat limittyvät: katsoja näkee maiseman **kertyvän**, ei kahtatoista välähdystä.
   - Raportoi mittaus kolmesta vaarasta ruutu ruudulta (harjan kirkkaus ja rungon erottuvuus taivaasta): tulo 10→90 % ja lasku.
2. **Vaara on maata, ei valokaari (bugi 2, estävä).** Rungon pitää erottua taivaasta myös ilman harjan valoa: sinertävä, usvainen
   massa (salo), kauimmat tasot vaaleimpia ja sinisimpiä (ilmaperspektiivi), lähimmät tummempia, tyvi usvassa. Paljastuminen etenee
   ylhäältä alas: harja tulee esiin ensin, sitten rinne, kun usva laskee. Lähimmän tason harjassa saa olla hienoinen metsän
   pintarakenne (ei sahalaitaa, ei piikkejä).
3. **Muoto (kriitikon vastaus b).** Ei symmetrisiä kellokäyriä. Jokainen vaara on kahden tai kolmen leveän, eri levyisen kummun
   summa: pitkä loiva rinne toisella puolella, lyhyempi toisella; leveys 40–90 % kuvan leveydestä, matala. Vaarat limittyvät
   syvyydessä eivätkä ole rivissä vierekkäin. Kolme oikean reunan pientä vaaraa, joista näkyy vain osa: siirrä tai levennä.
4. **Vaarat ovat maailmassa, eivät kuvaruudussa (bugi 4, estävä).** Jokainen taso liikkuu kameran sivuttaisliikkeen ja etenemisen
   mukana etäisyytensä suhteessa: lähin vaarataso liukuu ja kasvaa näkyvästi minuutin aikana, kaukaisin lähes ei. Raportoi siirtymä.
5. **Lähimmät kuuset eivät saa vaaleta pylväiksi (bugi 3, estävä; kriitikon vastaus c ja bugi 11).** Käytä kuusille samaa muotoa,
   kapeutta ja hienoa pintarakennetta kuin `maailma_11_12.js` (älä pehmennä tai suurenna niitä toisin kuin lopussa); tuo ne lähelle
   kameran korkeudella, ei skaalalla. Valo osuu vain latvojen kärkiin ja lumisiin reunoihin ohuena reunavalona. Lähimetsän
   kirkkaus (p99) saa nousta paisutuksissa ja iskussa enintään noin 1,3-kertaiseksi tummaan tilaan verrattuna.
6. **Metsä jatkuu horisonttiin (bugi 6, estävä).** Piirteetön sumukaistale ja terävä vaakareuna pois: latvat pienenevät ja
   sulavat usvaan kerroksittain, usvan reunat ovat pehmeitä. Ainoa suora vaakaviiva kuvassa on valon viiva.
7. **Jouset ovat metsän läsnäolo, ei pelkkä himmennys (bugit 7 ja 13).** Kun jouset soittavat (`jouset_tulevat`, `siemen_toistuu`,
   `fraasi_ennen_taukoa`): metsä tummuu **ja terävöityy** (kontrasti kasvaa, latvojen kärjet saavat viivan valosta ohuen reunan),
   tuulen aalto kulkee latvojen yli läheltä kauas ja lumi pöllyää latvoista. Tummimmillaankin metsä on luettava kuusikko.
   Fraasin 0:54 pitää olla selvä ele, ei 12 % himmennys.
8. **Patarumpu (bugit 5 ja 8).** Avauksen rengas kulkee maassa latvojen välissä ulospäin 1,5–2 sekuntia pehmeänä aaltona, ei kahden
   ruudun naksahdus. `patarumpu_paisuu` (0:41–0:45): maan valo latvojen väleissä värisee ja kasvaa mitattavasti (vähintään 10 %
   kirkkauden muutos maan kaistalla) ja usva lähtee liikkeelle.
9. **Vaskien isku (bugi 9).** Valo ei saa ilmestyä tyhjästä: paisutuksen aikana (0:41–0:45) horisontin valo kerääntyy siihen kohtaan,
   josta leikkaus nousee (kirkastuva kohta viivalla), ja iskun ruudussa se leikkaa pystysuoraan. Huippu on iskun ruudussa.
10. **Tapion talo (bugi 10).** Sama koko suhteessa kuvaan, sama profiili ja sama pintarakenne kuin lopussa: katsojan pitää
    tunnistaa lopussa sama vaara. Tee rinnakkaisvertailu lopun kuvan kanssa ja liitä se todisteisiin.
11. **Puupuhaltimien tulo 0:26 (bugi 12).** Harjaa pitkin kulkeva valo etenee kulun sävelten mukaan (jokainen sävel on askel
    harjalla), niin että kulku näkyy valon matkana.
12. **Kulku metsän sisään (bugi 14).** Viimeiset noin kaksi sekuntia: latvat nousevat kameran ohi, oksat ja rungot kulkevat läheltä,
    ja niiden välinen pimeä kasvaa täyttämään kuvan. Rakenne näkyy viimeisiin ruutuihin asti; vasta viimeinen ruutu on rajakuva.
13. Alun 7,6 sekuntia: niin valoisa, että metsä ja kameran eteneminen erottuvat (pimeä, ei musta).

Renderöi koko väli uudelleen samaan paikkaan, tee todisteet (liikesarjat, mittaukset kohdista 1, 4, 5 ja 8, vertailu loppuun) ja
kirjoita `runs/alku_v4/tarkistus.md` uudelleen.

## KIERROS 3 (10.11.2026): kriitikon raportti `runs/alku_v4/kriitikko_v5b.md` ja ohjaajan päätökset. Lue raportti kokonaan.

**Kuva on nyt oikea** (ohjaaja ja kriitikko): kuuset ovat kuusia kuten lopussa, vaarat lukevat suomalaisina, loivina, sinertävinä
vaaroina ja maana, maisema kertyy, jousten tulo ja lakkaaminen näkyvät metsän läsnäolona, hiljaisuus toimii, kumipuita ei ole.
**Älä muuta näitä.** Tämä kierros on viimeistely: korjaa täsmälleen alla olevat, älä rakenna mitään uudelleen.

1. **Kirkas vaakakaista metsän päällä 41,8–46 s pois (estävä).** Se lukee valonheittimeksi tai jäätyneeksi järveksi (terävä
   yläreuna, kirkkaus +60 %, romahtaa 0,6 sekunnissa). `patarumpu_paisuu`n vastine on **pehmeä, epätasainen maan valo latvojen
   väleissä** (lumi puiden alla hohtaa ja värisee), ilman reunaa: lähimetsän kirkkain prosentti enintään 1,3-kertainen tummaan
   tilaan verrattuna, nousu paisutuksen mukana, hiipuminen iskun jälkeen vähintään 2 s.
2. **Vaarat liikkuvat kameran mukana (estävä).** Mitattu siirtymä on nolla. Tuo lähin vaarataso lähemmäs ja kasvata kameran
   sivuttaisliikettä niin, että 1080p:ssä lähin taso liukuu noin 15–25 px/s, keskimmäinen noin 8–12 px/s ja kaukaisin 2–5 px/s,
   tasaisesti koko ajan, ja lähin taso myös kasvaa hieman. Ei nopeampaa: maiseman pitää olla uljas, ei vierivä. Tapion talo on
   kaukaisimmalla tasolla. Mittaa valmiista renderistä reunan paikka 30 s ja 40 s kohdalla joka tasolta.
3. **Vaskien isku (estävä): ei ohut kylläinen laser tyhjästä.** Leikkaus kasvaa horisonttiin kertyneestä hehkusta ylöspäin noin
   0,15 sekunnissa niin, että huippu on iskun ruudussa; se on leveämpi ja pehmeäreunainen, ei kyllästy valkoiseksi, ja on metsän
   ja vaarojen takana (lähimmät latvat jäävät sen eteen siluetiksi).
4. **Avauksen patarumpu 7,6 s näkyy:** pehmeä valon rengas kulkee maassa latvojen välissä ulospäin 1,5–2 s; maan kaistan
   kirkkaus nousee vähintään noin 15 %.
5. **Fraasi 0:54 on selvä ele:** metsän tumma aalto läheltä kauas (tummuus vähintään noin 25 %), terävyys kasvaa, tuuli taivuttaa
   latvoja säännön rajoissa ja lumi pöllähtää. Nyt −9 %.
6. **Kulku metsän sisään loppuun asti:** viimeiset 1,6 s ovat rakenteetonta tummaa. Latvat ja oksat kulkevat kameran ohi ja
   niiden välinen pimeä kasvaa; rakenne näkyy niin, että tasaista on enintään viimeiset noin 0,3 s (rajakuva). Jos kruunukentässä
   ei ole runkoja, lisää lähelle tulevat oksat ja latvojen siluetit kulkua varten.
7. **Paljastuksen ajoitus:** maamassa tulee näkyviin ennen harjan valoa (noin 0,3 s), ei valokaari ensin. Harjan valon nousu
   10→90 % vähintään 1,2 s (mitattu 0,85 s) ja lasku puoleen vähintään 2,5 s (mitattu 1,4 s; vasemman vaaran lasku 29,0–29,4 s
   on liian nopea).
8. **0–24 s:** terävä horisonttireuna ja piirteetön kaistale metsän ja horisontin välissä: metsä jatkuu horisonttiin asti
   pienenevinä latvoina ja usvana. Ainoa suora viiva on valon viiva.
9. **Tapion talo yhtä leveä suhteessa kuvaan kuin lopussa** kohdassa 0:44 (nyt 55 % lopun leveydestä).
10. **Puupuhaltimien tulo 0:26:** harjan valo etenee kulun sävelten mukaan askelittain (nyt vain pulssi).

Renderöi koko väli uudelleen samaan paikkaan, mittaa kohdat 1, 2, 4, 5 ja 7 valmiista renderistä (luvut tarkistukseen), tee
liikesarjat, ja kirjoita `runs/alku_v4/tarkistus.md` uudelleen. Kierroksen 2 renderi talteen nimellä
`runs/v5_01_02/tark/osa_kierros2.mp4` ennen uutta ajoa.

