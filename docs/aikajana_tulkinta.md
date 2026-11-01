# Aikajanan tulkinta: Rattle / LSO 2022, jakso jaksolta

*Vaihe 5, 1.11.2026. Tämä on **analyysin sanallistus**, ei kuunteluopas eikä tarina: se kertoo, mitä mittaukset näyttävät, muusikon kielellä.
Ajat ovat Rattlen kuuntelukopion (`build/kuuntelu/rattle_kuuntelu.wav`) aikaa tiedoston alusta. **Mitään ei ole kuultu**: kaikki on analyysia, ja
jaksorajat ovat ehdotuksia. Jaksot on koottu aikajanan 105 pienestä jaksosta (`build/rattle_koko/aikajana.md`) suurempiin kokonaisuuksiin
ankkureiden (`annotations/ajat_rattle2022.json`) ja mitattujen muutosten mukaan.*

**Lukuohje.**
- *Taso* on dBFS (digitaalinen täysi asteikko, ei sama kuin partituurin dynamiikkamerkki; huoneen kohina on noin −66). Dynamiikkamerkkejä (p, f, ff) ei käytetä, koska aikajanan merkit saturoituvat (vaihe 3–4).
- *Soittimet* tulevat PANNs-luokista ja kanavista (`kanavat.json`). Mallissa ei ole oboeta, fagottia, englannintorvea eikä kontrabassoa (kontrabasso ei koskaan ylitä 0,05), ja trumpetti ja pasuuna eivät erotu toisistaan. Luokka kertoo, mikä soi, ei tarkkaa alkuhetkeä (ikkunan viive noin 2,5 s). Tiheässä tutissa kaikki luokat vaikenevat, vaikka soi koko orkesteri.
- *Liike* on alkuja sekunnissa (`liiketiheys`). *Rekisteri* 0 (matala) – 1 (korkea). *Jännite* ja *selkeys* ovat sävelkorkeusjakauman mittoja: korkea jännite ja matala selkeys tarkoittavat dissonoivaa tai kromaattista tekstuuria. Sävellajia ei tulkita (vain V6 ja V8).
- *Partituurin kohta:* kirjain tai tahti vain, jos lähde (käyttäjä tai kirjallisuus) antaa; muuten "ei tiedossa". Tahtinumeroita ei ole laskettu äänestä.
- *Mittaus:* mihin tiedostoon ja kohtaan kuvaus perustuu.

---

## 1. Patarumpusoolo: 0:07.6–0:08.9
**Mitä tapahtuu:** musiikki alkaa äkkiä (taso −65 → −32 dBFS alle sekunnissa), ja soi vain patarummut. Lyönnit 7,73 ja 7,83 s, soolo päättyy noin 8,7 s.
**Kuka soittaa:** patarummut yksin; kaikki muut perheet lähellä nollaa (jouset 0,02, puupuhaltimet 0,01).
**Dynamiikka ja liike:** kovin isku heti alussa (z 12,0), sitten väheneminen; liike 2,4 alkua/s, rekisteri matala (0,37).
**Partituurissa:** t. 1, patarumpusoolo ("tututum", käyttäjä; Judd).
**Mittaus:** `varmat_kohdat.md` V1, `aksentit.md`, kanavat `patarumpu_matala`, `patarumpu_panns`.

## 2. Jousten ja vaskien tulo: 0:08.9–0:26.4
**Mitä tapahtuu:** soolon jälkeen tulee uusi ääni 8,93 s (taso +6 dB, spektri avautuu). Jouset erottuvat mallille vasta 11,5 s jälkeen (viulu 0,24); käyrätorvet vastaavat noin 13,1 s (käyrätorvi 0,17, vaskikanava 0,5) ja jouset vetäytyvät; noin 17 s puupuhallinkanava nousee hetkeksi (0,45), mutta huilua tai klarinettia ei tunnisteta. Taso laskee jakson lopussa −46 dBFS:iin (19 s) ja nousee uudelleen 22–23 s (jouset 0,25).
**Kuka soittaa:** jouset (viulut) ja vaskipuhaltimet, ensin käyrätorvet; patarummut vaikenevat 10,2 s ja palaavat lyhyesti 18,5–24 s.
**Dynamiikka ja liike:** taso −25…−47 dBFS; liike hidas (0,7 alkua/s), jaksot ovat lyhyitä aaltoja.
**Partituurissa:** alku, ydinmotiivi jousissa ja puhaltimien tulo (käyttäjä, kirjallisuus); kirjain tai tahti ei tiedossa.
**Mittaus:** V2, V3 (vaihtoehto), `interpret.py`-tapahtumat 9,9 / 12,4 / 24,8 / 25,5 s, aikajanan jaksot 7,6–44,2 s.

