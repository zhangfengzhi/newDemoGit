//顶部header高度
var header_h;

//var listContact;
//定义user_id
var person_id;
//定义身份
var person_identity;
var footer_h;

var old_msg_id;
var avatar_url;
var listContact_index;
var BASE_URL_ACTION;

//var is_online;
apiready = function() {
	commonSetTheme({"level":2,"type":0});
	//定位header位置，留出上面电池等空隙，苹果需要
	var $header = $api.dom('header');
	$api.fixIos7Bar($header);
	header_h = api.pageParam.header_h;
	footer_h = api.pageParam.footer_h;
	person_id = $api.getStorage('person_id');
    person_identity = $api.getStorage('identity');
	BASE_URL_ACTION = $api.getStorage('BASE_URL_ACTION');
	//加载 listContact 模块
	listContact_index = api.require('listContact');
	person_id = $api.getStorage('person_id');
	person_identity = $api.getStorage('identity');
	//监听是否在线
	//	isOnLine();
	//	receviIsOnLine();
	//监听来自通讯录页面获取最新会话id的事件
	api.addEventListener({
		name : 'setOldMessageId'
	}, function(ret) {
		//		api.alert({
		//			msg : 'aaaaa' + ret.value.old_msg_id
		//      },function(ret,err){
		//      	//coding...
		//      });
		if (ret && ret.value) {
			var value = ret.value;
			old_msg_id = value.old_msg_id;
		}
	});
	//	getTxlListFromDb();
};
//是否重新获取通讯录列表数据
var is_reload = true;
/**
 * 加载通讯录列表
 * 周枫
 * 2015.08.18
 */
function loadData() {
	is_reload = false;
	closeMyself();
	person_id = $api.getStorage('person_id');
	person_identity = $api.getStorage('identity');
	api.showProgress({
		title : '加载中...',
		text : '请稍候...',
		modal : true
	});
	//根据用户ID获取通讯录数据
	getTongXunluByUserId(person_id, person_identity, is_reload, function(txl_data) {
		/**因ios 13以上listContact模块崩溃，先暂时处理数据--start**/
		var tempAry;
		if (txl_data["common"]){
			tempAry = txl_data["common"];
		}else{
			tempAry = [];
		}
		for (var key in txl_data){
			if (key != "common" ){
				tempAry = tempAry.concat(txl_data[key]);
			}
		}
		txl_data = {"common":tempAry};
		/**因ios 13以上listContact模块崩溃，先暂时处理数据--end**/
		api.hideProgress();
		var w_num;
		if(api.systemType = 'ios') {
			 w_num = api.winWidth;
		} else {
			w_num = 'auto';
		}
		//打开list
		listContact_index.open({
			y : 0,
			w : w_num,
			h : api.frameHeight,
			cellBgColor : '#FFFFFF',
			cellHeight : 60,
			indicator : {	},
			data : txl_data,
			borderColor : '#DDDFE3',
    		fixedOn: api.frameName
		}, function(ret, err) {
			api.hideProgress();
			//	index:              //点击某个cell所在区域内的cell的下标
			//  section:            //被点击的cell所在的区域的下标
			//  key：               //被点击的cell的区域的key
			//  clickType:            //点击类型，0-cell；1-右边按钮；2-左边的按钮
			//  btnIndex:           //点击按钮时返回其下标
			//点击index值
			var r_i = ret.index;
			//						api.alert({
			//						msg:'r_i:'+r_i+',key:'+ret.key+',txl_data:'
			//			          },function(ret,err){
			//			          	//coding...
			//			          });
			//json串长度
			//			var l_d = getJsonObjLength(txl_data.common);
			//安卓下只有common乱序
			//			if (ret.key == 'common') {
			//				if (api.systemType == 'android') {
			//					//算出正确的值，因为安卓有BUG倒叙
			//					r_i = l_d - (r_i + 1);
			//				}
			//			}

			//名字
			var title = txl_data[ret.key][r_i].title;
			//类型： 1：群组 2：学校 3：班级 4:好友
			var t = txl_data[ret.key][r_i].t;

			avatar_url = txl_data[ret.key][r_i].placeholderImg;
			//类型： 1：群组 2：学校 3：班级 4:好友
			if (t == 4) {
				//登录名,target_id
				var target_id = txl_data[ret.key][r_i].login_name;

				//发送target_id获取最新会话id
				api.sendEvent({
					name : 'getOldMessageId',
					extra : {
						target_id : target_id,
						conver_type : 'PRIVATE',
						count : 1
					}
				});
				//打开会话页面
				setTimeout('execHhList("' + target_id + '","' + title + '","PRIVATE");', 500);
			} else if (t == 5) {
				//添加好友
				openModule({"win_url":"txl_addfriends_window","type":"11","code":"","mode_type":1});
			} else {
				//群组id
				var target_id = txl_data[ret.key][r_i].id;
				//聊天类型
				var conver_type = txl_data[ret.key][r_i].conver_type;
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
			}
		});
	});

}
/**
 * 加载通讯录列表
 * 周枫
 * 2015.08.18
 */
