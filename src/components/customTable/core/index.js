

import contentTxt from '@/components/customTable/core/contentTxt'
import contentComponent from '@/components/customTable/core/contentComponent'
import contentPostfix from '@/components/customTable/core/contentPostfix'


export default {
  name: 'core-index',
  components: {
    contentTxt,
    contentComponent,
    contentPostfix,
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

    infoIndex: Number,
    colConfig: {
      type: Object,
      default(){
        return {}
      }
    },

  },
  data(){
    return {}
  },
  render(h){
    let els
    if(this.colConfig.mergeTitles && this.colConfig.mergeTitles.length){
      els = this.colConfig.mergeTitles.map((v,cIndex)=>{
        if(v.componentName){
          return (
            <content-component scope={this.scope} childColconfig={v} infoIndex={this.infoIndex} cIndex={cIndex} runTime={this.runTime}/>
          )
        }else {
          return (
            <content-txt scope={this.scope} childColconfig={v} infoIndex={this.infoIndex} cIndex={cIndex} colConfig={this.colConfig} runTime={this.runTime}/>
          )
        }
      })
    }else {
      els = [h('div',{
          style: {
            display: 'inline-block'
          },
          domProps: {
            innerHTML: this.scope.row[this.colConfig.prop]
          }
        }), (<content-postfix scope={this.scope} colConfig={this.colConfig}/>)
      ]
    }
    return h('div',{
      style: {
        'white-space': 'nowrap',
        overflow: 'hidden',
        'text-overflow': 'ellipsis',
      },
    },els)
  }
}
