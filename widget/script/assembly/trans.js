/* trans  封装trans模块  2017.09.05 赵静
*/
var trans_object;
var trans = {
	//打开图片浏览器
	saveImage : function(params,callback) {
		params = trans.resetParamsJson(params);
		trans_object = api.require('trans');
		trans_object.saveImage({
		    base64Str: params.base64Str,
		    album:params.album,
		    imgPath:params.imgPath,
		    imgName:params.imgName
		}, function(ret, err) {
		    if (ret.status) {
		        callback(true,params.imgPath+'/'+params.imgName);
		    } else {
		        callback(false,"");
		    }
		});
	},
	//将没有传递过来的参数没有设值的给默认值
	resetParamsJson : function(params_json){
		if(isEmptyString(params_json.album)){
			params_json.album = false;
		}
		return params_json;
	},
};
/* 数据格式转换工具  封装trans模块  2017.08.30 周枫 */

var common_trans = {
	//将 base64 字符串保存为图片
	saveImage : function(base_str, img_path, img_name, callback) {
		var trans = api.require('trans');
		trans.saveImage({
			//要转换成为图片的字符串
		    base64Str: base_str,
		    //转换后的图片是否保存到系统相册
		    album: false,
		    //转换后的图片保存路径，若不传则不保存
		    imgPath:img_path,
		    //转换后的图片保存名字，若imgPath下已存在同名图片则覆盖，若 imgPath 为空则此参数无意义
		    imgName:img_name
		}, function(ret, err) {
			if(ret.status) {
				callback(true, ret.status);
			} else {
				callback(false, '操作失败');
			}
		});
	},
	//将图片转换为 base64 字符串，暂仅支持 png、jpg 格式的图片
	decodeImgToBase64 : function(img_path, callback) {
		var trans = api.require('trans');
		trans.decodeImgToBase64({
			//要转换的图片路径
		    imgPath: img_path
		}, function(ret, err) {
			if(ret.status) {
				callback(true, ret.base64Str);
			} else {
				callback(false, err.msg);
			}
		});
	}
};