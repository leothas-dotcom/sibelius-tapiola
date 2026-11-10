# Loppukriitikko: vedos 6 (`runs/vedos_v6/koko.mp4`, 17:58, 32 340 ruutua) vertailussa vedokseen 5

Katsoja: tuore, ei lukenut rakentajien tarkistus.md-raportteja. Liikesarjat ja mittaukset: `runs/vedos_v6/krit/` (kuvat) sekä
mittaus 240x136 harmaaruuduista ja 960x540-ruuduista (frame-erot, kirkkaus, valopisteiden syttyminen, pallon seuranta).
Ruutuaika = round(t*30). Kaikki ajat ovat kuuntelukopion aikaa (videon aika = teoksen aika; ääniraidan md5 on sama kuin vedoksessa 5).

**Tuomio: vedos 6 ei vielä kelpaa.** Rytmiasiat (keijut, jään salamat, vaskien takominen, puuska, hyppijät) on korjattu mitatusti ja ovat
selvästi parempia kuin vedoksessa 5. Mutta kaksi käyttäjän nimeämää asiaa (rivi 60 kummut, rivi 64 rungot) on korjattu vain osin, ja
vedokseen on tullut uusi vika (litteät mustat rungot 10:53–10:58).

## 1. Taulukko A: rivit 60–78

