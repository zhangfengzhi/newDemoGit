//最后一条消息的 Id，获取此消息之前的 count 条消息，没有消息第一次调用应设置为: -1
var old_msg_id;
//定义发送人
var target_id;
//会话类型，群组 系统 私人
var conver_type;
//头像
var avatar_url;
var fs_img;
var header_h;
//第一次进入时置底部
var is_fir = true;
//定义当前人员
var owner_id;
//从哪个页面进入（会话列表还是通讯录）
var h_from;
//定义是否在线
//var is_online;
apiready = function() {
	commonSetTheme({"level":2,"type":0});
	api.showProgress({
		title : '加载中...',
		text : '请稍候...',
		modal : true
	});

	//当前target_id的历史聊天记录
	//	var historyMessages = api.pageParam.historyMessages;
	target_id = api.pageParam.target_id;
	old_msg_id = api.pageParam.old_msg_id;
	conver_type = api.pageParam.conver_type;
	avatar_url = api.pageParam.avatar_url;
	header_h = api.pageParam.header_h;
	h_from = api.pageParam.h_from;
	person_name = api.pageParam.person_name;
	fs_img = api.require('fs');
	owner_id = $api.getStorage('login_name_rong');
	//页面加载时获取历史
	loadHhChatFrameData();
	//	setSendProgress();
	if (conver_type != 'SYSTEM') {
		//加载uichatbox模块
//      if($api.getStorage('identity') != 6 ){
          initUichatbox();
//      }
	}
	//监听收到新消息写入
	api.addEventListener({
		name : 'getNewMessage'
	}, function(ret) {
		if (ret && ret.value) {
			//监听成功
			var newMessageData = ret.value;
			var img_path = newMessageData.img_path;

			//根据targetId和当前会话用户id判断一下，如果相等则写入
			if (newMessageData.data.targetId == target_id) {
				//发送方向
				var send_direction = newMessageData.data.messageDirection;
				if (send_direction == 'SEND') {

					//我的头像
					var sender_img = $api.getStorage('avatar_url');
					var status_msg_id = newMessageData.data.messageId;
					var img_url = newMessageData.img_path;
					var sent_text = newMessageData.data.content.text;
//					if(newMessageData.data.content.text.indexOf('face<img src=../../image/emotion/') != -1){
//					   newMessageData.data.content.text = newMessageData.data.content.text.replaceAll('face<img src=../../image/emotion/','<img src=../../image/emotion/');  
//					   sent_text = sent_text.replaceAll('face<img src=../../image/emotion/','<img src=../../image/emotion/');  
//					}
					var sent_object = newMessageData.data.objectName;
					//RC:TxtMsg：文本消息，RC:VcMsg：语音消息，RC:ImgMsg：图片消息，RC:LBSMsg：位置消息
					switch (sent_object) {
						case 'RC:TxtMsg':
							var msg_txt = sent_text;
							if (msg_txt.indexOf('javascript:openQuestionFrame') == -1) {
								//页面写入发送消息
								$api.append($api.byId("message-content"), '<div id="hh_' + status_msg_id + '" class="aui-chat-sender"><div class="aui-chat-sender-avatar"><img onerror="this.src=\'../../image/common/header.png\'" src="' + sender_img + '"></div><div onclick="openHhMenu(\'' + msg_txt + '\',\'TxtMsg\',\'' + status_msg_id + '\');" class="aui-chat-sender-cont"><div class="aui-chat-right-triangle"></div><span>' + msg_txt + '</span></div></div>');
							} else {
								//页面写入发送消息
								$api.append($api.byId("message-content"), '<div id="hh_' + status_msg_id + '" class="aui-chat-sender"><div class="aui-chat-sender-avatar"><img onerror="this.src=\'../../image/common/header.png\'" src="' + sender_img + '"></div><div  class="aui-chat-sender-cont"><div class="aui-chat-right-triangle"></div><span>' + msg_txt + '</span></div></div>');
							}

							break;
						case 'RC:ImgMsg':
							//					if (api.systemType == 'ios') {
							$api.append($api.byId("message-content"), '<div class="aui-chat-sender"><div class="aui-chat-sender-avatar"><img onerror="this.src=\'../../image/common/header.png\'" src="' + sender_img + '"></div><div class="aui-chat-sender-img"><div class="aui-chat-right-triangle"></div><span><img id="send_img_' + status_msg_id + '" onerror="this.src=\'../../image/chatBox/hh_defalut.png\'" class="pic_thumb" onclick="openImage(\'' + img_url + '\')" src="' + img_url + '"></span></div><div id="send_progress_' + status_msg_id + '"></div></div>');
							//					}
							//					else if (api.systemType == 'android') {
							//						$api.append($api.byId("message-content"), '<div class="aui-chat-sender"><div class="aui-chat-sender-avatar"><img src="' + sender_img + '"></div><div class="aui-chat-sender-img"><div class="aui-chat-right-triangle"></div><span><img class="pic_thumb" onclick="openImage(\'' + newMessageData.data.message.content.localPath + '\')" src="' + newMessageData.data.message.content.thumbPath + '"></span></div></div>');
							//					}

							break;
						case 'RC:VcMsg':
							var con = "";
							var voice_duration = parseInt(newMessageData.data.content.duration);
							var voice_path = newMessageData.data.content.voicePath;
							var voice_d_width = voice_duration + 20;
							if (voice_d_width > 60) {
								voice_d_width = 60;
							}
							con += '<div class="aui-chat-sender"><div class="aui-chat-sender-avatar"><img onerror="this.src=\'../../image/common/header.png\'" src="' + sender_img + '"></div><div class="aui-chat-sender-cont-voice" style="width:' + voice_d_width + '%;"><div class="aui-chat-right-triangle"></div><span><img id="voice_' + status_msg_id + '" alt="98" src="../../image/chatBox/msendlog.png" width="40px" height="30px" onclick="playVoice(\'' + status_msg_id + '\',\'' + voice_path + '\',0);"/></span></div><span class="send_duration">' + voice_duration + '\'\'</span></div>';
							$api.append($api.byId("message-content"), con);
							break;
					}
				} else {
					//获取会话列表页数据
					//				var hh_index_list = $api.getStorage('hh_index_list');
					//会话头像
					var receive_img;
					var mes_type = newMessageData.data.conversationType;
					switch(mes_type) {
						case 'PRIVATE':
							receive_img = avatar_url;
							switch(newMessageData.data.objectName) {
								case 'RC:TxtMsg':
									$api.append($api.byId("message-content"), '<div id="hh_' + newMessageData.data.messageId + '" class="aui-chat-receiver"><div class="aui-chat-receiver-avatar"><img onerror="this.src=\'../../image/common/header.png\'" src="' + receive_img + '"></div><div onclick="openHhMenu(\'' + newMessageData.data.content.text + '\',\'TxtMsg\',\'' + newMessageData.data.messageId + '\');" class="aui-chat-receiver-cont"><div class="aui-chat-left-triangle"></div><span>' + newMessageData.data.content.text + '</span></div></div>');
									break;
								case 'RC:ImgMsg':
									$api.append($api.byId("message-content"), '<div class="aui-chat-receiver"><div class="aui-chat-receiver-avatar"><img onerror="this.src=\'../../image/common/header.png\'" src="' + receive_img + '"></div><div class="aui-chat-receiver-img"><div class="aui-chat-left-triangle"></div><span><img   class="pic_thumb" onclick="openImage(\'' + img_path + '\')" src="' + img_path + '" onerror="this.src=\'../../image/chatBox/hh_defalut.png\'"></span></div></div>');
									break;
								case 'RC:VcMsg':
									var con = "";
									var voice_duration = parseInt(newMessageData.data.content.duration);
									var voice_d_width = voice_duration + 20;
									if (voice_d_width > 60) {
										voice_d_width = 60;
									}
									con += '<div class="aui-chat-receiver"><div class="aui-chat-receiver-avatar"><img onerror="this.src=\'../../image/common/header.png\'" src="' + receive_img + '"></div><div class="aui-chat-receiver-cont-voice" style="width:' + voice_d_width + '%;"><div class="aui-chat-left-triangle"></div><span><img id="voice_' + newMessageData.data.messageId + '" alt="97" src="../../image/chatBox/mrecelog.png" width="40px" height="30px" onclick="playVoice(\'' + newMessageData.data.messageId + '\',\'' + newMessageData.data.content.voicePath + '\',1);"/></span></div><span class="receive_duration">' + voice_duration + '\'\'</span></div>';
									$api.append($api.byId("message-content"), con);
									break;
							}
							break;
						case 'SYSTEM':
							receive_img = avatar_url;
							$api.append($api.byId("message-content"), '<div class="aui-chat-receiver"><div class="aui-chat-receiver-avatar"><img onerror="this.src=\'../../image/common/header.png\'" src="' + receive_img + '"></div><div class="aui-chat-receiver-cont"><div class="aui-chat-left-triangle"></div><span>' + newMessageData.data.content.text + '</span></div></div>');
							break;
						case 'GROUP':
							//获取头像和说话人姓名
							var group_data = $api.getStorage('group_list_data');
							var sender_name = '';
							if ( typeof (group_data) != 'undefined') {
								group_data_list = group_data.list;
								for (var i = 0; i < getJsonObjLength(group_data_list); i++) {
									if (newMessageData.data.senderUserId == group_data_list[i].login_name) {
										sender_name = group_data_list[i].person_name;
										receive_img = group_data_list[i].head_img;
										break;
									}
								}
							}
							switch(newMessageData.data.objectName) {
								case 'RC:TxtMsg':
									var msg_txt = newMessageData.data.content.text;
									if (msg_txt.indexOf('javascript:openQuestionFrame') == -1) {
										$api.append($api.byId("message-content"), '<div id="hh_' + newMessageData.data.messageId + '" class="aui-chat-receiver"><div class="aui-chat-receiver-avatar"><img onclick="openHhByImg(\'' + newMessageData.data.senderUserId + '\',\'' + sender_name + '\',\'PRIVATE\',\'' + receive_img + '\');" onerror="this.src=\'../../image/common/header.png\'" src="' + receive_img + '"></div><div class="aui-chat-receiver-title"><em>' + sender_name + '</em></div><div onclick="openHhMenu(\'' + msg_txt + '\',\'TxtMsg\',\'' + newMessageData.data.messageId + '\');" class="aui-chat-receiver-cont"><div class="aui-chat-left-triangle"></div><span>' + msg_txt + '</span></div></div>');
									} else {
										$api.append($api.byId("message-content"), '<div id="hh_' + newMessageData.data.messageId + '" class="aui-chat-receiver"><div class="aui-chat-receiver-avatar"><img onclick="openHhByImg(\'' + newMessageData.data.senderUserId + '\',\'' + sender_name + '\',\'PRIVATE\',\'' + receive_img + '\');" onerror="this.src=\'../../image/common/header.png\'" src="' + receive_img + '"></div><div class="aui-chat-receiver-title"><em>' + sender_name + '</em></div><div  class="aui-chat-receiver-cont"><div class="aui-chat-left-triangle"></div><span>' + msg_txt + '</span></div></div>');
									}

									break;
								case 'RC:ImgMsg':
									$api.append($api.byId("message-content"), '<div class="aui-chat-receiver"><div class="aui-chat-receiver-avatar"><img onclick="openHhByImg(\'' + newMessageData.data.senderUserId + '\',\'' + sender_name + '\',\'PRIVATE\',\'' + receive_img + '\');" onerror="this.src=\'../../image/common/header.png\'" src="' + receive_img + '"></div><div class="aui-chat-receiver-title"><em>' + sender_name + '</em></div><div class="aui-chat-receiver-img"><div class="aui-chat-left-triangle"></div><span><img   class="pic_thumb" onclick="openImage(\'' + img_path + '\')" src="' + img_path + '" onerror="this.src=\'../../image/chatBox/hh_defalut.png\'"></span></div></div>');
									break;
								case 'RC:VcMsg':
									var con = "";
									var voice_duration = parseInt(newMessageData.data.content.duration);
									var voice_d_width = voice_duration + 20;
									if (voice_d_width > 60) {
										voice_d_width = 60;
									}
									con += '<div class="aui-chat-receiver"><div class="aui-chat-receiver-avatar"><img onclick="openHhByImg(\'' + newMessageData.data.senderUserId + '\',\'' + sender_name + '\',\'PRIVATE\',\'' + receive_img + '\');" onerror="this.src=\'../../image/common/header.png\'" src="' + receive_img + '"></div><div class="aui-chat-receiver-title"><em>' + sender_name + '</em></div><div class="aui-chat-receiver-cont-voice" style="width:' + voice_d_width + '%;"><div class="aui-chat-left-triangle"></div><span><img id="voice_' + newMessageData.data.messageId + '" alt="97" src="../../image/chatBox/mrecelog.png" width="40px" height="30px" onclick="playVoice(\'' + newMessageData.data.messageId + '\',\'' + newMessageData.data.content.voicePath + '\',1);"/></span></div><span class="receive_duration">' + voice_duration + '\'\'</span></div>';
									$api.append($api.byId("message-content"), con);
									break;
							}
							break;
					}
				}

			}
			goBottom();
		}

	});

	//监听发送新消息写入,这个事件主要来处理发送消息插入到会话窗口中
	api.addEventListener({
		name : 'insertSendMessage'
	}, function(ret) {
		if (ret && ret.value) {
			var newMessageData = ret.value;
			//我的头像
			var sender_img = $api.getStorage('avatar_url');
			var status_msg_id = newMessageData.data.message.messageId;
			var img_url = newMessageData.img_url;
			//RC:TxtMsg：文本消息，RC:VcMsg：语音消息，RC:ImgMsg：图片消息，RC:LBSMsg：位置消息
			switch (newMessageData.data.message.objectName) {
				case 'RC:TxtMsg':
					var msg_txt = newMessageData.data.message.content.text;
					if (msg_txt.indexOf('javascript:openQuestionFrame') == -1 && msg_txt.indexOf('javascript:openWenzhangWindow') == -1) {
						//页面写入发送消息
						$api.append($api.byId("message-content"), '<div id="hh_' + newMessageData.data.message.messageId + '" class="aui-chat-sender"><div class="aui-chat-sender-avatar"><img onerror="this.src=\'../../image/common/header.png\'" src="' + sender_img + '"></div><div onclick="openHhMenu(\'' + msg_txt + '\',\'TxtMsg\',\'' + newMessageData.data.message.messageId + '\');" class="aui-chat-sender-cont"><div class="aui-chat-right-triangle"></div><span>' + msg_txt + '</span></div><img id="status_' + status_msg_id + '" class="send_loading" src="../../image/common/loading_more.gif"/></div>');
					} else {
						//页面写入发送消息
						$api.append($api.byId("message-content"), '<div id="hh_' + newMessageData.data.message.messageId + '" class="aui-chat-sender"><div class="aui-chat-sender-avatar"><img onerror="this.src=\'../../image/common/header.png\'" src="' + sender_img + '"></div><div  class="aui-chat-sender-cont"><div class="aui-chat-right-triangle"></div><span>' + msg_txt + '</span></div><img id="status_' + status_msg_id + '" class="send_loading" src="../../image/common/loading_more.gif"/></div>');
					}

					break;
				case 'RC:ImgMsg':
					//					if (api.systemType == 'ios') {
					$api.append($api.byId("message-content"), '<div class="aui-chat-sender"><div class="aui-chat-sender-avatar"><img onerror="this.src=\'../../image/common/header.png\'" src="' + sender_img + '"></div><div class="aui-chat-sender-img"><div class="aui-chat-right-triangle"></div><span><img id="send_img_' + status_msg_id + '" onerror="this.src=\'../../image/chatBox/hh_defalut.png\'" class="pic_thumb" onclick="openImage(\'' + img_url + '\')" src="' + img_url + '"></span></div><img id="status_' + status_msg_id + '" class="send_loading" src="../../image/common/loading_more.gif" /><div id="send_progress_' + status_msg_id + '"></div></div>');
					//					}
					//					else if (api.systemType == 'android') {
					//						$api.append($api.byId("message-content"), '<div class="aui-chat-sender"><div class="aui-chat-sender-avatar"><img src="' + sender_img + '"></div><div class="aui-chat-sender-img"><div class="aui-chat-right-triangle"></div><span><img class="pic_thumb" onclick="openImage(\'' + newMessageData.data.message.content.localPath + '\')" src="' + newMessageData.data.message.content.thumbPath + '"></span></div></div>');
					//					}

					break;
				case 'RC:VcMsg':
					var con = "";
					var voice_duration = parseInt(newMessageData.data.message.content.duration);
					var voice_d_width = voice_duration + 20;
					if (voice_d_width > 60) {
						voice_d_width = 60;
					}
					con += '<div class="aui-chat-sender"><div class="aui-chat-sender-avatar"><img onerror="this.src=\'../../image/common/header.png\'" src="' + sender_img + '"></div><div class="aui-chat-sender-cont-voice" style="width:' + voice_d_width + '%;"><div class="aui-chat-right-triangle"></div><span><img id="voice_' + newMessageData.data.message.messageId + '" alt="98" src="../../image/chatBox/msendlog.png" width="40px" height="30px" onclick="playVoice(\'' + newMessageData.data.message.messageId + '\',\'' + newMessageData.data.message.content.voicePath + '\',0);"/></span></div><span class="send_duration">' + voice_duration + '\'\'</span><img id="status_' + status_msg_id + '" class="send_loading" src="../../image/loading_more.gif"/></div>';
					$api.append($api.byId("message-content"), con);
					break;
			}
		}
		goBottom();
	});
	//绑定下拉刷新历史会话事件
	api.setRefreshHeaderInfo({
		visible : true,
		loadingImg : 'widget://image/local_icon_refresh.png',
		bgColor : '#F5F5F5',
		textColor : '#8E8E8E',
		textDown : '下拉加载更多...',
		textUp : '松开加载...',
		showTime : true
	}, function(ret, err) {
		//从服务器加载数据，完成后调用commonControlRefresh()方法恢复组件到默认状态
		//调用获取历史会话监听
		//  -1  是因为查询的时候是 <=，引起重复查询最后一条
		initGetHistory(target_id, (parseInt(old_msg_id) - 1), conver_type, 20);
	});
	//获取历史会话监听，渲染页面
	api.addEventListener({
		name : 'setHistory'
	}, function(ret) {
		if (ret && ret.value) {
			var historyMessages = ret.value.data;
			if (historyMessages != '') {
				var con = '';
				//倒叙循环会话记录
				//我的头像
				var sender_img = $api.getStorage('avatar_url');
				var group_data = $api.getStorage('group_list_data');
				for (var i = getJsonObjLength(historyMessages) - 1; i >= 0; i--) {
					var targetid = historyMessages[i].targetId;
					var content = '';
					//文字还是图片还是声音 RC:TxtMsg：文本消息，RC:VcMsg：语音消息，RC:ImgMsg：图片消息，RC:LBSMsg：位置消息
					var type = historyMessages[i].objectName;
					//SEND 还是 RECEVIE
					var dir = historyMessages[i].messageDirection;
					var start = historyMessages[i].sentTime;
					//					var end = new Date();
					var g_time = new getTimeTemplate();
					//计算会话时间
					if (i == historyMessages.length - 1) {
						con += '<div class="aui-chat-sender history-date"><p>' + g_time.getTime(start, 1) + '</p></div>';
					} else {
						var M1 = historyMessages[i].sentTime;
						var M2 = historyMessages[i + 1].sentTime;
						if ((M1 - M2) >= 180 * 1000) {
							con += '<div class="aui-chat-sender history-date"><p>' + g_time.getTime(start, 1) + '</p></div>';
						}
					}
					//加载会话内容
					if (dir == 'SEND') {
						switch(type) {
							case 'RC:TxtMsg':
								var msg_txt = historyMessages[i].content.text;
								if (msg_txt.indexOf('javascript:openQuestionFrame') == -1 && msg_txt.indexOf('javascript:openWenzhangWindow') == -1) {

									con += '<div id="hh_' + historyMessages[i].messageId + '" class="aui-chat-sender"><div class="aui-chat-sender-avatar"><img onerror="this.src=\'../../image/common/header.png\'" src="' + sender_img + '"></div><div onclick="openHhMenu(\'' + msg_txt + '\',\'TxtMsg\',\'' + historyMessages[i].messageId + '\');" class="aui-chat-sender-cont"><div class="aui-chat-right-triangle"></div><span>' + historyMessages[i].content.text + '</span></div></div>';
								} else {

									con += '<div id="hh_' + historyMessages[i].messageId + '" class="aui-chat-sender"><div class="aui-chat-sender-avatar"><img onerror="this.src=\'../../image/common/header.png\'" src="' + sender_img + '"></div><div class="aui-chat-sender-cont"><div class="aui-chat-right-triangle"></div><span>' + msg_txt + '</span></div></div>';
								}

								break;
							case 'RC:VcMsg':
								var voice_duration = parseInt(historyMessages[i].content.duration);
								var voice_d_width = voice_duration + 20;
								if (voice_d_width > 60) {
									voice_d_width = 60;
								}
								con += '<div class="aui-chat-sender"><div class="aui-chat-sender-avatar"><img onerror="this.src=\'../../image/common/header.png\'" src="' + sender_img + '"></div><div class="aui-chat-sender-cont-voice" style="width:' + voice_d_width + '%;"><div class="aui-chat-right-triangle"></div><span><img id="voice_' + historyMessages[i].messageId + '" alt="98" src="../../image/chatBox/msendlog.png" width="40px" height="30px" onclick="playVoice(\'' + historyMessages[i].messageId + '\',\'' + historyMessages[i].content.voicePath + '\',0);"/></span></div><span class="send_duration">' + voice_duration + '\'\'</span></div>';
								break;
							case 'RC:ImgMsg':
								con += '<div class="aui-chat-sender"><div class="aui-chat-sender-avatar"><img onerror="this.src=\'../../image/common/header.png\'" src="' + sender_img + '"></div><div class="aui-chat-sender-img"><div class="aui-chat-right-triangle"></div><span><img   class="pic_thumb" onclick="openImage(\'' + historyMessages[i].content.imageUrl + '\')" src="' + historyMessages[i].content.imageUrl + '" onerror="this.src=\'../../image/chatBox/hh_defalut.png\'"></span></div></div>'
								break;
						}

						//渲染发送会话
						//					$api.prepend($api.byId("message-content"), '<div class="aui-chat-sender"><div class="aui-chat-sender-avatar"><img src="../../image/person/demo2.png"></div><div class="aui-chat-sender-cont"><div class="aui-chat-right-triangle"></div><span>' + historyMessages[i].content.text + '</span></div></div>');
					} else {
						//获取会话列表页数据
						//						var hh_index_list = $api.getStorage('hh_index_list');
						//会话头像
						var receive_img;
						var mes_type = historyMessages[i].conversationType;
						switch(mes_type) {
							case 'PRIVATE':
								receive_img = avatar_url;
								switch(type) {
									case 'RC:TxtMsg':
										var msg_txt = historyMessages[i].content.text;
										if (msg_txt.indexOf('javascript:openQuestionFrame') == -1 && msg_txt.indexOf('javascript:openWenzhangWindow') == -1) {
											con += '<div id="hh_' + historyMessages[i].messageId + '" class="aui-chat-receiver"><div class="aui-chat-receiver-avatar"><img onclick="openHhByImg(\'' + target_id + '\',\'' + person_name + '\',\'' + mes_type + '\',\'' + receive_img + '\');" onerror="this.src=\'../../image/common/header.png\'" src="' + receive_img + '"></div><div onclick="openHhMenu(\'' + historyMessages[i].content.text + '\',\'TxtMsg\',\'' + historyMessages[i].messageId + '\');"  class="aui-chat-receiver-cont"><div class="aui-chat-left-triangle"></div><span>' + msg_txt + '</span></div></div>';
										} else {
											con += '<div id="hh_' + historyMessages[i].messageId + '" class="aui-chat-receiver"><div class="aui-chat-receiver-avatar"><img onerror="this.src=\'../../image/common/header.png\'" src="' + receive_img + '"></div><div   class="aui-chat-receiver-cont"><div class="aui-chat-left-triangle"></div><span>' + msg_txt + '</span></div></div>';
										}

										break;
									case 'RC:VcMsg':
										var voice_duration = parseInt(historyMessages[i].content.duration);
										var voice_d_width = voice_duration + 20;
										if (voice_d_width > 60) {
											voice_d_width = 60;
										}
										con += '<div class="aui-chat-receiver"><div class="aui-chat-receiver-avatar"><img onerror="this.src=\'../../image/common/header.png\'" src="' + receive_img + '"></div><div class="aui-chat-receiver-cont-voice" style="width:' + voice_d_width + '%;"><div class="aui-chat-left-triangle"></div><span><img id="voice_' + historyMessages[i].messageId + '" alt="97" src="../../image/chatBox/mrecelog.png" width="40px" height="30px" onclick="playVoice(\'' + historyMessages[i].messageId + '\',\'' + historyMessages[i].content.voicePath + '\',1);"/></span></div><span class="receive_duration">' + voice_duration + '\'\'</span></div>';
										break;
									case 'RC:ImgMsg':
										con += '<div class="aui-chat-receiver"><div class="aui-chat-receiver-avatar"><img onerror="this.src=\'../../image/common/header.png\'" src="' + receive_img + '"></div><div class="aui-chat-receiver-img"><div class="aui-chat-left-triangle"></div><span><img class="pic_thumb"   onclick="openImage(\'' + historyMessages[i].content.imageUrl + '\')" src="' + historyMessages[i].content.imageUrl + '" onerror="this.src=\'../../image/chatBox/hh_defalut.png\'"></span></div></div>'
										break;

									//渲染接收会话
									//					$api.prepend($api.byId("message-content"), '<div class="aui-chat-receiver"><div class="aui-chat-receiver-avatar"><img src="../../image/person/demo2.png"></div><div class="aui-chat-receiver-cont"><div class="aui-chat-left-triangle"></div><span>' + historyMessages[i].content.text + '</span></div></div>');
								}
								break;
							case 'SYSTEM':
								receive_img = avatar_url;
								con += '<div class="aui-chat-receiver"><div class="aui-chat-receiver-avatar"><img onerror="this.src=\'../../image/common/header.png\'" src="' + receive_img + '"></div><div class="aui-chat-receiver-cont"><div class="aui-chat-left-triangle"></div><span>' + historyMessages[i].content.text + '</span></div></div>';
								break;
							case 'GROUP':
								//获取头像和说话人姓名和login_name

								var sender_name = '';
								var t_g_p_id = '';
								if ( typeof (group_data) != 'undefined') {
									group_data_list = group_data.list;
									for (var j = 0; j < getJsonObjLength(group_data_list); j++) {
										if (historyMessages[i].senderUserId == group_data_list[j].login_name) {
											sender_name = group_data_list[j].person_name;
											receive_img = group_data_list[j].head_img;
											t_g_p_id = group_data_list[j].login_name;
											break;
										}
									}
								}
								switch(type) {
									case 'RC:TxtMsg':
										var msg_txt = historyMessages[i].content.text;
										if (msg_txt.indexOf('javascript:openQuestionFrame') == -1 && msg_txt.indexOf('javascript:openWenzhangWindow') == -1) {
											con += '<div id="hh_' + historyMessages[i].messageId + '" class="aui-chat-receiver"><div class="aui-chat-receiver-avatar"><img onclick="openHhByImg(\'' + t_g_p_id + '\',\'' + sender_name + '\',\'PRIVATE\',\'' + receive_img + '\');" onerror="this.src=\'../../image/common/header.png\'" src="' + receive_img + '"></div><div class="aui-chat-receiver-title"><em>' + sender_name + '</em></div><div onclick="openHhMenu(\'' + historyMessages[i].content.text + '\',\'TxtMsg\',\'' + historyMessages[i].messageId + '\');" class="aui-chat-receiver-cont"><div class="aui-chat-left-triangle"></div><span>' + historyMessages[i].content.text + '</span></div></div>';
										} else {
											con += '<div id="hh_' + historyMessages[i].messageId + '" class="aui-chat-receiver"><div class="aui-chat-receiver-avatar"><img onclick="openHhByImg(\'' + t_g_p_id + '\',\'' + sender_name + '\',\'PRIVATE\',\'' + receive_img + '\');" onerror="this.src=\'../../image/common/header.png\'" src="' + receive_img + '"></div><div class="aui-chat-receiver-title"><em>' + sender_name + '</em></div><div   class="aui-chat-receiver-cont"><div class="aui-chat-left-triangle"></div><span>' + historyMessages[i].content.text + '</span></div></div>';
										}

										break;
									case 'RC:VcMsg':
										var voice_duration = parseInt(historyMessages[i].content.duration);
										var voice_d_width = voice_duration + 20;
										if (voice_d_width > 60) {
											voice_d_width = 60;
										}
										con += '<div class="aui-chat-receiver"><div class="aui-chat-receiver-avatar"><img onclick="openHhByImg(\'' + t_g_p_id + '\',\'' + sender_name + '\',\'PRIVATE\',\'' + receive_img + '\');"  onerror="this.src=\'../../image/common/header.png\'" src="' + receive_img + '"></div><div class="aui-chat-receiver-title"><em>' + sender_name + '</em></div><div class="aui-chat-receiver-cont-voice" style="width:' + voice_d_width + '%;"><div class="aui-chat-left-triangle"></div><span><img id="voice_' + historyMessages[i].messageId + '" alt="97" src="../../image/chatBox/mrecelog.png" width="40px" height="30px" onclick="playVoice(\'' + historyMessages[i].messageId + '\',\'' + historyMessages[i].content.voicePath + '\',1);"/></span></div><span class="receive_duration">' + voice_duration + '\'\'</span></div>';
										break;
									case 'RC:ImgMsg':
										con += '<div class="aui-chat-receiver"><div class="aui-chat-receiver-avatar"><img onclick="openHhByImg(\'' + t_g_p_id + '\',\'' + sender_name + '\',\'PRIVATE\',\'' + receive_img + '\');"  onerror="this.src=\'../../image/common/header.png\'" src="' + receive_img + '"></div><div class="aui-chat-receiver-title"><em>' + sender_name + '</em></div><div class="aui-chat-receiver-img"><div class="aui-chat-left-triangle"></div><span><img class="pic_thumb"   onclick="openImage(\'' + historyMessages[i].content.imageUrl + '\')" src="' + historyMessages[i].content.imageUrl + '" onerror="this.src=\'../../image/chatBox/hh_defalut.png\'"></span></div></div>'
										break;

									//渲染接收会话
									//					$api.prepend($api.byId("message-content"), '<div class="aui-chat-receiver"><div class="aui-chat-receiver-avatar"><img src="../../image/person/demo2.png"></div><div class="aui-chat-receiver-cont"><div class="aui-chat-left-triangle"></div><span>' + historyMessages[i].content.text + '</span></div></div>');
								}
								break;
						}
					}
					//获取刷新后最后一条ID
					if (i == historyMessages.length - 1) {
						old_msg_id = historyMessages[i].messageId;
					}
				}
				//				$api.css($api.byId('hh_update_div'), 'display:none;');
				//加载历史聊天记录
				$api.prepend($api.byId("message-content"), con);
			} else {
				old_msg_id = -1;
			}
		}
		//通知顶部下拉刷新数据加载完毕，组件会恢复到默认状态
		commonControlRefresh();
		//隐藏进度提示框
		api.hideProgress();
		//		if (old_msg_id == -1) {
		//			goBottom();
		//		}
		//第一次进入时置底部
		if (is_fir) {
			goBottom();
			is_fir = false;
		} else {
			if (old_msg_id == -1) {
				api.toast({
					msg : '已经加载完成全部会话内容',
					location : 'top'
				});
			}

		}
	});

	//	//监听发送新消息写入,这个事件主要来处理发送消息插入到会话窗口中
	//	api.addEventListener({
	//		name : 'insertSendMessage'
	//	}, function(ret) {
	//		if (ret && ret.value) {
	//			var newMessageData = ret.value;
	//			//			alert(JSON.stringify(newMessageData));
	//			//页面写入发送消息
	//			$api.append($api.byId("message-content"), '<div class="aui-chat-sender"><div class="aui-chat-sender-avatar"><img src="../../image/person/demo2.png"></div><div class="aui-chat-sender-cont"><div class="aui-chat-right-triangle"></div><span>' + newMessageData.data.message.content.text + '</span></div></div>');
	//		}
	//	});
	//	//监听收到新消息写入
	//	api.addEventListener({
	//		name : 'getNewMessage'
	//	}, function(ret) {
	//		if (ret && ret.value) {
	//			//监听成功
	//			var newMessageData = ret.value;
	//			//根据targetId和当前会话用户id判断一下，如果相等则写入
	//			if (newMessageData.data.targetId == targetId) {
	//				$api.append($api.byId("message-content"), '<div class="aui-chat-receiver"><div class="aui-chat-receiver-avatar"><img src="../../image/person/demo2.png"></div><div class="aui-chat-receiver-cont"><div class="aui-chat-left-triangle"></div><span>' + newMessageData.data.content.text + '</span></div></div>');
	//			}
	//		}
	//	});
	//绑定发送多个图片的监听
	sendPic();
	//发送语音消息
	sendVoi();
	//从后台返回到前台
	reAppFromBack();
	//下拉刷新数据
	//	refreshHeaderInfo();
}
/**
 *滚动页面底部
 * 周枫
 * 2015.08.11
 */
