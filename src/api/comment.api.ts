import axios from './axios'
import type { CommentDto } from '@/types/dto/comment.dto'
export const CommentApi = {
  get(ticketId: number | null) {
    return axios.get(`/comments/${ticketId}`)
  },

  create(ticketId: number | null, payload: CommentDto) {
    return axios.post(`/comments/${ticketId}`, payload)
  },

  delete(commentId: number) {
    return axios.delete(`/comments/${commentId}`)
  }
}
