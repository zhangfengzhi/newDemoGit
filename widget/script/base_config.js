window.onload = function () {
	var BASE_SERVER_NAME = $api.getStorage('BASE_SERVER_NAME');
	var person_id = $api.getStorage('person_id');
	var identity_id = $api.getStorage('identity');
	var login_name_rong_cookie = $api.getStorage("login_name_rong"); //cookie中的login_name_rong
	var login_name_rong_pj = person_id+"_"+identity_id+"_"+BASE_SERVER_NAME; //按拼接法则输出的login_name_rong
	if(login_name_rong_cookie != login_name_rong_pj && person_id){  //登录信息存在并且登录信息提供的login_name_rong与拼接法输出则不一致时，使用拼接法则处理数据
		$api.setStorage("login_name_rong",login_name_rong_pj);
		console.log($api.getStorage("login_name_rong"))
	}
}

//var BG_SERVER_IP = '10.10.6.93:6633';
var creditFlag = 1;
//是否开放积分，默认1开放，0屏蔽
var appName_ = '中小学家校互动系统V1.0';
var appName = '理想人人通';
//当前app提示更新版本号
var BASE_APP_VERSION = '1.1.37.07.17';
//web端支持的视频格式
var support_extension = ["avi","mp4","mpg","mpeg","wmv","asf","flv","rmvb","mov"];//系统支持的视频格式
//支持的图片格式
var support_img_extension = ["jpg","png"];//系统支持上传的图片格式
//支持的音频格式
var support_audio_extension = ["amr","mp3","wav"];//系统支持上传的音频格式
//文件上传，最大能上传10M
var upload_file_size='10485760';
//是否上了最新版crm
var BASE_CRM_TYPE=1;
//app的名字
//初始化全局变量
var BASE_URL_ACTION = $api.getStorage('BASE_URL_ACTION');
var BASE_SERVER_IP = $api.getStorage('BASE_SERVER_IP');
var BASE_APP_TYPE = $api.getStorage('BASE_APP_TYPE');
//阿里云服务器
//var BASE_SERVER_NAME = 'edusoa';
//var BASE_SERVER_IP = 'www.edusoa.com';

//长春宽城生产服务器
//var BASE_SERVER_NAME = 'cckcq';
//var BASE_SERVER_IP = '218.62.27.194:8088';

//宽城本地演示服务器
//var BASE_SERVER_NAME = 'kcys';
//var BASE_SERVER_IP = '10.10.100.103';

//83本地服务器
//var BASE_SERVER_NAME = '83';
//var BASE_SERVER_IP = '10.10.100.83';

//199本地服务器
//var BASE_SERVER_NAME = '199';
//var BASE_SERVER_IP = '10.10.6.199';

//var BASE_SERVER_IP = '139.212.254.252';
//var BASE_SERVER_IP = '10.10.100.106';

// 请求统一路径
//var BASE_URL_ACTION = '';
//
//var BASE_SERVER_NAME = '';
//if(BASE_SERVER_NAME == '' || (typeof(BASE_SERVER_NAME) == 'undefined')) {
//	BASE_SERVER_NAME = $api.getStorage('BASE_SERVER_NAME');
//}
//var BASE_SERVER_IP = '';
//if(BASE_SERVER_IP == '' || (typeof(BASE_SERVER_IP) == 'undefined')) {
//	BASE_SERVER_IP = $api.getStorage('BASE_SERVER_IP');
//	BASE_URL_ACTION = 'http://' + BASE_SERVER_IP + '/dsideal_yy';
//}
//开发：8luwapkvufgel
//生产：8brlm7ufr4va3
//表情存放路径
var BASE_EMOTION_PATH = 'widget://image/emotion';
//会话相关图片存储路径
var BASE_CHATBOX_PATH = 'widget://image/chatBox';
//人人通图片压缩临时保存路径
//var BASE_IMAGE_TEMP_PATH = 'fs://lxjxt/image/temp/';
//附件等下载地址
var BASE_DOWNLOAD_YY_PATH = 'fs://lxjxt/yingyong/';
//头像地址
var BASE_IMG_HEAD_PATH = 'widget://image/hh_img_temp/';
//头像裁剪地址
var BASE_IMG_HEAD_TEMP_PATH = 'fs://lxjxt/w/head_img_temp/';
//二维码地址
var BASE_FS_ERWEIMA_PATH = 'fs://lxjxt/wo/erweima/w_er.png';
//数据库存放fs路径
var BASE_FS_SQDB_PATH = 'fs://lxjxt/db/';
//数据库存放fs路径
var BASE_FS_NEW_SQDB_PATH = 'box://lxjxt/db/';
//资源播放器安装包存放fs路径
var BASE_FS_ZYAPP_PATH = 'fs://lxjxt/zy_app/';
//数据库名称
var BASE_FS_SQDB_NAME = 'dsideal_db.db';
//亲加直播接口访问地址
var BASE_ZB_ACTION = 'https://livevip.com.cn/liveApi/';

