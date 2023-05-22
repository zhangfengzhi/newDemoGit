function openWebPage(ret,err,isJump){
    if (ret){
        var _param = "";
        for (var ii = 0; ii < 26; ii++){
            var index = String.fromCharCode(65 + ii);
            index = index.toLocaleLowerCase();
            if (ret.appParam[index]){
                _param = _param + index + "=" + ret.appParam[index] + "&";
            }else{
                break;
            }
        }
        _param = $api.getStorage('BASE_URL_ACTION') + '/pro_integration/project/lxxt/plugInHtml/PluginForC/index.html?'+_param + "&useBaseInterface=0&from_type=app";
        $api.setStorage('webPageUrl',_param);
        if ( !isEmptyString($api.getStorage('login_name')) && !isEmptyString($api.getStorage('idy_type')) && isJump != 1) {
            $api.setStorage('isOuterOpen',false);
            commonOpenWin('JYQueShow', 'widget://html/module/common/openWebApp/openWebAPp_window.html', false, false,{url:_param,header_h: 45,reload: true});
        }else{
            $api.setStorage('isOuterOpen',true);
        }
    }
}

function addAppintentEvent(callback){
	api.addEventListener({
	    name:'appintent'
	}, function(ret, err){
		if (ret && ret.appParam){
			if (ret.appParam.isFromPush){
				console.log("点击通知栏推送消息")
			}else if (ret.appParam.a){
				openWebPage(ret,err);
			}
			console.log(ret.appParam.userName)
		    if(ret.appParam.userName){
              user_name_from_outside = ret.appParam.userName;
              password_from_outside = "DsideaL4r5t6y7u8i9o";
            }
		}
	});
};

function openWebPageWin(){
    setTimeout(function (){
        if ($api.getStorage('isOuterOpen') == 'true'){
            $api.setStorage('isOuterOpen',false);
            commonOpenWin('JYQueShow_window', 'widget://html/module/common/openWebApp/openWebAPp_window.html', false, false,{header_h: 45});
        }
    },1000);
}
