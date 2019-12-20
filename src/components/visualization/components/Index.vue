<template>
  <div class="components-libs-wrapper scrollbar-wrapper">
    <p class="page-title text-center">组件库</p>
    <el-scrollbar style="height: 100%;">
      <ul class="scrollbar-wrapper">
        <li v-for="(item, index) in componentsList" :key="index" class="clearfix paddingB30">
          <div class="components-libs-title">
            <p>{{item.title}}</p>
          </div>
          <div v-if="item.components && item.components.length" class="clearfix">
            <div class="components-lib-item"
                 v-for="(element,i) in item.components"
                 :key="i"
                 :style="{width: element.img?'46.4%':'30%'}"
                 draggable="true" @dragstart="dropTools($event,element)">
                <div class="lib-item-img">
                  <svg-icon v-if="element.icon" :icon-class="`layout-${element.icon}`" :class-name="'layoutSvgClass'"></svg-icon>
                  <img v-else :src="element.img" style="width: 100%;display: block;">
                </div>
                <p class="lib-item-title">{{element.title}}</p>
            </div>
          </div>
          <div v-else>
            <p class="gray text-center paddingT20">待完善...</p>
          </div>
        </li>
      </ul>
    </el-scrollbar>
    <div v-show="!layoutItem" class="layoutCover" @click="stopClick($event)">
      <div style="height:100%;display: flex;justify-content: center;align-items: center;">
        <div class="layoutCoverTxt">请先选择布局区域</div>
      </div>
    </div>
  </div>
</template>

<script>
	// import {camelCase} from 'lodash'
	// import {_qk_register_components_object} from './plugins'
  // window._qk_register_components_object=_qk_register_components_object;
  // console.log(_qk_register_components_object)
	export default {
		name: "component-libs",
    props:{
      layoutItem:{
        type: Object,
        default(){
          return null
        }
      }
    },
		data() {
			return {
				componentsList: [
          {
            title: '基础组件',
            components: [
              {
                elName: 'QkInput',
                type: 'input',
                title: '文字',
                icon: 'txt',
                value: '',
                defaultStyle: {
                  height: 40,
                  width: 150,
                }
              },
              {
                elName: 'QkImage',
                type: 'image',
                title: '图片',
                icon: 'img',
                value: '',
                defaultStyle: {
                  height: 60,
                  width: 150,
                }
              },
              {
                elName: 'QkTextarea',
                type: 'textarea',
                title: '多行文本',
                icon: 'textarea',
                value: '',
                defaultStyle: {
                  height: 60,
                  width: 150,
                }
              },
              {
                elName: 'QkDate',
                title: '日期',
                type: 'date',
                icon: 'date',
                value: '',
                defaultStyle: {
                  height: 20,
                  width: 150,
                }
              },
              {
                elName: 'QkTime',
                title: '时间',
                type: 'time',
                icon: 'time',
                value: '',
                defaultStyle: {
                  height: 20,
                  width: 150,
                }
              },
              {
                elName: 'QkDatetime',
                title: '日期时间',
                type: 'datetime',
                icon: 'datetime',
                value: '',
                defaultStyle: {
                  height: 20,
                  width: 250,
                }
              },
            ]
          },
          {
            title: '业务组件',
            components: [
              {
                elName: 'QkTable',
                type: 'custom',
                title: '仓库任务列表',
                img: 'data:image/png;base64,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',
                config: {
                  apiObj: {
                    apiName: 'apiName',
                    params: {
                      id: '',
                    },
                  },
                  showIndex: false,
                  mixViewWidth: 500,
                  minViewHeight: 500,
                },
              },
            ]
          }
        ],
			}
		},
		methods: {
			// /**
			//  * 点击事件, 向父组件派发add-element事件，参数： 当前组件对象
			//  * @param item
			//  */
			// handleClick(item) {
			// 	let props = this.getComponentProps(item.elName);
			// 	this.$store.dispatch('addElement', {...item, needProps: props})
			// },
			// /**
			//  * 根据elname获取组件默认props数据
			//  * @param elName
			//  */
			// getComponentProps(elName) {
			// 	let elComponentData
			// 	for (let key in _qk_register_components_object) {
			// 		if (key.toLowerCase() === camelCase(elName).toLowerCase()) {
			// 			elComponentData = _qk_register_components_object[key];
			// 			break;
			// 		}
			// 	}
			// 	if (!elComponentData) return {}
            //
			// 	let props = {}
			// 	for (let key in elComponentData.props) {
			// 		props[key] = [Object, Array].includes(elComponentData.props[key].type) ? elComponentData.props[key].default() : elComponentData.props[key].default
			// 	}
			// 	return props;
			// },
      dropTools(e,item){
        e.dataTransfer.setData("componentName",JSON.stringify(item));
      },
      stopClick(e){
        window.event? (window.event.cancelBubble = true) : e.stopPropagation();
      },
		}
	}
</script>

<style lang="scss">
  .components-libs-wrapper {
    user-select: none;
    height: 100%;
    padding-top: 60px;
    position: relative;
    p,ul {
      margin: 0;
      padding: 0;
    }
    & ul {
      padding: 10px;
    }
    .layoutSvgClass {
      width: 20px;
      height: 20px;
      margin-bottom: 5px;
    }
  }

  .page-title {
    position: absolute;
    top: 16px;
    left: 0;
    width: 100%;
    text-align: center;
    font-weight: 700;
    font-size: 16px;
  }

  .components-libs-title {
    margin-bottom: 16px;
  }

  .components-lib-item {
    color: #424242;
    text-align: center;
    background: rgb(233, 238, 243);
    float: left;
    padding: 6px 0;
    margin: 1.65%;
    border: 1px solid #dddddd;
    font-size: 12px;
    cursor: move;
    transition: All 0.3s ease-in-out;
    &:hover {
      background: #E4E4E4;
      border: 1px solid #E4E4E4;
      color: #030303;
    }
    .lib-item-img {

    }
    .lib-item-title {
    }
  }
</style>
