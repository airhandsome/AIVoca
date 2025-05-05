<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useDeckStore } from '../stores/decks';
import DeckCard from '../components/cards/DeckCard.vue';

const router = useRouter();
const deckStore = useDeckStore();
const searchQuery = ref('');

const userDecks = computed(() => {
  if (!searchQuery.value) return deckStore.userDecks;
  
  const query = searchQuery.value.toLowerCase();
  return deckStore.userDecks.filter(deck => 
    deck.name.toLowerCase().includes(query) || 
    deck.description.toLowerCase().includes(query)
  );
});

const hasUserDecks = computed(() => {
  return userDecks.value.length > 0;
});

const createNewDeck = () => {
  router.push({ name: 'create-deck' });
};
</script>

<template>
  <div class="library-page">
    <div class="library-header">
      <h1>Your Vocabulary Library</h1>
      <button @click="createNewDeck" class="create-button">Create New Deck</button>
    </div>
    
    <div class="search-container">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search your decks..." 
        class="search-input"
      />
    </div>
    
    <div v-if="hasUserDecks" class="decks-grid">
      <DeckCard 
        v-for="deck in userDecks" 
        :key="deck.id" 
        :deck="deck"
      />
    </div>
    
    <div v-else class="empty-library">
      <div class="empty-state card">
        <div class="empty-icon">📚</div>
        <h2>Your library is empty</h2>
        <p>Create your first custom vocabulary deck to get started.</p>
        <button @click="createNewDeck" class="create-button">
          Create New Deck
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.library-page {
  padding: var(--spacing-md) 0;
}

.library-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.create-button {
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

.decks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-md);
}

.empty-library {
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

@media (max-width: 767px) {
  .library-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .create-button {
    margin-top: var(--spacing-md);
    width: 100%;
  }
  
  .decks-grid {
    grid-template-columns: 1fr;
  }
}
</style>