function goBottom() {
	document.getElementsByTagName('body')[0].scrollTop = document.getElementsByTagName('body')[0].scrollHeight;
}

/**
 * 发送文本消息
 * 周枫
 * 2015.08.08
 * @param {Object} sendMsg
 */
function sendText(send_msg_old, sendMsg, conver_type) {
	//向会话列表页发送消息事件
	api.sendEvent({
		name : 'sendMessage',
		extra : {
			type : 'text',
			targetId : '' + target_id + '',
			content : sendMsg,
			contentOld : send_msg_old,
			conversationType : conver_type,
			extra : ''
		}
	})
}

/**
 * 发送图片消息
 * 周枫
 * 2015.08.11
 * @param {Object} img_url
 */
function sendPic() {
	api.addEventListener({
		name : 'setPicurl'
	}, function(ret) {
		if (ret && ret.value) {
			var value = ret.value;
			switch(value.pic_source) {
				case 'camera':
					//向会话列表页发送消息事件
					api.sendEvent({
						name : 'sendMessage',
						extra : {
							type : 'pic',
							targetId : '' + target_id + '',
							imgSrc : value.imgSrc,
							conversationType : value.conver_type,
							pic_source : value.pic_source,
							extra : ''
						}
					})
					break;
				case 'album':
					//向会话列表页发送消息事件
					api.sendEvent({
						name : 'sendMessage',
						extra : {
							type : 'pic',
							targetId : '' + target_id + '',
							img_list : value.image_list,
							conversationType : value.conver_type,
							pic_source : value.pic_source,
							extra : ''
						}
					})
					break;
			}

		}
	});

}

