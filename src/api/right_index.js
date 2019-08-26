import axios from '@/utlis/myaxios.js'

export const getAllRightList = (type) => {
  return axios({
    url: `rights/${type}`
  })
}
