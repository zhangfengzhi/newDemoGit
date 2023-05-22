/**
 * 打开应用功能
 * zhaoj
 * type：获取页面的路径
 * 2018.01.31
 */
function openModule(param_json) {
	isOnLineStatus(function(is_online, line_type) {
		if (is_online) {
			//验证crm权限
			if(param_json.type == 7){
				//扫一扫
				openScanner();
			}else if(param_json.type == 8){
				//互动精灵
				openHdjl();
			}else{
				var height_h = api.pageParam.header_h;
				var idy_id = $api.getStorage('idy_id');
//				if(api.uiMode == 'pad' &&( idy_id == 0 ||idy_id ==1)&&isEmptyString(param_json.mode_type)){
//					//是平板端，教师和学生角色，并且不是系统消息点击打开添加好友页面
//                  height_h = header_h-50;
//              }else{
                    height_h = header_h;
//              }
                var pageParamJson={"header_h":height_h};
                if(!isEmptyString(param_json.mode_type)){
                	pageParamJson.mode_type = param_json.mode_type
                }
                if(param_json.win_url == "wf_index_window"){
                    if($api.getStorage('BASE_APP_TYPE') == 2){
//                      if(api.uiMode == 'pad' && (idy_id != 3)){
//                          param_json.win_url = "yunkeIpad_index_window";
//                          param_json.type = 6;
//                      }else{
                            param_json.win_url = "yunke_index_window";
                            param_json.type = 3;
//                      }
                    }else{
                        if(api.systemType == "android" && ('' + api.systemVersion).substring(0,2) < 6 || api.systemType == "ios" && ('' + api.systemVersion).substring(0,2) < 10){
                            popAlert("检测到您的终端不能够支持本站的运行 ");
                            return;
                        }
                    }
                }
                
                //添加行政公文参数
				pageParamJson.menu = param_json.menu;
				pageParamJson.childMenu = param_json.childMenu;

				if(param_json.win_name == "办公"){
                    pageParamJson.from_type = 1;
                }
                if(param_json.win_name == "公文"){
                    pageParamJson.from_type = 2;
                }
                if(param_json.win_name == "公文管理"){
                    pageParamJson.from_type = 1;
                }
                if(param_json.win_name == "我的公文"){
                    pageParamJson.from_type = 2;
                }
                if(param_json.win_name == "公文查询"){
                    pageParamJson.from_type = 3;
                }
                if(!isEmptyString(param_json.mode_type)){
                	pageParamJson.mode_type = param_json.mode_type
                }

				var win_url = getWindowUrl(param_json);
				commonOpenWin(param_json.win_url, win_url, false, false, pageParamJson);
			}
		} else {
			popToast('请连接网络后使用当前功能');
		}
	});
}
/**
 * 获取window页面的url
 * zhaoj
 * type：获取页面的路径
 * 2018.01.31
 */
function getWindowUrl(param_json){
	var index = param_json.win_url.indexOf('_');
	var mode_name = param_json.win_url.substring(0, index);
	switch(param_json.type*1){
		case 0:
			return 'widget://html/module/iphone/teacher/' + mode_name + '/' + param_json.win_url + '.html';
		break;
		case 1:
			return 'widget://html/module/iphone/student/' + mode_name + '/' + param_json.win_url + '.html';
		break;
		case 2:
			return 'widget://html/module/iphone/parent/' + mode_name + '/' + param_json.win_url + '.html';
		break;
		case 3:
			return 'widget://html/module/iphone/common/' + mode_name + '/' + param_json.win_url + '.html';
		break;
		case 4:
			return 'widget://html/module/ipad/teacher/' + mode_name + '/' + param_json.win_url + '.html';
		break;
		case 5:
			return 'widget://html/module/ipad/student/' + mode_name + '/' + param_json.win_url + '.html';
		break;
		case 6:
			return 'widget://html/module/ipad/common/' + mode_name + '/' + param_json.win_url + '.html';
		break;
		case 9:
			return 'widget://html/module/common/' + mode_name + '/' + param_json.win_url + '.html';
		case 10:
			return 'widget://html/training/' + mode_name + '/index_window.html';
		break;
		case 11:
			return 'widget://html/tongxunlu/' + param_json.win_url + '.html';
		break;
		case 12:
			return 'widget://html/module/iphone/work/' + mode_name + '/' + param_json.win_url + '.html';
		break;
	}
}
/**
 * 打开互动精灵
 * zhaoj
 * 2018.01.31
 */
