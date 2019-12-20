/**
 * 组件库入口
 * */

// 基础组件
import Image from './image'
import Date from './date'
import Datetime from './datetime'
import Time from './time'
import Input from './input'
import Textarea from './textarea'

// 业务组件
import Table from './table'



// 所有组件列表
const components = [
	// 基础组件
	Image,
  Date,
  Datetime,
  Time,
	Input,
	Textarea,
	// 业务组件
  Table,

]
// 定义 install 方法，接收 Vue 作为参数
const install = function (Vue) {
	// 判断是否安装，安装过就不继续往下执行
	if (install.installed) return
	install.installed = true
	// 遍历注册所有组件
	components.map(component => Vue.component(component.name, component))
}

// 检测到 Vue 才执行，毕竟我们是基于 Vue 的
if (typeof window !== 'undefined' && window.Vue) {
	install(window.Vue)
}

let _components = {};
components.forEach(item => {
	_components[item.name] = item
})


export {
	_components
}



export default {
	install,
}
