/**
* 初始化高度
* zhaoj
* 2017.09.29
*/
function initHeight(){
	api.parseTapmode();
	var header = $api.byId('aui-header');
	$api.fixStatusBar(header);
	var headerPos = $api.offset(header);
	param_json.header_h = headerPos.h;
	var body_h = $api.offset($api.dom('body')).h;
//	var uiMode = api.uiMode;
	var idy_type = $api.getStorage('idy_type');
//	if(uiMode=='pad'){
//		if(idy_type == 'parent' || idy_type == 'work'){
//			var body_w = $api.offset($api.dom('body')).w;
//			if(body_w > body_h){
//				body_h = body_w;
//			}
//		}	
//	}
	param_json.footer_h = $api.offset($api.byId('aui-footer')).h;
	param_json.rect_h = body_h - param_json.header_h - param_json.footer_h;
}
/**
* 打开frame群组
* 赵静
* 2017.09.29
*/
function openFrameGroup() {
	api.openFrameGroup({
		name : 'group',
		scrollEnabled : false,
		rect : {
			x : 0,
			y : param_json.header_h,
			w : 'auto',
			h : param_json.rect_h
		},
		index : 2,
		//预加载
		preload : 5,
		scrollToTop : true,
		bounces : false,
		frames : [{
			name : 'hh_index',
			url : param_json.module[0].html_url,
			bounces : false,
			pageParam : {
				'header_h' : param_json.header_h
			}
		}, {
			name : 'hxx_index',
			url : param_json.module[1].html_url,
			bounces : false,
			pageParam : {
				'header_h' : param_json.header_h
			}
		}, {
				name : 'center_index',
				url : param_json.module[2].html_url,
				bounces : true,
				pageParam : {
					'header_h' : param_json.header_h
				}
			}, {
			name : 'nav_3',
			url : param_json.module[3].html_url,
			bounces : false,
			pageParam : {
				'header_h' : param_json.header_h
			}
		}, {
			name : 'w_index',
			url : param_json.module[4].html_url,
			bounces : true,
			pageParam : {
				'header_h' : param_json.header_h
			}
		}]
	}, function(ret, err) {
		openWebPageWin();
	});
	api.setFrameGroupAttr({
	    name: 'group',
	    hidden: false
	});
}
/**
* 切换菜单
* 赵静
* 2017.09.29
*/
function randomSwitchBtn(index, name) {
	var idy_id = $api.getStorage('idy_id')*1;
	var code='';
	if(idy_id == 3 && index == 3){
		//云办公下新闻资讯验证crm
		code='hbg_rcbg_xwzx2'
	}else{
		code='';
	}
	getCrmInfoByPerson(code,function(flag,infor){
		if(flag){
			var btn_title = $api.byId('aui-footer');
			var btn_title_active = $api.dom(btn_title, '.active');
			$api.removeCls(btn_title_active, 'active');
			$api.addCls($api.byId('j_nav_'+index), 'active');
			commonSetFrameHidden('txl_index',true);//隐藏通讯录页面
			commonDownNav(index);
			commonSetWindowName(name);
			switch (index) {
				//消息
				case 0:
					setInfor();
					break;
				//第二个选项
				case 1:
					break;
				//中间选项
				case 2:
					break;
				//第四个选项
				case 3:
					onclickFourDownNav();
					break;
				//第五个选项
				case 4:
					break;
			}
			api.setFrameGroupAttr({
			    name: 'group',
			    hidden: false
			});
			api.setFrameGroupIndex({
				name : 'group',
				index : index,
				scroll : true
			});
		}else{
			popAlert(infor);
		}
	});
}
/*
*author:zhaoj
*function:所有首页下方导航公用的方法
*date：20180130
*/
function commonDownNav(index){
	//显示或隐藏添加好友菜单页面，当点击消息选项时，显示
	index == 0? commonAddOrRemoveHideCss('j_infor_add',1):commonAddOrRemoveHideCss('j_infor_add',0);
	var idy_id = $api.getStorage('idy_id')*1;
	//办公下
	if(idy_id == 3 && index == 3){
		//办公下，点击新闻资讯，显示添加新闻资讯的按钮
		commonAddOrRemoveHideCss('j_xwzx_add',1)
	}else if(idy_id == 3 && index != 3){
		//除了新闻资讯，全部隐藏滑动条
		commonAddOrRemoveHideCss('j_xwzx_add',0)
		commonExecScript('','nav_3','commonCloseNavigationBar();',2);//关闭新闻资讯的导航条
		commonExecScript('','nav_3','clearData();',2);//清空新闻资讯的内容
	}
	//教师,学生主页面显示添加圈子图标
	if(idy_id != 3 && index == 2){
		if($api.getStorage('quanzi_first_change_type'+ $api.getStorage('person_id'))==104 && $api.getStorage('identity') == 6){
			commonAddOrRemoveHideCss('j_quanzi_add',0);
		}else if ($api.getStorage('identity') != 7){
			commonAddOrRemoveHideCss('j_quanzi_add',1);
		}
	}else{
		commonAddOrRemoveHideCss('j_quanzi_add',0);
	}
	//教师/学生圈子下拉菜单
	if(idy_id < 2 && index == 2){
		commonAddOrRemoveHideCss('j_quanzi_menu',1);
	}else{
		commonAddOrRemoveHideCss('j_quanzi_menu',0);
	}
}
/*
*author:zhaoj
*function:点击首页下方导航第四个选项，教师：慧办公；学生：慧生活；家长：家长学校；办公：新闻资讯
*date：20180130
*/
function onclickFourDownNav(){
	var idy_id = $api.getStorage('idy_id');
	switch (idy_id*1) {
		//慧办公
		case 0:
			break;
		//慧生活
		case 1:
			break;
		//家长学校
		case 2:
			break;
		//新闻资讯
		case 3:
			commonExecScript('','nav_3','initDataFirst();',2);//加载新闻资讯
			break;
	}
}
/*
*author:zhaoj
*function:点击消息，设置消息的相关数据
*date：20180128
*/
function setInfor(){
	//消息设置window页面名称
	commonSetWindowName('<div id="btn_title" class="btn-title"><div id="conversation" class="btn-l btn-top-active btn-top" onclick="changeInforBtnTitle(this.id,0);">会话</div><div id="mail_list" class="btn-r btn-top" onclick="changeInforBtnTitle(this.id,1);">通讯录</div></div>');
}
/**
* 数据分析组-人人通登陆次数统计
* 后台接口提供人：隋海洋
* zhaoj
* 2017.05.22
*/
function renrenTongLogCount(){
	var index = BASE_URL_ACTION.indexOf('dsideal_yy');
var url_str = BASE_URL_ACTION.substring(0,index-1);
api.ajax({
	url : url_str + '/BDA/login/renrenTongLogCount.jhtml?loginType=1&person_id='+$api.getStorage("person_id")+'&identity_id='+$api.getStorage("identity"),
	method : 'post',
	dataType : 'json',
	timeout : 30,
	cache : false,
	headers : {
		'Cookie' : 'person_id='+$api.getStorage("person_id")+';identity_id='+$api.getStorage("identity")+'; token='+$api.getStorage("token_ypt")+';'
		}
	}, function(ret, err) {
	});
}
var date1 = new Date();
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
/*
*author:zhaoj
*function:监听白板是否有数据传递过来
*date：20160203
*/
function monitor() {
	var cname = '080027C11C21';
	api.ajax({
		url : 'http://' + BASE_SERVER_IP + ':8100/sub?cname=' + cname + '&seq=' + seq,
		method : 'get',
		dataType : 'json',
		timeout : 30,
		cache : false,
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + ';identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		api.hideProgress();
		if (ret) {
			if ( ret instanceof Array) {
			} else {
				ret = [ret];
			}
			for (var k in ret) {
				var msg = ret[k];
				if (msg.type == 'next_seq') {
					seq = parseInt(msg.seq);
					monitor();
					continue;
				}
				if (msg.type != 'data' && msg.type != 'broadcast') {
					seq = 0;
					monitor();
					continue;
				}
				if (msg.type == 'data') {
					seq = parseInt(msg.seq) + 1;
				}
				alert(msg.content);
				timeout = setTimeout('monitor();', 500);
			}
		} else {
			clearTimeout(timeout);
			timeout = setTimeout('monitor();', 500);
		}
	});
}

