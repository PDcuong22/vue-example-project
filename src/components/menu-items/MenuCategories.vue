<template>
  <el-sub-menu index="categories">
    <template #title>
      <el-icon><Box /></el-icon>
      <span class="label">Categories</span>
    </template>

    <el-menu-item index="5-1" :route="{ path: '/categories' }">List</el-menu-item>
    <el-menu-item index="5-2" :route="{ path: '/categories/new' }">New</el-menu-item>
  </el-sub-menu>
</template>

<script setup lang="ts">
import { Box } from '@element-plus/icons-vue'
</script>

<style scoped>
.label {
  margin-left: 8px;
}
</style>
