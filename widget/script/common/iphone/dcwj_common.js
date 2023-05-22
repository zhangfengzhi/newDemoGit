/*
*作者:zhaoj
*功能:打开页面frame页面的公共方法
*日期：20161029
*/
function openCommonFrame(name,height,is_bounces,pageParamJson){
	api.openFrame({
		name : name,
		scrollToTop : true,
		allowEdit : false,
		url : name+'.html',
		rect : {
			x : 0,
			y : header_h + height,
			w : 'auto',
			h : api.winHeight - header_h - height,
		},
		pageParam : pageParamJson,
		bgColor: '#ffffff',
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
*功能:移除上拉获取新的数据
*日期：20161103
*/
function removeScrollBottomReload(){
	api.removeEventListener({
	    name: 'scrolltobottom'
	});
}
/*
*作者:zhaoj
*功能:获取滑动条的数据
*日期：20161029
*/
function openMyNavigationBar(type){
	m_type = type;
	//关闭滑动条
	commonCloseNavigationBar();
	if(type == 1){
		var width = Math.floor(api.frameWidth/4);
		var data={'width':width,'bar_items':[
			{
				title : '全部',
				id:''
			},
			{
				title : '未发布',
				id:'0'
			},
			{
				title : '收集中',
				id:'1'
			},
			{
				title : '已结束',
				id:'2'
			}]
		}
	}else{
		var width = Math.floor(api.frameWidth/3);
		var data={'width':width,'bar_items':[
			{
				title : '全部',
				id:''
			},
			{
				title : '未答',
				id:'0'
			},
			{
				title : '已答',
				id:'1'
			}]
		}
	}
	var params = {
		y : header_h,
		h : 45,
		itemSize : {
			w : data.width
		},
		font : {
			"size":15
		},
		file_level:2,
		//按钮项
		items : data.bar_items,
		winName:'dcwj_index_window',
		frameName:'dcwj_index_frame'
	};
	commonMyNavigationBar(params);
}
/*
*作者:zhaoj
*功能:打开操作选项
*日期：20161031
*/
function haveOpt(type,answer_id,id,name_base64){
	if(type == 0){
		var buttonArray = ['预览','查看结果'];
		var functionArray = ['commonOpenWin("dcwj_detail_window", "dcwj_detail_window.html", false, false, {"header_h":'+header_h+',"id":'+id+',"type":1,"name_base64":"'+name_base64+'"})','viewStatistics(1,'+id+',"'+name_base64+'")'];
	}else if(type == 1){
		var buttonArray = ['查看答题','查看结果'];
		var functionArray = ['commonOpenWin("dcwj_detail_window", "dcwj_detail_window.html", false, false, {"header_h":'+header_h+',"id":'+id+',"answer_id":'+answer_id+',"type":2,"name_base64":"'+name_base64+'"})','viewStatistics(0,'+id+',"'+name_base64+'")'];
	}else{
		var buttonArray = ['查看答题'];
		var functionArray = ['commonOpenWin("dcwj_detail_window", "dcwj_detail_window.html", false, false, {"header_h":'+header_h+',"id":'+id+',"answer_id":'+answer_id+',"type":2,"name_base64":"'+name_base64+'"})'];
	}
	api.actionSheet({
	    cancelTitle: '取消',
	    buttons: buttonArray,
	    style:{
	    	titleFontColor:'#ff0000'
	    }
	},function( ret, err ){
	    if( ret ){
	    	var index = ret.buttonIndex*1-1;
	    	 eval(functionArray[index]);
	    }else{
			popToast('网络繁忙，请稍候再试！');
	    }
	});
}
/*
*作者:zhaoj
*功能:查看统计
*日期：20161031
*/
function viewStatistics(type,id,name_base64){
	var pageParamJson={"header_h" : header_h,"id":id,"name_base64":name_base64,"type":type};
	commonOpenWin('dcwj_tj_detail_window', 'dcwj_tj_detail_window.html', false, false, pageParamJson);
}
/*
*作者:zhaoj
*功能:删除我创建的
*日期：20161031
*/
function detele(id,name_base64){
	popAlert('删除我创建的');
}
/*
*作者:zhaoj
*功能:终止我创建的
*日期：20161031
*/
function stop(id,name_base64){
	popAlert('终止我创建的');
}
/*
*作者:zhaoj
*功能:获取问题列表数据
*日期：20161101
*/
function getSurveyById(wjdc_id,callback){
	api.ajax({
		url :BASE_URL_ACTION + '/space/survey/get_survey_byid?random_num='+creatRandomNum()+'&id='+wjdc_id,
		method : 'get',
		timeout : 30,
		dataType : 'json',
		headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' +$api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
	}
	}, function(ret, err) {
		if (err) {
			callback(false,'');
		} else {
			if(ret.success){
				callback(true,ret.data);
			}else{
				callback(false,'');
			}
		}
	});
}
/*
*作者:zhaoj
*功能:进入下一道题
*日期：20161101
*/
function nextQuestion() {
	api.addEventListener({
		name : 'swipeleft'
	}, function(ret, err) {
		goNextQuestion();
	});
}
/*
*作者:zhaoj
*功能:进入下一道题
*日期：20161101
*/
function goNextQuestion(){
	if (q_cur_num < q_sum) {
		q_cur_num++;
		reWriteQuestion(q_cur_num);
	} else {
		q_cur_num = q_cur_num;
		popToast('已经到最后一题');
	}
}
/*
*作者:zhaoj
*功能:进入上一道题
*日期：20161101
*/
function preQuestion() {
	api.addEventListener({
		name : 'swiperight'
	}, function(ret, err) {
		enterPreQuestion();
	});
}
/*
*作者:zhaoj
*功能:进入上一道题
*日期：20161101
*/
function enterPreQuestion(){
	if (q_cur_num > 0) {
		q_cur_num--;
	} else {
		popToast('已经到第一题');
		q_cur_num = 0;
	}
	reWriteQuestion(q_cur_num);
}
/*
*作者:zhaoj
*功能:渲染html
*日期：20161101
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
*功能:没有分页的渲染html
*日期：20161101
*/
function addSingleTemplateHtml(div_id, script_id, data){
	var html_type = template.render(script_id, data);
	document.getElementById(div_id).innerHTML = html_type;
}
/*
*作者:zhaoj
*功能:根据题目id获取统计
*日期：20161101
*/
function getSurveystatByItemId(data_url,callback){
	api.ajax({
		url :data_url,
		method : 'get',
		timeout : 30,
		dataType : 'json',
		headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' +$api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
	}
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
*作者:zhaoj
*功能:根据person_id和identity_id获取当前人的创建的调查问卷
*日期：20161101
*/
function getSurveyList(current_page,callback){
	api.ajax({
		url :BASE_URL_ACTION + '/space/survey/get_survey_list?random_num='+creatRandomNum()+'&status='+status+'&page_size='+BASE_PAGE_SIZE+'&page_num='+current_page+'&source=&person_id='+$api.getStorage("person_id")+'&identity_id='+$api.getStorage("identity"),
		method : 'get',
		timeout : 30,
		dataType : 'json',
		headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' +$api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
	}
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
		//通知顶部下拉刷新数据加载完毕，组件会恢复到默认状态
		commonControlRefresh();
	});
}
/*
*作者:zhaoj
*功能:根据person_id和identity_id获取邀请我的调查问卷
*日期：20161104
*/
function getPermission(current_page,callback){
	api.ajax({
		url :BASE_URL_ACTION + '/space/survey/get_permission?random_num='+creatRandomNum()+'&is_answer='+status+'&page_size='+BASE_PAGE_SIZE+'&page_num='+current_page+'&person_id='+$api.getStorage("person_id")+'&identity_id='+$api.getStorage("identity")+'&province_id='+$api.getStorage("province_id")+'&city_id='+$api.getStorage("city_id")+'&districts_id='+$api.getStorage("district_id")+'&school_id='+$api.getStorage("school_id"),
		method : 'get',
		timeout : 30,
		dataType : 'json',
		headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' +$api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
	}
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
		//通知顶部下拉刷新数据加载完毕，组件会恢复到默认状态
		commonControlRefresh();
	});
}
/*
*作者:zhaoj
*功能:获取问卷详情中回答该调查问卷的人员列表
*日期：20161104
*/
function getAnswerAurveyListById(current_page,callback){
	api.ajax({
		url :BASE_URL_ACTION + '/space/survey/get_answersurvey_list_byid?random_num='+creatRandomNum()+'&id='+id+'&page_size=20&page_num='+current_page,
		method : 'get',
		timeout : 30,
		dataType : 'json',
		headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' +$api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
	}
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
		//通知顶部下拉刷新数据加载完毕，组件会恢复到默认状态
		commonControlRefresh();
	});
}
/*
*作者:zhaoj
*功能:提交问卷
*日期：20161104
*/
function saveAnswerSurvey(){
	$api.css($api.byId('j_shadow'),'z-index:3;');
	showSelfProgress('提交中...');
	api.ajax({
		url :BASE_URL_ACTION + '/ypt/space/survey/save_answer_survey',
		method : 'post',
		timeout : 30,
		dataType : 'json',
		data : {
			values : {
				"random_num" : creatRandomNum(),
				"data" : JSON.stringify(answer_json),
				"province_id" : $api.getStorage("province_id"),
				"city_id":$api.getStorage("city_id"),
				"districts_id":$api.getStorage("district_id"),
				"school_id":$api.getStorage("school_id"),
				"identity_id":$api.getStorage("identity"),
				"person_id" : $api.getStorage("person_id"),
				"person_name":$api.getStorage("person_name"),
				"origin":1
			}
		},
		headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' +$api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
	}
	}, function(ret, err) {
		if (err) {
			api.hideProgress();
			$api.css($api.byId('j_shadow'),'z-index:-1;');
			popToast('网络繁忙，请稍候再试！');
		} else {
			if(ret.success){
				submitSuccess(remarks);
			}else{
				if(ret.info == "001"){
					submitSuccess('您已参与过该调查问卷！');
				}else if(ret.info == "002"){
					submitSuccess('问卷已到了截止时间，感谢您的参与！');
				}else if(ret.info == "003"){
					submitSuccess('无权限参与该调查问卷！');
				}else if(ret.info == "004"){
					submitSuccess('问卷已结束，感谢您的参与！');
				}else{
					api.hideProgress();
					$api.css($api.byId('j_shadow'),'z-index:-1;');
					popToast('提交失败，请稍候再试！');
				}
			}
		}
		//通知顶部下拉刷新数据加载完毕，组件会恢复到默认状态
		commonControlRefresh();
	});
}
/*
*作者:zhaoj
*功能:答题成功之后，调用的方法
*日期：20161107
*/
function submitSuccess(info){
	setTimeout(function(){
		api.hideProgress();
		$api.css($api.byId('j_shadow'),'z-index:-1;');
		var back_type;
		var btn_name;
		if(type){
			back_type = "index";
			btn_name ="返回";
			api.execScript({
				name : 'dcwj_answer_window',
				script : 'back();'
			});
		}else{
			back_type = "list";
			btn_name ="返回问卷列表";
		}
		api.execScript({
			name : 'dcwj_dtk_window',
			script : 'reBackType("'+back_type+'")'
		});
		
		$api.html($api.byId('j_body'),'<div class="finish-tip"><span>'+info+'</span></div><div class="footer-div"><div id="j_submit_btn_100" class="wid" onclick="back();">'+btn_name+'</div></div>');
	},3000)
}
/*
*作者:zhaoj
*功能:根据答案id获取当前人的答题情况
*日期：20161107
*/
function getSurveyUserInfoById(answer_id,callback){
	api.ajax({
		url :BASE_URL_ACTION + '/space/survey/get_surveyuserinfo_byid?random_num='+creatRandomNum()+'&id='+answer_id,
		method : 'get',
		timeout : 30,
		dataType : 'json',
		headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' +$api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
	}
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
*作者:zhaoj
*功能:检查权限 
*日期：20161107
*/
function checkPermission(wjdc_id,callback){
	api.ajax({
		url :BASE_URL_ACTION + '/space/survey/check_permission?random_num='+creatRandomNum()+'&id='+wjdc_id+'&person_id='+$api.getStorage("person_id")+'&identity_id='+$api.getStorage("identity")+'&province_id='+$api.getStorage("province_id")+'&city_id='+$api.getStorage("city_id")+'&districts_id='+$api.getStorage("district_id")+'&school_id='+$api.getStorage("school_id"),
		method : 'get',
		timeout : 30,
		dataType : 'json',
		headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' +$api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
	}
	}, function(ret, err) {
		if (err) {
			callback(false,'');
		} else {
			callback(true,ret);
		}
	});
}
/*
*作者:zhaoj
*功能:进入答题页面之前，进行校验，弹出相应的提示语
*日期：20161112
*/
function popCheckTip(tip_id){
	if(tip_id =='001'){
		popToast('您已参与过该调查问卷！');
	}else if(tip_id =='002'){
		popToast('问卷已到了截止时间，感谢您的参与！');
	}else if(tip_id =='003'){
		popToast('无权限参与该调查问卷！');
	}else if(tip_id =='004'){
		popToast('问卷已结束，感谢您的参与！');
	}else{
		popToast('无权限参与该调查问卷！');
	}
}
/*
*作者:zhaoj
*功能:设置发布
*日期：20161109
*/
function setPublicInfo(ret){
	if(isEmptyString(ret.release) && ret.status == 0){
		$api.text($api.byId('j_set_content'),'该问卷暂未发布');
		accordTypeDisplay(0);
	}else{
		ret.is_anonymous?$api.text($api.byId('j_anonymous'),'是'):$api.text($api.byId('j_anonymous'),'否');
		ret.is_query_res?$api.text($api.byId('j_query_res'),'是'):$api.text($api.byId('j_query_res'),'否');
		ret.end_num == null?$api.text($api.byId('j_end_num'),'--'):$api.text($api.byId('j_end_num'),ret.end_num);
		ret.end_time == null?$api.text($api.byId('j_end_time'),'--'):$api.text($api.byId('j_end_time'),ret.end_time);
		if(ret.is_pub == 1){
			$api.text($api.byId('j_object_content'),'问卷公开')
		}else{
			var role_array = ['','','','','','教师','学生','家长'];
			if(ret.source){
				//机构
				setOrg(ret,role_array);
			}else{
				if($api.getStorage("identity") == 5){
					//个人教师
					setClass(ret,'',role_array);//班级
					setRole(ret,role_array);//角色
					setGroup(ret);//群组
					publicObjectDisplay(3);//显示
				}else if($api.getStorage("identity") == 6){
					//个人学生
					setClass(ret,'所有学生',role_array);//班级
					setGroup(ret);//群组
					publicObjectDisplay(2);//显示
				}else{
					//个人家长
					setGroup(ret);//群组
					publicObjectDisplay(1);//显示
				}
			
			}
		}
		accordTypeDisplay(1);
	}
	
}
/*
*作者:zhaoj
*功能:设置群组
*日期：20161109
*/
function setOrg(ret,role_array){
	var role_num = ret.release[0].r_identity_id.split(',');
	var role_html = '<div>';
	    role_html = role_html + '<div class="object-left">选择的对象</div>';
	    role_html = role_html + '<div class="object-right">';
	    role_html = role_html + '<ul id="j_class">';
	for(var j = 0; j < ret.release.length; j++){
		for(var i = 0; i < role_num.length; i++){
			role_html = role_html + '<li class="active">'+ret.release[j].org_name+'所有'+role_array[role_num[i]]+'</li>';
		}
	}
	role_html = role_html + '</ul></div></div>';
	$api.html($api.byId('j_object_content'),role_html);
}
/*
*作者:zhaoj
*功能:设置群组
*日期：20161109
*/
function setClass(ret,info,role_array){
	var class_html='';
	for(var i = 0; i < ret.release.length; i++){
		if(ret.release[i].org_type==105){
			class_html = class_html+'<li class="active">'+ret.release[i].org_name+info+'</li>';
		}
	}
	if(class_html ==''){
		class_html = '<li style="padding:0 17px;">无</li>';
	}
	$api.html($api.byId('j_class'),class_html);
}
/*
*作者:zhaoj
*功能:设置群组
*日期：20161109
*/
function setRole(ret,role_array){
	var role_num=[];
	for(var i = 0; i < ret.release.length; i++){
		if(ret.release[i].org_type==105){
			role_num = ret.release[i].r_identity_id.split(',');
		}
	}
	var role_html='';
	for(var i = 0; i < role_num.length; i++){
		role_html = role_html+'<li class="active">'+role_array[role_num[i]]+'</li>';
	}
	if(role_html ==''){
		role_html = '<li style="padding:0 17px;">无</li>';
	}
	$api.html($api.byId('j_role'),role_html);
}
/*
*作者:zhaoj
*功能:设置群组
*日期：20161109
*/
function setGroup(ret){
	var group_html='';
	for(var i = 0; i < ret.release.length; i++){
		if(ret.release[i].org_type==106){
			group_html = group_html+'<li class="active">'+ret.release[i].org_name+'</li>';
		}
	}
	if(group_html ==''){
		group_html = '<li style="padding:0 17px;">无</li>';
	}
	$api.html($api.byId('j_group'),group_html);
}
/*
*作者:zhaoj
*功能:发布对象显示
*日期：20161109
*/
function publicObjectDisplay(type){
	
	$api.css($api.byId('j_group_display'),'display:block;');
	if(type == 2){
		$api.css($api.byId('j_class_display'),'display:block;');
	}
	if(type == 3){
		$api.css($api.byId('j_class_display'),'display:block;');
		$api.css($api.byId('j_role_display'),'display:block;');
	}
}
/*
*作者:zhaoj
*功能:根据type，还有是否发布，进行选择性显示
*日期：20161110
*/
function accordTypeDisplay(is_release){
	if(type == 1){
		$api.css($api.byId('j_set_title'),'display:block;');
		$api.css($api.byId('j_set_content'),'display:block;');
		if(is_release){
			//发布的情况
			$api.css($api.byId('j_object_title'),'display:block;');
			$api.css($api.byId('j_object_content'),'display:block;');
		}
	}
}
/*
*作者:zhaoj
*功能:判断本人是否为管理员
*日期：20161118
*/
function getRoleOrgsByRoleCode(orgidentity_id,org_id){
	var is_admin = 0;
	var iid;
	if(orgidentity_id == "100" || orgidentity_id == "101"|| orgidentity_id == "102"||orgidentity_id == "103"||orgidentity_id == "104"){
		api.ajax({
			url :BASE_URL_ACTION + '/space/survey/check_permission?random_num='+creatRandomNum()+'&person_id='+$api.getStorage("person_id")+'&identity_id='+$api.getStorage("identity")+'&identity_id='+$api.getStorage("identity")+'&role_code=PROVINCE_BUREAU_ADMIN,CITY_BUREAU_ADMIN,DISTRICT_BUREAU_ADMIN,SCHOOL_ADMIN',
			method : 'get',
			timeout : 30,
			dataType : 'json',
			headers : {
	'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' +$api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
		}, function(ret, err) {
			if (err) {
				showChartBtn(1);
			} else {
				if(ret.success){
					var orgs = ret.table_List;
                    for(var i=0;i<orgs.length;i++){
                        var iid = 0;
                        if(orgs[i].ORG_LEVEL == 1){
                            iid = "101";
                        }else if(orgs[i].ORG_LEVEL == 2){
                            iid = "102";
                        }else if(orgs[i].ORG_LEVEL == 3){
                            iid = "103";
                        }else if(orgs[i].ORG_LEVEL == 4){
                            iid = "104";
                        }else if(orgs[i].ORG_LEVEL == 6){
                            iid = "100";
                        }
                        if(org_id == orgs[i].ORG_ID && orgidentity_id == iid){
                            showChartBtn(0);
                            break;
                        }
                    }
				}else{
				 	showChartBtn(1);
				}
			}
		});
	}
	
	 //1.1.2是否班管(班主任)
    if(orgidentity_id == "105"){
    	api.ajax({
			url :BASE_URL_ACTION + '/space/personIsClassTeacher?random_num='+creatRandomNum()+'&person_id='+$api.getStorage("person_id"),
			method : 'get',
			timeout : 30,
			dataType : 'json',
			headers : {
	'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' +$api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
			}
		}, function(ret, err) {
			if (err) {
				showChartBtn(1);
			} else {
				if(ret.success){
                    if(ret.isClassTeacher){
                        for(var i = 0;i < ret.class_list.length;i++){
                            if(ret.class_list[i].class_id == org_id){
                                showChartBtn(0);
                                break;
                            }
                        }
                    }
				}else{
				 	showChartBtn(1);
				}
			}
		});
	}
	//是否班管理员(任课计划)
    if(is_admin == 0){
    	//只能判断是否校管理员
    	api.ajax({
			url :BASE_URL_ACTION + '/space/base/getClassInfoByTeacher?random_num='+creatRandomNum()+'&person_id='+$api.getStorage("person_id"),
			method : 'get',
			timeout : 30,
			dataType : 'json',
			headers : {
	'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' +$api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
			}
		}, function(ret, err) {
			if (err) {
				showChartBtn(1);
			} else {
				if(ret.success){
                    for (var i = 0; i < ret.classlist.length; i++) {
                        if (org_id == ret.classlist[i].id) {
                            showChartBtn(0);
                            break;
                        }
                    }
					
				}else{
				 	showChartBtn(1);
				}
			}
		});
    }
    if(orgidentity_id == 106 || orgidentity_id == 107){
   		api.ajax({
			url :BASE_URL_ACTION + '/group/queryGroupById?random_num='+creatRandomNum()+'&groupId='+org_id,
			method : 'get',
			timeout : 30,
			dataType : 'json',
			headers : {
	'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' +$api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
			}
		}, function(ret, err) {
			if (err) {
				showChartBtn(1);
			} else {
				 if(data.success == false){
				 	showChartBtn(1);
	              }else if(ret.CREATOR_ID == $api.getStorage("person_id") && ret.IDENTITY_ID == $api.getStorage("identity")) {
	                    showChartBtn(0);
	              }else{
                    for(var i = 0;i < ret.list_person.length;i++){
                        if($api.getStorage("person_id") && ret.list_person[i].person_id == $api.getStorage("person_id") && $api.getStorage("identity") && ret.list_person[i].identity_id == $api.getStorage("identity")) {
                            showChartBtn(0);
                        }
                    }
                }
			}
		});
    }

}


function returnOptionNoUrl(option) {
	var flagE = option.charAt(option.length - 1) == ")";
	var flagC = option.charAt(option.length - 1) == "）";
	var pECenter = option.lastIndexOf('](');
	var pCCenter = option.lastIndexOf('】（');
	var pELeft = option.lastIndexOf('[');
	var pCLeft = option.lastIndexOf('【');
	var description = '';
	var href = '';
	var title = '';
	if (flagE && pECenter >= 0 && pELeft >= 0) {
		description = option.substring(pELeft + 1, pECenter);
		href = option.substring(pECenter + 2, option.length - 1);
		title = option.substring(0, pELeft);
		return title + '[' + description + ']';
	} else if (flagC && pCCenter >= 0 && pCLeft >= 0) {
		description = option.substring(pCLeft + 1, pCCenter);
		href = option.substring(pCCenter + 2, option.length - 1);
		title = option.substring(0, pCLeft);
		return title + '【' + description + '】';
	} else {
		return option;
	}
}


/*
*作者:zhaoj
*功能:详情页面1只显示基本图表按钮,0显示两个按钮
*日期：20161118
*/
function showChartBtn(type){
	if(type){
		$api.css($api.byId('j_chart'),'display:block;');
	}else{
		
		$api.css($api.byId('j_left'),'display:block;');
		$api.css($api.byId('j_right'),'display:block;');
	}
	
}

function openHref(a_href){
			api.openWin({
				name : 'common_browser_window',
				url : '../../common/common_browser_window.html',
				pageParam : {
					header_h : header_h,
					title : '网页',
					http_url : a_href
				},
				bounces : false,
				opaque : false,
				showProgress : false,
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