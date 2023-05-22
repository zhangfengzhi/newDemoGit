
/*
 *作者:zhaoj
 *功能:打开页面frame页面的公共方法
 *日期：20161029
 */
function openDetailFrame(name, height, is_bounces, pageParamJson) {
	api.openFrame({
		name : name,
		scrollToTop : true,
		allowEdit : false,
		url : name + '.html',
		rect : {
			x : 0,
			y : header_h,
			w : 'auto',
			h : api.winHeight - header_h - height,
		},
		pageParam : pageParamJson,
		bgColor : '#ffffff',
		vScrollBarEnabled : true,
		hScrollBarEnabled : false,
		//页面是否弹动 为了下拉刷新使用
		bounces : is_bounces
	});
}

/*
 *作者:zhaoj
 *功能:下拉刷新
 *日期：20161029
 */
function refreshDataInfo() {
	api.setRefreshHeaderInfo({
		visible : true,
		loadingImg : 'widget://image/local_icon_refresh.png',
		bgColor : '#efefef',
		textColor : '#8E8E8E',
		textDown : '下拉加载更多...',
		textUp : '松开加载...',
		showTime : true
	}, function(ret, err) {
		showSelfProgress('加载中...');
		currentPage = 1;
		initData(currentPage);
	});
}

/*
 *作者:zhaoj
 *功能:上拉获取新的数据
 *日期：20161029
 */
function scrollBottomReload() {
	api.addEventListener({
		name : 'scrolltobottom',
		extra : {
			threshold : 100 //设置距离底部多少距离时触发，默认值为0，数字类型
		}
	}, function(ret, err) {
		if ((currentPage + 1) <= totalPages) {
			currentPage = currentPage + 1;
			initData(currentPage);
		} else {
			popToast('已加载全部数据');
		}
	});
}

/*
 *作者:zhaoj
 *功能:获取承接人和以下所有人应有任务管理模块
 *日期：20161116
 */
