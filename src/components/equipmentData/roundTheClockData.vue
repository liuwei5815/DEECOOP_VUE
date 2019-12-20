<template>
  <div class="roundTheClockData" v-loading="roundTheClockDataLoading">
    <div style="height: 30%;">
      <v-chart :options="polar" autoresize></v-chart>
    </div>
    <div style="height: 70%;">
      <custom-base-table
        :key="cardData.id"
        :initData="tableInitData"
        :disableLoading="true"
        :isSortable="true"
        :showTableSet="true"
        :smallPage="setPageSize"></custom-base-table>
    </div>
  </div>
</template>

<script>
  //假数据
  import clockData from '@/data/roundTheClockData'
  import clockTableData from '@/data/roundTheClockTableData'

  //table组件
  import customBaseTable from '../customTable/baseTable'

  // 图表库
  import ECharts from 'vue-echarts'
  import 'echarts/lib/chart/custom'
  import 'echarts/lib/chart/line'
  import 'echarts/lib/component/tooltip'

  import mixin from './mixin'
  // import dateTools from '@/utils/dateTools'

  export default {
    name: "round-the-clock-data",
    mixins: [mixin],
    components: {
      'v-chart': ECharts,
      customBaseTable
    },
    data () {
      return {
        chartData: null,
        categories: ['开机时间', '工作时间', '故障报警'],
        tableInitData: null,
        roundTheClockDataLoading: false,
        httpRequestsTimer: '',
      }
    },
    computed:{
      sys(){
        return this.$store.getters.systemInfo
      },
      setPageSize(){
        return this.sys.clientWidth>1366?false:true
      },
      chartsData(){
        return this.formatChartsData(this.chartData)
      },
      polar(){
        return {
          grid:{
            top: 23,
            left: 70,
            right: 30,
            bottom: 2,
          },
          tooltip: {
            formatter: function (params) {
              return params.marker + params.value[3] + '--' + params.value[4];
            }
          },
          xAxis: {
            type: 'time',
            position: 'top',
            min: this.dataTool().start,
            max: this.dataTool().end,
            interval: 10800000,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              formatter(value){
                let hours = new Date(value).getHours()
                return hours === 23?(hours + 1):hours
              },
            },
            splitLine: {
              lineStyle:{
                color: '#F2F2F2',
                type: 'dashed',
                width: 2,
              },
            },
          },
          yAxis: {
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              interval: 0
            },
            inverse: true,
            data: this.categories
          },
          series: [
            {
              type: 'custom',
              renderItem: this.renderItem,
              encode: {
                x: [1, 2],
                y: 0
              },
              data: this.chartsData
            },
          ],
          animationDuration: 2000
        }
      },
    },
    methods:{
      formatChartsData(data){
        if(!data) return []
        let tempArr = [],resArr = [],itemStyle = {}
        this.categories.forEach((v,i)=>{
          if(v === '开机时间'){
            resArr = data.openDate
            itemStyle = {
              normal: {
                color: '#66CCFF'
              }
            }
          }else if(v === '工作时间'){
            resArr = data.workDate
            itemStyle = {
              normal: {
                color: '#009900'
              }
            }
          }else {
            resArr = data.alarmDate
            itemStyle = {
              normal: {
                color: '#FF0000'
              }
            }
          }
          resArr.forEach(cv=>{
            tempArr.push({
              name: v,
              value: [
                i,
                this.timeTool(cv.startDate),
                this.timeTool(cv.endDate),
                cv.startDate,
                cv.endDate
              ],
              itemStyle
            })
          })
        })
        return tempArr
      },
      timeTool(timeStr){
        return new Date(new Date().toDateString() + ' ' + timeStr).getTime()
      },
      dataTool(){
        const obj = {
          start:new Date(new Date(new Date().toLocaleDateString()).getTime()),
          end:new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1)
        }
        // console.log(obj)
        return obj
      },
      renderItem(params,api){
        // console.log(params,api)
        let categoryIndex = api.value(0);
        let start = api.coord([api.value(1), categoryIndex]);
        let end = api.coord([api.value(2), categoryIndex]);

        let rectShape = ECharts.graphic.clipRectByRect({
          x: start[0],
          y: start[1],
          width: end[0] - start[0],
          height: 10
        }, {
          x: params.coordSys.x,
          y: params.coordSys.y,
          width: params.coordSys.width,
          height: params.coordSys.height
        });

        return rectShape && {
          type: 'rect',
          shape: rectShape,
          style: api.style()
        };
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
        this.$axios.all([
          this.$api['get24HoursData']({equipmentId:this.cardData.id}),
          this.$api['get24HoursDataDetail']({equipmentId:this.cardData.id})
        ]).then(this.$axios.spread((res1,res2)=>{
          console.log(res1,res2)
          this.chartData = res1
          this.tableInitData = res2
          this.roundTheClockDataLoading && (this.roundTheClockDataLoading = false)
        })).catch(err=>{
          console.log(err)
          this.roundTheClockDataLoading && (this.roundTheClockDataLoading = false)
        })
      },
    },
    watch: {
      // 'cardData.id'(n){
      //   this.roundTheClockDataLoading = true
      //   this.chartData = null
      //   this.tableInitData = null
      //   setTimeout(_=>{
      //     this.chartData = clockData.result
      //     this.tableInitData = clockTableData
      //     this.roundTheClockDataLoading = false
      //   },300)
      // }
    },
    created(){
      if(this.cardData && this.cardData.id){
        this.roundTheClockDataLoading = true
        this.httpRequests()
      }
      // this.roundTheClockLoading = true
      // setTimeout(_=>{
      //   this.chartData = clockData.result
      //   this.tableInitData = clockTableData
      //   this.roundTheClockLoading = false
      // },300)
    },
    mounted(){
    },
    beforeDestroy(){
      clearInterval(this.httpRequestsTimer)
    },
  }
</script>

<style lang="scss" rel="text/css">
  .roundTheClockData {
    height: 100%;
    .echarts {
      width: 100%;
      height: 100%;
    }
  }
</style>
