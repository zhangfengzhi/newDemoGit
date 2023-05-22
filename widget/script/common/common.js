/**
 * 通用方法
 * 打开window
 * 周枫
 * 2016.1.16
 * 参数说明：
 * name ： 字符串，window名字，不能为空字符串。若为root，则会关闭首页上面所有存在的window，相当于调用closeToWin({name:'root'})方法
 * url : 页面地址，可以为本地文件路径，支持相对路径和绝对路径，以及widget://、fs://等协议路径，也可以为远程地址
 * pageParam : JSON对象
 * bounces : 布尔,页面是否弹动
 * vScrollBarEnabled : 布尔,是否显示垂直滚动条
 * hScrollBarEnabled : 布尔,是否显示水平滚动条
 *
 */
function commonOpenWin(win_name, win_url, is_bounces, is_allowEdit, pageParamJson) {
	if(isEmptyString(pageParamJson.reload)){	
		pageParamJson.reload = false;
	}
	api.openWin({
		name : win_name,
		url : win_url,
		bounces : is_bounces,
		delay : 0,
		scrollToTop : true,
		reload : pageParamJson.reload,
		allowEdit : is_allowEdit,
		slidBackEnabled : false,
		scaleEnabled : false,
		vScrollBarEnabled : true,
		hScrollBarEnabled : false,
		bgColor:pageParamJson.bgColor,
		slidBackEnabled : false,
		animation : {
			type : "reveal", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300
		},
		pageParam : pageParamJson
	});
}

/*
 *author:zhaoj
 *function:打开页面frame页面的公共方法
 *param:
 *name：字符串，frame名字，不能为空字符串。
 *height：数字，header_h的高度和另外添加的高度
 *is_bounces：布尔，是否允许页面弹动
 *is_allowEdit：布尔，是否允许页面编辑
 *bg_color:字符串,设置frame页面的背景颜色
 *pageParamJson：json对象
 *date：20161201
 */
function commonOpenFrame(frame_name, frame_url, height, is_bounces, is_allowEdit, bg_color, pageParamJson) {
	if(isEmptyString(pageParamJson.w)){	
		pageParamJson.w = 'auto';
	}
	if(isEmptyString(pageParamJson.x)){	
		pageParamJson.x = 0;
	}
	if(isEmptyString(pageParamJson.h)){    
        pageParamJson.h = api.winHeight - height;
    }
	api.openFrame({
		name : frame_name,
		scrollToTop : true,
		allowEdit : is_allowEdit,
		url : frame_url,
		rect : {
			x : pageParamJson.x,
			y : height,
			w : pageParamJson.w,
			h : pageParamJson.h,
		},
		pageParam : pageParamJson,
		bgColor : bg_color,
		vScrollBarEnabled : true,
		hScrollBarEnabled : false,
		//页面是否弹动 为了下拉刷新使用
		bounces : is_bounces
	});
}

/**
 * 下拉刷新
 * 周枫
 * 2016.1.16
 * 引用方法：
 * //下拉刷新
 */
function commonRefreshHeaderInfo() {
	//绑定下拉刷新历史会话事件
	api.setRefreshHeaderInfo({
		visible : true,
		loadingImg : 'widget://image/local_icon_refresh.png',
		bgColor : '#efefef',
		textColor : '#8E8E8E',
		textDown : '下拉加载更多...',
		textUp : '松开加载...',
		showTime : true
	}, function(ret, err) {
		//从服务器加载数据，完成后调用commonControlRefresh()方法恢复组件到默认状态
		//需要刷新的方法
		//showSelfProgress('加载中...');
		currentPage = 1;
		initData(currentPage);
	});
}
/**
 * 控制下拉刷新
 * zhaoj
 * 2018.02.26
 */
function commonControlRefresh(){
	api.setFrameAttr({
	    name: api.frameName,
	    bounces: false
	});
	setTimeout(function(){
		api.refreshHeaderLoadDone();
		api.setFrameAttr({
		    name: api.frameName,
		    bounces: true
		});
	},1000);
}
/**
 * 上拉加载更多数据--分页
 * 周枫
 * 2016.1.20
 * 引用方法：txl_addfriends_frame.html
 scrollBottomReload(re_fun);
 */
function commonScrollBottomReload() {
	//下移到底部：
	api.addEventListener({
		name : 'scrolltobottom',
		extra : {
			threshold : 100 //设置距离底部多少距离时触发，默认值为0，数字类型
		}
	}, function(ret, err) {
		if ((currentPage + 1) <= totalPages) {
			currentPage = currentPage + 1;
			initData(currentPage);
		} else {
			popToast('已加载全部数据');
		}
	});
}

/**
 * 将选择题选项有json对象转换成数组
 * 赵静
 * 2016.4.9
 */
function commonQuetionOption(count_length, quetionOption, key, key_re) {
	var optionArray = [];
	var quetionOptionJson = JSON.parse(quetionOption);
	var letterArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
	for (var i = 0; i < count_length; i++) {
		var optionBase64 = eval('quetionOptionJson.' + letterArray[i]);
		var option = Base64.decode(optionBase64);
		option = option.replaceAll(key, key_re);
		optionArray.push(option);
	}
	return JSON.stringify(optionArray);
}

/**
 * 增加选项的名称
 * 赵静
 * 2016.4.9
 */
function commonQuetionOptionFirst(count_length) {
	var answerFirst = [];
	var letterArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
	for (var i = 0; i < count_length; i++) {
		answerFirst.push(letterArray[i]);
	}
	return JSON.stringify(answerFirst);
}

/**
 * 根据家长id获取学生
 * 周枫
 * 2016.4.25
 */
function commonGetStudentInfoByParentId(p_id, i_id, callback) {
	if (i_id == 6) {
		var stu_list = {};
		stu_list["student_id"] = p_id;
		stu_list.roles = [{
			"role_id" : i_id
		}];
		callback(true, stu_list);
	} else {
		api.ajax({
			url : $api.getStorage('BASE_URL_ACTION') + '/person/getPersonInfo',
			method : 'post',
			dataType : 'json',
			data : {
				values : {
					person_id : p_id,
					identity_id : i_id
				}
			}
		}, function(ret, err) {
			if (err) {
				callback(false, '未找到您的孩子，请联系班主任老师');
				setTimeout(function() {
					api.closeWin();
				}, 2000);
			} else {
				if (ret.success) {
					callback(true, ret.table_List);
				} else {
					callback(false, '未找到您的孩子，请联系班主任老师');
					setTimeout(function() {
						api.closeWin();
					}, 2000);
				}
			}
		});
	}
}

/**
 * 获取任课计划和班主任对应班级列表
 * query_type 0：班主任， 1：任课计划，2：全部
 * {"list":[{"class_name":"2015级2班","class_id":1167},{"class_name":"2010级1班","class_id":248}],"success":true}
 * 周枫
 * 2016.4.7
 */
function commonloadClassListData(query_type, callback) {
	api.ajax({
		url : $api.getStorage('BASE_URL_ACTION') + '/class/getClassByPersonIDIdentityID',
		method : 'get',
		dataType : 'json',
		data : {
			values : {
				"person_id" : $api.getStorage('person_id'),
				"identity_id" : $api.getStorage('identity'),
				"query_type" : query_type
			}
		}
	}, function(ret, err) {
		if (err) {
			callback(false, '获取班级列表失败')
		} else {
			if (ret.success) {
				callback(true, ret.list)
			} else {
				callback(false, '获取班级列表失败')
			}
		}
	});
}
var upload_count = 0;//判断上传次数
function commonUploadFiles(file_path, callback) {
	showSelfProgress('上传中...');
	upload_count++;
	//扩展名
	var ldot = file_path.lastIndexOf(".");
	var ext = file_path.substring(ldot + 1);
	ext = ext.toLocaleLowerCase();
	//			var ext = file_path.substring(ldot + 1).substring(0,3);
	if (ext != "jpg" && ext != "png" && ext != "JPG" && ext != "PNG" &&ext != "amr" &&ext != "mp4" && ext != "penlog") {
		callback(0, '', '');
		return;
	}
	if (BASE_APP_TYPE == 1) {
		var v_guid = newGuid();
		//图片上传服务器时路径
		var _key = url_path_suffix + v_guid.substring(0, 2) + "/" + v_guid + "." + ext;
		notice_img_path = _key;
		api.ajax({
			url : $api.getStorage('BASE_URL_ACTION') + '/res/uploadFileToAliyun',
			method : 'post',
			timeout : 180,
			dataType : 'json',
			returnAll : false,
			data : {
				values : {
					key : _key
				},
				files : {
					file : file_path
				}
			}
		}, function(ret, err) {
			//					api.hideProgress();
			if (err) {
				if(upload_count < 10){
					callback(false, '', '');
				}else{
					upload_count = 0;
					popAlert('上传失败，请稍候重试');
					api.hideProgress();
				}
			} else {
				if (ret.success) {
					upload_count = 0;
					callback(true, v_guid, ext);
				} else {
					if(upload_count < 10){
						callback(false, '', '');
					}else{
						upload_count = 0;
						popAlert('上传失败，请稍候重试');
						api.hideProgress();
					}
				}
			}
		});
	} else {
		//局版
		var v_guid = newGuid();
		var extension = ext;
		//图片上传服务器时路径
		var _key = url_path_suffix + v_guid.substring(0, 2) + "/" + v_guid + "." + ext;
		api.ajax({
			url : $api.getStorage('BASE_URL_ACTION') + '/res/newUpload/',
			method : 'post',
			timeout : 30,
			dataType : 'json',
			returnAll : false,
			data : {
				values : {
					key : _key
				},
				files : {
					file : file_path
				}
			}
		}, function(ret, err) {
			//					api.hideProgress();
			if (err) {
				if(upload_count < 10){
					callback(false, '', '');
				}else{
					upload_count = 0;
					popAlert('上传失败，请稍候重试');
					api.hideProgress();
				}
			} else {
				if (ret.success) {
					upload_count = 0;
					callback(true, v_guid, extension);
				} else {
					if(upload_count < 10){
						callback(false, '', '');
					}else{
						upload_count = 0;
						popAlert('上传失败，请稍候重试');
						api.hideProgress();
					}
				}
			}
		});
	}
}
/**
 * 上传方法的升级版，可以返回文件的名称
 * 赵静
 * 2017.11.09
 */
