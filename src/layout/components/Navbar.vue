<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>

    <div class="right-menu">
      <div v-if="userNmae" class="right-menu-item" style="font-size: 14px;">
        <span style="display: inline-block;vertical-align: middle">您好：{{userNmae}}</span>
      </div>

      <el-tooltip effect="dark" content="搜索菜单" placement="bottom">
        <search id="header-search" class="right-menu-item" />
      </el-tooltip>

      <template v-if="userInfo.userId === '0'">
        <error-log class="errLog-container right-menu-item"></error-log>
      </template>

      <el-tooltip effect="dark" content="全屏" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip>

      <el-tooltip effect="dark" content="换肤" placement="bottom">
        <theme-picker class="theme-switch right-menu-item" @change="themeChange"></theme-picker>
      </el-tooltip>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <!--<img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">-->
          <svg-icon class-name='user-avatar' icon-class="user" />
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            主页
          </el-dropdown-item>
          </router-link>
          <el-dropdown-item>
            <span @click="changePw" style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <component v-if="showDialog" :is="changePassWord" :visible="isVisible" @close-dialog="closeDialog"></component>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import ThemePicker from '@/components/ThemePicker'
import Search from '@/components/HeaderSearch'
import {changePassWord} from '@/components/dialog'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    ThemePicker,
    changePassWord,
    Search
  },
  data(){
    return {
      showDialog: false,
      isVisible: false,
      userInfo: {},
    }
  },
  created(){
    this.userInfo = this.$storage.get('userInfo')
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ]),
    userNmae: function () {
      return this.userInfo.userName || ''
    },
    changePassWord(){
      return 'changePassWord'
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        // location.reload() // 为了重新实例化vue-router对象 避免bug
        // this.$router.push(`/login?redirect=/login`)
      }).catch((error) => {
      	console.log(error)
      })
    },
    changePw() {
      const that = this
      that.showDialog = true
      that.isVisible = true

    },
    closeDialog() {
      this.isVisible = false
      this.showDialog = false
    },
    themeChange(val) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: val
      })
    },
  }
}
</script>

<style lang="scss" scoped>
  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    position: relative;
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
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      &:focus{
        outline: none;
      }
      .right-menu-item {
        display: inline-block;
        padding: 0 3px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;
      }
      .screenfull {
      }
      .international{
        vertical-align: top;
      }
      .theme-switch {
        vertical-align: 15px;
      }
      .avatar-container {
        height: 50px;
        margin-right: 30px;
        .avatar-wrapper {
          cursor: pointer;
          margin-top: 5px;
          position: relative;
          .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }
          .el-icon-caret-bottom {
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>

