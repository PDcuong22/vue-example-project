<template>
  <div class="page-content">
    <div class="cards">
      <div class="stat-card">
        <div class="stat-icon">
          <el-icon><Ticket /></el-icon>
        </div>
        <div class="stat-body">
          <div class="stat-title">Total tickets</div>
          <div class="stat-number">3</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ticket } from '@element-plus/icons-vue'
</script>

<style scoped>
.page-content {
  padding-top: 8px;
}
.cards {
  max-width: 920px;
}
.stat-card {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 10px;
  padding: 22px;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03);
}
.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #fff0ea;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  color: #ff6a3d;
}
.stat-icon .el-icon {
  font-size: 26px;
}
.stat-title {
  font-size: 16px;
  color: #6b7280;
}
.stat-number {
  font-size: 36px;
  font-weight: 800;
  margin-top: 6px;
}
</style>
