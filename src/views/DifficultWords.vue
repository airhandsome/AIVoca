<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useDeckStore } from '../stores/decks';

const router = useRouter();
const deckStore = useDeckStore();
const { t } = useI18n();
const searchQuery = ref('');

const difficultWords = computed(() => {
  return deckStore.difficultWords;
});

const filteredWords = computed(() => {
  if (!searchQuery.value) return difficultWords.value;
  
  const query = searchQuery.value.toLowerCase();
  return difficultWords.value.filter(word => 
    word.term.toLowerCase().includes(query) || 
    word.definition.toLowerCase().includes(query)
  );
});

const hasDifficultWords = computed(() => {
  return filteredWords.value.length > 0;
});

const goToWord = (deckId) => {
  router.push({ name: 'deck-detail', params: { id: deckId } });
};

const startStudySession = () => {
  // Create a temporary study session with difficult words
  // This would require modification of the study session view
  // to accept a list of words instead of just a deck ID
  
  // For now, we'll just redirect to the first deck that has difficult words
  if (difficultWords.value.length > 0) {
    router.push({ 
      name: 'study-session', 
      params: { deckId: difficultWords.value[0].deckId } 
    });
  }
};
</script>

<template>
  <div class="difficult-words-page">
    <div class="page-header">
      <h1>{{ t('difficultWords.title') }}</h1>
      <button 
        v-if="hasDifficultWords"
        @click="startStudySession" 
        class="study-button"
      >
        {{ t('difficultWords.reviewAll') }}
      </button>
    </div>
    
    <div class="search-container">
      <input 
        type="text" 
        v-model="searchQuery" 
        :placeholder="t('difficultWords.search')"
        class="search-input"
      />
    </div>
    
    <div v-if="hasDifficultWords" class="difficult-words-list">
      <div 
        v-for="word in filteredWords" 
        :key="word.id" 
        class="word-card"
        @click="goToWord(word.deckId)"
      >
        <div class="word-term">{{ word.term }}</div>
        <div class="word-definition">{{ word.definition }}</div>
        <div class="word-from">
          {{ t('difficultWords.from') }} <span class="deck-name">{{ word.deckName }}</span>
        </div>
      </div>
    </div>
    
    <div v-else class="empty-difficult">
      <div class="empty-state card">
        <div class="empty-icon">🎯</div>
        <h2>{{ t('difficultWords.emptyTitle') }}</h2>
        <p>{{ t('difficultWords.emptyDescription') }}</p>
        <button @click="router.push({ name: 'decks' })" class="browse-button">
          {{ t('difficultWords.browseDecks') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.difficult-words-page {
  padding: var(--spacing-md) 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.study-button {
  background-color: var(--color-primary);
  color: white;
}

.search-container {
  margin-bottom: var(--spacing-xl);
}

.search-input {
  width: 100%;
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 1rem;
}

.difficult-words-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-md);
}

.word-card {
  background-color: var(--color-card);
  border-radius: 12px;
  padding: var(--spacing-lg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-left: 4px solid var(--color-error);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.word-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.word-term {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  color: var(--color-text);
}

.word-definition {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
  font-size: 0.9rem;
}

.word-from {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--color-border);
}

.deck-name {
  color: var(--color-primary);
  font-weight: 500;
}

.empty-difficult {
  display: flex;
  justify-content: center;
  padding: var(--spacing-xxl) 0;
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xl);
  max-width: 400px;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
}

.empty-state h2 {
  margin-bottom: var(--spacing-md);
}

.empty-state p {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
}

.browse-button {
  background-color: var(--color-primary);
  color: white;
}

@media (max-width: 767px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .study-button {
    margin-top: var(--spacing-md);
    width: 100%;
  }
  
  .difficult-words-list {
    grid-template-columns: 1fr;
  }
}
</style>