
		//查询成绩
	    function findHomework(hw_id){
			api.ajax({
		    url: path_url+'/yx/homework/findHomeworkById',
		    method: 'post',
		    timeout: 30,
		    cache:false,
		    dataTpye:'json',	
		    data:{
		        values: {
		    			homeworkId:hw_id
				    }	        	
		 	},
		 	headers : {
						'Cookie' : 'person_id='+$api.getStorage("person_id")+'; identity_id='+$api.getStorage("identity")+';'
			}
		},function(ret,err){
		    if (ret) {
		       var urlJson = JSON.stringify(ret);
//		       alert(urlJson);
		       var txt= $api.strToJson(urlJson);

				$api.html($api.byId("hw_name"),txt[0].HW_NAME);
				$api.html($api.byId("hw_nr"),removeTag(txt[0].HW_NR));
				var hw_resource_id=txt[0].HW_RESOURCE_ID;
				if(hw_resource_id&&hw_resource_id!=""){	
					var resource_div=$api.byId("hw_resource");		
					renderResource(hw_resource_id,resource_div);
		        }
		    }else {
		        errCode(err.code);
		   }
	});
		}
		function fillRyHomework(ry_hw_id){
			api.ajax({
			    url: path_url+'/yx/homework/findRYHomeworkById',
			    method: 'post',
			    timeout: 30,
			    cache:false,
			    dataTpye:'json',	
			    data:{
			        values: {
			    			id:ry_hw_id
					    }	        	
			 	},
			 	headers : {
							'Cookie' : 'person_id='+$api.getStorage("person_id")+'; identity_id='+$api.getStorage("identity")+';'
				}
			},function(ret,err){
			    if (ret) {
			       var urlJson = JSON.stringify(ret);
			       
			       var txt= $api.strToJson(urlJson);
	
					$api.html($api.byId("zy_content"),removeTag(txt[0].HW_CONTENT));
					var hw_resource_id=txt[0].RESOURCE_ID;
					var pj_level=txt[0].PJ_LEVEL;
					var pj_content=txt[0].PJ_CONTENT;
					if(pj_level=="1"){
						$api.html($api.byId("hw_pj"), "<font color='#7CCD7C'>优秀</font>");
					}
					if(pj_level=="2"){
						$api.html($api.byId("hw_pj"), "<font color='#7CCD7C'>良好</font>");
					}
					if(pj_level=="3"){
						$api.html($api.byId("hw_pj"), "<font color='#7CCD7C'>及格</font>");
					}
					if(pj_level=="4"){
						$api.html($api.byId("hw_pj"), "<font color='red'>不及格</font>");
					}
					if(pj_content!=null){
						$api.html($api.byId("hw_py"), pj_content);
					}
					if(hw_resource_id&&hw_resource_id!=""){	
						renderResource(hw_resource_id,$api.byId("my_file"),$api.byId("my_file_name"));
						
						
			        } 
			    }else {
			        errCode(err.code);
			   }
		});
		}
		/*
	 * 增加附件预览
	 */
	function renderResource(resource_id,resource_div,value_input){
		api.ajax({
		    url: path_url+'/yx/jsfc/findJSPicbyResId',
		    method: 'post',
		    timeout: 30,
		    cache:false,
		    dataTpye:'json',	
		    data:{
		        values: {
		    			resource_id	:resource_id
				    }	        	
		 	},
		 	headers : {
					 'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
			}
		},function(ret,err){
		    if (ret) {
		       var urlJson = JSON.stringify(ret);
//		       alert(urlJson);
		       var txt= $api.strToJson(urlJson);
		       var render_html='<a href="javascript:void(0);" onclick="openContent(\''+txt[0].file_id+'\',\''+txt[0].resource_title+'\','+txt[0].preview_status+','+txt[0].m3u8_status+',\''+txt[0].resource_format+'\',\''+txt[0].resource_id_int+'\')">'+txt[0].resource_title+'.'+txt[0].resource_format+'</a>';
		       $api.html(resource_div,render_html);
		       $api.val(value_input,txt[0].resource_title+'.'+txt[0].resource_format);
		    }else {
		        errCode(err.code);
		   }
		});
	}
	function removeTag(str){
		var dd=str.replace(/<\/?.+?>/g,"");
 		var dds=dd.replace(/ /g,"");
 		return dds;
	}
	    apiready = function(){
	      var hw_id=api["pageParam"]["hw_id"];
	      var ry_hw_id=api["pageParam"]["ry_hw_id"];     
	      findHomework(hw_id);
	      fillRyHomework(ry_hw_id);
			
	    };
/*
	*author:zhaoj
	*function:查看内容
	*date：20170329
	*/
	function openContent(file_id,title,preview_status,m3u8_status,resource_format,resource_id_int){
//		alert(resource_format);
		if(preview_status == 0 &&　!(resource_format == 'doc' || resource_format == 'docx' || resource_format == 'ppt' || resource_format == 'pptx' || resource_format == 'xls' || resource_format == 'xlsx' )){
			popAlert('对不起，正在生成预览中，请稍候查看。');
		}else if(preview_status == 1){
			common_openResource.open(resource_format,file_id,title,m3u8_status,api.winName,'reBackType("voice","","");','back();',resource_id_int);
		}else{
			if(resource_format == 'doc' || resource_format == 'docx' || resource_format == 'ppt' || resource_format == 'pptx' || resource_format == 'xls' || resource_format == 'xlsx' ){
                        common_openResource.open(resource_format,file_id,title,m3u8_status,api.winName,'reBackType("voice","","");','back();',resource_id_int);
            }else{
                popAlert('对不起，该文件生成预览失败。');
            }
		}
	}