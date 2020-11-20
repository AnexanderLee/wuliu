import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/poOrder',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/poOrder/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/poOrder',
    method: 'put',
    data
  })
}
export function getById(id) {
  return request({
    url: 'api/getById/' + id,
    method: 'get'
  })
}