function openHdjl(){
	if(api.systemType == "ios") {
		popToast('该模块暂不支持苹果系统');
	} else {
		var down_url;
		if($api.getStorage('BASE_SERVER_NAME') == 'edusoa'){
			down_url = 'https://dsideal.obs.cn-north-1.myhuaweicloud.com/down/dzsb/InteractionAssistant.apk';
		}else{
			down_url = $api.getStorage('BASE_URL_ACTION') + '/html/down/dzsb/InteractionAssistant.apk';
		}
		var oparamJsonData = {"type":1000,"app_key":"com.dsideal.interactionassistant","down_url":down_url,"id":"","resource_id":""};
		//判断是否已经安装app
		common_app.appInstalled(oparamJsonData);
	}
}
/**
 * 设置通知未读消息，需要先调用一次才能算出未读通知
 * 周枫
 * 2016.10.15
 */
function setNoticeTs(callback) {
    api.ajax({
        url : BASE_URL_ACTION + '/new_notice/setNoticeTs',
        method : 'get',
        timeout : 0,
        dataType : 'json',
        data : {
            values : {
                "person_id" : $api.getStorage("person_id"),
                "identity_id" : $api.getStorage("identity")
            }
        }
    }, function(ret, err) {
        callback(true);
    });
}
/*
 *author:zhaoj
 *function:打开二维码扫面页面
 *date：20160105
 */
