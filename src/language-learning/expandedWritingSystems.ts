import type { WritingSystemInfo } from './scriptData';

export const EXPANDED_WRITING_SYSTEMS: WritingSystemInfo[] = [
  {
    id: 'georgian',
    name: 'Georgian Mkhedruli (ქართული)',
    type: 'Alphabet',
    direction: 'ltr',
    origin: 'Kingdom of Iberia (Georgia), 5th–10th Century CE',
    speakers: '4 Million',
    description:
      'Unicameral (no uppercase/lowercase) 33-letter alphabet used exclusively in Georgia. Every letter corresponds to one exact sound, featuring graceful rounded ascenders and descenders.',
    introSections: [
      {
        title: 'How to Read Georgian Mkhedruli',
        paragraphs: [
          'Georgian is a purely phonetic unicameral alphabet read left-to-right: there are no capital letters and no silent letters. It has 5 simple vowels (ა a, ე e, ი i, ო o, უ u) and 28 consonants.',
          'Watch out for lookalike loops: ვ (v), კ (k\'), პ (p\'), and ც (ts) have similar vertical hooks, while მ (m), შ (sh), and წ (ts\') have top loops.'
        ]
      }
    ],
    characters: [
      { char: 'ა', rom: 'a', name: 'Ani', phonetic: '/ɑ/', category: 'vowel', note: 'Curved S-hook open at top = A' },
      { char: 'ე', rom: 'e', name: 'Eni', phonetic: '/ɛ/', category: 'vowel', note: 'Curved C with bottom tail = E' },
      { char: 'ი', rom: 'i', name: 'Ini', phonetic: '/i/', category: 'vowel', note: 'Simple inverted U arch = I' },
      { char: 'ო', rom: 'o', name: 'Oni', phonetic: '/ɔ/', category: 'vowel', note: 'Two top ears on a circle = O' },
      { char: 'უ', rom: 'u', name: 'Uni', phonetic: '/u/', category: 'vowel', note: 'Wavy top with long descender = U' },
      { char: 'ბ', rom: 'b', name: 'Bani', phonetic: '/b/', category: 'familiar', note: 'Round belly with crooked neck = B' },
      { char: 'გ', rom: 'g', name: 'Gani', phonetic: '/ɡ/', category: 'familiar', note: 'Figure-8 loop extending down = G' },
      { char: 'დ', rom: 'd', name: 'Doni', phonetic: '/d/', category: 'familiar', note: 'Circle with dual bottom loops = D' },
      { char: 'ზ', rom: 'z', name: 'Zeni', phonetic: '/z/', category: 'familiar', note: 'Small top loop over circle = Z' },
      { char: 'თ', rom: 't', name: 'Tani', phonetic: '/tʰ/', category: 'familiar', note: 'Double-chambered oval = T' },
      { char: 'ლ', rom: 'l', name: 'Lasi', phonetic: '/l/', category: 'familiar', note: 'Triple-arched wave = L' },
      { char: 'მ', rom: 'm', name: 'Mani', phonetic: '/m/', category: 'familiar', note: 'Top loop over round belly = M' },
      { char: 'ნ', rom: 'n', name: 'Nari', phonetic: '/n/', category: 'familiar', note: 'Looks like Latin b with curled roof = N' },
      { char: 'რ', rom: 'r', name: 'Rae', phonetic: '/r/', category: 'familiar', note: 'Single arch with top-left horn = R' },
      { char: 'ს', rom: 's', name: 'Sani', phonetic: '/s/', category: 'familiar', note: 'Vertical stem with bottom bowl = S' },
      { char: 'ვ', rom: 'v', name: 'Vini', phonetic: '/v/', category: 'trap', note: 'TRAP: Curved 3-shape = V (compare კ K)' },
      { char: 'კ', rom: 'k', name: 'Kani', phonetic: '/kʼ/', category: 'trap', note: 'TRAP: Short top hook + deep tail = ejective K' },
      { char: 'პ', rom: 'p', name: 'Pari', phonetic: '/pʼ/', category: 'trap', note: 'TRAP: Double top wave = ejective P' },
      { char: 'ქ', rom: 'k / kh', name: 'Kani (aspirated)', phonetic: '/kʰ/', category: 'trap', note: 'TRAP: Crossed vertical stem = aspirated K' },
      { char: 'შ', rom: 'sh', name: 'Shini', phonetic: '/ʃ/', category: 'unique', note: 'Two tiny top horns + round belly = SH' },
      { char: 'ჩ', rom: 'ch', name: 'Chini', phonetic: '/tʃʰ/', category: 'unique', note: 'Forked top h-shape = CH' },
      { char: 'ც', rom: 'ts', name: 'Tsani', phonetic: '/tsʰ/', category: 'unique', note: 'U-bowl with left ascender = TS' },
      { char: 'ძ', rom: 'dz', name: 'Dzili', phonetic: '/dz/', category: 'unique', note: 'Tall right stem + bottom circle = DZ' },
      { char: 'ჭ', rom: 'ch (ejective)', name: 'Chari', phonetic: '/tʃʼ/', category: 'unique', note: 'Ornate vertical scroll = ejective CH' },
      { char: 'ხ', rom: 'kh', name: 'Khani', phonetic: '/x/', category: 'unique', note: 'Looks like Latin b with split top = KH' },
      { char: 'ჯ', rom: 'j', name: 'Jani', phonetic: '/dʒ/', category: 'unique', note: 'Crossed X with diagonal tail = J' }
    ],
    cityPractice: [
      { native: 'თბილისი', english: 'Tbilisi', acceptedAnswers: ['tbilisi'], regionHint: 'Capital of Georgia' },
      { native: 'ბათუმი', english: 'Batumi', acceptedAnswers: ['batumi'], regionHint: 'Adjara Black Sea Coast' },
      { native: 'ქუთაისი', english: 'Kutaisi', acceptedAnswers: ['kutaisi'], regionHint: 'Imereti Capital' },
      { native: 'რუსთავი', english: 'Rustavi', acceptedAnswers: ['rustavi'], regionHint: 'Kvemo Kartli' },
      { native: 'გორი', english: 'Gori', acceptedAnswers: ['gori'], regionHint: 'Shida Kartli' },
      { native: 'ზუგდიდი', english: 'Zugdidi', acceptedAnswers: ['zugdidi'], regionHint: 'Samegrelo' },
      { native: 'ფოთი', english: 'Poti', acceptedAnswers: ['poti'], regionHint: 'Black Sea Port' },
      { native: 'თელავი', english: 'Telavi', acceptedAnswers: ['telavi'], regionHint: 'Kakheti Wine Region' }
    ],
    sampleCountries: [
      { country: 'Georgia', nativeName: 'საქართველო', transliteration: 'Sakartvelo', flag: '🇬🇪' }
    ]
  },
  {
    id: 'armenian',
    name: 'Armenian (Հայոց գրեր)',
    type: 'Alphabet',
    direction: 'ltr',
    origin: 'Created by Mesrop Mashtots, 405 CE',
    speakers: '7 Million',
    description:
      '39-letter alphabet used in Armenia. Distinguished by vertical arch and U-shaped strokes that resemble Latin u, n, h, and s, but with completely different phonetic values.',
    introSections: [
      {
        title: 'Mastering Armenian False-Friend Letters',
        paragraphs: [
          'Armenian has several notorious false friends that look like Latin letters: ս = S (not u!), ո = O/VO (not n!), ն = N (looks like u with a right hook), հ = H, and պ = P (looks like u with a tail).',
          'Armenian punctuation uses a colon-like symbol (։) as a full stop at the end of sentences.'
        ]
      }
    ],
    characters: [
      { char: 'Ա ա', rom: 'a', name: 'Ayb', phonetic: '/ɑ/', category: 'vowel', note: 'Three vertical troughs (ա) = A' },
      { char: 'Ե ե', rom: 'ye / e', name: 'Yech', phonetic: '/jɛ/ or /ɛ/', category: 'vowel', note: 'Sounds like YE at word start, E inside words' },
      { char: 'Է է', rom: 'e', name: 'Eh', phonetic: '/ɛ/', category: 'vowel', note: 'Pure E vowel' },
      { char: 'Ը ը', rom: 'uh', name: 'Et (Schwa)', phonetic: '/ə/', category: 'vowel', note: 'Schwa vowel ("uh" as in about)' },
      { char: 'Ի ի', rom: 'i', name: 'Ini', phonetic: '/i/', category: 'vowel', note: 'Tall stem with descending right leg = I' },
      { char: 'Ո ո', rom: 'vo / o', name: 'Vo', phonetic: '/vɔ/ or /ɔ/', category: 'vowel', note: 'TRAP: Looks like Latin n, sounds like VO/O!' },
      { char: 'Ու ու', rom: 'u', name: 'U', phonetic: '/u/', category: 'vowel', note: 'Digraph ո + ւ = U ("oo")' },
      { char: 'Օ օ', rom: 'o', name: 'Oh', phonetic: '/ɔ/', category: 'vowel', note: 'Round O (same as Latin O)' },
      { char: 'Բ բ', rom: 'b', name: 'Ben', phonetic: '/b/', category: 'familiar', note: 'Tall stem with top crossbar = B' },
      { char: 'Գ գ', rom: 'g', name: 'Gim', phonetic: '/ɡ/', category: 'familiar', note: 'Loop with bottom horizontal bar = G' },
      { char: 'Դ դ', rom: 'd', name: 'Da', phonetic: '/d/', category: 'familiar', note: 'Arch with right descending tail = D' },
      { char: 'Զ զ', rom: 'z', name: 'Za', phonetic: '/z/', category: 'familiar', note: 'Loop with tail = Z' },
      { char: 'Կ կ', rom: 'k', name: 'Ken', phonetic: '/k/', category: 'familiar', note: 'U-shape with bottom right drop = K' },
      { char: 'Լ լ', rom: 'l', name: 'Lyun', phonetic: '/l/', category: 'familiar', note: 'Simple vertical L-hook = L' },
      { char: 'Մ մ', rom: 'm', name: 'Men', phonetic: '/m/', category: 'familiar', note: 'U-cup with tall right stem = M' },
      { char: 'Ս ս', rom: 's', name: 'Seh', phonetic: '/s/', category: 'trap', note: 'TRAP: Looks exactly like Latin U/u, sounds like S!' },
      { char: 'Ն ն', rom: 'n', name: 'Nu', phonetic: '/n/', category: 'trap', note: 'TRAP: Looks like u with top wave = N!' },
      { char: 'Հ հ', rom: 'h', name: 'Ho', phonetic: '/h/', category: 'trap', note: 'TRAP: Looks like Latin h, sounds like H' },
      { char: 'Պ պ', rom: 'p', name: 'Peh', phonetic: '/p/', category: 'trap', note: 'TRAP: Double U-trough with tail = P' },
      { char: 'Տ տ', rom: 't', name: 'Tyun', phonetic: '/t/', category: 'trap', note: 'TRAP: Looks like un-joined u+n = T' },
      { char: 'Շ շ', rom: 'sh', name: 'Sha', phonetic: '/ʃ/', category: 'unique', note: 'Curved 2-shape = SH' },
      { char: 'Չ չ', rom: 'ch', name: 'Cha', phonetic: '/tʃʰ/', category: 'unique', note: 'Inverted hook = CH' },
      { char: 'Ջ ջ', rom: 'j', name: 'Jeh', phonetic: '/dʒ/', category: 'unique', note: 'Top loop with bottom hook = J' },
      { char: 'Ռ ռ', rom: 'rr', name: 'Rra', phonetic: '/r/', category: 'unique', note: 'Trilled R (looks like n with foot)' },
      { char: 'Ր ր', rom: 'r', name: 'Reh', phonetic: '/ɾ/', category: 'unique', note: 'Tapped R (tall r-stem)' },
      { char: 'Վ վ', rom: 'v', name: 'Vev', phonetic: '/v/', category: 'unique', note: 'u-cup with tall middle-right stem = V' }
    ],
    cityPractice: [
      { native: 'Երևան', english: 'Yerevan', acceptedAnswers: ['yerevan', 'erevan'], regionHint: 'Capital of Armenia' },
      { native: 'Գյումրի', english: 'Gyumri', acceptedAnswers: ['gyumri'], regionHint: 'Shirak Province' },
      { native: 'Վանաձոր', english: 'Vanadzor', acceptedAnswers: ['vanadzor'], regionHint: 'Lori Province' },
      { native: 'Վաղարշապատ', english: 'Vagharshapat (Etchmiadzin)', acceptedAnswers: ['vagharshapat', 'etchmiadzin'], regionHint: 'Armavir Province' },
      { native: 'Աբովյան', english: 'Abovyan', acceptedAnswers: ['abovyan'], regionHint: 'Kotayk Province' },
      { native: 'Կապան', english: 'Kapan', acceptedAnswers: ['kapan'], regionHint: 'Syunik Province' },
      { native: 'Հրազդան', english: 'Hrazdan', acceptedAnswers: ['hrazdan'], regionHint: 'Kotayk Capital' },
      { native: 'Արմավիր', english: 'Armavir', acceptedAnswers: ['armavir'], regionHint: 'Armavir Capital' }
    ],
    sampleCountries: [
      { country: 'Armenia', nativeName: 'Հայաստան', transliteration: 'Hayastan', flag: '🇦🇲' }
    ]
  },
  {
    id: 'geez',
    name: 'Ethiopic Ge\'ez (ግዕዝ — Amharic & Tigrinya)',
    type: 'Abugida',
    direction: 'ltr',
    origin: 'Aksumite Empire (Ethiopia & Eritrea), 5th Century BCE',
    speakers: '65 Million',
    description:
      'Used for Amharic and Tigrinya in Ethiopia and Eritrea. Each base consonant shape is modified across 7 vowel orders (ä, u, i, a, e, ə, o) by adding small rings, legs, or hooks.',
    introSections: [
      {
        title: 'How the 7 Ethiopic Vowel Orders Work',
        paragraphs: [
          'In Ge\'ez (Fidel), each consonant has 7 forms depending on its vowel: 1st order = -ä/e (በ bä), 2nd order adds a right side tick = -u (ቡ bu), 3rd order adds a bottom right foot = -i (ቢ bi), 4th order shortens the left leg = -a (ባ ba), 5th order adds an ankle ring = -e (ቤ be), 6th order is pure consonant/ə (ብ bə), and 7th order adds a top loop or shortened right leg = -o (ቦ bo).',
          'Sentences end with four dots (።) and words are historically separated by two vertical dots (፡).'
        ]
      }
    ],
    characters: [
      { char: 'አ / ዐ', rom: 'a', name: 'Alef / Ayin (1st/4th)', phonetic: '/ʔa/', category: 'vowel', note: 'Vowel carrier A' },
      { char: 'ኡ / ኢ', rom: 'u / i', name: 'Alef U / I', phonetic: '/u/ or /i/', category: 'vowel', note: 'Right tick = U; bottom foot = I' },
      { char: 'ኤ / እ', rom: 'e / i (schwa)', name: 'Alef E / Schwa', phonetic: '/e/ or /ɨ/', category: 'vowel', note: 'Ankle ring = E; bent cross = ə/i' },
      { char: 'ኦ', rom: 'o', name: 'Alef O', phonetic: '/o/', category: 'vowel', note: 'Top horn = O' },
      { char: 'ሀ', rom: 'ha', name: 'Hoy', phonetic: '/ha/', category: 'familiar', note: 'Open bottom rectangle = HA' },
      { char: 'ለ', rom: 'le / la', name: 'Lawi', phonetic: '/lə/', category: 'familiar', note: 'Pointed tent arch = LE/LA' },
      { char: 'መ', rom: 'me / ma', name: 'May', phonetic: '/mə/', category: 'familiar', note: 'Two connected glasses = ME/MA' },
      { char: 'ረ', rom: 're / ra', name: 'Re\'es', phonetic: '/rə/', category: 'familiar', note: 'Slanted L-curve = RE/RA' },
      { char: 'ሰ', rom: 'se / sa', name: 'Sawt', phonetic: '/sə/', category: 'familiar', note: 'Two-legged comb = SE/SA' },
      { char: 'ሸ', rom: 'she / sha', name: 'Sha', phonetic: '/ʃə/', category: 'familiar', note: 'ሰ with top crown bar = SHE/SHA' },
      { char: 'ቀ', rom: 'qe / qa', name: 'Qaf', phonetic: '/kʼə/', category: 'familiar', note: 'Cross with top loop = ejective QE/QA' },
      { char: 'በ / ቨ', rom: 'be / ve', name: 'Bet / Vet', phonetic: '/bə/ vs /və/', category: 'trap', note: 'TRAP: Simple arch በ = B; with top bar ቨ = V' },
      { char: 'ተ / ቸ', rom: 'te / che', name: 'Tawi / Chawi', phonetic: '/tə/ vs /tʃə/', category: 'trap', note: 'TRAP: Cross ተ = T; with top hat ቸ = CH' },
      { char: 'ነ / ኘ', rom: 'ne / nye', name: 'Nahas / Nyahas', phonetic: '/nə/ vs /ɲə/', category: 'trap', note: 'TRAP: Lightning bolt ነ = N; with top bar ኘ = NY' },
      { char: 'ደ / ጀ', rom: 'de / je', name: 'Dent / Jent', phonetic: '/də/ vs /dʒə/', category: 'trap', note: 'TRAP: Round head + 2 legs ደ = D; with top bar ጀ = J' },
      { char: 'ከ', rom: 'ke / ka', name: 'Kaf', phonetic: '/kə/', category: 'unique', note: 'h-like arch = KE/KA' },
      { char: 'ወ', rom: 'we / wa', name: 'Wawe', phonetic: '/wə/', category: 'unique', note: 'Pretzel double-loop = WE/WA' },
      { char: 'ዘ', rom: 'ze / za', name: 'Zay', phonetic: '/zə/', category: 'unique', note: 'H-shape = ZE/ZA' },
      { char: 'የ', rom: 'ye / ya', name: 'Yaman', phonetic: '/jə/', category: 'unique', note: 'P-like loop on stem = YE/YA' },
      { char: 'ገ', rom: 'ge / ga', name: 'Geml', phonetic: '/ɡə/', category: 'unique', note: '7-shape cane = GE/GA' },
      { char: 'ጠ', rom: 'te (ejective)', name: 'Tait', phonetic: '/tʼə/', category: 'unique', note: 'Three-legged table = ejective T' },
      { char: 'ፈ', rom: 'fe / fa', name: 'Af', phonetic: '/fə/', category: 'unique', note: 'f-like hook with bottom bar = FE/FA' }
    ],
    cityPractice: [
      { native: 'አዲስ አበባ', english: 'Addis Ababa', acceptedAnswers: ['addis ababa', 'addis abeba'], regionHint: 'Capital of Ethiopia' },
      { native: 'አሥመራ', english: 'Asmara', acceptedAnswers: ['asmara', 'asmera'], regionHint: 'Capital of Eritrea' },
      { native: 'ጎንደር', english: 'Gondar', acceptedAnswers: ['gondar', 'gonder'], regionHint: 'Amhara Region' },
      { native: 'መቐለ', english: 'Mekelle', acceptedAnswers: ['mekelle', 'mekele'], regionHint: 'Tigray Capital' },
      { native: 'አዳማ', english: 'Adama (Nazret)', acceptedAnswers: ['adama', 'nazret'], regionHint: 'Oromia Region' },
      { native: 'ባሕር ዳር', english: 'Bahir Dar', acceptedAnswers: ['bahir dar', 'bahirdar'], regionHint: 'Lake Tana, Amhara' },
      { native: 'ድሬ ዳዋ', english: 'Dire Dawa', acceptedAnswers: ['dire dawa', 'diredawa'], regionHint: 'Eastern Ethiopia' },
      { native: 'ሐዋሳ', english: 'Hawassa (Awasa)', acceptedAnswers: ['hawassa', 'awasa'], regionHint: 'Sidama Capital' }
    ],
    sampleCountries: [
      { country: 'Ethiopia', nativeName: 'ኢትዮጵያ', transliteration: 'Ītyoṗya', flag: '🇪🇹' },
      { country: 'Eritrea', nativeName: 'ኤርትራ', transliteration: 'Ērtra', flag: '🇪🇷' }
    ]
  },
  {
    id: 'sinhala',
    name: 'Sinhala (සිංහල)',
    type: 'Abugida',
    direction: 'ltr',
    origin: 'Brahmi / Grantha Script, Sri Lanka',
    speakers: '17 Million',
    description:
      'Used across Sri Lanka (often on trilingual road signs with Tamil and English). Famous for its lush, circular apple-and-spiral letterforms with zero straight horizontal headers.',
    introSections: [
      {
        title: 'Reading Sinhala Circles & Vowel Strokes',
        paragraphs: [
          'Sinhala consonants carry an inherent "a" vowel (ක = ka). A small top flag/tick (්, hal kirīma) mutes the vowel (ක් = k), while a detached curved pillar (ා) after the letter makes it long "aa" (කා = kā).',
          'A semicircular arch over the letter makes "i" (කි = ki), and a spiral in front of the letter makes "e" (කෙ = ke).'
        ]
      }
    ],
    characters: [
      { char: 'අ / ආ', rom: 'a / aa', name: 'Ayanna / Aayanna', phonetic: '/a/ or /aː/', category: 'vowel', note: 'Initial vowel A / AA' },
      { char: 'ඉ / ඊ', rom: 'i / ii', name: 'Iyanna', phonetic: '/i/ or /iː/', category: 'vowel', note: 'Initial vowel I / II' },
      { char: 'උ / ඌ', rom: 'u / uu', name: 'Uyanna', phonetic: '/u/ or /uː/', category: 'vowel', note: 'Initial vowel U / UU' },
      { char: 'එ / ඒ', rom: 'e / ee', name: 'Eyanna', phonetic: '/e/ or /eː/', category: 'vowel', note: 'Initial vowel E / EE' },
      { char: 'ඔ / ඕ', rom: 'o / oo', name: 'Oyanna', phonetic: '/o/ or /oː/', category: 'vowel', note: 'Initial vowel O / OO' },
      { char: 'ක', rom: 'ka', name: 'Kayanna', phonetic: '/ka/', category: 'familiar', note: 'Double-lobed apple with right hook = KA' },
      { char: 'ග', rom: 'ga', name: 'Gayanna', phonetic: '/ɡa/', category: 'familiar', note: 'Open left curl + right loop = GA' },
      { char: 'ච', rom: 'cha', name: 'Chayanna', phonetic: '/tʃa/', category: 'familiar', note: 'Round belly with flat roof = CHA' },
      { char: 'ජ', rom: 'ja', name: 'Jayanna', phonetic: '/dʒa/', category: 'familiar', note: 'Curled spiral with top loop = JA' },
      { char: 'ට', rom: 'ta', name: 'Tayanna (retroflex)', phonetic: '/ʈa/', category: 'familiar', note: 'Simple O-circle open at top = TA' },
      { char: 'ඩ', rom: 'da', name: 'Dayanna (retroflex)', phonetic: '/ɖa/', category: 'familiar', note: 'W-bottom inside circle = DA' },
      { char: 'ත / න', rom: 'ta / na', name: 'Thayanna / Nayanna', phonetic: '/t̪a/ vs /na/', category: 'trap', note: 'TRAP: ত-like twin arches: த (no middle loop) = TA; න (inner knot) = NA!' },
      { char: 'ම / ව', rom: 'ma / va', name: 'Mayanna / Vayanna', phonetic: '/ma/ vs /ʋa/', category: 'trap', note: 'TRAP: Closed top loop ම = MA; open top C-circle ව = VA!' },
      { char: 'ප / ස', rom: 'pa / sa', name: 'Payanna / Sayanna', phonetic: '/pa/ vs /sa/', category: 'trap', note: 'TRAP: प-like curl ප = PA; extra left wing ස = SA!' },
      { char: 'බ / ඛ', rom: 'ba / kha', name: 'Bayanna / Khayanna', phonetic: '/ba/ vs /kʰa/', category: 'trap', note: 'TRAP: Inner spiral බ = BA; open bottom ඛ = KHA' },
      { char: 'ද', rom: 'da (dental)', name: 'Dayanna', phonetic: '/d̪a/', category: 'unique', note: 'Curved C with descending tail = dental DA' },
      { char: 'ය', rom: 'ya', name: 'Yayanna', phonetic: '/ja/', category: 'unique', note: 'C-curve + vertical right loop = YA' },
      { char: 'ර', rom: 'ra', name: 'Rayanna', phonetic: '/ra/', category: 'unique', note: 'Teardrop bulb open at top = RA' },
      { char: 'ල', rom: 'la', name: 'Layanna', phonetic: '/la/', category: 'unique', note: 'Round C with inner curl = LA' },
      { char: 'හ', rom: 'ha', name: 'Hayanna', phonetic: '/ha/', category: 'unique', note: 'Left loop + right arch = HA' }
    ],
    cityPractice: [
      { native: 'කොළඹ', english: 'Colombo (Kolamba)', acceptedAnswers: ['colombo', 'kolamba'], regionHint: 'Commercial Capital of Sri Lanka' },
      { native: 'මහනුවර', english: 'Kandy (Mahanuvara)', acceptedAnswers: ['kandy', 'mahanuvara'], regionHint: 'Central Province' },
      { native: 'ගාල්ල', english: 'Galle (Galla)', acceptedAnswers: ['galle', 'galla'], regionHint: 'Southern Province' },
      { native: 'යාපනය', english: 'Jaffna (Yapanaya)', acceptedAnswers: ['jaffna', 'yapanaya'], regionHint: 'Northern Province' },
      { native: 'මීගමුව', english: 'Negombo (Migamuwa)', acceptedAnswers: ['negombo', 'migamuwa'], regionHint: 'Western Province' },
      { native: 'අනුරාධපුරය', english: 'Anuradhapura', acceptedAnswers: ['anuradhapura'], regionHint: 'North Central Province' },
      { native: 'ත්‍රිකුණාමලය', english: 'Trincomalee', acceptedAnswers: ['trincomalee'], regionHint: 'Eastern Province' },
      { native: 'මාතර', english: 'Matara', acceptedAnswers: ['matara'], regionHint: 'Southern Coast' }
    ],
    sampleCountries: [
      { country: 'Sri Lanka', nativeName: 'ශ්‍රී ලංකාව', transliteration: 'Śrī Laṃkāva', flag: '🇱🇰' }
    ]
  },
  {
    id: 'kannada',
    name: 'Kannada (ಕನ್ನಡ)',
    type: 'Abugida',
    direction: 'ltr',
    origin: 'Kadamba / Old Kannada Script, Karnataka (India)',
    speakers: '60 Million',
    description:
      'Used throughout Karnataka (Bengaluru, Mysuru, Mangaluru). Sister script to Telugu, distinguished by a flat horizontal eyebrow bar (talebattu) with a small upward hook on top of letters.',
    introSections: [
      {
        title: 'Spotting Kannada vs. Telugu',
        paragraphs: [
          'Kannada and Telugu share the same Kadamba ancestor and look 80% identical in their round bodies. The fastest way to tell them apart: Telugu crowns its letters with a V-shaped checkmark (✓), whereas Kannada crowns its letters with a flat horizontal roof bar that ends in a small vertical tick.',
          'Just like Telugu, a circle ० (anusvara, ಂ) after any syllable adds an M/N nasal ending (ಕಂ = kam/kan).'
        ]
      }
    ],
    characters: [
      { char: 'ಅ / ಆ', rom: 'a / aa', name: 'A / Aa', phonetic: '/ɐ/ or /aː/', category: 'vowel', note: 'Curled spiral = initial vowel A / AA' },
      { char: 'ಇ / ಈ', rom: 'i / ii', name: 'I / Ii', phonetic: '/i/ or /iː/', category: 'vowel', note: 'Initial vowel I / II' },
      { char: 'ಉ / ಊ', rom: 'u / uu', name: 'U / Uu', phonetic: '/u/ or /uː/', category: 'vowel', note: 'Initial vowel U / UU' },
      { char: 'ಎ / ಏ', rom: 'e / ee', name: 'E / Ee', phonetic: '/e/ or /eː/', category: 'vowel', note: 'Initial vowel E / EE' },
      { char: 'ಒ / ಓ', rom: 'o / oo', name: 'O / Oo', phonetic: '/o/ or /oː/', category: 'vowel', note: 'Initial vowel O / OO' },
      { char: 'ಕ', rom: 'ka', name: 'Ka', phonetic: '/kɐ/', category: 'familiar', note: 'Round circle with crossed top bar = KA' },
      { char: 'ಗ', rom: 'ga', name: 'Ga', phonetic: '/ɡɐ/', category: 'familiar', note: 'Simple arch with top eyebrow = GA' },
      { char: 'ಚ', rom: 'cha', name: 'Cha', phonetic: '/tʃɐ/', category: 'familiar', note: 'Cupped wave = CHA' },
      { char: 'ಜ', rom: 'ja', name: 'Ja', phonetic: '/dʒɐ/', category: 'familiar', note: 'Double loop = JA' },
      { char: 'ಟ', rom: 'ta (retroflex)', name: 'Ta', phonetic: '/ʈɐ/', category: 'familiar', note: 'W-bottom curve = retroflex TA' },
      { char: 'ಡ', rom: 'da (retroflex)', name: 'Da', phonetic: '/ɖɐ/', category: 'familiar', note: 'Rounded C with dual bottom bumps = DA' },
      { char: 'ತ', rom: 'ta (dental)', name: 'Ta', phonetic: '/t̪ɐ/', category: 'familiar', note: 'Curled spiral under flat bar = dental TA' },
      { char: 'ದ', rom: 'da (dental)', name: 'Da', phonetic: '/d̪ɐ/', category: 'familiar', note: 'Heart shape under flat bar = dental DA' },
      { char: 'ವ / ಪ', rom: 'va / pa', name: 'Va / Pa', phonetic: '/ʋɐ/ vs /pɐ/', category: 'trap', note: 'TRAP: Attached eyebrow ವ = VA; detached eyebrow ಪ = PA!' },
      { char: 'ನ / ಸ', rom: 'na / sa', name: 'Na / Sa', phonetic: '/nɐ/ vs /sɐ/', category: 'trap', note: 'TRAP: Attached roof ನ = NA; detached roof ಸ = SA!' },
      { char: 'ಮ / ಯ', rom: 'ma / ya', name: 'Ma / Ya', phonetic: '/mɐ/ vs /jɐ/', category: 'trap', note: 'TRAP: Small left loop ಮ = MA; large left circle ಯ = YA!' },
      { char: 'ಬ / ಭ', rom: 'ba / bha', name: 'Ba / Bha', phonetic: '/bɐ/ vs /bʱɐ/', category: 'trap', note: 'TRAP: Simple 2-curl ಬ = BA; with top bar & drop ಭ = BHA' },
      { char: 'ರ', rom: 'ra', name: 'Ra', phonetic: '/rɐ/', category: 'unique', note: 'Full circle under eyebrow = RA' },
      { char: 'ಲ', rom: 'la', name: 'La', phonetic: '/lɐ/', category: 'unique', note: 'U-bowl with inner curl = LA' },
      { char: 'ಳ', rom: 'lla (retroflex)', name: 'Lla', phonetic: '/ɭɐ/', category: 'unique', note: 'Crossed figure-8 = retroflex LLA' },
      { char: 'ಶ / ಷ', rom: 'sha', name: 'Sha', phonetic: '/ʃɐ/', category: 'unique', note: 'Loop with right tail = SHA' },
      { char: 'ಹ', rom: 'ha', name: 'Ha', phonetic: '/hɐ/', category: 'unique', note: 'Circle + right wing under bar = HA' }
    ],
    cityPractice: [
      { native: 'ಬೆಂಗಳೂರು', english: 'Bengaluru (Bangalore)', acceptedAnswers: ['bengaluru', 'bangalore'], regionHint: 'Karnataka Capital' },
      { native: 'ಮೈಸೂರು', english: 'Mysuru (Mysore)', acceptedAnswers: ['mysuru', 'mysore'], regionHint: 'Southern Karnataka' },
      { native: 'ಮಂಗಳೂರು', english: 'Mangaluru (Mangalore)', acceptedAnswers: ['mangaluru', 'mangalore'], regionHint: 'Coastal Karnataka' },
      { native: 'ಹುಬ್ಬಳ್ಳಿ', english: 'Hubballi (Hubli)', acceptedAnswers: ['hubballi', 'hubli'], regionHint: 'Dharwad District' },
      { native: 'ಬೆಳಗಾವಿ', english: 'Belagavi (Belgaum)', acceptedAnswers: ['belagavi', 'belgaum'], regionHint: 'Northwest Karnataka' },
      { native: 'ಕಲಬುರಗಿ', english: 'Kalaburagi (Gulbarga)', acceptedAnswers: ['kalaburagi', 'gulbarga'], regionHint: 'Northeast Karnataka' },
      { native: 'ಶಿವಮೊಗ್ಗ', english: 'Shivamogga (Shimoga)', acceptedAnswers: ['shivamogga', 'shimoga'], regionHint: 'Malnad Region' },
      { native: 'ಉಡುಪಿ', english: 'Udupi', acceptedAnswers: ['udupi'], regionHint: 'Coastal Karnataka' }
    ],
    sampleCountries: [
      { country: 'India (Karnataka)', nativeName: 'ಕರ್ನಾಟಕ', transliteration: 'Karnāṭaka', flag: '🇮🇳' }
    ]
  },
  {
    id: 'malayalam',
    name: 'Malayalam (മലയാളം)',
    type: 'Abugida',
    direction: 'ltr',
    origin: 'Grantha / Vatteluttu Script, Kerala (India)',
    speakers: '38 Million',
    description:
      'Used in Kerala and Lakshadweep (South-West India). Immediately recognizable by its dense horizontal chains of double and triple circular loops ("pretzel/worm loops") with no top bar.',
    introSections: [
      {
        title: 'How Malayalam Syllables & Chillu Consonants Work',
        paragraphs: [
          'Malayalam letters carry an inherent "a" vowel (ക = ka). Long "aa" adds ാ (കാ = kā), "i" adds a top-right hook ി (കി = ki), and "e/o" place curved spirals (െ / ൊ) BEFORE the consonant.',
          'Word-final pure consonants (like N, R, L) use special curled "Chillu" forms (ൻ = final n, ൽ = final l, ർ = final r, ൾ = final retroflex l).'
        ]
      }
    ],
    characters: [
      { char: 'അ / ആ', rom: 'a / aa', name: 'A / Aa', phonetic: '/a/ or /aː/', category: 'vowel', note: 'Triple-loop initial vowel A / AA' },
      { char: 'ഇ / ഈ', rom: 'i / ii', name: 'I / Ii', phonetic: '/i/ or /iː/', category: 'vowel', note: 'Initial vowel I / II' },
      { char: 'ഉ / ഊ', rom: 'u / uu', name: 'U / Uu', phonetic: '/u/ or /uː/', category: 'vowel', note: '2-like curl = initial vowel U / UU' },
      { char: 'എ / ഏ', rom: 'e / ee', name: 'E / Ee', phonetic: '/e/ or /eː/', category: 'vowel', note: 'Initial vowel E / EE' },
      { char: 'ഒ / ഓ', rom: 'o / oo', name: 'O / Oo', phonetic: '/o/ or /oː/', category: 'vowel', note: 'B-like loop = initial vowel O / OO' },
      { char: 'ക', rom: 'ka', name: 'Ka', phonetic: '/ka/', category: 'familiar', note: 'Center loop with sweeping base = KA' },
      { char: 'ഗ', rom: 'ga', name: 'Ga', phonetic: '/ɡa/', category: 'familiar', note: 'Wavy U-S curve = GA' },
      { char: 'ച', rom: 'cha', name: 'Cha', phonetic: '/tʃa/', category: 'familiar', note: 'Left loop + flat bottom = CHA' },
      { char: 'ജ', rom: 'ja', name: 'Ja', phonetic: '/dʒa/', category: 'familiar', note: 'Double-decker loop = JA' },
      { char: 'ട', rom: 'ta (retroflex)', name: 'Ta', phonetic: '/ʈa/', category: 'familiar', note: 'Simple S-curve = retroflex TA (often doubled ട്ട = tta)' },
      { char: 'പ', rom: 'pa', name: 'Pa', phonetic: '/pa/', category: 'familiar', note: 'Left circle + flat base + right stem = PA' },
      { char: 'ന / ത', rom: 'na / ta', name: 'Na / Ta', phonetic: '/na/ vs /t̪a/', category: 'trap', note: 'TRAP: Single arch ന = NA; double arch (m-shape) ത = dental TA!' },
      { char: 'മ / വ', rom: 'ma / va', name: 'Ma / Va', phonetic: '/ma/ vs /ʋa/', category: 'trap', note: 'TRAP: Closed triangular loop മ = MA; open right stem വ = VA!' },
      { char: 'ര / റ', rom: 'ra / rra', name: 'Ra / Rra', phonetic: '/ɾa/ vs /ra/', category: 'trap', note: 'TRAP: Inner loop ര = soft RA; simple C-arch റ = hard RRA (റ്റ = TTA)!' },
      { char: 'ല / ള', rom: 'la / lla', name: 'La / Lla', phonetic: '/la/ vs /ɭa/', category: 'trap', note: 'TRAP: Square-backed e-loop ല = LA; stacked 3-loop ള = retroflex LLA' },
      { char: 'ദ', rom: 'da', name: 'Da', phonetic: '/d̪a/', category: 'unique', note: 'Curved 3-arch = dental DA' },
      { char: 'യ', rom: 'ya', name: 'Ya', phonetic: '/ja/', category: 'unique', note: 'Double bottom bowl = YA' },
      { char: 'ശ / സ', rom: 'sha / sa', name: 'Sha / Sa', phonetic: '/ʃa/ and /sa/', category: 'unique', note: 'Curled loops for SHA and SA' },
      { char: 'ഹ', rom: 'ha', name: 'Ha', phonetic: '/ha/', category: 'unique', note: 'Left circle + sweeping right arch = HA' },
      { char: 'ഴ', rom: 'zha', name: 'Zha', phonetic: '/ɻa/', category: 'unique', note: 'Famous Dravidian retroflex approximant ZHA (as in Tamizh / Kozhikode)' }
    ],
    cityPractice: [
      { native: 'തിരുവനന്തപുരം', english: 'Thiruvananthapuram (Trivandrum)', acceptedAnswers: ['thiruvananthapuram', 'trivandrum'], regionHint: 'Kerala Capital' },
      { native: 'കൊച്ചി', english: 'Kochi (Cochin)', acceptedAnswers: ['kochi', 'cochin'], regionHint: 'Ernakulam District' },
      { native: 'കോഴിക്കോട്', english: 'Kozhikode (Calicut)', acceptedAnswers: ['kozhikode', 'calicut'], regionHint: 'Malabar Coast' },
      { native: 'തൃശ്ശൂർ', english: 'Thrissur (Trichur)', acceptedAnswers: ['thrissur', 'trichur'], regionHint: 'Central Kerala' },
      { native: 'കൊല്ലം', english: 'Kollam (Quilon)', acceptedAnswers: ['kollam', 'quilon'], regionHint: 'Southern Kerala' },
      { native: 'കണ്ണൂർ', english: 'Kannur (Cannanore)', acceptedAnswers: ['kannur', 'cannanore'], regionHint: 'Northern Kerala' },
      { native: 'ആലപ്പുഴ', english: 'Alappuzha (Alleppy)', acceptedAnswers: ['alappuzha', 'alleppey', 'alleppy'], regionHint: 'Kerala Backwaters' },
      { native: 'പാലക്കാട്', english: 'Palakkad (Palghat)', acceptedAnswers: ['palakkad', 'palghat'], regionHint: 'Palakkad Gap' }
    ],
    sampleCountries: [
      { country: 'India (Kerala)', nativeName: 'കേരളം', transliteration: 'Kēraḷaṁ', flag: '🇮🇳' }
    ]
  },
  {
    id: 'gujarati',
    name: 'Gujarati (ગુજરાતી)',
    type: 'Abugida',
    direction: 'ltr',
    origin: 'Nagari Script (Western India), 16th Century CE',
    speakers: '62 Million',
    description:
      'Used in Gujarat, Daman & Diu, and Mumbai. Visually looks like Hindi Devanagari with the top horizontal clothesline (shirorekha) completely removed!',
    introSections: [
      {
        title: 'Devanagari Without the Top Clothesline',
        paragraphs: [
          'If you already know Hindi Devanagari, you can read 75% of Gujarati immediately: গ (ग) becomes ગ (ga), ত (त) becomes ત (ta), न becomes ન (na), म becomes મ (ma), र becomes ર (ra), and स becomes સ (sa).',
          'Watch out for ক (ka) which in Gujarati looks like a crossed dollar/S-sign (ક = ka), and જ (ja) which has a curled top loop.'
        ]
      }
    ],
    characters: [
      { char: 'અ / આ', rom: 'a / aa', name: 'A / Aa', phonetic: '/ə/ or /aː/', category: 'vowel', note: '3-curve + vertical bar = A / AA' },
      { char: 'ઇ / ઈ', rom: 'i / ii', name: 'I / Ii', phonetic: '/i/', category: 'vowel', note: 'Curled S with top hook = I / II' },
      { char: 'ઉ / ઊ', rom: 'u / uu', name: 'U / Uu', phonetic: '/u/', category: 'vowel', note: '3-shape = U / UU' },
      { char: 'એ / ઓ', rom: 'e / o', name: 'E / O', phonetic: '/e/ or /o/', category: 'vowel', note: 'અ with top slant = E / O' },
      { char: 'ક', rom: 'ka', name: 'Ka', phonetic: '/kə/', category: 'familiar', note: 'S-curve with middle crossbar = KA' },
      { char: 'ગ', rom: 'ga', name: 'Ga', phonetic: '/ɡə/', category: 'familiar', note: ' backwards C + vertical stem = GA' },
      { char: 'ત', rom: 'ta', name: 'Ta (dental)', phonetic: '/t̪ə/', category: 'familiar', note: 'Left foot + vertical stem = TA' },
      { char: 'ન', rom: 'na', name: 'Na', phonetic: '/nə/', category: 'familiar', note: 'Left pin + vertical stem = NA' },
      { char: 'પ', rom: 'pa', name: 'Pa', phonetic: '/pə/', category: 'familiar', note: 'U-cup + right stem = PA' },
      { char: 'મ', rom: 'ma', name: 'Ma', phonetic: '/mə/', category: 'familiar', note: 'Top loop + crossbar + stem = MA' },
      { char: 'ર', rom: 'ra', name: 'Ra', phonetic: '/ɾə/', category: 'familiar', note: '2-curve = RA' },
      { char: 'વ', rom: 'va', name: 'Va', phonetic: '/ʋə/', category: 'familiar', note: 'Left C-loop on vertical stem = VA' },
      { char: 'સ', rom: 'sa', name: 'Sa', phonetic: '/sə/', category: 'familiar', note: 'ર + vertical stem = SA' },
      { char: 'ક / ફ', rom: 'ka / pha', name: 'Ka / Pha', phonetic: '/kə/ vs /fə/', category: 'trap', note: 'TRAP: Plain S-cross ક = KA; bottom tail loop ફ = PHA/FA!' },
      { char: 'ચ / ય', rom: 'cha / ya', name: 'Cha / Ya', phonetic: '/tʃə/ vs /jə/', category: 'trap', note: 'TRAP: Curled 2-front ચ = CHA; smooth U-front ય = YA!' },
      { char: 'બ / ભ', rom: 'ba / bha', name: 'Ba / Bha', phonetic: '/bə/ vs /bʱə/', category: 'trap', note: 'TRAP: Closed left loop બ = BA; open curled horn ભ = BHA!' },
      { char: 'ડ / દ', rom: 'da (retroflex vs dental)', name: 'Da', phonetic: '/ɖə/ vs /d̪ə/', category: 'trap', note: 'TRAP: S-curve ડ = retroflex D; C-with-tail દ = dental D' },
      { char: 'જ', rom: 'ja', name: 'Ja', phonetic: '/dʒə/', category: 'unique', note: 'Left loop kicking up-right = JA' },
      { char: 'ટ', rom: 'ta (retroflex)', name: 'Ta', phonetic: '/ʈə/', category: 'unique', note: 'Reversed S = retroflex TA' },
      { char: 'લ', rom: 'la', name: 'La', phonetic: '/lə/', category: 'unique', note: 'C-cup connected to stem = LA' },
      { char: 'ળ', rom: 'lla (retroflex)', name: 'Lla', phonetic: '/ɭə/', category: 'unique', note: 'Double U-loop = retroflex LLA' },
      { char: 'હ', rom: 'ha', name: 'Ha', phonetic: '/ɦə/', category: 'unique', note: 'S-curve with inner tick = HA' }
    ],
    cityPractice: [
      { native: 'અમદાવાદ', english: 'Ahmedabad (Amdavad)', acceptedAnswers: ['ahmedabad', 'amdavad'], regionHint: 'Largest City in Gujarat' },
      { native: 'સુરત', english: 'Surat', acceptedAnswers: ['surat'], regionHint: 'South Gujarat' },
      { native: 'વડોદરા', english: 'Vadodara (Baroda)', acceptedAnswers: ['vadodara', 'baroda'], regionHint: 'Central Gujarat' },
      { native: 'રાજકોટ', english: 'Rajkot', acceptedAnswers: ['rajkot'], regionHint: 'Saurashtra' },
      { native: 'ભાવનગર', english: 'Bhavnagar', acceptedAnswers: ['bhavnagar'], regionHint: 'Saurashtra Coast' },
      { native: 'જામનગર', english: 'Jamnagar', acceptedAnswers: ['jamnagar'], regionHint: 'Gulf of Kutch' },
      { native: 'ગાંધીનગર', english: 'Gandhinagar', acceptedAnswers: ['gandhinagar'], regionHint: 'Capital of Gujarat' },
      { native: 'જૂનાગઢ', english: 'Junagadh', acceptedAnswers: ['junagadh'], regionHint: 'Girnar Hills' }
    ],
    sampleCountries: [
      { country: 'India (Gujarat)', nativeName: 'ગુજરાત', transliteration: 'Gujarāt', flag: '🇮🇳' }
    ]
  },
  {
    id: 'gurmukhi',
    name: 'Gurmukhi Punjabi (ਗੁਰਮੁਖੀ)',
    type: 'Abugida',
    direction: 'ltr',
    origin: 'Standardized by Guru Angad, 16th Century CE (Punjab)',
    speakers: '35 Million (India) / 125M total Punjabi',
    description:
      'Official script of Punjab (India). Like Hindi Devanagari, it hangs from a horizontal top line, but features stiffer, more angular geometry and 3 unique vowel-carrier pillars (ੳ, ਅ, ੲ).',
    introSections: [
      {
        title: 'The 3 Vowel Pillars & Gemination (Adhak)',
        paragraphs: [
          'All standalone vowels in Gurmukhi are built on three base carriers: Ura (ੳ for u/o), Aira (ਅ for a/ai/au), and Iri (ੲ for i/e).',
          'A small crescent moon above a syllable (ੱ, adhak) doubles the following consonant (e.g. ਜਲੰਧਰ = Jalandhar).'
        ]
      }
    ],
    characters: [
      { char: 'ਅ / ਆ', rom: 'a / aa', name: 'Aira (A / Kanna)', phonetic: '/ə/ or /aː/', category: 'vowel', note: 'Base vowel carrier A / AA' },
      { char: 'ਇ / ਈ', rom: 'i / ii', name: 'Iri (Sihari / Bihari)', phonetic: '/ɪ/ or /iː/', category: 'vowel', note: 'Vowel carrier I / II' },
      { char: 'ਉ / ਊ', rom: 'u / uu', name: 'Ura (Aunkar / Dulainkar)', phonetic: '/ʊ/ or /uː/', category: 'vowel', note: '3-like loop with top hook = U / UU' },
      { char: 'ਏ / ਓ', rom: 'e / o', name: 'Lavan / Hora', phonetic: '/eː/ or /oː/', category: 'vowel', note: 'Top slant = E; open top Ura = O' },
      { char: 'ਕ', rom: 'ka', name: 'Kakka', phonetic: '/kə/', category: 'familiar', note: 'Curved loop under top bar = KA' },
      { char: 'ਗ', rom: 'ga', name: 'Gagga', phonetic: '/ɡə/', category: 'familiar', note: 'Identical to Hindi ग = GA' },
      { char: 'ਚ', rom: 'cha', name: 'Chacha', phonetic: '/tʃə/', category: 'familiar', note: 'Hooked belly under bar = CHA' },
      { char: 'ਜ', rom: 'ja', name: 'Jajja', phonetic: '/dʒə/', category: 'familiar', note: 'Angular Z-drop under bar = JA' },
      { char: 'ਟ', rom: 'ta (retroflex)', name: 'Tainka', phonetic: '/ʈə/', category: 'familiar', note: 'C-hook under bar = retroflex TA' },
      { char: 'ਤ', rom: 'ta (dental)', name: 'Tatta', phonetic: '/t̪ə/', category: 'familiar', note: 'Looks like number 3 under top bar = dental TA' },
      { char: 'ਨ', rom: 'na', name: 'Nanna', phonetic: '/nə/', category: 'familiar', note: 'Open bottom arch = NA' },
      { char: 'ਸ / ਮ', rom: 'sa / ma', name: 'Sassa / Mamma', phonetic: '/sə/ vs /mə/', category: 'trap', note: 'TRAP: Full top bar ਸ = SA (looks like Hindi म!); open top ਮ = MA!' },
      { char: 'ਪ / ਧ', rom: 'pa / dha', name: 'Pappa / Dhadda', phonetic: '/pə/ vs /d̪ə/', category: 'trap', note: 'TRAP: Open top U-cup ਪ = PA; closed top roof ਧ = DHA!' },
      { char: 'ਬ / ਘ', rom: 'ba / gha', name: 'Babba / Ghagga', phonetic: '/bə/ vs /kə/', category: 'trap', note: 'TRAP: Left pinch ਬ = BA; open double-dip ਘ = GHA' },
      { char: 'ਦ / ਢ', rom: 'da / dha', name: 'Dadda / Dhadha', phonetic: '/d̪ə/ vs /ʈə/', category: 'trap', note: 'TRAP: Angular step ਦ = dental DA; curled bottom loop ਢ = retroflex DHA' },
      { char: 'ਹ', rom: 'ha', name: 'Haha', phonetic: '/ɦə/', category: 'unique', note: 'J-hook hanging from top bar = HA' },
      { char: 'ਖ', rom: 'kha', name: 'Khakha', phonetic: '/kʰə/', category: 'unique', note: 'Crossed U-box = KHA' },
      { char: 'ਡ', rom: 'da (retroflex)', name: 'Dadda', phonetic: '/ɖə/', category: 'unique', note: '3-loop with bottom curl = retroflex DA' },
      { char: 'ਰ', rom: 'ra', name: 'Rara', phonetic: '/ɾə/', category: 'unique', note: 'Round belly hanging from bar = RA' },
      { char: 'ਲ', rom: 'la', name: 'Lalla', phonetic: '/lə/', category: 'unique', note: 'Double-pointed roof arch = LA' },
      { char: 'ਵ', rom: 'va / wa', name: 'Vava', phonetic: '/ʋə/', category: 'unique', note: 'C-hook with middle pinch = VA/WA' }
    ],
    cityPractice: [
      { native: 'ਅੰਮ੍ਰਿਤਸਰ', english: 'Amritsar', acceptedAnswers: ['amritsar'], regionHint: 'Majha Region, Punjab' },
      { native: 'ਲੁਧਿਆਣਾ', english: 'Ludhiana', acceptedAnswers: ['ludhiana'], regionHint: 'Central Punjab' },
      { native: 'ਜਲੰਧਰ', english: 'Jalandhar', acceptedAnswers: ['jalandhar'], regionHint: 'Doaba Region, Punjab' },
      { native: 'ਪਟਿਆਲਾ', english: 'Patiala', acceptedAnswers: ['patiala'], regionHint: 'Malwa Region, Punjab' },
      { native: 'ਬਠਿੰਡਾ', english: 'Bathinda', acceptedAnswers: ['bathinda'], regionHint: 'Southern Punjab' },
      { native: 'ਚੰਡੀਗੜ੍ਹ', english: 'Chandigarh', acceptedAnswers: ['chandigarh'], regionHint: 'Capital of Punjab & Haryana' },
      { native: 'ਮੋਹਾਲੀ', english: 'Mohali (SAS Nagar)', acceptedAnswers: ['mohali', 'sas nagar'], regionHint: 'Greater Chandigarh' },
      { native: 'ਹੁਸ਼ਿਆਰਪੁਰ', english: 'Hoshiarpur', acceptedAnswers: ['hoshiarpur'], regionHint: 'Northeast Punjab' }
    ],
    sampleCountries: [
      { country: 'India (Punjab)', nativeName: 'ਪੰਜਾਬ', transliteration: 'Pañjāb', flag: '🇮🇳' }
    ]
  },
  {
    id: 'odia',
    name: 'Odia / Oriya (ଓଡ଼ିଆ)',
    type: 'Abugida',
    direction: 'ltr',
    origin: 'Kalinga / Brahmi Script, Odisha (Eastern India)',
    speakers: '40 Million',
    description:
      'Used in Odisha (Bhubaneswar, Puri, Cuttack) on India\'s east coast. Every single letter is crowned by a wide semicircular umbrella canopy (developed so iron styluses wouldn\'t split palm leaves!).',
    introSections: [
      {
        title: 'The Umbrella Canopy Script',
        paragraphs: [
          'Odia is the easiest Indian script to spot at a glance: almost every character is enclosed underneath a large semicircular arch/umbrella on top.',
          'Inside the umbrella sits the distinctive core shape (often related to Bengali or Devanagari).'
        ]
      }
    ],
    characters: [
      { char: 'ଅ / ଆ', rom: 'a / aa', name: 'A / Aa', phonetic: '/ɔ/ or /aː/', category: 'vowel', note: 'Initial vowel A / AA' },
      { char: 'ଇ / ଈ', rom: 'i / ii', name: 'I / Ii', phonetic: '/i/', category: 'vowel', note: 'Initial vowel I / II' },
      { char: 'ଉ / ଊ', rom: 'u / uu', name: 'U / Uu', phonetic: '/u/', category: 'vowel', note: 'Initial vowel U' },
      { char: 'ଏ / ଓ', rom: 'e / o', name: 'E / O', phonetic: '/e/ or /o/', category: 'vowel', note: 'Initial vowel E / O' },
      { char: 'କ', rom: 'ka', name: 'Ka', phonetic: '/kɔ/', category: 'familiar', note: 'Umbrella over crossed loop = KA' },
      { char: 'ଗ', rom: 'ga', name: 'Ga', phonetic: '/ɡɔ/', category: 'familiar', note: 'Umbrella over C-loop = GA' },
      { char: 'ଚ', rom: 'cha', name: 'Cha', phonetic: '/tʃɔ/', category: 'familiar', note: 'Umbrella over round b-belly = CHA' },
      { char: 'ଜ', rom: 'ja', name: 'Ja', phonetic: '/dʒɔ/', category: 'familiar', note: 'Umbrella with double inner hooks = JA' },
      { char: 'ଟ', rom: 'ta (retroflex)', name: 'Ta', phonetic: '/ʈɔ/', category: 'familiar', note: 'Circle with top-right flag = retroflex TA' },
      { char: 'ତ', rom: 'ta (dental)', name: 'Ta', phonetic: '/t̪ɔ/', category: 'familiar', note: 'Umbrella over inner spiral = dental TA' },
      { char: 'ନ', rom: 'na', name: 'Na', phonetic: '/nɔ/', category: 'familiar', note: 'Umbrella over single downward leg = NA' },
      { char: 'ବ / ର', rom: 'ba / ra', name: 'Ba / Ra', phonetic: '/bɔ/ vs /ɾɔ/', category: 'trap', note: 'TRAP: Simple empty belly ବ = BA/VA; with bottom tail ର = RA!' },
      { char: 'ପ / ଫ', rom: 'pa / pha', name: 'Pa / Pha', phonetic: '/pɔ/ vs /pʰɔ/', category: 'trap', note: 'TRAP: Wavy top + stem ପ = PA; extra right hook ଫ = PHA!' },
      { char: 'ମ / ସ', rom: 'ma / sa', name: 'Ma / Sa', phonetic: '/mɔ/ vs /sɔ/', category: 'trap', note: 'TRAP: Left bottom loop ମ = MA; diagonal inner bar ସ = SA!' },
      { char: 'ଦ / ଢ', rom: 'da / dha', name: 'Da / Dha', phonetic: '/d̪ɔ/ vs /ɖʱɔ/', category: 'trap', note: 'TRAP: Right foot ଦ = dental DA; inner dot ଢ = retroflex DHA' },
      { char: 'ଡ', rom: 'da (retroflex)', name: 'Da', phonetic: '/ɖɔ/', category: 'unique', note: 'Umbrella over U-hook = retroflex DA' },
      { char: 'ଯ', rom: 'ya / ja', name: 'Ya', phonetic: '/dʒɔ/ or /jɔ/', category: 'unique', note: 'Angular top + stem = YA/JA' },
      { char: 'ଲ', rom: 'la', name: 'La', phonetic: '/lɔ/', category: 'unique', note: 'Umbrella over double arch = LA' },
      { char: 'ଳ', rom: 'lla (retroflex)', name: 'Lla', phonetic: '/ɭɔ/', category: 'unique', note: 'Umbrella over 3 arches = retroflex LLA' },
      { char: 'ହ', rom: 'ha', name: 'Ha', phonetic: '/hɔ/', category: 'unique', note: 'Umbrella with bottom crescent = HA' }
    ],
    cityPractice: [
      { native: 'ଭୁବନେଶ୍ୱର', english: 'Bhubaneswar', acceptedAnswers: ['bhubaneswar'], regionHint: 'Capital of Odisha' },
      { native: 'କଟକ', english: 'Cuttack (Kataka)', acceptedAnswers: ['cuttack', 'kataka'], regionHint: 'Mahanadi Delta' },
      { native: 'ପୁରୀ', english: 'Puri', acceptedAnswers: ['puri'], regionHint: 'Bay of Bengal Coast' },
      { native: 'ରାଉରକେଲା', english: 'Rourkela', acceptedAnswers: ['rourkela'], regionHint: 'Sundargarh District' },
      { native: 'ବ୍ରହ୍ମପୁର', english: 'Brahmapur (Berhampur)', acceptedAnswers: ['brahmapur', 'berhampur'], regionHint: 'Ganjam District' },
      { native: 'ସମ୍ବଲପୁର', english: 'Sambalpur', acceptedAnswers: ['sambalpur'], regionHint: 'Western Odisha' },
      { native: 'ବାଲେଶ୍ୱର', english: 'Balasore (Baleswar)', acceptedAnswers: ['balasore', 'baleswar'], regionHint: 'Northern Odisha' },
      { native: 'ବାରିପଦା', english: 'Baripada', acceptedAnswers: ['baripada'], regionHint: 'Mayurbhanj District' }
    ],
    sampleCountries: [
      { country: 'India (Odisha)', nativeName: 'ଓଡ଼ିଶା', transliteration: 'Oḍiśā', flag: '🇮🇳' }
    ]
  },
  {
    id: 'lao',
    name: 'Lao (ອັກສອນລາວ)',
    type: 'Abugida',
    direction: 'ltr',
    origin: 'Tai Noi / Khmer Script, 14th Century CE (Laos)',
    speakers: '7 Million',
    description:
      'Used throughout Laos. Close sister script to Thai, but reformed to be purely phonetic with far fewer letters and much rounder, curlier, S-shaped and heart-shaped strokes.',
    introSections: [
      {
        title: 'How to Tell Lao Apart from Thai & Read Lao Signs',
        paragraphs: [
          'Lao looks like a rounder, looser, more cursive version of Thai. Look for the unmistakable S-curve of ລ (L) and ຮ (H), the bottom loops of ນ (N) and ມ (M), and the top tail of ບ (B) and ປ (P).',
          'Just like Thai, vowels can sit before (ເ e, ແ ae, ໂ o, ໃ/ໄ ai), above (ິ i, ີ ii, ຶ ue), below (ຸ u, ູ uu), or after (າ aa, ະ a) the consonant.'
        ]
      }
    ],
    characters: [
      { char: 'ະ / າ', rom: 'a / aa', name: 'Sara A / Aa', phonetic: '/a/ or /aː/', category: 'vowel', note: 'Placed after consonant = short A / long AA' },
      { char: 'ິ / ີ', rom: 'i / ii', name: 'Sara I / Ii', phonetic: '/i/ or /iː/', category: 'vowel', note: 'Placed above consonant = I / II' },
      { char: 'ຸ / ູ', rom: 'u / uu', name: 'Sara U / Uu', phonetic: '/u/ or /uː/', category: 'vowel', note: 'Placed below consonant = U / UU' },
      { char: 'ເ / ແ', rom: 'e / ae', name: 'Sara E / Ae', phonetic: '/eː/ or /ɛː/', category: 'vowel', note: 'Placed BEFORE consonant = E / AE' },
      { char: 'ໂ / ໄ', rom: 'o / ai', name: 'Sara O / Ai', phonetic: '/oː/ or /aj/', category: 'vowel', note: 'Tall prefix before consonant = O / AI' },
      { char: 'ກ', rom: 'k', name: 'Ko Kai', phonetic: '/k/', category: 'familiar', note: 'Beaked arch (like Thai ก) = K' },
      { char: 'ງ', rom: 'ng', name: 'Ngo Ngu', phonetic: '/ŋ/', category: 'familiar', note: 'Leaning loop = NG' },
      { char: 'ຈ', rom: 'ch / j', name: 'Cho Chok', phonetic: '/tɕ/', category: 'familiar', note: 'Round C with top loop = CH/J' },
      { char: 'ດ', rom: 'd', name: 'Do Dek', phonetic: '/d/', category: 'familiar', note: 'Inner curl at bottom = D' },
      { char: 'ຕ', rom: 't', name: 'To Ta', phonetic: '/t/', category: 'familiar', note: 'Wavy roof over D-body = T' },
      { char: 'ບ / ປ', rom: 'b / p', name: 'Bo Be / Po Pa', phonetic: '/b/ vs /p/', category: 'trap', note: 'TRAP: Short right stem ບ = B; tall rising right stem ປ = P!' },
      { char: 'ນ / ມ', rom: 'n / m', name: 'No Nok / Mo Ma', phonetic: '/n/ vs /m/', category: 'trap', note: 'TRAP: Right bottom loop ນ = N; left+right loops ມ = M!' },
      { char: 'ຂ / ຄ', rom: 'kh (high vs low)', name: 'Kho Khai / Kho Khwai', phonetic: '/kʰ/', category: 'trap', note: 'TRAP: Coiled S-loop ຂ and arched ຄ both sound like KH!' },
      { char: 'ສ / ຊ', rom: 's (high vs low)', name: 'So Suea / So Sang', phonetic: '/s/', category: 'trap', note: 'TRAP: Curled ສ and tailed ຊ both sound like S!' },
      { char: 'ພ / ຟ', rom: 'ph / f', name: 'Pho Phu / Fo Fai', phonetic: '/pʰ/ vs /f/', category: 'trap', note: 'TRAP: Short W-stem ພ = PH; tall right stem ຟ = F!' },
      { char: 'ຍ', rom: 'ny / y', name: 'Nyo Nyung', phonetic: '/ɲ/ or /j/', category: 'unique', note: 'Bumpy left wall = NY / Y' },
      { char: 'ລ', rom: 'l', name: 'Lo Ling', phonetic: '/l/', category: 'unique', note: 'Signature Lao S-spiral = L' },
      { char: 'ວ', rom: 'v / w', name: 'Vo Vi', phonetic: '/ʋ/ or /w/', category: 'unique', note: 'Oval loop open at bottom-left = V/W' },
      { char: 'ຫ', rom: 'h (high)', name: 'Ho Han', phonetic: '/h/', category: 'unique', note: 'Two connected loops = H' },
      { char: 'ອ', rom: 'o (carrier)', name: 'O O', phonetic: '/ʔ/ or /ɔː/', category: 'unique', note: 'Coiled snail shell = O / vowel carrier' },
      { char: 'ຮ', rom: 'h (low)', name: 'Ho Heuan', phonetic: '/h/', category: 'unique', note: 'S-spiral with top roof = H' }
    ],
    cityPractice: [
      { native: 'ວຽງຈັນ', english: 'Vientiane (Viangchan)', acceptedAnswers: ['vientiane', 'viangchan'], regionHint: 'Capital of Laos' },
      { native: 'ຫຼວງພະບາງ', english: 'Luang Prabang', acceptedAnswers: ['luang prabang', 'luang phabang'], regionHint: 'Northern Laos' },
      { native: 'ປາກເຊ', english: 'Pakse', acceptedAnswers: ['pakse'], regionHint: 'Champasak Province' },
      { native: 'ສະຫວັນນະເຂດ', english: 'Savannakhet', acceptedAnswers: ['savannakhet'], regionHint: 'Central Mekong' },
      { native: 'ທ່າແຂກ', english: 'Thakhek', acceptedAnswers: ['thakhek'], regionHint: 'Khammouane Capital' },
      { native: 'ວັງວຽງ', english: 'Vang Vieng', acceptedAnswers: ['vang vieng', 'vangvieng'], regionHint: 'Vientiane Province' },
      { native: 'ຊຳເໜືອ', english: 'Sam Neua (Xam Neua)', acceptedAnswers: ['sam neua', 'xam neua'], regionHint: 'Houaphanh Capital' },
      { native: 'ອັດຕະປື', english: 'Attapeu', acceptedAnswers: ['attapeu'], regionHint: 'Southern Laos' }
    ],
    sampleCountries: [
      { country: 'Laos', nativeName: 'ປະເທດລາວ', transliteration: 'Pathet Lao', flag: '🇱🇦' }
    ]
  },
  {
    id: 'burmese',
    name: 'Burmese / Myanmar (မြန်မာအက္ခရာ)',
    type: 'Abugida',
    direction: 'ltr',
    origin: 'Mon-Burmese / Brahmi Script, 11th Century CE',
    speakers: '43 Million',
    description:
      'Used throughout Myanmar. Instantly recognizable because almost every letter is built from perfect geometric circles and intersecting C-bubbles.',
    introSections: [
      {
        title: 'Reading the Circular Bubbles of Burmese',
        paragraphs: [
          'Burmese letters are constructed from circular strokes: a single circle ဝ is "wa", two side-by-side arches က is "ka", an upside-down U ဂ is "ga", a left-facing C င is "nga", and an upward U ပ is "pa".',
          'Consonants can be wrapped in medial consonant frames: a bottom-right sweep (ြ) adds "-ya/-ra" (pronounced Y or CH), and a bottom circle (ွ) adds "-wa".'
        ]
      }
    ],
    characters: [
      { char: 'အ / အာ', rom: 'a / aa', name: 'A', phonetic: '/ʔa/', category: 'vowel', note: 'Vowel carrier A; adding ာ or ါ lengthens to AA' },
      { char: 'အိ / အီ', rom: 'i / ii', name: 'I / Ii', phonetic: '/i/', category: 'vowel', note: 'Top circle (ိ / ီ) = vowel I' },
      { char: 'အု / အူ', rom: 'u / uu', name: 'U / Uu', phonetic: '/u/', category: 'vowel', note: 'Bottom peg (ု / ူ) = vowel U' },
      { char: 'အေ / အဲ', rom: 'e / ae', name: 'E / Ae', phonetic: '/e/ or /ɛ/', category: 'vowel', note: 'Left circle (ေ) before consonant = vowel E' },
      { char: 'က', rom: 'ka', name: 'Ka Gyi', phonetic: '/ka/', category: 'familiar', note: 'Two connected arches = KA' },
      { char: 'ဂ', rom: 'ga', name: 'Ga Nge', phonetic: '/ɡa/', category: 'familiar', note: 'Single inverted U-arch = GA' },
      { char: 'င', rom: 'nga', name: 'Nga', phonetic: '/ŋa/', category: 'familiar', note: 'Simple C-curve open to the right = NGA' },
      { char: 'ဆ', rom: 'hsa / sa', name: 'Hsa Lim', phonetic: '/sʰa/', category: 'familiar', note: 'Double bubble with right tail = HSA' },
      { char: 'ဒ', rom: 'da', name: 'Da Dwai', phonetic: '/da/', category: 'familiar', note: 'Number 3 shape = DA' },
      { char: 'န', rom: 'na', name: 'Na Nge', phonetic: '/na/', category: 'familiar', note: 'Curled S with bottom tail = NA' },
      { char: 'ဝ', rom: 'wa', name: 'Wa', phonetic: '/wa/', category: 'familiar', note: 'Perfect single circle = WA' },
      { char: 'ပ / မ', rom: 'pa / ma', name: 'Pa / Ma', phonetic: '/pa/ vs /ma/', category: 'trap', note: 'TRAP: Open U-cup ပ = PA; U-cup with middle crossbar မ = MA!' },
      { char: 'စ / ခ', rom: 'sa / kha', name: 'Sa / Kha', phonetic: '/sa/ vs /kʰa/', category: 'trap', note: 'TRAP: Inner curl facing right စ = SA; curl facing left ခ = KHA!' },
      { char: 'တ / ထ', rom: 'ta / hta', name: 'Ta / Hta', phonetic: '/ta/ vs /tʰa/', category: 'trap', note: 'TRAP: Left circle + right arch တ = TA; two touching circles ထ = HTA!' },
      { char: 'ယ / ဃ', rom: 'ya / gha', name: 'Ya / Gha', phonetic: '/ja/ vs /ɡa/', category: 'trap', note: 'TRAP: Double U-cup open on top ယ = YA' },
      { char: 'ဖ', rom: 'pha', name: 'Pha Wa Htot', phonetic: '/pʰa/', category: 'unique', note: 'ပ with right side bubble = PHA' },
      { char: 'ဗ', rom: 'ba', name: 'Ba Tet Chait', phonetic: '/ba/', category: 'unique', note: 'ပ with top notch = BA' },
      { char: 'ရ', rom: 'ya / ra', name: 'Ya Kauk', phonetic: '/ja/ or /ɹa/', category: 'unique', note: 'Loop with long descending stem = YA/RA' },
      { char: 'လ', rom: 'la', name: 'La', phonetic: '/la/', category: 'unique', note: 'Left circle + right U-cup = LA' },
      { char: 'သ', rom: 'tha', name: 'Tha', phonetic: '/θa/', category: 'unique', note: 'Left arch + right loop = THA' },
      { char: 'ဟ', rom: 'ha', name: 'Ha', phonetic: '/ha/', category: 'unique', note: 'U-cup with right side arch = HA' }
    ],
    cityPractice: [
      { native: 'ရန်ကုန်', english: 'Yangon (Rangoon)', acceptedAnswers: ['yangon', 'rangoon'], regionHint: 'Largest City in Myanmar' },
      { native: 'မန္တလေး', english: 'Mandalay', acceptedAnswers: ['mandalay'], regionHint: 'Upper Myanmar' },
      { native: 'နေပြည်တော်', english: 'Naypyidaw', acceptedAnswers: ['naypyidaw', 'nay pyi taw'], regionHint: 'Capital of Myanmar' },
      { native: 'မော်လမြိုင်', english: 'Mawlamyine', acceptedAnswers: ['mawlamyine', 'moulmein'], regionHint: 'Mon State Capital' },
      { native: 'ပဲခူး', english: 'Bago (Pegu)', acceptedAnswers: ['bago', 'pegu'], regionHint: 'Bago Region' },
      { native: 'ပုသိမ်', english: 'Pathein (Bassein)', acceptedAnswers: ['pathein', 'bassein'], regionHint: 'Ayeyarwady Delta' },
      { native: 'တောင်ကြီး', english: 'Taunggyi', acceptedAnswers: ['taunggyi'], regionHint: 'Shan State Capital' },
      { native: 'မြစ်ကြီးနား', english: 'Myitkyina', acceptedAnswers: ['myitkyina'], regionHint: 'Kachin State Capital' }
    ],
    sampleCountries: [
      { country: 'Myanmar', nativeName: 'မြန်မာ', transliteration: 'Myanma', flag: '🇲🇲' }
    ]
  },
  {
    id: 'tibetan',
    name: 'Tibetan / Dzongkha (བོད་ཡིག)',
    type: 'Abugida',
    direction: 'ltr',
    origin: 'Created by Thonmi Sambhota, 7th Century CE (Tibet & Bhutan)',
    speakers: '7 Million',
    description:
      'Official script of Bhutan (Dzongkha) and Tibet. Features a flat horizontal roof line, sharp dagger-like vertical tails, and a mandatory triangular top dot (་ tsheg) separating every single syllable.',
    introSections: [
      {
        title: 'The Tsheg Dot & Tibetan Vowel Marks',
        paragraphs: [
          'In Tibetan & Dzongkha, every syllable carries an inherent "a" vowel (ཀ = ka) and ends with a small triangular dot at the top-right corner (་ tsheg).',
          'Four simple vowel marks attach above or below the syllable: ི (gigu) = i, ུ (zhabs-kyu) below = u, ེ (drengbu) above = e, and ོ (naro) wings above = o.'
        ]
      }
    ],
    characters: [
      { char: 'ཨ / ཨ་', rom: 'a', name: 'A', phonetic: '/ʔa/', category: 'vowel', note: 'Base vowel carrier A' },
      { char: 'ཨི / ཨུ', rom: 'i / u', name: 'I (Gigu) / U (Zhabs-kyu)', phonetic: '/i/ or /u/', category: 'vowel', note: 'Top hook = I; bottom hook = U' },
      { char: 'ཨེ / ཨོ', rom: 'e / o', name: 'E (Drengbu) / O (Naro)', phonetic: '/e/ or /o/', category: 'vowel', note: 'Top slant = E; top bird wings = O' },
      { char: 'འ', rom: 'a (soft)', name: 'A-chung', phonetic: '/ɦa/', category: 'vowel', note: 'Voiced vowel carrier / long vowel marker' },
      { char: 'ཀ', rom: 'ka', name: 'Ka', phonetic: '/ka/', category: 'familiar', note: 'Three vertical legs under top bar = KA' },
      { char: 'ག', rom: 'ga / kha', name: 'Ga', phonetic: '/ɡa/ or /kʰa/', category: 'familiar', note: 'Left box + long right leg = GA' },
      { char: 'ང', rom: 'nga', name: 'Nga', phonetic: '/ŋa/', category: 'familiar', note: 'Simple C-curve under bar = NGA' },
      { char: 'ཏ', rom: 'ta', name: 'Ta', phonetic: '/ta/', category: 'familiar', note: '5-like curve under top bar = TA' },
      { char: 'ད', rom: 'da', name: 'Da', phonetic: '/da/ or /tʰa/', category: 'familiar', note: 'Single bent leg = DA' },
      { char: 'ན', rom: 'na', name: 'Na', phonetic: '/na/', category: 'familiar', note: 'Left loop + long tail = NA' },
      { char: 'མ', rom: 'ma', name: 'Ma', phonetic: '/ma/', category: 'familiar', note: 'Left loop + right vertical leg = MA' },
      { char: 'པ / ཕ / བ', rom: 'pa / pha / ba', name: 'Pa / Pha / Ba', phonetic: '/pa/, /pʰa/, /ba/', category: 'trap', note: 'TRAP: Open U-box པ = PA; inner hook ཕ = PHA; closed square བ = BA!' },
      { char: 'ཅ / ཆ / ཇ', rom: 'cha / chha / ja', name: 'Ca / Cha / Ja', phonetic: '/tʃa/ series', category: 'trap', note: 'TRAP: Single drop ཅ = CA; double loop ཆ = CHA; E-top ཇ = JA' },
      { char: 'ར / ལ', rom: 'ra / la', name: 'Ra / La', phonetic: '/ra/ vs /la/', category: 'trap', note: 'TRAP: Single stem ར = RA; double arch + stem ལ = LA' },
      { char: 'ཤ / ས', rom: 'sha / sa', name: 'Sha / Sa', phonetic: '/ʃa/ vs /sa/', category: 'trap', note: 'TRAP: Curled left loop ཤ = SHA; triangular left wedge ས = SA' },
      { char: 'ཁ', rom: 'kha', name: 'Kha', phonetic: '/kʰa/', category: 'unique', note: 'Square notch + right leg = KHA' },
      { char: 'ཉ', rom: 'nya', name: 'Nya', phonetic: '/ɲa/', category: 'unique', note: 'Twin hooks = NYA' },
      { char: 'ཐ', rom: 'tha', name: 'Tha', phonetic: '/tʰa/', category: 'unique', note: 'Spiral loop + right stem = THA' },
      { char: 'ཝ', rom: 'wa', name: 'Wa', phonetic: '/wa/', category: 'unique', note: 'Ornate chambered letter = WA' },
      { char: 'ཡ', rom: 'ya', name: 'Ya', phonetic: '/ja/', category: 'unique', note: 'W-bottom with right stem = YA' },
      { char: 'ཧ', rom: 'ha', name: 'Ha', phonetic: '/ha/', category: 'unique', note: '5-shape with curled tail = HA' }
    ],
    cityPractice: [
      { native: 'ཐིམ་ཕུག་', english: 'Thimphu', acceptedAnswers: ['thimphu', 'thimpu'], regionHint: 'Capital of Bhutan' },
      { native: 'སྤ་རོ་', english: 'Paro', acceptedAnswers: ['paro'], regionHint: 'Western Bhutan' },
      { native: 'སྤུ་ན་ཁ་', english: 'Punakha', acceptedAnswers: ['punakha'], regionHint: 'Historic Capital of Bhutan' },
      { native: 'ཕུན་ཚོགས་གླིང་', english: 'Phuentsholing', acceptedAnswers: ['phuentsholing', 'phuntsholing'], regionHint: 'Southern Bhutan Border' },
      { native: 'ལྷ་ས་', english: 'Lhasa', acceptedAnswers: ['lhasa'], regionHint: 'Capital of Tibet' },
      { native: 'གཞིས་ཀ་རྩེ་', english: 'Shigatse (Xigaze)', acceptedAnswers: ['shigatse', 'xigaze'], regionHint: 'Southern Tibet' },
      { native: 'བུམ་ཐང་', english: 'Bumthang (Jakar)', acceptedAnswers: ['bumthang', 'jakar'], regionHint: 'Central Bhutan' },
      { native: 'བཀྲ་ཤིས་སྒང་', english: 'Trashigang', acceptedAnswers: ['trashigang'], regionHint: 'Eastern Bhutan' }
    ],
    sampleCountries: [
      { country: 'Bhutan', nativeName: 'འབྲུག་ཡུལ་', transliteration: 'Druk Yul', flag: '🇧🇹' },
      { country: 'China (Tibet)', nativeName: 'བོད་', transliteration: 'Bod', flag: '🇨🇳' }
    ]
  },
  {
    id: 'perso-arabic',
    name: 'Persian / Farsi-Dari (الفبای فارسی)',
    type: 'Abjad',
    direction: 'rtl',
    origin: 'Perso-Arabic Script, 9th Century CE (Iran & Afghanistan)',
    speakers: '130 Million',
    description:
      'Used in Iran (Farsi) and Afghanistan (Dari). Extends the 28-letter Arabic script with 4 signature Persian consonants (پ P, چ CH, ژ ZH, گ G) plus dotless final ی and slashed ک.',
    introSections: [
      {
        title: 'Spotting Persian vs. Arabic in 2 Seconds',
        paragraphs: [
          'Persian adds 4 letters that NEVER appear in standard Arabic: three letters with 3 dots in a triangle (پ = P, چ = CH, ژ = ZH) and Gaf (گ = G, which is ک with an extra diagonal bar on top).',
          'Also look for final Ye (ی) which is written WITHOUT two bottom dots at the end of words, and Persian numerals (۰ ۱ ۲ ۳ ۴ ۵ ۶ ۷ ۸ ۹ — where 4 is ۴, 5 is ۵, and 6 is ۶).'
        ]
      }
    ],
    characters: [
      { char: 'ا / آ', rom: 'a / aa', name: 'Alef', phonetic: '/ɒː/ or /æ/', category: 'vowel', note: 'Vertical mast = long AA / A' },
      { char: 'و', rom: 'v / u / o', name: 'Vav', phonetic: '/v/, /uː/, /o/', category: 'vowel', note: 'Loop = V consonant or U / O vowel' },
      { char: 'ی', rom: 'y / i', name: 'Ye (Persian)', phonetic: '/j/ or /iː/', category: 'vowel', note: 'Dotless final bowl = I / Y (unlike Arabic ي)' },
      { char: 'ه', rom: 'h / e', name: 'He', phonetic: '/h/ or final /e/', category: 'vowel', note: 'At end of words, often pronounced "-e" (e.g. خانه khane)' },
      { char: 'ب', rom: 'b', name: 'Be', phonetic: '/b/', category: 'familiar', note: '1 dot below boat = B' },
      { char: 'ت', rom: 't', name: 'Te', phonetic: '/t/', category: 'familiar', note: '2 dots above boat = T' },
      { char: 'د', rom: 'd', name: 'Dal', phonetic: '/d/', category: 'familiar', note: 'Acute C-angle = D' },
      { char: 'ر', rom: 'r', name: 'Re', phonetic: '/ɾ/', category: 'familiar', note: 'Crescent slide = R' },
      { char: 'س / ش', rom: 's / sh', name: 'Sin / Shin', phonetic: '/s/ vs /ʃ/', category: 'familiar', note: '3 teeth = S; with 3 top dots = SH' },
      { char: 'م / ن', rom: 'm / n', name: 'Mim / Nun', phonetic: '/m/ and /n/', category: 'familiar', note: 'Small bead = M; cup with 1 top dot = N' },
      { char: 'ب / پ', rom: 'b / p', name: 'Be / Pe', phonetic: '/b/ vs /p/', category: 'trap', note: 'TRAP: 1 dot below ب = B; 3 dots below پ = Persian P!' },
      { char: 'ج / چ', rom: 'j / ch', name: 'Jim / Che', phonetic: '/dʒ/ vs /tʃ/', category: 'trap', note: 'TRAP: 1 dot inside ج = J; 3 dots inside چ = Persian CH!' },
      { char: 'ز / ژ', rom: 'z / zh', name: 'Ze / Zhe', phonetic: '/z/ vs /ʒ/', category: 'trap', note: 'TRAP: 1 dot above ز = Z; 3 dots above ژ = Persian ZH!' },
      { char: 'ک / گ', rom: 'k / g', name: 'Kaf / Gaf', phonetic: '/k/ vs /ɡ/', category: 'trap', note: 'TRAP: Single top stroke ک = K; double top stroke گ = Persian G!' },
      { char: 'خ', rom: 'kh', name: 'Khe', phonetic: '/x/', category: 'unique', note: '1 dot above hook = KH' },
      { char: 'ف / ق', rom: 'f / gh', name: 'Fe / Qaf', phonetic: '/f/ vs /ɢ/', category: 'unique', note: '1 dot फ = F; 2 dots ق = GH/Q' },
      { char: 'ل', rom: 'l', name: 'Lam', phonetic: '/l/', category: 'unique', note: 'Tall shepherd hook = L' },
      { char: 'ص / ط', rom: 's / t', name: 'Sad / Ta', phonetic: '/s/ and /t/', category: 'unique', note: 'Loanword letters pronounced S and T in Persian' }
    ],
    cityPractice: [
      { native: 'تهران', english: 'Tehran', acceptedAnswers: ['tehran', 'teheran'], regionHint: 'Capital of Iran' },
      { native: 'مشهد', english: 'Mashhad', acceptedAnswers: ['mashhad', 'meshed'], regionHint: 'Razavi Khorasan' },
      { native: 'اصفهان', english: 'Isfahan (Esfahan)', acceptedAnswers: ['isfahan', 'esfahan'], regionHint: 'Central Iran' },
      { native: 'شیراز', english: 'Shiraz', acceptedAnswers: ['shiraz'], regionHint: 'Fars Province' },
      { native: 'تبریز', english: 'Tabriz', acceptedAnswers: ['tabriz'], regionHint: 'East Azerbaijan, Iran' },
      { native: 'کابل', english: 'Kabul', acceptedAnswers: ['kabul'], regionHint: 'Capital of Afghanistan' },
      { native: 'هرات', english: 'Herat', acceptedAnswers: ['herat'], regionHint: 'Western Afghanistan' },
      { native: 'مزار شریف', english: 'Mazar-i-Sharif', acceptedAnswers: ['mazar-i-sharif', 'mazar i sharif', 'mazar'], regionHint: 'Northern Afghanistan' }
    ],
    sampleCountries: [
      { country: 'Iran', nativeName: 'ایران', transliteration: 'Īrān', flag: '🇮🇷' },
      { country: 'Afghanistan', nativeName: 'افغانستان', transliteration: 'Afġānestān', flag: '🇦🇫' }
    ]
  },
  {
    id: 'urdu-nastaliq',
    name: 'Urdu Nastaliq (اردو)',
    type: 'Abjad',
    direction: 'rtl',
    origin: 'Perso-Arabic Nastaliq Script, South Asia (Pakistan & India)',
    speakers: '230 Million',
    description:
      'National script of Pakistan and widely used in Northern India. Extends Persian with retroflex "toye" hats (ٹ T, ڈ D, ڑ R), sweeping horizontal Bari Ye (ے), and two-eyed Do-Chashmi He (ھ).',
    introSections: [
      {
        title: 'How to Spot Urdu instantly vs. Arabic & Persian',
        paragraphs: [
          'Look for 4 unmistakable Urdu letters that never exist in Arabic or Persian: 1) Retroflex letters crowned with a tiny "ط" hat (ٹ = retroflex T, ڈ = retroflex D, ڑ = retroflex R); 2) Bari Ye (ے), a long horizontal tail at the end of words for "e/ai"; 3) Noon Ghunna (ں), a dotless final cup for nasal vowels; and 4) Do-Chashmi He (ھ), a figure-8 heart used for aspirated consonants (بھ bh, پھ ph, تھ th, کھ kh).'
        ]
      }
    ],
    characters: [
      { char: 'ا / آ', rom: 'a / aa', name: 'Alif / Alif Madd', phonetic: '/ə/ or /ɑː/', category: 'vowel', note: 'Vertical mast = A / AA' },
      { char: 'و', rom: 'v / w / u / o', name: 'Vao', phonetic: '/ʋ/, /uː/, /oː/', category: 'vowel', note: 'V/W or vowel U / O / AU' },
      { char: 'ی', rom: 'y / ii', name: 'Choti Ye', phonetic: '/j/ or /iː/', category: 'vowel', note: 'Final rounded cup = long II vowel' },
      { char: 'ے', rom: 'e / ai', name: 'Bari Ye', phonetic: '/eː/ or /ɛː/', category: 'vowel', note: 'Long horizontal tail = final E or AI (e.g. کے ke, ہے hai)' },
      { char: 'ں', rom: 'n (nasal)', name: 'Noon Ghunna', phonetic: '/◌̃/', category: 'vowel', note: 'Dotless final ن = nasalizes preceding vowel (میں mein)' },
      { char: 'ب / پ', rom: 'b / p', name: 'Be / Pe', phonetic: '/b/ and /p/', category: 'familiar', note: '1 dot below = B; 3 dots below = P' },
      { char: 'ج / چ', rom: 'j / ch', name: 'Jeem / Che', phonetic: '/dʒ/ and /tʃ/', category: 'familiar', note: '1 dot = J; 3 dots = CH' },
      { char: 'س / ش', rom: 's / sh', name: 'Seen / Sheen', phonetic: '/s/ and /ʃ/', category: 'familiar', note: 'Plain = S; 3 top dots = SH' },
      { char: 'ک / گ', rom: 'k / g', name: 'Kaf / Gaf', phonetic: '/k/ and /ɡ/', category: 'familiar', note: 'Single bar ک = K; double bar گ = G' },
      { char: 'م / ن', rom: 'm / n', name: 'Meem / Noon', phonetic: '/m/ and /n/', category: 'familiar', note: 'M and N' },
      { char: 'ت / ٹ', rom: 't (dental vs retroflex)', name: 'Te / Tte', phonetic: '/t̪/ vs /ʈ/', category: 'trap', note: 'TRAP: 2 dots ت = dental T; small ط hat ٹ = retroflex T!' },
      { char: 'د / ڈ', rom: 'd (dental vs retroflex)', name: 'Dal / Ddal', phonetic: '/d̪/ vs /ɖ/', category: 'trap', note: 'TRAP: Plain د = dental D; small ط hat ڈ = retroflex D!' },
      { char: 'ر / ڑ', rom: 'r / rr', name: 'Re / Rre', phonetic: '/ɾ/ vs /ɽ/', category: 'trap', note: 'TRAP: Plain ر = R; small ط hat ڑ = retroflex flap RR!' },
      { char: 'ہ / ھ', rom: 'h / aspiration', name: 'Gol He / Do-Chashmi He', phonetic: '/ɦ/ vs /◌ʰ/', category: 'trap', note: 'TRAP: Hook ہ = H; two-eyed heart ھ = adds aspiration (کھ kh, گھ gh)!' },
      { char: 'خ / غ', rom: 'kh / gh', name: 'Khe / Ghain', phonetic: '/x/ and /ɣ/', category: 'unique', note: 'Guttural KH and GH' },
      { char: 'ف / ق', rom: 'f / q', name: 'Fe / Qaf', phonetic: '/f/ and /q/', category: 'unique', note: 'F and Q' },
      { char: 'ل', rom: 'l', name: 'Lam', phonetic: '/l/', category: 'unique', note: 'Tall L hook' },
      { char: 'ع', rom: 'a / silent', name: 'Ain', phonetic: '/ə/ or /ɑː/', category: 'unique', note: 'Vowel carrier in Arabic loanwords' }
    ],
    cityPractice: [
      { native: 'کراچی', english: 'Karachi', acceptedAnswers: ['karachi'], regionHint: 'Sindh Capital, Pakistan' },
      { native: 'لاہور', english: 'Lahore', acceptedAnswers: ['lahore'], regionHint: 'Punjab Capital, Pakistan' },
      { native: 'اسلام آباد', english: 'Islamabad', acceptedAnswers: ['islamabad'], regionHint: 'Capital of Pakistan' },
      { native: 'فیصل آباد', english: 'Faisalabad', acceptedAnswers: ['faisalabad'], regionHint: 'Punjab, Pakistan' },
      { native: 'راولپنڈی', english: 'Rawalpindi', acceptedAnswers: ['rawalpindi', 'pindi'], regionHint: 'Potohar Region' },
      { native: 'ملتان', english: 'Multan', acceptedAnswers: ['multan'], regionHint: 'Southern Punjab, Pakistan' },
      { native: 'پشاور', english: 'Peshawar', acceptedAnswers: ['peshawar'], regionHint: 'Khyber Pakhtunkhwa Capital' },
      { native: 'کوئٹہ', english: 'Quetta', acceptedAnswers: ['quetta'], regionHint: 'Balochistan Capital' }
    ],
    sampleCountries: [
      { country: 'Pakistan', nativeName: 'پاکستان', transliteration: 'Pākistān', flag: '🇵🇰' }
    ]
  },
  {
    id: 'chinese-hanzi',
    name: 'Chinese Hanzi (汉字 / 漢字)',
    type: 'Logographic',
    direction: 'ltr',
    origin: 'Oracle Bone Script (Yellow River Valley), 1250 BCE',
    speakers: '1.35 Billion',
    description:
      'Logographic characters used in Mainland China & Singapore (Simplified) and Taiwan, Hong Kong & Macau (Traditional). Essential geographic directional, administrative, and street-sign characters.',
    introSections: [
      {
        title: 'Mastering Geographic Hanzi & Simplified vs. Traditional',
        paragraphs: [
          'In Chinese geography, place names are built from compass directions (北 běi = North, 南 nán = South, 东/東 dōng = East, 西 xī = West, 中 zhōng = Central), landscape features (山 shān = Mountain, 河/江 hé/jiāng = River, 海 hǎi = Sea, 湖 hú = Lake, 州 zhōu = Prefecture), and administrative levels (省 shěng = Province, 市 shì = City, 县/縣 xiàn = County, 区/區 qū = District, 路 lù = Road, 街 jiē = Street).',
          'Mainland China & Singapore use Simplified characters (东, 门, 广, 区, 县), whereas Taiwan, Hong Kong & Macau retain full Traditional strokes (東, 門, 廣, 區, 縣).'
        ]
      }
    ],
    characters: [
      { char: '北', rom: 'bei (North)', name: 'Bei (North)', phonetic: '/pèi/', category: 'vowel', note: 'Compass direction NORTH (as in 北京 Beijing, 台北 Taipei)' },
      { char: '南', rom: 'nan (South)', name: 'Nan (South)', phonetic: '/nǎn/', category: 'vowel', note: 'Compass direction SOUTH (as in 南京 Nanjing, 台南 Tainan)' },
      { char: '东 / 東', rom: 'dong (East)', name: 'Dong (East)', phonetic: '/tʊ́ŋ/', category: 'vowel', note: 'Compass direction EAST (Simplified 东 / Traditional 東)' },
      { char: '西', rom: 'xi (West)', name: 'Xi (West)', phonetic: '/ɕí/', category: 'vowel', note: 'Compass direction WEST (as in 西安 Xi\'an, 广西 Guangxi)' },
      { char: '中', rom: 'zhong (Center)', name: 'Zhong (Middle/Center)', phonetic: '/tʂʊ́ŋ/', category: 'vowel', note: 'MIDDLE / CENTRAL (as in 中国 China, 台中 Taichung)' },
      { char: '山', rom: 'shan (Mountain)', name: 'Shan (Mountain)', phonetic: '/ʂán/', category: 'familiar', note: 'Three peaks = MOUNTAIN (山东 Shandong, 佛山 Foshan)' },
      { char: '川 / 州', rom: 'chuan / zhou', name: 'Chuan (River) / Zhou (Prefecture)', phonetic: '/tʂʰwán/ / /tʂóu/', category: 'familiar', note: '3 streams = Sichuan (四川); with 3 dots 州 = Guangzhou (广州)' },
      { char: '海', rom: 'hai (Sea)', name: 'Hai (Sea)', phonetic: '/xàɪ/', category: 'familiar', note: 'Water radical 氵+ 每 = SEA (上海 Shanghai, 海口 Haikou)' },
      { char: '河 / 江', rom: 'he / jiang (River)', name: 'He / Jiang (River)', phonetic: '/xɤ̌/ / /tɕjɑ́ŋ/', category: 'familiar', note: 'RIVER (河南 Henan, 黑龙江 Heilongjiang)' },
      { char: '湖', rom: 'hu (Lake)', name: 'Hu (Lake)', phonetic: '/xǔ/', category: 'familiar', note: 'LAKE (湖南 Hunan, 湖北 Hubei)' },
      { char: '港', rom: 'gang (Harbor)', name: 'Gang (Port/Harbor)', phonetic: '/kɑ̀ŋ/', category: 'familiar', note: 'HARBOR / PORT (香港 Hong Kong, 连云港 Lianyungang)' },
      { char: '广 / 廣', rom: 'guang (Wide)', name: 'Guang (Simp vs Trad)', phonetic: '/kwɑ̀ŋ/', category: 'trap', note: 'TRAP: Empty shelter 广 = Mainland Simplified; full 廣 = Taiwan/HK Traditional!' },
      { char: '门 / 門', rom: 'men (Gate)', name: 'Men (Gate)', phonetic: '/mə̌n/', category: 'trap', note: 'TRAP: Simple 门 = Simplified; ornate saloon doors 門 = Traditional (澳门/澳門 Macau)!' },
      { char: '区 / 區', rom: 'qu (District)', name: 'Qu (District)', phonetic: '/tɕʰý/', category: 'trap', note: 'TRAP: Single X in box 区 = Simplified; 3 boxes inside 區 = Traditional!' },
      { char: '县 / 縣', rom: 'xian (County)', name: 'Xian (County)', phonetic: '/ɕjɛ̂n/', category: 'trap', note: 'TRAP: 县 = Mainland County; 縣 = Taiwan County!' },
      { char: '市', rom: 'shi (City)', name: 'Shi (City/Municipality)', phonetic: '/ʂɻ̩̂/', category: 'unique', note: 'CITY suffix on road signs' },
      { char: '省', rom: 'sheng (Province)', name: 'Sheng (Province)', phonetic: '/ʂə̀ŋ/', category: 'unique', note: 'PROVINCE suffix' },
      { char: '路 / 街', rom: 'lu (Road) / jie (Street)', name: 'Lu / Jie', phonetic: '/lû/ / /tɕjé/', category: 'unique', note: 'ROAD (路) and STREET (街) on all urban street signs' },
      { char: '京', rom: 'jing (Capital)', name: 'Jing (Capital)', phonetic: '/tɕíŋ/', category: 'unique', note: 'CAPITAL (北京 Beijing = Northern Capital; 南京 Nanjing = Southern Capital)' }
    ],
    cityPractice: [
      { native: '北京', english: 'Beijing', acceptedAnswers: ['beijing', 'peking'], regionHint: 'Capital of China ("Northern Capital")' },
      { native: '上海', english: 'Shanghai', acceptedAnswers: ['shanghai'], regionHint: 'East China Coast ("Upon the Sea")' },
      { native: '广州 / 廣州', english: 'Guangzhou (Canton)', acceptedAnswers: ['guangzhou', 'canton'], regionHint: 'Guangdong Capital' },
      { native: '深圳', english: 'Shenzhen', acceptedAnswers: ['shenzhen'], regionHint: 'Pearl River Delta' },
      { native: '台北 / 臺北', english: 'Taipei', acceptedAnswers: ['taipei'], regionHint: 'Capital of Taiwan ("Taiwan North")' },
      { native: '高雄', english: 'Kaohsiung (Gaoxiong)', acceptedAnswers: ['kaohsiung', 'gaoxiong'], regionHint: 'Southern Taiwan' },
      { native: '香港', english: 'Hong Kong (Xianggang)', acceptedAnswers: ['hong kong', 'hongkong', 'xianggang'], regionHint: 'Special Administrative Region ("Fragrant Harbor")' },
      { native: '重庆 / 重慶', english: 'Chongqing', acceptedAnswers: ['chongqing'], regionHint: 'Southwest China' },
      { native: '西安', english: 'Xi\'an', acceptedAnswers: ['xian', 'xi\'an'], regionHint: 'Shaanxi Capital ("Western Peace")' },
      { native: '南京', english: 'Nanjing', acceptedAnswers: ['nanjing', 'nanking'], regionHint: 'Jiangsu Capital ("Southern Capital")' }
    ],
    sampleCountries: [
      { country: 'China', nativeName: '中国', transliteration: 'Zhōngguó', flag: '🇨🇳' },
      { country: 'Taiwan', nativeName: '臺灣', transliteration: 'Táiwān', flag: '🇹🇼' },
      { country: 'Singapore', nativeName: '新加坡', transliteration: 'Xīnjiāpō', flag: '🇸🇬' }
    ]
  },
  {
    id: 'thaana',
    name: 'Thaana / Dhivehi (ތާނަ)',
    type: 'Abugida',
    direction: 'rtl',
    origin: 'Maldives, 16th Century CE (derived from Arabic & Indic numerals)',
    speakers: '400,000',
    description:
      'Unique right-to-left script of the Maldives (Dhivehi). Consonants were ingeniously created from slanted Arabic numerals (1–9) and local Indic digits, with mandatory vowel strokes above and below every letter.',
    introSections: [
      {
        title: 'The Numeral Script of the Maldives',
        paragraphs: [
          'Thaana is the only abugida written from RIGHT to LEFT! Its first nine consonants are literally slanted Arabic-Indic numerals: ހ (h = 1), ށ (sh = 2), ނ (n = 3), ރ (r = 4), ބ (b = 5), ޅ (lh = 6), ކ (k = 7), އ (vowel carrier = 8), and ވ (v = 9).',
          'Every letter MUST carry a vowel diacritic above or below it (ަ a, ާ aa, ި i, ީ ee, ު u, ޫ oo, ެ e, ޯ oa) or a zero-circle sukun (ް) to silence the vowel.'
        ]
      }
    ],
    characters: [
      { char: 'އަ / އާ', rom: 'a / aa', name: 'Abafili / Aabaafili', phonetic: '/a/ or /aː/', category: 'vowel', note: 'Single/double slant above އ = A / AA' },
      { char: 'އި / އީ', rom: 'i / ee', name: 'Ibifili / Eebeefili', phonetic: '/i/ or /iː/', category: 'vowel', note: 'Single/double slant below އ = I / EE' },
      { char: 'އު / އޫ', rom: 'u / oo', name: 'Ubufili / Ooboofili', phonetic: '/u/ or /uː/', category: 'vowel', note: 'Curl above އ = U / OO' },
      { char: 'އެ / އޯ', rom: 'e / oa', name: 'Ebefili / Oaboafili', phonetic: '/e/ or /oː/', category: 'vowel', note: 'Teardrop / arch above އ = E / OA' },
      { char: 'ހ', rom: 'h', name: 'Haa', phonetic: '/h/', category: 'familiar', note: 'Slanted numeral 1 = H' },
      { char: 'ނ', rom: 'n', name: 'Noonu', phonetic: '/n/', category: 'familiar', note: 'Slanted numeral 3 = N' },
      { char: 'ރ', rom: 'r', name: 'Raa', phonetic: '/ɾ/', category: 'familiar', note: 'Diagonal slash = R' },
      { char: 'ބ', rom: 'b', name: 'Baa', phonetic: '/b/', category: 'familiar', note: 'Teardrop loop (Arabic 5) = B' },
      { char: 'ކ', rom: 'k', name: 'Kaafu', phonetic: '/k/', category: 'familiar', note: 'V-angle (Arabic 7) = K' },
      { char: 'ވ', rom: 'v', name: 'Vaavu', phonetic: '/ʋ/', category: 'familiar', note: '9-shape = V' },
      { char: 'މ / ތ', rom: 'm / th', name: 'Meemu / Thaalu', phonetic: '/m/ vs /t̪/', category: 'trap', note: 'TRAP: Closed loop tail މ = M; open雙-curve ތ = TH!' },
      { char: 'ދ / ގ', rom: 'dh / g', name: 'Dhaalu / Gaafu', phonetic: '/d̪/ vs /ɡ/', category: 'trap', note: 'TRAP: Left curl ދ = DH; extra inner tail ގ = G!' },
      { char: 'ލ / ޅ', rom: 'l / lh', name: 'Laamu / Lhaviyani', phonetic: '/l/ vs /ɭ/', category: 'trap', note: 'TRAP: Upright U-angle ލ = L; slanted 6-shape ޅ = retroflex LH!' },
      { char: 'ސ / ށ', rom: 's / sh', name: 'Seenu / Shaviyani', phonetic: '/s/ vs /ʂ/', category: 'trap', note: 'TRAP: Wavy س-shape ސ = S; slanted 2-shape ށ = SH' },
      { char: 'ފ', rom: 'f', name: 'Faafu', phonetic: '/f/', category: 'unique', note: 'Loop with bottom tail = F' },
      { char: 'ޏ', rom: 'ny', name: 'Gnaviyani', phonetic: '/ɲ/', category: 'unique', note: 'Curled hook = NY' },
      { char: 'ޔ', rom: 'y', name: 'Yaavu', phonetic: '/j/', category: 'unique', note: 'V with left wing = Y' },
      { char: 'ޑ / ޓ', rom: 'd / t (retroflex)', name: 'Daviyani / Taviyani', phonetic: '/ɖ/ and /ʈ/', category: 'unique', note: 'Retroflex D and T' }
    ],
    cityPractice: [
      { native: 'މާލެ', english: 'Malé', acceptedAnswers: ['male', 'malé'], regionHint: 'Capital of the Maldives' },
      { native: 'އައްޑޫ', english: 'Addu City (Seenu)', acceptedAnswers: ['addu', 'addu city', 'seenu'], regionHint: 'Southernmost Atoll' },
      { native: 'ފުވައްމުލައް', english: 'Fuvahmulah', acceptedAnswers: ['fuvahmulah'], regionHint: 'Gnaviyani Atoll' },
      { native: 'ކުޅުދުއްފުށި', english: 'Kulhudhuffushi', acceptedAnswers: ['kulhudhuffushi'], regionHint: 'Haa Dhaalu Atoll' },
      { native: 'ތިނަދޫ', english: 'Thinadhoo', acceptedAnswers: ['thinadhoo'], regionHint: 'Gaafu Dhaalu Capital' },
      { native: 'ހުޅުމާލެ', english: 'Hulhumalé', acceptedAnswers: ['hulhumale', 'hulhumalé'], regionHint: 'North Malé Atoll' }
    ],
    sampleCountries: [
      { country: 'Maldives', nativeName: 'ދިވެހިރާއްޖެ', transliteration: 'Dhivehi Raajje', flag: '🇲🇻' }
    ]
  },
  {
    id: 'tifinagh',
    name: 'Tifinagh / Amazigh (ⵜⵉⴼⵉⵏⴰⵖ)',
    type: 'Alphabet',
    direction: 'ltr',
    origin: 'Ancient Libyco-Berber Script (North Africa), 3rd Century BCE',
    speakers: '20 Million',
    description:
      'Official Neo-Tifinagh alphabet used on trilingual road signs and public buildings across Morocco and Algeria (alongside Arabic and French). Built from bold geometric circles, crosses, and triangles.',
    introSections: [
      {
        title: 'Reading Geometric Neo-Tifinagh Signs in Morocco & Algeria',
        paragraphs: [
          'Neo-Tifinagh is a modern left-to-right alphabet with 4 vowels: ⴰ (a), ⵉ (i), ⵓ (u), and ⴻ (e schwa). Feminine nouns and many city names both start and end with the cross letter ⵜ (t), such as ⵜⴰⵎⴰⵣⵉⵖⵜ (Tamazight) or ⵜⵉⵣⵏⵉⵜ (Tiznit).'
        ]
      }
    ],
    characters: [
      { char: 'ⴰ', rom: 'a', name: 'Ya', phonetic: '/æ/', category: 'vowel', note: 'Single circle = vowel A' },
      { char: 'ⵉ', rom: 'i', name: 'Yi', phonetic: '/i/', category: 'vowel', note: 'Zigzag lightning = vowel I' },
      { char: 'ⵓ', rom: 'u / w', name: 'Yu', phonetic: '/u/', category: 'vowel', note: 'U-horseshoe open on top = vowel U' },
      { char: 'ⴻ', rom: 'e', name: 'Yey (Schwa)', phonetic: '/ə/', category: 'vowel', note: 'Circle with left bar = schwa E' },
      { char: 'ⵜ', rom: 't', name: 'Yat', phonetic: '/t/', category: 'familiar', note: 'Plus cross (+) = T (extremely common at start & end of words!)' },
      { char: 'ⵎ', rom: 'm', name: 'Yam', phonetic: '/m/', category: 'familiar', note: 'Bracket open to the right (⊏) = M' },
      { char: 'ⵏ', rom: 'n', name: 'Yan', phonetic: '/n/', category: 'familiar', note: 'Single vertical line (|) = N' },
      { char: 'ⵙ', rom: 's', name: 'Yas', phonetic: '/s/', category: 'familiar', note: 'Circle with center dot (⊙) = S' },
      { char: 'ⵣ', rom: 'z', name: 'Yaz', phonetic: '/z/', category: 'familiar', note: 'Iconic Amazigh human/fork symbol = Z' },
      { char: 'ⴷ', rom: 'd', name: 'Yad', phonetic: '/d/', category: 'familiar', note: 'Upward triangle (∧) = D' },
      { char: 'ⵔ / ⴱ', rom: 'r / b', name: 'Yar / Yab', phonetic: '/r/ vs /b/', category: 'trap', note: 'TRAP: Plain circle with vertical slash ⴱ = B; plain large circle ⵔ = R (compare small ⴰ A)!' },
      { char: 'ⵍ / ⵏ', rom: 'l / n', name: 'Yal / Yan', phonetic: '/l/ vs /n/', category: 'trap', note: 'TRAP: Two parallel vertical bars ⵍ (||) = L; single bar ⵏ (|) = N!' },
      { char: 'ⴽ / ⴳ', rom: 'k / g', name: 'Yak / Yag', phonetic: '/k/ vs /ɡ/', category: 'trap', note: 'TRAP: R-like geometric flag ⴽ = K; X with top/bottom bars ⴳ = G!' },
      { char: 'ⴼ / ⵃ', rom: 'f / h', name: 'Yaf / Yah', phonetic: '/f/ vs /ħ/', category: 'trap', note: 'TRAP: H-hourglass ⴼ = F; vertical line with top loop ⵃ = pharyngeal H' },
      { char: 'ⵖ', rom: 'gh', name: 'Yagh', phonetic: '/ʁ/', category: 'unique', note: 'Y-fork with middle crossbar = GH' },
      { char: 'ⵛ', rom: 'sh', name: 'Yash', phonetic: '/ʃ/', category: 'unique', note: 'C-loop with middle prong = SH' },
      { char: 'ⵊ', rom: 'j / zh', name: 'Yaj', phonetic: '/ʒ/', category: 'unique', note: 'I-bar with side ticks = J' },
      { char: 'ⵇ', rom: 'q', name: 'Yaq', phonetic: '/q/', category: 'unique', note: 'Cross with top circle = Q' },
      { char: 'ⵡ', rom: 'w', name: 'Yaw', phonetic: '/w/', category: 'unique', note: 'Two stacked circles (:) or figure-8 = W' }
    ],
    cityPractice: [
      { native: 'ⵕⵕⴱⴰⵟ', english: 'Rabat', acceptedAnswers: ['rabat'], regionHint: 'Capital of Morocco' },
      { native: 'ⵎⵕⵕⴰⴽⵛ', english: 'Marrakesh (Marrakech)', acceptedAnswers: ['marrakesh', 'marrakech'], regionHint: 'Central Morocco' },
      { native: 'ⴰⴳⴰⴷⵉⵔ', english: 'Agadir', acceptedAnswers: ['agadir'], regionHint: 'Souss-Massa Coast' },
      { native: 'ⴼⴰⵙ', english: 'Fes (Fez)', acceptedAnswers: ['fes', 'fez'], regionHint: 'Northern Morocco' },
      { native: 'ⵟⴰⵏⵊⴰ', english: 'Tangier (Tanja)', acceptedAnswers: ['tangier', 'tanja'], regionHint: 'Strait of Gibraltar' },
      { native: 'ⵜⵉⵣⵏⵉⵜ', english: 'Tiznit', acceptedAnswers: ['tiznit'], regionHint: 'Southern Morocco' },
      { native: 'ⵡⴰⵔⵣⴰⵣⴰⵜ', english: 'Ouarzazate', acceptedAnswers: ['ouarzazate', 'warzazat'], regionHint: 'High Atlas Gateway' },
      { native: 'ⵏⵏⴰⴹⵓⵔ', english: 'Nador', acceptedAnswers: ['nador'], regionHint: 'Rif Coast' }
    ],
    sampleCountries: [
      { country: 'Morocco', nativeName: 'ⵍⵎⵖⵔⵉⴱ', transliteration: 'Lmeɣrib', flag: '🇲🇦' },
      { country: 'Algeria', nativeName: 'ⴷⵣⴰⵢⵔ', transliteration: 'Dzayer', flag: '🇩🇿' }
    ]
  },
  {
    id: 'mongolian-bichig',
    name: 'Traditional Mongolian Bichig (ᠮᠣᠩᠭᠣᠯ ᠪᠢᠴᠢᠭ)',
    type: 'Alphabet',
    direction: 'ltr',
    origin: 'Old Uyghur Alphabet, adopted 1204 CE under Genghis Khan',
    speakers: '6 Million (Inner Mongolia & Mongolia)',
    description:
      'Vertical cursive script written along a continuous central spine (sawtooth teeth, loops, and flowing tails). Appears on all shop signs and street signs in Inner Mongolia (China) and ceremonial signs in Mongolia.',
    introSections: [
      {
        title: 'Spotting the Sawtooth Spine of Traditional Mongolian',
        paragraphs: [
          'Traditional Mongolian is the only world alphabet written vertically in columns from left to right (when rendered horizontally in digital text, the spine runs left-to-right with sawtooth teeth pointing downward/upward).',
          'Letters are composed of crowns (titem), teeth (shud), bellies (gedes), and flowing end-tails (suul).'
        ]
      }
    ],
    characters: [
      { char: 'ᠠ', rom: 'a', name: 'A', phonetic: '/a/', category: 'vowel', note: 'Crown + two sawtooth teeth = vowel A' },
      { char: 'ᠡ', rom: 'e', name: 'E', phonetic: '/ə/', category: 'vowel', note: 'Crown + single tooth = vowel E' },
      { char: 'ᠢ', rom: 'i', name: 'I', phonetic: '/i/', category: 'vowel', note: 'Crown + long shin stroke = vowel I' },
      { char: 'ᠣ / ᠤ', rom: 'o / u', name: 'O / U', phonetic: '/ɔ/ or /ʊ/', category: 'vowel', note: 'Round belly loop (gedes) on spine = O / U' },
      { char: 'ᠥ / ᠦ', rom: 'ö / ü', name: 'Ö / Ü', phonetic: '/ɵ/ or /u/', category: 'vowel', note: 'Belly loop + shin stroke = front rounded Ö / Ü' },
      { char: 'ᠪ', rom: 'b', name: 'Ba', phonetic: '/p/ or /b/', category: 'familiar', note: 'Large round bow loop = B' },
      { char: 'ᠮ', rom: 'm', name: 'Ma', phonetic: '/m/', category: 'familiar', note: 'Hooked horn above spine = M' },
      { char: 'ᠯ', rom: 'l', name: 'La', phonetic: '/ɮ/', category: 'familiar', note: 'Upward horn below/right of spine = L' },
      { char: 'ᠰ', rom: 's', name: 'Sa', phonetic: '/s/', category: 'familiar', note: 'Triangular diamond wing = S' },
      { char: 'ᠷ', rom: 'r', name: 'Ra', phonetic: '/r/', category: 'familiar', note: 'Crossed blade on spine = R' },
      { char: 'ᠨ / ᠠ', rom: 'n / a', name: 'Na / A', phonetic: '/n/ vs /a/', category: 'trap', note: 'TRAP: Single tooth with side dot ᠨ = N; tooth without dot = A/E!' },
      { char: 'ᠬ / ᠭ', rom: 'kh / g', name: 'Kha / Ga', phonetic: '/x/ vs /ɡ/', category: 'trap', note: 'TRAP: Double-slit tooth ᠬ = KH; with two side dots ᠭ = G!' },
      { char: 'ᠲ / ᠳ', rom: 't / d', name: 'Ta / Da', phonetic: '/t/ and /d/', category: 'trap', note: 'TRAP: Loop + tooth ᠲ/ᠳ represents both T and D!' },
      { char: 'ᠴ / ᠵ', rom: 'ch / j', name: 'Cha / Ja', phonetic: '/tʃ/ vs /dʒ/', category: 'trap', note: 'TRAP: Forked pin ᠴ = CH; straight shin ᠵ = J!' },
      { char: 'ᠱ', rom: 'sh', name: 'Sha', phonetic: '/ʃ/', category: 'unique', note: 'ᠰ (S) with two side dots = SH' },
      { char: 'ᠶ', rom: 'y', name: 'Ya', phonetic: '/j/', category: 'unique', note: 'Curved hook stroke = Y' },
      { char: 'ᠸ', rom: 'v / w', name: 'Wa', phonetic: '/w/', category: 'unique', note: 'Hooked tooth = W/V' },
      { char: 'ᠩ', rom: 'ng', name: 'Ang', phonetic: '/ŋ/', category: 'unique', note: 'Tooth + S-tail = final NG' }
    ],
    cityPractice: [
      { native: 'ᠤᠯᠠᠭᠠᠨᠪᠠᠭᠠᠲᠤᠷ', english: 'Ulaanbaatar', acceptedAnswers: ['ulaanbaatar', 'ulan bator'], regionHint: 'Capital of Mongolia' },
      { native: 'ᠬᠦᠬᠡᠬᠣᠲᠠ', english: 'Hohhot (Kökeqota)', acceptedAnswers: ['hohhot', 'kokeqota'], regionHint: 'Capital of Inner Mongolia' },
      { native: 'ᠪᠤᠭᠤᠲᠤ', english: 'Baotou (Bugutu)', acceptedAnswers: ['baotou', 'bugutu'], regionHint: 'Inner Mongolia' },
      { native: 'ᠣᠷᠳᠣᠰ', english: 'Ordos', acceptedAnswers: ['ordos'], regionHint: 'Inner Mongolia' },
      { native: 'ᠳᠠᠷᠬᠠᠨ', english: 'Darkhan', acceptedAnswers: ['darkhan'], regionHint: 'Northern Mongolia' },
      { native: 'ᠡᠷᠳᠡᠨᠢᠲᠦ', english: 'Erdenet', acceptedAnswers: ['erdenet'], regionHint: 'Orkhon Province, Mongolia' }
    ],
    sampleCountries: [
      { country: 'Mongolia', nativeName: 'ᠮᠣᠩᠭᠣᠯ ᠤᠯᠤᠰ', transliteration: 'Monggol Ulus', flag: '🇲🇳' },
      { country: 'China (Inner Mongolia)', nativeName: 'ᠦᠪᠦᠷ ᠮᠣᠩᠭᠣᠯ', transliteration: 'Öbür Monggol', flag: '🇨🇳' }
    ]
  },
  {
    id: 'inuktitut',
    name: 'Inuktitut Syllabics (ᐃᓄᒃᑎᑐᑦ)',
    type: 'Abugida',
    direction: 'ltr',
    origin: 'Canadian Aboriginal Syllabics (James Evans, 1840s; Nunavut & Nunavik)',
    speakers: '45,000 (Inuktitut) / 150,000 (Cree & Ojibwe)',
    description:
      'Used across Nunavut, Northern Quebec (Nunavik), and Northwest Territories in Canada. Each consonant is a geometric shape (triangle, angle, hook) that ROTATES in 4 directions to change its vowel (i, u, a)!',
    introSections: [
      {
        title: 'How Rotation Changes the Vowel in Inuktitut',
        paragraphs: [
          'Canadian Aboriginal Syllabics is one of the most logical writing systems ever designed: each consonant has ONE geometric shape, and rotating that shape changes the vowel! Pointing UP = -i (ᐃ i, ᐱ pi, ᑎ ti), pointing RIGHT/DOWN = -u (ᐅ u, ᐳ pu, ᑐ tu), and pointing LEFT = -a (ᐊ a, ᐸ pa, ᑕ ta).',
          'A tiny superscript version at the end of a syllable represents a standalone final consonant (ᒃ = -k, ᑦ = -t, ᖅ = -q, ᓐ = -n, ᒻ = -m).'
        ]
      }
    ],
    characters: [
      { char: 'ᐃ / ᐄ', rom: 'i / ii', name: 'I (Triangle Up)', phonetic: '/i/ or /iː/', category: 'vowel', note: 'Triangle pointing UP = vowel I (dot on top = long II)' },
      { char: 'ᐅ / ᐆ', rom: 'u / uu', name: 'U (Triangle Right)', phonetic: '/u/ or /uː/', category: 'vowel', note: 'Triangle pointing RIGHT = vowel U' },
      { char: 'ᐊ / ᐋ', rom: 'a / aa', name: 'A (Triangle Left)', phonetic: '/a/ or /aː/', category: 'vowel', note: 'Triangle pointing LEFT = vowel A' },
      { char: 'ᐁ', rom: 'ai', name: 'Ai (Triangle Down)', phonetic: '/ai/', category: 'vowel', note: 'Triangle pointing DOWN = diphthong AI' },
      { char: 'ᐱ / ᐳ / ᐸ', rom: 'pi / pu / pa', name: 'P-series (Chevron)', phonetic: '/pi/, /pu/, /pa/', category: 'familiar', note: 'Pointed V-chevron rotated: ᐱ=pi, ᐳ=pu, ᐸ=pa (final ᑉ = -p)' },
      { char: 'ᑎ / ᑐ / ᑕ', rom: 'ti / tu / ta', name: 'T-series (U-Arch)', phonetic: '/ti/, /tu/, /ta/', category: 'familiar', note: 'Rounded U-arch rotated: ᑎ=ti, ᑐ=tu, ᑕ=ta (final ᑦ = -t)' },
      { char: 'ᑭ / ᑯ / ᑲ', rom: 'ki / ku / ka', name: 'K-series (P-hook)', phonetic: '/ki/, /ku/, /ka/', category: 'familiar', note: 'Stem with loop rotated: ᑭ=ki, ᑯ=ku, ᑲ=ka (final ᒃ = -k)' },
      { char: 'ᒥ / ᒧ / ᒪ', rom: 'mi / mu / ma', name: 'M-series (L-crook)', phonetic: '/mi/, /mu/, /ma/', category: 'familiar', note: 'Right-angle crook rotated: ᒥ=mi, ᒧ=mu, ᒪ=ma (final ᒻ = -m)' },
      { char: 'ᓂ / ᓄ / ᓇ', rom: 'ni / nu / na', name: 'N-series (Open Loop)', phonetic: '/ni/, /nu/, /na/', category: 'familiar', note: 'Curled hook rotated: ᓂ=ni, ᓄ=nu, ᓇ=na (final ᓐ = -n)' },
      { char: 'ᒋ / ᒍ / ᒐ', rom: 'gi / gu / ga', name: 'G-series vs M-series', phonetic: '/ɡi/, /ɡu/, /ɡa/', category: 'trap', note: 'TRAP: Curved hook ᒋ/ᒍ/ᒐ = G-series (compare sharp-cornered ᒥ/ᒧ/ᒪ M-series)!' },
      { char: 'ᓯ / ᓱ / ᓴ', rom: 'si / su / sa', name: 'S-series vs N-series', phonetic: '/si/, /su/, /sa/', category: 'trap', note: 'TRAP: S-wave ᓯ/ᓱ/ᓴ = S-series (final ᔅ = -s)' },
      { char: 'ᕿ / ᖁ / ᖃ', rom: 'qi / qu / qa', name: 'Q-series vs K-series', phonetic: '/qi/, /qu/, /qa/', category: 'trap', note: 'TRAP: Extra leading bar ᕿ/ᖁ/ᖃ = uvular QI/QU/QA (final ᖅ = -q)!' },
      { char: 'ᓕ / ᓘ / ᓚ', rom: 'li / lu / la', name: 'L-series', phonetic: '/li/, /lu/, /la/', category: 'trap', note: 'TRAP: Stepped corner ᓕ/ᓘ/ᓚ = L-series (final ᓪ = -l)' },
      { char: 'ᔨ / ᔪ / ᔭ', rom: 'ji / ju / ja (yi/yu/ya)', name: 'J/Y-series', phonetic: '/ji/, /ju/, /ja/', category: 'unique', note: 'Hooked flag = Y/J series' },
      { char: 'ᕕ / ᕗ / ᕙ', rom: 'vi / vu / va', name: 'V-series', phonetic: '/vi/, /vu/, /va/', category: 'unique', note: 'Chevron with inner tick = V-series' },
      { char: 'ᕆ / ᕈ / ᕋ', rom: 'ri / ru / ra', name: 'R-series', phonetic: '/ʁi/, /ʁu/, /ʁa/', category: 'unique', note: 'n-prefix + K-shape = R-series (final ᕐ = -r)' },
      { char: 'ᙱ / ᙳ / ᙵ', rom: 'nngi / nngu / nnga', name: 'Nng-series', phonetic: '/ŋːi/', category: 'unique', note: 'Double-bar prefix = velar nasal NNG' }
    ],
    cityPractice: [
      { native: 'ᐃᖃᓗᐃᑦ', english: 'Iqaluit', acceptedAnswers: ['iqaluit'], regionHint: 'Capital of Nunavut, Baffin Island' },
      { native: 'ᑲᖏᖅᖠᓂᖅ', english: 'Rankin Inlet (Kangiqliniq)', acceptedAnswers: ['rankin inlet', 'kangiqliniq'], regionHint: 'Kivalliq Region, Nunavut' },
      { native: 'ᐃᒡᓗᓕᒃ', english: 'Igloolik', acceptedAnswers: ['igloolik', 'iglulik'], regionHint: 'Qikiqtaaluk Region, Nunavut' },
      { native: 'ᐸᖕᓂᖅᑑᖅ', english: 'Pangnirtung', acceptedAnswers: ['pangnirtung'], regionHint: 'Baffin Island, Nunavut' },
      { native: 'ᑯᔾᔪᐊᖅ', english: 'Kuujjuaq', acceptedAnswers: ['kuujjuaq'], regionHint: 'Nunavik, Northern Quebec' },
      { native: 'ᐃᓄᒃᔪᐊᖅ', english: 'Inukjuak', acceptedAnswers: ['inukjuak'], regionHint: 'Hudson Bay Coast, Quebec' }
    ],
    sampleCountries: [
      { country: 'Canada (Nunavut & Nunavik)', nativeName: 'ᓄᓇᕗᑦ', transliteration: 'Nunavut', flag: '🇨🇦' }
    ]
  },
  {
    id: 'cherokee',
    name: 'Cherokee Syllabary (ᏣᎳᎩ)',
    type: 'Syllabary',
    direction: 'ltr',
    origin: 'Invented by Sequoyah, 1821 CE (North Carolina & Oklahoma)',
    speakers: '2,500',
    description:
      '85-character syllabary seen on bilingual street signs and highway markers in Tahlequah (Oklahoma) and Cherokee (North Carolina). Many characters resemble Latin letters (Ꭰ, Ꭱ, Ꭲ, Ꮃ, Ꮤ, CW) but represent completely different Cherokee syllables!',
    introSections: [
      {
        title: 'Sequoyah\'s Syllabary & Latin Lookalike Traps',
        paragraphs: [
          'Sequoyah borrowed shapes from an English spelling book without knowing how to read English, creating the ultimate set of "False-Friend Traps": D (Ꭰ) = "a", R (Ꭱ) = "e", T (Ꭲ) = "i", W (Ꮃ) = "la", L (Ꮮ) = "tle", 4 (Ꮞ) = "se", G (C) = "tli", and H (Ꮋ) = "mi"!'
        ]
      }
    ],
    characters: [
      { char: 'Ꭰ', rom: 'a', name: 'A', phonetic: '/a/', category: 'vowel', note: 'TRAP: Looks like Latin D, sounds like vowel A!' },
      { char: 'Ꭱ', rom: 'e', name: 'E', phonetic: '/e/', category: 'vowel', note: 'TRAP: Looks like Latin R, sounds like vowel E!' },
      { char: 'Ꭲ', rom: 'i', name: 'I', phonetic: '/i/', category: 'vowel', note: 'TRAP: Looks like Latin T, sounds like vowel I!' },
      { char: 'Ꭳ', rom: 'o', name: 'O', phonetic: '/o/', category: 'vowel', note: 'Curled loop = vowel O' },
      { char: 'Ꭴ', rom: 'u', name: 'U', phonetic: '/u/', category: 'vowel', note: '6-loop with side hook = vowel U' },
      { char: 'Ꭵ', rom: 'v (nasal uh)', name: 'V (Nasal Schwa)', phonetic: '/ə̃/', category: 'vowel', note: 'Looks like i/j = nasal vowel "uh" (transcribed as V)' },
      { char: 'Ꭶ / Ꭷ', rom: 'ga / ka', name: 'Ga / Ka', phonetic: '/ɡa/ and /kʰa/', category: 'familiar', note: 'GA and KA syllables' },
      { char: 'Ꮎ', rom: 'na', name: 'Na', phonetic: '/na/', category: 'familiar', note: 'θ-circle with leg = NA' },
      { char: 'Ꮒ', rom: 'ni', name: 'Ni', phonetic: '/ni/', category: 'familiar', note: 'h-shape with top bar = NI' },
      { char: 'Ꮓ', rom: 'no', name: 'No', phonetic: '/no/', category: 'familiar', note: 'Z-shape (Ꮓ) = NO' },
      { char: 'Ꮃ', rom: 'la', name: 'La', phonetic: '/la/', category: 'trap', note: 'TRAP: Looks like Latin W, sounds like LA (as in ᏣᎳᎩ Tsalagi)!' },
      { char: 'Ꮋ', rom: 'mi', name: 'Mi', phonetic: '/mi/', category: 'trap', note: 'TRAP: Looks like Latin H, sounds like MI!' },
      { char: 'Ꮞ', rom: 'se', name: 'Se', phonetic: '/se/', category: 'trap', note: 'TRAP: Looks like number 4, sounds like SE!' },
      { char: 'Ᏼ', rom: 'yv', name: 'Yv', phonetic: '/jə̃/', category: 'trap', note: 'TRAP: Looks like Latin B, sounds like YV!' },
      { char: 'Ꮤ', rom: 'ta', name: 'Ta', phonetic: '/tʰa/', category: 'trap', note: 'TRAP: Looks like W with crossbars = TA!' },
      { char: 'Ꮳ', rom: 'tsa', name: 'Tsa', phonetic: '/tʃa/ or /tsa/', category: 'unique', note: 'V-curl (Ꮳ) = TSA (first letter of ᏣᎳᎩ Tsalagi / Cherokee!)' },
      { char: 'Ꭹ', rom: 'gi', name: 'Gi', phonetic: '/ɡi/', category: 'unique', note: 'y-shape with top curl = GI (last letter of ᏣᎳᎩ Tsalagi!)' },
      { char: 'Ꮖ', rom: 'gwa / kwa', name: 'Gwa', phonetic: '/ɡwa/', category: 'unique', note: 'ω with top loop = GWA (as in ᏓᎵᏆ Daligwa / Tahlequah)' },
      { char: 'Ꮥ / Ꮧ', rom: 'de / di', name: 'De / Di', phonetic: '/de/ and /di/', category: 'unique', note: 'b-hook Ꮥ = DE; J-arch Ꮧ = DI' }
    ],
    cityPractice: [
      { native: 'ᏓᎵᏆ', english: 'Tahlequah (Daligwa)', acceptedAnswers: ['tahlequah', 'daligwa'], regionHint: 'Capital of Cherokee Nation, Oklahoma' },
      { native: 'ᏣᎳᎩ', english: 'Cherokee (Tsalagi)', acceptedAnswers: ['cherokee', 'tsalagi'], regionHint: 'Qualla Boundary, North Carolina' },
      { native: 'ᏚᎵᏌ', english: 'Tulsa (Dulisa)', acceptedAnswers: ['tulsa', 'dulisa'], regionHint: 'Northeast Oklahoma' },
      { native: 'ᏥᏍᏚ', english: 'Tsistu (Rabbit / Place Name)', acceptedAnswers: ['tsistu', 'rabbit'], regionHint: 'Cherokee Nation' },
      { native: 'ᏌᎵᎾ', english: 'Salina', acceptedAnswers: ['salina'], regionHint: 'Mayes County, Oklahoma' },
      { native: 'ᏧᏁᏆ', english: 'Jay (Tsunegwa)', acceptedAnswers: ['jay', 'tsunegwa'], regionHint: 'Delaware County, Oklahoma' }
    ],
    sampleCountries: [
      { country: 'USA (Oklahoma & North Carolina)', nativeName: 'ᏣᎳᎩᎯ ᎠᏰᎵ', transliteration: 'Tsalagihi Ayeli', flag: '🇺🇸' }
    ]
  },
  {
    id: 'javanese',
    name: 'Javanese Aksara Jawa (ꦄꦏ꧀ꦱꦫꦗꦮ)',
    type: 'Abugida',
    direction: 'ltr',
    origin: 'Kawi / Brahmi Script, 9th–15th Century CE (Java, Indonesia)',
    speakers: '80 Million (Javanese speakers)',
    description:
      'Ornate, rhythmic vertical-wave abugida (Hanacaraka) displayed on bilingual street signs across Yogyakarta, Surakarta (Solo), and Central/East Java in Indonesia.',
    introSections: [
      {
        title: 'Spotting Aksara Jawa (Hanacaraka) on Indonesian Street Signs',
        paragraphs: [
          'Javanese script (Aksara Jawa) is famous for its dense, parallel vertical M- and W-waves (legs called "sikil"). Every base consonant carries an inherent "a/o" vowel (ꦲ ha, ꦤ na, ꦕ ca, ꦫ ra, ꦏ ka).',
          'You will see it prominently on green and brown street signs in Yogyakarta ("ꦪꦺꦴꦒꦾꦏꦂꦠ") and Surakarta ("ꦱꦸꦫꦏꦂꦠ").'
        ]
      }
    ],
    characters: [
      { char: 'ꦲ / ꦲꦴ', rom: 'ha / a', name: 'Ha (Aksara Carakan)', phonetic: '/ha/ or /a/', category: 'vowel', note: 'Triple-arch wave = HA or standalone vowel A' },
      { char: 'ꦲꦶ / ꦲꦸ', rom: 'i (wulu) / u (suku)', name: 'Wulu (i) / Suku (u)', phonetic: '/i/ or /u/', category: 'vowel', note: 'Top circle (ꦶ) = I; bottom tail (ꦸ) = U' },
      { char: 'ꦲꦺ / ꦲꦺꦴ', rom: 'e (taling) / o (taling-tarung)', name: 'Taling (e / o)', phonetic: '/e/ or /o/', category: 'vowel', note: 'Prefix ꦺ = E; prefix + suffix ꦺꦴ = O' },
      { char: 'ꦲꦼ / ꦲꦂ', rom: 'e (pepet) / -r (layar)', name: 'Pepet / Layar', phonetic: '/ə/ and /-r/', category: 'vowel', note: 'Large top crown (ꦼ) = schwa E; top slash (ꦂ) = final -R' },
      { char: 'ꦤ', rom: 'na', name: 'Na', phonetic: '/na/', category: 'familiar', note: 'Double arch with middle bridge = NA' },
      { char: 'ꦕ', rom: 'cha / ca', name: 'Ca', phonetic: '/tʃa/', category: 'familiar', note: 'Beaked left loop + right arch = CA/CHA' },
      { char: 'ꦫ', rom: 'ra', name: 'Ra', phonetic: '/ra/', category: 'familiar', note: 'Simple single arch (n-shape) = RA' },
      { char: 'ꦏ', rom: 'ka', name: 'Ka', phonetic: '/ka/', category: 'familiar', note: 'n-arch with extra right legs = KA' },
      { char: 'ꦢ', rom: 'da', name: 'Da', phonetic: '/d̪a/', category: 'familiar', note: 'Curled belly + right legs = DA' },
      { char: 'ꦠ', rom: 'ta', name: 'Ta', phonetic: '/t̪a/', category: 'familiar', note: 'Triple-legged wave with left hook = TA' },
      { char: 'ꦱ', rom: 'sa', name: 'Sa', phonetic: '/sa/', category: 'familiar', note: 'Two separate arches = SA' },
      { char: 'ꦮ / ꦥ', rom: 'wa / pa', name: 'Wa / Pa', phonetic: '/wa/ vs /pa/', category: 'trap', note: 'TRAP: Beaked left arch ꦮ = WA; smooth open U-bridge ꦥ = PA!' },
      { char: 'ꦭ / ꦲ', rom: 'la / ha', name: 'La / Ha', phonetic: '/la/ vs /ha/', category: 'trap', note: 'TRAP: Arch on left + legs on right ꦭ = LA; legs on left + arch on right ꦲ = HA!' },
      { char: 'ꦒ / ꦫ', rom: 'ga / ra', name: 'Ga / Ra', phonetic: '/ɡa/ vs /ra/', category: 'trap', note: 'TRAP: Double M-arch ꦒ = GA; single n-arch ꦫ = RA!' },
      { char: 'ꦩ / ꦪ', rom: 'ma / ya', name: 'Ma / Ya', phonetic: '/ma/ vs /ja/', category: 'trap', note: 'TRAP: Curled inward hook ꦩ = MA; triple open valleys ꦪ = YA!' },
      { char: 'ꦗ', rom: 'ja', name: 'Ja', phonetic: '/dʒa/', category: 'unique', note: 'Ornate R-like center loop = JA' },
      { char: 'ꦚ', rom: 'nya', name: 'Nya', phonetic: '/ɲa/', category: 'unique', note: 'Wide multi-arch letter = NYA' },
      { char: 'ꦧ', rom: 'ba', name: 'Ba', phonetic: '/ba/', category: 'unique', note: 'Left arch + triple right legs = BA' },
      { char: 'ꦔ', rom: 'nga', name: 'Nga', phonetic: '/ŋa/', category: 'unique', note: 'Left arch + C-cup = NGA' }
    ],
    cityPractice: [
      { native: 'ꦪꦺꦴꦒꦾꦏꦂꦠ', english: 'Yogyakarta (Jogja)', acceptedAnswers: ['yogyakarta', 'jogja', 'jogjakarta'], regionHint: 'Special Region of Yogyakarta' },
      { native: 'ꦱꦸꦫꦏꦂꦠ', english: 'Surakarta (Solo)', acceptedAnswers: ['surakarta', 'solo'], regionHint: 'Central Java' },
      { native: 'ꦱꦼꦩꦫꦁ', english: 'Semarang', acceptedAnswers: ['semarang'], regionHint: 'Central Java Capital' },
      { native: 'ꦱꦸꦫꦧꦪ', english: 'Surabaya', acceptedAnswers: ['surabaya'], regionHint: 'East Java Capital' },
      { native: 'ꦩꦭꦁ', english: 'Malang', acceptedAnswers: ['malang'], regionHint: 'East Java Highlands' },
      { native: 'ꦩꦒꦼꦭꦁ', english: 'Magelang', acceptedAnswers: ['magelang'], regionHint: 'Near Borobudur, Central Java' },
      { native: 'ꦏꦼꦢꦶꦫꦶ', english: 'Kediri', acceptedAnswers: ['kediri'], regionHint: 'East Java' },
      { native: 'ꦱꦭꦠꦶꦒ', english: 'Salatiga', acceptedAnswers: ['salatiga'], regionHint: 'Central Java' }
    ],
    sampleCountries: [
      { country: 'Indonesia (Java)', nativeName: 'ꦠꦤꦃꦗꦮ', transliteration: 'Tanah Jawa', flag: '🇮🇩' }
    ]
  }
];
