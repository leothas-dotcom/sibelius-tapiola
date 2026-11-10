**LUE ENSIN KOKONAAN `docs/visuaalinen_tyyli.md` (erityisesti luvut 2, 3, 6, 7, 7b, 8, 12 ja 4d kohdat 23–37) ENNEN MITÄÄN MUUTA.** Sitten `docs/tapiola_tutkimus.md` luku 8 (metsämytologia) ja tämä brief: yhteinen osa ja oman moduulisi luku.

# Vedos 8: taika ja uhka (palautelistan rivi 95)

Käyttäjä 11.11.2026: "Olet tehnyt hienoa työtä, ja tämä video tekee kunniaa Sibeliukselle, taiteelle ja musiikille. UPEAA!!!
Renderöi tämä, ja kokeile sen jälkeen laittaa jokaiseen kohtaukseen vähän taikaa. Suomalaisen ikimetsän taikuutta, ja samalla
jotain uhkaavuutta. Niiden kahden leikki. Totellen tietysti visuaalista tyyliä, niinkuin aina. Mieti mikä nostaisi tämän videon
vielä uudelle tasolle?"

Lähtökohta on **vedos 7**, josta käyttäjä sanoi nämä sanat nähtyään vedokset 5 ja 6. Vedos 7 ei saa muuttua: taika ja uhka ovat
**ohut lisäkerros** sen päällä. Sibeliuksen oma esipuhe antaa parin: "brooding savage dreams" ja "wood-sprites in the gloom weave
magic secrets" (suom. "haltiat väikkyy, hämyn äänet soi"). Ainekset ovat tutkimuksen luvun 8 mytologiasta, ei keksittyjä.

## Sanasto: kolme taikaa ja kolme uhkaa (kaikki valoa, lunta, huurretta, usvaa ja varjoa: ei hahmoja, ei esineitä)

- **T1 Hopea oksilla** ("kuuna paistoi kuusen oksat", K14): huurre oksissa, latvoissa tai kaarnassa välähtää hopeisena
  aaltona, joka kulkee metsän yli korkean soittimen fraasin mukana. Pieniä kylmiä kimalluksia, ei valonlähteitä.
- **T2 Tapion talon ikkunat** ("ukset kuumottivat poikki suosta", "kuusi ikkunaa", K14): kaukana runkojen välissä himmeitä,
  kylmiä valoaukkoja, joiden luo ei pääse: ne vetäytyvät, kun kamera lähestyy, ja sammuvat, kun jokin raskas soi.
  **Väri on halla (kylmä sinivalkoinen), ei kulta:** lämmin valo on varattu H-duurille (luku 3).
- **T3 Hiidenväen kulku** ("liike, jolla ei ole näkyvää tekijää", "helinän saattelemana"): lumi varisee oksilta jonona,
  joka etenee metsän läpi, tai lumipöly pöllähtää polkua pitkin askel kerrallaan, vaikka kulkijaa ei näy.
- **U1 Metsänpeitto** ("äänet vaimenevat, polku päättyy, latvat sidotaan yhteen", SKVR VI2 5391): metsä sulkeutuu. Aukko
  edessä täyttyy usvalla, latvojen väli pimenee ylhäältä, kimallukset ja ikkunat sammuvat. Poissaoloa, ei näytöstä.
- **U2 Pakkanen** ("kylmä soita, kylmä maita", SKVR II 625a): huurre etenee pintoja pitkin katsojaa kohti (runkojen
  kaarna, jää, lumen pinta), hitaasti ja pysäyttämättömästi, urkupisteiden ja pitkien matalien äänten aikana.
- **U3 Kulkeva varjo** ("päivän peitti paistamasta", K2; Tapio on metsä itse: paino ja se, mikä tulee läpi): suuri, pehmeä
  varjo liukuu valon yli (lumen hohteen, valokeilojen, latvuston yli), kun basso liikkuu. Varjon tekijää ei näy.

**Leikki:** taika ja uhka vastaavat toisilleen samassa kuvassa. Kun varjo (U3) kulkee, kimallus (T1) sammuu sen alta ja
syttyy uudelleen sen takana. Pakkanen (U2) on se, mikä tekee hopean (T1): sama huurre on kaunis ja kylmä. Ikkunat (T2)
houkuttelevat, metsänpeitto (U1) sulkee ne. Hiidenväki (T3) säikähtää basson askelta.

## Säännöt (sitovat)

