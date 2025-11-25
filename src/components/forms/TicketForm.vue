<template>
  <el-form :model="form" :rules="rules" ref="formRef" label-width="110px">
    <el-form-item label="Title" prop="title">
      <el-input v-model="form.title" placeholder="Title" />
    </el-form-item>

    <el-form-item label="Message" prop="description">
      <el-input
        v-model="form.description"
        type="textarea"
        :rows="6"
        placeholder="Describe the issue..."
      />
    </el-form-item>

    <el-form-item label="Labels" prop="label_ids">
      <el-checkbox-group v-model="form.label_ids">
        <el-checkbox v-for="l in labels" :key="l.id" :label="l.id">{{ l.name }}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>

    <el-form-item label="Categories" prop="category_ids">
      <el-checkbox-group v-model="form.category_ids">
        <el-checkbox v-for="c in categories" :key="c.id" :label="c.id">{{ c.name }}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>

    <el-form-item label="Priority" prop="priority_id">
      <el-select v-model="form.priority_id" placeholder="Select priority">
        <el-option v-for="p in priorities" :key="p.id" :label="p.name" :value="p.id" />
      </el-select>
    </el-form-item>

    <template v-if="isEdit">
      <el-form-item label="Status" prop="status_id">
        <el-select v-model="form.status_id" placeholder="Select status" clearable>
          <el-option v-for="s in statuses" :key="s.id" :label="s.name" :value="s.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="Assignee" prop="assigned_to">
        <el-select v-model="form.assigned_to" placeholder="Select assignee" clearable>
          <el-option v-for="u in usersStore.agents" :key="u.id" :label="u.name" :value="u.id" />
        </el-select>
      </el-form-item>
    </template>

    <el-form-item label="Attachments">
      <div v-if="attachments.length" class="existing-attachments" style="margin-bottom:8px">
      <div v-for="att in attachments" :key="att.id" style="display:flex;align-items:center;margin-bottom:6px">
        <a :href="att.url" target="_blank" style="flex:1">{{ att.file_name }}</a>
        <el-button
          size="small"
          type="text"
        >
          {{ 'Remove' }}
        </el-button>
      </div>
    </div>
      <el-upload
        class="upload-demo"
        action=""
        drag
        multiple
        :auto-upload="false"
        :file-list="fileList"
        :on-change="handleUploadChange"
        :on-remove="handleRemove"
        list-type="text"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">Drag & Drop your files or <em>Browse</em></div>
        <template v-slot:tip>
          <div class="el-upload__tip">Max 5 files. Files are uploaded when submitting.</div>
        </template>
      </el-upload>
    </el-form-item>

    <div class="form-actions" style="text-align: right">
      <el-button @click="$emit('cancel')">Cancel</el-button>
      <el-button type="primary" @click="onSubmit">Submit</el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref, watch, onMounted, computed } from 'vue'
