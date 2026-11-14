import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  BookOpen,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Building2,
  Sparkles,
  Eye,
  Shuffle,
  Search,
  Globe2,
  Compass,
  SplitSquareVertical
} from 'lucide-react';
import {
  WRITING_SYSTEMS,
  WritingSystemInfo,
  WORLD_LANGUAGE_SAMPLES,
  LetterCategory
} from './scriptData';
import { fisherYatesShuffle } from '../utils/geojsonCache';
import { sounds } from '../utils/soundEngine';
import { CountryFlag } from '../components/CountryFlag';
import { COUNTRIES_DATABASE } from '../data/countriesData';
import type { ActiveGlobeQuizConfig } from '../maps/WorldGlobeView';

type ScriptSubTab =
  | 'intro'
  | 'vowels'
  | 'familiar'
  | 'trap'
  | 'unique'
  | 'all-practice'
  | 'city-practice';

type WorldLangSubMode = 'languages' | 'countries' | 'dialects';

interface AnsweredHistoryItem {
  native: string;
  typed: string;
  expected: string;
  note?: string;
  status: 'correct' | 'incorrect' | 'revealed';
}

interface DialectComparisonGroup {
  id: string;
  shortLabel: string;
  title: string;
  subtitle: string;
  variants: Array<{
    region: string;
    countryCode: string;
    streetTerms: string;
    uniqueClues: string;
    vocabularyDiffs: string;
  }>;
}

