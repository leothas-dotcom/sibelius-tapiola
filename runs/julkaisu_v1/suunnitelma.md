# Tapiola: YouTube-julkaisun suunnitelma ja Shorts-ideat v1 (13.11.2026)

*Luettu ennen kirjoitusta: `docs/visuaalinen_tyyli.md` (kokonaan), `docs/tutkimus/haastattelu.md` (kokonaan), `docs/tapiola_tutkimus.md` (luvut 1-5), `annotations/kuunteluopas.md` (kokonaan), `docs/projekti.md` (palautelista rivit 1-117, Opit 13.-11.11.), `annotations/cues.json` (96 ankkuria), Heldenlebenin `docs/julkaisu2.md` ja `docs/youtube.md` (otsikot ja alku). Kuvat: `runs/vedos_v8/koko.mp4`, ruudut luettu Read-työkalulla (kontaktiarkit `runs/julkaisu_v1/tyo/a-e.jpg`).*

**Aikojen merkintä.** Kaikki ajat suluissa ovat Rattle / LSO 2022 -työäänityksen aikaa ja vain lukijan avuksi. Sitova raja on aina ankkuri (`cues[].id`); omalle äänitykselle ajat tulevat `ajat_<oma>.json`:sta. Rattlen ääntä ei julkaista: yksikään tässä suunnitelmassa oleva Short tai video ei lähde ulos ennen omaa äänitystä.

**Väitesääntö.** Kone mittasi, muusikko kuuli ja korjasi. Mikään teksti ei sano, että tekoäly "ymmärtää" Sibeliusta.

---

## 1. Idea, otsikot, thumbnailit

**Idea yhdessä lauseessa.** Sibeliuksen Tapiola (1926) 18 minuutin matkana kuusimetsän sisään, jossa jokainen ruutu on koodin laskemaa ja jokainen valo, tuulenpuuska ja lumihiutale on sidottu johonkin, minkä kuulet.

**Kolmessa lauseessa.**
1. Katsoja saa teoksen, jonka alku on vaikea (patarumpusoolo, gis-ääni, yleistauko), kuvana, joka kertoo hänelle mihin korvaa kannattaa kääntää: kun valot lähestyvät toisiaan, kaksi melodiaa lähestyy toisiaan; kun lumi tippuu oksalta, alttoviulu kommentoi.
2. Hän jaksaa 18 minuuttia, koska teoksessa on neljä nimettävää palkintoa, jotka tulevat tiettyinä hetkinä: hiljaisuus (0:58), väärä punainen aurinko (11:20), myrsky joka näkyy ensin kaukana (14:17) ja H-duurin kajo (17:04). Tovey (`tapiola_tutkimus.md` luku 3): koko teos on yksi hidas crescendo ja lyhyt lasku hiljaisuuteen; kuva tekee crescendon näkyväksi.
3. Tausta, joka ei ole markkinointia: orkesterimuusikko kuuli koneen mittaukset ja korjasi ne ("NE KUULUVAT SIELLÄ TAUSTALLA SOITTAEN GIS-ääntä KOKO AJAN"), ja jokainen kuvan valo on sidottu äänitapahtumaan. Se on se, mitä Heldenlebenissä puuttui: paketti, joka lupaa yhden asian viidessä sekunnissa.

### Otsikkovaihtoehdot

| # | Suomi | English |
|---|---|---|
| A | Sibelius: Tapiola – jokainen ruutu piirretty koodilla | Sibelius: Tapiola – every frame drawn by code |
| B | Kone mittasi Tapiolan, muusikko kuuli: Sibeliuksen metsä kuvana | A machine measured Sibelius's Tapiola. A musician told it what he heard. |
| C | Tapiolan väärä aurinko: C-duuri ennen myrskyä (Sibelius, 1926) | The false sun in Sibelius's Tapiola (1926), drawn by code |

Suositus: **A haun takia, B kun käyttäjä haluaa tarinan etualalle.** Säveltäjä ja teos pysyvät otsikossa (haku). "No AI" ei mene otsikkoon (ks. avoin päätös 4): koodin kirjoitti Claude Code, joten väite "ei tekoälyä" olisi harhaanjohtava; "ei generoituja kuvia, jokainen ruutu laskettu koodilla" on tosi.

### Thumbnail-ehdotukset (ruudut videon omasta kuvasta)

| # | Ruutu | Ankkuri | Teksti (enint. 4 sanaa) | Miksi |
|---|---|---|---|---|
| T1 | punainen aurinko ja valkoinen pystyleikkaus runkojen välissä (Rattlen ajassa 11:21-11:26; luettu ruudut 681 s ja 686 s) | `auringonsade` / `M_ennakko` | VÄÄRÄ AURINKO / FALSE SUN | Videon ainoa punainen; yksi kohde, kaksi sävyä; käyttäjän lempikohta |
| T2 | revontuli ja vaaran rinteen ikkunat (995 s) | `S_puhaltimien_kaari` | DRAWN BY CODE / KOODILLA PIIRRETTY | Kaunein yksittäinen ruutu ("kirsikka kakun päällä"); lupaa konseptin |
| T3 | jään valot (430 s) tai kaksi valoa pimeässä (470 s) | `peikot_G_alku` ... `hajoaa_hiljaisuuteen` | KUUNTELE VALOJA / LISTEN TO THE LIGHTS | Lupaa, että kuva on ääntä; vähiten mainoksen näköinen |

Suositus: **T1 ensimmäiseksi**, T2 toiseksi, YouTuben oma "Test & compare" -A/B-testi (Heldenleben-oppi). T1:n punainen toimii vain, jos katsoja ei tunne sitä "Taottu aurinko" -lupaukseksi: kuvauksen ensimmäinen rivi lunastaa sen. Thumbnail on still videon omasta renderistä, ei ääntä, ei oikeusongelmaa.

