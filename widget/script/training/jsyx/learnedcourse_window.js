	var header_h;
	// 完成首页初始化	
    apiready = function(){	
        header_h=api.pageParam.header_h;
        var $header=$api.dom('.header');	
        $api.fixStatusBar($header);	
        var $header_h=$api.offset($header).h;	
        openLeftgroup(header_h);
    };    
	function openLeftgroup (header_h) {	
	    api.openFrame ({	
	        name: 'learnedcourse_frame1',	
	        url: 'learnedcourse_frame1.html',	
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
   