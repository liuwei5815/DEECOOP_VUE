export default {
  props:{
    height:[String,Number],
    /*layoutType说明*/
    /*值为1表示弹窗布局为左树右表，并且表上有搜索框或者信息栏*/
    /*值为2表示弹窗布局为上下两张表，不处理*/
    /*值为3表示弹窗布局为表上有按钮，高度增加40*/
    /*值为4表示弹窗布局为自适应布局，布局需要重新计算*/
    layoutType: {
      type: Number,
      default: 0
    }
  },
  data(){
    return {
      myDialogUpdate: false,
      myDialogWidth: 0,
      myDialogHeight: 0,
      myDialogHeaderHeight: 0,
      hasTable: false,
      hasSearchBar: false,
      hasTransfer: false,
      hasTree: false,
      myDialogEl: {},
      myTableHeight: 0,
      myTableHeightState: false,
      tableNode: null,
      isExceedHeight: false,
      isExceedWidth: false,
      // searchBarHeightWatch: null,
      tableClassNames: [
        'resetBaseTableStyle',
        'resetCascadeTableStyle',
        'resetCustomRowTableStyle',
        'resetCoustomTableStyle',
        'resetExpandTableStyle',
        'resetTransferTableStyle',
        'resetTreeTableStyle'
      ],
      classNameIndex: -1,
      scaleNum: 0,
    }
  },
  created(){
    this.myDialogUpdate = false
    // console.log(document.body.clientWidth,'clientWidth')
    // console.log(document.body.offsetWidth,'offsetWidth')
    // console.log(document.body.scrollWidth,'scrollWidth')
    // console.log(document.body.clientHeight,'clientHeight')
    // console.log(document.body.offsetHeight,'offsetHeight')
    // console.log(document.body.scrollHeight,'scrollHeight')
    // console.log(this.$storage.get('clientInfo'))
    // console.log(screen)
  },
  mounted(){
    if(this.layoutType !== 2 && this.layoutType !== 4){
      setTimeout(_=>{
        console.log(this.layoutType,'layoutType')
        // console.log(this.$el.offsetWidth,'dialogMounted')
        const elArr = this.$el.querySelectorAll('.el-button--default')
        // console.log(elArr)
        const elIndex = [].findIndex.call(elArr,(v,i)=>{
          let text = v.innerText || v.textContent
          text.trim && text.trim()
          if(text && text === '关闭'){
            return true
          }
        })
        elIndex > -1 && this.reFooterStyle(elArr[elIndex])
        this.myDialogEl.el = this.$el.querySelector('.el-dialog')
        this.myDialogEl.elTable = this.$el.querySelector('.myCoustomTable')
        this.myDialogEl.elTree = this.$el.querySelector('.myCustomTree')
        if(this.myDialogEl.elTree) {
          this.hasTree = true
        }
        this.myDialogEl.elHeader = this.$el.querySelector('.el-dialog__header')
        this.myDialogEl.elBody = this.$el.querySelector('.el-dialog__body')
        this.myDialogEl.elBody && (this.myDialogEl.elBody.className += ' reDialogBody')
        this.myDialogEl.elFooter = this.$el.querySelector('.reDialogFooter')
        if(this.myDialogEl.elTable){
          this.hasTable = true
          const tableClassName = this.myDialogEl.elTable.className
          this.tableClassNames.forEach((v,i)=>{
            tableClassName.indexOf(v)>-1
              ?(this.classNameIndex = i)
              :''
          })
        }
        this.myDialogEl.elTransfer = this.$el.querySelector('.el-transfer')
        this.myDialogEl.elTransfer && (this.hasTransfer = true)
        if(this.$el.querySelector('.searchBar')) {
          this.hasSearchBar = true
        }
        if(this.hasTable){
          this.myDialogEl.elTable.parentNode.style.height = this.computTableHeight + 'px'
          // console.log(this.myDialogEl.elTable.parentNode.offsetHeight,'this.myDialogEl.elTable.parentNode')
          // console.log(this.myDialogEl.elTable.offsetHeight,'this.myDialogEl.elTable')
          // console.log(this.myDialogEl.elBody.offsetHeight,'this.myDialogEl.elBody')
          // console.log(this.myDialogEl.el.offsetHeight,'this.myDialogEl.el')
          // console.log(this.$store.getters.systemInfo.offsetHeight,'this.$store.getters.systemInfo.offsetHeight')
          // console.log(this.$store.getters.systemInfo.offsetWidth,'this.$store.getters.systemInfo.offsetWidth')
        }



        if (!this.fullscreen) {
          const style = this.reDialogStyle(this.$store.getters.systemInfo)
          this.myDialogEl.el.style.marginTop = style['margin-top'] || '10vh';
          style['width'] && (this.myDialogEl.el.style.width = style['width'])
          style['max-width'] && (this.myDialogEl.el.style.maxWidth = style['max-width'])
          style['max-height'] && (this.myDialogEl.el.style.maxHeight = style['max-height'])
          //console.log(this.myDialogEl.el.style.maxWidth,this.myDialogEl.el.clientWidth)
        }


        this.myDialogEl.elBody && (this.myDialogEl.elBody.style.position = 'relative')
        this.myDialogWidth = this.myDialogEl.el.offsetWidth || 0
        this.myDialogHeight = this.myDialogEl.el.offsetHeight || 0
        this.myDialogHeaderHeight = this.myDialogEl.elHeader?this.myDialogEl.elHeader.offsetHeight:0
        if(this.myDialogWidth && this.myDialogHeight){
          // console.log(this.myDialogEl.el.clientWidth, this.myDialogEl.el.offsetWidth,this.myDialogEl.el.scrollWidth)
          this.myDialogUpdate = true
          this.hasSearchBar && this.$store.commit(this.searchGuid+'/SET_CLIENTDATA',{
            clientHeight: this.myDialogHeight,
            clientWidth: this.myDialogWidth - (this.initLayoutTypeSize.treeWidth || 0),
            rootWidth: this.$root.$el.clientWidth,
            rootHeight: this.$root.$el.clientHeight,
          })
        }
        if (this.hasTable && !this.fullscreen) {
          this.reDialogTableStyle()
        }
      })
    }
  },
  // beforeDestroy(){
  //   this.searchBarHeightWatch && this.searchBarHeightWatch()
  // },
  // updated: function () {
  //   console.log('updated')
  //   // if(this.myDialogEl.elTable && this.myDialogEl.elTable.parentNode){
  //   //   this.$nextTick(function () {
  //   //     this.myDialogEl.elTable.parentNode.style.height = (this.myTableHeight || 300) +'px'
  //   //     console.log(this.myDialogEl.elTable.parentNode.style.height)
  //   //     this.doLayoutTable('myCoustomTable',this)
  //   //     this.myTableHeightState = false
  //   //   })
  //   // }
  // },
  computed:{
    resetStyle(){
      return this.reDialogStyle(this.$store.getters.systemInfo)
    },
    style() {
      // console.log(this.resetStyle)
      let style = {};
      if (!this.fullscreen) {
        style.marginTop = this.resetStyle['margin-top'] || '10vh';
        if (this.width) {
          style.width = this.resetStyle.width || this.width;
        }
        this.resetStyle['max-width'] && (style.maxWidth = this.resetStyle['max-width'])
        this.resetStyle['max-height'] && (style.maxHeight = this.resetStyle['max-height'])
      }
      //console.log(style,'style')
      return style;
    },
    searchGuid(){
      return this.hasSearchBar?this.$parent.guid:null
    },
    searchBarHeight(){
      if(this.searchGuid){
        // console.log(this.$store.getters[this.searchGuid+'/searchBoxHeight'])
        // console.log(this.$store)
        return this.$store.getters[this.searchGuid+'/searchBoxHeight']
      }
      return null
    },
    initTableConstant(){
      let constant = 0
      switch (this.classNameIndex){
        case 5:
          constant = 8.5
          break;
        default:
          constant = 5
          break;
      }
      // console.log(constant)
      return constant
    },
    computTableHeight(){
      const sys = this.$store.getters.systemInfo
      return (sys.offsetHeight - (sys.offsetWidth===1366?sys.offsetWidth/(this.initTableConstant*1.35):sys.offsetWidth/this.initTableConstant)) - ((this.hasTransfer?this.myDialogEl.elTransfer.offsetHeight:0) + (this.layoutType === 3?36:0))
    },
    initLayoutTypeSize(){
      let sizeObj = {}
      switch (this.layoutType){
        case 1:
          sizeObj.treeWidth = this.myDialogEl.elTree.parentNode.offsetWidth
          break;
        default :
          break;
      }
      return sizeObj
    },
  },
  methods:{

    reDialogStyle(sys,update = false){
      const res = {}
      if(this.myDialogEl.el && this.hasTable && (this.layoutType !== 2 && this.layoutType !==4)){
        // console.log(this.myDialogEl.el.offsetWidth,this.myDialogEl.el.offsetHeight,sys.offsetWidth,sys.offsetHeight)
        if(this.myDialogEl.el.offsetWidth > (sys.offsetWidth - 20)){
          this.isExceedWidth = true
          res['max-width'] = res.width = (sys.offsetWidth - 20) + 'px'
        }
        if(this.myDialogEl.el.offsetHeight > sys.offsetHeight){
          // console.log(1,'--reDialogStyle')
          this.isExceedHeight = true
          res['max-height'] = (sys.offsetHeight - 24) + 'px'
          res['margin-top'] = 12 + 'px'
          const height = ((sys.offsetHeight - 24) - (this.myDialogEl.elHeader?this.myDialogEl.elHeader.offsetHeight:0))
          this.myDialogEl.elBody.style.maxHeight = height + 'px'
          this.hasTable && (this.myDialogEl.elBody.style.height = height + 'px');
          this.myDialogEl.elBody.style.overflow = this.hasTable?'auto':'auto'
        }else if(this.hasTransfer || this.hasTree ){
          // console.log(2,'--reDialogStyle')
          this.isExceedHeight = true
          const median = (sys.offsetHeight-this.myDialogEl.el.offsetHeight)/(this.hasTransfer?6:2)
          const height = (sys.offsetHeight - (median * 2)) - (this.myDialogEl.elHeader?this.myDialogEl.elHeader.offsetHeight:0)
          res['margin-top'] = median + 'px'
          this.myDialogEl.elBody.style.height = height + 'px'
        }else if((sys.offsetHeight-this.myDialogEl.el.offsetHeight)>24) {
          // console.log(sys.offsetHeight,this.myDialogEl.el.offsetHeight,'sys.offsetHeight-this.myDialogEl.el.offsetHeight')
          // console.log(3,'--reDialogStyle')
          res['margin-top'] = (sys.offsetHeight-this.myDialogEl.el.offsetHeight)/2 + 'px'
          if(update){
            this.myDialogEl.el.style.marginTop = res['margin-top']
          }
        }
        if(sys.offsetWidth<=1366 && !res['margin-top']){
          res['margin-top'] = 12 + 'px'
        }
      }else if(this.layoutType === 4){
        this.scaleNum =  Math.floor(11/(sys.offsetWidth/1024<=1?1.156:sys.offsetWidth/1024)*10)
        if(this.$el){
          this.$el.querySelector('.el-dialog__body').style.height = `calc(100% - ${this.$el.querySelector('.el-dialog__header').offsetHeight}px)`
        }
      }
      // console.log(res,'reDialogStyle')
      return res
    },
    reDialogTableStyle(){
      const tableBoxEl = this.myDialogEl.elTable.parentNode
      if(tableBoxEl){
        this.$nextTick(function () {
          setTimeout(_=>{
            const bodyOffsetHeight = this.myDialogEl.elBody.offsetHeight
            // console.log(this.computTableHeight,'this.computTableHeight')
            // console.log(this.myDialogEl.elTable.parentNode.offsetTop,'this.myDialogEl.elTable.parentNode.offsetTop')
            // console.log(this.myDialogEl.el.offsetHeight,'this.myDialogEl.el.offsetHeight')
            // console.log(this.myDialogEl.elBody.offsetHeight,'this.myDialogEl.elBody.offsetHeight')
            // console.log(this.searchGuid?this.searchBarHeight:tableBoxEl.offsetTop,'this.searchGuid?this.searchBarHeight:tableBoxEl.offsetTop')
            // console.log(this.myDialogEl.elFooter?(this.myDialogEl.elFooter.offsetHeight||0):0,'this.myDialogEl.elFooter?(this.myDialogEl.elFooter.offsetHeight||0):0')
            // console.log(this.hasTransfer?this.myDialogEl.elTransfer.offsetHeight:0,'this.hasTransfer?this.myDialogEl.elTransfer.offsetHeight:0')
            this.myTableHeight = ((bodyOffsetHeight>this.computTableHeight?bodyOffsetHeight:this.computTableHeight)) - ((this.searchGuid?this.searchBarHeight:tableBoxEl.offsetTop) + (this.myDialogEl.elFooter?(this.myDialogEl.elFooter.offsetHeight||0):0) + (this.hasTransfer?this.myDialogEl.elTransfer.offsetHeight:0))
            this.myTableHeightState = true
            //console.log(this.myDialogEl.elBody.offsetHeight,this.myTableHeight,'reDialogTableStyle')
          },20)
        })
      }
    },
    reFooterStyle(el=null){
      if(el){
        const btnHeight = el.offsetHeight,baseH = 60,className = el.parentNode.className;
        el.parentNode.className += className?' reDialogFooter':'reDialogFooter'
        // el.parentNode.style.height = baseH + 'px'
        // el.parentNode.style.padding = `${(baseH-btnHeight)/2}px 0`
      }
    },
    doLayoutTable(className,vnode){
      if(className){
        this.tableNode = vnode.$children.find(v=>{
          if(v.$el && typeof v.$el.className === 'string' && v.$el.className.indexOf(className)>-1){
            return true
          }
          v.$children && v.$children.length && this.doLayoutTable(className,v)
        })
        if(this.tableNode){
          if(this.tableNode.$refs) {
            Object.keys(this.tableNode.$refs).forEach((s,i)=>{
              s.indexOf('Table')>-1
                ?this.tableNode.$refs[s].doLayout && this.tableNode.$refs[s].doLayout()
                :''
            })
          }
        }
      }
    },
  },
  watch: {
    myTableHeight(){
      // console.log(this.myTableHeight,'watch',this.isExceedHeight)
      if(this.myTableHeight){
        setTimeout(_=>{
          //console.log(this.myDialogEl.elTable.parentNode)
          this.myDialogEl.elTable.parentNode.style.height = this.myTableHeight + 'px'
          if(this.hasTree){
            if(this.layoutType === 1){
              this.myDialogEl.elTree.parentNode.style.height = this.myDialogEl.elBody.offsetHeight + 'px'
            }else {
              this.myDialogEl.elTree.parentNode.style.height = (this.myTableHeight + (this.myDialogEl.elFooter?(this.myDialogEl.elFooter.offsetHeight||0):0)) + 'px'
            }
          }
        },this.hasTransfer?1000:0)
      }
    }
  },
}
