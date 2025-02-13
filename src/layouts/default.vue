<template>
  <!-- dashboard -->
  <app-header></app-header>
  <main>
    <slot />
  </main>
  <app-footer></app-footer>

</template>
<script lang="ts" setup>
import AppHeader from '@/components/app/header.vue';
import AppFooter from '@/components/app/footer.vue';
</script>
