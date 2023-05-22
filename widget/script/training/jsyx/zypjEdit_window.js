 var header_h; 
apiready = function(){	
	header_h=api.pageParam.header_h;
    var $header=$api.dom('.header');	
    $api.fixStatusBar($header);	
    var id=api["pageParam"]["id"];
    var hw_id=api["pageParam"]["hw_id"];
    var xf=api["pageParam"]["xf"];
	
		
  	//$api.html($api.byId("title"), kc_name);
    api.openFrame ({	
        name: 'zypjEdit_frame1',	
        url: 'zypjEdit_frame1.html',	
        rect:{	
            x:0,	
            y:header_h,	
            w:'auto',	
            h:'auto'	
        },	
        bounces: false,	
        delay:200,
        pageParam: {id: id,hw_id:hw_id,xf:xf,header_h:header_h},	
    });	
};	