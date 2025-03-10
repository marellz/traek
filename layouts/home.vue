<template>
  <div class="flex h-screen min-h-screen flex-col bg-slate-100">
    <AppHeader />
    <!-- home -->
    <main class="flex-auto">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
<script lang="ts" setup>
</script>
