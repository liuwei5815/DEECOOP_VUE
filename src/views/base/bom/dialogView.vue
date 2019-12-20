<template>
  <el-dialog v-el-drag-dialog  :title="title" :visible.sync="isVisible" @close="dialogClose" append-to-body width="1200px" :layoutType="1">
    <!--弹窗控件开始-->
    <component v-if="showDialog" :is="dialogName" :initData="dialogData" :visible="visibleState" @close-dialog="closeDialog"></component>
    <div v-loading="dialogTopLoading">
    <!--弹窗控件结束-->
    <el-row>

      <el-col :span="4" style="background-color: #F9FAFC;overflow-y: auto;padding: 8px;">
          <base-tree ref="tree" :data="treeData" :treeConfigs="treeConfigs"
                     @treedatabridge="treeDataBridge"></base-tree>

      </el-col>

      <el-col :span="20" style="height: 100%">
        <div style="height: 50px;box-sizing: border-box;padding: 7px 20px 7px 7px;">
            <el-row>
              <el-col :span="8">
                <template v-for="(item, index) in configs.topBarBtnList">
                  <base-button v-show="item.isShow" :name='item.name' :icon='item.icon' :plain="item.plain" :state="item.state"
                               @myclick="item.method"></base-button>
                </template>
              </el-col>
              <el-col :span="8"  style="padding: 10px;">
                <div><b>BOM编码  :  </b>{{initData.temp.code}}</div>
              </el-col>
              <el-col :span="8" style="padding: 10px;">
                <div><b>BOM名称  :  </b>{{initData.temp.name}}</div>
              </el-col>
            </el-row>
        </div>
        <div style="padding: 7px;">
          <base-table :data="tableData" :colConfigs="configs.tableConfigs" :showCheckBox="configs.showCheckBox"
                      :showIndex="configs.showIndex" @databridge="dataBridge"  :isSingle="configs.isSingle" :pageData="pageData" :currentpage.sync="pageNo" :isSortable=false></base-table>
        </div>
        <div  style="text-align: center; position: relative;top: 5px; padding-bottom: 10px;">
          <el-button @click="isVisible = false">关闭</el-button>
        </div>
      </el-col>
    </el-row>


    </div>
  </el-dialog>


</template>