## 3. Puupuhallinosuus: 0:26.4–0:44.2
**Mitä tapahtuu:** puupuhaltimet johtavat: kanava 0,86 kohdissa 27–29 ja 31–38 s, liike nousee 1,1 → 2,8 alkua/s ja pysyy 1–2,7 alkua/s. Klarinetti nousee esiin 34–38 s (0,26), huilu heikommin. Viimeisessä osassa (39–44 s) puupuhaltimet ja jouset vaikenevat; jäljelle jää tasainen matala äänimassa (taso −37…−40 dBFS), jossa patarumpu_matala-kanava on 0,2–0,3 ja kaikki soitinluokat nollassa.
**Kuka soittaa:** puupuhaltimet (klarinetti, huilu), taustalla jouset ja vaskit vähäisinä (0,12 ja 0,14); lopussa matala pitkä ääni, jossa patarumpu on mahdollinen.
**Dynamiikka ja liike:** taso −32…−47 dBFS, tasainen; rekisteri nousee 0,72:een.
**Partituurissa:** kirjallisuus nimeää tuulenpuuskan t. 21–25 (Grimley, oktatoninen), mutta sitä ei voi paikantaa mittauksella; ehdokas 48–51 s on seuraavassa jaksossa. Kirjain ei tiedossa.
**Mittaus:** V3, `aikajana.md` rivit 0:26–0:44, kanavat `puupuhaltimet`, `liiketiheys`, PANNs klarinetti.

## 4. Vaskien isku ja voimakas jakso: 0:44.2–0:57.5
**Mitä tapahtuu:** vaskikanava nousee 44,4–45,0 s ja isku osuu 45,33 s (z 32,9, teoksen alun voimakkain; kaistoilla erityisesti korkea). Käyrätorvet, trumpetit ja pasuunat sekä patarummut tulevat sisään (jaksoraja 44,18 s). Jouset vastaavat 46–48 s (0,43), liike kasvaa 4,0 alkua/s:iin kohdassa 49 s (nopea kuviointi) ja taso kasvaa −21 dBFS:iin (noin 52 s). Jakso päättyy nopeaan laskuun: jouset tulevat uudelleen 54,7 s ja äkillinen hiljeneminen alkaa 57,5 s.
**Kuka soittaa:** vaskit (käyrätorvi 0,11, pasuuna 0,11), patarummut, jouset (viulu 0,20, sello 0,14).
**Dynamiikka ja liike:** taso −42…−19 dBFS, alun kovin tutti-taso; liike 1,7 alkua/s (huippu 49 s).
**Partituurissa:** "vaskien isku avaa Allegro moderaton" (kirjallisuus); kirjain tai tahti ei tiedossa. Tuulenpuuskan (t. 21–25) mahdollinen paikka on tämän jakson alussa (ehdokas 48 s), ei varmistettu.
**Mittaus:** V4, `aksentit.md`, jaksoraja 8. vahvin, `interpret.py` 44,0 / 45,1 / 47,5 / 54,7 s.

