# Kriitikon raportti: kuvakäsikirjoitus v1 tyyliohjetta v1.2 vasten (kk_tarkistus_v1, 9.11.2026)

Luettu kokonaan: `docs/visuaalinen_tyyli.md`, `docs/kuvakasikirjoitus.md` (luvut 0-9, otot 01-60), `docs/tutkimus/haastattelu.md`, `docs/kriitikko_kohdat.json`. `annotations/cues.json` luettu Pythonilla (`-I`): ankkurien ajat ja tahdit, koneen kuulemat tapahtumat per otto, jaksojen `soi`-kentät johtajien tarkistukseen. Ei verkkohakuja, ei äänen kuuntelua, ei partituuria. Lainaukset ovat sanasta sanaan (lihavointimerkit poistettu). Tyyliohjeen viitteet: "2.n" = luvun 2 kohta n, "8.n" = luvun 8 kohta n, "sääntö n" = luvun 12 sääntö n.

## 1. Yhteenveto

27 löydöstä: **RIKKOMUS 9, RISTIRIITA 5, AUKKO 5, HUOMIO 8.** Lisäksi 12 tyyliohjeen omaa ristiriitaa (luku 5, kohta G).

Kolme vakavinta:
1. **Löydös 1** (luku 6, koskee otot 05, 17, 19, 23, 43 ja kaikkia ilman Iskut-riviä): käsikirjoituksen oma iskusääntö ("Muissa otoissa isku on johtavan elementin oma huippu") rikkoo sääntöjä 10 ja 11 sekä luvun 7b.
2. **Löydökset 2 ja 3** (otot 07 ja 38): väri vaihtuu iskun ruudussa (sääntö 17), ja otossa 38 vaskien valo tulee eteen ja punainen aurinko sammuu M_ennakko-iskussa.
3. **Löydös 4** (otot 09, 46, 54): katsoja ei tiedä olevansa metsässä (sääntö 9). Liittyy löydökseen 5: maailma 7 on "aukea", vaikka luku 2 sanoo "Jokainen maailma on metsä" ja käyttäjä on sanonut "Ei ole mielestäni oikein että metsää ei tuotaisi esille".

## 2. Löydökset (vakavin ensin)

### 1. RIKKOMUS: luku 6, iskusääntö (koskee ottoja 05, 17, 19, 23, 43 ja kaikkia, joilla ei ole Iskut-riviä)
- Käsikirjoitus (luku 6): "Isku saa ympäristön vastineen vain otossa, jonka rivi Iskut nimeää sen. Muissa otoissa isku on johtavan elementin oma huippu (viiva kirkastuu, pilkahdus syttyy)."
- Käsikirjoitus (otto 05): "ei ympäristön vastinetta: iskut ovat tässä paisutusten huippuja, ja viiva kirkastuu niissä." Otto 19: "ei ympäristön vastinetta: jokainen isku on yhden pilkahduksen huippu." Otto 17: "ei ympäristön vastinetta: pilkahdus kirkastuu."
- Tyyliohje, sääntö 10: "Iskun elementti on ympäristössä (pohjan tärähdys, valon leikkaus, kerrosten etääntyminen) ja näkyy iskun ruudussa." Sääntö 11: "Elementti ei ilmesty, katoa eikä loiki iskussa. Se on jo kuvassa ja muuttaa tilaa." Luku 7b: "Isku, sforzato ... ympäristö reagoi iskun ruudussa: tärähdys maassa, valon leikkaus".
- Mitattu cues.jsonista: otossa 05 on 6 iskua, 17:ssä 9, 19:ssä 17, 43:ssa 6, 23:ssa 3, ja kaikki nämä saavat vain elementin oman huipun. "pilkahdus syttyy" on lisäksi elementin ilmestyminen iskussa (sääntö 11).
- Korjaus: Jokaiselle otolle, jossa cues.json:ssa on iskuja, nimetään ympäristön vastine (tärähdys, leikkaus tai etääntyminen) ja poistetaan luvusta 6 "elementin oma huippu" -poikkeus.

### 2. RIKKOMUS: otto 07 (ja luku 3 maailma 1): väri vaihtuu iskussa
- Käsikirjoitus (otto 07): "`vaskien_isku`: sama rako, joka on ollut kaukana koko ajan, leikkaa hallan värisenä pystysuoraan edestä taakse." Luku 3, maailma 1: "kapea valo runkojen välistä suoraan edestä kaukaa (käyrätorvien kajo, salon värinen)" ja kirkkain hetki "`vaskien_isku`: sama rako leimahtaa hallan värisenä".
- Tyyliohje, luku 3: "Värit eivät vaihdu iskussa; ne vaihtuvat kerroksen tullessa etualalle." Sääntö 17: "Värit vaihtuvat kerroksen tullessa etualalle, eivät iskussa."
- Sama rako (salon värinen) muuttuu hallan väriseksi iskun ruudussa, eikä uusi kerros tule etualalle.
- Korjaus: Rako pysyy salon värisenä ja iskun leikkaus on erillinen, jo kuvassa oleva halla-sävyinen kerros, joka tulee etualalle, tai rako ei vaihda väriä.

