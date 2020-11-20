import request from '@/utils/request'

export function count() {
  return request({
    url: 'api/visits',
    method: 'post'
  })
}

export function get() {
  return request({
    url: 'api/visits',
    method: 'get'
  })
}

export function getChartData() {
  return request({
    url: 'api/visits/chartData',
    method: 'get'
  })
}
export function getTodo(data) {
  return request({
    url: 'api/activity/todo',
    method: 'post',
    data
  })
}

// 已办任务
export function getDealTask(data) {
  return request({
    url: 'api/activity/historicList',
    method: 'post',
    data
  })
}
