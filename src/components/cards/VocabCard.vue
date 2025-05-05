<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  word: {
    type: Object,
    required: true
  },
  showFront: {
    type: Boolean,
    default: true
  },
  showExample: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['flip', 'mark-correct', 'mark-incorrect']);

const isFlipped = ref(!props.showFront);
const flipTransitioning = ref(false);

watch(() => props.showFront, (newVal) => {
  isFlipped.value = !newVal;
});

const handleFlip = () => {
  flipTransitioning.value = true;
  emit('flip');
  
  // After flip animation completes
  setTimeout(() => {
    flipTransitioning.value = false;
  }, 300);
};

const difficultyClass = computed(() => {
  if (!props.word.difficulty && props.word.difficulty !== 0) return '';
  
  if (props.word.difficulty === 0) return 'difficulty-easy';
  if (props.word.difficulty <= 2) return 'difficulty-medium';
  return 'difficulty-hard';
});
</script>

<template>
  <div class="vocab-card-container">
    <div 
      class="vocab-card"
      :class="{ 
        'flipped': isFlipped, 
        'transitioning': flipTransitioning,
        [difficultyClass]: true 
      }"
      @click="handleFlip"
    >
      <div class="card-front">
        <div class="card-content">
          <div class="card-term">{{ word.term }}</div>
          <div class="card-instructions">Click to see the definition</div>
        </div>
      </div>
      
      <div class="card-back">
        <div class="card-content">
          <div class="card-definition">{{ word.definition }}</div>
          <div v-if="showExample && word.example" class="card-example">
            "{{ word.example }}"
          </div>
        </div>
      </div>
    </div>
    
    <div class="card-actions" v-if="isFlipped">
      <button 
        class="action-button incorrect" 
        @click.stop="emit('mark-incorrect')"
      >
        Difficult
      </button>
      <button 
        class="action-button correct" 
        @click.stop="emit('mark-correct')"
      >
        Easy
      </button>
    </div>
  </div>
</template>

<style scoped>
.vocab-card-container {
  perspective: 1000px;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.vocab-card {
  position: relative;
  width: 100%;
  height: 250px;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: var(--spacing-md);
}

.vocab-card.flipped {
  transform: rotateY(180deg);
}

.vocab-card.transitioning {
  pointer-events: none;
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--spacing-lg);
  background-color: var(--color-card);
  transition: background-color 0.3s;
}

.card-back {
  transform: rotateY(180deg);
}

.card-content {
  text-align: center;
}

.card-term {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  color: var(--color-text);
}

.card-definition {
  font-size: 1.25rem;
  margin-bottom: var(--spacing-md);
  color: var(--color-text);
}

.card-example {
  font-style: italic;
  font-size: 1rem;
  color: var(--color-text-secondary);
  border-left: 3px solid var(--color-primary-light);
  padding-left: var(--spacing-md);
  text-align: left;
  margin-top: var(--spacing-md);
}

.card-instructions {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: var(--spacing-lg);
}

.card-actions {
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-md);
}

.action-button {
  flex: 1;
  padding: var(--spacing-md);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.action-button.correct {
  background-color: var(--color-success);
  color: white;
  margin-left: var(--spacing-sm);
}

.action-button.incorrect {
  background-color: var(--color-error);
  color: white;
  margin-right: var(--spacing-sm);
}

.vocab-card.difficulty-easy .card-front {
  border-left: 5px solid var(--color-success);
}

.vocab-card.difficulty-medium .card-front {
  border-left: 5px solid var(--color-warning);
}

.vocab-card.difficulty-hard .card-front {
  border-left: 5px solid var(--color-error);
}

@media (max-width: 600px) {
  .vocab-card {
    height: 200px;
  }
  
  .card-term {
    font-size: 1.75rem;
  }
  
  .card-definition {
    font-size: 1.1rem;
  }
}
</style>