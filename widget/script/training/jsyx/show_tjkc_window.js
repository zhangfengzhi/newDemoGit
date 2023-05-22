 var header_h;
 apiready = function(){	
 	  header_h=api.pageParam.header_h;
      var $header=$api.dom('.header');	
      $api.fixStatusBar($header);	
      var kc_id=api["pageParam"]["kc_id"];
      var kc_name=api["pageParam"]["kc_name"];
      api.openFrame ({	
            name: 'show_tjkc_frame1',	
            url: 'show_tjkc_frame1.html',	
            pageParam : {
					'header_h' : header_h,
			},
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