<script setup>
import { reactive } from 'vue';
import { useSettingsStore } from '../stores/settings';
import { useStatisticsStore } from '../stores/statistics';

const settingsStore = useSettingsStore();
const statsStore = useStatisticsStore();

const formSettings = reactive({ ...settingsStore.settings });

const saveSettings = () => {
  settingsStore.updateSettings(formSettings);
  // Show success message or notification
};

const resetStatistics = () => {
  if (confirm('Are you sure you want to reset all statistics? This action cannot be undone.')) {
    statsStore.resetStats();
  }
};
</script>

<template>
  <div class="settings-page">
    <h1>Settings</h1>
    
    <div class="settings-card card">
      <h2>Study Settings</h2>
      
      <div class="form-group">
        <label for="cards-per-session">Cards per study session</label>
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
          Show example sentences
        </label>
      </div>
      
      <div class="form-group">
        <label class="checkbox-label">
          <input 
            type="checkbox" 
            v-model="formSettings.studyBothSides" 
          />
          Study both sides (term→definition and definition→term)
        </label>
      </div>
      
      <div class="form-group">
        <label class="checkbox-label">
          <input 
            type="checkbox" 
            v-model="formSettings.reviewNewCardsFirst" 
          />
          Prioritize new cards in study sessions
        </label>
      </div>
    </div>
    
    <div class="settings-card card">
      <h2>Display Settings</h2>
      
      <div class="form-group">
        <label class="checkbox-label">
          <input 
            type="checkbox" 
            v-model="formSettings.darkMode" 
          />
          Dark mode
        </label>
      </div>
    </div>
    
    <div class="settings-card card danger-zone">
      <h2>Data Management</h2>
      
      <p class="warning-text">
        Warning: The following actions cannot be undone.
      </p>
      
      <button @click="resetStatistics" class="danger-button">
        Reset Statistics
      </button>
    </div>
    
    <div class="settings-actions">
      <button @click="saveSettings" class="save-button">
        Save Settings
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