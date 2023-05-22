/*
* 把所有的融云类的处理全部放在消息列表页，然后通过APICloud的api.sendEvent和api.addEventListener 来处理融云的一些事件。
记住除了消息列表页其他页面不要做融云的任何链接处理
*/
//定义融云
var rong;
//内容高度
var rect_h;
//header高度
var header_h;
//是否后台状态，后台值为1，前台为0
//var is_ht = 0;
var is_fir = 0;
//发送图片数组
//var send_img_attrs;
//当前会话所属人
var owner_id;
//是否在线
var is_online;
//图片组件
var obj_scan;
var BASE_URL_ACTION;
//从哪个页面打开index
var from_html = '';
//var swipe;
apiready = function() {
	commonSetTheme({"level":2,"type":0});
	//	api.showProgress({
	//				title : '加载中...',
	//				modal : false
	//			});
	rect_h = api.pageParam.rect_h;
	header_h = api.pageParam.header_h;
	from_html = api.pageParam.from_html;
	BASE_URL_ACTION = $api.getStorage('BASE_URL_ACTION');
	owner_id = $api.getStorage('login_name_rong');
	//	send_img_attrs = [];
	//加载融云模块
	rong = api.require('rongCloudIM');
	obj_scan = api.require('UIAlbumBrowser');
	isOnLine();

	if (from_html == 'login_html') {
		if (is_fir == 0) {
			api.showProgress({
				title : '数据初始化...',
				text : '请稍候...',
				modal : true
			});
		}
		from_html = '';
		//获取人员数据
		dbOpenDb(function(is_open) {
			if (is_open) {
				//融云初始化
				rongCloud();
			}
		});
	} else {
		if (is_fir == 0) {
			api.showProgress({
				title : '加载中...',
				text : '请稍候...',
				modal : false
			});
		}
		dbOpenDb(function(is_true) {
			if (is_true) {
				//融云初始化
				rongCloud();
			}
		});
	}

	//监听来自会话页面发送消息的事件
	api.addEventListener({
		name : 'sendMessage'
	}, function(ret) {
		if (ret && ret.value) {
			var value = ret.value;
			switch(value.type) {
				case 'text':
					sendMessage('' + value.type + '', '' + value.targetId + '', '' + value.content + '', '' + value.contentOld + '', '' + value.extra + '', '' + value.conversationType + '');
					break;
				case 'pic':
					//判断是照相还是选择，选择是数组，照相是一个
					switch(value.pic_source) {
						case 'camera':
							sendPicture(0, value.targetId, value.imgSrc, value.extra, value.conversationType, function(is_true) {

							});
							break;
						case 'album':
							//							alert('123' + JSON.stringify(value));
							var img_list = value.img_list;
							if (api.systemType == 'android') {
								//递归发送图片
								reImgTransPaths(0, value.targetId, value.img_list, value.extra, value.conversationType);
								//								sendPictureAttr(0, value.targetId, value.img_list, value.extra, value.conversationType);
							} else {
								//递归处理图片真实路径
								reImgTransPaths(0, value.targetId, value.img_list, value.extra, value.conversationType);
							}
							break;
					}
					break;
				case 'voi':
					sendVoice('' + value.targetId + '', '' + value.voicePath + '', '' + value.duration + '', '' + value.extra + '', '' + value.conversationType + '');
					break;
			}
		}
	});

	//监听来自会话页面获取历史会话的事件
	api.addEventListener({
		name : 'getHistory'
	}, function(ret) {
		if (ret && ret.value) {
			var value = ret.value;
			getHistoryMessagesById(value.type, value.target_id, value.old_msg_id, value.msg_count);
		}
	});

	//监听来自通讯录页面获取最新会话id的事件
	api.addEventListener({
		name : 'getOldMessageId'
	}, function(ret) {
		if (ret && ret.value) {
			var value = ret.value;
			getLatestMessagesById(value.conver_type, value.target_id, value.count, function(mes_list) {
				var old_msg_id = -1;
				if (mes_list == "") {
					mes_list = [];
					if (getJsonObjLength(mes_list) != 0) {
						old_msg_id = mes_list[0].messageId;
					}
				}

				//发送target_id获取最新会话id
				api.sendEvent({
					name : 'setOldMessageId',
					extra : {
						old_msg_id : old_msg_id
					}
				});
			});

		}
	});

	//监听来注销页面的事件
	api.addEventListener({
		name : 'logout'
	}, function(ret) {
		logoutRongCloud();
	});

	//检查连接状态
	//	setInterval(function() {
	//		getConStatus();
	//	}, 10000);

	//监听进入后台时
	api.addEventListener({
		name : 'pause'
	}, function(ret, err) {
		showUnreadCount();
	});
	//监听程序返回前台时
	//		api.addEventListener({
	//			name : 'resume'
	//		}, function(ret, err) {
	//			is_ht = 0;
	//			//返回后清空消息提示
	//			api.cancelNotification({
	//				id : -1
	//			});
	//		});

	//系统消息未读使用
	//	var messages = Math.floor((Math.random()*10)+1);
	//	document.getElementById("messages").innerHTML = messages;
	setTimeout(function() {

	}, 2000);

}
//是否是首页还是会话页面获取消息的flag
var is_index = 'index';
/*
 * 打开会话页面
 * 周枫
 * 2015-08-03
 */
function openHhList(target_id, old_msg_id, person_name, conver_type, h_from, avatar_url) {
	is_index = 'frame';
	api.openWin({
		name : 'hh_chat_window',
		url : 'hh_chat_window.html',
		bounces : false,
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
			'targetId' : target_id,
			'old_msg_id' : parseInt(old_msg_id),
			'conver_type' : conver_type,
			'person_name' : person_name,
			'header_h' : header_h,
			'conver_type' : conver_type,
			'h_from' : h_from,
			'avatar_url' : avatar_url
		}
	});
	$api.addEvt($api.byId('back'), 'click', function() {
		api.closeWin();
	});
}

/**
 * 打开消息列表页面
 * 周枫
 * 2015.08.17
 */
function openNewsList() {
	api.openWin({
		name : 'xx_index_window',
		url : 'xx_index_window.html',
		bounces : true,
		delay : 0,
		animation : {
			type : "reveal", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300
		},
		scrollToTop : true,
		pageParam : {
			'header_h' : header_h
		}
	});
}

/*
 * 融云初始化
 * 周枫
 * 2015-08-03
 */
function rongCloud() {
	//开始轮询
	//	sub();
	var token = $api.getStorage('mytoken');
	return
	//融云初始化
	rong.init({'miPush':{
				appId: '2882303761518223696',
	    		appKey: '5471822347696'
	    	},
	    	'huaweiPush': true
	},function(ret, err) {
		if (ret.status == 'error') {
			api.toast({
				msg : '会话服务器连接失败，请检查服务器网络配置'
			});
			//			api.alert({
			//				msg : '当前网络不可用，请检查你的网络设置'
			//			}, function(ret, err) {
			//
			//			});

			//						openNoticeLogout('初始化失败，请检查网络后重新登录');
		} else {
			//监听新消息
			receiveMessageListener();
			//连接
			rong.connect({
				token : '' + token + ''
			}, function(ret, err) {
				if (ret.status == 'success') {
					//消息列表
					setTimeout(function() {
						getCoversationList();
					}, 300);
				} else {
					var err_code = err.code;
					switch(err_code) {
						case 31004:
							openNoticeLogout('身份认证失败,请检查网络状况后重新登录');
							break;
						case -1000:
							setTimeout(function() {
								getCoversationList();
							}, 300);
							break;
						case 34001:
							//删除会话失败提示
							setTimeout(function() {
								getCoversationList();
							}, 300);
							break;
						default:
							setTimeout(function() {
								getCoversationList();
							}, 300);
							break;
					}
				}
			});
		}
	});

}

function isOnLine() {
	api.addEventListener({
		name : 'isOnline'
	}, function(ret) {
		is_online = ret.value.data;
		if (is_online == 1) {
			var jsfun = 'setTitle("会话");';
			api.execScript({
				name : 'root',
				script : jsfun
			});
		} else {
			//			var jsfun = 'setTitle("会话(未连接)");';
			//			api.execScript({
			//				name : 'root',
			//				script : jsfun
			//			});
		}
	});
}

/**
 * 监听当前app是否连接网络
 * 周枫
 * 2015.09.09
 */
//function alertOffLine() {
//	api.addEventListener({
//		name : 'isOnline'
//	}, function(ret) {
//		api.alert({
//			msg : ret
//      },function(ret,err){
//      	//coding...
//      });
//	});
//}

/*
 * 监听新消息
 当有新消息传来时，利用sendEvent发出一个事件，同时传递消息内容，可以在会话页面进行一次监听接收
 * 周枫
 * 2015-08-03
 */

function receiveMessageListener() {
	rong.setOnReceiveMessageListener(function(ret, err) {
		if (ret) {
			//		api.alert({
			//									msg : 'list_json3333,' + JSON.stringify(ret)
			//								});
			//存如数据库前对数据进行相关处理
			try{
				var extraStr = JSON.parse(ret.result.message.content.extra);
				if (ret.result.message.conversationType == 3 && extraStr.isMessage ){
					ret.result.message.conversationType = "SYSTEM";
					var index = ret.result.message.targetId.indexOf("_sysmsg");
					if (index > 0){
						ret.result.message.targetId = ret.result.message.targetId.substring(0,index);
					}
				}
				
			}catch(err){
				console.log("处理消息数据失败！")
			}
			
			receiveRongMsgToDbBefore(ret, function(msg_info, img_path) {
				//发送事件
				api.sendEvent({
					name : 'getNewMessage',
					extra : {
						data : msg_info.result.message,
						img_path : img_path
					}
				});
				if (is_index == 'index') {
					getCoversationList();
				}
			});

			//			if (ret.result.message.objectName == 'RC:TxtMsg' && ret.result.message.conversationType == 'SYSTEM') {
			//				//判断系统消息是否是群组操作
			//				var mes_text = ret.result.message.content.text;
			//
			//				var mes_str = '<a href=\"javascript:reloadTxlData(';
			//				var mes_reload = mes_text.indexOf(mes_str);
			//				if (mes_reload != -1) {
			//					var mes_group_id_begin = mes_reload;
			//					var mes_group_id_end = mes_text.indexOf(');\">');
			//					var mes_group_id = mes_text.substring(mes_group_id_begin + mes_str.length, mes_group_id_end);
			//					var mes_arrs = mes_group_id.split(',');
			//					if (mes_arrs.length != 0) {
			//						//执行刷新群组
			//						reloadTxlData(mes_arrs[0], mes_arrs[1]);
			//					}
			//
			//				}
			//			}

			//如果后台运行的时候，则提示新的消息
			//升级融云2之后废弃
			//			if (is_ht == 1 && api.systemType == 'android') {
			//				var mes_obj = ret.result.message.objectName;
			//				var noti_msg = '您有一条新的消息，请注意查收';
			//				switch(mes_obj) {
			//					case 'RC:VcMsg':
			//						noti_msg = '您有一条新的[语音]消息，请注意查收';
			//						break;
			//					case 'RC:TxtMsg':
			//						noti_msg = '您有一条新的[文本]消息，请注意查收';
			//						break;
			//					case 'RC:ImgMsg':
			//						noti_msg = '您有一条新的[图片]消息，请注意查收';
			//						break;
			//				}
			//				notificationMessage(noti_msg);
			//			}

			//			api.alert({
			//				msg:'receiveMessageListener'+is_index
			//		  },function(ret,err){
			//		  	//coding...
			//		  });
			//是否是首页还是会话页面获取消息的flag，首页时刷新会话列表，会话页面时不刷新
		}
	})
}

