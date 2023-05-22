//打开外部资源文件通用组件 
//周枫
//2017.01.04
var BASE_APP_TYPE;
var line_flag = false;//网络判断
var bookReader;//txt插件
var param={};//传递过来的参数
var common_openResource = {
    //设置剪切板内容
    open : function(res_type, res_path, res_title,m3u8_status,winName,setBackFun,backFun,res_id) {
        //判断网络
        isOnLineStatus(function(is_true, line_type){
            if (is_true) {
                    if (line_type == 'wifi') {
                        common_openResource.openFile(res_type, res_path, res_title,m3u8_status,winName,setBackFun,backFun,res_id);
                    } else {
                        var fun_name = "common_openResource.openFile('"+res_type+"','"+res_path+"','"+res_title+"','"+m3u8_status+"','"+winName+"','"+setBackFun+"','"+backFun+"','"+res_id+"')";
                        popTwoBtnConfirm("提示","您当前正在使用" + line_type + "网络，建议您在wifi网络下播放，是否继续？",fun_name);
                    }
                } else {
                    popToast('请连接网络后使用当前功能');
                }   
        });
    },
    open_new:function(param_json){
       //判断网络
        isOnLineStatus(function(is_true, line_type){
            if (is_true) {
                param = JSON.parse(param_json);
                if (line_type == 'wifi') {
                    common_openResource.openFile(param.res_type, param.res_path, param.res_title,param.m3u8_status,param.winName,param.setBackFun,param.backFun,param.res_id);
                } else {
                    var fun_name = "common_openResource.openFile('"+param.res_type+"','"+param.res_path+"','"+param.res_title+"','"+param.m3u8_status+"','"+param.winName+"','"+param.setBackFun+"','"+param.backFun+"','"+param.res_id+"')";
                    popTwoBtnConfirm("提示","您当前正在使用" + line_type + "网络，建议您在wifi网络下播放，是否继续？",fun_name);
                }
            } else {
                popToast('请连接网络后使用当前功能');
            }   
        });
    },
    openFile:function(res_type, res_path, res_title,m3u8_status,winName,setBackFun,backFun,res_id){
        BASE_APP_TYPE = $api.getStorage('BASE_APP_TYPE');
        res_type = res_type.toLowerCase();
        switch(res_type){
            //文本类型
            case "doc":
                common_openDocument.getUrl(res_type,res_path,res_title,winName);
                break;
            case "docx":
                common_openDocument.getUrl(res_type,res_path,res_title,winName);
                break;
            case "ppt":
                common_openDocument.getUrl(res_type,res_path,res_title,winName);
                break;
            case "pptx":
                common_openDocument.getUrl(res_type,res_path,res_title,winName);
                break;
            case "txt":
                common_openDocument.getUrl(res_type,res_path,res_title,winName);
                break;
            case "xls":
                common_openDocument.getUrl(res_type,res_path,res_title,winName);
                break;
            case "xlsx":
                common_openDocument.getUrl(res_type,res_path,res_title,winName);
                break;
            case "pdf":
                common_openDocument.getUrl(res_type,res_path,res_title,winName);
                break;
            //图片类型
            case "jpg":
                common_openPicture.getUrl(res_type,res_path,res_title,winName);
                break;
            case "jpeg":
                common_openPicture.getUrl(res_type,res_path,res_title,winName);
                break;
            case "png":
                common_openPicture.getUrl(res_type,res_path,res_title,winName);
                break;
            case "gif":
                popAlert('对不起，您的设备不支持当前文件类型，请登录云平台查看。');
                break;
            case "bmp":
                popAlert('对不起，您的设备不支持当前文件类型，请登录云平台查看。');
                break;
            //视频类型
            case "asf":
                common_openVideo.getUrl(res_type,res_path,res_title,m3u8_status);
                break;
            case "wmv":
                common_openVideo.getUrl(res_type,res_path,res_title,m3u8_status);
                break;
            case "mpg":
                common_openVideo.getUrl(res_type,res_path,res_title,m3u8_status);
                break;
            case "avi":
                common_openVideo.getUrl(res_type,res_path,res_title,m3u8_status);
                break;
            case "mp4":
                common_openVideo.getUrl(res_type,res_path,res_title,m3u8_status);
                break;
            case "mpeg":
                common_openVideo.getUrl(res_type,res_path,res_title,m3u8_status);
                break;
            case "m3u8":
                common_openVideo.getUrl(res_type,res_path,res_title,m3u8_status);
                break;
            case "rmvb":
                common_openVideo.getUrl(res_type,res_path,res_title,m3u8_status);
                break;
            case "flv":
                common_openVideo.getUrl(res_type,res_path,res_title,m3u8_status);
                break;
            case "mov":
                common_openVideo.getUrl(res_type,res_path,res_title,m3u8_status);
                break;
            //音频类型
            case "mp3":
                common_openAudio.getUrl(res_type,res_path,res_title,winName,setBackFun,backFun);
                break;
            case "wav":
                common_openAudio.getUrl(res_type,res_path,res_title,winName,setBackFun,backFun);
                break;
            case "amr":
                common_openAudio.getUrl(res_type,res_path,res_title,winName,setBackFun,backFun);
                break;
            case "wma":
                popAlert('对不起，您的设备不支持当前文件类型，请登录云平台查看。');
                break;
            case "rmvb":
                popAlert('对不起，您的设备不支持当前文件类型，请登录云平台查看。');
                break;
            case "sb2":
                popAlert('对不起，您的设备不支持当前文件类型。');
                break;
            //学案类型
            case "dsek":
                common_openDesk.open(res_id);
            break;
            case "swf":
                common_openSwf.open(res_id);
            break;
            case "penlog":
            	openPenLog(res_path,res_type);
            	break;
            default:
                popAlert('对不起，您的设备不支持当前文件类型，请登录云平台查看。');
            break;
        }
    },
    download : function(res_type, res_id, callback) { 
        
    }
};
/*
*author:zhaoj
*function:预览文档文件
*date：20170109
*/
var common_openDocument = {
    //获取文档的路径
    getUrl : function(format,file_id,file_name,winName){
        var doc_url;
        if (BASE_APP_TYPE == 1) {
            doc_url = url_path + BASE_MATERIAL_BEGIN + file_id.substring(0, 2) + '/' + file_id + '.' + format;
        } else {
            doc_url = BASE_URL_ACTION + BASE_MATERIAL_BEGIN + file_id.substring(0, 2) + '/' + file_id + '.' + format;
        }
        var save_url = BASE_DOWNLOAD_YY_PATH + file_name + '.' + format;
        common_openDocument.down(doc_url, save_url,format,winName);//下载文档并且打开文档
    },
    //预览文档类型
    down:function(fj_url, save_url,format,winName){
        showSelfProgress('加载中...');
        api.download({
            url : fj_url,
            savePath : save_url,
            //下载过程是否上报
            report : true,
            //是否使用本地缓存
            cache : true,
            //是否允许断点续传
            allowResume : true
        }, function(ret, err) {
            if (ret.state == 1) {
                api.hideProgress();
                common_openDocument.open(save_url,format,winName);
            }
            if (ret.state == 2) {
                popAlert('打开失败，请稍候重试');
                api.hideProgress();
            }
        });
    },
    //根据文档类型用不同的插件来打开文档
    open:function(file_url,format,winName){
//      if(format == 'txt'){
//          bookReader = api.require('bookReader');//txt阅读器
//          bookReader.open({
//              x : 0,
//              y : header_h,
//              w : api.winWidth,
//              h : api.winHeight - header_h,
//              filePath : file_url
//          },function(ret, err){
//              if(ret){
//                  api.execScript({
//                      name: winName,
//                      script: 'reBackType("txt")'
//                  });
//              }
//          });
//      }else{
            var docReader = api.require('docReader');//doc阅读器
            docReader.open({
                path : file_url
            }, function(ret, err) {
                if (ret.status == false) {
                    if (api.systemType == 'android') {
                        popAlert('对不起，本软件暂时不支持查看文档类文件，请先安装一款全面的办公软件（例：WPS），在查看此文件。');
                    }
                }
            });
//      }
    },
    closeTxt:function(){
        bookReader.close();
    }
}
/*
*author:zhaoj
*function:打开图片
*date：20170109
*/
var common_openPicture = {
    //获取图片路径
    getUrl:function(format,file_id,file_name,winName){
        var img_url;
        if (BASE_APP_TYPE == 1) {
            img_url = BASE_IMAGE_PRE + url_path_suffix + file_id.substring(0, 2) + '\/' + file_id + '.' + format;
        } else {
            img_url = BASE_URL_ACTION + BASE_IMAGE_BEGIN + file_id.substring(0, 2) + '/' + file_id + '.' + format;
        }
        if(api.systemType == 'ios'){
            var privacy = api.require('privacy');
            privacy.photos(function( ret, err ){     
                if( ret.status ){
                    common_openPicture.open(img_url,winName);
                }else{
                    api.alert({
                        title: '提示',
                        msg: '请在iPhone的“设置-隐私-照片”选项中，允许'+appName+'访问你的手机相册',
                        buttons: ['确定']
                    },function( ret, err ){
                    });
                }
            });
        }else{
            common_openPicture.open(img_url,winName);
        }
    },
    //打开图片
    open:function(img_url,winName){
        photoBrowser.open([img_url],0);
    }
}
/*
*author:zhaoj
*function:打开视频
*date：20170109
*/
var common_openVideo = {
    //获取视频路径
    getUrl:function(format,file_id,file_name,m3u8_status){
        var video_url;
        var is_m3u8=false;
        if (m3u8_status == '2') {
            //已经生成m3u8格式的视频
            if (BASE_APP_TYPE == 1) {
                video_url = yun_video_url + file_id.substring(0, 2) + "/" + file_id + '.m3u8';
            } else {
                video_url = bendi_video_url + file_id.substring(0, 2) + "/" + file_id + '.m3u8';
            }
            is_m3u8 = true;
        } else if (m3u8_status == '1') {
            popAlert('对不起，正在生成预览中，请稍候查看。');
            return;
        } else if (m3u8_status == '3') {
            popAlert('对不起，该文件生成预览失败。');
            return;
        } else {
            //判断是iphone手机并且最终视频播放格式是flv进行不能播放的提示
            if (api.systemType == 'ios' && (format != 'mp4')) {
                popAlert('对不起，您的设备不支持当前文件类型，请登录云平台查看。');
                return;
            } else {
                if (BASE_APP_TYPE == 1) {
                    if (format == 'flv') {
                        video_url = madie_url + '/down/Preview/' + file_id.substring(0, 2) + "/" + file_id + '.flv';
                    } else {
                        video_url = madie_url + '/down/Material/' + file_id.substring(0, 2) + "/" + file_id + '.' + format;
                    }
                } else {
                    if (format == 'flv') {
                        video_url = BASE_URL_ACTION + "/html/down/Preview/" + file_id.substring(0, 2) + "/" + file_id + '.flv';
                    } else {
                        video_url = BASE_URL_ACTION + "/html/down/Material/" + file_id.substring(0, 2) + "/" + file_id + '.' + format;
                    }
                }
            }
        }
        common_openVideo.open(video_url,file_name,is_m3u8);
    },
    //打开视频
    open:function(video_url,file_name,is_m3u8){
        if(is_m3u8 && api.systemType == 'android' && parseFloat(api.systemVersion) < 4.1){
            api.openVideo({
                url : video_url
            });                                                                                                                                                                                                                                                                                                                                                                                     
        }else{
            var videoPlayer = api.require('videoPlayer');
            var videoSize = {
                "head_height":30,
                "head_titleSize":20,
                "head_backSize":25,
                "head_setSize":25,
                "foot_height":35,
                "foot_playSize":25,
                "foot_timeSize":14
            };
            if(api.uiMode == 'pad'){
                videoSize = {
                    "head_height":44,
                    "head_titleSize":30,
                    "head_backSize":44,
                    "head_setSize":44,
                    "foot_height":44,
                    "foot_playSize":44,
                    "foot_timeSize":14
                };
            }
            videoPlayer.play({
                texts : {
                    head : {//（可选项）JSON 类型；设置顶部文字
                        title : file_name //（可选项）字符串类型；顶部标题文字；默认：''
                    }
                },
                styles : {
                    head : {//（可选项）JSON对象；播放器顶部导航条样式
                        bg : 'rgba(0.5,0.5,0.5,0.7)', //（可选项）字符串类型；顶部导航条背景，支持#、rgb、rgba、img；默认：rgba(0.5,0.5,0.5,0.7)
                        height : videoSize.head_height, //（可选项）数字类型；顶部导航条的高；默认：44
                        titleSize : videoSize.head_titleSize, //（可选项）数字类型；顶部标题字体大小；默认：20
                        titleColor : '#fff', //（可选项）字符串类型；顶部标题字体颜色；默认：#fff
                        backSize : videoSize.head_backSize, //（可选项）数字类型；顶部返回按钮大小；默认：44
                        backImg : 'fs://img/back.png', //（可选项）字符串类型；顶部返回按钮的背景图片，要求本地路径（widget://、fs://）；默认：返回小箭头图标
                        setSize : videoSize.head_setSize, //（可选项）数字类型；顶部右边设置按钮大小；默认：44
                        setImg : 'fs://img/set.png' //（可选项）字符串类型；顶部右边设置按钮背景图片，要求本地路径（widget://、fs://）；默认：设置小图标
                    },
                    foot : {//（可选项）JSON对象；播放器底部导航条样式
                        bg : 'rgba(0.5,0.5,0.5,0.7)', //（可选项）字符串类型；底部导航条背景，支持#、rgb、rgba、img；默认：rgba(0.5,0.5,0.5,0.7)
                        height : videoSize.foot_height, //（可选项）数字类型；底部导航条的高；默认：44
                        playSize : videoSize.foot_playSize, //（可选项）数字类型；底部播放/暂停按钮大小；默认：44
                        playImg : 'fs://img/back.png', //（可选项）字符串类型；底部播放按钮的背景图片，要求本地路径（widget://、fs://）；默认：播放按钮图标
                        pauseImg : 'fs://img/back.png', //（可选项）字符串类型；底部暂停按钮的背景图片，要求本地路径（widget://、fs://）；默认：暂停按钮图标
                        nextSize : 0, //（可选项）数字类型；底部下一集按钮大小；默认：44
                        //nextImg : 'widget://res/next.png', //（可选项）字符串类型；底部下一集按钮的背景图片，要求本地路径（widget://、fs://）；默认：下一集按钮图标
                        timeSize : videoSize.foot_timeSize, //（可选项）数字类型；底部时间标签大小；默认：14
                        timeColor : '#fff', //（可选项）字符串类型；底部时间标签颜色，支持#、rgba、rgb；默认：#fff
                        sliderImg : 'fs://img/slder.png', //（可选项）字符串类型；底部进度条滑块背景图片，要求本地路径（widget://、fs://）；默认：滑块小图标
                        progressColor : '#696969', //（可选项）字符串类型；进度条背景色，支持#、rgba、rgb；默认：#696969
                        progressSelected : '#76EE00' //（可选项）字符串类型；滑动后的进度条背景色，支持#、rgb、rgba；默认：#76EE00
                    }
                },
                //coverImg : 'widget://res/loading.png',
                path : video_url, //（可选项）字符串类型；文档的路径，支持网络和本地（fs://）路径；默认：未传值时不播放
                //在 android 平台上不支持 widget://
                autoPlay : true, //（可选项）布尔类型；打开时是否自动播放；默认：true（自动播放）
                autorotation : false //（可选项）视频播放页面是否支持自动旋转（横竖屏），若为 false 则手动点击右下角按钮旋转
            }, function(ret, err) {
            });
        }
    }
}
/*
*author:zhaoj
*function:打开音频
*date：20170109
*/
var common_openAudio = {
    //获取视频路径
    getUrl:function(format,file_id,file_name,winName,setBackFun,backFun){
        if (api.systemType == 'ios' && format == 'wma') {
            popAlert('对不起，您的设备不支持当前文件类型，请登录云平台查看。');
        } else {
            var voice_url;
            if (BASE_APP_TYPE == 1) {
                voice_url = url_path + BASE_MATERIAL_BEGIN + file_id.substring(0, 2) + '/' + file_id + '.' + format;
            } else {
                voice_url = BASE_URL_ACTION + BASE_MATERIAL_BEGIN + file_id.substring(0, 2) + '/' + file_id + '.' + format;
            }
        }
        common_openAudio.open(voice_url,winName,setBackFun,backFun);
    },
    //打开视频
    open:function(voice_url,winName,setBackFun,backFun){
        var pageParamJson= {"voice_url":voice_url,"winName":winName,"setBackFun":setBackFun,"backFun":backFun};//打开frame页面json数据
        commonOpenFrame("common_playaudio_frame","widget://html/common/common_playaudio_frame.html",0,false,false,"rgba(0,0,0,0.0)",pageParamJson);//打开音频播放页面
    }
}
/*
*author:zhaoj
*function:打开音学案
*date：20170109
*/
var common_openDesk = {
    //打开视频
    open:function(res_id){
        var app_key = "";
        var down_url = "";
        var app_type = api.systemType;
        if(app_type == "ios") {
            app_key = BASE_ZY_APP_IOS;
            down_url = BASE_ZY_APP_DOWN_IOS;
        } else {
            app_key = BASE_ZY_APP_ANDROID;
            down_url= BASE_ZY_APP_DOWN_ANDROID;
        }
        var oparamJsonData = {"type":3,"app_key":app_key,"down_url":down_url,"id":'',"resource_id":res_id};
        //判断是否已经安装app
        common_app.appInstalled(oparamJsonData);
    }
}
/*
*author:zhaoj
*function:打开动画
*date：20170109
*/
var common_openSwf = {
    //打开视频
    open:function(res_id){
        var app_key = "";
        var down_url = "";
        var app_type = api.systemType;
        if(app_type == "ios") {
            app_key = BASE_ZY_APP_IOS;
            down_url = BASE_ZY_APP_DOWN_IOS;
        } else {
            app_key = BASE_ZY_APP_ANDROID;
            down_url= BASE_ZY_APP_DOWN_ANDROID;
        }
        var oparamJsonData = {"type":8,"app_key":app_key,"down_url":down_url,"id":'',"resource_id":res_id};
        //判断是否已经安装app
        common_app.appInstalled(oparamJsonData);
    }
}