---

## 2. Koukku: ensimmäiset 30 sekuntia

**Tosiasiat (kuvasta ja ankkureista).** Tapiola alkaa: horisontti ja lumi, ei ääntä noin 7,7 s (`avaus_patarumpu`), patarummun "tututum", sitten jousten siemen (`jouset_tulevat`, `siemen_toistuu`), puhaltimien kuviot (`puhallinkuviot_alku`, noin 25 s), ja vasta noin 45 s tulee vaskien isku (`vaskien_isku`) ja tuulenpuuska. Ruudut 0, 12, 30 s: tumma tasainen horisontti, lunta, vähän liikettä; 30 s kohdalla ensimmäiset kummut ja valot horisontilla. Eli ensimmäinen puoli minuuttia on kauniin hiljainen ja visuaalisesti rauhallinen: juuri se, mitä Heldenleben-oppi varoittaa ("20 minuuttia ilman sisäänheittäjää").

**Vaihtoehdot**

| Vaihtoehto | Plussat | Miinukset |
|---|---|---|
| a) Puhuttu prologi (Heldenleben-malli, 60-90 s) | Kertoo idean | Pitää katsojan poissa musiikista; Tapiola ei kestä selitystä ennen ensimmäistä ääntä; käyttäjän oma sääntö (Heldenleben): ei kertojaa musiikin päälle |
| b) Tekstitykset (SRT) | Ei muuta videota; `runs/tekstitys_v1/` tekee | **Oletuksena pois päältä** katsojalla; ei voi olla ainoa koukku |
| c) Kappalemerkit | Näkyvät heti | Vain hakuapu; ei pidä katsojaa |
| d) Kirjoitettu avauskortti ensimmäisten 7,7 s hiljaisuuteen | Ei vie aikaa: hiljaisuus on jo siinä; ei kertojaa; nähdään heti | Vaatii pienen uuden renderin (poltettu teksti); omalla äänityksellä hiljaisuuden pituus voi olla eri |
| e) Esikatselukohtaus (teaser) alussa | Näyttää huipun | Pilaa väärän auringon ja H-duurin |

**Suositus: d + b + c.** Ensimmäisinä sekunteina (hiljaisuus, ennen `avaus_patarumpu`):
- ruutu 1: "Jean Sibelius, Tapiola, 1926" (fi/en pienellä)
- ruutu 2 (noin 4 s): "Jokainen ruutu on koodin laskema. Kuuntele valoja." / "Every frame is computed by code. Listen to the lights."
- teksti haipuu ennen patarumpua, joten ääni ja kuva saavat olla ilman tekstiä siitä eteenpäin.
Perusteet: (1) viidessä sekunnissa idea on kerrottu, (2) hiljaisuus on käyttämätöntä aikaa, (3) teos ei muutu. Tekstityksen kolme ensimmäistä riviä (`runs/tekstitys_v1/`) kohdistetaan ankkureihin `puhallinkuviot_alku` (25 s: "Kuuntele: puhaltajat nousevat gis-äänestä kuin kummut") ja `vaskien_isku` (45 s), joten 0:25-0:45 on se, mitä toinen koukku lupaa. Kappalemerkit: ensimmäinen "Hiljaisuus ja patarumpu" (0:00), toinen "Siemen ja horisontti" (0:08), kolmas "Vaskien isku" (0:45) jne. (luku 5), jotta 18 min näyttää rakenteelta.
**Ei suositella:** puhuttua prologia pitkän videon alkuun. Making-of (luku 4) julkaistaan omana videona ja linkataan.

---

## 3. Shortsit (kahdeksan, yksi varalla)

**Yleistä.** Jokainen Short on yksi väite, yksi ote, enintään kolme lyhyttä tekstiä, ja päättyy pitkän videon kohtaan (linkki kuvaukseen/kiinnitettyyn kommenttiin). Kesto 20-50 s. Kuvan elementit ovat sidottuja ankkureihin, joten rajaus tehdään uudestaan omalle äänitykselle ankkurista. Pystykuvan arvio perustuu ruutuihin 1920x1080 -videosta.

Tyyliohjeen mukaan ei näytetä soittimia, nuotteja eikä hahmoja; tekstit eivät kuvaile sitä, minkä kuva jo näyttää, vaan antavat korvalle yhden asian.

### S1. "Siemen ja horisontti" (alku; käyttäjän mäki-idea)
- **Koukku.** Ensimmäinen ruutu: pimeä horisontti ja lumi (0 s). Ensimmäinen teksti: "Alussa on yksi sävel: gis." / "It begins with one note: G sharp."
- **Rajat.** Alku `avaus_patarumpu` (7,7 s), loppu `tuulenpuuska` (45,4 s); 37,7 s. Miksi: sisältää patarummun "tututum", siemenen kaksi kertaa, puhaltimien kummut ja vaskien iskun; kaikki, mitä katsojan tarvitsee tietää teoksesta.
- **Tekstit.** (1) "Käyrätorvet pitävät gis-ääntä koko ajan. Jouset peittävät sen." / "Horns hold the G sharp throughout. The strings cover it." Lähde: käyttäjä 9.11. ("NE KUULUVAT SIELLÄ TAUSTALLA SOITTAEN GIS-ääntä KOKO AJAN"), ankkuri `gis_paljastuu`; mitattu `tarkka.py`. (2) "Ei suomessa ole sellaisia vuoria. Vain vaaroja." / "Finland has no sharp mountains. Only rounded hills." Lähde: käyttäjä: "Ei suomessa ole sellaisia. On vain vaaroja, kumpuja ja korkeintaan tuntureita. Ne ovat aina sileitä, jääkauden muokkaamia." (3) "Sibelius: Tapiola, 1926".
- **Pystykuva.** Alku (0-25 s) toimii keskirajauksella (tasainen horisontti ja lumi), mutta 25-45 s kummut ja valot levittäytyvät koko horisontille (ruutu 30 s). **Suositus: renderöi pystyyn** (horisontti alemmaksi, kummut keskelle); rajaus keskeltä pelkästään pudottaisi kummut reunoille.
- **Ohjaa.** Pitkän videon kohta 0:08 ("Siemen ja horisontti").

