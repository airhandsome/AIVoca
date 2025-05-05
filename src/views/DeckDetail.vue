<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDeckStore } from '../stores/decks';

const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

const router = useRouter();
const deckStore = useDeckStore();
const showDeleteModal = ref(false);
const searchQuery = ref('');

const deck = computed(() => {
  return deckStore.getDeckById(props.id);
});

const isUserDeck = computed(() => {
  return deck.value && deck.value.id.startsWith('user-');
});

const filteredWords = computed(() => {
  if (!searchQuery.value) return deck.value?.words || [];
  
  const query = searchQuery.value.toLowerCase();
  return (deck.value?.words || []).filter(word => 
    word.term.toLowerCase().includes(query) || 
    word.definition.toLowerCase().includes(query)
  );
});

const startStudySession = () => {
  router.push({ name: 'study-session', params: { deckId: props.id } });
};

const confirmDeleteDeck = () => {
  showDeleteModal.value = true;
};

const deleteDeck = () => {
  deckStore.deleteDeck(props.id);
  showDeleteModal.value = false;
  router.push({ name: 'decks' });
};

const cancelDelete = () => {
  showDeleteModal.value = false;
};

const wordDifficultyClass = (difficulty) => {
  if (difficulty === 0) return 'difficulty-easy';
  if (difficulty <= 2) return 'difficulty-medium';
  return 'difficulty-hard';
};
</script>

<template>
  <div v-if="deck" class="deck-detail-page">
    <div class="deck-header">
      <div class="deck-info">
        <h1>{{ deck.name }}</h1>
        <p class="deck-description">{{ deck.description }}</p>
        <div class="deck-meta">
          <span class="deck-count">{{ deck.words.length }} words</span>
          <span v-if="isUserDeck" class="user-deck-badge">Custom Deck</span>
        </div>
      </div>
      
      <div class="deck-actions">
        <button @click="startStudySession" class="study-button">
          Start Study Session
        </button>
        <button 
          v-if="isUserDeck" 
          @click="confirmDeleteDeck" 
          class="delete-button"
        >
          Delete Deck
        </button>
      </div>
    </div>
    
    <div class="word-search">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search words in this deck..." 
      />
    </div>
    
    <div class="words-list">
      <div class="words-header">
        <div class="word-term-header">Term</div>
        <div class="word-definition-header">Definition</div>
        <div class="word-difficulty-header">Difficulty</div>
      </div>
      
      <div 
        v-for="word in filteredWords" 
        :key="word.id" 
        class="word-item"
      >
        <div class="word-term">{{ word.term }}</div>
        <div class="word-definition">{{ word.definition }}</div>
        <div class="word-difficulty" :class="wordDifficultyClass(word.difficulty)">
          {{ word.difficulty === 0 ? 'Easy' : word.difficulty <= 2 ? 'Medium' : 'Hard' }}
        </div>
      </div>
      
      <div v-if="filteredWords.length === 0" class="no-words">
        <p>No words found matching your search.</p>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Delete Deck</h3>
        <p>Are you sure you want to delete "{{ deck.name }}"? This action cannot be undone.</p>
        <div class="modal-actions">
          <button @click="cancelDelete" class="cancel-button">Cancel</button>
          <button @click="deleteDeck" class="confirm-delete-button">Delete</button>
        </div>
      </div>
    </div>
  </div>
  
  <div v-else class="not-found">
    <h2>Deck not found</h2>
    <p>The deck you're looking for doesn't exist or has been deleted.</p>
    <button @click="router.push({ name: 'decks' })">
      Return to Decks
    </button>
  </div>
</template>

<style scoped>
.deck-detail-page {
  padding: var(--spacing-md) 0;
}

.deck-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-xl);
}

.deck-description {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
}

.deck-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.deck-count {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.user-deck-badge {
  background-color: var(--color-accent);
  color: white;
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 4px;
}

.deck-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.study-button {
  background-color: var(--color-primary);
  color: white;
}

.delete-button {
  background-color: transparent;
  border: 1px solid var(--color-error);
  color: var(--color-error);
}

.delete-button:hover {
  background-color: rgba(239, 68, 68, 0.05);
}

.word-search {
  margin-bottom: var(--spacing-lg);
}

.words-list {
  background-color: var(--color-card);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.words-header {
  display: grid;
  grid-template-columns: 1fr 2fr 100px;
  padding: var(--spacing-md);
  background-color: rgba(0, 0, 0, 0.03);
  font-weight: 600;
  border-bottom: 1px solid var(--color-border);
}

.word-item {
  display: grid;
  grid-template-columns: 1fr 2fr 100px;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  transition: background-color 0.2s;
}

.word-item:last-child {
  border-bottom: none;
}

.word-item:hover {
  background-color: rgba(0, 0, 0, 0.01);
}

.word-term {
  font-weight: 500;
}

.word-definition {
  color: var(--color-text-secondary);
}

.word-difficulty {
  text-align: center;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.difficulty-easy {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.difficulty-medium {
  background-color: rgba(245, 158, 11, 0.1);
  color: var(--color-warning);
}

.difficulty-hard {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--color-error);
}

.no-words {
  padding: var(--spacing-xl);
  text-align: center;
  color: var(--color-text-secondary);
}

.not-found {
  text-align: center;
  padding: var(--spacing-xxl);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--color-card);
  border-radius: 12px;
  padding: var(--spacing-lg);
  width: 90%;
  max-width: 500px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.cancel-button {
  background-color: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.confirm-delete-button {
  background-color: var(--color-error);
  color: white;
}

@media (max-width: 767px) {
  .deck-header {
    flex-direction: column;
  }
  
  .deck-actions {
    width: 100%;
    margin-top: var(--spacing-md);
  }
  
  .words-header, .word-item {
    grid-template-columns: 1fr 1fr;
  }
  
  .word-definition-header, .word-definition {
    display: none;
  }
}
</style>