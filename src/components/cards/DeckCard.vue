<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  deck: {
    type: Object,
    required: true
  }
});

const router = useRouter();

const navigateToDeck = () => {
  router.push({ name: 'deck-detail', params: { id: props.deck.id } });
};

const startStudy = (event) => {
  event.stopPropagation();
  router.push({ name: 'study-session', params: { deckId: props.deck.id } });
};

const isUserDeck = computed(() => {
  return props.deck.id.startsWith('user-');
});

const formattedDate = computed(() => {
  if (!props.deck.lastStudied) return 'Never studied';
  
  const date = new Date(props.deck.lastStudied);
  return date.toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
});

const wordCount = computed(() => {
  return props.deck.words?.length || 0;
});
</script>

<template>
  <div class="deck-card" @click="navigateToDeck">
    <div class="deck-icon">{{ deck.icon || '📚' }}</div>
    <div class="deck-info">
      <h3 class="deck-name">{{ deck.name }}</h3>
      <p class="deck-description">{{ deck.description }}</p>
      <div class="deck-stats">
        <span class="deck-stat">{{ wordCount }} words</span>
        <span class="deck-stat">{{ formattedDate }}</span>
        <span v-if="isUserDeck" class="deck-user-badge">My Deck</span>
      </div>
    </div>
    <button class="study-button" @click="startStudy">Study</button>
  </div>
</template>

<style scoped>
.deck-card {
  display: flex;
  align-items: center;
  background-color: var(--color-card);
  border-radius: 12px;
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.deck-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.deck-icon {
  font-size: 2rem;
  margin-right: var(--spacing-md);
  background-color: rgba(59, 130, 246, 0.1);
  border-radius: 12px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.deck-info {
  flex: 1;
}

.deck-name {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
}

.deck-description {
  margin: var(--spacing-xs) 0;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 500px;
}

.deck-stats {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.deck-stat {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.deck-user-badge {
  font-size: 0.75rem;
  background-color: var(--color-accent);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
}

.study-button {
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  padding: var(--spacing-sm) var(--spacing-md);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.study-button:hover {
  background-color: var(--color-primary-dark);
}

@media (max-width: 600px) {
  .deck-card {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .deck-icon {
    margin-bottom: var(--spacing-sm);
    margin-right: 0;
  }
  
  .deck-description {
    max-width: 100%;
  }
  
  .deck-stats {
    margin-bottom: var(--spacing-sm);
  }
  
  .study-button {
    width: 100%;
  }
}

@media (min-width: 601px) and (max-width: 900px) {
  .deck-description {
    max-width: 300px;
  }
}
</style>