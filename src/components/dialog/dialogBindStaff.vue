<template>
  <el-dialog v-el-drag-dialog v-loading="dialogTopLoading" title="绑定员工" :visible.sync="isVisible" @close="dialogClose" append-to-body width="850px">
    <div style="height: 500px">
      <el-col :span="6" style="position: relative; height: 100%;overflow: hidden ">
        <div style="position: absolute;top: -10px;bottom: -10px;left: 0;right: 5px;background-color:#EBF0F6;box-shadow:5px 0 10px -5px rgba(0,0,0,0.3);box-sizing: border-box;padding: 20px 0;">
          <div style="box-sizing: border-box;padding: 0 10px;overflow: auto" :style="dialogTree.length?'height: 100%':''">
            <el-input placeholder="" v-model="filterText" clearable>
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
        </div>
      </el-col>
      <el-col :span="18" style="height: 100%">
        <div style="height: 50px;box-sizing: border-box;padding: 7px 20px 7px 7px;">
          <el-form inline :model="formData" class="form-inline">
            <el-col :span="8" style="max-width: 220px">
              <el-form-item label="工号">
                <el-input v-model="formData.userCode" placeholder="工号" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="max-width: 220px">
              <el-form-item label="姓名">
                <el-input v-model="formData.userName" placeholder="姓名" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3" style="max-width: 100px">
              <el-form-item>
                <base-button :name='topBarBtnList[0].name' :icon='topBarBtnList[0].icon' :plain="topBarBtnList[0].plain"
                             :state="topBarBtnList[0].state"
                             @myclick="topBarBtnList[0].method"></base-button>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
        <div style="height: calc(100% - 110px);box-sizing: border-box;padding: 7px;">
          <base-table :data="tableData" :colConfigs="tableConfigs.titleList" :showCheckBox="tableConfigs.showCheckBox"
                      :showIndex="tableConfigs.showIndex" :propName="tableConfigs.propName" :pageData="pageData"
                      :currentpage.sync="currentpage" :isSingle="tableConfigs.isSingle" @databridge="dataBridge"></base-table>
        </div>
        <div slot="footer" class="dialog-footer" style="position: relative; height: 60px;text-align: center;box-sizing: border-box;padding: 10px 0 0 0;">
          <el-button type="primary" :disabled="!checkedList.length" @click="bindStaff">绑定</el-button>
          <el-button @click="isVisible = false" style="margin-left: 30px">关闭</el-button>
        </div>
      </el-col>
    </div>
  </el-dialog>
</template>

<script>
  //树表查询
  import {listTreeDepartment} from '@/api/department'
  import {listPageUsers,updateEmployeeUserBind} from '@/api/user'
  import {treeDeptPosts} from '@/api/post'
  import {addEmployeePluralityPost,addEmployeeMainPost} from '@/api/employee'
  import {filerIds,filerTableTitle} from '@/utils/common'
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    name: "dialog-bind-staff",
    props: ['initData','visible'],
    data() {
      return {
        dialogTopLoading: false,
        isVisible: false,
        dialogTree: [],
        dialogLoading: false,
        configs: {
          showCheckBox: false,
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
        formData: {
          userCode: '',
          userName: '',
        },
        topBarBtnList: [{
          name: '查询',
          icon: 'search',
          state: true,
          method: this.queryStaff
        }],
        tableData: null,
        tableConfigs: {
          titleList: [],
          showCheckBox: false,
          showIcons: false,
          isSingle: false,
        },
        pageData: {

        },
        currentpage: 1,
        timeStamp: '',




      }
    },
    /*生命周期函数开始*/
    //vue实例化之前
    beforeCreate() {

    },

    //vue实例化后调用
    created() {
      const that = this
      console.log(that.initData)
      that.tableConfigs.isSingle = that.initData.isSingle
      if(!that.userInfo){
        that.SET_USERINFO(that.$storage.get('userInfo'))
      }
      if(that.initData.key){
        that.dialogTopLoading = true
        that.timeStamp = that.initData.timeStamp?that.initData.timeStamp:''
        that.$axios.all([listTreeDepartment({deptID: that.userInfo.companyId}), listPageUsers({deptID: that.userInfo.companyId})]).then(that.$axios.spread((res1, res2) => {
          console.log(res1)
          console.log(res2)
          that.dialogTree = [res1.result.treeList]
          that.getTableMenuList(res2)
          that.tableData = res2.result.varList
          that.dialogTopLoading = false
          that.$loading().close()
        })).catch((error) => {
          that.dialogTopLoading = false
          console.log(error)
        })
        //this.httpListTreeDepartment({deptID: this.userInfo.companyId})
      }else {
        that.$message({
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
        console.log(this.dialogChecked)
      },
      filterText: function(val) {
        this.$refs.dialogTree.filter(val);
      },
      currentpage: function () {
        console.log(this.currentpage)
        //pageNo
        this.httpListPageUsers({pageNo:this.currentpage,deptID: this.userInfo.companyId})


      },
      formData: {
        handler(newValue, oldValue) {
          if(newValue.userCode || newValue.userName){
            this.topBarBtnList[0].state = false
          }else {
            this.topBarBtnList[0].state = true
          }
        },
        deep: true
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
        if(this.initData.dataList){
          this.$emit('close-dialog',this.timeStamp)
        }else {
          this.$emit('close-dialog',this.checkedList)
        }
      },

      httpListPageUsers(data) {
        const that = this
        listPageUsers(data).then(res => {
          console.log(res)
          that.getTableMenuList(res)
          that.tableData = []
          that.tableData = res.result.varList
          that.dialogTopLoading = false
          that.$loading().close()
        }).catch(err => {
          that.dialogTopLoading = false
          console.log(err)
        })
      },

      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      treeDataBridge(data){
        const that = this
        console.log(data)
        that.dialogTopLoading = true
        if(data.id){
          that.httpListPageUsers({deptID: data.id})
        }else {
          that.dialogTopLoading = false
          that.$message({
            message: '参数错误，请刷新网页',
            type: 'error',
            duration: 2000
          })
        }
      },
      checkChange(data,checked) {
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
      },

      bindStaff() {
        if(this.checkedList.length){
          if(this.initData.dataList){//按钮弹窗
            const data = {
              userId: this.checkedList[0].id,
              employeeId: this.checkedList[0].id
            }
            this.httpUpdateEmployeeUserBind(data)
          }else {//输入框弹窗
            this.isVisible = false
          }
        }
      },

      httpUpdateEmployeeUserBind(data){
        const that = this
        updateEmployeeUserBind(data).then(res => {
          console.log(res)
          that.$loading().close()
          this.timeStamp = new Date().getTime()
          this.isVisible = false
        }).catch(err => {
          console.log(err)
        })
      },

      queryStaff() {
        const that = this
        const data = {
          userCode: that.formData.userCode,
          userName: that.formData.userName,
          deptId: that.userInfo.deptId
        }
        that.dialogTopLoading = true
        that.httpListPageUsers(data)
      },
      dataBridge(data) {
        this.checkedList = data
        console.log(this.checkedList)
      },
      getTableMenuList(res) {
        const that = this
        if (res) {
          res.result.titles = res.result.titles
          res.result.varList = res.result.varList
          res.result.pageData = res.result.pageData
          const data = filerTableTitle(res.result)
          console.log(data)
          that.tableConfigs.titleList = data
          that.pageData = res.result.pageData
          that.tableConfigs.showCheckBox = true
          that.tableConfigs.showIndex = true
        }
      },
    }


  }
</script>

<style scoped>
  .checkBox {
    margin: 5px 0;
  }
  .el-tree {
    background-color: inherit;
  }
</style>
