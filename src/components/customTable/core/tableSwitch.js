export default {
  name: 'custom-table-switch',
  props:{
    showSwitch: Boolean,
    columnData: Object,
    columnIndex: [String,Number],
  },
  data(){
    return {
      iconName: '',
      // setState: true,
    }
  },
  computed:{
    setIconName(){
      if(this.setState) return 'columnopen'
      return 'columnretract'
    },
    setTitleFirstStr(){
      if(this.setState) return '收起'
      return '展开'
    },
    setSwitchTitle(){
      return this.setTitleFirstStr + (this.columnData?this.columnData.label+'列'||'当前列':'当前列')
    },
    setState(){
      return this.columnData._isShow
    },
  },
  methods:{
    handleClick(e){
      e.stopPropagation()
      return
    },
    changeState(){
      // console.log(this.columnData._isShow,'columnData')
      // this.setState = !this.setState
      this.$emit('change-column',this.columnIndex)
    },
  },
  created(){
    // this.setState = this.columnData?this.columnData._isShow||false:false
  },
  render(h){
    return (
      <div
        class="customTableClass"
        on-click={ ($event) => this.handleClick($event) }>
        <div
          style="height:100%;padding:1px;"
          title={this.setSwitchTitle}
          on-click={ _ => this.changeState() }>
          <svg-icon
            icon-class={this.setIconName}
            class-name={'el-button--text'}></svg-icon>
        </div>
      </div>
    )
  }
}
