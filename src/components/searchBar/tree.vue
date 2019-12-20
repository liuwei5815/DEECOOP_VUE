<template>
  <el-dialog v-el-drag-dialog :title="initData.title?initData.title:'树弹窗'" :visible.sync="isVisible" @close="dialogClose" append-to-body width="300px">
    <div style="box-sizing: border-box;padding: 10px;overflow: auto" :style="dialogTree.length?'height: 400px':''">
      <base-tree v-loading="dialogLoading" ref="dialogTree"
                 :data="dialogTree"
                 :treeConfigs="configs"
                 :checkedList="checkedList"
                 @treedatabridge="dialogDataBridge"
                 @disable-state="disableState"></base-tree>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save">确 定</el-button>
      <el-button plain type="primary" @click="clear">清 空</el-button>
    </div>
  </el-dialog>
</template>

<script>

  export default {
    name: "searchBar-tree",
    props: ['initData','visible'],
    data() {
      return {
        isVisible: false,
        dialogTree: [],
        dialogLoading: false,
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
      this.isVisible = this.visible
      if(this.initData.apiName){
        this.dialogLoading = true
        if(Array.isArray(this.initData.apiName)){//多tree模式使用
          // this.$api[this.initData.apiName[0]](this.initData.params[0]).then(res => {
          //   this.dialogLoading = false
          //   this.dialogTree = res.result.options
          //   this.$loading().close()
          // }).catch(err => {
          //   this.dialogLoading = false
          //   this.$loading().close()
          // })
        }else if(typeof this.initData.apiName === 'string') {
          this.$api[this.initData.apiName](this.initData.params).then(res => {
            this.dialogLoading = false
            this.dialogTree = this.screenData(res)
          }).catch(err => {
            this.dialogLoading = false
          })
        }else {
          this.$message({
            message: 'apiName参数错误',
            type: 'error',
            duration: 2000
          })
        }
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


    },
    /*生命周期函数结束*/
    watch: {

    },
    computed: {
      configs() {
        return {
          showDisable: this.initData.showDisable?true:false,
          keyboard: this.initData.keyboard?true:false,
          showSearch: this.initData.showSearch?true:false
        }
      },
    },
    methods: {
      screenData(data){
        if(data.result){
          if(Array.isArray(data.result)){
            return data.result
          }else {
            for(const key in data.result){
              if(Array.isArray(data.result[key])){
                return data.result[key]
              }else if(Array.isArray(data.result[key].children)) {
                return data.result[key].children
              }
            }
            return []
          }
        }else {
          return []
        }
      },

      dialogClose(state) {
        this.$emit('close-dialog',this.userSelectData,this.initData)
      },
      dialogDataBridge(data,state) {
        this.userSelectData = data
        if(state){
          this.isVisible = false
        }
      },
      save() {
        this.isVisible = false
      },
      clear() {
        this.$emit('close-dialog', null,this.initData)
      },
      disableState(state){
        console.log(state)
        const tempObj = {}
        tempObj[this.initData.keyName?this.initData.keyName:'isShow'] = state
        this.$api[this.initData.apiName](Object.assign({},this.initData.params,tempObj)).then(res => {
          this.dialogLoading = false
          this.dialogTree = this.screenData(res)
        }).catch(err => {
          this.dialogLoading = false
        })

      },
    }
  }
</script>

<style scoped>

</style>
