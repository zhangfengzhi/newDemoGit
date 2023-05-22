 var header_h; 
apiready = function(){	
	header_h=api.pageParam.header_h;
    var $header=$api.dom('.header');	
    $api.fixStatusBar($header);	
    var kj_id=api["pageParam"]["kj_id"];
    var person_id=api["pageParam"]["person_id"];
    var pxb_id=api["pageParam"]["pxb_id"];
    var kc_id=api["pageParam"]["kc_id"];
	
		
  	//$api.html($api.byId("title"), kc_name);
    api.openFrame ({	
        name: 'pspj_frame1',	
        url: 'pspj_frame1.html',	
        rect:{	
            x:0,	
            y:header_h,	
            w:'auto',	
            h:'auto'	
        },	
        bounces: false,	
        delay:200,
        pageParam: {kj_id: kj_id,person_id:person_id,pxb_id:pxb_id,kc_id:kc_id},	
    });	
};	