<template>
  <div class="employeeManage">
    <!--列表界面查询搜索-->
    <!--<el-row  :gutter="10" style="box-sizing: border-box;position: relative;overflow: hidden;transition: height 0.4s;-webkit-transition: height 0.4s;-moz-transition: height 0.4s;" :style="{height: dynaHeight+'px'}">-->
      <!--<div style="position: absolute;">-->
        <!--<el-form :inline="true" :model="tempQuery" class="form-inline">-->
          <!--&lt;!&ndash;员工编号&ndash;&gt;-->
          <!--<el-col :span="6" style="max-width: 260px">-->
            <!--<el-form-item :label="tempLable.code">-->
              <!--<el-input v-model="tempQuery.code" :placeholder="tempLable.code"></el-input>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <!--&lt;!&ndash;员工姓名&ndash;&gt;-->
          <!--<el-col :span="6" style="max-width: 260px">-->
            <!--<el-form-item :label="tempLable.name">-->
              <!--<el-input v-model="tempQuery.name" :placeholder="tempLable.name"></el-input>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <!--&lt;!&ndash;是否在职&ndash;&gt;-->
          <!--<el-col :span="6" style="max-width: 260px">-->
            <!--<el-form-item :label="tempLable.isdisable">-->
              <!--<el-select v-model="tempQuery.isdisable" :placeholder="tempLable.isdisable">-->
                <!--<el-option :label="'是'" value="1"></el-option>-->
                <!--<el-option :label="'否'" value="0"></el-option>-->
              <!--</el-select>-->
            <!--</el-form-item>-->
          <!--</el-col>-->

          <!--&lt;!&ndash;岗位&ndash;&gt;-->
<!--&lt;!&ndash;-->
          <!--<el-col :span="6" style="max-width: 260px">-->
            <!--<el-form-item :label="tempLable.postName">-->
              <!--<el-input v-model="tempQuery.postName" :placeholder="tempLable.postName"></el-input>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
<!--&ndash;&gt;-->
          <!--&lt;!&ndash;是否主岗&ndash;&gt;-->
          <!--<el-col :span="6" style="max-width: 260px">-->
            <!--<el-form-item :label="tempLable.isplurality">-->
              <!--<el-select v-model="tempQuery.isplurality" :placeholder="tempLable.isplurality">-->
                <!--<el-option :label="'是'" value="0"></el-option>-->
                <!--<el-option :label="'否'" value="1"></el-option>-->
              <!--</el-select>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <!--&lt;!&ndash;手机号&ndash;&gt;-->
<!--&lt;!&ndash;-->
          <!--<el-col :span="6" style="max-width: 260px">-->
            <!--<el-form-item :label="tempLable.mobile">-->
              <!--<el-input v-model="tempQuery.mobile" :placeholder="tempLable.mobile"></el-input>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
