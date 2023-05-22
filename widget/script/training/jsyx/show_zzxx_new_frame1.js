	var kc_id=0;
	var interval_id = null;
	var maxTime=0;
	var minTime=0;
	var kc_ks=0;
	var ljsj_has="";
	var kc_ly="";  //dsideal
	//填充数据
	function fillResource(kc_id){
		api.ajax({
		    url: path_url+'/yx/yd/findZzxxCourseDetail',
		    method: 'post',
		    timeout: 30,
		    cache:false,
		    dataTpye:'json',	
		    data:{
		        values: {
					'kc_id': kc_id,
					'person_id':$api.getStorage('person_id')
		        }			        	
		 	}
		},function(ret,err){
		    if (ret) {
		       var urlJson = JSON.stringify(ret);
		       var txt= $api.strToJson(urlJson);
		       var kcxxDiv=$api.byId("kcxx");
		        var html='<table>';
		       html+='<tr><td class="td1">课程名称 ： </td><td class="td2">'+txt.kcxx[0].KC_NAME+'</td></tr>';
		       html+='<tr><td class="td1">课程课时 ： </td><td class="td2">'+txt.kcxx[0].KC_KS+'分钟</td></tr>';
		       var type=txt.kcxx[0].TYPE;
		       var zz='';
		        if(type==1){
		       		zz="专家姓名 ：";
		       		html+='<tr><td class="td1">课程分类 ：</td><td class="td2"> 专家讲座</td></tr>';
		       }
		       if(type==2){
		       		zz="制做团队 ：";
		       		html+='<tr><td class="td1">课程分类 ：</td><td class="td2"> 网络课程</td></tr>';
		       }
		       if(type==3){
		       		zz="作者姓名 ：";
		       		html+='<tr><td class="td1">课程分类 ： </td><td class="td2">案例分析</td></tr>';
		       }		
		       html+='<tr><td style="align:left; valign:top;" class="td1">'+zz+'</td><td class="td2">'+txt.kcxx[0].KC_ZZ+'</td></tr>';
		       html+='<tr><td class="td1">课程介绍 ：</td><td class="td2">';
		       if(txt.kcxx[0].MEMO==null || txt.kcxx[0].MEMO=='null'){
		       		html+="暂无介绍";
		       }else{
		       		html+=txt.kcxx[0].MEMO;
		       }
		       html+='</td></tr></table>';
		       $api.append(kcxxDiv, html);
		      
		    }else {
		        errCode(err.code);
		   }
		});
	}
	function pickCourse(){
		
		 api.confirm({
			    title: '选课',
			    msg: '您确认选择该自主学习课程吗？',
			    buttons: ['确定', '取消']
			}, function(ret, err){
				var urlJson = JSON.stringify(ret);
				var txt= $api.strToJson(urlJson);
			    if(txt.buttonIndex==1){
			    	var kc_id=api["pageParam"]["kc_id"];
					var person_id=$api.getStorage('person_id');
			         api.ajax({
					    url: path_url+'/zzxx/zzxxAdd',
					    method: 'post',
					    timeout: 30,
					    cache:false,
					    dataType:'text',	
					    data:{
					    	values: {
					        	kc_id: kc_id,
					        	person_id:person_id
					        }        	
					 	}
					},function(ret,err){
						if (ret=="1") {
					    api.alert({
									msg : '选课成功。'
							});
						toBack();
						 api.execScript({
						 	 name: 'zzxx_window',
						 	 frameName: 'zzxx_frame1',
	                         script: 'fillCourse();'
                         });
                         }else{
                         api.alert({
									msg : '选课失败。'
							});
							toBack();
                         }
                          });
						}
				});
	}
	apiready = function(){	
		var kc_id=api["pageParam"]["kc_id"];
		fillResource(kc_id);
	}	