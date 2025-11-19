<template>
  <el-menu-item index="users" :route="{ path: '/users' }">
    <el-icon><User /></el-icon>
    <span class="label">Users</span>
  </el-menu-item>
</template>

<script setup lang="ts">
import { User } from '@element-plus/icons-vue'
</script>

<style scoped>
.label {
  margin-left: 8px;
}
</style>
