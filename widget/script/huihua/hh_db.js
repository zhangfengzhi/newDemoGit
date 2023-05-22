var base_server_name = $api.getStorage('BASE_SERVER_NAME');
var base_app_type = $api.getStorage('BASE_APP_TYPE');
function getTongXunluToDb(callback) {
	var user_id = $api.getStorage('person_id');
	var user_identity = $api.getStorage('identity');
	
	$.ajax({
		type : 'GET',
		url : $api.getStorage('BASE_URL_ACTION') + '/dsjxt/getAddressBookInfo',
		// data to be added to query string:
		data : {
			user_id : user_id,
			user_identity : user_identity,
			app_type : base_app_type
		},
		// type of data we are expecting in return:
		dataType : 'json',
		timeout : 0,
		success : function(data) {
			isReloadTxlData(true, data, function(is_true) {
				if (is_true) {
					callback(true);
				} else {
					callback(false);
				}
			});
		},
		error : function(xhr, type) {
			callback(false);
		}
	});
	//	api.ajax({
	//		url : $api.getStorage('BASE_URL_ACTION') + '/dsjxt/getAddressBookInfo?user_id=' + user_id + '&user_identity=' + user_identity + '&app_type=' + $api.getStorage('BASE_APP_TYPE'),
	//		method : 'get',
	//		dataType : 'json',
	//		timeout : 60
	//	}, function(ret, err) {
	//		if (err) {
	//			callback(false);
	//		} else {
	//
	//			isReloadTxlData(true, ret, function(is_true) {
	//				if (is_true) {
	//					callback(true);
	//				} else {
	//					callback(false);
	//				}
	//			});
	//
	//		}
	//
	//	});
}

/**
 * 是否重新加载通信录数据
 * 周枫
 * 2016.1.7
 */
function isReloadTxlData(is_check, txl_ajax_json, callback) {
	var db_md5 = '';
	var ajax_md5 = '';
	selectTxlMd5FromDb(function(group_md5) {
		db_md5 = group_md5;
		ajax_md5 = txl_ajax_json.md5;
		if (is_check) {
			if (db_md5 == ajax_md5) {
				callback(true);
			} else {
				//保存通讯录入口
				newSaveTxlToDb(txl_ajax_json.list, ajax_md5, true, function(is_true) {
					api.removeEventListener({
						name : 'exeWorkerOk'
					});
					callback(true);
				});
			}
		} else {
			if (db_md5 == ajax_md5) {
				callback(true);
			} else {
				callback(false);
			}
		}
	});
}

/**
 * 保存通讯录入口
 * 修改为多线程操作
 * 周枫
 * 2016.1.8
 */
var s_txl_t = 0;
function newSaveTxlToDb(txl_list_json, group_md5, is_load_p_c_persons, callback) {
	newWorkerFirExeGroup();
	newWorkerSecExePerson();
	newWorkerThiExeTeachers();
	newWorkerFouExeStudents();
	s_txl_t = 0;
	//是否更新班级和同事数据
	if (is_load_p_c_persons) {
		api.sendEvent({
			name : 'hhExeGroup',
			extra : {
				txl_list_json : txl_list_json,
				owner_id : $api.getStorage('login_name_rong'),
				group_md5 : group_md5,
				is_load : is_load_p_c_persons
			}
		});
		api.sendEvent({
			name : 'hhExeFriend',
			extra : {
				txl_list_json : txl_list_json,
				owner_id : $api.getStorage('login_name_rong'),
				group_md5 : group_md5,
				is_load : is_load_p_c_persons
			}
		});
		api.sendEvent({
			name : 'hhExeTeachers',
			extra : {
				txl_list_json : txl_list_json,
				owner_id : $api.getStorage('login_name_rong'),
				group_md5 : group_md5,
				is_load : is_load_p_c_persons
			}
		});
		api.sendEvent({
			name : 'hhExeStudents',
			extra : {
				txl_list_json : txl_list_json,
				owner_id : $api.getStorage('login_name_rong'),
				group_md5 : group_md5,
				is_load : is_load_p_c_persons
			}
		});
	} else {
		api.sendEvent({
			name : 'hhExeGroup',
			extra : {
				txl_list_json : txl_list_json,
				owner_id : $api.getStorage('login_name_rong'),
				group_md5 : group_md5,
				is_load : is_load_p_c_persons
			}
		});
		api.sendEvent({
			name : 'hhExeFriend',
			extra : {
				txl_list_json : txl_list_json,
				owner_id : $api.getStorage('login_name_rong'),
				group_md5 : group_md5,
				is_load : is_load_p_c_persons
			}
		});
	}
	//返回多线程处理后结果
	api.addEventListener({
		name : 'exeWorkerOk'
	}, function(ret) {
		s_txl_t = 0;
		if (ret && ret.value) {
			var is_true = ret.value.is_true;
			if (is_true) {
				callback(true);
			} else {
				callback(false);
			}
		}
	});
}

/**
 * 多线程——递归处理群组数据
 * 周枫
 * 2016.1.26
 */
function newWorkerFirExeGroup() {
	api.addEventListener({
		name : 'hhExeGroup'
	}, function(ret) {
		api.removeEventListener({
			name : 'hhExeGroup'
		});
		if (ret && ret.value) {
			var owner_id = ret.value.owner_id;
			var group_md5 = ret.value.group_md5;
			var txl_list_json = ret.value.txl_list_json;
			var is_load = ret.value.is_load;
			//处理t_base_group
			newDeleteGroupToDb(owner_id, function(is_true) {
				if (is_true) {
					//判断当前ajax数据中是否存在common数据
					newAjaxIsHaveGroupData(txl_list_json, function(is_have) {
						//判断当前ajax数据中是否存在common数据
						if (is_have) {
							//递归处理群组数据
							newExeGroupData(0, txl_list_json.common, owner_id, function(is_true) {
								if (is_true) {
									newWorkerExeOk(group_md5, is_load);
								}
							});
						} else {
							newWorkerExeOk(group_md5, is_load);
						}
					});
				} else {

				}
			});
		}
	});

}

