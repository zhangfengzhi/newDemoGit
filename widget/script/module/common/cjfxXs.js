var ip_url='http://www.edusoa.com/BDAS_CLOUD/';
//var BASE_URL_ACTION = $api.getStorage('BASE_URL_ACTION');
//var ip_url=BASE_URL_ACTION.replace('dsideal_yy','BDAS/');
var student_id_mr= $api.getStorage("person_id");
var identity_mr = $api.getStorage("identity");
var token = $api.getStorage('token_ypt');
var ip_url_data = $api.getStorage('BASE_URL_ACTION');
var dataSource = 200051;
//演示账号地址
var ip_url_ys = 'http://www.edusoa.com/dsideal_yy';
//演示账号人员id
var student_id_ys= 86211143;
//演示账号人员身份
var identity_ys = 6;
//演示账号人员token
var token_ys = 'a254083abad67844313f41c4f0256f6d';
//真实账号地址
var ip_url_true = $api.getStorage('BASE_URL_ACTION');
//真实账号人员id
var student_id_true= $api.getStorage('person_id');
//真实账号人员身份
var identity_true = $api.getStorage('identity');
//真实账号人员token
var token_true = $api.getStorage('token_ypt'); 

/**
 * 展示功能演示
 * 周枫
 * 2017.09.21 
 */
function showCjfx() {
	//替换演示人员缓存
	var flag = $api.getStorage('cjfx_ys')*1;
    if(flag&& (list_data.data.data.length == 0)){
        popToast('该筛选条件下暂无演示考试');
        return;
    }else{
    	$api.setStorage('cjfx_ys',1);
    	changePersonInfo();
    	initData(1);
    }
}

/**
 * 功能演示时切换个人身份
 * 周枫
 * 2017.09.21 
 */
function changePersonInfo(){
	if(!$api.getStorage('cjfx_ys')) {
		//真实人员
		ip_url_data = ip_url_true;
		student_id = student_id_true;
		student_id_mr = student_id_true;
		identity_mr = identity_true;
		token = token_true;
	} else {
		//演示人员
		ip_url_data = ip_url_ys;
		student_id = student_id_ys;
		student_id_mr = student_id_ys;
		identity_mr = identity_ys;
		token = token_ys;
	}
	
}