function openScanner(type,searchType) {
	var autorotation=true;
//	if(api.systemType == "ios" && api.uiMode == 'pad'){
//  	//在IOS系统平板端下，应用竖屏
//  	commonSetScreen(3);
//  	autorotation= false;
//  }
    commonOpenTjData($api.getStorage("identity")+'_'+"sys");//记录统计
    var identity = parseInt($api.getStorage('identity'));
    var FNScanner = api.require('FNScanner');
    FNScanner.openScanner({
        autorotation : autorotation,
        sound : 'widget://res/LowBattery.mp3'
    }, function(ret, err) {
   
    	var _url = ret.content;
    	var decode='';
    	try{
    		decode=Base64.decode(_url);
    	}catch(err){
    	}
    	
    	if (ret && ret.content && (ret.content.indexOf("pageType") != -1 || ret.content.indexOf("jump_short_url") != -1)){
    		if (ret.content.indexOf("jump_short_url") != -1){//短url访问
    			api.ajax({
	                url: $api.getStorage('BASE_URL_ACTION') + "/teach_and_learn/get_short_url/" + ret.content.slice(ret.content.lastIndexOf("/") + 1)
                },function(ret,err){
                	if (ret && ret.url && ret.url != ""){
                		_url = ret.url;
                		_param = $api.getStorage('BASE_URL_ACTION') + _url.substring(_url.indexOf("/pro_integration")) + "&from_type=app";
			    		$api.setStorage('webPageUrl',_param);
			    		$api.setStorage('isOuterOpen',false);
			            commonOpenWin('JYQueShow', 'widget://html/module/common/openWebApp/openWebAPp_window.html', false, false,{url:_param,header_h: 45,reload: true});
                	}else{
                		
                	}
                });
    		}else{//原url访问
				_param = $api.getStorage('BASE_URL_ACTION') + _url.substring(_url.indexOf("/pro_integration")) + "&from_type=app";
	    		$api.setStorage('webPageUrl',_param);
	    		$api.setStorage('isOuterOpen',false);
	            commonOpenWin('JYQueShow', 'widget://html/module/common/openWebApp/openWebAPp_window.html', false, false,{url:_param,header_h: 45,reload: true});    		
    		}
    		return;
    	}
    
//  	if(api.systemType == "ios" && api.uiMode == 'pad'){
//	    	//在IOS系统平板端下，应用横屏
//	    	commonSetScreen(5);
//	    }
        if (ret) {
            commonCloseTjData($api.getStorage("identity")+'_'+"sys");//记录统计
            if (ret.eventType == "success") {
                if(ret.content.indexOf('InnetPath') != -1 && ret.content.indexOf('GUID') != -1 && ret.content.indexOf('OutnetPath') != -1){
                    ret.content = JSON.parse(ret.content);
                    if(("http://" + $api.getStorage('BASE_SERVER_IP')).indexOf(ret.content.InnetPath) != -1 && ("http://" + $api.getStorage('BASE_SERVER_IP')).indexOf(ret.content.OutnetPath) != -1){
                        popAlert("非同一服务器用户");
                    }else{
                        var base64EncodePwd = Base64.encode(JSON.stringify({
                                       "user":$api.getStorage('login_name').substring(0,$api.getStorage('login_name').indexOf("_"+$api.getStorage("BASE_SERVER_NAME"))),
                                       "pwd": $api.getStorage('login_pad') 
                                   }));   
                        api.ajax({
                            url:BASE_URL_ACTION + '/new_base/qrCodeLogin?cname='+ret.content.GUID+'&content='+base64EncodePwd,
                            method:'get',
                            dataType:'json',
                            timeout:30,
                            headers : {
                    'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
                }
                        },function(ret,err){
                            if(err){
                               popToast("登录失败");
                            }else{
                               if(ret.success){
                                   popToast("登录成功");
                               }else{
                                   popToast("登录失败");
                               }
                            }
                        });
                    }
                }else if(decode.indexOf('硂祘Α磅') != -1){
                	var class_id=decode.split('&')[1];
                	if($api.getStorage("identity")!="6"){
                		popToast("该身份无法加入班级。");
                		return false;
                	}
                	api.ajax({
                            url:BASE_URL_ACTION + '/yx/pxclass/joinClass?class_id='+class_id+'&student_id='+$api.getStorage("person_id"),
                            method:'get',
                            dataType:'json',
                            timeout:30,
                            headers : {
			                    'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
			                }
                        },function(ret,err){
                        	if(err){
                               popAlert("加入班级失败,请检查网络连接。");
                            }else{
                               if(ret.success){
                                   popAlert("加入班级成功");
                               }else{
                                   popAlert(ret.info);
                               }
                            }
                        });
                
                }else{
                    var content = JSON.stringify(ret.content);
                    var fir_index = content.lastIndexOf('DsIdeal');
                    var last_index = content.lastIndexOf('_');
                    var unique_mark = content.substring(fir_index, fir_index+7);
                    if (unique_mark == "DsIdeal") {
                        var mode_name = content.substring(fir_index+8, last_index);
                        if(mode_name == 'wjdc'){
                            var wjdc_id = content.substring(last_index+1, content.length-1)*1;
                            setTimeout(function(){
                                checkWjdc(wjdc_id);
                            },1000)
                        }else if(type == "zcgl"){
                            commonExecScript('zcgl_index_window','zcgl_frame','showCodeContent('+content+')',1);
                        }else if (ret.content.indexOf('&=') != -1) {
                            if(type == "sxb"){
                                var friend_info_str = ret.content.substring(ret.content.lastIndexOf('&&') + 2);
                                var friend_info_attr = friend_info_str.split('&=');
                                var flogin_name = commonNewParamToOldParam(friend_info_attr[3]);
                                if(searchType == 1){
                                    commonExecScript('w_sxb_class_window','','searchStuSys("'+flogin_name+'")',0);
                                }else if(searchType == 2){
                                    commonExecScript('w_sxb_stu_window','','searchStuSys("'+flogin_name+'")',0);
                                }
                            }else{
                                openAddFriends(ret.content);
                            }
                        } else {
                            icomet(ret.content);
                        }
                    } else {
                        var url = ret.content;
                        var index = url.indexOf('://');
                        var wx = url.substring(index + 3, index + 9);
                        if (wx == 'weixin') {
                            api.alert({
                                msg : '暂不支持此二维码扫描'
                            });
                        } else {
                            //不是东师理想的二维码进行的处理
                            if(api.uiMode != 'pad'){
                                if(type == "sxb"){
                                    if(ret.content.indexOf('-') != 0){
                                        ret.content = ret.content.replaceAll('-','');
                                    }
                                    if(searchType == 1){
                                        commonExecScript('w_sxb_class_window','','searchStuSys("'+ret.content+'")',0);
                                    }else if(searchType == 2){
                                        commonExecScript('w_sxb_stu_window','','searchStuSys("'+ret.content+'")',0);
                                    }
                                    openBdFrame(1,ret.content);
                                }else{
                                    notDsCode(url);
                                }
                            }else{
                                popAlert('平板暂不支持此二维码扫描');
                            }
                        }
                    }
                }
            }else{
                if(ret.eventType == "fail"){
                    popToast('未发现本应用可识别的二维码');  
                }            
            }
        } else {
            api.alert({
                msg : JSON.stringify(err)
            });
        }
    });
}

/*
 *author:zhaoj
 *function:不是东师理想的二维码进行的相关操作
 *date：20160112
 */
function notDsCode(url) {
    var Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    //判断是否为url
    var objExp = new RegExp(Expression);
    if (objExp.test(url) == true) {
        goError("common_sys_window", url);
    } else {
        goError("common_sys_window", url);
    }
}

/*
 *author:zhaoj
 *function:点击登录按钮,向iComet中插入
 *date：20160106
 */
