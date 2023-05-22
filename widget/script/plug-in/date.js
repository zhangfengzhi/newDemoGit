function getTimeTemplate() {
	
this.getTime = function(begin_l,  Interface) {
	var end = new Date();
	var begin = new Date(begin_l);

	var weekday = new Array(7);
	weekday[0] = "星期天";
	weekday[1] = "星期一";
	weekday[2] = "星期二";
	weekday[3] = "星期三";
	weekday[4] = "星期四";
	weekday[5] = "星期五";
	weekday[6] = "星期六";
	var time;
	var time2;
	if (begin.getFullYear() == end.getFullYear()) {//如果年相等继续
		if (begin.getMonth() == end.getMonth()) {//如果月相等继续
			if (begin.getDate() == end.getDate()) {//是不是今天
				time = hour(begin) + minute(begin);
				time2 = hour(begin) + minute(begin);
				//是就显示时分
			} else {//不是就判断是不是昨天
				end.setHours(0);
				end.setMinutes(0);
				end.setSeconds(0);
				end.setMilliseconds(0);
				var Differ = end - begin;
				if (parseInt(Differ / 3600000) <= 24) {
					time = '昨天';
					time2 = '昨天  ' + hour(begin) + minute(begin);
//					alert(time2+'是昨天');
				} else {//不是昨天一周之内就显示星期几不然就具体时间
					if (parseInt(Differ / 3600000) <= 144) {
						time = day(weekday, begin);
						time2 =day(weekday, begin)+ ' ' + hour(begin) + minute(begin);
//						alert(time2+'是一周');
					} else {
						time = year(begin) + month(begin) + date(begin);
						time2 = year(begin) + month(begin) + date(begin);
//						alert(time2+'不是一周');
					}
				}
			}
		} else {//月不等，直接显示
			time = year(begin) + month(begin) + date(begin);
			time2 = year(begin) + month(begin) + date(begin);
//			alert(time2+'time2月不等，直接显示');
		}
	} else {//年不等，直接显示
		
		time = year(begin) + month(begin) + date(begin);
		time2 = year(begin) + month(begin) + date(begin);
//		alert(time2+'time2年不等，直接显示');
	}
	
	if(Interface==0){
		return time;
	}else{
		return time2;
	}
	
}


	year = function(date) {		
//	alert( date.getFullYear() + '-' +'ffffffffffff，'+'date:'+date);
		return date.getFullYear() + '-';
	}

	month = function(date) {
		var tt = date.getMonth() + 1;
		if (tt < 10) {
			tt = '0' + tt;
		}
		return tt + '-';
	}

	date = function(date) {
		var tt = date.getDate();
		if (tt < 10) {
			tt = '0' + tt;
		}
		return tt + ' ';
	}

	hour = function(date) {
		var tt = date.getHours();
		if (tt < 10) {
			tt = '0' + tt;
		}
		return tt + ':';
	}

	minute = function(date) {
		var tt = date.getMinutes();
		if (tt < 10) {
			tt = '0' + tt;
		}
		return tt;
	}

	day = function(weekday, date) {
		return weekday[date.getDay()];
	}
}