## 5. Äkillinen hiljaisuus: 0:57.5–1:02.2
**Mitä tapahtuu:** voimakkuus putoaa −25 dB sekunnissa (57,5 s) lähes täydelliseen hiljaisuuteen: taso alle −60 dBFS 58,1–61,4 s (3,3 s, huoneen kohinan tasolla), kaikki perheet nollassa. Hiljaisuuden jälkeen taso nousee +31 dB sekunnissa (61,67 s) ja jouset tulevat sisään (aksentit 61,39–61,79 s; z 5,4–9,4).
**Kuka soittaa:** ennen hiljaisuutta jouset ja kontrabassot (kontrabassot kanavassa), sen jälkeen viulut, sellot ja kontrabassot yhdessä.
**Dynamiikka ja liike:** taso −39 → −66 → −37 dBFS; jaksoraja 62,2 s on teoksen vahvin (uutuus 25,4).
**Partituurissa:** ei tiedossa (yleistauko tai vastaava ei ole lähteissä).
**Mittaus:** `aikajana.md` "Hiljaiset kohdat" ja "10 vahvinta jaksorajaa", `aksentit.md`.

## 6. Jousten ja vaskien vuorottelu: 1:02.2–2:04.6
**Mitä tapahtuu:** jouset ja vaskiryhmä vuorottelevat 3–10 sekunnin lohkoissa: jouset (viulut, sellot; kanava jopa 0,85) soivat 62,2–65,9 ja 69,7–74,4 s; vaskit ja puupuhaltimet ottavat vuoron 64,6–69,3 s ja 75,2–89 s ym. Jaksonrajat 69,7 s ja 75,2 s ovat voimakkaita (vaskit pois, jouset sisään / päinvastoin). Taso pysyy melko tasaisena −26…−40 dBFS, liike vähäistä (0,7 alkua/s).
**Kuka soittaa:** jouset (viulu 0,44, sello 0,24), käyrätorvet (0,21), trumpetit (0,19), pasuunat (0,15), puupuhaltimet.
**Dynamiikka ja liike:** tasainen, ei suuria nousuja; rekisteri 0,63; sävelkorkeuden selkeys 0,76 (selkeä).
**Partituurissa:** kirjain B on t. 69 (käyttäjä), mutta sen paikkaa ei voi päätellä sekunneista; ei tiedossa.
**Mittaus:** `aikajana.md` rivit 1:02–2:04, kanavat `jouset`, `vasket`, PANNs-luokat.

## 7. Matala jousitekstuuri ja urkupiste: 2:04.6–3:24
**Mitä tapahtuu:** vaskit poistuvat (jaksoraja 124,6 s, uutuus 18,4) ja jäljelle jäävät sellot ja kontrabassot, joihin liittyy jouset (kanava 0,25–0,5 kohdissa 125–128 ja 133–135 s). Bassolinjassa (CREPE) on erillisiä H1-säveliä epäsäännöllisin välein 129,7–136,2 s. Pitkä urkupiste H1:llä soi 179,3–191,8 s (12,5 s). Liike lähes nolla (0,2 alkua/s).
**Kuka soittaa:** matalat jouset (sellot, kontrabassot), viulut (0,39).
**Dynamiikka ja liike:** taso −26…−45 dBFS, rekisteri matala (0,41), jännite matala (0,19), selkeys 0,78.
**Partituurissa:** käyttäjän havainto "matalat äänet eri tahtiin kuin muu orkesteri" kuuluu kirjaimeen B (t. 69); ehdokas tähän jaksoon 129,7 s (ei todennettu). Muuten ei tiedossa.
**Mittaus:** jaksoraja 124,6 s, `kanavat.json` `urkupisteet`, `notes.csv` (basso), aikajana 2:04–3:24.