/**
 * 多线程——递归处理好友
 * 周枫
 * 2016.1.26
 */
function newWorkerSecExePerson() {
	api.addEventListener({
		name : 'hhExeFriend'
	}, function(ret) {
		api.removeEventListener({
			name : 'hhExeFriend'
		});
		if (ret && ret.value) {
			var owner_id = ret.value.owner_id;
			var group_md5 = ret.value.group_md5;
			var txl_list_json = ret.value.txl_list_json;
			var is_load = ret.value.is_load;
			//处理好友数据
			newDeletePersonToDb(owner_id, function(is_true) {
				if (is_true) {

					//判断当前ajax数据中是否存在好友数据
					newAjaxIsHavePersonData(txl_list_json, function(is_have) {
						if (is_have) {
							//递归处理好友
							newExePersonInfoData(0, txl_list_json.person, owner_id, function(is_true) {
								if (is_true) {
									newWorkerExeOk(group_md5, is_load);
								}

							});
						} else {
							newWorkerExeOk(group_md5, is_load);
						}
					});
				}
			});
		}
	});
}

/**
 * 多线程——同步教师数据
 * 周枫
 * 2016.1.26
 */
function newWorkerThiExeTeachers() {
	api.addEventListener({
		name : 'hhExeTeachers'
	}, function(ret) {

		api.removeEventListener({
			name : 'hhExeTeachers'
		});
		if (ret && ret.value) {
			var owner_id = ret.value.owner_id;
			var group_md5 = ret.value.group_md5;
			var txl_list_json = ret.value.txl_list_json;
			var is_load = ret.value.is_load;
			//同步教师数据
			newExeGroupTeacherListData(0, txl_list_json.common, owner_id, function(is_true) {
				if (is_true) {
					newWorkerExeOk(group_md5, is_load);
				}
			});
		}
	});
}

/**
 * 多线程——同步班级人员数据
 * 周枫
 * 2016.1.26
 */
function newWorkerFouExeStudents() {
	api.addEventListener({
		name : 'hhExeStudents'
	}, function(ret) {
		api.removeEventListener({
			name : 'hhExeStudents'
		});
		if (ret && ret.value) {
			var owner_id = ret.value.owner_id;
			var group_md5 = ret.value.group_md5;
			var txl_list_json = ret.value.txl_list_json;
			var is_load = ret.value.is_load;
			//同步班级人员数据
			newExeGroupClassListData(0, txl_list_json.common, owner_id, function(is_true) {
				if (is_true) {
					newWorkerExeOk(group_md5, is_load);
				}
			});
		}
	});
}

/**
 * 多线程处理完数据后返回结果
 * 周枫
 * 2016.1.26
 */
function newWorkerExeOk(group_md5, is_load) {
	s_txl_t++;
	if (is_load) {
		if (s_txl_t == 4) {
			updateGroupMd5ToDb(group_md5, function(is_true) {
				if (is_true) {
					api.sendEvent({
						name : 'exeWorkerOk',
						extra : {
							is_true : true,
						}
					});
					//初始化群组到融云
					initGroupInfoByUserId(0,function(init_group_result) {

					});
				} else {
					api.sendEvent({
						name : 'exeWorkerOk',
						extra : {
							is_true : false,
						}
					});
				}
			});
		}
	} else {
		if (s_txl_t == 2) {
			updateGroupMd5ToDb(group_md5, function(is_true) {
				if (is_true) {
					api.sendEvent({
						name : 'exeWorkerOk',
						extra : {
							is_true : true,
						}
					});
					//初始化群组到融云
					initGroupInfoByUserId(0,function(init_group_result) {

					});
				} else {
					api.sendEvent({
						name : 'exeWorkerOk',
						extra : {
							is_true : false,
						}
					});
				}
			});
		}
	}

}

/**
 * 删除群组表数据
 * 周枫
 * 2016.1.8
 */
function newDeleteGroupToDb(owner_id, callback) {
	var sql = "DELETE FROM t_base_group WHERE owner_id = '" + owner_id + "'";
	dbExecuteSql(sql, function(is_true) {
		if (is_true) {
			callback(true);
		} else {
			callback(false);
		}
	});
}

/**
 * 删除群组表数据
 * 周枫
 * 2016.1.8
 */
function newDeletePersonToDb(owner_id, callback) {
	var sql = "DELETE FROM t_base_person WHERE is_friend = 1 AND owner_id = '" + owner_id + "'";
	dbExecuteSql(sql, function(is_true) {
		if (is_true) {
			callback(true);
		} else {
			callback(false);
		}
	});
}

/**
 * 判断当前ajax数据中是否存在common数据
 * 周枫
 * 2016.1.8
 */
function newAjaxIsHaveGroupData(txl_list_json, callback) {
	for (var i in txl_list_json) {
		if (i == 'common') {
			callback(true);
			return;
		}
	}
	callback(false);
}

/**
 * 判断当前ajax数据中是否存在好友数据
 * 周枫
 * 2016.1.8
 */
function newAjaxIsHavePersonData(txl_list_json, callback) {
	for (var i in txl_list_json) {
		if (i == 'person') {
			callback(true);
			return;
		}
	}
	callback(false);
}

