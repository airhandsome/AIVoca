import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useStatisticsStore = defineStore('statistics', () => {
  // State
  const stats = ref({
    totalReviewed: 0,
    correctCount: 0,
    incorrectCount: 0,
    streakDays: 0,
    lastStudyDate: null,
    studyHistory: {}, // format: { 'YYYY-MM-DD': count }
    deckStats: {} // format: { deckId: { reviewed: 0, correct: 0, incorrect: 0 } }
  });
  
  // Getters
  const accuracy = computed(() => {
    if (stats.value.totalReviewed === 0) return 0;
    return Math.round((stats.value.correctCount / stats.value.totalReviewed) * 100);
  });
  
  const studyStreak = computed(() => {
    return stats.value.streakDays;
  });
  
  const getDeckStats = computed(() => {
    return (deckId) => stats.value.deckStats[deckId] || { 
      reviewed: 0, 
      correct: 0, 
      incorrect: 0 
    };
  });
  
  // Actions
  function recordReview(deckId, isCorrect) {
    // Update total counts
    stats.value.totalReviewed++;
    if (isCorrect) {
      stats.value.correctCount++;
    } else {
      stats.value.incorrectCount++;
    }
    
    // Update deck specific stats
    if (!stats.value.deckStats[deckId]) {
      stats.value.deckStats[deckId] = {
        reviewed: 0,
        correct: 0,
        incorrect: 0
      };
    }
    
    stats.value.deckStats[deckId].reviewed++;
    if (isCorrect) {
      stats.value.deckStats[deckId].correct++;
    } else {
      stats.value.deckStats[deckId].incorrect++;
    }
    
    // Update streak
    const today = new Date().toISOString().split('T')[0];
    
    if (!stats.value.studyHistory) {
      stats.value.studyHistory = {};
    }
    
    if (!stats.value.studyHistory[today]) {
      stats.value.studyHistory[today] = 0;
    }
    
    stats.value.studyHistory[today]++;
    
    // Check if last study date was yesterday
    if (stats.value.lastStudyDate) {
      const lastDate = new Date(stats.value.lastStudyDate);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
        stats.value.streakDays++;
      } else if (lastDate.toISOString().split('T')[0] !== today) {
        // Reset streak if last study wasn't yesterday and not today
        stats.value.streakDays = 1;
      }
    } else {
      // First time studying
      stats.value.streakDays = 1;
    }
    
    stats.value.lastStudyDate = new Date().toISOString();
  }
  
  function resetStats() {
    stats.value = {
      totalReviewed: 0,
      correctCount: 0,
      incorrectCount: 0,
      streakDays: 0,
      lastStudyDate: null,
      studyHistory: {},
      deckStats: {}
    };
  }
  
  return {
    stats,
    accuracy,
    studyStreak,
    getDeckStats,
    recordReview,
    resetStats
  };
}, {
  persist: true
});