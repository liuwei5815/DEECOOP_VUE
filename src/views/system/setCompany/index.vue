<template>
  <div class="setCompany">
    <!--顶部搜索栏开始-->
    <search-bar
      v-if="searchList.length"
      :searchList="searchList"
      @search-map="searchMap"
      @send-guid="sendGuid"/>

    <el-row
      style="border-bottom: none;margin-top: 10px;transition: height 0.4s;-webkit-transition: height 0.4s;-moz-transition: height 0.4s;"
      :style="{height: tableHeight,'margin-top': searchList.length?'10px':'0'}">
      <!--<el-col class="tableStyle">-->
      <!--<div class="baseTable">-->
      <!--&lt;!&ndash;列表界面table表头及数据动态加载&ndash;&gt;-->
      <!--<el-row class="tableContent">-->
      <!--<multilevel-table-->
      <!--ref="customBaseTable"-->
      <!--:tableConfigList="tableConfigList"-->
      <!--@databridge="databridge"/>-->
      <!--</el-row>-->
      <!--</div>-->
      <!--</el-col>-->
      <multilevel-table
        ref="customBaseTable"
        :tableConfigList="tableConfigList"
        @databridge="databridge"/>
    </el-row>

    <!--弹窗控件开始-->
    <component v-if="showDialog" :is="dialogName" :initData="dialogData" :visible="visible" @close-dialog="closeDialog" />

  </div>
</template>


<script>
  import searchBar from '@/components/searchBar'
  import multilevelTable from "@/components/customTable/multilevelTable"

  //修改 对话框
  import dialogEdit from './dialogEdit'

  //按钮权限
  import {initMenuButtons} from '@/api/button'

  import {findSystemDateTime} from '@/api/system'
  import {findPaymentPeriodByCompanyId} from '@/api/purchaseCompanyPeriod'

  export default {
    //子组件
    components: {
      multilevelTable,
      searchBar,
      dialogEdit
    },

    data() {
      return {

        //动态搜索列配置数据开始
        searchList: [],

        guid: '',
        searchObj: {},

        //table配置项开始
        tableConfigList: [
          {
            //自定义列
            customColumn: [
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
                    method: this.updateCompany
                  }
                ],
              }
            ],

            //数据接口
            apiObj: {//组件使用的API
              apiName: 'findListCompany',
              params: {}
            },

            //外部数据
            tempData: {},

            //显示序号
            showIndex: true,

            //显示选择器
            showCheckBox: false,

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

      updateData(params) {
        this.$refs.customBaseTable.updateData(params)
      },

      //修改:企业首次付款期间
      updateCompany(item, index) {
        this.dialogData.rowData = {
          id: item.id,
          code: item.code,
          name: item.name,
          companyShortname: item.companyShortname
        };

        this.dialogData.title = '修改企业名称'
        this.openDialogName = 'dialogEdit'
        this.showDialog = true
        this.visible = true
      },

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
          return (this.$store.getters[this.guid+'/clientData'].clientHeight - (this.searchList.length?(this.$store.getters[this.guid+'/dynaHeight'] + 30 - this.$store.getters[this.guid+'/arrowBtn']):0)) + 'px'
        }else {
          return '100%'
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
  .setCompany {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    box-sizing: border-box;
    /*border: 1px solid #E4E4E4;*/
    /*border-bottom: none;*/
    /*.tableStyle {*/
    /*height: 100%;*/
    /*overflow-x: auto;*/
    /*position: relative;*/
    /*.baseTable {*/
    /*position: absolute;*/
    /*top: 0;*/
    /*left: 0;*/
    /*right: 0;*/
    /*bottom: 0;*/
    /*> .tableTopBar {*/
    /*box-sizing: border-box;*/
    /*padding: 10px;*/
    /*}*/
    /*> .tableContent {*/
    /*height: calc(100% - 60px);*/
    /*overflow-y: auto;*/
    /*box-sizing: border-box;*/
    /*padding: 10px;*/
    /*}*/
    /*}*/
    /*}*/
  }
</style>
