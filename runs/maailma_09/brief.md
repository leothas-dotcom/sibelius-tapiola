**Lue ensin `runs/maailmat/brief.md` kokonaan ja kaikki, mitä se käskee lukea (tyyliohje kokonaan, kuvasäännöt, taustatutkimus, käsikirjoituksen uusi runko, kuunteluopas, käyttäjän sanat). Vasta sitten tämä.**

# Brief: moduuli `visual/maailma_09.js`: Maailma 9 (Petos ja hermo)

- **Aikaväli:** ankkurista `M_raskaat_askeleet` ankkuriin `hiljaisuus_2_alku` (renderöi ja tarkista vain tämä väli; ajat saat `d.aika`sta ja tiedostosta `annotations/cues.json`).
- **Alun rajakuva:** `RAJA.PIMEYS` hetkellä `M_raskaat_askeleet`.
- **Lopun rajakuva:** `RAJA.PIMEA_MASSA` hetkellä `hiljaisuus_2_alku`.
- **Suunnitelma:** `docs/kuvakasikirjoitus.md`, luku "Kaksitoista maailmaa", tämän moduulin maailmat, sekä taulukot "Miten maailmat ovat toistensa sisällä" ja "Mytologian ainekset maailmoittain".
- **Raporttisi:** `runs/maailma_09/tarkistus.md`. Tarkistuskuvat: `runs/maailma_09/tark/`.

## Mitä sinun pitää saada aikaan
Pimeä metsä, jossa valo on viety ("yö pitkä, pilkkoisen pimeä", Kalevala 49). Alun rajakuva on pimeys; siitä kamera lähtee
uudestaan liikkeelle ja kiihtyy: tämä on **teoksen nopein ajo** (vauhti seuraa musiikin liikkeen suuria muutoksia hitaana
keskiarvona, ei iskuja). Ahdistus on tässä sallittu (tyyliohje 2.10): liikettä ei voi pysäyttää. **Metsä näkyy vain, kun
jokin valaisee sen:** nimetyt iskut (`d.iskut`: pystysuora valo kerrosten läpi, joka paljastaa hetkeksi rungot ja usvan ja
heittää varjot kohti katsojaa) ja niiden välissä himmeä jälkihohto. Jokainen välähdys paljastaa saman kuvan: kaukana heikko
kajo, tumma massa, kummut (siemenen kuva pimeässä). **Yhdeksän ovea:** valo on suljettu "vuorehen teräksisehen" yhdeksän
oven taakse: peräkkäiset tummat kerrokset, joiden läpi ajetaan yksi kerrallaan koko maailman aikana.

**Ääni:** `M_raskaat_askeleet`: raskaat askeleet ovat painoa maassa (`d.alut`, valo joka välähtää pohjasta);
`jannitejakso_alku` → `jannitejakso_loppu`: jousten hermo on massan **väre paikallaan** (tremolo: `d.tapahtuu("tremolo", t)`;
hienojakoinen, ei pomppu); `O_kirjain`; `allegro_moderato_O_alku` → `allegro_moderato_O_loppu`: vaskien vuorottelu on kaksi
valon paikkaa, jotka vastaavat toisilleen pimeässä vuorotellen; `harva_kuviointi`: harva hiljainen kuviointi, paljon
pimeää, yksittäisiä väikkeen pisteitä; `P_vaskipaisunta`: nimetty isku ja paisunta: valo paisuu ja laskee (ei leikkaus
yhdessä ruudussa vaan kajo, joka hengittää: käyrätorvien paisutus ja lasku); jousten voima → väreen laajuus ja kameran vauhti.

**Kulku loppuun** (`dim_possibile` → `hiljaisuus_2_alku`): musiikki häipyy; rungot harvenevat, viimeinen tumma kerros
(yhdeksäs ovi) on edessä, kasvaa ja täyttää kuvan: lopussa kuva on rajakuva PIMEA_MASSA.
