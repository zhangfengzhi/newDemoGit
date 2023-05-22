	var is_bx=1;
    var page_number=1;
    var xx_number=1;
    var header_h;
    //填充检测
    function fillQuali(){
	    var pxbSelect=$api.byId("pxbSelect");
	    var pxb_id=$api.val(pxbSelect);
	    var data={	
	    			
					pxbId :pxb_id,
					personId:$api.getStorage("person_id")
			    };
		
		findQuali(data,'init');		
		
	}	 
	//查询证书
    function findQuali(data,init){
    	isOnLineStatus(function(is_online, line_type) {
			if (is_online) {
		    	api.showProgress({
					title : '加载中...',
					text : '请稍候...',
					modal : false
				});
				var resource_id="";
				api.ajax({
					    url: path_url+'/yx/xfrd/findXfrdByPPId',
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
					     
					       if(txt[0]&&txt[0].RESOURCE_ID!=""&&txt[0].RESOURCE_ID!=null){
					       	resource_id=txt[0].RESOURCE_ID;
					       
					       	getImagePath(resource_id);
					       }else{
					       	var html="<font>暂无证书</font>";
					       	$api.html($api.byId("ntcDiv"),html);
					       	api.hideProgress(); 
					       }
					       
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
	//获取图片
	function getImagePath(resource_id){
		
		api.ajax({
					 url: path_url+'/yx/yd/findJSPicbyResId',
					 method: 'post',
					 async: true,
					 dataTpye:'json',	
					 data:{
					 	values: {
							resource_id:resource_id
						}        	
					 }
				},function(ret,err){
								
							    if (ret) {
							    	
							     	var urlJson = JSON.stringify(ret);
					      			var txt= $api.strToJson(urlJson);	
					      			
				              		var file_id = txt.imagename;
				              		var extension=txt.ext;
				              		var html="";
				              		var img_url = "";
				              	
				            		if(file_id!=null){
				            		if ($api.getStorage('BASE_APP_TYPE') == 1) {
				              			img_url = url_path_other+ BASE_MATERIAL_BEGIN + file_id.substr(0,2)+"/"+file_id + "." + extension;
				            		}else{
				            			img_url = $api.getStorage('BASE_URL_ACTION')+ BASE_IMAGE_BEGIN + file_id.substr(0,2)+"/"+file_id + "." + extension;

				            		}	
				            			html="<img style='height:30em;width:100%;' src='"+img_url+"' alt=''/>";
				            		}else{
				            			html="<font>暂无证书</font>";
				            		}
				            		$api.html($api.byId("ntcDiv"),html);
				            		api.hideProgress(); 
				            	
					       }else{	
					       			var html="<font>暂无证书</font>";
							       	$api.html($api.byId("ntcDiv"),html);
							       	api.hideProgress(); 
					       			
					       			errCode(err.code);
					  			 }
							   
							       
							});
	}
	//填充培训班
	function fillPxb(){
		//alert($api.getStorage("person_id"));
		api.ajax({
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
			       //alert(urlJson);
			       var txt= $api.strToJson(urlJson);
			       var pxbSelect=$api.byId("pxbSelect");
			       for(var i=0;i<txt.list.length;i++){
			       var html='<option  value="'+txt.list[i].ID+'">'+txt.list[i].PXB_NAME+'</option>';
					  $api.append(pxbSelect,html);
			       }
			       if(txt.list.length==0){
			       		$api.append(pxbSelect,'<option>暂无加入的培训班</option>');
			       }else{
			       		fillQuali();
			       }
			    }else {
			       errCode(err.code);
			   }
		});
	}
	
	//切换班级
	function changePxb(){
		fillQuali();
		//$api.addCls($api.byId("title_left"), "bg");
		//$api.removeCls($api.byId("title_right"), 'bg');
	}
	function openQuali(hw_id,ry_hw_id,state){
		var pxbSelect=$api.byId("pxbSelect");
	    var pxb_id=$api.val(pxbSelect);
		api.openWin ({
		name: 'zscx_window',
		url: './zscx_window.html',
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
				findQuali(data);*/
		});
		
    };