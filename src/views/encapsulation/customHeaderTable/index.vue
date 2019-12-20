<template>
  <div class="cascadeTable">
    <!--顶部搜索栏开始-->
    <search-bar
      v-if="searchList.length"
      :searchList="searchList"
      @search-map="searchMap"
      @send-guid="sendGuid"></search-bar>
    <!--顶部搜索栏结束-->

    <!--表格部分开始-->
    <el-row
      style="border: 1px solid #E4E4E4;border-bottom: none;margin-top: 10px;transition: height 0.4s;-webkit-transition: height 0.4s;-moz-transition: height 0.4s;"
      :style="{height: tableHeight+'px','margin-top': searchList.length?'10px':'0'}">
      <custom-row-table
        ref="treeFormTable"
        :expand-all="false"
        :keyValue="true"
        :configs="tableSets"
        :currentpage.sync="currentpage"
        :customColumn="customColumn"
        :editable="{}"
        :precision="precision"
        :apiObj="setApiObj"
        :mergeColumn="mergeColumn"
        @get-data="formData"
        @databridge="databridge"></custom-row-table>
    </el-row>
    <div style="position: absolute;top: 80px;left: 300px">
      <el-button @click="getData">getData</el-button>
    </div>

    <!--表格部分结束-->


    <template v-if="showDialog">
      <el-dialog
        title="新增下级"
        :visible.sync="dialogVisible"
        width="400px"
        :before-close="handleClose">
        <!--<el-form :model="fromTemp" style="width: 400px; margin: 20px auto;padding: 0 20px;">-->
          <!--<template v-for="(item,index) in dialogList">-->
            <!--<el-form-item :label="item.label" :label-width="setFromLabelWidth">-->
              <!--<template v-if="item.type === 'input'">-->
                <!--<el-input v-model="fromTemp[item.mapKey]" :placeholder="item.placeholder"></el-input>-->
              <!--</template>-->
              <!--<template v-else-if="item.type === 'select'">-->
                <!--<el-select v-model="fromTemp[item.mapKey]" :name="item.options.name" :disabled="item.options.disabled" :clearable="item.options.clearable" :multiple="item.options.multiple" :filterable="item.options.filterable" :default-first-option="item.options['default-first-option']" :placeholder="item.placeholder">-->
                  <!--<el-option-->
                    <!--v-for="childItem in item.options.options"-->
                    <!--:key="childItem.value"-->
                    <!--:label="childItem.label"-->
                    <!--:value="childItem.value">-->
                  <!--</el-option>-->
                <!--</el-select>-->
              <!--</template>-->
            <!--</el-form-item>-->
          <!--</template>-->
        <!--</el-form>-->
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addChildRow">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
            <el-button>上左</el-button>
          </el-tooltip>
        </span>
      </el-dialog>
    </template>
  </div>
</template>

