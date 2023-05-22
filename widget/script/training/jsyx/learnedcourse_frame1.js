var is_bx=1;
	    var bx_number=1;
	    var xx_number=1;
	    //填充课程
	    function fillCourse(){
		    var pxbSelect=$api.byId("pxbSelect");
		    var pxb_id=$api.val(pxbSelect);
		    var data={
					    is_bx : 1,
						page_number	: 1,
						page_size :15,
						pxb_id :pxb_id,
						person_id:$api.getStorage('person_id')
				    };
			findCourse(data,1,'init');		
			data.is_bx=0;
			findCourse(data,0,'init');	
			var kcDiv_bx=$api.byId("kcDiv_bx");
			var kcDiv_xx=$api.byId("kcDiv_xx");	
			$api.css(kcDiv_bx,"display:block;");
			$api.css(kcDiv_xx,"display:none;");
		}	 
		//查询课程   
	    function findCourse(data,type,init){
	    	isOnLineStatus(function(is_online, line_type) {
			if (is_online) {
		    	api.showProgress({
					title : '加载中...',
					text : '请稍候...',
					modal : false
				});
				api.ajax({
					    url: path_url+'/yx/yd/sencondCoursePage',
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
					       if(type==1){
					       		kcDiv=$api.byId("kcDiv_bx");
					       }else{
					       		kcDiv=$api.byId("kcDiv_xx");
					       }
					       if(init=='init'){
					       		$api.html(kcDiv,'');
					       }
					       if($api.html(kcDiv).indexOf("暂无课程")>-1){
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
									                	+'<span class="classify">'	
									                		+'累计学习时间 ：'+txt.list[i].ljsj	
									                	+'分钟</span>'	
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
					api.toast({
					    msg: '网络连接失败，请检查您的网络设置',
					    duration:2000,
					    location: 'middle'
					});
				}
			});	
		}	
		//填充培训班
		function fillPxb(){
			api.ajax({
				    url: path_url+'/yx/yd/findMyPXBList',
				    method: 'post',
				    timeout: 30,
				    cache:false,
				    dataTpye:'json',	
				    data:{
				        values: {
							'person_id':$api.getStorage('person_id'),
							'pxb_guoqi': 1
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
				       		$api.append(pxbSelect,'<option value="">暂无加入的培训班</option>');
				       }else{
				       		fillCourse();
				       }
				    }else {
				       errCode(err.code);
				   }
			});
		}
		//切换选修必须数据
		function changeDiv(label){
			var flag=$api.hasCls(label, "title_left");
			var kcDiv_bx=$api.byId("kcDiv_bx");
			var kcDiv_xx=$api.byId("kcDiv_xx");
			if(flag){
				$api.addCls($api.byId("title_left"), "bg");
				$api.removeCls($api.byId("title_right"), 'bg');
				$api.css(kcDiv_bx,"display:block;");
				$api.css(kcDiv_xx,"display:none;");
			}else{	
				$api.addCls($api.byId("title_right"), "bg");
				$api.removeCls($api.byId("title_left"), 'bg');
				$api.css(kcDiv_bx,"display:none;");
				$api.css(kcDiv_xx,"display:block;");
			}
		}
		//切换班级
		function changePxb(){
			fillCourse();
			$api.addCls($api.byId("title_left"), "bg");
			$api.removeCls($api.byId("title_right"), 'bg');
		}
		function openCourse(kc_id,kc_name){
			var pxbSelect=$api.byId("pxbSelect");
		    var pxb_id=$api.val(pxbSelect);
			api.openWin ({
			name: 'show_learned_window',
			url: './show_learned_window.html',
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
				pxb_id :pxb_id,
				header_h:header_h
			}
		});
		}
		 var header_h;
	     apiready = function(){
	        header_h=api.pageParam.header_h;
	        fillPxb();
	        api.addEventListener({
			    name:'scrolltobottom',
			    extra:{
			        threshold:0            //设置距离底部多少距离时触发，默认值为0，数字类型
			    }
			},function(ret,err){
				var pxbSelect=$api.byId("pxbSelect");
		    	var pxb_id=$api.val(pxbSelect);
		    	
		    	if(pxb_id!=""){
					data={
						is_bx : is_bx,
						page_number	: 1,
						page_size :15,
						pxb_id :pxb_id,
						person_id:$api.getStorage('person_id')
					};
					if(is_bx==1){
						 bx_number=bx_number+1;
						 data.page_number=bx_number;
					}else{
					    xx_number=xx_number+1;
					 	data.page_number=xx_number;
					}
				    findCourse(data,is_bx);
			    }
			});
			
	    };