 var header_h; 
apiready = function(){	
	header_h=api.pageParam.header_h;
    var $header=$api.dom('.header');	
    $api.fixStatusBar($header);	
    var kc_id=api["pageParam"]["kc_id"];
    var kc_name=api["pageParam"]["kc_name"];
    var pxb_id=api["pageParam"]["pxb_id"];
    var kj_id=api["pageParam"]["kj_id"];
	var kc_zjr=api["pageParam"]["kc_zjr"];
	var kc_dd=api["pageParam"]["kc_dd"];
  	// $api.html($api.byId("title"), kc_name);
  	
    api.openFrame ({	
        name: 'xxcourse_detail_frame1',	
        url: 'xxcourse_detail_frame1.html',	
        rect:{	
            x:0,	
            y:header_h,	
            w:'auto',	
            h:'auto'	
        },	
        bounces: false,	
        delay:200,
        pageParam: {kc_id: kc_id,pxb_id:pxb_id,kj_id:kj_id,kc_zjr:kc_zjr,kc_dd:kc_dd,kc_name:kc_name,header_h:header_h},	
    });	
};	