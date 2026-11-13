Lue ensin kokonaan `docs/visuaalinen_tyyli.md` (luvut 7 ja 12 erityisesti), sitten `annotations/kuunteluopas.md`, `docs/tapiola_tutkimus.md`, `docs/tutkimus/haastattelu.md` ja `docs/projekti.md`:n luku "Opit" ennen mitään muuta.

# Brief: tekstitykset v1 (13.11.2026)

## Mikä tämä on

Selittävät tekstitykset Tapiola-videolle (Sibelius, op. 112), samalla menetelmällä kuin Heldenleben-projektissa. Tekstit eivät ole dialogia: ne
ovat kuin joku istuisi katsojan vieressä ja kertoisi, mitä kuulet, mitä näet ja miksi. Tekstejä ei polteta videoon; ne ovat SRT-tiedostoja.

Käyttäjän sanat (13.11.2026): "Tehdään vielä tekstitykset tähän, samaan tyyliin kuin heldenlebenissä: Kuunteluoppaan mukaan, tarinaa mukaan
taustalta, taustatutkimuksesta mielenkiintosia juttuja, mitä kuvassa näkyy, mikä soi." ja "taustatutkimusta, miten kone oppi tulkitsemaan
Sibeliusta? Näitä myös tekstityksiin."

## Tehtäväsi

Kirjoita `runs/tekstitys_v1/tekstit.json` ja aja työkalu, kunnes rikkeitä on nolla:

```
.venv/Scripts/python.exe -I analysis/tekstitys.py --lahde runs/tekstitys_v1/tekstit.json --video runs/vedos_v8/koko.mp4 --out runs/tekstitys_v1 --esikatselu fi
```

Katso esikatselun kontaktiarkit (`runs/tekstitys_v1/tyo/esikatselu_fi_*.jpg`) ja tarkista jokaisesta tekstistä, että se vastaa sitä, mitä
ruudulla sillä hetkellä näkyy. Korjaa tekstiä tai ankkuria, jos ei vastaa. Älä muuta mitään muuta tiedostoa kuin `runs/tekstitys_v1/`-kansion
sisältöä. Älä renderöi videota. Jos tarvitset muutoksen yhteiseen tiedostoon (teemakartta, työkalu), kirjoita pyyntö tiedostoon
`runs/tekstitys_v1/pyynnot.md` äläkä tee sitä itse.

## Tiedoston muoto

```json
{
  "_ohje": "…",
  "nimi": "tapiola",
  "kielet": ["fi", "en"],
  "hiljaisuudet": [["hiljaisuus_1_alku", "hiljaisuus_1_loppu"], ["hiljaisuus_2_alku", "hiljaisuus_2_loppu"]],
  "versio": 1,
  "tekstit": [
    {"id": "avaus", "a": "alku", "kerros": "tarina", "lahde": "…", "fi": "…", "en": "…"},
    {"id": "x", "a": "ankkuri_id", "b": "toinen_ankkuri_id", "osuus": 0.5, "kerros": "kuuntele", "soittimet": ["sellot"], "lahde": "…", "fi": "Kuuntele: …", "en": "Listen: …"}
  ]
}
```

- **Ei sekunteja.** `a` on ankkurin id tiedostosta `annotations/cues.json` (`cues[].id`); lisäksi `alku`, `loppu` ja `<id>.loppu` (ankkurin loppu,
  jos sillä on `t_end`). `b` + `osuus` (0..1) sijoittaa tekstin kahden ankkurin väliin. `"ennakko": true` tuo tekstin 1,5 s ennen ankkuria.
- **Kerrokset:** `tarina` (mitä kuvassa näkyy ja mitä se tarkoittaa: Tapio, metsä, taika), `kuuntele` (mikä soi; alkaa sanalla "Kuuntele" /
  "Listen" ja nimeää `soittimet`, joiden on oltava ankkurin soittimet-listassa teemakartassa `annotations/teemat.json`), `tausta`
  (taustatutkimuksen kiinnostavat asiat: Sibelius 1926, tilaus, Ainola, kahdeksas sinfonia, motto), `kone` (miten kone oppi kuulemaan ja
  tulkitsemaan: kaikki kuva on koodia, kone mittasi äänen, ihminen korjasi korvallaan). Rajat: kuuntele enintään 40 %, tausta 25 %, kone 15 %.
