
var header_h;
//姓名关键字
var keyword = '';
//总记录数
var totalCount = 0;
//总页数
var totalPages = 0;
//定义一个变量存储第一次加载返回来的总记录数
var totalData = 0;
// 定义一个变量存储第一次加载返回来的总页数
var totalPages = 0;
//当前页面为第一页
var currentPage;
//定义查找好友身份id
var identity_ids = 5;
var BASE_URL_ACTION;
//从哪个页面跳转
var add_from_html = '';
/**
 * 打开选择好友类型滑动
 * 周枫
 * 2015.11.21
 */
function openNavigationBarAddFriend() {
    commonCloseNavigationBar();
	var friend_tea = {
		title : '教师',
		id : 5
	};
	var friend_stu = {
		title : '学生',
		id : 6
	};
	var friend_par = {
		title : '家长',
		id : 7
	};
	var bar_items = [];
	bar_items.push(friend_tea);
	bar_items.push(friend_stu);
	bar_items.push(friend_par);
	var params = {
        y : header_h +50,
        items : bar_items,
        winName : api.winName,
        frameName : api.frameName,
        itemSize : {
            w : Math.floor(api.frameWidth / 3)
        }
    };
//  if(api.uiMode == 'pad'){
//      params.border ="1px solid #EAEAEA";
//  }
    commonMyNavigationBar(params);
}

/**
 * menu点击
 * 周枫
 * 2016.1.20
 */
function callBackNew(id, index) {
	var bar_index =index;
	//赋值查找身份参数
	identity_ids = id;
	currentPage = 1;
	document.getElementById("friends_list_div").scrollIntoView();
	loadFriendsListData(identity_ids, currentPage, true);
}
/*
*author:zhaoj
*function:设置搜索值，并根据搜索条件加载相关数据数据
*date：20161220
*/
function setKeyword(data) {
    keyword = data;
    if (keyword != '') {
        if (api.systemType == 'ios') {
            keyword = keyword.replace(/%2B/g, "+");
        }
        keyword = Base64.decode(keyword);
    }
    currentPage = 1;
    loadFriendsListData(identity_ids, currentPage, true);
}
/**
 * 获取好友列表
 * 周枫
 * 2016.1.19
 */
function loadFriendsListData(identity_ids, currentPage, isReload) {
	api.showProgress({
		title : '加载中...',
		text : '请稍候...',
		modal : false
	});
	var identity_id = $api.getStorage('identity');
	var person_id = $api.getStorage('person_id');
	currentPage = isReload ? 1 : currentPage;
	var org_id = $api.getStorage('bureau_id');

	//查询请求
	var list_url = BASE_URL_ACTION + '/ypt/space/common/getPersonInfoByOrgId?random_num=' + creatRandomNum() + '&org_id=' + org_id + '&identity_id=' + identity_id + '&identity_ids=' + identity_ids + '&person_id=' + person_id + '&pagenum=' + currentPage + '&pagesize=' + BASE_PAGE_SIZE;
	//是否有通知名称
	keyword = $api.trimAll(keyword);
	if (keyword != '') {
		var keyword_encode = Base64.encode(keyword);
		if (api.systemType == 'ios') {
			keyword_encode = keyword_encode.replace(/\+/g, "%2B");
		}
		list_url = list_url + '&seachetext=' + keyword_encode;
	}
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
		api.hideProgress();
		if (err) {
			popToast('对不起，获取好友列表失败');
		} else {
			if (ret.success) {
				totalData = ret.totalrow;
				totalPages = ret.totalpage;
				if (isReload) {
					// 重新设置为1
					currentPage = 1;
				}
				exeAvatarPic(0, ret, function(is_true, friends_list_json) {
					friends_list_json.identity_ids = identity_ids;
					var html_type = template.render('friends_list_script', friends_list_json);
					if (currentPage == 1) {
						document.getElementById('friends_list_div').innerHTML = html_type;
					} else {
						$api.append($api.byId('friends_list_div'), html_type);
					}
				});
				//延迟加载图片
				setTimeout(function() {
					echoInit();
				}, 300);
				if(add_from_html == 'add'){
					add_from_html = '';
				}
			} else {
				popToast('对不起，获取好友列表失败');
			}
		}
	});
}

