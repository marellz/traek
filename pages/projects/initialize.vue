<template>
  <div>
    <ul>
      <li v-for="(option, index) in options" :key="index">
        <a href="#"> Create Projectt </a>
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
const options = [
  {
    label: 'Join existing project',
    key: 'join',
  },
  {
    label: 'Create new project',
    key: 'create',
  },
]
</script>
