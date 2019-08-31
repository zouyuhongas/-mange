import axios from '@/utlis/myaxios.js'
// nuxt.js  vue的项目   小程序  接口的写法 和这个 都是大同小异的
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

// 角色授权
export const grantRolsById = (roleId, rids) => {
  return axios({
    method: 'post',
    url: `roles/${roleId}/rights`,
    data: { rids }
  })
}
// 添加角色
export const addRoleList = (data) => {
  return axios({
    method: 'post',
    url: `roles`,
    data
  })
}
// 编辑提交角色
export const compileUserList = (id, data) => {
  return axios({
    url: `roles/${id}`,
    method: 'put',
    data
  })
}
