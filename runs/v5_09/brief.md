**Lue ensin `docs/visuaalinen_tyyli.md` kokonaan ja `runs/vedos_v5/brief.md` kokonaan (ja kaikki, mitä ne käskevät lukea). Vasta sitten tämä.**

# Korjaus: moduuli `visual/maailma_09.js` (petos ja hermo, pimeä metsä), `M_raskaat_askeleet` → `hiljaisuus_2_alku`

Käyttäjä: "Jossain kohtaa, en muista missä, puun rungot bugitti - ne välkkyivät ja niissä näkyi jotain ihme värinöitä ja
piikkejä." Ohjaaja löysi kohdan mittaamalla: **se on tämä moduuli.** Katso itse: `runs/maailma_09/osa.mp4`, liikesarja 3 ruudun
välein esimerkiksi kohdista 8 s ja 116 s moduulin alusta (teoksen ajassa noin 11:40 ja 13:28). Rungot ovat **joka 0,1 sekunti
täysin eri paikoissa**: koko metsä vaihtuu ruutujen välillä. Runkojen reunoissa on lisäksi kyhmyjä ja piikkejä.

## 1. Vika (estävä): rungot eivät pysy maailmassa paikallaan
- Etsi syy koodista (todennäköisesti kameran matka on liian suuri ruutua kohti, solujen satunnaisluku riippuu ajasta, tai
  matkan kertymä hyppää). **Jokainen runko on maailmassa kiinteässä paikassa** ja liikkuu kuvassa vain kameran liikkeen takia.
- Kameran nopeus on uskottava kulkijan tai hitaan ajon nopeus: lähin runko ohittaa katsojan sekunneissa, ei ruuduissa.
  M:n jälkeen kamera kulkee nopeammin kuin ennen (tyyliohje luku 5), mutta jatkuvasti ja niin, että rungot ovat seurattavissa.
  Raportoi nopeus metreinä sekunnissa koko väliltä ja lähimmän rungon siirtymä pikseleinä ruutua kohti (enintään noin 2 %
  kuvan leveydestä ruudussa).
- Runkojen reunat ovat sileät: ei kyhmyjä, piikkejä eikä värinää. Jos tremolo saa jonkin väreilemään, se on valo tai usva,
  ei rungon muoto (kumipuusääntö: rungot eivät liiku koskaan).
- Todiste: liikesarjat samoista kohdista korjauksen jälkeen, 1 ruudun välein (12 ruutua): sama runko tunnistuu ruudusta toiseen.

## 2. Kuunteluoppaan rivit (lue 11:31–14:05 sanasta sanaan)
`M_raskaat_askeleet` (matala ais sykkii kahdeksantoista kertaa: paino maassa suurena ja pehmeänä, vasket yllä),
`jannitejakso_alku` (jousten hermo: nopea, kromaattinen; tässä valo ja usva runkojen välissä hermoilevat, eivät rungot),
`O_kirjain`, `jannitejakso_loppu`, `allegro_moderato_O_alku` → `_loppu` (käyrätorvien < > ja trumpettien hidas vuorottelu:
kaksi valon lähdettä eri puolilla hengittää vuorotellen), `harva_kuviointi` (tyven), `P_vaskipaisunta` (nimetty isku:
vaskien suuri paisutus tulee takaa eteen), `dim_possibile` (metsä tyhjenee, jouset espressivo), loppu rajakuvaan PIMEA_MASSA.
- Kriitikon kierros 1: **yli 20 sekuntia lähes mustaa kohdassa `harva_kuviointi` + 5 s … `P_vaskipaisunta`**, ja tremolon, nousun
  ja laskun vastine ei erotu. Pimeässäkin on aina kolme syvyyskerrosta ja jokin, joka vastaa ääneen (harvat kuviot ovat
  harvoja pilkahduksia tai valon liikahduksia; pohja katoaa = maa häipyy).
- Ei staattista lunta.

## Tarkista liikesarjoista
Kaksi vikakohtaa (yllä), `jannitejakso_alku` + 5 s, vaskien vuorottelu (kaksi lähdettä vuorottelee), `harva_kuviointi` + 10 s
(ei mustaa), `P_vaskipaisunta` ± 2 s, kontaktiarkki koko välistä 10 s välein.

## KIERROS 2 (10.11.2026): kriitikon raportti `runs/maailma_09/kriitikko_v5.md` ja ohjaajan päätökset. Lue raportti kokonaan.

