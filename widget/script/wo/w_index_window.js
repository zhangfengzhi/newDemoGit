var header_h;
var BASE_URL_ACTION;

apiready = function() {
    commonSetTheme({"level":3,"type":0});
    header_h = api.pageParam.header_h;
    BASE_URL_ACTION = $api.getStorage('BASE_URL_ACTION');
    //加载页面个人
    loadMyself();
    //初始化页面加载项目
    initItem();
}
/**
 * 打开应用Window
 * 周枫
 * 2017.05.19
 */
function openItemWin(win_name) {
    if (win_name == 'w_xyk_window') {
//      var code = "";
//      var idy_id = $api.getStorage('idy_id')*1;
//      if(idy_id == 0){
//          code = 'hbg_rcbg_xyk';
//      }else if(idy_id == 1 || idy_id == 2){
//          code = 'hsh_xyk';
//      }
//      getCrmInfoByPerson(code,function(flag,infor){
//          if(flag){
                //更换校园卡需要密码验证
                
                commonJudgeRoles(function(type){
                	if (type == 5){
	                	commonOpenWin("xyk_work_window", '../common/xyk_work/xyk_work_window.html', false, false, {
	                        'header_h' : header_h
	                    });
	                }else{
	                	checkPsd(function(is_true) {
		                    if (is_true) {
		                        //更换校园卡
		                        commonOpenWin(win_name, win_name + '.html', false, false, {
		                            'header_h' : header_h
		                        })
		                    } else {
		                        popBottomToast("对不起，登录密码不正确，不能使用校园卡功能。");
		                    }
		                });
	                }
                });
//          }else{
//              popAlert(infor);
//          }
//      });
    } else {
        commonOpenWin(win_name, win_name + '.html', false, false, {
            'header_h' : header_h
        })
    }
}

/**
 * 更换校园卡，密码验证
 * 周枫
 * 2017.05.09
 */
function checkPsd(callback) {
    api.prompt({
        title : '校园卡',
        msg : '请输入登录密码，以验证身份',
        type : 'text',
        buttons : ['确定', '取消']
    }, function(ret, err) {
        var index = ret.buttonIndex;
        var psd_text = ret.text;
        if (index == 1) {
            psd_text = $api.trimAll(psd_text);
            if (psd_text.length == 0) {
                api.alert({
                    msg : '对不起，请输入登录密码。'
                });
                return false;
            }
            var psd_app = $api.getStorage("login_pad");
            if (psd_app == psd_text) {
                callback(true);
            } else {
                callback(false);
            }
        }
    });
}

/**
 * 初始化页面加载项目
 * 周枫
 * 2017.05.19
 */
function initItem() {
    //教师显示任课计划和设置教材功能
    var identity = parseInt($api.getStorage('identity'));
    var idy_id = parseInt($api.getStorage('idy_id'));
    if (idy_id == 0) {
        $api.css($api.dom('.rkjh_li'), 'display:block;');
        $api.css($api.dom('.szjc_li'), 'display:block;');
    }
    
    if (identity == 7){
        $api.text($api.byId('integra_span'), '孩子积分');
    }
    
    $api.css($api.dom('.integra_li'), 'display:block;');
    
    var xyk_code = '';
    if($api.getStorage('identity') == 6){
       xyk_code = 'hsh_xyk'
    }
    if($api.getStorage('identity') == 5){
       xyk_code = 'hbg_xyk'
    }
//  if($api.getStorage('identity') == 5 && api.uiMode == "phone"){
        if($api.getStorage('tea_sxb') == undefined || typeof($api.getStorage('tea_sxb')) == undefined){
           var rolesArray  = $api.getStorage('roles');
            for(var i = 0; i < rolesArray.length; i++){
                if(rolesArray[i].role_id * 1 == 2){
                   getCrmInfoByPerson('dsidealxt_zbkt',function(flag,info){
                       $api.setStorage('tea_sxb',flag);
                       $api.css($api.dom('.sxb_li'), 'display:'+(flag?'block':'none')+';');
                    }); 
                }
            }   
        }else{
            $api.css($api.dom('.sxb_li'), 'display:'+($api.getStorage('tea_sxb') != "false"?'block':'none')+';');
        }
//  }
    
//  if(api.systemType == "android" && api.uiMode == "pad" && $api.getStorage('identity') == 6){
//      $api.css($api.dom('.sxb_li'), 'display:'+($api.getStorage('stu_sxb') != "false"?'block':'none')+';');
//  }
    //判断只有阿里云和辽阳项目有资讯类菜单
    if($api.getStorage('idy_type') == 'teacher'　|| $api.getStorage('idy_type') == 'student'){
       getCrmInfoByPerson(xyk_code,function(flag,info){
           if(flag){
               $api.css($api.dom('.xyk_li'), 'display:block;');
           }
        });  
    }
}