## 8. Puupuhaltimien kuvioinnin ja jousten jakso: 3:24–5:30
**Mitä tapahtuu:** pitkä jakso, jossa nopea kuviointi tihenee ja harvenee. Ensin puupuhaltimet ja käyrätorvet (205–216 s; matalat iskut 205,1 ja 208,6 s), sitten toistuva puupuhallinkuviointi (222–250 s) ja pisin yhtenäinen nopea jakso 280,9–303,7 s (liike 3,8 alkua/s, huilu 0,2 kohdassa 287 s, 18 aksenttia). Jännite on tässä jaksossa teoksen korkeimpia alkuosassa (0,59), selkeys 0,56. Lopussa vaskikorahdus 315–317 ja 326–330 s (vaskikanava 0,5). Taso −24…−58 dBFS.
**Kuka soittaa:** puupuhaltimet (huilu 0,26, klarinetti 0,10), käyrätorvet (0,38), jouset; vaskit 0,14.
**Dynamiikka ja liike:** taso keskimäärin −39 dBFS, siis hiljaisempi kuin alku; liikkeen vaihtelu suuri (0–5,5 alkua/s).
**Partituurissa:** ei tiedossa. Kirjain G:n ehdokkaista (V5) toinen, 282–290 s, osuu tähän jaksoon.
**Mittaus:** V5 (ehdokas 282,2 s), `aksentit.md` (29 aksenttia 204–330 s), liikemittari.

## 9. Jousilohkot ja kuviointi: 5:30–6:14
**Mitä tapahtuu:** jouset palaavat lohkoina (334,5–337,2 s ja 366–367 s, kanava 0,8), puupuhaltimet ja vaskit vuorottelevat, ja 349–357 s on toinen V5-ehdokas (puu 0,62, liike 2,7 alkua/s). Jakso on rauhallisempi: jännite 0,24, selkeys 0,75.
**Kuka soittaa:** jouset (viulu 0,33, sello 0,21), puupuhaltimet (0,22), vähän vaskea.
**Dynamiikka ja liike:** taso −25…−53 dBFS (keskiarvo −37); liike 1,4 alkua/s.
**Partituurissa:** ei tiedossa.
**Mittaus:** V5 (ehdokas 349,2 s), aikajana 5:30–6:14 (jaksoissa soittimet tulevat ja menevät noin 5–10 s välein).

## 10. Nopea puupuhallinkuviointi: 6:14–6:48
**Mitä tapahtuu:** liike kiihtyy 1,5 → 3,4 → 5,8 alkua/s (teoksen suurin, 6,3/s kohdassa 390 s) ja puupuhaltimet johtavat (kanava 0,72–0,84 kohdissa 377–378 ja 382–389 s; huilu 0,37 kohdassa 383 s). Jakso päättyy 390,3 s tasonnousuun (−41 → −33 dBFS, aksentti 390,5 s). Sen jälkeen nopea liike jatkuu 391–405 s ilman puupuhallinkanavaa (jouset ja vaskit, liike 4–7 alkua/s) ja loppuu 405 s (taso −31 → −38 dBFS).
**Kuka soittaa:** puupuhaltimet (huilu, klarinetti), sen jälkeen jouset ja vaskit.
**Dynamiikka ja liike:** taso −48…−23 dBFS; keskiarvo −38; liike keskimäärin 4,0 alkua/s.
**Partituurissa:** kirjain G ja puupuhallinkuviot ("metsänpeikot ja -eläimet", Jalas; käyttäjä: puupuhallinkuviot G:ssä), tämä on V5:n paras ehdokas mutta **heikoin varmoista kohdista**.
**Mittaus:** V5 (382,2–390,2 s), `segments.py`-rajat 383,04 ja 390,3 s.

## 11. Vaskivoittoinen jakso: 6:48–7:42
**Mitä tapahtuu:** käyrätorvet (0,44) ja puupuhaltimet pitkinä pulsseina (vaski- ja puupuhallinkanavat 0,5–0,6 kohdissa 436–460 s, pulssi noin 4 s välein), väliin hiljaisempia jousipaikkoja. Urkupisteitä (35,1 = H1) 405–410, 442–447 ja 470–479 s. Jännite 0,51 ja selkeys 0,60. Vaskipulssit loppuvat 461,5 s ja puupuhaltimet tulevat nopeasti (0,85 kohdissa 464–466 s).
**Kuka soittaa:** käyrätorvet (0,44), puupuhaltimet, jouset.
**Dynamiikka ja liike:** taso −44…−23 dBFS (keskiarvo −33); liike vähäistä (1,1 alkua/s).
**Partituurissa:** ei tiedossa. Huom: käyttäjän t. 462 (Allegro moderato O:n jälkeen) sijoittuu mittauksen mukaan M:n *jälkeen* (jakso 17), ei tähän.
**Mittaus:** aikajana 6:48–7:42, `kanavat.json` `urkupisteet`, PANNs käyrätorvi.

