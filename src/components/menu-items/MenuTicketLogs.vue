<template>
  <el-menu-item index="ticket-logs" :route="{ path: '/ticket-logs' }">
    <el-icon><Document /></el-icon>
    <span class="label">Ticket Logs</span>
  </el-menu-item>
</template>

<script setup lang="ts">
import { Document } from '@element-plus/icons-vue'
</script>

<style scoped>
.label {
  margin-left: 8px;
}
</style>
