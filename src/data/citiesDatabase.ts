import { COUNTRIES_DATABASE } from './countriesData';
import { seededShuffle } from '../utils/geojsonCache';
import rawCitiesJson from '../../public/data/cities.json';

export interface RawCityJsonRecord {
  id: string;
  name: string;
  native_name?: string;
  country_code: string;
  continent: string;
  admin1: string;
  lat: number;
  lng: number;
  population: number;
  tier: number;
  is_capital: boolean;
}

export interface CityPoint {
  id: string;
  name: string;
  nativeName?: string;
  countryCode: string;
  countryName: string;
  continent: string;
  continentCode?: string;
  admin1?: string;
  population?: number;
  isCapital?: boolean;
  lat: number;
  lng: number;
  tier: 1 | 2 | 3 | 4 | 5;
}

const CONTINENT_CODE_TO_NAME: Record<string, string> = {
  EU: 'Europe',
  AS: 'Asia',
  NA: 'North America',
  SA: 'South America',
  AF: 'Africa',
  OC: 'Oceania',
  AN: 'Antarctica'
};

let cachedCitiesDatabase: CityPoint[] | null = null;

export function getCitiesDatabase(): CityPoint[] {
  if (cachedCitiesDatabase) return cachedCitiesDatabase;

  const rawList = rawCitiesJson as RawCityJsonRecord[];
  const list: CityPoint[] = [];
  const seenKeys = new Set<string>();

  for (const r of rawList) {
    const code = (r.country_code || '').toUpperCase();
    const countryEntry = COUNTRIES_DATABASE[code];
    const dedupKey = `${code}:${r.name.toLowerCase().trim()}`;
    if (seenKeys.has(dedupKey)) continue;
    seenKeys.add(dedupKey);

    const tierNum = Math.max(1, Math.min(5, Number(r.tier) || 3)) as 1 | 2 | 3 | 4 | 5;
    const continentFull =
      countryEntry?.continent ||
      CONTINENT_CODE_TO_NAME[r.continent] ||
      r.continent ||
      'Europe';

    list.push({
      id: r.id,
      name: r.name,
      nativeName: r.native_name || r.name,
      countryCode: code,
      countryName: countryEntry?.name || code,
      continent: continentFull,
      continentCode: r.continent,
      admin1: r.admin1,
      population: r.population,
      isCapital: Boolean(r.is_capital),
      lat: Number(r.lat),
      lng: Number(r.lng),
      tier: tierNum
    });
  }

  // Ensure any sovereign country in COUNTRIES_DATABASE with 0 entries in cities.json gets its capital
  const countByCountry = new Map<string, number>();
  list.forEach((ct) =>
    countByCountry.set(ct.countryCode, (countByCountry.get(ct.countryCode) || 0) + 1)
  );
  Object.values(COUNTRIES_DATABASE).forEach((c) => {
    const cnt = countByCountry.get(c.id) || 0;
    if (cnt === 0) {
      const capName = c.capital && c.capital !== 'N/A' ? c.capital : `${c.name} City`;
      list.push({
        id: `${c.id}-cap`,
        name: capName,
        nativeName: c.nativeCapital || capName,
        countryCode: c.id,
        countryName: c.name,
        continent: c.continent,
        lat: c.lat,
        lng: c.lng,
        population: c.population ? Math.round(c.population * 0.15) : 25000,
        isCapital: true,
        tier: c.isTerritory ? 3 : 1
      });
    }
  });

  cachedCitiesDatabase = list;
  return list;
}

