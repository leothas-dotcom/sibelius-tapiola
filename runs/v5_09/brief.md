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
