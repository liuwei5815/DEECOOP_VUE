<template>
  <div class="alarmRecord" v-loading="alarmRecordLoading">
    <custom-base-table
      :key="cardData.id"
      :customColumn="customColumn"
      :initData="tableInitData"
      :disableLoading="true"
      :isSortable="false"></custom-base-table>
    <el-dialog
      title="处理详情"
      v-el-drag-dialog
      :key="processingDetailsDialogStamp"
      :visible.sync="processingDetailsDialog"
      width="80%"
      append-to-body
      :layoutType="2">
      <template v-if="useDetailsDialog">
        <el-dialog
          width="70%"
          v-el-drag-dialog
          title="备件使用详情"
          :key="useDetailsDialogStamp"
          :visible.sync="useDetailsDialog"
          :layoutType="2"
          append-to-body>
          <div style="padding: 10px;padding-bottom: 0;" :style="{height: `${sysClientWidth * 0.6}px`}">
            <custom-base-table
              :apiObj="setApiObj_three"
              :disableLoading="false"
              :isSortable="false"></custom-base-table>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="useDetailsDialog=false">关 闭</el-button>
          </div>
        </el-dialog>
      </template>
      <div style="padding: 10px;padding-bottom: 0;" :style="{height: `${sysClientWidth * 0.7}px`}">
        <custom-base-table
          :apiObj="setApiObj_two"
          :customColumn="processingDetailsDialogCustomColumn"
          :disableLoading="false"
          :isSortable="false"></custom-base-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="processingDetailsDialog=false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import clockTableData from '@/data/roundTheClockTableData'

  //table组件
  import customBaseTable from '../customTable/baseTable'
  import mixin from './mixin'
  export default {
    name: "alarm-record",
    mixins: [mixin],
    components: {
      customBaseTable
    },
    data(){
      return {
        alarmRecordLoading: false,
        tableInitData: null,
        customColumn: [
          {
            columnIndex: 'last',
            prop: 'operate',
            label: '操作',
            componentName: 'button',
            component: [
              {
                name: '处理详情',
                editBtns_isShow: true,
                method: this.processingDetails //自定义按钮方法-新增
              },
            ],
          }
        ],
        processingDetailsDialogCustomColumn: [
          {
            columnIndex: 'last',
            prop: 'operate',
            label: '操作',
            componentName: 'button',
            component: [
              {
                name: '备件详情',
                editBtns_isShow: true,
                method: this.useDetails //自定义按钮方法-新增
              },
            ],
          }
        ],
        processingDetailsDialogStamp: '',
        processingDetailsDialog: false,

        useDetailsDialogStamp: '',
        useDetailsDialog: false,

        httpRequestsTimer: '',
        paramsConstant_one: {
          fieldCode: 'warnDateTimeStr,sysCode,faultDescribe,beginTimeStr,endTimeStr,equipmentStateName',
          orderStr: 'repair.cdate desc',
        },
        paramsConstant_two: {
          fieldCode: 'repairUserName,faultDescribe,timeLengthStr,beginTimeStr,endTimeStr,taskResultName',
          orderStr: 'task.cdate asc',
        },
        paramsConstant_three: {
          fieldCode: 'productCode,productName,productSpec,productUnitName,receiveCount,warehouseGenreName,outDtlStateName,applyCount,retreatCount,retreatTypeName,inDtlStateName',
          orderStr: 'taskDtl.cdate asc',
        },

        params_two: null,
        apiObj_two: {//组件使用的API
          apiName: 'listPageEquipmentRepairTask',
          params: {
            repairId: ''
          }
        },
        params_three: null,
        apiObj_three: {//组件使用的API
          apiName: 'findListRepairTaskDetailByInfo',
          params: {
            taskId: ''
          }
        },
      }
    },
    watch: {
    },
    computed:{
      sysClientWidth(){
        return this.$store.getters.systemInfo.clientHeight || 0
      },
      params_one(){
        return Object.assign({},this.paramsConstant_one,{equipmentId:this.cardData?this.cardData.id:''})
      },
      setApiObj_two(){
        this.apiObj_two.params = Object.assign({},this.paramsConstant_two,{repairId:this.params_two?this.params_two.id:''})
        return this.apiObj_two
      },
      setApiObj_three(){
        this.apiObj_three.params = Object.assign({},this.paramsConstant_three,{taskId:this.params_three?this.params_three.id:''})
        return this.apiObj_three
      },
    },
    methods: {
      processingDetails(row,index){
        this.params_two = row
        this.resetProcessingDetailsDialog()
        //console.log(row,index)
        this.processingDetailsDialog = true

      },
      useDetails(row,index){
        this.params_three = row
        this.resetUseDetailsDialog()
        this.useDetailsDialog = true
      },
      resetProcessingDetailsDialog(){
        this.processingDetailsDialogStamp = new Date().getTime()
      },
      resetUseDetailsDialog(){
        this.useDetailsDialogStamp = new Date().getTime()
      },
      httpRequests(){
        console.log(!this.cardData || !this.cardData.id)
        if(!this.cardData || !this.cardData.id) return
        this.requestsBody()
        clearInterval(this.httpRequestsTimer)
        this.httpRequestsTimer = setInterval(_=>{
          this.requestsBody()
        },this.loopTime)
      },
      requestsBody(){
        this.$api['listPageEquipmentRepair'](this.params_one).then(res=>{
          this.tableInitData = res
          this.alarmRecordLoading && (this.alarmRecordLoading = false)
        }).catch(err=>{
          // console.log(err)
          this.alarmRecordLoading && (this.alarmRecordLoading = false)
        })
      },
    },
    created(){
      this.resetProcessingDetailsDialog()
      this.resetUseDetailsDialog()
      if(this.cardData && this.cardData.id){
        this.alarmRecordLoading = true
        this.httpRequests()
      }
    },
    mounted(){
    },
    beforeDestroy(){
      clearTimeout(this.httpRequestsTimer)
    },
  }
</script>

<style lang="scss" rel="text/css">
  .alarmRecord {
    height: 100%;
  }

</style>