### S2. "Tapio kävelee, mutta häntä ei näe" (pimeä metsä, basson askeleet ja alttoviulut)
- **Koukku.** Ensimmäinen ruutu: valopylväs polun päässä, rungot (ruutu 90 s). Teksti: "Tapiota ei näe. Hänet kuulee." / "You can't see Tapio. You can hear him."
- **Rajat.** Alku `askeleet_alkavat` (86,7 s), loppu `askeleet_B` (129,7 s); 43 s. Miksi: tässä basson askeleet näkyvät valoina ja alttoviulut tuulena, joka tiputtaa lumen; käyttäjä: "Nyt metsä näyttää hyvältä" ja "Pidin noista jättiläisten askelista, ne toimi hienosti isoina, mutta pehmeinä, kuten musiikissa."
- **Tekstit.** (1) "Matalat äänet tulevat eri tahtiin kuin muu orkesteri: askeleet." / "Low strings step in their own time." Lähde: käyttäjän havainto 1.11.2026, askeleet_B 9.11. vahvistettu korvalla. (2) "Alttoviulu on tuuli: se tiputtaa lumen oksilta." / "The viola is the wind that drops the snow." Lähde: käyttäjä 13.11. "Ja alttoviulu on se tuuli, joka liikuttaa sitä SATAVAA LUNTA MYÖS". (3) "Yksi asia kuvassa, yksi ääni." / "One thing on screen, one sound."
- **Pystykuva.** Rungot ja valopylväs ovat symmetrisiä keskellä (ruudut 90-125 s); **keskirajaus toimii**, reunojen rungot häviävät mutta eivät ole kantava elementti. Halpa.
- **Ohjaa.** 1:26 "Tapion askeleet pimeässä metsässä".

### S3. "Katsoja on Tapio" (jää, kameran nyökkäys askelista)
- **Koukku.** Ensimmäinen ruutu: jää ja horisontti, kamera hiljalleen liikkeessä (ruutu 395 s). Teksti: "Tässä kamera kävelee." / "Here the camera walks."
- **Rajat.** Alku `vaskipulssit` (435,9 s; englannintorvi, askeleet), loppu `hajoaa_hiljaisuuteen` (462,0 s); 26 s. Miksi: käyttäjän oma idea: "voisiko itse kamera nyökätä kuten askeleet? Että katsoja ottaa siinä kohtaa tavallaan tapion roolin" ja "Siinä kohtaa katsojalle voisi tulla olo että hetkinen, minähän olen tapio?"; "Huom, ei saa aiheuttaa pahoinvointia. HYVIN HIENOVARAINEN ELE." Hienovarainen ele ei välttämättä näy lyhyessä pystykuvassa: tarkista ennen lukitsemista [tarkista].
- **Tekstit.** (1) "Kontrabassot askeltavat. Kamera askeltaa mukana." / "The basses step. So does the camera." (2) "Käyttäjän idea: katsoja on Tapio." / "The musician's idea: you are Tapio." Lähde: haastattelu 11.11. (3) loppuun: "Kuuntele, kun askeleet lakkaavat."
- **Pystykuva.** Jään halkeamat ja valot leviävät koko leveydelle; **suositus: renderöi pystyyn** tai jätä Short pois, jos nyökkäys ei erotu. Vaihtoehto: yhdistä S4:ään.
- **Ohjaa.** 7:15-7:42; kappalemerkki "Taite: ratsastus ja Tapion paino" (6:49).

### S4. "Katso äänen kuvaa: valot lähestyvät" (spektrogrammi ja valot; making-of-Short)
- **Koukku.** Ensimmäinen ruutu: kaksi valoa pimeässä (ruutu 470 s). Teksti: "Kaksi huilua lähestyvät toisiaan. Niin tekevät valot." / "Two flutes approach each other. So do the lights."
- **Rajat.** Alku `hajoaa_hiljaisuuteen` (462,0 s), loppu `jousijakso_urkupiste_E_alku` (496,3 s); 34 s. Huilut soittavat noin 7:44-8:13 (käyttäjä: "Huilu alkaa soittaa arviolta 7:44 ja lopettaa 8:13", arvio; tarkka aika mitataan).
- **Tekstit.** (1) "Valot syttyvät, kun huilu alkaa. Ne sammuvat, kun se lopettaa." / "Lights on when the flute starts. Off when it stops." (2) "Spektrogrammi näyttää, kuinka." / "The spectrogram shows how." Lähde: käyttäjä: "Tuossa spektrogrammissahan on tarkasti juuri tuo miten valojen pitää mennä?" (3) "Jokainen valo on yksi ääni."
- **Pystykuva.** Vaatii **pystyrenderin** ja lisäkuvan (spektrogrammi alaosassa, jos halutaan näyttää; spektrogrammi on koneen mittauskuva, ei projektin tyylin osa, joten tarkista tyyliohjeen kanta [tarkista]: tyyliohje kieltää tekstin ja soittimet kuvasta, mutta Short voi olla erillinen paketti; päätös käyttäjälle).
- **Ohjaa.** 7:42-8:16; making-of-video.