function icomet(code_content) {
    api.ajax({
        url : $api.getStorage("BASE_URL_ACTION") + '/biz/baiban/loginByCode?code_content=' + code_content + '&random_num=' + creatRandomNum(),
        method : 'get',
        dataType : 'json',
        cache : false,
        timeout : 30,
        headers : {
            'Cookie' : 'person_id=' + $api.getStorage("person_id") + ';identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
        }
    }, function(ret, err) {
        if (err) {
            api.toast({
                msg : '扫描失败',
                duration : 2000,
                location : 'middle'
            });
        } else {
            //                  var index = code_content.lastIndexOf('_');
            //                  var mac_addr = code_content.substring(index + 1, code_content.length);
            var mac_addr = $api.getStorage('person_id');
            $api.setStorage('mac_addr', mac_addr);
            if (ret.success) {
                api.toast({
                    msg : '扫描成功',
                    duration : 2000,
                    location : 'middle'
                });
            } else {
                api.toast({
                    msg : '扫描失败：' + ret.info,
                    duration : 2000,
                    location : 'middle'
                });
            }
        }
    });
}
/*
 *author:zhaoj
 *function:扫描二维码进入到问卷调查
 *date：20161112
 */
function checkWjdc(id){
    checkPermission(id,function(flag,ret){
        if(flag){
            if(ret.success){
                //答调查问卷
                getSurveyById(id,function(flag,data){
                    if(flag){
                    	var height_h = api.pageParam.header_h;
						var idy_id = $api.getStorage('idy_id');
//						if(api.uiMode == 'pad' &&( idy_id == 0 ||idy_id ==1)){
//							//是平板端，教师和学生角色，并且不是系统消息点击打开添加好友页面
//		                    height_h = param_json.header_h-50;
//		                }else{
		                    height_h = header_h;
//		                }
                        var pageParamJson={"header_h":height_h,"id":id,"sort":0,"name_base64":Base64.encode(data.title),"type":1};
                        	commonOpenWin('dcwj_answer_window', 'widget://html/module/iphone/common/dcwj/dcwj_answer_window.html', true, true, pageParamJson);
                    }else{
                        popToast('获取问卷统计失败，请稍候再试！');
                    }
                });
            }else{
                popCheckTip(ret.info);
            }
        }else{
            popCheckTip("");
        }
    })
}
/*
 *author:zhaoj
 *function:扫描其他二维码进入的页面
 *date：20160106
 */
function goLogin(yy_name, mac_addr) {
    api.openWin({
        name : yy_name,
        url : yy_name + '.html',
        pageParam : {
            header_h : header_h,
            mac_addr : mac_addr
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

/*
 *author:zhaoj
 *function:扫描其他二维码进入的页面
 *date：20160106
 */
function goError(yy_name, error) {
    var url='';
    var header = '';
    url = 'widget://html/common/'+yy_name + '.html';
//  if(api.uiMode == 'pad'){
//      header =  header_h - 50;
//  }else{
        header = header_h;
//  }
    api.openWin({
        name : yy_name,
        url : url,
        pageParam : {
            header_h : header,
            error : error
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

/**
 * 扫二维码打开添加好友功能
 * 周枫
 * 2016.1.23
 */
function openAddFriends(friend_info) {
    var friend_info_str = friend_info.substring(friend_info.lastIndexOf('&&') + 2);
    var friend_info_attr = friend_info_str.split('&=');
    var friend_name = friend_info_attr[0];
    var friend_id = friend_info_attr[1];
    var fidentity_id = friend_info_attr[2];
    var flogin_name = friend_info_attr[3];
    addFriend(friend_id, friend_name, false, fidentity_id, flogin_name);
}
/*
 *author:zhaoj
 *function:应用模块获取crm权限
 *date：20180103
 */
function getCrmInfoByPerson(code,callback){
	if(BASE_CRM_TYPE){
		if(isEmptyString(code)){
			callback(true,"");
		}else{
			api.ajax({
				url : BASE_URL_ACTION + '/base/crm/getCrmInfoByPerson?person_id='+$api.getStorage("person_id")+'&identity_id='+$api.getStorage("identity")+'&user_type=5&code='+code+'&plat=2&random_num='+creatRandomNum(),
				method : 'get',
				dataType : 'json',
				cache : false,
				timeout:30,
				headers : {
					'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
				}
			}, function(ret, err) {
				if(err){
					callback(false,'权限获取失败，请稍候重试');
				}else{
					if (ret.success) {
						callback(true,"");
					} else {
						callback(false,ret.result_info);
					}
				}
			});
		}
	}else{
		callback(true,"");
	}
}
