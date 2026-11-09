# Kuvakäsikirjoitus: Tapiola

*Versio 2.2, 9.11.2026 (2.2: ikisalo, huurre ja kulut kuvattu kolmannen kriitikkokierroksen jälkeisen toteutuksen mukaan; 2.1: kolmen kriitikon huomiot käsikirjoituksen epäselvistä riveistä korjattu). Kirjoitettu kokonaan uudestaan koepätkän palautteen jälkeen (käyttäjä: "kuvakäsikirjoitusta ei

> **HYLÄTTY 9.11.2026 (käyttäjän palaute vedoksesta 3).** Tämä versio kirjoitettiin tyyliohjeen hylätyn luvun 4c
> varaan: jokainen kuvatapa on saman kerrosmaiseman rajaus ja jousten äänet kasvattavat kuusiryhmiä. Se ei ole
> "maailmoja maailmojen sisällä", eikä siinä ole erillisiä kohtauksia. Käsikirjoitus kirjoitetaan uudestaan tyyliohjeen
> lukujen 1, 2, 5 ja 4d pohjalta. Ankkurit ja "Kuuluu"-rivit pätevät; "Näkyy"-rivit eivät.
ole toteutettu kuunteluoppaan mukaan"; "kunnes kuunteluoppaan KAIKKI asiat on visualisoitu VISUAALISEN TYYLIN mukaan";
"selkeys voittaa aina"). Luvun 5 otot on koottu kuunteluoppaan jokaisesta rivistä: nimetyt kohdat ja koneen kuulemat
rivit, yhteensä 153 riviä. Noudattaa tyyliohjetta (`docs/visuaalinen_tyyli.md` v1.5): jos tämä ja tyyliohje ovat
ristiriidassa, tyyliohje voittaa, ja sen luku 4c voittaa vanhemmat luvut. Ajat ottojen otsikoissa ovat generoituja
(`analysis/make_cues.py`, levytys Rattle 2022) ja vaihtuvat, kun levytys vaihtuu. Muualla ei ole aikoja.*

## Uusi runko (luonnos 9.11.2026, ohjaajan ehdotus, käyttäjä ei ole hyväksynyt)

Peruste: tyyliohjeen luvut 1, 2, 5 ja 4d sekä `docs/tutkimus/taide1920.md` luku 7. Ankkurit ovat samat kuin alla.
Tämä on runko: maailmat, kamera ja loppu. Otot kirjoitetaan vasta, kun käyttäjä on nähnyt alkupätkän.

### Kamera: viisi periaatetta

1. **Yksi suunta, yksi katoamispiste.** Kamera kulkee suoraan eteen eikä käänny, peruuta tai palaa (tyyliohje 2.3).
   Määränpää on aina kuvan keskellä usvan takana: lähellä oleva näkyy, kaukana oleva vasta aavistuu (Norštein:
   sumussa näkyy vain se, mikä on lähellä; Tōhaku: puut häipyvät maalaamattomaan). Vääjäämättömyys on sitä, että
   katsoja näkee, minne ollaan menossa, mutta ei sitä, mitä siellä on.
2. **Tasainen vauhti, joka ei reagoi.** Vauhti muuttuu vain musiikin suurissa käänteissä (tyyliohje 5), ei iskuissa.
   Kun vasket repäisevät valon metsään tai myrsky tulee päälle, kamera jatkaa samaa vauhtia. Se, ettei mikään
   pysäytä liikettä, on vääjäämättömyys; se, ettei kamera säpsähdä, on arvokkuus.
