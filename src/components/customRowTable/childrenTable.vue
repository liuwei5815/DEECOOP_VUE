<template>
  <div class="childrens">
    <el-form :model="ruleForm" ref="ruleForm" status-icon >
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
              :row-key="getRowKey"
              @select="selectItem"
              @select-all="selectAll">
      <template v-if="setShowCheckBox">
        <el-table-column type="selection" :selectable="selectable" width="55" align="center"></el-table-column>
      </template>
      <template v-if="setShowIndex">
        <el-table-column type="index" :index="indexMethod" label="序号" width="60" align="center"></el-table-column>
      </template>
      <template v-for="(colConfig,infoIndex) in setTitleList">
        <!--<component v-if="colConfig.component" :key="infoIndex" :is="colConfig.component" :col-config="colConfig"></component>-->
        <el-table-column
          show-overflow-tooltip
          :key="infoIndex"
          v-bind="colConfig"
          :label="colConfig.label"
          :width="colConfig.width || null"
          align="center">
          <template slot-scope="scope">
            <template v-if="Array.isArray(scope.row[colConfig.prop])&&scope.row[colConfig.prop].length&&scope.row[colConfig.prop][0].hasOwnProperty('_mergeValue')">
              <template v-for="(cItem,cIndex) in scope.row[colConfig.prop]">
                <template v-if="cItem.hasOwnProperty('_mergeValue') && !cItem.keyName">
                  <div class="resetElStepStyle" :style="{'text-align': cItem.hideTitle?'center':'left'}">
                    <div v-if="!cItem.hideTitle" v-auto-width="{parentLayer:infoIndex,selfLayer:cIndex,id:'_0'+cItem.prop}" v-cloak>{{cItem.label+':'}}&nbsp</div>
                    <div v-auto-width="{parentLayer:infoIndex,selfLayer:cIndex,id:'_1'+cItem.prop}" v-text="cItem._mergeValue"></div>
                  </div>
                </template>
                <template v-else>
                  <template v-if="cItem.componentName">
                    <div v-if="cItem.componentName === 'el-steps' || cItem.componentName === 'el-step'" class="resetElStepStyle">
                      <div v-if="!cItem.hideTitle" v-auto-width="{parentLayer:infoIndex,selfLayer:cIndex,id:'_0'+cItem.keyName}" :style="cItem.titleStyle || {}" v-cloak>{{cItem.label+':'}}&nbsp</div>
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
                      <div v-if="!cItem.hideTitle" style="float: left;" :style="[{'line-height': cItem.componentConfig['stroke-width']>23?2:''},cItem.titleStyle]" v-auto-width="{parentLayer:infoIndex,selfLayer:cIndex,id:'_0'+cItem.keyName}" v-cloak>{{cItem.label+':'+(cItem.componentConfig.showInitValue?scope.row[cItem.keyName]:'')}}&nbsp</div>
                      <div
                        v-auto-width="{parentLayer:infoIndex,selfLayer:cIndex,id:'_1'+cItem.keyName}"
                        style="overflow: hidden;"
                        :style="{'padding-top':(cItem.componentConfig['stroke-width']?(cItem.componentConfig['stroke-width']<24?(24-cItem.componentConfig['stroke-width'])/2:cItem.componentConfig['stroke-width']):0)+'px'}">
                        <el-progress
                          :percentage="(cItem.componentConfig.baseValue?((scope.row[cItem.keyName]-0)/(cItem.componentConfig.baseValue-0)*100).toFixed(2)-0:(scope.row[cItem.keyName]-0))||0"
                          :text-inside="cItem.componentConfig['text-inside']?true:false"
                          :stroke-width="cItem.componentConfig['stroke-width'] || 16"
                          :show-text="cItem.componentConfig['show-text']?true:false"
                          :color="cItem.componentConfig.color || ''"></el-progress>
                      </div>
                    </div>
                    <div v-else-if="cItem.componentName === 'el-input'" class="clearfix">
                      <div v-if="!cItem.hideTitle" v-auto-width="{parentLayer:infoIndex,selfLayer:cIndex,id:'_0'+cItem.keyName}" style="float: left;" :style="cItem.titleStyle || {}" v-cloak>{{cItem.label+':'}}&nbsp</div>
                      <div v-auto-width="{parentLayer:infoIndex,selfLayer:cIndex,id:'_1'+cItem.keyName}" style="overflow: hidden;" :style="cItem.bodyStyle || {}">
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
                  </template>
                  <template v-else>
                    <div class="resetElStepStyle" style="text-align: left">
                      <div v-if="!cItem.hideTitle" v-auto-width="{parentLayer:infoIndex,selfLayer:cIndex,id:'_0'+cItem.prop}" :style="cItem.titleStyle || {}" v-cloak>{{cItem.label+':'}}&nbsp</div>
                      <template v-if="cItem.events">
                        <div v-auto-width="{parentLayer:infoIndex,selfLayer:cIndex,id:'_1'+cItem.prop}" :style="cItem.bodyStyle || {}">
                          <a v-text="cItem._mergeValue" @click="mergeColumnEvents(cItem,scope)"></a>
                        </div>
                      </template>
                      <template v-else>
                        <div
                          v-auto-width="{parentLayer:infoIndex,selfLayer:cIndex,id:'_1'+cItem.prop}"
                          :style="cItem.bodyStyle || {}"
                          v-text="cItem._mergeValue"
                          v-content-set="{config: cItem,row: scope.row}"></div>
                      </template>
                    </div>
                  </template>
                </template>
              </template>
            </template>
            <template v-else-if="scope.row._editConfig && scope.row._editConfig[colConfig.prop]">
              <template v-if="scope.row._editConfig[colConfig.prop].type === 'input'">
                <template v-if="scope.row._editConfig[colConfig.prop].asyn">
                  <el-form-item :prop="'tableData.'+scope.$index+'.'+colConfig.prop" :rules="createItemRules(colConfig,colConfig.prop,scope.row)" :inline-message="true">
                    <el-autocomplete
                      size="small"
                      placeholder="请输入内容"
                      v-model="scope.row[colConfig.prop]"
                      clearable
                      :value-key="scope.row._editConfig[colConfig.prop].valueKey?scope.row._editConfig[colConfig.prop].valueKey:'name'"
                      :debounce="debounce"
                      :fetch-suggestions="querySearchAsync(scope.row,colConfig.prop)"
                      :disabled="scope.row.isdisable==='0'">
                      <i v-if="scope.row._editConfig[colConfig.prop].icon" slot="suffix" class="treeFormTableIcon">
                        <svg-icon :icon-class="scope.row._editConfig[colConfig.prop].icon"></svg-icon>
                      </i>
                    </el-autocomplete>
                  </el-form-item>
                </template>
                <template v-else>
                  <el-form-item :prop="'tableData.'+scope.$index+'.'+colConfig.prop" :rules="createItemRules(colConfig,colConfig.prop,scope.row)" :inline-message="true">
                    <el-input
                      size="small"
                      placeholder="请输入内容"
                      v-model="scope.row[colConfig.prop]"
                      clearable
                      :align="'center'"
                      :type="scope.row._editConfig[colConfig.prop].textarea?'textarea':'text'"
                      :disabled="(scope.row._editConfig[colConfig.prop].compute?true:false)||scope.row.isdisable==='0'"
                      @blur="computedCell(scope.row,colConfig.prop)">
                      <i v-if="scope.row._editConfig[colConfig.prop].icon" slot="suffix" class="treeFormTableIcon">
                        <svg-icon :icon-class="scope.row._editConfig[colConfig.prop].icon"></svg-icon>
                      </i>
                    </el-input>
                  </el-form-item>
                </template>
              </template>
              <template v-else-if="scope.row._editConfig[colConfig.prop].type === 'date'">
                <el-date-picker
                  size="small"
                  v-model="scope.row[colConfig.prop]"
                  :format="scope.row._editConfig[colConfig.prop].format || 'yyyy 年 MM 月 dd 日'"
                  :value-format="scope.row._editConfig[colConfig.prop].format || 'yyyy-MM-dd'"
                  :default-value="defaultValue(scope.row._editConfig[colConfig.prop].defaultValue,scope.row,colConfig.prop)"
                  :editable="scope.row._editConfig[colConfig.prop].editable===undefined?true:scope.row._editConfig[colConfig.prop].editable"
                  :disabled="scope.row.isdisable==='0'"
                  :type="scope.row._editConfig[colConfig.prop].valueType || 'date'"
                  :placeholder="scope.row._editConfig[colConfig.prop].placeholder || '选择日期'"
                  :picker-options="pickerOptions(scope.row,colConfig.prop)">
                </el-date-picker>
              </template>
              <template v-else-if="scope.row._editConfig[colConfig.prop].type === 'time'">
                <el-time-picker
                  v-model="scope.row[colConfig.prop]"
                  clearable
                  size="small"
                  align="center"
                  :disabled="scope.row.isdisable==='0'"
                  :editable="false"
                  placeholder="任意时间点">
                </el-time-picker>
              </template>
              <template v-else-if="scope.row._editConfig[colConfig.prop].type === 'select'">
                <el-select
                  v-model="scope.row[colConfig.prop]"
                  size="small"
                  clearable
                  filterable
                  :disabled="scope.row.isdisable==='0'"
                  :multiple="scope.row._editConfig[colConfig.prop].multiple || false"
                  :loading="selectLoading"
                  placeholder="请选择"
                  @focus="getSelectOptions(scope.row,colConfig.prop,scope.$index)">
                  <el-option
                    v-for="item in selectOptionList[scope.$index][colConfig.prop]"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                    :disabled="item.isdisable==='0'">
                  </el-option>
                </el-select>
              </template>
              <template v-else-if="scope.row._editConfig[colConfig.prop].type === 'cascader'"></template>
              <template v-else-if="scope.row._editConfig[colConfig.prop].type === 'switch'"></template>
              <template v-else-if="scope.row._editConfig[colConfig.prop].type === 'dateTime'">
                <el-date-picker
                  size="small"
                  clearable
                  v-model="scope.row[colConfig.prop]"
                  type="datetime"
                  align="center"
                  placeholder="选择日期时间"
                  :value-format="'yyyy-MM-dd HH:mm:ss'"
                  :disabled="scope.row.isdisable==='0'"
                  :editable="false">
                </el-date-picker>
              </template>
              <template v-else-if="scope.row._editConfig[colConfig.prop].type === 'inputNumber'"></template>
              <template v-else>
                <span style="margin-left: 10px" v-content-set="{config: colConfig,row: scope.row}">{{ scope.row[colConfig.prop] }}</span>
              </template>
            </template>
            <template v-else-if="colConfig.component">
              <div v-auto-width="{parentLayer:infoIndex,selfLayer:0,id:colConfig.prop}">
                <component :key="infoIndex" :is="colConfig.component" :col-config="colConfig" :scope="scope"></component>
              </div>
            </template>
            <template v-else>
              <span style="margin-left: 10px" v-content-set="{config: colConfig,row: scope.row}">{{ scope.row[colConfig.prop] }}</span>
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>
    </el-form>
  </div>

