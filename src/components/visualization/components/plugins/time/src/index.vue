<!--test.vue-->
<template>
  <div class="qk-time" v-text="timeValue"></div>
</template>

<script>
  import dateTools from '@/utils/dateTools'
	export default {
		name: 'QkTime',
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
        timeValue: '',
        dateTimer: '',
      }
    },
    created(){
		  this.timeValue = dateTools.formatDate().split(' ')[1];
      this.dateTimer = setInterval(_=>{
        this.timeValue = dateTools.formatDate().split(' ')[1];
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
  .qk-time {
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