const DIALECT_COMPARISON_GROUPS: DialectComparisonGroup[] = [
  {
    id: 'portuguese',
    shortLabel: 'Portuguese',
    title: 'Portuguese: Brazil vs. Portugal vs. Africa',
    subtitle: 'How to distinguish Brazilian, European & African Portuguese on signs',
    variants: [
      {
        region: 'Brazil',
        countryCode: 'BR',
        streetTerms: 'Rua, Av. (Avenida), Rodovia (SP-/BR-), Praça',
        uniqueClues:
          '2-digit area codes in parentheses e.g. (11) 9xxxx-xxxx; "PARE" on octagonal stop signs; gerund -ndo (Vendendo, Alugando, Construindo).',
        vocabularyDiffs:
          'Ônibus (bus), Trem (train), Esporte, Suco, Banheiro, Celular, Sorveteria, Borracharia (tire shop).'
      },
      {
        region: 'Portugal',
        countryCode: 'PT',
        streetTerms: 'Rua, Avenida, Estrada Nacional (N), Praceta, Largo',
        uniqueClues:
          '9-digit phone numbers (2xx xxx xxx or 9xx xxx xxx) with NO parentheses; "STOP" on stop signs; "a + infinitive" (a vender, a construir).',
        vocabularyDiffs:
          'Autocarro (bus), Comboio (train), Desporto, Sumo, Casa de banho, Telemóvel, Gelataria, Talho (butcher).'
      },
      {
        region: 'Angola / Mozambique / Cabo Verde',
        countryCode: 'AO',
        streetTerms: 'Rua, Avenida, Bairro, Estrada',
        uniqueClues:
          'Follows European Portuguese spelling ("STOP", "Talho", "Autocarro") combined with Bantu/local place names (Luanda, Maputo, Benguela, Matola) and +244 / +258 phone prefixes.',
        vocabularyDiffs:
          'Machimbombo (bus in AO), Chapa (minibus in MZ), Esquadra (police), Cantina.'
      }
    ]
  },
  {
    id: 'spanish',
    shortLabel: 'Spanish',
    title: 'Spanish: Spain vs. Mexico vs. Argentina/Uruguay vs. Andes',
    subtitle: 'Stop signs, Voseo verb endings, parking signs & regional vocabulary',
    variants: [
      {
        region: 'Spain (Peninsular)',
        countryCode: 'ES',
        streetTerms: 'Calle (C/), Avenida (Avda.), Paseo, Plaza, Autovía (A-)',
        uniqueClues:
          '"STOP" on stop signs (never PARE/ALTO); vosotros verb forms (-áis, -éis); co-official Catalan (Carrer), Basque (Kalea), or Galician (Rúa).',
        vocabularyDiffs:
          'Aparcamiento / Parking, Ordenador, Móvil, Coche, Farmacia, Estanco (tobacco).'
      },
      {
        region: 'Mexico & Central America',
        countryCode: 'MX',
        streetTerms: 'Calle, Calzada, Bulevar, Colonia (Col.), Privada, Fraccionamiento',
        uniqueClues:
          '"ALTO" on red stop signs; frequent letter X in indigenous Nahuatl/Mayan names (Oaxaca, Xochimilco, Tlaxcala, Xalapa).',
        vocabularyDiffs:
          'Estacionamiento, Abarrotes (grocery), Tlapalería (hardware), Vulcanizadora / Llantas (tires), Taquería, Camión (bus).'
      },
      {
        region: 'Argentina & Uruguay (Rioplatense)',
        countryCode: 'AR',
        streetTerms: 'Calle, Avenida, Bulevar, Ruta Nacional (RN)',
        uniqueClues:
          '"PARE" on stop signs; Voseo accented imperatives & present tense on billboards: "Venite, Comprá, Mirá, Tenés, Querés, Sos, Vos".',
        vocabularyDiffs:
          'Playa de Estacionamiento, Gomería (tire shop), Kiosco, Colectivo / Ómnibus, Heladería, Carnicería.'
      },
      {
        region: 'Colombia, Peru, Chile & Ecuador',
        countryCode: 'CO',
        streetTerms:
          'Colombia grid: Carrera (Cra.) + Calle (Cll.) + Diagonal; Peru/Chile: Jirón (Jr.), Pasaje (Psje.)',
        uniqueClues:
          '"PARE" on stop signs; numeric grid addresses in Colombia (e.g. Cra. 15 # 85-24).',
        vocabularyDiffs:
          'Parqueadero (Colombia parking), Playa de Estacionamiento (Peru), Botica (Peru pharmacy), Ferretería, Almacén.'
      }
    ]
  },
  {
    id: 'french',
    shortLabel: 'French',
    title: 'French: France vs. Belgium vs. Switzerland vs. Quebec vs. Africa',
    subtitle: 'Stop signs, municipal buildings, numbers (70/80/90) & postcodes',
    variants: [
      {
        region: 'France (Metropolitan)',
        countryCode: 'FR',
        streetTerms: 'Rue, Avenue, Boulevard, Place, Impasse, Lieu-dit',
        uniqueClues:
          '"STOP" on stop signs; "Mairie" (Town Hall); 5-digit postcodes (01xxx–95xxx); 10-digit phones starting 01–05.',
        vocabularyDiffs:
          'Quatre-vingts (80), Quatre-vingt-dix (90), Boulangerie, Tabac, Pharmacie.'
      },
      {
        region: 'Belgium (Wallonia & Brussels)',
        countryCode: 'BE',
        streetTerms: 'Rue, Chaussée, Avenue, Place, Drève',
        uniqueClues:
          '"Maison Communale" or "Administration Communale" (instead of Mairie); 4-digit postcodes (1000–7999); bilingual French/Dutch signs in Brussels.',
        vocabularyDiffs:
          'Septante (70), Nonante (90), Friterie / Fritkot, À vendre / À louer (with 02/04/065/081 area codes).'
      },
      {
        region: 'Switzerland (Romandy)',
        countryCode: 'CH',
        streetTerms: 'Rue, Route, Chemin, Place, Avenue',
        uniqueClues:
          '4-digit postcodes (1xxx–2xxx); .ch domain; yellow/white Swiss hiking signs; CHF prices.',
        vocabularyDiffs:
          'Septante (70), Huitante (80 in VD/VS/FR), Nonante (90), Parc / Parcage (parking), Natel (mobile), Velo.'
      },
      {
        region: 'Canada (Quebec & New Brunswick)',
        countryCode: 'CA',
        streetTerms: 'Rue, Boulevard (Boul.), Chemin (Ch.), Rang, Autoroute',
        uniqueClues:
          '"ARRÊT" on red octagonal stop signs (unique to French Canada!); speed limits say "MAXIMUM"; North American 3-digit area codes (514, 418, 450, 819).',
        vocabularyDiffs:
          'Dépanneur (convenience store), Stationnement (parking), Courriel (email), Fin de semaine, Breuvage.'
      },
      {
        region: "Francophone Africa (Senegal, Côte d'Ivoire, DRC, Tunisia)",
        countryCode: 'SN',
        streetTerms: 'Avenue, Rue, Boulevard, Quartier, Carrefour',
        uniqueClues:
          'Colorful painted shopfronts ("Alimentation Générale", "Quincaillerie", "Pharmacie", "Coiffure") alongside Orange / MTN / Wave / Moov Money kiosks.',
        vocabularyDiffs:
          'Goudron (paved road), Dibiterie (grill in Senegal), Maquis (restaurant in CI), Gare Routière.'
      }
    ]
  },
  {
    id: 'dutch',
    shortLabel: 'Dutch',
    title: 'Dutch: Netherlands vs. Belgium (Flanders) vs. Suriname',
    subtitle: 'Street naming patterns, real estate boards & regional vocabulary',
    variants: [
      {
        region: 'Netherlands',
        countryCode: 'NL',
        streetTerms: 'Straat, Weg, Laan, Gracht, Singel, Plein, Dijk',
        uniqueClues:
          'Yellow license plates (front & back); 4-digit + 2-letter postcodes (e.g. 1012 AB); "Gemeente" on blue town entry signs.',
        vocabularyDiffs:
          'Te Koop / Te Huur (Makelaardij), Fietspad, Pinnen (card pay), Snackbar, Winkelcentrum.'
      },
      {
        region: 'Belgium (Flanders)',
        countryCode: 'BE',
        streetTerms: 'Steenweg (extremely common!), Straat, Baan, Markt, Lei (Antwerp)',
        uniqueClues:
          'White license plates with red characters (1-ABC-123); 4-digit numeric postcodes (1500–3999, 8000–9999); red-and-white hexagonal cycle node signs.',
        vocabularyDiffs:
          'Immo (on real estate signs), Frituur, Beenhouwerij (butcher), Kuisen / Poetsen, Stad / Gemeentehuis.'
      },
      {
        region: 'Suriname',
        countryCode: 'SR',
        streetTerms: 'Straat, Weg, Kaya',
        uniqueClues:
          'Left-hand driving with Dutch commercial and road signs; wooden tropical buildings in Paramaribo; +597 phone prefix.',
        vocabularyDiffs: 'Warung (Javanese food stall), Roti shop, Cambio (currency exchange).'
      }
    ]
  },
  {
    id: 'german',
    shortLabel: 'German',
    title: 'German: Germany vs. Austria vs. Switzerland',
    subtitle: 'The ß (Eszett) rule, postcodes & street suffixes',
    variants: [
      {
        region: 'Germany',
        countryCode: 'DE',
        streetTerms: 'Straße (Str.), Weg, Platz, Allee, Damm',
        uniqueClues:
          'Uses ß (Straße, Groß); 5-digit postal codes (01xxx–99xxx); yellow town entry signs showing "Kreis / Landkreis".',
        vocabularyDiffs: 'Rathaus, Bäckerei, Metzgerei / Fleischerei, Einbahnstraße, Kreisverkehr.'
      },
      {
        region: 'Austria',
        countryCode: 'AT',
        streetTerms: 'Gasse (very frequent!), Straße, Platz, Gürtel',
        uniqueClues:
          'Uses ß (Straße); 4-digit postal codes (1xxx–9xxx); blue-bordered white town signs; "Bezirk" on municipal boards.',
        vocabularyDiffs:
          'Gemeindeamt, Trafik (tobacco/kiosk), Bankomat (ATM), Jänner (January), Ordination (doctor office), Pickerl.'
      },
      {
        region: 'Switzerland',
        countryCode: 'CH',
        streetTerms: 'Strasse (NEVER ß!), Gasse, Weg, Platz',
        uniqueClues:
          'NEVER uses ß — always writes "ss" (Strasse, Gross, Busse); 4-digit postal codes (3xxx–9xxx); .ch web domains.',
        vocabularyDiffs:
          'Spital (hospital), Velo (bicycle), Parkieren (parking), Billett (ticket), Coiffeur, Gemeindehaus.'
      }
    ]
  },
  {
    id: 'english',
    shortLabel: 'English',
    title: 'English: UK/Ireland vs. USA/Canada vs. Australia/NZ vs. South Africa',
    subtitle: 'Traffic terms, spelling (-our vs -or) & local terminology',
    variants: [
      {
        region: 'UK & Ireland',
        countryCode: 'GB',
        streetTerms: 'Road, Street, Lane, Close, Way, High Street, Gardens',
        uniqueClues:
          '"Give Way", "Roundabout", "Dual Carriageway", "Car Park", "To Let"; in Ireland, bilingual italicized Irish Gaelic appears above English on all official signs.',
        vocabularyDiffs:
          'Colour, Centre, Tyres, Chemist, Solicitors, Estate Agent, Off Licence, Takeaway.'
      },
      {
        region: 'USA & Canada',
        countryCode: 'US',
        streetTerms: 'Street (St), Avenue (Ave), Boulevard (Blvd), Drive (Dr), Highway (Hwy)',
        uniqueClues:
          '"YIELD", "ONE WAY", "SPEED LIMIT" (USA in MPH) vs "MAXIMUM" (Canada in km/h with metric symbol); 3-digit area codes.',
        vocabularyDiffs:
          'USA: Color, Center, Tires, Realtor, For Lease, Liquor Store. Canada: Colour, Centre, Tire, Washroom, Loony/Toony.'
      },
      {
        region: 'Australia & New Zealand',
        countryCode: 'AU',
        streetTerms: 'Road, Street, Parade, Crescent, Highway, Terrace',
        uniqueClues:
          'Left-hand traffic; "GIVE WAY" signs; yellow diamond kangaroo/kiwi warning signs; Aboriginal (-up, -ong, Wagga) or Māori (Wai-, Whanga-, Te, Roto-) place names.',
        vocabularyDiffs:
          'Bottle Shop / Bottle-O, Chemist, Tyres, Ute, Footpath, Dairy (NZ corner store), Takeaway.'
      },
      {
        region: 'South Africa',
        countryCode: 'ZA',
        streetTerms: 'Street / Straat, Road / Weg, Drive / Rylaan, Avenue / Laan',
        uniqueClues:
          'Left-hand traffic; red-on-yellow warning signs; frequent bilingual English + Afrikaans signage; R1/R2/N1 highway shields.',
        vocabularyDiffs: 'Robot (traffic light), Bakkie (pickup truck), Braai, Bottle Store, To Let, Café.'
      }
    ]
  }
];

interface LanguageHubProps {
  onStartGlobeQuiz?: (config: ActiveGlobeQuizConfig) => void;
}