**S1. Kytkin.** Kaikki tämän briefin lisäykset ovat URL-valinnan `taika` takana: `visual/maailma.html?m=<k>&aa=2&taika=1`
piirtää ne; ilman valintaa (tai `taika=0`) moduuli piirtää **täsmälleen vedoksen 7 kuvan**. Lue valinta kuten muutkin
(`new URLSearchParams(location.search)`). Lisäysten voima kerrotaan yhdellä kertoimella `TAIKA` (0 tai 1), eikä mikään
vanha laskenta saa riippua siitä.
**S2. Todiste koskemattomuudesta:** renderöi koko moduuli `taika=0`:lla ja aja
`render/vertaa.py runs/vedos_v7/osat/<k>.mp4 <taika0-renderi> <osan alku s> 2 0.5`: tuloksen pitää olla **0 muuttunutta
jaksoa**. Vasta sitten renderöi `taika=1`.
**S3. Vähän.** Käyttäjä: "vähän taikaa". Enintään kaksi lisäystä on näkyvissä yhtä aikaa, ja selkeyden sääntö (luku 8:
enintään kolme liikkuvaa elementtiä) pätee lisäykset mukaan lukien. Lisäys ei saa nostaa kuvan keskikirkkautta yli 6 %
eikä peittää sitä, mikä musiikissa puhuu. Jos katsoja huomaa lisäyksen ennen musiikin tapahtumaa, se on liian suuri.
**S4. Ääni ohjaa.** Jokainen lisäys alkaa ja loppuu ankkurista, mitatusta alusta (`cues.alut`), pitkästä äänestä tai
kanavasta. Ei kovakoodattuja sekunteja, ei omaa kelloa. Rytmiset lisäykset (jos niitä on) osuvat soitettuihin ääniin
ruudulleen (4d.33); muut ovat hitaita (nousu vähintään 1 s).
**S5. Tyyli.** Ei hahmoja, kasvoja, eläimiä, silmiä (ei kahta valoa vierekkäin samalla korkeudella), ei esineitä, ei
tekstiä. Ei lämpimiä värejä, ei vihreää (revontulet kuuluvat loppuun). Puut elävät vain 4d.31:n rajoissa; lumi 4d.32:n.
Ei mitään iskussa ilmestyvää: lisäys paljastuu tai syttyy ympäristössä, joka on jo kuvassa.
**S6. Ei saa koskea:** moduuli 11_12 (loppu); käyttäjän kehumat kohdat säilyvät sellaisinaan ja niiden aikana lisäyksiä
**ei näytetä**: pimeän metsän valo ja sykkeet (rivi 63) niin, ettei niitä peitetä; salin valot ja usva 9:40 →
C-duuri (rivit 70, 71, 72); varjojen metsä 11:32–12:44 saa vain oman moduulinsa luvussa nimetyn lisäyksen (rivit 73, 92).
**S7. Todisteet** (`runs/maailma_<k>/tarkistus.md`, luku "Vedos 8"): S2:n tuloste; liikesarja jokaisesta lisäyksestä
`taika=1`-renderistä vedoksen 7 saman kohdan rinnalla; `vertaa.py` vedosta 7 vastaan `taika=1`:llä (jokainen jakso
nimetään lisäykseksi); keskikirkkauden muutos lisäyksen aikana. Renderin rajat: sekunteja teoksen ajassa (taulukko
`runs/vedos_v7/brief.md` kohdassa T1). `taika=1`-osa kirjoitetaan paikkaan `runs/maailma_<k>/osa_v8.mp4`
(01_02: `runs/alku_v4/osa_v8.mp4`); **vedoksen 7 `osa.mp4`:ää ei ylikirjoiteta**.
Älä koske yhteisiin tiedostoihin, älä commitoi, älä kysy käyttäjältä. Raportoi rehellisesti, mikä jäi vajaaksi.

## Lisäykset moduuleittain (ohjaajan ehdotus; käyttäjä pyysi kokeilemaan)

### 01_02 (alku, 0:00–1:01,6)
- **T1:** kun puupuhaltimet paisuvat gis-viivan päällä (vaarojen paljastumiset), hopeinen kimallus kulkee latvojen yli
  yhtenä hitaana aaltona vaaran suunnasta katsojaa kohti: latvojen huurre välähtää ja sammuu (aallon leveys noin viidennes
  metsän syvyydestä, kesto fraasin mittainen).
- **U3:** jousten siemenmotiivin aikana (moduulin alku ja paluut) suuri pehmeä varjo liukuu hitaasti metsämaton yli
  poikittain: sen alla metsä on 12–15 % tummempi ja kimallus sammuu.
- **U1:** yleistauossa kimallus ja varjo ovat poissa: pelkkä metsä (tyyliohje 2.6).

