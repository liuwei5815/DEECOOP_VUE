<template>
  <el-dialog v-el-drag-dialog :title="initData.title?initData.title:''" :visible.sync="isVisible" :append-to-body="inDialog"
             :close-on-click-modal="onModal" :close-on-press-escape="onEscape" :fullscreen="fullscreen" @open="dialogOpen" @close="dialogClose" width="850px">

    <component v-if="showDialog" :is="dialogName" :initData="dialogData" :visible="inLinVisible" @close-dialog="closeDialog"/>

      <div v-loading="dialogLoading" style="height: 500px" class="dialogRoleUserStyle">
        <!--部门选择树-->
        <el-col :span="6" style="position: relative; height: 100%;overflow: hidden ">
          <div style="position: absolute;top: -10px;bottom: -10px;left: 0;right: 5px;background-color:#EBF0F6;box-shadow:5px 0 10px -5px rgba(0,0,0,0.3);box-sizing: border-box;padding: 10px 0;">
            <div class="leftTree" style="height: 100%;padding-top: 10px;">
              <el-input placeholder="" v-model="assignFilterText" clearable>
                <i slot="suffix" class="el-input__icon el-icon-search"></i>
              </el-input>
              <div class="treeView" style="height: calc(100% - 85px);overflow: auto;">
                <el-tree
                  ref="assignTree"
                  highlight-current
                  default-expand-all
                  node-key="id"
                  :expand-on-click-node="clickArrow"
                  :data="assignTree"
                  :props="defaultProps"
                  :filter-node-method="assignFilterNode"
                  @node-click="assignTreeDataBridge">
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <svg-icon v-if="treeConfigs.showIcons" :icon-class="data.url" style="margin-right: 5px"></svg-icon>
                    <span v-if="node.label">{{ node.label }}</span>
                    <span v-else>{{ data.name }}</span>
                  </span>
                </el-tree>
              </div>
            </div>
          </div>
        </el-col>

        <!--分配用户-穿梭框-->
        <el-col :span="18" style="height: 100%">
          <div style="height: calc(100% - 60px);box-sizing: border-box;padding: 7px 0;">
            <div style="text-align: center">
              <el-transfer
                style="text-align: left; display: inline-block"
                v-model="transferSelectedData"
                filterable
                :props="transferProps"
                :left-default-checked="[]"
                :right-default-checked="[]"
                :render-content="renderFunc"
                :titles="['未分配用户', '已分配用户']"
                :format="{noChecked: '${total}',hasChecked: '${checked}/${total}'}"
                @change="handleChange"
                :data="transferData">
              </el-transfer>
            </div>
          </div>

          <div style="position: relative; height: 60px;text-align: center;box-sizing: border-box;padding: 10px 0 0 0;">
            <el-button type="primary" @click="saveUsersByRole">保存</el-button>
            <el-button @click="isVisible = false">关闭</el-button>
          </div>
        </el-col>

      </div>
  </el-dialog>
</template>

