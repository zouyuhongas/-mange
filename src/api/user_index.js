import axios from '@/utlis/myaxios'

export const getAllUser = (params) => {
  return axios({
    url: 'users',
    params
  })
}

// 实现数据的新增
export const addUser = (data) => {
  return axios({
    url: 'users',
    method: 'post',
    data
  })
}
// 编辑用户信息
export const editUser = (data) => {
  return axios({
    url: `users/${data.id}`,
    method: 'put',
    data
  })
}
// 实现用户角色分配
export const grantUserRole = (data) => {
  return axios({
    url: `users/${data.id}/role`,
    method: 'put',
    data: { rid: data.rid }
  })
}

// 实现数据的删除
export const delUserById = (id) => {
  return axios({
    url: `users/${id}`,
    method: 'delete'
  })
}

// 修改用户状态
export const updataUserState = (uid, type) => {
  return axios({
    url: `users/${uid}/state/${type}`,
    method: 'put'
  })
}