### 3. RIKKOMUS: otto 38: valo ilmestyy ja katoaa iskussa, väri vaihtuu iskussa (lisäksi 4 liikkuvaa elementtiä)
- Käsikirjoitus: "valo hajoaa kylmiksi leikkauksiksi ja sammuu, ja kamera lähtee nopeammin kuin koskaan." ja "Vaskien kylmä valo tulee eteen ja peittää punaisen: väri vaihtuu kerroksen tullessa etualalle, ei iskussa." Iskut-rivi: "valon leikkaukset ja pohjan tärähdys."
- Tyyliohje, sääntö 11: "Elementti ei ilmesty, katoa eikä loiki iskussa. Se on jo kuvassa ja muuttaa tilaa." Sääntö 17: "Värit vaihtuvat kerroksen tullessa etualalle, eivät iskussa."
- Otto 37 ei sisällä leikkauksia eikä vaskien valoa, joten ne ilmestyvät M_ennakko-iskussa. Punainen aurinko sammuu samassa. Kerroksen "tuleminen etualalle" tapahtuu itse iskun ankkurissa, joten väite "ei iskussa" ei pidä.
- Korjaus: Vaskien kylmä valo on jo kuvassa kaukana otoissa 36-37, ja M_ennakko-iskussa se vain leikkaa lähemmäs, kun taas punainen valo haalistuu otolla eikä sammu iskun ruudussa.

### 4. RIKKOMUS: sääntö 9, metsä ei näy otoissa 09, 46 ja 54
- Käsikirjoitus (otto 09): "harmaanvalkea lumipöly koko kuvassa kolmessa syvyydessä (lähin nopein), ei runkoja, ei elementtejä." Otto 46: "viimeiset rungot jäävät taakse, ja edessä on pelkkä musta." Otto 54: "korkeat säikeet jäävät yksin tyhjään ilmaan" ja "ei mitään niiden ympärillä".
- Tyyliohje, sääntö 9: "Metsä näkyy: rungot, kuuset, oksisto, lumi, usva, kerroksittain." Luku 1: "katsoja tietää joka hetki olevansa metsässä."
- Otto 09 on yleistauko, jonka tyhjyyttä tyyliohje (2.6) kuvaa, mutta ainoa metsään viittaava piirre on lumi. Jos "sokea lumi" ei sisällä runkojen siluetteja tai oksia, katsoja ei tiedä olevansa metsässä (ks. G3).
- Korjaus: Nimetään otoille 09, 46 ja 54 vähintään runkojen tai oksiston siluetti tai usva kuvassa.

### 5. RISTIRIITA: luku 2, maailma 7 "aukea" vs "Jokainen maailma on metsä" ja käyttäjän sanat (F)
- Käsikirjoitus (luku 2): "Jokainen maailma on metsä." ja rivi 7: "metsän takana avautuva jäinen aukea: ensimmäinen horisontti". Luku 5 (maailma 7): "Tila on ensimmäisen kerran suurempi kuin katsoja."
- Tyyliohje, luku 4: "Katsoja on metsän sisällä, runkojen keskellä, ei sen edessä."
- Käyttäjä 9.11.2026 (haastattelu.md): "Tässä kuvataan metsää, se on nyt täysin selvää. Ei ole mielestäni oikein että metsää ei tuotaisi esille."
- Maailmaa 7 ei vaihdeta, mutta sen kuvauksesta puuttuu kaikki metsä: otot 47-52 nimeävät vain jään, usvan, horisontin ja "metsän säikeet hyvin kaukana".
- Korjaus: Maailman 7 kerroksiin nimetään metsä (esim. runkojen siluetit horisontin reunalla tai taakse jääneet rungot), jotta "aukea" on metsän aukko eikä metsätön tila.

### 6. RIKKOMUS: sääntö 6 ja 8, tyhjä tausta ja kaukana ei sinistä kerrosta (maailma 6, otto 46)
- Käsikirjoitus (maailman 6 kuvaus): "kuvassa on kerrallaan yksi lähellä, muutama keskellä ja pelkkä pimeä kaukana." Luku 4: "Hiljaisuus ennen myrskyä on musta aukea, jossa ei ole mitään lähellä". Otto 46: "ei horisonttia vielä. Musta ei ole pimennys: jään pinta erottuu juuri ja juuri kameran alla ja liukuu ohi, ja usva sen yllä liikkuu hitaammin."
- Tyyliohje, sääntö 8: "tyhjä tausta on virhe." Sääntö 6: "kaukana (sininen, himmeä, hidas)."
- "Pelkkä pimeä" kaukana on tyhjä tausta eikä sininen kerros. Otossa 46 nimetään vain kaksi kerrosta (jää, usva).
- Korjaus: Kauimmaiselle kerrokselle nimetään sinertävä himmeä rakenne (esim. kaukaisten runkojen tai usvan siluetit) maailmassa 6 ja otossa 46.

### 7. RIKKOMUS: sääntö 6, myrskyssä ei kolmea kerrosta (otot 49-51, luku 3 maailma 7)
- Käsikirjoitus (luku 3, sarake Ei koskaan, maailma 7): "syvyyttä myrskyn sisällä". Otto 49: "lähellä, keskellä ja kaukana ovat sama massa, sama valo, sama liike." Otto 51: "mitään yksittäistä ei erota".
- Tyyliohje, sääntö 6: "Aina vähintään kolme syvyyskerrosta: lähellä (tumma, terävä, nopea), keskellä, kaukana (sininen, himmeä, hidas)."
- Käsikirjoitus seuraa tyyliohjeen kohtaa 5 ("kerrokset romahtavat yhdeksi") ja luvun 7 tutti-riviä, mutta rikkoo sääntöä 6. Tyyliohje on itsensä kanssa ristiriidassa (G2), joten käsikirjoitus ei voi ratkaista tätä.
- Korjaus: Pidetään myrskyssä kolme erotettavaa kerrosta ja annetaan romahtamisen näkyä kerrosten sulautumisena yhteen valoon ja liikkeeseen, tai tyyliohje päättää poikkeuksen.

