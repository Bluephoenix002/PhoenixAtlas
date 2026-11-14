import { COUNTRIES_DATABASE } from '../data/countriesData';
import {
  EXTRA_SCRIPT_CHARS,
  EXTRA_CITY_PRACTICE,
  EXPANDED_WORLD_LANGUAGES,
  type LanguageSample
} from './scriptPracticeCatalog';
import { EXPANDED_WRITING_SYSTEMS } from './expandedWritingSystems';

export type LetterCategory = 'vowel' | 'familiar' | 'trap' | 'unique';

export interface ScriptCharacter {
  char: string;
  rom: string; // English / Latin Romanization
  name: string;
  phonetic: string; // IPA or English sound guide
  category?: LetterCategory;
  note?: string; // English hint for trap/unique letters
}

export interface ScriptCityPracticeItem {
  native: string;
  english: string;
  acceptedAnswers: string[];
  regionHint: string;
}

export interface ScriptIntroSection {
  title: string;
  paragraphs: string[];
}

export interface WritingSystemInfo {
  id: string;
  name: string;
  type: 'Alphabet' | 'Abjad' | 'Abugida' | 'Syllabary' | 'Logographic';
  direction: 'ltr' | 'rtl';
  origin: string;
  speakers: string;
  description: string;
  introSections?: ScriptIntroSection[];
  characters: ScriptCharacter[];
  cityPractice: ScriptCityPracticeItem[];
  sampleCountries: Array<{
    country: string;
    nativeName: string;
    transliteration: string;
    flag: string;
  }>;
}

export interface DiacriticLanguageGuide {
  id: string;
  language: string;
  country: string;
  flag: string;
  distinctiveChars: string[];
  trapWarning: string;
  geoguessrTip: string;
  sampleParagraph: string;
  englishTranslation: string;
}

export const EUROPEAN_DIACRITICS_DATA: DiacriticLanguageGuide[] = [
  {
    id: 'estonian',
    language: 'Estonian',
    country: 'Estonia',
    flag: '🇪🇪',
    distinctiveChars: ['Õ', 'õ', 'Ä', 'ä', 'Ö', 'ö', 'Ü', 'ü', 'Š', 'š', 'Ž', 'ž'],
    trapWarning: 'Õ (O with tilde) is unique to Estonian in Europe (Portuguese uses ã/õ but never ä/ö/ü).',
    geoguessrTip: 'Look for Õ/õ and double vowels (aa, ee, ii, oo, uu, õõ, ää). Street signs often end in -tee, -tänav (tn), or -maantee (mnt).',
    sampleParagraph: 'Kõik inimesed sünnivad vabadena ja võrdsetena oma väärikuselt ja õigustelt. Neil on mõistus ja südametunnistus ning nende suhtumist üksteisesse peab kandma vendluse vaim.',
    englishTranslation: 'All human beings are born free and equal in dignity and rights. They are endowed with reason and conscience and should act towards one another in a spirit of brotherhood.'
  },
  {
    id: 'polish',
    language: 'Polish',
    country: 'Poland',
    flag: '🇵🇱',
    distinctiveChars: ['Ą', 'ą', 'Ć', 'ć', 'Ę', 'ę', 'Ł', 'ł', 'Ń', 'ń', 'Ó', 'ó', 'Ś', 'ś', 'Ź', 'ź', 'Ż', 'ż'],
    trapWarning: 'Polish NEVER uses V, Q, or X in native words and never uses carons (č, š, ž) — it uses dots/acutes (ż, ź, ś, ć) and barred Ł.',
    geoguessrTip: 'Look for Ł/ł (pronounced like English W), ogonek vowels (ą, ę), and digraphs like sz, cz, rz, dz, chr. Street signs often start with "ul." (ulica).',
    sampleParagraph: 'Wszyscy ludzie rodzą się wolni i równi pod względem swej godności i swych praw. Są oni obdarzeni rozumem i sumieniem i powinni postępować wobec innych w duchu braterstwa.',
    englishTranslation: 'All human beings are born free and equal in dignity and rights. They are endowed with reason and conscience and should act towards one another in a spirit of brotherhood.'
  },
  {
    id: 'hungarian',
    language: 'Hungarian',
    country: 'Hungary',
    flag: '🇭🇺',
    distinctiveChars: ['Ő', 'ő', 'Ű', 'ű', 'Á', 'á', 'É', 'é', 'Í', 'í', 'Ó', 'ó', 'Ö', 'ö', 'Ú', 'ú', 'Ü', 'ü'],
    trapWarning: 'Ő and Ű (double acute accents) exist ONLY in Hungarian!',
    geoguessrTip: 'Spot double acute accents (ő, ű) and frequent digraphs sz, zs, cs, gy, ny. Street signs end with "utca" (u.), "út", or "tér".',
    sampleParagraph: 'Minden emberi lény szabadon születik és egyenlő méltósága és joga van. Az emberek, észlelve és lelkiismerettel bírván, egymással szemben testvéri szellemben kell hogy viseltessenek.',
    englishTranslation: 'All human beings are born free and equal in dignity and rights. They are endowed with reason and conscience and should act towards one another in a spirit of brotherhood.'
  },
  {
    id: 'romanian',
    language: 'Romanian',
    country: 'Romania / Moldova',
    flag: '🇷🇴',
    distinctiveChars: ['Ă', 'ă', 'Â', 'â', 'Î', 'î', 'Ș', 'ș', 'Ț', 'ț'],
    trapWarning: 'Ă (A with breve) plus comma-below Ș and Ț is exclusively Romanian in Europe (Vietnamese also uses ă, but with tone marks).',
    geoguessrTip: 'Look for ă, î, â, ș, ț. Common words on signs: "Strada", "Bulevardul", "Județul", "Comuna".',
    sampleParagraph: 'Toate ființele umane se nasc libere și egale în demnitate și în drepturi. Ele sunt înzestrate cu rațiune și conștiință și trebuie să se comporte unele față de altele în spiritul fraternității.',
    englishTranslation: 'All human beings are born free and equal in dignity and rights. They are endowed with reason and conscience and should act towards one another in a spirit of brotherhood.'
  },
  {
    id: 'czech-slovak',
    language: 'Czech & Slovak',
    country: 'Czechia / Slovakia',
    flag: '🇨🇿',
    distinctiveChars: ['Ř', 'ř', 'Ů', 'ů', 'Ě', 'ě', 'Ĺ', 'ĺ', 'Ľ', 'ľ', 'Ŕ', 'ŕ', 'Ä', 'ä', 'Ô', 'ô', 'Č', 'č', 'Š', 'š', 'Ž', 'ž'],
    trapWarning: 'Ř/ř and Ů/ů (U with ring) are ONLY in Czech. Ľ/ľ, Ĺ/ĺ, Ŕ/ŕ, Ô/ô, and Ä/ä (with carons) are ONLY in Slovak.',
    geoguessrTip: 'Czech uses Ř and Ů; Slovak uses Ô, Ä, and Ľ. Both use Ď, Ť, Ň, Č, Š, Ž, and acute vowels (Á, É, Í, Ó, Ú, Ý).',
    sampleParagraph: 'Všichni lidé se rodí svobodní a sobě rovní co do důstojnosti a práv. Jsou nadáni rozumem a svědomím a mají spolu jednat v duchu bratrství. (Slovak: Všetci ľudia sa rodia slobodní a sebe rovní...)',
    englishTranslation: 'All human beings are born free and equal in dignity and rights. They are endowed with reason and conscience and should act towards one another in a spirit of brotherhood.'
  },
  {
    id: 'nordic',
    language: 'Nordic (Swedish, Norwegian, Danish, Icelandic)',
    country: 'Nordics',
    flag: '🇸🇪',
    distinctiveChars: ['Å', 'å', 'Ä', 'ä', 'Ö', 'ö', 'Æ', 'æ', 'Ø', 'ø', 'Ð', 'ð', 'Þ', 'þ'],
    trapWarning: 'Swedish & Finnish use Ä and Ö; Norwegian & Danish use Æ and Ø. Icelandic uses Ð (Eth) and Þ (Thorn).',
    geoguessrTip: 'Å + Ä + Ö = Sweden (Finnish rarely uses Å except in Swedish place names). Å + Æ + Ø = Norway or Denmark. Ð + Þ + Æ + Ö = Iceland.',
    sampleParagraph: 'Alla människor äro födda fria och lika i värde och rättigheter. (NO/DK: Alle mennesker er født frie og lige i værdighed og rettigheder. IS: Hver maður er borinn frjáls og jafn öðrum að virðingu og réttindum.)',
    englishTranslation: 'All human beings are born free and equal in dignity and rights.'
  },
  {
    id: 'baltic',
    language: 'Lithuanian & Latvian',
    country: 'Lithuania / Latvia',
    flag: '🇱🇹',
    distinctiveChars: ['Ė', 'ė', 'Į', 'į', 'Ų', 'ų', 'Ū', 'ū', 'Ā', 'ā', 'Ē', 'ē', 'Ī', 'ī', 'Ģ', 'ģ', 'Ķ', 'ķ', 'Ļ', 'ļ', 'Ņ', 'ņ', 'Č', 'č', 'Š', 'š', 'Ž', 'ž'],
    trapWarning: 'Ė/ė (E with single dot above) exists ONLY in Lithuanian! Latvian uses macrons (ā, ē, ī, ū) and cedillas under consonants (ģ, ķ, ļ, ņ).',
    geoguessrTip: 'Lithuanian has ė, ą, ę, į, ų, ū (no macrons on a/e/i). Latvian has ā, ē, ī, ū and ķ, ļ, ņ, ģ. Latvian streets end in "iela"; Lithuanian streets end in "gatvė" (g.).',
    sampleParagraph: 'Visi žmonės gimsta laisvi ir lygūs savo orumu ir teisėmis. Jiems suteiktas protas ir sąžinė ir jie turi elgtis vienas kito atžvilgiu kaip broliai. (Latvian: Visi cilvēki piedzimst brīvi un vienlīdzīgi...)',
    englishTranslation: 'All human beings are born free and equal in dignity and rights.'
  },
  {
    id: 'turkish',
    language: 'Turkish',
    country: 'Turkey',
    flag: '🇹🇷',
    distinctiveChars: ['Ğ', 'ğ', 'İ', 'ı', 'Ş', 'ş', 'Ç', 'ç', 'Ö', 'ö', 'Ü', 'ü'],
    trapWarning: 'Dotless lower-case "ı" and dotted capital "İ", plus "Ğ/ğ" (soft G), immediately identify Turkish (or Azerbaijani).',
    geoguessrTip: 'Look for ğ, ı, İ, ş, ç. Common street sign words: "Sokak" (Sk.), "Caddesi" (Cd.), "Mahallesi" (Mah.), "Bulvarı".',
    sampleParagraph: 'Bütün insanlar hür, haysiyet ve haklar bakımından eşit doğarlar. Akıl ve vicdana sahiptirler ve birbirlerine karşı kardeşlik zihniyeti ile hareket etmelidirler.',
    englishTranslation: 'All human beings are born free and equal in dignity and rights. They are endowed with reason and conscience and should act towards one another in a spirit of brotherhood.'
  },
  {
    id: 'vietnamese',
    language: 'Vietnamese (Quốc Ngữ)',
    country: 'Vietnam',
    flag: '🇻🇳',
    distinctiveChars: ['Đ', 'đ', 'Ă', 'ă', 'Â', 'â', 'Ê', 'ê', 'Ô', 'ô', 'Ơ', 'ơ', 'Ư', 'ư', 'Ấ', 'Ầ', 'Ẩ', 'Ẫ', 'Ậ', 'Ắ', 'Ằ', 'Ẳ', 'Ẵ', 'Ặ', 'Ố', 'Ồ', 'Ổ', 'Ỗ', 'Ộ', 'Ớ', 'Ờ', 'Ở', 'Ỡ', 'Ợ', 'Ứ', 'Ừ', 'Ử', 'Ữ', 'Ự'],
    trapWarning: 'Vietnamese is the only Latin script with horn vowels (Ơ/ơ, Ư/ư) and stacked double diacritics (circumflex/breve/horn + 5 tone marks).',
    geoguessrTip: 'Every syllable is separated by a space. Look for Đ/đ, ơ, ư, and stacked diacritics. Common address words: "Đường" (Street), "Phường" (Ward), "Quận" (District), "Tỉnh" (Province).',
    sampleParagraph: 'Tất cả mọi người sinh ra đều được tự do và bình đẳng về nhân phẩm và quyền. Mọi con người đều được tạo hóa ban cho lý trí và lương tâm và cần phải đối xử với nhau trong tình bằng hữu.',
    englishTranslation: 'All human beings are born free and equal in dignity and rights. They are endowed with reason and conscience and should act towards one another in a spirit of brotherhood.'
  }
];

