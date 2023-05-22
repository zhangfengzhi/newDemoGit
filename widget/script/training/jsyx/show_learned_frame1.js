	var pl_number=1;
	var pxb_id=0;
	var kc_id=0;
	var flag=0;
	var kc_ly="";
	//切换资源列表与评论
	function tabswitch (type) {	
			var col1 = $api.byId('col1');	
			var col2 = $api.byId('col2');	
			var indicator1 = $api.byId("indicator1");	
			var indicator2 = $api.byId("indicator2");	
			var list1 = $api.byId("list1");	
			var list2 = $api.byId("list2");	
			indicator1.style.display = "none";	
			indicator2.style.display = "none";	
			list1.style.display = "none";	
			list2.style.display = "none";	
			col1.style.color = "#000";	
			col2.style.color = "#000";	
			if (type == 1) {	
				col1.style.color = "#34A8FA";	
				indicator1.style.display = "block";	
				list1.style.display = "block";	
				hidechatBox();
				flag=0;
			}else if (type == 2) {	
				col2.style.color = "#34A8FA";	
				indicator2.style.display = "block";	
				list2.style.display = "block";	
				showchatBox();
				flag=1;
			}	
	}	
	//填充数据
	function fillResource(kc_id){
		api.ajax({
		    url: path_url+'/yx/yd/findResourceList',
		    method: 'post',
		    timeout: 30,
		    cache:false,
		    dataTpye:'json',	
		    data:{
		        values: {
					'kc_id': kc_id
		        }			        	
		 	}
		},function(ret,err){
		    if (ret) {
		       var urlJson = JSON.stringify(ret);
		       var txt= $api.strToJson(urlJson);
		       var kcxxDiv=$api.byId("kcxx");
		        var html='<table>';
		       html+='<tr><td class="td1">课程名称 ： </td><td class="td2">'+txt.kcxx[0].KC_NAME+'</td></tr>';
		       html+='<tr><td class="td1">课程课时 ： </td><td class="td2">'+txt.kcxx[0].KC_KS+'分钟</td></tr>';
		       var type=txt.kcxx[0].TYPE;
		       var zz='';
		        if(type==1){
		       		zz="专家姓名 ：";
		       		html+='<tr><td class="td1">课程分类 ：</td><td class="td2"> 专家讲座</td></tr>';
		       }
		       if(type==2){
		       		zz="制做团队 ：";
		       		html+='<tr><td class="td1">课程分类 ：</td><td class="td2"> 网络课程</td></tr>';
		       }
		       if(type==3){
		       		zz="作者姓名 ：";
		       		html+='<tr><td class="td1">课程分类  ： </td><td class="td2">案例分析</td></tr>';
		       }		
		       html+='<tr><td style="align:left; valign:top;" class="td1">'+zz+'</td><td class="td2">'+txt.kcxx[0].KC_ZZ+'</td></tr>';
		       html+='<tr><td class="td1">课程介绍 ：</td><td class="td2">';
		       if(txt.kcxx[0].MEMO==null || txt.kcxx[0].MEMO=='null'){
		       		html+="暂无介绍";
		       }else{
		       		html+=txt.kcxx[0].MEMO;
		       }
		       html+='</td></tr></table>';
		       $api.append(kcxxDiv, html);
		       kc_ly=txt.kcxx[0].FROM_SYSTEM;
		       for(var i=0;i<txt.list.length;i++){
		       		fillVideo(txt.list[i].KCZY_ZYMC,txt.list[i].RESOURCE_ID);
		       }
		    }else {
		        errCode(err.code);
		   }
		});
	}
	//填充课程资源
	function fillVideo(zy_name,zy_id){
		var list1=$api.byId("list1");
		api.ajax({
		    url:path_url+"/yx/mycourse/viewTheResource",
		    method: 'post',
		    timeout: 30,
		    cache:false,
		    dataTpye:'json',	
		    data:{
		        values: {
					id:zy_id
		        }			        	
		 	}
		},function(ret,err){
		    if (ret) {
		       var urlJson = JSON.stringify(ret);
		       var txt= $api.strToJson(urlJson);
		       var list1=$api.byId("list1");
		       for(var i=0;i<txt.list.length;i++){
		       		if(txt.list[i].resource_type_name=='视频'){
						 var html= '<a class="item Fix hightitem" tapmode onclick="open_video(\''+txt.list[i].m3u8_status+'\',\''+txt.list[i].m3u8_url+'\',\''+zy_name+'\')">'	
						            +'<div class="cnt">'	
						            	+'<img class="pic" src="../../../image/training/jsyx/video.jpg">'	
							            +'<div class="wrap">'	
								            +'<div class="wrap2">'	
									            +'<div class="content">'	
									                +'<div class="shopname">'+zy_name+'</div>'	
									            +'</div>'	
								            +'</div>'          	
							            +'</div>'	
						            +'</div>'	
						        +'</a>';	
						 $api.append(list1, html);       
					}
//					if(txt.list[i].resource_format=='pdf'){
//						 var html= '<a class="item Fix hightitem" tapmode onclick="open_pdf(\''+txt.list[i].file_id+'\',\''+txt.list[i].resource_format+'\')">'	
//						            +'<div class="cnt">'	
//						            	+'<img class="pic" src="../../image/training/jsyx/word.jpg">'	
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
		    }else {
		        errCode(err.code);
		   }
		});
	}
	
	function open_video(m3u8_status,m3u8_url,zy_name){
		isOnLineStatus(function(is_online, line_type) {
			if (is_online) {
				if (line_type != 'wifi') {
					api.confirm({
						title : '提示',
							msg : '您当前正在非wifi网络环境下，是否继续使用此功能？',
							buttons : ['继续', '取消']
						}, function(ret, err) {
							if (ret.buttonIndex == 1) {
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
							} else {
								return;
							}
					});
				} else {
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
			}else {
				api.toast({
					    msg: '网络连接失败，请检查您的网络设置',
					    duration:2000,
					    location: 'middle'
					});
			}
		});
	}
	
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
				var url = pdf_url + file_id.substring(0,2) + "/" + file_id + "." + r_format ;	
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
	function fillPL(data){
		api.ajax({
		    url:path_url+"/yx/mycourse/findPL",
		    method: 'post',
		    timeout: 30,
		    cache:false,
		    dataTpye:'json',	
		    data:{
		        values: data	        	
		 	}
		},function(ret,err){
		    if (ret) {
		       var urlJson = JSON.stringify(ret);
		       var txt= $api.strToJson(urlJson);
		       var plDiv=$api.byId("plDiv");
		       if($api.html(plDiv).indexOf("暂无评论")>-1){
		       		$api.html(plDiv, "");  
		       }
		       for(var i=0;i<txt.list.length;i++){
					 var html= '<div class="cnt">'	
							            +'<div class="wrap">'	
								            +'<div class="wrap2">'	
									            +'<div class="content">'	
									                +'<div class="title">'
									                	+txt.list[i].CONTENT
									                +'</div>'	
									                +'<div class="info">'	
									                    +'<span class="symbol">发布人：'+txt.list[i].person_name+'</span>'
									                    +'<span class="symbol" style="margin-left:20px;">发布时间：'+txt.list[i].CREATETIME+'</span>'	
									                +'</div>'	
									            +'</div>'	
								            +'</div>'           	
							            +'</div>'	
						            +'</div>';	      
					 $api.append(plDiv, html);  
		       }
		       if(txt.list.length==0){
		           if($api.html(plDiv)==""){
		       	       $api.append(plDiv,"<div align='center' style='margin-top:50px;'><h3>暂无评论</h3></div>");
		       	   }else{
			  			api.toast({
						    msg: '已加载所有数据',
						    duration:2000,
						    location: 'middle'
						});
			  		}	
		       }
		    }else {
		      errCode(err.code);
		   }
		});
	}
	function sendPL(pl_content){
		var kc_id=api["pageParam"]["kc_id"];
		var pxb_id=api["pageParam"]["pxb_id"];
		if(pl_content.length==0){
			api.alert({msg : "请输入评论内容"});
			return;
		}else if(pl_content.length>200){
			api.alert({msg : "最多输入200个字"});
			return;
		}
		api.ajax({
		    url:path_url+"/yx/yd/sendPL",
		    method: 'post',
		    timeout: 30,
		    cache:false,
		    dataTpye:'json',	
		    data:{
		        values: {
					person_id :$api.getStorage('person_id'),
					content:pl_content,
					kc_id:kc_id,
					pxb_id:pxb_id
		        }       	
		 	}
		},function(ret,err){
		    if (ret) {
		         var urlJson = JSON.stringify(ret);
		         var txt= $api.strToJson(urlJson);
		         var plDiv=$api.byId("plDiv");
		         if($api.html(plDiv).indexOf('暂无评论')>-1){
		         	$api.html(plDiv,'');
		         }
				 var html= '<div class="cnt">'	
						            +'<div class="wrap">'	
							            +'<div class="wrap2">'	
								            +'<div class="content">'	
								                +'<div class="title">'
								                	+pl_content
								                +'</div>'	
								                +'<div class="info">'	
								                    +'<span class="symbol">发布人：'+$api.getStorage('person_name')+'</span>'
								                    +'<span class="symbol">发布时间：'+txt.createtime+'</span>'	
								                +'</div>'	
								            +'</div>'	
							            +'</div>'           	
						            +'</div>'	
					            +'</div>';	      
				 $api.prepend(plDiv, html);    
				 api.toast({
				    msg: '发送成功',
				    duration:2000,
				    location: 'middle'
				 });
		    }else {
		        errCode(err.code);
		   }
		});
	}
	function hidechatBox(){
		 var obj = api.require('inputField');
	     obj.hide();
    }
    function showchatBox(){
		 var obj = api.require('inputField');
	     obj.show();
    }
	apiready = function(){	
		var kc_id=api["pageParam"]["kc_id"];
		var pxb_id=api["pageParam"]["pxb_id"];
		tabswitch(1);	
		fillResource(kc_id);
		var data={
				kc_id : kc_id,
				page_number	: 1,
				page_size : 15,
				pxb_id	: pxb_id
			};
		fillPL(data);
		 api.addEventListener({
			    name:'scrolltobottom',
			    extra:{
			        threshold:0            //设置距离底部多少距离时触发，默认值为0，数字类型
			    }
			},function(ret,err){
				if(flag==1){
					pl_number=pl_number+1;
					data={
						kc_id : kc_id,
						page_number	: pl_number,
						page_size : 15,
						pxb_id	: pxb_id
					};
					fillPL(data);
				}
		});
		var obj = api.require('inputField');
		obj.open({
		    bgColor:'#f5f5f7',
		    lineColor:'#c4c4c6',
		    fileBgColor:'#fdfdfe',
		    borderColor:'#acaeb2',
		    sendImg:'widget://image/training/jsyx/fs-btn.png',
		    placeholder:'请输入评论'
		},function(ret,err) { 
		    sendPL(ret.msg);
		});
		hidechatBox();
	}	