## 12. Pitkä hajanainen osuus: 7:42–9:56
**Mitä tapahtuu:** hidas, vaihteleva osuus. Hiljaisia pudotuksia 504 s, 516 s ja 528 s (taso alle −50 dBFS) ja niiden välissä jousilohkot: **496,3–502,4 s** (jouset 0,9, urkupiste E, matalin spektri koko teoksessa) ja **519,9–524,7 s**. Puupuhaltimet palaavat 507–514 s ja 531–545 s (huilu 0,43), sen jälkeen jouset 543–555 s. Taso on 570–595 s noin −42…−52 dBFS ja putoaa −59 dBFS:iin kohdassa 597 s. Jännite 0,44, selkeys 0,64; liike 0,6 alkua/s.
**Kuka soittaa:** jouset (viulu 0,50, sello 0,38), puupuhaltimet (huilu 0,43), vaskit vähäisesti.
**Dynamiikka ja liike:** taso −73…−25 dBFS (keskiarvo −42): teoksen hiljaisin pitkä osuus ennen loppua.
**Partituurissa:** ei tiedossa. Käyttäjän kirjain J (jonka jälkeen ensimmäinen con sord.) on mahdollisesti tässä jaksossa (ei todennettu), ja sordiinoa ei voi mitata: ehdokkaat 496,3 s ja 519,9 s ovat tummimmat jousilohkot.
**Mittaus:** `aikajana.md` rivit 8:16–9:57, spektrin painopiste jousilohkoissa, `kanavat.json` `urkupisteet`.

## 13. Hiljainen jakso: 9:57–10:14
**Mitä tapahtuu:** taso alle −50 dBFS yhtäjaksoisesti 597,2–613,6 s (keskitaso −55, minimi −69), vähän liikettä (0,1 alkua/s); mitattavissa lähinnä heikkoa jousiääntä (jouset 0,11, viulu 0,11).
**Kuka soittaa:** hiljaiset jouset.
**Dynamiikka ja liike:** −48…−69 dBFS; rekisteri 0,55, selkeys 0,72.
**Partituurissa:** ei tiedossa.
**Mittaus:** tasoikkuna (1 s keskiarvo < −50 dBFS), `ajat_rattle2022.json` `hiljainen_jakso`.

## 14. Vaski- ja patarumpukohotus ja tutti-isku: 10:14–11:20
**Mitä tapahtuu:** taso nousee −50 → −36 dBFS (613,6–618 s). Vaskit tulevat 619,9 ja patarummut 620,0 s; isku 621,6 s (z 8,5), taso −33 → −25 dBFS. Taso on huipussaan −17,8 dBFS kohdassa 629,2 s, minkä jälkeen laskee. Sen jälkeen 636–680 s on melko voimakas (−26…−35 dBFS), vaihteleva jakso: jouset 636–640, vaskit ja puupuhaltimet vuorottelevat, ja C-duurivihjeitä (641,6–645,1 s; 655 s; 677–680 s).
**Kuka soittaa:** käyrätorvet (0,17), pasuunat (0,13), patarummut (0,05); myöhemmin jouset (viulu 0,27).
**Dynamiikka ja liike:** taso −54…−16 dBFS; liike 0,9 alkua/s.
**Partituurissa:** ei tiedossa.
**Mittaus:** jaksoraja 620,44 s (3. vahvin), aksentti 621,607 s, V6:n toinen ehdokas 641,6–645,1 s.

