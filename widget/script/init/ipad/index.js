/**
* 初始化高度
* zhaoj
* 2017.09.29
*/
function initHeight(){
	api.parseTapmode();
	//初始化高度
	var header = $api.byId('aui-header');
	$api.fixStatusBar(header);
	var headerPos = $api.offset(header);
	param_json.header_h = headerPos.h;
	var body_h = $api.offset($api.dom('body')).h;
	param_json.rect_h = body_h - param_json.header_h;
}
/**
 * 设置头像
 * 赵静
 * 2017.08.10
 */
function setHeaderImg(){
	var avatar_url = document.getElementById("avatar_url");
	avatar_url.src = $api.getStorage('avatar_url');
	$api.text($api.byId('j_person_name'),$api.getStorage('person_name'));
}
/**
 * 从我的页面返回index
 * 周枫
 * 2017.07.24
 */
function backIndex() {
	if(back_type == 'w' ){
		changeTitle('index');
		commonCloseFrame('w_index');
	}else if(back_type == 'infor'){
		changeTitle('index');
		//隐藏通讯录组件
		api.execScript({
			frameName : 'txl_index',
			script : 'hideMyself();'
		});
		//隐藏会话以及通讯录页面
		api.setFrameGroupAttr({
		    name: 'lxxt_information_group',
		    hidden: true
		});
		//隐藏通讯录、会话中添加好友、创建群组按钮
		commonCloseFrame('txl_menu_frame');
	}else if(back_type == 'tzxx'){
		changeTitle('index');
		commonCloseFrame('ipad_tzxx_frame');
	}
}

/**
 * 打开我配置页面
 * 周枫
 * 2017.07.24
 */
function openMyConfig() {
	var height_top = param_json.header_h -50;
	var pageParamJson = {
		'header_h' :height_top,
		'reload':true
	};
	commonOpenWin('w_index_window', 'widget://html/wo/ipad/w_index_window.html', false, false, pageParamJson);
	changeTitle('w');
}
/**
 * 打开拓展学习
 * zhaoj
 * 2017.10.26
 */
function openTzxxFrame() {
	var height_top = param_json.header_h -50;
	var pageParamJson = {
		'header_h' :param_json.header_h
	};
	commonOpenFrame("ipad_tzxx_frame", "widget://html/init/ipad/student/student_kzxx_window.html", height_top, false, false, "rgba(0,0,0,0)", pageParamJson);
	changeTitle('tzxx');
}
/**
 * 初始化慧学习和慧生活页面组
 * 周枫
 * 2017.07.24
 */
function initLxxtPadFrameGroup() {
    console.log(JSON.stringify(param_json));
	api.openFrameGroup({
		name : 'lxxt_index_group',
		scrollEnabled : true,
		rect : {
			'x' : 0,
			'y' : param_json.header_h ,
			'w' : 'auto',
			'h' : api.winHeight - param_json.header_h
		},
		index : 0,
		//预加载
		preload : 2,
		scrollToTop : true,
		bounces : true,
		scrollEnabled : true,
		frames : [{
			name : 'cshym_hxx_frame',
			scrollToTop : true,
			allowEdit : true,
			url : param_json.module[0].html_url,
			bgColor : '#f7f9f8',
			pageParam : {
				header_h : param_json.header_h
			},
			vScrollBarEnabled : true,
			hScrollBarEnabled : false,
			//页面是否弹动 为了下拉刷新使用
			bounces : false
		}, {
			name : 'cshym_hsh_frame',
			scrollToTop : true,
			allowEdit : true,
			url : param_json.module[1].html_url,
			bgColor : '#f7f9f8',
			pageParam : {
				header_h : param_json.header_h
			},
			vScrollBarEnabled : true,
			hScrollBarEnabled : false,
			//页面是否弹动 为了下拉刷新使用
			bounces : false
		}]
	}, function(ret, err) {
		var btn_index = ret.index;
		switch(btn_index){
			case 0:
				changeBtnTitle('hxx_btn',0,0);
			break;
			case 1:
				changeBtnTitle('hsh_btn',1,0);
			break;
		}
		
		openWebPageWin();
	});
}
/**
 * 初始化会话和通讯录页面组
 * 赵静
 * 2017.07.24
 */
