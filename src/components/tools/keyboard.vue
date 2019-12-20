<template>
  <el-col class="keyboard" style="width:180px;height: 270px;">
    <div class="buttonView clearfix" style="">
      <template v-for="(item,index) in setConfig">
        <div class="buttonBox">
          <el-button class="resetIcon" :disabled="item.disabled==='undefined'?false:item.disabled" :type="item.type?item.type:'primary'" @click="item.method(item.targetKey,item.key)">
            <svg-icon :icon-class="item.icon"></svg-icon>
          </el-button>
        </div>
      </template>
    </div>
    <div class="btns" style="text-align: center; height: 50px;padding-top: 12px;">
      <el-button size="mini" @click="closeKeyboard">关闭</el-button>
    </div>
  </el-col>
</template>

<script>
    export default {
      name: "keyboard",
      components:{},
      props:{
        config:{
          type:Array,
          default(){
            return []
          }
        },
        lockVar:{
          type: Boolean,
          default: false
        }
      },
      data(){
        return {}
      },
      computed:{
        setConfig(){
          return this.config
        },
        setLockVar(){
          return this.lockVar
        }
      },
      watch:{},
      methods:{
        closeKeyboard(){
          this.$emit('update:popovervisible',false)
        }
      },
      created(){
      },
      mounted(){},

    }
</script>

<style lang="scss" rel="text/css">
  .keyboard {
    .el-button {
      padding: 5px;
    }
    .resetIcon {
      .svg-icon {
        width: 2em;
        height: 2em;
      }
    }
  }
</style>
