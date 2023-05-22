 var header_h; 
apiready = function(){	
	header_h=api.pageParam.header_h;
    var $header=$api.dom('.header');	
    $api.fixStatusBar($header);	
    var kj_id=api["pageParam"]["kj_id"];
    var kc_name=api["pageParam"]["kc_name"];
    var pxb_id=api["pageParam"]["pxb_id"];
	var kc_zjr=api["pageParam"]["kc_zjr"];
	var kc_dd=api["pageParam"]["kc_dd"];
	var kc_kj=api["pageParam"]["kc_kj"];
	var isbx=api["pageParam"]["isbx"];
	var course_id=api["pageParam"]["course_id"];
	
  	// $api.html($api.byId("title"), kc_name);
    api.openFrame ({	
        name: 'show_xxcourse_qdqk_frame1',	
        url: 'show_xxcourse_qdqk_frame1.html',	
        rect:{	
            x:0,	
            y:header_h,	
            w:'auto',	
            h:'auto'	
        },	
      
        bounces: false,	
        delay:200,
        pageParam: {header_h : header_h,kj_id: kj_id,pxb_id:pxb_id,kc_zjr:kc_zjr,course_id:course_id,kc_name:kc_name,kc_dd:kc_dd,kc_kj:kc_kj,isbx:isbx},	
    });	
};	