	var pl_number=1;
	var pxb_id=0;
	var kc_id=0;
	var flag=0;
	var interval_id = null;
	var maxTime=0;
	var minTime=0;
	var kc_ks=0;
	var ljsj_has="";
	var kc_ly="";
		
	//填充数据
	function fillResource(kc_id,kc_name,pxb_id,kc_kj,kc_isbx,kc_zjr,kc_dd){
		       
		       
		       var kcxxDiv=$api.byId("kcxx");
		         var html='<table>';
		       
		         
		       html+='<tr><td class="td1">课程名称 ： </td><td class="td2">'+kc_name+'</td></tr>';
		       html+='<tr><td class="td1">课程课节 ： </td><td class="td2">'+kc_kj+'节</td></tr>';
		       
		        if(kc_isbx==1){
		 
		       		html+='<tr><td class="td1">课程分类 ：</td><td class="td2"> 必修课程</td></tr>';
		       }
		       if(kc_isbx==0){
		       		
		       		html+='<tr><td class="td1">课程分类 ：</td><td class="td2"> 选修课程</td></tr>';
		       }
		       	
		       html+='<tr><td style="align:left; valign:top;" class="td1">主讲人</td><td class="td2">'+kc_zjr+'</td></tr>';
		       html+='<tr><td class="td1">上课地点 ：</td><td class="td2">';
		       html+=kc_dd;
		       html+='</td></tr></table>';
		       $api.append(kcxxDiv, html);
		       fillCoursetime(kc_id,'');
		       
		
	}
	//填充课程表
	 function fillCoursetime(kc_id,init){
	 		
			api.ajax({
				    url: path_url+'/yx/bindpxb/xxkcDetail',
				    method: 'post',
				    timeout: 30,
				    cache:false,
				    dataTpye:'json',	
				    data:{
				    	values: {
				        	id: kc_id	
				        }        	
				 	}
				},function(ret,err){
				    if (ret) {
				       var urlJson = JSON.stringify(ret);
				       var txt= $api.strToJson(urlJson);
				       var kcDiv=$api.byId("list");
				       if(init=='init'){
				       		$api.html(kcDiv,'');
				       }
				        for(var i=0;i<txt.xxkjList.length;i++){
				        
						   
				         var html='<div class="cnt" >'					            		
						            	+'<div class="wrap">'	
							            	+'<div class="wrap2">'	
								            	+'<div class="content">'	//text-decoration:underline;color: #0000FF"onclick="kjpjck('+txt.xxkjList[i].id+')"
								                	+'<div class="shopname"><span style="height:50px;line-height:50px;">第'+(i+1)+'节:'+txt.xxkjList[i].xxkc_kssj+'——'+txt.xxkjList[i].xxkc_jssj+'</span>'+'</div>'			
								            	+'</div>'	
							            	+'</div>'           	
						           		+'</div>'	
				            		+'</div>';
						  $api.append(kcDiv,html);
						}
				    }else {
				        errCode(err.code);
				   }
			});
		}
	function kjpjck(id){
		api.ajax({
				    url: path_url+'/yx/bindpxb/findPspfByPKId',
				    method: 'post',
				    timeout: 30,
				    cache:false,
				    dataTpye:'json',	
				    data:{
				    	values: {
				        	xxkcsj_id: id,
				        	person_id:$api.getStorage("person_id")	
				        }        	
				 	}
				},function(ret,err){
				    if (ret) {
				       var urlJson = JSON.stringify(ret);
				       var txt= $api.strToJson(urlJson);
				       if(txt[0]&&txt[0].ID){
				      	var fs=txt[0].PF;
				      	var pf='优';	
				      	if(fs==1){
							pf='优';
						}
						if(fs==2){
							pf='良';
						}
						if(fs==3){
							pf='中';
						}
						if(fs==4){
							pf='差';
						}
				       var pjstr='评价：'+pf+'。\n评语:'+txt[0].PY;
				        api.alert({
									msg : pjstr
							});
				       }else{
				        api.alert({
									msg : '暂无评价。'
							});
				       }
				    }else {
				        errCode(err.code);
				   }
			});
	}
	
	
	apiready = function(){	
		var kc_id=api["pageParam"]["kc_id"];
		var pxb_id=api["pageParam"]["pxb_id"];
		var kc_kj=api["pageParam"]["kc_kj"];
		var kc_isbx=api["pageParam"]["kc_isbx"];
		var kc_zjr=api["pageParam"]["kc_zjr"];
		var kc_dd=api["pageParam"]["kc_dd"];
		var kc_name=api["pageParam"]["kc_name"];	
		fillResource(kc_id,kc_name,pxb_id,kc_kj,kc_isbx,kc_zjr,kc_dd);
		
	}	