//var ui_upload_count = 0;//判断上传次数
//function commonUiUploadFiles(param, callback) {
//  ui_upload_count == 0?commonShowProgress('上传中...',false):"";
//  var param = JSON.parse(param);
//  var file_path = param.file_path;
//  ui_upload_count++;
//  //扩展名
//  var ldot = file_path.lastIndexOf(".");
//  var ext = file_path.substring(ldot + 1);
//  ext = ext.toLocaleLowerCase();
//  //文件名称
// if (api.systemType == 'ios') {
//      var name_index = param.thumbPath.lastIndexOf("/");
//      var file_name = param.thumbPath.substring(name_index + 1);
//  }else{
//      var name_index = file_path.lastIndexOf("/");
//      var file_name = file_path.substring(name_index + 1);
//  }
//  //          var ext = file_path.substring(ldot + 1).substring(0,3);
//  if (ext != "jpg" && ext != "png" && ext != "JPG" && ext != "PNG" &&ext != "amr" &&ext != "mp4") {
//      callback(0, '', '');
//      return;
//  }
//  if (BASE_APP_TYPE == 1) {
//      var v_guid = newGuid();
//      //图片上传服务器时路径
//      var _key = url_path_suffix + v_guid.substring(0, 2) + "/" + v_guid + "." + ext;
//      notice_img_path = _key;
//      api.ajax({
//          url : $api.getStorage('BASE_URL_ACTION') + '/res/uploadFileToAliyun',
//          method : 'post',
//          timeout : 30,
//          dataType : 'json',
//          returnAll : false,
//          data : {
//              values : {
//                  key : _key
//              },
//              files : {
//                  file : file_path
//              }
//          }
//      }, function(ret, err) {
//          //                  api.hideProgress();
//          if (err) {
//              if (err.statusCode == '200') {
//                  ui_upload_count = 0;
//                  var oparam = {"file_id":v_guid,"ext":ext,"file_name":file_name};
//                  callback(true, JSON.stringify(oparam));
//              } else {
//                  
//                  if(ui_upload_count < 10){
//                      return commonUiUploadFiles(JSON.stringify(param), callback);
//                  }else{
//                      ui_upload_count = 0;
//                      callback(false,'');
//                      popAlert('上传失败，请稍候重试');
//                      api.hideProgress();
//                  }
//              }
//          } else {
//              if (ret.statusCode == '200') {
//                  ui_upload_count = 0;
//                  var oparam = {"file_id":v_guid,"ext":ext,"file_name":file_name};
//                  callback(true, JSON.stringify(oparam));
//              } else {
//                  if(ui_upload_count < 10){
//                      return commonUiUploadFiles(JSON.stringify(param), callback);
//                  }else{
//                      ui_upload_count = 0;
//                      callback(false, '');
//                      popAlert('上传失败，请稍候重试');
//                      api.hideProgress();
//                  }
//              }
//          }
//      });
//  } else {
//      //局版
//      var v_guid = newGuid();
//      var extension = ext;
//      //图片上传服务器时路径
//      var _key = url_path_suffix + v_guid.substring(0, 2) + "/" + v_guid + "." + ext;
//      notice_img_path = _key;
//      api.ajax({
//          url : $api.getStorage('BASE_URL_ACTION') + '/res/newUpload/',
//          method : 'post',
//          timeout : 30,
//          dataType : 'json',
//          returnAll : false,
//          data : {
//              values : {
//                  key : _key
//              },
//              files : {
//                  file : file_path
//              }
//          }
//      }, function(ret, err) {
//          //                  api.hideProgress();
//          if (err) {
//              if(ui_upload_count < 10){
//                  callback(false, '', '');
//              }else{
//                  ui_upload_count = 0;
//                  popAlert('上传失败，请稍候重试');
//                  api.hideProgress();
//              }
//          } else {
//              if (ret.success) {
//                  ui_upload_count = 0;
//                  var oparam = {"file_id":v_guid,"ext":ext,"file_name":file_name};
//                  callback(true, JSON.stringify(oparam));
//              } else {
//                  if(ui_upload_count < 10){
//                      callback(false, '', '');
//                  }else{
//                      ui_upload_count = 0;
//                      popAlert('上传失败，请稍候重试');
//                      api.hideProgress();
//                  }
//              }
//          }
//      });
//  }
//}
/**
 * 上传方法的升级版，可以返回文件的名称
 * 赵静
 * 2018.02.08
 */
function commonUiUploadFiles(param, callback) {
	commonDealFiles(param,function(data){
		commonShowProgress('上传中...',true);
		commonDgUploadFilses(0,data,function(ret_data){
			upload_return_data=[];
			api.hideProgress();
			callback(ret_data);
		});
	});
}
/**
 * 根据系统判断是否需要转换图片路径
 * 赵静
 * 2018.02.08
 */
function commonDealFiles(param,callback){
	var picture_data = param.data;//图片数据
	if(api.systemType == 'ios' && param.is_trans){
		//系统是ios，并且需要转码
		commonTransPath(0,picture_data,function(tran_flag,tran_data){
			if(tran_flag){
				commonUploadFilesTip(tran_data,function(ret_data){
					callback(ret_data);
				});
			}else{
				popAlert('上传失败，请稍候重试');
			}
		});
	}else{
		commonUploadFilesTip(picture_data,function(ret_data){
			callback(ret_data);
		});
	}
}
/**
 * 对上传的文件进行格式以及大小进行判断，并进行提示
 * 赵静
 * 2018.02.08
 */
function commonUploadFilesTip(data,callback){
	var picture_data = data;
	var all_length = data.length;
	if(all_length == 1){
		//扩展名
	    var ldot = data[0].path.lastIndexOf(".");
	    var ext = data[0].path.substring(ldot + 1);
	    ext = ext.toLocaleLowerCase();
	    //文件大小
		var size = data[0].size; 
		if(size  > upload_file_size){
			popAlert('当前文件超过10M，不支持上传，请重新选择！');
		}else if(!commonContainsArray(support_extension,ext) &&!commonContainsArray(support_img_extension,ext)&&!commonContainsArray(support_audio_extension,ext)){
			popAlert('不支持'+ext+'格式的上传，请重新选择！');
		}else{
			callback(picture_data);
		}
	}else{
		var no_ext_array=[];//不符合的格式
		var no_ext_index_array=[];
		var no_size_index_array=[];
		for(var i = 0; i < all_length; i++){
			//扩展名
		    var ldot = data[i].path.lastIndexOf(".");
		    var ext = data[i].path.substring(ldot + 1);
		    ext = ext.toLocaleLowerCase();
		     //文件大小
			var size = data[i].size; 
			if(!commonContainsArray(support_extension,ext) &&!commonContainsArray(support_img_extension,ext)&&!commonContainsArray(support_audio_extension,ext)){
				//判断格式
				if(!commonContainsArray(no_ext_array,ext)){
					no_ext_array.push(ext);	
				}
				no_ext_index_array.push(i);		
			}else if(size  > upload_file_size){
				//判断大小
				no_size_index_array.push(i);	
			}
		}
		var concat_array = no_ext_index_array.concat(no_size_index_array);//合并数组
		concat_array = concat_array.sort(commonSortNum);
		//将不符合的文件去除
		for(var i = 0; i < concat_array.length; i++){
			picture_data.splice(concat_array[i],1);
		}
		var length = no_ext_index_array.length+no_size_index_array.length;
		if(no_ext_index_array.length > 0 && no_size_index_array.length > 0){
			//存在格式和大小都不符合
			if(length < all_length){
				//部分不符合
				popAlert('不支持上传'+no_ext_array.toString()+'格式文件以及第'+no_size_index_array.toString()+'文件大小超过10M，请重新选择！');
			}else if(length == all_length){
				//全部不符合
				commonPopTwoBtnConfirm('提示','不支持上传'+no_ext_array.toString()+'格式文件以及第'+no_size_index_array.toString()+'文件大小超过10M，是否继续上传其他文件？',function(){
					callback(picture_data);
				});
			}
		}else if(no_ext_index_array.length == 0 &&  no_size_index_array.length > 0){
			//只是大小不符合
			if(no_size_index_array.length == all_length){
				//全部文件格式不符合
				popAlert('上传的文件超过10M，不支持上传，请重新选择！');
			}else{
				//部分文件格式不符合
				commonPopTwoBtnConfirm('提示','上传的文件中有超过10M的文件，不支持上传，是否继续上传其他文件？',function(){
					callback(picture_data);
				});
			}
		}else if(no_ext_index_array.length > 0 &&  no_size_index_array.length == 0){
			//只是格式不符合
			if(no_ext_index_array.length == all_length){
				//全部文件格式不符合
				popAlert('不支持'+no_ext_array.toString()+'格式的上传，请重新选择！');
			}else{
				//部分文件格式不符合
				commonPopTwoBtnConfirm('提示','上传文件中包含'+no_ext_array.toString()+'格式文件，不支持该格式文件的上传，是否继续上传其他文件？',function(){
					callback(picture_data);
				});
				
			}
		}else{
			//全部符合
			callback(picture_data);
		}
	}
}
/**
 * 倒叙的排序方式
 * 赵静
 * 2018.02.08
 */
function commonSortNum(a,b) {
  return b - a;
}
/**
 * 递归上传文件方法
 * 周枫
 * 2016.5.21
 */
