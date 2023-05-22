var header_h;
apiready = function(){
    header_h=api.pageParam.header_h;
	changePerson();
	var urlJson = JSON.stringify($api.getStorage('roles'));
	//$api.css($api.byId("item7"),"display:none");
	$api.css($api.byId("item10"),"display:none");
	if(urlJson.indexOf('"role_code":"YXGLJS"')<0){
	
		
		$api.css($api.byId("item8"),"display:none");
		$api.css($api.byId("item9"),"display:none");
	}
	var base_name=$api.getStorage('BASE_SERVER_NAME');
	if(base_name=="jntq"||base_name=="zztez"){
	
	
		$api.css($api.byId("item8"),"display:none");
		$api.css($api.byId("item7"),"display:none");
	}
}

function openNewWin (type) {
			api.openWin({
				name : type,
				url : './'+type+'.html',
				pageParam : {
					header_h : header_h
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
function openScanner(){
	var identity = parseInt($api.getStorage('identity'));
			var FNScanner = api.require('FNScanner');
			FNScanner.openScanner({
				autorotation : false,
				sound : 'widget://res/LowBattery.mp3'
			}, function(ret, err) {
				if (ret) {
					if (ret.eventType == "success") {
						var content = JSON.stringify(ret.content);
						var unique_mark = content.substring(1, 8);
						var url = ret.content;
						var index = url.indexOf('://');
						var wx = url.substring(index + 3, index + 9);
							if (wx == 'weixin') {
								api.alert({
									msg : '暂不支持此二维码扫描'
								});
							} else {
								notDsCode(url);
							}
						
					}
				} else {
					api.alert({
						msg : JSON.stringify(err)
					});
				}
			});
}
function notDsCode(url) {
			var Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
			//判断是否为url
			var objExp = new RegExp(Expression);
			if (objExp.test(url) == true) {
				//				api.confirm({
				//				    title: '提示',
				//				    msg:'扫描到一个地址:'+url+',是否打开此链接？',
				//				    buttons: ['是', '否']
				//				},function( ret, err ){
				//				    if( ret.buttonIndex == 1 ){
				var na=$api.getStorage("person_name");
				na=encodeURIComponent(na);
				na=encodeURIComponent(na);
				var mico = api.require('mico');
				var wlanname="";
				/*mico.getSSID(function( ret, err ){        
    				if( ret ){
    				   var urlJson = JSON.stringify(ret);
					   var txt= $api.strToJson(urlJson);*/
					  url=url+"&person_id="+$api.getStorage("person_id")+"&person_name="+na; //+"&wlan_name="+txt.ssid
					  //alert(url);
					  goError("sys_other_window", url);
  					/*}else{
        				//alert( JSON.stringify( err ) );
        				api.alert({
									msg : '获取wlan信息失败。'
						});
    				}
				});*/
				
				
				
				//				    }else{
				//				    }
				//				});
			} else {
				goError("sys_other_window", url);
			}
		}
function goError(yy_name, error) {
			api.openWin({
				name : yy_name,
				url : yy_name + '.html',
				pageParam : {
					header_h : header_h,
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
function changePerson(){
		$api.attr($api.byId("touxiang"), "src", $api.getStorage('avatar_url'));
		$api.attr($api.byId("touxiang"), "onclick","");
    	$api.text($api.byId("name"), $api.getStorage('person_name'));
    	var jigou="";
    	if($api.getStorage('bureau_name')!=undefined&&$api.getStorage('bureau_name')!='undefined'){
    		jigou=$api.getStorage('bureau_name');
    	}else if($api.getStorage('school_name')!=undefined&&$api.getStorage('school_name')!='undefined'){
    		jigou=$api.getStorage('school_name');
    	}
    	$api.text($api.byId("jigou"),jigou);
        var header = $api.byId('topbar');
        $api.fixIos7Bar(header); 
    	//var loginDiv = $api.byId("login");	
		var personDiv = $api.byId("person");	
	//	loginDiv.style.display = "none";	
		personDiv.style.display = "block";	
	}