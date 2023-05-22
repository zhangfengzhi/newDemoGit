/* 封装了对文件操作的接口，通过此模块可对文件或文件夹进行创建、删除、读取、写入等相关操作,  封装fs模块  2016.12.10 周枫 */

var fsFile = {
	//获取指定路径下文件的属性
	getAttribute : function(file_path, callback) {
		var fs = api.require('fs');
		fs.getAttribute({
			//字符串,如 'fs://file.txt'
			path : file_path
		}, function(ret, err) {
			if (ret.status) {
				//				{
				// status:                //布尔类型；操作状态；true||false
				// attribute:             //JSON对象；文件属性
				//                        //内部字段：{
				//                          creationDate:    //字符串类型；创建日期 （时间戳），仅 IOS 支持此字段
				//                          modificationDate://字符串类型；修改日期（时间戳）
				//                          size:            //数字类型；文件大小，以 byte 为单位
				//                          type:            //字符串类型；表示文件类型，取值范围：folder（文件夹）、file（文件）
				//                         }
				//}
				callback(ret);
			} else {
				//				{
				//  msg:            //字符串类型；错误描述
				//}
				callback(err);
			}
		});
	}
};
