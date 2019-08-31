import axios from '@/utlis/myaxios.js'
export const login = (id, sel) => {
  // 接口看文档
  return axios({
    url: `categories/${id}/attributes`,
    pamars: { sel }
  })
}