//资源播放器android包名，刘双玉提供
var BASE_ZY_APP_ANDROID = 'air.DsClassPlayer';
//资源播放器ios包名，刘双玉提供
var BASE_ZY_APP_IOS = 'dsidealbofangqi://';
//资源播放器android下载地址，刘双玉提供
var BASE_ZY_APP_DOWN_ANDROID="";
//云课堂视频的全局变量
var yk_vedio_path =  $api.getStorage('BASE_HTTP')+"video.edusoa.com";
if($api.getStorage('BASE_SERVER_NAME') == 'edusoa'){
    BASE_ZY_APP_DOWN_ANDROID = yk_vedio_path + '/down/dzsb/DsClass_Player.apk';
}else{
    BASE_ZY_APP_DOWN_ANDROID = $api.getStorage('BASE_URL_ACTION')+'/html/down/dzsb/DsClass_Player.apk';
}
//资源播放器ios下载地址，刘双玉提供，2017，01.03
var BASE_ZY_APP_DOWN_IOS = 'https://itunes.apple.com/cn/app/%E7%90%86%E6%83%B3%E6%92%AD%E6%94%BE%E5%99%A8/id1282235334?mt=8';

//平台类型，1为云版，2为局版
//var BASE_APP_TYPE = 1;
var BASE_APP_TYPE = 0;
if (BASE_APP_TYPE == 0 || ( typeof (BASE_APP_TYPE) == 'undefined')) {
	BASE_APP_TYPE = $api.getStorage('BASE_APP_TYPE');
}
/* 研修网用*/
var path_url = $api.getStorage('BASE_URL_ACTION');
//云版多媒体地址
var madie_url = "https://dsideal.obs.cn-north-1.myhuaweicloud.com";
//云版视频地址
var yun_video_url = madie_url + '/down/M3u8/';
//'/html/down2/M3u8/'
//云版文档地址
var yun_pdf_url = madie_url + "/html/down/Material/";
//多媒体路径
//本地视频地址
var bendi_video_url = path_url + '/html/down/M3u8/';
//'/html/down2/M3u8/'
//本地文档地址
var bendi_pdf_url = path_url + "/html/down/Material/";
//云课素材服务器IP地址
var yk_path_down = "http://video.edusoa.com/";
/* 研修网用*/

//接收头像默认值
var BASE_RECEIVER_DEFAULT_IMG;
if ($api.getStorage('BASE_APP_TYPE') == 1) {
	BASE_RECEIVER_DEFAULT_IMG = BASE_IMAGE_PRE+'down/Material/0D/0D7B3741-0C3D-D93C-BA3D-74668271F934.jpg@50w_50h_100Q_1x.jpg';
} else {
	BASE_RECEIVER_DEFAULT_IMG = $api.getStorage('BASE_URL_ACTION') + '/html/thumb/Material/0D/0D7B3741-0C3D-D93C-BA3D-74668271F934.jpg@50w_50h_100Q_1x.jpg';
}
//cchelper的appKey
var BASE_CCHELPER_KEY_IOS = 'dsideal_lxjxt#dsideal_lxjxt';
var BASE_CCHELPER_KEY_ANDROID = 'dsideal_lxjxt#lxjxt_android';

var BASE_MY_MENU = '{}';
//分页每页条数
var BASE_PAGE_SIZE = 10;
//ipad分页每页条数
var BASE_PAGE_SIZE_IPAD = 20;

