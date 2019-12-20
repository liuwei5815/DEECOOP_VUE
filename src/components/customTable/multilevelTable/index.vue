<template>
  <div
    class="myCoustomTable resetCoustomTableStyle"
    :class="setTableClass"
    v-loading="setTableLoading">
    <table-filter
      v-if="setShowTableSet && setTableSetMode === 'outside' && !layer"
      :headerList="setColConfigs"
      :tableSwitchState="setTableSwitch"
      :storeId="pageId"
      :componentId="setComponentId"
      @checked-list="checkedList"
      @checked-height="checkedHeight"></table-filter>
    <div :style="{height: setTableHeight}">
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        status-icon
        :style="{height: !layer?'100%':'auto'}"
        @submit.native.prevent>
        <el-table ref="baseTable"
                  :data="tableData[dataName]"
                  :stripe="setExpand?(setExpandColumnWidth === '50'):true"
                  highlight-current-row
                  :border="setTableBorder"
                  current-row-key="_internalId"
                  tooltip-effect="dark"
                  :style="{width: setRootWidth}"
                  :height="!layer?'100%':null"
                  fit
                  :show-header="setShowHeader"
                  row-key="_internalId"
                  :show-summary="setSysSummary"
                  :default-expand-all="setShowExpandBtn?false:(setExpand && setExpandMode === 'all')"
                  :header-row-style="setHeaderRowStyle"
                  :row-style="setRowStyle"
                  :row-class-name="setRowClass"
                  :cell-style="setCellStyle"
                  :header-cell-style="setHeaderCellStyle"
                  :header-row-class-name="setHeaderRowClass"
                  :default-sort="setSortableConfig['default-sort']"
                  @select="selectItem"
                  @select-all="selectAllItem"
                  @selection-change="selectionChange"
                  @expand-change="expandChange"
                  @sort-change="sortChange"
                  @row-click="rowClick"
                  @row-dblclick="rowDblclick">
          <template v-if="setExpand">
            <el-table-column type="expand" :width="setExpandColumnWidth" align="center">
              <template slot-scope="props">
                <!--<template v-if="tableConfigList[layer+1]&&(tableConfigList[layer+1].apiObj || (props.row.children && props.row.children.length))">-->
                  <multilevel-table
                    ref="multilevelTable"
                    :tableConfigList="tableConfigList"
                    :layer="layer+1"
                    :internalRuleId="props.row._internalId"
                    :internalGuid="setGuid"
                    :parentData="[props.row]"
                    :rowChain="setRowChain"
                    :tableSwitchBaseKey="columnSwitchBaseKey"
                    @databridge="databridge"
                    @callmethod="callParentMethod"
                    @table-dolayout="tableDoLayout"
                    @narrow-row="narrowRow"></multilevel-table>
                <!--</template>-->
              </template>
            </el-table-column>
          </template>
          <template v-if="setShowCheckBox">
            <el-table-column
              type="selection"
              :fixed="setFixedState"
              :selectable="selectable"
              width="55"
              align="center"></el-table-column>
          </template>
          <template v-if="setShowIndex">
            <el-table-column type="index" :index="indexMethod" :fixed="setFixedState" label="序号" width="50"
                             align="center"></el-table-column>
          </template>
          <template v-for="(colConfig,infoIndex) in setTitleList">
            <slot v-if="colConfig.slot" :name="colConfig.slot"
                  :fixed="setFixedList[infoIndex]"></slot>
            <template v-else-if="Array.isArray(colConfig.component)">
              <el-table-column
                show-overflow-tooltip
                v-bind="colConfig"
                :key="infoIndex"
                :fixed="setFixedList[infoIndex]"
                :min-width="colConfig.width || setColumnWidth[colConfig.prop] || null"
                align="center">
                <template slot="header" slot-scope="scope">
                  <div
                    v-auto-tran="{state:colConfig._isShow,index:infoIndex,isComponent: true,label:colConfig.label,prop:colConfig.prop}">
                    {{colConfig.label}}
                  </div>
                </template>
                <template slot-scope="scope">
                  <div
                    v-if="colConfig.componentName === 'button'"
                    v-button-width="colConfig"
                    class="btnBox"
                    style="display: flex; white-space: normal;flex-wrap: wrap;"
                    :style="{'justify-content':setColumnWidth[colConfig.prop]?'space-between':'center'}">
                    <el-button
                      v-for="(item, cIndex) in colConfig.component"
                      :key="cIndex"
                      v-if="(item.editBtns_isShow===undefined?true:item.editBtns_isShow) && item.rowState?setButtonState(scope.$index,scope.row,item):true"
                      type="text"
                      :style="setButtonStyle || {height: '24px',width:'46px',padding: 0,margin: 0,'font-size': '12px','max-width': '46px'}"
                      @click="item.method(scope.row,scope.$index,scope)">{{item.name}}
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </template>
            <component
              v-else-if="typeof colConfig.component === 'object' && !Array.isArray(colConfig.component)"
              :key="infoIndex"
              :is="colConfig.component"
              :col-config="colConfig"
              :fixed="setFixedList[infoIndex]"></component>
            <template v-else>
              <el-table-column
                v-if="colConfig._isShow?true:!(setTableSetMode === 'outside')"
                show-overflow-tooltip
                :label="colConfig.label"
                :prop="colConfig.prop || colConfig.columnIndex"
                :key="infoIndex"
                :width="colConfig._isShow?(colConfig.width || constantWidth[colConfig.componentName] || 'auto'):setTableColumnState?'20':''"
                :min-width="colConfig._isShow?(colConfig.width || colConfig['min-width'] || constantWidth[colConfig.componentName] || contentWidthList[infoIndex] || 'none'):''"
                :sortable="(setSortableConfig[colConfig.prop || colConfig.columnIndex] && colConfig._isShow)?true:false"
                :sort-method="(setSortableConfig[colConfig.prop || colConfig.columnIndex]&&setSortableConfig[colConfig.prop||colConfig.columnIndex]['sort-method'])?setSortableConfig[colConfig.prop || colConfig.columnIndex]['sort-method']:null"
                :sort-by="(setSortableConfig[colConfig.prop || colConfig.columnIndex]&&setSortableConfig[colConfig.prop || colConfig.columnIndex]['sort-by'])?setSortableConfig[colConfig.prop || colConfig.columnIndex]['sort-by']:null"
                :fixed="setFixedList[infoIndex]"
                align="center">
                <template slot="header" slot-scope="scope">
                  <span
                    v-auto-tran="{state:colConfig._isShow,index:infoIndex,label:colConfig.label,prop:colConfig.prop}"
                    v-custom-table-switch="{config:colConfig,index:infoIndex,showSwitch:setTableColumnState}"
                    :style="{display: colConfig._isShow?'inline-flex':'none','white-space': 'nowrap'}" v-text="colConfig.label"></span>
                </template>
                <template slot-scope="scope">
                  <core-index v-show="colConfig._isShow?true:setTableSetMode === 'outside'" :scope="scope" :info-index="infoIndex" :col-config="colConfig" :runTime="'multilevel'"></core-index>
                  <!--<template v-if="colConfig.mergeTitles && colConfig.mergeTitles.length">-->
                    <!--<template v-for="(childColconfig,cIndex) in colConfig.mergeTitles">-->
                      <!--<template v-if="childColconfig.componentName">-->
                        <!--<core-index :scope="scope" :child-colconfig="childColconfig" :info-index="infoIndex" :c-index="cIndex" :run-time="'multilevel'"></core-index>-->
                        <!--&lt;!&ndash;<template v-if="childColconfig.componentName === 'input'">&ndash;&gt;-->
                          <!--&lt;!&ndash;<template v-if="childColconfig._cellConfig.asyn">&ndash;&gt;-->
                            <!--&lt;!&ndash;<el-form-item&ndash;&gt;-->
                              <!--&lt;!&ndash;:prop="'tableData.'+scope.$index+'.'+childColconfig.prop"&ndash;&gt;-->
                              <!--&lt;!&ndash;:rules="baseRules(scope.$index,scope.row,childColconfig)"&ndash;&gt;-->
                              <!--&lt;!&ndash;:inline-message="true"&ndash;&gt;-->
                              <!--&lt;!&ndash;:key="cIndex">&ndash;&gt;-->
                              <!--&lt;!&ndash;<div style="display: inline-block" @click.stop="clickStop" @dblclick.stop="clickStop">&ndash;&gt;-->
                                <!--&lt;!&ndash;<table-autocomplete :scope="scope" :child-colconfig="childColconfig"></table-autocomplete>&ndash;&gt;-->
                              <!--&lt;!&ndash;</div>&ndash;&gt;-->
                            <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
                          <!--&lt;!&ndash;</template>&ndash;&gt;-->
                          <!--&lt;!&ndash;<template v-else>&ndash;&gt;-->
                            <!--&lt;!&ndash;<el-form-item&ndash;&gt;-->
                              <!--&lt;!&ndash;:prop="'tableData.'+scope.$index+'.'+childColconfig.prop"&ndash;&gt;-->
                              <!--&lt;!&ndash;:rules="baseRules(scope.$index,scope.row,childColconfig)"&ndash;&gt;-->
                              <!--&lt;!&ndash;:inline-message="true"&ndash;&gt;-->
                              <!--&lt;!&ndash;:key="cIndex">&ndash;&gt;-->
                              <!--&lt;!&ndash;<div style="display: inline-block" @click.stop="clickStop" @dblclick.stop="clickStop">&ndash;&gt;-->
                                <!--&lt;!&ndash;<table-input :scope="scope" :child-colconfig="childColconfig"></table-input>&ndash;&gt;-->
                              <!--&lt;!&ndash;</div>&ndash;&gt;-->
                            <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
                          <!--&lt;!&ndash;</template>&ndash;&gt;-->
                        <!--&lt;!&ndash;</template>&ndash;&gt;-->
                        <!--&lt;!&ndash;<template v-else-if="childColconfig.componentName === 'date'">&ndash;&gt;-->
                          <!--&lt;!&ndash;<el-form-item&ndash;&gt;-->
                            <!--&lt;!&ndash;:prop="'tableData.'+scope.$index+'.'+childColconfig.prop"&ndash;&gt;-->
                            <!--&lt;!&ndash;:rules="baseRules(scope.$index,scope.row,childColconfig)"&ndash;&gt;-->
                            <!--&lt;!&ndash;:inline-message="true"&ndash;&gt;-->
                            <!--&lt;!&ndash;:key="scope.row._internalId">&ndash;&gt;-->
                            <!--&lt;!&ndash;<div style="display: inline-block" @click.stop="clickStop" @dblclick.stop="clickStop">&ndash;&gt;-->
                              <!--&lt;!&ndash;<table-date-picker :scope="scope" :child-colconfig="childColconfig"></table-date-picker>&ndash;&gt;-->
                            <!--&lt;!&ndash;</div>&ndash;&gt;-->
                          <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
                        <!--&lt;!&ndash;</template>&ndash;&gt;-->
                        <!--&lt;!&ndash;<template v-else-if="childColconfig.componentName === 'time'">&ndash;&gt;-->
                          <!--&lt;!&ndash;<el-form-item&ndash;&gt;-->
                            <!--&lt;!&ndash;:prop="'tableData.'+scope.$index+'.'+childColconfig.prop"&ndash;&gt;-->
                            <!--&lt;!&ndash;:rules="baseRules(scope.$index,scope.row,childColconfig)"&ndash;&gt;-->
                            <!--&lt;!&ndash;:inline-message="true"&ndash;&gt;-->
                            <!--&lt;!&ndash;:key="scope.row._internalId">&ndash;&gt;-->
                            <!--&lt;!&ndash;<div style="display: inline-block" @click.stop="clickStop" @dblclick.stop="clickStop">&ndash;&gt;-->
                              <!--&lt;!&ndash;<table-time-picker :scope="scope" :child-colconfig="childColconfig"></table-time-picker>&ndash;&gt;-->
                            <!--&lt;!&ndash;</div>&ndash;&gt;-->
                          <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
                        <!--&lt;!&ndash;</template>&ndash;&gt;-->
                        <!--&lt;!&ndash;<template v-else-if="childColconfig.componentName === 'select'">&ndash;&gt;-->
                          <!--&lt;!&ndash;<el-form-item&ndash;&gt;-->
                            <!--&lt;!&ndash;:prop="'tableData.'+scope.$index+'.'+childColconfig.prop"&ndash;&gt;-->
                            <!--&lt;!&ndash;:rules="baseRules(scope.$index,scope.row,childColconfig)"&ndash;&gt;-->
                            <!--&lt;!&ndash;:inline-message="true"&ndash;&gt;-->
                            <!--&lt;!&ndash;:key="scope.row._internalId">&ndash;&gt;-->
                            <!--&lt;!&ndash;<div style="display: inline-block" @click.stop="clickStop" @dblclick.stop="clickStop">&ndash;&gt;-->
                              <!--&lt;!&ndash;<table-select :scope="scope" :child-colconfig="childColconfig"></table-select>&ndash;&gt;-->
                            <!--&lt;!&ndash;</div>&ndash;&gt;-->
                          <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
                        <!--&lt;!&ndash;</template>&ndash;&gt;-->
                        <!--&lt;!&ndash;<template v-else-if="childColconfig.componentName === 'cascader'">&ndash;&gt;-->
                          <!--&lt;!&ndash;<el-form-item&ndash;&gt;-->
                            <!--&lt;!&ndash;:prop="'tableData.'+scope.$index+'.'+childColconfig.prop"&ndash;&gt;-->
                            <!--&lt;!&ndash;:rules="baseRules(scope.$index,scope.row,childColconfig)"&ndash;&gt;-->
                            <!--&lt;!&ndash;:inline-message="true"&ndash;&gt;-->
                            <!--&lt;!&ndash;:key="scope.row._internalId">&ndash;&gt;-->
                            <!--&lt;!&ndash;<div style="display: inline-block" @click.stop="clickStop" @dblclick.stop="clickStop">&ndash;&gt;-->
                              <!--&lt;!&ndash;<table-cascader :scope="scope" :child-colconfig="childColconfig"></table-cascader>&ndash;&gt;-->
                            <!--&lt;!&ndash;</div>&ndash;&gt;-->
                          <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
                        <!--&lt;!&ndash;</template>&ndash;&gt;-->
                        <!--&lt;!&ndash;<template v-else-if="childColconfig.componentName === 'switch'">&ndash;&gt;-->
                          <!--&lt;!&ndash;<div @click.stop="clickStop" @dblclick.stop="clickStop">&ndash;&gt;-->
                            <!--&lt;!&ndash;<div&ndash;&gt;-->
                              <!--&lt;!&ndash;style="display: inline-block;"&ndash;&gt;-->
                              <!--&lt;!&ndash;v-if="!childColconfig._cellConfig.hideTitle"&ndash;&gt;-->
                              <!--&lt;!&ndash;:style="childColconfig._cellConfig.titleStyle || {}"&ndash;&gt;-->
                              <!--&lt;!&ndash;v-cloak>&ndash;&gt;-->
                              <!--&lt;!&ndash;{{childColconfig.label+':'}}&nbsp&ndash;&gt;-->
                            <!--&lt;!&ndash;</div>&ndash;&gt;-->
                            <!--&lt;!&ndash;<div style="display: inline-block">&ndash;&gt;-->
                              <!--&lt;!&ndash;<table-switch :scope="scope" :child-colconfig="childColconfig"></table-switch>&ndash;&gt;-->
                            <!--&lt;!&ndash;</div>&ndash;&gt;-->
                          <!--&lt;!&ndash;</div>&ndash;&gt;-->
                        <!--&lt;!&ndash;</template>&ndash;&gt;-->
                        <!--&lt;!&ndash;<template v-else-if="childColconfig.componentName === 'dateTime'">&ndash;&gt;-->
                          <!--&lt;!&ndash;<el-form-item&ndash;&gt;-->
                            <!--&lt;!&ndash;:prop="'tableData.'+scope.$index+'.'+childColconfig.prop"&ndash;&gt;-->
                            <!--&lt;!&ndash;:rules="baseRules(scope.$index,scope.row,childColconfig)"&ndash;&gt;-->
                            <!--&lt;!&ndash;:inline-message="true"&ndash;&gt;-->
                            <!--&lt;!&ndash;:key="scope.row._internalId">&ndash;&gt;-->
                            <!--&lt;!&ndash;<div style="display: inline-block" @click.stop="clickStop" @dblclick.stop="clickStop">&ndash;&gt;-->
                              <!--&lt;!&ndash;<table-date-time :scope="scope" :child-colconfig="childColconfig"></table-date-time>&ndash;&gt;-->
                            <!--&lt;!&ndash;</div>&ndash;&gt;-->
                          <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
                        <!--&lt;!&ndash;</template>&ndash;&gt;-->
                        <!--&lt;!&ndash;<template v-else-if="childColconfig.componentName === 'inputNumber'">&ndash;&gt;-->
                          <!--&lt;!&ndash;<el-form-item&ndash;&gt;-->
                            <!--&lt;!&ndash;:prop="'tableData.'+scope.$index+'.'+childColconfig.prop"&ndash;&gt;-->
                            <!--&lt;!&ndash;:rules="baseRules(scope.$index,scope.row,childColconfig)"&ndash;&gt;-->
                            <!--&lt;!&ndash;:inline-message="true"&ndash;&gt;-->
                            <!--&lt;!&ndash;:key="scope.row._internalId">&ndash;&gt;-->
                            <!--&lt;!&ndash;<div style="display: inline-block" @click.stop="clickStop" @dblclick.stop="clickStop">&ndash;&gt;-->
                              <!--&lt;!&ndash;<table-input-number :scope="scope" :child-colconfig="childColconfig"></table-input-number>&ndash;&gt;-->
                            <!--&lt;!&ndash;</div>&ndash;&gt;-->
                          <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
                        <!--&lt;!&ndash;</template>&ndash;&gt;-->
                        <!--&lt;!&ndash;<template v-else-if="childColconfig.componentName === 'steps'">&ndash;&gt;-->
                          <!--&lt;!&ndash;<div class="resetElStepStyle" :key="cIndex" @click.stop="clickStop" @dblclick.stop="clickStop">&ndash;&gt;-->
                            <!--&lt;!&ndash;<div v-if="!childColconfig._cellConfig.hideTitle"&ndash;&gt;-->
                                 <!--&lt;!&ndash;:style="childColconfig._cellConfig.titleStyle || {}" v-cloak>&ndash;&gt;-->
                              <!--&lt;!&ndash;{{childColconfig.label+':'}}&nbsp&ndash;&gt;-->
                            <!--&lt;!&ndash;</div>&ndash;&gt;-->
                            <!--&lt;!&ndash;<div>&ndash;&gt;-->
                              <!--&lt;!&ndash;<custom-steps :scope="scope" :child-colconfig="childColconfig"></custom-steps>&ndash;&gt;-->
                            <!--&lt;!&ndash;</div>&ndash;&gt;-->
                          <!--&lt;!&ndash;</div>&ndash;&gt;-->
                        <!--&lt;!&ndash;</template>&ndash;&gt;-->
                        <!--&lt;!&ndash;<template v-else-if="childColconfig.componentName === 'progress'">&ndash;&gt;-->
                          <!--&lt;!&ndash;<div style="text-align: left;" :key="cIndex" @click.stop="clickStop" @dblclick.stop="clickStop">&ndash;&gt;-->
                            <!--&lt;!&ndash;<div v-if="!childColconfig._cellConfig.hideTitle" style="display: inline-block;"&ndash;&gt;-->
                                 <!--&lt;!&ndash;:style="[{'line-height': childColconfig._cellConfig.componentConfig['stroke-width']>23?2:''},childColconfig._cellConfig.titleStyle||(setColumnGlobalStyle?setColumnGlobalStyle.titleStyle:{})||{}]"&ndash;&gt;-->
                                 <!--&lt;!&ndash;v-cloak>&ndash;&gt;-->
                              <!--&lt;!&ndash;{{childColconfig.label+':'+(childColconfig._cellConfig.componentConfig.showInitValue?scope.row[childColconfig.prop]:'')}}&nbsp&ndash;&gt;-->
                            <!--&lt;!&ndash;</div>&ndash;&gt;-->
                            <!--&lt;!&ndash;<div&ndash;&gt;-->
                              <!--&lt;!&ndash;class="resetProgressStyle"&ndash;&gt;-->
                              <!--&lt;!&ndash;style="display: inline-block;overflow: hidden;vertical-align: middle;"&ndash;&gt;-->
                              <!--&lt;!&ndash;:style="{width: (childColconfig._cellConfig.componentConfig.width || constantWidth[childColconfig.componentName]) + 'px'}">&ndash;&gt;-->
                              <!--&lt;!&ndash;<table-progress :scope="scope" :child-colconfig="childColconfig"></table-progress>&ndash;&gt;-->
                            <!--&lt;!&ndash;</div>&ndash;&gt;-->
                          <!--&lt;!&ndash;</div>&ndash;&gt;-->
                        <!--&lt;!&ndash;</template>&ndash;&gt;-->
                        <!--&lt;!&ndash;<template v-else-if="childColconfig.componentName === 'upload'">&ndash;&gt;-->
                          <!--&lt;!&ndash;<div style="display: inline-block" @click.stop="clickStop" @dblclick.stop="clickStop">&ndash;&gt;-->
                            <!--&lt;!&ndash;<table-upload :scope="scope" :child-colconfig="childColconfig"></table-upload>&ndash;&gt;-->
                          <!--&lt;!&ndash;</div>&ndash;&gt;-->
                        <!--&lt;!&ndash;</template>&ndash;&gt;-->
                        <!--&lt;!&ndash;<template v-else-if="childColconfig.componentName === 'tag'">&ndash;&gt;-->
                          <!--&lt;!&ndash;<div style="display: inline-block" @click.stop="clickStop" @dblclick.stop="clickStop">&ndash;&gt;-->
                            <!--&lt;!&ndash;<table-tag :scope="scope" :child-colconfig="childColconfig"></table-tag>&ndash;&gt;-->
                          <!--&lt;!&ndash;</div>&ndash;&gt;-->
                        <!--&lt;!&ndash;</template>&ndash;&gt;-->
                        <!--&lt;!&ndash;<template v-else-if="childColconfig.componentName === 'button'">&ndash;&gt;-->
                          <!--&lt;!&ndash;<div&ndash;&gt;-->
                            <!--&lt;!&ndash;style="display: inline-block;"&ndash;&gt;-->
                            <!--&lt;!&ndash;@click.stop="clickStop"&ndash;&gt;-->
                            <!--&lt;!&ndash;@dblclick.stop="clickStop"&ndash;&gt;-->
                            <!--&lt;!&ndash;v-if="!childColconfig._cellConfig.hideTitle"&ndash;&gt;-->
                            <!--&lt;!&ndash;:style="childColconfig._cellConfig.titleStyle || {}"&ndash;&gt;-->
                            <!--&lt;!&ndash;v-cloak>&ndash;&gt;-->
                            <!--&lt;!&ndash;{{childColconfig.label+':'}}&nbsp&ndash;&gt;-->
                          <!--&lt;!&ndash;</div>&ndash;&gt;-->
                          <!--&lt;!&ndash;<div style="display: inline-block;" @click.stop="clickStop" @dblclick.stop="clickStop">&ndash;&gt;-->
                            <!--&lt;!&ndash;<table-button :scope="scope" :child-colconfig="childColconfig"></table-button>&ndash;&gt;-->
                          <!--&lt;!&ndash;</div>&ndash;&gt;-->
                        <!--&lt;!&ndash;</template>&ndash;&gt;-->
                        <!--&lt;!&ndash;<template v-else>&ndash;&gt;-->
                          <!--&lt;!&ndash;<span style="margin-left: 10px" v-text="scope.row[childColconfig.prop]" :key="cIndex"></span>&ndash;&gt;-->
                        <!--&lt;!&ndash;</template>&ndash;&gt;-->
                      <!--</template>-->
                      <!--<template v-else>-->
                        <!--<content-txt :scope="scope" :child-colconfig="childColconfig" :info-index="infoIndex" :c-index="cIndex" :col-config="colConfig" :runTime="'multilevel'"></content-txt>-->
                        <!--&lt;!&ndash;<div&ndash;&gt;-->
                          <!--&lt;!&ndash;:style="{'text-align': (childColconfig._cellConfig&&childColconfig._cellConfig.hideTitle)?'center':'left'}"&ndash;&gt;-->
                          <!--&lt;!&ndash;:key="cIndex"&ndash;&gt;-->
                          <!--&lt;!&ndash;@click.stop="clickStop"&ndash;&gt;-->
                          <!--&lt;!&ndash;@dblclick.stop="clickStop">&ndash;&gt;-->
                          <!--&lt;!&ndash;<template v-if="childColconfig._cellConfig">&ndash;&gt;-->
                            <!--&lt;!&ndash;<template v-if="!childColconfig._cellConfig.hideTitle">&ndash;&gt;-->
                              <!--&lt;!&ndash;<span&ndash;&gt;-->
                                <!--&lt;!&ndash;v-reset-content-width="{index:infoIndex,cIndex,colConfig,childColconfig,rowIndex:scope.$index,isTitle:true}"&ndash;&gt;-->
                                <!--&lt;!&ndash;:style="[childColconfig._cellConfig.titleStyle || (setColumnGlobalStyle?setColumnGlobalStyle.titleStyle:{}),setMiddleValue[infoIndex]?setMiddleValue[infoIndex].title:{}]"&ndash;&gt;-->
                                <!--&lt;!&ndash;v-text="childColconfig.label+':'">&nbsp</span>&ndash;&gt;-->
                            <!--&lt;!&ndash;</template>&ndash;&gt;-->
                          <!--&lt;!&ndash;</template>&ndash;&gt;-->
                          <!--&lt;!&ndash;<template v-else>&ndash;&gt;-->
                            <!--&lt;!&ndash;<span&ndash;&gt;-->
                              <!--&lt;!&ndash;v-reset-content-width="{index:infoIndex,cIndex,colConfig,childColconfig,rowIndex:scope.$index,isTitle:true}"&ndash;&gt;-->
                              <!--&lt;!&ndash;:style="setMiddleValue[infoIndex]?setMiddleValue[infoIndex].title:{}"&ndash;&gt;-->
                              <!--&lt;!&ndash;v-text="childColconfig.label+':'">&nbsp</span>&ndash;&gt;-->
                          <!--&lt;!&ndash;</template>&ndash;&gt;-->
                          <!--&lt;!&ndash;<template v-if="childColconfig._cellConfig && childColconfig._cellConfig.events">&ndash;&gt;-->
                            <!--&lt;!&ndash;<span&ndash;&gt;-->
                              <!--&lt;!&ndash;v-reset-content-width="{index:infoIndex,cIndex,colConfig,childColconfig,rowIndex:scope.$index,isTitle:false}"&ndash;&gt;-->
                              <!--&lt;!&ndash;:style="[childColconfig._cellConfig.bodyStyle || (setColumnGlobalStyle?setColumnGlobalStyle.bodyStyle:{}),setMiddleValue[infoIndex]?setMiddleValue[infoIndex].body:{}]">&ndash;&gt;-->
                              <!--&lt;!&ndash;<a v-text="scope.row[childColconfig.prop]"&ndash;&gt;-->
                                 <!--&lt;!&ndash;@click="mergeColumnEvents(childColconfig,scope)"></a>&ndash;&gt;-->
                            <!--&lt;!&ndash;</span>&ndash;&gt;-->
                          <!--&lt;!&ndash;</template>&ndash;&gt;-->
                          <!--&lt;!&ndash;<template v-else>&ndash;&gt;-->
                            <!--&lt;!&ndash;<span&ndash;&gt;-->
                              <!--&lt;!&ndash;v-reset-content-width="{index:infoIndex,cIndex,colConfig,childColconfig,rowIndex:scope.$index,isTitle:false}"&ndash;&gt;-->
                              <!--&lt;!&ndash;:style="[childColconfig._cellConfig?childColconfig._cellConfig.bodyStyle:{}, setColumnGlobalStyle?setColumnGlobalStyle.bodyStyle:{},setMiddleValue[infoIndex]?setMiddleValue[infoIndex].body:{}]"&ndash;&gt;-->
                              <!--&lt;!&ndash;:class="{resetContent:setMiddleValue[infoIndex],ellipsis:setMiddleValue[infoIndex]?isEllipsis(scope.row[childColconfig.prop || childColconfig.columnIndex],parseInt(setMiddleValue[infoIndex].body.width)):false}"&ndash;&gt;-->
                              <!--&lt;!&ndash;v-text="scope.row[childColconfig.prop || childColconfig.columnIndex]"&ndash;&gt;-->
                              <!--&lt;!&ndash;v-content-set="{config: childColconfig,row: scope.row}"></span>&ndash;&gt;-->
                          <!--&lt;!&ndash;</template>&ndash;&gt;-->
                        <!--&lt;!&ndash;</div>&ndash;&gt;-->
                      <!--</template>-->
                    <!--</template>-->
                  <!--</template>-->
                  <!--<template v-else>-->
                    <!--<div-->
                      <!--:style="{display: colConfig._isShow?'inline-block':'none'}"-->
                      <!--v-text="scope.row[colConfig.prop]"></div>-->
                  <!--</template>-->
                </template>
              </el-table-column>
            </template>
          </template>
          <template v-if="setDragTable">
            <el-table-column
              label="拖拽"
              width="50"
              align="center">
              <template slot-scope="{}">
                <el-tooltip effect="dark" content="拖拽当前行" placement="bottom" :open-delay="1500" :hide-after="3000" :enterable="false">
                  <div style="display: inline-block" @click.stop="clickStop" @dblclick.stop="clickStop">
                    <svg-icon class="drag-handler theDragHandle" icon-class="drag" />
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
          </template>
        </el-table>
      </el-form>
      <template v-if="setUseSummary && setCustomSummary.component">
        <custom-summary-option
          :customSummary="setCustomSummary"
          :tempData="setTempData"
          :tableData="tableData[dataName]"
          @send-height="customSummaryHeight"
          @custom-summary-value="customSummaryValue"></custom-summary-option>
      </template>
    </div>
    <div v-if="!setHidePages" style="text-align: center;"
         :style="{'padding-top':(customSummaryOptionHeight || 5)+'px',height:this.setSmallPageHeight + 'px'}">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page.sync="tableData.pageData.current"
        :page-size="tableData.pageData.size"
        layout="prev, pager, next, jumper"
        :total="tableData.pageData.total-0">
      </el-pagination>
    </div>

  </div>

