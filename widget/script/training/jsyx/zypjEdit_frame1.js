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
		  	var id=api["pageParam"]["id"];
			
			var hw_id=api["pageParam"]["pxb_id"];
			var person_id=api["pageParam"]["person_id"]; 
			var content=$api.byId("zy_content").value; 
			//content=encodeURI(content); 
			if(content==''||content==null){
				api.alert({
						msg : '评语不得为空。'
				});
				return null;
			}
		    api.confirm({
			    title: '保存检测评价',
			    msg: '您确认保存吗？',
			    buttons: ['确定', '取消']
			}, function(ret, err){
				var urlJson = JSON.stringify(ret);
				var txt= $api.strToJson(urlJson);
				
				
				
			    if( txt.buttonIndex==1 ){
			         api.ajax({
					    url: path_url+'/yx/pjHomework/editPjHomework',
					    method: 'post',
					    timeout: 30,
					   	cache:false,
					    dataTpye:'json',	
					    data:{
					    	values: {
					        	id:id,
					        	person_id:$api.getStorage('person_id'),
					        	pj_level:$api.val($api.byId('selectpj')),
					        	pj_content:$api.byId("zy_content").value
					        }        	
					 	}
					},function(ret,err){
						api.alert({
									msg : '检测评价保存成功。'
							});
					    toBack();
					    api.execScript({
						 	 name: 'zypj_window',
						 	 frameName: 'zypj_frame1',
	                         script: 'fillPerson();'
                         });
					      
						
					  
				});
			    }
			    
			});
	 		
			
		}
	
	
	
	apiready = function(){	
			var id=api["pageParam"]["id"];
			
			var hw_id=api["pageParam"]["hw_id"];
			var zxf=api["pageParam"]["xf"]; 
			
			$api.val($api.byId("pxb_id"), hw_id);
			$api.val($api.byId("person_id"), zxf);
			$api.val($api.byId("xf_id"), id);
			
			
			//fillResource(hw_id,ry_hw_id,pxb_id,state,person_id);
			api.ajax({
					    url: path_url+'/yx/homework/findRYHomeworkById',
					    method: 'post',
					    timeout: 30,
					    cache:false,
					    dataTpye:'json',	
					    data:{
					    	values: {
					        	id:id
					        }        	
					 	}
					},function(ret,err){
					    if (ret) {
					    var urlJson = JSON.stringify(ret);
						var txt= $api.strToJson(urlJson);
							if(txt[0]&&txt[0].ID){
								$api.html($api.byId("hw_content"), txt[0].HW_CONTENT);
								if(txt[0].PJ_LEVEL&&txt[0].PJ_LEVEL!=""&&txt[0].PJ_LEVEL!="null"&&txt[0].PJ_LEVEL!=null){								
								$api.byId("selectpj").selectedIndex=txt[0].PJ_LEVEL-1;
								}
								$api.val($api.byId("zy_content"), txt[0].PJ_CONTENT);	
								
							}
					    }
				});
		
	}	