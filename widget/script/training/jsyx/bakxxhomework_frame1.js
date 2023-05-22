	var is_bx=1;
    var page_number=1;
    var xx_number=1;
    var header_h;
    //填充检测
    function fillHomework(){
	    var pxbSelect=$api.byId("pxbSelect");
	    var pxb_id=$api.val(pxbSelect);
	    var data={	
	    			page_number	: 1,
					page_size :15,
					pxbId :pxb_id,
					person_id:$api.getStorage("person_id")
			    };
		findHomework(data,'init');		
		
	}	 
	//查询检测 
    function findHomework(data,init){
       
    	isOnLineStatus(function(is_online, line_type) {
			if (is_online) {
		    	api.showProgress({
					title : '加载中...',
					text : '请稍候...',
					modal : false
				});
				api.ajax({
					    url: path_url+'/yx/yd/myHomeworkList',
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
					       if($api.html(kcDiv).indexOf("暂无检测")>-1){
			       		   	    $api.html(kcDiv, "");  
			       	   	   }
					        for(var i=0;i<txt.list.length;i++){
					        var index=Math.ceil(Math.random()*9);
					        var isdone='<font style="color:red;">未做</font>';
					        if(txt.list[i].RY_HW_ID!=null){
					        	isdone='<font style="color:green;">已提交</font>'
					        }
					        var status="未评价";
					        if(txt.list[i].PJ_LEVEL!=null){
					        	if(txt.list[i].PJ_LEVEL==1){
					        		status="优秀";
					        	}
					        	if(txt.list[i].PJ_LEVEL==2){
					        		status="良好";
					        	}
					        	if(txt.list[i].PJ_LEVEL==3){
					        		status="及格";
					        	}
					        	if(txt.list[i].PJ_LEVEL==4){
					        		status="不及格";
					        	}
					        }
					         var html='<a href="javascript:void(0);" class="item Fix hightitem" tapmode onclick="openHomework('+txt.list[i].HW_ID+',\''+txt.list[i].RY_HW_ID+'\',\''+txt.list[i].STATE+'\');">'
					            		+'<div class="cnt">'
						            		//+'<img class="pic" src="../../../image/training/jsyx/js_s'+index+'.jpg">'	
							            	+'<div class="wrap">'	
								            	+'<div class="wrap2">'	
									            	+'<div class="content">'	
									                	+'<div class="shopname">'+txt.list[i].HW_NAME+'</div>'	//(课程：'+txt.list[i].KC_NAME+')
									                	+'<div class="comment">'
									                    	+'<span>'+txt.list[i].HW_NR+'</span>'	
									                	+'</div>'	
									                	//+'<div class="comment">'
									                    	+'<span class="classify" style="width:150px;">状态：'+isdone+'</span>'	
									                	//+'</div>'	
									                	+'<span class="classify" style="margin-left:50px;" id="ljsj'+txt.list[i].RY_HW_ID+'">评价 ：'+	status
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
						      		$api.append(kcDiv,"<div align='center' style='margin-top:50px;'><h3>暂无检测</h3></div>");
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
		//alert($api.getStorage("person_id"));
		api.ajax({
			    url: path_url+'/yx/yd/MypxbList',
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
			       //alert(urlJson);
			       var txt= $api.strToJson(urlJson);
			       var pxbSelect=$api.byId("pxbSelect");
			       for(var i=0;i<txt.list.length;i++){
			       var html='<option  value="'+txt.list[i].id+'">'+txt.list[i].pxb_name+'</option>';
					  $api.append(pxbSelect,html);
			       }
			       if(txt.list.length==0){
			       		$api.append(pxbSelect,'<option>暂无加入的培训班</option>');
			       }else{
			       		fillHomework();
			       }
			    }else {
			       errCode(err.code);
			   }
		});
	}
	
	//切换班级
	function changePxb(){
		fillHomework();
		//$api.addCls($api.byId("title_left"), "bg");
		//$api.removeCls($api.byId("title_right"), 'bg');
	}
	function openHomework(hw_id,ry_hw_id,state){
		api.ajax({
			    url: path_url+'/yx/homeworkxx/isWriteHw',
			    method: 'post',
			    dataTpye:'json',	
			    data:{
			        values: {
						'person_id':$api.getStorage("person_id"),
						'hw_id': hw_id
			        }			        	
			 	}
			},function(ret,err){
				//alert(ret);
			    if (ret) {
			       var urlJson = JSON.stringify(ret);
			       //alert(urlJson);
			       var txt= $api.strToJson(urlJson);
			      //alert(txt[0].C);
			       if(txt[0].C>0){
			       		api.alert({
									msg : '无法修改检测,出现原因可能有:1、检测已提交。2、学分已经评定。'
							});
			       }else{
			       		var pxbSelect=$api.byId("pxbSelect");
					    var pxb_id=$api.val(pxbSelect);
						api.openWin ({
						name: 'dohomework_window',
						url: './dohomework_window.html',
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
							hw_id :hw_id,
							ry_hw_id : ry_hw_id,
							pxb_id :pxb_id,
							state:state,
							header_h:header_h
						}
					});
			       }
			    }else {
			       errCode(err.code);
			       //alert(err.code);
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
       fillPxb();
       api.addEventListener({
		    name:'scrolltobottom',
		    extra:{
		        threshold:0            //设置距离底部多少距离时触发，默认值为0，数字类型
		    }
		},function(ret,err){
			/*var pxbSelect=$api.byId("pxbSelect");
	    	var pxb_id=$api.val(pxbSelect);
			data={
				page_number	: 1,
				page_size :15,
				pxbId :pxb_id,
				person_id:$api.getStorage("person_id")
			};
			
				page_number=page_number+1;
				data.page_number=page_number;
				findHomework(data);*/
		});
		
    };