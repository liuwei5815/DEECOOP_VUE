import constant from './constant'

const reg = {}
reg[constant.code] = `^[A-Za-z0-9]{placeholder}$`
reg[constant.number] = `\\d{placeholder}$`
reg[constant.date] = `^(\\d{1,4})(-|\\/)(\\d{1,2})\\2(\\d{1,2})$`
reg[constant.month] = `^[0-9]{4}\\-[0-9]{2}$`
reg[constant.week] = `^[0-9]{4}[\\u7b2c][0-9]{2}[\\u5468]$`
reg[constant.year] = `^[0-9]{4}$`
reg[constant.time] = `^(\\d{1,2})(-|\\:)(\\d{1,2})\\2(\\d{1,2})$`
reg[constant.mobile] = `^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\\d{8}$`
reg[constant.email] = `[\\w!#$%&'*+/=?^_\`{|}~-]+(?:\\.[\\w!#$%&'*+/=?^_\`{|}~-]+)*@(?:[\\w](?:[\\w-]*[\\w])?\\.)+[\\w](?:[\\w-]*[\\w])?`
reg[constant.url] = `[a-zA-z]+:\\/\\/[^\\s]*`
reg[constant.zh] = `^[\u4e00-\u9fa5]{placeholder}$`
reg[constant.en] = `^[A-Za-z]{placeholder}$`
reg[constant.identity] = `^(\\d{6})(\\d{4})(\\d{2})(\\d{2})(\\d{3})([0-9]|X|x)$`
reg[constant.float] = `^(-?\\d+)(\\.\\d+)?$`
reg[constant.int] = `^-?\\d+$`

export default reg
