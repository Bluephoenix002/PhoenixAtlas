import { QuizDefinition } from './quizTypes';

export const BUILT_IN_QUIZZES: QuizDefinition[] = [
  {
    id: 'world-capitals-europe',
    title: 'European Capitals Mastery',
    description: 'Test your knowledge of the capital cities across 10 European nations.',
    category: 'Capitals',
    difficulty: 'Medium',
    questionCount: 10,
    timeLimitSec: 25,
    continent: 'Europe',
    questions: [
      {
        id: 'eu-cap-1',
        type: 'multiple-choice',
        prompt: 'What is the constitutional capital of Belgium?',
        options: ['Brussels', 'Antwerp', 'Ghent', 'Bruges'],
        correctAnswer: 'Brussels',
        hint: 'Hosts the EU & NATO headquarters',
        explanation: 'Brussels has served as the capital of Belgium since 1830.',
        countryCode: 'BE'
      },
      {
        id: 'eu-cap-2',
        type: 'multiple-choice',
        prompt: 'What is the capital of Germany?',
        options: ['Berlin', 'Munich', 'Frankfurt', 'Hamburg'],
        correctAnswer: 'Berlin',
        hint: 'Famous for the Brandenburg Gate and the Spree river',
        explanation: 'Berlin is Germany’s largest city and federal capital.',
        countryCode: 'DE'
      },
      {
        id: 'eu-cap-3',
        type: 'multiple-choice',
        prompt: 'What is the capital of Spain?',
        options: ['Madrid', 'Barcelona', 'Seville', 'Valencia'],
        correctAnswer: 'Madrid',
        hint: 'High plateau city in the geographical center of Spain',
        explanation: 'Madrid is located on the Manzanares river in central Spain.',
        countryCode: 'ES'
      },
      {
        id: 'eu-cap-4',
        type: 'multiple-choice',
        prompt: 'What is the capital of the Netherlands?',
        options: ['Amsterdam', 'The Hague', 'Rotterdam', 'Utrecht'],
        correctAnswer: 'Amsterdam',
        hint: 'Known for its historical canals and museum district',
        explanation: 'Amsterdam is the official constitutional capital, while The Hague is the seat of government.',
        countryCode: 'NL'
      },
      {
        id: 'eu-cap-5',
        type: 'multiple-choice',
        prompt: 'What is the capital of Italy?',
        options: ['Rome', 'Milan', 'Florence', 'Naples'],
        correctAnswer: 'Rome',
        hint: 'Surrounds the Vatican City enclave',
        explanation: 'Rome is known as the Eternal City and was the center of the Roman Empire.',
        countryCode: 'IT'
      },
      {
        id: 'eu-cap-6',
        type: 'multiple-choice',
        prompt: 'What is the capital of Portugal?',
        options: ['Lisbon', 'Porto', 'Coimbra', 'Braga'],
        correctAnswer: 'Lisbon',
        hint: 'Located at the mouth of the Tagus River',
        explanation: 'Lisbon is the westernmost large capital city on the European mainland.',
        countryCode: 'PT'
      },
      {
        id: 'eu-cap-7',
        type: 'multiple-choice',
        prompt: 'What is the capital of Sweden?',
        options: ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala'],
        correctAnswer: 'Stockholm',
        hint: 'Spread across 14 islands on Lake Mälaren and the Baltic Sea',
        explanation: 'Stockholm is the most populous city in the Nordic countries.',
        countryCode: 'SE'
      },
      {
        id: 'eu-cap-8',
        type: 'multiple-choice',
        prompt: 'What is the capital of Norway?',
        options: ['Oslo', 'Bergen', 'Trondheim', 'Stavanger'],
        correctAnswer: 'Oslo',
        hint: 'Situated at the head of the Oslofjord',
        explanation: 'Oslo is the hub of Norwegian trade, banking, and shipping.',
        countryCode: 'NO'
      },
      {
        id: 'eu-cap-9',
        type: 'multiple-choice',
        prompt: 'What is the capital of Greece?',
        options: ['Athens', 'Thessaloniki', 'Patras', 'Heraklion'],
        correctAnswer: 'Athens',
        hint: 'Dominated by 5th-century BCE landmarks like the Parthenon',
        explanation: 'Athens is one of the world’s oldest named cities, continuously inhabited for over 3,400 years.',
        countryCode: 'GR'
      },
      {
        id: 'eu-cap-10',
        type: 'typing',
        prompt: 'Type the capital city of France:',
        correctAnswer: 'Paris',
        acceptableAnswers: ['paris'],
        hint: 'The City of Light along the Seine',
        explanation: 'Paris is the cultural and political capital of France.',
        countryCode: 'FR'
      }
    ]
  },
  {
    id: 'world-capitals-asia',
    title: 'Asian Capitals Championship',
    description: 'Capitals of Eastern, Southern, and Southeastern Asia.',
    category: 'Capitals',
    difficulty: 'Medium',
    questionCount: 8,
    timeLimitSec: 25,
    continent: 'Asia',
    questions: [
      {
        id: 'as-cap-1',
        type: 'multiple-choice',
        prompt: 'What is the capital of Japan?',
        options: ['Tokyo', 'Kyoto', 'Osaka', 'Yokohama'],
        correctAnswer: 'Tokyo',
        hint: 'Formerly known as Edo until 1868',
        explanation: 'Tokyo forms part of the world’s most populous metropolitan area.',
        countryCode: 'JP'
      },
      {
        id: 'as-cap-2',
        type: 'multiple-choice',
        prompt: 'What is the capital of South Korea?',
        options: ['Seoul', 'Busan', 'Incheon', 'Daegu'],
        correctAnswer: 'Seoul',
        hint: 'Bisected by the Han River',
        explanation: 'Seoul is the technological and cultural center of South Korea.',
        countryCode: 'KR'
      },
      {
        id: 'as-cap-3',
        type: 'multiple-choice',
        prompt: 'What is the capital of Thailand?',
        options: ['Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya'],
        correctAnswer: 'Bangkok',
        hint: 'Known locally as Krung Thep Maha Nakhon',
        explanation: 'Bangkok is situated in the Chao Phraya River delta.',
        countryCode: 'TH'
      },
      {
        id: 'as-cap-4',
        type: 'multiple-choice',
        prompt: 'What is the capital of China?',
        options: ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen'],
        correctAnswer: 'Beijing',
        hint: 'Contains the historic Forbidden City',
        explanation: 'Beijing has served as China’s political center for over eight centuries.',
        countryCode: 'CN'
      },
      {
        id: 'as-cap-5',
        type: 'typing',
        prompt: 'Type the capital city of India:',
        correctAnswer: 'New Delhi',
        acceptableAnswers: ['new delhi', 'delhi'],
        hint: 'Planned district within the National Capital Territory',
        explanation: 'New Delhi serves as the seat of the Government of India.',
        countryCode: 'IN'
      },
      {
        id: 'as-cap-6',
        type: 'multiple-choice',
        prompt: 'What is the capital of the Philippines?',
        options: ['Manila', 'Cebu City', 'Davao City', 'Quezon City'],
        correctAnswer: 'Manila',
        hint: 'Located on the eastern shore of Manila Bay on Luzon island',
        explanation: 'Manila is the historic bayside capital of the Philippine archipelago.'
      },
      {
        id: 'as-cap-7',
        type: 'multiple-choice',
        prompt: 'What is the capital of Turkey?',
        options: ['Ankara', 'Istanbul', 'Izmir', 'Antalya'],
        correctAnswer: 'Ankara',
        hint: 'Anatolian plateau city chosen by Atatürk in 1923',
        explanation: 'Ankara replaced Istanbul as the official Turkish capital in 1923.',
        countryCode: 'TR'
      },
      {
        id: 'as-cap-8',
        type: 'multiple-choice',
        prompt: 'What is the capital of Indonesia?',
        options: ['Jakarta', 'Surabaya', 'Bandung', 'Medan'],
        correctAnswer: 'Jakarta',
        hint: 'Located on the northwest coast of Java',
        explanation: 'Jakarta is the historic capital, while Nusantara is being built in East Kalimantan.'
      }
    ]
  },
  {
    id: 'belgium-provinces-challenge',
    title: 'Belgian 10 Provinces & Regions',
    description: 'Identify all provinces across Flanders, Wallonia, and the Brussels-Capital Region.',
    category: 'Provinces',
    difficulty: 'Hard',
    questionCount: 6,
    timeLimitSec: 0,
    countryCode: 'BE',
    questions: [
      {
        id: 'be-prov-1',
        type: 'multiple-choice',
        prompt: 'Which Belgian province is Antwerp (Antwerpen) the capital of?',
        options: ['Antwerp', 'Limburg', 'East Flanders', 'Flemish Brabant'],
        correctAnswer: 'Antwerp',
        hint: 'Northernmost province of the Flemish Region bordering the Netherlands',
        explanation: 'Antwerp is the economic powerhouse of Flanders with world-renowned ports.'
      },
      {
        id: 'be-prov-2',
        type: 'multiple-choice',
        prompt: 'Which Walloon province has Arlon as its capital and borders the Grand Duchy of Luxembourg?',
        options: ['Luxembourg', 'Liège', 'Namur', 'Hainaut'],
        correctAnswer: 'Luxembourg',
        hint: 'Largest Belgian province by area, known for the forested Ardennes',
        explanation: 'Belgian Luxembourg forms the southernmost territory of the Kingdom of Belgium.'
      },
      {
        id: 'be-prov-3',
        type: 'multiple-choice',
        prompt: 'Hasselt is the provincial capital of which Flemish province?',
        options: ['Limburg', 'West Flanders', 'Walloon Brabant', 'Antwerp'],
        correctAnswer: 'Limburg',
        hint: 'Easternmost Flemish province, known for fruit cultivation and nature reserves',
        explanation: 'Belgian Limburg borders Dutch Limburg along the Meuse River.'
      },
      {
        id: 'be-prov-4',
        type: 'multiple-choice',
        prompt: 'Which Belgian province has a marine coastline on the North Sea and includes Bruges?',
        options: ['West Flanders', 'East Flanders', 'Hainaut', 'Namur'],
        correctAnswer: 'West Flanders',
        hint: 'Capital city is the historic canal metropolis of Bruges (Brugge)',
        explanation: 'West Flanders is the only Belgian province bordering the North Sea.'
      },
      {
        id: 'be-prov-5',
        type: 'typing',
        prompt: 'Type the capital city of East Flanders (Oost-Vlaanderen):',
        correctAnswer: 'Ghent',
        acceptableAnswers: ['ghent', 'gent', 'gand'],
        hint: 'Confluence of the Scheldt and Lys rivers, home to Saint Bavo’s Cathedral',
        explanation: 'Ghent (Gent) is the vibrant university capital of East Flanders.'
      },
      {
        id: 'be-prov-6',
        type: 'multiple-choice',
        prompt: 'Which province was created when Brabant was split along linguistic boundaries in 1995 with Wavre as capital?',
        options: ['Walloon Brabant', 'Flemish Brabant', 'Liège', 'Namur'],
        correctAnswer: 'Walloon Brabant',
        hint: 'French-speaking province south of Brussels',
        explanation: 'The historical Province of Brabant was split into Flemish Brabant, Walloon Brabant, and Brussels.'
      }
    ]
  },
  {
    id: 'us-states-capitals',
    title: 'US 50 States & State Capitals',
    description: 'Test your knowledge of key American states, capitals, and landmarks.',
    category: 'Provinces',
    difficulty: 'Medium',
    questionCount: 8,
    timeLimitSec: 25,
    countryCode: 'US',
    questions: [
      {
        id: 'us-cap-1',
        type: 'multiple-choice',
        prompt: 'What is the capital city of California?',
        options: ['Sacramento', 'Los Angeles', 'San Francisco', 'San Diego'],
        correctAnswer: 'Sacramento',
        hint: 'Located at the confluence of the Sacramento and American Rivers',
        explanation: 'Sacramento became the capital of California in 1854 during the Gold Rush.'
      },
      {
        id: 'us-cap-2',
        type: 'multiple-choice',
        prompt: 'What is the capital of Texas?',
        options: ['Austin', 'Houston', 'Dallas', 'San Antonio'],
        correctAnswer: 'Austin',
        hint: 'Known for its live music scene and state capitol building',
        explanation: 'Austin was named after Stephen F. Austin, the "Father of Texas".'
      },
      {
        id: 'us-cap-3',
        type: 'multiple-choice',
        prompt: 'What is the capital of New York State?',
        options: ['Albany', 'New York City', 'Buffalo', 'Rochester'],
        correctAnswer: 'Albany',
        hint: 'Historic trading city on the Hudson River',
        explanation: 'Albany has been the capital of New York State since 1797.'
      },
      {
        id: 'us-cap-4',
        type: 'multiple-choice',
        prompt: 'What is the capital of Florida?',
        options: ['Tallahassee', 'Miami', 'Orlando', 'Tampa'],
        correctAnswer: 'Tallahassee',
        hint: 'Located in northern Florida halfway between Pensacola and St. Augustine',
        explanation: 'Tallahassee was chosen as Florida’s capital in 1824.'
      },
      {
        id: 'us-cap-5',
        type: 'multiple-choice',
        prompt: 'What is the capital of Washington State?',
        options: ['Olympia', 'Seattle', 'Spokane', 'Tacoma'],
        correctAnswer: 'Olympia',
        hint: 'Located at the southern tip of Puget Sound',
        explanation: 'Olympia was incorporated as the capital of Washington Territory in 1859.'
      },
      {
        id: 'us-cap-6',
        type: 'multiple-choice',
        prompt: 'What is the capital of Illinois?',
        options: ['Springfield', 'Chicago', 'Peoria', 'Rockford'],
        correctAnswer: 'Springfield',
        hint: 'Closely associated with the life and legacy of Abraham Lincoln',
        explanation: 'Springfield became Illinois’ capital in 1839 through Lincoln’s efforts.'
      },
      {
        id: 'us-cap-7',
        type: 'multiple-choice',
        prompt: 'What is the capital of Massachusetts?',
        options: ['Boston', 'Cambridge', 'Worcester', 'Salem'],
        correctAnswer: 'Boston',
        hint: 'One of the oldest municipalities in the United States, founded in 1630',
        explanation: 'Boston is the economic and cultural anchor of New England.'
      },
      {
        id: 'us-cap-8',
        type: 'multiple-choice',
        prompt: 'What is the capital of Hawaii?',
        options: ['Honolulu', 'Hilo', 'Kahului', 'Kailua'],
        correctAnswer: 'Honolulu',
        hint: 'Located on the island of Oahu, home to Waikiki Beach',
        explanation: 'Honolulu was made the capital of the Hawaiian Kingdom in 1845.'
      }
    ]
  },
  {
    id: 'superduper-phone-codes',
    title: 'Telephone Area Codes (Super-Duper)',
    description: 'International dialing codes and area prefixes inspired by Super-Duper quiz.',
    category: 'Geography',
    difficulty: 'Medium',
    questionCount: 8,
    timeLimitSec: 20,
    questions: [
      {
        id: 'sd-ph-1',
        type: 'multiple-choice',
        prompt: 'Which country has the international telephone country code +32?',
        options: ['Belgium', 'Netherlands', 'France', 'Switzerland'],
        correctAnswer: 'Belgium',
        hint: 'Heart of Europe'
      },
      {
        id: 'sd-ph-2',
        type: 'multiple-choice',
        prompt: 'Which country has the country code +33?',
        options: ['France', 'Spain', 'Italy', 'Germany'],
        correctAnswer: 'France',
        hint: 'Country shaped like a hexagon'
      },
      {
        id: 'sd-ph-3',
        type: 'multiple-choice',
        prompt: 'Which country uses country code +49?',
        options: ['Germany', 'Austria', 'Poland', 'Denmark'],
        correctAnswer: 'Germany',
        hint: 'Largest economy in Europe'
      },
      {
        id: 'sd-ph-4',
        type: 'multiple-choice',
        prompt: 'Which country has the calling code +81?',
        options: ['Japan', 'South Korea', 'China', 'Taiwan'],
        correctAnswer: 'Japan',
        hint: 'East Asian archipelago'
      },
      {
        id: 'sd-ph-5',
        type: 'multiple-choice',
        prompt: 'Which country has the calling code +44?',
        options: ['United Kingdom', 'Ireland', 'Norway', 'Sweden'],
        correctAnswer: 'United Kingdom',
        hint: 'Island nation home to London'
      },
      {
        id: 'sd-ph-6',
        type: 'multiple-choice',
        prompt: 'Which country uses calling code +31?',
        options: ['Netherlands', 'Belgium', 'Luxembourg', 'Denmark'],
        correctAnswer: 'Netherlands',
        hint: 'Famous for polders and cycling'
      },
      {
        id: 'sd-ph-7',
        type: 'multiple-choice',
        prompt: 'Which country uses calling code +61?',
        options: ['Australia', 'New Zealand', 'South Africa', 'Singapore'],
        correctAnswer: 'Australia',
        hint: 'Continent down under'
      },
      {
        id: 'sd-ph-8',
        type: 'multiple-choice',
        prompt: 'Which country uses calling code +34?',
        options: ['Spain', 'Portugal', 'Italy', 'Greece'],
        correctAnswer: 'Spain',
        hint: 'Iberian nation with Madrid as capital'
      }
    ]
  },
  {
    id: 'superduper-road-networks',
    title: 'Highway Shields & Motorways (Super-Duper)',
    description: 'Road nomenclature, interstate conventions, and motorway systems.',
    category: 'Geography',
    difficulty: 'Hard',
    questionCount: 6,
    timeLimitSec: 25,
    questions: [
      {
        id: 'sd-rd-1',
        type: 'multiple-choice',
        prompt: 'In the US Interstate Highway System, odd-numbered routes (e.g., I-95, I-5) run in which direction?',
        options: ['North-South', 'East-West', 'Diagonal', 'Radial Beltway'],
        correctAnswer: 'North-South',
        hint: 'I-95 connects Florida to Maine along the East Coast'
      },
      {
        id: 'sd-rd-2',
        type: 'multiple-choice',
        prompt: 'In France, what prefix letter designates the national controlled-access Autoroute network?',
        options: ['A', 'N', 'D', 'M'],
        correctAnswer: 'A',
        hint: 'e.g. A1, A6'
      },
      {
        id: 'sd-rd-3',
        type: 'multiple-choice',
        prompt: 'What is the German national motorway network famous for unrestricted speed sections?',
        options: ['Autobahn', 'Bundesstraße', 'Schnellstraße', 'Landstraße'],
        correctAnswer: 'Autobahn',
        hint: 'Blue shield symbol'
      },
      {
        id: 'sd-rd-4',
        type: 'multiple-choice',
        prompt: 'In the United Kingdom, what prefix letter is used for primary motorways?',
        options: ['M', 'A', 'B', 'N'],
        correctAnswer: 'M',
        hint: 'e.g. M25, M1'
      },
      {
        id: 'sd-rd-5',
        type: 'multiple-choice',
        prompt: 'What prefix in Spain designates state-managed toll motorways (Autopistas)?',
        options: ['AP', 'A', 'N', 'R'],
        correctAnswer: 'AP',
        hint: 'Autopistas de Peaje'
      },
      {
        id: 'sd-rd-6',
        type: 'multiple-choice',
        prompt: 'What is the longest continuous motorable highway network in the world, spanning the Americas?',
        options: ['Pan-American Highway', 'Trans-Siberian Highway', 'Highway 1 (Australia)', 'Trans-Canada Highway'],
        correctAnswer: 'Pan-American Highway',
        hint: 'Stretching nearly 30,000 km from Alaska to Ushuaia'
      }
    ]
  },
  {
    id: 'world-flags-discovery',
    title: 'National Flags & Emblems',
    description: 'Match iconic world flags with their sovereign nations.',
    category: 'Flags',
    difficulty: 'Easy',
    questionCount: 6,
    timeLimitSec: 20,
    questions: [
      {
        id: 'flag-1',
        type: 'flag',
        prompt: 'Which country flies this national flag?',
        flagEmoji: '🇯🇵',
        options: ['South Korea', 'Japan', 'China', 'Singapore'],
        correctAnswer: 'Japan',
        hint: 'Known as the Hinomaru (sun disc)'
      },
      {
        id: 'flag-2',
        type: 'flag',
        prompt: 'Which European nation flies this green, white, and red vertical tricolor?',
        flagEmoji: '🇮🇹',
        options: ['Mexico', 'Italy', 'Ireland', 'Hungary'],
        correctAnswer: 'Italy',
        hint: 'Known as Il Tricolore'
      },
      {
        id: 'flag-3',
        type: 'flag',
        prompt: 'Which Nordic country flies this blue cross on a golden-yellow field?',
        flagEmoji: '🇸🇪',
        options: ['Finland', 'Norway', 'Sweden', 'Denmark'],
        correctAnswer: 'Sweden',
        hint: 'Stockholm is its capital'
      },
      {
        id: 'flag-4',
        type: 'flag',
        prompt: 'Which South American nation flies this flag with the starry celestial globe and "Ordem e Progresso"?',
        flagEmoji: '🇧🇷',
        options: ['Argentina', 'Colombia', 'Brazil', 'Venezuela'],
        correctAnswer: 'Brazil',
        hint: 'Largest country in South America'
      },
      {
        id: 'flag-5',
        type: 'flag',
        prompt: 'Which African nation features a black star on red, gold, and green horizontal stripes?',
        flagEmoji: '🇬🇭',
        options: ['Ghana', 'Nigeria', 'Kenya', 'Senegal'],
        correctAnswer: 'Ghana',
        hint: 'First sub-Saharan country to gain independence'
      },
      {
        id: 'flag-6',
        type: 'flag',
        prompt: 'Which country’s flag is famously one of only two square sovereign flags in the world?',
        flagEmoji: '🇨🇭',
        options: ['Austria', 'Switzerland', 'Monaco', 'Luxembourg'],
        correctAnswer: 'Switzerland',
        hint: 'Bold white cross on solid red field'
      }
    ]
  },
  {
    id: 'geography-extremes',
    title: 'Earth Extremes & Wonders',
    description: 'Highest mountains, deepest oceans, longest rivers, and frontier records.',
    category: 'Geography',
    difficulty: 'Hard',
    questionCount: 6,
    timeLimitSec: 30,
    questions: [
      {
        id: 'ext-1',
        type: 'multiple-choice',
        prompt: 'What is the highest mountain peak on Earth measured from sea level?',
        options: ['K2', 'Mount Everest', 'Kangchenjunga', 'Lhotse'],
        correctAnswer: 'Mount Everest',
        hint: 'Elevation of 8,848.86 meters on the China-Nepal border'
      },
      {
        id: 'ext-2',
        type: 'multiple-choice',
        prompt: 'Which river has the largest discharge volume of water in the world?',
        options: ['Nile River', 'Amazon River', 'Yangtze River', 'Mississippi River'],
        correctAnswer: 'Amazon River',
        hint: 'Flows through Peru, Colombia, and Brazil'
      },
      {
        id: 'ext-3',
        type: 'multiple-choice',
        prompt: 'Which is the deepest lake in the world, holding 20% of Earth’s unfrozen surface freshwater?',
        options: ['Lake Superior', 'Lake Victoria', 'Lake Baikal', 'Lake Tanganyika'],
        correctAnswer: 'Lake Baikal',
        hint: 'Located in southern Siberia, Russia'
      },
      {
        id: 'ext-4',
        type: 'multiple-choice',
        prompt: 'Which ocean trench contains the Challenger Deep, the deepest known point on Earth?',
        options: ['Java Trench', 'Mariana Trench', 'Puerto Rico Trench', 'Tonga Trench'],
        correctAnswer: 'Mariana Trench',
        hint: 'Depths exceeding 10,990 meters in the Western Pacific'
      },
      {
        id: 'ext-5',
        type: 'multiple-choice',
        prompt: 'Which two countries share the longest continuous land border in the world?',
        options: ['Russia & China', 'United States & Canada', 'Argentina & Chile', 'India & Bangladesh'],
        correctAnswer: 'United States & Canada',
        hint: 'Spans 8,891 kilometers from the Atlantic to Pacific and Arctic'
      },
      {
        id: 'ext-6',
        type: 'typing',
        prompt: 'Type the name of the driest non-polar desert on Earth, located in northern Chile:',
        correctAnswer: 'Atacama',
        acceptableAnswers: ['atacama', 'atacama desert'],
        hint: 'Hyperarid plateau wedged between the Andes and Pacific'
      }
    ]
  },
  {
    id: 'where-are-you-visual-clues',
    title: 'Where Are You? (Visual Clues & Flags)',
    description: 'Look at the visual clue (flag, highway shield, car plate, or phone code) and identify where you are.',
    category: 'Visual Clues',
    difficulty: 'Medium',
    questionCount: 8,
    timeLimitSec: 25,
    questions: [
      {
        id: 'way-1',
        type: 'multiple-choice',
        prompt: 'You see this yellow flag with a black heraldic lion on a town hall. Where are you?',
        visualClue: {
          type: 'flag',
          value: 'Flanders',
          label: 'Heraldic Flemish Lion Flag'
        },
        options: ['Flanders (Belgium)', 'Wallonia (Belgium)', 'Limburg (Netherlands)', 'Luxembourg'],
        correctAnswer: 'Flanders (Belgium)',
        hint: 'Official symbol of the Flemish Region and Community',
        explanation: 'The Flemish Lion has been the heraldic emblem of the County of Flanders since Philip of Alsace in 1162.'
      },
      {
        id: 'way-2',
        type: 'multiple-choice',
        prompt: 'You pass this highway shield heading towards Antwerpen and Gent. Which country are you driving in?',
        visualClue: {
          type: 'road-shield',
          value: 'E 19 / A 1',
          subValue: 'Direction: Antwerpen / Brussel'
        },
        options: ['Belgium', 'France', 'Netherlands', 'Germany'],
        correctAnswer: 'Belgium',
        hint: 'Key motorway linking Brussels, Antwerp, and the Dutch border',
        explanation: 'E19 / A1 is Belgium’s busiest motorway spine.'
      },
      {
        id: 'way-3',
        type: 'multiple-choice',
        prompt: 'You spot this state flag featuring a red lone star and a grizzly bear walking on green grass. Where are you?',
        visualClue: {
          type: 'flag',
          value: 'California',
          label: 'Bear Republic Flag'
        },
        options: ['California, USA', 'Texas, USA', 'Alaska, USA', 'Colorado, USA'],
        correctAnswer: 'California, USA',
        hint: 'Adopted in 1911 based on the 1846 Bear Flag Revolt',
        explanation: 'California adopted the Bear Flag honoring the California Republic.'
      },
      {
        id: 'way-4',
        type: 'multiple-choice',
        prompt: 'A local shop billboard displays a landline phone number with this regional prefix. Which capital city are you in?',
        visualClue: {
          type: 'tel',
          value: '(02) 512 88 00',
          label: 'Metropolitan Calling Code'
        },
        options: ['Brussels', 'Paris', 'Amsterdam', 'Berlin'],
        correctAnswer: 'Brussels',
        hint: 'Belgium’s single-digit trunk area code for the capital',
        explanation: '02 is the domestic regional dialing prefix for the 19 municipalities of the Brussels-Capital Region.'
      },
      {
        id: 'way-5',
        type: 'multiple-choice',
        prompt: 'A car license plate in front of you has the regional prefix "B" followed by letters and numbers. Which European city are you in?',
        visualClue: {
          type: 'plate',
          value: 'B - MW 2024',
          label: 'German KFZ Plate'
        },
        countryCode: 'D',
        options: ['Berlin', 'Bonn', 'Bremen', 'Bratislava'],
        correctAnswer: 'Berlin',
        hint: 'Germany assigns single-letter codes to its largest cities',
        explanation: 'In the German KFZ license plate system, single-letter prefixes denote the largest cities: B is Berlin, M is Munich, K is Cologne.'
      },
      {
        id: 'way-6',
        type: 'multiple-choice',
        prompt: 'You spot this red flag with a green saltire and white cross (the Ikurriña). Which autonomous region are you in?',
        visualClue: {
          type: 'flag',
          value: 'Basque Country',
          label: 'Ikurriña Flag'
        },
        options: ['Basque Country (Spain)', 'Catalonia (Spain)', 'Galicia (Spain)', 'Andalusia (Spain)'],
        correctAnswer: 'Basque Country (Spain)',
        hint: 'Designed in 1894 by brothers Luis and Sabino Arana',
        explanation: 'The Ikurriña is the official flag of the Basque Autonomous Community.'
      },
      {
        id: 'way-7',
        type: 'multiple-choice',
        prompt: 'A store displays a Dutch netnummer area code "010". Which major seaport city are you visiting?',
        visualClue: {
          type: 'tel',
          value: '010 - 414 00 20',
          label: 'Dutch Netnummer'
        },
        options: ['Rotterdam', 'Amsterdam (020)', 'The Hague (070)', 'Utrecht (030)'],
        correctAnswer: 'Rotterdam',
        hint: 'Europe’s largest seaport',
        explanation: 'In the Netherlands, 010 belongs to Rotterdam, while Amsterdam uses 020 and The Hague uses 070.'
      },
      {
        id: 'way-8',
        type: 'multiple-choice',
        prompt: 'You drive past this Interstate highway marker. Which major coast-to-coast route are you on?',
        visualClue: {
          type: 'road-shield',
          value: 'INTERSTATE 80',
          subValue: 'San Francisco ⟷ New York City'
        },
        options: ['Interstate 80', 'Interstate 95', 'Interstate 10', 'Interstate 5'],
        correctAnswer: 'Interstate 80',
        hint: 'Runs nearly 2,900 miles from downtown San Francisco to near NYC',
        explanation: 'I-80 is the second longest interstate in the United States, following the historic Lincoln Highway route.'
      }
    ]
  }
];
