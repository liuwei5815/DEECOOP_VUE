<template>
  <div class="testPage">
    <!--顶部搜索栏开始-->
    <search-bar
      v-if="searchList.length"
      :searchList="searchList"
      :searchMethod="searchMethod"
      :searchConfig="searchConfig"
      @search-map="searchMap"
      @search-res="searchRes"
      @send-guid="sendGuid"></search-bar>
    <!--顶部搜索栏结束-->

    <!--表格部分开始-->
    <el-row
      style="border: 1px solid #E4E4E4;border-bottom: none;margin-top: 10px;transition: height 0.4s;-webkit-transition: height 0.4s;-moz-transition: height 0.4s;"
      :style="{height: tableHeight+'px','margin-top': searchList.length?'10px':'0'}">
      <div style="float: left;width: 210px;height: 100%">
        <!--<dyna-form ref="dynaForm" @sent-list="formListResult" :formTemp="formTemp" :props="{value:'value'}"></dyna-form>-->
        <!--<el-button type="primary" @click="getList">buttonCont</el-button>-->
      </div>
      <div style="float: left;width: calc(100% - 210px);height: 100%">
        <transfer-table ref="trabsferTables" :tableConfigs="tableConfigs" :btnList="btnList" :stateBtn="stateBtnData" :apiData="apiData" @table-selected="tableSelected"></transfer-table>
      </div>



      <!--<el-button type="primary" @click="dialogBtns">buttonCont</el-button>-->
    </el-row>

    <!--表格部分结束-->

    <!--<component v-if="showDialog" :is="dialogData" :initData="dialog.data" :visible="visible" @close-dialog="closeDialog"></component>-->
    <!--<div v-if="showDialog">-->
    <!--<el-dialog v-el-drag-dialog title="11" :visible.sync="isVisible" width="500px">-->
    <!--<search-bar-->
    <!--v-if="searchList.length"-->
    <!--:searchList="searchList"-->
    <!--:searchMethod="searchMethod"-->
    <!--:searchConfig="searchConfig"-->
    <!--@search-map="searchMap"-->
    <!--@search-res="searchRes"></search-bar>-->
    <!--</el-dialog>-->
    <!--</div>-->
  </div>

    <!--<transfer-table :searchList="searchList" :searchMethod="searchMethod"></transfer-table>-->
</template>

