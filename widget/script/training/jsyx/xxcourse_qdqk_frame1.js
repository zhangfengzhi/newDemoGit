	var is_bx=1;
    var page_number=1;
    var xx_number=1;
    var header_h;
    var pxbSelect;
	var pxb_id;
	var courseSelect; 
	var course_id;
    //填充课程
    function fillCourseCell(){
	    course_id=$api.val(courseSelect);
	    var data={	
	    			id:course_id
			    };
		findCourse(data,'init');		
		
	}	 
	//查询课程  
    function findCourse(data,init){
 		pxb_id=$api.val(pxbSelect);
		course_id=$api.val(courseSelect);
    	isOnLineStatus(function(is_online, line_type) {
			if (is_online) {
		    	api.showProgress({
					title : '加载中...',
					text : '请稍候...',
					modal : false
				});
				api.ajax({
					    url: path_url+'/yx/bindpxb/xxkcDetail',
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
					       if($api.html(kcDiv).indexOf("暂无课程")>-1){
			       		   	    $api.html(kcDiv, "");  
			       	   	   }
					        for(var i=0;i<txt.xxkjList.length;i++){
					        var index=Math.ceil(Math.random()*9);
					        var kckj=(i+1);
					         var html='<a href="javascript:void(0);" class="item Fix hightitem" tapmode onclick="openCourse('+txt.xxkjList[i].id+',\''+txt.xxkcList[0].xxkc_name+'\',\''+txt.xxkcList[0].xxkc_zjr+'\',\''+txt.xxkcList[0].xxkc_dd+'\',\''+txt.xxkcList[0].xxkc_isbx+'\',\''+kckj+'\');">'
					            		+'<div class="cnt">'
						            		//+'<img class="pic" src="../../../image/training/jsyx/js_s'+index+'.jpg">'	
							            	+'<div class="wrap">'	
								            	+'<div class="wrap2">'	
									            	+'<div class="content">'	
									                	+'<div style="display:block;" class="shopname">第'+(i+1)+'节</div>'	
									                	
									                	+'<span class="classify" id="ljsj'+txt.xxkjList[i].id+'">上课时间：'+txt.xxkjList[i].xxkc_kssj+'——'+txt.xxkjList[i].xxkc_jssj
									                	+'</span>'	
									            	+'</div>'	
								            	+'</div>'           	
							           		+'</div>'	
					            		+'</div>'	
					        		+'</a>';
							  $api.append(kcDiv,html);
					       }
					        api.hideProgress(); 
					        if(txt.xxkjList.length==0){//说明没查出信息，需要判断原有div里边是否有信息，如果有，那么什么都不做，如果没有，加上没有培训班的提示信息。
						  		var n=$api.html(kcDiv);
						   		if(n==null||n==""){			      
						      		$api.append(kcDiv,"<div align='center' style='margin-top:50px;'><h3>暂无课程表</h3></div>");
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
			    url: path_url+'/yx/yd/xxpxbList',
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
			       var html='<option  value="'+txt.list[i].ID+'">'+txt.list[i].PXB_NAME+'</option>';
					  $api.append(pxbSelect,html);
			       }
			       if(txt.list.length==0){
			       		$api.append(pxbSelect,'<option>暂无加入的培训班</option>');
			       		$api.append($api.byId("courseSelect"),'<option>该培训班暂无课程</option>');
			       }else{
			       		fillCourse();
			       }
			    }else {
			       errCode(err.code);
			   }
		});
	}
	//填充课程
	function fillCourse(){
		pxb_id=$api.val(pxbSelect);
	 
		//alert($api.getStorage("person_id"));
		api.ajax({
			    url: path_url+'/yx/yd/pxbCourseInXxList',
				method: 'post',
				timeout: 30,
				cache:false,
				dataTpye:'json',	
			    data:{
			        values: {
						page_number	: 1,
						page_size :9999,
						pxb_id :pxb_id,
						person_id:$api.getStorage("person_id")
			        }			        	
			 	}
			},function(ret,err){
			    if (ret) {
			       var urlJson = JSON.stringify(ret);
			       //alert(urlJson);
			       var txt= $api.strToJson(urlJson);
			       var courseSelect=$api.byId("courseSelect");
			       $api.html(courseSelect,'');
			       for(var i=0;i<txt.list.length;i++){
			       var html='<option  value="'+txt.list[i].id+'">'+txt.list[i].xxkc_name+'</option>';
					  $api.append(courseSelect,html);
			       }
			       if(txt.list.length==0){
			       		$api.append(courseSelect,'<option>该培训班暂无课程</option>');
			       }else{
			       		fillCourseCell();
			       }
			    }else {
			       errCode(err.code);
			   }
		});
	}
	function changeCourse(){
	//切换课程
		fillCourseCell();
	}
	//切换班级
	function changePxb(){
		fillCourse();
		//$api.addCls($api.byId("title_left"), "bg");
		//$api.removeCls($api.byId("title_right"), 'bg');
	}
	function openCourse(kj_id,kc_name,kc_zjr,kc_dd,isbx,kc_kj){
		$api.val($api.byId("clickCourse"),course_id);
		
	    pxb_id=$api.val(pxbSelect);
		api.openWin ({
		name: 'show_xxcourse_qdqk_window',
		url: './show_xxcourse_qdqk_window.html',
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
			kj_id :kj_id,
			pxb_id :pxb_id,
			course_id : course_id,
			kc_name:kc_name,
			kc_zjr:kc_zjr,
			kc_dd:kc_dd,
			isbx:isbx,
			kc_kj:kc_kj,
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
       fillPxb();
       pxbSelect=$api.byId("pxbSelect");
       courseSelect=$api.byId("courseSelect"); 
     /*  api.addEventListener({
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