// Get filtered cities by scope (world, continent, or countryCode) and 5-tier system (cumulative or strict single-tier)
export function getCitiesByScopeAndTier(
  scope: { type: 'world' | 'continent' | 'country'; value?: string },
  difficultyOrTier: 'easy' | 'medium' | 'hard' | 1 | 2 | 3 | 4 | 5,
  mode: 'cumulative' | 'strict' = 'cumulative'
): CityPoint[] {
  const all = getCitiesDatabase();
  const targetTier: 1 | 2 | 3 | 4 | 5 =
    typeof difficultyOrTier === 'number'
      ? difficultyOrTier
      : difficultyOrTier === 'easy'
      ? 1
      : difficultyOrTier === 'medium'
      ? 3
      : 5;

  const scoped = all.filter((city) => {
    if (scope.type === 'continent' && scope.value) {
      const val = scope.value.toLowerCase().trim();
      return (
        city.continent.toLowerCase() === val ||
        (city.continentCode && city.continentCode.toLowerCase() === val)
      );
    }
    if (scope.type === 'country' && scope.value) {
      return city.countryCode.toUpperCase() === scope.value.toUpperCase();
    }
    return true;
  });

  const matched = scoped.filter((city) =>
    mode === 'strict' ? city.tier === targetTier : city.tier <= targetTier
  );
  return matched.length > 0 ? matched : scoped;
}

// Daily Challenge Trio Generator (Synchronized via Midnight UTC Date Seed)
export interface DailyChallengeSet {
  dateStr: string;
  cities: CityPoint[];
  areaCodes: Array<{
    code: string;
    rawCode: string;
    countryCode: string;
    countryName: string;
    regionHint: string;
    lat: number;
    lng: number;
  }>;
  subdivisions: Array<{
    name: string;
    countryCode: string;
    countryName: string;
    lat: number;
    lng: number;
  }>;
}

