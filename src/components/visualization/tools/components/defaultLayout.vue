<template>
  <div
    draggable="true"
    @dragstart="dropDefaultLayout($event,config)">
    <grid-layout
      :layout.sync="config.layout"
      :col-num="24"
      :row-height="6"
      :is-draggable="false"
      :is-resizable="false"
      :is-mirrored="false"
      :vertical-compact="true"
      :margin="[0, 0]"
      :use-css-transforms="true">
      <grid-item v-for="(item, index) in config.layout"
                 :x="item.x"
                 :y="item.y"
                 :w="item.w"
                 :h="item.h"
                 :i="item.i"
                 :key="item.i"
                 style="text-align: center;" :style="setLayoutItemStyle(item,index)">
        {{item.txt}}
      </grid-item>
    </grid-layout>
  </div>
</template>

<script>
  import {GridLayout, GridItem} from 'vue-grid-layout'

  export default {
    name: "default-layout",
    components: {
      GridLayout,
      GridItem,
    },
    props: {
      config: {
        type: Object,
        default() {
          return null
        }
      }
    },
    computed:{

    },
    created() {
      // console.log(this.config)
    },
    methods:{
      dropDefaultLayout(e,config){
        e.dataTransfer.setData("layout",JSON.stringify(config));
      },
      setLayoutItemStyle(item,index){
        let styleObj = {},componentName = item.componentName;
        switch (componentName){
          case 'header':
            styleObj.backgroundColor = '#b3c0d1'
            break;
          case 'main':
            styleObj.backgroundColor = '#e9eef3'
            break;
          case 'leftAside':
            styleObj.backgroundColor = '#d3dce6'
            break;
          case 'rightAside':
            styleObj.backgroundColor = '#B3C0DF'
            break;
          case 'footer':
            styleObj.backgroundColor = '#b3c0d1'
            break;
          default :
            styleObj.backgroundColor = '#b3c5d1'
            break;
        }
        return styleObj
      },
    },
  }
</script>