//当前开通应用数组
var BASE_YY_OPEN = [];
//通知模块
BASE_YY_OPEN[0] = 'xwzx_index_window';
//课程表模块
BASE_YY_OPEN[1] = 'kcb_index_window';
//资源模块
BASE_YY_OPEN[2] = 'zy_index_window';
//学生检测模块
BASE_YY_OPEN[3] = 'zuoye_old_xs_index_window';
//导学模块
BASE_YY_OPEN[4] = 'daoxue_xs_index_window';
//题本模块
BASE_YY_OPEN[5] = 'ctb_xs_index_window';
//文章模块
BASE_YY_OPEN[6] = 'wenzhang_index_window';
//微课模块
BASE_YY_OPEN[7] = 'weike_index_window';
//教师检测
BASE_YY_OPEN[8] = 'zuoye_old_js_index_window';
//我的考勤
BASE_YY_OPEN[9] = 'kaoqin_wdkq_window';
//考勤审批
BASE_YY_OPEN[10] = 'kaoqin_kqsp_window';
//考勤管理
BASE_YY_OPEN[11] = 'kaoqin_kqhz_window';
//好友添加
BASE_YY_OPEN[12] = 'txl_addfriends_window';
//通知公告
BASE_YY_OPEN[13] = 'notice_index_window';
//调查问卷
BASE_YY_OPEN[14] = 'dcwj_index_window';
//任务管理
BASE_YY_OPEN[15] = 'rwgl_index_window';
//菁优新版检测
BASE_YY_OPEN[16] = 'zuoyeXsJy_index_window';
//菁优新版检测
BASE_YY_OPEN[17] = 'rizhi_index_window';
//菁优新版导学
BASE_YY_OPEN[18] = 'daoxueNewXs_index_window';
//菁优新版导学（平板端）
BASE_YY_OPEN[19] = 'daoxueNew_index_window';
//菁优新版课件
BASE_YY_OPEN[20] = 'kejianJyXs_index_window';
//菁优新版课件（平板端）
BASE_YY_OPEN[21] = 'kejianNew_index_window';
//菁优新版检测（平板端）
BASE_YY_OPEN[22] = 'zuoyeIpad_index_window';
//班级通知
BASE_YY_OPEN[23] = 'bjtz_index_window';
//班级通知（平板端）
BASE_YY_OPEN[24] = 'bjtzIpad_index_window';
//新闻资讯（平板端）
BASE_YY_OPEN[25] = 'xwzxIpad_index_window';
//通知公告（平板端）
BASE_YY_OPEN[26] = 'noticeIpad_index_window';

var url_path_action;
function getContextActionPath() {
	var pathName = document.location.pathname;

	var index = pathName.substr(1).indexOf("/html");
	var result = pathName.substr(0, index + 1);
	result = "/dsideal_yy";
	return result;
}

//未登录时调用的action路径
var url_path_action_login = getContextActionPath();
//前台action路径
url_path_action = getContextActionPath() + "/ypt";

/*一个工具方法：可以获取所有表情图片的名称和真实URL地址，以JSON对象形式返回。其中以表情文本为 属性名，以图片真实路径为属性值*/
function getImgsPaths(sourcePathOfChatBox, callback) {
	var jsonPath = sourcePathOfChatBox + "/emotion.json";
	//表情的JSON数组
	api.readFile({
		path : jsonPath
	}, function(ret, err) {
		if (ret.status) {
			var emotionArray = JSON.parse(ret.data);
			var emotion = {};
			for (var idx in emotionArray) {
				var emotionItem = emotionArray[idx];
				var emotionText = emotionItem["text"];
				var emotionUrl = "../../image/emotion/" + emotionItem["name"] + ".png";
				emotion[emotionText] = emotionUrl;
			}
			/*把emotion对象 回调出去*/
			if ("function" === typeof (callback)) {
				callback(emotion);
			}
		}
	});
}

/*
 * 时间戳转本地时间
 * type:1 格式化为 2010年12月23日 10:53
 * type:2 格式化为 2010-10-20 10:00:00
 * 周枫
 * 2015.08.03
 */
function getLocaleTimeByUnixTime(unix) {
	var now = new Date(parseInt(unix) * 1000);
	return now.toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
}

