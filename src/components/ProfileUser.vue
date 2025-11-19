<template>
  <el-dropdown @command="onCommand" placement="bottom-end">
    <span class="dropdown-trigger" tabindex="0">
      <el-avatar :size="36" :src="user.avatar" class="avatar">{{ fallbackInitial }}</el-avatar>
      <span class="user-name">{{ user.name }}</span>
    </span>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="profile">
          <el-icon><User /></el-icon>
          <span>Profile</span>
        </el-dropdown-item>
        <el-dropdown-item command="logout">
          <el-icon><SwitchButton /></el-icon>
          <span>Logout</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { User, SwitchButton } from '@element-plus/icons-vue'
import { defineProps, withDefaults } from 'vue'

const props = withDefaults(
  defineProps<{
    user?: { name?: string; avatar?: string }
  }>(),
  {
    user: () => ({ name: 'Guest', avatar: '' }),
  },
)

const user = props.user!

const emit = defineEmits<{
  (e: 'command', cmd: string): void
}>()

function onCommand(cmd: string) {
  emit('command', cmd)
}

const fallbackInitial = computed(() => {
  return user?.name ? user.name.charAt(0).toUpperCase() : ''
})
</script>

<style scoped>
.dropdown-trigger {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: #374151;
}
.avatar {
  background: #eee;
}
.user-name {
  font-weight: 600;
  margin-right: 4px;
}
.down-icon {
  color: #9ca3af;
  font-size: 14px;
}
</style>
