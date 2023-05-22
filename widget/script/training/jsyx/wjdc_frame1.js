	var is_bx=1;
    var page_number=1;
    var xx_number=1;
    var header_h;
    var gzs_id;

    //填充通知
    function fillNotice(){

	    var data={
				   // is_bx : 1,
					page_number	: 1,
					page_size :15,
					
					//pxb_id :pxb_id,
					//person_id:$api.getStorage("person_id")
			    };
		findNotice(data,'init');		
		
	}	 
	//查询通知  
    function findNotice(data,init){
    	isOnLineStatus(function(is_online, line_type) {
			if (is_online) {
		    	api.showProgress({
					title : '加载中...',
					text : '请稍候...',
					modal : false
				});
				//alert(path_url+'/yx/qnpaper/qnpaperCurrPage?page_number='+data.page_number+'&page_size='+data.page_size+'&state=1&is_pause=0&curr_state=1&person_id=' + $api.getStorage("person_id") + '&random='+Math.random());
				api.ajax({
					    url: path_url+'/yx/qnpaper/qnpaperCurrPage?page_number='+data.page_number+'&page_size='+data.page_size+'&state=1&is_pause=0&curr_state=1&person_id=' + $api.getStorage("person_id") + '&random='+Math.random(),
					    method: 'get',
					    timeout: 30,
					    cache:false,
					    dataTpye:'json',
					    headers : {
							'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
						}
					},function(ret,err){
						
					    if (ret) {
					       var urlJson = JSON.stringify(ret);
					      //alert(urlJson);
					       var txt= $api.strToJson(urlJson);
					       var kcDiv;
					       kcDiv=$api.byId("ntcDiv");
					       if(init=='init'){
					       		$api.html(kcDiv,'');
					       }
					       if($api.html(kcDiv).indexOf("暂无调查问卷")>-1){
			       		   	    $api.html(kcDiv, "");  
			       	   	   }
					        for(var i=0;i<txt.list.length;i++){
					        var index=Math.ceil(Math.random()*9);
					      
					         var html='<a href="javascript:void(0);" class="item Fix hightitem" tapmode onclick="openNotice('+txt.list[i].id+',\''+txt.list[i].title+'\');">'
					            		+'<div class="cnt">'
						            		//+'<img class="pic" src="../../../image/training/jsyx/js_s'+index+'.jpg">'	
							            	+'<div class="wrap">'	
								            	+'<div class="wrap2">'	
									            	+'<div class="content">'	
									                	+'<div class="shopname">'+txt.list[i].title+'</div>'	
									                	+'<div class="comment">'
									                    	+'<span>问题数：'+txt.list[i].qa_num+'</span>'	
									                	+'</div>'	
									                	+'<span class="classify" id="ljsj'+txt.list[i].id+'">有效时间 ：'+	txt.list[i].start_time+'至'+	txt.list[i].end_time
									                	+'</span>'	
									            	+'</div>'	
								            	+'</div>'           	
							           		+'</div>'	
					            		+'</div>'	
					        		+'</a>';
							  $api.append(kcDiv,html);
					       }
					        api.hideProgress(); 
					        if(txt.list.length==0){//说明没查出信息，需要判断原有div里边是否有信息，如果有，那么什么都不做，如果没有，加上没有培训班的提示信息。
						  		var n=$api.html(kcDiv);
						   		if(n==null||n==""){			      
						      		$api.append(kcDiv,"<div align='center' style='margin-top:50px;'><h3>暂无调查问卷</h3></div>");
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
			}else {
				api.alert({
					msg : '网络连接失败，请检查您的网络设置'
				}, function(ret, err) {
				});
			}
		});			
	}	
	//填充培训班
	function fillPxb(){
	/*	api.ajax({
			    url: path_url+'/yx/yd/findMyPXBList',
			    method: 'post',
			    timeout: 30,
			    cache:false,
			    dataTpye:'json',	
			    data:{
			        values: {
						'person_id':$api.getStorage("person_id"),
						'pxb_guoqi': 0
			        }			        	
			 	}
			},function(ret,err){
			    if (ret) {
			       var urlJson = JSON.stringify(ret);
			       var txt= $api.strToJson(urlJson);
			       var pxbSelect=$api.byId("pxbSelect");
			       for(var i=0;i<txt.list.length;i++){
			       var html='<option  value="'+txt.list[i].ID+'">'+txt.list[i].PXB_NAME+'</option>';
					  $api.append(pxbSelect,html);
			       }
			       if(txt.list.length==0){
			       		$api.append(pxbSelect,'<option>暂无加入的培训班</option>');
			       }else{
			       		fillNotice();
			       }
			    }else {
			       errCode(err.code);
			   }
		});*/
	}
	
	//切换班级
	function changePxb(){
		fillNotice();
		//$api.addCls($api.byId("title_left"), "bg");
		//$api.removeCls($api.byId("title_right"), 'bg');
	}
	function openNotice(wjdc_id,wjdc_title){
		$api.val($api.byId("clickNotice"),wjdc_id);
		api.ajax({
					    url: path_url+'/yx/qnpaper/qnpaperInfo?random='+Math.random(),
					    method: 'post',
					    timeout: 30,
					    cache:false,
					    dataTpye:'json',
					    data:{values:{"id":wjdc_id}},
					    headers : {
							'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
						}
					},function(ret,err){
						if(ret){
							var urlJson = JSON.stringify(ret);
					      
					       var txt= $api.strToJson(urlJson);
					       var curr_state=txt.curr_state;
							if(null!=curr_state&&curr_state=="0"){
								api.toast({
									    msg: '问卷未开始',
									    duration:2000,
									    location: 'middle'
									});
								
								return false;
							}
							if(null!=curr_state&&curr_state=="2"){
								api.toast({
									    msg: '问卷已结束',
									    duration:2000,
									    location: 'middle'
									});
								
								return false;
							}
							var is_pause=txt.is_pause;
							if(null!=is_pause&&is_pause=="1"){
								api.toast({
									    msg: '问卷已暂停,请联系管理员！',
									    duration:2000,
									    location: 'middle'
									});
								
								
								return false;
							}
							var is_delete=txt.is_delete;
							if(null!=is_delete&&is_delete=="1"){
								api.toast({
									    msg: '问卷已删除,请联系管理员！',
									    duration:2000,
									    location: 'middle'
									});
								
								
								return false;
							}
						 }else {
					       errCode(err.code);
					   }
					});
		api.ajax({
					    url: path_url+'/yx/qnpaper/qnanswerNum?random='+Math.random(),
					    method: 'post',
					    timeout: 30,
					    cache:false,
					    dataTpye:'json',
					    data:{values:{qnpaper_id:wjdc_id}},
					    headers : {
							'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
						}
					},function(ret,err){
						//alert(ret);
						if(ret){
							var urlJson = JSON.stringify(ret);
				       		var txt= $api.strToJson(urlJson);
				       		if(txt.ans_num&&txt.ans_num<=0){
				       			api.openWin ({
									name: 'show_dcwj_window',
									url: './show_dcwj_window.html',
									bounces : false,
											opaque : false,
											showProgress : false,
											vScrollBarEnabled : false,
											hScrollBarEnabled : false,
											slidBackEnabled : false,
											delay : 0,
											animation : {
												type : "reveal", //动画类型（详见动画类型常量）
												subType : "from_right", //动画子类型（详见动画子类型常量）
												duration : 300
											},
									pageParam: {
										wjdc_id :wjdc_id,
										title : wjdc_title,
										header_h : header_h
									}
								});
				       		}else{
				       			api.openWin ({
									name: 'show_dcwj_result_window',
									url: './show_dcwj_result_window.html',
									bounces : false,
											opaque : false,
											showProgress : false,
											vScrollBarEnabled : false,
											hScrollBarEnabled : false,
											slidBackEnabled : false,
											delay : 0,
											animation : {
												type : "reveal", //动画类型（详见动画类型常量）
												subType : "from_right", //动画子类型（详见动画子类型常量）
												duration : 300
											},
									pageParam: {
										wjdc_id :wjdc_id,
										title : wjdc_title,
										header_h : header_h
									}
								});
				       		}
				       		
				       		 }else {
					       errCode(err.code);
					   }
					});
		
	}
	
	function updateCourseTime(){
		/*var courseId=$api.val($api.byId("clickNotice"));
		if(courseId!=""){
			var data={
		    			kc_id:courseId,
		    			pxb_id:$api.val($api.byId("pxbSelect")),
						person_id:$api.getStorage('person_id')
				    };
			api.ajax({
				    url: path_url+'/yx/yd/findMyCourseLjsj',
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
				    	$api.html($api.byId("ljsj"+courseId),'累计学习时间 ：'+txt.list[0].ljsj+'分钟');
				    }else {
				        errCode(err.code);
				   }
			});
		}*/
	}
    apiready = function(){
       header_h=api.pageParam.header_h;
       
     fillNotice();
      api.addEventListener({
		    name:'scrolltobottom',	
		    extra:{
		        threshold:0            //设置距离底部多少距离时触发，默认值为0，数字类型
		    }
		},function(ret,err){
			//ar pxbSelect=$api.byId("pxbSelect");
	    	//ar pxb_id=$api.val(pxbSelect);
			data={
				page_number	: 1,
				page_size :15,
				//pxb_id :pxb_id,
				//person_id:$api.getStorage("person_id")
			};
			
				page_number=page_number+1;
				data.page_number=page_number;
				findNotice(data);
		});
		
    };