var upload_return_data=[];
function commonDgUploadFilses(index, data, callback) {
	if (index < data.length) {
		commonUpload(data[index],function(flag,return_data){
			if(flag){
				index++;
				upload_return_data.push(JSON.stringify(return_data));
				return commonDgUploadFilses(index, data, callback);
			}else{
				upload_return_data=[];
				api.hideProgress();
				popAlert('上传失败，请稍候重试');
			}
		});
	} else {
		callback(upload_return_data);
	}
}
/**
 * 上传文件
 * 赵静
 * 2018.02.08
 */
var ui_upload_count = 0;//判断上传次数
function commonUpload(data,callback){
	ui_upload_count++;
	var file_path = data.path;
	//扩展名
    var ldot = file_path.lastIndexOf(".");
    var ext = file_path.substring(ldot + 1);
    ext = ext.toLocaleLowerCase();
    //文件名称
   	if (api.systemType == 'ios') {
        var name_index = data.thumbPath.lastIndexOf("/");
        var file_name = data.thumbPath.substring(name_index + 1);
    }else{
        var name_index = file_path.lastIndexOf("/");
        var file_name = file_path.substring(name_index + 1);
    }
    file_name = file_name.substring(0,file_name.indexOf('.'))+'.'+ext
	if ($api.getStorage('BASE_APP_TYPE') == 1) {
        var v_guid = newGuid();
        //图片上传服务器时路径
        var _key = url_path_suffix + v_guid.substring(0, 2) + "/" + v_guid + "." + ext;
        api.ajax({
            url : $api.getStorage('BASE_URL_ACTION') + '/res/uploadFileToAliyun',
            method : 'post',
            timeout : 180,
            dataType : 'json',
            returnAll : false,
            data : {
                values : {
                    key : _key
                },
                files : {
                    file : file_path
                }
            }
        }, function(ret, err) {
            if (err){                     
                if(ui_upload_count < 5){
                    return commonUpload(data, callback);
                }else{
                    ui_upload_count = 0;
                    callback(false,'');
                    api.hideProgress();
                }
            } else {
                if (ret.success) {
                    ui_upload_count = 0;
                    var oparam = {"file_id":v_guid,"ext":ext,"file_name":file_name};
                    callback(true, oparam);
                } else {
                    if(ui_upload_count < 5){
                        return commonUpload(data, callback);
                    }else{
                        ui_upload_count = 0;
                        callback(false, '');
                        api.hideProgress();
                    }
                }
            }
        });
    } else {
        //局版
        var v_guid = newGuid();
        var extension = ext;
        //图片上传服务器时路径
        var _key = url_path_suffix + v_guid.substring(0, 2) + "/" + v_guid + "." + ext;
        notice_img_path = _key;
        api.ajax({
            url : $api.getStorage('BASE_URL_ACTION') + '/res/newUpload/',
            method : 'post',
            timeout : 180,
            dataType : 'json',
            returnAll : false,
            data : {
                values : {
                    key : _key
                },
                files : {
                    file : file_path
                }
            }
        }, function(ret, err) {
            //                  api.hideProgress();
            if (err) {
                if(ui_upload_count < 10){
                    callback(false, '', '');
                }else{
                    ui_upload_count = 0;
                    popAlert('上传失败，请稍候重试');
                    api.hideProgress();
                }
            } else {
                if (ret.success) {
                    ui_upload_count = 0;
                    var oparam = {"file_id":v_guid,"ext":ext,"file_name":file_name};
                    callback(true, oparam);
                } else {
                    if(ui_upload_count < 10){
                        callback(false, '', '');
                    }else{
                        ui_upload_count = 0;
                        popAlert('上传失败，请稍候重试');
                        api.hideProgress();
                    }
                }
            }
        });
    }
}
/**
 * IOS系统下进行转码
 * 赵静
 * 2018.02.08
 */
function commonTransPath(index, data, callback){
	var file_l = data.length;
	if (index < file_l) {
//		if(!commonContainsArray(support_img_extension,data[index].suffix)){
//			//不是图片格式
//			index++;
//			return commonTransPath(index, data, callback);
//		}else{
			var pic_url_old = data[index].path;
			UIAlbumBrowser.transPathNew(pic_url_old,function(ret_back){
				if(ret_back.flag){
					data[index].path = ret_back.path;
				 	index++;
				 	return commonTransPath(index, data, callback);
				}else{
					callback(false,data);
				}
			 });
//		}
	} else {
		callback(true,data);
	}
}
/**
 * 弹出提示框
 * 赵静
 * 2017.11.09
 */
function commonPopTwoBtnConfirm(titile, msg, callback){
	api.confirm({
		title : titile,
		msg : msg,
		buttons : ["确定", "取消"]
	}, function(ret, err) {
		if (1 == ret.buttonIndex) {
			callback();
		}
	});
};
/**
 * 判断当前值是否在数组中
 * 赵静
 * 2017.11.09
 */
function commonContainsArray(arr, obj) {
  var i = arr.length;
  while (i--) {
    if (arr[i] === obj) {
      return true;
    }
  }
  return false;
}
/**
 * 弹出Alert提示框
 * 赵静
 * 2016.5.8
 */
function popAlert(message) {
	api.alert({
		msg : message
	}, function(ret, err) {
	});
}

/**
 * 弹出Alert提示框，并显示标题和内容以及点击确定的对调函数
 * 赵静
 * 2016.11.23
 */
function popAlertAndShowTitle(title, msg, fun_name) {
	api.alert({
		title : title,
		msg : Base64.decode(msg)
	}, function(ret, err) {
		if (ret.buttonIndex == 1 && fun_name != "") {
			eval(fun_name);
		}
	});
}

/**
 * 弹出Toast提示框
 * 赵静
 * 2016.5.8
 */
function popToast(message) {
	api.toast({
		msg : message,
		location : 'middle'
	});
}

/**
 *function: 下方弹出Toast提示框
 *author： 赵静
 *date: 20161130
 */
function popBottomToast(message) {
	api.toast({
		msg : message,
		location : 'bottom'
	});
}

/*
 *author:zhaoj
 *function:弹出确定按钮和取消按钮confirm
 *date：20160523
 */
function popTwoBtnConfirm(titile, msg, fun_name) {
	api.confirm({
		title : titile,
		msg : msg,
		buttons : ["确定", "取消"]
	}, function(ret, err) {
		if (1 == ret.buttonIndex) {
			eval(fun_name);
		}
	});
}

/**
 *
 * 给被评论人发送系统消息和短信
 * 周枫
 * 2017.03.22
 *
 * @param {Object} sender_id： 发送人id
 * @param {Object} sender_person_name：发送人姓名
 * @param {Object} sender_login_name：发送人登录名
 * @param {Object} sender_identity：发送人身份
 * @param {Object} target_login_names：接收人登录名数组
 * @param {Object} is_url：是否允许跳转页面，1允许，2不允许
 * @param {Object} url_name：跳转页面名称，需要在base-config.js中配置BASE_YY_OPEN
 * @param {Object} param_num：使用模板编号，需要找周枫
 * @param {Object} sysmsg_code：业务编码，自定义，便于日后查询
 * @param {Object} bureau_id：机构id，非必传，便于查询
 * @param {Object} district_id：区id，非必传，便于查询
 * @param {Object} city_id：市id，非必传，便于查询
 * @param {Object} province_id：省id，非必传，便于查询
 * @param {Object} params：模板参数数组，10个元素
 * @param {Object} is_send_sms：是否发送短信，1发送，2不发送
 * @param {Object} send_tels：需要发送短信的电话号码，支持批量发送，格式："111,222,333"
 */
function commonSendSysMsgSms(sender_id, sender_person_name, sender_login_name, sender_identity, target_login_names, is_url, url_name, param_num, sysmsg_code, bureau_id, district_id, city_id, province_id, params, is_send_sms, send_tels, callback) {
	var sysmsg_json = {};
	sysmsg_json["sender_id"] = sender_id + '';
	sysmsg_json["sender_person_name"] = sender_person_name;
	sysmsg_json["sender_login_name"] = sender_login_name;
	sysmsg_json["sender_identity"] = sender_identity + '';
	sysmsg_json["is_url"] = is_url + '';
	sysmsg_json["url_name"] = url_name;
	sysmsg_json["param_num"] = param_num + '';
	sysmsg_json["sysmsg_code"] = sysmsg_code;
	sysmsg_json["bureau_id"] = bureau_id + '';
	sysmsg_json["district_id"] = district_id + '';
	sysmsg_json["city_id"] = city_id + '';
	sysmsg_json["province_id"] = province_id + '';
	sysmsg_json["is_send_sms"] = is_send_sms + '';
	sysmsg_json["send_tels"] = send_tels + '';
	var to_ids = [];
	for (var i = 0; i < target_login_names.length; i++) {
		var to_id = {};
		to_id["target_login_name"] = target_login_names[i];
		to_ids[i] = to_id;
	}
	sysmsg_json["target_list"] = to_ids;
	var params_list = {};
	for (var i = 0; i <= 9; i++) {
		if ('undefined' != typeof (params[i]) || null != params[i]) {
			params_list["param" + (i + 1)] = params[i];
		} else {
			params_list["param" + (i + 1)] = "";
		}
	}
	sysmsg_json["params_list"] = params_list;

	//	var sysmsg_json = '{"sender_id":"91936","sender_person_name":"黄海","sender_login_name":"liujing16","sender_identity":"5","is_url":"1","url_name":"wenzhang_index_window","param_num":"2","sysmsg_code":"WENZHANG_20160518","bureau_id":"302049","district_id":"302049","city_id":"302049","province_id":"302049","target_list":[{"target_login_name":"zhoufeng2"}],"params_list":{"param1":"文章","param2":"文章评论","param3":"文章标题","param4":"参数","param5":"参数","param6":"参数","param7":"参数","param8":"参数","param9":"参数","param10":"参数"}}';
	api.ajax({
		url : BASE_URL_ACTION + '/rongcloud/sendSystemMessage',
		method : 'post',
		dataType : 'json',
		cache : false,
		data : {
			values : {
				"sysmsg_json" : JSON.stringify(sysmsg_json)
			}
		}

	}, function(ret, err) {
		if (err) {
			callback(false);
			//popToast('发送失败');
		} else {
			callback(true);
			//popToast('发送成功');
		}
	});
}