function initInformationPadFrameGroup() {
		var h = 0;
		var height_h = param_json.header_h -50;
		if(is_fir_open){
			//初始化页面时高度为0，进而打开页面，但页面隐藏
			h = 0;
		}else{
			//点击会话按钮显示会话以及通讯录页面
			api.closeFrameGroup({
				name : 'lxxt_information_group'
			});
			is_fir_txl = 0;
			changeTitle('infor');
			h = api.winHeight - height_h;
		}
		api.openFrameGroup({
			name : 'lxxt_information_group',
			rect : {
				'x' : 0,
				'y' : height_h ,
				'w' : 'auto',
				'h' : h
			},
			index : 0,
			//预加载
			preload : 1,
			scrollToTop : true,
			bounces : false,
			scrollEnabled : false,
			frames : [{
				name : 'hh_index',
				scrollToTop : true,
				allowEdit : true,
				url : 'widget://html/huihua/hh_index_window.html',
				bgColor : '#f7f9f8',
				pageParam : {
					header_h : height_h,
					'from_html' : from_html
				},
				vScrollBarEnabled : false,
				hScrollBarEnabled : false,
				//页面是否弹动 为了下拉刷新使用
				bounces : false
			}, {
				name : 'txl_index',
				scrollToTop : true,
				allowEdit : true,
				url : 'widget://html/tongxunlu/txl_index_window.html',
				bgColor : '#f7f9f8',
				pageParam : {
					header_h : height_h
				},
				vScrollBarEnabled : false,
				hScrollBarEnabled : false,
				//页面是否弹动 为了下拉刷新使用
				bounces : false
			}]
		}, function(ret, err) {
			switch(ret.index){
				case 0:
					changeInforBtnTitle('hh_btn',0,0);
				break;
				case 1:
					changeInforBtnTitle('txl_btn',1,0);
				break;
			}
			from_html = '';
			if(!is_fir_open){

			}else{
				initLxxtPadFrameGroup();
				is_fir_open = false;
			}
		});
}
/**
 * 关闭framegroup
 * 周枫
 * 2016.11.16
 */
function closeGroup() {
	api.closeWin({ name: 'w_index_window'});
	api.closeFrameGroup({
		name : 'lxxt_index_group'
	});
	api.execScript({
		frameName : 'txl_index',
		script : 'hideMyself();'
	});
	//关闭示会话以及通讯录页面
	api.closeFrameGroup({
		name : 'lxxt_information_group'
	});
}
/**
 * 切换按钮
 * 周枫
 * 2016.1.21
 */
function changeBtnTitle(btn_id, btn_type,type) {
	var $btn_title = $api.byId('btn_title');
	var $btn_title_all = $api.domAll($btn_title, 'div');
	var btn_obj = $api.dom('#' + btn_id);
	for (var j = 0; j < $btn_title_all.length; j++) {
		$api.removeCls($btn_title_all[j], 'btn-top-active');
	}
	//定义切换页面样式json
	var rect_json = {};
	if(id_fir_cshym){
		setTimeout(function(){
			//commonExecScript('root','cshym_hsh_frame','setMarginTop();',1);
		},2000);
	}
	if (btn_type == 0) {
		$api.addCls(btn_obj, 'btn-top-active');
	} else {
		$api.addCls(btn_obj, 'btn-top-active');
	}
	if(type || id_fir_cshym){
		api.setFrameGroupIndex({
			name : 'lxxt_index_group',
			index : btn_type,
			scroll : true,
			rect : {
				'x' : 0,
				'y' : param_json.header_h ,
				'w' : 'auto',
				'h' : api.winHeight - param_json.header_h
			},
		});
		id_fir_cshym = false;
	}
}
/**
 * 切换按钮
 * 周枫
 * 2016.1.21
 */
function changeInforBtnTitle(btn_id, btn_type,type) {
	var $btn_title = $api.byId('infor_btn_title');
	var $btn_title_all = $api.domAll($btn_title, 'div');
	var btn_obj = $api.dom('#' + btn_id);
	for (var j = 0; j < $btn_title_all.length; j++) {
		$api.removeCls($btn_title_all[j], 'btn-active-top');
	}
	//定义切换页面样式json
	var rect_json = {};
	if (btn_type == 0) {
		$api.addCls(btn_obj, 'btn-active-top');
	} else {
		$api.addCls(btn_obj, 'btn-active-top');
	}
	if(type){
		api.setFrameGroupIndex({
			name : 'lxxt_information_group',
			index : btn_type,
			scroll : true
		});
	
	if(btn_type == 0){
		date1 = new Date();
		api.hideProgress();
		if(is_fir_txl != 0){
			api.execScript({
				frameName : 'hh_index',
				script : 'getCoversationList();'
			});
			api.execScript({
				frameName : 'txl_index',
				script : 'hideMyself();'
			});
		}
	}else{
		if (is_fir_txl == 0) {
			is_fir_txl = 1;
			api.execScript({
				frameName : 'txl_index',
				script : 'loadData();'
			});
		} else {
			//						date1 = new Date();
			var d_time = getSecondCha();
			if (d_time > 3) {
				api.execScript({
					frameName : 'txl_index',
					script : 'loadData();'
				});
			} else {
				api.execScript({
					frameName : 'txl_index',
					script : 'showMyself();'
				});
			}
		}
	}
	}
}

/**
 * 退出到首页
 * 周枫
 * 2015.10.23
 */
function goLogin() {
	api.openWin({
		name : 'login',
		url : 'login.html',
		bounces : false,
		opaque : false,
		showProgress : false,
		vScrollBarEnabled : false,
		hScrollBarEnabled : false,
		slidBackEnabled : false,
		delay : 0,
		animation : {
			type : "reveal", //动画类型（详见动画类型常量）
			subType : "from_left", //动画子类型（详见动画子类型常量）
			duration : 300
		},
	});
	$api.val($api.byId('login_name_input'), '');
	$api.val($api.byId('login_pas_input'), '');
}

