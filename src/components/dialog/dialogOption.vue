<template>
  <el-dialog v-el-drag-dialog  :title="title" :visible.sync="isVisible" @close="dialogClose" append-to-body width="900px">
    <div style="" v-loading="dialogTopLoading">



        <div style="height: 50px;box-sizing: border-box;padding: 7px 20px 7px 7px;">

          <el-form :inline="true" :model="tempQuery" class="form-inline" style='width: 900px;margin: 10px auto;' label-width="80px">
            <el-col :span="6" style="max-width: 260px">

            </el-col>
            <el-col :span="6" style="max-width: 260px">
              <el-form-item :label="tempLable.code">
                <el-input v-model="tempQuery.code" :placeholder="tempLable.code"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" style="max-width: 260px">
              <el-form-item :label="tempLable.name">
                <el-input v-model="tempQuery.name" :placeholder="tempLable.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3" style="max-width: 90px">
              <el-form-item>
                <base-button :name='topBarBtnList[0].name' :icon='topBarBtnList[0].icon' :plain="topBarBtnList[0].plain"
                           :state="topBarBtnList[0].state"
                           @myclick="topBarBtnList[0].method"></base-button>
              </el-form-item>
            </el-col>
            <el-col :span="3" style="max-width: 95px">
              <el-form-item>
                <base-button :name='topBarBtnList[1].name' :icon='topBarBtnList[1].icon' :plain="topBarBtnList[1].plain"
                           :state="topBarBtnList[1].state"
                           @myclick="topBarBtnList[1].method"></base-button>
              </el-form-item>
            </el-col>
          </el-form>

        </div>


        <div style="box-sizing: border-box;padding: 7px;">
          <base-table :data="tableData" :colConfigs="configs.tableConfigs" :showCheckBox="configs.showCheckBox"
                      :showIndex="configs.showIndex" @databridge="dataBridge"  :isSingle="configs.isSingle" :pageData="pageData" :currentpage.sync="pageNo"></base-table>
        </div>


        <div slot="footer" class="dialog-footer" style="position: relative; height: 60px;text-align: center;box-sizing: border-box;padding: 10px 0 0 0;">
          <el-button type="primary" :disabled="!selectList.length" @click="isVisible = false">确认</el-button>
          <!--<el-button @click="isVisible = false" style="margin-left: 30px">关闭</el-button>-->
          <el-button @click="closeDialogPage">取消</el-button>
        </div>

    </div>
  </el-dialog>
</template>

<script>
  // import baseTable from '@/components/baseTable'
  import i18n from '@/lang'

  // ajax后台方法
  import request from '@/utils/request'


  //	公共方法
  import {filerTableTitle} from '@/utils/common'


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

    name: "dialog-option",
    props: ['initData','visible'],

    //数据
    data() {
      return {
        buttonName:'',
        dialogTopLoading: false,
        isVisible: false,

        title: '',


        /*初始化数据*/
        userInfo: null,


        //查询及重置按钮
        topBarBtnList: [{
          name: '查询',
          icon: 'search',
          method: this.queryTable
        }, {
          name: '重置',
          icon: 'refresh',
          plain: true,
          method: this.resetQueryTemp
        }],



        configs: {
          tableConfigs: [],
          showCheckBox: false,//是否显示行级单选框
          showIndex: false,    //是否显示行号
          isSingle: false,
        },

        //table数据集
        tableData: [],

        //行数据选择列表
        selectList: [],

        // query查询字段
        queryParms: [{name: 'code'},{name: 'name'}],

        // query查询字段值map集合
        tempQuery: {

        },

        // query表单标签名称map集合
        tempLable: {

        },

        //分页参数集合及当前默认页面
        pageData: null,
        pageNo: 1,

      }
    },

    //子组件
    components: {
      // baseTable
    },

    /*生命周期函数开始*/
    //vue实例化之前
    beforeCreate() {

    },

    //vue实例化后调用
    created() {
      const that = this
      that.title = that.initData.title
      that.configs.isSingle = that.initData.isSingle
      that.userInfo = that.$storage.get('userInfo')
      //加载左树右表
      that.initTable()
    },

    //挂载之前
    beforeMount() {

    },
    //真实DOM挂载后，仅限组件本身的挂载，如果存在子组件，并且需求子组件全部被挂载后进行操作，需使用vm.$nextTick顶替mounted（在mounted内部调用vm.$nextTick）；
    mounted() {
      this.isVisible = this.visible
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

      dialogClose() {
        this.$emit('close-dialog',this.selectList,this.initData.temp, this.buttonName)
      },



      //通过搜索栏查询，加载table列表
      queryTable(){
        const that = this
        that.pageNo=1
        that.initTable()
      },



      //加载table列表
      initTable(){
        const that = this
        that.dialogTopLoading = true
        request({
          url: that.initData.tableUrl,
          method: 'post',
          data: {
            ...that.initData.tableParm,
            ...that.tempQuery,
            pageNo: that.pageNo
          }
        }).then(res => {
          that.dialogTopLoading = false
          that.getListPage(res)
        }).catch(err => {
          console.log(err)
          that.dialogTopLoading = false
        })
      },

      //加载table列头及列表数据
      getListPage(res) {
        const that = this
        if (res) {
          //分页参数
          that.pageData = res.result.pageData

          //列表标签可编辑属性、国际化初始化
          that.initTempData(res.result.titles)
          const data = filerTableTitle(res.result)
          const titleList = that.addTableTitle(data)
          that.configs.tableConfigs = titleList
          that.configs.showCheckBox = true
          that.configs.showIndex = true
          that.tableData = res.result.varList
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
        return list
      },

      //通过单选框触发事件 获取table组件传回的数据
      dataBridge(data) {
        // console.log("*********"+data)
        const that = this
        that.selectList = data
      },

      //查询条件重置
      resetQueryTemp() {
        const that = this
        for(let key in that.tempQuery) {
          // console.log(key)
          that.tempQuery[key]= ''
        }
        that.pageNo=1
        that.initTable()
      },

      //关闭对话框
      closeDialogPage() {
        this.isVisible = false;
        this.buttonName = 'close';
      }

    },

    //计算属性
    computed: {

    },

    //观察者,可监听数据，属性和方法
    watch: {
      pageNo: function () {
        const that = this
        that.initTable()
      },
    }
  }


</script>

<style>

</style>
