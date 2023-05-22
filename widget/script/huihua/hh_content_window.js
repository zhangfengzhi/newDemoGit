var targetId, historyMessages, mytoken, person_name,panelHeight,inputBarHeight;

apiready = function() {
	commonSetTheme({"level":2,"type":0});
	mytoken = $api.getStorage('mytoken');
	//定位header位置，留出上面电池等空隙，苹果需要
	var $header = $api.dom('header');
	$api.fixIos7Bar($header);

	//当前会话用户id和当前会话历史消息从消息列表页点击传递进来
	targetId = api.pageParam.targetId;
	person_name = api.pageParam.person_name;
	//会话人员姓名
	$api.html($api.byId('cloud'), person_name);
	historyMessages = api.pageParam.historyMessages;
	if ( typeof (historyMessages) != 'undefined') {
		for (var k = 0; k < historyMessages.length; k++) {
			if (historyMessages[k].messageDirection == 'SEND') {
				//渲染发送会话
				$api.append($api.byId("message-content"), '<div class="aui-chat-sender"><div class="aui-chat-sender-avatar"><img src="../../image/person/demo2.png"></div><div class="aui-chat-sender-cont"><div class="aui-chat-right-triangle"></div><span>' + historyMessages[k].content.text + '</span></div></div>');
			} else {
				//渲染接收会话
				$api.append($api.byId("message-content"), '<div class="aui-chat-receiver"><div class="aui-chat-receiver-avatar"><img src="../../image/person/demo2.png"></div><div class="aui-chat-receiver-cont"><div class="aui-chat-left-triangle"></div><span>' + historyMessages[k].content.text + '</span></div></div>');
			}
		}
		goButtom();
	}
	//监听发送新消息写入,这个事件主要来处理发送消息插入到会话窗口中
	api.addEventListener({
		name : 'insertSendMessage'
	}, function(ret) {
		if (ret && ret.value) {
			var newMessageData = ret.value;
			//			alert(JSON.stringify(newMessageData));
			//页面写入发送消息
			$api.append($api.byId("message-content"), '<div class="aui-chat-sender"><div class="aui-chat-sender-avatar"><img src="../../image/person/demo2.png"></div><div class="aui-chat-sender-cont"><div class="aui-chat-right-triangle"></div><span>' + newMessageData.data.message.content.text + '</span></div></div>');
		}
		goButtom();
	});
	//监听收到新消息写入
	api.addEventListener({
		name : 'getNewMessage'
	}, function(ret) {
		if (ret && ret.value) {
			//监听成功
			var newMessageData = ret.value;
			//根据targetId和当前会话用户id判断一下，如果相等则写入
			if (newMessageData.data.targetId == targetId) {
				$api.append($api.byId("message-content"), '<div class="aui-chat-receiver"><div class="aui-chat-receiver-avatar"><img src="../../image/person/demo2.png"></div><div class="aui-chat-receiver-cont"><div class="aui-chat-left-triangle"></div><span>' + newMessageData.data.content.text + '</span></div></div>');
			}
		}
		goButtom();
	});
	//引入chatbox
	var chatBox = api.require('UIChatBox');
	var sourcePath = "widget://image/emotion";
	//表情存放目录
	var emotionData;
	//存储表情
	getImgsPaths(sourcePath, function(emotion) {
		emotionData = emotion;
	})
	chatBox.open({
		placeholder : '',
		maxRows : 4,
		emotionPath : 'widget://image/emotion',
		texts : {
			recordBtn : {
				normalTitle : '按住 说话',
				activeTitle : '松开 结束'
			}
		},
		styles : {
			inputBar : {
				borderColor : '#d9d9d9',
				bgColor : '#f2f2f2'
			},
			inputBox : {
				borderColor : '#B3B3B3',
				bgColor : '#FFFFFF'
			},
			emotionBtn : {
				normalImg : 'widget://image/chatBox/chatBox_face1.png'
			},
			extrasBtn : {
				normalImg : 'widget://image/chatBox/chatBox_add1.png'
			},
			keyboardBtn : {
				normalImg : 'widget://image/chatBox/chatBox_key1.png'
			},
			speechBtn : {
				normalImg : 'widget://image/chatBox/chatBox_key1.png'
			},
			recordBtn : {
				normalBg : '#c4c4c4',
				activeBg : '#999999',
				color : '#000',
				size : 14
			},
			indicator : {
				target : 'both',
				color : '#c4c4c4',
				activeColor : '#9e9e9e'
			}
		},
		extras : {
			titleSize : 10,
			titleColor : '#a3a3a3',
			btns : [{
				title : '图片',
				normalImg : 'widget://image/chatBox/chatBox_album1.png',
				activeImg : 'widget://image/chatBox/chatBox_album2.png'
			}, {
				title : '拍照',
				normalImg : 'widget://image/chatBox/chatBox_cam1.png',
				activeImg : 'widget://image/chatBox/chatBox_cam2.png'
			}]
		}
	}, function(ret, err) {
		//          var urlJson = JSON.stringify(ret);
		//      	api.alert({msg: "ret="+urlJson});
		//      	var errJson = JSON.stringify(err);
		//      	api.alert({msg: "err="+errJson});
		//点击附加功能面板
		if (ret.eventType == 'clickExtras') {
			alert("用户点击了第" + ret.index + "个按钮");
		}
		//点击发送按钮
		if (ret.eventType == 'send') {
			/*
			 *1.用户输入文字或表情
			 */
			/*用户输入表情或文字*/
			/*使用读文件方法，读json*/
			var sendMsg = transText(ret.msg);
			//发送消息
			chat(sendMsg);
			//发送消息的函数，后面会有介绍
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
				return textTransed;
			}

		}
	});
	//监听 recordBtn 按钮
	//		var obj = api.require('UIChatBox');
	chatBox.addEventListener({
		target : 'recordBtn',
		name : 'press'
	}, function(ret, err) {
		startRecord();
	});
	chatBox.addEventListener({
		target : 'recordBtn',
		name : 'press_cancel'
	}, function(ret, err) {
		//api.toast({msg:('文件路径--'+ret.path+';录音时长:'+ret.duration+'s'),location: 'top'});
		stopRecord(mytoken);
	});
	//监听文本框高度
	//	document.body.scrollTop = document.body.scrollHeight + 50;
	chatBox.addEventListener({
		target : 'inputBar',
		name : 'change'
	}, function(ret, err) {
		
	});
	chatBox.addEventListener({
		target : 'inputBar',
		name : 'move'
	}, function(ret, err) {
		//  api.toast({msg: JSON.stringify(ret),location: 'top'}); //50
		//	    api.toast({msg: JSON.stringify(err),location: 'middle'}); //283
		panelHeight = ret.panelHeight;
		inputBarHeight = ret.inputBarHeight;
		scrollMessage();
	});
}
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

