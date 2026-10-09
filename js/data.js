/* Le Petit Ranger — vocabulary.
   French strings are written with plain spaces and straight apostrophes;
   PR.fr() applies French typography when they are displayed
   (narrow no-break space before ? ! ;, no-break space before :, curly apostrophe).
   Arabic is Modern Standard Arabic (fusha), used only as an optional helper. */
(function () {
  'use strict';
  var PR = (window.PR = window.PR || {});

  var animals = [
    {
      id: 'lion', name: 'le lion', of: 'du lion', ar: 'الأسد',
      cry: 'Le lion rugit.',
      fact: 'Le lion rugit très fort. On l\'entend de très loin !',
      portrait: '1080 20 460 460'
    },
    {
      id: 'gazelle', name: 'la gazelle', of: 'de la gazelle', ar: 'الغزال',
      cry: 'La gazelle est très discrète : on l\'entend à peine !',
      fact: 'La gazelle court très vite. Elle vit aussi dans le désert algérien !',
      portrait: '920 0 330 330'
    },
    {
      id: 'elephant', name: 'l\'éléphant', of: 'de l\'éléphant', ar: 'الفيل',
      cry: 'L\'éléphant barrit.',
      fact: 'L\'éléphant boit avec sa trompe. C\'est le plus gros animal de la terre !',
      portrait: '900 30 600 600'
    },
    {
      id: 'girafe', name: 'la girafe', of: 'de la girafe', ar: 'الزرافة',
      cry: 'La girafe est très discrète : elle souffle par le nez et, la nuit, elle fredonne tout doucement.',
      fact: 'La girafe est l\'animal le plus grand du monde. Sa langue est très longue !',
      portrait: '960 0 300 300'
    },
    {
      id: 'loup', name: 'le loup', of: 'du loup', ar: 'الذئب',
      cry: 'Le loup hurle.',
      fact: 'Le loup vit en groupe : la meute. Il hurle pour appeler ses amis.',
      portrait: '1110 10 420 420'
    },
    {
      id: 'perruche', name: 'la perruche', of: 'de la perruche', ar: 'الببغاء الصغير',
      cry: 'La perruche siffle et gazouille.',
      fact: 'La perruche est un oiseau qui aime parler et chanter avec ses amies.',
      portrait: '1100 200 300 300'
    }
  ];

  // The 20 animal/part cards.
  // anchor: where the discovery hotspot sits (painting coordinates, 1536 x 1024)
  // zoom:   close-up viewBox showing just that part
  // detail: optional close-up painting used for the zoom instead of the main one
  var cards = [
    ['lion', 'criniere', 'la crinière', 'اللبدة', 'لبدة الأسد', [1000, 300], '880 30 540 540'],
    ['lion', 'crocs', 'les crocs', 'الأنياب', 'أنياب الأسد', [1405, 385], '980 470 360 360', 'lion-crocs'],
    ['lion', 'griffes', 'les griffes', 'المخالب', 'مخالب الأسد', [1330, 912], '1200 780 250 250'],
    ['lion', 'queue', 'la queue', 'الذيل', 'ذيل الأسد', [130, 240], '20 140 270 270'],

    ['gazelle', 'cornes', 'les cornes', 'القرنان', 'قرنا الغزال', [985, 70], '860 0 340 340'],
    ['gazelle', 'sabots', 'les sabots', 'الحوافر', 'حوافر الغزال', [900, 955], '820 850 180 180'],
    ['gazelle', 'pattes', 'les pattes', 'القوائم', 'قوائم الغزال', [470, 790], '250 560 420 420'],

    ['elephant', 'trompe', 'la trompe', 'الخرطوم', 'خرطوم الفيل', [1445, 250], '1110 70 400 400'],
    ['elephant', 'defenses', 'les défenses', 'النابان', 'نابا الفيل', [1300, 470], '1090 270 360 360'],
    ['elephant', 'oreilles', 'les oreilles', 'الأذنان', 'أذنا الفيل', [780, 230], '560 20 470 470'],

    ['girafe', 'cou', 'le cou', 'العنق', 'عنق الزرافة', [930, 270], '760 90 360 360'],
    ['girafe', 'taches', 'les taches', 'البقع', 'بقع الزرافة', [690, 500], '560 390 270 270'],
    ['girafe', 'queue', 'la queue', 'الذيل', 'ذيل الزرافة', [372, 790], '270 640 250 250'],

    ['loup', 'museau', 'le museau', 'الخطم', 'خطم الذئب', [1455, 268], '1290 140 250 250'],
    ['loup', 'oreilles', 'les oreilles', 'الأذنان', 'أذنا الذئب', [1245, 100], '1150 10 290 290'],
    ['loup', 'fourrure', 'la fourrure', 'الفرو', 'فرو الذئب', [700, 420], '430 260 320 320'],
    ['loup', 'crocs', 'les crocs', 'الأنياب', 'أنياب الذئب', [1395, 322], '970 510 390 390', 'loup-crocs'],

    ['perruche', 'bec', 'le bec', 'المنقار', 'منقار الببغاء الصغير', [1330, 358], '1220 250 180 180'],
    ['perruche', 'ailes', 'les ailes', 'الجناحان', 'جناحا الببغاء الصغير', [560, 300], '300 40 540 540'],
    ['perruche', 'plumes', 'les plumes', 'الريش', 'ريش الببغاء الصغير', [1180, 640], '1030 480 280 280']
  ].map(function (c) {
    var a = animals.filter(function (x) { return x.id === c[0]; })[0];
    return {
      id: c[0] + '-' + c[1], animal: c[0], part: c[1],
      word: c[2],                       // « la crinière »
      full: c[2] + ' ' + a.of,          // « la crinière du lion »
      ar: c[3], arFull: c[4],
      anchor: c[5], zoom: c[6], detail: c[7] || null
    };
  });

  PR.data = {
    animals: animals,
    cards: cards,
    animal: function (id) { return animals.filter(function (a) { return a.id === id; })[0]; },
    card: function (id) { return cards.filter(function (c) { return c.id === id; })[0]; },
    cardsOf: function (animalId) { return cards.filter(function (c) { return c.animal === animalId; }); }
  };

  // Short helper lines in Arabic for each activity (generic, so no grammar traps).
  PR.ar = {
    discover: 'المس النقاط المضيئة لتتعرف على أجزاء الحيوان.',
    point: 'المس الجزء المطلوب.',
    spell: 'اكتب اسم الجزء المضيء.',
    quizWhose: 'لمن هذا الجزء؟',
    quizName: 'ما اسم هذا الجزء؟',
    quizSound: 'من يصدر هذا الصوت؟',
    memory: 'اعثر على الصورة والكلمة المتطابقتين.',
    listen: 'استمع'
  };
})();