/*
 * 获取会话消息列表
 * 周枫
 * 2015-08-03
 */
function getCoversationList() {

	//	var cur_type = parseInt($api.getStorage('cur_index_tab'));
	//	api.alert({
	//		msg : cur_type
	//  },function(ret,err){
	//  	//coding...
	//  });
	//	if (cur_type != 1) {
	//		api.execScript({
	//			name : 'root',
	//			frameName : 'txl_index',
	//			script : 'hideMyself();'
	//		});
	//	}
	//	isExistDb(function(is_have) {
	//		if (is_have) {
	//			if (is_fir == 0) {
	//				api.showProgress({
	//					title : '加载中...',
	//					modal : false
	//				});
	//			}
	loadHhData(function(){
		getConversationListFromDb(function(list_json) {
			if (is_fir == 0) {
				api.hideProgress();
				is_fir++;
			}
			beforeRender(list_json);
			//渲染页面
			var html_type = template.render('hhlist_script', list_json);
			document.getElementById('hhlist_div').innerHTML = html_type;
			api.hideProgress();
			//绑定删除左滑
	//		api.parseTapmode();
	//		swipe = new ListSwipe();
			//获取未读消息显示右上角
			showUnreadCount();
					var aui_img = $api.domAll('.aui-user-view-cell');
			//如果之前有系统消息，需要改成从1开始循环，去掉系统消息
					for (var i = 0; i < aui_img.length; i++) {
						(function(i) {
							var id = $api.attr(aui_img[i], "id");
							//长按删除，3秒
							var myHanmer = new Hammer($api.byId(id));
							myHanmer.on("press", function(e) {
								api.confirm({
									title : "提示",
									msg : "确认删除当前会话吗？",
									buttons : ["确定", "取消"]
								}, function(ret, err) {
									if (1 == ret.buttonIndex) {
										clearMessageById($api.attr(myHanmer.input.target, 'id'), $api.attr(myHanmer.input.target, 'alt'));
									}
								});
							});
							//解决滑动进入会话页面问题
	//						$api.byId(id).addEventListener("click", function(event) {
	//							event.preventDefault();
	//							var t = $api.val($api.byId('targetId' + id));
	//							var l = $api.val($api.byId('latestMessageId' + id));
	//							var p = $api.val($api.byId('person_name' + id));
	//							var c = $api.val($api.byId('conversationType' + id));
	//							var h = $api.val($api.byId('hh_index' + id));
	//							var a = $api.val($api.byId('avatar_url' + id));
	//							//打开会话页面
	//							openHhList(t, l, p, c, h, a);
	//						});
			
						})(i);
					}
		});
	});
}

/**
 *  获取某一会话的最新消息记录
 */
function getLatestMessagesById(conver_type, target_id, count, callback) {
	getLatestHistoryMessageInfoFromDb(conver_type, target_id, count, function(ret) {
		if (ret.status == "success") {
			callback(ret.result);
		} else {
			api.toast({
				msg : '获取某一会话的最新消息记录失败'
			});
		}
	});
	//	rong.getLatestMessages({
	//		conversationType : conver_type,
	//		targetId : target_id + '',
	//		count : parseInt(count)
	//	}, function(ret, err) {
	//		if (ret.status == "success") {
	//			callback(ret.result);
	//		} else {
	//			api.toast({
	//				msg : '获取某一会话的最新消息记录失败'
	//			});
	//			//			api.alert({
	//			//				msg : '获取某一会话的最新消息记录失败'
	//			//			});
	//		}
	//	})
}

/**
 * 获取历史聊天记录
 * 周枫
 * 2015.08.20
 */
function getHistoryMessagesById(conver_type, target_id, old_msg_id, msg_count) {
	//		api.alert({
	//			msg : 'getHistoryMessages' + conver_type + ',' + target_id + ',' + old_msg_id + ',' + msg_count
	//	  },function(ret,err){
	//	  	//coding...
	//	  });
	getHistoryMessagesFromDb(conver_type, target_id, old_msg_id, msg_count, function(hh_history_list) {
		if (hh_history_list.status == 'success') {
			//			alert('111:' + JSON.stringify(hh_history_list));
			if(hh_history_list.result.length > 0){
			     for(var i=0;i<hh_history_list.result.length;i++){
			         if(hh_history_list.result[i].content != null && typeof(hh_history_list.result[i].content) != undefined){
			             if(hh_history_list.result[i].content.text != null && typeof(hh_history_list.result[i].content.text) != undefined){
			                 if(hh_history_list.result[i].content.text.indexOf('face<img src=../../image/emotion') != -1){
			                     hh_history_list.result[i].content.text = hh_history_list.result[i].content.text.replace('face<img src=../../image/emotion','<img src=../../image/emotion');   
			                 }
			             }
			         }
			     }
			}
			isOnLineStatus(function(is_online, line_type) {
				if (is_online) {
					setRongClearMessagesUnreadStatus(conver_type, target_id, function(is_true) {
						if (is_true) {
							api.sendEvent({
								name : 'setHistory',
								extra : {
									data : hh_history_list.result
								}
							});
						}
					});

				} else {
					api.sendEvent({
						name : 'setHistory',
						extra : {
							data : hh_history_list.result
						}
					});
				}
			});

		} else {
			api.toast({
				msg : '对不起，获取历史会话失败'
			});
		}
	});

	//	rong.getHistoryMessages({
	//		conversationType : conver_type,
	//		targetId : target_id,
	//		oldestMessageId : parseInt(old_msg_id),
	//		count : msg_count
	//	}, function(ret, err) {
	//
	//		if (ret.status == 'success') {
	//			alert('222:' + JSON.stringify(ret.result));
	//			api.sendEvent({
	//				name : 'setHistory',
	//				extra : {
	//					data : ret.result
	//				}
	//			});
	//		} else {
	//			api.toast({
	//				msg : '对不起，获取历史会话失败'
	//			});
	//		}
	//	})
}

function setRongClearMessagesUnreadStatus(conver_type, target_id, callback) {
	rong.clearMessagesUnreadStatus({
		conversationType : conver_type,
		targetId : target_id
	}, function(ret, err) {
		if (ret.status == 'success') {
			callback(true);
		}
	})
}

/*
 *发送消息的函数
 注意要放在消息列表页，不要放在会话页面
 在会话页面利用sendEvent发出一个发送消息的事件，在消息列表页监听
 * 周枫
 * 2015-08-03
 */
function sendMessage(type, targetId, content, contentOld, extra, conversationType) {
	//			api.alert({
	//				msg: 'type:'+type+',targetId:'+targetId+',content:'+content+',conversationType:'+conversationType
	//		  },function(ret,err){
	//		  	//coding...
	//		  });
	$api.setStorage('huanchun_'+$api.getStorage('person_id'),0);
	rong.sendTextMessage({
		conversationType : '' + conversationType + '',
		targetId : '' + targetId + '',
		text : '' + contentOld + '',
		extra : '' + extra + ''
	}, function(ret, err) {
		//		api.alert({
		//				msg : 'ret'+JSON.stringify(ret)
		//          },function(ret,err){
		//          	//coding...
		//          });
		//          api.alert({
		//				msg : 'err'+JSON.stringify(err)
		//          },function(ret,err){
		//          	//coding...
		//          });
		if (ret.status == 'prepare') {
			//替换空格<br>
			//			content = content.replaceAll('<br>', ' ');
			ret.result.message.content.text = content;

			//单聊准备发送，向会话页面发送正在发送消息事件
			api.sendEvent({
				name : 'insertSendMessage',
				extra : {
					data : ret.result
				}
			});
			//存入会话数据库
			sendMessageToDb(ret.result.message);
		} else if (ret.status == 'success') {

			var msg_id = ret.result.message.messageId;
			api.execScript({
				name : 'hh_chat_window',
				frameName : 'hh_chat_frame',
				script : 'removeload(' + msg_id + ',\'\');'
			});
			//修改会话发送状态
			setTimeout(function() {
				updateMsgsentStatusToDb(msg_id, targetId, 'SENT');
				//成功后处理 10.30 注释原因：返回统一刷新
				getCoversationList();
			}, 300);

		} else if (ret.status == 'error') {
			//			api.alert({
			//				msg : err.code
			//			}, function(ret, err) {
			//				//coding...
			//			});
			var err_code = err.code;
			switch(err_code) {
				case 30014:
					//					openNoticeLogout('服务器不可用,请检查网络状况后重新登录');
					api.toast({
						msg : '对不起，发送失败，请重新连接网络后再次发送'
					});
					//					api.alert({
					//						msg : '对不起，发送失败'
					//					});
					break;
				case 30003:
					api.toast({
						msg : '对不起，发送失败，服务器超时'
					});
					//					api.alert({
					//						msg : '对不起，发送失败，服务器超时'
					//					});
					break;
				case 31009:
					api.toast({
						msg : '对不起，发送失败，您在对方黑名单中'
					});
					//					api.alert({
					//						msg : '对不起，发送失败，您在对方黑名单中'
					//					});
					break;
				case -10000:
					api.toast({
						msg : '对不起，发送失败，请重新连接网络后再次发送'
					});
					//					api.alert({
					//						msg : '对不起，发送失败，未调用 init 方法进行初始化'
					//					});
					break;
				case -10001:
					api.toast({
						msg : '对不起，发送失败，请重新连接网络后再次发送'
					});
					//					api.alert({
					//						msg : '对不起，发送失败，未调用 connect 方法进行连接'
					//					});
					break;
				case -10002:
					api.toast({
						msg : '对不起，发送失败，请重新连接网络后再次发送'
					});
					//					api.alert({
					//						msg : '对不起，发送失败，输入参数错误'
					//					});
					break;
				case 22406:
					api.alert({
						msg : '对不起，当前群组已经解散'
					}, function(ret, err) {
						api.execScript({
							name : 'hh_chat_window',
							frameName : 'hh_chat_frame',
							script : 'closeUiChatBox();'
						});
					});

					break;
				default :
					api.toast({
						msg : '对不起，发送失败，请重新连接网络后再次发送'
					});
					break
			}
			var msg_id = ret.result.message.messageId;
			//修改会话发送状态
			setTimeout(function() {
				updateMsgsentStatusToDb(msg_id, targetId, 'FAILED');
			}, 300);
		}
	});
}

function reImgTransPaths(p_c, target_id, img_attrs, extra, conversationType) {
	if (p_c < img_attrs.length) {
		obj_scan.transPath({
			path : img_attrs[p_c].path
		}, function(ret) {
			var imagePath = ret.path;
			//图片缓存本地
			//			imageCache(imagePath, '', function(native_path) {
			sendPicture(p_c, target_id, imagePath, extra, conversationType, function(is_true) {
				if (is_true) {
					p_c++;
					return reImgTransPaths(p_c, target_id, img_attrs, extra, conversationType);
				}
			});
			//			});
		});
	}
}

/**
 * 发送图片消息
 * 周枫
 * 2015.08.11
 * @param {Object} sendMsg
 */