/**
 *
 * 给被评论人发送系统消息
 * 周枫
 * 2016.5.18
 *
 * @param {Object} sender_id： 发送人id
 * @param {Object} sender_person_name：发送人姓名
 * @param {Object} sender_login_name：发送人登录名
 * @param {Object} sender_identity：发送人身份
 * @param {Object} target_login_names：接收人登录名数组
 * @param {Object} is_url：是否允许跳转页面，1允许，2不允许
 * @param {Object} url_name：跳转页面名称，需要在base-config.js中配置BASE_YY_OPEN
 * @param {Object} param_num：使用模板编号，需要找周枫
 * @param {Object} sysmsg_code：业务编码，自定义，便于日后查询
 * @param {Object} bureau_id：机构id，非必传，便于查询
 * @param {Object} district_id：区id，非必传，便于查询
 * @param {Object} city_id：市id，非必传，便于查询
 * @param {Object} province_id：省id，非必传，便于查询
 * @param {Object} params：模板参数数组，10个元素
 */
function commonSendSysMsg(sender_id, sender_person_name, sender_login_name, sender_identity, target_login_names, is_url, url_name, param_num, sysmsg_code, bureau_id, district_id, city_id, province_id, params, callback) {
	var sysmsg_json = {};
	sysmsg_json["sender_id"] = sender_id + '';
	sysmsg_json["sender_person_name"] = sender_person_name;
	sysmsg_json["sender_login_name"] = sender_login_name;
	sysmsg_json["sender_identity"] = sender_identity + '';
	sysmsg_json["is_url"] = is_url + '';
	sysmsg_json["url_name"] = url_name;
	sysmsg_json["param_num"] = param_num + '';
	sysmsg_json["sysmsg_code"] = sysmsg_code;
	sysmsg_json["bureau_id"] = bureau_id + '';
	sysmsg_json["district_id"] = district_id + '';
	sysmsg_json["city_id"] = city_id + '';
	sysmsg_json["province_id"] = province_id + '';
	var to_ids = [];
	for (var i = 0; i < target_login_names.length; i++) {
		var to_id = {};
		to_id["target_login_name"] = target_login_names[i];
		to_ids[i] = to_id;
	}
	sysmsg_json["target_list"] = to_ids;
	var params_list = {};
	for (var i = 0; i <= 9; i++) {
		if ('undefined' != typeof (params[i]) || null != params[i]) {
			params_list["param" + (i + 1)] = params[i];
		} else {
			params_list["param" + (i + 1)] = "";
		}
	}
	sysmsg_json["params_list"] = params_list;

	//	var sysmsg_json = '{"sender_id":"91936","sender_person_name":"黄海","sender_login_name":"liujing16","sender_identity":"5","is_url":"1","url_name":"wenzhang_index_window","param_num":"2","sysmsg_code":"WENZHANG_20160518","bureau_id":"302049","district_id":"302049","city_id":"302049","province_id":"302049","target_list":[{"target_login_name":"zhoufeng2"}],"params_list":{"param1":"文章","param2":"文章评论","param3":"文章标题","param4":"参数","param5":"参数","param6":"参数","param7":"参数","param8":"参数","param9":"参数","param10":"参数"}}';
	api.ajax({
		url : BASE_URL_ACTION + '/rongcloud/sendSystemMessage',
		method : 'post',
		dataType : 'json',
		cache : false,
		data : {
			values : {
				"sysmsg_json" : JSON.stringify(sysmsg_json)
			}
		}

	}, function(ret, err) {
		if (err) {
			callback(false);
			//popToast('发送失败');
		} else {
			callback(true);
			//popToast('发送成功');
		}
	});
}

/**
 * 服务器内容转融云内容
 * 例： zfapp -- zfapp_199
 * 周枫
 * 2016.03.09
 */
function commonOldParamToNewParam(old_param) {
	//没有后缀，加上后缀
	if (old_param.lastIndexOf('_' + $api.getStorage('BASE_SERVER_NAME')) == -1) {
		old_param = old_param + "_" + $api.getStorage('BASE_SERVER_NAME');
	}
	return old_param;
}

/**
 * 融云内容转服务器内容
 * 例： zfapp_199 -- zfapp
 * 周枫
 * 2016.03.09
 */
function commonNewParamToOldParam(new_param) {
	//有后缀，去掉后缀
	if (new_param.lastIndexOf('_' + $api.getStorage('BASE_SERVER_NAME')) != -1) {
		var sub_key = "_" + $api.getStorage('BASE_SERVER_NAME');
		var sub_index = new_param.lastIndexOf(sub_key);
		new_param = new_param.substring(0, sub_index);
	}
	return new_param;
}

/**
 * 根据人员id获取人员
 * 周枫
 * 2016.06.02
 */
function commonGetPInfoByPId(person_id, identity_id, callback) {
	api.ajax({
		url : BASE_URL_ACTION + '/person/getPersonInfo?person_id=' + person_id + '&identity_id=' + identity_id,
		method : 'GET',
		dataType : 'json',
		cache : false,
	}, function(ret, err) {
		if (err) {
			callback(false, '');
		} else {
			callback(true, ret);
		}
	});
}

/*
 *作者:zhaoj
 *功能:打开加载数据的提示框
 *日期：20160819
 */
function showSelfProgress(msg) {
	api.showProgress({
		title : msg,
		text : '请稍候...',
		modal : true
	});
}
/*
 *作者:zhaoj
 *功能:打开加载数据的提示框
 *日期：20160819
 */
function commonShowProgress(msg,modal) {
	api.showProgress({
		title : msg,
		text : '请稍候...',
		modal : modal
	});
}
/*
 *作者:zhaoj
 *功能:是否是空的字符串
 *日期：20161018
 */
function isEmptyString(str) {
	return typeof (str) == "undefined" || str == null || str.length == 0;
}

/*
 *作者:zhaoj
 *功能:点击搜索
 *日期：20161024
 */
function commonDoSearch() {
	$api.addCls($api.dom(".aui-searchbar-wrap"), "focus");
	$api.dom('.aui-searchbar-input input').focus();
}

/*
 *作者:zhaoj
 *功能:取消搜索
 *日期：20161024
 */
function commonCancelSearch() {
	var content = $api.val($api.byId("search-input"));
	if (content.length > 0) {
		$api.val($api.byId("search-input"), '');
		startSearch(0);
	}
	$api.removeCls($api.dom(".aui-searchbar-wrap.focus"), "focus");
	$api.val($api.byId("search-input"), '');
	$api.dom('.aui-searchbar-input input').blur();
}
/*
 *作者:zhaoj
 *功能:ipad清空搜索
 *日期：20161024
 */
function commonIpadClearInput(){
	commonClearInput();
	commonShowOrHideClear(0);
}
/*
 *作者:zhaoj
 *功能:清空搜索
 *日期：20161024
 */
function commonClearInput() {
	var content = $api.val($api.byId("search-input"));
	if (content.length > 0) {
		$api.val($api.byId("search-input"), '');
		startSearch(0);
	}
}

/*
 *作者:zhaoj
 *功能:开始搜索
 *参数:type=1时，代表从页面中键盘直接点击的搜索，type=0时，代表是取消搜索或者是清空搜索
 *日期：20161024
 */
function commonSearch(type, callback) {
	var content = $api.val($api.byId("search-input"));
	content = $api.trimAll(content);
	content = commonRemoveHTMLTag(content);
	content = Base64.encode(content);
	//ios系统时，将base64加密之后的+号替换成%2B
	if (api.systemType == 'ios') {
		content = content.replace(/\+/g, "%2B");
	}
	callback(content);
	if(type == 1 || type ==0){
    	
    		$api.dom('.aui-searchbar-input input').blur();
    	
    }
}
/*
 *作者:zhaoj
 *功能:显示隐藏搜索框清空图标
 *日期：20161024
 */
function commonShowOrHideClear(length,self){
	if(length == 0){
		$api.addCls($api.byId('j_search_clear'), 'aui-hide');
		$api.cssVal($api.byId('j_search_body'),'padding-right:45px;');
	}else{
		$api.removeCls($api.byId('j_search_clear'), 'aui-hide');
		$api.cssVal($api.byId('j_search_body'),'padding-right:65px;');
	}
	startSearch(2);
	commonRemoveExpression(self);
}
/*
 *作者:zhaoj
 *功能:打开滑动条页面
 *日期：20161024
 */
function commonMyNavigationBar(params) {
	commonInitNavigationBarParams(params, function(data) {
		var frame_url;
		frame_url = 'widget://html/common/common_nav_frame.html';
		//打开通知内容frame
		api.openFrame({
			name : params.name,
			url : frame_url,
			rect : {
				x : data.x,
				y : data.y,
				w : data.w,
				h : data.h,
			},
			pageParam : {
				params : data
			},
			bounces : false,
			allowEdit : false,
			scrollToTop : true,
			bgColor : 'rgba(0,0,0,0)',
			vScrollBarEnabled : true,
			hScrollBarEnabled : false
		});
	})
}

/*
 *作者:zhaoj
 *功能:初始化滑动条参数
 *日期：20161027
 */
function commonInitNavigationBarParams(params, callback) {
	if (isEmptyString(params.x)) {
		params.x = 0;
	}
	if (isEmptyString(params.w)) {
		params.w = 'auto';
	}
	if (isEmptyString(params.h)) {
		params.h = 45;
	}
	if (isEmptyString(params.file_level)) {
		params.file_level = 1;
	}
	if (isEmptyString(params.name)) {
		params.name = 'common_nav_frame';
	}
	callback(params);
}

/*
 *作者:zhaoj
 *功能:关闭滑动条
 *日期：20161024
 */