### S5. "Tapion pöytä" (sali, sellojen laulu, viulujen lasimaiset äänet)
- **Koukku.** Ensimmäinen ruutu: vaakalauta kolmen rungon päällä sumussa (ruutu 540 s). Teksti: "Kolme runkoa, yksi lauta: Tapion pöytä." / "Three trunks, one board: Tapio's table."
- **Rajat.** Alku `hitaat_soinnut` (540,0 s), loppu `altot_mezza` (590,3 s) lyhennettynä alle 50 s:iin; 50 s. Miksi: käyttäjän arvio: "WAU Hienosti menee nuo valot tuossa tapion pöydässä! UPEA! Kun viulut tekevät korkeat äänensä." ja "Tapion huone toimii mielestäni näikin tosi hyvin, koska se taikaelementti näkyy tuossa pöydässä. Joka on mun mielestä aivan älyttömän hieno." Sumu: "Menee ihan kylmät väreet."
- **Tekstit.** (1) "Sellot laulavat. Viulut soittavat lasimaisia huiluääniä." / "Cellos sing. Violins play glassy flute tones." Lähde: partituuri s. 32 (kuunteluopas). (2) "Aivan älyttömän hieno." / (käyttäjän lainaus, fi) (3) "Tapion talo: tilaa, ei hahmo." / "A home, not a figure."
- **Pystykuva.** Pöytä ja valot ovat keskellä (ruudut 540-590 s); **keskirajaus toimii**. Lähde pöydälle: Kalevala-viittaus kuvakäsikirjoituksessa; tekstiin ei tarvita lähdettä.
- **Ohjaa.** 8:16 "Tapion sali".

### S6. "Väärä toivo" (C-duuri ennen myrskyä; käyttäjän lempikohta)
- **Koukku.** Ensimmäinen ruutu: pimeä metsä, ensimmäinen punaisen vihjaus (ruutu 640 s). Teksti: "Viisi sekuntia valoa. Sitten myrsky." / "Five seconds of sunlight. Then the storm."
- **Rajat.** Alku `c_duuri_valahdykset` (641,6 s), loppu `M_ennakko` (685,1 s) + noin 3 s; noin 46 s. Miksi: sisältää kolme välähdystä, pysähdyksen, punaisen auringon, ja M:n iskun.
- **Tekstit.** (1) Käyttäjän oma lause: "juuri ennen talvimyrskyä aurinko hetkellisesti valaisee (c-duuri). Se on lempikohtani. Mutta toivo on turha: siitä alkaakin myrsky!" (lainaus, fi/en tulkinta). (2) "C-duuri ei kuulu h-molliin. Partituurissa se on forte." / "C major doesn't belong in B minor. It's marked forte." Lähde: käyttäjä ja partituuri, kirjallisuus ei nimeä kohtaa (`tapiola_tutkimus.md` luku 3). (3) "Sibeliuksen kerrotaan kuulleen C-duurin punaisena." / "Sibelius is said to have heard C major as red." **[tarkista]**: toissijainen, heikko lähde (`visuaalinen_tyyli.md` luku 3); käyttäjän valinta, että punainen kuuluu juuri tähän, on kuvallinen päätös, ei Sibeliusta koskeva väite. Jos ei varmisteta, jätä (3) pois.
- **Pystykuva.** Aurinko ja valkoinen pystyleikkaus ovat keskellä (ruudut 681 s ja 686 s); **keskirajaus toimii.** Pystyvaakapalkki (harmaa) jää rajaukseen ja näkyy leveänä, tarkista.
- **Ohjaa.** 11:20 "Väärä aurinko" / 11:25 "Kirjain M".

### S7. "Myrsky näkyy ensin kaukana" (myrskyn tulo)
- **Koukku.** Ensimmäinen ruutu: horisontti, lähes hiljainen (ruutu 860 s). Teksti: "Ensin se vain näkyy." / "First you only see it."
- **Rajat.** Alku `myrsky_nakyy` (857,1 s), loppu `Q_koko_metsa` (890,5 s); 33,4 s. Sisältää aksentin (`myrsky_aksentti_537`) ja iskun (`myrsky_iskee`).
- **Tekstit.** (1) Käyttäjän partituurihavainto: "ppp tahdissa 523 ja suurenee nopeasti, niinkuin kaukaa tuleva lumi ja jää. Aluksi se vain näkyy, ja iskee sitten päälle kuin myrsky." (2) "Pelkät jouset. Vasket tulevat vasta myöhemmin." / "Strings only. The brass comes later." Lähde: partituuri t. 540, kuunteluopas (Q = t. 550). (3) "Pyörre: pintakerros." (käyttäjä: "Sen pitäisi olla pintakerros, ja jotain syvempää näkyä taustalla?"). Älä väitä, että Sibelius tarkoitti myrskyä: esipuheessa ei ole myrskyä (`tapiola_tutkimus.md` luku 2); merkitse "tulkinta".
- **Pystykuva.** Lumi ja pyörre täyttävät ruudun; **keskirajaus toimii** (860 s horisontti kapenee, mutta jää luettavaksi).
- **Ohjaa.** 14:05 "Toinen hiljaisuus" ja 14:33 "Talvimyrsky".

