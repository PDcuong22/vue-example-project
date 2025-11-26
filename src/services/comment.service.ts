import {CommentApi} from '@/api/comment.api'
import type { CommentDto } from '@/types/dto/comment.dto'
import { Models } from '@/types'
const CommentService = {
  async getComments(ticketId: number): Promise<{data:Models.Comment[]}> {
    const res = await CommentApi.get(ticketId)
    return res.data.data
  },

  async addComment(ticketId: number, payload: CommentDto): Promise<void> {
    const res = await CommentApi.create(ticketId, payload)
    return res.data.data
  },

  async deleteComment(commentId: number): Promise<void> {
    await CommentApi.delete(commentId)
  },
}

export default CommentService
