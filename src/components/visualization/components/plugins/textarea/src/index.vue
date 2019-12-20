<!--test.vue-->
<template>
  <div class="qk-textarea">
    <textarea class="qk-textarea-item" :style="{width:item.defaultStyle.width+'px',height:item.defaultStyle.height+'px'}" :placeholder="readonly?'':'请输入'" v-model="tempValue" :readonly="readonly"/>
  </div>
</template>

<script>
	export default {
		name: 'QkTextarea',
		props: {
			value: {
				require: false
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
		data() {
			return {
				tempValue:this.value
			}
		},
		watch: {
      tempValue(){
        this.$emit('value-bus',{value: this.tempValue,uuid:this.item.uuid})
      }
		}
	}
</script>

<style lang="scss" scoped>
  .qk-textarea {
    height: 100%;
    font-weight: inherit;
    color: inherit;
    text-align: inherit;
    .qk-textarea-item {
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