### 8. RISTIRIITA: otto 51 "vaalein kuva" vs tumma teos
- Käsikirjoitus (otto 51): "`myrsky_huippu`: teoksen tihein ja vaalein kuva." Luku 3: "`myrsky_huippu`: koko kuva hallaa".
- Tyyliohje, luku 3: "koko teos on tumma; valoisin kohta ennen loppua on taottu aurinko, ja sekin on väärän värinen." Sääntö 15: "Koko teos on tumma: hämy, salo, halla, noki."
- Korjaus: Otto 51 on teoksen tihein, ei vaalein kuva, ja kirkkaus pidetään taotun auringon alapuolella.

### 9. RIKKOMUS: sääntö 13, väike ja kajo lähellä (otot 17, 33)
- Käsikirjoitus (otto 17): "Väike edessä ylhäällä; metsän massa on hidas kerros keskellä." ja "pienet pilkahdukset lähioksissa, hiljaa." Otto 33: "kajo paisuu, lumi alkaa väristä, molemmat tulevat lähemmäs kerroksissa."
- Tyyliohje, sääntö 13: "Väike ja kajo ovat kaukana; paino ja massa lähellä."
- Käsikirjoitus noudattaa luvun 7 taulukkoa (väike: kerros "lähellä ja keskellä") ja sääntöä 7, mutta rikkoo samassa luvussa olevaa lakia ja sääntöä 13 (G1).
- Korjaus: Väike ja kajo pidetään kaukana kerroksissa tai tyyliohje ratkaisee, kumpi sääntö voittaa.

### 10. RIKKOMUS: sääntö 7, elementti kasvaa paikallaan (otto 56, otto 48)
- Käsikirjoitus (otto 56): "`S_sempre_mf`: sama viiva kuin alussa, nyt koko kuvan levyisenä." Otto 48: "vaalea seinä nousee horisontista ja levenee reunoille."
- Tyyliohje, sääntö 7: "Se, joka musiikissa puhuu, tulee lähemmäs kerroksissa. Ei suuremmaksi paikallaan."
- Korjaus: Viiva tulee lähemmäs kerroksissa (ja seinä lähestyy) kasvamatta leveämmäksi paikallaan.

### 11. RIKKOMUS: soitin → elementti, otto 55
- Käsikirjoitus (otto 55): "Hämyn ääni, väike, pohjan toinen ääni: vuorotellen, ei yhtä aikaa." ja "puoliksi näkyvä muoto keskellä, pilkahdus ylhäällä, tumma massa alhaalla."
- Tyyliohje, luku 7: "Klarinetit, bassoklarinetti | Hämyn äänet ... keskellä" ja "Fagotit, kontrafagotti | Pohjan toinen ääni ... pohja".
- cues.json (`yksinaiset_aanet`) antaa soittajiksi "klarinetti yksin, pikkolo, bassoklarinetti". Fagotteja ei soita, ja bassoklarinetti on taulukossa hämyn äänten keskikerroksessa, joten "tumma massa alhaalla" ei ole mitään soivaa.
- Korjaus: Bassoklarinetti saa hämyn äänten elementin (keskellä), ei pohjan toisen äänen elementtiä.

### 12. RISTIRIITA: lopun pimeneminen (luku 3 vs otot 57, 59)
- Käsikirjoitus (luku 3, maailma 8, sarake Ei koskaan): "pimenemistä lopussa". Otto 57: "Teoksen lopun tummin hetki, nimetty: kuva ei pimene mustaksi." Otto 59: "`loppu_Hduuri_loppu`: massa himmenee hieman, kajo jää."
- Tyyliohje, luku 5: "Viimeinen hiljaisuus: kuva ei pimene, se vain lakkaa muuttumasta."
- Korjaus: Otot 57 ja 59 ilmaistaan ilman "tummin hetki" ja "himmenee" -sanoja, esim. elementtien lähtönä, jolloin kerrosten valo ei laske.

### 13. RISTIRIITA: valon suunnat (luku 3 vs taulukko ja otot)
- Käsikirjoitus (luku 3): "Kolme valoa, kolme suuntaa. Metsän oma valo tulee edestä kerrosten takaa ja on kylmä (rako, D-duurin välähdykset)." Taulukko: maailma 3 "kaukaisin kidekerros", maailma 4 "alhaalta lumesta", maailma 7 "horisontin kapea hallanvalkea nauha". Otto 21: "Pinnan alla valo tulee alhaalta." Otto 37 Teko: "punainen valo nousee latvojen taakse" vs Näkyy: "punainen valo sinisen metsän läpi sivulta". Otto 07: "pystysuoraan edestä taakse".
- Tyyliohje, 2.7: "Valo tulee aina jostain suunnasta ja jostain kerroksesta."
- Metsän oma valo tulee taulukossa vähintään viidestä suunnasta. Otto 37 sanoo valon tulevan sekä latvojen takaa että sivulta.
- Korjaus: Valon suunta nimetään kerran per maailma samoin sanoin luvussa 3 ja otoissa (esim. "sivulta latvojen korkeudelta"), ja "kolme suuntaa" -lause korjataan vastaamaan taulukkoa.

