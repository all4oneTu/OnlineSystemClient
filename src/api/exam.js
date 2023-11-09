
import api from './index'
import { axios } from '../utils/request'


export function getExamCardList () {
    return axios({
      url: api.ExamCardList,
      method: 'get',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
}
export function questionUpdate (parameter) {
  console.log(parameter)
  return axios({
    url: api.ExamQuestionUpdate,
    method: 'post',
    data: parameter
  })
}
export function getQuestionAll () {
  return axios({
    url: api.ExamQuestionAll,
    method: 'get'
  })
}

export function getQuestionSelection () {
  return axios({
    url: api.ExamQuestionSelection,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}