/**
 * 递归处理群组数据
 * 周枫
 * 2016.1.8
 */
function newExeGroupData(txl_c, txl_list_attr, owner_id, callback) {

	var txl_l = txl_list_attr.length;

	if (txl_c < txl_l) {
		//缓存群组头像处理数据
		newExeGroupImg(txl_list_attr[txl_c], owner_id, function(is_true) {
			if (is_true) {
				txl_c++;
				return newExeGroupData(txl_c, txl_list_attr, owner_id, callback);
			}
		});
	} else {
		callback(true);
	}
}

/**
 * 递归处理好友
 * 周枫
 * 2016.1.8
 */
function newExePersonInfoData(p_c, p_list_attr, owner_id, callback) {
	var p_l = p_list_attr.length;

	if (p_c < p_l) {
		//缓存好友头像处理数据
		newExePersonImg(p_list_attr[p_c], owner_id, function(is_true) {
			if (is_true) {
				p_c++;
				return newExePersonInfoData(p_c, p_list_attr, owner_id, callback);
			}
		});
	} else {
		callback(true);
	}
}

/**
 * 缓存群组头像处理数据
 * 周枫
 * 2016.1.8
 */
function newExeGroupImg(group_info_attr, owner_id, callback) {
	var avatar_url = '';
	if ( typeof (group_info_attr.img) != 'undefined') {
		avatar_url = group_info_attr.img;
		if (avatar_url.substring(0, 4) == 'http') {
			//如果是http图片先缓存本地
			newCacheGroupImgToDb(group_info_attr, owner_id, function(is_true) {

				if (is_true) {
					callback(true);
				}
			});
		} else {
			//存入群组到数据库
			newSaveGroupInfoToDb(group_info_attr, group_info_attr.placeholderImg, owner_id, function(is_true) {
				if (is_true) {
					callback(true);
				}
			});

		}
	} else {
		//存入群组到数据库
		newSaveGroupInfoToDb(group_info_attr, group_info_attr.placeholderImg, owner_id, function(is_true) {
			if (is_true) {
				callback(true);
			}
		});
	}
}

/**
 * 缓存好友头像处理数据
 * 周枫
 * 2016.1.8
 */
function newExePersonImg(person_info_json, owner_id, callback) {
	var avatar_url = '';
	if ( typeof (person_info_json.img) != 'undefined') {
		avatar_url = person_info_json.img;
		if (avatar_url.substring(0, 4) == 'http') {
			//如果是http图片先缓存本地
			newCachePersonImgToDb(person_info_json, owner_id, function(is_true) {
				if (is_true) {
					callback(true);
				}
			});
		} else {
			//存入群组到数据库
			newSavePersonInfoToDb(person_info_json, person_info_json.placeholderImg, owner_id, 1, function(is_true) {
				if (is_true) {
					callback(true);
				}
			});

		}
	} else {
		//存入群组到数据库
		newSavePersonInfoToDb(person_info_json, person_info_json.placeholderImg, owner_id, 1, function(is_true) {
			if (is_true) {
				callback(true);
			}
		});
	}
}

/**
 * 缓存群组头像
 * 周枫
 * 2016.1.8
 */
function newCacheGroupImgToDb(group_info_attr, owner_id, callback) {
	imageCache(group_info_attr.img, '', function(avatar_url_native) {
		//获取群组存入数据库
		newSaveGroupInfoToDb(group_info_attr, avatar_url_native, owner_id, function(is_true) {
			if (is_true) {
				callback(true);
			}
		});
	});
}

/**
 * 缓存好友头像
 * 周枫
 * 2016.1.8
 */
function newCachePersonImgToDb(person_info_json, owner_id, callback) {
	imageCache(person_info_json.img, '', function(avatar_url_native) {
		//获取群组存入数据库
		newSavePersonInfoToDb(person_info_json, avatar_url_native, owner_id, 1, function(is_true) {
			if (is_true) {
				callback(true);
			}
		})
	});
}

/**
 * 存入群组到数据库
 * 周枫
 * 2016.1.8
 */
function newSaveGroupInfoToDb(group_list, avatar_url_native, owner_id, callback) {
	var group_name = group_list.title;
	group_name = commonReplaceYinHao(group_name,0);
	var sql = "REPLACE INTO t_base_group (group_id, group_name, avatar_url, avatar_url_native, owner_id, group_type) VALUES (";
	//group_id
	sql = sql + "'" + group_list.id + "_" + base_server_name + "',";
	//group_name
	sql = sql + "'" + group_name + "',";
	var group_t = parseInt(group_list.t);
	switch(group_t) {
		case 1:
			//avatar_url
			sql = sql + "'" + group_list.img + "',";
			break;
		case 2:
			//avatar_url
			sql = sql + "'http://video.edusoa.com/down/App/hh_image/school.png',";
			break;
		case 3:
			//avatar_url
			sql = sql + "'http://video.edusoa.com/down/App/hh_image/class.png',";
			break;
	}
	//avatar_url_native
	sql = sql + "'" + avatar_url_native + "',";
	//owner_id
	sql = sql + "'" + owner_id + "',";
	//group_type
	sql = sql + group_list.t;
	sql = sql + ");"
	newExeSaveGroupInfoToDb(sql, function(is_true) {
		if (is_true) {
			callback(true);
		}
	});
	//	api.alert({
	//		msg : sql
	//  },function(ret,err){
	//  	//coding...
	//  });

}

function newExeSaveGroupInfoToDb(sql, callback) {
	dbExecuteSql(sql, function(is_true) {
		if (is_true) {
			callback(true);
		} else {
			//			api.alert({
			//				msg : '存入接收消息失败:saveGroupInfoToDb'
			//			});
			callback(false);
		}
	});
}

