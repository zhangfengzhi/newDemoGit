/*
 * 登录
 * 周枫
 * 2015-08-03
 */
var user_name_from_outside = "";
var password_from_outside = "";
function doLogin() {
	setStorageToApp('edusoa', function(is_ok){
		isOnLineStatus(function(is_online, line_type) {
			if (is_online) {
				if (line_type == '2g' || line_type == '3g') {
					api.confirm({
						title : "提示",
						msg : "建议您在4g或wifi网络下使用，是否继续？",
						buttons : ["继续", "取消"]
					}, function(ret, err) {
						var sourceType;
						if (1 == ret.buttonIndex) {
						   if(user_name_from_outside && password_from_outside){
                               var login_name = user_name_from_outside+ "_" + $api.getStorage('BASE_SERVER_NAME');
                               var login_pas = password_from_outside;
                            }else{
                                var login_name = $api.val($api.byId("login_name_input")); 
                                login_name = $api.trimAll(login_name);
                                if (login_name.length == 0) {
                                    popAlert('对不起，请输入用户名。');
                                    return false;
                                }
                                login_name = login_name + "_" + $api.getStorage('BASE_SERVER_NAME');
                                var login_pas = $api.val($api.byId("login_pas_input"));
                                login_pas = $api.trimAll(login_pas);
                                if (login_pas.length == 0) {
                                    popAlert('对不起，请输入密码。');
                                    return false;
                                }
                            }
							
							commonShowProgress('登录中...',true);
							//我的token
//							if (api.uiMode != "pad"){
//								setTimeout(function(){
//									checkLoginStatus();
//								},500);
//							}else{
								getToken(login_name, login_pas);
//							}
							
						} else {
							return;
						}
					});
				} else {
				console.log(user_name_from_outside)
				if(user_name_from_outside && password_from_outside){
				    var login_name = user_name_from_outside+ "_" + $api.getStorage('BASE_SERVER_NAME');
                    var login_pas = password_from_outside;
				}else{
				    var login_name = $api.val($api.byId("login_name_input"));
                    login_name = $api.trimAll(login_name);
                    if (login_name.length == 0) {
                        popAlert('对不起，请输入用户名。');
                        return false;
                    }
                    login_name = login_name + "_" + $api.getStorage('BASE_SERVER_NAME');
                    var login_pas = $api.val($api.byId("login_pas_input"));
                    login_pas = $api.trimAll(login_pas);
                    if (login_pas.length == 0) {
                        popAlert('对不起，请输入密码。');
                        return false;
                    }
				}
//				alert("c="+login_pas)
					commonShowProgress('登录中...',true);
					//我的token
//					if (api.uiMode != "pad"){
//						setTimeout(function(){
//							checkLoginStatus();
//						},500);
//					}else{
						getToken(login_name, login_pas);
//					}
				}
			} else {
				popAlert('网络连接失败，请检查您的网络设置');
			}
		});
	});
}

/*
 * 获取token
 * 周枫
 * 2015-08-03
 * 石宝峰复用
 */
function getToken(login_name, login_pas) {

//		login_pas = login_pas.replace(/\+/g,"%2B");
		login_pas = login_pas.replace(/\+/g,"%2B");
		console.log("login_name="+login_name)
console.log("login_pas="+login_pas)
//alert("b="+login_pas)
console.log($api.getStorage('BASE_URL_ACTION') + '/rongcloud/getTokenRongCloud')
		api.ajax({
			url : $api.getStorage('BASE_URL_ACTION') + '/rongcloud/getTokenRongCloud',
			method : 'post',
			dataType : 'json',
			timeout : 30,
			data : {
				values : {
					"login_name" : login_name,
					"login_pas" : login_pas,
					"ip_addr" : $api.getStorage('BASE_SERVER_IP'),
					"app_type" : $api.getStorage('BASE_APP_TYPE'),
					"is_check" : false
				}
			}
		}, function(ret, err) {
		var values = {
                    "login_name" : login_name,
                    "login_pas" : login_pas,
                    "ip_addr" : $api.getStorage('BASE_SERVER_IP'),
                    "app_type" : $api.getStorage('BASE_APP_TYPE'),
                    "is_check" : false
                }
		console.log(JSON.stringify(values))
		console.log(JSON.stringify(ret))
		console.log(JSON.stringify(err))
			api.hideProgress();
			if(err){
				popAlert('对不起，网络繁忙，请稍候重试');
			}else if (ret) {
				if (ret.success == false) {
					popAlert(ret.info);
				} else {
					setIdentityType(login_name,login_pas,ret);
				}
			}
		});
	
}
/*
 * 设置身份
 * zhaoj
 * 2018-01-27
 */
