<template>
    <div class="searchBar" v-if="searchList.length" :style="{padding: inMain?0:'0 10px'}">
      <el-row style="box-sizing: border-box;position: relative;overflow: hidden;transition: height 0.4s;-webkit-transition: height 0.4s;-moz-transition: height 0.4s;"
              :style="{height: dynaHeight+'px'}">
        <div style="position: absolute;top: 0;left: 0;right: 0;" :style="{height: searchBoxHeight+'px'}">
          <div style="float: left;height: 100%" :style="{width: searchBtnWidth+'px'}">
            <el-form
              inline
              :class="{inDialog:!inMain,dynaFrom:size!=='mini'}"
              :model="searchMap"
              ref="searchFrom"
              :rules="fromRules"
              label-position="left"
              :label-width="searchLabelWidth?(searchLabelWidth+'px'):'auto'"
              :size="size"
              :style="{padding: (size==='mini' && searchList.length<7)?'10px 0':''}">
              <template v-for="(item,index) in searchList">
                <template v-if="item.type=== 'input'">
                  <el-form-item
                    :key="index"
                    :label="item.label?item.label:'未定义'"
                    :style="{'min-width': setFormItemWidth,'max-width': setFormItemWidth}"
                    :prop="item.mapKey">
                    <el-input
                      v-model="searchMap[item.mapKey]"
                      :type="item.configs.type"
                      :placeholder="item.placeholder"
                      :disabled="item.configs.disabled"
                      :clearable="item.configs.clearable === false?item.configs.clearable:true"></el-input>
                  </el-form-item>
                </template>
                <template v-else-if="item.type=== 'select'">
                  <el-form-item
                    :key="index"
                    :label="item.label?item.label:'未定义'"
                    :style="{'min-width': setFormItemWidth,'max-width': setFormItemWidth}"
                    :prop="item.mapKey">
                    <el-select
                      v-model="searchMap[item.mapKey]"
                      :name="item.configs.name"
                      :disabled="item.configs.disabled"
                      :clearable="item.configs.clearable === false?item.configs.clearable:true" :multiple="item.configs.multiple"
                      :filterable="item.configs.filterable" :default-first-option="item.configs['default-first-option']"
                      :placeholder="item.placeholder">
                      <el-option
                        v-for="childItem in item.configs.options"
                        :key="childItem.value"
                        :label="childItem.label"
                        :value="childItem.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </template>
                <template v-else-if="item.type=== 'date'">
                  <el-form-item
                    :key="index"
                    :label="item.label?item.label:'未定义'"
                    :prop="item.mapKey"
                    :style="{'max-width':item.configs.type==='daterange'?'320px':setFormItemWidth,'min-width':item.configs.type==='daterange'?'320px':setFormItemWidth}">
                    <el-date-picker
                      v-model="searchMap[item.mapKey]"
                      :type="item.configs.type?item.configs.type:'date'"
                      :range-separator="item.configs.type==='daterange'?'至':''"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      unlink-panels
                      :editable="item.configs.editable?item.configs.editable:false"
                      :format="dateFormat(item)"
                      :value-format="item.configs.type==='week'?'':dateFormat(item)"
                      placeholder="选择日期"
                      :picker-options="datePickerOptions(item.configs.pickerOptions)">
                    </el-date-picker>
                  </el-form-item>
                </template>
                <template v-else-if="item.type=== 'time'">
                  <el-form-item
                    :key="index"
                    :label="item.label?item.label:'未定义'"
                    :style="{'min-width': setFormItemWidth,'max-width': setFormItemWidth}"
                    :prop="item.mapKey">
                    <el-time-select
                      v-if="item.configs.pickerOptions.start&&item.configs.pickerOptions.end&&item.configs.pickerOptions.step"
                      v-model="searchMap[item.mapKey]"
                      :editable="item.configs.editable?item.configs.editable:false"
                      value-format="HH:mm:ss"
                      :picker-options="item.configs.pickerOptions"
                      :placeholder="item.placeholder">
                    </el-time-select>

                    <el-time-picker
                      v-else
                      v-model="searchMap[item.mapKey]"
                      :editable="item.configs.editable?item.configs.editable:false"
                      value-format="HH:mm:ss"
                      :picker-options="item.configs.pickerOptions"
                      :placeholder="item.placeholder">
                    </el-time-picker>

                  </el-form-item>
                </template>
                <template v-else-if="item.type=== 'dateTime'">
                </template>
                <template v-else-if="item.type=== 'cascader'">
                  <el-form-item
                    :key="index"
                    :label="item.label?item.label:'未定义'"
                    :style="{'min-width': setFormItemWidth,'max-width': setFormItemWidth}"
                    :prop="item.mapKey">
                    <el-cascader
                      :filterable="item.configs.filterable !== undefined?item.configs.filterable:true"
                      :clearable="item.configs.clearable !== undefined?item.configs.clearable:true"
                      :props="item.configs.props?item.configs.props:{}"
                      :expand-trigger="item.configs.expand?item.configs.expand:'hover'"
                      :show-all-levels="item.configs.showLevels?item.configs.showLevels:false"
                      :change-on-select="item.configs.onChange?item.configs.onChange:false"
                      :options="(item.configs.apiName&&item.configs.params)?cascaderOps(item.configs,index):(item.configs.options&&item.configs.options.length?item.configs.options:[])"
                      v-model="searchMap[item.mapKey]"
                      @change="cascaderChange">
                    </el-cascader>
                  </el-form-item>
                </template>
                <template v-else-if="item.type=== 'magnifier'">
                  <el-form-item
                    :key="index"
                    class="magnifier"
                    :style="{'min-width': setFormItemWidth,'max-width': setFormItemWidth}"
                    :label="item.label?item.label:'未定义'"
                    :prop="item.mapKey">
                    <el-input v-model="searchMap[item.mapKey]" :placeholder="item.placeholder" disabled>
                      <el-button slot="append" icon="el-icon-search" @click="changeComponent(item,index)"></el-button>
                    </el-input>
                    <component v-if="magnifierDialog(item,index)" :is="dialogProp(item,index)" :initData="dialogData(item,index)" :visible="visible(item,index)" @close-dialog="closeDialog"></component>
                  </el-form-item>
                </template>
              </template>
            </el-form>
          </div>
          <div style="float: right;height: 100%" :class="[searchBtnClass]">
            <div style="height: 100%">
              <template v-if="!inMain">
                <base-button v-show="searchBtnList[0].isShow"
                             :name='searchBtnList[0].name'
                             :icon='searchBtnList[0].icon'
                             :plain="searchBtnList[0].plain"
                             :state="searchBtnList[0].state"
                             :size="searchBtnList[0].size || size"
                             @myclick="searchBtnList[0].method"></base-button>
              </template>
              <template v-else v-for="(item,index) in searchBtnList">
                <base-button v-show="item.isShow"
                             :key="index"
                             :name='item.name'
                             :icon='item.icon'
                             :plain="item.plain"
                             :size="item.size || size"
                             :state="item.state"
                             @myclick="item.method"></base-button>
              </template>
            </div>
          </div>
        </div>
      </el-row>

      <el-row v-if="searchConfig.hideSearchSwitch?!searchConfig.hideSearchSwitch:inMain" style="position: relative;height: 20px;">
        <div
          style="position: absolute;bottom: 10px;left: 0;right: 0;height: 1px;background-color: rgb(228,228,228);z-index: 10;">
          <div style="position: relative;">
            <el-tooltip effect="dark" :content="arrowState-0?'收起搜索':'展开搜索'" placement="bottom"
                        :hide-after="hideTime">
              <el-button v-if="arrowState-0" icon="el-icon-arrow-up" circle
                         style="position: absolute;left: 50%;top: -10.5px;transform: translate(-50%,0); width: 1.5em;height: 1.5em;padding: 0;"
                         @click="resetDynaHeight"></el-button>
              <el-button v-else icon="el-icon-arrow-down" circle
                         style="position: absolute;left: 50%;top: -10.5px;transform: translate(-50%,0); width: 1.5em;height: 1.5em;padding: 0;"
                         @click="resetDynaHeight"></el-button>
            </el-tooltip>
          </div>
        </div>
      </el-row>
    </div>
