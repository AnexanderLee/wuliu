import request from '@/utils/request'

export function initData(url, params) {
  return request({
    url: url,
    method: 'get',
    params
  })
}

export function getData(url, orderNo) {
  return request({
    url: url + orderNo,
    method: 'get'
  })
}
// export function getParamsData(url, data) {
//   return request({
//     url: url ,
//     params:{da}
//     method: 'get'
//   })
// }
export function postData(url, data) {
  return request({
    url: url,
    method: 'post',
    data
  })
}
export function deleteData(url, ids) {
  return request({
    url: url + ids,
    method: 'delete'
  })
}

