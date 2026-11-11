**LUE ENSIN KOKONAAN `docs/visuaalinen_tyyli.md` (erityisesti luku 4d kohdat 23–36, luvut 7, 7b ja 12) ENNEN MITÄÄN MUUTA.** Sitten tämä brief: yhteinen osa ja oman moduulisi luku.

# Vedos 7: täsmäkorjaukset käyttäjän palautteesta vedokseen 6 (palautelistan rivit 80–91)

Käyttäjä 10.11.2026 yöllä: "Anteeksi, nyt mutta moni asia meni huonompaan suuntan." ja "Miten muutat asioita pois, mitä en
pyytänyt muuttamaan?" Tämän kierroksen tärkein sääntö on siksi: **teet vain sen, mitä oman lukusi numeroidut kohdat
määräävät. Et paranna, siisti, viritä etkä kirjoita uudelleen mitään muuta.** Kaikki, mitä ei ole nimetty, pysyy ruudulleen
samana, ja todistat sen mittarilla (kohta T2).

## Yhteiset säännöt (käyttäjän sanat ovat tyyliohjeessa 4d 31–36)

**Y1 (KORJATTU 11.11. klo 0.50; aiempi "puu ei taivu lainkaan" on PERUTTU). Puut elävät kuten oikea puu: aavistuksen ja
hieman (4d.31).** Käyttäjä: "NE NIIDEN PUIDEN PITÄÄ ELÄÄ!!!! ... MUTTA EI KUTEN KUMIPUUT. NIIDEN TULEE OLLA ELÄVIÄ, muttta
hillitysti!!! KUTEN OIKEA PUU" ja "NE EIVÄT SAA HEILUA PALJON!!! MUTTA AAVISTUKSEN JA HIEMAN sopii tyyliin".
- **Älä poista puiden liikettä.** Jos poistit sen, palauta. Moduuleissa 03_04, 05, 06, 07_08, 09 ja 10 puiden liike jää
  **täsmälleen vedoksen 5 mukaiseksi** (`git show 09eac76:visual/maailma_<k>.js`): älä koske siihen. Moduulikohtaiset
  "Y1"-kohdat alempana (sway/uSway/huojunta pois) ovat peruttuja.
- **Moduuli 01_02 on poikkeus** (siellä kumipuut palasivat; ks. sen luku): liike säilyy, mutta rajataan.
- Yläraja kaikkialla: latvan sivuttaisliike enintään 1 % puun korkeudesta, puuskassa enintään 1,5 %. Jos moduulisi ylittää
  tämän jossain kohdassa, raportoi se ohjaajalle (älä korjaa omin päin, ellei lukusi käske).

**Y2. Lumi liikkuu rauhallisesti ja yhteen suuntaan (4d.32).** "Lumi ei voi lennellä töksähdellen sinne tänne. Siitä tulee
paha olo." Tarkista moduulisi lumi (ja lumipöly, viirut, pyörre) ja korjaa, jos jokin näistä ei toteudu:
- Hiutaleen paikka on nopeuden kertymä: `paikka(t) = alku + ∫ nopeus`. Missään ei ole termiä muotoa `paikka += tuuli(t) * k`,
  jossa `tuuli(t)` on hetkellinen arvo (silloin koko lumi hyppää, kun tuuli muuttuu). Kertymä lasketaan etukäteen taulukkoon
  ruuduittain (`seek(t)` pysyy tilattomana).
- Nopeuden suuruus muuttuu pehmeästi: nousu vähintään 0,5 s, lasku vähintään 1,5 s. Ei pysähdyksiä, ei ryöppyä iskussa.
- Suunta ei käänny edestakaisin: vaakanopeuden etumerkki on sama koko moduulin ajan; kulma saa muuttua enintään 10 astetta
  sekunnissa.
- Koko ruudun lumi ei reagoi iskuun. Isku näkyy valona; puuska on rajattu lumipölyn huntu, joka kulkee kuvan läpi samaan
  suuntaan kuin lumi muutenkin (kesto vähintään 1,5 s, pienet hiukkaset, ei suuria soikioita).
Todiste: taulukko nopeuden suuruudesta ja kulmasta 0,5 s välein niistä kohdista, joissa musiikki muuttuu eniten, ja suurin
ruutujen välinen muutos (nopeus ja kulma).

**Y3. Rytmi osuu soitettuihin ääniin tai sitä ei näytetä (4d.33).** Uusi data: `d.cues.alut.nuotit` = `[[t, kesto, midi,
nousu_dB], ...]`: jokaisen tunnistetun nuotin alku mitattuna nuotin omalta taajuudelta (noin 1,5 ms askel; ohjaaja tarkisti
spektrogrammista, että ne osuvat äänten alkuihin; vanhan `d.nuotit`-listan ajat ovat keskimäärin 20–40 ms myöhässä).
Melodiaa seuraavat valot (puupuhaltimet) sidotaan tähän listaan: valo alkaa ruudussa `Math.round(t * 30)`, korkeus = `midi`.
Kaistojen alut (`alut.korkea` ym.) eivät löydä sidottuja juoksuja: niitä ei käytetä puupuhaltimiin.

**Y4. Vaskien teeman viisi iskua (4d.34).** `d.cues.cues.find(c => c.id === '<ankkuri>').iskut_t` on lista mitattuja iskuja.
Ei omaa iskuntunnistusta: käytä listaa sellaisenaan.

**Y5. Ei ajasta kovakoodattuja sekunteja.** Kaikki ajat ankkureista (`d.aika`, `cues`), `iskut_t`:stä tai `alut`:sta. Tässä
briefissä mainitut kellonajat ovat ohjaajan mittauksia tarkistusta varten, eivät koodiin kirjoitettavia lukuja.

## Todisteet, jotka jokainen rakentaja palauttaa (kirjoita `runs/maailma_<k>/tarkistus.md`:n loppuun luku "Vedos 7")

**T1.** Renderöi koko moduuli lukon kautta: `node render/lukittu.mjs --data build/rattle_koko --page "visual/maailma.html?m=<k>&aa=2"
--start <A> --end <B> --workers 2 --chunk 40 --out runs/maailma_<k>/osa.mp4` (moduuli 01_02 paikkaan `runs/alku_v4/osa.mp4`).
**LOPULLINEN KORJAUS 10.11. klo 23.40 (ohjaaja tarkisti koodista: `yhteinen.js` asettaa `window.duration` = koko teos, ja
moduulit lukevat teoksen aikaa): `--start`, `--end` ja `--stills` ovat SEKUNTEJA TEOKSEN AJASSA.** Ei ruutuja, ei moduulin
omaa aikaa, ja `--end` on pakollinen. Koko moduulin rajat (A, B) ja valmiin osan ruutumäärä (tarkista `ffprobe`lla):

| moduuli | --start | --end | ruutuja |
|---|---|---|---|
| 01_02 | 0 | 61.6 | 1848 |
| 03_04 | 61.6 | 203.0 | 4242 |
| 05 | 203.0 | 336.8 | 4014 |
| 06 | 336.8 | 496.3 | 4785 |
| 07_08 | 496.3 | 691.6 | 5859 |
| 09 | 691.6 | 845.6 | 4620 |
| 10 | 845.6 | 945.0 | 2982 |