function startRecord() {
	api.toast({
		msg : '开始录音',
		location : 'top'
	});
	api.startRecord({
		path : 'widget://record/test.amr'
	});
}

function stopRecord(mytoken) {
	api.toast({
		msg : '结束录音',
		location : 'middle'
	});
	api.stopRecord(function(ret, err) {
		if (ret) {
			//			            api.alert({msg:('文件路径--'+ret.path+';录音时长:'+ret.duration+'s')});
			sendVoiceMessage(mytoken, ret.path, ret.duration);
			$api.val($api.byId("record_hid"), ret.path);
		} else {
			api.alert({
				msg : JSON.stringify(ret),
				location : 'top'
			});
		}

	});
}

function playRecord() {
	//			api.alert({msg: '播放录音'});
	var voice_path = $api.val($api.byId("record_hid"));
	var voiceMag = api.require('voiceMag');
	//			voiceMag.onCall();
	voiceMag.startPlay({
		path : voice_path
	});

}

function chat(sendMsg) {
	//向会话列表页发送消息事件
	api.sendEvent({
		name : 'sendMessage',
		extra : {
			type : 'text',
			targetId : '' + targetId + '',
			content : sendMsg,
			conversationType : 'PRIVATE',
			extra : ''
		}
	})
}

function scrollMessage() {
	var chatDom = $api.byId('message-content');
	var frameHeight;
	if (panelHeight == 0) {
		frameHeight = api.frameHeight - 150;
	} else {
		frameHeight = api.frameHeight - panelHeight - inputBarHeight - 70 - 20;
	}
	$api.css(chatDom, 'height:' + frameHeight + 'px;');
	chatDom.scrollTop = chatDom.scrollHeight;
}

function goButtom() {
			document.getElementsByTagName('body')[0].scrollTop = document.getElementsByTagName('body')[0].scrollHeight;
		}