**Lue ensin `docs/visuaalinen_tyyli.md` kokonaan (kuvasäännöt luvussa 12, käyttäjän sanat luvussa 4d) ja `runs/vedos_v6/brief.md` kokonaan. Vasta sitten tämä.**


# Vedos 6: moduuli `visual/maailma_01_02.js` (alku), renderi `runs/alku_v4/osa.mp4` (0–61,6 s, 1848 ruutua), tarkistus `runs/alku_v4/tarkistus.md`

Käyttäjän rivit 60, 61 ja 62 (lue ne palautelistasta). Aiempi tausta: `runs/v5_01_02/brief.md` (lue, jotta tiedät mitä kuvassa
tapahtuu ja miksi; sen ajoitusluvut vaarojen tulosta kumotaan alla).

1. **Vaarat tulevat esiin usvasta hellästi ja vähitellen (rivi 60).** Käyttäjä: "Vasta sitten kun sieltä nousee niitä melodioita,
   niiden pitää hellästi tulla vähitellen esiin usvasta. Ne eivät vain voi 'ilmestyä' - mieti miten kummut toimivat maisemassa.
   Ei siinä yhtäkkiä ole kumpua." Nyt jokainen vaara tulee näkyviin noin sekunnissa ja saa kirkkaan reunavalon: se lukee
   ilmestymisenä. Korjaus: vaarat ovat maisemassa koko ajan, usva ohenee niiden edestä hitaasti.
   - Jokaisen vaaran näkyvyys kasvaa **vähintään viiden sekunnin** pehmeällä käyrällä (alkaa omasta paisutuksestaan), eikä
     minkään vaaran kontrasti taustaan saa muuttua yli noin 1,5 % ruutua kohti. Koska paisutuksia on kahden sekunnin välein,
     maisema kirkastuu jatkuvana, ei kahtenatoista tapahtumana.
   - Harjan valo on hillitty: enintään noin 40 % nykyisestä huipusta, nousu vähintään 2 s; se hengittää paisutuksen mukana mutta
     ei välähdä. Valon kulku harjaa pitkin puhaltimien sävelten mukaan saa jäädä, pehmeänä.
   - Perusteet: tyyliohje 4d kohdat 5, 17 ja 30, 7b "paljastuminen"; tutkimus: Guo Xi (usva erottaa tasot), "salo siintääpi sininen".
2. **Viulujen nopeutuva kuvio (rivi 61): puuska kasvaa.** `tuulenpuuska` (0:45,4) → noin 0:52: jousten kuvio tihenee ja voimistuu
   (cresc. molto fortissimoon). Nyt intensiteetti on tasainen. Tuulen voima, lumen nopeus ja tiheys, latvojen taipuma (enintään
   4 %) ja metsän tummuus kasvavat mitatun tason ja alkutiheyden (`d.cues.alut.korkea` ja `keski`) mukana tasaisesti huippuun ja
   laantuvat fraasiin 0:54. Sulavasti, ei portaita.
3. **Yleistauko (rivit 61 ja 62): kuva reagoi hiljaisuuteen, ja se on kulku.** `hiljaisuus_1_alku` (0:58,1): tuuli ja lumi
   rauhoittuvat pehmeästi noin 0,6 sekunnissa (ei kovaa katkosta, ei myöskään jatka entistä): metsä seisoo, lumi putoaa
   hitaasti suoraan alas, valon viiva on poissa. Koko tauon ajan (0:58,1–1:01,4) kamera **laskeutuu tasaisesti** latvojen
   tasolle ja niiden väliin, niin että metsän tumma massa nousee kuvan alareunasta ja täyttää kuvan vähitellen (kruunukentän
   omat latvat kasvavat ja ohittavat kameran; ei erillisiä piirrettyjä puita). Hetkellä `fis_pitka_aani` (1:01,6) kuva on
   rajakuva PIMEA_MASSA. Nyt loppu on häivytys, jossa vaara näkyy vielä viimeisellä sekunnilla: sen pitää olla laskeutuminen.
