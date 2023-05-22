/* 模块封装了对图片按照指定效果过滤的功能，过滤后的图片可保存到指定目录；
 * 另外通过本模块的 getAttr 接口可获取制定图片的大小等；
 * compress 接口可实现压缩图片的相关功能  封装fs模块
 * 2017.03.28
 * 周枫
 */

var imageFilter = {
	compress : function(img_url, img_name, img_ext, callback) {
		var imageFilter = api.require('imageFilter');
		//压缩后图片名称
		var img_guid = img_name + '.' + img_ext;
		fsFile.getAttribute(img_url,function(fs_url){
				});
		imageFilter.compress({
			//要压缩图片的路径，支持 widget、fs 等本地路径
			img : img_url,
			//（可选项）压缩程度，取值范围：0-1
			quality : 0.3,
			//（可选项）压缩后的图片缩放比例，取值范围大于0
			scale : 1,
			save : {
				//(可选项)布尔值，是否保存到系统相册，默认 false
				album : false,
				//(可选项)保存的文件路径,字符串类型，无默认值,不传或传空则不保存，若路径不存在文件夹则创建此目录
				imgPath : BASE_IMAGE_TEMP_PATH,
				//(可选项)保存的图片名字，支持 png 和 jpg 格式，若不指定格式，则默认 png，字符串类型，无默认值,不传或传空则不保存
				imgName : img_guid
			}
		}, function(ret, err) {
			if (ret.status) {
				var img_native = BASE_IMAGE_TEMP_PATH + img_guid;
				fsFile.getAttribute(img_native,function(fs_url){
				});
				callback(BASE_IMAGE_TEMP_PATH + img_guid);
			} else {

			}
		});
	}
}