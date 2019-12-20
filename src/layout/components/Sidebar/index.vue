<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">

    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="setDefaultActive"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
    	<h2 v-show="!isCollapse" class="titleTxt">{{companyName}}</h2>
      <sidebar-item v-for="route in permission_routers" :key="route.name" :item="route" :base-path="route.path"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<style type="text/css">
	.titleTxt {
		font-size: 28px;
		color: #FFFFFF;
		text-align: center;
		opacity: 0;
  	animation: isShow 0.7s linear 0.1s;
  	animation-fill-mode: forwards;
    white-space:nowrap;
    text-overflow:ellipsis;
    overflow:hidden;
	}
	@keyframes isShow{
		from{
			opacity: 0;
		}
		to{
			opacity: 1;
		}
	}
</style>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    },
    companyName() {
      return this.$storage.get('userInfo').companyShortname
    },
    setDefaultActive() {
      return this.$route.path==='/home'?this.$route.path+'/index':this.$route.path
    }
  }
}
</script>
