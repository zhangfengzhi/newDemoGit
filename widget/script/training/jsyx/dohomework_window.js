 var header_h; 
apiready = function(){	
	header_h=api.pageParam.header_h;
    var $header=$api.dom('.header');	
    $api.fixStatusBar($header);	
    var hw_id=api["pageParam"]["hw_id"];
    var ry_hw_id=api["pageParam"]["ry_hw_id"];
    var pxb_id=api["pageParam"]["pxb_id"];
    var state=api["pageParam"]["state"];
	
  	// $api.html($api.byId("title"), kc_name);
    api.openFrame ({	
        name: 'dohomework_frame1',	
        url: 'dohomework_frame1.html',	
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
function openHw(){
	var hw_id=api["pageParam"]["hw_id"];
	api.openWin ({
				name: 'show_homework_window',
				url: './show_homework_window.html',
				bounces : false,
						opaque : false,
						showProgress : false,
						vScrollBarEnabled : false,
						hScrollBarEnabled : false,
						slidBackEnabled : false,
						delay : 0,
						animation : {
							type : "reveal", //动画类型（详见动画类型常量）
							subType : "from_right", //动画子类型（详见动画子类型常量）
							duration : 300
						},
				pageParam: {
					hw_id :hw_id,
					header_h:api.pageParam.header_h
				}
			});
}	