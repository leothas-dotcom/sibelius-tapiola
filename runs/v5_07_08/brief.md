**Lue ensin `docs/visuaalinen_tyyli.md` kokonaan ja `runs/vedos_v5/brief.md` kokonaan (ja kaikki, mitä ne käskevät lukea). Vasta sitten tämä.**

# Korjaus: moduuli `visual/maailma_07_08.js` (ikisalo ja taottu aurinko), `jousijakso_urkupiste_E_alku` → `M_raskaat_askeleet`

Käyttäjä: "8:15, sellosoolo? Kaunis! Nyt ei tapahdu mitään" · "Voisiko siinä kohtaa kun altot soittaa, joku sumu tai muu
tuoda vähän eloa? 9:00 eteenpäin?" · "11:20 - mielestäni aurinko ei voi nykiä tuolla tavalla ylös alas. Ei se toimi niin
oikeasti. Sen pitää hitaasti alkaa nousta ja kohdassa 11:20 se täyttää valon ja valaisee tilan. Se oli hieno muuten"

Paikka, valokeilat pylväiden välissä ja Tapion pöytä säilyvät. Tätä moduulia ei ole vielä käynyt läpi yksikään kriitikko.

## 1. Kirjain K: jousiryhmät laulavat vuorollaan (ankkurit kuunteluoppaasta)
Musiikki on fraaseja ja hiljaisuuksia vuorotellen, kuin hengitys: `jousijakso_urkupiste_E_alku` → `_loppu` (sellot laulavat
neljään jaettuina sordiinolla), `K_viulut` (viulut vastaavat, lasimaiset huiluäänet alla), `patarumpu_ppp` (altot ja sellot,
maa värisee), `K_viulut_mezza` (viulut), `hitaat_soinnut` (jousikuoro dolce), `altot_mezza` (alttoviulut), sitten
`h_palaa_ennen_hiljaisuutta` ja `hiljainen_jakso_alku`.
- **Jokainen fraasi on valon ja usvan hengitys salin läpi.** Fraasin alkaessa valokeila pylväiden välissä kirkastuu ja usva
  alkaa virrata sen läpi; fraasin aikana usva kiertyy ja kulkee melodian kaaren mukaan (hitaasti, kertymänä); fraasin
  loppuessa keila himmenee ja usva laskeutuu. Fraasien välisissä hiljaisuuksissa äänen elementit lakkaavat ja sali jää
  (kuvasääntö 18), kamera jatkaa.
- **Korkeus on rekisteri:** sellojen laulu on matalalla, lähellä maata ja lähellä katsojaa (matala, täyteläinen valo
  runkojen tyvien välissä, hopea, ei lämmin); viulujen vastaus on korkealla latvuksessa ja kauempana (kylmä, kuulas valo
  ylhäältä); altot ovat keskikorkeudella. Näin katsoja näkee, kuka laulaa.
- **Sellojen laulun (8:16) pitää olla tapahtuma:** ensimmäinen kerta, kun tässä salissa jokin liikkuu. Laulun kaari näkyy
  (valo kulkee tai usva nousee ja laskee melodian mukana), ei pelkkä kirkastuminen.
- **`hitaat_soinnut` eteenpäin (käyttäjän pyyntö):** usva on koko ajan liikkeessä kerroksina eri korkeuksilla (pitkien sävelten
  korkeus = kerroksen korkeus), ja se kulkee valokeilojen läpi niin, että keilat näkyvät usvassa. Alttoviulujen fraasissa
  keskikerros tulee etualalle. Ei staattista usvaa, ei staattista lunta.
- `patarumpu_ppp`: maa värisee valona pöydän alla, kuten nyt, mutta sen päällä laulu (altot ja sellot) näkyy.

## 2. Taottu aurinko (C-duuri)
- **Aurinko ei koskaan liiku alaspäin eikä nyi.** Sen korkeus on yksi monotoninen, pehmeä käyrä: se alkaa nousta hitaasti jo
  kohdasta `allegro_359` (aluksi sitä ei näy, vain punertava aavistus horisontissa runkojen takana) ja on korkeimmillaan
  kohdassa `auringonsade`. `c_duuri_valahdykset` (kolme välähdystä) ovat **kirkkauden** vaihtelua runkojen raoissa (valo
  pääsee hetkeksi läpi), ei auringon liikettä.
- **Kohdassa `auringonsade` valo täyttää tilan ja valaisee sen:** punainen valo lankeaa runkojen välistä koko saliin, rungot
  heittävät pitkät varjot kohti katsojaa, usva hehkuu punaisena, pöytä on valossa. Kamera pysähtyy (nimetty pysähdys). Tämä
  on teoksen valoisin kohta ennen loppua, ja väärän värinen.
