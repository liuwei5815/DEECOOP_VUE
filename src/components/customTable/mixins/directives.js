import {searchVal} from '@/utils/baseRules'
import {evil} from '@/utils/common'
export default {
  directives: {
    'button-width': {
      inserted(el, binding, vnode) {
        const that = binding.value.that || vnode.context
        const num = binding.value.component ? binding.value.component.length : 0
        if (num > 1 && el.clientHeight > 60) {
          that.$set(that.columnWidth, binding.value.prop, Math.ceil(num / 2) * 60 + 25 + 'px')
        }
      }
    },
    'auto-tran': {
      inserted(el, binding, vnode) {
        const that = binding.value.that || vnode.context
        clearTimeout(that.headerWidthTimerList[binding.value.index])
        that.headerWidthTimerList[binding.value.index] = setTimeout(_ => {
          const _width = binding.value.isComponent
            ? parseInt(that.columnWidth[binding.value.prop])
            : el.clientWidth + 20
          that.headerWidthList.splice(binding.value.index, 1, Object.assign(binding.value, {_width}))
        }, 20)
      }
    },
    'content-set': {
      inserted(el, binding, vnode) {
        const contentSet = binding.value.config._cellConfig
          ?binding.value.config._cellConfig.contentSet || ''
          :''
        if(contentSet){
          const state = contentSet.state || {}, that = binding.value.that || vnode.context, style = contentSet.style || {}
          for(const k in state){
            if(state.hasOwnProperty(k)){
              for(const i in style){
                if(style.hasOwnProperty(i)){
                  el.style[i] = evil(style[i].replace(k,searchVal([state[k]],binding.value.row,that.setRowChain,that.tableData[that.dataName],false,that.setTempData)[0]))
                }
              }
            }
          }
        }
      },
    },
    'reset-content-width':{
      inserted(el, binding, vnode) {
        //console.log(binding.value)
        const that = binding.value.that || vnode.context,val = binding.value;
        if(!that.resetContentWidthList[val.index]){
          that.$set(that.resetContentWidthList,val.index,[])
          that.$set(that.contentWidthList,val.index,null)
          that.$set(that.useMiddleValueList,val.index,false)
          that.$set(that.contentTitleWidthList,val.index,0)
        }
        !that.resetContentWidthList[val.index][val.rowIndex] && that.$set(that.resetContentWidthList[val.index],val.rowIndex,[])
        !that.resetContentWidthList[val.index][val.rowIndex][val.cIndex] && that.$set(that.resetContentWidthList[val.index][val.rowIndex],val.cIndex,0)
        that.resetContentWidthList[val.index][val.rowIndex][val.cIndex] += el.offsetWidth
        if(val.isTitle){
          el.offsetWidth>that.contentTitleWidthList[val.index]
            ?(that.contentTitleWidthList[val.index] = el.offsetWidth)
            :''
        }
      }
    },
    'custom-table-switch': {
      inserted(el, binding, vnode) {
        if(binding.value.showSwitch){
          const that = binding.value.that || vnode.context, targetEl = el.parentNode.parentNode
          that.createTableSwitch(targetEl,binding.value)
        }
      },
    },
    'merga-width': {
      bind(el, binding, vnode) {
        const that = binding.value.that || vnode.context
        !that.autoWidthTimer[binding.value.id] && (that.autoWidthTimer[binding.value.id] = -1)
      },
      inserted(el, binding, vnode) {
        const that = binding.value.that || vnode.context
        !that.autoWidthList.length && (that.autoWidthList = that.setTitleList.map(v => { return [] }))
        that.$nextTick(_ => {
          if (that.autoWidthTimer[binding.value.id] === -1) {
            that.autoWidthTimer[binding.value.id] = setTimeout(_ => {
              const width = el.offsetWidth
              //console.log(width,el.innerText,el.offsetWidth)
              const value = binding.value
              const autoWidthList = that.autoWidthList
              if (autoWidthList[value.parentLayer].length) {
                if (autoWidthList[value.parentLayer][value.selfLayer] > -1) {
                  const oldWidth = autoWidthList[value.parentLayer][value.selfLayer]
                  autoWidthList[value.parentLayer].splice(value.selfLayer, 1, width + oldWidth)
                } else {
                  autoWidthList[value.parentLayer][value.selfLayer] = width
                }
              } else {
                const tempArr = []
                tempArr[value.selfLayer] = width
                autoWidthList.splice(value.parentLayer, 1, tempArr)
              }
              //console.log(autoWidthList,autoWidthList.length)
            }, 20)
          }
        })
      }
    }
  },
}
