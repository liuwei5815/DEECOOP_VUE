  <template>
  <div class="customTransferTableDemo">
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
      <div style="height: 100%">
        <custom-transfer-table
          ref="trabsferTables"
          :aboveTableConfig="aboveTableConfig"
          :belowTableConfig="belowTableConfig"
          :deDuplication="false"
          :addColumns="addColumns"
          :hideColumns="hideColumns"
          :btnList="btnList"
          :stateBtn="stateBtnData"
          @table-selected="tableSelected"></custom-transfer-table>
      </div>
    </el-row>
  </div>
</template>

<script>
  import customTransferTable from '@/components/customTransferTable'
  import searchBar from '@/components/searchBar'

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
      customTransferTable,
      searchBar,
    },
    data() {
      return {
        userInfo: null,
        guid: '',


        //穿梭table数据
        // 配置项开始
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
        stateBtnData: {
          title:'上次盘点至今变动过的货品',
          //keyName: 'state' //改变checkedBox状态后调用接口时用参数对象中的key名，不定义默认为'isShow'。
        },
        //上面的表格配置项，参数同自定义基础table
        aboveTableConfig: {
          //数据接口
          apiObj: {
            apiName: 'listPageLogInfo',
            params: {},
          },
          //自定义列
          customColumn: [//自定义列
            {
              columnIndex: 'userCode',//列的prop
              width: 200,
              /*通用属性*/
              componentName: 'input',//单元格组件类型，有'input','inputNumber','select','cascader','switch','time','date','dateTime'
              _cellConfig: {
                rules: [//验证规则
                  // {type: 'code'},//规则类型，内置多种规则，详见@/utils/regexp.js
                  {required: true},//是否必填
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
                  // {lessThan: ['tempData@count', false]},//小于某个值或某些值
                  // {lessThan: ['tempData@count(-)sibling@count', true]},//小于等于某个值或某些值
                ],
                message: ['必填'],//验证失败的提示语，与验证规则数组一一对应


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
              columnIndex: 'cdate',
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
                //greaterThan: ['self@cdate', true],
                //lessThan: ['parent@1@count',true],//小于某个或某些日期，最后一个参数为boolean，为true表示可以小于等于
                //lessThan: ['2019-1-31', false],//小于某个具体日期，最后一个参数为boolean，为true表示可以小于等于
                /*快捷方式，共9种：昨天，今天，明天，上一周，下一周，上个月，下个月，上一年，下一年*/
                /*注意点：1.设置defaultValue，compute将使快捷选项无效*/
                /*注意点：2.设置greaterThan，lessThan时将使快捷选项的结果处在greaterThan，lessThan规定的范围*/
                //shortcuts: ['yesterday','today','tomorrow','lastWeek','nextWeek','lastMonth','nextMonth','lastYear','nextYear'],
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
                  // rowState: '#self@isdisable#===1 || #self@isdisable#===2',
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
                  // rowState: '#self@count#===10',
                  method: this.deleteAllRow//自定义按钮方法-删除
                }
              ],
            }
          ],


          //外部数据
          tempData: {
            count: 100,
            defaultDate: '2019-01-21'
          },


          //显示序号
          showIndex: true,

          //显示选择器
          showCheckBox: true,

          //显示列控制器
          showTableSet: false,
          //显示全部列，在列控制器开启后可用
          showAll: false,

          //左边固定的列数
          leftFixed:2,

          //右边固定的列数
          rightFixed:1,

          //排序配置
          sortableConfig: {
            //全局配置
            'default-sort': {//默认的排序列和列的排序顺序
              prop: 'count',//值为行数据的key
              order: 'descending'//此属性可不配置，默认为'ascending'，还可设置为'descending'
            },
            //以下属性名为行数据的key，可根据业务需求配置多个列的排序功能
            progress: {},//排序设置简易方式，key为行数据的key，值为空对象
            // progress: {//自定义排序方式
            //   // 'sort-method': function (a,b) {//只能设置为函数，对数据进行排序的时候使用的方法，需返回一个数字，和Array.sort表现一致
            //   //   console.log(a,b)
            //   //   return a - b
            //   // },
            //   'sort-by': function (row, index) {//可以设置为字符串/数组/函数，指定数据按照哪个行属性进行排序，仅没有设置 sort-method 的时候有效。如果 sort-by 为数组，则先按照第 1 个属性排序，如果第 1 个相等，再按照第 2 个排序，以此类推
            //     return row.progress
            //   },
            // },
            count: {},
            // count: {
            //   'sort-method': function (a, b) {//可以设置为字符串/数组/函数，指定数据按照哪个行属性进行排序，仅没有设置 sort-method 的时候有效。如果 sort-by 为数组，则先按照第 1 个属性排序，如果第 1 个相等，再按照第 2 个排序，以此类推
            //     return a.count - b.count
            //   },
            // },
          },

          //行拖拽功能
          dragTable: false,
          //是否整行拖拽
          entireRowDrag: false,//设置为true表示整行的任意位置都可以使用拖拽，默认只有按住拖拽按钮时才能拖拽一行

        },
        //下面的表格配置项，参数同自定义基础table
        belowTableConfig: {
          //数据接口（可以远程请求表格数据，注意数据不能有分页）
          // apiObj: {
          //   apiName: 'listPageLogInfo',
          //   params: {},
          // },
          //自定义列（自定义表格列需要的功能）
          customColumn: [//自定义列
            // {
            //   columnIndex: 'source',
            // },
            // {
            //   columnIndex: 'count',//列的prop
            //   'min-width': 120,
            //   _cellConfig: {
            //     hideTitle: true
            //   }
            // },
            {
              columnIndex: 'operateUrl',//列的prop
              width: 200,
              /*通用属性*/
              componentName: 'input',//单元格组件类型，有'input','inputNumber','select','cascader','switch','time','date','dateTime'
              _cellConfig: {
                rules: [//验证规则
                  // {type: 'code'},//规则类型，内置多种规则，详见@/utils/regexp.js
                  {required: true},//是否必填
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
                  // {lessThan: ['tempData@count', false]},//小于某个值或某些值
                  // {lessThan: ['tempData@count(-)sibling@count', true]},//小于等于某个值或某些值
                ],
                message: ['必填'],//验证失败的提示语，与验证规则数组一一对应


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
              columnIndex: 'cdate',
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
                //greaterThan: ['self@cdate', true],
                //lessThan: ['parent@1@count',true],//小于某个或某些日期，最后一个参数为boolean，为true表示可以小于等于
                //lessThan: ['2019-1-31', false],//小于某个具体日期，最后一个参数为boolean，为true表示可以小于等于
                /*快捷方式，共9种：昨天，今天，明天，上一周，下一周，上个月，下个月，上一年，下一年*/
                /*注意点：1.设置defaultValue，compute将使快捷选项无效*/
                /*注意点：2.设置greaterThan，lessThan时将使快捷选项的结果处在greaterThan，lessThan规定的范围*/
                //shortcuts: ['yesterday','today','tomorrow','lastWeek','nextWeek','lastMonth','nextMonth','lastYear','nextYear'],
              }

            },
            {
              columnIndex: 'userName',
              componentName: 'select',
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
              },
            }
          ],

          //外部数据
          tempData: {
            count: 100,
            defaultDate: '2019-01-21'
          },

          //显示序号
          showIndex: true,

          //显示选择器
          showCheckBox: false,

          //左边固定的列数
          leftFixed:2,

          //右边固定的列数
          rightFixed:1,

          //行拖拽功能
          dragTable: true,
          //是否整行拖拽
          entireRowDrag: false,//设置为true表示整行的任意位置都可以使用拖拽，默认只有按住拖拽按钮时才能拖拽一行

        },
        //增加的列（手动添加表格的列）
        addColumns: [
          {
            columnIndex: 5,//手动增加表格列时此属性必须为数字，表示将增加的表格列添加到表格的第几列
            prop: 'userCode1',//表格行数据里面的key，如果原始表格行数据里面没有此属性，那么此属性会被自动添加到行数据里面
            label: '操作人账号1',//表格行数据的title
            componentName: 'cascader',//手动添加的表格行数据需要使用的内置组件类型
            //下面为使用内置组件时的配置项，用法同自定义表格
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
              // props:{
              //   value:'id',
              //   label:'label',
              //   children:'children',
              //   disabled:'disabled'
              // },
              rules: [//验证规则
                // {type: 'int'},//规则类型
                {required: true},//是否必填
              ],
            }
          },
        ],
        //减少的列（手动删除表格的列）
        hideColumns: [
          'operate'//表格行数据的key
        ],
        // 配置项结束

        //下面的表格里面的数据项
        tableSelectList: [],
        //穿梭table数据结束


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
          },
          {
              label: '货品名称',
              type: 'input',
              ruleType: 'string',
              mapKey: 'goodsName',
              configs: {},
              placeholder: '请输入货物名'
          },
          {
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
          },
          {
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
          },
          {
            label: '库存数量',
            type: 'cascader',
            mapKey: 'cascaded',
            configs: {
              clearable: true,
              apiName: 'getDictionarys',
              params: {dictionaryKey:'userType',isglobal:'1'}
            },
            placeholder: '请选择'
          },
          {
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
          },
          {
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
          },
          {
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
          },
          {
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
          },
        ],
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

      //动态搜索列传回数据
      searchMap(data) {
        this.aboveTableConfig.apiObj.params = Object.assign({},this.aboveTableConfig.apiObj.params,data)
        if(this.belowTableConfig.apiObj && this.belowTableConfig.apiObj.params){
          this.belowTableConfig.apiObj.params = Object.assign({},this.belowTableConfig.apiObj.params,data)
        }
        console.log(this.aboveTableConfig.apiObj.params)
      },
      sendGuid(id) {
        this.guid = id
      },

      //数据出口
      tableSelected(list){
        console.log(list,'tableSelected')
        this.tableSelectList = list
      },

      //穿梭table的自定义方法
      addMenu(){
        //取出自定义穿梭表中的数据项
        this.$refs.trabsferTables.getTableSelected()
      },
      resetQuery(){
        // 清空自定义穿梭表中的数据项
        this.$refs.trabsferTables.clearTableSelected()
      },
    }
  }
</script>

<style lang="scss" rel="text/css">
  .customTransferTableDemo {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 0;
    box-sizing: border-box;
  }
</style>
