import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<'light' | 'dark' | 'system'>('system')

  function apply(t: 'light' | 'dark' | 'system') {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    if (t === 'system') {
      root.classList.add(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    } else {
      root.classList.add(t)
    }
  }

  function setTheme(t: 'light' | 'dark' | 'system') {
    theme.value = t
    localStorage.setItem('theme', t)
    apply(t)
  }

  function init() {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null
    theme.value = saved ?? 'system'
    apply(theme.value)
  }

  return { theme, setTheme, init }
})