- **Rajat, jotka työkalu tarkistaa:** enintään 2 riviä, rivi enintään 42 merkkiä; lukunopeus 15 merkkiä/s; teksti ei saa ajautua yli 4 s
  ankkuristaan; ei tekstiä yleistaukojen aikana.
- `lahde` jokaiselle tekstille: mistä väite on (kuunteluoppaan ankkuri, tutkimuksen luku, haastattelun kohta, partituurin sivu).

## Sisällön säännöt

1. **Vain tosia väitteitä.** Jokainen fakta (vuosi, nimi, lainaus, soitin) löytyy lähteistä `docs/tapiola_tutkimus.md`, `docs/tutkimus/*.md`,
   `annotations/kuunteluopas.md` tai `annotations/teemat.json`. Lainauksia ei keksitä. Jos lähde merkitsee asian **[tarkista]**, sitä ei käytetä.
   Tulkinta sanotaan tulkinnaksi ("kuin", "ehkä").
2. **Soittimet vain teemakartasta.** Älä nimeä soitinta, jota ankkurin `soittimet` ei sisällä. Heldenlebenissä väärä soitinväite vei
   uskottavuuden koko tekstitykseltä.
3. **Musiikkisanasto muusikon suomeksi:** sordiino (ei mykistin), divisi, tremolo, urkupiste, harjoituskirjain. Sävelnimet suomeksi: H = englannin
   B, B = englannin B♭; perussävellaji h-molli (englanniksi B minor), loppu H-duuri (B major).
4. **Yksi asia kuvassa on yksi asia äänessä** (tyyliohje 4d.42, luku 7): kun kerrot, mitä kuvassa näkyy, nimeä se elementti, joka tyyliohjeen
   luvun 7 mukaan vastaa sitä soitinta. Älä selitä tekniikkaa (shaderit, kaistat); kerro, mitä katsoja näkee ja kuulee.
5. **Kone-kerros** kertoo rehellisesti: kone ei kuule; se mittasi äänen 84 kaistalla 30 kertaa sekunnissa; ihminen (orkesterimuusikko) korjasi sen
   kuulemaa; esimerkkejä `docs/projekti.md`:n opeista ja palautelistasta (alttoviulujen yksitoista kommenttia, paisutukset, revontulen aalto
   puhaltimien linjasta c–d–e–fis, jonka käyttäjä osoitti mittauskuvasta). Älä liioittele ("tekoäly ymmärtää Sibeliusta" on väärin). Ei tekoälyn
   tuottamia kuvia: kaikki grafiikka on koodia.
6. **Rytmi:** noin 80–110 tekstiä 18 minuutille. Jätä musiikille tilaa: hiljaisissa ja kauneimmissa kohdissa (esimerkiksi revontulen aalto
   16:34–16:40, Tapion pöytä, loppu H-duuri) korkeintaan yksi lyhyt teksti tai ei mitään. Ei tekstiä joka ankkuriin.
7. **Alku:** kaksi ensimmäistä tekstiä kertovat, mikä tämä on (Sibelius, Tapiola, 1926; jokainen ruutu on koodia) ja että tekstitys kertoo, mitä
   kuulet. **Loppu:** viimeinen teksti ei selitä, vaan päästää irti.
8. Englanti on oma tekstinsä, ei sanasanainen käännös; samat faktat, sama rivimäärä.
9. Levytys: työäänitys on Rattle / London Symphony Orchestra 2022; **sitä ei mainita tekstityksissä**, koska lopullinen äänitys on käyttäjän oma.

## Valmis tarkoittaa

- `tekstit.json` olemassa, työkalu tulostaa 0 riviä "RIKE".
- `runs/tekstitys_v1/srt/tapiola.fi.srt` ja `tapiola.en.srt` generoitu, `tekstitys.md` (tarkistustaulukko) generoitu.
- Esikatselun kontaktiarkit katsottu; `runs/tekstitys_v1/tarkistus.md` kertoo: tekstien määrä ja kerrosjakauma, ruudulla oloaika, viisi tekstiä,
  joista olet epävarmin (ja miksi), sekä kaikki faktat, joita et löytänyt lähteistä ja jätit pois.
