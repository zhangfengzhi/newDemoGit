/*
 *author:zhaoj
 *function:打开我的考勤详情页面
 *date：20160620
 */
function openKqxqWin(type, leave_id, win_name, status_id) {
	api.openWin({
		name : win_name,
		url : win_name + '.html',
		pageParam : {
			header_h : header_h,
			type : type,
			leave_id : leave_id,
			status_id : status_id
		},
		bounces : false,
		opaque : false,
		showProgress : false,
		bgColor : '#f7f9f8',
		vScrollBarEnabled : false,
		hScrollBarEnabled : false,
		slidBackEnabled : false,
		delay : 0,
		animation : {
			type : "reveal", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300
		},
	});
}

/*
 *author:zhaoj
 *function:打开审批考勤详情页面
 *date：20160621
 */
function openSpKqxqWin(type, leave_id, check_status) {
	api.openWin({
		name : 'kaoqin_spKqxq_window',
		url : 'kaoqin_spKqxq_window.html',
		pageParam : {
			header_h : header_h,
			type : type,
			leave_id : leave_id,
			check_status : check_status
		},
		bounces : false,
		opaque : false,
		showProgress : false,
		bgColor : '#f7f9f8',
		vScrollBarEnabled : false,
		hScrollBarEnabled : false,
		slidBackEnabled : false,
		delay : 0,
		animation : {
			type : "reveal", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300
		},
	});
}

/*
 *author:zhaoj
 *function:打开撤销详情页面
 *date：20160621
 */
function opencxKqxqWin(type, leave_id, check_status) {
	api.openWin({
		name : 'kaoqin_cxKqxq_window',
		url : 'kaoqin_cxKqxq_window.html',
		pageParam : {
			header_h : header_h,
			type : type,
			leave_id : leave_id,
			check_status : check_status
		},
		bounces : false,
		opaque : false,
		showProgress : false,
		bgColor : '#f7f9f8',
		vScrollBarEnabled : false,
		hScrollBarEnabled : false,
		slidBackEnabled : false,
		delay : 0,
		animation : {
			type : "reveal", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300
		},
	});
}

/*
 *author:zhaoj
 *function:打开审批考勤详情页面
 *date：20160621
 */
function openHzlistWin() {
	api.openWin({
		name : 'kaoqin_hzlist_window',
		url : 'kaoqin_hzlist_window.html',
		pageParam : {
			header_h : header_h,
			type : type
		},
		bounces : false,
		opaque : false,
		showProgress : false,
		bgColor : '#f7f9f8',
		vScrollBarEnabled : false,
		hScrollBarEnabled : false,
		slidBackEnabled : false,
		delay : 0,
		animation : {
			type : "reveal", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300
		},
	});
}

/*
 *author:zhaoj
 *function:获取我的请假和公出列表rule_type=1请假，rule_type=2公出
 *date：20160622
 */
function getMyLeave(is_show, rule_type, callback) {
	if (is_show) {
		showSelfProgress('加载中...');
	}
	api.ajax({
		url : BASE_URL_ACTION + '/leave/getMyLeave',
		method : 'get',
		timeout : 0,
		dataType : 'json',
		data : {
			values : {
				"random_num" : creatRandomNum(),
				"rule_type" : rule_type
			}
		},
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		api.hideProgress();
		var data = {
			"list" : []
		};
		if (err) {
			callback(data, true);
		} else {
			if (ret.success) {
				callback(ret, true);
			} else {
				callback(data, true);
			}
		}
		//通知顶部下拉刷新数据加载完毕，组件会恢复到默认状态
		commonControlRefresh();
	});
}

/*
 *author:zhaoj
 *function:渲染html
 *date：20160622
 */
function addTemplateHtml(div_id, script_id, data, currentPage) {
	var html_type = template.render(script_id, data);
	if (currentPage == 1) {
		document.getElementById(div_id).innerHTML = html_type;
	} else {
		$api.append($api.byId(div_id), html_type);
	}
}

