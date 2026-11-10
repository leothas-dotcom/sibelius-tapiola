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
