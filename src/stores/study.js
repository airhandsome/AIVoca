import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useDeckStore } from './decks';

export const useStudyStore = defineStore('study', () => {
  const currentDeck = ref(null);
  const currentWord = ref(null);
  const wordList = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  const deckStore = useDeckStore();

  const loadDeck = async (deckId) => {
    try {
      isLoading.value = true;
      error.value = null;
      
      const deck = deckStore.getDeckById(deckId);
      if (!deck) {
        throw new Error('Deck not found');
      }

      currentDeck.value = deck;
      
      // 加载词库文件
      const response = await fetch(deck.source);
      if (!response.ok) {
        throw new Error('Failed to load word list');
      }
      
      const text = await response.text();
      
      // 将文本转换为 JSON 数组
      const jsonArray = `[${text.split('\n').filter(line => line.trim()).join(',')}]`;
      const data = JSON.parse(jsonArray);
      
      // 将词库数据转换为统一格式
      wordList.value = data;
      
      // 设置第一个单词
      if (wordList.value.length > 0) {
        currentWord.value = wordList.value[0];
      }
      
    } catch (e) {
      console.error('Error loading deck:', e);
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  };

  const nextWord = () => {
    if (!wordList.value.length) return;
    
    const currentIndex = wordList.value.findIndex(w => w.wordRank === currentWord.value?.wordRank);
    if (currentIndex < wordList.value.length - 1) {
      currentWord.value = wordList.value[currentIndex + 1];
    } else {
      // 循环到开始
      currentWord.value = wordList.value[0];
    }
  };

  const previousWord = () => {
    if (!wordList.value.length) return;
    
    const currentIndex = wordList.value.findIndex(w => w.wordRank === currentWord.value?.wordRank);
    if (currentIndex > 0) {
      currentWord.value = wordList.value[currentIndex - 1];
    } else {
      // 循环到结尾
      currentWord.value = wordList.value[wordList.value.length - 1];
    }
  };

  return {
    currentDeck,
    currentWord,
    wordList,
    isLoading,
    error,
    loadDeck,
    nextWord,
    previousWord
  };
}); 