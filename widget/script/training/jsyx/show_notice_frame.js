
	    var number=1; 
	    //填充列表
	    function fillscore(){
	         var notice_id=api["pageParam"]["notice_id"];    
		    var data={
		    			id:notice_id
				    };
			findscore(data,'init');
		}	 
		//查询成绩
	    function findscore(data,init){
			api.ajax({
				    url: path_url+'/yx/pxgg/pxggDetail',
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
				       var notice_content=$api.byId("notice_content");
				       var title_div=$api.byId("notice_title");
				       var time_div=$api.byId("create_time");
				       if(init=='init'){
				       		$api.html(notice_content,'');
				       }
				        for(var i=0;i<txt.list.length;i++){
			   				
						var content=txt.list[i].content;
						var create_time=txt.list[i].createtime;
						var title=txt.list[i].title;
						$api.html(notice_content,content);
						$api.html(title_div,title);
						$api.html(time_div,create_time);						
						if(content.length>30){
						    content=content.substr(0,30)+"...";
						}
					   
				       }
				    }else {
				        errCode(err.code);
				   }
			});
		}
	
	    apiready = function(){
	      var notice_id=api["pageParam"]["notice_id"];
	           
	       fillscore();
	       api.addEventListener({
			    name:'scrolltobottom',
			    extra:{
			        threshold:0            //设置距离底部多少距离时触发，默认值为0，数字类型
			    }
			},function(ret,err){
			    var notice_id=api["pageParam"]["notice_id"];
				var data={
					id:notice_id
				};
				
			    findscore(data,'');
			});
			
	    };
