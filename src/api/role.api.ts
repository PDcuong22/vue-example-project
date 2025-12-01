import axios from "./axios"
export const RoleApi = {
  getAll(){
    return axios.get("/roles")
  }
}
