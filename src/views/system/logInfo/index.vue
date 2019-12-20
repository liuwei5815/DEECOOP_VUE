<!----------------------------logInfoManage 用户自定义修改  注意要与最下边对应的样式名称保持一致-------------------------------->
<template>
  <div class="logInfoManage">
    <!--列表界面查询搜索-->
    <!--<el-row  :gutter="10" style="box-sizing: border-box;position: relative;overflow: hidden;transition: height 0.4s;-webkit-transition: height 0.4s;-moz-transition: height 0.4s;" :style="{height: dynaHeight+'px'}">-->
      <!--<div style="position: absolute;">-->
        <!--<el-form :inline="true" :model="tempQuery" class="form-inline">-->
          <!--<el-col :span="6" style="max-width: 260px">-->
            <!--<el-form-item :label="tempLable.userCode">-->
              <!--<el-input v-model="tempQuery.userCode" :placeholder="tempLable.userCode"></el-input>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <!--<el-col :span="6" style="max-width: 260px">-->
            <!--<el-form-item :label="tempLable.userName">-->
              <!--<el-input v-model="tempQuery.userName" :placeholder="tempLable.userName"></el-input>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <!--<el-col :span="9" style="max-width: 460px">-->
            <!--<el-form-item :label="tempLable.cdate">-->
              <!--<el-date-picker v-model="tempQuery.cdate" type="daterange" value-format="yyyy-MM-dd"  align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" >-->
              <!--</el-date-picker>-->
            <!--</el-form-item>-->
          <!--</el-col>-->

          <!--<el-col :span="2" style="max-width: 100px">-->
            <!--<el-form-item>-->
              <!--<base-button v-show="configs.queryBarBtnList[0].isShow" :name='configs.queryBarBtnList[0].name' :icon='configs.queryBarBtnList[0].icon' :plain="configs.queryBarBtnList[0].plain"-->
                         <!--:state="configs.queryBarBtnList[0].state"-->
                         <!--@myclick="configs.queryBarBtnList[0].method"></base-button>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <!--<el-col :span="2" style="max-width: 100px">-->
            <!--<el-form-item>-->
              <!--<base-button v-show="configs.queryBarBtnList[1].isShow" :name='configs.queryBarBtnList[1].name' :icon='configs.queryBarBtnList[1].icon' :plain="configs.queryBarBtnList[1].plain"-->
                         <!--:state="configs.queryBarBtnList[1].state"-->
                         <!--@myclick="configs.queryBarBtnList[1].method"></base-button>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
        <!--</el-form>-->
      <!--</div>-->
    <!--</el-row>-->

    <!--<el-row style="position: relative;height: 20px;">-->
      <!--<div style="position: absolute;bottom: 10px;left: 0;right: 0;height: 1px;background-color: rgb(228,228,228);z-index: 10;">-->
        <!--<div style="position: relative;">-->
          <!--<el-tooltip effect="dark" :content="dynaHeightState-0?'收起搜索':'展开搜索'" placement="bottom" :hide-after="hideTime">-->
            <!--<el-button v-if="dynaHeightState-0" icon="el-icon-arrow-up" circle style="position: absolute;left: 50%;top: -10.5px;transform: translate(-50%,0); width: 1.5em;height: 1.5em;padding: 0;" @click="resetDynaHeight"></el-button>-->
            <!--<el-button v-else icon="el-icon-arrow-down" circle style="position: absolute;left: 50%;top: -10.5px;transform: translate(-50%,0); width: 1.5em;height: 1.5em;padding: 0;" @click="resetDynaHeight"></el-button>-->
          <!--</el-tooltip>-->
        <!--</div>-->
      <!--</div>-->
    <!--</el-row>-->

    <search-bar
      v-if="searchList.length"
      :searchList="searchList"
      :searchConfig="searchConfig"
      @search-map="searchMap"
      @send-guid="sendGuid"></search-bar>

    <el-row style="border: 1px solid #E4E4E4;border-bottom: none;margin-top: 10px;transition: height 0.4s;-webkit-transition: height 0.4s;-moz-transition: height 0.4s;" :style="{height: tableHeight+'px'}">
      <el-col class="tableStyle">
        <div class="baseTable">
          <!--列表界面按钮动态加载-->
          <el-row class="tableTopBar">
            <el-col >
              <div class="tableBtns">
                <template v-for="(item, index) in configs.topBarBtnList">
                  <base-button :name='item.name' :icon='item.icon' :plain="item.plain" :state="item.state"
                             @myclick="item.method"></base-button>
                </template>
              </div>
            </el-col>
          </el-row>

          <!--列表界面table表头及数据动态加载-->
          <el-row class="tableContent">
            <base-table :data="tableData" :colConfigs="configs.tableConfigs" :showCheckBox="configs.showCheckBox"
                        :showIndex="configs.showIndex" @databridge="dataBridge"  :pageData="pageData" :currentpage.sync="pageNo"></base-table>
          </el-row>

        </div>
      </el-col>
    </el-row>


    <!--新增及修改表单界面-->
    <el-dialog  v-el-drag-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="700px" top="40px">

      <div  v-loading="dialogLoading">
        <el-form :rules="rules" ref="submitForm" :model="temp" label-position="right" label-width="120px"
                 style='width: 400px;margin: 10px auto;'>

          <el-form-item :label="tempLable.code+ ':'" prop="code">
            <el-input v-model="temp.code"  :disabled="tempNotEditable.code"></el-input>
          </el-form-item>
          <el-form-item :label="tempLable.name+ ':'" prop="name">
            <el-input v-model="temp.name"></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center;padding-bottom: 30px">
          <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">保存</el-button>
          <el-button v-else type="primary" @click="updateData">保存</el-button>
          <el-button @click="dialogFormVisible = false">关闭</el-button>
        </div>
      </div>

    </el-dialog>

  </div>
