/*
 * 改变机构类型
 * zhaoj
 * 20170721
 */
function getOrgIdOrgTypeOrgName(){
	commonSamePerson({"type":0,"name":'quanzi_first_change_id'+ $api.getStorage('person_id')},function(flag){
		if(flag){
			org_type = $api.getStorage('quanzi_first_change_type'+ $api.getStorage('person_id'));
			org_id = $api.getStorage('quanzi_first_change_id'+ $api.getStorage('person_id'));
			org_name = $api.getStorage('quanzi_first_change_name'+ $api.getStorage('person_id'));
		}else{
			if($api.getStorage('identity') == 5){
				//教师
				org_type = 104;
				org_id = $api.getStorage('school_id');
				org_name = $api.getStorage('school_name');
			}else{
				//学生
				org_type = 105;
				org_id = $api.getStorage('class_id');
				org_name = $api.getStorage('class_name');
			}
		}
		initData(1,null,0);
	});
}
/*
 * 改变机构类型
 * zhaoj
 * 20170721
 */
function changeQuanziType(o_type,id,name){
	org_id = id;
	org_name = name;
	org_type = o_type;
	initData(1);
	if(org_type == 104 && $api.getStorage('identity') == 6){
		commonExecScript('root','','commonAddOrRemoveHideCss("j_quanzi_add",0);',0);
	}else if(org_type == 105 && $api.getStorage('identity') == 6){
		commonExecScript('root','','commonAddOrRemoveHideCss("j_quanzi_add",1);',0);
	}
}
/**
* 打开圈子筛选界面
* 王俭
* 2018.4.24
*/
function openScreenWindow(pageParamJson){
	pageParamJson.org_id = org_id;
	commonOpenWin("init_screen_window","widget://html/init/iphone/init_screen_window.html",false,false,pageParamJson);
}
/*
 * 打开详情页面
 * 张自强
 * 20170721
 */
function openXQ(id,expand_id,title,avatar_fileid,type,category_id,person_name,create_time,person_id,identity,loging_name,curPage){
	addBrowseNum(id, expand_id, function(flag,text){
		if(!flag){
			popToast(text);
		}
	}); 
	var pageParamJson={
	   "header_h":header_h,
	   "wz_id":id,
	   "expand_id":expand_id,
	   "menu_type":org_type,
	   "menu_id":org_id,
	   "type":type,
	   "title":title,
	   "currentPage":curPage,
	   'avatar_fileid':avatar_fileid,
	   'is_jump':type,
	   'category_id':category_id,
	   'person_name':person_name,
	   'create_time':create_time,
	   'person_id':person_id,
	   'open_menu_type' : 2,
	   'org_type':org_type,
	   'identity':identity,
	   'loging_name':loging_name,
	   };
	   
	 $api.setStorage('show_quanzi_info',
	 	{
	 		'id':id,
	 		'comment_num': parseInt($api.text($api.byId("comment_num_" + id))),
	 		'browse_num': parseInt($api.text($api.byId("browse_num_" + id))),
	 		'praise_count': parseInt($api.text($api.byId("praise_count_" + id)))
	 	}
	 );
   commonOpenWin('init_content_window', 'widget://html/init/iphone/init_content_window.html', false, false, pageParamJson);
}
/**
* 添加圈子
* zhaoj
* 2018.01.30
*/
function openAddQuanziWindow(pageParamJson){
	if($api.getStorage('identity') == 5 && org_type == 104){
		pageParamJson.menu_type = 104;
	}else{
		pageParamJson.menu_type = 105;
	}
	pageParamJson.org_id = org_id;
	pageParamJson.org_name = org_name;
	pageParamJson.lx_id = 0;
	commonOpenWin('init_add_window', 'widget://html/init/iphone/init_add_window.html', false, false, pageParamJson);
}

/*
 * 添加浏览次数
 * 张自强
 * 20170720
 */
function addBrowseNum(wz_id, expand_id, callback) {
	api.ajax({
		url : BASE_URL_ACTION + '/blog/addBrowseNum',
		method : 'post',
		dataType : 'json',
		timeout : 30,
		cache : false,
		data : {
			values : {
				"article_id" : wz_id,
				"identity_id" : $api.getStorage('identity'),
				"person_id" : $api.getStorage('person_id')
			}
		}
	}, function(ret, err) {
		if (err) {
			callback(false, '添加浏览次数失败');
		} else {
			if (ret.success) {
				callback(true, ret.info);
			} else {
				callback(false, '添加浏览次数失败');
			}
		}
	});
}

/*
 * 功能：打开照片
 * 作者：张自强
 * 时间：20170918
 */
function openImage(e,openImgUrl) {
	if (e){
		e.stopPropagation();
	}
	var openImgArray = [];
	var index = -1;
	for(var i=0;i<picture_sz.length;i++){
		for (var j = 0; j < picture_sz[i].open_thumbs_id.length; j++){
			var temp = picture_sz[i].open_thumbs_id[j];
			if (temp != -1){
				openImgArray.push(temp);
				if(openImgUrl == temp){
					index = openImgArray.length - 1;
				}
			}
		}
		
		if (index != -1){
			break;
		}
	}
	
	if (index != -1){
	    openPictureShowWin(openImgArray,index);
	}
}