## 15. C-duuri-vihje: 11:20.0–11:25.1
**Mitä tapahtuu:** yhtäjaksoinen C-duurikolmisoinnun hallitsema jakso 5,1 s: C, E ja G ovat 58 % sävelkorkeusjakaumasta, selkeys 0,81 ja jännite 0,14 (matala). Taso −29 dBFS tasainen, liike nolla.
**Kuka soittaa:** jouset (0,24), vaskit ja puupuhaltimet vähäisesti.
**Dynamiikka ja liike:** −33…−26 dBFS, ei liikettä, selvä rauhoittuminen verrattuna ympäristöön.
**Partituurissa:** noin t. 392–396, noin 5 tahtia ennen kirjainta M (käyttäjä). Kesto 5,1 s vastaa vain suuruusluokaltaan viittä tahtia; kirjallisuus ei mainitse C-duuria.
**Mittaus:** V6 (680,03–685,13 s), kanava `vihje_Cduuri`.

## 16. Vaskien jyrinä: 11:25.1–11:51
**Mitä tapahtuu:** C-duurin jälkeen tekstuuri vaihtuu: liike 0,05 → 2,2 alkua/s, vaskikanava 0,54, taso −29 → −24 dBFS (keskiarvo −23, huippu −12 dBFS). Patarummut tulevat 685,2 s (patarumpu_stemmi-piikki 0,80, teoksen ainoa), jouset vaikenevat 684,9 s. Jakso päättyy 710,7 s tason pudotukseen −19 → −31 dBFS.
**Kuka soittaa:** vaskit (käyrätorvi 0,15, trumpetti 0,15, pasuuna 0,17), patarummut (0,15); jouset käytännössä nollassa (0,02).
**Dynamiikka ja liike:** taso −35…−12 dBFS, jaksokeskiarvoltaan tämän luettelon kovin (−23 dBFS); jännite 0,61, selkeys 0,55; ei terävää iskua, vaan paisuntaa (aksentteja ei ole).
**Partituurissa:** kirjain M, t. 397 (käyttäjä): myrskyn ennakko, ei vielä talvimyrsky.
**Mittaus:** V7, `interpret.py` 683,6 / 684,9 / 685,2 s, jaksoraja 684,54 s.

## 17. Jännitteinen jousijakso: 11:51–12:36.5
**Mitä tapahtuu:** jouset ja nopea liike: liike 2,9–4,3 alkua/s, jännite 0,86 (korkein koko teoksessa) ja selkeys 0,40; PANNs viulu 0,71 kohdassa 731 s, pizzicato ja jousisektio ainoa kerran yli 0,05 (729–732 s). Aksentteja 9 (z 5,0–9,7). Jouset-kanava 0,5–0,7 kohdissa 725–755 s. Jaksoa on kuvattu kirjallisuudessa kromaattiseksi jousitremoloksi, mutta tremolokanava on kuollut, joten tremoloa ei ole mitattu; mitattu on jousien nopea kuviointi ja dissonoiva sävelkorkeusjakauma.
**Kuka soittaa:** jouset (viulu 0,71, sello 0,10), puupuhaltimet (0,22), patarummut ja vaskit vähäisesti.
**Dynamiikka ja liike:** taso −43…−25 dBFS, tasaisempi ja hiljaisempi kuin edellinen vaskijakso; liike 3,4 alkua/s.
**Partituurissa:** ei tiedossa; sijoittuu M:n (t. 397) ja Allegro moderato O:n (t. 462) väliin.
**Mittaus:** `varmat_kohdat.md` V7 (jännite-/selkeysikkuna 706–778 s), `aksentit.md`, jaksoraja 756,2 s.

