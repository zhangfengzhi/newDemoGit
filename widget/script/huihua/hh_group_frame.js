var old_msg_id = -1;
var avatar_url;
var group_id;
var group_name;
var h_from;
var header_h;
apiready = function() {
	commonSetTheme({"level":2,"type":0});
	group_name = api.pageParam.group_name;
	group_id = api.pageParam.target_id;
	h_from = api.pageParam.h_from;
	header_h = api.pageParam.header_h;
	$api.html($api.byId('group_name'), group_name);

	loadData();

	//监听来自通讯录页面获取最新会话id的事件
	api.addEventListener({
		name : 'setOldMessageId'
	}, function(ret) {
		if (ret && ret.value) {
			var value = ret.value;
			old_msg_id = value.old_msg_id;
		}
	});
}

/**
 * 加载人员列表数据
 * 周枫
 * 2016.12.05
 */
function loadData() {
	api.showProgress({
		title : '加载中...',
		text : '请稍候...',
		modal : true
	});
	isOnLineStatus(function(is_line, line_type) {
		if (is_line) {
			getGroupListByIdFromDb(group_id, 1, 1, function(group_list) {
				api.hideProgress();
				reDataHtml(group_list);
			});
		} else {
			var group_list = $api.getStorage('group_list_data');

			if ( typeof (group_list) != 'undefined') {
				api.hideProgress();
				reDataHtml(group_list);
			}
		}
	});

	//延迟加载图片
	setTimeout(function() {
		echoInitCache();
	}, 300);
}

/**
 * 点击头像进行会话
 * 周枫
 * 2016.10.06
 */
function openHhByImg(t_id, p_name, h_type, h_img) {
	api.openWin({
		name : 'hh_personinfo_window',
		url : 'hh_personinfo_window.html',
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
			'targetId' : t_id,
			'old_msg_id' : -1,
			'conver_type' : h_type,
			'person_name' : p_name,
			'header_h' : header_h,
			'h_from' : h_from,
			'avatar_url' : h_img
		}
	});
}

function readyHhList(target_id, person_name, conver_type, head_img) {
	api.closeWin({
		name : 'hh_chat_window'
	});
	//	closeMyself();
	api.sendEvent({
		name : 'getOldMessageId',
		extra : {
			target_id : target_id,
			conver_type : conver_type,
			count : 1
		}
	});
	//打开会话页面
	setTimeout('execHhList("' + target_id + '","' + person_name + '","' + conver_type + '","' + head_img + '");', 500);
}

function execHhList(target_id, person_name, conver_type, head_img) {
	api.execScript({
		name : 'root',
		frameName : 'hh_index',
		script : 'openHhList("' + target_id + '",' + old_msg_id + ',"' + person_name + '","' + conver_type + '","' + h_from + '","' + head_img + '");'
	});
	//	closeMyself();
}

function closeMyself() {
	api.closeFrame();

	api.closeWin({
		name : 'hh_group_window'
	});
}

function doSearch() {
	$api.addCls($api.dom(".aui-searchbar-wrap"), "focus");
	$api.dom('.aui-searchbar-input input').focus();
}

function cancelSearch() {
	var content = $api.val($api.byId("aui-searchbar-input"));
	$api.removeCls($api.dom(".aui-searchbar-wrap.focus"), "focus");
	$api.val($api.byId("aui-searchbar-input"), '');
	$api.dom('.aui-searchbar-input input').blur();
	setTimeout(function() {
		loadData();
	}, 300);
}

function clearInput() {

	$api.val($api.byId("aui-searchbar-input"), '');
	search(1);
}

function search(type) {
	var content = $api.val($api.byId("aui-searchbar-input"));
	if (content) {
		selectPListByGIdFromDbLikeName(group_id, content, function(group_list) {
			reDataHtml(group_list);
		});
	} else {
		if(type==1){
			selectPListByGIdFromDbLikeName(group_id, content, function(group_list) {
				reDataHtml(group_list);
			});
		}else{
			api.toast({
				msg : '请输入人员姓名'
			});
		}
		
	}
	
	
	$api.dom('.aui-searchbar-input input').blur();
}

/**
 * 渲染页面
 * 周枫
 * 2016.12.05
 * @param {Object} group_list
 */
function reDataHtml(group_list) {
	$api.html($api.byId('group-*'), html1);
	$api.html($api.dom('.aui-indexed-list-bar'), html2);
	var list = group_list.list;
	if(list.length > 0){
	    commonAddOrRemoveHideCss('j_no_data',0);
    	for (var i = 0; i < list.length; i++) {
    		var key = list[i].jp_first;
    		var reg = /^[a-zA-Z]/;
    		if (reg.test(key)) {
    			$api.removeCls($api.byId('group-' + key), 'display-none');
    			$api.after($api.byId('group-' + key), "<li class=\"remove-class aui-list-view-cell\" onclick=\"openHhByImg('" + list[i].login_name + "','" + list[i].person_name + "','PRIVATE','" + list[i].head_img + "');\" ><img class=\"txl-list-person-img\" src=\"" + list[i].head_img.substring(0,list[i].head_img.indexOf('@'))+ commonReturnPhotoCutSize(1,50,50) + "\"><div style=\"position:absolute;width:80%;left:60px;top:17px;\" class=\"ellipsis\">" + list[i].person_name + "</div></li>");
    			$api.css($api.byId('indexed-' + key), 'display:block;');
    		} else {
    			$api.removeCls($api.byId('group-#'), 'display-none');
    			$api.after($api.byId('group-#'), "<li class=\"aui-list-view-cell\"><img class=\"txl-list-person-img\" src=\"" + list[i].head_img.substring(0,list[i].head_img.indexOf('@'))+ commonReturnPhotoCutSize(1,50,50) + "\"><div style=\"position:absolute;width:80%;left:60px;top:17px;\" class=\"ellipsis\">" + list[i].person_name + "</div></li>");
    			$api.css($api.byId('indexed-#'), 'display:block;');
    		}
    
    	}
    }else{
        commonAddOrRemoveHideCss('j_no_data',1);
    }
	var indexedList = new auiIndexedList();
	
}

