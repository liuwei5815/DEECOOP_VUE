<template>
  <div
    ref="tableWrapper"
    class="columnBaseTable myCoustomTable resetCoustomTableStyle"
    v-loading="!disableLoading && setTableLoading"
    style="height: 100%;position: relative">
    <table-filter
      v-if="showTableSet && tableSetMode === 'outside'"
      :headerList="setColConfigs"
      :tableSwitchState="setTableSwitch"
      :storeId="pageId"
      :componentId="componentId"
      @checked-list="checkedList"
      @checked-height="checkedHeight"></table-filter>
    <div :style="{height: setTableHeight}">
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        status-icon
        :style="{height: '100%'}"
        @submit.native.prevent>
        <el-table ref="baseTable"
                  :data="tableData.tableData"
                  stripe
                  border
                  :current-row-key="rowKey"
                  tooltip-effect="dark"
                  style="width: 100%;"
                  height="100%"
                  fit
                  :header-cell-class-name="setStyle"
                  row-key="_internalId"
                  :default-sort="setSortableConfig['default-sort']"
                  :show-summary="setSysSummary"
                  :cell-style="setCellStyle"
                  :header-cell-style="setHeaderCellStyle"
                  @select="selectItem"
                  @select-all="selectAllItem"
                  @selection-change="selectionChange"
                  @sort-change="sortChange"
                  @row-click="rowClick"
                  @row-dblclick="rowDblclick">
          <template v-if="setShowCheckBox">
            <el-table-column type="selection" :fixed="fixedState" :selectable="selectable" width="55" align="center"></el-table-column>
          </template>
          <template v-if="setShowIndex">
            <el-table-column type="index" :index="indexMethod" :fixed="fixedState" label="序号" width="50" align="center"></el-table-column>
          </template>
          <template v-for="(colConfig,infoIndex) in setTitleList">
            <tempalte v-if="colConfig.slot">
              <slot
                :name="colConfig.slot"
                :fixed="setFixedList[infoIndex]"></slot>
            </tempalte>
            <template v-else-if="Array.isArray(colConfig.component)">
              <el-table-column
                show-overflow-tooltip
                v-bind="colConfig"
                :key="infoIndex"
                :fixed="setFixedList[infoIndex]"
                :min-width="colConfig.width || setColumnWidth[colConfig.prop]"
                align="center">
                <template slot="header" slot-scope="scope">
                  <span
                    v-auto-tran="{state:colConfig._isShow,index:infoIndex,isComponent: true,label:colConfig.label,prop:colConfig.prop}"
                    style="display: inline-flex;white-space: nowrap;" v-text="colConfig.label"></span>
                </template>
                <template slot-scope="scope">
                  <div
                    v-auto-width="colConfig"
                    class="btnBox"
                    style="display: flex; white-space: normal;flex-wrap: wrap;"
                    :style="{'justify-content':setColumnWidth[colConfig.prop]?'space-between':'center'}">
                    <el-button
                      v-for="(item, cIndex) in colConfig.component"
                      :key="cIndex"
                      v-if="(item.editBtns_isShow===undefined?true:item.editBtns_isShow) && item.rowState?setButtonState(scope.$index,scope.row,item):true"
                      type="text"
                      :style="setButtonStyle || {height: '24px',width:'46px',padding: 0,margin: 0,'font-size': '12px','max-width': '46px'}"
                      @click="item.method(scope.row,scope.$index,scope)">{{item.name}}</el-button>
                  </div>
                </template>
              </el-table-column>
            </template>
            <template v-else-if="typeof colConfig.component === 'object' && !Array.isArray(colConfig.component)">
              <component
                :key="infoIndex"
                :is="colConfig.component"
                :col-config="colConfig"
                :fixed="setFixedList[infoIndex]"></component>
            </template>
            <template v-else>
              <el-table-column
                v-if="colConfig._isShow?true:!(tableSetMode === 'outside')"
                show-overflow-tooltip
                :prop="colConfig.prop"
                :key="infoIndex"
                :width="colConfig._isShow?'':setTableColumnState?'20':''"
                :min-width="colConfig._isShow?(colConfig.width || constantWidth[colConfig.componentName] || autoWidths[infoIndex] || null):''"
                :sortable="colConfig.sortable===undefined?isSortable:colConfig.sortable"
                :fixed="setFixedList[infoIndex]"
                align="center">
                <template slot="header" slot-scope="scope">
                  <span
                    v-auto-tran="{state:colConfig._isShow,index:infoIndex,label:colConfig.label,prop:colConfig.prop}"
                    v-custom-table-switch="{config:colConfig,index:infoIndex,showSwitch:setTableColumnState}"
                    :style="{display: colConfig._isShow?'inline-flex':'none','white-space': 'nowrap'}" v-text="colConfig.label"></span>
                </template>
                <template slot-scope="scope">
                  <core-index v-show="colConfig._isShow?true:tableSetMode === 'outside'" :scope="scope" :info-index="infoIndex" :col-config="colConfig" :runTime="'base'"></core-index>
                  <!--<template v-if="colConfig.mergeTitles && colConfig.mergeTitles.length">-->
                    <!--<template v-for="(childColconfig,cIndex) in colConfig.mergeTitles">-->
                      <!--<template v-if="childColconfig.componentName">-->
                        <!--<core-index :scope="scope" :child-colconfig="childColconfig" :info-index="infoIndex" :c-index="cIndex"></core-index>-->
                        <!--&lt;!&ndash;<template v-if="childColconfig.componentName === 'input'">&ndash;&gt;-->
                          <!--&lt;!&ndash;<core-index :scope="scope" :child-colconfig="childColconfig" :info-index="infoIndex" :c-index="cIndex"></core-index>&ndash;&gt;-->
                          <!--&lt;!&ndash;&lt;!&ndash;<template v-if="childColconfig._cellConfig.asyn">&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;<el-form-item&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;:prop="'tableData.'+scope.$index+'.'+childColconfig.prop"&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;:rules="baseRules(scope.$index,scope.row,childColconfig)"&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;:inline-message="true"&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;:key="scope.row._internalId">&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;<div style="display: inline-block" @click.stop="clickStop" @dblclick.stop="clickStop">&ndash;&gt;&ndash;&gt;-->
                                <!--&lt;!&ndash;&lt;!&ndash;<table-autocomplete :scope="scope" :child-colconfig="childColconfig" :debounce="debounce"></table-autocomplete>&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;</div>&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;</el-form-item>&ndash;&gt;&ndash;&gt;-->
                          <!--&lt;!&ndash;&lt;!&ndash;</template>&ndash;&gt;&ndash;&gt;-->
                          <!--&lt;!&ndash;&lt;!&ndash;<template v-else>&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;<el-form-item&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;:prop="'tableData.'+scope.$index+'.'+childColconfig.prop"&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;:rules="baseRules(scope.$index,scope.row,childColconfig)"&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;:inline-message="true"&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;:key="scope.row._internalId">&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;<div style="display: inline-block" @click.stop="clickStop" @dblclick.stop="clickStop">&ndash;&gt;&ndash;&gt;-->
                                <!--&lt;!&ndash;&lt;!&ndash;<table-input :scope="scope" :child-colconfig="childColconfig"></table-input>&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;</div>&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;</el-form-item>&ndash;&gt;&ndash;&gt;-->
                          <!--&lt;!&ndash;&lt;!&ndash;</template>&ndash;&gt;&ndash;&gt;-->
                        <!--&lt;!&ndash;</template>&ndash;&gt;-->
                        <!--&lt;!&ndash;<template v-else-if="childColconfig.componentName === 'date'">&ndash;&gt;-->
                          <!--&lt;!&ndash;<core-index :scope="scope" :child-colconfig="childColconfig" :info-index="infoIndex" :c-index="cIndex"></core-index>&ndash;&gt;-->
                          <!--&lt;!&ndash;&lt;!&ndash;<el-form-item&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;:prop="'tableData.'+scope.$index+'.'+childColconfig.prop"&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;:rules="baseRules(scope.$index,scope.row,childColconfig)"&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;:inline-message="true"&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;:key="scope.row._internalId">&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;<div style="display: inline-block" @click.stop="clickStop" @dblclick.stop="clickStop">&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;<table-date-picker :scope="scope" :child-colconfig="childColconfig"></table-date-picker>&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;</div>&ndash;&gt;&ndash;&gt;-->
                          <!--&lt;!&ndash;&lt;!&ndash;</el-form-item>&ndash;&gt;&ndash;&gt;-->
                        <!--&lt;!&ndash;</template>&ndash;&gt;-->
                        <!--&lt;!&ndash;<template v-else-if="childColconfig.componentName === 'time'">&ndash;&gt;-->
                          <!--&lt;!&ndash;<core-index :scope="scope" :child-colconfig="childColconfig" :info-index="infoIndex" :c-index="cIndex"></core-index>&ndash;&gt;-->
                          <!--&lt;!&ndash;&lt;!&ndash;<el-form-item&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;:prop="'tableData.'+scope.$index+'.'+childColconfig.prop"&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;:rules="baseRules(scope.$index,scope.row,childColconfig)"&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;:inline-message="true"&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;:key="scope.row._internalId">&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;<div style="display: inline-block" @click.stop="clickStop" @dblclick.stop="clickStop">&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;<table-time-picker :scope="scope" :child-colconfig="childColconfig"></table-time-picker>&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;</div>&ndash;&gt;&ndash;&gt;-->
                          <!--&lt;!&ndash;&lt;!&ndash;</el-form-item>&ndash;&gt;&ndash;&gt;-->
                        <!--&lt;!&ndash;</template>&ndash;&gt;-->
                        <!--&lt;!&ndash;<template v-else-if="childColconfig.componentName === 'select'">&ndash;&gt;-->
                          <!--&lt;!&ndash;<core-index :scope="scope" :child-colconfig="childColconfig" :info-index="infoIndex" :c-index="cIndex"></core-index>&ndash;&gt;-->
                          <!--&lt;!&ndash;&lt;!&ndash;<el-form-item&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;:prop="'tableData.'+scope.$index+'.'+childColconfig.prop"&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;:rules="baseRules(scope.$index,scope.row,childColconfig)"&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;:inline-message="true"&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;:key="scope.row._internalId">&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;<div style="display: inline-block" @click.stop="clickStop" @dblclick.stop="clickStop">&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;<table-select :scope="scope" :child-colconfig="childColconfig"></table-select>&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;</div>&ndash;&gt;&ndash;&gt;-->
                          <!--&lt;!&ndash;&lt;!&ndash;</el-form-item>&ndash;&gt;&ndash;&gt;-->
                        <!--&lt;!&ndash;</template>&ndash;&gt;-->
                        <!--&lt;!&ndash;<template v-else-if="childColconfig.componentName === 'cascader'">&ndash;&gt;-->
                          <!--&lt;!&ndash;<core-index :scope="scope" :child-colconfig="childColconfig" :info-index="infoIndex" :c-index="cIndex"></core-index>&ndash;&gt;-->
                          <!--&lt;!&ndash;&lt;!&ndash;<el-form-item&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;:prop="'tableData.'+scope.$index+'.'+childColconfig.prop"&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;:rules="baseRules(scope.$index,scope.row,childColconfig)"&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;:inline-message="true"&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;:key="scope.row._internalId">&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;<div style="display: inline-block" @click.stop="clickStop" @dblclick.stop="clickStop">&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;<table-cascader :scope="scope" :child-colconfig="childColconfig"></table-cascader>&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;</div>&ndash;&gt;&ndash;&gt;-->
                          <!--&lt;!&ndash;&lt;!&ndash;</el-form-item>&ndash;&gt;&ndash;&gt;-->
                        <!--&lt;!&ndash;</template>&ndash;&gt;-->
                        <!--&lt;!&ndash;<template v-else-if="childColconfig.componentName === 'switch'">&ndash;&gt;-->
                          <!--&lt;!&ndash;<core-index :scope="scope" :child-colconfig="childColconfig" :info-index="infoIndex" :c-index="cIndex"></core-index>&ndash;&gt;-->
                          <!--&lt;!&ndash;&lt;!&ndash;<div @click.stop="clickStop" @dblclick.stop="clickStop">&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;<div&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;style="display: inline-block;"&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;v-if="!childColconfig._cellConfig.hideTitle"&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;:style="childColconfig._cellConfig.titleStyle || {}"&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;v-cloak>&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;{{childColconfig.label+':'}}&nbsp&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;</div>&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;<div style="display: inline-block">&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;<table-switch :scope="scope" :child-colconfig="childColconfig"></table-switch>&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;</div>&ndash;&gt;&ndash;&gt;-->
                          <!--&lt;!&ndash;&lt;!&ndash;</div>&ndash;&gt;&ndash;&gt;-->
                        <!--&lt;!&ndash;</template>&ndash;&gt;-->
                        <!--&lt;!&ndash;<template v-else-if="childColconfig.componentName === 'dateTime'">&ndash;&gt;-->
                          <!--&lt;!&ndash;<core-index :scope="scope" :child-colconfig="childColconfig" :info-index="infoIndex" :c-index="cIndex"></core-index>&ndash;&gt;-->
                          <!--&lt;!&ndash;&lt;!&ndash;<el-form-item&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;:prop="'tableData.'+scope.$index+'.'+childColconfig.prop"&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;:rules="baseRules(scope.$index,scope.row,childColconfig)"&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;:inline-message="true"&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;:key="scope.row._internalId">&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;<div style="display: inline-block" @click.stop="clickStop" @dblclick.stop="clickStop">&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;<table-date-time :scope="scope" :child-colconfig="childColconfig"></table-date-time>&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;</div>&ndash;&gt;&ndash;&gt;-->
                          <!--&lt;!&ndash;&lt;!&ndash;</el-form-item>&ndash;&gt;&ndash;&gt;-->
                        <!--&lt;!&ndash;</template>&ndash;&gt;-->
                        <!--&lt;!&ndash;<template v-else-if="childColconfig.componentName === 'inputNumber'">&ndash;&gt;-->
                          <!--&lt;!&ndash;<core-index :scope="scope" :child-colconfig="childColconfig" :info-index="infoIndex" :c-index="cIndex"></core-index>&ndash;&gt;-->
                          <!--&lt;!&ndash;&lt;!&ndash;<el-form-item&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;:prop="'tableData.'+scope.$index+'.'+childColconfig.prop"&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;:rules="baseRules(scope.$index,scope.row,childColconfig)"&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;:inline-message="true"&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;:key="scope.row._internalId">&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;<div style="display: inline-block" @click.stop="clickStop" @dblclick.stop="clickStop">&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;<table-input-number :scope="scope" :child-colconfig="childColconfig"></table-input-number>&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;</div>&ndash;&gt;&ndash;&gt;-->
                          <!--&lt;!&ndash;&lt;!&ndash;</el-form-item>&ndash;&gt;&ndash;&gt;-->
                        <!--&lt;!&ndash;</template>&ndash;&gt;-->
                        <!--&lt;!&ndash;<template v-else-if="childColconfig.componentName === 'steps'">&ndash;&gt;-->
                          <!--&lt;!&ndash;<core-index :scope="scope" :child-colconfig="childColconfig" :info-index="infoIndex" :c-index="cIndex"></core-index>&ndash;&gt;-->
                          <!--&lt;!&ndash;&lt;!&ndash;<div class="resetElStepStyle" :key="cIndex" @click.stop="clickStop" @dblclick.stop="clickStop">&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;<div&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;v-if="!childColconfig._cellConfig.hideTitle"&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;v-merga-width="{parentLayer:infoIndex,selfLayer:cIndex,id:'_0'+childColconfig.prop}"&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;:style="childColconfig._cellConfig.titleStyle || {}"&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;v-cloak>{{childColconfig.label+':'}}&nbsp</div>&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;<div v-merga-width="{parentLayer:infoIndex,selfLayer:cIndex,id:'_1'+childColconfig.prop}">&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;<custom-steps :scope="scope" :child-colconfig="childColconfig"></custom-steps>&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;</div>&ndash;&gt;&ndash;&gt;-->
                          <!--&lt;!&ndash;&lt;!&ndash;</div>&ndash;&gt;&ndash;&gt;-->
                        <!--&lt;!&ndash;</template>&ndash;&gt;-->
                        <!--&lt;!&ndash;<template v-else-if="childColconfig.componentName === 'progress'">&ndash;&gt;-->
                          <!--&lt;!&ndash;<core-index :scope="scope" :child-colconfig="childColconfig" :info-index="infoIndex" :c-index="cIndex"></core-index>&ndash;&gt;-->
                          <!--&lt;!&ndash;&lt;!&ndash;<div :style="{'text-align': childColconfig._cellConfig.hideTitle?'center':'left',}" :key="cIndex" @click.stop="clickStop" @dblclick.stop="clickStop">&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;<div&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;v-if="!childColconfig._cellConfig.hideTitle"&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;style="display: inline-block;"&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;:style="[{'line-height': childColconfig._cellConfig.componentConfig['stroke-width']>23?2:''},childColconfig._cellConfig.titleStyle||(setColumnGlobalStyle[layer]?setColumnGlobalStyle[layer].titleStyle:{})||{}]"&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;v-merga-width="{parentLayer:infoIndex,selfLayer:cIndex,id:'_0'+childColconfig.prop}"&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;v-cloak>{{childColconfig.label+':'+(childColconfig._cellConfig.componentConfig.showInitValue?scope.row[childColconfig.prop]:'')}}&nbsp</div>&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;<div&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;class="resetProgressStyle"&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;v-merga-width="{parentLayer:infoIndex,selfLayer:cIndex,id:'_1'+childColconfig.prop}"&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;style="display: inline-block;overflow: hidden;vertical-align: middle;"&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;:style="{width: (childColconfig._cellConfig.componentConfig.width || constantWidth[childColconfig.componentName]) + 'px'}">&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;<table-progress :scope="scope" :child-colconfig="childColconfig"></table-progress>&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;</div>&ndash;&gt;&ndash;&gt;-->
                          <!--&lt;!&ndash;&lt;!&ndash;</div>&ndash;&gt;&ndash;&gt;-->
                        <!--&lt;!&ndash;</template>&ndash;&gt;-->
                        <!--&lt;!&ndash;<template v-else-if="childColconfig.componentName === 'upload'">&ndash;&gt;-->
                          <!--&lt;!&ndash;<core-index :scope="scope" :child-colconfig="childColconfig" :info-index="infoIndex" :c-index="cIndex"></core-index>&ndash;&gt;-->
                          <!--&lt;!&ndash;&lt;!&ndash;<div :style="{'text-align': childColconfig._cellConfig.hideTitle?'center':'left',}" :key="cIndex" @click.stop="clickStop" @dblclick.stop="clickStop">&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;<div&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;style="display: inline-block;"&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;v-if="childColconfig._cellConfig.hideTitle"&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;:style="childColconfig._cellConfig.titleStyle || {}"&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;v-cloak>&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;{{childColconfig.label+':'}}&nbsp&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;</div>&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;<div style="display: inline-block">&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;<table-upload :scope="scope" :child-colconfig="childColconfig"></table-upload>&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;</div>&ndash;&gt;&ndash;&gt;-->
                          <!--&lt;!&ndash;&lt;!&ndash;</div>&ndash;&gt;&ndash;&gt;-->
                        <!--&lt;!&ndash;</template>&ndash;&gt;-->
                        <!--&lt;!&ndash;<template v-else-if="childColconfig.componentName === 'tag'">&ndash;&gt;-->
                          <!--&lt;!&ndash;<core-index :scope="scope" :child-colconfig="childColconfig" :info-index="infoIndex" :c-index="cIndex"></core-index>&ndash;&gt;-->
                          <!--&lt;!&ndash;&lt;!&ndash;<div :style="{'text-align': childColconfig._cellConfig.hideTitle?'center':'left',}" :key="cIndex" @click.stop="clickStop" @dblclick.stop="clickStop">&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;<div&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;style="display: inline-block;"&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;v-if="childColconfig._cellConfig.hideTitle"&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;:style="childColconfig._cellConfig.titleStyle || {}"&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;v-cloak>&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;{{childColconfig.label+':'}}&nbsp&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;</div>&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;<div style="display: inline-block">&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;<table-tag :scope="scope" :child-colconfig="childColconfig"></table-tag>&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;</div>&ndash;&gt;&ndash;&gt;-->
                          <!--&lt;!&ndash;&lt;!&ndash;</div>&ndash;&gt;&ndash;&gt;-->
                        <!--&lt;!&ndash;</template>&ndash;&gt;-->
                        <!--&lt;!&ndash;<template v-else-if="childColconfig.componentName === 'dynaContent'">&ndash;&gt;-->
                          <!--&lt;!&ndash;<core-index :scope="scope" :child-colconfig="childColconfig" :info-index="infoIndex" :c-index="cIndex"></core-index>&ndash;&gt;-->
                          <!--&lt;!&ndash;&lt;!&ndash;<div :style="{'text-align': childColconfig._cellConfig.hideTitle?'center':'left',}" :key="cIndex" @click.stop="clickStop" @dblclick.stop="clickStop">&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;<div&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;style="display: inline-block;"&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;v-if="!childColconfig._cellConfig.hideTitle"&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;:style="childColconfig._cellConfig.titleStyle || {}"&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;v-cloak>&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;{{childColconfig.label+':'}}&nbsp&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;</div>&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;<div style="display: inline-block;">&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;<dyna-content&ndash;&gt;&ndash;&gt;-->
                                <!--&lt;!&ndash;&lt;!&ndash;:scope="scope"&ndash;&gt;&ndash;&gt;-->
                                <!--&lt;!&ndash;&lt;!&ndash;:child-colconfig="childColconfig"></dyna-content>&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;</div>&ndash;&gt;&ndash;&gt;-->
                          <!--&lt;!&ndash;&lt;!&ndash;</div>&ndash;&gt;&ndash;&gt;-->
                        <!--&lt;!&ndash;</template>&ndash;&gt;-->
                        <!--&lt;!&ndash;<template v-else-if="childColconfig.componentName === 'button'">&ndash;&gt;-->
                          <!--&lt;!&ndash;<core-index :scope="scope" :child-colconfig="childColconfig" :info-index="infoIndex" :c-index="cIndex"></core-index>&ndash;&gt;-->
                          <!--&lt;!&ndash;&lt;!&ndash;<div :style="{'text-align': childColconfig._cellConfig.hideTitle?'center':'left',}" :key="cIndex" @click.stop="clickStop" @dblclick.stop="clickStop">&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;<div&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;style="display: inline-block;"&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;v-if="!childColconfig._cellConfig.hideTitle"&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;:style="childColconfig._cellConfig.titleStyle || {}"&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;v-cloak>&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;{{childColconfig.label+':'}}&nbsp&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;</div>&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;<div style="display: inline-block;">&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;<table-button :scope="scope" :child-colconfig="childColconfig"></table-button>&ndash;&gt;&ndash;&gt;-->
                            <!--&lt;!&ndash;&lt;!&ndash;</div>&ndash;&gt;&ndash;&gt;-->
                          <!--&lt;!&ndash;&lt;!&ndash;</div>&ndash;&gt;&ndash;&gt;-->
                        <!--&lt;!&ndash;</template>&ndash;&gt;-->
                        <!--&lt;!&ndash;<template v-else>&ndash;&gt;-->
                          <!--&lt;!&ndash;<core-index :scope="scope" :child-colconfig="childColconfig" :info-index="infoIndex" :c-index="cIndex"></core-index>&ndash;&gt;-->
                          <!--&lt;!&ndash;&lt;!&ndash;<span style="margin-left: 10px" v-text="scope.row[childColconfig.prop]" :key="cIndex"></span>&ndash;&gt;&ndash;&gt;-->
                        <!--&lt;!&ndash;</template>&ndash;&gt;-->
                      <!--</template>-->

                      <!--<template v-else>-->
                        <!--<content-txt :scope="scope" :child-colconfig="childColconfig" :info-index="infoIndex" :c-index="cIndex" :col-config="colConfig" :runTime="'base'"></content-txt>-->
                        <!--&lt;!&ndash;<div&ndash;&gt;-->
                          <!--&lt;!&ndash;:style="{'text-align': (childColconfig._cellConfig&&childColconfig._cellConfig.hideTitle)?'center':'left'}"&ndash;&gt;-->
                          <!--&lt;!&ndash;:key="cIndex"&ndash;&gt;-->
                          <!--&lt;!&ndash;@click.stop="clickStop"&ndash;&gt;-->
                          <!--&lt;!&ndash;@dblclick.stop="clickStop">&ndash;&gt;-->
                          <!--&lt;!&ndash;<template v-if="childColconfig._cellConfig">&ndash;&gt;-->
                            <!--&lt;!&ndash;<template v-if="!childColconfig._cellConfig.hideTitle">&ndash;&gt;-->
                              <!--&lt;!&ndash;<span&ndash;&gt;-->
                                <!--&lt;!&ndash;v-reset-content-width="{index:infoIndex,cIndex,colConfig,childColconfig,rowIndex:scope.$index,isTitle:true}"&ndash;&gt;-->
                                <!--&lt;!&ndash;v-merga-width="{parentLayer:infoIndex,selfLayer:cIndex,id:'_0'+childColconfig.prop}"&ndash;&gt;-->
                                <!--&lt;!&ndash;:style="[childColconfig._cellConfig.titleStyle || (setColumnGlobalStyle?setColumnGlobalStyle.titleStyle:{}),setMiddleValue[infoIndex]?setMiddleValue[infoIndex].title:{}]"&ndash;&gt;-->
                                <!--&lt;!&ndash;v-text="childColconfig.label+':'">&nbsp</span>&ndash;&gt;-->
                            <!--&lt;!&ndash;</template>&ndash;&gt;-->
                          <!--&lt;!&ndash;</template>&ndash;&gt;-->
                          <!--&lt;!&ndash;<template v-else>&ndash;&gt;-->
                            <!--&lt;!&ndash;<span&ndash;&gt;-->
                              <!--&lt;!&ndash;v-reset-content-width="{index:infoIndex,cIndex,colConfig,childColconfig,rowIndex:scope.$index,isTitle:true}"&ndash;&gt;-->
                              <!--&lt;!&ndash;v-merga-width="{parentLayer:infoIndex,selfLayer:cIndex,id:'_0'+childColconfig.prop}"&ndash;&gt;-->
                              <!--&lt;!&ndash;:style="setMiddleValue[infoIndex]?setMiddleValue[infoIndex].title:{}"&ndash;&gt;-->
                              <!--&lt;!&ndash;v-text="childColconfig.label+':'">&nbsp</span>&ndash;&gt;-->
                          <!--&lt;!&ndash;</template>&ndash;&gt;-->
                          <!--&lt;!&ndash;<template v-if="childColconfig._cellConfig && childColconfig._cellConfig.events">&ndash;&gt;-->
                            <!--&lt;!&ndash;<span&ndash;&gt;-->
                              <!--&lt;!&ndash;v-reset-content-width="{index:infoIndex,cIndex,colConfig,childColconfig,rowIndex:scope.$index,isTitle:false}"&ndash;&gt;-->
                              <!--&lt;!&ndash;v-merga-width="{parentLayer:infoIndex,selfLayer:cIndex,id:'_1'+childColconfig.prop}"&ndash;&gt;-->
                              <!--&lt;!&ndash;:style="[childColconfig._cellConfig.bodyStyle || (setColumnGlobalStyle?setColumnGlobalStyle.bodyStyle:{}),setMiddleValue[infoIndex]?setMiddleValue[infoIndex].body:{}]">&ndash;&gt;-->
                              <!--&lt;!&ndash;<a v-text="scope.row[childColconfig.prop]"&ndash;&gt;-->
                                 <!--&lt;!&ndash;@click="mergeColumnEvents(childColconfig,scope)"></a>&ndash;&gt;-->
                            <!--&lt;!&ndash;</span>&ndash;&gt;-->
                          <!--&lt;!&ndash;</template>&ndash;&gt;-->
                          <!--&lt;!&ndash;<template v-else>&ndash;&gt;-->
                            <!--&lt;!&ndash;<span&ndash;&gt;-->
                              <!--&lt;!&ndash;v-reset-content-width="{index:infoIndex,cIndex,colConfig,childColconfig,rowIndex:scope.$index,isTitle:false}"&ndash;&gt;-->
                              <!--&lt;!&ndash;v-merga-width="{parentLayer:infoIndex,selfLayer:cIndex,id:'_1'+childColconfig.prop}"&ndash;&gt;-->
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
                    <!--&lt;!&ndash;<div :style="{display: colConfig._isShow?'block':'none'}" v-text="scope.row[colConfig.prop]"></div>&ndash;&gt;-->
                    <!--{{scope.row[colConfig.prop]}}-->
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
                  <svg-icon class="drag-handler theDragHandle" icon-class="drag" />
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
          :tableData="tableData.tableData"
          @send-height="customSummaryHeight"
          @custom-summary-value="customSummaryValue"></custom-summary-option>
      </template>
    </div>
    <div
      v-if="!hidePages && hasPageData"
      style="text-align: center;"
      :style="{'margin-top':(customSummaryOptionHeight || 5)+'px',height: this.setSmallPageHeight + 'px'}">
      <el-pagination
        :background="!smallPage"
        :small="smallPage"
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
  import { evil, filerTableTitle, GUID, internalId } from '@/utils/common'
  import tableFilter from '@/components/tableFilter'
  import customSummaryOption from '@/components/customSummaryOption'
  import { createRules, searchVal, getVal } from '@/utils/baseRules'
  import { isNumber } from '@/utils/validate'
  import constant from '@/utils/constant'
  // import {formatedTable} from '@/utils/customTableTools'
  import {customTableStore} from '@/store/dynaStore'
  import {deepClone} from '@/utils/deepClone'
  import {unCreateStore} from '@/store/dynaStore'

  // 测试数据
  import testData from '@/data/customBaseTableData'


