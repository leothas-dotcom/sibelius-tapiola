"""Tekstitykset v2 (15.11.2026): englanti, tunne ja taika edellä. Lähtee v1:n ankkureista; korvaa tekstit, poistaa ja lisää. Ajat tulevat ankkureista."""
import json
J = json.load(open('runs/tekstitys_v1/tekstit.json', encoding='utf-8'))
EN = {
 'patarummut': "It begins with a drum, far away.",
 'jouset': "The strings whisper one small phrase.\nThe whole piece grows from this seed.",
 'gis': "Behind them the horns hold one note.\nIt was there all along.",
 'kuvan_gis': "Here that held note is the light on\nthe horizon. Each swell lifts a hill.",
 'lataus': "The drum roll gathers like weather.\nThe light grows until it must break.",
 'vaskien_isku': "The brass tears light\nthrough the forest.",
 'grimley': "A gust of wind sweeps through\nand carries the phrase away.",
 'yleistauko': "And then, silence.\nThe forest listens back.",
 'fis': "The strings return on one long note.\nIt will glow for almost a minute.",
 'tilaus': "Sibelius wrote this in 1926,\nfor an orchestra in New York.",
 'd_duuri': "A flash of warmth,\nlike sun through the branches.",
 'askeleet_alkavat': "Deep below, the basses begin to walk.\nSomething vast is coming.",
 'askeleet_valo': "Each step is a pulse of light on\nthe snow: weight without a foot.",
 'hengittaa': "Now the violas sing, four voices\nclose together. Each phrase swells,",
 'altot_tuuli': "and each swell is a breath of wind.\nSnow slips from the branches.",
 'kone84': "To draw this we taught a machine to\nlisten: 84 bands, 30 times a second.",
 'askeleet_B': "The footsteps keep their own time.\nIs it Tapio, the forest god?",
 'esipuhe': "The subtitle Sibelius agreed to:\nthe forest god and his nymphs.",
 'salmenhaara': "But a machine cannot hear magic.\nSo I sat beside it and listened.",
 'nousu_alku': "The ground holds one deep note,\nand everything above begins to climb.",
 'nousu_kuva': "Look up: the light is rising\ninto the treetops.",
 'pohja_katoaa': "The ground falls away. Flutes and\nclarinets weave high in the air.",
 'kide': "Inside a snow crystal, a new world:\nthe same forest within the old.",
 'staccato': "Tiny notes, in pairs.\nEach one is a small light.",
 'haltiat': "The score's motto: wood sprites\nin the gloom weave magic secrets.",
 'pikkolo': "Flutes and piccolo run upward:\none gust, and the snow flies.",
 'kone_paisutus': "The machine mixed up strings and winds.\nThe old paper score set it right.",
 'grazioso': "And here they dance: flutes, oboes,\ncor anglais, light on their feet.",
 'jalas': "Sibelius said: here the forest trolls\nand animals come out.",
 'jannitesoinnut': "One long low note, a tense chord\nabove. The forest holds its breath.",
 'hayes': "Nothing here was filmed.\nEvery frame is drawn by code.",
 'jaa': "The sound swells, then is cut off\nlike a blade. Black ice opens.",
 'peikot_G': "The strings skip, bows bouncing,\ntossing the figure back and forth.",
 'nymfit_jaa': "On the ice each bounce is a light,\nskipping like a thrown stone.",
 'gis_palaa': "The note from the very beginning\nreturns: a memory of where we started.",
 'kovempaa': "Suddenly all the strings together,\nloud. The lights move as a crowd.",
 'kone_hyppy': "The machine measured that jump\nbut drew nothing. I noticed.",
 'ratsastus': "The violins ride on,\nthe drum keeps a steady pulse.",
 'taite': "Play is over. The camera speeds up,\nsnow streams past.",
 'tapio': "Under the rush, heavy steps\nin the cellos and basses. Tapio walks.",
 'englannintorvi': "A cor anglais sings alone.\nA flute answers with long trills.",
 'kone_sata': "I used to wonder where my father\nfound those stories.",
 'huilupari': "Two flutes side by side: two lights\ndrifting closer to each other.",
 'sellot_K': "The cellos sing, muted, half voice.\nEverything else falls silent.",
 'sali': "A hall of vast trunks,\nmist drifting between the pillars.",
 'maa_varisee': "Underneath, the faintest drum roll.\nThe ground is trembling.",
 'lumisade': "The violas play, and snow begins to\nfall in the hall. They are the wind.",
 'poyta': "Tapio's table from the old folk poems:\nthree trunks, a plank laid across.",
 'nousu_vasket': "From far away, brass and drums\nbegin to rise.",
 'tutti': "The whole orchestra strikes,\nand light tears through the pillars.",
 'viisi_iskua': "Five hammer blows from trumpets\nand drums. The fifth is the heaviest.",
 'grimley2': "Remember this rhythm.\nIt will come back in the storm.",
 'valahdykset': "A strange light flickers three times\nbetween the trunks. Then it stays.",
 'c_vieras': "It is bright, but it does not belong.\nThis harmony is a stranger here.",
 'aurinko': "Like the forged sun of the Kalevala:\nit looks like gold, gives no warmth.",
 'M': "The brass thunders. Lightning, no\nrain: the storm is not here yet.",
 'askeleet_M': "The light is gone. The forest closes\nin and the footsteps return, loud.",
 'N_takominen': "The hammering returns: trumpets,\ntrombones, drums.",
 'hermo': "The strings grow restless, the mist\nstirs. Not a storm yet. Nerves.",
 'kantaesitys': "At its premiere in New York, 1926,\nthe reception was lukewarm.",
 'vuorottelu_vasket': "Horns and trumpets breathe in turn,\nslowly.",
 'kahdeksas': "After Tapiola, Sibelius turned to an\nEighth Symphony. It was destroyed.",
 'tovey': "Tovey heard one long, slow crescendo,\nthen a short fall into silence.",
 'nousu_473': "A rush from the basses up to the\nviolins: the wind lifts the snow.",
 'kone_kumi': "First our trees bent like rubber,\nthen stood like stone. Now: a hint.",
 'P': "Horns, trumpets, trombones swell\nfrom a whisper to full force.",
 'taite_494': "The storm holds back. Flutes, oboes\nand strings sing together, gently.",
 'taite_kuva': "Another place in the same forest:\nlight, colour, room to breathe.",
 'paisutus_tuuli': "The strings swell and the wind swells.\nSnow has weight: it glides, then slows.",
 'kone_tauko': "The machine heard silence here.\nThe score: no, strings, barely audible.",
 'ei_myrskya': "The score never says storm.\nListeners have always heard one.",
 'myrsky': "The winter storm breaks. Strings\nalone, full force. Everything falls.",
 'Q': "Trumpets, trombones and drums join.\nEarth and sky are in it now.",
 'huuto_valo': "Each cry of the brass is a blade\nof light through the snow.",
 'viimeinen_takominen': "The five blows once more,\nnow from the whole orchestra.",
 'gray': "Cecil Gray, 1931: this piece alone\nwould place him among the greatest.",
 'huuto_kamera': "We climb out of the storm,\nabove the treetops.",
 'huuto': "High strings, alone, at full force.\nThe cry.",
 'madetoja': "Madetoja heard a lone wanderer in\nthis music. Perhaps this is him.",
 'revontulet': "The sky opens. The northern lights,\na cold green arc.",
 'yksinaiset': "Clarinet, piccolo, bass clarinet:\nsingle voices, one at a time.",
 'kone_aalto': "My father told me stories about\nmusic. This is one, drawn with code.",
 'kaari': "The woodwinds rise and fall, slowly.\nThe aurora ripples with them.",
 'loppuhuipennus': "One last wave from the whole\norchestra. Then the minor lets go.",
 'H_duuri': "Strings alone, in the major: the only\ntime this music leaves the dark.",
 'ainola': "His last great work. Sibelius, 1948:\n'Here at Ainola, silence speaks.'",
 'metsa_jatkuu': "The forest goes on.",
}
POIS = {'avaus', 'avaus2', 'kone_gis', 'vuorottelu', 'alaotsikko', 'kone_fagotti', 'syyskuu'}
KERROS = {'hayes': 'kone', 'salmenhaara': 'kone', 'esipuhe': 'tausta', 'kone_sata': 'tarina', 'kone_aalto': 'tarina', 'grimley': 'tarina', 'yleistauko': 'tarina', 'tilaus': 'tausta',
          'd_duuri': 'tarina', 'c_vieras': 'tarina', 'grimley2': 'tarina', 'ei_myrskya': 'tausta'}
