/*
*作者:zhaoj
*功能:获取学期
*日期：20160817
*/
function getListSemester(callback){
	api.ajax({
		url : BASE_URL_ACTION + '/subject/getListSemester',
		method : 'post',
		timeout : 30,
		dataType : 'json',
		cache : false,
	}, function(ret, err) {
		if (err) {
			popToast('获取学期失败');
		} else {
			if(ret){
				if(ret.xqlist.length>0){
					var data ={"xqlist":[]};
					for(var i=0;i<ret.xqlist.length;i++){
						var oparam = new Object();
						if(ret.xqlist[i].XQ_ID <= ret.enable_id){
							oparam.JSRQ = ret.xqlist[i].JSRQ;
							oparam.KSRQ = ret.xqlist[i].KSRQ;
							oparam.SFDQXQ = ret.xqlist[i].SFDQXQ;
							oparam.XN = ret.xqlist[i].XN;
							oparam.XQMC = ret.xqlist[i].XQMC;
							oparam.XQ_ID = ret.xqlist[i].XQ_ID;
							data.xqlist.push(oparam);
						}
					}
					callback(true,data);
				}else{
					popToast('暂无学期');
				}
			}else{
				popToast('获取学期失败');
			}
		}
	});
}
/*
*作者:zhaoj
*功能:渲染html
*日期：20160817
*/
function addZuoyeTemplateHtml(div_id, script_id, data,current_Page){
	var html_type = template.render(script_id, data);
	if (currentPage == 1 && current_Page == 1) {
		document.getElementById(div_id).innerHTML = html_type;
	} else {
		$api.append($api.byId(div_id), html_type);
	}
}
/*
*作者:zhaoj
*功能:渲染html
*日期：20160817
*/
function addTemplateHtml(div_id, script_id, data){
	var html_type = template.render(script_id, data);
	if (currentPage == 1) {
		document.getElementById(div_id).innerHTML = html_type;
	} else {
		$api.append($api.byId(div_id), html_type);
	}
}
/*
*作者:zhaoj
*功能:渲染html
*日期：20160817
*/
function templateHtml(div_id, script_id, data){
	var html_type = template.render(script_id, data);
	document.getElementById(div_id).innerHTML = html_type;
}
/*
*作者:zhaoj
*功能:打开科目滑动
*日期：20160817
*/
function openNavigationBar(bar_items,type) {
	commonCloseNavigationBar();
	var params = {
		y : header_h,
		items : bar_items,
		winName:'lx_xs_lxls_window',
		frameName:'lx_xs_lxls_frame'
	};
	commonMyNavigationBar(params);
}

/*
*作者:zhaoj
*功能:查看内容
*日期：20160818
*/
function viewContent(){
	api.openWin({
		name : 'lx_xs_lxst_window',
		scrollToTop : true,
		allowEdit : false,
		url : 'lx_xs_lxst_window.html',
		rect : {
			x : 0,
			y : header_h,
			w : 'auto',
			h : api.winHeight - header_h,
		},
		pageParam : {
			header_h : header_h,
			zy_id : zy_id
		},
		vScrollBarEnabled : true,
		hScrollBarEnabled : true,
		//页面是否弹动 为了下拉刷新使用
		bounces : false
	});
}