Aiemmat ohjeet tässä kohdassa (ruudut; sitten `--start 0` ilman loppua) olivat ohjaajan virheitä. Ohjaaja on pysäyttänyt
väärillä rajoilla käynnistetyt renderit: käynnistä omasi uudelleen taulukon arvoilla. Koko moduulin renderi kirjoitetaan
paikkaan `runs/maailma_<k>/osa.mp4` (01_02: `runs/alku_v4/osa.mp4`), ei muualle.
Tee jokaisesta määrätystä kohdasta liikesarja valmiista renderistä
(`.venv\Scripts\python.exe -I render/sarja.py <video> <alku_s> <askel_ruutuja> <n> <ulos.png> 480 6`) ja **katso se itse**.
"Mitattu" tarkoittaa mitattua renderistä, ei mallista.
**T2. Regressiomittari:** `.venv\Scripts\python.exe -I render/vertaa.py runs/vedos_v6u/osat/<k>.mp4 <uusi osa.mp4> <osan alku s>`.
Liitä tuloste. Jokaiselle tulostetulle jaksolle kirjoitat, mikä oman lukusi kohta sen selittää. Jakso, jolle ei löydy
määräystä, on pyytämätön muutos: palauta se ennalleen ja renderöi uudelleen. (Y1 ja Y2 voivat muuttaa lumen vaihetta tai
latvoja pitkiltä jaksoilta: silloin sanot sen ja näytät liikesarjalla, että kuva on muuten sama.)
**T3.** Sauma: moduulin ensimmäinen ja viimeinen ruutu eivät saa muuttua (`rajakuva`), ellei lukusi toisin sano.
Älä koske yhteisiin tiedostoihin (`visual/yhteinen.js`, `annotations/`, `docs/`, `analysis/`, `render/`): pyynnöt ohjaajalle
raportissa. Älä kysy käyttäjältä mitään. Jos renderilukko on varattu, odota: älä palauta keskeneräistä.
Raportti ohjaajalle: mitä muutit (tiedosto ja rivit), T1–T3, ja rehellisesti se, mikä jäi vajaaksi.

Vertailuruudut: `runs/vedos_v7/ref/` (nimessä VIKA = tällaista ei saa enää näkyä).

---

## Moduuli 01_02 (alku, 0:00–1:01,6; ruudut 0–1848; osan alku 0 s) · `visual/maailma_01_02.js`

Käyttäjä: "Alun metsässä näkyy muuten jotain bugeja nyt, ei näytä hyvältä." ja "Kumiset puut tuli takaisin."
1. **Y1 (korjattu): latvojen liike säilyy, mutta hillittynä.** Palauta `uSway`, `swayAmp` ja `sw`, jos poistit ne.
   Syy kumipuihin: vedos 6 pidensi puuskan (`puuska`, 0:45,4–0:52) ja `swayAmp` nousi sen mukana arvoon 1,95 seitsemäksi
   sekunniksi (latvan taipuma noin 3,6 % korkeudesta). Korjaus: (a) `swayAmp` ei saa riippua puuskasta eikä fraasin
   puuskasta suoraan: `swayAmp(t) = clamp(0.30 + 0.25 * jouSlow(t) + 0.20 * ka(sPuuska, t, 1.5), 0.25, 0.80) * (1 - 0.5 * hilj(t))`
   (latva enintään noin 1,5 % korkeudesta, tavallisesti alle 1 %; tauollakin puu elää aavistuksen); (b) taipuman muoto:
   eksponentti `pow(1.0 - u0, 1.5)` → `pow(1.0 - u0, 2.5)` (liike latvassa, ei koko siluetissa); (c) vierekkäiset puut eri
   vaiheessa (vaihe `ph` riippuu puun paikasta ja hitaasta kohinasta, ei pelkästä sinistä: lisää toinen, yhteismitaton
   taajuus). Puuska näkyy lumessa ja usvassa kuten nyt (`kTuuli`), ei puissa.
2. **Lähimetsän piirto.** Ruudussa `ref/v6_0014_alun_metsa_VIKA.jpg` lähimmät kuuset ovat valtavia, vaaleita, venyneitä ja
   aaltoilevia läiskiä (kuin heijastus vedessä). Tavoite on lopun metsä (`ref/loppu_1630_metsa.jpg`, moduuli 11_12, jota et
   muuta): tummat, terävät, kuusen muotoiset latvat, joiden koko pienenee tasaisesti etäisyyden mukana. Vaatimus: lähimmän
   rivin kuusen korkeus ruudussa enintään 22 % kuvan korkeudesta koko moduulin ajan; latvan ääriviivassa ei ajasta riippuvaa
   eikä korkeataajuista vaakasuuntaista vääristymää (kohinan siirtymä pois ääriviivasta); lähimmät kuuset ovat kuvan tummin
   kerros (ilmaperspektiivi: lähellä tumma ja terävä, kaukana vaalea ja pehmeä). Selvitä ensin syy (kameran korkeus ja
   etäisyys lähimpään riviin verrattuna lopun moduuliin, vääristymätermi) ja korjaa se; älä piilota usvalla.
3. **Tumma vaakaraja 0:54,5–0:56** (`ref/v6_0055_tumma_raja_VIKA.jpg`): metsän alaosa tummuu alle sekunnissa ja jakautuu
   kovalla vaakasuoralla rajalla. Tummuminen on koko kuvan pehmeä, vähintään 3 s kestävä muutos ilman vaakarajaa.
4. **Ensimmäisen vaaran tulo:** näkyvyys nollasta täyteen vähintään 5 s (nyt noin 3 s, 0:25–0:28). Järjestys lähimmästä
   kauimpaan säilyy (4d.36): älä muuta sitä.
Kaikki muu ennallaan (gis-viiva, vaarojen järjestys ja muodot, valopilari, laskeutuminen, sauma moduuliin 03_04).
Liikesarjat: 0–60 s 2,5 s välein; 23–31 s 0,33 s välein; 53–58 s 0,2 s välein; täysikokoinen ruutu kohdista 0:14 ja 0:40.

## Moduuli 03_04 (pimeä metsä, 1:01,6–3:23; ruudut 1848–6090; osan alku 61,6 s) · `visual/maailma_03_04.js`

