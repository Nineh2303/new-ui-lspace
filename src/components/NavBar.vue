<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useThemeStore } from '@/src/stores/themeStore'
import { Sun, Moon, BookOpen, Menu, X } from 'lucide-vue-next'

const route = useRoute()
const themeStore = useThemeStore()
const mobileOpen = ref(false)

const links = [
  { to: '/', label: 'Home' },
  { to: '/exams', label: 'Exams' },
]

function toggleTheme() {
  themeStore.setTheme(themeStore.theme === 'dark' ? 'light' : 'dark')
}

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <header class="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
    <div class="container mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
      <RouterLink to="/" class="flex items-center gap-2 font-semibold text-foreground">
        <BookOpen class="size-5 text-primary" />
        <span class="hidden sm:block">ExamCenter</span>
      </RouterLink>

      <nav class="hidden md:flex items-center gap-1">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
          :class="isActive(link.to) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="flex items-center gap-2">
        <button
          class="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          @click="toggleTheme"
        >
          <Sun v-if="themeStore.theme === 'dark'" class="size-4" />
          <Moon v-else class="size-4" />
        </button>
        <button
          class="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors md:hidden"
          @click="mobileOpen = !mobileOpen"
        >
          <X v-if="mobileOpen" class="size-4" />
          <Menu v-else class="size-4" />
        </button>
      </div>
    </div>

    <div v-if="mobileOpen" class="md:hidden border-t bg-background px-4 pb-4 pt-2 flex flex-col gap-1">
      <RouterLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
        :class="isActive(link.to) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'"
        @click="mobileOpen = false"
      >
        {{ link.label }}
      </RouterLink>
    </div>
  </header>
</template>