export const LanguageHub: React.FC<LanguageHubProps> = ({ onStartGlobeQuiz }) => {
  const [hubSection, setHubSection] = useState<'scripts' | 'world-languages'>('scripts');
  const [showScriptOverview, setShowScriptOverview] = useState<boolean>(true);
  const [selectedScriptId, setSelectedScriptId] = useState<string>('telugu');
  const [activeSubTab, setActiveSubTab] = useState<ScriptSubTab>('intro');

  // World Languages Sub-Mode: 'languages', 'countries', 'dialects'
  const [worldLangSubMode, setWorldLangSubMode] = useState<WorldLangSubMode>('languages');
  const [selectedDialectId, setSelectedDialectId] = useState<string>('portuguese');

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const worldLangSubTabsRef = useRef<HTMLDivElement | null>(null);

  // 1-Row Active Letter Trainer State + Past Answers History
  const [shuffleSeed, setShuffleSeed] = useState<number>(0);
  const [letterCursor, setLetterCursor] = useState<number>(0);
  const [letterTyped, setLetterTyped] = useState<string>('');
  const [letterHistory, setLetterHistory] = useState<AnsweredHistoryItem[]>([]);
  const [showAllLettersRef, setShowAllLettersRef] = useState<boolean>(false);
  const activeLetterInputRef = useRef<HTMLInputElement | null>(null);

  // 1-Row Active District & City Names Trainer State + Past Answers History
  const [cityShuffleSeed, setCityShuffleSeed] = useState<number>(0);
  const [cityCursor, setCityCursor] = useState<number>(0);
  const [cityTyped, setCityTyped] = useState<string>('');
  const [cityHistory, setCityHistory] = useState<AnsweredHistoryItem[]>([]);
  const [showAllCitiesList, setShowAllCitiesList] = useState<boolean>(false);
  const activeCityInputRef = useRef<HTMLInputElement | null>(null);

  // World Language Text Guesser State
  const [langRegionFilter, setLangRegionFilter] = useState<string>('All');
  const [langSearchQuery, setLangSearchQuery] = useState<string>('');
  const [countryContinentFilter, setCountryContinentFilter] = useState<string>('All');
  const [guesserOrder] = useState<number[]>(() =>
    fisherYatesShuffle(WORLD_LANGUAGE_SAMPLES.map((_, i) => i))
  );
  const [guesserCursor, setGuesserCursor] = useState<number>(0);
  const [typedLangGuess, setTypedLangGuess] = useState<string>('');
  const [guesserStatus, setGuesserStatus] = useState<'correct' | 'incorrect' | 'revealed' | null>(
    null
  );
  const [guesserScore, setGuesserScore] = useState<{ correct: number; total: number }>({
    correct: 0,
    total: 0
  });

  // Auto-scroll to the very top whenever switching main section (Alphabets <-> World Languages) or script view
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [hubSection, showScriptOverview, selectedScriptId, activeSubTab]);

  // Helper called ONLY when clicking a sub-tab inside World Languages
  const scrollToWorldLangSubTabBar = () => {
    requestAnimationFrame(() => {
      if (worldLangSubTabsRef.current) {
        worldLangSubTabsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };

  const orderedScripts = useMemo(() => {
    return [...WRITING_SYSTEMS].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const currentScript: WritingSystemInfo =
    orderedScripts.find((s) => s.id === selectedScriptId) || orderedScripts[0];

  const activeTabCharacters = useMemo(() => {
    const categoryMap: Record<string, LetterCategory> = {
      vowels: 'vowel',
      familiar: 'familiar',
      trap: 'trap',
      unique: 'unique'
    };
    const targetCat = categoryMap[activeSubTab];
    if (!targetCat) return currentScript.characters;
    const matches = currentScript.characters.filter((c) => c.category === targetCat);
    return matches.length > 0 ? matches : currentScript.characters;
  }, [currentScript, activeSubTab]);

  const trainingRows = useMemo(() => {
    return fisherYatesShuffle(activeTabCharacters);
  }, [activeTabCharacters, shuffleSeed, selectedScriptId, activeSubTab]);

  const cityTrainingRows = useMemo(() => {
    return fisherYatesShuffle(currentScript.cityPractice);
  }, [currentScript, cityShuffleSeed, selectedScriptId]);

  const resetLetterTrainer = () => {
    setLetterCursor(0);
    setLetterTyped('');
    setLetterHistory([]);
  };

  const resetCityTrainer = () => {
    setCityCursor(0);
    setCityTyped('');
    setCityHistory([]);
  };

  useEffect(() => {
    if (['vowels', 'familiar', 'trap', 'unique', 'all-practice'].includes(activeSubTab)) {
      setTimeout(() => activeLetterInputRef.current?.focus(), 60);
    } else if (activeSubTab === 'city-practice') {
      setTimeout(() => activeCityInputRef.current?.focus(), 60);
    }
  }, [activeSubTab, selectedScriptId, showScriptOverview]);

  const currentLetterItem = trainingRows[letterCursor % Math.max(1, trainingRows.length)];
  const currentCityItem = cityTrainingRows[cityCursor % Math.max(1, cityTrainingRows.length)];

  const handleSingleLetterSubmit = (revealOnly = false) => {
    if (!currentLetterItem) return;
    const rawInput = letterTyped.trim().toLowerCase();
    if (!rawInput && !revealOnly) return;

    const acceptedParts = currentLetterItem.rom
      .toLowerCase()
      .split(/[/,()]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const isMatch =
      !revealOnly &&
      (rawInput === currentLetterItem.rom.toLowerCase().trim() ||
        acceptedParts.includes(rawInput) ||
        currentLetterItem.name.toLowerCase().trim() === rawInput);

    const status: 'correct' | 'incorrect' | 'revealed' = revealOnly
      ? 'revealed'
      : isMatch
      ? 'correct'
      : 'incorrect';

    if (status === 'correct') {
      sounds.playSuccess();
    } else if (status === 'incorrect') {
      sounds.playError();
    } else {
      sounds.playTap();
    }

    setLetterHistory((prev) => [
      {
        native: currentLetterItem.char,
        typed: revealOnly ? '(Skipped)' : letterTyped.trim(),
        expected: currentLetterItem.rom,
        note: currentLetterItem.note || currentLetterItem.phonetic,
        status
      },
      ...prev
    ]);
    setLetterTyped('');
    setLetterCursor((c) => c + 1);
    setTimeout(() => activeLetterInputRef.current?.focus(), 20);
  };

  const handleSingleCitySubmit = (revealOnly = false) => {
    if (!currentCityItem) return;
    const rawInput = cityTyped.trim().toLowerCase();
    if (!rawInput && !revealOnly) return;

    const normalized = rawInput.replace(/[-']/g, ' ').replace(/\s+/g, ' ');
    const isMatch =
      !revealOnly &&
      currentCityItem.acceptedAnswers.some(
        (ans) => ans.toLowerCase() === rawInput || ans.toLowerCase() === normalized
      );

    const status: 'correct' | 'incorrect' | 'revealed' = revealOnly
      ? 'revealed'
      : isMatch
      ? 'correct'
      : 'incorrect';

    if (status === 'correct') {
      sounds.playSuccess();
    } else if (status === 'incorrect') {
      sounds.playError();
    } else {
      sounds.playTap();
    }

    setCityHistory((prev) => [
      {
        native: currentCityItem.native,
        typed: revealOnly ? '(Skipped)' : cityTyped.trim(),
        expected: currentCityItem.english,
        note: currentCityItem.regionHint,
        status
      },
      ...prev
    ]);
    setCityTyped('');
    setCityCursor((c) => c + 1);
    setTimeout(() => activeCityInputRef.current?.focus(), 20);
  };

  const scriptIntroBlocks = useMemo(() => {
    if (currentScript.introSections && currentScript.introSections.length > 0) {
      return currentScript.introSections;
    }
    const sampleVowel = currentScript.characters.find((c) => c.category === 'vowel');
    const sampleCons = currentScript.characters.find((c) => c.category === 'familiar');
    const sampleTrap = currentScript.characters.find((c) => c.category === 'trap');

    return [
      {
        title: `The structure of ${currentScript.name}`,
        paragraphs: [
          currentScript.description,
          `Writing system type: ${currentScript.type} (${currentScript.direction.toUpperCase()} reading direction, ${currentScript.speakers} speakers).`
        ]
      },
      {
        title: 'Basics of Reading & Syllables',
        paragraphs: [
          sampleVowel
            ? `Core vowels & vowel markers: for example ${sampleVowel.char} = ${sampleVowel.rom} (${sampleVowel.note || sampleVowel.phonetic}).`
            : 'Start by learning the vowel shapes and how they attach to consonants.',
          sampleCons
            ? `Familiar base consonants: for example ${sampleCons.char} = ${sampleCons.rom} (${sampleCons.note || sampleCons.phonetic}).`
            : 'Use the progressive tabs above to study each group of consonants in manageable sets.'
        ]
      },
      {
        title: 'Trap Letters & Road Sign Clues',
        paragraphs: [
          sampleTrap
            ? `Watch out for lookalike or false-friend letters! For example: ${sampleTrap.char} = ${sampleTrap.rom} (${sampleTrap.note || ''}).`
            : 'Click through the progressive tabs above: each tab shows the reference chart followed by an active 1-row typing trainer.'
        ]
      }
    ];
  }, [currentScript]);

  const currentLangSample = useMemo(() => {
    const idx = guesserOrder[guesserCursor % Math.max(1, guesserOrder.length)] ?? 0;
    return WORLD_LANGUAGE_SAMPLES[idx] || WORLD_LANGUAGE_SAMPLES[0];
  }, [guesserOrder, guesserCursor]);

  const autocompleteSuggestions = useMemo(() => {
    const q = typedLangGuess.trim().toLowerCase();
    if (!q || guesserStatus !== null) return [];
    const names = Array.from(new Set(WORLD_LANGUAGE_SAMPLES.map((s) => s.language)));
    return names.filter((n) => n.toLowerCase().includes(q)).slice(0, 5);
  }, [typedLangGuess, guesserStatus]);

  const handleLanguageGuessSubmit = (overrideGuess?: string) => {
    const raw = (overrideGuess ?? typedLangGuess).trim().toLowerCase();
    if (!raw || guesserStatus !== null) return;

    const isMatch =
      currentLangSample.language.toLowerCase() === raw ||
      currentLangSample.acceptedAnswers.some((ans) => ans.toLowerCase() === raw);

    setTypedLangGuess(overrideGuess ?? typedLangGuess);
    setGuesserStatus(isMatch ? 'correct' : 'incorrect');
    setGuesserScore((prev) => ({
      correct: prev.correct + (isMatch ? 1 : 0),
      total: prev.total + 1
    }));

    if (isMatch) {
      sounds.playSuccess();
    } else {
      sounds.playError();
    }
  };

  const handleNextLanguageSample = () => {
    sounds.playTap();
    setTypedLangGuess('');
    setGuesserStatus(null);
    setGuesserCursor((c) => c + 1);
  };

  const renderHighlightedParagraph = (paragraph: string, distinctiveChars: string[]) => {
    const cleanChars = (distinctiveChars || [])
      .map((c) => c.trim())
      .filter((c) => c.length > 0 && c.length <= 4);
    if (cleanChars.length === 0) return <span>{paragraph}</span>;

    const escaped = [...cleanChars]
      .sort((a, b) => b.length - a.length)
      .map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
    const parts = paragraph.split(regex);
    const lowerSet = new Set(cleanChars.map((c) => c.toLowerCase()));

    return parts.map((part, i) => {
      if (lowerSet.has(part.toLowerCase())) {
        return (
          <span
            key={i}
            className="text-amber-300 font-black underline decoration-amber-400/80 underline-offset-2 px-0.5 bg-amber-500/15 rounded"
          >
            {part}
          </span>
        );
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

  const filteredWorldLanguages = useMemo(() => {
    return WORLD_LANGUAGE_SAMPLES.filter((item) => {
      let matchesReg = langRegionFilter === 'All' || item.region === langRegionFilter;
      if (!matchesReg && item.countryCodes) {
        if (langRegionFilter === 'Americas') {
          matchesReg = item.countryCodes.some((c) => {
            const cont = COUNTRIES_DATABASE[c.toUpperCase()]?.continent;
            return cont === 'North America' || cont === 'South America';
          });
        } else if (langRegionFilter === 'Oceania') {
          matchesReg = item.countryCodes.some(
            (c) => COUNTRIES_DATABASE[c.toUpperCase()]?.continent === 'Oceania'
          );
        }
      }
      const matchesSearch =
        !langSearchQuery.trim() ||
        item.language.toLowerCase().includes(langSearchQuery.toLowerCase()) ||
        item.country.toLowerCase().includes(langSearchQuery.toLowerCase()) ||
        (item.countryCodes || []).some((code) =>
          COUNTRIES_DATABASE[code.toUpperCase()]?.name
            ?.toLowerCase()
            .includes(langSearchQuery.toLowerCase())
        );
      return matchesReg && matchesSearch;
    });
  }, [langRegionFilter, langSearchQuery]);

  // Build Country-by-Country Language & Dialect Overview for all 197 Sovereign Countries
  const allSovereignCountriesOverview = useMemo(() => {
    const sovereigns = Object.values(COUNTRIES_DATABASE)
      .filter((c) => !c.isTerritory)
      .sort((a, b) => a.name.localeCompare(b.name));

    return sovereigns
      .map((country) => {
        const matchedSamples = WORLD_LANGUAGE_SAMPLES.filter((s) =>
          (s.countryCodes || [s.countryCode]).some(
            (code) => code.toUpperCase() === country.id.toUpperCase()
          )
        );

        const dialectNotes = DIALECT_COMPARISON_GROUPS.flatMap((g) =>
          g.variants.filter((v) => v.countryCode === country.id)
        );

        return {
          country,
          matchedSamples,
          dialectNotes
        };
      })
      .filter((row) => {
        if (
          countryContinentFilter !== 'All' &&
          row.country.continent !== countryContinentFilter
        ) {
          return false;
        }
        if (!langSearchQuery.trim()) return true;
        const q = langSearchQuery.toLowerCase();
        return (
          row.country.name.toLowerCase().includes(q) ||
          row.country.capital.toLowerCase().includes(q) ||
          row.country.languages.some((l) => l.toLowerCase().includes(q)) ||
          row.matchedSamples.some((s) => s.language.toLowerCase().includes(q))
        );
      });
  }, [countryContinentFilter, langSearchQuery]);

  const activeDialectGroups = useMemo(() => {
    const base =
      selectedDialectId === 'all'
        ? DIALECT_COMPARISON_GROUPS
        : DIALECT_COMPARISON_GROUPS.filter((g) => g.id === selectedDialectId);

    if (!langSearchQuery.trim()) return base;
    const q = langSearchQuery.toLowerCase();
    return DIALECT_COMPARISON_GROUPS.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.variants.some(
          (v) =>
            v.region.toLowerCase().includes(q) ||
            v.uniqueClues.toLowerCase().includes(q) ||
            v.vocabularyDiffs.toLowerCase().includes(q)
        )
    );
  }, [selectedDialectId, langSearchQuery]);

  const launchGlobeLanguageGuesser = () => {
    sounds.playTap();
    if (onStartGlobeQuiz) {
      const worldRef: typeof COUNTRIES_DATABASE[0] = {
        ...COUNTRIES_DATABASE[0],
        id: 'WORLD',
        name: 'World Languages',
        lat: 20,
        lng: 0
      };
      onStartGlobeQuiz({
        country: worldRef,
        quizOption: {
          id: 'world-language-guesser',
          title: 'World Language Globe Guesser',
          description: 'Read the text sample and click any country on the 3D Globe where it is spoken',
          category: 'languages',
          geojsonFile: 'world_languages',
          levelKey: 'LANGUAGE_GUESS',
          targetCount: WORLD_LANGUAGE_SAMPLES.length,
          badge: 'World Languages',
          color: 'emerald'
        },
        selectedGroups: ['all'],
        initialMode: 'quiz',
        languageSamplesPool: WORLD_LANGUAGE_SAMPLES
      });
    }
  };

  const [isPlayingTextGuesser, setIsPlayingTextGuesser] = useState<boolean>(false);

  const letterCorrectCount = letterHistory.filter((h) => h.status === 'correct').length;
  const cityCorrectCount = cityHistory.filter((h) => h.status === 'correct').length;

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* Top Section Switcher Bar — hidden when drilling a specific script or playing Quick Text Guesser */}
      {((hubSection === 'scripts' && showScriptOverview) ||
        (hubSection === 'world-languages' && !isPlayingTextGuesser)) && (
        <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-900/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-400 shrink-0" />
            <div>
              <h1 className="text-sm sm:text-base font-black text-white tracking-tight uppercase">
                {hubSection === 'scripts'
                  ? 'World Writing Systems & Alphabets (A–Z)'
                  : 'World Languages, Country Overview & Dialects'}
              </h1>
            </div>
          </div>

          {/* Main Section Switcher */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="flex items-center gap-1 p-1 bg-slate-800/90 rounded-xl border border-slate-700/60 text-xs">
              <button
                onClick={() => {
                  sounds.playTap();
                  setHubSection('scripts');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  hubSection === 'scripts'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Alphabets &amp; Scripts
              </button>
              <button
                onClick={() => {
                  sounds.playTap();
                  setHubSection('world-languages');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  hubSection === 'world-languages'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                World Languages
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION A: ALPHABETS & SCRIPTS (OVERVIEW GRID + TRAINER) */}
      {/* ========================================================= */}
      {hubSection === 'scripts' && showScriptOverview && (
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 max-w-6xl mx-auto w-full pb-28 space-y-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Select a Writing System to Study &amp; Train
              </h2>
              <p className="text-xs text-slate-400">
                Every script includes progressive vowel/consonant/trap tabs, a 1-row active typing trainer, and 100+ real native-script districts &amp; cities.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {orderedScripts.map((s) => {
              const previewChars = s.characters
                .slice(0, 5)
                .map((c) => c.char.split(' ')[0])
                .join('  ');
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    sounds.playTap();
                    setSelectedScriptId(s.id);
                    setActiveSubTab('intro');
                    setShowScriptOverview(false);
                    resetLetterTrainer();
                    resetCityTrainer();
                  }}
                  className="text-left p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-sky-500/60 transition-all shadow-lg flex flex-col justify-between gap-3 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm sm:text-base font-black text-white group-hover:text-sky-300 transition-colors">
                        {s.name}
                      </span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-slate-800 text-sky-400 border border-slate-700">
                        {s.type}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xl font-bold text-amber-300 tracking-wider text-center font-sans">
                      {previewChars}
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {s.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{s.characters.length} Letters</span>
                    <span className="text-emerald-400 font-bold">
                      {s.cityPractice.length} Districts &amp; Cities
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {hubSection === 'scripts' && !showScriptOverview && (
        <>
          {/* Clean Single-Script Header with Back Button */}
          <div className="px-4 py-2.5 border-b border-slate-800/80 bg-slate-900/95 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  sounds.playTap();
                  setShowScriptOverview(true);
                }}
                className="px-3 py-1.5 rounded-xl text-xs bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/40 font-black flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Scripts</span>
              </button>
              <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
                {currentScript.name} Alphabet
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              {currentScript.type} • {currentScript.characters.length} Letters • {currentScript.cityPractice.length} Places
            </span>
          </div>

          {/* Progressive Sub-Tabs Bar */}
          <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-950 overflow-x-auto flex items-center gap-1.5 shrink-0 no-scrollbar">
            {[
              { id: 'intro', label: 'INTRODUCTION' },
              { id: 'vowels', label: 'VOWELS (IN SYLLABLE & ALONE)' },
              { id: 'familiar', label: 'CONSONANTS 1' },
              { id: 'trap', label: 'TRAP LETTERS' },
              { id: 'unique', label: 'CONSONANTS 2' },
              { id: 'all-practice', label: 'ALL LETTERS DRILL' },
              {
                id: 'city-practice',
                label:
                  selectedScriptId === 'telugu'
                    ? `TELANGANA & AP DISTRICTS (${currentScript.cityPractice.length})`
                    : `DISTRICTS & CITIES (${currentScript.cityPractice.length})`
              }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playTap();
                  setActiveSubTab(tab.id as ScriptSubTab);
                  resetLetterTrainer();
                }}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-black tracking-wide whitespace-nowrap transition-colors ${
                  activeSubTab === tab.id
                    ? 'bg-slate-200 text-slate-950 shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Script Content Area */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-4xl mx-auto w-full pb-28 space-y-6"
          >
            {activeSubTab === 'intro' && (
              <div className="space-y-4">
                {scriptIntroBlocks.map((sec, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2.5"
                  >
                    <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                      {sec.title}
                    </h2>
                    {sec.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                ))}

                <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-500/30 flex items-center justify-between gap-3">
                  <p className="text-xs text-sky-200">
                    Ready to practise? Select any letter tab above to view the reference chart and train in the 1-row active typing trainer below it.
                  </p>
                  <button
                    onClick={() => {
                      sounds.playTap();
                      setActiveSubTab('vowels');
                    }}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs whitespace-nowrap flex items-center gap-1.5"
                  >
                    <span>Start Vowels &amp; Syllables</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {['vowels', 'familiar', 'trap', 'unique', 'all-practice'].includes(activeSubTab) && (
              <div className="space-y-6">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-sky-400">
                      1. Reference Chart ({activeTabCharacters.length} Letters / Syllables)
                    </h3>
                    <button
                      onClick={() => {
                        sounds.playTap();
                        setShowAllLettersRef((v) => !v);
                      }}
                      className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-sky-400" />
                      <span>{showAllLettersRef ? 'Show Reference Chart' : 'Hide Reference Chart'}</span>
                    </button>
                  </div>

                  {!showAllLettersRef ? (
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-lg">
                      <div className="grid grid-cols-12 px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400">
                        <div className="col-span-4">Script</div>
                        <div className="col-span-4">Latin</div>
                        <div className="col-span-4">GeoGuessr Mnemonic / Note</div>
                      </div>

                      <div className="divide-y divide-slate-800/70">
                        {activeTabCharacters.map((c, idx) => (
                          <div
                            key={idx}
                            className="grid grid-cols-12 items-center px-4 py-2.5 hover:bg-slate-800/40 transition-colors"
                          >
                            <div className="col-span-4 flex items-center gap-2.5">
                              <span className="text-xl sm:text-2xl font-bold text-white font-sans">
                                {c.char}
                              </span>
                            </div>
                            <div className="col-span-4">
                              <span className="text-sm font-black text-sky-400 font-mono">
                                {c.rom}
                              </span>
                            </div>
                            <div className="col-span-4 text-xs text-slate-300">
                              {c.note || c.phonetic}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-400">
                        2. Active 1-Row Typing Trainer (Type Latin &amp; Press Enter)
                      </h3>
                      <p className="text-xs text-slate-400">
                        Type the Latin sound and press{' '}
                        <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-sky-300">
                          Enter
                        </kbd>{' '}
                        — it immediately advances to the next letter and logs your result below.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400 font-bold">
                        Score: {letterCorrectCount} / {letterHistory.length}
                      </span>
                      <button
                        onClick={() => {
                          sounds.playTap();
                          setShuffleSeed((s) => s + 1);
                          resetLetterTrainer();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5"
                      >
                        <Shuffle className="w-3.5 h-3.5 text-sky-400" />
                        <span>Shuffle</span>
                      </button>
                      <button
                        onClick={() => {
                          sounds.playTap();
                          resetLetterTrainer();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                        <span>Reset</span>
                      </button>
                    </div>
                  </div>

                  {currentLetterItem && (
                    <div
                      className={`p-5 rounded-2xl border-2 bg-slate-900 shadow-xl transition-all duration-200 ${
                        letterHistory[0]?.status === 'correct'
                          ? 'border-emerald-500/80 shadow-emerald-500/10'
                          : letterHistory[0]?.status === 'incorrect'
                          ? 'border-rose-500/90 shadow-rose-500/20 bg-rose-950/20'
                          : 'border-sky-500/50'
                      }`}
                    >
                      {letterHistory[0] && (
                        <div
                          className={`mb-3 px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center justify-between gap-2 ${
                            letterHistory[0].status === 'correct'
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                              : letterHistory[0].status === 'incorrect'
                              ? 'bg-rose-500/20 border-rose-500/50 text-rose-200'
                              : 'bg-slate-800/80 border-slate-700 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            {letterHistory[0].status === 'correct' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            )}
                            <span>
                              {letterHistory[0].status === 'correct'
                                ? `Correct! ${letterHistory[0].native} = ${letterHistory[0].expected}`
                                : letterHistory[0].status === 'incorrect'
                                ? `Wrong! For "${letterHistory[0].native}" you typed "${letterHistory[0].typed}" — Correct: ${letterHistory[0].expected}`
                                : `Skipped "${letterHistory[0].native}" — Answer: ${letterHistory[0].expected}`}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4">
                        <div className="sm:col-span-4 flex flex-col items-center sm:items-start">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                            Letter {(letterCursor % trainingRows.length) + 1} of {trainingRows.length}
                          </span>
                          <span className="text-4xl sm:text-5xl font-black text-white font-sans mt-1">
                            {currentLetterItem.char}
                          </span>
                        </div>

                        <div className="sm:col-span-5">
                          <input
                            ref={activeLetterInputRef}
                            type="text"
                            value={letterTyped}
                            onChange={(e) => setLetterTyped(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSingleLetterSubmit(false);
                              }
                            }}
                            placeholder="Type Latin & press Enter..."
                            className="w-full px-4 py-3 rounded-xl text-sm sm:text-base font-bold bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-sky-400"
                          />
                        </div>

                        <div className="sm:col-span-3 flex items-center gap-2 justify-end">
                          <button
                            onClick={() => handleSingleLetterSubmit(false)}
                            disabled={!letterTyped.trim()}
                            className="px-4 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white font-black text-xs whitespace-nowrap"
                          >
                            Enter
                          </button>
                          <button
                            onClick={() => handleSingleLetterSubmit(true)}
                            className="px-3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs whitespace-nowrap"
                          >
                            Skip / Reveal
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {letterHistory.length > 0 && (
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-lg">
                      <div className="grid grid-cols-12 px-4 py-2 bg-slate-950 border-b border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400">
                        <div className="col-span-3">Script</div>
                        <div className="col-span-4">Your Answer</div>
                        <div className="col-span-5">Correct Answer &amp; Note</div>
                      </div>
                      <div className="divide-y divide-slate-800/70 max-h-72 overflow-y-auto">
                        {letterHistory.map((item, idx) => (
                          <div
                            key={idx}
                            className={`grid grid-cols-12 items-center px-4 py-2.5 text-xs ${
                              item.status === 'correct'
                                ? 'bg-emerald-950/25'
                                : item.status === 'incorrect'
                                ? 'bg-rose-950/25'
                                : 'bg-slate-900/60'
                            }`}
                          >
                            <div className="col-span-3 text-xl font-bold text-white font-sans">
                              {item.native}
                            </div>
                            <div className="col-span-4 flex items-center gap-1.5 font-mono font-bold">
                              {item.status === 'correct' && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              )}
                              {item.status === 'incorrect' && (
                                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                              )}
                              <span
                                className={
                                  item.status === 'correct'
                                    ? 'text-emerald-300'
                                    : item.status === 'incorrect'
                                    ? 'text-rose-300'
                                    : 'text-slate-400'
                                }
                              >
                                {item.typed}
                              </span>
                            </div>
                            <div className="col-span-5">
                              <span className="font-mono font-black text-sky-300">
                                {item.expected}
                              </span>
                              {item.note && (
                                <span className="text-slate-400 ml-2 text-[11px]">
                                  ({item.note})
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSubTab === 'city-practice' && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-400" />
                      <span>
                        {currentScript.name} — {currentScript.cityPractice.length} Native Districts, Cities &amp; Villages
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Type the English/Latin district or city name and press{' '}
                      <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-sky-300">
                        Enter
                      </kbd>{' '}
                      to validate and immediately advance to the next place.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400 font-bold">
                      Score: {cityCorrectCount} / {cityHistory.length}
                    </span>
                    <button
                      onClick={() => {
                        sounds.playTap();
                        setCityShuffleSeed((s) => s + 1);
                        resetCityTrainer();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5"
                    >
                      <Shuffle className="w-3.5 h-3.5 text-sky-400" />
                      <span>Shuffle</span>
                    </button>
                    <button
                      onClick={() => {
                        sounds.playTap();
                        setShowAllCitiesList((v) => !v);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-sky-400" />
                      <span>{showAllCitiesList ? 'Hide Full List' : 'View All Places'}</span>
                    </button>
                    <button
                      onClick={() => {
                        sounds.playTap();
                        resetCityTrainer();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>

                {currentCityItem && (
                  <div
                    className={`p-5 rounded-2xl border-2 bg-slate-900 shadow-xl transition-all duration-200 ${
                      cityHistory[0]?.status === 'correct'
                        ? 'border-emerald-500/80 shadow-emerald-500/10'
                        : cityHistory[0]?.status === 'incorrect'
                        ? 'border-rose-500/90 shadow-rose-500/20 bg-rose-950/20'
                        : 'border-emerald-500/50'
                    }`}
                  >
                    {cityHistory[0] && (
                      <div
                        className={`mb-3 px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center justify-between gap-2 ${
                          cityHistory[0].status === 'correct'
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                            : cityHistory[0].status === 'incorrect'
                            ? 'bg-rose-500/20 border-rose-500/50 text-rose-200'
                            : 'bg-slate-800/80 border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          {cityHistory[0].status === 'correct' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          )}
                          <span>
                            {cityHistory[0].status === 'correct'
                              ? `Correct! ${cityHistory[0].native} = ${cityHistory[0].expected}`
                              : cityHistory[0].status === 'incorrect'
                              ? `Wrong! For "${cityHistory[0].native}" you typed "${cityHistory[0].typed}" — Correct: ${cityHistory[0].expected}`
                              : `Skipped "${cityHistory[0].native}" — Answer: ${cityHistory[0].expected}`}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4">
                      <div className="sm:col-span-5 flex flex-col items-center sm:items-start">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                          Place {(cityCursor % cityTrainingRows.length) + 1} of {cityTrainingRows.length}
                        </span>
                        <span className="text-2xl sm:text-3xl font-black text-white font-sans mt-1">
                          {currentCityItem.native}
                        </span>
                      </div>

                      <div className="sm:col-span-4">
                        <input
                          ref={activeCityInputRef}
                          type="text"
                          value={cityTyped}
                          onChange={(e) => setCityTyped(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleSingleCitySubmit(false);
                            }
                          }}
                          placeholder="Type district/city & press Enter..."
                          className="w-full px-4 py-3 rounded-xl text-sm font-bold bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-400"
                        />
                      </div>

                      <div className="sm:col-span-3 flex items-center gap-2 justify-end">
                        <button
                          onClick={() => handleSingleCitySubmit(false)}
                          disabled={!cityTyped.trim()}
                          className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-black text-xs whitespace-nowrap"
                        >
                          Enter
                        </button>
                        <button
                          onClick={() => handleSingleCitySubmit(true)}
                          className="px-3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs whitespace-nowrap"
                        >
                          Skip / Reveal
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {cityHistory.length > 0 && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl">
                    <div className="grid grid-cols-12 px-4 py-2 bg-slate-950 border-b border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400">
                      <div className="col-span-4">Native Script</div>
                      <div className="col-span-4">Your Answer</div>
                      <div className="col-span-4">Correct Answer &amp; Region</div>
                    </div>
                    <div className="divide-y divide-slate-800/70 max-h-80 overflow-y-auto">
                      {cityHistory.map((item, idx) => (
                        <div
                          key={idx}
                          className={`grid grid-cols-12 items-center px-4 py-2.5 text-xs ${
                            item.status === 'correct'
                              ? 'bg-emerald-950/25'
                              : item.status === 'incorrect'
                              ? 'bg-rose-950/25'
                              : 'bg-slate-900/60'
                          }`}
                        >
                          <div className="col-span-4 text-sm sm:text-base font-bold text-white font-sans break-words pr-2 min-w-0">
                            {item.native}
                          </div>
                          <div className="col-span-4 flex items-center gap-1.5 font-mono font-bold min-w-0 break-words pr-1">
                            {item.status === 'correct' && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                            {item.status === 'incorrect' && (
                              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            )}
                            <span
                              className={
                                item.status === 'correct'
                                  ? 'text-emerald-300'
                                  : item.status === 'incorrect'
                                  ? 'text-rose-300'
                                  : 'text-slate-400'
                              }
                            >
                              {item.typed}
                            </span>
                          </div>
                          <div className="col-span-4 min-w-0 break-words">
                            <span className="font-bold text-sky-300">{item.expected}</span>
                            {item.note && (
                              <p className="text-[10px] text-slate-400">{item.note}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {showAllCitiesList && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl">
                    <div className="grid grid-cols-12 px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400">
                      <div className="col-span-4">Native Script</div>
                      <div className="col-span-4">English Name</div>
                      <div className="col-span-4">Region</div>
                    </div>
                    <div className="divide-y divide-slate-800/70 max-h-96 overflow-y-auto">
                      {currentScript.cityPractice.map((city, idx) => (
                        <div key={idx} className="grid grid-cols-12 items-center px-4 py-2.5 text-xs">
                          <div className="col-span-4 text-sm sm:text-base font-bold text-white font-sans break-words pr-2 min-w-0">
                            {city.native}
                          </div>
                          <div className="col-span-4 font-bold text-sky-400 break-words pr-1">{city.english}</div>
                          <div className="col-span-4 text-slate-400 break-words">{city.regionHint}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* SECTION B1: SEPARATE QUICK TEXT GUESSER QUIZ SCREEN        */}
      {/* ========================================================= */}
      {hubSection === 'world-languages' && isPlayingTextGuesser && (
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
          {/* Quiz Header Bar */}
          <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/95 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  sounds.playTap();
                  setIsPlayingTextGuesser(false);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
              >
                <span>← Back to World Languages</span>
              </button>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
                  Quick Text Guesser Quiz
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-black">
                Score: {guesserScore.correct} / {guesserScore.total}
                {guesserScore.total > 0
                  ? ` (${Math.round((guesserScore.correct / guesserScore.total) * 100)}%)`
                  : ''}
              </span>
              {guesserScore.total > 0 && (
                <button
                  onClick={() => {
                    sounds.playTap();
                    setGuesserScore({ correct: 0, total: 0 });
                    handleNextLanguageSample();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold border border-slate-700"
                >
                  Reset Score
                </button>
              )}
            </div>
          </div>

          {/* Dedicated Quiz Arena (No Reference Encyclopedia Visible!) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-3xl mx-auto w-full pb-28 flex flex-col justify-center">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-400 block">
                    Identify the Language or Country
                  </span>
                  <p className="text-xs text-slate-400">
                    Read the authentic text sample below and type either the language name or a country where it is spoken.
                  </p>
                </div>
                <button
                  onClick={handleNextLanguageSample}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold text-xs flex items-center gap-1.5 border border-slate-700"
                >
                  <span>Skip / Next Text</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 shadow-inner">
                <p className="text-lg sm:text-xl font-serif text-white leading-relaxed">
                  "{guesserStatus !== null
                    ? renderHighlightedParagraph(
                        currentLangSample.sampleText,
                        currentLangSample.distinctiveChars
                      )
                    : currentLangSample.sampleText}"
                </p>
              </div>

              <div className="space-y-2.5 relative">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (guesserStatus !== null) {
                      handleNextLanguageSample();
                    } else {
                      handleLanguageGuessSubmit();
                    }
                  }}
                  className="flex flex-wrap sm:flex-nowrap items-center gap-2.5"
                >
                  <input
                    type="text"
                    value={typedLangGuess}
                    onChange={(e) => setTypedLangGuess(e.target.value)}
                    disabled={guesserStatus !== null}
                    autoFocus
                    placeholder="Type language or country name (e.g. French, Dutch, Estonian, Polish, Telugu)..."
                    className="w-full flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-semibold"
                  />

                  {guesserStatus === null ? (
                    <>
                      <button
                        type="submit"
                        disabled={!typedLangGuess.trim()}
                        className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-black text-xs sm:text-sm shrink-0 shadow-lg"
                      >
                        Check Answer
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playTap();
                          setGuesserStatus('revealed');
                        }}
                        className="px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs shrink-0"
                      >
                        Reveal
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNextLanguageSample}
                      className="px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shrink-0 shadow-lg"
                    >
                      <span>Next Language</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </form>

                {autocompleteSuggestions.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-mono text-slate-400 mr-1">Suggestions:</span>
                    {autocompleteSuggestions.map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => handleLanguageGuessSubmit(sug)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold text-slate-200 border border-slate-700 transition-colors"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {guesserStatus !== null && (
                <div
                  className={`p-4 sm:p-5 rounded-2xl border space-y-2.5 ${
                    guesserStatus === 'correct'
                      ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                      : guesserStatus === 'incorrect'
                      ? 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                      : 'bg-sky-950/30 border-sky-500/50 text-sky-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {guesserStatus === 'correct' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {guesserStatus === 'incorrect' && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <CountryFlag
                      countryCode={currentLangSample.countryCode}
                      className="w-5 h-3.5 rounded-sm"
                    />
                    <span className="text-sm font-black text-white">
                      {currentLangSample.language} ({currentLangSample.country})
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {currentLangSample.clue}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentLangSample.distinctiveChars.map((ch, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 border border-amber-500/40 text-amber-300 font-bold text-xs font-mono"
                      >
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION B2: WORLD LANGUAGES (LAUNCHERS + 3 SUB-MODES)      */}
      {/* ========================================================= */}
      {hubSection === 'world-languages' && !isPlayingTextGuesser && (
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 max-w-5xl mx-auto w-full pb-28 space-y-5"
        >
          {/* Quiz Mode Launchers: 3D Globe Guesser + Separate Quick Text Guesser */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
            {onStartGlobeQuiz && (
              <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-sky-950/80 border border-emerald-500/40 shadow-xl flex flex-col justify-between gap-4 min-w-0 overflow-hidden">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <Globe2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <h2 className="text-base font-black text-white">
                      World Language 3D Globe Guesser
                    </h2>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Read an authentic text snippet, click any country on the 3D Globe where that language is spoken, and inspect highlighted unique letter clues!
                  </p>
                </div>
                <button
                  onClick={launchGlobeLanguageGuesser}
                  className="w-full sm:w-auto self-start px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm whitespace-nowrap flex items-center justify-center gap-2 shadow-lg"
                >
                  <Globe2 className="w-4 h-4" />
                  <span>Play on 3D Globe</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-950/75 via-slate-900 to-slate-900 border border-amber-500/40 shadow-xl flex flex-col justify-between gap-4 min-w-0 overflow-hidden">
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                    <h2 className="text-base font-black text-white truncate">
                      Quick Text Guesser Quiz
                    </h2>
                  </div>
                  {guesserScore.total > 0 && (
                    <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-mono font-bold shrink-0">
                      {guesserScore.correct}/{guesserScore.total}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Open a dedicated quiz menu to identify languages or countries from authentic text paragraphs with autocomplete &amp; diacritic clue breakdowns!
                </p>
              </div>
              <button
                onClick={() => {
                  sounds.playTap();
                  setIsPlayingTextGuesser(true);
                }}
                className="w-full sm:w-auto self-start px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm whitespace-nowrap flex items-center justify-center gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                <span>Play Text Guesser Quiz</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3-Mode Switcher for Reference Encyclopedia: By Language | Every Country Overview | Dialect & Regional Differences */}
          <div
            ref={worldLangSubTabsRef}
            className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800 scroll-mt-3 min-w-0 max-w-full overflow-hidden"
          >
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              <button
                onClick={() => {
                  sounds.playTap();
                  setWorldLangSubMode('languages');
                  scrollToWorldLangSubTabBar();
                }}
                className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                  worldLangSubMode === 'languages'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span>By Language</span>
              </button>

              <button
                onClick={() => {
                  sounds.playTap();
                  setWorldLangSubMode('countries');
                  scrollToWorldLangSubTabBar();
                }}
                className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                  worldLangSubMode === 'countries'
                    ? 'bg-sky-500 text-slate-950 shadow'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Compass className="w-3.5 h-3.5 shrink-0" />
                <span>Every Country Overview</span>
              </button>

              <button
                onClick={() => {
                  sounds.playTap();
                  setWorldLangSubMode('dialects');
                  scrollToWorldLangSubTabBar();
                }}
                className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                  worldLangSubMode === 'dialects'
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <SplitSquareVertical className="w-3.5 h-3.5 shrink-0" />
                <span>Dialect &amp; Regional Differences</span>
              </button>
            </div>

            <div className="relative w-full sm:w-64 min-w-0">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={langSearchQuery}
                onChange={(e) => setLangSearchQuery(e.target.value)}
                placeholder="Search language or country..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* SUB-MODE 1: BY LANGUAGE (WITH ALL CONTINENTS FILTER) */}
          {worldLangSubMode === 'languages' && (
            <div className="space-y-4 min-w-0 max-w-full overflow-x-hidden">
              <div className="flex items-center gap-1.5 w-full max-w-full min-w-0 overflow-x-auto no-scrollbar">
                {['All', 'Europe', 'Asia', 'Middle East & Africa', 'Americas', 'Oceania'].map(
                  (reg) => (
                    <button
                      key={reg}
                      onClick={() => {
                        sounds.playTap();
                        setLangRegionFilter(reg);
                        scrollToWorldLangSubTabBar();
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                        langRegionFilter === reg
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {reg}
                    </button>
                  )
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
                {filteredWorldLanguages.map((lang) => (
                  <div
                    key={lang.id}
                    className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between gap-3 shadow-lg min-w-0 overflow-hidden break-words"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <CountryFlag
                            countryCode={lang.countryCode}
                            className="w-5 h-3.5 rounded-sm shrink-0"
                          />
                          <h3 className="text-base font-black text-white">{lang.language}</h3>
                          <span className="text-xs text-slate-400">({lang.country})</span>
                        </div>
                      </div>

                      {/* Flags of all countries speaking this language */}
                      {lang.countryCodes && lang.countryCodes.length > 1 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          <span className="text-[10px] font-mono text-slate-400">
                            Spoken in ({lang.countryCodes.length}):
                          </span>
                          {lang.countryCodes.slice(0, 14).map((iso) => {
                            const cObj = COUNTRIES_DATABASE[iso.toUpperCase()];
                            return (
                              <span
                                key={iso}
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-300"
                              >
                                <CountryFlag countryCode={iso} size="sm" />
                                <span>{cObj?.name || iso}</span>
                              </span>
                            );
                          })}
                          {lang.countryCodes.length > 14 && (
                            <span className="text-[10px] font-mono text-sky-400">
                              +{lang.countryCodes.length - 14} more
                            </span>
                          )}
                        </div>
                      )}

                      <p className="text-xs text-slate-300 leading-relaxed">{lang.clue}</p>

                      <div className="flex flex-wrap gap-1.5">
                        {lang.distinctiveChars.slice(0, 12).map((ch, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-amber-500/30 text-amber-300 font-bold text-xs font-mono"
                          >
                            {ch}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                      <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-serif">
                        {renderHighlightedParagraph(lang.sampleText, lang.distinctiveChars)}
                      </p>
                      <p className="text-[11px] text-slate-400 italic">
                        "{lang.englishTranslation}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-MODE 2: EVERY COUNTRY OVERVIEW (ALL 197 SOVEREIGN COUNTRIES) */}
          {worldLangSubMode === 'countries' && (
            <div className="space-y-4 min-w-0 max-w-full overflow-x-hidden">
              <div className="flex items-center gap-1.5 w-full max-w-full min-w-0 overflow-x-auto no-scrollbar">
                {[
                  'All',
                  'Africa',
                  'Asia',
                  'Europe',
                  'North America',
                  'Oceania',
                  'South America'
                ].map((cont) => (
                  <button
                    key={cont}
                    onClick={() => {
                      sounds.playTap();
                      setCountryContinentFilter(cont);
                      scrollToWorldLangSubTabBar();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                      countryContinentFilter === cont
                        ? 'bg-sky-500 text-slate-950'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cont}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 min-w-0">
                {allSovereignCountriesOverview.map(({ country, matchedSamples, dialectNotes }) => (
                  <div
                    key={country.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-2.5 shadow-lg min-w-0 overflow-hidden break-words"
                  >
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <CountryFlag countryCode={country.id} size="md" />
                        <div className="min-w-0">
                          <h3 className="text-sm font-black text-white truncate">{country.name}</h3>
                          <p className="text-[11px] text-slate-400">
                            {country.continent} · Capital: {country.capital}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-sky-400 font-bold px-2 py-0.5 rounded bg-slate-950 border border-slate-800 shrink-0">
                        {country.id}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-mono uppercase text-slate-400">
                          Official / Spoken:
                        </span>
                        {country.languages.map((l) => (
                          <span
                            key={l}
                            className="px-2 py-0.5 rounded-md bg-sky-500/15 border border-sky-500/30 text-sky-300 font-bold text-[11px]"
                          >
                            {l}
                          </span>
                        ))}
                      </div>

                      {matchedSamples.length > 0 && (
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                          <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                            Script &amp; Letter Clues:
                          </span>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            {matchedSamples[0].clue}
                          </p>
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {matchedSamples[0].distinctiveChars.slice(0, 8).map((ch, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded bg-slate-900 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold"
                              >
                                {ch}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {dialectNotes.length > 0 && (
                        <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                          <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                            Regional Dialect &amp; Signage Clues:
                          </span>
                          <p className="text-[11px] text-slate-200 leading-relaxed">
                            {dialectNotes[0].uniqueClues}
                          </p>
                          <p className="text-[10px] text-emerald-300 font-mono break-words">
                            Words: {dialectNotes[0].vocabularyDiffs}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-MODE 3: COMPACT DIALECT & REGIONAL DIFFERENCES GUIDE (WITH QUICK LANGUAGE SELECTOR PILLS) */}
          {worldLangSubMode === 'dialects' && (
            <div className="space-y-4 min-w-0 max-w-full overflow-x-hidden">
              {/* Compact Language Pill Selector so users don't have to scroll endlessly */}
              <div className="flex items-center gap-1.5 w-full max-w-full min-w-0 overflow-x-auto no-scrollbar">
                {DIALECT_COMPARISON_GROUPS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => {
                      sounds.playTap();
                      setSelectedDialectId(g.id);
                      scrollToWorldLangSubTabBar();
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap border shrink-0 ${
                      selectedDialectId === g.id
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
                    }`}
                  >
                    {g.shortLabel}
                  </button>
                ))}
                <button
                  onClick={() => {
                    sounds.playTap();
                    setSelectedDialectId('all');
                    scrollToWorldLangSubTabBar();
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap border shrink-0 ${
                    selectedDialectId === 'all'
                      ? 'bg-slate-200 text-slate-950 border-white shadow'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  Show All
                </button>
              </div>

              {activeDialectGroups.map((group) => (
                <div
                  key={group.id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-3.5 min-w-0 overflow-hidden break-words"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-white">
                        {group.title}
                      </h3>
                      <p className="text-xs text-slate-400">{group.subtitle}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold">
                      {group.variants.length} Regional Variants
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {group.variants.map((v) => (
                      <div
                        key={v.region}
                        className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <CountryFlag countryCode={v.countryCode} size="sm" />
                          <span className="text-xs sm:text-sm font-black text-white">
                            {v.region}
                          </span>
                        </div>
                        <div className="space-y-1.5 text-xs">
                          <p className="text-slate-300 leading-snug">
                            <span className="font-bold text-sky-400">Street Terms: </span>
                            {v.streetTerms}
                          </p>
                          <p className="text-slate-300 leading-snug">
                            <span className="font-bold text-amber-400">Key Clues: </span>
                            {v.uniqueClues}
                          </p>
                          <p className="text-slate-300 leading-snug">
                            <span className="font-bold text-emerald-400">Dialect Words: </span>
                            {v.vocabularyDiffs}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
