<template>
  <div class="message">
    <!--顶部搜索栏开始-->
    <search-bar
      v-if="searchList.length"
      :searchList="searchList"
      @search-map="searchMap"
      @send-guid="sendGuid"/>

    <!--列表界面按钮动态加载-->
    <el-row class="tableTopBar">
      <el-col >
        <div class="tableBtns">
          <template v-for="(item, index) in configs.topBarBtnList">
            <base-button v-show="item.isShow" :name='item.name' :icon='item.icon' :plain="item.plain" :state="item.state"
                         @myclick="item.method"></base-button>
          </template>
        </div>
      </el-col>
    </el-row>

    <el-row style="border: 1px solid #E4E4E4;border-bottom: none;margin-top: 10px;transition: height 0.4s;-webkit-transition: height 0.4s;-moz-transition: height 0.4s;" :style="{height: tableHeight+'px'}">
      <el-col class="tableStyle">
        <div class="baseTable">
          <!--列表界面table表头及数据动态加载-->
          <el-row class="tableContent">
            <multilevel-table
              ref="customBaseTable"
              :tableConfigList="tableConfigList"
              @callmethod="callMethod"
              @databridge="databridge"/>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <!--弹窗控件开始-->
    <component v-if="showDialog" :is="dialogName" :initData="dialogData" :visible="visible" @close-dialog="closeDialog" />

  </div>
</template>