export default {
    name: 'single-table',
    mixins: [mixin],
    provide(){
      return {
        rootVm: this
      }
    },
    props: {
      varList: {
        type: Array,
        default: function() {
          return []
        }
      },
      isFixed: {
        type: Number,
        default: 1
      },
      isSortable: {
        type: Boolean,
        default: false
      },
      useDefaultBtn: {
        type: Boolean,
        default: false
      },
      rowKey: {
        type: String,
        default: 'id'
      },
    },
    data() {
		  return {
		    componentName: 'singleTable',
        data: null,
        // wrapperWidth: 0,
        // tableWidth: 0,
        // fixedState: false,
        fixedList: [],
        //domTimer: '',
        scrollTimer: '',
        // baseTableWidth: '',
        checkedViewHeight: 0,
        pageId: '',
        initLoading: true,
        headerWidthList: [],
        headerWidthTimerList: [],
        listLength: -1,
        // baseRules: [],
        // ruleForm:{
        //   tableData:[]
        // },
        // restaurants: [],
        // debounce: 300,
        selectOptionList: [],
        selectLoading: false,
        // removalList: [],
        // selectOptionObj: {},
        tempVarList: [],
        guid: '',
        pageNo: 1,
        // tempCustomColumn: null,
        defaultOperation: {
          columnIndex: 'last',
          prop: 'operate',
          label: '操作',
          componentName: 'button',
          component: [{
            name: '删除',
            method: this.defaultDeleteRow
          }]
        },


        // 自动列宽度
        constantWidth: constant.tableComponentWidth,
        autoWidthTimer: {},
        autoWidthList: [],
        setScrollWidthTimer: -2,
        autoWidthSwitch: false,
        autoWidths: [],
        columnWidth: {},
        isLoading: true,

        //上传功能数据
        fileList: [],

        removalVarListTimer: null,
      }
    },
    components: {
      tableFilter,
      customSummaryOption,
    },
    directives: {
      'auto-width': {
        inserted(el, binding, vnode) {
          const that = vnode.context
          const num = binding.value.component ? binding.value.component.length : 0
          if (num > 1 && el.clientHeight > 60) {
            that.$set(that.columnWidth, binding.value.prop, Math.ceil(num / 2) * 60 + 25 + 'px')
          }
        }
      },
      'merga-width': {
        bind(el, binding, vnode) {
          !vnode.context.autoWidthTimer[binding.value.id] && (vnode.context.autoWidthTimer[binding.value.id] = -1)
        },
        inserted(el, binding, vnode) {
          !vnode.context.autoWidthList.length && (vnode.context.autoWidthList = vnode.context.setTitleList.map(v => { return [] }))
          vnode.context.$nextTick(_ => {
            if (vnode.context.autoWidthTimer[binding.value.id] === -1) {
              vnode.context.autoWidthTimer[binding.value.id] = setTimeout(_ => {
                const width = el.offsetWidth
                //console.log(width,el.innerText,el.offsetWidth)
                const value = binding.value
                const autoWidthList = vnode.context.autoWidthList
                if (autoWidthList[value.parentLayer].length) {
                  if (autoWidthList[value.parentLayer][value.selfLayer] > -1) {
                    const oldWidth = autoWidthList[value.parentLayer][value.selfLayer]
                    autoWidthList[value.parentLayer].splice(value.selfLayer, 1, width + oldWidth)
                  } else {
                    autoWidthList[value.parentLayer][value.selfLayer] = width
                  }
                } else {
                  const tempArr = []
                  tempArr[value.selfLayer] = width
                  autoWidthList.splice(value.parentLayer, 1, tempArr)
                }
                //console.log(autoWidthList,autoWidthList.length)
              }, 20)
            }
          })
        }
      }
    },
    computed: {
      setColumnGlobalStyle() {
        return this.columnGlobalStyle
      },
      setVarList(){
        return this.varList.concat([])
      },
      removalVarList() {
        // console.log('removalVarList')
        return this.removalVarLists(this.setVarList)
      },
      setInitLoading() {
        if (this.mergeTitle.length) return (this.initLoading || this.isLoading)
        return this.initLoading
      },
      setTableLoading() {
        if (this.showTableSet) return this.showTableSet && this.setInitLoading
        return this.setInitLoading
      },
      tableData() {
        //console.log(1)
        return this.$store.getters[this.guid + '/tableData'] || {}
      },
      resetPageDataHeight(){
        let height = 0
        if(typeof this.hidePages === 'boolean'){
          !this.hidePages && this.hasPageData
            ?(height = this.setSmallPageHeight)
            :''
        }else if(this.hidePages === undefined){
          height = this.setSmallPageHeight
        }
        return height
      },
      resetHeight() {
        return this.checkedViewHeight + this.customSummaryOptionHeight + this.resetPageDataHeight
      },
      tempCustomColumn(){
        return this.customColumn.concat([])
      },
      setCustomColumn() {
        if (this.useDefaultBtn) {
          const index = this.tempCustomColumn.findIndex(v => { return v.columnIndex === 'last' })
          index > -1 ? this.tempCustomColumn.splice(index, 1, this.defaultOperation) : this.tempCustomColumn.push(this.defaultOperation)
          //console.log(this.tempCustomColumn)
          return this.tempCustomColumn
        } else {
          return this.tempCustomColumn
        }
      }
    },
    created: function() {
      // console.log(this.setApiObj)
      this.guid = GUID()

      customTableStore(this)
      // this.tempCustomColumn = this.customColumn

      // if (this.initData.result) {
      //   const res = JSON.parse(JSON.stringify(this.initData))
      //   this.computedIds = []
      //   this.tempCheckedList = []
      //   this.$store.commit(this.guid + '/SET_TABLEDATA', {res, vm: this})
      //   this.pageId = this.$storage.get('menuId')
      //   this.setRowExpansion(this.tableData[this.dataName][0], true)
      //   this.setDragTable && this.setSort()
      //   this.initLoading = false
      // }

      if (this.setApiObj.apiName) {
        if (this.userInfo.userId === '0') {
          setTimeout(() => {
            //testData.result.varList.pop()
            this.data = testData
            if (this.data.result.varList && this.data.result.varList.length > 0) {
              this.data.result.varList.forEach(item => {
                item['rowState'] = '1'
              })
            }
            this.$store.commit(this.guid + '/SET_TABLEDATA', {res:this.data, vm: this})
            this.pageId = this.$storage.get('menuId')
            this.setDragTable && this.setSort()
            this.$store.commit(this.guid + '/SET_TABLERULELIST',{cb:this.tableRuleForm, ruleId:'root',vm:this})
            this.initLoading = false
          }, 1000)
        } else {
          this.httpRequests()
        }
      }
  },
    mounted: function() {
      this.setFixed()
      this.setTableCheckBoxDisplay()
      //console.log(this.initData,'initData')
    },
    beforeDestroy:function(){
      !this.layer && unCreateStore(this.$store, this.guid)
    },
    updated: function() {
    },
    watch: {
      'tableData.tableData': function() {
        this.setFixed()
        this.setTableCheckBoxDisplay()
      },
      'setApiObj.params'() {
        this.httpRequests()
      },
      autoWidthList: {
        deep: true,
        handler(n, o) {
          clearTimeout(this.setScrollWidthTimer)
          this.setScrollWidthTimer = setTimeout(_ => {
            this.autoWidths = n.map(v => {
              const max = Math.max.apply(null, v)
              return (max > -9999 && max < 9999) ? (max + 20) : 0
            })
            let maxWidth = 0
            this.autoWidths.forEach(v => { maxWidth += v })
            this.setShowCheckBox && (maxWidth += 55)
            this.setShowIndex && (maxWidth += 50)
            this.setDragTable && (maxWidth += 50)
            // maxWidth += this.setColumnWidth-0
            const tempNum = this.$el.clientWidth > maxWidth ? (this.$el.clientWidth - maxWidth) / this.autoWidthList.length : 0
            this.autoWidths = this.autoWidths.map(cv => {
              return cv ? cv + tempNum : null
            })
            this.setFixed()
            this.autoWidthSwitch = true
            this.isLoading = false
            // console.log(this.autoWidths)
          }, 100)
        }
      },
      removalVarList(){
        clearInterval(this.removalVarListTimer)
        this.removalVarListTimer = setInterval(_=>{
          if(this.tableData.titleList && this.tableData.titleList.length){
            clearInterval(this.removalVarListTimer)
            this.pushData(this.removalVarList)
          }
        },200)
        // console.log('------------------------------')
        // ;(n||[]).forEach((v,i)=>{
        //   for(let k in v){
        //     if(v.hasOwnProperty(k)){
        //       if(o && o.length){
        //         if(v[k] !== o[i][k]){
        //           console.log(k+':'+v[k],'new')
        //           console.log(k+':'+o[i][k],'old')
        //         }
        //       }
        //     }
        //   }
        // })
        // // ;(o||[]).forEach(v=>{
        // //   for(let k in v){
        // //     if(v.hasOwnProperty(k)){
        // //       console.log(k+':'+v[k],'old')
        // //     }
        // //   }
        // // })
        // console.log('------------------------------')
        // // if(o && o.length){
        // //   if(n[0]._internalId !== o[0]._internalId){
        // //     this.pushData(this.removalVarList)
        // //   }
        // // }else {
        // //   this.pushData(this.removalVarList)
        // // }

      },
      initData() {
        // console.log(this.initData,'this.initData')
        this.$store.commit(this.guid + '/SET_TABLERULELIST',{cb:null, ruleId:'root'})
        const res = JSON.parse(JSON.stringify(this.initData))
        this.$store.commit(this.setGuid + '/SET_TABLEDATA', {res, vm: this})
        this.pageId = this.$storage.get('menuId')
        // console.log(this.setDragTable,'this.setDragTable')
        this.setDragTable && this.setSort()
        this.pageNo = this.tableData.pageData?this.tableData.pageData.current||1:1
        this.initLoading = false
        this.$nextTick(_=>{
          this.scrollTable()
        })
        this.$store.commit(this.guid + '/SET_TABLERULELIST',{cb:this.tableRuleForm, ruleId:'root',vm:this})
      },
    },
    methods: {
      defaultDeleteRow(row, index, data) {
        // console.log(row, index, data)
        // this.data.result.varList.splice(index, 1)
        this.deleteData(row)
      },
      removalVarLists(list) {
        //console.log(list)
        if(this.useScenarios === 'transferTable') return deepClone(list)
        const tempArr = []
        list.forEach((v, index) => {
          !v._internalId && (v._internalId = internalId())
          const newV = JSON.parse(JSON.stringify(v))
          const item = this.tempVarList.find(cv => { return cv._internalId === newV._internalId })
          !item && tempArr.push(newV)
        })
        tempArr.length && (this.tempVarList = this.tempVarList.concat(tempArr))
        //console.log(tempArr)
        return tempArr
        // tempArr.forEach(rv => {
        //   this.tableData.tableData.push(rv)
        // })
      },
      httpRequests(pageNo) {
        this.initLoading = true
        this.$store.commit(this.guid + '/SET_TABLERULELIST',{cb:null, ruleId:'root'})
        //console.log(this.setApiObj)
        this.$api[this.setApiObj.apiName](Object.assign({}, this.setApiObj.params, { pageNo: pageNo || 1 })).then(res => {
          this.data = res
          this.pageNo = res.result.pageData?(res.result.pageData.current || 1):1
          if (this.data.result.varList && this.data.result.varList.length) {
            this.data.result.varList.forEach(item => {
              item['rowState'] = '1'
              item._internalId = internalId()
            })
          }
          this.$store.commit(this.guid + '/SET_TABLEDATA', {res:this.data, vm: this})
          this.pageId = this.$storage.get('menuId')
          this.setDragTable && this.setSort()
          this.initLoading = false
          // console.log('initLoading--->',this.initLoading)
          if (pageNo) {
            this.$nextTick(_=>{
              this.scrollTable()
            })
          }
          this.$store.commit(this.guid + '/SET_TABLERULELIST',{cb:this.tableRuleForm, ruleId:'root',vm:this})
        }).catch(err => {
          console.log(err)
          this.initLoading = false
        })
      },
      setStyle(row) {
      },
      selectItem(selection, row) {
        this.$emit('databridge', selection, row)
        if (this.isSingle) {
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
        }else {}
      },
      selectAllItem(selection) {
        if (this.isSingle) {
          if (selection.length) {
            for (let i = selection.length - 1; i >= 0; i--) {
              selection.splice(i, 1)
            }
          }
        } else {
          this.$emit('databridge', selection)
        }
      },
      handleCurrentChange(pageIndex) {
        if(pageIndex !== this.pageNo){
          if(this.setApiObj.apiName){
            this.httpRequests(pageIndex) && (this.tempVarList = [])
          }else {
            this.$emit('current-change',pageIndex)
          }
        }
        // pageIndex !== this.pageNo && this.httpRequests(pageIndex) && (this.tempVarList = [])
      },

      //外部手动更新全表数据，通用方法
      updateTable(){
        if(this.setApiObj && this.setApiObj.apiName){
          this.httpRequests()
        }

        //测试
        // this.initLoading = true
        // // this.mergeTitle.length && (this.isLoading = true)
        // setTimeout(() => {
        //   // testData.result.varList.pop()
        //   const test = JSON.parse(JSON.stringify(testData))
        //   this.data = test
        //   if (this.data.result.varList && this.data.result.varList.length > 0) {
        //     this.data.result.varList.forEach(item => {
        //       item['rowState'] = '1'
        //     })
        //   }
        //   this.pageId = this.$storage.get('menuId')
        //   // this.baseRules = this.createRult(this.customColumn)
        //   // this.ruleForm.tableData = this.tableData.tableData
        //   // this.selectOptionList = this.createSelectOptions
        //   this.initLoading = false
        //   //this.mergeTitle.length && (this.isLoading = false)
        // }, 1000)
      },
      updateData(){
        if(this.setApiObj && this.setApiObj.apiName){
          this.httpRequests()
        }
      },
    }
}
</script>

<style lang="scss" scoped rel="text/css">
  .columnBaseTable {
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
    .drag-handler{
      width: 20px !important;
      height: 20px !important;
      cursor: move !important;
    }
    .customTableRowResetClass {
      white-space: nowrap;
    }
  }


</style>
