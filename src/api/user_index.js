import axios from '@/utlis/myaxios'

export const getAllUser = (params) => {
  return axios({
    url: 'users',
    params
  })
}