function loadHhData(callback) {
	person_id = $api.getStorage('person_id');
	person_identity = $api.getStorage('identity');
	api.showProgress({
		title : '加载中...',
		text : '请稍候...',
		modal : true
	});
	//根据用户ID获取通讯录数据
	getTongXunluByUserId(person_id, person_identity, is_reload, function(txl_data) {
		api.hideProgress();
		callback();
	});

}
/**
 * 根据用户ID获取通讯录数据
 * 周枫
 * 2015.08.21
 */
function getTongXunluByUserId(user_id, user_identity, is_reload, callback) {

	//判断是否联网
	isOnLineStatus(function(is_online, line_type) {
		if (is_online) {
			$.ajax({
				type : 'GET',
				url : BASE_URL_ACTION + '/dsjxt/getAddressBookInfo',
				data : {
					user_id : user_id,
					user_identity : user_identity,
					app_type : $api.getStorage('BASE_APP_TYPE')
				},
				dataType : 'json',
				timeout : 0,
				success : function(data) {
					//比对md5判断是否需要重新加载
					isReloadTxlData(false, data, function(is_reload) {
						//需要重新加载
						if (is_reload) {
							//不需要重新加载：从数据库获取通讯录列表
							getTxlListFromDb(function(txl_list) {
								if (getJsonObjLength(txl_list) == 0) {
									api.hideProgress();
									callback(txl_list);
								} else {
									callback(txl_list);
								}
							});
						} else {
							//如果需要重载
							isOnLineStatus(function(is_online, line_type) {
								if (is_online) {
									//初始化
									newSaveTxlToDb(data.list, data.md5, false, function(is_true) {
										if (is_true) {
											getTxlListFromDb(function(txl_list) {
												callback(txl_list);
											});
										}
									});
								} else {
									api.alert({
										msg : '当前网络不可用，请检查你的网络设置'
									}, function(ret, err) {

									});
								}
							});

						}
					});
				},
				error : function(xhr, type) {
					api.hideProgress();
					api.alert({
						msg : '对不起，获取通讯录数据失败'
					}, function(ret, err) {

					});
				}
			});

		} else {
			api.hideProgress();
			//从数据库获取通讯录列表
			getTxlListFromDb(function(txl_list) {
				callback(txl_list);
			});
		}
	});
}

/**
 * 关闭列表
 * 周枫
 * 2015.08.18
 */
function closeMyself() {
	listContact_index.close();
	//	api.closeWin();
}

function hideMyself() {
	listContact_index.hide();
}

