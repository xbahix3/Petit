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
      portrait: '60 70 360 360'
    },
    {
      id: 'gazelle', name: 'la gazelle', of: 'de la gazelle', ar: 'الغزال',
      cry: 'La gazelle bêle.',
      fact: 'La gazelle court très vite. Elle vit aussi dans le désert algérien !',
      portrait: '180 40 230 230'
    },
    {
      id: 'elephant', name: 'l\'éléphant', of: 'de l\'éléphant', ar: 'الفيل',
      cry: 'L\'éléphant barrit.',
      fact: 'L\'éléphant boit avec sa trompe. C\'est le plus gros animal de la terre !',
      portrait: '40 110 420 420'
    },
    {
      id: 'girafe', name: 'la girafe', of: 'de la girafe', ar: 'الزرافة',
      cry: 'La girafe souffle doucement.',
      fact: 'La girafe est l\'animal le plus grand du monde. Sa langue est très longue !',
      portrait: '100 30 250 250'
    },
    {
      id: 'loup', name: 'le loup', of: 'du loup', ar: 'الذئب',
      cry: 'Le loup hurle.',
      fact: 'Le loup vit en groupe : la meute. Il hurle pour appeler ses amis.',
      portrait: '196 46 290 290'
    },
    {
      id: 'perruche', name: 'la perruche', of: 'de la perruche', ar: 'الببغاء الصغير',
      cry: 'La perruche gazouille.',
      fact: 'La perruche est un oiseau qui aime parler et chanter avec ses amies.',
      portrait: '220 100 300 300'
    }
  ];

  // The 19 animal/part cards.
  // anchor: where the discovery hotspot sits (viewBox units, 800 x 600)
  // zoom:   close-up viewBox showing just that part
  var cards = [
    ['lion', 'criniere', 'la crinière', 'اللبدة', 'لبدة الأسد', [118, 300], '40 70 400 300'],
    ['lion', 'crocs', 'les crocs', 'الأنياب', 'أنياب الأسد', [238, 334], '168 272 140 105'],
    ['lion', 'griffes', 'les griffes', 'المخالب', 'مخالب الأسد', [349, 542], '284 470 130 98'],
    ['lion', 'queue', 'la queue', 'الذيل', 'ذيل الأسد', [748, 214], '620 160 180 135'],

    ['gazelle', 'cornes', 'les cornes', 'القرنان', 'قرنا الغزال', [314, 86], '238 40 150 113'],
    ['gazelle', 'sabots', 'les sabots', 'الحوافر', 'حوافر الغزال', [398, 538], '344 476 110 83'],
    ['gazelle', 'pattes', 'les pattes', 'القوائم', 'قوائم الغزال', [384, 470], '330 300 330 248'],

    ['elephant', 'trompe', 'la trompe', 'الخرطوم', 'خرطوم الفيل', [244, 404], '140 250 230 173'],
    ['elephant', 'defenses', 'les défenses', 'النابان', 'نابا الفيل', [208, 380], '170 296 170 128'],
    ['elephant', 'oreilles', 'les oreilles', 'الأذنان', 'أذنا الفيل', [96, 250], '30 110 450 338'],

    ['girafe', 'cou', 'le cou', 'العنق', 'عنق الزرافة', [338, 232], '200 90 280 210'],
    ['girafe', 'taches', 'les taches', 'البقع', 'بقع الزرافة', [520, 350], '360 250 300 225'],
    ['girafe', 'langue', 'la langue', 'اللسان', 'لسان الزرافة', [128, 122], '84 66 132 99'],

    ['loup', 'museau', 'le museau', 'الخطم', 'خطم الذئب', [284, 120], '214 60 160 120'],
    ['loup', 'oreilles', 'les oreilles', 'الأذنان', 'أذنا الذئب', [410, 106], '340 56 140 105'],
    ['loup', 'fourrure', 'la fourrure', 'الفرو', 'فرو الذئب', [540, 430], '360 190 320 240'],

    ['perruche', 'bec', 'le bec', 'المنقار', 'منقار الببغاء الصغير', [282, 226], '226 160 120 90'],
    ['perruche', 'ailes', 'les ailes', 'الجناحان', 'جناحا الببغاء الصغير', [534, 262], '370 150 260 195'],
    ['perruche', 'plumes', 'les plumes', 'الريش', 'ريش الببغاء الصغير', [372, 360], '250 110 360 270']
  ].map(function (c) {
    var a = animals.filter(function (x) { return x.id === c[0]; })[0];
    return {
      id: c[0] + '-' + c[1], animal: c[0], part: c[1],
      word: c[2],                       // « la crinière »
      full: c[2] + ' ' + a.of,          // « la crinière du lion »
      ar: c[3], arFull: c[4],
      anchor: c[5], zoom: c[6]
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
