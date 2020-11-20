import store from '@/store'
import constants from '@/config/constants'
export default {
  inserted(el, binding, vnode) {
    // state_no_submit: 29, // 未提交
    // state_review_ing: 30, // 审核中
    // state_review_over: 31, // 已审核
    // state_is_stop: 72, // 已终止
    // state_is_reject: 113, // 已驳回
    const { value } = binding
    if (value && value instanceof Object) {
      const roles = store.getters && store.getters.roles
      // const user = store.getters && store.getters.user
      const permissionRoles = value.permission
      let hasPermission = roles.some(role => {
        return permissionRoles.includes(role)
      })
      if (hasPermission) {
        // 单据未提交并且是创建人是登陆人
        hasPermission = false
        // const createPersonId = value.row.createPersonId
        const orderStatus = value.row.orderStatus
        // if (value.row.createPersonId === undefined) {
        //   console.error('使用v-button判断权限，必须有createPersonId属性')
        // } else
        if (value.row.orderStatus === undefined) {
          console.error('使用v-button判断权限，必须有orderStatus属性')
        } else {
          // if (createPersonId === user.id && (orderStatus === constants.state_no_submit ||
          //     orderStatus === constants.state_is_reject)) {
          //   hasPermission = true
          // }
          if ((orderStatus === constants.state_no_submit ||
            orderStatus === constants.state_is_reject)) {
            hasPermission = true
          }
        }
      }
      if (!hasPermission) {
        // 控制列表的修改删除
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need roles! Like v-button="{row: rowData,permission:['admin','edit']}"`)
    }
  }
}
