	var pl_number=1;
	var pxb_id=0;
	var kc_id=0;
	var flag=0;
	var interval_id = null;
	var maxTime=0;
	var minTime=0;
	var kc_ks=0;
	var ljsj_has="";
	var ljsj_from=0;
	var start_time=0;
	var stop_time=0;
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
	function fillResource(kc_id,pxb_id){
		api.ajax({
		    url: path_url+'/yx/yd/findMyCourseDetail',
		    method: 'post',
		    timeout: 30,
		    cache:false,
		    dataTpye:'json',	
		    data:{
		        values: {
					'kc_id': kc_id,
					'person_id':$api.getStorage('person_id'),
					'pxb_id':pxb_id
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
		       		html+='<tr><td class="td1">课程分类 ： </td><td class="td2">案例分析</td></tr>';
		       }		
		       html+='<tr><td style="align:left; valign:top;" class="td1">'+zz+'</td><td class="td2">'+txt.kcxx[0].KC_ZZ+'</td></tr>';
		       html+='<tr><td class="td1">课程介绍 ：</td><td class="td2">';
		       if(txt.kcxx[0].MEMO==null || txt.kcxx[0].MEMO=='null'){
		       		html+="暂无介绍";
		       }else{
		       		html+=txt.kcxx[0].MEMO;
		       }
		       html+='</td></tr><tr><td ><div class="updatetime" onclick="updateAll()"></div> </td><td style="color:red;font-size:12px;vertical-align:middle;">注意：学习完成后关闭前请更新学习时间</td></tr></table>';
		       $api.append(kcxxDiv, html);
		       for(var i=0;i<txt.list.length;i++){
		       		fillVideo(txt.list[i].KCZY_ZYMC,txt.list[i].RESOURCE_ID);
		       }
		       kc_ly=txt.kcxx[0].FROM_SYSTEM;
		       maxTime=parseInt(txt.maxTime);
			   minTime=parseInt(txt.minTime);
			   kc_ks=parseInt(txt.kc_ks);
			   ljsj=parseInt(txt.ljsj);
			   ljsj_from=parseInt(txt.ljsj);
			   var date_start=new Date();
			   start_time=date_start.getTime();
			   ljsj_has=txt.ljsj_has;
			   if(ljsj<kc_ks){
			       executeTime();
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
//		       alert(urlJson);
		       var txt= $api.strToJson(urlJson);
		       var list1=$api.byId("list1");
		       for(var i=0;i<txt.list.length;i++){
		       		if(txt.list[i].resource_type_name=='视频'){
						 var html= '<a class="item Fix hightitem" tapmode onclick="zbopen_video(\''+txt.list[i].m3u8_status+'\',\''+txt.list[i].m3u8_url+'\',\''+zy_name+'\')">'	
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
					}else{
						 var format=txt.list[i].resource_format;
						 var img='other.jpg';
						 if (format == 'jpg' || format == 'jpeg' || format == 'png' || format == 'bmp') {
							img='pic.jpg';
						} else if (format == 'doc' || format == 'docx'  ) {
							img='word.jpg';
						} else if (format == 'ppt' || format == 'pptx' ) {
							img='ppt.jpg';
						} else if (format == 'txt') {
							img='txt.jpg';
						} else if (format == 'xls' || format == 'xlsx' ) {
							img='excel.jpg';
						} else if(format == 'pdf'){
							img='pdf.jpg';
						} else if (format == 'mp3' || format == 'wav' || format == 'wma') {
							img='voice.jpg';
						} 
						 var html= '<a class="item Fix hightitem" tapmode onclick="openContent(\''+txt.list[i].file_id+'\',\''+txt.list[i].resource_title+'\','+txt.list[i].preview_status+','+txt.list[i].m3u8_status+',\''+txt.list[i].resource_format+'\',\''+txt.list[i].resource_id_int+'\')">'	
						            +'<div class="cnt">'
						            	+'<img class="pic" src="../../../image/training/jsyx/'+img+'">'	
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
		       }
		    }else {
		        errCode(err.code);
		   }
		});
	}
	/*
	*author:zhaoj
	*function:查看内容
	*date：20170329
	*/
	function openContent(file_id,title,preview_status,m3u8_status,resource_format,resource_id_int){
//		alert(resource_format);
		if(preview_status == 0 &&　!(resource_format == 'doc' || resource_format == 'docx' || resource_format == 'ppt' || resource_format == 'pptx' || resource_format == 'xls' || resource_format == 'xlsx' )){
			popAlert('对不起，正在生成预览中，请稍候查看。');
		}else if(preview_status == 1){
			common_openResource.open(resource_format,file_id,title,m3u8_status,api.winName,'reBackType("voice","","");','back();',resource_id_int);
		}else{
			if(resource_format == 'doc' || resource_format == 'docx' || resource_format == 'ppt' || resource_format == 'pptx' || resource_format == 'xls' || resource_format == 'xlsx' ){
                        common_openResource.open(resource_format,file_id,title,m3u8_status,api.winName,'reBackType("voice","","");','back();',resource_id_int);
            }else{
                popAlert('对不起，该文件生成预览失败。');
            }
		}
	}
	//打开视频前检查网络
	function zbopen_video(m3u8_status,m3u8_url,zy_name){
		isOnLineStatus(function(is_online, line_type) {
			if (is_online) {
				if (line_type != 'wifi') {
						api.confirm({
							title : '提示',
								msg : '您当前正在非wifi网络环境下，是否继续使用此功能？',
								buttons : ['继续', '取消']
							}, function(ret, err) {
								if (ret.buttonIndex == 1) {
									open_video(m3u8_status,m3u8_url,zy_name);
								} else {
									return;
								}
						});
					} else {	
						open_video(m3u8_status,m3u8_url,zy_name);
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
	
	
	
	/**
	 * 填充评论
	 */
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
									                    +'<span class="symbol">发布人：'+txt.list[i].person_name+'</span>&nbsp;&nbsp;&nbsp;&nbsp;'
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
	/**
	 * 发送评论
	 */
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
								                    +'<span class="symbol">发布人：'+$api.getStorage('person_name')+'</span>&nbsp;&nbsp;&nbsp;&nbsp;'
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
	
	
	/**
	 * 计算时间
	 */
	function executeTime(){
		interval_id = setTimeout("tipOfUpdate()",minTime*60*1000);
	}
	/**
	* 向服务器发请求更新学时
	*/
	function tipOfUpdate(){
		var zsj=parseInt(ljsj+minTime);
		var time=0;
		if(zsj>=kc_ks){
			time=kc_ks;
		}else{
			time=zsj;
		}
		var kc_id=api["pageParam"]["kc_id"];
		var pxb_id=api["pageParam"]["pxb_id"];
		api.ajax({
		    url:path_url+"/yx/yd/updateLjsj.lua",
		    method: 'post',
		    timeout: 30,
		    cache:false,
		    dataTpye:'json',	
		    data:{
		        values: {
					person_id :$api.getStorage('person_id'),
					time:time,
					ljsj_has:ljsj_has,
					studyType:1,
					kc_id:kc_id,
					pxb_id:pxb_id
		        }       	
		 	}
		},function(ret,err){
		    if (ret) {
				ljsj_has="yes";
				ljsj=time;
				if(time>=kc_ks){//已学完本课程
					//清除之前的计时
					window.clearTimeout(interval_id);
				}else{//未学完本课程
					//清除之前的计时
					window.clearTimeout(interval_id);
					//继续计时提示
					executeTime();	
				}
			}else {
		        errCode(err.code);
		    }
		});	
	}
	/**
	* 向服务器发请求更新学时
	*/
	function updateAll(){
		var date_stop=new Date();
		stop_time=date_stop.getTime();
		var timepass=parseInt((stop_time-start_time)/(60*1000));
		if(timepass<1){
			api.toast({
			    msg: '更新时间太频繁，请稍后再试',
			    duration:2000,
			    location: 'middle'
			 });
			 return;
		}
		var zsj=ljsj_from+timepass;
		var time=0;
		if(zsj>=kc_ks){
			time=kc_ks;
		}else{
			time=zsj;
		}
		var kc_id=api["pageParam"]["kc_id"];
		var pxb_id=api["pageParam"]["pxb_id"];
		api.ajax({
		    url:path_url+"/yx/yd/updateLjsj.lua",
		    method: 'post',
		    timeout: 30,
		    cache:false,
		    dataTpye:'json',	
		    data:{
		        values: {
					person_id :$api.getStorage('person_id'),
					time:time,
					ljsj_has:ljsj_has,
					studyType:1,
					kc_id:kc_id,
					pxb_id:pxb_id
		        }       	
		 	}
		},function(ret,err){
		    if (ret) {
				ljsj_has="yes";
				ljsj=time;
				ljsj_from=time;
				api.toast({
				    msg: '成功更新了'+timepass+'分钟学习时间',
				    duration:2000,
				    location: 'middle'
				});
				if(time>=kc_ks){//已学完本课程
					//清除之前的计时
					window.clearTimeout(interval_id);
				}else{//未学完本课程
					//清除之前的计时
					window.clearTimeout(interval_id);
					//继续计时提示
					executeTime();	
				}
			}else {
		        errCode(err.code);
		    }
		});	
	}
	/**
	 *隐藏输入评论框 
	 */
	function hidechatBox(){
		 var obj = api.require('inputField');
	     obj.hide();
    }
    /**
	 *显示输入评论框 
	 */
    function showchatBox(){
		 var obj = api.require('inputField');
	     obj.show();
    }
	
	apiready = function(){	
		var kc_id=api["pageParam"]["kc_id"];
		var pxb_id=api["pageParam"]["pxb_id"];
		tabswitch(1);	
		fillResource(kc_id,pxb_id);
		var data={
				kc_id : kc_id,
				page_number	: 1,
				page_size : 15,
				pxb_id	: pxb_id
			};
		fillPL(data);
		//监听向下滑动加载更多
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
		//加载输入模块
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