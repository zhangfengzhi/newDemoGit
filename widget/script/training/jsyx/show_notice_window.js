 	var header_h;
    apiready = function(){	    
      header_h=api.pageParam.header_h;
      var $header=$api.dom('.header');	
      $api.fixStatusBar($header);	
      var notice_id=api["pageParam"]["notice_id"];
      var title=api["pageParam"]["title"];
      
      
      $api.html($api.byId("title"), title);
      api.openFrame ({	
            name: 'show_notice_frame',	
            url: 'show_notice_frame.html',	
            rect:{	
                x:0,	
                y:header_h,	
                w:'auto',	
                h:'auto'	
            },	
            bounces: false,	
            delay:200,
            pageParam: {notice_id: notice_id},	
        });	
    };	
  