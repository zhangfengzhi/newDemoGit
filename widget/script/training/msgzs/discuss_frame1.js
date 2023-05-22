	var is_bx=1;
    var page_number=1;
    var xx_number=1;
    var header_h;
    var gzs_id;
    var rg_id;
    //填充帖子
    function fillNotice(){
		//alert(gzs_id);
	    var data={
				   // is_bx : 1,
					page_number	: 1,
					page_size :15,
					tlqybk_id:gzs_id,
					qybh:301226
					//pxb_id :pxb_id,
					//person_id:$api.getStorage("person_id")
			    };
		findNotice(data,'init');		
		
	}	 
	//查询帖子  
    function findNotice(data,init){
    	isOnLineStatus(function(is_online, line_type) {
			if (is_online) {
		    	api.showProgress({
					title : '加载中...',
					modal : false
				});
				
				api.ajax({
					    url: path_url+'/yx/pxtl/ftManagePage?random_num='+Math.random(),
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
					       var kcDiv;
					       kcDiv=$api.byId("ntcDiv");
					       if(init=='init'){
					       		$api.html(kcDiv,'');
					       }
					       if($api.html(kcDiv).indexOf("暂无讨论帖")>-1){
			       		   	    $api.html(kcDiv, "");  
			       	   	   }
					        for(var i=0;i<txt.list.length;i++){
					        var index=Math.ceil(Math.random()*9);
					      
					         var html='<a href="javascript:void(0);" class="item Fix hightitem" tapmode onclick="openNotice('+txt.list[i].id+',\''+txt.list[i].title+'\');">'
					            		+'<div class="cnt">'
						            		//+'<img class="pic" src="../../../image/yingyong/jsyx/js_s'+index+'.jpg">'	
							            	+'<div class="wrap">'	
								            	+'<div class="wrap2">'	
									            	+'<div class="content">'	
									                	+'<div class="shopname">'+txt.list[i].title+'</div>'	
									                	+'<div class="comment">'
									                    	+'<span>发帖人：'+txt.list[i].person_name+'&nbsp;&nbsp;&nbsp;回复数：'+txt.list[i].htcount+'</span>'	
									                	+'</div>'	
									                	+'<span class="classify" id="ljsj'+txt.list[i].id+'">发布时间 ：'+	txt.list[i].ftsj
									                	+'</span>'	
									            	+'</div>'	
								            	+'</div>'           	
							           		+'</div>'	
					            		+'</div>'	
					        		+'</a>';
							  $api.append(kcDiv,html);
					       }
					        api.hideProgress(); 
					        if(txt.list.length==0){//说明没查出，需要判断原有div里边是否有，如果有，那么什么都不做，如果没有，加上没有培训班的提示。
						  		var n=$api.html(kcDiv);
						   		if(n==null||n==""){			      
						      		$api.append(kcDiv,"<div align='center' style='margin-top:50px;'><h3>暂无讨论帖</h3></div>");
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
	function openNotice(notice_id,notice_title){
		$api.val($api.byId("clickNotice"),notice_id);
	
		api.openWin ({
		name: 'discuss_content_window',
		url: './discuss_content_window.html',
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
			discuss_id :notice_id,
			title : notice_title,
			header_h : header_h,
			gzs_id:gzs_id
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
       gzs_id=api.pageParam.org_id;
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
				tlqybk_id:gzs_id,
				qybh:301226
				//pxb_id :pxb_id,
				//person_id:$api.getStorage("person_id")
			};
			
				page_number=page_number+1;
				data.page_number=page_number;
				findNotice(data);
		});
		
    };