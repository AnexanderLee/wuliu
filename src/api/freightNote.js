import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/freightNote',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/freightNote/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/freightNote',
    method: 'put',
    data
  })
}
