export interface SubdivisionQuizOption {
  id: string;
  title: string;
  description: string;
  category: 'adm1' | 'adm2' | 'adm3' | 'areacodes' | 'flags' | 'extra' | 'visual' | 'cities' | 'languages';
  geojsonFile: string;
  levelKey: 'NAME_1' | 'NAME_2' | 'NAME_3' | 'NAME_4' | 'MACRO_REGION' | 'AreaCode' | 'auto' | 'CITY_PIN' | 'name' | 'code' | 'COUNTRY' | 'COUNTRY_FLAG' | 'COUNTRY_CAPITAL' | 'EXTRA' | 'LANGUAGE_GUESS';
  filterType?: '2digit' | '3digit' | 'all';
  targetCount: number;
  badge: string;
  color: string;
  availableLevels?: SubdivisionQuizOption[];
}

export interface CountrySubdivisionConfig {
  countryCode: string;
  countryName: string;
  quizzes: SubdivisionQuizOption[];
}

export const COUNTRY_SUBDIVISION_REGISTRY: Record<string, CountrySubdivisionConfig> = {
  BE: {
    countryCode: 'BE',
    countryName: 'Belgium',
    quizzes: [
      {
        id: 'be-adm1',
        title: 'Level 1: Regions',
        description: 'Map tap quiz for the 3 official Regions of Belgium (Flanders, Wallonia, Brussels).',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/belgium_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 3,
        badge: 'ADM1',
        color: 'sky'
      },
      {
        id: 'be-adm2',
        title: 'Level 2: 10 Provinces',
        description: 'Map tap quiz for the 10 Belgian Provinces & Brussels Capital Region.',
        category: 'adm2',
        geojsonFile: '/maps/subdivisions/belgium_adm2.geojson',
        levelKey: 'NAME_2',
        targetCount: 11,
        badge: 'ADM2',
        color: 'indigo'
      },
      {
        id: 'be-adm3',
        title: 'Level 3: 43 Arrondissements',
        description: 'Detailed GADM map tap quiz for all 43 administrative arrondissements.',
        category: 'adm3',
        geojsonFile: '/maps/subdivisions/belgium_adm3.geojson',
        levelKey: 'NAME_3',
        targetCount: 43,
        badge: 'ADM3',
        color: 'purple'
      },
      {
        id: 'be-gemeentes',
        title: 'Level 4: 581 Gemeenten (Municipalities)',
        description: 'Complete map quiz for all 581 Belgian municipalities. Filter by province or master all!',
        category: 'adm3',
        geojsonFile: '/maps/subdivisions/be_gemeentes.geojson',
        levelKey: 'NAME_4',
        targetCount: 581,
        badge: 'Gemeenten',
        color: 'rose'
      },
      {
        id: 'be-ac-2',
        title: 'Area Codes: 2-Digit Zones',
        description: 'Major regional telephone zones: 02 (Brussels), 03 (Antwerp), 04 (Liège), 09 (Ghent).',
        category: 'areacodes',
        geojsonFile: '/maps/subdivisions/belgium_areacodes.geojson',
        levelKey: 'AreaCode',
        filterType: '2digit',
        targetCount: 4,
        badge: '2-Digit Tel',
        color: 'emerald'
      },
      {
        id: 'be-ac-3',
        title: 'Area Codes: 3-Digit Zones',
        description: 'All 36 secondary telephone dialling zones (016 Leuven, 011 Hasselt, 050 Brugge...).',
        category: 'areacodes',
        geojsonFile: '/maps/subdivisions/belgium_areacodes.geojson',
        levelKey: 'AreaCode',
        filterType: '3digit',
        targetCount: 36,
        badge: '3-Digit Tel',
        color: 'emerald'
      },
      {
        id: 'be-ac-all',
        title: 'Area Codes: All 40 Zones',
        description: 'Full map mastery of all Belgian domestic telephone area codes.',
        category: 'areacodes',
        geojsonFile: '/maps/subdivisions/belgium_areacodes.geojson',
        levelKey: 'AreaCode',
        filterType: 'all',
        targetCount: 40,
        badge: 'All Tel Zones',
        color: 'teal'
      },
      {
        id: 'be-flags',
        title: '11 Provincial & Regional Flags',
        description: 'Identify the official flags of all 10 Belgian provinces and the Brussels Capital Region.',
        category: 'flags',
        geojsonFile: '/maps/subdivisions/belgium_adm2.geojson',
        levelKey: 'NAME_2',
        targetCount: 11,
        badge: 'Province Flags',
        color: 'amber'
      }
    ]
  },
  FR: {
    countryCode: 'FR',
    countryName: 'France',
    quizzes: [
      {
        id: 'fr-adm1',
        title: 'Level 1: 13 Regions',
        description: 'Map tap quiz for the 13 metropolitan administrative regions of France.',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/france_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 13,
        badge: 'ADM1',
        color: 'sky'
      },
      {
        id: 'fr-adm2',
        title: 'Level 2: 96 Departments',
        description: 'Full map tap quiz for all 96 mainland French departments.',
        category: 'adm2',
        geojsonFile: '/maps/subdivisions/france_adm2.geojson',
        levelKey: 'NAME_2',
        targetCount: 96,
        badge: 'ADM2',
        color: 'indigo'
      },
      {
        id: 'fr-areacodes',
        title: 'Telephone Area Codes',
        description: 'Official 3-digit French telephone area code routing zones.',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/fr_areacodes_3.geojson',
        levelKey: 'AreaCode',
        targetCount: 71,
        badge: 'Area Codes',
        color: 'emerald'
      },
      {
        id: 'fr-extra-deptnum',
        title: 'Departments by Number',
        description: 'Identify departments by their 2-digit official code (e.g. 75, 13, 69, 33).',
        category: 'extra',
        geojsonFile: '/maps/subdivisions/france_adm2.geojson',
        levelKey: 'NAME_2',
        targetCount: 96,
        badge: 'Numbers',
        color: 'rose'
      }
    ]
  },
  DE: {
    countryCode: 'DE',
    countryName: 'Germany',
    quizzes: [
      {
        id: 'de-adm1',
        title: 'Level 1: 16 Bundesländer',
        description: 'Map tap quiz for all 16 federal states of Germany.',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/germany_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 16,
        badge: 'ADM1',
        color: 'sky'
      },
      {
        id: 'de-landkreise',
        title: 'Level 2: 401 Landkreise & Kreisfreie Städte',
        description: 'Complete map quiz for all 401 German districts and independent cities. Filter by state or master all!',
        category: 'adm2',
        geojsonFile: '/maps/subdivisions/de_landkreise.geojson',
        levelKey: 'NAME_2',
        targetCount: 401,
        badge: 'Landkreise',
        color: 'indigo'
      },
      {
        id: 'de-areacodes',
        title: 'Vorwahl Telephone Codes',
        description: 'German 2-digit Vorwahl telephone area codes.',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/de_areacodes_2.geojson',
        levelKey: 'AreaCode',
        targetCount: 74,
        badge: 'Vorwahl',
        color: 'emerald'
      },
      {
        id: 'de-extra-kfz',
        title: 'KFZ License Plates',
        description: 'German car license plate city prefixes (B, M, HH, K, F, S, D, L, HB).',
        category: 'extra',
        geojsonFile: '/maps/subdivisions/germany_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 16,
        badge: 'Plates',
        color: 'rose'
      },
      {
        id: 'de-flags',
        title: '16 State Flags (Bundesländer)',
        description: 'Identify the official state flags & coats of arms of all 16 German Bundesländer (Bayern, Berlin, Brandenburg, Niedersachsen, NRW, Baden-Württemberg...).',
        category: 'flags',
        geojsonFile: '/maps/subdivisions/germany_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 16,
        badge: 'State Flags',
        color: 'amber'
      }
    ]
  },
  NL: {
    countryCode: 'NL',
    countryName: 'Netherlands',
    quizzes: [
      {
        id: 'nl-adm1',
        title: 'Level 1: 12 Provinces',
        description: 'Map tap quiz for all 12 Dutch provinces.',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/netherlands_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 12,
        badge: 'ADM1',
        color: 'sky'
      },
      {
        id: 'nl-gemeenten',
        title: 'Level 2: 342 Gemeenten',
        description: 'Map tap quiz for all 342 Dutch municipalities across all 12 provinces. Learn province-by-province!',
        category: 'adm2',
        geojsonFile: '/maps/subdivisions/nl_gemeenten.geojson',
        levelKey: 'NAME_2',
        targetCount: 342,
        badge: 'Gemeenten',
        color: 'indigo'
      },
      {
        id: 'nl-areacodes',
        title: 'Netnummer Telephone Codes',
        description: 'Dutch netnummer area codes (010, 020, 030, 040, 070...).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/nl_areacodes.geojson',
        levelKey: 'AreaCode',
        targetCount: 48,
        badge: 'Netnummers',
        color: 'emerald'
      },
      {
        id: 'nl-flags',
        title: '12 Provincial Flags',
        description: 'Identify the official flags of all 12 Dutch provinces (Friesland pompeblêden, Noord-Brabant checkerboard, Groningen cross, Zeeland, Gelderland...).',
        category: 'flags',
        geojsonFile: '/maps/subdivisions/netherlands_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 12,
        badge: 'Province Flags',
        color: 'amber'
      }
    ]
  },
  ES: {
    countryCode: 'ES',
    countryName: 'Spain',
    quizzes: [
      {
        id: 'es-adm1',
        title: 'Level 1: Autonomous Communities',
        description: 'Map tap quiz for the 17 Autonomous Communities + 2 Autonomous Cities.',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/spain_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 17,
        badge: 'ADM1',
        color: 'sky'
      },
      {
        id: 'es-adm2',
        title: 'Level 2: 50 Provinces',
        description: 'Map tap quiz for the 50 provinces of Spain.',
        category: 'adm2',
        geojsonFile: '/maps/subdivisions/spain_adm2.geojson',
        levelKey: 'NAME_2',
        targetCount: 50,
        badge: 'ADM2',
        color: 'indigo'
      },
      {
        id: 'es-areacodes',
        title: 'Provincial Telephone Codes',
        description: 'Spanish 2-digit telephone area codes (91 Madrid, 93 Barcelona...).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/es_areacodes.geojson',
        levelKey: 'AreaCode',
        targetCount: 50,
        badge: 'Area Codes',
        color: 'emerald'
      },
      {
        id: 'es-flags',
        title: '18 Autonomous Community Flags',
        description: 'Identify the official flags of all 17 Spanish Autonomous Communities + Ceuta & Melilla (Andalucía, Cataluña, Galicia, País Vasco, Madrid, Canarias...).',
        category: 'flags',
        geojsonFile: '/maps/subdivisions/spain_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 18,
        badge: 'Community Flags',
        color: 'amber'
      }
    ]
  },
  US: {
    countryCode: 'US',
    countryName: 'United States',
    quizzes: [
      {
        id: 'us-adm1',
        title: 'Level 1: 50 States',
        description: 'Map tap quiz for all 50 states of the USA.',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/usa_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 50,
        badge: '50 States',
        color: 'sky'
      },
      {
        id: 'us-areacodes',
        title: '3-Digit Telephone Codes',
        description: 'Complete map of US 3-digit telephone area codes (212, 310, 415, 312...).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/us_areacodes_3.geojson',
        levelKey: 'AreaCode',
        targetCount: 290,
        badge: '3-Digit Tel',
        color: 'emerald'
      },
      {
        id: 'us-flags',
        title: '50 State Flags Quiz',
        description: 'Identify state flags (California Bear, Texas Lone Star, Alaska Big Dipper...).',
        category: 'flags',
        geojsonFile: '/maps/subdivisions/usa_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 50,
        badge: 'State Flags',
        color: 'amber'
      }
    ]
  },
  CA: {
    countryCode: 'CA',
    countryName: 'Canada',
    quizzes: [
      {
        id: 'ca-adm1',
        title: 'Level 1: 10 Provinces & 3 Territories',
        description: 'Map tap quiz for all 13 Canadian provinces and territories.',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/canada_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 13,
        badge: 'ADM1',
        color: 'sky'
      },
      {
        id: 'ca-areacodes',
        title: 'Telephone Area Codes',
        description: 'Canadian 3-digit telephone area codes (416, 604, 514, 403...).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/ca_areacodes.geojson',
        levelKey: 'AreaCode',
        targetCount: 19,
        badge: 'Area Codes',
        color: 'emerald'
      },
      {
        id: 'ca-flags',
        title: '13 Provincial & Territorial Flags',
        description: 'Identify the official flags of all 10 Canadian provinces and 3 territories (Quebec, British Columbia, Ontario, Nova Scotia, Nunavut...).',
        category: 'flags',
        geojsonFile: '/maps/subdivisions/canada_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 13,
        badge: 'Province Flags',
        color: 'amber'
      }
    ]
  },
  IT: {
    countryCode: 'IT',
    countryName: 'Italy',
    quizzes: [
      {
        id: 'it-adm1',
        title: 'Level 1: 20 Regions',
        description: 'Map tap quiz for the 20 regions of Italy (Lombardy, Sicily, Tuscany, Lazio...).',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/ita_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 20,
        badge: 'ADM1',
        color: 'sky'
      },
      {
        id: 'it-areacodes-2',
        title: 'Area Codes (2 Digits - HelloQuiz)',
        description: 'Major Italian telephone area codes (02 Milan, 06 Rome, 081 Naples...).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/it_areacodes_2.geojson',
        levelKey: 'AreaCode',
        targetCount: 71,
        badge: '2-Digit Tel',
        color: 'emerald'
      },
      {
        id: 'it-areacodes-3',
        title: 'Area Codes (3 Digits - HelloQuiz)',
        description: 'Detailed Italian provincial telephone area codes.',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/it_areacodes_3.geojson',
        levelKey: 'AreaCode',
        targetCount: 100,
        badge: '3-Digit Tel',
        color: 'teal'
      }
    ]
  },
  BR: {
    countryCode: 'BR',
    countryName: 'Brazil',
    quizzes: [
      {
        id: 'br-adm1',
        title: 'Level 1: 26 States & Federal District',
        description: 'Map tap quiz for all Brazilian states (São Paulo, Rio de Janeiro, Bahia...).',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/bra_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 27,
        badge: 'ADM1',
        color: 'sky'
      },
      {
        id: 'br-areacodes',
        title: 'DDD Telephone Codes',
        description: 'All 67 Brazilian 2-digit DDD area codes (11 São Paulo, 21 Rio, 31 Belo Horizonte, 71 Salvador...).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/br_areacodes.geojson',
        levelKey: 'AreaCode',
        targetCount: 67,
        badge: 'DDD Codes',
        color: 'emerald'
      },
      {
        id: 'br-flags',
        title: '27 State & Federal District Flags',
        description: 'Identify the official flags of all 26 Brazilian states and the Distrito Federal (São Paulo, Minas Gerais, Pernambuco, Bahia, Rio Grande do Sul, Paraná...).',
        category: 'flags',
        geojsonFile: '/maps/subdivisions/bra_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 27,
        badge: 'State Flags',
        color: 'amber'
      }
    ]
  },
  JP: {
    countryCode: 'JP',
    countryName: 'Japan',
    quizzes: [
      {
        id: 'jp-adm1',
        title: 'Level 1: 47 Prefectures',
        description: 'Map tap quiz for all 47 prefectures of Japan.',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/japan_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 47,
        badge: 'ADM1',
        color: 'sky'
      },
      {
        id: 'jp-areacodes',
        title: 'Telephone Area Codes',
        description: 'Japanese telephone area codes (03 Tokyo, 06 Osaka, 052 Nagoya, 011 Sapporo...).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/jp_areacodes.geojson',
        levelKey: 'AreaCode',
        targetCount: 59,
        badge: 'Area Codes',
        color: 'emerald'
      },
      {
        id: 'jp-kanji',
        title: 'Prefectures in Native Kanji (東京都, 大阪府, 北海道...)',
        description: 'Map tap quiz for all 47 Japanese prefectures written in authentic native Kanji characters.',
        category: 'extra',
        geojsonFile: '/maps/subdivisions/japan_kanji.geojson',
        levelKey: 'name',
        targetCount: 47,
        badge: 'Kanji',
        color: 'amber'
      }
    ]
  },
  MX: {
    countryCode: 'MX',
    countryName: 'Mexico',
    quizzes: [
      {
        id: 'mx-adm1',
        title: 'Level 1: 32 Federal Entities',
        description: 'Map tap quiz for the 31 states and Mexico City.',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/mex_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 32,
        badge: 'ADM1',
        color: 'sky'
      },
      {
        id: 'mx-areacodes',
        title: 'Telephone Area Codes',
        description: 'Mexican telephone area codes (55 CDMX, 33 Guadalajara, 81 Monterrey...).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/mx_areacodes.geojson',
        levelKey: 'AreaCode',
        targetCount: 150,
        badge: 'Area Codes',
        color: 'emerald'
      }
    ]
  },
  AR: {
    countryCode: 'AR',
    countryName: 'Argentina',
    quizzes: [
      {
        id: 'ar-adm1',
        title: 'Level 1: 23 Provinces',
        description: 'Map tap quiz for Argentine provinces and the autonomous city of Buenos Aires.',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/arg_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 23,
        badge: 'ADM1',
        color: 'sky'
      },
      {
        id: 'ar-areacodes-2',
        title: 'Area Codes: 2 Digits',
        description: 'Argentine 2-digit telephone area codes (11 Buenos Aires, 351 Córdoba, 341 Rosario...).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/ar_areacodes_2.geojson',
        levelKey: 'AreaCode',
        targetCount: 30,
        badge: '2-Digit Tel',
        color: 'emerald'
      },
      {
        id: 'ar-areacodes-3',
        title: 'Area Codes: 3 Digits',
        description: 'Detailed Argentine 3-digit telephone dialing zones.',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/ar_areacodes_3.geojson',
        levelKey: 'AreaCode',
        targetCount: 80,
        badge: '3-Digit Tel',
        color: 'teal'
      }
    ]
  },
  AT: {
    countryCode: 'AT',
    countryName: 'Austria',
    quizzes: [
      {
        id: 'at-adm1',
        title: 'Level 1: 9 Bundesländer',
        description: 'Map tap quiz for all 9 federal states of Austria (Tyrol, Salzburg, Vienna...).',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/aut_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 9,
        badge: 'ADM1',
        color: 'sky'
      },
      {
        id: 'at-areacodes',
        title: 'Vorwahl Telephone Codes',
        description: 'Austrian Vorwahl telephone dialing zones (1 Vienna, 316 Graz, 512 Innsbruck, 662 Salzburg...).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/at_areacodes.geojson',
        levelKey: 'AreaCode',
        targetCount: 39,
        badge: 'Vorwahl',
        color: 'emerald'
      },
      {
        id: 'at-flags',
        title: '9 State Flags (Bundesländer)',
        description: 'Identify the official state flags & coats of arms (Landesdienstflaggen) of all 9 Austrian Bundesländer (Tirol, Steiermark, Kärnten, Salzburg, Wien, Niederösterreich...).',
        category: 'flags',
        geojsonFile: '/maps/subdivisions/aut_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 9,
        badge: 'State Flags',
        color: 'amber'
      }
    ]
  },
  PL: {
    countryCode: 'PL',
    countryName: 'Poland',
    quizzes: [
      {
        id: 'pl-adm1',
        title: 'Level 1: 16 Voivodeships',
        description: 'Map tap quiz for all 16 Polish voivodeships (provinces).',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/pol_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 16,
        badge: 'ADM1',
        color: 'sky'
      },
      {
        id: 'pl-areacodes',
        title: 'Telephone Area Codes',
        description: 'Polish 2-digit telephone area codes (22 Warsaw, 12 Kraków, 71 Wrocław, 61 Poznań...).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/pl_areacodes.geojson',
        levelKey: 'AreaCode',
        targetCount: 49,
        badge: 'Area Codes',
        color: 'emerald'
      }
    ]
  },
  TR: {
    countryCode: 'TR',
    countryName: 'Turkey',
    quizzes: [
      {
        id: 'tr-adm1',
        title: 'Level 1: 81 Provinces',
        description: 'Map tap quiz for all 81 provinces of Turkey.',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/tur_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 81,
        badge: 'ADM1',
        color: 'sky'
      },
      {
        id: 'tr-areacodes-2',
        title: 'Area Codes: 2 Digits',
        description: 'Turkish 2-digit telephone area code regions (212/216 Istanbul, 312 Ankara, 232 Izmir...).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/tr_areacodes_2.geojson',
        levelKey: 'AreaCode',
        targetCount: 40,
        badge: '2-Digit Tel',
        color: 'emerald'
      },
      {
        id: 'tr-areacodes-3',
        title: 'Area Codes: 3 Digits',
        description: 'Detailed 3-digit provincial telephone codes of Turkey.',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/tr_areacodes_3.geojson',
        levelKey: 'AreaCode',
        targetCount: 81,
        badge: '3-Digit Tel',
        color: 'teal'
      }
    ]
  },
  KR: {
    countryCode: 'KR',
    countryName: 'South Korea',
    quizzes: [
      {
        id: 'kr-adm1',
        title: 'Level 1: 17 First-Tier Subdivisions',
        description: 'Map tap quiz for South Korean provinces and special cities.',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/kor_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 17,
        badge: 'ADM1',
        color: 'sky'
      },
      {
        id: 'kr-areacodes',
        title: 'Telephone Area Codes',
        description: 'South Korean telephone area codes (02 Seoul, 051 Busan, 032 Incheon, 053 Daegu...).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/kr_areacodes.geojson',
        levelKey: 'AreaCode',
        targetCount: 17,
        badge: 'Area Codes',
        color: 'emerald'
      }
    ]
  },
  ZA: {
    countryCode: 'ZA',
    countryName: 'South Africa',
    quizzes: [
      {
        id: 'za-adm1',
        title: 'Level 1: 9 Provinces',
        description: 'Map tap quiz for South African provinces (Gauteng, Western Cape, KwaZulu-Natal...).',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/zaf_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 9,
        badge: 'ADM1',
        color: 'sky'
      },
      {
        id: 'za-areacodes',
        title: 'Telephone Area Codes',
        description: 'South African 2-digit telephone area codes (011 Johannesburg, 021 Cape Town, 031 Durban, 012 Pretoria...).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/za_areacodes.geojson',
        levelKey: 'AreaCode',
        targetCount: 25,
        badge: 'Area Codes',
        color: 'emerald'
      }
    ]
  },
  SE: {
    countryCode: 'SE',
    countryName: 'Sweden',
    quizzes: [
      {
        id: 'se-adm1',
        title: 'Level 1: 21 Counties (Län)',
        description: 'Map tap quiz for all 21 administrative counties of Sweden.',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/swe_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 21,
        badge: 'ADM1',
        color: 'sky'
      },
      {
        id: 'se-areacodes',
        title: 'Telephone Area Codes',
        description: 'Swedish telephone area code zones (08 Stockholm, 031 Gothenburg, 040 Malmö...).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/se_areacodes.geojson',
        levelKey: 'AreaCode',
        targetCount: 20,
        badge: 'Riktnummer',
        color: 'emerald'
      }
    ]
  },
  PT: {
    countryCode: 'PT',
    countryName: 'Portugal',
    quizzes: [
      {
        id: 'pt-adm1',
        title: 'Level 1: Districts & Regions',
        description: 'Map tap quiz for Portugal districts and autonomous island regions (Azores, Madeira).',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/prt_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 20,
        badge: 'ADM1',
        color: 'sky'
      },
      {
        id: 'pt-areacodes',
        title: 'Telephone Area Codes',
        description: 'Portuguese telephone area codes (21 Lisbon, 22 Porto, 291 Madeira, 296 Azores...).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/pt_areacodes.geojson',
        levelKey: 'AreaCode',
        targetCount: 20,
        badge: 'Area Codes',
        color: 'emerald'
      }
    ]
  },
  GR: {
    countryCode: 'GR',
    countryName: 'Greece',
    quizzes: [
      {
        id: 'gr-adm1',
        title: 'Level 1: 13 Administrative Regions',
        description: 'Map tap quiz for the 13 regions of Greece (Attica, Crete, Macedonia...).',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/grc_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 13,
        badge: 'ADM1',
        color: 'sky'
      },
      {
        id: 'gr-areacodes',
        title: 'Telephone Area Codes',
        description: 'Greek telephone area codes (21 Athens, 231 Thessaloniki, 281 Heraklion...).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/gr_areacodes.geojson',
        levelKey: 'AreaCode',
        targetCount: 35,
        badge: 'Area Codes',
        color: 'emerald'
      }
    ]
  },
  RO: {
    countryCode: 'RO',
    countryName: 'Romania',
    quizzes: [
      {
        id: 'ro-adm1',
        title: 'Level 1: 41 Counties (Județe)',
        description: 'Map tap quiz for Romanian counties and Bucharest.',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/rou_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 41,
        badge: 'ADM1',
        color: 'sky'
      },
      {
        id: 'ro-areacodes',
        title: 'Telephone Area Codes',
        description: 'Romanian prefix codes (21 Bucharest, 264 Cluj, 256 Timișoara...).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/ro_areacodes.geojson',
        levelKey: 'AreaCode',
        targetCount: 42,
        badge: 'Area Codes',
        color: 'emerald'
      }
    ]
  },
  UA: {
    countryCode: 'UA',
    countryName: 'Ukraine',
    quizzes: [
      {
        id: 'ua-areacodes',
        title: 'Telephone Area Codes',
        description: 'Ukrainian telephone area codes (44 Kyiv, 48 Odesa, 32 Lviv, 57 Kharkiv...).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/ua_areacodes.geojson',
        levelKey: 'AreaCode',
        targetCount: 27,
        badge: 'Area Codes',
        color: 'emerald'
      }
    ]
  },
  NZ: {
    countryCode: 'NZ',
    countryName: 'New Zealand',
    quizzes: [
      {
        id: 'nz-adm1',
        title: 'Level 1: 16 Regions',
        description: 'Map tap quiz for the North and South Island regions of New Zealand.',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/nzl_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 16,
        badge: 'ADM1',
        color: 'sky'
      },
      {
        id: 'nz-areacodes',
        title: 'Telephone Area Codes',
        description: 'New Zealand telephone area codes (9 Auckland/Northland, 3 South Island, 4 Wellington, 7 Waikato...).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/nz_areacodes.geojson',
        levelKey: 'AreaCode',
        targetCount: 5,
        badge: 'Area Codes',
        color: 'emerald'
      }
    ]
  },
  CZ: {
    countryCode: 'CZ',
    countryName: 'Czech Republic',
    quizzes: [
      {
        id: 'cz-adm1',
        title: 'Level 1: 14 Regions (Kraje)',
        description: 'Map tap quiz for the 14 regions of the Czech Republic.',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/cze_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 14,
        badge: 'ADM1',
        color: 'sky'
      },
      {
        id: 'cz-areacodes',
        title: 'Telephone Area Codes',
        description: 'Czech telephone area code regions (2 Prague, 5 Brno, 4 Plzeň/Ústí...).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/cz_areacodes.geojson',
        levelKey: 'AreaCode',
        targetCount: 14,
        badge: 'Area Codes',
        color: 'emerald'
      }
    ]
  },
  SK: {
    countryCode: 'SK',
    countryName: 'Slovakia',
    quizzes: [
      {
        id: 'sk-areacodes',
        title: 'Telephone Area Codes',
        description: 'Slovak telephone area codes (2 Bratislava, 55 Košice, 41 Žilina, 48 Banská Bystrica...).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/sk_areacodes.geojson',
        levelKey: 'AreaCode',
        targetCount: 10,
        badge: 'Area Codes',
        color: 'emerald'
      }
    ]
  },
  HR: {
    countryCode: 'HR',
    countryName: 'Croatia',
    quizzes: [
      {
        id: 'hr-areacodes',
        title: 'Telephone Area Codes',
        description: 'Croatian telephone area codes (1 Zagreb, 21 Split, 51 Rijeka, 31 Osijek...).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/hr_areacodes.geojson',
        levelKey: 'AreaCode',
        targetCount: 20,
        badge: 'Area Codes',
        color: 'emerald'
      }
    ]
  },
  PE: {
    countryCode: 'PE',
    countryName: 'Peru',
    quizzes: [
      {
        id: 'pe-areacodes',
        title: 'Telephone Area Codes',
        description: 'Peruvian telephone area codes (1 Lima, 54 Arequipa, 84 Cusco, 44 Trujillo...).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/pe_areacodes.geojson',
        levelKey: 'AreaCode',
        targetCount: 25,
        badge: 'Area Codes',
        color: 'emerald'
      }
    ]
  },
  UY: {
    countryCode: 'UY',
    countryName: 'Uruguay',
    quizzes: [
      {
        id: 'uy-areacodes',
        title: 'Telephone Area Codes',
        description: 'Uruguayan telephone area codes (2 Montevideo, 42 Punta del Este, 473 Salto...).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/uy_areacodes.geojson',
        levelKey: 'AreaCode',
        targetCount: 19,
        badge: 'Area Codes',
        color: 'emerald'
      }
    ]
  },
  TH: {
    countryCode: 'TH',
    countryName: 'Thailand',
    quizzes: [
      {
        id: 'th-adm1',
        title: 'Level 1: 77 Provinces (Changwat)',
        description: 'Map tap quiz for all 77 Thai provinces including Bangkok Special Administrative Area.',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/th_provinces.geojson',
        levelKey: 'auto',
        targetCount: 77,
        badge: 'Provinces',
        color: 'sky'
      },
      {
        id: 'th-areacodes',
        title: 'Telephone Area Codes',
        description: 'Thai telephone area codes (02 Bangkok, 053 Chiang Mai, 076 Phuket, 038 Chonburi/Pattaya...).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/th_areacodes.geojson',
        levelKey: 'AreaCode',
        targetCount: 20,
        badge: 'Area Codes',
        color: 'emerald'
      },
      {
        id: 'th-abbrev',
        title: 'Province Abbreviations in Thai (กทม, ชม, ภก...)',
        description: 'Practice the official 2-letter Thai script province abbreviations found on Thai vehicle license plates and route signs.',
        category: 'extra',
        geojsonFile: '/maps/subdivisions/thailand_abbrev.geojson',
        levelKey: 'name',
        targetCount: 77,
        badge: 'Thai Abbrev',
        color: 'amber'
      }
    ]
  },
  PH: {
    countryCode: 'PH',
    countryName: 'Philippines',
    quizzes: [
      {
        id: 'ph-adm1',
        title: 'Level 1: 18 Regions',
        description: 'Map tap quiz for the 18 administrative regions of the Philippines.',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/ph_regions.geojson',
        levelKey: 'NAME_1',
        targetCount: 18,
        badge: 'Regions',
        color: 'sky'
      },
      {
        id: 'ph-adm2',
        title: 'Level 2: 81 Provinces',
        description: 'Map tap quiz for all 81 Philippine provinces across Luzon, Visayas, and Mindanao.',
        category: 'adm2',
        geojsonFile: '/maps/subdivisions/ph_provinces.geojson',
        levelKey: 'auto',
        targetCount: 81,
        badge: 'Provinces',
        color: 'indigo'
      },
      {
        id: 'ph-areacodes',
        title: 'Telephone Area Codes',
        description: 'Philippine telephone area codes (02 Metro Manila, 032 Cebu, 082 Davao, 074 Baguio...).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/philippines_areacodes.geojson',
        levelKey: 'AreaCode',
        targetCount: 37,
        badge: 'Area Codes',
        color: 'emerald'
      }
    ]
  },
  RU: {
    countryCode: 'RU',
    countryName: 'Russia',
    quizzes: [
      {
        id: 'ru-areacodes-2',
        title: 'Area Codes: 2 Digits',
        description: 'Russian 2-digit telephone area code regions (495/499 Moscow, 812 Saint Petersburg...).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/ru_areacodes_2.geojson',
        levelKey: 'AreaCode',
        targetCount: 40,
        badge: '2-Digit Tel',
        color: 'emerald'
      },
      {
        id: 'ru-areacodes-3',
        title: 'Area Codes: 3 Digits',
        description: 'Detailed Russian 3-digit regional telephone codes.',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/ru_areacodes_3.geojson',
        levelKey: 'AreaCode',
        targetCount: 85,
        badge: '3-Digit Tel',
        color: 'teal'
      },
      {
        id: 'ru-license-plates',
        title: 'Car License Plate Region Codes',
        description: 'Super-Duper special: Russian automotive vehicle registration plate numbers (77/99/777 Moscow, 78/98 St. Petersburg, 16 Tatarstan...).',
        category: 'extra',
        geojsonFile: '/maps/subdivisions/russia_regioncode.geojson',
        levelKey: 'AreaCode',
        targetCount: 89,
        badge: 'Plate Codes',
        color: 'rose'
      }
    ]
  },
  GB: {
    countryCode: 'GB',
    countryName: 'United Kingdom',
    quizzes: [
      {
        id: 'gb-adm1',
        title: 'Level 1: Countries & Regions',
        description: 'Map tap quiz for England, Scotland, Wales, and Northern Ireland.',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/gbr_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 4,
        badge: 'ADM1',
        color: 'sky'
      }
    ]
  },
  CH: {
    countryCode: 'CH',
    countryName: 'Switzerland',
    quizzes: [
      {
        id: 'ch-adm1',
        title: 'Level 1: 26 Cantons',
        description: 'Map tap quiz for the 26 Swiss Cantons (Zurich, Bern, Geneva, Vaud...).',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/che_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 26,
        badge: 'ADM1',
        color: 'sky'
      },
      {
        id: 'ch-flags',
        title: '26 Cantonal Flags',
        description: 'Identify the iconic square cantonal flags & coats of arms of all 26 Swiss Cantons (Bern, Zürich, Genève, Uri, Graubünden, Valais, Vaud, Ticino...).',
        category: 'flags',
        geojsonFile: '/maps/subdivisions/che_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 26,
        badge: 'Canton Flags',
        color: 'amber'
      }
    ]
  },
  NO: {
    countryCode: 'NO',
    countryName: 'Norway',
    quizzes: [
      {
        id: 'no-adm1',
        title: 'Level 1: Counties (Fylker)',
        description: 'Map tap quiz for Norwegian counties.',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/nor_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 15,
        badge: 'ADM1',
        color: 'sky'
      }
    ]
  },
  FI: {
    countryCode: 'FI',
    countryName: 'Finland',
    quizzes: [
      {
        id: 'fi-adm1',
        title: 'Level 1: 5 Historical Provinces (Läänit)',
        description: 'Map tap quiz for the 5 administrative provinces of Finland (Southern, Western, Eastern Finland, Oulu, Lapland).',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/fin_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 5,
        badge: 'ADM1',
        color: 'sky'
      },
      {
        id: 'fi-areacodes',
        title: 'Telephone Area Codes',
        description: 'Finnish telephone dialing area codes (09 Helsinki, 03 Tampere, 02 Turku, 08 Oulu...).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/fi_areacodes.geojson',
        levelKey: 'AreaCode',
        targetCount: 13,
        badge: 'Area Codes',
        color: 'emerald'
      }
    ]
  },
  DK: {
    countryCode: 'DK',
    countryName: 'Denmark',
    quizzes: [
      {
        id: 'dk-adm1',
        title: 'Level 1: 5 Regions',
        description: 'Map tap quiz for the 5 administrative regions of Denmark.',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/dnk_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 5,
        badge: 'ADM1',
        color: 'sky'
      }
    ]
  },
  IE: {
    countryCode: 'IE',
    countryName: 'Ireland',
    quizzes: [
      {
        id: 'ie-adm1',
        title: 'Level 1: 26 Traditional Counties',
        description: 'Map tap quiz for the counties of Ireland (Cork, Dublin, Galway, Kerry...).',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/irl_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 26,
        badge: 'ADM1',
        color: 'sky'
      }
    ]
  },
  HU: {
    countryCode: 'HU',
    countryName: 'Hungary',
    quizzes: [
      {
        id: 'hu-adm1',
        title: 'Level 1: 19 Counties (Megyék)',
        description: 'Map tap quiz for the 19 counties of Hungary and Budapest.',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/hun_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 19,
        badge: 'ADM1',
        color: 'sky'
      }
    ]
  },
  AU: {
    countryCode: 'AU',
    countryName: 'Australia',
    quizzes: [
      {
        id: 'au-adm1',
        title: 'Level 1: 8 States & Territories',
        description: 'Map tap quiz for Australian states and mainland territories (NSW, Victoria, QLD...).',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/aus_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 8,
        badge: 'ADM1',
        color: 'sky'
      },
      {
        id: 'au-flags',
        title: '8 State & Territory Flags',
        description: 'Identify the official flags & state badges of all 6 Australian States and 2 Mainland Territories (WA Black Swan, SA Piping Shrike, NT Ochre Southern Cross, NSW, VIC, QLD, TAS, ACT).',
        category: 'flags',
        geojsonFile: '/maps/subdivisions/aus_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 8,
        badge: 'State Flags',
        color: 'amber'
      }
    ]
  },
  MY: {
    countryCode: 'MY',
    countryName: 'Malaysia',
    quizzes: [
      {
        id: 'my-adm1',
        title: 'Level 1: 13 States & 3 Federal Territories',
        description: 'Map tap quiz for all Malaysian states across Peninsular and Borneo.',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/mys_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 16,
        badge: 'ADM1',
        color: 'sky'
      },
      {
        id: 'my-flags',
        title: '16 State & Federal Territory Flags',
        description: 'Identify all 16 Malaysian state & federal territory flags (Johor, Selangor, Sabah, Sarawak, Penang, Pahang, Perak, Kedah, Kelantan, Terengganu, Negeri Sembilan, Melaka, Perlis, KL, Labuan, Putrajaya).',
        category: 'flags',
        geojsonFile: '/maps/subdivisions/mys_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 16,
        badge: 'State Flags',
        color: 'amber'
      }
    ]
  },
  ID: {
    countryCode: 'ID',
    countryName: 'Indonesia',
    quizzes: [
      {
        id: 'id-adm1',
        title: 'Level 1: 38 Provinces',
        description: 'Map tap quiz for Indonesian provinces across Sumatra, Java, Kalimantan, Bali, Sulawesi, Papua.',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/idn_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 38,
        badge: 'ADM1',
        color: 'sky'
      },
      {
        id: 'id-kabupaten',
        title: 'Level 2: 510 Kabupaten & Kota',
        description: 'Map tap quiz for all 510 Indonesian regencies and cities. Filter by province or study all!',
        category: 'adm2',
        geojsonFile: '/maps/subdivisions/id_kabupaten.geojson',
        levelKey: 'auto',
        targetCount: 510,
        badge: 'Kabupaten',
        color: 'indigo'
      }
    ]
  },
  IN: {
    countryCode: 'IN',
    countryName: 'India',
    quizzes: [
      {
        id: 'in-adm1',
        title: 'Level 1: 28 States & 8 Union Territories',
        description: 'Map tap quiz for all Indian states (Maharashtra, Tamil Nadu, Uttar Pradesh...).',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/ind_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 36,
        badge: 'ADM1',
        color: 'sky'
      }
    ]
  },
  CL: {
    countryCode: 'CL',
    countryName: 'Chile',
    quizzes: [
      {
        id: 'cl-adm1',
        title: 'Level 1: 16 Regions',
        description: 'Map tap quiz for the regions of Chile from Arica to Magallanes.',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/chl_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 16,
        badge: 'ADM1',
        color: 'sky'
      },
      {
        id: 'cl-areacodes',
        title: 'Telephone Area Codes (22 Santiago, 32 Valparaíso...)',
        description: 'Practice Chilean telephone area codes (58 Arica, 55 Antofagasta, 32 Valparaíso, 22 Santiago, 41 Concepción, 61 Magallanes...).',
        category: 'areacodes',
        geojsonFile: '/maps/subdivisions/chile_areacodes.geojson',
        levelKey: 'AreaCode',
        targetCount: 16,
        badge: 'Area Codes',
        color: 'emerald'
      }
    ]
  },
  OM: {
    countryCode: 'OM',
    countryName: 'Oman',
    quizzes: [
      {
        id: 'om-adm1',
        title: 'Level 1: 11 Governorates',
        description: 'Map tap quiz for the 11 governorates of Oman (Muscat, Dhofar, Musandam...).',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/omn_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 11,
        badge: 'ADM1',
        color: 'sky'
      },
      {
        id: 'om-bins',
        title: 'be\'ah Dumpster Municipality Codes (01 Muscat, 08 Dhofar...)',
        description: 'Practice the official 2-digit be\'ah waste bin municipality numbers stenciled on dumpsters across Oman.',
        category: 'extra',
        geojsonFile: '/maps/subdivisions/oman_bins.geojson',
        levelKey: 'code',
        targetCount: 11,
        badge: 'Bin Codes',
        color: 'amber'
      }
    ]
  },
  VN: {
    countryCode: 'VN',
    countryName: 'Vietnam',
    quizzes: [
      {
        id: 'vn-adm1',
        title: 'Level 1: 63 Provinces (Tỉnh)',
        description: 'Map tap quiz for all 63 provinces and centrally-governed cities of Vietnam.',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/vnm_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 63,
        badge: 'ADM1',
        color: 'sky'
      },
      {
        id: 'vn-areacodes',
        title: 'Telephone Area Codes (024 Hanoi, 028 HCMC...)',
        description: 'Practice telephone area codes for Vietnam provinces (024 Hanoi, 028 HCMC, 0225 Hai Phong, 0236 Da Nang...).',
        category: 'areacodes',
        geojsonFile: '/maps/subdivisions/vietnam_areacodes.geojson',
        levelKey: 'AreaCode',
        targetCount: 63,
        badge: 'Area Codes',
        color: 'emerald'
      }
    ]
  },
  CO: {
    countryCode: 'CO',
    countryName: 'Colombia',
    quizzes: [
      {
        id: 'co-adm1',
        title: 'Level 1: 32 Departments',
        description: 'Map tap quiz for all 32 Colombian departments and Bogotá Capital District.',
        category: 'adm1',
        geojsonFile: '/maps/subdivisions/col_adm1.geojson',
        levelKey: 'NAME_1',
        targetCount: 32,
        badge: 'ADM1',
        color: 'sky'
      }
    ]
  },
  AL: {
    countryCode: 'AL',
    countryName: 'Albania',
    quizzes: [
      {
        id: 'al-areacodes',
        title: 'Telephone Area Codes',
        description: 'Albanian regional telephone dialing area codes.',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/al_areacodes.geojson',
        levelKey: 'AreaCode',
        targetCount: 5,
        badge: 'Area Codes',
        color: 'emerald'
      }
    ]
  },
  BO: {
    countryCode: 'BO',
    countryName: 'Bolivia',
    quizzes: [
      {
        id: 'bo-areacodes',
        title: 'Telephone Area Codes',
        description: 'Bolivian department telephone area codes (3 Santa Cruz, 2 La Paz, 4 Cochabamba).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/bo_areacodes.geojson',
        levelKey: 'AreaCode',
        targetCount: 3,
        badge: 'Area Codes',
        color: 'emerald'
      }
    ]
  },
  EC: {
    countryCode: 'EC',
    countryName: 'Ecuador',
    quizzes: [
      {
        id: 'ec-areacodes',
        title: 'Telephone Area Codes',
        description: 'Ecuadorian regional telephone dialing zones (02 Pichincha/Quito, 04 Guayas/Guayaquil...).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/ec_areacodes.geojson',
        levelKey: 'AreaCode',
        targetCount: 7,
        badge: 'Area Codes',
        color: 'emerald'
      },
      {
        id: 'ec-taxi-superduper',
        title: 'Taxi Letter Codes (GeoGuessr Meta)',
        description: 'Super-Duper special quiz: Identify Ecuadorian provinces by the distinctive single-letter prefix on taxi doors and license plates (A=Azuay, P=Pichincha, G=Guayas...).',
        category: 'extra',
        geojsonFile: '/maps/subdivisions/ecuador_taxi.geojson',
        levelKey: 'AreaCode',
        targetCount: 23,
        badge: 'Taxi Code',
        color: 'amber'
      }
    ]
  },
  KH: {
    countryCode: 'KH',
    countryName: 'Cambodia',
    quizzes: [
      {
        id: 'kh-areacodes',
        title: 'Telephone Area Codes',
        description: 'Cambodian provincial telephone area codes (023 Phnom Penh, 063 Siem Reap...).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/kh_areacodes.geojson',
        levelKey: 'AreaCode',
        targetCount: 24,
        badge: 'Area Codes',
        color: 'emerald'
      }
    ]
  },
  LK: {
    countryCode: 'LK',
    countryName: 'Sri Lanka',
    quizzes: [
      {
        id: 'lk-areacodes',
        title: 'Telephone Area Codes',
        description: 'Sri Lankan district telephone area codes (011 Colombo, 081 Kandy, 021 Jaffna, 091 Galle...).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/lk_areacodes.geojson',
        levelKey: 'AreaCode',
        targetCount: 29,
        badge: 'Area Codes',
        color: 'emerald'
      }
    ]
  },
  PA: {
    countryCode: 'PA',
    countryName: 'Panama',
    quizzes: [
      {
        id: 'pa-areacodes',
        title: 'Telephone Area Codes',
        description: 'Panamanian telephone area codes (2/3 Panama City, 7 Chiriquí/Bocas, 9 Herrera/Los Santos...).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/pa_areacodes.geojson',
        levelKey: 'AreaCode',
        targetCount: 7,
        badge: 'Area Codes',
        color: 'emerald'
      },
      {
        id: 'pa-taxi-superduper',
        title: 'Taxi Region Numbers (GeoGuessr Meta)',
        description: 'Super-Duper special quiz: Master Panama provincial taxi identification numbers (1=Bocas del Toro, 8=Panama City...).',
        category: 'extra',
        geojsonFile: '/maps/subdivisions/panama_taxi.geojson',
        levelKey: 'AreaCode',
        targetCount: 10,
        badge: 'Taxi Zone',
        color: 'amber'
      }
    ]
  },
  TN: {
    countryCode: 'TN',
    countryName: 'Tunisia',
    quizzes: [
      {
        id: 'tn-areacodes',
        title: 'Telephone Area Codes',
        description: 'Tunisian governorate telephone area code zones (71 Grand Tunis, 73 Sahel, 74 Sfax...).',
        category: 'areacodes',
        geojsonFile: '/maps/areacodes/tn_areacodes.geojson',
        levelKey: 'AreaCode',
        targetCount: 8,
        badge: 'Area Codes',
        color: 'emerald'
      }
    ]
  },
  TW: {
    countryCode: 'TW',
    countryName: 'Taiwan',
    quizzes: [
      {
        id: 'tw-areacodes',
        title: 'Telephone Area Codes',
        description: 'Taiwan regional telephone area codes (02 Taipei/New Taipei, 04 Taichung, 07 Kaohsiung...).',
        category: 'areacodes',
        geojsonFile: '/maps/subdivisions/taiwan_areacodes.geojson',
        levelKey: 'AreaCode',
        targetCount: 18,
        badge: 'Area Codes',
        color: 'emerald'
      }
    ]
  },
};

