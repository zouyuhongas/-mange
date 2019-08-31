import axios from '@/utlis/myaxios.js'

// 添加分类
export const getAllGoodslist = (type) => {
  return axios({
    url: `categories`,
    params: { type }
  })
}
