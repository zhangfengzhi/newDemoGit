	var zx_number=1;
    var header_h;
    //填充课程
    function fillCourse(){
	    var data={
				    page_number	: 1,
					page_size :15,
		    		person_id:$api.getStorage("person_id")
					
			    };
		findCourse(data,'init');		
		
	}	 
	function startSearch(type){
			commonSearch(type,function(data){
				 var data1={
				 		page_number:1,
		    			page_size:15,
		    			person_id:$api.getStorage("person_id"),
		    			course_name:Base64.decode(data)
				 };
				findCourse(data1,'init');
				api.hideProgress();
			})
		}
	//查询课程   
    function findCourse(data,init){
    	isOnLineStatus(function(is_online, line_type) {
			if (is_online) {
		    	api.showProgress({
					title : '加载中...',
					text : '请稍候...',
					modal : false
				});
				api.ajax({
					    url: path_url+'/yx/pxclass/studentCourseList',
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
					       var kcDiv=$api.byId("kcDiv_zx");
					      
					       if(init=='init'){
					       		$api.html(kcDiv,'');
					       }
					       if($api.html(kcDiv).indexOf("暂无课程")>-1){
			       		   	    $api.html(kcDiv, "");  
			       	   	   }
					        for(var i=0;i<txt.list.length;i++){
					        var index=Math.ceil(Math.random()*9);
					         var html='<a href="javascript:void(0);" class="item Fix hightitem" tapmode onclick="openCourse(\''+txt.list[i].course_id+'\',\''+txt.list[i].course_name+'\');">'
					            		+'<div class="cnt">'
						            		//+'<img class="pic" src="../../../image/training/jsyx/js_s'+index+'.jpg">'	
							            	+'<div class="wrap">'	
								            	+'<div class="wrap2">'	
									            	+'<div class="content">'	
									                	+'<div class="shopname">'+txt.list[i].course_name+'</div>'	
									                	+'<div class="comment">'	
									                    	+'<span>课程时间 ：'+	txt.list[i].start_time+'——'+txt.list[i].end_time+'</span>'	
									                	+'</div>'	
									                	+'<span class="classify" id="ljsj'+txt.list[i].course_id+'">授课教师 ：'+txt.list[i].person_name
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
						      		$api.append(kcDiv,"<div align='center' style='margin-top:50px;'><h3>暂无课程</h3></div>");
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
	
	function openCourse(course_id,course_name){
		api.openWin ({
			name: 'show_course_live_window',
			url: './show_course_live_window.html',
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
				course_id :course_id,
				course_name : course_name,
				header_h : header_h
			}
		});
	}
	
    apiready = function(){
       header_h=api.pageParam.header_h;
       fillCourse();
       api.addEventListener({
		    name:'scrolltobottom',
		    extra:{
		        threshold:0            //设置距离底部多少距离时触发，默认值为0，数字类型
		    }
		},function(ret,err){
			data={
				page_number	: 1,
				page_size :15,
				person_id:$api.getStorage("person_id")
			};
			zx_number=zx_number+1;
			data.page_number=zx_number;
			
		    findCourse(data,'');
		});
		
    };