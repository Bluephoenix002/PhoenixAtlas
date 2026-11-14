import { CountryInfo, COUNTRIES_DATABASE } from '../data/countriesData';
import { QuizDefinition, QuizQuestion } from './quizTypes';

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => 0.5 - Math.random());
}

function formatPop(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + ' Billion';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + ' Million';
  if (n >= 1_000) return (n / 1_000).toFixed(0) + ' Thousand';
  return String(n);
}

/**
 * Generates an authentic, country-specific Geography & Cultural Facts Quiz
 * dynamically from genuine geographic and demographic data for any country on Earth.
 */
export function generateCountryGeographyQuiz(country: CountryInfo): QuizDefinition {
  const allCountries = Object.values(COUNTRIES_DATABASE).filter((c) => c.id !== country.id);
  const questions: QuizQuestion[] = [];

  // Question 1: Capital City
  if (country.capital) {
    const distractors = shuffle(
      allCountries.filter((c) => c.capital && c.capital !== country.capital)
    )
      .slice(0, 3)
      .map((c) => c.capital);

    questions.push({
      id: `${country.id.toLowerCase()}-q-capital`,
      type: 'multiple-choice',
      prompt: `What is the capital city of ${country.name}?`,
      correctAnswer: country.capital,
      options: shuffle([country.capital, ...distractors]),
      explanation: `${country.capital} is the official capital of ${country.name}.`,
      countryCode: country.id
    });
  }

  // Question 2: Flag
  if (country.flagEmoji) {
    const otherFlags = shuffle(
      allCountries.filter((c) => c.flagEmoji && c.flagEmoji !== country.flagEmoji)
    )
      .slice(0, 3)
      .map((c) => `${c.flagEmoji} ${c.name}`);

    const correctFlagOption = `${country.flagEmoji} ${country.name}`;
    questions.push({
      id: `${country.id.toLowerCase()}-q-flag`,
      type: 'multiple-choice',
      prompt: `Which national flag represents ${country.name}?`,
      correctAnswer: correctFlagOption,
      options: shuffle([correctFlagOption, ...otherFlags]),
      countryCode: country.id
    });
  }

  // Question 3: Languages
  if (country.languages && country.languages.length > 0) {
    const primaryLang = country.languages[0];
    const distractorLangs = shuffle(
      Array.from(
        new Set(
          allCountries
            .flatMap((c) => c.languages || [])
            .filter((l) => !country.languages.includes(l))
        )
      )
    ).slice(0, 3);

    if (distractorLangs.length >= 3) {
      questions.push({
        id: `${country.id.toLowerCase()}-q-lang`,
        type: 'multiple-choice',
        prompt: `Which official language is spoken in ${country.name}?`,
        correctAnswer: primaryLang,
        options: shuffle([primaryLang, ...distractorLangs]),
        explanation: `${country.name}'s official/recognized language is ${country.languages.join(', ')}.`,
        countryCode: country.id
      });
    }
  }

  // Question 4: Currencies
  if (country.currencies && country.currencies.length > 0) {
    const primaryCurr = country.currencies[0];
    const distractorCurrs = shuffle(
      Array.from(
        new Set(
          allCountries
            .flatMap((c) => c.currencies || [])
            .filter((cr) => !country.currencies.includes(cr))
        )
      )
    ).slice(0, 3);

    if (distractorCurrs.length >= 3) {
      questions.push({
        id: `${country.id.toLowerCase()}-q-currency`,
        type: 'multiple-choice',
        prompt: `What official currency is used in ${country.name}?`,
        correctAnswer: primaryCurr,
        options: shuffle([primaryCurr, ...distractorCurrs]),
        explanation: `${country.name} conducts commerce using ${primaryCurr}.`,
        countryCode: country.id
      });
    }
  }

  // Question 5: Population Scale
  if (country.population) {
    const correctPopStr = `Approx. ${formatPop(country.population)}`;
    const d1 = `Approx. ${formatPop(country.population * 0.25)}`;
    const d2 = `Approx. ${formatPop(country.population * 2.8)}`;
    const d3 = `Approx. ${formatPop(country.population * 7.5)}`;

    questions.push({
      id: `${country.id.toLowerCase()}-q-pop`,
      type: 'multiple-choice',
      prompt: `What is the estimated national population of ${country.name}?`,
      correctAnswer: correctPopStr,
      options: shuffle([correctPopStr, d1, d2, d3]),
      explanation: `${country.name} has an estimated population of ${country.population.toLocaleString()}.`,
      countryCode: country.id
    });
  }

  // Question 6 & 7: Country-specific authentic geography & cultural facts
  if (country.facts && country.facts.length > 0) {
    const otherFacts = shuffle(
      allCountries
        .flatMap((c) => c.facts || [])
        .filter((f) => !country.facts.includes(f))
    );

    country.facts.forEach((fact, idx) => {
      const distractors = otherFacts.slice(idx * 3, (idx + 1) * 3);
      if (distractors.length >= 3) {
        questions.push({
          id: `${country.id.toLowerCase()}-q-fact-${idx + 1}`,
          type: 'multiple-choice',
          prompt: `Which authentic geographic or cultural fact describes ${country.name}?`,
          correctAnswer: fact,
          options: shuffle([fact, ...distractors]),
          explanation: `True fact about ${country.name}: ${fact}`,
          countryCode: country.id
        });
      }
    });
  }

  return {
    id: `${country.id.toLowerCase()}-facts-quiz`,
    title: `${country.name}: Geography & Cultural Facts`,
    description: `Country-specific geography challenge covering ${country.name}'s capital, language, terrain, currency, and verified facts.`,
    category: 'Geography',
    difficulty: 'Medium',
    questionCount: questions.length,
    countryCode: country.id,
    continent: country.continent,
    iconName: 'BookOpen',
    questions
  };
}
