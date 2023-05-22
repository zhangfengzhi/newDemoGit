/* netAudio手写签名 封装netAudio模块  2017.06.09 赵静 */
var net_audio = '';
var netAudio = {
	//打开手写签名模块
	open : function(path,callback) {
		if(net_audio == ''){
			net_audio = api.require('netAudio');
		}
		net_audio.play({
		    path: path
		}, function(ret, err) {
		    if (ret) {
		       callback(true,ret);
		    } else {
		        callback(false,'');
		    }
		});
	},
	//暂停播放
	pause : function() {
		if(net_audio == ''){
			net_audio = api.require('netAudio');
		}
		net_audio.pause();
	},
	//停止播放
	stop : function(){
		if(net_audio == ''){
			net_audio = api.require('netAudio');
		}
		net_audio.stop();
	},
};