/*
 * 获取当前设备操作系统
 * 返回值：安卓:android 苹果：ios
 * 周枫
 * 2015.08.03
 */
function getPhoneSystem() {
	return api.systemType;
}

/**
 * 获取json对象的长度
 * 周枫
 * 2015.08.26
 * @param {Object} jsonObj
 */
function getJsonObjLength(jsonObj) {
	var Length = 0;
	for (var item in jsonObj) {
		Length++;
	}
	return Length;
}

/**
 *  在artTemplate的标签中使用外部函数的方法
 * 周枫
 * 2015.08.26
 * @param {Object} data
 */
function beforeRenderTemplate(data) {

}

/**
 * 根据id获取群组内人员
 * 周枫
 * 2015.08.27
 * 2015.12.05 废弃
 */
//function getGroupInfoById(id) {
//	api.ajax({
//		url : BASE_URL_ACTION + '/dsjxt/getGroupPersonInfo?id=' + id,
//		method : 'get',
//		dataType : 'text'
//	}, function(ret, err) {
//		if (ret) {
//			var obj = eval('(' + ret + ')');
//			$api.setStorage('group_data', obj);
//		} else {
//			api.alert({
//				msg : '对不起，根据id获取群组内人员'
//			});
//		}
//	});
//}

/**
 * 获取群组
 * 周枫
 * 2015.12.05
 */
function getGroupListById(target_id, callback) {
	var target_base_name = target_id.substring(target_id.lastIndexOf("_") + 1);
	if (target_base_name == $api.getStorage('BASE_SERVER_NAME')) {
		target_id = target_id.substring(0, target_id.lastIndexOf("_"));
	}
	console.log(target_id)
	$.ajax({
		type : 'GET',
		url : $api.getStorage('BASE_URL_ACTION') + '/dsjxt/getPersonInfoByGroupId',
		// data to be added to query string:
		data : {
			groupId : target_id,
			app_type : $api.getStorage('BASE_APP_TYPE')
		},
		// type of data we are expecting in return:
		dataType : 'json',
		timeout : 0,
		success : function(data) {
			if (data.success) {
				callback(data);
			} else {
				api.hideProgress();
				api.toast({
					msg : '获取群组失败'
				});
			}
		},
		error : function(xhr, type) {
			api.hideProgress();
			api.toast({
				msg : '获取群组失败'
			});
		}
	});
	
//	api.ajax({
//		url : $api.getStorage('BASE_URL_ACTION') + '/dsjxt/getPersonInfoByGroupId?groupId=' + target_id + '&app_type=' + $api.getStorage('BASE_APP_TYPE'),
//		method : 'get',
//		dataType : 'json'
//	}, function(ret, err) {
//		if (err) {
//			api.hideProgress();
//			api.toast({
//				msg : '获取群组失败'
//			});
//		} else {
//			if (ret.success) {
//				callback(ret);
//			} else {
//				api.hideProgress();
//				api.toast({
//					msg : '获取群组失败'
//				});
//			}
//		}
//
//	});
}

//替换所有的回车换行
function transferBr(content) {
	var string = content;
	try {
		string = string.replace(/\r\n/g, "<br>")
		string = string.replace(/\n/g, "<br>");
	} catch(e) {
		alert(e.message);
	}
	return string;
}

//action提交随机数，6位
var random_num = 0;
function creatRandomNum() {
	for (var i = 0; i < 6; i++) {
		random_num += Math.floor(Math.random() * 100000);
	}
	return random_num;
}

function closeAppForAndroid(from_html) {
	if(from_html == 'index'){
		mkeyTime = new Date().getTime();
	}
	api.addEventListener({
		name : "keyback"
	}, function(ret, err) {
		if(from_html == 'w' || from_html == 'infor'|| from_html == 'tzxx'|| from_html == 'init_menu'|| from_html == 'picture'){
			//从我的页面退出
			backIndex();
		}else{
			if ((new Date().getTime() - mkeyTime) > 2000) {
				//如果当前时间减去标志时间大于2秒，说明是第一次点击返回键，反之为2秒内点了2次，则退出。
				mkeyTime = new Date().getTime();
				api.toast({
					msg : '再按一次退出程序',
					duration : 2000,
					location : 'middle'
				});
			} else {
				if (from_html == 'index' || from_html == 'second_index') {
					api.execScript({
						name : 'root',
						frameName : 'hh_index',
						script : 'disRongCon();'
					});
				}
				api.closeWidget({
					silent : true
				});
			}
		}
	});
}

