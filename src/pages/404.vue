<script setup lang="ts">
/*
 * Iskra S260 canon «пустой зал музея» — Vue router catch-all mirror
 * (parity с public/404.html static для CF Pages /de/* /en/* 404 mapping).
 * S4SCOOP cont+0 B3 Враг FIX-2: закрывает generic Vue 404 catch-all case
 * (не только static /de/ /en/) — читатель попадающий на любой invalid route
 * через Vue router history mode видит тот же музей.
 *
 * Prior state (Р-27 fix cont+51): 4-lang text stub «обрубок» per Andrey S260 verdict.
 */
import { useHead } from '@unhead/vue'

useHead({
  title: '404 — Экспонат на реставрации · Библиотека FolkUp',
  meta: [
    { name: 'robots', content: 'noindex' },
    {
      name: 'description',
      content: 'Запрошенной страницы в Библиотеке FolkUp нет. Пока — открытые залы серии.',
    },
    // S1ILLUS cont+0 Frida OG: per-page override для 404 → Ремедиос F-3 «пустая полка с тёплым пятном света»
    // (Andrey pick variant B «книгу забрали, но место осталось» — tender interpretation).
    // Iskra PAKET-19 S288 «Визирую пускай приступает» + KVITANCIYA S1IMG cont+3 §3.
    { property: 'og:image', content: 'https://books.folkup.life/images/og/404-og-hires.jpg' },
    { property: 'og:image:type', content: 'image/jpeg' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: 'Ремедиос: пустая книжная полка с тёплым пятном света — экспонат ушёл, место осталось' },
    { name: 'twitter:image', content: 'https://books.folkup.life/images/og/404-og-hires.jpg' },
    { name: 'twitter:image:alt', content: 'Ремедиос: пустая книжная полка с тёплым пятном света' },
  ],
})
</script>

<template>
  <div class="museum-page">

    <main class="museum-main">

      <div class="museum" role="img" aria-label="Пустая музейная рама с круглой печатью «Экспонат на реставрации, 2026»">
        <!-- Museum picture frame — SVG, ornate rectangle with ivory paspartu -->
        <svg class="museum-frame" viewBox="0 0 420 320" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="8" y="8" width="404" height="304" rx="2" fill="#8a5a3b" />
          <rect x="12" y="12" width="396" height="296" rx="1" fill="none" stroke="#5f3d24" stroke-width="0.5" />
          <rect x="26" y="26" width="368" height="268" rx="1" fill="none" stroke="#c4915f" stroke-width="1.5" />
          <rect x="30" y="30" width="360" height="260" rx="1" fill="none" stroke="#5f3d24" stroke-width="0.4" />
          <rect x="34" y="34" width="352" height="252" fill="#FEFCF6" stroke="#E5E0D0" stroke-width="0.5" />
          <rect x="66" y="58" width="288" height="204" fill="#F5F1E4" stroke="#D6CFB9" stroke-width="1" />
          <circle cx="26" cy="26" r="2" fill="#5f3d24" />
          <circle cx="394" cy="26" r="2" fill="#5f3d24" />
          <circle cx="26" cy="294" r="2" fill="#5f3d24" />
          <circle cx="394" cy="294" r="2" fill="#5f3d24" />
        </svg>

        <!-- Circular stamp S138 «ЭКСПОНАТ НА РЕСТАВРАЦИИ · 2026» -->
        <svg class="museum-stamp" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <path id="stamp-ring-vue" d="M 110,110 m -85,0 a 85,85 0 1,1 170,0 a 85,85 0 1,1 -170,0" />
          </defs>
          <circle cx="110" cy="110" r="100" fill="none" stroke="#7D4450" stroke-width="3" />
          <circle cx="110" cy="110" r="93" fill="none" stroke="#7D4450" stroke-width="1.5" />
          <text font-family="Vollkorn, Georgia, serif" font-size="15" font-weight="700" fill="#7D4450" letter-spacing="2">
            <textPath href="#stamp-ring-vue" startOffset="0">ЭКСПОНАТ НА РЕСТАВРАЦИИ · ЭКСПОНАТ НА РЕСТАВРАЦИИ · </textPath>
          </text>
          <text x="110" y="120" font-family="Playfair Display, Georgia, serif" font-size="42" font-weight="700" fill="#7D4450" text-anchor="middle">2026</text>
        </svg>
      </div>

      <div class="inventory-tag">Инвентарный № 404</div>

      <div class="msg-primary">
        <h1>Такой страницы нет</h1>
        <p>Возможно, вы искали <RouterLink to="/">главную Библиотеки</RouterLink>?</p>
        <p><em>Перевод готовится в мастерской FolkUp. Экспонат появится в этом зале — заходите.</em></p>
      </div>

      <div class="msg-secondary">
        <!-- TIKET-31 EXT-2 lang persistence: each column links к its own lang home. -->
        <div class="lang" lang="en">
          <p><strong>Not found.</strong> Try our <RouterLink to="/en">homepage</RouterLink>?</p>
          <p><em>The translation is taking shape in the FolkUp workshop.</em></p>
        </div>
        <div class="lang" lang="de">
          <p><strong>Nicht gefunden.</strong> Vielleicht suchen Sie unsere <RouterLink to="/de">Startseite</RouterLink>?</p>
          <p><em>Die Übersetzung entsteht in der FolkUp-Werkstatt.</em></p>
        </div>
        <div class="lang" lang="pt">
          <p><strong>Não encontrado.</strong> Talvez procure a nossa <RouterLink to="/pt">página inicial</RouterLink>?</p>
          <p><em>A tradução está a ganhar forma na oficina FolkUp.</em></p>
        </div>
      </div>

      <section class="live-books" aria-labelledby="live-hall-vue">
        <h2 id="live-hall-vue">А пока — открытые залы</h2>
        <div class="cards">
          <RouterLink class="card" to="/kn1">
            <img class="card-cover" src="/covers/cover_kn1.png" alt="Обложка книги «Agile Sapiens»" loading="lazy" width="200" height="300">
            <span class="card-label">Кн.1 · Agile Sapiens</span>
            <span class="card-note">Викторианская литература как теория менеджмента</span>
          </RouterLink>
          <RouterLink class="card" to="/kn5">
            <img class="card-cover" src="/covers/cover_kn5.png" alt="Обложка книги «Чужими руками»" loading="lazy" width="200" height="300">
            <span class="card-label">Кн.5 · Чужими руками</span>
            <span class="card-note">Между автором и нами всегда кто-то стоит</span>
          </RouterLink>
          <RouterLink class="card" to="/kn3">
            <img class="card-cover" src="/covers/cover_kn3.png" alt="Обложка книги «Город Солнца»" loading="lazy" width="200" height="300">
            <span class="card-label">Кн.3 · Город Солнца</span>
            <span class="card-note">Идеальные города и обычный человек с сумками</span>
          </RouterLink>
        </div>
      </section>

    </main>
  </div>
