/*
*author:zhaoj
*function:获取考试列表数据
*date：20170316
*/
function getTestInfoByStudentId(){
	showSelfProgress('加载中...');
	api.ajax({
		url :'http://60.18.161.156:8080/BDA/scoreEtl/getTestInfoByStudentId.jhtml?loginType=1&studentId='+$api.getStorage("person_id")+'&jsoncallback=?',
		method : 'get',
		timeout : 30,
		dataType : 'json',
		returnAll : false,
		}, function(ret,err) {
			api.hideProgress();
			var data = getJsonData(err);
			if (data.rencode == 0) {
				commonAddOnceHtml('score_body','score_script',data);
			}else{
				popToast('获取考试失败，请稍候重试');
			}
		});
}
/*
*author:zhaoj
*function:获取认领考试列表数据
*date：20170316
*/
function getClaimTestInfoByStudentId(callback){
	showSelfProgress('加载中...');
	api.ajax({
		url :'http://60.18.161.156:8080/BDA/scoreEtl/getClaimTestInfoByStudentId.jhtml?loginType=1&studentId='+$api.getStorage("person_id")+'&jsoncallback=?',
		method : 'get',
		timeout : 30,
		dataType : 'json',
		returnAll : false,
		}, function(ret,err) {
			api.hideProgress();
			var data = getJsonData(err);
			if (data.rencode == 0) {
				callback(data);
			}else{
				popToast('获取考试失败，请稍候重试');
			}
		});
}
/*
*author:zhaoj
*function:获取考试列表数据
*date：20170316
*/
function getScoreByStudentId(callback){
	showSelfProgress('加载中...');
	api.ajax({
		url :'http://60.18.161.156:8080/BDA/scoreEtl/getScoreByStudentId.jhtml?jsoncallback=?&loginType=1&testId='+api.pageParam.testId+'&studentId='+$api.getStorage("person_id"),
		method : 'get',
		timeout : 30,
		dataType : 'json',
		returnAll : false,
		}, function(ret,err) {
			api.hideProgress();
			var data = getJsonData(err);
			if (data.rencode == 0) {
				callback(data);
			}else{
				popToast('获取考试失败，请稍候重试');
			}
		});
}
/*
*author:zhaoj
*function:根据学号查询成绩
*date：20170316
*/
function getScoreByStudentNum(type,testNum,studentName,callback){
	if(type == 0){
		showSelfProgress('查询中...');
	}else if(type == 1){
		showSelfProgress('加载中...');
	}
	api.ajax({
		url :'http://60.18.161.156:8080/BDA//scoreEtl/getScoreByStudentNum.jhtml?loginType=1&testId='+api.pageParam.testId+'&testNum='+testNum+'&studentName='+studentName+'&jsoncallback=?',
		method : 'get',
		timeout : 30,
		dataType : 'json',
		returnAll : false,
		}, function(ret,err) {
			api.hideProgress();
			var data = getJsonData(err);
			if (data.rencode == 0) {
				callback(data);
			}else{
				popToast('获取成绩失败，请稍候重试');
			}
		});
}
/*
*author:zhaoj
*function:由于跨域的问题，从err中获取json数据
*date：20170316
*/
function getJsonData(err){
	var index = err.body.indexOf("(");
	var data_str = err.body.substring(index+1,err.body.length-1);
	var data = JSON.parse(data_str);
	return data;
}