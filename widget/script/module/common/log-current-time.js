/*
 *author:ws
 *function:设置当前时间
 *date：20170301
 */
function setCurrentTime() {
	var today = document.getElementById('select_time');
	$api.text(today, todayTime());
}

/*
 *author:ws
 *function:获得今天的时间
 *date：20161224
 */
function todayTime() {
	var myDate = new Date();
	//获取完整的年份(4位,1970-????)
	var nYear = myDate.getFullYear();
	//获取当前月份(0-11,0代表1月)
	var nMonth = myDate.getMonth() + 1;
	var Month = nMonth < 10 ? '0' + nMonth : nMonth;
	//获取当前日(1-31)
	var nDate = myDate.getDate();
	//获取当前小时数(0-23)
	var nHour = myDate.getHours();
	//获取当前分钟数(0-59)
	var nMinute = myDate.getMinutes();
	var ndate = nDate < 10 ? '0' + nDate : nDate;
	var hour = nHour < 10 ? '0' + nHour : nHour;
	var minute = nMinute < 10 ? '0' + nMinute : nMinute;
	appointDate = nYear + '-' + Month + '-' + ndate;
	var todayTime = appointDate.substring(0, 4) + '-' + appointDate.substring(5, 7) + '-' + appointDate.substring(8, 10);
	yearValue = nYear;
	monthValue = parseInt(Month);
	return todayTime;
}

/*
 *author:ws
 *function:时间选择器
 *date：20161224
 */
function pickerDateOpen() {
	var nowDay;
	var title;
	nowDay = $api.text($api.byId('select_time'));
	title = '开始日期';
	api.openPicker({
		type : 'date',
		date : nowDay,
		title : title
	}, function(ret, err) {
		if (ret) {
			var todayCurrentTime = todayTime();
			var year1 = todayCurrentTime.substring(0, 4);
			var month1 = todayCurrentTime.substring(5, 7);
			var day1 = todayCurrentTime.substring(8, 10);
			var type = true;
			if (ret.year > year1) {
				type = false;
				popAlert('暂不支持未来日期，请重新选择!');
			} else if (ret.year == year1) {
				if (ret.month > month1) {
					type = false;
					popAlert('暂不支持未来日期，请重新选择!');
				} else if (ret.month == month1) {
					if (ret.day > day1) {
						type = false;
						popAlert('暂不支持未来日期，请重新选择!');
					}
				}
			}
			if (type) {
				var month = ret.month < 10 ? '0' + ret.month : ret.month;
				var day = ret.day < 10 ? '0' + ret.day : ret.day;
				var value = ret.year + '-' + month + '-' + day;
				var today = document.getElementById('select_time');
				judgeMonth = 1;
				$api.text(today, value);
				api.execScript({
					name : winNameLog,
					frameName : frameNameLog,
					script : 'getLogData(1,"' + value + '","' + ret.year + '");'
				});

			}

		}
	});
}

function openUICustomPicker() {
	var UICustomPicker = api.require('UICustomPicker');
	var heigth = api.winHeight * 0.5 - 88;
	UICustomPicker.open({
		rect : {
			x : api.winWidth * 0.1,
			y : heigth,
			w : api.winWidth * 0.70,
			h : 137
		},
		styles : {
			bg : 'rgba(0,0,0,0)',
			normalColor : '#959595',
			selectedColor : '#34A8FA',
			selectedSize : 30,
			tagColor : '#959595',
			tagSize : 15
		},
		data : [{
			tag : '年',
			scope : yearScope
		}, {
			tag : '月',
			scope : ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
		}],
		rows : 1,
		fixedOn : api.frameName,
		autoHide : false,
		fixed : true
	}, function(ret, err) {
		if (ret) {
			ui_id = ret.id;
			if (flag) {
				UICustomPicker.setValue({
					id : ui_id,
					data : timeArray
				});
				flag = false;
			}
			if (ret.eventType == "selected") {
				if (ret.data[0] == yearInit * 1 && ret.data[1] > monthInit * 1) {
					popAlert('暂不支持未来日期，请重新选择!');
					selectFlag = false;
				} else {
					selectFlag = true;
					year = ret.data[0];
					month = ret.data[1];
					yearValue = year;
					monthValue = month;
				}
			}
		}
	});
}

/*
 *author:zhaoj
 *function:获取当前时间,返回年月日
 *date：20160622
 */
function getNowTime() {
	time = new Date();
	yearInit = time.getFullYear();
	monthInit = time.getMonth() + 1;
	year = yearInit;
	month = monthInit;
}

function currentMonthDayNum(judgeMonth, yearDay, timeParam) {
	var leap = 0;
	var year;
	var month;
	if (judgeMonth == 1) {
		year = yearDay;
	} else {
		year = yearDay;
	}
	if (judgeMonth == 1) {
		month = timeParam.substring(5, 7);
	} else {
		month = timeParam;
	}
	var day;
	if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
		leap = 1;
		//閏年29天
	}
	if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
		leap = 3;
	}
	if (month == 4 || month == 6 || month == 9 || month == 11) {
		leap = 2;
	}
	day = 28 + leap;
	return day;
}

/*
 *author:ws
 *function:请接口接口是否有数据
 *date：20170308
 */
function checkDataNull(person_id,judgeMonth, timeParam, callback) {
	api.showProgress({
		title : '加载中...',
		text : '请稍候...',
		modal : true
	});
	var time='';
	judgeMonth == 1?time=timeParam:time=$api.getStorage("rizhi_month_time");
	api.ajax({
		url : BASE_URL_ACTION + '/dsjxt/rizhi/LogcheckPersonLimit',
		method : 'post',
		dataType : 'json',
		timeout : 30,
		data : {
			values : {
//				"person_id" : $api.getStorage("person_id"),
				"person_id" : person_id,
				"judgeMonth" : judgeMonth, //判断是否按月查询  1否 2是
				"timeParam" : time
			}
		}
	}, function(ret, err) {
		api.hideProgress();
		if (ret) {
			if (ret.success) {
				callback(true, ret);
			} else {
				callback(false, ret);
			}
		} else {
			callback(false, err);
		}
	});
}