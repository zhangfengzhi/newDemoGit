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
	function fillResource(state){
		     
			var content=$api.byId("zy_content").value;  
			if(content==''||content==null){
				api.alert({
						msg : '检测内容不得为空。'
				});
				return null;
			}
			if(state==0){
				doHomework(state);
			}else{
			    api.confirm({
				    title: '提交检测',
				    msg: '提交检测被评价后不能修改，您确认提交检测吗？',
				    buttons: ['确定', '取消']
				}, function(ret, err){
					var urlJson = JSON.stringify(ret);
					var txt= $api.strToJson(urlJson);
				    if( txt.buttonIndex==1 ){
				         doHomework(state);
				    }
				});
	 		}
			
		}
	function doHomework(state){
		showSelfProgress('保存中...');
		var hw_id=api["pageParam"]["hw_id"];
		var ry_hw_id=api["pageParam"]["ry_hw_id"];
		var pxb_id=api["pageParam"]["pxb_id"];
		var person_id=$api.getStorage('person_id');	
		var content=$api.byId("zy_content").value;
		api.ajax({
			    url: path_url+'/yx/homework/doHomework',
			    method: 'post',
			    timeout: 30,
			    cache:false,
			    dataTpye:'json',	
			    data:{
			    	values: {
			        	homeworkId: hw_id,
			        	id:ry_hw_id,
			        	pxbId:pxb_id,
			        	state:state,
			        	person_id:person_id,
			        	hw_content:content,
			        	editor:content,
			        	resource_id:$api.val($api.byId("resource_id")),
			        	file_name:$api.val($api.byId("my_file_name"))
			        }        	
			 	},
			 	headers : {
						 'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
				}
			},function(ret,err){
			    if (ret) {
			    api.hideProgress();
			    api.alert({
							msg : '检测保存成功。'
					});
				toBack();
				 api.execScript({
				 	 name: 'xxhomework_window',
				 	 frameName: 'xxhomework_frame1',
                     script: 'fillHomework();'
                 });
                 
			     /* api.toast({
					    msg: '检测保存成功',
					    duration:2000,
					    location: 'middle'
					});*/
                 
			      
			    }else {
			    	api.hideProgress();
			         api.alert({
							msg : '检测保存失败。'
					});
			   }
		});
	}
	function initHomework(hw_id){
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
	function fillRYHomework(ry_hw_id){
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
//		       alert(urlJson);
		       var txt= $api.strToJson(urlJson);

				$api.val($api.byId("zy_content"),removeTag(txt[0].HW_CONTENT));
				var hw_resource_id=txt[0].RESOURCE_ID;
				if(hw_resource_id&&hw_resource_id!=""){	
					renderResource(hw_resource_id,$api.byId("my_file"),$api.byId("my_file_name"));
					$api.css($api.byId("insert_file"),"display:none;");
					$api.css($api.byId("insert_info"),"display:none;");
					$api.css($api.byId("my_file"),"display:block;");
					$api.css($api.byId("del_file"),"display:block;");	
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
	function uploadFile(){
			var fileBrowser = api.require('fileBrowser');
			fileBrowser.open({confirm:true},function(ret) {
			    if (ret) {
			    	fileBrowser.close();
//			        alert(JSON.stringify(ret));
			        var urlJson = JSON.stringify(ret);
			        var txt= $api.strToJson(urlJson);
			        var file_path=txt.url;
			        var nrr=file_path.split("/");
			        var file_name=nrr[nrr.length-1];
			        var arr=file_path.split(".");
			        var format=arr[arr.length-1];
			        var title=file_name.substring(0,file_name.length-format.length-1);
//			        alert(title);
			        if(format == 'doc' || format == 'docx' || format == 'ppt' || format == 'pptx'){
			        	showSelfProgress('上传中...');
			        	yxUploadFiles(file_path, function(is_true, a_file_id, a_ext) {
			        		insertFileInfo(a_file_id,title,a_ext)
			        	});
			        }else{
			        	popAlert('只允许上传格式为doc、docx、ppt、pptx的文件。');
			        }
			    }
			});
		}
	function insertFileInfo(file_id,title,format){
		api.ajax({
		    url: path_url+'/ypt/res/insert_resource_base_info',
		    method: 'post',
		    timeout: 30,
		    cache:false,
		    dataTpye:'json',	
		    data:{
		        values: {
		    			resource_title:Base64.encode(title),
		    			resource_format:format,
		    			file_id:file_id,
		    			person_name:Base64.encode($api.getStorage("person_name")),
		    			structure_id:-1,
		    			beike_type:-1,
		    			bk_type_name:-1,
		    			person_id:$api.getStorage("person_id"),
		    			m3u8_status:1,
		    			identity_id:$api.getStorage("identity"),
		    			app_type_id:-1,
		    			res_type:14,
		    			group_id:2
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
		       var resource_id=txt.resource_info_id;
		       $api.val($api.byId("resource_id"), resource_id);
		       renderResource(resource_id,$api.byId("my_file"),$api.byId("my_file_name"));
		       $api.css($api.byId("insert_file"),"display:none;");
		       $api.css($api.byId("insert_info"),"display:none;");
		       $api.css($api.byId("my_file"),"display:block;");
		       $api.css($api.byId("del_file"),"display:block;");
		       api.hideProgress();
		    }else {
		        errCode(err.code);
		   }
		});
	}
	function delFile(){
		$api.val($api.byId("resource_id"), "0");
		$api.val($api.byId("my_file_name"), "");
		$api.css($api.byId("insert_file"),"display:block;");
		$api.css($api.byId("insert_info"),"display:block;");
		$api.css($api.byId("my_file"),"display:none;");
		$api.css($api.byId("del_file"),"display:none;");
		$api.html($api.byId("my_file"), "");
	}
	function yxUploadFiles(file_path, callback) {
		
		//扩展名
		var ldot = file_path.lastIndexOf(".");
		var ext = file_path.substring(ldot + 1);
		ext = ext.toLocaleLowerCase();
		upload_count++;
		if (BASE_APP_TYPE == 1) {
			var v_guid = newGuid();
			//图片上传服务器时路径
			var _key = url_path_suffix + v_guid.substring(0, 2) + "/" + v_guid + "." + ext;
			notice_img_path = _key;
			api.ajax({
				url : $api.getStorage('BASE_URL_ACTION') + '/res/uploadFileToAliyun',
				method : 'post',
				timeout : 30,
				dataType : 'json',
				returnAll : false,
				data : {
					values : {
						key : _key
					},
					files : {
						file : file_path
					}
				}
			}, function(ret, err) {
				//					api.hideProgress();
				if (err) {
					if(upload_count < 10){
						callback(false, '', '');
					}else{
						
						popAlert('上传失败，请稍候重试');
						api.hideProgress();
					}
				} else {
					if (ret.success) {
						callback(true, v_guid, ext);
					} else {
						if(upload_count < 10){
							callback(false, '', '');
						}else{
							
							popAlert('上传失败，请稍候重试');
							api.hideProgress();
						}
					}
				}
			});
		} else {
			//局版
			var v_guid = newGuid();
			var extension = ext;
			//图片上传服务器时路径
			var _key = url_path_suffix + v_guid.substring(0, 2) + "/" + v_guid + "." + ext;
			api.ajax({
				url : $api.getStorage('BASE_URL_ACTION') + '/res/newUpload/',
				method : 'post',
				timeout : 30,
				dataType : 'json',
				returnAll : false,
				data : {
					values : {
						key : _key
					},
					files : {
						file : file_path
					}
				}
			}, function(ret, err) {
				//					api.hideProgress();
				if (err) {
					if(upload_count < 10){
						callback(false, '', '');
					}else{
						upload_count = 0;
						popAlert('上传失败，请稍候重试');
						api.hideProgress();
					}
				} else {
					if (ret.success) {
						upload_count = 0;
						callback(true, v_guid, extension);
					} else {
						if(upload_count < 10){
							callback(false, '', '');
						}else{
							upload_count = 0;
							popAlert('上传失败，请稍候重试');
							api.hideProgress();
						}
					}
				}
			});
		}
	}
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
	apiready = function(){	
		var hw_id=api["pageParam"]["hw_id"];
		var ry_hw_id=api["pageParam"]["ry_hw_id"];
		var pxb_id=api["pageParam"]["pxb_id"];
		var state=api["pageParam"]["state"];
		var person_id=$api.getStorage('person_id');	
		initHomework(hw_id);
		if(state==0){
			fillRYHomework(ry_hw_id);
		}
		//fillResource(hw_id,ry_hw_id,pxb_id,state,person_id);
		
	}	