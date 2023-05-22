 	var header_h;
    apiready = function(){	    
      header_h=api.pageParam.header_h;
      var $header=$api.dom('.header');	
      $api.fixStatusBar($header);	
      var hw_id=api["pageParam"]["hw_id"];
	  var ry_hw_id=api["pageParam"]["ry_hw_id"];
	  var pxb_id=api["pageParam"]["pxb_id"];
	  var state=api["pageParam"]["state"];
      api.openFrame ({	
            name: 'show_homework_frame',	
            url: 'show_homework_frame.html',	
            rect:{	
                x:0,	
                y:header_h,	
                w:'auto',	
                h:'auto'	
            },	
            bounces: false,	
            delay:200,
            pageParam: {hw_id: hw_id,ry_hw_id:ry_hw_id,pxb_id:pxb_id,state:state},	
        });	
    };	
  