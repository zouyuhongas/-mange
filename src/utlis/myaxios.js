import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么:获取token,设置请求头
  // 1.获取token
  let mytoken = localStorage.getItem('itcast_manager_35_token')
  if (mytoken) {
    // 设置请求头:config.headers是一个对象,里面就包含转换而当前的请求头的设置
    // Authorization是文档中设置的这个键
    config.headers.Authorization = mytoken
  }
  return config
}, function (error) {
  return Promise.reject(error)
})
export default axios
