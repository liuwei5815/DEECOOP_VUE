<template>
  <el-dialog v-el-drag-dialog title="数据字典" :visible.sync="isVisible" @close="dialogClose" append-to-body width="300px">
    <div style="box-sizing: border-box;padding: 10px;overflow: auto" :style="dialogTree.length?'height: 400px':''">
      <base-tree v-loading="dialogLoading" ref="dialogTree" :data="dialogTree"
                 :treeConfigs="configs" :propName="configs.propName"
                 :checkedList="checkedList" @treedatabridge="dialogDataBridge"></base-tree>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save">确 定</el-button>
      <el-button plain type="primary" @click="clear">清 空</el-button>
    </div>
  </el-dialog>
</template>

<script>
    import {dataListDictionarys} from '@/api/dictionary'
    import dictionaryType from '@/utils/constant'
    export default {
      name: "dictionary",
      props: ['initData','visible'],
      data() {
        return {
          isVisible: false,
          dialogTree: [],
          dialogLoading: false,
          configs: {

          },
          checkedList: [],
          userSelectData: {},


        }
      },
      /*生命周期函数开始*/
      //vue实例化之前
      beforeCreate() {

      },

      //vue实例化后调用
      created() {
        console.log(this.initData)
        if(dictionaryType[this.initData.dictionaryType]){
          this.dialogLoading = true
          this.httpDataListDictionarys(this.initData.dictionaryType)
        }else {
          this.$message({
            message: '参数错误',
            type: 'error',
            duration: 2000
          })
        }

      },

      //挂载之前
      beforeMount() {

      },
      //真实DOM挂载后，仅限组件本身的挂载，如果存在子组件，并且需求子组件全部被挂载后进行操作，需使用vm.$nextTick顶替mounted（在mounted内部调用vm.$nextTick）；
      mounted() {
        this.isVisible = this.visible

      },

      //数据更新前调用
      beforeUpdate() {

      },

      //数据更新后调用（避免使用，最好使用计算属性或watch函数）,仅限组件本身的更新，如果存在子组件，并且需求子组件全部被更新后进行操作，需使用vm.$nextTick顶替updated（在updated内部调用vm.$nextTick）；
      updated() {

      },
      /*生命周期函数结束*/
      watch: {

      },
      computed: {

      },
      methods: {
        dialogClose() {
          this.$emit('close-dialog',this.userSelectData)
        },
        dialogDataBridge(data) {
          this.userSelectData = data
        },
        save() {

          this.isVisible = false
        },
        clear() {
          this.$emit('close-dialog',{})
        },
        httpDataListDictionarys(data) {
          const that = this
          dataListDictionarys(data).then(res => {
            console.log(res)
            that.dialogLoading = false
            that.dialogTree = res.result
            that.$loading().close()
          }).catch(err => {
            that.dialogLoading = false
            console.log(err)
          })
        }
      }


    }
</script>

<style scoped>

</style>
