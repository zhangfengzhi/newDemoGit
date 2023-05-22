var number=1; 
	    //填充课程
	    function fillCourse(){
		    var data={
						page_number	: 1,
						page_size :15,
						person_id:$api.getStorage('person_id')
				    };
			findCourse(data);
		}	 
		//查询课程   
	    function findCourse(data){
	    	isOnLineStatus(function(is_online, line_type) {
				if (is_online) {
					api.showProgress({
						title : '加载中...',
						text : '请稍候...',
						modal : false
					});
					api.ajax({
						    url: path_url+'/yx/yd/zzxxYXCourse',
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
						       var kcDiv=$api.byId("kcDiv");
						       if($api.html(kcDiv).indexOf("暂无学习情况")>-1){
				       		   	    $api.html(kcDiv, "");  
				       	   	   }
						        for(var i=0;i<txt.list.length;i++){
						         var index=Math.ceil(Math.random()*9);
						         var html='<a href="javascript:void(0);" class="item Fix hightitem" tapmode onclick="openCourse('+txt.list[i].id+',\''+txt.list[i].kc_name+'\');">'
						            		+'<div class="cnt">'
							            		+'<img class="pic" src="../../../image/training/jsyx/js_s'+index+'.jpg">'	
								            	+'<div class="wrap">'	
									            	+'<div class="wrap2">'	
										            	+'<div class="content">'	
										                	+'<div class="shopname">'+txt.list[i].kc_name+'</div>'	
										                	+'<div class="comment">'	
										                    	+'<span>课时 ：'+txt.list[i].kc_ks+'分钟</span>'	
										                	+'</div>'	
										                	+'<span class="classify" id="ljsj'+txt.list[i].id+'">'	
										                		+'累计学习时间 ：'+	txt.list[i].ljsj
										                	+'分钟</span>'	
										            	+'</div>'	
									            	+'</div>'           	
								           		+'</div>'	
						            		+'</div>'	
						        		+'</a>';
								  $api.append(kcDiv,html);
						       }
						       api.hideProgress();
						       if(txt.list.length==0){
						           if($api.html(kcDiv)==""){
						       	       $api.append(kcDiv,"<div align='center' style='margin-top:50px;'><h3>暂无学习情况</h3></div>");
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
						api.toast({
						    msg: '网络连接失败，请检查您的网络设置',
						    duration:2000,
						    location: 'middle'
						});
					}
				});	
		}	
		//进入课程详细页
		function openCourse(kc_id,kc_name){
		  $api.val($api.byId("clickCourse"),kc_id);
			api.openWin ({
				name: 'show_zzxx_window',
				url: './show_zzxx_window.html',
				rect:{
					x:0,
					y:0,
					w:'auto',
					h:'auto'
				},
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
					kc_id :kc_id,
					kc_name : kc_name,
					header_h:header_h
				}
		    });
		}
			//返回课程列表页更新课程学习时间
			function updateTime(){
			var courseId=$api.val($api.byId("clickCourse"));
			if(courseId!=""){
				var data={
			    			kc_id:courseId,
							person_id:$api.getStorage('person_id')
					    };
				api.ajax({
					    url: path_url+'/yx/yd/findZzxxLjsj',
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
					    	$api.html($api.byId("ljsj"+courseId),'累计学习时间 ：'+txt.list[0].zzxx_ljsj+'分钟');
					    }else {
					        errCode(err.code);
					   }
				});
			}
		}
		var header_h;
	    apiready = function(){
	       header_h=api.pageParam.header_h;
	       fillCourse();
	       api.addEventListener({
			    name:'scrolltobottom',
			    extra:{
			        threshold:0            //设置距离底部多少距离时触发，默认值为0，数字类型
			    }
			},function(ret,err){
				var data={
					page_number	: 1,
					page_size :15,
					person_id : $api.getStorage("person_id")
				};
				number=number+1;
				data.page_number=number;
			    findCourse(data,'');
			});
			
	    };