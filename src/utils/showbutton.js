// import store from '@/store'
import constants from '@/config/constants'
/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/auth/directive.vue
 */
// const currentUser = store.getters && store.getters.user
export function checkButton(currentRow) {
  // const _createPersonId = currentRow.createPersonId
  const _orderStatus = currentRow.orderStatus
  // if (_createPersonId === undefined) {
  //   console.error('使用v-button判断权限，必须有createPersonId属性')
  // } else
  if (_orderStatus === undefined) {
    console.error('使用v-button判断权限，必须有orderStatus属性')
  } else {
    if ((_orderStatus === constants.state_no_submit ||
        _orderStatus === constants.state_is_reject)) {
      return false
    }
  }
  return true
}
