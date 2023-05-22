/* 亲加视频直播  封装gotyeLiveCore基础模块  2016.11.02 周枫 */
var zbLiveCore = {
	registerApp : function(){
		var core = api.require('gotyeLiveCore');
		core.registerApp({
		    appKey: "4328f774a6214c2ea7635da7534c99cd",
		    accessSecret: "5ebf3c3425d84e408122097bad7801dd"
		});
	},
	//验证房间。session是对应一个直播房间的，验证通过才能获取直播间的
	authRoomSession : function(room_id, room_pas, nick_name, callback) {
		var session = {
			roomId : room_id,
			password : room_pas,
			nickname : nick_name
		};
		var core = api.require('gotyeLiveCore');
		zbLiveCore.registerApp();
		core.authRoomSession(session, function(ret, err) {
			//当前token是否过期。false表示没过期，true表示过期
			if (ret.expired) {
				callback(false, ret)
			} else {
				callback(true, ret)
			}
		});
	},
	//清除房间验证，销毁session实例。退出直播间时调用
	destroyRoomSession : function(room_id, room_pas, nick_name) {
		var session = {
			roomId : room_id,
			password : room_pas,
			nickname : nick_name
		};
		var core = api.require('gotyeLiveCore');
		core.destroyRoomSession(session);
	},
	//查询直播间详情
	getLiveContext : function(room_id, room_pas, nick_name, callback) {
		var session = {
			roomId : room_id,
			password : room_pas,
			nickname : nick_name
		};
		var core = api.require('gotyeLiveCore');
		core.getLiveContext(session, function(ret, err) {
			if (ret) {
				//recordingStatus:0,当前直播状态。1-录制中 0-停录中
				//playUserCount:0,当前播放视频人数
				callback(true, ret);
			} else {
				callback(false, err);
			}
		});
	}
};
/* 亲加视频直播  封装gotyeLivePlayer播放器模块  2016.11.02 周枫 */
var zbLivePlayer = {
	//初始化播放器模块
	//模式一：与直播间绑定，支持直播间的状态判断以及人数统计
	init : function(room_id, room_pas, nick_name) {
		var session = {
			roomId : room_id,
			password : room_pas,
			nickname : nick_name
		};
		 
		var player = api.require('gotyeLivePlayer');
		player.init({
			session : session
		});
	},
	//开始播放
	play : function(view_name, quality_type, frame_x, frame_y, frame_w, frame_h) {
		 
		var player = api.require('gotyeLivePlayer');
		player.play({
			//视频显示的窗口名称。视频视图将以子view的方式添加到这个窗口上
			playView : view_name,
			rect : {
				x : frame_x, //左上角x坐标
				y : frame_y, //左上角y坐标
				w : frame_w, //宽度
				h : frame_h //高度
			},
			//视图是否固定，为false时跟随目标窗口内容滚动而滚动
			fixed : false,
			//表示播放视频的清晰度。original表示原始清晰度，high表示高清清晰度，medium表示标清清晰度，low表示流畅清晰度
			quality : quality_type
		});
	},
	stop : function() {
		 
		var player = api.require('gotyeLivePlayer');
		player.stop();
	},
	//获取客户端的当前播放视频的清晰度。
	getVideoQuality : function() {
		 
		player.getVideoQuality(function(ret) {
			//如果当前播放器没有初始化，返回为空,original表示原始清晰度，high表示高清清晰度，medium表示标清清晰度，low表示流畅清晰度
			if (ret) {
				alert(JSON.stringify(ret));
			}
		});
	}
};

/* 亲加视频直播  封装gotyeLivePublisher直播模块  2016.11.02 周枫 */
var zbLivePublisher = {
	//初始化直播模块
	//模式一：与直播间绑定，支持直播间主播账号的登录以及直播状态的设置
	init : function(room_id, room_pas, nick_name) {
		 
		var session = {
			roomId : room_id,
			password : room_pas,
			nickname : nick_name
		};
		var publisher = api.require('gotyeLivePublisher');
		publisher.init({
			session : session
		});
	},
	//在推流之前，需要先打开设备的摄像头
	startPreview : function(view_name, cam_position, frame_x, frame_y, frame_w, frame_h) {
		 
		var publisher = api.require('gotyeLivePublisher');
		publisher.startPreview({
			//显示预览的窗口名字，预览画面将以子视图的方式添加到窗口上
			preview : view_name,
			//打开摄像头的位置。front为前置摄像头，back为后置摄像头
			position : cam_position,
			rect : {
				x : frame_x, //左上角x坐标
				y : frame_y, //左上角y坐标
				w : frame_w, //宽度
				h : frame_h //高度
			},
			//视图是否固定，为false时跟随目标窗口内容滚动而滚动
			fixed : false,
		}, function(ret, err) {
			if (err) {
			} else {
			}
		});
	},
	//登录直播间的主播账号
	login : function(callback) {
		 
		var publisher = api.require('gotyeLivePublisher');
		publisher.login({
			//如果当前已经有主播登录了该直播间，是否强制踢出当前登录的主播
			force : true
		}, function(ret, err) {
			if (ret) {
				callback(true, '');
			} else {
				callback(false, err);
			}
		});
	},
	//设置视频编码参数
	setVideoPreset : function(frame_w, frame_h) {
		 
		var publisher = api.require('gotyeLivePublisher');
		publisher.setVideoPreset({
			//推送视频的像素宽度
			width : 360,
			//推送视频的像素高度
			height : 640,
			//推送视频的最高码率限制，单位为kbps,默认值：0
			bps : 720,
			//摄像机的视频帧率，如果使用默认值0将会使用摄像机默认的帧率
			fps : 24
		});
	},
	//开始直播
	publish : function() {
		 
		var publisher = api.require('gotyeLivePublisher');
		publisher.publish();
	},
	stop : function() {
		 
		var publisher = api.require('gotyeLivePublisher');
		publisher.stop();
	},
	//断开主播端与推流服务器的连接，不停止预览
	unpublish : function() {
		 
		var publisher = api.require('gotyeLivePublisher');
		publisher.unpublish();
	},
	//打开/关闭麦克风
	setMute : function(is_mute) {
		 
		var publisher = api.require('gotyeLivePublisher');
		if(typeof(is_mute) == 'undefined') {
			is_mute = true;
		}
		publisher.setMute({
			mute : is_mute
		});
	},
	//设置滤镜模式，滤镜模式。normal表示不添加滤镜，smoothSkin表示美白磨皮滤镜
	setFilter : function(filter_type) {
		 
		var publisher = api.require('gotyeLivePublisher');
		if(typeof(filter_type) == 'undefined' || filter_type == '') {
			filter_type = 'normal';
		}
		publisher.setFilter({
			filter : filter_type
		})
	},
	//切换前后摄像头
	switchCamera : function(){
		 
		var publisher = api.require('gotyeLivePublisher');
		publisher.switchCamera();
	}
};
