
//components
import TableInput from '@/components/customTable/core/input'
import TableAutocomplete from '@/components/customTable/core/autocomplete'
import TableDate from '@/components/customTable/core/datePicker'
import TableTime from '@/components/customTable/core/timePicker'
import TableSelect from '@/components/customTable/core/select'
import TableCascader from '@/components/customTable/core/cascader'
import TableSwitch from '@/components/customTable/core/switch'
import TableDateTime from '@/components/customTable/core/dateTime'
import TableInputNumber from '@/components/customTable/core/inputNumber'
import TableProgress from '@/components/customTable/core/progress'
import TableUpload from '@/components/customTable/core/upload'
import TableTag from '@/components/customTable/core/tag'
import TableButton from '@/components/customTable/core/button'
import TableSteps from '@/components/customTable/core/customSteps'
import TableDynaContent from '@/components/customTable/core/dynaContent'
import ContentPostfix from '@/components/customTable/core/contentPostfix'

//mixin
import directives from '@/components/customTable/mixins/directives'

export default {
  name: 'content-component',
  inject:['rootVm'],
  mixins: [directives],
  components: {
    TableInput,
    TableAutocomplete,
    TableDate,
    TableTime,
    TableSelect,
    TableCascader,
    TableSwitch,
    TableDateTime,
    TableInputNumber,
    TableSteps,
    TableProgress,
    TableUpload,
    TableTag,
    TableButton,
    TableDynaContent,
    ContentPostfix,
  },
  props:{
    runTime: {
      type: String,
      default: 'base'
    },
    scope: {
      type: Object,
      default(){
        return {}
      }
    },
    childColconfig: {
      type: Object,
      default(){
        return {}
      }
    },
    cIndex: Number,
    infoIndex: Number,

  },
  data(){
    return {
      needRules:['input','date','time','select','cascader','dateTime','inputNumber'],
      componentNames: ['input','date','time','select','cascader','switch','dateTime','inputNumber','steps','progress','upload','tag','dynaContent','button'],
      noHideTitle: ['upload','tag'],
    }
  },
  render(h){
    let rootEl,componentEl,mergaWidthState;
    // console.log(this.$createElement)
    if(!this.componentNames.includes(this.childColconfig.componentName)){
      return (<span style={{marginLeft: '10px'}} key={(this.scope.row._internalId || this.infoIndex) + this.cIndex}>{this.scope.row[this.childColconfig.prop]}</span>)
    }
    mergaWidthState = (this.childColconfig.componentName==='steps'||this.childColconfig.componentName==='progress')?true:false
    componentEl = this.$createElement(
      `table-${(this.childColconfig.componentName==='input'&&this.childColconfig._cellConfig.asyn)?'autocomplete':this.childColconfig.componentName}`,
      {
        props: {
          scope: this.scope,
          childColconfig: this.childColconfig
        }
      }
    )
    if(this.needRules.includes(this.childColconfig.componentName)){
      rootEl = (
        <ElFormItem
          style={{marginBottom:0,position: 'relative'}}
          prop={`tableData.${this.scope.$index}.${this.childColconfig.prop}`}
          rules={this.rootVm.baseRules(this.scope.$index,this.scope.row,this.childColconfig)}
          inline-message={true}
          key={(this.scope.row._internalId || this.infoIndex) + this.cIndex}>
          <div
            style={{display: 'inline-block'}}
            onClick={($event)=>this.rootVm.clickStop($event)}
            onDoubleClick={($event)=>this.rootVm.clickStop($event)}>
            {componentEl || null}
          </div>
          {
            this.childColconfig && this.childColconfig.postfix
              ?h('div',{
                style: {display: 'inline-block'},
              },[<content-postfix scope={this.scope} colConfig={this.childColconfig}/>])
              :null
          }
        </ElFormItem>
      )
    }else {
      rootEl = (
        <div
          class={`customTableRowResetClass ${this.childColconfig.componentName==='steps'?'resetElStepStyle':''}`}
          style={{
            'text-align': this.childColconfig._cellConfig.hideTitle?'cneter':(this.noHideTitle.includes(this.childColconfig.componentName)?'cneter':'left'),
            position: 'relative'
          }}
          key={(this.scope.row._internalId || this.infoIndex) + this.cIndex}
          onClick={($event)=>this.rootVm.clickStop($event)}
          onDoubleClick={($event)=>this.rootVm.clickStop($event)}>
          {
            (!this.childColconfig._cellConfig.hideTitle && !this.noHideTitle.includes(this.childColconfig.componentName))
              ?this.$createElement('div',
              {
                style: this.childColconfig.componentName === 'progress'
                  ?[{display: 'inline-block','line-height': this.childColconfig._cellConfig.componentConfig['stroke-width']>23?2:''},this.childColconfig._cellConfig.titleStyle||(this.rootVm.setColumnGlobalStyle?this.rootVm.setColumnGlobalStyle.titleStyle:{})||{}]
                  :[(this.childColconfig._cellConfig.titleStyle || {}),{display: 'inline-block'}],
                directives: (mergaWidthState&&this.runTime==='base')
                  ?[{
                    name: 'merga-width',
                    value: {
                      parentLayer:this.infoIndex,
                      selfLayer:this.cIndex,
                      id:'_0'+this.childColconfig.prop,
                      that: this.rootVm
                    }
                  }]
                  :[],
                domProps: {
                  innerHTML: `${this.childColconfig.label}: ${this.childColconfig.componentName === 'progress'?(this.childColconfig._cellConfig.componentConfig.showInitValue?this.scope.row[this.childColconfig.prop]:''):''}`
                },
              })
              :null
          }
          {
            this.$createElement('div',
              {
                style: this.childColconfig.componentName === 'progress'
                  ?[{display: 'inline-block',overflow: 'hidden','vertical-align': 'middle'},{width: (this.childColconfig._cellConfig.componentConfig.width || this.rootVm.constantWidth[this.childColconfig.componentName]) + 'px'}]
                  :{display: 'inline-block'},
                directives: (mergaWidthState&&this.runTime==='base')
                  ?[{
                    name: 'merga-width',
                    value: {
                      parentLayer:this.infoIndex,
                      selfLayer:this.cIndex,
                      id:'_1'+this.childColconfig.prop,
                      that: this.rootVm
                    }
                  }]
                  :[],
              },[componentEl])
          }
          {
            this.childColconfig && this.childColconfig.postfix
              ?h('div', {
                style: {
                  display: 'inline-block',
                  position: 'relative',
                },
              }, [h('content-postfix', {
                props: {
                  scope: this.scope,
                  'col-config': this.childColconfig,
                }
              })])
              : null
          }
        </div>
      )
    }
    return rootEl?rootEl:null
  }
}
