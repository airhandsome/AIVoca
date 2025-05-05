import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import defaultDecks from '../data/defaultDecks';

export const useDeckStore = defineStore('decks', () => {
  // State
  const decks = ref([...defaultDecks]);
  const userDecks = ref([]);
  
  // Getters
  const allDecks = computed(() => {
    return [...decks.value, ...userDecks.value];
  });
  
  const getDeckById = computed(() => {
    return (id) => allDecks.value.find(deck => deck.id === id);
  });
  
  const difficultWords = computed(() => {
    const words = [];
    allDecks.value.forEach(deck => {
      deck.words.forEach(word => {
        if (word.difficulty >= 4) {  // Difficulty threshold
          words.push({
            ...word,
            deckId: deck.id,
            deckName: deck.name
          });
        }
      });
    });
    return words;
  });
  
  // Actions
  function addUserDeck(deck) {
    userDecks.value.push({
      ...deck,
      id: `user-${Date.now()}`,
      created: new Date(),
      lastStudied: null
    });
  }
  
  function updateDeck(deckId, updates) {
    const index = allDecks.value.findIndex(d => d.id === deckId);
    if (index !== -1) {
      // If it's a default deck
      if (deckId.startsWith('default-')) {
        const deckIndex = decks.value.findIndex(d => d.id === deckId);
        if (deckIndex !== -1) {
          decks.value[deckIndex] = { ...decks.value[deckIndex], ...updates };
        }
      } else {
        // If it's a user deck
        const userDeckIndex = userDecks.value.findIndex(d => d.id === deckId);
        if (userDeckIndex !== -1) {
          userDecks.value[userDeckIndex] = { ...userDecks.value[userDeckIndex], ...updates };
        }
      }
    }
  }
  
  function deleteDeck(deckId) {
    // Only user decks can be deleted
    if (deckId.startsWith('user-')) {
      userDecks.value = userDecks.value.filter(d => d.id !== deckId);
    }
  }
  
  function updateWord(deckId, wordId, updates) {
    const deck = getDeckById.value(deckId);
    if (deck) {
      const wordIndex = deck.words.findIndex(w => w.id === wordId);
      if (wordIndex !== -1) {
        const updatedWords = [...deck.words];
        updatedWords[wordIndex] = { ...updatedWords[wordIndex], ...updates };
        
        updateDeck(deckId, { words: updatedWords });
      }
    }
  }
  
  function addWordToDeck(deckId, word) {
    const deck = getDeckById.value(deckId);
    if (deck) {
      const newWord = {
        id: `word-${Date.now()}`,
        ...word,
        difficulty: 0,
        lastReviewed: null,
        nextReview: new Date(),
        reviewCount: 0
      };
      
      updateDeck(deckId, { 
        words: [...deck.words, newWord]
      });
    }
  }
  
  function removeWordFromDeck(deckId, wordId) {
    const deck = getDeckById.value(deckId);
    if (deck) {
      updateDeck(deckId, {
        words: deck.words.filter(w => w.id !== wordId)
      });
    }
  }
  
  function recordWordReview(deckId, wordId, isCorrect) {
    const deck = getDeckById.value(deckId);
    if (deck) {
      const wordIndex = deck.words.findIndex(w => w.id === wordId);
      if (wordIndex !== -1) {
        const word = deck.words[wordIndex];
        
        // Update difficulty based on correct/incorrect answer
        let newDifficulty = word.difficulty;
        if (isCorrect) {
          newDifficulty = Math.max(0, word.difficulty - 1);
        } else {
          newDifficulty = Math.min(5, word.difficulty + 2);
        }
        
        // Calculate next review date based on spaced repetition algorithm
        const now = new Date();
        let nextReviewDays;
        
        if (isCorrect) {
          // If answered correctly, increase interval
          nextReviewDays = calculateNextReview(word.reviewCount, newDifficulty);
        } else {
          // If answered incorrectly, review soon
          nextReviewDays = 1;
        }
        
        const nextReview = new Date();
        nextReview.setDate(now.getDate() + nextReviewDays);
        
        updateWord(deckId, wordId, {
          difficulty: newDifficulty,
          lastReviewed: now,
          nextReview: nextReview,
          reviewCount: word.reviewCount + 1
        });
      }
    }
  }
  
  // Helper for spaced repetition calculation
  function calculateNextReview(reviewCount, difficulty) {
    // Simple spaced repetition algorithm
    // Base: 1, 3, 7, 14, 30, 90 days based on review count
    const baseIntervals = [1, 3, 7, 14, 30, 90];
    const reviewLevel = Math.min(reviewCount, baseIntervals.length - 1);
    
    // Adjust based on difficulty (0-5)
    // Lower difficulty = longer intervals
    const difficultyFactor = 1 - (difficulty / 10); // 1.0 to 0.5
    
    return Math.ceil(baseIntervals[reviewLevel] * difficultyFactor);
  }
  
  return {
    decks,
    userDecks,
    allDecks,
    getDeckById,
    difficultWords,
    addUserDeck,
    updateDeck,
    deleteDeck,
    updateWord,
    addWordToDeck,
    removeWordFromDeck,
    recordWordReview
  };
}, {
  persist: true
});