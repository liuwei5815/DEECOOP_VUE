<template>
  <el-dialog v-el-drag-dialog  :title="title" :visible.sync="isVisible" @close="dialogClose" :before-close="handleClose" append-to-body width="1000px" :layoutType="1">
    <el-row v-loading="dialogTopLoading">

      <el-col :span="4" style="background-color: #F9FAFC;overflow-y: auto;padding: 8px;">
        <base-tree ref="tree" :data="treeData" :treeConfigs="treeConfigs"
                   @treedatabridge="treeDataBridge"></base-tree>
        <!--<div style="position: absolute;top: -10px;bottom: -10px;left: 0;right: 5px;background-color:#EBF0F6;box-shadow:5px 0 10px -5px rgba(0,0,0,0.3);box-sizing: border-box;padding: 20px 0;">-->
          <!--<div style="box-sizing: border-box;padding: 0 10px;overflow: auto" :style="treeData.length?'height: 100%':''">-->
            <!--&lt;!&ndash;<div style="width: 90%;margin: 5px auto">&ndash;&gt;-->
              <!--&lt;!&ndash;<el-input v-on:keyup.enter.native="searchByName" :placeholder="'名称'" v-model="filterText" clearable>&ndash;&gt;-->
                <!--&lt;!&ndash;<i slot="suffix" class="el-input__icon el-icon-search"></i>&ndash;&gt;-->
              <!--&lt;!&ndash;</el-input>&ndash;&gt;-->
            <!--&lt;!&ndash;</div>&ndash;&gt;-->
            <!--&lt;!&ndash;<div style="padding:5px 0px 10px 20px">&ndash;&gt;-->
              <!--&lt;!&ndash;<el-checkbox v-model="showDisable">显示封存</el-checkbox>&ndash;&gt;-->
            <!--&lt;!&ndash;</div>&ndash;&gt;-->
            <!--&lt;!&ndash;<div style="padding-left: 20px">&ndash;&gt;-->
              <!--&lt;!&ndash;<base-tree ref="tree" :data="treeData" :treeConfigs="treeConfigs"&ndash;&gt;-->
                         <!--&lt;!&ndash;@treedatabridge="treeDataBridge"></base-tree>&ndash;&gt;-->
            <!--&lt;!&ndash;</div>&ndash;&gt;-->
            <!--<div style="padding-left: 20px;height: 100%">-->
              <!--<base-tree ref="tree" :data="treeData" :treeConfigs="treeConfigs"-->
                         <!--@treedatabridge="treeDataBridge"></base-tree>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
      </el-col>
      <el-col :span="20" style="height: 100%">
        <div style="height: 50px;box-sizing: border-box;padding: 7px 20px 7px 7px;">

          <el-form :inline="true" :model="tempQuery" class="form-inline" style='width: 900px;margin: 10px auto;' label-width="70px">
            <el-col :span="5" style="max-width: 260px">
              <el-form-item :label="tempLable.code">
                <el-input v-model="tempQuery.code" :placeholder="tempLable.code"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5" style="max-width: 260px">
              <el-form-item :label="tempLable.name">
                <el-input v-model="tempQuery.name" :placeholder="tempLable.name"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="3" style="max-width: 90px">
              <el-form-item>
                <base-button :name='topBarBtnList[0].name' :icon='topBarBtnList[0].icon' :plain="topBarBtnList[0].plain"
                           :state="topBarBtnList[0].state"
                           @myclick="topBarBtnList[0].method"></base-button>
              </el-form-item>
            </el-col>
            <el-col :span="3" style="max-width: 95px">
              <el-form-item>
                <base-button :name='topBarBtnList[1].name' :icon='topBarBtnList[1].icon' :plain="topBarBtnList[1].plain"
                           :state="topBarBtnList[1].state"
                           @myclick="topBarBtnList[1].method"></base-button>
              </el-form-item>
            </el-col>
          </el-form>

        </div>


        <div style="padding: 7px;">
          <base-table :data="tableData" :colConfigs="configs.tableConfigs" :showCheckBox="configs.showCheckBox"
                      :showIndex="configs.showIndex" @databridge="dataBridge"  :isSingle="configs.isSingle" :pageData="pageData" :currentpage.sync="pageNo"></base-table>
        </div>


        <div class=""
             style="position: relative; height: 60px;text-align: center;box-sizing: border-box;padding: 10px 0 0 0;">
          <el-button type="primary" :disabled="!selectList.length" @click="isVisible = false">确认</el-button>
          <el-button @click="isVisible = false,isCancel = true" style="margin-left: 30px">关闭</el-button>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
  // import baseTable from '@/components/baseTable'
  import i18n from '@/lang'

  // ajax后台方法
  import request from '@/utils/request'


  //	公共方法
  import {filerTableTitle,circleTree} from '@/utils/common'


  //	  table状态栏里面的按钮
  const stateBtns = {
    props: ['colConfig'],
    template: `<el-table-column :label="colConfig.label" :sortable="colConfig.sortable" align="center">
						<div slot-scope="scope">
    						<el-switch active-value="1" inactive-value="0" v-model="scope.row.isdisable" @change="colConfig.changeState(scope.row,scope.$index)"></el-switch>
    					</div>
    			   </el-table-column>`
  }



  export default {

    name: "dialog-tree-option",
    props: ['initData','visible'],

    //数据
    data() {
      return {

        dialogTopLoading: false,
        isVisible: false,

        title: '',

        //树表数据集
        treeData: [],

        //树表默认参数
        treeConfigs: {
          ref: 'tree',
          showCheckBox: false,
          showIcons: false,
          showSearch: true,
          showDisable: false
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


        //查询及重置按钮
        topBarBtnList: [{
          name: '查询',
          icon: 'search',
          method: this.queryTable
        }, {
          name: '重置',
          icon: 'refresh',
          plain: true,
          method: this.resetQueryTemp
        }],



        configs: {
          tableConfigs: [],
          showCheckBox: false,//是否显示行级单选框
          showIndex: false,    //是否显示行号
          isSingle: false,
        },

        //table数据集
        tableData: [],

        //行数据选择列表
        selectList: [],



        // form查询字段值map集合
        tempQuery: {

        },

        // form表单标签名称map集合
        tempLable: {

        },

        //分页参数集合及当前默认页面
        pageData: null,
        pageNo: 1,
        isCancel: false,

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
      that.configs.isSingle = that.initData.isSingle
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


    // let promise = new Promise((resolve, reject) => {
    //   resolve(res);
    //   reject(err); // rejected
    // })
    //
    // promise.then(
    //   function(res){
    //     console.log("res: " + res);
    //   }, function(err){
    //     console.log("err: " + err);
    //   }
    // )

    //方法
    methods: {

      dialogClose() {
        this.$emit('close-dialog',this.selectList,this.initData.temp,this.isCancel)
      },

      handleClose(done){
        this.isCancel = true
        done()
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
        that.selectTree = {
          pid: root.pid,
          id: root.id,
          layer: root.layer,
          name: root.name
        }
        newTree.push(root)
        that.treeData = newTree

        that.treeNodes = []
        //初次不显示已封存节点
        circleTree(that.treeData,that.showDisable,that.filterText,that.treeNodes)

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
          // that.$refs.tree.$children[0].setCurrentKey(that.selectTree.id)
          that.initTable(that.selectTree.id,that.selectTree.layer,true)
        })
      },


      treeDataBridge(data) {
        // console.log(data)
        const that = this
        that.selectTree = {
          pid: data.nodeData.pid,
          id: data.nodeData.id,
          layer: data.nodeData.layer,
          name: data.nodeData.name
        }
        that.pageNo=1
        that.initTable(that.selectTree.id,that.selectTree.layer)
      },



      //通过搜索栏查询，加载table列表
      queryTable(){
        const that = this
        that.pageNo=1
        that.initTable(that.selectTree.id,that.selectTree.layer)
      },



      //加载table列表
      initTable(pid,layer, isClosedLoading){
        const that = this

        request({
          url: that.initData.tableUrl,
          method: 'post',
          data: {
            ...that.initData.tableParm,
            ...that.tempQuery,
            pid: pid,
            layer: layer,
            pageNo: that.pageNo
          }
        }).then(res => {
          if(isClosedLoading){
            that.dialogTopLoading = false
          }
          that.getListPage(res)
        }).catch(err => {
          console.log(err)
          that.dialogTopLoading = false
        })
      },

      //加载table列头及列表数据
      getListPage(res) {
        const that = this
        if (res) {
          //分页参数
          that.pageData = res.result.pageData

          //列表标签可编辑属性、国际化初始化
          that.initTempData(res.result.titles)
          const data = filerTableTitle(res.result)
          const titleList = that.addTableTitle(data)
          that.configs.tableConfigs = titleList
          that.configs.showCheckBox = true
          that.configs.showIndex = true
          that.tableData = res.result.varList
        }
      },

      initTempData(titles){
        const that = this
        titles.forEach(item => {
          for(let k in item) {
            let label = item[k]
            if(label.indexOf("_")>0){
              if(i18n.locale == "en"){
                label = label.substring(label.indexOf("_")+1)
              }else if(i18n.locale == "zh"){
                label = label.substring(0,label.indexOf("_"))
              }
            }
            //from表单常规字段国际化处理   注意尽量使表单字段key要与列表查询的key保持一致
            that.tempLable[k]=label;
          }
        })
      },

      //自定义状态列
      addTableTitle(list) {
        const that = this
        // console.log("*****11*"+JSON.stringify(i18n.messages.zh.selfDefine))
        list.forEach(item => {
          // console.log("******"+JSON.stringify(item))
          //title国际化处理
          let labelName = item.label
          if(labelName.indexOf("_")>0){
            if(i18n.locale == "en"){
              item.label = labelName.substring(labelName.indexOf("_")+1)
            }else if(i18n.locale == "zh"){
              item.label = labelName.substring(0,labelName.indexOf("_"))
            }
          }
          //列表特殊字段处理
          if (item.label ===  '是否启用'||item.label ===  '是否在职') {
            item.component = stateBtns
            item.changeState = that.changeState
          }
        })
        return list
      },

      //通过单选框触发事件 获取table组件传回的数据
      dataBridge(data) {
        // console.log("*********"+data)
        const that = this
        that.selectList = data
      },

      //查询条件重置
      resetQueryTemp() {
        const that = this
        for(let key in that.tempQuery) {
          // console.log(key)
          that.tempQuery[key]= ''
        }
        that.pageNo=1
        that.initTable(that.selectTree.id,that.selectTree.layer)
      },

      //树表搜索框文本查询
      searchByName(){
        const that = this
        that.treeNodes = []
        //初次不显示已封存节点
        circleTree(that.treeData,that.showDisable,that.filterText,that.treeNodes)
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
          // that.$refs.tree.$children[0].setCurrentKey(that.selectTree.id)
          that.initTable(that.selectTree.id,that.selectTree.layer)
        })
      },




    },

    //计算属性
    computed: {

    },

    //观察者,可监听数据，属性和方法
    watch: {
      pageNo: function () {
        const that = this
        that.initTable(that.selectTree.id,that.selectTree.layer)
      },

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