/**
 * 存入好友数据
 * 周枫
 * 2016.1.9
 */
function newSavePersonInfoToDb(person_list, avatar_url_native, owner_id, is_friend, callback) {
	var p_n = person_list.title;
	p_n = commonReplaceYinHao(p_n,0);
	var sql = "REPLACE INTO t_base_person (person_id, person_name, login_name, avatar_url, avatar_url_native, owner_id, is_friend, jp_first) VALUES (";
	//person_id
	sql = sql + "'" + person_list.id + "',";
	//person_name
	sql = sql + "'" + p_n + "',";
	//login_name
	sql = sql + "'" + person_list.id + '_'  + person_list.identity_id + "_" + base_server_name + "',";
	//avatar_url
	sql = sql + "'" + person_list.img + "',";
	//avatar_url_native
	sql = sql + "'" + avatar_url_native + "',";
	//owner_id
	sql = sql + "'" + owner_id + "',";
	//is_friend
	sql = sql + is_friend + ",";
	//jp_first
	sql = sql + "'" + person_list.jp + "'";

	sql = sql + ");"
	newExeSavePersonInfoToDb(sql, function(is_true) {
		if (is_true) {
			callback(true);
		}
	});

}

function newExeSavePersonInfoToDb(sql, callback) {
	dbExecuteSql(sql, function(is_true) {
		if (is_true) {
			callback(true);
		} else {
			//			api.alert({
			//				msg : '存入接收消息失败:newExeSavePersonInfoToDb'
			//			});
			callback(false);
		}
	});
}

/**
 * 递归处理群组成员数据，同事
 * 周枫
 * 2016.1.8
 */
function newExeGroupTeacherListData(txl_c, txl_list_attr, owner_id, callback) {
	var txl_l = txl_list_attr.length;
	if (txl_c < txl_l) {
		if (txl_list_attr[txl_c].t == 2) {
			getGroupListByIdFromDb(txl_list_attr[txl_c].id + "_" + base_server_name, 0, 1, function(is_flag) {
				if (is_flag) {
					callback(true);
					return;
				}
			});
		} else {
			txl_c++;
			return newExeGroupTeacherListData(txl_c, txl_list_attr, owner_id, callback);
		}
	} else {
		callback(true);
	}
}

/**
 * 递归处理群组成员数据，同事
 * 周枫
 * 2016.1.8
 */
function newExeGroupClassListData(txl_c, txl_list_attr, owner_id, callback) {
	var txl_l = txl_list_attr.length;
	if (txl_c < txl_l) {
		if (txl_list_attr[txl_c].t == 3) {
			getGroupListByIdFromDb(txl_list_attr[txl_c].id + "_" + $api.getStorage('BASE_SERVER_NAME'), 0, 1, function(is_flag) {
				if (is_flag) {
					callback(true);
					return;
				}
			});
		} else {
			txl_c++;
			return newExeGroupClassListData(txl_c, txl_list_attr, owner_id, callback);
		}
	} else {
		callback(true);
	}
}

/***************  重构开始     ***********************/
/**
 * 获取通讯录md5
 * 周枫
 * 2016.1.7
 */
function selectTxlMd5FromDb(callback) {
	//	var owner_id = $api.getStorage('login_name');
	var sql = "SELECT group_md5 FROM t_base_group WHERE owner_id = '" + $api.getStorage('login_name_rong') + "' LIMIT 1";
	dbSelectSql(sql, function(data_attr) {
		if (data_attr != false || data_attr.length == 0) {
			var g_md5 = '';
			(data_attr.length == 0) ? ( g_md5 = '') : ( g_md5 = data_attr[0].group_md5)
			callback(g_md5);
		} else {
			//			api.alert({
			//				msg : '存入接收消息失败:selectTxlMd5FromDb'
			//			});
		}
	});
}

function updateGroupMd5ToDb(group_md5, callback) {
	//	var owner_id = $api.getStorage('login_name');
	var sql = "UPDATE t_base_group SET group_md5 = '" + group_md5 + "' where owner_id = '" + $api.getStorage('login_name_rong') + "';"
	dbExecuteSql(sql, function(is_true) {
		if (is_true) {
			callback(true);
		} else {
			//			api.alert({
			//				msg : '存入接收消息失败:'
			//			});
		}
	});
}

/***************  重构结束     ***********************/

/**
 * 根据群组id获取群组成员，如果不存在则先存入数据库
 * 周枫
 * 2016.1.4
 * is_select : 是否需要返回查询结果
 * is_check ： 是否判断md5需要更新
 */
