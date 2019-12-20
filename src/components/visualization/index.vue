<template>
  <div class="visualization"
       v-loading.fullscreen.lock="saveLoading"
       :element-loading-text="saveLoadingTxt"
       element-loading-spinner="none"
       element-loading-background="rgba(255,255,255,0.6)">
    <el-row style="height: 100%;">
      <el-col :span="18" style="height: 100%">
        <div
          style="height: 100%;"
          v-if="activeNames === '1'"
          @drop.prevent="dropLayout"
          @dragover.prevent="dropLayoutOver">
          <div class="customLayoutHeader">
            <div class="headerView leftArrow">
              <base-button icon="arrowright" :name="'上一步'" type="primary" plain :state="stepIndex?false:true"
                           @myclick="upStep"></base-button>
            </div>
            <div class="headerView headerTxt">
              <div class="clearfix titleBox" :style="{left: `-${stepIndex*100}%`}">
                <template v-for="(item,index) in titleList">
                  <div class="titleView" :style="{opacity: (index === stepIndex)?'1':'0',width:`${100/titleList.length}%`,}" :key="index"
                       v-text="item"></div>
                </template>
              </div>
            </div>
            <div class="headerView rightArrow">
              <base-button
                v-show="stepIndex!=2"
                icon="arrowleft"
                name="下一步"
                :iconRight="true"
                type="primary"
                plain
                @myclick="nextStep"></base-button>
              <base-button
                v-show="stepIndex==2"
                icon=""
                name="保存"
                type="primary"
                plain
                @myclick="saveLayout"></base-button>
            </div>
          </div>
          <div id="layoutBox">
            <div id="layoutView" :style="{width: layoutViewWidth + 'px', height: layoutViewHeight+'px'}">
              <template v-if="tempLayout.length">
                <grid-layout
                  :layout.sync="tempLayout"
                  :col-num="24"
                  :row-height="setRowHeight"
                  :max-rows="24"
                  :vertical-compact="true"
                  :margin="[0, 0]"
                  :use-css-transforms="false">
                  <grid-item v-for="item in tempLayout"
                             :x="item.x"
                             :y="item.y"
                             :w="item.w"
                             :h="item.h"
                             :i="item.i"
                             :key="item.i"
                             :is-resizable="stepIndex?false:true"
                             :is-draggable="false"
                             style="text-align: center;line-height: 200%;"
                             :style="setLayoutItemStyle(item,stepIndex)"
                             @resized="resizedEvent(arguments,item)">
                    <edit-plan
                      ref="editPlan"
                      :stepIndex="stepIndex"
                      :scope="item"
                      :user-select-item="userSelectLayoutItem"
                      @user-select="userSelectLayoutItemHandler"
                      @send-component="userSelectComponent"
                      @user-components="userComponents"></edit-plan>
                  </grid-item>
                </grid-layout>
              </template>
              <template v-else>
                <div style="height: 100%;text-align: center;font-size: 20px;font-weight: bold;"
                     :style="{'line-height': layoutViewHeight+'px'}"
                     data-html2canvas-ignore>
                  请将右侧内置布局中的布局方式拖动到此处
                </div>
              </template>
            </div>
            <div id="layoutViewBtns" :style="{width: layoutViewWidth + 'px',height: (layoutBoxHeight * 0.18)+'px'}">
              <div id="layoutViewBtnsStyle">
                <template v-if="!stepIndex">
                  <div style="font-size: 18px;padding: 10px 0;">
                    <span>当前布局：</span>
                    <span style="color: #74bcff;font-weight: 600;"
                          v-text="userSelectLayout?(userSelectLayout.title|| '未选择'):'未选择'"></span>
                  </div>
                  <div>
                    <el-button plain type="primary" icon="el-icon-refresh"
                               :disabled="tempLayout.length?tempLayoutState:true" @click="resetTempLayout">还原布局
                    </el-button>
                    <el-button plain type="primary" icon="el-icon-delete" :disabled="tempLayout.length?false:true"
                               @click="clearTempLayout">清空布局
                    </el-button>
                  </div>
                </template>
                <template v-else-if="stepIndex==1">
                  <div class="page-wrapper-menu-operation clearfix">
                    <el-tooltip
                      v-for="(item, index) in setMenuOptions"
                      :key="index"
                      :effect="(item.isColor || item.isUpload || item.isStep)?'light':'dark'"
                      placement="top">
                      <div v-if="item.isUpload" slot="content">
                        <div v-text="item.title"></div>
                        <el-upload
                          class="upload-demo"
                          action="https://jsonplaceholder.typicode.com/posts/"
                          multiple
                          :limit="1"
                          :file-list="[]">
                          <el-button size="mini" type="primary">点击上传</el-button>
                          <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
                        </el-upload>
                      </div>
                      <div v-else-if="item.isStep" slot="content" style="text-align: center;">
                        <div v-text="item.title"></div>
                        <div style="display: inline-block" @click="stopStepClick($event)">
                          <el-input-number
                            v-model="setDefaultStep"
                            size="mini"
                            :step="2"
                            step-strictly
                            @change="stepHandleChange"
                            :min="0"
                            :max="50"
                            label="块边距"></el-input-number>
                        </div>
                      </div>
                      <div v-else-if="item.isColor" slot="content" style="text-align: center;">
                        <div v-text="item.title"></div>
                        <el-color-picker
                          v-model="setDefaultColor"
                          show-alpha
                          size="mini"
                          @change="changeColor"></el-color-picker>
                      </div>
                      <div v-else slot="content" v-text="item.title"></div>
                      <div class="menu-item menu-item-on-edit-panel"
                           :style="{padding: item.icon?'8px 12px':'2px 2px 0 2px'}"
                           @click="handleElementCommand(item)">
                        <svg-icon :icon-class="`layout-${item.icon}`"></svg-icon>
                      </div>
                    </el-tooltip>
                  </div>
                  <div>
                    <div style="display: inline-block;">
                      <span style="display: inline-block;vertical-align: middle;">主题：</span>
                      <el-switch
                        style="display: inline-block;vertical-align: middle;"
                        :class="{resetSwitchStyle:!themeColor}"
                        v-model="themeColor"
                        :active-color="themeColorList[1]"
                        :inactive-color="themeColorList[0]"
                        active-text="黑"
                        inactive-text="白">
                      </el-switch>
                    </div>
                    <el-button plain type="primary" icon="el-icon-refresh"
                               :disabled="!userSelectLayoutItem" @click="resetLayoutSet">清除所有设置
                    </el-button>
                  </div>
                </template>
                <template v-else>
                  <div>

                  </div>
                  <div>
                    <div style="display: inline-block;">
                      <span style="display: inline-block;vertical-align: middle;">主题：</span>
                      <el-switch
                        style="display: inline-block;vertical-align: middle;"
                        :class="{resetSwitchStyle:!themeColor}"
                        v-model="themeColor"
                        :active-color="themeColorList[1]"
                        :inactive-color="themeColorList[0]"
                        active-text="黑"
                        inactive-text="白">
                      </el-switch>
                    </div>
                    <el-button plain type="primary"
                               @click="previewLayout">预 览
                    </el-button>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div v-else style="height: 100%;">自定义布局</div>
        <!--<grid-layout-->
        <!--:layout.sync="customLayout"-->
        <!--:col-num="24"-->
        <!--:row-height="10"-->
        <!--:is-draggable="true"-->
        <!--:is-resizable="false"-->
        <!--:is-mirrored="false"-->
        <!--:vertical-compact="true"-->
        <!--:margin="[10, 10]"-->
        <!--:use-css-transforms="true">-->
        <!--<grid-item v-for="item in layout"-->
        <!--:x="item.x"-->
        <!--:y="item.y"-->
        <!--:w="item.w"-->
        <!--:h="item.h"-->
        <!--:i="item.i"-->
        <!--:key="item.i" style="background-color:#199ed8;text-align: center;line-height: 200%;">-->
        <!--{{item.txt}}-->
        <!--</grid-item>-->
        <!--</grid-layout>-->
      </el-col>
      <el-col :span="6" id="visualizationPlanHeight">
        <div class="layoutPlan" :style="{left: stepIndex===0?0:'120%','z-index':stepIndex===0?20:10}">
          <el-collapse v-model="activeNames" accordion style="height: 100%;">
            <el-collapse-item title="内置布局" name="1"
                              :style="{backgroundColor: activeNames==='1'?'rgb(232,244,255)':'#fff'}">
              <div :style="{height: `${rootHeight-headerHeight}px`}" class="defaultLayoutView">
                <template v-for="(layoutItem, index ) in defaultLayoutList">
                  <el-card :key="index" class="layoutItemView">
                    <div slot="header" class="clearfix">
                      <div style="text-align: center" v-text="layoutItem.title"></div>
                    </div>
                    <default-layout :config="layoutItem"></default-layout>
                  </el-card>

                  <!--<div-->
                  <!--style="padding: 10px;"-->
                  <!--draggable="true"-->
                  <!--@dragenter="dropDefaultLayout($event,layoutItem)">-->
                  <!--<grid-layout-->
                  <!--:layout.sync="layoutItem.layout"-->
                  <!--:col-num="24"-->
                  <!--:row-height="10"-->
                  <!--:is-draggable="false"-->
                  <!--:is-resizable="false"-->
                  <!--:is-mirrored="false"-->
                  <!--:vertical-compact="true"-->
                  <!--:margin="[10, 10]"-->
                  <!--:use-css-transforms="true">-->
                  <!--<grid-item v-for="item in layoutItem.layout"-->
                  <!--:x="item.x"-->
                  <!--:y="item.y"-->
                  <!--:w="item.w"-->
                  <!--:h="item.h"-->
                  <!--:i="item.i"-->
                  <!--:key="item.i"-->
                  <!--style="background-color:#199ed8;text-align: center;line-height: 200%;">-->
                  <!--{{item.txt}}-->
                  <!--</grid-item>-->
                  <!--</grid-layout>-->
                  <!--</div>-->
                </template>
              </div>
            </el-collapse-item>
            <el-collapse-item title="编辑布局" name="2"
                              :style="{backgroundColor: activeNames==='2'?'rgb(232,244,255)':'#fff'}">
              <div :style="{height: `${rootHeight-headerHeight}px`}">

              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div class="layoutPlan" :style="{left: stepIndex===1?0:'120%','z-index':stepIndex===1?20:10}">
          <function-component
            :layoutItem="userSelectLayoutItem"></function-component>
        </div>
      </el-col>
    </el-row>

    <el-dialog
      :visible.sync="dialogVisible"
      fullscreen>
      <component v-if="dialogVisible" is="visualizationTemplate" :visualizationConfig="userSelectLayout" @closeview="closeview"></component>
    </el-dialog>
  </div>
