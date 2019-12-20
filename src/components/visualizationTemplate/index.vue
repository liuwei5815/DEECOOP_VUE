<template>
  <div class="visualizationPreview" :style="{cursor:viewMouseState?'default':'none'}">
    <div v-if="visualizationConfig" class="visualizationPreviewView">
      <grid-layout
        :layout.sync="tempLayout"
        :col-num="24"
        :row-height="setRowHeight"
        :max-rows="24"
        :vertical-compact="true"
        :margin="[0, 0]"
        :use-css-transforms="true">
        <grid-item v-for="(item,index) in tempLayout"
                   :x="item.x"
                   :y="item.y"
                   :w="item.w"
                   :h="item.h"
                   :i="item.i"
                   :key="item.i"
                   :is-resizable="false"
                   :is-draggable="false"
                   :style="setLayoutItemStyle(item)">
          <div v-set-view-width="{index}" style="position: relative;height: 100%;" :style="{padding:`${item.padding||0}px`}">
            <div style="position: relative;height: 100%;" :style="{backgroundColor:item.childBackgroundColor}">
              <edit-shape
                v-for="cItem in (item.userComponents || [])"
                :key="cItem.uuid"
                :uuid="cItem.uuid"
                :showOnly="true"
                :defaultStyle="cItem.defaultStyle"
                :style="getCommonStyle(cItem.defaultStyle,item.baseWidth,item.baseHeight,viewWidths[index])"
                :active="false"
                :data="cItem">
                <component
                  :is="cItem.elName"
                  class="element-on-edit-pane"
                  :id="cItem.uuid"
                  v-bind="{value: cItem.value,item:cItem,readonly:true}"/>
              </edit-shape>
            </div>
          </div>
        </grid-item>
      </grid-layout>
      <template v-if="viewMessageDisplay">
        <div class="viewMessage" :style="{opacity:opacityState?1:0}" @transitionend="viewMessageDisplay = !viewMessageDisplay">
          按esc可关闭看板
        </div>
      </template>
      <template v-else>
        <div class="screenfullBtn">
          <el-tooltip v-show="viewMouseState" :content="screenfullState?'退出全屏':'全屏显示'" placement="left" effect="light">
            <svg-icon :icon-class="screenfullState?'shrink':'open'" class-name="screenfull-svg" @click="screenfullClick"></svg-icon>
          </el-tooltip>
          <el-tooltip v-show="!screenfullState" content="关闭看板" placement="left" effect="light">
            <svg-icon icon-class="close" class-name="screenfull-svg" style="margin-left: 5px;" @click="closeKanban"></svg-icon>
          </el-tooltip>
          <!--<svg t="1508738709248" @click="screenfullClick" class="screenfull-svg" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"-->
               <!--p-id="2069" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32">-->
            <!--<path d="M333.493443 428.647617 428.322206 333.832158 262.572184 168.045297 366.707916 64.444754 64.09683 64.444754 63.853283 366.570793 167.283957 262.460644Z"-->
                  <!--p-id="2070"></path>-->
            <!--<path d="M854.845439 760.133334 688.61037 593.95864 593.805144 688.764889 759.554142 854.56096 655.44604 958.161503 958.055079 958.161503 958.274066 656.035464Z"-->
                  <!--p-id="2071"></path>-->
            <!--<path d="M688.535669 428.550403 854.31025 262.801405 957.935352 366.921787 957.935352 64.34754 655.809313 64.081481 759.919463 167.535691 593.70793 333.731874Z"-->
                  <!--p-id="2072"></path>-->
            <!--<path d="M333.590658 594.033341 167.8171 759.804852 64.218604 655.67219 64.218604 958.270996 366.342596 958.502263 262.234493 855.071589 428.421466 688.86108Z"-->
                  <!--p-id="2073"></path>-->
          <!--</svg>-->
        </div>
      </template>
    </div>
    <div v-else style="height: 100%;text-align: center;padding-top: 200px;font-size: 30px;">
      <div>没有可用的配置</div>
      <div>
        <el-button @click="goHome">返回首页</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import screenfull from 'screenfull'
  import {GridLayout, GridItem} from 'vue-grid-layout'
  // import editPlan from '@/components/visualization/tools/components/editPlan'
  import editShape from '@/components/visualization/tools/components//editShape'
  import componentTools from '@/components/visualization/tools/common'
  import {_components} from '@/components/visualization/components/plugins'
  export default {
    name: "visualization-preview",
    props:{
      visualizationConfig:{
        type: Object,
        default(){
          return null
        }
      },
      showModel:{
        type: String,
        default: '',
      },
    },
    components: {
      GridLayout,
      GridItem,
      // editPlan,
      editShape,
      ..._components,
    },
    data(){
      return {
        layoutBoxHeight: 0,
        getCommonStyle:componentTools.getCommonStyle,
        layoutBoxHeightTimer: '',
        opacityState: true,
        viewMessageDisplay: true,
        screenfullAddEventd: false,
        screenfullState: false,
        viewMouseTimer: '',
        viewMouseState: true,
        viewWidths: [],
      }
    },
    directives:{
      'set-view-width':{
        inserted(el, binding, vnode) {
          vnode.context.$set(vnode.context.viewWidths, binding.value.index, el.offsetWidth)
        }
      },
    },
    computed:{
      tempLayout(){
        if(!this.visualizationConfig) return []
        return this.visualizationConfig.layout
      },
      setRowHeight() {
        // return Math.floor(this.layoutViewHeight/24)
        return this.layoutBoxHeight / 24
      },

    },
    methods:{
      goHome(){
        this.$router.push({path: '/'})
      },
      setLayoutItemStyle(item) {
        return {
          backgroundColor: item.backgroundColor
        }
      },
      viewMousemove(){
        this.viewMouseState = true
        clearTimeout(this.viewMouseTimer)
        this.viewMouseTimer = setTimeout(_=>{
          this.viewMouseState = false
        },5000)
      },
      screenfullClick(){
        if (!screenfull.enabled) {
          this.$message({
            message: '当前浏览器不支持此功能',
            type: 'warning'
          })
          return false
        }
        if(!this.screenfullAddEventd){
          this.screenfullAddEventd = true
          screenfull.onchange(this.resetClientHeight)
        }
        screenfull.toggle()
      },
      resetClientHeight(){
        clearTimeout(this.layoutBoxHeightTimer)
        this.layoutBoxHeightTimer = setTimeout(_=>{
          this.layoutBoxHeight = this.$el.clientHeight
          this.screenfullState = screenfull.isFullscreen
        })
      },
      closeKanban(){
        this.$emit('closeview')
      },
      scalingRatio(baseWidth,id){
        if(baseWidth && id){
          return Math.round(this.$el.querySelector(`#${id}`).offsetWidth/baseWidth)
        }else {
          return 1
        }
      },
    },
    watch:{
      screenfullState(){
        if(!this.screenfullState){
          clearTimeout(this.viewMouseTimer)
          this.$el.removeEventListener('mousemove',this.viewMousemove,true)
          // this.$el.removeEventListener('mouseover',this.viewMouseover,true)
          this.viewMouseState = true
        }else {
          clearTimeout(this.viewMouseTimer)
          this.$el.addEventListener('mousemove',this.viewMousemove,true)
          // this.$el.addEventListener('mouseover',this.viewMouseover,true)
          this.viewMouseTimer = setTimeout(_=>{
            this.viewMouseState = false
          },5000)
        }
      },
    },
    mounted(){
      this.layoutBoxHeight = this.$el.clientHeight
      this.$nextTick(_=>{
        this.opacityState = false
      })
    },
    beforeDestroy(){
      clearTimeout(this.layoutBoxHeightTimer)
      this.screenfullAddEventd && screenfull.off('change',this.resetClientHeight)
      clearTimeout(this.viewMouseTimer)
    },
  }
</script>

<style scoped lang="scss">
  .visualizationPreview {
    height: 100%;
    .visualizationPreviewView {
      position: relative;
      height: 100%;
      overflow: hidden;
      .viewMessage {
        position: absolute;
        top: 100px;
        left: 50%;
        transform: translate(-50%,0);
        font-size: 30px;
        color: #fff;
        text-align: center;
        transition: opacity 3s ease-in 1s;
      }
      .screenfullBtn {
        position: fixed;
        top: 30px;
        right: 30px;
        .screenfull-svg {
          display: inline-block;
          cursor: pointer;
          fill: #ffffff;
          width: 20px;
          height: 20px;
          vertical-align: middle;
        }

      }
    }
  }
</style>