/*
*author:zhaoj
*function:获取考试列表数据
*叶向东
*date：20170316
*/
function getTestInfoByStudentId(){
	showSelfProgress('加载中...');
	api.ajax({
		url :'http://60.18.161.156:8080/BDA//scoreEtl/getTestInfoByStudentId.jhtml?loginType=1&studentId='+$api.getStorage("person_id")+'&jsoncallback=?',
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
				api.hideProgress();
				popToast('获取考试信息失败，请稍候重试');
			}
		});
}
/*
*author:zhaoj
*function:获取考试列表数据
* 叶向东
*date：20170316
*/
function getScoreByStudentId(callback){
	showSelfProgress('加载中...');
	api.ajax({
		url :ip_url+'/scoreEtl/getScoreByStudentId.jhtml?jsoncallback=?&loginType=1&testId='+testId+'&studentId='+student_id+'&dataSource='+dataSource,
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
				api.hideProgress();
				popToast('获取考试信息失败，请稍候重试');
			}
		});
}
/*
*author:zhaoj
*function:根据学号查询成绩
* 叶向东
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
				api.hideProgress();
				popToast('获取成绩信息失败，请稍候重试');
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
/*
*author:zhaoj
*function:获取考试列表
* 叶向东
*date：20170320
*/
function getChoiceExam(callback){
	var ip = "";
	if(select_list_data.queryDate == "CUSTOM"){
		ip = ip_url+'/cloudScore/studentExam/getChoiceExam.jhtml?loginType=1&studentId='+student_id+'&currentPage='+currentPage+'&pageSize='+BASE_PAGE_SIZE+'&queryDate=custom&startDate='+select_list_data.startDate+'&dataSource='+dataSource+'&endDate='+select_list_data.endDate+'&testType='+select_list_data.testType+'&testName='+testName+'&jsoncallback=?'
	}else{
		ip = ip_url+'/cloudScore/studentExam/getChoiceExam.jhtml?loginType=1&studentId='+student_id+'&currentPage='+currentPage+'&pageSize='+BASE_PAGE_SIZE+'&queryDate='+select_list_data.queryDate+'&testName='+testName+'&testType='+select_list_data.testType+'&dataSource='+dataSource+'&jsoncallback=?'
	} 
	api.ajax({
		url :ip,
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
				api.hideProgress();
				popToast('获取考试信息失败，请稍候重试');
			}
		});
}
/*
*author:zhaoj
*function:根据考试ID 查询 本次考试考了哪些科目
* 叶向东
*date：20170320
*/
function getExamSubject(callback){
	api.ajax({
		url :ip_url+'/cloudScore/studentExam/getExamSubject.jhtml?loginType=1&testId='+testId+'&dataSource='+dataSource+'&jsoncallback=?',
		method : 'get',
		timeout : 30,
		dataType : 'json',
		returnAll : false,
		}, function(ret,err) {
			api.hideProgress();
			if(ret){
			    callback(ret);
			}else{
			    var data = getJsonData(err);
                if (data.rencode == 0) {
                    callback(data);
                }else{
                    api.hideProgress();
                    popToast('获取成绩信息失败，请稍候重试');
                }
			}
		});
}
/*
*author:zhaoj
*function:根据考试ID 及学生ID ，学科ID 查询 考试详细信息
* 叶向东
*date：20170320
*/
function getScoreInfo(callback){
	api.ajax({
		url :ip_url+'/cloudScore/studentExam/getScoreInfo.jhtml?loginType=1&testId='+testId+'&studentId='+student_id+'&subjectId='+subjectId+'&dataSource='+dataSource+'&jsoncallback=?',
		method : 'get',
		timeout : 30,
		dataType : 'json',
		returnAll : false,
		}, function(ret,err) {
			var data = getJsonData(err);
			if (data.rencode == 0) {
				callback(data);
			}else{
				api.hideProgress();
				popToast('获取成绩信息失败，请稍候重试');
			}
		});
}
/*
*author:zhaoj
*function:根据学生ID 和 考试ID 获取学科标准分
* 叶向东
*date：20170321
*/
function getSubjectCompareInfo(type,callback){
	var field='';
	if(type == 0){
		field = "class";
	}else if(type == 1){
		field = "school";
	}else if(type == 2){
		field = "district";
	}else{
		field = "city";
	}
	api.ajax({
		url :ip_url+'cloudScore/studentExam/getSubjectCompareInfo.jhtml?loginType=1&testId='+testId+'&field='+field+'&studentId='+student_id+'&subjectId='+subjectId+'&dataSource='+dataSource+'&jsoncallback=?',
		method : 'get',
		timeout : 30,
		dataType : 'json',
		returnAll : false,
		}, function(ret,err) {
			var data = getJsonData(err);
			if (data.rencode == 0) {
				callback(data);
			}else{
				api.hideProgress();
				popToast('获取成绩信息失败，请稍候重试');
			}
		});
}
/*
*author:zhaoj
*function:根据学生ID 与 学科 ID 及班校区， 查询 进步情况
* 叶向东
*date：20170322
*/
function getProgressCircumstance(type,callback){
	api.ajax({
		url :ip_url+'/cloudScore/studentExam/getProgressCircumstance.jhtml?loginType=1&studentId='+student_id+'&subjectId='+subjectId+'&dataSource='+dataSource+'&testId='+testId+'&jsoncallback=?',
		method : 'get',
		timeout : 30,
		dataType : 'json',
		returnAll : false,
		}, function(ret,err) {
			var data = getJsonData(err);
			if (data.rencode == 0) {
				callback(data);
			}else{
				api.hideProgress();
				popToast('获取成绩信息失败，请稍候重试');
			}
		});
}
/*
*author:zhaoj
*function:根据学生ID 和考试ID 获取班级所有人成绩列表
* 叶向东
*date：20170322
*/
function getScoreList(callback){
	api.ajax({
		url :ip_url+'/cloudScore/studentExam/getScoreList.jhtml?loginType=1&studentId='+student_id+'&subjectId=-1&sort=2&testId='+testId+'&dataSource='+dataSource+'&jsoncallback=?',
		method : 'get',
		timeout : 30,
		dataType : 'json',
		returnAll : false,
		}, function(ret,err) {
			var data = getJsonData(err);
			if (data.rencode == 0) {
				callback(data);
			}else{
				api.hideProgress();
				popToast('获取成绩信息失败，请稍候重试');
			}
		});
}
/*
*author:zhaoj
*function:传入两个学生ID 进行对比，自己 放在前面
* 叶向东
*date：20170322
*/
function getExamCompare(other_stu_id,testCn,callback){
	api.ajax({
		url :ip_url+'/cloudScore/studentExam/getExamCompare.jhtml?loginType=1&studentId='+student_id+'&testCn='+testCn+'&testId='+testId+'&dataSource='+dataSource+'&jsoncallback=?',
		method : 'get',
		timeout : 30,
		dataType : 'json',
		returnAll : false,
		}, function(ret,err) {
			var data = getJsonData(err);
			if (data.rencode == 0) {
				callback(data);
			}else{
				api.hideProgress();
				popToast('获取各科信息失败，请稍候重试');
			}
		});
}
/*
*author:zhaoj
*function:获取认领考试列表数据
* 叶向东
*date：20170316
*/
function getClaimTestInfoByStudentId(callback){
	showSelfProgress('加载中...');
	api.ajax({
		url :ip_url+'/cloudScore/studentExam/getClaimTestInfoByStudentId.jhtml?loginType=1&studentId='+student_id+'&dataSource='+dataSource+'&jsoncallback=?',
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
				popToast('获取考试信息失败，请稍候重试');
			}
		});
}
/*
*author:zhaoj
*function:理想成绩查看排名变化情况
* 叶向东
*date：20170421
*/
function getIdealPm(){
	var subjectId = $api.attr($api.byId('j_lxcj_subject_name'),'subjectId');
	var changeScore = $api.val($api.byId('j_lxcj_input'));
	if(isNaN(changeScore) || isEmptyString(changeScore)){
		$api.val($api.byId('j_lxcj_input'),'');
   		popToast('请输入数字');
   		return;
	}
	showSelfProgress('加载中...');
	api.ajax({
		url :ip_url+'/cloudScore/studentExam/getIdealPm.jhtml?loginType=1&studentId='+student_id+'&testId='+testId+'&subjectMap['+subjectId+']='+changeScore+'&subjectId='+subjectId+'&dataSource='+dataSource+'&beatRate=0&jsoncallback?',
		method : 'get',
		timeout : 30,
		dataType : 'json',
		returnAll : false,
		}, function(ret,err) {
			api.hideProgress();
			var data = getJsonData(err);
			if (data.rencode == 0) {
				var ori_scores = $api.attr($api.byId('j_lxcj_subject_name'),'score');
				var ori_classPm = $api.attr($api.byId('j_lxcj_subject_name'),'classPm');
				var ori_schoolPm = $api.attr($api.byId('j_lxcj_subject_name'),'schoolPm');
				var ori_cityPm = $api.attr($api.byId('j_lxcj_subject_name'),'cityPm');
				setLxcjValue('j_lxcj_subject_scores',ori_scores,data.idealData[0].score*1,0);
                setLxcjValue('j_lxcj_class_pm',ori_classPm,data.idealData[0].classPm,1);
                setLxcjValue('j_lxcj_school_pm',ori_schoolPm,data.idealData[0].schoolPm,1);
//              if(testType == '市考'||testType == '区县考'){ 
//		           	setLxcjValue('j_lxcj_city_pm',ori_cityPm,data.idealData[0].totalPm,1);
//		        }
		    	api.hideProgress();
			}else{
				api.hideProgress();
				popToast('获取成绩信息失败，请稍候重试');
			}
		});
}
/*
*author:zhaoj
*function:理想成绩查看排名变化情况
* 叶向东
*date：20170421
*/
function setLxcjValue(id,value,new_value,type){
	var judge='';
	if(type){
		judge = value - new_value;
	}else{
		judge = new_value - value;
	}
    if(judge>0){
        $api.html($api.byId(id), value+'<font class="tip"> → </font><font class="dyl">'+new_value+'</font?');
    }else if(judge<0){
        $api.html($api.byId(id), value+'<font class="tip"> → </font><font class="xyl">'+new_value+'</font?');
    }else{
        $api.html($api.byId(id), value+'<font class="tip"> → </font><font>'+new_value+'</font?');
    }
}
/*
*author:zhaoj
*function:获取难易题得分率
* 叶向东
*date：20170422
*/
function getDificultyScoreRate(questionType,callback){
	api.ajax({
		url :ip_url+'/cloudScore/question/getDificultyScoreRate.jhtml?loginType=1&studentId='+student_id+'&testId='+testId+'&subjectId='+subjectId+'&questionType='+questionType+'&dataSource='+dataSource+'&jsoncallback?',
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
				api.hideProgress();
				popToast('获取成绩信息失败，请稍候重试');
			}
		});
}
/*
*author:zhaoj
*function:获取试卷分析数据
* 叶向东
*date：20170422
*/
function getPaperAnalysisInfo(callback){
	api.ajax({
		url :ip_url+'/cloudScore/question/getPaperAnalysisInfo.jhtml?loginType=1&studentId='+student_id+'&testId='+testId+'&subjectId='+subjectId+'&dataSource='+dataSource+'&jsoncallback?',
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
				api.hideProgress();
				popToast('获取成绩信息失败，请稍候重试');
			}
		});
}
/*
*author:zhaoj
*function:频数分布直方图
* 叶向东
*date：20170424
*/
function getStageCountByStep(callback){
	var step=0;
	if(subjectId < 0){
		step = 50;
	}else{
		step = 10;
	}
	api.ajax({
		url :ip_url+'/cloudScore/studentExam/getStageCountByStep.jhtml?loginType=1&studentId='+student_id+'&testId='+testId+'&questionNumber=&subjectId='+subjectId+'&step='+step+'&dataSource='+dataSource+'&jsoncallback?',
		method : 'get',
		timeout : 30,
		dataType : 'json',
		returnAll : false,
		}, function(ret,err) {
			var data = getJsonData(err);
			if (data.rencode == 0) {
				callback(data);
			}else{
				api.hideProgress();
				popToast('获取试题信息失败，请稍候重试');
			}
		});
}
/*
*author:zhaoj
*function:频数分布直方图
* 叶向东
*date：20170424
*/
function getStudentScoreAnalysis(callback){
	api.ajax({
		url :ip_url+'/cloudScore/studentExam/getStudentScoreAnalysis.jhtml?loginType=1&studentId='+student_id+'&testId='+testId+'&dataSource='+dataSource+'&jsoncallback?',
		method : 'get',
		timeout : 30,
		dataType : 'json',
		returnAll : false,
		}, function(ret,err) {
			var data = getJsonData(err);
			if (data.rencode == 0) {
				callback(data);
			}else{
				api.hideProgress();
				popToast('获取试题信息失败，请稍候重试');
			}
		});
}
/*
*author:zhaoj
*function:点击查询按钮
* 叶向东
*date：20170316
*/
function submitClaimExam(){
	var num = $api.trim($api.val($api.byId('j_xh')));
	var name = $api.trim($api.val($api.byId('j_name')));
	if(num.length == 0){
		popToast('考号不能为空');
		return false;
	}
	if(name.length == 0){
		popToast('姓名不能为空');
		return false;
	}
	showSelfProgress('认领中...');
	api.ajax({
	url :ip_url+'/cloudScore/studentExam/updateClaimTestByTestCn.jhtml?loginType=1&testId='+testId+'&studentId='+student_id+'&studentName='+name+'&testNum='+num+'&dataSource='+dataSource+'&jsoncallback=?',
	method : 'get',
	timeout : 30,
	dataType : 'json',
	returnAll : false,
	}, function(ret,err) {
		var data = getJsonData(err);
		if (data.rencode == 0) {
			api.hideProgress();
			if(data.ret == 0){
				setTimeout(function(){
					commonCloseFrame('cjfx_rlks_frame');
				},1000);
				setTimeout(function(){
					api.execScript({
						name : 'root',
						script : 'cjfxBackType("index");'
					});
					api.execScript({
						name : 'root',
						frameName:'cjfx_index_frame',
						script : 'initData(1);'
					});
				},1400);
				setTimeout(function(){
					popToast('认领成功');
					api.execScript({
						name : 'root',
						script : 'cjfxBack();'
					});
					commonCloseFrame('cjfx_qrrl_frame');
				},1500);
			}else if(data.ret == 1){
				popAlert('考号或姓名输入错误，请确认后重新输入');
			}else{
				popAlert('您的成绩已被他人认领，请及时联系班主任处理');
			}
		}else{
			api.hideProgress();
			popToast('认领考试失败，请稍候重试');
		}
	});
}
/*
*author:zhaoj
*function:获取成绩概况图表显示的数据
*date：20170722
*/
function getCjgkData(type){
	var chart_data={'xAxis':[],"bar":[],"line":[],max_value:0};
	if(type == 0){
		chart_data.legend_data = ['学生','班级'];
	}else if(type == 1){
		chart_data.legend_data = ['学生','本校'];
	}else if(type == 2){
		chart_data.legend_data = ['学生','本区'];
	}else{
		chart_data.legend_data = ['学生','本市'];
	}
	for(var i = 0; i < cjbg_data.data.length; i++){
		chart_data.xAxis.push(cjbg_data.data[i].subjectName);
		chart_data.bar.push(cjbg_data.data[i].score*1);
		if(type == 0){
			chart_data.line.push(cjbg_data.data[i].classAvgScore*1);
		}else if(type == 1){
			chart_data.line.push(cjbg_data.data[i].schoolAvgScore*1);
		}else if(type == 2){
			chart_data.line.push(cjbg_data.data[i].districtAvgScore*1);
		}else{
			chart_data.line.push(cjbg_data.data[i].cityAvgScore*1);
		}
	}
	//获取最大值
	for(var i = 0; i < chart_data.bar.length; i++){
		if(chart_data.bar[i] > chart_data.max_value){
			chart_data.max_value = Math.ceil(chart_data.bar[i]);
		}
		if(chart_data.line[i] > chart_data.max_value){
			chart_data.max_value = Math.ceil(chart_data.line[i]);
		}
	}
	setCjgkChart(chart_data);
}
/*
*author:zhaoj
*function:主观题、客观题得分情况
* 叶向东
*date：20170722
*/
function getStudentQuestionScoreByType(callback){
	api.ajax({
		url :ip_url+'cloudScore/question/getStudentQuestionScoreByType.jhtml?loginType=1&studentId='+student_id+'&testId='+testId+'&field=school&subjectId='+subjectId+'&dataSource='+dataSource+'&jsoncallback?',
		method : 'get',
		timeout : 30,
		dataType : 'json',
		returnAll : false,
		}, function(ret,err) {
			var data = getJsonData(err);
			if (data.rencode == 0) {
				callback(data);
			}else{
				api.hideProgress();
				popToast('获取基本情况信息失败，请稍候重试');
			}
		});
}
/*
*author:zhaoj
*function:查询能力维度和学科素养。field=1能力，field=2素养
* 叶向东
*date：20170722
*/
function getStudentQuestionPropertyByType(field,callback){
	api.ajax({
		url :ip_url+'cloudScore/question/getStudentQuestionPropertyByType.jhtml?loginType=1&studentId='+student_id+'&testId='+testId+'&field='+field+'&subjectId='+subjectId+'&dataSource='+dataSource+'&jsoncallback?',
		method : 'get',
		timeout : 30,
		dataType : 'json',
		returnAll : false,
		}, function(ret,err) {
			var data = getJsonData(err);
			if (data.rencode == 0) {
				callback(data);
			}else{
				api.hideProgress();
				if(field == 1){
					popToast('获取能力维度信息失败，请稍候重试');
				}else{
					popToast('获取学科素养信息失败，请稍候重试');
				}
			}
		});
}
/*
*author:zhaoj
*function:设置成绩概况的图表
*date：20170722
*/
function setCjgkChart(data){
	// 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('cjgk'));
	option = {
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
	            type: 'cross',
	            crossStyle: {
	                color: '#999'
	            }
	        }
	    },
	    legend: {
	        data:data.legend_data
	    },
	    xAxis: [
	        {
	            type: 'category',
	            data: data.xAxis,
	            axisPointer: {
	                type: 'shadow'
	            }
	        }
	    ],
	    yAxis: [
	        {
	            type: 'value',
	            name: '分数         ',
	            min: 0,
	            max: data.max_value,
	            interval: 50
	        },
	        {
	            type: 'value',
	            name: '温度',
	            min: 0,
	            max: data.max_value,
	            interval: 10,
	            show:false,
	            axisLabel: {
	                formatter: '{value} °C'
	            }
	        }
	    ],
	    series: [
	        {
	            name:data.legend_data[0],
	            type:'bar',
	             label: {
	                normal: {
	                    show: true,
	                    position: 'top'
	                }
	            },
	            itemStyle : { normal: {color:"#4ED5F3"}},
	            data:data.bar
	        },
	        {
	            name:data.legend_data[1],
	            type:'line',
	            yAxisIndex: 1,
	            itemStyle : { normal: {color:"#C12E34"}},
	            data:data.line
	        }
	    ]
	};
