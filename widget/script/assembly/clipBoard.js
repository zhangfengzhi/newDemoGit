/* 复制剪切板方法组件  封装clipBoard模块  2016.06.03 周枫 */

var clipBoardSdk = {
	//设置剪切板内容
	set : function(clip_txt, callback) {
		var clipBoard = api.require('clipBoard');
		clipBoard.set({
			value : clip_txt
		}, function(ret, err) {
			if (err) {
				callback(false, '复制失败');
			} else {
				callback(true, '复制成功');
			}
		});
	},
	//获取剪切板中的数据
	get : function(callback) {
		var clipBoard = api.require('clipBoard');
		clipBoard.get(function(ret, err) {
			if (err) {
				callback(false, '复制失败');
			} else {
				//{ value:从剪切板获取的字符串    type:数据类型，取值范围见数据类型  }
				/**
				 *
				 email //邮箱地址
				 phone //手机号码
				 url //网址
				 licence_plate_number //车牌号
				 ip_address //IP地址
				 string //普通字符串

				 */
				callback(true, ret);
			}
		});
	}
};
