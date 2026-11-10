**LUE ENSIN KOKONAAN `docs/visuaalinen_tyyli.md` (erityisesti luku 4d kohdat 23–36, luvut 7, 7b ja 12) ENNEN MITÄÄN MUUTA.** Sitten tämä brief: yhteinen osa ja oman moduulisi luku.

# Vedos 7: täsmäkorjaukset käyttäjän palautteesta vedokseen 6 (palautelistan rivit 80–91)

Käyttäjä 10.11.2026 yöllä: "Anteeksi, nyt mutta moni asia meni huonompaan suuntan." ja "Miten muutat asioita pois, mitä en
pyytänyt muuttamaan?" Tämän kierroksen tärkein sääntö on siksi: **teet vain sen, mitä oman lukusi numeroidut kohdat
määräävät. Et paranna, siisti, viritä etkä kirjoita uudelleen mitään muuta.** Kaikki, mitä ei ole nimetty, pysyy ruudulleen
samana, ja todistat sen mittarilla (kohta T2).

## Yhteiset säännöt (käyttäjän sanat ovat tyyliohjeessa 4d 31–36)

**Y1. Puu ei taivu lainkaan (4d.31).** "PUUT EIVÄT SAA NÄYTTÄÄ KUMISILTA." Poista moduulistasi jokainen ajasta tai äänestä
riippuva siirtymä puun, rungon, latvan, oksan ja metsän ääriviivan piirrosta: huojunta, taipuma, kallistus, venytys, aalto,
"sway", "huojunta", `uSway` ja vastaavat. Ei pienennetä: poistetaan (kerroin nollaksi ja koodi pois). Puun siluetti saa muuttua
vain kameran liikkeestä. Tuuli ja puuska näkyvät lumessa, usvassa, valossa ja latvoista irtoavassa lumipölyssä.
Todiste: `grep`-tuloste, jossa ei ole yhtään puun piirtoon vaikuttavaa aikariippuvaa termiä, ja liikesarja (kohta T1).

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

**T1.** Renderöi koko moduuli lukon kautta (`node render/lukittu.mjs --data build/rattle_koko --page "visual/maailma.html?m=<k>&aa=2"
--start <A> --end <B> --workers 2 --chunk 40 --out runs/maailma_<k>/osa.mp4`; moduuli 01_02 paikkaan `runs/alku_v4/osa.mp4`;
samat ruuturajat kuin ennen). Tee jokaisesta määrätystä kohdasta liikesarja valmiista renderistä
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
1. **Y1:** poista `uSway`/`swayAmp` ja latvojen siirtymä `sw` kokonaan (rivit noin 67–80, 459, 504, 536).
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
