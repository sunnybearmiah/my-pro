import XLSX from 'xlsx'

// 读取excel
export function getExcel (file, callback, args) {
  var reader = new FileReader()
  return new Promise(function (resolve) {
    reader.onload = function (e) {
      var data = e.target.result
      let workbook = XLSX.read(data, {type: 'binary'})
      args.push(workbook) // 放在最后面
      resolve(callback.apply(this, args))
    }
    reader.readAsBinaryString(file)
  })
}
// 判断sheet个数，并返回sheet名称用于选择
export function getSheets (wb) {
  let res = []
  let sheetNames = wb.SheetNames
  let sheets = wb.Sheets

  for (let i = 0; i < sheetNames.length; i++) {
    let sheetName = sheetNames[i]
    let sheet = sheets[sheetName]
    if (sheet.hasOwnProperty('!ref')) {
      res.push(sheetName)
    }
  }
  return res
}

// 把sheet内容转成json，并返回sheet头部
export function shToJson (sheetName, wb) {
  let result = []
  let res = []
  let ws = wb.Sheets[sheetName]
  let header = []
  let rg = ws['!ref'].split(':')[1]
  let patt = /[0-9]+/
  let val = patt.exec(rg)[0]
  for (let i = 65; i <= rg.charCodeAt(0); i++) {
    let code = ws[(String.fromCharCode(i) + 1)].v
    header.push(code)
  }
  res = XLSX.utils.sheet_to_json(ws)
  result.push(header)
  result.push(res)
  result.push(parseInt(val) - 1)
  return result
}
