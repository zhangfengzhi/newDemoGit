//初始化db
var sqlite_db;

function dbOpenDb(callback) {
	isExisDb(function(is_true) {
		if (is_true) {
			sqlite_db = api.require('db');
			sqlite_db.openDatabase({
				name : BASE_FS_SQDB_NAME,
				path : BASE_FS_NEW_SQDB_PATH + BASE_FS_SQDB_NAME
			}, function(ret, err) {
				if (ret.status) {
					//					checkSqliteDbBanben(function(is_true) {
					//						if (is_true) {
					callback(true);
					//						}
					//					});
				} else {
					openDb(function(is_true) {
						if (is_true) {
							callback(true);
						} else {
							callback(false);
						}
					});
				}
			});
		} else {
			fs = api.require('fs');
			fs.exist({
				path : BASE_FS_NEW_SQDB_PATH + BASE_FS_SQDB_NAME
			}, function(ret, err) {
				if (ret.exist) {
					sqlite_db = api.require('db');
					sqlite_db.openDatabase({
						name : BASE_FS_SQDB_NAME,
						path : BASE_FS_NEW_SQDB_PATH + BASE_FS_SQDB_NAME
					}, function(ret, err) {
						if (ret.status) {
							//					checkSqliteDbBanben(function(is_true) {
							//						if (is_true) {
							callback(true);
							//						}
							//					});
						} else {
							api.toast({
								msg : '对不起，获取会话失败，为您恢复数据，请稍候'
							});
							openDb(function(is_true) {
								if (is_true) {
									callback(true);
								} else {
									callback(false);
								}
							});
						}
					});
				} else {
					//3.2如果新数据库不存在，则移动db到新数据库
					fs.copyTo({
						oldPath : 'widget://res/db/dsideal_db.db',
						newPath : BASE_FS_NEW_SQDB_PATH
					}, function(ret, err) {
						if (ret.status) {
							sqlite_db = api.require('db');
							sqlite_db.openDatabase({
								name : BASE_FS_SQDB_NAME,
								path : BASE_FS_NEW_SQDB_PATH + BASE_FS_SQDB_NAME
							}, function(ret, err) {
								if (ret.status) {
									//					checkSqliteDbBanben(function(is_true) {
									//						if (is_true) {
									callback(true);
									//						}
									//					});
								} else {
									api.toast({
										msg : '对不起，获取会话失败，为您恢复数据，请稍候'
									});
									openDb(function(is_true) {
										if (is_true) {
											callback(true);
										} else {
											callback(false);
										}
									});
								}
							});
						} else {
							api.alert({
								msg : err.msg
							});
						}
					});
				}
			});
		}
	});

}

/**
 * 执行sql
 * 周枫
 * 2015.12.24
 */
function dbExecuteSql(sqlite_sql, callback) {
	sqlite_db = api.require('db');
	owner_id = $api.getStorage('login_name_rong');
	//	dbOpenDb(function(is_true) {
	//		if (is_true) {
	sqlite_db.executeSql({
		name : BASE_FS_SQDB_NAME,
		sql : sqlite_sql
	}, function(ret, err) {
		if (ret.status) {
			callback(true);
		} else {
			api.toast({
				msg : '对不起，获取会话失败，为您恢复数据，请稍候'
			});
			openDb(function(is_true) {
				if (is_true) {
					callback(true);
				} else {
					callback(false);
				}
			});
		}
	});
	//		} else {
	//			callback(false);
	//		}
	//	});
}

/**
 * 查询sql
 * 周枫
 * 2015.12.30
 * @param {Object} sqlite_sql
 * @param {Object} callback
 */
function dbSelectSql(sqlite_sql, callback) {
	sqlite_db = api.require('db');
	owner_id = $api.getStorage('login_name_rong');
	//	dbOpenDb(function(is_true) {
	//		if (is_true) {
	sqlite_db.selectSql({
		name : BASE_FS_SQDB_NAME,
		sql : sqlite_sql
	}, function(ret, err) {
		if (ret.status) {
			callback(ret.data);
		} else {
			api.toast({
				msg : '对不起，获取会话失败，为您恢复数据，请稍候'
			});
			openDb(function(is_true) {
				if (is_true) {
					callback(true);
				} else {
					callback(false);
				}
			});
		}
	});
	//		} else {
	//			callback(false);
	//		}
	//	});
}

/**
 * 同步查询sql
 * 周枫
 * 2017.08.11
 * @param {Object} sqlite_sql
 * @param {Object} callback
 */