### 14. RISTIRIITA: "maata ei ole" vs "jään pinta" (maailma 3)
- Käsikirjoitus (luku 3, maailma 3, sarake Ei koskaan): "maata, varjoja maassa". Maailman 3 kuvaus: "Alla ei ole maata vaan tumma usva: kerros, ei tyhjä tausta." Otto 18: "`kerros tulee` (pohja): syvälle alle paljastuu tumma jään pinta." Luku 2 rivi 4: "huurremetsän alla on tumma jään pinta".
- Tyyliohje, 7b: "Urkupiste ... maa ja horisontti pysyvät paikallaan".
- Korjaus: Nimetään yksi sana (usva tai pinta) ja käytetään sitä kaikissa maailman 3 otoissa; urkupisteen vastine (otto 20) sidotaan tähän kerrokseen.

### 15. AUKKO: sääntö 14, valon lähde puuttuu (otot 01, 08, 09, 16, 28, 46)
- Käsikirjoitus: Otto 01: "rungot erottuvat juuri ja juuri. Ei elementtejä, ei valorakoa vielä näkyvissä." Otto 08: "valo ja liike katkeavat samassa ruudussa." Otto 09: "harmaanvalkea lumipöly koko kuvassa". Otto 16: "kelmeä valo täyttää kaikki kerrokset maasta latvoihin ja hiipuu." Otto 28: "hyvin korkealla syttyy ohut valo." Otto 46: "jään pinta erottuu juuri ja juuri".
- Tyyliohje, sääntö 14: "Valolla on aina lähde jossain kerroksessa. Ei hehkua ilman lähdettä." Luku 8.7: "Valon lähde on aina jossain kerroksessa; valoa ei ole ilman lähdettä."
- Otto 01 on lisäksi ristiriidassa maailman 1 kerroskuvauksen kanssa ("kaukana siniset rungot ja valorako"), jossa valorako on, vaikka otto sanoo "ei valorakoa vielä näkyvissä".
- Korjaus: Jokaiselle näistä otoista nimetään lähde kerrokseen (valorako kaukana, lumi tai usva heijastajana).

### 16. AUKKO: sääntö 12, liikkuvien elementtien määrä (otot 38, 35, 07; yleissääntö)
- Käsikirjoitus: Otto 38: "valo hajoaa kylmiksi leikkauksiksi ja sammuu" + "valon leikkaukset ja pohjan tärähdys" + "säikeet katoavat alle" = 4 liikkuvaa (leikkaukset, pohjan tärähdys, säikeet, punainen aurinko). Otto 35: "pilkahdukset ja säikeet lähtevät liikkeelle" + "Väike ja pohjan toinen ääni" + "`nousu`: valo kiipeää pitkään" = 3-4. Otto 07: valon leikkaus, säikeet ja lumi/puuska = 3-4. Yleissääntö: "jokainen koneen kuulema tapahtuma ... näkyy tyyliohjeen luvun 7b mukaan, vaikka sitä ei tässä nimetä."
- Tyyliohje, sääntö 12: "Enintään kolme elementtiä liikkuu yhtä aikaa."
- cues.json: otossa 29 on 10 tapahtumaa 22 sekunnissa, otossa 43 11 tapahtumaa 38 sekunnissa, otossa 56 11 tapahtumaa 32 sekunnissa. Jos jokainen saa vastineen (yleissääntö), kolmen rajan täyttymistä ei voi todeta tekstistä (G10).
- Korjaus: Otoille 38, 35 ja 07 nimetään, mitkä kolme elementtiä liikkuvat; loput pysyvät kerroksessaan.

### 17. AUKKO: sääntö 5, kulkujen kestoa ei voi lukea (kulut 2, 3, 4)
- Käsikirjoitus: Kulku 2: "Kulku 2 alkaa" (otto 16, 3:15-3:23) ja "Kulku 2 päättyy ennen kuin liike hidastuu (`liike`)" (otto 17). Kulku 3: "Kulku 3 alkaa." (otto 20, 5:10-5:36) ja "Kulku 3 päättyy, kun basso vaikenee (`basso vaikenee`)" (otto 21, 5:36-6:06). Kulku 4: "Kulku 4 alkaa, kun basso vaikenee, ja päättyy `jousijakso_urkupiste_E_alku`" (otto 27, 7:42-8:16).
- Tyyliohje, sääntö 5: "Siirtymä maailmasta toiseen on kulku jonkin läpi, kestää vähintään 4 s, mittakaava muuttuu jatkuvasti."
- Luettavissa otsikoiden ajoista: kulku 1 vähintään 7 s (alkaa 0:45-0:54, päättyy 1:01), kulku 5 6 s (11:25-11:31), kulku 6 vähintään 12 s (alkaa 13:45-14:05, päättyy 14:17), kulku 7 vähintään 15 s (alkaa 15:35-15:45, päättyy 16:00). Kulkujen 2, 3 ja 4 alku- tai loppuhetki ei ole ankkurissa eikä aikaa voi laskea.
- Korjaus: Kulkujen 2, 3 ja 4 alku ja loppu sidotaan ankkureihin, joiden välinen aika (generoitu) on vähintään 4 s.

