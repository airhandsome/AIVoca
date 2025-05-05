<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useSettingsStore } from '../../stores/settings';

const router = useRouter();
const settings = useSettingsStore();
const isSearchActive = ref(false);
const searchQuery = ref('');

const toggleDarkMode = () => {
  settings.toggleDarkMode();
};

const isDarkMode = computed(() => {
  return settings.darkMode;
});

const toggleSearch = () => {
  isSearchActive.value = !isSearchActive.value;
  if (!isSearchActive.value) {
    searchQuery.value = '';
  }
};

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      name: 'search-results',
      query: { q: searchQuery.value }
    });
    isSearchActive.value = false;
    searchQuery.value = '';
  }
};
</script>

<template>
  <header class="app-header">
    <div class="app-header-content">
      <div class="logo" @click="router.push('/')">
        <span class="logo-icon">📝</span>
        <span class="logo-text">VocabMaster</span>
      </div>
      
      <div class="header-controls">
        <button 
          class="icon-button search-button" 
          @click="toggleSearch"
          :class="{ 'active': isSearchActive }"
        >
          <span class="material-icon">🔍</span>
        </button>
        
        <button 
          class="icon-button theme-button" 
          @click="toggleDarkMode"
        >
          <span class="material-icon">{{ isDarkMode ? '☀️' : '🌙' }}</span>
        </button>
      </div>
    </div>
    
    <div class="search-bar" :class="{ 'active': isSearchActive }">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search vocabulary..." 
        @keyup.enter="handleSearch"
      />
      <button class="search-submit" @click="handleSearch">
        <span class="material-icon">🔍</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  background-color: var(--color-surface);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  z-index: 100;
  transition: background-color 0.3s;
}

.app-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  max-width: 1200px;
  margin: 0 auto;
  height: 60px;
}

.logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: 700;
  font-size: 1.2rem;
}

.logo-icon {
  margin-right: var(--spacing-sm);
  font-size: 1.5rem;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.icon-button {
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  font-size: 1.25rem;
  padding: var(--spacing-sm);
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.icon-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--color-primary);
}

.icon-button.active {
  color: var(--color-primary);
}

.search-bar {
  height: 0;
  overflow: hidden;
  transition: height 0.3s ease;
  background-color: var(--color-surface);
  padding: 0 var(--spacing-md);
}

.search-bar.active {
  height: 60px;
  padding: var(--spacing-md);
  display: flex;
  border-top: 1px solid var(--color-border);
}

.search-bar input {
  flex: 1;
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  font-size: 1rem;
}

.search-submit {
  margin-left: var(--spacing-sm);
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

@media (min-width: 768px) {
  .logo-text {
    display: block;
  }
  
  .app-header-content {
    padding: var(--spacing-md) var(--spacing-xl);
  }
}

@media (max-width: 767px) {
  .logo-text {
    display: none;
  }
}
</style>