<template>
  <el-dialog v-el-drag-dialog  :title="title" :visible.sync="isVisible" @close="dialogClose" append-to-body width="300px">
    <div style="height: 500px" v-loading="dialogTopLoading">
      <!--border: 1px solid red;-->
      <div style="position: relative; height: 90%;overflow: hidden ">
        <div style="position: absolute;top: -10px;bottom: -10px;left: 0;right: 5px;box-shadow:5px 0 10px -5px rgba(0,0,0,0.3);box-sizing: border-box;padding: 20px 0;">
          <div style="box-sizing: border-box;padding: 0 10px;overflow: auto" :style="treeData.length?'height: 100%':''">
            <div style="width: 90%;margin: 5px auto">
              <el-input v-on:keyup.enter.native="searchByName" :placeholder="'名称'" v-model="filterText" clearable>
                <i slot="suffix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </div>
            <div style="padding:5px 0px 10px 20px">
              <el-checkbox v-model="showDisable">显示封存</el-checkbox>
            </div>
            <div style="padding-left: 20px">
              <base-tree ref="tree" :data="treeData" :treeConfigs="treeConfigs"
                         @treedatabridge="treeDataBridge"></base-tree>
            </div>
          </div>
        </div>
      </div>
        <div class=""
             style=" text-align: center; position: relative;top: 5px; padding-bottom: 10px;">
          <el-button type="primary" :disabled="!selectTree.id" @click="isVisible = false">确认</el-button>
          <el-button @click="isVisible = false" style="margin-left: 30px">关闭</el-button>
        </div>


    </div>
  </el-dialog>
</template>

<script>
  // import baseTable from '@/components/baseTable'
  import i18n from '@/lang'

  // ajax后台方法
  import request from '@/utils/request'


  //	公共方法
  import {filerTableTitle} from '@/utils/common'


  export default {

    name: "dialog-tree",
    props: ['initData','visible'],

    //数据
    data() {
      return {

        dialogTopLoading: false,
        isVisible: false,

        title: '选择框',

        //树表数据集
        treeData: [],

        //树表默认参数
        treeConfigs: {
          ref: 'tree',
          showCheckBox: true,
          showIcons: false,
          expandAll: false,
          defaultProps: null,
          showIcons: false,
        },

        //默认选中的树节点
        selectTree: {
          pid: '',
          id: '',
          layer: '',
          name: ''
        },

        //树搜索框文本查询
        filterText: '',
        //搜索框回车查询次数
        enterTime: 0,
        //是否显示封存部门，默认不显示
        showDisable: false,
        //通过搜索框查询到的树节点集合
        treeNodes: [],



        /*初始化数据*/
        userInfo: null,



      }
    },

    //子组件
    components: {
      // baseTable
    },

    /*生命周期函数开始*/
    //vue实例化之前
    beforeCreate() {

    },

    //vue实例化后调用
    created() {
      const that = this
      that.title = that.initData.title
      that.userInfo = that.$storage.get('userInfo')
      //加载左树右表
      that.initTree()
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


    //方法
    methods: {

      dialogClose() {
        this.$emit('close-dialog',this.selectTree,this.initData.temp)
      },

      initTree() {
        const that = this
        that.dialogTopLoading = true
        //页面初始化列表及分页参数
        request({
          url: that.initData.treeUrl,
          method: 'post',
          data: {
            ...that.initData.treeParm,
          }
        }).then(res => {
          that.dialogTopLoading = false
          that.loadTree(res)
        }).catch(err => {
          console.log(err)
          that.dialogTopLoading = false
        })

      },

      loadTree(res){
        const that = this
        const newTree = []
        const root = res.result.treeList
        newTree.push(root)
        that.treeData = newTree

        that.treeNodes = []
        //初次不显示已封存节点
        that.circleTree(that.treeData,that.showDisable,that.filterText,that.treeNodes)
        that.selectTree = {
          pid: root.pid,
          id: root.id,
          layer: root.layer,
          name: root.name
        }
        that.$nextTick(function () {
          if(that.treeNodes.length>0){
            let selectTreeNode = that.treeNodes[0]
            that.selectTree = {
              pid: selectTreeNode.pid,
              id: selectTreeNode.id,
              layer: selectTreeNode.layer,
              name: selectTreeNode.name
            }
          }
          that.$refs.tree.$children[0].setCurrentKey(that.selectTree.id)
        })
      },


      treeDataBridge(data) {
        console.log(data)
        const that = this
        that.selectTree = {
          pid: data.nodeData.pid,
          id: data.nodeData.id,
          layer: data.nodeData.layer,
          name: data.nodeData.name
        }
        that.$refs.tree.$children[0].setCurrentKey(that.selectTree.id)

      },



      //树表搜索框文本查询
      searchByName(){
        const that = this
        that.treeNodes = []
        //初次不显示已封存节点
        that.circleTree(that.treeData,that.showDisable,that.filterText,that.treeNodes)
        that.enterTime = that.enterTime + 1
        that.$nextTick(function () {
          if(that.treeNodes.length>0){
            // console.log('active item:', that.enterTime,"++++",that.treeNodes.length)
            let selectTreeNode = that.treeNodes[that.enterTime%that.treeNodes.length]
            that.selectTree = {
              pid: selectTreeNode.pid,
              id: selectTreeNode.id,
              layer: selectTreeNode.layer,
              name: selectTreeNode.name
            }
          }
          that.$refs.tree.$children[0].setCurrentKey(that.selectTree.id)
        })
      },

      //树结构递归算法，过滤掉已封存部门及查询当前搜索框内输入的部门名称，并且将搜索到的树节点高亮显示
      circleTree(treeData,showDisable,filterText,treeNodes) {

        if(treeData.length>0){
          treeData.forEach(treeNode => {
            if(showDisable){
              if(filterText){
                if(treeNode.name.indexOf(filterText)>-1){
                  treeNodes.push(treeNode)
                }
              }

            }else{
              if(treeNode.isdisable=='1'){
                if(filterText){
                  if(treeNode.name.indexOf(filterText)>-1){
                    treeNodes.push(treeNode)
                  }
                }
              }else{
                let index = treeData.indexOf(treeNode);
                if (index > -1) {
                  treeData.splice(index, 1);
                }
              }
            }

            if(treeNode.children.length>0){
              this.circleTree(treeNode.children,showDisable,filterText,treeNodes)
            }

          })
        }


      },


    },

    //计算属性
    computed: {

    },

    //观察者,可监听数据，属性和方法
    watch: {

      //监听是否显示封存部门
      showDisable: function () {
        // console.log(this.showDisable)
        const that = this
        that.initTree()
      },
    }
  }


</script>

<style>

</style>
