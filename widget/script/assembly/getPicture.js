/* getPicture 封装getPicture方法  2017.09.14 赵静 
*/
function privilegeManagement (jurisdiction,fun) {
 	var resultList = api.hasPermission({
		list:[jurisdiction]
	});
	if(!resultList[0].granted){
		api.confirm({
	    msg: '您未开启权限，是否获取权限',
	    buttons: ['确定', '取消']
		}, function(ret, err) {
		    var index = ret.buttonIndex;
		    if(index == 1){
			    api.requestPermission({
			    list:[jurisdiction],
			    code:1
				}, function(ret, err){
				    if(!ret.list[0].granted){
						popAlert('您未开启权限，请重新获取')			    	
				    }else{
				    	return fun()
				    }
				});
		    	
		    }if(index == 2){
		    	popAlert('获取失败')
		    }
		});
    }else{
	  return fun()  
    }
}
var getPicture = {
	open : function(param,callback) {
		//获取一张图片
		privilegeManagement('camera',function(){
			getPicture.openBefore(param,callback)
		})
	},
	openBefore : function (param,callback){
		param = getPicture.resetParamsJson(param);
			api.getPicture({
				sourceType : param.sourceType,
				encodingType : 'png',
				mediaValue : param.mediaValue,
				//返回数据类型，指定返回图片地址或图片经过base64编码后的字符串
				//base64:指定返回数据为base64编码后内容,url:指定返回数据为选取的图片地址
				destinationType : 'url',
				//是否可以选择图片后进行编辑，支持iOS及部分安卓手机
				allowEdit : true,
				//图片质量，只针对jpg格式图片（0-100整数）,默认值：50
				quality : param.quality,
				//		targetWidth : 100,
				//		targetHeight : 1280,
				saveToPhotoAlbum : true
			}, function(ret, err) {
				if (ret) {
					var img_url = ret.data;
					if (img_url != "") {
						setTimeout(function() {
							if(param.type == 1){
								callback([{'path':img_url,"thumbPath":img_url,"suffix":'png',"size":0}]);
							}else{
								callback(img_url);
							}
						}, 1000);
					}
				}
			});
	},
	//将没有传递过来的参数没有设值的给默认值
	resetParamsJson : function(params_json){
		if(isEmptyString(params_json)){
			params_json = {};
		}
		if(isEmptyString(params_json.sourceType)){
			params_json.sourceType='camera';
		}
		if(isEmptyString(params_json.quality)){
			params_json.quality='80';
		}
		if(isEmptyString(params_json.mediaValue)){
			params_json.mediaValue='pic';
		}
		return params_json;
	},
};