//替换所有字符
String.prototype.replaceAll = function(s1, s2) {
	try {
		return this.replace(new RegExp(s1, "gm"), s2);
	}catch(err){
		return this.replace(s1, s2);
	}
}
//获取guid
function newGuid() {
	var guid = "";
	for (var i = 1; i <= 32; i++) {
		var n = Math.floor(Math.random() * 16.0).toString(16);
		guid += n;
		if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
			guid += "-";
	}
	return guid.toUpperCase();
}
var BASE_IMAGE_PRE_ONLY_YUN = "http://image.edusoa.com";//只存在云版的情况下，图片预览压缩请求地址
if ($api.getStorage('BASE_APP_TYPE') == 1) {
	//素材服务器IP地址
	var url_path_down = "https://dsideal.obs.cn-north-1.myhuaweicloud.com/";
	//资源上传地址
	var url_path = "https://dsideal.obs.cn-north-1.myhuaweicloud.com";
	//资源上传地址后缀
	var url_path_suffix = "down/Material/";
	//局版图片和音频上传路径 周枫
	var url_path_app = "down/App/";
	//上传地址（缩略图等）
	var url_path_other = "https://dsideal.obs.cn-north-1.myhuaweicloud.com";
	//图片预览压缩请求地址
	var BASE_IMAGE_PRE = "http://image.edusoa.com/";
	var BASE_THUMB_BEGIN = '/down/Thumbs/';
	var BASE_THUMB_END = '.thumb';
	//http://10.10.6.199/dsideal_yy/html/down/M3u8/12/12B75C69-4100-1136-E270-2188A15CBE94.m3u8
	var BASE_M3U8_BEGIN = '/down/M3u8/';
	var BASE_M3U8_END = '.m3u8';

	var BASE_MATERIAL_BEGIN = '/down/Material/';
	//手机端录制微课json路径
	var BASE_PHONEWK_PATH = "/html/down/phoneWk/";
	//游戏和专题资源存放路径
	var BASE_GAME_TOPIC_PATH = "/down/2D3DRes/";
} else {
	//局版资源上传路径 周枫
	var url_path_suffix = "down/Material/";
	//局版图片和音频上传路径 周枫
	var url_path_app = "down/App/";
	var url_path = url_path_action_login + "/res/newUpload/";
	//局版图片预览路径 周枫
	var BASE_IMAGE_PRE = "thumb/Material/";
	//局版图片预览路径 周枫
	var BASE_IMAGE_BEGIN = "/html/thumb/Material/";
	//http://10.10.6.199/dsideal_yy/html/down/Thumbs/5E/5E199578-2030-47DC-B786-EFCF514FA7F3.thumb
	var BASE_THUMB_BEGIN = '/html/down/Thumbs/';
	var BASE_THUMB_END = '.thumb';
	//http://10.10.6.199/dsideal_yy/html/down/M3u8/12/12B75C69-4100-1136-E270-2188A15CBE94.m3u8
	var BASE_M3U8_BEGIN = '/down/M3u8/';
	var BASE_M3U8_END = '.m3u8';

	var BASE_MATERIAL_BEGIN = '/html/down/Material/';
	//手机端录制微课json路径
	var BASE_PHONEWK_PATH = "/html/down/phoneWk/";
	//游戏和专题资源存放路径
	var BASE_GAME_TOPIC_PATH = "/down/2D3DRes/";
}

/**
 * 获取学生科目列表
 * 周枫
 * 2015.12.07
 */