/*
 *author:zhaoj
 *function:打开加载数据的提示框
 *date：20160622
 */
function showSelfProgress(msg) {
	api.showProgress({
		title : msg,
		text : '请稍候...',
		modal : false
	});
}

/**
 * 下拉刷新
 * 周枫
 * 20160523
 */
function refreshDataInfo() {
	//绑定下拉刷新历史会话事件
	api.setRefreshHeaderInfo({
		visible : true,
		loadingImg : 'widget://image/local_icon_refresh.png',
		bgColor : '#F8F7F3',
		textColor : '#8E8E8E',
		textDown : '下拉加载更多...',
		textUp : '松开加载...',
		showTime : true
	}, function(ret, err) {
		initData(1);
	});
}

/*
 *author:zhaoj
 *function:撤销请假或者公出
 *date：20160622
 */
function cancelLeave(level_id) {
	showSelfProgress('撤回中...');
	api.ajax({
		url : BASE_URL_ACTION + '/leave/cancelLeave',
		method : 'get',
		timeout : 0,
		dataType : 'json',
		data : {
			values : {
				"random_num" : creatRandomNum(),
				"level_id" : level_id
			}
		},
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		api.hideProgress();
		if (err) {
			popToast('撤回失败');
		} else {
			if (ret.success) {
				popToast('撤回成功');
				initData(0);
			} else {
				popToast('撤回失败');
			}
		}
	});
}

/*
 *author:zhaoj
 *function:初始化右滑按钮的点击事件
 *date：20160622
 */
//function initSwipe() {
//	$('.aui-swipe-right-btn').each(function() {
//		$(this).tap(function(event) {
//			var type = $(this).attr('type') * 1;
//			var levelId = $(this).attr('levelId');
//			switch(type) {
//				case 1:
//					cancelLeave(levelId);
//					break;
//				case 2:
//					openMybcWin($(this).attr('ruleType') * 1, levelId, 1)
//					break;
//				default:
//					break;
//
//			}
//		});
//	});
//}

/*
 *author:zhaoj
 *function:打开我的考勤详情页面
 *date：20160620
 */
function openMybcWin(ruleType, leave_id, type) {
	api.openWin({
		name : 'kaoqin_mybc_window',
		url : 'kaoqin_mybc_window.html',
		pageParam : {
			header_h : header_h,
			rule_type : ruleType,
			leave_id : leave_id,
			type : type
		},
		bounces : false,
		opaque : false,
		showProgress : false,
		bgColor : '#f7f9f8',
		vScrollBarEnabled : false,
		hScrollBarEnabled : false,
		slidBackEnabled : false,
		delay : 0,
		animation : {
			type : "reveal", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300
		},
	});
}

/*
 *author:zhaoj
 *function:初始化考勤审批右滑按钮的点击事件
 *date：20160624
 */
function initSpSwipe() {
	$('.aui-swipe-right-btn').each(function() {
		$(this).tap(function(event) {
			var type = $(this).attr('type') * 1;
			var levelId = $(this).attr('levelId');
			var typeName = $(this).attr('typeName');
			setCheckLeave(type, levelId, typeName);
		});
	});
}

/*
 *author:zhaoj
 *function:考勤审批通过或驳回type=1通过，type=2驳回
 *date：20160624
 */