**Runkojen välkkyminen on korjattu** (kriitikko todensi koko väliltä): rungot pysyvät, reunat ovat sileät, kamera kulkee kävelyn
vauhtia, 0–133 s lukee syvänä metsänä, vaskien vuorottelu ja harva kuviointi näkyvät. **Säilytä nämä.** Renderi ei silti kelpaa
(kuusi estävää). Ohjaajan päätökset; videon aika, nolla = moduulin alku:

1. **Loppu 133–154 s (estävä): metsä pysyy metsänä viimeiseen ruutuun.** Tasakorkea suorakaideseinä ja rakenteeton massa pois.
   `dim_possibile`: vasket häipyvät, jouset sanovat vielä jotain ilmeikkäästi: viimeinen valo runkojen välissä hiipuu ja metsän
   tumma aalto käy vielä kerran. Kamera jatkaa samaa vauhtia ja kulkee kohti tiheää kuusikkoa: lumiset oksat tulevat lähelle ja
   ohi, niiden välinen pimeä kasvaa, ja vasta viimeiset noin kaksi sekuntia ovat kulku oksiston läpi rajakuvaan PIMEA_MASSA.
   Kolme syvyyskerrosta ja parallaksi näkyvät loppuun asti.
2. **Laattarungot (estävä):** leveät tummat suorakaiteet, joilla on terävä vaakasuora alareuna (6–7,5 s, 36–41 s, 119–123 s,
   129–131 s). Jokainen runko kapenee ylöspäin hieman, levenee tyvestä juurenniskaksi ja uppoaa lumeen pehmeästi (lumikinos tyven
   ympärillä, ei leikkausviivaa). Rajaa lähimmän rungon leveys niin, ettei se täytä kuvaa laattana; lähirungoissa saa näkyä
   kaarnan pystysuuntainen pintarakenne (sidottu runkoon, ei välky).
3. **Kirjain P (estävä): paisutus, ei kahden sekunnin välähdys.** Partituurissa vasket ja patarummut alkavat hiljaa ja kasvavat
   viiden tahdin aikana fortissimoon. Mittaa `P_vaskipaisunta`sta eteenpäin tason käyrä (noin 10 s) ja anna valon seurata sitä:
   valo syttyy kaukana runkojen takana ankkurin ruudussa, **kasvaa ja tulee kerros kerrokselta lähemmäs koko paisutuksen ajan**
   (rungot jäävät sen eteen siluetiksi, valokeilat usvassa), on voimakkaimmillaan mitatussa huipussa ja vetäytyy sen jälkeen.
4. **Raskaat askeleet (estävä): kahdeksantoista, ei yksitoista.** Aukot kohdissa 4,8–8,2 s ja 15,0–17,7 s. Mittaa matalan ais:n
   sykkeet herkemmin (taso ja sen derivaatta, paikallinen kynnys); jos mittaus ei löydä kaikkia, raportoi löydetyt ajat ja käytä
   vain niitä (rytmiä ei keksitä), mutta varmista ensin, ettei kynnys ole liian korkea. Jokainen askel on suuri ja pehmeä.
5. **Jousten hermo 19,4–43 s (estävä): kuvassa ei tapahdu mitään.** Nopea, kromaattinen, hermostunut kuviointi: usvan ja valon
   nopea, hienojakoinen väre runkojen välissä (liiketiheyden mukaan, kertymänä), tuulenpuuskat ravistavat lunta oksilta
   purskeina, lumi virtaa nopeammin ja vaihtaa suuntaa puuskissa, metsä tummenee ja terävöityy jousten voiman mukana. Katsojan
   pitää tuntea levottomuus. Rungot eivät liiku.
6. **Kirjain O (estävä): ajallaan ja näkyvästi.** Vastine alkaa ankkurin ruudussa (nyt 0,4 s myöhässä): oboet ovat ohut valojuova
   kaukana runkojen välissä, klarinetit puoliksi näkyvä liike keskikerroksessa (tyyliohje luku 7), vasket hiljaa alla matalana
   hehkuna.
7. Hehku ei saa leikkautua suorakaiteeksi (45,0 s ja 95,0 s). Vuorottelun kaksi valoa tarvitsevat lähteen: ne ovat runkojen
   takana, rungot peittävät niitä ja keilat näkyvät usvassa; ei irrallisia pallukoita.
8. Nousut ja laskut (11:58, 12:09, 12:55) ja tremolo (11:42): valon korkeus runkojen välissä siirtyy näkyvästi (lasku: valo
   painuu latvuksesta maahan; nousu: maasta latvukseen), tremolo on valon väre paikallaan.

Renderöi koko väli uudelleen samaan paikkaan, tee liikesarjat jokaisesta kohdasta, askelten lista aikoineen, ja kirjoita
`runs/maailma_09/tarkistus.md` uudelleen.