Käyttäjä: "Kristalliin lentäessä jotkut puut olivat vieläkin liian pitkiä? VAI MITÄ NE OLIVAT?" (vedos 5: "puiden rungot
bugittavat kummallisesti. Ne jatkuvat ylös asti? Mitä sillä on haettu? Ei joka tapauksessa toimi")
1. **Ylöskatse 3:03–3:23** (`ref/v6_0310_rungot_VIKA.jpg`): rungot näkyvät pitkinä suorina viivoina, jotka jatkuvat kuvan
   yläreunaan, ja niiden välissä on ruskehtavia hehkuvia viiruja. Vaatimus: kun katse nousee, jokainen runko **päättyy
   omaan latvukseensa**: rungon yläosa (noin 45 % korkeudesta ylöspäin) on tumman, alhaalta leveän ja ylöspäin kapenevan
   latvusmassan sisällä, ja latvusten välistä näkyy yötaivas ja putoava lumi. Yksikään viiva ei jatku latvuksensa yli eikä
   kuvan yläreunaan suorana. Viirut ja hehkuvat hunnut pois. Puun korkeus on äärellinen ja sama kuin metsässä muutenkin
   (ei venytystä kallistuksen mukana). Valopiste (kide), johon lennetään, ja kameran liike säilyvät.
2. **Y2 ja lumen reaktio alttoviulujen kommentteihin** (rivi 63, vedoksen 6 lisäys): reaktio saa olla vain lumen määrän ja
   kirkkauden pehmeä kasvu fraasin aikana (nousu vähintään 0,5 s), ei suunnan tai paikan muutos. Jos nykyinen toteutus
   siirtää lunta tai muuttaa sen suuntaa, korjaa. Reaktion pitää näkyä: lumen kirkkaus fraasin huipussa vähintään 1,5-kertainen.
3. **Y1** (tarkista; rungot ja latvat jäykkiä).
**Ei saa muuttua (rivi 63, käyttäjä: "Valo synkässä metsässä toimii hienosti! Bravo! Sykkeet tulee siinä upeasti"):** valo ja
sykkeet 1:05–3:00, kameran kulku, moduulin alku ja sauma.
Liikesarjat: 3:02–3:23 0,5 s välein; kaksi alttoviulufraasia 0,25 s välein.

## Moduuli 05 (kide ja keijuvalot, 3:23–5:36,8; ruudut 6090–10104; osan alku 203,0 s) · `visual/maailma_05.js`

Käyttäjä: "Tuulenpuuska on nyt hävinnyt kohdasta 4:07? Se oli siellä aikaisemmin?" ja "Et ol kuullut puupuhaltimien rytmejä
oikein. Jos haluat että ne tanssii rytmissä, niiden rytmi pitää TÄSMÄLLEEN OSUA SOITETUILLE ÄÄNILLE." (vedos 5: "Keijut
tanssivat hienosti nyt. Mutta ei ihan musiikin tahtiin.")
Syy: vedos 6 vaihtoi valojen lähteen nuoteista kaistojen alkuihin; ne eivät löydä sidottuja juoksuja, joten puuska katosi ja
valot harvenivat. Vedoksen 5 valot olivat oikeat, mutta 20–40 ms myöhässä.
1. **Palauta vedoksen 5 valologiikka kokonaan** (kaikki neljä osaa: staccato, vuorottelu, D_pikkolon juova, grazioso-tanssi;
   `git show 09eac76:visual/maailma_05.js`, funktio jossa `// 3) D_pikkolo: juova kiitää ylös...`): sama valinta, samat
   paikat, sama korkeuden laskenta, samat kynnykset.
2. **Vaihda vain nuottien lähde:** vanhan listan (`d.nuotit`, `[t, kesto, midi]`) tilalle `d.cues.alut.nuotit`
   (`[t, kesto, midi, nousu_dB]`). Valo alkaa ruudussa `Math.round(t * 30)`. Nuotti, jota tarkassa listassa ei ole, ei saa valoa.
3. **Puuska 4:06–4:08 (`D_pikkolo`)** näyttää samalta kuin vedoksessa 5 (`ref/v5_0407_puuska.jpg`): valojen parvi kiitää ylös
   ja takaisin. Ohjaajan mittaus tarkistukseen: tarkassa listassa on noin 17 nuottia välillä 4:06,3–4:07,7; ylin noin 4:07,4.
4. **Y1:** poista latvojen huojunta (rivi noin 224) kokonaan.
5. Vedoksen 6 pisaran tasainen liike 5:25–5:33 (rivi 66) säilyy.
Todiste lisäksi: taulukko 4:42–4:52: jokaisen valon alkuruutu ja lähin tarkka nuotti; osumien osuus (vaatimus: 100 %, koska
valot syntyvät listasta) ja valojen lukumäärä verrattuna vedokseen 5 samalla välillä (ei saa pudota yli 20 %).
`vertaa.py` myös vedosta 5 vastaan (`runs/vedos_v5/osat/05.mp4`): eroja saa olla vain valoissa (ajoitus), latvoissa (Y1) ja
pisarassa.
Liikesarjat: 4:04–4:10 0,2 s välein; 4:42–4:52 0,33 s välein; 3:51–3:58 0,33 s välein.

## Moduuli 06 (jää, 5:36,8–8:16,3; ruudut 10104–14889; osan alku 336,8 s) · `visual/maailma_06.js`

1. **Y3: puupuhaltimien juoksut `H_puhaltimet` → `I_ratsastus` (6:37,6–6:49,3):** valot `d.cues.alut.nuotit`-listasta samalla
   tavalla kuin moduulissa 05 (alku ruudussa `Math.round(t*30)`, korkeus = midi). Ei valoa ilman nuottia.
2. **Y1** (rannan metsä ja kaikki rungot jäykkiä: tarkista ja poista mahdollinen taipuma) ja **Y2** (lumi).
**Ei saa muuttua:** jään hyppijät 5:48–6:30 (jousten alut), enintään kahdeksan valoa kohdassa 6:30, halkeamat, Tapion hehku
jään alla, kamera.
Liikesarjat: 6:36–6:50 0,33 s välein.

### Moduuli 06, LISÄYS (rivi 93): jättiläisen askeleet jäällä

Käyttäjä 11.11.2026: "Vedoksessa 5 toimi muuten paremmin nuo jättiälisen askeleet. Ne pitää tulla paremmin esiin" (vedos 4:
"Pidin noista jättiläisten askelista, jotka näkyivät isoina, mutta pehmeinä, kuten musiikissa.")
Ohjaajan mittaus (`render/vertaa.py`): pimeän metsän askeleet (2:09) ja Tapio (7:01) ovat ruudulleen samat vedoksissa 5 ja 6;
ainoa askelkohta, joka muuttui, on jään alku 5:36–5:48 (kontrabassot toistavat matalaa d:tä askelina, paisutus). Vedoksessa 5
jokainen askel näkyi siinä suurena pehmeänä renkaana; vedos 6 poisti renkaat (rivi 69: "Jään pintaan ei voi tulla loogisesti
vesirenkaita - voi tulla halkeamia. Halkeama voi edetä musiikin tahdissa"), eikä askelille jäänyt vastinetta.
3. **Askel jäällä = suuri, pehmeä paino jään alla (ei rengasta, ei viivaa).** Jokaisella basson askeleella (matalan kaistan
   mitatut alut `d.cues.alut.matala` ankkurista `pohja_vaihtuu_D` ankkuriin `peikot_G_alku`, voima vähintään 0,3; samat alut,
   joita vedoksen 5 renkaat käyttivät) jään alla syttyy leveä, pehmeäreunainen hallan hohde (säde noin neljännes kuvan
   leveydestä, ei ääriviivaa, ei samankeskisiä kehiä): se paisuu askeleen ruudusta 0,15 s:ssa ja hiipuu noin 1,4 s:ssa, ja
   jään pinta sen kohdalla painuu hetkeksi tummemmaksi reunoiltaan (paino). Jokainen askel on edellistä lähempänä kameraa ja
   hieman eri kohdassa (paino siirtyy omassa ajassaan, tyyliohje 7b "basson askeleet"), ja paisutuksen mukana hohde kasvaa
   (viimeinen askel suurin). **Halkeama etenee askel kerrallaan** samassa ruudussa (rivi 69 säilyy). Sama vastine myös
   muualla moduulissa, missä vedoksen 5 renkaat merkitsivät basson askelta; Tapion hehku 7:01 pysyy ennallaan.
   Tavoite: askeleen kohdalla kuvan keskikirkkaus nousee vähintään 12 % ja palaa; katsoja laskee askeleet kuvasta.
   Liikesarja: 5:36–5:49 0,25 s välein vedoksen 5 vastaavan rinnalla (`runs/vedos_v5/osat/06.mp4`).

## Moduuli 07_08 (ikisalo ja aurinko, 8:16,3–11:31,6; ruudut 14889–20748; osan alku 496,3 s) · `visual/maailma_07_08.js`

Käyttäjä: "Lensimme puun rungon läpi, niin ei saa käydä, juuri ennen tuota c-duuri paikkaa" ja "Tuossa patarumpu +
trumpetti-teemassa pitää olla VIISI ISKUA: 1234+ viides aksentoitu."
1. **Kamera ei kulje rungon läpi eikä läheltä (10:35–11:25).** `ref/v6_1056_runko_VIKA.jpg`: musta litteä runko peittää
   36–47 % ruudusta ja aurinko katoaa 10:57–10:58. Palauta kameran rata vedoksen 5 mukaiseksi (ei sivusiirtoa:
   `git show 09eac76:visual/maailma_07_08.js`) ja poista vedoksen 6 lisäämät lähirungot. Rivi 72 ("puun runko juuri auringon
   edess? ... Blokkaa mun lempikohdan") ratkaistaan **rungon paikalla, ei kameralla**: yhdenkään rungon akseli ei ole alle
   2,5 m:n päässä kameran radasta eikä kameran ja auringon välisellä suoralla (käytävä vähintään ± 3 m auringon suunnan
   ympärillä) välillä `allegro_359` → `M_ennakko`. Vaatimukset renderistä: yksikään runko ei peitä yli 15 % kuvan leveydestä;
   auringon kiekko (tai sen hehkun keskus) näkyy jokaisessa ruudussa 10:50–11:25; ei yhden ruudun hyppyjä.
   Allegron kiihtyminen (10:34,5) näytetään kameran vauhdilla, lumella ja valolla, ei lähirungoilla.
2. **Viisi iskua (`trumpetit_patarummut_356`.iskut_t, viisi arvoa; Y4).** Korvaa oma tunnistin `HITT` tällä listalla.
   Jokainen isku on pystysuora valon leikkaus runkojen takana iskun ruudussa (kuten nyt). Iskut 1–4: voimat 0,70 / 0,78 /
   0,86 / 0,94, lyhyt vaimeneminen (noin 0,13 s). **Isku 5:** voima 1,5, leveämpi, ja jää soimaan (vaimeneminen noin 1,5 s:
   partituurissa viides on pitkä ääni, dim. molto). Viisi leikkausta, ei kuutta eikä seitsemää.
3. **Y1** ja **Y2** (tuulen `puuska` saa muuttaa lumen nopeutta vain Y2:n rajoissa).
**Ei saa muuttua (rivit 70, 71; käyttäjä: "Sitä ei saa muuttaa"):** salin valot ja usva 9:40 eteenpäin, sellojen usva,
auringon tasainen nousu ja C-duuri 11:20, kaikki ennen kohtaa 10:25.
Liikesarjat: 10:27–10:31 joka ruutu väliltä 10:28,0–10:29,6 (48 ruutua); 10:35–11:25 1 s välein; 10:50–11:00 0,2 s välein.

## Moduuli 09 (pimeä metsä, 11:31,6–14:05,6; ruudut 20748–25368; osan alku 691,6 s) · `visual/maailma_09.js`

Käyttäjä: "Yritin sanoa että 13:28 alkaen on ISOT VASKISOINNUT!! MITÄÄN EI TAPAHDU????" · "Vieläkään ei tapahtunut muutosta
13:34!!! SIINÄ PITÄÄ OLLA TODELLA ISO MUUTOS!!! TUNNELMAAN!!!" · "Älä kuitenkaan liioittele - niiden pitää olla tyylikkäitä -
tyylioppaan mukaisia" · "jousten oktaavinousu ei näkynyt 13:03 eteenpäin. Se on niinkuin hitaasti nouseva tuulenpuuska
minusta, vähemmän kuin puhaltajien edelliset, mutta sama ele jousilla."
1. **Y1:** funktio `sway` pois kokonaan (kaikki kutsut: rungot, latvat, oksat).
2. **Suuret vaskisoinnut `P_vaskipaisunta` (13:26,4–13:33,6; `iskut_t` = soinnun tulo ja kolme painotettua sointua).**
   Partituuri: käyrätorvet, trumpetit ja pasuunat *fp cresc. molto* > *ff* neljän tahdin ajan. Tyyliohje 7: trumpetit ja
   pasuunat ovat "läpi tuleva valo: valo, joka leikkaa kerrosten läpi pystysuoraan", käyrätorvet "kaukainen kajo". Kuva:
   runkojen **takana** syttyy leveitä, pehmeäreunaisia pystysuoria valon kaistoja (halla: kylmä sinivalkoinen; ei punaista),
   jotka ovat kiinni maailmassa (pysyvät paikallaan, kamera kulkee niitä kohti; rungot jäävät niitä vasten mustiksi
   siluetteja ja heittävät pitkät varjot lumelle kameraa kohti). Ensimmäinen kaista syttyy `iskut_t[0]`:n ruudussa
   (*fp*: välähtää ja vetäytyy noin 40 %:iin 0,4 s:ssa), ja jokainen seuraava `iskut_t` sytyttää uuden kaistan eri kohtaan
   vaakasuunnassa, edellistä lähemmäs ja leveämpänä; kaistat jäävät palamaan. Niiden yhteinen kirkkaus seuraa vaskien
   paisutusta (äänen taso 150–1500 Hz kertymänä: kasvaa tasaisesti, ei välky) niin, että lopussa (`iskut_t[3]`, *ff*)
   valo on moduulin kirkkain kohta: kuvan keskikirkkaus vähintään 2,5-kertainen kohtaan 13:24 verrattuna. Neljä kaistaa,
   ei enempää. Ei välkettä, ei koko ruudun valkaisua, ei säteitä kameraan.
3. **Suuri taite `P_taite_494` (13:33,6): tunnelma vaihtuu (4d.35).** Mitattu: vasket katkeavat ja taso putoaa 20 dB
   0,5 s:ssa; puupuhaltimet ja jouset alkavat hiljaa noin 0,65 s myöhemmin ja kasvavat laulaviksi.
   - Taitteen ruudussa vaskien valokaistat sammuvat (0,25 s): hetken on hämärää ja hiljaista.
   - Sitten 3 s:n aikana metsä **avautuu toiseksi paikaksi**: valo ei enää tule takaa kovana vaan ylhäältä ja kaikkialta
     pehmeänä; runkojen välinen usva täyttyy vaalealla sinisellä valolla (salo/halla), rungot muuttuvat mustista pehmeän
     siniharmaiksi ja kaukaiset rungot liukenevat usvaan; lumi maassa hohtaa tasaisesti; varjot katoavat. Lunta sataa
     hitaasti ja suoraan alas (Y2: nopeus pehmeästi 40 %:iin). Kameran vauhti laskee pehmeästi 60 %:iin 3 s:ssa.
   - Mitattavat tavoitteet kohdassa 13:37 verrattuna kohtaan 13:24: keskikirkkaus vähintään 1,8-kertainen; sinisen ja
     punaisen kanavan suhde vähintään 10 % suurempi; kontrasti (kirkkauden keskihajonta / keskiarvo) enintään 0,6-kertainen.
     Katsojan pitää nähdä yhdestä ruudusta, kummalla puolella taitetta ollaan.
   - Tunnelma kestää ankkuriin `dim_possibile` ja liukuu siitä takaisin pimeään `hiljaisuus_2_alku`un mennessä (kuten nyt).
   - Puupuhaltimien laulu saa näkyä muutamana väikkeen valona korkealla (`d.cues.alut.nuotit`, midi ≥ 72, enintään kolme
     kerrallaan), ei muuta uutta. Keinot ovat valo, usva, väri ja tila: ei uusia esineitä.
4. **Jousten nousu `jousten_nousu_473` (13:01,2–13:05,3): hitaasti nouseva tuulenpuuska.** Sama ele kuin kohdan 5 puuska,
   mutta pienempi (noin 60 % tiheydestä) ja hitaampi: hienon lumipölyn huntu irtoaa maasta ankkurin alussa ja nousee
   runkoja pitkin latvoihin ankkurin loppuun mennessä (alhaalta ylös koko kuvan korkeuden, tasaisesti kiihtymättä),
   ajelehtien samalla lumen suuntaan; sen perässä maa jää hetkeksi kirkkaammaksi. Nykyinen nouseva usvavyö korvataan tällä.
5. **Puuska `puuska_499` (13:41–13:42,2)** (`ref/v6_1341_puuska_VIKA.jpg`: koko ruutu täyttyy sekunniksi suurista valkoisista
   soikioista): korvaa rajatulla lumipölyn hunnulla, joka kulkee kuvan läpi lumen suuntaan (sisään 0,4 s ennen ankkuria,
   tihein ankkurin huipussa, poissa 1,5 s ankkurin lopun jälkeen); pienet hiukkaset (enintään 6 px), ei soikioita, ei koko
   ruudun välähdystä. Tämä on "puhaltajien puuska": täysi tiheys.
6. **Y2** koko moduulin lumelle.
**Ei saa muuttua (rivi 73, käyttäjä: "varjot tai nuo tummat liikkuvat jutut ... Upeaa! ... Juuri näin!"):** tummat liikkuvat
varjot 11:32 eteenpäin, vaskien takominen ennen N:ää (11:46–11:51), jousten kommentit 12:44–13:01, kameran rata ennen kohtaa
13:33,6.
Liikesarjat: 13:00–13:07 0,33 s välein; 13:24–13:48 1 s välein; 13:32–13:38 0,2 s välein; 13:40–13:45 0,2 s välein.
Taulukko: keskikirkkaus, B/R ja kontrasti kohdista 13:24, 13:30, 13:33, 13:34, 13:37, 13:44 (mitattu renderistä).

### Moduuli 09, LISÄYS (rivi 92; tämä voittaa yllä olevan "Ei saa muuttua" -kappaleen sanamuodon)

Käyttäjä 10.11.2026 yöllä: "Aah ja nyt ne mun kehumat varjot muuttui tunnistatmattomaksi 11:40 eteenpäin, mitä teit niille? Ne
mielestäni toimi hyvin ennen? nyt tuntuu että ne on liian nopeita"
Ohjaajan mittaus (`render/vertaa.py`, vedos 5 vastaan vedos 6): moduuli on sama kohtaan 11:45,6 asti; erot ovat 11:45,6–11:59,6
(vedoksen 6 vaskileikkaukset) ja 12:43,6 eteenpäin (jousten kommenttien koko tilan välähdykset, tumma aalto, varjokentän
pyyhkäisy `uSweep`, lumen työntö). Ne valaisevat koko metsän ja liikuttavat varjokenttää nopeasti: pimeä, hitaasti elävä
varjojen metsä, josta käyttäjä piti, katoaa, ja valaistut rungot näyttävät kiitävän ohi.
7. **Ennen ankkuria `P_vaskipaisunta` kuvan pitää olla vedoksen 5 kuva** (`git show 09eac76:visual/maailma_09.js`; vertailu
   `runs/vedos_v5/osat/09.mp4`), lukuun ottamatta kohtia a–c ja kohtaa 1 (Y1) ja 4 (jousten nousu):
   a. **Poista** vedoksen 6 lisäykset jousten kommenteista: koko tilan välähdys (`uGes.x`-termit valossa), tumma aalto
      (`col *= 1.0 - 0.62 * uGes.x ...`), varjokentän pyyhkäisy (`uSweep`) ja `drift`-kentän voimistus, lumen työntö ja
      suunnanvaihto (`gestAt`-termit `sFall`/`sDrift`:ssä ja lumen kirkkaudessa), hiutaleiden venytys (`fo.x /= ...`,
      `h > 0.30 + 0.22 * uGes.z`). Poista myös vanha `0.20 * nerveAt * Math.sin(1.7 * t)` -termi `sDrift`:stä ("puuskissa
      suunta vaihtuu": Y2 kieltää).
   b. **Jousten kommentit (12:44–13:01) tilalle hillitysti:** tyyliohje 7: jouset ovat "metsän massa ja säikeet ... niiden
      välissä kulkevat valosäikeet". Jokaisella mitatulla kommentilla yksi ohut, pehmeä hallan valosäie kulkee runkojen
      välissä (kahden lähimmän runkokerroksen takana, runkojen keskikorkeudella) noin 40 % kuvan leveydestä 1,6 s:ssa
      (syttyy 0,15 s, sammuu 1,2 s), vuorotellen vasemmalta ja oikealta. Säikeen kirkkaus on sama kuin vaskien
      vuorottelevien valopylväiden. Kuvan keskikirkkaus saa nousta enintään 15 % vedoksen 5 samaan ruutuun verrattuna.
   c. **Vaskien takominen ennen N:ää (11:46,4–11:51):** leikkaukset jäävät, mutta eivät valaise metsää: ohuet (ydin
      enintään 1,5 % kuvan leveydestä), runkojen takana, enintään neljä kirkkainta mitattua iskua, ei maan sykettä
      (`PULSSIT.concat(HITS...)` pois), ei koko kuvan hohtoa. Kuvan keskikirkkaus enintään 1,35-kertainen vedoksen 5 samaan
      ruutuun verrattuna.
   d. Kameran vauhti ja rata ovat vedoksen 5 mukaiset ankkuriin `P_taite_494` asti (taitteen jälkeen kohta 3).
   Todiste: `vertaa.py runs/vedos_v5/osat/09.mp4 <uusi> 691.6 2 1.0`: ennen kohtaa 13:01 jokaisen jakson suurin mse enintään
   15 (N:n kohdalla enintään 40); liikesarjat 11:44–11:52 ja 12:44–12:52 0,33 s välein vedoksen 5 vastaavien rinnalla.
   Kohtien 2 ja 3 valo (vaskisoinnut ja taite) on tarkoituksella suuri, mutta sielläkin pätee: valo on runkojen takana ja
   usvassa, ei koko ruudun valkaisua; rungot eivät saa näyttää kiitävän ohi (kameran vauhti ei ylitä vedoksen 5 vauhtia).

## Moduuli 10 (myrsky, 14:05,6–15:45; ruudut 25368–28350; osan alku 845,6 s) · `visual/maailma_10.js`

1. **Y1:** `uSway`/`huojunta` pois kokonaan (latvat eivät huoju myrskyssäkään; myrsky on lunta ja valoa).
2. **Viisi iskua (`vasket_takovat_viimeinen`.iskut_t, viisi arvoa; Y4).** Nyt neljä valoseinää ja lumen pysähdys ja ryöppy
   neljännellä iskulla. Uusi: viisi valoseinää iskujen ruuduissa; paikat reunoilta keskelle (esim. x = −0,72, 0,72, −0,36,
   0,36, 0), iskut 1–4 kasvavat (leveys ja kirkkaus), **viides on keskellä, levein ja kirkkain ja jää soimaan** (vaimenee
   noin 1,8 s; partituurissa viides on pitkä ääni, dim.). **Poista lumen pysähdys ja ryöppy** (`lumiPohja`, `lumiRyoppy`,
   `lumiKerroin`): Y2.
3. **Y2 koko myrskylle:** lumen ja pyörteen nopeus ja suunta muuttuvat vain Y2:n rajoissa; myrskyn aksentti (`myrsky_aksentti_537`)
   ja vaskien huudot (`vasket_myrsky_1..3`) näkyvät valona (kuten nyt), eivät lumen hyppyinä; rintaman "hyppy lähemmäs"
   aksentissa muutetaan pehmeäksi (vähintään 0,5 s).
**Ei saa muuttua:** myrskyn nousu ja tulo, intensiteetin seuraaminen jousista (pehmeänä), pyörre pintakerroksena ja syvempi
tausta, vaskien huutojen valot, moduulin loppu ja sauma moduuliin 11_12 (**11_12:een ei kosketa**).
Liikesarjat: 15:09,5–15:12,5 joka toinen ruutu (45 ruutua); 14:30–14:34 0,2 s välein; 14:50–15:06 0,5 s välein.

---

# Kriitikolle (vedos 7, koottu video `runs/vedos_v7/koko.mp4`)

Olet tuore kriitikko. Lue ensin kokonaan `docs/visuaalinen_tyyli.md` (erityisesti 4d kohdat 23–36 ja luku 12), sitten
`docs/projekti.md`:n palautelistan rivit 60–94 (käyttäjän sanat) ja tämän briefin alku. Et korjaa mitään etkä ehdota makuasioita.
Tehtäväsi on kaksi asiaa, molemmat **mitaten valmiista videosta**, ei koodista eikä rakentajien raporteista:

**A. Onko jokainen käyttäjän palaute riveillä 60–94 korjattu?** Käy rivit yksi kerrallaan. Jokaisesta: tee liikesarja
kohdasta (`.venv\Scripts\python.exe -I render/sarja.py runs/vedos_v7/koko.mp4 <alku_s> <askel_ruutuja> <n> <ulos.png> 480 6`,
katso kuva Read-työkalulla; käyttäjän ajat ovat likimääräisiä: etsi oikea kohta kuunteluoppaasta `annotations/kuunteluopas.md`
ja `annotations/cues.json`:sta), ja mittaa se, mitä rivi väittää (esim. iskujen määrä ja ruudut, valojen osuminen
`cues.alut.nuotit`-aikoihin, kirkkaus ennen ja jälkeen, runkojen peitto, lumen suunnan pysyvyys peräkkäisistä ruuduista).
Tulos riville: KORJATTU / OSITTAIN / EI, ja todiste (luku tai liikesarjan tiedosto). Rivit, jotka käyttäjä käski säilyttää
(63, 70, 71, 73, 76): vertaa vedokseen 5 (`runs/vedos_v5/koko.mp4`) samoista kohdista ja sano, onko kuva sama.
Erityisesti: rivi 81/94 (puut elävät aavistuksen, eivät kuin kumi eivätkä jähmettyneinä: mittaa latvan liike pikseleinä
suhteessa puun korkeuteen alun metsästä 0:10–0:55 ja pimeästä metsästä), rivi 86 (lumi ei nyi: etsi koko videosta kohdat,
joissa lumen suunta tai nopeus muuttuu alle 0,5 sekunnissa), rivi 87 (viisi iskua kohdissa 10:28 ja 15:10: laske kuvasta),
rivit 84–85 (vaskisoinnut 13:26–13:33 ja taite 13:33,6), rivi 89 (puuska 4:07), rivi 90 (ei rungon läpi lentoa 10:35–11:25),
rivi 92 (varjojen metsä 11:32–13:00 sama kuin vedoksessa 5), rivi 93 (askeleet jäällä 5:36–5:48).

**B. Bugilista.** Katso koko video 15 sekunnin välein otetusta kontaktiarkista (`runs/vedos_v7/kontakti.jpg`) ja jokainen sauma
ja jokainen kuunteluoppaan lihavoitu kohta liikesarjasta. Listaa vain selvät virheet: yhden ruudun hypyt ilman iskua, kovat
suorakulmiot tai rajat, valkoiseksi leikkautuvat alueet, piirretyn näköiset esineet, tyhjä tai jähmettynyt kuva,
tyyliohjeen kieltämät asiat (luku 9 ja 12). Jokaisesta: aika, mitä näkyy, miksi se on virhe (tyyliohjeen kohta tai
palautteen rivi), ja liikesarjan tiedosto. Erota ESTÄVÄ (käyttäjä huomaa heti) ja PIENI.

Kirjoita raportti tiedostoon `runs/vedos_v7/kriitikko.md` (rivitaulukko A, bugilista B, lopussa yksi rivi: BUGILISTA TYHJÄ tai
ESTÄVIÄ n kpl). Liikesarjat kansioon `runs/vedos_v7/krit/`. Älä koske mihinkään muuhun tiedostoon. Älä renderöi mitään
(ei `render.mjs`, ei `lukittu.mjs`): vain valmiin videon ruutuja.

---

# Vedos 7b: kolme täsmäkorjausta käyttäjän palautteesta vedokseen 7 (rivit 96–98)

Lue ensin kokonaan `docs/visuaalinen_tyyli.md`, sitten tämän briefin alun yhteiset säännöt (Y1–Y5, T1–T3; renderin rajat
taulukosta) ja oma lukusi alla. **Teet vain numeroidut kohdat; kaikki muu pysyy ruudulleen vedoksen 7 kuvana**
(`render/vertaa.py runs/vedos_v7/osat/<k>.mp4 <uusi> <osan alku s>`: jokainen muuttunut jakso selitetään).
Käyttäjä vedoksesta 7: "Wau, miten hienoa työtä. Nyt se näyttää todella hienolta. ... Itse muuttaisin ihan pari pientä asiaa vielä."

## 03_04 (rivi 96): kaukaiset puut ovat pelkkiä runkoja

Käyttäjä: "puiden liike ei niin häiritse enää (ehkä latvat aavistuksen liikaa heiluvat), mutta enemmän se häiritsee että ne
näyttävät vain rungoilta? Pitäisikö niissä olla joku kasvusto kuten muissa puissa? Ne jotenkin vielä bugittaa (2:30 eteenpäin
kaukana olevat puut). Ne mitä vasten noustaan taivaalle. Se nousu minusta toimii nyt jo hyvin."
Ohjaajan havainto (`runs/vedos_v7/koko.mp4` 2:30–3:08, 2 s välein): lähirungot ovat kunnossa, mutta niiden takana metsä on
tiheä rivi ohuita, vaaleareunaisia pystyviivoja ilman oksia; 3:00–3:07 ne täyttävät kuvan viivoina yläreunaan asti.
1. **Kaukaiset ja keskietäisyyden puut ovat kuusia, eivät tolppia.** Jokaisella puulla noin 12 m:stä kauemmas on oksisto:
   tumma, alaspäin riippuva kuusen havusto, joka alkaa noin 3–5 m:n korkeudelta ja levenee alaspäin kerroksittain (sama
   piirtotapa ja sävy kuin moduulin latvuksilla ja muiden maailmojen kuusilla; lunta oksilla saa olla hillitysti). Rungosta
   näkyy vain tyvi ja välähdyksiä oksien välistä. Kaukaisin kerros sulaa tummaksi havuseinäksi, jonka yläreuna on
   sahalaitainen. Vaaleat reunaviivat (rim) poistetaan kaukaisilta rungoilta. Puut eivät ilmesty eivätkä muutu kesken:
   oksisto on puissa koko moduulin ajan (myös ennen 2:30), mutta **polku, valo, sykkeet, lähimmät rungot, pilkat, askeleet
   ja kamera eivät muutu**.
2. **Ylöskatse (3:02–3:10):** samat puut nähdään alta: oksisto jatkuu latvukseen yhtenäisenä, ei viivoja kuvan yläreunaan.
   Nousu taivaalle ja kide säilyvät täsmälleen ("Se nousu minusta toimii nyt jo hyvin").
3. **Latvojen liike aavistuksen pienemmäksi:** kerro nykyinen latvan ja oksiston liike 0,6:lla (muoto ja vaiheet ennallaan).
Todiste: täysikokoiset ruudut 2:30, 2:44, 2:58, 3:04 ja 3:08 vedoksen 7 samojen rinnalla; liikesarja 2:28–3:12 2 s välein;
`vertaa.py`: ero vedokseen 7 saa näkyä koko moduulissa (kaukaiset puut), mutta keskikirkkaus ja valon paikka eivät muutu
(taulukko 10 s välein: keskikirkkaus ennen ja jälkeen, ero enintään 4 %).

## 09 (rivit 97 ja 98): tuulenpuuska nostaa jo kuvassa olevaa lunta

Käyttäjä: "Se jousten oktaavinousu tekee nyt vähän liian oudon luminousun? Se alkaa myös pikkaisen liian aikaisin. ... Mitä
jos se oktaavinousu olisi ikäänkuin tuulen puuska, joka nostattaa jo ruudulla olevaa lunta hitaasti ylöspäin, ryöpsähtäen?"
ja "Samoin ne puhaltajien tuulenpuuskat (noin 13:40) voisi toteuttaa samoin, mutta vähän voimakkaammin?"
Ohjaaja mittasi äänestä uudelleen (spektrogrammi): nouseva kulku alkaa **13:02,95** ja päättyy 13:05,2 (ankkuri
`jousten_nousu_473` on korjattu: aiempi 13:01,2 oli 1,75 s liian aikaisin); puhaltimien juoksu nousee **13:40,75**, on
huipussaan 13:41,6 (`puuska_499.iskut_t[0]`) ja laskee 13:42,1 (ankkuri korjattu). Lue ajat ankkureista.
1. **Poista molemmat erilliset lumipölyn hunnut** (vedoksen 7 kohdat 4 ja 5) ja niiden jälkeinen maan kirkastuminen.
2. **Puuska vaikuttaa siihen lumeen, joka on jo kuvassa.** Samat hiutaleet, jotka satavat, saavat pystynopeuteensa nostavan
   termin (nopeuden kertymänä, kuten Y2 vaatii: paikka ei hyppää). Jousten nousussa: ankkurin alusta nostava voima kasvaa
   kulun mukana (hitaasti ensin, sitten ryöpsähtäen: esim. verhokäyrä u²·(3−2u) ankkurin kestolle ja sen päälle yksi pehmeä
   sykäys kulun viimeisellä kolmanneksella), niin että putoaminen hidastuu, pysähtyy ja kääntyy nousuksi (huipussa noin
   1,5 kertaa tavallisen putoamisnopeuden verran ylöspäin), ja ankkurin lopun jälkeen lumi leijuu ja palaa satamaan
   noin 2,5 s:ssa. Nosto kulkee kuvan läpi puuskana lumen ajelehtimisen suuntaan (rintama ylittää kuvan noin 1 s:ssa;
   ei koko ruutu samassa ruudussa) ja on voimakkain lähellä maata olevassa lumessa. Lisäksi maan pinnasta irtoaa samalla
   rintamalla vähän hienoa pintalunta (pienet hiukkaset, enintään neljännes hiutaleiden määrästä), joka nousee samalla
   nopeuskentällä: ei erillistä huntua, ei ruudukkoa. Hiutaleiden määrä ja kirkkaus saavat kasvaa enintään 1,3-kertaisiksi.
3. **Puhaltimien puuska (`puuska_499`) samalla tavalla, voimakkaampana ja nopeampana:** nosto alkaa ankkurin alusta, on
   huipussaan `iskut_t[0]`:ssa (noin 2,5 kertaa putoamisnopeus ylöspäin; rintama ylittää kuvan noin 0,6 s:ssa), ja lumi
   palaa satamaan noin 2 s:ssa ankkurin lopun jälkeen. Taitteen sininen tila ja sen hidas lumi säilyvät muuten.
4. Rungot ja latvat eivät reagoi puuskaan (4d.31); valo ei välähdä.
Todiste: ruutusarjat joka toisesta ruudusta 13:02,5–13:08 ja 13:40,3–13:45; hiutaleiden pystynopeuden taulukko 0,2 s
välein molemmista (mallista) ja saman suunnan toteaminen renderistä (hiutaleet nousevat ruudusta toiseen); suurin
ruutujen välinen nopeuden muutos; `vertaa.py` vedosta 7 vastaan (erot vain 13:01–13:09 ja 13:40–13:46).

### 03_04, KORJAUS (rivit 99 ja 100): luminen havusto hyvin tehtynä, ei laatikoita

Käyttäjä vedoksesta 7b: "Ei, nuo puut ei nyt kelpaa. lumi näyttää ihan latikkomaiselta." · "Sen lisäksi puun rungot
katkeilee nyt ja ovat läpinäkyviä? ... Voisiko tuota miettiä että sen korjaisi jollain usvalla tai pehmennyksellä?" ·
"Ei se lumi ollut huono ratkaisu, se vaan pitää tehdä hyvin" · "Siis voi olla lunta, jos se auttaa. Mutta ei laatikoita".
**Lunta saa olla. Laatikoita ei.** Viat vedoksessa 7b olivat: (a) oksakerrokset tasavärisiä, suorareunaisia laatikoita;
(b) rungot häivytetty osittaisella läpinäkyvyydellä ja katkaistu.
1. **Rungot aina umpinaisia** (vedoksen 7 piirto). Runkoa ei häivytetä alfalla. Se jää piiloon vain siellä, missä
   umpinainen havusto on oikeasti sen edessä; oksien välistä runko näkyy kokonaisena. Ei kantoja.
2. **Havusto orgaaniseksi:** ei tasavälisiä kerroksia, ei suoria reunoja, ei tasavärisiä pintoja. Oksat ovat eri pituisia
   ja eri korkeuksilla (satunnaistettu puun ja oksan mukaan), alaspäin kaartuvia ja riippuvia, ja reuna on kohinasta
   repaleinen (havujen kärjet). Katso mallia lopun metsän kuusista, joista käyttäjä pitää (`visual/maailma_11_12.js`,
   kuusten piirto; "Metsä oli myös vihdoin sen näköinen kun odotin"): sama luonne sivusta nähtynä.
3. **Lumi hyvin:** lumi on pehmeä, epäsäännöllinen kerros oksan yläpinnalla: paksuus vaihtelee kohinan mukaan, reuna
   liukuu pehmeästi tummaan havuun (ei kovaa rajaa, ei suorakulmaista laikkua), ja paikoin oksa on paljas. Valaistus
   kuten ennen (polun valo, kylmä halla, himmeä: enintään noin puolet rungon valaistun kyljen kirkkaudesta, varjon
   puolella lähes pois).
4. **Usva ja pehmennys:** havusto ja rungon yläosa sulavat etäisyyden ja korkeuden mukana usvaan (kauempi ja ylempi on
   pehmeämpi ja vähäkontrastisempi), niin että vain lähimmät havukerrokset ovat teräviä ja kaukainen metsä on pehmeä
   tumma, lumen täplittämä seinä. Reunoissa ei aliasoivia portaita.
5. Lähirungot (alle noin 7–10 m), polku, valo, sykkeet, pilkat, ylöskatse ja nousu: ruudulleen vedos 7. Latvojen liike
   0,6-kertainen. Ei mitään muuta uutta.
Hyväksymisehto täysikokoisista ruuduista 2:30, 2:44, 2:58 ja 3:04: ei yhtään suoraa reunaa tai laatikkoa havustossa tai
lumessa, ei katkeavia tai läpinäkyviä runkoja; puut näyttävät lumisilta kuusilta hämärässä usvassa. Katso jokainen ruutu
itse täydessä koossa ja lähennä (rajaa 2x) ennen kuin raportoit.

### 03_04, KORJAUS B (rivit 101–103): varsinainen ongelma, välke ja ensimmäiset askeleet

Käyttäjä: "Mielestäni et korjannut laisinkaan sitä varsinaista ongelmaa, jotka olivat siellä kaukana näkyvät rungot. Korjaatko
nyt oikeaa koodia? ... Ne paljaat rungot edelleen ovat näkyvissä." · "lumi pitää hioa niin että se ei välky, ja toimii" ·
"Olet myös missannut muutamat basson askeleet, silloin kun se alkaa. Kuuntele tarkasti kontrabassokanava, ja koita löytää ne
ensimmäiset askeleetkin sinne."
**Ohjaaja katsoi itse ruudut ja koodin. Käyttäjä on oikeassa:** havusto lisättiin sivujen puihin, mutta ne rungot, joita
käyttäjä tarkoittaa, ovat kuvan keskellä kaukana valokäytävän reunoilla (ne, joita vasten noustaan). Ne ovat yhä paljaita
tolppia, joilla on tasainen katkaistu pää (vertaa rajausta kohdasta 2:52: `ffmpeg -ss 172 -i runs/vedos_v7b/koko.mp4
-frames:v 1 -vf crop=800:700:560:0`). **Syy koodissa:** `visual/maailma_03_04.js` rivi noin 156:
`float clearL = smoothstep(0.6, 1.9, abs(wx - lane));` ("polku: oksat eivät kasva sen yli") kertoo kaiken havuston
(rivit noin 189, 190 ja 203) nollaksi polun akselin lähellä **kaikilla etäisyyksillä**, joten kaukana käytävän kohdalla
näkyvät puut jäävät ilman oksia; lisäksi rungon yläpää katkeaa tasan (`step(hy, Hh)`).
1. **Kaukaiset käytävän rungot saavat havuston.** Polun raivaus koskee vain lähietäisyyttä: havustolle käytetään
   `clearFar = mix(clearL, 1.0, smoothstep(14.0, 32.0, zr))` (tai vastaava: lähellä polku pysyy auki, 32 m:stä kauemmas
   raivausta ei ole), ja sama korjaus myös ylöskatseen latvusytimelle. Valon ydin (kaukainen valo käytävän päässä) ja
   polun lumi eivät saa peittyä: jos havusto peittäisi valon, kavenna raivaus valon kohdalla, älä poista sitä.
2. **Yksikään runko ei pääty tasaiseen katkaistuun päähän** millään etäisyydellä: rungon latva on aina oman havustonsa
   sisällä tai häipyy usvaan pitkällä liu'ulla.
3. **Lumi ei välky.** Lumilaikkujen ja havuston reunan kohina on kiinni puussa (maailman koordinaatit: puun numero,
   korkeus puussa, kulma rungon ympäri), ei ruudussa, eikä siinä ole aikaa; reunat suodatetaan pikselin jalanjäljen
   mukaan (`pw`), niin että kaukana laikut sulavat tasaiseksi sävyksi eivätkä vilku kameran liikkuessa; ei kynnyksiä,
   jotka vaihtuvat ruudusta toiseen. Jäykät, kivimäiset laikut ja lähes vaakasuorat reunat pehmennetään (lumi myötäilee
   oksan kaarta ja ohenee kärkeä kohti). Todiste: 60 peräkkäisen ruudun (esim. 2:50–2:52) keskimääräinen ruutuero
   havustoalueella on enintään 1,5-kertainen samaan mittaan runkoalueella, eikä yksittäinen laikku syty tai sammu
   kahden ruudun välillä (ruutusarja joka ruudusta, rajaus 2x).
4. **Ensimmäiset askeleet.** Ohjaaja mittasi kontrabassojen kaistalta (45–115 Hz) äänten alut; ne ovat ankkurin
   `askeleet_alkavat` kentässä `iskut_t` (15 arvoa, 1:39,04 → 2:15,24; `d.cues.cues.find(c => c.id ===
   'askeleet_alkavat').iskut_t`). Moduulin oma tunnistus (rivit noin 413–419) ohittaa osan näistä. Korjaa: askellista =
   `iskut_t`:n arvot + oman tunnistuksen askeleet niiden jälkeen (2:15,5 eteenpäin), ei kaksoiskappaleita (alle 0,5 s
   toisistaan olevat yhdistetään, `iskut_t` voittaa). Jokainen askel näkyy täsmälleen kuten nykyiset askeleet (sama
   valo lumessa, usvan väistyminen, pilkka): ei uutta ilmettä. Todiste: lista askelista ennen ja jälkeen, ja liikesarja
   1:38–2:02 (0,25 s välein), josta jokaisen `iskut_t`-askeleen vastine löytyy.
5. Kaikki muu ennallaan (valo, sykkeet, polku, lähirungot, kamera, ylöskatse, nousu, sivujen havusto nykyisellään).
Renderi `--start 61.6 --end 203.0` → `runs/maailma_03_04/osa.mp4` (4242 ruutua). **Hyväksymisehto: keskirajauksessa
kohdista 2:30, 2:52 ja 3:02 ei ole yhtään paljasta tolppaa eikä katkaistua päätä.** Katso rajaukset itse.

### 10, KORJAUS (rivi 104): myrskyn alun aksentti takaisin

Käyttäjä: "Olet myös missannut jousiston aksentin lumimyrskyn alusta (noin 14:31), se oli aikaisemmin ok, miksi olet
poistanut sen?" Ohjaaja vertasi ruudut (14:31,6–14:32,8, joka toinen ruutu) vedoksista 6 (`runs/vedos_v6u/koko.mp4`) ja 7b:
vedoksessa 6 kuva muuttuu aksentin ruudussa (`myrsky_aksentti_537`, 14:32,0) noin 0,2 sekunnissa (lumi tihenee viiruiksi,
kirkastuu, rintama lähemmäs); vedoksessa 7 sama on levitetty noin 0,65 sekuntiin ja heikennetty, koska ohjaajan Y2-määräys
poisti aksenttitermit (`aks`, `aks2`) tuulesta ja pidensi rintaman askeleen (`askel` 0,40 → 0,65 s). Se oli ohjaajan virhe:
käyttäjä oli hyväksynyt tämän aksentin, ja äkillinen isku saa näkyä äkillisenä (rivi 61: "Ei yllättäviä (paitsi silloin
kun on yllättävä isku)").
1. Palauta aksentin `myrsky_aksentti_537` vastine täsmälleen vedoksen 6 mukaiseksi (`git show e254fcc:visual/maailma_10.js`):
   `aks`/`aks2`-termit siellä, mistä vedos 7 ne poisti, ja `askel` 0,40 s. Vain tämä aksentti.
2. Älä palauta muuta: pyörteiden kiinteä järjestys, metsänreunan korjaus huudossa 3, viisi valokaistaa (15:10), lumen
   pysähdyksen ja ryöpyn poisto sekä huutojen (vasket_myrsky_1..3) käsittely pysyvät vedoksen 7 mukaisina.
Todiste: ruutusarja 14:31,6–14:32,8 joka toisesta ruudusta uudesta renderistä vedoksen 6 saman rinnalla (aksentin ruudun
muutos yhtä nopea ja yhtä suuri: mittaa keskikirkkaus ruuduittain molemmista); `render/vertaa.py runs/vedos_v7b/osat/10.mp4
<uusi> 845.6`: ero vain aksentin jälkeisessä jaksossa (ja lumen vaiheessa sen jälkeen). Renderi `--start 845.6 --end 945.0`
→ `runs/maailma_10/osa.mp4` (2982 ruutua).

