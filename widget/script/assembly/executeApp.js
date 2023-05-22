/* 封装了对app安装操作的接口,  下载、安装、打开第三方APP 2016.12.26 周枫 
*param:type=1:游戏；type=2：专题；type=3：学案 ；type=1000：互动精灵,type=7:电子书,type=8:swf动画
*/

var common_app = {
	//判断设备上面是否已安装指定应用
	appInstalled : function(oparamJsonData) {
			api.appInstalled({
				appBundle : oparamJsonData.app_key
			}, function(ret, err) {
				if (ret.installed) {
					//专题的话，添加专题动态
					if(oparamJsonData.type == 2){
						saveResultRecord();//记录学习了专题动态
					}
					//应用已安装
					common_app.getPlayUrl(oparamJsonData);
				} else {
					//应用未安装
					if(oparamJsonData.type == 1000){
	                	popTwoBtnConfirm("提示", "运行该应用需要安装东师理想互动精灵，您尚未安装，是否现在下载并安装？安装完成后，需要在人人通重新点击互动精灵应用进入。", "common_app.installApp('"+JSON.stringify(oparamJsonData)+"')");
	                }else{
	                	popTwoBtnConfirm("提示", "运行该文件需要安装东师理想播放器，您尚未安装，是否现在下载并安装？安装完成后，需要重新点击进行学习。", "common_app.installApp('"+JSON.stringify(oparamJsonData)+"')");
	                }
				}
			});
	},
	//获取播放的url以及参数
	getPlayUrl :function(oparamJsonData) {
		var app_param = {};
		if(oparamJsonData.type == 1000){
			app_param["a_href"] = "interass://openapp?where=rrt&person="+$api.getStorage('person_name')+"&personid="+$api.getStorage('person_id')+"&user="+commonNewParamToOldParam($api.getStorage('login_name'))+"&pwd="+$api.getStorage('login_pad')+"&identityid="+$api.getStorage('identity')+"&ip_address="+$api.getStorage('BASE_SERVER_IP')+"&class_id="+$api.getStorage('class_id');
		}else{
			//游戏和专题
			var identity_id = $api.getStorage('identity');
	        var person_id = $api.getStorage('person_id');
	        var http_url = $api.getStorage('BASE_HTTP')+$api.getStorage('BASE_SERVER_IP');
	        var class_id = $api.getStorage('class_id');
	        var token = $api.getStorage('token_ypt');
	        var resource_id = oparamJsonData.resource_id;
	        var zy_type = oparamJsonData.type;
	        var id = oparamJsonData.id;  
	        var pt_type = $api.getStorage('BASE_APP_TYPE');    
	        if(api.systemType == "ios"){
	        	app_param["identity_id"] = Base64.encode(identity_id);
		        app_param["person_id"] = Base64.encode(person_id);
		        app_param["class_id"] = Base64.encode(class_id);
		        app_param["token"] = Base64.encode(token);
		        app_param["resource_id"] = Base64.encode(resource_id);
		        app_param["id"] = Base64.encode(id);
		        app_param["zy_type"] = Base64.encode(zy_type);
		        app_param["http_url"] = Base64.encode(http_url);
		        app_param["pt_type"] = Base64.encode(pt_type);
		        if(zy_type == 7){
		          app_param["http_url"] = Base64.encode('http://www.edusoa.com');
		          app_param["pt_type"]  =Base64.encode(1);
		        	//电子书，多添加一个参数dsbook_info
		        	app_param["dsbook_info"] = oparamJsonData.dsbook_info;
		        }
	        }else{
	        	if(zy_type == 7){
	        		//电子书，多添加一个参数dsbook_info
	        		http_url = 'http://www.edusoa.com';
	        		pt_type = 1;
	        		app_param["a_href"] = "dsideal://zybfq/openapp?http_url="+http_url+"&id="+id+"&token="+token+"&zy_type="+zy_type+"&class_id="+class_id+"&person_id="+person_id+"&resource_id="+resource_id+"&identity_id="+identity_id+"&pt_type="+pt_type+'&dsbook_info='+oparamJsonData.dsbook_info;
	        	}else{
	        		app_param["a_href"] = "dsideal://zybfq/openapp?http_url="+http_url+"&id="+id+"&token="+token+"&zy_type="+zy_type+"&class_id="+class_id+"&person_id="+person_id+"&resource_id="+resource_id+"&identity_id="+identity_id+"&pt_type="+pt_type;
	        	}
	        };
		}
		common_app.openApp(oparamJsonData, app_param);
	},
	//打开手机上其它应用，可以传递参数
	openApp : function(oparamJsonData, app_param) {
		var app_type = api.systemType;
		if (app_type == "ios") {
			api.openApp({
				iosUrl : oparamJsonData.app_key,//目标应用的url（iOS平台使用），iOS下必传,URL Scheme
				appParam : app_param//传给目标应用的参数。iOS 平台会将 appParam 里面的值拼接到 iosUrl 后面；JSON 对象
			});
		} else {
			//alert('打开apk的完整路径 = '+app_param.a_href);
			window.location.href = app_param.a_href;
		}
	},
	//安装应用，如果是苹果的AppStore应用地址，将会跳转到AppStore应用详情页面
	installApp : function(oparamJsonData) {
		jsonData = JSON.parse(oparamJsonData);
		if(api.systemType == "ios"){
			api.openApp({
                iosUrl : jsonData.down_url,
            }, function(ret, err) {
            });
		} else {
			showSelfProgress("下载中...");
			api.download({
			    url: jsonData.down_url,
			    savePath: BASE_FS_ZYAPP_PATH+creatRandomNum()+'.apk',
			    report: true,
			    cache: true,
			    allowResume: true
			}, function(ret, err) {
			    if (ret.state == 1) {
			        //下载成功
			        api.hideProgress();
			        var path = ret.savePath;
			        api.installApp({
						appUri : path//目标应用的资源文件标识。Android上为apk包的本地路径，如file://xxx.apk；iOS上为应用安装包对应的plist文件地址
					});
			    } else {
			    }
			});
		}
	},
	
};
