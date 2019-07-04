import XLSX from 'xlsx'

// 读取excel
export function getExcel (file, callback) {
  var reader = new FileReader()
  return new Promise(function (resolve) {
    reader.onload = function (e) {
      var data = e.target.result
      var workbook = XLSX.read(data, {type: 'binary'})
      console.log('取到你了')
      console.log(workbook)
      resolve(callback(workbook))
    //   callback(workbook)
    }
    reader.readAsBinaryString(file)
  })
}
// 判断sheet个数，并返回sheet名称用于选择
export function getSheets (wb) {
  let res = []
  let sheetNames = wb.SheetNames
  let sheets = wb.Sheets
  console.log(sheets)
  for (let i = 0; i < sheetNames.length; i++) {
    let sheetName = sheetNames[i]
    console.log(sheets[sheetName]) // []变量  .确定值
    let sheet = sheets[sheetName]
    if (sheet.hasOwnProperty('!ref')) {
      res.push(sheetName)
    }
  }
  console.log(res)
  return res
}

// 把sheet内容转成json，并返回
