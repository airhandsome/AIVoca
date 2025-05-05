<script setup>
import { computed, ref } from 'vue';
import { useDeckStore } from '../stores/decks';
import DeckCard from '../components/cards/DeckCard.vue';

const deckStore = useDeckStore();
const searchQuery = ref('');

const filteredDecks = computed(() => {
  if (!searchQuery.value) return deckStore.allDecks;
  
  const query = searchQuery.value.toLowerCase();
  return deckStore.allDecks.filter(deck => 
    deck.name.toLowerCase().includes(query) || 
    deck.description.toLowerCase().includes(query)
  );
});

const defaultDecks = computed(() => {
  return filteredDecks.value.filter(deck => deck.id.startsWith('default-'));
});

const userDecks = computed(() => {
  return filteredDecks.value.filter(deck => deck.id.startsWith('user-'));
});

const hasUserDecks = computed(() => {
  return userDecks.value.length > 0;
});
</script>

<template>
  <div class="decks-page">
    <h1>All Vocabulary Decks</h1>
    
    <div class="search-container">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search decks..." 
        class="search-input"
      />
    </div>
    
    <section v-if="hasUserDecks" class="user-decks-section section">
      <h2>Your Custom Decks</h2>
      <div class="decks-list">
        <DeckCard 
          v-for="deck in userDecks" 
          :key="deck.id" 
          :deck="deck"
        />
      </div>
    </section>
    
    <section class="default-decks-section section">
      <h2>Default Decks</h2>
      <div class="decks-list">
        <DeckCard 
          v-for="deck in defaultDecks" 
          :key="deck.id" 
          :deck="deck"
        />
      </div>
    </section>

    <div v-if="filteredDecks.length === 0" class="no-results">
      <p>No decks found matching your search.</p>
    </div>
  </div>
</template>

<style scoped>
.decks-page {
  padding: var(--spacing-md) 0;
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

.no-results {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-secondary);
}
</style>