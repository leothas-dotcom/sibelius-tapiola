# Maailma 10: Se näkyy ja tulee (tarkistus)

Moduuli: `visual/maailma_10.js` (sivu `visual/maailma.html?m=10`). Aikaväli: `hiljaisuus_2_alku` (845,6 s) → `huuto` (945,0 s),
Rattle / LSO 2022 -kuuntelukopio. Kaikki ajat tulevat `d.aika`sta.

## 1. Suunnitelma (kirjoitettu ennen koodia)

**Maailma yhdellä kappaleella.** Metsä loppuu. Alku on viimeinen tumma kerros: kamera on lehvästön ja runkojen sisällä, ja
tummuus aukeaa ulos avoimelle jäälle ja suolle. Tila on ensimmäistä kertaa katsojaa suurempi: kolme neljäsosaa kuvasta on
raskas pilvitaivas, maa on tasainen lumen peittämä jää, jossa on tummia paljaan jään laikkuja (jään peilikuva) ja tuulen
muotoilemia matalia kumpuja. Horisontissa kaukana on matala musta metsän reuna sileiden, loivien kumpujen päällä. Valoa ei ole
juuri lainkaan: horisontin kalpea hallan valo on heikko ja elää vasta, kun jouset alkavat. Lumi on lähes paikallaan. Toinen
hiljaisuus (845,6–865,2) on tyhjä: kamera kulkee hyvin hitaasti, äänen elementit ovat poissa, jäljellä ovat metsän reuna, jää ja
lumi. Siinä jokin jo liikkuu: `myrsky_nakyy` horisontissa nousee hitaasti näkyviin matala lumiseinä, joka ei vielä liiku.
Myrsky on kirjallisuuden ja käyttäjän tulkinta (tutkimus luku 2), ei esipuheen asia: lunta ja jäätä, joka tulee kaukaa
(Pakkanen Puhurin poika: kylmä etenee pintoja pitkin). Seinä on kuusi syvyyskerrosta, ja ne lähestyvät kukin omaan tahtiinsa
nopeammin kuin kamera kulkee. Kun `myrsky_iskee` tulee, kaikki kerrokset ovat päällä ja menettävät eronsa (sama valo, väri ja
suunta; tyyliohjeen nimetty poikkeus säännölle 6): lumi on viiruja joka syvyydessä ja massa virtaa. Keskellä on pimeä pyörre,
jota kohti kamera ajaa ja jonka läpi se menee. `Q_koko_metsa`, `myrsky_huippu` ja `R_vasket` ovat Ukon tulta: pystysuora valo
kerrosten läpi, joka näyttää hetkeksi metsän reunan mustana viivana. `toinen_paisunta`: kamera nousee pyörteen läpi (ensimmäinen
ja ainoa nousu, ei taakse), pimeä keskus sulkeutuu lumeen ja lumi tihenee vaaleaksi seinäksi, joka lopussa on täsmälleen
`RAJA.LUMI`.

**Siemenen kuva.** Horisontti (matala, kalpea valo), tumma massa kaukana (metsän reuna), sileät kummut (reunan profiili) ja lumi
palaavat lähes alun näköisinä, mutta ilman valoa ja valtavassa tilassa. Kasvu: tässä maailmassa kuvaan on tullut uutena ainoastaan
tila ja sää; siemenen ele (jousten tumma aalto) on kasvanut koko tilaksi eli myrskyksi.

**Kameran reitti.** Alku `RAJA.PIMEA_MASSA`: kamera on lehvästökerrosten sisällä ja ajaa niiden läpi (viisi kerrosta, jokaisen
aukko kasvaa maailmassa; mikä täytti kuvan, osoittautuu metsän reunan oksistoksi ja rungoiksi, jotka valuvat kuvan reunoille).
Sitten tasainen hidas ajo suoraan eteen jään yli silmänkorkeudella (1,7 m), pieni viistous parallaksia varten. Vauhti kasvaa
vain suuressa käänteessä (jousten voimistuminen kasvusta Q:hun) ja hidastuu R:n jälkeen; se ei reagoi iskuihin. Pyörteessä kamera
ajaa pimeää keskusta kohti. `toinen_paisunta`: nousu (korkeus kasvaa, horisontti vajoaa hitaasti, alle 20 °/s), lumi kiihtyy
alaspäin. Loppu: lumi tihenee seinäksi ja kuva on `RAJA.LUMI`.

