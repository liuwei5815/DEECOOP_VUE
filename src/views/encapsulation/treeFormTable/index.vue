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
      <tree-form-table
        ref="treeFormTable"
        :expand-all="true"
        :initData="initData"
        :configs="tableSets"
        :currentpage.sync="currentpage"
        :customColumn="customColumn"
        :editable="editable"
        :precision="precision"
        :apiObj="apiObj"
        :addedData="addedData"
        :deleteKey="'index'"
        :childHeight="100"
        @get-data="formData"
        @send-children-row="sendChildrenRow"
        @databridge="databridge"></tree-form-table>
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
  import treeFormTable from "@/components/treeFormTable"
  import searchBar from '@/components/searchBar'


  import {
    listPageLogInfo, //分页列表查询查询
    updateDisableLogInfo, //启用禁用功能
    addLogInfo, //新增功能
    exportExcelLogInfos,//Excel导出
    updateLogInfo, //修改功能
    deleteLogInfos //批量删除功能
  } from '@/api/logInfo'

  //table操作栏里面的按钮
  const operateBtns = {
    props: ['colConfig'],
    template: `<el-table-column :label="colConfig.label" align="center">
      					<div slot-scope="scope" class="btnBox">
      							<el-button  type="text" class="btns" style="font-size: 12px;" :disabled="scope.row.isdisable==='0'" @click="colConfig.addChild(scope.row,scope.$index)">新增下级</el-button>
      							<el-button  type="text" class="btns" style="font-size: 12px;" :disabled="scope.row.isdisable==='0'" @click="colConfig.delete(scope.row,scope.$index,scope)">删除</el-button>
      					</div>
    				</el-table-column>`
  }

  const operateLayer1 = {
    props: ['colConfig'],
    template: `<el-table-column :label="colConfig.label" align="center">
      					<div slot-scope="scope" class="btnBox">
      							<el-button  type="text" class="btns" style="font-size: 12px;" :disabled="scope.row.isdisable==='0'" @click="colConfig.addChild(scope.row,scope.$index)">新增下级</el-button>
      							<el-button  type="text" class="btns" style="font-size: 12px;" :disabled="scope.row.isdisable==='0'" @click="colConfig.delete(scope.row,scope.$index,scope)">删除</el-button>
      					</div>
    				</el-table-column>`
  }


  export default {

    data() {
      return {
        //region
        initData: {},
        childrenDialogTitleList:[
          [{
            label: '物料名称',
            type: 'input',
            mapKey: 'materialName',
            options: null,
            placeholder: '请输入'
          },
            {
              label: '规格型号',
              type: 'input',
              mapKey: 'model',
              options: null,
              placeholder: '请输入'
            },
            {
              label: '计量单位',
              type: 'input',
              mapKey: 'unit',
              options: null,
              placeholder: '请输入'
            },
            {
              label: '物料来源',
              type: 'select',
              mapKey: 'source',
              options: {
                disabled: false,
                clearable: true,
                multiple: true,
                filterable: false,
                name: '',
                'default-first-option': false,
                options: [{
                  value: 1,
                  label: '外购'
                },{
                  value: 2,
                  label: '外协'
                },{
                  value: 3,
                  label: '自生产'
                },
                ]},
              placeholder: '请选择',
            },
            {
              label: '物料比例',
              type: 'input',
              mapKey: 'ratio',
              options: null,
              placeholder: '请输入'
            }],
          [{
            label: '详细名称',
            type: 'input',
            mapKey: 'materialName',
            options: null,
            placeholder: '请输入'
          },
            {
              label: '规格型号',
              type: 'input',
              mapKey: 'model',
              options: null,
              placeholder: '请输入'
            },
            {
              label: '计量单位',
              type: 'input',
              mapKey: 'unit',
              options: null,
              placeholder: '请输入'
            },
            {
              label: '物料来源',
              type: 'select',
              mapKey: 'source',
              options: {
                disabled: false,
                clearable: true,
                multiple: true,
                filterable: false,
                name: '',
                'default-first-option': false,
                options: [{
                  value: 1,
                  label: '外购'
                },{
                  value: 2,
                  label: '外协'
                },{
                  value: 3,
                  label: '自生产'
                },
                ]},
              placeholder: '请选择',
            }],
        ],
        fromTemp: {},
        showDialog: false,
        dialogVisible: false,
        dialogCallBackData: null,
        baseLayer: 0,

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
        guid: '',
        currentpage: 1,
        searchObj: {},
        titleList: [],
        pageData: {},
        childrenData: {},
        customColumn: {
          '0':[{
            columnIndex: 'last',
            prop: 'operate',
            label: '操作',
            component: operateBtns,
            addChild: this.addChild,
            delete: this.deleteAllRow
          }],
          '1':[{
            columnIndex: 'last',
            prop: 'operate',
            label: '操作',
            component: operateBtns,
            addChild: this.addChild,
            delete: this.deleteAllRow
          }],
        },
        tableSets: {
          '0': {
            showCheckBox: false,
            showIndex: true,
            expandOne: false,
            isSortable: false,
          },
          '1': {
            showCheckBox: true,
            showIndex: true,
            isSortable: false,
            isSingle: true
          }
        },
        expandTableApiList: ['listPageWarehouseOutDetailsDispatch','listPageLogInfo','listPageLogInfo','listPageLogInfo','listPageLogInfo','listPageLogInfo'],
        expandTableApiParams: [
          {id:'1001',pid:''},
          {businessId:'1002'},
          {businessType:'1003'},
          {layer:''},
          {type:''},
          {userCode:''}
        ],
        initParams: {},
        updateViewData: {},

        //new start
        //可编辑单元格配置，有两种方法配置方式，见下：
        //第一种（简易模式）：数组形式，数组项为行数据对象的属性名，此模式下没有输入验证/异步数据获取/自动计算功能
        //editable: ['code','stockCount'],
        //第二种（复杂模式）：对象形式，对象成员名为行数据对象的属性名
        editable: {
          code: {
            /*通用属性*/
            type: 'select',//单元格组件类型，有'input','inputNumber','select','cascader','switch','time','date','dateTime'
            rules: [//验证规则
              //{type: 'code'},//规则类型
              //{required: true},//是否必填
              //{min:5,max:5},//长度范围
              /*greaterThan，lessThan为动态计算属性，以下为说明
              取值语法规则：
                1.属性值只能为数组，数组内可以存放多个判断条件，用户输入的值必须同时大于或者小于这些条件，数组的最后一个值为Boolean，表示是否可以等于判断条件；
                2.数组成员为字符串，由'所在对象@判断条件的K'组成，例如：'self@suggestCount'表示跟自己所处的行数据对象中的属性suggestCount的值比较大小；
                3.如果需要跟祖先的某个值比较，则写为'所在对象@祖先距离自己的层级数@判断条件的K'，例如：'parent@1@count'表示跟距离自己1个层级的祖先元素中的count属性比较大小，即跟父级元素中的count属性比较大小；
                4.所在对象有三种，self表示所处对象，parent表示祖先，sibling表示所处对象的兄弟元素，但是sibling会取兄弟元素中的最大或者最小值，视具体的动态计算属性而定；
              验证规则计算功能：
                1.取值规则同上，增加加减乘除的表示规则：(+)(-)(*)(/)；
                2.示例：'self@suggestCount(+)parent@1@count'表示取自已所在对象的suggestCount属性加上父元素的count属性进行相加操作；
                3.多计算的运行规则同四则运算，例如：'self@suggestCount(+)parent@1@count(*)self@suggestCount'会先相乘后相加；
                4.注意引入兄弟元素进行计算的话，组件会取所有兄弟元素的值相加后参与运算*/
              //{greaterThan: ['self@suggestCount(+)parent@1@count(*)self@stockCount',true]},//大于某个值或某些值，可传入常量，也可通过传入self@[自身行数据对象的key]或parent@[父行数据对象的key]来动态取值
              //{lessThan: ['parent@1@count',false]},//小于某个值或某些值
            ],
            message: ['必须为字母或数字','','须大于取货数量','须小于出库数量'],//验证失败的提示语，与验证规则数组一一对应



            /* type为input时的专用属性 */
            //icon: 'search',//输入框的图标
            //textarea: true,//是否为文本域，使用异步数据功能时无效
            // asyn: {//异步数据获取API,仅'input','select','cascader'类型可用
            //   apiName: 'getDictionarys',
            //   params: {dictionaryKey:'userType',isglobal:'1'}
            // },
            //valueKey: 'name',//异步数据返回后用于显示的key



            /* type为date时的专用属性 */
            valueType: 'date',//数据显示类型，默认'date',可选'year/month/date/dates/week/datetime/datetimerange/daterange'
            format: 'yyyy年MM月dd日',//数据显示的格式，
            valueFormat: 'yyyy-MM-dd',//绑定值的格式，就是你想拿到的数据格式，不填默认为Date对象
            placeholder: '选择日期',
            editable: false,//是否可输入,默认不可输入
            //defaultValue: 'parent@1@count',//默认显示的时间，与compute互斥并且优先级较高，可动态取值或者传入静态常量，静态格式为'2018-11-12
            //compute: 'parent@1@count(+)1',//计算日期，与defaultValue互斥并且优先级较低,仅做日期的加减计算，并且是动态获取的日期加或者减一个整数，表示往后或者往前多少天
            //greaterThan: ['self@suggestCount','self@stockCount',true],//大于某个或某些日期，示例写法会动态取值，也可传入静态常量，格式必须为'2018-11-12',最后一个参数为boolean，为true表示可以大于等于
            greaterThan: ['2018-11-13 17:30:33','self@stockCount',true],
            lessThan: ['parent@1@count',true],//小于某个或某些日期，最后一个参数为boolean，为true表示可以小于等于
            /*快捷方式，共9种：昨天，今天，明天，上一周，下一周，上个月，下个月，上一年，下一年*/
            /*注意点：1.设置defaultValue，compute将使快捷选项无效*/
            /*注意点：2.设置greaterThan，lessThan时将使快捷选项的结果处在greaterThan，lessThan规定的范围*/
            shortcuts: ['yesterday','today','tomorrow','lastWeek','nextWeek','lastMonth','nextMonth','lastYear','nextYear'],


            /* type为time时的专用属性 */
            /*使用率过低，待封装*/

            /* type为dateTime时的专用属性 */
            /*使用率过低，待封装*/

            /* type为select时的专用属性 */
            // asyn: {//异步数据获取API,仅'input','select','cascader'类型可用，优先级高于options
            //   apiName: 'getDictionarys',
            //   params: {dictionaryKey:'userType',isglobal:'1'}
            // },
            options: [//静态选项，设置了asyn属性时无效
              {id:'1', label:'用户1'},
              {id:'2', label:'用户2',isdisable:'0'},
              {id:'3', label:'用户3'},
              {id:'4', label:'用户4'},
              {id:'5', label:'用户5'},
            ],



          },


          stockCount: {
            type: 'select',
            asyn: {//异步数据获取API,仅'input','select','cascader'类型可用
              apiName: 'getDictionarys',
              params: {dictionaryKey:'userType',isglobal:'1'}
            },

          },

          /*单元格内容需要自动计算时的示例*/
          suggestCount: {
            type: 'input',
            compute:'self@code(+)parent@1@count(*)self@stockCount',
          }
        },
        precision:3,//计算精度，默认保留两位小数
        apiObj: {
          apiName: 'listPageWarehouseOutDetailsDispatch',
          params: {
            pageNo: 1,
            queryStr: "detail.id in ('219967d2f6704d868b11002caef9885c')"
          }
        },
        addedData: {},
        testData: {
          code:"33333333333",
          companyId:"02b02026270d4b6582b7bfc576e81971",
          id:"33",
          isdisable:"1",
          name:"33",
          pid:"219967d2f6704d868b11002caef9885c",
          productId:"",
          rowState:"1",
          stockCount:"999",
          suggestCount:"",
          warehouseId:"51c314b13c58421085beb3e280cbc122"
        }
      }
    },

    //子组件
    components: {
      treeFormTable,
      searchBar
    },

    /*生命周期函数开始*/
    //vue实例化之前
    beforeCreate() {

    },

    //vue实例化后调用
    created() {
      //this.initData = this.$storage.get('rootMenu')
      //this.initExpandTable()
      // this.$api['listPageWarehouseOutDispatch']().then(res => {
      //   console.log(res)
      //   this.initData = res.result
      // }).catch(err => {
      //
      // })

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
        //this.$refs.treeFormTable.upDateView()
      },
      formData(data) {
        console.log(data)
      },
      initExpandTable() {
        this.$api[this.expandTableApiList[0]](this.setParams(1,this.initParams,this.currentpage)).then(res => {
          this.initData = {
            row: null,
            layer:1,
            res,
            customColumn: this.customColumn
          }
        }).catch(err => {
          console.log(err)
        })
      },
      sendChildrenRow(row,layer,rowChain,key,currentpage){
        this.$api[this.expandTableApiList[layer-1]](this.setParams(layer,row,currentpage)).then(res => {
          this.childrenData = {
            row,
            layer,
            res,
            customColumn: this.customColumn
          }
        }).catch(err => {
          console.log(err)
        })
      },
      setParams(layer,row,currentpage) {
        const tempObj = this.expandTableApiParams[layer-1]
        for(const k in tempObj){
          if(tempObj.hasOwnProperty(k) && !tempObj[k]){
            tempObj[k] = row[k] || ''
          }
        }
        return Object.assign({},tempObj,this.searchObj,{pageNo:currentpage})
      },
      databridge(list){
        console.log(list)
      },



      sendGuid(id) {
        this.guid = id
      },
      searchMap(data) {
        console.log(data)
        this.searchObj = data
        //this.httpListPageLogInfo()
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
      addChild(item,index) {
        this.dialogCallBackData = item
        this.showDialog = true
        this.dialogVisible = true
      },
      addChildRow(){
        this.dialogVisible = false
        this.showDialog = false
        this.addedData = {
          rowData: this.testData,
          parentData: this.dialogCallBackData
        }
      },
      createBomTitle(layer,data,list){
        this.baseLayer++
        list.some(item => {
          if(this.baseLayer === layer){
            item.children = this.createTitleList(data)
            return true
          }else {
            if(item.children && item.children.length){
              this.searchBomTitle(item.children,layer)
            }
          }
        })
      },
      createTitleList(data){
        const tempArr = []
        for(let k in data){
          const tempObj = {
            prop: k,
            label: k
          }
          tempArr.push(tempObj)
        }
        return tempArr
      },

      searchBomTitle(list,layer){
        this.baseLayer++
        list.some(item => {
          if(this.baseLayer === layer){
            return item.children && item.children.length
          }else {
            if(item.children && item.children.length){
              this.searchBomTitle(item.children,layer)
            }
          }
        })
      },
      // createBomRow(layer,id,data){
      //   this.baseLayer = 0
      //   const state = this.searchBomTitle(this.colConfigs,layer)
      //   if(state){
      //
      //   }else {
      //     this.baseLayer = 0
      //     this.createBomTitle(layer,data,this.colConfigs)
      //   }
      // },
      deleteRow(item,index) {
        console.log(item)

      },
      deleteAllRow(item,index,all){
        console.log(item,index,all)
        this.updateViewData = {
          item,
          index,
          all,
          customColumn: this.customColumn
        }
      },
      editRow(item,index) {

      },
      // addChild() {
      //   console.log(this.fromTemp)
      //   this.createBomRow(this.dialogCallBackData.layer,this.dialogCallBackData.id,this.fromTemp)
      //   this.dialogVisible = false
      //   this.showDialog = false
      //   this.fromTemp = {}
      //   console.log(this.colConfigs)
      // }

    },

    //计算属性
    computed: {
      setFromLabelWidth(){
        if(this.dialogCallBackData){
          let width = ''
          switch (this.dialogCallBackData.layer){
            case 1:
              width = '80px'
              break
            case 2:
              width = '100px'
              break
            case 3:
              width = '100px'
              break
            default:
              width = '100px'
              break
          }
          return width
        }else {
          return '100px'
        }
      },
      dialogList() {
        if(this.dialogCallBackData){
          return this.childrenDialogTitleList[this.dialogCallBackData.layer-1]?this.childrenDialogTitleList[this.dialogCallBackData.layer-1]:this.childrenDialogTitleList[this.childrenDialogTitleList.length-1]
        }
      },
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
        this.initExpandTable()
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
