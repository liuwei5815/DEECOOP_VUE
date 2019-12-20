import {SUID} from '@/utils/common'
export default {
  directives:{
    switchshadow:{
      inserted(el, binding, vnode) {
        const that = vnode.context
        if(el.scrollHeight>el.offsetHeight){
          that.showBoxShadow = true
        }else {
          that.showBoxShadow = false
        }
      },
      componentUpdated(el, binding, vnode){
        const that = vnode.context
        if(el.scrollHeight>el.offsetHeight){
          that.showBoxShadow = true
        }else {
          that.showBoxShadow = false
        }
      }
    }
  },
  props:{

  },
  data(){
    return {
      showBoxShadow: false,
      scaleNum: 0,
      suid: '',
    }
  },
  created(){
    this.suid = SUID()
  },
  mounted(){
    setTimeout(_=>{
      console.log(this.scaleNum,this.suid)
    })
  },
  beforeDestroy(){
    this.suid && this.removeDialogClass()
  },
  computed:{
    size(){
      return this.$store.getters.size
    },
    formItemWidth(){
      let width = {}
      switch (this.size){
        case 'mini':
          width.width = '180px'
          break;
        case 'small':
          width.width = '200px'
          break;
        default :
          width.width = '220px'
          break;
      }
      return width
    },
    createDialogStyle(){
      return `.${this.suid}{
        width: ${this.scaleNum}%;
        height: ${this.scaleNum}%;
        margin-top: ${((100 - this.scaleNum)/2)*this.$store.getters.systemInfo.offsetHeight/100}px !important;
      }`
    },
    computeDialogClass(){
      this.setStyle(this.suid)
      return this.suid
    },
  },
  methods:{
    setStyle(id){
      if(id){
        let styleTag = document.getElementById(id)
        styleTag && styleTag.remove()
        styleTag = document.createElement('style')
        styleTag.setAttribute('id', id)
        document.head.appendChild(styleTag)
        styleTag.innerText = this.createDialogStyle
      }
    },
    removeDialogClass(){
      let styleTag = document.getElementById(this.suid)
      styleTag && styleTag.remove()
    }
  },
  watch: {

  },
}
