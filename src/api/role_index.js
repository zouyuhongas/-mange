import axios from '@/utlis/myaxios.js'

// 获取用户数据
export const getAllRoleList = () => {
  return axios({
    url: 'roles'
  })
}

// 删除标签
export const delRightsById = (roleId, rightId) => {
  return axios({
    method: 'delete',
    url: `roles/${roleId}/rights/${rightId}`
  })
}
