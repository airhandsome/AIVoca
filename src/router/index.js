import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Decks from '../views/Decks.vue'
import DeckDetail from '../views/DeckDetail.vue'
import StudySession from '../views/StudySession.vue'
import Library from '../views/Library.vue'
import DifficultWords from '../views/DifficultWords.vue'
import CreateDeck from '../views/CreateDeck.vue'
import Settings from '../views/Settings.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/decks',
      name: 'decks',
      component: Decks
    },
    {
      path: '/decks/:id',
      name: 'deck-detail',
      component: DeckDetail,
      props: true
    },
    {
      path: '/study/:deckId',
      name: 'study-session',
      component: StudySession,
      props: true
    },
    {
      path: '/library',
      name: 'library',
      component: Library
    },
    {
      path: '/difficult-words',
      name: 'difficult-words',
      component: DifficultWords
    },
    {
      path: '/create-deck',
      name: 'create-deck',
      component: CreateDeck
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    }
  ]
})

export default router