<template>
  <div class="editPlan">
    <div v-if="!stepIndex" v-text="scope.txt" data-html2canvas-ignore></div>
    <div
      v-else
      :style="userSelectView"
      @drop="dropTools($event)"
      @dragover="dropToolOver">
      <div style="position: relative;height: 100%;"
           :style="stepIndex?selectViewBoxStyle:{}"
           @click="sendUserSelect($event)">
        <edit-shape
          v-for="item in userSelectComponents"
          :key="item.uuid"
          :uuid="item.uuid"
          :defaultStyle="item.defaultStyle"
          :style="item.type==='custom'?{width:'100%',height:'100%'}:getCommonStyle(item.defaultStyle,scope.baseWidth,scope.baseHeight)"
          :showOnly="stepIndex===2 || item.type==='custom'"
          @handleElementClick="handleElementClick(item.uuid)"
          @resize="handleElementResize"
          @reset-active="resetActive"
          @delete-active="deleteUserSelectComponents"
          :active="setUserSelectItemState && item.uuid === activeId"
          :data="item">
          <component
            :is="item.elName"
            class="element-on-edit-pane"
            :id="item.uuid"
            v-bind="{value: item.value,item,readonly:stepIndex===2}"
            @value-bus="valueBus"/>
        </edit-shape>
      </div>
      <div
        v-show="(!userSelectItem || (userSelectItem && userSelectItem.i != scope.i)) && stepIndex !=2"
        class="layoutCover"
        :style="{'z-index':userSelectComponents.length + 2}"
        @click="sendUserSelect($event)"
        data-html2canvas-ignore></div>
    </div>
  </div>

</template>

