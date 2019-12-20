<template>
  <div class="equipmentData clearfix">
    <div style="float: left; width: 220px;height: 100%;position: relative;">
      <equipment-card :rowNum="1" :inDialog="inDialog" :apiObj="apiObj" :cardData="setCardData" @databridge="cardDataBridge"></equipment-card>
    </div>
    <div
      style="float: left; width: calc(100% - 220px);height: 100%;position: relative;padding-left: 10px;"
      :style="{'padding-right':inDialog?'10px':0,}">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <template v-for="(item,index) in tabs">
          <el-tab-pane :label="item.label" :name="item.name" :key="index">
            <component
              v-if="activeName === item.name"
              :is="item.name"
              :configs="item"
              :cardData="setUserSelectedCardData"
              @databridge="databridge"
              @callmethod="callmethod"></component>
          </el-tab-pane>
        </template>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import equipmentCard from '@/components/equipmentCard'
  import realtimeData from './realtimeData'
  import roundTheClockData from './roundTheClockData'
  import alarmRecord from './alarmRecord'
  export default {
    name: "equipment-data",
    props: {
      configs: {
        type: Object,
        default() {
          return null
        }
      },
      apiObj: {
        type: Object,
        default() {
          return null
        }
      },
      inDialog: {
        type: Boolean,
        default: false,
      },
      cardData: {
        type: Object,
        default() {
          return null
        }
      },
    },
    components: {
      equipmentCard,
      realtimeData,
      roundTheClockData,
      alarmRecord
    },
    data(){
      return {
        activeName: '',
        activeNameIndex: 0,
        tabs: [
          {
            label:'实时数据',
            name: 'realtimeData',
          },
          {
            label:'24小时数据',
            name: 'roundTheClockData',
          },
          {
            label:'报警记录',
            name: 'alarmRecord',
          },
        ],
        userSelectedCardData: null,
        sessionStore: {},
      }
    },
    computed:{
      setCardData(){
        console.log(this.cardData)
        if(this.inDialog) return this.cardData
      },
      setUserSelectedCardData(){
        if(this.inDialog) return this.cardData
        return this.userSelectedCardData
      }
    },
    watch: {},
    methods: {
      handleClick(){
        //console.log(this.activeName)
        if(!this.inDialog){
          if(this.activeName !== this.sessionStore.activeName){
            this.sessionStore.activeName = this.activeName
            //this.$storage.set('equipmentStore',this.sessionStore)
          }
        }
      },
      databridge(data){

      },
      cardDataBridge(data){
        //console.log(data)
        this.userSelectedCardData = data
        this.sessionStore.cardData = data
        //this.$storage.set('equipmentStore',this.sessionStore)
      },
      // handleClick(tab, event){
      //   console.log(this.activeName)
      //   this.$emit('tabsKey',this.activeName)
      // },
      callmethod(obj){
        this.$emit('callmethod',obj)
      },
    },
    created(){
      //console.log(this.configs)
      this.activeName = this.tabs[this.activeNameIndex].name
      // if(!this.inDialog){
      //   // this.sessionStore = this.$storage.get('equipmentStore') || {}
      //   // if(this.sessionStore.activeName){
      //   //   this.activeName = this.sessionStore.activeName
      //   // }else {
      //   //   this.activeName = this.tabs[this.activeNameIndex].name
      //   // }
      //   // if(this.sessionStore.cardData){
      //   //   this.userSelectedCardData = this.sessionStore.cardData
      //   // }
      // }else {
      //   this.activeName = this.tabs[this.activeNameIndex].name
      // }
    },
    mounted(){},
  }
</script>

<style lang="scss" rel="text/css">
  .equipmentData {
    height: 100%;
    position: relative;
    .el-tabs {
      height: 100%;
      .el-tabs__content {
        height: calc(100% - 45px);
        .el-tab-pane {
          height: 100%;
        }
      }
    }

  }
</style>
