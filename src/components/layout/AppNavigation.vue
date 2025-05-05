<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const currentRoute = computed(() => route.name);

const navItems = computed(() => [
  { name: 'home', label: t('nav.home'), icon: '🏠' },
  { name: 'decks', label: t('nav.decks'), icon: '📚' },
  { name: 'library', label: t('nav.library'), icon: '📖' },
  { name: 'difficult-words', label: t('nav.difficult'), icon: '⚠️' },
  { name: 'settings', label: t('nav.settings'), icon: '⚙️' }
]);

function navigateTo(routeName) {
  router.push({ name: routeName });
}
</script>

<template>
  <nav class="app-navigation">
    <div class="nav-items">
      <div 
        v-for="item in navItems" 
        :key="item.name"
        class="nav-item"
        :class="{ active: currentRoute === item.name }"
        @click="navigateTo(item.name)"
      >
        <div class="nav-icon">{{ item.icon }}</div>
        <div class="nav-label">{{ item.label }}</div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.app-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--color-surface);
  border-top: 1px solid var(--color-border);
  z-index: 100;
  transition: background-color 0.3s;
}

.nav-items {
  display: flex;
  justify-content: space-around;
  max-width: 600px;
  margin: 0 auto;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: color 0.2s;
}

.nav-item.active {
  color: var(--color-primary);
}

.nav-icon {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-xs);
}

.nav-label {
  font-size: 0.75rem;
  font-weight: 500;
}

@media (min-width: 768px) {
  .app-navigation {
    position: fixed;
    bottom: auto;
    top: 60px;
    left: 0;
    width: 80px;
    height: calc(100vh - 60px);
    border-top: none;
    border-right: 1px solid var(--color-border);
  }
  
  .nav-items {
    flex-direction: column;
    height: 100%;
    max-width: none;
    padding-top: var(--spacing-xl);
  }
  
  .nav-item {
    padding: var(--spacing-md) 0;
    width: 100%;
  }
}

@media (min-width: 1024px) {
  .app-navigation {
    width: 200px;
  }
  
  .nav-item {
    flex-direction: row;
    justify-content: flex-start;
    padding: var(--spacing-md) var(--spacing-xl);
  }
  
  .nav-icon {
    margin-bottom: 0;
    margin-right: var(--spacing-md);
  }
  
  .nav-label {
    font-size: 1rem;
  }
}
</style>