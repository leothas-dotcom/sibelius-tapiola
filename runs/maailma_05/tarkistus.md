# Maailma 5 (Väike): tarkistus

Moduuli `visual/maailma_05.js`, sivu `visual/maailma.html?m=05`. Aikaväli ankkurista `pohja_katoaa` (3:23, 203,0 s) ankkuriin
`pohja_vaihtuu_D` (5:36, 336,8 s), levytys Rattle / LSO 2022 (kuuntelukopio). Kaikki ajat tulevat `d.aika`sta.

## 1. Suunnitelma (kirjoitettu ennen koodia)

**Maailma.** Huurteen kiteen sisäpuoli. Kamera leijuu sinisessä hämärässä kiteen sisällä ja kulkee tasaisesti eteen
laaksoa pitkin, jonka kummallakin puolella nousevat tykkylumen pyöristämät harjanteet (kerroksittain syvyyteen, usvaan).
Harjanteet ovat metsä: tumma massa, jonka latvat ottavat kylmän valon reunaansa ja jonka alaosa on harva ja liukenee
usvaan. Ei maata: harjanteet leijuvat (pohja on kadonnut), niiden alla on pimeä tyhjyys. Kaukana laakson päässä
horisontissa on kiteen läpi tuleva valo (pitkä ääni): leveä vyö ja tiivis ydin. Ilmassa leijuu hitaasti huurteen hiutaleita
(lumi), jotka kulkevat kameran ohi.

**Siemenen kuva tässä maailmassa.** Horisontin valo (kiteen valo) / sen alla tumma harjanteiden massa kerroksittain /
sileät loivat kummut (pyöristetyt tykkylumen lohkareet) / lumi (huurteen hiutaleet). Sama kuva kuin maailmassa 1, mutta
huurteen aineessa ja kiteen sisällä katsottuna. Kamera ajaa kohti valoa koko ajan.

**Kameran reitti.** Alku: rajakuva HUURRE (vaalea huurrepinta aivan läheltä) hetkellä `pohja_katoaa`. Pinta on kiteen
ulkokalvo: kamera ajaa sen läpi, kalvo ohenee ja aukeaa keskeltä (valon kohdalta) ulospäin ja sen kuvio suurenee
(mittakaava muuttuu jatkuvasti), ja taakse paljastuu laakso ja harjanteet. Keskellä: sama tasainen vauhti
(nopeus seuraa vain uusien äänten hidasta tiheyttä), harjanteet liukuvat ohi viistosti (parallaksi). Loppu:
`jannitesoinnut`-hetkestä kide sulaa: harjanteet liukenevat usvaksi ja valo kerääntyy pisaraksi, joka sisältää
alun kuvan ylösalaisin (taittuminen). Pisara putoaa, kamera katsoo hitaasti alas ja laskeutuu sen mukana, musta jään
pinta nousee alhaalta, kasvaa ja täyttää kuvan: viimeinen ruutu on `RAJA.JAA`.

**Taulukko: kuunteluoppaan rivi → kuva → signaali**

| Kuunteluoppaan rivi | Mitä kuvassa tapahtuu | Signaali |
|---|---|---|
| 3:23 Kirjain C: pohja katoaa, viulut vajoavat, puhaltimet kuvioivat | Harjanteiden alaosa liukenee usvaan (leijuvat); viulujen hidas matto on kiteen valo ja harjanteiden tummuus; puhaltimien pienet kuviot ovat väikettä | `d.matala` (pohja), `d.keski` (jouset/valo), nuotit midi >= 72 lyhyet |
| 3:23 Pohja katoaa | Pohja (alaosan massa) häviää: harjanteet ohenevat leijuviksi nauhoiksi | `d.matala(t,1.2)` |
| 4:00 Pitkä e ja tiheät korkeat kuviot | Kiteen valon ydin kirkastuu (pitkä e); väike kulkee polkuja; kolme linnaa tulevat esiin pimeästä | `d.pitka`, nuotit |
| 4:12 Askeleet palaavat fis:llä | Pohja palaa: harjanteiden alaosa saa massan takaisin (paljastuu), jokainen askel nostaa hetkeksi valoa alhaalta harjanteiden alapintaan | `d.matala`, `d.alut` |
| 4:40 Nopean kuvioinnin jakso | Väike tihenee ja kulkee nopeammin (kolme kulkijaa), kameran vauhti kasvaa hitaasti tiheyden mukana | nuotit, tiheys (kertymä) |
| 5:03 Jakso päättyy | Väike harvenee, polut jäävät hetkeksi | nuotit |
| 5:10 Jännitteiset pitkät soinnut | Kide sulaa: usva tihenee, valo kerääntyy pisaraksi, pitkät soinnut pitävät pisaran valoa tasaisena | `d.koko`, `d.keski` |
| 5:26 Yläkerros nousee | Pisara irtoaa ja alkaa pudota; kamera alkaa katsoa alas | `d.korkea` (nousu) |
| 5:36 Pohja vaihtuu (raja) | Koko ruutu on jään pinta (RAJA.JAA) | ankkuri |

Staccato on pisteitä (väikkeen kärki), legato on säie (harjanteen latvan reuna syttyy yhtenäisenä viivana). Linnat:
kuusi ikkunaa kussakin, ikkunat syttyvät lyhyistä korkeista äänistä rekisterin mukaan, eivät koskaan kaikki kuusi yhtä aikaa.

---

## 2. Tarkistus (rakentajan oma, stilleistä; aikaraja vuoksi lyhyt)

