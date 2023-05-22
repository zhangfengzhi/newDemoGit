	var pl_number=1;
	var pxb_id=0;
	var kc_id=0;
	var flag=0;
	var interval_id = null;
	var maxTime=0;
	var minTime=0;
	var kc_ks=0;
	var ljsj_has="";
	var kc_ly="";
		
	//填充数据
	function fillResource(kc_id,kc_name,pxb_id,kc_kj,kc_isbx,kc_zjr,kc_dd){
		       
		       
		       var kcxxDiv=$api.byId("kcxx");
		         var html='<table>';
		       
		         
		       html+='<tr><td class="td1">课程名称 ： </td><td class="td2">'+kc_name+'</td></tr>';
		       html+='<tr><td class="td1">课程课节 ： </td><td class="td2">'+kc_kj+'节</td></tr>';
		       
		        if(kc_isbx==1){
		 
		       		html+='<tr><td class="td1">课程分类 ：</td><td class="td2"> 必修课程</td></tr>';
		       }
		       if(kc_isbx==0){
		       		
		       		html+='<tr><td class="td1">课程分类 ：</td><td class="td2"> 选修课程</td></tr>';
		       }
		       	
		       html+='<tr><td style="align:left; valign:top;" class="td1">主讲人</td><td class="td2">'+kc_zjr+'</td></tr>';
		       html+='<tr><td class="td1">上课地点 ：</td><td class="td2">';
		       html+=kc_dd;
		       html+='</td></tr></table>';
		       $api.append(kcxxDiv, html);
		       fillCoursetime(kc_id,'');
		       
		
	}
	//填充课程表
	 function fillCoursetime(kc_id,init){
	 		var pxb_id=api["pageParam"]["pxb_id"];
			api.ajax({
				    url: path_url+'/yx/bindpxb/xxkcDetail',
				    method: 'post',
				    timeout: 30,
				    cache:false,
				    dataTpye:'json',	
				    data:{
				    	values: {
				        	id: kc_id	
				        }        	
				 	}
				},function(ret,err){
				    if (ret) {
				       var urlJson = JSON.stringify(ret);
				       var txt= $api.strToJson(urlJson);
				       var kcDiv=$api.byId("list");
				       if(init=='init'){
				       		$api.html(kcDiv,'');
				       }
				       
				        for(var i=0;i<txt.xxkjList.length;i++){
				        
						   
				         var html=
				            		'<div class="cnt" onclick="kjDetail('+txt.xxkjList[i].id+','+kc_id+','+pxb_id+')">'					            		
						            	+'<div class="wrap">'	
							            	+'<div class="wrap2">'	
								            	+'<div class="content">'	
								                	+'<div class="shopname"><span style="height:50px;line-height:50px;text-decoration:underline;color: #0000FF">第'+(i+1)+'节:'+txt.xxkjList[i].xxkc_kssj+'——'+txt.xxkjList[i].xxkc_jssj+'</span>'+'</div>'			
								            	+'</div>'	
							            	+'</div>'           	
						           		+'</div>'	
				            		+'</div>';
						  $api.append(kcDiv,html);
				       }
				    }else {
				        errCode(err.code);
				   }
			});
		}
	
	 function kjDetail(kj_id,kc_id,pxb_id){
	 var header_h=api.pageParam.header_h;
	 	api.openWin ({
		name: 'xxcourse_detail_window',
		url: './xxcourse_detail_window.html',
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
			kc_id :kc_id,
			kc_name : api["pageParam"]["kc_name"],
			pxb_id :pxb_id,
			kj_id:kj_id,
			kc_zjr:api["pageParam"]["kc_zjr"],
			kc_dd:api["pageParam"]["kc_dd"],
			header_h : header_h
		}
		});
	 }
	
	apiready = function(){	
		var kc_id=api["pageParam"]["kc_id"];
		var pxb_id=api["pageParam"]["pxb_id"];
		var kc_kj=api["pageParam"]["kc_kj"];
		var kc_isbx=api["pageParam"]["kc_isbx"];
		var kc_zjr=api["pageParam"]["kc_zjr"];
		var kc_dd=api["pageParam"]["kc_dd"];
		var kc_name=api["pageParam"]["kc_name"];	
		fillResource(kc_id,kc_name,pxb_id,kc_kj,kc_isbx,kc_zjr,kc_dd);
		
	}	