### 18. AUKKO: sääntö 18, elementit hiljaisuudessa (otot 46-47)
- Käsikirjoitus (otto 47): "`hiljaisuus_2_loppu`: väreily on jo selvää." ja Tunne ja johtaja: "Metsän säikeet hyvin kaukana, tuskin erottuvina." Otto 46: "Ei johtajaa."
- Tyyliohje, sääntö 18: "Hiljaisuudessa kamera jatkaa, elementit lakkaavat. Kuva ei pimene vahingossa eikä jatka entistä."
- Hiljaisuus 2 jatkuu otossa 47 (ankkuri `hiljaisuus_2_loppu`), jossa nauha väreilee ja säikeet erottuvat. cues.json (`hiljaisuus_2_alku`) kertoo lisäksi: "ei tauko: jouset soittavat pp kuviota kuulokynnyksellä", joten "Ei johtajaa" on ristiriidassa sen kanssa, että jouset soittavat.
- Korjaus: Nimetään, missä otossa elementit palaavat (myrsky_nakyy), ja merkitään jouset otossa 46 johtajaksi ilman näkyvää elementtiä.

### 19. AUKKO: kameran nousun alku (otto 53 vs tyyliohje)
- Käsikirjoitus (otto 53): "nousee ensimmäisen kerran: ylös, ei taakse; eteenpäin kulku jatkuu." Luku 2 rivi 8: "huudossa kamera nousee lumen ja jään läpi tyyneen".
- Tyyliohje, luku 5: "Huuto (t. 587) on ensimmäinen hetki, jolloin kamera nousee: ylös, ei taakse."
- Otto 53 alkaa ankkurista `toinen_paisunta` (15:35), kun `huuto` on 15:45. cues.json antaa `toinen_paisunta`:lle tahdin 587 ja `huuto`:lle 586, mutta ajat ovat päinvastoin. Tekstistä ei voi todeta, kumpi ankkuri tarkoittaa "Huutoa (t. 587)".
- Korjaus: Kameran nousu sidotaan siihen ankkuriin, jonka tahti on tyyliohjeen 587, tai tyyliohje nimeää ankkurin.

### 20. HUOMIO: kamera painuu (otot 20-21) ja otto 20 Teko
- Käsikirjoitus (otto 20 Kamera): "jatkaa hitaasti; linja painuu vähitellen kohti pintaa." Otto 21 Teko: "kamera painuu mustan pinnan läpi". Otto 20 Teko: "kaikki pysähtyy paikalleen kahdesti, ja tumma pinta alla lähestyy."
- Tyyliohje, sääntö 1: "Kamera liikkuu aina, hitaasti sisään ja eteen. Ei peruuta, ei palaa." 8.3: "Suunta vaihtuu vain nimetyissä kohdissa." Luku 7b, urkupiste: "maa ja horisontti pysyvät paikallaan; kaikki muu liikkuu sen päällä".
- Kamera painuu alaspäin: luku 7 nimeää kohdan ("Painuminen"), joten 8.3 täyttyy, mutta sääntö 1 sanoo "sisään ja eteen". Otto 20 Teko ("kaikki pysähtyy") ei tarkoita kameraa, mutta sen voi lukea niin.
- Korjaus: Otto 20 Teko sanotaan "elementit pysähtyvät kahdesti", ja kameran alaspäin painuminen nimetään yhdeksi nimetyksi poikkeukseksi.

### 21. HUOMIO: sääntö 4, kulku alkaa iskussa (otot 07, 38; luku 2 rivi 2)
- Käsikirjoitus (luku 2 rivi 2): "vaskien iskussa runkojen välinen valorako leimahtaa, puuska nostaa lumen ilmaan, kamera ajaa rakoon". Otto 07: "Kulku 1 alkaa." Otto 38: "kamera lähtee nopeammin kuin koskaan".
- Tyyliohje, sääntö 4: "Kamera ei reagoi iskuun. Elementit reagoivat."
- Otto 07 sanoo "ei reagoi", mutta kulku 1 alkaa samassa iskussa. Otto 38 noudattaa tyyliohjeen kohtaa 5 (G4).
- Korjaus: Kulku 1 alkaa iskun jälkeen (esim. `tuulenpuuska`), ei iskun ruudussa.

### 22. HUOMIO: yksi ajatus per otto (otot 38, 45)
- Käsikirjoitus: Otto 38 Teko: "valo hajoaa kylmiksi leikkauksiksi ja sammuu, ja kamera lähtee nopeammin kuin koskaan." Otto 45 Teko: "valo häipyy niin pieneksi kuin se voi, säikeet sanovat vielä jotain, ja rungot loppuvat."
- Käsikirjoitus, luku 0: "Yksi ajatus per otto. Katsoja katsoo yhtä asiaa kerrallaan." Tyyliohje 8.1: "Yksi asia johtaa kerrallaan: se, joka musiikissa puhuu (pääosasääntö)."
- Korjaus: Jaetaan Teko yhteen lauseeseen per otto tai nimetään, mikä näistä on pääasia.

### 23. HUOMIO: elementit, joita luvun 7 taulukossa ei ole
- Käsikirjoitus: Otto 56: "Valon viiva (metsän säikeet yhtenä pitkänä viivana)." Otto 12: "sointumatto hengittää keskellä." Otto 21: "jokainen sykäys on rengas, joka leviää pinnassa kameran ympärillä."
- Tyyliohje, luku 7: "Kuvakäsikirjoitus nimeää elementin, ei soitinta." Taulukossa sellot kuuluvat pohjan askeleisiin, kerros "pohja", ja valon viiva on kajon (käyrätorvet) tai ohuen linjan elementti.
- Korjaus: Nimetään nämä taulukon elementeiksi (sellot keskellä: ei pohjassa, "rengas" pohjan tärähdyksen tai askeleen jälkenä).

