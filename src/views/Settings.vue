<script setup>
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSettingsStore } from '../stores/settings';
import { useStatisticsStore } from '../stores/statistics';

const settingsStore = useSettingsStore();
const statsStore = useStatisticsStore();
const { t } = useI18n();

const formSettings = reactive({ ...settingsStore.settings });

const saveSettings = () => {
  settingsStore.updateSettings(formSettings);
  // Show success message or notification
};

const resetStatistics = () => {
  if (confirm(t('settings.confirmReset'))) {
    statsStore.resetStats();
  }
};
</script>

<template>
  <div class="settings-page">
    <h1>{{ t('settings.title') }}</h1>
    
    <div class="settings-card card">
      <h2>{{ t('settings.studySettings') }}</h2>
      
      <div class="form-group">
        <label for="cards-per-session">{{ t('settings.cardsPerSession') }}</label>
        <input 
          type="number" 
          id="cards-per-session" 
          v-model="formSettings.cardsPerSession" 
          min="5" 
          max="100"
        />
      </div>
      
      <div class="form-group">
        <label class="checkbox-label">
          <input 
            type="checkbox" 
            v-model="formSettings.showExamples" 
          />
          {{ t('settings.showExamples') }}
        </label>
      </div>
      
      <div class="form-group">
        <label class="checkbox-label">
          <input 
            type="checkbox" 
            v-model="formSettings.studyBothSides" 
          />
          {{ t('settings.studyBothSides') }}
        </label>
      </div>
      
      <div class="form-group">
        <label class="checkbox-label">
          <input 
            type="checkbox" 
            v-model="formSettings.reviewNewCardsFirst" 
          />
          {{ t('settings.prioritizeNewCards') }}
        </label>
      </div>
    </div>
    
    <div class="settings-card card">
      <h2>{{ t('settings.displaySettings') }}</h2>
      
      <div class="form-group">
        <label class="checkbox-label">
          <input 
            type="checkbox" 
            v-model="formSettings.darkMode" 
          />
          {{ t('settings.darkMode') }}
        </label>
      </div>
    </div>
    
    <div class="settings-card card danger-zone">
      <h2>{{ t('settings.dataManagement') }}</h2>
      
      <p class="warning-text">
        {{ t('settings.warningText') }}
      </p>
      
      <button @click="resetStatistics" class="danger-button">
        {{ t('settings.resetStats') }}
      </button>
    </div>
    
    <div class="settings-actions">
      <button @click="saveSettings" class="save-button">
        {{ t('common.save') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  padding: var(--spacing-md) 0;
}

.settings-card {
  margin-bottom: var(--spacing-lg);
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-label input {
  width: auto;
  margin-right: var(--spacing-sm);
}

.danger-zone {
  border-left: 4px solid var(--color-error);
}

.warning-text {
  color: var(--color-error);
  margin-bottom: var(--spacing-md);
}

.danger-button {
  background-color: var(--color-error);
  color: white;
}

.settings-actions {
  margin-top: var(--spacing-lg);
  display: flex;
  justify-content: flex-end;
}

.save-button {
  background-color: var(--color-primary);
  color: white;
  padding: var(--spacing-md) var(--spacing-lg);
}

@media (max-width: 767px) {
  .settings-actions {
    justify-content: center;
  }
  
  .save-button {
    width: 100%;
  }
}
</style>