<script>
  import searchBar from '@/components/searchBar'
  import multilevelTable from "@/components/customTable/multilevelTable"

  //添加 对话框
  import dialogAdd from './dialogAdd'
  //修改 对话框
  import dialogEdit from './dialogEdit'

  //按钮权限
  import {initMenuButtons} from '@/api/button'

  import {deleteMessage,updateIsShowMessage} from '@/api/message'

  export default {
    //子组件
    components: {
      multilevelTable,
      searchBar,
      dialogAdd,
      dialogEdit
    },

    data() {
      return {

        //动态搜索列配置数据开始
        searchList: [
          {
            label: '标题',
            type: 'input',
            ruleType: 'string',
            mapKey: 'title',
            configs: {},
            placeholder: '标题',
          },{
            label: '发布日期起',
            type: 'date',
            ruleType: 'date',
            mapKey: 'cdateBegin',
            configs: {
              clearable: true,
              name: '',
              type: 'date',
              pickerOptions: {
                //可用的时间范围，字符串数组，前一个为可用的开始时间，后一个为可用的结束时间
                //disabledDate: ['2018-09-15','2018-10-20']
                //hidePicker: true,
              }
            },
            placeholder: '请选择'
          },{
            label: '发布日期止',
            type: 'date',
            ruleType: 'date',
            mapKey: 'cdateEnd',
            configs: {
              clearable: true,
              name: '',
              type: 'date',
              pickerOptions: {
                //可用的时间范围，字符串数组，前一个为可用的开始时间，后一个为可用的结束时间
                //disabledDate: ['2018-09-15','2018-10-20']
                //hidePicker: true,
              }
            },
            placeholder: '请选择'
          },{
            label: '发布状态',
            type: 'select',
            ruleType: 'string',
            mapKey: 'isShow',
            configs: {
              clearable: true,
              name: '',
              options: [{
                value: '',
                label: '全部'
              },{
                value: '0',
                label: '未发布'
              },{
                value: '1',
                label: '已发布'
              }]
            },
            placeholder: '请选择'
          }
        ],

        guid: '',
        searchObj: {},

        //table配置项开始
        tableConfigList: [
          {
            //自定义列
            customColumn: [
              { columnIndex: 'isShow',
                componentName: 'switch',
                _cellConfig: {
                  methodName: 'switchEvent',
                  hideTitle: true
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
                    name: '修改',
                    nameEn: 'reback',
                    editBtns_isShow: true,
                    icon: 'reback',
                    method: this.editMessage
                  }
                ],
              }
            ],

            //数据接口 apiObj.params.userType
            apiObj: {//组件使用的API
              apiName: 'listPageMessages',
              params: {
                fieldCode: 'title,cdateStr,isShow,remark',
                userType: ''
              }
            },

            //外部数据
            tempData: {},

            //显示序号
            showIndex: true,

            //显示选择器
            showCheckBox: true,

            //显示列控制器
            showTableSet: false,
            //显示全部列，在列控制器开启后可用
            showAll: false,

            //组件内部名称，需要全项目唯一
            componentId: 'oneLevelTable',

            // //开启下级
            // expand: true,
            // expandMode: 'none',//展开模式，'all'全部展开(默认)，'one'同级只能展开一个，默认第一条，'none'不自动展开；其中'all'模式下默认没有展开按钮，可设置showExpandBtn强制显示展开按钮
            // showExpandBtn: true,//强制显示展开按钮

            //表头样式
            headerStyle: {
              'background-color': '#E4F3FA'
            },
            //行样式
            rowStyle: {
              'background-color': '#E4F3FA'
            },

          },
        ],

        configs: {
          //表级按钮初始化
          topBarBtnList: [
            {
              name: '新增',
              nameEn: 'add',
              isShow: true,
              icon: 'add',
              method: this.dialogAdd
            },
            {
              name: '删除',
              nameEn: 'submit',
              isShow: true,
              state: false,
              icon: 'add',
              method: this.deleteBatch
            },
          ],
          tableConfigs: [],
          showCheckBox: false,//是否显示行级单选框
          //showIndex: false    //是否显示行号
        },

        selectList:[],
        //table配置项结束

        //新增编辑传参对象开始
        temp: {},
        tempLable:{},
        //新增编辑传参对象结束

        //弹窗功能开始
        openDialogName: '',
        showDialog: false,
        visible: false,
        dialogData: {
          dialog_width:'',
          table_style:'',
          rowData:{},

          title: '',
        }
      }
    },

    /*生命周期函数开始*/
    //vue实例化之前
    beforeCreate() {},

    //vue实例化后调用
    created() {
      //获取登录用户类型
      let userInfo = this.$storage.get('userInfo')
      if (userInfo.userType != null && userInfo.userType.trim().length > 0) {
        this.tableConfigList[0].apiObj.params.userType = userInfo.userType.trim();
      }
      this.initButtons()
    },

    //挂载之前
    beforeMount() {},
    //真实DOM挂载后，仅限组件本身的挂载，如果存在子组件，并且需求子组件全部被挂载后进行操作，需使用vm.$nextTick顶替mounted（在mounted内部调用vm.$nextTick）；
    mounted() {},
    //数据更新前调用
    beforeUpdate() {},
    //数据更新后调用（避免使用，最好使用计算属性或watch函数）,仅限组件本身的更新，如果存在子组件，并且需求子组件全部被更新后进行操作，需使用vm.$nextTick顶替updated（在updated内部调用vm.$nextTick）；
    updated() {},
    /*生命周期函数结束*/

    //方法
    methods: {


      initButtons() {
        const that = this

        const roleId = that.$storage.get('userInfo').roleIds
        const menuId = that.$storage.get('menuId');

        if(roleId){
          that.$loading({
            spinner: 'none',
            text: '云上企业'
          })

          //初始化按钮
          initMenuButtons({
            //参数
            menuId: menuId,
            roleId: roleId
          }).then(res => {
            that.$loading().close()
            let buttonList = res.buttonList
            if(buttonList){
              buttonList.forEach(item => {


                if(that.configs){
                  if(that.configs.queryBarBtnList){
                    that.configs.queryBarBtnList.forEach(queryBtn=> {
                      if(queryBtn.nameEn==item.nameEn){
                        queryBtn.isShow = false
                      }
                    })
                  }

                  if(that.configs.topBarBtnList){
                    that.configs.topBarBtnList.forEach(topBtn=> {
                      if(topBtn.nameEn==item.nameEn){
                        topBtn.isShow = false
                      }
                    })
                  }
                }

                if(that.tableConfigList){
                  that.tableConfigList.forEach(custom=> {
                    if(custom.customColumn){
                      custom.customColumn.forEach(column=> {
                        if(column.columnIndex=='last'){
                          if(column.component){
                            column.component.forEach(colBtn=> {
                              if(colBtn.nameEn==item.nameEn){
                                colBtn.rowState = '1==2'
                              }
                            })
                          }
                        }
                      })
                    }
                  })
                }
              })
            }
          }).catch(err => {
            that.$loading().close()
          })
        }
      },


      sendGuid(id) {
        this.guid = id
      },
      searchMap(data) {
        this.searchObj = data
        this.updateData(data)
      },

      databridge(list){
        this.selectList = list
      },

      // //table数据操作API
      // getData() {
      //   this.$refs.customBaseTable.getData()
      // },
      // pushData(data,target) {
      //   this.$refs.customBaseTable.pushData(data,target)
      // },
      updateData(params) {
        this.$refs.customBaseTable.updateData(params)
      },

      //让组件调用本页面的方法
      callMethod(obj){
        obj && obj.methodName && this[obj.methodName](obj.params)
      },
      // deleteData(target) {
      //   this.$refs.customBaseTable.deleteData(target)
      // },

      // addChild(item, index, data) {
      // },
      // deleteAllRow(item, index, all) {
      // },

      dialogAdd() {
        this.dialogData.title = '新增公告'
        this.openDialogName = 'dialogAdd'
        this.showDialog = true
        this.visible = true
      },

      editMessage(item) {
        this.dialogData.rowData = {
          id: item.id,
          title: item.title,
          content: item.content,
          remark: item.remark
        };

        this.dialogData.title = '修改公告'
        this.openDialogName = 'dialogEdit'
        this.showDialog = true
        this.visible = true
      },

      switchEvent(rowData) {
        updateIsShowMessage({id:rowData.row.id, isShow:rowData.row.isShow}).then(res => {
          if (res.code === 0) {
            let msgStr = "";
            if ('1' == rowData.row.isShow) {
              msgStr = '发布成功';
            } else if ('0' == rowData.row.isShow) {
              msgStr = '变更成功，发布状态变更为(未发布)';
            }

            this.$notify({
              title: '操作成功',
              message: msgStr,
              type: 'success',
              duration: 5000
            })
          }
        }).catch(err => {})
      },

      deleteBatch() {
        let dataList = this.selectList;

        let ids = '';
        let msgStr = '';
        let index = 0
        if (dataList != null && dataList.length > 0) {
          dataList.forEach(rowData => {
            //是否发布(0:未发布 1:已发布)
            let isShow = rowData.isShow
            if ('1' == isShow) {
              msgStr = msgStr + "第 " + (index+1) + " 行: 状态(已发布)，"
            }
            index = index + 1;

            let id = rowData.id;
            if (id != null && id.trim().length > 0) {
              ids = ids + id + ','
            }
          });
        }
        if (msgStr != null && msgStr.trim().length > 0) {
          this.$message({
            type: 'warning',
            duration: 5 * 1000,
            showClose: true,
            message: "您勾选数据：" + msgStr + " 不允许删除！",
          });
          return;
        }


        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteMessage({ids:ids}).then(res => {
              if (res.code === 0) {
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
                })
                //this.refreshTable()
                this.updateData(this.searchObj);
              }
            }).catch(err => {})

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },



      // //设定:供应商付款期间初期值
      // editPaymentBuild(item, index) {
      //   let paymentSum = '';
      //   //付款类型:paymentType (应付款: plus 预付款:minus)
      //   let paymentType = '';
      //
      //   //付款值(期初): beginValue
      //   let beginValue = item.beginValue;
      //   if ((beginValue-0) >= 0) {
      //     paymentType = 'plus';
      //     paymentSum = beginValue;
      //   } else if ((beginValue-0) < 0) {
      //     paymentType = 'minus';
      //     paymentSum = (beginValue-0) * -1;
      //   }
      //
      //   this.dialogData.rowData = {
      //     id: item.id,
      //     supplierId: item.supplierId,
      //     paymentPeriodDate: item.paymentPeriodDate,
      //     beginPlus: item.beginPlus,
      //     beginMinus: item.beginMinus,
      //     beginValue: item.beginValue,
      //
      //     paymentType: paymentType,
      //     paymentSum: paymentSum,
      //     supplierCode: item.supplierCode,
      //     supplierName: item.supplierName
      //   };
      //
      //   this.dialogData.title = '供应商付款期间设定初期值'
      //   this.openDialogName = 'dialogEdit'
      //   this.showDialog = true
      //   this.visible = true
      // },

      //弹窗功能
      closeDialog(data) {
        // console.log(data)
        this.showDialog = false
        if(data.resState === 'ok'){
          this.updateData(this.searchObj)
        }
      },

      resetTemp() {
        const that = this
        for(let key in that.temp) {
          that.temp[key]= ''
        }
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
      dialogName() {
        return this.openDialogName
      },
    },

    //观察者,可监听数据
    watch: {
      // currentpage: function () {
      //   // console.log(this.currentPage)
      //   this.initExpandTable()
      // },
    }

  }

</script>

<style lang="scss" rel="text/css">
  .message {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 0;
    box-sizing: border-box;
    /*border: 1px solid #E4E4E4;*/
    /*border-bottom: none;*/
    .tableStyle {
      height: 100%;
      overflow-x: auto;
      position: relative;
      .baseTable {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        > .tableTopBar {
          box-sizing: border-box;
          padding: 10px;
        }
        > .tableContent {
          height: calc(100% - 40px);
          overflow-y: auto;
          box-sizing: border-box;
          padding: 10px;
        }
      }
    }
  }
</style>