<script>
  // import baseTable from '@/components/baseTable'
  import i18n from '@/lang'
  import dialogTreeEdit from './dialogTreeEdit'
  import dialogTreeAdd from './dialogTreeAdd'
  import dialogMutiAdd from './dialogMutiAdd'
  import dialogReplaceableAdd from './dialogReplaceableAdd'
  import dialogReplaceableView from './dialogReplaceableView'
  import {
    listPageBomTrees,     //分页列表查询查询
    deleteBomTree,
    getBomTree
  } from '@/api/bomTree'



  //	公共方法
  import {filerTableTitle,circleTree,downLoad} from '@/utils/common'


  //	  table操作栏里面的按钮
  const operateBtns = {
    props: ['colConfig'],
    template: `<el-table-column :label="colConfig.label" :sortable="colConfig.sortable" align="center" width="150px">
      					<div slot-scope="scope" class="btnBox">
      					    <el-row>
      					      <el-col :span="12"><el-button  v-show="colConfig.editBtns_isShow && scope.row.layer>0" type="text" class="btns" style="font-size: 12px;" @click="colConfig.editBtns(scope.row,scope.$index)">编辑</el-button></el-col>
      					      <el-col :span="12"><el-button  v-show="colConfig.addReplaceable_isShow && scope.row.childrenNum==1" type="text" class="btns" style="font-size: 12px;" @click="colConfig.addReplaceable(scope.row,scope.$index)">新增替代物</el-button></el-col>
      					    </el-row>
      					    <el-row>
                      <el-col :span="12"><el-button  v-show="colConfig.deleteBtns_isShow && scope.row.layer>0" type="text" class="btns" style="font-size: 12px;" @click="colConfig.deleteBtns(scope.row,scope.$index)">删除</el-button></el-col>
                      <el-col :span="12"><el-button  v-show="colConfig.viewReplaceable_isShow && scope.row.childrenNum==1" type="text" class="btns" style="font-size: 12px;" @click="colConfig.viewReplaceable(scope.row,scope.$index)">查看替代物</el-button></el-col>
                    </el-row>
      					</div>

    				</el-table-column>`
  }



  export default {

    name: "dialog-option",
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
          name: '',
          pathId: '',
          bomTreeId: '',
          bomId: ''
        },


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




        /*初始化数据*/
        initConfigs: {
          //行级按钮初始化
          tableOperates: {
            prop: 'operate',
            label: '操作',
            enLabel: 'operation',
            btnName: '编辑',
            isPropName: true,
            component: operateBtns, //自定义按钮组件
            editBtns: this.editBtns, //自定义按钮方法-编辑
            editBtns_isShow: true,
            deleteBtns: this.deleteBtns,
            deleteBtns_isShow: true,
            addReplaceable: this.addReplaceable,
            addReplaceable_isShow: true,
            viewReplaceable: this.viewReplaceable,
            viewReplaceable_isShow: true,

          },
        },


        configs: {
          //表级按钮初始化
          topBarBtnList: [
            {
              name: '新增',
              nameEn: 'add',
              isShow: true,
              icon: 'add',
              method: this.addNew //自定义按钮方法-新增
            },
          ],
          tableConfigs: [],
          showCheckBox: false,//是否显示行级单选框
          showIndex: false,    //是否显示行号
          isSingle: false,
        },

        //table数据集
        tableData: [],

        //行数据选择列表
        selectList: [],

        // query查询字段
        queryParms: [{name: 'code'},{name: 'name'}],

        // query查询字段值map集合
        tempQuery: {

        },

        // query表单标签名称map集合
        tempLable: {

        },

        temp: {

        },

        //分页参数集合及当前默认页面
        pageData: null,
        pageNo: 1,


        //弹窗功能
        openDialogName: '',
        showDialog: false,
        visibleState: false,
        dialogData: {
          //width: '600px',
          title: '',
          temp:null,
          tempLable:null,
          selectTree:null,
        },

      }
    },

    //子组件
    components: {
      // baseTable
      dialogReplaceableView,
      dialogReplaceableAdd,
      dialogMutiAdd,
      dialogTreeAdd,
      dialogTreeEdit,
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
      // that.temp = that.initData.temp
      that.temp = JSON.parse(JSON.stringify(that.initData.temp))
      // console.log(that.temp)
      //加载左树右表
      that.initTree()
      // that.initTable()
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
        this.$emit('close-dialog',{resState:'ok'})
        // if(this.tableData.length){
        //   this.$emit('close-dialog',{resState:'ok'})
        // }else{
        //   this.$message({
        //     type: 'info',
        //     message: '请添加BOM列表!'
        //   });
        //   return
        // }

      },



      //通过搜索栏查询，加载table列表
      queryTable(){
        const that = this
        that.pageNo=1
        that.initTable(that.selectTree.id,that.selectTree.layer)
      },



      initTree() {
        const that = this
        //页面初始化列表及分页参数
        //*******************************************************用户自定义修改 start ***************************************************************************
        that.dialogTopLoading = true
        getBomTree({
          isreplaceable:'0',
          bomId:that.initData.temp.id,
          prodId:that.initData.temp.prodId
        }).then(res => {

          const newTree = []
          const root = res.result.treeList
          that.selectTree = {
            pid: root.pid,
            id: root.id,
            layer: root.layer,
            name: root.name,
            pathId: root.pathId,
            bomTreeId: root.bomTreeId,
            bomId: root.bomId
          }
          newTree.push(root)
          that.treeData = newTree

          that.treeNodes = []


          //初次不显示已封存节点
          circleTree(that.treeData,that.showDisableDept,that.filterTextDept,that.treeNodes)
          that.$nextTick(function () {
            if(that.treeNodes.length>0){
              let selectTreeNode = that.treeNodes[0]
              that.selectTree = {
                pid: selectTreeNode.pid,
                id: selectTreeNode.id,
                layer: selectTreeNode.layer,
                name: selectTreeNode.name,
                pathId: selectTreeNode.pathId,
                bomTreeId: selectTreeNode.bomTreeId,
                bomId: selectTreeNode.bomId
              }
            }
            //that.$refs.tree.$children[0].setCurrentKey(that.selectTree.id)
            that.initTable(that.selectTree.id,that.selectTree.layer,true)
          })


        }).catch(err => {
          console.log(err)
          that.dialogTopLoading = false
        })

      },



      //加载table列表
      initTable(pid,layer,isClosedLoading){
        const that = this

        //页面初始化列表及分页参数
        //*******************************************************用户自定义修改 start ***************************************************************************
        listPageBomTrees({
          //参数
          ...that.tempQuery,
          isreplaceable:'0',
          bomId:that.initData.temp.id,
          prodId:pid,
          pageNo:that.pageNo,
          orderStr:'tree.layer asc,product.code asc'
        }).then(res => {
          that.getListPage(res)
          if(isClosedLoading){
            that.dialogTopLoading = false
          }
        }).catch(err => {
          // console.log(err)
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
          that.configs.showCheckBox = false
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

        })
        list.push(that.initConfigs.tableOperates)
        return list
      },


      addReplaceable(item, index){
        // console.log("******",item)
        this.dialogData.temp = JSON.parse(JSON.stringify(item))
        this.dialogData.title = '新增替代物('+ item.name+')'
        // this.openDialogName = 'dialogTreeAdd'
        this.openDialogName = 'dialogReplaceableAdd'
        this.showDialog = true
        this.visibleState = true
      },

      viewReplaceable(item, index){
        this.dialogData.temp = JSON.parse(JSON.stringify(item))
        this.dialogData.title = '查看替代物('+ item.name+')'
        // this.openDialogName = 'dialogTreeAdd'
        this.openDialogName = 'dialogReplaceableView'
        this.showDialog = true
        this.visibleState = true
      },

      //表级按钮-新增
      addNew() {
        this.resetTemp()
        if(this.selectTree.id){
          this.dialogData.selectTree = this.selectTree
        }else {
          this.$message({
            type: 'info',
            message: '请选择上级节点'
          });
          return
        }

        // this.dialogData.temp = this.temp
        // this.dialogData.tempLable = this.tempLable
        this.dialogData.title = '新增(上级：'+ this.selectTree.name+')'
        // this.openDialogName = 'dialogTreeAdd'
        this.openDialogName = 'dialogMutiAdd'
        this.showDialog = true
        this.visibleState = true
      },


      //行级按钮-编辑
      editBtns(item, index) {
        // console.log("*********"+JSON.stringify(item))
        this.resetTemp()
        if(this.selectTree.id){
          this.dialogData.selectTree = this.selectTree
        }else {
          this.$message({
            type: 'info',
            message: '请选择上级节点'
          });
          return
        }
        //将item对象转成json字符串，然后又将字符串转成新生成的json对象，最后将这个json对象直接传递给temp。如果直接将item对象传递给temp，那后面对temp进行数据修改同时也会对item对象进行修改。为了防止这种情况，我们采用了json转换对象的间接传递。
        this.temp = JSON.parse(JSON.stringify(item))

        this.dialogData.temp = this.temp
        this.dialogData.tempLable = this.tempLable
        this.dialogData.title = '编辑'
        this.openDialogName = 'dialogTreeEdit'
        this.showDialog = true
        this.visibleState = true
      },



      //行级按钮-编辑
      deleteBtns(item, index) {
        const that = this

        that.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteBomTree(item.id)
            .then(res => {
              if (res.code === 0) {
                that.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
                })
                that.refreshTable()
              }
            }).catch(err => {
            console.log(err)
          })

        }).catch(() => {
          that.$message({
            type: 'info',
            message: '已取消删除'
          });
        });


      },

      //form表单内容重置
      resetTemp() {
        const that = this
        for(let key in that.temp) {
          // console.log(key)
          that.temp[key]= ''
        }
      },

      //自定义状态列回调函数
      changeIsDefault(item, index) {
        const that = this
        //ajax调用启用禁用后台方法

      },

      //弹窗功能
      closeDialog(data) {
        // console.log(data)
        this.showDialog = false
        if(data.resState === 'ok'){
          this.refreshTable()
        }
      },

      //Table列表刷新
      refreshTable() {
        const that = this
        // console.log(this.initData)
        that.$axios.all([
          listPageBomTrees({  ...that.tempQuery,isreplaceable:'0',bomId:that.initData.temp.id,prodId:that.selectTree.id,pageNo: that.pageNo,orderStr:'tree.layer asc,product.code asc' }),
          getBomTree({isreplaceable:'0',bomId:that.initData.temp.id,prodId:that.initData.temp.prodId})
        ]).then(that.$axios.spread((res1,res2) => {
          that.getListPage(res1)

          const root = res2.result.treeList
          const newTree = []
          newTree.push(root)
          that.treeData = newTree
          that.$nextTick(function () {
            //that.$refs.tree.$children[0].setCurrentKey(that.selectTree.id)
          })
        })).catch((error) => {
          console.log(error)
        })

      },


      treeDataBridge(data) {
        // console.log(data)
        const that = this
        that.selectTree = {
          pid: data.nodeData.pid,
          id: data.nodeData.id,
          layer: data.nodeData.layer,
          name: data.nodeData.name,
          pathId: data.nodeData.pathId,
          bomTreeId: data.nodeData.bomTreeId,
          bomId: data.nodeData.bomId
        }
        that.pageNo=1
        that.initTable(that.selectTree.id,that.selectTree.layer)
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
      },

    },

    //计算属性
    computed: {
      dialogName() {
        return this.openDialogName
      }
    },

    //观察者,可监听数据，属性和方法
    watch: {
      pageNo: function () {
        const that = this
        that.initTable(that.selectTree.id,that.selectTree.layer)
      },
    }
  }


</script>

<style>
  .treeStyle {
    position: relative;
    background-color: #F9FAFC;
    overflow-y: auto;
    padding: 5px;
    height: 100%;
  }
</style>