function showMyself() {
	listContact_index.show();
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
	api.execScript({
		name : 'root',
		frameName : 'hh_index',
		script : 'openHhList("' + target_id + '",' + old_msg_id + ',"' + title + '","' + conver_type + '","txl_index",\"' + avatar_url + '\");'
	});
	//	var is_online = parseInt($api.getStorage('is_online'));
	//	if (is_online == 1) {
	//		setTimeout(function() {
	//			hideMyself();
	//		}, 3000);
	//
	//	}
}

function reloadData() {
	is_reload = true;
	closeMyself();
	api.showProgress({
		title : '加载中...',
		text : '请稍候...',
		modal : true
	});
	//根据用户ID获取通讯录数据
	getTongXunluByUserId(person_id, person_identity, is_reload, function(txl_data) {
		/**因ios 13以上listContact模块崩溃，先暂时处理数据--start**/
		var tempAry;
		if (txl_data["common"]){
			tempAry = txl_data["common"];
		}else{
			tempAry = [];
		}
		for (var key in txl_data){
			if (key != "common" ){
				tempAry = tempAry.concat(txl_data[key]);
			}
		}
	
		txl_data = {"common":tempAry};
		/**因ios 13以上listContact模块崩溃，先暂时处理数据--end**/
		api.hideProgress();
		var w_num;
		if(api.systemType = 'ios') {
			 w_num = api.winWidth;
		} else {
			w_num = 'auto';
		}
		//打开list
		listContact_index.reloadData({
			y : header_h,
			w : w_num,
			h : api.winHeight - header_h - footer_h,
			cellBgColor : '#FFFFFF',
			cellHeight : 60,
			indicator : {	},
			data : txl_data,
			borderColor : '#DDDFE3'
		}, function(ret, err) {
			api.hideProgress();
			//	index:              //点击某个cell所在区域内的cell的下标
			//  section:            //被点击的cell所在的区域的下标
			//  key：               //被点击的cell的区域的key
			//  clickType:            //点击类型，0-cell；1-右边按钮；2-左边的按钮
			//  btnIndex:           //点击按钮时返回其下标
			//点击index值
			var r_i = ret.index;

			//名字
			var title = txl_data[ret.key][r_i].title;
			//类型： 1：群组 2：学校 3：班级 4:好友
			var t = txl_data[ret.key][r_i].t;

			avatar_url = txl_data[ret.key][r_i].placeholderImg;
			//类型： 1：群组 2：学校 3：班级 4:好友

			if (t == 4) {
				//登录名,target_id
				var target_id = txl_data[ret.key][r_i].login_name;
				//				avatar_url = txl_data[ret.key][r_i].placeholderImg;
				//发送target_id获取最新会话id
				api.sendEvent({
					name : 'getOldMessageId',
					extra : {
						target_id : target_id,
						conver_type : 'PRIVATE',
						count : 1
					}
				});
				//打开会话页面
				setTimeout('execHhList("' + target_id + '","' + title + '","PRIVATE");', 1);
			} else {
				//群组id
				var target_id = txl_data[ret.key][r_i].id;
				//聊天类型
				var conver_type = txl_data[ret.key][r_i].conver_type;

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
				setTimeout('execHhList("' + target_id + '","' + title + '","' + conver_type + '");', 1);
			}
		});
	});

}

function getTxlListFromDb(callback) {
//	var owner_id = $api.getStorage('login_name');
	var owner_id = $api.getStorage('login_name_rong');
	//查询群组内容
	var sql_group = "SELECT group_id, group_name, avatar_url, avatar_url_native FROM t_base_group WHERE owner_id = '" + owner_id + "';";
	//查询有多少个好友简拼，组装成多少个json串
	var sql_person_count = "SELECT jp_first FROM t_base_person WHERE is_friend = 1 AND owner_id = '" + owner_id + "' GROUP BY jp_first;";
	//通讯录json
	var txl_json = {};
	//简拼
	//	var jp = '';
	var count_temp = 0;
	//查询有多少个好友简拼，组装成多少个json串
	selectPersonListSizeFromDb(sql_person_count, function(data_attr) {
		if (data_attr.length >= 0) {
			//循环获取每个简拼对应的json数据
			for (var k = 0; k < data_attr.length; k++) {
				jp = data_attr[k].jp_first;
				//获取人员列表
				selectPersonListFromDbBefore(data_attr[k], owner_id, function(person_attr, jp) {
					txl_json[jp] = person_attr;
				});
				count_temp++;
			}
			if (count_temp == data_attr.length) {
				//获取群组json数据
				selectGroupListFromDb(sql_group, function(group_attr) {
					txl_json["common"] = group_attr;
					callback(txl_json);
				});
			}
		} else {
			callback(txl_json);
		}
	});
}

