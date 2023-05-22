var header_t;
//顶部header高度
var header_h;
//发送id
var target_id;

var conver_type;
var h_from;
var person_name;
//群组标题头+人数
var group_title_num;
//所有人id
var owner_id;
//头像
var avatar_url;
//0群主1管理员2普通成员
var memberTypeForApp;
//成员id
var memberIdForApp;
var BASE_URL_ACTION;
apiready = function() {
    commonSetTheme({"level":2,"type":0});
    //定位header位置，留出上面电池等空隙，苹果需要
    var header = $api.byId('aui-header');
    $api.fixStatusBar(header);
    header_t = $api.offset($api.byId('cloud'));
    header_h = api.pageParam.header_h;
    //当前会话用户id和当前会话历史消息从消息列表页点击传递进来
    target_id = api.pageParam.targetId;

    //真实姓名
    person_name = api.pageParam.person_name;

    conver_type = api.pageParam.conver_type;
    avatar_url = api.pageParam.avatar_url;

    //从哪个页面进入的聊天界面
    h_from = api.pageParam.h_from;

    //当前target_id的最大会话id
    var old_msg_id = api.pageParam.old_msg_id;
    //当前app所有人
    owner_id = $api.getStorage('login_name_rong');
    //打开聊天内容frame页面
    api.openFrame({
        name : 'hh_chat_frame',
        scrollToTop : true,
        allowEdit : true,
        url : '../../html/huihua/hh_chat_frame.html',
        pageParam : {
            'target_id' : target_id,
            'old_msg_id' : old_msg_id,
            'conver_type' : conver_type,
            'avatar_url' : avatar_url,
            'header_h' : header_h,
            'h_from' : h_from,
            'person_name' : person_name
        },
        rect : {
            x : 0,
            y : header_h,
            w : 'auto',
            h : api.winHeight - header_h - 50,
        },
        //页面是否弹动 为了下拉刷新使用
        bounces : true
    });
    initHeaerPrivate();
    //安卓关闭
    if (api.systemType == 'android') {
        backFromChatForAndroid();
    }
    BASE_URL_ACTION = $api.getStorage('BASE_URL_ACTION');
    if (conver_type == "GROUP") {
        if (target_id.indexOf("school") == 0 || target_id.indexOf("class") == 0 || target_id.indexOf("plass") == 0) {
        } else {
            //获取人员类型
            setQuitGroupTitle(target_id);
        }
    }
};

/**
 * 安卓点击返回的时候
 * 周枫
 * 2015.08.31
 */
function backFromChatForAndroid() {
    api.addEventListener({
        name : "keyback"
    }, function(ret, err) {
        back();
    });
}

/**
 *返回会话列表页面
 * 周枫
 * 2015.08.08
 */
function back() {
    //  清楚红点
    api.execScript({
        name : 'root',
        frameName : 'hh_index',
        script : 'cleanMsg("' + target_id + '","' + conver_type + '");'
    });
    //是否是首页还是会话页面获取消息的flag
    api.execScript({
        name : 'root',
        frameName : 'hh_index',
        script : 'reFlag();'
    });
    switch(h_from) {
        case 'hh_index' :
            api.execScript({
                name : 'root',
                frameName : 'txl_index',
                script : 'hideMyself();'
            });
            api.closeToWin({
                name : 'root',
                animation : {
                    type : 'reveal',
                    subType : 'from_left',
                    duration : 300
                }
            });
            break;
        case 'txl_index' :
            api.closeToWin({
                name : 'root',
                animation : {
                    type : 'reveal',
                    subType : 'from_left',
                    duration : 300
                }
            });
            break;
        case 'zjgb':
            api.closeWin();
            break;
        default :
            api.closeToWin({
                name : 'root',
                animation : {
                    type : 'reveal',
                    subType : 'from_left',
                    duration : 300
                }
            });
            break;
    }
}

function reloadTxlIndex() {
    //  api.alert({
    //      msg : '11111'
    //  }, function(ret, err) {
    //      //coding...
    //  });
    api.execScript({
        name : 'root',
        frameName : 'txl_index',
        script : 'loadData();'
    });
}

/**
 *发送消息
 * 周枫
 * 2015.08.08
 * @param {Object} sendMsg
 */
