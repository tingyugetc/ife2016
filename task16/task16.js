/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
  var dataCity = document.getElementById('aqi-city-input').value;
  var dataValue = document.getElementById('aqi-value-input').value;
  dataCity = dataCity.replace(/[(^\s+)(\s+$)]/g, '');
  dataValue = dataValue.replace(/[(^\s+)(\s+$)]/g, '');
  var reg =  /^[\u4e00-\u9fa5aa-zA-z]+$/i,
          numreg = /^[0-9]+$/i;
  if (!reg.test(dataCity)) {
    alert('城市名必须为中英文字符');
    return false;
  }
  if (!numreg.test(dataValue)) {
    alert('空气质量只能为整数');
    return false;
  }
  aqiData[dataCity] = dataValue;
  return true;
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
  var aqiTable = document.getElementById('aqi-table');
  aqiTable.innerHTML = '';
  aqiTable.innerHTML += '<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>';
  for (var data in aqiData) {
    aqiTable.innerHTML += '<tr><td>' + data + '</td><td>' + aqiData[data] + '</td><td><button onclick="delBtnHandle(\'' + data + '\')">删除</button></td></tr>';
  }
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  if (addAqiData()) {
    renderAqiList();
  }
  // addAqiData();
  // renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(data) {
  // do sth.
  console.log(data);
  delete aqiData[data];
  renderAqiList();
}

function init() {

  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  var addBtn = document.getElementById('add-btn');
  addBtn.addEventListener('click', addBtnHandle);
  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数

}

init();