<script>
  import editShape from './editShape'
  import {_components} from '../../components/plugins'
  import {createUUID} from '@/utils/common'
  import componentTools from '../common'

  export default {
    name: "edit-plan",
    props: {
      scope: {
        type: Object,
        default() {
          return {}
        }
      },
      stepIndex: {
        type: Number,
        default: 0
      },
      userSelectItem: {
        type: Object,
        default() {
          return null
        }
      }
    },
    components: {
      editShape,
      ..._components,
    },
    data() {
      return {
        getCommonStyle:componentTools.getCommonStyle,
        userSelectComponents: [],
        activeId:'',
        // layoutBoxHeight: 0,
        // layoutBoxWidth: 0,
        getBaseSizeTimer:'',
      }
    },
    computed: {
      setUserSelectItemState(){
        return this.userSelectItem && this.userSelectItem.i == this.scope.i && this.stepIndex !=2
      },
      userSelectView() {
        return {
          height: '100%',
          position: 'relative',
          'box-shadow': this.setUserSelectItemState ? '0 0 12px 0 rgba(0,0,0,.8)' : 'none',
          padding: `${this.scope.padding||0}px`,
        }
      },
      selectViewBoxStyle(){
        return {
          backgroundColor: this.scope.childBackgroundColor,
        }
      },
      setUserSelectComponent(){
        return this.userSelectComponents.filter(v=>{
          return v.uuid === this.activeId
        })
      },
    },
    methods: {
      sendUserSelect(e) {
        this.$emit('user-select', this.scope)
        this.activeId = ''
        e.stopPropagation()
        e.preventDefault()
      },
      dropTools(e) {
        this.activeId = ''
        if (this.userSelectItem && this.userSelectItem.i == this.scope.i) {
          let item = JSON.parse(e.dataTransfer.getData("componentName"))
          item.uuid = createUUID()
          item.defaultStyle = item.type==='custom'?{}:this.initTargetElStyle(e,item)
          this.activeId = item.uuid
          this.userSelectComponents.push(item)
        }
      },
      dropToolOver() {
        return false
      },
      initTargetElStyle(e,item){
        // console.log(e,item)
        const commonStyle = {
            position: 'absolute',
            width: item.defaultStyle.width,
            height: item.defaultStyle.height,
            top: e.offsetY - (item.defaultStyle.height/2),
            left: e.offsetX - (item.defaultStyle.width/2),
            rotate: 0,
            paddingTop: 0,
            paddingLeft: 0,
            paddingRight: 0,
            paddingBottom: 0,
            marginTop: 0,
            marginLeft: 0,
            marginRight: 0,
            marginBottom: 0,
            borderWidth: 0,
            borderColor: '',
            borderStyle: 'solid',
            borderRadius: 0,
            boxShadow: '',
            fontSize: 16,
            fontWeight: 500,
            lineHeight: 1.4,
            letterSpacing: 0,
            textAlign: 'center',
            color: '#ffffff',
            backgroundColor: '',
            backgroundImage: '',
            backgroundSize: 'cover',
            opacity: 1,
            zIndex: this.userSelectComponents.length+1
        }
        return Object.assign({},commonStyle)
      },
      handleElementClick(uuid) {
        this.activeId = uuid
      },
      handleElementResize(pos) {
        if(!this.activeId || !pos) return
        this.userSelectComponents.forEach(v=>{
          if(v.uuid === this.activeId){
            v.defaultStyle = {...pos}
          }
        })
        // console.log(pos)
        // if (!pos) {
        //   this.$store.dispatch('addHistoryCache')
        //   return;
        // }
        // this.projectData.pages[this.currentPageIndex].elements[this.activeElementIndex].commonStyle.left = pos.left
        // // 更新元素commonStyle
        // this.projectData.pages[this.currentPageIndex].elements[this.activeElementIndex].commonStyle = {
        //   ...pos
        // }
      },
      valueBus(data){
        this.userSelectComponents.forEach(v=>{
          if (v.uuid === data.uuid){
            // ({...v} = {...data})
            v = Object.assign(v,data)
          }
        })
        // this.userSelectComponents.find(v=>{
        //   if (v.uuid === data.uuid){
        //     ({...v} = {...data});
        //     console.log(v)
        //     return v
        //   }
        // })
      },
      deleteUserSelectComponents(id){
        if(!this.activeId || this.activeId !== id) return
        this.userSelectComponents = this.userSelectComponents.filter(v=>{
          return v.uuid !== id
        })
        this.activeId = ''
      },
      resetActive(data){
        if(data && (data.type === 'input' || data.type === 'textarea')){
          this.$el.querySelector(`#${data.uuid}`).querySelector('input').blur()
        }
        this.activeId = ''
      },
      resetSelectComponetns(){
        this.activeId = ''
        this.userSelectComponents = []
      },
      getSelectComponents(){
        this.activeId = ''
        this.$emit('user-components',{
          layoutId: this.scope.i,
          components: this.userSelectComponents,
        })
      },
      changeComponentColor(){
        const colorCom = ['input','textarea','date','time','datetime']
        ;(this.userSelectComponents || []).forEach(v=>{
          if(colorCom.includes(v.type)){
            if(v.defaultStyle.color === '#ffffff'){
              v.defaultStyle.color = '#000000'
            }else if(v.defaultStyle.color === '#000000') {
              v.defaultStyle.color = '#ffffff'
            }
          }
        })
      },
    },
    watch:{
      setUserSelectItemState(){
        if(!this.setUserSelectItemState){
          this.activeId = ''
        }
      },
      setUserSelectComponent(){
        this.$emit('send-component',this.setUserSelectComponent)
      },
    },
    mounted(){
      // this.layoutBoxHeight = this.$el.offsetHeight
      // this.layoutBoxWidth = this.$el.offsetWidth
      this.getBaseSizeTimer = setTimeout(_=>{
        this.$nextTick(_=>{
          this.scope.baseWidth = this.$el.offsetWidth
          this.scope.baseHeight = this.$el.offsetHeight
        })
      })
    },
    beforeDestroy(){
      clearTimeout(this.getBaseSizeTimer)
    },
  }
</script>

<style scoped lang="scss">
 .editPlan {
   position: relative;
    height: 100%;
 }
</style>
