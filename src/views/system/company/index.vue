<template>
  <!----------------------------companyManage 用户自定义修改  注意要与最下边对应的样式名称保持一致-------------------------------->
  <div class="companyManage">

    <!--<el-row  :gutter="10" style="box-sizing: border-box;position: relative;overflow: hidden;transition: height 0.4s;-webkit-transition: height 0.4s;-moz-transition: height 0.4s;" :style="{height: dynaHeight+'px'}">-->
      <!--<div style="position: absolute;">-->
          <!--&lt;!&ndash;列表界面查询搜索&ndash;&gt;-->
          <!--<el-form :inline="true" :model="tempQuery" class="form-inline">-->
            <!--<el-col :span="6" style="max-width: 260px">-->
              <!--<el-form-item :label="tempLable.code">-->
                <!--<el-input v-model="tempQuery.code" :placeholder="tempLable.code"></el-input>-->
              <!--</el-form-item>-->
            <!--</el-col>-->
            <!--<el-col :span="6" style="max-width: 260px">-->
              <!--<el-form-item :label="tempLable.name">-->
                <!--<el-input v-model="tempQuery.name" :placeholder="tempLable.name"></el-input>-->
              <!--</el-form-item>-->
            <!--</el-col>-->
            <!--<el-col :span="6" style="max-width: 260px">-->
              <!--<el-form-item :label="tempLable.userName">-->
                <!--<el-input v-model="tempQuery.userName" :placeholder="tempLable.userName"></el-input>-->
              <!--</el-form-item>-->
            <!--</el-col>-->
            <!--<el-col :span="6" style="max-width: 260px">-->
              <!--<el-form-item :label="tempLable.isdisable">-->
                <!--<el-select v-model="tempQuery.isdisable" :placeholder="tempLable.isdisable" clearable>-->
                  <!--<el-option :label="'是'" value="1"></el-option>-->
                  <!--<el-option :label="'否'" value="0"></el-option>-->
                <!--</el-select>-->
              <!--</el-form-item>-->
            <!--</el-col>-->
            <!--<el-col :span="3" style="max-width: 100px">-->
              <!--<el-form-item>-->
                <!--<base-button v-show="configs.queryBarBtnList[0].isShow" :name='configs.queryBarBtnList[0].name' :icon='configs.queryBarBtnList[0].icon' :plain="configs.queryBarBtnList[0].plain"-->
                           <!--:state="configs.queryBarBtnList[0].state"-->
                           <!--@myclick="configs.queryBarBtnList[0].method"></base-button>-->
              <!--</el-form-item>-->
            <!--</el-col>-->
            <!--<el-col :span="3" style="max-width: 100px">-->
              <!--<el-form-item>-->
                <!--<base-button v-show="configs.queryBarBtnList[1].isShow" :name='configs.queryBarBtnList[1].name' :icon='configs.queryBarBtnList[1].icon' :plain="configs.queryBarBtnList[1].plain"-->
                           <!--:state="configs.queryBarBtnList[1].state"-->
                           <!--@myclick="configs.queryBarBtnList[1].method"></base-button>-->
              <!--</el-form-item>-->
            <!--</el-col>-->
          <!--</el-form>-->
      <!--</div>-->
    <!--</el-row>-->
    <search-bar
      v-if="searchList.length"
      :searchList="searchList"
      :searchConfig="searchConfig"
      @search-map="searchMap"
      @send-guid="sendGuid"></search-bar>


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


    <el-row style="border: 1px solid #E4E4E4;border-bottom: none;margin-top: 10px;transition: height 0.4s;-webkit-transition: height 0.4s;-moz-transition: height 0.4s;" :style="{height: tableHeight+'px'}">
      <el-col class="tableStyle">
        <div class="baseTable">
          <!--列表界面按钮动态加载-->
          <el-row class="tableTopBar">
            <el-col >
              <div class="tableBtns">
                <template v-for="(item, index) in configs.topBarBtnList">
                  <base-button v-show="item.isShow"  :name='item.name' :icon='item.icon' :plain="item.plain" :state="item.state"
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
    <el-dialog v-el-drag-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="800px" top="40px">

      <div v-loading="dialogLoading">
        <el-form :rules="rules" ref="submitForm" :model="temp" label-position="right" label-width="120px"
                 style='width: 600px;margin: 10px auto;'>
          <el-row>
            <!--企业编码-->
            <el-col :span="12">
              <el-form-item :label="tempLable.code+ ':'" prop="code">
                <el-input v-model="temp.code"  :disabled="tempNotEditable.code"></el-input>
              </el-form-item>
            </el-col>
            <!--企业名称-->
            <el-col :span="12">
              <el-form-item :label="tempLable.name+ ':'" prop="name">
                <el-input v-model="temp.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <!--企业简称-->
            <el-col :span="12">
              <el-form-item :label="tempLable.companyShortname+ ':'" prop="companyShortname">
                <el-input v-model="temp.companyShortname"></el-input>
              </el-form-item>
            </el-col>
            <!--显示顺序-->
            <el-col :span="12">
              <el-form-item :label="tempLable.serialNumber+ ':'" prop="serialNumber">
                <el-input v-model="temp.serialNumber" @change="checkSerialNumber"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <!--企业性质-->
            <el-col :span="12">
              <el-form-item :label="tempLable.companyTypeName" prop="companyTypeName" >
                <base-input-select style='width: 180px' :placeholder="tempLable.companyTypeName" v-model="selectDataCompany.defaultSelected" :data="selectDataCompany.data"  @callback="companySelect" ></base-input-select>
              </el-form-item>
            </el-col>
            <!--截至日期-->
            <el-col :span="12">
              <el-form-item :label="tempLable.companyValidityDate+ ':'" prop="companyValidityDate">
                <el-date-picker style='width: 180px' v-model="temp.companyValidityDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <!--管理员姓名-->
            <el-col :span="12">
              <el-form-item :label="tempLable.userName+ ':'" prop="userName">
                <el-input v-model="temp.userName"></el-input>
              </el-form-item>
            </el-col>
            <!--手机号-->
            <el-col :span="12">
              <el-form-item :label="tempLable.mobile+ ':'" prop="mobile">
                <el-input v-model="temp.mobile" @change="checkMobile"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <!--邮箱-->
            <el-col :span="12">
              <el-form-item :label="tempLable.email+ ':'" prop="email">
                <el-input v-model="temp.email"></el-input>
              </el-form-item>
            </el-col>
            <!--企业用户数-->
            <el-col :span="12">
              <el-form-item :label="tempLable.companyUserCount+ ':'" prop="companyUserCount">
                <el-input v-model="temp.companyUserCount" @change="checkUserCount"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <!--套餐-->
            <el-col :span="12">
              <el-form-item :label="tempLable.roleName" prop="roleName" >
                <base-input-select style='width: 180px' :placeholder="tempLable.roleName" v-model="selectDataRole.defaultSelected" :data="selectDataRole.data" @callback="roleSelect" ></base-input-select>
              </el-form-item>
            </el-col>
            <!--地区-->
            <el-col :span="12">
              <el-form-item :label="tempLable.area+ ':'" prop="area">
                <!--<el-cascader v-model="temp.areaList"  placeholder="地区" :options="options" filterable change-on-select ></el-cascader>-->
                <base-input-select style='width: 180px'  :placeholder="tempLable.area" v-model="selectDataArea.defaultSelected" :data="selectDataArea.data" @callback="areaSelect" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <!--备注-->
            <el-col :span="24">
              <el-form-item :label="tempLable.remark+ ':'" prop="remark" >
                <el-input v-model="temp.remark"  :disabled="tempNotEditable.remark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>


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

  import {listTreeDictionary} from '@/api/dictionary'

  import searchBar from '@/components/searchBar'
  //*******************************************************用户自定义修改 start ***************************************************************************
  // ajax后台方法
  import {listPageCompanyAdmins, updateDisableCompany, addCompanyAdmin, updateCompany, deleteCompanyAdmins,    exportExcelCompanys} from '@/api/company'
  //按钮权限
  import {initMenuButtons} from '@/api/button'
  //下拉列表ajax数据请求
  import {dataListRoles} from '@/api/role'
  import {dataListDictionarys} from '@/api/dictionary'
  //*******************************************************用户自定义修改 end ***************************************************************************

  //	公共方法
  import {filerTableTitle,downLoad,removeNullTreeNode,getNodeList} from '@/utils/common'


  //	  table操作栏里面的按钮
  const operateBtns = {
    props: ['colConfig'],
    template: `<el-table-column :label="colConfig.label" :sortable="colConfig.sortable" align="center">
      					<div slot-scope="scope" class="btnBox">
      							<el-button v-show="colConfig.editBtns_isShow"  type="text" class="btns" style="font-size: 12px;" @click="colConfig.editBtns(scope.row,scope.$index)">编辑</el-button>
      					</div>
    				</el-table-column>`
  }
  //	  table状态栏里面的按钮
  const stateBtns = {
    props: ['colConfig'],
    template: `<el-table-column :label="colConfig.label" :sortable="colConfig.sortable" align="center">
						<div slot-scope="scope">
    						<el-switch active-value="1" inactive-value="0" v-model="scope.row.isdisable" @change="colConfig.changeState(scope.row,scope.$index)"></el-switch>
    					</div>
    			   </el-table-column>`
  }





  export default {
    //数据
    data() {
      return {



        //搜索栏数据
        guid: '',
        searchList: [
          {
            label: '企业编码',//搜索输入框名称，必填项
            type: 'input',//搜索输入框类型，总共四种:'input','select','date','time'，必填项
            mapKey: 'code',//搜索输入框绑定的key，关键参数，必填
            configs: {},//搜索输入框配置
            placeholder: '企业编码',//占位符
          },{
            label: '企业名称',
            type: 'input',
            ruleType: 'string',
            mapKey: 'name',
            configs: {},
            placeholder: '企业名称'
          },{
            label: '是否启用',
            type: 'select',
            ruleType: 'string',
            mapKey: 'isdisable',
            configs: {
              clearable: true,
              name: '',
              options: [{
                value: '1',
                label: '是'
              },{
                value: '0',
                label: '否'
              }]
            },
            placeholder: '请选择'
          },{
            label: '管理员姓名',
            type: 'input',
            ruleType: 'string',
            mapKey: 'userName',
            configs: {},
            placeholder: '管理员姓名'
          },
        ],
        searchConfig: {
          hideSearchSwitch: false,//设置是否隐藏搜索列，隐藏为true,不隐藏为false，非必要设置
        },




        dialogLoading: false,

        //搜索栏数据
        hideTime: 700,
        dynaHeight: 40,
        clientHeight: 0,
        dynaHeightTimer: null,
        dynaHeightState: null,



        selectDataCompany: {
          data: {//传入的基本配置和数据
            selectUrl: '/system/dictionary/getDictionarys',
            selectParm: {dictionaryKey:'companyType',isglobal:'1'},//全局
          },
          defaultSelected: [],
        },

        selectDataRole: {
          data: {//传入的基本配置和数据
            selectUrl: '/system/role/getRoles',
            selectParm: {queryStr:"(company_id = 'b6ff76cb95f711e884ad00163e105f05')"},//全局
          },
          defaultSelected: [],
        },


        selectDataArea: {
          data: {
            selectUrl: '/system/dictionary/treeDictionarys',
            selectParm: {dictionaryKey:'area',cascade: "true"},
          },
          defaultSelected: [],
        },



        initConfigs: {
          //行级按钮初始化
          tableOperates: {
            prop: 'operate',
            label: '操作',
            enLabel: 'operation',
            isPropName: true,
            component: operateBtns, //自定义按钮组件
            editBtns: this.editBtns, //自定义按钮方法-编辑
            editBtns_isShow: true,
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
            {
              name: '新增',
              nameEn: 'add',
              isShow: true,
              icon: 'add',
              method: this.addNew //自定义按钮方法-新增
            },
            {
              name: '删除',
              nameEn: 'delete',
              isShow: true,
              icon: 'delete',
              plain: true,
              state: true,
              method: this.deleteBatch//自定义按钮方法-删除
            },
            {
              name: '导出',
              nameEn: 'export',
              isShow: true,
              icon: 'export',
              method: this.exportExcel
            },
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
          //*******************************************************用户自定义修改 start ***************************************************************************
          code: [{
            required: true,
            message: '请填写企业编码',
            trigger: 'change'
          }],
          name: [{
            required: true,
            message: '请填写企业名称',
            trigger: 'change'
          }],
          companyTypeName: [{
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if ( this.selectDataCompany.defaultSelected.length <= 0) {
                callback(new Error('请选择企业性质'));
              } else {
                callback();
              }
            }
          }],
          email: [{
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger:['blur', 'change']
          }],
          mobile: [
            { required: true, message: '请填写手机号', trigger: 'blur' },
            {
              type: 'number',
              trigger: ['blur', 'change'],
              validator: (rule, value, callback) => {
                if (value && (!(/^[1][34578]\d{9}$/).test(value) || !(/^[1-9]\d*$/).test(value) || value.length !== 11)) {
                  callback(new Error('手机号码不符合规范'))
                } else {
                  callback()
                }
              }
          }],
          companyValidityDate: [{
            required: true,
            message: '请填写截至日期',
            trigger: 'change'
          }],
          companyUserCount: [{
            required: true,
            message: '请填写企业用户数',
            trigger: 'change'
          }],
          roleName: [{
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if ( this.selectDataRole.defaultSelected.length <= 0) {
                callback(new Error('请选择套餐'));
              } else {
                callback();
              }
            }
          }],
          //*******************************************************用户自定义修改 end ***************************************************************************
        },

        //分页参数集合及当前默认页面
        pageData: null,
        pageNo: 1,


        //*******************************************************用户自定义修改 start ***************************************************************************
        // //套餐角色下拉列表数据集合
        // roleData: [],
        // isReadRoleFirst: true,
        // selectedRoleOptions: [],
        //
        // //企业性质下拉列表数据集合
        // companyTypeData: [],
        // isReadCompanyTypeFirst: true,
        // selectedCompanyTypeOptions: [],
        //
        // //下拉列表自定义参数
        // props: {
        //   value: 'value',
        //   label: 'label',
        //   children: 'childrens'
        // }
        //*******************************************************用户自定义修改 end ***************************************************************************





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
        listPageCompanyAdmins({
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

        //*******************************************************用户自定义修改 start ***************************************************************************
        // //企业性质下拉列表初始化
        // that.handleCompanyTypeFocus()
        // //套餐角色下拉列表初始化
        // that.handleRoleFocus()
        //*******************************************************用户自定义修改 end ***************************************************************************

      },



      //加载table列头及列表数据
      getListPage(res) {
        const that = this
        if (res) {
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
        list.push(that.initConfigs.tableOperates)
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
        updateDisableCompany(
          item.id,
          item.isdisable
        ).then(res => {
          // console.log(res)
          // that.$loading().close()
        }).catch(err => {
          // console.log(err)
          // that.$loading().close()
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

      checkPrice(value) {
        //大于零的正整数+1位或2位小数-正则表达式
        let reg = new RegExp("^[0-9]+\\.{0,1}[0-9]{0,2}$");
        if(!reg.test(value)){
          //console.log("value: " + value + " 输入错误");
          this.$message({
            message: "单价:" + value + " 输入错误，请输入大于零的正整数或(1,2)位小数！",
            type: 'warning',
            duration: 5 * 1000
          });
          return;
        }
      },

      //验证数值型 数据有效性
      isNumberByValue(value) {
        if (value == null || value.trim().length == 0) {
          return false;
        }

        //大于零的正整数-正则表达式
        let reg = new RegExp("^[0-9]+\\.{0,1}[0-9]{0,2}$");
        return reg.test(value.trim())
      },

      checkValueNumber(value, column) {
        let msgStr = '';

        if (value != null && value.trim().length > 0 && !this.isNumberByValue(value.trim())) {
          msgStr = column + '(' + value + ')输入错误，请输入大于零的正整数！';
        }

        return msgStr;
      },

      checkSerialNumber(value) {
        let msgStr = this.checkValueNumber(value, '显示顺序');
        if (msgStr != null && msgStr.trim().length > 0) {
          this.$message({
            type: 'warning',
            duration: 5 * 1000,
            showClose: true,
            message: msgStr,
          });
          return;
        }
      },
      checkUserCount(value) {
        let msgStr = this.checkValueNumber(value, '企业用户数');
        if (msgStr != null && msgStr.trim().length > 0) {
          this.$message({
            type: 'warning',
            duration: 5 * 1000,
            showClose: true,
            message: msgStr,
          });
          return;
        }
      },

      //行级按钮-编辑
      editBtns(item, index) {
        const that = this
        // console.log("*********"+JSON.stringify(item))
        that.resetTemp()

        //将item对象转成json字符串，然后又将字符串转成新生成的json对象，最后将这个json对象直接传递给temp。如果直接将item对象传递给temp，那后面对temp进行数据修改同时也会对item对象进行修改。为了防止这种情况，我们采用了json转换对象的间接传递。
        that.temp = JSON.parse(JSON.stringify(item))


        // let nodeList = []
        // let idList = []
        // // console.log(that.options)
        // getNodeList(that.options,that.temp.area,nodeList)
        // if(nodeList.length>0){
        //   for(let i=nodeList.length;i>=0;i--){
        //     let treeNode = nodeList[i-1]
        //     if(treeNode){
        //       idList.push(treeNode.id)
        //     }
        //   }
        // }
        // that.temp.areaList=idList

        //*******************************************************用户自定义修改 start ***************************************************************************
        //设置不可编辑字段
        that.tempNotEditable.code = true
        that.tempNotEditable.remark = true



        that.selectDataArea.defaultSelected = []
        if(that.temp.id1){
          that.selectDataArea.defaultSelected.push(that.temp.id1)
        }
        if(that.temp.id2){
          that.selectDataArea.defaultSelected.push(that.temp.id2)
        }
        if(that.temp.id3){
          that.selectDataArea.defaultSelected.push(that.temp.id3)
        }
        if(that.temp.id4){
          that.selectDataArea.defaultSelected.push(that.temp.id4)
        }
        if(that.temp.id5){
          that.selectDataArea.defaultSelected.push(that.temp.id5)
        }
        if(that.temp.id6){
          that.selectDataArea.defaultSelected.push(that.temp.id6)
        }
        if(that.temp.area){
          that.selectDataArea.defaultSelected.push(that.temp.area)
        }




        if(that.temp['companyType']){
          that.selectDataCompany.defaultSelected = [that.temp['companyType']]
        }else {
          that.selectDataCompany.defaultSelected = []
        }


        if(that.temp['roleId']){
          that.selectDataRole.defaultSelected = [that.temp['roleId']]
        }else {
          that.selectDataRole.defaultSelected = []
        }




        // //设置下拉列表默认显示值
        // this.selectedRoleOptions=[]
        // this.selectedRoleOptions.push(item.roleId)
        // this.roleData.forEach(obj => {
        //   if(obj.value==item.roleId){
        //     this.temp['remark'] = obj.remark
        //   }
        // })
        //
        // this.selectedCompanyTypeOptions=[]
        // this.selectedCompanyTypeOptions.push(item.companyType)
        //*******************************************************用户自定义修改 end ***************************************************************************

        //设置当前弹窗界面为编辑界面
        that.dialogStatus = 'update'
        that.dialogFormVisible = true
        that.$nextTick(() => {
          that.$refs['submitForm'].clearValidate()
        })
      },
      //编辑保存
      updateData() {
        const that = this

        that.$refs['submitForm'].validate((valid) => {
          if (valid) {
            //企业编码 code
            let code = this.temp.code;

            //字符串中是否含有中文
            var regChineseCode = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
            if (regChineseCode.test(code)) {
              //含有汉字
              this.$message({
                type: 'warning',
                duration: 5 * 1000,
                showClose: true,
                message: '企业编码('+code+')输入错误企业编码中含有中文，企业编码不允许含有中文！',
              });
              return;
            }

            let msgString = '';
            //显示顺序 serialNumber
            let serialNumber = this.temp.serialNumber;
            if (serialNumber != null && serialNumber.trim().length > 0) {
              let msgStr = this.checkValueNumber(serialNumber, '显示顺序');
              if (msgStr != null && msgStr.trim().length > 0) {
                msgString = msgString + msgStr;
              }
            }

            //企业用户数 companyUserCount
            let companyUserCount = this.temp.companyUserCount;
            if (companyUserCount != null && companyUserCount.trim().length > 0) {
              let msgStr = this.checkValueNumber(companyUserCount, '企业用户数');
              if (msgStr != null && msgStr.trim().length > 0) {
                msgString = msgString + msgStr;
              }
            }

            if (msgString != null && msgString.trim().length > 0) {
              this.$message({
                type: 'warning',
                duration: 5 * 1000,
                showClose: true,
                message: msgString,
              });
              return;
            }


            let mobile = this.temp.mobile;
            let msgStr = this.checkMobileValue(mobile, '手机号');
            if (msgStr != null && msgStr.trim().length > 0) {
              this.$message({
                type: 'warning',
                duration: 5 * 1000,
                showClose: true,
                message: msgStr,
              });
              return;
            }
            //console.log("提交保存");

            that.dialogLoading = true
            updateCompany(that.temp)
              .then(res => {
                that.dialogLoading = false
                // that.$loading().close()
                // console.log(res)
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
              that.dialogLoading = false
              // that.$loading().close()
            })
          }
        })
      },

      //手机号数值型 数据有效性
      isMobileNumberByValue(value) {
        if (value == null || value.trim().length == 0) {
          return false;
        }

        //1开头(11)位数字-正则表达式
        let reg = new RegExp("^1[\\d]{10}");
        return reg.test(value.trim())
      },

      checkMobileValue(value, column) {
        let msgStr = '';

        if (value != null && value.trim().length > 0 && value.trim().length != 11) {
          msgStr = column + '(' + value + ')输入错误，请输入11位正确的手机号！';
        } else if (value != null && value.trim().length == 11 && !this.isMobileNumberByValue(value.trim())) {
          msgStr = column + '(' + value + ')输入错误，请输入11位正确的手机号！';
        }

        return msgStr;
      },

      checkMobile(value) {
        let msgStr = this.checkMobileValue(value, '手机号');
        if (msgStr != null && msgStr.trim().length > 0) {
          this.$message({
            type: 'warning',
            duration: 5 * 1000,
            showClose: true,
            message: msgStr,
          });
          return;
        }
      },


      //表级按钮-新增
      addNew() {
        this.resetTemp()

        this.selectDataArea.defaultSelected = []
        this.selectDataRole.defaultSelected = []
        this.selectDataCompany.defaultSelected = []
        //*******************************************************用户自定义修改 start ***************************************************************************
        //设置不可编辑字段
        this.tempNotEditable.code = false
        this.tempNotEditable.remark = true

        //设置时间控件默认值
        // this.temp['companyValidityDate'] = new Date()

        //设置下拉列表默认值
        // this.temp['roleId'] = this.selectedRoleOptions[0]
        // this.roleData.forEach(obj => {
        //   if(obj.value==this.selectedRoleOptions[0]){
        //     this.temp['remark'] = obj.remark
        //   }
        // })
        // this.temp['companyType'] = this.selectedCompanyTypeOptions[0]
        //*******************************************************用户自定义修改 end ***************************************************************************

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
        //console.log(this.temp)
        this.$refs['submitForm'].validate((valid) => {
          if (valid) {
            //企业编码 code
            let code = this.temp.code;

            //字符串中是否含有中文
            var regChineseCode = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
            if (regChineseCode.test(code)) {
              //含有汉字
              this.$message({
                type: 'warning',
                duration: 5 * 1000,
                showClose: true,
                message: '企业编码('+code+')输入错误企业编码中含有中文，企业编码不允许含有中文！',
              });
              return;
            }

            let msgString = '';
            //显示顺序 serialNumber
            let serialNumber = this.temp.serialNumber;
            if (serialNumber != null && serialNumber.trim().length > 0) {
              let msgStr = this.checkValueNumber(serialNumber, '显示顺序');
              if (msgStr != null && msgStr.trim().length > 0) {
                msgString = msgString + msgStr;
              }
            }

            //企业用户数 companyUserCount
            let companyUserCount = this.temp.companyUserCount;
            if (companyUserCount != null && companyUserCount.trim().length > 0) {
              let msgStr = this.checkValueNumber(companyUserCount, '企业用户数');
              if (msgStr != null && msgStr.trim().length > 0) {
                msgString = msgString + msgStr;
              }
            }

            if (msgString != null && msgString.trim().length > 0) {
              this.$message({
                type: 'warning',
                duration: 5 * 1000,
                showClose: true,
                message: msgString,
              });
              return;
            }

            let mobile = this.temp.mobile
            let msgStr = this.checkMobileValue(mobile, '手机号');
            if (msgStr != null && msgStr.trim().length > 0) {
              this.$message({
                type: 'warning',
                duration: 5 * 1000,
                showClose: true,
                message: msgStr,
              });
              return;
            }
            //console.log("提交保存");

            that.dialogLoading = true
            addCompanyAdmin(that.temp)
              .then(res => {
                that.dialogLoading = false
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
              //console.log(err)
              that.dialogLoading = false
            })
          }
        })
      },


      //表级按钮-删除
      deleteBatch(){
        const that = this
        // console.log(that.selectList)

        that.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

            //*******************************************************用户自定义修改 start ***************************************************************************

            //标准批量删除方法
            // let ids = ''
            // that.selectList.forEach(item => {
            //   ids += item.id + ','
            // })
            // deleteCompanyAdmins(ids)


            let companyIds = ''
            let userRoleIds = ''
            let userIds = ''
            that.selectList.forEach(item => {
              companyIds += item.id + ','
              userRoleIds += item.userRoleId + ','
              userIds += item.userId + ','
            })
            companyIds = companyIds.slice(0, companyIds.length - 1)
            userRoleIds = userRoleIds.slice(0, userRoleIds.length - 1)
            userIds = userIds.slice(0, userIds.length - 1)

          // that.$loading({
          //   spinner: 'none',
          //   text: '云上企业'
          // })
            deleteCompanyAdmins(companyIds,userRoleIds,userIds)
            //*******************************************************用户自定义修改 end ***************************************************************************
              .then(res => {
                // that.$loading().close()
              //console.log(res)
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
              //console.log(err)
              // that.$loading().close()

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
          listPageCompanyAdmins({...that.tempQuery,pageNo:that.pageNo})
          //*******************************************************用户自定义修改 end ***************************************************************************
        ]).then(that.$axios.spread((res) => {
          that.getListPage(res)
        })).catch((error) => {
          //console.log(error)
        })

      },



      // areaSelect(){
      //   listTreeDictionary({
      //     dictionaryKey: "area",
      //     cascade: "true"
      //   }).then(res => {
      //     // console.log(res)
      //     if (res.code === 0) {
      //       if(res.result.treeList.children){
      //         let treeData = res.result.treeList.children
      //         removeNullTreeNode(treeData)
      //         // console.log(treeData)
      //         this.options = treeData
      //       }
      //     }
      //   })
      // },

      areaSelect(data,option,optionNames){
        //this.temp.province = data[0]
        if(data&&data.length>0){
          this.temp['area'] = option.id
          this.provinceData.defaultSelected = data
        }else {
          this.temp['area'] = []
          this.provinceData.defaultSelected = []
        }
      },


      companySelect(data,option){
        // console.log("******"+data)
        const that = this
        if(data[0]){
          that.temp['companyType'] = data[0]
          that.selectDataCompany.defaultSelected = [data[0]]
        }else {
          that.temp['companyType'] = []
          that.selectDataCompany.defaultSelected = []
        }

      },


      roleSelect(data,option){
        //console.log("******",data,option)
        const that = this
        // that.temp['roleId'] = data[0]
        if(data[0]){
          that.selectDataRole.defaultSelected = [data[0]]
          that.temp['roleId'] = data[0]
        }else {
          that.selectDataRole.defaultSelected = []
          that.temp['roleId'] = []
        }
        if(option){
          that.temp['remark'] = option.remark
        }else{
          that.temp['remark'] = null
        }

      },


      // //*******************************************************用户自定义修改 start ***************************************************************************
      // //套餐角色-下拉列表动态加载数据
      // handleRoleFocus() {
      //   // console.log('active item:', val);
      //   const that = this
      //   if(that.isReadRoleFirst){
      //     that.roleData = []
      //     //ajax调用启用禁用后台方法:查询系统角色套餐
      //     dataListRoles(
      //       //角色套餐都是由系统管理员创建的，该角色所属公司ID为组织架构树根节点ID，下面的ID即是组织架构树的根节点ID
      //       "(company_id = 'b6ff76cb95f711e884ad00163e105f05')").then(res => {
      //       // console.log(res)
      //       let selectedIndex = 0
      //       res.result.forEach(item => {
      //         selectedIndex = selectedIndex + 1
      //         const tempObj = {
      //           // childrens: [],
      //           value: item.id,
      //           label: item.name,
      //           remark: item.remark
      //         }
      //         that.roleData.push(tempObj)
      //         if(selectedIndex = 1){
      //           that.selectedRoleOptions=[]
      //           that.selectedRoleOptions.push(item.id)
      //         }
      //
      //       })
      //       that.isReadRoleFirst = false
      //       // that.$loading().close()
      //     }).catch(err => {
      //       // console.log(err)
      //       // that.$loading().close()
      //     })
      //   }
      //
      // },
      //
      // //套餐角色-下拉列表值改变事件
      // handleRoleChange(val) {
      //   // console.log('active item:', val)
      //   //选择下拉列表某一项后，给role对象ID赋值
      //   this.temp['roleId']= val[0]
      //   // console.log('active item:', this.roleData)
      //   this.roleData.forEach(obj => {
      //     // console.log('active itemobj:', obj)
      //     if(obj.value==val[0]){
      //       this.temp['remark'] = obj.remark
      //     }
      //   })
      //   // console.log('active item:', this.temp.id);
      // },
      //
      // //套餐角色-下拉列表动态加载次级选项
      // handleRoleView(val) {
      //   console.log('11active item:', val);
      //   // setTimeout(_ => {
      //   //   if (val.indexOf('0a08e254a1e611e884ad00163e105f05') > -1 && !this.roleData[0].roles.length) {
      //   //     this.roleData[0].roles = [{
      //   //       // childrens: [],
      //   //       label: '南京',
      //   //       value: '南京'
      //   //     }];
      //   //   }
      //   // }, 300);
      // },
      //
      //
      //
      // //企业性质-下拉列表动态加载数据
      // handleCompanyTypeFocus() {
      //   // console.log('active item:', val);
      //   const that = this
      //   if(that.isReadCompanyTypeFirst){
      //     that.companyTypeData = []
      //     //ajax调用启用禁用后台方法:查询系统角色套餐
      //     dataListDictionarys(
      //       'companyType'
      //     ).then(res => {
      //       // console.log(res)
      //       let selectedIndex = 0
      //       res.result.forEach(item => {
      //         selectedIndex = selectedIndex + 1
      //         const tempObj = {
      //           // roles: [],
      //           value: item.id,
      //           label: item.name
      //         }
      //         that.companyTypeData.push(tempObj)
      //         if(selectedIndex = 1){
      //           that.selectedCompanyTypeOptions=[]
      //           that.selectedCompanyTypeOptions.push(item.id)
      //         }
      //       })
      //       that.isReadCompanyTypeFirst = false
      //       // that.$loading().close()
      //     }).catch(err => {
      //       // console.log(err)
      //       // that.$loading().close()
      //     })
      //   }
      //
      // },
      //
      // //企业性质-下拉列表值改变事件
      // handleCompanyTypeChange(val) {
      //   // console.log('active item:', val)
      //   //选择下拉列表某一项后，给role对象ID赋值
      //   this.temp['companyType']= val[0]
      //   // console.log('active item:', this.temp.id);
      // },
      //
      // //企业性质-下拉列表动态加载次级选项
      // handleCompanyTypeView(val) {
      //   console.log('active item:', val);
      //   // setTimeout(_ => {
      //   //   if (val.indexOf('0a08e254a1e611e884ad00163e105f05') > -1 && !this.roleData[0].roles.length) {
      //   //     this.roleData[0].roles = [{
      //   //       // roles: [],
      //   //       label: '南京',
      //   //       value: '南京'
      //   //     }];
      //   //   }
      //   // }, 300);
      // },
      //*******************************************************用户自定义修改 end ***************************************************************************



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

        exportExcelCompanys(ids)
          .then(res => {
            // console.log(res)
            if (!res) {
              return
            }
            downLoad(res,"企业账号导出.xls")
            // that.$message({
            //   title: '成功',
            //   message: '导出成功',
            //   type: 'success',
            //   duration: 2000
            // })
          }).catch(err => {
            //console.log(err)
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

<style  lang="scss" rel="text/css">
  .companyManage
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
    height: calc(100% - 60px);
    overflow-y: auto;
    box-sizing: border-box;
    padding: 10px;
  }
  }
  }
  }
</style>