function setIdentityType(login_name,login_pas,ret){
//alert("a="+login_pas)
    var jsonPath = "widget://res/json/index_i"+"phone"+".json";
    commonBaseConfig(jsonPath,function(data) {
        var person_identity = ret.identity;
        var owner_orgzn = ret.bureau_id;
        getLevelOfJf(owner_orgzn,function(data_type){
            if(person_identity == 5){
                //教师
                if(ret.bureau_id == ret.district_id || ret.bureau_id == ret.city_id || ret.bureau_id ==  ret.province_id || data_type*1 == 7 || data_type*1 == 1){
                    //判断是否是教育局
                    $api.setStorage('idy_type', 'work');
                }else{
                    $api.setStorage('idy_type', 'teacher');
                }
            }else if(person_identity == 6){
                //学生
                $api.setStorage('idy_type', 'student');
            }else{
                //家长
                $api.setStorage('idy_type', 'parent');
            }
            var idy_type = $api.getStorage('idy_type');
            $api.setStorage('theme', data[idy_type].theme);
            $api.setStorage('mode', data[idy_type].mode);
            $api.setStorage('idy_id', data[idy_type].id);
            //赋值全局变量token
            $api.setStorage('mytoken', ret.token);
            //赋值身份
            $api.setStorage('identity', ret.identity);
            //赋值真实姓名
            $api.setStorage('person_name', ret.person_name);
            //赋值人员ID
            $api.setStorage('person_id', ret.person_id);
            //赋值头像
            $api.setStorage('avatar_url', ret.avatar_url);
            //登录名,兼容多账号登录
            var l_n = ret.login_name;
            if ('undefined' == typeof (l_n) || null == l_n || l_n == '') {
                $api.setStorage('login_name', login_name);
                $api.setStorage('login_name_show', login_name);
                $api.setStorage('login_name_old', newParamToOldParam(login_name));
            } else {
                l_n = oldParamToNewParam(l_n);
                //登录后返回的融云交互的登录名
                $api.setStorage('login_name', l_n);
                //输入框输入的登录名
                $api.setStorage('login_name_show', login_name);
                $api.setStorage('login_name_old', newParamToOldParam(l_n));
            }
            $api.setStorage("login_name_rong",ret.userId);
            //密码
            $api.setStorage('login_pad', login_pas);
            //云平台票据
            $api.setStorage('token_ypt', ret.token_ypt);
            //融云key
            $api.setStorage('rong_key', ret.rong_key);
            //融云secret
            $api.setStorage('rong_secret', ret.rong_secret);
            //安装机构类型： 100：全国， 101：省， 102：市， 103：区县， 104：校，
            $api.setStorage('org_level', ret.org_level);
            //多级门户类型：1（三级门户：市、区、校），2（二级门户：区，校），3（一级门户：校）
            $api.setStorage('site_level', ret.site_level);
            //安装机构ID，注意要与common.org.level对应上，300529是南关区教育局ID
            $api.setStorage('org_id', ret.org_id);
            //云平台版本：1：云版 2：局版
            $api.setStorage('server_location', ret.server_location);
            //是否接入统一认证： 0：未接入， 1：接入
            $api.setStorage('sso_config', ret.sso_config);
            //班级id
            $api.setStorage('class_id', ret.class_id);
            //班级名称
            $api.setStorage('class_name', ret.class_name);
            //机构id
            $api.setStorage('bureau_id', ret.bureau_id);
            //机构名字
            $api.setStorage('bureau_name', ret.bureau_name);
            //学校id
            $api.setStorage('school_id', ret.school_id);
            //学校名字
            $api.setStorage('school_name', ret.school_name);
            //区id
            $api.setStorage('district_id', ret.district_id);
            //区名字
            $api.setStorage('district_name', ret.district_name);
            //市id
            $api.setStorage('city_id', ret.city_id);
            //市名字
            $api.setStorage('city_name', ret.city_name);
            //省id
            $api.setStorage('province_id', ret.province_id);
            //省名字
            $api.setStorage('province_name', ret.province_name);
            //统一配置token
            $api.setStorage('sso_token', ret.sso_token);
            //权限
            $api.setStorage('roles', ret.roles);
            
            //教学平台二维码扫码登录需要
            var mac_addr = $api.getStorage('person_id');
            $api.setStorage('mac_addr', mac_addr);
            var handWriteBoard = api.require('handWriteBoard');//手写板模块
//          if(api.systemType == "android" && api.uiMode == "pad" && $api.getStorage('identity') == 6 && typeof(handWriteBoard) != "undefined"){
//              getCrmInfoByPerson('hxx_sxb',function(flag,info){
//                 $api.setStorage('stu_sxb',flag);
//              });    
//          }else{
                $api.setStorage('stu_sxb',false);
//          }
            //初始化群组信息到融云
            initGroupInfoByUserId(1,function(init_group_result) {
                api.hideProgress();
                openIndex();
            }); 
        });
    });
}
/*
 * 打开首页
 * 周枫
 * 2015-08-03
 */