/**
 * 查询好友数据列表准备
 * 周枫
 * 2015.12.30
 * @param {Object} jp_attr
 * @param {Object} owner_id
 * @param {Object} callback
 */
function selectPersonListFromDbBefore(jp_attr, owner_id, callback) {
	var sql_person = "";
	if (jp_attr.jp_first != '') {
		sql_person = "SELECT person_id, person_name, login_name, avatar_url, avatar_url_native FROM t_base_person WHERE is_friend = 1 AND owner_id = '" + owner_id + "' AND jp_first = '" + jp_attr.jp_first + "';";
		selectPersonListFromDb(sql_person, function(person_attr) {
			callback(person_attr, jp_attr.jp_first);
		});
	}

}

/**
 * 查询好友数据列表数量，总共返回多少个好友json
 * 周枫
 * 2015.12.30
 */
function selectPersonListSizeFromDb(sql, callback) {
	dbSelectSql(sql, function(data_attr) {
		if (data_attr != false || data_attr.length == 0) {
			callback(data_attr);
		} else {
//			api.alert({
//				msg : '存入接收消息失败:selectPersonListSizeFromDb'
//			});
		}
	});
}

/**
 * 查询群组数据列表
 * 周枫
 * 2015.12.30
 */
function selectGroupListFromDb(sql, callback) {
	dbSelectSql(sql, function(data_attr) {
		if (data_attr != false) {
			//添加好友列表
			isHaveFriendList(function(txl_friedn_attr) {
				//重组通讯录显示数据格式
				createGroupList(txl_friedn_attr, data_attr, function(group_json) {
					callback(group_json);
				});
			});
		} else {
//			api.alert({
//				msg : '存入接收消息失败:selectGroupListFromDb'
//			});
		}
	});
}

/**
 * 查询好友数据列表
 * 周枫
 * 2015.12.30
 */
function selectPersonListFromDb(sql, callback) {
	dbSelectSql(sql, function(data_attr) {
		if (data_attr != false) {
			createPersonList(data_attr, function(person_json) {
				callback(person_json);
			});
		} else {
//			api.alert({
//				msg : '存入接收消息失败:selectPersonListFromDb'
//			});
		}
	});
}

/**
 * 组装群组数组
 * 周枫
 * 2015.12.30
 * @param {Object} data_attr
 * @param {Object} callback
 */
function createGroupList(txl_friend_attr, data_attr, callback) {
	var group_data = [];
	group_data = txl_friend_attr;
	var tf_l = getJsonObjLength(txl_friend_attr);
	api.execScript({
		name : 'root',
		script : 'getUnreadCount("txl",' + tf_l + ');'
	});

	var t_start = 0;
	if (tf_l > 0) {
		t_start = tf_l;
	} else {
		t_start = 0;
	}
	//	var group_json = {};
	for (var i = 0; i < data_attr.length; i++) {
		var txl_json = {};
		txl_json["conver_type"] = 'GROUP';
		txl_json["title"] = data_attr[i].group_name;
		txl_json["id"] = data_attr[i].group_id;
		txl_json["titleSize"] = 16;
		txl_json["titleColor"] = '#000000';
		txl_json["placeholderImg"] = data_attr[i].avatar_url_native;
		txl_json["img"] = data_attr[i].avatar_url;
		txl_json["t"] = data_attr[i].t;
		group_data[t_start + i] = txl_json;
	}
	callback(group_data);

}

