/*
*作者:zhaoj
*功能:四个模块打开index页面的公共方法
*日期：20161006
*/
function openCommonIndexFrame(name,height,keyword,school_id){
	var frame_x = 0;
	var frame_y = header_h + height;
	var frame_w = 'auto';
	var frame_h = api.winHeight - header_h - height;
	if(name=="cpIpad_index_frame"){
		frame_w = Math.floor(api.winWidth*0.45);
	}
	api.openFrame({
		name : name,
		scrollToTop : true,
		allowEdit : false,
		url : name+'.html',
		rect : {
			x : frame_x,
			y : frame_y,
			w : frame_w,
			h : frame_h,
		},
		pageParam : {
			header_h : header_h,
			keyword:keyword,
			school_id : school_id
		},
		bgColor: '#efeff4',
		vScrollBarEnabled : true,
		hScrollBarEnabled : false,
		//页面是否弹动 为了下拉刷新使用
		bounces : true
	});
}
/*
*作者:zhaoj
*功能:四个模块打开添加页面的公共方法
*日期：20161006
*/
function openAddCommonFrame(mode_name,name){
	reBackType('add');
	//打开新闻资讯内容frame页面
	api.openFrame({
		name : name,
		scrollToTop : true,
		allowEdit : true,
		url : name+'.html',
		rect : {
			x : 0,
			y : header_h,
			w : 'auto',
			h : api.winHeight - header_h,
		},
		vScrollBarEnabled : true,
		hScrollBarEnabled : false,
		pageParam : {
			header_h : header_h,
			register_id:register_id
		},
		//页面是否弹动 为了下拉刷新使用
		bounces : false
	});
}
/*
*作者:zhaoj
*功能:四个模块打开添加页面的公共方法
*日期：20161006
*/
function openContentCommonFrame(mode_name,name,transfer_data){
	var frame_x = 0;
	var frame_y = header_h;
	var frame_w = 'auto';
	var frame_h = api.winHeight - header_h;
	if(name=="cpIpad_content_frame"){
		commonCloseFrame('cpIpad_content_frame');
		frame_w = Math.floor(api.winWidth*0.55);
		frame_x = Math.floor(api.winWidth*0.45);
	}
	api.execScript({
		name : mode_name+'_index_window',
		script : 'reBackType("content")'
	});	
	//打开新闻资讯内容frame页面
	api.openFrame({
		name : name,
		scrollToTop : true,
		allowEdit : true,
		url : name+'.html',
		rect : {
			x : frame_x,
			y : frame_y,
			w : frame_w,
			h : frame_h,
		},
		vScrollBarEnabled : true,
		hScrollBarEnabled : false,
		pageParam : {
			header_h : header_h,
			transfer_data:transfer_data
		},
		//页面是否弹动 为了下拉刷新使用
		bounces : false
	});
}
/*
*作者:zhaoj
*功能:下拉刷新
*日期：20161006
*/
function refreshDataInfo() {
	api.setRefreshHeaderInfo({
		visible : true,
		loadingImg : 'widget://image/local_icon_refresh.png',
		bgColor : '#FFFFFF',
		textColor : '#8E8E8E',
		textDown : '下拉加载更多...',
		textUp : '松开加载...',
		showTime : true
	}, function(ret, err) {
		showSelfProgress('加载中...');
		currentPage = 1;
		initData(currentPage);
	});
}
/*
*作者:zhaoj
*功能:上拉获取新的数据
*日期：20161006
*/
function scrollBottomReload() {
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
/*
*作者:zhaoj
*功能:渲染html
*日期：20161006
*/
function addTemplateHtml(div_id, script_id, data){
	var html_type = template.render(script_id, data);
	if (currentPage == 1) {
		document.getElementById(div_id).innerHTML = html_type;
	} else {
		$api.append($api.byId(div_id), html_type);
	}
}
/*
*作者:zhaoj
*功能:判断角色，如果存在role_id = 2，说明是学校管理员
*日期：20161006
*/
function judgeRoles(callback){
	var rolesArray  = $api.getStorage('roles');
	for(var i = 0; i < rolesArray.length; i++){
		if(rolesArray[i].role_id * 1 == 2){
			is_xxgly = 1; 
			callback(true);
		}
	}
	if(is_xxgly == 0){
		callback(false);
	}
}
//替换所有的回车换行
function transferBrStr(content) {
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
 *function:设置添加图片按钮的高度
 *date：20160508
 */
function setImgBtnHeight(){
	var addBtnWidth = $api.cssVal($api.byId('j_add_btn'), 'width');
	$api.css($api.dom($api.byId('j_add_btn'),'dt'), 'height:'+addBtnWidth+';line-height:'+(addBtnWidth.replaceAll('px','')*1-4)+'px;');
}
/*
 *author:zhaoj
 *function:验证通知内是否有内容
 *date：20160111
 */
function verContent(mode_name,name) {
	var content = $api.val($api.byId('notice_content'));
	content = $api.trim(content);
	if (content != '') {
		api.confirm({
			title : '提示',
			msg : '是否保留已有内容？',
			buttons : ['保留', '清空']
		}, function(ret, err) {
			if (ret.buttonIndex == 1) {
				openRecord();
			} else {
				$api.val($api.byId('notice_content'), '');
				openRecord(mode_name,name);
			}
		});
	} else {
		openRecord(mode_name,name);
	}
}

/*
 *author:zhaoj
 *function:打开录音页面
 *date：20160109
 */
function openRecord(mode_name,name) {
	api.openFrame({
		name : name,
		scrollToTop : true,
		allowEdit : true,
		url : name+'.html',
		bgColor : '#ffffff',
		rect : {
			x : 0,
			y : header_h,
			w : 'auto',
			h : api.winHeight - header_h,
		},
		//页面是否弹动 为了下拉刷新使用
		bounces : false
	});
	api.execScript({
		name : mode_name+'_index_window',
		script : 'reBackType("record");'
	});
}
/*
 *author:zhaoj
 *function:录音的内容填写到页面中
 *date：20161006
 */
function recordContent(str) {
	var notice_id = $api.byId('notice_content');
	var content = $api.val($api.byId('notice_content'));
	content = content + str;
	$api.val($api.byId('notice_content'), content);
}

/**
 * 选择要上传的图片
 * 周枫
 * 2016.4.27 
 */
function openPicture(sourceType) {
	//获取一张图片
	api.getPicture({
		sourceType : sourceType,
		encodingType : 'jpg',
		mediaValue : 'pic',
		//返回数据类型，指定返回图片地址或图片经过base64编码后的字符串
		//base64:指定返回数据为base64编码后内容,url:指定返回数据为选取的图片地址
		destinationType : 'url',
		//是否可以选择图片后进行编辑，支持iOS及部分安卓手机
		allowEdit : true,
		//图片质量，只针对jpg格式图片（0-100整数）,默认值：50
		quality : 80,
		//		targetWidth : 100,
		//		targetHeight : 1280,
		saveToPhotoAlbum : true
	}, function(ret, err) {
		if (ret) {
			/*
			 * data:"",                //图片路径
			 base64Data:"",          //base64数据，destinationType为base64时返回
			 */
			var img_url = ret.data;
			if (img_url != "") {
				//上传图片
//						uploadNoticePic(img_url);
				var pic_list = [];
				pic_list.push(img_url);
				//递归上传图片
				dgUploadFiles(0, pic_list, function(is_true) {
					if (is_true) {
						api.hideProgress();
						api.toast({
                            msg:'上传成功'
                        });
					} else {
						popToast("服务器繁忙，请稍候重试");
					}
				});
			}
		}
	});
}
/**
 * 获取图片方式
 * 周枫
 * 2016.2.18
 */
function getPicture() {
	api.confirm({
		title : "提示",
		msg : "手机端请选择一张照片作为您的新闻资讯附件",
		buttons : ["现在照", "相册选", "取消"]
	}, function(ret, err) {
		//定义图片来源类型
		var sourceType;
		if (1 == ret.buttonIndex) {/* 打开相机*/
			sourceType = "camera";
			openPicture(sourceType);
		} else if (2 == ret.buttonIndex) {
			sourceType = "album";
			openPicture(sourceType);
		} else {
			return;
		}
	});
}
/*
 *author:zhaoj
 *function:打开添加附件选项组件框
 *date：20160220
 */
function openAddFilesOpn() {
	api.actionSheet({
		
		cancelTitle : '取消',
		buttons : ['图片', '拍照'],
		style : {
			titleFontColor : '#ff0000'
		}
	}, function(ret, err) {
		if (ret) {
			if (ret.buttonIndex == 1) {
				//相册
				//getPicture("album");
				album();
			} else if (ret.buttonIndex == 2) {
				//拍照
				getPicture("camera");
			}
		} else {
			//		         alert( JSON.stringify( err ) );
		}
	});
}
/**
 * 获取头像
 * 周枫
 * 2016.1.16
 */
function getPicture(sourceType) {
	isOnLineStatus(function(is_true, line_type) {
		if (is_true) {
			if (line_type == 'wifi' || line_type == '4g') {
				openPicture(sourceType);
			} else {
				api.confirm({
					title : "提示",
					msg : "您当前正在使用" + line_type + "网络，建议您在wifi网络下使用，是否继续？",
					buttons : ["继续", "取消"]
				}, function(ret, err) {
					var sourceType;
					if (1 == ret.buttonIndex) {
						openPicture(sourceType);
					} else {
						return;
					}
				});
			}
		} else {
			api.toast({
				msg : '请连接网络后使用当前功能~'
			});
		}
	});
}

/**
 * 选取图片
 * 周枫
 * 2016.1.16
 */
function openPicture(sourceType) {
	isOnLineStatus(function(is_true, line_type) {
		var q = 50;
		if (line_type == 'wifi') {
			q = 80;
		}
		img_suffix = commonReturnPhotoCutSize(0);
		//获取一张图片
		api.getPicture({
			sourceType : sourceType,
			encodingType : 'png',
			mediaValue : 'pic',
			//返回数据类型，指定返回图片地址或图片经过base64编码后的字符串
			//base64:指定返回数据为base64编码后内容,url:指定返回数据为选取的图片地址
			destinationType : 'url',
			//是否可以选择图片后进行编辑，支持iOS及部分安卓手机
			allowEdit : true,
			//图片质量，只针对jpg格式图片（0-100整数）,默认值：50
			quality : q,
			//		targetWidth : 100,
			//		targetHeight : 1280,
			saveToPhotoAlbum : true
		}, function(ret, err) {
			if (ret) {
				/*
				* data:"",                //图片路径
				base64Data:"",          //base64数据，destinationType为base64时返回
				*/
				var img_url = ret.data;
				if (img_url != "") {
					setTimeout(function() {
						//上传图片
						commonUploadFiles(img_url, function(is_true, a_file_id, a_ext) {
							if (is_true) {
								api.hideProgress();
								var file_id = a_file_id;
								var ext = a_ext;
								
								if (BASE_APP_TYPE == 1) {
									var img_url = BASE_IMAGE_PRE + url_path_suffix + file_id.substring(0, 2) + "/" + file_id + '.' + ext + img_suffix;
								} else {
									var img_url = BASE_URL_ACTION + BASE_IMAGE_BEGIN + file_id.substring(0, 2) + "/" + file_id + '.' + ext + img_suffix;
									;
								}
								if (getfilesNum() == 4) {
									$api.css($api.byId('j_add_btn'), 'display:none');
									addFiles(img_url, 'mr0');
								} else {
									addFiles(img_url, '');
								}
							} else {
								popToast(a_file_id);
							}
						});
					}, 1000);
				}
			}
		});
	});
}
/*
 *author:zhaoj
 *function:根据模块获取子文件的个数
 *date：20160224
 */
function getfilesNum() {
	var dlArray = $api.domAll($api.byId('j_files'), '.j_file');
	return dlArray.length;
}

/*
 *author:zhaoj
 *function:给模块添加文件
 *date：20160224
 */
function addFiles(img_url, css) {
	var img_size = (api.winWidth - 30) * 0.18;
	img_size = Math.floor(img_size);
	var dl_height = $api.cssVal($api.byId('j_add_btn'), 'height')
	var dl_html = '<dl class="j_file' + ' ' + css + '" style="height:' + dl_height + ';">' ;
	    dl_html = dl_html + '<dt class="img" style="width:' + img_size + 'px;height:' + img_size + 'px;" onclick="openImage(this.parentNode,this.parentNode.parentNode)">';
	    dl_html = dl_html + '<img class="j_img" src=' + img_url + ' width="' + (img_size - 1) + '" height="' + (img_size - 4) + '" /></dt>';
	    dl_html = dl_html + '<dd onclick="deleteFile(event,this.parentNode)"><img src="../../../../../image/fun-module/common/shanchu.png" /></dd></dl>';
	$api.before($api.byId('j_add_btn'), dl_html);
}

/*
 *author:zhaoj
 *function:删除当前文件
 *date：20160225
 */
function deleteFile(e, parent) {
	parent.parentNode.removeChild(parent);
	var dlArray = $api.domAll($api.byId('j_files'), '.j_file');
	var length = getfilesNum() - 1;
	if (length == 3) {
		$api.removeCls(dlArray[length], 'mr0');
		$api.css($api.byId('j_add_btn'), 'display:inline-block');
	}
	e.stopPropagation();
}

/*
 *author:zhaoj
 *function:打开图片
 *date：20160225
 */
function openImage(parent, grandpa) {
	var index;
	if (parent) {
		index = 0;
		while ( parent = parent.previousSibling) {
			if (parent.nodeType == 1)
				index++;
		}
	}
	var openImgArray = [];
	var dlArray = $api.domAll($api.byId('j_files'), '.j_file');
	for (var i = 0; i < dlArray.length; i++) {
		openImgArray.push($api.attr($api.dom(dlArray[i], '.j_img'), 'src'));
	}
	var imageBrowser = api.require('imageBrowser');
	imageBrowser.openImages({
		imageUrls : openImgArray,
		//是否以九宫格方式显示图片
		showList : false,
		//showList : true,
		activeIndex : index
	});
}

/*
 *author:zhaoj
 *function:选择图片
 *date：20160225
 */
function album() {
	var dlArray = $api.domAll($api.byId('j_files'), '.j_file');
	var num = 5 - dlArray.length;
	obj_scan.open({
        //返回的资源种类,image（图片）,video（视频）,all（图片和视频）
        type : 'image',
        max : num,
        //（可选项）图片排序方式,asc（旧->新）,desc（新->旧）
        styles : {
            bg : '#fff',
            mark : {
                icon : '',
                position : 'bottom_right',
                size : 20
            },
            nav : {
                bg : '#eee',
                stateColor : '#000',
                stateSize : 18,
                cancleBg : 'rgba(0,0,0,0)',
                cancelColor : '#000',
                cancelSize : 18,
                finishBg : 'rgba(0,0,0,0)',
                finishColor : api.systemType == "android"?'#000':'#fff',
                finishSize : 18,
                unFinishColor: 'rgba(0,0,0,0)',
                titleColor: '#000',
            },
            bottomTabBar: {
                previewTitleColor: "#fff",

            }
        },
		rotation : true,
		showPreview : false,
		showBrowser : true
	}, function(ret) {
		if (ret) {
			if (getJsonObjLength(ret.list) != 0) {
				//递归上传图片
				dgUploadFiles(0, ret.list, function(is_true) {
					if (is_true) {
						api.hideProgress();
					} else {
						popToast("服务器繁忙，请稍候再试");
					}
				});
			}
		}
	});
}

/**
 * 递归上传图片
 * 周枫
 * 2016.3.28
 */
function dgUploadFiles(p_c, pic_list, callback) {
	var pic_l = getJsonObjLength(pic_list);
	img_suffix = commonReturnPhotoCutSize(0);
	if (p_c < pic_l) {
		var pic_url_old = pic_list[p_c].path;
		if (api.systemType == 'ios') {
			//将相册图片地址转换为可以直接使用的本地路径地址
			obj_scan.transPath({
				path : pic_url_old
			}, function(ret) {
				var pic_url_new = ret.path;
				commonUploadFiles(pic_url_new, function(is_true, a_file_id, a_ext) {
					if (is_true) {
						var file_id = a_file_id;
						var ext = a_ext;
						if (BASE_APP_TYPE == 1) {
							var img_url = BASE_IMAGE_PRE + url_path_suffix + file_id.substring(0, 2) + "/" + file_id + '.' + ext + img_suffix;
						} else {
							var img_url = BASE_URL_ACTION + BASE_IMAGE_BEGIN + file_id.substring(0, 2) + "/" + file_id + '.' + ext + img_suffix;
							
						}
						if (getfilesNum() == 4) {
							$api.css($api.byId('j_add_btn'), 'display:none');
							addFiles(img_url, 'mr0');
						} else {
							addFiles(img_url, '');
						}
						p_c++;
						return dgUploadFiles(p_c, pic_list, callback);
					} else {
						return dgUploadFiles(p_c, pic_list, callback);
					}
				});
			});
		} else {
			commonUploadFiles(pic_url_old, function(is_true, a_file_id, a_ext) {
				if (is_true) {
					var file_id = a_file_id;
					var ext = a_ext;
					if (BASE_APP_TYPE == 1) {
						var img_url = BASE_IMAGE_PRE + url_path_suffix + file_id.substring(0, 2) + "/" + file_id + '.' + ext + img_suffix;
					} else {
						var img_url = BASE_URL_ACTION + BASE_IMAGE_BEGIN + file_id.substring(0, 2) + "/" + file_id + '.' + ext + img_suffix;
					}
					if (getfilesNum() == 4) {
						$api.css($api.byId('j_add_btn'), 'display:none');
						addFiles(img_url, 'mr0');
					} else {
						addFiles(img_url, '');
					}
					p_c++;
					return dgUploadFiles(p_c, pic_list, callback);
				} else {
					return dgUploadFiles(p_c, pic_list, callback);
				}
			});
		}
	} else {
		callback(true);
	}
}
/*
*作者:zhaoj
*功能:搜索图标是否显示
*日期：20161006
*/
function isSearchDisplay(flag){
	if(flag){
		$api.css($api.byId('search'),'display:inline;');
	} else {
		$api.css($api.byId('search'),'display:none;');
	}
}
/*
*作者:zhaoj
*功能:获取注册号
*日期：20161008
*/
function getNewsRegisterId(mode_name,a_identity_id,callback){
	var a_id;
	var identity_id = $api.getStorage("identity");
	if(a_identity_id==104){
		//学校
		if(isEmptyString(school_id)){
			a_id = $api.getStorage('school_id');
		}else{
			a_id = school_id;
		}
		
	}else{
		//班级或者学生
		a_id = class_id;
	}
	api.ajax({
		url :BASE_URL_ACTION + '/space/getNewsRegisterId?random_num='+creatRandomNum()+'&a_id='+a_id+'_1_'+mode_name+'&a_identity_id='+a_identity_id,
		method : 'get',
		timeout : 30,
		dataType : 'json',
		headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' +identity_id + '; token=' + $api.getStorage("token_ypt") + ';'
	}
	}, function(ret, err) {
		if (err) {
			callback(false,0);
		} else {
			if(ret.success){
				if(ret.flag){
					callback(true,ret.regist_id);
				}else{
					applyRegisterId(function(registerId){
						if(registerId != -1){
							var register_a_id = a_id+'_1_'+mode_name;
			                saveRegisterId(registerId,register_a_id,a_identity_id,function(register,flag){
			                	if(flag){
				                	callback(true,register);
				                }else{
				                	callback(false,0);
				                }
			                });
			                
			            }
					});
				}
			}else{
				callback(false,0);
			}
		}
	});
}
/*
*作者:zhaoj
*功能:申请注册号
*日期：20161008
*/
function applyRegisterId(callback){
	var registerId = -1;
	api.ajax({
		url :BASE_URL_ACTION + "/ypt/notice/applyRegisterId?random_num="+creatRandomNum(),
		method : 'get',
		timeout : 30,
		dataType : 'json',
		headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' +$api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
	}
	}, function(ret, err) {
		if(ret.success){
			registerId =ret.register_id;
		}
		callback(registerId);
	});
}
/*
*作者:zhaoj
*功能:保存注册号
*日期：20161008
*/
function saveRegisterId(regist_id,register_a_id,a_identity_id,callback){
	var flag = false;
	api.ajax({
		url :BASE_URL_ACTION + "/ypt/space/setNewsRegisterId",
		method : 'post',
		timeout : 30,
		dataType : 'json',
		data : {
			values : {
				"regist_id":regist_id,
				"a_id":register_a_id,
				"a_identity_id":a_identity_id,
				"random_num":creatRandomNum()
			}
		},
		headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' +$api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
	}
	}, function(ret, err) {
		if(ret.success){
			flag = true;
		}
		callback(regist_id,flag);
	});
}
/*
*作者:zhaoj
*功能:获取列表数据
*日期：20161008
*/
function loadData(current_page,callback){
	api.ajax({
		url :BASE_URL_ACTION + '/notice/getNoticeList?random_num='+creatRandomNum()+'&register_id='+register_id+'&page_number='+current_page+'&page_size='+BASE_PAGE_SIZE+'&title='+keyword,
		method : 'get',
		timeout : 30,
		dataType : 'json',
		headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
	}
	}, function(ret, err) {
		if (err) {
			callback(false,0);
		} else {
			if(ret.success){
				//图片缩略图进行处理
				for(var i=0; i < ret.list.length; i++){
					var thumb_id = ret.list[i].thumbnail;
					var thumb_url = '';
					if (BASE_APP_TYPE == 1) {
						var key = url_path_down+url_path_suffix;
						var key_re = BASE_IMAGE_PRE+url_path_suffix;
						thumb_url = thumb_id.replaceAll(key, key_re);
						thumb_url = thumb_url+commonReturnPhotoCutSize(0);
					}else{
						var key = '/dsideal_yy';
						if(thumb_id.indexOf(BASE_URL_ACTION) != -1){
							thumb_url = thumb_id
						}else{
							if (thumb_id.indexOf(url_path_suffix) != -1) {
								thumb_id = thumb_id.replaceAll(url_path_suffix, BASE_IMAGE_PRE);
							}
							if (thumb_id.indexOf(key) != -1) {
								var thumb_file = thumb_id.replaceAll(key, BASE_URL_ACTION);
								thumb_url = thumb_file+commonReturnPhotoCutSize(0);
							}else{
								thumb_url = thumb_id
							}
						}
					}
					ret.list[i].thumb_id=thumb_url;
				}
				//内容详情中的图片路径进行处理并将发布人姓名、时间加密
				for(var i=0; i < ret.list.length; i++){
					var notice_con = ret.list[i].content;
					if (BASE_APP_TYPE == 1) {
						var notice_str1 = '<img';
						var notice_str2 = '<img class="ima_notice"';
						notice_con = notice_con.replaceAll(notice_str1, notice_str2);
					}else{
						var key = '/dsideal_yy';
						var notice_str3 = '<img';
						var notice_str4 = '<img class="ima_notice"';
						notice_con = notice_con.replaceAll(notice_str3, notice_str4);
						if(notice_con.indexOf(BASE_URL_ACTION) == -1){
							if (notice_con.indexOf(key) != -1) {
								var key_re = BASE_URL_ACTION;
								notice_con = notice_con.replaceAll(key, key_re);
							}
						}
					}
					ret.list[i].content = notice_con;
					//处理需要传送到详情页面中的数据
					var oparam = new Object();
					oparam.content_base64 = Base64.encode(notice_con);
					oparam.person_name_base64 = Base64.encode(ret.list[i].person_name);
					oparam.create_time_base64 = Base64.encode(ret.list[i].create_time);
					oparam.title_base64 = Base64.encode(ret.list[i].title);
					ret.list[i].transfer_data = JSON.stringify(oparam);
				}
				callback(true,ret);
				//通知顶部下拉刷新数据加载完毕，组件会恢复到默认状态
				commonControlRefresh();
			}else{
				callback(false,0);
			}
		}
	});
}
/*
*作者:zhaoj
*功能:发布数据
*日期：20161008
*/
function addNotice(mode_name,org_type){
	$api.css($api.byId('shadow'),'z-index:3;');
	var title = $api.val($api.byId('notice_title'));
	if (title == '') {
		api.alert({
			msg : '标题不能为空！'
		}, function(ret, err) {
			$api.byId('notice_title').focus();
		});
		$api.css($api.byId('shadow'),'z-index:-1;');
		return false;
	}
	var content = $api.val($api.byId('notice_content'));
	if (content == '') {
		api.alert({
			msg : '对不起，请输入内容'
		}, function(ret, err) {
			$api.byId('notice_content').focus();
		});
		$api.css($api.byId('shadow'),'z-index:-1;');
		return false;
	}
	var overview = content.substring(0,100);
	content = '<p>' + content + '</p><br/>';
	//验证是否有附件
	var dlArray = $api.domAll($api.byId('j_files'), '.j_file');
	if (dlArray.length != 0) {
		var thumbnail;//缩略图路径
		if (BASE_APP_TYPE == 2) {
			for (var i = 0; i < dlArray.length; i++) {
				if (i == 0) {
					thumbnail = $api.attr($api.dom(dlArray[i], '.j_img'), 'src');
					var startIndex = thumbnail.indexOf('/dsideal_yy/');
					thumbnail = thumbnail.substring(startIndex,thumbnail.length);
					thumbnail = thumbnail.replaceAll(img_suffix, '');
				}
				var img_url = $api.attr($api.dom(dlArray[i], '.j_img'), 'src');
				var startIndex = img_url.indexOf('/dsideal_yy/');
				img_url = img_url.substring(startIndex,img_url.length);
				img_url = img_url.replaceAll(img_suffix, '');
				var img_html = '<img src="' + img_url + '" alt="" />'
				content = content+ img_html;
			}
		} else {
			for (var i = 0; i < dlArray.length; i++) {
				if (i == 0) {
					thumbnail = $api.attr($api.dom(dlArray[i], '.j_img'), 'src');
					thumbnail = thumbnail.replaceAll(img_suffix, '');
				}
				var img_url = $api.attr($api.dom(dlArray[i], '.j_img'), 'src');
				img_url = img_url.replaceAll(img_suffix, '');
				var img_html = '<img src="' + img_url + '" alt="" />'
				content = content+ img_html;
			}
		}
	}
	showSelfProgress('发布中...');
	api.ajax({
		url :BASE_URL_ACTION + '/ypt/notice/addNotice',
		method : 'post',
		timeout : 30,
		dataType : 'json',
		data : {
			values : {
				"content":content,
				"identity_id":$api.getStorage("identity"),
				"notice_type":1,
				"org_id":$api.getStorage("school_id"),
				"org_type":org_type,
				"overview":overview,
				"person_id":$api.getStorage("person_id"),
				"register_id":api.pageParam.register_id,
				"thumbnail":thumbnail,
				"title":title,
				"random_num":creatRandomNum()
			}
		},
		headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
	}
	}, function(ret, err) {
		if (err) {
			api.hideProgress();
			$api.css($api.byId('shadow'),'z-index:-1;');
			popToast('发布失败，请稍候再试！');
		} else {
			if(ret.success){
				setTimeout(function(){
					api.hideProgress();
					popToast('发布成功');
					$api.css($api.byId('shadow'),'z-index:-1;');
					api.execScript({
						name : mode_name+'_index_window',
						frameName : mode_name+'_index_frame',
						script : 'initData(1);'
					});
					api.execScript({
						name : mode_name+'_index_window',
						script : 'back();'
					});
				},3000);
			}else{
				api.hideProgress();
				$api.css($api.byId('shadow'),'z-index:-1;');
				popToast('发布失败，请稍候再试！');
			}
		}
	});
}
/*
*作者:zhaoj
*功能:给window页面中register_id公共变量赋值
*日期：20161008
*/
function setRegisterId(id){
	register_id = id;
}
/*
*作者:zhaoj
*功能:设置搜索值，并根据搜索值获取列表数据
*日期：20161010
*/
function setKeyword(key_word){
	keyword = key_word;
	currentPage = 1;
	initData(currentPage);
}
/**
 * 判断发送新闻资讯是否显示
 * 周枫
 * 2015.11.25 
 */
