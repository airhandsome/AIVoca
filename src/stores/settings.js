import { defineStore } from 'pinia';
import { ref,computed } from 'vue';

export const useSettingsStore = defineStore('settings', () => {
  // State
  const settings = ref({
    cardsPerSession: 20,
    autoPlayAudio: true,
    showExamples: true,
    studyBothSides: false, // If true, both word->definition and definition->word will be tested
    darkMode: false,
    reviewNewCardsFirst: true
  });
  
  // Getters
  const darkMode = computed(() => settings.value.darkMode);
  
  // Actions
  function updateSettings(newSettings) {
    settings.value = { ...settings.value, ...newSettings };
  }
  
  function toggleDarkMode() {
    settings.value.darkMode = !settings.value.darkMode;
  }
  
  return {
    settings,
    darkMode,
    updateSettings,
    toggleDarkMode
  };
}, {
  persist: true
});