function getGroupListByIdFromDb(group_id, is_select, is_check, callback) {
    api.ajax({
        url: BASE_URL_ACTION+'/rongcloud/syncUserRongYunGroup?group_id='+group_id,
        method:'get',
        timeout:30,
        dataType:'json'
    },function(ret,err){
       if(is_select == 1){
            selectPListByGIdFromDb(group_id, function(person_list) {
                $api.setStorage('group_list_data', person_list);
                callback(person_list);
            });
        }
        //  // 是否判断md5需要更新
        if (is_check == 1) {
            var db_md5 = '';
            var ajax_md5 = '';
            //获取当前群组在数据库中的md5值
            getGroupMd5FromDb(group_id, function(data_attr) {
                (data_attr.length == 0) ? db_md5 = '' : db_md5 = data_attr[0].group_list_md5;
                //获取当前群组在服务器端md5值
                getGroupMd5FromAjax(group_id, function(group_list_md5) {
                    ajax_md5 = group_list_md5;
                    ////比对md5是否一致，一致则直接读取数据，否则重新ajax获取数据存入数据库
                    if (db_md5 == ajax_md5) {
                        if (is_select == 1) {
                            selectPListByGIdFromDb(group_id, function(person_list) {
                                $api.setStorage('group_list_data', person_list);
    //                          callback(person_list);
                            });
                        } else {
                            callback(true);
                        }
                    } else {
                        //删除群组人员对应关系表数据
                        delGmemberListToDb(group_id, function(is_flag) {
                            if (is_flag) {
                                //获取人员列表数据
                                getGroupListById(group_id, function(group_list) {
                                    if (group_list.list.length == 0) {
                                        callback(false);
                                        return;
                                    } else {
                                        //插入人员群组对应关系表
                                        insertGmemberListToDb(group_id, group_list.list, function(is_true) {
                                            if (is_true) {
                                                //插入人员表
                                                insertPersonListToDb(group_list.list, function(is_true) {
                                                    if (is_true) {
                                                        //修改数据库对应群组md5
                                                        updateGroupListMd5ById(ajax_md5, group_id, function(is_true) {
    
                                                            if (is_true) {
                                                                if (is_select == 1) {
                                                                    selectPListByGIdFromDb(group_id, function(person_list) {
                                                                        
    
    //                                                                  callback(person_list);
                                                                        $api.setStorage('group_list_data', person_list);
                                                                    });
                                                                } else {
                                                                    callback(true);
                                                                }
                                                            }
                                                        });
                                                    }
                                                });
    
                                            }
                                        });
                                    }
    
                                });
                            }
                        });
                    }
                });
            });
        } else {
            selectPListByGIdFromDb(group_id, function(person_list) {
                $api.setStorage('group_list_data', person_list);
    //          callback(person_list);
            });
        } 
    });
}

function getGroupMd5FromDb(group_id, callback) {
	//	var owner_id = $api.getStorage('login_name');
	var sql = "SELECT group_list_md5 FROM t_base_group WHERE group_id = '" + group_id + "' AND owner_id =  '" + $api.getStorage('login_name_rong') + "'";
	dbSelectSql(sql, function(data_attr) {
		if (data_attr != false || data_attr.length == 0) {
			callback(data_attr);
		} else {
			//			api.alert({
			//				msg : '存入接收消息失败:getGroupMd5FromDb'
			//			});
		}
	});
}

/**
 * 获取服务器端当前群组md5
 * 周枫
 * 2016.1.7
 */
function getGroupMd5FromAjax(group_id, callback) {
	getGroupListById(group_id, function(group_list) {
		callback(group_list.md5);
	});
}

/**
 * 获取群组人员列表
 * 周枫
 * 2016.12.05 
 */
function selectPListByGIdFromDb(group_id, callback) {
	var sql = "SELECT t1.identity_id, t2.person_name, t2.login_name, t2.person_id, t2.avatar_url, t2.avatar_url_native AS head_img, t2.jp_first FROM t_base_group_member t1 LEFT JOIN t_base_person t2 ON t1.login_name = t2.login_name AND t1.owner_id = t2.owner_id WHERE t1.group_id = '" + group_id + "' AND t1.owner_id = '" + $api.getStorage('login_name_rong') + "' AND t2.is_friend = 0 GROUP BY t2.login_name ORDER BY t2.person_name DESC;";
	dbSelectSql(sql, function(data_attr) {
		if (data_attr != false || data_attr.length == 0) {
			var group_json = {};
			group_json["success"] = true;
			group_json["list"] = data_attr;
			callback(group_json);
		} else {
			//			api.alert({
			//				msg : '存入接收消息失败:selectPListByGIdFromDb'
			//			});
		}
	});
}

/**
 * 根据人员姓名获取群组人员列表
 * 周枫
 * 2016.12.05 
 */
function selectPListByGIdFromDbLikeName(group_id, person_name_like, callback) {
	var sql = "SELECT t1.identity_id, t2.person_name, t2.login_name, t2.person_id, t2.avatar_url, t2.avatar_url_native AS head_img, t2.jp_first FROM t_base_group_member t1 LEFT JOIN t_base_person t2 ON t1.login_name = t2.login_name AND t1.owner_id = t2.owner_id WHERE t1.group_id = '" + group_id + "' AND t1.owner_id = '" + $api.getStorage('login_name_rong') + "' AND t2.is_friend = 0 AND t2.person_name like '%" + person_name_like + "%' GROUP BY t2.login_name ORDER BY t2.person_name DESC;";
	dbSelectSql(sql, function(data_attr) {
		if (data_attr != false || data_attr.length == 0) {
			var group_json = {};
			group_json["success"] = true;
			group_json["list"] = data_attr;
			callback(group_json);
		} else {
			//			api.alert({
			//				msg : '存入接收消息失败:selectPListByGIdFromDb'
			//			});
		}
	});
}

/**
 * 插入人员群组对应关系表
 * 周枫
 * 2016.1.7
 */