/**
 * Registry of available offline Level 1 administrative subdivision maps.
 * Generated from GADM 4.1 offline geographic datasets.
 */
export const OFFLINE_ADM1_MAP: Record<string, { count: number; file: string; label?: string }> = {
  AD: { count: 7, file: '/maps/subdivisions/and_adm1.geojson', label: '7 Parishes' },
  AE: { count: 7, file: '/maps/subdivisions/are_adm1.geojson', label: '7 Emirates' },
  AF: { count: 34, file: '/maps/subdivisions/afg_adm1.geojson', label: '34 Provinces' },
  AG: { count: 8, file: '/maps/subdivisions/atg_adm1.geojson', label: '8 Parishes & Dependencies' },
  AI: { count: 18, file: '/maps/subdivisions/aia_adm1.geojson', label: '18 Districts' },
  AL: { count: 12, file: '/maps/subdivisions/alb_adm1.geojson', label: '12 Counties' },
  AM: { count: 11, file: '/maps/subdivisions/arm_adm1.geojson', label: '11 Provinces (Marzer)' },
  AO: { count: 18, file: '/maps/subdivisions/ago_adm1.geojson', label: '18 Provinces' },
  AR: { count: 24, file: '/maps/subdivisions/arg_adm1.geojson', label: '24 Provinces' },
  AS: { count: 4, file: '/maps/subdivisions/asm_adm1.geojson', label: '4 Districts' },
  AT: { count: 9, file: '/maps/subdivisions/aut_adm1.geojson', label: '9 States (Bundesländer)' },
  AU: { count: 8, file: '/maps/subdivisions/aus_adm1.geojson', label: '8 States & Territories' },
  AX: { count: 3, file: '/maps/subdivisions/ala_adm1.geojson', label: '3 Sub-Regions' },
  AZ: { count: 10, file: '/maps/subdivisions/aze_adm1.geojson', label: '10 Economic Regions' },
  BA: { count: 3, file: '/maps/subdivisions/bih_adm1.geojson', label: '3 Political Entities & District' },
  BB: { count: 11, file: '/maps/subdivisions/brb_adm1.geojson', label: '11 Parishes' },
  BD: { count: 8, file: '/maps/subdivisions/bgd_adm1.geojson', label: '8 Divisions' },
  BE: { count: 3, file: '/maps/subdivisions/belgium_adm1.geojson', label: '3 Regions' },
  BF: { count: 13, file: '/maps/subdivisions/bfa_adm1.geojson', label: '13 Regions' },
  BG: { count: 28, file: '/maps/subdivisions/bgr_adm1.geojson', label: '28 Provinces (Oblasti)' },
  BH: { count: 4, file: '/maps/subdivisions/bhr_adm1.geojson', label: '4 Governorates' },
  BI: { count: 17, file: '/maps/subdivisions/bdi_adm1.geojson', label: '17 Provinces' },
  BJ: { count: 12, file: '/maps/subdivisions/ben_adm1.geojson', label: '12 Departments' },
  BL: { count: 2, file: '/maps/subdivisions/blm_adm1.geojson', label: '2 Parishes' },
  BM: { count: 11, file: '/maps/subdivisions/bmu_adm1.geojson', label: '11 Parishes' },
  BN: { count: 4, file: '/maps/subdivisions/brn_adm1.geojson', label: '4 Districts' },
  BO: { count: 9, file: '/maps/subdivisions/bol_adm1.geojson', label: '9 Departments' },
  BQ: { count: 3, file: '/maps/subdivisions/bes_adm1.geojson', label: '3 Special Municipalities' },
  BR: { count: 27, file: '/maps/subdivisions/bra_adm1.geojson', label: '27 States & Federal District' },
  BS: { count: 32, file: '/maps/subdivisions/bhs_adm1.geojson', label: '32 Districts' },
  BT: { count: 20, file: '/maps/subdivisions/btn_adm1.geojson', label: '20 Districts (Dzongkhags)' },
  BW: { count: 16, file: '/maps/subdivisions/bwa_adm1.geojson', label: '16 Districts' },
  BY: { count: 7, file: '/maps/subdivisions/blr_adm1.geojson', label: '7 Regions (Oblasts)' },
  BZ: { count: 6, file: '/maps/subdivisions/blz_adm1.geojson', label: '6 Districts' },
  CA: { count: 13, file: '/maps/subdivisions/canada_adm1.geojson', label: '13 Provinces & Territories' },
  CD: { count: 26, file: '/maps/subdivisions/cod_adm1.geojson', label: '26 Provinces' },
  CF: { count: 17, file: '/maps/subdivisions/caf_adm1.geojson', label: '17 Prefectures' },
  CG: { count: 12, file: '/maps/subdivisions/cog_adm1.geojson', label: '12 Departments' },
  CH: { count: 26, file: '/maps/subdivisions/che_adm1.geojson', label: '26 Cantons' },
  CI: { count: 14, file: '/maps/subdivisions/civ_adm1.geojson', label: '14 Autonomous Districts' },
  CK: { count: 11, file: '/maps/subdivisions/cok_adm1.geojson', label: '11 Island Councils' },
  CL: { count: 16, file: '/maps/subdivisions/chl_adm1.geojson', label: '16 Regions' },
  CM: { count: 10, file: '/maps/subdivisions/cmr_adm1.geojson', label: '10 Regions' },
  CN: { count: 33, file: '/maps/subdivisions/chn_adm1.geojson', label: '33 Provinces & Regions' },
  CO: { count: 33, file: '/maps/subdivisions/col_adm1.geojson', label: '33 Departments' },
  CR: { count: 7, file: '/maps/subdivisions/cri_adm1.geojson', label: '7 Provinces' },
  CU: { count: 16, file: '/maps/subdivisions/cub_adm1.geojson', label: '16 Provinces' },
  CV: { count: 22, file: '/maps/subdivisions/cpv_adm1.geojson', label: '22 Municipalities (Concelhos)' },
  CY: { count: 6, file: '/maps/subdivisions/cyp_adm1.geojson', label: '6 Districts' },
  CZ: { count: 14, file: '/maps/subdivisions/cze_adm1.geojson', label: '14 Regions (Kraje)' },
  DE: { count: 16, file: '/maps/subdivisions/germany_adm1.geojson', label: '16 States (Bundesländer)' },
  DJ: { count: 6, file: '/maps/subdivisions/dji_adm1.geojson', label: '6 Regions' },
  DK: { count: 5, file: '/maps/subdivisions/dnk_adm1.geojson', label: '5 Regions' },
  DM: { count: 10, file: '/maps/subdivisions/dma_adm1.geojson', label: '10 Parishes' },
  DO: { count: 32, file: '/maps/subdivisions/dom_adm1.geojson', label: '32 Provinces' },
  DZ: { count: 48, file: '/maps/subdivisions/dza_adm1.geojson', label: '48 Provinces (Wilayas)' },
  EC: { count: 24, file: '/maps/subdivisions/ecu_adm1.geojson', label: '24 Provinces' },
  EE: { count: 15, file: '/maps/subdivisions/est_adm1.geojson', label: '15 Counties' },
  EG: { count: 27, file: '/maps/subdivisions/egy_adm1.geojson', label: '27 Governorates' },
  EH: { count: 4, file: '/maps/subdivisions/esh_adm1.geojson', label: '4 Provinces' },
  ER: { count: 6, file: '/maps/subdivisions/eri_adm1.geojson', label: '6 Regions (Zobas)' },
  ES: { count: 18, file: '/maps/subdivisions/spain_adm1.geojson', label: '18 Autonomous Communities' },
  ET: { count: 11, file: '/maps/subdivisions/eth_adm1.geojson', label: '11 Regions & Chartered Cities' },
  FI: { count: 5, file: '/maps/subdivisions/fin_adm1.geojson', label: '5 Historical Provinces' },
  FJ: { count: 5, file: '/maps/subdivisions/fji_adm1.geojson', label: '5 Divisions' },
  FM: { count: 4, file: '/maps/subdivisions/fsm_adm1.geojson', label: '4 States' },
  FO: { count: 6, file: '/maps/subdivisions/fro_adm1.geojson', label: '6 Regions (Sýslur)' },
  FR: { count: 13, file: '/maps/subdivisions/france_adm1.geojson', label: '13 Regions' },
  GA: { count: 9, file: '/maps/subdivisions/gab_adm1.geojson', label: '9 Provinces' },
  GB: { count: 4, file: '/maps/subdivisions/gbr_adm1.geojson', label: '4 Countries' },
  GD: { count: 7, file: '/maps/subdivisions/grd_adm1.geojson', label: '7 Parishes & Dependency' },
  GE: { count: 12, file: '/maps/subdivisions/geo_adm1.geojson', label: '12 Regions & Autonomous Republics' },
  GF: { count: 2, file: '/maps/subdivisions/guf_adm1.geojson', label: '2 Arrondissements' },
  GG: { count: 12, file: '/maps/subdivisions/ggy_adm1.geojson', label: '12 Parishes' },
  GH: { count: 16, file: '/maps/subdivisions/gha_adm1.geojson', label: '16 Regions' },
  GL: { count: 5, file: '/maps/subdivisions/grl_adm1.geojson', label: '5 Municipalities' },
  GM: { count: 6, file: '/maps/subdivisions/gmb_adm1.geojson', label: '6 Regions & Municipalities' },
  GN: { count: 8, file: '/maps/subdivisions/gin_adm1.geojson', label: '8 Regions' },
  GP: { count: 2, file: '/maps/subdivisions/glp_adm1.geojson', label: '2 Arrondissements' },
  GQ: { count: 7, file: '/maps/subdivisions/gnq_adm1.geojson', label: '7 Provinces' },
  GR: { count: 8, file: '/maps/subdivisions/grc_adm1.geojson', label: '8 Decentralized Administrations' },
  GT: { count: 22, file: '/maps/subdivisions/gtm_adm1.geojson', label: '22 Departments' },
  GU: { count: 19, file: '/maps/subdivisions/gum_adm1.geojson', label: '19 Municipalities' },
  GW: { count: 9, file: '/maps/subdivisions/gnb_adm1.geojson', label: '9 Regions' },
  GY: { count: 10, file: '/maps/subdivisions/guy_adm1.geojson', label: '10 Regions' },
  HK: { count: 18, file: '/maps/subdivisions/hkg_adm1.geojson', label: '18 Districts' },
  HN: { count: 18, file: '/maps/subdivisions/hnd_adm1.geojson', label: '18 Departments' },
  HR: { count: 21, file: '/maps/subdivisions/hrv_adm1.geojson', label: '21 Counties' },
  HT: { count: 10, file: '/maps/subdivisions/hti_adm1.geojson', label: '10 Departments' },
  HU: { count: 20, file: '/maps/subdivisions/hun_adm1.geojson', label: '20 Counties' },
  ID: { count: 34, file: '/maps/subdivisions/idn_adm1.geojson', label: '34 Provinces' },
  IE: { count: 26, file: '/maps/subdivisions/irl_adm1.geojson', label: '26 Counties' },
  IL: { count: 7, file: '/maps/subdivisions/isr_adm1.geojson', label: '7 Districts' },
  IM: { count: 21, file: '/maps/subdivisions/imn_adm1.geojson', label: '21 Parishes & Towns' },
  IN: { count: 36, file: '/maps/subdivisions/ind_adm1.geojson', label: '36 States & Union Territories' },
  IQ: { count: 18, file: '/maps/subdivisions/irq_adm1.geojson', label: '18 Governorates' },
  IR: { count: 31, file: '/maps/subdivisions/irn_adm1.geojson', label: '31 Provinces' },
  IS: { count: 8, file: '/maps/subdivisions/isl_adm1.geojson', label: '8 Regions' },
  IT: { count: 20, file: '/maps/subdivisions/ita_adm1.geojson', label: '20 Regions' },
  JE: { count: 12, file: '/maps/subdivisions/jey_adm1.geojson', label: '12 Parishes' },
  JM: { count: 14, file: '/maps/subdivisions/jam_adm1.geojson', label: '14 Parishes' },
  JO: { count: 12, file: '/maps/subdivisions/jor_adm1.geojson', label: '12 Governorates' },
  JP: { count: 47, file: '/maps/subdivisions/jpn_adm1.geojson', label: '47 Prefectures' },
  KE: { count: 47, file: '/maps/subdivisions/ken_adm1.geojson', label: '47 Counties' },
  KG: { count: 9, file: '/maps/subdivisions/kgz_adm1.geojson', label: '9 Regions' },
  KH: { count: 25, file: '/maps/subdivisions/khm_adm1.geojson', label: '25 Provinces' },
  KM: { count: 3, file: '/maps/subdivisions/com_adm1.geojson', label: '3 Autonomous Islands' },
  KN: { count: 14, file: '/maps/subdivisions/kna_adm1.geojson', label: '14 Parishes' },
  KP: { count: 11, file: '/maps/subdivisions/prk_adm1.geojson', label: '11 Provinces & Cities' },
  KR: { count: 17, file: '/maps/subdivisions/kor_adm1.geojson', label: '17 Provinces & Metropolitan Cities' },
  KW: { count: 6, file: '/maps/subdivisions/kwt_adm1.geojson', label: '6 Governorates' },
  KY: { count: 6, file: '/maps/subdivisions/cym_adm1.geojson', label: '6 Districts' },
  KZ: { count: 14, file: '/maps/subdivisions/kaz_adm1.geojson', label: '14 Regions' },
  LA: { count: 18, file: '/maps/subdivisions/lao_adm1.geojson', label: '18 Provinces' },
  LB: { count: 8, file: '/maps/subdivisions/lbn_adm1.geojson', label: '8 Governorates' },
  LC: { count: 10, file: '/maps/subdivisions/lca_adm1.geojson', label: '10 Districts (Quarters)' },
  LI: { count: 11, file: '/maps/subdivisions/lie_adm1.geojson', label: '11 Municipalities' },
  LK: { count: 25, file: '/maps/subdivisions/lka_adm1.geojson', label: '25 Districts' },
  LR: { count: 15, file: '/maps/subdivisions/lbr_adm1.geojson', label: '15 Counties' },
  LS: { count: 10, file: '/maps/subdivisions/lso_adm1.geojson', label: '10 Districts' },
  LT: { count: 10, file: '/maps/subdivisions/ltu_adm1.geojson', label: '10 Counties' },
  LU: { count: 3, file: '/maps/subdivisions/lux_adm1.geojson', label: '3 Districts' },
  LV: { count: 5, file: '/maps/subdivisions/lva_adm1.geojson', label: '5 Historical Regions' },
  LY: { count: 22, file: '/maps/subdivisions/lby_adm1.geojson', label: '22 Districts' },
  MA: { count: 16, file: '/maps/subdivisions/mar_adm1.geojson', label: '16 Regions' },
  MD: { count: 37, file: '/maps/subdivisions/mda_adm1.geojson', label: '37 Districts (Raions)' },
  ME: { count: 21, file: '/maps/subdivisions/mne_adm1.geojson', label: '21 Municipalities' },
  MG: { count: 6, file: '/maps/subdivisions/mdg_adm1.geojson', label: '6 Provinces' },
  MH: { count: 23, file: '/maps/subdivisions/mhl_adm1.geojson', label: '23 Atolls & Islands' },
  MK: { count: 80, file: '/maps/subdivisions/mkd_adm1.geojson', label: '80 Municipalities' },
  ML: { count: 9, file: '/maps/subdivisions/mli_adm1.geojson', label: '9 Regions' },
  MM: { count: 14, file: '/maps/subdivisions/mmr_adm1.geojson', label: '14 States & Regions' },
  MN: { count: 22, file: '/maps/subdivisions/mng_adm1.geojson', label: '22 Provinces (Aimags)' },
  MP: { count: 4, file: '/maps/subdivisions/mnp_adm1.geojson', label: '4 Municipalities' },
  MQ: { count: 4, file: '/maps/subdivisions/mtq_adm1.geojson', label: '4 Arrondissements' },
  MR: { count: 13, file: '/maps/subdivisions/mrt_adm1.geojson', label: '13 Regions (Wilayas)' },
  MS: { count: 3, file: '/maps/subdivisions/msr_adm1.geojson', label: '3 Parishes' },
  MT: { count: 5, file: '/maps/subdivisions/mlt_adm1.geojson', label: '5 Regions' },
  MU: { count: 16, file: '/maps/subdivisions/mus_adm1.geojson', label: '16 Districts & Islands' },
  MW: { count: 28, file: '/maps/subdivisions/mwi_adm1.geojson', label: '28 Districts' },
  MX: { count: 32, file: '/maps/subdivisions/mex_adm1.geojson', label: '32 States' },
  MY: { count: 16, file: '/maps/subdivisions/mys_adm1.geojson', label: '16 States & Federal Territories' },
  MZ: { count: 11, file: '/maps/subdivisions/moz_adm1.geojson', label: '11 Provinces' },
  NA: { count: 13, file: '/maps/subdivisions/nam_adm1.geojson', label: '13 Regions' },
  NC: { count: 3, file: '/maps/subdivisions/ncl_adm1.geojson', label: '3 Provinces' },
  NE: { count: 8, file: '/maps/subdivisions/ner_adm1.geojson', label: '8 Regions' },
  NG: { count: 37, file: '/maps/subdivisions/nga_adm1.geojson', label: '37 States' },
  NI: { count: 17, file: '/maps/subdivisions/nic_adm1.geojson', label: '17 Departments & Autonomous Regions' },
  NL: { count: 12, file: '/maps/subdivisions/netherlands_adm1.geojson', label: '12 Provinces' },
  NO: { count: 19, file: '/maps/subdivisions/nor_adm1.geojson', label: '19 Counties' },
  NP: { count: 5, file: '/maps/subdivisions/npl_adm1.geojson', label: '5 Development Regions' },
  NR: { count: 14, file: '/maps/subdivisions/nru_adm1.geojson', label: '14 Districts' },
  NZ: { count: 19, file: '/maps/subdivisions/nzl_adm1.geojson', label: '19 Regions' },
  OM: { count: 11, file: '/maps/subdivisions/omn_adm1.geojson', label: '11 Governorates' },
  PA: { count: 13, file: '/maps/subdivisions/pan_adm1.geojson', label: '13 Provinces & Comarcas' },
  PE: { count: 26, file: '/maps/subdivisions/per_adm1.geojson', label: '26 Regions' },
  PF: { count: 5, file: '/maps/subdivisions/pyf_adm1.geojson', label: '5 Administrative Subdivisions' },
  PG: { count: 20, file: '/maps/subdivisions/png_adm1.geojson', label: '20 Provinces & Autonomous Region' },
  PH: { count: 82, file: '/maps/subdivisions/phl_adm1.geojson', label: '82 Provinces' },
  PK: { count: 8, file: '/maps/subdivisions/pak_adm1.geojson', label: '8 Provinces & Territories' },
  PL: { count: 16, file: '/maps/subdivisions/pol_adm1.geojson', label: '16 Voivodeships' },
  PM: { count: 2, file: '/maps/subdivisions/spm_adm1.geojson', label: '2 Communes' },
  PR: { count: 78, file: '/maps/subdivisions/pri_adm1.geojson', label: '78 Municipalities' },
  PS: { count: 2, file: '/maps/subdivisions/pse_adm1.geojson', label: '2 Territories' },
  PT: { count: 20, file: '/maps/subdivisions/prt_adm1.geojson', label: '20 Districts & Autonomous Regions' },
  PW: { count: 16, file: '/maps/subdivisions/plw_adm1.geojson', label: '16 States' },
  PY: { count: 18, file: '/maps/subdivisions/pry_adm1.geojson', label: '18 Departments' },
  QA: { count: 7, file: '/maps/subdivisions/qat_adm1.geojson', label: '7 Municipalities' },
  RE: { count: 4, file: '/maps/subdivisions/reu_adm1.geojson', label: '4 Arrondissements' },
  RO: { count: 42, file: '/maps/subdivisions/rou_adm1.geojson', label: '42 Counties (Județe)' },
  RS: { count: 25, file: '/maps/subdivisions/srb_adm1.geojson', label: '25 Districts' },
  RU: { count: 83, file: '/maps/subdivisions/rus_adm1.geojson', label: '83 Oblasts, Republics & Krais' },
  RW: { count: 5, file: '/maps/subdivisions/rwa_adm1.geojson', label: '5 Provinces' },
  SA: { count: 13, file: '/maps/subdivisions/sau_adm1.geojson', label: '13 Provinces' },
  SB: { count: 10, file: '/maps/subdivisions/slb_adm1.geojson', label: '10 Provinces' },
  SC: { count: 26, file: '/maps/subdivisions/syc_adm1.geojson', label: '26 Districts' },
  SD: { count: 17, file: '/maps/subdivisions/sdn_adm1.geojson', label: '17 States' },
  SE: { count: 21, file: '/maps/subdivisions/swe_adm1.geojson', label: '21 Counties' },
  SG: { count: 5, file: '/maps/subdivisions/sgp_adm1.geojson', label: '5 CDC Districts' },
  SH: { count: 3, file: '/maps/subdivisions/shn_adm1.geojson', label: '3 Constituent Islands' },
  SI: { count: 12, file: '/maps/subdivisions/svn_adm1.geojson', label: '12 Statistical Regions' },
  SJ: { count: 2, file: '/maps/subdivisions/sjm_adm1.geojson', label: '2 Territories' },
  SK: { count: 8, file: '/maps/subdivisions/svk_adm1.geojson', label: '8 Regions (Kraje)' },
  SL: { count: 4, file: '/maps/subdivisions/sle_adm1.geojson', label: '4 Provinces' },
  SM: { count: 9, file: '/maps/subdivisions/smr_adm1.geojson', label: '9 Municipalities (Castelli)' },
  SN: { count: 14, file: '/maps/subdivisions/sen_adm1.geojson', label: '14 Regions' },
  SO: { count: 18, file: '/maps/subdivisions/som_adm1.geojson', label: '18 Regions' },
  SR: { count: 10, file: '/maps/subdivisions/sur_adm1.geojson', label: '10 Districts' },
  SS: { count: 10, file: '/maps/subdivisions/ssd_adm1.geojson', label: '10 States' },
  ST: { count: 2, file: '/maps/subdivisions/stp_adm1.geojson', label: '2 Provinces' },
  SV: { count: 14, file: '/maps/subdivisions/slv_adm1.geojson', label: '14 Departments' },
  SY: { count: 15, file: '/maps/subdivisions/syr_adm1.geojson', label: '15 Governorates' },
  SZ: { count: 4, file: '/maps/subdivisions/swz_adm1.geojson', label: '4 Regions' },
  TC: { count: 6, file: '/maps/subdivisions/tca_adm1.geojson', label: '6 Districts' },
  TD: { count: 22, file: '/maps/subdivisions/tcd_adm1.geojson', label: '22 Provinces' },
  TF: { count: 4, file: '/maps/subdivisions/atf_adm1.geojson', label: '4 Districts' },
  TG: { count: 5, file: '/maps/subdivisions/tgo_adm1.geojson', label: '5 Regions' },
  TH: { count: 77, file: '/maps/subdivisions/tha_adm1.geojson', label: '77 Provinces' },
  TJ: { count: 5, file: '/maps/subdivisions/tjk_adm1.geojson', label: '5 Regions' },
  TK: { count: 3, file: '/maps/subdivisions/tkl_adm1.geojson', label: '3 Atolls' },
  TL: { count: 13, file: '/maps/subdivisions/tls_adm1.geojson', label: '13 Municipalities' },
  TM: { count: 5, file: '/maps/subdivisions/tkm_adm1.geojson', label: '5 Provinces (Welayatlar)' },
  TN: { count: 24, file: '/maps/subdivisions/tun_adm1.geojson', label: '24 Governorates' },
  TO: { count: 5, file: '/maps/subdivisions/ton_adm1.geojson', label: '5 Island Divisions' },
  TR: { count: 81, file: '/maps/subdivisions/tur_adm1.geojson', label: '81 Provinces' },
  TT: { count: 16, file: '/maps/subdivisions/tto_adm1.geojson', label: '16 Regions & Municipalities' },
  TV: { count: 9, file: '/maps/subdivisions/tuv_adm1.geojson', label: '9 Island Councils' },
  TW: { count: 7, file: '/maps/subdivisions/twn_adm1.geojson', label: '7 Provinces & Special Municipalities' },
  TZ: { count: 31, file: '/maps/subdivisions/tza_adm1.geojson', label: '31 Regions' },
  UA: { count: 27, file: '/maps/subdivisions/ukr_adm1.geojson', label: '27 Oblasts' },
  UG: { count: 56, file: '/maps/subdivisions/uga_adm1.geojson', label: '56 Districts' },
  UM: { count: 8, file: '/maps/subdivisions/umi_adm1.geojson', label: '8 Islands' },
  US: { count: 51, file: '/maps/subdivisions/usa_adm1.geojson', label: '51 States' },
  UY: { count: 19, file: '/maps/subdivisions/ury_adm1.geojson', label: '19 Departments' },
  UZ: { count: 14, file: '/maps/subdivisions/uzb_adm1.geojson', label: '14 Regions' },
  VC: { count: 6, file: '/maps/subdivisions/vct_adm1.geojson', label: '6 Parishes' },
  VE: { count: 25, file: '/maps/subdivisions/ven_adm1.geojson', label: '25 States' },
  VG: { count: 5, file: '/maps/subdivisions/vgb_adm1.geojson', label: '5 Districts' },
  VI: { count: 3, file: '/maps/subdivisions/vir_adm1.geojson', label: '3 Districts' },
  VN: { count: 63, file: '/maps/subdivisions/vnm_adm1.geojson', label: '63 Provinces' },
  VU: { count: 6, file: '/maps/subdivisions/vut_adm1.geojson', label: '6 Provinces' },
  WF: { count: 3, file: '/maps/subdivisions/wlf_adm1.geojson', label: '3 Kingdoms' },
  WS: { count: 11, file: '/maps/subdivisions/wsm_adm1.geojson', label: '11 Districts' },
  YE: { count: 21, file: '/maps/subdivisions/yem_adm1.geojson', label: '21 Governorates' },
  YT: { count: 17, file: '/maps/subdivisions/myt_adm1.geojson', label: '17 Communes' },
  ZA: { count: 9, file: '/maps/subdivisions/zaf_adm1.geojson', label: '9 Provinces' },
  ZM: { count: 10, file: '/maps/subdivisions/zmb_adm1.geojson', label: '10 Provinces' },
  ZW: { count: 10, file: '/maps/subdivisions/zwe_adm1.geojson', label: '10 Provinces' }
};

