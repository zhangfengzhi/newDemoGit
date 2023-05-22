/*
*author:zhaoj
*function:获取学期
*date：20160714
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
*author:zhaoj
*function:打开类型滑动
*date：20160714
*/
function openNavigationBar(bar_items,type) {
	commonCloseNavigationBar();
	if(type == 1){
		var params = {
			y : header_h+30,
			items : bar_items,
			winName:'ktpj_pjxq_window',
			frameName:'ktpj_pjxq_frame'
		};
	}else if(type == 2){
		var params = {
			y : header_h,
			items : bar_items,
			winName:'ktpj_pjxq_window',
			frameName:'ktpj_pjxq_frame'
		};
	}else{
		var params = {
			y : header_h+30,
			items : bar_items,
			winName:'ktpj_index_window',
			frameName:'ktpj_index_frame'
		};
	}
	commonMyNavigationBar(params);
}
/*
 *author:zhaoj
 *function:渲染html
 *date：20160627
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
*author:zhaoj
*function:获取教师所教科目
*date：20160715
*/
function getTeachPlanByTeacherId(callback){
	showSelfProgress('加载中...');
	api.ajax({
		url : BASE_URL_ACTION + '/person/getTeachPlanByTeacherId',
		method : 'post',
		timeout : 30,
		dataType : 'json',
		cache : false,
		data : {
			values : {
				"random_num":creatRandomNum(),
				"pageNumber":1,
				"pageSize":20,
				"teacher_id":$api.getStorage("person_id"),
				"xq_id":xq_id,
				"class_id":class_id	
			}
		},
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		api.hideProgress();
		if (err) {
			api.hideProgress();
			popToast('获取科目失败');
		} else {
			if(ret.success){
				var bar_items = [{
					title : '全部',
					titleSelected : '全部',
					bg : "#ffffff",
					alpha : 0.8,
					bgSelected : "#ffffff"
				}];
				levelArray=[0];
				if(ret.table_List.length > 0){
					for(var i = 0; i < ret.table_List.length; i++){
						if(ret.table_List[i].CLASS_ID == class_id){
							var oparam = new Object();
							oparam.title = ret.table_List[i].SUBJECT_NAME;
							oparam.id = ret.table_List[i].SUBJECT_ID;
							bar_items.push(oparam);
							levelArray.push(ret.table_List[i].SUBJECT_ID);
						}
					}
					callback(true,bar_items);
				}else{
					callback(false,bar_items);
				}
			}else{
				api.hideProgress();
				popToast('获取科目失败');
			}
		}
	});
}
/*
*author:zhaoj
*function:获取评价的具体
*date：20160715
*/
function getAppraiseInfoListBySubjectId(is_show,current_page,subject_id){
	getStudentInfoByParentId(p_id, i_id, function(is_true, stu_info_json){
		if(is_true) {
			showSelfProgress('加载中...');
			var list_url;
			if(identity_id == 5){
				list_url = BASE_URL_ACTION + '/ypt/space/a_word/get_appraise_info_list_by_subjectid?random_num='+creatRandomNum()+'&student_id='+student_id+'&subject_id='+subject_id+'&teacher_id='+$api.getStorage("person_id")+'&xq_id='+xq_id+'&page_num='+current_page+'&page_size='+BASE_PAGE_SIZE;
			}else{
				list_url = BASE_URL_ACTION + '/ypt/space/a_word/get_appraise_info_list_by_subjectid?random_num='+creatRandomNum()+'&student_id='+stu_info_json.student_id+'&subject_id='+subject_id+'&xq_id='+xq_id+'&page_num='+current_page+'&page_size='+BASE_PAGE_SIZE;
			}
			api.ajax({
				url : list_url,
				method : 'get',
				timeout : 30,
				dataType : 'json',
				cache : false,
				headers : {
					'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
				}
			}, function(ret, err) {
				api.hideProgress();
				if (err) {
					api.hideProgress();
					popToast('获取课堂评价失败');
				} else {
					if(ret.success){
						if(ret.list.length>0){
							for(var i = 0; i < ret.list.length; i++){
								ret.list[i].class_hour = getLessons(ret.list[i].class_hour);
							}
						}
						addTemplateHtml('pj_body', 'pj_script', ret);
					}else{
						api.hideProgress();
						popToast('获取课堂评价失败');
					}
				}
				//通知顶部下拉刷新数据加载完毕，组件会恢复到默认状态
				commonControlRefresh();
			});
		}
	});
}
/*
*author:zhaoj
*function:具体是某一节课
*date：20160715
*/
function getLessons(class_hour){
    var Lessons='';
    switch (class_hour.toString().substr(0,1)){
        case '1':
            Lessons='一';
            break;
        case '2':
            Lessons='二';
            break;
        case '3':
            Lessons='三';
            break;
        case '4':
            Lessons='四';
            break;
        case '5':
            Lessons='五';
            break;
        case '6':
            Lessons='六';
            break;
        case '7':
            Lessons='七';
            break;
        case '8':
            Lessons='八';
            break;
    }
    return Lessons;
}
/*
*author:zhaoj
*function:具体是某一节课
*date：20160715
*/
function getPersonInfo(callback){
	getStudentInfoByParentId(p_id, i_id, function(is_true, stu_info_json){
		personId = i_id == 7 ? 6 : i_id;
		if(is_true) {
			api.ajax({
				url : BASE_URL_ACTION + '/person/getPersonInfo',
				method : 'post',
				timeout : 30,
				dataType : 'json',
				cache : false,
				data : {
					values : {
						"random_num":creatRandomNum(),
						"person_id":stu_info_json.student_id,
						"identity_id":personId
					}
				},
				headers : {
					'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
				}
			}, function(ret, err) {
				if (err) {
					popToast('获取个人失败');
				} else {
					if(ret.success){
						callback(ret);
					}else{
						popToast('获取个人失败');
					}
				}
			});
		}
	});
}
/*
*author:zhaoj
*function:获取学生的学科
*date：20160715
*/
function getSubjectsByClassId(classId,callback){
	api.ajax({
		url : BASE_URL_ACTION + '/ypt/space/a_word/get_subjects_by_classid',
		method : 'get',
		timeout : 30,
		dataType : 'json',
		cache : false,
		data : {
			values : {
				"random_num":creatRandomNum(),
				"class_id":classId,
				"xq_id":xq_id
			}
		},
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		if (err) {
			popToast('获取学科失败');
		} else {
			if(ret.success){
				var bar_items = [{
					title : '全部',
					titleSelected : '全部',
					bg : "#ffffff",
					alpha : 0.8,
					bgSelected : "#ffffff"
				}];
				levelArray=[0];
				if(ret.list.length > 0){
					for(var i = 0; i < ret.list.length; i++){
						var oparam = new Object();
						oparam.title = ret.list[i].subject_name;
						oparam.id = ret.list[i].subject_id;
						bar_items.push(oparam);
					}
				}
				callback(true,bar_items);
			}else{
				popToast('获取学科失败');
			}
		}
	});
}
/**
 * 根据家长id获取学生
 * 周枫
 * 2016.4.25
 */
function getStudentInfoByParentId(p_id, i_id, callback) {
	if(i_id == 5){
		callback(true, '');
	}else if (i_id == 6) {
		var stu_list = {};
		stu_list["student_id"] = p_id;
		callback(true, stu_list);
	} else {
		api.ajax({
			url : $api.getStorage('BASE_URL_ACTION') + '/person/getPersonInfo',
			method : 'post',
			dataType : 'json',
			data : {
				values : {
					person_id : p_id,
					identity_id : i_id
				}
			}
		}, function(ret, err) {
			if (err) {
				callback(false, '未找到您的孩子，请联系班主任老师');
				setTimeout(function() {
					api.closeWin();
				}, 2000);
			} else {
				if (ret.success) {
					callback(true, ret.table_List);
				} else {
					callback(false, '未找到您的孩子，请联系班主任老师');
					setTimeout(function() {
						api.closeWin();
					}, 2000);
				}
			}
		});
	}
}