### S8. "Revontulen aalto" (muusikko osoittaa mittauksesta)
- **Koukku.** Ensimmäinen ruutu: revontuli vaaran yllä (ruutu 995 s). Teksti: "Tämä aalto on yksi melodia." / "This wave is one melody."
- **Rajat.** Alku `S_sempre_mf` (981,0 s), loppu `loppuhuipennus` (1012,7 s); 31,7 s. Miksi: ainoa kohta, jossa revontulia liikutetaan musiikilla ("Ja vain siinä kohtaa", "Ei koko ajan").
- **Tekstit.** (1) "Kone kuuli paisutuksen. Muusikko kuuli melodian." / "The machine heard a swell. The musician heard a melody." Lähde: käyttäjä: "Aah tämä ei ollut paisutus, vaan melodia menee ylös alas ylinousevalla skaalalla" ja "Eli tuo c - d - e - fis linja". (2) "Kone mittasi. Ihminen korjasi." / "The machine measured. The human corrected." (3) "AH. Tuo revontuli on kuin kirsikka kakun päällä." (lainaus).
- **Pystykuva.** Revontuli ja kajo ovat koko taivaan leveä; vaaran ikkunat ovat oikealla (x noin 0,6). **Suositus: pystyrender**, jossa revontuli kaartuu pystyssä; keskirajaus katkaisisi kaaren.
- **Ohjaa.** 16:21 "Kirjain S ja revontuli".

### S9 (varalla, julkaistaan viimeisenä). "Sibeliuksen viimeinen suuri orkesteriteos" (H-duuri)
- **Koukku.** Ensimmäinen ruutu: kajo, lämmin vaalea (ruutu 1030 s). Teksti: "Sen jälkeen hän ei julkaissut enää suurta orkesteriteosta." / "After this, no more major orchestral works."
- **Rajat.** Alku `loppu_Hduuri_alku` (1024,7 s), loppu `musiikki_loppuu` (1051,6 s) + 4 s hiljaisuutta; 31 s. Käyttäjä: "Se H-duuri on mieletön, revontulineen ja viimeisenä auringon kajona." "se tuntuu enemmän sellaiselta huokaukselta, semmoiselta pehmeydeltä."
- **Tekstit.** (1) Lähde `tapiola_tutkimus.md` luku 1: "viimeinen suuri orkesteriteos; sen jälkeen noin 30 vuoden 'Ainolan hiljaisuus'". Tarkista "30 vuotta" [tarkista Tawaststjerna/Salmenhaara]. (2) "Kolmas hiljaisuus." / "The third silence." (3) "Tästä se loppui. Hellästi." Ei väitä muuta kuin että teos on viimeinen suuri.
- **Pystykuva.** Kajo-ruutu (1030 s) leveä; vaaran ikkunat oikealla; **suositus: pystyrender** (kasvit ja usva alareunassa, taivas ylhäällä).
- **Ohjaa.** 17:04 "H-duuri".

### Tilannekuva

| Short | Ankkurit | Kesto | Pystykuva |
|---|---|---|---|
| S1 siemen | avaus_patarumpu -> tuulenpuuska | 37,7 s | renderöi |
| S2 askeleet | askeleet_alkavat -> askeleet_B | 43 s | rajaus |
| S3 kamera on Tapio | vaskipulssit -> hajoaa_hiljaisuuteen | 26 s | renderöi tai pois |
| S4 valot lähestyvät | hajoaa_hiljaisuuteen -> jousijakso_urkupiste_E_alku | 34 s | renderöi |
| S5 Tapion pöytä | hitaat_soinnut -> altot_mezza | 50 s | rajaus |
| S6 väärä toivo | c_duuri_valahdykset -> M_ennakko (+3 s) | 46 s | rajaus |
| S7 myrsky | myrsky_nakyy -> Q_koko_metsa | 33,4 s | rajaus |
| S8 revontuli | S_sempre_mf -> loppuhuipennus | 31,7 s | renderöi |
| S9 H-duuri (varalla) | loppu_Hduuri_alku -> musiikki_loppuu (+4 s) | 31 s | renderöi |

Muita aiheita (ei valittu): "Viisi iskua" (10:26 ja 15:10, sama fraasi: ankkurit `trumpetit_patarummut_356` ja `vasket_takovat_viimeinen`; käyttäjä: "VIISI ISKUA: 1234+ viides aksentoitu"): hyvä, mutta kaksi eri kohtaa vaatisi leikkauksen, ja kumpikaan yksin on alle 20 s; ehdotus S6:n sisään tai kappalemerkkeihin. "Taika löytyi näytönohjaimesta" (välke): hyvä tarina, mutta vain making-of-videoon (kuvana ei ole mitään näytettävää).

---

## 4. "Miten kone oppi tulkitsemaan Sibeliusta" (making-of-prologi tai oma lyhyt video, 75 s)

Rehellinen tarina. Kone ei oppinut ymmärtämään; kone oppi mittaamaan, ja muusikko opetti sille, mitä mittaus tarkoittaa. Kolme käännekohtaa:

**1. Kone piirsi omaa kielioppiaan, ei Sibeliusta (9.11.).** Vedos 3: "hahahaha mitä ihmettä olet kokkaillut nyt? ... mitä ihmeen kumikuusia olet keksinyt ... Eikö mikään kriitikko huomauttanut tästä?" ja "METSÄ EI EDELLEENKÄÄN OLE RIVI PUITA." Kone oli kirjoittanut itse oman tyyliohjeensa lukuun ja julistanut sen voittajaksi. Korjaus: "LUE AINA ENSIN VISUALINEN TYYLI, ja sitten vasta teet päätökset", ja käyttäjän sanat kirjattiin sitovaksi tyyliohjeeksi (`visuaalinen_tyyli.md` luku 4d).