</template>

<script>
  import {dateToTimestamp} from '@/utils/common'
  import {GUID, dynaSearchHeight, unCreateStore, dynaSelectData} from '@/store/dynaStore'
  import rules from '@/utils/searchRules'
  import DOM from '@/utils/domTools'



  export default {
    components: {
      'searchTree': ()=> import('./tree'),
      'searchTable': ()=> import('./table'),
      'treeAndTable': () => import('./treeAndTable')
    },
    name: "search-bar",
    props: {
      searchList: {
        type: Array,
        default: function () {
          return []
        }
      },
      searchMethod: {
        type: Object,
        default: function () {
          return {}
        }
      },
      searchConfig: {
        type: Object,
        default: function () {
          return {}
        }
      },
      searchBtns: {
        type: Array,
        default: function () {
          return []
        }
      },
    },

    data(){
      return {
        hideTime: 500,
        clientHeight: 0,
        dynaHeightTimer: null,
        formData: {
          code: '',
          name: '',
          isdisable: ''
        },
        topBarBtnList: [{
          name: '查询',
          icon: 'search',
          state: false,
          method: this.queryData,
          isShow: true
        }, {
          name: '重置',
          icon: 'refresh',
          state: false,
          plain: true,
          method: this.resetQuery,
          isShow: true
        }],
        searchMap: {},
        searchLabelWidth: 0,
        upIndex: 0,
        closeSearchBoxUpdate: true,
        guid: '',
        createTime: 0,
        inMain: false,
        asynSearchList: ['cascader'],
        magnifierData: {},
        searchStyleTimer: '',
        clientDataTimer: '',
        arrowState: null,

      }
    },
    created() {
      const that = this
      that.createStore()
      that.guid = GUID()
      that.$emit('send-guid',that.guid)
      dynaSearchHeight(that)
      that.createTime = new Date().getTime()
    },
    mounted() {
      const that = this
      if(/^[el\-]/.test(this.$el.parentNode.parentNode.className)){
        this.inMain = false
      }else {
        this.inMain = true
      }
      //console.log(this.inMain,'this.inMain',this.$el,this.$el.parentNode.className,document.querySelector('.app-main').clientHeight,this.$root.$el.clientHeight,document.querySelector('.main-container ').clientHeight)
      if(this.inMain){
        this.$store.commit(this.guid+'/SET_CLIENTDATA',{
          clientHeight: this.$el.parentNode.clientHeight,
          clientWidth: this.$el.parentNode.clientWidth,
          rootWidth: this.$root.$el.clientWidth,
          rootHeight: this.$root.$el.clientHeight,
        })
      }
      if(this.inMain && !this.searchConfig.hideSearchSwitch){
        this.$store.commit(this.guid+'/SET_DYNAHEIGHTSTATE',this.$storage.get('dynaHeightState') || '0')
        this.arrowState = this.$storage.get('dynaHeightState') || '0'
      }else {
        this.$store.commit(this.guid+'/SET_ARROWBTN',20)
      }
      this.$nextTick(_=>{
        this.setSearchLabelWidth()
        DOM.on(window,'resize',this.resizeFn)
        setTimeout(_=>{
          //console.log('/SET_SEARCHHEIGHT')
          this.$store.commit(this.guid+'/SET_SEARCHHEIGHT',this.$refs.searchFrom.$el.clientHeight)
        },10)
      })
    },
    updated () {
      // if(this.searchList.length && this.closeSearchBoxUpdate && ((new Date().getTime() - this.createTime)<2000)){
      //   clearTimeout(this.searchStyleTimer)
      //   this.searchStyleTimer = setTimeout(_=>{
      //     // this.setSearchBoxHeight()
      //     this.$nextTick(_=>{
      //       this.setSearchLabelWidth()
      //     })
      //   },16.666)
      // }
    },
    beforeDestroy() {
      unCreateStore(this.$store,this.guid)
      DOM.off(window,'resize',this.resizeFn)
    },

    methods: {
      resizeFn(){
        const that = this
        clearTimeout(that.clientDataTimer)
        that.clientDataTimer = setTimeout(_=>{
          that.$nextTick(_=>{
            that.$store.commit(that.guid+'/SET_CLIENTDATA',{
              clientHeight: that.$el.parentNode.clientHeight,
              clientWidth: that.$el.parentNode.clientWidth,
              rootWidth: that.$root.$el.clientWidth,
              rootHeight: that.$root.$el.clientHeight,
            })
            setTimeout(_=>{
              that.$store.commit(that.guid+'/SET_SEARCHHEIGHT',that.$refs.searchFrom.$el.clientHeight)
            },10)
          })
        },300)
      },
      changeComponent(item,index) {
        this.magnifierData[item.mapKey+'Dialog'+index] = true
        this.magnifierData[item.mapKey+'Visible'+index] = true
      },
      closeDialog(data,item){
        if(data){
          this.magnifierData[item.mapKey+'Visible'+item.keyIndex] = false
          this.magnifierData[item.mapKey+'Dialog'+item.keyIndex] = false
          if(item.dialogType === 'table' || item.dialogType === 'treeAndTable'){
            this.searchMap[item.mapKey] = data.length?data[0].name:''
          }else {
            this.searchMap[item.mapKey] = data.nodeData?data.nodeData.name:''
          }
        }else {
          this.magnifierData[item.mapKey+'Visible'+item.keyIndex] = false
          this.magnifierData[item.mapKey+'Dialog'+item.keyIndex] = false
          this.searchMap[item.mapKey] = ''
        }
      },



      createStore(){
        this.searchList.forEach((item,index) => {
          this.asynSearchList.indexOf(item.type)>-1?dynaSelectData(this,item.configs):''
        })
      },

      // setSearchBoxHeight(){
      //   const that = this
      //   that.searchBoxHeight = that.$refs.searchFrom?that.$refs.searchFrom.$el.clientHeight:0
      // },
      setSearchLabelWidth() {
        const that = this
        let MaxWidth = 0
        let itemList = that.$refs.searchFrom?that.$refs.searchFrom.$el.querySelectorAll('.el-form-item'):[]
        itemList = [].slice.call(itemList)
        if(itemList.length){
          //const contentWidth = itemList[0].querySelector('.el-form-item__content').clientWidth || 0
          itemList.forEach(item => {
            const labelEl = item.querySelector('.el-form-item__label')
            if(MaxWidth<labelEl.clientWidth){
              MaxWidth = labelEl.clientWidth
            }
          })
          that.searchLabelWidth = MaxWidth
          // itemList.forEach(item => {
          //   item.style.minWidth = ((MaxWidth + contentWidth) + 1) + 'px'
          //   item.style.maxWidth = ((MaxWidth + contentWidth) + 1) + 'px'
          // })
        }
      },
      resetDynaHeight() {
        const that = this
        that.closeSearchBoxUpdate = false
        if (that.dynaHeightState - 0) {
          that.$storage.remove('dynaHeightState')
          that.$storage.set('dynaHeightState', '0')
          that.$store.commit(that.guid+'/SET_DYNAHEIGHTSTATE','0')
          clearTimeout(that.dynaHeightTimer)
          that.dynaHeightTimer = setTimeout(function () {
            that.arrowState = '0'
          }, that.hideTime)
        } else if (!(that.dynaHeightState - 0)) {
          that.$storage.remove('dynaHeightState')
          that.$storage.set('dynaHeightState', '1')
          that.$store.commit(that.guid+'/SET_DYNAHEIGHTSTATE','1')
          clearTimeout(that.dynaHeightTimer)
          that.dynaHeightTimer = setTimeout(function () {
            that.arrowState = '1'
          }, that.hideTime)
        }
      },
      queryData() {
        const that = this
        that.$refs['searchFrom'].validate((valid) => {
          if (valid) {
            if(that.searchMethod.api){
              const newObj = Object.assign({},that.searchMap,that.searchMethod.data)
              that.$axios.post(that.searchMethod.api,newObj).then(res => {
                that.$emit('search-res',res)
                that.$loading().close()
              })
            }else {
              that.$emit('search-map',that.searchMap)
            }
          }
        })
      },
      resetQuery(){
        const that = this
        for (let k in that.searchMap){
          const classStr = typeof that.searchMap[k]
          if(classStr === 'string' || classStr === 'number' || classStr === 'boolean'){
            that.searchMap[k] = ''
          }else if(classStr === 'object'){
            that.searchMap[k] = Array.isArray(that.searchMap[k])?[]:{}
          }else if(classStr === 'function'){
            that.searchMap[k] = _ => {}
          }else {
            that.searchMap[k] = ''
          }
        }
        that.$emit('search-map',that.searchMap)
      },
      cascaderChange() {

      },
    },
    computed: {
      sys(){
        return this.$store.getters.systemInfo
      },
      size(){
        return this.$store.getters.size
      },
      searchBoxHeight(){
        return this.$store.getters[this.guid+'/searchBoxHeight']
      },
      dynaHeight() {
        return this.$store.getters[this.guid+'/dynaHeight']
      },
      dynaHeightState() {
        return this.$store.getters[this.guid+'/dynaHeightState']
      },
      clientData() {
        return this.$store.getters[this.guid+'/clientData']
      },
      clientWidth() {
        let inDialog = 0
        // console.log(this.clientData,'this.clientData')
        if(!this.inMain){
          inDialog = 41
        }
        return this.clientData?(this.clientData.clientWidth - inDialog):'auto'
      },
      setFormContentWidth(){
        if(this.clientData.rootWidth<=1024){
          return 120
        }else if(this.clientData.rootWidth>1024 && this.clientData.rootWidth<=1280){
          return 120
        }else if(this.clientData.rootWidth>1280 && this.clientData.rootWidth<=1440){
          return 140
        }else {
          return 180
        }
      },
      setFormItemWidth(){
        return (this.setFormContentWidth + this.searchLabelWidth) + 'px'
      },
      searchBtnClass() {
        const that = this
        if(that.inMain){
          const rootWidth = that.clientData?that.clientData.rootWidth:1024
          if(rootWidth>1600){
            return that.searchList.length>6?'stand':'flat'
          }else if(1600>=rootWidth && rootWidth>1440){
            return that.searchList.length>5?'stand':'flat'
          }else if(1440>=rootWidth && rootWidth>1280){
            return that.searchList.length>4?'stand':'flat'
          }else if(1280>=rootWidth && rootWidth>1024){
            return that.searchList.length>3?'stand':'flat'
          }else if(1024>=rootWidth){
            return that.searchList.length>3?'stand':'flat'
          }
        }else {
          return 'stand'
        }
      },
      searchBtnWidth() {
        const that = this
        if(that.inMain){
          return that.searchBtnClass === 'stand'?(that.clientWidth-100):(that.clientWidth-200)
        }else {
          return that.clientWidth-100.5
        }
      },

      dateFormat() {
        return function (item) {
          const type = item.configs.type
          if(type === 'week'){
            return 'yyyy 第 WW 周'
          }else if(type === 'month'){
            return 'yyyy-MM'
          }else if(type === 'year'){
            return 'yyyy'
          }else{
            return 'yyyy-MM-dd'
          }
        }
      },
      datePickerOptions() {
        return function (ops) {
          if(ops && ops.disabledDate){
            if(Array.isArray(ops.disabledDate) && ops.disabledDate.length){
              const starDate = dateToTimestamp(ops.disabledDate[0])
              const endDate = dateToTimestamp(ops.disabledDate[1])
              return {
                disabledDate(time){
                  if(starDate && endDate){
                    return starDate > time.getTime() || endDate < time.getTime()
                  }else if(starDate && !endDate) {
                    return starDate > time.getTime()
                  }else if(endDate && !starDate) {
                    return endDate < time.getTime()
                  }
                },
                shortcuts: [{
                  text: '今天',
                  onClick(picker) {
                    picker.$emit('pick', new Date());
                  }
                }, {
                  text: '明天',
                  onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() + 3600 * 1000 * 24);
                    picker.$emit('pick', date);
                  }
                }]
              }
            }else {
              return
            }
          }else if(ops && ops.hidePicker){
            return
          }else {
            return {
              shortcuts: [{
                text: '今天',
                onClick(picker) {
                  picker.$emit('pick', new Date());
                }
              }, {
                text: '明天',
                onClick(picker) {
                  const date = new Date();
                  date.setTime(date.getTime() + 3600 * 1000 * 24);
                  picker.$emit('pick', date);
                }
              }]
            }
          }
        }
      },
      fromRules() {
        if(this.searchList.length){
          const tempRules = {}
          this.searchList.forEach(item => {
            if(item.ruleType && this.searchMap[item.mapKey]){
              if(rules[item.ruleType]){
                tempRules[item.mapKey] = rules[item.ruleType](item.ruleOps?item.ruleOps:null)
              }
            }
          })
          //console.log(tempRules)
          return tempRules
        }else {
          return {}
        }
      },
      searchBtnList() {
        if(this.searchBtns.length){
          if(this.searchBtns[0]){
            this.searchBtns[0].method = this.queryData
          }
          if(this.searchBtns[1]){
            this.searchBtns[1].method = this.resetQuery
          }
          return this.searchBtns
        }else {
          return this.topBarBtnList
        }
      },
      cascaderOps() {
        return (ops,index) => {
          return this.$store.getters[ops.apiName+'/dataList']
        }
      },
      // magnifierVal(){
      //   return (item,index) => {
      //     if(this.magnifierData[item.mapKey+index] === undefined){
      //       this.$set(this.magnifierData, item.mapKey+index, '')
      //     }
      //     return this.magnifierData[item.mapKey+index]
      //   }
      // },
      magnifierDialog() {
        return (item,index) => {
          if(this.magnifierData[item.mapKey+'Dialog'+index] === undefined){
            this.$set(this.magnifierData, item.mapKey+'Dialog'+index, false)
          }
          return this.magnifierData[item.mapKey+'Dialog'+index]
        }
      },
      dialogProp() {
        return (item,index) => {
          if(item.configs.dialogType.indexOf('And')>-1){
            return item.configs.dialogType
          }else {
            return 'search' + item.configs.dialogType.replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
          }
        }
      },
      dialogData() {
        return (item,index) => {
          item.configs.mapKey = item.mapKey
          item.configs.keyIndex = index
          return item.configs
        }
      },
      visible() {
        return (item,index) => {
          if(this.magnifierData[item.mapKey+'Visible'+index] === undefined){
            this.$set(this.magnifierData, item.mapKey+'Visible'+index, false)
          }
          return this.magnifierData[item.mapKey+'Visible'+index]
        }
      }
    },
    watch: {
      // searchBoxHeight: {
      //   immediate: true,
      //   handler(){
      //     const that = this
      //     if(that.inMain && !that.searchConfig.hideSearchSwitch){
      //       if(that.dynaHeightState - 0){
      //         that.$store.commit(that.guid+'/SET_DYNAHEIGHT',that.searchBoxHeight)
      //       }else {
      //         that.$store.commit(that.guid+'/SET_DYNAHEIGHT',0)
      //       }
      //     }else {
      //       that.$store.commit(that.guid+'/SET_DYNAHEIGHT',that.searchBoxHeight)
      //     }
      //   }
      // },
      searchMap: {
        handler(newValue, oldValue) {
          let state = false
          let tempArr = []
          for(let k in newValue){
            if(this.fromRules[k] && !newValue[k]){
              tempArr.push(k)
            }
            if(newValue[k]){
              state = true
            }
          }
          this.$refs['searchFrom'].clearValidate(tempArr)
          if(!this.inMain && !state){
            this.$emit('search-map',null)
          }
        },
        deep: true
      },
    }
  }