/*
*author:zhaoj
*function:附件打开
*date：20170712
*/
function downloadResAttachment(id){
    showSelfProgress('加载中...');
    api.ajax({
        url : BASE_URL_ACTION + '/ypt/resource/getResourceByIDInt',
        method : 'get',
        timeout : 30,
        dataType : 'json',
        returnAll : false,
        data : {
            values : {
                "random_num" : creatRandomNum(),
                "resource_id_int" :id
            }
        },
        headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
        }, function(ret, err) {
            api.hideProgress();
            if (err) {
                popToast('获取数据失败，请稍候重试');
        } else {
            if(ret.success){
                checkPreviewStatus(ret.resource_format,ret.preview_status,ret.file_id,ret.m3u8_status,ret.iid,id)   
            }else{
                popToast('获取数据失败，请稍候重试');
            }
        }
    });
}
/*
 *author:zhaoj
 *function:预览前处理
 *date：20160302
 */
function checkPreviewStatus(format,preview_status,file_id,m3u8_status,iid,data_resource_id_int) {
    format = format.toLowerCase();
    if (format == 'doc' || format == 'jpeg' || format == 'png' || format == 'gif' || format == 'bmp' || format == 'doc' || format == 'docx' || format == 'ppt' || format == 'pptx' || format == 'asf' || format == 'wmv' || format == 'mpg' || format == 'avi' || format == 'mp4' || format == 'rmvb' || format == 'txt' || format == 'xls' || format == 'xlsx') {
    if (preview_status == '1' || preview_status == '-5') {
        //打开文件
        common_openResource.open(format,file_id,file_id,m3u8_status,api.winName,'reBackType("voice_c");','back();',data_resource_id_int);
    } else if (preview_status == '2') {
        if(format == 'doc' || format == 'docx' || format == 'ppt' || format == 'pptx' || format == 'xls' || format == 'xlsx'){
                        common_openResource.open(format,file_id,file_id,m3u8_status,api.winName,'reBackType("voice_c");','back();',data_resource_id_int);
        }else{
            popAlert('对不起，该文件生成预览失败。');
        }
    } else {
        api.ajax({
            url : BASE_URL_ACTION + '/ypt/checkPreviewStatus?type=1&yunormy=1' + '&target_id=' + iid + '&random_num=' + creatRandomNum(),
            method : 'get',
            dataType : 'json',
            timeout : 30,
            cache : false,
            headers : {
                'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
            }
        }, function(ret, err) {
            if (ret.success) {
                if (preview_status == "0") {
                    if(format == 'doc' || format == 'docx' || format == 'ppt' || format == 'pptx' || format == 'xls' || format == 'xlsx'){
                        common_openResource.open(format,file_id,file_id,m3u8_status,api.winName,'reBackType("voice_c"");','back();',data_resource_id_int);
                    }else{
                        popAlert('对不起，正在生成预览中，请稍候查看。');
                    }
                } else if (ret.preview_status == "1") {
                    //打开文件
                    common_openResource.open(format,file_id,file_id,m3u8_status,api.winName,'reBackType("voice_c"");','back();',data_resource_id_int);
                } else if (preview_status == "2") {
                    if(format == 'doc' || format == 'docx' || format == 'ppt' || format == 'pptx' || format == 'xls' || format == 'xlsx'){
                        common_openResource.open(format,file_id,file_id,m3u8_status,api.winName,'reBackType("voice_c"");','back();',data_resource_id_int);
                    }else{
                        popAlert('对不起，该文件生成预览失败。');
                    }
                }
            }
        });
    }
} else {
    //打开文件
    common_openResource.open(format,file_id,file_id,m3u8_status,api.winName,'reBackType("voice_c");','back();',data_resource_id_int);
    }
}
/**
 * 获取个人信息
 * 王俭
 * 2018.4.24 
 */
function getPersonData(e,name,targetName,avatar_fileid,person_id,identity_id){
	if (e){
		e.stopPropagation();
	}
	if (targetName){
		openPersonInfo(name,targetName,avatar_fileid,person_id,identity_id);
	}else{
		commonGetPInfoByPId(person_id,identity_id,function (bol,data){
			if (bol){
				if (data.success){
					openPersonInfo(name,data.table_List.login_name,avatar_fileid,person_id,identity_id);
				}
				else{
					popToast('获取人员信息失败，请重试');
				}
			}else{
				popToast('获取人员信息失败，请重试');
			}
		});
	
	}
}
/**
 * 打开个人信息界面
 * 王俭
 * 2018.4.24
 */
function openPersonInfo(name,targetName,avatar_fileid,person_id,identity_id){
	var targetId = commonOldParamToNewParam(targetName);
	api.openWin({
		name : 'hh_personinfo_window',
		url : 'widget://html/huihua/hh_personinfo_window.html',
		bounces : false,
		delay : 0,
		scrollToTop : true,
		allowEdit : true,
		slidBackEnabled : false,
		scaleEnabled : false,
		animation : {
			type : "reveal", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300
		},
		pageParam : {
			'targetId' : targetId,
			'old_msg_id' : -1,
			'conver_type' : 'PRIVATE',
			'person_name' : name,
			'header_h' : api.pageParam.header_h,
			'h_from' : 'center_index',
			'avatar_url' : avatar_fileid,
			'person_id':person_id,
			'identity_id':identity_id
		}
	});
}


/*
 * 功能：删除某一条圈子
 * 作者：张自强
 * 时间：20190218
 */
function deleteAndRemoveChild(id){
    $api.remove($api.byId(id));
}

/**
 * 刷新圈子点赞、评论、浏览数量 
 */
function refrashInfo(){
	var show_quanzi_info = $api.getStorage('show_quanzi_info');
	$api.text($api.byId("comment_num_" + show_quanzi_info.id),show_quanzi_info.comment_num);
	$api.text($api.byId("browse_num_" + show_quanzi_info.id),show_quanzi_info.browse_num);
	$api.text($api.byId("praise_count_" + show_quanzi_info.id),show_quanzi_info.praise_count);
}