/**
 * 发送语音消息
 * 周枫
 * 2015.08.12
 */
function sendVoi() {
	api.addEventListener({
		name : 'setVoice'
	}, function(ret) {
		if (ret && ret.value) {
			var value = ret.value.voice_result;
			//向会话列表页发送消息事件
			api.sendEvent({
				name : 'sendMessage',
				extra : {
					type : 'voi',
					targetId : '' + target_id + '',
					voicePath : value.path,
					duration : value.duration,
					conversationType : ret.value.conver_type,
					extra : ''
				}
			})
		}
	});
}

/**
 * 展示图片
 * 周枫
 * 2015.08.12
 * @param {Object} message_id
 */
function openImage(img_url) {
	selectHhTotalImgByIdFromDb(target_id, conver_type, owner_id, function(img_list_attr) {
		//		var img_obj = api.require('imageBrowser');
		var img_count = 0;
		var img_urls = [];
		for (var i = 0; i < img_list_attr.length; i++) {
			//			(img_list_attr[i].nativePath != '') ? img_urls[i] = img_list_attr[i].nativePath : img_urls[i] = img_list_attr[i].imagePath;
			//使用photobrowser后修改
			img_urls[i] = img_list_attr[i].imagePath;
			//			if (img_url == img_list_attr[i].nativePath) {
			//				img_count = i;
			//			} else {
			//				img_count = img_list_attr.length  - 1;
			//			}
		}
		for (var i = 0; i < img_list_attr.length; i++) {
			if (img_url == img_list_attr[i].nativePath) {
				img_count = i;
				break;
			} else {
				img_count = img_list_attr.length - 1;
			}
		}
		photoBrowser.open(img_urls, img_count);
		//打开相册
		//		img_obj.openImages({
		//			imageUrls : img_urls,
		//			//是否以九宫格方式显示图片
		//			showList : false,
		//			activeIndex : img_count,
		//			tapClose : false
		//		});
	});
}

