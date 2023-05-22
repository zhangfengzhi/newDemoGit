	 var header_h;
	// 完成首页初始化	
    apiready = function(){
        header_h=api.pageParam.header_h;
        var $header=$api.dom('.header');	
       //$api.fixIos7Bar($header);
        $api.fixStatusBar($header);	
        $api.html($api.byId("title"), api.pageParam.course_name);
        var $header_h=$api.offset($header).h;	
        openLeftgroup (header_h);
        
    };	
	function openLeftgroup (header_h) {	
		api.ajax({
			url : $api.getStorage('BASE_URL_ACTION') + '/yx/pxclass/getJoinMeetingUrl',
			method : 'post',
			data:{
				values:{
					'course_id':api.pageParam.course_id,
					'person_id':$api.getStorage("person_id")
				}
			},
			dataType : 'json',
			headers : {
				'Cookie' : 'person_id=' + $api.getStorage("person_id") + ';identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("mytoken") + ';'
			}
		}, function(ret, err) {
			var urlJson = JSON.stringify(ret);
//				alert(urlJson);
			var txt= $api.strToJson(urlJson);
			if(txt.success){
				api.openFrame ({	
			        name: 'mycourse_frame1',	
			        url: txt.view_url,	
			        pageParam : {
							header_h : header_h
					},
			        rect:{	
			            x:0,	
			            y:header_h,	
			            w:'auto',	
			            h:'auto'	
			        },	
			        bounces: false,	
			        delay:200	
			    });	
			}
			
		});
	    
	}	
	