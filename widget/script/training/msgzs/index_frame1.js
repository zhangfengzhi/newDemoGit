	var is_bx=1;
    var bx_number=1;
    var xx_number=1;
    var header_h;
    var person_id=$api.getStorage("person_id");
	//查询工作室
    function findCourse(data,type,init){
    	var urls='/yx/team/getOrgTeamList';
    	
    	isOnLineStatus(function(is_online, line_type) {
			if (is_online) {
		    	api.showProgress({
					title : '加载中...',
					modal : false
				});
				api.ajax({
					    url: path_url+urls,
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
					       //alert(urlJson);
					       var txt= $api.strToJson(urlJson);
					       var kcDiv;
					       kcDiv=$api.byId("kcDiv_bx");
					       if(init=='init'){
					       		$api.html(kcDiv,'');
					       }
					       if($api.html(kcDiv).indexOf("暂无工作室")>-1){
			       		   	    $api.html(kcDiv, "");  
			       	   	   }
			       	   	   //alert(urlJson);
			       	   	   //alert(txt.list);
					        for(var i=0;i<txt.list.length;i++){
					        var index=Math.ceil(Math.random()*9);
					        var isadmin=0;
					        
					        var role_name="角色：普通成员";
					        if(txt.list[i]&&person_id==txt.list[i].person_id){
					        	role_name="角色：创建者";
					        	isadmin=1;
					        }else{
					        	var g_id=txt.list[i].obj_info_id;
					        	api.ajax({
								    url: path_url+'/group/queryGroupById?random_num='+Math.random()+'&groupId='+g_id,
								    method: 'post',
								    timeout: 30,
								    cache:false,
								    dataTpye:'json'
								},function(ret,err){
								    if (ret) {
								    	 var urlJson1 = JSON.stringify(ret);
								       	 var txt1= $api.strToJson(urlJson1);
								       	 for(var j=0;j<txt1.list_person.length;j++){
								       	 	if(person_id==txt1.list_person[j]){
								       	 		role_name="角色：管理员";
								       	 		isadmin=1;
								       	 	}
								       	 }
								    }
								   });
					        }
					     role_name="学科学段："+txt.list[i].subject_name;
					         var html='<a href="javascript:void(0);" class="item Fix hightitem" tapmode onclick="openCourse('+txt.list[i].obj_info_id+','+isadmin+',\''+txt.list[i].obj_name+'\');">'
					            		+'<div class="cnt">'
						            		+'<img class="pic" src="../../../image/tongxunlu/defaultgroup.png">'	
							            	+'<div class="wrap">'	
								            	+'<div class="wrap2">'	
									            	+'<div class="content">'	
									                	+'<div class="shopname">'+txt.list[i].obj_name+'</div>'	
									                	+'<div class="comment">'	
									                    	+'<span>创建人 ：'+txt.list[i].person_name+'</span>'	
									                	+'</div>'	
									                	+'<span class="classify" id="ljsj'+txt.list[i].obj_info_id+'">'+	role_name
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
						      		$api.append(kcDiv,"<div align='center' style='margin-top:50px;'><h3>暂无工作室</h3></div>");
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
	//查询我的工作室
	 function findMyCourse(data,type,init){
    	var urls='/yx/team/getGzs';
    	
    	isOnLineStatus(function(is_online, line_type) {
			if (is_online) {
		    	api.showProgress({
					title : '加载中...',
					modal : false
				});
				api.ajax({
					    url: path_url+urls,
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
					       //alert(urlJson);
					       var txt= $api.strToJson(urlJson);
					       var kcDiv;
					       
					       		kcDiv=$api.byId("kcDiv_xx");
					      
					       if(init=='init'){
					       		$api.html(kcDiv,'');
					       }
					       if($api.html(kcDiv).indexOf("暂无工作室")>-1){
			       		   	    $api.html(kcDiv, "");  
			       	   	   }
			       	   	   //alert(urlJson);
			       	   	   //alert(txt.list);
					        for(var i=0;i<txt.rows.length;i++){
					        var index=Math.ceil(Math.random()*9);
					        var isadmin=0;
					        
					        var role_name="角色：普通成员";
					        if(txt.rows[i]&&person_id==txt.rows[i].CREATOR_ID){
					        	role_name="角色：创建者";
					        	isadmin=1;
					        }else{
					        	var g_id=txt.rows[i].ID;
					        	api.ajax({
								    url: path_url+'/group/queryGroupById?random_num='+Math.random()+'&groupId='+g_id,
								    method: 'post',
								    timeout: 30,
								    cache:false,
								    dataTpye:'json'
								},function(ret,err){
								    if (ret) {
								    	 var urlJson1 = JSON.stringify(ret);
								       	 var txt1= $api.strToJson(urlJson1);
								       	 for(var j=0;j<txt1.list_person.length;j++){
								       	 	if(person_id==txt1.list_person[j]){
								       	 		role_name="角色：管理员";
								       	 		isadmin=1;
								       	 	}
								       	 }
								    }
								   });
					        }
					        
					         var html='<a href="javascript:void(0);" class="item Fix hightitem" tapmode onclick="openCourse('+txt.rows[i].ID+','+isadmin+',\''+txt.rows[i].GROUP_NAME+'\');">'
					            		+'<div class="cnt">'
						            		+'<img class="pic" src="../../../image/tongxunlu/defaultgroup.png">'	
							            	+'<div class="wrap">'	
								            	+'<div class="wrap2">'	
									            	+'<div class="content">'	
									                	+'<div class="shopname">'+txt.rows[i].GROUP_NAME+'</div>'	
									                	+'<div class="comment">'	
									                    	+'<span>创建人 ：'+txt.rows[i].CREATOR_NAME+'</span>'	
									                	+'</div>'	
									                	+'<span class="classify" id="ljsj'+txt.rows[i].ID+'">'+	role_name
									                	+'</span>'	
									            	+'</div>'	
								            	+'</div>'           	
							           		+'</div>'	
					            		+'</div>'	
					        		+'</a>';
					        if(txt.rows[i].PLAT_TYPE_OTHER==1 ){
							  $api.append(kcDiv,html);
							  }
					       }
					        api.hideProgress(); 
					        if(txt.rows.length==0){//说明没查出，需要判断原有div里边是否有，如果有，那么什么都不做，如果没有，加上没有培训班的提示。
						  		var n=$api.html(kcDiv);
						   		if(n==null||n==""){			      
						      		$api.append(kcDiv,"<div align='center' style='margin-top:50px;'><h3>暂无工作室</h3></div>");
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
	//填充选项
	function fillPxb(){
		/*api.ajax({
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
			       		fillCourse();
			       }
			    }else {
			       errCode(err.code);
			   }
		});*/
	}
	//切换工作室类别
	function changeDiv(label){
		var flag=$api.hasCls(label, "title_left");
		var kcDiv_bx=$api.byId("kcDiv_bx");
		var kcDiv_xx=$api.byId("kcDiv_xx");
		var selectdiv=$api.byId("selectdiv");
		if(flag){
			$api.addCls($api.byId("title_left"), "bg");
			$api.removeCls($api.byId("title_right"), 'bg');
			$api.css(kcDiv_bx,"display:block;");
			$api.css(kcDiv_xx,"display:none;");
			$api.css(selectdiv,"display:none;");
		}else{	
			$api.addCls($api.byId("title_right"), "bg");
			$api.removeCls($api.byId("title_left"), 'bg');
			$api.css(kcDiv_bx,"display:none;");
			$api.css(kcDiv_xx,"display:block;");
			//$api.css(selectdiv,"display:block;");
		}
	}
	//切换选项
	function changePxb(){
		fillCourse();
		//$api.addCls($api.byId("title_left"), "bg");
		//$api.removeCls($api.byId("title_right"), 'bg');
	}
	function openCourse(id,type,name){
		
		api.openWin ({
		name: 'menu_window',
		url: './menu_window.html',
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
			org_id :id,
			org_type :107,
			org_name :name,
			isadmin:type,
			header_h : header_h
		}
	});
	}
	
	function updateCourseTime(){
		/*var courseId=$api.val($api.byId("clickCourse"));
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
       //fillPxb()
       fillCourse();
       api.addEventListener({
		    name:'scrolltobottom',
		    extra:{
		        threshold:0            //设置距离底部多少距离时触发，默认值为0，数字类型
		    }
		},function(ret,err){
		
			var data;
			if(is_bx==1){
				 bx_number=bx_number+1;
				data={
					
					hj_id:1,
					org_id:301226,
					page_number	: bx_number,
					pageSize :15
					
				};
				findCourse(data,is_bx);
			}else{
			    xx_number=xx_number+1;
			    data={
				
				identity_id:5,
				pageNumber	: xx_number,
				pageSize :15,
				person_id:person_id
				};
			 	findMyCourse(data,is_bx);
			}
		    
		});
		
    };
     //填充工作室
    function fillCourse(){
	    var pxbSelect=$api.byId("pxbSelect");
	    var member_type=$api.val(pxbSelect);
	    var data={
	    			hj_id:1,
					org_id:301226,
					page_number	: 1,
					pageSize :15
					};  	
		findCourse(data,1,'init');		
		data={
					identity_id:5,
					pageNumber	: 1,
					pageSize :15,
					person_id:person_id
					};
		findMyCourse(data,0,'init');	
		var kcDiv_bx=$api.byId("kcDiv_bx");
		var kcDiv_xx=$api.byId("kcDiv_xx");	
		//$api.css(kcDiv_bx,"display:block;");
		//$api.css(kcDiv_xx,"display:none;");
	}	