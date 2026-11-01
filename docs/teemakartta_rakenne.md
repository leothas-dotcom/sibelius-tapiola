# Teemakartan rakenne: levytysriippumaton kirjasto

*Päätös 1.11.2026. Kuunteluopas kirjoitetaan Rattle/LSO 2022 -äänityksestä, lopullinen video tehdään käyttäjän
omasta äänityksestä. Siksi teemakartta erottaa **mitä** (partituurin paikka, musiikillinen sisältö) ja **milloin**
(aika tietyssä levytyksessä). `make_cues.py` ja `kuunteluopas.py` lukevat molemmat.*

## Tiedostot
| Tiedosto | Sisältö | Kuka kirjoittaa |
|---|---|---|
| `annotations/teemat.json` | **ankkurit**: id, partituurin paikka (kirjain, tahti), mitä soi, luokka, tarina, lähde | ohjaaja ja käyttäjä (ainoa paikka, jossa sisältöä muokataan) |
| `annotations/ajat_<levytys>.json` | **ajat**: ankkuri-id → aika sekunteina ko. levytyksen kuuntelukopiossa, varmuus, peruste | analyysi (aikajana, aksentit) + käyttäjän korva; yksi tiedosto per levytys |
| `annotations/levytykset.json` | levytysten luettelo: id, kuuntelukopio, kesto, rooli (työ / lopullinen / arkisto) | ohjaaja |
| `annotations/cues.json` | generoitu: ankkurit + valitun levytyksen ajat + iskut | `make_cues.py --levytys <id>` |
| `annotations/kuunteluopas.md` | tarina + generoidut aikakoodit valitusta levytyksestä | käsin kirjoitettu tarina, `kuunteluopas.py --levytys <id>` täyttää ajat |

## Ankkurin kentät (`teemat.json`)
```json
{
  "id": "auringonsade",
  "kirjain": "M",
  "tahti_suhde": "noin 5 tahtia ennen M",
  "tahti": null,
  "luokka": "huippu",
  "soi": "yllättävä C-duuri korkeissa jousissa",
  "soittimet": ["jouset"],
  "tarina": "(käyttäjän sanat kuunteluoppaasta, viite)",
  "lahde": "käyttäjä, partituuri 1.11.2026",
  "tyyppi": "hetki"
}
```
- `tyyppi`: `hetki` (yksi aika) tai `jakso` (alku ja loppu ovat omia ankkureita `*_alku`, `*_loppu`).
- `luokka`: soitin / tunnelma / soolo / huippu / tauko / isku / jakso.
- `tahti` täytetään partituurista käyttäjän kautta. Tahtinumeroita ei lasketa äänestä.
- Ankkuri ilman partituuripaikkaa on sallittu väliaikaisesti (`kirjain: null`), mutta se merkitään `[tarkista]`.

## Aikojen kentät (`ajat_<levytys>.json`)
```json
{
  "levytys": "rattle2022",
  "kuuntelukopio": "build/kuuntelu/rattle_kuuntelu.wav",
  "ajat": {
    "avaus_patarumpu": { "t": 7.64, "varmuus": "vahvistettu", "peruste": "aksentit z10; käyttäjä kuuli" },
    "auringonsade":    { "t": null, "varmuus": "arvio", "peruste": "" }
  }
}
```
- `varmuus`: vahvistettu (käyttäjä kuullut) / analyysi (mitattu, ei kuultu) / arvio.
- Vahvistettua aikaa ei kirjoiteta yli koneellisesti.

## Siirto uuteen levytykseen
1. Uusi levytys → kuuntelukopio → sama analyysiputki → `aikajana`, `aksentit`.
2. `analysis/kohdista.py --from rattle2022 --to <uusi>`: DTW chroma- ja onset-piirteillä, ehdottaa jokaiselle
   ankkurille ajan uudessa levytyksessä (`varmuus: analyysi`), ja lähin isku tai jaksoraja tarkentaa.
3. Käyttäjä kuuntelee ja vahvistaa; vasta sitten `make_cues.py --levytys <uusi>`.

## Mitä ei muutu
- Kuvakäsikirjoitus nimeää ankkurin id:n, ei aikaa. Koodi lukee ajan cues.json:sta valitun levytyksen mukaan.
- Iskut (`aksentit.json`) ovat aina levytyskohtaisia; teemakartan `isku`-ankkuri nimeää, mikä isku (esim.
  "kirjaimen M tutti-isku"), ja aika tulee levytyksen aksenteista.