var html1 = '<li class="aui-list-view-cell aui-indexed-list-view-group display-none" id="group-A" data-group="A" >A</li><li class="aui-list-view-cell aui-indexed-list-view-group display-none" id="group-B" data-group="B" >B</li><li class="aui-list-view-cell aui-indexed-list-view-group display-none" id="group-C" data-group="C" >C</li><li class="aui-list-view-cell aui-indexed-list-view-group display-none" id="group-D" data-group="D" >D</li><li class="aui-list-view-cell aui-indexed-list-view-group display-none" id="group-E" data-group="E" >E</li><li class="aui-list-view-cell aui-indexed-list-view-group display-none" id="group-F" data-group="F" >F</li><li class="aui-list-view-cell aui-indexed-list-view-group display-none" id="group-G" data-group="G" >G</li><li class="aui-list-view-cell aui-indexed-list-view-group display-none" id="group-H" data-group="H" >H</li><li class="aui-list-view-cell aui-indexed-list-view-group display-none" id="group-I" data-group="I" >I</li><li class="aui-list-view-cell aui-indexed-list-view-group display-none" id="group-J" data-group="J" >J</li><li class="aui-list-view-cell aui-indexed-list-view-group display-none" id="group-K" data-group="K" >K</li><li class="aui-list-view-cell aui-indexed-list-view-group display-none" id="group-L" data-group="L" >L</li><li class="aui-list-view-cell aui-indexed-list-view-group display-none" id="group-M" data-group="M" >M</li><li class="aui-list-view-cell aui-indexed-list-view-group display-none" id="group-N" data-group="N" >N</li><li class="aui-list-view-cell aui-indexed-list-view-group display-none" id="group-O" data-group="O" >O</li><li class="aui-list-view-cell aui-indexed-list-view-group display-none" id="group-P" data-group="P" >P</li><li class="aui-list-view-cell aui-indexed-list-view-group display-none" id="group-Q" data-group="Q" >Q</li><li class="aui-list-view-cell aui-indexed-list-view-group display-none" id="group-R" data-group="R" >R</li><li class="aui-list-view-cell aui-indexed-list-view-group display-none" id="group-S" data-group="S" >S</li><li class="aui-list-view-cell aui-indexed-list-view-group display-none" id="group-T" data-group="T" >T</li><li class="aui-list-view-cell aui-indexed-list-view-group display-none" id="group-U" data-group="U" >U</li><li class="aui-list-view-cell aui-indexed-list-view-group display-none" id="group-V" data-group="V" >V</li><li class="aui-list-view-cell aui-indexed-list-view-group display-none" id="group-W" data-group="W" >W</li><li class="aui-list-view-cell aui-indexed-list-view-group display-none" id="group-X" data-group="X" >X</li><li class="aui-list-view-cell aui-indexed-list-view-group display-none" id="group-Y" data-group="Y" >Y</li><li class="aui-list-view-cell aui-indexed-list-view-group display-none" id="group-Z" data-group="Z" >Z</li><li class="aui-list-view-cell aui-indexed-list-view-group display-none" id="group-#" data-group="#" >#</li>';

var html2 = '<a><i class="aui-iconfont aui-icon-search" data-value="search"></i></a><a><i class="aui-iconfont aui-icon-favorfill" data-value="*"></i></a><a id="indexed-A" style="display: none;" data-value="A">A</a><a id="indexed-B" style="display: none;" data-value="B">B</a><a id="indexed-C" style="display: none;" data-value="C">C</a><a id="indexed-D" style="display: none;" data-value="D">D</a><a id="indexed-E" style="display: none;" data-value="E">E</a><a id="indexed-F" style="display: none;" data-value="F">F</a><a id="indexed-G" style="display: none;" data-value="G">G</a><a id="indexed-H" style="display: none;" data-value="H">H</a><a id="indexed-I" style="display: none;" data-value="I">I</a><a id="indexed-J" style="display: none;" data-value="J">J</a><a id="indexed-K" style="display: none;" data-value="K">K</a><a id="indexed-L" style="display: none;" data-value="L">L</a><a id="indexed-M" style="display: none;" data-value="M">M</a><a id="indexed-N" style="display: none;" data-value="N">N</a><a id="indexed-O" style="display: none;" data-value="O">O</a><a id="indexed-P" style="display: none;" data-value="P">P</a><a id="indexed-Q" style="display: none;" data-value="Q">Q</a><a id="indexed-R" style="display: none;" data-value="R">R</a><a id="indexed-S" style="display: none;" data-value="S">S</a><a id="indexed-T" style="display: none;" data-value="T">T</a><a id="indexed-U" style="display: none;" data-value="U">U</a><a id="indexed-V" style="display: none;" data-value="V">V</a><a id="indexed-W" style="display: none;" data-value="W">W</a><a id="indexed-X" style="display: none;" data-value="X">X</a><a id="indexed-Y" style="display: none;" data-value="Y">Y</a><a id="indexed-Z" style="display: none;" data-value="Z">Z</a><a id="indexed-#" style="display: none;" data-value="#">#</a>';
