'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
// 武汉环境
    // BASE_API: '"http://113.57.121.110:10105"',
    // LOAD_UPCOMING: true, // 是否加载待办
    // ACTIVITI_API: '"http://113.57.121.110:10104"', //流程服务地址
// 临沂环境
    BASE_API: '"http://192.168.6.190:8088"',
    LOAD_UPCOMING: true, // 是否加载待办
    ACTIVITI_API: '"http://192.168.6.190:7070"', //流程服务地址
 //郭梦
    // BASE_API: '"http://192.168.9.177:8000"',
    // LOAD_UPCOMING: false, // 是否加载待办
    // ACTIVITI_API: '"http://192.168.9.167:7070"' //流程服务地址
//彭辉
    // BASE_API: '"http://192.168.8.135:9000"',
    // LOAD_UPCOMING: false, // 是否加载待办
    // ACTIVITI_API: '"http://192.168.8.135:7070"' //流程服务地址
//徐辉
    // BASE_API: '"http://192.168.8.119:8000"',
    // LOAD_UPCOMING: false, // 是否加载待办
    // ACTIVITI_API: '"http://192.168.8.119:7070"' //流程服务地址
// 王雅甜
    // BASE_API: '"http://192.168.8.134:8000"',
    // LOAD_UPCOMING: false, // 是否加载待办
    // ACTIVITI_API: '"http://192.168.8.134:7070"' //流程服务地址
//other
    // BASE_API: '"http://192.168.9.170:8000"',
    // LOAD_UPCOMING: false, // 是否加载待办
    // ACTIVITI_API: '"http://192.168.9.170:7070"' //流程服务地址
})
