**Lue ensin `docs/visuaalinen_tyyli.md` kokonaan ja `runs/vedos_v5/brief.md` kokonaan (ja kaikki, mitä ne käskevät lukea). Vasta sitten tämä.**

# Korjaus: moduuli `visual/maailma_10.js` (myrsky), `hiljaisuus_2_alku` → `huuto`

Käyttäjä: "Joo tuo myrsky oli vähän boring, minuutti vaan ihan samaa. Se miten se nousi oli hieno." · "Ja itseasiassa sen
intensiteetti pitää seurata jousia. Nyt se on staattinen. Ja se pyörre pitäisi ehkä liikkua. Sen pitäisi olla pintakerros, ja
jotain syvempää näkyä taustalla?"

**Säilytä:** myrskyn näkyminen kaukana ja nousu (`myrsky_nakyy` → `myrsky_kasvu` → `myrsky_iskee`), lopun rajakuva LUMI.
**Korjaa minuutti `myrsky_iskee` → `huuto`:**

1. **Intensiteetti seuraa jousia.** Myrsky on jousten kromaattinen kuviointi. Lumen tiheys, nopeus ja kirkkaus tulevat
   ylä- ja keskirekisterin tasosta ja liiketiheydestä (`d.korkea`, `d.keski`, uusia säveliä sekunnissa `d.nuotit`ista) noin
   0,5–1 s tasoitettuna ja kertyminä: kun jouset nousevat, myrsky tihenee ja kirkastuu; kun ne laskevat (esim. lasku
   `Q_koko_metsa` + 7 s, hiljainen kohta ennen `toinen_paisunta`), se harvenee ja **takana oleva näkyy**. Aallot: myrsky tulee
   puuskina, ei tasaisena. Kuuntele (mittaa) väli ja raportoi tasokäyrä ja sitä vastaava lumen tiheys 2 s välein.
2. **Myrsky on pintakerros, ja sen takana on syvyyttä.** Lumiviirujen takana näkyy puuskien raoissa se, mitä myrsky peittää:
   metsän tumma massa, sileä vaara, horisontin valo (siemenen kuva), kerroksittain: lähin lumi suurta ja nopeaa, keskellä
   lumiverhoja jotka kulkevat eri nopeudella, kaukana tumma metsä ja valo. Tyyliohjeen poikkeus (myrskyssä kerrokset
   menettävät eronsa) koskee huippua (`myrsky_huippu` ympärillä noin 10 s): vain siinä kaikki on yhtä valkoista seinää.
3. **Pyörre liikkuu.** Pyörteen keskus kulkee kuvassa hitaasti (kertymä, ei hyppyjä), ja pyörteitä tulee ja menee puuskien
   mukana; se ei ole kiinteä kuvio kuvan keskellä. Kamera ajaa myrskyn läpi eteenpäin (Q:sta alkaen), ei pyöri (enintään 20 °/s).
4. **Vaihtelu ankkureittain:** `myrsky_iskee` (pelkät jouset fff: vain metsä ja lumi, ei valon leikkauksia) → `Q_koko_metsa`
   (nimetty isku: vasket ja patarummut liittyvät: pystysuora valon leikkaus myrskyn läpi, maa tärähtää; tästä eteenpäin
   leikkauksia vaskien iskuissa) → `myrsky_huippu` (valkoinen seinä, kerrokset yhtenä) → `R_vasket` (nimetty isku, jälkiaalto)
   → hiljainen kohta, takana oleva näkyy → `toinen_paisunta` (jousten nouseva asteikko: lumi alkaa virrata **ylöspäin**, kamera
   alkaa nousta) → `huuto` (rajakuva LUMI). Mikään 15 sekunnin jakso ei saa näyttää samalta kuin edellinen.
5. Latvat taipuvat myrskyssä kumipuusäännön rajoissa (enintään 4 %); lumi pöllyää latvoista; rungot ja maa eivät liiku.

## Tarkista liikesarjoista
Kontaktiarkki `myrsky_iskee` → `huuto` 5 s välein (vaihtelu ja syvyys näkyvät), `Q_koko_metsa` ± 1 s (leikkaus samassa
ruudussa), hiljainen kohta ennen `toinen_paisunta` (tausta näkyy), pyörteen keskuksen paikka 2 s välein (liikkuu), `toinen_paisunta`
+ 8 s (virtaus kääntyy ylös).

## LISÄYS 10.11.2026 (käyttäjän uusi palaute; teemakartta ja kuunteluopas päivitetty, lue rivit 14:17–14:50 uudelleen)
Käyttäjä: "Aksentti 14:30 ei näy".
- **Uusi ankkuri `myrsky_aksentti_537`** (nimetty isku, välillä `myrsky_kasvu` → `myrsky_iskee`): kaikki jouset painottavat yhtä aikaa ja
  kuvio hyppää ylemmäs; mitattuna taso nousee noin 8 dB kymmenesosasekunnissa. **Myrsky ei kasva tasaisesti, se ottaa askeleen:**
  samassa ruudussa lähestyvä lumirintama on selvästi lähempänä ja kirkkaampi (rintama on jo kuvassa, joten mikään ei ilmesty:
  se syöksähtää), puuska iskee lähimpiin latvoihin (taipuma kumipuusäännön rajoissa, lumi pöllähtää niistä) ja horisontin valo
  välähtää lumen läpi. Ei pystysuoraa valon leikkausta (vain jouset, ei vaskia). Sen jälkeen kasvu jatkuu `myrsky_iskee`en.
- Sama koskee muita äkillisiä hyppyjä tällä välillä: mittaa `d.koko`sta (tai spektristä) kohdat, joissa taso nousee vähintään 4 dB
  0,2 sekunnissa välillä `myrsky_kasvu` → `myrsky_iskee`, ja anna jokaiselle pienempi vastaava puuska. Käyttäjä kuuli aksentin
  kohdassa 14:30; mittaus löytää pienemmän kohouman 14:30,2 ja suurimman 14:32,0. Molempien pitää näkyä, suurimman selvimmin.
- Tarkista liikesarjasta: `myrsky_aksentti_537` − 0,5 s … + 1,5 s, 1 ruudun välein (muutos näkyy ankkurin ruudussa).
