<script setup lang="ts">
/*
 * Р-27 fix cont+51 (Iskra DOP-8 S260 + Andrey Q2=a verdict 2026-08-04):
 * Multilingual 404 stub per KANON YAZYKOV S252 (mirror folkup.app /en/ pattern).
 * Portal is RU-canonical; other language editions live per КАНОН РЕЛИЗ-ПОТОК v1.0
 * с плашкой версионности. This 404 catch-all handles /en/, /de/, /pt/ (and any
 * other unknown route) с honest multilingual «page not found + coming» message.
 */
import { useHead } from '@unhead/vue'

useHead({
  title: 'Страница не найдена — FolkUp Books',
  meta: [
    { name: 'robots', content: 'noindex' },
    {
      name: 'description',
      content:
        'Page not found. The book portal FolkUp works primarily in Russian; other language editions are in progress.',
    },
  ],
})
</script>

<template>
  <article class="not-found">
    <h1>404</h1>
    <p class="not-found__lede" lang="ru">Такой страницы нет.</p>

    <div class="not-found__multilingual">
      <p lang="en">
        This page doesn't exist. English editions are in progress; visit the Russian portal for
        published books.
      </p>
      <p lang="de">
        Diese Seite gibt es nicht. Deutsche Ausgaben werden vorbereitet; im russischen Portal stehen
        die veröffentlichten Bücher bereits bereit.
      </p>
      <p lang="pt">
        Esta página não existe. As edições em português estão a ser preparadas; visite o portal russo
        para os livros já publicados.
      </p>
    </div>

    <p class="not-found__home">
      <RouterLink to="/">На главную · Home · Zur Startseite · Início</RouterLink>
    </p>
  </article>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: var(--spacing-3xl, 3rem) var(--spacing-lg, 1.5rem);
  max-width: 640px;
  margin: 0 auto;
}
.not-found h1 {
  font-size: 3rem;
  margin: 0 0 var(--spacing-md, 1rem);
}
.not-found__lede {
  font-size: 1.15rem;
  margin: 0 0 var(--spacing-xl, 2rem);
}
.not-found__multilingual {
  margin: var(--spacing-lg, 1.5rem) 0;
  display: grid;
  gap: var(--spacing-sm, 0.75rem);
  text-align: left;
}
.not-found__multilingual p {
  margin: 0;
  padding: var(--spacing-sm, 0.75rem) var(--spacing-md, 1rem);
  border-left: 2px solid currentColor;
  opacity: 0.75;
}
.not-found__home {
  margin-top: var(--spacing-xl, 2rem);
}
.not-found__home a {
  text-decoration: underline;
}
</style>
