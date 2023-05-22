   var header_h;
   var urls='zzxx_frame1.html';
	// 完成首页初始化	
    apiready = function(){	
        header_h=api.pageParam.header_h;
        var $header=$api.dom('.header');	
        $api.fixStatusBar($header);	
        var $header_h=$api.offset($header).h;	
        var servername=$api.getStorage('BASE_SERVER_NAME');
        if(servername=='edusoa'||servername=='xmhc'||servername=='199'){
        	urls='zzxx_new_frame1.html';
        }
        openLeftgroup(header_h);
        api.addEventListener({
			    name:'viewappear'
			},function(ret,err){
				var jsfun = 'updateTime();';
				api.execScript({
				    frameName: 'zzxx_frame1',
				    script: jsfun
				});
		});
    };    
   function openLeftgroup (header_h) {	
        api.openFrame ({	
            name: 'zzxx_frame1',	
            url: urls,
            pageParam : {
				header_h : header_h
			},	
            rect:{	
                x:0,	
                y:header_h,	
                w:'auto',	
                h:'auto'	
            },	
            bounces: false,	
            delay:200	
        });	
    }	
	
