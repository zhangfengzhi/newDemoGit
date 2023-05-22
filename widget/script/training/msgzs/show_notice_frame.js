		 
	    var number=1; 
	    //填充列表
	    function fillscore(){
	          var notice_id=api["pageParam"]["notice_id"]; 
		    var data={
		    			notice_id:notice_id
				    };
			findscore(data,'init');
		}	 
		//查询成绩
	    function findscore(data,init){
	    var notice_id=api["pageParam"]["notice_id"]; 
			api.ajax({
				    url: path_url+'/notice/getNoticeById?notice_id='+notice_id+'&random_num='+Math.random(),
				    method: 'post',
				    timeout: 30,
				    cache:false,
				    dataTpye:'json',	
				   
				},function(ret,err){
				//alert(path_url+'/notice/getNoticeById?notice_id='+notice_id+'&random_num='+Math.random());
				//alert(ret);
				    if (ret) {
				       var urlJson = JSON.stringify(ret);
				       
				       var txt= $api.strToJson(urlJson);
				       var notice_content=$api.byId("notice_content");
				       var title_div=$api.byId("notice_title");
				       var time_div=$api.byId("create_time");
				       if(init=='init'){
				       		$api.html(notice_content,'');
				       }
				      
			   				
						var content=txt.notice.content;
						var create_time=txt.notice.create_time;
						var title=txt.notice.title;
						$api.html(notice_content,content);
						$api.html(title_div,title);
						$api.html(time_div,create_time);						
						if(content.length>30){
						    content=content.substr(0,30)+"...";
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
					notice_id:notice_id
				};
				
			    findscore(data,'');
			});
			
	    };
