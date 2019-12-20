<!--test.vue-->
<template>
  <div class="qk-date" v-text="dateValue"></div>
</template>

<script>
  import dateTools from '@/utils/dateTools'
	export default {
		name: 'QkDate',
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
		  this.dateValue = dateTools.formatDate().split(' ')[0];
      const lise =  (86400000 + new Date().getTimezoneOffset() * 60 *1000) - (new Date().getTime() - new Date(this.dateValue).getTime())
      this.dateTimer = setTimeout(_=>{
        this.dateValue = dateTools.formatDate().split(' ')[0];
      },lise)
    },
    beforeDestroy(){
		  clearTimeout(this.dateTimer)
    },
    // watch:{
    //   userValue(){
    //     this.$emit('value-bus',{value: this.userValue,uuid:this.item.uuid})
    //   }
    // },
	}
</script>

<style lang="scss" scoped>
  .qk-date{
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
