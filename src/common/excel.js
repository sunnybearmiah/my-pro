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

// 把sheet内容转成json，并返回
export function shToJson (sheetName, wb) {
  let res = []
  let ws = wb.Sheets[sheetName]
  res = XLSX.utils.sheet_to_json(ws)
  return res
}
