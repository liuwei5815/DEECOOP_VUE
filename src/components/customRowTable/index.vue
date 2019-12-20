<template>
  <div
    :style="{height: baseHeight?baseHeight:'100%',border: baseBorder?baseBorder:'none'}"
    v-loading="setLoading" class="myCoustomTable resetCustomRowTableStyle">
    <div :style="{height: setTableHeight}" style="position: relative;overflow: hidden">
      <div class="resetTableStyle baseTableStyle">
        <el-table ref="baseTable"
                  :data="setTableData"
                  stripe
                  height="100%"
                  style="width: 100%;"
                  fit
                  highlight-current-row
                  tooltip-effect="dark"
                  :border="layer!=0"
                  :show-header="setShowHeader()"
                  :default-expand-all="setExpand"
                  :row-key="getRowKey"
                  :expand-row-keys="expandRowKeys"
                  :row-class-name="setRowClass"
                  :cell-style="setCellStyle"
                  :header-row-class-name="setHeaderRowClass"
                  @expand-change="expandChange"
                  @do-layout="doLayout"
                  @select="selectItem"
                  @select-all="selectAll">
          <el-table-column v-if="setTableData && setTableData.length" type="expand" :width="setExpandColumnWidth" align="center">
            <template slot-scope="props">
              <template v-if="props.row.children && props.row.children">
              <children-table
                :key="props.row.id"
                :layer="layer+1"
                :expand-all="setExpand"
                :data="props.row.children"
                :titleList="props.row.titleList"
                :configs="configs"
                :customColumn="customColumn"
                :editable="editable"
                :precision="precision"
                :guid="guid"
                :parent="[props.row]"
                :rowChain="[]"
                :mergeColumn="mergeColumn"
                @do-layout="doLayout"
                @databridge="databridge"></children-table>
              </template>
              <template v-else>
                <div style="text-align: center">暂无数据</div>
              </template>
            </template>
          </el-table-column>
          <template v-if="setShowCheckBox">
            <el-table-column type="selection" :selectable="selectable" width="50" align="center"></el-table-column>
          </template>
          <template v-if="setShowIndex">
            <el-table-column type="index" :index="indexMethod" label="序号" width="50" align="center"></el-table-column>
          </template>
          <template v-for="(colConfig,infoIndex) in setTitleList">
            <el-table-column
              show-overflow-tooltip
              :key="infoIndex"
              v-bind="colConfig"
              :label="colConfig.label"
              :min-width="colConfig.width || autoWidths[infoIndex] || null"
              :class-name="setColumnClass(colConfig)"
              align="center">
              <template slot-scope="scope">
                <div v-if="Array.isArray(scope.row[colConfig.prop])&&scope.row[colConfig.prop].length&&scope.row[colConfig.prop][0].hasOwnProperty('_mergeValue')">
                  <template v-for="(cItem,cIndex) in scope.row[colConfig.prop]">
                    <template v-if="cItem.component">
                      <div v-auto-width="{parentLayer:infoIndex,selfLayer:cIndex,id:cItem.prop}">
                        <component :key="cIndex" :is="cItem.component" :col-config="cItem" :scope="scope"></component>
                      </div>
                    </template>
                    <template v-else-if="cItem.hasOwnProperty('_mergeValue') && !cItem.keyName">
                      <div class="resetElStepStyle" style="text-align: left">
                        <div v-if="!cItem.hideTitle" v-auto-width="{parentLayer:infoIndex,selfLayer:cIndex,id:'_0'+cItem.prop}" :style="cItem.titleStyle || (columnGlobalStyle[layer]?columnGlobalStyle[layer].titleStyle:{}) || {}" v-cloak>{{cItem.label+':'}}&nbsp</div>
                        <div v-auto-width="{parentLayer:infoIndex,selfLayer:cIndex,id:'_1'+cItem.prop}" :style="cItem.bodyStyle || (columnGlobalStyle[layer]?columnGlobalStyle[layer].bodyStyle:{}) || {}" v-text="scope.row[cItem.prop]"></div>
                      </div>
                    </template>
                    <template v-else>
                      <template v-if="cItem.componentName">
                        <div v-if="cItem.componentName === 'el-steps' || cItem.componentName === 'el-step'" class="resetElStepStyle">
                          <div v-if="!cItem.hideTitle" v-auto-width="{parentLayer:infoIndex,selfLayer:cIndex,id:'_0'+cItem.keyName}" :style="cItem.titleStyle || (columnGlobalStyle[layer]?columnGlobalStyle[layer].titleStyle:{}) || {}" v-cloak>{{cItem.label+':'}}&nbsp</div>
                          <div v-auto-width="{parentLayer:infoIndex,selfLayer:cIndex,id:'_1'+cItem.keyName}">
                            <ul class="customStepView clearfix">
                              <li
                                class="customStepBox"
                                v-for="(stepItem,stemIndex) in cItem.componentConfig.titleList"
                                :key="stemIndex"
                                :style=createStepStyle(stemIndex,scope,cItem)>
                                {{stepItem}}
                                <i class="stepArrow" :style=createStepArrowStyle(stemIndex,scope,cItem)></i>
                              </li>
                            </ul>
                            <!--<el-steps :active="scope.row[cItem.keyName]-0" simple>-->
                              <!--<el-step-->
                                <!--v-for="(stepItem,stemIndex) in cItem.componentConfig.titleList"-->
                                <!--:title="stepItem"-->
                                <!--:key="stemIndex"-->
                                <!--:icon="'none'"></el-step>-->
                            <!--</el-steps>-->
                          </div>
                        </div>
                        <div v-else-if="cItem.componentName === 'el-progress'" class="clearfix">
                          <div v-if="!cItem.hideTitle" style="float: left;" :style="[{'line-height': cItem.componentConfig['stroke-width']>23?2:''},cItem.titleStyle||(columnGlobalStyle[layer]?columnGlobalStyle[layer].titleStyle:{})||{}]" v-auto-width="{parentLayer:infoIndex,selfLayer:cIndex,id:'_0'+cItem.keyName}" v-cloak>{{cItem.label+':'+(cItem.componentConfig.showInitValue?scope.row[cItem.keyName]:'')}}&nbsp</div>
                          <div v-auto-width="{parentLayer:infoIndex,selfLayer:cIndex,id:'_1'+cItem.keyName}" style="overflow: hidden;" :style="{'padding-top':(cItem.componentConfig['stroke-width']?(cItem.componentConfig['stroke-width']<24?(24-cItem.componentConfig['stroke-width'])/2:cItem.componentConfig['stroke-width']):0)+'px'}">
                            <el-progress
                              :percentage="(scope.row[cItem.keyName]-0) || 0"
                              status="success"
                              :text-inside="cItem.componentConfig['text-inside']?true:false"
                              :stroke-width="cItem.componentConfig['stroke-width'] || 16"
                              :show-text="cItem.componentConfig['show-text']?true:false"
                              :color="cItem.componentConfig.color || ''"></el-progress>
                          </div>
                        </div>
                        <div v-else-if="cItem.componentName === 'el-input'" class="clearfix">
                          <div v-if="!cItem.hideTitle" v-auto-width="{parentLayer:infoIndex,selfLayer:cIndex,id:'_0'+cItem.keyName}" style="float: left;" :style="cItem.titleStyle || (columnGlobalStyle[layer]?columnGlobalStyle[layer].titleStyle:{}) || {}" v-cloak>{{cItem.label+':'}}&nbsp</div>
                          <div v-auto-width="{parentLayer:infoIndex,selfLayer:cIndex,id:'_1'+cItem.keyName}" style="overflow: hidden;" :style="cItem.bodyStyle || (columnGlobalStyle[layer]?columnGlobalStyle[layer].bodyStyle:{}) || {}">
                            <el-input
                              v-model="scope.row[cItem.keyName]"
                              v-merga-rult="{rule:cItem.componentConfig.rule,value:scope.row[cItem.keyName]}"
                              :placeholder="cItem.componentConfig.placeholder || '请输入内容'"
                              :type="cItem.componentConfig.type || 'text'"
                              :maxlength="cItem.componentConfig.maxlength"
                              :minlength="cItem.componentConfig.minlength"
                              :clearable="cItem.componentConfig.clearable"
                              :disabled="cItem.componentConfig.disabled === undefined?false:(typeof cItem.componentConfig.disabled === 'string'?(scope.row[cItem.componentConfig.disabled]==='1'):cItem.componentConfig.disabled)"
                              :size="cItem.componentConfig.size || 'small'"></el-input>
                          </div>
                        </div>
                        <div v-else-if="cItem.componentName === 'el-button'" style="text-align: left">
                          <div v-if="!cItem.hideTitle" v-auto-width="{parentLayer:infoIndex,selfLayer:cIndex,id:'_0'+cItem.keyName}" style="display: inline-block;" :style="cItem.titleStyle || (columnGlobalStyle[layer]?columnGlobalStyle[layer].titleStyle:{}) || {}" v-cloak>{{cItem.label+':'}}&nbsp</div>
                          <div v-auto-width="{parentLayer:infoIndex,selfLayer:cIndex,id:'_1'+cItem.keyName}" style="display: inline-block;" :style="cItem.bodyStyle || (columnGlobalStyle[layer]?columnGlobalStyle[layer].bodyStyle:{}) || {}">
                            <!--<el-input-->
                              <!--v-model="scope.row[cItem.keyName]"-->
                              <!--v-merga-rult="{rule:cItem.componentConfig.rule,value:scope.row[cItem.keyName]}"-->
                              <!--:placeholder="cItem.componentConfig.placeholder || '请输入内容'"-->
                              <!--:type="cItem.componentConfig.type || 'text'"-->
                              <!--:maxlength="cItem.componentConfig.maxlength"-->
                              <!--:minlength="cItem.componentConfig.minlength"-->
                              <!--:clearable="cItem.componentConfig.clearable"-->
                              <!--:disabled="cItem.componentConfig.disabled === undefined?false:(typeof cItem.componentConfig.disabled === 'string'?(scope.row[cItem.componentConfig.disabled]==='1'):cItem.componentConfig.disabled)"-->
                              <!--:size="cItem.componentConfig.size || 'small'"></el-input>-->
                            <el-button
                              type="text"
                              size="small"
                              :style="{'padding-left':cItem.hideTitle?'':'0'}"
                              :disabled="cItem._cellConfig.disabled?scope.row[cItem._cellConfig.disabled]:false"
                              @click="componentMethod(scope.row,scope.$index,cItem)">{{cItem._cellConfig.name || scope.row[cItem.keyName]}}</el-button>
                          </div>
                        </div>

                      </template>
                      <template v-else>
                        <div class="resetElStepStyle" style="text-align: left">
                          <div v-if="!cItem.hideTitle" v-auto-width="{parentLayer:infoIndex,selfLayer:cIndex,id:'_0'+cItem.prop}" :style="cItem.titleStyle || (columnGlobalStyle[layer]?columnGlobalStyle[layer].titleStyle:{}) || {}" v-cloak>{{cItem.label+':'}}&nbsp</div>
                          <template v-if="cItem.events">
                            <div v-auto-width="{parentLayer:infoIndex,selfLayer:cIndex,id:'_1'+cItem.prop}" :style="cItem.bodyStyle || (columnGlobalStyle[layer]?columnGlobalStyle[layer].bodyStyle:{}) || {}">
                              <a v-text="cItem._mergeValue" @click="mergeColumnEvents(cItem,scope)"></a>
                            </div>
                          </template>
                          <template v-else>
                            <div
                              v-auto-width="{parentLayer:infoIndex,selfLayer:cIndex,id:'_1'+cItem.prop}"
                              :style="cItem.bodyStyle || (columnGlobalStyle[layer]?columnGlobalStyle[layer].bodyStyle:{}) || {}"
                              v-text="scope.row[cItem.prop]"
                              v-content-set="{config: cItem,row: scope.row}"></div>
                          </template>
                        </div>
                      </template>
                    </template>
                  </template>
                </div>
                <template v-else-if="colConfig.component">
                  <template v-if="Array.isArray(colConfig.component)">
                    <div
                      v-if="colConfig.componentName === 'button'"
                      v-reset-width="colConfig"
                      v-auto-width="{parentLayer:infoIndex,selfLayer:0,id:colConfig.prop}"
                      class="btnBox"
                      style="display: flex; white-space: normal;flex-wrap: wrap;"
                      :style="{'justify-content':setColumnWidth[colConfig.prop]?'space-between':'center'}">
                      <el-button
                        v-for="item in colConfig.component"
                        v-show="item.editBtns_isShow"
                        type="text"
                        style="height: 30px;width:60px;padding: 0;margin: 0;font-size: 12px;max-width: 60px;"
                        @click="item.method(scope.row,scope.$index,scope)">{{item.name}}</el-button>
                    </div>
                  </template>
                  <template v-else>
                    <div v-auto-width="{parentLayer:infoIndex,selfLayer:0,id:colConfig.prop}">
                      <component :key="infoIndex" :is="colConfig.component" :col-config="colConfig" :scope="scope"></component>
                    </div>
                  </template>
                </template>
                <div v-else>
                  <div v-if="useKeyValue" class="resetElStepStyle">
                    <div v-auto-width="{parentLayer:infoIndex,selfLayer:0,id:'_0'+colConfig.prop}" v-cloak>{{colConfig.label+':'}}&nbsp</div>
                    <div v-auto-width="{parentLayer:infoIndex,selfLayer:0,id:'_1'+colConfig.prop}" v-text="scope.row[colConfig.prop]"></div>
                  </div>
                  <div v-else v-auto-width="{parentLayer:infoIndex,selfLayer:0,id:colConfig.prop}"  v-text="scope.row[colConfig.prop]"></div>
                </div>
              </template>
            </el-table-column>
          </template>
        </el-table>
      </div>
    </div>
    <div v-if="showPageData" style="height: 40px;text-align: center;margin-top: 5px;">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page.sync="setPageData.current"
        :page-size="setPageData.size"
        layout="prev, pager, next, jumper"
        :total="setPageData.total-0">
      </el-pagination>
    </div>
  </div>

