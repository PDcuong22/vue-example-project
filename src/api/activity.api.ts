import axios from "./axios"
export const ActivityApi = {
  getAll(params?:Record<string, unknown>){
    return axios.get("/activities", {params})
  }
}
