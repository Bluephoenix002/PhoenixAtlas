export interface QuizAttempt {
  id?: number;
  quizId: string;
  quizTitle: string;
  category: string;
  score: number;
  maxScore: number;
  accuracy: number;
  timeSpentSec: number;
  timestamp: number;
  playerName?: string;
  isPartialRun?: boolean;
  countryCode?: string;
  continent?: string;
  missedQuestions?: Array<{
    question: string;
    userAnswer: string;
    correctAnswer: string;
  }>;
}

export interface Flashcard {
  id?: number;
  deckId: string;
  front: string; // Question or prompt
  back: string; // Answer
  hint?: string;
  category: string;
  countryCode?: string;
  // SuperMemo SM-2 parameters
  interval: number; // Days until next review
  repetition: number; // Consecutive successful reviews
  efactor: number; // Easiness factor (default 2.5)
  dueDate: number; // Timestamp of next review
  lastReviewed?: number;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  description: string;
  cardCount?: number;
  createdDate: number;
  isBuiltIn?: boolean;
}

export interface CustomQuiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimitSec: number;
  targetCountryCode?: string;
  createdAt: number;
  questions: Array<{
    id: string;
    type: 'multiple-choice' | 'typing' | 'map-tap' | 'flag';
    question: string;
    options?: string[];
    correctAnswer: string;
    hint?: string;
    targetFeatureId?: string;
    targetCoordinates?: [number, number];
  }>;
}

export interface MissedQueueItem {
  id: string;
  countryCode: string;
  countryName: string;
  targetName: string;
  quizTitle: string;
  quizOptionId?: string;
  geojsonFile?: string;
  missedCount: number;
  lastMissedAt: number;
}

export interface PersonalBestEntry {
  quizId: string;
  quizTitle: string;
  bestTimeSec: number;
  accuracy: number;
  playerName: string;
  date: string;
}

export interface DailyChallengeRecord {
  date: string; // YYYY-MM-DD
  citiesScore?: number;
  areacodesScore?: number;
  subdivisionsScore?: number;
  totalScore: number;
  playerName: string;
}

export interface UserStats {
  id: string; // 'current'
  totalQuizzesPlayed: number;
  totalQuestionsAnswered: number;
  correctAnswers: number;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  totalTimeSpentSec: number;
  countryMastery: Record<string, number>; // countryCode -> percentage 0-100
  continentMastery: Record<string, number>; // continent -> percentage 0-100
  categoryScores: Record<string, { total: number; correct: number }>;
  subdivisionsMastered?: string[]; // list of unique mastered subdivision keys
  missedQueue?: MissedQueueItem[];
  personalBests?: Record<string, PersonalBestEntry>;
  dailyHistory?: Record<string, DailyChallengeRecord>;
}

export interface AppSettings {
  id: string; // 'current'
  playerName?: string;
  uiTheme?: 'slate' | 'tactical' | 'emerald' | 'crimson' | 'amethyst' | 'neon';
  uiAccentColor?: string;
  theme: 'dark' | 'light' | 'system';
  mapTheme: 'slate' | 'political' | 'tactical' | 'parchment';
  soundEnabled: boolean;
  hapticsEnabled?: boolean;
  globeSensitivity?: number;
  timerEnabled: boolean;
  defaultTimerSec: number;
  showMapBorders: boolean;
  showMapLabels: boolean;
  interfaceLang: string;
  quizLang: string;
}

/**
 * Pure localStorage-backed collection & query builder (100% offline, zero external dependencies).
 */
class LocalStorageCollection<T extends Record<string, any>, K extends string | number> {
  constructor(
    private table: LocalStorageTable<T, K>,
    private predicate: (item: T) => boolean,
    private sortField?: keyof T,
    private isReversed = false
  ) {}

  filter(fn: (item: T) => boolean): LocalStorageCollection<T, K> {
    const prev = this.predicate;
    return new LocalStorageCollection<T, K>(
      this.table,
      (item) => prev(item) && fn(item),
      this.sortField,
      this.isReversed
    );
  }

  reverse(): LocalStorageCollection<T, K> {
    return new LocalStorageCollection<T, K>(
      this.table,
      this.predicate,
      this.sortField,
      !this.isReversed
    );
  }

  async toArray(): Promise<T[]> {
    const all = await this.table.toArray();
    const filtered = all.filter(this.predicate);
    if (this.sortField) {
      const f = this.sortField;
      filtered.sort((a, b) => {
        const va = a[f];
        const vb = b[f];
        if (va < vb) return -1;
        if (va > vb) return 1;
        return 0;
      });
    }
    if (this.isReversed) {
      filtered.reverse();
    }
    return filtered;
  }