<script>
  import Vue from 'vue'
  import {treeDepartments} from '@/api/department'

  import {
    listUsersByRole,
    listAllUsersByDeptId,
    saveRoleUsers
  } from '@/api/role'

  import {filerIds,resetState} from '@/utils/common'

  export default {
    components: {
    },
    name: "dialog-add",
    props: ['initData','visible'],

    data(){
      return {
        roleId: "",
        //表单必填项
        rules: {},

        temp: {},
        tempLable: {},
        tempNotEditable: {},

        //弹窗功能
        dialogLoading: false,
        isVisible: false,
        inDialog: true,

        openDialogName: '',
        showDialog: false,
        inLinVisible: false,
        dialogData: {
          fullscreen: false,
          title: '',
          data: null,
        },

        ////////////////////////////////////////////////
        assignTree: [],
        assignTreeConfigs:{
          showSearch: true,
        },
        assignCheckedList: [],
        //assignData: null,
        assignFilterText: '',
        dialogAssignChecked: false,
        clickArrow: false,
        defaultProps: {
          children: 'children',
          label: 'url'
        },
        treeConfigs: {
          ref: 'tree',
          showCheckBox: false,
          showIcons: false,
        },

        //分配用户弹窗
        transferData: [],
        transferSelectedData: [],
        renderFunc(h, option) {
          return <span style = "display: inline-block;width: 100%;" > < span style = "display: inline-block;width: 20%;text-align: center;" > {option.index}</span><span style="display: inline-block;width: 39%;text-align: center;">{ option.userCode }</span > < span style = "display: inline-block;width: 39%;text-align: center;" > {option.userName}</span></span >;
        },
        transferProps: {
          key: 'id',
          label: 'userName',
          code: 'userCode',
          disabled: 'isdisable',
          index: 'index'
        },

        resState: null
      }
    },
    created() {
      if(this.initData.temp){
        this.temp = this.initData.temp
      }
      // if(this.initData.tempLable){
      //   this.tempLable = this.initData.tempLable
      // }

      //角色id 调用本对话框时传给对话框 dialogData.temp.roleId
      this.roleId = this.temp.roleId;
      //console.log("this.roleId: " + this.roleId);

      //本代码为测试代码 真实环境无此代码
      //this.roleId = "62c380a8ff784be08b383a3751cc934a";

      //部门树加载
      this.treeDepartments();
      let companyId = this.$storage.get('userInfo').companyId;
      this.assignTreeDataBridge({id: companyId});

    },
    mounted() {
      this.isVisible = this.visible
    },

    computed: {
      dialogWidth(){
        if(this.initData.width){
          const widthType = typeof this.initData.width
          if(widthType === 'number'){
            return this.initData.width+'px'
          }else if(widthType === 'string'){
            const num = parseInt(this.initData.width)
            if(num){
              return num>100?'100%':(num+'%')
            }else {
              return '300px'
            }
          }else {
            return '300px'
          }
        }else {
          return '300px'
        }
      },
      fullscreen(){
        return this.initData.fullscreen?true:false
      },
      onModal() {
        return this.initData['close-on-click-modal']?true:false
      },
      onEscape() {
        return this.initData['close-on-press-escape']?true:false
      },
      dialogName() {
        return this.openDialogName
      }
    },
    methods: {
      dialogOpen(){
        this.$nextTick(() => {
          if (!document.getElementsByClassName('customTitle').length) {
            const elList = document.getElementsByClassName('el-transfer-panel__filter')
            for (let i = 0; i < elList.length; i++) {
              const Title = Vue.extend({
                template: `<div class="customTitle" style="box-sizing: border-box;padding: 5px 0 5px 41px;height: 25px;box-shadow:0 3px 5px -3px rgba(0,0,0,0.3);">
                          <span style="display: inline-block;width: 100%;">
                          <span style="display: inline-block;width: 20%;text-align: center;">序号</span>
                          <span style="display: inline-block;width: 37%;text-align: center;">账号</span>
                          <span style="display: inline-block;width: 38%;text-align: center;">姓名</span>
                          </span>
                        </div>`
              })
              const component = new Title().$mount()
              var div = elList[i]
              var divParent = div.parentNode
              var next = div.nextSibling
              if (next) {
                divParent.insertBefore(component.$el, next)
              } else {
                divParent.appendChild(component.$el)
              }
            }
          }
        })
      },
      dialogClose(data){
        this.$emit('close-dialog',data?data:{})
      },

      assignFilterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },

      treeDepartments() {
        this.dialogLoading = true
        treeDepartments({isdisable: "1"}).then(res => {
          this.assignTree = [res.result.treeList]
          this.$nextTick(_=>{
            this.$refs.assignTree.setCurrentKey(this.assignTree[0].id)
          })
        }).catch(err => {
          this.dialogLoading = false
        })
      },

      assignFilterKey(list){
        const tempArr = []
        list.forEach(item => {
          tempArr.push(item.id)
        })
        return tempArr
      },

      assignTreeDataBridge(data){
        //const that = this
        this.transferData = []
        this.transferSelectedData = []

        const reqData1 = {
          deptId: data.id,
          roleId: this.roleId
        }
        const reqData2 = {
          roleId: this.roleId
        }
        this.$axios.all([listUsersByRole(reqData2), listAllUsersByDeptId(reqData1)]).then(this.$axios.spread((res1, res2) => {
          const tempList = resetState(res1.result.varList.concat(res2.result.varList))
          tempList.forEach((item, index) => {
            item.index = index + 1
          })
          this.transferData = tempList
          this.transferSelectedData = this.assignFilterKey(res1.result.varList)
          this.$loading().close()
          this.dialogLoading = false
        })).catch((error) => {
          this.$loading().close()
          this.dialogLoading = false
        })

      },

      handleChange(value, direction, movedKeys) {
      },

      saveUsersByRole() {
        saveRoleUsers({
          roleId: this.roleId,
          userIds: filerIds(this.transferSelectedData)
        }).then(res => {
          if (res.code === 0) {
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 1000
            })
            this.isVisible = false
            this.dialogClose({resState:'ok'})
          }
          this.$loading().close()
        }).catch(err => {
          this.$loading().close()
        })
      },

      //弹窗功能
      closeDialog(data) {
        this.showDialog = false

      },
    }

  }
</script>

<style lang="scss" rel="text/css">
  .dialogRoleUserStyle {
    .el-checkbox.is-bordered.el-checkbox--medium {
      margin-left: 20px;
      margin-bottom: 10px;
    }

    .el-checkbox.is-bordered + .el-checkbox.is-bordered {
      margin-left: 20px;
      margin-bottom: 10px;
    }

    .el-checkbox.is-bordered.el-checkbox--medium {
      padding: 9px 20px 9px 10px;
    }

    .el-transfer-panel {
      width: 250px;
    }

    .el-transfer-panel__body {
      height: 370px;
    }

    .el-transfer-panel__list.is-filterable {
      height: 308px;
    }

    .el-transfer__buttons .el-button {
      padding: 10px;
    }

    .el-transfer-panel__filter {
      margin: 5px 15px;
    }
    .leftTree .el-input, .leftTree .checkBox {
      margin-left: 10%;
      margin-bottom: 10px;
      width: 80%;
    }
    .treeView {
      height: calc(100% - 85px);
      overflow: auto;
      .el-tree {
        background-color: inherit;
      }
    }
  }
</style>