/**
 * Universal resolver: ensures EVERY country with an offline dataset gets
 * real, clickable, authentic subdivision and meta quizzes!
 */
export const SUPERDUPER_EXTRA_REGISTRY: Record<string, SubdivisionQuizOption[]> = {
  "ZA": [
    {
      "id": "za-sd-ac-south_africa_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for South Africa (36 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/south_africa_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 36,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "AL": [
    {
      "id": "al-sd-ac-albania_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Albania (5 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/albania_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 5,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "AR": [
    {
      "id": "ar-sd-ac-argentina_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Argentina (79 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/argentina_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 79,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "ar-sd-ac-argentina_areacodes_2d",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Argentina (13 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/argentina_areacodes_2d.geojson",
      "levelKey": "AreaCode",
      "targetCount": 13,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "ar-sd-ac-argentina_areacodes_4d",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Argentina (300 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/argentina_areacodes_4d.geojson",
      "levelKey": "AreaCode",
      "targetCount": 300,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "CL": [
    {
      "id": "cl-sd-ac-chile_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Chile (24 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/chile_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 24,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "DE": [
    {
      "id": "de-sd-ac-germany_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Germany (74 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/germany_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 74,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "de-sd-post-germany_postcodes1",
      "title": "Postal Codes (1 Digit)",
      "description": "3D Globe 1-digit postal code routing zones for Germany (10 zones).",
      "category": "extra",
      "geojsonFile": "/maps/postcodes/germany_postcodes1.geojson",
      "levelKey": "AreaCode",
      "targetCount": 10,
      "badge": "Postal Codes",
      "color": "amber"
    },
    {
      "id": "de-sd-post-germany_postcodes2",
      "title": "Postal Codes (2 Digits)",
      "description": "3D Globe 2-digit postal code routing zones for Germany (95 zones).",
      "category": "extra",
      "geojsonFile": "/maps/postcodes/germany_postcodes2.geojson",
      "levelKey": "AreaCode",
      "targetCount": 95,
      "badge": "Postal Codes",
      "color": "amber"
    }
  ],
  "AU": [
    {
      "id": "au-sd-ac-australia_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Australia (54 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/australia_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 54,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "AT": [
    {
      "id": "at-sd-ac-austria_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Austria (7 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/austria_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 7,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "at-sd-ac-austria_areacodes_2d",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Austria (38 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/austria_areacodes_2d.geojson",
      "levelKey": "AreaCode",
      "targetCount": 38,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "at-sd-post-austria_postcodes_2d",
      "title": "Postal Codes",
      "description": "3D Globe postal code routing zones for Austria (11 zones).",
      "category": "extra",
      "geojsonFile": "/maps/postcodes/austria_postcodes_2d.geojson",
      "levelKey": "AreaCode",
      "targetCount": 11,
      "badge": "Postal Codes",
      "color": "amber"
    },
    {
      "id": "at-sd-post-austria_postcodes_3d",
      "title": "Postal Codes",
      "description": "3D Globe postal code routing zones for Austria (94 zones).",
      "category": "extra",
      "geojsonFile": "/maps/postcodes/austria_postcodes_3d.geojson",
      "levelKey": "AreaCode",
      "targetCount": 94,
      "badge": "Postal Codes",
      "color": "amber"
    }
  ],
  "BE": [
    {
      "id": "be-sd-ac-belgium_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Belgium (40 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/belgium_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 40,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "BO": [
    {
      "id": "bo-sd-ac-bolivia_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Bolivia (3 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/bolivia_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 3,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "BR": [
    {
      "id": "br-sd-ac-brazil_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Brazil (67 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/brazil_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 67,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "br-sd-post-brazil_postcodes",
      "title": "Postal Codes (2 Digits)",
      "description": "3D Globe 2-digit postal code routing zones for Brazil (69 zones).",
      "category": "extra",
      "geojsonFile": "/maps/postcodes/brazil_postcodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 69,
      "badge": "Postal Codes",
      "color": "amber"
    }
  ],
  "BG": [
    {
      "id": "bg-sd-ac-bulgaria_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Bulgaria (8 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/bulgaria_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 8,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "bg-sd-ac-bulgaria_areacodes2",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Bulgaria (52 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/bulgaria_areacodes2.geojson",
      "levelKey": "AreaCode",
      "targetCount": 52,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "KH": [
    {
      "id": "kh-sd-ac-cambodia_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Cambodia (24 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/cambodia_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 24,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "CA": [
    {
      "id": "ca-sd-ac-canada_areacodes_final",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Canada (19 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/canada_areacodes_final.geojson",
      "levelKey": "AreaCode",
      "targetCount": 19,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "KR": [
    {
      "id": "kr-sd-ac-korea_areacodes_3",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for South Korea (16 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/korea_areacodes_3.geojson",
      "levelKey": "AreaCode",
      "targetCount": 16,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "CR": [
    {
      "id": "cr-sd-ac-costa_rica_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Costa Rica (5 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/costa_rica_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 5,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "CY": [
    {
      "id": "cy-sd-ac-cyprus_phone",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Cyprus (5 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/cyprus_phone.geojson",
      "levelKey": "AreaCode",
      "targetCount": 5,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "cy-sd-post-cyprus_postcodes",
      "title": "Postal Codes (1st Digit)",
      "description": "3D Globe 1st-digit district postal code routing zones for Cyprus (6 zones: 1xxx–9xxx).",
      "category": "extra",
      "geojsonFile": "/maps/postcodes/cyprus_postcodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 6,
      "badge": "Postal Codes",
      "color": "amber"
    }
  ],
  "HR": [
    {
      "id": "hr-sd-ac-croatia_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Croatia (5 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/croatia_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 5,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "hr-sd-ac-croatia_areacodes_02",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Croatia (20 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/croatia_areacodes_02.geojson",
      "levelKey": "AreaCode",
      "targetCount": 20,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "EC": [
    {
      "id": "ec-sd-ac-ecuador_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Ecuador (7 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/ecuador_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 7,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "ES": [
    {
      "id": "es-sd-ac-spain_areacodes_2",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Spain (8 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/spain_areacodes_2.geojson",
      "levelKey": "AreaCode",
      "targetCount": 8,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "es-sd-ac-spain_areacodes_3",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Spain (48 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/spain_areacodes_3.geojson",
      "levelKey": "AreaCode",
      "targetCount": 48,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "es-roads",
      "title": "Road Prefix & Kilometer Markers",
      "description": "Spanish provincial and autonomous road prefix letters on highway kilometer markers (M, B, SE, BI, GC, TF...).",
      "category": "extra",
      "geojsonFile": "/maps/subdivisions/spain_roads.geojson",
      "levelKey": "AreaCode",
      "targetCount": 51,
      "badge": "Road Prefixes",
      "color": "rose"
    }
  ],
  "EE": [
    {
      "id": "ee-sd-ac-estonia_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Estonia (4 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/estonia_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 4,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "FI": [
    {
      "id": "fi-sd-ac-finland_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Finland (13 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/finland_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 13,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "FR": [
    {
      "id": "fr-sd-ac-france_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for France (71 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/france_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 71,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "fr-sd-ac-france_areacodes_bis",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for France (71 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/france_areacodes_bis.geojson",
      "levelKey": "AreaCode",
      "targetCount": 71,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "fr-sd-post-france_postcodes",
      "title": "Postal Codes (2 Digits)",
      "description": "3D Globe 2-digit postal code routing zones for France (95 zones).",
      "category": "extra",
      "geojsonFile": "/maps/postcodes/france_postcodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 95,
      "badge": "Postal Codes",
      "color": "amber"
    }
  ],
  "GB": [
    {
      "id": "gb-sd-ac-uk_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for United Kingdom (630 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/uk_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 630,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "gb-sd-ac-uk_areacodes_1",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for United Kingdom (591 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/uk_areacodes_1.geojson",
      "levelKey": "AreaCode",
      "targetCount": 591,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "gb-sd-ac-uk_areacodes_2",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for United Kingdom (4 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/uk_areacodes_2.geojson",
      "levelKey": "AreaCode",
      "targetCount": 4,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "gb-sd-ac-uk_areacodes_ni",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for United Kingdom (34 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/uk_areacodes_ni.geojson",
      "levelKey": "AreaCode",
      "targetCount": 34,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "GE": [
    {
      "id": "ge-sd-ac-georgia_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Georgia (74 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/georgia_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 74,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "GR": [
    {
      "id": "gr-sd-ac-greece_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Greece (52 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/greece_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 52,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "HU": [
    {
      "id": "hu-sd-ac-hungary_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Hungary (9 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/hungary_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 9,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "ID": [
    {
      "id": "id-sd-ac-indonesia_areacode2",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Indonesia (6 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/indonesia_areacode2.geojson",
      "levelKey": "AreaCode",
      "targetCount": 6,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "id-sd-ac-indonesia_areacode3",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Indonesia (44 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/indonesia_areacode3.geojson",
      "levelKey": "AreaCode",
      "targetCount": 44,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "id-sd-post-indonesia_postcodes",
      "title": "Postal Codes (2 Digits)",
      "description": "3D Globe 2-digit postal code routing zones for Indonesia (77 zones).",
      "category": "extra",
      "geojsonFile": "/maps/postcodes/indonesia_postcodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 77,
      "badge": "Postal Codes",
      "color": "amber"
    }
  ],
  "IL": [
    {
      "id": "il-sd-ac-israel_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Israel (5 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/israel_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 5,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "IE": [
    {
      "id": "ie-sd-ac-ireland_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Ireland (47 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/ireland_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 47,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "IT": [
    {
      "id": "it-sd-ac-italy_areacodes_2d",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Italy (9 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/italy_areacodes_2d.geojson",
      "levelKey": "AreaCode",
      "targetCount": 9,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "it-sd-ac-italy_areacodes_3d",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Italy (71 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/italy_areacodes_3d.geojson",
      "levelKey": "AreaCode",
      "targetCount": 71,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "it-sd-ac-italy_areacodes_4d",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Italy (231 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/italy_areacodes_4d.geojson",
      "levelKey": "AreaCode",
      "targetCount": 231,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "JP": [
    {
      "id": "jp-sd-ac-japan_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Japan (59 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/japan_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 59,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "MY": [
    {
      "id": "my-sd-ac-malaysia_areacodes_2digits",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Malaysia (7 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/malaysia_areacodes_2digits.geojson",
      "levelKey": "AreaCode",
      "targetCount": 7,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "my-sd-ac-malaysia_areacodes_3digits",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Malaysia (52 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/malaysia_areacodes_3digits.geojson",
      "levelKey": "AreaCode",
      "targetCount": 52,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "my-sd-post-malaysia_postcodes",
      "title": "Postal Codes (2 Digits)",
      "description": "3D Globe 2-digit postal code routing zones for Malaysia (63 zones).",
      "category": "extra",
      "geojsonFile": "/maps/postcodes/malaysia_postcodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 63,
      "badge": "Postal Codes",
      "color": "amber"
    },
    {
      "id": "my-sd-post-malaysia_postcodes_kl",
      "title": "Postal Codes (Kuala Lumpur)",
      "description": "3D Globe postal code routing zones for Kuala Lumpur, Malaysia (23 zones).",
      "category": "extra",
      "geojsonFile": "/maps/postcodes/malaysia_postcodes_kl.geojson",
      "levelKey": "AreaCode",
      "targetCount": 23,
      "badge": "Postal Codes",
      "color": "amber"
    }
  ],
  "MX": [
    {
      "id": "mx-sd-ac-mexico_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Mexico (8 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/mexico_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 8,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "mx-sd-ac-mexico_areacodes_2xx",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Mexico (40 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/mexico_areacodes_2xx.geojson",
      "levelKey": "AreaCode",
      "targetCount": 40,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "mx-sd-ac-mexico_areacodes_3xx",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Mexico (58 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/mexico_areacodes_3xx.geojson",
      "levelKey": "AreaCode",
      "targetCount": 58,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "mx-sd-ac-mexico_areacodes_4xx",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Mexico (74 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/mexico_areacodes_4xx.geojson",
      "levelKey": "AreaCode",
      "targetCount": 74,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "mx-sd-ac-mexico_areacodes_5xx",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Mexico (10 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/mexico_areacodes_5xx.geojson",
      "levelKey": "AreaCode",
      "targetCount": 10,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "mx-sd-ac-mexico_areacodes_6xx",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Mexico (60 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/mexico_areacodes_6xx.geojson",
      "levelKey": "AreaCode",
      "targetCount": 60,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "mx-sd-ac-mexico_areacodes_7xx",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Mexico (70 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/mexico_areacodes_7xx.geojson",
      "levelKey": "AreaCode",
      "targetCount": 70,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "mx-sd-ac-mexico_areacodes_8xx",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Mexico (36 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/mexico_areacodes_8xx.geojson",
      "levelKey": "AreaCode",
      "targetCount": 36,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "mx-sd-ac-mexico_areacodes_9xx",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Mexico (48 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/mexico_areacodes_9xx.geojson",
      "levelKey": "AreaCode",
      "targetCount": 48,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "mx-sd-ac-mexico_areacodes_full",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Mexico (396 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/mexico_areacodes_full.geojson",
      "levelKey": "AreaCode",
      "targetCount": 396,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "mx-sd-ac-mexico_areacodes_phone2d",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Mexico (59 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/mexico_areacodes_phone2d.geojson",
      "levelKey": "AreaCode",
      "targetCount": 59,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "mx-sd-post-mexico_postcodes",
      "title": "Postal Codes (1st Digit / States)",
      "description": "3D Globe state-level postal code routing zones for Mexico (32 zones).",
      "category": "extra",
      "geojsonFile": "/maps/postcodes/mexico_postcodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 32,
      "badge": "Postal Codes",
      "color": "amber"
    },
    {
      "id": "mx-sd-post-mexico_postcodes_2",
      "title": "Postal Codes (2 Digits)",
      "description": "3D Globe 2-digit postal code routing zones for Mexico (74 zones).",
      "category": "extra",
      "geojsonFile": "/maps/postcodes/mexico_postcodes_2.geojson",
      "levelKey": "AreaCode",
      "targetCount": 74,
      "badge": "Postal Codes",
      "color": "amber"
    },
    {
      "id": "mx-sd-post-mexico_surroundings_postcodes",
      "title": "Postal Codes (Mexico City & Surroundings)",
      "description": "3D Globe postal code routing zones for Central Mexico (24 zones).",
      "category": "extra",
      "geojsonFile": "/maps/postcodes/mexico_surroundings_postcodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 24,
      "badge": "Postal Codes",
      "color": "amber"
    }
  ],
  "NL": [
    {
      "id": "nl-sd-ac-netherlands_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Netherlands (48 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/netherlands_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 48,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "NP": [
    {
      "id": "np-sd-ac-nepal_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Nepal (57 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/nepal_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 57,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "NZ": [
    {
      "id": "nz-sd-ac-nz_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for New Zealand (5 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/nz_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 5,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "NO": [
    {
      "id": "no-sd-ac-norway_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Norway (24 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/norway_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 24,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "PA": [
    {
      "id": "pa-sd-ac-panama_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Panama (7 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/panama_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 7,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "PE": [
    {
      "id": "pe-sd-ac-peru_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Peru (6 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/peru_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 6,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "pe-sd-ac-peru_areacodes_2d",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Peru (24 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/peru_areacodes_2d.geojson",
      "levelKey": "AreaCode",
      "targetCount": 24,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "PH": [
    {
      "id": "ph-sd-ac-philippines_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Philippines (37 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/philippines_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 37,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "PL": [
    {
      "id": "pl-sd-ac-poland_areacodes1",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Poland (9 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/poland_areacodes1.geojson",
      "levelKey": "AreaCode",
      "targetCount": 9,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "pl-sd-ac-poland_areacodes2",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Poland (49 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/poland_areacodes2.geojson",
      "levelKey": "AreaCode",
      "targetCount": 49,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "pl-sd-post-poland_postcodes",
      "title": "Postal Codes",
      "description": "3D Globe postal code routing zones for Poland (83 zones).",
      "category": "extra",
      "geojsonFile": "/maps/postcodes/poland_postcodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 83,
      "badge": "Postal Codes",
      "color": "amber"
    }
  ],
  "PT": [
    {
      "id": "pt-sd-ac-portugal_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Portugal (9 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/portugal_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 9,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "pt-sd-ac-portugal_areacodes_2digits",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Portugal (51 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/portugal_areacodes_2digits.geojson",
      "levelKey": "AreaCode",
      "targetCount": 51,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "RO": [
    {
      "id": "ro-sd-ac-romania_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Romania (41 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/romania_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 41,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "RU": [
    {
      "id": "ru-sd-ac-russia_areacodes_2_latin",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Russia (18 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/russia_areacodes_2_latin.geojson",
      "levelKey": "AreaCode",
      "targetCount": 18,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "ru-sd-ac-russia_areacodes_3_latin",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Russia (81 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/russia_areacodes_3_latin.geojson",
      "levelKey": "AreaCode",
      "targetCount": 81,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "ru-sd-ac-russia_mobile",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Russia (8 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/russia_mobile.geojson",
      "levelKey": "AreaCode",
      "targetCount": 8,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "RS": [
    {
      "id": "rs-sd-ac-serbia_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Serbia (27 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/serbia_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 27,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "SK": [
    {
      "id": "sk-sd-ac-slovakia_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Slovakia (25 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/slovakia_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 25,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "sk-sd-post-slovakia_postcodes",
      "title": "Postal Codes",
      "description": "3D Globe postal code routing zones for Slovakia (37 zones).",
      "category": "extra",
      "geojsonFile": "/maps/postcodes/slovakia_postcodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 37,
      "badge": "Postal Codes",
      "color": "amber"
    }
  ],
  "LK": [
    {
      "id": "lk-sd-ac-srilanka_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Sri Lanka (29 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/srilanka_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 29,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "SE": [
    {
      "id": "se-sd-ac-sweden_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Sweden (8 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/sweden_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 8,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "se-sd-ac-sweden_areacodes_2d",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Sweden (68 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/sweden_areacodes_2d.geojson",
      "levelKey": "AreaCode",
      "targetCount": 68,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "CH": [
    {
      "id": "ch-sd-ac-switzerland_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Switzerland (19 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/switzerland_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 19,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "TW": [
    {
      "id": "tw-sd-ac-taiwan_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Taiwan (18 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/taiwan_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 18,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "tw-poles",
      "title": "Electric Pole Grid Codes",
      "description": "Taiwan Taipower electric utility pole coordinate grid letters (A\u2013W).",
      "category": "extra",
      "geojsonFile": "/maps/subdivisions/taiwan_poles.geojson",
      "levelKey": "AreaCode",
      "targetCount": 21,
      "badge": "Pole Grid",
      "color": "amber"
    }
  ],
  "CZ": [
    {
      "id": "cz-sd-ac-czechia_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Czechia (14 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/czechia_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 14,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "TH": [
    {
      "id": "th-sd-ac-thailand_areacodes_final",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Thailand (21 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/thailand_areacodes_final.geojson",
      "levelKey": "AreaCode",
      "targetCount": 21,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "TN": [
    {
      "id": "tn-sd-ac-tunisia_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Tunisia (8 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/tunisia_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 8,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "TR": [
    {
      "id": "tr-sd-ac-turkey_areacodes_2d",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for T\\u00fcrkiye (24 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/turkey_areacodes_2d.geojson",
      "levelKey": "AreaCode",
      "targetCount": 24,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "tr-sd-ac-turkey_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for T\\u00fcrkiye (82 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/turkey_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 82,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "tr-sd-post-turkey_postcodes",
      "title": "Postal Codes (2 Digits)",
      "description": "3D Globe 2-digit postal code routing zones for T\\u00fcrkiye (81 zones).",
      "category": "extra",
      "geojsonFile": "/maps/postcodes/turkey_postcodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 81,
      "badge": "Postal Codes",
      "color": "amber"
    },
    {
      "id": "tr-adm2-belediyeler",
      "title": "Subdivision Level 2, Turkey (Belediyeler / Districts)",
      "description": "All 949 Turkish districts (\u0130l\u00e7eler / Belediyeler) across all 81 provinces.",
      "category": "adm2",
      "geojsonFile": "/maps/subdivisions/tur_adm2.geojson",
      "levelKey": "NAME_2",
      "targetCount": 949,
      "badge": "Belediyeler",
      "color": "indigo"
    }
  ],
  "UA": [
    {
      "id": "ua-sd-ac-ukraine_areacodes_1",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Ukraine (4 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/ukraine_areacodes_1.geojson",
      "levelKey": "AreaCode",
      "targetCount": 4,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "ua-sd-ac-ukraine_areacodes_2",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Ukraine (27 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/ukraine_areacodes_2.geojson",
      "levelKey": "AreaCode",
      "targetCount": 27,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "UY": [
    {
      "id": "uy-sd-ac-uruguay_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Uruguay (7 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/uruguay_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 7,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "uy-sd-ac-uruguay_areacodes3",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Uruguay (19 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/uruguay_areacodes3.geojson",
      "levelKey": "AreaCode",
      "targetCount": 19,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "VN": [
    {
      "id": "vn-sd-ac-vietnam_areacodes",
      "title": "Area Code",
      "description": "3D Globe telephone area code quiz for Vietnam (63 zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/vietnam_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 63,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "vn-adm1-2025",
      "title": "Subdivision Level 1, Vietnam (2025 Merged Provinces)",
      "description": "New 2025 merged administrative provinces and centrally-governed cities of Vietnam (34 provinces).",
      "category": "adm1",
      "geojsonFile": "/maps/subdivisions/vnm_adm1_2025.geojson",
      "levelKey": "NAME_1",
      "targetCount": 34,
      "badge": "2025 ADM1",
      "color": "sky"
    }
  ],
  "GH": [
    {
      "id": "gh-areacodes",
      "title": "Area Code (3 Digits)",
      "description": "3D Globe telephone area code quiz for Ghana (8 regional zones: 030–039).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/ghana_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 8,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "gh-sd-post-ghana_postcodes",
      "title": "Postal Codes",
      "description": "3D Globe postal code routing zones for Ghana (10 zones).",
      "category": "extra",
      "geojsonFile": "/maps/postcodes/ghana_postcodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 10,
      "badge": "Postal Codes",
      "color": "amber"
    }
  ],
  "KE": [
    {
      "id": "ke-areacodes",
      "title": "Area Code (3 Digits)",
      "description": "3D Globe telephone area code quiz for Kenya (20 regional zones: 020–068).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/kenya_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 20,
      "badge": "Area Code",
      "color": "emerald"
    },
    {
      "id": "ke-sd-post-kenya_postcodes",
      "title": "Postal Codes (3 Digits)",
      "description": "3D Globe 3-digit postal code routing zones for Kenya (43 zones).",
      "category": "extra",
      "geojsonFile": "/maps/postcodes/kenya_postcodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 43,
      "badge": "Postal Codes",
      "color": "amber"
    }
  ],
  "NG": [
    {
      "id": "ng-areacodes",
      "title": "Area Code (2 & 3 Digits)",
      "description": "3D Globe telephone area code quiz for Nigeria (28 state zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/nigeria_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 28,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "SN": [
    {
      "id": "sn-areacodes",
      "title": "Area Code (3 & 4 Digits)",
      "description": "3D Globe telephone area code quiz for Senegal (7 regional zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/senegal_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 7,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "BW": [
    {
      "id": "bw-areacodes",
      "title": "Area Code (2 Digits)",
      "description": "3D Globe telephone area code quiz for Botswana (9 regional zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/botswana_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 9,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "UG": [
    {
      "id": "ug-areacodes",
      "title": "Area Code (3 Digits)",
      "description": "3D Globe telephone area code quiz for Uganda (4 regional zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/uganda_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 4,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "SZ": [
    {
      "id": "sz-areacodes",
      "title": "Area Code (2 Digits)",
      "description": "3D Globe telephone area code quiz for Eswatini (4 regional zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/eswatini_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 4,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "MG": [
    {
      "id": "mg-areacodes",
      "title": "Area Code (2 Digits)",
      "description": "3D Globe telephone area code quiz for Madagascar (6 provincial zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/madagascar_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 6,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "CO": [
    {
      "id": "co-areacodes",
      "title": "Area Code (3 Digits — 60X)",
      "description": "3D Globe telephone area code quiz for Colombia (7 regional 60X zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/colombia_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 7,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "GT": [
    {
      "id": "gt-areacodes",
      "title": "Area Code (1 Digit)",
      "description": "3D Globe telephone area code quiz for Guatemala (3 zones: 2, 6, 7).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/guatemala_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 3,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "KZ": [
    {
      "id": "kz-areacodes",
      "title": "Area Code (3 Digits — 7XX)",
      "description": "3D Globe telephone area code quiz for Kazakhstan (14 regional 7XX zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/kazakhstan_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 14,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "KG": [
    {
      "id": "kg-areacodes",
      "title": "Area Code (3 Digits — 3XX)",
      "description": "3D Globe telephone area code quiz for Kyrgyzstan (8 regional 3XX zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/kyrgyzstan_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 8,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "MN": [
    {
      "id": "mn-areacodes",
      "title": "Area Code (2 & 3 Digits)",
      "description": "3D Globe telephone area code quiz for Mongolia (22 aimag zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/mongolia_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 22,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "BD": [
    {
      "id": "bd-areacodes",
      "title": "Area Code (2 to 4 Digits)",
      "description": "3D Globe telephone area code quiz for Bangladesh (8 divisional zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/bangladesh_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 8,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "AE": [
    {
      "id": "ae-areacodes",
      "title": "Area Code (2 Digits)",
      "description": "3D Globe telephone area code quiz for UAE (02, 04, 06, 07, 09).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/uae_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 4,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "JO": [
    {
      "id": "jo-areacodes",
      "title": "Area Code (2 Digits)",
      "description": "3D Globe telephone area code quiz for Jordan (02, 03, 05, 06).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/jordan_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 4,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "LT": [
    {
      "id": "lt-areacodes",
      "title": "Area Code (2 to 4 Digits)",
      "description": "3D Globe telephone area code quiz for Lithuania (10 county zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/lithuania_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 10,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "LV": [
    {
      "id": "lv-areacodes",
      "title": "Area Code (2 & 3 Digits)",
      "description": "3D Globe telephone area code quiz for Latvia (5 regional zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/latvia_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 5,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "SI": [
    {
      "id": "si-areacodes",
      "title": "Area Code (2 Digits)",
      "description": "3D Globe telephone area code quiz for Slovenia (6 regional zones).",
      "category": "areacodes",
      "geojsonFile": "/maps/areacodes/slovenia_areacodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 6,
      "badge": "Area Code",
      "color": "emerald"
    }
  ],
  "IN": [
    {
      "id": "in-sd-post-india_postcodes",
      "title": "Postal Codes (1-Digit PIN Zones)",
      "description": "3D Globe 1-digit PIN postal zones for India (25 zones).",
      "category": "extra",
      "geojsonFile": "/maps/postcodes/india_postcodes.geojson",
      "levelKey": "AreaCode",
      "targetCount": 25,
      "badge": "Postal Codes",
      "color": "amber"
    },
    {
      "id": "in-sd-post-india_postcodes_individual2",
      "title": "Postal Codes (2-Digit PIN Circles)",
      "description": "3D Globe 2-digit PIN postal circles for India (70 zones).",
      "category": "extra",
      "geojsonFile": "/maps/postcodes/india_postcodes_individual2.geojson",
      "levelKey": "AreaCode",
      "targetCount": 70,
      "badge": "Postal Codes",
      "color": "amber"
    },
    {
      "id": "in-sd-post-india_postcodes_3d",
      "title": "Postal Codes (3-Digit PIN Districts)",
      "description": "3D Globe 3-digit PIN sorting districts for India (403 zones).",
      "category": "extra",
      "geojsonFile": "/maps/postcodes/india_postcodes_3d.geojson",
      "levelKey": "AreaCode",
      "targetCount": 403,
      "badge": "Postal Codes",
      "color": "amber"
    },
    {
      "id": "in-sd-post-india_gstin",
      "title": "GSTIN State Tax Codes",
      "description": "3D Globe 2-digit GSTIN tax state codes for India (36 zones).",
      "category": "extra",
      "geojsonFile": "/maps/postcodes/india_gstin.geojson",
      "levelKey": "AreaCode",
      "targetCount": 36,
      "badge": "GSTIN Codes",
      "color": "amber"
    },
    {
      "id": "in-adm2-districts",
      "title": "Subdivision Level 2, India (Districts)",
      "description": "All 750 Indian administrative districts across all states and union territories. Select specific states or practice all!",
      "category": "adm2",
      "geojsonFile": "/maps/subdivisions/ind_adm2.geojson",
      "levelKey": "NAME_2",
      "targetCount": 750,
      "badge": "Districts",
      "color": "indigo"
    }
  ],
  "QA": [
    {
      "id": "qa-sd-post-qatar_zones",
      "title": "Postal & Municipality Zones",
      "description": "3D Globe municipality & postal routing zones for Qatar (30 zones).",
      "category": "extra",
      "geojsonFile": "/maps/postcodes/qatar_zones.geojson",
      "levelKey": "AreaCode",
      "targetCount": 30,
      "badge": "Zones",
      "color": "amber"
    }
  ]
};

// Closed non-geographic numbering plan countries (marked "/" in the 98-country reference table)
export const CLOSED_AREA_CODE_COUNTRIES = new Set<string>([
  'CR', 'DO', 'AD', 'DK', 'IS', 'LU', 'MT', 'NO', 'RW', 'ST', 'HK', 'OM', 'QA', 'SG'
]);

// Official geographical Area Code level count (1, 2, or 3 Levels) per country
export const COUNTRY_AREA_CODE_LEVEL_COUNTS: Record<string, 1 | 2 | 3> = {
  // 1-Level Countries (all codes share the same prefix or only have 1 flat digit level)
  CA: 1, US: 1, GT: 1, PA: 1, CO: 1, EC: 1, BO: 1,
  AL: 1, CY: 1, EE: 1, FI: 1, HU: 1, SI: 1, CH: 1, LV: 1,
  SZ: 1, GH: 1, MG: 1, NA: 1, SN: 1, TN: 1, UG: 1,
  BT: 1, IL: 1, JO: 1, KG: 1, LB: 1, AE: 1,
  NZ: 1,

  // 2-Level Countries (Regional 1st/2nd Digit Group -> Full Area Codes)
  MX: 2, BR: 2, CL: 2, PE: 2, UY: 2, PY: 2,
  AT: 2, BE: 2, BA: 2, BG: 2, DE: 2, FR: 2, GR: 2, IE: 2, HR: 2,
  LT: 2, ME: 2, MK: 2, NL: 2, PL: 2, PT: 2, RO: 2, RS: 2, SK: 2,
  ES: 2, CZ: 2, TR: 2, SE: 2, UA: 2,
  BW: 2, KE: 2, LS: 2, NG: 2, ZA: 2,
  BD: 2, KH: 2, PH: 2, GE: 2, ID: 2, JP: 2, KZ: 2, LA: 2, MY: 2,
  MN: 2, NP: 2, LK: 2, TW: 2, TH: 2, VN: 2, KR: 2,

  // 3-Level Countries (Macro-Zone -> Intermediate 3-Digit Prefix -> Full Area Code)
  AR: 3, AU: 3, IT: 3, GB: 3, IN: 3, RU: 3
};

// Best multi-level Area Code GeoJSON/TopoJSON file overrides so multi-level countries always load their full dataset
const BEST_AREA_CODE_FILES: Record<string, { file: string; count: number }> = {
  AU: { file: '/maps/areacodes/australia_areacodes.geojson', count: 54 },
  FR: { file: '/maps/areacodes/fr_areacodes_3.geojson', count: 71 },
  DE: { file: '/maps/areacodes/de_areacodes_2.geojson', count: 74 },
  IT: { file: '/maps/areacodes/italy_areacodes_4d.geojson', count: 231 },
  ES: { file: '/maps/areacodes/spain_areacodes_3.geojson', count: 48 },
  PT: { file: '/maps/areacodes/portugal_areacodes_2digits.geojson', count: 51 },
  GB: { file: '/maps/areacodes/uk_areacodes.geojson', count: 630 },
  PL: { file: '/maps/areacodes/pl_areacodes.geojson', count: 49 },
  SE: { file: '/maps/areacodes/sweden_areacodes_2d.geojson', count: 68 },
  AT: { file: '/maps/areacodes/at_areacodes.geojson', count: 38 },
  BG: { file: '/maps/areacodes/bulgaria_areacodes2.geojson', count: 52 },
  GR: { file: '/maps/areacodes/greece_areacodes.geojson', count: 52 },
  NL: { file: '/maps/areacodes/nl_areacodes.geojson', count: 48 },
  UA: { file: '/maps/areacodes/ua_areacodes.geojson', count: 27 },
  RU: { file: '/maps/areacodes/ru_areacodes_3.geojson', count: 81 },
  TR: { file: '/maps/areacodes/tr_areacodes_3.geojson', count: 82 },
  RO: { file: '/maps/areacodes/ro_areacodes.geojson', count: 41 },
  VN: { file: '/maps/areacodes/vietnam_areacodes.geojson', count: 63 },
  BR: { file: '/maps/areacodes/br_areacodes.geojson', count: 67 },
  AR: { file: '/maps/areacodes/argentina_areacodes_4d.geojson', count: 300 },
  MX: { file: '/maps/areacodes/mx_areacodes.geojson', count: 395 },
  MY: { file: '/maps/areacodes/malaysia_areacodes_3digits.geojson', count: 52 },
  ID: { file: '/maps/areacodes/indonesia_areacode3.geojson', count: 44 },
  JP: { file: '/maps/areacodes/jp_areacodes.geojson', count: 59 },
  HR: { file: '/maps/areacodes/hr_areacodes.geojson', count: 20 },
  PE: { file: '/maps/areacodes/pe_areacodes.geojson', count: 24 },
  UY: { file: '/maps/areacodes/uy_areacodes.geojson', count: 19 },
  CL: { file: '/maps/areacodes/chile_areacodes.geojson', count: 24 }
};

export function getCountrySubdivisions(country: { id: string; iso3?: string; name: string }): SubdivisionQuizOption[] {
  const code = country.id.toUpperCase();
  const existing = COUNTRY_SUBDIVISION_REGISTRY[code];
  const rawList: SubdivisionQuizOption[] = existing?.quizzes ? [...existing.quizzes] : [];

  // Merge SuperDuper Area Codes, Postal Codes & Special Level-2 Quizzes
  const sdExtras = SUPERDUPER_EXTRA_REGISTRY[code] || [];
  const seenFiles = new Set(rawList.map((q) => `${q.geojsonFile}:${q.filterType || 'all'}:${q.category}`));
  for (const ex of sdExtras) {
    const key = `${ex.geojsonFile}:${ex.filterType || 'all'}:${ex.category}`;
    if (!seenFiles.has(key)) {
      seenFiles.add(key);
      rawList.push(ex);
    }
  }

  // Ensure verified Level 1 Subdivision is present for every country
  const offlineInfo =
    OFFLINE_ADM1_MAP[code] ||
    (country.iso3 ? OFFLINE_ADM1_MAP[country.iso3.toUpperCase()] : undefined);

  if (offlineInfo) {
    const hasAdm1 = rawList.some((q) => q.category === 'adm1');
    if (!hasAdm1) {
      const cleanLabel = (offlineInfo.label || 'Provinces').replace(/^\d+\s*/, '').trim();
      rawList.unshift({
        id: `${country.id.toLowerCase()}-adm1-verified`,
        title: `Subdivision Level 1, ${country.name} (${cleanLabel})`,
        description: `3D Globe subdivision quiz for ${country.name} (${offlineInfo.count} ${cleanLabel}).`,
        category: 'adm1',
        geojsonFile: offlineInfo.file,
        levelKey: 'NAME_1',
        targetCount: offlineInfo.count,
        badge: 'Level 1',
        color: 'sky'
      });
    }
  }

  // Consolidate Area Code quizzes to ONE comprehensive entry per country (excluding closed non-geographic plans)
  const areaCodeOptions = CLOSED_AREA_CODE_COUNTRIES.has(code)
    ? []
    : rawList.filter((q) => q.category === 'areacodes' && !q.geojsonFile.includes('mobile'));
  let unifiedAreaCode: SubdivisionQuizOption | null = null;
  if (areaCodeOptions.length > 0) {
    const unFiltered = areaCodeOptions.filter((q) => !q.filterType || q.filterType === 'all');
    const pool = unFiltered.length > 0 ? unFiltered : areaCodeOptions;
    pool.sort((a, b) => b.targetCount - a.targetCount);
    const best = pool[0];
    const override = BEST_AREA_CODE_FILES[code];
    const numLevels = COUNTRY_AREA_CODE_LEVEL_COUNTS[code] || 2;
    const levelLabel = numLevels === 1 ? '1 Level' : `${numLevels} Levels`;
    unifiedAreaCode = {
      ...best,
      id: `${code.toLowerCase()}-areacodes`,
      geojsonFile: override ? override.file : best.geojsonFile,
      targetCount: override ? override.count : best.targetCount,
      filterType: undefined,
      title: `Area Codes (${levelLabel})`,
      badge: `Area Codes (${levelLabel})`
    };
  }

  // Inject official ADM2 & Official Higher-Level Regional datasets
  const EXTRA_ADM2_DATASETS: Record<string, SubdivisionQuizOption> = {
    LU: {
      id: 'lu-adm2',
      title: 'Subdivision Level 2, Luxembourg (12 Cantons)',
      description: 'All 12 Cantons of Luxembourg (Clervaux, Wiltz, Vianden, Diekirch, Redange, Echternach, Grevenmacher, Remich, Mersch, Capellen, Luxembourg, Esch-sur-Alzette).',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/lux_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 12,
      badge: 'Level 2',
      color: 'indigo'
    },
    IT: {
      id: 'it-adm2',
      title: 'Subdivision Level 2, Italy (107 Provinces)',
      description: 'All 107 Italian Provinces & Metropolitan Cities with their 2-letter license/highway codes (MI, RM, NA, TO, FI, VE, BO, PA...).',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/ita_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 107,
      badge: 'Level 2',
      color: 'indigo'
    },
    FI: {
      id: 'fi-adm2',
      title: 'Subdivision Level 2, Finland (18 Maakunnat)',
      description: 'All 18 modern Regions (Maakunnat) of Finland (Uusimaa, Pirkanmaa, Varsinais-Suomi, Lapland...).',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/fin_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 18,
      badge: 'Level 2',
      color: 'indigo'
    },
    DK: {
      id: 'dk-adm2',
      title: 'Subdivision Level 2, Denmark (11 Landsdele)',
      description: 'All 11 Danish provinces (Landsdele: København, Nordsjælland, Fyn, Østjylland, Sydjylland, Nordjylland, Bornholm...).',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/dnk_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 11,
      badge: 'Level 2',
      color: 'indigo'
    },
    AT: {
      id: 'at-adm2',
      title: 'Subdivision Level 2, Austria (35 Regionalbezirke)',
      description: 'All 35 Austrian NUTS-3 / regional districts (Innsbruck, Graz, Linz-Wels, Weinviertel, Waldviertel, Mostviertel, Pinzgau-Pongau...).',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/aut_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 35,
      badge: 'Level 2',
      color: 'indigo'
    },
    GB: {
      id: 'gb-adm2',
      title: 'Subdivision Level 2, United Kingdom (182 Counties & Unitary Authorities)',
      description: 'All 182 UK ceremonial counties, unitary authorities, and council areas across England, Scotland, Wales, and Northern Ireland.',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/gbr_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 182,
      badge: 'Level 2',
      color: 'indigo'
    },
    TR: {
      id: 'tr-adm2',
      title: 'Subdivision Level 2, Turkey (929 Districts / İlçeler)',
      description: 'All 929 administrative districts (İlçeler) of Turkey across all 81 provinces.',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/tur_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 929,
      badge: 'Level 2',
      color: 'indigo'
    },
    US: {
      id: 'us-adm2',
      title: 'Subdivision Level 2, United States (3143 Counties)',
      description: 'All 3,143 US counties, parishes, and boroughs across all 50 states + DC. Select specific states in the Interactive Area Filter to practice county-by-county!',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/usa_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 3143,
      badge: 'Level 2',
      color: 'indigo'
    },
    CH: {
      id: 'ch-adm2',
      title: 'Subdivision Level 2, Switzerland (169 Districts / Bezirke)',
      description: 'All 169 official districts (Bezirke / Districts / Distretti) of Switzerland across its 26 Cantons.',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/che_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 169,
      badge: 'Level 2',
      color: 'indigo'
    },
    CZ: {
      id: 'cz-adm2',
      title: 'Subdivision Level 2, Czechia (77 Districts / Okresy)',
      description: 'All official districts (Okresy) of the Czech Republic across its 14 Regions (Kraje).',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/cze_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 98,
      badge: 'Level 2',
      color: 'indigo'
    },
    PT: {
      id: 'pt-adm2',
      title: 'Subdivision Level 2, Portugal (308 Municipalities / Concelhos)',
      description: 'All 308 Portuguese municipalities (Concelhos / Municípios) across mainland Portugal, Azores, and Madeira.',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/prt_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 308,
      badge: 'Level 2',
      color: 'indigo'
    },
    PL: {
      id: 'pl-adm2',
      title: 'Subdivision Level 2, Poland (380 Counties / Powiaty)',
      description: 'All 380 Polish counties (Powiaty) and city counties across all 16 Voivodeships.',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/pol_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 380,
      badge: 'Level 2',
      color: 'indigo'
    },
    SE: {
      id: 'se-adm2',
      title: 'Subdivision Level 2, Sweden (290 Municipalities / Kommuner)',
      description: 'All 290 Swedish municipalities (Kommuner) across all 21 Counties (Län).',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/swe_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 290,
      badge: 'Level 2',
      color: 'indigo'
    },
    NO: {
      id: 'no-adm2',
      title: 'Subdivision Level 2, Norway (Municipalities / Kommuner)',
      description: 'All Norwegian municipalities (Kommuner) across all Fylker.',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/nor_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 438,
      badge: 'Level 2',
      color: 'indigo'
    },
    HU: {
      id: 'hu-adm2',
      title: 'Subdivision Level 2, Hungary (168 Districts / Járások)',
      description: 'All 168 Hungarian districts (Járások / Subregions) across the 19 Counties + Budapest.',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/hun_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 168,
      badge: 'Level 2',
      color: 'indigo'
    },
    RO: {
      id: 'ro-adm2',
      title: 'Subdivision Level 2, Romania (2939 Communes & Cities)',
      description: 'All Romanian administrative communes, towns, and municipalities across all 41 Județe.',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/rou_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 2939,
      badge: 'Level 2',
      color: 'indigo'
    },
    SK: {
      id: 'sk-adm2',
      title: 'Subdivision Level 2, Slovakia (79 Districts / Okresy)',
      description: 'All 79 official districts (Okresy) of Slovakia across its 8 Regions (Kraje).',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/svk_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 79,
      badge: 'Level 2',
      color: 'indigo'
    },
    GR: {
      id: 'gr-adm2',
      title: 'Subdivision Level 2, Greece (Regional Units)',
      description: 'Official regional subdivisions of Greece.',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/grc_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 14,
      badge: 'Level 2',
      color: 'indigo'
    },
    BG: {
      id: 'bg-adm2',
      title: 'Subdivision Level 2, Bulgaria (263 Municipalities / Obshtini)',
      description: 'All 263 Bulgarian municipalities (Obshtini) across the 28 Provinces (Oblasti).',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/bgr_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 263,
      badge: 'Level 2',
      color: 'indigo'
    },
    HR: {
      id: 'hr-adm2',
      title: 'Subdivision Level 2, Croatia (556 Municipalities & Cities)',
      description: 'All Croatian towns (Gradovi) and municipalities (Općine) across the 21 Counties (Županije).',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/hrv_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 556,
      badge: 'Level 2',
      color: 'indigo'
    },
    RS: {
      id: 'rs-adm2',
      title: 'Subdivision Level 2, Serbia (161 Municipalities / Opštine)',
      description: 'All 161 Serbian municipalities and cities across its Administrative Districts (Okruzi).',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/srb_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 161,
      badge: 'Level 2',
      color: 'indigo'
    },
    SI: {
      id: 'si-adm2',
      title: 'Subdivision Level 2, Slovenia (192 Municipalities / Občine)',
      description: 'All Slovenian municipalities (Občine) across the 12 Statistical Regions.',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/svn_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 192,
      badge: 'Level 2',
      color: 'indigo'
    },
    EE: {
      id: 'ee-adm2',
      title: 'Subdivision Level 2, Estonia (Municipalities / Vallad)',
      description: 'All Estonian rural municipalities (Vallad) and cities (Linnad) across the 15 Counties (Maakonnad).',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/est_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 223,
      badge: 'Level 2',
      color: 'indigo'
    },
    LV: {
      id: 'lv-adm2',
      title: 'Subdivision Level 2, Latvia (26 Districts / Rajoni)',
      description: 'All 26 Latvian districts across Latvia.',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/lva_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 26,
      badge: 'Level 2',
      color: 'indigo'
    },
    LT: {
      id: 'lt-adm2',
      title: 'Subdivision Level 2, Lithuania (48 Municipalities / Savivaldybės)',
      description: 'All Lithuanian district and city municipalities (Savivaldybės) across the 10 Counties (Apskritys).',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/ltu_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 48,
      badge: 'Level 2',
      color: 'indigo'
    },
    CA: {
      id: 'ca-adm2',
      title: 'Subdivision Level 2, Canada (293 Census Divisions & Counties)',
      description: 'All 293 Canadian Census Divisions, Regional Municipalities, and Counties across the 10 Provinces & 3 Territories.',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/can_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 293,
      badge: 'Level 2',
      color: 'indigo'
    },
    MX: {
      id: 'mx-adm2',
      title: 'Subdivision Level 2, Mexico (2457 Municipalities / Municipios)',
      description: 'All 2,457 Mexican municipalities (Municipios) and Mexico City boroughs across the 32 States.',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/mex_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 2457,
      badge: 'Level 2',
      color: 'indigo'
    },
    AR: {
      id: 'ar-adm2',
      title: 'Subdivision Level 2, Argentina (502 Departments & Partidos)',
      description: 'All 502 Argentine departments (Departamentos) and Buenos Aires Partidos across the 23 Provinces.',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/arg_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 502,
      badge: 'Level 2',
      color: 'indigo'
    },
    CO: {
      id: 'co-adm2',
      title: 'Subdivision Level 2, Colombia (1119 Municipalities / Municipios)',
      description: 'All 1,119 Colombian municipalities across the 32 Departments.',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/col_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 1119,
      badge: 'Level 2',
      color: 'indigo'
    },
    PE: {
      id: 'pe-adm2',
      title: 'Subdivision Level 2, Peru (195 Provinces / Provincias)',
      description: 'All 195 Peruvian provinces across the 25 Regions (Departamentos).',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/per_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 195,
      badge: 'Level 2',
      color: 'indigo'
    },
    CL: {
      id: 'cl-adm2',
      title: 'Subdivision Level 2, Chile (55 Provinces / Provincias)',
      description: 'All 55 Chilean provinces across the 16 Regions of Chile.',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/chl_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 55,
      badge: 'Level 2',
      color: 'indigo'
    },
    ZA: {
      id: 'za-adm2',
      title: 'Subdivision Level 2, South Africa (52 District & Metro Municipalities)',
      description: 'All 52 South African district and metropolitan municipalities across the 9 Provinces.',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/zaf_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 52,
      badge: 'Level 2',
      color: 'indigo'
    },
    KE: {
      id: 'ke-adm2',
      title: 'Subdivision Level 2, Kenya (293 Sub-Counties / Constituencies)',
      description: 'All 293 Kenyan sub-counties and constituencies across the 47 Counties.',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/ken_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 293,
      badge: 'Level 2',
      color: 'indigo'
    },
    NG: {
      id: 'ng-adm2',
      title: 'Subdivision Level 2, Nigeria (775 Local Government Areas)',
      description: 'All 775 Nigerian Local Government Areas (LGAs) across the 36 States + FCT.',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/nga_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 775,
      badge: 'Level 2',
      color: 'indigo'
    },
    EG: {
      id: 'eg-adm2',
      title: 'Subdivision Level 2, Egypt (343 Markaz & Kism Districts)',
      description: 'All 343 Egyptian municipal divisions (Markaz and Kism) across the 27 Governorates.',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/egy_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 343,
      badge: 'Level 2',
      color: 'indigo'
    },
    MA: {
      id: 'ma-adm2',
      title: 'Subdivision Level 2, Morocco (54 Provinces & Prefectures)',
      description: 'All 54 Moroccan provinces and prefectures across theRegions of Morocco.',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/mar_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 54,
      badge: 'Level 2',
      color: 'indigo'
    },
    KR: {
      id: 'kr-adm2',
      title: 'Subdivision Level 2, South Korea (229 Municipalities / Si-Gun-Gu)',
      description: 'All 229 South Korean cities (Si), counties (Gun), and autonomous districts (Gu).',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/kor_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 229,
      badge: 'Level 2',
      color: 'indigo'
    },
    JP: {
      id: 'jp-adm2',
      title: 'Subdivision Level 2, Japan (1811 Municipalities / Shikuchōson)',
      description: 'All 1,811 Japanese cities (Shi), wards (Ku), towns (Machi), and villages (Mura) across all 47 Prefectures.',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/jpn_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 1811,
      badge: 'Level 2',
      color: 'indigo'
    },
    VN: {
      id: 'vn-adm2',
      title: 'Subdivision Level 2, Vietnam (710 Districts / Quận, Huyện & Thị xã)',
      description: 'All 710 Vietnamese second-level districts, provincial cities, and urban districts across all 63 Provinces.',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/vnm_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 710,
      badge: 'Level 2',
      color: 'indigo'
    },
    MY: {
      id: 'my-adm2',
      title: 'Subdivision Level 2, Malaysia (144 Districts / Daerah)',
      description: 'All 144 Malaysian administrative districts (Daerah) across Peninsular Malaysia, Sabah, and Sarawak.',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/mys_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 144,
      badge: 'Level 2',
      color: 'indigo'
    },
    NZ: {
      id: 'nz-adm2',
      title: 'Subdivision Level 2, New Zealand (75 Territorial Authorities / Districts)',
      description: 'All 75 New Zealand city and district council areas across the North and South Islands.',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/nzl_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 75,
      badge: 'Level 2',
      color: 'indigo'
    },
    AU: {
      id: 'au-adm2',
      title: 'Subdivision Level 2, Australia (568 Local Government Areas / LGAs)',
      description: 'All 568 Australian Local Government Areas (Cities, Shires, Councils) across all States & Territories.',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/aus_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 568,
      badge: 'Level 2',
      color: 'indigo'
    },
    BR: {
      id: 'br-adm2',
      title: 'Subdivision Level 2, Brazil (5572 Municipalities / Municípios)',
      description: 'All 5,572 Brazilian municipalities across the 26 States + Federal District. Filter by state on the map!',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/bra_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 5572,
      badge: 'Level 2',
      color: 'indigo'
    },
    AL: {
      id: 'al-adm2',
      title: 'Subdivision Level 2, Albania (35 Municipalities / Bashkitë)',
      description: 'All Albanian municipalities (Bashkitë) across the 12 Counties (Qarqe).',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/alb_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 35,
      badge: 'Level 2',
      color: 'indigo'
    },
    BD: {
      id: 'bd-adm2',
      title: 'Subdivision Level 2, Bangladesh (64 Districts / Zila)',
      description: 'All 64 official districts (Zila) of Bangladesh across its 8 Divisions.',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/bgd_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 64,
      badge: 'Level 2',
      color: 'indigo'
    },
    KH: {
      id: 'kh-adm2',
      title: 'Subdivision Level 2, Cambodia (196 Districts / Srok & Khan)',
      description: 'All 196 Cambodian districts (Srok), municipalities (Krong), and sections (Khan) across all 25 Provinces.',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/khm_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 196,
      badge: 'Level 2',
      color: 'indigo'
    },
    PA: {
      id: 'pa-adm2',
      title: 'Subdivision Level 2, Panama (76 Districts / Distritos)',
      description: 'All 76 Panamanian districts (Distritos) across the Provinces and Indigenous Comarcas.',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/pan_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 76,
      badge: 'Level 2',
      color: 'indigo'
    },
    SG: {
      id: 'sg-adm2',
      title: 'Subdivision Level 2, Singapore (55 Planning Areas)',
      description: 'All 55 URA Urban Planning Areas of Singapore (Bedok, Jurong West, Tampines, Woodlands, Yishun, Bukit Timah...).',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/sgp_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 55,
      badge: 'Level 2',
      color: 'indigo'
    },
    TH: {
      id: 'th-adm2',
      title: 'Subdivision Level 2, Thailand (916 Districts / Amphoe & Khet)',
      description: 'All 916 Thai districts (Amphoe) and Bangkok districts (Khet) across all 77 Provinces.',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/tha_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 916,
      badge: 'Level 2',
      color: 'indigo'
    },
    TW: {
      id: 'tw-adm2',
      title: 'Subdivision Level 2, Taiwan (21 Counties & Special Municipalities)',
      description: 'All 21 Taiwan Counties, Provincial Cities, and Special Municipalities (Taipei, New Taipei, Taichung, Tainan, Kaohsiung, Hualien...).',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/twn_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 21,
      badge: 'Level 2',
      color: 'indigo'
    },
    IS: {
      id: 'is-adm2',
      title: 'Subdivision Level 2, Iceland (74 Municipalities / Sveitarfélög)',
      description: 'All 74 Icelandic municipalities (Sveitarfélög) across the 8 Regions of Iceland.',
      category: 'adm2',
      geojsonFile: '/maps/subdivisions/isl_adm2.geojson',
      levelKey: 'NAME_2',
      targetCount: 74,
      badge: 'Level 2',
      color: 'indigo'
    }
  };

  if (EXTRA_ADM2_DATASETS[code]) {
    const extraOpt = EXTRA_ADM2_DATASETS[code];
    const existingIdx = rawList.findIndex(
      (q) => q.id === extraOpt.id || q.geojsonFile === extraOpt.geojsonFile
    );
    if (existingIdx >= 0) {
      rawList[existingIdx] = extraOpt;
    } else {
      rawList.push(extraOpt);
    }
  }

  // Inject Sri Lanka 9 Provinces (Level 1) + 25 Districts (Level 2), Finland 70 Sub-Regions (Level 3), and Latvia 43 Municipalities (Level 3)
  if (code === 'LK') {
    const distIdx = rawList.findIndex((q) => q.geojsonFile.includes('lka_adm1'));
    if (distIdx >= 0) {
      rawList[distIdx] = {
        ...rawList[distIdx],
        id: 'lk-adm2',
        title: 'Subdivision Level 2, Sri Lanka (25 Districts)',
        category: 'adm2',
        badge: 'Level 2'
      };
    }
    rawList.unshift({
      id: 'lk-adm1',
      title: 'Subdivision Level 1, Sri Lanka (9 Provinces)',
      description: 'All 9 Provinces of Sri Lanka (Western, Central, Southern, Northern, Eastern, North Western, North Central, Uva, Sabaragamuwa).',
      category: 'adm1',
      geojsonFile: '/maps/subdivisions/lka_provinces.geojson',
      levelKey: 'NAME_1',
      targetCount: 9,
      badge: 'Level 1',
      color: 'sky'
    });
  } else if (code === 'FI') {
    rawList.push({
      id: 'fi-adm3',
      title: 'Subdivision Level 3, Finland (70 Sub-Regions / Seutukunnat)',
      description: 'All 70 Finnish sub-regions / sub-counties (Seutukunnat) across the Regions of Finland.',
      category: 'adm3',
      geojsonFile: '/maps/subdivisions/fin_adm3.geojson',
      levelKey: 'NAME_2',
      targetCount: 70,
      badge: 'Level 3',
      color: 'purple'
    });
  } else if (code === 'LV') {
    rawList.push({
      id: 'lv-adm3',
      title: 'Subdivision Level 3, Latvia (43 Municipalities / Novadi)',
      description: 'All 43 modern Latvian municipalities (Novadi) and state cities (Valstspilsētas).',
      category: 'adm3',
      geojsonFile: '/maps/subdivisions/lva_adm3.geojson',
      levelKey: 'NAME_3',
      targetCount: 43,
      badge: 'Level 3',
      color: 'purple'
    });
  }

  // Keep non-areacode quizzes (including State/Provincial Flags!) and standardize Subdivision titles
  const nonAreaCodes = rawList
    .filter((q) => q.category !== 'areacodes')
    .map((q) => {
      if (q.category === 'adm1' || q.category === 'adm2' || q.category === 'adm3') {
        if (q.title.startsWith('Subdivision Level')) return q;
        const lvl =
          q.levelKey === 'NAME_4'
            ? 4
            : q.category === 'adm3'
            ? 3
            : q.category === 'adm2'
            ? 2
            : 1;
        const stripped = q.title
          .replace(/^Level\s*\d+\s*:\s*/i, '')
          .replace(/^\d+\s+/, '')
          .trim();
        return {
          ...q,
          title: `Subdivision Level ${lvl}, ${country.name} (${stripped || 'Regions'})`
        };
      }
      return q;
    });

  // Consolidate Postal Code quizzes to ONE unified entry per country
  const postalQuizzes = nonAreaCodes.filter(
    (q) => q.badge === 'Postal Codes' || /postal\s*codes?/i.test(q.title)
  );
  let unifiedPostal: SubdivisionQuizOption | null = null;
  if (postalQuizzes.length > 0) {
    const sortedPostal = [...postalQuizzes].sort((a, b) => b.targetCount - a.targetCount);
    unifiedPostal = {
      ...sortedPostal[0],
      title: `Postal Codes (${sortedPostal[0].targetCount} Zones)`,
      badge: 'Postal Codes'
    };
  }

  // Collect all official Subdivision levels (adm1, adm2; plus Belgium adm3/adm4 & Vietnam old/new)
  const rawSubs = nonAreaCodes.filter(
    (q) => q.category === 'adm1' || q.category === 'adm2' || q.category === 'adm3'
  );

  let subLevels: SubdivisionQuizOption[] = [...rawSubs];
  if (subLevels.length > 1) {
    // Ensure clean sequential Level numbering on titles
    subLevels = subLevels.map((s, idx) => {
      const cleanSubLabel =
        s.title.match(/\(([^)]+)\)/)?.[1] ||
        s.title.replace(/^Subdivision Level \d+,\s*[^()]+\s*/i, '').replace(/^Level \d+:\s*/i, '').trim() ||
        s.badge;
      return {
        ...s,
        title: `Level ${idx + 1}: ${cleanSubLabel}`,
        badge: `Level ${idx + 1} (${s.targetCount})`
      };
    });
  }

  // Consolidate all Subdivision levels into ONE unified "Subdivisions" card per country!
  let unifiedSubdivision: SubdivisionQuizOption | null = null;
  if (subLevels.length > 0) {
    const primarySub = rawSubs.find((q) => q.category === 'adm1') || subLevels[0];

    const levelSummary =
      subLevels.length > 1
        ? `${subLevels.length} Official Levels (${subLevels.map((s) => `${s.targetCount} Q`).join(' / ')})`
        : `${primarySub.targetCount} Official Subdivisions`;

    unifiedSubdivision = {
      ...primarySub,
      title: `Subdivisions (${levelSummary})`,
      description:
        subLevels.length > 1
          ? `Choose between ${subLevels.length} official administrative subdivision levels for ${country.name} on the 3D Globe.`
          : primarySub.description,
      badge: subLevels.length > 1 ? `Levels 1–${subLevels.length}` : 'Subdivisions',
      availableLevels: subLevels
    };
  }

  const others = nonAreaCodes.filter(
    (q) =>
      q.category !== 'adm1' &&
      q.category !== 'adm2' &&
      q.category !== 'adm3' &&
      q.badge !== 'Postal Codes' &&
      !/postal\s*codes?/i.test(q.title)
  );

  return [
    ...(unifiedSubdivision ? [unifiedSubdivision] : []),
    ...(unifiedAreaCode ? [unifiedAreaCode] : []),
    ...(unifiedPostal ? [unifiedPostal] : []),
    ...others
  ];
}