### 24. HUOMIO: luku 7b, tapahtumatyypit joille ei ole riviä
- Käsikirjoitus: Käyttää tapahtumia `basso vaikenee`, `purske`, `paisuva sointu`, `äkillinen voimistuminen`. Otto 19: "nopeutuu jakson ajaksi (`uusia_korkea`)", otto 35: "nopeutuu (`uusia_keski`, `uusia_korkea`)". Luku 6: "kameran nopeus vain hitaana keskiarvona".
- Tyyliohje, 7b: "kameran nopeus seuraa vain suuria muutoksia". Taulukossa ei ole riviä `basso vaikenee`-tapahtumalle.
- Käsikirjoitus tulkitsee `basso vaikenee` "kerros katoaa" (pohja) -rivin mukaan, mutta luku 7b ei sano sitä.
- Korjaus: Ilmoitetaan, että `basso vaikenee` käsitellään 7b:n `kerros katoaa` -rivinä, ja otoissa 19 ja 35 kameran nopeus sidotaan vain suureen muutokseen.

### 25. HUOMIO: sääntö 20, kliseiden riski (otot 21, 37)
- Käsikirjoitus: Otto 21: "jokainen sykäys on rengas, joka leviää pinnassa kameran ympärillä." Otto 37: "punainen valo sinisen metsän läpi sivulta. Runkojen reunat hehkuvat, varjot lankeavat kuvan poikki".
- Tyyliohje, sääntö 20: "Ei kansien kliseitä (kapellimestari, tyyni järvi, auringonlasku), ei Mondrian-ruudukkoa, Kandinskyn ympyröitä, visualisaattori-synestesiaa." Luku 3: "ei tulta, ei auringonlaskua (kansien klisee)."
- Sisäkkäiset renkaat voivat lukeutua Kandinskyn ympyröihin, ja matalalta sivulta tuleva punainen valo metsässä voi lukeutua auringonlaskuun.
- Korjaus: Rengas nimetään pohjan tärähdyksen aaltona yhdessä tasossa (ei sisäkkäisinä ympyröinä), ja otto 37 sanotaan nousuna latvojen takaa (kuten tyyliohje 5), ei laskuna sivulta.

### 26. HUOMIO: otto 05, johtajat ja viiva
- Käsikirjoitus: Tunne ja johtaja: "Väike ja hämyn äänet vuorotellen samalla viivalla." Näkyy: "valorako kirkastuu ja himmenee paisutus kerrallaan".
- Tyyliohje, luku 7: "Oboet, englannintorvi | Ohut linja" ja "Käyrätorvet | Kaukainen kajo ja hengitys". cues.json (`puhallinkuviot_alku`): huilut, oboet, klarinetit, käyrätorvet.
- Paisuva viiva on käyrätorvien ja oboen elementti, mutta sitä ei nimetä johtajaksi; johtajiksi on nimetty vain väike ja hämyn äänet.
- Korjaus: Nimetään johtajaksi myös viiva (kajo/ohut linja), joka paisuu.

### 27. HUOMIO: sääntö 9, huurremetsän tunnistettavuus (maailma 3)
- Käsikirjoitus (luku 2 rivi 3): "metsä oksan huurteessa: kiteet ovat kuusten kokoisia, maata ei ole, kaikki leijuu". Maailman 3 kerrokset: "keskellä kiderungot, kaukana sininen kidemetsä".
- Tyyliohje, 2.8: "Metsä on metsä: rungot, kuuset, oksisto, lumi, usva, kerroksittain."
- Kiteistä muodostuva metsä on abstraktio; tekstistä ei voi todeta, että katsoja lukee sen metsäksi.
- Korjaus: Nimetään kaukaiseen kerrokseen kuusten siluetit tai lumiset rungot kiteiden taakse.

## 3. Sääntötaulukko (säännöt 0-21)

| Sääntö | Tulos | Löydökset |
|---|---|---|
| 0 Ääni ohjaa | ei voi tarkistaa kokonaan tekstistä (271 tapahtumaa; kattavuus on yleissäännössä) | 24, 20 |
| 1 Kamera sisään ja eteen | HUOMIO | 20 |
| 2 Pysähdys vain nimetyissä | OK (kaksi nimettyä: otot 37 ja 58, ei muita) | 20 (Teko-sanamuoto) |
| 3 Ei pyöri, 20 °/s | OK (ei pyörimistä tekstissä; °/s ei tarkistettavissa tekstistä) | - |
| 4 Kamera ei reagoi iskuun | HUOMIO | 21 |
| 5 Kulku, vähintään 4 s | AUKKO (kulut 2, 3, 4) | 17 |
| 6 Vähintään kolme kerrosta | RIKKOMUS | 6, 7 |
| 7 Puhuva lähemmäs | RIKKOMUS | 10 (ja G1) |
| 8 Ei pahvia, ei tyhjää | RIKKOMUS | 6, 4 |
| 9 Metsä näkyy | RIKKOMUS | 4, 5, 27 |
| 10 Iskun elementti ympäristössä | RIKKOMUS | 1 |
| 11 Ei ilmesty/katoa iskussa | RIKKOMUS | 1, 3 |
| 12 Enintään kolme liikkuu | AUKKO | 16 |
| 13 Väike/kajo kaukana | RIKKOMUS | 9 (ja G1) |
| 14 Valolla lähde | AUKKO | 15 |
| 15 Tumma, ei lämpöä | RISTIRIITA | 8 |
| 16 Taottu aurinko / kajo | OK (luku 8 kohta 4 on tiedossa) | - |
| 17 Väri ei iskussa | RIKKOMUS | 2, 3 |
| 18 Hiljaisuus | AUKKO | 18 (ja 12) |
| 19 Ei edellisen projektin tyyliä | OK | - |
| 20 Ei kliseitä | HUOMIO | 25 |
| 21 Ei tekoälykuvia, ei natsitervehdystä | OK (ei hahmoja, ei eleitä) | - |

