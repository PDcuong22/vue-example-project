import { defineStore } from "pinia"
import {Models} from "@/types"
import { useAuthStore } from "./useAuthStore"
import { createEcho } from "@/plugins/echo"
import CommentService from "@/services/comment.service"
import Echo from "laravel-echo"
import { ref } from "vue"

export const useCommentStore = defineStore('comments', () => {
  const comments = ref<Models.Comment[]>([])
  const loading = ref(false)

  const authStore = useAuthStore()

  let echo: Echo<'pusher'> | null = null
  let channel: any |null = null

  async function init(ticketId: number) {
    loading.value = true
    const res = await CommentService.getComments(ticketId)
    comments.value = res

    echo = createEcho(authStore.token)

    channel = echo.private(`ticket.${ticketId}`)

    channel.listen('.CommentCreated', (event: Models.Comment) => {
      comments.value.push(event)
    })

    loading.value = false
  }

  function destroy(ticketId: number) {
    try {
      channel?.stopListening('.CommentCreated')
      echo?.leaveChannel(`ticket.${ticketId}`)
    } catch (e) {
      console.warn(e)
    }

    comments.value = []
  }

  async function addComment(ticketId: number, payload: { content: string }) {
    await CommentService.addComment(ticketId, payload)
  }

  return {comments, loading, init, addComment, destroy}

})
