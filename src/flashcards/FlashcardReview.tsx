import React, { useState, useEffect } from 'react';
import {
  Layers,
  RotateCw,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Award
} from 'lucide-react';
import { db, Flashcard, FlashcardDeck } from '../database/db';
import { sounds } from '../utils/soundEngine';

export const FlashcardReview: React.FC = () => {
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [newHint, setNewHint] = useState('');
  const [isDeckCompleted, setIsDeckCompleted] = useState(false);

  // Load decks
  const loadDecks = async () => {
    const list = await db.decks.toArray();
    // Count cards per deck
    for (const d of list) {
      d.cardCount = await db.flashcards.where('deckId').equals(d.id).count();
    }
    setDecks(list);
  };

  useEffect(() => {
    loadDecks();
  }, []);

  // Open a deck for study
  const handleSelectDeck = async (deck: FlashcardDeck) => {
    sounds.playTap();
    setSelectedDeck(deck);
    const deckCards = await db.flashcards.where('deckId').equals(deck.id).toArray();
    // Sort so cards due soonest appear first
    deckCards.sort((a, b) => a.dueDate - b.dueDate);
    setCards(deckCards);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setIsDeckCompleted(deckCards.length === 0);
  };

  // SuperMemo SM-2 interval scheduler
  const handleRateCard = async (quality: 'again' | 'hard' | 'good' | 'easy') => {
    if (cards.length === 0) return;
    const currentCard = cards[currentCardIndex];

    let interval = currentCard.interval || 1;
    let repetition = currentCard.repetition || 0;
    let efactor = currentCard.efactor || 2.5;

    if (quality === 'again') {
      sounds.playError();
      interval = 1;
      repetition = 0;
      efactor = Math.max(1.3, efactor - 0.2);
    } else if (quality === 'hard') {
      sounds.playTap();
      interval = Math.max(1, Math.round(interval * 1.2));
      repetition += 1;
      efactor = Math.max(1.3, efactor - 0.15);
    } else if (quality === 'good') {
      sounds.playSuccess();
      if (repetition === 0) interval = 1;
      else if (repetition === 1) interval = 4;
      else interval = Math.round(interval * efactor);
      repetition += 1;
    } else if (quality === 'easy') {
      sounds.playSuccess();
      if (repetition === 0) interval = 3;
      else interval = Math.round(interval * efactor * 1.3);
      repetition += 1;
      efactor = Math.min(2.8, efactor + 0.15);
    }

    const dueDate = Date.now() + interval * 86400000;

    // Update in IndexedDB
    if (currentCard.id) {
      await db.flashcards.update(currentCard.id, {
        interval,
        repetition,
        efactor,
        dueDate,
        lastReviewed: Date.now()
      });
    }

    // Advance to next card or finish deck
    if (currentCardIndex + 1 < cards.length) {
      setCurrentCardIndex((i) => i + 1);
      setIsFlipped(false);
    } else {
      setIsDeckCompleted(true);
      sounds.playFanfare();
      loadDecks();
    }
  };

  // Add new custom card
  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeck || !newFront.trim() || !newBack.trim()) return;

    await db.flashcards.add({
      deckId: selectedDeck.id,
      front: newFront.trim(),
      back: newBack.trim(),
      hint: newHint.trim() || undefined,
      category: 'Custom',
      interval: 1,
      repetition: 0,
      efactor: 2.5,
      dueDate: Date.now()
    });

    setNewFront('');
    setNewBack('');
    setNewHint('');
    setShowAddModal(false);
    handleSelectDeck(selectedDeck);
    sounds.playSuccess();
  };

  // Delete Deck
  const handleDeleteDeck = async (deckId: string) => {
    sounds.playTap();
    await db.flashcards.where('deckId').equals(deckId).delete();
    await db.decks.delete(deckId);
    setSelectedDeck(null);
    loadDecks();
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 select-none overflow-hidden">
      {/* Top Bar */}
      <div className="px-4 py-3.5 border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-md flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          {selectedDeck && (
            <button
              onClick={() => {
                setSelectedDeck(null);
                loadDecks();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-sky-400" />
              <span>{selectedDeck ? selectedDeck.title : 'Spaced Repetition Flashcards'}</span>
            </h1>
            <p className="text-xs text-slate-400">
              {selectedDeck ? selectedDeck.description : 'Scientific memory retention powered by SM-2 algorithm.'}
            </p>
          </div>
        </div>

        {selectedDeck && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Card</span>
          </button>
        )}
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-4xl mx-auto w-full">
        {/* VIEW 1: DECK CATALOG */}
        {!selectedDeck && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Select a deck to review or practice:</span>
              <span>{decks.length} Decks</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {decks.map((d) => (
                <div
                  key={d.id}
                  onClick={() => handleSelectDeck(d)}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-850 transition-all cursor-pointer flex flex-col justify-between group shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20">
                        {d.cardCount || 0} Cards
                      </span>
                      {!d.isBuiltIn && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDeck(d.id);
                          }}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                      {d.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {d.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-sky-400">
                    <span>Start Review</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: ACTIVE CARD REVIEW */}
        {selectedDeck && !isDeckCompleted && cards.length > 0 && (
          <div className="max-w-md mx-auto space-y-6 flex flex-col items-center">
            {/* Counter */}
            <div className="w-full flex items-center justify-between text-xs text-slate-400">
              <span>Card {currentCardIndex + 1} of {cards.length}</span>
              <span className="font-mono text-sky-400">
                Interval: {cards[currentCardIndex].interval}d
              </span>
            </div>

            {/* 3D Flip Card Container */}
            <div
              onClick={() => {
                setIsFlipped(!isFlipped);
                sounds.playTap();
              }}
              className="w-full h-72 sm:h-80 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 shadow-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all relative overflow-hidden group select-none"
            >
              <div className="absolute top-4 right-4 flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                <RotateCw className="w-3 h-3" />
                <span>Tap to flip</span>
              </div>

              {!isFlipped ? (
                /* Card Front (Question) */
                <div className="space-y-3">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-sky-400">
                    Prompt / Question
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                    {cards[currentCardIndex].front}
                  </h3>
                  {cards[currentCardIndex].hint && (
                    <p className="text-xs text-slate-400 italic pt-2">
                      Hint: {cards[currentCardIndex].hint}
                    </p>
                  )}
                </div>
              ) : (
                /* Card Back (Answer) */
                <div className="space-y-3 animate-in fade-in zoom-in-95 duration-150">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-400">
                    Answer
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-emerald-300 leading-snug">
                    {cards[currentCardIndex].back}
                  </h3>
                </div>
              )}
            </div>

            {/* SM-2 Rating Controls (Revealed after flip) */}
            {isFlipped ? (
              <div className="w-full space-y-2 animate-in fade-in duration-200">
                <p className="text-center text-xs text-slate-400">Rate your recall accuracy:</p>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => handleRateCard('again')}
                    className="p-3 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-300 font-semibold text-xs transition-colors flex flex-col items-center"
                  >
                    <span>Again</span>
                    <span className="text-[10px] text-rose-400 font-mono mt-0.5">&lt;1d</span>
                  </button>
                  <button
                    onClick={() => handleRateCard('hard')}
                    className="p-3 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-amber-300 font-semibold text-xs transition-colors flex flex-col items-center"
                  >
                    <span>Hard</span>
                    <span className="text-[10px] text-amber-400 font-mono mt-0.5">2d</span>
                  </button>
                  <button
                    onClick={() => handleRateCard('good')}
                    className="p-3 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/30 text-sky-300 font-semibold text-xs transition-colors flex flex-col items-center"
                  >
                    <span>Good</span>
                    <span className="text-[10px] text-sky-400 font-mono mt-0.5">4d</span>
                  </button>
                  <button
                    onClick={() => handleRateCard('easy')}
                    className="p-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 font-semibold text-xs transition-colors flex flex-col items-center"
                  >
                    <span>Easy</span>
                    <span className="text-[10px] text-emerald-400 font-mono mt-0.5">7d</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center">Tap card to see answer and rate recall</p>
            )}
          </div>
        )}

        {/* VIEW 3: DECK COMPLETE */}
        {selectedDeck && (isDeckCompleted || cards.length === 0) && (
          <div className="max-w-md mx-auto text-center p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Deck Completed!</h2>
              <p className="text-xs text-slate-400 mt-1">
                All scheduled reviews for this deck have been completed.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedDeck(null);
                loadDecks();
              }}
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm transition-colors"
            >
              Back to Decks
            </button>
          </div>
        )}
      </div>

      {/* Modal: Add New Flashcard */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <form
            onSubmit={handleCreateCard}
            className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95"
          >
            <h3 className="text-base font-bold text-white">Add Flashcard to {selectedDeck?.title}</h3>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Front (Question / Prompt)</label>
              <textarea
                required
                rows={2}
                value={newFront}
                onChange={(e) => setNewFront(e.target.value)}
                placeholder="e.g. What is the capital of Belgium?"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Back (Answer)</label>
              <input
                required
                type="text"
                value={newBack}
                onChange={(e) => setNewBack(e.target.value)}
                placeholder="e.g. Brussels"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Optional Hint</label>
              <input
                type="text"
                value={newHint}
                onChange={(e) => setNewHint(e.target.value)}
                placeholder="e.g. Seat of the European Commission"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-md"
              >
                Save Card
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
