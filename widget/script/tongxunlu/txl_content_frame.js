//var listContact_frame;
var id;
var header_h;
var user_id, user_identity;
//类型： 1：群组 2：学校 3：班级 4:好友
var t;
var old_msg_id = -1;
var avatar_url;
var group_list_tmp;
var listContact_frame;
var BASE_URL_ACTION;

apiready = function() {
	commonSetTheme({"level":2,"type":0});
	//加载 listContact 模块
	listContact_frame = api.require('listContact');
	id = api.pageParam.id;
	t = api.pageParam.t;
	user_id = $api.getStorage('person_id');
	user_identity = $api.getStorage('identity');
	header_h = api.pageParam.header_h;
	BASE_URL_ACTION = $api.getStorage('BASE_URL_ACTION');
	loadData();

	//监听来自通讯录页面获取最新会话id的事件
	api.addEventListener({
		name : 'setOldMessageId'
	}, function(ret) {

		if (ret && ret.value) {
			var value = ret.value;
			old_msg_id = value.old_msg_id;
		}
	});
	//	listContactRefresh('loadData');
	var loadingImgae = 'widget://res/listContact_arrow.png';
	//刷新的小箭头，不可为空
	var bgColor = '#F5F5F5';
	//下拉刷新的背景颜色，有默认值，可为空
	var textColor = '#8E8E8E';
	//提示语颜色，有默认值，可为空
	var textDown = '下拉可以刷新...';
	//尚未触发刷新时间的提示语，有默认值，可为空
	var textUp = '松开开始刷新...';
	//触发刷新事件的提示语，有默认值，可为空
	var showTime = true;
	listContact_frame.setRefreshHeader({
		loadingImg : loadingImgae,
		bgColor : bgColor,
		textColor : textColor,
		textDown : textDown,
		textUp : textUp,
		showTime : showTime
	}, function(ret, err) {
		switch(t) {
			case 1:
				$api.rmStorage('group_list_qz');
				break;
			case 2:
				$api.rmStorage('group_list_xx');
				break;
			case 3:
				$api.rmStorage('group_list_bj');
				break;
		}
		
		//停止下拉刷新
		getGroupInfo(function(group_list) {
			setTimeout(function() {
				listContact_frame.reloadData({
					data : group_list
				});
			}, 1000);

		});
	});
};

/**
 * 加载通讯录列表
 * 周枫
 * 2015.08.18
 */
function loadData() {
	api.showProgress({
		title : '加载中...',
		text : '请稍候...',
		modal : false
	});
	getGroupInfo(function(group_list) {

		//	api.alert({
		//		msg:JSON.stringify(group_list)
		//  },function(ret,err){
		//  	//coding...
		//  });

		//根据用户ID获取通讯录数据
		//	getTongXunluByUserId(person_id, person_identity, function(txl_data) {
		//打开list
		listContact_frame.open({
			y : header_h,
			w : 'auto',
			h : api.winHeight - header_h,
			cellBgColor : '#FFFFFF',
			cellHeight : 60,
			borderColor : '#DDDFE3',
			indicator : {	},
			groupTitle : {
				size : 12
			},
			data : group_list
		}, function(ret, err) {
			api.hideProgress();

			//点击index值
			var r_i = ret.index;
			//聊天类型
			var conver_type = group_list[ret.key][r_i].conver_type;
			//名字
			var title = group_list[ret.key][r_i].title;
			//头像
			avatar_url = group_list[ret.key][r_i].img;

			var target_id;
			//登录名,target_id
			switch(conver_type) {
				case "PRIVATE":
					target_id = group_list[ret.key][r_i].login_name;
					break;
				case "GROUP":
					target_id = group_list[ret.key][r_i].id;
					//根据id获取群组内人员
//					getGroupInfoById(target_id);
					break;
			}
			//发送target_id获取最新会话id
			api.sendEvent({
				name : 'getOldMessageId',
				extra : {
					target_id : target_id,
					conver_type : conver_type,
					count : 1
				}
			});
			//打开会话页面
			setTimeout('execHhList("' + target_id + '","' + title + '","' + conver_type + '");', 500);
		});
		//	});
	});

}

/**
 * 获取群组，包括学校教师，班级学生，群组列表
 * 周枫
 * 2015.08.25
 */
function getGroupInfo(callback) {
//		api.alert({
//			msg : 't:' + t + ',id:' + id + ',user_id:' + user_id + ',user_identity:' + user_identity
//		}, function(ret, err) {
//			//coding...
//		});
	switch(t) {
		case 1:
			group_list_tmp = $api.getStorage('group_list_qz');
			break;
		case 2:
			group_list_tmp = $api.getStorage('group_list_xx');
			break;
		case 3:
			group_list_tmp = $api.getStorage('group_list_bj');
			break;
	}
	if ( typeof (group_list_tmp) != "undefined") {
		callback(group_list_tmp);
	} else {
		api.ajax({
			url : BASE_URL_ACTION + '/dsjxt/getGroupInfo?t=' + t + '&id=' + id + '&user_id=' + user_id + '&user_identity=' + user_identity + '&app_type=' + $api.getStorage('BASE_APP_TYPE'),
			method : 'get',
			timeout:30,
			dataType : 'text'
		}, function(ret, err) {
			if (err) {
				api.alert({
					msg : '对不起，获取失败'
				}, function(ret, err) {
					switch(t) {
						case 1:
							$api.rmStorage('group_list_qz');
							break;
						case 2:
							$api.rmStorage('group_list_xx');
							break;
						case 3:
							$api.rmStorage('group_list_bj');
							break;
					}
				});
			} else {
				var obj = eval('(' + ret + ')');
				if (getJsonObjLength(obj) == 0) {
					$api.css($api.byId("txl_data"), "display:block;");
				} else {
					if (obj) {
						switch(t) {
							case 1:
								$api.setStorage('group_list_qz', obj);
								break;
							case 2:
								$api.setStorage('group_list_xx', obj);
								break;
							case 3:
								$api.setStorage('group_list_bj', obj);
								break;
						}
						callback(obj);

					}
				}
			}
		});
	}

}

/**
 * 延迟打开会话聊天界面
 * 周枫
 * 2015.08.24
 * @param {Object} target_id
 * @param {Object} title
 * @param {Object} conver_type
 * target_id, old_msg_id, person_name, conver_type
 */
function execHhList(target_id, title, conver_type) {
	closeMyself();
	hideMyself();
	api.execScript({
		name : 'root',
		frameName : 'hh_index',
		script : 'openHhList("' + target_id + '",' + old_msg_id + ',"' + title + '","' + conver_type + '","txl_content",\"' + avatar_url + '\");'
	});
}

/**
 * 关闭列表
 * 周枫
 * 2015.08.18
 */
//function closeMyself() {
////api.alert({
////msg:'123123'
////},function(ret,err){
////	//coding...
////});
//	listContact_frame.close();
//	api.closeFrame();
//}

/**
 * 关闭列表
 * 周枫
 * 2015.08.18
 */
function closeMyself() {
	listContact_frame.close();
	//	api.closeWin();
}

function hideMyself() {
	listContact_frame.hide();
}

function showMyself() {
	listContact_frame.show();
}