/**
 * 加载个人
 * 周枫
 * 2015.12.05
 */
function loadMyself() {
    var user = document.getElementById("user");
    user.src = $api.getStorage('avatar_url');

    //      $api.css($api.byId('user'),'background-image: url("../../image/user_defaulthead@2x.png"');
    $api.html($api.byId('name'), $api.getStorage('person_name'));

    var login_name_show = $api.getStorage('login_name_show');
    if ( typeof (login_name_show) != "undefined") {
        var login_name_ypt = login_name_show.substring(0, login_name_show.lastIndexOf("_"));
        if (login_name_ypt.lastIndexOf('@') != -1) {
            var sub_index = login_name_ypt.lastIndexOf('@');
            login_name_ypt = login_name_ypt.substring(0, sub_index);
        }
        $api.html($api.byId('login'), '账号：' + login_name_ypt);
    } else {
        api.alert({
            msg : '对不起，您当前版本需要重新登录后才能正常使用。'
        }, function(ret, err) {
            logout();
        });
    }

    //机构名称
    bureau_name = ''
    if ( typeof ($api.getStorage('bureau_name')) != 'undefined') {
        bureau_name = $api.getStorage('bureau_name');
    }
    $api.html($api.byId('bureau_name'), bureau_name);
    api.hideProgress();
}

/**
 * 注销退出
 * 周枫
 * 2015.09.07
 */
function logout() {
    api.confirm({
        title : '系统提示',
        msg : '您要退出吗？',
        buttons : ['确定', '取消']
    }, function(ret, err) {
        if (ret.buttonIndex == 1) {
            var login_qy = $api.getStorage('BASE_SERVER_QY');
            if (login_qy == '九江市金砂湾学校云平台') {
                $api.setStorage('BASE_SERVER_QY', '九江市金砂湾学校云平台');
                $api.setStorage('BASE_SERVER_NAME', 'jsw');
                $api.setStorage('BASE_SERVER_IP', '117.40.170.113:8080');
                $api.setStorage('BG_SERVER_IP', '117.40.170.113:8080');
                $api.setStorage('BASE_URL_ACTION', 'http://117.40.170.113:8080/dsideal_yy');
                $api.setStorage('BASE_APP_TYPE', 2);
            } else if (login_qy == '鄂托克前旗教育云平台') {
                $api.setStorage('BASE_SERVER_QY', '鄂托克前旗教育云平台');
                $api.setStorage('BASE_SERVER_NAME', 'etkqq');
                $api.setStorage('BASE_SERVER_IP', '124.67.65.171:8080');
                $api.setStorage('BG_SERVER_IP', '124.67.65.171:8080');
                $api.setStorage('BASE_URL_ACTION', 'http://124.67.65.171:8080/dsideal_yy');
                $api.setStorage('BASE_APP_TYPE', 2);
            }

            var uiMode = "phone";
            var idy_type = $api.getStorage('idy_type');
//          if(idy_type == 'parent'){
//              uiMode = "pad";
//          }else if( idy_type == 'work'){
//              uiMode = "phone";
//          }
            switch(uiMode) {
                case 'phone':
                    updateAllGroupMd5Null(function(is_true) {
                        //清空localStorage
                        $api.rmStorage('login_name');
                        $api.rmStorage('idy_type');
                        //清空localStorage
                        $api.rmStorage('yy_menu');
                        $api.rmStorage('tea_sxb');
                        api.setAppIconBadge({
                            badge : 0
                        });
                        //断开融云链接
                        api.sendEvent({
                            name : 'logout',
                            extra : {
                            }
                        });
                        api.openWin({
                            name : 'login',
                            url : 'widget://html/login/login_iphone_window.html',
                            scrollToTop : true,
                            bounces : false,
                            opaque : false,
                            showProgress : false,
                            vScrollBarEnabled : false,
                            hScrollBarEnabled : false,
                            slidBackEnabled : false,
                            delay : 0,
                            animation : {
                                type : "reveal", //动画类型（详见动画类型常量）
                                subType : "from_left", //动画子类型（详见动画子类型常量）
                                duration : 300
                            }
                        });
        
                    });
                    break;
//              case 'pad':
//                  //清空localStorage
//                  $api.rmStorage('login_name');
//                  //清空localStorage
//                  $api.rmStorage('yy_menu');
//                  $api.rmStorage('idy_type');
//                  //断开融云链接
//                  api.sendEvent({
//                      name : 'logout',
//                      extra : {
//                      }
//                  });
//                  break;
                default:

                    break;
            }
            getGolbalValueByKeys("common.sso,common.sso.third.login",function(flag,ret){
                console.log(JSON.stringify(ret))
                if(flag){
                     if(ret["common.sso.third.login"] == "1" && ret["common.sso"] == "1"){
                         // 对接第三方页面
                         api.execScript({
                            name:'login',
                            script: 'window.location.reload()'
                        });
                     }
                }
            })
            setTimeout(function(){
                var isAgreePrivacyPolicy = $api.getStorage("isAgreePrivacyPolicy");
            	$api.clearStorage();
            	$api.setStorage("isAgreePrivacyPolicy",isAgreePrivacyPolicy);
                commonExecScript('root','','closeGroup();',0);//关闭
            },300);
        }
    });
}

