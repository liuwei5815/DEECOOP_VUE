
import ContentPostfix from '@/components/customTable/core/contentPostfix'
//mixin
import directives from '@/components/customTable/mixins/directives'

export default {
  name: 'content-txt',
  inject:['rootVm'],
  mixins: [directives],
  components: {
    ContentPostfix
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
    colConfig: {
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
    return {}
  },
  methods: {
    setDirectives(isTitle,others=[]){
      const directives = [{
        name: 'reset-content-width',
        value: {
          index:this.infoIndex,
          cIndex:this.cIndex,
          colConfig: this.colConfig,
          childColconfig: this.childColconfig,
          rowIndex: this.scope.$index,
          isTitle: isTitle,
          that: this.rootVm
        }
      }]
      this.runTime==='base'
        ?directives.push({
          name: 'merga-width',
          value: {
            parentLayer:this.infoIndex,
            selfLayer:this.cIndex,
            id:`_${isTitle?'0':'1'}${this.childColconfig.prop}`,
            that: this.rootVm
          }
        })
        :null
      return directives.concat(others)
    }
  },
  render(h){
    return (
      <div
        style={{'text-align': (this.childColconfig._cellConfig&&this.childColconfig._cellConfig.hideTitle)?'center':'left',position: 'relative'}}
        onClick={($event)=>this.rootVm.clickStop($event)}
        onDoubleClick={($event)=>this.rootVm.clickStop($event)}
        key={(this.scope.row._internalId || this.infoIndex) + this.cIndex}>
        {
          this.childColconfig._cellConfig
            ?(!this.childColconfig._cellConfig.hideTitle
            ?h('span',{
              style: [this.childColconfig._cellConfig.titleStyle || (this.rootVm.setColumnGlobalStyle?this.rootVm.setColumnGlobalStyle.titleStyle:{}),this.rootVm.setMiddleValue[this.infoIndex]?this.rootVm.setMiddleValue[this.infoIndex].title:{}],
              directives: this.setDirectives(true),
              domProps: {
                innerHTML: `${this.childColconfig.label}: `,
              }
            })
            :null)
            :h('span',{
              style: this.rootVm.setMiddleValue[this.infoIndex]?this.rootVm.setMiddleValue[this.infoIndex].title:{},
              directives: this.setDirectives(true),
              domProps: {
                innerHTML: `${this.childColconfig.label}: `,
              }
            })
        }
        {
          this.childColconfig._cellConfig && this.childColconfig._cellConfig.events
            ?h('span',{
              style: [this.childColconfig._cellConfig.bodyStyle || (this.rootVm.setColumnGlobalStyle?this.rootVm.setColumnGlobalStyle.bodyStyle:{}),this.rootVm.setMiddleValue[this.infoIndex]?this.rootVm.setMiddleValue[this.infoIndex].body:{}],
              directives: this.setDirectives(false),
            },[h('a',{
              on:{
                click: _=>{this.rootVm.mergeColumnEvents(this.childColconfig,this.scope)}
              },
              domProps: {
                innerHTML: this.scope.row[this.childColconfig.prop],
              }
            })])
            :h('span',{
              'class': {resetContent:this.rootVm.setMiddleValue[this.infoIndex],ellipsis:this.rootVm.setMiddleValue[this.infoIndex]?this.rootVm.isEllipsis(this.scope.row[this.childColconfig.prop || this.childColconfig.columnIndex],parseInt(this.rootVm.setMiddleValue[this.infoIndex].body.width)):false},
              style: [this.childColconfig._cellConfig?this.childColconfig._cellConfig.bodyStyle:{}, this.rootVm.setColumnGlobalStyle?this.rootVm.setColumnGlobalStyle.bodyStyle:{},this.rootVm.setMiddleValue[this.infoIndex]?this.rootVm.setMiddleValue[this.infoIndex].body:{}],
              directives: this.setDirectives(false,[{
                name: 'content-set',
                value: {
                  config: this.childColconfig,
                  row: this.scope.row,
                  that: this.rootVm
                },
              }]),
              domProps: {
                innerHTML: this.scope.row[this.childColconfig.prop || this.childColconfig.columnIndex],
              }
            })
        }
        {
          this.childColconfig && this.childColconfig.postfix
            ? h('span', {
              style: {
                position: 'absolute'
              }
            }, [h('content-postfix', {
              props: {
                scope: this.scope,
                'col-config': this.childColconfig,
              }
            })
            ])
            : null
        }
      </div>
    )
  }
}
