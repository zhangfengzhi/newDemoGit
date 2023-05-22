		var flag;
		var bookReader;
	    
	    /*
		 *author:zhaoj
		 *function:打开文件
		 *date：20160302
		 */
		function openFile(file_id,file_name,format) {
			showSelfProgress('加载中...');
			var resource_path=  file_id.substring(0,2) + "/" + file_id + "." + format ;
			if (format == 'jpg' || format == 'jpeg' || format == 'png' || format == 'bmp') {
				//打开图片
				openImage(resource_path,file_name,format);
			} else if (format == 'flv' || format == 'mp4' || format == 'wmv' || format == 'asf' || format == 'mpg' || format == 'avi' || format == 'rmvb') {
				//打开视频
				verifyNetwork(resource_path,file_name,format, 1);
			} else if (format == 'doc' || format == 'docx' || format == 'ppt' || format == 'pptx' || format == 'txt' || format == 'xls' || format == 'xlsx' ) {
				//打开文档
				openDocument(resource_path,file_name,format);
			} else if(format == 'pdf'){
				//打开pdf
				open_pdf(file_id,format);
			} else if (format == 'mp3' || format == 'wav' || format == 'wma') {
				//打开音频
				verifyNetwork(resource_path,file_name,format, 2);
			} else {
				popAlert('对不起，您的设备不支持当前文件类型，请登录网页版查看。');
			}
		}

	/**
	 *观看课程文档（如文件存在直接打开；如果不存在先下载，再打开） 
	 */
	function open_pdf(file_id,r_format){
		var file_path=api.wgtRootDir+"/res/"+file_id+"."+r_format;
		var obj = api.require('fs');
		obj.exist({
		    path: file_path
		},function(ret,err){
		    if(ret.exist){
		       var obj = api.require('pdfReader');
				obj.open({
    				path:file_path
				});
		    } else {
		    	api.showProgress({  
				    style: 'default',  
				    animationType: 'fade',  
				    title: '努力加载中...',  
				    text: '请稍候...',  
				    modal: false  
				}); 	
				var url = pdf_url +  file_id.substring(0,2) + "/" + file_id + "." + r_format ;	
				api.download({
				    url: url,
				    savePath: file_path,
				    report: false,
				    cache: false,
				    allowResume:false
				},function(ret,err){
				    if (ret) {
					    api.hideProgress();
				  		var obj = api.require('pdfReader');
						obj.open({
		    				path:file_path
						});
				    } else{
				        var value = err.msg;
				    }
				});
		    }
		});
		
	}

		/*
		 *author:zhaoj
		 *function:打开图片
		 *date：20160302
		 */
		function openImage(resource_path,file_name,format) {
			var img_url;
			if (BASE_APP_TYPE == 1) {
				img_url = BASE_IMAGE_PRE + url_path_suffix + resource_path;
			} else {
				img_url = BASE_URL_ACTION + BASE_MATERIAL_BEGIN + resource_path;
			}
			
			showSelfProgress('加载中...');
			checkurl(img_url,function(){
				api.hideProgress();
				img_url = [img_url];
				if(api.systemType == 'ios'){
					var privacy = api.require('privacy');
					privacy.photos(function( ret, err ){      
					    if( ret.status ){
					  		openImageBrowser(img_url);
					    }else{
							api.alert({
							    title: '提示',
							    msg: '请在iPhone的“设置-隐私-照片”选项中，允许'+appName+'访问你的手机相册',
							    buttons: ['确定']
							},function( ret, err ){
							});
					    }
					});
				}else{
					openImageBrowser(img_url);
				}
				
			
			 });
			
		}
		/*
		 *author:zhaoj
		 *function:打开图片
		 *date：20160321
		 */
		function openImageBrowser(img_url){
			var imageBrowser = api.require('imageBrowser');
			imageBrowser.openImages({
				imageUrls : img_url,
				//是否以九宫格方式显示图片
				showList : false,
				//showList : true,
				activeIndex : 0
			});
		}
		/**
	 *观看课程视频
	 */
	function open_video(m3u8_status,m3u8_url,zy_name){
		if(m3u8_status==2||m3u8_status=='2'){
			if(kc_ly=='dsideal'){
			 	m3u8_url=yun_video_url+m3u8_url;
			}else{
				if(BASE_APP_TYPE==1){
					m3u8_url=yun_video_url+m3u8_url;
				}else{
					m3u8_url=bendi_video_url+m3u8_url;
				}
			}
			if (api.systemType == 'android' && parseFloat(api.systemVersion) < 4.1) {
				api.openVideo({
					url : m3u8_url
				});
			} else {
				videoPlay(m3u8_url, zy_name);
			}
		}else{
			api.toast({
				    msg: '课程资源正在转换中，请稍候观看',
				    duration:2000,
				    location: 'middle'
				});
		}
		
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
//				alert(JSON.stringify(ret));
			});
		}

		/*
		 *author:zhaoj
		 *function:打开文档
		 *date：20160303
		 */
		function openDocument(resource_path,file_name,format) {
			var doc_url;
			var fj_title = file_name;
			if (BASE_APP_TYPE == 1) {
				doc_url = url_path_down + BASE_MATERIAL_BEGIN + resource_path;
			} else {
				doc_url = BASE_URL_ACTION + BASE_MATERIAL_BEGIN + resource_path;
			}
			
			showSelfProgress('加载中...');
			checkurl(doc_url,function(){ 
				api.hideProgress();
				var save_url = api.wgtRootDir+"/res/"+file_id+"."+format;
				//alert(doc_url);
				downAndOpenDoc(doc_url, save_url,format);
				
			});
			
			
		}

		/*
		 *author:zhaoj
		 *function:打开音频
		 *date：20160303
		 */
		function openMusic(resource_path,file_name,format) {
			if (api.systemType == 'ios' && format == 'wma') {
				popAlert('对不起，您的设备不支持当前文件类型，请登录网页端查看。');
			} else {
				var music_url;
				var fj_title = Base64.decode(file_name);
				if (BASE_APP_TYPE == 1) {
					music_url = url_path_down + BASE_MATERIAL_BEGIN +resource_path;
				} else {
					music_url = BASE_URL_ACTION + BASE_MATERIAL_BEGIN + resource_path;
				}
				
				showSelfProgress('加载中...');
				checkurl(music_url,function(){ 
					api.hideProgress();
					api.openFrame({
						name : 'zy_playVoice_frame',
						url : 'zy_playVoice_frame.html',
						scrollToTop : true,
						bgColor : 'rgba(0,0,0,0.0)',
						rect : {
							x : 0,
							y : header_h,
							w : api.winWidth,
							h : api.winHeight,
						},
						pageParam : {
							voicePath : music_url
						},
					});
					
				});
				
			}
		}

		/**
		 * 打开本地文档文件
		 * 周枫
		 * 2015.12.19
		 */
		function downAndOpenDoc(fj_url, save_url,format) {
			api.showProgress({
				title : '加载中...',
				modal : false
			});
			api.download({
				url : fj_url,
				savePath : save_url,
				//下载过程是否上报
				report : true,
				//是否使用本地缓存
				cache : true,
				//是否允许断点续传
				allowResume : true
			}, function(ret, err) {
				if (ret.state == 1) {
					api.hideProgress();
					accordTypeOpenDoc(save_url,format);
				}
				if (ret.state == 2) {
					api.hideProgress();
					//popAlert('正在生成预览中，请稍候查看。');
				}
			});
		}
		/*
		*author:zhaoj
		*function:根据文档类型用不同的插件来打开文档
		*date：20160316
		*/
		function accordTypeOpenDoc(save_url,format){
			if(format == 'txt'){
				bookReader = api.require('bookReader');
				bookReader.open({
					x : 0,
					y : header_h,
					w : api.winWidth,
					h : api.winHeight - header_h,
				  	filePath : save_url
				},function(ret, err){
					if(ret){
						var progress;
						if(api.systemType == 'ios'){
							if(ret.eventType == 'page_begin'){
								progress = 0;
							}else if(ret.eventType == 'page_end'){
								progress = 100;
							}else{
								progress = ret.progress.toString();
								var index = progress.indexOf('.');
								if(index != -1){
									progress = progress.substring(0,index+2);
								}
								progress = progress*1;
								if(progress<0){
									progress=0;
								}
							}
						}else{
							progress = ret.progress*1;
						}
						
					
					}
				});
				
			}else{
				var docReader = api.require('docReader');
				docReader.open({
					path : save_url
				}, function(ret, err) {
					if (ret.status == false) {
						if (api.systemType == 'android') {
							popAlert('对不起，本软件暂时不支持查看文档类文件，请先安装一款全面的办公软件（例：WPS），在查看此文件。');
						}
					}
					
				});
			}
		}
		/*
		*author:zhaoj
		*function:关闭txt插件
		*date：20160316
		*/
		function closeBookReader(){
			bookReader.close();
		}
		/*
		 *author:zhaoj
		 *function:验证网络是否连接着wifi
		 *date：20160302
		 */
		function verifyNetwork(resource_path,file_name,format, type) {
			isOnLineStatus(function(is_true, line_type) {
				if (is_true) {
					if (line_type == 'wifi') {
						judgeType(resource_path,file_name,format, type);
					} else {
						api.confirm({
							title : "提示",
							msg : "您当前正在使用" + line_type + "网络，建议您在wifi网络下播放，是否继续？",
							buttons : ["继续", "取消"]
						}, function(ret, err) {
							var sourceType;
							if (1 == ret.buttonIndex) {
								//根据type来判断打开的是什么类型
								judgeType(resource_path,file_name,format, type);
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

		/*
		 *author:zhaoj
		 *function:根据type来判断是打开视频还是其他
		 *date：20160302
		 */
		function judgeType(resource_path,file_name,format, type) {
			if (type == 1) {
				//打开视频
				openVideo(resource_path,file_name,format);
			} else if (type == 2) {
				//打开音频
				openMusic(resource_path,file_name,format);
			}
		}

		
		function checkurl(down_url,callback){
			var urlPath = "";
			alert(down_url);
			flag=true;
			api.ajax({
	            url:down_url,
	            method : 'get',
	            timeout:30,
	            cache:false
	            
            },function(ret,err){
            	api.hideProgress();
            	if(err.statusCode!='200'){
            		api.alert({
            			msg:"找不到该资源，请联系管理员。"
                    },function(ret,err){
                    });
                    
            	}else{
            		callback();
            	}
            	
            });
            
		}
		/*
		 *author:zhaoj
		 *function:弹出Alert提示框
		 *date：20160302
		 */
		function popAlert(message) {
			api.alert({
				msg : message
			}, function(ret, err) {
			});
		}
		function showSelfProgress(msg) {
			api.showProgress({
				title : msg,
				text : '请稍候...',
				modal : true
			});
		}