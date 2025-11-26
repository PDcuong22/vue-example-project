<template>
  <div>
    <AppLayout v-if="showLayout" />
    <AuthLayout v-else />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

const route = useRoute()
const showLayout = computed(() => !(route.meta && route.meta.hideLayout))
</script>
