<template>
  <div class="multiLabelTable">
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
      <multi-label-table
        :tabs="tabs"
        @tabsKey="sendTabsKey"
        @databridge="databridge"
        @callmethod="callMethod"></multi-label-table>
    </el-row>

    <!--表格部分结束-->

  </div>
</template>

<script>
  import searchBar from '@/components/searchBar'
  import multiLabelTable from '@/components/multiLabelTable'


  export default {

    data() {
      return {
        //region

        //动态搜索列配置数据开始
        searchList: [
          {
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

        guid: '',

        //table数据开始
        searchObj: {},

        activeName: 0,
        tabs: [
          {
            label: '待开票',
            btns: [
              {
                btnName: '申请开票1',
                method: this.invoice,
                disabled: false,
              },
              {
                btnName: '退票1',
                method: this.invoice,
                disabled: false,
              },
            ],
            componentName: 'baseTable',//‘baseTable’为自定义单级表，‘multilevelTable’为自定义多级表
            tableConfigList: [
              {
                customColumn:[
                  {
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
                  }
                ],
                mergeTitle: [
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
                apiObj: {//组件使用的API和参数，参数如果已经赋值将成为固定参数，需要动态赋值的参数请勿提前赋值
                  apiName: 'listPageWarehouseOutDetailsDispatch',
                  params: {
                    queryStr: "detail.id in ('219967d2f6704d868b11002caef9885c')",
                  }
                },
                //显示序号
                showIndex: true,

                //显示选择器
                showCheckBox: false,

                //显示列控制器
                showTableSet: false,

                //开启下级
                expand: false,
                expandMode: 'none',//展开模式，'all'全部展开(默认)，'one'同级只能展开一个，默认第一条，'none'不自动展开；其中'all'模式下默认没有展开按钮，可设置showExpandBtn强制显示展开按钮

                // //表头样式
                // headerStyle: {
                //   'background-color': '#E4F3FA'
                // },
                // //行样式
                // rowStyle: {
                //   'background-color': '#E4F3FA',
                // },
              },
            ],
          },
          {
            label: '已开票',
            btns: [
              {
                btnName: '申请开票2',
                method: this.invoice,
                disabled: false,
              },
              {
                btnName: '退票2',
                method: this.invoice,
                disabled: false,
              },
            ],
            componentName: 'baseTable',//‘baseTable’为自定义单级表，‘multilevelTable’为自定义多级表
            tableConfigList: [
              {
                customColumn:[
                  {
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
                  }
                ],
                mergeTitle: [
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
                apiObj: {//组件使用的API和参数，参数如果已经赋值将成为固定参数，需要动态赋值的参数请勿提前赋值
                  apiName: 'listPageWarehouseOutDetailsDispatch',
                  params: {
                    queryStr: "detail.id in ('219967d2f6704d868b11002caef9885c')",
                  }
                },
                //显示序号
                showIndex: true,

                //显示选择器
                showCheckBox: false,

                //显示列控制器
                showTableSet: false,

                //开启下级
                expand: false,
                expandMode: 'none',//展开模式，'all'全部展开(默认)，'one'同级只能展开一个，默认第一条，'none'不自动展开；其中'all'模式下默认没有展开按钮，可设置showExpandBtn强制显示展开按钮

                // //表头样式
                // headerStyle: {
                //   'background-color': '#E4F3FA'
                // },
                // //行样式
                // rowStyle: {
                //   'background-color': '#E4F3FA',
                // },
              },
            ],
          },
          {
            label: '已退票',
            btns: [
              {
                btnName: '申请开票3',
                method: this.invoice,
                disabled: false,
              },
              {
                btnName: '退票3',
                method: this.invoice,
                disabled: false,
              },
            ],
            componentName: 'baseTable',//‘baseTable’为自定义单级表，‘multilevelTable’为自定义多级表
            tableConfigList: [
              {
                customColumn:[
                  {
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
                  }
                ],
                mergeTitle: [
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
                apiObj: {//组件使用的API和参数，参数如果已经赋值将成为固定参数，需要动态赋值的参数请勿提前赋值
                  apiName: 'listPageWarehouseOutDetailsDispatch',
                  params: {
                    queryStr: "detail.id in ('219967d2f6704d868b11002caef9885c')",
                  }
                },
                //显示序号
                showIndex: true,

                //显示选择器
                showCheckBox: false,

                //显示列控制器
                showTableSet: false,

                //开启下级
                expand: false,
                expandMode: 'none',//展开模式，'all'全部展开(默认)，'one'同级只能展开一个，默认第一条，'none'不自动展开；其中'all'模式下默认没有展开按钮，可设置showExpandBtn强制显示展开按钮

                // //表头样式
                // headerStyle: {
                //   'background-color': '#E4F3FA'
                // },
                // //行样式
                // rowStyle: {
                //   'background-color': '#E4F3FA',
                // },
              },
            ],
          },
        ],
      }
    },

    //子组件
    components: {
      searchBar,
      multiLabelTable
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
      databridge(data){
        console.log(data)
      },
      sendGuid(id) {
        this.guid = id
      },
      searchMap(data) {
        this.searchObj = data
        this.activeName > -1 && (this.tabs[this.activeName].tableConfigList[0].apiObj.params = Object.assign({},this.tabs[this.activeName].tableConfigList[0].apiObj.params,this.searchObj))
      },
      addChild(item,index,data) {
        console.log(item,index,data)
      },
      invoice(data){
        console.log(data)
      },
      //让组件调用本页面的方法
      callMethod(obj){
        obj && obj.methodName && this[obj.methodName](obj.params)
      },

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
  }

</script>

<style lang="scss" rel="text/css">
  .multiLabelTable {
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