function insertGmemberListToDb(group_id, group_list, callback) {

	sqlite_db = api.require('db');
	sqlite_db.transaction({
		name : BASE_FS_SQDB_NAME,
		operation : 'begin'
	}, function(ret, err) {
		if (ret.status) {
			//			var owner_id = $api.getStorage('login_name');
			var group_base_name = group_id.substring(group_id.lastIndexOf("_") + 1);
			//			var base_server_name = $api.getStorage('BASE_SERVER_NAME');
			if (group_base_name == base_server_name) {
				group_id = group_id;
			} else {
				group_id = group_id + "_" + base_server_name;
			}
			var l = getJsonObjLength(group_list);
			for (var i = 0; i < l; i++) {
				var p_n = group_list[i].login_name;
//				p_n = oldParamToNewParamTwo(p_n, base_server_name);
//				p_n = commonReplaceYinHao(p_n,0);

				p_n = group_list[i].person_id+"_"+group_list[i].identity_id+"_"+$api.getStorage("BASE_SERVER_NAME");
				var sql = "INSERT INTO t_base_group_member (group_id,login_name,owner_id,person_id,identity_id) VALUES ('" + group_id + "','" + p_n + "','" + $api.getStorage('login_name_rong') + "'," 
				+ group_list[i].person_id + ",'"+group_list[i].identity_id+"');";
				sqlite_db.executeSql({
					name : BASE_FS_SQDB_NAME,
					sql : sql
				}, function(ret, err) {

				});
			}
			sqlite_db.transaction({
				name : BASE_FS_SQDB_NAME,
				operation : 'commit'
			}, function(ret, err) {
				callback(true);
			});
		}
	});

	//	var t_temp = 0;
	//	for (var i = 0; i < getJsonObjLength(group_list); i++) {
	//		exeGmemberListToDb(group_id, group_list[i], function(is_flag) {
	//			if (is_flag) {
	//				t_temp++;
	//				if (t_temp == getJsonObjLength(group_list)) {
	//					callback(true);
	//				}
	//			}
	//		});
	//	}
}

/**
 * 插入人员到数据库
 * 周枫
 * 2016.5.13
 */
function insertPersonListToDb(person_list, callback) {
	sqlite_db = api.require('db');
	//	newCache();
	sqlite_db.transaction({
		name : BASE_FS_SQDB_NAME,
		operation : 'begin'
	}, function(ret, err) {
		if (ret.status) {
			//			var owner_id = $api.getStorage('login_name');
			var l = getJsonObjLength(person_list);
			//			var avatar_url_native = '..\/..\/image\/person\/default.jpg';
			//			var base_server_name = $api.getStorage('BASE_SERVER_NAME');
			for (var i = 0; i < l; i++) {
				var data_list = person_list[i];

				//				delPListToDb(data_list, avatar_url_native, 0, function(is_flag) {
				//					if (is_flag) {
				//缓存图片后存入数据库
				//				imageCache(data_list.head_img, '', function(avatar_url_native) {
				exePersonListToDb(data_list, data_list.head_img, 0, base_server_name, $api.getStorage('login_name_rong'), function(is_flag) {

				});
				//				});

				//					}
				//				});
			}
			sqlite_db.transaction({
				name : BASE_FS_SQDB_NAME,
				operation : 'commit'
			}, function(ret, err) {
				callback(true);

				//				api.sendEvent({
				//					name : 'exePersonImg',
				//					extra : {
				//						person_list : person_list
				//					}
				//				});

			});
		}
	});
	//	var t_temp = 0;
	//	for (var i = 0; i < getJsonObjLength(person_list); i++) {
	//		//缓存图片后存入数据库
	//		cachePersonImgToDb(person_list[i], 0, function(is_flag) {
	//			if (is_flag) {
	//				t_temp++;
	//				if (t_temp == getJsonObjLength(person_list)) {
	//					callback(true);
	//				}
	//			}
	//		});
	//	}
}

//function newCache() {
//	api.addEventListener({
//		name : 'exePersonImg'
//	}, function(ret) {
//		if (ret && ret.value) {
//			var person_list = ret.value.person_list;
//			var l = getJsonObjLength(person_list);
//			for (var i = 0; i < l; i++) {
//				var data_list = person_list[i];
//				cachePersonImgToDb(data_list, 0, base_server_name, function(is_flag) {
//
//				});
//			}
//		}
//	});
//}

/**
 * 缓存图片后存入数据库
 * 周枫
 * 2015.12.30
 */
function cachePersonImgToDb(data_list, is_friend, base_server_name, callback) {
	imageCache(data_list.head_img, '', function(avatar_url_native) {
		exePersonListToDb(data_list, avatar_url_native, 0, base_server_name, $api.getStorage('login_name_rong'), function(is_flag) {
			if (is_flag) {
				callback(true);
			}
		});
	});

	//缓存头像
	//	imageCache(data_list.head_img, '', function(avatar_url_native) {
	//		delPListToDb(data_list, avatar_url_native, is_friend, function(is_flag) {
	//			if (is_flag) {
	//				exePersonListToDb(data_list, avatar_url_native, is_friend, function(is_flag) {
	//					if (is_flag) {
	//						callback(true);
	//					}
	//				});
	//			}
	//		});
	//	});
}

/**
 * 删除非好友数据
 * 周枫
 * 2016.3.9
 */
function delPListToDb(person_info, avatar_url_native, is_friend, callback) {
	//	var owner_id = $api.getStorage('login_name');
	var login_name_del = person_info.login_name;
	login_name_del = oldParamToNewParam(login_name_del);
	var sql = "DELETE FROM t_base_person WHERE login_name = '" + login_name_del + "' AND owner_id = '" + $api.getStorage('login_name_rong') + "' AND is_friend = '" + is_friend + "';";
	dbExecuteSql(sql, function(is_true) {
		if (is_true) {
			callback(true);
		} else {
			//			api.alert({
			//				msg : '存入接收消息失败:delPListToDb'
			//			});
		}
	});
}

/**
 * 保存人员数据到数据库
 * 周枫
 * 2016.5.13
 */
