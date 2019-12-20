<template>
  <div class="resetRootStyle">
    <!--顶部搜索栏开始-->
    <search-bar
      v-if="searchList.length"
      :searchList="searchList"
      @search-map="searchMap"
      @send-guid="sendGuid"></search-bar>
    <!--顶部搜索栏结束-->

    <!--表格部分开始-->
    <el-row
      style="border-bottom: none;transition: height 0.4s;-webkit-transition: height 0.4s;-moz-transition: height 0.4s;"
      :style="{height: tableHeight+'px'}">
      <tabs-table
        :tabs="tabs"
        :tableConfig="tableConfig"
        @tabsKey="sendTabsKey"
        @databridge="databridge"></tabs-table>
    </el-row>

    <!--表格部分结束-->

  </div>
</template>

<script>
  import searchBar from '@/components/searchBar'
  import tabsTable from '@/components/tabsTable'


  export default {

    data() {
      return {
        //region

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
        }],
        searchMethod: {},
        searchConfig: {},
        //动态搜索列配置数据结束

        fromTemp: {},
        showDialog: false,
        dialogVisible: false,
        dialogCallBackData: null,
        guid: '',

        //table数据开始
        currentpage: 1,
        searchObj: {},
        precision:3,//计算精度，默认保留两位小数

        activeName: 'first',
        isFinance: false,
        tableConfig: {
          configs:{
            '0': {
              showCheckBox: true,
              showIndex: false,
              expandOne: false,
              isSortable: false,
              showPageData: true,
            },
            '1': {
              showCheckBox: false,
              showIndex: true,
              isSortable: false,
              isSingle: true,
            }
          },
          customColumn:{//自定义行设置
            '0':[{
              columnIndex: 'last',
              prop: 'operate',
              label: '操作',
              componentName: 'button',
              component: [
                {
                  name: '详情',
                  editBtns_isShow: true,
                  icon: 'add',
                  method: this.addChild //自定义按钮方法-新增
                }
              ]
            }]
          },
          mergeColumn: {//合并行设置，可将需要合并放在一起显示的行数据按如下格式配置，index是合并后的行出现的位置，columns参数为数据，成员为需要合并的数据key
            '0':[
              {
                index: 1,
                columns: ['warehouseOutCode','productCode','parentId','productId'],
              },
              {
                index: 2,
                columns: ['productGenreName','productUnitName','count','executeCount'],
              },
              {
                index: 3,
                columns: ['productName','productSpec','progress','code'],
              }
            ],
          },
          columnGlobalStyle: {//行数据的全局样式设置，如果需要给所有行设置相同的样式时可以使用
            '0':{
              titleStyle: {
                'font-size': '14px',
                'font-weight': 600,
                color: '#000000'
              },
              bodyStyle: {
                color: '#199ED4'
              }
            }
          }
        },
        tabs: [
          {
            label: '待开票',
            key: 'first',
            btnName: '申请开票',
            method: this.invoice,
            disabled: false,
            componentName: 'customRowTable',
            apiObj: {//组件使用的API和参数，参数如果已经赋值将成为固定参数，需要动态赋值的参数请勿提前赋值
              apiName: 'listPageWarehouseOutDetailsDispatch',
              params: {
                queryStr: "detail.id in ('219967d2f6704d868b11002caef9885c')",

              }
            },
          },
          {
            label: '已开票',
            key: 'second',
            btnName: '申请开票',
            disabled: true,
            componentName: 'customRowTable',
            apiObj: {//组件使用的API和参数，参数如果已经赋值将成为固定参数，需要动态赋值的参数请勿提前赋值
              apiName: 'listPageWarehouseOutDetailsDispatch',
              params: {
                queryStr: "detail.id in ('219967d2f6704d868b11002caef9885c')",

              }
            },
          },
        ],
      }
    },

    //子组件
    components: {
      searchBar,
      tabsTable
    },

    /*生命周期函数开始*/
    //vue实例化后调用
    created() {

    },
    //真实DOM挂载后，仅限组件本身的挂载，如果存在子组件，并且需求子组件全部被挂载后进行操作，需使用vm.$nextTick顶替mounted（在mounted内部调用vm.$nextTick）；
    mounted() {

    },
    /*生命周期函数结束*/

    //方法
    methods: {
      sendTabsKey(key){
        this.activeName = key
      },
      formData(data) {
        console.log(data)
      },
      databridge(data){
        console.log(data)
      },
      sendGuid(id) {
        this.guid = id
      },
      searchMap(data) {
        this.searchObj = data
        // this.tableConfig.apiObj.params = Object.assign({},this.tableConfig.apiObj.params,this.searchObj)
        const index = this.tabs.findIndex(v=>{
          return v.key === this.activeName
        })
        index > -1 && (this.tabs[index].apiObj.params = Object.assign({},this.tabs[index].apiObj.params,this.searchObj))
      },
      addChild(item,index,data) {
        console.log(item,index,data)
        this.dialogCallBackData = item
        this.showDialog = true
        this.dialogVisible = true
      },
      addChildRow(){
        this.dialogVisible = false
        this.showDialog = false
      },
      deleteAllRow(item,index,all){
        console.log(item,index,all)
      },
      invoice(data){
        console.log(data)
      }

    },

    //计算属性
    computed: {
      tableHeight() {
        if(this.$store.getters[this.guid+'/clientData']){
          return this.$store.getters[this.guid+'/clientData'].clientHeight - (this.searchList.length?(this.$store.getters[this.guid+'/dynaHeight'] + 30 - this.$store.getters[this.guid+'/arrowBtn']):0)
        }else {
          return 0
        }
      },
    },

    //观察者,可监听数据
    watch: {
      currentpage: function () {
        console.log(this.currentpage)
      },
    }

  }

</script>

<style lang="scss" rel="text/css">
  .resetRootStyle {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 0;
    box-sizing: border-box;

    .el-row {
      .el-tabs {
        height: 100%;
        .el-tabs__header {
          margin: 0 0 5px;
        }
        .el-tabs__content {
          height: calc(100% - 45px);
          .el-tab-pane {
            height: 100%;
          }
        }
      }
    }
  }
</style>
