# Analyysisuunnitelma: kuuntelutyökalu Tapiolalle

*Ohjaajan suunnitelma 1.11.2026 edellisen projektin oppien pohjalta. Tavoite käyttäjän sanoin: "Tee sellaiset
analyysityökalut että KUULET NÄMÄ ASIAT niin ei tarvitse arvailla." Toteutus alkaa vasta pyynnöstä (vaiheet 1, 3 ja 4).*

## 1. Mitä edellinen projekti opetti kuulemisesta

| Oppi | Seuraus Tapiolassa |
|---|---|
| PANNs kertoo, **mikä** soi, ei **milloin** (ikkuna useita sekunteja); ff-tutissa sokea vaskille; hiljaisessa rahina näyttää lautasilta ja virveliltä | PANNs on vain karkea perhevihje. Hetki tulee aina terävästä kanavasta (iskut, stemmien energia, jaksoraja). Hiljaisissa kohdissa lyömäsoitinluokat nollataan. |
| Demucs-stemmit (drums, bass, other, vocals) toimivat orkesterilla paremmin kuin odotettiin: drums 0 % kun rumpuja ei ollut, bassostemmin huiput osuivat tahdinalkuihin | Stemmit ovat ensisijainen lähde patarummuille ja bassolle. "Vocals"-stemmi ei ole johtava linja. |
| CREPE stemmeistä antaa sävelet; pYIN ja librosan tempo eivät toimi orkesterilla; CLAP rikki | pYIN, tempo ja CLAP jätetään pois. CREPE jää (siemennetty). |
| beat_this vaihtaa metristä tasoa; tahtiruudukko ajautuu; tahtinumeroita ei lasketa äänestä | Tapiolassa pulssi on usein piilossa (urkupisteet, tremolot). Tahteja ei raportoida muualta kuin kohdista, joissa iskut ovat kuultavia, ja silloinkin vain paikallisesti. Tahtinumerot tulevat partituurista käyttäjän kautta. |
| Iskut 10 ms tarkkuudella (`aksentit.py`) toimivat; iskun ruutu on luotettava | Säilytetään sellaisenaan. Patarumpujen lyönnit ja tremolot ovat sen erikoisala. |
| Jaksorajat (`segments.py`) olivat teräviä (±0,5 s) ja osuivat vahvistettuihin kohtiin | Säilytetään. Tapiolassa rajoja on vähemmän ja ne ovat pehmeämpiä; kynnykset viritetään uudestaan. |
| Kanava, jota ei ollut testattu varmassa kohdassa, johti harhaan (harppukanava) | **Kanavakortti ennen käyttöä.** Jokainen kanava testataan kohdassa, jonka partituuri ja käyttäjän korva vahvistavat. |
| Kohinanpoisto viivästää 25 ms; mitattiin ja korjattiin | Sama mittaus. Lisäksi mp3-dekoodauksen viive mitataan, koska lähde on mp3. |
| Yksi aikojen totuus (kuuntelukopio) | Sama. Kuuntelukopio tehdään ensin, kaikki muu mitataan sitä vasten. |

## 2. Varmat kohdat (partituurista, käyttäjältä)

Nämä ovat kanavakortin testikohdat. Jokainen aika mitataan kuuntelukopiosta; tähän ei kirjoiteta sekunteja käsin.

| # | Kohta | Mitä kuuluu (partituuri, käyttäjä) | Mikä kanava sen pitää näyttää |
|---|---|---|---|
| V1 | Avaus | **Patarumpusoolo** ("tututum"), ei muuta | patarumpukanava huipussa, kaikki muut lähellä nollaa |
| V2 | Jousten tulo | ydinmotiivi jousissa patarumpujen jälkeen | jousikanava nousee, patarumpu laskee |
| V3 | Puhaltimien tulo | puhaltimet tulevat mukaan jousten jälkeen | puupuhallinkanava nousee |
| V4 | Vaskien isku, Allegro moderaton alku | vaskien isku | vaskikanava + isku `aksentit`issa |
| V5 | Puupuhallinjakso ("peikot", kirjain G) | nopeat kahdeksasosakuviot puupuhaltimissa | puupuhallinkanava, liiketiheys |
| V6 | C-duuri ennen kirjainta M (noin 5 tahtia) | yllättävä duurikirkastus | chroma / sävellajikanava: C-duurin kolmisointu |
| V7 | Kirjain M, myrsky | kromaattinen jousitremolo, vasket | tremolokanava, liiketiheys, vaskikanava |
| V8 | Loppu | H-duurisointu divisi-jousissa pianissimo | chroma: H-duuri; voimakkuus pp; patarumpu 0 |

Kohtia lisätään, kun käyttäjä antaa partituurista lisää (kirjaimet ja tahdit). Jokaisen varman kohdan aika
kirjataan teemakarttaan ankkurina vasta, kun käyttäjä on kuullut sen kuuntelukopiosta.

