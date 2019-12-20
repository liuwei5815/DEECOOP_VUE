<!--test.vue-->
<template>
  <div class="qk-input">
    <input class="qk-input-item" v-model="userValue" :placeholder="readonly?'':'请输入'" type="text" :readonly="readonly">
  </div>
</template>

<script>
	export default {
		name: 'QkInput',
		props: {
			value: {
        type: String,
        default: ''
      },
      readonly: {
        type: Boolean,
        default: false
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
        userValue: this.value
      }
    },
    watch:{
      userValue(){
        this.$emit('value-bus',{value: this.userValue,uuid:this.item.uuid})
      }
    },
	}
</script>

<style lang="scss" scoped>
  .qk-input {
    height: 100%;
    font-weight: inherit;
    color: inherit;
    text-align: inherit;
    .qk-input-item{
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
  }
</style>
