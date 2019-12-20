<template>
  <div class="qk-table">
    <custom-base-table
      ref="customBaseTable"
      :varList="varList"
      :showIndex="false"
      :showCheckBox="false"
      :customColumn="customColumn"
      :apiObj="setApiObj"
      :rowKey="'id'"
      @databridge="databridge"></custom-base-table>
  </div>
</template>

<script>
  //test
  import kanbanTableData from '@/data/kanbanTableData'

  //components
  import customBaseTable from "@/components/customTable/baseTable"


  export default {
    name: 'QkTable',
    //子组件
    components: {
      customBaseTable,
    },
    props: {
      value: {
        type: String,
        default: ''
      },
      readonly: {
        type: Boolean,
        default: false
      },
      item: {
        type: Object,
        default() {
          return null
        },
      },
    },
    data() {
      return {
        tableData: null,
        //table数据开始
        customColumn: [//自定义列
          {
            columnIndex: 'count',//列的prop
            /*通用属性*/
            componentName: 'input',//单元格组件类型，有'input','inputNumber','select','cascader','switch','time','date','dateTime'
            _cellConfig: {
              rules: [//验证规则
                // {type: 'code'},//规则类型，内置多种规则，详见@/utils/regexp.js
                // {required: true},//是否必填
                // {min:5,max:5},//长度范围
                /*greaterThan，lessThan为动态计算属性，以下为说明
                取值语法规则：
                  1.属性值只能为数组，数组内可以存放多个判断条件，用户输入的值必须同时大于或者小于这些条件，数组的最后一个值为Boolean，表示是否可以等于判断条件；
                  2.数组成员为字符串，由'所在对象@判断条件的K'组成，例如：'self@suggestCount'表示跟自己所处的行数据对象中的属性suggestCount的值比较大小；
                  3.如果需要跟祖先的某个值比较，则写为'所在对象@祖先距离自己的层级数@判断条件的K'，例如：'parent@1@count'表示跟距离自己1个层级的祖先元素中的count属性比较大小，即跟父级元素中的count属性比较大小；
                  4.所在对象有四种，tempData表示外部传入的对象，self表示所处对象，parent表示祖先，sibling表示所处对象的兄弟元素，但是sibling会取兄弟元素中的最大或者最小值，视具体的动态计算属性而定；
                验证规则计算功能：
                  1.取值规则同上，增加加减乘除的表示规则：(+)(-)(*)(/)；
                  2.示例：'self@suggestCount(+)parent@1@count'表示取自已所在对象的suggestCount属性加上父元素的count属性进行相加操作；
                  3.多计算的运行规则同四则运算，例如：'self@suggestCount(+)parent@1@count(*)self@suggestCount'会先相乘后相加；
                  4.注意引入兄弟元素进行计算的话，组件会取所有兄弟元素的值相加后参与运算*/
                //{greaterThan: ['self@suggestCount(+)parent@1@count(*)self@stockCount',true]},//大于某个值或某些值，可传入常量，也可通过传入self@[自身行数据对象的key]或parent@[父行数据对象的key]来动态取值
                //{greaterThan: ['self@productName(*)self@productSpec',true]},//大于某个值或某些值，可传入常量，也可通过传入self@[自身行数据对象的key]或parent@[父行数据对象的key]来动态取值
                {lessThan: ['tempData@count',false]},//小于某个值或某些值
                {lessThan: ['tempData@count(-)sibling@count',true]},//小于等于某个值或某些值
              ],
              message: ['须小于自定义的count','出库数量总和须小于等于自定义count'],//验证失败的提示语，与验证规则数组一一对应



              /* componentName为input时的专用属性 */
              icon: 'search',//输入框的图标
              // textarea: true,//是否为文本域，使用异步数据功能时无效
              // asyn: {//异步数据获取API,仅'input','select','cascader'类型可用
              //   apiName: 'getDictionarys',
              //   params: {dictionaryKey:'userType',isglobal:'1'}
              // },
              // valueKey: 'name',//异步数据返回后用于显示的key



              /* componentName为date时的专用属性 */
              //valueType: 'date',//数据显示类型，默认'date',可选'year/month/date/dates/week/datetime/datetimerange/daterange'
              //format: 'yyyy年MM月dd日',//数据显示的格式，
              //valueFormat: 'yyyy-MM-dd',//绑定值的格式，就是你想拿到的数据格式，不填默认为Date对象
              //placeholder: '选择日期',
              //editable: false,//是否可输入,默认不可输入
              //defaultValue: 'parent@1@count',//默认显示的时间，与compute互斥并且优先级较高，可动态取值或者传入静态常量，静态格式为'2018-11-12
              //compute: 'parent@1@count(+)1',//计算日期，与defaultValue互斥并且优先级较低,仅做日期的加减计算，并且是动态获取的日期加或者减一个整数，表示往后或者往前多少天
              //greaterThan: ['self@suggestCount','self@stockCount',true],//大于某个或某些日期，示例写法会动态取值，也可传入静态常量，格式必须为'2018-11-12',最后一个参数为boolean，为true表示可以大于等于
              //greaterThan: ['2018-11-13 17:30:33','self@stockCount',true],
              //lessThan: ['parent@1@count',true],//小于某个或某些日期，最后一个参数为boolean，为true表示可以小于等于
              /*快捷方式，共9种：昨天，今天，明天，上一周，下一周，上个月，下个月，上一年，下一年*/
              /*注意点：1.设置defaultValue，compute将使快捷选项无效*/
              /*注意点：2.设置greaterThan，lessThan时将使快捷选项的结果处在greaterThan，lessThan规定的范围*/
              //shortcuts: ['yesterday','today','tomorrow','lastWeek','nextWeek','lastMonth','nextMonth','lastYear','nextYear'],


              /* componentName为time时的专用属性 */
              /*使用率过低，待封装*/

              /* componentName为dateTime时的专用属性 */
              /*使用率过低，待封装*/

              /* componentName为select时的专用属性 */
              // asyn: {//异步数据获取API,仅'input','select','cascader'类型可用，优先级高于options
              //   apiName: 'getDictionarys',
              //   params: {dictionaryKey:'userType',isglobal:'1'}
              // },
              // options: [//静态选项，设置了asyn属性时无效
              //   {id:'1', label:'用户1'},
              //   {id:'2', label:'用户2',isdisable:'0'},
              //   {id:'3', label:'用户3'},
              //   {id:'4', label:'用户4'},
              //   {id:'5', label:'用户5'},
              // ],
            },
          },
          {
            columnIndex: 'udate',
            componentName: 'date',
            _cellConfig: {
              valueType: 'date',//数据显示类型，默认'date',可选'year/month/date/dates/week/datetime/datetimerange/daterange'
              format: 'yyyy年MM月dd日',//数据显示的格式，
              valueFormat: 'yyyy-MM-dd',//绑定值的格式，就是你想拿到的数据格式，不填默认为Date对象
              //placeholder: '选择日期',
              //editable: false,//是否可输入,默认不可输入
              //defaultValue: 'tempData@defaultDate',//默认显示的时间，与compute互斥并且优先级较高，可动态取值或者传入静态常量，静态格式为'2018-11-12
              //compute: 'parent@1@count(+)1',//计算日期，与defaultValue互斥并且优先级较低,仅做日期的加减计算，并且是动态获取的日期加或者减一个整数，表示往后或者往前多少天
              //greaterThan: ['self@suggestCount','self@stockCount',true],//大于某个或某些日期，示例写法会动态取值，也可传入静态常量，格式必须为'2018-11-12',最后一个参数为boolean，为true表示可以大于等于
              // greaterThan: ['2018-11-13 17:30:33','self@cdate',true],
              greaterThan: ['self@cdate',true],
              //lessThan: ['parent@1@count',true],//小于某个或某些日期，最后一个参数为boolean，为true表示可以小于等于
              lessThan: ['2019-7-31',false],//小于某个具体日期，最后一个参数为boolean，为true表示可以小于等于
              /*快捷方式，共9种：昨天，今天，明天，上一周，下一周，上个月，下个月，上一年，下一年*/
              /*注意点：1.设置defaultValue，compute将使快捷选项无效*/
              /*注意点：2.设置greaterThan，lessThan时将使快捷选项的结果处在greaterThan，lessThan规定的范围*/
              //shortcuts: ['yesterday','today','tomorrow','lastWeek','nextWeek','lastMonth','nextMonth','lastYear','nextYear'],
            }

          },
          {
            columnIndex: 'productGenreName',
            componentName: 'cascader',
            _cellConfig: {
              /* componentName为select时的专用属性 */
              asyn: {//异步数据获取API,仅'input','select','cascader'类型可用，优先级高于options
                apiName: 'getDictionarys',
                params: {dictionaryKey:'userType',isglobal:'1'}
              },
              // options: [//静态选项，设置了asyn属性时无效
              //   {id:'1', label:'用户1'},
              //   {id:'2', label:'用户2',disable:'0'},
              //   {id:'3', label:'用户3'},
              //   {id:'4', label:'用户4'},
              //   {id:'5', label:'用户5'},
              // ],
              rules: [//验证规则
                // {type: 'int'},//规则类型
                {required: true},//是否必填
              ],
              outputData: true,//是否将选中的数据抛出
              formulaName: '_formula',//公式key
            },
          },
          {
            /*单元格内容需要根据某种状态动态显示的示例*/
            columnIndex: 'progress',
            componentName: 'dynaContent',
            _cellConfig: {
              //配置项说明：
              //下述参数全部为可选项，但不允许出现空值情况，例如：states: ''
              //状态参数：四种值类型
              //前三种方式的值会产生三种状态，即小于，等于，大于；
              //第四种方式的值为数组项，组件会依次取出数组项进行比较，取第一个满足条件的数组项的下标来进行显示内容配置
              //方式一：常量，必须为数值
              // states: 0,
              //方式二：行数据的某个值
              states: 'self@count',
              //方式三：行数据的某些值的计算结果
              // states: 'self@count(*)self@productName',
              //方式四：设置数据状态的条件，只能为数组形式，注意行数据的取值前后多了#号
              // states: ['#self@progress#<0','#self@progress#===0','#self@progress#>0'],

              //显示内容配置，数组类型，应该与states的配置一一对应
              contentConfigs: [
                {
                  style: {//样式配置
                    color: 'rgb(228,13,8)',
                  },
                },
                {
                  // innerText: 'self@productUnitName',//可以取行数据里面某个属性值
                  innerText: '盘平'
                },

                //使用内置button组件
                // {
                //   componentName: 'button',
                //   _cellConfig: {
                //     name: '盘赢',
                //     methodName: 'switchEvent',
                //   },
                // },

                //使用内置tag组件
                {
                  componentName: 'tag',
                  _cellConfig: {
                    success: {
                      state: '3',
                      text: '审核通过',
                      // color: '#199ED7'//自定义，可选！
                    },
                    info: {
                      state: '-1',
                      text: '已过期',
                    },
                    warning: {
                      state: '1',
                      text: '已退回',
                    },
                    danger: {
                      state: '2',
                      text: '已拒绝',
                    },
                    default: {
                      state: '0',
                      text: '审核中',
                    }
                  },
                },

                //使用内置cascader组件
                // {
                //   componentName: 'cascader',
                //   _cellConfig: {
                //     /* componentName为select时的专用属性 */
                //     asyn: {//异步数据获取API,仅'input','select','cascader'类型可用，优先级高于options
                //       apiName: 'getDictionarys',
                //       params: {dictionaryKey:'userType',isglobal:'1'}
                //     },
                //     // options: [//静态选项，设置了asyn属性时无效
                //     //   {id:'1', label:'用户1'},
                //     //   {id:'2', label:'用户2',disable:'0'},
                //     //   {id:'3', label:'用户3'},
                //     //   {id:'4', label:'用户4'},
                //     //   {id:'5', label:'用户5'},
                //     // ],
                //     rules: [//验证规则
                //       // {type: 'int'},//规则类型
                //       {required: true},//是否必填
                //     ],
                //     outputData: false,//是否将选中的数据抛出
                //     // formulaName: '_formula',//公式key
                //   },
                // },

                //使用内置steps组件
                // {
                //   componentName: 'steps',
                //   _cellConfig: {
                //     componentConfig: {
                //       titleList: ['待审核','待出库','待发货','已发货','已完成'],//el-steps组件需要的步骤列表
                //       //titleBackgroundColor: ['rgb(0,176,240)','rgb(255,192,0)','rgb(191,191,191)'],//固定为三种颜色，超过行数据状态值时，等于行数据状态值时，未超过行数据状态值时。数组内值必须是可以直接生效的，例如：'red','#ffffff','rgb(250,250,0)'
                //     },
                //   },
                // },

                //使用内置date组件
                // {
                //   componentName: 'date',
                //   _cellConfig: {
                //     valueType: 'date',//数据显示类型，默认'date',可选'year/month/date/dates/week/datetime/datetimerange/daterange'
                //     format: 'yyyy年MM月dd日',//数据显示的格式，
                //     valueFormat: 'yyyy-MM-dd',//绑定值的格式，就是你想拿到的数据格式，不填默认为Date对象
                //     //placeholder: '选择日期',
                //     //editable: false,//是否可输入,默认不可输入
                //     //defaultValue: 'tempData@defaultDate',//默认显示的时间，与compute互斥并且优先级较高，可动态取值或者传入静态常量，静态格式为'2018-11-12
                //     //compute: 'parent@1@count(+)1',//计算日期，与defaultValue互斥并且优先级较低,仅做日期的加减计算，并且是动态获取的日期加或者减一个整数，表示往后或者往前多少天
                //     //greaterThan: ['self@suggestCount','self@stockCount',true],//大于某个或某些日期，示例写法会动态取值，也可传入静态常量，格式必须为'2018-11-12',最后一个参数为boolean，为true表示可以大于等于
                //     // greaterThan: ['2018-11-13 17:30:33','self@cdate',true],
                //     greaterThan: ['self@udate',true],
                //     //lessThan: ['parent@1@count',true],//小于某个或某些日期，最后一个参数为boolean，为true表示可以小于等于
                //     lessThan: ['2019-11-31',false],//小于某个具体日期，最后一个参数为boolean，为true表示可以小于等于
                //     /*快捷方式，共9种：昨天，今天，明天，上一周，下一周，上个月，下个月，上一年，下一年*/
                //     /*注意点：1.设置defaultValue，compute将使快捷选项无效*/
                //     /*注意点：2.设置greaterThan，lessThan时将使快捷选项的结果处在greaterThan，lessThan规定的范围*/
                //     //shortcuts: ['yesterday','today','tomorrow','lastWeek','nextWeek','lastMonth','nextMonth','lastYear','nextYear'],
                //   },
                // },

                //使用内置dateTime组件
                // {
                //   componentName: 'dateTime',
                // },

                //使用内置time组件
                // {
                //   componentName: 'time',
                // },

                //使用内置input组件
                // {
                //   componentName: 'input',
                //   _cellConfig: {
                //
                //   },
                // },

                //使用内置select组件(未完成，有BUG，请使用cascader组件代替)
                // {
                //   componentName: 'select',
                //   _cellConfig: {
                //     /* componentName为select时的专用属性 */
                //     asyn: {//异步数据获取API,仅'input','select','cascader'类型可用，优先级高于options
                //       apiName: 'getDictionarys',
                //       params: {dictionaryKey:'userType',isglobal:'1'}
                //     },
                //     // options: [//静态选项，设置了asyn属性时无效
                //     //   {id:'1', label:'用户1'},
                //     //   {id:'2', label:'用户2',disable:'0'},
                //     //   {id:'3', label:'用户3'},
                //     //   {id:'4', label:'用户4'},
                //     //   {id:'5', label:'用户5'},
                //     // ],
                //     rules: [//验证规则
                //       // {type: 'int'},//规则类型
                //       {required: true},//是否必填
                //     ],
                //     outputData: false,//是否将选中的数据抛出
                //     // formulaName: '_formula',//公式key
                //   },
                // },


              ],

              compute: 'self@count(*)self@productName',//计算取值属性
              hideTitle: true,
              titleStyle: {},
            }
          },
          {
            columnIndex: 'productName',
            componentName: 'input',
            width: 300,
            _cellConfig: {
              //compute:'self@count(*)self@productName',
              rules: [//验证规则
                // {type: 'int'},//规则类型
                {regexp: /\d/g}
              ],
              message: ['必须为数字'],//验证失败的提示语，与验证规则数组一一对应
            }
          },
          {
            columnIndex: 'warehouseOutCode',
            componentName: 'steps',
            _cellConfig: {
              titleStyle: {//格式为css样式,使用组件不能设置bodyStyle
                'font-weight': 600,
              },
              componentConfig: {
                titleList: ['待审核','待出库','待发货','已发货','已完成'],//el-steps组件需要的步骤列表
                //titleBackgroundColor: ['rgb(0,176,240)','rgb(255,192,0)','rgb(191,191,191)'],//固定为三种颜色，超过行数据状态值时，等于行数据状态值时，未超过行数据状态值时。数组内值必须是可以直接生效的，例如：'red','#ffffff','rgb(250,250,0)'
              },
            }
          },
          {
            columnIndex: 'productCode',
            componentName: 'progress',
            _cellConfig: {
              titleStyle: {//格式为css样式,使用组件不能设置bodyStyle
                'font-weight': 600,
                color: '#FF9900'
              },
              componentConfig: {
                'text-inside': true,//设置el-progress组件百分比内显
                'stroke-width': 18,//设置el-progress组件高度
                color: '#009933',//设置el-progress组件背景色
                'show-text': true,//是否显示进度条文字内容
                baseValue: 'count',//进度条100%情况下的基准值，不设置默认为100，设置数字的话直接取值，也可设置为行数据中的某个值进行动态取值
                showInitValue: false,//是否显示原始行数据内容
                width: 200,//进度条总宽度
              },
            }
          },
          {
            columnIndex: 'cdate',
            width: '140',
            componentName: 'tag',
            _cellConfig: {
              //tag组件默认可以表示5种状态：success/info/warning/danger/default，或者不用默认的，自行设置颜色
              success: {
                state: '3',
                text: '审核通过',
                // color: '#199ED7'//自定义，可选！
              },
              info: {
                state: '-1',
                text: '已过期',
              },
              warning: {
                state: '1',
                text: '已退回',
              },
              danger: {
                state: '2',
                text: '已拒绝',
              },
              default: {
                state: '0',
                text: '审核中',
              }
            }
          },{
            columnIndex: 'productSpec',
            _cellConfig:{
              bodyStyle: {
                color: '#199ED4',
                'font-weight': 600
              },
              events: {
                type: 'navigation',//事件类型，简单点说就是要做什么
                path: 'encapsulation/treeFormTable'
              },
              hideTitle: true
            }
          },
          {
            columnIndex: 'last',
            prop: 'operate',
            label: '操作',

            //component有新旧两种传参方式，新方式为数组，
            componentName: 'button',
            //方式一：
            component: [
              {
                name: '新增',
                nameEn: 'add',
                editBtns_isShow: true,
                icon: 'add',
                method: this.addChild //自定义按钮方法-新增
              },
              {
                name: '删除',
                nameEn: 'delete',
                editBtns_isShow: true,
                icon: 'delete',
                plain: true,
                state: true,
                method: this.deleteAllRow//自定义按钮方法-删除
              },
              {
                name: '删除',
                nameEn: 'delete',
                editBtns_isShow: true,
                icon: 'delete',
                plain: true,
                state: true,
                method: this.deleteAllRow//自定义按钮方法-删除
              },
              {
                name: '删除',
                nameEn: 'delete',
                editBtns_isShow: true,
                icon: 'delete',
                plain: true,
                state: true,
                method: this.deleteAllRow//自定义按钮方法-删除
              }
            ],
            //方式二：
            // component: operateBtns
          }
        ],
        apiObj: {//组件使用的API
          apiName: 'listPageWarehouseOutDetailsDispatch',
          params: {
            pageNo: 1,
            queryStr: "detail.id in ('219967d2f6704d868b11002caef9885c')"
          }
        },
        mergeTitle: [
          {
            index: 4,
            alias: '合并后的列',//列头的别名
            columns: ['productUnitName', 'warehouseOutCode', 'productCode'],
            width: 450
          }
        ],
        mergeColumn: [],
        mergeRow: [],
        keyMapping: {
          resultKey: {
            'P': 'productName'
          },
          variableKey: {
            'N': 'productSpec'
          }
        },
        varList: [],
        tempList: [],
        tempData: {
          count: 100,
          defaultDate: '2019-01-21'
        },
        pushIndex: 1,
        tempItem: null,

      }
    },
    computed:{
      showIndex(){
        return this.tableData && this.item.config?this.item.config.showIndex:false
      },
      colConfigs(){
        return this.tableData?this.tableData.titleList:[]
      },
      dataList(){
        return this.tableData?this.tableData.tableData:[]
      },
      setApiObj(){

      },
    },
    watch: {
      // userValue() {
      //   this.$emit('value-bus', {value: this.userValue, uuid: this.item.uuid})
      // }
    },
    methods:{
      indexMethod(index) {
        return index + 1
      },
      rowClassName(row,index){
        console.log(row,index)
      },
      databridge(){
        return
      },
    },
    created(){
      console.log(this.item)
      console.log(kanbanTableData)
    },
  }
</script>

<style lang="scss" scoped>
  .qk-table {
    position: relative;
    height: 100%;
    font-weight: inherit;
    color: inherit;
    text-align: inherit;
    /*.qk-table-item {*/
      /*display: block;*/
      /*width: 100%;*/
      /*height: 100%;*/
      /*outline: none;*/
      /*border: none;*/
      /*background-color: transparent;*/
      /*font-weight: inherit;*/
      /*color: inherit;*/
      /*text-align: inherit;*/
    /*}*/
  }
</style>