function sendPicture(p_c, target_id, img_url, extra, conversationType, callback) {
	//	$api.rmStorage('send_img_attrs');
	//	api.alert({
	//		msg : JSON.stringify(img_attrs)
	//	}, function(ret, err) {
	//		//coding...
	//	});
	rong.sendImageMessage({
		conversationType : conversationType,
		targetId : target_id,
		imagePath : img_url,
		extra : extra
	}, function(ret, err) {
		if (ret.status == 'prepare') {

			var img_cache = ret.result.message.content.imageUrl;
			//			imageCache(img_cache, '', function(native_path) {
			//单聊准备发送，向会话页面发送正在发送消息事件
			api.sendEvent({
				name : 'insertSendMessage',
				extra : {
					data : ret.result,
					img_url : img_cache
				}
			})
			ret.result.message.content.nativePath = img_cache;
			//存入会话数据库
			sendMessageToDb(ret.result.message);

			//			});
		} else if (ret.status == 'progress') {
			//			var msg_id = ret.result.message.messageId;
			//			var msg_pro = ret.result.progress;
			//			api.execScript({
			//				name : 'hh_chat_window',
			//				frameName : 'hh_chat_frame',
			//	            script: 'setSendProgress('+msg_id+','+msg_pro+');'
			//          });
			//			api.sendEvent({
			//					name : 'sednImgPropress',
			//					extra : {
			//						msg_id : msg_id,
			//						msg_pro : msg_pro
			//					}
			//				})
			//
		} else if (ret.status == 'success') {
			var msg_id = ret.result.message.messageId;
			getPicHttpPathByRongHis(msg_id, conversationType, target_id, function(is_true, data) {
				if (is_true) {
					var native_path = data[0].content.imageUrl;
					api.execScript({
						name : 'hh_chat_window',
						frameName : 'hh_chat_frame',
						script : 'removeload(' + msg_id + ',\'' + native_path + '\');'
					});
					setTimeout(function() {
						//			修改会话发送状态
						updateMsgsentImgStatusToDb(msg_id, target_id, 'SENT', native_path);
					}, 300);
					//
					callback(true);
					api.execScript({
						name : 'hh_chat_window',
						frameName : 'hh_chat_frame',
						script : 'goBottom();'
					});
				} else {
					api.toast({
						msg : data
					});
					callback(false);
				}
			});

		} else if (ret.status == 'error') {
			var err_code = err.code;
			switch(err_code) {
				case 30014:
					//					openNoticeLogout('服务器不可用,请检查网络状况后重新登录');
					api.toast({
						msg : '对不起，发送失败，请重新连接网络后再次发送'
					});
					//					api.alert({
					//						msg : '对不起，图片发送失败'
					//					});
					break;
				case 30003:
					api.toast({
						msg : '对不起，发送失败，请重新连接网络后再次发送'
					});
					//					api.alert({
					//						msg : '对不起，图片发送失败，服务器超时'
					//					});
					break;
				case 31009:
					api.toast({
						msg : '对不起，图片发送失败，您在对方黑名单中'
					});
					//					api.alert({
					//						msg : '对不起，图片发送失败，您在对方黑名单中'
					//					});
					break;
				case -10000:
					api.toast({
						msg : '对不起，发送失败，请重新连接网络后再次发送'
					});
					//					api.alert({
					//						msg : '对不起，图片发送失败，未调用 init 方法进行初始化'
					//					});
					break;
				case -10001:
					api.toast({
						msg : '对不起，发送失败，请重新连接网络后再次发送'
					});
					//					api.alert({
					//						msg : '对不起，图片发送失败，未调用 connect 方法进行连接'
					//					});
					break;
				case -10002:
					api.toast({
						msg : '对不起，发送失败，请重新连接网络后再次发送'
					});
					//					api.alert({
					//						msg : '对不起，图片发送失败，输入参数错误'
					//					});
					break;
				case 22406:
					api.alert({
						msg : '对不起，当前群组已经解散'
					}, function(ret, err) {
						api.execScript({
							name : 'hh_chat_window',
							frameName : 'hh_chat_frame',
							script : 'closeUiChatBox();'
						});
					});

					break;
				default :
					api.toast({
						msg : '对不起，发送失败，请重新连接网络后再次发送'
					});
					break;
			}
			var msg_id = ret.result.message.messageId;
			//修改会话发送状态
			setTimeout(function() {
				updateMsgsentStatusToDb(msg_id, target_id, 'FAILED');
			}, 300);
		}
	});
}

//var send_count = 0;
/**
 * 发送图片消息
 * 周枫
 * 2015.08.11
 * @param {Object} sendMsg
 */
function sendPictureAttr(p_c, target_id, img_attrs, extra, conversationType) {
	//	$api.rmStorage('send_img_attrs');
	//	api.alert({
	//		msg : JSON.stringify(img_attrs)
	//	}, function(ret, err) {
	//		//coding...
	//	});
	rong.sendImageMessage({
		conversationType : conversationType,
		targetId : target_id,
		imagePath : img_attrs[p_c].path,
		extra : extra
	}, function(ret, err) {
		if (ret.status == 'prepare') {
			//单聊准备发送，向会话页面发送正在发送消息事件
			api.sendEvent({
				name : 'insertSendMessage',
				extra : {
					data : ret.result
				}
			})
			//存入会话数据库
			sendMessageToDb(ret.result.message);
		} else if (ret.status == 'progress') {

		} else if (ret.status == 'success') {
			var msg_id = ret.result.message.messageId;
			api.execScript({
				name : 'hh_chat_window',
				frameName : 'hh_chat_frame',
				script : 'removeload(' + msg_id + ',\'\');'
			});
			//修改会话发送状态
			setTimeout(function() {
				updateMsgsentStatusToDb(msg_id, target_id, 'SENT');
			}, 300);
			p_c++;
			if (p_c < img_attrs.length) {
				return sendPictureAttr(p_c, target_id, img_attrs, extra, conversationType);
			}
		} else if (ret.status == 'error') {
			var err_code = err.code;
			switch(err_code) {
				case 30014:
					//					openNoticeLogout('服务器不可用,请检查网络状况后重新登录');
					api.toast({
						msg : '对不起，发送失败，请重新连接网络后再次发送'
					});
					//					api.alert({
					//						msg : '对不起，图片发送失败'
					//					});
					break;
				case 30003:
					api.toast({
						msg : '对不起，发送失败，请重新连接网络后再次发送'
					});
					//					api.alert({
					//						msg : '对不起，图片发送失败，服务器超时'
					//					});
					break;
				case 31009:
					api.toast({
						msg : '对不起，图片发送失败，您在对方黑名单中'
					});
					//					api.alert({
					//						msg : '对不起，图片发送失败，您在对方黑名单中'
					//					});
					break;
				case -10000:
					api.toast({
						msg : '对不起，发送失败，请重新连接网络后再次发送'
					});
					//					api.alert({
					//						msg : '对不起，图片发送失败，未调用 init 方法进行初始化'
					//					});
					break;
				case -10001:
					api.toast({
						msg : '对不起，发送失败，请重新连接网络后再次发送'
					});
					//					api.alert({
					//						msg : '对不起，图片发送失败，未调用 connect 方法进行连接'
					//					});
					break;
				case -10002:
					api.toast({
						msg : '对不起，发送失败，请重新连接网络后再次发送'
					});
					//					api.alert({
					//						msg : '对不起，图片发送失败，输入参数错误'
					//					});
					break;
				case 22406:
					api.alert({
						msg : '对不起，当前群组已经解散'
					}, function(ret, err) {
						api.execScript({
							name : 'hh_chat_window',
							frameName : 'hh_chat_frame',
							script : 'closeUiChatBox();'
						});
					});

					break;
				default :
					api.toast({
						msg : '对不起，发送失败，请重新连接网络后再次发送'
					});
					break;
			}
			var msg_id = ret.result.message.messageId;
			//修改会话发送状态
			setTimeout(function() {
				updateMsgsentStatusToDb(msg_id, targetId, 'FAILED');
			}, 300);
		}
	});
}

/*
 * 发送语音消息
 * 周枫
 * 2015.08.12
 *
 */
function sendVoice(target_id, voicePath, duration, extra, conversationType) {
	rong.sendVoiceMessage({
		conversationType : conversationType,
		targetId : target_id,
		voicePath : voicePath,
		duration : parseInt(duration),
		extra : extra
	}, function(ret, err) {
		if (ret.status == 'prepare') {
			//单聊准备发送，向会话页面发送正在发送语音事件
			api.sendEvent({
				name : 'insertSendMessage',
				extra : {
					data : ret.result
				}
			})
			//存入会话数据库
			sendMessageToDb(ret.result.message);
		} else if (ret.status == 'success') {
			var msg_id = ret.result.message.messageId;
			api.execScript({
				name : 'hh_chat_window',
				frameName : 'hh_chat_frame',
				script : 'removeload(' + msg_id + ',\'\');'
			});
			//修改会话发送状态
			setTimeout(function() {
				updateMsgsentStatusToDb(msg_id, target_id, 'SENT');
			}, 300);

			removefile(voicePath);

		} else if (ret.status == 'error') {
			var err_code = err.code;
			switch(err_code) {
				case 30014:
					api.toast({
						msg : '对不起，发送失败，请重新连接网络后再次发送'
					});
					//					api.alert({
					//						msg : '对不起，语音发送失败'
					//					});
					break;
				case 30003:
					api.toast({
						msg : '对不起，发送失败，请重新连接网络后再次发送'
					});
					//					api.alert({
					//						msg : '对不起，图片发送失败，服务器超时'
					//					});
					break;
				case 31009:
					api.toast({
						msg : '对不起，图片发送失败，您在对方黑名单中'
					});
					//					api.alert({
					//						msg : '对不起，图片发送失败，您在对方黑名单中'
					//					});
					break;
				case -10000:
					api.toast({
						msg : '对不起，发送失败，请重新连接网络后再次发送'
					});
					//					api.alert({
					//						msg : '对不起，图片发送失败，未调用 init 方法进行初始化'
					//					});
					break;
				case -10001:
					api.toast({
						msg : '对不起，发送失败，请重新连接网络后再次发送'
					});
					//					api.alert({
					//						msg : '对不起，图片发送失败，未调用 connect 方法进行连接'
					//					});
					break;
				case -10002:
					api.toast({
						msg : '对不起，发送失败，请重新连接网络后再次发送'
					});
					//					api.alert({
					//						msg : '对不起，图片发送失败，输入参数错误'
					//					});
					break;
				case 22406:
					api.alert({
						msg : '对不起，当前群组已经解散'
					}, function(ret, err) {
						api.execScript({
							name : 'hh_chat_window',
							frameName : 'hh_chat_frame',
							script : 'closeUiChatBox();'
						});
					});

					break;
				default:
					api.toast({
						msg : '对不起，发送失败，请重新连接网络后再次发送'
					});
					break;
			}
		}
	});
}

/*
 * 发送会话历史列表返回增加头像和姓名和时间的json
 * 周枫
 * 2015-08-05
 */
