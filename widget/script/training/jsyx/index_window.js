	var header_h;
	apiready=function(){	
		header_h=api.pageParam.header_h;
    	api.lockSlidPane();
        var $header=$api.dom('.header');	
        $api.fixStatusBar($header);	
        var $header_h=$api.offset($header).h;
        api.openFrame({	
            name:'index_frame1',	
            url:'index_frame1.html',	
            pageParam : {
					'header_h' : header_h,
			},
            rect:{	
                x:0,	
                y:header_h ,	
                w:'auto',	
                h:api.winHeight - header_h
            }	
        });
        api.addEventListener({
	        name:'keyback'
        },function(ret,err){
        api.closeWin();
        	//$api.clearStorage();
//			        api.closeWidget({
//		        		id: 'A6991302079844'
//	       			});
//        	api.confirm({
//			    title: '退出提示',
//			    msg: '确定要退出当前应用吗？',
//			    buttons:['确定', '取消']
//				},function(ret,err){
//			    if(ret.buttonIndex == 1){
//			    	$api.clearStorage();
//			        api.closeWidget({
//		        		id: 'A6991302079844'
//	       			});
//			    }
//			});
        });	
    }	
    function openSlide() {
//      api.openSlidPane ({
//          type: 'left'
//      });
		api.openWin({
				name : 'menu_window',
				url : './menu_window.html',   //index_window.html
				pageParam : {
					header_h : header_h
				},
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
			});
    }