**2. Kone mittasi, muusikko kuuli (1.-13.11.).** Alun tehtävä: "Tee sellaiset analyysityökalut että KUULET NÄMÄ ASIAT niin ei tarvitse arvailla." Kone kirjoitti "käyrätorvet vastaavat", muusikko: "NE KUULUVAT SIELLÄ TAUSTALLA SOITTAEN GIS-ääntä KOKO AJAN." Mittaus vahvisti: gis soi katkeamatta 8,7-17,8 s ja jousten sävelet lakkaavat 12,0-12,9 s (palautelista 23). Myöhemmin: "Partituuri ei ole luotettava lähde, koska jokainen tahti kestää vähän eri ajan, riippuen temposta ... parempi olisi jos pystyt tarkemmin vaikka katsomaan millä kaistalla se ääni on". Ja revontuli: kone näki paisutuksen, muusikko: "tuo c - d - e - fis linja"; lopputulos: "Tuo revontuli on kuin kirsikka kakun päällä." Ajat: "Annan ajat aina suurin piirtein. SINUN TEHTÄVÄ ON KUULLA NE OIKEIN!!!!"

**3. Jokaisella kuvalla on yksi ääni ja yksi ankkuri (13.11.).** "SIIS JOKAISELLA ASIALLA PITÄÄ OLLA ANKKURI tai CUE mihin ne liitetään." ja "yksi asia videossa edustaa yhtä asiaa äänessä ... askeleet ei voi olla ne sykähtävät valot ja lumet." Ja mikä jäi auki: näytönohjain piirsi saman ruudun kahdella tavalla, ja valo paljasti sen; "Harmi että et pystynyt ratkaisemaan välkettä" (Opit 13.11.: nopea tapa varmistaa ruudut on auki). **[tarkista]** onko tilanne muuttunut vedoksen 8 jälkeen.

### Käsikirjoitus (75 s, käyttäjän oma ääni, englanniksi; suomi tekstinä)

| Aika | Kuva | Teksti / ääni |
|---|---|---|
| 0-8 s | Valmis ruutu: revontuli (995 s), ei ääntä | "Kone ei kuule. Sille rakennettiin korvat." / "A machine cannot hear. So we built it ears." |
| 8-22 s | Vedos 3, kumikuuset (rajattu, hetken) | "Ensin se piirsi omia sääntöjään. Muusikko nauroi: 'mitä ihmeen kumikuusia olet keksinyt'." |
| 22-40 s | Spektrogrammi, gis-viiva (0:08-0:17) | "Se mittasi: gis soi koko ajan. Muusikko korjasi: käyrätorvet eivät vastaa, ne ovat jousten alla." |
| 40-55 s | Revontuli, melodia c-d-e-fis | "Kone kuuli paisutuksen. Muusikko kuuli melodian." |
| 55-68 s | Kuva ja ankkuri vierekkäin | "Jokaisella valolla on yksi ääni ja yksi ankkuri." |
| 68-75 s | Pimeä; "Tapiola, 18 min" | "Se ei ymmärrä Sibeliusta. Se mittaa, ja muusikko kuuntelee." |

Rajoite: vedos 3 on aiempi hylätty vedos; käytä vain, jos materiaali on tallessa [tarkista `runs/vedos_v3/`]. Ei väitetä tekoälyn kuulleen.

---

## 5. Kuvaus, kappalemerkit, tunnisteet

**Tekstitykset:** `runs/tekstitys_v1/` (fi, en); ladataan YouTube Studiossa; en kirjoita niitä. Kuvaus mainitsee ne.

### Kuvaus (fi)
> Jokainen ruutu on koodin laskema. Sibeliuksen Tapiola (1926) 18 minuutin matkana kuusimetsän sisään: valot, lumi ja tuulenpuuskat on sidottu siihen, mitä kuulet. Laita tekstitys päälle, niin se kertoo myös mitä soi.
>
> Kone mittasi, orkesterimuusikko kuuli ja korjasi. Ei generoituja kuvia: jokainen ruutu on laskettu koodilla, jonka kirjoitti tekoälyavustaja (Claude Code) ohjaajan (minun) alaisuudessa.
>
> Kappalemerkit alla. Musiikki: Jean Sibelius, Tapiola op. 112. Esitys: [oma äänitys, esittäjät]. Kuva ja ohjaus: [nimi]. Menetelmä ja koodi: github.com/leothas-dotcom/sibelius-tapiola.
> Tekstitykset: fi, en.
> #Sibelius #Tapiola #CreativeCoding #GenerativeArt #ClassicalMusic

### Description (en)
> Every frame is computed by code. Sibelius's Tapiola (1926) as an 18-minute journey into a Finnish forest: the lights, snow and gusts are tied to what you hear. Turn on captions: they tell you what is playing.
>
> A machine measured the sound; an orchestral musician listened and corrected it. No generated images: every frame is computed by code written by an AI assistant (Claude Code) under my direction.
>
> Chapters below. Music: Jean Sibelius, Tapiola op. 112. Performance: [own recording]. Image and direction: [name]. Method and code: github.com/leothas-dotcom/sibelius-tapiola. Captions: Finnish, English.

**Tarkista ennen julkaisua:** repon näkyvyys (jos yksityinen, poista rivi); oikeudet (luku 6, "Riskit").

### Kappalemerkit (ankkuri, Rattlen aika vain avuksi)

