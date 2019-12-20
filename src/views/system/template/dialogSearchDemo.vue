<template>
  <el-dialog v-el-drag-dialog :title="initData.title?initData.title:'新增'" :visible.sync="isVisible" :append-to-body="inDialog" :close-on-click-modal="onModal" :close-on-press-escape="onEscape" :fullscreen="fullscreen" @open="dialogOpen" @close="dialogClose" :width="dialogWidth">
    <search-bar
      :searchList="searchList"
      @search-map="searchMap"></search-bar>
    <div slot="footer" class="dialog-footer" style="text-align: center;padding-bottom: 10px">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="isVisible = false">关闭</el-button>
      </div>
  </el-dialog>
</template>

<script>
  import searchBar from '@/components/searchBar'

  export default {
    name: "dialog-search-demo",
    props: ['initData','visible'],
    components: {
      searchBar,
    },
    data(){
      return {
        dialogLoading: true,
        isVisible: false,
        inDialog: true,
        temp: {
        },
        tempLable: {
        },
        rules: {
        },

        //顶部搜索
        searchList: [{
          label: '货品编码1',//搜索输入框名称，必填项
          type: 'input',//搜索输入框类型，总共四种:'input','select','date','time'，必填项
          //ruleType: 'int',//效验规则，非必填项。总共11种:'code','date','time','mobile','email','url','zh','en','identity','float','int'
          //ruleOps: {//效验规则参数，非必填项
          //min: 6,//最小长度，有len参数时无效，在'code','zh','en'规则下有效。
          //max: 7,//最大长度，有len参数时无效，在'code','zh','en'规则下有效。
          //len: 5,//总长度，在'code','zh','en'规则下有效。
          //customReg: '^[A-Za-z0-9]$'//自定义效验正则，定义此项则'min','max','len'属性无效
          //},
          mapKey: 'goodsCode',//搜索输入框绑定的key，关键参数，必填
          configs: {},//搜索输入框配置
          placeholder: '请输入编码',//占位符
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
              //可用的时间范围，字符串数组，前一个为可用的开始时间，后一个为可用的结束时间，不设置则全部日期均可用
              disabledDate: ['2018-09-15','2018-09-20']
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
        },]
      }
    },
    created() {

    },
    mounted() {
      this.dialogLoading = false
      this.isVisible = this.visible
    },
    computed: {
      dialogWidth(){
        if(this.initData.width){
          const widthType = typeof this.initData.width
          if(widthType === 'number'){
            return this.initData.width+'px'
          }else if(widthType === 'string'){
            const num = parseInt(this.initData.width)
            if(num){
              return num>100?'100%':(num+'%')
            }else {
              return '300px'
            }
          }else {
            return '300px'
          }
        }else {
          return '300px'
        }
      },
      fullscreen(){
        return this.initData.fullscreen?true:false
      },
      onModal() {
        return this.initData['close-on-click-modal']?true:false
      },
      onEscape() {
        return this.initData['close-on-press-escape']?true:false
      },
    },
    methods: {
      dialogOpen(){
      },
      dialogClose(data){
        this.$emit('close-dialog',data?data:{})
      },
      save() {
        const that = this
        that.isVisible = false
      },
      //搜索栏功能
      searchMap(data) {
        console.log(data)
      },
    }

  }
</script>

<style scoped>

</style>