</template>

<script>
  import mixin from '../mixins'
  import {GUID, evil,compare} from '@/utils/common'
  import tableFilter from '@/components/tableFilter'
  import customSummaryOption from '@/components/customSummaryOption'
  import {createRules, searchVal, getVal} from '@/utils/baseRules'
  import {isNumber} from '@/utils/validate'
  import constant from '@/utils/constant'
  import {customTableStore} from '@/store/dynaStore'
  import { createShortcuts } from '@/utils/customTableTools'
  import {unCreateStore} from '@/store/dynaStore'



  // 测试数据
  import testData from '@/data/customBaseTableData'

  export default {
    name: 'multilevel-table',
    mixins: [mixin],
    provide(){
      return {
        rootVm: this
      }
    },
    props: {

      expand: [Boolean],
      expandMode: [String],//'all','one','none',默认为'all'
      rootWidth: [String,Number],//'1000' || 1000
      showExpandBtn: [Boolean],
      parentData: {
        type: Array,
        default() {
          return []
        }
      },
      rowChain: {
        type: Array,
        default() {
          return []
        }
      },
      layerSingle: {
        type: Boolean,
        default: false
      },
      globalSingle: {
        type: Boolean,
        default: false
      },
      widthDiffValue: {
        type: Number,
        default: constant.widthDiffValue
      },
    },
    data() {
      return {
        _vnode: null,
        componentName: 'multilevelTable',

        // baseTableWidth: '',
        checkedViewHeight: 0,
        pageId: '',
        initLoading: true,

        //列动画
        headerWidthList: [],
        listLength: -1,
        restaurants: [],
        // debounce: 300,

        //上传功能数据
        fileList: [],
        //多级表格数据
        //baseNum: 99999,
        resultTableData: '',
        //自定义内容
        // cellStyle: {},
        //自定义计算(外部)
        computedIds:[],
        // checkBox
        tempCheckedList: [],

      }
    },
    components: {
      tableFilter,
      customSummaryOption,
    },
    computed: {
      //初始化props属性

      setMergeTitle() {
        return this.layerConfig.mergeTitle || this.mergeTitle
      },
      setInitLoading() {
        return this.initLoading
      },

      setTableLoading() {
        if (this.maxLayer === 1) {
          if (this.setShowTableSet) return this.setShowTableSet && this.setInitLoading
          return this.setInitLoading
        } else {
          if (this.setApiObj.apiName) {
            return this.initLoading
          } else {
            return false
          }
        }
      },

      tableData() {
        if (!this.layer) {
          //return this.blendVarList.result ? this.formatedTable(this.blendVarList) : {}
          //console.log(0)
          return this.$store.getters[this.guid + '/tableData'] || {}
          //return this.initCompute(this.$store.getters[this.guid + '/tableData'] || {})
        } else {
          //console.log(this.parentData)
          //console.log(1)
          return this.parentData[0] || {}
          //return this.initCompute(this.parentData[0] || {})
        }
      },

      // initContentWidthList(){
      //   return this.setTitleList.map(_=>{return {}})
      // },
      setExpand() {
        return (this.layerConfig.expand || this.expand) || false
      },
      setExpandMode() {
        return (this.layerConfig.expandMode || this.expandMode) || 'all'
      },
      setShowExpandBtn() {
        return (this.layerConfig.showExpandBtn || this.showExpandBtn) || false
      },
      setExpandColumnWidth() {
        if (this.setShowExpandBtn) return '50'
        if (this.maxLayer > 2) return '50'
        return (this.setExpand && this.setExpandMode !== 'all') ? '50' : '1'
      },
      setTableClass() {
        return {
          twoLevelTable: this.setExpandColumnWidth === '1' && this.maxLayer === 2 && !this.layer,
          inTwoLevelTable: this.maxLayer === 2 && this.layer,
          multilevelTable: this.setExpandColumnWidth === '50' || this.maxLayer > 2,
          singleStageTable: this.maxLayer === 1 && !this.layer,
          columnBaseTable: !this.layer,
          defaultSpacingClass: !this.layer && this.maxLayer > 1,
          noSpacingClass: this.layer,
        }
      },
      setExpandRowKeys() {
        if (this.setExpandMode === 'one' && this.tableData[this.dataName]) {
          return [this.tableData[this.dataName][0]]
        } else {
          return []
        }
      },
      setShowHeader() {
        // if (this.maxLayer > 1) {
        //   if (!this.layer) {
        //     return (typeof this.layerConfig.showHeader === 'boolean') ? this.layerConfig.showHeader : false
        //   } else {
        //     return (typeof this.layerConfig.showHeader === 'boolean') ? this.layerConfig.showHeader : true
        //   }
        // } else {
        //   return typeof this.layerConfig.showHeader === 'boolean' ? this.layerConfig.showHeader : true
        // }
        return typeof this.layerConfig.showHeader === 'boolean' ? this.layerConfig.showHeader : true
      },
      setTableBorder() {
        if(!this.layer) return this.setShowTableSet?true:false
        return this.setExpand?(this.setExpandColumnWidth === '50' || this.maxLayer > 2):true
      },
      setRootWidth(){
        if(!this.layer){
          return (this.layerConfig.rootWidth || this.rootWidth)?`${(this.layerConfig.rootWidth || this.rootWidth)+''}px`:'100%'
        }
        return '100%'
      },
    },
    created() {
      // console.log(this.layer,'created')
      // console.log(this.computedKeys)
      if (!this.layer) {
        this.guid = GUID()
        customTableStore(this)
        if (this.initData.result) {
          const res = JSON.parse(JSON.stringify(this.initData))
          this.computedIds = []
          this.tempCheckedList = []
          this.$store.commit(this.guid + '/SET_TABLEDATA', {res, vm: this})
          this.pageId = this.$storage.get('menuId')
          this.setRowExpansion(this.tableData[this.dataName][0], true)
          this.setDragTable && this.setSort()
          this.$store.commit(this.guid + '/SET_TABLERULELIST',{cb:this.tableRuleForm, ruleId:'root',vm:this})
          this.initLoading = false
        } else if (this.setApiObj.apiName) {
          if ((this.$route.name === '单级表格' || this.$route.name === '两级表格' || this.$route.name === '多级表格')) {
            setTimeout(() => {
              const res = JSON.parse(JSON.stringify(testData))
              this.computedIds = []
              this.tempCheckedList = []
              this.$store.commit(this.guid + '/SET_TABLEDATA', {res, vm: this})
              this.pageId = this.$storage.get('menuId')
              this.setRowExpansion(this.tableData[this.dataName][0], true)
              this.setDragTable && this.setSort()
              this.$store.commit(this.guid + '/SET_TABLERULELIST',{cb:this.tableRuleForm, ruleId:'root',vm:this})
              this.initLoading = false
            }, 1000)
          } else {
            this.httpRequests()
          }
        }

        //console.log(this.$store)
      }
      if(this.layer){
        // console.log('test')
        if(this.setApiObj && this.setApiObj.apiName){
          this.httpChildrenRequests(this.tableData)
        }else if(this.tableData[this.dataName] && this.tableData[this.dataName].length){
          this.tableData[this.dataName].forEach(v=>{
            v.rowState = '1'
          })
          this.setDragTable && this.setSort()
          this.$store.commit(this.setGuid + '/SET_TABLERULELIST',{cb:this.tableRuleForm, ruleId:this.internalRuleId,vm:this})
          this.initLoading = false
          this.tableDoLayout()
          //测试
          //this.httpChildrenRequests(this.tableData)
        }else {
          // console.log('test')
          this.$emit('narrow-row',this.parentData[0])
          this.initLoading = false
          this.tableDoLayout()
        }
      }
      //this.btnAuthority()
    },
    mounted() {
      // console.log(this)
      // this._vnode = this
      // this.baseTableWidth = this.$refs.baseTable.$el.clientWidth
      //this.ruleForm.tableData = this.$refs.baseTable.tableData || []
      this.setFixed()
      this.setTableCheckBoxDisplay()
      //this.initSummaryRow()
    },
    updated() {
    },
    beforeDestroy() {
      this.$store.state[this.setGuid] && this.$store.commit(this.setGuid + '/SET_TABLERULELIST',{cb:null, ruleId:this.layer?this.internalRuleId:'root'})
      this.tempCheckedList.forEach(v=>{
        this.$store.commit(this.setGuid + '/DELETE_CHECKED', [v])
      })
      !this.layer && unCreateStore(this.$store, this.guid)
    },
    watch: {
      'tableData.tableData': function () {
        this.maxLayer === 1 && this.setFixed()
        this.setTableCheckBoxDisplay()
        this.tableDoLayout()
      },
      'tableData.children': function () {
        this.maxLayer === (this.layer+1) && this.setFixed()
        this.setTableCheckBoxDisplay()
        this.tableDoLayout()
      },
      // 'setApiObj.params'() {
      //   this.httpRequests()
      // },
      initData() {
        this.$store.commit(this.setGuid + '/SET_TABLERULELIST',{cb:null, ruleId:this.layer?this.internalRuleId:'root'})
        const res = JSON.parse(JSON.stringify(this.initData))
        this.computedIds = []
        this.tempCheckedList = []
        this.$store.commit(this.setGuid + '/SET_TABLEDATA', {res, vm: this})
        this.pageId = this.$storage.get('menuId')
        this.setRowExpansion(this.tableData[this.dataName][0], true)
        this.setDragTable && this.setSort()
        this.$store.commit(this.setGuid + '/SET_TABLERULELIST',{cb:this.tableRuleForm, ruleId:this.layer?this.internalRuleId:'root',vm:this})
        this.initLoading = false
        this.tableDoLayout()
      },
      resetContentWidthList() {
        //console.log(this.resetContentWidthList,this.contentTitleWidthList)
        const tempArr = this.resetContentWidthList.map(v=>{return null})
        this.resetContentWidthList.forEach((v,i)=>{
          this.useMiddleValue = false
          tempArr[i] = this.contentWidthAlgorithm(v.map(cv=>{return Math.max.apply(null,cv)}))
          this.useMiddleValueList[i] = this.useMiddleValue
        })
        //console.log(this.layerTableWidth)
        tempArr.forEach((v,i)=>{
          this.contentWidthList[i] = v?(v+26):null
        })
        // console.log(tempArr,this.contentWidthList,this.useMiddleValueList,this.contentTitleWidthList)
      },
    },
    methods: {

      // switchEvent(row,index,colConfig,config){
      //   colConfig.method && colConfig.method(row,index)
      //   config.method && config.method(row,index)
      // },
      contentWidthAlgorithm(list){
        if(list && list.length){
          if(list.length>1){
            const max = Math.max.apply(null,list),min = Math.min.apply(null,list)
            if((max-min)>this.setWidthDiffValue){//取中位数
              let mid,tempArr = [].concat(list)
              tempArr.sort(compare)
              if(tempArr.length%2==0){
                mid = (tempArr[(tempArr.length/2)-1]+tempArr[tempArr.length/2])/2
              }else {
                mid = tempArr[((tempArr.length+1)/2)-1]
              }
              this.useMiddleValue = true
              ;(max-mid)>this.setWidthDiffValue
                ?(mid = this.setWidthDiffValue*2)
                :'';
              return mid
            }else {
              return max
            }
          }else {
            return list[0]
          }
        }else {
          return null
        }
      },
      // initCompute(data){
      //   if(this.computedKeys.length || this.computedDateKeys.length){
      //     const stateList = (data[this.dataName]||[]).map(v=>{return false}),tempIds= []
      //     ;(data[this.dataName]||[]).forEach((v,i)=>{
      //       const result = this.computedIds.findIndex(cv=>{
      //         return cv === v._internalId
      //       })
      //       if(result === -1){
      //         stateList[i] = true
      //         tempIds.push(v._internalId)
      //         //全局计算逻辑
      //         this.computedKeys.forEach(cv => {
      //           //console.log(config.columnIndex,v)
      //           const cList = cv._cellConfig.compute.split(/\([\\+|\-|\\*|\\/]\)/)
      //           if (cList.length > 1) {
      //             v[cv.columnIndex] = getVal(cList, v, this.setRowChain, this.tableData[this.dataName], cv._cellConfig.compute, this.setTempData).toFixed(cv._cellConfig.precision || this.setPrecision)
      //           }else {
      //             v[cv.columnIndex] = searchVal(cList, v, this.setRowChain, this.tableData[this.dataName], '', this.setTempData)[0].toFixed(cv._cellConfig.precision || this.setPrecision)
      //           }
      //         })
      //         this.computedDateKeys.forEach(cv => {
      //           const cList = cv._cellConfig.compute.split(/\([\\+|\-|\\*|\\/]\)/)
      //           if (cList.length > 1) {
      //             v[cv.columnIndex] = getVal(cList, v, this.setRowChain, this.tableData[this.dataName], cv._cellConfig.compute, this.setTempData)
      //           }else {
      //             v[cv.columnIndex] = searchVal(cList, v, this.setRowChain, this.tableData[this.dataName], '', this.setTempData)[0] || null
      //           }
      //         })
      //       }
      //     })
      //     stateList.findIndex(v=>{return !v})>-1
      //       ?(this.computedIds = this.computedIds.concat(tempIds))
      //       :(this.computedIds = tempIds)
      //   }
      //   return data
      // },

      databridge(list, row) {
        this.$emit('databridge', list, row)
      },
      expandChange(row, list) {
        //console.log(row, list)
        let state,apiObj
        if (this.setExpandMode === 'one') {
          list.forEach((v, i) => {
            if (row._internalId !== v._internalId) {
              list.splice(i, 1)
            }
          })
        }
        this.$refs.baseTable.$nextTick(_=>{
          //console.log('doLayout1')
          this.$refs.baseTable && this.$refs.baseTable.doLayout && this.$refs.baseTable.doLayout();
          this.$emit('table-dolayout')
        });
      },
      setRowExpansion(row, state) {
        !this.layer && this.maxLayer > 1 && this.setExpandMode === 'one' && this.$refs.baseTable.toggleRowExpansion(row, state)
      },


      httpRequests(pageNo) {
        this.$store.commit(this.guid + '/SET_TABLERULELIST',{cb:null, ruleId:'root'})
        this.initLoading = true
        this.$api[this.setApiObj.apiName](Object.assign({}, this.setApiObj.params, {pageNo: pageNo || 1}, this.searchObj)).then(res => {
          this.computedIds = []
          this.tempCheckedList = []
          this.$store.commit(this.guid + '/SET_TABLEDATA', {res, vm: this})
          this.pageId = this.$storage.get('menuId')
          this.setRowExpansion(this.tableData[this.dataName][0], true)
          this.setDragTable && this.setSort()
          this.initLoading = false
          if (pageNo) {
            this.pageNo = pageNo
            this.scrollTable()
          }
          this.tableDoLayout()
          this.$store.commit(this.guid + '/SET_TABLERULELIST',{cb:this.tableRuleForm, ruleId:'root',vm:this})
        }).catch(err => {
          console.log(err)
          this.initLoading = false
        })
      },
      httpChildrenRequests(row, pageNo) {
        this.$store.commit(this.setGuid + '/SET_TABLERULELIST',{cb:null, ruleId:this.internalRuleId})
        this.initLoading = true
        //测试
        // setTimeout(_ => {
        //   const res = JSON.parse(JSON.stringify(childrenTestData))
        //   this.$store.commit(this.setGuid + '/UPDATE_CHILDRENTABLEDATA', {res, row, vm: this})
        //
        //   this.pageNo = this.tableData[this.dataName].pageData ? (this.tableData[this.dataName].pageData.current || 1) : 1
        //
        //   this.initLoading = false
        //   console.log('initLoading--->', this.initLoading)
        //   if (pageNo) {
        //     clearTimeout(this.scrollTimer)
        //     this.scrollTimer = setTimeout(_ => {
        //       const rootEl = this.$refs.baseTable.$el
        //       rootEl.querySelector('.el-table__body-wrapper').scrollTop > 0 &&
        //       scrollToTop(rootEl.querySelector('.el-table__body-wrapper')) &&
        //       scrollToTop(rootEl.querySelector('.el-table__fixed-body-wrapper'))
        //     })
        //   }
        // },2000)



        //正式代码
        this.$api[this.setApiObj.apiName](Object.assign({}, {pageNo: pageNo || 1}, this.setParams(row, this.setApiObj), this.setDynaValue(row))).then(res => {
          this.$store.commit(this.setGuid + '/UPDATE_CHILDRENTABLEDATA', {res, row, vm: this})

          this.setDragTable && this.setSort()

          this.pageNo = this.tableData[this.dataName].pageData ? (this.tableData[this.dataName].pageData.current || 1) : 1

          this.initLoading = false

          this.tableDoLayout()
          // console.log('initLoading--->', this.initLoading)
          if (pageNo) {
            this.scrollTable()
            // clearTimeout(this.scrollTimer)
            // this.scrollTimer = setTimeout(_ => {
            //   const rootEl = this.$refs.baseTable.$el
            //   rootEl.querySelector('.el-table__body-wrapper').scrollTop > 0 &&
            //   scrollToTop(rootEl.querySelector('.el-table__body-wrapper')) &&
            //   scrollToTop(rootEl.querySelector('.el-table__fixed-body-wrapper'))
            // })
          }
          this.$store.commit(this.setGuid + '/SET_TABLERULELIST',{cb:this.tableRuleForm, ruleId:this.internalRuleId,vm:this})
        }).catch(err => {
          console.log(err)
          this.initLoading = false
        })
      },
      selectItem(selection, row) {
        // console.log(selection, row)
        const state = selection.findIndex(v=>{
          return v._internalId === row._internalId
        })
        if(state > -1){
          this.tempCheckedList.push(row)
          this.$store.commit(this.setGuid + '/ADD_CHECKED', [row])
        }else {
          this.$store.commit(this.setGuid + '/DELETE_CHECKED', [row])
          this.tempCheckedList = this.tempCheckedList.filter(v=>{return v._internalId !== row._internalId})
        }
        //console.log(this.$store.getters[this.setGuid + '/checkedList'])
        this.$emit('databridge', this.$store.getters[this.setGuid + '/checkedList'])
        if (this.setIsSingle || this.setGlobalSingle || this.setLayerSingle) {
          if(this.setGlobalSingle || this.setLayerSingle){
            this.$store.commit(this.setGuid + '/SET_ROWSTATE', {
              model: this.setGlobalSingle?'global':'layer',
              layer: this.layer,
              state: selection.length?'0':'1'
            })
          }
          if (selection.length) {
            this.tableData[this.dataName].forEach(item => {
              item.rowState = '0'
            })
            selection[0].rowState = '1'
          } else {
            this.tableData[this.dataName].forEach(item => {
              item.rowState = '1'
            })
          }
        }
      },
      selectAllItem(selection) {
        // console.log(selection)
        if (this.setIsSingle) {
          if (selection.length) {
            for (let i = selection.length - 1; i >= 0; i--) {
              selection.splice(i, 1)
            }
          }
        } else {
          if(selection.length){
            this.tempCheckedList = selection.map(v=>{return v})
            this.$store.commit(this.setGuid + '/ADD_CHECKED', this.tempCheckedList)
          }else {
            this.$store.commit(this.setGuid + '/DELETE_CHECKED', this.tempCheckedList)
            this.tempCheckedList = []
          }
          //console.log(this.$store.getters[this.setGuid + '/checkedList'])
          this.$emit('databridge', this.$store.getters[this.setGuid + '/checkedList'])
        }
      },

      handleCurrentChange(pageIndex) {
        // this.$emit('update:currentpage', pageIndex)
        //console.log(pageIndex,this.pageNo)
        pageIndex !== this.pageNo && this.httpRequests(pageIndex)
        // this.httpRequests(pageIndex)
      },


      //数据接口动态取值配置
      setDynaValue(row){
        if(this.setDynamicValue){
          const tempObj = {}
          for(const k in this.setDynamicValue){
            if(this.setDynamicValue.hasOwnProperty(k)){
              tempObj[k] = searchVal([this.setDynamicValue[k]],row,this.setRowChain,this.tableData[this.dataName],false,this.setTempData)[0]
            }
          }
          // console.log(tempObj)
          return tempObj
        }else {
          return {}
        }
      },





      // masBoxImgLoad(e){
      //   if(e.target){
      //     this.msgBoxImgWidth = e.target.width
      //     this.msgBoxImgHeight = e.target.height
      //     console.log(this.msgBoxImgWidth,this.msgBoxImgHeight)
      //   }else {
      //     this.$nextTick(function () {
      //       this.msgBoxImgWidth = e.target.width
      //       this.msgBoxImgHeight = e.target.height
      //     })
      //   }
      // },






      // 合计功能
      // initSummaryRow() {
      //   if (this.useSummary && this.customSummary.component) {
      //     const summaryEl = this.$refs.baseTable.$el
      //     const baseTr = summaryEl.querySelector('.el-table__footer-wrapper>.el-table__footer>.has-gutter>tr')
      //     // this.mutationObserver(baseTr,{childList: true},this.resetSummaryRow)
      //   }
      // },
      // customSummaryHeight(height) {
      //   //console.log(height)
      //   this.customSummaryOptionHeight = height
      // },
      // resetSummaryRow(el, observer) {
      //   observer.disconnect()
      //   observer.takeRecords()
      //   const tdList = el.querySelectorAll('td')
      //   setTimeout(_ => {
      //     const fixedTdList = this.$refs.baseTable.$el.querySelectorAll('.el-table__fixed-footer-wrapper')
      //     fixedTdList.length && fixedTdList.forEach(v => {
      //       const tdList = v.querySelectorAll('.el-table__footer>tbody>tr>td')
      //       tdList.forEach((item, index) => {
      //         index > 1 && item.parentNode.removeChild(item)
      //       })
      //       tdList[1].setAttribute('colspan', tdList.length - 1)
      //     })
      //   }, 10)
      //   tdList.forEach((item, index) => {
      //     index > 1 && item.parentNode.removeChild(item)
      //   })
      //   tdList[1].setAttribute('colspan', tdList.length - 1)
      // },
      // mutationObserver(el, config, cb) {
      //   const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
      //   const observer = new MutationObserver(mutations => {
      //     if (mutations[mutations.length - 1].type === 'childList') {
      //       cb(el, observer)
      //     }
      //   })
      //   observer.observe(el, config)
      // },


      setRowClass() {
        if (this.setExpand) {
          if(this.setExpandColumnWidth === '1'){
            return 'hide-expand-column'
          }else {
            if (this.maxLayer === 2) {
              return 'row-expand-cover'
            } else {
              return 'multilevel-expand-cover'
            }
          }
        } else {
          return ''
        }
      },
      setHeaderRowClass() {
        if (this.setExpand) {
          if(this.setExpandColumnWidth === '1'){
            return 'hide-header-expand-column'
          }else {
            if (this.maxLayer === 2 && this.setExpandColumnWidth === '1') {
              return 'header-expand-cover'
            } else {
              return 'multilevel-header-expand-cover'
            }
          }
        } else {
          return ''
        }
      },
      searchTableData(tableData, id) {
        if (id && tableData) {
          this.resultTableData = (tableData.tableData || tableData.children).find(v => {
            if (v._internalId === id) {
              return true
            }
            if (v.children && v.children.length) {
              const data = {
                titleList: v.titleList,
                children: v.children,
                pageData: v.pageData || {}
              }
              this.resultTableData = this.searchTableData(data, id)
            }
          })
          if (this.resultTableData) {
            return this.resultTableData
          }
        } else {
          return {}
        }
      },




      callParentMethod(obj){
        this.$emit('callmethod',obj)
      },
      tableDoLayout(){
        this.$nextTick(_=>{
          //console.log('doLayout2')
          this.$refs.baseTable && this.$refs.baseTable.doLayout && this.$refs.baseTable.doLayout()
          this.layer && this.$emit('table-dolayout')
        })
      },
    }
  }