## 2b. Painotus käyttäjän ohjeen mukaan (1.11.2026)
Käyttäjä: "missä siinä on nopeita tempoja, hitaita tempoja, sforzattoja, yllättäviä asioita, muutoksia, ja mitkä
instrumentit on milläkin hetkellä äänessä." Ei raskasta sointuanalyysiä: "se on varmaankin melko mahdotonta siitä
audiosta." Tärkeysjärjestys:
1. **Soittimet äänessä** (perheet ja patarumpu) hetken tarkkuudella.
2. **Sforzatot ja yllätykset**: iskut (`aksentit`), äkilliset voimakkuuden, rekisterin ja tekstuurin muutokset.
3. **Tempo ja liike**: nopea vai hidas, liiketiheys, tremolo vai pitkä ääni. Ei tahtinumeroita.
4. **Muutokset ja jaksot**: jaksorajat, soittimien tulot ja lähdöt.
5. Sävellaji vain karkeana duuri/molli-vihjeenä (V6 ja V8), ei sointuanalyysinä.

## 3. Kanavat, jotka rakennetaan

### 3.1 Säilyvät edellisestä (korjattuina, ks. `docs/tyokalut.md`)
- `prepare.py`: kuuntelukopio, puhdistettu mono, viiveiden mittaus, kohinaikkuna tiedostosta.
- `analyze.py`: voimakkuus, kirkkaus, rekisterikaistat, chroma, sävellaji, uutuuskäyrä, patina. Ilman pYIN:iä ja tempoa.
- `listen.py`: Demucs-stemmit, PANNs-perheet, CREPE-sävelet, beat_this vain lipulla.
- `aksentit.py`: iskut 10 ms, patarummun lyönnit ja tremolot.
- `interpret.py`, `segments.py`, `aikajana.py`: tapahtumat lauseina, jaksorajat, aikajana.

### 3.2 Uudet kanavat Tapiolalle
| Kanava | Menetelmä | Miksi |
|---|---|---|
| **patarumpu** | drums-stemmin energia + matalan kaistan (50–200 Hz) iskuvoima suoraan puhdistetusta monosta; tremolo = iskutiheys > 8/s | V1 on patarumpusoolo; 1932-äänitteessä patarumpu voi vuotaa bass-stemmiin, siksi kaksi riippumatonta mittaa |
| **jousitremolo** | amplitudimodulaatio 8–20 Hz keskikaistalla (300–3000 Hz) other-stemmistä | myrsky (V7) ja monet keskijakson tekstuurit ovat tremoloa; PANNs ei erota tremoloa pitkästä äänestä |
| **urkupiste** | bass-stemmin CREPE-sävel, jonka kesto > 4 s | Tapiolan matalat urkupisteet; kertoo, milloin pohja pysyy ja milloin liikkuu |
| **duuri/molli ja C-duuri-ilmaisin** | chroma-korrelaatio h-molli-, D-duuri-, C-duuri- ja H-duuri-kolmisointuihin, 1 s ikkuna | V6 ja V8; käyttäjän avainkohta mitataan, ei arvata |
| **liiketiheys** | onset-tiheys other-stemmissä 2 s ikkunassa | erottaa "peikkojakson" kuviot pitkistä äänistä |
| **askel** (lisätty 1.11.2026) | matalan rekisterin alut (bass-stemmi + 40–150 Hz kaista), jotka eivät osu muun orkesterin alkuihin ±80 ms; raportoidaan aika, voima ja väli edelliseen | käyttäjän havainto: "matalat äänet tulee eri tahtiin, vähän niin kuin askeleet"; testikohta kysytään käyttäjältä (kirjain) |
| **perheet (jouset / puupuhaltimet / vasket)** | PANNs-luokat perheiksi, mutta **painotettuna** stemmeillä ja spektrillä: vasket = other-stemmi + kirkkaus + attakki; puupuhaltimet = korkea harmoninen energia ilman tremoloa | PANNs yksin on sokea vaskille ff:ssä (oppi) |

Jokainen kanava tallennetaan 30 fps -ruututaulukkona (`*.f32`) kuten ennen, ja `check_package.py` tarkistaa pituudet.

### 3.3 Kuuntelupöytäkirja (`kuuntele.py`, uudistettu)
Yksi komento, joka annetulle aikavälille tuottaa:
1. taulukon 0,5 s välein: patarumpu, jouset, puupuhaltimet, vasket, tremolo, urkupiste (sävel), sävellaji, voimakkuus;
2. spektrogrammikuvan samalta väliltä (PNG), johon kanavat piirretään päälle;
3. **kuuntelunäytteen** (`build/kuuntelu/otteet/<alku>-<loppu>.wav`) kuuntelukopiosta, jotta käyttäjä kuulee saman
   kohdan ja vahvistaa tai hylkää.

Pöytäkirja on se, jolla kanavakortti täytetään: soitin → kanava → tulos varmassa kohdassa → luotettavuus →
korvaava lähde. Ilman pöytäkirjaa kanavaa ei saa käyttää kuvan ajoitukseen.