function exeAvatarPic(a_c, friends_list_json, callback) {
	var friends_list = friends_list_json.list;
	var a_l = friends_list.length;
	if (a_c < a_l) {
		var avatar_id = friends_list[a_c].avatar_fileid;
		var avatar_url = '';
		if (avatar_id == '') {
			avatar_url = '../../image/common/header.png';
		} else {
			if ($api.getStorage('BASE_APP_TYPE') == 1) {
				avatar_url = BASE_IMAGE_PRE+"down/Material/" + avatar_id.substring(0, 2) + "/" + avatar_id + "@48w_48h_100Q_1x.png";
			} else {
				avatar_url = BASE_URL_ACTION + "/html/thumb/Material/" + avatar_id.substring(0, 2) + "/" + avatar_id + "@48w_48h_100Q_1x.png";
			}
		}
		friends_list[a_c].avatar_fileid = avatar_url;
		a_c++;
		return exeAvatarPic(a_c, friends_list_json, callback);
	} else {
		callback(true, friends_list_json);
	}
}

/**
 * 上拉刷新页面数据
 * 周枫
 * 2015.11.24
 */
function scrollBottomReload() {
	//下移到底部：
	api.addEventListener({
		name : 'scrolltobottom',
		extra : {
			threshold : 100 //设置距离底部多少距离时触发，默认值为0，数字类型
		}
	}, function(ret, err) {
		if ((currentPage + 1) <= totalPages) {
			loadFriendsListData(identity_ids, currentPage + 1, false);
			currentPage = currentPage + 1;
			// 页码+1
		} else {
			api.toast({
				msg : '已加载全部数据',
				location : 'bottom'
			});
		}
	});
}

/**
 * 增加好友
 * 周枫
 * 2016.1.20
 */
function addFriend(friend_id, friend_name, is_friend, fidentity_id, flogin_name) {
	var identity_id = $api.getStorage('identity');
	var person_id = $api.getStorage('person_id');
	flogin_name = friend_id + "_"+fidentity_id+"_"+$api.getStorage("BASE_SERVER_NAME");
	//判断是否已经是好友
	if (is_friend) {
		api.alert({
			msg : '你们已经是好友啦，去找其他小伙伴吧~~'
		}, function(ret, err) {
			return;
		});
	} else {
		//不能加自己
		if (friend_id == person_id) {
			api.alert({
				msg : '您不能添加自己为好友~~'
			}, function(ret, err) {
				return;
			});
		} else {
			judgeHasFriend(fidentity_id,friend_id,function(flag){
				if(flag){
					popAlert('你们已经成为好友了');
				}else{
					api.confirm({
						title : "添加好友",
						msg : "您确定要添加【" + friend_name + "】为好友吗？",
						buttons : ["确定", "取消"]
					}, function(ret, err) {
						var sourceType;
						if (1 == ret.buttonIndex) {
							showSelfProgress('加载中...');
							//获取好友分组，取默认群组
							getGroupsInfo(function(is_true, data) {
								api.hideProgress();
								if (is_true) {
									applyFriend(data, friend_id, fidentity_id, function(is_true, msg) {
										if (is_true) {
											popAlert(msg);
											sendSysMsgToFriend(flogin_name);
										} else {
											popAlert(msg);
											sendSysMsgToFriend(flogin_name);
										}
		
									});
								} else {
									popAlert(msg);
								}
							});
						} else {
							return;
						}
					});
				}
			});
		}
	}
}
/**
 * 判断是否已经成为好友
 * zhaoj
 * 费丽明
 * 2017.07.14
 */
function judgeHasFriend(b_identityid,b_personid,callback){
	api.ajax({
		url : BASE_URL_ACTION + '/space/attention/get?personid=' + $api.getStorage('person_id') + '&identityid=' + $api.getStorage('identity')+ '&b_identityid=' + b_identityid+ '&b_personid=' + b_personid + '&type=space'+ '&random_num=' + creatRandomNum(),
		method : 'get',
		dataType : 'json',
		timeout:30,
		cache : false,
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage('person_id') + '; identity_id=' + $api.getStorage('identity') + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		if (err) {
			callback(false);
		} else {
			if (ret) {
				callback(ret.isFriend);
			} else {
				callback(false);
			}
		}
	});
}
/**
 * 获取好友分组，取默认群组
 * 周枫
 * 2016.1.22
 */
