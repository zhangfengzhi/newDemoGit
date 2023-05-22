// 完成首页初始化	
var header_h;
apiready = function(){	
    header_h=api.pageParam.header_h;
    var $header=$api.dom('.header');	
    $api.fixStatusBar($header);	
    var $header_h=$api.offset($header).h;	
	api.openFrame ({	
        name: 'zzxxtj_frame1',	
        url: 'zzxxtj_frame1.html',	
     	pageParam : {
			header_h : header_h,
		},
        rect:{	
            x:0,	
            y:header_h,	
            w:'auto',	
            h:'auto'
        }
    });	
      api.addEventListener({
			    name:'viewappear'
			},function(ret,err){
				var jsfun = 'updateTime();';
				api.execScript({
				    frameName: 'zzxxtj_frame1',
				    script: jsfun
				});
			});	
};	