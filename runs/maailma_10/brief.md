**Lue ensin `runs/maailmat/brief.md` kokonaan ja kaikki, mitä se käskee lukea (tyyliohje kokonaan, kuvasäännöt, taustatutkimus, käsikirjoituksen uusi runko, kuunteluopas, käyttäjän sanat). Vasta sitten tämä.**

# Brief: moduuli `visual/maailma_10.js`: Maailma 10 (Se näkyy ja tulee)

- **Aikaväli:** ankkurista `hiljaisuus_2_alku` ankkuriin `huuto` (renderöi ja tarkista vain tämä väli; ajat saat `d.aika`sta ja tiedostosta `annotations/cues.json`).
- **Alun rajakuva:** `RAJA.PIMEA_MASSA` hetkellä `hiljaisuus_2_alku`.
- **Lopun rajakuva:** `RAJA.LUMI` hetkellä `huuto`.
- **Suunnitelma:** `docs/kuvakasikirjoitus.md`, luku "Kaksitoista maailmaa", tämän moduulin maailmat, sekä taulukot "Miten maailmat ovat toistensa sisällä" ja "Mytologian ainekset maailmoittain".
- **Raporttisi:** `runs/maailma_10/tarkistus.md`. Tarkistuskuvat: `runs/maailma_10/tark/`.

## Mitä sinun pitää saada aikaan
Ulkona: metsä loppuu. Alun rajakuva on viimeinen tumma kerros; sen läpi kamera tulee ulos avoimelle jäälle ja suolle
(käyttäjän referenssit 3 ja 11), ja **tila on ensimmäistä kertaa katsojaa suurempi**: valtava tumma taivas, tasainen
lumen peittämä jää, ja kaukana metsä matalana mustana reunana. **Siemenen kuva palaa** lähes alun näköisenä (horisontti,
tumma massa kaukana, kummut, lumi), mutta ilman valoa ja valtavassa tilassa. Kamera kulkee eteen jään yli.

**Hiljaisuus** (`hiljaisuus_2_alku` → `hiljaisuus_2_loppu`): toinen suuri hiljaisuus; kamera jatkaa hyvin hitaasti, äänen
elementit poissa, lumi lähes paikallaan. `myrsky_nakyy`: horisontissa, kaukana, näkyy jotain: lumiseinä, joka ei vielä
liiku. **Myrsky** on kirjallisuuden ja käyttäjän tulkinta: se on lunta ja jäätä, joka tulee kaukaa (Pakkanen Puhurin poika;
kylmä etenee pintoja pitkin). `myrsky_kasvu`: seinä lähestyy kerros kerrokselta nopeammin kuin kamera kulkee;
`myrsky_iskee`: se on päällä: kerrokset menettävät eronsa (tyyliohjeen nimetty poikkeus sääntöön 6: sama valo, väri ja
suunta), lumi on viiruja joka syvyydessä, jousten voima on lumen tiheys ja massan liike. `Q_koko_metsa`, `myrsky_huippu`,
`R_vasket` ovat nimettyjä iskuja: pystysuora valo myrskyn sisällä (Ukon tuli kerrosten läpi), joka paljastaa hetkeksi
metsän reunan. Myrskyn keskus on **pimeä pyörre**, jota kohti kamera ajaa ja jonka läpi se menee: katsoja ei pakene.
Käyttäjä piti aiemmasta lumisateesta ("Lumisade toimii nyt hienosti"): lumi tapahtuu syvyydessä, ei maskina kuvan päällä
(lumifunktion malli: `snowAt` tiedostossa `visual/maailma_01_02.js`).

**Kulku loppuun** (`toinen_paisunta` → `huuto`): nouseva asteikko; kamera nousee ensimmäisen ja ainoan kerran: ylös
myrskyn läpi, ei taakse; lumi tihenee vaaleaksi seinäksi, joka täyttää kuvan: lopussa kuva on rajakuva LUMI.
