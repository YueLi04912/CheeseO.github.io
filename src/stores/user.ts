// src/stores/user.ts
import { defineStore } from 'pinia'

interface User {
  id: string
  name: string
  avatar?: string
  isLoggedIn: boolean
  isPremium: boolean
}

export const useUserStore = defineStore('user', {
  state: (): { user: User } => ({
    user: {
      id: '',
      name: 'Guest',
      isLoggedIn: false,
      isPremium: false
    }
  }),
  actions: {
    login(userData: Partial<User>) {
      this.user = {
        ...this.user,
        ...userData,
        isLoggedIn: true
      }
    },
    logout() {
      this.user = {
        id: '',
        name: 'Guest',
        isLoggedIn: false,
        isPremium: false
      }
    },
    upgradeToPremium() {
      this.user.isPremium = true
    }
  },
  getters: {
    isAuthenticated: (state) => state.user.isLoggedIn,
    isMember: (state) => state.user.isPremium
  }
})