<script>
  import customRowTable from "@/components/customRowTable"
  import searchBar from '@/components/searchBar'


  //table操作栏里面的按钮
  const operateBtns = {
    props: ['colConfig','scope'],
    template: `<div class="btnBox">
                <el-button  type="text" class="btns" style="font-size: 12px;" :disabled="scope.row.isdisable==='0'" @click="colConfig.addChild(scope.row,scope.$index,scope)">新增下级</el-button>
      				  <el-button  type="text" class="btns" style="font-size: 12px;" :disabled="scope.row.isdisable==='0'" @click="colConfig.deletes(scope.row,scope.$index,scope)">删除</el-button>
      				 </div>`
  }

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
        customColumn: {
          '0':[{
            columnIndex: 'last',
            prop: 'operate',
            label: '操作',
            component: operateBtns,
            addChild: this.addChild,
            deletes: this.deleteAllRow
          }],
          '1':[{
            columnIndex: 'last',
            prop: 'operate',
            label: '操作',
            component: operateBtns,
            addChild: this.addChild,
            deletes: this.deleteAllRow
          }],
        },
        tableSets: {
          '0': {
            showCheckBox: false,
            showIndex: true,
            expandOne: false,
            isSortable: false,
            showPageData: true,
          },
          '1': {
            showCheckBox: true,
            showIndex: true,
            isSortable: false,
            isSingle: true
          }
        },
        precision:3,//计算精度，默认保留两位小数
        apiObj: {//组件使用的API
          apiName: 'listPageWarehouseOutDetailsDispatch',
          params: {
            pageNo: 1,
            queryStr: "detail.id in ('219967d2f6704d868b11002caef9885c')"
          }
        },
        mergeColumn: {
          '0':[
              {
                index:1,
                columns: [
                  {
                    keyName: 'warehouseOutCode',
                    bodyStyle: {
                      color: '#199ED4',
                      'font-weight': 600
                    },
                    events: {
                      type: 'navigation',//事件类型，简单点说就是要做什么
                      path: 'encapsulation/treeFormTable'
                    }
                  }
                ],
              },
              {
            index: 2,
            columns: [
              'productGenreName',
              {
                keyName:'productUnitName',
                titleStyle: {
                  'font-weight': 600,
                  'font-size': '16px',
                  color: '#FF9900'
                },
                bodyStyle: {
                  color: '#199ED4',
                  'font-weight': 600
                },
              }],
          },
              {
                index: 4,
                alias: '合并后的列',//列头的别名
                columns: [
                'productName',
                {
                  keyName:'productSpec',
                  componentName: 'el-steps',//element组件的名称,
                  titleStyle: {//格式为css样式,使用组件不能设置bodyStyle
                    'font-weight': 600,
                  },
                  componentConfig: {
                    titleList: ['待审核','待出库','待发货','已发货','已完成'],//el-steps组件需要的步骤列表
                  },
                },{
                  keyName:'progress',
                  componentName: 'el-progress',//element组件的名称,
                  titleStyle: {//格式为css样式,使用组件不能设置bodyStyle
                    'font-weight': 600,
                    color: '#FF9900'
                  },
                  componentConfig: {
                    'text-inside': true,//设置el-progress组件百分比内显
                    'stroke-width': 18,//设置el-progress组件高度
                    color: '#009933',//设置el-progress组件背景色
                    'show-text': true,//是否显示进度条文字内容
                  },
                }],
              },
              {
              index:5,
              columns: [
                {
                  keyName: 'count',
                  componentName: 'el-input',//element组件的名称,
                  componentConfig: {
                    placeholder: '嘎嘎嘎',
                    type: 'text',
                    maxlength: '',
                    minlength: '',
                    clearable: true,
                    disabled: false || 'inputState',//直接设置为true可禁用，也可设置为行数据中的某个值，值必须为'0'或者'1'
                    size: 'small',// medium、large、small、mini
                    /*用户输入效验属性，属性值可以为字符串或对象，不能为数组*/
                    /*功能未完成，后续需要将table组件的用户输入功能（含验证和计算）独立封装，便于所有table组件复用*/
                    // rule: 'float',
                    rule: {
                      notEmpty: true,//非空
                      type:'float',//数据类型，详见utils/regexp.js
                    },
                  },
                  bodyStyle: {
                    color: '#000000',
                    'font-weight': 600
                  },
                  hideTitle: true
                }
              ],
            },
          ],
          '1':[
            {
              index: 3,
              alias: '进度',//列头的别名
              columns: [
                {
                  keyName:'stockCount',
                  componentName: 'el-progress',//element组件的名称,
                  titleStyle: {//格式为css样式,使用组件不能设置bodyStyle
                    'font-weight': 600,
                    color: '#FF9900'
                  },
                  componentConfig: {
                    'text-inside': false,//设置el-progress组件百分比内显
                    'stroke-width': 16,//设置el-progress组件高度
                    color: '#199ED4',//设置el-progress组件背景色
                    'show-text': true,//是否显示进度条文字内容
                    baseValue: 6,//进度条100%情况下的基准值，不设置默认为100
                    showInitValue: true,//是否显示原始条文字内容
                  },
                },
                {
                  keyName:'suggestCount',
                  componentName: 'el-progress',//element组件的名称,
                  titleStyle: {//格式为css样式,使用组件不能设置bodyStyle
                    'font-weight': 600,
                    color: '#FF9900'
                  },
                  componentConfig: {
                    'text-inside': false,//设置el-progress组件百分比内显
                    'stroke-width': 16,//设置el-progress组件高度
                    color: '#009933',//设置el-progress组件背景色
                    'show-text': true,//是否显示进度条文字内容
                    showInitValue: true,//是否显示原始文字内容
                  },
                },
              ],
            },
          ]
        },
      }
    },

    //子组件
    components: {
      customRowTable,
      searchBar
    },

    /*生命周期函数开始*/
    //vue实例化之前
    beforeCreate() {

    },

    //vue实例化后调用
    created() {

    },

    //挂载之前
    beforeMount() {

    },
    //真实DOM挂载后，仅限组件本身的挂载，如果存在子组件，并且需求子组件全部被挂载后进行操作，需使用vm.$nextTick顶替mounted（在mounted内部调用vm.$nextTick）；
    mounted() {


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
      getData(){
        this.$refs.treeFormTable.getData()
      },
      formData(data) {
        console.log(data)
      },
      databridge(list){
        console.log(list)
      },
      sendGuid(id) {
        this.guid = id
      },
      searchMap(data) {
        console.log(data)
        this.apiObj.params.pageNo = 1
        this.searchObj = data
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
            this.showDialog = false
            this.fromTemp = {}
          })
          .catch(_ => {});
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
      deleteRow(item,index) {
        console.log(item,index)
      },
      deleteAllRow(item,index,all){
        console.log(item,index,all)
      },
      editRow(item,index) {
        console.log(item,index)
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
      setApiObj(){
        const params = Object.assign({},this.apiObj.params,this.searchObj)
        return {
          apiName: this.apiObj.apiName,
          params
        }
      },
    },

    //观察者,可监听数据
    watch: {
      currentpage: function () {
        console.log(this.currentpage)
        this.apiObj.params.pageNo = this.currentpage
      },
      // searchObj: {
      //   handler(newValue, oldValue) {
      //     console.log(newValue)
      //   },
      //   deep: true
      // },
    }

  }

</script>

<style lang="scss" rel="text/css">
  .cascadeTable {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 0;
    box-sizing: border-box;
  }
</style>