## 18. Vaskivuorottelu: 12:36.5–14:05.6
**Mitä tapahtuu:** jousten liike loppuu 756 s ja vaskit paisuvat vuorotellen: käyrätorvi johtaa (0,31 kohdassa 763,5 s), trumpetti ja pasuuna seuraavat (0,23–0,25 kohdassa 765 s), 4 s pulsseina (756,5–768,9 s). Sen jälkeen jouset (769–780 s) ja puupuhaltimet (781, 799 s) palaavat; hiljainen, harva kuviointi 779–805 s (taso −32…−41 dBFS, liike 0–2 alkua/s). Toinen vaskipaisunta 806–813 s nostaa tason −26 → −17 dBFS:iin (huippu 813,1 s, teoksen 3. kovin), minkä jälkeen jouset (813–817 s) ja hiljeneminen: taso laskee −35 → −59 dBFS:ään 841–845 s.
**Kuka soittaa:** käyrätorvet (0,32), trumpetit (0,26), pasuunat (0,26), jouset (viulu 0,44), puupuhaltimet.
**Dynamiikka ja liike:** taso −61…−15 dBFS (keskiarvo −32); liike 0,8 alkua/s.
**Partituurissa:** käyttäjän Allegro moderato O:n jälkeen t. 462: käyrätorvien < > ja trumpettien hidas vuorottelu; ehdokas 756,5–768,9 s (kohtalainen luottamus; vaihtoehto 806–813 s).
**Mittaus:** vaskikanava ja PANNs-käyrätorvi/trumpetti/pasuuna sekunnin tarkkuudella, jaksoraja 756,2 s, `ajat_rattle2022.json`.

## 19. Toinen hiljaisuus: 14:05.6–14:25.2
**Mitä tapahtuu:** taso alle −60 dBFS 845,6–865,2 s (19,6 s, keskitaso −64,3). Ensimmäiset 10 s (846–855 s) ovat käytännössä äänetön (soitinluokat 0,00). Noin 856,5 s jälkeen jouset tulevat hiljaa esiin (kanava 0,05 kohdassa 857,1 s, viulu 0,02–0,09), mutta taso pysyy huoneen kohinan tasolla (−65…−60 dBFS).
**Kuka soittaa:** ei ketään (846–855 s); jouset hyvin hiljaa (857–865 s).
**Dynamiikka ja liike:** −76…−57 dBFS; jännite 0,76 ja selkeys 0,45 (kohinan ja hiljaisen kuvioinnin vaikutus).
**Partituurissa:** käyttäjän ppp t. 523 sijoittuu tähän jaksoon (ehdokas 857,1 s).
**Mittaus:** `aikajana.md` "Hiljaiset kohdat", kanava `jouset`, `interpret.py` 856,3 s.

## 20. Nopea voimistuminen ja huippu: 14:25–15:13
**Mitä tapahtuu:** taso nousee +31 dB kymmenessä sekunnissa (865–875 s: −60 → −29 dBFS); jouset tulevat selvästi esiin 867,4 s (kanava 0,74). 875–889 s jouset ja vaskit vuorottelevat noin −30 dBFS:n tasolla (jouset 0,82 kohdissa 872–877 ja 882–889 s). Kohdassa 890,5 s taso hyppää −29 → −17 dBFS (jyrkin nousu +8,8 dB/s), jouset ja vaskit vaikenevat luokituksessa (tiheä äänimassa), patarummut tulevat 890,6 s. Samanlaisia tutti-aaltoja 896,5–899 s ja 904–912 s; teoksen kovin kohta 910,6 s (−15,2 dBFS).
**Kuka soittaa:** jouset (viulu 0,44), vaskit; tutti-huipuilla koko orkesteri; patarummut 0,05.
**Dynamiikka ja liike:** taso −63…−13 dBFS (keskiarvo −29): pisin tasaisen kova osuus; jännite 0,74, selkeys 0,47 (dissonoiva), rekisteri korkea (0,83); liike 1,6 alkua/s.
**Partituurissa:** t. 523 ppp (käyttäjä), nopea crescendo, t. 540 talvimyrsky iskee (käyttäjä); kirjallisuus: myrskyjakso t. 513–577 (Grimley), t. 523 (Wilker). Ehdokkaat: myrsky näkyy 857,1 s, nopea kasvu 867,4 s, isku 890,5 s (heikko luottamus; vaihtoehdot 867,4 ja 896,5 s).
**Mittaus:** tason derivaatta (`kanavat.json` `taso_dbfs`), `aksentit.md` (ei z ≥ 5 -iskuja: isku on paisuntaa), jaksoraja 891,38 s.

