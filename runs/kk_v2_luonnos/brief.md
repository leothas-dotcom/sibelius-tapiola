**Lue ensin `docs/visuaalinen_tyyli.md` kokonaan ja sen luvut 4b, 4c ja 12. Luku 4c voittaa vanhemmat kohdat. Vasta sitten mitään muuta.**

# Brief: kuunteluoppaan jokainen kohta kuvaksi (kk_v2_luonnos, 9.11.2026)

Olet käsikirjoittajan apulainen. Et tunne aiempaa keskustelua; kaikki sitova on tässä ja nimetyissä tiedostoissa.
Vastaa suomeksi. Sävelnimet suomeksi (H = englannin B, B = englannin B♭). Musiikkisanasto muusikon suomeksi.

## Miksi

Käyttäjä (orkesterimuusikko, teoksen tilaaja) 9.11.2026: "Työskentele, kunnes kuunteluoppaan KAIKKI asiat on
visualisoitu VISUAALISEN TYYLIN mukaan. Muista, selkeys voittaa aina." Aiempi kuvakäsikirjoitus ei toteuttanut
kuunteluopasta. Tarvitaan täydellinen luettelo: jokainen kuunteluoppaan rivi ja sen vastine kuvassa tyyliohjeen
luvun 4c kielellä.

## Lue tässä järjestyksessä

1. `docs/visuaalinen_tyyli.md` kokonaan. Luku 4c (kerrosmaisema: kuva on ääni) on kielioppi, jota käytät. Luku 4b
   (kymmenen kuvatapaa) kertoo katsojan paikan. Luku 3 on väri.
2. `docs/tutkimus/haastattelu.md` kokonaan: käyttäjän sanat.
3. `annotations/kuunteluopas.md` kokonaan, alusta loppuun. Tämä on tehtävän aineisto.
4. `docs/kuvakasikirjoitus.md` luvut 1 ja 2 (kaari: kaksitoista hetkeä ja niiden kuvatavat; maailmat).
5. `annotations/cues.json` Pythonilla (`.venv\Scripts\python.exe -I`): kenttä `cues` (ankkurit: `id`, `t`, `nimi`).
   Tarvitset ankkurien tunnisteet. Älä tulosta koko tiedostoa.

## Tehtävä

Kirjoita `runs/kk_v2_luonnos/luonnos.md`. Siinä on yksi taulukko, aikajärjestyksessä, ja siinä on **jokainen**
kuunteluoppaan minuuttilistan rivi: lihavoidut nimetyt kohdat JA lihavoimattomat koneen kuulemat rivit (nousu, lasku,
kerros katoaa, urkupiste, staccato, liike kiihtyy, isku ja niin edelleen). Älä jätä yhtään riviä pois äläkä yhdistä
rivejä.

Sarakkeet:
1. **Aika** kuunteluoppaasta.
2. **Kuunteluoppaan kohta** lyhyesti (otsikko ja ydin yhdellä lauseella).
3. **Ankkuri**: `cues.json`:n tunniste, jos rivi on nimetty ankkuri (täsmää nimen ja ajan mukaan); muuten viiva.
4. **Kuka soittaa** kuunteluoppaan mukaan: jouset / puhaltimet / käyrätorvet / vasket / bassot / patarummut / koko
   orkesteri / ei tietoa.
5. **Kuvassa**: mitä katsoja näkee, yhdellä tai kahdella lauseella, VAIN tyyliohjeen 4c sanoilla: tumma metsä
   (kuusiryhmät), horisontin viiva, kukkula, harju, pilkahdus, maa (sysäys, värinä, hohto), pystysuora leikkaus, lumi
   kerrosten välissä, taottu aurinko, kajo. Kerro, mikä muuttuu ja mihin suuntaan (nousee, väistyy, tihenee, laskee).
6. **Kuvatapa**: luvun 4b numero ja nimi, joka on voimassa (kuvakäsikirjoituksen luvun 1 mukaan).
7. **Tunnelma → keino**: kuunteluoppaan nimeämä tunnelma ja se, millä kuva tekee sen (valo, tiheys, etäisyys, liike).
8. **Huomio**: tyhjä, tai yksi näistä: KIELIOPPI EI RIITÄ (4c ei osaa sanoa tätä; ehdota yksi uusi sääntö sen
   hengessä) / RISTIRIITA (kuunteluopas ja käsikirjoituksen kuvatapa eivät sovi yhteen) / EPÄSELVÄ (kuunteluopas ei
   kerro, kuka soittaa).

Taulukon jälkeen:
- **Roolien aikajana:** luettelo ankkureista, joissa vaihtuu se, kuka on etualalla: jouset (tumma metsä) vai
  puhaltimet ja käyrätorvet (viiva, kukkulat, harjut), ja mikä on teoksen pitkä ääni kullakin jaksolla (sävel).
  Vain se, minkä kuunteluopas sanoo; merkitse arvaus arvaukseksi.
- **Kohdat, joissa kielioppi ei riitä** koottuna, ja jokaiselle yksi sääntöehdotus.
- **Laskuri:** montako riviä kuunteluoppaassa oli ja montako taulukossa on. Lukujen pitää täsmätä.

## Rajat

- Kirjoita vain `runs/kk_v2_luonnos/luonnos.md`. Älä muuta mitään muuta tiedostoa. Ei verkkoa, ei gittiä, ei äänen
  kuuntelua, ei partituuria.
- Älä keksi lainauksia. Käyttäjän sanoja saa lainata vain sanasta sanaan haastattelusta tai kuunteluoppaasta.
- Älä ehdota hahmoja, eläimiä, kasvoja, tekstiä, soittimia esineinä tai mitään, minkä tyyliohje kieltää.
- Selkeys voittaa: jos kaksi asiaa soi yhtä aikaa, sano, kumpi johtaa kuvaa.

Palauta lopuksi viestinä enintään 250 sanan tiivistelmä: rivien määrä, montako kohtaa vaatii uuden säännön, ja viisi
tärkeintä huomiota.
