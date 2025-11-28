<template>
  <el-dialog
    v-model="visible"
    :title="ticket ? `Comments — ${ticket.title}` : 'Comments'"
    width="720px"
    class="fixed-dialog"
    @close="onClose"
  >
    <template #default>
      <div v-if="commentStore.loading" style="text-align: center; padding: 20px">
        <el-skeleton :rows="4" animated />
      </div>

      <div v-else class="dialog-body">
        <div v-if="commentStore.comments?.length === 0" class="no-comments">No comments yet.</div>

        <div class="comments-list">
          <div v-for="c in commentStore.comments" :key="c.id" class="comment-item">
            <el-card shadow="never" class="compact-card">
              <div class="comment-header">
                <div class="user-name">{{ c.user_name || 'Anonymous' }}</div>
                <div class="comment-date">{{ formatDate(c.created_at) }}</div>
              </div>
              <div class="comment-conntent">{{ c.content }}</div>
            </el-card>
          </div>
        </div>
        <el-divider />
        <div class="form-wrapper">
        <el-form :model="form">
          <el-form-item>
            <el-input
              type="textarea"
              v-model="form.content"
              placeholder="Write a comment..."
              :rows="3"
            />
          </el-form-item>
          <div class="form-actions">
            <el-button @click="reset">Cancel</el-button>
            <el-button type="primary" @click="submit" :loading="posting">Post Comment</el-button>
          </div>
        </el-form>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount} from 'vue'
import { ElMessage } from 'element-plus'
import type { Models } from '@/types'
import type { CommentDto } from '@/types/dto/comment.dto'
import { useCommentStore } from '@/stores/useCommentStore'

const props = defineProps<{
  modelValue: boolean
  ticket: Models.Ticket | null
}>()

const emit = defineEmits(['update:modelValue'])
const visible = ref(props.modelValue)
const posting = ref(false)
const form = ref({ content: '' })
const commentStore = useCommentStore()

watch(
  () => props.modelValue,
  (v) => {
    visible.value = v
  },
)

watch(
  () => props.modelValue,
  async (visible) => {
    emit('update:modelValue', visible)

    if (!props.ticket) return

    if (visible) {
      await commentStore.init(props.ticket.id)
    } else {
      commentStore.destroy(props.ticket.id)
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (props.ticket) commentStore.destroy(props.ticket.id)
})

function formatDate(s?: string) {
  if (!s) return ''
  try {
    return new Date(s).toLocaleString()
  } catch {
    return s
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
    await commentStore.addComment(props.ticket.id, payload)
    form.value.content = ''
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
  if (props.ticket) commentStore.destroy(props.ticket.id)
  form.value.content = ''
  emit('update:modelValue', false)
}
</script>

<style scoped>
.fixed-dialog .el-dialog {
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  padding: 0;
}

.fixed-dialog .dialog-content {
  max-height: calc(80vh - 120px);
  overflow-y: auto;
  padding-right: 8px;
}

.dialog-body {
  display: flex;
  flex-direction: column;
  height: 70vh; /* chiều cao tổng cho body */
  padding: 16px;
}

.comments-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
}

.comment-item .compact-card {
  padding: 8px 12px;
  font-size: 13px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  margin-bottom: 4px;
}

.user-name {
  font-weight: 500;
}

.comment-date {
  color: #888;
}

.comment-content {
  white-space: pre-wrap;
  font-size: 13px;
  line-height: 1.3;
}

.form-wrapper {
  flex-shrink: 0;
}

.comment-form .el-input__inner {
  font-size: 13px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 4px;
}

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
</style>