LAHDE = {'kone_sata': "käyttäjä (Heldenleben docs/youtube.md): 'I used to wonder where he got those stories'",
         'kone_aalto': "käyttäjä 15.11.2026: isä opetti kuulemaan asioita musiikista; teknologialla kuviteltu",
         'hengittaa': "partituuri s. 7-9: alttoviulut div. in 4, < >; käyttäjä 15.11.2026",
         'altot_tuuli': "rivi 172: alttojen paisutukset ovat tuulta; lumi tippuu oksilta fraasin alussa",
         'hayes': "CLAUDE.md: kaikki grafiikka koodilla", 'salmenhaara': "käyttäjä: kone mittaa, muusikko kuuntelee (palautelista)",
         'esipuhe': "tutkimus: Damrosch ehdotti alaotsikkoa, Sibelius hyväksyi (v1: alaotsikko)",
         'paisutus_tuuli': "rivi 170: tuuli on voima, lumella inertia ja kitka"}
SIIRTO = {'altot_tuuli': {'a': 'fis_hengittaa', 'b': 'askeleet_B', 'osuus': 0.28}, 'kone84': {'a': 'fis_hengittaa', 'b': 'askeleet_B', 'osuus': 0.62},
          'tilaus': {'a': 'e_pitka_ja_kuviot', 'b': 'nopea_liike_1_alku', 'osuus': 0.55}}