function commonCloseNavigationBar() {
	api.closeFrame({
		name : 'common_nav_frame'
	});
}
/*
 *作者:zhaoj
 *功能:隐藏滑动条
 *日期：20180130
 */
function commonHideNavigationBar() {
	api.setFrameAttr({
	    name: 'common_nav_frame',
	    hidden: true
	});
}
/*
 *作者:zhaoj
 *功能:显示滑动条
 *日期：20180130
 */
function commonShowNavigationBar() {
	api.setFrameAttr({
	    name: 'common_nav_frame',
	    hidden: false
	});
}
/*
 *作者:zhaoj
 *功能:安卓点击返回的时候
 *日期：20161029
 */
function commonBackForAndroid() {
	if (api.systemType == 'android') {
		api.addEventListener({
			name : "keyback"
		}, function(ret, err) {
			back();
		});
	}
}

/**
 * 打开一个页面进行统计
 * 周枫
 * 2016.11.29
 * @param {Object} frame_name
 */
function commonOpenTjData(param_name) {
	tongji_data.onPageStart(param_name);
}

/**
 * 关闭一个页面进行统计
 * 周枫
 * 2016.11.29
 * @param {Object} frame_name
 */
function commonCloseTjData(param_name) {
	tongji_data.onPageEnd(param_name);
}

/*
 *作者:zhaoj
 *功能:没有分页的渲染html
 *日期：20161116
 */
function commonAddOnceHtml(div_id, script_id, data) {
	var html_type = template.render(script_id, data);
	document.getElementById(div_id).innerHTML = html_type;
}

/*
 *作者:zhaoj
 *功能:渲染html
 *参数:currentPage为全局变量，代表分页
 *日期：20161101
 */
function commonAddManyHtml(div_id, script_id, data) {
	var html_type = template.render(script_id, data);
	if (currentPage == 1) {
		document.getElementById(div_id).innerHTML = html_type;
	} else {
		$api.append($api.byId(div_id), html_type);
	}
}
/*
 *作者:zhaoj
 *功能:没有分页的渲染时间轴html
 *日期：20161116
 */
function commonAddTimeAxisOnceHtml(div_id, script_id, data) {
	var html_type = template.render(script_id, data);
	document.getElementById(div_id).innerHTML = html_type;
}

/*
 *作者:zhaoj
 *功能:渲染时间轴html
 *参数:currentPage为全局变量，代表分页,type:当前年份变化时，把之前年份的数据渲染到页面中
 *日期：20161101
 */
function commonAddTimeAxisManyHtml(div_id, script_id, data,type) {
	var html_type = template.render(script_id, data);
	if (currentPage == 1 && type == 1) {
		document.getElementById(div_id).innerHTML = html_type;
	} else {
		$api.append($api.byId(div_id), html_type);
	}
}
/*
 *author:zhaoj
 *function:关闭frame页面
 *date：20161202
 */
function commonCloseFrame(frame_name) {
	api.closeFrame({
		name : frame_name
	});
}

/*
 *author:zhaoj
 *function:打开语音播放frame页面
 *date：20161202
 */
function commonListernArticle(type,oparam) {
	voicePlayer.listernArticle(type,oparam);
}

/*
 *author:zhaoj
 *function:向window页面添加朗读内容
 *date：20161202
 */
function commonVoiceContent(voice_content) {
	//播放内容需要加密去空格
	var content = Base64.encode($api.trimAll(voice_content));
	api.execScript({
		script : 'voicePlayer.addVoiceContent("' + content + '");'
	});
}

/*
 *author:zhaoj
 *function:定位header位置，留出上面电池等空隙，苹果需要
 *date：20161205
 */
function commonIosAuiHeader() {
	var header = $api.byId('aui-header');
	$api.fixStatusBar(header);
	var headerPos = $api.offset(header);
}

/**
 * 根据字节数返回对应MB,GB等格式；传入B，转出KB,MB等
 * 周枫
 * 2016.12.10
 * @param {Object} bytes
 */
