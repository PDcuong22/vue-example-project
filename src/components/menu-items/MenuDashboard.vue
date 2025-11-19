<template>
  <el-menu-item index="dashboard" :route="{ name: 'home' }">
    <el-icon><House /></el-icon>
    <span class="label">Dashboard</span>
  </el-menu-item>
</template>

<script setup lang="ts">
import { House } from '@element-plus/icons-vue'
</script>

<style scoped>
.label {
  margin-left: 8px;
}
</style>