/**
 * 播放语音
 * 周枫
 * 2015.08.12
 */
function playVoice(id, voicePath, whosend) {
	var objs = document.getElementsByTagName("img");
	for (var i = 0; i < objs.length; i++) {
		if (objs[i].alt == '98') {
			objs[i].src = '../../image/chatBox/msendlog.png';
		} else if (objs[i].alt == '97') {
			objs[i].src = '../../image/chatBox/mrecelog.png';
		}
	}
	api.stopPlay();
	if (whosend == 0) {
		document.getElementById('voice_' + id).src = '../../image/chatBox/msendgif.gif';
	} else {
		document.getElementById('voice_' + id).src = '../../image/chatBox/mrecegif.gif';
	}
	api.startPlay({
		path : voicePath
	}, function() {
		if (whosend == 0) {
			document.getElementById('voice_' + id).src = '../../image/chatBox/msendlog.png';
		} else {
			document.getElementById('voice_' + id).src = '../../image/chatBox/mrecelog.png';
		}
	});
}

/**
 * 获取历史聊天记录
 * 周枫
 * 2015.08.20
 * @param {Object} target_id 会话人
 * @param {Object} old_msg_id 最新会话id
 * @param {Object} conver_type 会话类型
 * @param {Object} msg_count 获取条数
 */
