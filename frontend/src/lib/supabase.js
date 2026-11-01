import { createClient } from '@supabase/supabase-js'

const REMEMBER_KEY = 'phaze.remember'

const sessionStore = {
  getItem: (key) => localStorage.getItem(key) ?? sessionStorage.getItem(key),
  setItem: (key, value) => {
    const remember = localStorage.getItem(REMEMBER_KEY) !== 'false'
    const store = remember ? localStorage : sessionStorage
    const otherStore = remember ? sessionStorage : localStorage

    store.setItem(key, value)
    otherStore.removeItem(key)
  },
  removeItem: (key) => {
    localStorage.removeItem(key)
    sessionStorage.removeItem(key)
  },
}

export function setRememberMe(remember) {
  localStorage.setItem(REMEMBER_KEY, String(remember))
}

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  { auth: { storage: sessionStore } },
)