4. **Välke pois:** latvuston vaaleneminen kohdissa 0:08 ja 0:14 ruutu kerrallaan (loppukriitikon U8): muutokset pehmeiksi
   (vähintään 0,3 s), paitsi avauksen patarummun rengas, joka alkaa iskun ruudussa mutta leviää pehmeästi.
5. Matalakontrastinen usvakaistale metsän ja horisontin välissä 0–24 s: metsä jatkuu horisonttiin.

Liikesarjat: 23–45 s 0,5 s välein (vaarat tulevat huomaamatta esiin), 45–55 s (puuska kasvaa), 57,5–61,6 s 0,2 s välein
(hiljaisuus ja laskeutuminen). Mittaa vaarojen kontrastin muutos ruutua kohti kolmesta vaarasta.

## LISÄKORJAUS (10.11.2026 myöhäisilta): vaarojen järjestys. Käyttäjän palaute vedoksesta 6 (palautelistan rivi 80)

Käyttäjä: "Siis ihan tuo alku. Miten tuo yksi mäki ilmestyy noiden muiden mäkien eteen yhtäkkiä? Etkö ymmärrä että mäet ei toimi niin?"

**Vika:** vaarat paljastuvat paisutus kerrallaan satunnaisessa syvyysjärjestyksessä. Kun lähempi vaara tulee näkyviin myöhemmin
kuin kauempi, se ilmestyy jo näkyvän maiseman **eteen** ja peittää sen. Niin ei tapahdu luonnossa: usva on katsojan ja maiseman
välissä, ja kun se ohenee, **lähin näkyy ensin ja kauempi tulee esiin sen takaa**. Mikään ei voi tulla näkyviin jo näkyvän eteen.

**Korjaus (vain tämä; kaikki muu ennallaan):**
1. **Paljastusjärjestys on etäisyysjärjestys.** Järjestä vaarat etäisyyden mukaan ja anna ensimmäisen paisutuksen paljastaa
   lähin vaara, toisen seuraavaksi lähin ja niin edelleen; viimeinen ja kaukaisin on Tapion talo. Yhdenkään vaaran näkyvyys ei saa
   kasvaa, ennen kuin kaikki sitä lähempänä olevat ovat jo täysin esillä tai sitä pidemmällä.
2. **Jokainen uusi vaara nousee esiin edellisten takaa ja yläpuolelta.** Kauempi vaara on kuvassa korkeammalla kuin sen edessä
   olevien harjalinja ainakin osalla leveyttään (muuten se ei näy lainkaan): maisema kasvaa syvyyteen ja ylöspäin, horisontti
   kohoaa vaara vaaralta. Piirtojärjestys on kaukaa lähelle, ja lähempi peittää aina kauemman.
3. **Ilmaperspektiivi on johdonmukainen:** mitä kauempana, sitä vaaleampi, sinisempi ja pehmeämpi; lähin on tummin. Paljastumisen
   aikana vaaran sävy lähestyy tätä lopullista sävyä taustan sävystä (ei tummasta), jotta se ei näytä varjolta, joka putoaa
   maiseman päälle.
4. Tulon hitaus (vähintään viisi sekuntia) ja hillitty harjan valo säilyvät. Vaaran korkeus saa yhä tulla soittajan kulusta,
   kunhan ehto 2 täyttyy (skaalaa tarvittaessa tason mukaan).
Perusteet: tyyliohje 7b "paljastuminen" ja 4d kohdat 5, 18 ja 30; tutkimus: Guo Xi (usva erottaa etäisyyden tasot: lähin selvin).

Todiste: liikesarja 23–46 s 1 s välein ja lista: vaaran numero, etäisyys, paljastumisen alkuhetki (etäisyyden pitää kasvaa
ajan mukana). Katso sarja kriittisesti: missään ruudussa ei saa tulla mitään jo näkyvän harjan eteen. Renderöi koko väli
(1848 ruutua) lukon kautta samaan paikkaan ja lisää tarkistus.md:n lukuun "Vedos 6" kohta tästä.
