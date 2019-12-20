<!--test.vue-->
<template>
  <div class="qk-datetime" v-text="dateValue"></div>
</template>

<script>
  import dateTools from '@/utils/dateTools'
	export default {
		name: 'QkDatetime',
		props: {
			value: {
        type: String,
        default: ''
      },
      item: {
			  type: Object,
        default(){
			    return null
        },
      },
		},
    data(){
			return {
        dateValue: '',
        dateTimer: '',
      }
    },
    created(){
		  this.dateValue = dateTools.formatDate()
      this.dateTimer = setInterval(_=>{
        this.dateValue = dateTools.formatDate()
      },1000)
    },
    beforeDestroy(){
		  clearInterval(this.dateTimer)
    },
    // watch:{
    //   userValue(){
    //     this.$emit('value-bus',{value: this.userValue,uuid:this.item.uuid})
    //   }
    // },
	}
</script>

<style lang="scss" scoped>
  .qk-datetime{
    display: block;
    width: 100%;
    height: 100%;
    outline: none;
    border: none;
    background-color: transparent;
    font-weight: inherit;
    color: inherit;
    text-align: inherit;
  }
</style>