</template>

<script>
  //test
  import layoutData from '@/data/layoutData'

  import html2canvas from 'html2canvas';


  import {GridLayout, GridItem} from 'vue-grid-layout'
  import defaultLayout from './tools/components/defaultLayout'
  import editPlan from './tools/components/editPlan'
  import functionComponent from './components'
  import visualizationTemplate from '@/components/visualizationTemplate'

  export default {
    name: "visualization-root",
    components: {
      GridLayout,
      GridItem,
      defaultLayout,
      editPlan,
      functionComponent,
      visualizationTemplate,
    },
    data() {
      return {
        userInfo: {},
        activeNames: '1',
        headerHeight: 0,
        rootHeight: 0,
        customLayout: [],
        defaultLayoutList: [],
        userSelectLayout: null,
        titleList: [
          '第一步：定义基本布局',
          '第二步：设置功能组件',
          '第三步：预览看板效果',
        ],
        stepIndex: 0,
        screen: null,
        layoutBoxScale: 1,
        layoutBoxHeight: 0,
        layoutRegister: null,
        layoutChanged: null,

        //step2
        userSelectLayoutItem: null,
        menuOptions: [
          {
            title: '删除',
            icon: 'delete',
            scene: ['input','textarea','date','time','datetime','image','business'],
          }, {
            title: '字体放大',
            icon: 'txtup',
            scene: ['input','textarea','date','time','datetime'],
          }, {
            title: '字体缩小',
            icon: 'txtdown',
            scene: ['input','textarea','date','time','datetime'],
          }, {
            title: '字体加粗',
            icon: 'txtbold',
            scene: ['input','textarea','date','time','datetime'],
          }, {
            title: '字体颜色',
            icon: 'txtcolor',
            scene: ['input','textarea','date','time','datetime'],
            isColor: true,
            value: '',
          }, {
            title: '背景色',
            icon: 'bgcolor',
            scene: ['root','business'],
            isColor: true,
            value: '',
          }, {
            title: '上传图片',
            icon: 'upload',
            isUpload: true,
            scene: ['image'],
          }, {
            title: '图层上移',
            icon: 'layerup',
            scene: ['input','textarea','date','time','datetime','image'],
          }, {
            title: '图层下移',
            icon: 'layerdown',
            scene: ['input','textarea','date','time','datetime','image'],
          }, {
            title: '块边距',
            icon: 'padding',
            isStep: true,
            scene: ['root','business'],
          },{
            title: '左右居中',
            icon: 'level',
            scene: ['input','textarea','date','time','datetime'],
          },{
            title: '垂直居中',
            icon: 'vertical',
            scene: [],
          },
        ],
        layoutBGcolor: null,
        userTargetComponent: null,

        //step3
        themeColor: true,
        themeColorList: ['rgb(255,255,255)','rgb(10, 24, 40)'],

        isSaved:false,
        dialogVisible: false,
        previewLayoutTimer: '',
        saveLayoutTimer: '',
        needPreview: false,
        needSave: false,
        saveLoading: false,
        saveLoadingTxt: '',


      }
    },
    computed: {
      tempLayout() {
        return this.userSelectLayout ? (this.userSelectLayout.layout || []) : []
      },
      screenScale() {
        if (!this.screen) return 1
        return this.screen.width / this.screen.height
      },
      layoutViewHeight() {
        return this.layoutBoxHeight * 0.8
      },
      layoutViewWidth() {
        return this.layoutViewHeight * this.screenScale
      },
      setRowHeight() {
        // return Math.floor(this.layoutViewHeight/24)
        return this.layoutViewHeight / 24
      },
      tempLayoutState() {
        return false
      },
      setMenuOptions() {
        return this.menuOptions.filter(v=>{
          return v.scene.includes(this.userTargetComponent?this.userTargetComponent.type:(this.userSelectLayoutItem?'root':''))
        })
      },
      userSelectLayoutIndex(){
        if(!this.userSelectLayoutItem) return -1
        return this.tempLayout.findIndex(v=>{
          return v.i === this.userSelectLayoutItem.i
        })
      },
      setDefaultStep:{
        get(){
          return this.userTargetComponent?(this.userTargetComponent.defaultStyle.paddingTop||0):(this.userSelectLayoutItem?this.userSelectLayoutItem.padding||0:0)
        },
        set(val){
          if(this.userTargetComponent){
            this.userTargetComponent.defaultStyle.paddingTop = val
            this.userTargetComponent.defaultStyle.paddingLeft = val
            this.userTargetComponent.defaultStyle.paddingRight = val
            this.userTargetComponent.defaultStyle.paddingBottom = val
          }else if(this.userSelectLayoutItem) {
            this.userSelectLayoutItem.padding = val
          }
        },
      },
      setDefaultColor:{
        get(){
          return this.userTargetComponent?(this.userTargetComponent.defaultStyle.color || ''):(this.userSelectLayoutItem?this.userSelectLayoutItem.childBackgroundColor||'':'')
        },
        set(val){
          if(this.userTargetComponent){
            this.userTargetComponent.defaultStyle.color = val
          }else if(this.userSelectLayoutItem) {
            this.userSelectLayoutItem.childBackgroundColor = val
          }
        },
      },
      setThemeColor(){
        return this.themeColor?this.themeColorList[1]:this.themeColorList[0]
      },
    },
    created() {
      this.screen = window.screen
      // console.log(this.screen)
      this.userInfo = this.$storage.get('userInfo')
      this.httpRequests()
    },
    mounted() {
      const that = this
      const headerEl = this.$el.querySelectorAll('.el-collapse-item__header'),
        layoutBoxEL = this.$el.querySelector('#layoutBox');
      this.rootHeight = this.$el.querySelector('#visualizationPlanHeight').clientHeight
      ;[].forEach.call(headerEl, function (v) {
        that.headerHeight += v.clientHeight
      })
      this.layoutBoxScale = layoutBoxEL.clientWidth / layoutBoxEL.clientHeight
      if (this.screenScale > this.layoutBoxScale) {

      }
      this.layoutBoxHeight = layoutBoxEL.clientHeight
      this.layoutBoxWidth = layoutBoxEL.clientWidth
      console.log(this.layoutViewWidth, this.layoutBoxHeight)

    },
    beforeDestroy(){
      if(!this.isSaved){
        this.$storage.set('visualizationConfig',this.userSelectLayout)
      }
    },
    methods: {
      httpRequests() {
        if (this.userInfo.userId === '0') {
          setTimeout(_ => {
            this.defaultLayoutList = layoutData
            const tempArr = layoutData.map(v=>{
              return {
                layout: v.layout,
                name: v.name,
              }
            })
            console.log(tempArr)
            console.log(JSON.stringify(tempArr))
          }, 1000)
        }
      },
      movedEvent(i, newX, newY) {
        console.log("MOVED i=" + i + ", X=" + newX + ", Y=" + newY);
      },
      dropLayout(e) {
        if (this.stepIndex) return
        this.layoutRegister = this.layoutChanged = e.dataTransfer.getData("layout")
        this.userSelectLayout = JSON.parse(this.layoutRegister) || null
      },
      dropLayoutOver() {
        // return false
      },
      nextStep() {
        if (this.tempLayout.length) {
          this.stepIndex++
        } else {
          this.$message.error(`请先选择布局`)
        }
      },
      upStep() {
        if(this.stepIndex === 1){
          this.$confirm('退回上一步将清除本次的所有设置，请确认！', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            this.resetLayoutSet()
            this.stepIndex--
          })
        }else {
          this.stepIndex === 2 && (this.themeColor = true)
          this.stepIndex--
        }
      },
      clearTempLayout() {
        this.userSelectLayout = null
      },
      resetTempLayout() {
        this.userSelectLayout = JSON.parse(this.layoutRegister) || null
      },
      // dropDefaultLayout(e,config){
      //   console.log(e,config)
      // },
      setLayoutItemStyle(item,index) {
        const componentName = item.componentName;
        switch (componentName) {
          case 'header':
            item.backgroundColor = index?this.setThemeColor:'#b3c0d1'
            break;
          case 'main':
            item.backgroundColor = index?this.setThemeColor:'#e9eef3'
            break;
          case 'leftAside':
            item.backgroundColor = index?this.setThemeColor:'#d3dce6'
            break;
          case 'rightAside':
            item.backgroundColor = index?this.setThemeColor:'#B3C0DF'
            break;
          case 'footer':
            item.backgroundColor = index?this.setThemeColor:'#b3c0d1'
            break;
          default :
            item.backgroundColor = index?this.setThemeColor:'#b3c5d1'
            break;
        }
        return {
          backgroundColor: item.backgroundColor
        }
      },
      resizedEvent(arg, item) {
        const sourceItem = (JSON.parse(this.layoutChanged).layout || []).find(v => {
          return v.i === item.i
        });
        //console.log(arg, item, sourceItem);
        if (item.w != sourceItem.w) {
          this.userSelectLayout.layout.forEach(v => {
            if (v.i !== item.i && v.x === sourceItem.w) {
              v.x = item.w
            }
          })
        }
        if (item.h > sourceItem.h) {
          let layoutHList = this.numToList(24)
          this.userSelectLayout.layout.forEach(v => {
            if (v.i !== item.i) {
              if (v.x === item.x || (v.x < item.x && (v.x + v.w) > item.x) || ((v.x - item.x) > 0 && (v.x - item.x) < item.w)) {
                for (let i = 0; i < v.h; i++) {
                  layoutHList.splice((v.y + i), 1, null)
                }
              }
            }
          })
          //console.log(layoutHList, 'layoutHList')
          if (layoutHList.length > 24) {
            this.userSelectLayout.layout.forEach(v => {
              if (v.i === item.i) {
                v.h -= layoutHList.length - 24
              }
            })
            this.userSelectLayout = JSON.parse(JSON.stringify(this.userSelectLayout))
          }
        }
        this.layoutChanged = JSON.stringify(this.userSelectLayout)
      },
      numToList(num) {
        const result = []
        for (let i = 0; i < num; i++) {
          result.push(i)
        }
        return result
      },
      resetLayoutStore() {
        this.userSelectLayout = null
        this.layoutRegister = null
        this.layoutChanged = null
      },

      //step2
      resetLayoutSet() {
        this.userSelectLayoutItem = null
        ;(this.$refs['editPlan'] || []).forEach(v=>{
          v.resetSelectComponetns && v.resetSelectComponetns()
        })
      },
      userSelectLayoutItemHandler(item) {
        this.userSelectLayoutItem = item
      },
      handleElementCommand(item) {
        const icon = item.icon
        switch (icon){
          case 'delete':
            this.$refs['editPlan'][this.userSelectLayoutIndex].deleteUserSelectComponents(this.userTargetComponent.uuid)
            break;
          case 'txtup':
            this.userTargetComponent.defaultStyle.fontSize += 1
            break;
          case 'txtdown':
            if(this.userTargetComponent.defaultStyle.fontSize > 12){
              this.userTargetComponent.defaultStyle.fontSize -= 1
            }
            break;
          case 'txtbold':
            if(this.userTargetComponent.defaultStyle.fontWeight >= 900){
              this.userTargetComponent.defaultStyle.fontWeight = 300
            }else {
              this.userTargetComponent.defaultStyle.fontWeight += 100
            }
            break;
          case 'txtcolor':
            break;
          case 'bgcolor':
            break;
          case 'upload':
            break;
          case 'layerup':
            this.userTargetComponent.defaultStyle.zIndex += 1
            break;
          case 'layerdown':
            this.userTargetComponent.defaultStyle.zIndex -= 1
            break;
          case 'padding':
            break;
          case 'level':
            this.userTargetComponent.defaultStyle.textAlign = this.userTargetComponent.defaultStyle.textAlign === 'center' ? 'left':'center'
            break;
          case 'vertical':
            break;
        }
      },
      changeColor(value){
        if(this.userTargetComponent){
          this.userTargetComponent.defaultStyle.color = value
        }else if(this.userSelectLayoutItem){
          this.userSelectLayoutItem.childBackgroundColor = value
        }
      },
      userSelectComponent(data) {
        // console.log(data, 'userSelectComponent')
        this.userTargetComponent = data[0] || null
      },
      userComponents(data){
        this.userSelectLayout.layout.find(v=>{
          if(v.i === data.layoutId){
            v.userComponents = JSON.parse(JSON.stringify(data.components))
            return true
          }
        })
        if(this.needPreview){
          clearTimeout(this.previewLayoutTimer)
          this.previewLayoutTimer = setTimeout(_=>{
            this.needPreview = false
            this.dialogVisible = true
          })
        }
        if(this.needSave){
          clearTimeout(this.saveLayoutTimer)
          this.saveLayoutTimer = setTimeout(_=>{
            this.needSave = false
            //保存
            this.httpSaveLayout()
          })
        }
      },
      previewLayout(){
        this.needPreview = true
        this.needSave = false
        ;(this.$refs['editPlan'] || []).forEach(v=>{
          v.getSelectComponents && v.getSelectComponents()
        })
      },
      saveLayout(){
        this.needSave = true
        this.needPreview = false
        ;(this.$refs['editPlan'] || []).forEach(v=>{
          v.getSelectComponents && v.getSelectComponents()
        })
      },
      httpSaveLayout(){
        console.log(this.userSelectLayout,this.layoutViewHeight,this.layoutViewWidth)
        console.log(JSON.stringify(this.userSelectLayout.layout))
        this.saveLoadingTxt = '生成缩略图...'
        this.saveLoading = true
        setTimeout(_=>{
          this.layoutViewThumbnail()
        },1000)
      },
      layoutViewThumbnail(){
        let url = ''
        const el = this.$el.querySelector('#layoutView')
        if(el){
          html2canvas(el,{
            width: el.offsetWidth,
            height: el.offsetHeight,
            scale: 0.5
          }).then(canvas=>{
            url = canvas.toDataURL()
            this.saveLoadingTxt = '保存设置...'
            console.log(url)
            setTimeout(_=>{
              this.saveLoading = false
            },10000)
            //接下来：
            //1.此处上传图片，格式为base64编码之后的字符串

            //2.图片上传成功后，保存布局配置信息，保存后给出对应提示

          }).catch(err=>{
            console.log(err)
          })
        }
      },
      stepHandleChange(currentValue, oldValue){
        if(this.userTargetComponent){
          this.userTargetComponent.defaultStyle.paddingTop = currentValue
          this.userTargetComponent.defaultStyle.paddingLeft = currentValue
          this.userTargetComponent.defaultStyle.paddingRight = currentValue
          this.userTargetComponent.defaultStyle.paddingBottom = currentValue
        }else if(this.userSelectLayoutItem){
          console.log(this.userSelectLayoutItem)
          this.userSelectLayoutItem.padding = currentValue
        }
      },
      stopStepClick(e){
        e.stopPropagation()
        e.preventDefault()
      },

      closeview(){
        this.dialogVisible = false
      },
    },
    watch: {
      activeNames() {
        this.resetLayoutStore()
      },
      setThemeColor(){
        ;(this.$refs['editPlan'] || []).forEach(v=>{
          v.changeComponentColor && v.changeComponentColor()
        })
      },
    },
  }