/*
 function sendConListReJson(con_list, callback) {
 //						api.alert({
 //								msg :'ret'+JSON.stringify(con_list)
 //				          },function(ret,err){
 //				          	//coding...
 //				          });
 //	var hh_index = $api.getStorage('hh_index');
 //由于安卓返回时空字符串，自行处理一下
 if (con_list.result == '') {
 con_list.result = [];
 }
 //	if ( typeof (hh_index) != "undefined" && (is_fir == 0)) {
 //		callback(hh_index);
 //	} else {
 api.ajax({
 url : BASE_URL_ACTION + '/rongcloud/getConListReList',
 method : 'post',
 dataType : 'json',
 timeout : 60,
 data : {
 values : {
 "con_list" : con_list,
 "ip_addr" : BASE_SERVER_IP,
 "app_type" : BASE_APP_TYPE
 }
 }
 }, function(ret, err) {
 //							api.alert({
 //								msg :'ret'+JSON.stringify(ret)
 //				          },function(ret,err){
 //				          	//coding...
 //				          });
 //		          api.alert({
 //						msg :'err'+JSON.stringify(err)
 //		          },function(ret,err){
 //		          	//coding...
 //		          });
 if (ret) {
 if (ret.status == 'success') {
 //								$api.setStorage('hh_index_list', ret.result);
 //					$api.setStorage('hh_index', ret);

 callback(ret);
 } else {
 api.toast({
 msg : '对不起，获取会话列表失败'
 });
 //				api.alert({
 //					msg : '对不起，获取会话列表失败'
 //				});
 }

 } else {
 api.toast({
 msg : '对不起，获取会话列表失败'
 });
 //			api.alert({
 //				msg : '对不起，获取会话列表失败'
 //			});
 }
 });
 //	}

 }
 */
/*
 * 清空某一会话的所有聊天消息记录
 * 周枫
 * 2015-08-05
 */
function clearMessageById(user_id, conver_type) {
	api.showProgress({
		title : '加载中...',
		text : '请稍候...',
		modal : false
	});

	rong.clearMessages({
		conversationType : conver_type,
		targetId : user_id
	}, function(ret, err) {
		if (ret.status == 'success') {
			var sql = "DELETE FROM t_hh_messages WHERE targetId = '" + user_id + "' AND owner_id = '" + owner_id + "' AND conversationType = '" + conver_type + "';";
			dbExecuteSql(sql, function(is_true) {
				if (is_true) {
					//					//重新获取会话列表
					getCoversationList();
				} else {
					//			api.alert({
					//				msg : '存入接收消息失败:clearMessageById'
					//			});
				}
			});
		} else {
			api.toast({
				msg : '操作失败',
				location : 'bottom'
			});
		}
	})
}

/*0
 * 清空所有会话及会话消息
 * 周枫
 * 2015-08-05
 */
function clearConversations(html_from) {
	rong.clearConversations({
		conversationTypes : ['PRIVATE', 'GROUP']
	}, function(ret, err) {
		if (ret.status == 'success') {
			clearConversationsToDb(function(is_true) {
				if (is_true) {
					if (html_from == 'w_index') {
						api.alert({
							msg : '操作成功'
                        },function(ret,err){
                        	//coding...
                        });
					} else {
						api.toast({
							msg : '操作成功'
						});
					}
				}
				//重新获取会话列表
				getCoversationList();
			});
		} else {
			api.toast({
				msg : '操作成功'
			});
		}
	})
}

/*
 * 清除未读红点和条数
 * 周枫
 * 2015-08-03
 */
function cleanMsg(target_id, conver_type) {
	rong.clearMessagesUnreadStatus({
		conversationType : conver_type,
		targetId : target_id
	}, function(ret, err) {
		if (ret.status == "success") {
			clearMessagesUnreadStatusToDb(target_id, conver_type, function(is_true) {
				//清除未读消息后刷新列表
				getCoversationList();
				if (!is_true) {
					api.toast({
						msg : '清除未读失败'
					});
				} 
			});
		} else {
			api.toast({
				msg : '清除未读失败'
			});
		}
	})
}

/**
 * 获取新消息时，提示
 * 向用户发出震动、声音提示、灯光闪烁、状态栏消息等通知
 * 周枫
 * 2015.09.28
 * 升级融云2之后废弃
 * @param {Object} content_msg
 */
//function notificationMessage(content_msg) {
//	api.notification({
//		notify : {
//			title : '理想家校通',
//			content : content_msg,
//			updateCurrent : true
//		}
//	}, function(ret, err) {
//		//		if (ret && ret.id) {
//		//			api.alert(ret.id);
//		//		}
//	});
//}

function beforeRender(data) {
	var g_time = new getTimeTemplate();
	//g_time为想在template的标签中执行的函数
	data.g_time = g_time;
}

/*
 * //是否是首页还是会话页面获取消息的flag
 * 周枫
 * 2015-10-30
 */
function reFlag() {
	//	api.alert({
	//		msg : is_index
	//  },function(ret,err){
	//  	//coding...
	//  });
	is_index = 'index';
}

/**
 * 获取当前融云连接状态
 * 周枫
 * 2015.12.03
 */

function getConStatus() {
	rong.getConnectionStatus(function(ret, err) {
		if (ret.status == 'success') {
			var con_status = ret.result.connectionStatus;
						switch(con_status) {
							case 'DISCONNECTED':
								openNoticeLogout('当前连接已经断开,请重新登录');
								break;
							case 'KICKED':
								openNoticeLogout('当前用户在其他地区登录,请重新登录');
								break;
							//				case 'NETWORK_UNAVAILABLE':
							//					api.showProgress({
							//						title : '当前网络不可用',
							//						text : '请检查网络状况',
							//						modal : true
							//					});
							//				break;
							case 'SERVER_INVALID':
								openNoticeLogout('服务器异常,请检查网络状况后重新登录');
								break;
							case 'TOKEN_INCORRECT':
								openNoticeLogout('当前连接已经断开,请重新登录');
								break;
							case 'CONNECTED':
								api.hideProgress();
								break;
						}
		}

	})
}

function openNoticeLogout(msg_text) {
	api.alert({
		msg : msg_text
	}, function(ret, err) {
		//清空localStorage
		$api.rmStorage('login_name');
		//断开融云链接
		logoutRongCloud();
	});
}

/**
 * 退出融云
 * 周枫
 * 2015.12.03
 */
function logoutRongCloud() {
	rong.logout(function(ret, err) {
		if (ret) {
			goLogin();
		}
	});
}

/**
 * 退出到首页
 * 周枫
 * 2015.10.23
 */
