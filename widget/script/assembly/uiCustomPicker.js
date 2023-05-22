/*
 * UICustomPicker 模块是一个自定义内容选择器；可自定义模块位置、内容取值范围、内容标签，设置选中内容；可用于实现固定取值范围的内容选择器，多项内容之间没有级联关系；同一个页面可以打开多个模块实例，以模块 id 区分
 * 2016.06.03 周枫 */

var uiCustomPickerSdk = {
	//打开自定义选择器
	open : function(rect_json, data_attr, callback) {
		var uiCustomPicker = api.require('UICustomPicker');
		uiCustomPicker.open({
			//模块的位置及尺寸
			rect : rect_json,
			styles : {
				//（可选项）字符串类型；选中内容区域的背景
				bg : 'rgba(0,0,0,0)',
				//（可选项）字符串类型；未选中内容的字体颜色
				normalColor : '#959595',
				//（可选项）字符串类型；选中内容的字体颜色
				selectedColor : '#34A8FA',
				//（可选项）数字类型；选中内容的字体大小
				selectedSize : 26,
				//（可选项）字符串类型；内容标签的字体颜色
				tagColor : '#3685dd',
				//（可选项）数字类型；内容标签的字体大小
				tagSize : 13
			},
			data :data_attr,
			rows : 3,
			//选中内容时，上下选项是否自动隐藏
			autoHide : false,
			//（可选项）是否循环滚动
			loop : true,
			//（可选项）模块视图添加到指定 frame 的名字（只指 frame，传 window 无效）
			fixedOn : api.frameName,
			//（可选项）模块是否随所属 window 或 frame 滚动
			fixed : true
		}, function(ret, err) {
			if (err) {
				callback(false, ret);
			} else {
				callback(true, ret);
			}
		});
	}
};
