/* 二维码/条形码扫描器  封装FNScanner模块  2017.05.20 周枫 */
var common_scanner = {
	//直接打开已定制的带标题栏的浏览器组件，类似微信中的效果
	openScanner : function(callback) {
		var scanner = api.require('FNScanner');
		var autorotation=true;
		if(api.systemType == "ios"){
	    	//在IOS系统平板端下，应用竖屏
	    	autorotation= false;
	    }
		scanner.openScanner({
			sound : 'widget://res/LowBattery.mp3',
			//扫描页面是否自动旋转（横竖屏）
			autorotation : autorotation,
			saveToAlbum : false

		}, function(ret, err) {
			//{
			// eventType: 'cancel',     //字符串类型；扫码事件类型
			//                          //取值范围：
			//                          //show（模块显示）
			//                          //cancel（用户取消扫码）
			//                          //selectImage（用户从系统相册选取二维码图片）
			//                          //success（识别二维码/条码图片成功）
			//                          //fail（扫码失败）
			// imgPath: '',             //字符串类型；需要保存的二维码图片绝对路径（自定义路径）
			// albumPath: '',           //字符串类型；需要保存的二维码图片绝对路径（相册路径）
			// content: ''              //扫描的二维码/条形码
			//}
			if (ret) {
				callback(true, "扫码成功", ret.eventType, ret.content);
			} else {
				callback(false, "扫码失败", "", "");
			}
		});
	}
}