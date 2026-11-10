**Lue ensin `docs/visuaalinen_tyyli.md` kokonaan (kuvasäännöt luvussa 12, käyttäjän sanat luvussa 4d). Vasta sitten tämä ja oman moduulisi brief `runs/v6_<moduuli>/brief.md`.**

# Vedos 6: täsmäkorjaukset käyttäjän mobiilipalautteen jälkeen (10.11.2026 ilta)

Käyttäjä katsoi vedoksen 5: "Näyttää upealta. Kiitos!" Hänen palautteensa on sanatarkasti palautelistassa:
`docs/projekti.md` luku 2, **rivit 60–79. Lue ne kaikki**, ja oman moduulisi rivit kahdesti. Hänen työmääräyksensä (rivi 79):
jokainen muutos tarkistetaan ensin tyyliohjetta (`docs/visuaalinen_tyyli.md`), taustatutkimusta (`docs/tapiola_tutkimus.md`) ja
kuvakäsikirjoitusta (`docs/kuvakasikirjoitus.md`, luku "Uusi runko") vasten. Kirjoita `tarkistus.md`:n lisäykseen jokaisesta
muutoksesta yksi rivi: mihin kohtaan näissä kolmessa se nojaa.

## Tämä on täsmäkierros
- **Muuta vain oman briefisi nimeämät asiat.** Kaikki muu moduulissa on käyttäjän hyväksymää ("näyttää upealta") eikä saa
  muuttua. Vertaa lopuksi vähintään kolmea koskematonta kohtaa vanhaan renderiin: niiden pitää olla ennallaan.
- Säilytettävät, joihin ei kosketa missään tapauksessa: rivit 63 (valo ja sykkeet pimeässä metsässä 1:02–3:00), 65 (keijujen
  tanssin ulkonäkö), 70 (salin valot ja usva 9:40 eteenpäin), 71 (trumpettien kohta 10:26), 73 (pimeän metsän tummat liikkuvat
  varjot 11:32 eteenpäin), 76 (koko loppu, moduuli 11_12).
- Yhteiset säännöt vedoksesta 5 ovat voimassa (`runs/vedos_v5/brief.md`: kumipuut, nymfit, lumi liikkuu aina).

## Uutta: tarkat äänten alut (rytmi osuu ruutuun)
Käyttäjä: "Koita jaksaa kuunnella tosiaan sieltä vielä tarkemmin nuo rytmiset elementit, että ne osuu oikein." ja "Keijut ... eivät
tanssi musiikin tahdissa. Pitää olla juuri oikein."
- `annotations/cues.json` sisältää nyt kentän **`alut`**: `{matala: [[t, voima], ...], keski: [...], korkea: [...]}`: äänten alut
  noin 6 ms tarkkuudella kolmelta kaistalta (matala 55–260 Hz, keski 260–1050 Hz, korkea 1050–5000 Hz), `voima` 0,22–1. Moduulissa:
  `d.cues.alut.korkea` jne. (`lataa()` palauttaa `cues`-olion).
- **Jokainen rytminen kuvan tapahtuma (keijun valo, kosketus, vaskien leikkaus, askel) alkaa täsmälleen alun ruudussa**
  (`Math.round(t * 30)`), täydellä kirkkaudella enintään yhden ruudun nousulla. Ei tasoitusta, ei viivettä, ei omaa sykettä, ei
  autokorrelaatiota. Sävelkorkeuden saat lähimmästä nuotista (`d.nuotit`, ±60 ms), muuten jatka edellistä.
- **Kun alkuja ei tule, mikään ei tanssi.** Jos edellisestä alusta on yli noin 0,5 s, valo on jo hiipunut; se ei jatka liikettä.
- Todiste: tulosta 10 sekunnin jaksolta alkujen ajat ja niiden ruutujen numerot, joissa valo syttyy; niiden pitää olla samat.

## Uudet ja korjatut ankkurit (kuunteluopas `annotations/kuunteluopas.md` on generoitu uudelleen; lue oman välisi rivit)
`N_vasket_takovat` (11:46), `jousten_kommentit` (12:44–13:01), `jousten_nousu_473` (13:01–13:05), `P_taite_494` (13:33),
`puuska_499` (13:41), `vasket_myrsky_1/2/3` (14:52, 14:59, 15:03), `vasket_takovat_viimeinen` (15:10,04; neljä iskua).
Kentät `t` ja `t_end` löytyvät `cues`ista.

## Liike on sulavaa (rivi 61)
Käyttäjä: "kaikkien liikkeiden pitää olla sulavia. Ei yllättäviä (paitsi silloin kun on yllättävä isku)". Äkillinen muutos kuvassa
on sallittu vain äänen iskussa (nimetyt iskut ja tarkat alut). Kaikki muu (kamera, usva, valo, hiljaisuuteen asettuminen,
kappaleiden liike) on jatkuvaa ja pehmeää; ei nykäyksiä.

## Työn kulku
1. Lue yllä mainitut. Katso oman moduulisi nykyinen renderi liikesarjoina briefin kohdista
   (`.venv\Scripts\python.exe -I render/sarja.py <video> <alku_s> <askel_ruutuja> <n> <ulos.png> [leveys] [palstat]`; videon nolla = moduulin alku).
2. Kopioi nykyinen renderi talteen (`runs/v6_<moduuli>/osa_vedos5.mp4`). Muuta vain `visual/maailma_<moduuli>.js`.
3. Renderöi koko väli lukon kautta samaan paikkaan kuin ennen, sama ruutumäärä (`node render/lukittu.mjs --data build/rattle_koko
   --page "visual/maailma.html?m=<moduuli>&aa=2" --start A --end B --workers 2 --chunk 40 --out <sama polku>`; yksi renderi
   kerrallaan koneella, muut agentit käyttävät samaa lukkoa: odota vuoroasi, älä kierrä lukkoa; tarkista ruutumäärä ffprobella).
4. Katso tulos liikesarjoina jokaisesta briefin kohdasta ja kolmesta koskemattomasta kohdasta.
5. Lisää `tarkistus.md`:n loppuun luku "Vedos 6": jokainen briefin kohta (tehty / osin / ei, liikesarjan tiedosto, mittaluku),
   mihin tyyliohjeen, tutkimuksen ja käsikirjoituksen kohtaan muutos nojaa, ja mitä jäi auki. Raportoi vain se, minkä kuva näyttää.
Ei git-committeja. Ei muutoksia muihin tiedostoihin. Python `.venv\Scripts\python.exe -I`.