| Rivi | Käyttäjän sanat (tiivistetty) | Mitä vedoksessa 6 näkyy (aika, tiedosto, mittaus) | Tila | Mitä puuttuu |
|---|---|---|---|---|
| 60 | Kummut/vaarat eivät saa "ilmestyä"; hellästi vähitellen esiin usvasta | 0:24–0:28, `krit/r60c_v6.png`, `r60b_v6.png`. Ensimmäinen vaara alkaa heikkona valojuovana 0:24,5 ja on koko kumpuna 0:26. Reunaenergian nousu 10 %→90 %: vasen 1,27 s, keski 1,00 s, oikea 0,80 s (vedos 5: 0,83 / 0,83 / 2,93 s). Suurin muutos ruutua kohti 2,8–5,1 % huipusta (vedos 5: 10–12 %). Kummut 2 ja 3 (0:30–0:37) tulevat esiin hitaammin ja huomaamatta. | **osin (heikko)** | Brief vaati vähintään 5 s nousun; ensimmäinen vaara tulee yhä noin sekunnissa. Ruutu ruudulta sulavampi, mutta kokonaisuutena silti "ilmestyy" 0:24,5–0:26. Horisontin valaiseva kaista syttyy samalla. |
| 61a | Intensiteetti ei kasva viulujen nopeutuvassa kuviossa 0:45–0:52 | `krit/r61_v6.png`. Metsän kirkkaus (alapuoli) 0:46 → 0:52: 66 → 73 (+11 %); vedoksessa 5 se laski 71 → 58. Liike-energia 1,40 → 1,47 (0:46–0:52) → 1,67 (0:53) → 2,24 (0:54,5, fraasi). Valaistut puunlatvat kasvavat 0:50–0:54,4. | **osin** | Suunta on nyt oikea (kasvaa eikä laske), mutta kasvu on vaatimaton: liike +5 % ennen 0:53. Ei selvää "puuskan kasvua" 0:45–0:52. |
| 61b | Kuva ei reagoi yleistaukoon 0:58–1:01 | `krit/r62_v6.png`, mittaus: liike-energia 1,6 (0:55) → 0,8 (0:59), sitten kamera laskeutuu (1,05). Kirkkaus 0:58,5 nousee 37 → 46 ja laskee 1:01 → 27. Kovaa katkoa ei ole. | **osin / korjattu** | Reaktio on sama kuin vedoksessa 5 (hiljenee 0:58,5), lisäksi laskeutuminen. Lumi ei seiso selvästi paikallaan. |
| 61c | Kaikki liike sulavaa, ei yllättäviä paitsi iskuissa | Koko videon frame-erojen piikit (frame-diff > 6x paikallinen mediaani): kaikki uudet piikit osuvat iskuihin (11:46, 12:45–12:58 jousikommentit, 13:41, 14:52–15:10) paitsi **10:54,67–10:54,80 ja 10:58,17** (ks. bugi 1). | **osin** | Kaksi nimeämätöntä äkkimuutosta 10:54–10:58 (uusia). |
| 62 | Sauma 1:01,6 (leikkaus ei toimi GP-tauon kohdalla) | `krit/r62_v6.png`, `r62b_v6.png`. Vedos 5: kuva jäätyi 2,0 s (ruudut 1:01,53–1:03,5 frame-ero 0,00). Vedos 6: ei jäädytettyä jaksoa (jäädytetyt jaksot: vain 11:29,87 1,77 s ja 14:05,53 0,47 s, kumpikin jo vedoksessa 5). Kamera laskeutuu latvukseen 1:00,4–1:01,0, musta massa, uusi maailma kirkastuu 1:01,67 → 1:02,3 (kirkkaus 26,6 → 46,3 sulavasti, frame-ero 0,1–1,8). Sauman ruutu-ero 0,04. | **korjattu** | Pieni huomautus: 1:01,0–1:01,67 on lähes musta (0,6 s), eli kulku on tummennus eikä jatkuva kulku, mutta ei leikkausta eikä jäätä. Uuden metsän ensiruudut 1:01,8–1:02,2 vielä sumeita (`r62b_v6.png`). |
| 63 | Lumi reagoi alttoviulujen kommentteihin; valo ja sykkeet säilyvät | 1:05–2:56: ruutujen ero vedokseen 5 keskimäärin 0,68 (harmaa-aste), 28 erillistä lumitapahtumaa (1:06,3; 1:16,4; 1:27,2–1:28,5 (6,6 % pikseleistä); 1:49,8; 2:15–2:19 jne.). Kirkkauskäyrän korrelaatio vedoksen 5 kanssa 0,998, keskikirkkaus 43,35 / 43,37. | **osin** | Reaktio on olemassa mutta lähes huomaamaton: pieniä hiutaleita oksilta (`r63a_cmp.png`, 1:27,5–1:27,8). Käyttäjä ei välttämättä näe sitä. Valo ja sykkeet ennallaan: kyllä. |
| 64 | Rungot "bugittavat", jatkuvat ylös asti (3:04–3:23) | `krit/r64_v6.png`, `r64b_v6.png`. Läikät, levyt ja palkit (vedoksen 5 mustat läikät, harmaat levyt 3:10–3:19) ovat poissa; hallan valo kohoaa rungossa ja syttyy 3:15–3:19, kide avautuu sulavasti. | **osin** | Rungot jatkuvat edelleen suorina viivoina kuvan yläreunaan asti 3:04–3:15 (ei latvuksia, joihin ne päätyisivät, kuten brief vaati). 3:08–3:12 ruskeanoliivit sumeat hohtovanat rungon takana. Käyttäjän kysymys "jatkuvat ylös asti?" on yhä voimassa. |
| 65 | Keijut tanssivat puhaltajien kuvioiden tahtiin | 4:45–4:52 (285–292 s), 960x540, `krit/r65_v6.png`. Kirkkaiden valopisteiden syttyminen (uusi piste, peak > 150) verrattuna `alut.korkea`-aikoihin: **11 / 20 alkua syttyy täsmälleen alun ruudussa, 2 / 20 yhden ruudun päässä**, 7 ei ylitä havaintokynnystä (voima 0,24–0,43, yksi 0,67 @290,37 ei havaittu). Syttymisiä ilman alkua: 2 (288,37; 291,17). Vedos 5: 1 / 20 täsmälleen, 16 ohi. Syttymisen ja lähimmän alun etäisyys: 11 kpl 0 ruutua, loput hajaantuneita. | **korjattu** (mitattu) | Heikoimmat alut (voima < 0,4) eivät näy havaittavina syttymisinä; ei häiritsevää. |
| 66 | Pallo nyksähtää; pitäisi liikkua sulavasti | 5:25–5:33, `krit/r66_v6.png`, `r66b_v6.png`. Pisaran (kohokohdan) seuranta 960x540: suurin kiihtyvyys 2,0 px/ruutu^2 (5:25–5:31,3), ei piikkejä. Vedos 5: hyppy 48 px ruudussa 5:28,77. Pallo poistuu yläreunasta sulavasti 5:31,3–5:33,3. | **korjattu** (mitattu) | Ei mitään. (Huomio: 5:28–5:29 kuvan läpi menevä vaakareuna on myös vedoksessa 5, ei uusi.) |
| 67 | Keijut jäällä: eivät tanssi tahdissa | 5:54–6:02 (354–362 s), `krit/r67_v6.png`. Kirkastumisen nousu (yksittäisen keijun välähdys) ruudussa: `alut.korkea` 11 / 14 täsmälleen alun ruudussa, 3 / 14 yhden ruudun päässä; `korkea+keski` 20 / 24 täsmälleen ja 4 yhden ruudun päässä. Vedos 5: 1 / 14. | **korjattu** (mitattu) | Ei mitään. |
| 68 | 6:30: liikaa hyppijöitä, koominen; jatkavat vaikka musiikki lakkaa; tarkempi sovitus | 6:30–6:38, `krit/r68_v6.png`. Valopalloja kerrallaan 16–17 (maksimi 22), vedoksessa 5 50–62. Hyppyjen kirkastumisen osuma alkuihin: keskimääräinen nousu alkuruudussa on 2,57 x muiden ruutujen (vedos 5: 0,99), alkuruutujen mediaanipersentiili 0,88 (vedos 5: 0,55). Jousten viimeinen korkea alku 6:36,27; pallot 15 → 9 (6:37) → 8 (6:38) → 0 (6:38,5); vedoksessa 5 nolla vasta 6:39,5. Rengasaallot poissa. | **korjattu** (mitattu); koomisuus osin | Pallojen luku silti 16 ja ne ovat tasan samanmuotoisia ("kynttilä + heijastus"), joten koomisuus voi säilyä; tämä on makuasia, ei mittaa. Valot hiipuvat vielä 1–2 s viimeisen alun jälkeen (6:36,3 → 6:38,5). |
| 69 | Ei renkaita jäällä; halkeamat etenevät tahdissa | `krit/r69_v6.png`, `r69b_v6.png`, `r68_v6.png`: 5:48–7:07 otettu 3–0,5 s välein: **ei yhtään rengasta** (vedoksessa 5 ellipsit 6:26, 6:32–6:34). Halkeamia tulee lisää 5:54 → 6:12 kuvissa. | **korjattu** (halkeamat osin todennettu) | Halkeamien etenemistä nuotti nuotilta ei mitattu ruututarkasti (silmämääräinen: kasvaa vähitellen); jään keijujen välähdys on mitattu (rivi 67). 6:46–6:49 ja 7:04 jään alapuoli on tasavaalea suorakulmio (myös vedoksessa 5). |
| 70 | Salin valot ja usva 9:40→ säilyvät | Ks. taulukko B | **säilytetty** | |
| 71 | Vaskien takominen 11:46, 14:52, 14:59, 15:03, 15:10 | `krit/r71b_v6.png`, `r71c_v6.png`, `r71d_v6.png`, `r71e_v6.png`, `r71f_v6.png`. Valopilari ("trumpetin" pystyvalo, sama kieli kuin 10:28) syttyy: 14:52,02 (kirkkaus +26,8 ruudussa 26761 = alun ruutu), 14:58,97 (+33,5 @26969 = alun ruutu), 15:03,34 (+46,7 @27100 = alun ruutu), 15:10,04 (+12,1 @27301 = alun ruutu); 11:46,4 alku @21192 +2,3 ja huippu +14,4 seuraavassa ruudussa (alle yhden ruudun nousu). 15:10: neljä iskua 910,03 / 910,27 / 910,50 / 910,70; viimeinen on valkoinen pilarit täyttävä välähdys (kirkkaus 132 → 227 yhdessä ruudussa, hiipuu ~1 s). | **korjattu** (mitattu) | Viimeisen (15:10,7) pilarien reunat ovat rosoiset ("repeytynyt paperi") `r71f_v6.png`; tunnistettava mutta rosoisuus on tyylistä poikkeava. Ks. bugi 7. |
| 72 | Auringon edessä runko 11:02–11:25 | `krit/r72_v6.png`, `r72b_v6.png`, `r72c_v6.png`. Aurinko (punainen kiekko) näkyy kokonaan 11:00–11:28 (punaisten pikselien keskipiste x=264±5 / 480, ei pudotuksia). Rungot kulkevat auringon sivuilla. Vaakapalkki ("Tapion pöytä") kulkee auringon halon poikki koko ajan (design, rivi 70). | **korjattu** (aurinko) | **Mutta** 10:53–10:58 tulleet litteät mustat rungot (bugi 1): 10:57,0–10:58,3 aurinko on kokonaan rungon takana (punaisia pikseleitä 0). Se on ennen briefin ikkunaa, mutta kyseessä on sama vika "runko auringon edessä". |
| 73 | Pimeän metsän tummat liikkuvat varjot 11:32→ | Ks. taulukko B | **säilytetty** | |
| 74 | 12:44–13:01 jousten kommentit näkyviin; 13:01–13:05 nousu | 12:45–12:58: `r74_v6.png`. Jousten kommentit näkyvät talon kaaren/portin valonvälähdyksenä ja pystypilarina (keskilaatikon keskikirkkaus 44 → piikit 57–66 @ 12:45,4 / 12:49,7 / 12:51,5 / 12:54,8 / 12:56,4 / 12:58,1; vedos 5: ei piikkejä). 13:01,2–13:03,8: valokaista nousee kuvassa alhaalta ylös (rivi 99 → 34) = oktaavinousu `r75_v6.png`; vedos 5: ei liikettä. | **korjattu** | Näkyvyys on hillitty (keskialueen kirkkaus +30–50 %). Nousu päättyy 13:03,8 vaikka ankkuri jatkuu 13:05,3. |
| 75 | 13:31–13:33 iso taite | `r75b_v6.png`, kirkkaus: vedos 6: 45 (13:33,4) → 39 (13:33,8) → 55 (13:35); vedos 5: 45 → 38 monotonisesti. Valon kaari romahtaa 13:33,5–13:33,9 ja uusi valoisa maisema leviää. | **korjattu** (näkyy) | Muutos on selvä mutta se on 1,2 s pehmeä kasvu, ei "iso taite" iskuna. |
| 76 | Loppu 15:45→ | Ks. taulukko B | **säilytetty, bitilleen** | |
| 77 | Rytmiset elementit tarkemmin; loppupuolen analyysi | Ks. rivit 65, 67, 68, 71, 74, 75, 78 | **korjattu** (mitattu: keijut, jää, vaskien pilarit täsmälleen alun ruudussa) | |
| 78 | 13:40 tuulenpuuska ei näy | 13:41,0 (821,0 s): `r78_v6.png`. Lumivanat ja viistot hiutaleet koko kuvassa 13:41,0–13:41,8; kirkkaus 52 → 60 alun ruudussa (+8,2 @24630 = alun ruutu), laantuu 1 s. | **korjattu** (mitattu) | Ei mitään. |

