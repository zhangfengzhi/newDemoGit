var target_id;
var h_from;
var header_h;
var group_name;
//区分创建群组还是默认群组
var defaultGroup;
//0群主1管理员2普通成员
var memberTypeForApp;
//成员id
var memberIdForApp;
apiready = function() {
	commonSetTheme({"level":2,"type":0});
	//定位header位置，留出上面电池等空隙，苹果需要
	var header = $api.byId('aui-header');
	$api.fixStatusBar(header);
	target_id = api.pageParam.target_id;
	memberTypeForApp = api.pageParam.memberTypeForApp;
	memberIdForApp = api.pageParam.memberIdForApp;
	if (target_id.indexOf("school") == 0 || target_id.indexOf("class") == 0 || target_id.indexOf("plass") == 0 || memberTypeForApp == 2) {
		defaultGroup = 0;
		$api.css($api.byId('addpeople'), 'display:none;');
	} else {
		defaultGroup = 1;
		if ($api.getStorage("identity") == 5) {
			$api.css($api.byId('addpeople'), 'display:block;');
		}
	}

	header_h = api.pageParam.header_h;
	h_from = api.pageParam.h_from;
	group_name = api.pageParam.group_name;
	//安卓关闭
	if (api.systemType == 'android') {
		backFromChatForAndroid();
	}

	//打开framegroup
	initFrameGroup();

}
function initFrameGroup() {
	api.openFrameGroup({
		name : 'group_info',
		scrollEnabled : false,
		rect : {
			'x' : 0,
			'y' : header_h,
			'w' : 'auto',
			'h' : 'auto'
		},
		index : 0,
		//预加载
		preload : 1,
		scrollToTop : true,
		bounces : true,
		scrollEnabled : false,
		frames : [{
			name : 'hh_group_personlist_frame',
			scrollToTop : true,
			allowEdit : true,
			url : 'hh_group_personlist_frame.html',
			bgColor : '#f7f9f8',
			pageParam : {
				'target_id' : target_id,
				'header_h' : header_h,
				'group_name' : group_name,
				'h_from' : h_from
			},
			vScrollBarEnabled : true,
			hScrollBarEnabled : false,
			//页面是否弹动 为了下拉刷新使用
			bounces : false
		}, {
			name : 'hh_group_config_frame',
			scrollToTop : true,
			allowEdit : true,
			url : 'hh_group_config_frame.html',
			bgColor : '#f7f9f8',
			pageParam : {
				'target_id' : target_id,
				'header_h' : header_h,
				'group_name' : group_name,
				'h_from' : h_from,
				'memberTypeForApp' : memberTypeForApp,
				'memberIdForApp' : memberIdForApp
			},
			vScrollBarEnabled : true,
			hScrollBarEnabled : false,
			//页面是否弹动 为了下拉刷新使用
			bounces : false
		}]
	}, function(ret, err) {
	});
}

/**
 * 切换按钮
 * 周枫
 * 2016.1.21
 */
function changeBtnTitle(btn_id, btn_type) {
	var $btn_title = $api.byId('btn_title');
	var $btn_title_all = $api.domAll($btn_title, 'div');
	var btn_obj = $api.dom('#' + btn_id);
	for (var j = 0; j < $btn_title_all.length; j++) {
		$api.removeCls($btn_title_all[j], 'btn-top-active');
	}
	//定义切换页面样式json
	var rect_json = {};
	if (btn_type == 0) {
		if (defaultGroup == 0) {
			$api.css($api.byId('addpeople'), 'display:none;');
			$api.css($api.byId('alertGroupInformation'), 'display:none;');
		} else {
			if (memberTypeForApp == 0 || memberTypeForApp == 1) {
				if ($api.getStorage("identity") == 5) {
					$api.css($api.byId('addpeople'), 'display:block;');
				}
				$api.css($api.byId('alertGroupInformation'), 'display:none;');
			}
		}
		$api.addCls(btn_obj, 'btn-top-active');
		$api.addCls($api.byId('btn_title'), 't_display_b');
		$api.removeCls($api.byId('back'), 't_display_n');
	} else {
		if (defaultGroup == 0) {
			$api.css($api.byId('addpeople'), 'display:none;');
			$api.css($api.byId('alertGroupInformation'), 'display:none;');
		} else {
			$api.css($api.byId('addpeople'), 'display:none;');
			if (memberTypeForApp == 0) {
				$api.css($api.byId('alertGroupInformation'), 'display:block;');
			}
		}
		$api.addCls(btn_obj, 'btn-top-active');
		$api.removeCls($api.byId('btn_title'), 't_display_b');
		$api.removeCls($api.byId('back'), 't_display_n');
	}
	api.setFrameGroupIndex({
		name : 'group_info',
		index : btn_type,
		scroll : true
	});
}

/**
 *返回会话列表页面
 * 周枫
 * 2015.08.08
 */
function back() {
	api.execScript({
		name : 'root',
		frameName : 'txl_index',
		script : 'showMyself();'
	});
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

/*
 *author:ws
 *function:添加人员
 *date：20170112
 */
function addPeople() {
	var pageParamJson = {
		"header_h" : header_h,
		"target_id" : target_id
	};
	commonOpenWin('txl_people_group_window', '../tongxunlu/txl_people_group_window.html', false, false, pageParamJson);
}

/*
 *author:ws
 *function:修改群组
 *date：20170112
 */
function alertGroupInformation() {
	var arrGroupId = target_id.split("_");
	var groupId = arrGroupId[0];
	queryGroupById(groupId, function(flag, data) {
		if (flag) {
			var pageParamJson = {
				"header_h" : header_h,
				"type" : 2,
				"group_name" : data.GROUP_NAME,
				"group_desc" : data.GROUP_DESC,
				"picture_url" : data.AVATER_URL,
				"groupId" : groupId
			};
			commonOpenFrame("txl_addgroup_frame", "../tongxunlu/txl_addgroup_frame.html", header_h, false, false, "rgba(0,0,0,0)", pageParamJson);
		} else {
			popBottomToast('网络繁忙，请稍候重试');
		}
	});
}

/*
 *author:ws
 *function:修改群组时要先获取群组
 *date：20170112
 */
function queryGroupById(groupId, callback) {
	var BASE_URL_ACTION = BASE_URL_ACTION = $api.getStorage('BASE_URL_ACTION');
	api.ajax({
		url : BASE_URL_ACTION + '/ypt/group/queryGroupById',
		method : 'post',
		dataType : 'json',
		timeout : 30,
		data : {
			values : {
				groupId : groupId
			}
		},
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + ';identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		if (ret.success) {
			callback(true, ret)
		} else {
			callback(false, ret)
		}
	});

}

