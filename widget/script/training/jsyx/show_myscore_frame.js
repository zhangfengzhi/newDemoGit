
	    var number=1; 
	    //填充列表
	    function fillscore(){
	         var pxbId=api["pageParam"]["pxbId"];    
		    var data={
		    			pxbId:pxbId,		    			
						page_number	: 1,
						page_size :15,
						person_id:$api.getStorage('person_id'),
						pxb_id:pxbId
				    };
			findscore(data,'init');
		}	 
		//查询成绩
	    function findscore(data,init){
	    	var pxb_type=api["pageParam"]["pxb_type"];
	    	if(pxb_type==1){
			api.ajax({
				    url: path_url+'/yx/yd/kcScoreList',
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
				       var kcDiv=$api.byId("kcDiv");
				       if(init=='init'){
				       		$api.html(kcDiv,'');
				       }
				        for(var i=0;i<txt.list.length;i++){
				        var kisa = txt.list[i].is_bx;
						if (kisa == 1) {
							kisa = "必修";
						} else {
							kisa = "选修";
						}
						var studyTime="0";
					    if(null!=txt.list[i].studyTime&&""!=txt.list[i].studyTime.toString().trim()){
					           studyTime=txt.list[i].studyTime
					    }					   
						var kisadisa=txt.list[i].kc_name;						
						if(kisadisa.length>8){
						    kisadisa=kisadisa.substr(0,8)+"...";
						}
						   
				         var html=
				            		'<div class="cnt">'					            		
						            	+'<div class="wrap">'	
							            	+'<div class="wrap2">'	
								            	+'<div class="content">'	
								                	+'<div class="shopname">'+'<span>课程名称 ：'+kisadisa+'</span>'+'</div>'	
								                	+'<div class="comment">'	
								                    	+'<span>是否必修 ：'+kisa+'</span>'	
								                	+'</div>'	
								                	+'<span class="classify">'	
								                		+'学习时间/总课时：'+studyTime+'/'+txt.list[i].kc_ks
								                	+'</span>'
								                	+'<div class="comment">'	
								                    	+'<span>完成检测数/总检测数 ：'+txt.list[i].homeworkCountOfPersonDone+'/'+txt.list[i].homeworkCountOfTheKc+'</span>'	
								                	+'</div>'	
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
			}else{
				api.ajax({
				    url: path_url+'/yx/yd/xxkcScoreList',
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
				       var kcDiv=$api.byId("kcDiv");
				       if(init=='init'){
				       		$api.html(kcDiv,'');
				       }
				        for(var i=0;i<txt.list.length;i++){
				        var kisa = txt.list[i].xxkc_isbx;
						if (kisa == 1) {
							kisa = "必修";
						} else {
							kisa = "选修";
						}
						var studyTime="0";
					    if(null!=txt.list[i].studyKjNum&&""!=txt.list[i].studyKjNum.trim()){
					           studyTime=txt.list[i].studyKjNum;
					    }					   
						var kisadisa=txt.list[i].xxkc_name;						
						if(kisadisa.length>8){
						    kisadisa=kisadisa.substr(0,8)+"...";
						}
						   
				         var html='<div class="cnt">'					            		
						            	+'<div class="wrap">'	
							            	+'<div class="wrap2">'	
								            	+'<div class="content">'	
								                	+'<div class="shopname">'+'<span>课程名称 ：'+kisadisa+'</span>'+'</div>'	
								                	+'<div class="comment">'	
								                    	+'<span>是否必修 ：'+kisa+'</span>'	
								                	+'</div>'	
								                	+'<span class="classify">'	
								                		+'学习课节/总课节：'+studyTime+'/'+txt.list[i].allKjNum
								                	+'</span>'
								                	+'<div class="comment">'	
								                    	+'<span>完成检测数/总检测数 ：'+txt.list[i].homeworkCountOfPersonDone+'/'+txt.list[i].homeworkCountOfTheKc+'</span>'	
								                	+'</div>'	
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
	}
	    apiready = function(){
	      var pxbId=api["pageParam"]["pxbId"];
	           
	       fillscore();
	       api.addEventListener({
			    name:'scrolltobottom',
			    extra:{
			        threshold:0            //设置距离底部多少距离时触发，默认值为0，数字类型
			    }
			},function(ret,err){
			    var pxbId=api["pageParam"]["pxbId"];
				var data={
					pxbId:pxbId,		    		
					page_number	: 1,
					page_size :15,
					person_id : $api.getStorage("person_id")
				};
				number=number+1;
				data.page_number=number;
			    findscore(data,'');
			});
			
	    };
