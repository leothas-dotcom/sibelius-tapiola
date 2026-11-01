# Brief: vaihe 5, teemakartta ja ajat (Rattle 2022), cues- ja opastyökalut

Lue ensin kokonaan ja tässä järjestyksessä: `CLAUDE.md`, `docs/teemakartta_rakenne.md`, `docs/analyysisuunnitelma.md`
(luku 2: varmat kohdat V1–V10), `docs/haastattelu_tyyli.md` (käyttäjän partituurihavainnot: B = t. 69, M = t. 397,
Allegro moderato O:n jälkeen = t. 462, myrsky näkyy ppp t. 523, myrsky iskee t. 540, C-duuri noin t. 392–396,
avaus patarumpusoolo, ensimmäinen con sord. J:n jälkeen), `docs/tapiola_tutkimus.md` luku 3 (kirjallisuuden
jaksot ja tahdit: tuulenpuuska t. 21–25, kirjain G puupuhallinkuviot, huuto t. 586–587, H-duuri t. 624–634, 634
tahtia), `build/rattle_koko/varmat_kohdat.md`, `build/rattle_koko/aikajana.md`, `annotations/levytykset.json`,
`analysis/make_cues.py`, `analysis/kuunteluopas.py`, `analysis/check_package.py`.

## Tavoite
1. `annotations/teemat.json`: levytysriippumaton teemakartta rakenteen mukaan. Ankkurit ovat partituurin paikkoja
   ja musiikillisia tapahtumia. **Tarina-kenttä jätetään tyhjäksi**: tarina on käyttäjän, ja se kirjoitetaan
   haastattelussa. Älä keksi tarinaa, älä kirjoita kuvia.
2. `annotations/ajat_rattle2022.json`: jokaiselle ankkurille aika Rattlen kuuntelukopiossa, `varmuus: "analyysi"`,
   `peruste` (mitattu piirre: jaksoraja, isku, kanava, chroma). Mitään ei merkitä vahvistetuksi: käyttäjä ei ole
   kuullut. Jos aikaa ei voi perustella mittauksesta, `t: null` ja `varmuus: "arvio"` perusteluineen.
3. `analysis/make_cues.py --levytys rattle2022` → `annotations/cues.json` uudesta rakenteesta (ankkurit + ajat +
   levytyksen iskut `build/rattle_koko/aksentit.json`). `check_package.py --cues-only` tarkistaa sen.
4. `analysis/kuunteluopas.py --levytys rattle2022` → täyttää `annotations/kuunteluopas.md`:n GEN-osat (ankkurit
   aikakoodein, minuutti minuutilta -taulukko jaksoista, tarkistuslista). Oppaan tarinaosat ovat tyhjiä otsikoita
   käyttäjälle; älä kirjoita niihin.
5. `docs/aikajana_tulkinta.md`: muusikon kielellä, jakso jaksolta (10–25 jaksoa, ei 105): mitä tapahtuu, kuka
   soittaa, dynamiikka, liike, mihin partituurin kohtaan se todennäköisesti liittyy (kirjain tai tahti vain, jos
   lähde antaa; muuten "ei tiedossa"). Tämä on **analyysin sanallistus**, ei kuunteluopas. Merkitse jokaiseen
   jaksoon, mihin mittaukseen kuvaus perustuu.

## Ankkurit, jotka teemakartassa on vähintään oltava
| id | partituuri | luokka | huom |
|---|---|---|---|
| avaus_patarumpu | t. 1 | soitin | patarumpusoolo "tututum" |
| jouset_tulevat | alku | soitin | ydinmotiivi jousissa |
| puhaltimet_tulevat | alku | soitin | |
| tuulenpuuska | t. 21–25 (Grimley) | tunnelma | oktatoninen |
| vaskien_isku | Allegro moderaton alku | isku | kirjallisuus: "vaskien isku avaa Allegro moderaton" |
| askeleet_B | kirjain B = t. 69 | soitin | matalat äänet eri tahtiin, käyttäjä |
| peikot_G | kirjain G | jakso | puupuhallinkuviot; Jalas: "metsänpeikot ja -eläimet" |
| con_sord_J | kirjaimen J jälkeen | soitin | ensimmäinen sordiino |
| auringonsade | noin t. 392–396 | huippu | C-duuri, noin 5 tahtia; käyttäjän avainkohta |
| M_ennakko | kirjain M = t. 397 | isku | vaskien jyrinä; käyttäjä: myrskyn ennakko, ei vielä myrsky |
| allegro_moderato_O | t. 462, O:n jälkeen | jakso | käyrätorvien < > ja trumpettien vuorottelu (V10) |
| myrsky_nakyy | t. 523, ppp | tunnelma | crescendo alkaa, "kaukaa tuleva lumi ja jää" (käyttäjä) |
| myrsky_iskee | t. 540 | isku | talvimyrsky iskee |
| huuto | t. 586–587 (Grimley) | huippu | korkeat jouset |
| loppu_Hduuri | t. 624–634 | jakso | divisi-jouset; dynamiikka partituurista, ei lähteistä |
| musiikki_loppuu | viimeinen ääni | tauko | |
Lisää aikajanasta ja varmoista kohdista muut selvät tapahtumat (soittimien tulot, hiljaisuudet 58–61 s ja
845–865 s, tutti-iskut, sävellajin muutokset, jotka kestävät). Jaksot `*_alku`/`*_loppu`-pareina. Tavoite 30–60
ankkuria, ei enempää. Jokaiselle `lahde`: "käyttäjä, partituuri" / "kirjallisuus: X" / "analyysi: aikajana".

## Säännöt
- Ajat vain Rattlen kuuntelukopion aikaa tiedoston alusta. Älä kirjoita aikoja mihinkään muuhun tiedostoon kuin
  `ajat_rattle2022.json` (ja generoituihin cues.json ja kuunteluopas.md GEN-osiin).
- Tahtinumeroita ei lasketa äänestä. Kirjain tai tahti vain käyttäjältä tai kirjallisuudesta; muuten null.
- Ei tarinaa, ei visuaalisia ehdotuksia, ei edellisen projektin termejä.
- Musiikkisanasto muusikon suomeksi: sordiino, divisi, tremolo, urkupiste, patarummut; h-molli, H-duuri, C-duuri.
- Python `.venv\Scripts\python.exe -I`. Älä aja GPU-vaiheita uudelleen; käytä `build/rattle_koko`-pakettia.
- Älä committaa. Älä muokkaa `docs/`-tiedostoja paitsi luo `docs/aikajana_tulkinta.md` ja päivitä `README.md`:n
  komennot. Raportti `docs/tutkimus/vaihe5_raportti.md`: mitä tehtiin, montako ankkuria, mitkä ajat jäivät
  null, mitä työkaluissa muutettiin, mikä ei toiminut.
