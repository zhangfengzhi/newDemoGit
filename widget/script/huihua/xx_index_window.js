//顶部header高度
var header_h;

apiready = function() {
	commonSetTheme({"level":2,"type":0});
	//定位header位置，留出上面电池等空隙，苹果需要
	var $header = $api.dom('header');
	$api.fixIos7Bar($header);

	header_h = api.pageParam.header_h;
	//加载消息列表页面
	api.openFrame({
		name : 'xx_index_frame',
		url : '../../html/huihua/xx_index_frame.html',
		pageParam : {		},
		scrollToTop : true,
		rect : {
			x : 0,
			y : header_h,
			w : 'auto',
			h : api.winHeight - header_h - 50,
		},
		//页面是否弹动 为了下拉刷新使用
		bounces : true
	});
};

/**
 *返回会话列表页面
 * 周枫
 * 2015.08.08
 */
function back() {
	api.closeWin();
}

/**
 * 打开菜单
 * 周枫
 * 2015.08.17
 */
function menu() {
	api.openFrame({
		name : 'xx_index_menu',
		url : 'xx_index_menu.html',
		scrollToTop : true,
		rect : {
			x : 0,
			y : header_h,
			w : 'auto',
			h : 'auto'
		},
		bounces : false,
		bgColor : 'rgba(51,51,51,0.6)'
	})
}