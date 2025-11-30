import { ActivityApi } from "@/api/activity.api"

const ActivityService= {
  async getAllActivities(params?: Record<string, unknown>){
    const res = await ActivityApi.getAll(params)
    return {data: res.data.data, meta: res.data.meta}
  }
}

export default ActivityService
