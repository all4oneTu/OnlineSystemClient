import api from './index'
import { axios } from '../utils/request'


export function getSmsCaptcha(parameter) {
    return axios({
      url: api.SendSms,
      method: 'post',
      data: parameter
    })
}
export function get2step (parameter) {
    return axios({
      url: api.twoStepCode,
      method: 'post',
      data: parameter
    })
}
export function login (parameter) {
  return axios({
    // 用户登录接口改成自己的
    url: api.UserLogin,
    method: 'post',
    data: parameter
  })
}
export function logout () {
  return axios({
    url: api.Logout,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function getInfo () {
  return axios({
    url: api.UserInfo,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}