## 2. Taulukko B: säilytettävät

| Rivi / kohta | Mittaus vedos 6 vs vedos 5 | Tulos |
|---|---|---|
| 63: valo ja sykkeet 1:05–3:00 | Kirkkauskäyrän korrelaatio 0,998, keskikirkkaus 43,35 / 43,37, suurin kirkkauden ero ruudussa 1,42; keskimääräinen ruutuero 0,68 (lumi); pikseleistä > 12 harmaa-astetta eroaa keskimäärin 0,23 % | **ennallaan** (lisäksi pieni lumi) |
| 65: keijujen ulkonäkö | 3:51–5:00 keskikirkkaus 65,01 / 64,88, korrelaatio 0,998; sivuilta ulkonäkö sama, vain syttymisajat muuttuneet | **ennallaan** |
| 70: sali ja usva 9:40–10:16 | ruutuero 0,12 (max 0,71), pikseleitä > 12: 0,00 %, korrelaatio 1,0000 | **ennallaan** |
| 71: trumpetit 10:26 | 10:24–10:36 ruutuero 0,14–0,33, kirkkauskäyrä korrelaatio 1,0000; muutokset alkavat vasta 10:36 (kameran sivusiirtymä) | **ennallaan** |
| 73: pimeä metsä 11:32→ | 11:32–11:46 ruutuero 0,00 (täsmälleen sama), muutokset vasta 11:46 (vaskien takominen, uusi) ja 11:58→ erot < 0,5 | **ennallaan** (11:46 lisäys on pyydetty) |
| 76: loppu 15:45–17:58 | ruudut 15:46→loppu (3959 ruutua): framemd5-listat identtiset; ääni-md5 identtinen; `osat/11_12.mp4` md5 sama kuin vedoksessa 5 (70144cc9…); 15:50→ ruutuero 0,00 | **bitilleen sama** |
| Ääni | koko videon ääniraidan md5 sama (68f70e0f…), kesto 1078,016 s sama | **ennallaan** |