function initGetHistory(target_id, old_msg_id, conver_type, msg_count) {
	api.sendEvent({
		name : 'getHistory',
		extra : {
			type : conver_type,
			old_msg_id : old_msg_id,
			target_id : target_id,
			msg_count : msg_count
		}
	});
}

/**
 * 从后台返回
 * 周枫
 * 2015.09.02
 */
function reAppFromBack() {
	api.addEventListener({
		name : 'resume'
	}, function(ret, err) {
		goBottom();
	});
}

/**
 * 打开应用模块
 * 周枫
 * 2015.11.18
 * @param {Object} yy_name
 */
function openYyFun(yy_name) {
//	if(api.uiMode == 'pad'){
//		if(yy_name == 'bjtz_index_window'){
//			yy_name = 'bjtzIpad_index_window';
//		}
//		if(yy_name == 'xwzx_index_window'){
//			yy_name = 'xwzxIpad_index_window';
//		}
//		if(yy_name == 'zuoyeXsJy_index_window'){
//			yy_name = 'zuoyeIpad_index_window';
//		}
//		if(yy_name == 'daoxueNewXs_index_window'){
//			yy_name = 'daoxueNew_index_window';
//		}
//		if(yy_name == 'kejianJyXs_index_window'){
//			yy_name = 'kejianNew_index_window';
//		}
//	}
	var is_open = false;
	for (var i = 0; i < BASE_YY_OPEN.length; i++) {
		if (yy_name == BASE_YY_OPEN[i]) {
			is_open = true;
		}
	}

	if (is_open) {
		if (yy_name == 'txl_addfriends_window') {
			openModule({"win_url":"txl_addfriends_window","type":"11","code":"","mode_type":1});
		}else if(yy_name == 'noticeIpad_index_window'){
			openModule({"win_url":"noticeIpad_index_window","type":"4","code":"hjx_rcbg_tzgg"});
		} else {
			var idy_type = $api.getStorage('idy_type');
			var jsonPath = "widget://res/json/init_json/init_"+idy_type+".json";
			commonBaseConfig(jsonPath,function(data) {
				for(var i = 0; i < data.list.length; i++){
					if(data.list[i].win_url == yy_name){
						openModule(data.list[i]);
					}
				}
			});
		}
	} else {
		api.alert({
			msg : '对不起，当前应用尚未开通。'
		}, function(ret, err) {
			//coding...
		});
	}

}

/**
 * 清除正在发送图标
 * 周枫
 * 2015.12.10
 * @param {Object} msg_id
 */
function removeload(msg_id, native_path) {
	var load = $api.byId('status_' + msg_id);
	$api.remove(load);
	if (native_path != '') {
		var img_pic = document.getElementById('send_img_' + msg_id);
		img_pic.src = native_path;
	}

}

/**
 * 加载会话
 * 区分群组和私人会话
 * 群组：1.加载群组成员 2.加载历史会话
 * 私人：1.加载历史会话
 * 周枫
 * 2016.1.7
 */
function loadHhChatFrameData() {
	//	isOnLine();
	//	var is_online = parseInt($api.getStorage('is_online'));

	switch(conver_type) {
		case 'GROUP':
			var p_json = {};
			p_json["targetId"] = target_id;
			//查询数据库中是否存在当前群组
			selectIsExistGroupInDb(p_json, function(is_true, g_list_json) {

				if (is_true) {
					//查询当前群组是否有成员
					selectIsHavePersonInGroup(target_id, function(p_count) {

						//群组已经存在数据库
						if (p_count > 0) {
							isOnLineStatus(function(is_online, line_type) {
								//在线
								if (is_online) {
									//从数据库中读取群组成员
									getGroupListByIdFromDb(target_id, 1, 1, function(group_list) {

										if (group_list == false) {
											//从数据库中读取群组成员
											api.alert({
												msg : '当前群组已经解散，您不能进行会话'
											}, function(ret, err) {
												closeUiChatBox();
												//页面加载时获取历史
												initGetHistory(target_id, -1, conver_type, 20);
												setTimeout('goBottom()', 500);
											});
										} else {
											$api.setStorage('group_list_data', group_list);
											//重写标题
											api.execScript({
												name : 'hh_chat_window',
												script : 'initHeaer();'
											});
											//页面加载时获取历史
											initGetHistory(target_id, -1, conver_type, 20);

											setTimeout('goBottom()', 500);
										}
									});
								} else {

									//从数据库中读取群组成员
									getGroupListByIdFromDb(target_id, 1, 0, function(group_list) {
										//										$api.setStorage('group_list_data', group_list);
										//页面加载时获取历史
										initGetHistory(target_id, -1, conver_type, 20);
										setTimeout('goBottom()', 500);
									});
								}
							});
						} else {
							isOnLineStatus(function(is_online, line_type) {
								//在线
								if (is_online) {
									//从数据库中读取群组成员
									getGroupListByIdFromDb(target_id, 1, 1, function(group_list) {
										if (group_list == false) {
											//从数据库中读取群组成员
											api.alert({
												msg : '当前群组已经解散，您不能进行会话'
											}, function(ret, err) {
												closeUiChatBox();
												//页面加载时获取历史
												initGetHistory(target_id, -1, conver_type, 20);
												setTimeout('goBottom()', 500);
											});
										} else {
											$api.setStorage('group_list_data', group_list);
											//重写标题
											api.execScript({
												name : 'hh_chat_window',
												script : 'initHeaer();'
											});
											//页面加载时获取历史
											initGetHistory(target_id, -1, conver_type, 20);
											setTimeout('goBottom()', 500);
										}
									});
								} else {
									//从数据库中读取群组成员
									api.alert({
										msg : '当前群组暂无数据，请连接网络后查询'
									}, function(ret, err) {
										api.execScript({
											name : 'hh_chat_window',
											script : 'back();'
										});
									});
								}
							});
						}
					});
				} else {
					api.alert({
						msg : '对不起，当前群组已经解散'
					}, function(ret, err) {
						api.execScript({
							name : 'hh_chat_window',
							script : 'back();'
						});
					});
				}
			});

			break;
		case 'PRIVATE':
			var p_json = {};
			p_json["targetId"] = target_id;
			selectIsExistPersonInDb(p_json, function(is_true, p_list_json) {
				if (is_true) {
					//页面加载时获取历史
					initGetHistory(target_id, -1, conver_type, 20);
					setTimeout('goBottom()', 500);
				} else {
					api.alert({
						msg : '对不起，当前人员已经被删除'
					}, function(ret, err) {
						api.execScript({
							name : 'hh_chat_window',
							script : 'back();'
						});
					});
				}
			});
			break;
		case 'SYSTEM':
			//页面加载时获取历史
			initGetHistory(target_id, -1, conver_type, 20);
			setTimeout('goBottom()', 500);
			break;
	}

}

