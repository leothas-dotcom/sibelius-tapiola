# Tekstitys v1: tarkistus (13.11.2026)

Työkalu: `analysis/tekstitys.py`, viimeinen ajo: **0 riviä "RIKE"** (fi ja en).
93 tekstiä, ruudulla 433 s / 1078 s (40 %). Kerrokset: kuuntele 37 (39,8 %, raja 40), tarina 26, tausta 21 (22,6 %, raja 25), kone 9 (9,7 %, raja 15).
Oloaika 2,2-5,5 s per teksti, mediaani noin 3,7 s. Pisimmät tauot: 9:04-9:40 (35 s, Tapion salin lumisade), 13:55-14:25 (30 s), 9:44-10:13 (29 s),
17:09-17:31 (22 s, H-duuri: ei tekstiä), 16:04-16:24 (20 s). Revontulen aalto 16:34-16:40: yksi teksti. Alku: kaksi esittelytekstiä, loppu: "Metsä jatkuu."
Aikoja ei ole kirjoitettu käsin; ne tulevat ankkureista.

Kontaktiarkit (`tyo/esikatselu_fi_1..5.jpg`) katsottu. Korjattu kuvan perusteella: kide (3:28), jään alku (5:36), Tapion salin pylväät (8:28), M:n jälkeinen pimeys
(11:31), hermo (11:50). Poistettu: "Tapion paino on kumpu jään alla" (7:13): kumpua ei näkynyt ruudussa.

## Viisi epävarminta tekstiä
1. **ainola (17:31)**: Sibeliuksen 1948 lainaus on tutkimuksen luvussa 4 ilman [tarkista]-merkintää, mutta lähdearkistoa (`tehokeinot.md`) en avannut; yhteys Tapiolan hiljaisuuteen on tulkinta.
2. **lumisade (9:00)**: "alttoviulu on kuvan tuuli" perustuu tyyliohjeen 4d.42:een ja palautelistan riviin 136; kontaktiarkista ei erota, mikä lumen liikuttaa.
3. **jannitesoinnut (5:10)** "kuin metsä pidättäisi hengitystä": ohjaajan tulkinta kuunteluoppaasta; kuva oli tyhjä pimeä, joten kuva ei vahvista.
4. **kone_hyppy (6:30) ja kone_aalto (16:25)**: tiivistykset palautelistan riveistä 27 ja 164; "kone oli mitannut hypyn" on päätelmä oppaan mittausmerkinnästä.
5. **tilaus / kantaesitys / syyskuu 1926**: faktat tutkimuksen luvuista 1 ja 6; alkuperäislähteitä (FMQ, Wilker) en tarkistanut.

## Jätetty pois (lähde [tarkista] tai puuttuu)
- Sibeliuksen 12.12.1943 lainaus "Elegantti ranskalainen pehmeys ei sovi Tapiolaan" (opas: Jalaksen muistiinpanot [tarkista]).
- Värikuulo (C-duuri punainen, D-duuri keltainen, F-duuri vihreä): [tarkista]; kuvan punainen aurinko selitetty vain Kalevalan taotulla auringolla.
- "Väärä/sairas toivo" lähteenä: ei löytynyt kenelläkään; käytetty vain "väärä valo" (kuvasta).
- Kahdeksannen sinfonian tuhoamisen vuosi ja tapa: ei lähteessä.
- Alttoviulujen 11 kommenttia metsässä: soitinta ei voi nimetä ankkurilla (ks. `pyynnot.md`).
- Levytystä (Rattle) ei mainita. Tekstit eivät sisällä aikoja tai levytyskohtaisia lukuja; ne siirtyvät käyttäjän omaan äänitykseen ajamalla `make_cues.py` ja työkalu uudestaan.
