		 var totalwt=0;
	    var number=1; 
	    //填充列表
	    function fillscore(){
	          var wjdc_id=api["pageParam"]["wjdc_id"]; 
		    var data={
		    			id:wjdc_id
				    };
			findscore(data,'init');
		}	 
		//查询题目
	    function findscore(data,init){
	    var wjdc_id=api["pageParam"]["wjdc_id"]; 
			api.ajax({
				    url: path_url+'/yx/qnpaper/qnpaperInfo?id='+wjdc_id+'&random_num='+Math.random(),
				    method: 'get',
				    timeout: 30,
				    cache:false,
				    dataTpye:'json',	
				   
				},function(ret,err){
				//alert(path_url+'/notice/getNoticeById?notice_id='+notice_id+'&random_num='+Math.random());
				
				    if (ret) {
				       var urlJson = JSON.stringify(ret);
				      //alert(urlJson);
				       var txt= $api.strToJson(urlJson);
				       var notice_content=$api.byId("notice_content");
				       var title_div=$api.byId("notice_title");
				       var time_div=$api.byId("create_time");
				       var kcDiv=$api.byId("kcDiv");
				       if(init=='init'){
				       		$api.html(notice_content,'');
				       }
				      
			   				
						var content=txt.desc+"<br/>";
						var create_time=txt.start_time+"至"+txt.end_time;
						var title=txt.title;
						$api.html(notice_content,content);
						$api.html(title_div,title);
						$api.html(time_div,create_time);	
						//alert(path_url+'/yx/qnpaper/qnpaperAnswerResult');					
						api.ajax({
						    url: path_url+'/yx/qnpaper/qnpaperAnswerResult',
						    //url:'http://10.10.17.42/dsideal_yy/yx/qnpaper/qnpaperAnswerResult?random=0.20712630580254965&qnpaper_id=3&page_number=1&page_size=9999',
						    method: 'post',
						    timeout: 30,
						    cache:false,
						    dataTpye:'json',	
						   	data:{
					        values: {
					       			"qnpaper_id" :wjdc_id,
									"page_number" :1,
								    "page_size" : 9999
					       		 }	        	
					 		},
					 		headers : {
										'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
									}
						},function(ret,err){
							if (ret) {
					   			var urlJson = JSON.stringify(ret);
					   			//alert(urlJson);
				       			var txt= $api.strToJson(urlJson);
				       			var html='<ul class="list-unstyled">';
				       			totalwt=txt.list.length;
				       			for(var i=0;i<txt.list.length;i++){
				       				html+='<li><p>'+(i+1)+'、'+txt.list[i].title+'</p>';
				       				html+='<select id="qa_'+i+'" disabled="disabled">';
				       				for(var j=0;j<txt.list[i].list.length;j++){
				       					html+='<option  value="'+txt.list[i].qnqa_id+','+txt.list[i].list[j].id+'" ';
				       					if(txt.list[i].list[j].is_ans==1){
				       						html+=' selected="selected" ';
				       					}
				       					html+='>'+txt.list[i].list[j].title+'</option>';
				       				}
				       				html+='</select></li>';
				       			}
				       			html+='</ul>';
				       			$api.html(kcDiv, html);
				       		 }else {
							        errCode(err.code);
							   }
						});
				    }else {
				        errCode(err.code);
				   }
			});
		}
	function pub(){
	   //alert("提交");
	   api.showProgress({
					title : '提交中...',
					text : '请稍候...',
					modal : false
				});
		var wjdc_id=api["pageParam"]["wjdc_id"]; 
		api.ajax({
					    url: path_url+'/yx/qnpaper/qnanswerNum?random='+Math.random(),
					    method: 'post',
					    timeout: 30,
					    cache:false,
					    dataTpye:'json',
					    data:{values:{qnpaper_id:wjdc_id}},
					    headers : {
							'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
						}
					},function(ret,err){
						//alert(ret);
						if(ret){
							var urlJson = JSON.stringify(ret);
				       		var txt= $api.strToJson(urlJson);
				       		if(txt.ans_num&&txt.ans_num<=0){
				       			var qastr='';
				       			//alert(totalwt);
				       			for(var i=0;i<totalwt;i++){
				       				var s='qa_'+i;
				       				var qa_select=$api.byId(s);
				       				if(qa_select.value==null||qa_select.value==""){
				       					api.alert({
											msg : '第'+(i+1)+'题未回答!'
										}, function(ret, err) {
										});
										api.hideProgress();
										return false;
				       				}else{
				       					qastr+=qa_select.value+';';
				       				}
				       			}
				       			api.ajax({
								    url: path_url+'/yx/qnpaper/answer',
								    method: 'post',
								    timeout: 30,
								    cache:false,
								    dataTpye:'json',
								    data:{
								    	values:{
								    		qnpaper_id:wjdc_id,
								    		qaans:qastr,
								    		person_id:$api.getStorage("person_id"),
								    		person_name:$api.getStorage("person_name")
								    		}
								    	},
								    headers : {
										'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
									}
								},function(ret,err){
									//alert("回答开始:"+qastr);
									if(ret){
										api.hideProgress();
										var urlJson = JSON.stringify(ret);
				       					var txt= $api.strToJson(urlJson);
				       					//alert(txt.result);
				       					if(txt.result==true){
				       						api.alert({
											msg : '提交成功!'
											}, function(ret, err) {
											});
											api.execScript({
												name : 'wjdc_window',
												frameName:'wjdc_frame1',
												script : 'fillNotice();'
											});
											api.closeWin();
				       					}else{
				       						api.alert({
											msg : '提交失败!'
											}, function(ret, err) {
											});
				       					}
									}else {
											api.alert({
											msg : '提交失败!'
											}, function(ret, err) {
											});
									       errCode(err.code);
									   }
									});
				       		}else{
				       			api.hideProgress();
				       			api.alert({
									msg : '请不要重复回答问卷!'
								}, function(ret, err) {
								});
				       		}
						 }else {
						 	api.hideProgress();
					       errCode(err.code);
					   }
					});
	
	
	}
	    apiready = function(){
	      var wjdc_id=api["pageParam"]["wjdc_id"];
	           
	       fillscore();
	       api.ajax({
					    url: path_url+'/yx/qnpaper/qnanswerNum?random='+Math.random(),
					    method: 'post',
					    timeout: 30,
					    cache:false,
					    dataTpye:'json',
					    data:{values:{qnpaper_id:wjdc_id}},
					    headers : {
							'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
						}
					},function(ret,err){
						//alert(ret);
						if(ret){
							var urlJson = JSON.stringify(ret);
				       		var txt= $api.strToJson(urlJson);
				       		if(txt.ans_num&&txt.ans_num<=0){
				       			$api.css($api.byId('pubbutton'),'display:block;');
				       			$api.css($api.byId('putnotice'),'display:none;');
				       		}else{
				       			$api.css($api.byId('pubbutton'),'display:none;');
				       			$api.css($api.byId('putnotice'),'display:block;');
				       		}
				       		
				       		 }else {
					       errCode(err.code);
					   }
					});
	
	      /* api.addEventListener({
			    name:'scrolltobottom',
			    extra:{
			        threshold:0            //设置距离底部多少距离时触发，默认值为0，数字类型
			    }
			},function(ret,err){
			   var wjdc_id=api["pageParam"]["wjdc_id"];
				var data={
					id:wjdc_id
				};
				
			    findscore(data,'');
			});*/
			
	    };
