<template>
  <div v-loading="setLoading" ref="equipmentCard" class="equipmentCard clearfix" :style="{width:setViewWidth, height: baseHeight?baseHeight:'100%',border: baseBorder?baseBorder:'none'}">
    <template v-if="setCardList.length">
      <div
        v-for="(v,i) in setCardList"
        :key="i"
        class="cardView"
        style="float: left;box-sizing: border-box;"
        :style="{padding:setCardViewPadding+'px',width:`${100/rowNum}%`}">
        <el-card
          :body-style="{ padding: '0px' }"
          :style="{'font-size': setCardFontSize}"
          :shadow="inDialog?'always':setCardShadow(i)">
          <div
            style="box-sizing: border-box;padding: 8px;"
            :style="{height:setCardHeight,cursor: inDialog?'':'pointer'}"
            :title="inDialog?'':'点击查看设备数据'"
            @click="cardClick(v,i)">
            <template v-if="v.photo">
              <img :src="`${$baseUrl}${v.photo}`" style="width: 100%;height: 100%;">
            </template>
            <template v-else>
              <div style="height: 100%;padding-top: 20%;text-align: center">设备照片缺失</div>
            </template>
          </div>
          <div
            style="position: relative;padding: 5px;"
            :style="setEquipmentStateColor(v.equipmentState)"
            class="clearfix">
            <div id="textView" style="float: left;width: 60%;" :style="{'font-size':setTextFontSize}">
              <text-tooltip :str="`设备编码：${v.code || ''}`" :parentWidth="textParentWidth" :txtSize="setTextFontSize" :parentSize="setCardFontSize"></text-tooltip>
              <text-tooltip :str="`设备名称：${v.name || ''}`" :parentWidth="textParentWidth" :txtSize="setTextFontSize" :parentSize="setCardFontSize"></text-tooltip>
              <text-tooltip :str="`设备型号：${v.spec || ''}`" :parentWidth="textParentWidth" :txtSize="setTextFontSize" :parentSize="setCardFontSize"></text-tooltip>
              <text-tooltip :str="`所属部门：${v.deptName || ''}`" :parentWidth="textParentWidth" :txtSize="setTextFontSize" :parentSize="setCardFontSize"></text-tooltip>
              <text-tooltip :str="`状态：${v.equipmentStateName || ''}`" :parentWidth="textParentWidth" :txtSize="setTextFontSize" :parentSize="setCardFontSize"></text-tooltip>
            </div>
            <div style="float: left;width: 40%;position: relative;" :style="{height:textParentHeight + 'px'}">
                <el-tag color="#F2F2F2" style="color: #009900;width: 100%;text-align: center;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" :size="size">
                  {{setSensorText(v.isBindSensor)}}
                </el-tag>
              <div v-if="setSensorText(v.isBindSensor) === '联网设备'">
                <el-tag color="#F2F2F2" style="width: 100%;text-align: center;" :style="{color: v.equipmentActivity==='1'?'#009900':'#AEAEAE'}" :size="size">{{setSensorOnline(v.equipmentActivity)}}</el-tag>
              </div>
              <div
                style="position: absolute;right: 0;bottom: -3px;width: 45%;height: 40%;padding: 2%;"
                v-if="!(inDialog || rowNum === 1)">
                <div style="height: 100%;position: relative;">
                  <base-button
                    class="cardBtn"
                    :name="''"
                    icon="xiuli"
                    :size="size"
                    :type="''"
                    :state="setBtnState(v)" @myclick="setFault(v)"></base-button>
                  <div v-if="v.alarmState === '1'" style="position: absolute;bottom: 0;left: -150%;">
                    <el-tag color="#F2F2F2" style="color: #ff0000;text-align: center;" :size="size">故障</el-tag>
                  </div>
                </div>
              </div>
            </div>
            <!--<span>好吃的汉堡</span>-->
            <!--<div class="bottom clearfix">-->
              <!--<time class="time">112233</time>-->
              <!--<el-button type="text" class="button">操作按钮</el-button>-->
            <!--</div>-->
          </div>
        </el-card>
      </div>
    </template>
    <template v-else>
      <div style="padding-top: 20%;text-align: center">暂无数据</div>
    </template>

    <!--弹窗-->
    <el-dialog
      v-el-drag-dialog
      v-loading="dialogLoading"
      title="故障报修"
      :visible.sync="isVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      @close="dialogClose"
      width="350px">
      <div style='margin: 10px auto;width: 100%;'>
        <el-form ref="submitForm" :model="submitForm" label-position="right" label-width="120px">
          <!--故障描述-->
          <el-row>
            <el-form-item label="设为故障设备:" :rules="[{ required: true, message: '故障描述不能为空'}]">
              <el-input style='width: 200px' placeholder="故障描述" type="textarea" rows="3" v-model="submitForm.faultDescribe"/>
            </el-form-item>
          </el-row>
        </el-form>

        <div slot="footer" class="dialog-footer" style="text-align: center;padding-bottom: 10px">
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="isVisible = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  //import equipmentCardData from '@/data/equipmentCardData'
  import textTooltip from '@/components/textTooltip'

  export default {
    name: "equipment-card",
    components: {
      textTooltip,
    },
    props: {
      baseHeight: {
        type: String,
        default: ''
      },
      baseBorder: {
        type: String,
        default: ''
      },
      configs: {
        type: Object,
        default() {
          return {}
        }
      },
      apiObj: {
        type: Object,
        default() {
          return {}
        }
      },
      renameKey: {
        type: Object,
        default(){
          return null
        }
      },
      rowNum: {
        type: Number,
        default: 4,
      },
      cardData: {
        type: Object,
        default(){
          return null
        },
      },
      inDialog: {
        type: Boolean,
        default: false,
      },
    },
    data(){
      return {
        isLoading: false,
        viewWidth: 0,
        cardWidth: 0,
        cardList:[],
        textParentWidth: 0,
        textParentHeight: 0,
        selectedCardIndex: -1,
        isVisible: false,
        equimentData: null,
        submitForm: {
          faultDescribe: '',
        },
        dialogLoading: false,
      }
    },
    directives: {
      // 'card-width':{
      //   inserted(el,binding,vnode){
      //     console.log(el.offsetWidth)
      //
      //     vnode.context.cardWidth = el.offsetWidth
      //     console.log(vnode.context.cardWidth)
      //   },
      // },
    },
    computed: {
      setCardList(){
        if(this.inDialog) return [this.cardData]
        return this.cardList
      },
      size(){
        return this.$store.getters.size
      },
      sysClientWidth(){
        return this.$store.getters.systemInfo.clientWidth || 0
      },
      setViewWidth(){
        return this.configs.viewWidth?`${this.configs.viewWidth}px`:'100%'
      },
      adapted(){
        return this.renameKey || {
          name: 'name',
          id: 'id',
          code: 'code'
        }
      },
      setCardViewPadding(){
        if(this.inDialog || this.rowNum === 1) return 10
        if(this.sysClientWidth >= 1920){
          return 45
        }else if(this.sysClientWidth >=1440){
          return 35
        }else if(this.sysClientWidth >=1366){
          return 25
        }else {
          return 10
        }
      },
      setCardHeight(){
        return this.cardWidth * 0.9 + 'px'
      },
      fontSizeConstant(){
        return this.setCardViewPadding>35?20:17
      },
      setCardFontSize(){
        return this.cardWidth?(this.cardWidth / this.fontSizeConstant + 'px'):null
      },
      setTextFontSize(){
        return '1em'
      },
      setLoading(){
        if(this.rowNum === 1){
          return false
        }
        return this.isLoading
      },
    },
    methods: {
      save(){
        this.$refs['submitForm'].validate((valid) => {
          if (valid) {
            this.dialogLoading = true
            this.$api['addEquipmentRepair']({
              equipmentId: this.equimentData.id,
              equipmentCode: this.equimentData.code,
              equipmentName: this.equimentData.name,
              companyId: this.$storage.get('userInfo').companyId,
              faultDescribe: this.submitForm.faultDescribe
            }).then(res => {
              this.dialogLoading = false
              if (res.code === 0) {
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
                this.isVisible = false
                !this.inDialog && this.httpRequests()
              }
            }).catch(err => {
              this.dialogLoading = false
            })

          } else {
            return false;
          }
        });
      },
      dialogClose(){
        this.submitForm.faultDescribe = ''
        this.equimentData = null
      },
      setBtnState(item){
        if(!item.alarmId) return false
        return true
      },
      getSize(){
        const that = this
        if(that.$el){
          that.cardWidth = (that.$el.offsetWidth/that.rowNum) - (that.setCardViewPadding*2)
          that.setCardList.length && that.cardViewHeight()
        }
      },
      cardViewHeight(){
        const that = this
        if(that.$el){
          that.$nextTick(_=>{
            const el = that.$el.querySelector('#textView')
            // console.log(that.$el,el,'el')
            if(el){
              that.textParentWidth = el.offsetWidth
              that.textParentHeight = el.offsetHeight
            }
          })
        }
      },
      httpRequests(){
        this.isLoading = true
        this.$api[this.apiObj.apiName](this.apiObj.params).then(res=>{
          this.cardList = res.EquipmentState || []
          this.cardViewHeight()
          if(this.rowNum === 1){
            this.$emit('databridge',this.cardList[0])
            this.selectedCardIndex = 0
          }
          this.isLoading = false
        }).catch(err=>{
          this.isLoading = false
          console.log(err)
        })
      },
      setEquipmentStateColor(state){
        if(!state) return {'background-color': '#e9e9e9'}
        const colorObj = {
          'background-color': ''
        }
        switch (state){
          case '0':
            colorObj['background-color'] = '#66CCFF'
            break;
          case '1':
            colorObj['background-color'] = '#009900'
            break;
          case '2':
            colorObj['background-color'] = '#FF9900'
            break;
          case '3':
            // colorObj['background-color'] = '#ff0000'
            colorObj['background-color'] = '#FF9900'
            break;
          default :
            colorObj['background-color'] = '#e9e9e9'
            break;
        }
        return colorObj
      },
      setSensorText(state){
        if(!state) return ''
        let txt = ''
        switch (state) {
          case 'Y':
            txt = '联网设备'
            break;
          case 'N':
            txt = '非联网设备'
            break;
        }
        return txt
      },
      setSensorOnline(state){
        if(!state) return '未知'
        let txt = '未知'
        switch (state) {
          case '1':
            txt = '在线'
            break;
          case '0':
            txt = '不在线'
            break;
        }
        return txt
      },
      setFault(item){
        if(!item) return
        if(item){
          this.equimentData = item
          this.isVisible = true
        }
      },
      cardClick(item,index){
        if(this.inDialog) return false
        this.selectedCardIndex = index
        this.$emit(this.rowNum===1?'databridge':'callmethod',item)
      },
      setCardShadow(index){
        return this.selectedCardIndex === index?'always':'hover'
      },
    },
    watch: {
      // cardList(){
      //   this.$nextTick(function () {
      //     this.getSize()
      //   })
      // },
      sysClientWidth(){
        this.getSize()
      },
      'apiObj.params'(){
        !this.inDialog && this.httpRequests()
      },
    },
    created(){
      // setTimeout(_=>{
      //   this.cardList = equipmentCardData.result.varList
      // },400)
    },
    mounted(){
      this.getSize()
      !this.inDialog && this.httpRequests()
    },
  }
</script>

<style lang="scss" rel="text/css">
  .equipmentCard {
    overflow: auto;
    .cardView {
      .is-always-shadow {
        box-shadow: 0 0 5px 3px rgb(102,204,255);
      }
    }
    .cardBtn {
      padding: 0 !important;
      width: 100%;
      height: 100%;
      .svg-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 80% !important;
        height: 80% !important;
      }
    }
  }
</style>
