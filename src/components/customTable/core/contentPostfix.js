import {computeState,rowDataCompute} from '../utils'
import {searchVal} from '@/utils/baseRules'
export default {
  name: 'content-postfix',
  inject:['rootVm'],
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
  created(){

  },
  render(h){
    // console.log(this.colConfig.columnIndex,'contentPostfix')
    const psotfixConfig = this.colConfig.postfix
    let el;
    if(psotfixConfig){
      const configIndex = computeState(psotfixConfig.expression,this.scope.row,this.rootVm)?0:1
      if(psotfixConfig.type === 'icon' && psotfixConfig.contentConfigs[configIndex]){
        el = (<svg-icon icon-class={psotfixConfig.contentConfigs[configIndex].content} style={psotfixConfig.contentConfigs[configIndex].style}></svg-icon>)
      }else if(psotfixConfig.type === 'text' && psotfixConfig.contentConfigs[configIndex]){
        el = h('span',{
          style: psotfixConfig.contentConfigs[configIndex].style,
          domProps: {
            innerHTML: psotfixConfig.contentConfigs[configIndex].content
          }
        })
      }else if(psotfixConfig.type === 'rowData' && psotfixConfig.contentConfigs[configIndex]){
        el = h('span',{
          style: psotfixConfig.contentConfigs[configIndex].style,
          domProps: {
            innerHTML: rowDataCompute(psotfixConfig.contentConfigs[configIndex].content,this.scope.row,this.rootVm)
          }
        })
      }else {
        el = null
      }
      return el
    }else {
      return null
    }
  }
}