function goLogin() {
	var jsonPath = "widget://res/json/config.json";
	commonBaseConfig(jsonPath,function(data) {
		var uiMode = "phone";
		var login_index = '';
		switch(uiMode) {
			case 'phone':
				login_index = data.phone_login_config.login_index;
				break;
//			case 'pad':
//				var idy_type = $api.getStorage('idy_type');
//				if(idy_type == 'parent' || idy_type == 'work'){
//					commonSetScreen(3);
//				}else{
//					if(api.systemType == 'ios'){
//						commonSetScreen(5);
//					}else{
//						commonSetScreen(2);
//					}
//				}
//				login_index = data.pad_login_config.login_index;
//				break;
			default:
				login_index = data.phone_login_config.login_index;
				break;
		}
		api.openWin({
			name : 'login',
			url : login_index,
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
}

/**
 * 接收系统消息后自动刷新群组
 * 周枫
 * 2015.12.04
 * @param {Object} group_id
 * @param {Object} group_type
 */
function reloadTxlData(group_id, group_type) {
	api.showProgress({
		title : '请等待...',
		text : '请稍候...',
		modal : false
	});
	var jsfun1 = 'reloadData();';
	var jsfun2 = 'closeMyself();';
	var jsfun3 = 'loadData();';

	//删除历史会话列表纪录
	if (group_type == 0) {
		api.execScript({
			name : 'root',
			frameName : 'hh_index',
			script : 'clearMessageById(\'' + group_id + '\',\'GROUP\');'
		});
	}
	//根据当前tab判断是否关闭list
	var cur_tab = 0;
	if ( typeof ($api.getStorage('cur_index_tab')) != 'undefined') {
		cur_tab = $api.getStorage('cur_index_tab');
	}
	if (cur_tab != 1) {
		api.execScript({
			name : 'root',
			frameName : 'txl_index',
			script : jsfun1
		});
		setTimeout(function() {
			api.execScript({
				name : 'root',
				frameName : 'txl_index',
				script : jsfun2
			});
			api.hideProgress();
		}, 1000);
	} else {
		api.execScript({
			name : 'root',
			frameName : 'txl_index',
			script : jsfun1
		});
		setTimeout(function() {
			api.execScript({
				name : 'root',
				frameName : 'txl_index',
				script : jsfun2
			});
		}, 2000);
		setTimeout(function() {
			api.execScript({
				name : 'root',
				frameName : 'txl_index',
				script : jsfun3
			});
			api.hideProgress();
		}, 3000);
	}

}

/**
 * 删除文件
 * 周枫
 * 2015.08.10
 * @param {Object} path
 */
function removefile(path) {
	var fs = api.require('fs');
	fs.remove({
		path : path
	}, function(ret, err) {

		if (ret.status != true) {
			//			api.alert({
			//				msg : err.msg
			//			}, function(ret, err) {
			//				//coding...
			//			});
		}
	});
}

/**
 *  获取所有未读消息数
 * 周枫
 * 2015.12.12
 * @param {Object} callback
 */
function getTotalUnreadCount(callback) {
	getTotalUnreadCountFromDb(function(ret) {
		//		if (ret.status == 'success') {
		callback(ret);
		//		}
	});
	//	rong.getTotalUnreadCount(function(ret, err) {
	//
	//	})
}

/**
 * 未读总条数，显示在APP右上角
 * 周枫
 * 2015.12.12
 */
function showUnreadCount() {
	getTotalUnreadCount(function(unread_con) {
		//设置应用图标右上角数字，支持所有iOS手机，以及部分Android手机，如小米和三星的某些型号
		api.setAppIconBadge({
			badge : unread_con
		});
		api.execScript({
			name : 'root',
			script : 'getUnreadCount("hh",' + unread_con + ');'
		});
	});
}

//判断提交数字
//var img_count = 0;
//发送图片的数组
//var attrs = [];
/**
 * ios调用发送图片重组数据
 * @param {Object} img_sum
 * @param {Object} img_url
 * @param {Object} targetId
 * @param {Object} extra
 * @param {Object} conversationType
 */
//function creatSendImgAttrs(img_sum, img_url, targetId, extra, conversationType) {
//	attrs[img_count] = img_url;
//	img_count++;
//	if (img_count == img_sum) {
//		sendPicture(targetId, attrs, extra, conversationType);
//	}
//}

/**
 * 存如数据库前对数据进行相关处理
 * 周枫
 * 2015.12.28
 */
function receiveRongMsgToDbBefore(msg_info, callback) {
	var msg_object = msg_info.result.message.objectName;
	var ret_msg = msg_info.result.message;
	var nativePath = '';
	var imagePath = '';
	if (msg_object == 'RC:ImgMsg') {
		//图片路径
		imagePath = ret_msg.content.imageUrl;
		//图片缓存本地
		imageCache(imagePath, '', function(native_path) {
			ret_msg.content.nativePath = native_path;
			//会话数据存入数据库
			receiveRongMsgToDb(msg_info, function(is_true) {
				if (is_true) {
					callback(msg_info, native_path);
				} else {
					callback(msg_info, imagePath);
				}
			});
		});
	} else if (msg_object == 'RC:TxtMsg') {
		var msg_text = ret_msg.content.text;
		transText(msg_text, function(msg_text) {
			ret_msg.content.text = msg_text;
			//会话数据存入数据库
			receiveRongMsgToDb(msg_info, function(is_true) {
				if (is_true) {
					callback(msg_info, '');
				} else {
					callback(msg_info, '');
				}
			});
		});

		function transText(text, callback) {
			//获取表情存放路径
			var sourcePath = BASE_EMOTION_PATH;

			//存储表情
			getImgsPaths(sourcePath, function(emotion) {

				var imgWidth = 30;
				var imgHeight = 30;
				var regx = /\[(.*?)\]/gm;
				//表情存放目录
				var emotionData;
				var textTransed = text.replace(regx, function(match) {

					emotionData = emotion;
					var imgSrc = emotionData[match];

					if (!imgSrc) {
						//说明不对应任何表情，直接返回
						return match;
					}
					var img = "<img src=" + imgSrc + " width=" + imgWidth + " height=" + imgHeight + ">";
					return img;
				});
				textTransed = transferBr(textTransed);
				callback(textTransed);
			})
		}

	} else {
		receiveRongMsgToDb(msg_info, function(is_true) {
			if (is_true) {
				callback(msg_info, '');
			} else {
				callback(msg_info, '');
			}
		});
	}
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

/**
 * 会话数据存入数据库
 * 周枫
 * 2015.12.28
 */
function receiveRongMsgToDb(msg_info, callback) {
	var msg_object = msg_info.result.message.objectName;
	var ret_msg = msg_info.result.message;
	var g_time = new getTimeTemplate();
	var start = ret_msg.sentTime;
	var sent_time = g_time.getTime(start, 1);
	var receive = ret_msg.receivedTime;
	var received_time = g_time.getTime(receive, 1);
	var conversationType = ret_msg.conversationType;
	var keyWord = ret_msg.content.text;
	//处理特殊字符
	if ( typeof (keyWord) != 'undefined') {
		keyWord = keyWord.replaceAll("'", "''");
	} else {
		keyWord = '';
	}

	//接收新消息语句
	var sql = "INSERT INTO t_hh_messages (text,voicePath,duration,imagePath,thumbPath,nativePath,extra,conversationType,messageDirection,targetId,objectName,sentStatus,senderUserId,messageId,sentTime,receivedTime,sent_time,received_time,msg_left,owner_id,is_read) VALUES (";
	//text
	sql = sql + "'" + keyWord + "',";
	//voicePath
	sql = sql + "'" + ret_msg.content.voicePath + "',";
	//duration
	sql = sql + "'" + ret_msg.content.duration + "',";
	//imagePath
	sql = sql + "'" + ret_msg.content.imageUrl + "',";
	//thumbPath
	sql = sql + "'" + ret_msg.content.thumbPath + "',";
	//nativePath
	sql = sql + "'" + ret_msg.content.nativePath + "',";
	//extra
	sql = sql + "'" + ret_msg.content.extra + "',";
	//conversationType
	sql = sql + "'" + conversationType + "',";
	//messageDirection
	sql = sql + "'" + ret_msg.messageDirection + "',";
	if (conversationType == 'SYSTEM') {
		//targetId
		sql = sql + "'admin',";
	} else {
		//targetId
		sql = sql + "'" + ret_msg.targetId + "',";
	}

	//ojbectName
	sql = sql + "'" + ret_msg.objectName + "',";
	//sentSatus
	sql = sql + "'" + ret_msg.sentStatus + "',";
	//senderUserId
	sql = sql + "'" + ret_msg.senderUserId + "','";
	//messageId
	sql = sql + ret_msg.messageId + "',";
	//sentTime
	sql = sql + ret_msg.sentTime + ",";
	//receivedTime
	sql = sql + ret_msg.receivedTime + ",'";
	//sent_time
	sql = sql + sent_time + "','";
	//received_time
	sql = sql + received_time + "',";
	//left
	sql = sql + msg_info.result.left;
	//owner_id
	sql = sql + ",'" + owner_id + "',";
	//是否已读
	//	if (is_index == 'index') {
	sql = sql + "0);"
	//	} else {
	//		sql = sql + "1);"
	//	}
	dbExecuteSql(sql, function(is_true) {
		if (is_true) {
			callback(true);
		} else {
			callback(false);
			//			api.alert({
			//				msg : '存入接收消息失败:' + JSON.stringify(err)
			//			});
		}
	});

}

/**
 * 发送消息后存入数据库
 * 周枫
 * 2015.12.28
 */
function sendMessageToDb(msg_info) {
	var sql = '';
	var objectName = msg_info.objectName;
	var g_time = new getTimeTemplate();
	var start = msg_info.sentTime;
	var sent_time = g_time.getTime(start, 1);
	var receive = msg_info.receivedTime;
	var received_time = g_time.getTime(receive, 1);
	var keyWord = msg_info.content.text;

	if ( typeof (keyWord) != 'undefined') {
		keyWord = keyWord.replaceAll("'", "''");
	} else {
		keyWord = '';
	}
	switch(objectName) {
		case 'RC:TxtMsg':
			sql = "INSERT INTO t_hh_messages (text,extra,conversationType,messageDirection,targetId,objectName,sentStatus,senderUserId,messageId,sentTime,sent_time,receivedTime,received_time,owner_id, is_read) VALUES (";
			//text
			sql = sql + "'" + keyWord + "',";
			//extra
			sql = sql + "'" + msg_info.content.extra + "',";
			//conversationType
			sql = sql + "'" + msg_info.conversationType + "',";
			//messageDirection
			sql = sql + "'" + msg_info.messageDirection + "',";
			//targetId
			sql = sql + "'" + msg_info.targetId + "',";
			//objectName
			sql = sql + "'" + msg_info.objectName + "',";
			//sentStatus
			sql = sql + "'" + msg_info.sentStatus + "',";
			//senderUserId
			sql = sql + "'" + msg_info.senderUserId + "',";
			//messageId
			sql = sql + msg_info.messageId + ",";
			//sentTime
			sql = sql + start + ",";
			//sent_time
			sql = sql + "'" + sent_time + "',";
			//receivedTime
			sql = sql + receive + ",";
			//received_time
			sql = sql + "'" + received_time + "','";
			//owner_id
			sql = sql + owner_id + "',";
			//is_read
			sql = sql + "1);"

			break;
		case 'RC:ImgMsg':
			sql = "INSERT INTO t_hh_messages (imagePath,nativePath,thumbPath,extra,conversationType,messageDirection,targetId,objectName,sentStatus,senderUserId,messageId,sentTime,receivedTime,sent_time,received_time,owner_id,is_read) VALUES (";
			//imagePath
			sql = sql + "'" + msg_info.content.imageUrl + "',";
			//nativePath
			sql = sql + "'" + msg_info.content.nativePath + "',";
			//thumbPath
			sql = sql + "'" + msg_info.content.thumbPath + "',";
			//extra
			sql = sql + "'" + msg_info.content.extra + "',";
			//conversationType
			sql = sql + "'" + msg_info.conversationType + "',";
			//messageDirection
			sql = sql + "'" + msg_info.messageDirection + "',";
			//targetId
			sql = sql + "'" + msg_info.targetId + "',";
			//ojbectName
			sql = sql + "'" + msg_info.objectName + "',";
			//sentSatus
			sql = sql + "'" + msg_info.sentStatus + "',";
			//senderUserId
			sql = sql + "'" + msg_info.senderUserId + "','";
			//messageId
			sql = sql + msg_info.messageId + "',";
			//sentTime
			sql = sql + msg_info.sentTime + ",";
			//receivedTime
			sql = sql + msg_info.receivedTime + ",'";
			//sent_time
			sql = sql + sent_time + "','";
			//received_time
			sql = sql + received_time + "','";
			//owner_id
			sql = sql + owner_id + "',";
			//is_read
			sql = sql + "1);"

			break;
		case 'RC:VcMsg':
			sql = "INSERT INTO t_hh_messages (voicePath,duration,extra,conversationType,messageDirection,targetId,objectName,sentStatus,senderUserId,messageId,sentTime,receivedTime,sent_time,received_time,owner_id,is_read) VALUES (";

			//voicePath
			sql = sql + "'" + msg_info.content.voicePath + "',";
			//duration
			sql = sql + "'" + msg_info.content.duration + "',";

			//extra
			sql = sql + "'" + msg_info.content.extra + "',";
			//conversationType
			sql = sql + "'" + msg_info.conversationType + "',";
			//messageDirection
			sql = sql + "'" + msg_info.messageDirection + "',";
			//targetId
			sql = sql + "'" + msg_info.targetId + "',";
			//ojbectName
			sql = sql + "'" + msg_info.objectName + "',";
			//sentSatus
			sql = sql + "'" + msg_info.sentStatus + "',";
			//senderUserId
			sql = sql + "'" + msg_info.senderUserId + "','";
			//messageId
			sql = sql + msg_info.messageId + "',";
			//sentTime
			sql = sql + msg_info.sentTime + ",";
			//receivedTime
			sql = sql + msg_info.receivedTime + ",'";
			//sent_time
			sql = sql + sent_time + "','";
			//received_time
			sql = sql + received_time + "','";
			//owner_id
			sql = sql + owner_id + "',";
			//is_read
			sql = sql + "1);"
			break;

	}

	dbExecuteSql(sql, function(is_true) {
		if (is_true) {
			//			api.alert({
			//				msg : '存入接收消息成功'
			//			});
		} else {
			//			api.alert({
			//				msg : '存入接收消息失败:'
			//			});
		}
	});

}

/**
 * 修改会话发送状态
 * 周枫
 * 2015.12.28
 * @param {Object} msg_id
 * @param {Object} target_id
 * @param {Object} msg_status
 */
function updateMsgsentStatusToDb(msg_id, target_id, msg_status) {
	var sql = '';
	sql = "UPDATE t_hh_messages SET sentStatus = '" + msg_status + "' WHERE messageId = " + msg_id + " AND targetId = '" + target_id + "'";
	dbExecuteSql(sql, function(is_true) {
		if (is_true) {
			//			callback(true);
		} else {
			//			api.alert({
			//				msg : '修改消息状态失败:'
			//			});
		}
	});
}

/**
 * 修改会话发送图片状态
 * 周枫
 * 2016.1.26
 * @param {Object} msg_id
 * @param {Object} target_id
 * @param {Object} msg_status
 */
function updateMsgsentImgStatusToDb(msg_id, target_id, msg_status, img_path) {
	var sql = '';
	sql = "UPDATE t_hh_messages SET nativePath = '" + img_path + "' ,sentStatus = '" + msg_status + "' WHERE messageId = " + msg_id + " AND targetId = '" + target_id + "'";
	dbExecuteSql(sql, function(is_true) {
		if (is_true) {
			//			callback(true);
		} else {
			//			api.alert({
			//				msg : '修改消息状态失败:'
			//			});
		}
	});
}

/**
 * 从数据库获取会话列表
 * 周枫
 * 2016.1.5
 * @param {Object} callback
 */
function getConversationListFromDb(callback) {
	//	setTimeout(function() {
	//从数据库获取人员会话列表
	getCPersonListFromDb(function(p_list) {
		//			api.alert({
		//				msg : JSON.stringify(p_list)
		//          },function(ret,err){
		//          	//coding...
		//          });
		var c_list_attr = [];
		p_list_l = p_list.length;
		c_list_attr = p_list;
		if (p_list) {
			//获取群组会话列表
			getCGroupListFromDb(function(g_list) {
				for (var i = 0; i < g_list.length; i++) {
					c_list_attr.push(g_list[i]);
				}
				c_list_attr.sort(function(a, b) {
					return a.messageId < b.messageId ? 1 : -1
				});
				//对数据进行处理
				exeHhHistoryList(c_list_attr, function(hh_history_list) {
					callback(hh_history_list);
				});
			});
		}
	});
	//	}, 100);
}

/**
 * 从数据库获取人员会话列表
 * 周枫
 * 2016.1.5
 * @param {Object} callback
 */
function getCPersonListFromDb(callback) {
	var sql = "SELECT t1.*,(SELECT COUNT(is_read) FROM t_hh_messages t2 WHERE t2.is_read = 0 AND t2.owner_id = '" + owner_id + "' AND t2.targetId = t1.targetId) AS unreadMessageCount,'' AS avatar_url_native, '' AS person_name ,'' AS avatar_url, 0 AS t FROM t_hh_messages t1  WHERE  t1.owner_id = '" + owner_id + "' AND t1.sentStatus = 'SENT' and t1.conversationType <> 'GROUP' GROUP BY t1.targetId HAVING max(t1.sentTime)=t1.sentTime ORDER BY t1.receivedTime DESC;";
	//	var hh_list_attr = [];
	dbSelectSql(sql, function(data_attr) {
		if (data_attr != false || data_attr.length == 0) {
			if (data_attr.length == 0) {
				callback(data_attr);
			} else {
				//从数据库获取人员，循环获取
				getPersonInfoByIdBefore(data_attr, function(p_list_attr) {
					callback(p_list_attr);
				});
			}
		} else {
			//			api.alert({
			//				msg : '存入接收消息失败:getCPersonListFromDb'
			//			});
		}
	});
}

/**
 * 获取群组会话列表
 * 周枫
 * 2016.1.5
 */
function getCGroupListFromDb(callback) {
	var sql = "SELECT t1.*,(SELECT COUNT(is_read) FROM t_hh_messages t2 WHERE is_read = 0 AND owner_id = '" + owner_id + "' AND t1.targetId = t2.targetId) AS unreadMessageCount,(SELECT person_name FROM t_base_person t3 WHERE  owner_id = '" + owner_id + "' AND t1.senderUserId  = t3.login_name) AS senderName,'' AS avatar_url_native, '' AS person_name ,'' AS avatar_url, 0 AS t FROM t_hh_messages t1  WHERE  t1.owner_id = '" + owner_id + "' AND t1.sentStatus = 'SENT' and t1.conversationType == 'GROUP' GROUP BY t1.targetId HAVING max(t1.sentTime)=t1.sentTime ORDER BY t1.sentTime DESC;";
	//	var hh_list_attr = [];
	dbSelectSql(sql, function(data_attr) {
		if (data_attr != false || data_attr.length == 0) {
			if (data_attr.length == 0) {
				callback(data_attr);
			} else {
				getGroupInfoByIdBefore(data_attr, function(g_list_attr) {
					callback(g_list_attr);
				});
			}

		} else {
			//			api.alert({
			//				msg : '存入接收消息失败:getCPersonListFromDb'
			//			});
		}
	});
}

/**
 * 从数据库获取人员，循环获取
 * @param {Object} person_list_attr
 * @param {Object} callback
 */
function getPersonInfoByIdBefore(person_list_attr, callback) {
	var p_list_attr = [];
	var p_temp = 0;
	var p_tmp = 0;
	for (var i = 0; i < person_list_attr.length; i++) {
		//查询数据库中是否存在当前人员
		selectIsExistPersonInDb(person_list_attr[i], function(is_true, p_list_json) {
			if (is_true) {
			    //从数据库获取人员
				var person_info_attr = getPersonInfoById(p_list_json);
				p_list_attr[p_temp] = person_info_attr;
				p_temp++;
				p_tmp++;
			} else {
				p_tmp++;
			}
			if (p_tmp == person_list_attr.length) {
				callback(p_list_attr);
			}
		});
	}
}

/**
 *  从数据库获取群组，循环获取
 */
function getGroupInfoByIdBefore(group_list_attr, callback) {
	var g_list_attr = [];
	var g_temp = 0;
	var g_tmp = 0;
	for (var i = 0; i < group_list_attr.length; i++) {
		selectIsExistGroupInDb(group_list_attr[i], function(is_true, g_list_json) {
			if (is_true) {
				var group_info_attr = getGroupInfoById(g_list_json);
				g_list_attr[g_temp] = group_info_attr;
				g_temp++;
				g_tmp++;
			} else {
				g_tmp++;
			}
			if (g_tmp == group_list_attr.length) {
				callback(g_list_attr);
			}
		});

	}
}

/**
 * 从数据库获取人员
 * @param {Object} person_info
 * @param {Object} callback
 */
function getPersonInfoById(person_info) {
	var sql = "SELECT avatar_url_native,person_name,avatar_url FROM t_base_person WHERE owner_id = '" + owner_id + "' AND login_name = '" + person_info.targetId + "';";
	var data_attr = dbSelectSqlSync(sql);
	if (data_attr != false || data_attr.length == 0) {
		if (person_info.targetId == 'admin') {
			person_info.person_name = 'admin';
			person_info.t = '4';
			person_info.avatar_url_native = '../../image/person/sys_msg.png';
			person_info.avatar_url = '../../image/person/sys_msg.png';
			return person_info;
		} else {
			person_info.person_name = data_attr[0].person_name;
			person_info.avatar_url_native = data_attr[0].avatar_url_native;
			person_info.avatar_url = data_attr[0].avatar_url;
			return person_info;
		}
	} else {
		//			api.alert({
		//				msg : '存入接收消息失败:getPersonInfoById'
		//			});
	}

}

/**
 * 从数据库获取群组
 * @param {Object} person_info
 * @param {Object} callback
 */
function getGroupInfoById(person_info) {
	var sql = "SELECT group_type,avatar_url_native,group_name,avatar_url FROM t_base_group WHERE owner_id = '" + owner_id + "' AND group_id = '" + person_info.targetId + "' ;";
	var data_attr = dbSelectSqlSync(sql);
	if (data_attr != false || data_attr.length == 0) {
		person_info.person_name = data_attr[0].group_name;
		person_info.t = data_attr[0].group_type;
		person_info.avatar_url_native = data_attr[0].avatar_url_native;
		person_info.avatar_url = data_attr[0].avatar_url;
		return person_info;
	} else {
		//			api.alert({
		//				msg : '存入接收消息失败:getGroupInfoById'
		//			});
	}
}

/**
 * 对数据进行处理
 * 周枫
 * 2016.1.5
 * @param {Object} data_attr
 * @param {Object} callback
 */
function exeHhHistoryList(data_attr, callback) {
	var hh_history_list = {};
	var hh_history_attr = [];
	for (var i = 0; i < data_attr.length; i++) {
		//文本消息内容
		var r_text = data_attr[i].text;
		//会话json
		var result = {};
		//附内容
		var r_extra = data_attr[i].extra;
		//会话标题
		var r_conversationTitle = '';
		//会话类型
		var r_conversationType = data_attr[i].conversationType;
		//文字消息草稿的内容
		var r_draft = data_attr[i].draft;
		//消息目标 Id
		var r_targetId = data_attr[i].targetId;
		//发送出的消息状态
		var r_sentStatus = data_attr[i].sentStatus;
		//接收到的消息状态
		var r_recievedStatus = data_attr[i].recievedStatus;
		//发送消息的用户 Id
		var r_senderUserId = data_attr[i].senderUserId;
		//本会话的未读消息数
		var r_unreadMessageCount = parseInt(data_attr[i].unreadMessageCount);
		//收到消息的时间戳
		var r_receivedTime = parseInt(data_attr[i].receivedTime);
		//发送消息的时间戳
		var r_sentTime = parseInt(data_attr[i].sentTime);
		// 本会话最后一条消息 Id
		var r_latestMessageId = parseInt(data_attr[i].messageId);
		;
		//头像本地路径
		var r_avatar_url_native = data_attr[i].avatar_url_native;
		//头像http路径
		var r_avatar_url = data_attr[i].avatar_url;
		//人员姓名
		var r_person_name = data_attr[i].person_name;
		//最后说话人员姓名
		var r_sender_name = data_attr[i].senderName;
		//置顶状态
		var r_isTop = data_attr[i].isTop;
		//消息类型
		var r_objectName = data_attr[i].objectName;
		//发送消息方向
		var r_messageDirection = data_attr[i].messageDirection;
		//语音路径
		var r_voicePath = data_attr[i].voicePath;
		//语音时长
		var r_duration = data_attr[i].duration;
		//图片缩略图路径
		var r_thumbPath = data_attr[i].thumbPath;
		//图片真实本地路径
		var r_imageUrl = data_attr[i].nativePath;
		//群组类型 1：自定义群组，2：我的学校，3：我的班级
		var r_group_t = parseInt(data_attr[i].t);

		//最后一条消息的内容
		var r_latestMessage = {};

		switch(r_objectName) {
			case 'RC:TxtMsg':
				if ( typeof (r_text) != 'undefined') {
					//替换空格<br>
					//					r_text = r_text.replaceAll('<br>', ' ');
					if (r_text.indexOf("<img src=../../image/emotion/") != -1) {
						r_text = reImgToTxt(r_text);
					}
					r_latestMessage["text"] = r_text;
				} else {
					r_latestMessage["text"] = '';
				}
				( typeof (r_extra) != 'undefined') ? r_latestMessage["extra"] = r_extra : r_latestMessage["extra"] = '';
				result["latestMessage"] = r_latestMessage;
				break;
			case 'RC:VcMsg':
				( typeof (r_voicePath) != 'undefined') ? r_latestMessage["voicePath"] = r_voicePath : r_latestMessage["voicePath"] = '';
				( typeof (r_duration) != 'undefined') ? r_latestMessage["duration"] = r_duration : r_latestMessage["duration"] = '';
				( typeof (r_extra) != 'undefined') ? r_latestMessage["extra"] = r_extra : r_latestMessage["extra"] = '';
				result["latestMessage"] = r_latestMessage;
				break;
			case 'RC:ImgMsg':
				( typeof (r_thumbPath) != 'undefined') ? r_latestMessage["thumbPath"] = r_thumbPath : r_latestMessage["thumbPath"] = '';
				( typeof (r_imageUrl) != 'undefined') ? r_latestMessage["imageUrl"] = r_imageUrl : r_latestMessage["imageUrl"] = '';
				( typeof (r_extra) != 'undefined') ? r_latestMessage["extra"] = r_extra : r_latestMessage["extra"] = '';
				result["latestMessage"] = r_latestMessage;
				break;
		};
		( typeof (r_conversationTitle) != 'undefined') ? result["conversationTitle"] = r_conversationTitle : result["conversationTitle"] = '';
		( typeof (r_conversationType) != 'undefined') ? result["conversationType"] = r_conversationType : result["conversationType"] = '';
		( typeof (r_draft) != 'undefined') ? result["draft"] = r_draft : result["draft"] = '';

		( typeof (r_sentStatus) != 'undefined') ? result["sentStatus"] = r_sentStatus : result["sentStatus"] = '';
		( typeof (r_objectName) != 'undefined') ? result["objectName"] = r_objectName : result["objectName"] = '';
		( typeof (r_recievedStatus) != 'undefined') ? result["recievedStatus"] = r_recievedStatus : result["recievedStatus"] = '';

		( typeof (r_unreadMessageCount) != 'undefined') ? result["unreadMessageCount"] = r_unreadMessageCount : result["unreadMessageCount"] = 0;
		(r_messageDirection != 'SEND') ? result["receivedTime"] = r_receivedTime : result["receivedTime"] = r_sentTime;
		( typeof (r_latestMessageId) != 'undefined') ? result["latestMessageId"] = r_latestMessageId : result["latestMessageId"] = -1;
		( typeof (r_sentTime) != 'undefined') ? result["sentTime"] = r_sentTime : result["sentTime"] = 0;
		( typeof (r_isTop) != 'undefined') ? result["isTop"] = r_isTop : result["isTop"] = false;
		( typeof (r_sender_name) != 'undefined') ? result["senderName"] = r_sender_name : result["senderName"] = '组员';
		//如果是系统消息则修改
		switch(r_conversationType) {
			case 'SYSTEM':
				result["targetId"] = 'admin';
				result["senderUserId"] = 'admin';
				result["person_name"] = '系统消息';
				result["avatar_url"] = '../../image/person/sys_msg.png';
				break;
			case 'PRIVATE':
				( typeof (r_targetId) != 'undefined') ? result["targetId"] = r_targetId : result["targetId"] = '';
				( typeof (r_senderUserId) != 'undefined') ? result["senderUserId"] = r_senderUserId : result["senderUserId"] = '';
				( typeof (r_person_name) != 'undefined') ? result["person_name"] = r_person_name : result["person_name"] = '';
				( typeof (r_avatar_url) != 'undefined') ? result["avatar_url"] = r_avatar_url_native : result["avatar_url"] = '';
				break;
			case 'GROUP':
				( typeof (r_targetId) != 'undefined') ? result["targetId"] = r_targetId : result["targetId"] = '';
				( typeof (r_senderUserId) != 'undefined') ? result["senderUserId"] = r_senderUserId : result["senderUserId"] = '';
				( typeof (r_person_name) != 'undefined') ? result["person_name"] = r_person_name : result["person_name"] = '';
				if (r_group_t != 1) {
					( typeof (r_avatar_url) != 'undefined') ? result["avatar_url"] = r_avatar_url : result["avatar_url"] = '';
				} else {
					( typeof (r_avatar_url) != 'undefined') ? result["avatar_url"] = r_avatar_url_native : result["avatar_url"] = '';
				}

				break;
		};
		hh_history_attr[i] = result;
	}
	hh_history_list["status"] = 'success';
	hh_history_list["result"] = hh_history_attr;
	callback(hh_history_list);
}

function reImgToTxt(img_text) {
	var jsonPath = BASE_EMOTION_PATH + "/emotion.json";
	return readEmoJson(jsonPath, img_text);
}

function readEmoJson(jsonPath, img_text) {
	//	api.readFile({
	//		path : jsonPath
	//	}, function(ret, err) {
	//		if (ret.status) {
	var emotion_json = JSON.parse('[{"name": "Expression_1","text": "[微笑]"},{"name": "Expression_2","text": "[撇嘴]"}, {"name": "Expression_3","text": "[色]"}, {"name": "Expression_4","text": "[发呆]"}, {"name": "Expression_5","text": "[得意]"}, {"name": "Expression_6","text": "[流泪]"}, {"name": "Expression_7","text": "[害羞]"}, {"name": "Expression_8","text": "[闭嘴]"}, {"name": "Expression_9","text": "[睡]"}, {"name": "Expression_10","text": "[大哭]"}, {"name": "Expression_11","text": "[尴尬]"}, {"name": "Expression_12","text": "[发怒]"}, {"name": "Expression_13","text": "[调皮]"}, {"name": "Expression_14","text": "[呲牙]"}, {"name": "Expression_15","text": "[惊讶]"}, {"name": "Expression_16","text": "[难过]"}, {"name": "Expression_17","text": "[酷]"}, {"name": "Expression_18","text": "[冷汗]"}, {"name": "Expression_19","text": "[抓狂]"}, {"name": "Expression_20","text": "[吐]"}, {"name": "Expression_21","text": "[偷笑]"}, {"name": "Expression_22","text": "[愉快]"}, {"name": "Expression_23","text": "[白眼]"}, {"name": "Expression_24","text": "[傲慢]"}, {"name": "Expression_25","text": "[饥饿]"}, {"name": "Expression_26","text": "[困]"}, {"name": "Expression_27","text": "[恐惧]"}, {"name": "Expression_28","text": "[流汗]"}, {"name": "Expression_29","text": "[憨笑]"}, {"name": "Expression_30","text": "[悠闲]"}, {"name": "Expression_31","text": "[奋斗]"}, {"name": "Expression_32","text": "[咒骂]"}, {"name": "Expression_33","text": "[疑问]"}, {"name": "Expression_34","text": "[嘘]"}, {"name": "Expression_35","text": "[晕]"}, {"name": "Expression_36","text": "[疯了]"}, {"name": "Expression_37","text": "[衰]"}, {"name": "Expression_38","text": "[骷髅]"}, {"name": "Expression_39","text": "[敲打]"}, {"name": "Expression_40","text": "[再见]"}, {"name": "Expression_41","text": "[擦汗]"}, {"name": "Expression_42","text": "[抠鼻]"}, {"name": "Expression_43","text": "[鼓掌]"}, {"name": "Expression_44","text": "[糗大了]"}, {"name": "Expression_45","text": "[坏笑]"}, {"name": "Expression_46","text": "[左哼哼]"}, {"name": "Expression_47","text": "[右哼哼]"}, {"name": "Expression_48","text": "[哈欠]"}, {"name": "Expression_49","text": "[鄙视]"}, {"name": "Expression_50","text": "[委屈]"}, {"name": "Expression_51","text": "[快哭了]"}, {"name": "Expression_52","text": "[阴险]"}, {"name": "Expression_53","text": "[亲亲]"}, {"name": "Expression_54","text": "[吓]"}, {"name": "Expression_55","text": "[可怜]"}, {"name": "Expression_56","text": "[菜刀]"}, {"name": "Expression_57","text": "[西瓜]"}, {"name": "Expression_58","text": "[啤酒]"}, {"name": "Expression_59","text": "[篮球]"}, {"name": "Expression_60","text": "[乒乓]"}, {"name": "Expression_61","text": "[咖啡]"}, {"name": "Expression_62","text": "[饭]"}, {"name": "Expression_63","text": "[猪头]"}, {"name": "Expression_64","text": "[玫瑰]"}, {"name": "Expression_65","text": "[凋谢]"}, {"name": "Expression_66","text": "[嘴唇]"}, {"name": "Expression_67","text": "[爱心]"}, {"name": "Expression_68","text": "[心碎]"}, {"name": "Expression_69","text": "[蛋糕]"}, {"name": "Expression_70","text": "[闪电]"}, {"name": "Expression_71","text": "[炸弹]"}, {"name": "Expression_72","text": "[刀]"}, {"name": "Expression_73","text": "[足球]"}, {"name": "Expression_74","text": "[瓢虫]"}, {"name": "Expression_75","text": "[便便]"}, {"name": "Expression_76","text": "[月亮]"}, {"name": "Expression_77","text": "[太阳]"}, {"name": "Expression_78","text": "[礼物]"}, {"name": "Expression_79","text": "[拥抱]"}, {"name": "Expression_80","text": "[强]"}, {"name": "Expression_81","text": "[弱]"}, {"name": "Expression_82","text": "[握手]"}, {"name": "Expression_83","text": "[胜利]"}, {"name": "Expression_84","text": "[抱拳]"}, {"name": "Expression_85","text": "[勾引]"}, {"name": "Expression_86","text": "[拳头]"}, {"name": "Expression_87","text": "[差劲]"}, {"name": "Expression_88","text": "[爱你]"}, {"name": "Expression_89","text": "[NO]"}, {"name": "Expression_90","text": "[OK]"}, {"name": "Expression_91","text": "[爱情]"}, {"name": "Expression_92","text": "[飞吻]"}, {"name": "Expression_93","text": "[跳跳]"}, {"name": "Expression_94","text": "[发抖]"}, {"name": "Expression_95","text": "[怄火]"}, {"name": "Expression_96","text": "[转圈]"}, {"name": "Expression_97","text": "[磕头]"}, {"name": "Expression_98","text": "[回头]"}, {"name": "Expression_99","text": "[跳绳]"}, {"name": "Expression_100","text": "[投降]"}, {"name": "Expression_101","text": "[激动]"}, {"name": "Expression_102","text": "[街舞]"}, {"name": "Expression_103","text": "[献吻]"}, {"name": "Expression_104","text": "[左太极]"}, {"name": "Expression_105","text": "[右太极]"}]');
	var img_emo_key = "";
	var img_start = "<img src=../../image/emotion/";
	//表情文字代码
	img_emo_key = img_text.substring((img_text.indexOf(img_start) + img_start.length), (img_text.indexOf(".png width=30 height=30>")));
	for (var j = 0; j < getJsonObjLength(emotion_json); j++) {
		if (img_emo_key == emotion_json[j].name) {
			img_text = img_text.replace("<img src=../../image/emotion/" + img_emo_key + ".png width=30 height=30>", emotion_json[j].text);
		}
	}
	if (img_text.indexOf("<img src=../../image/emotion/") != -1) {
		return readEmoJson(jsonPath, img_text);
	}
	//		}
	//	});
	return img_text;
}

/**
 * 获取历史会话聊天记录
 * 周枫
 * 2016.1.9
 */
function getHistoryMessagesFromDb(conver_type, target_id, old_msg_id, msg_count, callback) {

	if (old_msg_id == -1) {

		getLatestHistoryMessageInfoFromDb(conver_type, target_id, 1, function(hh_limit_json) {
			if (hh_limit_json.status == 'success') {

				var msg_id = 0;
				if (getJsonObjLength(hh_limit_json.result) == 0) {

					callback(hh_limit_json);
				} else {

					msg_id = hh_limit_json.result[0].messageId;
					getHistoryMessagesListFromDb(conver_type, target_id, msg_id, msg_count, function(hh_list_json) {
						callback(hh_list_json);
					});
				}
			}
		});
	} else {

		getHistoryMessagesListFromDb(conver_type, target_id, old_msg_id, msg_count, function(hh_list_json) {

			callback(hh_list_json);
		});
	}

}

function getHistoryMessagesListFromDb(conver_type, target_id, old_msg_id, msg_count, callback) {
	var sql = "SELECT * FROM t_hh_messages WHERE conversationType = '" + conver_type + "' AND targetId = '" + target_id + "' AND owner_id = '" + owner_id + "' AND sentStatus = 'SENT' AND messageId <= " + old_msg_id + " ORDER BY sentTime DESC LIMIT " + msg_count + ";";

	dbSelectSql(sql, function(data_attr) {
		if (data_attr != false || data_attr.length == 0) {
			exeHhHistoryListByTalk(data_attr, function(hh_history_json) {
				callback(hh_history_json);
			});
		} else {
			//			api.alert({
			//				msg : '存入接收消息失败:getHistoryMessagesListFromDb'
			//			});
		}
	});
}

function getLatestHistoryMessageInfoFromDb(conver_type, target_id, count, callback) {
	var sql = "SELECT * FROM t_hh_messages WHERE conversationType = '" + conver_type + "' AND sentStatus = 'SENT' AND targetId = '" + target_id + "' AND owner_id = '" + owner_id + "' ORDER BY sentTime DESC LIMIT " + count + ";";
	dbSelectSql(sql, function(data_attr) {
		if (data_attr != false || data_attr.length == 0) {
			exeHhHistoryListByTalk(data_attr, function(hh_history_json) {
				callback(hh_history_json);
			});
		} else {
			//			api.alert({
			//				msg : '存入接收消息失败:getMaxHistoryMessageInfoFromDb'
			//			});
		}
	});
}

function exeHhHistoryListByTalk(data_attr, callback) {
	//最终会话返回的json
	var hh_history_list = {};
	//组装返回数据的数组
	var hh_history_attr = [];
	for (var i = 0; i < data_attr.length; i++) {
		//文本消息内容
		var r_text = data_attr[i].text;
		//会话json
		var result = {};
		//附内容
		var r_extra = data_attr[i].extra;
		//会话类型
		var r_conversationType = data_attr[i].conversationType;
		//消息目标 Id
		var r_targetId = data_attr[i].targetId;
		//发送出的消息状态
		var r_sentStatus = data_attr[i].sentStatus;
		//发送消息方向
		var r_messageDirection = data_attr[i].messageDirection;
		//消息类型
		var r_objectName = data_attr[i].objectName;
		//发送消息的用户 Id
		var r_senderUserId = data_attr[i].senderUserId;
		// 本会话最后一条消息 Id
		var r_messageId = parseInt(data_attr[i].messageId);
		//发送消息的时间戳
		var r_sentTime = parseInt(data_attr[i].sentTime);
		//收到消息的时间戳
		var r_receivedTime = parseInt(data_attr[i].receivedTime);
		//图片真实本地路径
		var r_imageUrl = data_attr[i].nativePath;
		//图片缩略图路径
		var r_thumbPath = data_attr[i].thumbPath;
		//语音路径
		var r_voicePath = data_attr[i].voicePath;
		//语音时长
		var r_duration = data_attr[i].duration;
		//消息的内容
		var r_content = {};

		switch(r_objectName) {
			case 'RC:TxtMsg':
				( typeof (r_text) != 'undefined') ? r_content["text"] = r_text : r_content["text"] = '';
				( typeof (r_extra) != 'undefined') ? r_content["extra"] = r_extra : r_content["extra"] = '';
				result["content"] = r_content;
				break;
			case 'RC:VcMsg':
				( typeof (r_voicePath) != 'undefined') ? r_content["voicePath"] = r_voicePath : r_content["voicePath"] = '';
				( typeof (r_duration) != 'undefined') ? r_content["duration"] = r_duration : r_content["duration"] = '';
				( typeof (r_extra) != 'undefined') ? r_content["extra"] = r_extra : r_content["extra"] = '';
				result["content"] = r_content;
				break;
			case 'RC:ImgMsg':
				( typeof (r_thumbPath) != 'undefined') ? r_content["thumbPath"] = r_thumbPath : r_content["thumbPath"] = '';
				( typeof (r_imageUrl) != 'undefined') ? r_content["imageUrl"] = r_imageUrl : r_content["imageUrl"] = '';
				( typeof (r_extra) != 'undefined') ? r_content["extra"] = r_extra : r_content["extra"] = '';
				result["content"] = r_content;
				break;
		};
		( typeof (r_conversationType) != 'undefined') ? result["conversationType"] = r_conversationType : result["conversationType"] = '';

		( typeof (r_sentStatus) != 'undefined') ? result["sentStatus"] = r_sentStatus : result["sentStatus"] = '';
		( typeof (r_objectName) != 'undefined') ? result["objectName"] = r_objectName : result["objectName"] = '';
		( typeof (r_messageDirection) != 'undefined') ? result["messageDirection"] = r_messageDirection : result["messageDirection"] = '';
		(r_messageDirection != 'SEND') ? result["receivedTime"] = r_receivedTime : result["receivedTime"] = r_sentTime;
		( typeof (r_messageId) != 'undefined') ? result["messageId"] = r_messageId : result["messageId"] = -1;
		( typeof (r_sentTime) != 'undefined') ? result["sentTime"] = r_sentTime : result["sentTime"] = 0;

		//如果是系统消息则修改
		switch(r_conversationType) {
			case 'SYSTEM':
				result["targetId"] = 'admin';
				result["senderUserId"] = 'admin';
				break;
			case 'PRIVATE':
				( typeof (r_targetId) != 'undefined') ? result["targetId"] = r_targetId : result["targetId"] = '';
				( typeof (r_senderUserId) != 'undefined') ? result["senderUserId"] = r_senderUserId : result["senderUserId"] = '';
				break;
			case 'GROUP':
				( typeof (r_targetId) != 'undefined') ? result["targetId"] = r_targetId : result["targetId"] = '';
				( typeof (r_senderUserId) != 'undefined') ? result["senderUserId"] = r_senderUserId : result["senderUserId"] = '';
				break;
		};
		hh_history_attr[i] = result;
	}
	hh_history_list["status"] = 'success';
	hh_history_list["result"] = hh_history_attr;
	callback(hh_history_list);
}

/**
 * 设置读取状态为已读
 * 周枫
 * 2016.1.18
 */
function clearMessagesUnreadStatusToDb(target_id, conver_type, callback) {
	var sql = "UPDATE t_hh_messages SET is_read = 1 WHERE conversationType = '" + conver_type + "' AND targetId = '" + target_id + "' AND owner_id = '" + owner_id + "';";
	dbExecuteSql(sql, function(is_true) {
		if (is_true) {
			callback(true);
		} else {
			callback(false);
			//			api.alert({
			//				msg : '修改消息状态失败:clearMessagesUnreadStatusToDb'
			//			});
		}
	});
}

/**
 * 获取未读消息总数
 * 周枫
 * 2017.11.09 
 */
function getTotalUnreadCountFromDb(callback) {
	var sql = "select sum(unread_count) as unread_count from (SELECT count(distinct msg.id) AS unread_count FROM t_hh_messages msg inner join t_base_person per on msg.targetId=per.login_name where msg.is_read = 0 AND msg.sentStatus = 'SENT' and per.owner_id = '"+owner_id+"' and msg.owner_id='"+owner_id+"' UNION select count(1) as unread_count FROM t_hh_messages msg inner join t_base_group grp on msg.targetId=grp.group_id where msg.is_read = 0 AND msg.sentStatus = 'SENT' and grp.owner_id = '"+owner_id+"' and msg.owner_id='"+owner_id+"' UNION select count(1) as unread_count FROM t_hh_messages msg where msg.is_read = 0 AND msg.sentStatus = 'SENT' and targetId = 'admin' and msg.owner_id='"+owner_id+"');";
	dbSelectSql(sql, function(data_attr) {
		if (data_attr != false || data_attr.length == 0) {
			callback(parseInt(data_attr[0].unread_count));
		} else {
			//			api.alert({
			//				msg : '存入接收消息失败:getHistoryMessagesListFromDb'
			//			});
		}
	});
}

/**
 * 清空所有会话
 * 周枫
 * 2016.1.8
 */
function clearConversationsToDb(callback) {
	var sql = "DELETE FROM t_hh_messages WHERE owner_id = '" + owner_id + "';";
	dbExecuteSql(sql, function(is_true) {
		if (is_true) {
			callback(true);
		} else {
			callback(false);
			//			api.alert({
			//				msg : '修改消息状态失败:clearConversationsToDb'
			//			});
		}
	});
}

//function isExistDb(callback) {
//	var fs = api.require('fs');
//	fs.exist({
//		path : BASE_FS_SQDB_PATH + BASE_FS_SQDB_NAME
//	}, function(ret, err) {
//		if (ret.exist) {
//			callback(true);
//		} else {
//			callback(false);
//		}
//	});
//}

/**
 * 获取历史消息，现在给图片获取http地址使用
 * 周枫
 * @param {Object} msg_id
 * @param {Object} conver_type
 * @param {Object} target_id
 * @param {Object} callback
 */
function getPicHttpPathByRongHis(msg_id, conver_type, target_id, callback) {
	rong.getHistoryMessages({
		conversationType : conver_type,
		targetId : target_id,
		oldestMessageId : -1,
		count : 1
	}, function(ret, err) {
		if (ret.status == 'success') {
			callback(true, ret.result);
		} else {
			callback(false, '发送图片失败，请重新发送');
		}
	})
}

/**
 * 断开连接
 * 周枫
 * 2016.1.26
 */
function disRongCon() {
	rong.disconnect({
		//断开后是否接收 Push
		isReceivePush : true
	}, function(ret, err) {

	});
}

/**
 * 设置某一会话的通知状态
 * 周枫
 * 2016.3.17
 */
function setConversationNotificationStatus(target_id, conver_type, status_type) {
	rong.setConversationNotificationStatus({
		conversationType : conver_type,
		targetId : target_id,
		notificationStatus : status_type
	}, function(ret, err) {
		if (err) {
			api.toast({
				msg : '服务器连接失败'
			});
		} else {
			if (ret.status == 'success') {
				var is_voi = ret.result.code;
				if (is_voi == 0) {
					api.execScript({
						name : 'hh_group_window',
						frameName : 'hh_group_frame',
						script : 'setVoiceIsChecked(true);'
					});
				} else if (is_voi == 1) {
					api.execScript({
						name : 'hh_group_window',
						frameName : 'hh_group_frame',
						script : 'setVoiceIsChecked(false);'
					});
				}
			} else {
				api.toast({
					msg : '服务器连接失败'
				});
			}
		}
	})
}

/**
 * 获取某一会话的通知状态
 * 周枫
 * 2016.3.17
 */
function getConversationNotificationStatus(target_id, conver_type) {
	rong.getConversationNotificationStatus({
		conversationType : conver_type,
		targetId : target_id
	}, function(ret, err) {
		if (err) {
			api.toast({
				msg : '服务器连接失败'
			});
		} else {
			if (ret.status == 'success') {
				var is_voi = ret.result.code;
				if (is_voi == 0) {
					api.execScript({
						name : 'hh_group_window',
						frameName : 'hh_group_config_frame',
						script : 'setVoiceIsChecked(true);'
					});
				} else if (is_voi == 1) {
					api.execScript({
						name : 'hh_group_window',
						frameName : 'hh_group_config_frame',
						script : 'setVoiceIsChecked(false);'
					});
				}
			} else {
				api.toast({
					msg : '服务器连接失败'
				});
			}
		}
	})
}

// 初始化

function openHhListBefore(el, t, l, p, c, h, a) {
	if (!el.classList.contains("aui-swipe-selected")) {
		openHhList(t, l, p, c, h, a);
	}
}

//function deleteHhById(el, user_id, conver_type) {
//	if (!el.classList.contains("aui-swipe-selected")) {
//		clearMessageById(user_id, conver_type);
//	}
//}