- `M_ennakko`: valo ei lämmitä eikä jää: se sammuu M:n iskussa (elementti on ympäristössä, ei katoa ruudussa vaan valon
  lähde peittyy), kamera lähtee liikkeelle jatkuvalla kiihdytyksellä.
- Korjaa: punainen usva ei saa rajautua kovareunaiseen suorakulmioon; valon reunat ovat pehmeät ja seuraavat runkoja.

## 3. Muut
- Tapion pöytä on nyt pieni palkki: tee siitä tunnistettava (kolme runkoa pystyssä, vaakalauta päällä; mittakaava suuri;
  tyyliohje luku 4 ja käsikirjoituksen maailma 7).
- Kumipuusääntö: pylväät (rungot) eivät liiku koskaan.

## Tarkista liikesarjoista
`jousijakso_urkupiste_E_alku` + 8 s (sellojen laulu näkyy tapahtumana), `K_viulut`, `hitaat_soinnut` + 20 s (usva liikkuu),
`altot_mezza`, väli `allegro_359` → `auringonsade` 2 s välein (auringon korkeus kasvaa joka ruudussa tai pysyy, ei koskaan
laske: mittaa myös koodista ja raportoi), `auringonsade` (tila on valossa), `M_ennakko`.

## 4. LISÄYS 10.11.2026 (käyttäjän uusi palaute; teemakartta ja kuunteluopas päivitetty, lue rivit 10:13–10:58 uudelleen)
Käyttäjä: "Trumpetti ja patarumpu kommentti kohdassa 10:28 on sinulta jäänyt täysin huomiotta - se on tärkeä! Tuleee
ensimmäistä kertaa. Sitten 10:34 tempo alkaa nousta? Pitää näkyä kuvassa - intensiteetti nousee? Miksi ei näy mitenkään?"

- **Uusi ankkuri `trumpetit_patarummut_356`** (nimetty isku; kesto noin viisi sekuntia, loppu `d.cues`in kentässä `t_loppu` jos se
  on, muuten mittaa tason lasku): trumpetit, pasuunat ja patarummut **takovat** samaa säveltä painotetuin iskuin, fff. Vaskien
  rytmi kuullaan tässä ensimmäisen kerran koko teoksessa, joten sen pitää olla kuvassa selvästi uusi asia, ei yksi valon
  välähdys muiden joukossa. Tyyliohje luku 7: trumpetit ja pasuunat ovat **läpi tuleva valo** (pystysuora leikkaus kerrosten
  läpi, "jyrinä: useita leikkauksia"), patarummut **pohjan tärähdys**. Siis: **jokainen painotettu isku on oma pystysuora valon
  leikkauksensa salin runkojen välistä ja oma tärähdyksensä maassa**, mitatuissa iskujen kohdissa (`d.aksentit` tai ylä- ja
  matalan kaistan alut tältä väliltä; rytmiä ei keksitä). Leikkaukset tulevat takaa eteen: jokainen on edellistä lähempänä ja
  kirkkaampi huippuun asti, ja rungot jäävät niiden eteen mustiksi siluetiksi. Väri on kylmä (halla), ei punainen. Dim. molto:
  valo vetäytyy takaisin syvyyteen. Aiempi `vaski_tutti_620` on paisutuksen saapuminen: se johtaa tähän, ei kilpaile sen kanssa.
- **`allegro_359` (aika muuttui, nyt taso­kuopan kohdalla 10:34): tempo nopeutuu ja intensiteetti nousee.** Tästä alkaa näkyvä
  kiihtyminen, joka jatkuu `auringonsade`en asti: kameran vauhti kasvaa jatkuvasti (ei nykäystä), usvan ja lumen virtaus
  nopeutuu, valon liike runkojen välissä tihenee liiketiheyden mukaan (uusia säveliä sekunnissa, kertymänä), ja kuva kirkastuu
  ja nousee (ylälinja kohoaa: valo siirtyy tyvistä latvuksiin). Katsojan pitää huomata 10:34–10:58, että jokin on lähtenyt
  liikkeelle ja kasvaa. Auringon nousu (kohta 2) alkaa samasta ankkurista ja on osa tätä.
- Tarkista liikesarjoista: `trumpetit_patarummut_356` − 1 s … + 6 s 0,1 s välein (leikkaukset iskujen kohdilla, lähestyvät),
  ja `allegro_359` … + 24 s 2 s välein (kiihtyminen ja kirkastuminen näkyvät).