// 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option); 
}
/*
*author:zhaoj
*function:打开知识点维度
*date：20170722
*/
function openZsdwd(){
	// 基于准备好的dom，初始化echarts实例
	getZsdwdData(function(is_true, zswd_json){
		if(is_true){
			var myChart = echarts.init(document.getElementById('zsdwd'));
			if(getJsonObjLength(zswd_json) > 0) {
				//维度项数组
				var indicator_attr = [];
				//得分率数组
				var series_value_attr = [];
				var i = 0;
				for(var key in zswd_json){
					var indicator_json = {"max": "1","min": 0};
					indicator_json["name"] = key;
					indicator_attr[i] = indicator_json;
					var tmp_v = zswd_json[key]*1;
					tmp_v = tmp_v.toFixed(2);
					series_value_attr[i] = tmp_v;
					i++
				}
				option = {
			        tooltip: {
			        },
			        radar: {
			            indicator: indicator_attr,
			            radius: 90
			        },
			        series: [{
			            name: '知识维度',
			            type: 'radar',
			            data : [
			                {
			                    value : series_value_attr,
			                    name : '得分率',
			                    label: {
			                    normal: {
			                        show: true,
			                        position: 'top'
			                    }
			                } 
			                }
			            ]
			        }],
			        itemStyle: {
			            normal: {
			                color: '#4ED5F3'
			            }
			        },
			    };
			    // 使用刚指定的配置项和数据显示图表。
			    myChart.setOption(option);
			} else {
				$api.html($api.byId('zsdwd'),'<div style="text-align:center;padding-top:130px;color:#333;">数据暂未上传</div>');
			}
		} else {
			popToast(zswd_json);
		}
	})
}