export const WRITING_SYSTEMS: WritingSystemInfo[] = [
  {
    id: 'cyrillic',
    name: 'Cyrillic (Кириллица)',
    type: 'Alphabet',
    direction: 'ltr',
    origin: 'First Bulgarian Empire, 9th Century CE',
    speakers: '250 Million',
    description: 'Essential for GeoGuessr in Russia, Ukraine, Bulgaria, Serbia, North Macedonia, Montenegro, Mongolia, Kyrgyzstan, and Kazakhstan. Master the "Trap Letters" that look like English letters but represent completely different sounds.',
    introSections: [
      {
        title: 'How to Read Cyrillic Word-by-Word',
        paragraphs: [
          'Cyrillic is a true alphabet read left-to-right just like English: each letter stands for one sound, and letters are read sequentially without syllable stacking.',
          'The fastest way to read Cyrillic road signs is to divide letters into 3 groups: Familiar letters (А, К, М, О, Т), False-Friend Trap letters (В=V, Н=N, Р=R, С=S, У=U, Х=KH), and Unique Slavic letters (Б=B, Г=G, Д=D, Ж=ZH, Л=L, П=P, Ф=F, Ч=CH, Ш=SH).'
        ]
      },
      {
        title: 'Putting Letters Together into Cities',
        paragraphs: [
          'Example 1: М + О + С + К + В + А → М (m) + О (o) + С (s, trap!) + К (k) + В (v, trap!) + А (a) = МОСКВА (Moskva / Moscow).',
          'Example 2: В + Л + А + Д + И + В + О + С + Т + О + К → В (v) + Л (l) + А (a) + Д (d) + И (i) + В (v) + О (o) + С (s) + Т (t) + О (o) + К (k) = ВЛАДИВОСТОК (Vladivostok).'
        ]
      }
    ],
    characters: [
      // Vowels
      { char: 'А а', rom: 'a', name: 'A', phonetic: '/a/ as in father', category: 'vowel', note: 'Same as Latin A' },
      { char: 'Е е', rom: 'ye / e', name: 'Ye', phonetic: '/je/ or /e/', category: 'vowel', note: 'Sounds like "ye" in yes' },
      { char: 'Ё ё', rom: 'yo', name: 'Yo', phonetic: '/jo/ as in yonder', category: 'vowel', note: 'Always stressed "yo"' },
      { char: 'И и', rom: 'i', name: 'I', phonetic: '/i/ as in meet', category: 'vowel', note: 'Backwards N = "ee" sound' },
      { char: 'О о', rom: 'o', name: 'O', phonetic: '/o/ as in more', category: 'vowel', note: 'Same as Latin O' },
      { char: 'У у', rom: 'u', name: 'U', phonetic: '/u/ as in boot', category: 'vowel', note: 'TRAP: Looks like Y, sounds like "oo" (U)' },
      { char: 'Ы ы', rom: 'y', name: 'Yery', phonetic: '/ɨ/ hard i', category: 'vowel', note: 'Deep guttural "i/y" vowel' },
      { char: 'Э э', rom: 'e', name: 'E', phonetic: '/ɛ/ as in met', category: 'vowel', note: 'Pure "eh" sound' },
      { char: 'Ю ю', rom: 'yu', name: 'Yu', phonetic: '/ju/ as in you', category: 'vowel', note: 'I + O joined = "yu"' },
      { char: 'Я я', rom: 'ya', name: 'Ya', phonetic: '/ja/ as in yard', category: 'vowel', note: 'Backwards R = "ya"' },

      // Familiar Letters (Look & sound like Latin)
      { char: 'К к', rom: 'k', name: 'Ka', phonetic: '/k/', category: 'familiar', note: 'Same as Latin K' },
      { char: 'М м', rom: 'm', name: 'Em', phonetic: '/m/', category: 'familiar', note: 'Same as Latin M' },
      { char: 'Т т', rom: 't', name: 'Te', phonetic: '/t/', category: 'familiar', note: 'Same as Latin T' },
      { char: 'З з', rom: 'z', name: 'Ze', phonetic: '/z/', category: 'familiar', note: 'Looks like number 3, sounds like Z' },

      // Trap Letters (False Friends - Look like Latin, sound different!)
      { char: 'В в', rom: 'v', name: 'Ve', phonetic: '/v/ as in vine', category: 'trap', note: 'TRAP: Looks like B, sounds like V!' },
      { char: 'Н н', rom: 'n', name: 'En', phonetic: '/n/ as in no', category: 'trap', note: 'TRAP: Looks like H, sounds like N!' },
      { char: 'Р р', rom: 'r', name: 'Er', phonetic: '/r/ rolled R', category: 'trap', note: 'TRAP: Looks like P, sounds like R!' },
      { char: 'С с', rom: 's', name: 'Es', phonetic: '/s/ as in see', category: 'trap', note: 'TRAP: Looks like C, sounds like S!' },
      { char: 'Х х', rom: 'kh / h', name: 'Kha', phonetic: '/x/ as in Bach', category: 'trap', note: 'TRAP: Looks like X, sounds like KH/H!' },

      // Unique Cyrillic Consonants & Signs
      { char: 'Б б', rom: 'b', name: 'Be', phonetic: '/b/ as in bit', category: 'unique', note: 'Flat top roof = B' },
      { char: 'Г г', rom: 'g', name: 'Ge', phonetic: '/ɡ/ as in go', category: 'unique', note: 'Gallows shape = G' },
      { char: 'Д д', rom: 'd', name: 'De', phonetic: '/d/ as in do', category: 'unique', note: 'House with legs = D' },
      { char: 'Ж ж', rom: 'zh', name: 'Zhe', phonetic: '/ʐ/ as in measure', category: 'unique', note: 'Beetle shape = ZH' },
      { char: 'Й й', rom: 'y', name: 'Short I', phonetic: '/j/ as in boy', category: 'unique', note: 'Consonant Y glide' },
      { char: 'Л л', rom: 'l', name: 'El', phonetic: '/l/ as in lamp', category: 'unique', note: 'Tent shape = L' },
      { char: 'П п', rom: 'p', name: 'Pe', phonetic: '/p/ as in pet', category: 'unique', note: 'Greek Pi arch = P' },
      { char: 'Ф ф', rom: 'f', name: 'Ef', phonetic: '/f/ as in face', category: 'unique', note: 'Circle split by line = F' },
      { char: 'Ц ц', rom: 'ts', name: 'Tse', phonetic: '/ts/ as in cats', category: 'unique', note: 'Bottom right tail = TS' },
      { char: 'Ч ч', rom: 'ch', name: 'Che', phonetic: '/tɕ/ as in chat', category: 'unique', note: 'Looks like 4 = CH' },
      { char: 'Ш ш', rom: 'sh', name: 'Sha', phonetic: '/ʂ/ as in ship', category: 'unique', note: '3 prongs = SH' },
      { char: 'Щ щ', rom: 'shch', name: 'Shcha', phonetic: '/ɕː/ fresh cheese', category: 'unique', note: '3 prongs + tail = SHCH' },
      { char: 'Ъ ъ', rom: 'hard sign', name: 'Hard Sign', phonetic: 'silent pause', category: 'unique', note: 'Bulgarian uses Ъ as a vowel ("uh")' },
      { char: 'Ь ь', rom: 'soft sign', name: 'Soft Sign', phonetic: 'palatalizes', category: 'unique', note: 'Softens preceding consonant' }
    ],
    cityPractice: [
      { native: 'Кызыл', english: 'Kyzyl', acceptedAnswers: ['kyzyl', 'kizil'], regionHint: 'Tuva Republic, Russia' },
      { native: 'Москва', english: 'Moscow (Moskva)', acceptedAnswers: ['moscow', 'moskva'], regionHint: 'Capital of Russia' },
      { native: 'Новосибирск', english: 'Novosibirsk', acceptedAnswers: ['novosibirsk'], regionHint: 'Siberia, Russia' },
      { native: 'Владивосток', english: 'Vladivostok', acceptedAnswers: ['vladivostok'], regionHint: 'Primorsky Krai, Far East' },
      { native: 'Екатеринбург', english: 'Yekaterinburg', acceptedAnswers: ['yekaterinburg', 'ekaterinburg'], regionHint: 'Sverdlovsk Oblast, Urals' },
      { native: 'Красноярск', english: 'Krasnoyarsk', acceptedAnswers: ['krasnoyarsk'], regionHint: 'Krasnoyarsk Krai, Siberia' },
      { native: 'Иркутск', english: 'Irkutsk', acceptedAnswers: ['irkutsk'], regionHint: 'Near Lake Baikal' },
      { native: 'Хабаровск', english: 'Khabarovsk', acceptedAnswers: ['khabarovsk', 'habarovsk'], regionHint: 'Russian Far East' },
      { native: 'Челябинск', english: 'Chelyabinsk', acceptedAnswers: ['chelyabinsk'], regionHint: 'Southern Urals' },
      { native: 'Омск', english: 'Omsk', acceptedAnswers: ['omsk'], regionHint: 'Southwestern Siberia' },
      { native: 'Самара', english: 'Samara', acceptedAnswers: ['samara'], regionHint: 'Volga Region' },
      { native: 'Ростов-на-Дону', english: 'Rostov-on-Don (Rostov-na-Donu)', acceptedAnswers: ['rostov', 'rostov-on-don', 'rostov-na-donu', 'rostov na donu'], regionHint: 'Southern Russia' },
      { native: 'Улан-Батор', english: 'Ulaanbaatar (Ulan-Bator)', acceptedAnswers: ['ulaanbaatar', 'ulan-bator', 'ulan bator'], regionHint: 'Capital of Mongolia' },
      { native: 'Бишкек', english: 'Bishkek', acceptedAnswers: ['bishkek'], regionHint: 'Capital of Kyrgyzstan' },
      { native: 'София', english: 'Sofia (Sofiya)', acceptedAnswers: ['sofia', 'sofiya'], regionHint: 'Capital of Bulgaria' }
    ],
    sampleCountries: [
      { country: 'Russia', nativeName: 'Россия', transliteration: 'Rossiya', flag: '🇷🇺' },
      { country: 'Ukraine', nativeName: 'Україна', transliteration: 'Ukrayina', flag: '🇺🇦' },
      { country: 'Bulgaria', nativeName: 'България', transliteration: 'Bǎlgariya', flag: '🇧🇬' },
      { country: 'Serbia', nativeName: 'Србија', transliteration: 'Srbija', flag: '🇷🇸' },
      { country: 'Mongolia', nativeName: 'Монгол Улс', transliteration: 'Mongol Uls', flag: '🇲🇳' },
      { country: 'Kyrgyzstan', nativeName: 'Кыргызстан', transliteration: 'Kyrgyzstan', flag: '🇰🇬' }
    ]
  },
  {
    id: 'greek',
    name: 'Greek (Ελληνικό)',
    type: 'Alphabet',
    direction: 'ltr',
    origin: 'Greece, ~800 BCE',
    speakers: '13 Million',
    description: 'Used in Greece and Cyprus. Knowing Greek letters lets you read all blue highway directional signs and regional road markers before seeing the English sign.',
    introSections: [
      {
        title: 'Reading Greek Letters & Digraphs',
        paragraphs: [
          'Greek is a left-to-right alphabet where every vowel and consonant is written side-by-side. Watch out for false friends: Η (Eta) is the vowel "ee", Ρ (Rho) is "R", Β (Beta) is "V", and lowercase ν (Nu) is "N"!',
          'Important Consonant Combinations (Digraphs): Because Β sounds like V and Δ sounds like TH ("this"), Modern Greek combines letters to make hard B, D, and G sounds: ΜΠ = B, ΝΤ = D, and ΓΚ / ΓΓ = G.'
        ]
      },
      {
        title: 'Putting Letters Together',
        paragraphs: [
          'Example 1: Α (a) + Θ (th) + Η (i) + Ν (n) + Α (a) = ΑΘΗΝΑ (Athina / Athens).',
          'Example 2: Π (p) + Α (a) + Τ (t) + Ρ (r) + Α (a) = ΠΑΤΡΑ (Patra / Patras).'
        ]
      }
    ],
    characters: [
      // Vowels
      { char: 'Α α', rom: 'a', name: 'Alpha', phonetic: '/a/', category: 'vowel', note: 'Same as Latin A' },
      { char: 'Ε ε', rom: 'e', name: 'Epsilon', phonetic: '/e/', category: 'vowel', note: 'Same as Latin E' },
      { char: 'Η η', rom: 'i', name: 'Eta', phonetic: '/i/ as in meet', category: 'trap', note: 'TRAP: Capital Η looks like H, but is the vowel "ee"!' },
      { char: 'Ι ι', rom: 'i', name: 'Iota', phonetic: '/i/', category: 'vowel', note: 'Vowel "ee"' },
      { char: 'Ο ο', rom: 'o', name: 'Omicron', phonetic: '/o/', category: 'vowel', note: 'Short O' },
      { char: 'Υ υ', rom: 'y / i', name: 'Upsilon', phonetic: '/i/ (or /f/, /v/ in diphthongs)', category: 'vowel', note: 'Pronounced "ee" in Modern Greek' },
      { char: 'Ω ω', rom: 'o', name: 'Omega', phonetic: '/o/', category: 'vowel', note: 'Horseshoe O' },

      // Familiar Letters
      { char: 'Ζ ζ', rom: 'z', name: 'Zeta', phonetic: '/z/', category: 'familiar', note: 'Same as Z' },
      { char: 'Κ κ', rom: 'k', name: 'Kappa', phonetic: '/k/', category: 'familiar', note: 'Same as K' },
      { char: 'Μ μ', rom: 'm', name: 'Mu', phonetic: '/m/', category: 'familiar', note: 'Same as M' },
      { char: 'Τ τ', rom: 't', name: 'Tau', phonetic: '/t/', category: 'familiar', note: 'Same as T' },

      // Trap Letters
      { char: 'Β β', rom: 'v', name: 'Beta (Vita)', phonetic: '/v/ as in vine', category: 'trap', note: 'TRAP: Pronounced V in Modern Greek (MP = B)' },
      { char: 'Ν ν', rom: 'n', name: 'Nu', phonetic: '/n/', category: 'trap', note: 'TRAP: Lowercase ν looks like v, sounds like N!' },
      { char: 'Ρ ρ', rom: 'r', name: 'Rho', phonetic: '/r/', category: 'trap', note: 'TRAP: Looks like P, sounds like R!' },
      { char: 'Χ χ', rom: 'ch / kh', name: 'Chi', phonetic: '/x/ as in loch', category: 'trap', note: 'TRAP: Looks like X, sounds like KH/H!' },

      // Unique Letters
      { char: 'Γ γ', rom: 'g / y', name: 'Gamma', phonetic: '/ɣ/ or /j/', category: 'unique', note: 'Soft G or Y (ΓΚ = hard G)' },
      { char: 'Δ δ', rom: 'd / th', name: 'Delta', phonetic: '/ð/ as in this', category: 'unique', note: 'Triangle = voiced TH/D (ΝΤ = hard D)' },
      { char: 'Θ θ', rom: 'th', name: 'Theta', phonetic: '/θ/ as in think', category: 'unique', note: 'Circle with bar = unvoiced TH' },
      { char: 'Λ λ', rom: 'l', name: 'Lambda', phonetic: '/l/', category: 'unique', note: 'Tent shape = L' },
      { char: 'Ξ ξ', rom: 'x / ks', name: 'Xi', phonetic: '/ks/ as in box', category: 'unique', note: 'Three horizontal bars = KS/X' },
      { char: 'Π π', rom: 'p', name: 'Pi', phonetic: '/p/', category: 'unique', note: 'Arch = P' },
      { char: 'Σ σ ς', rom: 's', name: 'Sigma', phonetic: '/s/', category: 'unique', note: 'Summation symbol = S' },
      { char: 'Φ φ', rom: 'f', name: 'Phi', phonetic: '/f/', category: 'unique', note: 'Circle with vertical line = F' },
      { char: 'Ψ ψ', rom: 'ps', name: 'Psi', phonetic: '/ps/', category: 'unique', note: 'Trident = PS' }
    ],
    cityPractice: [
      { native: 'Αθήνα', english: 'Athens (Athina)', acceptedAnswers: ['athens', 'athina'], regionHint: 'Attica, Capital of Greece' },
      { native: 'Θεσσαλονίκη', english: 'Thessaloniki', acceptedAnswers: ['thessaloniki', 'salonica'], regionHint: 'Central Macedonia' },
      { native: 'Πάτρα', english: 'Patras (Patra)', acceptedAnswers: ['patras', 'patra'], regionHint: 'Western Greece / Peloponnese' },
      { native: 'Ηράκλειο', english: 'Heraklion (Irakleio)', acceptedAnswers: ['heraklion', 'irakleio', 'iraklio'], regionHint: 'Crete' },
      { native: 'Λάρισα', english: 'Larissa (Larisa)', acceptedAnswers: ['larissa', 'larisa'], regionHint: 'Thessaly' },
      { native: 'Βόλος', english: 'Volos', acceptedAnswers: ['volos'], regionHint: 'Magnesia, Thessaly' },
      { native: 'Ιωάννινα', english: 'Ioannina', acceptedAnswers: ['ioannina', 'loannina'], regionHint: 'Epirus' },
      { native: 'Χανιά', english: 'Chania (Hania)', acceptedAnswers: ['chania', 'hania', 'khania'], regionHint: 'Western Crete' },
      { native: 'Καλαμάτα', english: 'Kalamata', acceptedAnswers: ['kalamata'], regionHint: 'Southern Peloponnese' },
      { native: 'Λευκωσία', english: 'Nicosia (Lefkosia)', acceptedAnswers: ['nicosia', 'lefkosia'], regionHint: 'Capital of Cyprus' }
    ],
    sampleCountries: [
      { country: 'Greece', nativeName: 'Ελλάδα', transliteration: 'Elláda', flag: '🇬🇷' },
      { country: 'Cyprus', nativeName: 'Κύπρος', transliteration: 'Kýpros', flag: '🇨🇾' }
    ]
  },
  {
    id: 'korean-hangul',
    name: 'Korean Hangul (한글)',
    type: 'Alphabet',
    direction: 'ltr',
    origin: 'Joseon Korea, 1443 CE (King Sejong)',
    speakers: '80 Million',
    description: 'Hangul blocks combine an initial consonant, a vowel, and an optional final consonant. Learning the 24 basic letters allows you to read every Korean road sign and phone area code city in minutes.',
    introSections: [
      {
        title: '1. How Korean Hangul Syllable Blocks Work',
        paragraphs: [
          'Unlike English where letters are written in a flat line (S-E-O-U-L), Korean groups letters into square SYLLABLE BLOCKS. Every single block is pronounced as one syllable!',
          'Rule #1: Every syllable block MUST start with a Consonant (Initial) followed by a Vowel (Medial). It can optionally have a Final Consonant underneath (called Batchim).'
        ]
      },
      {
        title: '2. Where Does the Vowel Go? (Right vs. Below)',
        paragraphs: [
          'Vertical Vowels (ㅏ a, ㅓ eo, ㅣ i, ㅐ ae, ㅔ e) have a tall vertical main stroke, so they are placed to the RIGHT of the initial consonant: 가 = ㄱ (g) + ㅏ (a) = "ga", 서 = ㅅ (s) + ㅓ (eo) = "seo".',
          'Horizontal Vowels (ㅗ o, ㅜ u, ㅡ eu) have a wide flat main stroke, so they are placed UNDERNEATH the initial consonant: 고 = ㄱ (g) + ㅗ (o) = "go", 부 = ㅂ (b) + ㅜ (u) = "bu".'
        ]
      },
      {
        title: '3. The Golden Rule of ㅇ (Ieung) & Final Consonants (Batchim)',
        paragraphs: [
          'What if a syllable starts with a vowel sound like "A" or "U"? Because a block can never start with a naked vowel, Korean places the circle ㅇ in the initial consonant slot as a SILENT placeholder: 아 = silent ㅇ + ㅏ = "a", 우 = silent ㅇ + ㅜ = "u".',
          'However, when a consonant is placed at the BOTTOM of a block (the Final / Batchim position), it closes the syllable! And when ㅇ is at the bottom, it sounds like "NG": 강 = ㄱ (g) + ㅏ (a) + ㅇ (ng) = "gang"!',
          'Full City Example — 서울 (Seoul): Block 1 is ㅅ (s) + ㅓ (eo) = "Seo". Block 2 is silent ㅇ + ㅜ (u) + bottom ㄹ (l) = "ul". Together: 서울 = Seo-ul!',
          'Full City Example — 부산 (Busan): Block 1 is ㅂ (b) + ㅜ (u) = "Bu". Block 2 is ㅅ (s) + ㅏ (a) + bottom ㄴ (n) = "san". Together: 부산 = Bu-san!'
        ]
      }
    ],
    characters: [
      // Vowels
      { char: 'ㅏ', rom: 'a', name: 'A', phonetic: '/a/', category: 'vowel', note: 'Bar pointing right = A' },
      { char: 'ㅑ', rom: 'ya', name: 'Ya', phonetic: '/ja/', category: 'vowel', note: 'Two bars right = YA' },
      { char: 'ㅓ', rom: 'eo', name: 'Eo', phonetic: '/ʌ/ as in sun', category: 'vowel', note: 'Bar pointing left = EO' },
      { char: 'ㅕ', rom: 'yeo', name: 'Yeo', phonetic: '/jʌ/', category: 'vowel', note: 'Two bars left = YEO' },
      { char: 'ㅗ', rom: 'o', name: 'O', phonetic: '/o/', category: 'vowel', note: 'Bar pointing up = O' },
      { char: 'ㅛ', rom: 'yo', name: 'Yo', phonetic: '/jo/', category: 'vowel', note: 'Two bars up = YO' },
      { char: 'ㅜ', rom: 'u', name: 'U', phonetic: '/u/', category: 'vowel', note: 'Bar pointing down = U' },
      { char: 'ㅠ', rom: 'yu', name: 'Yu', phonetic: '/ju/', category: 'vowel', note: 'Two bars down = YU' },
      { char: 'ㅡ', rom: 'eu', name: 'Eu', phonetic: '/ɯ/', category: 'vowel', note: 'Flat horizontal line = EU' },
      { char: 'ㅣ', rom: 'i', name: 'I', phonetic: '/i/', category: 'vowel', note: 'Vertical line (like I) = EE' },

      // Familiar / Mnemonic Consonants
      { char: 'ㄱ', rom: 'g / k', name: 'Giyeok', phonetic: '/ɡ/ or /k/', category: 'familiar', note: 'Looks like a Gun = G/K' },
      { char: 'ㄴ', rom: 'n', name: 'Nieun', phonetic: '/n/', category: 'familiar', note: 'Looks like a Nose = N' },
      { char: 'ㄷ', rom: 'd / t', name: 'Digeut', phonetic: '/d/ or /t/', category: 'familiar', note: 'Looks like a Door = D/T' },
      { char: 'ㅁ', rom: 'm', name: 'Mieum', phonetic: '/m/', category: 'familiar', note: 'Square Mouth = M' },
      { char: 'ㅂ', rom: 'b / p', name: 'Bieup', phonetic: '/b/ or /p/', category: 'familiar', note: 'Bucket = B/P' },

      // Trap / Similar-looking Consonants
      { char: 'ㅇ', rom: 'silent / ng', name: 'Ieung', phonetic: 'silent at start, /ŋ/ at end', category: 'trap', note: 'TRAP: Silent placeholder at start of syllable; "ng" at bottom!' },
      { char: 'ㄹ', rom: 'r / l', name: 'Rieul', phonetic: '/ɾ/ or /l/', category: 'trap', note: 'Rattlesnake = R at start, L at end' },
      { char: 'ㅅ', rom: 's', name: 'Siot', phonetic: '/s/ (or /ʃ/ before i)', category: 'trap', note: 'Ski slope = S' },

      // Unique Aspirated Consonants
      { char: 'ㅈ', rom: 'j', name: 'Jieut', phonetic: '/tɕ/', category: 'unique', note: 'J sound' },
      { char: 'ㅊ', rom: 'ch', name: 'Chieut', phonetic: '/tɕʰ/', category: 'unique', note: 'ㅈ with top tick = CH' },
      { char: 'ㅋ', rom: 'k', name: 'Kieuk', phonetic: '/kʰ/', category: 'unique', note: 'ㄱ with extra bar = aspirated K' },
      { char: 'ㅌ', rom: 't', name: 'Tieut', phonetic: '/tʰ/', category: 'unique', note: 'Looks like E = aspirated T' },
      { char: 'ㅍ', rom: 'p', name: 'Pieup', phonetic: '/pʰ/', category: 'unique', note: 'Roman numeral II = aspirated P' },
      { char: 'ㅎ', rom: 'h', name: 'Hieut', phonetic: '/h/', category: 'unique', note: 'Man in a Hat = H' }
    ],
    cityPractice: [
      { native: '서울', english: 'Seoul', acceptedAnswers: ['seoul', 'soul'], regionHint: 'Capital of South Korea' },
      { native: '부산', english: 'Busan (Pusan)', acceptedAnswers: ['busan', 'pusan'], regionHint: 'Southeast Coast' },
      { native: '인천', english: 'Incheon', acceptedAnswers: ['incheon', 'inchon'], regionHint: 'Northwest Coast near Seoul' },
      { native: '대구', english: 'Daegu', acceptedAnswers: ['daegu', 'taegu'], regionHint: 'North Gyeongsang' },
      { native: '대전', english: 'Daejeon', acceptedAnswers: ['daejeon', 'taejon'], regionHint: 'Central South Korea' },
      { native: '광주', english: 'Gwangju', acceptedAnswers: ['gwangju', 'kwangju'], regionHint: 'Southwest (Jeolla)' },
      { native: '울산', english: 'Ulsan', acceptedAnswers: ['ulsan'], regionHint: 'Southeast Coast' },
      { native: '제주', english: 'Jeju', acceptedAnswers: ['jeju', 'cheju'], regionHint: 'Jeju Island' },
      { native: '수원', english: 'Suwon', acceptedAnswers: ['suwon'], regionHint: 'Gyeonggi Province' },
      { native: '강릉', english: 'Gangneung', acceptedAnswers: ['gangneung', 'kangnung'], regionHint: 'Gangwon East Coast' }
    ],
    sampleCountries: [
      { country: 'South Korea', nativeName: '대한민국', transliteration: 'Daehan Minguk', flag: '🇰🇷' }
    ]
  },
  {
    id: 'thai',
    name: 'Thai (อักษรไทย)',
    type: 'Abugida',
    direction: 'ltr',
    origin: 'Sukhothai Kingdom, 1283 CE',
    speakers: '70 Million',
    description: 'Essential for reading Thai highway signs, province names, and milestone markers. Pay close attention to the loop direction (inside vs outside) on trap letters.',
    introSections: [
      {
        title: 'How Thai Syllables & Vowels Assemble Around a Consonant',
        paragraphs: [
          'Thai is an Abugida: the consonant is the anchor in the center, and vowels can be written BEFORE, AFTER, ABOVE, or BELOW that consonant!',
          'Warning for Beginners: Vowels like เ (e) and แ (ae) are written to the LEFT of the consonant, even though you pronounce the consonant FIRST! For example: เชียง (Chiang) starts visually with เ, followed by ช (ch), but is read Ch + ia + ng.'
        ]
      },
      {
        title: 'Loop Direction & Stem Height (The Key to Thai Trap Letters)',
        paragraphs: [
          'Almost every Thai letter begins with a small circular loop. Check whether the loop faces inside or outside, whether the top roof is smooth (ด = D) or dented (ต = T), and whether the right stem is short (บ = B, พ = PH) or tall (ป = P, ฟ = F).'
        ]
      }
    ],
    characters: [
      // Vowels & Vowel Carriers
      { char: 'อ', rom: 'o / vowel carrier', name: 'O Ang', phonetic: '/ʔ/ or /ɔː/', category: 'vowel', note: 'Silent vowel carrier or long O' },
      { char: 'ะ / า', rom: 'a / aa', name: 'Sara A / Aa', phonetic: '/a/ or /aː/', category: 'vowel', note: 'Walking cane า = long AA' },
      { char: 'ิ / ี', rom: 'i / ii', name: 'Sara I / Ii', phonetic: '/i/ or /iː/', category: 'vowel', note: 'Written ABOVE the consonant' },
      { char: 'ุ / ู', rom: 'u / uu', name: 'Sara U / Uu', phonetic: '/u/ or /uː/', category: 'vowel', note: 'Written BELOW the consonant' },
      { char: 'เ / แ', rom: 'e / ae', name: 'Sara E / Ae', phonetic: '/eː/ or /ɛː/', category: 'vowel', note: 'Written BEFORE the consonant!' },

      // Familiar / Common Consonants
      { char: 'ก', rom: 'k', name: 'Ko Kai (Chicken)', phonetic: '/k/', category: 'familiar', note: 'Only letter with NO loop! Chicken beak = K' },
      { char: 'น', rom: 'n', name: 'No Nu (Mouse)', phonetic: '/n/', category: 'familiar', note: 'Loop on bottom right = N' },
      { char: 'ม', rom: 'm', name: 'Mo Ma (Horse)', phonetic: '/m/', category: 'familiar', note: 'Loop on bottom left = M' },
      { char: 'ร', rom: 'r', name: 'Ro Ruea (Boat)', phonetic: '/r/', category: 'familiar', note: 'Looks like S = R' },
      { char: 'ล', rom: 'l', name: 'Lo Ling (Monkey)', phonetic: '/l/', category: 'familiar', note: 'Curved arch = L' },
      { char: 'ว', rom: 'w / o', name: 'Wo Waen (Ring)', phonetic: '/w/', category: 'familiar', note: 'Simple cane with bottom loop = W' },

      // Trap Letters (Almost identical pairs!)
      { char: 'ข / ค', rom: 'kh', name: 'Kho Khai / Khwai', phonetic: '/kʰ/', category: 'trap', note: 'Aspirated KH (compare loop inside vs outside)' },
      { char: 'ด / ต', rom: 'd / t', name: 'Do Dek / To Tao', phonetic: '/d/ vs /t/', category: 'trap', note: 'TRAP: Smooth roof ด = D; dented roof ต = T!' },
      { char: 'บ / ป', rom: 'b / p', name: 'Bo Baimai / Po Pla', phonetic: '/b/ vs /p/', category: 'trap', note: 'TRAP: Short stem บ = B; tall stem ป = P!' },
      { char: 'พ / ผ / ฟ', rom: 'ph / f', name: 'Pho Phan / Fo Fan', phonetic: '/pʰ/ vs /f/', category: 'trap', note: 'TRAP: Short W = PH; tall tail ฟ = F!' },

      // Unique Letters
      { char: 'ง', rom: 'ng', name: 'Ngo Ngu (Snake)', phonetic: '/ŋ/', category: 'unique', note: 'Leaning loop = NG' },
      { char: 'จ', rom: 'ch', name: 'Cho Chan (Plate)', phonetic: '/tɕ/', category: 'unique', note: 'CH/J sound' },
      { char: 'ย', rom: 'y', name: 'Yo Yak (Giant)', phonetic: '/j/', category: 'unique', note: 'Dented left wall = Y' },
      { char: 'ส', rom: 's', name: 'So Suea (Tiger)', phonetic: '/s/', category: 'unique', note: 'ล with top tail = S' },
      { char: 'ห', rom: 'h', name: 'Ho Hip (Chest)', phonetic: '/h/', category: 'unique', note: 'Two top loops = H' }
    ],
    cityPractice: [
      { native: 'กรุงเทพ', english: 'Bangkok (Krung Thep)', acceptedAnswers: ['bangkok', 'krung thep', 'krungthep'], regionHint: 'Capital of Thailand' },
      { native: 'เชียงใหม่', english: 'Chiang Mai', acceptedAnswers: ['chiang mai', 'chiangmai'], regionHint: 'Northern Thailand' },
      { native: 'ภูเก็ต', english: 'Phuket', acceptedAnswers: ['phuket'], regionHint: 'Southern Andaman Coast' },
      { native: 'ขอนแก่น', english: 'Khon Kaen', acceptedAnswers: ['khon kaen', 'khonkaen'], regionHint: 'Isan (Northeast)' },
      { native: 'อุดรธานี', english: 'Udon Thani', acceptedAnswers: ['udon thani', 'udonthani'], regionHint: 'Upper Isan' },
      { native: 'สุราษฎร์ธานี', english: 'Surat Thani', acceptedAnswers: ['surat thani', 'suratthani'], regionHint: 'Southern Gulf Coast' },
      { native: 'นครราชสีมา', english: 'Nakhon Ratchasima (Korat)', acceptedAnswers: ['nakhon ratchasima', 'korat', 'khorat'], regionHint: 'Southwest Isan' },
      { native: 'สงขลา', english: 'Songkhla', acceptedAnswers: ['songkhla'], regionHint: 'Deep South' },
      { native: 'ระยอง', english: 'Rayong', acceptedAnswers: ['rayong'], regionHint: 'Eastern Seaboard' },
      { native: 'ตาก', english: 'Tak', acceptedAnswers: ['tak'], regionHint: 'Western Thailand' }
    ],
    sampleCountries: [
      { country: 'Thailand', nativeName: 'ประเทศไทย', transliteration: 'Prathet Thai', flag: '🇹🇭' }
    ]
  },
  {
    id: 'japanese-katakana',
    name: 'Japanese Katakana (カタカナ)',
    type: 'Syllabary',
    direction: 'ltr',
    origin: 'Heian Period Japan, 9th Century CE',
    speakers: '125 Million',
    description: 'Angular Japanese script used for loanwords, foreign names, Ski resorts, shopping centers, and Hokkaido place names.',
    characters: [
      // Vowels
      { char: 'ア', rom: 'a', name: 'A', phonetic: '/a/', category: 'vowel', note: 'Vowel A' },
      { char: 'イ', rom: 'i', name: 'I', phonetic: '/i/', category: 'vowel', note: 'Easel = I' },
      { char: 'ウ', rom: 'u', name: 'U', phonetic: '/ɯ/', category: 'vowel', note: 'Vowel U' },
      { char: 'エ', rom: 'e', name: 'E', phonetic: '/e/', category: 'vowel', note: 'Elevator shaft = E' },
      { char: 'オ', rom: 'o', name: 'O', phonetic: '/o/', category: 'vowel', note: 'Opera singer = O' },

      // Familiar Syllables
      { char: 'カ', rom: 'ka', name: 'Ka', phonetic: '/ka/', category: 'familiar', note: 'Angular か = KA' },
      { char: 'キ', rom: 'ki', name: 'Ki', phonetic: '/ki/', category: 'familiar', note: 'Key shape = KI' },
      { char: 'コ', rom: 'ko', name: 'Ko', phonetic: '/ko/', category: 'familiar', note: 'Two corners = KO' },
      { char: 'サ', rom: 'sa', name: 'Sa', phonetic: '/sa/', category: 'familiar', note: 'Sardines = SA' },
      { char: 'セ', rom: 'se', name: 'Se', phonetic: '/se/', category: 'familiar', note: 'Syllable SE' },
      { char: 'タ', rom: 'ta', name: 'Ta', phonetic: '/ta/', category: 'familiar', note: 'Syllable TA' },
      { char: 'ト', rom: 'to', name: 'To', phonetic: '/to/', category: 'familiar', note: 'Totem pole = TO' },
      { char: 'ナ', rom: 'na', name: 'Na', phonetic: '/na/', category: 'familiar', note: 'Cross = NA' },
      { char: 'ニ', rom: 'ni', name: 'Ni', phonetic: '/ni/', category: 'familiar', note: 'Two lines (2 = ni) = NI' },

      // Trap Pairs (The famous Katakana lookalikes!)
      { char: 'シ', rom: 'shi', name: 'Shi', phonetic: '/ɕi/', category: 'trap', note: 'TRAP: Horizontal ticks + upward stroke = SHI (compare ツ tsu)' },
      { char: 'ツ', rom: 'tsu', name: 'Tsu', phonetic: '/tsɯ/', category: 'trap', note: 'TRAP: Vertical ticks + downward stroke = TSU (compare シ shi)' },
      { char: 'ソ', rom: 'so', name: 'So', phonetic: '/so/', category: 'trap', note: 'TRAP: Single vertical tick + downward stroke = SO (compare ン n)' },
      { char: 'ン', rom: 'n', name: 'N', phonetic: '/ɴ/', category: 'trap', note: 'TRAP: Single horizontal tick + upward stroke = N (compare ソ so)' },

      // Unique Syllables
      { char: 'ク', rom: 'ku', name: 'Ku', phonetic: '/kɯ/', category: 'unique', note: 'Cook hat = KU' },
      { char: 'ケ', rom: 'ke', name: 'Ke', phonetic: '/ke/', category: 'unique', note: 'Syllable KE' },
      { char: 'ス', rom: 'su', name: 'Su', phonetic: '/sɯ/', category: 'unique', note: 'Skiier = SU' },
      { char: 'チ', rom: 'chi', name: 'Chi', phonetic: '/tɕi/', category: 'unique', note: 'Cheerleader = CHI' },
      { char: 'テ', rom: 'te', name: 'Te', phonetic: '/te/', category: 'unique', note: 'Telephone pole = TE' },
      { char: 'マ', rom: 'ma', name: 'Ma', phonetic: '/ma/', category: 'unique', note: 'Angle = MA' },
      { char: 'ミ', rom: 'mi', name: 'Mi', phonetic: '/mi/', category: 'unique', note: 'Three lines = MI' },
      { char: 'ラ', rom: 'ra', name: 'Ra', phonetic: '/ɾa/', category: 'unique', note: 'Syllable RA' },
      { char: 'リ', rom: 'ri', name: 'Ri', phonetic: '/ɾi/', category: 'unique', note: 'River reeds = RI' },
      { char: 'ル', rom: 'ru', name: 'Ru', phonetic: '/ɾɯ/', category: 'unique', note: 'Tree roots = RU' },
      { char: 'ロ', rom: 'ro', name: 'Ro', phonetic: '/ɾo/', category: 'unique', note: 'Square box = RO' }
    ],
    cityPractice: [
      { native: 'サッポロ', english: 'Sapporo', acceptedAnswers: ['sapporo', 'saporo'], regionHint: 'Hokkaido' },
      { native: 'ニセコ', english: 'Niseko', acceptedAnswers: ['niseko'], regionHint: 'Hokkaido Ski Town' },
      { native: 'トウキョウ', english: 'Tokyo', acceptedAnswers: ['tokyo', 'toukyou'], regionHint: 'Capital of Japan' },
      { native: 'オオサカ', english: 'Osaka', acceptedAnswers: ['osaka', 'oosaka'], regionHint: 'Kansai Region' },
      { native: 'ナゴヤ', english: 'Nagoya', acceptedAnswers: ['nagoya'], regionHint: 'Aichi Prefecture' },
      { native: 'フクオカ', english: 'Fukuoka', acceptedAnswers: ['fukuoka'], regionHint: 'Kyushu' },
      { native: 'センダイ', english: 'Sendai', acceptedAnswers: ['sendai'], regionHint: 'Miyagi, Tohoku' },
      { native: 'ヒロシマ', english: 'Hiroshima', acceptedAnswers: ['hiroshima'], regionHint: 'Chugoku Region' }
    ],
    sampleCountries: [
      { country: 'Japan', nativeName: 'ニッポン', transliteration: 'Nippon', flag: '🇯🇵' }
    ]
  },
  {
    id: 'japanese-hiragana',
    name: 'Japanese Hiragana (ひらがな)',
    type: 'Syllabary',
    direction: 'ltr',
    origin: 'Japan, 9th Century CE',
    speakers: '125 Million',
    description: 'Curved phonetic syllabary used throughout Japan on railway station signs (which always show Kanji + Hiragana + Romaji) and local store banners.',
    characters: [
      { char: 'あ', rom: 'a', name: 'A', phonetic: '/a/', category: 'vowel', note: 'Vowel A' },
      { char: 'い', rom: 'i', name: 'I', phonetic: '/i/', category: 'vowel', note: 'Vowel I' },
      { char: 'う', rom: 'u', name: 'U', phonetic: '/ɯ/', category: 'vowel', note: 'Vowel U' },
      { char: 'え', rom: 'e', name: 'E', phonetic: '/e/', category: 'vowel', note: 'Vowel E' },
      { char: 'お', rom: 'o', name: 'O', phonetic: '/o/', category: 'vowel', note: 'Vowel O' },
      { char: 'か', rom: 'ka', name: 'Ka', phonetic: '/ka/', category: 'familiar', note: 'KA' },
      { char: 'き', rom: 'ki', name: 'Ki', phonetic: '/ki/', category: 'familiar', note: 'Key = KI' },
      { char: 'く', rom: 'ku', name: 'Ku', phonetic: '/kɯ/', category: 'familiar', note: 'Cuckoo beak = KU' },
      { char: 'け', rom: 'ke', name: 'Ke', phonetic: '/ke/', category: 'familiar', note: 'KE' },
      { char: 'こ', rom: 'ko', name: 'Ko', phonetic: '/ko/', category: 'familiar', note: 'Two worms = KO' },
      { char: 'さ', rom: 'sa', name: 'Sa', phonetic: '/sa/', category: 'trap', note: 'TRAP: Compare さ (sa) vs き (ki)' },
      { char: 'し', rom: 'shi', name: 'Shi', phonetic: '/ɕi/', category: 'familiar', note: 'Fishhook = SHI' },
      { char: 'す', rom: 'su', name: 'Su', phonetic: '/sɯ/', category: 'unique', note: 'Loop curl = SU' },
      { char: 'た', rom: 'ta', name: 'Ta', phonetic: '/ta/', category: 'familiar', note: 'Looks like "ta"' },
      { char: 'ち', rom: 'chi', name: 'Chi', phonetic: '/tɕi/', category: 'trap', note: 'TRAP: Looks like 5 = CHI' },
      { char: 'つ', rom: 'tsu', name: 'Tsu', phonetic: '/tsɯ/', category: 'unique', note: 'Tsunami wave = TSU' },
      { char: 'な', rom: 'na', name: 'Na', phonetic: '/na/', category: 'unique', note: 'NA' },
      { char: 'に', rom: 'ni', name: 'Ni', phonetic: '/ni/', category: 'unique', note: 'Knee = NI' },
      { char: 'ぬ', rom: 'nu', name: 'Nu', phonetic: '/nɯ/', category: 'trap', note: 'TRAP: Compare ぬ (nu, loop) vs め (me, no loop)' },
      { char: 'め', rom: 'me', name: 'Me', phonetic: '/me/', category: 'trap', note: 'TRAP: No tail loop = ME' },
      { char: 'は', rom: 'ha', name: 'Ha', phonetic: '/ha/', category: 'trap', note: 'TRAP: Compare は (ha, 1 top bar) vs ほ (ho, 2 top bars)' },
      { char: 'ほ', rom: 'ho', name: 'Ho', phonetic: '/ho/', category: 'trap', note: 'TRAP: 2 top bars = HO' },
      { char: 'ま', rom: 'ma', name: 'Ma', phonetic: '/ma/', category: 'unique', note: 'MA' },
      { char: 'よ', rom: 'yo', name: 'Yo', phonetic: '/jo/', category: 'unique', note: 'YO' },
      { char: 'る', rom: 'ru', name: 'Ru', phonetic: '/ɾɯ/', category: 'trap', note: 'TRAP: 3 with loop = RU; 3 without loop ろ = RO' },
      { char: 'ろ', rom: 'ro', name: 'Ro', phonetic: '/ɾo/', category: 'trap', note: 'TRAP: 3 without loop = RO' },
      { char: 'わ', rom: 'wa', name: 'Wa', phonetic: '/wa/', category: 'unique', note: 'WA' },
      { char: 'ん', rom: 'n', name: 'N', phonetic: '/ɴ/', category: 'familiar', note: 'Looks like cursive n = N' }
    ],
    cityPractice: [
      { native: 'とうきょう', english: 'Tokyo', acceptedAnswers: ['tokyo', 'toukyou'], regionHint: 'Capital of Japan' },
      { native: 'きょうと', english: 'Kyoto', acceptedAnswers: ['kyoto', 'kyouto'], regionHint: 'Kansai Region' },
      { native: 'おおさか', english: 'Osaka', acceptedAnswers: ['osaka', 'oosaka'], regionHint: 'Kansai Region' },
      { native: 'よこはま', english: 'Yokohama', acceptedAnswers: ['yokohama'], regionHint: 'Kanagawa Prefecture' },
      { native: 'おきなわ', english: 'Okinawa', acceptedAnswers: ['okinawa'], regionHint: 'Ryukyu Islands' },
      { native: 'ながさき', english: 'Nagasaki', acceptedAnswers: ['nagasaki'], regionHint: 'Kyushu' },
      { native: 'しずおか', english: 'Shizuoka', acceptedAnswers: ['shizuoka'], regionHint: 'Chubu Region' },
      { native: 'あきた', english: 'Akita', acceptedAnswers: ['akita'], regionHint: 'Tohoku Region' }
    ],
    sampleCountries: [
      { country: 'Japan', nativeName: 'にほん', transliteration: 'Nihon', flag: '🇯🇵' }
    ]
  },
  {
    id: 'khmer',
    name: 'Khmer (អក្សរខ្មែរ)',
    type: 'Abugida',
    direction: 'ltr',
    origin: 'Angkor / Chenla, 7th Century CE',
    speakers: '16 Million',
    description: 'The script of Cambodia, easily distinguished from Thai by its ornate wavy top hair ("sak") and subscript consonants stacked beneath base letters.',
    introSections: [
      {
        title: 'Base Consonants, Vowel Signs & Stacked Subscripts (Coeng)',
        paragraphs: [
          'Khmer is an Abugida where consonants carry an inherent vowel ("a" or "o"). Vowels attach to the left, right, top, or bottom of the base consonant (for example ក = ka, កា = kaa, កេ = kei).',
          'When two consonants appear together without a vowel between them (like "Phn-" in Phnom Penh ភ្នំពេញ), the second consonant shrinks into a small subscript ("coeng") stacked directly underneath the first consonant!'
        ]
      }
    ],
    characters: [
      { char: 'អ', rom: 'a / o', name: 'O (Vowel Carrier)', phonetic: '/ʔɑː/', category: 'vowel', note: 'Base vowel carrier' },
      { char: 'ា', rom: 'aa / ea', name: 'Sra Aa', phonetic: '/aː/ or /iə/', category: 'vowel', note: 'Vowel AA/EA' },
      { char: 'េ', rom: 'ei', name: 'Sra Ei', phonetic: '/eː/', category: 'vowel', note: 'Written before consonant' },
      { char: 'ក', rom: 'ka', name: 'Ka', phonetic: '/kɑː/', category: 'familiar', note: 'Wavy crown = KA' },
      { char: 'ខ', rom: 'kha', name: 'Kha', phonetic: '/kʰɑː/', category: 'trap', note: 'Curled top = KHA' },
      { char: 'គ', rom: 'ko', name: 'Ko', phonetic: '/kɔː/', category: 'familiar', note: 'Twin peaks = KO' },
      { char: 'ង', rom: 'ngo', name: 'Ngo', phonetic: '/ŋɔː/', category: 'unique', note: 'NGO' },
      { char: 'ច', rom: 'cha', name: 'Cha', phonetic: '/cɑː/', category: 'familiar', note: 'CHA' },
      { char: 'ត', rom: 'ta', name: 'Ta', phonetic: '/tɑː/', category: 'familiar', note: 'TA' },
      { char: 'ន', rom: 'no', name: 'No', phonetic: '/nɔː/', category: 'familiar', note: 'Looks like S = NO' },
      { char: 'ប', rom: 'ba', name: 'Ba', phonetic: '/ɓɑː/', category: 'trap', note: 'TRAP: Compare ប (ba) vs ហ (ha)' },
      { char: 'ហ', rom: 'ha', name: 'Ha', phonetic: '/hɑː/', category: 'trap', note: 'TRAP: Extra right curl = HA' },
      { char: 'ព', rom: 'po', name: 'Po', phonetic: '/pɔː/', category: 'unique', note: 'PO' },
      { char: 'ភ', rom: 'pho', name: 'Pho', phonetic: '/pʰɔː/', category: 'unique', note: 'PHO' },
      { char: 'ម', rom: 'mo', name: 'Mo', phonetic: '/mɔː/', category: 'familiar', note: 'MO' },
      { char: 'យ', rom: 'yo', name: 'Yo', phonetic: '/jɔː/', category: 'unique', note: 'YO' },
      { char: 'រ', rom: 'ro', name: 'Ro', phonetic: '/rɔː/', category: 'familiar', note: 'Tall vertical wave = RO' },
      { char: 'ល', rom: 'lo', name: 'Lo', phonetic: '/lɔː/', category: 'unique', note: 'LO' },
      { char: 'វ', rom: 'vo', name: 'Vo', phonetic: '/ʋɔː/', category: 'unique', note: 'VO' },
      { char: 'ស', rom: 'sa', name: 'Sa', phonetic: '/sɑː/', category: 'familiar', note: 'SA' }
    ],
    cityPractice: [
      { native: 'ភ្នំពេញ', english: 'Phnom Penh', acceptedAnswers: ['phnom penh', 'phnompenh'], regionHint: 'Capital of Cambodia' },
      { native: 'សៀមរាប', english: 'Siem Reap', acceptedAnswers: ['siem reap', 'siemreap'], regionHint: 'Angkor Wat Region' },
      { native: 'បាត់ដំបង', english: 'Battambang', acceptedAnswers: ['battambang'], regionHint: 'Northwest Cambodia' },
      { native: 'កំពត', english: 'Kampot', acceptedAnswers: ['kampot'], regionHint: 'Southern Coast' },
      { native: 'កែប', english: 'Kep', acceptedAnswers: ['kep'], regionHint: 'Coastal Province' },
      { native: 'តាកែវ', english: 'Takeo', acceptedAnswers: ['takeo'], regionHint: 'Southern Cambodia' },
      { native: 'ក្រចេះ', english: 'Kratie', acceptedAnswers: ['kratie'], regionHint: 'Mekong River East' },
      { native: 'កំពង់ចាម', english: 'Kampong Cham', acceptedAnswers: ['kampong cham', 'kompong cham'], regionHint: 'Central Lowlands' }
    ],
    sampleCountries: [
      { country: 'Cambodia', nativeName: 'កម្ពុជា', transliteration: 'Kâmpŭchéa', flag: '🇰🇭' }
    ]
  },
  {
    id: 'bengali',
    name: 'Bengali (বাংলা)',
    type: 'Abugida',
    direction: 'ltr',
    origin: 'Eastern Brahmi / Gaudi, 11th Century CE',
    speakers: '300 Million',
    description: 'Used in Bangladesh and West Bengal/Tripura (India). Easily separated from Hindi Devanagari by its sharp triangular wedges (ব, ক, র) and circular vowel curves.',
    introSections: [
      {
        title: 'Inherent Vowel & Matra Modifiers in Bengali',
        paragraphs: [
          'Every Bengali consonant has an inherent "o/a" sound (ক = ko/ka). Adding vowel signs around the consonant changes the vowel: কা = kaa (bar after), কি = ki (arch from left), কী = kii (arch from right), কু = ku (hook below), কে = ke (curved hook before).'
        ]
      }
    ],
    characters: [
      { char: 'অ', rom: 'o', name: 'Shoro O', phonetic: '/ɔ/', category: 'vowel', note: 'Inherent vowel O' },
      { char: 'আ', rom: 'a', name: 'Shoro A', phonetic: '/a/', category: 'vowel', note: 'অ + vertical bar = A' },
      { char: 'ই', rom: 'i', name: 'Hrosho I', phonetic: '/i/', category: 'vowel', note: 'Short I' },
      { char: 'উ', rom: 'u', name: 'Hrosho U', phonetic: '/u/', category: 'vowel', note: 'Short U' },
      { char: 'এ', rom: 'e', name: 'E', phonetic: '/e/', category: 'vowel', note: 'Vowel E' },
      { char: 'ও', rom: 'o', name: 'O', phonetic: '/o/', category: 'vowel', note: 'Looks like 3 = O' },
      { char: 'ক', rom: 'k', name: 'Ko', phonetic: '/kɔ/', category: 'trap', note: 'TRAP: Triangle + right hook = K (compare ব B)' },
      { char: 'ব', rom: 'b / v', name: 'Bo', phonetic: '/bɔ/', category: 'trap', note: 'TRAP: Simple triangle = B (no dot underneath!)' },
      { char: 'র', rom: 'r', name: 'Ro', phonetic: '/rɔ/', category: 'trap', note: 'TRAP: Triangle with dot underneath = R!' },
      { char: 'গ', rom: 'g', name: 'Go', phonetic: '/ɡɔ/', category: 'familiar', note: 'GO' },
      { char: 'চ', rom: 'ch', name: 'Cho', phonetic: '/tʃɔ/', category: 'familiar', note: 'CHO' },
      { char: 'জ', rom: 'j', name: 'Jo', phonetic: '/dʒɔ/', category: 'familiar', note: 'JO' },
      { char: 'ট', rom: 't', name: 'To', phonetic: '/ʈɔ/', category: 'unique', note: 'Retroflex T' },
      { char: 'ড', rom: 'd', name: 'Do', phonetic: '/ɖɔ/', category: 'unique', note: 'Retroflex D' },
      { char: 'ত', rom: 't', name: 'Khanda To', phonetic: '/t̪ɔ/', category: 'familiar', note: 'Spiral = dental T' },
      { char: 'দ', rom: 'd', name: 'Do', phonetic: '/d̪ɔ/', category: 'familiar', note: 'Dental D' },
      { char: 'ন', rom: 'n', name: 'No', phonetic: '/nɔ/', category: 'familiar', note: 'Left dot under headline = N' },
      { char: 'প', rom: 'p', name: 'Po', phonetic: '/pɔ/', category: 'familiar', note: 'PO' },
      { char: 'ম', rom: 'm', name: 'Mo', phonetic: '/mɔ/', category: 'familiar', note: 'MO' },
      { char: 'ল', rom: 'l', name: 'Lo', phonetic: '/lɔ/', category: 'familiar', note: 'Two arches = L' },
      { char: 'শ', rom: 'sh', name: 'Talobbo Sho', phonetic: '/ʃɔ/', category: 'unique', note: 'Double top loop = SH' },
      { char: 'স', rom: 's / sh', name: 'Donto Sho', phonetic: '/sɔ/', category: 'familiar', note: 'SO/SHO' },
      { char: 'হ', rom: 'h', name: 'Ho', phonetic: '/hɔ/', category: 'unique', note: 'Looks like 2 = H' }
    ],
    cityPractice: [
      { native: 'ঢাকা', english: 'Dhaka', acceptedAnswers: ['dhaka', 'dacca'], regionHint: 'Capital of Bangladesh' },
      { native: 'চট্টগ্রাম', english: 'Chittagong (Chattogram)', acceptedAnswers: ['chittagong', 'chattogram'], regionHint: 'Southeast Port City' },
      { native: 'খুলনা', english: 'Khulna', acceptedAnswers: ['khulna'], regionHint: 'Southwest Bangladesh' },
      { native: 'রাজশাহী', english: 'Rajshahi', acceptedAnswers: ['rajshahi'], regionHint: 'Northwest Bangladesh' },
      { native: 'সিলেট', english: 'Sylhet', acceptedAnswers: ['sylhet'], regionHint: 'Northeast Bangladesh' },
      { native: 'বরিশাল', english: 'Barisal (Barishal)', acceptedAnswers: ['barisal', 'barishal'], regionHint: 'South-Central Delta' },
      { native: 'রংপুর', english: 'Rangpur', acceptedAnswers: ['rangpur'], regionHint: 'Northern Bangladesh' },
      { native: 'কলকাতা', english: 'Kolkata (Calcutta)', acceptedAnswers: ['kolkata', 'calcutta'], regionHint: 'West Bengal, India' }
    ],
    sampleCountries: [
      { country: 'Bangladesh', nativeName: 'বাংলাদেশ', transliteration: 'Bangladesh', flag: '🇧🇩' },
      { country: 'India (West Bengal)', nativeName: 'পশ্চিমবঙ্গ', transliteration: 'Paschimbanga', flag: '🇮🇳' }
    ]
  },
  {
    id: 'arabic',
    name: 'Arabic (العربية)',
    type: 'Abjad',
    direction: 'rtl',
    origin: 'Arabian Peninsula, 4th Century CE',
    speakers: '360 Million',
    description: 'Written right-to-left across Jordan, UAE, Qatar, Oman, Tunisia, and Egypt. Pay attention to the number and position of dots (1, 2, or 3 above or below).',
    introSections: [
      {
        title: 'Reading Right-to-Left & Connected Cursive Forms',
        paragraphs: [
          'Arabic is written from RIGHT to LEFT. Letters connect to their neighbors in a flowing cursive line, meaning a letter looks slightly shortened at the start or middle of a word compared to its standalone shape.',
          'The secret to reading Arabic quickly is counting the DOTS: many letters share the exact same base "boat" or "hook" shape and differ only by having 1 dot below (ب = B), 2 dots above (ت = T), 3 dots above (ث = TH), or 1 dot above a deeper bowl (ن = N).'
        ]
      }
    ],
    characters: [
      { char: 'ا', rom: 'a', name: 'Alif', phonetic: '/aː/', category: 'vowel', note: 'Tall vertical line = long A' },
      { char: 'و', rom: 'w / u', name: 'Waw', phonetic: '/w/ or /uː/', category: 'vowel', note: 'Loop with tail = W or long U/O' },
      { char: 'ي', rom: 'y / i', name: 'Ya', phonetic: '/j/ or /iː/', category: 'vowel', note: 'Two dots below = Y or long EE' },
      { char: 'ب', rom: 'b', name: 'Ba', phonetic: '/b/', category: 'trap', note: '1 dot BELOW boat = B' },
      { char: 'ت', rom: 't', name: 'Ta', phonetic: '/t/', category: 'trap', note: '2 dots ABOVE boat = T' },
      { char: 'ث', rom: 'th', name: 'Tha', phonetic: '/θ/', category: 'trap', note: '3 dots ABOVE boat = TH' },
      { char: 'ن', rom: 'n', name: 'Nun', phonetic: '/n/', category: 'trap', note: '1 dot ABOVE deep bowl = N' },
      { char: 'ج', rom: 'j', name: 'Jim', phonetic: '/d͡ʒ/', category: 'trap', note: '1 dot INSIDE/BELOW hook = J' },
      { char: 'ح', rom: 'h', name: 'Ha', phonetic: '/ħ/', category: 'trap', note: 'NO dot on hook = H' },
      { char: 'خ', rom: 'kh', name: 'Kha', phonetic: '/x/', category: 'trap', note: '1 dot ABOVE hook = KH' },
      { char: 'د / ذ', rom: 'd / dh', name: 'Dal / Dhal', phonetic: '/d/ or /ð/', category: 'familiar', note: 'Small angle = D (with dot = DH)' },
      { char: 'ر / ز', rom: 'r / z', name: 'Ra / Zay', phonetic: '/r/ or /z/', category: 'familiar', note: 'Slide curve = R (with dot = Z)' },
      { char: 'س / ش', rom: 's / sh', name: 'Sin / Shin', phonetic: '/s/ or /ʃ/', category: 'familiar', note: '3 teeth = S (with 3 dots = SH)' },
      { char: 'ف / ق', rom: 'f / q', name: 'Fa / Qaf', phonetic: '/f/ or /q/', category: 'trap', note: '1 dot above loop = F; 2 dots = Q' },
      { char: 'ك', rom: 'k', name: 'Kaf', phonetic: '/k/', category: 'familiar', note: 'K' },
      { char: 'ل', rom: 'l', name: 'Lam', phonetic: '/l/', category: 'familiar', note: 'Umbrella handle = L' },
      { char: 'م', rom: 'm', name: 'Mim', phonetic: '/m/', category: 'familiar', note: 'Small circle = M' },
      { char: 'ه', rom: 'h', name: 'Ha', phonetic: '/h/', category: 'unique', note: 'Circle loop = H' }
    ],
    cityPractice: [
      { native: 'دبي', english: 'Dubai', acceptedAnswers: ['dubai'], regionHint: 'United Arab Emirates' },
      { native: 'مسقط', english: 'Muscat (Masqat)', acceptedAnswers: ['muscat', 'masqat'], regionHint: 'Capital of Oman' },
      { native: 'عمان', english: 'Amman / Oman', acceptedAnswers: ['amman', 'oman'], regionHint: 'Capital of Jordan / Oman' },
      { native: 'الدوحة', english: 'Doha (Ad-Dawhah)', acceptedAnswers: ['doha', 'ad-dawhah'], regionHint: 'Capital of Qatar' },
      { native: 'تونس', english: 'Tunis', acceptedAnswers: ['tunis', 'tunisia'], regionHint: 'Capital of Tunisia' },
      { native: 'صفاقس', english: 'Sfax', acceptedAnswers: ['sfax'], regionHint: 'Coastal Tunisia' },
      { native: 'صلالة', english: 'Salalah', acceptedAnswers: ['salalah'], regionHint: 'Dhofar, Southern Oman' }
    ],
    sampleCountries: [
      { country: 'Jordan', nativeName: 'الأردن', transliteration: 'al-Urdunn', flag: '🇯🇴' },
      { country: 'Oman', nativeName: 'عمان', transliteration: 'ʻUmān', flag: '🇴🇲' },
      { country: 'Tunisia', nativeName: 'تونس', transliteration: 'Tūnis', flag: '🇹🇳' },
      { country: 'UAE', nativeName: 'الإمارات', transliteration: 'al-Imārāt', flag: '🇦🇪' }
    ]
  },
  {
    id: 'hebrew',
    name: 'Hebrew (עִבְרִית)',
    type: 'Abjad',
    direction: 'rtl',
    origin: 'Canaan, 10th Century BCE',
    speakers: '9 Million',
    description: 'Written right-to-left in Israel. Five letters have special final forms when placed at the end of a word.',
    introSections: [
      {
        title: 'Reading Right-to-Left & Spotting Corner Extensions',
        paragraphs: [
          'Hebrew is read from RIGHT to LEFT, and letters never connect to each other. On modern Israeli road signs, short vowels are unwritten, while ו (Vav) acts as V, O, or U, and י (Yod) acts as Y or I.',
          'Look closely at the top-right and bottom-right corners to separate Trap pairs: ד (D) has a small roof overhang on the right whereas ר (R) is smoothly rounded; ב (B/V) has a bottom base toe poking right whereas כ (K) is rounded; ה (H) has a gap in its left leg whereas ח (KH) is closed.'
        ]
      }
    ],
    characters: [
      { char: 'א', rom: 'a / silent', name: 'Alef', phonetic: '/ʔ/', category: 'vowel', note: 'Vowel carrier' },
      { char: 'ו', rom: 'v / o / u', name: 'Vav', phonetic: '/v/, /o/, /u/', category: 'vowel', note: 'Single vertical pin = V, O, or U' },
      { char: 'י', rom: 'y / i', name: 'Yod', phonetic: '/j/ or /i/', category: 'vowel', note: 'Tiny floating apostrophe = Y or I' },
      { char: 'ב', rom: 'b / v', name: 'Bet / Vet', phonetic: '/b/ or /v/', category: 'trap', note: 'TRAP: Base extends right past corner = B/V (compare כ K)' },
      { char: 'כ ך', rom: 'k / kh', name: 'Kaf', phonetic: '/k/ or /χ/', category: 'trap', note: 'TRAP: Rounded right back = K/KH' },
      { char: 'ד', rom: 'd', name: 'Dalet', phonetic: '/d/', category: 'trap', note: 'TRAP: Roof extends right past vertical leg = D (compare ר R)' },
      { char: 'ר', rom: 'r', name: 'Resh', phonetic: '/ʁ/', category: 'trap', note: 'TRAP: Smooth rounded top corner = R' },
      { char: 'ה', rom: 'h', name: 'He', phonetic: '/h/', category: 'trap', note: 'TRAP: Gap in left leg = H (compare ח KH)' },
      { char: 'ח', rom: 'kh / h', name: 'Het', phonetic: '/χ/', category: 'trap', note: 'TRAP: Closed left leg = KH' },
      { char: 'ג', rom: 'g', name: 'Gimel', phonetic: '/ɡ/', category: 'familiar', note: 'Walking leg = G' },
      { char: 'ל', rom: 'l', name: 'Lamed', phonetic: '/l/', category: 'familiar', note: 'Only letter rising above the top line = L' },
      { char: 'מ ם', rom: 'm', name: 'Mem', phonetic: '/m/', category: 'familiar', note: 'M (final form ם is a closed square)' },
      { char: 'נ ן', rom: 'n', name: 'Nun', phonetic: '/n/', category: 'familiar', note: 'N' },
      { char: 'ס', rom: 's', name: 'Samekh', phonetic: '/s/', category: 'unique', note: 'Round circle = S' },
      { char: 'פ ף', rom: 'p / f', name: 'Pe', phonetic: '/p/ or /f/', category: 'unique', note: 'Inner curl = P/F' },
      { char: 'ש', rom: 'sh / s', name: 'Shin', phonetic: '/ʃ/ or /s/', category: 'familiar', note: '3 prongs = SH' },
      { char: 'ת', rom: 't', name: 'Tav', phonetic: '/t/', category: 'unique', note: 'Left foot kicks out = T' }
    ],
    cityPractice: [
      { native: 'ירושלים', english: 'Jerusalem (Yerushalayim)', acceptedAnswers: ['jerusalem', 'yerushalayim'], regionHint: 'Jerusalem District' },
      { native: 'תל אביב', english: 'Tel Aviv', acceptedAnswers: ['tel aviv', 'tel-aviv'], regionHint: 'Mediterranean Coast' },
      { native: 'חיפה', english: 'Haifa', acceptedAnswers: ['haifa'], regionHint: 'Northern Coast' },
      { native: 'אילת', english: 'Eilat', acceptedAnswers: ['eilat'], regionHint: 'Southern Red Sea Tip' },
      { native: 'באר שבע', english: 'Beersheba (Be\'er Sheva)', acceptedAnswers: ['beersheba', 'beer sheva', 'be\'er sheva'], regionHint: 'Negev Desert' },
      { native: 'נתניה', english: 'Netanya', acceptedAnswers: ['netanya'], regionHint: 'Central Coast' }
    ],
    sampleCountries: [
      { country: 'Israel', nativeName: 'יִשְׂרָאֵל', transliteration: 'Yisra\'el', flag: '🇮🇱' }
    ]
  },
  {
    id: 'telugu',
    name: 'Telugu (తెలుగు)',
    type: 'Abugida',
    direction: 'ltr',
    origin: 'Brahmi / Bhattiprolu Script, Andhra Pradesh & Telangana',
    speakers: '95 Million',
    description:
      'Used in Andhra Pradesh and Telangana (South-East India). Distinguished by its rounded letters crowned with a checkmark ("talakattu" ✓) on top.',
    introSections: [
      {
        title: 'The notion of syllables',
        paragraphs: [
          'Much like Bengali or Hindi, Telugu reading is based on the concept of syllables. A Telugu syllable is made of an initial consonant and a vowel.'
        ]
      },
      {
        title: 'Basics of Syllables',
        paragraphs: [
          'The initial consonant is the central part of the syllable, then the vowel is placed somewhere around the consonant.',
          'As an example we will use the letter క = k.',
          'By default, if there is no vowel attached to the consonant, the vowel will be "a", so క = ka.',
          'To modify the consonant, the top of the letter can be modified, for example : కి = ki.',
          'Another possibility is to add something on the right of the letter, for example : కు = ku.'
        ]
      },
      {
        title: 'Final consonant',
        paragraphs: [
          'Sometimes, there is a final consonant added to the syllable; it appears as an additional symbol on the right of the letter.',
          'There are only 3 such symbols, the most commonly seen is the additional m noted as a circle (సున్న). For example the syllable క = ka becomes కం = kam.'
        ]
      }
    ],
    characters: [
      // Vowels (in syllable with క = k) & Vowels (alone)
      { char: 'క (ka)', rom: 'ka', name: 'Ka (default a)', phonetic: '/ka/', category: 'vowel', note: 'Checkmark on top = inherent vowel "a"' },
      { char: 'కా', rom: 'kaa', name: 'Kaa (long aa)', phonetic: '/kaː/', category: 'vowel', note: 'Top right loop = long "aa"' },
      { char: 'కి / కీ', rom: 'ki / kii', name: 'Ki / Kii', phonetic: '/ki/', category: 'vowel', note: 'Top curl replaces checkmark = "i"' },
      { char: 'కు / కూ', rom: 'ku / kuu', name: 'Ku / Kuu', phonetic: '/ku/', category: 'vowel', note: 'Right side cup = "u"' },
      { char: 'కె / కే', rom: 'ke / kee', name: 'Ke / Kee', phonetic: '/ke/', category: 'vowel', note: 'Top left wave = "e"' },
      { char: 'కొ / కో', rom: 'ko / koo', name: 'Ko / Koo', phonetic: '/ko/', category: 'vowel', note: 'Top double wave = "o"' },
      { char: 'కం', rom: 'kam', name: 'Kam (Final m)', phonetic: '/kam/', category: 'vowel', note: 'Circle ० after syllable = final "m" / "n"' },
      { char: 'అ / ఆ', rom: 'a / aa', name: 'Vowel A / Aa (alone)', phonetic: '/a/', category: 'vowel', note: 'Standalone initial vowel A / AA' },
      { char: 'ఇ / ఈ', rom: 'i / ii', name: 'Vowel I / Ii (alone)', phonetic: '/i/', category: 'vowel', note: 'Standalone initial vowel I' },
      { char: 'ఉ / ఊ', rom: 'u / uu', name: 'Vowel U / Uu (alone)', phonetic: '/u/', category: 'vowel', note: 'Standalone initial vowel U' },
      { char: 'ఎ / ఏ', rom: 'e / ee', name: 'Vowel E / Ee (alone)', phonetic: '/e/', category: 'vowel', note: 'Standalone initial vowel E' },

      // Consonants 1 (Familiar / Core)
      { char: 'క', rom: 'ka', name: 'Ka', phonetic: '/ka/', category: 'familiar', note: 'S-curve with checkmark = KA' },
      { char: 'గ', rom: 'ga', name: 'Ga', phonetic: '/ɡa/', category: 'familiar', note: 'Arch shape = GA' },
      { char: 'చ', rom: 'cha', name: 'Cha', phonetic: '/tʃa/', category: 'familiar', note: 'Horizontal dip = CHA' },
      { char: 'జ', rom: 'ja', name: 'Ja', phonetic: '/dʒa/', category: 'familiar', note: 'Double loop = JA' },
      { char: 'ట', rom: 'ta', name: 'Ta (retroflex)', phonetic: '/ʈa/', category: 'familiar', note: 'Two bottom bumps = TA' },
      { char: 'డ', rom: 'da', name: 'Da (retroflex)', phonetic: '/ɖa/', category: 'familiar', note: 'Rounded C with roof = DA' },
      { char: 'త', rom: 'ta', name: 'Ta (dental)', phonetic: '/t̪a/', category: 'familiar', note: 'Curled spiral = dental TA' },
      { char: 'ద', rom: 'da', name: 'Da (dental)', phonetic: '/d̪a/', category: 'familiar', note: 'Heart shape = dental DA' },

      // Trap Letters (Lookalikes)
      { char: 'వ', rom: 'va', name: 'Va', phonetic: '/ʋa/', category: 'trap', note: 'TRAP: Simple bottom circle + checkmark = VA (compare న NA, ప PA)' },
      { char: 'న', rom: 'na', name: 'Na', phonetic: '/na/', category: 'trap', note: 'TRAP: Wave on right wall = NA (compare స SA)' },
      { char: 'స', rom: 'sa', name: 'Sa', phonetic: '/sa/', category: 'trap', note: 'TRAP: Detached checkmark above न-shape = SA' },
      { char: 'ప', rom: 'pa', name: 'Pa', phonetic: '/pa/', category: 'trap', note: 'TRAP: Detached checkmark above व-shape = PA' },
      { char: 'మ', rom: 'ma', name: 'Ma', phonetic: '/ma/', category: 'trap', note: 'TRAP: వ + extra right loop = MA (compare య YA)' },
      { char: 'య', rom: 'ya', name: 'Ya', phonetic: '/ja/', category: 'trap', note: 'TRAP: Large left circle + right loop = YA' },

      // Unique Consonants
      { char: 'ర', rom: 'ra', name: 'Ra', phonetic: '/ra/', category: 'unique', note: 'Round circle with checkmark = RA' },
      { char: 'ల', rom: 'la', name: 'La', phonetic: '/la/', category: 'unique', note: 'U-curve without checkmark = LA' },
      { char: 'ళ', rom: 'la', name: 'Lla (retroflex)', phonetic: '/ɭa/', category: 'unique', note: 'Crossed loop = LLA' },
      { char: 'శ / ష', rom: 'sha', name: 'Sha', phonetic: '/ʃa/', category: 'unique', note: 'SHA' },
      { char: 'హ', rom: 'ha', name: 'Ha', phonetic: '/ha/', category: 'unique', note: 'Circle + right wing = HA' }
    ],
    cityPractice: [
      { native: 'హైదరాబాద్', english: 'Hyderabad', acceptedAnswers: ['hyderabad', 'haidarabad'], regionHint: 'Telangana Capital' },
      { native: 'వరంగల్', english: 'Warangal', acceptedAnswers: ['warangal', 'varangal'], regionHint: 'Telangana District' },
      { native: 'నిజామాబాద్', english: 'Nizamabad', acceptedAnswers: ['nizamabad'], regionHint: 'Telangana District' },
      { native: 'కరీంనగర్', english: 'Karimnagar', acceptedAnswers: ['karimnagar'], regionHint: 'Telangana District' },
      { native: 'ఖమ్మం', english: 'Khammam', acceptedAnswers: ['khammam'], regionHint: 'Telangana District' },
      { native: 'నల్గొండ', english: 'Nalgonda', acceptedAnswers: ['nalgonda'], regionHint: 'Telangana District' },
      { native: 'విశాఖపట్నం', english: 'Visakhapatnam', acceptedAnswers: ['visakhapatnam', 'vizag'], regionHint: 'Andhra Pradesh District' },
      { native: 'విజయవాడ', english: 'Vijayawada', acceptedAnswers: ['vijayawada'], regionHint: 'Andhra Pradesh' },
      { native: 'గుంటూరు', english: 'Guntur (Gunturu)', acceptedAnswers: ['guntur', 'gunturu'], regionHint: 'Andhra Pradesh District' },
      { native: 'నెల్లూరు', english: 'Nellore (Nelluru)', acceptedAnswers: ['nellore', 'nelluru'], regionHint: 'Andhra Pradesh District' },
      { native: 'కర్నూలు', english: 'Kurnool (Kurnoolu)', acceptedAnswers: ['kurnool', 'kurnoolu', 'karnulu'], regionHint: 'Andhra Pradesh District' },
      { native: 'తిరుపతి', english: 'Tirupati', acceptedAnswers: ['tirupati'], regionHint: 'Andhra Pradesh District' },
      { native: 'అనంతపురం', english: 'Anantapur (Anantapuram)', acceptedAnswers: ['anantapur', 'anantapuram'], regionHint: 'Andhra Pradesh District' },
      { native: 'కాకినాడ', english: 'Kakinada', acceptedAnswers: ['kakinada'], regionHint: 'Andhra Pradesh District' },
      { native: 'రాజమండ్రి', english: 'Rajahmundry', acceptedAnswers: ['rajahmundry', 'rajamundry'], regionHint: 'Andhra Pradesh' }
    ],
    sampleCountries: [
      { country: 'India (Telangana & AP)', nativeName: 'తెలంగాణ / ఆంధ్రప్రదేశ్', transliteration: 'Telangana / Andhra Pradesh', flag: '🇮🇳' }
    ]
  },
  {
    id: 'devanagari',
    name: 'Hindi Devanagari (हिन्दी)',
    type: 'Abugida',
    direction: 'ltr',
    origin: 'Brahmi / Nagari Script, Northern India',
    speakers: '600 Million',
    description:
      'Used across Northern & Central India (Hindi, Marathi, Nepali). Immediately recognized by its continuous horizontal top clothesline ("shirorekha") from which boxy letters hang.',
    introSections: [
      {
        title: 'The notion of syllables in Devanagari',
        paragraphs: [
          'Every consonant in Devanagari carries an inherent "a" vowel (for example क = ka), unless modified by a vowel sign (matra) placed before, after, above, or below the letter.'
        ]
      },
      {
        title: 'Vowel Modifiers (Matras)',
        paragraphs: [
          'Adding a vertical bar after क makes का = kaa. Adding a top arch left makes कि = ki, right makes की = kii.',
          'Adding a hook underneath makes कु = ku or कू = kuu. Adding a slanted tick above the top line makes के = ke or को = ko.'
        ]
      }
    ],
    characters: [
      { char: 'अ / आ', rom: 'a / aa', name: 'A / Aa', phonetic: '/ə/ or /aː/', category: 'vowel', note: '3 + T-bar = A; extra bar = AA' },
      { char: 'इ / ई', rom: 'i / ii', name: 'I / Ii', phonetic: '/ɪ/ or /iː/', category: 'vowel', note: 'S-hook = I' },
      { char: 'उ / ऊ', rom: 'u / uu', name: 'U / Uu', phonetic: '/ʊ/ or /uː/', category: 'vowel', note: 'Looks like 3 = U' },
      { char: 'ए / ओ', rom: 'e / o', name: 'E / O', phonetic: '/eː/ or /oː/', category: 'vowel', note: 'Vowel E / O' },
      { char: 'क', rom: 'ka', name: 'Ka', phonetic: '/kə/', category: 'familiar', note: 'Loop + tail on vertical bar = KA' },
      { char: 'ग', rom: 'ga', name: 'Ga', phonetic: '/ɡə/', category: 'familiar', note: 'Left hook + right bar = GA' },
      { char: 'च', rom: 'cha', name: 'Cha', phonetic: '/tʃə/', category: 'familiar', note: 'Beak pointing left = CHA' },
      { char: 'ज', rom: 'ja', name: 'Ja', phonetic: '/dʒə/', category: 'familiar', note: 'Curved hook = JA' },
      { char: 'त', rom: 'ta', name: 'Ta', phonetic: '/t̪ə/', category: 'familiar', note: 'Left leg kicking down = TA' },
      { char: 'द', rom: 'da', name: 'Da', phonetic: '/d̪ə/', category: 'familiar', note: 'Curled tail = DA' },
      { char: 'न', rom: 'na', name: 'Na', phonetic: '/nə/', category: 'familiar', note: 'Front dot hang = NA' },
      { char: 'प', rom: 'pa', name: 'Pa', phonetic: '/pə/', category: 'familiar', note: 'Looks like U = PA' },
      { char: 'ब / व', rom: 'ba / va', name: 'Ba / Va', phonetic: '/bə/ vs /ʋə/', category: 'trap', note: 'TRAP: Circle with slash ब = BA; empty circle व = VA!' },
      { char: 'म / भ', rom: 'ma / bha', name: 'Ma / Bha', phonetic: '/mə/ vs /bʱə/', category: 'trap', note: 'TRAP: Closed top म = MA; open loop top भ = BHA!' },
      { char: 'र', rom: 'ra', name: 'Ra', phonetic: '/rə/', category: 'unique', note: 'Wavy slash = RA' },
      { char: 'ल', rom: 'la', name: 'La', phonetic: '/lə/', category: 'unique', note: 'Double arch = LA' },
      { char: 'स', rom: 'sa', name: 'Sa', phonetic: '/sə/', category: 'unique', note: 'र + टी = SA' },
      { char: 'ह', rom: 'ha', name: 'Ha', phonetic: '/ɦə/', category: 'unique', note: 'S-curve = HA' }
    ],
    cityPractice: [
      { native: 'दिल्ली', english: 'Delhi (Dilli)', acceptedAnswers: ['delhi', 'dilli', 'new delhi'], regionHint: 'Capital of India' },
      { native: 'मुंबई', english: 'Mumbai', acceptedAnswers: ['mumbai', 'bombay'], regionHint: 'Maharashtra Capital' },
      { native: 'जयपुर', english: 'Jaipur', acceptedAnswers: ['jaipur'], regionHint: 'Rajasthan Capital' },
      { native: 'लखनऊ', english: 'Lucknow (Lakhnau)', acceptedAnswers: ['lucknow', 'lakhnau'], regionHint: 'Uttar Pradesh Capital' },
      { native: 'कानपुर', english: 'Kanpur', acceptedAnswers: ['kanpur'], regionHint: 'Uttar Pradesh' },
      { native: 'भोपाल', english: 'Bhopal', acceptedAnswers: ['bhopal'], regionHint: 'Madhya Pradesh Capital' },
      { native: 'इंदौर', english: 'Indore (Indaur)', acceptedAnswers: ['indore', 'indaur'], regionHint: 'Madhya Pradesh' },
      { native: 'पटना', english: 'Patna', acceptedAnswers: ['patna'], regionHint: 'Bihar Capital' },
      { native: 'नागपुर', english: 'Nagpur', acceptedAnswers: ['nagpur'], regionHint: 'Maharashtra' },
      { native: 'पुणे', english: 'Pune', acceptedAnswers: ['pune', 'poona'], regionHint: 'Maharashtra' }
    ],
    sampleCountries: [
      { country: 'India', nativeName: 'भारत', transliteration: 'Bhārat', flag: '🇮🇳' },
      { country: 'Nepal', nativeName: 'नेपाल', transliteration: 'Nepāl', flag: '🇳🇵' }
    ]
  },
  {
    id: 'tamil',
    name: 'Tamil (தமிழ்)',
    type: 'Abugida',
    direction: 'ltr',
    origin: 'Southern Brahmi / Tamil-Brahmi, Tamil Nadu & Sri Lanka',
    speakers: '85 Million',
    description:
      'Used in Tamil Nadu (Southern India), Sri Lanka, and Singapore. Distinguished by a mix of sharp right-angle boxes (க, த, ப, ம) and loops, plus a dot (pulli) above pure consonants (க், த், ம்).',
    introSections: [
      {
        title: 'The Pulli Dot & Syllables in Tamil',
        paragraphs: [
          'In Tamil, a base consonant like க is pronounced "ka". Placing a dot (pulli) on top removes the vowel: க் = pure "k".',
          'Adding ா after a consonant lengthens the vowel to "aa" (கா = kaa). Adding ி on top right makes "i" (கி = ki).'
        ]
      }
    ],
    characters: [
      { char: 'அ / ஆ', rom: 'a / aa', name: 'A / Aa', phonetic: '/ʌ/ or /aː/', category: 'vowel', note: 'Initial vowel A / AA' },
      { char: 'இ / ஈ', rom: 'i / ii', name: 'I / Ii', phonetic: '/i/ or /iː/', category: 'vowel', note: 'Initial vowel I / II' },
      { char: 'உ / ஊ', rom: 'u / uu', name: 'U / Uu', phonetic: '/u/ or /uː/', category: 'vowel', note: 'Looks like 2 = U' },
      { char: 'க', rom: 'ka / ga', name: 'Ka', phonetic: '/ka/ or /ɡa/', category: 'familiar', note: 'KA / GA' },
      { char: 'ச', rom: 'sa / cha', name: 'Sa / Cha', phonetic: '/sa/ or /tʃa/', category: 'familiar', note: 'SA / CHA' },
      { char: 'ட', rom: 'ta / da', name: 'Ta (retroflex)', phonetic: '/ʈa/ or /ɖa/', category: 'familiar', note: 'Simple L-angle = TA/DA' },
      { char: 'த', rom: 'ta / tha', name: 'Ta (dental)', phonetic: '/t̪a/', category: 'familiar', note: 'க with lower tail = THA' },
      { char: 'ந / ன', rom: 'na', name: 'Na', phonetic: '/na/', category: 'familiar', note: 'NA' },
      { char: 'ப', rom: 'pa / ba', name: 'Pa', phonetic: '/pa/ or /ba/', category: 'trap', note: 'TRAP: Square open box = PA (compare ம MA)' },
      { char: 'ம', rom: 'ma', name: 'Ma', phonetic: '/ma/', category: 'trap', note: 'TRAP: Box with top loop = MA' },
      { char: 'ய', rom: 'ya', name: 'Ya', phonetic: '/ja/', category: 'unique', note: 'W-shape = YA' },
      { char: 'ர', rom: 'ra', name: 'Ra', phonetic: '/ɾa/', category: 'unique', note: 'RA' },
      { char: 'ல / ள', rom: 'la', name: 'La', phonetic: '/la/', category: 'unique', note: 'Curved wave = LA' },
      { char: 'வ', rom: 'va', name: 'Va', phonetic: '/ʋa/', category: 'unique', note: 'VA' }
    ],
    cityPractice: [
      { native: 'சென்னை', english: 'Chennai', acceptedAnswers: ['chennai', 'madras'], regionHint: 'Tamil Nadu Capital' },
      { native: 'மதுரை', english: 'Madurai', acceptedAnswers: ['madurai'], regionHint: 'Southern Tamil Nadu' },
      { native: 'கோயம்புத்தூர்', english: 'Coimbatore', acceptedAnswers: ['coimbatore', 'kovai'], regionHint: 'Western Tamil Nadu' },
      { native: 'திருச்சிராப்பள்ளி', english: 'Tiruchirappalli (Trichy)', acceptedAnswers: ['tiruchirappalli', 'trichy'], regionHint: 'Central Tamil Nadu' },
      { native: 'சேலம்', english: 'Salem', acceptedAnswers: ['salem'], regionHint: 'Tamil Nadu' },
      { native: 'வேலூர்', english: 'Vellore', acceptedAnswers: ['vellore'], regionHint: 'Northern Tamil Nadu' },
      { native: 'தஞ்சாவூர்', english: 'Thanjavur (Tanjore)', acceptedAnswers: ['thanjavur', 'tanjore'], regionHint: 'Cauvery Delta' }
    ],
    sampleCountries: [
      { country: 'India (Tamil Nadu)', nativeName: 'தமிழ்நாடு', transliteration: 'Tamiḻnāṭu', flag: '🇮🇳' },
      { country: 'Sri Lanka', nativeName: 'இலங்கை', transliteration: 'Ilaṅkai', flag: '🇱🇰' }
    ]
  },
  ...EXPANDED_WRITING_SYSTEMS
];

