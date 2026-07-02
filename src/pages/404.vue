<script setup lang="ts">
import { useHead } from '@unhead/vue'

useHead({
  title: '404 — Страница не найдена',
  meta: [
    { name: 'robots', content: 'noindex' },
  ],
})
</script>

<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Такой страницы нет.</p>
    <RouterLink to="/">На главную</RouterLink>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: var(--spacing-3xl) var(--spacing-lg);
}
</style>
