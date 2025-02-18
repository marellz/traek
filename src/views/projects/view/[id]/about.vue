<template>
  <h1>About project: {{ id }}</h1>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const id = computed(() => route.params.id as string)
</script>