| Merkki (fi / en) | Ankkuri | Rattle |
|---|---|---|
| Hiljaisuus ja patarumpu / Silence and the timpani | (0:00; `avaus_patarumpu`) | 0:00 |
| Siemen ja horisontti / The seed and the horizon | `gis_pitka_aani_alku` | 0:08 |
| Vaskien isku, tuulenpuuska / Brass strike, gust | `vaskien_isku` | 0:45 |
| Ensimmäinen hiljaisuus / First silence | `hiljaisuus_1_alku` | 0:58 |
| Tapion askeleet / Tapio's steps | `askeleet_alkavat` | 1:26 |
| Nousu / The ascent | `urkupiste_H1_alku` | 2:56 |
| Kirjain C: pohja katoaa / Letter C | `ylarekisteri_heraa` | 3:23 |
| Nymfit leikkivät / Wood-sprites at play | `puhaltimet_staccato` | 3:51 |
| Peikot jäällä / Trolls on the ice | `peikot_G_alku` | 5:48 |
| Taite: ratsastus ja Tapion paino / Turn | `I_ratsastus` | 6:49 |
| Metsä harvenee, kaksi huilua / The forest thins | `hajoaa_hiljaisuuteen` | 7:42 |
| Sellot laulavat, Tapion sali / Cellos, Tapio's hall | `jousijakso_urkupiste_E_alku` | 8:16 |
| Hiljainen jakso / Quiet passage | `hiljainen_jakso_alku` | 9:57 |
| Viisi iskua / Five strikes | `trumpetit_patarummut_356` | 10:26 |
| Väärä aurinko (C-duuri) / The false sun | `auringonsade` | 11:20 |
| Kirjain M / Letter M | `M_ennakko` | 11:25 |
| Jännitteinen jakso / Tension | `jannitejakso_alku` | 11:51 |
| Vaskien hengitys / Brass breathing | `allegro_moderato_O_alku` | 12:36 |
| Vaskien paisunta ja taite / Brass swell and turn | `P_vaskipaisunta` | 13:26 |
| Toinen hiljaisuus / Second silence | `hiljaisuus_2_alku` | 14:05 |
| Talvimyrsky / Winter storm | `myrsky_iskee` | 14:33 |
| Huuto / The cry | `huuto` | 15:45 |
| Revontulen aalto, kirjain S / The wave, letter S | `S_sempre_mf` | 16:21 |
| H-duuri / B major | `loppu_Hduuri_alku` | 17:04 |
| Kolmas hiljaisuus / Third silence | `musiikki_loppuu` | 17:31 |

Omalla äänityksellä kappalemerkkien ajat generoidaan ankkureista (`make_cues.py`), ei käsin. Yksittäinen merkki vähintään 10 s: tarkista [tarkista] ettei yksikään ole sitä lyhyempi.

### Kiinnitetty kommentti
> Laita tekstitys päälle (CC): se kertoo mitä soi ja mitä näet. Kappalemerkeistä pääset suoraan hiljaisuuksiin, väärään aurinkoon (11:20), myrskyyn (14:33) ja H-duuriin (17:04). Kone mittasi, muusikko kuuli ja korjasi: tarina Shortsissa ja [making-of-linkki]. Mikä hetki jäi mieleen?

### Tunnisteet
Sibelius, Tapiola, Sibelius Tapiola op. 112, sävelruno, tone poem, symphonic poem, classical music visualization, generative art, creative coding, Finnish forest, Kalevala, Tapio, winter storm, orchestral music, kuunteluopas. Kuvauksen otsikon ja ensimmäisten rivien hakusanat ovat tärkeämpiä kuin tunnisteet [tarkista].

---

## 6. Julkaisujärjestys ja jakelu

**Edellytys:** oma äänitys ja sille ajettu analyysi (`ajat_<oma>.json`), uusi pitkä renderi, pystyrenderit (S1, S3?, S4, S8, S9) ja avauskortti. Siihen asti mikään ei lähde ulos; Rattlen kuva+ääni -versio ei mene YouTubeen.

**Järjestys (ehdotus).**
1. **Päivä 0:** pitkä video + kiinnitetty kommentti + S1 (siemen) samana päivänä. Syy: Shorts-syöte tavoittaa uusia katsojia, joiden pitää voida siirtyä pitkään videoon; Heldenleben-oppi: pitkä video ei leviä yksin.
2. **Päivät 2-16:** yksi Short joka 2. päivä: S6 (väärä toivo), S2, S7, S5, S8, S4, S3, S9 viimeisenä. Perusteet: ensin hetki, jonka kuka tahansa ymmärtää (väärä toivo, myrsky), sitten tarina (askeleet, revontuli), viimeisenä H-duuri, koska se on huipentuma, ja pitkä video lunastaa sen.
3. **Päivä 8-10:** making-of-video (4) julkaistaan; kiinnitetty kommentti päivitetään.
4. Soittolista: pitkä video, Shortsit, making-of.
Vaihtoehto (käyttäjä päättää): kaksi Shortsia ennen pitkää videota, jotta kanava on jo "elossa". En suosittele: Shortsin kohde puuttuu.

**Yhteisöt (jokaiselle oma ensimmäinen lause).**
- Klassinen musiikki: r/classicalmusic (tarkista itsemainostussäännöt [tarkista]); lause: "Sibeliuksen Tapiola, jossa jokainen valo on sidottu johonkin, minkä kuulet." Suomi: Sibelius-Seura [tarkista nimi ja kanavat], Rondo, Yle Klassinen (Heldenleben-suunnitelmasta).
- Orkesterimuusikot: lause: "Muusikko kuuli, kone mittasi: mitä tapahtuu, kun spektrogrammi ja korva eroavat?"
- Luova koodaus: r/creativecoding, r/generative, Hacker News (Show HN, jos repo julkinen); lause: "Rakensin koneelle korvat ja annoin muusikon korjata."
- Suomalaiset: Facebook-ryhmät Sibeliuksesta ja suomalaisesta luonnosta [tarkista nimet]; lause: "Suomalainen metsä, jossa ei ole teräviä vuoria."