/**
 * 改变标题文字
 * 周枫
 * 2017.07.24
 */
function changeTitle(title_type) {
	switch(title_type) {
		case 'index':
			setBack('second_index');
			commonAddOrRemoveHideCss('tzxx_title',0);
			$api.addCls($api.byId('back'), 'aui-hide');
			$api.addCls($api.byId('w_title'), 'aui-hide');
			$api.addCls($api.byId('j_infor'), 'aui-hide');
			$api.addCls($api.byId('j_infor_add'), "aui-hide");
			$api.removeCls($api.byId('mTitle'), 'aui-hide');
			$api.removeCls($api.byId('j_left'), 'aui-hide');
			$api.removeCls($api.byId('j_right'), 'aui-hide');
			back_type = 'index';
			break;
		case 'w':
			setBack('w');
			back_type = 'w';
			break;
		case 'infor':
			setBack('infor');
			commonAddOrRemoveHideCss('tzxx_title',0);
			$api.addCls($api.byId('j_left'), 'aui-hide');
			$api.addCls($api.byId('j_right'), 'aui-hide');
			$api.addCls($api.byId('mTitle'), 'aui-hide');
			$api.addCls($api.byId('w_title'), 'aui-hide');
			$api.removeCls($api.byId('back'), 'aui-hide');
			$api.removeCls($api.byId('j_infor'), 'aui-hide');
			$api.removeCls($api.byId('j_infor_add'), "aui-hide");
			back_type = 'infor';
			break;
		case 'tzxx':
			setBack('tzxx');
			$api.addCls($api.byId('j_left'), 'aui-hide');
			$api.addCls($api.byId('j_right'), 'aui-hide');
			$api.addCls($api.byId('mTitle'), 'aui-hide');
			$api.addCls($api.byId('w_title'), 'aui-hide');
			$api.addCls($api.byId('j_infor'), 'aui-hide');
			$api.addCls($api.byId('j_infor_add'), "aui-hide");
			$api.removeCls($api.byId('back'), 'aui-hide');
			commonAddOrRemoveHideCss('tzxx_title',1);
			back_type = 'tzxx';
			break;
	}
}
/**
 * 打开页面设置返回
 * zhaoj
 * 2017.07.23
 */
function setBack(back_type){
	//安卓关闭
	if (api.systemType == 'android') {
		closeAppForAndroid(back_type);
	}
}
/**
 * 重置会话未读数量
 * 周枫
 * 2016.5.24
 */
function getUnreadCount(un_type, un_count) {
	un_count = parseInt(un_count);
	switch(un_type) {
		case 'hh':
			if (un_count > 0) {
				$api.html($api.byId('hh_a'),  un_count);
				$api.removeCls($api.byId('hh_a'), 'aui-hide');
			} else {
				$api.html($api.byId('hh_a'), '');
				$api.addCls($api.byId('hh_a'), 'aui-hide');
			}
			break;
		case 'yy':
			if (un_count > 0) {
				$api.html($api.byId('yy_a'), '(' + un_count + ')');
			} else {
				$api.html($api.byId('yy_a'), '');
			}
			break;
	}
}
/**
 * 获取时间差，10秒后刷新通讯录
 * 周枫
 * 2016.1.13
 */
function getSecondCha() {
	//开始时间
	//			alert("aa");
	var date2 = new Date();
	if ( typeof ('undefined') == date1) {
		date1 = new Date();
	}
	//结束时间
	var date3 = date2.getTime() - date1.getTime();
	//时间差的毫秒数
	//计算出相差天数
	//			var days = Math.floor(date3 / (24 * 3600 * 1000));
	//计算出小时数
	var leave1 = date3 % (24 * 3600 * 1000);
	//计算天数后剩余的毫秒数
	//			var hours = Math.floor(leave1 / (3600 * 1000));
	//计算相差分钟数
	var leave2 = leave1 % (3600 * 1000);
	//计算小时数后剩余的毫秒数
	//			var minutes = Math.floor(leave2 / (60 * 1000));
	//计算相差秒数
	var leave3 = leave2 % (60 * 1000);
	//计算分钟数后剩余的毫秒数
	var seconds = Math.round(leave3 / 1000);
	return seconds;
	//			alert(" 相差 " + days + "天 " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒")
}

/**
 * 打开增加好友页面
 * zhaoj
 * 2018.01.28
 */
function openAddWindow(win_name) {
	var height_top = param_json.header_h -50;
	var pageParamJson = {
		"header_h" : height_top,
		"from_name": 'root'
	};
	commonOpenFrame('txl_menu_frame', 'widget://html/tongxunlu/txl_menu_frame.html', 0, false, false, "rgba(0,0,0,0)", pageParamJson);
}