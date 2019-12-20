<!----------------------------templateManage 用户自定义修改  注意要与最下边对应的样式名称保持一致-------------------------------->
<template>
    <custom-home-page></custom-home-page>
</template>

<script>
  import customHomePage from '@/components/customHomePage'

  // ajax后台方法
  //*******************************************************用户自定义修改 start ***************************************************************************

  //*******************************************************用户自定义修改 end ***************************************************************************

  //	公共方法



  export default {
    //数据
    data() {
      return {

      }
    },

    //子组件
    components: {
      customHomePage
    },

    /*生命周期函数开始*/
    //vue实例化之前
    beforeCreate() {

    },

    //vue实例化后调用
    created() {

    },

    //挂载之前
    beforeMount() {

    },
    //真实DOM挂载后，仅限组件本身的挂载，如果存在子组件，并且需求子组件全部被挂载后进行操作，需使用vm.$nextTick顶替mounted（在mounted内部调用vm.$nextTick）；
    mounted() {

    },

    //数据更新前调用
    beforeUpdate() {

    },

    //数据更新后调用（避免使用，最好使用计算属性或watch函数）,仅限组件本身的更新，如果存在子组件，并且需求子组件全部被更新后进行操作，需使用vm.$nextTick顶替updated（在updated内部调用vm.$nextTick）；
    updated() {

    },
    /*生命周期函数结束*/

    //方法
    methods: {

    },

    //计算属性
    computed: {
    },

    //观察者,可监听数据，属性和方法
    watch: {

    }
  }
</script>



<!----------------------------templateManage 用户自定义修改  注意要与最上边定义的样式名称保持一致-------------------------------->
<style  lang="scss" rel="text/css">
  .mainPage {
    height: 100%;
    position: relative;
  }
</style>