function dbSelectSqlSync(sqlite_sql) {
	sqlite_db = api.require('db');
	owner_id = $api.getStorage('login_name_rong');
	var ret = sqlite_db.selectSqlSync({
	    name: BASE_FS_SQDB_NAME,
	    sql: sqlite_sql
	});
	return ret.data;
}

function dbAlterTable(t_name, create_table) {
	sqlite_db = api.require('db');
	owner_id = $api.getStorage('login_name_rong');
	//打开数据库，若数据库不存在则创建数据库
	dbOpenDb(function(is_true) {
		if (is_true) {
			//创建会话表 t_hh_messages
			var sql = 'ALTER TABLE ' + t_name + ' RENAME TO ' + t_name + '_temp_old;';
			//创建数据库
			dbExecuteSql(sql, function(is_flag) {
				if (is_flag) {
					callback(true);
				} else {
					callback(false);
				}
			});
		} else {
			callback(false);
		}
	});
}

function isExisDb(callback) {
	fs = api.require('fs');
	//1.看旧数据库是否存在
	fs.exist({
		path : BASE_FS_SQDB_PATH + BASE_FS_SQDB_NAME
	}, function(ret, err) {
		if (ret.exist) {
			//2.如果旧数据库存在，看看新数据库是否存在
			fs.exist({
				path : BASE_FS_NEW_SQDB_PATH + BASE_FS_SQDB_NAME
			}, function(ret, err) {
				if (ret.exist) {
					//2.1如果新数据库存在，删除新数据库
					fs.remove({
						path : BASE_FS_NEW_SQDB_PATH + BASE_FS_SQDB_NAME
					}, function(ret, err) {
						if (ret.status) {
							setTimeout(function() {
								//2.2移动旧数据库到新数据库
								fs.copyTo({
									oldPath : BASE_FS_SQDB_PATH + BASE_FS_SQDB_NAME,
									newPath : BASE_FS_NEW_SQDB_PATH
								}, function(ret, err) {
									if (ret.status) {
										fs.remove({
											path : BASE_FS_SQDB_PATH + BASE_FS_SQDB_NAME
										}, function(ret, err) {
											if (ret.status) {
												callback(true);
											}
										});
									} else {
										callback(false);
									}
								});
							}, 500);

						} else {
							callback(false);
						}
					});
				} else {
					//2.3如果新数据库不存在，移动旧数据库到新数据库
					setTimeout(function() {
						//2.2移动旧数据库到新数据库
						fs.copyTo({
							oldPath : BASE_FS_SQDB_PATH + BASE_FS_SQDB_NAME,
							newPath : BASE_FS_NEW_SQDB_PATH
						}, function(ret, err) {
							if (ret.status) {
								fs.remove({
									path : BASE_FS_SQDB_PATH + BASE_FS_SQDB_NAME
								}, function(ret, err) {
									if (ret.status) {
										callback(true);
									}

								});
								

							} else {
								callback(false);
							}
						});
					}, 500);
				}
			});
		} else {
			//3.如果旧数据库不存在，看看新数据库是否存在
			fs.exist({
				path : BASE_FS_NEW_SQDB_PATH + BASE_FS_SQDB_NAME
			}, function(ret, err) {
				if (ret.exist) {
					//3.1如果新数据库存在则不动
					callback(true);
				} else {
					//3.2如果新数据库不存在，则移动db到新数据库
					fs.copyTo({
						oldPath : 'widget://res/db/dsideal_db.db',
						newPath : BASE_FS_NEW_SQDB_PATH
					}, function(ret, err) {
						if (ret.status) {
							dbOpenDb(function(is_true) {
								if (is_true) {
									getTongXunluToDb(function(is_true) {
										api.hideProgress();
										if (is_true) {
											callback(true);
										}
									});
								}
							});
						} else {
							api.alert({
								msg : err.msg
							});
						}
					});
				}
			});
		}
	});

	//	//判断当前是否存在db
	//	fs.exist({
	//		path : BASE_FS_NEW_SQDB_PATH + BASE_FS_SQDB_NAME
	//	}, function(ret, err) {
	//		if (ret.exist) {
	//			fs.exist({
	//				path : BASE_FS_SQDB_PATH + BASE_FS_SQDB_NAME
	//			}, function(ret, err) {
	//				if (ret.exist) {
	//					fs.remove({
	//						path : BASE_FS_NEW_SQDB_PATH + BASE_FS_SQDB_NAME
	//					}, function(ret, err) {
	//						if (ret.status) {
	//							//拷贝数据库文件
	//							fs.moveTo({
	//								oldPath : BASE_FS_SQDB_PATH + BASE_FS_SQDB_NAME,
	//								newPath : BASE_FS_NEW_SQDB_PATH
	//							}, function(ret, err) {
	//								if (ret.status) {
	//									callback(true);
	//								} else {
	//									api.alert({
	//										msg : err.msg
	//									});
	//								}
	//							});
	//						} else {
	//							alert(JSON.stringify(err));
	//						}
	//					});
	//				} else {
	//					callback(true);
	//				}
	//
	//			});
	//
	//		} else {
	//			//			api.showProgress({
	//			//				title : '数据缺失',
	//			//				text : '正在恢复中...',
	//			//				modal : true
	//			//			});
	//			fs.exist({
	//				path : BASE_FS_SQDB_PATH + BASE_FS_SQDB_NAME
	//			}, function(ret, err) {
	//				if (ret.exist) {
	//					//拷贝数据库文件
	//					fs.moveTo({
	//						oldPath : BASE_FS_SQDB_PATH + BASE_FS_SQDB_NAME,
	//						newPath : BASE_FS_NEW_SQDB_PATH
	//					}, function(ret, err) {
	//						if (ret.status) {
	//							callback(true);
	//						} else {
	//							api.alert({
	//								msg : err.msg
	//							});
	//						}
	//					});
	//				} else {
	//					//拷贝数据库文件
	//					fs.copyTo({
	//						oldPath : 'widget://res/db/dsideal_db.db',
	//						newPath : BASE_FS_NEW_SQDB_PATH
	//					}, function(ret, err) {
	//						if (ret.status) {
	//							dbOpenDb(function(is_true) {
	//								if (is_true) {
	//									getTongXunluToDb(function(is_true) {
	//										api.hideProgress();
	//										if (is_true) {
	//											callback(true);
	//										}
	//									});
	//								}
	//							});
	//						} else {
	//							api.alert({
	//								msg : err.msg
	//							});
	//						}
	//					});
	//				}
	//			});
	//
	//		}
	//	});
}