</template>

<style scoped>
.museum-page {
  min-height: 60vh;
}
.museum-main {
  max-width: 780px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 3.5rem;
  text-align: center;
  width: 100%;
}

/* Museum frame + stamp */
.museum {
  position: relative;
  display: inline-block;
  margin: 0 auto 1rem;
  width: 100%;
  max-width: 420px;
}
.museum-frame { display: block; width: 100%; height: auto; }
.museum-stamp {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60%;
  max-width: 220px;
  transform: translate(-50%, -50%) rotate(-12deg);
  opacity: 0.6;
  pointer-events: none;
}
.inventory-tag {
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.375rem 0.875rem;
  background: #fff;
  border: 1px solid var(--color-border, #E5E0D0);
  border-radius: 3px;
  font-family: var(--font-body, 'Vollkorn', Georgia, serif);
  font-size: 0.8125rem;
  letter-spacing: 0.08em;
  color: var(--color-text-muted, #6B6B6B);
  text-transform: uppercase;
}

/* Primary + secondary msg */
.msg-primary {
  margin: 2rem auto 1.5rem;
  max-width: 580px;
}
.msg-primary h1 {
  font-family: var(--font-display, 'Playfair Display', Georgia, serif);
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--color-bordeaux, #7D4450);
  margin: 0 0 0.75rem;
  letter-spacing: -0.01em;
}
.msg-primary p {
  font-size: 1.125rem;
  color: var(--color-text, #1A1A1A);
  margin: 0.5rem 0;
}
.msg-primary a { color: var(--color-bordeaux, #7D4450); text-decoration: underline; }

.msg-secondary {
  margin: 2rem auto 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  max-width: 700px;
  text-align: left;
}
.msg-secondary .lang {
  padding: 0.875rem 1rem;
  background: #fff;
  border: 1px solid var(--color-border, #E5E0D0);
  border-left: 3px solid var(--color-sage, #839E75);
  border-radius: 3px;
  font-size: 0.9375rem;
  line-height: 1.5;
}
.msg-secondary .lang p { margin: 0.25rem 0; }
.msg-secondary .lang :deep(strong) { color: var(--color-bordeaux, #7D4450); }
.msg-secondary .lang :deep(a) { color: var(--color-bordeaux, #7D4450); }

/* Live books hall */
.live-books {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border, #E5E0D0);
}
.live-books h2 {
  font-family: var(--font-display, 'Playfair Display', Georgia, serif);
  font-size: 1.375rem;
  font-weight: 400;
  color: var(--color-text, #1A1A1A);
  margin: 0 0 1.5rem;
  font-style: italic;
}
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  max-width: 620px;
  margin: 0 auto;
}
.card {
  display: block;
  text-decoration: none;
  color: inherit;
  transition: transform 0.15s ease;
}
.card:hover, .card:focus-visible { transform: translateY(-3px); outline: none; }
.card:focus-visible .card-cover { box-shadow: 0 0 0 3px var(--color-amber, #E8AD4A); }
.card-cover {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(125, 68, 80, 0.15);
  border-radius: 2px;
  transition: box-shadow 0.15s ease;
}
.card-label {
  display: block;
  margin-top: 0.5rem;
  font-family: var(--font-display, 'Playfair Display', Georgia, serif);
  font-size: 0.9375rem;
  color: var(--color-text, #1A1A1A);
  font-weight: 700;
}
.card-note {
  display: block;
  margin-top: 0.125rem;
  font-size: 0.8125rem;
  color: var(--color-text-muted, #6B6B6B);
  font-style: italic;
}

/* Mobile */
@media (max-width: 640px) {
  .museum-main { padding: 1.75rem 1rem 2.5rem; }
  .museum { max-width: 320px; }
  .msg-primary h1 { font-size: 1.5rem; }
  .msg-primary p { font-size: 1rem; }
  .msg-secondary {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  .cards {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
    max-width: 100%;
  }
  .card-label { font-size: 0.875rem; }
  .card-note { font-size: 0.75rem; }
}
</style>
