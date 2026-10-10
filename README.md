# Le Petit Ranger

An educational web game for a 5AP class (5th year of primary school, Algeria):
wild animals and the parts of their body, in French, with an optional helper in
Modern Standard Arabic. Suri the meerkat ranger guides and encourages the pupil.

**Play:** https://xbahix3.github.io/Petit/ (once GitHub Pages is switched on, see below)

## Pour l'enseignante (en français)

- Ouvrez le lien sur un téléphone, une tablette ou un ordinateur. Après la première
  visite, le jeu fonctionne **sans internet**.
- Le bouton **ع** en haut affiche ou cache l'aide en arabe. Le bouton haut-parleur coupe le son.
- Cinq activités :
  - **Découverte** : toucher les points lumineux pour entendre et lire chaque partie.
  - **Montre-moi** : « Touche la trompe de l'éléphant. » L'élève touche la bonne partie.
  - **Écris le mot** : écrire le nom de la partie avec son article. La correction est
    tolérante (accents, article, petite faute, singulier/pluriel) et la bonne orthographe
    est toujours affichée, lettre par lettre.
  - **Quiz** : « À qui sont ces oreilles ? », « Comment s'appelle cette partie ? »,
    « Qui fait ce bruit ? »
  - **Mémoire** : associer l'image d'une partie et son mot.
  - **Les phrases** : « Le lion a ___ crinière. » (un, une ou des), vrai ou faux
    (« Le loup a des ailes. »), « Qui a une trompe ? » et devinettes « Qui suis-je ? ».
- Trois niveaux, choisis au camp : **Facile** (moins de questions, lettres à remettre
  dans l'ordre, indices rapides), **Moyen** et **Difficile** (dictée sans image,
  consigne seulement entendue dans « Montre-moi », 4 choix au quiz, 8 paires).
- Les erreurs ne sont jamais punies : son doux, couleur chaude, Suri encourage.
- Rien n'est enregistré sur les élèves.

## The 20 cards

| Animal | Parts |
| --- | --- |
| le lion | la crinière, les crocs, les griffes, la queue |
| la gazelle | les cornes, les sabots, les pattes |
| l'éléphant | la trompe, les défenses, les oreilles |
| la girafe | le cou, les taches, la queue |
| le loup | le museau, les oreilles, la fourrure, les crocs |
| la perruche | le bec, les ailes, les plumes |

The vocabulary, Arabic translations and fun facts live in `js/data.js`.

## Switching on GitHub Pages

1. On GitHub, open the repository's **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, branch **master**, folder **/ (root)**, then **Save**.
3. After a minute or two the game is live at https://xbahix3.github.io/Petit/.

## How it is built

- Plain HTML, CSS and JavaScript, with no build step and no external requests. It also runs
  if `index.html` is opened straight from a folder.
- The animals are painted illustrations (`img/animals/*.webp`, transparent backgrounds).
  `js/art/plates.js` holds, for each painting, a hand-traced zone per body part: where a tap
  counts, and where the highlight shows. The highlight is cut to the painting's own outline,
  so only the real mane, horn or paw lights up. `tools/plates.html` shows every zone for checking.
- Suri (`img/suri/`, five moods) and the title panorama (`img/title/`, landscape and portrait)
  are paintings too. On the title screen the six animal paintings stand on the panorama.
- Scenes are "alive": the painting breathes gently, light specks drift up, and the
  animal hops when its sound plays. A loading screen (Suri with binoculars) shows only
  on a slow first visit.
- `sw.js` caches the whole game (about 3 MB) for offline play. After changing any file,
  run `node tools/build-sw.js` so phones pick up the new version.

## Sounds and credits

| Sound | Source | Licence |
| --- | --- | --- |
| Lion roar | [Lionroar.wav](https://commons.wikimedia.org/wiki/File:Lionroar.wav), J. Growcott et al. | CC BY 4.0 |
| Elephant trumpet | [Elephant voice - trumpeting.ogg](https://commons.wikimedia.org/wiki/File:Elephant_voice_-_trumpeting.ogg), Info-farmer | CC0 |
| Wolf howls | [Wolf howls.ogg](https://commons.wikimedia.org/wiki/File:Wolf_howls.ogg) | Public domain |
| Giraffe snort and night hum | [Giraffe snort.oga](https://commons.wikimedia.org/wiki/File:Giraffe_snort.oga), [Giraffe Hum.oga](https://commons.wikimedia.org/wiki/File:Giraffe_Hum.oga), A. Baotic, F. Sicks, A. S. Stoeger | CC BY-SA 4.0 |
| Budgerigar flock | [XC924266](https://xeno-canto.org/924266), Louis Masarei | CC BY-NC-SA 4.0 |
| French words (43 clips) | ElevenLabs voice « Léa » (eleven_multilingual_v2), slowed to 80 % for young learners | ElevenLabs terms |
| French sentences and riddles | Piper "siwis" voice, trained on the SIWIS corpus (University of Edinburgh) | CC BY 4.0 |
| Feedback chimes | Synthesised in the browser (`js/audio.js`) | — |

No freely licensed recording of a gazelle was found, so the gazelle has no call and is
left out of the "Qui fait ce bruit ?" quiz.

Paintings (animals, Suri, title panorama): made for this game with ChatGPT's image model.

Fonts: Fredoka, Andika and Noto Naskh Arabic (SIL Open Font License).

## Development

```sh
node --test tests/*.test.js                     # forgiving answer checker
npx http-server -p 8080 .                       # serve locally
BASE=http://127.0.0.1:8080/index.html node tools/playtest.js /tmp/shots 1366x768
                                                # plays every activity, checks French typography
node tools/build-sw.js                          # refresh the offline file list
```

`tools/playtest.js` fails if any visible French text has a missing narrow no-break space
before `? ! ;`, a missing no-break space before `:`, or a straight apostrophe.
