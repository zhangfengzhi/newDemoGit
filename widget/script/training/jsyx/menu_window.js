	var header_h;
    apiready = function(){
        header_h=api.pageParam.header_h;
    	api.lockSlidPane();
        var $header=$api.dom('.header');	
       //$api.fixIos7Bar($header);
        $api.fixStatusBar($header);	
        var $header_h=$api.offset($header).h;	
        api.openFrame({	
            name:'menu_frame1',	
            url:'menu_frame1.html',	
            pageParam : {
					'header_h' : header_h,
					'h': api.winHeight - header_h - 50
				},
            rect:{	
                x:0,	
                y:header_h ,	
                w:'auto',	
                h:'auto'
            }	
        });
    }