## 4. Ottotaulukko (otot 1-60)

Kerroksia: "oma/maailma" = otto itse nimeää / maailman kuvaus nimeää (maailmat 1-5 ja 8: 3; maailma 3: 3 + usva; maailma 6: 3 (kaukana "pimeä"); maailma 7: 3). Liikkuvat: arvio otto-tekstistä (väli = epävarma).

| # | Kerroksia | Liikkuvia | Valon lähde | Löydökset |
|---|---|---|---|---|
| 01 | 0/3 | 0 | ei | 15 |
| 02 | 2/3 | 2 | kyllä | - |
| 03 | 2/3 | 2 | kyllä | - |
| 04 | 0/3 | 1 | kyllä | - |
| 05 | 0/3 | 3 | kyllä | 1, 26 |
| 06 | 0/3 | 2 | kyllä | - |
| 07 | 1/3 | 3-4 | kyllä | 2, 16, 21 |
| 08 | 0/3 | 1 | ei | 15 |
| 09 | 3/3 | 0 | ei | 4, 15 |
| 10 | 0/3 | 2-3 | kyllä | - |
| 11 | 0/3 | 2 | kyllä | - |
| 12 | 1/3 | 3 | kyllä | 23 |
| 13 | 1/3 | 2 | kyllä | - |
| 14 | 0/3 | 2-3 | kyllä | - |
| 15 | 0/3 | 2 | kyllä | - |
| 16 | 0/3 | 1-2 | ei | 15, 17 |
| 17 | 2/4 | 3 | kyllä | 1, 9, 17 |
| 18 | 1/4 | 2-3 | kyllä | 14 |
| 19 | 0/4 | 3 | kyllä | 1, 24 |
| 20 | 0/4 | 1 | kyllä | 17, 20 |
| 21 | 1/3 | 2-3 | kyllä | 17, 20, 23, 25 |
| 22 | 0/3 | 2 | kyllä | - |
| 23 | 1/3 | 2 | kyllä | 1 |
| 24 | 0/3 | 3 | kyllä | - |
| 25 | 0/3 | 2 | kyllä | - |
| 26 | 0/3 | 2 | kyllä | - |
| 27 | 0/3 | 3 | kyllä | 17 |
| 28 | 0/3 | 2 | ei | 15 |
| 29 | 0/3 | 2 | kyllä | - |
| 30 | 0/3 | 1-2 | kyllä | - |
| 31 | 0/3 | 1 | kyllä | - |
| 32 | 1/3 | 1 | kyllä | - |
| 33 | 0/3 | 2 | kyllä | 9 |
| 34 | 0/3 | 3 | kyllä | - |
| 35 | 1/3 | 3-4 | kyllä | 16, 24 |
| 36 | 1/3 | 3 | kyllä | - |
| 37 | 0/3 | 1 | kyllä | 13, 25 |
| 38 | 0/3 | 4 | kyllä | 3, 16, 21, 22 |
| 39 | 1/3 | 3 | kyllä | - |
| 40 | 1/3 | 2-3 | kyllä | - |
| 41 | 1-2/3 | 3 | kyllä | - |
| 42 | 1/3 | 2 | kyllä | - |
| 43 | 1/3 | 2 | kyllä | 1 |
| 44 | 0/3 | 3 | kyllä | - |
| 45 | 1/3 | 3 | kyllä | 22 |
| 46 | 2/3 | 0 | ei | 4, 6, 15, 18 |
| 47 | 1/3 | 1 | kyllä | 18 |
| 48 | 0/3 | 1-2 | kyllä | 10 |
| 49 | 3/3 (sulautuvat) | 1 | kyllä | 7 |
| 50 | 0/3 | 3 | kyllä | - |
| 51 | 0/3 | 2-3 | kyllä | 7, 8 |
| 52 | 0/3 | 3 | kyllä | - |
| 53 | 0/3 | 2 | kyllä | 19 |
| 54 | 2/3 | 3 | kyllä | 4 |
| 55 | 0/3 | 1 | kyllä | 11 |
| 56 | 0/3 | 2 | kyllä | 10 |
| 57 | 0/3 | 1-2 | kyllä | 12 |
| 58 | 0/3 | 0-1 | kyllä | - |
| 59 | 1/3 | 2 | kyllä | 12 |
| 60 | 0/3 | 0 | kyllä | - |

## 5. Tyyliohjeen omat ristiriidat (kohta G): raportoitu, ei ratkaistu

