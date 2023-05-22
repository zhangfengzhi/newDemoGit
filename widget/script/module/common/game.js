/*
*author:zhaoj
*function:获得这个学生能看见的科目
*date：20161224
*/
function getSubjectByStudentId(callback){
	commonGetStudentInfoByParentId(total_param.person_id, total_param.identity, function(is_true, stu_info_json){
		if(is_true) {
			if(BASE_CRM_TYPE){
				api.ajax({
				   url:BASE_URL_ACTION + '/yxx/gameOrTopic/resCtl/getstussinfo?type='+1+'&random_num=' + creatRandomNum() +　'&person_id='+stu_info_json.student_id+'&identity_id=6',
				    method : 'get',
				    dataType : 'json', 
					cache: false,
					timeout : 30,
					headers : {
						'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
					}
			    },function(ret,err){
			    	if(err){
			    		api.hideProgress();
			    		popToast("获取学科失败，请稍候重试");
			    	}else{
			    		if(ret.success){
			    			callback(ret);
			    		}else{
			    			api.hideProgress();
			    			api.alert({
								msg : ret.info
							}, function(ret, err) {
								api.closeWin();
							});
			    		}
			    	}
			    });
			}else{
				api.ajax({
				   url:BASE_URL_ACTION + '/base/getSubjectByStudentId?random_num=' + creatRandomNum() +　'&student_id='+stu_info_json.student_id,
				    method : 'get',
				    dataType : 'json', 
					cache: false,
					timeout : 30,
					headers : {
						'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
					}
			    },function(ret,err){
			    	if(err){
			    		api.hideProgress();
			    		popToast("获取学科失败，请稍候重试");
			    	}else{
			    		if(ret.success){
			    			getmoudelsubject(stu_info_json.student_id,function(mode_ret){
			    				var data = {"ssvt_list":[]};
				    			for(var i = 0; i < ret.list.length; i++){
				    				for(var j = 0; j < mode_ret.yx_subject_ids.length; j++){
				    					if(mode_ret.yx_subject_ids[j].game_subject == ret.list[i].subject_id){
						    				var oparam = new Object();
						    				oparam.xk_id=ret.list[i].subject_id;
						    				oparam.xk_name=ret.list[i].subject_name;
						    				oparam.xd_id='';
						    				oparam.xd_name='';
						    				data.ssvt_list.push(oparam);
						    			}
					    			}
				    			}
				    			callback(data);
			    			});
			    		}else{
			    			api.hideProgress();
			    			api.alert({
								msg : ret.info
							}, function(ret, err) {
								api.closeWin();
							});
			    		}
			    	}
			    });
			}
		} else {
			popToast(stu_info_json);
		}	
	});
}
/*
*author:zhaoj
*function:匹配学科
*date：20161224
*/
function getmoudelsubject(student_id,callback){
	api.ajax({
	   url:BASE_URL_ACTION + '/yxx/main/getmoudelsubject?random_num=' + creatRandomNum()+　'&student_id='+student_id,
	    method : 'get',
	    dataType : 'json', 
		cache: false,
		timeout : 30,
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
    },function(ret,err){
    	if(err){
    		api.hideProgress();
    		popToast("获取学科失败，请稍候重试");
    	}else{
    		if(ret){
    			callback(ret);
    		}else{
    			api.hideProgress();
    			api.alert({
					msg : ret.info
				}, function(ret, err) {
					api.closeWin();
				});
    		}
    	}
    });
}
/*
*author:zhaoj
*function:根据学科获得游戏类型
*date：20161224
*/
function gametypelist(callback){
	api.ajax({
		url : BASE_URL_ACTION + '/yxx/game/gametypelist',
		method : 'post',
		dataType : 'json',
		cache : false,
		timeout : 30,
		data : {
			values : {
				"random_num" : creatRandomNum(),
				"subject_id" : subject_id
			}
		}
	}, function(ret, err) {
		if(err){
			api.hideProgress();
			popToast("获取游戏类型失败，请稍候重试");
		} else {
			if(ret.success) {		
				callback(ret);
			} else {
				api.hideProgress();
				popToast("获取游戏类型失败，请稍候重试");
			}
		}
	});
}
/*
*author:zhaoj
*function:关闭游戏页面
*date：20161224
*/
function closeWindow(){
	api.closeWin({
		name : 'game_index_window'
    });
}
/*
*author:zhaoj
*function:关闭游戏页面
*date：20161224
*/
function closeIpadWindow(){
	api.closeWin({
		name : 'gameIpad_index_window'
    });
}
/*
*author:zhaoj
*function:获得游戏游戏列表
*date：20161224
*/
function getGameOrTopicList(callback){
	var page_size=0;
	if(api.winName == "yunke_list_window"){
		page_size = BASE_PAGE_SIZE;
	}
	api.ajax({
		url : BASE_URL_ACTION + '/yxx/gameOrTopic/resCtl/getGameOrTopicList?page_size='+page_size+'&page_number='+currentPage+"&random_num="+creatRandomNum()+ "&gameOrTopic=1"+'&keyword='+keyword+'&type_id='+type_id+'&subject_id='+subject_id+'&order_type='+order_type,
		method : 'get',
		dataType : 'json',
		timeout : 30,
		cache : false,
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		if(err){
			api.hideProgress();
			popToast("获取游戏失败，请稍候重试");
		} else {
			if(ret.success) {		
				callback(ret);
			} else {
				api.hideProgress();
				popToast("获取游戏失败，请稍候重试");
			}
		}
	});	
}
/*
*author:zhaoj
*function:最近访问的游戏列表
*date：20161224
*/
function getGameTopicPreview(callback){
	commonGetStudentInfoByParentId(total_param.person_id, total_param.identity, function(is_true, stu_info_json){
		if(is_true) {
			api.ajax({
				url :BASE_URL_ACTION + '/yxx/gameOrTopic/resCtl/getGameTopicPreview?student_id='+stu_info_json.student_id+'&class_id='+$api.getStorage("class_id")+'&game_or_topic=1&random_num='+creatRandomNum(),
				method : 'get',
				dataType : 'json',
				timeout : 30,
				cache : false,
				headers : {
					'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
				}
			}, function(ret, err) {
				if(err){
					api.hideProgress();
					popToast("获取游戏失败，请稍候重试");
				} else {
					if(ret.success) {		
						callback(ret);
					} else {
						api.hideProgress();
						popToast("获取游戏失败，请稍候重试");
					}
				}
			});	
		} else {
			popToast(stu_info_json);
		}	
	});
}
/*
*author:zhaoj
*function:获得游戏或者游戏的详细
*date：20161224
*/
function getGameOrTopicInfo(callback){
	api.ajax({
		url :BASE_URL_ACTION + '/yxx/gameOrTopic/resCtl/getGameOrTopicInfo?id='+api.pageParam.id+'&random_num='+creatRandomNum(),
		method : 'get',
		dataType : 'json',
		timeout : 30,
		cache : false,
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		api.hideProgress();
		if(err){
			popToast("获取游戏详情失败，请稍候重试");
		} else {
			if(ret.success) {		
				callback(ret);
			} else {
				popToast("获取游戏详情失败，请稍候重试");
			}
		}
	});	
}
/*
*author:zhaoj
*function:打开游戏游戏的时候需要记录最近浏览
*date：20161224
*/
function saveGameTopicPreview(callback){
	api.ajax({
		url :BASE_URL_ACTION + '/yxx/gameOrTopic/resCtl/saveGameTopicPreview?class_id='+$api.getStorage("class_id")+'&game_topic_id='+api.pageParam.id+'&res_id='+api.pageParam.res_id+'&student_id='+$api.getStorage("person_id")+'&game_or_topic=1&random_num='+creatRandomNum(),
		method : 'get',
		dataType : 'json',
		timeout : 30,
		cache : false,
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
	api.ajax({
		url :BASE_URL_ACTION + '/yxx/gameOrTopic/resCtl/setPlayCountByResId?res_id='+api.pageParam.res_id+'&random_num='+creatRandomNum(),
		method : 'get',
		dataType : 'json',
		timeout : 30,
		cache : false,
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
*function:获得游戏游戏动态
*date：20161224
*/
function getStudentResultRecord(callback){
		api.ajax({
		url :BASE_URL_ACTION + '/yxx/gameOrTopic/resCtl/getStudentResultRecord?school_id='+$api.getStorage("school_id")+'&id='+api.pageParam.id+'&class_id='+$api.getStorage("class_id")+'&random_num='+creatRandomNum(),
		method : 'get',
		dataType : 'json',
		timeout : 30,
		cache : false,
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