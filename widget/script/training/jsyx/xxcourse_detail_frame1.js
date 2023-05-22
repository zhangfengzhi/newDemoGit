	var is_bx=1;
    var page_number=1;
    var xx_number=1;
    var header_h;
    //填充课程
    function fillStudent(){
	    
	    var data={	
	    			
					pxb_id :api["pageParam"]["pxb_id"],
					xxkc_id:api["pageParam"]["kc_id"],
					xxkcsj_id:api["pageParam"]["kj_id"]
			    };
		findStudent(data,'init');		
		
	}	 
	//查询课程  
    function findStudent(data,init){
    	isOnLineStatus(function(is_online, line_type) {
			if (is_online) {
		    	api.showProgress({
					title : '加载中...',
					text : '请稍候...',
					modal : false
				});
				api.ajax({
					    url: path_url+'/yx/bindpxb/xxkjqdDetail',
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
					       if($api.html(kcDiv).indexOf("暂无学员信息")>-1){
			       		   	    $api.html(kcDiv, "");  
			       	   	   }
			       	   	   //alert(txt.list.length);
					        for(var i=0;i<txt.list.length;i++){
					        var index=Math.ceil(Math.random()*9);
					        var qdzt="";
					        if(txt.list[i].isqd==null){
					        	qdzt='<font style="color:red;">未签到</font>';
					        }else if(txt.list[i].isqd==1){
					        	qdzt='<font style="color:green;">已签到</font>';
					        }else if(txt.list[i].isqd==2){
					        	qdzt='<font style="color:black;">迟到</font>';
					        }else if(txt.list[i].isqd==0){
					        	qdzt='<font style="color:red;">未签到</font>';
					        }
					         var html='<a href="javascript:void(0);" class="item Fix hightitem" tapmode onclick="openPj('+txt.list[i].person_id+');">'
					            		+'<div class="cnt">'
						            		//+'<img class="pic" src="../../../image/training/jsyx/js_s'+index+'.jpg">'	
							            	+'<div class="wrap">'	
								            	+'<div class="wrap2">'	
									            	+'<div class="content">'	
									                	+'<div class="shopname">学员姓名：'+txt.list[i].person_name+'</div>'	
									                	+'<div class="comment">'
									                    	+'<span>序号：'+(i+1)+'</span>'	
									                	+'</div>'	
									                	+'<span class="classify" id="ljsj'+txt.list[i].id+'">签到状态 ：'+	qdzt
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
						      		$api.append(kcDiv,"<div align='center' style='margin-top:50px;'><h3>暂无学员信息</h3></div>");
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
	
	
	//切换班级
	function changePxb(){
		fillCourse();
		//$api.addCls($api.byId("title_left"), "bg");
		//$api.removeCls($api.byId("title_right"), 'bg');
	}
	function openPj(person_id){
		
		api.openWin ({
		name: 'pspj_window',
		url: './pspj_window.html',
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
			pxb_id :api["pageParam"]["pxb_id"],
			kc_id :api["pageParam"]["kc_id"],
			kj_id:api["pageParam"]["kj_id"],
			person_id:person_id,
			header_h : header_h
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
       $api.html($api.byId("kcid"), api["pageParam"]["kc_name"]);
  		$api.html($api.byId("zjr"), api["pageParam"]["kc_zjr"]);
       fillStudent();
      /* api.addEventListener({
		    name:'scrolltobottom',
		    extra:{
		        threshold:0            //设置距离底部多少距离时触发，默认值为0，数字类型
		    }
		},function(ret,err){
			var pxbSelect=$api.byId("pxbSelect");
	    	var pxb_id=$api.val(pxbSelect);
			data={
				page_number	: 1,
				page_size :15,
				pxb_id :pxb_id,
				person_id:$api.getStorage("person_id")
			};
			
				page_number=page_number+1;
				data.page_number=page_number;
				findCourse(data);
		});*/
		
    };