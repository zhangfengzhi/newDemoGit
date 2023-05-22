var sdk_cache = {
	queque : {
		stacks : [],
		downloading : false,
		add : function(id, url, callback) {
			this.stacks.push({
				'id' : id,
				'url' : url,
				'callback' : callback
			});
			setTimeout(sdk_cache.queque.begin,1);
		},
		begin : function() {
			var item = sdk_cache.queque.stacks.pop();
			//出栈
			if (item) {
				sdk_cache.queque.downloading = true;
				var i_url = item.url;
				if(i_url.indexOf('http://') != -1) {
					sdk_cache.imageCache.get(item.url, function(ret, err) {
						sdk_cache.queque.downloading = false;
						var path = item.url;
						if (ret) {
							path = ret.url;
						}
						item.callback({
							'id' : item.id,
							'url' : path,
							'err' : err
						});
						updatePersonHeadImgToDb(item.id, path, function(is_true){
							if(is_true){
								//continue download
								setTimeout(function() {
									sdk_cache.queque.begin();
								}, 1);
							}
						});
						
	
					});
				} else {
					item.callback({
							'id' : item.id,
							'url' : i_url,
							'err' : ''
						});
				}
				
			}
		}
	},
	imageCache : {
		get : function(url, callback) {
			if (api.systemType != 'ios') {//android 可用
				api.imageCache({
					'url' : url,
					policy : 'cache_only',
					thumbnail : false
				}, callback);
				return;
			}
			var r = /http:\/\/.*?\/(.*?\.(?:png|jpg|gif|jpeg))([?!]?.*)/i;
			var m = r.exec(url);
			var ver = "";
			var filename = "";
			if (m != null) {
				filename = m[1].replace(/[\/]/gi, '');
				ver = m[2];
			}
			if (filename == '') {
				callback(null, 'err:not remote url');
				return;
			}

			var path = api.cacheDir + "/imagecache/" + filename;
			var fs = api.require('fs');
			fs.exist({
				path : path
			}, function(ret, err) {

				if (ret.exist) {//缓存文件已存在
					if (ret.directory) {
						//api.alert({msg:'imageCache.path -> 路径指向一个文件夹'});
						callback(null, 'imageCache.path -> 路径指向一个文件夹');
					} else {
						fs = null;
						callback({
							'url' : path
						}, 'cache exists');

						return;
					}
				} else {
					api.download({
						'url' : url,
						savePath : path,
						report : true,
						cache : true,
						allowResume : true
					}, function(ret, err) {
						fs = null;

						if (ret) {
							if (ret.state == 1) {//0下载中，1，下载完成，2，下载失败
								callback({
									'url' : ret.savePath
								}, '');
							} else if (ret.state == 2) {
								callback(null, '下载失败:' + url);
							}
							//var value = ('文件大小：' + ret.fileSize + '；下载进度：' + ret.percent + '；下载状态' + ret.state + '存储路径: ' + ret.savePath);
							return;
						}//download error
						callback(null, err.msg);

					});
				}
			});
		},
		clear : function() {
			api.clearCache();
		}
	}
};
