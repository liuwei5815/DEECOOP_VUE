export default {
  route: {
    dashboard: '首页',
    introduction: '简述',
    documentation: '文档',
    guide: '引导页',
    permission: '权限测试页',
    pagePermission: '页面权限',
    directivePermission: '指令权限',
    icons: '图标',
    components: '组件',
    componentIndex: '介绍',
    tinymce: '富文本编辑器',
    markdown: 'Markdown',
    jsonEditor: 'JSON编辑器',
    dndList: '列表拖拽',
    splitPane: 'Splitpane',
    avatarUpload: '头像上传',
    dropzone: 'Dropzone',
    sticky: 'Sticky',
    countTo: 'CountTo',
    componentMixin: '小组件',
    backToTop: '返回顶部',
    dragDialog: '拖拽 Dialog',
    dragKanban: '可拖拽看板',
    charts: '图表',
    keyboardChart: '键盘图表',
    lineChart: '折线图',
    mixChart: '混合图表',
    example: '综合实例',
    nested: '路由嵌套',
    menu1: '菜单1',
    'menu1-1': '菜单1-1',
    'menu1-2': '菜单1-2',
    'menu1-2-1': '菜单1-2-1',
    'menu1-2-2': '菜单1-2-2',
    'menu1-3': '菜单1-3',
    menu2: '菜单2',
    dynamicTable: '动态Table',
    dragTable: '拖拽Table',
    inlineEditTable: 'Table内编辑',
    complexTable: '综合Table',
    treeTable: '树形表格',
    customTreeTable: '自定义树表',
    tab: 'Tab',
    form: '表单',
    createArticle: '创建文章',
    editArticle: '编辑文章',
    articleList: '文章列表',
    errorPages: '错误页面',
    page401: '401',
    page404: '404',
    errorLog: '错误日志',
    excel: 'Excel',
    exportExcel: 'Export Excel',
    selectExcel: 'Export Selected',
    uploadExcel: 'Upload Excel',
    zip: 'Zip',
    exportZip: 'Export Zip',
    theme: '换肤',
    clipboardDemo: 'Clipboard',
    i18n: '国际化',

    //******菜单名称******
    table: '报表',
    product: '生产',
    //******系统设置******
    system: '系统设置',
      company: '企业账号申请',
      user: '用户管理',
      usermanage: '用户管理',
      menumanage: '菜单管理',
      template: '系统开发模板',
      dictionary: '数据字典',
      role: '角色权限',
      auths: '权限管理',
      accountHome: '自定义主页',
      logInfo: '操作日志',
    //******销售******
    order: '销售',

    home: '首页',
    quality: '质量',
    //******人事******
    emp: '人事',
      department: '组织管理',
      post: '岗位管理',
      employee: '员工管理',
    //******仓储******
    warehouse: '仓储',

    rootTree: '全部菜单',
  },
  navbar: {
    logOut: '退出登录',
    dashboard: '首页',
    github: '项目地址',
    screenfull: '全屏',
    theme: '换肤',
    home: '首页'
  },
  login: {
    title: '系统登录',
    logIn: '登录',
    username: '账号',
    password: '密码',
    any: '随便填',
    thirdparty: '第三方登录',
    thirdpartyTips: '本地不能模拟，请结合自己业务进行模拟！！！'
  },
  documentation: {
    documentation: '文档',
    github: 'Github 地址'
  },
  permission: {
    roles: '你的权限',
    switchRoles: '切换权限'
  },
  guide: {
    description: '引导页对于一些第一次进入项目的人很有用，你可以简单介绍下项目的功能。本 Demo 是基于',
    button: '打开引导'
  },
  components: {
    documentation: '文档',
    tinymceTips: '富文本是管理后台一个核心的功能，但同时又是一个有很多坑的地方。在选择富文本的过程中我也走了不少的弯路，市面上常见的富文本都基本用过了，最终权衡了一下选择了Tinymce。更详细的富文本比较和介绍见',
    dropzoneTips: '由于我司业务有特殊需求，而且要传七牛 所以没用第三方，选择了自己封装。代码非常的简单，具体代码你可以在这里看到 @/components/Dropzone',
    stickyTips: '当页面滚动到预设的位置会吸附在顶部',
    backToTopTips1: '页面滚动到指定位置会在右下角出现返回顶部按钮',
    backToTopTips2: '可自定义按钮的样式、show/hide、出现的高度、返回的位置 如需文字提示，可在外部使用Element的el-tooltip元素',
    imageUploadTips: '由于我在使用时它只有vue@1版本，而且和mockjs不兼容，所以自己改造了一下，如果大家要使用的话，优先还是使用官方版本。'
  },
  table: {
    dynamicTips1: '固定表头, 按照表头顺序排序',
    dynamicTips2: '不固定表头, 按照点击顺序排序',
    dragTips1: '默认顺序',
    dragTips2: '拖拽后顺序',
    title: '标题',
    importance: '重要性',
    type: '类型',
    remark: '点评',
    search: '搜索',
    add: '添加',
    export: '导出',
    reviewer: '审核人',
    id: '序号',
    date: '时间',
    author: '作者',
    readings: '阅读数',
    status: '状态',
    actions: '操作',
    edit: '编辑',
    publish: '发布',
    draft: '草稿',
    delete: '删除',
    cancel: '取 消',
    confirm: '确 定',
    inputKeyword: '请输入关键字'
  },
  errorLog: {
    tips: '请点击右上角bug小图标',
    description: '现在的管理后台基本都是spa的形式了，它增强了用户体验，但同时也会增加页面出问题的可能性，可能一个小小的疏忽就导致整个页面的死锁。好在 Vue 官网提供了一个方法来捕获处理异常，你可以在其中进行错误处理或者异常上报。',
    documentation: '文档介绍'
  },
  excel: {
    export: '导出',
    selectedExport: '导出已选择项',
    placeholder: '请输入文件名(默认excel-list)'
  },
  zip: {
    export: '导出',
    placeholder: '请输入文件名(默认file)'
  },
  theme: {
    change: '换肤',
    documentation: '换肤文档',
    tips: 'Tips: 它区别于 navbar 上的 theme-pick, 是两种不同的换肤方法，各自有不同的应用场景，具体请参考文档。'
  },
  tagsView: {
    close: '关闭',
    closeOthers: '关闭其它',
    closeAll: '关闭所有'
  },
  baseTable: {

  },
  input: {
    menuName: '菜单名称'
  },
  dialog: {
    btnManage: '按钮管理',
    btnName: '按钮名称',
    btnNameEn: '英文名称',
    btnAttribute: '按钮属性：',
    btnSequence: '显示顺序：',
    update: '编辑按钮',
    create: '新增按钮',
    currentMenu: '当前所属菜单：'
  },
  btn: {
    add: '新增',
    delete: '删除',
    goback: '返回',
    addBtns: '新增按钮',
    edit: '编辑',
    btnManage: '按钮管理',
    query: '查询',
    reset: '重置',
    import: '导入',
    export: '导出',
    menuRole: '菜单权限',
    btnRole: '按钮权限',
    assign: '分配用户',
    empty: '清空',
    resetPW: '重置密码',

    //员工管理-按钮
    employee_OpenCode:    '开通账号',
    employee_ChangePost:  '岗位变更',
    employee_AddMorePost: '新增兼岗',

    changePW: '修改密码',
    viewEmployee: '查看员工',
    bindEmployee: '绑定员工',
    unbindEmployee: '解除绑定',
  },
  save: '保存',
  close: '关闭',
  serialNumber: '序号',
  retract: '收起搜索',
  openSearch: '展开搜索',
  menuManage: {
    operation: '操作',
    name: '菜单名称',
    serialNumber: '显示顺序',
    url:'页面路径',
    isdisable: '状态',
    superiorMenu: '上级菜单：',
    dialogName: '菜单名称：',
    dialogSerialNumber: '显示顺序：',
    dialogUrl:'页面路径：',
    update: '编辑菜单',
    create: '新增菜单',
    value: '按钮属性值',
    nameEn: '英文名称',
    isdisableName: '状态',

    table: '报表',
    product: '生产',
    system: '系统设置',
      company: '企业账号申请',
      user: '用户管理',
      menumanage: '菜单管理',
      template: '系统开发模板',
      dictionary: '数据字典',
      role: '角色权限',
      auths: '权限管理',
      accountHome: '自定义主页',
      logInfo: '操作日志',
    order: '销售',
    home: '首页',
    quality: '质量',
    emp: '人事',
      department: '组织管理',
      post: '岗位管理',
      employee: '员工管理',
    warehouse: '仓储',
    rootTree: '全部菜单',
  },
  dictionary: {
    code: '编码',
    name: '名称',
    isEnabled: '是否启用',
    placechoose: '请选择',
    yes: '是',
    no: '否',
    query: '查询',
    rootTree: '全部分类',
    update: '编辑',
    create: '新增',
    superior: '上级',
    dialogName: '名称',
    dialogRemark: '备注',
    remark: '备注',
    isdisable: '状态',
  },
  role: {
    code: '角色编码',
    name: '角色名称',
    isEnabled: '是否启用',
    placechoose: '请选择',
    yes: '是',
    no: '否',
    query: '查询',
    rootTree: '全部分类',
    update: '编辑',
    create: '新增',
    superior: '上级',
    dialogName: '角色名称',
    dialogRemark: '备注',
    remark: '备注',
    isdisable: '状态',
    menuRole: '菜单权限',
    menuRoleTitle: '当前角色',
    btnRole: '按钮权限',
    assign: '分配用户',
    leftTitle: '全部用户',
    rightTitle: '已分配用户',
    num: '序号',
    account: '账号',
    userName: '姓名',
    import: '导入',
    export: '导出',
    delete: '删除',
    add: '新增',
    showhidedelp: '显示封存部门',

  },
  usermanage: {
    auth: '账号',
    inputAuth: '请输入账号',
    name: '名称',
    inputName: '请输入名称',
    inputPhoneNum: '请输入手机',
    phoneNum: '手机号',
    mail: '邮箱',
    inputMail: '请输入邮箱',
    userType: '用户类型',
    placechoose: '请选择',
    system: '超级管理员',
    company: '企业管理员',
    user: '普通用户',
    external: '外部用户',
    isEnabled: '是否启用',
    yes: '是',
    no: '否',
    refresh: '重置密码',
    import: '导入',
    export: '导出',
    delete: '删除',
    add: '新增',
  },

  employee: {
    add: '新增11111',
  },
  base: {
    inputKeyword: '',
    ok: '确 定',
    cancel: '取 消',
    dictionary: '数据字典',
    clear: '清 空',
    dialogPost: '设置岗位',
    showhidedelp: '显示封存部门',
    showPwd: '显示密码',
    dialogBindStaff: '绑定员工',
    bindStaff: '绑定',
    userCode: '工号',
    name: '姓名'
  }
}