function openIndex() {
	var jsonPath = "widget://res/json/config.json";
	commonBaseConfig(jsonPath,function(data) {
		var uiMode = "phone";
		var app_index = '';
		var idy_type = $api.getStorage('idy_type');
		switch(uiMode) {
			case 'phone':
				commonSetScreen(3);
				app_index = data.phone_login_config[idy_type+'_index'];
				break;
//			case 'pad':
//				if(idy_type == 'parent' || idy_type == 'work'){	
//					app_index = data.pad_login_config[idy_type+'_index'];
//					commonOpenWin('root', app_index, false, false,{'from_html' : 'login_html','reload':true});
//					setTimeout(function(){
//						commonSetScreen(3);
//						return;
//					},1000)
//				}else{
//					if(api.systemType == 'ios'){
//						commonSetScreen(5);
//					}else{
//						commonSetScreen(2);
//					}
//				}
//				app_index = data.pad_login_config[idy_type+'_index'];
//				break;
			default:
				commonSetScreen(3);
				app_index = data.phone_login_config[idy_type+'_index'];
				break;
		}
		setTimeout(function(){
			commonOpenWin('root', app_index, false, false,{'from_html' : 'login_html','reload':true});
		},1000);
	});
	setTimeout(function(){
		$api.val($api.byId('login_pas_input'), '');	
	},1500);
}
/*
 * 获取地区参数
 * 赵静
 * 2018-01-29
 */