function commonBytesToSize(bytes) {
	if (bytes === 0)
		return '0 B';
	var k = 1000, // or 1024
	sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'], i = Math.floor(Math.log(bytes) / Math.log(k));
	return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

function commonGetPicUrl(app_type, pic_id, pic_ext) {
	var pic_url = "";
	if (app_type == 1) {
		pic_url = BASE_IMAGE_PRE+"down/Material/" + a_id.substring(0, 2) + "/" + a_id + '.' + a_ext + commonReturnPhotoCutSize(1,96,96,a_ext,0);
	} else {
		a_avatar_url = BASE_URL_ACTION + "/html/thumb/Material/" + a_id.substring(0, 2) + "/" + a_id + '.' + a_ext + commonReturnPhotoCutSize(1,96,96,a_ext,0);
	}

}

/*
 *author:zhaoj
 *function:应用从后台回到前台事件，字符串类型
 *date：20170111
 */
function commonResume(fun_name) {
	api.addEventListener({
		name : 'resume'
	}, function(ret, err) {
		eval(fun_name);
	});
}

/*
 *author:zhaoj
 *function:应用进入后台事件，字符串类型
 *date：20170111
 */
function commonPause(fun_name) {
	api.addEventListener({
		name : 'pause'
	}, function(ret, err) {
		eval(fun_name);
	});
}

/**
 * 解析xml
 * 示例：
 * 周枫
 * 2017.02.15
 */
function commonLoadXML(xmlString) {
	var xmlDoc = null;
	//判断浏览器的类型
	//支持IE浏览器
	if (!window.DOMParser && window.ActiveXObject) {//window.DOMParser 判断是否是非ie浏览器
		var xmlDomVersions = ['MSXML.2.DOMDocument.6.0', 'MSXML.2.DOMDocument.3.0', 'Microsoft.XMLDOM'];
		for (var i = 0; i < xmlDomVersions.length; i++) {
			try {
				xmlDoc = new ActiveXObject(xmlDomVersions[i]);
				xmlDoc.async = false;
				xmlDoc.loadXML(xmlString);
				//loadXML方法载入xml字符串
				break;
			} catch(e) {
			}
		}
	}
	//支持Mozilla浏览器
	else if (window.DOMParser && document.implementation && document.implementation.createDocument) {
		try {
			/* DOMParser 对象解析 XML 文本并返回一个 XML Document 对象。
			 * 要使用 DOMParser，使用不带参数的构造函数来实例化它，然后调用其 parseFromString() 方法
			 * parseFromString(text, contentType) 参数text:要解析的 XML 标记 参数contentType文本的内容类型
			 * 可能是 "text/xml" 、"application/xml" 或 "application/xhtml+xml" 中的一个。注意，不支持 "text/html"。
			 */
			domParser = new DOMParser();
			xmlDoc = domParser.parseFromString(xmlString, 'text/xml');
		} catch(e) {
		}
	} else {
		return null;
	}
	return xmlDoc;
}

/*
 *author:zhaoj
 *function:获取服务器当前时间
 *date：20170215
 */
function commonGetCurrentDate(callback) {
	api.ajax({
		url : BASE_URL_ACTION + '/xx/getCurrentDate',
		method : 'get',
		timeout : 30,
		dataType : 'json',
		returnAll : false,
		data : {
			values : {
				"random_num" : creatRandomNum()
			}
		}
	}, function(ret, err) {
		if (err) {
			nowTime = new Date();
			nowMillisecond = Date.parse(nowTime);
		} else {
			if (ret.success) {
				nowTime = new Date(ret.dateStr2.replace(/\-/g, "/"));
				nowMillisecond = Date.parse(new Date(ret.dateStr2.replace(/\-/g, "/")));
			} else {
				nowTime = new Date();
				nowMillisecond = Date.parse(nowTime);
			}
		}
		callback(nowTime, nowMillisecond);
	});
}

/**
 * 过滤html标签，防注入
 * 周枫
 * 2017.03.01 
 * @param {Object} str 
 */
function commonRemoveHTMLTag(str) {
	str = str.replace(/<\/?[^>]*>/g, '');
	//去除HTML tag
	str = str.replace(/[ | ]*\n/g, '\n');
	//去除行尾空白
	//str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
	str = str.replace(/ /ig, '');
	//去掉
	return str;
}

/**
 * 会话过滤html标签，防注入并保留空格
 * 张自强
 * 20180920
 */
function commonRemoveHTMLTagZzq(str) {
    str = str.replace(/<\/?[^>]*>/g, '');
    //去除HTML tag
    str = str.replace(/[ | ]*\n/g, '\n');
    //去除行尾空白
    str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
    //去掉
    return str;
}

/*
*author:zhaoj
*function:屏幕向左滑动
*date：20170303
*/
function commonScreenSwipeLeft(func_name){
	api.addEventListener({
		name : 'swipeleft'
	}, function(ret, err) {
		eval(func_name);
	});
}

/*
*author:zhaoj
*function:屏幕向右滑动
*date：20170303
*/
function commonScreenSwipeRight(func_name){
	api.addEventListener({
		name : 'swiperight'
	}, function(ret, err) {
		eval(func_name);
	});
}
/*
*author:zhaoj
*function:屏幕向上滑动
*date：20170303
*/
function commonScreenSwipeUp(func_name){
	api.addEventListener({
		name : 'swipeup'
	}, function(ret, err) {
		eval(func_name);
	});
}
/*
*author:zhaoj
*function:屏幕向下滑动
*date：20170303
*/
function commonScreenSwipeDown(func_name){
	api.addEventListener({
		name : 'swipedown'
	}, function(ret, err) {
		eval(func_name);
	});
}
/*
*author:zhaoj
*function:根据地区来调用不同刷新应用页面的消息提醒数量的方法
*date：20170505
*/
function commonRefreshYingyong(){
	var idy_id = $api.getStorage('idy_id')*1;
    var frame_name = idy_id == 3 ? 'hxx_index':'nav_3';
    commonExecScript('root',frame_name,'initModeShow();',1);
}
/*
*author:zhaoj
*function:图片添加缓存
*param：img_url 要求为数组格式
*date：201706017
*/
function commonGetImageCache(img_url, callback){
	showSelfProgress('加载中...');
	var img_array=[];
	for(var i = 0; i < img_url.length; i++){
		api.imageCache({
			url : img_url[i],
			thumbnail:false
		}, function(ret, err) {
			if(!ret.status){
				img_array.push(img_url[i]);
			}else{
				img_array.push(ret.url);
			}
			if(img_array.length == img_url.length){
				api.hideProgress();
				callback(img_array);
			}
		});
	}
}

/**
 * 返回基础配置
 * 周枫
 * 2017.06.17 
 * @param {Object} callback
 */
function commonBaseConfig(file_url,callback){
	//表情的JSON数组
	api.readFile({
		path : file_url
	}, function(ret, err) {
		if (ret.status) {
			callback($api.strToJson(ret.data));
		}
	});
}

/*
 * 设置应用屏幕展示方向
 * 周枫
 * 2017.08.01
 * screen_type：方向
 */
function commonSetScreen(screen_type){
	var screen_orientation = "";
	switch(screen_type) {
		case 0:
			screen_orientation = 'auto';
		break;
		case 1:
			//竖屏时，屏幕在home键的上面
			screen_orientation = 'portrait_up';
		break;
		case 2:
			//横屏时，屏幕在home键的左边
			screen_orientation = 'landscape_left';
		break;
		case 3:
			//屏幕根据重力感应在竖屏间自动切换
			screen_orientation = 'auto_portrait';
		break;
		case 4:
			 //屏幕根据重力感应在横屏间自动切换
			screen_orientation = 'auto_landscape';
		break;
		case 5:
			//横屏时，屏幕在home键的右边
			screen_orientation = 'landscape_right';
		break;
		default:
			screen_orientation = 'portrait_up';
		break;
	}
	api.setScreenOrientation({
	    orientation: screen_orientation
	});
}

/**
 * 转换 单引号 和 双引号 为中文引号
 * 周枫
 * 2017.08.02 
 * @param {Object} re_text
 * @param {Object} re_type
 * 0：单双，1：单引号，2：双引号
 */
function commonReplaceYinHao(re_text, re_type){
	switch(re_type){
		case 0:
			re_text = re_text.replace(/\'/g, "’");
			re_text = re_text.replace(/\"/g, "”");
		break;
		case 1:
			re_text = re_text.replace(/\'/g, "’");
		break;
		case 2:
			re_text = re_text.replace(/\"/g, "”");
		break;
	}
	return re_text;
}
/*
*author:zhaoj
*function:设置数据的月份初始化
*param:type代表分页，year代表当前数据中对应的年份，根据年份判断当前页面中已经存在的月份
*date：20170822
*/
function commonSetMonthData(type,year){
	if(type!=1){
		template_data.is_live=1;
	}else{
		template_data.is_live=0;
	}
	template_data.list=[];
	if(type == 1){
		for(var i = 12; i > 0; i-- ){
			var k = i;
			var param = new Object();
			param.month = k+'月';
			param.num = k;
			param.is_live = 0;
			param.month_list = [];
			template_data.list.push(param);
		}
	}else{
		for(var i = 12; i > 0; i-- ){
			var k = i;
			if(!!document.getElementById("j_"+year+"_"+k)){
				var param = new Object();
				param.month = k+'月';
				param.num = k;
				param.is_live = 1;
				param.month_list = [];
			}else{
				var param = new Object();
				param.month = k+'月';
				param.num = k;
				param.is_live = 0;
				param.month_list = [];
			}
			template_data.list.push(param);
		}
	}
}
/*
*author:zhaoj
*function:根据time时间获取年、月、日，并将数据放到对应的月份当中去
*param:time，代表获取时间轴数据，data代表列表数据
*date：20170822
*/
function commonSetTimeAxisData(oparam){
	var param_json = JSON.parse(oparam);
	var time = param_json.time;
	//获取年、月
	var zyYear = time.substring(0,4);
	var zyMonth = time.substring(5,7);
	var page=currentPage;//判断同一页面中，分页为1时，第一次切换年份，从头开始渲染数据，第二次切换年份，往后对接数据
	if(template_data.year==''||zyYear !=template_data.year){
		if(template_data.year != ''){
			if(currentPage == 1){
				template_data.flag == false ? page = 2 : page=1;//flag:true代表第一次切换年份，flag：false代表第二次切换年份
				template_data.flag=false;
			}
			//更换年份时，把上一个年份的数据渲染渲染数据
			commonAddTimeAxisManyHtml(param_json.div_name, param_json.script_name,template_data,page);
		}
		template_data.year=zyYear;
		commonSetMonthData(1,zyYear);
	}
	for(var j = 0; j<template_data.list.length;j++){
		if(template_data.list[j].num == zyMonth*1){
			template_data.list[j].month_list.push(param_json.data);
		}
	}
}
/*
*author:zhaoj
*function:根据time时间获取年、月、日，并将数据放到对应的月份当中去
*param:winName，win的名称，frameName，frame的名称，fun_name，执行方法的名称
*date：20170901
*/
function commonExecScript(winName,frameName,fun_name,type){
	if(type){
		api.execScript({
			name:winName,
			frameName:frameName,
	        script: fun_name
	    });
	}else{
		api.execScript({
			name:winName,
	        script: fun_name
	    });
	}
}
/*
*author:zhaoj
*function:将资源上传到资源库中
*param:param_json:上传到资源库中所需参数，callback：回调函数
*date：20170904
*/
function commonInsertResourceBaseInfo(param_json,callback){
	param_json.is_show_tip ? showSelfProgress('上传中...'):'';
	api.ajax({
		url : BASE_URL_ACTION + '/ypt/res/insert_resource_base_info',
		method : 'post',
		timeout : 30,
		dataType : 'json',
		data : {
			values : {
				"random_num" : creatRandomNum(),
				"app_type_id" : param_json.app_type_id,
				"beike_type" : param_json.beike_type,
				"bk_type_name" : param_json.bk_type_name,
				"file_id" : param_json.file_id,
				"group_id" : param_json.group_id,
				"identity_id" : param_json.identity_id,
				"m3u8_status" : param_json.m3u8_status,
				"person_id" : param_json.person_id,
				"person_name" : param_json.person_name,
				"res_type" : param_json.res_type,
				"resource_format" : param_json.resource_format,
				"resource_title" : param_json.resource_title,
				"structure_id" : param_json.structure_id,
				"is_check": 0,
			}
		},
		headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
		}, function(ret, err) {
			if(err){
				callback(false,"");
			}else{
				if(ret.success){
					callback(true,ret);
				}else{
					callback(false,"");
				}
			}
	});
}
/*
*author:zhaoj
*function:获取资源详情
*date：20170904
*/
function commonGetResInfo(param_json,callback){
	param_json.is_show_tip ? showSelfProgress('加载中...'):'';
	var data = {"random_num" : creatRandomNum()};
	var res_url='';
	if(param_json.resource_id_int){
		data.resource_id_int = param_json.resource_id_int;
		res_url = BASE_URL_ACTION+'/ypt/resource/getResourceByIDInt';
	}else{
		data.ids = param_json.resource_info_id;
		res_url = BASE_URL_ACTION+'/ypt/resource/getResourceInfoByIds';
	}
	api.ajax({
		url : res_url,
		method : 'get',
		timeout : 30,
		dataType : 'json',
		data : {
			values : data
		},
		headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
		}, function(ret, err) {
			if(err){
				callback(false,"");
			}else{
				if(ret.success){
					callback(true,ret);
				}else{
					callback(false,"");
				}
			}
	});
}
/*
*author:zhaoj
*function:打开录制视频的页面
*param_json:配置参数
*date：20170905
*/
function commonOpenAssembly(params){
	privilegeManagement('microphone',function(){
		commonOpenAssemblyBefore(params)
	})
}
function commonOpenAssemblyBefore(params){
	api.openWin({
		name : params.name,
		url : "widget://html/common/"+params.name+".html",
		bounces : false,
		delay : 0,
		scrollToTop : true,
		allowEdit : false,
		slidBackEnabled : false,
		scaleEnabled : false,
		vScrollBarEnabled : true,
		hScrollBarEnabled : false,
		slidBackEnabled : false,
		animation : {
			type : "reveal", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 0
		},
		pageParam : {
			params:JSON.stringify(params)
		}
	});
}
/*
*author:zhaoj
*function:修改window页面的标题
*name:标题名称
*date：20170913
*/
function commonSetWindowName(name){
	$api.html($api.byId('mTitle'), name);
}
/*
*author:zhaoj
*function:回到顶部
*date：20170914
*/
function commonBackTop(domId){
	$api.byId(domId).scrollIntoView();//定位到最上方 
}
/*
*author:zhaoj
*function:替换所有的回车换行
*date：20170914
*/
function commonTransferBrStr(content) {
	var string = content;
	try {
		string = string.replace(/\r\n/g, "<br />")
		string = string.replace(/\n/g, "<br />");
	} catch(e) {
		popAlert(e.message);
	}
	return string;
}

/*
*author:zhaoj
*function:根据参数增加显示或去掉隐藏样式
*date：20170919
*/
function commonAddOrRemoveHideCss(id,type){
	if(type){ 
	   $api.removeCls($api.byId(id), 'aui-hide')
	}else{
	   if(!$api.hasCls($api.byId(id), 'aui-hide')){
	       $api.addCls($api.byId(id), 'aui-hide');
	   }
	}
}
/*
*author:zhaoj
*function:设置frame隐藏或者显示
*date：20170929
*/
function commonSetFrameHidden(name,hidden){
	api.setFrameAttr({
	    name: name,
	    hidden: hidden
	});
}
/*
*作者:zhaoj
*功能:获取学期
*日期：20171011
*/
function commonGetListSemester(callback){
	api.ajax({
		url : BASE_URL_ACTION + '/subject/getListSemester',
		method : 'post',
		timeout : 30,
		dataType : 'json',
		cache : false,
	}, function(ret, err) {
		if (err) {
			callback(false,'获取学期失败,请稍候重试');
		} else {
			if(ret){
				if(ret.xqlist.length>0){
					callback(true,ret);
				}else{
					callback(false,'暂无学期');
				}
			}else{
				callback(false,'获取学期失败,请稍候重试');
			}
		}
	});
}

/**
 * 底部弹出框
 * 周枫
 * 2017.10.16 
 */
function commonOpenActionSheet(title, cancel_title, destructive_title, buttons_arra, callback){
	api.actionSheet({
		//标题，字符串，传空则不显示
	    title: title,
	    //取消按钮标题，字符串，传空则不显示，有值则替换‘取消’按钮
	    cancelTitle: cancel_title,
	    //红色警示按钮标题，一般用于做一些删除之类操作，字符串，传空则不显示
	    destructiveTitle: destructive_title,
	    //其它按钮，数组
	    buttons: buttons_arra
	}, function(ret, err) {
	    var sel_index = ret.buttonIndex;
	    callback(sel_index);
	});
}
/*
 *作者:zhaoj
 *功能:打开图片裁剪页面
 *日期：20171020
 */
function commonOpenImageClipFrame(params){
	commonOpenFrame('common_imageclip_frame',"widget://html/common/common_imageclip_frame.html",0,false,false,"rgba(0,0,0,0)",{params:JSON.stringify(params)});
}
/*
 *作者:zhaoj
 *功能:关闭图片裁剪页面
 *日期：20171020
 */
function commonCloseImageClipFrame(){
	commonCloseFrame('common_imageclip_frame');
}
/*
 *author:周枫
 *function:弹出确定按钮和取消按钮prompt
 *date：20171018
 */
function popTwoBtnPrompt(titile, msg, text, type, callback) {
	api.prompt({
		title : titile,
		msg : msg,
		text : text,
		//不同输入类型弹出键盘类型不同，取值范围（text、password、number、email、url）
		type : type,
		buttons : ["确定", "取消"]
	}, function(ret, err) {
		var index = ret.buttonIndex;
		var text = ret.text;
		callback(index, text);
	});
}
/*
 *作者:zhaoj
 *功能:验证输入框，不允许输入表情
 *日期：20171106
 */
function commonRemoveExpression(self){
   var param = $api.val(self);
    var regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]|\uD83D[\uDE80-\uDEff]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|\u3030|\u3030/gi;
    if(!isEmptyString(param)){
	    if(param.match(regRule)) {
	        param = param.replace(regRule, "");
	        $api.val(self,param);
	    } 
	}
}

/*
 *作者:周枫
 *功能:手机键盘点击按钮
 * 说明：key:13时，为手机键盘‘GO，前往’按钮
 *日期：20171107
 */
function commonKeydown(exe_fun){
	document.onkeydown=function(event){
        var e = event || window.event || arguments.callee.caller.arguments[0];      
        if(e && e.keyCode==13){ // enter 键
             //要做的事情
             eval(exe_fun);
        }
    }; 
}
/*
 *作者:赵静
 *功能:打开视频录制，并返回视频路径
 *日期：20180118
 */
function commonModuleDemo(param,callback){
	privilegeManagement('camera',function(){
		commonModuleDemoBefore(param,callback)
	})
}
function commonModuleDemoBefore(param,callback){
	var demo = api.require('moduleDemo');
    demo.recordVedios({
        msg: param.time,
    },function(ret, err){
        var msg = ret.msg;
        callback(msg);
    });
}
/*
 *作者:赵静
 *功能:设置主题
 *日期：20180127
 */
function commonSetTheme(param){
	var level = '';
	for(var i =0 ; i < param.level; i++){
		level += '../';
	}
	var theme = $api.getStorage('theme');
	var mode = $api.getStorage('mode');
	var idy_type = $api.getStorage('idy_type');
	var theme_base=level+'css/theme/'+theme+'/theme-base.css';
	$api.attr($api.byId('j_theme_base'), 'href', theme_base);
	//加载theme-base.css
	if(param.type == 0){
		//只加载theme-base.css
		$api.attr($api.byId('j_theme_base'), 'href', theme_base);
	}else if(param.type == 1){
		//iphone文件夹下的theme
		var theme_type=level+'css/theme/'+theme+'/iphone/theme-'+idy_type+'.css';
		$api.attr($api.byId('j_theme'), 'href', theme_type);
	}else if(param.type == 2){
		//ipad文件夹下的theme
		var theme_type=level+'css/theme/'+theme+'/ipad/theme-'+idy_type+'.css';
		$api.attr($api.byId('j_theme'), 'href', theme_type);
	}else if(param.type == 3){
		//iphone文件夹下的module-icon
		var mode_type=level+'css/module-icon/'+mode+'/iphone/mode-common.css';
		$api.attr($api.byId('j_mode'), 'href', mode_type);
	}else if(param.type == 4){
		//ipad文件夹下的module-icon
		var mode_type=level+'css/module-icon/'+mode+'/ipad/mode-'+idy_type+'.css';
		$api.attr($api.byId('j_mode'), 'href', mode_type);
	}
}
/*
*author:zhaoj
*function:判断是否为同一个人登录
*param:param_json参数的json对象
*name:缓存的名称
*type:0缓存是否存在，存在说明是同一个人
*type：1缓存中person_id进行判断，是否是同一个人
*date：20180131
*/
function commonSamePerson(param_json,callback){
	var param = $api.getStorage(param_json.name);
	if(param_json.type == 0){
		//缓存是否存在，存在说明是同一个人
		if(isEmptyString(param)){
			callback(false);
		}else{
			callback(true);
		}
	}else if(param_json.type == 1){
		//缓存中person_id进行判断，是否是同一个人
		if(isEmptyString(param)){
			callback(false);
		}else{
			param =  JSON.parse(param);
			storage_data = param;
			if(param.person_id == $api.getStorage("person_id")){
				callback(true);
			}else{
				callback(false);
			}
		}
	}
}
/*
*author:zhaoj
*function:去掉试题题干不能编辑的问题
*date：20180306
*/
function commonRemoveQuestionEdit(question_title){
	question_title = question_title.replaceAll("contenteditable='true'","contenteditable='false'");
	return question_title;
}
/*
*author:zhaoj
*function:查看是否是空间的具有格式的图片
*date：20180306
*/
function commonCheckIsSpaceImg(url,msg){
    var test = /([a-z0-9A-Z]){8}-([a-z0-9A-Z]){4}-([a-z0-9A-Z]){4}-([a-z0-9A-Z]){4}-([a-z0-9A-Z]){12}.([a-zA-Z])+/;
    var re = new RegExp(test);
    if(re.test(url)){
        if(!!!msg){msg="";}
        url = url.match(test)[0];
        if(BASE_APP_TYPE == 1){
        	return BASE_IMAGE_PRE+"down/Material/" + url.substring(0,2) + "/" + url + msg;
        }else{
        	return BASE_URL_ACTION + "/html/thumb/Material/" + url.substring(0,2) + "/" + url + msg;
        }
    }else{
        return url;
    }
}
/*
*author:zfz
*function:验证评论中是够包含敏感词，包含则不让发表
*date：20180511
*/
function textAntispamScan(str,callback){
	callback(true);
	return;
	var con_obj = {"content":str}
    var content2 = JSON.stringify(con_obj);
    api.ajax({
		url :BASE_URL_ACTION + '/aliyuncontentsecurity/textantispamscan/textAntispamScan',
		method : 'POST',
		timeout : 30,
		dataType : 'json',
		data : {
			values : {
				"random_num" : creatRandomNum(),
				"content2":content2
			}
		},
		headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' +$api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
	}
	}, function(ret, err) {
		if (err) {
		
		} else {
			for(var i = 0;i<ret.length;i++){
				if(ret[i].suggestion==2){
					popToast('您输入的内容包含敏感词，请修改后再操作');
					callback(false);
				}else{
					callback(true);
				}
			}
		}
	});
}
/**
 * 打开图片查看窗口 
 * @param {str} imgUrl：图片地址
 * 王俭 
 * 2018.6.2
 */
function openPictureShowWin(imgAry,index){
	if (isEmptyString(index)){
		index = 0;
	}
	commonOpenWin('common_picture_window','widget://html/common/common_picture_window.html',false,false,{'imgAry':imgAry,'index':index});
}


/*
 * 功能：发送消息提示
 * 作者：张自强
 * 时间：20180615
 * BusinessId：业务模板id
 * IsUrl：需要有超链接跳转
 * SenderId：发送人的person_id
 * SenderIdentity：发送人的身份id
 * SenderLoginName:发送人的登录名
 * TargetList：消息发送给谁的登录名
 * TemplateId：模板id
 * TemplateParamsList模板中所需的参数
 * UrlName：这是移动端需要传的信息，当该消息能点击的时候，跳转到当前这个页面
 * TypeId：1只发送融云消息
 */
function commonSendMssage(TargetList,TemplateId,BusinessId,TypeId,TemplateParamsList,UrlName,SenderId,SenderIdentity,SenderLoginName,ParamsList){
    console.log(JSON.stringify({
                "TypeId" : TypeId,
                "BusinessId" : BusinessId,
                "TargetList" : TargetList,
                "ParamsList":ParamsList,
                "TemplateId" : TemplateId,
                "SenderIdentity" : SenderIdentity,
                "SenderId" : SenderId,
                "SenderLoginName" : SenderLoginName,
                "IsUrl" : 1,
                "UrlName" : UrlName,
                "TemplateParamsList" : TemplateParamsList,
                "random_num" : creatRandomNum(),
            }));
    api.ajax({
        url : BASE_URL_ACTION + '/ypt/space/sendmessage/sendmessage_task',
        method : 'post',
        timeout : 30,
        dataType : 'json',
        data : {
            values : {
                "TypeId" : TypeId,
                "BusinessId" : BusinessId,
                "TargetList" : TargetList,
                "ParamsList":ParamsList,
                "TemplateId" : TemplateId,
                "SenderIdentity" : SenderIdentity,
                "SenderId" : SenderId,
                "SenderLoginName" : SenderLoginName,
                "IsUrl" : 1,
                "UrlName" : UrlName,
                "TemplateParamsList" : TemplateParamsList,
                "random_num" : creatRandomNum(),
            }
        },
        headers : {
            'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
        }
    }, function(ret, err) {
        console.log(JSON.stringify(ret));
        console.log(JSON.stringify(err));
        if (err) {
            popToast('发送提示消息失败，请稍候再试！');
        } else {
            if (ret.success) {
            } else {
                popToast('发送提示消息失败，请稍候再试！');
            }
        }
    });
}

/**
 * 积分处理 
 */
function creditWriteToQueue(options) {
	if (creditFlag == 0) {
		return false;
	}
	
    var defaultSetting = {
        person_id:$api.getStorage("person_id"),
        identity_id:$api.getStorage("identity"),
        platform_type:1,
        ip_addr:"",
        operation_system:"",
        browser:"",
        business_type:options.business_type,
        relatived_id:options.relatived_id,
        e_relatived_id:options.e_relatived_id,
        r_person_id:options.r_person_id,
        r_identity_id:options.r_identity_id,
        r_province_id:"",
        r_city_id:"",
        r_district_id:"",
        r_school_id:"",
        r_class_id:"",
        operation_content:options.operation_content
    };
	if($api.getStorage("person_id") == options.r_person_id){
        return false;
    }

	api.ajax({
		url : BASE_URL_ACTION + '/credit/writeToQueue',
		method : 'post',
		dataType : 'json',
		cache : false,
		data : {
			values : {
				"random_num":creatRandomNum(),
				"person_id":defaultSetting.person_id,
				"identity_id":defaultSetting.identity_id,
				"platform_type":defaultSetting.platform_type,
				"ip_addr":defaultSetting.ip_addr,
				"operation_system":defaultSetting.operation_system,
				"browser":defaultSetting.browser,
				"business_type":defaultSetting.business_type,
				"relatived_id":defaultSetting.relatived_id,
				"e_relatived_id":defaultSetting.e_relatived_id,
				"r_person_id":defaultSetting.r_person_id,
				"r_identity_id":defaultSetting.r_identity_id,
				"r_province_id":defaultSetting.r_province_id,
				"r_city_id":defaultSetting.r_city_id,
				"r_district_id":defaultSetting.r_district_id,
				"r_school_id":defaultSetting.r_school_id,
				"r_class_id":defaultSetting.r_class_id,
				"operation_content":defaultSetting.operation_content
			}
		}
	}, function(ret, err) {
	});
}

/*
*author:zhaoj
*function:获取缩率图路径
*date：20171023
*/
function gertImageUrl(file_id,ext,type){
	var img_url='';//图片路径
	if(ext == 'png' || ext == 'PNG'|| ext == 'jpg'|| ext == 'JPG'|| ext == 'gif'|| ext == 'GIF'|| ext == 'bmp'|| ext == 'BMP'){
		image_hz = type?commonReturnPhotoCutSize(0):'';
		if (BASE_APP_TYPE == 1) {
			img_url = BASE_IMAGE_PRE+"down/Material/" + file_id.substring(0, 2) + "/" + file_id+'.'+ext+ image_hz;		
		} else {
			img_url = BASE_URL_ACTION + "/html/thumb/Material/" + file_id.substring(0, 2) + "/" + file_id+'.'+ext+image_hz;
		}
	}else if(ext == 'mp3'||ext == 'wav'){
		img_url = 'widget://image/fun-module/ipad/zthd/voice-bg.png';
	}else if(commonContainsArray(support_extension,ext)){
		img_url = '../../../../../image/fun-module/ipad/zthd/vedio-bg.png';
	}else if(ext == 'doc'||ext == 'docx'){
	  	img_url = '../../../../../image/fun-module/ipad/zthd/doc.png';
	}else if(ext == 'xls'||ext == 'xlsx'){
	  	img_url = '../../../../../image/fun-module/ipad/zthd/xls.png';
	}else if(ext == 'txt'){
	  	img_url = '../../../../../image/fun-module/ipad/zthd/txt.png';
	}else if(ext == 'sb2'){
	  img_url = '../../../../../image/fun-module/ipad/zthd/sb2.png';
	}else if(ext == 'ppt' || ext == 'pptx'){
	  	img_url = '../../../../../image/fun-module/ipad/zthd/ppt.png';
	}
	return img_url;
}

/*
 * 功能：获取是否是管理员身份（校管理员，省市区的局管理员，教辅单位管理员）
 * 作者：张自强
 * 时间：20181225
 */
function commonJudgeRoles(callback) {
    var type = 0;
    var rolesArray = $api.getStorage('roles');
    for (var i = 0; i < rolesArray.length; i++) {
        if (rolesArray[i].role_id * 1 == 61) {
            if($api.getStorage('bureau_id') == $api.getStorage('province_id')){
                type = 1;//省教育局
            }
        }
        if (rolesArray[i].role_id * 1 == 62) {
            if($api.getStorage('bureau_id') == $api.getStorage('city_id')){
                type = 2;//市教育局
            }
        }
        if (rolesArray[i].role_id * 1 == 63) {
           if($api.getStorage('bureau_id') == $api.getStorage('district_id')){
                type = 3;//区县教育局
            }
        }
        if (rolesArray[i].role_id * 1 == 64) {
            if($api.getStorage('jf_org_type')*1 == 1){
                type = 4;//教辅单位
            }
        }
        if (rolesArray[i].role_id * 1 == 2) {
            if($api.getStorage('bureau_id') == $api.getStorage('school_id')){
                type = 5;//校
            }
        }
    }
    callback(type);
}

/*
 * 功能：关闭手写板连接
 * 作者：张自强
 * 时间：20190301
 */
function closeHandWriteBoardLinked(callback){
    var handWriteBoard = api.require('handWriteBoard');
    if(handWriteBoard){
        handWriteBoard.disconnectBle();
    }
    callback();
}

/*
 * 功能：图片裁剪尺寸（支持华为云和局）
 * 作者：张自强
 * 时间：20190615
 */
function commonReturnPhotoCutSize(type,w_,h_,format,isYun){
    var now_w_ = api.winWidth;
    var now_h_ = api.winHeight;
    var now_format_ = 'png'
    if(format){
        now_format_ = format;
    }
    if(type){
        now_w_ = w_;
        now_h_ = h_;
    }
    if(BASE_APP_TYPE == 1 || isYun){//云版
        return '?x-image-process=image/resize,w_'+now_w_+',h_'+now_h_+'/quality,q_100';
    }else{//局版
        return '@' + now_w_ + 'w_' + now_h_ + 'h_100Q_1x.'+now_format_;
    }
    
}

function privilegeManagement (jurisdiction,fun) {
 	var resultList = api.hasPermission({
		list:[jurisdiction]
	});
	if(!resultList[0].granted){
		api.confirm({
		    msg: '您未开启权限，是否获取权限',
		    buttons: ['确定', '取消']
		}, function(ret, err) {
		    var index = ret.buttonIndex;
		    if(index == 1){
			    api.requestPermission({
			    list:[jurisdiction],
			    code:1
				}, function(ret, err){
				    if(!ret.list[0].granted){
						popAlert('您未开启权限，请重新获取')			    	
				    }else{
				    	return fun()
				    }
				});
			}
		});
    }else{
	  return fun()  
    }
}
function overallPrivilegeManagement (){
	if(!$api.getStorage('overallPrivilegeManagement')){
		api.requestPermission({
		    list:['camera','microphone','storage-w','storage-r','phone-call','location'],
		    code:1
		}, function(ret, err){
		    $api.setStorage('overallPrivilegeManagement',true);
		});
	}
}
/*
 * 获取设备信息
 */
function systemInformation(frame_name){
    api.execScript({
        name:api.winName,
        frameName:frame_name,
        script: 'systemInforResult("'+api.systemType+'","'+api.systemVersion+'")'
    });
}
/*
 * 获取设备信息-全
 */
function getDeviceInfo(frame_name) {
    var module = api.require('deviceInfo'); 
    module.systemInfo(function(data){
        var obj = JSON.stringify(data);
        api.execScript({
            name:api.winName,
            frameName:frame_name,
            script: 'getDeviceInfoResult('+obj+')'
        });
    });  
}
/*
 * 获取手机定位信息 经纬度
 */
function getLocation(frame_name){
    //没有定位权限时需要先获取
    privilegeManagement('location',function(){
        var locationModule = api.require('getLocation');
        // 当前APP在高德开放平台生成的安卓和IOS的key值
var appGaoDeIOSKey = "d381733dd0622c26f15733a86d832fda";
var appGaoDeAndroidKey = "01b96c70b6e656828a3f9e7dbd6509c8";
        var apiKey = api.systemType == "ios" ? appGaoDeIOSKey : appGaoDeAndroidKey;
        var param = {
            apiKey : apiKey
        };
        locationModule.getLocation(param, function(data){
            if (data.status) {
                var lat = data.latitude;
                var lon = data.longitude;
                api.execScript({
                    name:api.winName,
                    frameName:frame_name,
                    script: 'getLocationResult("'+lon+'","'+lat+'")'
                });
            } else {
                popAlert('获取位置信息失败');
            }
        });
    })    
}
//服务协议
function openfwxy(){
  commonOpenWin('common_fwxy_window', 'widget://html/common/common_fwxy_window.html', false, false, {header_h:45})
}
//隐私政策
function openyszc(){
  commonOpenWin('common_yszc', 'widget://html/common/common_yszc_window.html', false, false, {content:""})
}

