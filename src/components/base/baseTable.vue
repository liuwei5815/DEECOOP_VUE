<template>
  <div ref="tableWrapper" style="height: 100%;position: relative" class="myCoustomTable resetBaseTableStyle">
    <div :style="{height: setTableHeight}">
      <el-table ref="baseTable"
                :data="data"
                stripe
                border
                current-row-key
                style="width: 100%;"
                height="100%"
                fit
                :header-cell-class-name="setStyle"
                row-key="id"
                @select="selectItem"
                @select-all="selectAllItem">
        <template v-if="showCheckBox">
          <el-table-column type="selection" :fixed="fixedState" :selectable="selectable" width="55" align="center"></el-table-column>
        </template>
        <template v-if="showIndex">
          <el-table-column type="index" :index="indexMethod" :fixed="fixedState" label="序号" width="60" align="center"></el-table-column>
        </template>
        <template v-for="(colConfig,infoIndex) in colConfigs">
          <slot v-if="colConfig.slot" :name="colConfig.slot" :fixed="infoIndex===colConfigs.length-1?'right':(infoIndex<isFixed?fixedList[infoIndex]:false)"></slot>
          <component v-else-if="colConfig.component" :is="colConfig.component" :col-config="colConfig" :width="colConfig.width || null" :fixed="infoIndex===colConfigs.length-1?'right':(infoIndex<isFixed?fixedList[infoIndex]:false)"></component>
          <el-table-column v-else show-overflow-tooltip v-bind="colConfig" :sortable="colConfig.sortable===undefined?isSortable:colConfig.sortable" :fixed="infoIndex===colConfigs.length-1?'right':(infoIndex<isFixed?fixedList[infoIndex]:false)" :label="colConfig.label" align="center"></el-table-column>
        </template>
      </el-table>
    </div>
    <div v-if="!hidePages && hasPageData" style="height: 40px;text-align: center;margin-top: 5px;">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page.sync="pageData.current"
        :page-size="pageData.size"
        layout="prev, pager, next, jumper"
        :total="pageData.total-0">
      </el-pagination>
    </div>

  </div>

</template>

<script>
  import {scrollToTop} from '@/utils/common'

	export default {
    name: 'base-table',
    props: {
      colConfigs: {
        type: Array,
        default: function () {
          return []
        }
      },
      data: {
        type: Array,
        default: function () {
          return []
        }
      },
      showCheckBox: {
        type: Boolean,
        default: false
      },
      showIndex: {
        type: Boolean,
        default: false
      },
      propName: {
        type: String,
        default: ''
      },
      pageData: {
        type: Object,
        default: function () {
          return {}
        }
      },
      isSingle: {
        type: Boolean,
        default: false
      },
      isFixed: {
        type: Number,
        default: 1
      },
      isSortable: {
        type: Boolean,
        default: true
      },
      hidePages: {
        type: Boolean,
        default: false
      }
    },
    data() {
		  return {
        wrapperWidth: 0,
        tableWidth: 0,
        fixedState: false,
        fixedList: [],
        domTimer: '',
        scrollTimer: '',
      }
    },
    computed: {
      hasPageData() {
        let state = false
        for(let k in this.pageData){
          if(this.pageData.hasOwnProperty(k)){
            state = true
          }
        }
        return state
      },
      setTableHeight() {
        return (!this.hidePages&&this.hasPageData)?'calc(100% - 40px)':'100%'
      },
    },
		created: function() {
      if(this.data&&this.data.length>0){
        this.data.forEach(item =>{
          item['rowState'] = '1'
        })
      }

      if(this.isFixed-1){
        this.fixedState = true
        for(let i = 0; i<this.isFixed;i++){
          this.fixedList.push(true)
        }
      }
		},
    mounted: function () {
    },
    updated: function () {
    },
    watch: {
      data: function () {
        this.setFixed()
        this.$refs.baseTable.$nextTick(()=>{
          if(this.isSingle && this.showCheckBox){
            clearTimeout(this.domTimer)
            this.domTimer = setTimeout(()=>{
              const elList = this.$refs.baseTable.$el.querySelectorAll('.el-table__header')
              elList.forEach(item => {
                item.querySelector('.el-checkbox').style.display = 'none'
              })
            },10)
          }
        })
      },
      'pageData.current'(val){
        clearTimeout(this.scrollTimer)
        this.scrollTimer = setTimeout(_=>{
          const rootEl = this.$refs.baseTable.$el
          rootEl.querySelector('.el-table__body-wrapper').scrollTop>0
          && scrollToTop(rootEl.querySelector('.el-table__body-wrapper'))
          && scrollToTop(rootEl.querySelector('.el-table__fixed-body-wrapper'))
        })
      },
    },
		methods:{
      setFixed() {
        const that = this
        let timer = null
        that.$refs.baseTable.$nextTick(() => {
          that.wrapperWidth = that.$el.clientWidth
          clearTimeout(timer)
          timer = setTimeout(function () {
            that.tableWidth = document.getElementsByTagName('thead')[0].clientWidth
            if(that.wrapperWidth<that.tableWidth && !(that.isFixed-1)){
              that.fixedState = true
              that.fixedList.push(true)
            }
          },10)
        })
      },
			setStyle(row) {

			},
			indexMethod(index) {
				return index + 1
			},
			tableRowClassName(row,index) {
				row.index = index
			},
			selectItem(selection, row) {
				this.$emit('databridge',selection,row)
        if(this.isSingle){
			    if(selection.length){
            this.data.forEach(item => {
              item.rowState = '0'
            })
            selection[0].rowState = '1'
          }else {
            this.data.forEach(item => {
              item.rowState = '1'
            })
          }
        }
			},
			selectAllItem(selection) {
        if(this.isSingle){
          if(selection.length){
            for(let i =selection.length-1;i>=0;i--){
              selection.splice(i,1)
            }
          }
        }else {
          this.$emit('databridge',selection)
        }
			},
      handleCurrentChange(pageIndex) {
        this.$emit('update:currentpage', pageIndex)
      },
      selectable(row, index) {
        return row.rowState === '1'
			},
		}
	}
</script>

<style>


</style>
