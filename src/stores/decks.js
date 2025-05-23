import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

export const useDeckStore = defineStore('decks', () => {
  // State
  const decks = ref([
    {
      id: 'default-beishigaozhong1',
      name: '北师大高中必修一',
      description: '北师大版高中英语必修一词汇',
      source: 'https://a.unity.cn/client_api/v1/buckets/a327c6aa-874f-4f8c-b287-ab44d9b8d2ea/content/BeiShiGaoZhong_1.json',
      totalWords: 227,
      progress: 0,
      lastStudied: null,
      coverColor: '#4F46E5'
    },
    {
      id: 'default-CET4_1',
      name: '大学四级词汇',
      description: '大学四级词汇',
      source: 'https://a.unity.cn/client_api/v1/buckets/a327c6aa-874f-4f8c-b287-ab44d9b8d2ea/content/CET4_1.json',
      totalWords: 1162,
      progress: 0,
      lastStudied: null,
      coverColor: '#4F46E5'
    },
  ]);
  const userDecks = ref([]);
  
  // Getters
  const allDecks = computed(() => {
    const { t } = useI18n();
    return [...decks.value.map(deck => {
      const translationKey = deck.id.replace('default-', 'default');
      return {
        ...deck,
        name: t(`decks.${translationKey}.name`),
        description: t(`decks.${translationKey}.description`)
      };
    }), ...userDecks.value];
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
    const newDeck = {
      ...deck,
      id: `user-${Date.now()}`,
      created: new Date(),
      lastStudied: null
    };
    userDecks.value.push(newDeck);
  }
  
  function updateDeck(deckId, updates) {
    const deck = getDeckById.value(deckId);
    if (deck) {
      Object.assign(deck, updates);
    }
  }
  
  function deleteDeck(deckId) {
    const index = userDecks.value.findIndex(d => d.id === deckId);
    if (index !== -1) {
      userDecks.value.splice(index, 1);
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
  
  const updateDeckProgress = (deckId, progress) => {
    const deck = getDeckById.value(deckId);
    if (deck) {
      deck.progress = progress;
      deck.lastStudied = new Date().toISOString();
    }
  };
  
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
    recordWordReview,
    updateDeckProgress
  };
}, {
  persist: {
    paths: ['userDecks']
  }
});