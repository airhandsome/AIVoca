<script setup>
import { ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSettingsStore } from '../../stores/settings';

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

const { t } = useI18n();
const settingsStore = useSettingsStore();
const emit = defineEmits(['flip', 'mark-correct', 'mark-incorrect']);

const isFlipped = ref(!props.showFront);
const flipTransitioning = ref(false);
const ukAudio = ref(null);
const usAudio = ref(null);

const isDarkMode = computed(() => {
  return settingsStore.darkMode;
});

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

const playPronunciation = async (type) => {
  try {
    const word = props.word.term;
    const audio = new Audio();
    
    if (type === 'uk') {
      // 使用 Cambridge Dictionary 的英式发音      
      audio.src = `https://dict.youdao.com/dictvoice?audio=${word}&type=1`;
    } else {
      // 使用 Cambridge Dictionary 的美式发音
      audio.src = `https://dict.youdao.com/dictvoice?audio=${word}&type=2`;
    }
    
    await audio.play();
  } catch (error) {
    console.error('Failed to play pronunciation:', error);
  }
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
        [difficultyClass]: true,
        'dark-mode': isDarkMode
      }"
      @click="handleFlip"
    >
      <div class="card-front">
        <div class="card-content">
          <div class="card-term">{{ word.term }}</div>
          <div class="pronunciation-buttons">
            <button class="pron-button uk" @click.stop="playPronunciation('uk')" :title="t('study.ukPron')">
              {{ t('study.ukPron') }}
            </button>
            <button class="pron-button us" @click.stop="playPronunciation('us')" :title="t('study.usPron')">
              {{ t('study.usPron') }}
            </button>
          </div>
          <div class="card-instructions">{{ t('study.clickToSee') }}</div>
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
        {{ t('study.difficult') }}
      </button>
      <button 
        class="action-button correct" 
        @click.stop="emit('mark-correct')"
      >
        {{ t('study.easy') }}
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
  height: 300px;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: var(--spacing-md);
}

.vocab-card.dark-mode {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
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
  transition: all 0.3s;
}

.dark-mode .card-front,
.dark-mode .card-back {
  background-color: var(--color-card-dark, #2d3748);
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

.pronunciation-buttons {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
  margin: var(--spacing-md) 0;
}

.pron-button {
  background: none;
  border: 2px solid var(--color-primary-light, #93C5FD);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: 20px;
  min-width: 80px;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: relative;
  background-color: rgba(147, 197, 253, 0.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  color: var(--color-text);
  white-space: nowrap;
}

.pron-button:hover {
  transform: translateY(-2px);
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.dark-mode .pron-button {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  color: var(--color-text);
}

.dark-mode .pron-button:hover {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
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
    height: 250px;
  }
  
  .card-term {
    font-size: 1.75rem;
  }
  
  .card-definition {
    font-size: 1.1rem;
  }
  
  .pronunciation-buttons {
    gap: var(--spacing-md);
  }
  
  .pron-button {
    font-size: 0.8rem;
    min-width: 70px;
    padding: var(--spacing-xs) var(--spacing-sm);
  }
}
</style>