<script>
  import transferTable from '@/components/transferTable'
  import searchBar from '@/components/searchBar'
  import DynaForm from "@/components//dynaForm";

  //	  table状态栏里面的按钮
  const stateBtns = {
    props: ['colConfig'],
    template: `<el-table-column :label="colConfig.label" :sortable="colConfig.sortable" align="center">
						<div slot-scope="scope">
    						<el-switch active-value="1" inactive-value="0" v-model="scope.row.isdisable" :disabled="colConfig.isSingle && scope.row.isdisable==='0'" @change="colConfig.changeState(scope.row,scope.$index)"></el-switch>
    					</div>
    			   </el-table-column>`
  }
  //	  table操作栏里面的按钮
  const operateBtns = {
    props: ['colConfig'],
    template: `<el-table-column :label="colConfig.label" :sortable="colConfig.sortable" align="center">
      					<div slot-scope="scope" class="btnBox">
      							<el-button  type="text" class="btns" style="font-size: 12px;" :disabled="scope.row.isdisable==='0'" @click="colConfig.editRole(scope.row,scope.$index)">编辑</el-button>
      					</div>
    				</el-table-column>`
  }
  //	  table示例栏里面的按钮
  const testBtns = {
    props: ['colConfig'],
    template: `<el-table-column :label="colConfig.label" :sortable="colConfig.sortable" align="center">
						<div slot-scope="scope">
    						<el-button  type="text" class="btns" style="font-size: 12px;" :disabled="scope.row.isdisable==='0'" @click="colConfig.testBtn(scope.row,scope.$index)">示例</el-button>
    					</div>
    			   </el-table-column>`
  }

  export default {
    name: "encapsulation",
    components: {
      transferTable,
      DynaForm,
      searchBar,
    },
    data() {
      return {
        userInfo: null,
        isVisible: false,
        showDialog: false,
        guid: '',


        //穿梭table数据
        btnList: [
          {
            name: '生成盘点任务',
            isShow: true,
            state: true,
            method: this.addMenu
          },
          {
            name: '清空',
            icon: 'refresh',
            state: true,
            plain: true,
            method: this.resetQuery,
            isShow: true
          }],
        apiData: {
          apiName: 'listPageLogInfo',
          params: {}
        },
        tableSelectList: [],
        stateBtnData: {
          title:'上次盘点至今变动过的货品',
          //keyName: 'state' //改变checkedBox状态后调用接口时用参数对象中的key名，不定义默认为'isShow'。
        },
        tableConfigs: {
          showIndex: true,//序号
          isSingle: false,//单选
          isSortable: false,//排序
        },
        //穿梭table数据结束

        //动态form组件数据开始
        formTemp: [{key:'haha',value:'sde'}],
        //动态form组件数据结束

        //动态搜索列配置数据开始
        searchList: [{
            label: '货品编码',
            type: 'input',
            ruleType: 'code',
            ruleOps: {min:6,max:7},
            mapKey: 'goodsCode',
            configs: {},
            placeholder: '请输入编码',
          },{
              label: '货品名称',
              type: 'input',
              ruleType: 'string',
              mapKey: 'goodsName',
              configs: {},
              placeholder: '请输入货物名'
            },{
                label: '盘点时间',
                type: 'select',
                ruleType: 'number',
                mapKey: 'inventoryTime',
                configs: {
                  clearable: true,
                  name: '',
                  options: [{
                    value: 1,
                    label: '由近到远'
                  },{
                    value: 2,
                    label: '由远到近'
                  }]
                },
                placeholder: '请选择'
            },{
              label: '库存变动时间',
              type: 'select',
              mapKey: 'inventoryChangeTime',
              configs: {
                clearable: true,
                name: '',
                options: [{
                  value: 1,
                  label: '近3天内'
                },{
                  value: 2,
                  label: '近一周内'
                },{
                  value: 3,
                  label: '近一个月'
                },{
                  value: 4,
                  label: '近三个月'
                },{
                  value: 5,
                  label: '近一年'
                },
                ]},
              placeholder: '请选择',
            },{
            label: '库存数量',
            type: 'cascader',
            mapKey: 'cascaded',
            configs: {
              clearable: true,
              apiName: 'getDictionarys',
              params: {dictionaryKey:'userType',isglobal:'1'}
            },
            placeholder: '请选择'
          },{
          label: '货品总金额',
          type: 'select',
          mapKey: 'totalAmount',
          configs: {
            clearable: true,
            name: '',
            options: [{
              value: 1,
              label: '从低到高'
            },{
              value: 2,
              label: '从高到低'
            }]
          },
          placeholder: '请选择'
        },{
          label: '盘点日期',
          type: 'date',
          ruleType: 'date',
          mapKey: 'date',
          configs: {
            clearable: true,
            name: '',
            type: 'date',
            pickerOptions: {
              //可用的时间范围，字符串数组，前一个为可用的开始时间，后一个为可用的结束时间
              disabledDate: ['2018-09-15','2018-10-20']
            }
          },
          placeholder: '请选择'
        },{
          label: '盘点时间',
          type: 'time',
          mapKey: 'time',
          configs: {
            clearable: true,
            name: '',
            pickerOptions: {
              //固定时间点模式
              // start: '12:00',
              // end: '22:00',
              // step: '00:30',
              //任意时间点模式（默认）
              // selectableRange: '' || ['06:30:00-11:30:00','14:00:00-18:00:00'],
            }
          },
          placeholder: '选择时间'
        },{
          label: '货品单价',
          type: 'magnifier',//放大镜
          mapKey: 'magnifier',
          configs: {

            // //table弹窗
            // //必填项
            dialogType: 'table',
            apiName: 'listPageRoles',
            params:  {},
            // //非必填项
            // title: '表格弹窗',
            // width: 800,
            // tableBtns: [
            //   {
            //     columnIndex: 'isdisable',
            //     component: stateBtns,
            //     changeState: this.changeRoleState
            //   },
            //   {
            //     columnIndex: 3,
            //     prop: 'test',
            //     label: '示例',
            //     component: testBtns,
            //     testBtn: this.testBtn
            //   },
            //   {
            //     columnIndex: 'last',//可接受'last'或者'first'
            //     prop: 'operate',
            //     label: '操作',
            //     component: operateBtns,
            //     editRole: this.editRole
            //   }
            // ],
            // tableOption: {
            //   showCheckBox: true,
            //   showIndex: true,
            //   isSingle: true,
            //   isSortable: false,
            //   isFixed: 1,
            //   searchList: [{
            //     label: '货品编码',
            //     type: 'input',
            //     ruleType: 'code',
            //     ruleOps: {min:6,max:7},
            //     mapKey: 'testCode',
            //     configs: {},
            //     placeholder: '请输入编码',
            //   },{
            //     label: '货品名称',
            //     type: 'input',
            //     ruleType: 'string',
            //     mapKey: 'testName',
            //     configs: {},
            //     placeholder: '请输入货物名'
            //   },{
            //     label: '盘点时间',
            //     type: 'select',
            //     ruleType: 'number',
            //     mapKey: 'testTime',
            //     configs: {
            //       clearable: true,
            //       name: '',
            //       options: [{
            //         value: 1,
            //         label: '由近到远'
            //       },{
            //         value: 2,
            //         label: '由远到近'
            //       }]
            //     },
            //     placeholder: '请选择'
            //   }],
            // },

            // // tree弹窗
            // // 必填项
            // dialogType: 'tree',
            // apiName: 'getDictionarys',
            // params:  {dictionaryKey:'userType',isglobal:'1'},
            // apiName: 'listTreeDepartment',
            // params:  {deptID:this.$storage.get('userInfo').companyId},
            // // 非必填项
            // title: '树弹窗',
            // showDisable: false,
            // keyboard: true,
            // showSearch: false,
            // keyName: 'state',


            // // 树表弹窗
            // // 必填项:
            // dialogType: 'treeAndTable',//弹窗模式，必填项
            // apiName: {//api数据
            //   tree: {
            //     api:'listTreeDictionary',
            //     params: {}
            //   },
            //   table: {
            //     api:'listPageDictionary',
            //     params: {//特别说明：树表弹窗组件中表的请求参数按如下方式配置，api中需要用到什么参数就传【参数名】即可。
            //       //          如将【参数名】和【参数】一起传入，默认后续的api请求将按传入的参数名和参数发请求，不再内部取值
            //       //          如只需要在第一次请求表数据时使用传入的参数，请设置'isInit'属性为true
            //       pid: '',
            //       pageNo: '',
            //       layer: ''
            //     },
            //     isInit: false, //可不设置，配合第一次表接口请求
            //   }
            // },
            // // 非必填项
            // title: '树表弹窗',//弹窗名称，可不设置，默认为'树表弹窗'
            // layoutType: 'left',//布局模式，可不设置，默认左树右表，设置为'right'则为左表右树
            // scrollTree: true,//树是否可收起，可不设置，默认为false,不可收起
            // width: 900,//弹窗宽度，可不设置，默认900，接收三种类型的参数：200 || '200px' || '30%'
            // treeWidth: 200,//树宽度，可不设置，默认200，接收三种类型的参数：200 || '200px' || '30%'
            // showDisable: false,
            // keyboard: true,
            // showSearch: false,
            // // 表中的自定义按钮参数
            // tableBtns: [
            //   {
            //     columnIndex: 'isdisable',//按钮要放入的位置，对应接口返回的title的key
            //     component: stateBtns,
            //     changeState: this.changeRoleState
            //   },
            //   {
            //     columnIndex: 3,//按钮要放入的位置，除checkBox和index后的第三列
            //     prop: 'test',
            //     label: '示例',
            //     component: testBtns,
            //     testBtn: this.testBtn
            //   },
            //   {
            //     columnIndex: 'last',//可接受'last'或者'first'
            //     prop: 'operate',
            //     label: '操作',
            //     component: operateBtns,
            //     editRole: this.editRole
            //   }
            // ],
            // //表的配置项
            // tableOption: {
            //   showCheckBox: true,
            //   showIndex: true,
            //   isSingle: true,//是否单选
            //   isSortable: false,//是否开启排序功能
            //   isFixed: 1,//固定的列数
            //   searchList: [{
            //     label: '货品编码',
            //     type: 'input',
            //     ruleType: 'code',
            //     ruleOps: {min:6,max:7},
            //     mapKey: 'testCode',
            //     configs: {},
            //     placeholder: '请输入编码',
            //   },{
            //     label: '货品名称',
            //     type: 'input',
            //     ruleType: 'string',
            //     mapKey: 'testName',
            //     configs: {},
            //     placeholder: '请输入货物名'
            //   },{
            //     label: '盘点时间',
            //     type: 'select',
            //     ruleType: 'number',
            //     mapKey: 'testTime',
            //     configs: {
            //       clearable: true,
            //       name: '',
            //       options: [{
            //         value: 1,
            //         label: '由近到远'
            //       },{
            //         value: 2,
            //         label: '由远到近'
            //       }]
            //     },
            //     placeholder: '请选择'
            //   }],
            // },
          },
          placeholder: '请选择'
        },],
        searchMethod: {},
        searchConfig: {},
        //动态搜索列配置数据结束
      }
    },
    created(){
      this.userInfo = this.$storage.get('userInfo')
      // this.searchMethod = {
      //   api:'/role/listPageRoles',
      //   data: this.userInfo
      // }
    },
    computed: {
      tableHeight() {
        if(this.$store.getters[this.guid+'/clientData']){
          return this.$store.getters[this.guid+'/clientData'].clientHeight - (this.searchList.length?(this.$store.getters[this.guid+'/dynaHeight'] + 30 - this.$store.getters[this.guid+'/arrowBtn']):0)
        }else {
          return 0
        }
      },
    },
    methods: {
      //动态搜索列table弹窗中table内按钮功能
      changeRoleState(data,index){
        console.log(data)
        console.log(index)
      },
      testBtn(data,index) {
        console.log(data)
        console.log(index)
      },
      editRole(data,index) {
        console.log(data)
        console.log(index)
      },

      //动态form功能
      getList() {
        this.$refs.dynaForm.getFormList()
      },
      formListResult(list) {
        console.log(list)
      },

      //动态搜索列传回数据
      searchMap(data) {
        console.log(data)
      },
      searchRes(res) {
        console.log(res)
      },
      sendGuid(id) {
        this.guid = id
      },
      dialogBtns() {
        this.showDialog = true
        this.isVisible = true
      },

      //穿梭table的自定义方法
      addMenu(){
        console.log(this.tableSelectList)
      },
      resetQuery(){
        this.$refs.trabsferTables.clearTableSelected()
      },
      tableSelected(list){
        this.tableSelectList = list
      }
    }
  }
</script>

<style lang="scss" rel="text/css">
  .testPage {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 0;
    box-sizing: border-box;
  }
</style>