function setStorageToApp(BASE_APP_TO, callback){
	//更改的时候改这个不同地区
	var BASE_SERVER_QY = '';
	var BASE_SERVER_NAME = '';
	var BASE_SERVER_IP = '';
	var BASE_APP_TYPE = 0;
	var BG_SERVER_IP = '';
	var BASE_HTTP="http://";
	switch(BASE_APP_TO){
		case '199':
			BASE_SERVER_QY = '199本地服务器';
			BASE_SERVER_NAME = '199';
			BASE_SERVER_IP = '10.10.14.199';
			BASE_URL_ACTION = 'http://' + BASE_SERVER_IP + '/dsideal_yy';
			BASE_APP_TYPE = 2;
			BG_SERVER_IP = '10.10.14.199';
		break;
		case '159':
			BASE_SERVER_QY = '159本地服务器';
			BASE_SERVER_NAME = '159';
			BASE_SERVER_IP = '10.10.14.159';
			BASE_URL_ACTION = 'http://' + BASE_SERVER_IP + '/dsideal_yy';
			BASE_APP_TYPE = 2;
			BG_SERVER_IP = '10.10.14.159';
		break;
		case '191':
			BASE_SERVER_QY = '191本地开平测试服务器';
			BASE_SERVER_NAME = '191';
			BASE_SERVER_IP = '10.10.14.191';
			BASE_URL_ACTION = 'http://' + BASE_SERVER_IP + '/dsideal_yy';
			BASE_APP_TYPE = 2;
			BG_SERVER_IP = '10.10.14.191';
		break;
		 case '167':
            BASE_SERVER_QY = '167本地服务器';
            BASE_SERVER_NAME = '167';
            BASE_SERVER_IP = '10.10.14.167';
            BASE_URL_ACTION = 'http://' + BASE_SERVER_IP + '/dsideal_yy';
            BASE_APP_TYPE = 1;
            BG_SERVER_IP = '10.10.14.167';
        break;
		case '232':
            BASE_SERVER_QY = '232本地服务器';
            BASE_SERVER_NAME = '232';
            BASE_SERVER_IP = '10.10.14.232';
            BASE_URL_ACTION = 'http://' + BASE_SERVER_IP + '/dsideal_yy';
            BASE_APP_TYPE = 1;
            BG_SERVER_IP = '10.10.14.232';
        break;
        case '172':
            BASE_SERVER_QY = '172本地服务器';
            BASE_SERVER_NAME = '172';
            BASE_SERVER_IP = 'dsca.edusoa.com';
            BASE_URL_ACTION = 'https://' + BASE_SERVER_IP + '/dsideal_yy';
            BASE_APP_TYPE = 2;
            BG_SERVER_IP = 'dsca.edusoa.com';
            BASE_HTTP="https://";
        break;
		case 'edusoa': 
			BASE_SERVER_QY = '东北师大理想软件股份有限公司';
			BASE_SERVER_NAME = 'edusoa';
			BASE_SERVER_IP = 'www.edusoa.com';
//			BASE_URL_ACTION = 'http://' + BASE_SERVER_IP + '/dsideal_yy';
			BASE_URL_ACTION = 'https://' + BASE_SERVER_IP + '/dsideal_yy';
			BASE_APP_TYPE = 1;
			BG_SERVER_IP = 'www.edusoa.com';
			BASE_HTTP="https://";
		break;
		case 'tskp': 
			BASE_SERVER_QY = '东北师大理想软件股份有限公司';
			BASE_SERVER_NAME = 'tskp';
//			BASE_SERVER_IP = 'www.kpedu.com/';
			BASE_SERVER_IP = '221.194.113.150';
			BASE_URL_ACTION = 'http://' + BASE_SERVER_IP + '/dsideal_yy';
			BASE_APP_TYPE = 2;
			BG_SERVER_IP = '221.194.113.150';
		break;
		case 'tjbc':
			BASE_SERVER_QY = '天津市北辰区教育局';
			BASE_SERVER_NAME = 'tjbc';
			BASE_SERVER_IP = '121.193.162.32:9999';
			BASE_URL_ACTION = 'http://' + BASE_SERVER_IP + '/dsideal_yy';
			BASE_APP_TYPE = 2;
			BG_SERVER_IP = '121.193.162.32:9999';
		break;
		case 'ybjyj':
            BASE_SERVER_QY = '四川宜宾人人通';
            BASE_SERVER_NAME = 'ybjyj';
            BASE_SERVER_IP = 'www.ybxjy.com';
            BASE_URL_ACTION = 'http://' + BASE_SERVER_IP + '/dsideal_yy';
            BASE_APP_TYPE = 2;
            BG_SERVER_IP = 'www.ybxjy.com';
        break;
		case 'rcfyzx':
            BASE_SERVER_QY = '福永中学人人通';
            BASE_SERVER_NAME = 'rcfyzx';
            BASE_SERVER_IP = '192.168.16.248';
            BASE_URL_ACTION = 'http://' + BASE_SERVER_IP + '/dsideal_yy';
            BASE_APP_TYPE = 2;
            BG_SERVER_IP = '192.168.16.248';
        break;
        case 'jntq':
			BASE_SERVER_QY = '济南市天桥区教育云平台';
			BASE_SERVER_NAME = 'jntq';
			BASE_SERVER_IP = '221.214.55.21:6607';//生产环境
			BASE_URL_ACTION = 'http://' + BASE_SERVER_IP + '/dsideal_yy';
			BASE_APP_TYPE = 2;
			BG_SERVER_IP = '221.214.55.21:6607';
		break;
		case 'cfsrrt':
            BASE_SERVER_QY = '内蒙古赤峰市教育局';
            BASE_SERVER_NAME = 'cfsrrt';
            BASE_SERVER_IP = 'ypt.cfedu.net';
            BASE_URL_ACTION = 'http://' + BASE_SERVER_IP + '/dsideal_yy';
            BASE_APP_TYPE = 2;
            BG_SERVER_IP = 'ypt.cfedu.net';
        break;
        case 'bxx':
            BASE_SERVER_QY = '博兴人人通';
            BASE_SERVER_NAME = 'bxx';
            BASE_SERVER_IP = '222.134.51.134:81';
            BASE_URL_ACTION = 'http://' + BASE_SERVER_IP + '/dsideal_yy';
            BASE_APP_TYPE = 2;
            BG_SERVER_IP = '222.134.51.134:81';
        case 'clxsz':
            BASE_SERVER_QY = '湖南茶陵三中';
            BASE_SERVER_NAME = 'clxsz';
            BASE_SERVER_IP = '183.214.236.106:8099';
            BASE_URL_ACTION = 'http://' + BASE_SERVER_IP + '/dsideal_yy';
            BASE_APP_TYPE = 1;
            BG_SERVER_IP = '183.214.236.106:8099';
        break;
        case 'xmhc':
            BASE_SERVER_QY = '厦门市海沧区教育局';
            BASE_SERVER_NAME = 'xmhc';
            BASE_SERVER_IP = 'dsrrt.xmhcedu.cn';
            BASE_URL_ACTION = 'http://' + BASE_SERVER_IP + '/dsideal_yy';
            BASE_APP_TYPE = 2;
            BG_SERVER_IP = 'dsrrt.xmhcedu.cn';
        break;
        case 'jxsjyt':
            BASE_SERVER_QY = '东北师大理想软件股份有限公司';
            BASE_SERVER_NAME = 'jxsjyt';
            BASE_SERVER_IP = '121.36.167.172:9999';
            BASE_URL_ACTION = 'http://' + BASE_SERVER_IP + '/dsideal_yy';
            BASE_APP_TYPE = 2;
            BG_SERVER_IP = '121.36.167.172:9999';
        break;
        case 'install': 
            BASE_SERVER_QY = '东北师大理想软件股份有限公司';
            BASE_SERVER_NAME = 'install';
//          BASE_SERVER_IP = 'www.kpedu.com/';
            BASE_SERVER_IP = '10.10.15.133';
            BASE_URL_ACTION = 'http://' + BASE_SERVER_IP + '/dsideal_yy';
            BASE_APP_TYPE = 2;
            BG_SERVER_IP = '10.10.15.133';
        break;
	}
	$api.setStorage('BASE_SERVER_QY', BASE_SERVER_QY);
	$api.setStorage('BASE_SERVER_NAME', BASE_SERVER_NAME);
	$api.setStorage('BASE_SERVER_IP', BASE_SERVER_IP);
	$api.setStorage('BASE_URL_ACTION', BASE_URL_ACTION);
	$api.setStorage('BASE_APP_TYPE', BASE_APP_TYPE);
	$api.setStorage('BG_SERVER_IP', BG_SERVER_IP);
	$api.setStorage('BASE_HTTP', BASE_HTTP);
	callback(true);
}
/*
 * 功能：键盘监控go按钮，登录操作
 * 作者：周枫
 * 时间：20171107
 */