function isAddDisplay(flag){
	if(flag){
		$api.css($api.byId('menu'),'display:inline;');
} else {
	$api.css($api.byId('menu'),'display:none;');
	}
}
/*
*作者:zhaoj
*功能:判断下拉菜单图标是否显示
*日期：20161014
*/
function judgeMenuDisplay(mode_name){
	//设置页面的搜索值
	api.execScript({
		name : mode_name+'_index_window',
		frameName : mode_name+'_index_frame',
		script : 'judgeClassDataLength("'+mode_name+'");'
	});
}
/*
*作者:zhaoj
*功能:根据下拉菜单的长度判断是否显示下拉菜单图标
*日期：20161014
*/
function judgeClassDataLength(mode_name){
	if(class_data.list.length>1){
		api.execScript({
			name : mode_name+'_index_window',
			script : 'isMenuDisplay(true);'
		});
	}else{
		api.execScript({
			name : mode_name+'_index_window',
			script : 'isMenuDisplay(false);'
		});
	}
}
/*
*作者:zhaoj
*功能:菜单显示或隐藏
*日期：20161011
*/
function isMenuDisplay(flag){
	if(flag){
		$api.css($api.byId('class_menu'),'display:inline;');
} else {
	$api.css($api.byId('class_menu'),'display:none;');
	}
}
/*
*作者:zhaoj
*功能:获取学期
*日期：20161011
*/
function getListSemester(callback){
	api.ajax({
		url : BASE_URL_ACTION + '/subject/getListSemester',
		method : 'post',
		timeout : 30,
		dataType : 'json',
		cache : false,
	}, function(ret, err) {
		if (err) {
			api.hideProgress();
			callback(false,'获取学期失败');
		} else {
			if(ret){
				if(ret.xqlist.length>0){
					var data ={"xqlist":[]};
					for(var i=0;i<ret.xqlist.length;i++){
						var oparam = new Object();
						if(ret.xqlist[i].XQ_ID <= ret.enable_id){
							oparam.JSRQ = ret.xqlist[i].JSRQ;
							oparam.KSRQ = ret.xqlist[i].KSRQ;
							oparam.SFDQXQ = ret.xqlist[i].SFDQXQ;
							oparam.XN = ret.xqlist[i].XN;
							oparam.XQMC = ret.xqlist[i].XQMC;
							oparam.XQ_ID = ret.xqlist[i].XQ_ID;
							data.xqlist.push(oparam);
						}
					}
					callback(true,data);
				}else{
					api.hideProgress();
					callback(false,'暂无学期');
				}
			}else{
				api.hideProgress();
				callback(false,'获取学期失败');
			}
		}
	});
}
/*
*author:zhaoj
*function:获取任课班级
*date：20160528
*/
function getTeachPlanByPersonId(xq_id,callback){
	var identity_id = $api.getStorage("identity");
	api.ajax({
		url : $api.getStorage('BASE_URL_ACTION') + '/class/getClassByPersonIDIdentityID',
		method : 'get',
		dataType : 'json',
		data : {
			values : {
				"person_id" : $api.getStorage('person_id'),
				"identity_id" : $api.getStorage('identity'),
				"query_type" : 1
			}
		},
		headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + identity_id + '; token=' + $api.getStorage("token_ypt") + ';'
}
		}, function(ret, err) {
			if (err) {
				api.hideProgress();
				popToast('对不起，获取任课班级失败');
			} else {
				if(ret){
					var data = {"list":[]};
					for(var i = 0; i<ret.list.length; i++){
						var oparam = new Object();
						oparam.class_name = ret.list[i].class_name;
						oparam.class_id = ret.list[i].class_id;
						var count = 0;
				        for(var k = 0; k < data.list.length; k++){
				            if(data.list[k].class_id == ret.list[i].class_id){
				                count++;
				            }
				        }
				        if(count == 0){
				            data.list.push(oparam);
				        }
					}
					callback(data);	
				}else{
					api.hideProgress();
					popToast('对不起，获取任课班级失败');
				}
		}
	});	
}
/*
*作者:zhaoj
*功能:切换选项
*日期：20161011
*/
function changeOption(mode_name,name,id){
	api.execScript({
		name : mode_name+'_index_window',
		frameName : mode_name+'_index_frame',
		script : 'changeFrameOption("'+mode_name+'","'+name+'",'+id+');'
	});
	setTimeout(function(){
		closeMenuFrame(mode_name);
	},50);
}
/*
*作者:zhaoj
*功能:列表页面切换选项
*日期：20161011
*/
function changeFrameOption(mode_name,name,id){
	//选择正在显示的菜单选项，就不用重新获取数据
	if(class_id != id){
		showSelfProgress('加载中...');
		class_id = id;//班级id
		class_name = name;//班级名称
		currentPage = 1;
		//获取注册号
		var a_identity_id;
		
		if(mode_name=="czda"){
			if(class_id == student_id){
				$api.removeCls($api.byId('j_name'),'class');
				$api.addCls($api.byId('j_name'),'person');
				a_identity_id = 6;//学生
			}else{
				$api.removeCls($api.byId('j_name'),'person');
				$api.addCls($api.byId('j_name'),'class');
				a_identity_id = 105;//班级
			}
		}else{
			a_identity_id = 105;//班级
		}
		getRegisterId(mode_name,a_identity_id,0);
	}
}
/*
*作者:zhaoj
*功能:获取注册号,这个方法只给班级风采、成长档案以及下拉菜单切换使用
*参数：typt=1,是初始化使用，type=0，是下拉菜单切换使用
*日期：20161015
*/
function getRegisterId(mode_name,a_identity_id,type){
	if(type){
		//给公用变量class_id和clasa_name赋值
		class_id = class_data.list[0].class_id;
		class_name = class_data.list[0].class_name; 
		
		//判断下拉菜单是否显示
		judgeClassDataLength(mode_name);
	}
	
	if(mode_name=='czda'){
		//给成长档案页面 中的j_name赋值
		$api.text($api.byId('j_name'),class_name);
	}
	//设置相应的win页面名称
	api.execScript({
		name : mode_name+'_index_window',
		script : 'setTopWinTitle("'+class_name+'");'
	});
	//获取注册号
	getNewsRegisterId(mode_name,a_identity_id,function(flag,id){
		if(flag){
			register_id = id;
			//给window页面中register_id公共变量赋值
			api.execScript({
				name : mode_name+'_index_window',
				script : 'setRegisterId('+id+');'
			});
			if(id != 0){
				//获取班级风采数据
				initData(currentPage);
			}else{
				//暂时没有发布相关的数据
				api.hideProgress();
				if(mode_name=='czda'){
					//时间轴名称隐藏
					$api.css($api.byId('j_name'),'display:none;');
				}
				var data={"list":[]};
				addTemplateHtml(mode_name+'_body', mode_name+'_script', data);
			}
		}else{
			api.hideProgress();
			if(mode_name=="bjfc"){
				popToast('获取班级风采失败，请稍候重试');
			}else{
				popToast('获取成长档案失败，请稍候重试');
			}
		}
	});
}
/*
*作者:zhaoj
*功能:关闭菜单frame页面
*日期：20161011
*/
function closeMenuFrame(mode_name){
	api.closeFrame({name:mode_name+'_menu_frame'});
}
/*
*作者:zhaoj
*功能:关闭搜索显示部分
*日期：20161011
*/
function closeKeyword(){
	keyword='';
	currentPage = 1;
	initData(currentPage);
}
/*
*作者:zhaoj
*功能:打开列表页面的菜单页面
*日期：20161011
*/
function openMenuFrame(mode_name,name){
	reBackType('menu');
	api.execScript({
		name : mode_name+'_index_window',
		frameName : mode_name+'_index_frame',
		script : 'openMenuCommonFrame("'+mode_name+'","'+name+'");'
	});
}
/*
*作者:zhaoj
*功能:打开菜单页面
*日期：20161011
*/
function openMenuCommonFrame(mode_name,name){
	//打开班级风采的菜单页面
	api.openFrame({
		name : name,
		scrollToTop : true,
		allowEdit : true,
		url : name+'.html',
		rect : {
			x : 0,
			y : 0,
			w : 'auto',
			h : api.winHeight,
		},
		bgColor: 'rgba(0,0,0,0)',
		vScrollBarEnabled : true,
		hScrollBarEnabled : false,
		pageParam : {
			header_h : header_h,
			class_data:class_data
		},
		//页面是否弹动 为了下拉刷新使用
		bounces : false
	});
}
/*
*作者:zhaoj
*功能:点击搜索
*日期：20161013
*/
function doSearch(){
	$api.addCls($api.dom(".aui-searchbar-wrap"),"focus");
	$api.dom('.aui-searchbar-input input').focus();
}
/*
*作者:zhaoj
*功能:取消搜索
*日期：20161013
*/
function cancelSearch(mode_name){
	var content = $api.val($api.byId("search-input"));
	if(content.length > 0){
		$api.val($api.byId("search-input"),'');
		var content='';
		api.execScript({
			name : mode_name+'_index_window',
			frameName : mode_name+'_index_frame',
			script : 'setKeyword("'+content+'");'
		});
	}
	$api.removeCls($api.dom(".aui-searchbar-wrap.focus"),"focus");
	$api.val($api.byId("search-input"),'');
	$api.dom('.aui-searchbar-input input').blur();
}
/*
*作者:zhaoj
*功能:清空搜索
*日期：20161013
*/
function clearInput(mode_name){
	var content = $api.val($api.byId("search-input"));
	if(content.length > 0){
		$api.val($api.byId("search-input"),'');
		var content='';
		api.execScript({
			name : mode_name+'_index_window',
			frameName : mode_name+'_index_frame',
			script : 'setKeyword("'+content+'");'
		});
	}
}
/*
*作者:zhaoj
*功能:开始搜索
*日期：20161013
*/
function search(mode_name){
	var content = Base64.encode($api.trimAll($api.val($api.byId("search-input"))));
	//ios系统时，将base64加密之后的+号替换成%2B
	if (api.systemType == 'ios') {
		content = content.replace(/\+/g, "%2B");
	}
	//设置页面的搜索值
	api.execScript({
		name : mode_name+'_index_window',
		frameName : mode_name+'_index_frame',
		script : 'setKeyword("'+content+'");'
	});
}
/*
*作者:zhaoj
*功能:切换下拉菜单选项时，win页面名称也跟着变换
*日期：20161015
*/
function setTopWinTitle(name){
	title = name;
	$api.html($api.byId('mTitle'), name);
}
/*
*作者:zhaoj
*功能:关闭加载框，并显示提示
*日期：20161018
*/
function showErrorTipInfor(str){
	api.hideProgress();
	popToast('获取'+str+'失败，请稍候再试！');
}