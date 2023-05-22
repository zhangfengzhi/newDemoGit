/*
*author:zhaoj
*function:弹出Toast提示框
*date：20160314
*/
function popToast(message){
	api.toast({
		msg : message,
		location : 'middle'
	});
}

/*
*author:zhaoj
*function:弹出Alert提示框
*date：20160314
*/
function popAlert(message){
	api.alert({
		msg : message
	}, function(ret, err) {
	});
}

/*
*author:zhaoj
*function:获取班级
*param:query_type 0：班主任， 1：任课计划，2：全部
*date：20160720
*/
function getClassByPersonIDIdentityID(callback){
	api.ajax({
		url : $api.getStorage('BASE_URL_ACTION') + '/class/getClassByPersonIDIdentityID',
		method : 'get',
		dataType : 'json',
		data : {
			values : {
				"person_id" : $api.getStorage('person_id'),
				"identity_id" : $api.getStorage('identity'),
				"query_type" : 2
			}
		}
	}, function(ret, err) {
		if(err) {
			popToast('获取班级列表失败');
			callback(false,'');
		} else {
			if(ret.success){
				callback(true,ret)
			} else {
				popToast('获取班级列表失败');
				callback(false,'');
			}
		}
	});
}

/*
*author:zhaoj
*function:渲染html
*date：20160602
*/
function addTemplateHtml(div_id, script_id, data) {
	var html_type = template.render(script_id, data);
	document.getElementById(div_id).innerHTML = html_type;
}
/*
 *author:zhaoj
 *function:渲染html
 *date：20160627
 */
function addTemplateHtmlForIndex(div_id, script_id, data){
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
*date：20160627
*/
function showSelfProgress(msg){
	api.showProgress({
		title : msg,
		text : '请稍候...',
		modal : false
	});
}

/*
* 获得时间差,时间格式为 年-月-日 小时:分钟:秒 或者 年/月/日 小时：分钟：秒
* 其中，年月日为全格式，例如 ： 2010-10-12 01:00:00
* 返回精度为：秒，分，小时，天
*/
function GetDateDiff(endTime) {
	var date2=new Date(endTime.replace(/\-/g, "/"));//new Date();    //结束时间
	var date3=new Date().getTime()-date2.getTime();  //时间差的毫秒数

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
		time = days+'天前';
	}else if(days == 0 && hours > 0){
		time = hours+'小时前';
	}else{
		if(minutes>=0){
			time = minutes+'分钟前';
		}else{
			time = '1分钟前';
		}
	}
	return time;
}

/*
*author:zhaoj
*function:获取图片
*date：20160721
*/
function gerPictureById(callback){
	showSelfProgress('加载中...');
	api.ajax({
		url : $api.getStorage('BASE_URL_ACTION') + '/space/gallery/get_picturebyid',
		method : 'get',
		dataType : 'json',
		data : {
			values : {
				"random_num" : creatRandomNum(),
				"relation_id" : api.pageParam.relation_id,
				"business_type" :business_type
			}
		}
	}, function(ret, err) {
		api.hideProgress();
		if(err) {
			popToast('获取图片失败');
			callback(false,'');
		} else {
			if(ret.success){
				callback(true,ret)
			} else {
				popToast('获取图片失败');
				callback(false,'');
			}
		}
	});
}

//替换所有的回车换行
function transferBrStr(content) {
	var string = content;
	try {
		string = string.replace(/\r\n/g, "<br />")
	string = string.replace(/\n/g, "<br />");
	} catch(e) {
		popAlert(e.message);
	}
	return string;
}

/*
*author:zhaoj
*function:获取图片
*date：20160721
*/
function addPictureBrowseNum(){
	api.ajax({
		url : $api.getStorage('BASE_URL_ACTION') + '/space/gallery/add_picture_browse_num',
		method : 'post',
		dataType : 'json',
		data : {
			values : {
				"random_num" : creatRandomNum(),
				"business_type" : business_type	,
				"identity_id" :$api.getStorage("identity"),
				"person_id" :$api.getStorage("person_id"),
				"picture_id" :id,
			}
		},
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + ';identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
				}
	}, function(ret, err) {
	});
}

/*
*author:zhaoj
*function:获取图片下载数量
*date：20160721
*/
function addPictureDownloadNum(){
	api.ajax({
		url : $api.getStorage('BASE_URL_ACTION') + '/space/gallery/add_picture_download_num',
		method : 'post',
		dataType : 'json',
		data : {
			values : {
				"random_num" : creatRandomNum(),
				"business_type" : business_type	,
				"identity_id" :$api.getStorage("identity"),
				"person_id" :$api.getStorage("person_id"),
				"picture_id" :id,
			}
		},
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + ';identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
				}
	}, function(ret, err) {
	});
}
	
	
	