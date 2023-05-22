/*
*author:zhaoj
*function:设置上方数据显示
*date：20170502
*/
function initModeShow(){
    showSelfProgress('加载中...');
    init_yy_menu_new(function(code_list){
        setBasicData(code_list,function(data){
            api.hideProgress();
            if(api.uiMode == 'phone' || $api.getStorage('idy_id') == 2 || $api.getStorage('idy_id') == 3){
                commonAddOnceHtml('basic_body','basic_script',data);   
            }else{
                if($api.getStorage('idy_id') == 0){
                    commonAddOnceHtml('basic_body','basic_script',data);  
                }
                if($api.getStorage('idy_id') == 1){
                    commonAddOnceHtml('basic_body','basic_script',data);
                }
                setTimeout(function(){
                    if(data.list[0].list.length >8){
                        can_scrolltoBottom1 = true;
                    }
                    setMarginTop();
                },2000); 
            }
            api.hideProgress();
        });
    });
}
/*
*author:zhaoj
*function:设置模块上的消息提醒数量
*date：20180207
*/
function setModuleNum(type){
	switch(type*1){
		case 0:
			//通知公告
			var count_dom = $api.dom($api.byId('j_notice_index_window'),'.count');
		break;
		case 1:
			//我的考勤
		break;
		case 2:
			//考勤审批
			var count_dom = $api.dom($api.byId('j_kaoqin_kqsp_window'),'.count');
		break;
		case 3:
			//考勤管理
			var count_dom = $api.dom($api.byId('j_kaoqin_kqhz_window'),'.count');
		break;
	}
	var num = $api.text(count_dom);
	num--;
	num == 0?$api.addCls(count_dom, 'aui-hide'):$api.text(count_dom,num);
}


 /*
    *author:zhaoj
    *function:触摸结束
    *date：20171201
    */
    function touchEnd(e){
        
    }
    /*
    *author:zhaoj
    *function:设置页面向下滚动
    *date：20171201
    */
    function scrollToBottom(num){
    	if(num){
    		for(var i=1;i<= pageNum;i++){
	            if ($api.hasCls($api.byId('point_' + i), 'active')){
	            	$api.removeCls($api.byId('point_' + i), 'active');
	            	break;
	            }
	        }
	        $api.addCls($api.byId('point_' + num), 'active');
	    	if (num === 1){
	    		scrollToTop();
	    	}else{
		    	var scroll_height = $api.cssVal($api.byId('j_scroll'),'height');
		        scroll_height = scroll_height.substring(0,scroll_height.length-2);
		        scroll_height = scroll_height*(num - 1);
		        setTranslateY(-scroll_height);
	    	}
    	}else{
    		var scroll_height = $api.cssVal($api.byId('j_scroll'),'height');
	        scroll_height = scroll_height.substring(0,scroll_height.length-2);
	        scroll_height = scroll_height*1;
	        setTranslateY(-scroll_height);
	        $api.removeCls($api.byId('top_point'), 'active');
	        $api.addCls($api.byId('bottom_point'), 'active');
    	}
    }
    /*
    *author:zhaoj
    *function:设置页面向上滚动
    *date：20171201
    */
    function scrollToTop(){
        setTranslateY(0);
        $api.removeCls($api.byId('bottom_point'), 'active');
        $api.addCls($api.byId('top_point'), 'active');
    }
    /*
    *author:zhaoj
    *function:设置页面滚动之后的高度
    *date：20171201
    */
    function setTranslateY(y_value){
       $api.css($api.byId('j_scroll'),'-webkit-transform:translateY('+y_value+'px);');
       $api.css($api.byId('j_scroll'),'-moz-transform:translateY('+y_value+'px);');
       $api.css($api.byId('j_scroll'),'-o-transform:translateY('+y_value+'px);');
       $api.css($api.byId('j_scroll'),'-ms-transform:translateY('+y_value+'px);');
       $api.css($api.byId('j_scroll'),'transform:translateY('+y_value+'px);');
    }
    
    /*
     * 功能：打开模块
     * 作者：张自强
     * 时间：20180929
     */
    function openModuleIpad(win_url,type,code,menu,childMenu){
        openModule({'win_url':win_url,'type':type,'code':code,'menu':menu,'childMenu':childMenu});
    }
    

   /*
    *author:zhaoj
    *function:触摸开始记录位置
    *date：20171117
    */
     function touchSatrt(e){//触摸
        //e.preventDefault();
        var touch=e.touches[0];
        startY = touch.pageY;   //刚触摸时的坐标              
        startX = touch.pageX;   //刚触摸时的坐标   
    }