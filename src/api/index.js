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


const obj = Object.assign({},
  menu,button,company,department,dictionary,
  employee,mainPage,logInfo,post,role,bom,bomTree,
  product,productUnit,table,template,user,userLogin,customer,system,message,
  attachments,equipment
)
export default obj
