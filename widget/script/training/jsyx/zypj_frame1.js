	var is_bx=1;
    var page_number=1;
    var xx_number=1;
    var header_h;
    var typearr=new Array();
    //填充课程
    function fillPerson(){
	    var pxbSelect=$api.byId("pxbSelect");
	    var pxb_id=$api.val(pxbSelect);
	    var data={	
	    			page_number	: 1,
					page_size :15,
					pxbId :pxb_id,
					person_id:$api.getStorage("person_id"),
					homeworkName:"",
					state:"1"
			    };
		findPerson(data,'init');		
		
	}	 
	//查询课程  
    function findPerson(data,init){
    var theurl=path_url+'/yx/yd/pjXxHomeworkList';
    var pxbindex=$api.byId("pxbSelect").selectedIndex;
    if(typearr[pxbindex]&&typearr[pxbindex]==1){
    	theurl=path_url+'/yx/yd/pjHomeworkList';
    }
    	isOnLineStatus(function(is_online, line_type) {
			if (is_online) {
		    	api.showProgress({
					title : '加载中...',
					text : '请稍候...',
					modal : false
				});
				api.ajax({
					    url: theurl,
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
					        var xf=txt.list[i].PJ_LEVEL;
					        if(xf==null||xf==""||xf=="undefined"){
					        	xf="未评";					        	
					        }else if(xf==1){
					        	xf="优秀";
					        }else if(xf==2){
					        	xf="良好";
					        }else if(xf==3){
					        	xf="及格";
					        }else if(xf==4){
					        	xf="不及格";
					        }
					         var html='<a href="javascript:void(0);" class="item Fix hightitem" tapmode style="display:block" onclick="openPerson('+txt.list[i].ID+',\''+txt.list[i].HW_ID+'\',\''+txt.list[i].XF+'\');">'
					            		+'<div class="cnt">'
						            		//+'<img class="pic" src="../../../image/training/jsyx/js_s'+index+'.jpg">'	
							            	+'<div class="wrap">'	
								            	+'<div class="wrap2">'	
									            	+'<div class="content">'	
									                	+'<div class="shopname">'+txt.list[i].PERSON_NAME+'</div>'	
									                	+'<div class="comment">'
									                    	+'<span style="display:block">检测名称：'+txt.list[i].HW_NAME+'</span>'
									                    	//+'<span style="display:block">课程名称：'+txt.list[i].KC_NAME+'</span>'	
									                	+'</div>'	
									                	+'<span class="classify" id="ljsj'+txt.list[i].ID+'">评价：'+	xf
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
			    url: path_url+'/yx/yd/zypjpxbList',
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
			       typearr[i]=txt.list[i].PXB_TYPE;
					  $api.append(pxbSelect,html);
			       }
			       if(txt.list.length==0){
			       		$api.append(pxbSelect,'<option>暂无加入的培训班</option>');
			       		typearr[0]=0;
			       }else{
			       		fillPerson();
			       }
			    }else {
			       errCode(err.code);
			   }
		});
	}
	
	//切换班级
	function changePxb(){
		fillPerson();
		//$api.addCls($api.byId("title_left"), "bg");
		//$api.removeCls($api.byId("title_right"), 'bg');
	}
	function openPerson(id,hw_id,xf){
		//alert(xf);
		if(xf!=null&&xf!=""&&xf!="undefined"&&xf!="null"){
			api.alert({
							msg : '已经学分认定，不能评价！'
						});
		}else{
		api.openWin ({
		name: 'zypjEdit_window',
		url: './zypjEdit_window.html',
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
			id :id,
			hw_id :hw_id,
			xf:xf,
			header_h : header_h
		}
	});
	}
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