function setCheckLeave(type, leave_id, typeName) {
	if (type == 1) {
		showSelfProgress('审批中...');
	} else {
		showSelfProgress('驳回中...');
	}
	api.ajax({
		url : BASE_URL_ACTION + '/leave/setCheckLeave',
		method : 'get',
		timeout : 0,
		dataType : 'json',
		data : {
			values : {
				"random_num" : creatRandomNum(),
				"leave_id" : leave_id,
				"check_status" : type
			}
		},
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		api.hideProgress();
		if (err) {
			if (type == 1) {
				popToast('审批失败');
			} else {
				popToast('驳回失败');
			}
		} else {
			if (ret.success) {
				api.execScript({
					name : 'kaoqin_kqsp_window',
					script : 'setSubCount(' + ruleType + ');'
				});
				var idy_id = $api.getStorage('idy_id')*1;
				var frame_name = idy_id == 3 ? 'hxx_index':'nav_3';
				commonExecScript('root',frame_name,'setModuleNum(2);',1);
				if (type == 1) {
					popToast('审批成功');
				} else {
					popToast('驳回成功');
				}
				//发送系统消息通知审批
				var target_person = ret.login_name;
				if (target_person != '-1') {
					sendSysMsg(1, target_person, type, typeName);
				}
				initData(0);
			} else {
				if (type == 1) {
					popToast('审批失败');
				} else {
					popToast('驳回失败');
				}
			}
		}
	});
}

/*
 *author:zhaoj
 *function:初始化考勤撤销右滑按钮的点击事件
 *date：20160624
 */
function initCancelSwipe() {
	$('.aui-swipe-right-btn').each(function() {
		$(this).tap(function(event) {
			var type = $(this).attr('type') * 1;
			var levelId = $(this).attr('levelId');
			var typeName = $(this).attr('typeName');
			//撤销
			checkCancelLeave(type, levelId, typeName);
		});
	});
}

/*
 *author:zhaoj
 *function:考勤审批通过或驳回type=1通过，type=2驳回
 *date：20160624
 */
function checkCancelLeave(type, leave_id, typeName) {
	if (type == 1) {
		showSelfProgress('审批中...');
	} else {
		showSelfProgress('驳回中...');
	}
	api.ajax({
		url : BASE_URL_ACTION + '/leave/checkCancelLeave',
		method : 'get',
		timeout : 0,
		dataType : 'json',
		data : {
			values : {
				"random_num" : creatRandomNum(),
				"leave_id" : leave_id,
				"check_status" : type
			}
		},
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		api.hideProgress();
		if (err) {
			if (type == 1) {
				popToast('审批失败');
			} else {
				popToast('驳回失败');
			}
		} else {
			if (ret.success) {
				api.execScript({
					name : 'kaoqin_kqhz_window',
					script : 'setSubCount(' + ruleType + ');'
				});
				var idy_id = $api.getStorage('idy_id')*1;
				var frame_name = idy_id == 3 ? 'hxx_index':'nav_3';
				commonExecScript('root',frame_name,'setModuleNum(3);',1);
				if (type == 1) {
					popToast('审批成功');
				} else {
					popToast('驳回成功');
				}
				//发送系统消息通知审批
				var target_person = ret.login_name;
				if (target_person != '-1') {
					sendSysMsg(0, target_person, type, typeName);
				}
				initData(0);
			} else {
				if (type == 1) {
					popToast('审批失败');
				} else {
					popToast('驳回失败');
				}
			}
		}
	});
}

/*
 *author:zhaoj
 *function:获取请假类型
 *date：20160623
 */
function getRuleTypeList(show_type, rule_type, callback) {
	if (show_type == 1) {
		showSelfProgress('加载中...');
	}
	api.ajax({
		url : BASE_URL_ACTION + '/leave/getRuleTypeList',
		method : 'get',
		timeout : 0,
		dataType : 'json',
		data : {
			values : {
				"random_num" : creatRandomNum(),
				"rule_type" : rule_type
			}
		},
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		api.hideProgress();
		if (err) {
			callback(false, '');
		} else {
			if (ret.success) {
				callback(true, ret);
			} else {
				callback(false, '');
			}
		}
	});
}

/**
 * 弹出Alert提示框,并带有回调函数
 * 赵静
 * 2016.5.8
 */
function popAlertBackData(message, callback) {
	api.alert({
		msg : message
	}, function(ret, err) {
		callback(true);
	});
}

/*
 *author:zhaoj
 *function:获取考勤审批和公出列表rule_type=1请假，rule_type=2公出
 *date：20160624
 */
