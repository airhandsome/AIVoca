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

const isDarkMode = computed(() => {
  return settingsStore.darkMode;
});

// 获取单词内容
const wordContent = computed(() => {
  if (!props.word?.content?.word?.content) return null;
  return props.word.content.word.content;
});

// 获取翻译数组
const translations = computed(() => {
  return wordContent.value?.trans || [];
});

// 获取例句数组
const sentences = computed(() => {
  return wordContent.value?.sentence?.sentences || [];
});

// 获取短语数组
const phrases = computed(() => {
  return wordContent.value?.phrase?.phrases || [];
});

watch(() => props.showFront, (newVal) => {
  isFlipped.value = !newVal;
});

const handleFlip = () => {
  flipTransitioning.value = true;
  emit('flip');
  
  setTimeout(() => {
    flipTransitioning.value = false;
  }, 300);
};

const playPronunciation = async (type) => {
  try {
    const word = props.word.headWord;
    const audio = new Audio();
    
    if (type === 'uk') {
      audio.src = `https://dict.youdao.com/dictvoice?audio=${word}&type=1`;
    } else {
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
          <div class="word-header">
            <div class="card-term">{{ word.headWord }}</div>
            <div class="phonetic-container">
              <div class="phonetic uk" @click.stop="playPronunciation('uk')">
                <span class="label">UK</span>
                <span class="phonetic-text">{{ wordContent?.ukphone }}</span>
                <span class="speaker-icon">🔊</span>
              </div>
              <div class="phonetic us" @click.stop="playPronunciation('us')">
                <span class="label">US</span>
                <span class="phonetic-text">{{ wordContent?.usphone }}</span>
                <span class="speaker-icon">🔊</span>
              </div>
            </div>
          </div>
          <div class="card-instructions">{{ t('study.clickToSee') }}</div>
        </div>
      </div>
      
      <div class="card-back">
        <div class="card-content">
          <!-- 单词和发音 -->
          <div class="word-header">
            <div class="card-term">{{ word.headWord }}</div>
            <div class="phonetic-container">
              <div class="phonetic uk" @click.stop="playPronunciation('uk')">
                <span class="label">UK</span>
                <span class="phonetic-text">{{ wordContent?.ukphone }}</span>
                <span class="speaker-icon">🔊</span>
              </div>
              <div class="phonetic us" @click.stop="playPronunciation('us')">
                <span class="label">US</span>
                <span class="phonetic-text">{{ wordContent?.usphone }}</span>
                <span class="speaker-icon">🔊</span>
              </div>
            </div>
          </div>

          <!-- 词性和释义 -->
          <div class="translations">
            <div v-for="(trans, index) in translations" :key="index" class="translation-item">
              <span class="pos">{{ trans.pos }}</span>
              <div class="definitions">
                <div class="cn-definition">{{ trans.tranCn }}</div>
                <div class="en-definition">{{ trans.tranOther }}</div>
              </div>
            </div>
          </div>

          <!-- 例句 -->
          <div v-if="showExample && sentences.length > 0" class="examples-section">
            <h3>{{ t('study.examples') }}</h3>
            <div v-for="(sentence, index) in sentences" :key="index" class="example-item">
              <div class="en-sentence">{{ sentence.sContent }}</div>
              <div class="cn-sentence">{{ sentence.sCn }}</div>
            </div>
          </div>

          <!-- 短语 -->
          <div v-if="phrases.length > 0" class="phrases-section">
            <h3>{{ t('study.phrases') }}</h3>
            <div class="phrases-grid">
              <div v-for="(phrase, index) in phrases" :key="index" class="phrase-item">
                <span class="phrase-en">{{ phrase.pContent }}</span>
                <span class="phrase-cn">{{ phrase.pCn }}</span>
              </div>
            </div>
          </div>

          <!-- 记忆方法 -->
          <div v-if="wordContent?.remMethod" class="memory-method">
            <h3>{{ t('study.memoryTip') }}</h3>
            <p>{{ wordContent.remMethod.val }}</p>
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
  max-width: 600px;
  margin: 0 auto;
}

.vocab-card {
  position: relative;
  width: 100%;
  height: 500px;
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
  padding: var(--spacing-lg);
  background-color: var(--color-card);
  transition: all 0.3s;
  overflow-y: auto;
}

.dark-mode .card-front,
.dark-mode .card-back {
  background-color: var(--color-card-dark, #2d3748);
}

.card-back {
  transform: rotateY(180deg);
  padding: var(--spacing-xl);
}

.card-content {
  text-align: center;
}

.word-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.dark-mode .word-header {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.card-term {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
  color: var(--color-text);
}

.phonetic-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
}

.phonetic {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background-color: rgba(var(--color-primary-rgb), 0.05);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.phonetic:hover {
  background-color: rgba(var(--color-primary-rgb), 0.1);
  transform: translateY(-1px);
}

.speaker-icon {
  font-size: 1.2rem;
  opacity: 0.7;
  transition: all 0.2s ease;
}

.phonetic:hover .speaker-icon {
  opacity: 1;
  transform: scale(1.1);
}

.label {
  font-weight: 600;
  color: var(--color-primary);
  font-size: 0.9rem;
}

.phonetic-text {
  color: var(--color-text-secondary);
  font-family: monospace;
  font-size: 1rem;
}

.pronunciation-buttons {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
  margin: var(--spacing-md) 0;
}

.pron-button {
  background: none;
  border: 2px solid var(--color-primary-light);
  font-size: 1.2rem;
  cursor: pointer;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: 8px;
  min-width: 80px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  transition: all 0.2s ease;
  background-color: white;
  color: var(--color-text);
}

.pron-button:hover {
  transform: translateY(-2px);
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.dark-mode .pron-button {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: var(--color-primary);
  color: var(--color-text);
}

.translations {
  text-align: left;
  margin: var(--spacing-xl) 0;
  padding: 0 var(--spacing-md);
}

.translation-item {
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  background-color: rgba(var(--color-primary-rgb), 0.03);
  border-radius: 8px;
  border-left: 4px solid var(--color-primary);
}

.pos {
  display: inline-block;
  padding: 4px 12px;
  background-color: var(--color-primary);
  color: white;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-bottom: var(--spacing-md);
}

.definitions {
  margin-left: var(--spacing-sm);
}

.cn-definition {
  font-size: 1.2rem;
  margin-bottom: var(--spacing-sm);
  color: var(--color-text);
  line-height: 1.5;
}

.en-definition {
  font-size: 1rem;
  color: var(--color-text-secondary);
  line-height: 1.4;
}

.examples-section,
.phrases-section,
.memory-method {
  margin-top: var(--spacing-xl);
  text-align: left;
  padding: var(--spacing-md);
  background-color: rgba(var(--color-primary-rgb), 0.03);
  border-radius: 8px;
}

h3 {
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.example-item {
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.dark-mode .example-item {
  background-color: rgba(255, 255, 255, 0.05);
}

.en-sentence {
  margin-bottom: var(--spacing-sm);
  color: var(--color-text);
  line-height: 1.5;
}

.cn-sentence {
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  line-height: 1.4;
}

.phrases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-md);
}

.phrase-item {
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: var(--spacing-md);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.dark-mode .phrase-item {
  background-color: rgba(255, 255, 255, 0.05);
}

.phrase-en {
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
}

.phrase-cn {
  color: var(--color-text-secondary);
  font-size: 0.95rem;
}

.memory-method {
  background-color: rgba(var(--color-primary-rgb), 0.05);
  padding: var(--spacing-lg);
  border-radius: 8px;
  margin: var(--spacing-xl) 0;
}

.memory-method p {
  color: var(--color-text);
  font-size: 1rem;
  line-height: 1.6;
}

.card-actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-md);
}

.action-button {
  padding: var(--spacing-md) var(--spacing-xl);
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
}

.action-button.incorrect {
  background-color: var(--color-error-light, #FEE2E2);
  color: var(--color-error, #DC2626);
}

.action-button.incorrect:hover {
  background-color: var(--color-error, #DC2626);
  color: white;
  transform: translateY(-2px);
}

.action-button.correct {
  background-color: var(--color-success-light, #DCFCE7);
  color: var(--color-success, #16A34A);
}

.action-button.correct:hover {
  background-color: var(--color-success, #16A34A);
  color: white;
  transform: translateY(-2px);
}

@media (max-width: 600px) {
  .vocab-card {
    height: 550px;
  }
  
  .card-term {
    font-size: 2rem;
  }
  
  .phrases-grid {
    grid-template-columns: 1fr;
  }
  
  .phonetic-container {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .action-button {
    padding: var(--spacing-sm) var(--spacing-md);
    min-width: 100px;
    font-size: 0.95rem;
  }
}

@media (min-width: 1024px) {
  .vocab-card {
    height: 600px;
    max-width: 800px;
    margin: 0 auto var(--spacing-md);
  }
}
</style>