**Ensimmäisen viikon mittarit** (kirjataan `runs/julkaisu_v1/mittarit.md` -tiedostoon, ei vielä olemassa): (1) thumbnailin CTR (4-8 % hyvä, Heldenleben-oppi), (2) keskimääräinen katseluprosentti ja pitoprosentti kohdissa 0:30, 1:00, 5:00, 11:20 (väärä aurinko) ja 14:33 (myrsky), (3) Shortsien "katsottu vs. selattu pois" ja siirtymät pitkään videoon, (4) kommenttien aiheet (mikä hetki mainitaan), (5) tekstitysten käyttö (Studio ei näytä; kommenteista), (6) liikenteen lähteet: haku vs. Shorts vs. ulkoiset linkit.

**Riskit.** Rattlen ääni vain työhön. Sävellys on EU:ssa suojattu 31.12.2027 asti (Sibelius kuoli 1957; `tapiola_tutkimus.md` luku 1 mainitsee painoksen suojan 1.1.2028 asti) **[tarkista]**: omakin äänitys voi saada Content ID -vaateen kustantajan puolelta; YouTuben ja yhteisöjen (Teosto) lisenssit eivät välttämättä kata kaikkea. Tarkista ennen latausta. Tekoälymerkintä: käytä YouTube Studion "altered or synthetic content" -asetusta vain jos kuva voisi näyttää todelliselta kuvamateriaalilta; tämä on tyylitelty ja koodilla laskettu, mutta kuvauksessa kerrotaan koodin tekijä (ks. alla; kolmannen osapuolen lähteet).

---

## 7. Avoimet päätökset käyttäjälle

1. **Avauskortti hiljaisuuteen (7,7 s):** poltettu teksti 0-7 s ("Jokainen ruutu on koodin laskema. Kuuntele valoja."). **Suositus: kyllä**, koska SRT on oletuksena pois ja ensimmäinen puoli minuuttia on rauhallinen. Vaatii pienen uuden renderin ja poikkeaa säännöstä "tekstejä ei polteta" (säännön koskee tekstityksiä, ei otsikkokorttia).
2. **Pystyrenderit vai rajaus:** renderöi S1, S4, S8, S9 pystyyn (kuva leveä), rajaa S2, S5, S6, S7; S3 vasta, kun nyökkäys on testattu pystyssä. **Suositus: kyllä.** Tapiolan renderityökalun pystytuki [tarkista] ei ole todennettu.
3. **Spektrogrammi Shortsissa (S4):** näytetäänkö koneen mittauskuva ruudun alaosassa? Tyyli kieltää tekstin ja esineet kuvasta, mutta Short on julkaisupaketti. **Suositus: kyllä, vain S4:ssä ja making-ofissa**, ei muissa.
4. **Tekoälyn osuus sanoin:** "ei generoituja kuvia, jokainen ruutu laskettu koodilla, jonka kirjoitti Claude Code ohjaajan alaisuudessa". **Suositus:** kerro kuvauksessa; "no AI" -väite otsikossa tai thumbnailissa on virheellinen.
5. **Making-of ensimmäisenä vai viimeisenä:** julkaistaanko 75 s tarina Shorts-ketjun keskellä (päivä 8) vai jo päivänä 0 pitkän videon yhteyteen? **Suositus: päivä 8**, jotta katsoja on jo nähnyt, mitä "kone kuuli".

---

## Mitä en pystynyt varmistamaan

- **YouTuben viralliset ohjeet.** Haku (13.11.2026, ei YouTuben omia sivuja): Shorts voi olla 3 min asti (voimassa 15.10.2024 alkaen), 9:16 on turvallisin; AI-merkintä koskee realistista synteettistä sisältöä; toukokuun 2026 tiukennus (automaattinen merkintä) kolmansien osapuolten raportoimana (esim. air.io, techwyse.com, kapwing.com, postfa.st). **[tarkista]** YouTuben ohjekeskuksesta.
- **Omalla äänityksellä ankkurien ajat.** Kaikki ajat Rattlea; en tarkistanut, mitkä ankkurit ovat `vahvistettu` ja mitkä vain `analyysi` (`cues.json`); esim. `c_duuri_valahdykset` ja `vaskipulssit` ovat analyysia.
- **Liike.** Katsoin vain valitut ruudut (0-1070 s, 41 kpl), en videota liikkeessä; kameran nyökkäys (S3), lumen liike ja välke eivät näy ruuduista.
- **Vedoksen 8 lopullinen tila** (välke, Tapion sali) ja onko `runs/vedos_v3/` tallessa making-of-kuvaksi.
- **Renderityökalun pystytuki** ja pystykuvan sommittelu: arviot ovat ruuduista, ei kokeesta.
- **Tekijänoikeus:** sävellyksen suoja EU:ssa ja Content ID -käytäntö omalle äänitykselle.
- **Faktat:** "noin 30 vuoden hiljaisuus" ja Sibeliuksen sitaatti "Täällä Ainolassa hiljaisuus puhuu" (1948) ovat `tapiola_tutkimus.md`:ssä lähteettä tarkistetusti; C-duuri punaisena on heikko lähde.
- **Yhteisöjen säännöt** (r/classicalmusic, Sibelius-Seura, Facebook-ryhmien nimet) ja Hacker Newsin repo-edellytys.
- **Tekstitykset:** `runs/tekstitys_v1/tekstit.json` ei vielä olemassa tätä kirjoittaessa; kappalemerkit ja Shortsien tekstit on silti kirjoitettu ankkureista, joten ne eivät riipu siitä.