var chatBox;
/**
 *加载uichatbox模块
 * 周枫
 * 2015.08.08
 */
function initUichatbox() {
	//引入chatbox
	chatBox = api.require('UIChatBox');
	//获取表情存放路径
	var sourcePath = BASE_EMOTION_PATH;
	//表情存放目录
	var emotionData;
	//存储表情
	getImgsPaths(sourcePath, function(emotion) {
		emotionData = emotion;
	})
	chatBox.open({
		placeholder : '',
		//输入框显示的最大行数（高度自适应）
		maxRows : 4,
		//自定义表情文件夹（表情图片所在的文件夹，须同时包含一个与该文件夹同名的.json配置文件）的路径
		//.json文件内的 name 值必须与表情文件夹内表情图片名对应
		emotionPath : sourcePath,
		//聊天输入框模块可配置的文本
		texts : {
			//（可选项）JSON对象；录音按钮文字内容
			recordBtn : {
				//（可选项）字符串类型；按钮常态的标题，默认：'按住 说话'
				normalTitle : '按住 说话',
				//（可选项）字符串类型；按钮按下时的标题，默认：'松开 结束'
				activeTitle : '松开 结束'
			}
		},
		//模块各部分的样式集合
		styles : {
			//（可选项）JSON对象；输入区域（输入框及两侧按钮）整体样式
			inputBar : {
				borderColor : '#d9d9d9',
				bgColor : '#f2f2f2'
			},
			//（可选项）JSON对象；输入框样式
			inputBox : {
				borderColor : '#B3B3B3',
				bgColor : '#FFFFFF'
			},
			//JSON对象；表情按钮样式
			emotionBtn : {
				normalImg : BASE_CHATBOX_PATH + '/chatBox_face1.png'
			},
			//（可选项）JSON对象；附加功能按钮样式，不传则不显示附加功能按钮
			extrasBtn : {
				normalImg : BASE_CHATBOX_PATH + '/chatBox_add1.png'
			},
			//JSON对象；键盘按钮样式
			keyboardBtn : {
				normalImg : BASE_CHATBOX_PATH + '/chatBox_key3.png'
			},
			//（可选项）JSON对象；输入框左侧按钮样式，不传则不显示左边的语音按钮
			speechBtn : {
				normalImg : BASE_CHATBOX_PATH + '/chatBox_key1.png'
			},
			//JSON对象；“按住 录音”按钮的样式
			recordBtn : {
				//（可选项）字符串类型；按钮常态的背景，支持rgb，rgba，#，图片路径（本地路径，fs://，widget://）；默认：'#c4c4c4'
				normalBg : '#c4c4c4',
				//（可选项）字符串类型；按钮按下时的背景，支持rgb，rgba，#，图片路径（本地路径，fs://，widget://）；默认：'#999999'；
				//normalBg 和 activeBg 必须保持一致，同为颜色值，或同为图片路径
				activeBg : '#999999',
				color : '#000',
				size : 14
			},
			//（可选项）JSON对象；表情和附加功能面板的小圆点指示器样式，若不传则不显示该指示器
			indicator : {
				//（可选项）字符串类型；配置指示器的显示区域；默认：'both'
				//取值范围：
				//both（表情和附加功能面板皆显示）
				//emotionPanel（表情面板显示）
				//extrasPanel（附加功能面板显示）
				target : 'both',
				color : '#c4c4c4',
				activeColor : '#9e9e9e'
			}
		},
		//（可选项）点击附加功能按钮，打开的附加功能面板的按钮样式，配合 extrasBtn 一起使用，若 extrasBtn 参数内 normalImg 属性不传则此参数可不传
		extras : {
			titleSize : 10,
			titleColor : '#a3a3a3',
			//数组类型；附加功能按钮的样式
			btns : [{
				title : '图片',
				//（可选项）字符串类型；按钮常态的背景图片
				normalImg : BASE_CHATBOX_PATH + '/chatBox_album1.png',
				//（可选项）字符串类型；按钮按下时的背景图片
				activeImg : BASE_CHATBOX_PATH + '/chatBox_album2.png'
			}, {
				title : '拍照',
				normalImg : BASE_CHATBOX_PATH + '/chatBox_cam1.png',
				activeImg : BASE_CHATBOX_PATH + '/chatBox_cam2.png'
			}]
		}
	}, function(ret, err) {
		//字符串类型；回调的事件类型，
		//取值范围：
		//show（该模块打开成功）
		//send（用户点击发送按钮）
		//clickExtras（用户点击附加功能面板内的按钮）
		//数字类型；当 eventType 为 clickExtras 时，此参数为用户点击附加功能按钮的索引，否则为 undefined
		//字符串类型；当 eventType 为 send 时，此参数返回输入框的内容，否则返回 undefined

		//点击附加功能面板
		if (ret.eventType == 'clickExtras') {
			var c_index = ret.index;
			switch(c_index) {
				case 0:
					//相册选
					getPicture("album");
					break;
				case 1:
					//现在照
					getPicture("camera");
					break;
			}

		}
		//点击发送按钮
		if (ret.eventType == 'send') {
			/*
			 *1.用户输入文字或表情
			 */
			/*用户输入表情或文字*/
			/*使用读文件方法，读json*/
			var send_msg_old = ret.msg;
			//过滤html标签
			send_msg_old = commonRemoveHTMLTag(send_msg_old);
			/*将文字中的表情符号翻译成图片，并可自定义图片尺寸*/
			function transText(text, imgWidth, imgHeight) {
				var imgWidth = imgWidth || 30;
				var imgHeight = imgHeight || 30;
				var regx = /\[(.*?)\]/gm;
				var textTransed = text.replace(regx, function(match) {

					var imgSrc = emotionData[match];
					if (!imgSrc) {
						//说明不对应任何表情，直接返回
						return match;
					}
					var img = "<img src=" + imgSrc + " width=" + imgWidth + " height=" + imgHeight + ">";

					return img;
				});
				textTransed = transferBr(textTransed);
				return textTransed;
			}

			var sendMsg = transText(send_msg_old);

			if ($api.trimAll(sendMsg).length != 0) {
				sendText(send_msg_old, sendMsg, conver_type);
			} else {
				//为ipad写的
				api.toast({
					msg : '对不起，消息不能为空',
					duration : 2000,
					location : "middle"
				});
			}

		}
	});

	//加载录音按钮事件
	/**
	 press（按下录音按钮）
	 press_cancel（松开录音按钮）
	 move_out（按下录音按钮后，从按钮移出）
	 move_out_cancel（按下录音按钮后，从按钮移出并松开按钮）
	 move_in（move_out 事件后，重新移入按钮区域）
	 */
	chatBox.addEventListener({
		target : 'recordBtn',
		name : 'press'
	}, function(ret, err) {
		//开始录音
		startRecord();
	});
	//（松开录音按钮）
	chatBox.addEventListener({
		target : 'recordBtn',
		name : 'press_cancel'
	}, function(ret, err) {
		setTimeout(function() {
			stopRecord();
		}, 1000);

	});
	//move_out（按下录音按钮后，从按钮移出）
	chatBox.addEventListener({
		target : 'recordBtn',
		name : 'move_out'
	}, function(ret, err) {
		setTimeout(function() {
			api.execScript({
				name : '',
				frameName : 'hh_voice_window',
				script : 'moveOut()'
			});
		}, 1000);
	});
	//move_out_cancel（按下录音按钮后，从按钮移出并松开按钮）
	chatBox.addEventListener({
		target : 'recordBtn',
		name : 'move_out_cancel'
	}, function(ret, err) {
		api.stopRecord(function(ret, err) {
			if (ret) {
				removefile(ret.path);
			}
		});
		api.closeFrame({
			name : 'hh_voice_window'
		});
	});
	//move_in（move_out 事件后，重新移入按钮区域）
	chatBox.addEventListener({
		target : 'recordBtn',
		name : 'move_in'
	}, function(ret, err) {
		api.execScript({
			name : '',
			frameName : 'hh_voice_window',
			script : 'moveIn()'
		});
	});
	//输入框绑定
	/**
	 *
	 move（输入框所在区域弹动事件）
	 change（输入框所在区域高度改变）
	 showRecord（用户点击左侧语音按钮）
	 showEmotion（用户点击表情按钮）
	 showExtras（用户点击右侧附加功能按钮，如果 open 时传了 extras 参数才会有此回调）

	 */
	//move（输入框所在区域弹动事件）  就是输入框收起和弹出变化
	chatBox.addEventListener({
		target : 'inputBar',
		name : 'move'
	}, function(ret, err) {
		//		  api.toast({msg: JSON.stringify(ret),location: 'top'}); //50
		//			    api.toast({msg: JSON.stringify(err),location: 'middle'}); //283
		//点击输入框时会话界面高度发生变化
		setChatFrameByInputMove(ret.inputBarHeight, ret.panelHeight);
	});

	//change（输入框所在区域高度改变）
	chatBox.addEventListener({
		target : 'inputBar',
		name : 'change'
	}, function(ret, err) {
		//		  api.toast({msg: JSON.stringify(ret),location: 'top'}); //50
		//			    api.toast({msg: JSON.stringify(err),location: 'middle'}); //283
		//点击输入框时会话界面高度发生变化
		setChatFrameByInputChange(ret.inputBarHeight, ret.panelHeight);
	});
}

