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

    <el-form-item label="Status" prop="status_id">
      <el-select v-model="form.status_id" placeholder="Select status" clearable>
        <el-option v-for="s in statuses" :key="s.id" :label="s.name" :value="s.id" />
      </el-select>
    </el-form-item>

    <el-form-item label="Assignee" prop="assigned_to">
      <el-select v-model="form.assigned_to" placeholder="Select assignee" clearable>
        <el-option v-for="u in users" :key="u.id" :label="u.name" :value="u.id" />
      </el-select>
    </el-form-item>

    <el-form-item label="Attachments">
      <el-upload
        class="upload-demo"
        action=""
        drag
        multiple
        :auto-upload="false"
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
import { reactive, ref, watch, onMounted } from 'vue'
import { defineProps, defineEmits } from 'vue'
import type { PropType } from 'vue'
import type { UploadFile } from 'element-plus'
import type { AuthUser, Ticket } from '@/types/models'
import type { Meta } from '@/types/models'
import { getAllMeta } from '@/services/meta.service'
import type { CreateTicketDto } from '@/types/dto'

const props = defineProps({
  initial: { type: Object as PropType<Ticket | null>, default: null },
  users: { type: Array as PropType<AuthUser[]>, default: () => [] },
})

const emit = defineEmits(['submit', 'cancel'])

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
  // add other rules as needed
}

const labels = ref<Meta[]>([])
const categories = ref<Meta[]>([])
const priorities = ref<Meta[]>([])
const statuses = ref<Meta[]>([])

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

onMounted(loadMeta)

/* --- Watch initial and populate form according to new Ticket model --- */
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
      // keep fileList as is (attachments require separate handling)
    } else {
      form.id = null
      form.title = ''
      form.description = ''
      form.label_ids = []
      form.category_ids = []
      form.priority_id = null
      form.status_id = null
      form.assigned_to = null
    }
  },
  { immediate: true },
)

/* --- normalize UploadFile -> UploadFileWithRaw to avoid unsafe casts --- */
// function toUploadFileWithRaw(f: UploadFile): UploadFileWithRaw {
//   // preserve existing props; ensure uid is string and raw preserved
//   const anyF = f as any
//   return {
//     uid: anyF.uid != null ? String(anyF.uid) : String(Date.now()),
//     name: anyF.name,
//     size: anyF.size,
//     type: anyF.type,
//     percent: anyF.percent,
//     status: anyF.status,
//     response: anyF.response,
//     url: anyF.url,
//     raw: anyF.raw,
//   }
// }

function handleUploadChange(file: UploadFile, files: UploadFile[]) {
  // fileList.value = files.slice(0, 5).map(toUploadFileWithRaw)
  console.log('Upload change', file, files)
}
function handleRemove(file: UploadFile, files: UploadFile[]) {
  console.log('Remove file', file, files)
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

    emit('submit', payload)

    // if (fileList.value.length) {
    //   const fd = new FormData()
    //   Object.entries(payload).forEach(([k, v]) => {
    //     if (v !== undefined && v !== null)
    //       fd.append(k, Array.isArray(v) ? JSON.stringify(v) : String(v))
    //   })
    //   fileList.value.forEach((f) => {
    //     if (f.raw) fd.append('files[]', f.raw)
    //   })
    //   emit('submit', fd)
    // } else {
    //   emit('submit', payload)
    // }
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