function getSubjectByStudentId(callback) {
	var person_id = $api.getStorage('person_id');
	var identity_id = $api.getStorage('identity');
	commonGetStudentInfoByParentId(person_id, identity_id, function(is_true, stu_info_json){
		if(is_true) {
			var stu_id = stu_info_json.student_id;
			api.ajax({
				url : $api.getStorage('BASE_URL_ACTION') + '/base/getSubjectByStudentId?random_num=' + creatRandomNum() + '&student_id=' + stu_id,
				method : 'get',
				timeout:30,
				dataType : 'json'
		
			}, function(ret, err) {
				if (ret.success == false) {
					var stu_sbj_list = $api.getStorage('stu_subject_list');
					if ( typeof (stu_sbj_list) != 'undefined') {
						callback(stu_sbj_list);
					} else {
						api.alert({
							msg : '对不起，获取学生科目列表失败'
						}, function(ret, err) {
		
						});
					}
				} else {
					callback(ret.list);
					$api.setStorage('stu_subject_list', ret.list);
				}
			});
		} else {
			api.toast({
				msg:stu_info_json
			});
		}	
	});
	
	
}

/**
 * 获取学生对应学科的教材版本
 * 周枫
 * 2015.12.07
 */
function getStudentScheme(class_id, subject_id, callback) {
	//{"success":true,"version_id":"20","version_name":"人教课标实验版","root_structure_id":"3466"}
	//		api.alert({
	//			msg : 'http://' + BASE_SERVER_IP + '/dsideal_yy/main/studentgetscheme?class_id='+class_id+'&subject_id='+subject_id
	//	  },function(ret,err){
	//	  	//coding...
	//	  });
	if ( typeof (subject_id) == 'undefined') {
		subject_id = 0;
	}
	api.ajax({
		url : $api.getStorage('BASE_URL_ACTION') + '/main/studentgetscheme?class_id=' + class_id + '&subject_id=' + subject_id,
		method : 'get',
		timeout:30,
		dataType : 'json'

	}, function(ret, err) {
		if (ret) {
			if (ret.success == false) {
				var stu_scheme_info = $api.getStorage('stu_scheme_info');
				if ( typeof (stu_scheme_info) != 'undefined') {
					callback(true, stu_scheme_info);
				} else {
					api.alert({
						msg : '对不起，请联系当前学科教师设置任课计划和教材版本'
					}, function(ret, err) {
						callback(false, '');
					});
				}
			} else {
				callback(true, ret);
				$api.setStorage('stu_scheme_info', ret);
			}
		} else {
			api.alert({
				msg : '对不起，请联系当前学科教师设置任课计划和教材版本'
			}, function(ret, err) {
				callback(false, '');
			});
		}
	});
}

/**
 * 获取学生科目列表数据
 * 周枫
 * 2015.12.19
 */
function getXkList(type_name, callback) {
	api.showProgress({
		title : '加载中...',
		text : '请稍候...',
		modal : false
	});
	//当前人员id
	var person_id = $api.getStorage('person_id');
	var identity_id = $api.getStorage('identity');
	commonGetStudentInfoByParentId(person_id, identity_id, function(is_true, stu_info_json){
		if(is_true) {
			var stu_id = stu_info_json.student_id;
			
			//获取学生科目列表数据
			getSubjectByStudentId(function(stu_sbj_list) {
				api.ajax({
					url : $api.getStorage('BASE_URL_ACTION') + '/yxx/main/getmoudelsubject?student_id=' + stu_id + '&random_num=' + creatRandomNum(),
					method : 'get',
					timeout:30,
					dataType : 'json'
				}, function(ret, err) {
					if (ret) {
						var wk_sbj_arrs = [];
						var wk_sbj_arr = [];
						switch(type_name) {
							case 'xs_wk':
								wk_sbj_arr = ret.wk_subject_ids;
								for (var i = 0; i < wk_sbj_arr.length; i++) {
									for (var j = 0; j < getJsonObjLength(stu_sbj_list); j++) {
										if (stu_sbj_list[j].subject_id == wk_sbj_arr[i].wk_subject) {
											wk_sbj_arrs.push(stu_sbj_list[j]);
										}
									}
								}
								break;
							case 'xs_zy':
								wk_sbj_arr = ret.zy_subject_ids;
								for (var i = 0; i < wk_sbj_arr.length; i++) {
									for (var j = 0; j < getJsonObjLength(stu_sbj_list); j++) {
										if (stu_sbj_list[j].subject_id == wk_sbj_arr[i].zy_subject) {
											wk_sbj_arrs.push(stu_sbj_list[j]);
										}
									}
								}
								break;
						}
		
						callback(wk_sbj_arrs);
					}
				});
			});
		} else {
			api.toast({
				msg:stu_info_json
			});
		}	
	});
	
	
	
}

