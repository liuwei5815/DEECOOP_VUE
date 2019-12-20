
export default {
  name: 'dialog-img',
  props: {
    config: {
      type: Object,
      default(){
        return {}
      }
    },
    row: {
      type: Object,
      default(){
        return {}
      }
    },
  },
  data(){
    return {
      imgWidth: 0,
      imgHeight: 0,
      imgLoading: true,
      clientWidth: 0,
      clientHeight: 0,
    }
  },
  computed: {
    setStyle(){
      return {
        width: this.imgWidth + 'px',
        height: this.imgHeight + 'px',
        overflow: 'auto',
        margin: '0 auto',
        'text-align': 'center',
        'max-width': this.setMaxWidth,
        'max-height': this.setMaxHeight,
      }
    },
    setMaxWidth(){
      return this.clientWidth?((this.clientWidth - 70) + 'px'):''
    },
    setMaxHeight(){
      return this.clientHeight?((this.clientHeight - 140) + 'px'):''
    },
    imgPath(){
      return this.$baseUrl + `/${this.row[this.config._cellConfig.events.path]}`
    },
  },
  render(h){
    return (
      <div style={this.setStyle} v-loading={this.imgLoading}>
        <img
          src={this.imgPath}
          onLoad={this.masBoxImgLoad}
          alt="图片详情"/>
      </div>
    )
  },
  methods: {
    masBoxImgLoad(e){
      // console.log(this)
      if(e.target){
        this.imgWidth = e.target.width
        this.imgHeight = e.target.height
        this.imgLoading = false
        // console.log(this.imgWidth,this.imgHeight)
      }else {
        this.$nextTick(function () {
          this.imgWidth = e.target.width
          this.imgHeight = e.target.height
          this.imgLoading = false
        })
      }
    },
  },
  mounted(){
    const that = this
    this.$parent.$nextTick(function () {
      setTimeout(_=>{
        that.clientWidth = this.$el.offsetWidth
        that.clientHeight = this.$el.offsetHeight
      })
    })
  },
}