## 3. Uudet virheet, joita vedoksessa 5 ei ollut

1. **Litteät mustat rungot 10:53–10:58** (ks. bugi 1).
2. **Rungon äkillinen katoaminen** 10:54,67–10:54,80 (5 ruudussa kaksisataa pikseliä leveä runko kutistuu 58 pikseliin) ja 10:58,17 (kuvan 68 % peittävä runko vaihtuu yhdessä ruudussa uuteen asetelmaan, kirkkaus 67 → 80).
3. Ruskeanoliivit hohtovanat 3:08–3:12 (`r64b_v6.png`), ei ole sidottu mihinkään elementtiin.
4. 15:10,7 valopilarien rosoiset reunat (`r71f_v6.png`), tunnistettavuus ok mutta ulkonäkö repeytynyt.
Ei havaittu: välkettä (0:08 ja 0:14 ruutuero 1,65 / 1,90 kuten vedoksessa 5), tyhjiä ruutuja (ainoat jäädytetyt jaksot 11:29,87 ja 14:05,53 olivat jo vedoksessa 5), geometrisia kuvioita muualla, nykäyksiä keijuissa.

## 4. Saumat

| Sauma | Ruutuero sauman ±2 ruudussa (vedos 6) | Havainto |
|---|---|---|
| 1:01,6 | 0,04–0,09 | Ei leikkausta; laskeutuminen mustaan, uusi maailma kirkastuu sulavasti 1:01,67 → 1:02,3 (vedoksessa 5 2 s jäätynyttä mustaa). |
| 3:23,0 | 0,16–0,37 | Ei hyppyä (sumu → sumu). |
| 5:36,8 | 0,03–0,10 | Ei hyppyä; sama kuin vedos 5. |
| 8:16,3 | 0,06–0,22 | Ei hyppyä, ennallaan. |
| 11:31,6 | 0,00–0,24 | Musta jakso 11:29,87–11:31,6 (1,77 s), sama kuin vedos 5. |
| 14:05,6 | 0,02–0,07 | Ei hyppyä (0,47 s jäätynyt, sama kuin vedos 5). |
| 15:45,0 | 0,17–0,19 | Ei hyppyä, bitilleen sama. |
Yhteenveto: yhdessäkään moduulirajassa ei ole leikkausta eikä hyppyä. Sen sijaan **moduulin sisällä** 10:54,7 ja 10:58,2 on piilotettu leikkaus (bugi 2).

