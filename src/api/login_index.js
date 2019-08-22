import axios from '@/utlis/myaxios.js'
export const login = (data) => {
  // 接口看文档
  return axios({
    url: 'login',
    method: 'post',
    data
  })
}