/**
 * 延迟加载
 * 周枫
 * 2015.12.22
 */
function echoInit() {
	echo.init({
		offset : 0,
		throttle : 0 //设置图片延迟加载的时间
	});
}

/**
 * 延迟加载并缓存本地
 * 周枫
 * 2015.12.22
 */
function echoInitCache() {
	//echo.detach();
	echo.init({
		offset : 0,
		throttle : 0, ////设置图片延迟加载的时间
		unload : false,
		callback : function(element, op) {
			var url = element.getAttribute('data-cache-url');
			var quequeid = element.getAttribute('data-id');
			var c = element.getAttribute('data-class');
			if (op === 'load') {
				sdk_cache.queque.add(quequeid, url, function(ret) {
					var el = $("img."+c+"[data-id='" + ret.id + "']");

					var path = ret.url;
					
					el.attr('src', path);
					el.removeAttr('data-cache-url');
					el.removeAttr('data-echo');
				});

			}
		}
	});
}

/**
 * 图片缓存
 * 周枫
 * 2015.12.28
 * default                        //默认为cache_else_network
 cache_else_network            //若服务器上没有更新，则使用缓存
 no_cache                    //不使用缓存，始终从服务器获取
 cache_only                    //当缓存存在时，只从缓存中读取
 */
function imageCache(img_url, cache_type, callback) {
	if (cache_type == '') {
		cache_type = 'cache_else_network';
	}
	api.imageCache({
		url : img_url,
		policy : cache_type,
		thumbnail : false
	}, function(ret, err) {
		if (ret) {
			callback(ret.url);
		} else {
			callback(img_url);
		}
	});
}
/*
*作者:zhaoj
*功能:获取全局配置
*日期：20161018
*/
function getGolbalValueByKeys(keys,callback){	
	var myJson;
	api.ajax({
		url : BASE_URL_ACTION  + "/golbal/getValueByKey?key="+keys,
		method : 'get',
		timeout : 30,
		dataType : 'json',
		cache : false,
	}, function(ret, err) {
		if (err) {
			callback(false,'');
		} else {
			if(ret){
				callback(true,ret);
			}else{
				callback(false,ret);
			}
		}
	});
}
/**
 * 返回当前是否联网
 * 周枫
 * 3g 4g wifi none
 * 2016.11.21
 */
function isOnLineStatus(callback) {
	var s = api.connectionType;
	s = s.toLowerCase();
	if(s != 'none'){
		callback(true, s);
	} else {
		callback(false, s);
	}
//	if ((s.indexOf('wifi') != -1) || (s.indexOf('3') != -1) || (s.indexOf('4') != -1) || (s.indexOf('2') != -1)) {
//		callback(true, s);
//	} else {
//		callback(false, s);
//	}
}

/**
 * 服务器内容转融云内容
 * 例： zfapp -- zfapp_199
 * 周枫
 * 2016.03.09
 */
function oldParamToNewParam(old_param) {
	//没有后缀，加上后缀
	if (old_param.lastIndexOf('_' + $api.getStorage('BASE_SERVER_NAME')) == -1) {
		old_param = old_param + "_" + $api.getStorage('BASE_SERVER_NAME');
	}
	return old_param;
}
function oldParamToNewParamTwo(old_param, base_server_name) {
	//没有后缀，加上后缀
	if (old_param.lastIndexOf('_' + base_server_name) == -1) {
		old_param = old_param + "_" + base_server_name;
	}
	return old_param;
}

/**
 * 融云内容转服务器内容
 * 例： zfapp_199 -- zfapp
 * 周枫
 * 2016.03.09
 */
function newParamToOldParam(new_param) {
	//有后缀，去掉后缀
	if (new_param.lastIndexOf('_' + $api.getStorage('BASE_SERVER_NAME')) != -1) {
		var sub_key = "_" + $api.getStorage('BASE_SERVER_NAME');
		var sub_index = new_param.lastIndexOf(sub_key);
		new_param = new_param.substring(0, sub_index);
	}
	return new_param;
}



