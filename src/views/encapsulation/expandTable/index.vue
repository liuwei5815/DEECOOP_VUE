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
      class="testStyle"
      :style="{height: tableHeight+'px','margin-top': searchList.length?'10px':'0'}">
      <expand-table
        :initData="initData"
        :childrenData="childrenData"
        :configs="tableSets"
        :currentpage.sync="currentpage"
        :maxLayer="maxLayer"
        :apiObj="{apiName:expandTableApiList,apiParams:expandTableApiParams}"
        :updateViewData="updateViewData"
        :default-expand-all="true"
        @send-children-row="sendChildrenRow"
        @databridge="databridge"></expand-table>
    </el-row>
    <!--表格部分结束-->


    <template v-if="showDialog">
      <el-dialog
        title="新增下级"
        :visible.sync="dialogVisible"
        width="400px"
        :before-close="handleClose">
        <el-form :model="fromTemp" style="width: 400px; margin: 20px auto;padding: 0 20px;">
          <template v-for="(item,index) in dialogList">
            <el-form-item :key="item.id || index" :label="item.label">
              <template v-if="item.type === 'input'">
                <el-input v-model="fromTemp[item.mapKey]" :placeholder="item.placeholder"></el-input>
              </template>
              <template v-else-if="item.type === 'select'">
                <el-select v-model="fromTemp[item.mapKey]" :name="item.options.name" :disabled="item.options.disabled" :clearable="item.options.clearable" :multiple="item.options.multiple" :filterable="item.options.filterable" :default-first-option="item.options['default-first-option']" :placeholder="item.placeholder">
                  <el-option
                    v-for="childItem in item.options.options"
                    :key="childItem.value"
                    :label="childItem.label"
                    :value="childItem.value">
                  </el-option>
                </el-select>
              </template>
            </el-form-item>
          </template>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addChildBom">确 定</el-button>
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
  import expandTable from "@/components/expandTable"
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
        colConfigs: [
          {
            prop: 'id',
            label: 'id',
            children: [
              {
                prop: 'id',
                label: 'id',
              },{
                prop: 'pid',
                label: 'pid',
              },{
                prop: 'icon',
                label: 'icon',
              },{
                prop: 'name2234',
                label: 'name2234',
              },{
                prop: 'url',
                label: 'url',
              },{
                prop: 'operate',
                label: '操作',
                component: operateLayer1,
                addChild: this.addChild,
                editRow: this.editRow,
                delete: this.deleteRow
              }
            ],
          },{
            prop: 'pid',
            label: 'pid',
          },{
            prop: 'icon',
            label: 'icon',
          },{
            prop: 'name',
            label: 'name',
          },{
            prop: 'url',
            label: 'url',
          },{
            prop: 'serialNumber',
            label: 'serialNumber',
          },{
            prop: 'operate',
            label: '操作',
            component: operateBtns,
            addChild: this.addChild,
            delete: this.deleteRow
          }
        ],
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
          '1':[{
            columnIndex: 'last',
            prop: 'operate',
            label: '操作',
            component: operateBtns,
            addChild: this.addChild,
            delete: this.deleteAllRow
          }],
          '2':[{
            columnIndex: 'last',
            prop: 'operate',
            label: '操作',
            component: operateLayer1,
            addChild: this.addChild,
            editRow: this.editRow,
            delete: this.deleteAllRow
          }],
          '3':[{
            columnIndex: 'last',
            prop: 'operate',
            label: '操作',
            component: operateBtns,
            addChild: this.addChild,
            delete: this.deleteAllRow
          }],
          '4':[{
            columnIndex: 'last',
            prop: 'operate',
            label: '操作',
            component: operateBtns,
            addChild: this.addChild,
            delete: this.deleteAllRow
          }],
          '5':[{
            columnIndex: 'last',
            prop: 'operate',
            label: '操作',
            component: operateBtns,
            addChild: this.addChild,
            delete: this.deleteAllRow
          }],
          '6':[{
            columnIndex: 'last',
            prop: 'operate',
            label: '操作',
            component: operateBtns,
            addChild: this.addChild,
            delete: this.deleteAllRow
          }],
        },
        tableSets: {
          '1': {
            showCheckBox: false,
            showIndex: true,
            expandOne: false
          },
          '2': {
            showCheckBox: true,
            showIndex: true,
            isExpands: false,
            isSortable: false,
            isSingle: false,
            expandOne: false
          },
          '3': {
            showCheckBox: true,
            isExpands: false,
            isSortable: false,
            isSingle: true,
            expandOne: false
          },
          '4': {
            showCheckBox: true,
            showIndex: true,
            isExpands: false,
            isSortable: false,
            isSingle: true,
            expandOne: false
          },
          '5': {
            showCheckBox: true,
            showIndex: true,
            isExpands: false,
            isSortable: false,
            isSingle: true,
            expandOne: false
          },
        },
        maxLayer: 6,
        expandTableApiList: ['listPageLogInfo','listPageLogInfo','listPageLogInfo','listPageLogInfo','listPageLogInfo','listPageLogInfo'],
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
      }
    },

    //子组件
    components: {
      expandTable,
      searchBar

    },

    /*生命周期函数开始*/
    //vue实例化之前
    beforeCreate() {

    },

    //vue实例化后调用
    created() {
      //this.initData = this.$storage.get('rootMenu')
      this.initExpandTable()
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
      initExpandTable() {
        this.$api[this.expandTableApiList[0]](this.setParams(1,this.expandTableApiParams[0],this.currentpage)).then(res => {
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
        const tempObj = Object.assign({},this.expandTableApiParams[layer-1])
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
      createBomRow(layer,id,data){
        this.baseLayer = 0
        const state = this.searchBomTitle(this.colConfigs,layer)
        if(state){

        }else {
          this.baseLayer = 0
          this.createBomTitle(layer,data,this.colConfigs)
        }
      },
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
      addChildBom() {
        console.log(this.fromTemp)
        this.createBomRow(this.dialogCallBackData.layer,this.dialogCallBackData.id,this.fromTemp)
        this.dialogVisible = false
        this.showDialog = false
        this.fromTemp = {}
        console.log(this.colConfigs)
      }

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
    .testStyle {
      border: 1px solid #E4E4E4;
      border-bottom: none;
      margin-top: 10px;
      transition: height 0.4s;
    }
  }
</style>