## 5. Bugilista (estävät ensin)

1. **[ESTÄVÄ] Litteät mustat rungot 10:53–10:58 (07_08, auringon sommittelu).** Kamera ohittaa rungon, joka näkyy tasaisena mustana suorakulmiona (ei muotoa, ei valoa, ei syvyyttä), joka peittää 36–47 % ruudusta (10:54,0 36 %, 10:54,5 47 % pikseleistä < 30; 10:57,5–10:58,2 koko vasen puoli). Vedoksessa 5 samat kohdat olivat tavallisia ohuita runkoja. Rikkoo tyyliohjeen säännöt 8 ja 11 ("kerros on etäisyys ja valo, ei pahvi", ei ilmesty/katoa) ja käyttäjän rivin 72 hengen (runko ei saa peittää aurinkoa; 10:57,0–10:58,3 aurinko on kokonaan piilossa). Tiedostot: `runs/vedos_v6/krit/r72g_v6.png` (vedos 6), `r72g_v5.png` (vedos 5 vertailu), `r72d_v6.png`, `r72e_v6.png`.
2. **[ESTÄVÄ] Äkilliset muutokset 10:54,67–10:54,80 ja 10:58,17.** Litteä runko kutistuu 200 px → 58 px neljässä ruudussa (10:54,7) ja koko kuvan vasen puoli vaihtuu yhdessä ruudussa (10:58,17; frame-ero 14,5, paikallinen mediaani 1,9). Ei ole isku. Rikkoo rivin 61 ("ei yllättäviä") ja säännön 11. Tiedostot: `r72e_v6.png`, `r72d_v6.png`. Korjaus: rungot kulkevat kameran ohi jatkuvasti ja kasvavat lähestyessä (tai poistetaan nämä ohitukset).
3. **[ESTÄVÄ] Rivi 60: kummut tulevat yhä esiin noin sekunnissa (0:24,5–0:26).** Reunaenergian 10–90 % -nousu 0,8–1,3 s (brief vaati ≥ 5 s). Käyttäjän moite "ilmestyvät" ei ole poistunut ensimmäisen vaaran kohdalla; kummut 2 ja 3 ovat kunnossa. Tiedostot: `r60c_v6.png`, `r60b_v6.png`.
4. **[ESTÄVÄ] Rivi 64: rungot jatkuvat yhä ylös asti (3:04–3:15).** Läikät ja levyt on poistettu, mutta rungot ovat suoria viivoja kuvan yläreunaan, ei latvuksia (brief vaati päättymisen latvukseen); lisäksi ruskeanoliivit hohtovanat 3:08–3:12. Tiedostot: `r64_v6.png`, `r64b_v6.png`.
5. **[ISO] Rivi 63: lumen reaktio alttoviulujen kommentteihin on lähes huomaamaton.** 28 tapahtumaa, mutta pieniä hiutaleita (1:27,5–1:27,8 `r63a_cmp.png`, 0,6–6,6 % pikseleistä muuttuu). Käyttäjä pyysi "lumi tai joku" reagoimaan; nyt tuskin näkyy.
6. **[ISO] Rivi 61: intensiteetin kasvu 0:45–0:52 ja taukoreaktio ovat vaatimattomia** (kirkkaus +11 %, liike +5 %; tauossa liike 0,8 kuten ennenkin). Suunta oikea, mutta "kasvaa" ei lue. Tiedostot: `r61_v6.png`, `r62_v6.png`.
7. **[PIENI] 15:10,7 valopilarien reunat rosoiset** (`r71f_v6.png`); ja 15:10 valkoinen välähdys 132 → 227 yhdessä ruudussa (sallittu isku, mutta voimakas).
8. **[PIENI] 13:01–13:05 nousu päättyy 13:03,8** (ankkuri jatkuu 13:05,3); jousten kommentit 12:45–12:58 hillittyjä (`r74_v6.png`, `r75_v6.png`).
9. **[PIENI] 6:30–6:38 hyppijöitä yhä 16** ja valot hiipuvat 1–2 s viimeisen alun jälkeen; koomisuus on makuasia.
10. **[VANHA, ei uusi] 5:28–5:29 vaakareuna** koko kuvan läpi (`r66_v6.png`, myös `r66_v5.png`), 6:46–6:49 ja 7:04 jään tasavaalea suorakulmio (`r69b_v6.png`), 0:54,5–0:55,2 metsän äkillinen tummuminen (kirkkaus 60 → 45 0,3 sekunnissa; sama vedoksessa 5).