G1. **Väike ja kajo: lähellä vai kaukana, ja puhuva lähemmäs vs kajo kaukana.** Luvun 7 taulukko: huilut/väike, kerros "lähellä ja keskellä"; sama luku: "Elementtien yhteinen laki: väike ja kajo ovat kaukana, paino ja massa lähellä." Sääntö 7: "Se, joka musiikissa puhuu, tulee lähemmäs kerroksissa." vs sääntö 13: "Väike ja kajo ovat kaukana; paino ja massa lähellä." Kun kajo tai väike johtaa (otot 03, 05, 17, 22, 23, 24, 26, 42), kumpaa noudatetaan? Vaikuttaa löydöksiin 9 ja 10.

G2. **Kolme kerrosta aina vs kerrokset romahtavat yhdeksi.** 2.1: "Kuvassa on aina vähintään kolme syvyyskerrosta." vs luku 5: "T. 540 se iskee: kerrokset romahtavat yhdeksi." ja luvun 7 tutti: "myrsky: kerrokset romahtavat yhdeksi". Vaikuttaa löydökseen 7.

G3. **Tyhjä tila, metsä joka hetki ja horisontti.** 2.6: "tyhjä tila, jossa liike jatkuu, on se, miltä hiljaisuus näyttää" vs sääntö 8 "tyhjä tausta on virhe" ja luku 4 "Ei tyhjää reunaa". Luku 1 "katsoja tietää joka hetki olevansa metsässä" vs luku 4 "se on ensimmäinen kerta, kun tila on suurempi kuin katsoja". Vaikuttaa löydöksiin 4, 5 ja 6.

G4. **Kamera ei reagoi iskuun vs kamera lähtee M:ssä.** 2.2: "Kamera ei koskaan reagoi iskuun; elementit reagoivat." vs luku 5: "kun M iskee, kamera lähtee uudestaan liikkeelle, nyt nopeammin kuin ennen". Vaikuttaa löydöksiin 3 ja 21.

G5. **Yksi suunta ja poikkeukset.** 2.3: "Poikkeus on vain lopussa (luku 5)." vs luku 5: C-duurin pysähdys ja huudon nousu eivät ole lopussa. Lisäksi 2.6 "Hiljaisuudessa kamera jatkaa" vs luku 5 viimeinen hiljaisuus "kuva ... lakkaa muuttumasta".

G6. **Iskun elementti: ei ennen vs jo kuvassa; ei reagoi vs ympäristö reagoi.** 8.5: "Iskun elementti näkyy iskun ruudussa, ei ennen eikä jälkeen (videotarkistus)." vs luku 5: "Elementti ei ilmesty, katoa tai loiki iskussa; se on jo kuvassa ja muuttaa tilaa." Luvun 7 taulukko: huilut, klarinetit, oboet, fagotit "Iskussa: ei reagoi" vs 7b: "Jos äänessä tapahtuu jokin näistä eikä kuvassa tapahdu mitään, se on virhe." Vaikuttaa löydöksiin 1 ja 3.

G7. **H-duurin ja C-duurin tahdit.** Luku 3: kajo "vain H-duuri (t. 605-634)"; luku 5: "S:stä (t. 605) kamera hidastuu, ja H-duurissa (t. 618-634) se pysähtyy"; cues.json: `loppu_Hduuri_alku` tahti 624; haastattelu: "H-duuri (624-634)". C-duuri luvussa 3 "t. 385-396", cues.json `auringonsade` tahti 392, haastattelu "noin t. 392-396". Kolme alkukohtaa H-duurille.

G8. **Punainen: sallittu vs vältettävä.** Luku 9: "Värejä, jotka lämmittävät ennen loppua. Punaista. Hehkua ilman lähdettä." vs luku 3: "Punaista on vain taotussa auringossa (käyttäjä hyväksyi 9.11.2026)".

G9. **Kameran nopeus ja ääni-syy.** Luku 5: "Nopeus seuraa musiikin liikettä (liiketiheys-kanava)" vs 7b: "kameran nopeus seuraa vain suuria muutoksia". Lisäksi 7b "Kuva tapahtuu ilman äänen syytä = virhe" (sääntö 0) vs sääntö 1: "Kamera liikkuu aina": kameran jatkuva liike ei ole yhdenkään äänen tapahtuman seuraus.

G10. **Kolmen elementin raja vs jokainen tapahtuma saa vastineen.** Sääntö 12 vs sääntö 0/7b: tiheissä kohdissa (cues.json: yli 10 tapahtumaa otossa) molemmat eivät voi täyttyä. Vaikuttaa löydökseen 16.

G11. **Värin vaihtuminen.** Luku 3: "Värit eivät vaihdu iskussa; ne vaihtuvat kerroksen tullessa etualalle." vs 7b: "kun soitin vaihtuu samalla sävelellä, sama linja vaihtaa väriä" ja rivi "Sävellajin väri ... valon väri (luku 3)". Linja vaihtaa väriä tulematta etualalle.

G12. **Horisontin ilmestyminen.** Luku 4: "Horisonttia ei näytetä ennen myrskyä: se ilmestyy, kun myrsky näkyy kaukana (t. 523)" vs luku 5: "hiljaisuus ennen myrskyä (kamera jatkaa, hyvin hitaasti, horisontti ilmestyy)". Käsikirjoitus (otot 46-47) sovittaa nämä päällekkäisellä hiljaisuudella, mikä tuottaa löydöksen 18.