function closeUiChatBox() {
	$api.css($api.byId('menu'), 'display:none;');
	chatBox.close();
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

		}
	});
}

/**
 *开始录音
 * 周枫
 * 2015.08.10
 */
function startRecord() {
	//先删除再录音
	api.stopRecord(function(ret, err) {
		if (ret) {
			removefile(ret.path);
		}
	});
	api.openFrame({
		name : 'hh_voice_window',
		url : '../../html/huihua/hh_voice_window.html',
		scrollToTop : true,
		bgColor : 'rgba(0,0,0,0.0)',
		rect : {
			x : 0,
			y : 0,
			w : 'auto',
			h : api.winHeight - 50,
		},
	});
	//点击后播放开启录音的声音
	api.startPlay({
		path : 'widget://res/LowBattery.mp3'
	}, function() {
		api.startRecord();
	});
}

/**
 * 结束录音
 * path:'',              //字符串，返回的音频地址
 duration:0            //数字类型，音频的时长
 * 周枫
 * 2015.08.10
 */
function stopRecord() {
	api.stopRecord(function(ret, err) {
		if (ret) {
			if (ret.duration == 0 || ret.duration < 1) {
				api.execScript({
					name : '',
					frameName : 'hh_voice_window',
					script : 'moveShort()'
				});
				removefile(ret.path);
			} else if (ret.duration > 60) {
				api.execScript({
					name : '',
					frameName : 'hh_voice_window',
					script : 'moveLong()'
				});
				removefile(ret.path);
			} else {
				api.sendEvent({
					name : 'setVoice',
					extra : {
						voice_result : ret,
						conver_type : conver_type
					}
				});
			}
			setTimeout("api.closeFrame({name: 'hh_voice_window'})", 400);
		} else {
			api.execScript({
				name : '',
				frameName : 'hh_voice_window',
				script : 'moveShort()'
			});
			setTimeout("api.closeFrame({name: 'hh_voice_window'})", 400);
		}
	});
}

/**
 * 点击输入框时会话界面高度发生变化
 *  inputBarHeight: 50,    //数字类型；输入框及左右按钮整体区域的高度，仅当监听 inputBar 的 move 和 change 事件时本参数有值
 panelHeight: 300       //数字类型；输入框下边缘距离屏幕底部的高度，仅当监听 inputBar 的 move 和 change 事件时本参数有值
 * 周枫
 * 2015.08.10
 */
function setChatFrameByInputMove(inputBarHeight, panelHeight) {
	if (inputBarHeight > 0) {//输入框打开时
		api.setFrameAttr({
			name : 'hh_chat_frame',
			rect : {
				x : 0,
				y : header_h,
				w : 'auto',
				h : api.winHeight - header_h - inputBarHeight - panelHeight,
			},
		});
	} else {//关闭时
		api.setFrameAttr({
			name : 'chatFrame',
			rect : {
				x : 0,
				y : header_h,
				w : 'auto',
				h : api.winHeight - header_h - inputBarHeight,
			},
		});
		closeKeyBoard();
	}
	setTimeout('goBottom()', 200);
}

/**
 * 输入框内文字行数，现设置为最多4行
 *  inputBarHeight: 50,    //数字类型；输入框及左右按钮整体区域的高度，仅当监听 inputBar 的 move 和 change 事件时本参数有值
 panelHeight: 300       //数字类型；输入框下边缘距离屏幕底部的高度，仅当监听 inputBar 的 move 和 change 事件时本参数有值
 * 周枫
 * 2015.08.10
 */
function setChatFrameByInputChange(inputBarHeight, panelHeight) {
	api.setFrameAttr({
		name : 'hh_chat_frame',
		rect : {
			x : 0,
			y : header_h,
			w : 'auto',
			h : api.winHeight - header_h - inputBarHeight - panelHeight,
		},
	});
	setTimeout('goBottom()', 200);
}

/**
 *  通过系统相册或拍照获取图片和视频
 sourceType：（可选项）图片源类型，从相册、图片库或相机获取图片，  library：图片库，camera：相机，album：相册
 encodingType：（可选项）返回图片类型，jpg或png，默认值：png
 mediaValue：（可选项）媒体类型，图片或视频 ，pic：图片，video：视频
 destinationType：（可选项）返回数据类型，指定返回图片地址或图片经过base64编码后的字符串
 allowEdit：（可选项）是否可以选择图片后进行编辑，只支持iOS，默认值：false
 quality：（可选项）图片质量，只针对jpg格式图片（0-100整数），默认值：50
 targetWidth：（可选项）压缩后的图片宽度，图片会按比例适配此宽度，默认值：原图宽度
 targetHeight：（可选项）压缩后的图片高度，图片会按比例适配此高度，默认值：原图高度
 saveToPhotoAlbum：（可选项）拍照或录制视频后是否保存到相册，默认值：false
 callback
 {
 data:"",                //图片路径
 base64Data:"",          //base64数据，destinationType为base64时返回
 duration:0              //视频时长（数字类型）
 }
 * 通过系统相册或拍照获取图片和视频
 * 周枫
 * 2015.08.11
 * @param {Object} sourceType
 */
function getPicture(sourceType) {
	switch(sourceType) {
		case 'camera':
			//获取一张图片
			api.getPicture({
				sourceType : sourceType,
				encodingType : 'png',
				mediaValue : 'pic',
				allowEdit : false,
				quality : 80,
				//		targetWidth : 100,
				//		targetHeight : 1280,
				saveToPhotoAlbum : true
			}, function(ret, err) {
				if (ret) {
					var imgSrc = ret.data;
					if (imgSrc != "") {
						api.sendEvent({
							name : 'setPicurl',
							extra : {
								imgSrc : imgSrc,
								pic_source : 'camera',
								conver_type : conver_type
							}
						});
					}
					//					sendPic(imgSrc);
				}
			});
			break;
		case 'album':
			//UIAlbumBrowser 是一个多媒体扫描器，可扫描系统的图片、视频等多媒体资源
			var obj = api.require('UIAlbumBrowser');
            obj.open({
                //返回的资源种类,image（图片）,video（视频）,all（图片和视频）
                type : 'image',
                //（可选项）图片显示的列数，须大于1
                column : 4,
                max : 9,
                //（可选项）图片排序方式,asc（旧->新）,desc（新->旧）
                sort : {
                    key : 'time',
                    order : 'desc'
                },
                //（可选项）模块各部分的文字内容
                texts : {
                    stateText : '已选择*项',
                    cancelText : '取消',
                    finishText : '完成'
                },
                styles : {
                    bg : '#fff',
                    mark : {
                        icon : '',
                        position : 'bottom_right',
                        size : 20
                    },
                    nav : {
                        bg : '#eee',
                        stateColor : '#000',
                        stateSize : 18,
                        cancleBg : 'rgba(0,0,0,0)',
                        cancelColor : '#000',
                        cancelSize : 18,
                        finishBg : 'rgba(0,0,0,0)',
                        finishColor : api.systemType == "android"?'#000':'#fff',
                        finishSize : 18,
                        unFinishColor: 'rgba(0,0,0,0)',
                        titleColor: '#000',
                    },
                    bottomTabBar: {
                        previewTitleColor: "#fff",

                    }
                },
				rotation : true,
                showPreview : false,
                showBrowser : true
			}, function(ret) {
				//callback
				// list: [{                    //数组类型；返回选定的资源数组
				//path: '',                    //字符串类型；资源路径，返回资源在本地的绝对路径
				//thumbPath: '',               //字符串类型；缩略图路径，返回资源在本地的绝对路径
				//suffix: '',                  //字符串类型；文件后缀名，如：png，jpg, mp4
				//size: 1048576,               //数字类型；资源大小，单位（Bytes）
				//time: '2015-06-29 15:49'     //字符串类型；资源创建时间，格式：yyyy-MM-dd HH:mm:ss
				//}]
				if (ret) {
					if (getJsonObjLength(ret.list) != 0) {

						api.sendEvent({
							name : 'setPicurl',
							extra : {
								image_list : ret.list,
								pic_source : 'album',
								conver_type : conver_type
							}
						});
					}
				}
			});
			break;
	}

}

