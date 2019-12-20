import * as button from './button'
import * as company from './company'
import * as department from './department'
import * as dictionary from './dictionary'
import * as employee from './employee'
import * as mainPage from './mainPage'
import * as logInfo from './logInfo'
import * as menu from './menu'
import * as bom from './bom'
import * as bomTree from './bomTree'
import * as post from './post'
import * as role from './role'
import * as product from './product'
import * as productUnit from './productUnit'
import * as table from './table'
import * as template from './template'
import * as user from './user'
import * as userLogin from './userLogin'
import * as customer from './customer'
import * as system from './system'
import * as message from './message'
import * as attachments from './attachments'
import * as equipment from './equipment'

import * as financeBase from './financeBase'
import * as financeBill from './financeBill'
import * as financeHistory from './financeHistory'
import * as financeInvoice from './financeInvoice'

import * as warehouseBase from './warehouseBase'
import * as warehouseInitial from './warehouseInitial'
import * as warehouseInitialBySimple from './warehouseInitialBySimple'
import * as warehouseIn from './warehouseIn'
import * as warehouseInDetail from './warehouseInDetail'
import * as warehouseInExecutor from './warehouseInExecutor'
import * as warehouseInExecute from './warehouseInExecute'
import * as warehouseOut from './warehouseOut'
import * as warehouseOutExecute from './warehouseOutExecute'
import * as warehouseOutDetail from './warehouseOutDetail'
import * as warehouseProduct from './warehouseProduct'
import * as warehouseCheck from './warehouseCheck'
import * as warehouseCheckDetail from './warehouseCheckDetail'
import * as warehouseCheckExecutor from './warehouseCheckExecutor'
import * as warehouseCheckExecute from './warehouseCheckExecute'
import * as warehouseMove from './warehouseMove'
import * as warehouseMoveDetail from './warehouseMoveDetail'

import * as warehouseInBySimple from './warehouseInBySimple'
import * as warehouseOutBySimple from './warehouseOutBySimple'
import * as warehouseOutScrapBySimple from './warehouseOutScrapBySimple'
import * as warehouseCheckBySimple from './warehouseCheckBySimple'
import * as warehouseMoveBySimple from './warehouseMoveBySimple'

//文成企业(定制化)
import * as warehouseInByWc from './warehouseInByWc'
import * as warehouseOutByWc from './warehouseOutByWc'

import * as saleOrder from './saleOrder'
import * as saleOrderDetail from './saleOrderDetail'
import * as saleDeliver from './saleDeliver'
import * as saleDeliverDetail from './saleDeliverDetail'
import * as saleReceive from './saleReceive'
import * as saleReceiveDetail from './saleReceiveDetail'
import * as saleInvoice from './saleInvoice'
import * as saleInvoiceDetail from './saleInvoiceDetail'
import * as saleRetreat from './saleRetreat'
import * as saleRetreatDetail from './saleRetreatDetail'
import * as saleUnitPrice from './saleUnitPrice'
import * as saleOrderChange from './saleOrderChange'
import * as saleOrderDetailChange from './saleOrderDetailChange'
import * as saleWaresRetreat from './saleWaresRetreat'
import * as saleWaresRetreatDetail from './saleWaresRetreatDetail'

import * as bundleAnalysis from './bundleAnalysis'
import * as purchasePlan from './purchasePlan'
import * as purchasePlanDetail from './purchasePlanDetail'

import * as purchaseOrder from './purchaseOrder'
import * as purchaseOrderDetail from './purchaseOrderDetail'

import * as purchaseSign from './purchaseSign'
import * as purchaseSignDetail from './purchaseSignDetail'

import * as purchaseCompanyPeriod from './purchaseCompanyPeriod'
import * as purchasePaymentBuild from './purchasePaymentBuild'
import * as purchasePaymentHistory from './purchasePaymentHistory'
import * as purchasePaymentRecord from './purchasePaymentRecord'

import * as purchaseRetreat from './purchaseRetreat'
import * as purchaseRetreatDetail from './purchaseRetreatDetail'

//设备
import * as equipmentSensor from './equipmentSensor'
import * as equipmentStatus from './equipmentStatus'
import * as equipmentWarehouseInBySpare from './equipmentWarehouseInBySpare'
import * as equipmentWarehouseOutBySpare from './equipmentWarehouseOutBySpare'
import * as equipmentWarehouseInitialBySpare from './equipmentWarehouseInitialBySpare'
import * as equipmentWarehouseLoginfoBySpare from './equipmentWarehouseLoginfoBySpare'

import * as equipmentRepair from './equipmentRepair'
import * as equipmentRepairTask from './equipmentRepairTask'
import * as equipmentRepairTaskDetail from './equipmentRepairTaskDetail'

import * as equipmentMaintainContent from './equipmentMaintainContent'
import * as equipmentMaintainPlan from './equipmentMaintainPlan'
import * as equipmentMaintain from './equipmentMaintain'
import * as equipmentMaintainTask from './equipmentMaintainTask'
import * as equipmentMaintainTaskDetail from './equipmentMaintainTaskDetail'

const obj = Object.assign({},
  menu,button,company,department,dictionary,
  employee,mainPage,logInfo,post,role,bom,bomTree,
  product,productUnit,table,template,user,userLogin,customer,system,message,
  attachments,equipment,

  financeBase,financeBill,financeHistory,financeInvoice,

  warehouseBase,warehouseInitial,warehouseInitialBySimple,
  warehouseIn,warehouseInDetail,warehouseInExecutor,warehouseInExecute,
  warehouseOut,warehouseOutDetail,warehouseOutExecute,
  warehouseProduct,warehouseMove,warehouseMoveDetail,
  warehouseCheck,warehouseCheckDetail,warehouseCheckExecutor,warehouseCheckExecute,
  warehouseInBySimple,warehouseOutBySimple,warehouseOutScrapBySimple,warehouseCheckBySimple,warehouseMoveBySimple,

  //文成企业(定制化)
  warehouseInByWc,warehouseOutByWc,

  saleOrder,saleOrderDetail,
  saleDeliver,saleDeliverDetail,
  saleReceive,saleReceiveDetail,
  saleInvoice,saleInvoiceDetail,
  saleRetreat,saleRetreatDetail,
  saleUnitPrice,
  saleOrderChange,saleOrderDetailChange,
  saleWaresRetreat,saleWaresRetreatDetail,

  purchaseSign,purchaseSignDetail,
  purchasePlan,purchasePlanDetail,
  purchaseOrder,purchaseOrderDetail,
  purchaseCompanyPeriod,purchasePaymentBuild,purchasePaymentHistory,purchasePaymentRecord,
  purchaseRetreat,purchaseRetreatDetail,bundleAnalysis,

  equipmentSensor,
  equipmentStatus,
  equipmentWarehouseInBySpare,equipmentWarehouseOutBySpare,equipmentWarehouseInitialBySpare,equipmentWarehouseLoginfoBySpare,
  equipmentRepair,equipmentRepairTask,equipmentRepairTaskDetail,
  equipmentMaintainContent,equipmentMaintainPlan,equipmentMaintain,equipmentMaintainTask,equipmentMaintainTaskDetail)
export default obj
