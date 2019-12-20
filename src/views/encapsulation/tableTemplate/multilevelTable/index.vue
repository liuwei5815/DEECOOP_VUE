<template>
  <div class="singleTable">
    <!--顶部搜索栏开始-->
    <search-bar
      v-if="searchList.length"
      :searchList="searchList"
      @search-map="searchMap"
      @send-guid="sendGuid"></search-bar>
    <!--顶部搜索栏结束-->

    <!--表格部分开始-->
    <el-row
      style="border-bottom: none;margin-top: 10px;transition: height 0.4s;-webkit-transition: height 0.4s;-moz-transition: height 0.4s;"
      :style="{height: tableHeight,'margin-top': searchList.length?'10px':'0'}">
      <multilevel-table
        ref="customBaseTable"
        :tableConfigList="tableConfigList"
        @databridge="databridge"
        @callmethod="callMethod"></multilevel-table>
    </el-row>
    <!--表格部分结束-->

    <!--表格功能按钮部分开始-->
    <div style="position: absolute;top: 60px;left: 100px">
      <el-button @click="getData">getData</el-button>
      <el-button @click="pushData">pushData</el-button>
      <el-button @click="updateData">updateData</el-button>
      <el-button @click="deleteData">deleteData</el-button>
      <el-input v-model="tableConfigList[0].tempData.count"></el-input>
    </div>
    <!--表格功能按钮部分结束-->


  </div>
</template>

