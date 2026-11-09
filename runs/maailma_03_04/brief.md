**Lue ensin `runs/maailmat/brief.md` kokonaan ja kaikki, mitä se käskee lukea (tyyliohje kokonaan, kuvasäännöt, taustatutkimus, käsikirjoituksen uusi runko, kuunteluopas, käyttäjän sanat). Vasta sitten tämä.**

# Brief: moduuli `visual/maailma_03_04.js`: Maailmat 3 (Jokin kulkee edellä) ja 4 (Metsä kohoaa, maa katoaa)

- **Aikaväli:** ankkurista `fis_pitka_aani` ankkuriin `pohja_katoaa` (renderöi ja tarkista vain tämä väli; ajat saat `d.aika`sta ja tiedostosta `annotations/cues.json`).
- **Alun rajakuva:** `RAJA.PIMEA_MASSA` hetkellä `fis_pitka_aani`.
- **Lopun rajakuva:** `RAJA.HUURRE` hetkellä `pohja_katoaa`.
- **Suunnitelma:** `docs/kuvakasikirjoitus.md`, luku "Kaksitoista maailmaa", tämän moduulin maailmat, sekä taulukot "Miten maailmat ovat toistensa sisällä" ja "Mytologian ainekset maailmoittain".
- **Raporttisi:** `runs/maailma_03_04/tarkistus.md`. Tarkistuskuvat: `runs/maailma_03_04/tark/`.

## Mitä sinun pitää saada aikaan
Metsän sisus: ensimmäinen maailma, joka avautuu toisen sisältä. Alun rajakuva on metsän reunan pimeä massa; siitä kamera
tulee sisään ja pimeä osoittautuu runkojen väliseksi hämäräksi. Kaukana runkojen välissä on valo: teoksen pitkä ääni (nyt
fis) on sama horisontin valo kuin alussa, nyt metsän sisältä nähtynä (siemenen kuva: valo kaukana, tumma massa sen edessä,
maan kummut, lumi). Kamera kulkee kohti sitä koko ajan eikä saavuta sitä.

**Maailma 3** (`fis_pitka_aani` → `urkupiste_H1_alku`): vanha kuusimetsä talviyönä (käyttäjän referenssit 2 ja 6: rungot,
sammalen ja lumen kummut, laikukas valo; referenssi 9: valojen rivi pimeässä polulla). Metsä on massaa ja usvaa, josta
rungot erottuvat valon ja varjon kautta; lähimmät ikihongat ohittavat kameran (suunnitelman nimetyt puut: ne mittaavat
kulkijan pienuuden). Kamera laskeutuu lumen pintaan, kun askeleet alkavat (`askeleet_alkavat`, `askeleet_B`). **Basson
askeleet (`d.alut`) ovat painoa, joka kulkee edellä:** valo maassa ja usvan väistyminen kauempana edessä, ja pilkka
(veistetty vaalea merkki) syttyy ohitettavaan runkoon askelen tahdissa. Mitään ei näy kulkijasta (metsänpeitto). Jousten
intensiteetti on metsän tummuus ja hengitys; `valo_D_duuri` on kelmeä, hämärä valon välähdys (ei keltainen, ei lämmin);
`fis_hengittaa`: sointumatto hengittää.

**Maailma 4** (`urkupiste_H1_alku` → `pohja_katoaa`): kamera kallistuu hitaasti ylös runkoja pitkin (enintään 20 astetta
sekunnissa, ei kallistusta sivulle) ja jatkaa eteen; `nousu_tremolo`: valo alkaa laskeutua latvoihin ylhäältä;
`nousu_huippu_D`: D-duurin kelmeä hallan valo osuu suuren petäjän latvaan ensimmäisenä ("päivänä petäjän latvat") ja
siivilöityy oksien välistä (käyttäjän referenssit 4, 5 ja 13: lumiset latvat alhaalta, tähtitaivas, valokeilat oksien
välistä). Maa jää kuvan alle: metsä leijuu. **Kulku loppuun** (`nousu_huippu_D` → `pohja_katoaa`): kamera ajaa latvan
huurteiseen oksaan ja yhteen kiteeseen, joka kasvaa ja täyttää kuvan: lopussa kuva on rajakuva HUURRE.
