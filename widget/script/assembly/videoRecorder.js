/* 录像功能  封装videoRecorder模块  2017.08.25 周枫 */
/* http://docs.apicloud.com/Client-API/Func-Ext/videoRecorder */
var video_recorder;//视频录制对象
var camera ='back';//设置前后摄像头参数，默认后置摄像头
var videoRecorder = {
	//打开录像机
	open : function(callback) {
		video_recorder = api.require('videoRecorder');
		var orientation=""
//		if(api.uiMode == 'pad'){
//			orientation = 'left';
//		}else{
			orientation = 'portrait';
//		}
		video_recorder.open({
			rect : {
				x : 0,
				y : 0,
				w : api.frameWidth,
				h : api.frameHeight
			},
			//录像视频质量，high：超清视频，low：普通质量视频，288p：352*288（CIF），480p：640*480，720p：1280*720，1080p：1920* 1080，2160p：3840* 2160，medium：高清视频
			quality : "high",
			//录制的视频的方向,portrait：竖屏    right：右横屏    left：左横屏    upsideDown：反转竖屏
			orientation : orientation,
			//录制的视频是否自动保存到系统相册
			saveToAlbum : true,
			//录制的视频保存配置
			save : {
				path : 'fs://videoRecorder',
				name : 'firstVideo'
			},
			fixedOn : api.frameName,
			fixed : false
		}, function(ret) {
			if (ret) {	
				callback(ret);
			}
		});
	},
	//开始录像
	start : function(record_time) {
		video_recorder.start({
			//数字，视频录制倒计时计时器，单位为秒（s)，亦可通过 stop 接口停止录像
		    timer: record_time
		});
	},
	//停止录像
	stop : function(record_time) {
		video_recorder.stop();
	},
	//关闭录像
	close : function(record_time) {
		video_recorder.close();
	},
	//设置前置/后置摄像头
	setCamera:function(){
		camera == 'back' ? camera ='front' : camera ='back';
		video_recorder.setCamera({
		    camera: camera
		});
	}
};
