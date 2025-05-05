import { defineStore } from 'pinia'

export const useLangStore = defineStore('lang', {
  state: () => ({
    currentLang: 'zh' // 默认中文
  }),
  actions: {
    toggleLang() {
      this.currentLang = this.currentLang === 'zh' ? 'en' : 'zh'
    }
  },
  persist: true
}) 