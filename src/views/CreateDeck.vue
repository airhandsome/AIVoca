<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDeckStore } from '../stores/decks';

const router = useRouter();
const deckStore = useDeckStore();

// Deck form data
const deckName = ref('');
const deckDescription = ref('');
const deckIcon = ref('📚');

// Word form data
const words = ref([
  { term: '', definition: '', example: '' }
]);

// Validation state
const errors = ref({
  deckName: '',
  words: []
});

// Available icons for selection
const availableIcons = [
  '📚', '🔤', '📖', '🎓', '💼', '🗣️', '✏️', '📝', '🔍', '🌐', '📰', '🧠'
];

const validateForm = () => {
  let isValid = true;
  errors.value = { deckName: '', words: [] };
  
  // Validate deck name
  if (!deckName.value.trim()) {
    errors.value.deckName = 'Deck name is required';
    isValid = false;
  }
  
  // Validate words
  const validWords = words.value.filter(word => 
    word.term.trim() && word.definition.trim()
  );
  
  if (validWords.length === 0) {
    errors.value.words = ['At least one word with term and definition is required'];
    isValid = false;
  } else {
    errors.value.words = words.value.map(word => {
      if (!word.term.trim() && word.definition.trim()) {
        return 'Term is required';
      }
      if (word.term.trim() && !word.definition.trim()) {
        return 'Definition is required';
      }
      return '';
    });
    
    // Check if any word has error
    if (errors.value.words.some(error => error)) {
      isValid = false;
    }
  }
  
  return isValid;
};

const addWord = () => {
  words.value.push({ term: '', definition: '', example: '' });
};

const removeWord = (index) => {
  if (words.value.length > 1) {
    words.value.splice(index, 1);
  }
};

const selectIcon = (icon) => {
  deckIcon.value = icon;
};

const createDeck = () => {
  if (!validateForm()) return;
  
  // Filter out empty words
  const validWords = words.value.filter(word => 
    word.term.trim() && word.definition.trim()
  );
  
  const newDeck = {
    name: deckName.value.trim(),
    description: deckDescription.value.trim(),
    icon: deckIcon.value,
    words: validWords.map(word => ({
      term: word.term.trim(),
      definition: word.definition.trim(),
      example: word.example.trim()
    }))
  };
  
  deckStore.addUserDeck(newDeck);
  router.push({ name: 'library' });
};

const cancelCreation = () => {
  router.push({ name: 'library' });
};
</script>

<template>
  <div class="create-deck-page">
    <h1>Create New Vocabulary Deck</h1>
    
    <div class="create-form card">
      <div class="form-section">
        <h2>Deck Information</h2>
        
        <div class="form-group">
          <label for="deck-name">Deck Name*</label>
          <input 
            type="text" 
            id="deck-name" 
            v-model="deckName" 
            placeholder="e.g., TOEFL Academic Vocabulary"
          />
          <div v-if="errors.deckName" class="error-message">
            {{ errors.deckName }}
          </div>
        </div>
        
        <div class="form-group">
          <label for="deck-description">Description</label>
          <textarea 
            id="deck-description" 
            v-model="deckDescription" 
            placeholder="Describe what this deck contains..."
            rows="3"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label>Deck Icon</label>
          <div class="icon-selector">
            <div 
              v-for="icon in availableIcons" 
              :key="icon"
              class="icon-option"
              :class="{ selected: icon === deckIcon }"
              @click="selectIcon(icon)"
            >
              {{ icon }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="form-section">
        <div class="section-header">
          <h2>Vocabulary Words</h2>
          <button @click="addWord" class="add-word-button">Add Word</button>
        </div>
        
        <div v-if="errors.words.length > 0 && typeof errors.words[0] === 'string'" class="error-message">
          {{ errors.words[0] }}
        </div>
        
        <div 
          v-for="(word, index) in words" 
          :key="index"
          class="word-form"
        >
          <div class="word-form-header">
            <h3>Word {{ index + 1 }}</h3>
            <button 
              v-if="words.length > 1"
              @click="removeWord(index)" 
              class="remove-word-button"
            >
              Remove
            </button>
          </div>
          
          <div class="word-form-fields">
            <div class="form-group">
              <label :for="`term-${index}`">Term*</label>
              <input 
                :id="`term-${index}`" 
                v-model="word.term" 
                placeholder="e.g., ephemeral"
              />
              <div v-if="errors.words[index]" class="error-message">
                {{ errors.words[index] }}
              </div>
            </div>
            
            <div class="form-group">
              <label :for="`definition-${index}`">Definition*</label>
              <input 
                :id="`definition-${index}`" 
                v-model="word.definition" 
                placeholder="e.g., lasting for a very short time"
              />
            </div>
            
            <div class="form-group">
              <label :for="`example-${index}`">Example Sentence</label>
              <input 
                :id="`example-${index}`" 
                v-model="word.example" 
                placeholder="e.g., The ephemeral nature of fashion trends..."
              />
            </div>
          </div>
        </div>
      </div>
      
      <div class="form-actions">
        <button @click="cancelCreation" class="cancel-button">Cancel</button>
        <button @click="createDeck" class="create-button">Create Deck</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.create-deck-page {
  padding: var(--spacing-md) 0;
}

.create-form {
  margin-top: var(--spacing-lg);
}

.form-section {
  margin-bottom: var(--spacing-xl);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.form-group {
  margin-bottom: var(--spacing-md);
}

label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
}

input, textarea {
  width: 100%;
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 1rem;
}

.error-message {
  color: var(--color-error);
  font-size: 0.875rem;
  margin-top: var(--spacing-xs);
}

.icon-selector {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.icon-option {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-option:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.icon-option.selected {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.add-word-button {
  background-color: var(--color-secondary);
  color: white;
}

.word-form {
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.word-form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.word-form-header h3 {
  margin: 0;
}

.remove-word-button {
  background-color: transparent;
  border: 1px solid var(--color-error);
  color: var(--color-error);
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
}

.cancel-button {
  background-color: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.create-button {
  background-color: var(--color-primary);
  color: white;
}

@media (max-width: 767px) {
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .cancel-button, .create-button {
    width: 100%;
  }
}
</style>