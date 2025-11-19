<template>
  <el-menu-item index="tickets" :route="{ name: 'tickets.list' }">
    <template #title>
      <el-icon><Ticket /></el-icon>
      <span class="label">Tickets</span>
    </template>
  </el-menu-item>
</template>

<script setup lang="ts">
import { Ticket } from '@element-plus/icons-vue'
</script>

<style scoped>
.label { margin-left: 8px; }
</style>