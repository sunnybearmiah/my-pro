import XLSX from 'xlsx'

export class Excel {
  workbook () {
    return this.workbook
  }
  // 读取excel
  getExcel (file, callback, args) {
    var reader = new FileReader()
    return new Promise(function (resolve) {
      reader.onload = function (e) {
        var data = e.target.result
        this.workbook = XLSX.read(data, {type: 'binary'})
        console.log('取到你了')
        console.log(this.workbook)
        //   resolve(callback(workbook))
        args.push(this.workbook) // 放在最后面
        resolve(callback.apply(this, args))
      }
      reader.readAsBinaryString(file)
    })
  }
  // 判断sheet个数，并返回sheet名称用于选择
  getSheets (wb) {
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
  shToJson (sheetName, wb) {
    let res = []
    let ws = wb.Sheets[sheetName]
    res = XLSX.utils.sheet_to_json(ws)
    console.log(res)
    return res
  }
}
