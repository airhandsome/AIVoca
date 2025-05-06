<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDeckStore } from '../stores/decks';
import { useStudyStore } from '../stores/study';
import { useStatisticsStore } from '../stores/statistics';
import { useSettingsStore } from '../stores/settings';
import { useI18n } from 'vue-i18n';
import VocabCard from '../components/cards/VocabCard.vue';

const props = defineProps({
  deckId: {
    type: String,
    required: true
  }
});

const router = useRouter();
const deckStore = useDeckStore();
const studyStore = useStudyStore();
const statsStore = useStatisticsStore();
const settingsStore = useSettingsStore();
const { t } = useI18n();

const sessionComplete = ref(false);
const currentCardIndex = ref(0);
const showFront = ref(true);
const correctCount = ref(0);
const incorrectCount = ref(0);
const studyCards = ref([]);

const deck = computed(() => {
  return deckStore.getDeckById(props.deckId);
});

const currentCard = computed(() => {
  if (studyCards.value.length === 0) return null;
  return studyCards.value[currentCardIndex.value];
});

const progress = computed(() => {
  if (studyCards.value.length === 0) return 0;
  return (currentCardIndex.value / studyCards.value.length) * 100;
});

const showExample = computed(() => {
  return settingsStore.settings.showExamples;
});

onMounted(async () => {
  if (!deck.value) {
    router.push({ name: 'decks' });
    return;
  }
  
    await studyStore.loadDeck(props.deckId);
    studyCards.value = studyStore.wordList;
});

function prepareStudySession() {
  const maxCards = settingsStore.settings.cardsPerSession;
  
  // Handle default deck format
  let wordsToStudy = [...deck.value.words];
  
  if (settingsStore.settings.reviewNewCardsFirst) {
    // Sort by review count (ascending) and then by difficulty (descending)
    wordsToStudy.sort((a, b) => {
      if (a.reviewCount === b.reviewCount) {
        return b.difficulty - a.difficulty; // Higher difficulty first
      }
      return a.reviewCount - b.reviewCount; // Fewer reviews first
    });
  } else {
    // Sort by next review date (ascending)
    wordsToStudy.sort((a, b) => {
      return new Date(a.nextReview) - new Date(b.nextReview);
    });
  }
  
  // Take only the number of cards specified in settings
  studyCards.value = wordsToStudy.slice(0, maxCards);
  
  // Update the deck's last studied date
  deckStore.updateDeck(props.deckId, {
    lastStudied: new Date()
  });
}

function handleFlip() {
  showFront.value = !showFront.value;
}

function handleMarkCorrect() {
  if (currentCard.value) {
    if (!deck.value.source?.includes('BeiShiGaoZhong')) {
      deckStore.recordWordReview(props.deckId, currentCard.value.id, true);
    }
    statsStore.recordReview(props.deckId, true);
    correctCount.value++;
    nextCard();
  }
}

function handleMarkIncorrect() {
  if (currentCard.value) {
    if (!deck.value.source?.includes('BeiShiGaoZhong')) {
      deckStore.recordWordReview(props.deckId, currentCard.value.id, false);
    }
    statsStore.recordReview(props.deckId, false);
    incorrectCount.value++;
    nextCard();
  }
}

function nextCard() {
  if (currentCardIndex.value < studyCards.value.length - 1) {
    currentCardIndex.value++;
    showFront.value = true;
  } else {
    sessionComplete.value = true;
    // Update deck progress
    deckStore.updateDeckProgress(props.deckId, Math.round((correctCount.value / studyCards.value.length) * 100));
  }
}

function returnToDeck() {
  router.push({ name: 'deck-detail', params: { id: props.deckId } });
}

function startNewSession() {
  currentCardIndex.value = 0;
  correctCount.value = 0;
  incorrectCount.value = 0;
  sessionComplete.value = false;
  showFront.value = true;
  if (deck.value.source?.includes('BeiShiGaoZhong')) {
    studyStore.loadDeck(props.deckId);
    studyCards.value = studyStore.wordList;
  } else {
    prepareStudySession();
  }
}

function exitSession() {
  router.push({ name: 'home' });
}
</script>

<template>
  <div v-if="deck" class="study-session">
    <div v-if="!sessionComplete" class="study-container">
      <div class="study-header">
        <h2>{{ t('study.title') }}: {{ deck.name }}</h2>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
        </div>
        <div class="progress-stats">
          <span>{{ currentCardIndex + 1 }} / {{ studyCards.length }}</span>
          <span>{{ correctCount }} {{ t('study.easy') }} · {{ incorrectCount }} {{ t('study.difficult') }}</span>
        </div>
      </div>
      
      <div class="card-container">
        <VocabCard 
          v-if="currentCard"
          :word="currentCard"
          :showFront="showFront"
          :showExample="showExample"
          @flip="handleFlip"
          @mark-correct="handleMarkCorrect"
          @mark-incorrect="handleMarkIncorrect"
        />
      </div>
      
      <div class="session-controls">
        <button @click="exitSession" class="exit-button">{{ t('study.finishSession') }}</button>
      </div>
    </div>
    
    <div v-else class="session-complete">
      <div class="complete-card card">
        <h2>{{ t('study.finishSession') }} 🎉</h2>
        
        <div class="results-summary">
          <div class="result-item">
            <div class="result-label">{{ t('study.title') }}</div>
            <div class="result-value">{{ studyCards.length }}</div>
          </div>
          <div class="result-item">
            <div class="result-label">{{ t('study.easy') }}</div>
            <div class="result-value correct">{{ correctCount }}</div>
          </div>
          <div class="result-item">
            <div class="result-label">{{ t('study.difficult') }}</div>
            <div class="result-value incorrect">{{ incorrectCount }}</div>
          </div>
          <div class="result-item">
            <div class="result-label">{{ t('study.accuracy') }}</div>
            <div class="result-value">
              {{ Math.round((correctCount / studyCards.length) * 100) }}%
            </div>
          </div>
        </div>
        
        <div class="complete-actions">
          <button @click="startNewSession" class="new-session-button">
            {{ t('study.nextWord') }}
          </button>
          <button @click="returnToDeck" class="return-button">
            {{ t('study.finishSession') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.study-session {
  height: calc(100vh - 140px);
  display: flex;
  flex-direction: column;
}

.study-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.study-header {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.progress-bar {
  height: 8px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  overflow: hidden;
  margin: var(--spacing-md) 0;
}

.progress-fill {
  height: 100%;
  background-color: var(--color-primary);
  transition: width 0.3s ease;
}

.progress-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.card-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-xl);
}

.session-controls {
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-xl);
}

.exit-button {
  background-color: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}

.exit-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.session-complete {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.complete-card {
  text-align: center;
  padding: var(--spacing-xl);
  max-width: 500px;
  width: 100%;
}

.complete-card h2 {
  margin-bottom: var(--spacing-lg);
}

.results-summary {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.result-item {
  padding: var(--spacing-md);
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

.result-label {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
}

.result-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
}

.result-value.correct {
  color: var(--color-success);
}

.result-value.incorrect {
  color: var(--color-error);
}

.complete-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.new-session-button {
  background-color: var(--color-primary);
  color: white;
}

.return-button {
  background-color: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

@media (min-width: 768px) {
  .complete-actions {
    flex-direction: row;
    justify-content: center;
  }
}
</style>