function exePersonListToDb(person_info, avatar_url_native, is_friend, base_server_name, owner_id, callback) {
	var p_n = person_info.person_name;
	p_n = commonReplaceYinHao(p_n,0);
	var sql = "REPLACE INTO t_base_person (login_name, person_id, person_name, avatar_url, avatar_url_native, owner_id, jp_first, is_friend) VALUES (";
	//login_name
	sql = sql + "'" + person_info.person_id + "_" +person_info.identity_id + "_" + base_server_name + "',";
	//person_id
	sql = sql + "'" + person_info.person_id + "',";
	//person_name
	sql = sql + "'" + p_n + "',";
	//avatar_url
	sql = sql + "'" + person_info.head_img + "',";
	//avatar_url_native
	sql = sql + "'" + avatar_url_native + "',";
	//owner_id
	sql = sql + "'" + owner_id + "',";
	//jp_first
	sql = sql + "'" + person_info.jp + "',";
	//is_friend
	sql = sql + is_friend;

	sql = sql + ");";
	dbExecuteSql(sql, function(is_true) {
		if (is_true) {
			if (parseInt(is_friend) == 1) {
				updateFriendPersonInfoToDb(person_info, avatar_url_native, function(is_true) {
					if (is_true) {
						callback(true);
					}
				});
			} else {
				callback(true);
			}

		} else {
			callback(false);
			//			api.alert({
			//				msg : '存入接收消息失败:exePersonListToDb'
			//			});
		}
	});
}

/**
 * 同步群组时，修改好友数据
 * 周枫
 * 2016.1.9
 */
function updateFriendPersonInfoToDb(person_info, avatar_url_native, callback) {
	//	var owner_id = $api.getStorage('login_name');
	var sql = "UPDATE t_base_person SET person_name = '" + person_info.person_name + "', avatar_url = '" + person_info.head_img + "',avatar_url_native = '" + avatar_url_native + "' WHERE is_friend = 1 AND login_name = '" + person_info.login_name + "_" + base_server_name + "' AND owner_id = '" + $api.getStorage('login_name_rong') + "' ;";
	dbExecuteSql(sql, function(is_true) {
		if (is_true) {
			callback(true);
		} else {
			//			api.alert({
			//				msg : '存入接收消息失败:exePersonListToDb'
			//			});
		}
	});
}

/**
 * 插入人员群组表数据处理
 * 周枫
 * 2016.1.7
 */
function exeGmemberListToDb(group_id, person_info, callback) {
	//	var owner_id = $api.getStorage('login_name');
	var group_base_name = group_id.substring(group_id.lastIndexOf("_") + 1);
	if (group_base_name == base_server_name) {
		group_id = group_id;
	} else {
		group_id = group_id + "_" + base_server_name;
	}
	var p_n = person_info.login_name;
	p_n = commonReplaceYinHao(p_n,0);
	var sql = "INSERT INTO t_base_group_member (group_id,login_name,owner_id,person_id,identity_id) VALUES ('" 
	+ group_id + "','" + p_n + "_" + base_server_name + "','" + $api.getStorage('login_name_rong') + "'," 
	+ person_info.person_id +",'" +person_info.identity_id +"');";
	//	dbExecuteSql(sql, function(is_true) {
	//		if (is_true) {
	callback(true);
	//		} else {
	//			//			api.alert({
	//			//				msg : '存入接收消息失败:'
	//			//			});
	//		}
	//	});
}

function delGmemberListToDb(group_id, callback) {
	//	var owner_id = $api.getStorage('login_name');
	var group_base_name = group_id.substring(group_id.lastIndexOf("_") + 1);
	if (group_base_name == base_server_name) {
		group_id = group_id;
	} else {
		group_id = group_id + "_" + base_server_name;
	}
	var sql = "DELETE FROM t_base_group_member WHERE group_id = '" + group_id + "' AND owner_id = '" + $api.getStorage('login_name_rong') + "';";
	dbExecuteSql(sql, function(is_true) {
		if (is_true) {
			callback(true);
		} else {
			//			api.alert({
			//				msg : '存入接收消息失败:delPListToDb'
			//			});
			callback(false);
		}
	});
}

/**
 * 查询当前群组是否有成员
 * 周枫
 * 2016.1.7
 * @param {Object} group_id
 */
function selectIsHavePersonInGroup(group_id, callback) {
	//	var owner_id = $api.getStorage('login_name');
	var sql = "SELECT count(login_name) AS p_count FROM t_base_group_member WHERE group_id = '" + group_id + "' AND owner_id = '" + $api.getStorage('login_name_rong') + "';";
	dbSelectSql(sql, function(data_attr) {
		if (data_attr != false || data_attr.length == 0) {
			callback(parseInt(data_attr[0].p_count));
		} else {
			//			api.alert({
			//				msg : '存入接收消息失败:selectPListByGIdFromDb'
			//			});
		}
	});
}

/**
 * 读取当前会话的所有图片
 * 周枫
 * 2016.1.7
 * @param {Object} object_name
 * @param {Object} target_id
 * @param {Object} con_type
 * @param {Object} owner_id
 * @param {Object} callback
 */
function selectHhTotalImgByIdFromDb(target_id, con_type, owner_id, callback) {
	var sql = "select messageId,imagePath,thumbPath,nativePath,conversationType,messageDIrection from t_hh_messages where objectName = 'RC:ImgMsg' and targetId = '" + target_id + "' and conversationType = '" + con_type + "' AND owner_id = '" + owner_id + "' ORDER BY messageId ASC;";
	dbSelectSql(sql, function(data_attr) {
		if (data_attr != false || data_attr.length == 0) {
			callback(data_attr);
		} else {
			//			api.alert({
			//				msg : '读取当前会话的所有图片失败'
			//			});
		}
	});
}