//好友是否有变动
//$api.setStorage('friend_is_change',0);
//学生获取教材版本
//$api.setStorage('stu_scheme_info',ret);
//班级id
//$api.setStorage('class_id', ret.class_id);
//会话列表页json串    $api.getStorage('hh_index_list');
//赋值全局变量token
//$api.setStorage('mytoken',ret.token);
//赋值身份
//$api.setStorage('identity',ret.identity);
//赋值真实姓名
//$api.setStorage('person_name',ret.person_name);
//赋值人员ID
//$api.setStorage('person_id',ret.person_id);
//赋值头像
//$api.setStorage('avatar_url',ret.avatar_url);
//赋值头像
//$api.setStorage('login_name',ret.userId);
//登录人员guid
//$api.setStorage('login_id', ret.login_id);
//登录人员姓名
//$api.setStorage('login_name',login_name);
//登录人员密码
//$api.setStorage('login_pad',login_pas);
//通讯录首页数据
//$api.setStorage('txl_data',obj);
//云平台票据
//$api.setStorage('token_ypt', ret.token_ypt);
//
//$api.setStorage('group_list_data', obj);

//融云key
//						$api.setStorage('rong_key', ret.rong_key);
//融云secret
//						$api.setStorage('rong_secret', ret.rong_secret);
//安装机构类型： 100：全国， 101：省， 102：市， 103：区县， 104：校，
//						$api.setStorage('org_level', ret.org_level);
//多级门户类型：1（三级门户：市、区、校），2（二级门户：区，校），3（一级门户：校）
//						$api.setStorage('site_level', ret.site_level);
//安装机构ID，注意要与common.org.level对应上，300529是南关区教育局ID
//						$api.setStorage('org_id', ret.org_id);
//云平台版本：1：云版 2：局版
//						$api.setStorage('server_location', ret.server_location);
//机构id
//$api.setStorage('bureau_id', ret.bureau_id);
//机构名字
//$api.setStorage('bureau_name', ret.bureau_name);
//学校id
//$api.setStorage('school_id', ret.school_id);
//学校名字
//$api.setStorage('school_name', ret.school_name);
//区id
//$api.setStorage('district_id', ret.district_id);
//区名字
//$api.setStorage('district_name', ret.district_name);
//市id
//$api.setStorage('city_id', ret.city_id);
//市名字
//$api.setStorage('city_name', ret.city_name);
//省id
//$api.setStorage('province_id', ret.province_id);
//省名字
//$api.setStorage('province_name', ret.province_name);
//权限
//$api.setStorage('roles', ret.roles);
//发布通知地区
//$api.setStorage('gxdq_area_id',ret.area_list[i].admin_area_id);
//发布通知地区
//$api.setStorage('gxdq_area_name',ret.area_list[i].admin_area_name);
//是否运行发送通知
//$api.setStorage('is_add_notice',1);
//获取学生科目列表
//$api.setStorage('stu_subject_list',ret.list);
//提示更新当前app的版本
//$api.setStorage('is_update',BASE_APP_VERSION);

/*
 * 获取带cookie头的请求范例
 * 周枫
 * 2015-08-03

 function testWk() {
 api.ajax({
 url : 'http://10.10.6.199/dsideal_yy/ypt/wkds/getwkdsList?view=0&nid=3466&is_root=0&cnode=1&sort_type=4&sort_order=2&pageSize=20&pageNumber=1&keyword=&scheme_id=20&wkds_type=1&bType=10&random_num695677&wk_type=0',
 method : 'get',
 dataType : 'text',
 headers : {
 'Cookie' : 'person_id='+$api.getStorage("person_id")+'; identity_id='+$api.getStorage("identity")+'; token='+$api.getStorage("token_ypt")+';'
 }
 }, function(ret, err) {
 if (ret) {
 if (ret.success == false) {
 api.hideProgress();
 api.alert({
 msg : ret.info
 });
 } else {
 api.alert({
 msg : JSON.stringify('ret'+ret)
 },function(ret,err){
 //coding...
 });
 }
 } else {
 api.alert({
 msg : JSON.stringify('err'+err)
 },function(ret,err){
 //coding...
 });
 }
 });
 }
 */