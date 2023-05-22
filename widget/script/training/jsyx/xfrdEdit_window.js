 var header_h; 
apiready = function(){	
	header_h=api.pageParam.header_h;
    var $header=$api.dom('.header');	
    $api.fixStatusBar($header);	
    var xf_id=api["pageParam"]["xf_id"];
    var person_id=api["pageParam"]["person_id"];
    var pxb_id=api["pageParam"]["pxb_id"];
    var xf=api["pageParam"]["xf"];
	
		
  	//$api.html($api.byId("title"), kc_name);
    api.openFrame ({	
        name: 'xfrdEdit_frame1',	
        url: 'xfrdEdit_frame1.html',	
        rect:{	
            x:0,	
            y:header_h,	
            w:'auto',	
            h:'auto'	
        },	
        bounces: false,	
        delay:200,
        pageParam: {xf_id: xf_id,person_id:person_id,pxb_id:pxb_id,xf:xf,header_h:header_h},	
    });	
};	