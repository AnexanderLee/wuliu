import { initData, postData } from '@/api/data'

/**
 * 启动流程
 * @param url
 * @param params
 * @returns {*}
 */
export function flow_start(systemType, orderNo) {
  return initData('api/activity/startFlow', {
    systemOrderType: systemType,
    orderNo: orderNo
  })
}

/**
 * 审核
 * @param url
 * @param params
 * @returns {*}
 */
export function flow_review(data) {
  return postData('api/activity/review', data)
}

/**
 * 查询审核记录
 * @param data
 * @returns {*}
 */
export function find_review(systemType, orderNo) {
  return initData('api/activity/review', {
    systemOrderType: systemType,
    orderNo: orderNo
  })
}