3. **Korkeus ja kallistus kantavat merkityksen.** Silmänkorkeus: ihminen metsässä. Matalalle lumen pintaan, kun
   paino tulee (basson askeleet). Hitaasti ylös runkoja pitkin nousussa (O'Keeffe: katse rungon alta ylös). Latvojen
   yläpuolelle vain kerran, huudossa, ja sieltä näkyy koko metsä vaaroina horisonttiin (Järnefelt Kolilta).
4. **Uusi maailma avautuu katoamispisteestä.** Kamera ei käänny ovelle: ovi on suoraan edessä. Se, mitä kohti on
   kuljettu (valo, rungon pinta, huurteen kide, jään pinta, pimeä runkojen välissä), kasvaa, täyttää kuvan ja on
   uusi maailma. Sama eteenpäin kulkeva liike jatkuu sen sisällä.
5. **Kunnioitus on pidättyvyyttä.** Vaakasuora horisontti, ei tärinää, ei nopeita liikkeitä, pitkät katkeamattomat
   otot. Olentoja ei jahdata eikä lähestytä: ne ovat usvan rajalla ja jäävät sinne.

### Kaksitoista maailmaa (suunnitelma 9.11.2026, taustatutkimuksesta; ohjaajan ehdotus, käyttäjä ei ole hyväksynyt)

Käyttäjä: "Sinun piti tehdä 12 maailmaa." ... "Tämä ei ole valmis, ennen kuin olet oikeasti suunnitellut ne visualisaatiot.
TAUSTATUTKIMUKSEN MUKAAN" ... "JOSKUS VOI OLLA YKSITTÄISIÄ PUITAKIN. MUTTA NIIDEN PITÄÄ OLLA HARKITTUJA. MITÄ TARINAA NE
KERTOO????"

Jokaisessa maailmassa: **Lähde** (`docs/tapiola_tutkimus.md`, luvut 2, 4, 5, 8 ja 11), **Kuva**, **Ääni ohjaa** (mitatut
signaalit: `annotations/cues.json`), **Kamera**, **Puu** (harkittu yksittäinen puu ja sen tarina) ja **Siemen** (miten jousten
motiivin ele näkyy tässä maailmassa). Metsä on aina massa kerroksittain (tyyliohje 4d.9); yksittäisiä puita on vain siellä,
missä ne alla nimetään.

**Kolme kaarta koko teoksen läpi.**
- **Siemen.** Jousten motiivi on tumma aalto, joka kulkee metsän massan läpi kaukaa lähelle. Se on sama ele joka kerta ja
  kehittyy: alussa yksi aalto (1), sitten aallot painon kanssa (3), hitaat syvät aallot (7), hermostunut värinä (9),
  myrsky, jossa aalto on kasvanut koko tilaksi (10; Tovey: koko teos on yksi crescendo), ja lopussa valo, joka kulkee
  saman reitin kuin aalto (12).
- **Tapio.** Kaukaisin vaara on Tapion talo (K14: "Tapion talot näkyivät, ukset kulta kuumottivat poikki suosta"). Se
  näkyy kaukana hopeisin ikkunoin (1), kulkee edellä näkymättä (3), on talo, jonka sisällä ollaan (7), lupaa väärää valoa
  (8) ja näkyy lopussa kokonaisena ylhäältä (12). Ei kasvoja: mittakaava ja valo.
- **Revontulet.** Puhaltimien ja ylärekisterin valo (SKVR XII2 7950: "kähähtelivät, kähisivät", tulevat alas lumelle):
  heikot (1), leimahtavat ja laskeutuvat lumelle iskussa (2), taittuvat kiteen läpi (5), peilautuvat jäässä (6), poissa
  salissa (7), punaisen auringon syrjäyttämät (8), poissa pimeässä (9), myrskyn repimät viirut (10), kaari muodostuu
  uudestaan (11), tyyni kaari (12). Sävy kylmä vihertävä halla.

#### 1 Horisontti ja siemen · `tiedoston_alku` → `patarumpu_paisuu`
- **Lähde:** esipuhe "sankat, tummat ikisalat"; K14 Tapion talot kaukana, perille ei pääse; Judd: patarummut ovat kutsu;
  Goodwin ja oma kuuntelu: käyrätorvien gis on tausta, joka paljastuu, kun jouset lakkaavat; SKVR III1 1231 "alta harva,
  päältä tiheä, keskeltä läpinäkyvä"; Jalas: puupuhaltimissa "metsänpeikot ja -eläimet ilmestyvät".
- **Kuva:** tumma suo lumen alla, kaukana laaja metsän massa kerroksittain usvaan, sen takana vaara, joka on Tapion talo.
  Gis on horisontin valo, joka muodostaa mäkiä hitaasti yläsävelten voimasta (käyttäjä). Kun jouset lakkaavat, metsä
  väistyy usvaan ja horisontin valo kirkastuu: paljastuminen. Käyrätorvien soidessa vaaran rinteessä kuumottaa hopeisia
  ikkunoita. Puupuhaltimet (0:25) sytyttävät revontulet heikkoina ja väikkeen metsän latvustoon.
- **Ääni ohjaa:** gis-kaista → horisontin valo; yläsävelet → mäet (3 s); jousten rekisteri 50–79 → metsän tummuus ja
  latvuston aalto; matalan kaistan alut → valo lumen pinnassa (patarumpu); puupuhaltimet 72–100 → revontulet.
- **Kamera:** silmänkorkeus, suoraan kohti metsää, hitain vauhti. Maa on tasainen suo kameran alla.
- **Puu:** **pilkkapuu**, yksi kuusi suolla, joka ohitetaan 0:20–0:35. K14: "veistä pilkut pitkin maita, rastit vaaroihin".
  Se on tien ensimmäinen merkki: joku on kulkenut tästä ennen. Sama puu on viimeinen puu (12).
- **Siemen:** yksi tumma aalto metsän läpi, kun jouset tulevat (0:08), toinen 0:20.

#### 2 Repeämä · `vaskien_isku` → `hiljaisuus_1_loppu`
- **Lähde:** K47 kipinä "läpi taivahan yheksän", "taivas reikihin repesi"; Ukko iskee tulta kolmannessa kerroksessa
  (SKVR II 699); Damrosch: jäiset tuulet; Knussen: lumi; Sibelius: "iskevyys ei ole Tapiolalle vierasta"; metsänpeitto
  (SKVR VI2 5391): äänet vaimenevat, polku päättyy.
- **Kuva:** pystysuora valo repeää kaikkien kerrosten läpi syvällä metsässä; revontulet leimahtavat ja laskeutuvat lumelle;
  puuska tuo lumen vastaan ja latvuston aalto kulkee koko massan yli. Gis päättyy: horisontin valo sammuu hitaasti.
  Hiljaisuus on metsänpeitto: kaikki äänen elementit lakkaavat, lumi jää ilmaan, metsä seisoo, kamera jatkaa.
- **Ääni ohjaa:** `vaskien_isku` → leikkaus iskun ruudussa; `tuulenpuuska` → lumen ja latvuston aalto; `hiljaisuus_1` →
  putoaminen hidastuu, revontulet sammuvat.
- **Kamera:** sama vauhti, ei säpsähdä. **Puu:** ei. **Siemen:** aalto kasvaa puuskaksi: ensimmäinen kerta, kun ele on
  suurempi kuin jouset.

#### 3 Jokin kulkee edellä · `fis_pitka_aani` → `askeleet_B` loppuun (`urkupiste_H1_alku`)
- **Lähde:** Madetoja 1927: yksinäinen vaeltaja; käyttäjä: matalat äänet "Tapion jättiläisen askeleita"; metsänpeitto
  "vaikka kulkisit aivan eläimen ohitse, niin et sitä näe"; Europadisc: laskevat urkupisteet; Inkpot: "humisevat kuin
  maapallon pyöriminen"; K14 pilkut ja rastit.
- **Kuva:** kamera ajaa metsän reunan läpi: ensimmäinen maailma avautuu toisen sisälle. Sisällä metsä on tummaa massaa,
  jonka välissä kulkee usvaa; valo tulee vain horisontin kajosta runkojen välistä. Basson askeleet ovat painoa, joka
  siirtyy maassa edellä: lumen pinnan valo ja usvan väistyminen, ei jalkaa. Jousten sointumatto hengittää metsän
  tummuutena. Pilkat syttyvät ohitettaviin runkoihin askelten tahdissa: jättiläisen jälki.
- **Ääni ohjaa:** fis-kaista → horisontin valo (eri sävel, hieman alempi); matalan kaistan alut → askel (valo maassa ja
  pilkka rungossa); jouset → tummuus ja hengitys; `tapahtumat` liike → usvan nopeus.
- **Kamera:** laskeutuu lumen pintaan (paino), jatkaa eteen. **Puu:** **ikihongat**, muutama valtava runko, jotka
  ohittavat kameran läheltä. Tarina: ne mittaavat kulkijan pienuuden; jokaisessa on pilkka, joka syttyy, kun askel osuu.
- **Siemen:** aallot tulevat painon kanssa: jokaista jousten paisutusta seuraa askel.

#### 4 Metsä kohoaa, maa katoaa · `urkupiste_H1_alku` → `pohja_katoaa`
- **Lähde:** de.wikipedia: noin 40 tahdin nouseva jousicrescendo; D-duuri on h-mollin rinnakkaisduuri, välähdys kelmeä
  (käyttäjä); SKVR: "kuuna paistoi kuusen oksat, päivänä petäjän latvat"; tyyliohje 7b: pohjan kadotessa maa ja juuret
  katoavat alta ja metsä leijuu; O'Keeffe: katse rungon alta ylös.
- **Kuva:** kamera kallistuu hitaasti ylös runkoja pitkin ja jatkaa eteen; nousun mukana kelmeä valo laskeutuu latvoihin
  ylhäältä; D-duurissa latvat ja huurre syttyvät hallan valoon. Kun pohja katoaa, maa jää kuvan alle ja metsä leijuu.
- **Ääni ohjaa:** jousten rekisterin nousu (keskikorkeus) → kallistus ja valon korkeus; `nousu` → valon kasvu; D-duurin
  ankkuri → hallan valo latvoissa; `pohja katoaa` → maan häipyminen.
- **Kamera:** ainoa kallistus ylös; alle 20 °/s. **Puu:** **suuri petäjä**, jonka latva saa valon ensimmäisenä: "päivänä
  petäjän latvat". Tarina: valo koskettaa ensin korkeinta ja vanhinta. **Siemen:** aalto nousee latvoihin valona.

#### 5 Väike · `e_pitka_ja_kuviot` → `peikot_G_loppu`
- **Lähde:** Jalas: puupuhallinjaksossa "metsänpeikot ja -eläimet ilmestyvät"; Europadisc: haltiat; K14 kolme linnaa
  (puinen, luinen, kivinen), kussakin kuusi kultaikkunaa: hohtavat aukot pimeässä; hiidenväki kulkee näkymättömiä polkujaan
  helinän saattelemana; Halonen: oksien verkko ja huurre, ei syvyys.
- **Kuva:** kamera ajaa huurteiseen oksistoon ja sen kiteen sisään: toinen maailma, jossa ensimmäinen toistuu pienenä
  (huurteen harjanteet ovat metsä, kiteen valo horisontti). Pilkahdukset ovat väki, joka liikkuu näkymättömiä polkuja:
  valoa, joka vaihtaa paikkaa ennen kuin katsoja ehtii katsoa. Pimeässä hohtaa kuusi pientä ikkunaa kolmessa rivissä
  (linnat), ei koskaan kaikki yhtä aikaa. Revontulet näkyvät kiteen läpi taittuneina.
- **Ääni ohjaa:** lyhyet korkeat äänet → pilkahdukset paikkoineen; `purske` → väen kulku; pitkä e → kiteen valo; staccato
  ja legato (7b) → pisteet tai säie.
- **Kamera:** kiteen sisälle, sama vauhti. **Puu:** ei; oksisto on kide. **Siemen:** aalto on pieni ja nopea, väikkeenä.

#### 6 Metsä liikkuu kokonaisena · `peikot_G_loppu` → `hajoaa_hiljaisuuteen`
- **Lähde:** Goodwin: jäiset puuskat kahisuttavat; Grimley: kahiseva, rapiseva; SKVR II 625a "Pakkanen Puhurin poika,
  kylmä soita, kylmä maita": kylmä etenee pintoja pitkin; Inkpot: urkupisteet humisevat.
- **Kuva:** kamera ajaa jään pintaan ja sen alle: metsä näkyy ylösalaisin mustassa jäässä ja liikkuu kokonaisena, yhtenä
  massana (ensimmäinen pelko). Vyöry on aalto, joka kulkee koko peilikuvan läpi. Pakkanen piirtää huurretta pintaan
  sykkeiden tahdissa. Revontulet peilautuvat jäähän.
- **Ääni ohjaa:** jousten voima → massan liike; vaskipulssit → huurteen leviäminen; `tremolo` → pinnan väre.
- **Kamera:** jään alla, katse eteen ja ylös. **Puu:** ei. **Siemen:** aalto liikuttaa koko metsää kerralla.

#### 7 Ikisalo · `jousijakso_urkupiste_E_alku` → `hiljainen_jakso_loppu`
- **Lähde:** esipuhe "ikisalat"; Hepokoski: hitaasti muuttuva pinta hitaan syväliikkeen päällä; Tovey: sama tausta
  hämmästyttävän pitkään; "sininen salo"; SKVR IX3 982 Tapion pöytä: kolme runkoa pystyyn, vaakalauta päälle, pisarat
  juurelle; karsikko; metsänpeitto hiljaisuudessa.
- **Kuva:** kolmas maailma: Tapion talo sisältä. Valtavat rungot pylväinä, kaikki sinistä, usva kerroksina, hitainta.
  Kolmen rungon välissä vaakasuora valon lauta: Tapion pöytä. H:n neljätoista sykettä (9:40) kulkevat valona pöydän
  lautaa pitkin: talon syke. Hiljaisuudessa (9:57) valo sammuu pöydältä ja usva peittää pylväät: metsänpeitto.
- **Ääni ohjaa:** matalat jouset → massan tummuus ja usvan paksuus; urkupiste → pöydän valo; matalan kaistan alut → syke
  laudalla; `hiljaisuus` → valo pois.
- **Kamera:** hitaimmillaan, matalalla, pylväiden ohi. **Puu:** **kolme ikihonkaa ja lauta**: Tapion pöytä. Tarina:
  kulkija on jumalan talossa; pöytä on paikka, johon jätetään uhri (karsikko), ja valo on talon elämä.
- **Siemen:** aallot ovat syviä ja hitaita, ja ne kulkevat pylväiden välissä usvana.

#### 8 Väärä valo · `hiljainen_jakso_loppu` → `auringonsade`
- **Lähde:** K49 taottu aurinko: kullasta ja hopeasta, nostetaan kuusen latvaan, "eipä kuu kumotakana eikä päivyt
  paistakana"; Sibeliuksen värikuulo C-duuri = punainen (käyttäjä hyväksyi); Europadisc ja Inkpot: matalat valonsäteet,
  himmeä auringonvalo.
- **Kuva:** tutti-isku (10:21) repäisee valon pylväiden läpi; sitten punainen aurinko nousee kolmesti pylväiden takaa ja jää
  (C-duuri ennen M:ää). Se ei valaise mitään: pylväät pysyvät mustina, vain usva ja ikkunat Tapion talossa punertuvat.
  Revontulet väistyvät sen tieltä. Kamera pysähtyy ensimmäisen kerran ja katsoo sitä.
- **Ääni ohjaa:** `vaski_tutti_620` → leikkaus; C-duurin ankkurit → auringon nousu; jousten voima → usvan punerrus.
- **Kamera:** nimetty pysähdys. **Puu:** sama kolme pylvästä kehystää auringon. **Siemen:** aalto pysähtyy auringon eteen.

#### 9 Petos ja hermo · `M_ennakko` → `dim_possibile`
- **Lähde:** K47 ja K49: valo houkutellaan latvaan ja suljetaan "vuorehen teräksisehen" yhdeksän oven taakse, yö "pitkä,
  pilkkoisen pimeä"; Mäkelä: kuolema ja tyhjyys; tyyliohje 2.10: ahdistus on sallittu tässä; 7b: tremolo on väre
  paikallaan, vuorottelu on kaksi paikkaa.
- **Kuva:** M: vaskien pystyvalo sulkee auringon; pimeys. Kamera lähtee uudestaan ja kiihtyy. Metsä näkyy vain vaskien
  välähdyksissä: yhdeksän ovea ovat peräkkäiset tummat kerrokset, joiden läpi ajetaan. Jousten hermo on massan värinä
  paikallaan. Vaskien vuorottelu (12:36) on kaksi valon paikkaa, jotka vastaavat toisilleen pimeässä.
- **Ääni ohjaa:** nimetyt iskut → leikkaukset; `tremolo` → värinä; `vuorottelu` → kaksi paikkaa; jousten voima → värinän
  laajuus; `liike` → kameran kiihtyvyys (hidas keskiarvo).
- **Kamera:** nopein ajo koko teoksessa. **Puu:** ei. **Siemen:** aalto on hajonnut värinäksi: idea on hermona.

#### 10 Se näkyy ja tulee · `hiljaisuus_2_alku` → `R_vasket`
- **Lähde:** myrsky on kirjallisuuden ja käyttäjän luenta, merkitään tulkinnaksi (tutkimus luku 2); Wilker: jousitremolo
  ja kromaattinen kenttä t. 523; Grimley: kahiseva, jylisevä, viheltävä; Pakkanen etenee pintoja pitkin; Knussen: lumi;
  Ukon tuli kerrosten läpi; tyyliohje 4: horisonttia ei näytetä ennen tätä.
- **Kuva:** metsä loppuu, ja kamera on ulkona jäällä: tila on ensimmäistä kertaa katsojaa suurempi. Horisontti paljastuu,
  ja kaukana metsä on matala musta reuna. Myrsky näkyy kaukana lumiseinänä ja tulee kerros kerrokselta; se iskee, kerrokset
  romahtavat yhdeksi; revontulet repeävät viiruiksi; Q:n ja R:n iskut ovat pystyvaloja myrskyn sisällä. Kamera ajaa läpi.
- **Ääni ohjaa:** jousten voima → lumen tiheys ja massan liike; `Q_koko_metsa`, `myrsky_huippu`, `R_vasket` → leikkaukset;
  matalat alut → maan valo; `tremolo` → väre.
- **Kamera:** sama suunta, myrskyn läpi. **Puu:** ei: metsä on reuna. **Siemen:** aalto on kasvanut koko tilaksi.

#### 11 Huuto ja jälki · `toinen_paisunta` → `yksinaiset_aanet`
- **Lähde:** Grimley: huuto; Goodwin: katkeamisen jättämä aavemainen tyhjä hiljaisuus; Järnefelt Kolilta: katse
  latvoista vaaroihin ja horisonttiin; tyyliohje 5: huuto on ainoa hetki, jolloin kamera nousee.
- **Kuva:** kamera nousee myrskyn läpi latvojen yläpuolelle: alla koko metsä vaaroina horisonttiin. Nouseva asteikko on
  horisontin valo, joka nousee huudon korkeuteen; revontulet muodostuvat uudestaan kaareksi. Yksittäiset äänet ovat mäkiä,
  jotka muodostuvat hitaasti horisonttiin (käyttäjän alkuperäinen gis-ajatus palaa).
- **Ääni ohjaa:** viulujen korkea ääni → horisontin valon korkeus; yksittäiset pitkät äänet → mäet (3 s); puhaltimet →
  revontulet.
- **Kamera:** nousee, ei peruuta. **Puu:** ei. **Siemen:** aalto on alla, näkyy ylhäältä metsän pintana.

#### 12 Oikea valo · `S_sempre_mf` → `tiedoston_loppu`
- **Lähde:** Tovey ja Grimley: lasku hiljaisuuteen; Inkpot: metsän "elävä puu" loppupuolella; "Soi metsä, kumisi korpi"
  (K46): ääni, joka kimpoaa takaisin; Tapion pöytä: pystysuora kohtaa vaakasuoran (tyyliohje 4); käyttäjä: "hieno
  hyväksyvä H-duuri", Sibelius tyytyväinen.
- **Kuva:** ylhäältä nähty ensimmäinen maailma palaa kokonaisena: horisontti ja hitaat mäet, metsän massa alla, Tapion
  talo kaukana tyynenä. Kamera hidastuu S:stä ja pysähtyy H-duurissa omasta tahdostaan: perille tulo. Kajo nousee
  horisontin takaa ja kulkee metsän yli kohti katsojaa saman reitin kuin siemenen aalto. Revontulet ovat tyyni kaari.
  Lumi sataa edelleen, usva liikkuu: metsä jatkuu kuvan reunojen yli. Kuva lakkaa muuttumasta vasta musiikin jälkeen.
- **Ääni ohjaa:** viulujen ääni → horisontin valo; H-duurin ankkuri → kajon nousu; basson viimeiset askeleet → valo
  maassa; `musiikki_loppuu` → kaikki äänen elementit lakkaavat, metsä ja lumi jäävät.
- **Kamera:** hidastuu ja pysähtyy (nimetty). **Puu:** **pilkkapuu** (sama kuin 1) kuvan alareunassa lähellä, yksin.
  Tarina: tien ensimmäinen merkki on sen viimeinen; kulkija jätti jäljen, ja metsä jatkuu. "Soi metsä, kumisi korpi."
- **Siemen:** aalto on valo.

**Kulut maailmasta toiseen** (tyyliohje 2.4, vähintään neljä sekuntia, mittakaava jatkuva): 1→2 ei kulkua, sama
maailma repeää; 2→3 metsän reunan massan läpi (`hiljaisuus_1_loppu`); 3→4 katse nousee (`urkupiste_H1_alku`); 4→5
huurteen kiteeseen (`nousu_huippu_D` → `pohja_katoaa`); 5→6 jään pintaan (`jannitesoinnut` → `pohja_vaihtuu_D`); 6→7
pimeään pylväiden väliin (`hajoaa_hiljaisuuteen` → `jousijakso_urkupiste_E_alku`); 7→8 sama talo, valo vaihtuu; 8→9
pimeys (`M_ennakko` → `M_raskaat_askeleet`); 9→10 metsä loppuu (`dim_possibile` → `hiljaisuus_2_alku`); 10→11 nousu
(`toinen_paisunta` → `huuto`); 11→12 sama paikka, vauhti hidastuu.

### Loppu: tähän se loppui

Käyttäjä: "Miten me kuvaamme sen että tähän se loppui? Hänen tuotantonsa. Sellaiseen hienoon hyväksyvään H-duuriin."

- **Liike, jota mikään ei pysäyttänyt, pysähtyy itse.** Kamera on kulkenut eteenpäin koko teoksen: läpi repeämän,
  pimeän ja myrskyn. S:stä alkaen se hidastuu omasta tahdostaan, ja H-duurissa se on paikallaan. Pysähdys ei ole
  este eikä uupumus vaan perille tulo. Tämä on tyyliohjeen luvun 1 toinen kerros: ihminen, jota ei näytetä, näkyy
  vain kamerassa.
- **Katsoja näkee, mistä on tultu, katsomatta taakse.** Ylhäältä näkyy sama horisontti ja samat hitaat mäet kuin
  alussa. Ensimmäinen maailma toistuu viimeisenä, nyt kokonaisena ja oikeassa valossa. Se on ura yhdellä katseella.
- **Valo on lämmin ja tulee hitaasti.** Kajo nousee horisontin takaa ja etenee metsän yli kohti katsojaa. Se ei ole
  C-duurin punainen eikä häikäise.
- **Mikään ei kuole.** Kuva ei pimene eikä häivy. Lumi sataa edelleen hiljaa ja usva liikkuu: metsä jatkuu kuvan
  reunojen yli ja ajassa eteenpäin (Tōhaku; tyyliohje luku 1: metsä on ollut ennen katsojaa ja on hänen jälkeensä).
  Vain kulkija on pysähtynyt. Kuva lakkaa muuttumasta vasta musiikin jälkeen.
- **Ei merkkejä, ei tekstiä, ei hahmoa.** Tyytyväisyys on kuvan lepo: vaakasuora, leveä, tasapainoinen, hiljainen.

## 0. Miten tätä luetaan

Kuva on ääni (tyyliohje 4c). Mitään ei ole kuvassa, ellei se soi, ja mikään, mikä soi, ei jää näkymättä. Kuva lasketaan
äänestä ruutu ruudulta: nuotit, pitkät äänet, spektri ja iskut tulevat kuuntelutyökalusta. Tämä käsikirjoitus sanoo
vain sen, mitä kone ei voi tietää: **kuka soittaa** (jouset vai puhaltimet), **mikä on teoksen pitkä ääni**, **mistä
katsoja katsoo** (kuvatapa) ja **mikä tunne kuvalla tehdään**.

**Otto** on jakso kahden ankkurin välillä. Leikkauksia ei ole: kuva on yksi matka. Jokaisessa otossa:
- **Kuuluu:** kuunteluoppaan rivi ja se, kuka soittaa.
- **Näkyy:** vastine kuvassa tyyliohjeen 4c sanoin.
- **Tunne → keino:** kuunteluoppaan tunnelma ja se, millä kuva tekee sen.
- Rivit ilman lihavointia ovat koneen kuulemia tapahtumia; nekin näkyvät.

**Kielioppi yhdellä silmäyksellä** (tyyliohje 4c): jouset ovat tumma metsä (jokainen ääni on kuusiryhmä, latva on
sävelkorkeus); teoksen pitkä ääni on horisontin viiva; paisutus on kukkula; puhaltimen ääni on harju; lyhyt korkea ääni
on pilkahdus; bassot ja patarummut ovat maa (sysäys, värinä, hohto); vaskien isku on pystysuora leikkaus; lumi kulkee
kerrosten välissä. Metsä on kuvassa aina, viidessä syvyydessä, ja se huojuu äänen liikkeestä ja kohoaa rekisterin
voimasta. Kaikki kerrostumat (maa, metsä, viiva ja valo) ovat kuvassa joka kuvatavassa.

**Neljä sanaa, jotka toistuvat otoissa:**
- **Hiljaisuus:** äänen elementit lakkaavat (ei viivaa, ei kuusiryhmiä, ei kukkuloita). Jäljelle jää metsän kaukainen
  reuna, maa ja lumi kerrosten välissä. Viiva palaa, kun ääni palaa.
- **Liikkeen tiheys** (koneen rivit liike kiihtyy, tasaantuu, hidastuu): metsä huojuu sitä enemmän ja kuusiryhmiä
  kasvaa ja väistyy sitä tiheämmin, mitä tiheämmin ääniä alkaa. Kamera ei reagoi.
- **Legato ja staccato** (koneen rivit): pitkä sidottu ääni on kuusiryhmä tai harju, joka pysyy; lyhyt irrallinen
  ääni on pilkahdus. Kumpi pitkä ääni on, tulee oton soittajasta: jousilla kuusiryhmä, puhaltimilla harju.
- **Isku** ilman soittajaa: maa saa sysäyksen ja metsä heilahtaa. Pystysuora leikkaus on vain vaskien nimetyissä
  iskuissa (`vaskien_isku`, `vaski_tutti_620`, `M_ennakko`, `P_vaskipaisunta`, `Q_koko_metsa`, `R_vasket`).

## 1. Kaari: kaksitoista hetkeä

| # | Hetki | Ankkurit | Katsoja kokee | Kuvatapa | Miten tunne tehdään kuvassa |
|---|---|---|---|---|---|
| 1 | Metsä on jo siinä | `avaus_patarumpu` – `patarumpu_paisuu` | läsnäolon: jokin on ollut täällä ennen minua | 1 Metsän idea | tumma ilma, maa ja horisontin viiva; jousten siemen kasvattaa ensimmäisen kuusikon viivan eteen ja väistyy; puhaltajat nousevat viivasta kukkuloina |
| 2 | Ensimmäinen repeämä | `vaskien_isku` – `hiljaisuus_1_loppu` | säikähdyksen ja pidätetyn hengityksen | 1 Metsän idea, repeää | pystysuora leikkaus kaikkien kerrosten läpi; tuuli taivuttaa metsän ja lumi nousee kerrosten väliin; hiljaisuudessa jää vain metsä ja lumi |
| 3 | Jokin kulkee edellä | `fis_pitka_aani` – `askeleet_B` | painon, jota ei näe, ja halun seurata | 2 Maan tasalta | katse on lumen pinnassa; maa täyttää kolmanneksen kuvasta, ja basson askeleet ovat sysäyksiä maassa |
| 4 | Metsä kohoaa, maa katoaa | `urkupiste_H1_alku` – `pohja_katoaa` | hetken valon ja sitten pohjattomuuden | 3 Ylös runkoja pitkin | katse nousee nousun mukana latvoihin; kelmeä valo on latvojen yläpuolella; maa jää kuvan alle |
| 5 | Väike | `e_pitka_ja_kuviot` – `peikot_G_loppu` | leikin, jota ei saa kiinni | 4 Lähikuva | huurteinen oksisto täyttää kuvan; pilkahdukset syttyvät sävelkorkeutensa kohdalla ja ovat poissa |
| 6 | Metsä liikkuu kokonaisena | `peikot_G_loppu` – `hajoaa_hiljaisuuteen` | ensimmäisen pelon | 5 Pinnan sisään | metsä seisoo mustan jään päällä ja näkyy siinä ylösalaisin; syke kulkee jäässä aaltona |
| 7 | Ikisalo | `jousijakso_urkupiste_E_alku` – `hiljainen_jakso_loppu` | oman pienuutensa, ajan pysähtymisen | 6 Ikisalo | matalien jousten äänet kasvattavat matalia, tummia kuusiryhmiä siniseen usvaan; urkupiste on maan hohto; kaksi tai kolme valtavaa runkoa kehystää näkymää lähellä; kaikki on hidasta |
| 8 | Väärä valo | `hiljainen_jakso_loppu` – `auringonsade` | toivon, joka on väärän värinen | 6 Ikisalo, punainen | punainen valo nousee runkojen taakse ja värjää usvan ja runkojen reunat |
| 9 | Petos ja hermo | `M_ennakko` – `dim_possibile` | ahdistuksen: liikettä ei voi pysäyttää | 7 Pimeä ja välähdys | kuva pimenee; metsä näkyy vain, kun vaskien leikkaus valaisee sen |
| 10 | Se näkyy ja tulee | `hiljaisuus_2_alku` – `R_vasket` | kauhun ja ylivoiman | 8 Ulkoa ja kaukaa, sitten 9 Tuulen sisällä | jään yli: metsä on matala reuna suuren tumman ilman alla; lumi tulee kaukaa kerros kerrokselta ja on sitten viiruina joka syvyydessä, puiden välissä |
| 11 | Huuto ja jälki | `toinen_paisunta` – `yksinaiset_aanet` | paljauden | 10 Ylhäältä | katse nousee myrskyn läpi; metsä on vaaroja kerroksina horisonttiin; yksittäiset äänet nousevat viivasta kukkuloina |
| 12 | Oikea valo | `S_sempre_mf` – `musiikki_loppuu` | hellyyden, levon, kunnioituksen | 10 Ylhäältä, pysähtyy | viulujen ääni on horisontin viiva; kajo nousee sen taakse ja usva vaarojen välissä alkaa hehkua |

## 2. Kuvatavat ja kulut

Käyttäjän idea: kamera ajaa jonkin sisään, se suurenee, ja sieltä löytyy uusi maailma. Jokainen kuvatapa on sama
kerrosmaisema nähtynä toisesta paikasta; kerrostumat ja niiden merkitys pysyvät samoina koko teoksen ajan.

| Kuvatapa | Katsojan paikka | Mitä rajaus tekee |
|---|---|---|
| 1 Metsän idea | kaukana, vaakasuoraan | horisontti keskellä kuvaa; metsä on aluksi matala reuna ja kasvaa |
| 2 Maan tasalta | lumen pinnassa | maa on kuvan alin viidennes ja kasvaa askelten lähestyessä; lähimmät kuuset jatkuvat kuvan yli; kuva liukuu hitaasti runkojen ohi |
| 3 Ylös runkoja pitkin | katse kohoaa | maa jää kuvan alle; latvat ja niiden yläpuolinen valo |
| 4 Lähikuva | oksiston vieressä | suurennos; metsä pysyy tummana, oksien yläpinnoilla on kylmä huurteen hohde ja kiteet välkkyvät; maa pysyy kuvassa |
| 5 Pinnan sisään | mustan jään yllä | kuvan alin viidennes on tumma jää, jossa metsä ja viiva näkyvät himmeinä ja väreilevinä; ei täydellinen peili |
| 6 Ikisalo | ikimetsän sisällä | sininen, usvainen metsä; lähin kerros on kaksi tai kolme valtavaa runkoa, joiden oksisto on kuvan yläpuolella; kaukainen metsä, viiva ja maa näkyvät niiden välistä |
| 7 Pimeä ja välähdys | metsän sisällä | kuva on lähes musta; valo tulee vain leikkauksesta |
| 8 Ulkoa ja kaukaa | jäällä metsän ulkopuolella | metsä on matala reuna; suuri tumma ilma ja lumen peittämä jää (ei peiliä) |
| 9 Tuulen sisällä | myrskyssä | lumi on viiruja joka syvyydessä; metsä taipuu |
| 10 Ylhäältä | latvojen yläpuolella | metsäkerrokset ovat vaaroja allekkain; horisontti on ylhäällä |

Kulut (tyyliohje 2.4 ja 8.4): jokainen kestää vähintään neljä sekuntia, rajaus muuttuu jatkuvasti koko kulun ajan, eikä
katsoja huomaa rajaa. Viidessä kulussa (4, 5, 6, 7 ja 9) kuva kulkee huurteen, usvan, pimeän tai lumen läpi: verho on
paksuimmillaan kulun keskellä, mutta metsä näkyy sen läpi koko ajan. Kulkujen ankkurit (kesto mitataan: `analysis/check_package.py`):
- Kulku 1: `fraasi_ennen_taukoa` → `hiljaisuus_1_loppu`
- Kulku 2: `urkupiste_H1_alku` → `urkupiste_H1_loppu`
- Kulku 3: `nousu_huippu_D` → `pohja_katoaa`
- Kulku 4: `jannitesoinnut` → `pohja_vaihtuu_D`
- Kulku 5: `hajoaa_hiljaisuuteen` → `jousijakso_urkupiste_E_alku`
- Kulku 6: `M_ennakko` → `M_raskaat_askeleet`
- Kulku 7: `dim_possibile` → `hiljaisuus_2_alku`
- Kulku 8: `myrsky_kasvu` → `myrsky_iskee`
- Kulku 9: `toinen_paisunta` → `huuto`

## 3. Valon ja värin kaari

| Kuvatapa | Perusväri | Valo | Ei koskaan |
|---|---|---|---|
| 1 Metsän idea | hämy, salo | horisontin viiva ja kukkulat; kylmä | yleisvaloa, lämpöä |
| 2 Maan tasalta | hämy, noki | viiva runkojen takana; D-duurissa kelmeä ja hämärä | keltaista |
| 3 Ylös | hämy | kelmeä valo latvojen yläpuolella | lämpöä |
| 4 Lähikuva | salo, halla | huurteen kiteet | maata |
| 5 Pinnan sisään | hämy, lähes noki | viiva ja sen peilikuva | suoraa valoa ylhäältä |
| 6 Ikisalo | salo | sininen usva runkojen välissä; lopussa punainen | punaista ennen `c_duuri_valahdykset` |
| 7 Pimeä | noki | vain vaskien leikkaus | punaista, lämpöä |
| 8 Ulkoa | noki, salo | hämärä horisontti | kirkasta |
| 9 Tuuli | halla, noki | lumi itse | kerrosten katoamista |
| 10 Ylhäältä | salo, lopussa kajo | viiva horisontissa; H-duurissa kajo sen takana | häivytystä mustaan |

Punainen on vain taotussa auringossa (käyttäjä hyväksyi 9.11.2026). D-duurin välähdykset ovat kelmeitä ja hämäriä
(käyttäjä 9.11.2026). Kajon väri on vain H-duurissa.

## 4. Neljä lankaa läpi koko teoksen

1. **Horisontin viiva.** Teoksen pitkä ääni: alussa gis (`gis_pitka_aani_alku`), yleistauon jälkeen askelta alempana
   (`fis_pitka_aani`), vielä alempana (`e_pitka_ja_kuviot`), muistona takaisin (`gis_palaa`) ja lopussa viulujen ääni,
   joka ei enää lakkaa (`S_sempre_mf`). Viivan korkeus kuvassa on sävelkorkeus. Lopun kajo nousee saman viivan taakse.
2. **Siemen.** Jousten ensimmäinen aihe kasvattaa ensimmäisen kuusikon (`jouset_tulevat`), ja sama kuusikko palaa
   samaan paikkaan (`siemen_toistuu`). Sama sävel on aina sama puuryhmä: koko metsä kasvaa tästä.
3. **Askeleet.** Basson äänet ovat sysäyksiä maassa (`askeleet_alkavat`, `askeleet_B`, `askeleet_fis`,
   `M_raskaat_askeleet`, `viimeiset_askeleet`). Kävelijää ei näy.
4. **Väärä ja oikea valo.** C-duurin punainen (`auringonsade`) tulee sivulta ja viedään pois; H-duurin kajo
   (`loppu_Hduuri_alku`) nousee suoraan horisontin viivan taakse.

## 5. Otot

### Kuvatapa 1 Metsän idea

#### 01 Ennen ääntä · `tiedoston_alku` → `avaus_patarumpu` · <!--aika-->0:00–0:07<!--/aika-->
- **Kuuluu:** ei vielä mitään.
- **Näkyy:** tumma ilma, maa ja metsän matala reuna. Usva ajelehtii; kuva lähestyy hitaasti. Viivaa ei vielä ole.
- **Tunne → keino:** odotus → pimeys, jossa metsä on jo.

#### 02 Avaus · `avaus_patarumpu` → `gis_pitka_aani_alku` · <!--aika-->0:07–0:08<!--/aika-->
- **Kuuluu:** Avaus: patarumpusoolo ("tututum"), ei muita *Soittaa:* patarummut.
  - **Näkyy:** Vain tumma ilma ja maa. Maa saa yhden sysäyksen, ei muuta.
  - **Tunne → keino:** pimeä, odottava → pimeys ja yksi maan sysäys

#### 03 Pitkä gis alkaa · `gis_pitka_aani_alku` → `gis_paljastuu` · <!--aika-->0:08–0:12<!--/aika-->
- **Kuuluu:** Pitkä gis alkaa: soi lähes katkeamatta, käyrätorvet taustalla *Soittaa:* puhaltimet (käyrätorvet taustalla).
  - **Näkyy:** Horisontin viiva syttyy tumman ilman takaa gis:n korkeudelle, ohut ja kirkas; pysyy koko ajan.
  - **Tunne → keino:** synkkä, yksi valoisa sävel → valo (viivan kirkkaus) ja korkeus
- **Kuuluu:** (`jouset_tulevat`) Jouset tulevat: ydinmotiivi, "siemen" *Soittaa:* jouset.
  - **Näkyy:** Kuusiryhmä kasvaa maasta viivan eteen; latvat ovat melodian sävelten korkeudella. Jouset johtavat kuvaa, viiva jää taakse.
  - **Tunne → keino:** staattinen, synkkä → tummuus ja tiheys

#### 04 Jouset lopettavat · `gis_paljastuu` → `siemen_toistuu` · <!--aika-->0:12–0:20<!--/aika-->
- **Kuuluu:** Jouset lopettavat: käyrätorvien gis paljastuu (kuultu) *Soittaa:* jouset lopettavat, käyrätorvet jäävät.
  - **Näkyy:** Kuusiryhmät väistyvät maahan; viiva jää yksin näkyviin. Mitään uutta ei tule.
  - **Tunne → keino:** paljastuva, hiljainen → väistyminen, etäisyys

#### 05 Siemen toisen kerran · `siemen_toistuu` → `puhallinkuviot_alku` · <!--aika-->0:20–0:25<!--/aika-->
- **Kuuluu:** Siemen toisen kerran *Soittaa:* jouset.
  - **Näkyy:** Sama kuusiryhmä kasvaa samaan paikkaan samalla korkeudella kuin ensimmäisellä kerralla; viiva pysyy takana.
  - **Tunne → keino:** staattinen, synkkä → sama paikka, toisto

#### 06 Puhaltimien pienet kuviot alkavat · `puhallinkuviot_alku` → `puhaltimet_tulevat` · <!--aika-->0:25–0:26<!--/aika-->
- **Kuuluu:** Puhaltimien pienet kuviot alkavat *Soittaa:* puhaltimet.
  - **Näkyy:** Viivasta nousee kukkuloita yksi kerrallaan ja painuu takaisin (noin 2 s välein); jokaisesta jää matala jälki. Huipun terävyys seuraa soinnin runsautta, puhdas sointi on matala pyöreä kumpu. Kuusiryhmät väistyvät taaksepäin.
  - **Tunne → keino:** autius, ensimmäinen liike → liike ja korkeus

#### 07 Puupuhaltimet tulevat mukaan jousten jälkeen · `puhaltimet_tulevat` → `puhallinkuviot_loppu` · <!--aika-->0:26–0:39<!--/aika-->
- **Kuuluu:** Puupuhaltimet tulevat mukaan jousten jälkeen *Soittaa:* puhaltimet.
  - **Näkyy:** Kukkulat tulevat esiin kuusiryhmien takaa; jousten kuusiryhmät pienenevät ja vetäytyvät usvaan. Puhaltimet johtavat kuvaa.
  - **Tunne → keino:** autius → etäisyys, vuoronperään
- Kone kuuli: Isku (ei muuta tietoa) **Näkyy:** Maa saa sysäyksen ja metsä heilahtaa.

#### 08 Puhaltimien pienet kuviot päättyvät · `puhallinkuviot_loppu` → `patarumpu_paisuu` · <!--aika-->0:39–0:41<!--/aika-->
- **Kuuluu:** Puhaltimien pienet kuviot päättyvät *Soittaa:* puhaltimet.
  - **Näkyy:** Kukkulat painuvat viivaan; viiva jää.
  - **Tunne → keino:** odottava → liike lakkaa

#### 09 Patarumpujen paisutus ennen puuskaa · `patarumpu_paisuu` → `vaskien_isku` · <!--aika-->0:41–0:45<!--/aika-->
- **Kuuluu:** Patarumpujen paisutus ennen puuskaa *Soittaa:* patarummut.
  - **Näkyy:** Maa alkaa väristä ja hohtaa; viiva soi yllä.
  - **Tunne → keino:** varoitus → värinä ja hohto

#### 10 Vaskien isku avaa Allegro moderaton · `vaskien_isku` → `fraasi_ennen_taukoa` · <!--aika-->0:45–0:54<!--/aika-->
- **Kuuluu:** Vaskien isku avaa Allegro moderaton *Soittaa:* vasket (patarummut, jouset vastaavat).
  - **Näkyy:** Pystysuora leikkaus kaikkien kerrosten läpi; lähimmät kuusiryhmät jäävät sen eteen siluetteina; maa saa sysäyksen.
  - **Tunne → keino:** uhka → valo (ainoa pystysuora valo)
- **Kuuluu:** (`tuulenpuuska`) Tuulenpuuska (kuultu) *Soittaa:* ei tietoa (partituuri: vasket, patarummut, jouset).
  - **Näkyy:** Lumi alkaa liikkua kerrosten välissä: kaukana pientä ja hidasta, lähellä suurta ja nopeaa; jouset kasvattavat kuusiryhmiä. Lumi ei peitä lähempää kerrosta.
  - **Tunne → keino:** levoton → lumen vauhti kerroksittain
- **Kuuluu:** (`gis_pitka_aani_loppu`) Pitkä gis päättyy: peittyy puuskan alle *Soittaa:* puhaltimet (gis).
  - **Näkyy:** Viiva peittyy lumen ja lähimmän kuusiryhmän taakse mutta ei sammu: viiva on kuvassa niin kauan kuin ääni soi.
  - **Tunne → keino:** peittyvä → etäisyys

#### 11 Jousten fraasi ennen yleistaukoa, jää kesken · `fraasi_ennen_taukoa` → `hiljaisuus_1_alku` · <!--aika-->0:54–0:58<!--/aika-->
- **Kuuluu:** Jousten fraasi ennen yleistaukoa, jää kesken *Soittaa:* jouset.
  - **Näkyy:** Kuusiryhmän latvat nousevat ja pysähtyvät kesken; ryhmä jää edessä.
  - **Tunne → keino:** kesken jäävä → pysähtyvä nousu
- **Kulku 1 alkaa:** lumen läpi maan tasalle; päättyy `hiljaisuus_1_loppu`.

#### 12 Ensimmäinen hiljaisuus alkaa · `hiljaisuus_1_alku` → `hiljaisuus_1_loppu` · <!--aika-->0:58–1:01<!--/aika-->
- **Kuuluu:** Ensimmäinen hiljaisuus alkaa (yleistauko) *Soittaa:* ei kukaan (tauko).
  - **Näkyy:** Kuvassa ei ole mitään, mikä soisi: ei viivaa, ei kuusiryhmiä, ei kukkuloita. Jäljelle jäävät metsän kaukainen reuna, maa, tumma ilma ja lumi kerrosten välissä; kuva lähestyy yhä.
  - **Tunne → keino:** pidätetty hengitys → tyhjyys

### Kuvatapa 2 Maan tasalta

#### 13 Ensimmäinen hiljaisuus päättyy · `hiljaisuus_1_loppu` → `valo_D_duuri` · <!--aika-->1:01–1:15<!--/aika-->
- **Kuuluu:** Ensimmäinen hiljaisuus päättyy: jouset aloittavat *Soittaa:* jouset.
  - **Näkyy:** Kuusiryhmät kasvavat maasta uudelleen, mutta latvat ovat alempana kuin ennen.
  - **Tunne → keino:** helpotus, joka ei kestä → korkeus (alempana)
- **Kuuluu:** (`fis_pitka_aani`) Yleistauon jälkeen: pitkä fis (lähes minuutin) *Soittaa:* jouset ja vasket vuorotellen lohkoina.
  - **Näkyy:** Viiva laskee sävelaskelen gis:stä fis:iin ja jää. Jouset kasvattavat kuusiryhmiä ja vaskien lohkot vuorottelevat niiden kanssa.
  - **Tunne → keino:** sulkeutuva, synkempi → laskeva viiva, tiheys
- Kone kuuli: Liike kiihtyy: ääniä tulee tiheään **Näkyy:** Kuusiryhmiä ja pilkahduksia syntyy ja väistyy tiheämmin.
- Kone kuuli: Ylhäällä välähtää nopea kuvio (jouset) **Näkyy:** Pilkahdus korkealla: syttyy kuvion alkaessa ja sammuu sen loppuessa.

#### 14 Ensimmäinen valon välähdys · `valo_D_duuri` → `askeleet_alkavat` · <!--aika-->1:15–1:40<!--/aika-->
- **Kuuluu:** Ensimmäinen valon välähdys: D ja H pitkinä, kahdesti *Soittaa:* vasket ja puhaltimet.
  - **Näkyy:** Kaksi harjua nousee jousten kuusiryhmien takaa kahdelle korkeudelle (d ja h kahdessa oktaavissa); hetken kelmeä, kylmä valo; jouset väistyvät.
  - **Tunne → keino:** hetkellinen valo → valo ja korkeus
- Kone kuuli: Liike tasaantuu **Näkyy:** Kuusiryhmien ja pilkahdusten syntytahti hidastuu.
- Kone kuuli: Liike kiihtyy: ääniä tulee tiheään **Näkyy:** Kuusiryhmiä ja pilkahduksia syntyy tiheämmin.

#### 15 Basson eritahtiset iskut alkavat · `askeleet_alkavat` → `askeleet_B` · <!--aika-->1:40–2:09<!--/aika-->
- **Kuuluu:** Basson eritahtiset iskut alkavat (kuultu) *Soittaa:* bassot (alttoviulut ja puhaltimet vuorottelevat ylempänä).
  - **Näkyy:** Maa sysää omassa tahdissaan matalan h:n korkeudella ja hohtaa; kuusiryhmät ja kukkulat vuorottelevat sen yllä. Maa johtaa kuvaa.
  - **Tunne → keino:** jokin suuri on tulossa → paino (maan hohto)
- **Kuuluu:** (`fis_hengittaa`) Sointumatto hengittää: kaksi sointua vuorotellen *Soittaa:* jouset (sellot), bassot, puhaltimet.
  - **Näkyy:** Kaksi kuusiryhmää (d–fis ja e–gis) kasvaa ja väistyy vuorotellen noin kahden sekunnin välein; maa sysää niiden alla; ylhäällä pilkahduksia noin seitsemän sekunnin välein. Johtaja: kuusiryhmien hengitys.
  - **Tunne → keino:** odottava, tasainen → tiheys ja rytmi
- Kone kuuli: Musiikki laskeutuu: basso ja yläkerros noin 6 s **Näkyy:** Latvat, viiva ja maan hohto painuvat alemmas noin kuudessa sekunnissa.
- Kone kuuli: Yläkerros soittaa lyhyitä irrallisia ääniä (staccato) **Näkyy:** Erillisiä pilkahduksia korkealla, ei viivaa.

#### 16 Matalat äänet "askeleina" · `askeleet_B` → `urkupiste_H1_alku` · <!--aika-->2:09–2:56<!--/aika-->
- **Kuuluu:** Matalat äänet "askeleina" (kuultu) *Soittaa:* bassot (sellot, kontrabassot).
  - **Näkyy:** Maan sysäykset eri tahtiin kuin muu; maan hohto painaa; ei jalkaa eikä hahmoa. Noin 28 sysäystä –.
  - **Tunne → keino:** painava, näkymätön läsnäolo → maan hohto ja sysäys

#### 17 Nousu alkaa h-urkupisteen päällä · `urkupiste_H1_alku` → `nousu_tremolo` · <!--aika-->2:56–3:06<!--/aika-->
- **Kuuluu:** Nousu alkaa h-urkupisteen päällä (kuultu) *Soittaa:* koko orkesteri.
  - **Näkyy:** Maa pysyy paikallaan; kuusiryhmien latvat, viiva ja kukkulat nousevat portaittain noin kahden sekunnin välein (fis:stä e:hen, lähes kaksi oktaavia).
  - **Tunne → keino:** nouseva, kasvava → korkeus
- **Kulku 2 alkaa:** katse nousee runkoja pitkin; päättyy `urkupiste_H1_loppu`.

#### 18 Nousun ylimmät äänet alkavat väristä · `nousu_tremolo` → `urkupiste_H1_loppu` · <!--aika-->3:06–3:11<!--/aika-->
- **Kuuluu:** Nousun ylimmät äänet alkavat väristä *Soittaa:* ei tietoa (nousun ylimmät äänet).
  - **Näkyy:** Ylimpien latvojen kärki väreilee.
  - **Tunne → keino:** kiihtyvä, kirkastuva → valon väreily

### Kuvatapa 3 Ylös runkoja pitkin

#### 19 Basso lähtee liikkeelle kuudentoista sekunnin jälkeen · `urkupiste_H1_loppu` → `nousu_huippu_D` · <!--aika-->3:11–3:15<!--/aika-->
- **Kuuluu:** Basso lähtee liikkeelle kuudentoista sekunnin jälkeen *Soittaa:* bassot.
  - **Näkyy:** Maa liikahtaa ja alkaa nousta muiden mukana: urkupiste päättyy.
  - **Tunne → keino:** maa liikkuu → paino

#### 20 Nousu päätyy D-duuriin · `nousu_huippu_D` → `ylarekisteri_heraa` · <!--aika-->3:15–3:23<!--/aika-->
- **Kuuluu:** Nousu päätyy D-duuriin *Soittaa:* koko orkesteri.
  - **Näkyy:** Kaikki kerrokset syttyvät yhtä aikaa D-duurisoinnun korkeuksilla (d1, d2, d3, fis, a); kelmeä, kylmä valo; seitsemän sekunnin jälkeen hiipuu.
  - **Tunne → keino:** valo, hetken → valo
- **Kulku 3 alkaa:** ylhäällä olevan oksan huurteeseen; päättyy `pohja_katoaa`.

### Kuvatapa 4 Lähikuva

#### 21 Kirjain C · `ylarekisteri_heraa` → `e_pitka_ja_kuviot` · <!--aika-->3:23–4:00<!--/aika-->
- **Kuuluu:** Kirjain C: pohja katoaa, viulut vajoavat, puhaltimet kuvioivat *Soittaa:* jouset (viulut, jaettuina) ja puhaltimet (huilut, klarinetit).
  - **Näkyy:** Kuusiryhmien latvat vajoavat hitaasti alas, keinuen pareittain; niiden yllä pieniä pilkahduksia; maa on tyhjä. Johtaja: hitaasti vajoava kuusiryhmä.
  - **Tunne → keino:** leijuva, pohjaton, lempeä → etäisyys, hidas laskeva liike
- **Kuuluu:** (`pohja_katoaa`) Pohja katoaa: basso ja sellot poissa *Soittaa:* bassot (poissa).
  - **Näkyy:** Maa sammuu: hohto ja värinä loppuvat; kuusiryhmät leijuvat.
  - **Tunne → keino:** pohjaton → maan puuttuminen
- Kone kuuli: Liike hidastuu **Näkyy:** Metsän huojunta laantuu, ja kuusiryhmiä kasvaa ja väistyy harvemmin.
- Kone kuuli: Keskikerros soittaa pitkiä sidottuja ääniä (legato) **Näkyy:** Pitkä ääni pysyy: jousilla kuusiryhmä, puhaltimilla harju (oton soittajan mukaan).
- Kone kuuli: Liike tasaantuu **Näkyy:** Metsän huojunta ja kuusiryhmien vaihtuminen pysyvät tasaisina.

#### 22 Pitkä e ja tiheät korkeat kuviot; askeleet · `e_pitka_ja_kuviot` → `askeleet_fis` · <!--aika-->4:00–4:12<!--/aika-->
- **Kuuluu:** Pitkä e ja tiheät korkeat kuviot; askeleet *Soittaa:* ei tietoa (askeleet: bassot).
  - **Näkyy:** Viiva e:n korkeudella; ylhäällä tiheitä pilkahduksia; maassa sysäykset noin 1,7 s välein. Kolme kerrosta kolmella vauhdilla yhtä aikaa.
  - **Tunne → keino:** levoton, kolme aikaa päällekkäin → kolme kerrosta
- Kone kuuli: Matalat soittimet palaavat: ääni saa pohjan **Näkyy:** Maa syttyy: hohto palaa.
- Kone kuuli: Ylhäällä välähtää nopea kuvio **Näkyy:** Pilkahdus korkealla.

#### 23 Askeleet palaavat fis · `askeleet_fis` → `nopea_liike_1_alku` · <!--aika-->4:12–4:40<!--/aika-->
- **Kuuluu:** Askeleet palaavat fis:llä *Soittaa:* bassot.
  - **Näkyy:** Maan sysäykset noin 1,7 s välein fis:n korkeudella korkeiden pilkahdusten alla; maa kulkee mukana.
  - **Tunne → keino:** jokin kulkee mukana → maan sysäys
- Kone kuuli: Liike tasaantuu **Näkyy:** Metsän huojunta ja kuusiryhmien vaihtuminen tasaantuvat.

#### 24 Nopean kuvioinnin jakso alkaa · `nopea_liike_1_alku` → `nopea_liike_1_loppu` · <!--aika-->4:40–5:03<!--/aika-->
- **Kuuluu:** Nopean kuvioinnin jakso alkaa *Soittaa:* puhaltimet (puupuhaltimet ja jouset).
  - **Näkyy:** Pilkahduksia tiheään puhaltimien korkeuksilla; jousten kuusiryhmät kaukana usvassa. Puhaltimet johtavat.
  - **Tunne → keino:** väike, levoton leikki → tiheys ja liike
- Kone kuuli: Basso vaikenee **Näkyy:** Maa sammuu.

#### 25 Nopean kuvioinnin jakso päättyy · `nopea_liike_1_loppu` → `jannitesoinnut` · <!--aika-->5:03–5:10<!--/aika-->
- **Kuuluu:** Nopean kuvioinnin jakso päättyy *Soittaa:* puhaltimet.
  - **Näkyy:** Pilkahdukset sammuvat; kuva tyhjenee.
  - **Tunne → keino:** tyhjenevä → tiheyden lasku

#### 26 Jännitteiset pitkät soinnut H · `jannitesoinnut` → `pohja_vaihtuu_D` · <!--aika-->5:10–5:36<!--/aika-->
- **Kuuluu:** Jännitteiset pitkät soinnut H:n päällä *Soittaa:* ei tietoa.
  - **Näkyy:** Maa hohtaa h:lla; sen yllä kaksi pitkää ääntä (a ja dis) kahdesti: kaksi korkeutta, joiden muoto (kuusiryhmä vai harju) riippuu soittajasta. Kaikki pysähtyy.
  - **Tunne → keino:** uhka, odotus → pysähtyvä liike, valon puute
- Kone kuuli: Musiikki nousee: yläkerros noin 6 s **Näkyy:** Latvat nousevat noin kuuden sekunnin ajan.
- Kone kuuli: Liike tasaantuu **Näkyy:** Metsän huojunta ja kuusiryhmien vaihtuminen tasaantuvat.
- **Kulku 4 alkaa:** kuva kulkee usvan läpi jään reunalle, ja metsä näkyy usvan läpi koko ajan; päättyy `pohja_vaihtuu_D`.

### Kuvatapa 5 Pinnan sisään

#### 27 Pohja vaihtuu · `pohja_vaihtuu_D` → `gis_palaa` · <!--aika-->5:36–6:06<!--/aika-->
- **Kuuluu:** Pohja vaihtuu: matala d sykkii *Soittaa:* bassot.
  - **Näkyy:** Maa siirtyy sivuun: sysäys noin kaksikymmentä kertaa d:n korkeudella; pitkät äänet yllä. Ensimmäinen kerta, kun maa ei ole h:ssa.
  - **Tunne → keino:** vieras, tummuva → maan korkeus muuttuu
- Kone kuuli: Yläkerros soittaa lyhyitä irrallisia ääniä (staccato) **Näkyy:** Erillisiä pilkahduksia korkealla.
- Kone kuuli: Basso vaikenee **Näkyy:** Maa sammuu.
- Kone kuuli: Liike hidastuu **Näkyy:** Metsän huojunta laantuu, ja kuusiryhmiä kasvaa ja väistyy harvemmin.
- Kone kuuli: Musiikki laskeutuu: keskikerros ja yläkerros noin 9 s (jouset) **Näkyy:** Kuusiryhmien latvat painuvat alemmas noin yhdeksässä sekunnissa.

#### 28 Gis palaa hetkeksi · `gis_palaa` → `peikot_G_alku` · <!--aika-->6:06–6:23<!--/aika-->
- **Kuuluu:** Gis palaa hetkeksi (7 s, hiljaa) *Soittaa:* ei tietoa.
  - **Näkyy:** Viiva syttyy uudelleen gis:n korkeudelle hiljaa ja yksin seitsemäksi sekunniksi: sama viiva kuin alussa.
  - **Tunne → keino:** muisto alusta → sama korkeus, sama paikka
- Kone kuuli: Yläkerros soittaa lyhyitä irrallisia ääniä (staccato) **Näkyy:** Erillisiä pilkahduksia korkealla.

#### 29 Puupuhallinkuviot G · `peikot_G_alku` → `peikot_G_loppu` · <!--aika-->6:23–6:30<!--/aika-->
- **Kuuluu:** Puupuhallinkuviot G:ssä alkavat *Soittaa:* puhaltimet (huilut, klarinetit).
  - **Näkyy:** Pilkahduksia teoksen tiheimmällä tahdilla puhaltimien korkeuksilla; ei melodiaa.
  - **Tunne → keino:** väike, hämyn äänet → tiheys

#### 30 Puupuhallinkuviot G · `peikot_G_loppu` → `h_urkupiste_vyory` · <!--aika-->6:30–7:00<!--/aika-->
- **Kuuluu:** Puupuhallinkuviot G:ssä päättyvät; käyrätorvipulssit *Soittaa:* puhaltimet ja käyrätorvet.
  - **Näkyy:** Pilkahdukset sammuvat; takana harjut paisuvat ja laskevat noin neljän sekunnin välein pehmeässä valossa; jouset hiljaa edessä. Käyrätorvien harjut johtavat.
  - **Tunne → keino:** hidas hengitys → pehmeä valo harjun alla
- Kone kuuli: Keskikerros soittaa pitkiä sidottuja ääniä (legato) **Näkyy:** Pitkä ääni pysyy: jousilla kuusiryhmä, puhaltimilla harju (oton soittajan mukaan).
- Kone kuuli: Musiikki nousee: koko orkesteri noin 6 s **Näkyy:** Kaikki latvat, viiva ja harjut nousevat noin kuuden sekunnin ajan.
- Kone kuuli: Liike tasaantuu **Näkyy:** Metsän huojunta ja kuusiryhmien vaihtuminen tasaantuvat.
- Kone kuuli: Musiikki laskeutuu: koko orkesteri noin 6 s **Näkyy:** Kaikki latvat, viiva ja harjut painuvat noin kuuden sekunnin ajan.
- Kone kuuli: Ylhäällä välähtää nopea kuvio **Näkyy:** Pilkahdus korkealla.
- Kone kuuli: Ylärekisteri sammuu (5 s): tumma, matala sointi jää **Näkyy:** Viiva ja pilkahdukset ylhäällä sammuvat; maa ja matalat kuusiryhmät jäävät.
- Kone kuuli: Musiikki nousee: basso ja yläkerros noin 10 s **Näkyy:** Maan hohto, latvat ja viiva nousevat noin kymmenen sekuntia.
- Kone kuuli: Liike kiihtyy: ääniä tulee tiheään **Näkyy:** Kuusiryhmiä ja pilkahduksia syntyy tiheämmin.

#### 31 Ensimmäinen vyöry H-urkupisteellä · `h_urkupiste_vyory` → `vaskipulssit` · <!--aika-->7:00–7:16<!--/aika-->
- **Kuuluu:** Ensimmäinen vyöry H-urkupisteellä (25 s) *Soittaa:* koko orkesteri.
  - **Näkyy:** Maa pysyy h:ssa ja sysää alle sekunnin välein; kuusiryhmiä, pilkahduksia ja lunta syntyy tiheään kaikissa kerroksissa yhtä aikaa. Kuvaa johtaa maa ja tihein kuusiryhmien kuviointi.
  - **Tunne → keino:** vyöryvä, velloava → tiheys ja liike

#### 32 Vasket ja puupuhaltimet sykkivät hitaasti · `vaskipulssit` → `hajoaa_hiljaisuuteen` · <!--aika-->7:16–7:42<!--/aika-->
- **Kuuluu:** Vasket ja puupuhaltimet sykkivät hitaasti *Soittaa:* käyrätorvet ja puhaltimet.
  - **Näkyy:** Takana harjut paisuvat ja laskevat noin neljän sekunnin välein; jouset hiljaa välissä.
  - **Tunne → keino:** hidas hengitys → etäisyys, harjun valo
- Kone kuuli: Yläkerros soittaa pitkiä sidottuja ääniä (legato) **Näkyy:** Viiva tai harju korkealla pitkänä.
- Kone kuuli: Musiikki nousee: basso ja yläkerros noin 11 s (puupuhaltimet) **Näkyy:** Kukkulat ja harjut nousevat korkeammalle noin yhdentoista sekunnin ajan.

#### 33 Metsä harvenee · `hajoaa_hiljaisuuteen` → `jousijakso_urkupiste_E_alku` · <!--aika-->7:42–8:16<!--/aika-->
- **Kuuluu:** Metsä harvenee: hiljaisia pudotuksia *Soittaa:* jouset (lyhyet lohkot), puhaltimet vilahtavat.
  - **Näkyy:** Yksittäisiä kuusiryhmiä kasvaa ja väistyy kokonaan; niiden välissä tyhjää ilmaa ja maa.
  - **Tunne → keino:** harveneva, syvenevä → tyhjyys, etäisyys
- Kone kuuli: Musiikki laskeutuu: basso ja yläkerros noin 11 s (puupuhaltimet) **Näkyy:** Kukkulat ja harjut painuvat noin yhdentoista sekunnin ajan.
- Kone kuuli: Basso jää H1:lle noin 12 s **Näkyy:** Maa pysyy paikallaan; kaikki muu liikkuu sen päällä.
- Kone kuuli: Liike hidastuu **Näkyy:** Metsän huojunta laantuu, ja kuusiryhmiä kasvaa ja väistyy harvemmin.
- Kone kuuli: Basso vaikenee **Näkyy:** Maa sammuu.
- Kone kuuli: Musiikki laskeutuu: keskikerros ja yläkerros noin 10 s **Näkyy:** Latvat ja viiva painuvat noin kymmenen sekuntia.
- Kone kuuli: Keskikerros soittaa pitkiä sidottuja ääniä (legato) **Näkyy:** Kuusiryhmä tai harju pitkänä.
- **Kulku 5 alkaa:** jäästä runkojen sekaan; päättyy `jousijakso_urkupiste_E_alku`.

### Kuvatapa 6 Ikisalo

#### 34 Jousijakso urkupisteen päällä alkaa · `jousijakso_urkupiste_E_alku` → `jousijakso_urkupiste_E_loppu` · <!--aika-->8:16–8:22<!--/aika-->
- **Kuuluu:** Jousijakso urkupisteen päällä alkaa (E) *Soittaa:* jouset (matalat).
  - **Näkyy:** Maa pysyy E:llä paikallaan; matalat kuusiryhmät edessä; muu poissa. Matalin spektri koko teoksessa.
  - **Tunne → keino:** syvä, tumma, kaukainen → etäisyys, tummuus

#### 35 Jousijakso urkupisteen päällä päättyy · `jousijakso_urkupiste_E_loppu` → `patarumpu_ppp` · <!--aika-->8:22–8:38<!--/aika-->
- **Kuuluu:** Jousijakso urkupisteen päällä päättyy *Soittaa:* jouset.
  - **Näkyy:** Kuusiryhmät väistyvät.
  - **Tunne → keino:** pimenevä → väistyminen
- Kone kuuli: Ylärekisteri syttyy **Näkyy:** Pilkahdus tai viiva syttyy korkealle.

#### 36 Maan värinä hiljaisuudessa · `patarumpu_ppp` → `hitaat_soinnut` · <!--aika-->8:38–9:00<!--/aika-->
- **Kuuluu:** Maan värinä hiljaisuudessa (matala d, 8 s) *Soittaa:* patarummut (partituuri).
  - **Näkyy:** Maa värisee tiheästi yksin, tuskin näkyvästi; yllä pitkä fis viivana.
  - **Tunne → keino:** syvä, pidätetty → värinä
- Kone kuuli: Keskirekisteri vaikenee (5 s) **Näkyy:** Keskikorkeudella olevat kuusiryhmät väistyvät.
- Kone kuuli: Pohja katoaa: ylempi kerros soittaa yksin (19 s) **Näkyy:** Maa sammuu; ylempi kuusiryhmä jää leijumaan.
- Kone kuuli: Basso vaikenee **Näkyy:** Maa sammuu.
- Kone kuuli: Musiikki nousee: keskikerros ja yläkerros noin 7 s **Näkyy:** Latvat nousevat noin seitsemän sekuntia.
- Kone kuuli: Keskirekisteri tulee mukaan (jouset) **Näkyy:** Kuusiryhmät kasvavat keskikorkeudelle.
- Kone kuuli: Ylärekisteri syttyy (jouset) **Näkyy:** Kuusiryhmien latvat nousevat korkealle.

#### 37 Hitaasti vaihtuvat soinnut · `hitaat_soinnut` → `h_palaa_ennen_hiljaisuutta` · <!--aika-->9:00–9:40<!--/aika-->
- **Kuuluu:** Hitaasti vaihtuvat soinnut (gis, ais, d, f, g, dis) *Soittaa:* ei tietoa.
  - **Näkyy:** Kuusiryhmiä kaukana usvassa; ne vaihtuvat hitaasti toisikseen; lähellä vain ikisalon kehystävät rungot. Selkeys: ei lunta, ei leikkauksia.
  - **Tunne → keino:** ikisalot, ajaton → etäisyys, hitaus
- Kone kuuli: Matalat soittimet palaavat **Näkyy:** Maa syttyy.
- Kone kuuli: Yläkerros soittaa lyhyitä irrallisia ääniä (staccato) **Näkyy:** Erillisiä pilkahduksia korkealla.
- Kone kuuli: Liike hidastuu **Näkyy:** Metsän huojunta laantuu, ja kuusiryhmiä kasvaa ja väistyy harvemmin.
- Kone kuuli: Pohja katoaa: ylempi kerros yksin (11 s) **Näkyy:** Maa sammuu; ylempi kuusiryhmä leijuu.
- Kone kuuli: Musiikki nousee: basso ja yläkerros noin 11 s **Näkyy:** Maan hohto, latvat ja viiva nousevat noin yksitoista sekuntia.

#### 38 H palaa ja sykkii neljätoista kertaa ennen hiljaisuutta · `h_palaa_ennen_hiljaisuutta` → `hiljainen_jakso_alku` · <!--aika-->9:40–9:57<!--/aika-->
- **Kuuluu:** H palaa ja sykkii neljätoista kertaa ennen hiljaisuutta *Soittaa:* bassot.
  - **Näkyy:** Maa sysää neljätoista kertaa h:n korkeudella; muu häipyy.
  - **Tunne → keino:** hiipuva → maan sysäys

#### 39 Hiljainen jakso alkaa · `hiljainen_jakso_alku` → `hiljainen_jakso_loppu` · <!--aika-->9:57–10:13<!--/aika-->
- **Kuuluu:** Hiljainen jakso alkaa *Soittaa:* jouset (heikot).
  - **Näkyy:** Heikkoja kuusiryhmiä kaukana usvassa; lähellä vain ikisalon kehystävät rungot; kuva lähes tyhjä mutta ei tyhjä.
  - **Tunne → keino:** tyhjyys, odotus → pieni koko, etäisyys

#### 40 Hiljainen jakso päättyy · `hiljainen_jakso_loppu` → `vaski_tutti_620` · <!--aika-->10:13–10:21<!--/aika-->
- **Kuuluu:** Hiljainen jakso päättyy: vasket ja patarummut kasvavat *Soittaa:* vasket ja patarummut.
  - **Näkyy:** Maa hohtaa ja väristyy; vaskien pitkät äänet nousevat takaa harjuina.
  - **Tunne → keino:** lähestyvä → hohto, läheisyys

#### 41 Vaskien ja patarumpujen tutti-isku · `vaski_tutti_620` → `allegro_359` · <!--aika-->10:21–10:32<!--/aika-->
- **Kuuluu:** Vaskien ja patarumpujen tutti-isku *Soittaa:* vasket ja patarummut.
  - **Näkyy:** Pystysuora leikkaus kaikkien kerrosten läpi; maan sysäys; lähimmät kuusiryhmät jäävät sen eteen siluetteina.
  - **Tunne → keino:** vyöryvä, levoton → valo
- Kone kuuli: Ylhäällä välähtää nopea kuvio **Näkyy:** Pilkahdus korkealla.

#### 42 Allegro · `allegro_359` → `c_duuri_valahdykset` · <!--aika-->10:32–10:41<!--/aika-->
- **Kuuluu:** Allegro: liike palaa *Soittaa:* puhaltimet (huilut, fagotit) ja jouset.
  - **Näkyy:** Pilkahduksia tiheään; jousten kuusiryhmät nopeasti; leikkaus sammuu, vaskien harjut vetäytyvät taakse.
  - **Tunne → keino:** levoton, kiihtyvä → tiheys
- Kone kuuli: Musiikki nousee: basso ja yläkerros noin 21 s **Näkyy:** Maan hohto, latvat ja viiva nousevat noin kaksikymmentä sekuntia.

#### 43 C-duuri välähtää kolmesti ennen pysähtymistä · `c_duuri_valahdykset` → `auringonsade` · <!--aika-->10:41–11:20<!--/aika-->
- **Kuuluu:** C-duuri välähtää kolmesti ennen pysähtymistä *Soittaa:* ei tietoa.
  - **Näkyy:** Taottu aurinko välähtää kolmesti kerrosten takana ja katoaa; kolmannella kerralla se jää.
  - **Tunne → keino:** väärä valo lähestyy → valo (punainen), etäisyys
- Kone kuuli: Matalat soittimet palaavat **Näkyy:** Maa syttyy.
- Kone kuuli: Pitkät korkeat äänet alkavat väristä (tremolo) **Näkyy:** Korkeiden pitkien äänten viiva väreilee.
- Kone kuuli: Yläkerros soittaa pitkiä sidottuja ääniä (legato) **Näkyy:** Viiva tai harju korkealla pitkänä.
- Kone kuuli: Musiikki laskeutuu: basso ja yläkerros noin 10 s (jouset) **Näkyy:** Kuusiryhmien latvat painuvat noin kymmenen sekuntia.

#### 44 C-duuri ennen kirjainta M · `auringonsade` → `M_ennakko` · <!--aika-->11:20–11:25<!--/aika-->
- **Kuuluu:** C-duuri ennen kirjainta M (noin viisi tahtia) *Soittaa:* jouset (korkeat), vasket ja puupuhaltimet hiljaa taustalla.
  - **Näkyy:** Taottu aurinko nousee kerrosten taakse; korkeat kuusiryhmät edessä; taustalla harjut hiljaa. Kamera pysähtyy (nimetty).
  - **Tunne → keino:** väärä toivo, groteski valo, pysähtynyt → punainen valo, etäisyys
- **Kamera:** **Nimetty pysähdys 1.** Lähestyminen pysähtyy: väärä valo seisoo paikallaan, ja kaikki muu jatkaa elämistä äänestä.

#### 45 Kirjain M · `M_ennakko` → `M_raskaat_askeleet` · <!--aika-->11:25–11:31<!--/aika-->
- **Kuuluu:** Kirjain M: vaskien jyrinä *Soittaa:* vasket ja patarummut.
  - **Näkyy:** Useita pystysuoria leikkauksia peräkkäin; maa värisee; jousten kuusiryhmät katoavat niiden alle; taottu aurinko sammuu. Vaskit johtavat.
  - **Tunne → keino:** isku, pelottava → valo (leikkaus)
- **Kulku 6 alkaa:** väärä valo viedään: pimeään; päättyy `M_raskaat_askeleet`.

### Kuvatapa 7 Pimeä ja välähdys

#### 46 M · `M_raskaat_askeleet` → `jannitejakso_alku` · <!--aika-->11:31–11:51<!--/aika-->
- **Kuuluu:** M:n jälkeen: raskaat askeleet vaskien alla (matala ais, 18 kertaa) *Soittaa:* bassot ja vasket.
  - **Näkyy:** Maan sysäykset noin sekunnin välein ais:n korkeudella, kovat ja lähellä; leikkaukset yllä.
  - **Tunne → keino:** raskas, väistämätön → maan sysäys, läheisyys
- Kone kuuli: Pitkät korkeat äänet alkavat väristä (tremolo) **Näkyy:** Korkeiden pitkien äänten viiva väreilee.

#### 47 Jännitteinen jousijakso alkaa · `jannitejakso_alku` → `O_kirjain` · <!--aika-->11:51–12:14<!--/aika-->
- **Kuuluu:** Jännitteinen jousijakso alkaa *Soittaa:* jouset.
  - **Näkyy:** Kuusiryhmiä kasvaa ja väistyy nopeasti ja tiheään; vaskit ja patarummut takana.
  - **Tunne → keino:** ahdistava, hermostunut → tiheys, nopeus
- Kone kuuli: Musiikki laskeutuu: basso ja yläkerros noin 9 s **Näkyy:** Maan hohto ja latvat painuvat noin yhdeksän sekuntia.
- Kone kuuli: Musiikki nousee: basso ja yläkerros noin 8 s (jouset) **Näkyy:** Kuusiryhmien latvat nousevat noin kahdeksan sekuntia.

#### 48 Kirjain O · `O_kirjain` → `jannitejakso_loppu` · <!--aika-->12:14–12:35<!--/aika-->
- **Kuuluu:** Kirjain O: puupuhaltimet ja vasket vuorottelevat *Soittaa:* puhaltimet (oboet, klarinetit), vasket hiljaa.
  - **Näkyy:** Kukkulat nousevat jousten kuusiryhmien läpi; harjut hiljaa taustalla. Puhaltimet johtavat.
  - **Tunne → keino:** ahdistava, tihenevä → tiheys

#### 49 Jännitteinen jousijakso päättyy, vaskit tulevat · `jannitejakso_loppu` → `allegro_moderato_O_alku` · <!--aika-->12:35–12:36<!--/aika-->
- **Kuuluu:** Jännitteinen jousijakso päättyy, vaskit tulevat *Soittaa:* jouset väistyvät, vasket nousevat.
  - **Näkyy:** Kuusiryhmät väistyvät; vaskien harjut nousevat edelle.
  - **Tunne → keino:** vaihtuva → väistyminen

#### 50 Allegro moderato O · `allegro_moderato_O_alku` → `allegro_moderato_O_loppu` · <!--aika-->12:36–12:48<!--/aika-->
- **Kuuluu:** Allegro moderato O:n jälkeen: vaskivuorottelu alkaa *Soittaa:* käyrätorvet ja trumpetit.
  - **Näkyy:** Kaksi harjua paisuu ja laskee vuorotellen hitaasti: käyrätorvien kaukana, trumpettien lähempänä; pehmeä valo harjun alla.
  - **Tunne → keino:** hidas hengitys, painava → valo (harjun), etäisyys

#### 51 Vaskivuorottelu päättyy · `allegro_moderato_O_loppu` → `harva_kuviointi` · <!--aika-->12:48–13:00<!--/aika-->
- **Kuuluu:** Vaskivuorottelu päättyy *Soittaa:* jouset palaavat.
  - **Näkyy:** Harjut laskeutuvat; kuusiryhmät palaavat eteen.
  - **Tunne → keino:** laskeva → väistyminen
- Kone kuuli: Musiikki nousee: keskikerros ja yläkerros noin 7 s **Näkyy:** Latvat nousevat noin seitsemän sekuntia.

#### 52 Harva, hiljainen kuviointi · `harva_kuviointi` → `P_vaskipaisunta` · <!--aika-->13:00–13:26<!--/aika-->
- **Kuuluu:** Harva, hiljainen kuviointi *Soittaa:* jouset ja puhaltimet.
  - **Näkyy:** Pieniä pilkahduksia ja pieniä kuusiryhmiä keskellä; paljon tyhjää ilmaa.
  - **Tunne → keino:** tyven → harvuus
- Kone kuuli: Pohja katoaa: ylempi kerros yksin (23 s) **Näkyy:** Maa sammuu; ylempi kuusiryhmä leijuu.
- Kone kuuli: Yläkerros soittaa lyhyitä irrallisia ääniä (staccato) **Näkyy:** Erillisiä pilkahduksia korkealla.
- Kone kuuli: Liike kiihtyy: ääniä tulee tiheään **Näkyy:** Kuusiryhmiä ja pilkahduksia syntyy tiheämmin.

#### 53 Kirjain P · `P_vaskipaisunta` → `dim_possibile` · <!--aika-->13:26–13:45<!--/aika-->
- **Kuuluu:** Kirjain P: vaskien suuri paisutus *Soittaa:* vasket ja patarummut (jouset mukana).
  - **Näkyy:** Harjut kasvavat takaa eteen yhdellä paisutuksella ja kirkastuvat; maan hohto ja värinä nousevat.
  - **Tunne → keino:** viimeinen varoitus → valo, läheisyys
- Kone kuuli: Musiikki nousee: keskikerros ja yläkerros noin 6 s (jouset) **Näkyy:** Kuusiryhmien latvat nousevat noin kuusi sekuntia.

#### 54 Kaikki vaimenee · `dim_possibile` → `hiljaisuus_2_alku` · <!--aika-->13:45–14:05<!--/aika-->
- **Kuuluu:** Kaikki vaimenee: vasket häipyvät *Soittaa:* vasket, jouset.
  - **Näkyy:** Harjut vetäytyvät taakse usvaan ja sammuvat; jousten kuusiryhmät jäävät edessä.
  - **Tunne → keino:** tyhjenevä → väistyminen, etäisyys
- Kone kuuli: Yläkerros soittaa lyhyitä irrallisia ääniä (staccato) **Näkyy:** Erillisiä pilkahduksia korkealla.
- Kone kuuli: Liike hidastuu **Näkyy:** Metsän huojunta laantuu, ja kuusiryhmiä kasvaa ja väistyy harvemmin.
- **Kulku 7 alkaa:** metsän reunasta ulos jäälle; päättyy `hiljaisuus_2_alku`.

### Kuvatapa 8 Ulkoa ja kaukaa

#### 55 Lähes hiljaisuus · `hiljaisuus_2_alku` → `myrsky_nakyy` · <!--aika-->14:05–14:17<!--/aika-->
- **Kuuluu:** Lähes hiljaisuus: jouset kuulokynnyksellä (10 s) *Soittaa:* jouset (pp).
  - **Näkyy:** Kuvassa ei ole juuri mitään: maa ja tumma ilma; kamera jatkaa. Toinen hiljaisuus: jokin jo liikkuu.
  - **Tunne → keino:** tyhjä, uhkaava → tyhjyys

#### 56 Myrsky näkyy · `myrsky_nakyy` → `hiljaisuus_2_loppu` · <!--aika-->14:17–14:25<!--/aika-->
- **Kuuluu:** Myrsky näkyy (ppp, t. 523) *Soittaa:* jouset.
  - **Näkyy:** Kauimmassa kerroksessa alkaa pientä ja hidasta lunta; hyvin pieni kuusiryhmä usvassa; lumi kasvaa.
  - **Tunne → keino:** etäinen uhka, näkyvä muttei kuultava → lumi, etäisyys

#### 57 Toinen hiljaisuus päättyy · `hiljaisuus_2_loppu` → `myrsky_kasvu` · <!--aika-->14:25–14:27<!--/aika-->
- **Kuuluu:** Toinen hiljaisuus päättyy *Soittaa:* jouset.
  - **Näkyy:** Kuusiryhmät nousevat takaa; lumi kasvaa.
  - **Tunne → keino:** kasvava → tiheys

#### 58 Nopea voimistuminen alkaa · `myrsky_kasvu` → `myrsky_iskee` · <!--aika-->14:27–14:33<!--/aika-->
- **Kuuluu:** Nopea voimistuminen alkaa *Soittaa:* jouset (opas sanoo "vasket vastaavat", partituuri: ei vaskia).
  - **Näkyy:** Kuusiryhmät tulevat lähemmäs, suuriksi ja tummiksi; lumi tulee kerros kerrokselta lähemmäs: kaukana pientä ja hidasta muuttuu lähellä suureksi ja nopeaksi.
  - **Tunne → keino:** lähestyvä, vyöryvä → etäisyys vähenee
- **Kulku 8 alkaa:** myrsky saavuttaa katsojan; päättyy `myrsky_iskee`.

### Kuvatapa 9 Tuulen sisällä

#### 59 Talvimyrsky iskee · `myrsky_iskee` → `Q_koko_metsa` · <!--aika-->14:33–14:50<!--/aika-->
- **Kuuluu:** Talvimyrsky iskee (t. 540) *Soittaa:* jouset (partituuri); opas sanoo myös "koko orkesteri edessä".
  - **Näkyy:** Kuusiryhmien latvat korkealla (oktaavia ylempänä); lumi tiheänä kaikissa kerroksissa; erot pysyvät: lähempi kerros peittää kauemman lumen.
  - **Tunne → keino:** pelottava, velloava, vyöryvä → tiheys, lumi

#### 60 Kirjain Q · `Q_koko_metsa` → `myrsky_huippu` · <!--aika-->14:50–15:10<!--/aika-->
- **Kuuluu:** Kirjain Q: vasket ja patarummut liittyvät myrskyyn *Soittaa:* koko orkesteri.
  - **Näkyy:** Pystysuorat leikkaukset (vasket) ja maan sysäys ja värinä (patarummut) liittyvät lumeen ja kuusiryhmiin; kaikki kerrokset syttyvät.
  - **Tunne → keino:** pelottava, ylivoimainen → valo (leikkaukset), tiheys
- Kone kuuli: Musiikki laskeutuu: basso ja yläkerros noin 11 s **Näkyy:** Latvat ja maan hohto painuvat noin yksitoista sekuntia.

#### 61 Myrskyn voimakkain kohta · `myrsky_huippu` → `R_vasket` · <!--aika-->15:10–15:23<!--/aika-->
- **Kuuluu:** Myrskyn voimakkain kohta: tiheä tutti *Soittaa:* koko orkesteri.
  - **Näkyy:** Kaikki kerrokset täynnä: kuusiryhmät, lumi, leikkaukset, maan hohto. Kuvaa johtaa tihein lumi ja kuusiryhmät; leikkaus vain iskuissa.
  - **Tunne → keino:** huippu, ylivoima → tiheys ja valo

#### 62 Kirjain R · `R_vasket` → `toinen_paisunta` · <!--aika-->15:23–15:35<!--/aika-->
- **Kuuluu:** Kirjain R: vasket paisuvat vielä kerran *Soittaa:* vasket ja jouset.
  - **Näkyy:** Harjut paisuvat lyhyesti ja kirkastuvat; jousten kuusiryhmät vastaavat täydellä voimalla.
  - **Tunne → keino:** jälkiaalto → valo, läheisyys

#### 63 Huuto alkaa · `toinen_paisunta` → `huuto` · <!--aika-->15:35–15:45<!--/aika-->
- **Kuuluu:** Huuto alkaa: jousten nouseva asteikko *Soittaa:* jouset.
  - **Näkyy:** Kuusiryhmien latvat nousevat peräkkäin asteikkona (viulut, alttoviulut, sellot); viiva liukuu ylös kohti huudon korkeutta koko kulun ajan.
  - **Tunne → keino:** velloava → korkeus (nousee)
- Kone kuuli: Liike kiihtyy: ääniä tulee tiheään **Näkyy:** Kuusiryhmiä ja pilkahduksia syntyy tiheämmin.
- **Kulku 9 alkaa:** myrskyn läpi ylös latvojen yläpuolelle; päättyy `huuto`.

### Kuvatapa 10 Ylhäältä

#### 64 Huuto · `huuto` → `yksinaiset_aanet` · <!--aika-->15:45–16:00<!--/aika-->
- **Kuuluu:** Huuto: korkeat pitkät äänet täydellä voimalla *Soittaa:* jouset.
  - **Näkyy:** Horisontin viiva nousee korkealle ja kirkastuu yksin; muu väistyy; ei hahmoa, vain viiva.
  - **Tunne → keino:** yksinäinen, paljas → valo ja korkeus

#### 65 Myrskyn jälkeen · `yksinaiset_aanet` → `S_sempre_mf` · <!--aika-->16:00–16:21<!--/aika-->
- **Kuuluu:** Myrskyn jälkeen: yksittäiset äänet *Soittaa:* puhaltimet (klarinetti, pikkolo, bassoklarinetti).
  - **Näkyy:** Yksi kukkula kerrallaan nousee viivasta ja painuu; pikkolo on pilkahdus; ympärillä tyhjää.
  - **Tunne → keino:** paljas, hiljenevä → harvuus
- Kone kuuli: Liike tasaantuu **Näkyy:** Metsän huojunta ja kuusiryhmien vaihtuminen tasaantuvat.

#### 66 Kirjain S · `S_sempre_mf` → `loppuhuipennus` · <!--aika-->16:21–16:52<!--/aika-->
- **Kuuluu:** Kirjain S: viulut alkavat pitää ääntä *Soittaa:* jouset (viulut).
  - **Näkyy:** Viiva syttyy uudelleen viulujen korkeudelle mf-voimalla eikä enää lakkaa; sen yli kasvaa takaa koko orkesterin kuusiryhmät ja harjut.
  - **Tunne → keino:** rauhoittuva, kokoava → valo (viiva)
- Kone kuuli: Liike hidastuu **Näkyy:** Metsän huojunta laantuu, ja kuusiryhmiä kasvaa ja väistyy harvemmin.
- Kone kuuli: Matalat soittimet palaavat **Näkyy:** Maa syttyy.
- Kone kuuli: Liike tasaantuu **Näkyy:** Metsän huojunta ja kuusiryhmien vaihtuminen tasaantuvat.
- Kone kuuli: Musiikki nousee: basso ja yläkerros noin 7 s **Näkyy:** Maan hohto, latvat ja viiva nousevat noin seitsemän sekuntia.
- Kone kuuli: Basso lähtee liikkeelle pitkän paikallaan olon jälkeen **Näkyy:** Maa liikahtaa: urkupiste päättyy.

#### 67 Loppuhuipennus · `loppuhuipennus` → `loppu_Hduuri_alku` · <!--aika-->16:52–17:04<!--/aika-->
- **Kuuluu:** Loppuhuipennus *Soittaa:* koko orkesteri.
  - **Näkyy:** Kaikki kerrokset syttyvät kerran, viiva kirkkaimmillaan; sitten kuva ei sisällä mitään, mikä soisi.
  - **Tunne → keino:** viimeinen aalto, sitten pimeys → valo ja sen puuttuminen
- Kone kuuli: Basso vaikenee **Näkyy:** Maa sammuu.
- Kone kuuli: Keskikerros soittaa lyhyitä irrallisia ääniä (staccato) **Näkyy:** Erillisiä pilkahduksia keskikorkeudella.
- Kone kuuli: Musiikki laskeutuu: koko orkesteri noin 7 s **Näkyy:** Kaikki latvat, viiva ja harjut painuvat noin seitsemän sekuntia.
- Kone kuuli: Liike hidastuu **Näkyy:** Metsän huojunta laantuu, ja kuusiryhmiä kasvaa ja väistyy harvemmin.

#### 68 H-duuri-loppu alkaa · `loppu_Hduuri_alku` → `viimeiset_askeleet` · <!--aika-->17:04–17:24<!--/aika-->
- **Kuuluu:** H-duuri-loppu alkaa (divisi-jouset, mezzoforte) *Soittaa:* jouset (divisi).
  - **Näkyy:** Kajo nousee kauimman takaa; jousten kuusiryhmät edessä, hellät; viiva viulujen korkeudella, ei kirkas; kamera pysähtyy (nimetty).
  - **Tunne → keino:** hellä, koskettava, avoin → valo (kajo)
- **Kamera:** **Nimetty pysähdys 2.** Lähestyminen pysähtyy lopullisesti; kuva jää elämään vain äänestä ja lakkaa muuttumasta, kun ääni lakkaa.

#### 69 Viimeiset askeleet H-duurin alla · `viimeiset_askeleet` → `loppu_Hduuri_loppu` · <!--aika-->17:24–17:31<!--/aika-->
- **Kuuluu:** Viimeiset askeleet H-duurin alla (16 kertaa) *Soittaa:* bassot.
  - **Näkyy:** Maan sysäykset noin sekunnin välein kajon alla, hiljaa h:n korkeudella; lakkaavat.
  - **Tunne → keino:** hellä, viimeinen → maan sysäys

#### 70 H-duuri-loppu päättyy · `loppu_Hduuri_loppu` → `tiedoston_loppu` · <!--aika-->17:31–17:58<!--/aika-->
- **Kuuluu:** H-duuri-loppu päättyy *Soittaa:* jouset.
  - **Näkyy:** Jousten kuusiryhmät hiljenevät ja väistyvät; kajo jää.
  - **Tunne → keino:** hiljenevä → väistyminen
- **Kuuluu:** (`musiikki_loppuu`) Musiikki loppuu: teoksen jälkeinen hiljaisuus *Soittaa:* ei kukaan.
  - **Näkyy:** Kaari: kuva ei pimene, se lakkaa muuttumasta. Ei mitään, mikä soisi; kajo ja maa jäävät paikoilleen.
  - **Tunne → keino:** hiljaisuus, joka jäi → pysähtynyt kuva

## 6. Mistä kuva lasketaan

Kuva lukee vain ohjaustiedoston (`annotations/cues.json`) ja kaksi ruututiedostoa. Käsin ei ajoiteta mitään.

| Äänestä | Mistä | Kuvassa |
|---|---|---|
| nuotit (alku, kesto, sävel) | kuuntelutyökalu | jousten äänet kuusiryhminä, puhaltimien äänet harjuina, lyhyet korkeat pilkahduksina, matalat maan sysäyksinä |
| spektri ruututarkkuudella | kuuntelutyökalu | viivan kirkkaus, kukkulan korkeus ja muoto (yläsävelet), maan hohto ja värinä, metsän kohoaminen rekistereittäin |
| iskut | aksenttien tunnistus | maan sysäys, metsän heilahdus; vahva isku vaskijaksossa on leikkaus |
| koneen tapahtumat | kuuntelutyökalu | `purske` sallii pilkahdukset; muut tyypit (`nousu`, `lasku`, `kerros katoaa`, `kerros tulee`, `urkupiste`, `tremolo`, `liike`) näkyvät, koska kuva lasketaan samasta äänestä |
| ankkurit | teemakartta | kuka soittaa, mikä on pitkä ääni, kuvatapa, lumi, tuuli, väri |

Vahvan äänen ja basson yläsävelet suodatetaan pois: ne eivät ole soittajia. Ruutukanavia (`taso_dbfs` ja muut) ei
enää käytetä kuvan ohjaukseen, koska ne on laskettu sekunnin tarkkuudella.

## 7. Kameran nimetyt kohdat

Kuva lähestyy hitaasti koko ajan. Katseen korkeus ja etäisyys muuttuvat vain kuluissa (luku 2), jatkuvasti. Kamera ei
reagoi iskuun: maa ja metsä reagoivat. Pysähdyksiä on kaksi, ja ne on nimetty otoissa: C-duurissa (`auringonsade`) ja
H-duurissa (`loppu_Hduuri_alku`).

## 8. Auki

**Käyttäjä päättää:**
1. Sana kajo tarkoittaa tyyliohjeessa sekä käyrätorvien valoa että H-duurin väriä. Tässä käyrätorvien valo on viiva ja
   harjut, ja kajon väri tulee vasta H-duurissa.
2. Loppu: kuva jää paikalleen tiedoston loppuun eikä pimene.

**Tiedossa olevat puutteet:**
1. Kuuntelutyökalu ei erota soittimia toisistaan. Se, onko ääni puu vai harju, tulee ankkurista (kuka soittaa
   kuunteluoppaan mukaan), ei äänestä. Jaksoissa, joissa jouset ja puhaltimet soivat yhtä aikaa, kaikki äänet saavat
   saman roolin.
2. Kolmen C-duurin vilahduksen omia aikoja ei ole (`c_duuri_valahdykset`): punainen kasvaa tasaisesti.
3. Vaskivuorottelun osapuolia ei eroteta (`allegro_moderato_O_alku`): molemmat ovat harjuja.
4. Useimpien ankkurien aika on analyysin ehdotus, ei korvalla vahvistettu.

## 9. Lähteet

Kuunteluopas (`annotations/kuunteluopas.md`), tyyliohje (`docs/visuaalinen_tyyli.md`), käyttäjän sanat
(`docs/tutkimus/haastattelu.md`), taidehistorian haku (`docs/tutkimus/taide1920.md` luku 7). Hyvän kuvakäsikirjoituksen
kriteerit haettiin versiota 1 varten (kaari ennen ottoja, yksi ajatus per otto, ajoitus sidottu musiikkiin); ne
pätevät yhä.