function getCheckLeaveInfoList(is_show, rule_type, callback) {
	if (is_show) {
		showSelfProgress('加载中...');
	}
	api.ajax({
		url : BASE_URL_ACTION + '/leave/getCheckLeaveInfoList',
		method : 'get',
		timeout : 0,
		dataType : 'json',
		data : {
			values : {
				"random_num" : creatRandomNum(),
				rule_type : rule_type
			}
		},
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		api.hideProgress();
		var data = {
			"list" : []
		};
		if (err) {
			callback(data, true);
		} else {
			if (ret.success) {
				callback(ret, true);
			} else {
				callback(data, true);
			}
		}
		//通知顶部下拉刷新数据加载完毕，组件会恢复到默认状态
		commonControlRefresh();
	});
}

/*
 *author:zhaoj
 *function:获取考勤管理和公出列表rule_type=1请假，rule_type=2公出
 *date：20160624
 */
function getCancelLeaveList(is_show, rule_type, key_word, callback) {
	if (is_show) {
		showSelfProgress('加载中...');
	}
	var url_src;
	if (keyword) {
		key_word = Base64.encode(key_word);
		url_src = BASE_URL_ACTION + '/leave/getCancelLeaveList?rule_type=' + rule_type + '&person_name=' + key_word + '&random_num=' + creatRandomNum();
	} else {
		url_src = BASE_URL_ACTION + '/leave/getCancelLeaveList?rule_type=' + rule_type + '&random_num=' + creatRandomNum();
	}
	api.ajax({
		url : url_src,
		method : 'get',
		timeout : 0,
		dataType : 'json',
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		api.hideProgress();
		var data = {
			"list" : []
		};
		if (err) {
			callback(data, true);
		} else {
			if (ret.success) {
				callback(ret, true);
			} else {
				callback(data, true);
			}
		}
		//通知顶部下拉刷新数据加载完毕，组件会恢复到默认状态
		commonControlRefresh();
	});
}

/*
 *author:zhaoj
 *function:获取全部列表rule_type=1请假，rule_type=2公出
 *date：20160702
 */
function getLeaveAllInfoList(is_show, rule_type, callback) {
	if (is_show) {
		showSelfProgress('加载中...');
	}
	api.ajax({
		url : BASE_URL_ACTION + '/leave/getLeaveAllInfoList',
		method : 'get',
		timeout : 0,
		dataType : 'json',
		data : {
			values : {
				"random_num" : creatRandomNum(),
				rule_type : rule_type
			}
		},
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		api.hideProgress();
		var data = {
			"list" : []
		};
		if (err) {
			callback(data, true);
		} else {
			if (ret.success) {
				callback(ret, true);
			} else {
				callback(data, true);
			}
		}
		//通知顶部下拉刷新数据加载完毕，组件会恢复到默认状态
		commonControlRefresh();
	});
}

/**
 * 发布通过、驳回系统消息
 * 周枫
 * 2016.07.06
 */
