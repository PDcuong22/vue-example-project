import { RoleApi } from "@/api/role.api"

const RoleService= {
  async getAllRoles(){
    const res = await RoleApi.getAll()
    return res.data.data
  }
}

export default RoleService