function getReceiveTaskPersonList(callback) {
	api.ajax({
		url : BASE_URL_ACTION + '/taskm/getReceiveTaskPersonList?random_num=' + creatRandomNum() + '&bureau_id=' + $api.getStorage('bureau_id'),
		method : 'get',
		timeout : 30,
		dataType : 'json',
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
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

/*
 *作者:zhaoj
 *功能:对接发布权限接口
 *日期：20161116
 */
function getSendTaskPersonList(callback) {
	api.ajax({
		url : BASE_URL_ACTION + '/taskm/getSendTaskPersonList?random_num=' + creatRandomNum() + '&bureau_id=' + $api.getStorage('bureau_id'),
		method : 'get',
		timeout : 30,
		dataType : 'json',
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
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

/*
 *作者:zhaoj
 *功能:获取该机构顶层管理者
 *日期：20161116
 */
function getTopManagPersonInfo(callback) {
	api.ajax({
		url : BASE_URL_ACTION + '/taskm/getTopManagPersonInfo?random_num=' + creatRandomNum() + '&bureau_id=' + $api.getStorage('bureau_id'),
		method : 'get',
		timeout : 30,
		dataType : 'json',
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
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

/*
 *作者:zhaoj
 *功能:没有分页的渲染html
 *日期：20161116
 */
function addSingleTemplateHtml(div_id, script_id, data) {
	var html_type = template.render(script_id, data);
	document.getElementById(div_id).innerHTML = html_type;
}

/*
 *作者:zhaoj
 *功能:渲染html
 *日期：20161101
 */
function addTemplateHtml(div_id, script_id, data) {
	var html_type = template.render(script_id, data);
	if (currentPage == 1) {
		document.getElementById(div_id).innerHTML = html_type;
	} else {
		$api.append($api.byId(div_id), html_type);
	}
}

/*
 *作者:zhaoj
 *功能:保存任务
 *日期：20161116
 */
function createTask() {
	$api.css($api.byId('shadow'), 'z-index:3;');
	var title = $api.val($api.byId('task_title'));
	if (title == '') {
		api.alert({
			msg : '请输入任务名称'
		}, function(ret, err) {
			$api.byId('task_title').focus();
		});
		$api.css($api.byId('shadow'), 'z-index:-1;');
		return false;
	}
	var content = $api.val($api.byId('task_content'));
	if (content == '') {
		api.alert({
			msg : '请输入任务描述'
		}, function(ret, err) {
			$api.byId('task_content').focus();
		});
		$api.css($api.byId('shadow'), 'z-index:-1;');
		return false;
	}
	if (person_id_array.length == 0) {
		popAlert('请选择承接人');
		$api.css($api.byId('shadow'), 'z-index:-1;');
		return false;
	}
	if (!time_flag) {
		popAlert('请选择结束时间');
		$api.css($api.byId('shadow'), 'z-index:-1;');
		return false;
	} else {
		var complete_time = $api.text($api.byId('j_end_time'));
	}
	showSelfProgress('发布中...');
	api.ajax({
		url : BASE_URL_ACTION + '/task/createTask',
		method : 'post',
		timeout : 30,
		dataType : 'json',
		data : {
			values : {
				"completetime" : complete_time,
				"describe_task" : content,
				"file_path" : "",
				"join_person" : person_id_array.toString(),
				"level_id" : 0,
				"save_type" : 1,
				"duty_person":fzr_person_data.person_id,
				"task_type" : 1,
				"title" : title,
				"auto_receive" : 0,
				"random_num" : creatRandomNum()
			}
		},
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		if (err) {
			api.hideProgress();
			$api.css($api.byId('shadow'), 'z-index:-1;');
			popToast('发布失败，请稍候再试！');
		} else {
			if (ret.success) {
				//发送提示消息
				var TemplateParamsList = {
					"[#param2]" : title.substring(0, 10) + '...',
					"[#param1]" : $api.getStorage("person_name")
				};
				var login_name_array = '';
				for (var i = 0; i < person_json.list.length; i++) {
					if (i == 0) {
						login_name_array = login_name_array + person_json.list[i].login_name;
					} else {
						login_name_array = login_name_array + ',' + person_json.list[i].login_name;
					}
				}
				sendmessageTask(login_name_array, 9, TemplateParamsList, 0);
				//设置常用联系人
				setTopContacts();
				setTimeout(function() {
					var type = api.pageParam.type;
					if (type == 1 || type == 3) {
						api.execScript({
							name : 'rwgl_index_window',
							script : 'changeType("j_I_assign",2);'
						});
					} else {
						api.execScript({
							name : 'rwgl_index_window',
							frameName : "rwgl_index_frame",
							script : 'changeType(2);'
						});
					}
				}, 2800);
				setTimeout(function() {
					api.hideProgress();
					popToast('发布成功');
					api.execScript({
						name : 'rwgl_index_window',
						script : 'back();'
					});
					$api.css($api.byId('shadow'), 'z-index:-1;');
				}, 3000);
			} else {
				api.hideProgress();
				$api.css($api.byId('shadow'), 'z-index:-1;');
				popToast('发布失败，请稍候再试！');
			}
		}
	});
}

/*
 *作者:zhaoj
 *功能:设置常用联系人
 *日期：20161122
 */
function setTopContacts() {
	for (var i = 0; i < bm_json.list.length; i++) {
		if (bm_json.list[i].count != 0) {
			bm_json.list[i].count = 0;
		}
	}
	if (top_contacts_flag) {
		//往上添加
		for (var i = 0; i < person_id_array.length; i++) {
			var same_count = 0;
			for (var j = 0; j < cylxr_person_id_array.length; j++) {
				if (cylxr_person_id_array[j] == person_id_array[i]) {
					same_count++;
				}
			}
			if (!same_count) {
				if (cylxr_person_id_array.length == 30) {
					//去掉一个添加一个新的
					cylxr_person_id_array.splice(0, 1);
					cylxr_person_json.list.splice(0, 1);
				}
				cylxr_person_id_array.push(person_id_array[i]);
				cylxr_person_json.list.push(person_json.list[i]);
			}
		}
		var top_contact_json = {
			'person_id' : $api.getStorage("person_id"),
			'person_id_string' : cylxr_person_id_array.toString(),
			'person_name_json' : JSON.stringify(cylxr_person_json),
			'bm_json' : JSON.stringify(bm_json)
		}
	} else {
		//覆盖
		person_json.list = person_json.list.slice(0, 30);
		var top_contact_json = {
			'person_id' : $api.getStorage("person_id"),
			'person_id_string' : person_id_array.slice(0, 30).toString(),
			'person_name_json' : JSON.stringify(person_json),
			'bm_json' : JSON.stringify(bm_json)
		}
	}
	
	setTaskPerson(top_contact_json);
	$api.setStorage('rwgl_top_contacts', top_contact_json);
}
/*
 *author:zhaoj
 *function:设置常用承接人
 *date：20160420
 */
function setTaskPerson(top_contact_json){

	var top_contact_json = JSON.stringify(top_contact_json);
	top_contact_json = Base64.encode(top_contact_json);

	api.ajax({
		url : BASE_URL_ACTION + '/task/setTaskPerson',
		method : 'post',
		timeout : 30,
		dataType : 'json',
		returnAll : false,
		data : {
			values : {
				"random_num" : creatRandomNum(),
				"person_id" : $api.getStorage("person_id"),
				"identity_id":$api.getStorage("identity"),
				"person_json":top_contact_json
			}
		}
	}, function(ret, err) {

	});
}

/*
 *author:zhaoj
 *function:获取当前时间
 *date：20160420
 */
function getCurrentDate(callback) {
	api.ajax({
		url : BASE_URL_ACTION + '/xx/getCurrentDate',
		method : 'get',
		timeout : 30,
		dataType : 'json',
		returnAll : false,
		data : {
			values : {
				"random_num" : creatRandomNum()
			}
		}
	}, function(ret, err) {
		if (err) {
			nowTime = new Date();
			nowMillisecond = Date.parse(nowTime);
		} else {
			if (ret.success) {
				nowTime = ret.dateStr2;
				nowMillisecond = Date.parse(new Date(ret.dateStr2.replace(/\-/g, "/")));
			} else {
				nowTime = new Date();
				nowMillisecond = Date.parse(nowTime);
			}
		}
		callback(nowTime, nowMillisecond);
	});
}

/*
 *作者:zhaoj
 *功能:获取指派给我的数据
 *日期：20161116
 */
function getAllTaskList(current_page, callback) {
	api.ajax({
		url : BASE_URL_ACTION + '/ypt/task/getAllTaskList?random_num=' + creatRandomNum() + '&pageNumber=' + current_page + '&pageSize=' + BASE_PAGE_SIZE + '&personName=' + keyword,
		method : 'get',
		timeout : 30,
		dataType : 'json',
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		if (err) {
			callback(false, '');
		} else {
			if (ret.success) {
				callback(true, ret);
			} else {
				callback(false, '');
			}
		}
		//通知顶部下拉刷新数据加载完毕，组件会恢复到默认状态
		commonControlRefresh();
	});
}

/*
 *作者:zhaoj
 *功能:获取我指派的数据
 *日期：20161116
 */
function getAllInitTaskList(current_page, callback) {
	api.ajax({
		url : BASE_URL_ACTION + '/ypt/task/getAllInitTaskList?random_num=' + creatRandomNum() + '&pageNumber=' + current_page + '&pageSize=' + BASE_PAGE_SIZE + '&personName=' + keyword,
		method : 'get',
		timeout : 30,
		dataType : 'json',
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		if (err) {
			callback(false, '');
		} else {
			if (ret.success) {
				callback(true, ret);
			} else {
				callback(false, '');
			}
		}
		//通知顶部下拉刷新数据加载完毕，组件会恢复到默认状态
		commonControlRefresh();
	});
}

/*
 *作者:zhaoj
 *功能:获取任务详情数据
 *日期：20161116
 */
function getTaskDetail(task_id, task_child_id, turn_task_id, callback) {
	api.ajax({
		url : BASE_URL_ACTION + '/ypt/task/getTaskDetail?random_num=' + creatRandomNum() + '&task_id=' + task_id + '&task_child_id=' + task_child_id + '&turn_task_id=' + turn_task_id,
		method : 'get',
		timeout : 30,
		dataType : 'json',
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
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
/*
 *作者:zhaoj
 *功能:获取我负责的列表数据
 *日期：20161116
 */
function getDutyTaskList(current_page, callback) {
	api.ajax({
		url : BASE_URL_ACTION + '/ypt/task/getDutyTaskList?random_num=' + creatRandomNum() + '&pageNumber=' + current_page + '&pageSize=' + BASE_PAGE_SIZE + '&personName=' + keyword,
		method : 'get',
		timeout : 30,
		dataType : 'json',
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		if (err) {
			callback(false, '');
		} else {
			if (ret.success) {
				callback(true, ret);
			} else {
				callback(false, '');
			}
		}
		//通知顶部下拉刷新数据加载完毕，组件会恢复到默认状态
		commonControlRefresh();
	});
}
/*
 *作者:zhaoj
 *功能:确认完成和注销两个按钮的操作
 *日期：20161116
 */
function setOperation(conclusion, cur_status, file_path_join, menu_id, operation, task_child_id, task_id, turn_task_id, title, create_login_name, stutas_type) {
	if (stutas_type == 1 || stutas_type == 4) {
		showSelfProgress('注销中...');
	} else if (stutas_type == 2 || stutas_type == 3) {
		showSelfProgress('确认中...');
	} else {
		showSelfProgress('接受中...');
	}
	var type_url = BASE_URL_ACTION + '/ypt/task/setOperation?random_num=' + creatRandomNum() + '&conclusion=' + conclusion + '&cur_status=' + cur_status + '&file_path_join=' + file_path_join + '&menu_id=' + menu_id + '&operation=' + operation + '&task_child_id=' + task_child_id + '&task_id=' + task_id + '&turn_task_id=' + turn_task_id;
	if (stutas_type == 1 || stutas_type == 4) {
		type_url = type_url + '&taskFinish=1';
	}
	api.ajax({
		url : type_url,
		method : 'get',
		timeout : 30,
		dataType : 'json',
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		if (err) {
			showErrorTip(stutas_type);
		} else {
			if (ret.success) {
				if (stutas_type == 1) {
					//结束任务
					setTimeout(function() {
						setTimeoutCommon('', 'changeType(2);', 'index', 1);
					}, 2800);
					setTimeout(function() {
						api.hideProgress();
						setTimeoutCommon('注销任务成功', 'back();', 'detail', 2);
					}, 3000);
				} else if (stutas_type == 2) {
					//发送消息
					var TemplateParamsList = {
						"[#param2]" : title,
						"[#param1]" : $api.getStorage("person_name")
					};
					sendmessageTask(create_login_name, 10, TemplateParamsList, 0);
					//确认完成
					setTimeout(function() {
						setTimeoutCommon('', 'changeType(1);', 'index', 1);
					}, 2800);
					setTimeout(function() {
						api.hideProgress();
						setTimeoutCommon('确认完成成功', 'back();', 'detail', 2);
					}, 3000);
				} else if (stutas_type == 3) {
					//发送消息
					var TemplateParamsList = {
						"[#param2]" : title,
						"[#param1]" : $api.getStorage("person_name")
					};
					sendmessageTask(create_login_name, 10, TemplateParamsList, 0);
					setTimeout(function() {
						api.hideProgress();
						setTimeoutCommon('确认完成成功', 'changeType(1);', 'index', 1);
					}, 3000);
				} else if (stutas_type == 4) {
					setTimeout(function() {
						api.hideProgress();
						setTimeoutCommon('注销任务成功', 'changeType(2);', 'index', 1);
					}, 3000);
				} else if (stutas_type == 5) {
					//发送消息
					var TemplateParamsList = {
						"[#param2]" : title,
						"[#param1]" : $api.getStorage("person_name")
					};
					sendmessageTask(create_login_name, 12, TemplateParamsList, 0);
					setTimeout(function() {
						api.hideProgress();
						setTimeoutCommon('接受任务成功', 'changeType(1);', 'index', 1);
					}, 3000);
				} else {
					//发送消息
					var TemplateParamsList = {
						"[#param2]" : title,
						"[#param1]" : $api.getStorage("person_name")
					};
					sendmessageTask(create_login_name, 12, TemplateParamsList, 0);
					setTimeout(function() {
						setTimeoutCommon('', 'changeType(1);', 'index', 1);
					}, 2800);
					setTimeout(function() {
						api.hideProgress();
						setTimeoutCommon('接受任务成功', 'back();', 'detail', 2);
					}, 3000);
				}
			} else {
				showErrorTip(stutas_type);
			}
		}
	});
}
/*
 *作者:zhaoj
 *功能:提示消息
 *日期：20161116
 */
function showErrorTip(stutas_type){
	api.hideProgress();
	if (stutas_type == 1 || stutas_type == 4) {
		popToast('注销失败，请稍候重试');
	} else if (stutas_type == 2 || stutas_type == 3) {
		popToast('确认失败，请稍候重试');
	} else {
		popToast('接受失败，请稍候重试');
	}
}
/*
 *作者:zhaoj
 *功能:保存任务讨论
 *日期：20161116
 */
function setTimeoutCommon(tip, fun_name, mode_name, type) {
	if (tip != "") {
		popToast(tip);
	}
	if (type == 1) {
		api.execScript({
			name : 'rwgl_' + mode_name + '_window',
			frameName : 'rwgl_' + mode_name + '_frame',
			script : fun_name
		});
	} else {
		api.execScript({
			name : 'rwgl_' + mode_name + '_window',
			script : fun_name
		});
	}
}

/*
 *作者:zhaoj
 *功能:保存任务讨论
 *日期：20161116
 */
function setCommon() {
	$api.css($api.byId('shadow'), 'z-index:3;');
	var comt_content = $api.val($api.byId('comt_content'));
	if (comt_content == '') {
		api.alert({
			msg : '请输入讨论内容'
		}, function(ret, err) {
			$api.byId('comt_content').focus();
		});
		$api.css($api.byId('shadow'), 'z-index:-1;');
		return false;
	}
	showSelfProgress('发布中...');
	api.ajax({
		url : BASE_URL_ACTION + '/ypt/task/setCommon',
		method : 'post',
		timeout : 30,
		dataType : 'json',
		data : {
			values : {
				"content" : comt_content,
				"person_id" : $api.getStorage("person_id"),
				"pid" : task_id,
				"random_num" : creatRandomNum()
			}
		},
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		if (err) {
			api.hideProgress();
			$api.css($api.byId('shadow'), 'z-index:-1;');
			popToast('发布失败，请稍候再试！');
		} else {
			if (ret.success) {
				setTimeout(function() {
					api.execScript({
						name : 'rwgl_detail_window',
						frameName : 'rwgl_detail_frame',
						script : 'initData(1);'
					});
				}, 2800);
				setTimeout(function() {
					api.hideProgress();
					popToast('发布成功');
					api.execScript({
						name : 'rwgl_detail_window',
						script : 'back();'
					});
					$api.css($api.byId('shadow'), 'z-index:-1;');
				}, 3000);
			} else {
				api.hideProgress();
				$api.css($api.byId('shadow'), 'z-index:-1;');
				popToast('发布失败，请稍候再试！');
			}
		}
	});
}

/*
 *作者:zhaoj
 *功能:获取任务讨论列表
 *日期：20161116
 */
function getCommon(task_id, current_page, callback) {
	api.ajax({
		url : BASE_URL_ACTION + '/ypt/task/getCommon?random_num=' + creatRandomNum() + '&pageNumber=' + current_page + '&pageSize=' + BASE_PAGE_SIZE + '&pid=' + task_id,
		method : 'get',
		timeout : 30,
		dataType : 'json',
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		if (err) {
			callback(false, '');
		} else {
			if (ret.success) {
				callback(true, ret);
			} else {
				callback(false, '');
			}
		}
		//通知顶部下拉刷新数据加载完毕，组件会恢复到默认状态
		commonControlRefresh();
	});
}

/*
 *作者:zhaoj
 *功能：催促没有完成任务的人完成任务
 *日期：20161116
 */
function urgeNoFinishTaskPerson(task_id, task_child_id, turn_task_id) {
	getTaskDetail(task_id, task_child_id, turn_task_id, function(flag, ret) {
		api.hideProgress();
		if (flag) {
			var login_name_array = [];
			for (var i = 0; i < ret.join_person.length; i++) {
				if (ret.join_person[i].table_List.join_cur_status_desc != "完成待审批") {
					login_name_array.push(ret.join_person[i].table_List.login_name);
				}
			}
			var login_name_string = login_name_array.toString();
			if (login_name_string != "") {
				var TemplateParamsList = {
					"[#param2]" : ret.list[0].title,
					"[#param1]" : $api.getStorage("person_name")
				};
				sendmessageTask(login_name_string, 11, TemplateParamsList, 1);
			} else {
				popToast('所有承接人都已完成任务');
			}

		} else {
			popToast('催办失败，请稍候再试！');
		}
	});
}

/*
 *作者:zhaoj
 *功能:发送消息
 *日期：20161117
 */
function sendmessageTask(TargetList, TemplateId, TemplateParamsList, type) {
	var sender_login_name = commonNewParamToOldParam($api.getStorage("login_name"));
	if (type != 0) {
		showSelfProgress('催办中...');
	}
	api.ajax({
		url : BASE_URL_ACTION + '/ypt/space/sendmessage/sendmessage_task',
		method : 'post',
		timeout : 30,
		dataType : 'json',
		data : {
			values : {
				"TypeId" : 1,
				"BusinessId" : -1,
				"TargetList" : TargetList,
				"TemplateId" : TemplateId,
				"SenderIdentity" : $api.getStorage("identity"),
				"SenderId" : $api.getStorage("person_id"),
				"SenderLoginName" : sender_login_name,
				"IsUrl" : 1,
				"UrlName" : "rwgl_index_window",
				"TemplateParamsList" : TemplateParamsList,
				"random_num" : creatRandomNum()
			}
		},
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		if (type != 0) {
			api.hideProgress();
		}
		if (err) {
			if (type) {
				popToast('催办失败，请稍候再试！');
			}
		} else {
			if (ret.success) {
				if (type) {
					popToast('催办成功');
				}
			} else {
				if (type) {
					popToast('催办失败，请稍候再试！');
				}
			}
		}
	});
}
/*
 *作者:zhaoj
 *功能:获取统计数据
 *日期：20161117
 */
function getTaskTongji(callback){
	var queryType;
	if(type == 1){
		queryType = 2;//指派给我
	}else if(type == 2){
		queryType = 1;//我指派的
	}else{
		queryType = 3;//我负责的
	}
	var startTime = $api.text($api.byId('start_time'))+' 00:00:00';
	var endTime = $api.text($api.byId('end_time'))+' 23:59:59';
	var queryPersonId = $api.byId('j_person_title').getAttribute('personId');
	api.ajax({
		url : BASE_URL_ACTION + '/ypt/task/getTaskTongji?random_num=' + creatRandomNum()+'&queryPersonId='+queryPersonId + '&queryType=' + queryType + '&startTime=' + startTime + '&endTime=' + endTime,
		method : 'get',
		timeout : 30,
		dataType : 'json',
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
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
/*
*作者:zhaoj
*功能:获取承接人和发布人
*日期：20161117
*/
function getPerson(callback){
	var queryType;
	if(type == 1 || type ==3){
		queryType = 2;//查询所有创建人
	}else if(type == 2){
		queryType = 1;//查询所有承接人
	}
	api.ajax({
		url : BASE_URL_ACTION + '/ypt/task/getPerson?random_num=' + creatRandomNum() + '&queryType=' + queryType,
		method : 'get',
		timeout : 30,
		dataType : 'json',
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
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


