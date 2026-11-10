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
