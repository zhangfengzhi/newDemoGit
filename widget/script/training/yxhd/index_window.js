     var header_h;
    // 完成首页初始化  
    apiready = function(){
        commonSetTheme({"level":5,"type":0});
        header_h=api.pageParam.header_h;
        var $header=$api.dom('.header');    
       //$api.fixIos7Bar($header);
        $api.fixStatusBar($header); 
        var $header_h=$api.offset($header).h;   
        openLeftgroup(header_h);    
        api.addEventListener({
            name:'viewappear'
        },function(ret,err){
            var jsfun = 'updateCourseTime();';
            api.execScript({
                frameName: 'yxhd_index_frame1'
            });
        });
    };  
    function openLeftgroup (header_h) { 
        api.openFrame ({    
            name: 'yxhd_index_frame1',  
            url: 'yxhd_index_frame1.html',  
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
    