/*
*作者:zhaoj
*功能:获取练习列表
*日期：20160819
*/
function getStudentZylist(is_show,subjectId,current_Page){
	commonGetStudentInfoByParentId(p_id, i_id, function(is_true, stu_info_json){
		if(is_true) {
			if(is_show==1){
				showSelfProgress('加载中...');
			}else if(is_show==2){
				showSelfProgress('刷新中...');
			}
			setZyData(current_Page,zy_data.year);
			api.ajax({
				url : BASE_URL_ACTION + '/xx/getStudentZylist',
				method : 'get',
				timeout : 30,
				dataType : 'json',
				returnAll : false,
				data : {
					values : {
						"random_num" : creatRandomNum(),
						"student_id" : stu_info_json.student_id,
						"subject_id" : subjectId,
						"zy_statu" : 0,
						"pageSize" : BASE_PAGE_SIZE,
						"pageNumber" :current_Page,
						"p_type" : 2,
						"zy_type" : 3,
						"keyword" : ""
					}
				}
			}, function(ret, err) {
				api.hideProgress();
				if (err) {
				} else {
					if(ret.success){
						var list = ret.zy_list;
						var nowYear = nowTime.getFullYear();
						var nowMonth = nowTime.getMonth()+1;
						var flag=true;
						if(list.length > 0){
							for(var i = 0; i < list.length; i++){
								var startTime = list[i].start_time.replace(/\-/g, "/");
								startTime = Date.parse(startTime);
								var zyYear = list[i].start_time.substring(0,4);
								var zyMonth = list[i].start_time.substring(5,7);
								if(zy_data.year==''||zyYear !=zy_data.year){
									if(zy_data.year != ''){
										if(currentPage == 1){
											flag=false;
										}
										addZuoyeTemplateHtml('zy_div', 'zy_script',zy_data,currentPage);
									}
									zy_data.year=zyYear;
									setZyData(1,zyYear);
								}
								totalPage = ret.totalPage;
			                    zy_data.length = ret.totalRow;
								var param = new Object();
								param.zy_tijiao_statu = list[i].zy_tijiao_statu;
								param.day = list[i].start_time.substring(8,10);
								param.time = list[i].start_time.substring(11,16);
								param.zy_name = list[i].zy_name;
								param.zy_name_base64 = Base64.encode(list[i].zy_name);
								param.zy_id = list[i].zy_id;
								param.zy_desc = list[i].zy_desc;
								param.zy_desc_base64 = Base64.encode(list[i].zy_desc);
								param.stu_scores = list[i].stu_scores;
								param.total_scores = list[i].total_scores;
								param.score_rate = list[i].score_rate;
								if(list[i].zy_nd < 1.5){
									param.zy_nd = '易';
								}else if(list[i].zy_nd < 2.5){
									param.zy_nd = '一般';
								}else if(list[i].zy_nd < 3.5){
									param.zy_nd = '中';
								}else if(list[i].zy_nd < 4.5){
									param.zy_nd = '较难';
								}else{
									param.zy_nd = '难';
								}
								for(var j = 0; j<zy_data.list.length;j++){
									if(zy_data.list[j].num == zyMonth*1){
										zy_data.list[j].zy_list.push(param);
									}
								}
							}
						}
					}
					if(flag){
						addZuoyeTemplateHtml('zy_div', 'zy_script',zy_data,current_Page);
					}else{
						addZuoyeTemplateHtml('zy_div', 'zy_script',zy_data,2);
					}
				}
			});
			//通知顶部下拉刷新数据加载完毕，组件会恢复到默认状态
			commonControlRefresh();
		} else {
			api.toast({
				msg:stu_info_json
			});
		}	
	});
}

/*
*作者:zhaoj
*功能:设置检测数据的初始化
*日期：20160819
*/
function setZyData(type,year){
	if(type!=1){
		zy_data.is_live=1;
	}else{
		zy_data.is_live=0;
	}
	zy_data.list=[];
	if(type == 1){
		for(var i = 12; i > 0; i-- ){
			var k = i;
			var param = new Object();
			param.month = k+'月';
			param.num = k;
			param.is_live = 0;
			param.zy_list = [];
			zy_data.list.push(param);
		}
	}else{
		for(var i = 12; i > 0; i-- ){
			var k = i;
			if(!!document.getElementById("j_"+year+"_"+k)){
				var param = new Object();
				param.month = k+'月';
				param.num = k;
				param.is_live = 1;
				param.zy_list = [];
			}else{
				var param = new Object();
				param.month = k+'月';
				param.num = k;
				param.is_live = 0;
				param.zy_list = [];
			}
			zy_data.list.push(param);
		}
	}
}

/*
*作者:zhaoj
*功能:获取当前时间
*日期：20160819
*/
function getCurrentDate(callback){
	api.ajax({
		url :BASE_URL_ACTION + '/xx/getCurrentDate',
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
			if(ret.success){
				nowTime = new Date(ret.dateStr2.replace(/\-/g, "/"));
				nowMillisecond = Date.parse(new Date(ret.dateStr2.replace(/\-/g, "/")));	
			}else{
				nowTime = new Date();
				nowMillisecond = Date.parse(nowTime);
			}
		}
		callback(true);
	});
}

