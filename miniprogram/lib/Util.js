/**
 * 工具类
 */

/**
 * API_key
 */
var amap_key = "5406458d3b826e46c643ed51a9d4132b"
var qqmap_key = "HEIBZ-Y67KW-JKIRI-O2A45-CO4D6-UTBNX"
var jisu_key = "746b621c85938173"


var item = ""
/**
 * 字符串操作方法 
 * 
 */
/**
 * 对传入的字符串进行数组化处理（传入的字符串表示含义为数组时）
 */
//数组内容为对象--以{}为判断依据
function stringToArrayByObject(str) {
  var arr = []
  var start = 0;
  for (var i = 0; i < str.length; i++) {
    if (str[i] == '{') {
      start = i
    }
    if (str[i] == '}') {
      arr.push(str.substring(start, i + 1))
    }
  }
  return arr
}
/**
 * 字符串截取
 * 1.去掉下标startIndex至下标endIndex的字符
 */
function processStationName(originalString, startIndex, endIndex) {
  if (startIndex < endIndex) {
    //1.startIndex前无字符，endIndex后有字符
    if (startIndex == 0 && endIndex < originalString.length - 1) {
      return originalString.substring(endIndex + 1, originalString.length)
    }
    //2.startIndex前有字符，endIndex后有字符
    if (startIndex > 0 && endIndex < originalString.length - 1) {
      return originalString.substring(0, startIndex) + originalString.substring(endIndex + 1, originalString.length)
    }
    //3.startIndex前有字符，endIndex后无字符
    if (startIndex > 0 && endIndex == originalString.length - 1) {
      return originalString.substring(0, startIndex)
    }
    //4.startIndex于endIndex前后都无字符
    if (startIndex == 0 && endIndex == originalString.length - 1) {
      console.error('erro: cannot delet all string = ' + originalString + ' ! startIndex == 0 && endIndex == originalString.length - 1 ')
    }
  } else {
    console.error('erro: startIndex >= endIndex')
  }
}

//判断传入的开头是否为想要的开头（true-相同/false-不同）
function judgeTitle(beJudged, judged) {
  var str = beJudged.substring(0, judged.length)
  if (judged == str)
    return true
  else
    return false
}

//是否重复判断(true-不重复/false-重复)
//存在同一条线路名，却会出现不同起终点的线路。列如：成都-地铁1号线
function isRepeat(lineList, line) {
  if (lineList.length == 0) //list长度为0时直接返回true
    return true
  else {
    for (var i = 0; i < lineList.length; i++) {
      if (line.transitno == lineList[i].transitno) { //线路名相同时判断起点和终点是否为交换关系，是则返回false
        if (line.startstation == lineList[i].endstation && line.endstation == lineList[i].startstation)
          return false
      }
    }
    return true
  }
}
// // 查询公交线路
// function searchBusLine(cityid, value) {
//   var that = this
//   wx.request({
//     url: 'https://api.jisuapi.com/transit/line?cityid=' + cityid + '&transitno=' + value + '&appkey=' + jisu_key,
//     success: function(res) {
//       //修改数据subway项
//       var list = res.data.result[0].list;
//       for (var i = 0; i < list.length; i++) {
//         if (list[i].subway == null) {
//           var subway = [];
//           var s = {}
//           s.color = '#0095ff';
//           s.name = null;
//           subway.push(s)
//           list[i].subway = subway
//         } else {
//           var subway = [];
//           var arr = that.stringToArrayByObject(list[i].subway);
//           for (var j = 0; j < arr.length; j++) {
//             var s = {};
//             s.color = arr[j].substring(21, 28);
//             s.name = arr[j].substring(62, arr[j].length - 10);
//             subway.push(s)
//           }
//           list[i].subway = subway
//         }
//       }
//       // 装载数据
//       var stationlist = {}
//       stationlist.transitno = res.data.result[0].transitno; //线路名
//       stationlist.timetable = res.data.result[0].timetable; //发车收车
//       stationlist.price = res.data.result[0].price; //票价
//       stationlist.list = list; //站点列表
//       stationlist.lastStation = res.data.result[0].list.length - 1; //最后一站
//       // 设定
//       item = JSON.stringify(stationlist)
//     },
//     fail: function(error) {
//       console.error(error);
//     },
//     complete: function(res) {
//       console.log(res);
//     }
//   })
// }

module.exports = {
  processStationName: processStationName,
  judgeTitle: judgeTitle,
  isRepeat: isRepeat,
  stringToArrayByObject: stringToArrayByObject,
  // searchBusLine: searchBusLine,
}