**Kuunteluoppaan rivi → kuvassa → signaali** (rivit: `annotations/kuunteluopas.md`, 14:05–15:45)

| Rivi | Mitä kuvassa tapahtuu | Signaali |
|---|---|---|
| 14:05 Lähes hiljaisuus (`hiljaisuus_2_alku`) | metsän reuna, jää, lähes paikallaan oleva lumi; kamera ajaa tummuuden läpi ulos; äänen elementit poissa | ei signaalia (hiljaisuus); kameran vauhti tasainen |
| 14:17 Myrsky näkyy (`myrsky_nakyy`) | horisontissa nousee hitaasti matala lumiseinä, ei vielä liiku; horisontin valo aavistuksen | jousten voima (`d.koko`, hidas) ja kuvaan nousun aikataulu ankkurista |
| 14:25 Toinen hiljaisuus päättyy (`hiljaisuus_2_loppu`) | seinä alkaa kasvaa hitaasti | lähestymisen kertymä (jousten voiman integraali) |
| 14:27 Nopea voimistuminen (`myrsky_kasvu`) | kuusi kerrosta lähestyy, lähin ensin; lumi tihenee ja alkaa viirua | sama kertymä; `d.koko` → lumen tiheys |
| 14:33 Talvimyrsky iskee (`myrsky_iskee`) | kerrokset ovat päällä ja menettävät eronsa; lumi viiruja joka syvyydessä; pimeä pyörre alkaa pienenä | kertymä = 1 tässä ankkurissa; `d.koko` → tiheys ja massan liike |
| 14:50 Q (`Q_koko_metsa`) | pystysuora valo kerrosten läpi iskun ruudussa, metsän reuna mustana viivana hetken; maan sysäys pyörteen pulssina | `d.iskut` ankkuri; `d.matala` → pyörteen hengitys |
| 15:10 Myrskyn voimakkain (`myrsky_huippu`) | tihein lumi, toinen pystyvalo | `d.iskut`; `d.koko` |
| 15:23 R (`R_vasket`) | kolmas pystyvalo; jälkiaalto | `d.iskut` |
| 15:35 Huuto alkaa (`toinen_paisunta`) | nousu: lumi vajoaa kuvassa alaspäin yhä nopeammin, pimeä keskus sulkeutuu | nousun aikataulu ankkureista; `d.korkea` → nousun vauhti |
| 15:45 Huuto (`huuto`) | kuva on täsmälleen `RAJA.LUMI` | ankkuri |

## 2. Toteutus ja tarkistus (katsottu stilleistä `runs/maailma_10/tark/`, viimeisin arkki `tark/arkki.png`)

**Metsä elää (ohjaajan korjaus 10.11.2026).** Metsän reunan latvat huojuvat tuulessa (`uSway`: ääriviivan hienotekstuuri siirtyy sivulle
hitaalla siniaallolla; kummut ja maa eivät liiku); alun lehvästö ja rungot taipuvat korkeuden suhteessa, tyvi pysyy. Signaali:
`huojunta(t)` = 0,12 + 0,9 · jousten voima (`d.koko`, keskiarvo +-1,6 s) + osa lähestymisestä; hiljaisuudessakin heikko. Mikään ei
kasva, kutistu tai pompi nuottien mukana. Huojunnan näkyvyys stilleistä on vähäinen (pieni amplitudi): liike on varmistettu vain
koodista ja yksittäisistä ruuduista, ei liikesarjasta.