/*
*作者:zhaoj
*功能:获取检测
*日期：20160819
*/
function getZyDetailByStuZyId(is_show,id,callback){
	commonGetStudentInfoByParentId(p_id, i_id, function(is_true, stu_info_json){
		if(is_true) {
			if(is_show){
				showSelfProgress('加载中...');
			}
			api.ajax({
				url : BASE_URL_ACTION + '/xx/getZyDetailByStuZyId',
				method : 'post',
				timeout : 30,
				dataType : 'json',
				data : {
					values : {
						"random_num" : creatRandomNum(),
						"zy_id" : id,
						"zy_type" :3,
						"student_id" : stu_info_json.student_id,
						"p_type" : 2
					}
				}
			}, function(ret, err) {
				api.hideProgress();
				if (err) {
					popToast('获取成绩详细失败');
				} else {
					if(ret.success){
						var nd=ret.zy_info.total_scores/ret.zy_info.ti_count;
						var nd_name;
						if(nd<1.5){
					        nd_name='易';
					    }else if(nd<2.5){
					        nd_name='一般';
					    }else if(nd<3.5){
					        nd_name='中';
					    }else if(nd<4.5){
					        nd_name='较难';
					    }else if(nd<=5){
					        nd_name='难';
					    }
						q_json_str = {"zy_info" :{
										"list":	[],
										"zy_desc":ret.zy_info.zy_desc,
										"zy_question_ids":ret.zy_info.zy_question_ids,
										"zy_type":ret.zy_info.zy_type,
										"zy_name":ret.zy_info.zy_name,
										"zy_id":ret.zy_info.zy_id,
										"time_slot":GetDateDiff(ret.zy_info.stu_start_time,ret.zy_info.stu_end_time),
										"zy_type":ret.zy_info.zy_type,
										"end_time":ret.zy_info.end_time,
										"total_scores":ret.zy_info.total_scores,
										"start_time":ret.zy_info.start_time,
										"scheme_id":ret.zy_info.scheme_id,
										"ti_count":ret.zy_info.ti_count,
										"person_name":$api.getStorage('person_name'),
										"stu_scores":ret.zy_info.stu_scores,
										"score_rate":ret.zy_info.score_rate,
										"scheme_id":ret.zy_info.scheme_id,
										"structure_id":ret.zy_info.structure_id,
										"subject_id":ret.zy_info.subject_id,
										"nd_name":nd_name
										}
									};
						var  list = ret.zy_info.ques;
						if(list.length>0){
							for(var i = 0; i<list.length;i++){
								var oparam = new Object();
								if(list.length >5){
									oparam.list_length = 5;
								}else{
									oparam.list_length = list.length;
								}
								oparam.question_id = list[i].question_id;
								oparam.que_scores= list[i].que_scores;
								oparam.score= list[i].score;
								oparam.que_nd= list[i].que_nd;
								oparam.stu_answer= list[i].stu_answer;
								oparam.qt_type = list[i].qt_type;
								oparam.qt_id = list[i].qt_id;
								oparam.sort = list[i].sort;
								oparam.qt_name = list[i].qt_name;
								oparam.question_id_char= list[i].question_id_char;
								if(list[i].html_json){
									oparam.html_json={};
									var question_title = Base64.decode(list[i].html_json.question_title);
									var key = '/dsideal_yy';
									var key_re = BASE_URL_ACTION;
									oparam.html_json.question_title = question_title.replaceAll(key, key_re);
									var question_analysis=Base64.decode(list[i].html_json.question_analysis);
									oparam.html_json.question_analysis = question_analysis.replaceAll(key, key_re);
									oparam.html_json.question_analysis = oparam.html_json.question_analysis == ""?"略":oparam.html_json.question_analysis;
									oparam.html_json.question_answer= Base64.decode(list[i].html_json.question_answer).replaceAll(key, key_re);
									if(list[i].html_json.quetionOption != ''){
										var count_length = count(list[i].html_json.quetionOption);
										oparam.html_json.question_answer_length = count_length;
										oparam.html_json.quetionOption=JSON.parse(commonQuetionOption(count_length,JSON.stringify(list[i].html_json.quetionOption),key,key_re));
										oparam.html_json.question_answer_first = JSON.parse(commonQuetionOptionFirst(count_length))
									}else{
										oparam.html_json.question_answer_length = 0;
									}
								}else{
									oparam.html_json = list[i].html_json;
								}
								q_json_str.zy_info.list.push(oparam);
							}
						}
						callback(true,q_json_str);
					}else{
						popToast('获取成绩详细失败');
					}
					
				}
			});
		} else {
			api.toast({
				msg:stu_info_json
			});
		}	
	});
}
/*
* 获得时间差,时间格式为 年-月-日 小时:分钟:秒 或者 年/月/日 小时：分钟：秒
* 其中，年月日为全格式，例如 ： 2010-10-12 01:00:00
* 返回精度为：秒，分，小时，天
*/
function GetDateDiff(startTime,endTime) {
	var data1=new Date(startTime.replace(/\-/g, "/"));
	var date2=new Date(endTime.replace(/\-/g, "/"));//new Date();    //结束时间
	var date3=date2.getTime()-data1.getTime();  //时间差的毫秒数

	//------------------------------
	//计算出相差天数
	var days=Math.floor(date3/(24*3600*1000))
	 
	//计算出小时数
	var leave1=date3%(24*3600*1000)    //计算天数后剩余的毫秒数
	var hours=Math.floor(leave1/(3600*1000))
	//计算相差分钟数
	var leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数
	var minutes=Math.floor(leave2/(60*1000))
	//计算相差秒数
	var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
	var seconds=Math.round(leave3/1000)
	var time;
	if(days>0){
		time = days+"天 "+hours+"小时 "+minutes+"分钟"+seconds+'秒';
	}else if(days == 0 && hours > 0){
		time = hours+"小时 "+minutes+"分钟"+seconds+'秒';
	}else if(days == 0 && hours == 0 && minutes > 0){
		time = minutes+"分钟"+seconds+'秒';
	}else{
		time = seconds+'秒';
	}
	return time;
}
/*
*作者:zhaoj
*功能:获取曲线数据
*日期：20160819
*/
function getStudentZylistCJ(id,structure_id,scheme_id,subject_id,pageSize,callback){
	commonGetStudentInfoByParentId(p_id, i_id, function(is_true, stu_info_json){
		if(is_true) {
			api.showProgress({
				title : '加载中...',
				text : '请稍候...',
				modal : false
			});
			api.ajax({
				url : BASE_URL_ACTION + '/xx/getStudentZylist',
				method : 'post',
				timeout : 30,
				dataType : 'json',
				data : {
					values : {
						"random_num" : creatRandomNum(),
						"zy_id" : id,
						"zy_type" :3,
						"student_id" : stu_info_json.student_id,
						"cnode" : 0,
						"is_root" :0,
						"nid" :structure_id,
						"pageNumber" : 1,
						"pageSize" : pageSize,
						"scheme_id" : scheme_id,
						"subject_id" : subject_id,
						"zy_statu" : 0,
						"p_type" : 2
					}
				}
			}, function(ret, err) {
				api.hideProgress();
				if (err) {
					popToast('获取进步曲线失败');
				} else {
					if(ret.success){
						callback(ret);
					}else{
						popToast('获取进步曲线失败');
					}
				}
			});
		} else {
			api.toast({
				msg:stu_info_json
			});
		}	
	});
}
/*
*作者:zhaoj
*功能:获取更多历史页面中的数据
*日期：20160819
*/
function getStudentZylistLS(structure_id,scheme_id,subject_id,pageSize,callback){
	commonGetStudentInfoByParentId(p_id, i_id, function(is_true, stu_info_json){
		if(is_true) {
			api.showProgress({
				title : '加载中...',
				text : '请稍候...',
				modal : false
			});
			api.ajax({
				url : BASE_URL_ACTION + '/xx/getStudentZylist',
				method : 'post',
				timeout : 30,
				dataType : 'json',
				data : {
					values : {
						"random_num" : creatRandomNum(),
						"zy_type" :3,
						"student_id" : stu_info_json.student_id,
						"cnode" : 0,
						"is_root" :0,
						"nid" :structure_id,
						"pageNumber" : 1,
						"pageSize" : pageSize,
						"scheme_id" : scheme_id,
						"subject_id" : subject_id,
						"zy_statu" : -1,
						"p_type" : 2
					}
				}
			}, function(ret, err) {
				api.hideProgress();
				if (err) {
					popToast('获取进步曲线失败');
				} else {
					if(ret.success){
						callback(ret);
					}else{
						popToast('获取进步曲线失败');
					}
				}
			});
		} else {
			api.toast({
				msg:stu_info_json
			});
		}	
	});
}
/*
*作者:zhaoj
*功能:获取对象长度
*日期：20160819
*/
function count(o){
    var t = typeof o;
	if(t == 'object'){
        var n = 0;
        for(var i in o){
                n++;
        }
    }
    return n;
};

