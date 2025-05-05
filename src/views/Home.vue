<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useDeckStore } from '../stores/decks';
import { useStatisticsStore } from '../stores/statistics';
import DeckCard from '../components/cards/DeckCard.vue';

const router = useRouter();
const deckStore = useDeckStore();
const statsStore = useStatisticsStore();

const recentlyStudiedDecks = computed(() => {
  return deckStore.allDecks
    .filter(deck => deck.lastStudied)
    .sort((a, b) => new Date(b.lastStudied) - new Date(a.lastStudied))
    .slice(0, 3);
});

const topDecks = computed(() => {
  return deckStore.allDecks
    .slice(0, 3);
});

const hasStudiedDecks = computed(() => {
  return recentlyStudiedDecks.value.length > 0;
});

const studyStreak = computed(() => {
  return statsStore.studyStreak;
});

const accuracy = computed(() => {
  return statsStore.accuracy;
});

const navigateToDecks = () => {
  router.push({ name: 'decks' });
};

const navigateToCreateDeck = () => {
  router.push({ name: 'create-deck' });
};
</script>

<template>
  <div class="home-page">
    <section class="hero-section card">
      <h1>Ready to expand your vocabulary?</h1>
      <p>Study with flashcards to memorize new words effectively.</p>
      <div class="hero-actions">
        <button @click="navigateToDecks" class="primary-button">Browse Decks</button>
        <button @click="navigateToCreateDeck" class="secondary-button">Create Your Own</button>
      </div>
    </section>
    
    <section class="stats-section">
      <div class="stat-card">
        <div class="stat-value">{{ studyStreak }}</div>
        <div class="stat-label">Day streak</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ statsStore.stats.totalReviewed }}</div>
        <div class="stat-label">Cards reviewed</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ accuracy }}%</div>
        <div class="stat-label">Accuracy</div>
      </div>
    </section>
    
    <section v-if="hasStudiedDecks" class="recently-studied-section section">
      <h2>Recently Studied</h2>
      <div class="decks-list">
        <DeckCard 
          v-for="deck in recentlyStudiedDecks" 
          :key="deck.id" 
          :deck="deck"
        />
      </div>
    </section>
    
    <section class="popular-decks-section section">
      <h2>Popular Decks</h2>
      <div class="decks-list">
        <DeckCard 
          v-for="deck in topDecks" 
          :key="deck.id" 
          :deck="deck"
        />
      </div>
      <div class="view-all">
        <button @click="navigateToDecks" class="text-button">View all decks</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  padding: var(--spacing-md) 0;
}

.hero-section {
  text-align: center;
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  background-color: var(--color-primary);
  color: white;
}

.hero-section h1 {
  font-size: 2rem;
  margin-bottom: var(--spacing-md);
}

.hero-section p {
  font-size: 1.1rem;
  margin-bottom: var(--spacing-lg);
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
}

.primary-button {
  background-color: white;
  color: var(--color-primary);
  border: none;
  font-weight: 600;
}

.secondary-button {
  background-color: transparent;
  border: 2px solid white;
  color: white;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  background-color: var(--color-card);
  border-radius: 12px;
  padding: var(--spacing-md);
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.decks-list {
  margin-top: var(--spacing-md);
}

.view-all {
  margin-top: var(--spacing-md);
  text-align: center;
}

.text-button {
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  font-weight: 600;
}

.text-button:hover {
  text-decoration: underline;
}

@media (max-width: 767px) {
  .hero-actions {
    flex-direction: column;
  }
  
  .stats-section {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }
}
</style>