function openDb(callback) {
	getTongXunluToDb(function(is_true) {
		if (is_true) {
			callback(true);
		} else {
			callback(false);
		}
	});
	//	fs = api.require('fs');
	//	//判断当前是否存在db
	//	fs.exist({
	//		path : BASE_FS_NEW_SQDB_PATH + BASE_FS_SQDB_NAME
	//	}, function(ret, err) {
	//		if (ret.exist) {
	//			//			fs.remove({
	//			//				path : BASE_FS_SQDB_PATH + BASE_FS_SQDB_NAME
	//			//			}, function(ret, err) {
	//			//				if (ret.status) {
	//			//					//拷贝数据库文件
	//			//					fs.copyTo({
	//			//						oldPath : 'widget://res/db/dsideal_db.db',
	//			//						newPath : BASE_FS_SQDB_PATH
	//			//					}, function(ret, err) {
	//			//						if (ret.status) {
	//			dbOpenDb(function(is_true) {
	//
	//				if (is_true) {
	//					getTongXunluToDb(function(is_true) {
	//						if (is_true) {
	//							callback(true);
	//						} else {
	//							callback(false);
	//						}
	//					});
	//				}
	//			});
	//			//						} else {
	//			//							api.alert({
	//			//								msg : err.msg
	//			//							});
	//			//						}
	//			//					});
	//			//				}
	//			//			});
	//		} else {
	//			//拷贝数据库文件
	//			fs.copyTo({
	//				oldPath : 'widget://res/db/dsideal_db.db',
	//				newPath : BASE_FS_NEW_SQDB_PATH
	//			}, function(ret, err) {
	//				if (ret.status) {
	//					dbOpenDb(function(is_true) {
	//
	//						if (is_true) {
	//							getTongXunluToDb(function(is_true) {
	//								if (is_true) {
	//									callback(true);
	//								} else {
	//									callback(false);
	//								}
	//							});
	//						}
	//					});
	//				} else {
	//					api.alert({
	//						msg : err.msg
	//					});
	//				}
	//			});
	//		}
	//	});
}

/**
 * 升级数据库版本
 * 周枫
 * 2016.5.24
 */
function checkSqliteDbBanben(callback) {
	var sql = 'SELECT config_value FROM t_sys_config;';
	dbSelectSql(sql, function(data_attr) {
		var config_bb = 0;
		(data_attr.length == 0) ? ( config_bb = 1) : ( config_bb = data_attr[0].config_value);
		if (config_bb == 1) {
			api.hideProgress();
			var t = "对不起，您当前版本需要升级，请重新登录";
			api.execScript({
				name : 'root',
				frameName : 'hh_index',
				script : 'openNoticeLogout("' + t + '\");'
			});
		} else {
			callback(true);
		}
	});
}