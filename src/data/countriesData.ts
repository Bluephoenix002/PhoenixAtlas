export interface CountryInfo {
  id: string;
  iso3?: string;
  name: string;
  nativeName?: string;
  capital: string;
  nativeCapital?: string;
  continent: 'Europe' | 'Asia' | 'Africa' | 'North America' | 'South America' | 'Oceania' | 'Antarctica';
  subregion?: string;
  population: number;
  areaKm2: number;
  lat: number;
  lng: number;
  languages: string[];
  currencies: string[];
  flagEmoji: string;
  hasSubdivisions?: boolean;
  subdivisionType?: string;
  subdivisionFile?: string;
  isTerritory?: boolean;
  facts: string[];
}

export const COUNTRIES_DATABASE: Record<string, CountryInfo> = {
  "AW": {
    "id": "AW",
    "iso3": "ABW",
    "name": "Aruba",
    "nativeName": "Aruba",
    "capital": "Oranjestad",
    "continent": "North America",
    "subregion": "Caribbean",
    "population": 21600,
    "areaKm2": 180,
    "lat": 12.5092,
    "lng": -70.0086,
    "languages": [
      "Dutch",
      "Papiamento"
    ],
    "currencies": [
      "Aruban florin (AWG)"
    ],
    "flagEmoji": "🇦🇼",
    "facts": [
      "Oranjestad sits near 12.5°N latitude and serves as the political, cultural, and transport hub of Aruba in Caribbean.",
      "With a land area of 180 km² and ~21,600 residents, Aruba has a population density of roughly 120 people per km².",
      "In regional geography, Aruba is identified by its ISO code \"AW\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Oranjestad"
  },
  "AF": {
    "id": "AF",
    "iso3": "AFG",
    "name": "Afghanistan",
    "nativeName": "افغانستان",
    "capital": "Kabul",
    "continent": "Asia",
    "subregion": "Southern Asia",
    "population": 34124811,
    "areaKm2": 652230,
    "lat": 34.5281,
    "lng": 69.1723,
    "languages": [
      "Dari",
      "Pashto",
      "Turkmen"
    ],
    "currencies": [
      "Afghan afghani (AFN)"
    ],
    "flagEmoji": "🇦🇫",
    "facts": [
      "Home to the Wakhan Corridor, a narrow 350 km panhandle created in the 19th century as a buffer between the Russian and British empires.",
      "Buzkashi, played on horseback with a headless goat carcass, is the national sport.",
      "The ancient Buddhas of Bamiyan were carved into sandstone cliffs along the Silk Road in the 6th century."
    ],
    "nativeCapital": "کابل"
  },
  "AO": {
    "id": "AO",
    "iso3": "AGO",
    "name": "Angola",
    "nativeName": "Angola",
    "capital": "Luanda",
    "continent": "Africa",
    "subregion": "Middle Africa",
    "population": 29310273,
    "areaKm2": 1246700,
    "lat": -8.839,
    "lng": 13.2894,
    "languages": [
      "Portuguese"
    ],
    "currencies": [
      "Angolan kwanza (AOA)"
    ],
    "flagEmoji": "🇦🇴",
    "facts": [
      "Angola includes the exclave province of Cabinda, separated from the rest of the country by a 60 km strip of DR Congo.",
      "Kalandula Falls on the Lucala River is one of Africa’s largest waterfalls by water volume.",
      "The giant sable antelope (palanca negra gigante), once thought extinct, is Angola’s revered national symbol."
    ],
    "nativeCapital": "Luanda"
  },
  "AI": {
    "id": "AI",
    "iso3": "AIA",
    "name": "Anguilla",
    "nativeName": "Anguilla",
    "capital": "The Valley",
    "continent": "North America",
    "subregion": "Caribbean",
    "population": 10920,
    "areaKm2": 91,
    "lat": 18.2148,
    "lng": -63.0574,
    "languages": [
      "English"
    ],
    "currencies": [
      "Eastern Caribbean dollar (XCD)"
    ],
    "flagEmoji": "🇦🇮",
    "facts": [
      "The Valley sits near 18.2°N latitude and serves as the political, cultural, and transport hub of Anguilla in Caribbean.",
      "With a land area of 91 km² and ~10,920 residents, Anguilla has a population density of roughly 120 people per km².",
      "In regional geography, Anguilla is identified by its ISO code \"AI\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "The Valley"
  },
  "AX": {
    "id": "AX",
    "iso3": "ALA",
    "name": "Åland Islands",
    "nativeName": "Åland",
    "capital": "Mariehamn",
    "continent": "Europe",
    "subregion": "Northern Europe",
    "population": 189600,
    "areaKm2": 1580,
    "lat": 60.097,
    "lng": 19.9348,
    "languages": [
      "Swedish"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇦🇽",
    "facts": [
      "Mariehamn sits near 60.1°N latitude and serves as the political, cultural, and transport hub of Åland Islands in Northern Europe.",
      "With a land area of 1,580 km² and ~189,600 residents, Åland Islands has a population density of roughly 120 people per km².",
      "In regional geography, Åland Islands is identified by its ISO code \"AX\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Mariehamn"
  },
  "AL": {
    "id": "AL",
    "iso3": "ALB",
    "name": "Albania",
    "nativeName": "Shqipëria",
    "capital": "Tirana",
    "continent": "Europe",
    "subregion": "Southeast Europe",
    "population": 3047987,
    "areaKm2": 28748,
    "lat": 41.3275,
    "lng": 19.8187,
    "languages": [
      "Albanian"
    ],
    "currencies": [
      "Albanian lek (ALL)"
    ],
    "flagEmoji": "🇦🇱",
    "facts": [
      "Over 173,000 concrete military bunkers were built across Albania between 1967 and 1986 under Enver Hoxha.",
      "Albanians nod their heads to mean No and shake their heads side-to-side to mean Yes.",
      "Lake Ohrid on the Albania–North Macedonia border is Europe’s oldest and deepest tectonic lake (over 1.2 million years old)."
    ],
    "nativeCapital": "Tiranë"
  },
  "AD": {
    "id": "AD",
    "iso3": "AND",
    "name": "Andorra",
    "nativeName": "Andorra",
    "capital": "Andorra la Vella",
    "continent": "Europe",
    "subregion": "Southern Europe",
    "population": 56160,
    "areaKm2": 468,
    "lat": 42.5063,
    "lng": 1.5218,
    "languages": [
      "Catalan"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇦🇩",
    "facts": [
      "Andorra is the only country in the world where Catalan is the sole official national language.",
      "It is a co-principality jointly headed by two foreign leaders: the President of France and the Bishop of Urgell in Spain.",
      "Andorra has no commercial airport or railway station; all entry is by mountain roads through the Pyrenees."
    ],
    "nativeCapital": "Andorra la Vella"
  },
  "AE": {
    "id": "AE",
    "iso3": "ARE",
    "name": "United Arab Emirates",
    "nativeName": "الإمارات العربية المتحدة",
    "capital": "Abu Dhabi",
    "continent": "Asia",
    "subregion": "Western Asia",
    "population": 6072475,
    "areaKm2": 83600,
    "lat": 24.4539,
    "lng": 54.3773,
    "languages": [
      "Arabic"
    ],
    "currencies": [
      "United Arab Emirates dirham (AED)"
    ],
    "flagEmoji": "🇦🇪",
    "facts": [
      "Burj Khalifa in Dubai stands at 828 meters (163 floors)—more than 150 meters taller than the next tallest building on Earth.",
      "The UAE consists of seven federation emirates: Abu Dhabi (which makes up 87% of the total land area), Dubai, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, and Fujairah.",
      "Jebel Jais in Ras Al Khaimah (1,934 m) is the highest peak in the UAE and hosts the world’s longest zipline (2.83 km)."
    ],
    "nativeCapital": "أبوظبي"
  },
  "AR": {
    "id": "AR",
    "iso3": "ARG",
    "name": "Argentina",
    "nativeName": "Argentina",
    "capital": "Buenos Aires",
    "continent": "South America",
    "subregion": "South America",
    "population": 44293293,
    "areaKm2": 2780400,
    "lat": -34.6037,
    "lng": -58.3816,
    "languages": [
      "Guaraní",
      "Spanish"
    ],
    "currencies": [
      "Argentine peso (ARS)"
    ],
    "flagEmoji": "🇦🇷",
    "facts": [
      "Argentina contains both the highest peak in the Americas (Aconcagua at 6,961 m) and the lowest point in South America (Laguna del Carbón at -105 m).",
      "Avenida 9 de Julio in Buenos Aires is one of the widest avenues in the world, spanning up to 140 meters across 16 lanes.",
      "Ushuaia in Tierra del Fuego is the southernmost city on Earth and gateway to Antarctica."
    ],
    "nativeCapital": "Buenos Aires"
  },
  "AM": {
    "id": "AM",
    "iso3": "ARM",
    "name": "Armenia",
    "nativeName": "Հայաստան",
    "capital": "Yerevan",
    "continent": "Asia",
    "subregion": "Western Asia",
    "population": 3045191,
    "areaKm2": 29743,
    "lat": 40.1792,
    "lng": 44.4991,
    "languages": [
      "Armenian"
    ],
    "currencies": [
      "Armenian dram (AMD)"
    ],
    "flagEmoji": "🇦🇲",
    "facts": [
      "In 301 AD, Armenia became the first nation in history to adopt Christianity as its official state religion.",
      "The Armenian alphabet of 39 letters was invented in 405 AD by scholar Mesrop Mashtots and has its own monument on Mount Aragats.",
      "Yerevan is called the Pink City because most buildings are constructed from rose-colored volcanic tuff stone."
    ],
    "nativeCapital": "Երևան"
  },
  "AS": {
    "id": "AS",
    "iso3": "ASM",
    "name": "American Samoa",
    "nativeName": "Amerika Sāmoa",
    "capital": "Pago Pago",
    "continent": "Oceania",
    "subregion": "Polynesia",
    "population": 23880,
    "areaKm2": 199,
    "lat": -14.2756,
    "lng": -170.702,
    "languages": [
      "English",
      "Samoan"
    ],
    "currencies": [
      "United States dollar (USD)"
    ],
    "flagEmoji": "🇦🇸",
    "facts": [
      "Pago Pago sits near 14.3°S latitude and serves as the political, cultural, and transport hub of American Samoa in Polynesia.",
      "With a land area of 199 km² and ~23,880 residents, American Samoa has a population density of roughly 120 people per km².",
      "In regional geography, American Samoa is identified by its ISO code \"AS\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Pago Pago"
  },
  "AQ": {
    "id": "AQ",
    "iso3": "ATA",
    "name": "Antarctica",
    "nativeName": "Antarctica",
    "capital": "N/A",
    "continent": "Europe",
    "subregion": "",
    "population": 4050,
    "areaKm2": 14000000,
    "lat": -78.1,
    "lng": 100,
    "languages": [
      "National Language"
    ],
    "currencies": [
      "National Currency"
    ],
    "flagEmoji": "🇦🇶",
    "facts": [
      "N/A sits near 78.1°S latitude and serves as the political, cultural, and transport hub of Antarctica in its region.",
      "With a land area of 14,000,000 km² and ~4,050 residents, Antarctica has a population density of roughly 1 people per km².",
      "In regional geography, Antarctica is identified by its ISO code \"AQ\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "McMurdo Station"
  },
  "TF": {
    "id": "TF",
    "iso3": "ATF",
    "name": "French Southern and Antarctic Lands",
    "nativeName": "Terres australes et antarctiques françaises",
    "capital": "Port-aux-Français",
    "continent": "Europe",
    "subregion": "",
    "population": 1000,
    "areaKm2": 7747,
    "lat": -49.3002,
    "lng": 69.0672,
    "languages": [
      "French"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇹🇫",
    "facts": [
      "Port-aux-Français sits near 49.3°S latitude and serves as the political, cultural, and transport hub of French Southern and Antarctic Lands in its region.",
      "With a land area of 7,747 km² and ~1,000 residents, French Southern and Antarctic Lands has a population density of roughly 1 people per km².",
      "In regional geography, French Southern and Antarctic Lands is identified by its ISO code \"TF\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Port-aux-Français"
  },
  "AG": {
    "id": "AG",
    "iso3": "ATG",
    "name": "Antigua and Barbuda",
    "nativeName": "Antigua and Barbuda",
    "capital": "Saint John's",
    "continent": "North America",
    "subregion": "Caribbean",
    "population": 53040,
    "areaKm2": 442,
    "lat": 17.1175,
    "lng": -61.8456,
    "languages": [
      "English"
    ],
    "currencies": [
      "Eastern Caribbean dollar (XCD)"
    ],
    "flagEmoji": "🇦🇬",
    "facts": [
      "Saint John's sits near 17.1°N latitude and serves as the political, cultural, and transport hub of Antigua and Barbuda in Caribbean.",
      "With a land area of 442 km² and ~53,040 residents, Antigua and Barbuda has a population density of roughly 120 people per km².",
      "In regional geography, Antigua and Barbuda is identified by its ISO code \"AG\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Saint John’s"
  },
  "AU": {
    "id": "AU",
    "iso3": "AUS",
    "name": "Australia",
    "nativeName": "Australia",
    "capital": "Canberra",
    "continent": "Oceania",
    "subregion": "Australia and New Zealand",
    "population": 23232413,
    "areaKm2": 7692024,
    "lat": -35.2809,
    "lng": 149.13,
    "languages": [
      "English"
    ],
    "currencies": [
      "Australian dollar (AUD)"
    ],
    "flagEmoji": "🇦🇺",
    "facts": [
      "Australia’s Dingo Fence stretches 5,614 km across three states—the longest fence structure in the world.",
      "There are more kangaroos than humans in Australia, and around 10,685 beaches along its coastline.",
      "Anna Creek Station in South Australia is the world’s largest working cattle ranch, larger than the entire country of Israel."
    ],
    "nativeCapital": "Canberra"
  },
  "AT": {
    "id": "AT",
    "iso3": "AUT",
    "name": "Austria",
    "nativeName": "Österreich",
    "capital": "Vienna",
    "continent": "Europe",
    "subregion": "Central Europe",
    "population": 8754413,
    "areaKm2": 83871,
    "lat": 48.2082,
    "lng": 16.3738,
    "languages": [
      "Austro-Bavarian German"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇦🇹",
    "facts": [
      "Around 62% of Austria’s land area is covered by the Austrian Alps, leaving only a third of the country below 500 meters elevation.",
      "Vienna’s Tiergarten Schönbrunn, founded in 1752, is the oldest continuously operating zoo in the world.",
      "Krimml Waterfalls in Salzburg plunge 380 meters in three stages, making them the highest waterfall in Central Europe."
    ],
    "nativeCapital": "Wien"
  },
  "AZ": {
    "id": "AZ",
    "iso3": "AZE",
    "name": "Azerbaijan",
    "nativeName": "Azərbaycan",
    "capital": "Baku",
    "continent": "Asia",
    "subregion": "Western Asia",
    "population": 9961396,
    "areaKm2": 86600,
    "lat": 40.4093,
    "lng": 49.8671,
    "languages": [
      "Azerbaijani",
      "Russian"
    ],
    "currencies": [
      "Azerbaijani manat (AZN)"
    ],
    "flagEmoji": "🇦🇿",
    "facts": [
      "Known as the Land of Fire due to natural gas vents like Yanar Dağ, a hillside near Baku that has burned continuously for decades.",
      "Azerbaijan has roughly half of all the mud volcanoes on Earth (over 400 along the Caspian coast).",
      "Nakhchivan is a landlocked exclave of Azerbaijan separated from the mainland by Armenian territory."
    ],
    "nativeCapital": "Bakı"
  },
  "BI": {
    "id": "BI",
    "iso3": "BDI",
    "name": "Burundi",
    "nativeName": "Burundi",
    "capital": "Gitega",
    "continent": "Africa",
    "subregion": "Eastern Africa",
    "population": 11466756,
    "areaKm2": 27834,
    "lat": -3.4271,
    "lng": 29.9246,
    "languages": [
      "French",
      "Kirundi"
    ],
    "currencies": [
      "Burundian franc (BIF)"
    ],
    "flagEmoji": "🇧🇮",
    "facts": [
      "Gitega sits near 3.4°S latitude and serves as the political, cultural, and transport hub of Burundi in Eastern Africa.",
      "With a land area of 27,834 km² and ~11.5 million residents, Burundi has a population density of roughly 412 people per km².",
      "In regional geography, Burundi is identified by its ISO code \"BI\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Gitega"
  },
  "BE": {
    "id": "BE",
    "iso3": "BEL",
    "name": "Belgium",
    "nativeName": "België / Belgique / Belgien",
    "capital": "Brussels",
    "continent": "Europe",
    "subregion": "Western Europe",
    "population": 11491346,
    "areaKm2": 30528,
    "lat": 50.8503,
    "lng": 4.3517,
    "languages": [
      "German",
      "French",
      "Dutch"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇧🇪",
    "facts": [
      "Belgium’s motorway network is famous for being almost completely illuminated at night, visible even from space.",
      "The Belgian town of Baarle-Hertog consists of 22 tiny Belgian enclaves inside the Netherlands, some containing Dutch counter-enclaves.",
      "Belgium holds the world record for the longest period without an elected federal government (589 days in 2010–2011)."
    ],
    "nativeCapital": "Bruxelles / Brussel"
  },
  "BJ": {
    "id": "BJ",
    "iso3": "BEN",
    "name": "Benin",
    "nativeName": "Bénin",
    "capital": "Porto-Novo",
    "continent": "Africa",
    "subregion": "Western Africa",
    "population": 11038805,
    "areaKm2": 112622,
    "lat": 6.4969,
    "lng": 2.6289,
    "languages": [
      "French"
    ],
    "currencies": [
      "West African CFA franc (XOF)"
    ],
    "flagEmoji": "🇧🇯",
    "facts": [
      "Porto-Novo sits near 6.5°N latitude and serves as the political, cultural, and transport hub of Benin in Western Africa.",
      "With a land area of 112,622 km² and ~11.0 million residents, Benin has a population density of roughly 98 people per km².",
      "In regional geography, Benin is identified by its ISO code \"BJ\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Porto-Novo"
  },
  "BF": {
    "id": "BF",
    "iso3": "BFA",
    "name": "Burkina Faso",
    "nativeName": "Burkina Faso",
    "capital": "Ouagadougou",
    "continent": "Africa",
    "subregion": "Western Africa",
    "population": 20107509,
    "areaKm2": 272967,
    "lat": 12.3714,
    "lng": -1.5197,
    "languages": [
      "French"
    ],
    "currencies": [
      "West African CFA franc (XOF)"
    ],
    "flagEmoji": "🇧🇫",
    "facts": [
      "Ouagadougou sits near 12.4°N latitude and serves as the political, cultural, and transport hub of Burkina Faso in Western Africa.",
      "With a land area of 272,967 km² and ~20.1 million residents, Burkina Faso has a population density of roughly 74 people per km².",
      "In regional geography, Burkina Faso is identified by its ISO code \"BF\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Ouagadougou"
  },
  "BD": {
    "id": "BD",
    "iso3": "BGD",
    "name": "Bangladesh",
    "nativeName": "বাংলাদেশ",
    "capital": "Dhaka",
    "continent": "Asia",
    "subregion": "Southern Asia",
    "population": 157826578,
    "areaKm2": 147570,
    "lat": 23.8103,
    "lng": 90.4125,
    "languages": [
      "Bengali"
    ],
    "currencies": [
      "Bangladeshi taka (BDT)"
    ],
    "flagEmoji": "🇧🇩",
    "facts": [
      "Bangladesh sits on the Ganges-Brahmaputra Delta, the largest river delta on Earth, crisscrossed by over 700 rivers.",
      "Cox’s Bazar in southeastern Bangladesh has the world’s longest uninterrupted natural sandy sea beach at 120 km.",
      "The Bengali Language Movement of February 21, 1952 inspired UNESCO’s International Mother Language Day."
    ],
    "nativeCapital": "ঢাকা"
  },
  "BG": {
    "id": "BG",
    "iso3": "BGR",
    "name": "Bulgaria",
    "nativeName": "България",
    "capital": "Sofia",
    "continent": "Europe",
    "subregion": "Southeast Europe",
    "population": 7101510,
    "areaKm2": 110879,
    "lat": 42.6977,
    "lng": 23.3219,
    "languages": [
      "Bulgarian"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇧🇬",
    "facts": [
      "Bulgaria is the birthplace of the Cyrillic alphabet, developed at the Preslav and Ohrid literary schools in the 9th century.",
      "Bulgaria’s Rose Valley near Kazanlak produces over 70% of the world’s prized Otto rose oil used in luxury perfumes.",
      "Plovdiv is one of the oldest continuously inhabited cities in Europe, dating back over 8,000 years."
    ],
    "nativeCapital": "София"
  },
  "BH": {
    "id": "BH",
    "iso3": "BHR",
    "name": "Bahrain",
    "nativeName": "البحرين",
    "capital": "Manama",
    "continent": "Asia",
    "subregion": "Western Asia",
    "population": 91800,
    "areaKm2": 765,
    "lat": 26.2285,
    "lng": 50.586,
    "languages": [
      "Arabic"
    ],
    "currencies": [
      "Bahraini dinar (BHD)"
    ],
    "flagEmoji": "🇧🇭",
    "facts": [
      "Manama sits near 26.2°N latitude and serves as the political, cultural, and transport hub of Bahrain in Western Asia.",
      "With a land area of 765 km² and ~91,800 residents, Bahrain has a population density of roughly 120 people per km².",
      "In regional geography, Bahrain is identified by its ISO code \"BH\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "المنامة"
  },
  "BS": {
    "id": "BS",
    "iso3": "BHS",
    "name": "Bahamas",
    "nativeName": "The Bahamas",
    "capital": "Nassau",
    "continent": "North America",
    "subregion": "Caribbean",
    "population": 329988,
    "areaKm2": 13943,
    "lat": 25.048,
    "lng": -77.3554,
    "languages": [
      "English"
    ],
    "currencies": [
      "Bahamian dollar (BSD)",
      "United States dollar (USD)"
    ],
    "flagEmoji": "🇧🇸",
    "facts": [
      "Nassau sits near 25.0°N latitude and serves as the political, cultural, and transport hub of Bahamas in Caribbean.",
      "With a land area of 13,943 km² and ~329,988 residents, Bahamas has a population density of roughly 24 people per km².",
      "In regional geography, Bahamas is identified by its ISO code \"BS\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Nassau"
  },
  "BA": {
    "id": "BA",
    "iso3": "BIH",
    "name": "Bosnia and Herzegovina",
    "nativeName": "Bosna i Hercegovina / Босна и Херцеговина",
    "capital": "Sarajevo",
    "continent": "Europe",
    "subregion": "Southeast Europe",
    "population": 3856181,
    "areaKm2": 51209,
    "lat": 43.8563,
    "lng": 18.4131,
    "languages": [
      "Bosnian",
      "Croatian",
      "Serbian"
    ],
    "currencies": [
      "Bosnia and Herzegovina convertible mark (BAM)"
    ],
    "flagEmoji": "🇧🇦",
    "facts": [
      "Bosnia and Herzegovina is almost landlocked except for a tiny 20 km Adriatic coastline around the town of Neum.",
      "Perućica in Sutjeska National Park is one of the last remaining primeval rainforests in Europe.",
      "Sarajevo hosted the 1984 Winter Olympics and is one of the few European capitals with a mosque, Catholic cathedral, Orthodox church, and synagogue on the same square."
    ],
    "nativeCapital": "Sarajevo / Сарајево"
  },
  "BL": {
    "id": "BL",
    "iso3": "BLM",
    "name": "Saint Barthélemy",
    "nativeName": "Saint-Barthélemy",
    "capital": "Gustavia",
    "continent": "North America",
    "subregion": "Caribbean",
    "population": 2520,
    "areaKm2": 21,
    "lat": 17.8964,
    "lng": -62.8498,
    "languages": [
      "French"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇧🇱",
    "facts": [
      "Gustavia sits near 17.9°N latitude and serves as the political, cultural, and transport hub of Saint Barthélemy in Caribbean.",
      "With a land area of 21 km² and ~2,520 residents, Saint Barthélemy has a population density of roughly 120 people per km².",
      "In regional geography, Saint Barthélemy is identified by its ISO code \"BL\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Gustavia"
  },
  "SH": {
    "id": "SH",
    "iso3": "SHN",
    "name": "Saint Helena, Ascension and Tristan da Cunha",
    "nativeName": "Saint Helena",
    "capital": "Jamestown",
    "continent": "Africa",
    "subregion": "Western Africa",
    "population": 47280,
    "areaKm2": 394,
    "lat": -15.9251,
    "lng": -5.718,
    "languages": [
      "English"
    ],
    "currencies": [
      "Pound sterling (GBP)",
      "Saint Helena pound (SHP)"
    ],
    "flagEmoji": "🇸🇭",
    "facts": [
      "Jamestown sits near 15.9°S latitude and serves as the political, cultural, and transport hub of Saint Helena, Ascension and Tristan da Cunha in Western Africa.",
      "With a land area of 394 km² and ~47,280 residents, Saint Helena, Ascension and Tristan da Cunha has a population density of roughly 120 people per km².",
      "In regional geography, Saint Helena, Ascension and Tristan da Cunha is identified by its ISO code \"SH\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Jamestown"
  },
  "BY": {
    "id": "BY",
    "iso3": "BLR",
    "name": "Belarus",
    "nativeName": "Беларусь",
    "capital": "Minsk",
    "continent": "Europe",
    "subregion": "Eastern Europe",
    "population": 9549747,
    "areaKm2": 207600,
    "lat": 53.9006,
    "lng": 27.559,
    "languages": [
      "Belarusian",
      "Russian"
    ],
    "currencies": [
      "Belarusian ruble (BYN)"
    ],
    "flagEmoji": "🇧🇾",
    "facts": [
      "Minsk sits near 53.9°N latitude and serves as the political, cultural, and transport hub of Belarus in Eastern Europe.",
      "With a land area of 207,600 km² and ~9.5 million residents, Belarus has a population density of roughly 46 people per km².",
      "In regional geography, Belarus is identified by its ISO code \"BY\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Мінск"
  },
  "BZ": {
    "id": "BZ",
    "iso3": "BLZ",
    "name": "Belize",
    "nativeName": "Belize",
    "capital": "Belmopan",
    "continent": "North America",
    "subregion": "Central America",
    "population": 360346,
    "areaKm2": 22966,
    "lat": 17.251,
    "lng": -88.759,
    "languages": [
      "Belizean Creole",
      "English",
      "Spanish"
    ],
    "currencies": [
      "Belize dollar (BZD)"
    ],
    "flagEmoji": "🇧🇿",
    "facts": [
      "Belmopan sits near 17.3°N latitude and serves as the political, cultural, and transport hub of Belize in Central America.",
      "With a land area of 22,966 km² and ~360,346 residents, Belize has a population density of roughly 16 people per km².",
      "In regional geography, Belize is identified by its ISO code \"BZ\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Belmopan"
  },
  "BM": {
    "id": "BM",
    "iso3": "BMU",
    "name": "Bermuda",
    "nativeName": "Bermuda",
    "capital": "Hamilton",
    "continent": "North America",
    "subregion": "North America",
    "population": 6480,
    "areaKm2": 54,
    "lat": 32.2949,
    "lng": -64.7814,
    "languages": [
      "English"
    ],
    "currencies": [
      "Bermudian dollar (BMD)"
    ],
    "flagEmoji": "🇧🇲",
    "facts": [
      "Hamilton sits near 32.3°N latitude and serves as the political, cultural, and transport hub of Bermuda in North America.",
      "With a land area of 54 km² and ~6,480 residents, Bermuda has a population density of roughly 120 people per km².",
      "In regional geography, Bermuda is identified by its ISO code \"BM\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Hamilton"
  },
  "BO": {
    "id": "BO",
    "iso3": "BOL",
    "name": "Bolivia",
    "nativeName": "Bolivia",
    "capital": "Sucre",
    "continent": "South America",
    "subregion": "South America",
    "population": 11138234,
    "areaKm2": 1098581,
    "lat": -19.0196,
    "lng": -65.2619,
    "languages": [
      "Aymara",
      "Guaraní",
      "Quechua",
      "Spanish"
    ],
    "currencies": [
      "Bolivian boliviano (BOB)"
    ],
    "flagEmoji": "🇧🇴",
    "facts": [
      "Salar de Uyuni is the world’s largest salt flat (10,582 km²) and becomes a giant sky mirror during the rainy season.",
      "La Paz sits at 3,640 m elevation and uses Mi Teleférico, the longest and highest urban cable-car transit network on Earth.",
      "Bolivia has two capitals: Sucre is the constitutional and judicial capital, while La Paz is the seat of government."
    ],
    "nativeCapital": "Sucre"
  },
  "BQ": {
    "id": "BQ",
    "iso3": "BES",
    "name": "Caribbean Netherlands",
    "nativeName": "Caribbean Netherlands",
    "capital": "Kralendijk",
    "continent": "North America",
    "subregion": "Caribbean",
    "population": 39360,
    "areaKm2": 328,
    "lat": 12.1443,
    "lng": -68.2655,
    "languages": [
      "English",
      "Dutch",
      "Papiamento"
    ],
    "currencies": [
      "United States dollar (USD)"
    ],
    "flagEmoji": "🇧🇶",
    "facts": [
      "Kralendijk sits near 12.1°N latitude and serves as the political, cultural, and transport hub of Caribbean Netherlands in Caribbean.",
      "With a land area of 328 km² and ~39,360 residents, Caribbean Netherlands has a population density of roughly 120 people per km².",
      "In regional geography, Caribbean Netherlands is identified by its ISO code \"BQ\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Kralendijk"
  },
  "BR": {
    "id": "BR",
    "iso3": "BRA",
    "name": "Brazil",
    "nativeName": "Brasil",
    "capital": "Brasília",
    "continent": "South America",
    "subregion": "South America",
    "population": 207353391,
    "areaKm2": 8515767,
    "lat": -15.7975,
    "lng": -47.8919,
    "languages": [
      "Portuguese"
    ],
    "currencies": [
      "Brazilian real (BRL)"
    ],
    "flagEmoji": "🇧🇷",
    "facts": [
      "Brazil borders every South American country except Chile and Ecuador, and holds 60% of the Amazon Rainforest.",
      "Ilha da Queimada Grande (Snake Island) off São Paulo is closed to the public due to having roughly one golden lancehead viper per square meter.",
      "Brazil’s telephone area codes (DDD) run from 11 (São Paulo) up to 99 (Maranhão), organized geographically by region."
    ],
    "nativeCapital": "Brasília"
  },
  "BB": {
    "id": "BB",
    "iso3": "BRB",
    "name": "Barbados",
    "nativeName": "Barbados",
    "capital": "Bridgetown",
    "continent": "North America",
    "subregion": "Caribbean",
    "population": 51600,
    "areaKm2": 430,
    "lat": 13.0969,
    "lng": -59.6145,
    "languages": [
      "English"
    ],
    "currencies": [
      "Barbadian dollar (BBD)"
    ],
    "flagEmoji": "🇧🇧",
    "facts": [
      "Bridgetown sits near 13.1°N latitude and serves as the political, cultural, and transport hub of Barbados in Caribbean.",
      "With a land area of 430 km² and ~51,600 residents, Barbados has a population density of roughly 120 people per km².",
      "In regional geography, Barbados is identified by its ISO code \"BB\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Bridgetown"
  },
  "BN": {
    "id": "BN",
    "iso3": "BRN",
    "name": "Brunei",
    "nativeName": "Brunei / بروني",
    "capital": "Bandar Seri Begawan",
    "continent": "Asia",
    "subregion": "South-Eastern Asia",
    "population": 443593,
    "areaKm2": 5765,
    "lat": 4.9031,
    "lng": 114.9398,
    "languages": [
      "Malay"
    ],
    "currencies": [
      "Brunei dollar (BND)",
      "Singapore dollar (SGD)"
    ],
    "flagEmoji": "🇧🇳",
    "facts": [
      "Bandar Seri Begawan sits near 4.9°N latitude and serves as the political, cultural, and transport hub of Brunei in South-Eastern Asia.",
      "With a land area of 5,765 km² and ~443,593 residents, Brunei has a population density of roughly 77 people per km².",
      "In regional geography, Brunei is identified by its ISO code \"BN\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Bandar Seri Begawan / بندر سري بڬاون"
  },
  "BT": {
    "id": "BT",
    "iso3": "BTN",
    "name": "Bhutan",
    "nativeName": "འབྲུག་ཡུལ་",
    "capital": "Thimphu",
    "continent": "Asia",
    "subregion": "Southern Asia",
    "population": 758288,
    "areaKm2": 38394,
    "lat": 27.4728,
    "lng": 89.6393,
    "languages": [
      "Dzongkha"
    ],
    "currencies": [
      "Bhutanese ngultrum (BTN)",
      "Indian rupee (INR)"
    ],
    "flagEmoji": "🇧🇹",
    "facts": [
      "Thimphu sits near 27.5°N latitude and serves as the political, cultural, and transport hub of Bhutan in Southern Asia.",
      "With a land area of 38,394 km² and ~758,288 residents, Bhutan has a population density of roughly 20 people per km².",
      "In regional geography, Bhutan is identified by its ISO code \"BT\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "ཐིམ་ཕུག"
  },
  "BV": {
    "id": "BV",
    "iso3": "BVT",
    "name": "Bouvet Island",
    "nativeName": "Bouvetøya",
    "capital": "N/A",
    "continent": "Europe",
    "subregion": "",
    "population": 5880,
    "areaKm2": 49,
    "lat": -54.4333,
    "lng": 3.4,
    "languages": [
      "Norwegian"
    ],
    "currencies": [
      "National Currency"
    ],
    "flagEmoji": "🇧🇻",
    "facts": [
      "N/A sits near 54.4°S latitude and serves as the political, cultural, and transport hub of Bouvet Island in its region.",
      "With a land area of 49 km² and ~5,880 residents, Bouvet Island has a population density of roughly 120 people per km².",
      "In regional geography, Bouvet Island is identified by its ISO code \"BV\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "N/A"
  },
  "BW": {
    "id": "BW",
    "iso3": "BWA",
    "name": "Botswana",
    "nativeName": "Botswana",
    "capital": "Gaborone",
    "continent": "Africa",
    "subregion": "Southern Africa",
    "population": 2214858,
    "areaKm2": 582000,
    "lat": -24.6282,
    "lng": 25.9231,
    "languages": [
      "English",
      "Tswana"
    ],
    "currencies": [
      "Botswana pula (BWP)"
    ],
    "flagEmoji": "🇧🇼",
    "facts": [
      "The Okavango Delta is one of the world’s largest inland river deltas, emptying into the Kalahari Desert instead of the ocean.",
      "Botswana is home to the largest elephant population in the world (over 130,000 African elephants, mostly in Chobe).",
      "At the Kazungula quadripoint on the Zambezi River, Botswana, Namibia, Zambia, and Zimbabwe meet within meters of each other."
    ],
    "nativeCapital": "Gaborone"
  },
  "CF": {
    "id": "CF",
    "iso3": "CAF",
    "name": "Central African Republic",
    "nativeName": "République centrafricaine / Ködörösêse tî Bêafrîka",
    "capital": "Bangui",
    "continent": "Africa",
    "subregion": "Middle Africa",
    "population": 5625118,
    "areaKm2": 622984,
    "lat": 4.3947,
    "lng": 18.5582,
    "languages": [
      "French",
      "Sango"
    ],
    "currencies": [
      "Central African CFA franc (XAF)"
    ],
    "flagEmoji": "🇨🇫",
    "facts": [
      "Bangui sits near 4.4°N latitude and serves as the political, cultural, and transport hub of Central African Republic in Middle Africa.",
      "With a land area of 622,984 km² and ~5.6 million residents, Central African Republic has a population density of roughly 9 people per km².",
      "In regional geography, Central African Republic is identified by its ISO code \"CF\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Bangui"
  },
  "CA": {
    "id": "CA",
    "iso3": "CAN",
    "name": "Canada",
    "nativeName": "Canada",
    "capital": "Ottawa",
    "continent": "North America",
    "subregion": "North America",
    "population": 35623680,
    "areaKm2": 9984670,
    "lat": 45.4215,
    "lng": -75.6972,
    "languages": [
      "English",
      "French"
    ],
    "currencies": [
      "Canadian dollar (CAD)"
    ],
    "flagEmoji": "🇨🇦",
    "facts": [
      "Canada has more lakes than the rest of the world combined—over 2 million lakes covering about 9% of its territory.",
      "At 243,042 km, Canada’s coastline is the longest of any country on Earth, bordering three oceans.",
      "Narcisse in Manitoba hosts the largest concentration of garter snakes in the world each spring (tens of thousands in single dens)."
    ],
    "nativeCapital": "Ottawa"
  },
  "CC": {
    "id": "CC",
    "iso3": "CCK",
    "name": "Cocos (Keeling) Islands",
    "nativeName": "Cocos (Keeling) Islands",
    "capital": "West Island",
    "continent": "Oceania",
    "subregion": "Australia and New Zealand",
    "population": 1680,
    "areaKm2": 14,
    "lat": -12.1889,
    "lng": 96.8294,
    "languages": [
      "English"
    ],
    "currencies": [
      "Australian dollar (AUD)"
    ],
    "flagEmoji": "🇨🇨",
    "facts": [
      "West Island sits near 12.2°S latitude and serves as the political, cultural, and transport hub of Cocos (Keeling) Islands in Australia and New Zealand.",
      "With a land area of 14 km² and ~1,680 residents, Cocos (Keeling) Islands has a population density of roughly 120 people per km².",
      "In regional geography, Cocos (Keeling) Islands is identified by its ISO code \"CC\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "West Island"
  },
  "CH": {
    "id": "CH",
    "iso3": "CHE",
    "name": "Switzerland",
    "nativeName": "Schweiz / Suisse / Svizzera / Svizra",
    "capital": "Bern",
    "continent": "Europe",
    "subregion": "Western Europe",
    "population": 8236303,
    "areaKm2": 41284,
    "lat": 46.948,
    "lng": 7.4474,
    "languages": [
      "French",
      "Swiss German",
      "Italian",
      "Romansh"
    ],
    "currencies": [
      "Swiss franc (CHF)"
    ],
    "flagEmoji": "🇨🇭",
    "facts": [
      "The Gotthard Base Tunnel through the Swiss Alps is the longest and deepest railway tunnel in the world at 57.09 kilometers.",
      "Switzerland has four national languages (German, French, Italian, and Romansh) and no official single capital city—Bern serves as the Federal City (Bundesstadt).",
      "Every Swiss car license plate and canton coat of arms starts with a 2-letter canton code (e.g., ZH = Zürich, BE = Bern, GE = Geneva, TI = Ticino)."
    ],
    "nativeCapital": "Bern / Berne / Berna"
  },
  "CL": {
    "id": "CL",
    "iso3": "CHL",
    "name": "Chile",
    "nativeName": "Chile",
    "capital": "Santiago",
    "continent": "South America",
    "subregion": "South America",
    "population": 17789267,
    "areaKm2": 756102,
    "lat": -33.4489,
    "lng": -70.6693,
    "languages": [
      "Spanish"
    ],
    "currencies": [
      "Chilean peso (CLP)"
    ],
    "flagEmoji": "🇨🇱",
    "facts": [
      "Chile’s Atacama Desert is the driest non-polar desert on Earth; some weather stations there have never recorded a single drop of rain.",
      "Stretching 4,270 km north-to-south, Chile averages only 177 km in width from the Andes to the Pacific Ocean.",
      "Chinchorro mummies found in northern Chile are over 7,000 years old—more than 2,000 years older than Egyptian mummies."
    ],
    "nativeCapital": "Santiago"
  },
  "CN": {
    "id": "CN",
    "iso3": "CHN",
    "name": "China",
    "nativeName": "中国",
    "capital": "Beijing",
    "continent": "Asia",
    "subregion": "Eastern Asia",
    "population": 1379302771,
    "areaKm2": 9706961,
    "lat": 39.9042,
    "lng": 116.4074,
    "languages": [
      "Chinese"
    ],
    "currencies": [
      "Chinese yuan (CNY)"
    ],
    "flagEmoji": "🇨🇳",
    "facts": [
      "Despite spanning five geographical time zones from Kashgar to Harbin, all of China uses a single official time zone: Beijing Time (UTC+8).",
      "Over 30 million people in northern China (especially Shaanxi) live in traditional hillside cave dwellings called yaodong.",
      "The Danyang–Kunshan Grand Bridge is the longest bridge in the world at 164.8 kilometers."
    ],
    "nativeCapital": "北京"
  },
  "CI": {
    "id": "CI",
    "iso3": "CIV",
    "name": "Ivory Coast",
    "nativeName": "Côte d’Ivoire",
    "capital": "Yamoussoukro",
    "continent": "Africa",
    "subregion": "Western Africa",
    "population": 24184810,
    "areaKm2": 322463,
    "lat": 6.8276,
    "lng": -5.2893,
    "languages": [
      "French"
    ],
    "currencies": [
      "West African CFA franc (XOF)"
    ],
    "flagEmoji": "🇨🇮",
    "facts": [
      "Yamoussoukro sits near 6.8°N latitude and serves as the political, cultural, and transport hub of Ivory Coast in Western Africa.",
      "With a land area of 322,463 km² and ~24.2 million residents, Ivory Coast has a population density of roughly 75 people per km².",
      "In regional geography, Ivory Coast is identified by its ISO code \"CI\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Yamoussoukro"
  },
  "CM": {
    "id": "CM",
    "iso3": "CMR",
    "name": "Cameroon",
    "nativeName": "Cameroun / Cameroon",
    "capital": "Yaoundé",
    "continent": "Africa",
    "subregion": "Middle Africa",
    "population": 24994885,
    "areaKm2": 475442,
    "lat": 3.848,
    "lng": 11.5021,
    "languages": [
      "English",
      "French"
    ],
    "currencies": [
      "Central African CFA franc (XAF)"
    ],
    "flagEmoji": "🇨🇲",
    "facts": [
      "Cameroon is called Africa in Miniature because it encompasses rainforests, savannas, volcanic mountains, and semi-desert within one country.",
      "Lake Nyos is one of only three known exploding volcanic crater lakes saturated with carbon dioxide.",
      "Mount Cameroon (4,040 m) is the highest peak in West and Central Africa and an active volcano near the Atlantic coast."
    ],
    "nativeCapital": "Yaoundé"
  },
  "CD": {
    "id": "CD",
    "iso3": "COD",
    "name": "DR Congo",
    "nativeName": "République démocratique du Congo",
    "capital": "Kinshasa",
    "continent": "Africa",
    "subregion": "Middle Africa",
    "population": 83301151,
    "areaKm2": 2344858,
    "lat": -4.4419,
    "lng": 15.2663,
    "languages": [
      "French",
      "Kikongo",
      "Lingala",
      "Tshiluba",
      "Swahili"
    ],
    "currencies": [
      "Congolese franc (CDF)"
    ],
    "flagEmoji": "🇨🇩",
    "facts": [
      "Kinshasa sits near 4.4°S latitude and serves as the political, cultural, and transport hub of DR Congo in Middle Africa.",
      "With a land area of 2,344,858 km² and ~83.3 million residents, DR Congo has a population density of roughly 36 people per km².",
      "In regional geography, DR Congo is identified by its ISO code \"CD\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Kinshasa"
  },
  "CG": {
    "id": "CG",
    "iso3": "COG",
    "name": "Congo",
    "nativeName": "République du Congo",
    "capital": "Brazzaville",
    "continent": "Africa",
    "subregion": "Middle Africa",
    "population": 4954674,
    "areaKm2": 342000,
    "lat": -4.2634,
    "lng": 15.2429,
    "languages": [
      "French",
      "Kikongo",
      "Lingala"
    ],
    "currencies": [
      "Central African CFA franc (XAF)"
    ],
    "flagEmoji": "🇨🇬",
    "facts": [
      "Brazzaville sits near 4.3°S latitude and serves as the political, cultural, and transport hub of Congo in Middle Africa.",
      "With a land area of 342,000 km² and ~5.0 million residents, Congo has a population density of roughly 14 people per km².",
      "In regional geography, Congo is identified by its ISO code \"CG\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Brazzaville"
  },
  "CK": {
    "id": "CK",
    "iso3": "COK",
    "name": "Cook Islands",
    "nativeName": "Kūki 'Āirani",
    "capital": "Avarua",
    "continent": "Oceania",
    "subregion": "Polynesia",
    "population": 28320,
    "areaKm2": 236,
    "lat": -21.2075,
    "lng": -159.7755,
    "languages": [
      "English",
      "Cook Islands Māori"
    ],
    "currencies": [
      "Cook Islands dollar (CKD)",
      "New Zealand dollar (NZD)"
    ],
    "flagEmoji": "🇨🇰",
    "facts": [
      "Avarua sits near 21.2°S latitude and serves as the political, cultural, and transport hub of Cook Islands in Polynesia.",
      "With a land area of 236 km² and ~28,320 residents, Cook Islands has a population density of roughly 120 people per km².",
      "In regional geography, Cook Islands is identified by its ISO code \"CK\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Avarua"
  },
  "CO": {
    "id": "CO",
    "iso3": "COL",
    "name": "Colombia",
    "nativeName": "Colombia",
    "capital": "Bogotá",
    "continent": "South America",
    "subregion": "South America",
    "population": 47698524,
    "areaKm2": 1141748,
    "lat": 4.711,
    "lng": -74.0721,
    "languages": [
      "Spanish"
    ],
    "currencies": [
      "Colombian peso (COP)"
    ],
    "flagEmoji": "🇨🇴",
    "facts": [
      "Colombia is the only country in South America with coastlines on both the Pacific Ocean and the Caribbean Sea.",
      "Colombia hosts more bird species (over 1,950) and orchid species than any other country on Earth.",
      "Caño Cristales is known as the River of Five Colors because endemic aquatic plants (Macarenia clavigera) turn its waters bright red, yellow, and green."
    ],
    "nativeCapital": "Bogotá"
  },
  "KM": {
    "id": "KM",
    "iso3": "COM",
    "name": "Comoros",
    "nativeName": "جزر القمر / Komori",
    "capital": "Moroni",
    "continent": "Africa",
    "subregion": "Eastern Africa",
    "population": 223440,
    "areaKm2": 1862,
    "lat": -11.7172,
    "lng": 43.2473,
    "languages": [
      "Arabic",
      "French",
      "Comorian"
    ],
    "currencies": [
      "Comorian franc (KMF)"
    ],
    "flagEmoji": "🇰🇲",
    "facts": [
      "Moroni sits near 11.7°S latitude and serves as the political, cultural, and transport hub of Comoros in Eastern Africa.",
      "With a land area of 1,862 km² and ~223,440 residents, Comoros has a population density of roughly 120 people per km².",
      "In regional geography, Comoros is identified by its ISO code \"KM\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "موروني / Moroni"
  },
  "CV": {
    "id": "CV",
    "iso3": "CPV",
    "name": "Cape Verde",
    "nativeName": "Cabo Verde",
    "capital": "Praia",
    "continent": "Africa",
    "subregion": "Western Africa",
    "population": 483960,
    "areaKm2": 4033,
    "lat": 14.933,
    "lng": -23.5133,
    "languages": [
      "Portuguese"
    ],
    "currencies": [
      "Cape Verdean escudo (CVE)"
    ],
    "flagEmoji": "🇨🇻",
    "facts": [
      "Praia sits near 14.9°N latitude and serves as the political, cultural, and transport hub of Cape Verde in Western Africa.",
      "With a land area of 4,033 km² and ~483,960 residents, Cape Verde has a population density of roughly 120 people per km².",
      "In regional geography, Cape Verde is identified by its ISO code \"CV\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Praia"
  },
  "CR": {
    "id": "CR",
    "iso3": "CRI",
    "name": "Costa Rica",
    "nativeName": "Costa Rica",
    "capital": "San José",
    "continent": "North America",
    "subregion": "Central America",
    "population": 4930258,
    "areaKm2": 51100,
    "lat": 9.9281,
    "lng": -84.0907,
    "languages": [
      "Spanish"
    ],
    "currencies": [
      "Costa Rican colón (CRC)"
    ],
    "flagEmoji": "🇨🇷",
    "facts": [
      "Costa Rica abolished its standing military in 1948 and redirected defense spending into education and environmental conservation.",
      "Despite covering only 0.03% of Earth’s surface, Costa Rica contains roughly 5% of the world’s total biodiversity.",
      "Street addresses in Costa Rica rarely use house numbers; directions are given by distance from local landmarks (e.g., 200 m south of the old fig tree)."
    ],
    "nativeCapital": "San José"
  },
  "CU": {
    "id": "CU",
    "iso3": "CUB",
    "name": "Cuba",
    "nativeName": "Cuba",
    "capital": "Havana",
    "continent": "North America",
    "subregion": "Caribbean",
    "population": 11147407,
    "areaKm2": 109884,
    "lat": 23.1136,
    "lng": -82.3666,
    "languages": [
      "Spanish"
    ],
    "currencies": [
      "Cuban peso (CUP)"
    ],
    "flagEmoji": "🇨🇺",
    "facts": [
      "Cuba is home to the bee hummingbird (zunzuncito), the smallest bird on Earth, weighing less than 2 grams.",
      "Pre-1960 American classic cars (almendrones) still serve as everyday collective taxis in Havana.",
      "Isla de la Juventud is the largest of more than 4,000 islands and cays making up the Cuban archipelago."
    ],
    "nativeCapital": "La Habana"
  },
  "CW": {
    "id": "CW",
    "iso3": "CUW",
    "name": "Curaçao",
    "nativeName": "Kòrsou / Curaçao",
    "capital": "Willemstad",
    "continent": "North America",
    "subregion": "Caribbean",
    "population": 53280,
    "areaKm2": 444,
    "lat": 12.1091,
    "lng": -68.9317,
    "languages": [
      "English",
      "Dutch",
      "Papiamento"
    ],
    "currencies": [
      "Caribbean guilder (XCG)"
    ],
    "flagEmoji": "🇨🇼",
    "facts": [
      "Willemstad sits near 12.1°N latitude and serves as the political, cultural, and transport hub of Curaçao in Caribbean.",
      "With a land area of 444 km² and ~53,280 residents, Curaçao has a population density of roughly 120 people per km².",
      "In regional geography, Curaçao is identified by its ISO code \"CW\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Willemstad"
  },
  "CX": {
    "id": "CX",
    "iso3": "CXR",
    "name": "Christmas Island",
    "nativeName": "Christmas Island",
    "capital": "Flying Fish Cove",
    "continent": "Oceania",
    "subregion": "Australia and New Zealand",
    "population": 16200,
    "areaKm2": 135,
    "lat": -10.4207,
    "lng": 105.679,
    "languages": [
      "English"
    ],
    "currencies": [
      "Australian dollar (AUD)"
    ],
    "flagEmoji": "🇨🇽",
    "facts": [
      "Flying Fish Cove sits near 10.4°S latitude and serves as the political, cultural, and transport hub of Christmas Island in Australia and New Zealand.",
      "With a land area of 135 km² and ~16,200 residents, Christmas Island has a population density of roughly 120 people per km².",
      "In regional geography, Christmas Island is identified by its ISO code \"CX\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Flying Fish Cove"
  },
  "KY": {
    "id": "KY",
    "iso3": "CYM",
    "name": "Cayman Islands",
    "nativeName": "Cayman Islands",
    "capital": "George Town",
    "continent": "North America",
    "subregion": "Caribbean",
    "population": 31680,
    "areaKm2": 264,
    "lat": 19.2869,
    "lng": -81.3674,
    "languages": [
      "English"
    ],
    "currencies": [
      "Cayman Islands dollar (KYD)"
    ],
    "flagEmoji": "🇰🇾",
    "facts": [
      "George Town sits near 19.3°N latitude and serves as the political, cultural, and transport hub of Cayman Islands in Caribbean.",
      "With a land area of 264 km² and ~31,680 residents, Cayman Islands has a population density of roughly 120 people per km².",
      "In regional geography, Cayman Islands is identified by its ISO code \"KY\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "George Town"
  },
  "CY": {
    "id": "CY",
    "iso3": "CYP",
    "name": "Cyprus",
    "nativeName": "Κύπρος / Kıbrıs",
    "capital": "Nicosia",
    "continent": "Europe",
    "subregion": "Southern Europe",
    "population": 1221549,
    "areaKm2": 9251,
    "lat": 35.1856,
    "lng": 33.3823,
    "languages": [
      "Greek",
      "Turkish"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇨🇾",
    "facts": [
      "Cyprus gets its name from the Greek word for copper (kypros), which was mined extensively on the island in antiquity.",
      "Nicosia (Lefkosia) is the last divided capital city in the world, split by the UN Buffer Zone (Green Line).",
      "Archaeological remains in Cyprus show cats were domesticated there at least 9,500 years ago—earlier than in ancient Egypt."
    ],
    "nativeCapital": "Λευκωσία / Lefkoşa"
  },
  "CZ": {
    "id": "CZ",
    "iso3": "CZE",
    "name": "Czechia",
    "nativeName": "Česko",
    "capital": "Prague",
    "continent": "Europe",
    "subregion": "Central Europe",
    "population": 10674723,
    "areaKm2": 78865,
    "lat": 50.0755,
    "lng": 14.4378,
    "languages": [
      "Czech",
      "Slovak"
    ],
    "currencies": [
      "Czech koruna (CZK)"
    ],
    "flagEmoji": "🇨🇿",
    "facts": [
      "Czechia has the highest density of castles and châteaux in Europe (over 2,000), including Prague Castle, the largest ancient castle complex in the world.",
      "Soft contact lenses and the word Robot (coined by Karel Čapek in 1920) were both invented in Czechia.",
      "All Czech and Slovak towns use distinctive blue-bordered directional road signs and red-on-white street number plaques."
    ],
    "nativeCapital": "Praha"
  },
  "DE": {
    "id": "DE",
    "iso3": "DEU",
    "name": "Germany",
    "nativeName": "Deutschland",
    "capital": "Berlin",
    "continent": "Europe",
    "subregion": "Western Europe",
    "population": 80594017,
    "areaKm2": 357114,
    "lat": 52.52,
    "lng": 13.405,
    "languages": [
      "German"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇩🇪",
    "facts": [
      "Germany has over 21,000 castles, 1,500 different beer breweries, and more than 400 zoos.",
      "Ulm Minster in Baden-Württemberg has the tallest church steeple in the world at 161.5 meters.",
      "Büsingen am Hochrhein is a German town completely surrounded by Switzerland, using Swiss francs and having both German and Swiss postal codes."
    ],
    "nativeCapital": "Berlin"
  },
  "DJ": {
    "id": "DJ",
    "iso3": "DJI",
    "name": "Djibouti",
    "nativeName": "جيبوتي / Djibouti",
    "capital": "Djibouti",
    "continent": "Africa",
    "subregion": "Eastern Africa",
    "population": 865267,
    "areaKm2": 23200,
    "lat": 11.5721,
    "lng": 43.1456,
    "languages": [
      "Arabic",
      "French"
    ],
    "currencies": [
      "Djiboutian franc (DJF)"
    ],
    "flagEmoji": "🇩🇯",
    "facts": [
      "Djibouti sits near 11.6°N latitude and serves as the political, cultural, and transport hub of Djibouti in Eastern Africa.",
      "With a land area of 23,200 km² and ~865,267 residents, Djibouti has a population density of roughly 37 people per km².",
      "In regional geography, Djibouti is identified by its ISO code \"DJ\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "مدينة جيبوتي / Djibouti"
  },
  "DM": {
    "id": "DM",
    "iso3": "DMA",
    "name": "Dominica",
    "nativeName": "Dominica",
    "capital": "Roseau",
    "continent": "North America",
    "subregion": "Caribbean",
    "population": 90120,
    "areaKm2": 751,
    "lat": 15.3092,
    "lng": -61.3794,
    "languages": [
      "English"
    ],
    "currencies": [
      "Eastern Caribbean dollar (XCD)"
    ],
    "flagEmoji": "🇩🇲",
    "facts": [
      "Roseau sits near 15.3°N latitude and serves as the political, cultural, and transport hub of Dominica in Caribbean.",
      "With a land area of 751 km² and ~90,120 residents, Dominica has a population density of roughly 120 people per km².",
      "In regional geography, Dominica is identified by its ISO code \"DM\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Roseau"
  },
  "DK": {
    "id": "DK",
    "iso3": "DNK",
    "name": "Denmark",
    "nativeName": "Danmark",
    "capital": "Copenhagen",
    "continent": "Europe",
    "subregion": "Northern Europe",
    "population": 5605948,
    "areaKm2": 43094,
    "lat": 55.6761,
    "lng": 12.5683,
    "languages": [
      "Danish"
    ],
    "currencies": [
      "Danish krone (DKK)"
    ],
    "flagEmoji": "🇩🇰",
    "facts": [
      "The highest natural point in Denmark is Møllehøj at just 170.86 meters above sea level.",
      "No place in Denmark is more than 52 kilometers (32 miles) away from the sea.",
      "Dannebrog, the red-and-white flag of Denmark, has been in continuous use since 1219—the oldest state flag in the world."
    ],
    "nativeCapital": "København"
  },
  "DO": {
    "id": "DO",
    "iso3": "DOM",
    "name": "Dominican Republic",
    "nativeName": "República Dominicana",
    "capital": "Santo Domingo",
    "continent": "North America",
    "subregion": "Caribbean",
    "population": 10734247,
    "areaKm2": 48671,
    "lat": 18.4861,
    "lng": -69.9312,
    "languages": [
      "Spanish"
    ],
    "currencies": [
      "Dominican peso (DOP)"
    ],
    "flagEmoji": "🇩🇴",
    "facts": [
      "The Dominican Republic contains both the highest peak in the Caribbean (Pico Duarte, 3,098 m) and the lowest point (Lago Enriquillo, -46 m).",
      "Santo Domingo, founded in 1496, is the oldest continuously inhabited European settlement in the Americas, with the first cathedral and university.",
      "Larimar, a rare ocean-blue pectolite gemstone, is found nowhere else on Earth except in Barahona province."
    ],
    "nativeCapital": "Santo Domingo"
  },
  "DZ": {
    "id": "DZ",
    "iso3": "DZA",
    "name": "Algeria",
    "nativeName": "الجزائر",
    "capital": "Algiers",
    "continent": "Africa",
    "subregion": "Northern Africa",
    "population": 40969443,
    "areaKm2": 2381741,
    "lat": 36.7538,
    "lng": 3.0588,
    "languages": [
      "Arabic"
    ],
    "currencies": [
      "Algerian dinar (DZD)"
    ],
    "flagEmoji": "🇩🇿",
    "facts": [
      "Algeria is the largest country in Africa by land area (2.38 million km²) after South Sudan split from Sudan in 2011.",
      "Over 80% of Algeria is covered by the Sahara Desert, including the Tassili n’Ajjer plateau famous for 12,000-year-old rock art.",
      "Algiers is nicknamed El-Bahdja (The Joyous) and La Blanche (The White) for its cascading white hillside buildings."
    ],
    "nativeCapital": "الجزائر"
  },
  "EC": {
    "id": "EC",
    "iso3": "ECU",
    "name": "Ecuador",
    "nativeName": "Ecuador",
    "capital": "Quito",
    "continent": "South America",
    "subregion": "South America",
    "population": 16290913,
    "areaKm2": 276841,
    "lat": -0.1807,
    "lng": -78.4678,
    "languages": [
      "Spanish"
    ],
    "currencies": [
      "United States dollar (USD)"
    ],
    "flagEmoji": "🇪🇨",
    "facts": [
      "Because Earth bulges at the equator, the summit of Mount Chimborazo in Ecuador is the farthest point from the center of the Earth.",
      "In 2008, Ecuador became the first country in history to grant constitutional legal rights to Nature (Pachamama).",
      "All Ecuadorian license plates and orange taxi roofs begin with a province letter (e.g., P = Pichincha/Quito, G = Guayas/Guayaquil, A = Azuay/Cuenca)."
    ],
    "nativeCapital": "Quito"
  },
  "EG": {
    "id": "EG",
    "iso3": "EGY",
    "name": "Egypt",
    "nativeName": "مصر",
    "capital": "Cairo",
    "continent": "Africa",
    "subregion": "Northern Africa",
    "population": 97041072,
    "areaKm2": 1002450,
    "lat": 30.0444,
    "lng": 31.2357,
    "languages": [
      "Arabic"
    ],
    "currencies": [
      "Egyptian pound (EGP)"
    ],
    "flagEmoji": "🇪🇬",
    "facts": [
      "Around 95% of Egypt’s 110 million people live on just 5% of its land area along the Nile River valley and delta.",
      "The Great Pyramid of Giza was the tallest man-made structure in the world for over 3,800 years.",
      "Between Egypt and Sudan lies Bir Tawil, a 2,060 km² trapezoid of land claimed by neither country."
    ],
    "nativeCapital": "القاهرة"
  },
  "ER": {
    "id": "ER",
    "iso3": "ERI",
    "name": "Eritrea",
    "nativeName": "ኤርትራ / إرتريا",
    "capital": "Asmara",
    "continent": "Africa",
    "subregion": "Eastern Africa",
    "population": 5918919,
    "areaKm2": 117600,
    "lat": 15.3229,
    "lng": 38.9251,
    "languages": [
      "Arabic",
      "English",
      "Tigrinya"
    ],
    "currencies": [
      "Eritrean nakfa (ERN)"
    ],
    "flagEmoji": "🇪🇷",
    "facts": [
      "Asmara sits near 15.3°N latitude and serves as the political, cultural, and transport hub of Eritrea in Eastern Africa.",
      "With a land area of 117,600 km² and ~5.9 million residents, Eritrea has a population density of roughly 50 people per km².",
      "In regional geography, Eritrea is identified by its ISO code \"ER\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "ኣስመራ / أسمرة"
  },
  "EH": {
    "id": "EH",
    "iso3": "ESH",
    "name": "Western Sahara",
    "nativeName": "الصحراء الغربية",
    "capital": "El Aaiún",
    "continent": "Africa",
    "subregion": "Northern Africa",
    "population": 603253,
    "areaKm2": 266000,
    "lat": 27.1536,
    "lng": -13.2033,
    "languages": [
      "Berber",
      "Hassaniya",
      "Spanish"
    ],
    "currencies": [
      "Algerian dinar (DZD)",
      "Moroccan dirham (MAD)",
      "Mauritanian ouguiya (MRU)"
    ],
    "flagEmoji": "🇪🇭",
    "facts": [
      "El Aaiún sits near 27.2°N latitude and serves as the political, cultural, and transport hub of Western Sahara in Northern Africa.",
      "With a land area of 266,000 km² and ~603,253 residents, Western Sahara has a population density of roughly 2 people per km².",
      "In regional geography, Western Sahara is identified by its ISO code \"EH\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "العيون"
  },
  "ES": {
    "id": "ES",
    "iso3": "ESP",
    "name": "Spain",
    "nativeName": "España",
    "capital": "Madrid",
    "continent": "Europe",
    "subregion": "Southern Europe",
    "population": 48958159,
    "areaKm2": 505992,
    "lat": 40.4168,
    "lng": -3.7038,
    "languages": [
      "Spanish"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇪🇸",
    "facts": [
      "Spain includes two autonomous cities on the North African coast (Ceuta and Melilla) as well as the town of Llívia, a Spanish exclave inside France.",
      "Madrid is the highest capital city in the European Union (excluding microstates) at 657 meters above sea level.",
      "Silbo Gomero, a whistled language used across deep ravines on La Gomera in the Canary Islands, is taught in local schools."
    ],
    "nativeCapital": "Madrid"
  },
  "EE": {
    "id": "EE",
    "iso3": "EST",
    "name": "Estonia",
    "nativeName": "Eesti",
    "capital": "Tallinn",
    "continent": "Europe",
    "subregion": "Northern Europe",
    "population": 1251581,
    "areaKm2": 45227,
    "lat": 59.437,
    "lng": 24.7536,
    "languages": [
      "Estonian"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇪🇪",
    "facts": [
      "Estonia has over 2,200 islands in the Baltic Sea and more meteorite craters per square kilometer than any other country.",
      "Over 50% of Estonia is covered by forest and 20% by peat bogs, which locals traverse using special bog-shoes.",
      "In 2005, Estonia became the first nation on Earth to hold legally binding general elections over the Internet."
    ],
    "nativeCapital": "Tallinn"
  },
  "ET": {
    "id": "ET",
    "iso3": "ETH",
    "name": "Ethiopia",
    "nativeName": "ኢትዮጵያ",
    "capital": "Addis Ababa",
    "continent": "Africa",
    "subregion": "Eastern Africa",
    "population": 105350020,
    "areaKm2": 1104300,
    "lat": 9.032,
    "lng": 38.7469,
    "languages": [
      "Amharic"
    ],
    "currencies": [
      "Ethiopian birr (ETB)"
    ],
    "flagEmoji": "🇪🇹",
    "facts": [
      "Ethiopia follows the Ge’ez calendar, which has 13 months and is currently seven to eight years behind the Gregorian calendar.",
      "Ethiopia uses a 12-hour clock rooted in sunrise: 6:00 AM international time is 12:00 (zero hour) in Ethiopian time.",
      "The Danakil Depression in Afar is one of the hottest, lowest (-125 m), and most geologically active places on Earth."
    ],
    "nativeCapital": "አዲስ አበባ"
  },
  "FI": {
    "id": "FI",
    "iso3": "FIN",
    "name": "Finland",
    "nativeName": "Suomi / Finland",
    "capital": "Helsinki",
    "continent": "Europe",
    "subregion": "Northern Europe",
    "population": 5491218,
    "areaKm2": 338424,
    "lat": 60.1699,
    "lng": 24.9384,
    "languages": [
      "Finnish",
      "Swedish"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇫🇮",
    "facts": [
      "Finland has around 188,000 lakes and an estimated 3.3 million saunas for a population of 5.5 million people.",
      "The Åland Islands between Finland and Sweden are an autonomous, demilitarized, exclusively Swedish-speaking region of Finland.",
      "Due to post-glacial rebound, Finland’s land area grows by roughly 7 square kilometers every year as the seabed rises."
    ],
    "nativeCapital": "Helsinki / Helsingfors"
  },
  "FJ": {
    "id": "FJ",
    "iso3": "FJI",
    "name": "Fiji",
    "nativeName": "Viti / Fiji",
    "capital": "Suva",
    "continent": "Oceania",
    "subregion": "Melanesia",
    "population": 920938,
    "areaKm2": 18272,
    "lat": -18.1416,
    "lng": 178.4419,
    "languages": [
      "English",
      "Fijian",
      "Fiji Hindi"
    ],
    "currencies": [
      "Fijian dollar (FJD)"
    ],
    "flagEmoji": "🇫🇯",
    "facts": [
      "Suva sits near 18.1°S latitude and serves as the political, cultural, and transport hub of Fiji in Melanesia.",
      "With a land area of 18,272 km² and ~920,938 residents, Fiji has a population density of roughly 50 people per km².",
      "In regional geography, Fiji is identified by its ISO code \"FJ\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Suva"
  },
  "FK": {
    "id": "FK",
    "iso3": "FLK",
    "name": "Falkland Islands",
    "nativeName": "Falkland Islands",
    "capital": "Stanley",
    "continent": "South America",
    "subregion": "South America",
    "population": 2931,
    "areaKm2": 12173,
    "lat": -51.6977,
    "lng": -57.8517,
    "languages": [
      "English"
    ],
    "currencies": [
      "Falkland Islands pound (FKP)"
    ],
    "flagEmoji": "🇫🇰",
    "facts": [
      "Stanley sits near 51.7°S latitude and serves as the political, cultural, and transport hub of Falkland Islands in South America.",
      "With a land area of 12,173 km² and ~2,931 residents, Falkland Islands has a population density of roughly 1 people per km².",
      "In regional geography, Falkland Islands is identified by its ISO code \"FK\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Stanley"
  },
  "FR": {
    "id": "FR",
    "iso3": "FRA",
    "name": "France",
    "nativeName": "France",
    "capital": "Paris",
    "continent": "Europe",
    "subregion": "Western Europe",
    "population": 66203400,
    "areaKm2": 551695,
    "lat": 48.8566,
    "lng": 2.3522,
    "languages": [
      "French"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇫🇷",
    "facts": [
      "France spans 12 different time zones—more than any other country in the world—thanks to its overseas departments and territories.",
      "France’s longest international land border is not in Europe: it is the 730 km border between French Guiana and Brazil.",
      "French telephone area codes are split into 5 geographic zones: 01 Paris/Île-de-France, 02 NW, 03 NE, 04 SE, and 05 SW."
    ],
    "nativeCapital": "Paris"
  },
  "FO": {
    "id": "FO",
    "iso3": "FRO",
    "name": "Faroe Islands",
    "nativeName": "Føroyar",
    "capital": "Tórshavn",
    "continent": "Europe",
    "subregion": "Northern Europe",
    "population": 167160,
    "areaKm2": 1393,
    "lat": 62.0079,
    "lng": -6.791,
    "languages": [
      "Danish",
      "Faroese"
    ],
    "currencies": [
      "Danish krone (DKK)",
      "Faroese króna (FOK)"
    ],
    "flagEmoji": "🇫🇴",
    "facts": [
      "Tórshavn sits near 62.0°N latitude and serves as the political, cultural, and transport hub of Faroe Islands in Northern Europe.",
      "With a land area of 1,393 km² and ~167,160 residents, Faroe Islands has a population density of roughly 120 people per km².",
      "In regional geography, Faroe Islands is identified by its ISO code \"FO\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Tórshavn"
  },
  "FM": {
    "id": "FM",
    "iso3": "FSM",
    "name": "Micronesia",
    "nativeName": "Micronesia",
    "capital": "Palikir",
    "continent": "Oceania",
    "subregion": "Micronesia",
    "population": 84240,
    "areaKm2": 702,
    "lat": 6.9147,
    "lng": 158.161,
    "languages": [
      "English"
    ],
    "currencies": [
      "National Currency"
    ],
    "flagEmoji": "🇫🇲",
    "facts": [
      "Palikir sits near 6.9°N latitude and serves as the political, cultural, and transport hub of Micronesia in Micronesia.",
      "With a land area of 702 km² and ~84,240 residents, Micronesia has a population density of roughly 120 people per km².",
      "In regional geography, Micronesia is identified by its ISO code \"FM\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Palikir"
  },
  "GA": {
    "id": "GA",
    "iso3": "GAB",
    "name": "Gabon",
    "nativeName": "Gabon",
    "capital": "Libreville",
    "continent": "Africa",
    "subregion": "Middle Africa",
    "population": 1772255,
    "areaKm2": 267668,
    "lat": 0.4162,
    "lng": 9.4673,
    "languages": [
      "French"
    ],
    "currencies": [
      "Central African CFA franc (XAF)"
    ],
    "flagEmoji": "🇬🇦",
    "facts": [
      "Libreville sits near 0.4°N latitude and serves as the political, cultural, and transport hub of Gabon in Middle Africa.",
      "With a land area of 267,668 km² and ~1.8 million residents, Gabon has a population density of roughly 7 people per km².",
      "In regional geography, Gabon is identified by its ISO code \"GA\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Libreville"
  },
  "GB": {
    "id": "GB",
    "iso3": "GBR",
    "name": "United Kingdom",
    "nativeName": "United Kingdom",
    "capital": "London",
    "continent": "Europe",
    "subregion": "Northern Europe",
    "population": 64769452,
    "areaKm2": 242900,
    "lat": 51.5074,
    "lng": -0.1278,
    "languages": [
      "English"
    ],
    "currencies": [
      "British pound (GBP)"
    ],
    "flagEmoji": "🇬🇧",
    "facts": [
      "No point in Great Britain is more than 113 kilometers (70 miles) away from tidal coastal waters.",
      "The shortest scheduled commercial flight in the world operates in Orkney, Scotland, between Westray and Papa Westray—lasting as little as 53 seconds.",
      "Berwick-upon-Tweed on the England–Scotland border changed hands between the two kingdoms more than 13 times in the Middle Ages."
    ],
    "nativeCapital": "London"
  },
  "GE": {
    "id": "GE",
    "iso3": "GEO",
    "name": "Georgia",
    "nativeName": "საქართველო",
    "capital": "Tbilisi",
    "continent": "Asia",
    "subregion": "Western Asia",
    "population": 4926330,
    "areaKm2": 69700,
    "lat": 41.7151,
    "lng": 44.8271,
    "languages": [
      "Georgian"
    ],
    "currencies": [
      "lari (GEL)"
    ],
    "flagEmoji": "🇬🇪",
    "facts": [
      "Krubera (Voronya) and Veryovkina caves in the western Caucasus of Georgia are the deepest known caves on Earth (over 2,200 m deep).",
      "Archaeological evidence shows Georgia has produced wine in clay vessels (qvevri) buried underground for over 8,000 years.",
      "Ushguli in Upper Svaneti (at 2,100 m) is famous for its medieval stone defensive watchtowers and is one of Europe’s highest permanently inhabited villages."
    ],
    "nativeCapital": "თბილისი"
  },
  "GG": {
    "id": "GG",
    "iso3": "GGY",
    "name": "Guernsey",
    "nativeName": "Guernsey",
    "capital": "St. Peter Port",
    "continent": "Europe",
    "subregion": "Northern Europe",
    "population": 9360,
    "areaKm2": 78,
    "lat": 49.4554,
    "lng": -2.5369,
    "languages": [
      "English",
      "French",
      "Guernésiais"
    ],
    "currencies": [
      "British pound (GBP)",
      "Guernsey pound (GGP)"
    ],
    "flagEmoji": "🇬🇬",
    "facts": [
      "St. Peter Port sits near 49.5°N latitude and serves as the political, cultural, and transport hub of Guernsey in Northern Europe.",
      "With a land area of 78 km² and ~9,360 residents, Guernsey has a population density of roughly 120 people per km².",
      "In regional geography, Guernsey is identified by its ISO code \"GG\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Saint Peter Port"
  },
  "GH": {
    "id": "GH",
    "iso3": "GHA",
    "name": "Ghana",
    "nativeName": "Ghana",
    "capital": "Accra",
    "continent": "Africa",
    "subregion": "Western Africa",
    "population": 27499924,
    "areaKm2": 238533,
    "lat": 5.6037,
    "lng": -0.187,
    "languages": [
      "English"
    ],
    "currencies": [
      "Ghanaian cedi (GHS)"
    ],
    "flagEmoji": "🇬🇭",
    "facts": [
      "Lake Volta in Ghana is the largest artificial reservoir in the world by surface area (8,502 km²).",
      "In 1957, Ghana became the first sub-Saharan African nation to achieve independence from European colonial rule.",
      "Waiters and craftsmen in Accra are world-famous for carving elaborate fantasy coffins shaped like fish, airplanes, or cocoa pods."
    ],
    "nativeCapital": "Accra"
  },
  "GI": {
    "id": "GI",
    "iso3": "GIB",
    "name": "Gibraltar",
    "nativeName": "Gibraltar",
    "capital": "Gibraltar",
    "continent": "Europe",
    "subregion": "Southern Europe",
    "population": 720,
    "areaKm2": 6,
    "lat": 36.1408,
    "lng": -5.3536,
    "languages": [
      "English"
    ],
    "currencies": [
      "Gibraltar pound (GIP)"
    ],
    "flagEmoji": "🇬🇮",
    "facts": [
      "Gibraltar sits near 36.1°N latitude and serves as the political, cultural, and transport hub of Gibraltar in Southern Europe.",
      "With a land area of 6 km² and ~720 residents, Gibraltar has a population density of roughly 120 people per km².",
      "In regional geography, Gibraltar is identified by its ISO code \"GI\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Gibraltar"
  },
  "GN": {
    "id": "GN",
    "iso3": "GIN",
    "name": "Guinea",
    "nativeName": "Guinée",
    "capital": "Conakry",
    "continent": "Africa",
    "subregion": "Western Africa",
    "population": 12413867,
    "areaKm2": 245857,
    "lat": 9.6412,
    "lng": -13.5784,
    "languages": [
      "French"
    ],
    "currencies": [
      "Guinean franc (GNF)"
    ],
    "flagEmoji": "🇬🇳",
    "facts": [
      "Conakry sits near 9.6°N latitude and serves as the political, cultural, and transport hub of Guinea in Western Africa.",
      "With a land area of 245,857 km² and ~12.4 million residents, Guinea has a population density of roughly 50 people per km².",
      "In regional geography, Guinea is identified by its ISO code \"GN\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Conakry"
  },
  "GP": {
    "id": "GP",
    "iso3": "GLP",
    "name": "Guadeloupe",
    "nativeName": "Guadeloupe",
    "capital": "Basse-Terre",
    "continent": "North America",
    "subregion": "Caribbean",
    "population": 195360,
    "areaKm2": 1628,
    "lat": 16,
    "lng": -61.7333,
    "languages": [
      "French"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇬🇵",
    "facts": [
      "Basse-Terre sits near 16.0°N latitude and serves as the political, cultural, and transport hub of Guadeloupe in Caribbean.",
      "With a land area of 1,628 km² and ~195,360 residents, Guadeloupe has a population density of roughly 120 people per km².",
      "In regional geography, Guadeloupe is identified by its ISO code \"GP\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Basse-Terre"
  },
  "GM": {
    "id": "GM",
    "iso3": "GMB",
    "name": "Gambia",
    "nativeName": "The Gambia",
    "capital": "Banjul",
    "continent": "Africa",
    "subregion": "Western Africa",
    "population": 2051363,
    "areaKm2": 10689,
    "lat": 13.4549,
    "lng": -16.579,
    "languages": [
      "English"
    ],
    "currencies": [
      "dalasi (GMD)"
    ],
    "flagEmoji": "🇬🇲",
    "facts": [
      "Banjul sits near 13.5°N latitude and serves as the political, cultural, and transport hub of Gambia in Western Africa.",
      "With a land area of 10,689 km² and ~2.1 million residents, Gambia has a population density of roughly 192 people per km².",
      "In regional geography, Gambia is identified by its ISO code \"GM\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Banjul"
  },
  "GW": {
    "id": "GW",
    "iso3": "GNB",
    "name": "Guinea-Bissau",
    "nativeName": "Guiné-Bissau",
    "capital": "Bissau",
    "continent": "Africa",
    "subregion": "Western Africa",
    "population": 1792338,
    "areaKm2": 36125,
    "lat": 11.8636,
    "lng": -15.5977,
    "languages": [
      "Portuguese",
      "Upper Guinea Creole"
    ],
    "currencies": [
      "West African CFA franc (XOF)"
    ],
    "flagEmoji": "🇬🇼",
    "facts": [
      "Bissau sits near 11.9°N latitude and serves as the political, cultural, and transport hub of Guinea-Bissau in Western Africa.",
      "With a land area of 36,125 km² and ~1.8 million residents, Guinea-Bissau has a population density of roughly 50 people per km².",
      "In regional geography, Guinea-Bissau is identified by its ISO code \"GW\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Bissau"
  },
  "GQ": {
    "id": "GQ",
    "iso3": "GNQ",
    "name": "Equatorial Guinea",
    "nativeName": "Guinea Ecuatorial",
    "capital": "Ciudad de la Paz",
    "continent": "Africa",
    "subregion": "Middle Africa",
    "population": 778358,
    "areaKm2": 28051,
    "lat": 3.7504,
    "lng": 8.7371,
    "languages": [
      "French",
      "Portuguese",
      "Spanish"
    ],
    "currencies": [
      "Central African CFA franc (XAF)"
    ],
    "flagEmoji": "🇬🇶",
    "facts": [
      "Ciudad de la Paz sits near 3.8°N latitude and serves as the political, cultural, and transport hub of Equatorial Guinea in Middle Africa.",
      "With a land area of 28,051 km² and ~778,358 residents, Equatorial Guinea has a population density of roughly 28 people per km².",
      "In regional geography, Equatorial Guinea is identified by its ISO code \"GQ\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Ciudad de la Paz"
  },
  "GR": {
    "id": "GR",
    "iso3": "GRC",
    "name": "Greece",
    "nativeName": "Ελλάδα",
    "capital": "Athens",
    "continent": "Europe",
    "subregion": "Southern Europe",
    "population": 10768477,
    "areaKm2": 131990,
    "lat": 37.9838,
    "lng": 23.7275,
    "languages": [
      "Greek"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇬🇷",
    "facts": [
      "Greece has up to 6,000 islands and islets scattered across the Aegean and Ionian seas, of which 227 are inhabited.",
      "No point in Greece is more than 137 kilometers (85 miles) from the Mediterranean coast.",
      "Mount Athos is an autonomous monastic peninsula where women and female domestic animals have been barred from entry for over 1,000 years."
    ],
    "nativeCapital": "Αθήνα"
  },
  "GD": {
    "id": "GD",
    "iso3": "GRD",
    "name": "Grenada",
    "nativeName": "Grenada",
    "capital": "St. George's",
    "continent": "North America",
    "subregion": "Caribbean",
    "population": 41280,
    "areaKm2": 344,
    "lat": 12.0561,
    "lng": -61.7488,
    "languages": [
      "English"
    ],
    "currencies": [
      "Eastern Caribbean dollar (XCD)"
    ],
    "flagEmoji": "🇬🇩",
    "facts": [
      "St. George's sits near 12.1°N latitude and serves as the political, cultural, and transport hub of Grenada in Caribbean.",
      "With a land area of 344 km² and ~41,280 residents, Grenada has a population density of roughly 120 people per km².",
      "In regional geography, Grenada is identified by its ISO code \"GD\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Saint George's"
  },
  "GL": {
    "id": "GL",
    "iso3": "GRL",
    "name": "Greenland",
    "nativeName": "Kalaallit Nunaat",
    "capital": "Nuuk",
    "continent": "North America",
    "subregion": "North America",
    "population": 57713,
    "areaKm2": 2166086,
    "lat": 64.1814,
    "lng": -51.6941,
    "languages": [
      "Greenlandic"
    ],
    "currencies": [
      "krone (DKK)"
    ],
    "flagEmoji": "🇬🇱",
    "facts": [
      "Nuuk sits near 64.2°N latitude and serves as the political, cultural, and transport hub of Greenland in North America.",
      "With a land area of 2,166,086 km² and ~57,713 residents, Greenland has a population density of roughly 1 people per km².",
      "In regional geography, Greenland is identified by its ISO code \"GL\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Nuuk"
  },
  "GT": {
    "id": "GT",
    "iso3": "GTM",
    "name": "Guatemala",
    "nativeName": "Guatemala",
    "capital": "Guatemala City",
    "continent": "North America",
    "subregion": "Central America",
    "population": 15460732,
    "areaKm2": 108889,
    "lat": 14.6349,
    "lng": -90.5069,
    "languages": [
      "Spanish"
    ],
    "currencies": [
      "Guatemalan quetzal (GTQ)"
    ],
    "flagEmoji": "🇬🇹",
    "facts": [
      "Guatemala has 37 volcanoes along its Sierra Madre chain, three of which (Fuego, Pacaya, Santiaguito) are almost continuously active.",
      "Lake Atitlán sits inside a massive volcanic caldera at 1,562 m altitude surrounded by three towering stratvolcanoes.",
      "Tikal in the Petén rainforest was one of the largest Mayan cities, with step-pyramids rising 70 meters above the jungle canopy."
    ],
    "nativeCapital": "Guatemala City"
  },
  "GF": {
    "id": "GF",
    "iso3": "GUF",
    "name": "French Guiana",
    "nativeName": "Guyane française",
    "capital": "Cayenne",
    "continent": "South America",
    "subregion": "South America",
    "population": 10024080,
    "areaKm2": 83534,
    "lat": 4.9224,
    "lng": -52.3135,
    "languages": [
      "French"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇬🇫",
    "facts": [
      "Cayenne sits near 4.9°N latitude and serves as the political, cultural, and transport hub of French Guiana in South America.",
      "With a land area of 83,534 km² and ~10.0 million residents, French Guiana has a population density of roughly 120 people per km².",
      "In regional geography, French Guiana is identified by its ISO code \"GF\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Cayenne"
  },
  "GU": {
    "id": "GU",
    "iso3": "GUM",
    "name": "Guam",
    "nativeName": "Guåhan / Guam",
    "capital": "Hagåtña",
    "continent": "Oceania",
    "subregion": "Micronesia",
    "population": 65880,
    "areaKm2": 549,
    "lat": 13.4763,
    "lng": 144.7502,
    "languages": [
      "Chamorro",
      "English",
      "Spanish"
    ],
    "currencies": [
      "United States dollar (USD)"
    ],
    "flagEmoji": "🇬🇺",
    "facts": [
      "Hagåtña sits near 13.5°N latitude and serves as the political, cultural, and transport hub of Guam in Micronesia.",
      "With a land area of 549 km² and ~65,880 residents, Guam has a population density of roughly 120 people per km².",
      "In regional geography, Guam is identified by its ISO code \"GU\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Hagåtña"
  },
  "GY": {
    "id": "GY",
    "iso3": "GUY",
    "name": "Guyana",
    "nativeName": "Guyana",
    "capital": "Georgetown",
    "continent": "South America",
    "subregion": "South America",
    "population": 737718,
    "areaKm2": 214969,
    "lat": 6.8013,
    "lng": -58.1551,
    "languages": [
      "English"
    ],
    "currencies": [
      "Guyanese dollar (GYD)"
    ],
    "flagEmoji": "🇬🇾",
    "facts": [
      "Georgetown sits near 6.8°N latitude and serves as the political, cultural, and transport hub of Guyana in South America.",
      "With a land area of 214,969 km² and ~737,718 residents, Guyana has a population density of roughly 3 people per km².",
      "In regional geography, Guyana is identified by its ISO code \"GY\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Georgetown"
  },
  "HK": {
    "id": "HK",
    "iso3": "HKG",
    "name": "Hong Kong",
    "nativeName": "香港",
    "capital": "City of Victoria",
    "continent": "Asia",
    "subregion": "Eastern Asia",
    "population": 132480,
    "areaKm2": 1104,
    "lat": 22.3193,
    "lng": 114.1694,
    "languages": [
      "English",
      "Chinese"
    ],
    "currencies": [
      "Hong Kong dollar (HKD)"
    ],
    "flagEmoji": "🇭🇰",
    "facts": [
      "City of Victoria sits near 22.3°N latitude and serves as the political, cultural, and transport hub of Hong Kong in Eastern Asia.",
      "With a land area of 1,104 km² and ~132,480 residents, Hong Kong has a population density of roughly 120 people per km².",
      "In regional geography, Hong Kong is identified by its ISO code \"HK\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "香港"
  },
  "HM": {
    "id": "HM",
    "iso3": "HMD",
    "name": "Heard Island and McDonald Islands",
    "nativeName": "Heard Island and McDonald Islands",
    "capital": "N/A",
    "continent": "Europe",
    "subregion": "",
    "population": 49440,
    "areaKm2": 412,
    "lat": -53.0997,
    "lng": 73.5119,
    "languages": [
      "English"
    ],
    "currencies": [
      "National Currency"
    ],
    "flagEmoji": "🇭🇲",
    "facts": [
      "N/A sits near 53.1°S latitude and serves as the political, cultural, and transport hub of Heard Island and McDonald Islands in its region.",
      "With a land area of 412 km² and ~49,440 residents, Heard Island and McDonald Islands has a population density of roughly 120 people per km².",
      "In regional geography, Heard Island and McDonald Islands is identified by its ISO code \"HM\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "N/A"
  },
  "HN": {
    "id": "HN",
    "iso3": "HND",
    "name": "Honduras",
    "nativeName": "Honduras",
    "capital": "Tegucigalpa",
    "continent": "North America",
    "subregion": "Central America",
    "population": 9038741,
    "areaKm2": 112492,
    "lat": 14.0723,
    "lng": -87.1921,
    "languages": [
      "Spanish"
    ],
    "currencies": [
      "Honduran lempira (HNL)"
    ],
    "flagEmoji": "🇭🇳",
    "facts": [
      "Tegucigalpa sits near 14.1°N latitude and serves as the political, cultural, and transport hub of Honduras in Central America.",
      "With a land area of 112,492 km² and ~9.0 million residents, Honduras has a population density of roughly 80 people per km².",
      "In regional geography, Honduras is identified by its ISO code \"HN\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Tegucigalpa"
  },
  "HR": {
    "id": "HR",
    "iso3": "HRV",
    "name": "Croatia",
    "nativeName": "Hrvatska",
    "capital": "Zagreb",
    "continent": "Europe",
    "subregion": "Southeast Europe",
    "population": 4292095,
    "areaKm2": 56594,
    "lat": 45.815,
    "lng": 15.9819,
    "languages": [
      "Croatian"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇭🇷",
    "facts": [
      "Croatia’s Dalmatian coast features 1,244 islands, islets, and reefs, though only 48 are permanently inhabited.",
      "The modern necktie (cravat) originated from the scarves worn by 17th-century Croatian mercenaries serving in France.",
      "Hum in Istria, with a population of around 30 people, is widely cited as the smallest town in the world."
    ],
    "nativeCapital": "Zagreb"
  },
  "HT": {
    "id": "HT",
    "iso3": "HTI",
    "name": "Haiti",
    "nativeName": "Haïti / Ayiti",
    "capital": "Port-au-Prince",
    "continent": "North America",
    "subregion": "Caribbean",
    "population": 10646714,
    "areaKm2": 27750,
    "lat": 18.5944,
    "lng": -72.3074,
    "languages": [
      "French",
      "Haitian Creole"
    ],
    "currencies": [
      "Haitian gourde (HTG)"
    ],
    "flagEmoji": "🇭🇹",
    "facts": [
      "Port-au-Prince sits near 18.6°N latitude and serves as the political, cultural, and transport hub of Haiti in Caribbean.",
      "With a land area of 27,750 km² and ~10.6 million residents, Haiti has a population density of roughly 384 people per km².",
      "In regional geography, Haiti is identified by its ISO code \"HT\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Port-au-Prince / Pòtoprens"
  },
  "HU": {
    "id": "HU",
    "iso3": "HUN",
    "name": "Hungary",
    "nativeName": "Magyarország",
    "capital": "Budapest",
    "continent": "Europe",
    "subregion": "Central Europe",
    "population": 9850845,
    "areaKm2": 93028,
    "lat": 47.4979,
    "lng": 19.0402,
    "languages": [
      "Hungarian"
    ],
    "currencies": [
      "Hungarian forint (HUF)"
    ],
    "flagEmoji": "🇭🇺",
    "facts": [
      "Budapest has more thermal water springs than any other capital city in the world, supplying over 120 hot bathhouses.",
      "Lake Balaton is the largest lake in Central Europe (592 km²), often affectionately called the Hungarian Sea.",
      "The Rubik’s Cube, ballpoint pen (Bíró), and holographic imaging were all invented by Hungarians."
    ],
    "nativeCapital": "Budapest"
  },
  "ID": {
    "id": "ID",
    "iso3": "IDN",
    "name": "Indonesia",
    "nativeName": "Indonesia",
    "capital": "Jakarta",
    "continent": "Asia",
    "subregion": "South-Eastern Asia",
    "population": 260580739,
    "areaKm2": 1904569,
    "lat": -6.2088,
    "lng": 106.8456,
    "languages": [
      "Indonesian"
    ],
    "currencies": [
      "Indonesian rupiah (IDR)"
    ],
    "flagEmoji": "🇮🇩",
    "facts": [
      "Indonesia is the world’s largest archipelagic state with over 17,500 islands spanning three time zones (WIB, WITA, WIT).",
      "Mount Tambora’s 1815 eruption on Sumbawa was the most powerful volcanic eruption in recorded history, causing the 1816 Year Without a Summer.",
      "Komodo dragons—the world’s largest living lizards—are endemic to just five islands in East Nusa Tenggara."
    ],
    "nativeCapital": "Jakarta"
  },
  "IM": {
    "id": "IM",
    "iso3": "IMN",
    "name": "Isle of Man",
    "nativeName": "Ellan Vannin / Isle of Man",
    "capital": "Douglas",
    "continent": "Europe",
    "subregion": "Northern Europe",
    "population": 68640,
    "areaKm2": 572,
    "lat": 54.1523,
    "lng": -4.4861,
    "languages": [
      "English",
      "Manx"
    ],
    "currencies": [
      "British pound (GBP)",
      "Manx pound (IMP)"
    ],
    "flagEmoji": "🇮🇲",
    "facts": [
      "Douglas sits near 54.2°N latitude and serves as the political, cultural, and transport hub of Isle of Man in Northern Europe.",
      "With a land area of 572 km² and ~68,640 residents, Isle of Man has a population density of roughly 120 people per km².",
      "In regional geography, Isle of Man is identified by its ISO code \"IM\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Douglas"
  },
  "IN": {
    "id": "IN",
    "iso3": "IND",
    "name": "India",
    "nativeName": "भारत",
    "capital": "New Delhi",
    "continent": "Asia",
    "subregion": "Southern Asia",
    "population": 1281935911,
    "areaKm2": 3287590,
    "lat": 28.6139,
    "lng": 77.209,
    "languages": [
      "English",
      "Hindi",
      "Tamil"
    ],
    "currencies": [
      "Indian rupee (INR)"
    ],
    "flagEmoji": "🇮🇳",
    "facts": [
      "Mawsynram and Cherrapunji in Meghalaya receive over 11,800 mm of rainfall per year, making them the wettest inhabited places on Earth.",
      "India has a floating post office on Dal Lake in Srinagar and the world’s highest post office at Hikkim (4,440 m) in Himachal Pradesh.",
      "Keibul Lamjao in Manipur is the only floating national park in the world, drifting on biomass mats called phumdis."
    ],
    "nativeCapital": "नई दिल्ली"
  },
  "IO": {
    "id": "IO",
    "iso3": "IOT",
    "name": "British Indian Ocean Territory",
    "nativeName": "British Indian Ocean Territory",
    "capital": "Diego Garcia",
    "continent": "Africa",
    "subregion": "Eastern Africa",
    "population": 7200,
    "areaKm2": 60,
    "lat": -7.3133,
    "lng": 72.4111,
    "languages": [
      "English"
    ],
    "currencies": [
      "United States dollar (USD)"
    ],
    "flagEmoji": "🇮🇴",
    "facts": [
      "Diego Garcia sits near 7.3°S latitude and serves as the political, cultural, and transport hub of British Indian Ocean Territory in Eastern Africa.",
      "With a land area of 60 km² and ~7,200 residents, British Indian Ocean Territory has a population density of roughly 120 people per km².",
      "In regional geography, British Indian Ocean Territory is identified by its ISO code \"IO\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Diego Garcia"
  },
  "IE": {
    "id": "IE",
    "iso3": "IRL",
    "name": "Ireland",
    "nativeName": "Éire / Ireland",
    "capital": "Dublin",
    "continent": "Europe",
    "subregion": "Northern Europe",
    "population": 5011102,
    "areaKm2": 70273,
    "lat": 53.3498,
    "lng": -6.2603,
    "languages": [
      "English",
      "Irish"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇮🇪",
    "facts": [
      "Because of the warm North Atlantic Drift, Ireland stays mild year-round and has never had native snakes since the last Ice Age.",
      "Newgrange in County Meath is a 5,200-year-old passage tomb older than both Stonehenge and the Great Pyramids of Giza.",
      "Irish road signs are bilingual: destination distances are in kilometers (white/green signs), while Northern Ireland uses miles."
    ],
    "nativeCapital": "Baile Átha Cliath / Dublin"
  },
  "IR": {
    "id": "IR",
    "iso3": "IRN",
    "name": "Iran",
    "nativeName": "ایران",
    "capital": "Tehran",
    "continent": "Asia",
    "subregion": "Southern Asia",
    "population": 82021564,
    "areaKm2": 1648195,
    "lat": 35.6892,
    "lng": 51.389,
    "languages": [
      "Persian (Farsi)"
    ],
    "currencies": [
      "Iranian rial (IRR)"
    ],
    "flagEmoji": "🇮🇷",
    "facts": [
      "Tehran sits near 35.7°N latitude and serves as the political, cultural, and transport hub of Iran in Southern Asia.",
      "With a land area of 1,648,195 km² and ~82.0 million residents, Iran has a population density of roughly 50 people per km².",
      "In regional geography, Iran is identified by its ISO code \"IR\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "تهران"
  },
  "IQ": {
    "id": "IQ",
    "iso3": "IRQ",
    "name": "Iraq",
    "nativeName": "العراق",
    "capital": "Baghdad",
    "continent": "Asia",
    "subregion": "Western Asia",
    "population": 39192111,
    "areaKm2": 438317,
    "lat": 33.3152,
    "lng": 44.3661,
    "languages": [
      "Arabic",
      "Aramaic",
      "Sorani"
    ],
    "currencies": [
      "Iraqi dinar (IQD)"
    ],
    "flagEmoji": "🇮🇶",
    "facts": [
      "Baghdad sits near 33.3°N latitude and serves as the political, cultural, and transport hub of Iraq in Western Asia.",
      "With a land area of 438,317 km² and ~39.2 million residents, Iraq has a population density of roughly 89 people per km².",
      "In regional geography, Iraq is identified by its ISO code \"IQ\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "بغداد"
  },
  "IS": {
    "id": "IS",
    "iso3": "ISL",
    "name": "Iceland",
    "nativeName": "Ísland",
    "capital": "Reykjavik",
    "continent": "Europe",
    "subregion": "Northern Europe",
    "population": 339747,
    "areaKm2": 103000,
    "lat": 64.1466,
    "lng": -21.9426,
    "languages": [
      "Icelandic"
    ],
    "currencies": [
      "Icelandic króna (ISK)"
    ],
    "flagEmoji": "🇮🇸",
    "facts": [
      "Iceland is the only country in the world completely free of mosquitoes, and has no native reptiles or amphibians.",
      "In Thingvellir National Park, you can walk and dive directly between the North American and Eurasian tectonic plates.",
      "Most Icelanders do not use family surnames; instead they use patronymic or matronymic names ending in -son or -dóttir."
    ],
    "nativeCapital": "Reykjavík"
  },
  "IL": {
    "id": "IL",
    "iso3": "ISR",
    "name": "Israel",
    "nativeName": "ישראל",
    "capital": "Jerusalem",
    "continent": "Asia",
    "subregion": "Western Asia",
    "population": 8299706,
    "areaKm2": 20770,
    "lat": 31.7683,
    "lng": 35.2137,
    "languages": [
      "Arabic",
      "Hebrew"
    ],
    "currencies": [
      "Israeli new shekel (ILS)"
    ],
    "flagEmoji": "🇮🇱",
    "facts": [
      "The Dead Sea shoreline is the lowest land elevation on Earth at approximately 430 meters below sea level.",
      "Makhtesh Ramon in the Negev Desert is the world’s largest erosion cirque (40 km long), a landform unique to the Negev and Sinai.",
      "Israel has two official scripts on all highway signs: Hebrew, Arabic, and Latin transliteration."
    ],
    "nativeCapital": "ירושלים"
  },
  "IT": {
    "id": "IT",
    "iso3": "ITA",
    "name": "Italy",
    "nativeName": "Italia",
    "capital": "Rome",
    "continent": "Europe",
    "subregion": "Southern Europe",
    "population": 62137802,
    "areaKm2": 301336,
    "lat": 41.9028,
    "lng": 12.4964,
    "languages": [
      "Italian"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇮🇹",
    "facts": [
      "Italy is the only country in the world that completely surrounds two independent microstates: San Marino and Vatican City.",
      "Italy holds more UNESCO World Heritage Sites (59+) than any other country on Earth.",
      "Every Italian province has a 2-letter code printed on yellow/blue road markers and vehicle license plates (e.g., MI = Milan, RM = Rome, NA = Naples)."
    ],
    "nativeCapital": "Roma"
  },
  "JM": {
    "id": "JM",
    "iso3": "JAM",
    "name": "Jamaica",
    "nativeName": "Jamaica",
    "capital": "Kingston",
    "continent": "North America",
    "subregion": "Caribbean",
    "population": 2990561,
    "areaKm2": 10991,
    "lat": 17.9714,
    "lng": -76.7936,
    "languages": [
      "English",
      "Jamaican Patois"
    ],
    "currencies": [
      "Jamaican dollar (JMD)"
    ],
    "flagEmoji": "🇯🇲",
    "facts": [
      "Kingston sits near 18.0°N latitude and serves as the political, cultural, and transport hub of Jamaica in Caribbean.",
      "With a land area of 10,991 km² and ~3.0 million residents, Jamaica has a population density of roughly 272 people per km².",
      "In regional geography, Jamaica is identified by its ISO code \"JM\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Kingston"
  },
  "JE": {
    "id": "JE",
    "iso3": "JEY",
    "name": "Jersey",
    "nativeName": "Jèrri / Jersey",
    "capital": "Saint Helier",
    "continent": "Europe",
    "subregion": "Northern Europe",
    "population": 13920,
    "areaKm2": 116,
    "lat": 49.1868,
    "lng": -2.1066,
    "languages": [
      "English",
      "French",
      "Jèrriais"
    ],
    "currencies": [
      "British pound (GBP)",
      "Jersey pound (JEP)"
    ],
    "flagEmoji": "🇯🇪",
    "facts": [
      "Saint Helier sits near 49.2°N latitude and serves as the political, cultural, and transport hub of Jersey in Northern Europe.",
      "With a land area of 116 km² and ~13,920 residents, Jersey has a population density of roughly 120 people per km².",
      "In regional geography, Jersey is identified by its ISO code \"JE\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Saint Helier"
  },
  "JO": {
    "id": "JO",
    "iso3": "JOR",
    "name": "Jordan",
    "nativeName": "الأردن",
    "capital": "Amman",
    "continent": "Asia",
    "subregion": "Western Asia",
    "population": 10248069,
    "areaKm2": 89342,
    "lat": 31.9454,
    "lng": 35.9284,
    "languages": [
      "Arabic"
    ],
    "currencies": [
      "Jordanian dinar (JOD)"
    ],
    "flagEmoji": "🇯🇴",
    "facts": [
      "Petra, the Rose City carved directly into pink sandstone cliffs by the Nabataeans around 300 BC, is one of the New Seven Wonders of the World.",
      "Wadi Rum’s red sandstone valleys and desert floor closely resemble Mars and have served as the filming location for dozens of sci-fi films.",
      "Jordan’s only sea port is Aqaba on a 26 km stretch of the Red Sea’s Gulf of Aqaba."
    ],
    "nativeCapital": "عمّان"
  },
  "JP": {
    "id": "JP",
    "iso3": "JPN",
    "name": "Japan",
    "nativeName": "日本",
    "capital": "Tokyo",
    "continent": "Asia",
    "subregion": "Eastern Asia",
    "population": 126451398,
    "areaKm2": 377930,
    "lat": 35.6762,
    "lng": 139.6503,
    "languages": [
      "Japanese"
    ],
    "currencies": [
      "Japanese yen (JPY)"
    ],
    "flagEmoji": "🇯🇵",
    "facts": [
      "Japan’s electrical grid is split in two: Eastern Japan (Tokyo, Hokkaido) runs on 50 Hz, while Western Japan (Osaka, Kyoto, Kyushu) runs on 60 Hz.",
      "Japan has over 14,125 islands (after a 2023 digital recount) and more than 110 active volcanoes.",
      "Kongō Gumi in Osaka operated as an independent temple construction company for 1,428 years (from 578 AD to 2006)."
    ],
    "nativeCapital": "東京"
  },
  "KZ": {
    "id": "KZ",
    "iso3": "KAZ",
    "name": "Kazakhstan",
    "nativeName": "Қазақстан",
    "capital": "Astana",
    "continent": "Asia",
    "subregion": "Central Asia",
    "population": 18556698,
    "areaKm2": 2724900,
    "lat": 51.1694,
    "lng": 71.4491,
    "languages": [
      "Kazakh",
      "Russian"
    ],
    "currencies": [
      "Kazakhstani tenge (KZT)"
    ],
    "flagEmoji": "🇰🇿",
    "facts": [
      "Kazakhstan is the largest landlocked country in the world (2.72 million km²), larger than all of Western Europe.",
      "Wild apples originated in the Tian Shan mountains of Kazakhstan; Almaty’s old name Alma-Ata literally means Father of Apples.",
      "Lake Balkhash in southeastern Kazakhstan is uniquely half freshwater (western half) and half saltwater (eastern half)."
    ],
    "nativeCapital": "Астана"
  },
  "KE": {
    "id": "KE",
    "iso3": "KEN",
    "name": "Kenya",
    "nativeName": "Kenya",
    "capital": "Nairobi",
    "continent": "Africa",
    "subregion": "Eastern Africa",
    "population": 47615739,
    "areaKm2": 580367,
    "lat": -1.2921,
    "lng": 36.8219,
    "languages": [
      "English",
      "Swahili"
    ],
    "currencies": [
      "Kenyan shilling (KES)"
    ],
    "flagEmoji": "🇰🇪",
    "facts": [
      "The Great Rift Valley slices Kenya from north to south, creating a chain of alkaline lakes famous for millions of flamingos.",
      "Kenya’s Kalenjin tribe in the Rift Valley highlands around Iten has produced more world-record distance runners than any other place on Earth.",
      "Mount Kenya (5,199 m) sits right on the Equator yet still has permanent equatorial glaciers near its summit."
    ],
    "nativeCapital": "Nairobi"
  },
  "KG": {
    "id": "KG",
    "iso3": "KGZ",
    "name": "Kyrgyzstan",
    "nativeName": "Кыргызстан",
    "capital": "Bishkek",
    "continent": "Asia",
    "subregion": "Central Asia",
    "population": 5789122,
    "areaKm2": 199951,
    "lat": 42.8746,
    "lng": 74.5698,
    "languages": [
      "Kyrgyz",
      "Russian"
    ],
    "currencies": [
      "Kyrgyzstani som (KGS)"
    ],
    "flagEmoji": "🇰🇬",
    "facts": [
      "Issyk-Kul in Kyrgyzstan is the second-largest alpine lake in the world (after Lake Titicaca) and never freezes in winter despite snow-capped peaks around it.",
      "Over 90% of Kyrgyzstan lies above 1,500 meters elevation across the rugged Tian Shan mountain range.",
      "Kyrgyzstan’s Arslanbob valley contains the largest natural walnut forest on Earth."
    ],
    "nativeCapital": "Бишкек"
  },
  "KH": {
    "id": "KH",
    "iso3": "KHM",
    "name": "Cambodia",
    "nativeName": "កម្ពុជា",
    "capital": "Phnom Penh",
    "continent": "Asia",
    "subregion": "South-Eastern Asia",
    "population": 16204486,
    "areaKm2": 181035,
    "lat": 11.5564,
    "lng": 104.9282,
    "languages": [
      "Khmer"
    ],
    "currencies": [
      "Cambodian riel (KHR)",
      "United States dollar (USD)"
    ],
    "flagEmoji": "🇰🇭",
    "facts": [
      "Angkor Wat in Siem Reap is the largest religious monument in the world, covering 162.6 hectares, and appears on the national flag.",
      "The Tonlé Sap river reverses its flow direction twice a year between the Mekong River and Tonlé Sap Lake.",
      "Cambodia’s flag is the only national flag in the world to feature an actual building as its centerpiece."
    ],
    "nativeCapital": "ភ្នំពេញ"
  },
  "KI": {
    "id": "KI",
    "iso3": "KIR",
    "name": "Kiribati",
    "nativeName": "Kiribati",
    "capital": "South Tarawa",
    "continent": "Oceania",
    "subregion": "Micronesia",
    "population": 97320,
    "areaKm2": 811,
    "lat": 1.3382,
    "lng": 173.0176,
    "languages": [
      "English",
      "Gilbertese"
    ],
    "currencies": [
      "Australian dollar (AUD)",
      "Kiribati dollar (KID)"
    ],
    "flagEmoji": "🇰🇮",
    "facts": [
      "South Tarawa sits near 1.3°N latitude and serves as the political, cultural, and transport hub of Kiribati in Micronesia.",
      "With a land area of 811 km² and ~97,320 residents, Kiribati has a population density of roughly 120 people per km².",
      "In regional geography, Kiribati is identified by its ISO code \"KI\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Tarawa"
  },
  "KN": {
    "id": "KN",
    "iso3": "KNA",
    "name": "Saint Kitts and Nevis",
    "nativeName": "Saint Kitts and Nevis",
    "capital": "Basseterre",
    "continent": "North America",
    "subregion": "Caribbean",
    "population": 31320,
    "areaKm2": 261,
    "lat": 17.3026,
    "lng": -62.7177,
    "languages": [
      "English"
    ],
    "currencies": [
      "Eastern Caribbean dollar (XCD)"
    ],
    "flagEmoji": "🇰🇳",
    "facts": [
      "Basseterre sits near 17.3°N latitude and serves as the political, cultural, and transport hub of Saint Kitts and Nevis in Caribbean.",
      "With a land area of 261 km² and ~31,320 residents, Saint Kitts and Nevis has a population density of roughly 120 people per km².",
      "In regional geography, Saint Kitts and Nevis is identified by its ISO code \"KN\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Basseterre"
  },
  "KR": {
    "id": "KR",
    "iso3": "KOR",
    "name": "South Korea",
    "nativeName": "대한민국",
    "capital": "Seoul",
    "continent": "Asia",
    "subregion": "Eastern Asia",
    "population": 51181299,
    "areaKm2": 100210,
    "lat": 37.5665,
    "lng": 126.978,
    "languages": [
      "Korean"
    ],
    "currencies": [
      "South Korean won (KRW)"
    ],
    "flagEmoji": "🇰🇷",
    "facts": [
      "Hallasan on Jeju Island is a dormant shield volcano (1,947 m) with over 360 parasitic volcanic cones called oreum.",
      "South Korea’s street addresses transitioned in 2014 to blue pentagon road-name plates (Doro-myeong Juso) numbered sequentially along every street.",
      "Korea’s traditional underfloor heating system (ondol) has been used continuously for over 2,500 years."
    ],
    "nativeCapital": "서울"
  },
  "XK": {
    "id": "XK",
    "iso3": "UNK",
    "name": "Kosovo",
    "nativeName": "Kosova / Косово",
    "capital": "Pristina",
    "continent": "Europe",
    "subregion": "Southeast Europe",
    "population": 1895250,
    "areaKm2": 10908,
    "lat": 42.6629,
    "lng": 21.1655,
    "languages": [
      "Albanian",
      "Serbian"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇽🇰",
    "facts": [
      "Pristina sits near 42.7°N latitude and serves as the political, cultural, and transport hub of Kosovo in Southeast Europe.",
      "With a land area of 10,908 km² and ~1.9 million residents, Kosovo has a population density of roughly 174 people per km².",
      "In regional geography, Kosovo is identified by its ISO code \"XK\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Prishtinë / Приштина"
  },
  "KW": {
    "id": "KW",
    "iso3": "KWT",
    "name": "Kuwait",
    "nativeName": "الكويت",
    "capital": "Kuwait City",
    "continent": "Asia",
    "subregion": "Western Asia",
    "population": 2875422,
    "areaKm2": 17818,
    "lat": 29.3759,
    "lng": 47.9774,
    "languages": [
      "Arabic"
    ],
    "currencies": [
      "Kuwaiti dinar (KWD)"
    ],
    "flagEmoji": "🇰🇼",
    "facts": [
      "Kuwait City sits near 29.4°N latitude and serves as the political, cultural, and transport hub of Kuwait in Western Asia.",
      "With a land area of 17,818 km² and ~2.9 million residents, Kuwait has a population density of roughly 161 people per km².",
      "In regional geography, Kuwait is identified by its ISO code \"KW\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "مدينة الكويت"
  },
  "LA": {
    "id": "LA",
    "iso3": "LAO",
    "name": "Laos",
    "nativeName": "ລາວ",
    "capital": "Vientiane",
    "continent": "Asia",
    "subregion": "South-Eastern Asia",
    "population": 7126706,
    "areaKm2": 236800,
    "lat": 17.9757,
    "lng": 102.6331,
    "languages": [
      "Lao"
    ],
    "currencies": [
      "Lao kip (LAK)"
    ],
    "flagEmoji": "🇱🇦",
    "facts": [
      "Laos is the only landlocked country in Southeast Asia, bordered by five nations and bisected by the Mekong River.",
      "The Plain of Jars in Xiangkhouang features thousands of mysterious megalithic stone jars carved over 2,000 years ago.",
      "Kong Lor Cave in Khammouane has an underground emerald river that boats can navigate through 7.5 km of limestone caverns."
    ],
    "nativeCapital": "ວຽງຈັນ"
  },
  "LB": {
    "id": "LB",
    "iso3": "LBN",
    "name": "Lebanon",
    "nativeName": "لبنان",
    "capital": "Beirut",
    "continent": "Asia",
    "subregion": "Western Asia",
    "population": 6229794,
    "areaKm2": 10452,
    "lat": 33.8938,
    "lng": 35.5018,
    "languages": [
      "Arabic",
      "French"
    ],
    "currencies": [
      "Lebanese pound (LBP)"
    ],
    "flagEmoji": "🇱🇧",
    "facts": [
      "Beirut sits near 33.9°N latitude and serves as the political, cultural, and transport hub of Lebanon in Western Asia.",
      "With a land area of 10,452 km² and ~6.2 million residents, Lebanon has a population density of roughly 596 people per km².",
      "In regional geography, Lebanon is identified by its ISO code \"LB\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "بيروت"
  },
  "LR": {
    "id": "LR",
    "iso3": "LBR",
    "name": "Liberia",
    "nativeName": "Liberia",
    "capital": "Monrovia",
    "continent": "Africa",
    "subregion": "Western Africa",
    "population": 4689021,
    "areaKm2": 111369,
    "lat": 6.3156,
    "lng": -10.8074,
    "languages": [
      "English"
    ],
    "currencies": [
      "Liberian dollar (LRD)"
    ],
    "flagEmoji": "🇱🇷",
    "facts": [
      "Monrovia sits near 6.3°N latitude and serves as the political, cultural, and transport hub of Liberia in Western Africa.",
      "With a land area of 111,369 km² and ~4.7 million residents, Liberia has a population density of roughly 42 people per km².",
      "In regional geography, Liberia is identified by its ISO code \"LR\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Monrovia"
  },
  "LY": {
    "id": "LY",
    "iso3": "LBY",
    "name": "Libya",
    "nativeName": "ليبيا",
    "capital": "Tripoli",
    "continent": "Africa",
    "subregion": "Northern Africa",
    "population": 6653210,
    "areaKm2": 1759540,
    "lat": 32.8872,
    "lng": 13.1913,
    "languages": [
      "Arabic"
    ],
    "currencies": [
      "Libyan dinar (LYD)"
    ],
    "flagEmoji": "🇱🇾",
    "facts": [
      "Tripoli sits near 32.9°N latitude and serves as the political, cultural, and transport hub of Libya in Northern Africa.",
      "With a land area of 1,759,540 km² and ~6.7 million residents, Libya has a population density of roughly 4 people per km².",
      "In regional geography, Libya is identified by its ISO code \"LY\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "طرابلس"
  },
  "LC": {
    "id": "LC",
    "iso3": "LCA",
    "name": "Saint Lucia",
    "nativeName": "Saint Lucia",
    "capital": "Castries",
    "continent": "North America",
    "subregion": "Caribbean",
    "population": 73920,
    "areaKm2": 616,
    "lat": 14.0101,
    "lng": -60.9875,
    "languages": [
      "English"
    ],
    "currencies": [
      "Eastern Caribbean dollar (XCD)"
    ],
    "flagEmoji": "🇱🇨",
    "facts": [
      "Castries sits near 14.0°N latitude and serves as the political, cultural, and transport hub of Saint Lucia in Caribbean.",
      "With a land area of 616 km² and ~73,920 residents, Saint Lucia has a population density of roughly 120 people per km².",
      "In regional geography, Saint Lucia is identified by its ISO code \"LC\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Castries"
  },
  "LI": {
    "id": "LI",
    "iso3": "LIE",
    "name": "Liechtenstein",
    "nativeName": "Liechtenstein",
    "capital": "Vaduz",
    "continent": "Europe",
    "subregion": "Western Europe",
    "population": 19200,
    "areaKm2": 160,
    "lat": 47.141,
    "lng": 9.5209,
    "languages": [
      "German"
    ],
    "currencies": [
      "Swiss franc (CHF)"
    ],
    "flagEmoji": "🇱🇮",
    "facts": [
      "Vaduz sits near 47.1°N latitude and serves as the political, cultural, and transport hub of Liechtenstein in Western Europe.",
      "With a land area of 160 km² and ~19,200 residents, Liechtenstein has a population density of roughly 120 people per km².",
      "In regional geography, Liechtenstein is identified by its ISO code \"LI\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Vaduz"
  },
  "LK": {
    "id": "LK",
    "iso3": "LKA",
    "name": "Sri Lanka",
    "nativeName": "ශ්‍රී ලංකාව / இலங்கை",
    "capital": "Colombo",
    "continent": "Asia",
    "subregion": "Southern Asia",
    "population": 22409381,
    "areaKm2": 65610,
    "lat": 6.9271,
    "lng": 79.8612,
    "languages": [
      "Sinhala",
      "Tamil"
    ],
    "currencies": [
      "Sri Lankan rupee (LKR)"
    ],
    "flagEmoji": "🇱🇰",
    "facts": [
      "Due to huge submarine canyons and low rock density beneath the Indian Ocean, southern Sri Lanka has the weakest gravitational pull on Earth.",
      "Sigiriya (Lion Rock) is an ancient 5th-century palace and fortress built atop a 200-meter vertical magma plug.",
      "Sri Lanka speaks two distinct scripts seen together on trilingual signs: rounded Sinhala and angular Tamil, alongside English."
    ],
    "nativeCapital": "ශ්‍රී ජයවර්ධනපුර කෝට්ටේ"
  },
  "LS": {
    "id": "LS",
    "iso3": "LSO",
    "name": "Lesotho",
    "nativeName": "Lesotho",
    "capital": "Maseru",
    "continent": "Africa",
    "subregion": "Southern Africa",
    "population": 1958042,
    "areaKm2": 30355,
    "lat": -29.3151,
    "lng": 27.4869,
    "languages": [
      "English",
      "Sotho"
    ],
    "currencies": [
      "Lesotho loti (LSL)",
      "South African rand (ZAR)"
    ],
    "flagEmoji": "🇱🇸",
    "facts": [
      "Maseru sits near 29.3°S latitude and serves as the political, cultural, and transport hub of Lesotho in Southern Africa.",
      "With a land area of 30,355 km² and ~2.0 million residents, Lesotho has a population density of roughly 65 people per km².",
      "In regional geography, Lesotho is identified by its ISO code \"LS\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Maseru"
  },
  "LT": {
    "id": "LT",
    "iso3": "LTU",
    "name": "Lithuania",
    "nativeName": "Lietuva",
    "capital": "Vilnius",
    "continent": "Europe",
    "subregion": "Northern Europe",
    "population": 2823859,
    "areaKm2": 65300,
    "lat": 54.6872,
    "lng": 25.2797,
    "languages": [
      "Lithuanian"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇱🇹",
    "facts": [
      "In 1990, Lithuania became the first Soviet republic to declare restoration of its independence.",
      "Lithuanian is the most conservative living Indo-European language, retaining ancient grammatical forms similar to Sanskrit.",
      "The Curonian Spit is a 98 km curved sand-dune peninsula separating the Curonian Lagoon from the Baltic Sea."
    ],
    "nativeCapital": "Vilnius"
  },
  "LU": {
    "id": "LU",
    "iso3": "LUX",
    "name": "Luxembourg",
    "nativeName": "Lëtzebuerg / Luxembourg / Luxemburg",
    "capital": "Luxembourg",
    "continent": "Europe",
    "subregion": "Western Europe",
    "population": 594130,
    "areaKm2": 2586,
    "lat": 49.6116,
    "lng": 6.1319,
    "languages": [
      "German",
      "French",
      "Luxembourgish"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇱🇺",
    "facts": [
      "In March 2020, Luxembourg became the first country in the world to make all public transport (trains, trams, and buses) completely free.",
      "Luxembourg is the only remaining sovereign Grand Duchy in the world.",
      "Nearly half of Luxembourg’s residents are foreign nationals, and workers commute daily from France, Belgium, and Germany."
    ],
    "nativeCapital": "Lëtzebuerg / Luxembourg"
  },
  "LV": {
    "id": "LV",
    "iso3": "LVA",
    "name": "Latvia",
    "nativeName": "Latvija",
    "capital": "Riga",
    "continent": "Europe",
    "subregion": "Northern Europe",
    "population": 1944643,
    "areaKm2": 64559,
    "lat": 56.9496,
    "lng": 24.1052,
    "languages": [
      "Latvian"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇱🇻",
    "facts": [
      "Ventas Rumba in Kuldīga is the widest waterfall in Europe at 249 meters across, though only about 2 meters high.",
      "Over 54% of Latvia is covered by forest, and locals have a legal right to forage wild mushrooms and berries in state forests.",
      "Riga’s historic center contains the largest collection of Art Nouveau (Jugendstil) buildings in the world (over 800 structures)."
    ],
    "nativeCapital": "Riga"
  },
  "MO": {
    "id": "MO",
    "iso3": "MAC",
    "name": "Macau",
    "nativeName": "澳門",
    "capital": "N/A",
    "continent": "Asia",
    "subregion": "Eastern Asia",
    "population": 3600,
    "areaKm2": 30,
    "lat": 22.1987,
    "lng": 113.5439,
    "languages": [
      "Portuguese",
      "Chinese"
    ],
    "currencies": [
      "Macanese pataca (MOP)"
    ],
    "flagEmoji": "🇲🇴",
    "facts": [
      "N/A sits near 22.2°N latitude and serves as the political, cultural, and transport hub of Macau in Eastern Asia.",
      "With a land area of 30 km² and ~3,600 residents, Macau has a population density of roughly 120 people per km².",
      "In regional geography, Macau is identified by its ISO code \"MO\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "澳門"
  },
  "MF": {
    "id": "MF",
    "iso3": "MAF",
    "name": "Saint Martin",
    "nativeName": "Saint-Martin",
    "capital": "Marigot",
    "continent": "North America",
    "subregion": "Caribbean",
    "population": 6360,
    "areaKm2": 53,
    "lat": 18.0675,
    "lng": -63.0825,
    "languages": [
      "French"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇲🇫",
    "facts": [
      "Marigot sits near 18.1°N latitude and serves as the political, cultural, and transport hub of Saint Martin in Caribbean.",
      "With a land area of 53 km² and ~6,360 residents, Saint Martin has a population density of roughly 120 people per km².",
      "In regional geography, Saint Martin is identified by its ISO code \"MF\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Marigot"
  },
  "MA": {
    "id": "MA",
    "iso3": "MAR",
    "name": "Morocco",
    "nativeName": "المغرب",
    "capital": "Rabat",
    "continent": "Africa",
    "subregion": "Northern Africa",
    "population": 33986655,
    "areaKm2": 446550,
    "lat": 34.0209,
    "lng": -6.8416,
    "languages": [
      "Arabic",
      "Berber"
    ],
    "currencies": [
      "Moroccan dirham (MAD)"
    ],
    "flagEmoji": "🇲🇦",
    "facts": [
      "The University of al-Qarawiyyin in Fez, founded in 859 AD by Fatima al-Fihri, is recognized as the oldest continuously operating university in the world.",
      "Goats in southwestern Morocco famously climb thorny Argania spinosa trees to eat argan fruit.",
      "Chefchaouen in the Rif Mountains is famous for having every street, stairway, and house painted in vivid shades of blue."
    ],
    "nativeCapital": "الرباط"
  },
  "MC": {
    "id": "MC",
    "iso3": "MCO",
    "name": "Monaco",
    "nativeName": "Monaco",
    "capital": "Monaco",
    "continent": "Europe",
    "subregion": "Western Europe",
    "population": 1000,
    "areaKm2": 2.02,
    "lat": 43.7384,
    "lng": 7.4246,
    "languages": [
      "French"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇲🇨",
    "facts": [
      "Monaco sits near 43.7°N latitude and serves as the political, cultural, and transport hub of Monaco in Western Europe.",
      "With a land area of 2 km² and ~1,000 residents, Monaco has a population density of roughly 500 people per km².",
      "In regional geography, Monaco is identified by its ISO code \"MC\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Monaco"
  },
  "MD": {
    "id": "MD",
    "iso3": "MDA",
    "name": "Moldova",
    "nativeName": "Moldova",
    "capital": "Chișinău",
    "continent": "Europe",
    "subregion": "Eastern Europe",
    "population": 3474121,
    "areaKm2": 33846,
    "lat": 47.0105,
    "lng": 28.8638,
    "languages": [
      "Moldavian"
    ],
    "currencies": [
      "Moldovan leu (MDL)"
    ],
    "flagEmoji": "🇲🇩",
    "facts": [
      "Chișinău sits near 47.0°N latitude and serves as the political, cultural, and transport hub of Moldova in Eastern Europe.",
      "With a land area of 33,846 km² and ~3.5 million residents, Moldova has a population density of roughly 103 people per km².",
      "In regional geography, Moldova is identified by its ISO code \"MD\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Chișinău"
  },
  "MG": {
    "id": "MG",
    "iso3": "MDG",
    "name": "Madagascar",
    "nativeName": "Madagasikara / Madagascar",
    "capital": "Antananarivo",
    "continent": "Africa",
    "subregion": "Eastern Africa",
    "population": 25054161,
    "areaKm2": 587041,
    "lat": -18.8792,
    "lng": 47.5079,
    "languages": [
      "French",
      "Malagasy"
    ],
    "currencies": [
      "Malagasy ariary (MGA)"
    ],
    "flagEmoji": "🇲🇬",
    "facts": [
      "Having split from Gondwana 88 million years ago, around 90% of Madagascar’s wildlife—including over 100 species of lemurs—is found nowhere else on Earth.",
      "Madagascar is home to six of the world’s nine species of baobab trees.",
      "Tsingy de Bemaraha is a labyrinth of razor-sharp limestone pinnacles carved by tropical rain."
    ],
    "nativeCapital": "Antananarivo"
  },
  "MV": {
    "id": "MV",
    "iso3": "MDV",
    "name": "Maldives",
    "nativeName": "ދިވެހިރާއްޖެ",
    "capital": "Malé",
    "continent": "Asia",
    "subregion": "Southern Asia",
    "population": 36000,
    "areaKm2": 300,
    "lat": 4.1755,
    "lng": 73.5093,
    "languages": [
      "Maldivian"
    ],
    "currencies": [
      "Maldivian rufiyaa (MVR)"
    ],
    "flagEmoji": "🇲🇻",
    "facts": [
      "Malé sits near 4.2°N latitude and serves as the political, cultural, and transport hub of Maldives in Southern Asia.",
      "With a land area of 300 km² and ~36,000 residents, Maldives has a population density of roughly 120 people per km².",
      "In regional geography, Maldives is identified by its ISO code \"MV\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "މާލެ"
  },
  "MX": {
    "id": "MX",
    "iso3": "MEX",
    "name": "Mexico",
    "nativeName": "México",
    "capital": "Mexico City",
    "continent": "North America",
    "subregion": "North America",
    "population": 124574795,
    "areaKm2": 1964375,
    "lat": 19.4326,
    "lng": -99.1332,
    "languages": [
      "Spanish"
    ],
    "currencies": [
      "Mexican peso (MXN)"
    ],
    "flagEmoji": "🇲🇽",
    "facts": [
      "Mexico City was built over the Aztec island capital Tenochtitlan in Lake Texcoco and sinks up to 50 cm per year due to groundwater extraction.",
      "The Chicxulub crater on the Yucatán Peninsula is the impact site of the asteroid that wiped out the dinosaurs 66 million years ago.",
      "The Great Pyramid of Cholula in Puebla is the largest pyramid in the world by total volume—larger than the Great Pyramid of Giza."
    ],
    "nativeCapital": "Ciudad de México"
  },
  "MH": {
    "id": "MH",
    "iso3": "MHL",
    "name": "Marshall Islands",
    "nativeName": "Aelōn̄ in M̧ajeļ / Marshall Islands",
    "capital": "Majuro",
    "continent": "Oceania",
    "subregion": "Micronesia",
    "population": 21720,
    "areaKm2": 181,
    "lat": 7.0897,
    "lng": 171.3803,
    "languages": [
      "English",
      "Marshallese"
    ],
    "currencies": [
      "United States dollar (USD)"
    ],
    "flagEmoji": "🇲🇭",
    "facts": [
      "Majuro sits near 7.1°N latitude and serves as the political, cultural, and transport hub of Marshall Islands in Micronesia.",
      "With a land area of 181 km² and ~21,720 residents, Marshall Islands has a population density of roughly 120 people per km².",
      "In regional geography, Marshall Islands is identified by its ISO code \"MH\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Majuro"
  },
  "MK": {
    "id": "MK",
    "iso3": "MKD",
    "name": "North Macedonia",
    "nativeName": "Северна Македонија",
    "capital": "Skopje",
    "continent": "Europe",
    "subregion": "Southeast Europe",
    "population": 2103721,
    "areaKm2": 25713,
    "lat": 41.9981,
    "lng": 21.4254,
    "languages": [
      "Macedonian"
    ],
    "currencies": [
      "denar (MKD)"
    ],
    "flagEmoji": "🇲🇰",
    "facts": [
      "Skopje’s Millennium Cross on Mount Vodno (66 meters tall) is one of the largest crosses in the world, visible from 30 km away.",
      "Kokino in northern North Macedonia is a 3,800-year-old Bronze Age megalithic astronomical observatory ranked fourth by NASA.",
      "Lake Ohrid straddling the border of North Macedonia and Albania hosts over 200 endemic species found nowhere else on Earth."
    ],
    "nativeCapital": "Скопје"
  },
  "ML": {
    "id": "ML",
    "iso3": "MLI",
    "name": "Mali",
    "nativeName": "Mali",
    "capital": "Bamako",
    "continent": "Africa",
    "subregion": "Western Africa",
    "population": 17885245,
    "areaKm2": 1240192,
    "lat": 12.6392,
    "lng": -8.0029,
    "languages": [
      "French"
    ],
    "currencies": [
      "West African CFA franc (XOF)"
    ],
    "flagEmoji": "🇲🇱",
    "facts": [
      "Bamako sits near 12.6°N latitude and serves as the political, cultural, and transport hub of Mali in Western Africa.",
      "With a land area of 1,240,192 km² and ~17.9 million residents, Mali has a population density of roughly 14 people per km².",
      "In regional geography, Mali is identified by its ISO code \"ML\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Bamako"
  },
  "MT": {
    "id": "MT",
    "iso3": "MLT",
    "name": "Malta",
    "nativeName": "Malta",
    "capital": "Valletta",
    "continent": "Europe",
    "subregion": "Southern Europe",
    "population": 37920,
    "areaKm2": 316,
    "lat": 35.8989,
    "lng": 14.5146,
    "languages": [
      "English",
      "Maltese"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇲🇹",
    "facts": [
      "Maltese is the only Semitic language written in the Latin alphabet and the only Semitic official language of the European Union.",
      "The megalithic temples of Ġgantija and Ħaġar Qim in Malta date back to 3600 BC—older than the Egyptian pyramids.",
      "Malta has no permanent rivers or natural freshwater lakes on any of its islands."
    ],
    "nativeCapital": "Valletta"
  },
  "MM": {
    "id": "MM",
    "iso3": "MMR",
    "name": "Myanmar",
    "nativeName": "မြန်မာ",
    "capital": "Naypyidaw",
    "continent": "Asia",
    "subregion": "South-Eastern Asia",
    "population": 55123814,
    "areaKm2": 676578,
    "lat": 19.7633,
    "lng": 96.0785,
    "languages": [
      "Burmese"
    ],
    "currencies": [
      "Burmese kyat (MMK)"
    ],
    "flagEmoji": "🇲🇲",
    "facts": [
      "Naypyidaw sits near 19.8°N latitude and serves as the political, cultural, and transport hub of Myanmar in South-Eastern Asia.",
      "With a land area of 676,578 km² and ~55.1 million residents, Myanmar has a population density of roughly 81 people per km².",
      "In regional geography, Myanmar is identified by its ISO code \"MM\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "နေပြည်တော်"
  },
  "ME": {
    "id": "ME",
    "iso3": "MNE",
    "name": "Montenegro",
    "nativeName": "Crna Gora / Црна Гора",
    "capital": "Podgorica",
    "continent": "Europe",
    "subregion": "Southeast Europe",
    "population": 642550,
    "areaKm2": 13812,
    "lat": 42.4304,
    "lng": 19.2594,
    "languages": [
      "Montenegrin"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇲🇪",
    "facts": [
      "The Tara River Canyon in Montenegro is the deepest river canyon in Europe, plunging 1,300 meters deep.",
      "The Bay of Kotor (Boka Kotorska) is a submerged river canyon surrounded by sheer limestone cliffs, often called Europe’s southernmost fjord.",
      "Crkvice above the Bay of Kotor is the wettest place in Europe, receiving around 4,600 mm of rain annually."
    ],
    "nativeCapital": "Podgorica / Подгорица"
  },
  "MN": {
    "id": "MN",
    "iso3": "MNG",
    "name": "Mongolia",
    "nativeName": "Монгол Улс",
    "capital": "Ulan Bator",
    "continent": "Asia",
    "subregion": "Eastern Asia",
    "population": 3068243,
    "areaKm2": 1564110,
    "lat": 47.8864,
    "lng": 106.9057,
    "languages": [
      "Mongolian"
    ],
    "currencies": [
      "Mongolian tögrög (MNT)"
    ],
    "flagEmoji": "🇲🇳",
    "facts": [
      "Mongolia is the most sparsely populated sovereign country on Earth, with roughly 2 people per square kilometer.",
      "Ulaanbaatar is the coldest national capital in the world, with a mean annual temperature below freezing (-0.4 °C).",
      "Around 30% of Mongolia’s population still lives a nomadic or semi-nomadic pastoral lifestyle in portable felt yurts called gers."
    ],
    "nativeCapital": "Улаанбаатар"
  },
  "MP": {
    "id": "MP",
    "iso3": "MNP",
    "name": "Northern Mariana Islands",
    "nativeName": "Northern Mariana Islands",
    "capital": "Saipan",
    "continent": "Oceania",
    "subregion": "Micronesia",
    "population": 55680,
    "areaKm2": 464,
    "lat": 15.1778,
    "lng": 145.751,
    "languages": [
      "Carolinian",
      "Chamorro",
      "English"
    ],
    "currencies": [
      "United States dollar (USD)"
    ],
    "flagEmoji": "🇲🇵",
    "facts": [
      "Saipan sits near 15.2°N latitude and serves as the political, cultural, and transport hub of Northern Mariana Islands in Micronesia.",
      "With a land area of 464 km² and ~55,680 residents, Northern Mariana Islands has a population density of roughly 120 people per km².",
      "In regional geography, Northern Mariana Islands is identified by its ISO code \"MP\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Saipan"
  },
  "MZ": {
    "id": "MZ",
    "iso3": "MOZ",
    "name": "Mozambique",
    "nativeName": "Moçambique",
    "capital": "Maputo",
    "continent": "Africa",
    "subregion": "Eastern Africa",
    "population": 26573706,
    "areaKm2": 801590,
    "lat": -25.9692,
    "lng": 32.5732,
    "languages": [
      "Portuguese"
    ],
    "currencies": [
      "Mozambican metical (MZN)"
    ],
    "flagEmoji": "🇲🇿",
    "facts": [
      "Maputo sits near 26.0°S latitude and serves as the political, cultural, and transport hub of Mozambique in Eastern Africa.",
      "With a land area of 801,590 km² and ~26.6 million residents, Mozambique has a population density of roughly 33 people per km².",
      "In regional geography, Mozambique is identified by its ISO code \"MZ\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Maputo"
  },
  "MR": {
    "id": "MR",
    "iso3": "MRT",
    "name": "Mauritania",
    "nativeName": "موريتانيا",
    "capital": "Nouakchott",
    "continent": "Africa",
    "subregion": "Western Africa",
    "population": 3758571,
    "areaKm2": 1030700,
    "lat": 18.0735,
    "lng": -15.9582,
    "languages": [
      "Arabic"
    ],
    "currencies": [
      "Mauritanian ouguiya (MRU)"
    ],
    "flagEmoji": "🇲🇷",
    "facts": [
      "Nouakchott sits near 18.1°N latitude and serves as the political, cultural, and transport hub of Mauritania in Western Africa.",
      "With a land area of 1,030,700 km² and ~3.8 million residents, Mauritania has a population density of roughly 4 people per km².",
      "In regional geography, Mauritania is identified by its ISO code \"MR\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "نواكشوط"
  },
  "MS": {
    "id": "MS",
    "iso3": "MSR",
    "name": "Montserrat",
    "nativeName": "Montserrat",
    "capital": "Plymouth",
    "continent": "North America",
    "subregion": "Caribbean",
    "population": 12240,
    "areaKm2": 102,
    "lat": 16.792,
    "lng": -62.2106,
    "languages": [
      "English"
    ],
    "currencies": [
      "Eastern Caribbean dollar (XCD)"
    ],
    "flagEmoji": "🇲🇸",
    "facts": [
      "Plymouth sits near 16.8°N latitude and serves as the political, cultural, and transport hub of Montserrat in Caribbean.",
      "With a land area of 102 km² and ~12,240 residents, Montserrat has a population density of roughly 120 people per km².",
      "In regional geography, Montserrat is identified by its ISO code \"MS\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Plymouth"
  },
  "MQ": {
    "id": "MQ",
    "iso3": "MTQ",
    "name": "Martinique",
    "nativeName": "Martinique",
    "capital": "Fort-de-France",
    "continent": "North America",
    "subregion": "Caribbean",
    "population": 135360,
    "areaKm2": 1128,
    "lat": 14.6161,
    "lng": -61.0588,
    "languages": [
      "French"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇲🇶",
    "facts": [
      "Fort-de-France sits near 14.6°N latitude and serves as the political, cultural, and transport hub of Martinique in Caribbean.",
      "With a land area of 1,128 km² and ~135,360 residents, Martinique has a population density of roughly 120 people per km².",
      "In regional geography, Martinique is identified by its ISO code \"MQ\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Fort-de-France"
  },
  "MU": {
    "id": "MU",
    "iso3": "MUS",
    "name": "Mauritius",
    "nativeName": "Moris / Maurice / Mauritius",
    "capital": "Port Louis",
    "continent": "Africa",
    "subregion": "Eastern Africa",
    "population": 244800,
    "areaKm2": 2040,
    "lat": -20.1609,
    "lng": 57.5012,
    "languages": [
      "English",
      "French",
      "Mauritian Creole"
    ],
    "currencies": [
      "Mauritian rupee (MUR)"
    ],
    "flagEmoji": "🇲🇺",
    "facts": [
      "Port Louis sits near 20.2°S latitude and serves as the political, cultural, and transport hub of Mauritius in Eastern Africa.",
      "With a land area of 2,040 km² and ~244,800 residents, Mauritius has a population density of roughly 120 people per km².",
      "In regional geography, Mauritius is identified by its ISO code \"MU\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Port Louis"
  },
  "MW": {
    "id": "MW",
    "iso3": "MWI",
    "name": "Malawi",
    "nativeName": "Malaŵi / Malawi",
    "capital": "Lilongwe",
    "continent": "Africa",
    "subregion": "Eastern Africa",
    "population": 19196246,
    "areaKm2": 118484,
    "lat": -13.9626,
    "lng": 33.7741,
    "languages": [
      "English",
      "Chewa"
    ],
    "currencies": [
      "Malawian kwacha (MWK)"
    ],
    "flagEmoji": "🇲🇼",
    "facts": [
      "Lilongwe sits near 14.0°S latitude and serves as the political, cultural, and transport hub of Malawi in Eastern Africa.",
      "With a land area of 118,484 km² and ~19.2 million residents, Malawi has a population density of roughly 162 people per km².",
      "In regional geography, Malawi is identified by its ISO code \"MW\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Lilongwe"
  },
  "MY": {
    "id": "MY",
    "iso3": "MYS",
    "name": "Malaysia",
    "nativeName": "Malaysia",
    "capital": "Kuala Lumpur",
    "continent": "Asia",
    "subregion": "South-Eastern Asia",
    "population": 31381992,
    "areaKm2": 330803,
    "lat": 3.139,
    "lng": 101.6869,
    "languages": [
      "English",
      "Malay"
    ],
    "currencies": [
      "Malaysian ringgit (MYR)"
    ],
    "flagEmoji": "🇲🇾",
    "facts": [
      "Malaysia is split between Peninsular Malaysia and East Malaysia (Sabah & Sarawak on Borneo) separated by 640 km of the South China Sea.",
      "Sarawak Chamber in Gunung Mulu National Park is the largest underground cave chamber on Earth by area, big enough to fit 40 Boeing 747s.",
      "Malaysian highway route shields are yellow hexagons with black route numbers."
    ],
    "nativeCapital": "Kuala Lumpur"
  },
  "YT": {
    "id": "YT",
    "iso3": "MYT",
    "name": "Mayotte",
    "nativeName": "Mayotte",
    "capital": "Mamoudzou",
    "continent": "Africa",
    "subregion": "Eastern Africa",
    "population": 44880,
    "areaKm2": 374,
    "lat": -12.7806,
    "lng": 45.2278,
    "languages": [
      "French"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇾🇹",
    "facts": [
      "Mamoudzou sits near 12.8°S latitude and serves as the political, cultural, and transport hub of Mayotte in Eastern Africa.",
      "With a land area of 374 km² and ~44,880 residents, Mayotte has a population density of roughly 120 people per km².",
      "In regional geography, Mayotte is identified by its ISO code \"YT\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Mamoudzou"
  },
  "NA": {
    "id": "NA",
    "iso3": "NAM",
    "name": "Namibia",
    "nativeName": "Namibia",
    "capital": "Windhoek",
    "continent": "Africa",
    "subregion": "Southern Africa",
    "population": 2484780,
    "areaKm2": 825615,
    "lat": -22.5609,
    "lng": 17.0658,
    "languages": [
      "Afrikaans",
      "German",
      "English",
      "Herero",
      "Khoekhoe",
      "Kwangali",
      "Lozi",
      "Ndonga",
      "Tswana"
    ],
    "currencies": [
      "Namibian dollar (NAD)",
      "South African rand (ZAR)"
    ],
    "flagEmoji": "🇳🇦",
    "facts": [
      "Windhoek sits near 22.6°S latitude and serves as the political, cultural, and transport hub of Namibia in Southern Africa.",
      "With a land area of 825,615 km² and ~2.5 million residents, Namibia has a population density of roughly 3 people per km².",
      "In regional geography, Namibia is identified by its ISO code \"NA\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Windhoek"
  },
  "NC": {
    "id": "NC",
    "iso3": "NCL",
    "name": "New Caledonia",
    "nativeName": "Nouvelle-Calédonie",
    "capital": "Nouméa",
    "continent": "Oceania",
    "subregion": "Melanesia",
    "population": 279070,
    "areaKm2": 18575,
    "lat": -22.2758,
    "lng": 166.458,
    "languages": [
      "French"
    ],
    "currencies": [
      "CFP franc (XPF)"
    ],
    "flagEmoji": "🇳🇨",
    "facts": [
      "Nouméa sits near 22.3°S latitude and serves as the political, cultural, and transport hub of New Caledonia in Melanesia.",
      "With a land area of 18,575 km² and ~279,070 residents, New Caledonia has a population density of roughly 15 people per km².",
      "In regional geography, New Caledonia is identified by its ISO code \"NC\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Nouméa"
  },
  "NE": {
    "id": "NE",
    "iso3": "NER",
    "name": "Niger",
    "nativeName": "Niger",
    "capital": "Niamey",
    "continent": "Africa",
    "subregion": "Western Africa",
    "population": 19245344,
    "areaKm2": 1267000,
    "lat": 13.5116,
    "lng": 2.1254,
    "languages": [
      "French"
    ],
    "currencies": [
      "West African CFA franc (XOF)"
    ],
    "flagEmoji": "🇳🇪",
    "facts": [
      "Niamey sits near 13.5°N latitude and serves as the political, cultural, and transport hub of Niger in Western Africa.",
      "With a land area of 1,267,000 km² and ~19.2 million residents, Niger has a population density of roughly 15 people per km².",
      "In regional geography, Niger is identified by its ISO code \"NE\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Niamey"
  },
  "NF": {
    "id": "NF",
    "iso3": "NFK",
    "name": "Norfolk Island",
    "nativeName": "Norfolk Island",
    "capital": "Kingston",
    "continent": "Oceania",
    "subregion": "Australia and New Zealand",
    "population": 4320,
    "areaKm2": 36,
    "lat": -29.0544,
    "lng": 167.951,
    "languages": [
      "English",
      "Norfuk"
    ],
    "currencies": [
      "Australian dollar (AUD)"
    ],
    "flagEmoji": "🇳🇫",
    "facts": [
      "Kingston sits near 29.1°S latitude and serves as the political, cultural, and transport hub of Norfolk Island in Australia and New Zealand.",
      "With a land area of 36 km² and ~4,320 residents, Norfolk Island has a population density of roughly 120 people per km².",
      "In regional geography, Norfolk Island is identified by its ISO code \"NF\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Kingston"
  },
  "NG": {
    "id": "NG",
    "iso3": "NGA",
    "name": "Nigeria",
    "nativeName": "Nigeria",
    "capital": "Abuja",
    "continent": "Africa",
    "subregion": "Western Africa",
    "population": 190632261,
    "areaKm2": 923768,
    "lat": 9.0765,
    "lng": 7.3986,
    "languages": [
      "English"
    ],
    "currencies": [
      "Nigerian naira (NGN)"
    ],
    "flagEmoji": "🇳🇬",
    "facts": [
      "Nigeria is Africa’s most populous nation (over 220 million people) and home to more than 500 distinct indigenous languages.",
      "Lagos is built across a series of islands and lagoons connected by the 11.8 km Third Mainland Bridge.",
      "Zuma Rock near Abuja rises 300 meters straight above the surrounding plains and features natural contours resembling a human face."
    ],
    "nativeCapital": "Abuja"
  },
  "NI": {
    "id": "NI",
    "iso3": "NIC",
    "name": "Nicaragua",
    "nativeName": "Nicaragua",
    "capital": "Managua",
    "continent": "North America",
    "subregion": "Central America",
    "population": 6025951,
    "areaKm2": 130373,
    "lat": 12.115,
    "lng": -86.2362,
    "languages": [
      "Spanish"
    ],
    "currencies": [
      "Nicaraguan córdoba (NIO)"
    ],
    "flagEmoji": "🇳🇮",
    "facts": [
      "Managua sits near 12.1°N latitude and serves as the political, cultural, and transport hub of Nicaragua in Central America.",
      "With a land area of 130,373 km² and ~6.0 million residents, Nicaragua has a population density of roughly 46 people per km².",
      "In regional geography, Nicaragua is identified by its ISO code \"NI\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Managua"
  },
  "NU": {
    "id": "NU",
    "iso3": "NIU",
    "name": "Niue",
    "nativeName": "Niuē",
    "capital": "Alofi",
    "continent": "Oceania",
    "subregion": "Polynesia",
    "population": 31200,
    "areaKm2": 260,
    "lat": -19.0554,
    "lng": -169.9179,
    "languages": [
      "English",
      "Niuean"
    ],
    "currencies": [
      "New Zealand dollar (NZD)"
    ],
    "flagEmoji": "🇳🇺",
    "facts": [
      "Alofi sits near 19.1°S latitude and serves as the political, cultural, and transport hub of Niue in Polynesia.",
      "With a land area of 260 km² and ~31,200 residents, Niue has a population density of roughly 120 people per km².",
      "In regional geography, Niue is identified by its ISO code \"NU\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Alofi"
  },
  "NL": {
    "id": "NL",
    "iso3": "NLD",
    "name": "Netherlands",
    "nativeName": "Nederland",
    "capital": "Amsterdam",
    "continent": "Europe",
    "subregion": "Western Europe",
    "population": 17084719,
    "areaKm2": 41850,
    "lat": 52.3676,
    "lng": 4.9041,
    "languages": [
      "Dutch"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇳🇱",
    "facts": [
      "Around 26% of the Netherlands lies below sea level, and the entire province of Flevoland was reclaimed from the Zuiderzee in the 20th century.",
      "There are more bicycles (over 23 million) than people in the Netherlands, along with 35,000 km of dedicated cycle paths.",
      "Vaalserberg (322.4 m), the highest point on the Dutch mainland, is a tripoint where the Netherlands, Belgium, and Germany meet."
    ],
    "nativeCapital": "Amsterdam"
  },
  "NO": {
    "id": "NO",
    "iso3": "NOR",
    "name": "Norway",
    "nativeName": "Norge / Noreg",
    "capital": "Oslo",
    "continent": "Europe",
    "subregion": "Northern Europe",
    "population": 38856240,
    "areaKm2": 323802,
    "lat": 59.9139,
    "lng": 10.7522,
    "languages": [
      "Norwegian Nynorsk",
      "Norwegian Bokmål",
      "Sami"
    ],
    "currencies": [
      "Norwegian krone (NOK)"
    ],
    "flagEmoji": "🇳🇴",
    "facts": [
      "Norway’s Lærdal Tunnel is the longest road tunnel in the world at 24.51 kilometers (15.2 miles), featuring illuminated rock caverns to prevent driver fatigue.",
      "Sognefjord is the largest and deepest fjord in Norway, extending 205 km inland and plunging 1,308 meters below sea level.",
      "On the Arctic archipelago of Svalbard, polar bears outnumber residents and the Global Seed Vault stores 1.2 million crop samples inside permafrost."
    ],
    "nativeCapital": "Oslo"
  },
  "NP": {
    "id": "NP",
    "iso3": "NPL",
    "name": "Nepal",
    "nativeName": "नेपाल",
    "capital": "Kathmandu",
    "continent": "Asia",
    "subregion": "Southern Asia",
    "population": 29384297,
    "areaKm2": 147181,
    "lat": 27.7172,
    "lng": 85.324,
    "languages": [
      "Nepali"
    ],
    "currencies": [
      "Nepalese rupee (NPR)"
    ],
    "flagEmoji": "🇳🇵",
    "facts": [
      "Kathmandu sits near 27.7°N latitude and serves as the political, cultural, and transport hub of Nepal in Southern Asia.",
      "With a land area of 147,181 km² and ~29.4 million residents, Nepal has a population density of roughly 200 people per km².",
      "In regional geography, Nepal is identified by its ISO code \"NP\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "काठमाडौँ"
  },
  "NR": {
    "id": "NR",
    "iso3": "NRU",
    "name": "Nauru",
    "nativeName": "Naoero / Nauru",
    "capital": "Yaren",
    "continent": "Oceania",
    "subregion": "Micronesia",
    "population": 2520,
    "areaKm2": 21,
    "lat": -0.5477,
    "lng": 166.9209,
    "languages": [
      "English",
      "Nauru"
    ],
    "currencies": [
      "Australian dollar (AUD)"
    ],
    "flagEmoji": "🇳🇷",
    "facts": [
      "Yaren sits near 0.5°S latitude and serves as the political, cultural, and transport hub of Nauru in Micronesia.",
      "With a land area of 21 km² and ~2,520 residents, Nauru has a population density of roughly 120 people per km².",
      "In regional geography, Nauru is identified by its ISO code \"NR\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Yaren"
  },
  "NZ": {
    "id": "NZ",
    "iso3": "NZL",
    "name": "New Zealand",
    "nativeName": "Aotearoa / New Zealand",
    "capital": "Wellington",
    "continent": "Oceania",
    "subregion": "Australia and New Zealand",
    "population": 4510327,
    "areaKm2": 270467,
    "lat": -41.2865,
    "lng": 174.7762,
    "languages": [
      "English",
      "Māori",
      "New Zealand Sign Language"
    ],
    "currencies": [
      "New Zealand dollar (NZD)"
    ],
    "flagEmoji": "🇳🇿",
    "facts": [
      "Before human arrival around 1250–1300 AD, New Zealand had zero native land mammals except for three species of bats.",
      "A hill in Hawke’s Bay—Taumatawhakatangihangakoauauotamateaturipukakapikimaungahoronukupokaiwhenuakitanatahu—holds the world record for the longest single-word place name (85 letters).",
      "Lake Taupō in the North Island sits inside the caldera of the Oruanui supervolcano, which erupted 26,500 years ago."
    ],
    "nativeCapital": "Wellington"
  },
  "OM": {
    "id": "OM",
    "iso3": "OMN",
    "name": "Oman",
    "nativeName": "عُمان",
    "capital": "Muscat",
    "continent": "Asia",
    "subregion": "Western Asia",
    "population": 3424386,
    "areaKm2": 309500,
    "lat": 23.588,
    "lng": 58.3829,
    "languages": [
      "Arabic"
    ],
    "currencies": [
      "Omani rial (OMR)"
    ],
    "flagEmoji": "🇴🇲",
    "facts": [
      "Oman’s Be’ah waste management dumpsters display a large 2-digit municipality code (01 Muscat, 02 Batinah, 03 Musandam, 08 Dhofar), a famous GeoGuessr clue.",
      "Madha is an Omani enclave inside the UAE that itself contains Nahwa, a UAE counter-enclave inside Madha.",
      "Muscat restricts high-rise skyscrapers by royal decree, requiring buildings to remain white or sand-colored with traditional Arabesque arches."
    ],
    "nativeCapital": "مسقط"
  },
  "PK": {
    "id": "PK",
    "iso3": "PAK",
    "name": "Pakistan",
    "nativeName": "پاکستان",
    "capital": "Islamabad",
    "continent": "Asia",
    "subregion": "Southern Asia",
    "population": 204924861,
    "areaKm2": 881912,
    "lat": 33.6844,
    "lng": 73.0479,
    "languages": [
      "English",
      "Urdu"
    ],
    "currencies": [
      "Pakistani rupee (PKR)"
    ],
    "flagEmoji": "🇵🇰",
    "facts": [
      "Pakistan contains five of the world’s fourteen 8,000-meter peaks (including K2 at 8,611 m) where the Karakoram, Himalaya, and Hindu Kush ranges meet.",
      "The Karakoram Highway crosses the Khunjerab Pass at 4,693 meters—the highest paved international border crossing in the world.",
      "Sialkot in Punjab produces over 70% of the world’s hand-stitched FIFA-grade footballs (soccer balls)."
    ],
    "nativeCapital": "اسلام آباد"
  },
  "PA": {
    "id": "PA",
    "iso3": "PAN",
    "name": "Panama",
    "nativeName": "Panamá",
    "capital": "Panama City",
    "continent": "North America",
    "subregion": "Central America",
    "population": 3753142,
    "areaKm2": 75417,
    "lat": 8.9824,
    "lng": -79.5199,
    "languages": [
      "Spanish"
    ],
    "currencies": [
      "Panamanian balboa (PAB)",
      "United States dollar (USD)"
    ],
    "flagEmoji": "🇵🇦",
    "facts": [
      "Because of the S-shaped curve of the Isthmus of Panama, you enter the Panama Canal from the Atlantic (Caribbean) side on the west and exit into the Pacific on the east.",
      "Panama City is the only capital city in the world that has a tropical rainforest (Metropolitan Natural Park) within its city limits.",
      "Panamanian yellow taxis carry large door prefixes indicating their province (8T = Panamá, 3T = Colón, 4T = Chiriquí, 6T = Herrera)."
    ],
    "nativeCapital": "Ciudad de Panamá"
  },
  "PN": {
    "id": "PN",
    "iso3": "PCN",
    "name": "Pitcairn Islands",
    "nativeName": "Pitcairn Islands",
    "capital": "Adamstown",
    "continent": "Oceania",
    "subregion": "Polynesia",
    "population": 5640,
    "areaKm2": 47,
    "lat": -25.0662,
    "lng": -130.1005,
    "languages": [
      "English"
    ],
    "currencies": [
      "New Zealand dollar (NZD)"
    ],
    "flagEmoji": "🇵🇳",
    "facts": [
      "Adamstown sits near 25.1°S latitude and serves as the political, cultural, and transport hub of Pitcairn Islands in Polynesia.",
      "With a land area of 47 km² and ~5,640 residents, Pitcairn Islands has a population density of roughly 120 people per km².",
      "In regional geography, Pitcairn Islands is identified by its ISO code \"PN\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Adamstown"
  },
  "PE": {
    "id": "PE",
    "iso3": "PER",
    "name": "Peru",
    "nativeName": "Perú",
    "capital": "Lima",
    "continent": "South America",
    "subregion": "South America",
    "population": 31036656,
    "areaKm2": 1285216,
    "lat": -12.0464,
    "lng": -77.0428,
    "languages": [
      "Aymara",
      "Quechua",
      "Spanish"
    ],
    "currencies": [
      "Peruvian sol (PEN)"
    ],
    "flagEmoji": "🇵🇪",
    "facts": [
      "Cotahuasi and Colca Canyons in southern Peru are over 3,400 meters deep—roughly twice as deep as the Grand Canyon.",
      "Cerro Blanco near Nazca is one of the tallest sand dunes on Earth, rising 1,176 meters from base to crest.",
      "Potatoes originated in southern Peru around Lake Titicaca over 7,000 years ago, and Peru cultivates more than 3,800 native potato varieties."
    ],
    "nativeCapital": "Lima"
  },
  "PH": {
    "id": "PH",
    "iso3": "PHL",
    "name": "Philippines",
    "nativeName": "Pilipinas",
    "capital": "Manila",
    "continent": "Asia",
    "subregion": "South-Eastern Asia",
    "population": 104256076,
    "areaKm2": 342353,
    "lat": 14.5995,
    "lng": 120.9842,
    "languages": [
      "English",
      "Filipino"
    ],
    "currencies": [
      "Philippine peso (PHP)"
    ],
    "flagEmoji": "🇵🇭",
    "facts": [
      "Taal Volcano on Luzon has a crater lake that contains Vulcan Point—an island inside a lake on an island in a lake on an island.",
      "The Philippines comprises 7,641 islands, with Luzon and Mindanao accounting for two-thirds of the total land area.",
      "The Banaue Rice Terraces in Ifugao were carved by hand into steep mountain slopes over 2,000 years ago."
    ],
    "nativeCapital": "Manila"
  },
  "PW": {
    "id": "PW",
    "iso3": "PLW",
    "name": "Palau",
    "nativeName": "Belau / Palau",
    "capital": "Ngerulmud",
    "continent": "Oceania",
    "subregion": "Micronesia",
    "population": 55080,
    "areaKm2": 459,
    "lat": 7.5004,
    "lng": 134.6243,
    "languages": [
      "English",
      "Palauan"
    ],
    "currencies": [
      "United States dollar (USD)"
    ],
    "flagEmoji": "🇵🇼",
    "facts": [
      "Ngerulmud sits near 7.5°N latitude and serves as the political, cultural, and transport hub of Palau in Micronesia.",
      "With a land area of 459 km² and ~55,080 residents, Palau has a population density of roughly 120 people per km².",
      "In regional geography, Palau is identified by its ISO code \"PW\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Ngerulmud"
  },
  "PG": {
    "id": "PG",
    "iso3": "PNG",
    "name": "Papua New Guinea",
    "nativeName": "Papua Niugini / Papua New Guinea",
    "capital": "Port Moresby",
    "continent": "Oceania",
    "subregion": "Melanesia",
    "population": 6909701,
    "areaKm2": 462840,
    "lat": -9.4438,
    "lng": 147.1803,
    "languages": [
      "English",
      "Hiri Motu",
      "Tok Pisin"
    ],
    "currencies": [
      "Papua New Guinean kina (PGK)"
    ],
    "flagEmoji": "🇵🇬",
    "facts": [
      "Port Moresby sits near 9.4°S latitude and serves as the political, cultural, and transport hub of Papua New Guinea in Melanesia.",
      "With a land area of 462,840 km² and ~6.9 million residents, Papua New Guinea has a population density of roughly 15 people per km².",
      "In regional geography, Papua New Guinea is identified by its ISO code \"PG\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Port Moresby"
  },
  "PL": {
    "id": "PL",
    "iso3": "POL",
    "name": "Poland",
    "nativeName": "Polska",
    "capital": "Warsaw",
    "continent": "Europe",
    "subregion": "Central Europe",
    "population": 38476269,
    "areaKm2": 312679,
    "lat": 52.2297,
    "lng": 21.0122,
    "languages": [
      "Polish"
    ],
    "currencies": [
      "Polish złoty (PLN)"
    ],
    "flagEmoji": "🇵🇱",
    "facts": [
      "Malbork Castle in northern Poland, built by the Teutonic Knights in the 13th century, is the largest castle in the world by land area (over 143,000 m²).",
      "Białowieża Forest on the Poland–Belarus border is home to over 800 wild European bison (żubr), Europe’s heaviest land animal.",
      "The Wieliczka Salt Mine near Kraków has been excavated since the 13th century and features underground cathedrals and chandeliers carved entirely from rock salt."
    ],
    "nativeCapital": "Warszawa"
  },
  "PR": {
    "id": "PR",
    "iso3": "PRI",
    "name": "Puerto Rico",
    "nativeName": "Puerto Rico",
    "capital": "San Juan",
    "continent": "North America",
    "subregion": "Caribbean",
    "population": 3351827,
    "areaKm2": 8870,
    "lat": 18.4655,
    "lng": -66.1057,
    "languages": [
      "English",
      "Spanish"
    ],
    "currencies": [
      "United States dollar (USD)"
    ],
    "flagEmoji": "🇵🇷",
    "facts": [
      "San Juan sits near 18.5°N latitude and serves as the political, cultural, and transport hub of Puerto Rico in Caribbean.",
      "With a land area of 8,870 km² and ~3.4 million residents, Puerto Rico has a population density of roughly 378 people per km².",
      "In regional geography, Puerto Rico is identified by its ISO code \"PR\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "San Juan"
  },
  "KP": {
    "id": "KP",
    "iso3": "PRK",
    "name": "North Korea",
    "nativeName": "조선민주주의인민공화국",
    "capital": "Pyongyang",
    "continent": "Asia",
    "subregion": "Eastern Asia",
    "population": 25248140,
    "areaKm2": 120538,
    "lat": 39.0392,
    "lng": 125.7625,
    "languages": [
      "Korean"
    ],
    "currencies": [
      "North Korean won (KPW)"
    ],
    "flagEmoji": "🇰🇵",
    "facts": [
      "Pyongyang sits near 39.0°N latitude and serves as the political, cultural, and transport hub of North Korea in Eastern Asia.",
      "With a land area of 120,538 km² and ~25.2 million residents, North Korea has a population density of roughly 209 people per km².",
      "In regional geography, North Korea is identified by its ISO code \"KP\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "평양"
  },
  "PT": {
    "id": "PT",
    "iso3": "PRT",
    "name": "Portugal",
    "nativeName": "Portugal",
    "capital": "Lisbon",
    "continent": "Europe",
    "subregion": "Southern Europe",
    "population": 10839514,
    "areaKm2": 92090,
    "lat": 38.7223,
    "lng": -9.1393,
    "languages": [
      "Portuguese"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇵🇹",
    "facts": [
      "The Anglo-Portuguese Alliance of 1373 (Treaty of Windsor) is the oldest diplomatic alliance in the world still in force today.",
      "Portugal produces over 50% of the world’s cork from evergreen cork oak (sobreiro) forests that are harvested without cutting down the trees.",
      "Cabo da Roca near Sintra is the westernmost point of continental Europe."
    ],
    "nativeCapital": "Lisboa"
  },
  "PY": {
    "id": "PY",
    "iso3": "PRY",
    "name": "Paraguay",
    "nativeName": "Paraguay / Paraguái",
    "capital": "Asunción",
    "continent": "South America",
    "subregion": "South America",
    "population": 6943739,
    "areaKm2": 406752,
    "lat": -25.2637,
    "lng": -57.5759,
    "languages": [
      "Guaraní",
      "Spanish"
    ],
    "currencies": [
      "Paraguayan guaraní (PYG)"
    ],
    "flagEmoji": "🇵🇾",
    "facts": [
      "Asunción sits near 25.3°S latitude and serves as the political, cultural, and transport hub of Paraguay in South America.",
      "With a land area of 406,752 km² and ~6.9 million residents, Paraguay has a population density of roughly 17 people per km².",
      "In regional geography, Paraguay is identified by its ISO code \"PY\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Asunción"
  },
  "PS": {
    "id": "PS",
    "iso3": "PSE",
    "name": "Palestine",
    "nativeName": "فلسطين",
    "capital": "Ramallah",
    "continent": "Asia",
    "subregion": "Western Asia",
    "population": 4543126,
    "areaKm2": 6220,
    "lat": 31.9038,
    "lng": 35.2034,
    "languages": [
      "Arabic"
    ],
    "currencies": [
      "Egyptian pound (EGP)",
      "Israeli new shekel (ILS)",
      "Jordanian dinar (JOD)"
    ],
    "flagEmoji": "🇵🇸",
    "facts": [
      "Ramallah sits near 31.9°N latitude and serves as the political, cultural, and transport hub of Palestine in Western Asia.",
      "With a land area of 6,220 km² and ~4.5 million residents, Palestine has a population density of roughly 730 people per km².",
      "In regional geography, Palestine is identified by its ISO code \"PS\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "رام الله / القدس"
  },
  "PF": {
    "id": "PF",
    "iso3": "PYF",
    "name": "French Polynesia",
    "nativeName": "Polynésie française",
    "capital": "Papeetē",
    "continent": "Oceania",
    "subregion": "Polynesia",
    "population": 500040,
    "areaKm2": 4167,
    "lat": -17.5516,
    "lng": -149.5585,
    "languages": [
      "French"
    ],
    "currencies": [
      "CFP franc (XPF)"
    ],
    "flagEmoji": "🇵🇫",
    "facts": [
      "Papeetē sits near 17.6°S latitude and serves as the political, cultural, and transport hub of French Polynesia in Polynesia.",
      "With a land area of 4,167 km² and ~500,040 residents, French Polynesia has a population density of roughly 120 people per km².",
      "In regional geography, French Polynesia is identified by its ISO code \"PF\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Papeete"
  },
  "QA": {
    "id": "QA",
    "iso3": "QAT",
    "name": "Qatar",
    "nativeName": "قطر",
    "capital": "Doha",
    "continent": "Asia",
    "subregion": "Western Asia",
    "population": 2314307,
    "areaKm2": 11586,
    "lat": 25.2854,
    "lng": 51.531,
    "languages": [
      "Arabic"
    ],
    "currencies": [
      "Qatari riyal (QAR)"
    ],
    "flagEmoji": "🇶🇦",
    "facts": [
      "Doha sits near 25.3°N latitude and serves as the political, cultural, and transport hub of Qatar in Western Asia.",
      "With a land area of 11,586 km² and ~2.3 million residents, Qatar has a population density of roughly 200 people per km².",
      "In regional geography, Qatar is identified by its ISO code \"QA\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "الدوحة"
  },
  "RE": {
    "id": "RE",
    "iso3": "REU",
    "name": "Réunion",
    "nativeName": "La Réunion",
    "capital": "Saint-Denis",
    "continent": "Africa",
    "subregion": "Eastern Africa",
    "population": 301320,
    "areaKm2": 2511,
    "lat": -20.8823,
    "lng": 55.4504,
    "languages": [
      "French"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇷🇪",
    "facts": [
      "Saint-Denis sits near 20.9°S latitude and serves as the political, cultural, and transport hub of Réunion in Eastern Africa.",
      "With a land area of 2,511 km² and ~301,320 residents, Réunion has a population density of roughly 120 people per km².",
      "In regional geography, Réunion is identified by its ISO code \"RE\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Saint-Denis"
  },
  "RO": {
    "id": "RO",
    "iso3": "ROU",
    "name": "Romania",
    "nativeName": "România",
    "capital": "Bucharest",
    "continent": "Europe",
    "subregion": "Southeast Europe",
    "population": 21529967,
    "areaKm2": 238391,
    "lat": 44.4268,
    "lng": 26.1025,
    "languages": [
      "Romanian"
    ],
    "currencies": [
      "Romanian leu (RON)"
    ],
    "flagEmoji": "🇷🇴",
    "facts": [
      "The Palace of the Parliament in Bucharest is the heaviest building on Earth (4.1 million tonnes) and the largest administrative building after the Pentagon.",
      "Romania’s Danube Delta is the best-preserved river delta in Europe, home to over 300 species of birds.",
      "The Transfăgărășan highway climbs to 2,042 m across the Southern Carpathians through 90 km of hairpin turns."
    ],
    "nativeCapital": "București"
  },
  "RU": {
    "id": "RU",
    "iso3": "RUS",
    "name": "Russia",
    "nativeName": "Россия",
    "capital": "Moscow",
    "continent": "Europe",
    "subregion": "Eastern Europe",
    "population": 142257519,
    "areaKm2": 17098242,
    "lat": 55.7558,
    "lng": 37.6173,
    "languages": [
      "Russian"
    ],
    "currencies": [
      "Russian ruble (RUB)"
    ],
    "flagEmoji": "🇷🇺",
    "facts": [
      "Lake Baikal in Siberia is the oldest (25 million years) and deepest (1,642 m) lake on Earth, holding 20% of the world’s unfrozen surface freshwater.",
      "The Trans-Siberian Railway spans 9,289 km and 8 time zones from Moscow to Vladivostok—the longest single railway line in the world.",
      "Kaliningrad Oblast is a Russian exclave on the Baltic Sea sandwiched between Poland and Lithuania."
    ],
    "nativeCapital": "Москва"
  },
  "RW": {
    "id": "RW",
    "iso3": "RWA",
    "name": "Rwanda",
    "nativeName": "Rwanda",
    "capital": "Kigali",
    "continent": "Africa",
    "subregion": "Eastern Africa",
    "population": 11901484,
    "areaKm2": 26338,
    "lat": -1.9403,
    "lng": 29.8739,
    "languages": [
      "English",
      "French",
      "Kinyarwanda"
    ],
    "currencies": [
      "Rwandan franc (RWF)"
    ],
    "flagEmoji": "🇷🇼",
    "facts": [
      "Known as the Land of a Thousand Hills (Mille Collines), Rwanda banned single-use plastic bags nationwide back in 2008.",
      "On the last Saturday of every month, Rwandans participate in Umuganda, a nationwide morning of community clean-up during which regular traffic pauses.",
      "Volcanoes National Park in northern Rwanda is one of only three places on Earth where endangered mountain gorillas live."
    ],
    "nativeCapital": "Kigali"
  },
  "SA": {
    "id": "SA",
    "iso3": "SAU",
    "name": "Saudi Arabia",
    "nativeName": "المملكة العربية السعودية",
    "capital": "Riyadh",
    "continent": "Asia",
    "subregion": "Western Asia",
    "population": 28571770,
    "areaKm2": 2149690,
    "lat": 24.7136,
    "lng": 46.6753,
    "languages": [
      "Arabic"
    ],
    "currencies": [
      "Saudi riyal (SAR)"
    ],
    "flagEmoji": "🇸🇦",
    "facts": [
      "Saudi Arabia is the largest country in the world without a single permanent natural river.",
      "The Rub’ al Khali (Empty Quarter) in southern Saudi Arabia is the largest contiguous sand desert on Earth (650,000 km²).",
      "Al-Ahsa Oasis in Eastern Province is the largest natural oasis in the world, with over 2.5 million date palms."
    ],
    "nativeCapital": "الرياض"
  },
  "SD": {
    "id": "SD",
    "iso3": "SDN",
    "name": "Sudan",
    "nativeName": "السودان",
    "capital": "Khartoum",
    "continent": "Africa",
    "subregion": "Northern Africa",
    "population": 37345935,
    "areaKm2": 1886068,
    "lat": 15.5007,
    "lng": 32.5599,
    "languages": [
      "Arabic",
      "English"
    ],
    "currencies": [
      "Sudanese pound (SDG)"
    ],
    "flagEmoji": "🇸🇩",
    "facts": [
      "Khartoum sits near 15.5°N latitude and serves as the political, cultural, and transport hub of Sudan in Northern Africa.",
      "With a land area of 1,886,068 km² and ~37.3 million residents, Sudan has a population density of roughly 20 people per km².",
      "In regional geography, Sudan is identified by its ISO code \"SD\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "الخرطوم"
  },
  "SN": {
    "id": "SN",
    "iso3": "SEN",
    "name": "Senegal",
    "nativeName": "Sénégal",
    "capital": "Dakar",
    "continent": "Africa",
    "subregion": "Western Africa",
    "population": 14668522,
    "areaKm2": 196722,
    "lat": 14.7167,
    "lng": -17.4677,
    "languages": [
      "French"
    ],
    "currencies": [
      "West African CFA franc (XOF)"
    ],
    "flagEmoji": "🇸🇳",
    "facts": [
      "Lake Retba (Lac Rose) near Dakar turns vivid strawberry-pink in the dry season due to salt-loving Dunaliella salina algae.",
      "Senegal completely surrounds The Gambia on three sides except for Gambia’s narrow Atlantic coastline.",
      "Saint-Louis at the mouth of the Senegal River features the Faidherbe Bridge originally designed by Gustave Eiffel’s workshop."
    ],
    "nativeCapital": "Dakar"
  },
  "SG": {
    "id": "SG",
    "iso3": "SGP",
    "name": "Singapore",
    "nativeName": "Singapore / 新加坡 / Singapura / சிங்கப்பூர்",
    "capital": "Singapore",
    "continent": "Asia",
    "subregion": "South-Eastern Asia",
    "population": 85200,
    "areaKm2": 710,
    "lat": 1.3521,
    "lng": 103.8198,
    "languages": [
      "English",
      "Malay",
      "Tamil",
      "Chinese"
    ],
    "currencies": [
      "Singapore dollar (SGD)"
    ],
    "flagEmoji": "🇸🇬",
    "facts": [
      "Since 1965, Singapore has expanded its land area by nearly 25% through land reclamation from the sea.",
      "Bukit Timah Nature Reserve (only 1.64 km²) contains more tree species than the entire North American continent.",
      "Singapore is one of only three surviving sovereign city-states in the world (alongside Monaco and Vatican City)."
    ],
    "nativeCapital": "Singapore / 新加坡"
  },
  "GS": {
    "id": "GS",
    "iso3": "SGS",
    "name": "South Georgia",
    "nativeName": "South Georgia and the South Sandwich Islands",
    "capital": "King Edward Point",
    "continent": "Europe",
    "subregion": "",
    "population": 468360,
    "areaKm2": 3903,
    "lat": -54.2833,
    "lng": -36.5,
    "languages": [
      "English"
    ],
    "currencies": [
      "Saint Helena pound (SHP)"
    ],
    "flagEmoji": "🇬🇸",
    "facts": [
      "King Edward Point sits near 54.3°S latitude and serves as the political, cultural, and transport hub of South Georgia in its region.",
      "With a land area of 3,903 km² and ~468,360 residents, South Georgia has a population density of roughly 120 people per km².",
      "In regional geography, South Georgia is identified by its ISO code \"GS\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Grytviken"
  },
  "SJ": {
    "id": "SJ",
    "iso3": "SJM",
    "name": "Svalbard and Jan Mayen",
    "nativeName": "Svalbard og Jan Mayen",
    "capital": "Longyearbyen",
    "continent": "Europe",
    "subregion": "Northern Europe",
    "population": 1000,
    "areaKm2": -1,
    "lat": 78.2232,
    "lng": 15.6267,
    "languages": [
      "Norwegian"
    ],
    "currencies": [
      "krone (NOK)"
    ],
    "flagEmoji": "🇸🇯",
    "facts": [
      "Longyearbyen sits near 78.2°N latitude and serves as the political, cultural, and transport hub of Svalbard and Jan Mayen in Northern Europe.",
      "With a land area of 10,000 km² and ~1,000 residents, Svalbard and Jan Mayen has a population density of roughly 1 people per km².",
      "In regional geography, Svalbard and Jan Mayen is identified by its ISO code \"SJ\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Longyearbyen"
  },
  "SB": {
    "id": "SB",
    "iso3": "SLB",
    "name": "Solomon Islands",
    "nativeName": "Solomon Islands",
    "capital": "Honiara",
    "continent": "Oceania",
    "subregion": "Melanesia",
    "population": 647581,
    "areaKm2": 28896,
    "lat": -9.4456,
    "lng": 159.9729,
    "languages": [
      "English"
    ],
    "currencies": [
      "Solomon Islands dollar (SBD)"
    ],
    "flagEmoji": "🇸🇧",
    "facts": [
      "Honiara sits near 9.4°S latitude and serves as the political, cultural, and transport hub of Solomon Islands in Melanesia.",
      "With a land area of 28,896 km² and ~647,581 residents, Solomon Islands has a population density of roughly 22 people per km².",
      "In regional geography, Solomon Islands is identified by its ISO code \"SB\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Honiara"
  },
  "SL": {
    "id": "SL",
    "iso3": "SLE",
    "name": "Sierra Leone",
    "nativeName": "Sierra Leone",
    "capital": "Freetown",
    "continent": "Africa",
    "subregion": "Western Africa",
    "population": 6163195,
    "areaKm2": 71740,
    "lat": 8.4657,
    "lng": -13.2317,
    "languages": [
      "English"
    ],
    "currencies": [
      "Sierra Leonean leone (SLE)"
    ],
    "flagEmoji": "🇸🇱",
    "facts": [
      "Freetown sits near 8.5°N latitude and serves as the political, cultural, and transport hub of Sierra Leone in Western Africa.",
      "With a land area of 71,740 km² and ~6.2 million residents, Sierra Leone has a population density of roughly 86 people per km².",
      "In regional geography, Sierra Leone is identified by its ISO code \"SL\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Freetown"
  },
  "SV": {
    "id": "SV",
    "iso3": "SLV",
    "name": "El Salvador",
    "nativeName": "El Salvador",
    "capital": "San Salvador",
    "continent": "North America",
    "subregion": "Central America",
    "population": 6172011,
    "areaKm2": 21041,
    "lat": 13.6929,
    "lng": -89.2182,
    "languages": [
      "Spanish"
    ],
    "currencies": [
      "United States dollar (USD)"
    ],
    "flagEmoji": "🇸🇻",
    "facts": [
      "San Salvador sits near 13.7°N latitude and serves as the political, cultural, and transport hub of El Salvador in Central America.",
      "With a land area of 21,041 km² and ~6.2 million residents, El Salvador has a population density of roughly 293 people per km².",
      "In regional geography, El Salvador is identified by its ISO code \"SV\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "San Salvador"
  },
  "SM": {
    "id": "SM",
    "iso3": "SMR",
    "name": "San Marino",
    "nativeName": "San Marino",
    "capital": "City of San Marino",
    "continent": "Europe",
    "subregion": "Southern Europe",
    "population": 7320,
    "areaKm2": 61,
    "lat": 43.9356,
    "lng": 12.4473,
    "languages": [
      "Italian"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇸🇲",
    "facts": [
      "City of San Marino sits near 43.9°N latitude and serves as the political, cultural, and transport hub of San Marino in Southern Europe.",
      "With a land area of 61 km² and ~7,320 residents, San Marino has a population density of roughly 120 people per km².",
      "In regional geography, San Marino is identified by its ISO code \"SM\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "San Marino"
  },
  "SO": {
    "id": "SO",
    "iso3": "SOM",
    "name": "Somalia",
    "nativeName": "Soomaaliya / الصومال",
    "capital": "Mogadishu",
    "continent": "Africa",
    "subregion": "Eastern Africa",
    "population": 7531386,
    "areaKm2": 637657,
    "lat": 2.0469,
    "lng": 45.3182,
    "languages": [
      "Arabic",
      "Somali"
    ],
    "currencies": [
      "Somali shilling (SOS)"
    ],
    "flagEmoji": "🇸🇴",
    "facts": [
      "Mogadishu sits near 2.0°N latitude and serves as the political, cultural, and transport hub of Somalia in Eastern Africa.",
      "With a land area of 637,657 km² and ~7.5 million residents, Somalia has a population density of roughly 12 people per km².",
      "In regional geography, Somalia is identified by its ISO code \"SO\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Muqdisho / مقديشو"
  },
  "PM": {
    "id": "PM",
    "iso3": "SPM",
    "name": "Saint Pierre and Miquelon",
    "nativeName": "Saint-Pierre-et-Miquelon",
    "capital": "Saint-Pierre",
    "continent": "North America",
    "subregion": "North America",
    "population": 29040,
    "areaKm2": 242,
    "lat": 46.7778,
    "lng": -56.1778,
    "languages": [
      "French"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇵🇲",
    "facts": [
      "Saint-Pierre sits near 46.8°N latitude and serves as the political, cultural, and transport hub of Saint Pierre and Miquelon in North America.",
      "With a land area of 242 km² and ~29,040 residents, Saint Pierre and Miquelon has a population density of roughly 120 people per km².",
      "In regional geography, Saint Pierre and Miquelon is identified by its ISO code \"PM\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Saint-Pierre"
  },
  "RS": {
    "id": "RS",
    "iso3": "SRB",
    "name": "Serbia",
    "nativeName": "Србија",
    "capital": "Belgrade",
    "continent": "Europe",
    "subregion": "Southeast Europe",
    "population": 7111024,
    "areaKm2": 88361,
    "lat": 44.7866,
    "lng": 20.4489,
    "languages": [
      "Serbian"
    ],
    "currencies": [
      "Serbian dinar (RSD)"
    ],
    "flagEmoji": "🇷🇸",
    "facts": [
      "Over 17 Roman Emperors—including Constantine the Great (born in Niš)—were born on the territory of modern-day Serbia.",
      "Serbia dynamically uses both the Cyrillic and Latin alphabets side-by-side on road signs, newspapers, and shopfronts.",
      "The Iron Gates Gorge (Đerdap) where the Danube forms the Serbia–Romania border is the longest breakthrough gorge in Europe."
    ],
    "nativeCapital": "Београд"
  },
  "SS": {
    "id": "SS",
    "iso3": "SSD",
    "name": "South Sudan",
    "nativeName": "South Sudan",
    "capital": "Juba",
    "continent": "Africa",
    "subregion": "Middle Africa",
    "population": 13026129,
    "areaKm2": 619745,
    "lat": 4.8594,
    "lng": 31.5713,
    "languages": [
      "English"
    ],
    "currencies": [
      "South Sudanese pound (SSP)"
    ],
    "flagEmoji": "🇸🇸",
    "facts": [
      "Juba sits near 4.9°N latitude and serves as the political, cultural, and transport hub of South Sudan in Middle Africa.",
      "With a land area of 619,745 km² and ~13.0 million residents, South Sudan has a population density of roughly 21 people per km².",
      "In regional geography, South Sudan is identified by its ISO code \"SS\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Juba"
  },
  "ST": {
    "id": "ST",
    "iso3": "STP",
    "name": "São Tomé and Príncipe",
    "nativeName": "São Tomé e Príncipe",
    "capital": "São Tomé",
    "continent": "Africa",
    "subregion": "Middle Africa",
    "population": 115680,
    "areaKm2": 964,
    "lat": 0.3365,
    "lng": 6.7273,
    "languages": [
      "Portuguese"
    ],
    "currencies": [
      "São Tomé and Príncipe dobra (STN)"
    ],
    "flagEmoji": "🇸🇹",
    "facts": [
      "São Tomé sits near 0.3°N latitude and serves as the political, cultural, and transport hub of São Tomé and Príncipe in Middle Africa.",
      "With a land area of 964 km² and ~115,680 residents, São Tomé and Príncipe has a population density of roughly 120 people per km².",
      "In regional geography, São Tomé and Príncipe is identified by its ISO code \"ST\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "São Tomé"
  },
  "SR": {
    "id": "SR",
    "iso3": "SUR",
    "name": "Suriname",
    "nativeName": "Suriname",
    "capital": "Paramaribo",
    "continent": "South America",
    "subregion": "South America",
    "population": 591919,
    "areaKm2": 163820,
    "lat": 5.852,
    "lng": -55.2038,
    "languages": [
      "Dutch"
    ],
    "currencies": [
      "Surinamese dollar (SRD)"
    ],
    "flagEmoji": "🇸🇷",
    "facts": [
      "Paramaribo sits near 5.9°N latitude and serves as the political, cultural, and transport hub of Suriname in South America.",
      "With a land area of 163,820 km² and ~591,919 residents, Suriname has a population density of roughly 4 people per km².",
      "In regional geography, Suriname is identified by its ISO code \"SR\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Paramaribo"
  },
  "SK": {
    "id": "SK",
    "iso3": "SVK",
    "name": "Slovakia",
    "nativeName": "Slovensko",
    "capital": "Bratislava",
    "continent": "Europe",
    "subregion": "Central Europe",
    "population": 5445829,
    "areaKm2": 49037,
    "lat": 48.1486,
    "lng": 17.1077,
    "languages": [
      "Slovak"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇸🇰",
    "facts": [
      "The geographic midpoint of the European continent is claimed near Kremnické Bane in central Slovakia.",
      "Slovakia has over 6,000 karst caves and 180 castles, including Spiš Castle, one of the largest castle ruins in Central Europe.",
      "Čičmany in the Žilina region is famous for dark log houses hand-painted with intricate geometric white lime patterns."
    ],
    "nativeCapital": "Bratislava"
  },
  "SI": {
    "id": "SI",
    "iso3": "SVN",
    "name": "Slovenia",
    "nativeName": "Slovenija",
    "capital": "Ljubljana",
    "continent": "Europe",
    "subregion": "Central Europe",
    "population": 1972126,
    "areaKm2": 20273,
    "lat": 46.0569,
    "lng": 14.5058,
    "languages": [
      "Slovene"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇸🇮",
    "facts": [
      "Lake Bled’s island church and Postojna Cave—home to the blind cave salamander (olm or human fish)—are Slovenia’s most famous landmarks.",
      "Over 60% of Slovenia is covered by forest, making it the third most forested country in Europe after Finland and Sweden.",
      "Every house in Slovenia displays a distinctive colored address plaque whose border color varies by municipality."
    ],
    "nativeCapital": "Ljubljana"
  },
  "SE": {
    "id": "SE",
    "iso3": "SWE",
    "name": "Sweden",
    "nativeName": "Sverige",
    "capital": "Stockholm",
    "continent": "Europe",
    "subregion": "Northern Europe",
    "population": 9960487,
    "areaKm2": 450295,
    "lat": 59.3293,
    "lng": 18.0686,
    "languages": [
      "Swedish"
    ],
    "currencies": [
      "Swedish krona (SEK)"
    ],
    "flagEmoji": "🇸🇪",
    "facts": [
      "Sweden has the highest number of islands of any country in the world—267,570 islands, including over 30,000 in the Stockholm Archipelago alone.",
      "Freedom to Roam (Allemansrätten) is enshrined in Sweden’s constitution, allowing anyone to hike, kayak, and camp across nature.",
      "Kiruna in Swedish Lapland is relocating its entire town center 3 km east because the world’s largest underground iron-ore mine runs beneath it."
    ],
    "nativeCapital": "Stockholm"
  },
  "SZ": {
    "id": "SZ",
    "iso3": "SWZ",
    "name": "Eswatini",
    "nativeName": "eSwatini",
    "capital": "Lobamba",
    "continent": "Africa",
    "subregion": "Southern Africa",
    "population": 1467152,
    "areaKm2": 17364,
    "lat": -26.3054,
    "lng": 31.1367,
    "languages": [
      "English",
      "Swazi"
    ],
    "currencies": [
      "Swazi lilangeni (SZL)",
      "South African rand (ZAR)"
    ],
    "flagEmoji": "🇸🇿",
    "facts": [
      "Lobamba sits near 26.3°S latitude and serves as the political, cultural, and transport hub of Eswatini in Southern Africa.",
      "With a land area of 17,364 km² and ~1.5 million residents, Eswatini has a population density of roughly 84 people per km².",
      "In regional geography, Eswatini is identified by its ISO code \"SZ\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Mbabane"
  },
  "SX": {
    "id": "SX",
    "iso3": "SXM",
    "name": "Sint Maarten",
    "nativeName": "Sint Maarten",
    "capital": "Philipsburg",
    "continent": "North America",
    "subregion": "Caribbean",
    "population": 4080,
    "areaKm2": 34,
    "lat": 18.026,
    "lng": -63.0458,
    "languages": [
      "English",
      "French",
      "Dutch"
    ],
    "currencies": [
      "Caribbean guilder (XCG)"
    ],
    "flagEmoji": "🇸🇽",
    "facts": [
      "Philipsburg sits near 18.0°N latitude and serves as the political, cultural, and transport hub of Sint Maarten in Caribbean.",
      "With a land area of 34 km² and ~4,080 residents, Sint Maarten has a population density of roughly 120 people per km².",
      "In regional geography, Sint Maarten is identified by its ISO code \"SX\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Philipsburg"
  },
  "SC": {
    "id": "SC",
    "iso3": "SYC",
    "name": "Seychelles",
    "nativeName": "Sesel / Seychelles",
    "capital": "Victoria",
    "continent": "Africa",
    "subregion": "Eastern Africa",
    "population": 54240,
    "areaKm2": 452,
    "lat": -4.6191,
    "lng": 55.4513,
    "languages": [
      "Seychellois Creole",
      "English",
      "French"
    ],
    "currencies": [
      "Seychellois rupee (SCR)"
    ],
    "flagEmoji": "🇸🇨",
    "facts": [
      "Victoria sits near 4.6°S latitude and serves as the political, cultural, and transport hub of Seychelles in Eastern Africa.",
      "With a land area of 452 km² and ~54,240 residents, Seychelles has a population density of roughly 120 people per km².",
      "In regional geography, Seychelles is identified by its ISO code \"SC\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Victoria"
  },
  "SY": {
    "id": "SY",
    "iso3": "SYR",
    "name": "Syria",
    "nativeName": "سوريا",
    "capital": "Damascus",
    "continent": "Asia",
    "subregion": "Western Asia",
    "population": 18028549,
    "areaKm2": 185180,
    "lat": 33.5138,
    "lng": 36.2765,
    "languages": [
      "Arabic"
    ],
    "currencies": [
      "Syrian pound (SYP)"
    ],
    "flagEmoji": "🇸🇾",
    "facts": [
      "Damascus sits near 33.5°N latitude and serves as the political, cultural, and transport hub of Syria in Western Asia.",
      "With a land area of 185,180 km² and ~18.0 million residents, Syria has a population density of roughly 97 people per km².",
      "In regional geography, Syria is identified by its ISO code \"SY\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "دمشق"
  },
  "TC": {
    "id": "TC",
    "iso3": "TCA",
    "name": "Turks and Caicos Islands",
    "nativeName": "Turks and Caicos Islands",
    "capital": "Cockburn Town",
    "continent": "North America",
    "subregion": "Caribbean",
    "population": 113760,
    "areaKm2": 948,
    "lat": 21.4675,
    "lng": -71.1389,
    "languages": [
      "English"
    ],
    "currencies": [
      "United States dollar (USD)"
    ],
    "flagEmoji": "🇹🇨",
    "facts": [
      "Cockburn Town sits near 21.5°N latitude and serves as the political, cultural, and transport hub of Turks and Caicos Islands in Caribbean.",
      "With a land area of 948 km² and ~113,760 residents, Turks and Caicos Islands has a population density of roughly 120 people per km².",
      "In regional geography, Turks and Caicos Islands is identified by its ISO code \"TC\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Cockburn Town"
  },
  "TD": {
    "id": "TD",
    "iso3": "TCD",
    "name": "Chad",
    "nativeName": "Tchad / تشاد",
    "capital": "N'Djamena",
    "continent": "Africa",
    "subregion": "Middle Africa",
    "population": 12075985,
    "areaKm2": 1284000,
    "lat": 12.1348,
    "lng": 15.0557,
    "languages": [
      "Arabic",
      "French"
    ],
    "currencies": [
      "Central African CFA franc (XAF)"
    ],
    "flagEmoji": "🇹🇩",
    "facts": [
      "N'Djamena sits near 12.1°N latitude and serves as the political, cultural, and transport hub of Chad in Middle Africa.",
      "With a land area of 1,284,000 km² and ~12.1 million residents, Chad has a population density of roughly 9 people per km².",
      "In regional geography, Chad is identified by its ISO code \"TD\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "N'Djaména / أنجمينا"
  },
  "TG": {
    "id": "TG",
    "iso3": "TGO",
    "name": "Togo",
    "nativeName": "Togo",
    "capital": "Lomé",
    "continent": "Africa",
    "subregion": "Western Africa",
    "population": 7965055,
    "areaKm2": 56785,
    "lat": 6.1375,
    "lng": 1.2123,
    "languages": [
      "French"
    ],
    "currencies": [
      "West African CFA franc (XOF)"
    ],
    "flagEmoji": "🇹🇬",
    "facts": [
      "Lomé sits near 6.1°N latitude and serves as the political, cultural, and transport hub of Togo in Western Africa.",
      "With a land area of 56,785 km² and ~8.0 million residents, Togo has a population density of roughly 140 people per km².",
      "In regional geography, Togo is identified by its ISO code \"TG\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Lomé"
  },
  "TH": {
    "id": "TH",
    "iso3": "THA",
    "name": "Thailand",
    "nativeName": "ประเทศไทย",
    "capital": "Bangkok",
    "continent": "Asia",
    "subregion": "South-Eastern Asia",
    "population": 68414135,
    "areaKm2": 513120,
    "lat": 13.7563,
    "lng": 100.5018,
    "languages": [
      "Thai"
    ],
    "currencies": [
      "Thai baht (THB)"
    ],
    "flagEmoji": "🇹🇭",
    "facts": [
      "Bangkok’s full ceremonial Thai name—Krung Thep Mahanakhon...—is 168 letters long, the longest city name in the world.",
      "Thailand is the only Southeast Asian nation that was never colonized by a European power.",
      "Thai concrete kilometer markers (lak kilo) along highways display the route number at the top and distances to upcoming towns in Thai script."
    ],
    "nativeCapital": "กรุงเทพมหานคร"
  },
  "TJ": {
    "id": "TJ",
    "iso3": "TJK",
    "name": "Tajikistan",
    "nativeName": "Тоҷикистон",
    "capital": "Dushanbe",
    "continent": "Asia",
    "subregion": "Central Asia",
    "population": 8468555,
    "areaKm2": 143100,
    "lat": 38.5598,
    "lng": 68.787,
    "languages": [
      "Russian",
      "Tajik"
    ],
    "currencies": [
      "Tajikistani somoni (TJS)"
    ],
    "flagEmoji": "🇹🇯",
    "facts": [
      "Dushanbe sits near 38.6°N latitude and serves as the political, cultural, and transport hub of Tajikistan in Central Asia.",
      "With a land area of 143,100 km² and ~8.5 million residents, Tajikistan has a population density of roughly 59 people per km².",
      "In regional geography, Tajikistan is identified by its ISO code \"TJ\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Душанбе"
  },
  "TK": {
    "id": "TK",
    "iso3": "TKL",
    "name": "Tokelau",
    "nativeName": "Tokelau",
    "capital": "Fakaofo",
    "continent": "Oceania",
    "subregion": "Polynesia",
    "population": 1440,
    "areaKm2": 12,
    "lat": -9.3803,
    "lng": -171.2488,
    "languages": [
      "English",
      "Samoan",
      "Tokelauan"
    ],
    "currencies": [
      "New Zealand dollar (NZD)"
    ],
    "flagEmoji": "🇹🇰",
    "facts": [
      "Fakaofo sits near 9.4°S latitude and serves as the political, cultural, and transport hub of Tokelau in Polynesia.",
      "With a land area of 12 km² and ~1,440 residents, Tokelau has a population density of roughly 120 people per km².",
      "In regional geography, Tokelau is identified by its ISO code \"TK\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Fakaofo"
  },
  "TM": {
    "id": "TM",
    "iso3": "TKM",
    "name": "Turkmenistan",
    "nativeName": "Türkmenistan",
    "capital": "Ashgabat",
    "continent": "Asia",
    "subregion": "Central Asia",
    "population": 5351277,
    "areaKm2": 488100,
    "lat": 37.9601,
    "lng": 58.3261,
    "languages": [
      "Russian",
      "Turkmen"
    ],
    "currencies": [
      "Turkmenistan manat (TMT)"
    ],
    "flagEmoji": "🇹🇲",
    "facts": [
      "Ashgabat sits near 38.0°N latitude and serves as the political, cultural, and transport hub of Turkmenistan in Central Asia.",
      "With a land area of 488,100 km² and ~5.4 million residents, Turkmenistan has a population density of roughly 11 people per km².",
      "In regional geography, Turkmenistan is identified by its ISO code \"TM\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Aşgabat"
  },
  "TL": {
    "id": "TL",
    "iso3": "TLS",
    "name": "Timor-Leste",
    "nativeName": "Timor-Leste",
    "capital": "Dili",
    "continent": "Asia",
    "subregion": "South-Eastern Asia",
    "population": 1291358,
    "areaKm2": 14874,
    "lat": -8.5569,
    "lng": 125.5603,
    "languages": [
      "Portuguese",
      "Tetum"
    ],
    "currencies": [
      "United States dollar (USD)"
    ],
    "flagEmoji": "🇹🇱",
    "facts": [
      "Dili sits near 8.6°S latitude and serves as the political, cultural, and transport hub of Timor-Leste in South-Eastern Asia.",
      "With a land area of 14,874 km² and ~1.3 million residents, Timor-Leste has a population density of roughly 87 people per km².",
      "In regional geography, Timor-Leste is identified by its ISO code \"TL\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Dili"
  },
  "TO": {
    "id": "TO",
    "iso3": "TON",
    "name": "Tonga",
    "nativeName": "Tonga",
    "capital": "Nuku'alofa",
    "continent": "Oceania",
    "subregion": "Polynesia",
    "population": 89640,
    "areaKm2": 747,
    "lat": -21.1393,
    "lng": -175.2018,
    "languages": [
      "English",
      "Tongan"
    ],
    "currencies": [
      "Tongan paʻanga (TOP)"
    ],
    "flagEmoji": "🇹🇴",
    "facts": [
      "Nuku'alofa sits near 21.1°S latitude and serves as the political, cultural, and transport hub of Tonga in Polynesia.",
      "With a land area of 747 km² and ~89,640 residents, Tonga has a population density of roughly 120 people per km².",
      "In regional geography, Tonga is identified by its ISO code \"TO\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Nuku‘alofa"
  },
  "TT": {
    "id": "TT",
    "iso3": "TTO",
    "name": "Trinidad and Tobago",
    "nativeName": "Trinidad and Tobago",
    "capital": "Port of Spain",
    "continent": "North America",
    "subregion": "Caribbean",
    "population": 1218208,
    "areaKm2": 5130,
    "lat": 10.6596,
    "lng": -61.5086,
    "languages": [
      "English"
    ],
    "currencies": [
      "Trinidad and Tobago dollar (TTD)"
    ],
    "flagEmoji": "🇹🇹",
    "facts": [
      "Port of Spain sits near 10.7°N latitude and serves as the political, cultural, and transport hub of Trinidad and Tobago in Caribbean.",
      "With a land area of 5,130 km² and ~1.2 million residents, Trinidad and Tobago has a population density of roughly 237 people per km².",
      "In regional geography, Trinidad and Tobago is identified by its ISO code \"TT\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Port of Spain"
  },
  "TN": {
    "id": "TN",
    "iso3": "TUN",
    "name": "Tunisia",
    "nativeName": "تونس",
    "capital": "Tunis",
    "continent": "Africa",
    "subregion": "Northern Africa",
    "population": 11403800,
    "areaKm2": 163610,
    "lat": 36.8065,
    "lng": 10.1815,
    "languages": [
      "Arabic"
    ],
    "currencies": [
      "Tunisian dinar (TND)"
    ],
    "flagEmoji": "🇹🇳",
    "facts": [
      "Matmata in southern Tunisia is famous for underground troglodyte courtyard homes dug into soft sandstone (used as Luke Skywalker’s home in Star Wars).",
      "Cape Angela near Bizerte in Tunisia is the northernmost point of the entire African continent.",
      "The Roman Amphitheatre of El Jem in Mahdia governorate is one of the largest and best-preserved Roman colosseums in the world."
    ],
    "nativeCapital": "تونس"
  },
  "TR": {
    "id": "TR",
    "iso3": "TUR",
    "name": "Türkiye",
    "nativeName": "Türkiye",
    "capital": "Ankara",
    "continent": "Asia",
    "subregion": "Western Asia",
    "population": 80845215,
    "areaKm2": 783562,
    "lat": 39.9334,
    "lng": 32.8597,
    "languages": [
      "Turkish"
    ],
    "currencies": [
      "Turkish lira (TRY)"
    ],
    "flagEmoji": "🇹🇷",
    "facts": [
      "Istanbul is the only major metropolis in the world straddling two continents—Europe and Asia—across the Bosphorus Strait.",
      "Göbekli Tepe in Şanlıurfa (southeastern Turkey) dates to ~9500 BC, making it the oldest known megalithic temple complex on Earth.",
      "Turkey’s 81 provinces are numbered 01 (Adana) to 67 alphabetically, with newer provinces 68–81 (Düzce) added chronologically."
    ],
    "nativeCapital": "Ankara"
  },
  "TV": {
    "id": "TV",
    "iso3": "TUV",
    "name": "Tuvalu",
    "nativeName": "Tuvalu",
    "capital": "Funafuti",
    "continent": "Oceania",
    "subregion": "Polynesia",
    "population": 3120,
    "areaKm2": 26,
    "lat": -8.5211,
    "lng": 179.1962,
    "languages": [
      "English",
      "Tuvaluan"
    ],
    "currencies": [
      "Australian dollar (AUD)",
      "Tuvaluan dollar (TVD)"
    ],
    "flagEmoji": "🇹🇻",
    "facts": [
      "Funafuti sits near 8.5°S latitude and serves as the political, cultural, and transport hub of Tuvalu in Polynesia.",
      "With a land area of 26 km² and ~3,120 residents, Tuvalu has a population density of roughly 120 people per km².",
      "In regional geography, Tuvalu is identified by its ISO code \"TV\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Funafuti"
  },
  "TW": {
    "id": "TW",
    "iso3": "TWN",
    "name": "Taiwan",
    "nativeName": "臺灣",
    "capital": "Taipei",
    "continent": "Asia",
    "subregion": "Eastern Asia",
    "population": 23508428,
    "areaKm2": 36193,
    "lat": 25.033,
    "lng": 121.5654,
    "languages": [
      "Chinese"
    ],
    "currencies": [
      "New Taiwan dollar (TWD)"
    ],
    "flagEmoji": "🇹🇼",
    "facts": [
      "Taiwan has the highest density of high mountains in the world, with 286 peaks exceeding 3,000 meters on an island only 394 km long.",
      "Utility poles throughout Taiwan carry black-and-yellow diagonal hazard stripes all the way to the ground and blue electricity grid coordinate plaques.",
      "Trash trucks in Taiwan play Beethoven’s Für Elise or A Maiden’s Prayer through loudspeakers to signal residents to bring out their waste."
    ],
    "nativeCapital": "臺北"
  },
  "TZ": {
    "id": "TZ",
    "iso3": "TZA",
    "name": "Tanzania",
    "nativeName": "Tanzania",
    "capital": "Dodoma",
    "continent": "Africa",
    "subregion": "Eastern Africa",
    "population": 53950935,
    "areaKm2": 945087,
    "lat": -6.163,
    "lng": 35.7516,
    "languages": [
      "English",
      "Swahili"
    ],
    "currencies": [
      "Tanzanian shilling (TZS)"
    ],
    "flagEmoji": "🇹🇿",
    "facts": [
      "Dodoma sits near 6.2°S latitude and serves as the political, cultural, and transport hub of Tanzania in Eastern Africa.",
      "With a land area of 945,087 km² and ~54.0 million residents, Tanzania has a population density of roughly 57 people per km².",
      "In regional geography, Tanzania is identified by its ISO code \"TZ\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Dodoma"
  },
  "UG": {
    "id": "UG",
    "iso3": "UGA",
    "name": "Uganda",
    "nativeName": "Uganda",
    "capital": "Kampala",
    "continent": "Africa",
    "subregion": "Eastern Africa",
    "population": 39570125,
    "areaKm2": 241550,
    "lat": 0.3476,
    "lng": 32.5825,
    "languages": [
      "English",
      "Swahili"
    ],
    "currencies": [
      "Ugandan shilling (UGX)"
    ],
    "flagEmoji": "🇺🇬",
    "facts": [
      "Kampala sits near 0.3°N latitude and serves as the political, cultural, and transport hub of Uganda in Eastern Africa.",
      "With a land area of 241,550 km² and ~39.6 million residents, Uganda has a population density of roughly 164 people per km².",
      "In regional geography, Uganda is identified by its ISO code \"UG\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Kampala"
  },
  "UA": {
    "id": "UA",
    "iso3": "UKR",
    "name": "Ukraine",
    "nativeName": "Україна",
    "capital": "Kyiv",
    "continent": "Europe",
    "subregion": "Eastern Europe",
    "population": 44033874,
    "areaKm2": 603500,
    "lat": 50.4501,
    "lng": 30.5234,
    "languages": [
      "Ukrainian"
    ],
    "currencies": [
      "Ukrainian hryvnia (UAH)"
    ],
    "flagEmoji": "🇺🇦",
    "facts": [
      "Arsenalna Station on the Kyiv Metro is the deepest subway station in the world at 105.5 meters (346 feet) underground.",
      "Around 30% of the world’s nutrient-rich black soil (chernozem) is located in Ukraine.",
      "Oleshky Sands in southern Kherson Oblast is the largest sand expanse in Ukraine."
    ],
    "nativeCapital": "Київ"
  },
  "UM": {
    "id": "UM",
    "iso3": "UMI",
    "name": "United States Minor Outlying Islands",
    "nativeName": "U.S. Minor Outlying Islands",
    "capital": "N/A",
    "continent": "North America",
    "subregion": "North America",
    "population": 4104,
    "areaKm2": 34.2,
    "lat": 5.8798,
    "lng": -162.0678,
    "languages": [
      "English"
    ],
    "currencies": [
      "United States dollar (USD)"
    ],
    "flagEmoji": "🇺🇲",
    "facts": [
      "N/A sits near 5.9°N latitude and serves as the political, cultural, and transport hub of United States Minor Outlying Islands in North America.",
      "With a land area of 34 km² and ~4,104 residents, United States Minor Outlying Islands has a population density of roughly 121 people per km².",
      "In regional geography, United States Minor Outlying Islands is identified by its ISO code \"UM\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "N/A"
  },
  "UY": {
    "id": "UY",
    "iso3": "URY",
    "name": "Uruguay",
    "nativeName": "Uruguay",
    "capital": "Montevideo",
    "continent": "South America",
    "subregion": "South America",
    "population": 3360148,
    "areaKm2": 181034,
    "lat": -34.9011,
    "lng": -56.1645,
    "languages": [
      "Spanish"
    ],
    "currencies": [
      "Uruguayan peso (UYU)"
    ],
    "flagEmoji": "🇺🇾",
    "facts": [
      "Uruguay has nearly four times as many cattle (around 12 million) as people (3.4 million), and every cow is tracked with an electronic ear tag.",
      "Uruguay hosted and won the inaugural FIFA World Cup in Montevideo in 1930.",
      "Cabo Polonio on the Atlantic coast has no connection to the national power grid or paved roads; access is only via off-road trucks across giant sand dunes."
    ],
    "nativeCapital": "Montevideo"
  },
  "US": {
    "id": "US",
    "iso3": "USA",
    "name": "United States",
    "nativeName": "United States",
    "capital": "Washington D.C.",
    "continent": "North America",
    "subregion": "North America",
    "population": 326625791,
    "areaKm2": 9372610,
    "lat": 38.9072,
    "lng": -77.0369,
    "languages": [
      "English"
    ],
    "currencies": [
      "United States dollar (USD)"
    ],
    "flagEmoji": "🇺🇸",
    "facts": [
      "Alaska is simultaneously the northernmost, westernmost, and easternmost state in the United States because the Aleutian Islands cross the 180° meridian.",
      "Four Corners (where Utah, Colorado, Arizona, and New Mexico meet at right angles) is the only quadripoint in the United States.",
      "At the closest point in the Bering Strait, Russia’s Big Diomede Island and Alaska’s Little Diomede Island are only 3.8 km (2.4 miles) apart."
    ],
    "nativeCapital": "Washington"
  },
  "UZ": {
    "id": "UZ",
    "iso3": "UZB",
    "name": "Uzbekistan",
    "nativeName": "Oʻzbekiston",
    "capital": "Tashkent",
    "continent": "Asia",
    "subregion": "Central Asia",
    "population": 29748859,
    "areaKm2": 447400,
    "lat": 41.2995,
    "lng": 69.2401,
    "languages": [
      "Russian",
      "Uzbek"
    ],
    "currencies": [
      "Uzbekistani soʻm (UZS)"
    ],
    "flagEmoji": "🇺🇿",
    "facts": [
      "Uzbekistan and Liechtenstein are the only two doubly landlocked countries in the world (surrounded solely by other landlocked countries).",
      "Samarkand, Bukhara, and Khiva were the jewel oasis cities at the heart of the ancient Silk Road.",
      "Tashkent’s Metro, opened in 1977, was the first underground subway in Central Asia, built to withstand major earthquakes."
    ],
    "nativeCapital": "Toshkent"
  },
  "VA": {
    "id": "VA",
    "iso3": "VAT",
    "name": "Vatican City",
    "nativeName": "Città del Vaticano",
    "capital": "Vatican City",
    "continent": "Europe",
    "subregion": "Southern Europe",
    "population": 1000,
    "areaKm2": 0.44,
    "lat": 41.9029,
    "lng": 12.4534,
    "languages": [
      "Italian",
      "Latin"
    ],
    "currencies": [
      "Euro (EUR)"
    ],
    "flagEmoji": "🇻🇦",
    "facts": [
      "Vatican City sits near 41.9°N latitude and serves as the political, cultural, and transport hub of Vatican City in Southern Europe.",
      "With a land area of 0 km² and ~1,000 residents, Vatican City has a population density of roughly 50 people per km².",
      "In regional geography, Vatican City is identified by its ISO code \"VA\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Città del Vaticano"
  },
  "VC": {
    "id": "VC",
    "iso3": "VCT",
    "name": "Saint Vincent and the Grenadines",
    "nativeName": "Saint Vincent and the Grenadines",
    "capital": "Kingstown",
    "continent": "North America",
    "subregion": "Caribbean",
    "population": 46680,
    "areaKm2": 389,
    "lat": 13.16,
    "lng": -61.2248,
    "languages": [
      "English"
    ],
    "currencies": [
      "Eastern Caribbean dollar (XCD)"
    ],
    "flagEmoji": "🇻🇨",
    "facts": [
      "Kingstown sits near 13.2°N latitude and serves as the political, cultural, and transport hub of Saint Vincent and the Grenadines in Caribbean.",
      "With a land area of 389 km² and ~46,680 residents, Saint Vincent and the Grenadines has a population density of roughly 120 people per km².",
      "In regional geography, Saint Vincent and the Grenadines is identified by its ISO code \"VC\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Kingstown"
  },
  "VE": {
    "id": "VE",
    "iso3": "VEN",
    "name": "Venezuela",
    "nativeName": "Venezuela",
    "capital": "Caracas",
    "continent": "South America",
    "subregion": "South America",
    "population": 31304016,
    "areaKm2": 916445,
    "lat": 10.4806,
    "lng": -66.9036,
    "languages": [
      "Spanish"
    ],
    "currencies": [
      "Venezuelan bolívar soberano (VES)"
    ],
    "flagEmoji": "🇻🇪",
    "facts": [
      "Caracas sits near 10.5°N latitude and serves as the political, cultural, and transport hub of Venezuela in South America.",
      "With a land area of 916,445 km² and ~31.3 million residents, Venezuela has a population density of roughly 34 people per km².",
      "In regional geography, Venezuela is identified by its ISO code \"VE\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Caracas"
  },
  "VG": {
    "id": "VG",
    "iso3": "VGB",
    "name": "British Virgin Islands",
    "nativeName": "British Virgin Islands",
    "capital": "Road Town",
    "continent": "North America",
    "subregion": "Caribbean",
    "population": 18120,
    "areaKm2": 151,
    "lat": 18.4286,
    "lng": -64.6185,
    "languages": [
      "English"
    ],
    "currencies": [
      "United States dollar (USD)"
    ],
    "flagEmoji": "🇻🇬",
    "facts": [
      "Road Town sits near 18.4°N latitude and serves as the political, cultural, and transport hub of British Virgin Islands in Caribbean.",
      "With a land area of 151 km² and ~18,120 residents, British Virgin Islands has a population density of roughly 120 people per km².",
      "In regional geography, British Virgin Islands is identified by its ISO code \"VG\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Road Town"
  },
  "VI": {
    "id": "VI",
    "iso3": "VIR",
    "name": "United States Virgin Islands",
    "nativeName": "U.S. Virgin Islands",
    "capital": "Charlotte Amalie",
    "continent": "North America",
    "subregion": "Caribbean",
    "population": 41640,
    "areaKm2": 347,
    "lat": 18.3419,
    "lng": -64.9307,
    "languages": [
      "English"
    ],
    "currencies": [
      "United States dollar (USD)"
    ],
    "flagEmoji": "🇻🇮",
    "facts": [
      "Charlotte Amalie sits near 18.3°N latitude and serves as the political, cultural, and transport hub of United States Virgin Islands in Caribbean.",
      "With a land area of 347 km² and ~41,640 residents, United States Virgin Islands has a population density of roughly 120 people per km².",
      "In regional geography, United States Virgin Islands is identified by its ISO code \"VI\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Charlotte Amalie"
  },
  "VN": {
    "id": "VN",
    "iso3": "VNM",
    "name": "Vietnam",
    "nativeName": "Việt Nam",
    "capital": "Hanoi",
    "continent": "Asia",
    "subregion": "South-Eastern Asia",
    "population": 96160163,
    "areaKm2": 331212,
    "lat": 21.0285,
    "lng": 105.8542,
    "languages": [
      "Vietnamese"
    ],
    "currencies": [
      "Vietnamese đồng (VND)"
    ],
    "flagEmoji": "🇻🇳",
    "facts": [
      "Sơn Đoòng Cave in Quảng Bình province is the largest natural cave passage on Earth by volume, with its own subterranean jungle and weather system.",
      "Hạ Long Bay in northeastern Vietnam features nearly 2,000 towering limestone karst islands rising from emerald waters.",
      "Vietnam is the world’s largest producer of Robusta coffee and black pepper, and second-largest coffee exporter overall after Brazil."
    ],
    "nativeCapital": "Hà Nội"
  },
  "VU": {
    "id": "VU",
    "iso3": "VUT",
    "name": "Vanuatu",
    "nativeName": "Vanuatu",
    "capital": "Port Vila",
    "continent": "Oceania",
    "subregion": "Melanesia",
    "population": 282814,
    "areaKm2": 12189,
    "lat": -17.7333,
    "lng": 168.3273,
    "languages": [
      "Bislama",
      "English",
      "French"
    ],
    "currencies": [
      "Vanuatu vatu (VUV)"
    ],
    "flagEmoji": "🇻🇺",
    "facts": [
      "Port Vila sits near 17.7°S latitude and serves as the political, cultural, and transport hub of Vanuatu in Melanesia.",
      "With a land area of 12,189 km² and ~282,814 residents, Vanuatu has a population density of roughly 23 people per km².",
      "In regional geography, Vanuatu is identified by its ISO code \"VU\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Port-Vila"
  },
  "WF": {
    "id": "WF",
    "iso3": "WLF",
    "name": "Wallis and Futuna",
    "nativeName": "Wallis-et-Futuna",
    "capital": "Mata-Utu",
    "continent": "Oceania",
    "subregion": "Polynesia",
    "population": 17040,
    "areaKm2": 142,
    "lat": -13.2825,
    "lng": -176.1736,
    "languages": [
      "French"
    ],
    "currencies": [
      "CFP franc (XPF)"
    ],
    "flagEmoji": "🇼🇫",
    "facts": [
      "Mata-Utu sits near 13.3°S latitude and serves as the political, cultural, and transport hub of Wallis and Futuna in Polynesia.",
      "With a land area of 142 km² and ~17,040 residents, Wallis and Futuna has a population density of roughly 120 people per km².",
      "In regional geography, Wallis and Futuna is identified by its ISO code \"WF\", local road signage conventions, and administrative subdivisions."
    ],
    "isTerritory": true,
    "nativeCapital": "Mata-Utu"
  },
  "WS": {
    "id": "WS",
    "iso3": "WSM",
    "name": "Samoa",
    "nativeName": "Sāmoa",
    "capital": "Apia",
    "continent": "Oceania",
    "subregion": "Polynesia",
    "population": 341040,
    "areaKm2": 2842,
    "lat": -13.8333,
    "lng": -171.7667,
    "languages": [
      "English",
      "Samoan"
    ],
    "currencies": [
      "Samoan tālā (WST)"
    ],
    "flagEmoji": "🇼🇸",
    "facts": [
      "Apia sits near 13.8°S latitude and serves as the political, cultural, and transport hub of Samoa in Polynesia.",
      "With a land area of 2,842 km² and ~341,040 residents, Samoa has a population density of roughly 120 people per km².",
      "In regional geography, Samoa is identified by its ISO code \"WS\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Apia"
  },
  "YE": {
    "id": "YE",
    "iso3": "YEM",
    "name": "Yemen",
    "nativeName": "اليمن",
    "capital": "Sana'a",
    "continent": "Asia",
    "subregion": "Western Asia",
    "population": 28036829,
    "areaKm2": 527968,
    "lat": 15.3694,
    "lng": 44.191,
    "languages": [
      "Arabic"
    ],
    "currencies": [
      "Yemeni rial (YER)"
    ],
    "flagEmoji": "🇾🇪",
    "facts": [
      "Sana'a sits near 15.4°N latitude and serves as the political, cultural, and transport hub of Yemen in Western Asia.",
      "With a land area of 527,968 km² and ~28.0 million residents, Yemen has a population density of roughly 53 people per km².",
      "In regional geography, Yemen is identified by its ISO code \"YE\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "صنعاء"
  },
  "ZA": {
    "id": "ZA",
    "iso3": "ZAF",
    "name": "South Africa",
    "nativeName": "South Africa / Suid-Afrika / iNingizimu Afrika",
    "capital": "Pretoria",
    "continent": "Africa",
    "subregion": "Southern Africa",
    "population": 54841552,
    "areaKm2": 1221037,
    "lat": -25.7479,
    "lng": 28.2293,
    "languages": [
      "Afrikaans",
      "English",
      "Southern Ndebele",
      "Northern Sotho",
      "Southern Sotho",
      "Swazi",
      "Tswana",
      "Tsonga",
      "Venda",
      "Xhosa",
      "Zulu"
    ],
    "currencies": [
      "South African rand (ZAR)"
    ],
    "flagEmoji": "🇿🇦",
    "facts": [
      "South Africa is the only country in the world with three capital cities: Pretoria (executive), Cape Town (legislative), and Bloemfontein (judicial).",
      "South Africa completely surrounds the independent mountain kingdom of Lesotho.",
      "Blyde River Canyon in Mpumalanga is one of the largest canyons on Earth and the largest green (subtropical) canyon."
    ],
    "nativeCapital": "Pretoria"
  },
  "ZM": {
    "id": "ZM",
    "iso3": "ZMB",
    "name": "Zambia",
    "nativeName": "Zambia",
    "capital": "Lusaka",
    "continent": "Africa",
    "subregion": "Eastern Africa",
    "population": 15972000,
    "areaKm2": 752612,
    "lat": -15.3875,
    "lng": 28.3228,
    "languages": [
      "English"
    ],
    "currencies": [
      "Zambian kwacha (ZMW)"
    ],
    "flagEmoji": "🇿🇲",
    "facts": [
      "Lusaka sits near 15.4°S latitude and serves as the political, cultural, and transport hub of Zambia in Eastern Africa.",
      "With a land area of 752,612 km² and ~16.0 million residents, Zambia has a population density of roughly 21 people per km².",
      "In regional geography, Zambia is identified by its ISO code \"ZM\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Lusaka"
  },
  "ZW": {
    "id": "ZW",
    "iso3": "ZWE",
    "name": "Zimbabwe",
    "nativeName": "Zimbabwe",
    "capital": "Harare",
    "continent": "Africa",
    "subregion": "Eastern Africa",
    "population": 13805084,
    "areaKm2": 390757,
    "lat": -17.8252,
    "lng": 31.0335,
    "languages": [
      "Chibarwe",
      "English",
      "Kalanga",
      "Khoisan",
      "Ndau",
      "Northern Ndebele",
      "Chewa",
      "Shona",
      "Sotho",
      "Tonga",
      "Tswana",
      "Tsonga",
      "Venda",
      "Xhosa",
      "Zimbabwean Sign Language"
    ],
    "currencies": [
      "Botswana pula (BWP)",
      "Chinese yuan (CNY)",
      "Euro (EUR)",
      "British pound (GBP)",
      "Indian rupee (INR)",
      "Japanese yen (JPY)",
      "United States dollar (USD)",
      "South African rand (ZAR)",
      "Zimbabwe Gold (ZWG)"
    ],
    "flagEmoji": "🇿🇼",
    "facts": [
      "Harare sits near 17.8°S latitude and serves as the political, cultural, and transport hub of Zimbabwe in Eastern Africa.",
      "With a land area of 390,757 km² and ~13.8 million residents, Zimbabwe has a population density of roughly 35 people per km².",
      "In regional geography, Zimbabwe is identified by its ISO code \"ZW\", local road signage conventions, and administrative subdivisions."
    ],
    "nativeCapital": "Harare"
  }
};

export function getCountryByISO(iso: string): CountryInfo | undefined {
  if (!iso) return undefined;
  const upper = iso.toUpperCase();
  if (COUNTRIES_DATABASE[upper]) return COUNTRIES_DATABASE[upper];
  return Object.values(COUNTRIES_DATABASE).find(
    (c) => c.id.toUpperCase() === upper || c.iso3?.toUpperCase() === upper
  );
}

export function getSovereignCountries(): CountryInfo[] {
  return Object.values(COUNTRIES_DATABASE).filter((c) => !c.isTerritory);
}