Katsotut stillit (`runs/maailma_05/tark/`): 203, 204,5, 206, 207, 208, 210, 212, 214, 220, 225, 230, 240, 252, 260-262, 272, 285, 296, 305, 312, 316, 320, 324, 327, 330, 333, 335, 336,8. Koko väli renderöityy ilman virhettä. Liikesarjoja (0,2 s välein) ei ehditty ajaa: liike on tarkistettu vain harvoista stilleistä ja koodin perusteella.

### (a) Tyyliohjeen säännöt (luku 12, 4d) ja miten maailma elää
| Kohta | Tila | Perustelu |
|---|---|---|
| 0 ääni ohjaa | osin | valo (keski/pitka), tummuus (keski), pohja (matala), askeleet (alut), väike (nuotit), legato (pitkät nuotit); iskuja ei ole tässä välissä |
| 1-4 kamera | toteutuu | tasainen eteneminen, ei pyöri; loppupitchi enintään noin 9 °/s; ei reagoi iskuun |
| 5 siirtymä | toteutuu | alku: kalvo aukeaa 8 s, kuvio suurenee; loppu: pisara, jään pinta täyttää kuvan |
| 6 kolme kerrosta | toteutuu | lähellä tumma, keskellä, kaukana sininen (stillit 214, 262) |
| 9 metsä | osin | harjanteet ovat massaa, ei puita; ei rungoilta näyttävää yksityiskohtaa |
| 10-12 | toteutuu | iskuja ei ole; väike on yksi elementti, kolme kulkijaa |
| 14-17 värit | toteutuu | vain halla, salo, hopea; ei punaista, ei kajoa |
| 18 hiljaisuus | ei koske | välillä ei hiljaisuutta |
| 19-21 | toteutuu | ei hahmoja, tekstiä, jäljennöksiä |
| 4d 1 (korjattu 10.11.) | osin | harjanteet huojuvat tuulessa (`uSway`, aalto kulkee yli; amplitudi = jousten voima ja legato), usva-aukot ajelehtivat, hiutaleet leijuvat; mikään ei kasva, kutistu eikä pompi. Huojunnan liikettä ei ole katsottu sarjana |
| 4d 2, 3, 9, 18 | toteutuu | laaja syvä massa, kamera eteen, sileät pyöreät muodot |
| 4d 11, 14 | ei koske | linnat ovat omat (ei Tapion talo); ei yksittäistä puuta |
| 4d 17 | toteutuu | horisontin korkeus seuraa melodiaa 3 s keskiarvona |

Miten maailma elää ja mistä: huojunta ja latvojen valo (jousten voima, `d.keski`), kiteen valo (`d.keski` ennen e:tä, `d.pitka` sen jälkeen), pohjan massa (`d.matala`), askelvalo alhaalta (`d.alut`), väike ja polut (nuotit >= 72, lyhyet), linnojen ikkunat (samat nuotit rekisterin mukaan, enintään viisi kuudesta syttyneenä), säie latvalla (pitkät nuotit), kameran vauhti (uusien äänten tiheys, 6 s keskiarvo).

### (b) Kuunteluoppaan rivit
3:23 pohja katoaa: näkyy (stilleistä 205-214 massa ohenee leijuvaksi, mitattu `pohja`). 4:00 pitkä e: osin (ydin kirkastuu, 240 s). 4:12 askeleet: osin (valo alhaalta, ei erotettavissa stilleistä). 4:40 nopea jakso: osin (väikettä enemmän, ei katsottu sarjana). 5:10 sointuinen: näkyy (sulaminen, pisara). 5:26 nousu / pisara putoaa: näkyy (stillit 324-335). 

### (c) Rajakuvat
Alku 203,0 s: koko ruutu on `rajakuva(HUURRE)` (tarkistettu stillistä, kalvon peitto 1 koko ruudulla). Loppu 336,8 s: koko ruutu on `rajakuva(JAA)` (tarkistettu stillistä, `uEnd` = 1). Alku aukeaa 8 s:ssa, loppu ajetaan 26 s:ssa.

### (d) Omat lisäykset
Hiutaleet (lumi kuuluu siemeneen), huojunta (tyyliohje 4d 1), kalvon aukeaminen keskeltä (kulku kiteen pinnan läpi, käsikirjoitus 4->5), pisaran sisäinen ylösalainen kuva (taittuminen; ennakoi maailmaa 6), jään pinta vasta lopussa. Kameran korkeus pidetään harjanteiden yläpuolella; sulamisen aikana lähimmät harjanteet muuttuvat usvaksi (nimetty kulku).

### (e) Heikkoa, rehellisesti
- Linnat ovat heikot: kolme kumpua näkyvät vain reunoina ja ikkunat harvoin; kapeana kaukana ne eivät lue "linnoiksi". Ikkunoiden syttymistä ei ole tarkistettu sarjana.
- Etualan harmaa massa on litteä ja liian vaalea stilleissä 272-305; matala valaistus tekee siitä sameaa.
- Laakso on U-muotoinen, sama joka kerroksessa; ei voimakasta vaihtelua 20 sekunnin aikana (kuva on samannäköinen 214-312 s).
- Hiutaleet muistuttavat tähtiä pimeässä taivaassa.
- Sulamisvaiheessa (327-335) usva on harmaan vaalea; viimeinen ruutu on tummempi, siirtymä 1,6 s.
- Liikesarjoja, huojunnan nopeutta ja kameran 20 °/s -rajaa ei ole mitattu ruututarkasti; pitch on laskettu (enintään noin 9 °/s).