## 21. Myrskyn jälkeinen osuus: 15:13–17:05
**Mitä tapahtuu:** myrskyn kovin kohta laantuu: taso laskee −15 → −47 dBFS (910–922 s), vaskikorahdus 923–927 s (0,39), toinen paisunta 935,9 s (−50 → −32 dBFS), taso nousee −21 dBFS:iin (945 s). Korkea rekisteri (0,99) 950–955 s vaski- ja puupuhallinvoittoisena. Taso laskee −41 dBFS:iin (970 s), ja jouset nousevat esiin korkeassa rekisterissä (viulu 0,21 kohdassa 970 s). Sen jälkeen hidas laskeva liike, liike lähes nolla ja jännite 0,05–0,2 kohdissa 984–993 s. Viimeinen tutti-huipennus 1012,7 s (−16,8 dBFS, teoksen toiseksi kovin), jota seuraa lasku −65 dBFS:iin (1024 s).
**Kuka soittaa:** vaskit (käyrätorvi 0,18), jouset (viulu 0,28), puupuhaltimet vähän; huipennuksessa tiheä tutti.
**Dynamiikka ja liike:** taso −66…−15 dBFS (keskiarvo −35); liike 0,4 alkua/s; jännite laskee 0,7:stä 0,2:een.
**Partituurissa:** kirjallisuus: "huuto" korkeissa jousissa myrskyn jälkeen t. 586–587 (Grimley); ehdokas 970 s (heikko luottamus). Ei muuta tiedossa.
**Mittaus:** `kanavat.json`, `aikajana.md` rivit 15:13–17:05, jaksoraja 935,2 s (5. vahvin), `ajat_rattle2022.json` `huuto`, `loppuhuipennus`.

## 22. H-duuri-loppu: 17:04.65–17:31.4
**Mitä tapahtuu:** pimeästä (−65 dBFS) iskee äkkiä H-duurisointu (1024,65 s, +18 dB alle 0,2 s); sointu pysyy 26 s: H 0,37, Fis 0,28, Es (= Dis) 0,08 sävelkorkeusjakaumasta, selkeys 0,84, jännite 0,08. Taso hiljenee tasaisesti −35 → −49 dBFS.
**Kuka soittaa:** jouset (monijakoinen, kanava 0,09 matalana); patarummut, vaskit ja puupuhaltimet nollassa.
**Dynamiikka ja liike:** taso −56…−29 dBFS (keskiarvo −41), rekisteri matala (0,32), liike 0,6 alkua/s; tasainen, ei crescendoa.
**Partituurissa:** t. 624–634, H-duurisointu divisi-jousissa (Wilker); dynamiikka partituurista (käyttäjä: mezzoforte-sävy, lähteet eivät anna merkintää).
**Mittaus:** V8, `varmat_kohdat.md`, 1024,73 s `interpret.py`.

## 23. Loppu ja hiljaisuus: 17:31.4–17:58
**Mitä tapahtuu:** viimeinen sointu häipyy 1051,4–1051,7 s (taso −50 → −62 dBFS), viimeinen ei-nolla-näyte 1057,995 s, sen jälkeen digitaalinen hiljaisuus tiedoston loppuun (1078,0 s). Aplodeja ei ole.
**Kuka soittaa:** ei ketään.
**Dynamiikka ja liike:** −89…−56 dBFS; ei liikettä.
**Partituurissa:** teoksen viimeinen ääni, teos on 634 tahtia (Wilker).
**Mittaus:** `kohinaikkuna.log` (musiikki loppuu 1051,6 s), `aikajana.md` "Hiljaiset kohdat".

---

## Mitä tämä tulkinta ei kerro
- Se ei ole kuunteluopas: tarinaa, merkityksiä eikä kuvia ei ole; ne tulevat käyttäjän haastattelusta (vaihe 6).
- Jaksorajat ovat ehdotuksia: tarkat ajat ovat `annotations/ajat_rattle2022.json`:ssa perusteineen, ja käyttäjä vahvistaa ne korvalla.
- Ilman aikaa jäivät tuulenpuuska, kirjain B (matalat "askeleet") ja ensimmäinen con sord. (kirjain J): niitä ei voi mitata nykyisillä kanavilla.
