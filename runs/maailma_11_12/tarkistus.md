# Tarkistus: maailmat 11 ja 12 (`visual/maailma_11_12.js`)

Aikaväli: `huuto` (945,0 s) -> tiedoston loppu (1078,0 s), kuuntelukopio Rattle / LSO 2022. Määräajan takia viimeistelty vain osittain; rehellinen tila alla.

## Suunnitelma (tiivis)
Maailma: katsoja latvojen yläpuolella, korkeus 58 -> 82 m; kuusikruunut korkeuskenttänä (kerrokselliset kuuset, lumi hyllyillä ja latvoissa), aukot ja suot, usva laikkuina, kaukana massa usvassa; takana sileä vaara (maailman 1 profiili ja ikkunat, pienennetty 0,66), sen takana horisontin valo.
Siemen: horisontin valo, tumma massa, sileät kummut, lumi, Tapion talon kuusi ikkunaa. Kamera: ajo eteen ja viistoon 6,5 m/s, hidastuu S:stä, pysähtyy `loppu_Hduuri_alku`:ssa.

| Rivi | Kuvassa | Signaali |
|---|---|---|
| huuto 945 | seinä harvenee alhaalta ylös; horisontin valo nousee korkeuteen; kamera nousee | `pitka`, `pitkaSavel` (80) |
| nousu/lasku | valon korkeus ja elevaatio | tapahtumat nousu, lasku |
| tremolo 949-965, 1011-1015 | revontulten väre | tapahtuma tremolo |
| yksinaiset_aanet 960 | kummut piirtyvät vasemmalta oikealle | `melodia` |
| S 981 | kamera hidastuu; kummut palaavat maailman 1 muotoon | ankkurit |
| loppuhuipennus 1012,7 | valoaalto kulkee metsän yli kaukaa lähelle | `koko`, ankkuri |
| H-duuri 1024,65 | kamera paikallaan; kajo latva latvalta; revontulet himmenevät | ankkurit |
| viimeiset askeleet 1044,4 | valokehät maassa | `matala`, alut ja huiput |
| musiikki_loppuu 1051,6 | elementit lakkaavat, lumi ja usva jatkuvat | - |

## Metsä elää (ohjaajan korjaus 10.11.)
Jokainen kruunu taipuu tuulessa rigidisti (kärki enemmän kuin tyvi), aalto kulkee maton yli, ei kasvua, kutistumista tai pomppua. Tuuli = `koko` + loppuhuipennuksen aalto + tremolo, tyyntyy lopussa mutta ei nollaan (kuvaus: `tuuli`). Lumi sataa ja usva ajelehtii tiedoston loppuun. Tuulen näkymistä liikkeenä en ehtinyt tarkistaa liikesarjasta: vain arkkistillit; **ei todennettu liikkeenä**.

## Todennus
- Koko väli renderöitiin stilleinä 945-1078 s (arkit `tark/arkki.png`), ei virheitä.
- Alun rajakuva: t=945 on koodissa suoraan `rajakuva(LUMI)` (seinän peitto 1); stilli näyttää tasaisen seinän. Todettu.
- Loppu: 1060 ja 1078 s samanlaiset, kuva ei pimene eikä häivy.

## Luku 12 ja 4d (yhteenveto)
Toteutuu: 0 (korkeus ja voima, osin), 1 kamera eteen (nousu vain huudossa), 2 pysähdys nimetty H-duuri, 3 ei kallistusta, 4 kamera ei reagoi iskuun, 6 syvyyskerrokset (matto, usva, vaara), 9 metsä näkyy, 14 valolla lähde, 15-16 punaista ei; kajo vain 12; revontulet vain 11, 18 hiljaisuus (elementit pois, metsä jää), 19-21 ei koske/ei rikota, 4d 9 massa, 13 kamera ei maan tai puun läpi (kruunut enintään noin 51 m, kamera >= 58 m), 18 sileä vaara, 19 ei etualan puuta.
Osin: 7b-vastineet (tremolo, nousu, lasku, kerros tulee = maan valo, askeleet = kehät) toteutettu mutta liikettä en ole katsonut sarjana. Ei koske: kasvot, eläimet, teksti.
Ei toteudu: kaiku käyrätorville (ikkunat vastaavat pitkään ääneen 1 s viiveellä, ei erillistä käyrätorvisignaalia).

## Kuunteluoppaan rivit
huuto: näkyy (korkeus, revontulet). Yksittäiset äänet 960: osin (kummut melodian kaaresta, ei yksittäisiä nuotteja). S: osin. Loppuhuipennus: osin (aalto on lievä). H-duuri: osin (kajo vaimea). Viimeiset askeleet: osin (kehät, mitattu bassohuiput; 16 sykettä ei löytynyt onsetteina). Musiikki loppuu: näkyy.

## Omat lisäykset
Pilvikerros ja tähdet (taivas "auki" huudon jälkeen, tyyliohje 4: taivas ensi kertaa auki); valolaikut metsän päällä (referenssit: valo osuu latvoihin); tuulen aalto (palaute 10.11.).

## Heikkoa
- Kajo on harmaa ja vaimea, ei lämmin; lopun "kaunis ja hyväksyvä" ei vielä täyty.
- Vaaran tyvessä näkyy vaalea vaakaraita (kaukokentän usva); vaara itse on mäkimäinen mutta litteähkö.
- Seinän harveneminen alussa on pehmeitä möykkyjä, ei hienoa.
- Revontulet verhomaiset ja melko voimakkaat; yli 20 s samannäköistä 11:n keskivälillä.
- Ei liikesarjatarkistusta, ei kriitikkoa; tuulen liike ja kehien nopeus tarkistamatta.