<!--&ndash;&gt;-->

          <!--<el-col :span="3" style="max-width: 100px">-->
            <!--<el-form-item>-->
              <!--<base-button v-show="configs.queryBarBtnList[0].isShow"  :name='configs.queryBarBtnList[0].name' :icon='configs.queryBarBtnList[0].icon' :plain="configs.queryBarBtnList[0].plain"-->
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
      <!--岗位部门树控件-->
      <el-col :span="4" class="treeStyle">
        <!--<div style="width: 90%;margin: 5px auto">-->
          <!--<el-input v-on:keyup.enter.native="searchDeptByName" :placeholder="'岗位名称'" v-model="filterTextDept" clearable>-->
            <!--<i slot="suffix" class="el-input__icon el-icon-search"></i>-->
          <!--</el-input>-->
        <!--</div>-->
        <!--<div style="padding:5px 0px 10px 20px">-->
          <!--<el-checkbox v-model="showDisableDept">显示封存</el-checkbox>-->
        <!--</div>-->
        <div style="padding-left: 20px;height: 100%">
          <base-tree ref="tree" :data="treeData" :treeConfigs="treeConfigs"
                     @treedatabridge="treeDataBridge" @disable-state="disableState"></base-tree>
        </div>
      </el-col>


      <el-col :span="20" class="tableStyle">
        <div class="baseTable">
          <!--列表界面按钮动态加载-->
          <el-row class="tableTopBar">
            <el-col >
              <div class="tableBtns">
                <template v-for="(item, index) in configs.topBarBtnList">
                  <base-button v-show="item.isShow" :name='item.name' :icon='item.icon' :plain="item.plain" :state="item.state"
                               :dialog="item.dialog" @myclick="item.method"></base-button>
                </template>
              </div>
            </el-col>
          </el-row>

          <!--列表界面table表头及数据动态加载-->
          <el-row class="tableContent">
            <div style="position: absolute;top: 0;left: 10px;right: 10px;bottom: 5px;">
            <base-table :data="tableData" :colConfigs="configs.tableConfigs" :showCheckBox="configs.showCheckBox"
                        :showIndex="configs.showIndex" @databridge="dataBridge"  :pageData="pageData" :currentpage.sync="pageNo"  :isSortable=false></base-table>
            </div>
          </el-row>

        </div>
      </el-col>
    </el-row>


    <!--新增及修改表单界面-->
    <el-dialog v-el-drag-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px" top="10vh" style="height: 90vh" custom-class="listDeliverClass">
      <div v-loading="dialogLoading" style="height:100%;overflow: auto;">
        <el-form :rules="rules" ref="submitForm" :model="temp" label-position="right" label-width="120px"
                 style='width: 570px;padding-top: 10px;'>
          <el-row>
            <el-col :span="12">
              <!--员工照片-->
              <div style="padding-left: 120px">
              <el-upload
                name="fileName"
                class="avatar-uploader"
                :action="temp.uploadUrl"
                :data="fileData"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>

              </div>
            </el-col>
            <el-col :span="12">
              <!--员工编号-->

              <el-form-item :label="tempLable.code+ ':'" prop="code">
                <el-input v-model="temp.code"></el-input>
              </el-form-item>
              <!--员工姓名-->
              <el-form-item :label="tempLable.name+ ':'" prop="name">
                <el-input v-model="temp.name"></el-input>
              </el-form-item>
              <!--性别-->
              <el-form-item :label="tempLable.sexName+ ':'" prop="sexName">
                <el-select v-model="temp.sex" :placeholder="tempLable.sex">
                  <el-option :label="'男'" value="1"></el-option>
                  <el-option :label="'女'" value="0"></el-option>
                </el-select>
              </el-form-item>

            </el-col>
          </el-row>

          <!--2019-09-29 (添加,修改)页面 去掉(岗位)栏位-->
          <!--
          <el-col :span="12">
            <el-form-item :label="tempLable.postName+ ':'" prop="postName">
              <el-input v-model="temp.postName" :disabled="tempNotEditable.postName"></el-input>
            </el-form-item>
          </el-col>
          -->

          <el-row>
            <!--部门-->
            <el-col :span="12">
              <el-form-item :label="tempLable.deptName+ ':'" prop="deptName">
                <el-input v-model="temp.deptName" :disabled="tempNotEditable.deptName"></el-input>
              </el-form-item>
            </el-col>
            <!--手机号 mobile-->
            <el-col :span="12">
              <el-form-item :label="tempLable.mobile+ ':'" prop="mobile">
                <el-input v-model="temp.mobile" @change="checkMobile"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <!--工作位置-->
            <el-col :span="12">
              <el-form-item :label="tempLable.position+ ':'" prop="position">
                <el-input v-model="temp.position"></el-input>
              </el-form-item>
            </el-col>
            <!--宿舍-->
            <el-col :span="12">
              <el-form-item :label="tempLable.dormitory+ ':'" prop="dormitory">
                <el-input v-model="temp.dormitory"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <!--
          <el-row>
            <el-col :span="12">
              <el-form-item :label="tempLable.email+ ':'" prop="email">
                <el-input v-model="temp.email"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="tempLable.birthday+ ':'" prop="birthday">
                <el-date-picker style='width: 165px' v-model="temp.birthday" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" />
              </el-form-item>
            </el-col>
          </el-row>
          -->

          <el-row>
            <!--入职日期 entryDate-->
            <el-col :span="12">
              <el-form-item :label="tempLable.entryDate+ ':'" prop="entryDate">
                <el-date-picker style='width: 165px' v-model="temp.entryDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" />
              </el-form-item>
            </el-col>
            <!--入职日期 entryDate-->
            <el-col :span="12">
              <el-form-item :label="tempLable.contractDate+ ':'" prop="contractDate">
                <el-date-picker style='width: 165px' v-model="temp.contractDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <!--籍贯 nativePlace-->
            <el-col :span="12">
              <el-form-item :label="tempLable.nativePlace+ ':'" prop="nativePlace">
                <el-input v-model="temp.nativePlace"></el-input>
              </el-form-item>
            </el-col>
            <!--政治面貌 politicalName-->
            <el-col :span="12">
              <el-form-item :label="tempLable.politicalName+ ':'" prop="politicalName">
                <base-input-select style='width: 165px' v-model="politicalData.defaultSelected" :placeholder="tempLable.politicalName" :data="politicalData.data"  @callback="politicalSelect" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <!--身份证号 identityNumber-->
            <el-col :span="12">
              <el-form-item :label="tempLable.identityNumber+ ':'" prop="identityNumber">
                <el-input v-model="temp.identityNumber"></el-input>
              </el-form-item>
            </el-col>
            <!--婚姻状况 maritalName-->
            <el-col :span="12">
              <el-form-item :label="tempLable.maritalName+ ':'" prop="maritalName">
                <el-select v-model="temp.marital" :placeholder="tempLable.marital">
                  <el-option :label="'未婚'" value="0"></el-option>
                  <el-option :label="'已婚'" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20" type="flex" justify="end">
            <el-col :span="12">
              <el-checkbox style='padding-left: 120px' label="开通用户账号" v-model="openUserChecked" v-show="isShowOpenUserCheckbox" @change="isOpenUserCode" />
            </el-col>
            <!--角色名称 roleName-->
            <el-col :span="12">
              <el-form-item :label="tempLable.roleName+ '：'" prop="roleName" v-show="isShowRole">
                <!--
                <el-cascader style='width: 165px' size="medium " :options="roleData" v-model="selectedRoleOptions" @active-item-change="handleRoleView" @focus="handleRoleFocus" @change="handleRoleChange" :props="props"/>
                -->
                <base-input-select style='width: 165px;margin-left: -10px' v-model="roleData.defaultSelected" :data="roleData.data" @callback="roleSelect" />

              </el-form-item>
            </el-col>

          </el-row>

          <el-row >
            <el-col :span="24">
              <el-form-item :label="tempLable.remark+ ':'" prop="remark">
                <el-input type="textarea" :rows="2" v-model="temp.remark"></el-input>
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

    <!--开通账号 界面 dialogFormOpenCode-->
    <el-dialog v-el-drag-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormOpenCode" width="700px" top="40px">
      <div v-loading="dialogLoading">
        <el-form :rules="OpenCodeRules" ref="submitForm" :model="temp" label-position="right" label-width="120px"
                 style='width: 400px;margin: 10px auto;'>
          <!--角色-->
          <el-form-item :label="tempLable.roleName+ ':'" prop="roleName">
            <!--
            <el-cascader style='width: 280px' size="medium " :options="roleData" v-model="selectedRoleOptions" @active-item-change="handleRoleView" @focus="handleRoleFocus" @change="handleRoleChange" :props="props"/>
            -->
            <base-input-select style='width: 280px' v-model="roleData.defaultSelected" :data="roleData.data" @callback="roleSelect" />

          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center;padding-bottom: 30px">
          <el-button type="primary" @click="addOpenCode">保存</el-button>
          <el-button @click="dialogFormOpenCode = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  // import baseTable from '@/components/baseTable'
  // import myButton from '@/components/myButton'
  import i18n from '@/lang'
  import searchBar from '@/components/searchBar'
  // ajax后台方法
  import {
    listPageEmployees,     //分页列表查询查询
    addEmployee,           //添加员工信息
    addEmployToUser,       //开通账号
    updateEmployeeAndUser, //修改员工信息
    exportExcelEmployees,  //Excel导出
    updateDisableEmployee, //启用禁用功能
    deleteEmployees,       //批量删除功能
    deleteEmployeeByPost   //删除按钮-删除员工岗位
  } from '@/api/employee'
  //按钮权限
  import {initMenuButtons} from '@/api/button'
  // 部门岗位树
  import {treeDeptPosts} from '@/api/post'

  //下拉列表ajax数据请求
  import {dataListDictionarys} from '@/api/dictionary'
  import {dataListRoles} from '@/api/role'

  //	公共方法
  import {filerTableTitle,circleTree,downLoad} from '@/utils/common'


  //	  table操作栏里面的按钮
  const operateBtns = {
    props: ['colConfig','fixed'],
    template: `<el-table-column :label="colConfig.label" :fixed="fixed" :sortable="colConfig.sortable" align="center">
      					<div slot-scope="scope" class="btnBox">
      							<el-button  v-show="colConfig.editBtns_isShow" type="text" class="btns" style="font-size: 12px;" @click="colConfig.editBtns(scope.row,scope.$index)">编辑</el-button>
      					</div>
    				</el-table-column>`
  }
  //	  table状态栏里面的按钮
  const stateBtns = {
    props: ['colConfig','fixed'],
    template: `<el-table-column :label="colConfig.label" :fixed="fixed" :sortable="colConfig.sortable" align="center">
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
            label: '员工编号',
            type: 'input',
            ruleType: 'string',
            mapKey: 'code',
            configs: {},
            placeholder: '员工编号'
          },
          {
            label: '员工姓名',
            type: 'input',
            ruleType: 'string',
            mapKey: 'name',
            configs: {},
            placeholder: '员工姓名'
          },{
            label: '是否主岗',
            type: 'select',
            ruleType: 'string',
            mapKey: 'isplurality',
            configs: {
              clearable: true,
              name: '',
              options: [{
                value: '0',
                label: '是'
              },{
                value: '1',
                label: '否'
              }]
            },
            placeholder: '请选择'
          },{
            label: '是否在职',
            type: 'select',
            ruleType: 'string',
            mapKey: 'isdisableByQuery',
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
          }
        ],
        searchConfig: {
          hideSearchSwitch: false,//设置是否隐藏搜索列，隐藏为true,不隐藏为false，非必要设置
        },





        dialogLoading: false,

        userInfo: null,

        //树搜索框文本查询
        filterTextDept: '',
        //搜索框回车查询次数
        enterTime: 0,
        //是否显示封存部门，默认不显示
        showDisableDept: false,
        //通过搜索框查询到的树节点集合
        treeNodes: [],

        /*初始化数据*/
        //员工照片上传后地址
        imageUrl: '',

        //搜索栏数据
        hideTime: 700,
        dynaHeight: 40,
        clientHeight: 0,
        dynaHeightTimer: null,
        dynaHeightState: null,









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

        //模块按钮
        configs: {


          //查询及重置按钮
          queryBarBtnList: [{
            name: '查询',
            nameEn: 'query',
            isShow: true,
            icon: 'search',
            method: this.queryTable
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
            },{
              name: '删除',
              nameEn: 'delete',
              isShow: true,
              icon: 'delete',
              plain: true,
              state: true,
              method: this.deleteBatch//自定义按钮方法-删除
            }, {
              name: '开通账号',
              nameEn: 'openCode',
              isShow: true,
              icon: 'add',
              plain: true,
              state: true,
              method: this.showOpenCode
            }, {
              name: '岗位变更',//岗位变更
              nameEn: 'changePost',
              isShow: true,
              icon: 'edit',
              plain: true,
              state: true,
              method: this.dialogCallBack,
              dialog: {
                enable: true,
                data: {
                  isSingle :true,
                  key: 'deptId',
                  employeeList: null,
                  timeStamp: ''
                },
                dialogName: 'dialogPost'
              }
            }, {
              name: '新增兼岗',//新增兼岗
              nameEn: 'pluralityPost',
              isShow: true,
              icon: 'edit',
              plain: true,
              state: true,
              method: this.dialogCallBack,
              dialog: {
                enable: true,
                data: {
                  isSingle :false,
                  key: 'deptId',
                  employeeList: null,
                  timeStamp: ''
                },
                dialogName: 'dialogPost'
              }
            },{
              name: '导出',
              nameEn: 'export',
              isShow: true,
              icon: 'export',
              method: this.exportExcel
            },{
              name: '导入',
              nameEn: 'import',
              isShow: true,
              icon: 'import',
              method: this.importExcelCallBack,
              dialog: {
                enable: true,
                data: {
                  exportUrl: '/fileUpload/excelTemplet/EmployeeBySimpleExcelImport.xlsx',
                  importUrl: '/system/employee/importExcelEmployeeBySimple'
                },
                dialogName:'dialogImportExcel',
              }
            }
          ],
          tableConfigs: [],
          showCheckBox: false,//是否显示行级单选框
          showIndex: false,    //是否显示行号
        },
        timeStamp: '',

        //table数据集
        tableData: [],

        //行数据选择列表
        selectList: null,

        //树表数据集
        treeData: [],

        //树表默认参数
        treeConfigs: {
          ref: 'tree',
          showCheckBox: false,
          showIcons: false,
          showSearch: true,
          showDisable: false
        },

        //默认选中的树节点
        selectTree: {
          pid: '',
          id: '',
          name: ''
        },

        //开通账号界面属性
        dialogFormOpenCode:false,

        //开通用户账号
        isShowOpenUserCheckbox: false,
        openUserChecked: false,
        //是否显示 角色名称
        isShowRole: false,

        // 表单标题及状态值
        dialogFormVisible: false,

        dialogStatus: '',
        textMap: {
          update: '编辑菜单',
          create: '新增菜单'
        },

        //上传员工图片-文件上传参数
        //String relativePath = "fileUpload/Photo/"+photoDir;//上传文件的相对路径
        //relativePath = relativePath + today;
        fileData: {photoDir: "employee/"},

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
          // code: [{
          //   required: true,
          //   message: '请填写员工编号',
          //   trigger: 'change'
          // }],
          name: [{
            required: true,
            message: '请填写员工姓名',
            trigger: 'change'
          }],
          sex: [{
            required: true,
            message: '请填写性别',
            trigger: 'change'
          }],
          roleName: [{
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if ( this.roleData.defaultSelected.length <= 0) {
                callback(new Error('请选择角色'));
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
          // postName: [{
          //   required: true,
          //   message: '请填写岗位',
          //   trigger: 'change'
          // }],
          ////////////////////////////////////////////////////////////////
          // roleName: [{
          //   required: true,
          //   message: '请填写角色名称',
          //   trigger: 'change'
          // }],
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
        },

        OpenCodeRules: {
          // roleName: [{
          //   required: true,
          //   message: '请填写角色名称',
          //   trigger: 'change'
          // }]
        },

        //分页参数集合及当前默认页面
        pageData: null,
        pageNo: 1,

        //政治面貌-下拉列表数据集合
        // politicalData: [],
        // isReadPoliticalFirst: true,
        // selectedPoliticalOptions: [],

        // //角色-下拉列表数据集合
        // roleData: [],
        // isReadRoleFirst: true,
        // selectedRoleOptions: [],

        //下拉列表自定义参数
        props: {
          value: 'value',
          label: 'label',
          children: 'childrens'
        },

        //政治面貌
        politicalData: {
          data: {
            selectUrl: '/system/dictionary/getDictionarys',
            selectParm: {dictionaryKey:'political',isglobal:'0'},
          },
          defaultSelected: ['ebb2eae0e5c3479aa1b19a9251917077'],
        },

        //角色名称
        roleData: {
          data: {
            selectUrl: '/system/role/getRoles',
            selectParm: {queryStr:''},
          },
          defaultSelected: [],
        },

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
      that.userInfo = that.$storage.get('userInfo')
      //按钮初始化
      that.initButtons()
      //加载左树右表
      that.initTree()
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
        this.initTable(this.selectTree.id, this.selectTree.type, this.selectTree.layer,null)
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

      disableState(isdisable){
        // console.log(isdisable)
        this.initTree(isdisable,true)
        // const that = this
        // circleTree(that.treeData,isdisable,that.filterTextDept,that.treeNodes)
      },

      //加载部门岗位树
      initTree(isdisable,notInitTable) {
        const that = this
        let postDisable = "1"
        let deptDisable = "1"
        if(isdisable){
          postDisable = ""
          deptDisable = ""
        }
        treeDeptPosts({
          postDisable:postDisable,
          deptDisable:deptDisable,
          deptID: that.userInfo.companyId
        }).then(res => {
          const newTree = []
          const root = res.result.treeList
          that.selectTree = {
            pid: root.pid,
            id: root.id,
            name: root.name,
            type: root.type,
            layer: root.layer,
            deptName: root.deptName,
            postName: root.postName
          }
          newTree.push(root)
          that.treeData = newTree

          that.treeNodes = []
          //初次不显示已封存节点
          // circleTree(that.treeData,that.showDisableDept,that.filterTextDept,that.treeNodes)
          that.$nextTick(function () {
            if(that.treeNodes.length>0){
              let selectTreeNode = that.treeNodes[0]
              that.selectTree = {
                pid: selectTreeNode.pid,
                id: selectTreeNode.id,
                name: selectTreeNode.name,
                type: selectTreeNode.type,
                layer: selectTreeNode.layer,
                deptName: selectTreeNode.deptName,
                postName: selectTreeNode.postName
              }
            }
            //hat.$refs.tree.$children[0].setCurrentKey(that.selectTree.id)
            if(!notInitTable){
              that.initTable(that.selectTree.id, that.selectTree.type, that.selectTree.layer,true)
            }

          })

        }).catch(err => {
          console.log(err)
          that.$loading().close()
        })
      },

      treeDataBridge(data) {
        const that = this
        that.selectTree = {
          pid: data.nodeData.pid,
          id: data.nodeData.id,
          name: data.nodeData.name,
          type: data.nodeData.type,
          layer: data.nodeData.layer,
          deptName: data.nodeData.deptName,
          postName: data.nodeData.postName
        }
        that.pageNo=1
        that.initTable(that.selectTree.id, that.selectTree.type, that.selectTree.layer)
      },

      //通过搜索栏查询，加载table列表
      queryTable(){
        const that = this;
        that.pageNo = 1;
        that.initTable(that.selectTree.id, that.selectTree.type, that.selectTree.layer);
      },

      //加载table列表
      initTable(id, type, layer,isClosedLoading){
        const that = this

        //页面初始化列表及分页参数
        listPageEmployees({
          ...that.tempQuery,
          id: id,
          type: type,
          layer: layer,
          dataType: this.$storage.get('dataType'),
          pageNo: that.pageNo
        }).then(res => {
          if(isClosedLoading){
            that.$loading().close()
          }
          that.getListPage(res)
        }).catch(err => {
          //console.log(err)
          that.$loading().close()
        })

        //政治面貌-下拉列表初始化
        //that.handlePoliticalFocus()
        //角色名称-下拉列表初始化
        //that.handleRoleFocus()
      },



      //加载table列头及列表数据
      getListPage(res) {
        const that = this
        if (res) {
          //console.log(res.result.titles)
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
          if (item.label ===  '是否在职') {
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
          that.textMap.create="Add"
          that.textMap.update="Edit"

          that.textMap.OpenCode = "OpenUserCode"

          //form表单特殊字段国际化处理
          // that.tempLable[key]=英文名
        }else if(i18n.locale == "zh"){
          //列表操作列国际化处理
          that.initConfigs.tableOperates.label="操作"
          // that.initConfigs.tableOperates.isPropName = true
          //弹出窗标题国际化处理
          that.textMap.create="新增"
          that.textMap.update="编辑"

          that.textMap.OpenCode = "开通账号"

          //form表单特殊字段国际化处理
          // that.tempLable[key]=中文名
        }
      },



      //自定义状态列回调函数
      changeState(item, index) {
        const that = this
        console.log(item)
        updateDisableEmployee(item.id,item.employeeId,item.userId,item.isdisable )
          .then(res => {
            //console.log(res)
            //that.$loading().close()
          }).catch(err => {
          //console.log(err)
          if ("0" == item.isdisable) {
            item.isdisable = "1";
          }
          //that.$loading().close()
        })
      },

      //通过单选框触发事件 获取table组件传回的数据
      dataBridge(data) {
        // console.log("*********"+data)
        const that = this
        that.selectList = data

        //var jsonStr = JSON.stringify(data);
        //console.log("jsonStr: " + jsonStr);

        // add  delete  openCode  changePost  pluralityPost export
        // //岗位变更
        // that.configs.topBarBtnList[3].dialog.data.employeeList = data
        // that.configs.topBarBtnList[3].dialog.data.timeStamp = new Date().getTime()
        //
        // //新增兼岗
        // that.configs.topBarBtnList[4].dialog.data.employeeList = data
        // that.configs.topBarBtnList[4].dialog.data.timeStamp = new Date().getTime()


        that.configs.topBarBtnList.forEach(item => {
          if(item.nameEn=='changePost'||item.nameEn=='pluralityPost'){ //岗位变更||新增兼岗
            item.dialog.data.employeeList = data
            item.dialog.data.timeStamp = new Date().getTime()
          }
        })

        if (data.length) {
          that.configs.topBarBtnList.forEach(item => {
            if(item.nameEn=='delete'||item.nameEn=='changePost'||item.nameEn=='pluralityPost'){
              item.state = false
              //item.openCodeState = false
            }
            if (item.nameEn=='openCode') {
              that.selectList.forEach(item_1 => {
                let userId = item_1.userId;
                console.log("userId: " + userId);
                if (userId != null && userId.trim().length > 0) {
                  item.state = true;
                } else {
                  let isOpenUser = item_1.isOpenUser;
                  //是否开通用户 0:不开通 1:开通 is null 不开通
                  if ("1" != isOpenUser) {
                    item.state = false;
                  }
                }
              })
            }

          })
          // that.configs.topBarBtnList[1].state = false  //删除按钮的状态变更
          // that.configs.topBarBtnList[3].state = false  //删除按钮的状态变更
          // that.configs.topBarBtnList[4].state = false
        } else {
          that.configs.topBarBtnList.forEach(item => {
            if(item.nameEn=='delete'||item.nameEn=='changePost'||item.nameEn=='pluralityPost'||item.nameEn=='openCode'){
              item.state = true
            }
          })
          // that.configs.topBarBtnList[1].state = true   //删除按钮的状态变更
          // that.configs.topBarBtnList[3].state = true  //删除按钮的状态变更
          // that.configs.topBarBtnList[4].state = true

        }
      },

      //开通账号-界面
      showOpenCode() {
        //树节点类型
        //"dept" 部门 "post" 岗位
        const type = this.selectTree.type;
        if ("dept" == type) {
          this.temp.deptId = this.selectTree.id;
          this.temp.deptName = this.selectTree.deptName;
        } else if ("post" == type) {
          this.temp.deptId = this.selectTree.pid;
          this.temp.deptName = this.selectTree.deptName;

          this.temp.postId = this.selectTree.id;
          this.temp.postName = this.selectTree.postName;
        }
        // if ("post" == type) {
        //   this.$message({
        //     showClose: true,
        //     message: '当前节点为岗位，请选择正确的部门！',
        //     duration: 5*1000
        //   });
        //   return;
        // }

        //角色名称-设置下拉列表默认值
        if (this.temp.deptId) {
          this.roleData.data = {
            selectUrl: '/system/role/getRoles',
            selectParm: {queryStr:"(company_id = (select case when id_1 is null or id_1 = '' then id_0 else id_1 end from vmes_department where  id = '"+this.temp.deptId+"')    )"},
          }
        }
        this.roleData.defaultSelected = []

        //设置当前弹窗界面为新增界面
        this.dialogStatus = 'OpenCode';
        this.dialogFormOpenCode = true;

        this.$nextTick(() => {
          this.$refs['submitForm'].clearValidate()
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

        this.temp['uploadUrl'] = process.env.BASE_API + '/fileIO/file/uploadPhoto'

        //开通用户账号
        this.isShowOpenUserCheckbox = true;
        this.openUserChecked = true;
        //是否显示 角色名称
        this.isShowRole = true;

        //设置不可编辑字段
        //this.tempNotEditable.code = false;
        this.tempNotEditable.deptName = true;
        this.tempNotEditable.postName = true;

        //所属部门
        this.temp.deptId = "";
        this.temp.deptName = "";

        //所属岗位
        this.temp.postId = "";
        this.temp.postName = "";

        //员工图片
        this.imageUrl = "";

        this.rules.roleName = [{
          required: true,
          trigger: 'change',
          validator: (rule, value, callback) => {
            if ( this.roleData.defaultSelected.length <= 0) {
              callback(new Error('请选择角色'));
            } else {
              callback();
            }
          }
        }]

        //树节点类型
        //"dept" 部门 "post" 岗位
        const type = this.selectTree.type;
        if ("dept" == type) {
          this.temp.deptId = this.selectTree.id;
          this.temp.deptName = this.selectTree.deptName;
        } else if ("post" == type) {
          this.temp.deptId = this.selectTree.pid;
          this.temp.deptName = this.selectTree.deptName;

          this.temp.postId = this.selectTree.id;
          this.temp.postName = this.selectTree.postName;
        }
        if ("dept" == type) {
          this.$message({
            showClose: true,
            message: '当前节点为部门，请选择正确的岗位！',
            duration: 5*1000
          });
          return;
        }
        //政治面貌-设置下拉列表默认值
        //this.temp.political = this.selectedPoliticalOptions[0];
        this.temp.political = this.politicalData.defaultSelected[0]

        //角色名称-设置下拉列表默认值
        //this.temp.roleId = this.selectedRoleOptions[0];
        //this.temp.roleId = this.roleData.defaultSelected[0];
        if(this.temp.deptId){
          this.roleData.data = {
            selectUrl: '/system/role/getRoles',
            selectParm: {queryStr:"(company_id = (select case when id_1 is null or id_1 = '' then id_0 else id_1 end from vmes_department where  id = '"+this.temp.deptId+"')    )"},
          }
        }
        this.roleData.defaultSelected = []

        //设置当前弹窗界面为新增界面
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['submitForm'].clearValidate()
        })
      },

      //行级按钮-编辑
      editBtns(item, index) {
        this.resetTemp();

        //员工图片
        //将item对象转成json字符串，然后又将字符串转成新生成的json对象，最后将这个json对象直接传递给temp。如果直接将item对象传递给temp，那后面对temp进行数据修改同时也会对item对象进行修改。为了防止这种情况，我们采用了json转换对象的间接传递。
        this.temp = JSON.parse(JSON.stringify(item))
        if(this.temp.photo){
          this.imageUrl = process.env.BASE_API + this.temp.photo;
        }else{
          this.imageUrl = ''
        }

        this.temp['uploadUrl'] = process.env.BASE_API + '/fileIO/file/uploadPhoto'


        this.rules.roleName = [{
          required: true,
          trigger: 'change',
          validator: (rule, value, callback) => {
            if ( this.roleData.defaultSelected.length <= 0) {
              callback(new Error('请选择角色'));
            } else {
              callback();
            }
          }
        }]


        //政治面貌
        this.politicalData.defaultSelected=[]
        this.politicalData.defaultSelected.push(item.political)

        //角色名称
        if(this.temp.deptId){
          let queryRoleId = ''
          if(this.temp.roleId){
            queryRoleId = " or id = '" + this.temp.roleId + "' ";
          }

          this.roleData.data = {
            selectUrl: '/system/role/getRoles',
            selectParm: {queryStr:"(company_id = (select case when id_1 is null or id_1 = '' then id_0 else id_1 end from vmes_department where id = '"+this.temp.deptId+"')" + queryRoleId + ")"},//全局
          }
        }
        this.roleData.defaultSelected = [this.temp.roleId]

        //开通用户账号
        this.isShowOpenUserCheckbox = false;
        this.openUserChecked = false;
        //是否显示 角色名称
        this.isShowRole = false;
        if ("1" == this.temp.isOpenUser) {
          this.isShowRole = true;
        }

        //设置不可编辑字段
        // this.tempNotEditable.code = true
        this.tempNotEditable.deptName = true;
        this.tempNotEditable.postName = true;

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
        //是否开通用户 isOpenUser
        that.temp.isOpenUser = "0";
        if (that.openUserChecked) {
          that.temp.isOpenUser = "1";
        }

        that.$refs['submitForm'].validate((valid) => {
          if (valid) {
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
            updateEmployeeAndUser(that.temp)
              .then(res => {
                that.dialogLoading = false
                //console.log(res)
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
              that.dialogLoading = false
              console.log(err)
            })

          }
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
        //是否开通用户 isOpenUser
        that.temp.isOpenUser = "0";
        if (that.openUserChecked) {
          that.temp.isOpenUser = "1";
        }

        this.$refs['submitForm'].validate((valid) => {
          if (valid) {
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
            addEmployee(that.temp)
              .then(res => {
                that.dialogLoading = false
                // that.$loading().close()
                //console.log(res)
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
              that.dialogLoading = false
              // that.$loading().close()

            })


          }
        })
      },

      //开通账号
      // addOpenCode() {
      //   const that = this;
      //   console.log("in addOpenCode()");
      // },


      addOpenCode() {
        const that = this

        let roleId = that.temp.roleId;
        if (roleId == null || roleId.trim().lang == 0) {
          this.$message({
            message: '角色名称为空，角色名称为必填项不可为空！',
            type: 'error',
            duration: 5 * 1000
          });
          return;
        }

        let employRoles = []

        this.$refs['submitForm'].validate((valid) => {
          if (valid) {
            that.dialogLoading = true
            that.selectList.forEach(item => {
              //console.log("roleId: " + that.temp.roleId);

              let employRole = {employeeId:"",roleId:""}
              employRole.employeeId = item.employeeId
              employRole.roleId = that.temp.roleId
              employRoles.push(employRole)
            })

            var jsonStr = JSON.stringify(employRoles);
            //console.log("jsonStr: " + jsonStr);

            addEmployToUser(jsonStr)
              .then(res => {
                that.dialogLoading = false
                if (res.code === 0) {
                  that.dialogFormOpenCode = false
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

      //验证勾选数据(员工)是否是主岗
      checkColumnByDelete(tableData) {
        let mesgStr = "";
        for (let i = 0; i < tableData.length; i++) {
          let rowData = tableData[i];

          //isplurality 是否主岗 (1:兼岗0:主岗)
          let isplurality = rowData.isplurality;
          console.log("isplurality: " + isplurality);

          if ('是' == isplurality) {
            mesgStr = mesgStr + "勾选的 第 " + (i+1) + " 行: 员工是主岗不可删除！";
          }
        }

        return mesgStr;
      },

      //删除-删除员工岗位
      deleteBatch() {
        if (this.selectList == null || this.selectList.length == 0) {
          this.$message({
            type: 'warning',
            duration: 5 * 1000,
            showClose: true,
            message: '请至少选择一行数据！',
          });
          return;
        }
        //console.log("this.selectList.length: " + this.selectList.length);

        //验证勾选数据(员工)是否是主岗
        let mesgStr = this.checkColumnByDelete(this.selectList);
        if (mesgStr != null && mesgStr.trim().length > 0) {
          this.$message({
            type: 'warning',
            duration: 5 * 1000,
            showClose: true,
            message: mesgStr,
          });

          return;
        }

        let employeePostIds = ''
        this.selectList.forEach(item => {
          employeePostIds = employeePostIds + item.employPostId + ','
        });
        //console.log("employeePostIds: " + employeePostIds);

        this.$confirm('此操作将删除勾选员工的兼职岗位, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteEmployeeByPost({employeePostIds:employeePostIds}).then(res => {
              if (res.code === 0) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
                })
                this.refreshTable()
              }
            }).catch(err => {
            //console.log(err)
            // that.$loading().close()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

        // const that = this
        //
        // that.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   // that.$loading({
        //   //   spinner: 'none',
        //   //   text: '云上企业'
        //   // })
        //   let employeeIds = ''
        //   that.selectList.forEach(item => {
        //     employeeIds += item.employeeId + ','
        //   })
        //   deleteEmployees(employeeIds)
        //     .then(res => {
        //       // that.$loading().close()
        //       //console.log(res)
        //       if (res.code === 0) {
        //         that.dialogFormVisible = false
        //         that.$notify({
        //           title: '成功',
        //           message: '删除成功',
        //           type: 'success',
        //           duration: 2000
        //         })
        //         that.refreshTable()
        //       }
        //     }).catch(err => {
        //     //console.log(err)
        //     // that.$loading().close()
        //   })
        //
        //
        // }).catch(() => {
        //   that.$message({
        //     type: 'info',
        //     message: '已取消删除'
        //   });
        // });
      },

      //Table列表刷新
      refreshTable() {
        const that = this
        that.$axios.all([
          listPageEmployees({
            ...that.tempQuery,
            id: that.selectTree.id,
            type: that.selectTree.type,
            layer: that.selectTree.layer,
            dataType: this.$storage.get('dataType'),
            pageNo: that.pageNo
          })
        ]).then(that.$axios.spread((res1,res2) => {
          //console.log(res1)
          that.getListPage(res1)
          that.configs.topBarBtnList.forEach(item => {
            if(item.nameEn=='delete'||item.nameEn=='changePost'||item.nameEn=='pluralityPost'||item.nameEn=='openCode'){
              item.state = true
            }
          })
          const root = res2.result.treeList
          const newTree = []
          newTree.push(root)
          that.treeData = newTree
          that.$nextTick(function () {
            //that.$refs.tree.$children[0].setCurrentKey(that.selectTree.id)
          })


        })).catch((error) => {
          console.log(error)
        })

      },


      //政治面貌-下拉列表动态加载数据
      // handlePoliticalFocus() {
      //   const that = this
      //   console.log("in handlePoliticalFocus() *********************");
      //
      //   if(that.isReadPoliticalFirst){
      //     that.politicalData = []
      //     //ajax调用启用禁用后台方法:查询系统角色套餐
      //     dataListDictionarys(
      //       'political'
      //     ).then(res => {
      //       //console.log(res)
      //       let selectedIndex = 0
      //       res.result.forEach(item => {
      //         selectedIndex = selectedIndex + 1
      //         const tempObj = {
      //           value: item.id,
      //           label: item.name
      //         }
      //         that.politicalData.push(tempObj)
      //         if(selectedIndex = 1){
      //           that.selectedPoliticalOptions=[]
      //           that.selectedPoliticalOptions.push(item.id)
      //         }
      //       })
      //       that.isReadPoliticalFirst = false
      //       //that.$loading().close()
      //     }).catch(err => {
      //       //console.log(err)
      //       //that.$loading().close()
      //     })
      //   }
      // },

      //政治面貌-下拉列表值改变事件
      // handlePoliticalChange(val) {
      //   this.temp.political = val[0];
      // },

      //政治面貌-下拉列表动态加载次级选项
      // handlePoliticalView(val) {
      // },

      //政治面貌-下拉列表值改变事件
      politicalSelect(data,option,optionNames){
        // console.log("wwww")
        // console.log(data)
        // this.temp.political = data[0]
        if(data&&data.length>0){
          this.temp['political'] = option.id
          this.politicalData.defaultSelected = data
        }else {
          this.temp['political'] = []
          this.politicalData.defaultSelected = []
        }
      },

      // //角色名称-下拉列表动态加载数据
      // handleRoleFocus() {
      //   const that = this
      //
      //   //获取部门id
      //   const type = this.selectTree.type;
      //   let deptId = "";
      //   if ("dept" == type) {
      //     deptId = this.selectTree.id;
      //   } else if ("post" == type) {
      //     deptId = this.selectTree.pid;
      //   }
      //
      //   let queryStr = "";
      //   if(deptId){
      //     queryStr = "(company_id = (select case when id_1 is null or id_1 = '' then id_0 else id_1 end from vmes_department where  id = '" + deptId + "'))"
      //   }
      //
      //   if(that.isReadRoleFirst){
      //     that.roleData = []
      //     //ajax调用启用禁用后台方法:查询系统角色套餐
      //     dataListRoles(
      //       //角色套餐都是由系统管理员创建的，该角色所属公司ID为组织架构树根节点ID，下面的ID即是组织架构树的根节点ID
      //       queryStr ).then(res => {
      //       //console.log(res)
      //       let selectedIndex = 0
      //       res.result.forEach(item => {
      //         selectedIndex = selectedIndex + 1
      //         const tempObj = {
      //           // childrens: [],
      //           value: item.id,
      //           label: item.name
      //         }
      //         that.roleData.push(tempObj)
      //         if(selectedIndex = 1){
      //           that.selectedRoleOptions=[]
      //           that.selectedRoleOptions.push(item.id)
      //         }
      //       })
      //       that.isReadRoleFirst = false
      //       // that.$loading().close()
      //     }).catch(err => {
      //       //console.log(err)
      //       // that.$loading().close()
      //     })
      //   }
      // },

      // //角色名称-下拉列表值改变事件
      // handleRoleChange(val) {
      //   //选择下拉列表某一项后，给role对象ID赋值
      //   this.temp.roleId = val[0]
      // },

      // //角色名称-下拉列表动态加载次级选项
      // handleRoleView(val) {
      // },

      roleSelect(data){
        // const that = this
        // that.temp.roleId = data[0]

        const that = this
        // that.temp['roleId'] = data[0]
        if(data[0]){
          that.roleData.defaultSelected = [data[0]]
          that.temp['roleId'] = data[0]
        }else {
          that.roleData.defaultSelected = []
          that.temp['roleId'] = []
        }

      },

      //开通用户账号
      isOpenUserCode(val) {
        const that = this;
        that.isShowRole = val
        that.openUserChecked = val
        that.rules.roleName = null
      },

      //文件上传方法:
      handleAvatarSuccess(res) {
        //jsonStr: {"code":0,"msg":"图片上传成功！","photo":"employee/photo/20180831/153569657221523e.jpg"}
        console.log(res)
        const that = this;
        if (res.code == 0) {
          let photoUrl = res.photo;
          if (photoUrl != null && photoUrl.trim().length > 0) {
            that.temp.photo = photoUrl;
            that.imageUrl = process.env.BASE_API + photoUrl;
            console.log(that.imageUrl)
          }
          this.$message({
            message: '图片上传成功！',
            type: 'success',
            duration: 5 * 1000
          });
        } else if (res.code != 0 && res.msg != null && res.msg.trim().length > 0) {
          this.$message.error(res.msg.trim());
        }
      },

      beforeAvatarUpload(file) {
        let fileType = file.type;
        fileType = fileType.replace("image/", "");

        if ("jpg,jpeg,png".indexOf(fileType) == -1) {
          this.$message({
            message: '上传员工照片只能是(jpg,jpeg,png)格式文件!',
            type: 'error',
            duration: 5 * 1000
          });
          return;
        }

        //最大上传文件大小(M)
        const maxFileSize = 5 * 1024 * 1024;
        if (file.size > maxFileSize) {
          this.$message({
            message: '上传员工照片大小不能超过 5MB!',
            type: 'error',
            duration: 5 * 1000
          });
          return;
        }
      },

      //弹窗按钮返回值
      dialogCallBack(data) {
        this.timeStamp = data
      },

      // //Excel文件导出
      // exportExcel() {
      //   let path = process.env.BASE_API;
      //   path = path + "employee/exportExcelEmployees";
      //
      //   const fileName = "Excel员工数据导出";
      //   path = path + "?fileName=" + fileName;
      //
      //   //获取勾选id
      //   let ids = "";
      //   const that = this;
      //   if (that.selectList != null && that.selectList.length > 0) {
      //     that.selectList.forEach(item => {
      //       ids = ids + item.id + ','
      //     })
      //   }
      //
      //   if (ids.trim().length > 0) {
      //     path = path + "&ids=" + ids;
      //   }
      //   //console.log("path: " + path);
      //   window.open(path);
      // },

      //树表搜索框文本查询
      searchDeptByName(){
        const that = this
        that.treeNodes = []
        //初次不显示已封存节点
        circleTree(that.treeData,that.showDisableDept,that.filterTextDept,that.treeNodes)
        that.enterTime = that.enterTime + 1
        that.$nextTick(function () {
          if(that.treeNodes.length>0){
            // console.log('active item:', that.enterTime,"++++",that.treeNodes.length)
            let selectTreeNode = that.treeNodes[that.enterTime%that.treeNodes.length]
            that.selectTree = {
              pid: selectTreeNode.pid,
              id: selectTreeNode.id,
              name: selectTreeNode.name,
              type: selectTreeNode.type,
              layer: selectTreeNode.layer,
              deptName: selectTreeNode.deptName,
              postName: selectTreeNode.postName
            }
          }
          //that.$refs.tree.$children[0].setCurrentKey(that.selectTree.id)
          that.initTable(that.selectTree.id, that.selectTree.type, that.selectTree.layer)
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
        exportExcelEmployees(ids)
          .then(res => {
            // console.log(res)
            if (!res) {
              return
            }
            downLoad(res,"员工管理导出.xls")
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

      //Excel文件导入
      importExcelCallBack() {
        this.refreshTable();
      }

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
        const that = this
        that.initTable(that.selectTree.id, that.selectTree.type, that.selectTree.layer)
      },
      timeStamp: function () {
        const that = this

        that.configs.topBarBtnList.forEach(item => {
          if(item.nameEn=='changePost'||item.nameEn=='pluralityPost'){
            if(this.timeStamp !== item.dialog.data.timeStamp){
              //调用方法更新table
              that.refreshTable()
            }
          }
        })

        // if(this.timeStamp !== this.configs.topBarBtnList[3].dialog.data.timeStamp || this.timeStamp !== this.configs.topBarBtnList[4].dialog.data.timeStamp){
        //   //调用方法更新table
        //   that.refreshTable()
        // }
      },
      //监听是否显示封存部门
      showDisableDept: function () {
        const that = this
        that.initTree()
      },
      // //监听部门名称查询
      // filterTextDept: function(val) {
      //   const that = this
      //   that.initTree()
      // }
    }
  }
</script>


<!--员工照片-上传控件样式-->
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 120px;
    display: block;
  }
</style>

<style lang="scss" rel="text/css">
  .employeeManage {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 0;
    box-sizing: border-box;
    /*border: 1px solid #E4E4E4;*/
    /*border-bottom: none;*/
    .treeStyle {
      position: relative;
      background-color: #F9FAFC;
      overflow-y: auto;
      padding: 5px;
      height: 100%;
    }
    .tableStyle {
      height: 100%;
      overflow-x: auto;
      position: relative;
      .baseTable {
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
        > .tableTopBar {
          flex-shrink: 0;
          box-sizing: border-box;
          padding: 10px;
          padding-bottom: 0;
        }
        > .tableContent {
          flex-grow: 1;
          position: relative;
        }
      }
      .tableBtns {
        >.myButtons {
          margin-left: 0;
          margin-right: 10px;
          margin-bottom: 5px;
        }
      }
    }
  }
</style>