/**
 * 打开笔迹
 * @param {Object} file_id
 * @param {Object} resource_format
 */
function openPenLog(file_id,resource_format){
	if (api.systemType == "ios"){
		popAlert('对不起，您的设备不支持当前文件类型。');
		return;
	}
	var tempHandWriteBoard;
	if (typeof (handWriteBoard) != "undefined"){
		tempHandWriteBoard = handWriteBoard;
	}else{
		tempHandWriteBoard = api.require('handWriteBoard');
	}
	var path = "/storage/emulated/0/edusoa/penLog/" + file_id + ".penlog";
	api.readFile({
        path:path
    },function(ret,err){
    	if (!ret.status){
    		var url;
			if (BASE_APP_TYPE == 1) {
	            url = url_path + BASE_MATERIAL_BEGIN + file_id.substring(0, 2) + '/' + file_id + '.' + resource_format;
	        } else {
	            url = BASE_URL_ACTION + BASE_MATERIAL_BEGIN + file_id.substring(0, 2) + '/' + file_id + '.' + resource_format;
	        }
	        api.download({
	            url:url,
	            savePath: path,
            },function(ret,err){
            	if (ret && ret.state == 1){
            		var param = {filePath:path};
					tempHandWriteBoard.openReadLog(param);
            	}else{
            		popToast('加载失败，请重试！');
            	}
            });
    	}else{
    		var param = {filePath:path};
			tempHandWriteBoard.openReadLog(param);
    	}
    });
}
/*
 * 功能：文档预览资源功能,引用原生提供的模块
 * 作者：zfz
 * 时间：20210127
 * param_json={
        res_type:ret.resource_format, // 资源后缀
        res_path:ret.file_id, //  资源id
        res_title:ret.resource_title,//资源标题
        m3u8_status:ret.m3u8_status  
        "setBackFun":'reBackType("voice");', //固定值 音频播放需要，固定值
        "backFun":'back();',   //固定值  音频播放需要，固定值
        "res_id":'',  //固定值 默认为空
        "pic_back":'' //打开图片需要 
    }
 */
function openResourceForH5(param_json){
    var oparam ={
        "res_type":param_json.res_type, 
        "res_path":param_json.res_path,         
        "res_title":param_json.res_title,
        "m3u8_status":param_json.m3u8_status,
        "winName":api.winName,
        "setBackFun":'reBackType("voice");', //音频播放需
        "backFun":'back();',
        "res_id":'',  
        "pic_back":'',  
    };
    common_openResource.open_new(JSON.stringify(oparam));
    
}