function sendSysMsg(kq_type, target_login_name, type, typeName) {
	var sender_id = $api.getStorage('person_id');
	var sender_person_name = $api.getStorage("person_name");
	var sender_login_name = commonNewParamToOldParam($api.getStorage("login_name"));
	var sender_identity = $api.getStorage("identity");
	var target_login_names = [target_login_name];
	var is_url = 1;
	var url_name = 'kaoqin_wdkq_window';
	var param_num = 1;
	var sysmsg_code = 'KAOQIN_SHENPI_INDEX';

	var bureau_id = $api.getStorage('bureau_id');
	( typeof (bureau_id) == 'undefined') ? bureau_id = -1 : bureau_id = bureau_id;

	var district_id = $api.getStorage('district_id');
	( typeof (district_id) == 'undefined') ? district_id = -1 : district_id = district_id;

	var city_id = $api.getStorage('city_id');
	( typeof (city_id) == 'undefined') ? city_id = -1 : city_id = city_id;

	var province_id = $api.getStorage('province_id');
	( typeof (province_id) == 'undefined') ? province_id = -1 : province_id = province_id;
	var params;
	//考勤审核
	if(kq_type == 1) {
		if (type == 1) {
			params = ['考勤消息', '申请', typeName, '考勤', '审批通过'];
		} else {
			params = ['考勤消息', '申请', typeName, '考勤', '被驳回'];
		}
	} else {
		//撤销审核
		if (type == 1) {
			params = ['考勤消息', '撤回', typeName, '考勤', '审批通过'];
		} else {
			params = ['考勤消息', '撤回', typeName, '考勤', '被驳回'];
		}
	}
	
	commonSendSysMsg(sender_id, sender_person_name, sender_login_name, sender_identity, target_login_names, is_url, url_name, param_num, sysmsg_code, bureau_id, district_id, city_id, province_id, params, function(is_true) {
		if (is_true) {

		} else {

		}
	});
}

/*
 *author:zhaoj
 *function:获取审批数量
 *date：20160706
 */
function getCheckLeaveCountByType(type_id, callback) {
	api.ajax({
		url : BASE_URL_ACTION + '/leave/getCheckLeaveCountByType',
		method : 'get',
		timeout : 0,
		dataType : 'json',
		data : {
			values : {
				"person_id" : $api.getStorage("person_id"),
				"identity_id" : $api.getStorage("identity"),
				"type_id" : type_id
			}
		},
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		api.hideProgress();
		var data = {
			"wc_count" : 0,
			"qj_count" : 0
		}
		if (err) {
			callback(false, data);
		} else {
			if (ret.success) {
				callback(true, ret);
			} else {
				callback(false, data);
			}
		}
	});
}
//替换所有的回车换行
function transferBrStr(content) {
	var string = content;
	try {
		string = string.replace(/\r\n/g, "<br /><p style='text-indent:2em;'></p>")
		string = string.replace(/\n/g, "<br /><p style='text-indent:2em;'></p>");
	} catch(e) {
		popAlert(e.message);
	}
	return string;
}

/*
*author:zhaoj
*function:获取合计时间
*date：20160730
*/
function getSinglePersonLeaveInfo(typeId,start_time,end_time,callback){
	api.ajax({
		url : BASE_URL_ACTION + '/leave/getSinglePersonLeaveInfo?bureau_id='+$api.getStorage("bureau_id")+'&person_id='+per_id+'&start_time='+start_time+':00&end_time='+end_time+':00'+'&type_id='+typeId,
		method : 'get',
		timeout : 30,
		dataType : 'json'
	}, function(ret, err) {
		if (err) {
			callback(false,'');
		} else {
			if(ret.success){
				callback(true,ret);
			}else{
				callback(false,'');
			}
				
		}
	});
}
/*
*author:zhaoj
*function:获取外出时间
*date：20160730
*/
function getSinglePersonWaiChuInfo(typeId,start_time,end_time,callback){
	api.ajax({
		url : BASE_URL_ACTION + '/leave/getSinglePersonWaiChuInfo?bureau_id='+$api.getStorage("bureau_id")+'&person_id='+per_id+'&start_time='+start_time+':00&end_time='+end_time+':00'+'&type_id='+typeId,
		method : 'get',
		timeout : 30,
		dataType : 'json'
	}, function(ret, err) {
		if (err) {
			callback(false,'');
		} else {
			if(ret.success){
				callback(true,ret);
			}else{
				callback(false,'');
			}
				
		}
	});
}
/*
 *author:zhaoj
 *function:打开图片
 *date：20161202
 */
function openImage(index) {
	var openImgArray = [];
	var dlArray = $api.domAll($api.byId('j_file_content'), 'img');
for (var i = 0; i < dlArray.length; i++) {
	openImgArray.push($api.attr(dlArray[i], 'src'));
	}
	photoBrowser.open(openImgArray, index);
}