</script>

<style lang="scss" rel="text/css">
  .columnBaseTable {
    height: 100%;
    position: relative;
    .el-form-item {
      margin-bottom: 0;
    }
    .el-date-editor.el-input {
      width: 95% !important;
      /*min-width: 150px !important;*/
    }
    .el-date-editor--date {
      min-width: 150px !important;
    }
    .el-date-editor--time {
      min-width: 110px !important;
    }
    .el-date-editor--datetime {
      min-width: 190px !important;
    }
    .el-input--suffix .el-input__inner {
      padding-right: 0;
    }
    .el-form-item__error {
      visibility: hidden;
    }

    [v-cloak] {
      display: none;
    }
    .el-table {
      > .el-table__body-wrapper {
        > table {
          border-spacing: 0 0;
        }
      }
    }
    .hide-expand-column,
    .hide-header-expand-column {
      .el-table__expand-column {
        border-right: none !important;
        overflow: hidden !important;
      }
    }

    .resetProgressStyle {
      .el-progress-bar {
        padding-right: 70px !important;
        margin-right: -76px !important;
      }
      .el-progress--text-inside {
        .el-progress-bar {
          padding-right: 0 !important;
          margin-right: 0 !important;
        }
      }
      .el-progress-bar__inner {
        max-width: 100%;
      }
    }
  }

  .defaultSpacingClass {
    .el-table {
      table {
        border-spacing: 0 5px !important;
      }
      th.is-leaf {
        border-bottom: none !important;
      }
    }
  }
  .noSpacingClass {
    .el-table {
      table {
        border-spacing: 0 0 !important;
      }
      th.is-leaf {
        border-bottom: 1px solid #dfe6ec !important;
      }
    }
  }

  .singleStageTable {
    .el-table__expanded-cell {
      border-bottom: none;
      padding: 0 !important;
    }
  }

  .twoLevelTable {
    .el-table__expanded-cell {
      border-bottom: none;
      background-color: #fff;
    }
    .el-table__expanded-cell[class*=cell] {
      padding: 0 0 10px 0;
    }
    .row-expand-cover {
      background-color: #E4F3FA;
    }
    .row-expand-cover td:first-child {
      border-right: none;
    }
    .row-expand-cover td:first-child .cell {
      display: none;
    }
    .header-expand-cover th:first-child {
      border-right: none;
    }
  }

  .inTwoLevelTable {
    .el-table__body-wrapper {
      /*height: 0;*/
    }
    .el-table__expanded-cell {
      border-bottom: none;
      background-color: #fff;
    }
    .el-table__expanded-cell[class*=cell] {
      padding: 0 !important;
    }
    .row-expand-cover {
      background-color: #E4F3FA;
    }
    .row-expand-cover td:first-child {
      border-right: none;
    }
    .row-expand-cover td:first-child .cell {
      display: none;
    }
    .header-expand-cover th:first-child {
      border-right: none;
    }
  }

  .multilevelTable {
    .el-table th, .el-table tr {
      /*background-color: inherit;*/
    }
    .el-table__expanded-cell[class*=cell] {
      padding: 8px;
    }
    .row-expand-cover td:first-child {
      border-right: 1px solid #dfe6ec;
    }
    .row-expand-cover td:first-child .cell {
      display: block;
    }

    .multilevel-expand-cover {

    }
  }

  .el-table__empty-block {
    width: 100% !important;
  }

  .drag-handler{
    width: 20px !important;
    height: 20px !important;
    cursor: move !important;
  }

  .cellTest {
    &::after {
      content: '';
      background: #000;
      display: inline-block;
      width: 8px;
      height: 8px;
      position: absolute;
      top: 0;
      right: 0;
    }
  }


</style>