const GLOBAL_DAILY_AREA_CODES = [
  { code: '016', rawCode: '016', countryCode: 'BE', countryName: 'Belgium', regionHint: 'Leuven', lat: 50.8798, lng: 4.7005 },
  { code: '03', rawCode: '03', countryCode: 'BE', countryName: 'Belgium', regionHint: 'Antwerp', lat: 51.2194, lng: 4.4025 },
  { code: '09', rawCode: '09', countryCode: 'BE', countryName: 'Belgium', regionHint: 'Ghent', lat: 51.0543, lng: 3.7174 },
  { code: '04', rawCode: '04', countryCode: 'BE', countryName: 'Belgium', regionHint: 'Liège', lat: 50.6326, lng: 5.5797 },
  { code: '020', rawCode: '020', countryCode: 'NL', countryName: 'Netherlands', regionHint: 'Amsterdam', lat: 52.3676, lng: 4.9041 },
  { code: '010', rawCode: '010', countryCode: 'NL', countryName: 'Netherlands', regionHint: 'Rotterdam', lat: 51.9244, lng: 4.4777 },
  { code: '030', rawCode: '030', countryCode: 'NL', countryName: 'Netherlands', regionHint: 'Utrecht', lat: 52.0907, lng: 5.1214 },
  { code: '040', rawCode: '040', countryCode: 'NL', countryName: 'Netherlands', regionHint: 'Eindhoven', lat: 51.4416, lng: 5.4697 },
  { code: '415', rawCode: '415', countryCode: 'US', countryName: 'United States', regionHint: 'San Francisco, CA', lat: 37.7749, lng: -122.4194 },
  { code: '305', rawCode: '305', countryCode: 'US', countryName: 'United States', regionHint: 'Miami, FL', lat: 25.7617, lng: -80.1918 },
  { code: '206', rawCode: '206', countryCode: 'US', countryName: 'United States', regionHint: 'Seattle, WA', lat: 47.6062, lng: -122.3321 },
  { code: '312', rawCode: '312', countryCode: 'US', countryName: 'United States', regionHint: 'Chicago, IL', lat: 41.8781, lng: -87.6298 },
  { code: '212', rawCode: '212', countryCode: 'US', countryName: 'United States', regionHint: 'New York City, NY', lat: 40.7128, lng: -74.0060 },
  { code: '03', rawCode: '03', countryCode: 'JP', countryName: 'Japan', regionHint: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { code: '06', rawCode: '06', countryCode: 'JP', countryName: 'Japan', regionHint: 'Osaka', lat: 34.6937, lng: 135.5023 },
  { code: '011', rawCode: '011', countryCode: 'JP', countryName: 'Japan', regionHint: 'Sapporo (Hokkaido)', lat: 43.0618, lng: 141.3545 },
  { code: '092', rawCode: '092', countryCode: 'JP', countryName: 'Japan', regionHint: 'Fukuoka', lat: 33.5902, lng: 130.4017 },
  { code: '11', rawCode: '11', countryCode: 'BR', countryName: 'Brazil', regionHint: 'São Paulo', lat: -23.5505, lng: -46.6333 },
  { code: '21', rawCode: '21', countryCode: 'BR', countryName: 'Brazil', regionHint: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729 },
  { code: '92', rawCode: '92', countryCode: 'BR', countryName: 'Brazil', regionHint: 'Manaus (Amazonas)', lat: -3.1190, lng: -60.0217 },
  { code: '71', rawCode: '71', countryCode: 'BR', countryName: 'Brazil', regionHint: 'Salvador (Bahia)', lat: -12.9714, lng: -38.5014 },
  { code: '51', rawCode: '51', countryCode: 'BR', countryName: 'Brazil', regionHint: 'Porto Alegre (RS)', lat: -30.0346, lng: -51.2177 },
  { code: '04', rawCode: '04', countryCode: 'FR', countryName: 'France', regionHint: 'Southeast France', lat: 45.7640, lng: 4.8357 },
  { code: '02', rawCode: '02', countryCode: 'FR', countryName: 'France', regionHint: 'Northwest France', lat: 48.1173, lng: -1.6778 },
  { code: '05', rawCode: '05', countryCode: 'FR', countryName: 'France', regionHint: 'Southwest France', lat: 44.8378, lng: -0.5792 },
  { code: '03', rawCode: '03', countryCode: 'FR', countryName: 'France', regionHint: 'Northeast France', lat: 48.5734, lng: 7.7521 },
  { code: '089', rawCode: '089', countryCode: 'DE', countryName: 'Germany', regionHint: 'Munich', lat: 48.1351, lng: 11.5820 },
  { code: '030', rawCode: '030', countryCode: 'DE', countryName: 'Germany', regionHint: 'Berlin', lat: 52.5200, lng: 13.4050 },
  { code: '040', rawCode: '040', countryCode: 'DE', countryName: 'Germany', regionHint: 'Hamburg', lat: 53.5511, lng: 9.9937 },
  { code: '08', rawCode: '08', countryCode: 'AU', countryName: 'Australia', regionHint: 'Western & South Australia', lat: -31.9505, lng: 115.8605 },
  { code: '02', rawCode: '02', countryCode: 'AU', countryName: 'Australia', regionHint: 'NSW & ACT', lat: -33.8688, lng: 151.2093 },
  { code: '03', rawCode: '03', countryCode: 'AU', countryName: 'Australia', regionHint: 'Victoria & Tasmania', lat: -37.8136, lng: 144.9631 },
  { code: '07', rawCode: '07', countryCode: 'AU', countryName: 'Australia', regionHint: 'Queensland', lat: -27.4705, lng: 153.0260 },
  { code: '2', rawCode: '2', countryCode: 'CL', countryName: 'Chile', regionHint: 'Santiago Metropolitan', lat: -33.4489, lng: -70.6693 },
  { code: '61', rawCode: '61', countryCode: 'CL', countryName: 'Chile', regionHint: 'Punta Arenas (Magallanes)', lat: -53.1638, lng: -70.9171 },
  { code: '24', rawCode: '24', countryCode: 'VN', countryName: 'Vietnam', regionHint: 'Hanoi', lat: 21.0285, lng: 105.8542 },
  { code: '28', rawCode: '28', countryCode: 'VN', countryName: 'Vietnam', regionHint: 'Ho Chi Minh City', lat: 10.8231, lng: 106.6297 },
  { code: '604', rawCode: '604', countryCode: 'CA', countryName: 'Canada', regionHint: 'Vancouver, BC', lat: 49.2827, lng: -123.1207 },
  { code: '416', rawCode: '416', countryCode: 'CA', countryName: 'Canada', regionHint: 'Toronto, ON', lat: 43.6532, lng: -79.3832 },
  { code: '514', rawCode: '514', countryCode: 'CA', countryName: 'Canada', regionHint: 'Montreal, QC', lat: 45.5017, lng: -73.5673 },
  { code: '021', rawCode: '021', countryCode: 'ID', countryName: 'Indonesia', regionHint: 'Jakarta', lat: -6.2088, lng: 106.8456 },
  { code: '031', rawCode: '031', countryCode: 'ID', countryName: 'Indonesia', regionHint: 'Surabaya', lat: -7.2575, lng: 112.7521 },
  { code: '02', rawCode: '02', countryCode: 'KR', countryName: 'South Korea', regionHint: 'Seoul', lat: 37.5665, lng: 126.9780 },
  { code: '051', rawCode: '051', countryCode: 'KR', countryName: 'South Korea', regionHint: 'Busan', lat: 35.1796, lng: 129.0756 },
  { code: '011', rawCode: '011', countryCode: 'ZA', countryName: 'South Africa', regionHint: 'Johannesburg', lat: -26.2041, lng: 28.0473 },
  { code: '021', rawCode: '021', countryCode: 'ZA', countryName: 'South Africa', regionHint: 'Cape Town', lat: -33.9249, lng: 18.4241 },
  { code: '91', rawCode: '91', countryCode: 'ES', countryName: 'Spain', regionHint: 'Madrid', lat: 40.4168, lng: -3.7038 },
  { code: '93', rawCode: '93', countryCode: 'ES', countryName: 'Spain', regionHint: 'Barcelona', lat: 41.3874, lng: 2.1686 },
  { code: '95', rawCode: '95', countryCode: 'ES', countryName: 'Spain', regionHint: 'Seville / Malaga', lat: 37.3891, lng: -5.9845 },
  { code: '02', rawCode: '02', countryCode: 'IT', countryName: 'Italy', regionHint: 'Milan', lat: 45.4642, lng: 9.1900 },
  { code: '06', rawCode: '06', countryCode: 'IT', countryName: 'Italy', regionHint: 'Rome', lat: 41.9028, lng: 12.4964 },
  { code: '081', rawCode: '081', countryCode: 'IT', countryName: 'Italy', regionHint: 'Naples', lat: 40.8518, lng: 14.2681 },
  { code: '12', rawCode: '12', countryCode: 'PL', countryName: 'Poland', regionHint: 'Kraków', lat: 50.0647, lng: 19.9450 },
  { code: '22', rawCode: '22', countryCode: 'PL', countryName: 'Poland', regionHint: 'Warsaw', lat: 52.2297, lng: 21.0122 },
  { code: '21', rawCode: '21', countryCode: 'PT', countryName: 'Portugal', regionHint: 'Lisbon', lat: 38.7223, lng: -9.1393 },
  { code: '22', rawCode: '22', countryCode: 'PT', countryName: 'Portugal', regionHint: 'Porto', lat: 41.1579, lng: -8.6291 },
  { code: '08', rawCode: '08', countryCode: 'SE', countryName: 'Sweden', regionHint: 'Stockholm', lat: 59.3293, lng: 18.0686 },
  { code: '031', rawCode: '031', countryCode: 'SE', countryName: 'Sweden', regionHint: 'Gothenburg', lat: 57.7089, lng: 11.9746 },
  { code: '212', rawCode: '212', countryCode: 'TR', countryName: 'Turkey', regionHint: 'Istanbul (European)', lat: 41.0082, lng: 28.9784 },
  { code: '312', rawCode: '312', countryCode: 'TR', countryName: 'Turkey', regionHint: 'Ankara', lat: 39.9334, lng: 32.8597 },
  { code: '55', rawCode: '55', countryCode: 'MX', countryName: 'Mexico', regionHint: 'Mexico City', lat: 19.4326, lng: -99.1332 },
  { code: '81', rawCode: '81', countryCode: 'MX', countryName: 'Mexico', regionHint: 'Monterrey', lat: 25.6866, lng: -100.3161 },
  { code: '11', rawCode: '11', countryCode: 'AR', countryName: 'Argentina', regionHint: 'Buenos Aires', lat: -34.6037, lng: -58.3816 },
  { code: '053', rawCode: '053', countryCode: 'TH', countryName: 'Thailand', regionHint: 'Chiang Mai', lat: 18.7883, lng: 98.9853 },
  { code: '09', rawCode: '09', countryCode: 'NZ', countryName: 'New Zealand', regionHint: 'Auckland & Northland', lat: -36.8485, lng: 174.7633 },
  { code: '03', rawCode: '03', countryCode: 'NZ', countryName: 'New Zealand', regionHint: 'South Island', lat: -43.5321, lng: 172.6362 }
];

const GLOBAL_DAILY_SUBDIVISIONS = [
  { name: 'West-Vlaanderen', countryCode: 'BE', countryName: 'Belgium', lat: 51.05, lng: 3.05 },
  { name: 'Antwerpen', countryCode: 'BE', countryName: 'Belgium', lat: 51.22, lng: 4.70 },
  { name: 'Noord-Brabant', countryCode: 'NL', countryName: 'Netherlands', lat: 51.60, lng: 5.15 },
  { name: 'Gelderland', countryCode: 'NL', countryName: 'Netherlands', lat: 52.05, lng: 5.95 },
  { name: 'California', countryCode: 'US', countryName: 'United States', lat: 36.77, lng: -119.41 },
  { name: 'Texas', countryCode: 'US', countryName: 'United States', lat: 31.96, lng: -99.90 },
  { name: 'Florida', countryCode: 'US', countryName: 'United States', lat: 27.99, lng: -81.76 },
  { name: 'Washington', countryCode: 'US', countryName: 'United States', lat: 47.75, lng: -120.74 },
  { name: 'Hokkaido', countryCode: 'JP', countryName: 'Japan', lat: 43.22, lng: 142.86 },
  { name: 'Aichi', countryCode: 'JP', countryName: 'Japan', lat: 35.18, lng: 136.90 },
  { name: 'Fukuoka', countryCode: 'JP', countryName: 'Japan', lat: 33.59, lng: 130.40 },
  { name: 'Bayern', countryCode: 'DE', countryName: 'Germany', lat: 48.79, lng: 11.49 },
  { name: 'Nordrhein-Westfalen', countryCode: 'DE', countryName: 'Germany', lat: 51.43, lng: 7.66 },
  { name: 'Niedersachsen', countryCode: 'DE', countryName: 'Germany', lat: 52.63, lng: 9.84 },
  { name: 'Andalucía', countryCode: 'ES', countryName: 'Spain', lat: 37.54, lng: -4.72 },
  { name: 'Cataluña', countryCode: 'ES', countryName: 'Spain', lat: 41.59, lng: 1.52 },
  { name: 'Galicia', countryCode: 'ES', countryName: 'Spain', lat: 42.75, lng: -7.86 },
  { name: 'British Columbia', countryCode: 'CA', countryName: 'Canada', lat: 53.72, lng: -127.64 },
  { name: 'Quebec', countryCode: 'CA', countryName: 'Canada', lat: 52.93, lng: -73.54 },
  { name: 'Alberta', countryCode: 'CA', countryName: 'Canada', lat: 53.93, lng: -116.57 },
  { name: 'New South Wales', countryCode: 'AU', countryName: 'Australia', lat: -31.84, lng: 145.61 },
  { name: 'Queensland', countryCode: 'AU', countryName: 'Australia', lat: -22.57, lng: 144.08 },
  { name: 'Western Australia', countryCode: 'AU', countryName: 'Australia', lat: -25.04, lng: 121.64 },
  { name: 'Minas Gerais', countryCode: 'BR', countryName: 'Brazil', lat: -18.51, lng: -44.55 },
  { name: 'Bahia', countryCode: 'BR', countryName: 'Brazil', lat: -12.57, lng: -41.70 },
  { name: 'Paraná', countryCode: 'BR', countryName: 'Brazil', lat: -24.89, lng: -51.55 },
  { name: 'Chiang Mai', countryCode: 'TH', countryName: 'Thailand', lat: 18.79, lng: 98.98 },
  { name: 'Nakhon Ratchasima', countryCode: 'TH', countryName: 'Thailand', lat: 14.97, lng: 102.09 },
  { name: 'Dhofar', countryCode: 'OM', countryName: 'Oman', lat: 18.23, lng: 54.09 },
  { name: 'Bretagne', countryCode: 'FR', countryName: 'France', lat: 48.20, lng: -2.93 },
  { name: 'Occitanie', countryCode: 'FR', countryName: 'France', lat: 43.89, lng: 2.19 },
  { name: 'Nouvelle-Aquitaine', countryCode: 'FR', countryName: 'France', lat: 45.70, lng: 0.62 },
  { name: 'Toscana', countryCode: 'IT', countryName: 'Italy', lat: 43.45, lng: 11.20 },
  { name: 'Lombardia', countryCode: 'IT', countryName: 'Italy', lat: 45.66, lng: 9.96 },
  { name: 'Sicilia', countryCode: 'IT', countryName: 'Italy', lat: 37.59, lng: 14.01 },
  { name: 'Jalisco', countryCode: 'MX', countryName: 'Mexico', lat: 20.57, lng: -103.61 },
  { name: 'Chihuahua', countryCode: 'MX', countryName: 'Mexico', lat: 28.63, lng: -106.08 },
  { name: 'Yucatán', countryCode: 'MX', countryName: 'Mexico', lat: 20.70, lng: -89.09 },
  { name: 'Buenos Aires', countryCode: 'AR', countryName: 'Argentina', lat: -36.68, lng: -60.56 },
  { name: 'Córdoba', countryCode: 'AR', countryName: 'Argentina', lat: -32.14, lng: -63.80 },
  { name: 'Mendoza', countryCode: 'AR', countryName: 'Argentina', lat: -34.62, lng: -68.58 },
  { name: 'Western Cape', countryCode: 'ZA', countryName: 'South Africa', lat: -33.22, lng: 21.85 },
  { name: 'KwaZulu-Natal', countryCode: 'ZA', countryName: 'South Africa', lat: -28.53, lng: 30.89 },
  { name: 'Jawa Timur', countryCode: 'ID', countryName: 'Indonesia', lat: -7.72, lng: 112.56 },
  { name: 'Sumatera Utara', countryCode: 'ID', countryName: 'Indonesia', lat: 2.11, lng: 99.54 },
  { name: 'Rajasthan', countryCode: 'IN', countryName: 'India', lat: 26.58, lng: 73.84 },
  { name: 'Maharashtra', countryCode: 'IN', countryName: 'India', lat: 19.75, lng: 75.71 },
  { name: 'Tamil Nadu', countryCode: 'IN', countryName: 'India', lat: 11.12, lng: 78.65 },
  { name: 'Małopolskie', countryCode: 'PL', countryName: 'Poland', lat: 49.85, lng: 20.25 },
  { name: 'Pomorskie', countryCode: 'PL', countryName: 'Poland', lat: 54.19, lng: 18.15 },
  { name: 'Antalya', countryCode: 'TR', countryName: 'Turkey', lat: 37.05, lng: 31.05 },
  { name: 'İzmir', countryCode: 'TR', countryName: 'Turkey', lat: 38.42, lng: 27.14 },
  { name: 'Västra Götaland', countryCode: 'SE', countryName: 'Sweden', lat: 58.25, lng: 13.05 },
  { name: 'Skåne', countryCode: 'SE', countryName: 'Sweden', lat: 55.99, lng: 13.59 },
  { name: 'Vestland', countryCode: 'NO', countryName: 'Norway', lat: 60.90, lng: 6.10 },
  { name: 'Lapland', countryCode: 'FI', countryName: 'Finland', lat: 67.85, lng: 26.68 },
  { name: 'Steiermark', countryCode: 'AT', countryName: 'Austria', lat: 47.36, lng: 14.96 },
  { name: 'Tirol', countryCode: 'AT', countryName: 'Austria', lat: 47.25, lng: 11.60 },
  { name: 'Transylvania (Cluj)', countryCode: 'RO', countryName: 'Romania', lat: 46.77, lng: 23.62 },
  { name: 'Sabah', countryCode: 'MY', countryName: 'Malaysia', lat: 5.42, lng: 117.03 },
  { name: 'Sarawak', countryCode: 'MY', countryName: 'Malaysia', lat: 2.55, lng: 113.00 },
  { name: 'Canterbury', countryCode: 'NZ', countryName: 'New Zealand', lat: -43.53, lng: 171.63 }
];

function pickDistinctCountries<T extends { countryCode: string }>(items: T[], count: number): T[] {
  const picked: T[] = [];
  const usedCountries = new Set<string>();
  for (const item of items) {
    if (!usedCountries.has(item.countryCode)) {
      usedCountries.add(item.countryCode);
      picked.push(item);
      if (picked.length === count) return picked;
    }
  }
  for (const item of items) {
    if (!picked.includes(item)) {
      picked.push(item);
      if (picked.length === count) return picked;
    }
  }
  return picked;
}

export function getTodayUTCString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function getDailyChallenges(dateStr: string = getTodayUTCString()): DailyChallengeSet {
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) {
    seed = (seed * 31 + dateStr.charCodeAt(i)) % 1000000007;
  }

  // Pick 1 random city from EVERY tier (Tier 1, Tier 2, Tier 3, Tier 4, Tier 5) across 5 distinct countries!
  const allCities = getCitiesDatabase();
  const dailyCities: CityPoint[] = [];
  const usedCityCountries = new Set<string>();
  const tiers: Array<1 | 2 | 3 | 4 | 5> = [1, 2, 3, 4, 5];
  tiers.forEach((t, idx) => {
    const tierPool = seededShuffle(
      allCities.filter((c) => c.tier === t),
      seed + 101 + idx * 37
    );
    const chosen =
      tierPool.find((c) => !usedCityCountries.has(c.countryCode)) || tierPool[0];
    if (chosen) {
      usedCityCountries.add(chosen.countryCode);
      dailyCities.push(chosen);
    }
  });

  const dailyAreaCodes = pickDistinctCountries(seededShuffle(GLOBAL_DAILY_AREA_CODES, seed + 202), 5);
  const dailySubdivisions = pickDistinctCountries(seededShuffle(GLOBAL_DAILY_SUBDIVISIONS, seed + 303), 5);

  return {
    dateStr,
    cities: dailyCities,
    areaCodes: dailyAreaCodes,
    subdivisions: dailySubdivisions
  };
}

