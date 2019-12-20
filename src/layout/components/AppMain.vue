<template>
  <section class="app-main">
    <transition name="fade" mode="out-in">
      <!-- <router-view :key="key"></router-view> -->
      <router-view></router-view>
    </transition>
  </section>
</template>

<script>
  import DOM from '@/utils/domTools'
export default {
  name: 'AppMain',
  data(){
    return {
      resizeTimer: '',
    }
  },
  watch: {
    '$route.path'(val){
      this.setMenuId(val.slice(1))
    }
  },
  methods:{
    setMenuId(val){
      let urlList = val.split('/')
      if(urlList.length === 2 && urlList[1] === 'index'){
        urlList.pop()
      }
      const menuList = this.$storage.get('rootMenu') || []
      let tempItem = null
      menuList.length && urlList.length && urlList.forEach((v,index) => {
        tempItem = recursion(index?(tempItem?tempItem.children:[]):menuList,v)
      })
      function recursion(list,str) {
        return list.find(cv => {
          return str === cv.url
        })
      }
      this.$storage.set('menuId',tempItem?tempItem.id:'')
      this.$storage.set('dataType',tempItem?tempItem.dataType:'')
    },
    setSysInfo(){
      this.$store.commit('SET_SYSTEMINFO',{
        offsetWidth: document.body.offsetWidth,
        offsetHeight: document.body.offsetHeight,
        clientWidth: document.body.clientWidth,
        clientHeight: document.body.clientHeight,
        scrollWidth: document.body.scrollWidth,
        scrollHeight: document.body.scrollHeight,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
        width: screen.width,
        height: screen.height,
      })
    },
    resizeSysInfo(){
      const that = this
      clearTimeout(that.resizeTimer)
      that.resizeTimer = setTimeout(function () {
        that.setSysInfo()
      },300)
    }
  },
  created(){
    this.setSysInfo()
    DOM.on(window,'resize',this.resizeSysInfo)
    this.setMenuId(this.$route.path.slice(1))
  },
  mounted(){

  },
  beforeDestroy(){
    DOM.off(window,'resize',this.resizeSysInfo)
  },
  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100% - 50px);
  height: calc(100% - 50px);
  position: relative;
  overflow: hidden;
}
.fixed-header+.app-main {
  padding-top: 50px;
  height: 100vh;
  overflow: auto;
}
.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100% - 84px);
    height: calc(100% - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}



</style>