/**
 * 清空所有会话记录
 * 周枫
 * 2015.09.07
 */
function clearConversations() {
    api.confirm({
        title : '您要删除所有会话记录吗？',
        msg : '注：在会话列表页面长按会话可以删除单条会话记录',
        buttons : ['确定', '取消']
    }, function(ret, err) {
        if (ret.buttonIndex == 1) {
            api.execScript({
                name : 'root',
                frameName : 'hh_index',
                script : 'clearConversations("w_index");'
            });
            //重置数据库大小
            $api.setStorage('huanchun_'+$api.getStorage('person_id'),1);
            getDbSize();
        }
    });
}

function openCChelper() {
    var cchelper_key;
    if (api.systemType == 'ios') {
        cchelper_key = BASE_CCHELPER_KEY_IOS;
    } else {
        cchelper_key = BASE_CCHELPER_KEY_ANDROID;
    }
    api.confirm({
        title : '您确定发起远程协助吗？',
        msg : '注：打开远程协助后您可以直接和客服人员语音沟通，如需要，可以帮您远程共享手机解决问题',
        buttons : ['确定', '取消']
    }, function(ret, err) {
        if (ret.buttonIndex == 1) {
            var cchelper = api.require('cchelperModule');
            cchelper.start({
                //应用的注册用户ID，如果没有可用为空
                userId : "",
                //领通科技CChelper SDK平台为应用生产的appKey，不可以为空
                appKey : cchelper_key
            }, function(ret, err) {
                //      if(err) {
                //          switch(ret.status){
                //              case 0:
                //                  api.alert({
                //                      msg : '远程服务失败，服务appKey不能为空'
                //                  },function(ret,err){
                //                      cchelper.stop();
                //                  });
                //              break;
                //              case 2:
                //                  api.alert({
                //                      msg : '远程服务失败，' + err.errorMsg
                //                  },function(ret,err){
                //                      cchelper.stop();
                //                  });
                //              break;
                //              case 3:
                //                  api.alert({
                //                      msg : '远程服务失败，' + err.errorMsg
                //                  },function(ret,err){
                //                      cchelper.stop();
                //                  });
                //              break;
                //          }
                //      }
                //                      alert(JSON.stringify(ret) + JSON.stringify(err));
            });
        }
    });

}

/**
 * 获取头像图片
 * 周枫
 * 2016.1.14
 */
function getPicture() {
    api.confirm({
        title : "提示",
        msg : "手机端请选择一张照片作为您的通知附件",
        buttons : ["现在照", "相册选", "取消"]
    }, function(ret, err) {
        //定义图片来源类型
        var sourceType;
        if (1 == ret.buttonIndex) {/* 打开相机*/
            sourceType = "camera";
            openPicture(sourceType);
        } else if (2 == ret.buttonIndex) {
            sourceType = "album";
            openPicture(sourceType);
        } else {
            return;
        }
    });
}

/**
 * 修改个人
 * 周枫
 * 2016.1.14
 */
function changePersonInfo() {
    api.ajax({
        url : BASE_URL_ACTION + '/ypt/personal/changePersonInfo',
        method : 'get',
        dataType : 'json',
        cache : false,
        timeout:30,
        headers : {
            'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
        }
    }, function(ret, err) {
        if (ret.success) {

        } else {
            api.alert({
                msg : '对不起，获取通知列表失败'
            });
        }
    });
}

/**
 * 打开我的页面
 * 周枫
 * 2016.1.15
 */
function openLxHelper() {
    api.openWin({
        name : 'w_info_window',
        url : '../../html/wo/w_help_window.html',
        bounces : true,
        delay : 0,
        scrollToTop : true,
        allowEdit : true,
        slidBackEnabled : false,
        scaleEnabled : false,
        animation : {
            type : "reveal", //动画类型（详见动画类型常量）
            subType : "from_right", //动画子类型（详见动画子类型常量）
            duration : 300
        },
        pageParam : {
            'header_h' : header_h
        }
    });
}
/**
 * 打开个人信息页面
 * zhaoj
 * 2018.02.01
 */
function openMyInfo() {
    commonOpenWin('w_info_window', 'w_info_window.html', false, false, {'header_h' : header_h});
}

function loadHelp() {
    api.alert({
        title : '理想客服',
        msg : '尊敬的用户您好，如果您在使用过程中遇到问题，请加入QQ客服群：528680962，会有技术人员为您解答。',
        buttons : ['关闭']
    });
}

function callBack(ret, err) {
}