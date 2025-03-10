<template>
  <div class="flex h-screen min-h-screen flex-col bg-slate-100">
    <Header />
    <!-- home -->
    <main class="flex-auto">
      <slot />
    </main>
    <Footer />
  </div>
</template>
<script lang="ts" setup>
import Header from '@/components/app/header.vue'
import Footer from '@/components/app/footer.vue'
</script>