export type { LanguageSample };
export type WorldLanguageSample = LanguageSample;

// Enrich WRITING_SYSTEMS in-place so every script has 4+ letters per category and 100+ city/district items
for (const sys of WRITING_SYSTEMS) {
  const extraChars = EXTRA_SCRIPT_CHARS[sys.id];
  if (extraChars) {
    sys.characters = [...sys.characters, ...extraChars];
  }
  const extraCities = EXTRA_CITY_PRACTICE[sys.id];
  if (extraCities) {
    const seen = new Set(sys.cityPractice.map((c) => c.native));
    for (const item of extraCities) {
      if (!seen.has(item.native)) {
        seen.add(item.native);
        sys.cityPractice.push(item);
      }
    }
  }
}

const COUNTRY_CODE_MAP: Record<string, { code: string; codes: string[] }> = {
  estonian: { code: 'EE', codes: ['EE'] },
  polish: { code: 'PL', codes: ['PL'] },
  hungarian: { code: 'HU', codes: ['HU', 'RO', 'SK', 'RS'] },
  romanian: { code: 'RO', codes: ['RO', 'MD'] },
  'czech-slovak': { code: 'CZ', codes: ['CZ', 'SK'] },
  nordic: { code: 'SE', codes: ['SE', 'NO', 'DK', 'IS', 'FI', 'FO', 'GL', 'AX'] },
  baltic: { code: 'LT', codes: ['LT', 'LV'] },
  turkish: { code: 'TR', codes: ['TR', 'CY', 'AZ'] },
  vietnamese: { code: 'VN', codes: ['VN'] },
  finnish: { code: 'FI', codes: ['FI'] },
  albanian: { code: 'AL', codes: ['AL', 'XK', 'MK', 'ME'] },
  portuguese: { code: 'PT', codes: ['PT', 'BR', 'AO', 'MZ', 'GW', 'TL', 'GQ', 'CV', 'ST', 'MO'] },
  spanish: { code: 'ES', codes: ['ES', 'MX', 'AR', 'CO', 'PE', 'VE', 'CL', 'EC', 'GT', 'CU', 'BO', 'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'PA', 'UY', 'GQ', 'PR'] },
  maltese: { code: 'MT', codes: ['MT'] },
  basque: { code: 'ES', codes: ['ES', 'FR'] },
  indonesian: { code: 'ID', codes: ['ID', 'MY', 'BN', 'SG', 'TL'] },
  tagalog: { code: 'PH', codes: ['PH'] },
  swahili: { code: 'KE', codes: ['TZ', 'KE', 'UG', 'RW', 'BI', 'CD', 'MZ', 'SO', 'KM', 'MW', 'ZM'] },
  'telugu-lang': { code: 'IN', codes: ['IN'] },
  'tamil-lang': { code: 'IN', codes: ['IN', 'LK', 'SG', 'MY'] },
  'hindi-lang': { code: 'IN', codes: ['IN', 'FJ'] },
  'bengali-lang': { code: 'BD', codes: ['BD', 'IN'] },
  'sinhala-lang': { code: 'LK', codes: ['LK'] },
  'georgian-lang': { code: 'GE', codes: ['GE'] },
  'armenian-lang': { code: 'AM', codes: ['AM'] }
};

const TARGET_REGION_MAP: Record<string, LanguageSample['targetRegion']> = {
  basque: {
    name: 'Basque Country / Navarre (Northern Spain & SW France)',
    adm1Names: ['Basque Country', 'País Vasco', 'Euskadi', 'Navarre', 'Navarra', 'Nouvelle-Aquitaine'],
    lat: 43.0,
    lng: -2.2,
    radiusKm: 220
  },
  'telugu-lang': {
    name: 'Andhra Pradesh & Telangana (South-East India)',
    adm1Names: ['Andhra Pradesh', 'Telangana'],
    lat: 16.5,
    lng: 79.5,
    radiusKm: 420
  },
  'tamil-lang': {
    name: 'Tamil Nadu (Southern India) or Sri Lanka / Singapore',
    adm1Names: ['Tamil Nadu', 'Puducherry', 'Sri Lanka', 'Singapore'],
    lat: 10.8,
    lng: 78.7,
    radiusKm: 420
  },
  'bengali-lang': {
    name: 'Bangladesh or West Bengal / Tripura (India)',
    adm1Names: ['Bangladesh', 'West Bengal', 'Tripura', 'Assam'],
    lat: 23.7,
    lng: 89.3,
    radiusKm: 420
  }
};

const BASE_WORLD_LANGUAGE_SAMPLES: Array<Omit<LanguageSample, 'countryName' | 'countryCode' | 'countryCodes' | 'howToIdentify' | 'translation'>> = [
  ...EUROPEAN_DIACRITICS_DATA
    .filter((d) => !['czech-slovak', 'nordic', 'baltic'].includes(d.id))
    .map((d) => ({
      id: d.id,
      language: d.language.split(' (')[0],
      acceptedAnswers: [
        d.language.toLowerCase(),
        d.language.split(' (')[0].toLowerCase(),
        ...d.country.toLowerCase().split('/').map((s) => s.trim())
      ],
      country: d.country,
      region: (d.id === 'vietnamese' ? 'Asia' : 'Europe') as LanguageSample['region'],
      flag: d.flag,
      distinctiveChars: d.distinctiveChars,
      clue: `${d.trapWarning} ${d.geoguessrTip}`,
      sampleText: d.sampleParagraph,
      englishTranslation: d.englishTranslation
    })),
  {
    id: 'finnish',
    language: 'Finnish',
    acceptedAnswers: ['finnish', 'finland', 'suomi'],
    country: 'Finland',
    region: 'Europe',
    flag: '🇫🇮',
    distinctiveChars: ['Ä', 'ä', 'Ö', 'ö', 'aa', 'ee', 'ii', 'kk', 'tt'],
    clue: 'Lots of double vowels (aa, ee, ii, oo, uu, yy, ää, öö) and double consonants (kk, pp, tt, ll, mm, nn). Uses Ä and Ö, rarely Å.',
    sampleText: 'Kaikki ihmiset syntyvät vapaina ja tasavertaisina arvoltaan ja oikeuksiltaan. Heille on annettu järki ja omatunto, ja heidän on toimittava toisiaan kohtaan veljeyden hengessä.',
    englishTranslation: 'All human beings are born free and equal in dignity and rights.'
  },
  {
    id: 'albanian',
    language: 'Albanian',
    acceptedAnswers: ['albanian', 'albania', 'kosovo', 'north macedonia', 'montenegro', 'shqip'],
    country: 'Albania / Kosovo / North Macedonia',
    region: 'Europe',
    flag: '🇦🇱',
    distinctiveChars: ['Ë', 'ë', 'Ç', 'ç'],
    clue: 'High frequency of "ë" (e with diaeresis) and "ç", plus digraphs "sh", "zh", "xh", "rr", "ll", "gj", "q". Street signs often say "Rruga" (Rr.).',
    sampleText: 'Të gjithë njerëzit lindin të lirë dhe të barabartë në dinjitet dhe në të drejta. Ata kanë arsye dhe ndërgjegje dhe duhet të sillen ndaj njëri tjetrit me frymë vëllazërimi.',
    englishTranslation: 'All human beings are born free and equal in dignity and rights.'
  },
  {
    id: 'portuguese',
    language: 'Portuguese',
    acceptedAnswers: ['portuguese', 'portugal', 'brazil', 'angola', 'mozambique', 'cape verde', 'guinea-bissau', 'timor-leste', 'sao tome and principe', 'equatorial guinea'],
    country: 'Portugal / Brazil / Angola / Mozambique / Cape Verde / Guinea-Bissau / Timor-Leste',
    region: 'Europe',
    flag: '🇵🇹',
    distinctiveChars: ['Ã', 'ã', 'Õ', 'õ', 'Ç', 'ç', 'Ê', 'ê', 'Ó', 'ó'],
    clue: 'Nasal tilde vowels ã and õ (especially endings "-ção" and "-ções"), plus ç, nh, and lh. Never uses ñ.',
    sampleText: 'Todos os seres humanos nascem livres e iguais em dignidade e em direitos. Dotados de razão e de consciência, devem agir uns para com os outros em espírito de fraternidade.',
    englishTranslation: 'All human beings are born free and equal in dignity and rights.'
  },
  {
    id: 'spanish',
    language: 'Spanish',
    acceptedAnswers: ['spanish', 'spain', 'mexico', 'argentina', 'colombia', 'peru', 'chile', 'venezuela', 'ecuador', 'guatemala', 'cuba', 'bolivia', 'dominican republic', 'honduras', 'paraguay', 'el salvador', 'nicaragua', 'costa rica', 'panama', 'uruguay', 'equatorial guinea', 'puerto rico', 'espanol', 'español'],
    country: 'Spain / Mexico / Hispanic America / Equatorial Guinea',
    region: 'Europe',
    flag: '🇪🇸',
    distinctiveChars: ['Ñ', 'ñ', 'Á', 'É', 'Í', 'Ó', 'Ú', 'Ü', '¿', '¡'],
    clue: 'Look for Ñ/ñ, inverted question/exclamation marks (¿ ¡), acute accents only, and articles "el, la, los, las, del".',
    sampleText: 'Todos los seres humanos nacen libres e iguales en dignidad y derechos y, dotados como están de razón y conciencia, deben comportarse fraternalmente los unos con los otros.',
    englishTranslation: 'All human beings are born free and equal in dignity and rights.'
  },
  {
    id: 'maltese',
    language: 'Maltese',
    acceptedAnswers: ['maltese', 'malta'],
    country: 'Malta',
    region: 'Europe',
    flag: '🇲🇹',
    distinctiveChars: ['Ħ', 'ħ', 'Ċ', 'ċ', 'Ġ', 'ġ', 'Ż', 'ż'],
    clue: 'The only Semitic language written in Latin script! Look for crossed Ħ/ħ and dotted consonants ċ, ġ, ż. Streets begin with "Triq".',
    sampleText: 'Il-bnedmin kollha jitwieldu ħielsa u ugwali fid-dinjità u d-drittijiet. Huma mogħnija bir-raġuni u bil-kuxjenza u għandhom iġibu ruħhom ma\' xulxin bi spirtu ta\' aħwa.',
    englishTranslation: 'All human beings are born free and equal in dignity and rights.'
  },
  {
    id: 'basque',
    language: 'Basque (Euskara)',
    acceptedAnswers: ['basque', 'euskara', 'spain', 'france'],
    country: 'Basque Country (Northern Spain / SW France)',
    region: 'Europe',
    flag: '🇪🇸',
    distinctiveChars: ['tx', 'tz', 'ts', 'x', 'k', 'z'],
    clue: 'Language isolate packed with k, x, z, tx, tz, and double vowels. Place names often end in -ko, -tik, -ra, -eta.',
    sampleText: 'Gizon-emakume guztiak aske jaiotzen dira, duintasun eta eskubide berberak dituztela; eta ezaguera eta kontzientzia dutenez gero, elkarren artean senide legez jokatu beharra dute.',
    englishTranslation: 'All human beings are born free and equal in dignity and rights.'
  },
  {
    id: 'indonesian',
    language: 'Indonesian / Malay',
    acceptedAnswers: ['indonesian', 'malay', 'indonesia', 'malaysia', 'brunei', 'singapore', 'bahasa'],
    country: 'Indonesia / Malaysia / Brunei / Singapore',
    region: 'Asia',
    flag: '🇮🇩',
    distinctiveChars: ['ng', 'ny', 'sy', 'kh'],
    clue: 'Pure 26-letter Latin alphabet with zero diacritics, rich in "a" vowels, "ng/ny" clusters, and reduplicated words (e.g., orang-orang). Look for "Jalan" (Jl.), "Kota", "Kabupaten".',
    sampleText: 'Semua orang dilahirkan merdeka dan mempunyai martabat dan hak-hak yang sama. Mereka dikaruniai akal dan hati nurani dan hendaknya bergaul satu sama lain dalam semangat persaudaraan.',
    englishTranslation: 'All human beings are born free and equal in dignity and rights.'
  },
  {
    id: 'tagalog',
    language: 'Tagalog / Filipino',
    acceptedAnswers: ['tagalog', 'filipino', 'philippines'],
    country: 'Philippines',
    region: 'Asia',
    flag: '🇵🇭',
    distinctiveChars: ['ng', 'mga', 'ang', 'na', 'sa'],
    clue: 'Look for the plural marker "mga", particle "ng", and repeated syllables (ka-, pag-, mag-, -an). Spanish loanwords mixed with Austronesian grammar.',
    sampleText: 'Ang lahat ng tao\'y isinilang na malaya at pantay-pantay sa karangalan at mga karapatan. Sila\'y pinagkalooban ng katwiran at budhi at dapat magpalagayan ang isa\'t isa sa diwa ng pagkakapatiran.',
    englishTranslation: 'All human beings are born free and equal in dignity and rights.'
  },
  {
    id: 'swahili',
    language: 'Swahili (Kiswahili)',
    acceptedAnswers: ['swahili', 'kiswahili', 'kenya', 'tanzania', 'uganda', 'rwanda', 'burundi', 'dr congo', 'mozambique'],
    country: 'Tanzania / Kenya / Uganda / DR Congo / Rwanda / Burundi',
    region: 'Middle East & Africa',
    flag: '🇰🇪',
    distinctiveChars: ['wa', 'kwa', 'katika', 'na', 'ya', 'mwa'],
    clue: 'Bantu noun class prefixes (wa-, ma-, ki-, vi-, m-) and words like "kwa", "katika", "na", "ya", "barabara" (road), "shule" (school).',
    sampleText: 'Watu wote wamezaliwa huru, hadhi na haki zao ni sawa. Wote wamejaliwa akili na dhamiri, hivyo yapasa watendeane kindugu.',
    englishTranslation: 'All human beings are born free and equal in dignity and rights.'
  },
  {
    id: 'telugu-lang',
    language: 'Telugu',
    acceptedAnswers: ['telugu', 'andhra pradesh', 'telangana', 'india'],
    country: 'India (Andhra Pradesh & Telangana)',
    region: 'Asia',
    flag: '🇮🇳',
    distinctiveChars: ['త', 'ల', 'గ', 'క', 'వ', 'మ'],
    clue: 'Rounded Dravidian script with small checkmark ticks (✓) on top of letters. No horizontal top bar.',
    sampleText: 'మానవులందరూ స్వేచ్ఛగా సమాన గౌరవ అధికారాలతో జన్మిస్తారు. వారు వివేకము మరియు అంతరాత్మ కలిగినవారై సోదరభావంతో మెలగాలి.',
    englishTranslation: 'All human beings are born free and equal in dignity and rights.'
  },
  {
    id: 'tamil-lang',
    language: 'Tamil',
    acceptedAnswers: ['tamil', 'tamil nadu', 'sri lanka', 'india', 'singapore', 'malaysia'],
    country: 'India (Tamil Nadu) / Sri Lanka / Singapore / Malaysia',
    region: 'Asia',
    flag: '🇮🇳',
    distinctiveChars: ['த', 'ம', 'ழ', 'க', 'ப', 'ன'],
    clue: 'Mix of sharp geometric corners (க, த, ப, ம) and circular curls, with dots (pulli) above pure consonants.',
    sampleText: 'மனிதப் பிறவியினர் சகலரும் சுதந்திரமாகவே பிறக்கின்றனர்; அவர்கள் மதிப்பிலும் உரிமைகளிலும் சமமானவர்கள்.',
    englishTranslation: 'All human beings are born free and equal in dignity and rights.'
  },
  {
    id: 'hindi-lang',
    language: 'Hindi',
    acceptedAnswers: ['hindi', 'devanagari', 'india', 'fiji'],
    country: 'India / Fiji',
    region: 'Asia',
    flag: '🇮🇳',
    distinctiveChars: ['क', 'म', 'न', 'त', 'र', 'स', 'ह'],
    clue: 'Continuous horizontal top line (shirorekha) with vertical stems and boxy characters.',
    sampleText: 'सभी मनुष्य जन्म से स्वतंत्र और मर्यादा तथा अधिकारों में समान होते हैं। वे तर्क और विवेक से संपन्न हैं तथा उन्हें भाईचारे की भावना से कार्य करना चाहिए।',
    englishTranslation: 'All human beings are born free and equal in dignity and rights.'
  },
  {
    id: 'bengali-lang',
    language: 'Bengali',
    acceptedAnswers: ['bengali', 'bangla', 'bangladesh', 'india'],
    country: 'Bangladesh / India (West Bengal)',
    region: 'Asia',
    flag: '🇧🇩',
    distinctiveChars: ['ব', 'ক', 'র', 'ম', 'ন', 'ত'],
    clue: 'Horizontal top headline like Hindi, but filled with sharp triangular wedges (ব, ক, র) and sweeping curved vowel hooks.',
    sampleText: 'সমস্ত মানুষ স্বাধীনভাবে সমান মর্যাদা এবং অধিকার নিয়ে জন্মগ্রহণ করে। তাঁদের বিবেক এবং বুদ্ধি আছে; সুতরাং সকলেরই একে অপরের প্রতি ভ্রাতৃত্বসুলভ মনোভাব নিয়ে আচরণ করা উচিত।',
    englishTranslation: 'All human beings are born free and equal in dignity and rights.'
  },
  {
    id: 'sinhala-lang',
    language: 'Sinhala',
    acceptedAnswers: ['sinhala', 'sinhalese', 'sri lanka'],
    country: 'Sri Lanka',
    region: 'Asia',
    flag: '🇱🇰',
    distinctiveChars: ['ස', 'ම', 'න', 'ව', 'ක', 'ර'],
    clue: 'Extremely round, curly "apple-and-spiral" letters with zero straight top bars or checkmarks. Used throughout Sri Lanka alongside Tamil.',
    sampleText: 'සියලු මනුෂ්‍යයෝ නිදහස්ව උපත ලබා ඇත. ගරුත්වයෙන් හා අයිතිවාසිකම්වලින් සමාන වෙති.',
    englishTranslation: 'All human beings are born free and equal in dignity and rights.'
  },
  {
    id: 'georgian-lang',
    language: 'Georgian',
    acceptedAnswers: ['georgian', 'georgia', 'kartuli'],
    country: 'Georgia',
    region: 'Europe',
    flag: '🇬🇪',
    distinctiveChars: ['ა', 'გ', 'დ', 'ე', 'ვ', 'თ', 'ი', 'მ', 'ო'],
    clue: 'Mkhedruli script: graceful rounded loops with ascenders and descenders (looks like elvish / ornate botanical curves).',
    sampleText: 'ყველა ადამიანი იბადება თავისუფალი და თანასწორი თავისი ღირსებითა და უფლებებით. მათ მინიჭებული აქვთ გონება და სინდისი.',
    englishTranslation: 'All human beings are born free and equal in dignity and rights.'
  },
  {
    id: 'armenian-lang',
    language: 'Armenian',
    acceptedAnswers: ['armenian', 'armenia'],
    country: 'Armenia',
    region: 'Europe',
    flag: '🇦🇲',
    distinctiveChars: ['ա', 'բ', 'գ', 'դ', 'ե', 'զ', 'է', 'ը', 'թ'],
    clue: 'Many letters look like Latin u, n, m, h with extra arches and hooks. Punctuation uses a colon-like full stop (։).',
    sampleText: 'Բոլոր մարդիկ ծնվում են ազատ ու հավասար իրենց արժանապատվությամբ և իրավունքներով։',
    englishTranslation: 'All human beings are born free and equal in dignity and rights.'
  }
];

function enrichLanguageSampleCountries(sample: LanguageSample): LanguageSample {
  const extraAnswers = (sample.countryCodes || [])
    .map((iso) => COUNTRIES_DATABASE[iso.toUpperCase()]?.name?.toLowerCase())
    .filter((n): n is string => Boolean(n));
  return {
    ...sample,
    acceptedAnswers: Array.from(new Set([...sample.acceptedAnswers, ...extraAnswers]))
  };
}

export const WORLD_LANGUAGE_SAMPLES: LanguageSample[] = [
  ...EXPANDED_WORLD_LANGUAGES.map(enrichLanguageSampleCountries),
  ...BASE_WORLD_LANGUAGE_SAMPLES.map((s) => {
    const mapped = COUNTRY_CODE_MAP[s.id] || { code: 'GB', codes: ['GB'] };
    return enrichLanguageSampleCountries({
      ...s,
      countryName: s.country,
      countryCode: mapped.code,
      countryCodes: mapped.codes,
      targetRegion: TARGET_REGION_MAP[s.id],
      howToIdentify: s.clue,
      translation: s.englishTranslation
    });
  })
];



