<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useDeckStore } from '../stores/decks';
import { useStatisticsStore } from '../stores/statistics';
import DeckCard from '../components/cards/DeckCard.vue';

const router = useRouter();
const deckStore = useDeckStore();
const statsStore = useStatisticsStore();
const { t } = useI18n();

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
      <h1>{{ t('home.welcomeMessage') }}</h1>
      <p>{{ t('home.welcomeDescription') }}</p>
      <div class="hero-actions">
        <button @click="navigateToDecks" class="primary-button">{{ t('home.browseDecks') }}</button>
        <button @click="navigateToCreateDeck" class="secondary-button">{{ t('home.createYourOwn') }}</button>
      </div>
    </section>
    
    <section class="stats-section">
      <div class="stat-card">
        <div class="stat-value">{{ studyStreak }}</div>
        <div class="stat-label">{{ t('home.streak') }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ statsStore.stats.totalReviewed }}</div>
        <div class="stat-label">{{ t('home.cardsReviewed') }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ accuracy }}%</div>
        <div class="stat-label">{{ t('home.accuracy') }}</div>
      </div>
    </section>
    
    <section v-if="hasStudiedDecks" class="recently-studied-section section">
      <h2>{{ t('home.recentlyStudied') }}</h2>
      <div class="decks-list">
        <DeckCard 
          v-for="deck in recentlyStudiedDecks" 
          :key="deck.id" 
          :deck="deck"
        />
      </div>
    </section>
    
    <section class="popular-decks-section section">
      <h2>{{ t('home.popularDecks') }}</h2>
      <div class="decks-list">
        <DeckCard 
          v-for="deck in topDecks" 
          :key="deck.id" 
          :deck="deck"
        />
      </div>
      <div class="view-all">
        <button @click="navigateToDecks" class="text-button">{{ t('home.viewAllDecks') }}</button>
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
  padding: var(--spacing-xl) var(--spacing-xl) calc(var(--spacing-xl) * 1.5);
  margin-bottom: var(--spacing-xl);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark, #2563eb) 100%);
  color: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.hero-section h1 {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-md);
  font-weight: 800;
  background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.hero-section p {
  font-size: 1.25rem;
  margin-bottom: var(--spacing-lg);
  opacity: 0.9;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
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