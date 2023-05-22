var kc_id = 0;
var kc_ly = "";

//填充数据
function fillResource(kc_id) {
	api.ajax({
		url : path_url + '/yx/yd/findResourceList',
		method : 'post',
		timeout : 30,
		cache : false,
		dataTpye : 'json',
		data : {
			values : {
				'kc_id' : kc_id
			}
		}
	}, function(ret, err) {
		if (ret) {
			var urlJson = JSON.stringify(ret);
			var txt = $api.strToJson(urlJson);
			var kcxxDiv = $api.byId("kcxx");
			var html = '<table>';
			html += '<tr><td class="td1">课程名称 ： </td><td class="td2">' + txt.kcxx[0].KC_NAME + '</td></tr>';
			html += '<tr><td class="td1">课程课时 ： </td><td class="td2">' + txt.kcxx[0].KC_KS + '分钟</td></tr>';
			var type = txt.kcxx[0].TYPE;
			var zz = '';
			if (type == 1) {
				zz = "专家姓名 ：";
				html += '<tr><td class="td1">课程分类 ：</td><td class="td2"> 专家讲座</td></tr>';
			}
			if (type == 2) {
				zz = "制做团队 ：";
				html += '<tr><td class="td1">课程分类 ：</td><td class="td2"> 网络课程</td></tr>';
			}
			if (type == 3) {
				zz = "作者姓名 ：";
				html += '<tr><td class="td1">课程分类 ： </td><td class="td2">案例分析</td></tr>';
			}
			html += '<tr><td style="align:left; valign:top;" class="td1">' + zz + '</td><td class="td2">' + txt.kcxx[0].KC_ZZ + '</td></tr>';
			html += '<tr><td class="td1">课程介绍 ：</td><td class="td2">';
			if (txt.kcxx[0].MEMO == null || txt.kcxx[0].MEMO == 'null') {
				html += "暂无介绍";
			} else {
				html += txt.kcxx[0].MEMO;
			}
			html += '</td></tr></table>';
			$api.append(kcxxDiv, html);
			kc_ly = txt.kcxx[0].FROM_SYSTEM;
			for (var i = 0; i < txt.list.length; i++) {
				fillVideo(txt.list[i].KCZY_ZYMC, txt.list[i].RESOURCE_ID);
			}
		} else {
			errCode(err.code);
		}
	});
}

//填充课程资源
function fillVideo(zy_name, zy_id) {
	var list1 = $api.byId("list1");
	api.ajax({
		url : path_url + "/yx/mycourse/viewTheResource",
		method : 'post',
		timeout : 30,
		cache : false,
		dataTpye : 'json',
		data : {
			values : {
				id : zy_id
			}
		}
	}, function(ret, err) {
		if (ret) {
			var urlJson = JSON.stringify(ret);
			var txt = $api.strToJson(urlJson);
			var list1 = $api.byId("list1");
			for (var i = 0; i < txt.list.length; i++) {
				if (txt.list[i].resource_type_name == '视频') {
					var html = '<a class="item Fix hightitem" tapmode onclick="open_video(\'' + txt.list[i].m3u8_status + '\',\'' + txt.list[i].m3u8_url + '\',\'' + zy_name + '\')">' + '<div class="cnt">' + '<img class="pic" src="../../../image/training/jsyx/video.jpg">' + '<div class="wrap">' + '<div class="wrap2">' + '<div class="content">' + '<div class="shopname">' + zy_name + '</div>' + '</div>' + '</div>' + '</div>' + '</div>' + '</a>';
					$api.append(list1, html);
				}
				//					if(txt.list[i].resource_format=='pdf'){
				//						 var html= '<a class="item Fix hightitem" tapmode onclick="open_pdf(\''+txt.list[i].file_id+'\',\''+txt.list[i].resource_format+'\')">'
				//						            +'<div class="cnt">'
				//						            	+'<img class="pic" src="../../../image/training/jsyx/word.jpg">'
				//							            +'<div class="wrap">'
				//								            +'<div class="wrap2">'
				//									            +'<div class="content">'
				//									                +'<div class="shopname">'+zy_name+'</div>'
				//									            +'</div>'
				//								            +'</div>'
				//							            +'</div>'
				//						            +'</div>'
				//						        +'</a>';
				//						 $api.append(list1, html);
				//					}
			}
		} else {
			errCode(err.code);
		}
	});
}

//打开视频观看
function open_video(m3u8_status, m3u8_url, zy_name) {
	isOnLineStatus(function(is_online, line_type) {
		if (is_online) {
			if (line_type != 'wifi') {
				api.confirm({
					title : '提示',
					msg : '您当前正在非wifi网络环境下，是否继续使用此功能？',
					buttons : ['继续', '取消']
				}, function(ret, err) {
					if (ret.buttonIndex == 1) {
						if (m3u8_status == 2 || m3u8_status == '2') {
							if (kc_ly == 'dsideal') {
								m3u8_url = yun_video_url + m3u8_url;
							} else {
								if (BASE_APP_TYPE == 1) {
									m3u8_url = yun_video_url + m3u8_url;
								} else {
									m3u8_url = bendi_video_url + m3u8_url;
								}
							}
							if (api.systemType == 'android' && parseFloat(api.systemVersion) < 4.1) {
								api.openVideo({
									url : m3u8_url
								});
							} else {
								videoPlay(m3u8_url, zy_name);
							}
						} else {
							api.toast({
								msg : '课程资源正在转换中，请稍候观看',
								duration : 2000,
								location : 'middle'
							});
						}
					} else {
						return;
					}
				});
			} else {
				if (m3u8_status == 2 || m3u8_status == '2') {
					if (kc_ly == 'dsideal') {
						m3u8_url = yun_video_url + m3u8_url;
					} else {
						if (BASE_APP_TYPE == 1) {
							m3u8_url = yun_video_url + m3u8_url;
						} else {
							m3u8_url = bendi_video_url + m3u8_url;
						}
					}
					if (api.systemType == 'android' && parseFloat(api.systemVersion) < 4.1) {
						api.openVideo({
							url : m3u8_url
						});
					} else {
						videoPlay(m3u8_url, zy_name);
					}
				} else {
					api.toast({
						msg : '课程资源正在转换中，请稍候观看',
						duration : 2000,
						location : 'middle'
					});
				}
			}
		}
	});
}

