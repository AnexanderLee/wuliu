import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/tSeoutStock',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/tSeoutStock/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/tSeoutStock',
    method: 'put',
    data
  })
}
