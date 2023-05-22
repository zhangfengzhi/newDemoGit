var page_number=1;
var kc_type=1;
    function initSlide() {	
        var $pointer = $api.byId('pointer');	
        window.mySlide = Swipe(slide, {	
        	auto:3000,	
            continuous: true,	
            disableScroll: true,	
            stopPropagation: true,	
            callback: function (index, element) {		
                var $actA = $api.dom($pointer, 'a.active');	
                $api.removeCls($actA, 'active');	
                $api.addCls($api.eq($pointer, index + 1), 'active');	
            },	
            transitionEnd: function (index, element) {	
            }	
        });	
    }	
    function findNews(){
    	isOnLineStatus(function(is_online, line_type) {
			if (is_online) {
		    	api.showProgress({
					title : '加载中...',
					text : '请稍候...',
					modal : false
				});
				api.ajax({
					    url: path_url+'/yx/yd/kctjPage',
					    method: 'post',
					    timeout: 30,
					    cache:false,
					    dataTpye:'json',	
					    data:{
					        values: {
									 'page_number':page_number,
									 'page_size':15,
									 'type':kc_type
					        }			        	
					 	}
					},function(ret,err){
					    if (ret) {
					       var urlJson = JSON.stringify(ret);
					       var txt= $api.strToJson(urlJson);
					       var kcDiv=$api.byId("kcListDiv");
					       if(page_number==1){
				       		   $api.html(kcDiv, "");  
				       	   }
					       for(var i=0;i<txt.list.length;i++){
					       		var index=Math.ceil(Math.random()*9);
					       		var html='<div class="item style1" tapmode="itemhover" onclick="openCourse('+txt.list[i].id+',\''+txt.list[i].kc_name+'\');">'
							         +	 '<div class="itemlogo userlogo"><img src="../../../image/training/jsyx/js_s'+index+'.jpg" alt=""></div>'
							         +	 '<div class="itemshelf">'	
				            		 +	 	'<div class="shelfinfo01">'+txt.list[i].kc_name+'</div>'	
				            		 +	 	'<div class="shelfinfo04">课时 ： '+txt.list[i].kc_ks+'分钟</div>'	 			
				        			 +	 '</div>'	
				    				 +'</div>';	
							    $api.append(kcDiv,html);
					       }
					      api.hideProgress(); 
					      if(txt.list.length==0){//说明没查出信息，需要判断原有div里边是否有信息，如果有，那么什么都不做，如果没有，加上没有培训班的提示信息。
						  		var n=document.getElementById("kcListDiv").innerHTML;			   
						   		if(n==null||n==""){			      
						      		$api.append(kcDiv,"<div align='center' style='margin-top:50px;'><h3>暂无推荐课程</h3></div>");
						  		}else{
						  			api.toast({
									    msg: '已加载所有数据',
									    duration:2000,
									    location: 'middle'
									});
						  		}				
						  }
						  
					    }else {
					       errCode(err.code);
					   }
				});
			}else {
				api.toast({
				    msg: '网络连接失败，请检查您的网络设置',
				    duration:2000,
				    location: 'middle'
				});
			}
		});		
	}	
	
	function openCourse(kc_id,kc_name){
	    api.openWin({
			name : 'show_tjkc_window',
			url : './show_tjkc_window.html',   //index_window.html
			pageParam : {
				kc_id :kc_id,
				kc_name : kc_name,
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
	function changeType(type){
		$api.removeCls($api.byId("type1"), "check");
		$api.removeCls($api.byId("type2"), "check");
		$api.removeCls($api.byId("type3"), "check");
		$api.addCls($api.byId("type"+type), "check");
		kc_type=type;
		page_number=1; 
		findNews();
	}	
	
	var header_h;
     apiready = function(){
		header_h=api.pageParam.header_h;
		var $header=$api.dom('.header');
       initSlide();
       findNews();
       api.addEventListener({
		    name:'scrolltobottom',
		    extra:{
		        threshold:0            //设置距离底部多少距离时触发，默认值为0，数字类型
		    }
		},function(ret,err){
		    page_number=page_number+1;
		     if($api.html($api.byId("kcListDiv")).indexOf("暂无推荐课程")>-1){
		        page_number=1; 
		    }
		    findNews();
		});
		
    };
