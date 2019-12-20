<template>
  <div class="realtimeData" v-loading="realtimeDataLoading">
    <p style="color: #868686;">当日产量（件）：<span style="color: #333333;" v-text="dailyOutput"></span></p>
    <p style="color: #868686;">最后开机时间：<span v-text="startingTime"></span></p>
    <p style="color: #868686;">最后采集时间：<span v-text="collectionTime"></span></p>
  </div>
</template>

<script>
  import mixin from './mixin'
  export default {
    name: "realtime-data",
    mixins: [mixin],
    data(){
      return {
        dailyOutput: '',
        startingTime: '',
        collectionTime: '',
        httpRequestsTimer: '',
        realtimeDataLoading: false,
      }
    },
    methods:{
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
        this.$api['getOutputAndDate']({equipmentId:this.cardData.id}).then(res=>{
          // console.log(res)
          this.dailyOutput = typeof res.outputNum === 'number'?res.outputNum:parseFloat(res.outputNum || '0')
          this.startingTime = res.startDate || ''
          this.collectionTime = res.collectDate || ''
          this.realtimeDataLoading && (this.realtimeDataLoading = false)
        }).catch(err=>{
          // console.log(err)
          this.dailyOutput = ''
          this.startingTime = ''
          this.collectionTime = ''
          this.realtimeDataLoading && (this.realtimeDataLoading = false)
        })
      },
    },
    created(){
      if(this.cardData && this.cardData.id){
        this.realtimeDataLoading = true
        this.httpRequests()
      }
    },
    beforeDestroy(){
      clearInterval(this.httpRequestsTimer)
    },
  }
</script>

<style lang="scss" rel="text/css">
  .realtimeData {

  }

</style>