</template>

<script>
  import regexp from '@/utils/regexp'
  import {createRules,searchVal,getVal} from '@/utils/baseRules'
  import dateTool from '@/utils/dateTools'
  import {evil} from '@/utils/common'

  //table操作栏里面的按钮
  const operateBtns = {
    props: ['colConfig'],
    template: `<el-table-column :label="colConfig.label" align="center">
      					<div slot-scope="scope" class="btnBox">
      					  <template v-for="item in colConfig.methods">
      							<el-button  type="text" class="btns" style="font-size: 12px;" :disabled="scope.row.isdisable==='0'" @click="item(scope.row,scope.$index,scope)">删除</el-button>
      						</template>
      					</div>
    				</el-table-column>`
  }

  export default {
    components: {},
    name: 'custom-header-children-table',
    props: {
      mergeColumn: {
        type: Object,
        default: function () {
          return {}
        }
      },
      configs: {
        type: Object,
        default: function () {
          return {}
        }
      },
      layer: {
        type: Number,
        default: 1
      },
      apiObj: {
        type: Object,
        default: function () {
          return {}
        }
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
      guid: {
        type: String,
        default: ''
      },
      parent: {
        type: Array,
        default: function () {
          return []
        }
      },
      rowChain: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    data() {
      return {
        wrapperWidth: 0,
        tableWidth: 0,
        fixedList: [],
        getRowKey(row){
          return row.id
        },
        tableObj: {},
        parentId: '',
        tempType: [],
        setRowChain:[],
        baseRules: null,
        ruleForm:{
          tableData:[]
        },
        restaurants: [],
        debounce: 300,
        selectOptionList:[],
        selectLoading:false,
        removalList:[],
        selectOptionObj: {},
      }
    },
    directives: {
      'auto-width': {
        // bind(el, binding, vnode) {
        //   vnode.context.autoWidthTimer[binding.value.id] = -1
        // },
        // inserted(el, binding, vnode) {
        //   !vnode.context.autoWidthList.length
        //   && (vnode.context.autoWidthList = vnode.context.setTitleList.map(v => {
        //     return []
        //   }))
        //   vnode.context.$nextTick(_ => {
        //     if (vnode.context.autoWidthTimer[binding.value.id] === -1) {
        //       vnode.context.autoWidthTimer[binding.value.id] = setTimeout(_ => {
        //         const width = el.clientWidth
        //         const value = binding.value
        //         const autoWidthList = vnode.context.autoWidthList
        //         if (autoWidthList[value.parentLayer].length) {
        //           if (autoWidthList[value.parentLayer][value.selfLayer] > -1) {
        //             const oldWidth = autoWidthList[value.parentLayer][value.selfLayer]
        //             autoWidthList[value.parentLayer].splice(value.selfLayer, 1, width + oldWidth)
        //           } else {
        //             autoWidthList[value.parentLayer][value.selfLayer] = width
        //           }
        //         } else {
        //           const tempArr = []
        //           tempArr[value.selfLayer] = width
        //           autoWidthList.splice(value.parentLayer, 1, tempArr)
        //         }
        //       }, 20)
        //     }
        //   })
        // },
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
    computed: {
      setTableHeight() {
        return this.showPageData?'calc(100% - 40px)':'100%'
      },
      setShowCheckBox() {
        if(this.configs[this.layer] && this.configs[this.layer].showCheckBox){
          return true
        }else {
          return false
        }
      },
      setShowIndex() {
        if(this.configs[this.layer] && this.configs[this.layer].showIndex){
          return true
        }else {
          return false
        }
      },
      setTitleList() {
          return this.titleList
      },
      setTableData() {
        this.data.forEach((item,index) => {
          item._pid = this.parentId
          item.index = index
        })
        return this.data
      },
      computedKeys(){
        const tempArr = []
        if(this.data[0] && this.data[0]._editConfig){
          for(const k in this.data[0]._editConfig){
            if(this.data[0]._editConfig.hasOwnProperty(k)){
              this.data[0]._editConfig[k].compute && tempArr.push(k)
            }
          }
        }
        return tempArr
      },
      createSelectOptions(){
        const tempArr = []
        this.setTableData.forEach((v,index)=>{
          const tempObj = {}
          if(v._editConfig && typeof v._editConfig === 'object'){
            for(const k in v._editConfig){
              if(v._editConfig.hasOwnProperty(k)){
                if(v._editConfig[k].type === 'select'){
                  if(v._editConfig[k].asyn && v._editConfig[k].asyn.apiName){
                    tempObj[k] = []
                    //this.getSelectOptions(v,index,k)
                  }else if(v._editConfig[k].options){
                    tempObj[k] = v._editConfig[k].options.length?v._editConfig[k].options:[]
                  }
                }
              }
            }
          }
          tempArr[index] = tempObj
        })
        return tempArr
      },
    },
    created: function() {
      this.parentId = this.parent[0].id
      this.setRowChain = this.rowChain.concat(this.parent)
      this.baseRules = this.createRult()
      this.ruleForm.tableData = this.setTableData
      this.selectOptionList = this.createSelectOptions
    },
    mounted: function () {
      // this.$refs.baseTable.$nextTick(_ => {
      //   this.$emit('do-layout')
      // })
    },
    updated: function () {
      this.$nextTick(_ => {
        this.$refs.baseTable.doLayout()
        this.$emit('do-layout')
      })
    },
    watch: {
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
      mergeColumnEvents(cItem,scope){
        const type = cItem.events.type
        if(type === 'navigation'){
          this.$router.push({path: '/'+cItem.events.path})
        }
      },

      httpRemoval(row,key,index){
        if(!this.removalList.length){
          const obj = {
            apiName: row._editConfig[key].asyn.apiName,
            params: this.setParams(row,key),
            timeStamp: new Date().getTime()
          }
          this.removalList.push(obj)
          return true
        }else {
          const tempObj = this.setParams(row,key)
          const state = this.removalList.some(v=>{
            if(v.apiName === row._editConfig[key].asyn.apiName){
              if((new Date().getTime() - v.timeStamp)>30000){
                v.timeStamp = new Date().getTime()
                v.params = tempObj
                return true
              }else {
                for(const k in v.params){
                  if(v.params.hasOwnProperty(k)){
                    if(v.params[k] !== tempObj[k]){
                      v.timeStamp = new Date().getTime()
                      v.params = tempObj
                      return true
                    }
                  }
                }
              }
            }
          })
          if(this.removalList.some(v=>{return v.apiName !== row._editConfig[key].asyn.apiName})){
            this.removalList.push({
              apiName: row._editConfig[key].asyn.apiName,
              params: this.setParams(row,key),
              timeStamp: new Date().getTime()
            })
            return true
          }
          return state
        }
      },
      getSelectOptions(row,key,index){
        if(row._editConfig[key] && row._editConfig[key].asyn){
          if(this.httpRemoval(row,key,index)){
            this.selectLoading = true
            this.$api[row._editConfig[key].asyn.apiName](this.setParams(row,key)).then(res=>{
              this.selectLoading = false
              this.selectOptionList[index][key] = res.result.options
              this.selectOptionObj[row._editConfig[key].asyn.apiName] = res.result.options
            }).catch(err =>{
              console.log(err)
            })
          }else {
            this.selectOptionList[index][key] = this.selectOptionObj[row._editConfig[key].asyn.apiName]
          }
        }
      },
      setParams(row,key) {
        const tempObj = Object.assign({},row._editConfig[key].asyn.params)
        for(const k in tempObj){
          if(tempObj.hasOwnProperty(k) && !tempObj[k]){
            tempObj[k] = row[k] || ''
          }
        }
        return Object.assign({},tempObj)
      },
      defaultValue(str,row,prop){
        const start = searchVal(str?[str]:[],row,this.setRowChain,this.data)
        start.length === 1 && row._editConfig[prop].compute && (row[prop] = this.computeVal(row._editConfig[prop].compute,row,prop))
        start.length>1 && (row[prop] = start[0])
      },
      computeVal(str,row,prop){
        const cList = str.split(/\([\\+|\-|\\*|\\/]\)/)
        if(cList.length>1){
          const result = getVal(cList,row,this.setRowChain,this.data,str)
          return dateTool.formatDate(result)
        }else {
          return row[prop]
        }
      },
      setCloWidth(config){
        let width = ''
        if(!Array.isArray(this.editable)){
          const type = this.editable[config.prop]?this.editable[config.prop].type:''
          console.log(type)
          switch (type) {
            case 'date':
              width = '180'
              break;
            case 'cascader':
              break;
            case 'select':
              break;
            case 'inputNumber':
              break;
            case 'time':
              width = '140'
              break;
            case 'dateTime':
              width = '220'
              break;
            default:
              break;
          }
        }
        return width
      },
      pickerOptions(row,prop){
        const editConfig = row._editConfig[prop]
        let start,end
        editConfig.greaterThan && (start = this.formatDates(row,prop,editConfig.greaterThan,false))
        editConfig.lessThan && (end = this.formatDates(row,prop,editConfig.lessThan,true))
        const tempObj = {}
        tempObj.disabledDate = (time)=>{
          if(start && end){
            if(time.getTime() > start && time.getTime() < (end-(3600*24*1000))){
              return false
            }else {
              return true
            }
          }else if(start && !end){
            return time.getTime() < start
          }else if(!start && end){
            return time.getTime() > (end+(3600*24*1000))
          }else {
            return false
          }
        }
        let reStart,reEnd
        start && editConfig.greaterThan[editConfig.greaterThan.length-1] && (reStart = start+(3600*24*1000))
        end && editConfig.lessThan[editConfig.lessThan.length-1] && (reEnd = end-(3600*24*1000))
        editConfig.shortcuts && (tempObj.shortcuts =this.createShortcuts(editConfig.shortcuts,reStart,reEnd))
        return tempObj
      },
      formatDates(row,prop,strList,state){
        const start = searchVal(strList,row,this.setRowChain,this.data)
        let isEqual,result
        if(typeof start[start.length-1] === 'boolean'){
          isEqual = start.pop()
        }
        if(state){
          result = Math.min(...start.map(v => {
            return dateTool.timeStamp(v)
          }))
          isEqual && (result+=(3600*24*1000))
        }else {
          result = Math.max(...start.map(v => {
            return dateTool.timeStamp(v)
          }))
          isEqual && (result-=(3600*24*1000))
        }
        return result
      },
      createShortcuts(list,start,end){
        return list.map(v => {
          let tempObj
          switch (v){
            case 'yesterday':
              tempObj = {
                text: '昨天',
                onClick(picker) {
                  const date = new Date()
                  date.setTime(start?((date.getTime() - 3600 * 1000 * 24)<start?start:(date.getTime() - 3600 * 1000 * 24)):(date.getTime() - 3600 * 1000 * 24))
                  picker.$emit('pick',date);
                }
              }
              break;
            case 'today':
              tempObj = {
                text: '今天',
                onClick(picker) {
                  picker.$emit('pick', new Date());
                }
              }
              break;
            case 'tomorrow':
              tempObj = {
                text: '明天',
                onClick(picker) {
                  const date = new Date()
                  date.setTime(end?((date.getTime() + 3600 * 1000 * 24)>end?end:(date.getTime() + 3600 * 1000 * 24)):(date.getTime() + 3600 * 1000 * 24))
                  picker.$emit('pick', date);
                }
              }
              break;
            case 'lastWeek':
              tempObj = {
                text: '上周',
                onClick(picker) {
                  const date = new Date()
                  date.setTime(start?((date.getTime() - 3600 * 1000 * 24 * 7)<start?start:(date.getTime() - 3600 * 1000 * 24 * 7)):(date.getTime() - 3600 * 1000 * 24 * 7))
                  picker.$emit('pick', date);
                }
              }
              break;
            case 'nextWeek':
              tempObj = {
                text: '下周',
                onClick(picker) {
                  const date = new Date()
                  date.setTime(end?((date.getTime() + 3600 * 1000 * 24 * 7)>end?end:(date.getTime() + 3600 * 1000 * 24 * 7)):(date.getTime() + 3600 * 1000 * 24 * 7))
                  picker.$emit('pick', date);
                }
              }
              break;
            case 'lastMonth':
              tempObj = {
                text: '上月',
                onClick(picker) {
                  const date = new Date()
                  date.setTime(start?((date.getTime() - 3600 * 1000 * 24 * 30)<start?start:(date.getTime() - 3600 * 1000 * 24 * 30)):(date.getTime() - 3600 * 1000 * 24 * 30))
                  picker.$emit('pick', date);
                }
              }
              break;
            case 'nextMonth':
              tempObj = {
                text: '下月',
                onClick(picker) {
                  const date = new Date()
                  date.setTime(end?((date.getTime() + 3600 * 1000 * 24 * 30)>end?end:(date.getTime() + 3600 * 1000 * 24 * 30)):(date.getTime() + 3600 * 1000 * 24 * 30))
                  picker.$emit('pick', date);
                }
              }
              break;
            case 'lastYear':
              tempObj = {
                text: '去年',
                onClick(picker) {
                  const date = new Date()
                  date.setTime(start?((date.getTime() - 3600 * 1000 * 24 * 365)<start?start:(date.getTime() - 3600 * 1000 * 24 * 365)):(date.getTime() - 3600 * 1000 * 24 * 365))
                  picker.$emit('pick', date);
                }
              }
              break;
            case 'nextYear':
              tempObj = {
                text: '明年',
                onClick(picker) {
                  const date = new Date()
                  date.setTime(end?((date.getTime() + 3600 * 1000 * 24 * 365)>end?end:(date.getTime() + 3600 * 1000 * 24 * 365)):(date.getTime() + 3600 * 1000 * 24 * 365))
                  picker.$emit('pick', date);
                }
              }
              break;
          }
          return tempObj
        })
      },
      querySearchAsync(row,prop){
        return (queryString,cb)=>{
          const apiObj = row._editConfig[prop].asyn || null
          apiObj && this.$api[apiObj.apiName](apiObj.params).then(res =>{
            this.restaurants = res.result.options || []
            const results = queryString ? this.restaurants.filter(this.createStateFilter(queryString,row,prop)) : this.restaurants
            cb(results)
          }).catch(err => {
            console.log(err)
          })
        }
      },
      createStateFilter(queryString,row,prop) {
        return (state) => {
          return (state[row._editConfig[prop].valueKey?row._editConfig[prop].valueKey:'name'].toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        }
      },
      computedCell(row,prop){
        if(!this.computedKeys.length){
          return false
        }
        this.computedKeys.forEach(v => {
          const cList = row._editConfig[v].compute.split(/\([\\+|\-|\\*|\\/]\)/)
          if(cList.length>1){
            row[v] = getVal(cList,row,this.setRowChain,this.data,row._editConfig[v].compute).toFixed(this.precision)
          }
        })
      },
      createRult() {
        const rules = {}
        if(!Array.isArray(this.editable)){
          for(const k in this.editable){
            if(this.editable.hasOwnProperty(k)){
              this.editable[k].rules && this.editable[k].rules.length && (rules[k] = this.initRowRules(this.editable[k]))
            }
          }
        }
        return rules
      },
      initRowRules(obj){
        const tempArr = []
        obj.rules.forEach((item,index) => {
          index === 0 && tempArr.push({ required: true, message: '请输入内容', trigger: 'blur' })
          item.required === false && (tempArr[0].required = item.required)
          item.type && tempArr.push({pattern:new RegExp(regexp[item.type].replace(/placeholder/g,'0,'),'g'),message: obj.message[index]||'', trigger: 'blur'})
          if(item.min || item.max){
            tempArr.push({ min: item.min||0,max:item.max||'', message: obj.message[index]||'', trigger: 'blur' })
          }
        })
        return tempArr
      },
      createItemRules(colConfig,prop,row){
        let validator = null,tempArr
        this.baseRules[prop]?tempArr = [].concat(this.baseRules[prop]):tempArr = []
        if(this.editable[prop] && this.editable[prop].rules && this.editable[prop].rules.length){
          const greater = this.editable[prop].rules.find(v => {
            return v.greaterThan
          })
          const less = this.editable[prop].rules.find(v => {
            return v.lessThan
          })
          const type = this.editable[prop].rules.find(v => {
            return v.type
          })
          if(greater || less){
            validator = createRules(greater,less,type,prop,row,this.setRowChain,this.editable[prop].message,this.editable[prop].rules,this.setTableData)
          }
          if(validator){
            validator.forEach(v => {
              tempArr.push(v)
            })
          }
        }
        return tempArr
      },
      setShowHeader() {
        if(this.layer){
          return this.setTableData.length !== 0
        }else {
          return true
        }
      },
      selectable(row, index) {
        return  row.rowState === '1'
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
    }
  }
</script>

<style lang="scss" rel="text/css">
  .el-table__expanded-cell[class*=cell] {
    padding: 0 10px 10px 10px;
  }
  .childrens {
    .el-form-item {
      margin-bottom: 0;
    }
    .el-date-editor.el-input {
      width: 95% !important;
      /*min-width: 150px !important;*/
    }
    .el-date-editor--date {
      min-width: 150px !important;
    }
    .el-date-editor--time {
      min-width: 110px !important;
    }
    .el-date-editor--datetime {
      min-width: 190px !important;
    }
    .el-input--suffix .el-input__inner {
      padding-right: 0;
    }
  }
  .treeFormTableIcon {
    >svg {
      width: 2em !important;
      height: 2em !important;
      margin-top: 12%;
    }
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