/**
 * 修改群组对应数据md5
 * 周枫
 * 2016.1.7
 * @param {Object} group_md5
 * @param {Object} group_id
 * @param {Object} callback
 */
function updateGroupListMd5ById(group_md5, group_id, callback) {
	//	var owner_id = $api.getStorage('login_name');
	var sql = "UPDATE t_base_group SET group_list_md5 = '" + group_md5 + "' WHERE group_id = '" + group_id + "' AND owner_id = '" + $api.getStorage('login_name_rong') + "';";
	dbExecuteSql(sql, function(is_true) {
		if (is_true) {
			callback(true);
		} else {
			//			api.alert({
			//				msg : '存入接收消息失败:updateGroupListMd5ById'
			//			});
			callback(false);
		}
	});
}

/**
 * 初始化群组数据给融云服务器
 * 周枫
 * 2015.09.10
 */
function initGroupInfoByUserId(type,callback) {
	var login_name = $api.getStorage('login_name_rong');
	var person_id = $api.getStorage('person_id');
	var identity = $api.getStorage('identity');
	api.ajax({
		url : $api.getStorage('BASE_URL_ACTION') + '/rongcloud/initGroupInfoByUserId?login_name=' + login_name + '&identity=' + identity + '&person_id=' + person_id + '&ip_addr=' + $api.getStorage('BASE_SERVER_IP') + '&app_type=' + $api.getStorage('BASE_APP_TYPE'),
		method : 'get',
		timeout : 30,
		dataType : 'json'
	}, function(ret, err) {
	    err = true;
		if (err) {
		    callback(true);
		} else {
			if (ret.code != '200') {
				callback(true);
			} else {
				callback(ret);
			}
		}
	});
}

/**
 * 查询数据库中是否存在当前群组
 * 周枫
 * 2016.1.9
 */
function selectIsExistGroupInDb(group_list_json, callback) {
	var sql = "SELECT COUNT(1) AS is_exist FROM t_base_group WHERE group_id = '" + group_list_json.targetId + "' AND owner_id = '" + $api.getStorage('login_name_rong') + "';";

	dbSelectSql(sql, function(data_attr) {
		if (data_attr != false || data_attr.length == 0) {
			var is_exist = parseInt(data_attr[0].is_exist);
			if (is_exist > 0) {
				callback(true, group_list_json);
			} else {
				callback(false, group_list_json);
			}
		} else {
			//			api.alert({
			//				msg : '存入接收消息失败:selectIsExistGroupInDb'
			//			});
		}
	});

}

/**
 * 查询数据库中是否存在当前人员
 * 周枫
 * 2016.1.9
 */
function selectIsExistPersonInDb(person_list_json, callback) {
	//	api.alert({
	//		msg : 'person_list_json:'+person_list_json.targetId
	//  },function(ret,err){
	//  	//coding...
	//  });
	if (person_list_json.targetId != 'admin') {
		var sql = "SELECT COUNT(1) AS is_exist FROM t_base_person WHERE login_name = '" + person_list_json.targetId + "' AND owner_id = '" + $api.getStorage('login_name_rong') + "';";
		dbSelectSql(sql, function(data_attr) {
			if (data_attr != false || data_attr.length == 0) {
				var is_exist = parseInt(data_attr[0].is_exist);
				if (is_exist > 0) {
					callback(true, person_list_json);
				} else {
					callback(false, person_list_json);
				}
			} else {
				//				api.alert({
				//					msg : '存入接收消息失败:selectIsExistPersonInDb'
				//				});
			}
		});
	} else {
		callback(true, person_list_json);
	}

}

/**
 * 修改人员头像到数据库
 * 周枫
 * 2016.5.13
 */
function updatePersonHeadImgToDb(login_n, head_img, callback) {
	var sql = "UPDATE t_base_person SET avatar_url_native = '" + head_img + "' WHERE login_name = '" + login_n + "' AND owner_id = '" + $api.getStorage('login_name_rong') + "';"
	dbExecuteSql(sql, function(data_attr) {
		if (data_attr != false || data_attr.length == 0) {
			callback(true);
		} else {
			callback(false);
		}
	});
}

/**
 * 根据登录名获取人员id
 * 周枫
 * 2016.06.02
 */
function selectPersonIdByLoginName(login_name, callback) {
	var sql = "SELECT person_name,person_id,avatar_url,avatar_url_native,avatar_file,is_friend,jp_first FROM t_base_person WHERE login_name = '" + login_name + "' AND owner_id = '" + $api.getStorage('login_name_rong') + "';";
	dbSelectSql(sql, function(data_attr) {
		if (data_attr != false || data_attr.length == 0) {
			callback(data_attr);
		} else {

		}
	});
}

/**
 * 根据融云会话id删除聊天记录
 * 周枫
 * 2016.06.03
 */
function delteMessageByMessageId(msg_id, callback) {
	var sql = "DELETE FROM t_hh_messages WHERE messageId = " + msg_id + " AND owner_id = '" + $api.getStorage('login_name_rong') + "';"
	dbExecuteSql(sql, function(data_attr) {
		if (data_attr != false || data_attr.length == 0) {
			callback(true);
		} else {
			callback(false);
		}
	});
}

/**
 * 退出后清空所有md
 * 周枫
 * 2016.06.04
 */
function updateAllGroupMd5Null(callback) {
	var sql = "UPDATE t_base_group SET group_list_md5 = '',group_md5 = '';"
	dbExecuteSql(sql, function(data_attr) {
		if (data_attr != false || data_attr.length == 0) {
			callback(true);
		} else {
			callback(false);
		}
	});
}