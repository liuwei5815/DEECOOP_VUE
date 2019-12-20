<template>
  <el-dialog v-el-drag-dialog title="设置岗位" :visible.sync="isVisible" @close="dialogClose" append-to-body width="300px">
    <div style="box-sizing: border-box;padding: 10px;overflow: auto" :style="dialogTree.length?'height: 400px':''">
        <el-input placeholder="关键字" v-model="filterText" clearable>
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <div class="checkBox">
          <el-checkbox v-model="dialogChecked">显示封存部门</el-checkbox>
        </div>
        <div class="treeView" style="height: calc(100% - 65px);overflow: auto;">
          <el-tree
            v-loading="dialogLoading"
            ref="dialogTree"
            highlight-current
            default-expand-all
            check-on-click-node
            node-key="id"
            :default-checked-keys="treeCheckList"
            :show-checkbox="configs.showCheckBox"
            :expand-on-click-node="clickArrow"
            :data="dialogTree"
            :props="defaultProps"
            :filter-node-method="filterNode"
            @node-click="treeDataBridge"
            @check="checkChange">
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <svg-icon v-if="configs.showIcons" :icon-class="data.url" style="margin-right: 5px"></svg-icon>
                    <span v-if="node.label">{{ node.label }}</span>
                    <span v-else>{{ data.name }}</span>
                  </span>
          </el-tree>
        </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save">确 定</el-button>
      <el-button plain type="primary" @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import {treeDeptPostsNotMainPost} from '@/api/post'
  import {addEmployeePluralityPost,addEmployeeMainPost} from '@/api/employee'
  import {filerIds} from '@/utils/common'

  export default {
    name: "dialog-post",
    props: ['initData','visible'],
    data() {
      return {
        isVisible: false,
        dialogTree: [],
        dialogLoading: false,
        configs: {
          showCheckBox: true,
          showIcons: false,
        },
        checkedList: [],

        clickArrow: true,
        defaultProps: {
          children: 'children',
          label: 'url'
        },
        dialogChecked: false,
        filterText: '',
        treeCheckList: [],
        timeStamp: '',


      }
    },
    /*生命周期函数开始*/
    //vue实例化之前
    beforeCreate() {

    },

    //vue实例化后调用
    created() {
      //console.log(this.initData)
      this.initData
      let employeeList = this.initData.employeeList;

      //var jsonStr = JSON.stringify(employeeList);
      //console.log("in created() jsonStr: " + jsonStr);
      //console.log("employeeList.length: " + employeeList.length);
      if (employeeList.length > 1) {
        this.$message({
          message: '请选择一行数据',
          type: 'error',
          duration: 5 * 1000
        })
        return
      }

      let employeeId = "";
      if (employeeList[0].employeeId != null && employeeList[0].employeeId.trim().length > 0) {
        employeeId = employeeList[0].employeeId.trim();
      }
      //console.log("employeeId: " + employeeId);

      if(!this.userInfo){
        this.SET_USERINFO(this.$storage.get('userInfo'))
      }
      if(this.initData.key){
        this.dialogLoading = true
        this.timeStamp = this.initData.timeStamp
        this.httpTreeDeptPosts({employeeId: employeeId, deptID: this.userInfo[this.initData.key]})
      }else {
        this.$message({
          message: '请设置key',
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
      dialogChecked: function () {
        //console.log(this.dialogChecked)
      },
      filterText: function(val) {
        this.$refs.dialogTree.filter(val);
      },
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    methods: {
      ...mapMutations(['SET_USERINFO']),
      dialogClose() {
        if(this.initData.employeeList){
          this.$emit('close-dialog',this.timeStamp)
        }else {
          this.$emit('close-dialog',this.$refs.dialogTree.getCheckedNodes(true,true))
        }

      },
      save() {
        if(this.initData.employeeList){
          //console.log(this.$refs.dialogTree.getCheckedNodes(true,true))
          //console.log(this.initData.employeeList)
          const postId = filerIds(this.$refs.dialogTree.getCheckedNodes(true,true),'id')
          const employeeId = filerIds(this.initData.employeeList,'employeeId')

          if(this.initData.isSingle){//设置主岗
            //主岗接口
            addEmployeeMainPost({
              employeeId: employeeId,
              postId: postId
            }).then(res => {
              //console.log(res)
              this.$loading().close()
              this.timeStamp = new Date().getTime()
              this.isVisible = false
            }).catch(err => {
              //console.log(err)
            })
          }else {//设置兼岗
            //兼岗接口
            addEmployeePluralityPost({
              employeeId: employeeId,
              postIds: postId
            }).then(res => {
              //console.log(res)
              this.$loading().close()
              this.timeStamp = new Date().getTime()
              this.isVisible = false
            }).catch(err => {
              //console.log(err)
            })
          }
        }else {
          this.isVisible = false
        }

      },


      cancel() {
        // this.$emit('close-dialog',{})

        this.isVisible = false

      },
      httpTreeDeptPosts(data) {
        const that = this
        treeDeptPostsNotMainPost(data).then(res => {
          //console.log(res)
          that.filterRes([res.result.treeList])
          that.dialogTree = [res.result.treeList]
          that.treeCheckList = filerIds(that.initData.employeeList,'postId').split(',')
          if(that.initData.isSingle && that.initData.employeeList && that.initData.employeeList.length){
            const id = that.initData.employeeList[0].postId
            //that.setDisabledAll(id,that.dialogTree)
          }
          that.dialogLoading = false

        }).catch(err => {
          that.dialogLoading = false
          //console.log(err)
        })
      },
      filterRes(list){
        const that = this
        if(Array.isArray(list)){
          list.forEach(item => {
            if(item.type !== 'post'){
              item.disabled = true
            }else {
              item.disabled = false
            }
            if(item.children.length){
              that.filterRes(item.children)
            }
          })
        }
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      treeDataBridge(data){

        const that = this


      },
      checkChange(data,checked) {
        //console.log(data)
        //console.log(checked)
        if(this.initData.isSingle){
          const id = data.id
          const state = checked.checkedKeys.some(item => {
            return item === id
          })
          if(state){
            this.setDisabledAll(id,this.dialogTree)
          }else {
            this.filterRes(this.dialogTree)
          }
        }

      },
      setDisabledAll(id,list){
        const that = this
        if(Array.isArray(list)){
          list.forEach(item => {
            if(item.id !== id){
              item.disabled = true
            }
            if(item.children.length){
              that.setDisabledAll(id,item.children)
            }
          })
        }
      }
    }


  }
</script>

<style scoped>
  .checkBox {
    margin: 5px 0;
  }
</style>