</template>

<script >
  import i18n from '@/lang'
  import searchBar from '@/components/searchBar'
  // ajax后台方法
  //*******************************************************用户自定义修改 start ***************************************************************************
  import {
    listPageLogInfo, //分页列表查询查询
    updateDisableLogInfo, //启用禁用功能
    addLogInfo, //新增功能
    exportExcelLogInfos,//Excel导出
    updateLogInfo, //修改功能
    deleteLogInfos //批量删除功能
  } from '@/api/logInfo'
  //*******************************************************用户自定义修改 end ***************************************************************************
  //按钮权限
  import {initMenuButtons} from '@/api/button'
  //	公共方法
  import {filerTableTitle,downLoad} from '@/utils/common'


  //	  table操作栏里面的按钮
  // const operateBtns = {
  //   props: ['colConfig'],
  //   template: `<el-table-column :label="colConfig.label" :sortable="colConfig.sortable" align="center">
  //     					<div slot-scope="scope" class="btnBox">
  //     							<el-button  type="text" class="btns" style="font-size: 12px;" @click="colConfig.editBtns(scope.row,scope.$index)">编辑</el-button>
  //     					</div>
  //   				</el-table-column>`
  // }
  //	  table状态栏里面的按钮
  // const stateBtns = {
  //   props: ['colConfig'],
  //   template: `<el-table-column :label="colConfig.label" :sortable="colConfig.sortable" align="center">
	// 					<div slot-scope="scope">
  //   						<el-switch active-value="1" inactive-value="0" v-model="scope.row.isdisable" @change="colConfig.changeState(scope.row,scope.$index)"></el-switch>
  //   					</div>
  //   			   </el-table-column>`
  // }





  export default {
    //数据
    data() {
      return {




        //搜索栏数据
        guid: '',
        searchList: [
          {
            label: '操作人账号',
            type: 'input',
            ruleType: 'string',
            mapKey: 'userCode',
            configs: {},
            placeholder: '操作人账号'
          },
          {
            label: '操作人姓名',
            type: 'input',
            ruleType: 'string',
            mapKey: 'userName',
            configs: {},
            placeholder: '操作人姓名'
          }
        ],
        searchConfig: {
          hideSearchSwitch: false,//设置是否隐藏搜索列，隐藏为true,不隐藏为false，非必要设置
        },




        dialogLoading: false,


        /*初始化数据*/
        //搜索栏数据
        hideTime: 500,
        dynaHeight: 40,
        clientHeight: 0,
        dynaHeightTimer: null,
        dynaHeightState: null,





        initConfigs: {
          //行级按钮初始化
          tableOperates: {
            // prop: 'operate',
            // label: '操作',
            // enLabel: 'operation',
            // isPropName: true,
            // component: operateBtns, //自定义按钮组件
            // editBtns: this.editBtns //自定义按钮方法-编辑
          },
        },


        configs: {


          //查询及重置按钮
          queryBarBtnList: [{
            name: '查询',
            nameEn: 'query',
            isShow: true,
            icon: 'search',
            method: this.initTable
          }, {
            name: '重置',
            nameEn: 'reset',
            isShow: true,
            icon: 'refresh',
            plain: true,
            method: this.resetQueryTemp
          }],


          //表级按钮初始化
          topBarBtnList: [
            // {
            //   name: 'add',
            //   nameEn: 'add',
            //   isShow: true,
            //   icon: 'add',
            //   method: this.addNew //自定义按钮方法-新增
            // },
            // {
            //   name: 'delete',
            //   nameEn: 'delete',
            //   isShow: true,
            //   icon: 'delete',
            //   plain: true,
            //   state: true,
            //   method: this.deleteBatch//自定义按钮方法-删除
            // }
          ],
          tableConfigs: [],
          showCheckBox: false,//是否显示行级单选框
          showIndex: false    //是否显示行号
        },

        //table数据集
        tableData: [],

        //行数据选择列表
        selectList: null,



        // 表单标题及状态值
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑菜单',
          create: '新增菜单'
        },


        // form表单字段值map集合
        temp: {

        },
        // form查询字段值map集合
        tempQuery: {

        },
        // form表单标签名称map集合
        tempLable: {

        },
        // form表单不可编辑字段map集合
        tempNotEditable: {

        },
        // form表单字段校验信息
        rules: {

        },

        //分页参数集合及当前默认页面
        pageData: null,
        pageNo: 1,


      }
    },

    //子组件
    components: {
      searchBar
    },

    /*生命周期函数开始*/
    //vue实例化之前
    beforeCreate() {

    },

    //vue实例化后调用
    created() {
      const that = this
      //按钮初始化
      that.initButtons()
      //加载table列表
      that.initTable(true)
      that.dynaHeightState = that.$storage.get('dynaHeightState') || '1'
      if(!(that.dynaHeightState -0)){
        that.dynaHeight = 0
      }

    },

    //挂载之前
    beforeMount() {

    },
    //真实DOM挂载后，仅限组件本身的挂载，如果存在子组件，并且需求子组件全部被挂载后进行操作，需使用vm.$nextTick顶替mounted（在mounted内部调用vm.$nextTick）；
    mounted() {
      this.clientHeight = this.$el.clientHeight
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


      //搜索栏功能
      searchMap(data) {
        this.tempQuery = data
        this.pageNo = 1
        this.initTable()
      },
      sendGuid(id) {
        this.guid = id
      },

      // //搜索栏切换
      // resetDynaHeight() {
      //   const that = this
      //   if(that.dynaHeight && that.dynaHeightState-0){
      //     that.dynaHeight = 0
      //     that.$storage.remove('dynaHeightState')
      //     that.$storage.set('dynaHeightState','0')
      //     clearTimeout(that.dynaHeightTimer)
      //     that.dynaHeightTimer = setTimeout(function () {
      //       that.dynaHeightState = false
      //     },500)
      //   }else if(!that.dynaHeight && !(that.dynaHeightState-0)){
      //     that.dynaHeight = 40
      //     that.$storage.remove('dynaHeightState')
      //     that.$storage.set('dynaHeightState','1')
      //     clearTimeout(that.dynaHeightTimer)
      //     that.dynaHeightTimer = setTimeout(function () {
      //       that.dynaHeightState = true
      //     },500)
      //   }
      // },



      initButtons(){
        const that = this
        that.$loading({
          spinner: 'none',
          text: '云上企业'
        })
        const roleId = that.$storage.get('userInfo').roleIds
        const menuId = that.$storage.get('menuId');
        if(roleId){
          //初始化按钮
          initMenuButtons({
            //参数
            menuId: menuId,
            roleId: roleId
          }).then(res => {
            let buttonList =  res.buttonList
            if(buttonList){

              buttonList.forEach(item => {

                if(that.initConfigs){
                  if(that.initConfigs.tableOperates){
                    for (let key in that.initConfigs.tableOperates) {
                      if(key.indexOf(item.nameEn)>=0 && key.indexOf("isShow")>0){
                        that.initConfigs.tableOperates[key] = false
                      }
                    }
                  }
                }

                if(that.customColumn){
                  for (let children in that.customColumn) {
                    if(children){
                      let childrenList = that.customColumn[children]
                      if(childrenList.length>0){
                        childrenList.forEach(option => {
                          if(option){
                            for (let key in option) {
                              if(key.indexOf(item.nameEn)>=0 && key.indexOf("isShow")>0){
                                option[key] = false
                              }
                            }
                          }
                        })
                      }
                    }
                  }
                }

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
                        console.log(topBtn)
                        topBtn.isShow = false
                      }
                    })
                  }
                }

              })

            }
          }).catch(err => {
            console.log(err)
            that.$loading().close()
          })
        }
      },



      //加载table列表
      initTable(isClosedLoading){
        const that = this

        //页面初始化列表及分页参数
        //*******************************************************用户自定义修改 start ***************************************************************************
        listPageLogInfo({
          //*******************************************************用户自定义修改 end ***************************************************************************
          //参数
          ...that.tempQuery,
          pageNo:that.pageNo
        }).then(res => {
          that.getListPage(res)
          if(isClosedLoading){
            that.$loading().close()
          }
        }).catch(err => {
          console.log(err)
          that.$loading().close()
        })


      },



      //加载table列头及列表数据
      getListPage(res) {
        const that = this
        if (res) {
          console.log(res.result.titles)
          // res.result.titles = JSON.parse(res.result.titles)
          // res.result.varList = JSON.parse(res.result.varList)
          // res.result.pageData = JSON.parse(res.result.pageData)
          //分页参数
          that.pageData = res.result.pageData

          //列表标签可编辑属性、国际化初始化
          that.initTempData(res.result.titles)

          const data = filerTableTitle(res.result)
          const titleList = that.addTableTitle(data)
          // console.log(titleList)
          that.configs.tableConfigs = titleList
          that.configs.showCheckBox = true
          that.configs.showIndex = true
          that.tableData = res.result.varList

          that.configs.topBarBtnList.forEach(item => {
            if(item.nameEn=='delete'){
              item.state = true  //删除按钮的状态变更
            }
          })
        }
      },

      initTempData(titles){
        const that = this
        titles.forEach(item => {
          for(let k in item) {
            let label = item[k]
            if(label.indexOf("_")>0){
              if(i18n.locale == "en"){
                label = label.substring(label.indexOf("_")+1)
              }else if(i18n.locale == "zh"){
                label = label.substring(0,label.indexOf("_"))
              }
            }
            //from表单常规字段国际化处理   注意尽量使表单字段key要与列表查询的key保持一致
            that.tempLable[k]=label;
            //from表单常规字段不可编辑状态设置   注意尽量使表单字段key要与列表查询的key保持一致
            that.tempNotEditable[k]=false;

          }
        })
      },

      //自定义状态列
      addTableTitle(list) {
        const that = this
        // console.log("*****11*"+JSON.stringify(i18n.messages.zh.selfDefine))
        list.forEach(item => {
          // console.log("******"+JSON.stringify(item))
          //title国际化处理
          let labelName = item.label
          if(labelName.indexOf("_")>0){
            if(i18n.locale == "en"){
              item.label = labelName.substring(labelName.indexOf("_")+1)
            }else if(i18n.locale == "zh"){
              item.label = labelName.substring(0,labelName.indexOf("_"))
            }
          }

          //列表特殊字段处理
          if (item.label ===  '是否启用') {
            item.component = stateBtns
            item.changeState = that.changeState
          }
        })
        that.internationalConfig()
        // list.push(that.initConfigs.tableOperates)
        return list
      },

      //国际化设置
      internationalConfig(){
        const that = this
        if(i18n.locale == "en"){
          //列表操作列国际化处理
          that.initConfigs.tableOperates.label="OPERATE"
          // that.initConfigs.tableOperates.isPropName = true
          //弹出窗标题国际化处理
          that.textMap.create="ADDNEW"
          that.textMap.update="EDIT"
          //form表单特殊字段国际化处理
          // that.tempLable[key]=英文名
        }else if(i18n.locale == "zh"){
          //列表操作列国际化处理
          that.initConfigs.tableOperates.label="操作"
          // that.initConfigs.tableOperates.isPropName = true
          //弹出窗标题国际化处理
          that.textMap.create="新增"
          that.textMap.update="编辑"
          //form表单特殊字段国际化处理
          // that.tempLable[key]=中文名
        }
      },



      //自定义状态列回调函数
      changeState(item, index) {
        // console.log(item)
        // console.log(index)
        const that = this
        //ajax调用启用禁用后台方法
        //*******************************************************用户自定义修改 start ***************************************************************************
        updateDisableLogInfo(item.id,item.isdisable )
        //*******************************************************用户自定义修改 end ***************************************************************************
          .then(res => {
            console.log(res)
            that.$loading().close()
          }).catch(err => {
          console.log(err)
          that.$loading().close()
        })
      },

      //通过单选框触发事件 获取table组件传回的数据
      dataBridge(data) {
        // console.log("*********"+data)
        const that = this
        that.selectList = data
        if (data.length) {
          that.configs.topBarBtnList.forEach(item => {
            if(item.nameEn=='delete'){
              item.state = false  //删除按钮的状态变更
            }
          })
        } else {
          that.configs.topBarBtnList.forEach(item => {
            if(item.nameEn=='delete'){
              item.state = true  //删除按钮的状态变更
            }
          })
        }
      },



      //行级按钮-编辑
      editBtns(item, index) {
        // console.log("*********"+JSON.stringify(item))
        this.resetTemp()
        //将item对象转成json字符串，然后又将字符串转成新生成的json对象，最后将这个json对象直接传递给temp。如果直接将item对象传递给temp，那后面对temp进行数据修改同时也会对item对象进行修改。为了防止这种情况，我们采用了json转换对象的间接传递。
        this.temp = JSON.parse(JSON.stringify(item))

        //设置不可编辑字段
        this.tempNotEditable.code = true

        //设置当前弹窗界面为编辑界面
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['submitForm'].clearValidate()
        })
      },
      //编辑保存
      updateData() {
        const that = this
        that.$refs['submitForm'].validate((valid) => {
          if (valid) {
            // console.log(that.temp)
            //*******************************************************用户自定义修改 start ***************************************************************************
            updateLogInfo(that.temp)
            //*******************************************************用户自定义修改 end ***************************************************************************
              .then(res => {
                console.log(res)
                if (res.code === 0) {
                  that.dialogFormVisible = false
                  that.$notify({
                    title: '成功',
                    message: '修改成功',
                    type: 'success',
                    duration: 2000
                  })
                  that.refreshTable()
                }
              }).catch(err => {
              console.log(err)
              that.$loading().close()

            })

          }
        })
      },




      //表级按钮-新增
      addNew() {
        this.resetTemp()

        //设置不可编辑字段
        this.tempNotEditable.code = false


        //设置当前弹窗界面为新增界面
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['submitForm'].clearValidate()
        })
      },

      //form表单内容重置
      resetTemp() {
        const that = this
        for(let key in that.temp) {
          // console.log(key)
          that.temp[key]= ''
        }
      },
      //查询条件重置
      resetQueryTemp() {
        const that = this
        for(let key in that.tempQuery) {
          // console.log(key)
          that.tempQuery[key]= ''
        }
      },
      //新增保存
      createData() {
        const that = this
        this.$refs['submitForm'].validate((valid) => {
          if (valid) {
            // console.log(that.temp)

            //*******************************************************用户自定义修改 start ***************************************************************************
            addLogInfo(that.temp)
            //*******************************************************用户自定义修改 end ***************************************************************************
              .then(res => {
                console.log(res)
                if (res.code === 0) {
                  that.dialogFormVisible = false
                  that.$notify({
                    title: '成功',
                    message: '创建成功',
                    type: 'success',
                    duration: 2000
                  })
                  that.refreshTable()
                }
              }).catch(err => {
              console.log(err)
              that.$loading().close()

            })


          }
        })
      },


      //表级按钮-删除
      deleteBatch(){

        const that = this

        that.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          let ids = ''
          that.selectList.forEach(item => {
            ids += item.id + ','
          })
          //*******************************************************用户自定义修改 start ***************************************************************************
          deleteLogInfos(ids)
          //*******************************************************用户自定义修改 end ***************************************************************************
            .then(res => {
              console.log(res)
              if (res.code === 0) {
                that.dialogFormVisible = false
                that.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
                })
                that.refreshTable()
              }
            }).catch(err => {
            console.log(err)
            that.$loading().close()
          })


        }).catch(() => {
          that.$message({
            type: 'info',
            message: '已取消删除'
          });
        });



      },

      //Table列表刷新
      refreshTable() {
        const that = this
        that.$axios.all([
          //*******************************************************用户自定义修改 start ***************************************************************************
          listPageLogInfo()
          //*******************************************************用户自定义修改 end ***************************************************************************
        ]).then(that.$axios.spread((res) => {
          console.log(res)
          that.getListPage(res)
          that.$loading().close()
        })).catch((error) => {
          console.log(error)
        })

      },




      //Excel文件导出
      exportExcel() {

        //获取勾选id
        let ids = "";
        const that = this;
        if (that.selectList != null && that.selectList.length > 0) {
          that.selectList.forEach(item => {
            ids = ids + item.id + ','
          })
        }

        //*******************************************************用户自定义修改 start ***************************************************************************
        exportExcelLogInfos(ids)
        //*******************************************************用户自定义修改 end ***************************************************************************
          .then(res => {
            // console.log(res)
            if (!res) {
              return
            }
            downLoad(res,"组织管理导出.xls")
            // that.$message({
            //   title: '成功',
            //   message: '导出成功',
            //   type: 'success',
            //   duration: 2000
            // })
          }).catch(err => {
          console.log(err)
        })

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

    //观察者,可监听数据，属性和方法
    watch: {
      pageNo: function () {
        // console.log(this.pageNo)
        const that = this
        that.initTable()
      }
    }
  }
</script>



<!----------------------------logInfoManage 用户自定义修改  注意要与最上边定义的样式名称保持一致-------------------------------->
<style  lang="scss" rel="text/css">
  .logInfoManage
  {
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
    height: calc(100% - 20px);
    overflow-y: auto;
    box-sizing: border-box;
    padding: 10px;
  }
  }
  }
  }
</style>