</template>

<script>
  import childrenTable from "./childrenTable"
  import { filerTableTitle, GUID, customHeaderTableStore, unCreateStore, updateExpandTableView } from '@/store/dynaStore'
  import {isNumber} from '@/utils/validate'
  import regexp from '@/utils/regexp'
  import DOMAPI from '@/utils/domTools'
  import {evil} from '@/utils/common'
  import {searchVal} from '@/utils/baseRules'

  //组件
  import customSteps from '@/components/customTable/core/customSteps'

  // 测试数据
  // import testData from '@/data/tableData'
  // import testData from '@/data/dateData'
  // import testData from '@/data/timeData'
  // import testData from '@/data/selectData'
  import testData from '@/data/invoiceData'


  //table操作栏里面的按钮
  const operateBtns = {
    props: ['colConfig','scope'],
    template: `<div class="btnBox">
      				  <template v-for="item in colConfig.methods">
      						<el-button  type="text" class="btns" style="font-size: 12px;" :disabled="scope.row.isdisable==='0'" @click="item(scope.row,scope.$index,scope)">删除</el-button>
      					</template>
      				</div>`
  }

  export default {
    name: 'custom-row-table',
    components: {
      customSteps
    },
    props: {
      //new
      mergeColumn: {
        type: Object,
        default: function () {
          return {}
        }
      },
      keyValue: {
        type: Boolean,
        default: false
      },
      baseHeight: {
        type: String,
        default: ''
      },
      baseBorder: {
        type: String,
        default: ''
      },
      columnGlobalStyle: {
        type: Object,
        default(){
          return {}
        }
      },

      // initData: {
      //   type: Object,
      //   default: function () {
      //     return {}
      //   }
      // },
      // childrenData: {
      //   type: Object,
      //   default: function () {
      //     return {}
      //   }
      // },
      configs: {
        type: Object,
        default: function () {
          return {}
        }
      },
      apiObj: {
        type: Object,
        default: function () {
          return {}
        }
      },
      // updateViewData: {
      //   type: Object,
      //   default: function () {
      //     return {}
      //   }
      // },
      'expand-all': {
        type: Boolean,
        default: true
      },
      customColumn: {
        type: Object,
        default: function () {
          return {}
        }
      },
      editable: [Object,Array],
      precision: {
        type: Number,
        default: 2
      },
      data: {
        type: Array,
        default: function () {
          return []
        }
      },
      titleList: {
        type: Array,
        default: function () {
          return []
        }
      },
    },
    data() {
      return {
        wrapperWidth: 0,
        tableWidth: 0,
        fixedList: [],
        expandRowKeys: [],
        getRowKey(row){
          return row.id
        },
        tableObj: {},
        // inlineColumn: {
        //   '1':[{
        //     columnIndex: 'last',
        //     prop: 'operate',
        //     label: '操作',
        //     component: operateBtns,
        //     methods: [this.deleteRow]
        //   }]
        // },
        guid: '',
        editTableLayer:-1,
        autoWidthList:[],
        autoWidthTimer: {},
        setScrollWidth: null,
        setScrollWidthTimer: -2,
        autoWidthSwitch: false,
        autoWidths: [],
        columnWidth: {},
        layer: 0,
        isLoading: true,
        userInfo: null,
      }
    },
    directives: {
      'reset-width':{
        inserted(el,binding,vnode){
          const that = vnode.context
          const num = binding.value.component?binding.value.component.length:0
          if(num>1){
            that.$set(that.columnWidth,binding.value.prop,Math.ceil(num/2)*60+25 + 'px')
          }
        }
      },
      'auto-width':{
        bind(el,binding,vnode){
          !vnode.context.autoWidthTimer[binding.value.id] && (vnode.context.autoWidthTimer[binding.value.id] = -1)
        },
        inserted(el,binding,vnode){
          !vnode.context.autoWidthList.length
          && (vnode.context.autoWidthList = vnode.context.setTitleList.map(v=>{return []}))
          vnode.context.$nextTick(_=>{
            if(vnode.context.autoWidthTimer[binding.value.id] === -1){
              vnode.context.autoWidthTimer[binding.value.id] = setTimeout(_=>{
                const width = el.clientWidth
                const value = binding.value
                const autoWidthList = vnode.context.autoWidthList
                if(autoWidthList[value.parentLayer].length){
                  if(autoWidthList[value.parentLayer][value.selfLayer]>-1){
                    const oldWidth = autoWidthList[value.parentLayer][value.selfLayer]
                    autoWidthList[value.parentLayer].splice(value.selfLayer,1,width + oldWidth)
                  }else {
                    autoWidthList[value.parentLayer][value.selfLayer] = width
                  }
                }else {
                  const tempArr = []
                  tempArr[value.selfLayer] = width
                  autoWidthList.splice(value.parentLayer,1,tempArr)
                }
                // console.log(autoWidthList)
              },20)
            }
          })
        },
        // componentUpdated(el,binding,vnode){
        //   console.log(el.clientWidth,binding.value)
        //   !vnode.context.autoWidthList.length
        //   && (vnode.context.autoWidthList = vnode.context.setTitleList.map(v=>{return []}))
        //   && (vnode.context.autoWidthTimer = vnode.context.setTitleList.map(v=>{return -1}))
        //   && (vnode.context.autoWidthSwitch = vnode.context.setTitleList.map(v=>{return true}))
        //   console.log(vnode.context.autoWidthList)
        //   if(vnode.context.autoWidthSwitch[binding.value.parentLayer]){
        //     const width = el.clientWidth
        //     const value = binding.value
        //     const autoWidthList = vnode.context.autoWidthList
        //     clearTimeout(vnode.context.autoWidthTimer[value.parentLayer])
        //     vnode.context.autoWidthTimer[value.parentLayer] = setTimeout(_=>{
        //       console.log(1111111)
        //       if(!vnode.context.autoWidthKey[value.id]){
        //         vnode.context.autoWidthSwitch[value.parentLayer] = false
        //       }
        //       if(autoWidthList[value.parentLayer].length){
        //         console.log(autoWidthList[value.parentLayer][value.selfLayer])
        //         if(autoWidthList[value.parentLayer][value.selfLayer]>-1){
        //           const oldWidth = autoWidthList[value.parentLayer][value.selfLayer]
        //           console.log(oldWidth)
        //           autoWidthList[value.parentLayer].splice(value.selfLayer,1,width + oldWidth)
        //         }else {
        //           autoWidthList[value.parentLayer][value.selfLayer] = width
        //         }
        //       }else {
        //         const tempArr = []
        //         tempArr[value.selfLayer] = width
        //         autoWidthList.splice(value.parentLayer,1,tempArr)
        //       }
        //       vnode.context.autoWidthKey[value.id] = false
        //     },20)
        //   }
        // }
      },
      'merga-rult':{
        bind(el,binding,vnode){
          // console.log(vnode.context.guid)
        },
        componentUpdated(el,binding,vnode){
          if(binding.value.rule){
            if(typeof binding.value.rule === 'string'){
              if(new RegExp(regexp[binding.value.rule].replace(/placeholder/g,'0,'),'g').test(binding.value.value)){
                DOMAPI.removeClass(el,'el-form-item')
                DOMAPI.removeClass(el,'is-error')
              }else {
                DOMAPI.addClass(el,'el-form-item')
                DOMAPI.addClass(el,'is-error')
              }
            }else {

            }
          }
        }
      },
      'content-set': {
        inserted(el, binding, vnode) {
          const contentSet = binding.value.config._cellConfig
            ?binding.value.config._cellConfig.contentSet || ''
            :''
          if(contentSet){
            const state = contentSet.state || {}, that = vnode.context, style = contentSet.style || {}
            for(const k in state){
              if(state.hasOwnProperty(k)){
                for(const i in style){
                  if(style.hasOwnProperty(i)){
                    el.style[i] = evil(style[i].replace(k,searchVal([state[k]],binding.value.row,[],that.setTableData,false,null)[0]))
                  }
                }
              }
            }
          }
        }
      },
    },
    components: {
      childrenTable
    },
    computed: {
      setColumnWidth() {
        return this.columnWidth
      },
      useKeyValue() {
        return this.keyValue
      },
      // autoWidths(){
      //   const tempArr = this.autoWidthList.map(v=>{
      //     return this.autoWidthSwitch?Math.max.apply(null,v)+20:null
      //   })
      //   return tempArr
      // },
      setShowCheckBox() {
        if(this.configs[this.layer] && this.configs[this.layer].showCheckBox && this.setTableData && this.setTableData.length){
          return true
        }else {
          return false
        }
      },
      setShowIndex() {
        if(this.configs[this.layer] && this.configs[this.layer].showIndex && this.setTableData && this.setTableData.length){
          return true
        }else {
          return false
        }
      },
      showPageData(){
        if(this.configs[this.layer] && this.configs[this.layer].showPageData && this.setPageData){
          return true
        }else {
          return false
        }
      },
      setTableHeight() {
        return this.showPageData?'calc(100% - 40px)':'100%'
      },
      expandOne() {
        if(this.configs[this.layer] && this.configs[this.layer].expandOne){
          return true
        }else {
          return false
        }
      },
      // formatedCustomColumn() {
      //   for(const k in this.inlineColumn){
      //     if(!this.customColumn[k]){
      //       this.customColumn[k] = this.inlineColumn[k]
      //     }
      //   }
      //   return this.customColumn
      // },
      setMergeColumns(){
        return this.mergeColumn
      },
      tableData() {
        return this.$store.getters[this.guid+'/mergedDataTree']
      },
      setTitleList() {
        return this.tableData.titleList || []
      },
      setTableData() {
        return this.tableData.tableData || []
      },
      setPageData() {
        return this.tableData.pageData || {}
      },
      setExpand() {
        return this['expandAll']
      },
      setExpandColumnWidth() {
        return this.setExpand?'1':'50'
      },
      setLoading(){
        if(this.mergeColumn[this.layer] && this.isLoading){
          return true
        }else {
          return false
        }
      },
    },
    created: function() {
      this.userInfo = this.$storage.get('userInfo')
      if(this.layer === 0){
        this.guid = GUID()
        customHeaderTableStore(this)
        console.log(this.apiObj)
        if(this.apiObj.apiName){
          if(this.userInfo.userId === '0'){
            setTimeout(()=>{
              this.$store.commit(this.guid+'/SET_MERGEDDATATREE',this.formatedTable({res:testData}))
            },1000)
          }else {
            this.$api[this.apiObj.apiName](Object.assign({},this.apiObj.params)).then(res => {
              this.$store.commit(this.guid+'/SET_MERGEDDATATREE',this.formatedTable({res}))
            }).catch(err => {
              console.log(err)
            })
          }
        }
      }else {

      }
    },
    mounted: function () {


    },
    beforeDestroy() {
      unCreateStore(this.$store,this.guid)
    },
    watch: {
      'apiObj.params'(){
        this.isLoading = true
        this.$api[this.apiObj.apiName](Object.assign({},this.apiObj.params)).then(res => {
          this.editTableLayer = -1
          this.$store.commit(this.guid+'/SET_MERGEDDATATREE',this.formatedTable({res}))
          this.isLoading = false
        }).catch(err => {
          this.isLoading = false
          console.log(err)
        })
      },
      autoWidthList:{
        deep: true,
        handler(n,o) {
          clearTimeout(this.setScrollWidthTimer)
          this.setScrollWidthTimer = setTimeout(_=>{
            this.autoWidths = n.map(v=>{
              const max = Math.max.apply(null,v)
              return (max>-9999&&max<9999)?(max+20):0
            })
            let maxWidth = 0
            this.autoWidths.forEach(v=>{ maxWidth+=v })
            this.setShowCheckBox && (maxWidth+=50)
            this.setShowIndex && (maxWidth+=50)
            maxWidth += this.setExpandColumnWidth-0
            const tempNum = this.$el.clientWidth>maxWidth?(this.$el.clientWidth - maxWidth)/this.autoWidthList.length:0
            this.autoWidths = this.autoWidths.map(cv=>{
              return cv?cv+tempNum:null
            })
            // console.log(this.autoWidths)
            this.autoWidths[this.autoWidths.length-1] && (this.autoWidthSwitch = true) && this.$refs.baseTable.$nextTick(_=>{
              this.isLoading = false
            })

          },10)
        }
      },
    },
    methods:{
      createStepStyle(stemIndex,_scope,childColconfig){
        const state = parseInt(_scope.row[childColconfig.keyName]) || 0
        if(stemIndex < state){
          return {
            'background-color': 'rgb(0,176,240)',
            color: '#ffffff',
            'flex-basis': `${100/childColconfig.componentConfig.titleList.length}%`,
          }
        }else if(stemIndex === state){
          return {
            'background-color': 'rgb(255,192,0)',
            'flex-basis': `${100/childColconfig.componentConfig.titleList.length}%`,
          }
        }else {
          return {
            'background-color': 'rgb(191,191,191)',
            color: '#ffffff',
            'flex-basis': `${100/childColconfig.componentConfig.titleList.length}%`,
          }
        }
      },
      createStepArrowStyle(stemIndex,_scope,childColconfig){
        const state = parseInt(_scope.row[childColconfig.keyName]) || 0
        if(stemIndex < state){
          return {
            'border-left': `10px solid rgb(0,176,240)`,
          }
        }else if(stemIndex === state){
          return {
            'border-left': `10px solid rgb(255,192,0)`,
          }
        }else {
          return {
            'border-left': `10px solid rgb(191,191,191)`,
          }
        }
      },
      setColumnClass(config){
        let className = ''
        if(this.useKeyValue) className += 'autoWidthClass'
        if(config.component) className += ' resetBtnLayout'
        return className
      },
      upDateView(params){
        this.$api[this.apiObj.apiName](Object.assign({},this.apiObj.params,params?params:undefined)).then(res => {
          this.$store.commit(this.guid+'/SET_MERGEDDATATREE',this.formatedTable({res}))
        }).catch(err => {
          console.log(err)
        })
      },
      getData(){
        !this.layer && this.$emit('get-data',this.tableData)
      },

      mergeColumnEvents(cItem,scope){
        const type = cItem.events.type
        if(type === 'navigation'){
          this.$router.push({path: '/'+cItem.events.path})
        }
        if(type === 'click'){
          this.componentMethod(scope.row,scope.$index,cItem)
        }
      },
      mergeColumnsFn(data,layer){
        // const tempObj = {}
        let baseKey = '',listName = layer?'children':'tableData'
        // for(const k in data){
        //   if(data.hasOwnProperty(k)){
        //     if(Array.isArray(data[k])){
        //       tempObj[k] = [].concat(data[k])
        //     }else {
        //       tempObj[k] = data[k]
        //     }
        //   }
        // }
        // console.log(tempObj)
        this.setMergeColumns[layer].forEach((v,baseIndex) => {
          const arr = []
          v.columns.forEach(cv => {
            if(typeof cv === 'string'){
              const index = data.titleList.findIndex(tv => {
                if(tv.prop === cv){
                  arr.push(tv)
                  return true
                }
              })
              index > -1 && data.titleList.splice(index,1)
            }else {
              const index = data.titleList.findIndex(tv => {
                if(tv.prop === cv.keyName){
                  arr.push(Object.assign({},tv,cv))
                  return true
                }
              })
              index > -1 && data.titleList.splice(index,1)
            }
          })
          baseKey = v.alias?v.alias:'mergeKey'+baseIndex
          data.titleList.splice(v.index-1,0,{prop:baseKey,label:baseKey,width:v.width})
          //console.log(arr)
          data[listName].forEach(iv=>{
            iv[baseKey] = arr.map(cv=>{
              const sv = Object.assign({},cv)
              sv._mergeValue = iv[sv.prop] || ''
              return sv
            })
          })
        })
        //console.log(data)
        // return tempObj
        //this.$store.commit(this.guid+'/SET_MERGEDDATATREE',tempObj)
      },
      formatedTable(res) {
        if(!this.layer){
          const tempObj = JSON.parse(JSON.stringify(res))
          let tempData = this.getListPage(tempObj.res,this.customColumn,this.layer)
          tempData.tableData && tempData.tableData.length && this.formatEditTable(tempData.tableData)
          this.setMergeColumns[this.layer] && this.setMergeColumns[this.layer].length && this.mergeColumnsFn(tempData,this.layer)
          !this.setTableData.length && (this.isLoading = false)
          return tempData
        }else {
          return {}
        }
      },
      formatEditTable(list){
        this.editTableLayer++
        list.forEach((v,index) => {
          if(v.children && v.children.length){
            this.formatEditTable(v.children)
          }
          if(this.editTableLayer>0){
            if(Array.isArray(this.editable)){
              const tempObj = {}
              this.editable.forEach(item => {
                tempObj[item] = {
                  type: this.automaticInference(item,v)
                }
              })
              v._editConfig = tempObj
            }else if(typeof this.editable === 'object') {
              Object.keys(this.editable).forEach(str => {
                if(Object.keys(v).indexOf(str)>-1){
                  v._editConfig = Object.assign({},this.editable)
                }
              })
            }
          }

        })
      },
      automaticInference(prop,row){
        const testStr = row[prop]
        let type = ''
        if((testStr === '1' || testStr === '0') && prop === 'isdisable'){
          type = 'switch'
        }else if(new RegExp(regexp['date'].replace(/placeholder/g,'0,'),'g').test(testStr)){
          type = 'date'
        }else if(new RegExp(regexp['time'].replace(/placeholder/g,'0,'),'g').test(testStr)){
          type = 'time'
        }else {
          type = 'input'
        }
        return type
      },
      deleteRow(row,index){
        this.$store.commit(this.guid+'/DELETE_ROW',row)
        this.$nextTick(_=>{
          this.$refs.baseTable.doLayout()
        })
      },
      setShowHeader() {
        if(this.keyValue){
          return false
        }else {
          if(this.layer){
            return this.setTableData.length !== 0
          }else {
            return true
          }
        }
      },
      setRowClass() {
        if(this.setExpand){
          return 'row-expand-cover'
        }
      },
      setCellStyle(){
        if(!this.layer){
          return {
            'border-bottom': 'none'
          }
        }
      },
      setHeaderRowClass() {
        if(this.setExpand){
          return 'header-expand-cover'
        }
      },
      selectable(row, index) {
        return  row.rowState === '1'
      },
      expandChange(row, list){
        const state = list.some(item => {
          return item.id === row.id
        })
        if(state){
          this.expandOne && this.toggleRowExpands(list,row)
        }
        this.$refs.baseTable.setCurrentRow(row)
        this.$refs.baseTable.$nextTick(_ => {
          this.$refs.baseTable.doLayout()
        })
      },
      toggleRowExpands(list,row){
        list.forEach(item => {
          this.$refs.baseTable.toggleRowExpansion(item,item.id===row.id)
        })
      },
      getListPage(res,customColumn,layer) {
        const that = this
        if (res) {
          res.result.titles = typeof res.result.titles === 'string'?JSON.parse(res.result.titles):res.result.titles
          res.result.varList = typeof res.result.varList === 'string'?JSON.parse(res.result.varList):res.result.varList
          res.result.pageData = typeof res.result.pageData === 'string'?JSON.parse(res.result.pageData):res.result.pageData
          const data = filerTableTitle(res.result)
          const titleList = that.addTableTitle(data,customColumn,layer)
          res.result.varList.forEach((item,index) => {
            if(item.titles && item.hideTitles && item.children){
              const tempObj = {
                result:{
                  titles: item.titles,
                  hideTitles: item.hideTitles,
                  varList: item.children,
                  pageData: {}
                }
              }
              const cres = this.getListPage(tempObj,customColumn,layer+1)
              item.titleList = cres.titleList
              item.pageData = cres.pageData
              this.setMergeColumns[1] && this.setMergeColumns[1].length && this.mergeColumnsFn(item,1)
            }
          })

          return {
            titleList,
            pageData: res.result.pageData,
            tableData: res.result.varList
          }
        }else {
          return {}
        }
      },

      addTableTitle(list,customColumn,layer) {
        if(customColumn[layer] && Array.isArray(customColumn[layer])){
          customColumn[layer].forEach(item => {
            if(isNumber(item.columnIndex)){
              list.splice(item.columnIndex,0,item)
            }else {
              if(item.columnIndex === 'first'){
                list.unshift(item)
              }else if(item.columnIndex === 'last'){
                list.push(item)
              }else {
                list.some(listItem => {
                  if(listItem.prop === item.columnIndex){
                    Object.assign(listItem,item)
                    return true
                  }
                })
              }
            }
          })
        }
        return list
      },
      indexMethod(index) {
        return index + 1
      },
      selectItem(selection, row) {
        this.$emit('databridge',selection)
        // if(this.isSingle){
        //   if(selection.length){
        //     this.data.forEach(item => {
        //       item.isdisable = '0'
        //     })
        //     selection[0].isdisable = '1'
        //   }else {
        //     this.data.forEach(item => {
        //       item.isdisable = '1'
        //     })
        //   }
        // }
      },
      selectAll(selection) {
        this.$emit('databridge',selection)
      },
      databridge(data) {
        this.$emit('databridge',data)
      },
      handleCurrentChange(pageIndex) {
        this.$emit('update:currentpage', pageIndex)
      },
      doLayout(){
        this.$refs.baseTable.$nextTick(_ => {
          console.log('parentUpdate')
          this.$refs.baseTable.doLayout()
        })
      },
      componentMethod(row,index,config){
        config && config._cellConfig && config._cellConfig.methodName && this.$emit('callmethod',{
          methodName: config._cellConfig.methodName,
          params: {row,index}
        })
      },


      // changePage(data) {
      //   console.log(data)
      //   updateExpandTableView({_that:this,currentpage:data.currentpage,rowChain:data.rowChain})
      // }
    }
  }
</script>

<style lang="scss" rel="text/css">
  [v-cloak] {
    display: none;
  }
  .resetCustomRowTableStyle {
    .resetBtnLayout {
      .cell.el-tooltip {
        white-space:normal
      }
    }
  }
  .el-table__expanded-cell[class*=cell] {
    padding: 10px 10px 10px 10px;
  }
  .resetTableStyle {
    >.el-table {
      >.el-table__body-wrapper{
        >table {
          border-spacing: 0 0;
        }
      }
    }
  }
  .baseTableStyle {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    .el-form-item {
      margin-bottom: 0;
    }
  }

  .row-expand-cover td:first-child {
    border-right: none;
  }
  .row-expand-cover td:first-child .cell {
    display: none;
  }
  .header-expand-cover th:first-child {
    border-right: none;
  }

  .customStepView {
    display: flex;
    white-space: nowrap;
    .customStepBox {
      display: flex;
      font-size: 12px;
      padding-left: 3px;
      margin-right: 15px;
      position: relative;
      .stepArrow {
        content:"";
        position: absolute;
        right: -10px;
        top: 0;
        width: 0;
        height: 100%;
        border-top: 11.5px solid transparent;
        border-bottom: 11.5px solid transparent;
      }
    }
  }


</style>
