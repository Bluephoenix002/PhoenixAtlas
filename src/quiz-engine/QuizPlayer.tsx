import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Clock,
  Flame,
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  Award,
  ChevronRight,
  Eye
} from 'lucide-react';
import { QuizDefinition, QuizQuestion, VisualClue } from './quizTypes';
import { normalizeAnswer } from '../utils/geoMath';
import { sounds } from '../utils/soundEngine';
import { db, QuizAttempt } from '../database/db';
import { CountryFlag } from '../components/CountryFlag';
import { SubdivisionFlag } from '../components/SubdivisionFlag';
import { COUNTRIES_DATABASE } from '../data/countriesData';
import { computeOfficialCountryMasteryPct } from '../maps/WorldGlobeView';

interface QuizPlayerProps {
  quiz: QuizDefinition;
  onExit: () => void;
  onComplete?: () => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({ quiz, onExit, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedInput, setTypedInput] = useState('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [revealedAnswer, setRevealedAnswer] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimitSec || 0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [previousAttempts, setPreviousAttempts] = useState<QuizAttempt[]>([]);

  const [missedQuestions, setMissedQuestions] = useState<
    Array<{ question: string; userAnswer: string; correctAnswer: string }>
  >([]);
  const [flashcardsCreated, setFlashcardsCreated] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Synchronously pre-shuffle options for ALL questions so render is NEVER out-of-sync
  const preShuffledOptions = useMemo(() => {
    return quiz.questions.map((q) => {
      if (!q.options || q.options.length === 0) return [];
      const opts = q.options.includes(q.correctAnswer)
        ? [...q.options]
        : [q.correctAnswer, ...q.options.slice(0, 3)];

      // Deterministic-enough in-place Fisher-Yates
      for (let i = opts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opts[i], opts[j]] = [opts[j], opts[i]];
      }
      return opts;
    });
  }, [quiz]);

  const currentQ: QuizQuestion = quiz.questions[currentIndex];

  // Timer countdown
  useEffect(() => {
    if (isCompleted || isAnswerSubmitted || (quiz.timeLimitSec || 0) <= 0) return;

    setTimeLeft(quiz.timeLimitSec || 0);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isAnswerSubmitted, isCompleted, quiz.timeLimitSec]);

  const handleTimeOut = () => {
    if (isAnswerSubmitted) return;
    sounds.playError();
    setIsAnswerSubmitted(true);
    setIsCorrect(false);
    setStreak(0);
    setMissedQuestions((prev) => [
      ...prev,
      {
        question: currentQ.prompt,
        userAnswer: 'Time Out',
        correctAnswer: currentQ.correctAnswer
      }
    ]);
  };

  const handleAnswerSubmit = (chosenAnswer: string) => {
    if (isAnswerSubmitted) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedOption(chosenAnswer);

    const normUser = normalizeAnswer(chosenAnswer);
    const normCorrect = normalizeAnswer(currentQ.correctAnswer);
    let match = normUser === normCorrect;

    if (!match && currentQ.acceptableAnswers) {
      match = currentQ.acceptableAnswers.some((a) => normalizeAnswer(a) === normUser);
    }

    setIsAnswerSubmitted(true);
    setIsCorrect(match);

    if (match) {
      sounds.playSuccess();
      setScore((s) => s + 1);
      setStreak((st) => {
        const next = st + 1;
        if (next > maxStreak) setMaxStreak(next);
        return next;
      });
    } else {
      sounds.playError();
      setStreak(0);
      setMissedQuestions((prev) => [
        ...prev,
        {
          question: currentQ.prompt,
          userAnswer: chosenAnswer || '(No answer)',
          correctAnswer: currentQ.correctAnswer
        }
      ]);
    }
  };

  const handleReveal = () => {
    setRevealedAnswer(true);
    handleAnswerSubmit('(Revealed)');
  };

  const handleNext = () => {
    sounds.playTap();
    if (currentIndex + 1 < quiz.questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setTypedInput('');
      setIsAnswerSubmitted(false);
      setIsCorrect(null);
      setShowHint(false);
      setRevealedAnswer(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    const totalTime = Math.round((Date.now() - startTimeRef.current) / 1000);
    setTimeSpent(totalTime);
    setIsCompleted(true);
    sounds.playFanfare();

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    const clampedScore = Math.min(score, quiz.questions.length);
    const accuracy =
      quiz.questions.length > 0
        ? Math.max(0, Math.min(100, Math.round((clampedScore / quiz.questions.length) * 100)))
        : 100;
    try {
      await db.quizAttempts.add({
        quizId: quiz.id,
        quizTitle: quiz.title,
        category: quiz.category,
        score: clampedScore,
        maxScore: quiz.questions.length,
        accuracy,
        timeSpentSec: totalTime,
        timestamp: Date.now(),
        countryCode: quiz.countryCode,
        continent: quiz.continent,
        missedQuestions
      });

      const allForQuiz = await db.quizAttempts.where('quizId').equals(quiz.id).toArray();
      allForQuiz.sort((a, b) => b.accuracy - a.accuracy || a.timeSpentSec - b.timeSpentSec);
      setPreviousAttempts(allForQuiz.slice(0, 5));

      const stats = await db.userStats.get('current');
      if (stats) {
        const today = new Date().toISOString().split('T')[0];
        const newTotalQ = stats.totalQuestionsAnswered + quiz.questions.length;
        const newCorrect = stats.correctAnswers + score;

        const cMastery = { ...stats.countryMastery };
        if (quiz.countryCode) {
          const cObj = COUNTRIES_DATABASE[quiz.countryCode.toUpperCase()];
          if (cObj) {
            const cAttempts = await db.quizAttempts
              .where('countryCode')
              .equals(cObj.id.toUpperCase())
              .toArray();
            cMastery[quiz.countryCode] = computeOfficialCountryMasteryPct(cObj, cAttempts);
          } else {
            cMastery[quiz.countryCode] = Math.min(100, Math.max(cMastery[quiz.countryCode] || 0, accuracy));
          }
        }

        await db.userStats.update('current', {
          totalQuizzesPlayed: stats.totalQuizzesPlayed + 1,
          totalQuestionsAnswered: newTotalQ,
          correctAnswers: newCorrect,
          totalTimeSpentSec: stats.totalTimeSpentSec + totalTime,
          countryMastery: cMastery,
          lastActiveDate: today
        });
      }
    } catch (e) {
      console.error('Error saving quiz attempt:', e);
    }

    if (onComplete) onComplete();
  };

  const handleAddToFlashcards = async () => {
    if (missedQuestions.length === 0 || flashcardsCreated) return;
    sounds.playTap();

    const deckId = `review-${quiz.id}-${Date.now()}`;
    const now = Date.now();

    await db.decks.put({
      id: deckId,
      title: `Review: ${quiz.title}`,
      description: `Targeted review deck created from ${missedQuestions.length} missed questions.`,
      cardCount: missedQuestions.length,
      createdDate: now,
      isBuiltIn: false
    });

    const cards = missedQuestions.map((m) => ({
      deckId,
      front: m.question,
      back: m.correctAnswer,
      category: quiz.category,
      countryCode: quiz.countryCode,
      interval: 1,
      repetition: 0,
      efactor: 2.5,
      dueDate: now
    }));

    await db.flashcards.bulkAdd(cards);
    setFlashcardsCreated(true);
    sounds.playSuccess();
  };

  if (isCompleted) {
    const accuracy = Math.round((score / quiz.questions.length) * 100);

    return (
      <div className="w-full h-[100dvh] flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-950 overflow-y-auto">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Quiz Complete!</h2>
            <p className="text-xs text-slate-400 mt-1">{quiz.title}</p>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <p className="text-[11px] text-slate-400">Score</p>
              <p className="text-xl font-bold text-white font-mono mt-0.5">
                {score} / {quiz.questions.length}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <p className="text-[11px] text-slate-400">Accuracy</p>
              <p className={`text-xl font-bold font-mono mt-0.5 ${accuracy >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {accuracy}%
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <p className="text-[11px] text-slate-400">Time</p>
              <p className="text-xl font-bold text-sky-400 font-mono mt-0.5">{timeSpent}s</p>
            </div>
          </div>

          {previousAttempts.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                Personal Leaderboard (Top Attempts)
              </p>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {previousAttempts.map((att, idx) => (
                  <div
                    key={att.id || idx}
                    className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800/80"
                  >
                    <span className="font-mono text-slate-400">
                      #{idx + 1} · {new Date(att.timestamp).toLocaleDateString()}
                    </span>
                    <span className="font-mono font-bold text-emerald-400">
                      {att.accuracy}% ({att.score}/{att.maxScore}) · {att.timeSpentSec}s
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {missedQuestions.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-left space-y-2">
              <p className="text-xs font-semibold text-rose-300">
                Missed {missedQuestions.length} Questions
              </p>
              <button
                onClick={handleAddToFlashcards}
                disabled={flashcardsCreated}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 hover:text-white flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
              >
                <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                <span>{flashcardsCreated ? '✓ Added to Flashcards' : 'Convert Missed to Flashcards'}</span>
              </button>
            </div>
          )}

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setScore(0);
                setStreak(0);
                setIsCompleted(false);
                setIsAnswerSubmitted(false);
                setSelectedOption(null);
                setTypedInput('');
                setMissedQuestions([]);
                setFlashcardsCreated(false);
                startTimeRef.current = Date.now();
              }}
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-sky-600/20"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
            </button>
            <button
              onClick={onExit}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-sm transition-colors"
            >
              Return to Catalog
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get synchronous, guaranteed pre-shuffled options for this question
  const renderOptions =
    preShuffledOptions[currentIndex] && preShuffledOptions[currentIndex].length > 0
      ? preShuffledOptions[currentIndex]
      : currentQ.options || [];

  return (
    <div className="w-full h-[100dvh] flex flex-col bg-slate-950 text-slate-100 select-none overflow-hidden">
      {/* Top Header Bar */}
      <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md flex items-center justify-between shrink-0">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit</span>
        </button>

        <div className="flex items-center gap-3">
          {streak > 1 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold font-mono animate-pulse">
              <Flame className="w-3.5 h-3.5" />
              <span>{streak}x Streak</span>
            </div>
          )}

          {timeLeft > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-sky-400 text-xs font-mono font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>{timeLeft}s</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-800">
        <div
          className="h-full bg-sky-500 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }}
        />
      </div>

      {/* Main Question Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center max-w-xl mx-auto w-full pb-16">
        <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>{quiz.category} · {quiz.difficulty}</span>
          <span className="font-mono">
            Question {currentIndex + 1} of {quiz.questions.length}
          </span>
        </div>

        {/* Visual Clue Rendering: "Where are you?" visual quizzes */}
        {currentQ.visualClue && (
          <div className="mb-4 flex flex-col items-center justify-center animate-in zoom-in-95 duration-200">
            {currentQ.visualClue.type === 'flag' && (
              <div className="flex flex-col items-center gap-1.5">
                {currentQ.countryCode && currentQ.countryCode.length === 2 && !currentQ.visualClue.value.includes(' ') ? (
                  <CountryFlag countryCode={currentQ.countryCode} size="xl" className="shadow-xl" />
                ) : (
                  <SubdivisionFlag name={currentQ.visualClue.value} size="lg" className="shadow-xl" />
                )}
                {currentQ.visualClue.label && (
                  <span className="text-[11px] font-mono text-slate-400 mt-1">{currentQ.visualClue.label}</span>
                )}
              </div>
            )}

            {currentQ.visualClue.type === 'road-shield' && (
              <div className="relative inline-flex flex-col items-center justify-center px-6 py-3 rounded-2xl bg-gradient-to-b from-blue-700 to-blue-900 border-2 border-white shadow-2xl text-white font-black tracking-wider">
                <span className="text-[10px] text-amber-300 uppercase tracking-widest font-mono">HIGHWAY SHIELD</span>
                <span className="text-2xl sm:text-3xl font-extrabold">{currentQ.visualClue.value}</span>
                {currentQ.visualClue.subValue && (
                  <span className="text-xs text-sky-200 mt-0.5">{currentQ.visualClue.subValue}</span>
                )}
              </div>
            )}

            {currentQ.visualClue.type === 'plate' && (
              <div className="inline-flex items-center bg-white text-slate-950 border-2 border-slate-700 rounded-lg shadow-xl overflow-hidden font-mono font-bold text-base sm:text-lg tracking-wider px-3 py-1.5">
                <div className="bg-blue-700 text-yellow-300 px-1.5 py-1 text-[10px] flex flex-col items-center justify-center mr-2 rounded-sm leading-none font-sans">
                  <span>★</span>
                  <span className="text-white font-bold">{currentQ.countryCode || 'EU'}</span>
                </div>
                <span>{currentQ.visualClue.value}</span>
              </div>
            )}

            {currentQ.visualClue.type === 'tel' && (
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-400 font-mono font-bold text-sm sm:text-base shadow-lg">
                <span className="text-xs text-slate-400 uppercase">LOCAL TEL:</span>
                <span className="tracking-widest">{currentQ.visualClue.value}</span>
              </div>
            )}

            {currentQ.visualClue.type === 'script' && (
              <div className="inline-flex flex-col items-center px-5 py-2.5 rounded-xl bg-slate-900 border border-sky-500/40 shadow-lg text-center">
                <span className="text-base sm:text-lg font-bold text-white">{currentQ.visualClue.value}</span>
                {currentQ.visualClue.subValue && (
                  <span className="text-xs text-sky-300 mt-0.5 italic">{currentQ.visualClue.subValue}</span>
                )}
              </div>
            )}
          </div>
        )}

        {!currentQ.visualClue && currentQ.flagEmoji && (
          <div className="mb-4 text-6xl sm:text-7xl select-none filter drop-shadow-md">
            {currentQ.flagEmoji}
          </div>
        )}

        <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-5 mb-5 shadow-lg text-center">
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
            {currentQ.prompt}
          </h3>
        </div>

        {currentQ.type === 'multiple-choice' || currentQ.type === 'flag' || currentQ.type === 'distance' ? (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {renderOptions.map((opt, i) => {
              const isSelected = selectedOption === opt;
              const isOptCorrect =
                normalizeAnswer(opt) === normalizeAnswer(currentQ.correctAnswer);

              let btnStyle = 'bg-slate-900/90 border-slate-800 hover:bg-slate-800/90 text-slate-200';
              if (isAnswerSubmitted) {
                if (isOptCorrect) {
                  btnStyle = 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-600/30 border-rose-500 text-rose-200 font-bold';
                } else {
                  btnStyle = 'bg-slate-900/40 border-slate-800/40 text-slate-500';
                }
              }

              return (
                <button
                  key={i}
                  disabled={isAnswerSubmitted}
                  onClick={() => handleAnswerSubmit(opt)}
                  className={`min-h-[52px] p-3.5 rounded-xl border text-sm font-medium transition-all text-left flex items-center justify-between active:scale-[0.98] ${btnStyle}`}
                >
                  <span className="leading-snug">{opt}</span>
                  {isAnswerSubmitted && isOptCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                  )}
                  {isAnswerSubmitted && isSelected && !isOptCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="w-full space-y-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (typedInput.trim()) {
                  handleAnswerSubmit(typedInput.trim());
                }
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                autoFocus
                disabled={isAnswerSubmitted}
                value={typedInput}
                onChange={(e) => setTypedInput(e.target.value)}
                placeholder="Type answer here..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-medium"
              />
              <button
                type="submit"
                disabled={isAnswerSubmitted || !typedInput.trim()}
                className="px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-semibold text-sm transition-colors"
              >
                Submit
              </button>
            </form>
          </div>
        )}

        {isAnswerSubmitted && (
          <div className="w-full mt-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 animate-in fade-in duration-200 space-y-2">
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="font-bold text-sm text-emerald-400">Correct!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span className="font-bold text-sm text-rose-400">
                    Incorrect. Correct Answer: <span className="text-white underline">{currentQ.correctAnswer}</span>
                  </span>
                </>
              )}
            </div>

            {currentQ.explanation && (
              <p className="text-xs text-slate-300 leading-relaxed pl-7">
                {currentQ.explanation}
              </p>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-md"
              >
                <span>{currentIndex + 1 === quiz.questions.length ? 'View Results' : 'Next Question'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {!isAnswerSubmitted && (
          <div className="w-full mt-4 flex items-center justify-between text-xs text-slate-400">
            {currentQ.hint ? (
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1 text-slate-400 hover:text-sky-400 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
              </button>
            ) : <div />}

            <button
              onClick={handleReveal}
              className="flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Reveal Answer</span>
            </button>
          </div>
        )}

        {showHint && currentQ.hint && (
          <div className="w-full mt-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-sky-300 animate-in fade-in">
            <span className="font-semibold">Hint: </span>{currentQ.hint}
          </div>
        )}
      </div>
    </div>
  );
};