**(a) Säännöt 0–21 ja 4d 1–19** (T = toteutuu, E = ei koske, H = heikko)
| Sääntö | Tila | Ruutu |
|---|---|---|
| 0 ääni ohjaa | T | lumen tiheys, pyörteen kasvu, valo ja huojunta mitatuista signaaleista (`kuvaus`); tremolo-väre jäi tekemättä (H) |
| 1 kamera eteen/sisään | T | 846–873 ajo, nousu T8:sta |
| 2 pysähdys vain nimetyissä | T | ei pysähdystä |
| 3 ei pyörimistä, <20 °/s | T | horisontti vajoaa 0,14 / 9 s (noin 7 °/s) |
| 4 kamera ei reagoi iskuun | T | vauhti sstep-käänteissä, ei iskuissa |
| 5 siirtymä ≥4 s, jatkuva | T | alku 846–854 (viisi lehväkerrosta, aukko kasvaa), loppu 936–945 |
| 6 kolme kerrosta | T / nimetty poikkeus | avoin maailma: taivas, reuna, jää; myrskyssä kerrokset yhtenevät (873→) |
| 7 puhuja lähemmäs | E | |
| 8 ei pahvia | T | |
| 9 metsä näkyy | osin | metsän reuna matalana massana horisontissa ja alun lehvästö; metsä on tässä maailmassa reuna |
| 10–11 iskun elementti ympäristössä | T | 890,5; 910,6; 923: pystyvalo + metsän reuna ruudussa |
| 12 enintään 3 liikkuvaa | T | |
| 13 | E | |
| 14 valolla lähde | T | horisontin hajavalo, pystyvalo |
| 15–16 punainen / kajo | T | ei kumpaakaan |
| 17 | T | |
| 18 hiljaisuus | T | 846–865: ei horisontin hohtoa, lumi lähes paikallaan, reuna+jää+lumi |
| 19–21 | T | koodilla, ei hahmoja, ei tekstiä |
| 4d.1 metsä pysyvä/elää | T | ks. yllä |
| 4d.5 / 17 horisontti, ei piikkejä | T | sileät kummut (`ridgeFar`) |
| 4d.10 jouset näkyvät | T | tiheys, huojunta, valo |
| 4d.13 kamera ei maan läpi | T | korkeus 1,7 m maasta |
| 4d.16 parallaksi | T | viisto eteneminen (`camX`) |
| 4d.18 ei teräviä vuoria | T | |
| 4d.20 valo ja varjo | osin | vastavalo lehvästön reunassa alussa, pystyvalo |
| muut (2, 3, 4, 6–9, 11–12, 14, 19, 21–22) | E / T | ei puita (4d.14, 19), revontulia ei |

**(b) Kuunteluoppaan rivit.** 14:05 näkyy (tyhjä jää, reuna). 14:17 näkyy osin: seinä nousee 857→868 vaaleana nauhana
horisontissa, mutta on heikko ja matala. 14:25 osin. 14:27 näkyy (seinä kerroksittain, 866–869). 14:33 näkyy (viirut, pyörre). Q, huippu,
R näkyy (pystyvalo + reuna). 15:35 näkyy (nousu, pyörteen sulkeutuminen, tihenevä lumi). 15:45 näkyy (LUMI).

**(c) Rajakuvat.** Alku 845,6 s: ruutu on `rajakuva(PIMEA_MASSA)`, keskiarvo (22, 31, 34), hajonta 1,5–2 (kohina). Loppu 945,0 s: `rajakuva(LUMI)`,
keskiarvo (117, 124, 137); 944,9 ja 945,0 samannäköiset. Alusta maailma avautuu 846→854 (>3 s), loppuun ajetaan 936→945.

**(d) Omat lisäykset.** Pimeän pyörteen kierto ja sen sulkeutuminen nousussa (tuotu briefistä: "pimeä pyörre"; kierto Turner-viite
tutkimus luku 9). Paljaan jään laikut (peilikuva; tyyliohje 4b kuvatapa 5 / referenssit 3 ja 11). Hajavalo horisontissa (ilman sitä reuna ei erotu).

**(e) Heikkoa, rehellisesti.**
1. Kirkkaus: lumiseinän saapuessa (869–871) kuva on tasaisen vaalea harmaa ja 871,5 s tummuu äkisti sisustaan. Hyppy on kuvassa näkyvä (vakavin).
2. Lumiseinä 857–866 on liian himmeä ja matala: "näkyy" vain osin.
3. Lähellä olevat hiutaleet ovat kapselimaisia, ja viirut ovat siistejä: yleisvaikutelma hieman digitaalinen.
4. Alun lehvästö on nopeasti tehty tupsukohinaa, ei uskottava kuusi; aukko avautuu ensin pienenä soikiona.
5. Jään pinta on yksitoikkoinen etualalla. Huojunta ja tremolo-väre ovat hennot. Liikesarjoja (0,2 s) ei ehditty katsoa; vain yksittäisiä ruutuja.
