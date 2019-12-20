module.exports = function(content) {
  const cbStr = '<custom-base-table',mbStr = '<multilevel-table',pathStr = this.resourcePath;
  let result = '',tableId;
  if(new RegExp(cbStr).test(content) || new RegExp(mbStr).test(content)){
    tableId = pathStr.slice(pathStr.search(/\\src\\/i) + 5).slice(0,-4).replace(/\\/g,'_')
    let results = content.split(cbStr),idIndex = -1;
    results.forEach((v,i)=>{
      if(i<results.length-1) idIndex++
      result += (v + (i<(results.length-1)?`${cbStr} data-custom-table-id="${tableId + idIndex}"`:''))
    })
    results = result.split(mbStr)
    results.forEach((v,i)=>{
      if(i<results.length-1) idIndex++
      result += (v + (i<(results.length-1)?`${mbStr} data-custom-table-id="${tableId + idIndex}"`:''))
    })
    return result
  }else {
    return content
  }
}
