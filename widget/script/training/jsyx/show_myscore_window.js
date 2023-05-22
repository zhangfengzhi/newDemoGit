 	var header_h;
    apiready = function(){	    
      header_h=api.pageParam.header_h;
      var $header=$api.dom('.header');	
      $api.fixStatusBar($header);	
      var pxbId=api["pageParam"]["pxbId"];
      var pxb_name=api["pageParam"]["pxb_name"];
      var pxb_type=api["pageParam"]["pxb_type"];
      
      $api.html($api.byId("title"), pxb_name);
      api.openFrame ({	
            name: 'show_myscore_frame',	
            url: 'show_myscore_frame.html',	
            rect:{	
                x:0,	
                y:header_h,	
                w:'auto',	
                h:'auto'	
            },	
            bounces: false,	
            delay:200,
            pageParam: {pxbId: pxbId,pxb_type:pxb_type},	
        });	
    };	
  