<template>
  <div class="visualizationPreview">
    <div v-if="visualizationConfig" class="visualizationPreviewView">
      <grid-layout
        :layout.sync="tempLayout"
        :col-num="24"
        :row-height="setRowHeight"
        :max-rows="24"
        :vertical-compact="true"
        :margin="[0, 0]"
        :use-css-transforms="true">
        <grid-item v-for="item in tempLayout"
                   :x="item.x"
                   :y="item.y"
                   :w="item.w"
                   :h="item.h"
                   :i="item.i"
                   :key="item.i"
                   :is-resizable="false"
                   :is-draggable="false"
                   style="background-color: rgb(10,24,40)">
          <div style="position: relative;height: 100%;">
            <edit-shape
              v-for="cItem in (item.userComponents || [])"
              :key="cItem.uuid"
              :uuid="cItem.uuid"
              :defaultStyle="cItem.defaultStyle"
              :style="getCommonStyle(cItem.defaultStyle)"
              :active="false"
              :data="cItem">
              <component
                :is="cItem.elName"
                class="element-on-edit-pane"
                :id="cItem.uuid"
                v-bind="{value: cItem.value,item:cItem}"/>
            </edit-shape>
          </div>
        </grid-item>
      </grid-layout>
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
  import {GridLayout, GridItem} from 'vue-grid-layout'
  // import editPlan from '@/components/visualization/tools/components/editPlan'
  import editShape from '@/components/visualization/tools/components//editShape'
  import componentTools from '@/components/visualization/tools/common'
  import {_components} from '@/components/visualization/components/plugins'
  export default {
    name: "visualization-preview",
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
        visualizationConfig: null,
        getCommonStyle:componentTools.getCommonStyle,
      }
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
    },
    mounted(){
      this.layoutBoxHeight = this.$el.clientHeight
      this.$nextTick(_=>{
        this.visualizationConfig = this.$storage.get('visualizationConfig')
      })
    },
  }
</script>

<style scoped lang="scss">
  .visualizationPreview {
    height: 100%;
    .visualizationPreviewView {
      height: 100%;
    }
  }
</style>
