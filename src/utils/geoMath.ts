// Haversine formula for calculating geodesic distance between two latitude/longitude points in kilometers

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Normalize strings for typing quizzes: strips accents, ignores punctuation and casing
export function normalizeAnswer(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ');
}

export function isAnswerMatch(
  userInput: string,
  correctAnswer: string,
  acceptableAnswers?: string[]
): boolean {
  const normInput = normalizeAnswer(userInput);
  const normCorrect = normalizeAnswer(correctAnswer);

  if (normInput === normCorrect) return true;

  if (acceptableAnswers && acceptableAnswers.length > 0) {
    return acceptableAnswers.some((ans) => normalizeAnswer(ans) === normInput);
  }

  return false;
}
