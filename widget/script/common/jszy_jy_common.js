/*
*作者:zhaoj
*功能:获取滑动条的数据
*日期：20160912
*/
function openNavigationBar(type) {
	//关闭滑动条
	commonCloseNavigationBar();
	if(type ==1 ){
		openNavigationBarToHtml(getMyNavData());
	}else{
		getShareRange(1,function(is_true, data) {
			if (is_true) {
				for(var i = 0; i < data.bar_items.length; i++){
					share_org_type_array.push(data.bar_items[i].org_type);
				}
				openNavigationBarToHtml(data);
			} else {
				popToast('获取范围信息失败');
			}
		});
	}
}
/*
*作者:zhaoj
*功能:统计页面初始化滑动条数据
*日期：20160919
*/
function intiTjData(name){
	showSelfProgress('加载中...');
	getZyTotalTj(1,function(data){
		openTjNavigationBarToHtml(data,name);
	});
}
/*
*作者:zhaoj
*功能:获取滑动条的数据
*日期：20160912
*/
function getShareRange(type,callback){
	api.ajax({
		url :BASE_URL_ACTION + '/ypt/config/getShareRange?random_num='+creatRandomNum(),
		method : 'get',
		timeout : 30,
		dataType : 'json',
		headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
	}
	}, function(ret, err) {
		if (err) {
			callback(false,'');
		} else {
			if(ret.success){
				if(type == 1){
					bar_ids=[];
					var width = Math.floor(api.frameWidth/4);
					var data={'width':width,'bar_items':[{
						"title":"全部范围",
						"id":"",
						"org_type":-1
					}]}
					bar_ids.push("");
					for(var i = 0; i < ret.org_List.length; i++){
						var param = new Object();
						param.title=ret.org_List[i].org_name;
						param.id=ret.org_List[i].org_id;
						param.org_type = ret.org_List[i].org_type;
						data.bar_items.push(param);
						bar_ids.push(ret.org_List[i].org_id);
					}
					callback(true,data);
				}else{
					callback(true,ret);
				}	
			}else{
				callback(false,'');
			}
		}
	});
}
/*
*作者:zhaoj
*功能:获取滑动条的数据
*日期：20160912
*/
function getMyNavData(){
	bar_ids=[0,1,2];
	var width = Math.floor(api.frameWidth/3);
	var data={'width':width,'bar_items':[
		{
			title : '我布置的',
			id:''
		},
		{
			title : '我收藏的',
			id:''
		},
		{
			title : '我共享的',
			id:''
		}]
	}
	return data;
}
/*
*作者:zhaoj
*功能:打开滑动条
*日期：20160912
*/
function openNavigationBarToHtml(data) {
//	var params = {
//		y : header_h-1,
//		itemSize : {
//			w : data.width
//		},
//		file_level:2,
//		//按钮项
//		items : data.bar_items,
//		winName:'zuoyeJsJy_index_window',
//		frameName:'zuoyeJsJy_index_frame'
//	};
//	commonMyNavigationBar(params);
	callBackNew('', 0);
}
/*
*作者:zhaoj
*功能:打开统计滑动条
*日期：20160912
*/
function openTjNavigationBarToHtml(data,framename) {
	var name=""
//	if(api.uiMode == 'pad'){
//		name = 'zuoyeIpad_';
//	}else{
		name = 'zuoyeJsJy_';
//	}
	var params = {
		y : header_h-1,
		file_level:2,
		//按钮项
		items : data.bar_items,
		winName:name+'tj_window',
		frameName:framename
	};
	commonMyNavigationBar(params);
}
/*
*作者:zhaoj
*功能:打开对已经发布检测的操作
*日期：20160912
*/
function openPublicOpt(zy_id,zy_name_base64,zy_desc_base64,subject_id,num,zg_ti_count,id){
	ids = id;
	var name=""
//	if(api.uiMode == 'pad'){
//		name = 'zuoyeIpad_';
//	}else{
		name = 'zuoyeJsJy_';
//	}
	isShowFooterBtn(0);//不显示下方按钮
	var button = [];
		button = ['查看检测','批阅检测','检测报告','共享','删除','取消发布'];
	api.actionSheet({
	    cancelTitle: '取消',
//	    buttons: ['查看检测','查看统计','取消发布','共享检测','收藏检测','另存为','删除检测'],
		buttons: button,
	    style:{
	    	titleFontColor:'#ff0000'
	    }
	},function( ret, err ){
	    if( ret ){
//	         if(ret.buttonIndex == 1){
//	         	//查看检测
//	         	openCommonWin('zuoyeJsJy_detail_window',zy_name_base64,zy_id,'',1,1);
//	         }else if(ret.buttonIndex == 2){
//	         	//统计检测
//	         	openCommonWin('zuoyeJsJy_tj_window',zy_name_base64,zy_id,'','','');
//	         }else if(ret.buttonIndex == 3){
//	         	//取消发布
//		        popConfirm(zy_id,3,"确定取消检测“"+Base64.decode(zy_name_base64).substring(0,4)+"...”的发布吗？")
//	         }else if(ret.buttonIndex == 4){
//	         	//共享检测
//	         	openCommonWin('zuoyeJsJy_share_window',zy_name_base64,zy_id,1,'','');
//	         }else if(ret.buttonIndex == 5){
//	         	//收藏检测
//	         	popConfirm(zy_id,5,"确定收藏“"+Base64.decode(zy_name_base64).substring(0,4).substring(0,4)+"...”检测吗？");
//	         }else if(ret.buttonIndex == 6){
//	         	//另存为检测
//	         	saveZuoye(zy_name_base64,zy_id);
//	         }else if(ret.buttonIndex == 7){
//	         	//删除检测
//	         	popConfirm(zy_id,4,"确定删除“"+Base64.decode(zy_name_base64).substring(0,4).substring(0,4)+"...”检测吗？");
//	         }
				if(ret.buttonIndex == 1){
	         		//查看检测
	         		openCommonWin(name+'detail_window',zy_name_base64,zy_id,'',1,1);
		         }else if(ret.buttonIndex == 3){
		         	//统计检测
		         	openCommonWin(name+'tj_window',zy_name_base64,zy_id,'','','');
		         }else if(ret.buttonIndex == 4){
		         	//分享检测
		         	openCommonWin('zuoyeJsJy_share_window',zy_name_base64,zy_id,1,'','');
			     }else if(ret.buttonIndex == 2){
		     	    if(num <= 0){
		     			popAlert('当前检测还没有学生提交，暂时不能批阅');
		     		}else if(zg_ti_count <= 0){
		     			popAlert('无主观题，无需批阅');
		     		}else{
		     			openCommonWin(name+'piyue_window',zy_name_base64,zy_id,'','','');	
		     		}
			     }else if(ret.buttonIndex == 6){
			     	//取消发布
			        popConfirm(zy_id,3,"确定取消检测“"+Base64.decode(zy_name_base64)+"”的发布吗？")
			     }else if(ret.buttonIndex == 5){
			     	popTwoBtnConfirm('提示',"确定删除“"+Base64.decode(zy_name_base64)+"”检测吗？", 'deleteZy('+zy_id+')');
			     }
			
//	         else if(ret.buttonIndex == 4){
//	         	//删除检测
//	         	popConfirm(zy_id,4,"确定删除“"+Base64.decode(zy_name_base64).substring(0,4).substring(0,4)+"...”检测吗？");
//	         }
	         isShowFooterBtn(1);//显示下方按钮
	    }else{
			popToast('网络繁忙，请稍候重试');
	    }
	});
}
/*
*作者:zhaoj
*功能:打开对云检测的操作
*日期：20160912
*/
function openYunListOpt(zy_id,zy_name_base64,zy_desc_base64,subject_id){
	var name=""
//	if(api.uiMode == 'pad'){
//		name = 'zuoyeIpad_';
//	}else{
		name = 'zuoyeJsJy_';
//	}
	api.actionSheet({
	    cancelTitle: '取消',
	    buttons: ['查看检测','发布检测','收藏检测','另存为'],
	    style:{
	    	titleFontColor:'#ff0000'
	    }
	},function( ret, err ){
	    if( ret ){
	         if(ret.buttonIndex == 1){
	         	//查看检测
	         	openCommonWin(name+'detail_window',zy_name_base64,zy_id,'',0,0);
	         }else if(ret.buttonIndex == 2){
	         	//发布检测
	         	openPublishWin(zy_id,zy_name_base64,subject_id,event);
	         }else if(ret.buttonIndex == 3){
	         	//收藏检测
	         	popConfirm(zy_id,5,"确定收藏“"+Base64.decode(zy_name_base64).substring(0,4).substring(0,4)+"...”检测吗？");
	         }else if(ret.buttonIndex == 4){
	         	//另存为
	         	saveZuoye(zy_name_base64,zy_id);
	         }
	    }else{
			popToast('网络繁忙，请稍候重试');
	    }
	});
}
/*
*作者:zhaoj
*功能:打开对没有发布检测的操作
*日期：20160912
*/
function openNoPublicOpt(zy_id,zy_name_base64,zy_desc_base64,subject_id,id){
	ids = id;
	var name=""
//	if(api.uiMode == 'pad'){
//		name = 'zuoyeIpad_';
//	}else{
		name = 'zuoyeJsJy_';
//	}
	isShowFooterBtn(0);//不显示下方按钮
	api.actionSheet({
	    cancelTitle: '取消',
//	    buttons: ['查看检测','发布检测','共享检测','收藏检测','另存为','删除检测'],
		buttons: ['查看检测','发布检测','共享','删除',],
	    style:{
	    	titleFontColor:'#ff0000'
	    }
	},function( ret, err ){
	    if( ret ){
//	         if(ret.buttonIndex == 1){
//	         	//查看检测
//	         	openCommonWin('zuoyeJsJy_detail_window',zy_name_base64,zy_id,'',0,1);
//	         }else if(ret.buttonIndex == 2){
//	         	//发布检测
//	         	openPublishWin(zy_id,zy_name_base64,subject_id);
//	         }else if(ret.buttonIndex == 3){
//	         	//共享检测
//	         	openCommonWin('zuoyeJsJy_share_window',zy_name_base64,zy_id,1,'','');
//	         }else if(ret.buttonIndex == 4){
//	         	//收藏检测
//	         	popConfirm(zy_id,5,"确定收藏“"+Base64.decode(zy_name_base64).substring(0,4).substring(0,4)+"...”检测吗？");
//	         }else if(ret.buttonIndex == 5){
//	         	//另存为
//	         	saveZuoye(zy_name_base64,zy_id);
//	         }else if(ret.buttonIndex == 6){
//	         	//删除检测
//	         	popConfirm(zy_id,4,"确定删除“"+Base64.decode(zy_name_base64).substring(0,4).substring(0,4)+"...”检测吗？");
//	         }
	         if(ret.buttonIndex == 1){
	         	//查看检测
	         	openCommonWin(name+'detail_window',zy_name_base64,zy_id,'',0,1);
	         }else if(ret.buttonIndex == 2){
	         	//发布检测
	         	openPublishWin(zy_id,zy_name_base64,subject_id,event);
	         }else if(ret.buttonIndex == 3){
	         	openCommonWin('zuoyeJsJy_share_window',zy_name_base64,zy_id,1,'','');
	         }else if(ret.buttonIndex == 4){
	         		popTwoBtnConfirm('提示',"确定删除“"+Base64.decode(zy_name_base64)+"”检测吗？", 'deleteZy('+zy_id+')');
	         }
//	         else if(ret.buttonIndex == 3){
//	         	//删除检测
//	         	popConfirm(zy_id,4,"确定删除“"+Base64.decode(zy_name_base64).substring(0,4).substring(0,4)+"...”检测吗？");
//	         }
	         isShowFooterBtn(1);//显示下方按钮
	    }else{
			popToast('网络繁忙，请稍候。');
	    }
	});
}
/*
*作者:zhaoj
*功能:我的检测收藏的操作
*日期：20160920
*/
function haveCollectOpt(zy_id,zy_name_base64,zy_desc_base64,subject_id){
	isShowFooterBtn(0);//不显示下方按钮
	var name=""
//	if(api.uiMode == 'pad'){
//		name = 'zuoyeIpad_';
//	}else{
		name = 'zuoyeJsJy_';
//	}
	api.actionSheet({
	    cancelTitle: '取消',
	    buttons: ['查看检测','取消收藏','发布检测','另存为'],
	    style:{
	    	titleFontColor:'#ff0000'
	    }
	},function( ret, err ){
	    if( ret ){
	         if(ret.buttonIndex == 1){
	         	openCommonWin(name+'detail_window',zy_name_base64,zy_id,'',0,0);
	         }else if(ret.buttonIndex == 2){
	         	popConfirm(zy_id,6,"确定取消收藏“"+Base64.decode(zy_name_base64).substring(0,4).substring(0,4)+"...”检测吗？");
	         }else if(ret.buttonIndex == 3){
	         	//发布检测
	         	openPublishWin(zy_id,zy_name_base64,subject_id,event);
	         }else if(ret.buttonIndex == 4){
	         	//另存为
	         	saveZuoye(zy_name_base64,zy_id);
	         }
	         isShowFooterBtn(1);//显示下方按钮
	    }else{
			popToast('网络繁忙，请稍候。');
	    }
	});
}
/*
*作者:zhaoj
*功能:我的检测共享的操作
*日期：20160920
*/
function haveShareOpt(zy_id,zy_name_base64,zy_desc_base64,subject_id){
	var name=""
//	if(api.uiMode == 'pad'){
//		name = 'zuoyeIpad_';
//	}else{
		name = 'zuoyeJsJy_';
//	}
	isShowFooterBtn(0);//不显示下方按钮
	api.actionSheet({
	    cancelTitle: '取消',
	    buttons: ['查看检测','取消共享','发布检测','收藏检测','另存为'],
	    style:{
	    	titleFontColor:'#ff0000'
	    }
	},function( ret, err ){
	    if( ret ){
	         if(ret.buttonIndex == 1){
	         	openCommonWin(name+'detail_window',zy_name_base64,zy_id,'',0,0);
	         }else if(ret.buttonIndex == 2){
	         	popConfirm(zy_id,7,"确定取消共享“"+Base64.decode(zy_name_base64).substring(0,4).substring(0,4)+"...”检测吗？");
	         }else if(ret.buttonIndex == 3){
	         	//发布检测
	         	openPublishWin(zy_id,zy_name_base64,subject_id,event);
	         }else if(ret.buttonIndex == 4){
	         	popConfirm(zy_id,5,"确定收藏“"+Base64.decode(zy_name_base64).substring(0,4).substring(0,4)+"...”检测吗？");
	         }else if(ret.buttonIndex == 5){
	         	//另存为
	         	saveZuoye(zy_name_base64,zy_id);
	         }
	         isShowFooterBtn(1);//显示下方按钮
	    }else{
			popToast('网络繁忙，请稍候。');
	    }
	});
}
/*
*作者:zhaoj
*功能:打开检测的详情页面
*日期：20160912
*/
function openCommonWin(name,zy_name_base64,zy_id,o_type,isPublic,isXiafa,e){
	api.openWin({
		name : name,
		url : name+'.html',
		pageParam : {
			header_h : header_h,
			zy_name_base64 : zy_name_base64,
			zy_id : zy_id,
			o_type : o_type,
			isPublic :isPublic,
			isXiafa:isXiafa
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
//	api.uiMode == 'pad' ? e.stopPropagation():'';
}
/*
*作者:zhaoj
*功能:获取学期信息
*日期：20160817
*/
function getListSemester(callback){
	api.ajax({
		url : BASE_URL_ACTION + '/subject/getListSemester',
		method : 'post',
		timeout : 30,
		dataType : 'json',
		cache : false,
	}, function(ret, err) {
		if (err) {
			callback(false,'获取学期信息失败');
		} else {
			if(ret){
				if(ret.xqlist.length>0){
					var data ={"xqlist":[]};
					for(var i=0;i<ret.xqlist.length;i++){
						var oparam = new Object();
						if(ret.xqlist[i].XQ_ID <= ret.enable_id){
							oparam.JSRQ = ret.xqlist[i].JSRQ;
							oparam.KSRQ = ret.xqlist[i].KSRQ;
							oparam.SFDQXQ = ret.xqlist[i].SFDQXQ;
							oparam.XN = ret.xqlist[i].XN;
							oparam.XQMC = ret.xqlist[i].XQMC;
							oparam.XQ_ID = ret.xqlist[i].XQ_ID;
							data.xqlist.push(oparam);
						}
					}
					callback(true,data);
				}else{
					callback(false,'暂无相关的学期信息');
				}
			}else{
				callback(false,'获取学期信息失败');
			}
		}
	});
}
/*
*作者:zhaoj
*功能:有未交学生选项
*日期：20160913
*/
//function haveWjStuOpt(){
//	api.actionSheet({
//	    cancelTitle: '取消',
//	    buttons: ['应交学生名单','未交学生名单'],
//	    style:{
//	    	titleFontColor:'#ff0000'
//	    }
//	},function( ret, err ){
//	    if( ret ){
//	         if(ret.buttonIndex == 1){
//	         	openZtPersonListFrame(1,999);
//	         }else if(ret.buttonIndex == 2){
//	         	openZtPersonListFrame(3,999);
//	         }
//	    }else{
//			popToast('网络繁忙，请稍候。');
//	    }
//	});
//}
/*
*作者:zhaoj
*功能:有已交学生选项
*日期：20160913
*/
//function haveYjStuOpt(){
//	api.actionSheet({
//	    cancelTitle: '取消',
//	    buttons: ['应交学生名单','已交学生名单'],
//	    style:{
//	    	titleFontColor:'#ff0000'
//	    }
//	},function( ret, err ){
//	    if( ret ){
//	         if(ret.buttonIndex == 1){
//	         	openZtPersonListFrame(1,999);
//	         }else if(ret.buttonIndex == 2){
//	         	openZtPersonListFrame(2,999);
//	         }
//	    }else{
//			popToast('网络繁忙，请稍候。');
//	    }
//	});
//}
/*
*作者:zhaoj
*功能:两项都有
*日期：20160913
*/
//function haveAllStuOpt(){
//	api.actionSheet({
//	    cancelTitle: '取消',
//	    buttons: ['应交学生名单','已交学生名单','未交学生名单'],
//	    style:{
//	    	titleFontColor:'#ff0000'
//	    }
//	},function( ret, err ){
//	    if( ret ){
//	         if(ret.buttonIndex == 1){
//	         	openZtPersonListFrame(1,999);
//	         }else if(ret.buttonIndex == 2){
//	         	openZtPersonListFrame(2,999);
//	         }else if(ret.buttonIndex == 3){
//	         	openZtPersonListFrame(3,999);
//	         }
//	    }else{
//			popToast('网络繁忙，请稍候。');
//	    }
//	});
//}
/*
*作者:zhaoj
*功能:根据检测ID获取检测信息，含发布情况
*参数：type=0，返回全部信息；type=1，作为滑动条信息返回
*日期：20160913
*/
function getZyTotalTj(type,callback){
	api.ajax({
		url : BASE_URL_ACTION + '/xx/getZyTotalTj',
		method : 'post',
		timeout : 30,
		dataType : 'json',
		cache : false,
		data : {
			values : {
				"random_num" : creatRandomNum(),
				"zy_id" : api.pageParam.zy_id,
				"is_all":type
			}
		}
	}, function(ret, err) {
		if (err) {
			api.hideProgress();
			popToast('获取发布对象信息失败');
		} else {
			if(ret){
				if(type == 1){
					var width = Math.floor(160);
					var data={'width':width,'bar_items':[]}
					for(var i = 0; i < ret.pub_list.length; i++){
						var oparam = new Object();
						oparam.title = ret.pub_list[i].class_name;
						oparam.titleSelected = ret.pub_list[i].class_name;
						oparam.bg  ="#ffffff";
						oparam.alpha  =0.8;
						oparam.gSelected  ="#ffffff";
						data.bar_items.push(oparam);
						bar_ids.push(ret.pub_list[i].obj_id);
						bar_type.push(ret.pub_list[i].obj_type)
					}
					callback(data);
				}
			}else{
				api.hideProgress();
				popToast('获取发布对象信息失败');
			}
		}
	});
}
/*
*作者:zhaoj
*功能:打开按学生统计操作选项
*日期：20160914
*/
//function haveStuTjOpt(showArray){
//	var buttonArray = ['检测列表'];
//	var functionArray = ['openStListWindow(1)']
//	for(var i = 0; i < showArray.length; i++){
//		if(i == 0 && showArray[i]){
//			buttonArray.push('零分（未作答）题目');
//			functionArray.push('openStListWindow(2)');
//		}
//		if(i == 1 && showArray[i]){
//			buttonArray.push('零分（做错）题目');
//			functionArray.push('openStListWindow(3)');
//		}
//		if(i == 2 && showArray[i]){
//			buttonArray.push('满分题数目');
//			functionArray.push('openStListWindow(4)');
//		}
//		if(i == 3 && showArray[i]){
//			buttonArray.push('其他得分题目');
//			functionArray.push('openStListWindow(5)');
//		}
//	}
//	api.actionSheet({
//	    cancelTitle: '取消',
//	    buttons: buttonArray,
//	    style:{
//	    	titleFontColor:'#ff0000'
//	    }
//	},function( ret, err ){
//	    if( ret ){
//	    	var index = ret.buttonIndex*1-1;
//	    	 eval(functionArray[index]);
//	    }else{
//			popToast('网络繁忙，请稍候。');
//	    }
//	});
//}
/*
*作者:zhaoj
*功能:打开按学生统计的试题详情页面
*日期：20160914
*/
function openStListWindow(student_id,head_img,student_name){
	var name=""
//	if(api.uiMode == 'pad'){
//		name = 'zuoyeIpad_';
//	}else{
		name = 'zuoyeJsJy_';
//	}
	api.openWin({
		name : name+'st_list_window',
		url : name+'st_list_window.html',
		pageParam : {
			header_h : header_h,
			zy_name_base64 : api.pageParam.zy_name_base64,
			zy_id : zy_id,
			head_img:head_img,
			student_name:student_name,
			student_id: student_id
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
/*
*author:zhaoj
*function:打开检测发布页面
*date：20160330
*/
function openPublishWin(zy_id,zy_name_base64,subject_id,e){
	var name=""
	var page="";
//	if(api.uiMode == 'pad'){
//		name = 'zuoyeIpad_';
//		page=0;
//	}else{
		name = 'zuoyeJsJy_';
		page= currentPage;
//	}
	api.openWin({
		name : name+'publish_window',
		url : name+'publish_window.html',
		pageParam : {
			header_h : header_h,
			zy_id : zy_id,
			zy_name_base64 : zy_name_base64,
			subject_id : subject_id,
			currentPage : page
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
//	api.uiMode == 'pad' ? e.stopPropagation():'';
}
/*
*作者:zhaoj
*功能:打开学生单一试题的详细页面
*参数:type=1,就是从试题统计页面进入的，显示学生名单，不然就只显示题目信息
*日期：20160918
*/
function showQueDetail(question_id_char,sort,qt_name,qt_type,type,wd_totalRow,zc_totalRow,mf_totalRow,qt_totalRow,obj_type,obj_id, zy_id,que_source,jy_subject_en_name,qt_id){
	var name=""
//	if(api.uiMode == 'pad'){
//		name = 'zuoyeIpad_';
//	}else{
		name = 'zuoyeJsJy_';
//	}
	api.execScript({
		name : name+'tj_window',
		script : 'reBackType("single");'
	});
	api.execScript({
		name : name+'tj_window',
		script : 'resetName("查看试题");'
	});		
	api.openFrame({
		name : name+'single_frame',
		scrollToTop : true,
		allowEdit : false,
		url : name+'single_frame.html',
		rect : {
			x : 0,
			y : header_h,
			w : 'auto',
			h : api.winHeight - header_h,
		},
		pageParam : {
			header_h : header_h,
			question_id_char : question_id_char,
			qt_type :qt_type,
			sort : sort,
			qt_name:qt_name,
			type:type,
			wd_totalRow:wd_totalRow,
			zc_totalRow:zc_totalRow,
			mf_totalRow:mf_totalRow,
			qt_totalRow:qt_totalRow,
			obj_id:obj_id,
			obj_type:obj_type,
			zy_id:zy_id,
			que_source:que_source,
			jy_subject_en_name:jy_subject_en_name,
			qt_id:qt_id
		},
		vScrollBarEnabled : true,
		hScrollBarEnabled : true,
		//页面是否弹动 为了下拉刷新使用
		bounces : false
	});
}
/*
*作者:zhaoj
*功能:打开应交学生或未交学生名单页面
*参数:tpe =1,是打开应交学生名单，type=2是根据试题打开本题状态的学生名单
*日期：20160918
*/
function openZtPersonListFrame(zy_id,obj_type,obj_id,yingj_totalRow,yij_totalRow,wj_totalRow){
	var name=""
//	if(api.uiMode == 'pad'){
//		name = 'zuoyeIpad_';
//	}else{
		name = 'zuoyeJsJy_';
//	}
	api.execScript({
		name : name+'tj_window',
		script : 'reBackType("person");'
	});
	api.openFrame({
		name : name+'person_frame',
		scrollToTop : true,
		allowEdit : false,
		url : name+'person_frame.html',
		rect : {
			x : 0,
			y : header_h,
			w : 'auto',
			h : api.winHeight - header_h,
		},
		pageParam : {
			header_h : header_h,
			zy_id : zy_id,
			obj_type:obj_type,
			obj_id:obj_id,
			yingj_totalRow:yingj_totalRow,
			yij_totalRow:yij_totalRow,
			wj_totalRow :wj_totalRow
			
		},
		vScrollBarEnabled : true,
		hScrollBarEnabled : true,
		//页面是否弹动 为了下拉刷新使用
		bounces : false
	});
}
/*
*作者:zhaoj
*功能:打开学生名单页面
*日期：20160918
*/
function openPersonListFrame(question_id_char,tj_type,totalRow){
	var name=""
//	if(api.uiMode == 'pad'){
//		name = 'zuoyeIpad_';
//	}else{
		name = 'zuoyeJsJy_';
//	}
	api.execScript({
		name : name+'tj_window',
		script : 'reBackType("person");'
	});
	api.openFrame({
		name : name+'person_frame',
		scrollToTop : true,
		allowEdit : false,
		url : name+'person_frame.html',
		rect : {
			x : 0,
			y : header_h,
			w : 'auto',
			h : api.winHeight - header_h,
		},
		pageParam : {
			header_h : header_h,
			question_id_char : question_id_char,
			tj_type :tj_type,
			type :2,
			zy_id : zy_id,
			obj_type:obj_type,
			obj_id:obj_id,
			totalRow:totalRow
		},
		vScrollBarEnabled : true,
		hScrollBarEnabled : true,
		//页面是否弹动 为了下拉刷新使用
		bounces : false
	});
}
/*
*作者:zhaoj
*功能:打开按试题统计操作选项
*日期：20160914
*/
//function haveStTjOpt(showArray,totalRow,question_id_char,sort,qt_name,qt_type){
//	var buttonArray = ['试题详情'];
//	var functionArray = ['showQueDetail("'+question_id_char+'",'+sort+',"'+qt_name+'",'+qt_type+')']
//	for(var i = 0; i < showArray.length; i++){
//		if(i == 0 && showArray[i]){
//			buttonArray.push('零分（未作答）学生名单');
//			functionArray.push('openPersonListFrame("'+question_id_char+'",1,'+totalRow+')');
//		}
//		if(i == 1 && showArray[i]){
//			buttonArray.push('零分（做错）学生名单');
//			functionArray.push('openPersonListFrame("'+question_id_char+'",2,'+totalRow+')');
//		}
//		if(i == 2 && showArray[i]){
//			buttonArray.push('满分学生名单');
//			functionArray.push('openPersonListFrame("'+question_id_char+'",3,'+totalRow+')');
//		}
//		if(i == 3 && showArray[i]){
//			buttonArray.push('其他得分学生名单');
//			functionArray.push('openPersonListFrame("'+question_id_char+'",5,'+totalRow+')');
//		}
//	}
//	api.actionSheet({
//	    cancelTitle: '取消',
//	    buttons: buttonArray,
//	    style:{
//	    	titleFontColor:'#ff0000'
//	    }
//	},function( ret, err ){
//	    if( ret ){
//	    	var index = ret.buttonIndex*1-1;
//	    	api.execScript({
//				name : 'zuoyeJsJy_tj_window',
//				script : 'resetName("'+buttonArray[index]+'");'
//			});	
//	    	 eval(functionArray[index]);
//	    }else{
//			popToast('网络繁忙，请稍候。');
//	    }
//	});
//}
function saveZuoye(zy_name_base64,zy_id){
	var frameName="";
//	if(api.uiMode == 'pad'){
//		commonExecScript('zuoyeIpad_index_window','','reBackType("save");',0);
//		frameName = 'zuoyeIpad_save_frame';
//	}else{
		commonExecScript('zuoyeJsJy_index_window','','reBackType("save");',0);
		frameName = 'zuoyeJsJy_save_frame';
//	}
	api.openFrame({
			name : frameName,
			scrollToTop : true,
			allowEdit : true,
			url : frameName+'.html',
			bgColor : 'rgba(0,0,0,0.5)',
			rect : {
				x : 0,
				y : 0,
				w : 'auto',
				h : api.winHeight,
			},
			pageParam : {
				zy_id:zy_id,
				zy_name_base64:zy_name_base64,
			},
			vScrollBarEnabled : true,
			hScrollBarEnabled : true,
			//页面是否弹动 为了下拉刷新使用
			bounces : false
		});
}
/*
*作者:zhaoj
*功能:获取服务器的当前时间
*日期：20160920
*/
function getCurrentDate(callback){
	api.ajax({
		url : BASE_URL_ACTION + '/xx/getCurrentDate',
		method : 'get',
		timeout : 30,
		dataType : 'json',
		data : {
			values : {
				"random_num" : creatRandomNum()
			}
		},
		headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		if (err) {
			nowTime = new Date(getTime());
			nowMillisecond = Date.parse(nowTime);
			callback(true);
		} else {
			if(ret.success){
				nowTime = new Date(ret.dateStr2.replace(/\-/g, "/"));
				nowMillisecond = Date.parse(new Date(ret.dateStr2.replace(/\-/g, "/")));
				callback(true);
			}else{
				nowTime = new Date(getTime());
				nowMillisecond = Date.parse(nowTime);
				callback(true);
			}
		}
	});
}
/*
*作者:zhaoj
*功能:设置截止时间
*日期：20160920
*/
function getTime(){
	time = new Date();
	var year = time.getFullYear();
	var month = time.getMonth() + 1;
	month = month > 9 ? month : '0'+month;
	var day = time.getDate();
	day = day > 9 ? day : '0'+day;
	var hours = time.getHours();
	hours  = hours  > 9 ? hours  : '0'+ hours;
	var minutes = time.getMinutes();
	minutes  = minutes  > 9 ? minutes  : '0'+ minutes;
	var millisecond = time.getSeconds();
	millisecond  = millisecond  > 9 ? millisecond  : '0'+ millisecond;
	var startTime = year+'/'+month+'/'+day +' '+hours+':'+minutes+':'+millisecond;
	return startTime;
}
/*
*作者:zhaoj
*功能:设置检测初始化
*日期：20160920
*/
function setZyData(type,year){
	if(type!=1){
		zy_data.is_live=1;
	}else{
		zy_data.is_live=0;
	}
	zy_data.list=[];
	if(type == 1){
		for(var i = 12; i > 0; i-- ){
			var k = i;
			var param = new Object();
			param.month = k+'月';
			param.num = k;
			param.is_live = 0;
			param.zy_list = [];
			zy_data.list.push(param);
		}
	}else{
		for(var i = 12; i > 0; i-- ){
			var k = i;
			if(!!document.getElementById("j_"+year+"_"+k)){
				var param = new Object();
				param.month = k+'月';
				param.num = k;
				param.is_live = 1;
				param.zy_list = [];
			}else{
				var param = new Object();
				param.month = k+'月';
				param.num = k;
				param.is_live = 0;
				param.zy_list = [];
			}
			zy_data.list.push(param);
		}
	}
}
/*
*author:zhaoj
*function:获取任教班级
*date：20160528
*/
function getTeachPlanByPersonId(type,xq_id,callback){
	api.ajax({
		url : BASE_URL_ACTION + '/class/getTeachPlanByPersonId',
		method : 'post',
		timeout : 30,
		dataType : 'json',
		data : {
			values : {
				"random_num" : creatRandomNum(),
				"xq_id" : xq_id,
				"person_id" : $api.getStorage("person_id")
			}
		},
		headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
		}, function(ret, err) {
			if (err) {
				api.hideProgress();
				popToast('对不起，获取任教班级失败');
		} else {
			if(ret){
				var subjectArray = [];
				var count = 0;//记录任教班级中是否和当前检测所属学科匹配
				for(var i = 0; i<ret.length; i++){
					if(type){
						if(ret[i].subject_id == api.pageParam.subject_id){
							class_length = ret[i].class_ids.split(',').length;
							callback(ret[i].class_ids);	
						}else{
							count++;
						}
					}else{
						subjectArray.push(ret[i].subject_id)
					}
				}	
				if(!type){
					callback(subjectArray.toString());	
				}else{
					if(count == ret.length){
						callback("");
					}
				}
			}else{
				api.hideProgress();
				popToast('对不起，获取任教班级失败');
			}
		}
	});	
}
/*
*作者:zhaoj
*功能:获取我的检测收藏的数据
*日期：20160920
*/
function getCollectZyList(current_Page,is_delete,page_size){
	if(is_delete == 1){
		showSelfProgress('取消收藏中...') 
	}
	current_Page = current_Page == -1 ? 1 : current_Page;
	setZyData(current_Page,zy_data.year);
	api.ajax({
		url : BASE_URL_ACTION + '/xx/getCollectZyList',
		method : 'get',
		timeout : 30,
		dataType : 'json',
		data : {
			values : {
				"random_num" : creatRandomNum(),
				"person_id" : $api.getStorage("person_id"),
				"pageSize" : page_size,
				"pageNumber" :current_Page,
				"order_type" : 1,
				"zy_type" : 1,
				"subject_ids":subject_ids,
				"xq_id" : xq_id,
				"identity_id":$api.getStorage("identity"),
			}
		},
		headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
		}, function(ret, err) {
			api.hideProgress();
			if (err) {
				addZuoyeTemplateHtml('zy_div', 'zy_script',zy_data,current_Page);
			} else {
				if(ret.success){
					var list = ret.zy_list;
					totalPage = ret.totalPage;
	                zy_data.length = ret.totalRow;
					if(list.length >= 0){
						manageCollectZyData(list,function(flag){
							if(flag){
								addZuoyeTemplateHtml('zy_div', 'zy_script',zy_data,current_Page);
							}else{
								addZuoyeTemplateHtml('zy_div', 'zy_script',zy_data,2);
							}
						});
					}else{
						addZuoyeTemplateHtml('zy_div', 'zy_script',zy_data,current_Page);
					}
				}else{
					addZuoyeTemplateHtml('zy_div', 'zy_script',zy_data,current_Page);
				}
			}
		});
		//通知顶部下拉刷新数据加载完毕，组件会恢复到默认状态
		commonControlRefresh();
}
/*
*作者:zhaoj
*功能:处理检测数据
*日期：20160920
*/
function manageCollectZyData(list,callback){
	var nowYear = nowTime.getFullYear();//当前的年
	var nowMonth = nowTime.getMonth()+1;//当前的月份
	var flag=true;
	for(var i = 0; i < list.length; i++){
		var zyYear = list[i].collect_time.substring(0,4);
		var zyMonth = list[i].collect_time.substring(5,7);
		if(zy_data.year==''||zyYear !=zy_data.year){
			if(zy_data.year != ''){
				if(currentPage == 1){
					flag=false;
				}
				addZuoyeTemplateHtml('zy_div', 'zy_script',zy_data,currentPage);
			}
			zy_data.year=zyYear;
			setZyData(1,zyYear);
		}
		var param = new Object();
		param.day = list[i].collect_time.substring(8,10);
		param.time = list[i].collect_time.substring(11,16);
		param.down_count = list[i].down_count;
		param.zy_name = list[i].zy_name;
		param.zy_name_base64 = Base64.encode(list[i].zy_name);
		param.zy_id = list[i].zy_id;
		param.subject_id = list[i].subject_id;
		param.collect_count= list[i].collect_count;
		param.stage_id = list[i].stage_id;
		param.ti_count = list[i].ti_count;
		param.zy_type = list[i].zy_type;
		param.person_name = list[i].person_name;
		param.person_id = list[i].person_id;
		param.total_scores = list[i].total_scores;
		param.org_name = list[i].org_name;
		for(var j = 0; j<zy_data.list.length;j++){
			if(zy_data.list[j].num == zyMonth*1){
				zy_data.list[j].zy_list.push(param);
			}
		}
	}
	callback(flag);
}
/*
*作者:zhaoj
*功能:获取我的检测收藏的数据
*日期：20160920
*/
function getShareZyList(current_Page,is_delete,page_size){
	if(is_delete == 1){
		showSelfProgress('取消共享中...') 
	}
	current_Page = current_Page == -1 ? 1 : current_Page;
	setZyData(current_Page,zy_data.year);
	var jk_url;
	if(type == 1){
		jk_url = BASE_URL_ACTION +'/xx/getShareZyList?random_num='+creatRandomNum()+'&pageNumber='+current_Page+'&pageSize='+page_size+'&zy_type=1&o_type=2&person_id='+$api.getStorage("person_id")+'&identity_id='+$api.getStorage("identity")+'&share_org_type=-1&share_org_id=&audit_result=-1&subject_ids='+subject_ids+'&order_type=1&xq_id='+xq_id;
	}else{
		jk_url = BASE_URL_ACTION +'/xx/getShareZyList?random_num='+creatRandomNum()+'&pageNumber='+current_Page+'&pageSize='+page_size+'&zy_type=1&o_type=1&person_id='+$api.getStorage("person_id")+'&identity_id='+$api.getStorage("identity")+'&share_org_type='+share_org_type+'&share_org_id='+common_bar_id+'&audit_result=&subject_ids='+subject_ids+'&order_type=1&xq_id='+xq_id;
	}
	api.ajax({
		url : jk_url,
		method : 'get',
		timeout : 30,
		dataType : 'json',
		headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
		}, function(ret, err) {
			api.hideProgress();
			if (err) {
				addZuoyeTemplateHtml('zy_div', 'zy_script',zy_data,current_Page);
			} else {
				if(ret.success){
					var list = ret.zy_list;
					totalPage = ret.totalPage;
	                zy_data.length = ret.totalRow;
					if(list.length >= 0){
						manageShareZyData(list,function(flag){
							if(flag){
								addZuoyeTemplateHtml('zy_div', 'zy_script',zy_data,current_Page);
							}else{
								addZuoyeTemplateHtml('zy_div', 'zy_script',zy_data,2);
							}
						});
					}else{
						addZuoyeTemplateHtml('zy_div', 'zy_script',zy_data,current_Page);
					}
				}else{
					addZuoyeTemplateHtml('zy_div', 'zy_script',zy_data,current_Page);
				}
			}
		});
		//通知顶部下拉刷新数据加载完毕，组件会恢复到默认状态
		commonControlRefresh();
}
/*
*作者:zhaoj
*功能:处理我的分享检测数据
*日期：20160920
*/
function manageShareZyData(list,callback){
	var nowYear = nowTime.getFullYear();//当前的年
	var nowMonth = nowTime.getMonth()+1;//当前的月份
	var flag=true;
	for(var i = 0; i < list.length; i++){
		var zyYear = list[i].share_time.substring(0,4);
		var zyMonth = list[i].share_time.substring(5,7);
		if(zy_data.year==''||zyYear !=zy_data.year){
			if(zy_data.year != ''){
				if(currentPage == 1){
					flag=false;
				}
				addZuoyeTemplateHtml('zy_div', 'zy_script',zy_data,currentPage);
			}
			zy_data.year=zyYear;
			setZyData(1,zyYear);
		}
		var param = new Object();
		param.day = list[i].share_time.substring(8,10);
		param.time = list[i].share_time.substring(11,16);
		param.down_count = list[i].down_count;
		param.zy_name = list[i].zy_name;
		param.zy_name_base64 = Base64.encode(list[i].zy_name);
		param.id = list[i].id;
		param.zy_id = list[i].zy_id;
		param.subject_id = list[i].subject_id;
		param.collect_count= list[i].collect_count;
		param.stage_id = list[i].stage_id;
		param.ti_count = list[i].ti_count;
		param.zy_type = list[i].zy_type;
		param.person_name = list[i].person_name;
		param.person_id = list[i].person_id;
		param.total_scores = list[i].total_scores;
		param.org_name = list[i].org_name;
		param.stage_name = list[i].stage_name;
		param.audit_result = list[i].audit_result
		for(var j = 0; j<zy_data.list.length;j++){
			if(zy_data.list[j].num == zyMonth*1){
				zy_data.list[j].zy_list.push(param);
			}
		}
	}
	callback(flag);
}
/*
*author:zhaoj
*function:弹出confirm
*date：20160523
*/
function popConfirm(zy_id,type,msg){
	api.confirm({
		title : "提示",
		msg : msg,
		buttons : ["确定","取消"]
	}, function(ret, err) {
		if(1 == ret.buttonIndex) {
			if(type == 3){
				cancelPublishZy(zy_id);
			}else if(type == 4){
				deleteZy(zy_id);
			}else if(type == 5){
				collectZy(zy_id,type);
			}else if(type == 6){
				collectZy(zy_id,type);
			}else if(type == 7){
				shareZy(zy_id);
			}
		}
	});
}
/*
*author:zhaoj
*function:打开检测试题页面
*date：20160325
*/
function openWriteWin(type,sort){
	var name="";
//	if(api.uiMode == 'pad'){
//		name = 'zuoyeIpad_st_window';
//	}else{
		name = 'zuoyeJsJy_st_window';
//	}
	api.openWin({
		name : name,
		url : name+'.html',
		pageParam : {
			header_h : header_h,
			zy_id : zy_id,
			zy_name_base64 : api.pageParam.zy_name_base64,
			student_id: student_id,
			sort :sort,
			type : type
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
/*
*author:zhaoj
*function:显示隐藏学生分组按钮
*date：20161203
*/
function isShowFooterBtn(type){
	var frameName="";
	var bounces = '';
//	if(api.uiMode == 'pad'){
//		commonExecScript('zuoyeIpad_index_window','','isShowWinFooterBtn('+type+');',0);
//		frameName = 'zuoyeIpad_index_frame';
//		bounces=false;
//	}else{
		commonExecScript('zuoyeJsJy_index_window','','isShowWinFooterBtn('+type+');',0);
		frameName = 'zuoyeJsJy_index_frame';
		bounces = true;
//	}
//	if(type && api.uiMode != 'pad'){
//		var height = header_h+55;
//	}else{
		var height = header_h;
//	}
	api.setFrameAttr({
	    name: frameName,
	    rect: {
	        x: 0,
	        y: header_h,
	        w : 'auto',
	        h: api.winHeight -height
	    },
	    bounces: bounces,
	    vScrollBarEnabled: true,
	    hScrollBarEnabled: true
	});
}
/*
*author:zhaoj
*function:显示隐藏学生分组按钮
*date：20161203
*/
function isShowWinFooterBtn(type){
	if(type){
		$api.removeCls($api.byId('j_footer'),'p-none');
	}else{
		$api.addCls($api.byId('j_footer'),'p-none');
	}
}



/*
*author:zhaoj
*function:根据班级信息获取学生
*date：20161206
*/
function getStudentByTeaClassId(callback){
	api.ajax({
		url : BASE_URL_ACTION + '/ypt/xx/getStudentByTeaClassId',
		method : 'get',
		timeout : 30,
		dataType : 'json',
		cache : false,
		data : {
			values : {
				"random_num" : creatRandomNum(),
				"class_id" : api.pageParam.id,
				"teacher_id" : $api.getStorage("person_id"),
				"pageNumber" : 1,
				"pageSize" : 9999,
			}
		},
		headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
	}, function(ret, err) {
		if (err) {
			callback(false,'获取学生信息失败，请稍候重试');
		} else {
			if(ret){
				if(ret.success){
					callback(true,ret);
				}else{
					callback(false,'获取学生信息失败，请稍候重试');
				}
			}else{
				callback(false,'获取学生信息失败，请稍候重试');
			}
		}
	});
}


/*
*author:zhaoj
*function:获取教师任教班级
*date：20161206
*/
function getTeachClassBySubject(callback){
	api.ajax({
		url : BASE_URL_ACTION + '/ypt/person/getTeachClassBySubject',
		method : 'post',
		timeout : 30,
		dataType : 'json',
		cache : false,
		data : {
			values : {
				"random_num" : creatRandomNum(),
				"teacher_id" : $api.getStorage("person_id")
			}
		},
		headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
	}, function(ret, err) {
		if (err) {
			callback(false,'获取任教班级失败,请稍候重试');
		} else {
			if(ret){
				callback(true,ret);
			}else{
				callback(false,'获取任教班级失败,请稍候重试');
			}
		}
	});
}


/*
*author:zhaoj
*function:获取教师创建的分组
*date：20161206
*/
function getXxGroup(class_ids,callback){
	api.ajax({
		url : BASE_URL_ACTION + '/ypt/xx/getXxGroup',
		method : 'post',
		timeout : 30,
		dataType : 'json',
		cache : false,
		data : {
			values : {
				"random_num" : creatRandomNum(),
				"class_id" : class_ids,
				"person_id" : $api.getStorage("person_id")
			}
		},
		headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
	}, function(ret, err) {
		if (err) {
			callback(false,'获取分组失败,请稍候重试');
		} else {
			if(ret){
				callback(true,ret);
			}else{
				callback(false,'获取分组失败,请稍候重试');
			}
		}
	});
}


/*
*author:zhaoj
*function:展开孩子节点的数据
*date：20161505
*/
function openChild(id){
	var flag= false;
	for(var i = 0; i < class_id.length; i++){
		if(class_id[i] == id){
			flag=true;
			break;
		}
	}
	if(!flag){
		class_id.push(id);
	}
	var node_id=$api.dom(document.getElementById('j_child_'+id).parentNode, '.j_name');
	$api.removeCls(node_id, 'shou-qi');
	$api.addCls(node_id, 'zhan-kai');
	$api.removeCls($api.byId('j_child_'+id),'display-n');
	$api.removeAttr(node_id,'onclick');
	$api.attr(node_id,'onclick','closeChild('+id+')');
}


/*
*author:zhaoj
*function:创建学生分组
*date：20161206
*/
function saveGroup(){
	$api.css($api.byId('j_shadow'),'z-index:3');
	var group_name = $api.trimAll($api.val($api.byId('fl_val')));
	if(group_name.length == 0){
		api.hideProgress();
		popAlert('群组名称不能为空！');
		$api.css($api.byId('j_shadow'),'z-index:-1');
		return;
	}
	api.ajax({
		url : BASE_URL_ACTION + '/ypt/group/saveGroup',
		method : 'post',
		timeout : 30,
		dataType : 'json',
		cache : false,
		data : {
			values : {
				"random_num" : creatRandomNum(),
				"avater_url" : "Li4vLi4vLi4vaW1hZ2VzL2hlYWRfaWNvbi9ncm91cC9kZWZhdWx0LnBuZw==",
				"group_desc" : "",
				"group_name" : group_name,
				"group_type" : 2,
				"parent_id" : -1,
				"parent_type" : 2,
				"plat_id" : 0,
				"plat_type" : 4,
				"use_range" : 1
			}
		},
		headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
	}, function(ret, err) {
		if (err) {
			api.hideProgress();
			popAlert('添加失败，请稍候重试');
			$api.css($api.byId('j_shadow'),'z-index:-1');
		} else {
			if(ret){
				addXxGroup(ret.id);
			}else{
				api.hideProgress();
				popAlert('添加失败，请稍候重试');
				$api.css($api.byId('j_shadow'),'z-index:-1');
			}
		}
	});
}

/*
*author:zhaoj
*function:创建学生分组
*date：20161206
*/
function addXxGroup(group_id){
	api.ajax({
		url : BASE_URL_ACTION + '/ypt/xx/addXxGroup',
		method : 'post',
		timeout : 30,
		dataType : 'json',
		cache : false,
		data : {
			values : {
				"random_num" : creatRandomNum(),
				"class_id" : api.pageParam.id,
				"group_id" : group_id,
				"person_id" : $api.getStorage("person_id")
			}
		},
		headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
	}, function(ret, err) {
		if (err) {
			popTipInfo(1);
		} else {
			if(ret){
				if(ret.success){
					setTimeout(function(){
						popToast('添加成功');
						api.execScript({
							name : 'zuoyeJsJy_stu_group_window',
							frameName : 'zuoyeJsJy_stu_group_frame',
							script : 'initData();'
						});
					},1500);
					setTimeout(function(){
						api.hideProgress();
						commonCloseFrame("zuoyeJsJy_group_name_frame");
					},1600);
				}else{
					popTipInfo(1);
				}
			}else{
				popTipInfo(1);
			}
		}
	});
}

/*
*author:zhaoj
*function:编辑学生分组
*date：20161206
*/
function updateGroup(){
	$api.css($api.byId('j_shadow'),'z-index:3');
	var group_name = $api.trimAll($api.val($api.byId('fl_val')));
	if(group_name.length == 0){
		api.hideProgress();
		popAlert('群组名称不能为空！');
		$api.css($api.byId('j_shadow'),'z-index:-1');
		return;
	}
	api.ajax({
		url : BASE_URL_ACTION + '/ypt/group/updateGroup',
		method : 'post',
		timeout : 30,
		dataType : 'json',
		cache : false,
		data : {
			values : {
				"random_num" : creatRandomNum(),
				"avater_url" : -1,
				"group_desc" : "",
				"id" : api.pageParam.id,
				"group_name" : group_name
			}
		},
		headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
	}, function(ret, err) {
		if (err) {
			popTipInfo(0);
		} else {
			if(ret){
				if(ret.success){
					setTimeout(function(){
						popToast('编辑成功');
						api.execScript({
							name : 'zuoyeJsJy_stu_group_window',
							frameName : 'zuoyeJsJy_stu_group_frame',
							script : 'initData();'
						});
					},1500);
					setTimeout(function(){
						api.hideProgress();
						commonCloseFrame("zuoyeJsJy_group_name_frame");
					},1600);
				}else{
					popTipInfo(0);
				}
			}else{
				popTipInfo(0);
			}
		}
	});
}

/*
*author:zhaoj
*function:隐藏孩子节点
*date：20161205
*/
function closeChild(id){
	for(var i = 0; i < class_id.length; i++){
		if(class_id[i] == id){
			class_id.splice(i,1);
		}
	}
	var node_id=$api.dom(document.getElementById('j_child_'+id).parentNode, '.j_name');
	$api.removeCls(node_id, 'zhan-kai');
	$api.addCls(node_id, 'shou-qi');
	$api.addCls($api.byId('j_child_'+id),'display-n');
	$api.removeAttr(node_id,'onclick');
	$api.attr(node_id,'onclick','openChild('+id+')');
}

/*
*author:zhaoj
*function:提示删除学生分组信息
*date：20161208
*/
function deleteGroup(group_id,group_name){
	var msg;
	if(group_name.length>5){
		msg = '确定删除分组“'+group_name.substring(0,5)+'...”吗？';
	}else{
		msg = '确定删除分组“'+group_name+'”吗？';
	}
	popTwoBtnConfirm('提示',msg,'deleteXxGroup('+group_id+')');
}

/*
*author:zhaoj
*function:删除学生分组
*date：20161206
*/
function deleteXxGroup(group_id){
	showSelfProgress('删除中...');
	api.ajax({
		url : BASE_URL_ACTION + '/ypt/xx/deleteXxGroup',
		method : 'post',
		timeout : 30,
		dataType : 'json',
		cache : false,
		data : {
			values : {
				"random_num" : creatRandomNum(),
				"group_id" : group_id,
				"person_id" : $api.getStorage("person_id"),
			}
		},
		headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
	}, function(ret, err) {
		if (err) {
			popTipInfo(2);
		} else {
			if(ret){
				if(ret.success){
					setTimeout(function(){
						api.hideProgress();
						popToast('删除成功');
						initData();
					},1500);
				}else{
					popTipInfo(2);
				}
			}else{
				popTipInfo(2);
			}
		}
	});
}