<script>
  import searchBar from '@/components/searchBar'
  import multilevelTable from "@/components/customTable/multilevelTable"

  // 测试数据
  import testData from '@/data/customBaseTableData'

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
          ruleOps: {min: 6, max: 7},
          mapKey: 'goodsCode',
          configs: {},
          placeholder: '请输入编码',
        }, {
          label: '货品名称',
          type: 'input',
          ruleType: 'string',
          mapKey: 'goodsName',
          configs: {},
          placeholder: '请输入货物名'
        }, {
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
            }, {
              value: 2,
              label: '由远到近'
            }]
          },
          placeholder: '请选择'
        }, {
          label: '库存变动时间',
          type: 'select',
          mapKey: 'inventoryChangeTime',
          configs: {
            clearable: true,
            name: '',
            options: [{
              value: 1,
              label: '近3天内'
            }, {
              value: 2,
              label: '近一周内'
            }, {
              value: 3,
              label: '近一个月'
            }, {
              value: 4,
              label: '近三个月'
            }, {
              value: 5,
              label: '近一年'
            },
            ]
          },
          placeholder: '请选择',
        }, {
          label: '库存数量',
          type: 'cascader',
          mapKey: 'cascaded',
          configs: {
            clearable: true,
            apiName: 'getDictionarys',
            params: {dictionaryKey: 'userType', isglobal: '1'}
          },
          placeholder: '请选择'
        }, {
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
              //disabledDate: ['2018-09-15','2018-10-20']
              hidePicker: true
            }
          },
          placeholder: '请选择'
        }, {
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

        //table配置项开始
        tableConfigList: [
          {
            //表头开关
            showHeader: false,

            //自定义列
            customColumn: [//自定义列
              {
                columnIndex: 'count',//列的prop
                width: 200,
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
                    {lessThan: ['tempData@count', false]},//小于某个值或某些值
                    {lessThan: ['tempData@count(-)sibling@count', true]},//小于等于某个值或某些值
                  ],
                  message: ['须小于自定义的count', '出库数量总和须小于等于自定义count'],//验证失败的提示语，与验证规则数组一一对应


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
                  //edit:true,//开启计算功能后时间选择器默认禁用，设置edit属性为true可以强制启用
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
                  //edit:true,//开启计算功能后时间选择器默认禁用，设置edit属性为true可以强制启用
                  //greaterThan: ['self@suggestCount','self@stockCount',true],//大于某个或某些日期，示例写法会动态取值，也可传入静态常量，格式必须为'2018-11-12',最后一个参数为boolean，为true表示可以大于等于
                  // greaterThan: ['2018-11-13 17:30:33','self@cdate',true],
                  greaterThan: ['self@cdate', true],
                  //lessThan: ['parent@1@count',true],//小于某个或某些日期，最后一个参数为boolean，为true表示可以小于等于
                  lessThan: ['2019-1-31', false],//小于某个具体日期，最后一个参数为boolean，为true表示可以小于等于
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
                    params: {dictionaryKey: 'userType', isglobal: '1'}
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
                /*单元格内容需要自动计算时的示例*/
                columnIndex: 'progress',
                componentName: 'input',
                _cellConfig: {
                  compute: 'self@count(*)self@productName',
                }
              },
              {
                columnIndex: 'productName',
                componentName: 'switch',
                _cellConfig: {
                  methodName: 'switchEvent',
                  hideTitle: true
                }

                // componentName: 'input',
                // _cellConfig: {
                //   //compute:'self@count(*)self@productName',
                //   rules: [//验证规则
                //     // {type: 'int'},//规则类型
                //     {regexp: /\d/g}
                //   ],
                //   message: ['必须为数字'],//验证失败的提示语，与验证规则数组一一对应
                // }
              },
              {
                columnIndex: 'warehouseOutCode',
                componentName: 'steps',
                _cellConfig: {
                  titleStyle: {//格式为css样式,使用组件不能设置bodyStyle
                    'font-weight': 600,
                  },
                  componentConfig: {
                    titleList: ['待审核', '待出库', '待发货', '已发货', '已完成'],//el-steps组件需要的步骤列表
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
              },
              // {
              //   columnIndex: 'productSpec',
              //   width: 260,
              //   _cellConfig: {
              //     bodyStyle: {
              //       color: '#199ED4',
              //       'font-weight': 600
              //     },
              //     events: {
              //       type: 'navigation',//事件类型，简单点说就是要做什么
              //       path: 'encapsulation/treeFormTable'
              //     },
              //     hideTitle: true
              //   }
              // },
              //文件上传功能
              {
                columnIndex: 'productSpec',
                componentName: 'upload',
                width: 260,
                _cellConfig: {
                  action:  process.env['BASE_API'] + '接口',
                  //下面两个参数设置了limit就可不设置multiple
                  multiple: false,//是否多文件上传
                  limit: 1,//最大允许上传个数
                  data: {},//文件上传时携带的参数
                  name: 'xxx',//文件上传时使用的名字，必须是字符串，可通过函数返回字符串的方式自定义名称
                  disabled: false,//是否禁用上传功能
                  btnName: '上传附件',//按钮名称
                }
              },
              {
                columnIndex: 'last',
                prop: 'operate',
                label: '操作',
                componentName: 'button',
                //方式一：
                component: [
                  {
                    name: '新增',
                    nameEn: 'add',
                    editBtns_isShow: true,
                    //行数据控制按钮的写法格式，注意行数据的首尾需要加#号
                    rowState: '#self@isdisable#===1 || #self@isdisable#===2',
                    method: this.reviseData //自定义按钮方法-新增
                  },
                  {
                    name: '删除1',
                    nameEn: 'delete1',
                    editBtns_isShow: true,
                    //行数据控制按钮的写法格式，注意行数据的首尾需要加#号
                    rowState: '#self@count#===10',
                    method: this.deleteAllRow//自定义按钮方法-删除
                  },
                  {
                    name: '删除2',
                    nameEn: 'delete2',
                    editBtns_isShow: true,
                    //行数据控制按钮的写法格式，注意行数据的首尾需要加#号
                    rowState: '#self@count#===9',
                    method: this.deleteAllRow//自定义按钮方法-删除
                  },
                  {
                    name: '删除3',
                    nameEn: 'delete3',
                    editBtns_isShow: true,
                    //行数据控制按钮的写法格式，注意行数据的首尾需要加#号
                    rowState: '#self@count#===10',
                    method: this.deleteAllRow//自定义按钮方法-删除
                  }
                ],
              }
            ],

            //给单元格内容添加后缀，对象里面的成员的key为行数据的key，成员的值为对象，是相关配置项
            postfix: {
              productSpec: {
                expression: '#self@progress#>15',//表达式，取行数据进行运算，最终结果为true或false
                //三种类型：icon|text|rowData
                //icon配置如下
                type: 'icon',
                //后缀的内容配置，是一个数组，如果只有一项，则会在表达式结果为true的时候显示配置；如果有两项，则在表达式为true时显示第一项配置，为false时显示第二项配置
                contentConfigs: [
                  {
                    content: 'change',//图标名称，图标需为svg格式，需在src/icons/svg文件夹中存在
                    style: {//样式，icon情况下仅能控制颜色
                      color: 'red',
                      width: '1.5em',
                      height: '1.5em',
                      position: 'absolute',
                      top: '50%',
                      left: 0,
                      transform: 'translate(0,-70%)',
                    },
                  },
                ],
              },
              productUnitName: {
                expression: '#self@productName#>0',//表达式，取行数据进行运算，最终结果为true或false
                //三种类型：icon|text|rowData
                //text配置如下
                type: 'text',
                //后缀的内容配置，是一个数组，如果只有一项，则会在表达式结果为true的时候显示配置；如果有两项，则在表达式为true时显示第一项配置，为false时显示第二项配置
                contentConfigs: [
                  {
                    content: ' 我是后缀',//文本内容
                    style: {//样式
                      color: 'red',
                      'padding-left': '5px',
                      'font-weight': 'bold',
                    },
                  },
                ],
              },
              warehouseOutCode: {
                expression: '#self@productName#<1',//表达式，取行数据进行运算，最终结果为true或false
                //三种类型：icon|text|rowData
                //rowData配置如下
                type: 'rowData',
                //后缀的内容配置，是一个数组，如果只有一项，则会在表达式结果为true的时候显示配置；如果有两项，则在表达式为true时显示第一项配置，为false时显示第二项配置
                contentConfigs: [
                  {
                    content: 'self@remark',//行数据的取值表达式或者计算式
                    style: {//样式
                      color: 'orange',
                      'padding-left': '10px',
                      'font-weight': 'bold',
                    },
                  },
                ],
              },
              productCode: {
                expression: '#self@productName#<1',//表达式，取行数据进行运算，最终结果为true或false
                //三种类型：icon|text|rowData
                //icon配置如下
                type: 'icon',
                //后缀的内容配置，是一个数组，如果只有一项，则会在表达式结果为true的时候显示配置；如果有两项，则在表达式为true时显示第一项配置，为false时显示第二项配置
                contentConfigs: [
                  {
                    content: 'change',//图标名称，图标需为svg格式，需在src/icons/svg文件夹中存在
                    style: {//样式，icon情况下仅能控制颜色
                      color: 'red',
                      width: '1.5em',
                      height: '1.5em',
                      position: 'absolute',
                      top: '50%',
                      left: 0,
                      transform: 'translate(0,-70%)',
                    },
                  },
                ],
              },
            },

            //数据接口
            apiObj: {//组件使用的API
              apiName: 'getBomTreeProduct',
              params: {}
            },

            //合并列
            mergeTitle: [
              {
                index: 4,
                alias: '合并后的列',//列头的别名
                columns: ['productUnitName', 'warehouseOutCode', 'productCode'],
                width: 400,
              }
            ],

            //公式计算指定
            keyMapping: {
              resultKey: {
                'P': 'productName'
              },
              variableKey: {
                'N': 'productSpec'
              }
            },

            //外部数据
            tempData: {
              count: 100,
              defaultDate: '2019-01-21'
            },

            //是否使用统计功能
            useSummary: true,
            //自定义统计功能面板
            customSummary: {
              component: {
                props: ['data', 'setStyle'],
                template: `<ul class="clearfix" :style="setStyle">
                      <li style="float: left;width: 50%"><span>订单金额：</span><span>￥{{data.orderAmount}}</span></li>
                      <li style="float: left;width: 50%"><span>应收款：</span><span>￥{{(data.orderAmount - data.rebateAmount - data.accepted)||'计算错误'}}</span></li>
                      <li style="float: left;width: 50%" class="inputStyle">
                        <span>折扣金额：</span>
                        <span>￥
                          <el-form inline inline-message :model="data" ref="numberValidateForm" label-width="0">
                            <el-form-item prop="rebateAmount" :rules="[{ type: 'number', message: '必须为数字值'}]">
                              <el-input v-model.number="data.rebateAmount" size="mini" placeholder="请输入"></el-input>
                            </el-form-item>
                          </el-form>
                        </span>
                      </li>
                      <li style="float: left;width: 50%"><span style="color: red">逾期金额：</span><span>￥{{data.overdueAmount}}</span></li>
                      <li style="float: left;width: 50%"><span>已收款：</span><span>￥{{data.accepted}}</span></li>
                      <li style="float: left;width: 50%"><span>开票金额：</span><span>￥{{data.invoice}}</span></li></ul>`,
              },
              data: {
                orderAmount: '1',
                receivable: '',
                rebateAmount: '5',
                overdueAmount: '',
                accepted: '',
                invoice: '',
              },
              boxStyle: {//统计面板的根样式
                width: '500px',
                float: 'left',
                padding: '10px'
              },
              // apiObj: {//远程数据获取接口，注意与计算属性互斥
              //   apiName: '',
              //   params: {},
              // },
              computes: { //从表中求和属性，注意与远程数据互斥
                orderAmount: 'table@productName',
                accepted: 'table@count'
              }
            },

            //显示序号
            showIndex: true,

            //显示选择器
            showCheckBox: false,

            //显示列控制器
            showTableSet: false,

            //组件内部名称
            componentId: 'multilevelTable',

            //开启下级
            expand: true,
            expandMode: 'none',//展开模式，'all'全部展开(默认)，'one'同级只能展开一个，默认第一条，'none'不自动展开；其中'all'模式下默认没有展开按钮，可设置showExpandBtn强制显示展开按钮

            //表头样式
            headerStyle: {
              'background-color': '#E4F3FA'
            },
            //行样式
            rowStyle: {
              'background-color': '#E4F3FA',
            },

            //按钮样式控制
            buttonStyle: {
              height: '24px',
              width:'46px',
              padding: 0,
              margin: 0,
              'font-size': '12px',
              'max-width': '46px',
            },

          },
          {
            //自定义列
            customColumn: [//自定义列
              {
                columnIndex: 'stockCount',
                width: 400,
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
                    baseValue: 'name',//进度条100%情况下的基准值，不设置默认为100，设置数字的话直接取值，也可设置为行数据中的某个值进行动态取值
                    showInitValue: false,//是否显示原始行数据内容
                    width: 200,//进度条总宽度
                  },
                }
              },
              {
                columnIndex: 'code',
                width: 200,
                _cellConfig: {
                  bodyStyle: {
                    color: '#199ED4',
                    'font-weight': 600
                  },
                  events: {
                    type: 'navigation',//事件类型，简单点说就是要做什么
                    path: 'encapsulation/treeFormTable'
                  },
                  hideTitle: false
                }
              },
              {
                columnIndex: 'genre',
                width: 300,
                _cellConfig: {
                  hideTitle: true
                }
              },

              //用行数据的suggestCount属性演示四种自定义项配置
              //第一种：页面内导航
              // {
              //   columnIndex: 'suggestCount',
              //   width: 260,
              //   _cellConfig: {
              //     bodyStyle: {
              //       color: '#199ED4',
              //       'font-weight': 600
              //     },
              //     events: {
              //       type: 'navigation',//事件类型，简单点说就是要做什么。navigation:导航；link:超链接,新打开页面；file:文件路径，可下载，图片可预览
              //       path: 'encapsulation/treeFormTable'
              //     },
              //     hideTitle: true
              //   }
              // },
              //第二种，行内按钮，可以触发当前页面定义的函数
              // {
              //   columnIndex: 'suggestCount',
              //   componentName: 'button',
              //   width: 260,
              //   _cellConfig: {
              //     methodName: 'componentMethod',
              //     hideTitle: true
              //   }
              // },
              //第三种，文件下载，图片可预览
              {
                columnIndex: 'suggestCount',
                _cellConfig: {
                  bodyStyle: {
                    color: '#199ED4',
                    'font-weight': 600,
                    width: '100%',
                  },
                  events: {
                    type: 'file',//事件类型，简单点说就是要做什么。navigation:导航；link:超链接,新打开页面；file:文件路径，可下载，图片可预览
                    path: 'imgPath',//行数据存有地址的key
                  },
                  hideTitle: true
                }
              },
              //第四种，超链接，打开新页面
              // {
              //   columnIndex: 'suggestCount',
              //   _cellConfig: {
              //     bodyStyle: {
              //       color: '#199ED4',
              //       'font-weight': 600,
              //       width: '100%',
              //     },
              //     events: {
              //       type: 'link',//事件类型，简单点说就是要做什么。navigation:导航；link:超链接,新打开页面；file:文件路径，可下载，图片可预览
              //       path: 'http://www.baidu.com',
              //     },
              //     hideTitle: true
              //   }
              // },

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
                    editBtns_isShow: true,//按钮的显示隐藏--权限控制
                    // rowState: 'isdisable1',//按钮的显示隐藏--行数据控制
                    method: this.addChild //自定义按钮方法-新增
                  },
                  {
                    name: '删除1',
                    nameEn: 'delete1',
                    editBtns_isShow: true,//按钮的显示隐藏--权限控制
                    rowState: 'isdisable1',//按钮的显示隐藏--行数据控制
                    method: this.deleteAllRow//自定义按钮方法-删除
                  },
                  {
                    name: '删除2',
                    nameEn: 'delete2',
                    editBtns_isShow: true,//按钮的显示隐藏--权限控制
                    rowState: 'isdisable1',//按钮的显示隐藏--行数据控制
                    method: this.deleteAllRow//自定义按钮方法-删除
                  },
                  {
                    name: '删除3',
                    nameEn: 'delete3',
                    editBtns_isShow: true,//按钮的显示隐藏--权限控制
                    rowState: 'isdisable1',//按钮的显示隐藏--行数据控制
                    method: this.deleteAllRow//自定义按钮方法-删除
                  }
                ],
                //方式二：
                // component: operateBtns
              }
            ],

            //给单元格内容添加后缀，对象里面的成员的key为行数据的key，成员的值为对象，是相关配置项
            postfix: {
              name: {
                expression: '#self@name#>10',//表达式，取行数据进行运算，最终结果为true或false
                //三种类型：icon|text|rowData
                //icon配置如下
                type: 'icon',
                //后缀的内容配置，是一个数组，如果只有一项，则会在表达式结果为true的时候显示配置；如果有两项，则在表达式为true时显示第一项配置，为false时显示第二项配置
                contentConfigs: [
                  {
                    content: 'change',//图标名称，图标需为svg格式，需在src/icons/svg文件夹中存在
                    style: {//样式，icon情况下仅能控制颜色
                      color: 'red',
                      width: '1.5em',
                      height: '1.5em',
                    },
                  },
                ],
              },
              code: {
                expression: '#self@name#>10',//表达式，取行数据进行运算，最终结果为true或false
                //三种类型：icon|text|rowData
                //text配置如下
                type: 'text',
                //后缀的内容配置，是一个数组，如果只有一项，则会在表达式结果为true的时候显示配置；如果有两项，则在表达式为true时显示第一项配置，为false时显示第二项配置
                contentConfigs: [
                  {
                    content: ' 我是后缀',//文本内容
                    style: {//样式
                      color: 'red',
                      'padding-left': '5px',
                      'font-weight': 'bold',
                    },
                  },
                ],
              },
              stockCount: {
                expression: '#self@name#<12',//表达式，取行数据进行运算，最终结果为true或false
                //三种类型：icon|text|rowData
                //rowData配置如下
                type: 'rowData',
                //后缀的内容配置，是一个数组，如果只有一项，则会在表达式结果为true的时候显示配置；如果有两项，则在表达式为true时显示第一项配置，为false时显示第二项配置
                contentConfigs: [
                  {
                    content: 'self@id',//行数据的取值表达式或者计算式
                    style: {//样式
                      color: 'orange',
                      'padding-left': '10px',
                      'font-weight': 'bold',
                    },
                  },
                ],
              },
              suggestCount: {
                expression: '#self@name#<12',//表达式，取行数据进行运算，最终结果为true或false
                //三种类型：icon|text|rowData
                //icon配置如下
                type: 'icon',
                //后缀的内容配置，是一个数组，如果只有一项，则会在表达式结果为true的时候显示配置；如果有两项，则在表达式为true时显示第一项配置，为false时显示第二项配置
                contentConfigs: [
                  {
                    content: 'change',//图标名称，图标需为svg格式，需在src/icons/svg文件夹中存在
                    style: {//样式，icon情况下仅能控制颜色
                      color: 'red',
                      width: '1.5em',
                      height: '1.5em',
                    },
                  },
                ],
              },
            },

            // //数据接口
            // apiObj: {//组件使用的API
            //   apiName: 'listPageWarehouseOutDetailsDispatch',
            //   params: {
            //     pageNo: 1,
            //     queryStr: "detail.id in ('219967d2f6704d868b11002caef9885c')"
            //   }
            // },
            //
            // //数据接口动态取值配置
            // dynamicValue: {
            //   parentId: 'self@id',
            //   sum: 'tempData@count',
            //   test: 'parent@test',
            // },

            //合并列
            mergeTitle: [
              {
                index: 2,
                alias: '合并后的列1',//列头的别名
                columns: ['name', 'code'],
                width: 200,
              }
            ],

            //显示序号
            showIndex: true,

            //显示选择器
            showCheckBox: true,

            //是否单选
            isSingle: true,

            //开启下级
            expand: true,
            expandMode: 'none',//展开模式，'all'全部展开(默认)，'one'同级只能展开一个，默认第一条，'none'不自动展开；其中'all'模式下默认没有展开按钮，可设置showExpandBtn强制显示展开按钮

          },
          {
            //自定义列
            customColumn: [//自定义列
              {
                columnIndex: 'stockCount',
                width: 400,
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
                    baseValue: 'name',//进度条100%情况下的基准值，不设置默认为100，设置数字的话直接取值，也可设置为行数据中的某个值进行动态取值
                    showInitValue: false,//是否显示原始行数据内容
                    width: 200,//进度条总宽度
                  },
                }
              },
              {
                columnIndex: 'code',
                width: 200,
                _cellConfig: {
                  bodyStyle: {
                    color: '#199ED4',
                    'font-weight': 600
                  },
                  events: {
                    type: 'navigation',//事件类型，简单点说就是要做什么
                    path: 'encapsulation/treeFormTable'
                  },
                  hideTitle: false
                }
              },
              {
                columnIndex: 'genre',
                width: 300,
                _cellConfig: {
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
              }
            ],

            //给单元格内容添加后缀，对象里面的成员的key为行数据的key，成员的值为对象，是相关配置项
            postfix: {
              name: {
                expression: '#self@name#>10',//表达式，取行数据进行运算，最终结果为true或false
                //三种类型：icon|text|rowData
                //icon配置如下
                type: 'icon',
                //后缀的内容配置，是一个数组，如果只有一项，则会在表达式结果为true的时候显示配置；如果有两项，则在表达式为true时显示第一项配置，为false时显示第二项配置
                contentConfigs: [
                  {
                    content: 'change',//图标名称，图标需为svg格式，需在src/icons/svg文件夹中存在
                    style: {//样式，icon情况下仅能控制颜色
                      color: 'red',
                      width: '1.5em',
                      height: '1.5em',
                    },
                  },
                ],
              },
              code: {
                expression: '#self@name#>10',//表达式，取行数据进行运算，最终结果为true或false
                //三种类型：icon|text|rowData
                //text配置如下
                type: 'text',
                //后缀的内容配置，是一个数组，如果只有一项，则会在表达式结果为true的时候显示配置；如果有两项，则在表达式为true时显示第一项配置，为false时显示第二项配置
                contentConfigs: [
                  {
                    content: ' 我是后缀',//文本内容
                    style: {//样式
                      color: 'red',
                      'padding-left': '5px',
                      'font-weight': 'bold',
                    },
                  },
                ],
              },
              stockCount: {
                expression: '#self@name#<12',//表达式，取行数据进行运算，最终结果为true或false
                //三种类型：icon|text|rowData
                //rowData配置如下
                type: 'rowData',
                //后缀的内容配置，是一个数组，如果只有一项，则会在表达式结果为true的时候显示配置；如果有两项，则在表达式为true时显示第一项配置，为false时显示第二项配置
                contentConfigs: [
                  {
                    content: 'self@id',//行数据的取值表达式或者计算式
                    style: {//样式
                      color: 'orange',
                      'padding-left': '10px',
                      'font-weight': 'bold',
                    },
                  },
                ],
              },
              suggestCount: {
                expression: '#self@name#<12',//表达式，取行数据进行运算，最终结果为true或false
                //三种类型：icon|text|rowData
                //icon配置如下
                type: 'icon',
                //后缀的内容配置，是一个数组，如果只有一项，则会在表达式结果为true的时候显示配置；如果有两项，则在表达式为true时显示第一项配置，为false时显示第二项配置
                contentConfigs: [
                  {
                    content: 'change',//图标名称，图标需为svg格式，需在src/icons/svg文件夹中存在
                    style: {//样式，icon情况下仅能控制颜色
                      color: 'red',
                      width: '1.5em',
                      height: '1.5em',
                      position: 'absolute',
                      top: '50%',
                      left: 0,
                      transform: 'translate(0,-70%)',
                    },
                  },
                ],
              },
            },

            //数据接口
            apiObj: {//组件使用的API
              apiName: 'listPageWarehouseOutDetailsDispatch',
              params: {
                pageNo: 1,
                queryStr: "detail.id in ('219967d2f6704d868b11002caef9885c')"
              }
            },

            //数据接口动态取值配置
            dynamicValue: {
              parentId: 'self@id',
              sum: 'tempData@count',
              test: 'parent@test',
            },

            //合并列
            mergeTitle: [
              {
                index: 2,
                alias: '合并后的列1',//列头的别名
                columns: ['name', 'code'],
                width: 200,
              }
            ],

            //显示序号
            showIndex: true,

            //显示选择器
            showCheckBox: true,

            //是否单选
            isSingle: true,

            //左边固定的列数
            leftFixed:1,

            //右边固定的列数
            rightFixed:1,

            //行拖拽功能
            dragTable: true,
            //是否整行拖拽
            entireRowDrag: false,//设置为true表示整行的任意位置都可以使用拖拽，默认只有按住拖拽按钮时才能拖拽一行

          },
        ],
        //table配置项结束


        //测试数据
        pushIndex: 1,
        tempItem: null,
        tempList: [],
        initData: {},
      }
    },

    //子组件
    components: {
      searchBar,
      multilevelTable,
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
      //table数据操作API
      getData() {
        this.$refs.customBaseTable.getData()
      },
      pushData(data,target) {
        this.$refs.customBaseTable.pushData(data,target)
      },
      updateData(params) {
        this.$refs.customBaseTable.updateData(params)
      },
      deleteData(target) {
        this.$refs.customBaseTable.deleteData(target)
      },
      reviseData(data) {
        data.count = 9
        this.$refs.customBaseTable.reviseData(data)
      },

      //table抛出的数据
      databridge(list) {
        console.log(list)
      },

      //让组件调用本页面的方法
      callMethod(obj){
        obj && obj.methodName && this[obj.methodName](obj.params)
      },

      //动态搜索列固定写法
      sendGuid(id) {
        this.guid = id
      },
      searchMap(data) {
        this.updateData(data)
      },


      addChild(item, index, data) {
        console.log(item, index, data)
        this.pushData(item,item)
      },
      deleteAllRow(item, index, all) {
        console.log(item, index, all)
        this.deleteData(item)
      },

      componentMethod(params){
        console.log(params)
      },

      switchEvent(params){
        console.log(params)
      },

    },

    //计算属性
    computed: {
      tableHeight() {
        if (this.$store.getters[this.guid + '/clientData']) {
          return (this.$store.getters[this.guid + '/clientData'].clientHeight - (this.searchList.length ? (this.$store.getters[this.guid + '/dynaHeight'] + 30 - this.$store.getters[this.guid + '/arrowBtn']) : 0)) + 'px'
        } else {
          return '100%'
        }
      },
    },

    //观察者,可监听数据
    watch: {

    }

  }

</script>

<style lang="scss" rel="text/css">
  .singleTable {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 0;
    box-sizing: border-box;
  }
</style>
