<template>
  <el-dialog
    v-model="visible"
    :title="ticket ? `Comments — ${ticket.title}` : 'Comments'"
    width="720px"
    @close="onClose"
  >
    <template #default>
      <div v-if="loading" style="text-align: center; padding: 20px">
        <el-skeleton :rows="4" animated />
      </div>

      <div v-else>
        <div v-if="comments.length === 0" class="no-comments">No comments yet.</div>

        <div class="comments-list">
        <div v-for="c in comments" :key="c.id" class="comment-item" style="margin-bottom: 12px">
          <el-card shadow="never" class="compact-card">
            <div style="display: flex; justify-content: space-between; align-items: center">
              <div style="font-weight: 600">{{ c.user_name || 'Anonymous' }}</div>
              <div style="color: #888; font-size: 12px">{{ formatDate(c.created_at) }}</div>
            </div>
            <div style="margin-top: 8px; white-space: pre-wrap">{{ c.content }}</div>
          </el-card>
        </div>
        </div>
        <el-divider />

        <el-form :model="form">
          <el-form-item>
            <el-input
              type="textarea"
              v-model="form.content"
              placeholder="Write a comment..."
              :rows="4"
            />
          </el-form-item>
          <div style="display: flex; justify-content: flex-end; gap: 8px">
            <el-button @click="reset">Cancel</el-button>
            <el-button type="primary" @click="submit" :loading="posting">Post Comment</el-button>
          </div>
        </el-form>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import commentService from '@/services/comment.service'
import type { Models } from '@/types'
import type { CommentDto } from '@/types/dto/comment.dto';

const props = defineProps<{
  modelValue: boolean
  ticket: Models.Ticket | null
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'posted'): void
}>()

const visible = ref(props.modelValue)
const comments = ref<Models.Comment[]>([])
const loading = ref(false)
const posting = ref(false)
const form = ref({ content: '' })

watch(
  () => props.modelValue,
  (v) => {
    visible.value = v
    if (v && props.ticket) loadComments(props.ticket.id)
  },
)

watch(visible, (v) => emit('update:modelValue', v))

function formatDate(s?: string) {
  if (!s) return ''
  try {
    return new Date(s).toLocaleString()
  } catch {
    return s
  }
}

async function loadComments(ticketId: number) {
  loading.value = true
  try {
    const res = await commentService.getComments(ticketId)
    const body = res?.data ?? res
    comments.value = Array.isArray(body) ? body : []
  } catch (e) {
    console.error(e)
    ElMessage.error('Failed to load comments')
    comments.value = []
  } finally {
    loading.value = false
  }
}

async function submit() {
  if (!props.ticket) return
  if (!form.value.content || !form.value.content.trim()) {
    ElMessage.warning('Comment is empty')
    return
  }
  posting.value = true
  try {
    const payload: CommentDto = {
      content: form.value.content.trim(),
    }
    await commentService.addComment(props.ticket.id, payload)
    form.value.content = ''
    await loadComments(props.ticket.id)
    ElMessage.success('Comment posted')
  } catch (e) {
    console.error(e)
    ElMessage.error('Failed to post comment')
  } finally {
    posting.value = false
  }
}

function reset() {
  form.value.content = ''
}

function onClose() {
  comments.value = []
  form.value.content = ''
}
</script>

<style scoped>
.no-comments {
  color: #777;
  padding: 12px 0;
}
.comment-item .el-card {
  padding: 12px;
}

.compact-card {
  padding: 8px !important;
  font-size: 13px;
  line-height: 1.3;
}

.comments-list {
  display: block;
  gap: 8px;
}
</style>