## 4. Nopeus ja vire (ennen kuuntelukopiota)
Varneyn siirto on noin 1–2 % lyhyempi kuin Naxosin. Mitataan: CREPE pitkistä jousiäänistä ja bass-stemmistä
avausjaksossa, verrataan h-mollin säveliin, raportoidaan mediaanipoikkeama sentteinä A=440:aa vasten. Käyttäjä
päättää, korjataanko (resample muuttaa kaikkia aikoja, joten päätös tehdään ennen kuin yhtään aikaa kirjataan).

## 5. Paketit
Ensin 60 s testipaketti avauksesta (V1–V3). Sitten koko 1063 s yhtenä pakettina, jos näytönmuisti riittää (Demucs
paloittelee itse); muuten 420 s limittäin ja `stitch`. Kaikki ajat ovat kuuntelukopion aikaa tiedoston alusta.

## 6. Hyväksymisehto
Kanava on käytössä vasta, kun se on näyttänyt varman kohtansa (luku 2) pöytäkirjassa ja käyttäjä on kuullut
otteen. Kanava, joka ei läpäise, merkitään kanavakorttiin kuolleeksi, ja sen tilalle tulee partituuri +
spektrogrammi + käyttäjän korva.

## 7. Yksittäisten soitinten erottelu (käyttäjän kysymys 1.11.2026)

Käyttäjä: "pitäisi tarkemmin pystyä erottelemaan vielä eri soittimet. Mieti onko mahdollista?"
Rehellinen vastaus: **perheet** (jouset, puupuhaltimet, vasket, patarummut) erottuvat modernista äänityksestä
nykyisillä työkaluilla. **Yksittäiset soittimet** (käyrätorvi vs. trumpetti, huilu vs. klarinetti, sello vs.
kontrabasso) erottuvat vain osittain, ja täsmällisesti vain partituurin avulla. Kolme tasoa, kevyimmästä raskaimpaan:

| Taso | Menetelmä | Mitä antaa | Tarkkuus | Työ |
|---|---|---|---|---|
| A | **PANNsin yksittäiset luokat** (violin, cello, double bass, flute, clarinet, bassoon, French horn, trumpet, trombone, timpani) kanavina; ikkunaa lyhennetään (10 s → 2–3 s) | karkea "onko soitin äänessä" soittimittain | heikko tutissa; sekoittaa vaskia keskenään; ei hetken tarkkuutta | pieni, tehdään vaiheessa 3–4 (brief kohta 10) |
| B | **Parempi luokitin** samoille luokille: PaSST tai AST (AudioSet-transformerit) ja Essentia-mallit; CLAP ei (rikki). Lisäksi **MT3 / YourMT3+** monisoitintranskriptio, joka antaa nuotit soittimittain (ohjelmanumerot) | soittimittain nuotit ja aktiivisuus | orkesterilla kokeellinen; vaatii mittaamisen varmoissa kohdissa | keskikokoinen: painot `models.json`:iin, testi V1–V8:ssa |
| C | **Partituuripohjainen soitinkartta** (score-informed): partituurista tahti → mitkä soittimet soittavat (käyttäjä tai OMR / MusicXML / MIDI, jos löytyy), ja partituurin kohdistus ääneen DTW:llä synteettistä MIDI-renderöintiä vasten. Sen jälkeen jokaisen tahdin aika äänityksessä tiedetään, ja soitinaktiivisuus luetaan partituurista, ei arvata äänestä | **täsmällinen "kuka soittaa missäkin tahdissa"** jokaiselle levytykselle, myös omalle | kohdistuksen tarkkuus ±100–300 ms, iskut tarkentavat 10 ms:iin | suurin, mutta ainoa, joka vastaa kysymykseen kokonaan. Vaatii symbolisen partituurin: MusicXML/MIDI (etsitään; [tarkista] laatu) tai OMR IMSLP-skannauksesta (Audiveris), tai käyttäjän käsin kirjaama soitinkartta kirjaimittain |

Suositus (ohjaaja): A heti mittana, C tavoitteena. C sopii projektin sääntöihin: partituuri on tarkistusta varten,
tahtinumeroita ei lasketa äänestä vaan ne tulevat partituurista; DTW-kohdistus vain sitoo partituurin tahdit
äänen aikaan. Käyttäjä on soitinnuksen asiantuntija, joten käsin kirjattu soitinkartta harjoituskirjaimittain
(A–N: mitkä soittimet, mikä on päällimmäisenä) voi olla nopein ja luotettavin tie, ja C:n kohdistus vain antaa sille
ajat. B kokeillaan, jos A ei riitä ja C:n symbolista partituuria ei löydy.

Edellisen projektin oppi, joka pätee: kanava, jota ei ole testattu varmassa kohdassa, ei ole käytössä. Tämä koskee
myös tason B ja C tuloksia.
