//顶部header高度
var header_h;
var id;
var title;
//类型： 1：群组 2：学校 3：班级 4:好友
var t;
apiready = function() {
	commonSetTheme({"level":2,"type":0});
	//定位header位置，留出上面电池等空隙，苹果需要
	var header = $api.byId('aui-header');
			$api.fixStatusBar(header);

	header_h = api.pageParam.header_h;
	title = api.pageParam.title;
	$api.html($api.byId('mTitle'), title);
	id = api.pageParam.id;
	t = api.pageParam.t;

	//安卓关闭
	if (api.systemType == 'android') {
		backFromChatForAndroid();
	}

	//	api.execScript({
	//	name:'index',
	//						frameName : 'txl_index',
	//						script : 'closeMyself();'
	//					});

	//打开通讯录内容frame页面
	api.openFrame({
		name : 'txl_content_frame',
		scrollToTop : true,
		url : '../../html/tongxunlu/txl_content_frame.html',
		pageParam : {
			'id' : id,
			't' : t,
			'header_h' : header_h
		},
		rect : {
			x : 0,
			y : header_h,
			w : 'auto',
			h : api.winHeight - header_h,
		}
	});
}
/**
 *返回会话列表页面
 * 周枫
 * 2015.08.08
 */
function back() {
//	api.execScript({
//		name : 'root',
//		frameName : 'txl_index',
//		script : 'showMyself();'
//	});
	api.execScript({
		name : 'root',
		frameName : 'txl_index',
		script : 'loadData();'
	});

	//关闭群组页面
//	api.execScript({
//		frameName : 'txl_content_frame',
//		script : 'hideMyself();'
//	});
	api.closeWin();
}

/**
 * 安卓点击返回的时候
 * 周枫
 * 2015.08.31
 */
function backFromChatForAndroid() {
	api.addEventListener({
		name : "keyback"
	}, function(ret, err) {
		back();
	});
}

