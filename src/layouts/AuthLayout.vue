<template>
  <div class="auth-wrapper">
    <router-view />
  </div>
</template>

<script setup lang="ts">
/* no logic needed here */
</script>

<style scoped>
.auth-wrapper {
  min-height: calc(100vh - 0px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: #f7f8fa;
}
</style>
