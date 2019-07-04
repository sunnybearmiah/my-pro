export function clearData (data) { // 清空绑定的数据
  if (data instanceof Object) {
    for (var k in data) {
      data[k] = ''
    }
    return data
  } else if (data instanceof Array) {
    data = []
    return data
  }
}

export function objIsNull (data) { // 判断数据是否为空 空true 非空false
  if (data instanceof Object) {
    for (var k in data) {
      let v = data[k]
      if (v.length > 0 || v !== '') {
        console.log('v: ' + v)
        return false
      }
    }
    return true
  } else if (data instanceof Array) {
    if (data.length === 0 || !data) {
      return true
    } else {
      return false
    }
  }
}
