import button from './button'

const install = function(Vue) {
  Vue.directive('button', button)
}

if (window.Vue) {
  window['button'] = button
  Vue.use(install); // eslint-disable-line
}

button.install = install
export default button
