<template>
  <div class="h-screen min-h-screen flex flex-col bg-slate-100 overflow-auto">
    <Header></Header>
    <!-- home -->
    <main class="flex-auto">
      <slot />
    </main>
    <Footer></Footer>
  </div>
</template>
<script lang="ts" setup>
import Header from '@/components/app/header.vue';
import Footer from '@/components/app/footer.vue';
</script>