import { defineProps, defineEmits } from 'vue'
import type { PropType } from 'vue'
import type { UploadFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import type { Models } from '@/types'
import { getAllMeta } from '@/services/meta.service'
import type { CreateTicketDto } from '@/types/dto'
import { useUsersStore } from '@/stores/useUsersStore'
import { useAuthStore } from '@/stores/useAuthStore'

const props = defineProps({
  initial: { type: Object as PropType<Models.Ticket | null>, default: null },
})

const emit = defineEmits(['submit', 'cancel'])

const usersStore = useUsersStore()
const authStore = useAuthStore()

const formRef = ref()

const form = reactive({
  id: null as number | null,
  title: '',
  description: '',
  label_ids: [] as number[],
  category_ids: [] as number[],
  priority_id: null as number | null,
  status_id: null as number | null,
  assigned_to: null as number | null,
})

const rules = {
  title: [{ required: true, message: 'Title is required', trigger: 'blur' }],
  description: [{ required: true, message: 'Description is required', trigger: 'blur' }],
  label_ids: [{ required: true, type: 'array', min: 1, message: 'Select at least 1 label', trigger: 'change' }],
  category_ids: [{ required: true, type: 'array', min: 1, message: 'Select at least 1 category', trigger: 'change' }],
  priority_id: [{ required: true, message: 'Priority is required', trigger: 'change' }],
}

const labels = ref<Models.Meta[]>([])
const categories = ref<Models.Meta[]>([])
const priorities = ref<Models.Meta[]>([])
const statuses = ref<Models.Meta[]>([])
const attachments = ref<Models.Attachment[]>([])

const isEdit = computed(() => form.id !== null)

const fileList = ref<UploadFile[]>([])
const MAX_FILES = 5
const MAX_FILE_SIZE = 10 * 1024 * 1024
const allowedTypes = ['image/', 'application/pdf']
const submitting = ref(false)

async function loadMeta() {
  try {
    const res = await getAllMeta()
    labels.value = res.labels
    categories.value = res.categories
    priorities.value = res.priorities
    statuses.value = res.statuses
  } catch (e) {
    console.error('Failed to load meta', e)
  }
}

onMounted(async () => {
  await loadMeta()
  if (authStore.isAdmin || authStore.isAgent) {
    await usersStore.fetchAllAgents()
  }
})

function validateFile(f: UploadFile) {
  const anyF = f
  const raw = anyF.raw
  if (!raw) return { ok: false, reason: 'Invalid file object' }
  if (raw.size && raw.size > MAX_FILE_SIZE) return { ok: false, reason: 'File too large' }
  if (raw.type) {
    const ok = allowedTypes.some(prefix => raw.type.startsWith(prefix))
    if (!ok) return { ok: false, reason: 'Unsupported file type' }
  }
  return { ok: true }
}

watch(
  () => props.initial,
  (v) => {
    if (v) {
      form.id = v.id ?? null
      form.title = v.title ?? ''
      form.description = v.description ?? ''
      form.label_ids = Array.isArray(v.labels) ? v.labels.map(l => l.id) : []
      form.category_ids = Array.isArray(v.categories) ? v.categories.map(c => c.id) : []
      form.priority_id = v.priority ? v.priority.id : null
      form.status_id = v.status ? v.status.id : null
      form.assigned_to = v.assigned_to ? v.assigned_to.id : null
      attachments.value = Array.isArray(v.attachments) ? v.attachments : []
    } else {
      form.id = null
      form.title = ''
      form.description = ''
      form.label_ids = []
      form.category_ids = []
      form.priority_id = null
      form.status_id = null
      form.assigned_to = null
      attachments.value = []
    }
  },
  { immediate: true },
)


function handleUploadChange(file: UploadFile, files: UploadFile[]) {
  const next = files.slice(0, MAX_FILES)
  for (const f of next) {
    const v = validateFile(f)
    if (!v.ok) {
      ElMessage.error(`${f.name}: ${v.reason}`)
      const idx = next.indexOf(f)
      if (idx > -1) next.splice(idx, 1)
    }
  }
  fileList.value = next
}
function handleRemove(file: UploadFile, files: UploadFile[]) {
  fileList.value = files.slice(0, MAX_FILES)
}

function onSubmit() {
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    const payload: CreateTicketDto = {
      title: form.title,
      description: form.description,
      labels: form.label_ids,
      categories: form.category_ids,
      priority_id: form.priority_id,
      status_id: form.status_id,
      assigned_user_id: form.assigned_to,
    }

    try {
      submitting.value = true
      const files = fileList.value.map((f) => (f.raw)).filter(Boolean) as File[]
      emit('submit', { payload, files })
    } finally {
      submitting.value = false
    }
  })
}
</script>

<style scoped>
.form-actions {
  margin-top: 12px;
}
.upload-demo {
  width: 100%;
  border-radius: 4px;
}
</style>
