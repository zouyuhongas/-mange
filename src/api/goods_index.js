import axios from '@/utlis/myaxios.js'

export const getAllGoodsList = (params) => {
  return axios({
    url: 'goods',
    params
  })
}
