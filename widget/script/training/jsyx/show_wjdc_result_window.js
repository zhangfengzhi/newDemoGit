 	var header_h;
    apiready = function(){	    
      header_h=api.pageParam.header_h;
      var $header=$api.dom('.header');	
      $api.fixStatusBar($header);	
      var wjdc_id=api["pageParam"]["wjdc_id"];
      var title=api["pageParam"]["title"];
      
      
      $api.html($api.byId("title"), title);
      api.openFrame ({	
            name: 'show_dcwj_result_frame',	
            url: 'show_dcwj_result_frame.html',	
            rect:{	
                x:0,	
                y:header_h,	
                w:'auto',	
                h:'auto'	
            },	
            bounces: false,	
            delay:200,
            pageParam: {wjdc_id: wjdc_id},	
        });	
    };	
  