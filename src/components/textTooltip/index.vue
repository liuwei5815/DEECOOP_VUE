<template>
  <div>
    <template v-if="setStr && isTooltip">
      <el-tooltip effect="dark" :content="setStr" placement="top-start">
        <div v-text="setStr" style="white-space:nowrap;overflow: hidden;text-overflow: ellipsis;"></div>
      </el-tooltip>
    </template>
    <template v-else>
      <div v-text="setStr" style="white-space:nowrap;overflow: hidden;text-overflow: ellipsis;"></div>
    </template>
  </div>
</template>

<script>
  export default {
    name: "text-tooltip",
    props:{
      str: [String],
      txtSize: [String],
      parentSize: [String],
      parentWidth: [String,Number],
    },
    computed:{
      setStr(){
        return this.str || ''
      },
      setTextSize(){
        return this.txtSize || 1
      },
      setParentSize(){
        return this.parentSize || '14px'
      },
      boxWidth(){
        if(this.parentWidth){
          return typeof this.parentWidth === 'string'?parseFloat(this.parentWidth):this.parentWidth
        }
        return 0
      },
      isTooltip(){
        //console.log(this.boxWidth,this.textWidth,'this.boxWidth && this.textWidth')
        if(this.boxWidth && this.textWidth){
          return this.boxWidth < (this.textWidth + 1)
        }
        return false
      }
    },
    data(){
      return {
        textWidth: 0,
      }
    },
    created(){
      this.textWidth = this.textSize(this.setParentSize,this.setTextSize,'',this.setStr).width

    },
    mounted(){

    },
    methods: {
      textSize(FfontSize,CfontSize,fontFamily,text){
        const mDiv = document.createElement('div')
        const span = document.createElement("span");
        const result = {};
        mDiv.style.visibility = "hidden";
        mDiv.style.fontSize = FfontSize;
        result.width = span.offsetWidth;
        result.height = span.offsetHeight;
        span.style.fontSize = CfontSize;
        span.style.fontFamily = fontFamily;
        span.style.display = "inline-block";
        mDiv.appendChild(span);
        document.body.appendChild(mDiv);
        if(typeof span.textContent != "undefined"){
          span.textContent = text;
        }else{
          span.innerText = text;
        }
        result.width = parseFloat(window.getComputedStyle(span).width) - result.width;
        result.height = parseFloat(window.getComputedStyle(span).height) - result.height;
        document.body.removeChild(mDiv);
        return result;
      }
    },
    watch: {
      setParentSize(){
        this.textWidth = this.textSize(this.setParentSize,this.setTextSize,'',this.setStr).width
      }
    },

  }
</script>

<style lang="scss" rel="text/css">

</style>
