<template>
    <el-cascader  ref="cascader" size="medium " :value="value" :placeholder="placeholder" :disabled="setDisabled"  :clearable="setClearable"
                 :options="options" filterable change-on-select  v-on:change="handleChange" @focus="selectFocus"></el-cascader>
  <!--@focus="handleFocus"-->
</template>

<script>

  // ajax后台方法
  import request from '@/utils/request'
  import {removeNullTreeNode,getNode} from '@/utils/common'


  export default {
    name: "base-input-select",
    props: {
      placeholder: {
        type: String,
        default: '',
      },
      disabled: {
        type: Boolean,
        default: false
      },
      clearable: {
        type: Boolean,
        default: true
      },
      value: {
        type: Array
      },
      data: {
        type: Object,
        default: function () {
          return {
          }
        }
      }

    },
    components: {

    },
    data(){
      return {
        //下拉列表数据集合
        options: [],
      }
    },
    mounted() {

    },

    created() {
      // console.log("1111111111"+JSON.stringify(this.data))
      // this.options = this.data.defaultData
      this.initSelectOption()
    },
    computed: {
      setPlaceholder() {
        return this.placeholder
      },
      setDisabled() {
        return this.disabled
      },
      setClearable() {
        return this.clearable
      },
      dialogData() {
        return this.dialog.dialogName
      }
    },
    methods: {
      //下拉列表动态加载数据
      initSelectOption() {

        const that = this
        request({
          url: that.data.selectUrl,
          method: 'post',
          data: {
            ...that.data.selectParm
          }
        }).then(res => {
          //console.log(res)
          if(res.result.options){
            if(res.result.options){
              if(res.result.options.length>0){
                let optionsData = res.result.options
                removeNullTreeNode(optionsData)
                that.options = optionsData
                if(that.data.isDefaultSelected){
                  // that.value = [that.options[0].id]
                  that.data.defaultSelected = [that.options[0].id]
                }
              }
            }
          }
        }).catch(err => {
          //console.log(err)

        })
      },

      handleChange(val) {
        this.$emit('callback',val)

        // console.log('active val:', val)
        // const that = this
        // let option = null
        // let optionNames = null
        // // that.options.forEach(item => {
        // //   if(item.value==val[0]){
        // //     option = item
        // //   }
        // // })
        // // console.log('active val:', val[val.length-1],that.options)
        // if(val){
        //   console.log("444444",val[val.length-1])
        //   console.log("555555",that.options)
        //   option = getNode(that.options,val[val.length-1])
        //   for(let i=0;i<val.length;i++){
        //     let options = getNode(that.options,val[i])
        //     if(options){
        //       if(optionNames){
        //         optionNames = optionNames +'/'+options.name
        //       }else{
        //         optionNames = options.name
        //       }
        //     }
        //   }
        // }
        // console.log("66666666",optionNames)
        // console.log("77777777",option)
        // this.$emit('callback',val,option,optionNames)
        // setTimeout (,30000)

      },

      selectFocus() {
        this.initSelectOption();
      },

    },
    watch: {
      value: function () {
        // console.log("222222"+this.value)
      },
      data:{
        handler(curVal,oldVal){
          if(curVal!=oldVal){
            this.initSelectOption()
          }
        },
        deep:true
      }
    }
  }
</script>

<style scoped>

</style>
