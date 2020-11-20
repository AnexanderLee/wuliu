import { constantRouterMap } from '@/router/routers'
import Layout from '@/layout/Layout'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, asyncRouter) {
      commit('SET_ROUTERS', asyncRouter)
    }
  }
}

export const copyAsyncRouter = (routers) => {
  const copyRouters = []
  routers.forEach((item) => {
    if (item.suffix) {
      const copyItem = Object.assign({}, item)

      const newRouter1 = Object.assign({}, copyItem)
      newRouter1.name = '新增' + copyItem.name
      newRouter1.path = copyItem.path + '_add'
      newRouter1.meta = Object.assign({}, copyItem.meta)
      newRouter1.meta.title = newRouter1.name
      copyRouters.push(newRouter1)

      const newRouter2 = Object.assign({}, copyItem)
      newRouter2.name = '修改' + copyItem.name
      newRouter2.path = copyItem.path + '_update'
      newRouter2.meta = Object.assign({}, copyItem.meta)
      newRouter2.meta.title = newRouter2.name
      copyRouters.push(newRouter2)

      const newRouter3 = Object.assign({}, copyItem)
      newRouter3.name = copyItem.name + '-下推'
      newRouter3.path = copyItem.path + '_push'
      newRouter3.meta = Object.assign({}, copyItem.meta)
      newRouter3.meta.title = newRouter3.name
      copyRouters.push(newRouter3)

      const newRouter4 = Object.assign({}, copyItem)
      newRouter4.name = copyItem.name + '-审核'
      newRouter4.path = copyItem.path + '_review'
      newRouter4.meta = Object.assign({}, copyItem.meta)
      newRouter4.meta.title = newRouter4.name
      copyRouters.push(newRouter4)

      item.name = '查看' + copyItem.name
      item.meta.title = item.name
    }
    copyRouters.push(item)
  })
  return copyRouters
}

export const filterAsyncRouter = (routers) => { // 遍历后台传来的路由字符串，转换为组件对象
  const copyRouters = copyAsyncRouter(routers)
  return copyRouters.filter(router => {
    if (router.component) {
      if (router.component === 'Layout') { // Layout组件特殊处理
        router.component = Layout
      } else {
        const component = router.component
        router.component = loadView(component)
      }
    }
    if (router.children && router.children.length) {
      router.children = filterAsyncRouter(router.children)
    }
    return true
  })
}

export const loadView = (view) => { // 路由懒加载
  return () => import(`@/views/${view}`)
}

export default permission
