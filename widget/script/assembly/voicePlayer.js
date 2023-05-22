
/* voicePlayer 封装speechRecognizer模块方法  2017.09.14 赵静 
*/ 
var speechRecognizer;
var voicePlayer = {
    //开始读文字
    startRead : function(params, callback) {
        var speak_type = 'Chinese '+ params.voice; 
        voice_type = 1;
        responsiveVoice.speak(params.readStr, speak_type, {rate: params.speed});
    },
    //停止朗读
    stopRead : function() {
        responsiveVoice.cancel();
    },
    //暂停朗读
    pauseRead : function() {
        responsiveVoice.pause();
    },
    //恢复朗读
    resumeRead : function() {
        responsiveVoice.resume();
    },
    //打开或关闭语音播放页面
    listernArticle : function(type,oparam){
        var url;
//      if(api.uiMode == 'pad'){
//         url = 'widget://html/common/ipad/common_voiceplay_frame.html'
//      }else{
          url = 'widget://html/common/iphone/common_voiceplay_frame.html'
//      }
        //voice_type1显示播放页面 2打开播放页面
        if (voice_type == 1) {
            api.setFrameAttr({
                name : 'common_voiceplay_frame',
                hidden : false
            });
            if(!isEmptyString(oparam)&&!isEmptyString(oparam.frameName)){
                api.bringFrameToFront({
                    from: 'common_voiceplay_frame'
                });
                commonExecScript(api.winName,'common_voiceplay_frame','changeVoiceContent("'+voice_content+'");',1);//隐藏虚线
            }
            
        } else if (voice_type == 2) {
            api.openFrame({
                name : 'common_voiceplay_frame',
                url : url,
                bounces : false,
                rect : {
                    x : 0,
                    y : 0,
                    w : 'auto',
                    h : 'auto'
                },
                bgColor : 'rgba(0,0,0,0)',
                pageParam : {
                    voice_content : voice_content,
                    nameWin : api.winName,
                    oparam:oparam
                },
                reload : true
            });
        }
    },
    //添加朗读内容
    addVoiceContent:function(content){
        voice_content = content;
        $api.css($api.byId('play'), 'display:block;');
    },
    //改变voice_type全局变量
    changeVoiceType:function(index){
        voice_type = index;
    }
}

/*
 *author:ws
 *function:对文章朗读内容进行分割
 *date：20161124
*/
function listernArticle(c,callback) {
    //内容长度
    var c_l = c.length;
    //分割模块长度
    var c_s = 500;
    //起始值
    var c_n = 0;
    //分割成数组
    var c_a = [];
    if (c_l % c_s != 0) {
        c_n = (c_l / c_s) + 1;
    } else {
        c_n = c_l / c_s;
    }
    //分割内容到数组中
    for (var i = 0; i < c_n; i++) {
        c_a[i] = c.substring((i * c_s), ((i + 1) * c_s));
    }
    callback(c_a);
}

/*
 *author:ws
 *function:递归语音播放文章
 *date：20161124
*/
function readWzContent(wz_c, wz_attrs,callback) {
    var wz_l = wz_attrs.length;
    if ((wz_c < wz_l) && (wz_attrs[wz_c] != '')) {
        voicePlayer.stopRead();
        startRead(wz_attrs[wz_c],function(){
            wz_c++;
            return readWzContent(wz_c,wz_attrs,callback);
        }); 
    } else {
        //朗读完毕
        callback(true);
    }
}