### 03_04 (pimeä metsä, 1:01,6–3:23)
- **T3:** jokaisen basson askeleen (moduulin `askeleet`) jälkeen lumi varisee oksilta: ohut lumipölyn valuma putoaa
  valossa lähimmistä latvuksista 0,3 s askeleen jälkeen ja seuraavista kauempana viiveellä, niin että variseminen etenee
  polkua pitkin poispäin (ikään kuin jokin kulkisi edellä). Pölyä vähän: se näkyy vain valon kohdalla.
- **T2:** pitkien alttoviulufraasien välissä kaukana polun päässä häämöttää hetken kolme himmeää ikkunaa; ne sammuvat
  seuraavaan askeleeseen. Eivät koskaan tule lähemmäs.
- **U3:** kun basso liikkuu (askeljakso), runkojen varjot lumella kääntyvät hitaasti muutaman asteen ja palaavat, kuin
  valon ja metsän välistä kulkisi jotain suurta. Ei muuta.

### 05 (kide ja keijuvalot, 3:23–5:36,8)
- Taika on jo kuvassa (keijuvalot). **Leikki lisätään:** kun basson askeleet palaavat fis:llä (`askeleet_fis`), jokainen
  askel himmentää keijuvaloja ja horisontin hohdetta 20–25 % noin 0,4 s:ksi (valot säpsähtävät), ja **U3:** pehmeä varjo
  kulkee horisontin hohteen poikki askeleen suuntaan.
- **T1:** kiteen ja harjanteen huurre kimaltaa hopeisena pitkän e:n aikana (`e_pitka_ja_kuviot`), hyvin hiljaa.

### 06 (jää, 5:36,8–8:16,3)
- **U2 ja T1 samassa:** Tapion jyrinästä (`h_urkupiste_vyory`, 7:01) alkaen huurre hiipii rannasta jäätä pitkin katsojaa
  kohti (himmeä, hienojakoinen huurrerintama, joka etenee koko jakson ajan urkupisteen päällä), ja englannintorven laulun
  aikana (7:15) rintaman tuoreessa huurteessa syttyy pieniä hopeisia tähtiä huilun trillien mukana.
- **Leikki:** nymfien valot (5:48–6:30) väistävät jään alla kulkevaa painoa: kun basson askel tai Tapion hehku on valon
  alla, lähimmät valot himmenevät 30 % 0,3 s:ksi. Valojen paikkoja ja ajoitusta ei muuteta.

### 07_08 (ikisalo, 8:16,3–11:31,6): **lisäyksiä vain ennen kohtaa 9:40**
- **T3:** sellojen fraasien aikana (K, 8:16–8:50) lumipölyn ohut juova kulkee pylväiden välissä salin poikki fraasin
  mittaisena, kuin jokin näkymätön kulkisi pöydän ohi; se ei koske usvavyöhön.
- **U2:** alttoviulujen hiljaisen jakson aikana (noin 9:00–9:40) huurre nousee hitaasti lähimpien runkojen kaarnaa pitkin
  tyvestä ylöspäin (kylmä hiipii saliin). Ei muuta. Kohdasta 9:40 eteenpäin kuva on täsmälleen vedos 7.

### 09 (pimeä metsä, 11:31,6–14:05,6)
- **Varjojen metsään (ennen 12:44) ei lisätä mitään.**
- **T2:** taitteen jälkeen (`P_taite_494` → `dim_possibile`) avautuneessa sinisessä tilassa kaukana runkojen välissä
  näkyy Tapion talon kuusi himmeää ikkunaa (kaksi kolmen riviä eri korkeuksilla ja eri etäisyyksillä; ei pareja
  vierekkäin samalla korkeudella). Ne vetäytyvät kameran edellä.
- **U1:** `dim_possibile`sta hiljaisuuteen metsä peittää: ikkunat sammuvat yksi kerrallaan kaukaisimmasta alkaen, latvojen
  väli pimenee ylhäältä alas ja usva sulkee aukon edessä. Hiljaisuuteen mennessä jäljellä on vain pimeä metsä.

### 10 (myrsky, 14:05,6–15:45)
- **T1 ennen myrskyä:** kun myrsky vasta näkyy kaukana (moduulin alku → myrskyn tulo), jään takaisen metsänreunan huurre
  välähtää hopeisena kerran, hitaasti päästä päähän, ja rintama nielee sen (viimeinen taika ennen ylivoimaa).
- Myrskyyn itseensä ei lisätä mitään: se on jo uhka.

### 11_12 (loppu): ei kosketa.
