/**
 * 工具类
 */

var amap_key = "5406458d3b826e46c643ed51a9d4132b"
var qqmap_key = "HEIBZ-Y67KW-JKIRI-O2A45-CO4D6-UTBNX"
var jisu_key = "746b621c85938173"

var Utils = {
  /**
   * 处理站点名称
   */
  //1.去掉startChar至endChar的字符
  processStationName(originalString, startChar, endChar) {
    var p = 0;
    var name = '';
    for (var i = 0; i < originalString; i++) {
      var char = originalString.charAt(i)
      if (p == 0) {
        if (char != startChar) {
          name += char
        } else {
          p = 1
        }
      } else if (p == 1) {
        if (char == endChar) {
          p = 2
        }
      } else {
        name += char
      }
    }
    if (p == 2)
      return name
    else if (p == 1)
      console.log('not fount endChar')
    else
      console.log('not fount startChar')
  },

  //2.去掉一个字符或字符串
  processStationName(stationName, processString) {
    var name = stationName

    return name
  }
}