/**
* 打开增加好友页面
* 周枫
* 2016.1.19
*/
function openAddWindow(win_name) {
	var pageParamJson = {
		"header_h" : param_json.header_h,
		"from_name": 'root'
	};
	commonOpenFrame('txl_menu_frame', 'widget://html/tongxunlu/txl_menu_frame.html', 0, false, false, "rgba(0,0,0,0)", pageParamJson);
}

/**
* 初始化极光推送
* 周枫
* 2016.11.17
*/
function initJgPush() {
	var jpush = api.require('ajpush');
	jpush.init(function(ret) {
		if (ret && ret.status) {
		}
	});
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
			$api.html($api.byId('hh_a'), '(' + un_count + ')');
		} else {
			$api.html($api.byId('hh_a'), '');
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
* 切换会话和通讯录按钮
* zhaoj
* 2017.09.29
*/	
function changeInforBtnTitle(btn_id, btn_type) {
	var btn_title = $api.byId('btn_title');
	var btn_title_active = $api.dom(btn_title, '.btn-top-active');
	$api.removeCls(btn_title_active, 'btn-top-active');
	$api.addCls($api.byId(btn_id), 'btn-top-active');
	if(btn_type == 1){
		initTxlData();//初始化通讯录
		//会话、通讯录切换时，切换到通讯录，隐藏会话页面，切换到会话时展开会话页面
		api.setFrameGroupAttr({
		    name: 'group',
		    hidden: true
		});
	}else{
		//会话、通讯录切换时，切换到通讯录，隐藏会话页面，切换到会话时展开会话页面
		api.setFrameGroupAttr({
		    name: 'group',
		    hidden: false
		});
		//会话页面
		commonSetFrameHidden('txl_index',true);//隐藏通讯录页面
		if(!param_json.is_first){
			commonExecScript('','hh_index','getCoversationList();',2);//加载会话
		}
	}
}
/**
* 初始化通讯录
* zhaoj
* 2017.09.29
*/
function initTxlData(){
	//通讯录页面
	if(param_json.is_first){
		//第一次进入通讯录页面
		pageParamJson={"header_h":param_json.header_h,"h":api.winHeight - param_json.header_h-param_json.footer_h,"footer_h":param_json.footer_h,"rect_h":param_json.rect_h};//打开frame页面json数据
		commonOpenFrame("txl_index","widget://html/tongxunlu/txl_index_window.html",param_json.header_h,false,false,"rgba(0,0,0,0)",pageParamJson);//打开frame页面
		setTimeout(function(){
			commonExecScript('','txl_index','loadData();',2);//加载通讯录
			param_json.is_first = 0;
		},1000);
	}else{
		var d_time = getSecondCha();
		commonSetFrameHidden('txl_index',false);//显示通讯录页面
		if (d_time > 10) {
			commonExecScript('','txl_index','loadData();',2);//加载通讯录
		}
	}
}
/**
* 添加新闻资讯
* zhaoj
* 2017.10.17
*/
function openTongzhiAddFrame(){
	commonExecScript('','nav_3','openTongzhiAddFrame();',2);
}
/**
* 添加圈子
* zhaoj
* 2018.01.30
*/
function openAddQuanziWindow(){
	var pageParamJson={"header_h":param_json.header_h,"is_class":param_json.is_class};
	commonExecScript('root','center_index','openAddQuanziWindow('+JSON.stringify(pageParamJson)+');',1);
}
/**
* 打开圈子筛选界面
* wangjian
* 2018.4.24
*/
function openScreenWindow(){
	changeTitle("init_menu");//设置页面返回
	var pageParamJson={"header_h":param_json.header_h};
	commonExecScript('root','center_index','openScreenWindow('+JSON.stringify(pageParamJson)+');',1);
}
/**
 * 设置返回
 * 赵静
 * 2018.01.30
 */
function changeTitle(title_type) {
	switch(title_type) {
		case 'init_menu':
			setBack('init_menu');
			back_type = 'init_menu';
			break;
		case 'picture':
			setBack('picture');
			back_type = 'picture';
			break;
	}
}
/**
 * 从我的页面返回index
 * zhaoj
 * 2017.07.24
 */
function backIndex() {
	if(back_type == 'init_menu' ){
		setBack('second_index');
		commonCloseFrame('init_menu_frame');
	}else if(back_type == 'picture'){
		setBack('second_index');
	}
}	
/**
 * 关闭framegroup
 * 周枫
 * 2016.11.16
 */
function closeGroup() {
	api.closeFrameGroup({
		name : 'group'
	});
	api.execScript({
		frameName : 'txl_index',
		script : 'hideMyself();'
	});
}
