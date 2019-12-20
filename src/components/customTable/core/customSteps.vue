<script>
    export default {
      name: "custom-steps",
      render(h){
        return (
          <ul class="customStepView clearfix">
            {
              this.titleList.map((stepItem,stemIndex)=>{
                return (
                  <li class="customStepBox"
                           key={stemIndex}
                           style={this.createStepStyle(stemIndex)}>{stepItem}
                    <i class="stepArrow" style={this.createStepArrowStyle(stemIndex)}></i>
                    </li>
                )
              })
            }
          </ul>
        )
      },
      props: {
        scope: {
          type:Object,
          default(){
            return {}
          }
        },
        childColconfig: {
          type:Object,
          default(){
            return {}
          }
        },
      },
      computed:{
        titleList(){
          return this.childColconfig._cellConfig.componentConfig.titleList || []
        },
        titleBackgroundColor(){
          return this.childColconfig._cellConfig.componentConfig.titleBackgroundColor || []
        },
      },
      methods:{
        createStepStyle(stemIndex){
          const state = parseInt(this.scope.row[this.childColconfig.prop  || this.childColconfig.columnIndex]) || 0
          if(stemIndex < state){
            return {
              'background-color': this.titleBackgroundColor[0] || 'rgb(0,176,240)',
              color: '#ffffff',
              'flex-basis': `auto`,
              // 'flex-basis': `${100/this.titleList.length}%`,
              'width': `${100/this.titleList.length}%`,
            }
          }else if(stemIndex === state){
            return {
              'background-color': this.titleBackgroundColor[1] || 'rgb(255,192,0)',
              'flex-basis': `auto`,
              // 'flex-basis': `${100/this.titleList.length}%`,
              'width': `${100/this.titleList.length}%`,
            }
          }else {
            return {
              'background-color': this.titleBackgroundColor[2] || 'rgb(191,191,191)',
              color: '#ffffff',
              'flex-basis': `auto`,
              // 'flex-basis': `${100/this.titleList.length}%`,
              'width': `${100/this.titleList.length}%`,
            }
          }
        },
        createStepArrowStyle(stemIndex){
          const state = parseInt(this.scope.row[this.childColconfig.prop  || this.childColconfig.columnIndex]) || 0
          if(stemIndex < state){
            return {
              'border-left': `10px solid ${this.titleBackgroundColor[0] || 'rgb(0,176,240)'}`,
            }
          }else if(stemIndex === state){
            return {
              'border-left': `10px solid ${this.titleBackgroundColor[1] || 'rgb(255,192,0)'}`,
            }
          }else {
            return {
              'border-left': `10px solid ${this.titleBackgroundColor[2] || 'rgb(191,191,191)'}`,
            }
          }
        },
      },
    }
</script>

<style lang="scss" rel="text/css" scoped>
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
