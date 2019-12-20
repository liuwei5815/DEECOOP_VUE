<template>
	<button class="myButtons" :disabled="setState" type="button" :class="[setType, isDisabled, isPlain]" @click="myclick">
		<svg-icon :icon-class="setIcon"></svg-icon>
        <span>{{$t('btn.'+ btnName)}}</span>
	</button>
</template>

<script>
	export default {
		props: {
			name: {
				type: String,
				default: '查询',
				required: true
			},
			icon: {
				type: String,
				default: 'search',
				required: true
			},
			state: {
				type: Boolean,
				default: false
			},
			type: {
				type: String,
				default: 'primary'
			},
			plain: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			btnName() {
				return this.name
			},
			setIcon() {
				return this.icon
			},
			setState() {
				return this.state ? true : false
			},
			setType() {
				return `el-button el-button--${this.type}`
			},
			isDisabled() {
				return this.state ? 'is-disabled' : ''
			},
			isPlain() {
				return this.plain ? 'is-plain' : ''
			}
		},
		methods: {
			myclick() {
				this.$emit('myclick')
			}
		}
	}
</script>

<style lang="scss" rel="text/css">
	.myButtons {
		position: relative;
		padding-left: 30px !important;
		>svg {
			position: absolute;
			top: 6px;
			left: 8px;
			width: 22px !important;
			height: 22px !important;
		}
	}
</style>
