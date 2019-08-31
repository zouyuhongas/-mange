import axios from '@/utlis/myaxios.js'

export const getAllRightList = (type) => {
  return axios({
    url: `rights/${type}`
  })
}

// 获取左侧菜单权限
export const getLeftMenu = (type) => {
  return axios({
    url: `menus`
  })
}