/*
*作者:zhaoj
*功能:获取练习的教材
*日期：20160824
*/
function getTeachBook(is_show,callback){
	commonGetStudentInfoByParentId(p_id, i_id, function(is_true, stu_info_json){
		if(is_true) {
			if(is_show){
				showSelfProgress('加载中...');
			}
			api.ajax({
				url : BASE_URL_ACTION + '/ypt/bkCtl/getTeachBook',
				method : 'get',
				timeout : 30,
				dataType : 'json',
				data : {
					values : {
						"random_num" : creatRandomNum(),
						"identity_id" : 6,
						"teacher_id" : stu_info_json.student_id,
					}
				},
				headers : {
					'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
				}
			}, function(ret, err) {
				api.hideProgress();
				if (err) {
					popToast('获取课本失败');
				} else {
					if(ret.success){
						callback(ret);
					}else{
						popToast('获取进课本失败');
					}
				}
				//通知顶部下拉刷新数据加载完毕，组件会恢复到默认状态
				commonControlRefresh();
			});
		} else {
				api.toast({
					msg:stu_info_json
				});
			}	
		});
}

/*
*作者:zhaoj
*功能:获取练习
*日期：20160826
*/
function getZyInfoById(){
	api.showProgress({
		title : '加载中...',
		text : '请稍候...',
		modal : false
	});
	api.ajax({
		url : BASE_URL_ACTION + '/xx/getZyInfoById',
		method : 'post',
		timeout : 0,
		dataType : 'json',
		data : {
			values : {
				"random_num" : creatRandomNum(),
				"zy_id" : api.pageParam.zy_id,
				"zy_type" :3,
				"p_type" : 2
			}
		},
		headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
		}, function(ret, err) {
			api.hideProgress();
			if (err) {
				q_json_str = {"zy_info" : {"list":[]}};
		} else {
			if(ret.success){
				q_json_str = {"zy_info" : {"list":[],"zy_desc":ret.zy_info.zy_desc,"zy_question_ids":ret.zy_info.zy_question_ids,"zy_type":ret.zy_info.zy_type,"zy_name":ret.zy_info.zy_name,"zy_id":ret.zy_info.zy_id}};
				var  list = ret.zy_info.ques;
				if(list.length>0){
					for(var i = 0; i<list.length&&i < 5;i++){
						var oparam = new Object();
						if(list.length>5){
							oparam.list_length = 5;
						}else{
							oparam.list_length = list.length;
						}
						oparam.question_id = list[i].question_id;
						oparam.qt_type = list[i].qt_type;
						oparam.qt_id = list[i].qt_id;
						oparam.sort = list[i].sort;
						oparam.qt_name = list[i].qt_name;
						oparam.question_id_char= list[i].question_id_char;
						if(list[i].html_json){
							var key = '/dsideal_yy';
							var key_re = BASE_URL_ACTION;
							oparam.html_json={};
							var question_title = Base64.decode(list[i].html_json.question_title);
							oparam.html_json.question_title = question_title.replaceAll(key, key_re);
							oparam.html_json.question_analysis = Base64.decode(list[i].html_json.question_analysis).replaceAll(key, key_re);
							oparam.html_json.question_analysis = oparam.html_json.question_analysis == ""?"略":oparam.html_json.question_analysis;
							oparam.html_json.question_answer= Base64.decode(list[i].html_json.question_answer).replaceAll(key, key_re);
							if(list[i].html_json.quetionOption != ''){
								var count_length = count(list[i].html_json.quetionOption);
								oparam.html_json.question_answer_length = count_length;
								oparam.html_json.quetionOption=JSON.parse(commonQuetionOption(count_length,JSON.stringify(list[i].html_json.quetionOption),key,key_re));
								oparam.html_json.question_answer_first = JSON.parse(commonQuetionOptionFirst(count_length))
							}else{
								oparam.html_json.question_answer_length = 0;
							}
						}else{
							oparam.html_json = list[i].html_json;
						}
						q_json_str.zy_info.list.push(oparam);
					}
				}
			}else{
				api.hideProgress();
				q_json_str = {"zy_info" : {"list":[]}};
			}
		}
		//重写页面
		reWriteQuestion(q_cur_num);
	});
}

/*
*作者:zhaoj
*功能:练习历史
*日期：20160816
*/
function practiceHistory(){
	api.openWin({
		name : 'lx_xs_lxls_window',
		scrollToTop : true,
		allowEdit : false,
		url : 'lx_xs_lxls_window.html',
		rect : {
			x : 0,
			y : header_h,
			w : 'auto',
			h : api.winHeight - header_h,
		},
		pageParam : {
			header_h : header_h
		},
		vScrollBarEnabled : true,
		hScrollBarEnabled : true,
		//页面是否弹动 为了下拉刷新使用
		bounces : false
	});
}