## 6. Yhteenveto käyttäjälle

Vedos 6 ei ole vielä valmis. Mitattuna korjattu: keijujen valot syttyvät nyt täsmälleen musiikin alkujen ruuduissa (4:45–4:52: 11/20 täsmälleen, 2/20 ruudun päässä; jäällä 5:54–6:02: 20/24 täsmälleen; vedoksessa 5 vain 1), pallo 5:25–5:33 liikkuu sulavasti, jäällä ei ole renkaita, hyppijöitä on 16 (ennen 50–62) ja ne pomppivat alkujen mukaan, vaskien takominen (11:46, 14:52, 14:59, 15:03, 15:10) ja tuulenpuuska 13:41 osuvat alun ruutuun, ja 12:44–13:05 jousten kommentit ja nousu näkyvät. Sauma 1:01,6 ei jäädy enää (2 s mustaa poistui). Loppu 15:45→ ja ääni ovat bitilleen samat kuin vedoksessa 5; salin valot, trumpetit 10:26 ja pimeän metsän varjot ovat ennallaan. Avoimia: rivi 60 kummut tulevat yhä esiin noin sekunnissa (ei viidessä), rivi 64 rungot jatkuvat yhä ylös asti, lumen reaktio alttoihin on lähes näkymätön, ja aurinkokohtaukseen (10:53–10:58) on tullut uusi vika: litteitä mustia runkoja peittää jopa puolet kuvasta ja ne katoavat äkkiä. Bugilista ei ole tyhjä, joten uusi kierros tarvitaan (estäviä 4).
