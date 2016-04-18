/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
}

var nodeColor = ['#810081', '#0100FE', '#FE0002', '#008100'];

function getNodeColor() {
    index = parseInt(Math.random() * 4);
    return nodeColor[index];
}

/**
 * 渲染图表
 */
function renderChart() {
    var chartNode = document.getElementsByClassName('aqi-chart-wrap')[0];
    chartNode.innerHTML = '';
    var days = Object.keys(chartData);
    for (var i = 0; i < days.length; i++) {
        var addNode = document.createElement('div');
        addNode.setAttribute('class', 'node');
        addNode.setAttribute('title', days[i] + '指数:' + chartData[days[i]]);
        addNode.style.height = chartData[days[i]];
        addNode.style.backgroundColor = getNodeColor();
        switch (pageState['nowGraTime']) {
            case 'day':
                addNode.style.width = '10px';
                break;
            case 'week':
                addNode.style.width = '20px';
                break;
            case 'month':
                addNode.style.width = '40px';
                break;
        }
        chartNode.appendChild(addNode);
    }

}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化
  if (this.value != pageState['nowGraTime']) {
    // 设置对应数据
    pageState['nowGraTime'] = this.value;
    // 调用图表渲染函数
    initAqiChartData();
    renderChart();
  }

}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化
  if (this.value != pageState['nowSelectCity']) {
      // 设置对应数据
      pageState['nowSelectCity'] = this.value;
      // 调用图表渲染函数
      initAqiChartData();
      renderChart();
  }

}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var formGraTime = document.getElementsByTagName('input');
  for (var i = 0; i < formGraTime.length; i++) {
    formGraTime[i].addEventListener('click', graTimeChange);
  }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var cityObj = Object.keys(aqiSourceData);
  var citySelect = document.getElementById('city-select');
  for (var i = 0; i < cityObj.length; i++) {
      var selectNode = document.createElement('option');
      selectNode.value = cityObj[i];
      selectNode.innerText = cityObj[i];
      citySelect.appendChild(selectNode);
  }
  pageState['nowSelectCity'] = cityObj[0];
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  citySelect.addEventListener('change', citySelectChange);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  var citySelectData = aqiSourceData[pageState['nowSelectCity']];
  var days = Object.keys(citySelectData);
  switch (pageState['nowGraTime']) {
    case 'day':
        chartData = citySelectData;
        break;
    case 'week':
        var weekSum = 0;
        var weekData = [];
        for (var i = 0, j = 0; i < days.length; i++) {
            var daysDate = new Date(days[i]);
            var dayDate = daysDate.getDay();
            weekSum += citySelectData[days[i]];
            if (dayDate == 6) {
                weekData[daysDate.getFullYear() + '-0' + parseInt(daysDate.getMonth() + 1)  + '-' + parseInt(j + 1)] = Math.round(weekSum / 7);
                weekSum = 0;
                j++;
            }
        }
        chartData = weekData;
        break;
    case 'month':
        var monthSum = 0;
        var monthData = [];
        for (var i = 0; i < days.length; i++) {
            var dayDate = new Date((days[i]));
            var dayMonth = dayDate.getMonth();
            if (dayMonth == 0 || dayMonth == 2 || dayMonth == 4 || dayMonth == 6 || dayMonth == 7 || dayMonth == 9 || dayMonth == 11) {
                monthSum += citySelectData[days[i]];
                if (dayDate.getDate() == 31) {
                    monthData[dayDate.getFullYear() + '-' + parseInt(dayMonth + 1)] = Math.round(monthSum / 31);
                    monthSum = 0;
                }
            }else if (dayMonth == 1) {
                monthSum += citySelectData[days[i]];
                // 是的，没有考虑润年
                if (dayDate.getDate() == 28) {
                    monthData[dayDate.getFullYear() + '-' + parseInt(dayMonth + 1)] = Math.round(monthSum / 28);
                    monthSum = 0;
                }
            }else {
                monthSum += citySelectData[days[i]];
                if (dayDate.getDate() == 30) {
                    monthData[dayDate.getFullYear() + '-' + parseInt(dayMonth + 1)] = Math.round(monthSum / 30);
                    monthSum = 0;
                }
            }
        }
        chartData = monthData;
        break;
  }

}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}

init();