function setSendProgress() {

	//			if(typeof(msg_pro) == 'undefined') {
	//				msg_pro = 0;
	//			}
	//			$api.html($api.byId('send_progress_'+msg_id), msg_pro);

	api.addEventListener({
		name : 'sednImgPropress'
	}, function(ret) {
		if (ret && ret.value) {
			$api.html($api.byId('send_progress_' + ret.value.msg_id), ret.value.msg_pro);
		}
	});

}

/**
 * 打开试题
 * 周枫
 * 2016.4.19
 */
function openQuestionFrame(que_id_char, que_id, zy_id, select_type, t_id, z_type,person_id,identity_id) {
	if(person_id || identity_id){
		commonOpenWin('tibenJy_chat_que_window', '../../html/yingyong/tibenJy/tibenJy_chat_que_window.html', false, false, {'header_h':header_h,"zy_id":zy_id,'question_id_char':que_id_char,"z_type":z_type,"person_id":person_id,"identity_id":identity_id});
	}else{
		openCheckQueWin(zy_id, select_type, t_id, que_id_char, z_type);
	}
}

/*
 * author:zfz
 * function:点击查看该题/资源/微课
 * data:2016.4.19
 */
function openCheckQueWin(zy_id, select_type, t_id, que_id_char, z_type) {
	api.openWin({
		name : 'hh_chat_que_window',
		url : '../../html/yingyong/hh_chat_que_window.html',
		pageParam : {
			header_h : header_h,
			cross_w : 'auto',
			zy_id : zy_id,
			select_type : select_type,
			t_id : t_id,
			que_id_char : que_id_char,
			z_type : z_type
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
 * 打开文章
 * 周枫
 * 2016.4.19
 */
function openWenzhangWindow(header, wz_id, menu_type, menu_id, expand_id,person_name,time,title,avatar_fileid,person_id) {
	var pageParamJson = {
		'wz_id' : wz_id,
		'menu_type' : menu_type,
		'expand_id' : expand_id,
		'menu_id' : menu_id,
		'header_h' : header_h,
		'wz_name' : '',
		"person_name" : person_name,
		"create_time" : time,
		"title" : title,
		"avatar_fileid" : avatar_fileid,
		"person_id" : person_id,
		"type" : 2
	};
	commonOpenWin('quanzi_content_window', 'widget://html/quanzi/quanzi_content_window.html', false, false, pageParamJson);
}

/**
 * 点击头像进行会话
 * 周枫
 * 2016.06.02
 */
function openHhByImg(t_id, p_name, h_type, h_img) {
	if ( typeof (t_id) == "undefined" || t_id == '') {
		api.alert({
			msg : "对不起，数据加载中，请再次进入当前群组"
		}, function(ret, err) {
			api.execScript({
				name : 'root',
				frameName : 'hh_index',
				script : 'getCoversationList();'
			});
			api.execScript({
				name : 'hh_chat_window',
				script : 'back();'
			});
		});
	} else {
		api.openWin({
			name : 'hh_personinfo_window',
			url : 'hh_personinfo_window.html',
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
				'targetId' : t_id,
				'old_msg_id' : -1,
				'conver_type' : h_type,
				'person_name' : p_name,
				'header_h' : header_h,
				'h_from' : h_from,
				'avatar_url' : h_img
			}
		});
	}

}

/**
 * 打开会话操作菜单
 * 周枫
 * 2016.06.03
 */
function openHhMenu(msg_txt, msg_type, msg_id) {
	//http正则
	var reg_http = /^[hH][tT]{2}[pP]:\/\/[\d\w\.\/\-\?\=\&\%]+/;
	//http正则
	var reg_https = /^[hH][tT]{2}[pP][sS]:\/\/[\d\w\.\/\-\?\=\&\%]+/;
	var bsqy_list;
	var http_url = '';
	if (reg_http.test(msg_txt) || reg_https.test(msg_txt)) {
		bsqy_list = ['复制(仅支持文本)', '删除'];
		var http_attr;
		if (reg_http.test(msg_txt)) {
			http_attr = msg_txt.match(reg_http);
		} else if (reg_https.test(msg_txt)) {
			http_attr = msg_txt.match(reg_https);
		}
		for (var i = 0; i < http_attr.length; i++) {
			http_url = http_attr[0];
		}
		switch(msg_type) {
			case 'TxtMsg':
				bsqy_list = bsqy_list;
				break;
		}
		api.actionSheet({
			cancelTitle : '取消',
			buttons : bsqy_list
		}, function(ret, err) {
			if (ret) {
				var b_index = ret.buttonIndex;
				switch(b_index) {
					case 1:
						//复制
						clipBoardSdk.set(msg_txt, function(is_true, data) {

						});
						break;
					case 2:
						api.confirm({
							title : "提示",
							msg : "是否删除该条消息？",
							buttons : ['确定', '取消']
						}, function(ret, err) {
							if (1 == ret.buttonIndex) {
								//根据融云会话id删除聊天记录
								delteMessageByMessageId(msg_id, function(is_true) {
									if (is_true) {
										//页面加载时获取历史
										$api.remove($api.byId('hh_' + msg_id));
										api.execScript({
											name : 'root',
											frameName : 'hh_index',
											script : 'getCoversationList();'
										});
									} else {

									}
								});
							} else {
								return;
							}
						});

						break;
//					case 3:
//						api.openWin({
//							name : 'common_browser_window',
//							url : '../../html/common/common_browser_window.html',
//							pageParam : {
//								header_h : header_h,
//								title : '网页',
//								http_url : http_url
//							},
//							bounces : false,
//							opaque : false,
//							showProgress : false,
//							vScrollBarEnabled : false,
//							hScrollBarEnabled : false,
//							slidBackEnabled : false,
//							delay : 0,
//							animation : {
//								type : "reveal", //动画类型（详见动画类型常量）
//								subType : "from_right", //动画子类型（详见动画子类型常量）
//								duration : 300
//							},
//						});
//
//						break;
					default:

						break;
				}
			}
		});
	} else {
		bsqy_list = ['复制(仅支持文本)', '删除'];
		switch(msg_type) {
			case 'TxtMsg':
				bsqy_list = bsqy_list;
				break;
		}
		api.actionSheet({
			cancelTitle : '取消',
			buttons : bsqy_list
		}, function(ret, err) {
			if (ret) {
				var b_index = ret.buttonIndex;
				switch(b_index) {
					case 1:
						//复制
						clipBoardSdk.set(msg_txt, function(is_true, data) {

						});
						break;
					case 2:
						api.confirm({
							title : "提示",
							msg : "是否删除该条消息？",
							buttons : ['确定', '取消']
						}, function(ret, err) {
							if (1 == ret.buttonIndex) {
								//根据融云会话id删除聊天记录
								delteMessageByMessageId(msg_id, function(is_true) {
									if (is_true) {
										//页面加载时获取历史
										$api.remove($api.byId('hh_' + msg_id));
										api.execScript({
											name : 'root',
											frameName : 'hh_index',
											script : 'getCoversationList();'
										});
									} else {

									}
								});
							} else {
								return;
							}
						});

						break;

					default:

						break;
				}
			}
		});
	}

}

//function isOnLine() {
//	api.sendEvent({
//		name : 'getIndexOnline'
//	});
//}
//
//function receviIsOnLine() {
//	api.addEventListener({
//		name : 'sendIndexOnline'
//	}, function(ret) {
//		is_online = ret.value.data;
//	});
//}