  async count(): Promise<number> {
    const arr = await this.toArray();
    return arr.length;
  }

  async delete(): Promise<number> {
    const toRemove = await this.toArray();
    const keys = toRemove
      .map((item) => item[this.table.primaryKey] as K)
      .filter((k) => k !== undefined);
    await this.table.bulkDelete(keys);
    return keys.length;
  }
}

export class LocalStorageTable<T extends Record<string, any>, K extends string | number> {
  private storageKey: string;
  public primaryKey: string;
  private autoIncrement: boolean;

  constructor(tableName: string, primaryKey = 'id', autoIncrement = false) {
    this.storageKey = `phoenix_atlas_db_${tableName}`;
    this.primaryKey = primaryKey;
    this.autoIncrement = autoIncrement;
  }

  private readAllSync(): T[] {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    try {
      const raw = window.localStorage.getItem(this.storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private writeAllSync(items: T[]): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch {
      // Ignore quota errors
    }
  }

  async toArray(): Promise<T[]> {
    return this.readAllSync();
  }

  async count(): Promise<number> {
    return this.readAllSync().length;
  }

  async get(key: K): Promise<T | undefined> {
    const items = this.readAllSync();
    return items.find((item) => item[this.primaryKey] === key);
  }

  async add(item: T): Promise<K> {
    const items = this.readAllSync();
    const copy = { ...item } as any;
    if (this.autoIncrement && copy[this.primaryKey] === undefined) {
      const maxId = items.reduce(
        (max, cur) => Math.max(max, Number(cur[this.primaryKey]) || 0),
        0
      );
      copy[this.primaryKey] = maxId + 1;
    }
    const idx = items.findIndex((x) => x[this.primaryKey] === copy[this.primaryKey]);
    if (idx >= 0) {
      items[idx] = copy;
    } else {
      items.push(copy);
    }
    this.writeAllSync(items);
    return copy[this.primaryKey] as K;
  }

  async put(item: T): Promise<K> {
    return this.add(item);
  }

  async bulkAdd(newItems: T[]): Promise<void> {
    const items = this.readAllSync();
    let maxId = items.reduce(
      (max, cur) => Math.max(max, Number(cur[this.primaryKey]) || 0),
      0
    );
    for (const rawItem of newItems) {
      const copy = { ...rawItem } as any;
      if (this.autoIncrement && copy[this.primaryKey] === undefined) {
        maxId += 1;
        copy[this.primaryKey] = maxId;
      }
      const idx = items.findIndex((x) => x[this.primaryKey] === copy[this.primaryKey]);
      if (idx >= 0) {
        items[idx] = copy;
      } else {
        items.push(copy);
      }
    }
    this.writeAllSync(items);
  }

  async bulkPut(newItems: T[]): Promise<void> {
    return this.bulkAdd(newItems);
  }

  async update(key: K, changes: Partial<T>): Promise<number> {
    const items = this.readAllSync();
    const idx = items.findIndex((x) => x[this.primaryKey] === key);
    if (idx === -1) return 0;
    items[idx] = { ...items[idx], ...changes };
    this.writeAllSync(items);
    return 1;
  }

  async delete(key: K): Promise<void> {
    const items = this.readAllSync().filter((x) => x[this.primaryKey] !== key);
    this.writeAllSync(items);
  }

  async bulkDelete(keys: K[]): Promise<void> {
    const keySet = new Set(keys);
    const items = this.readAllSync().filter((x) => !keySet.has(x[this.primaryKey]));
    this.writeAllSync(items);
  }

  async clear(): Promise<void> {
    this.writeAllSync([]);
  }

  where(field: keyof T & string) {
    return {
      equals: (val: any) =>
        new LocalStorageCollection<T, K>(this, (item) => item[field] === val)
    };
  }

  orderBy(field: keyof T & string): LocalStorageCollection<T, K> {
    return new LocalStorageCollection<T, K>(this, () => true, field, false);
  }
}

export class AtlasDatabase {
  quizAttempts = new LocalStorageTable<QuizAttempt, number>('quizAttempts', 'id', true);
  flashcards = new LocalStorageTable<Flashcard, number>('flashcards', 'id', true);
  decks = new LocalStorageTable<FlashcardDeck, string>('decks', 'id', false);
  customQuizzes = new LocalStorageTable<CustomQuiz, string>('customQuizzes', 'id', false);
  userStats = new LocalStorageTable<UserStats, string>('userStats', 'id', false);
  settings = new LocalStorageTable<AppSettings, string>('settings', 'id', false);
}

export const db = new AtlasDatabase();

// Default Initializers
export async function initDatabaseDefaults() {
  const settingsCount = await db.settings.count();
  if (settingsCount === 0) {
    await db.settings.put({
      id: 'current',
      playerName: 'Alex',
      uiTheme: 'slate',
      theme: 'dark',
      mapTheme: 'slate',
      soundEnabled: true,
      hapticsEnabled: true,
      globeSensitivity: 1.0,
      timerEnabled: true,
      defaultTimerSec: 20,
      showMapBorders: true,
      showMapLabels: true,
      interfaceLang: 'en',
      quizLang: 'en'
    });
  }

  // Perform a one-time clean reset to 0 progress so the app starts completely fresh like a new user
  try {
    if (!localStorage.getItem('phoenix_clean_reset_v5')) {
      await db.quizAttempts.clear();
      await db.userStats.clear();
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (
          k &&
          (k.startsWith('atlas_daily_completed_') ||
            k.startsWith('atlas_midquiz_') ||
            k.startsWith('daily_'))
        ) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      localStorage.setItem('phoenix_clean_reset_v5', 'true');
    }
  } catch {
    // Ignore storage errors
  }

  // Purge any legacy pre-seeded dummy attempts or language/multi/daily runs mistakenly tagged with a single country
  const rawAttempts = await db.quizAttempts.toArray();
  const dummyIdsToDelete: number[] = [];
  for (const att of rawAttempts) {
    if (
      att.id !== undefined &&
      (!att.playerName ||
        att.category === 'languages' ||
        att.quizId?.startsWith('lang-') ||
        att.quizId?.startsWith('daily-') ||
        att.quizId?.startsWith('world-') ||
        att.quizId?.startsWith('cont-') ||
        att.quizId?.startsWith('custom-'))
    ) {
      if (!att.playerName || att.category === 'languages' || att.quizId?.startsWith('lang-')) {
        dummyIdsToDelete.push(att.id);
      }
    }
  }
  if (dummyIdsToDelete.length > 0) {
    await db.quizAttempts.bulkDelete(dummyIdsToDelete);
  }

  // Self-healing clamp: ensure no stored quizAttempt ever has score > maxScore or accuracy > 100%
  const remainingAttempts = await db.quizAttempts.toArray();
  for (const att of remainingAttempts) {
    if (att.id === undefined) continue;
    const clampedScore = att.maxScore > 0 ? Math.min(att.score, att.maxScore) : att.score;
    const clampedAcc =
      att.maxScore > 0
        ? Math.max(0, Math.min(100, Math.round((clampedScore / att.maxScore) * 100)))
        : Math.max(0, Math.min(100, att.accuracy || 0));
    if (clampedScore !== att.score || clampedAcc !== att.accuracy) {
      await db.quizAttempts.update(att.id, {
        score: clampedScore,
        accuracy: clampedAcc
      });
    }
  }

  const statsCount = await db.userStats.count();
  const allAttempts = await db.quizAttempts.toArray();
  if (statsCount === 0) {
    await db.userStats.put({
      id: 'current',
      totalQuizzesPlayed: 0,
      totalQuestionsAnswered: 0,
      correctAnswers: 0,
      streakDays: 0,
      lastActiveDate: '',
      totalTimeSpentSec: 0,
      countryMastery: {},
      continentMastery: {},
      categoryScores: {},
      subdivisionsMastered: [],
      missedQueue: [],
      personalBests: {},
      dailyHistory: {}
    });
  } else {
    const existing = await db.userStats.get('current');
    if (existing) {
      if (allAttempts.length === 0) {
        await db.userStats.update('current', {
          totalQuizzesPlayed: 0,
          totalQuestionsAnswered: 0,
          correctAnswers: 0,
          streakDays: 0,
          lastActiveDate: '',
          totalTimeSpentSec: 0,
          countryMastery: {},
          continentMastery: {},
          categoryScores: {},
          subdivisionsMastered: [],
          missedQueue: [],
          personalBests: {},
          dailyHistory: {}
        });
      } else {
        const clampedCM: Record<string, number> = {};
        let needsStatFix = false;
        for (const [k, v] of Object.entries(existing.countryMastery || {})) {
          const cv = Math.max(0, Math.min(100, Number(v) || 0));
          if (cv !== v) needsStatFix = true;
          clampedCM[k] = cv;
        }
        const clampedContM: Record<string, number> = {};
        for (const [k, v] of Object.entries(existing.continentMastery || {})) {
          const cv = Math.max(0, Math.min(100, Number(v) || 0));
          if (cv !== v) needsStatFix = true;
          clampedContM[k] = cv;
        }
        const clampedCorrect = Math.min(
          existing.totalQuestionsAnswered || 0,
          existing.correctAnswers || 0
        );
        if (clampedCorrect !== existing.correctAnswers) needsStatFix = true;
        if (needsStatFix) {
          await db.userStats.update('current', {
            countryMastery: clampedCM,
            continentMastery: clampedContM,
            correctAnswers: clampedCorrect
          });
        }
      }
    }
  }

  // Pre-seed Starter Flashcard Decks
  const deckCount = await db.decks.count();
  if (deckCount === 0) {
    const now = Date.now();
    await db.decks.bulkPut([
      {
        id: 'world-capitals',
        title: 'World Capitals Master',
        description: 'Key national capitals across all seven continents.',
        cardCount: 10,
        createdDate: now,
        isBuiltIn: true
      },
      {
        id: 'european-provinces',
        title: 'European Provinces & States',
        description: 'Subdivisions of Belgium, Germany, Spain, and Netherlands.',
        cardCount: 8,
        createdDate: now,
        isBuiltIn: true
      },
      {
        id: 'greek-alphabet',
        title: 'Greek Alphabet & Phonics',
        description: 'Read the ancient and modern Greek script with phonetic values.',
        cardCount: 12,
        createdDate: now,
        isBuiltIn: true
      }
    ]);

    // Pre-seed Starter Flashcards
    await db.flashcards.bulkPut([
      {
        deckId: 'world-capitals',
        front: 'What is the capital of Belgium?',
        back: 'Brussels',
        hint: 'Hosts the EU & NATO headquarters.',
        category: 'Capitals',
        countryCode: 'BE',
        interval: 1,
        repetition: 0,
        efactor: 2.5,
        dueDate: now
      },
      {
        deckId: 'world-capitals',
        front: 'What is the capital of Japan?',
        back: 'Tokyo',
        hint: 'Most populous metropolitan area in the world.',
        category: 'Capitals',
        countryCode: 'JP',
        interval: 1,
        repetition: 0,
        efactor: 2.5,
        dueDate: now
      },
      {
        deckId: 'world-capitals',
        front: 'What is the capital of Australia?',
        back: 'Canberra',
        hint: 'Planned city located between Sydney and Melbourne.',
        category: 'Capitals',
        countryCode: 'AU',
        interval: 1,
        repetition: 0,
        efactor: 2.5,
        dueDate: now
      },
      {
        deckId: 'world-capitals',
        front: 'What is the capital of Canada?',
        back: 'Ottawa',
        hint: 'Located in Ontario on the border with Quebec.',
        category: 'Capitals',
        countryCode: 'CA',
        interval: 1,
        repetition: 0,
        efactor: 2.5,
        dueDate: now
      },
      {
        deckId: 'world-capitals',
        front: 'What is the capital of Argentina?',
        back: 'Buenos Aires',
        hint: 'Situated on the western shore of the Río de la Plata.',
        category: 'Capitals',
        countryCode: 'AR',
        interval: 1,
        repetition: 0,
        efactor: 2.5,
        dueDate: now
      },
      {
        deckId: 'european-provinces',
        front: 'Name the northern province of Belgium famous for diamond trade and port.',
        back: 'Antwerp (Antwerpen)',
        hint: 'Home to the Scheldt estuary.',
        category: 'Provinces',
        countryCode: 'BE',
        interval: 1,
        repetition: 0,
        efactor: 2.5,
        dueDate: now
      },
      {
        deckId: 'european-provinces',
        front: 'Which German Bundesland has Munich as its capital?',
        back: 'Bavaria (Bayern)',
        hint: 'Largest state in Germany by area.',
        category: 'Provinces',
        countryCode: 'DE',
        interval: 1,
        repetition: 0,
        efactor: 2.5,
        dueDate: now
      },
      {
        deckId: 'greek-alphabet',
        front: 'What is the Greek letter "Ω / ω" and its sound?',
        back: 'Omega (Long "O" as in "home")',
        hint: 'The 24th and last letter of the Greek alphabet.',
        category: 'Languages',
        countryCode: 'GR',
        interval: 1,
        repetition: 0,
        efactor: 2.5,
        dueDate: now
      },
      {
        deckId: 'greek-alphabet',
        front: 'What is the Greek letter "Δ / δ" and its sound?',
        back: 'Delta (Hard "D" in classical, soft "th" in modern Greek)',
        hint: 'Fourth letter, shape of a triangle.',
        category: 'Languages',
        countryCode: 'GR',
        interval: 1,
        repetition: 0,
        efactor: 2.5,
        dueDate: now
      }
    ]);
  }
}
