<template>
  <div class="navbar">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
    <breadcrumb class="breadcrumb-container"/>
    <div class="right-menu">
      <table style="height: 100%;line-height: 100%;padding:0;margin:0;">
        <tr>
          <td class="right-space"><span style="font-weight: bold;">欢迎登录:</span></td>
          <td class="right-space"><el-dropdown trigger="click">
            <span>
              <span class="user-avatar"> {{ user.realname }}</span>
              <!--          <img :src="user.avatar" class="user-avatar">-->
              <!--              <i class="el-icon-caret-bottom"/>-->
            </span>
            <el-dropdown-menu slot="dropdown">
              <!--          <a target="_blank" href="https://docs.auauz.net/">-->
              <!--            <el-dropdown-item>-->
              <!--              项目文档-->
              <!--            </el-dropdown-item>-->
              <!--          </a>-->
              <span style="display:block;" @click="show = true">
                <el-dropdown-item>
                  布局设置
                </el-dropdown-item>
              </span>
              <router-link to="/user/center">
                <el-dropdown-item>
                  个人中心
                </el-dropdown-item>
              </router-link>
              <span style="display:block;" @click="open">
                <el-dropdown-item divided>
                  退出登录
                </el-dropdown-item>
              </span>
            </el-dropdown-menu>
          </el-dropdown></td>
          <td style="padding-top: 10px;">
            <template v-if="device!=='mobile'" style="vertical-align: bottom">
              <el-tooltip content="全屏" effect="dark" placement="bottom">
                <screenfull class="screenfull-svg"/>
              </el-tooltip>
            </template>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'user',
      'device'
    ]),
    show: {
      get() {
        return this.$store.state.settings.showRightPanel
      },
      set(val) {
        this.$store.dispatch('changeSetting', {
          key: 'showRightPanel',
          value: val
        })
      }
    }
  },
  methods: {
    open() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.logout()
      })
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.dialogVisible = false
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    vertical-align: middle;
    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }
    .breadcrumb-container{
      float: left;
    }
    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }
    .right-menu {
      float: right;
      height: 100%;
      /*width: 500px;*/
      padding: 0px 15px 0px;
      font-size:13px;
      &:focus{
        outline: none;
      }
      .right-space {
        padding-right: 10px;
      }
      .screenfull-svg{
        margin: 0;
        padding: 0;
        cursor: pointer;
        fill: #5a5e66;
        width: 20px;
        height: 20px;
        vertical-align: 0px !important;
      }
      .user-avatar {
        cursor: pointer;
        color: #42B983;
      }
      .user-avatar:hover {
        color: green;
        cursor: pointer;
        text-decoration: underline;
      }
      .el-icon-caret-bottom {
        cursor: pointer;
        font-size: 13px;
      }
    }
  }
</style>