// Haversine distance in km for 5,000-point GeoGuessr-style accuracy scoring
export function calculateDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * GeoGuessr 5,000-point exponential scoring scaled generously by map extent:
 * - Generous 5K exact-hit radius (`perfectThresholdKm`) that scales with country size (e.g., ~15 km in France/Spain/Germany, up to 35 km in giant countries/World).
 * - Smooth exponential decay beyond the 5K radius so near-misses (10–25 km) still earn ~4,850–5,000 pts!
 */
export function calculateGeoScore(distanceKm: number, maxExtentKm = 14916): number {
  const safeExtent = Math.max(120, maxExtentKm);
  const perfectThresholdKm = Math.max(4.5, Math.min(35, safeExtent * 0.015));
  if (distanceKm <= perfectThresholdKm) return 5000;

  // If playing an individual country or region (< 8,000 km diagonal) and user clicks across the country (>= 55% of map diagonal), award 0 points
  if (safeExtent < 8000 && distanceKm >= safeExtent * 0.55) {
    return 0;
  }

  const excessKm = Math.max(0, distanceKm - perfectThresholdKm);
  const rawScore = Math.round(5000 * Math.exp((-6.5 * excessKm) / safeExtent));
  return rawScore < 25 ? 0 : Math.max(0, Math.min(5000, rawScore));
}
