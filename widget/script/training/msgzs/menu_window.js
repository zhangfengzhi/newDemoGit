	var header_h;
    apiready = function(){
        header_h=api.pageParam.header_h;
        var id=api.pageParam.org_id;
        var type=api.pageParam.org_type;
        var name=api.pageParam.org_name;
        var isadmin=api.pageParam.isadmin;
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
					'org_id': id,
					'org_type': type,
					'org_name': name,
					'isadmin' : isadmin,
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