   var header_h;
   apiready = function(){	
      header_h=api.pageParam.header_h;
      var $header=$api.dom('.header');	
      $api.fixStatusBar($header);	
      var kc_id=api["pageParam"]["kc_id"];
      var kc_name=api["pageParam"]["kc_name"];
      //$api.html($api.byId("title"), kc_name);
      api.openFrame ({	
            name: 'show_zzxx_frame1',	
            url: 'show_zzxx_frame1.html',	
            rect:{	
                x:0,	
                y:header_h,	
                w:'auto',	
                h:'auto'	
            },	
            bounces: false,	
            delay:200,
            pageParam: {kc_id: kc_id},	
        });	
    };	