/**
 * 如果有好友列表，重组数据格式为通讯录需要格式
 * 周枫
 * 2017.02.28
 */
function createFriendList(data_attr, callback) {
	var group_data = [];
	//	var group_json = {};
	for (var i = 0; i < data_attr.length; i++) {
		var txl_json = {};
		txl_json["conver_type"] = 'FRIEND';
		txl_json["title"] = data_attr[i].person_name;
		txl_json["subTitle"] = '请求添加你为好友';
		txl_json["id"] = data_attr[i].person_id;
		txl_json["titleSize"] = 16;
		txl_json["titleColor"] = '#000000';
		txl_json["subTitleSize"] = 12;
		txl_json["subTitleColor"] = '#666666';
		//人员头像
		var avatar_id = data_attr[i].avatar_file_id;
		var avatar_url = "";
		if((typeof(avatar_id) == "undefined") || (avatar_id == '')){
			avatar_url = 'widget://image/common/header.png';
		} else {
			if ($api.getStorage('BASE_APP_TYPE') == 1) {
				avatar_url = BASE_IMAGE_PRE+"down/Material/" + avatar_id.substring(0, 2) + "/" + avatar_id + "@48w_48h_100Q_1x.png";
			} else {
				avatar_url = BASE_URL_ACTION + "/html/thumb/Material/" + avatar_id.substring(0, 2) + "/" + avatar_id + "@48w_48h_100Q_1x.png";
			}
		}
		txl_json["placeholderImg"] = 'widget://image/common/header.png';
		txl_json["img"] = avatar_url;
		txl_json["t"] = 5;
		group_data[i] = txl_json;
	}
	callback(group_data);
}

/**
 * 是否存在添加好友列表
 * 周枫
 * 2017.02.28
 */
function isHaveFriendList(callback) {
	//查询请求
	var list_url = BASE_URL_ACTION + '/ypt/friend/getApplyFriend?person_id=' + person_id + '&identity_id=' + person_identity + '&random_num=' + creatRandomNum();
	api.ajax({
		url : list_url,
		method : 'get',
		dataType : 'json',
		timeout:30,
		cache : false,
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		if (err) {
			popToast('对不起，获取好友列表失败');
			api.hideProgress();
		} else {
			if (ret.success) {

				createFriendList(ret.applys, function(txl_friend_attr) {
					callback(txl_friend_attr);
				});

			} else {
				popToast('对不起，获取好友列表失败');
				api.hideProgress();
			}
		}
	});
}

/**
 * 组装好友数组
 * 周枫
 * 2015.12.30
 * @param {Object} data_attr
 * @param {Object} callback
 */
function createPersonList(data_attr, callback) {
	var person_data = [];
	for (var i = 0; i < data_attr.length; i++) {
		var txl_json = {};
		txl_json["t"] = 4;
		txl_json["titleColor"] = '#000000';
		txl_json["title"] = data_attr[i].person_name;
		txl_json["id"] = data_attr[i].person_id;
		txl_json["login_name"] = data_attr[i].login_name;
		txl_json["titleSize"] = 16;
		txl_json["placeholderImg"] = data_attr[i].avatar_url_native;
		txl_json["img"] = data_attr[i].avatar_url;
		person_data[i] = txl_json;
	}
	callback(person_data);
}

//function isOnLine() {
//	api.alert({
//		msg : '11'
//  },function(ret,err){
//  	//coding...
//  });
//	api.sendEvent({
//		name : 'getIndexOnline'
//	});
//}
//
//function receviIsOnLine() {
//	api.addEventListener({
//		name : 'sendIndexOnline'
//	}, function(ret) {
//		api.alert({
//		msg : '44:' + ret.value.data
//  },function(ret,err){
//  	//coding...
//  });
//		is_online = ret.value.data;
//	});
//}