function getGroupsInfo(callback) {
	var identity_id = $api.getStorage('identity');
	var person_id = $api.getStorage('person_id');
	api.ajax({
		url : BASE_URL_ACTION + '/ypt/friend/getGroups?person_id=' + person_id + '&identity_id=' + identity_id + '&random_num=' + creatRandomNum(),
		method : 'get',
		dataType : 'json',
		timeout:30,
		cache : false,
		headers : {
			'Cookie' : 'person_id=' + person_id + '; identity_id=' + identity_id + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		if (err) {
			callback(false, '对不起，获取群组列表失败');
		} else {
			if (ret.success) {
				var my_groups = ret.groups;
				if (my_groups.length > 0) {
					for (var i = 0; i < my_groups.length; i++) {
						if (my_groups[i].group_type == 1) {
							callback(true, my_groups[i].group_id);
							break;
						}
					}
				}
			} else {
				callback(false, '对不起，获取群组列表失败');
			}
		}
	});
}

/**
 * 发送添加好友申请
 * 周枫
 * 2016.1.22
 */
function applyFriend(group_id, fperson_id, fidentity_id, callback) {
	var identity_id = $api.getStorage('identity');
	var person_id = $api.getStorage('person_id');
	api.ajax({
		url : BASE_URL_ACTION + '/ypt/friend/applyFriend?person_id=' + person_id + '&identity_id=' + identity_id + '&fperson_id=' + fperson_id + '&fidentity_id=' + fidentity_id + '&group_id=' + group_id + '&random_num=' + creatRandomNum(),
		method : 'get',
		dataType : 'json',
		timeout:30,
		cache : false,
		headers : {
			'Cookie' : 'person_id=' + person_id + '; identity_id=' + identity_id + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		api.hideProgress();
		if (err) {
			callback(false, '对不起，添加好友申请发送失败，请检查您的网络设置');
		} else {
			if (ret.success) {
				//增加好友后，刷新通讯录列表
				$api.setStorage('friend_is_change', 1);
				callback(true, ret.info);
			} else {
				callback(true, ret.info);
			}
		}
	});
}

/**
 * 给添加好友对方发送系统通知
 * 周枫
 * 2016.1.23
 * @param {Object} target_name
 */
function sendSysMsgToFriend(target_name) {
	var msg_json = {};
	msg_json["sender_id"] = $api.getStorage('person_id');
	msg_json["sender_person_name"] = $api.getStorage('person_name');
//	msg_json["sender_login_name"] = $api.getStorage('login_name');
	msg_json["sender_login_name"] = $api.getStorage('login_name_rong');
	msg_json["sender_identity"] = $api.getStorage('identity');

	msg_json["is_url"] = 1;
	msg_json["url_name"] = 'txl_addfriends_window';
	msg_json["param_num"] = 7;
	msg_json["sysmsg_code"] = 'ADD_FRIEND';
	msg_json["bureau_id"] = $api.getStorage('bureau_id');
	msg_json["district_id"] = $api.getStorage('district_id');
	msg_json["city_id"] = $api.getStorage('city_id');
	msg_json["province_id"] = $api.getStorage('province_id');

	var target_list_attr = [];
	var target_list_json = {};
	target_list_json["target_login_name"] = target_name;
	target_list_attr[0] = target_list_json;
	msg_json["target_list"] = target_list_attr;

	var param_list_json = {};
	param_list_json["param1"] = '会话消息';
	param_list_json["param2"] = $api.getStorage('person_name');
	param_list_json["param3"] = '通讯录——添加好友';
	param_list_json["param4"] = '';
	param_list_json["param5"] = '';
	param_list_json["param6"] = '';
	param_list_json["param7"] = '';
	param_list_json["param8"] = '';
	param_list_json["param9"] = '';
	param_list_json["param10"] = '';
	msg_json["params_list"] = param_list_json;

	msg_json = $api.jsonToStr(msg_json);
	console.log(msg_json)
	api.ajax({
		url : BASE_URL_ACTION + '/rongcloud/sendSystemMessage',
		method : 'post',
		dataType : 'json',
		cache : false,
		timeout:30,
		data : {
			values : {
				"sysmsg_json" : msg_json
			}
		}
	}, function(ret, err) {
		api.hideProgress();
		if (err) {

		} else {
			if (ret.success) {

			} else {

			}
		}
	});
}