//播放器
function videoPlay(m3u8_url, m3u8_title) {
	var videoPlayer = api.require('videoPlayer');
	videoPlayer.play({
		texts : {
			head : {//（可选项）JSON 类型；设置顶部文字
				title : m3u8_title //（可选项）字符串类型；顶部标题文字；默认：''
			}
		},
		styles : {
			head : {//（可选项）JSON对象；播放器顶部导航条样式
				bg : 'rgba(0.5,0.5,0.5,0.7)', //（可选项）字符串类型；顶部导航条背景，支持#、rgb、rgba、img；默认：rgba(0.5,0.5,0.5,0.7)
				height : 44, //（可选项）数字类型；顶部导航条的高；默认：44
				titleSize : 20, //（可选项）数字类型；顶部标题字体大小；默认：20
				titleColor : '#fff', //（可选项）字符串类型；顶部标题字体颜色；默认：#fff
				backSize : 44, //（可选项）数字类型；顶部返回按钮大小；默认：44
				backImg : 'fs://img/back.png', //（可选项）字符串类型；顶部返回按钮的背景图片，要求本地路径（widget://、fs://）；默认：返回小箭头图标
				setSize : 44, //（可选项）数字类型；顶部右边设置按钮大小；默认：44
				setImg : 'fs://img/set.png' //（可选项）字符串类型；顶部右边设置按钮背景图片，要求本地路径（widget://、fs://）；默认：设置小图标
			},
			foot : {//（可选项）JSON对象；播放器底部导航条样式
				bg : 'rgba(0.5,0.5,0.5,0.7)', //（可选项）字符串类型；底部导航条背景，支持#、rgb、rgba、img；默认：rgba(0.5,0.5,0.5,0.7)
				height : 44, //（可选项）数字类型；底部导航条的高；默认：44
				playSize : 44, //（可选项）数字类型；底部播放/暂停按钮大小；默认：44
				playImg : 'fs://img/back.png', //（可选项）字符串类型；底部播放按钮的背景图片，要求本地路径（widget://、fs://）；默认：播放按钮图标
				pauseImg : 'fs://img/back.png', //（可选项）字符串类型；底部暂停按钮的背景图片，要求本地路径（widget://、fs://）；默认：暂停按钮图标
				nextSize : 44, //（可选项）数字类型；底部下一集按钮大小；默认：44
				nextImg : 'fs://img/back.png', //（可选项）字符串类型；底部下一集按钮的背景图片，要求本地路径（widget://、fs://）；默认：下一集按钮图标
				timeSize : 14, //（可选项）数字类型；底部时间标签大小；默认：14
				timeColor : '#fff', //（可选项）字符串类型；底部时间标签颜色，支持#、rgba、rgb；默认：#fff
				sliderImg : 'fs://img/slder.png', //（可选项）字符串类型；底部进度条滑块背景图片，要求本地路径（widget://、fs://）；默认：滑块小图标
				progressColor : '#696969', //（可选项）字符串类型；进度条背景色，支持#、rgba、rgb；默认：#696969
				progressSelected : '#76EE00' //（可选项）字符串类型；滑动后的进度条背景色，支持#、rgb、rgba；默认：#76EE00
			}
		},
		path : m3u8_url, //（可选项）字符串类型；文档的路径，支持网络和本地（fs://）路径；默认：未传值时不播放
		//在 android 平台上不支持 widget://
		autoPlay : true //（可选项）布尔类型；打开时是否自动播放；默认：true（自动播放）
	}, function(ret, err) {
	});
}

//打开pdf文档
function open_pdf(file_id, r_format) {
	var file_path = api.wgtRootDir + '/res/' + file_id + "." + r_format;
	//var file_path=api.wgtRootDir+'/res/123456.pdf';
	var obj = api.require('fs');
	obj.exist({
		path : file_path
	}, function(ret, err) {
		if (ret.exist) {
			var obj = api.require('pdfReader');
			obj.open({
				path : file_path //'widget://res/123456.pdf'
			});
		} else {
			api.showProgress({
				style : 'default',
				animationType : 'fade',
				title : '努力加载中...',
				text : '请稍候...',
				modal : false
			});
			var url = pdf_url + file_id.substring(0, 2) + "/" + file_id + "." + r_format;
			//var url='http://10.10.6.199/dsideal_yy/html/down/Material/A0/123456.pdf';
			//var save_path=api.wgtRootDir+'/res/123456.pdf'
			api.download({
				url : url,
				savePath : file_path,
				report : false,
				cache : false,
				allowResume : false
			}, function(ret, err) {
				if (ret) {
					api.hideProgress();
					var obj = api.require('pdfReader');
					obj.open({
						path : file_path
					});
				} else {
					var value = err.msg;
				}
			});
		}
	});

}

apiready = function() {
	var kc_id = api["pageParam"]["kc_id"];
	fillResource(kc_id);
}	