</script>

<style lang="scss" rel="text/css">
  .searchBar {
    .noMargin {
      margin-left: 0;
      margin-right: 0;
    }
    .flat {
      width: 200px;
      /*text-align: center;*/
      >div {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        flex-wrap: wrap;
        align-content: center;
      }
    }
    .stand {
      width: 100px;
      /*display: flex;*/
      /*align-items: center;*/
      >div {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        align-content: center;
      }
      .myButtons {
        margin: 5px 0;

      }
    }
    .inDialog {
     padding: 8px 0 0 20px;
    }

    .dynaFrom {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        flex: 1;
        margin-bottom: 10px;
        margin-right: 20px !important;
      }
    }
    .el-form-item {
      margin-bottom: 6px;
    }

    .el-form-item__label {
      padding: 0 2px 0 0;
    }
    .el-date-editor.el-input {
      width: 100%;
      font-size: 12px;
      >.el-input__inner {
        padding-right: 0;
      }
    }
    .el-date-editor--daterange.el-input__inner {
      width: 220px;
      input {
        font-size: 12px;
      }
    }
    .el-date-editor .el-range-separator {
      width: 10%;
    }
    .el-form-item__label:before {
      display: none;
      content: '';
    }
    .magnifier {
      .el-input {
        input {
          padding-right: 0 !important;
        }
      }
    }

    @media only screen and (max-width: 1024px) {
      .el-form-item {
        >.el-form-item__content {
          width: 120px;
        }
      }
    }
    @media only screen and (min-width: 1025px) and (max-width: 1280px) {
      .el-form-item {
        >.el-form-item__content {
          width: 120px;
        }
      }
    }
    @media only screen and (min-width: 1281px) and (max-width: 1440px) {
      .el-form-item {
        >.el-form-item__content {
          width: 140px;
        }
      }
    }
    @media only screen and (min-width: 1441px) and (max-width: 1920px) {
      .el-form-item {
        >.el-form-item__content {
          width: 180px;
        }
      }
    }
  }


</style>