function keyGo(){
	commonKeydown('doLogin();');
}

/*
 * 功能：键盘监控go按钮，登录操作
 * 作者：周枫
 * 时间：20171107
 */
function keyGo(){
    commonKeydown('doLogin();');
}

/*
 * 功能：获取当前机构信息
 * 作者：张自强
 * 时间：20180725
 * 接口：冯丽杰
 */
function getLevelOfJf(orgId,callback){
   api.ajax({
       url:BASE_URL_ACTION+'/sys/org/getEduUnitByOrgId?random_num='+creatRandomNum()+'&org_id='+orgId,
       method:'get',
       dataType:'json',
       timeout:30,
       headers : {
    'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';' 
        }
   },function(ret,err){
        if(err){
            callback('');
        }else{
            if(ret.success){
                callback(ret.ORG_TYPE);
            }else{
                callback('');
            }
        }
   });
}
function checkLoginStatus(){
//	$api.setStorage("person_id",value);
	var _login_name = $api.val($api.byId("login_name_input"));
	var login_name = ency_(_login_name);
	login_name = login_name.replace(/\+/g,"%2B");
	var _login_pas = $api.val($api.byId("login_pas_input"));
	var login_pas = ency_(_login_pas);
	login_pas = login_pas.replace(/\+/g,"%2B");
	api.ajax({
       url:BASE_URL_ACTION+'/login/checkLoginStatus',
       method:'post',
       dataType:'json',
       timeout:30,
       data : {
       		values : {
       			"un" : login_name,
				"pd" : login_pas,
				"type" : 0,
			}
		}
   },function(ret,err){		
   		api.hideProgress();
        if(err){
            popAlert('对不起，网络繁忙，请稍候重试');
        }else{
            if(ret.success){
            	if (ret.login_status == 0 && ret.identity_id != 6){
            		var param = {
	            		login_name: ret.un_base64,
	            		login_pas: _login_pas,
	            		tel: ret.tel,
	            		person_id: ret.person_id,
	            		identity_id: ret.identity_id,
	            	};
	            	setTimeout(function (){
//	            		if (api.uiMode == "pad"){
//	            			$api.setStorage("isShowPerfectUserInfo",1);
//	            			commonOpenFrame('perfectUserInfo_ipad_window',"widget://html/login/perfectUserInfo_ipad_window.html", 0, false, false, 'rgba(0,0,0,0)', param);
//	            		}else{
	            			commonOpenWin("prefectUserInfo_window","widget://html/login/perfectUserInfo_window.html",false,true,param);
//	            		}
	            	});
            	}else if (ret.login_status == 1 || ret.identity_id == 6){
            		doLoginNew(_login_name,_login_pas);
            	}else{
            		if (ret.info){
	            		popAlert(ret.info);
	            	}else{
	            		popAlert('登录失败，请稍候重试');
	            	}
            	}
            }else{
            	if (ret.info){
            		popAlert(ret.info);
            	}else{
            		popAlert('登录失败，请稍候重试');
            	}
            }
        }
   });
}
function doLoginNew(login_name,login_pas){
	setTimeout(function (){
		commonShowProgress('登录中...',true);
		$api.val($api.byId("login_name_input"),login_name);
		$api.val($api.byId("login_pas_input"),login_pas);
		getToken(login_name +  "_" + $api.getStorage('BASE_SERVER_NAME'),login_pas);
	});
}