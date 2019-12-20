export default {
  timeStamp:(str)=>{
    if(typeof str === 'string'){
      const list = str.split(' ')
      if(list.length === 1){
        const strList = list[0].match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/)
        if(strList === null){
          return new Date().getTime()
        }else {
          return new Date(strList[1],strList[3]-1,strList[4]).getTime()
        }
      }else {
        const dateList = list[0].match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/)
        const timeList = list[1].match(/^(\d{1,2})(-|\:)(\d{1,2})\2(\d{1,2})$/)
        if(!dateList || !timeList){
          return new Date().getTime()
        }else {
          return new Date(dateList[1],dateList[3]-1,dateList[4],timeList[1],timeList[3],timeList[4]).getTime()
        }
      }
    }else if(typeof str === 'number'){
      return 3600*24*1000*str
    }else {
      return new Date().getTime()
    }
  },
  formatDate: (timeStamp,str)=>{
    const date = timeStamp?new Date(timeStamp):new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    const formatNumber = n => {
      n = n.toString()
      return n[1] ? n : '0' + n
    }
    return [year, month, day].map(formatNumber).join(str||'-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
}