</script>

<style lang="scss" rel="text/css">
  .visualization {
    height: 100%;
    #visualizationPlanHeight {
      height: 100%;
      position: relative;
      .layoutPlan {
        position: absolute;
        top: 0;
        left: 120%;
        width: 100%;
        height: 100%;
        transition: left 600ms ease-out;
        border: 1px solid #e6ebf5;
        overflow: hidden;
        background-color: #fff;
      }
    }
    .el-collapse-item__header {
      background-color: transparent;
      padding-left: 40%;
      font-weight: bold;
      font-size: 1em;
    }
    .el-collapse-item__wrap {
      background-color: transparent;
    }
    .el-collapse-item__content {
      padding-bottom: 0;
    }
    .defaultLayoutView {
      overflow: auto;
      margin: 0 5px;
      .layoutItemView {
        margin-bottom: 10px;
        .el-card__header {
          padding: 5px 10px;
          font-size: 16px;
          font-weight: 600;
        }
        .el-card__body {
          padding: 5px 10px;
          cursor: move;
        }
      }
    }
    .customLayoutHeader {
      display: flex;
      padding: 10px;
      .leftArrow {
        flex: 1;
      }
      .headerTxt {
        position: relative;
        flex: 3;
        text-align: center;
        overflow: hidden;
        .titleBox {
          position: absolute;
          top: 0;
          width: 300%;
          height: 100%;
          transition: left 800ms;
          .titleView {
            float: left;
            height: 100%;
            line-height: 2.2;
            transition: opacity 400ms;
            font-size: 20px;
            font-weight: bold;
          }
        }
      }
      .rightArrow {
        flex: 1;
        text-align: right;
      }
    }
    #layoutBox {
      padding: 0 10px 0 10px;
      height: calc(100% - 56px);
      overflow: auto;
      #layoutView {
        margin: 0 auto;
        background-color: #d9d9d9;
      }
      #layoutViewBtns {
        margin: 0 auto;
        #layoutViewBtnsStyle {
          height: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          .page-wrapper-menu-operation {
            border-radius: 4px;
            background-color: rgb(233, 238, 243);
            .menu-item {
              float: left;
              cursor: pointer;
              &:hover {
                background: #E4E4E4;
                color: #909399;
              }
            }
          }
          .resetSwitchStyle {
            .el-switch__core {
              border-color: rgb(10,24,40) !important;
            }
            .el-switch__core::after {
              background-color: rgb(10,24,40) !important;
            }
          }
        }
      }
    }
    .layoutCover {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.4);
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      .layoutCoverTxt {
        color: #030303;
        font-weight: 600;
      }
    }
    .el-dialog {
      border-radius: 0 !important;
    }
    .el-dialog__header {
      padding: 0 !important;
      .el-icon-close:before {
        color: #000000;
      }
    }
    .el-dialog__body {
      height: 100%;
      position: relative;
    }
    .el-loading-text {
      font-size: 16px !important;
      color: #000000 !important;
      font-weight: 400 !important;
    }
  }
</style>
