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
		    var kj_id=api["pageParam"]["kj_id"];
			var kc_id=api["pageParam"]["kc_id"];
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
			    title: '保存评价',
			    msg: '您确认保存吗？',
			    buttons: ['确定', '取消']
			}, function(ret, err){
				var urlJson = JSON.stringify(ret);
				var txt= $api.strToJson(urlJson);
				var urlstr='?pspfId='+$api.val($api.byId('pspfId'))+'&pxbId='+$api.val($api.byId('pxb_id'))+'&person_id='+$api.val($api.byId('person_id'))+'&xxkc_id='+$api.val($api.byId('xxkc_id'))+'&xxkcsj_id='+
				$api.val($api.byId('xxkcsj_id'))+'&ifupdate='+$api.val($api.byId('ifupdate'))+'&pfr_id='+$api.val($api.byId('pfr_id'))+'&pf='+$api.val($api.byId('selectpj'))+'&py='+content+'&ifmobile=1';
			    if( txt.buttonIndex==1 ){
			         api.ajax({
					    url: path_url+'/yx/pspf/edtPspf'+urlstr,
					    method: 'post',
					    timeout: 30,
					   
					},function(ret,err){
					
					    toBack();
					    
					      api.alert({
									msg : '评价保存成功。'
							});
						
					  
				});
			    }
			});
	 		
			
		}
	
	
	
	apiready = function(){	
			var kj_id=api["pageParam"]["kj_id"];
			var kc_id=api["pageParam"]["kc_id"];
			var pxb_id=api["pageParam"]["pxb_id"];
			var person_id=api["pageParam"]["person_id"]; 
			$api.val($api.byId("pxb_id"), pxb_id);
			$api.val($api.byId("person_id"), person_id);
			$api.val($api.byId("xxkc_id"), kc_id);
			$api.val($api.byId("xxkcsj_id"), kj_id);
			$api.val($api.byId("pfr_id"), $api.getStorage("person_id"));
			
			//fillResource(hw_id,ry_hw_id,pxb_id,state,person_id);
			api.ajax({
					    url: path_url+'/yx/bindpxb/findPspfByPKId',
					    method: 'post',
					    timeout: 30,
					    cache:false,
					    dataTpye:'json',	
					    data:{
					    	values: {
					        	person_id:person_id,
					        	xxkcsj_id:kj_id	
					        }        	
					 	}
					},function(ret,err){
					    if (ret) {
					    var urlJson = JSON.stringify(ret);
						var txt= $api.strToJson(urlJson);
							if(txt[0]&&txt[0].ID){
								$api.byId("selectpj").selectedIndex=txt[0].PF-1;
								$api.val($api.byId("zy_content"), txt[0].PY);	
								flag=1;	
								$api.val($api.byId("ifupdate"), "1");
								$api.val($api.byId("pspfId"), txt[0].ID);
							}
					    }
				});
		
	}	