/**
 * 获取知识维度数据
 * 周枫
 * 2017.10.18
 * 接口：王卓岩 
 */
function getZsdwdData(callback){
	api.ajax({
		url :ip_url+'/cloudScore/question/getStudentQuestionKnowledgePoint.jhtml?loginType=1&studentId='+student_id+'&testId='+testId+'&subjectId='+subjectId+'&jsoncallback?',
		method : 'get',
		timeout : 30,
		dataType : 'json',
		returnAll : false,
	}, function(ret,err) {
		var data = getJsonData(err);
		if (data.rencode == 0) {
			api.hideProgress();
			var zsd_json = data.data;
			callback(true, zsd_json);
		}else{
			api.hideProgress();
			callback(false, '获取知识维度信息失败，请稍候重试');
			
		}
	});
}

/*
*author:zhaoj
*function:打开能力维度
*date：20170722
*/
function openNlwd(data){
	// 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('nlwd'));
    option = {
        tooltip: {
        },
        radar: {
            indicator: data.indicator,
            radius: 90
            
        },
        series: [{
            name: '能力维度',
            type: 'radar',
            data : [
                {
                    value :  data.value,
                    name : '得分率',
                    label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                } 
                }
            ]
        }],
        itemStyle: {
            normal: {
                color: '#4ED5F3'
            }
        },
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}
/*
*author:zhaoj
*function:打开学科素养
*date：20170722
*/
function openXksy(xksy_data){
	// 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('xksy'));
    option = {
        tooltip: {
        },
        radar: {
            indicator:xksy_data.indicator,
            radius: 90
            
        },
        series: [{
            name: '学科素养',
            type: 'radar',
            data : [
                {
                    value : xksy_data.value,
                    name : '得分率',
                    label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                } 
                }
            ]
        }],
        itemStyle: {
            normal: {
                color: '#4ED5F3'
            }
        },
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}
/*
*author:zhaoj
*function:设置进步情况数据显示到页面中
*date：20170724
*/
function setJbqkData(jbqk_data){
	var div_html = '';
	$api.html($api.byId('j_jbqk_sftm'), div_html);
	for(var i = 0; i < jbqk_data.data.length; i++){
		 var score = jbqk_data.data[i].score*1;
         score =score.toFixed(2);
         var totalScore = jbqk_data.data[i].totalScore*1;
         totalScore =totalScore.toFixed(2);
         	div_html+='<div>';
         	div_html+='<span id="">'+jbqk_data.data[i].questionType+'得分：</span><span>'+score*1+'分（满分'+totalScore*1+'分）</span>';
         	div_html+='</div>';
	}
//	div_html+='<div><span>失&nbsp;分&nbsp;题&nbsp;目&nbsp;：</span><span>1,2,4,6,9,17（1）</span></div>';
	$api.html($api.byId('j_jbqk_sftm'), div_html);
}
/*
*author:zhaoj
*function:处理能力维度的数据
*date：20170724
*/
function dealNlwdData(nlwd_data){
	if(nlwd_data.data.length > 0){
		var data={'indicator':[],value:[]};
		for(var i = 0; i < nlwd_data.data.length; i++){
			var oparam = new Object();
			oparam.max=1;
			oparam.min=0;
			oparam.name=nlwd_data.data[i].property;
			data.indicator.push(oparam);
			var scoreRate = nlwd_data.data[i].scoreRate*1;
			scoreRate = scoreRate.toFixed(2);
			data.value.push(scoreRate*1);
		}
		openNlwd(data);
	}else{
		$api.html($api.byId('nlwd'),'<div style="text-align:center;padding-top:130px;color:#333;">数据暂未上传</div>');
	}
}
/*
*author:zhaoj
*function:处理学科素养的数据
*date：20170724
*/
function dealXksyData(xksy_data){
	if(xksy_data.data.length > 0){
		var data={'indicator':[],value:[]};
		for(var i = 0; i < xksy_data.data.length; i++){
			var oparam = new Object();
			oparam.max=1;
			oparam.min=0;
			oparam.name=xksy_data.data[i].property;
			data.indicator.push(oparam);
			var scoreRate = xksy_data.data[i].scoreRate*1;
			scoreRate = scoreRate.toFixed(2);
			data.value.push(scoreRate*1);
		}
		openXksy(data);
	}else{
		$api.html($api.byId('xksy'),'<div style="text-align:center;padding-top:130px;color:#333;">数据暂未上传</div>');
	}
}
/*
*author:zhaoj
*function:获取试题分析
* 叶向东
*date：20170422
*/
function getQuestionBaseInfo(callback){
	api.ajax({
		url :ip_url+'/cloudScore/question/getQuestionBaseInfo.jhtml?loginType=1&studentId='+student_id+'&testId='+testId+'&subjectId='+subjectId+'&dataSource='+dataSource+'&jsoncallback?',
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
				api.hideProgress();
				popToast('获取成绩信息失败，请稍候重试');
			}
		});
}
/*
*author:zhaoj
*function:检验是否在收藏的题本中
*陈续刚
*date：20170725
*/
function checkIsInWrongQuestionsForcjfx(question_id_char,i){
	showSelfProgress('加载中...');
	api.ajax({
		url : BASE_URL_ACTION + '/xx/checkIsInWrongQuestionsForcjfx',
		method : 'get',
		dataType : 'json',
		timeout : 30,
		data : {
			values : {
				"random_num" : creatRandomNum(),
				"student_id" : student_id,
				"wq_type":2,
				"question_id_chars":"'"+question_id_char+"'",
			}
		},
		cache : false,
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		api.hideProgress();
		if(err){
			setTibenBtn(0,i);
		} else {
			if(ret) {	
				if(ret.success && ret.que_list.length ==0){
					setTibenBtn(0,i);
				}else{
					setTibenBtn(1,i);
				}
			} else {
				setTibenBtn(0,i);
			}
		}
	});
}
/*
*author:zhaoj
*function:加入收藏的题
*陈续刚
*date：20170724
*/
function addToWrontQuestionsForcjfx(question_id_char,qt_id,qt_type,callback){
	var data = [{
				"province_id" : $api.getStorage("province_id"),
				"city_id" : $api.getStorage("city_id"),
				"district_id" : $api.getStorage("district_id"),
				"bureau_id" : $api.getStorage("bureau_id"),
				"class_id" : $api.getStorage("class_id"),
				"student_id" : student_id,
				"source" : 9,
				"zy_id" : testId,
				"stage_id" : api.pageParam.stageId,
				"subject_id" : subjectId,
				"que_source":1,
				"jy_subject_en_name":'ds',
				"wq_type":2,
				"question_id_char":question_id_char,
				"qt_id":qt_id,
				"qt_type":qt_type,
				"stu_answer":'',
			}];
	showSelfProgress('加入中...');
	api.ajax({
		url : BASE_URL_ACTION + '/xx/addToWrongQuestionsForcjfx',
		method : 'post',
		dataType : 'json',
		timeout : 30,
		data : {
			values : {
				"random_num" : creatRandomNum(),
				"target" : JSON.stringify(data)
			}
		},
		cache : false,
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		api.hideProgress();
		if(err){
			callback(false);
		} else {
			if(ret) {		
				callback(true);
			} else {
				callback(false);
			}
		}
	});
}
/*
*author:zhaoj
*function:移出收藏的题
*陈续刚
*date：20170724
*/
function deleteFromWrontQuestions(question_id_char,qt_id,qt_type,callback){
	showSelfProgress('移出中...');
	api.ajax({
		url : BASE_URL_ACTION + '/ypt/xx/deleteFromWrontQuestions',
		method : 'post',
		dataType : 'json',
		timeout : 30,
		data : {
			values : {
				"random_num" : creatRandomNum(),
				"student_id" : student_id,
				"que_source":1,
				"wq_type":2,
				"question_id_char":question_id_char,
			}
		},
		cache : false,
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		api.hideProgress();
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
*function:获取两位小数
*type:1代表*100之后取两位小数，0：代表原数值取两位小时
*date：20170725
*/
function getTwoDecimal(num,type){
	if(type){
		num = num*100;
        num = num.toFixed(2);
     }else{
     	num = num*1;
        num = num.toFixed(2);
     }
     return num*1;
}
/*
*author:zhaoj
*function:获取考试评语
*date：20170727
*/
function getStudentComment(callback){
	api.ajax({
		url :ip_url+'cloudScore/studentExam/getStudentComment.jhtml?loginType=1&studentId='+student_id+'&testId='+testId+'&subjectId='+subjectId+'&dataSource='+dataSource+'&jsoncallback?',
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
				api.hideProgress();
				popToast('获取考试评语失败，请稍候重试');
			}
		});
}