	var pl_number=1;

	var flag=0;
	var interval_id = null;
	var maxTime=0;
	var minTime=0;
	var kc_ks=0;
	var ljsj_has="";
	var kc_ly="";
		
	//填充数据
	function fillResource(){
		  	var xf_id=api["pageParam"]["xf_id"];
			var zxf=api["pageParam"]["xf"]; 
			var pxb_id=api["pageParam"]["pxb_id"];
			var person_id=api["pageParam"]["person_id"]; 
			var content=$api.byId("zy_content").value; 
			content=encodeURI(content); 
			if(content==''||content==null){
				api.alert({
						msg : '评语不得为空。'
				});
				return null;
			}
		    api.confirm({
			    title: '保存学分认定',
			    msg: '您确认保存吗？',
			    buttons: ['确定', '取消']
			}, function(ret, err){
				var urlJson = JSON.stringify(ret);
				var txt= $api.strToJson(urlJson);
				
				if(zxf-$api.val($api.byId('pf'))<0||$api.val($api.byId('pf'))==null||$api.val($api.byId('pf'))==''){
					api.alert({
									msg : '学分不合法，请重新输入。'
							});
				}else{
				
				var urlstr='?xfrdId='+$api.val($api.byId('xf_id'))+'&pxbId='+$api.val($api.byId('pxb_id'))+'&person_id='+$api.val($api.byId('person_id'))+'&'+
				'pfr_id='+$api.val($api.byId('pfr_id'))+'&xf='+$api.val($api.byId('pf'))+'&py='+content;
				
			    if( txt.buttonIndex==1 ){
			         api.ajax({
					    url: path_url+'/yx/yd/xfrdThePerson',
					    method: 'post',
					    timeout: 30,
					   	cache:false,
					    dataTpye:'json',	
					    data:{
					    	values: {
					        	xfrdId:$api.val($api.byId('xf_id')),
					        	pxbId:$api.val($api.byId('pxb_id')),
					        	person_id:$api.val($api.byId('person_id')),
					        	pfr_id:$api.val($api.byId('pfr_id')),
					        	xf:$api.val($api.byId('pf')),
					        	py:$api.byId("zy_content").value
					        }        	
					 	}
					},function(ret,err){
						api.alert({
									msg : '学分认定保存成功。'
							});
					    toBack();
					    api.execScript({
						 	 name: 'xfrd_window',
						 	 frameName: 'xfrd_frame1',
	                         script: 'fillPerson();'
                         });
					      
						
					  
				});
			    }
			    }
			});
	 		
			
		}
	
	
	
	apiready = function(){	
			var xf_id=api["pageParam"]["xf_id"];
			var person_id=api["pageParam"]["person_id"];
			var pxb_id=api["pageParam"]["pxb_id"];
			var zxf=api["pageParam"]["xf"]; 
			
			$api.val($api.byId("pxb_id"), pxb_id);
			$api.val($api.byId("person_id"), person_id);
			$api.val($api.byId("xf_id"), xf_id);
			$api.html($api.byId("zf"), zxf);
			$api.val($api.byId("pfr_id"), $api.getStorage("person_id"));
			
			//fillResource(hw_id,ry_hw_id,pxb_id,state,person_id);
			api.ajax({
					    url: path_url+'/yx/xfrd/findXfrdById',
					    method: 'post',
					    timeout: 30,
					    cache:false,
					    dataTpye:'json',	
					    data:{
					    	values: {
					        	xfrdId:xf_id
					        }        	
					 	}
					},function(ret,err){
					    if (ret) {
					    var urlJson = JSON.stringify(ret);
						var txt= $api.strToJson(urlJson);
							if(txt[0]&&txt[0].ID){
								$api.val($api.byId("pf"), txt[0].XF);	
								$api.val($api.byId("zy_content"), txt[0].PY);	
								
							}
					    }
				});
		
	}	