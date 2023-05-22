/*
*作者:zhaoj
*功能:打开滑动条
*日期：20161006
*/
function openNavigationBarToHtml(data) {
	var params = {
		x : 0,
		y : header_h,
		w : api.frameWidth,
		h : data.height,
		//导航条风格，默认值："left_to_right"
		style : "left_to_right",
		itemSize : {
			w : data.width,
			h : 100
		},
		//按钮项
		items : data.bar_items,
		//被选中的导航项的下标.可为空.不传表示不选中任何item，默认值：无
		selectedIndex : 0,
		//导航项字体的大小和颜色.可为空
		font : {
			//导航项字体大小.数字.默认系统字号，可为空
			size : 16,
			// 选中时,导航项字体大小.默认size大小，可为空
			sizeSelected : 16,
			// 导航条字体颜色.字符串.默认#FFFFFF,可为空
			color : "#000000",
			// 导航条字体颜色.字符串.默认与 color 相同.可为空
			colorSelected : "#ff0000"
			// 背景透明度. 数字.取值范围0-1，默认1，可为空
			//alpha
		},
		//导航条背景,支持rgb,rgba,# , img.可为空，默认值：#6b6b6b
		bg : "#ffffff",
		//背景透明度.取值范围0-1，默认1，可为空，默认值：1.0.
		alpha : 1.0,
		//					popItem : {
		//						position : "tail",
		//						title : "打开",
		//						titleSelected : "关闭",
		//						bg : "#ffff00",
		//						bgSelected : "#ffffff"
		//					},
		//（可选项）模块所属 Frame 的名字，若不传则模块归属于当前 Window
		fixedOn : '',
		//（可选项）模块是否随所属 Window 或 Frame 滚动,默认值：true（不随之滚动）
		fixed : true
	};
	navigationBar.open(params, callBackNew);
}