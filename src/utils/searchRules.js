import regexp from './regexp'
import { isNumber } from './validate'

const rulesFn = name => {
  let regStr = regexp[name] || ''
  return (rule, value, callback) => {
    let min, max, tempStr
    if (rule.ops && (typeof rule.ops === 'object')) {
      if (rule.ops.len) {
        min = max = rule.ops.len - 0
      } else {
        min = isNumber(rule.ops.min) ? rule.ops.min : 0
        max = isNumber(rule.ops.max) ? rule.ops.max : 0
      }
      tempStr = max >= min ? (min + ',' + (max || '')) : '0,'
      if (rule.ops.customReg && typeof rule.ops.customReg === 'string') {
        regStr = rule.ops.customReg
      } else {
        regStr = regStr.replace(/placeholder/g, tempStr)
      }
    } else {
      regStr = regStr.replace(/placeholder/g, '0,')
    }
    if (value) {
      const reg = new RegExp(regStr, 'g')
      if (reg.test(value)) {
        callback()
      } else {
        callback(' ')
      }
    } else {
      callback()
    }
  }
}

const rules = {}
for (const k in regexp) {
  if (regexp.hasOwnProperty(k)) {
    rules[k] = ops => [{ validator: rulesFn(k), trigger: 'change', ops: ops }]
  }
}

export default rules
