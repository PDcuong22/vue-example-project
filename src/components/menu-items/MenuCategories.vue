<template>
  <el-menu-item index="categories" :route="{ path: '/categories' }">
    <el-icon><Box /></el-icon>
    <span class="label">Categories</span>
  </el-menu-item>
</template>

<script setup lang="ts">
import { Box } from '@element-plus/icons-vue'
</script>

<style scoped>
.label {
  margin-left: 8px;
}
</style>
