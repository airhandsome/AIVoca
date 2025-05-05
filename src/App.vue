<script setup>
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import AppHeader from './components/layout/AppHeader.vue';
import AppNavigation from './components/layout/AppNavigation.vue';
import { useSettingsStore } from './stores/settings';
import { useLangStore } from './stores/lang';

const route = useRoute();
const settings = useSettingsStore();
const langStore = useLangStore();
const { t, locale } = useI18n();

const showNavigation = computed(() => {
  return route.name !== 'study-session';
});

const isDarkMode = computed(() => {
  return settings.darkMode;
});

// 监听语言变化
watch(() => langStore.currentLang, (newLang) => {
  locale.value = newLang;
});
</script>

<template>
  <div class="app-container" :class="{ 'dark-mode': isDarkMode }">
    <AppHeader />
    <main class="main-content">
      <router-view />
    </main>
    <AppNavigation v-if="showNavigation" />
  </div>
</template>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-background);
  color: var(--color-text);
  transition: background-color 0.3s, color 0.3s;
}

.main-content {
  flex: 1;
  padding: 0 16px 80px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  position: relative;
}

@media (min-width: 768px) {
  .main-content {
    padding: 0 24px 24px;
  }
}
</style>