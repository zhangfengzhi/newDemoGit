/*
*author:zhaoj
*function:获得这个学生能看见的科目
*date：20161224
*/
function getSubjectByStudentId(callback){
	api.ajax({
		url : BASE_URL_ACTION + '/base/crm/getCrmInfoByPerson',
		method : 'post',
		dataType : 'json',
		cache : false,
		timeout:30,
		data : {
			values : {
				"random_num" : creatRandomNum(),
				"person_id" : $api.getStorage("person_id"),
				"identity_id" : $api.getStorage("identity"),
				"user_type":2,
				"sys_type":11  //慧教学模块
			}
		}
	}, function(ret, err) {
		if(err){
			api.hideProgress();
			popToast("获取学科信息失败，请稍候重试");
		} else {
			if(ret.success) {
				var isHaveZt = 0;
				var product_list = ret.result_info.product_list;
				if(product_list.length>0){
					for(var i=0;i<product_list.length;i++){
						if(product_list[i].product_id=='hjx'){
							isHaveZt = 1;
							var data = {};
							data.ssvt_list = product_list[i].ssvt_list;
							callback(data);
							commonExecScript('zhuantiIpad_index_window','','isShowJMenu(1)',1);
						}
					}
					if(isHaveZt==0){
						api.hideProgress();
						popToast("获取学科信息失败，请稍候重试");
						commonExecScript('zhuantiIpad_index_window','','isShowJMenu(0)',0);
					}
				}		
			} else {
				api.hideProgress();
				popToast("获取学科信息失败，请稍候重试");
				commonExecScript('zhuantiIpad_index_window','','isShowJMenu(0)',0);
			}
		}
	});
}
/*
*author:zhaoj
*function:根据学科获得专题类型
*date：20161224
*/
function gametypelist(callback){
	api.ajax({
		url : BASE_URL_ACTION + '/yxx/topic/gettopictypebysubjectid',
		method : 'post',
		dataType : 'json',
		cache : false,
		timeout:30,
		data : {
			values : {
				"random_num" : creatRandomNum(),
				"subject_id" : subject_id
			}
		}
	}, function(ret, err) {
		if(err){
			api.hideProgress();
			popToast("获取专题类型失败，请稍候重试");
		} else {
			if(ret.success) {		
				callback(ret);
			} else {
				api.hideProgress();
				popToast("获取专题类型失败，请稍候重试");
			}
		}
	});
}
/*
*author:zhaoj
*function:关闭专题页面
*date：20161224
*/
function closeWindow(){
	api.closeWin({
		name : 'zhuanti_index_window'
    });
}
/*
*author:zhaoj
*function:获得游戏专题列表
*date：20161224
*/
function getGameOrTopicList(callback){
	api.ajax({
		url : BASE_URL_ACTION + '/yxx/gameOrTopic/resCtl/getGameOrTopicList?page_size='+BASE_PAGE_SIZE_IPAD+'&page_number='+currentPage+"&random_num="+creatRandomNum()+ "&gameOrTopic=2"+'&keyword='+keyword+'&type_id='+type_id+'&subject_id='+subject_id+'&order_type='+order_type,
		method : 'get',
		dataType : 'json',
		cache : false,
		timeout:30,
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		if(err){
			api.hideProgress();
			popToast("获取专题失败，请稍候重试");
		} else {
			if(ret.success) {		
				callback(ret);
			} else {
				api.hideProgress();
				popToast("获取专题失败，请稍候重试");
			}
		}
	});	
}
/*
*author:zhaoj
*function:最近访问的专题列表
*date：20161224
*/
function getGameTopicPreview(callback){
	api.ajax({
		url :BASE_URL_ACTION + '/yxx/gameOrTopic/resCtl/getGameTopicPreview?student_id='+$api.getStorage("person_id")+'&class_id='+$api.getStorage("class_id")+'&game_or_topic=2&random_num='+creatRandomNum(),
		method : 'get',
		dataType : 'json',
		cache : false,
		timeout:30,
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		if(err){
			api.hideProgress();
			popToast("获取专题失败，请稍候重试");
		} else {
			if(ret.success) {		
				callback(ret);
			} else {
				api.hideProgress();
				popToast("获取专题失败，请稍候重试");
			}
		}
	});	
}
/*
*author:zhaoj
*function:获得游戏或者专题的详细信息
*date：20161224
*/
function getGameOrTopicInfo(callback){
	api.ajax({
		url :BASE_URL_ACTION + '/yxx/gameOrTopic/resCtl/getGameOrTopicInfo?id='+api.pageParam.id+'&random_num='+creatRandomNum(),
		method : 'get',
		dataType : 'json',
		cache : false,
		timeout:30,
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		api.hideProgress();
		if(err){
			popToast("获取专题详情失败，请稍候重试");
		} else {
			if(ret.success) {		
				callback(ret);
			} else {
				popToast("获取专题详情失败，请稍候重试");
			}
		}
	});	
}
/*
*author:zhaoj
*function:打开游戏专题的时候需要记录最近浏览
*date：20161224
*/
function saveGameTopicPreview(callback){
	api.ajax({
		url :BASE_URL_ACTION + '/yxx/gameOrTopic/resCtl/saveGameTopicPreview?class_id='+$api.getStorage("class_id")+'&game_topic_id='+api.pageParam.id+'&res_id='+api.pageParam.res_id+'&student_id='+$api.getStorage("person_id")+'&game_or_topic=2&random_num='+creatRandomNum(),
		method : 'get',
		dataType : 'json',
		cache : false,
		timeout:30,
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		if(err){
			callback(false);
		} else {
			if(ret.success) {		
				callback(true);
			} else {
				callback(false);
			}
		}
	});	
}
/*
*author:zhaoj
*function:设置播放次数
*date：20161224
*/
function setPlayCountByResId(callback){
//	api.ajax({
//		url :BASE_URL_ACTION + '/yxx/gameOrTopic/resCtl/setPlayCountByResId?res_id='+api.pageParam.res_id+'&random_num='+creatRandomNum(),
//		method : 'get',
//		dataType : 'json',
//		cache : false,
//		headers : {
//			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
//		}
//	}, function(ret, err) {
//		if(err){
//			callback(false);
//		} else {
//			if(ret.success) {		
//				callback(true);
//			} else {
//				callback(false);
//			}
//		}
//	});	
	callback(true);
}
/*
*author:zhaoj
*function:获得游戏专题动态
*date：20161224
*/
function getStudentResultRecord(callback){
		api.ajax({
		url :BASE_URL_ACTION + '/yxx/gameOrTopic/resCtl/getStudentResultRecord?school_id='+$api.getStorage("school_id")+'&id='+api.pageParam.id+'&class_id=-1&random_num='+creatRandomNum(),
		method : 'get',
		dataType : 'json',
		cache : false,
		timeout:30,
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		if(err){
			api.hideProgress();
			popToast("获取动态失败，请稍候重试");
		} else {
			if(ret.success) {
				for(var i = 0; i < ret.list.length; i++){
					var img_url;
					if(BASE_APP_TYPE == 1){
						img_url = BASE_IMAGE_PRE + url_path_suffix+ ret.list[i].avatar_url.substring(0, 2) + "/" + ret.list[i].avatar_url + commonReturnPhotoCutSize(0);
					}else{
						img_url = BASE_URL_ACTION + BASE_IMAGE_BEGIN + ret.list[i].avatar_url.substring(0, 2) + "/" + ret.list[i].avatar_url + commonReturnPhotoCutSize(0);
					}
					ret.list[i].avatar_url=img_url;
				}		
				callback(ret);
			} else {
				api.hideProgress();
				popToast("获取动态失败，请稍候重试");
			}
		}
	});	
}
/*
*author:zhaoj
*function:记录学习了专题动态
*date：20161224
*/
function saveResultRecord(){
	api.ajax({
		url :BASE_URL_ACTION + '/yxx/gameOrTopic/resCtl/saveResultRecord',
		method : 'post',
		dataType : 'json',
		timeout:30,
		cache : false,
		data : {
			values : {
				"class_id" : $api.getStorage("class_id"),
				"content_json" : -1,
				"id" : api.pageParam.id,
				"last_game_result" : -1,
				"student_id" :$api.getStorage("person_id"),
				"random_num":creatRandomNum()
			}
		},
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
	});	
}