//function chat(sendMsg) {
//  //向会话列表页发送消息事件
//  api.sendEvent({
//      name : 'sendMessage',
//      extra : {
//          type : 'text',
//          targetId : '' + target_id + '',
//          content : sendMsg,
//          conversationType : 'PRIVATE',
//          extra : ''
//      }
//  })
//}

function setBottom() {
    api.execScript({
        name : '',
        frameName : 'hh_chat_frame',
        script : 'goBottom()'
    });
}

/**
 * 根据群组id获取群组页面
 * 周枫
 * 2015.09.11
 */
function showGroupListById() {
    api.openWin({
        name : 'hh_group_window',
        url : 'hh_group_window.html',
        bounces : false,
        delay : 0,
        scrollToTop : true,
        allowEdit : true,
        slidBackEnabled : false,
        animation : {
            type : "reveal", //动画类型（详见动画类型常量）
            subType : "from_right", //动画子类型（详见动画子类型常量）
            duration : 300
        },
        pageParam : {
            'target_id' : target_id,
            'header_h' : header_h,
            'group_name' : person_name,
            'h_from' : h_from,
            'header_h' : header_h,
            'memberTypeForApp' : memberTypeForApp,
            'memberIdForApp' : memberIdForApp
        }
    });
}

/**
 * 查看人员详情页面
 * 周枫
 * 2016.11.22
 */
function showPersonInfoById() {
    api.execScript({
        frameName : 'hh_chat_frame',
        script : 'openHhByImg("' + target_id + '", "' + person_name + '", "PRIVATE", "' + avatar_url + '");'
    });
}

function initHeaer() {
    var p_list = $api.getStorage('group_list_data');
    if ( typeof (p_list) != 'undefined') {
        var p_list_l = getJsonObjLength(p_list.list);
        //如果是群组会话，则显示右上角群组成员
        if (conver_type == 'GROUP') {
            $api.css($api.byId('menu'), 'display:inline;');
            if (p_list_l == 0) {
                person_name = person_name;
//              if(api.uiMode == 'phone'){
                    if(person_name.length>5){
                        person_name = person_name.substring(0,5)+'...';
                    }
//              }
                group_title_num = person_name;
            } else {
                person_name = person_name;
//              if(api.uiMode == 'phone'){
                    if(person_name.length>5){
                        person_name = person_name.substring(0,5)+'...';
                    }
//              }
                group_title_num = person_name + "(" + p_list_l + ")";
            }
            $api.html($api.byId('mTitle'), group_title_num);
        } else if (conver_type == 'PRIVATE') {
            $api.css($api.byId('person_info'), 'display:inline;');
            $api.html($api.byId('mTitle'), person_name);
        } else {
            $api.html($api.byId('mTitle'), person_name);
        }

    } else {
        //如果是群组会话，则显示右上角群组成员
        if (conver_type == 'GROUP') {
            $api.css($api.byId('menu'), 'display:inline;');
        } else if (conver_type == 'PRIVATE') {
            $api.css($api.byId('person_info'), 'display:inline;');
        }
        $api.html($api.byId('mTitle'), person_name);
    }
}

function initHeaerPrivate() {
    if (conver_type != 'GROUP') {
        if(conver_type != 'SYSTEM') {
            $api.css($api.byId('person_info'), 'display:inline;');
        }
        $api.html($api.byId('mTitle'), person_name);
    }
}

/*
 *author:ws
 *function:获取人员类型
 *date：20170210
 */
function setQuitGroupTitle(groupId) {
    var idGroup = groupId.split("_");
    api.ajax({
        url : BASE_URL_ACTION + '/group/getMemberTypeForApp',
        method : 'get',
        dataType : 'json',
        timeout : 30,
        data : {
            values : {
                "groupId" : idGroup[0],
                "personId" : $api.getStorage("person_id"),
                "identityId" : $api.getStorage("identity")
            }
        }
    }, function(ret, err) {
        if (ret) {
            if (ret.success) {
                //0群主1管理员2普通成员
                memberTypeForApp = ret.result[0].memberTypeForApp;
                //成员id
                memberIdForApp = ret.result[0].memberIdForApp;
                if (memberTypeForApp == 0) {
                    $api.html($api.byId('groupTitle'), "解散群组");
                } else {
                    $api.html($api.byId('groupTitle'), "退出群组");
                }
            } else {
                popBottomToast("获取人员类型失败");
            }
        } else {
            popBottomToast("获取人员类型失败");
        }
    });
}
