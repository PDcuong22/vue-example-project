<template>
  <el-menu-item index="labels" :route="{ path: '/labels' }">
    <el-icon><PriceTag /></el-icon>
    <span class="label">Labels</span>
  </el-menu-item>
</template>

<script setup lang="ts">
import { PriceTag } from '@element-plus/icons-vue'
</script>

<style scoped>
.label {
  margin-left: 8px;
}
</style>