UUDET = [
 {'id': 'isa1', 'a': 'hiljaisuus_1_loppu', 'b': 'valo_D_duuri', 'osuus': 0.45, 'kerros': 'tarina', 'lahde': "käyttäjä (Heldenleben docs/youtube.md): 'When I was a child, my father and I listened to classical records together'", 'en': "When I was a child, my father and I\nlistened to records together."},
 {'id': 'isa2', 'a': 'valo_D_duuri', 'b': 'askeleet_alkavat', 'osuus': 0.5, 'kerros': 'tarina', 'lahde': "käyttäjä (sama): 'he told me what was happening in the music: who was speaking, who was arriving'", 'en': "He told me what was happening in\nthe music: who speaks, who arrives."},
 {'id': 'isa3', 'a': 'askeleet_alkavat', 'b': 'fis_hengittaa', 'osuus': 0.6, 'kerros': 'tarina', 'lahde': "käyttäjä (sama): 'joku istuu vieressä ja kertoo, mitä seuraavaksi tapahtuu'", 'en': "This film listens the way he taught\nme: someone beside you, telling it."},
]
out = []
for x in J['tekstit']:
    if x['id'] in POIS: continue
    assert x['id'] in EN, x['id']
    y = {k: v for k, v in x.items() if k != 'fi'}; y['en'] = EN[x['id']]
    if x['id'] in KERROS: y['kerros'] = KERROS[x['id']]
    if y['kerros'] != 'kuuntele': y.pop('soittimet', None)
    if x['id'] in LAHDE: y['lahde'] = LAHDE[x['id']]
    if x['id'] in SIIRTO: y.pop('b', None); y.pop('osuus', None); y.update(SIIRTO[x['id']])
    out.append(y)
out += UUDET
J['tekstit'] = out; J['kielet'] = ['en']; J['versio'] = 1
J['_ohje'] = ("Tapiolan tekstitykset v2 (15.11.2026): vain englanti, poltetaan vedokseen. Käyttäjä: 'pitäis tuoda esiin vähän taikuutta. Ei ehkä sellaista "
              "musiikkinörttiä ... mitä tunnetta välitetään, millä keinoin (mikä soi), ja sitten se omakohtainen tarina siitä miten isäni opetti lapsena kuulemaan "
              "asioita musiikista, ja miten me nyt käytimme teknologiaa kuvittelemaan tämän.' Ei sävelnimiä. Generoitu: runs/tekstitys_v2/rakenna.py v1:n ankkureista.")
json.dump(J, open('runs/tekstitys_v2/tekstit.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(out), 'tekstiä')
