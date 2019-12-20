<template>
  <el-dialog v-el-drag-dialog  :title="title" :visible.sync="isVisible" @close="dialogClose" append-to-body width="900px">
    <!--弹窗控件开始-->
    <component v-if="showDialog" :is="dialogName" :initData="dialogData" :visible="visibleState" @close-dialog="closeDialog"></component>
    <!--弹窗控件结束-->
    <div v-loading="dialogTopLoading">




      <!--<div style="height: 50px;box-sizing: border-box;padding: 7px 20px 7px 7px;">-->

      <!--<template v-for="(item, index) in configs.topBarBtnList">-->
      <!--<base-button v-show="item.isShow" :name='item.name' :icon='item.icon' :plain="item.plain" :state="item.state"-->
      <!--@myclick="item.method"></base-button>-->
      <!--</template>-->

      <!--</div>-->


      <div style="padding: 7px;">
        <base-table :data="tableData" :colConfigs="configs.tableConfigs" :showCheckBox="configs.showCheckBox"
                    :showIndex="configs.showIndex" @databridge="dataBridge"  :isSingle="configs.isSingle" :pageData="pageData" :currentpage.sync="pageNo"></base-table>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: center;padding-bottom: 10px">
        <el-button @click="isVisible = false">关闭</el-button>
      </div>
    </div>

  </el-dialog>


</template>

<script>
  // import baseTable from '@/components/baseTable'
  import i18n from '@/lang'
  import dialogTreeEdit from './dialogTreeEdit'
  import dialogView from './dialogView'

  import {
    listPageBomTrees,     //分页列表查询查询
    deleteBomTree
  } from '@/api/bomTree'



  //	公共方法
  import {filerTableTitle} from '@/utils/common'


  //	  table状态栏里面的按钮
  const stateBtns = {
    props: ['colConfig'],
    template: `<el-table-column :label="colConfig.label" :sortable="colConfig.sortable" align="center">
						<div slot-scope="scope">
    						<el-switch active-value="1" inactive-value="0" v-model="scope.row.isdisable" @change="colConfig.changeState(scope.row,scope.$index)"></el-switch>
    					</div>
    			   </el-table-column>`
  }

  // const isdefaultBtns = {
  //   props: ['colConfig'],
  //   template: `<el-table-column :label="colConfig.label" :sortable="colConfig.sortable" align="center">
	// 					<div slot-scope="scope">
  //   						<el-switch active-value="1" inactive-value="0" v-model="scope.row.isdefault" :disabled="scope.row.isdefault=='1'" @change="colConfig.changeIsDefault(scope.row,scope.$index)"></el-switch>
  //   					</div>
  //   			   </el-table-column>`
  // }

  //	  table操作栏里面的按钮
  const operateBtns = {
    props: ['colConfig'],
    template: `<el-table-column :label="colConfig.label" :sortable="colConfig.sortable" align="center">
      					<div slot-scope="scope" class="btnBox">
      							<el-button  v-show="colConfig.editBtns_isShow" type="text" class="btns" style="font-size: 12px;" @click="colConfig.editBtns(scope.row,scope.$index)">编辑</el-button>
      							<el-button  v-show="colConfig.deleteBtns_isShow" type="text" class="btns" style="font-size: 12px;" @click="colConfig.deleteBtns(scope.row,scope.$index)">删除</el-button>
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
            // viewBomBtns: this.viewBomBtns,
            // viewBomBtns_isShow: true,
            deleteBtns: this.deleteBtns,
            deleteBtns_isShow: true,
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
            // {
            //   name: '删除',
            //   nameEn: 'delete',
            //   isShow: true,
            //   icon: 'delete',
            //   plain: true,
            //   state: true,
            //   method: this.deleteBatch//自定义按钮方法-删除
            // },
            {
              name: '导出',
              nameEn: 'export',
              isShow: true,
              icon: 'export',
              method: this.exportExcel
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

        parent:{

        },

        temp: {

        },

        // query表单标签名称map集合
        tempLable: {

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
        },

      }
    },

    //子组件
    components: {
      // baseTable
      dialogTreeEdit,
      dialogView
    },

    /*生命周期函数开始*/
    //vue实例化之前
    beforeCreate() {

    },

    //vue实例化后调用
    created() {
      const that = this
      that.parent = that.initData.temp
      that.title = that.initData.title
      that.configs.isSingle = that.initData.isSingle
      that.userInfo = that.$storage.get('userInfo')
      //加载左树右表
      that.initTable(true)
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
      },



      //通过搜索栏查询，加载table列表
      queryTable(){
        const that = this
        that.pageNo=1
        that.initTable()
      },


      //加载table列表
      initTable(isClosedLoading){
        const that = this
        that.dialogTopLoading = true
        //页面初始化列表及分页参数
        //*******************************************************用户自定义修改 start ***************************************************************************
        listPageBomTrees({
          //参数
          ...that.tempQuery,
          isreplaceable:'1',
          bomId:that.initData.temp.bomId,
          prodId:that.initData.temp.prodId,
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

        //部门类型下拉列表初始化
        // that.handleDeptTypeFocus()

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
          //列表特殊字段处理
          if (item.label ===  '是否启用') {
            item.component = stateBtns
            item.changeState = that.changeState
          }

          // if (item.label ===  '是否默认') {
          //   item.component = isdefaultBtns
          //   item.changeIsDefault = that.changeIsDefault
          // }

        })
        list.push(that.initConfigs.tableOperates)
        return list
      },


      // viewBomBtns(item, index){
      //   this.resetTemp()
      //   //将item对象转成json字符串，然后又将字符串转成新生成的json对象，最后将这个json对象直接传递给temp。如果直接将item对象传递给temp，那后面对temp进行数据修改同时也会对item对象进行修改。为了防止这种情况，我们采用了json转换对象的间接传递。
      //   this.temp = JSON.parse(JSON.stringify(item))
      //
      //   this.dialogData.temp = this.temp
      //   this.dialogData.tempLable = this.tempLable
      //   this.dialogData.title = '查看/编辑'
      //   this.openDialogName = 'dialogView'
      //   this.showDialog = true
      //   this.visibleState = true
      // },

      //行级按钮-编辑
      editBtns(item, index) {
        // console.log("*********"+JSON.stringify(item))
        this.resetTemp()
        //将item对象转成json字符串，然后又将字符串转成新生成的json对象，最后将这个json对象直接传递给temp。如果直接将item对象传递给temp，那后面对temp进行数据修改同时也会对item对象进行修改。为了防止这种情况，我们采用了json转换对象的间接传递。
        this.temp = JSON.parse(JSON.stringify(item))
        this.dialogData.selectTree = this.parent
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

      // //自定义状态列回调函数
      // changeIsDefault(item, index) {
      //   const that = this
      //   //ajax调用启用禁用后台方法
      //   updateIsDefaultBom(item.id,item.isdefault,this.initData.temp.prodId)
      //     .then(res => {
      //       that.refreshTable()
      //     }).catch(err => {
      //     console.log(err)
      //   })
      // },

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
        that.$axios.all([
          listPageBomTrees({
            //参数
            ...that.tempQuery,
            isreplaceable:'1',
            bomId:that.initData.temp.bomId,
            prodId:that.initData.temp.prodId,
            pageNo:that.pageNo,
            orderStr:'tree.layer asc,product.code asc'
          })
        ]).then(that.$axios.spread((res) => {
          that.getListPage(res)
        })).catch((error) => {
          console.log(error)
        })

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
        that.initTable()
      },
    }
  }


</script>

<style>

</style>
