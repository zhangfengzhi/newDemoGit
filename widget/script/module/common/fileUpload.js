var resourceAry = [];
var backType = "win";
var frameName="";
/*
 * 功能：上传图片
 * 作者：张自强
 * 时间：201710232
 */
function openUpload(type){
    api.actionSheet({
        cancelTitle : '取消',
        buttons : type==1?buttons = ['从手机相册选择','拍照']:buttons = ['从手机相册选择','拍照',"拍摄视频"],
        style : {
            titleFontColor : '#ff0000'
        }
    }, function(ret, err) {
        if (ret) {
            if (ret.buttonIndex == 1) {
                getAlbum();//从相册中上传
            } else if (ret.buttonIndex == 2) {
                openPicture();//从相机中上传
            }else if (ret.buttonIndex == 3) {
            if(type==1){
                return;
            }
            	commonModuleDemo({"time":10},function(path){
            		commonUiUploadFiles({"data":[{'path':path,"thumbPath":path,"size":0}],"is_trans":0}, function(ret_data) {
			            resourceAry = ret_data;
			            insertResourceBaseInfoOneByOne();
			        });
            	});
            }
        } else {
            //               alert( JSON.stringify( err ) );
        }
    });
}
/*
 * 功能：图片视频功能,引用原生提供的模块
 * 作者：zfz
 * 时间：20200320
 * param_json={
        picOrVideo:1, //  1 拍照、选择图片，2录视频、选择视频    默认为1
        count:1, //  视频或图片的上传个数   默认为1
        cameraDevice:"front",//front为调用前置摄像头，不传参数 或者 传其他的任何值都是默认后置 
        time:30  //picOrVideo传openAudio时需要传   录视频的时间，不传默认60S
        frame_name:
    }
 */
function openUploadNew(param_json){
    frameName = param_json.frame_name
    var picOrVideo = param_json.picOrVideo?param_json.picOrVideo:1;
    if(picOrVideo==1){
        common_wmMediaResourcesTool.openPhoto(param_json,function(flag,data_arr){
            if(flag){
               //递归上传图片
                commonUiUploadFiles({"data":data_arr,"is_trans":0}, function(ret_data) {
                    resourceAry = ret_data;
                    insertResourceBaseInfoOneByOne();
                });
            }
        });
    }else if(picOrVideo==2){
        common_wmMediaResourcesTool.openAudio(param_json,function(flag,data_arr){
            if(flag){
               //递归上传视频
                commonUiUploadFiles({"data":data_arr,"is_trans":0}, function(ret_data) {
                    resourceAry = ret_data;
                    insertResourceBaseInfoOneByOne();
                });
            }
        }); 
    }else if(picOrVideo==3){  //上传或选择音频
        common_wmMediaResourcesTool.openYinpin(param_json,function(flag,data_arr){
            if(flag){
               //递归上传视频
                commonUiUploadFiles({"data":data_arr,"is_trans":0}, function(ret_data) {
                    resourceAry = ret_data;
                    insertResourceBaseInfoOneByOne(1);
                });
            }
        }); 
    }
}
/*
*author:zhaoj
*function:选择图片
*date：20171019
*/
function getAlbum() {
    UIAlbumBrowser.open({"type":'image',"max":1},function(data){
        //递归上传图片
        commonUiUploadFiles({"data":data,"is_trans":1}, function(ret_data) {
            resourceAry = ret_data;
            insertResourceBaseInfoOneByOne();
        });
    });
}

/*
*author:zhaoj
*function:打开拍照
*date：20170914
*/
function openPicture(){
    getPicture.open({"type":1},function(data){
        //递归上传图片
        commonUiUploadFiles({"data":data,"is_trans":0}, function(ret_data) {
            for(var i = 0; i < ret_data.length; i++){
                var json_data = JSON.parse(ret_data[i]);
                var file_id = json_data.file_id;
                var ext = json_data.ext;
                var param_json = getParamJson({"file_id" : file_id,"file_name" : json_data.file_name,"resource_format" : ext, "is_show_tip":0,"type":0,"voice_duration":0});
                    //上传到资源库中
                insertResourceBaseInfo(param_json)
            }
        });
    });
}

/*
 * oneByOne上传到资源库
 */
function insertResourceBaseInfoOneByOne(type){
	if (resourceAry.length > 0){
		var json_data = JSON.parse(resourceAry[0]);
		var file_id = json_data.file_id;
		var ext = json_data.ext;
		var param_json = getParamJson({"file_id" : file_id,"file_name" : json_data.file_name,"resource_format" : ext, "is_show_tip":0,"type":type==1?type:0,"voice_duration":0});
        resourceAry.splice(0,1);
        //上传到资源库中
        insertResourceBaseInfo(param_json);
	}
}

/*
*author:zhaoj
*function:上传到资源库中
*date：20170904
*/
function insertResourceBaseInfo(param_json){
    commonInsertResourceBaseInfo(param_json,function(flag,ret){
    console.log(JSON.stringify(ret))
        if(flag){
//  		var title = ret.resource_title.split('.');
//        	if(title.length == 2){
//              ret.resource_title = ''+title[0];
//          }else{
//              ret.resource_title = '';
//              for(var i=0;i<title.length-1;i++){
//                  ret.resource_title += title[i]+'.';
//              }
//              ret.resource_title = ret.resource_title.substring(0,ret.resource_title.length-1);
//          }
            param_json.resource_id_int=ret.resource_id_int;
            param_json.resource_info_id=ret.resource_info_id;
            param_json.resource_title=ret.resource_title;
            param_json.resource_type=ret.resource_detail.resource_type;
            param_json.resource_myinfo_id=ret.resource_myinfo_id;
            param_json.resource_type_name=ret.resource_detail.resource_type_name;
            try {
                if (typeof(eval('showPicture')) == "function") {
                    showPicture(param_json);
                }
              } catch(e) {
                    showPictureH5(param_json);
              }
            insertResourceBaseInfoOneByOne();
        }else{
            api.hideProgress();
            popToast('上传失败，请重新上传');
            resourceAry.splice(0,resourceAry.length);
        }
    });
}

/*
 * 功能：打开资源
 * 作者：张自强
 * 时间：20190424
 */
function openresource(res_type, res_path, res_title,m3u8_status,res_id){
    if(res_type == 'jpg' || res_type == 'jpeg' || res_type == 'png'){
        var img_url = '';
        if (BASE_APP_TYPE == 1) {
            img_url = BASE_IMAGE_PRE+"down/Material/" + res_path.substring(0, 2) + "/" + res_path + '.' + res_type + commonReturnPhotoCutSize(0); 
        } else {
            img_url = BASE_URL_ACTION + "/html/thumb/Material/" + res_path.substring(0, 2) + "/" + res_path + '.' + res_type + commonReturnPhotoCutSize(0);
        }
        openPictureShowWin([img_url],0)
    }else{
        common_openResource.open(res_type, res_path, res_title,m3u8_status,api.winName,'reBackType("voice")','back();',res_id);
    }
}

/**
 *设置页面返回类型 
 */
function reBackType(type){
	backType = type;
}

/**
 *预览资源时返回 
 */
function resourceBack() {
	switch (backType){
		case "voice":
			commonCloseFrame('common_playaudio_frame');
	  		reBackType('win');
	  	case "txt":
	  		common_openDocument.closeTxt();
	  		reBackType('win');
		break;
	}
}

/*
*author:zhaoj
*function:获取到上传资源库中的参数
*date：20170904
*/
function getParamJson(param){
    var resource_format =param.resource_format;
    resource_format = resource_format.toLowerCase();
    var check_ext = support_extension.indexOf(resource_format);
    var m3u8_status;
    check_ext != "-1" ? m3u8_status = 1:m3u8_status=0;
    var dot_index = param.file_name.lastIndexOf('.');
    param.file_name = param.file_name.substring(0,dot_index);
    var param_json={
        "app_type_id" : 17,
        "beike_type" : 100,
        "bk_type_name" : -1,
        "file_id" : param.file_id,
        "group_id" : 2,
        "identity_id" : $api.getStorage('identity'),
        "m3u8_status" : m3u8_status,
        "person_id" : $api.getStorage("person_id"),
        "person_name" : Base64.encode($api.getStorage("person_name")),
        "res_type" : 35,
        "resource_format" : resource_format,
        "resource_title" : Base64.encode(param.file_name),
        "structure_id" : -1,
        "is_show_tip":param.is_show_tip,
        "type":param.type,//1:代表视频
        "voice_duration":param.voice_duration
    }
    return param_json;
}

/*
*author:zfz
*function:通用的上传、选择图片、视频功能
*date：20200320
*/
var wmMediaResourcesTool; 
var common_wmMediaResourcesTool = {
    openPhoto:function(param_json,callback){  //上传选择图片
        wmMediaResourcesTool = api.require('wmMediaResourcesTool'); 
        wmMediaResourcesTool.harvestPhoto({
            count: param_json.count?param_json.count:1,
            cameraDevice:param_json.cameraDevice
        },function(ret, err){
            if(ret){
                if (api.systemType == 'ios') {
                    ret=JSON.parse(ret)
                }else{
                    ret.info=ret.info.substring(1,ret.info.length-1);
                    ret.info=ret.info.split(",");
                } 
                var data_arr=[];
                if(ret.info.length>0){
                    for(var i=0;i<ret.info.length;i++){
                        data_arr.push({
                            "path":ret.info[i].trim(),
                            "thumbPath":ret.info[i].trim()
                        })
                    }
                    callback(true,data_arr);
                }
            }else{
                callback(false);
                popToast('上传图片失败，请重新上传');
            }
        
        });
    },
    openAudio:function(param_json,callback){
        wmMediaResourcesTool = api.require('wmMediaResourcesTool'); 
        wmMediaResourcesTool.harvestVideo({
            count: param_json.count?param_json.count:1,
            time:param_json.time,
            cameraDevice:param_json.cameraDevice
        },function(ret, err){
            if(ret){
                if (api.systemType == 'ios') {
                    ret=JSON.parse(ret)
                }else{
                    ret.info=ret.info.substring(1,ret.info.length-1);
                    ret.info=ret.info.split(",");
                }           
                var data_arr=[];
                if(ret.info.length>0){
                    for(var i=0;i<ret.info.length;i++){
                        data_arr.push({
                            "path":ret.info[i].trim(),
                            "thumbPath":ret.info[i].trim()
                        })
                    }
                    callback(true,data_arr);
                }
            }else{
                callback(false);
                popToast('上传视频失败，请重新上传');
            }
        });
    },
    openYinpin:function(param_json,callback){
        wmMediaResourcesTool = api.require('wmMediaResourcesTool'); 
        wmMediaResourcesTool.harvestAudio({
            count: param_json.count?param_json.count:1,
            time:999999
        },function(ret, err){
            if(ret){
                if (api.systemType == 'ios') {
                    ret=JSON.parse(ret)
                }else{
                    ret.info=ret.info.substring(1,ret.info.length-1);
                    ret.info=ret.info.split(",");
                }           
                var data_arr=[];
                if(ret.info.length>0){
                    for(var i=0;i<ret.info.length;i++){
                        data_arr.push({
                            "path":ret.info[i].trim(),
                            "thumbPath":ret.info[i].trim()
                        })
                    }
                    callback(true,data_arr);
                }
            }else{
                callback(false);
                popToast('上传音频失败，请重新上传');
            }
        });
    }   
}

//提供给h5使用的方法
function showPictureH5(param_json){
console.log(frameName)
console.log(api.winName)
    api.execScript({
        name : api.winName,
        frameName:frameName,
        script: "receiveFieldInfo('"+param_json.resource_format+"','"+param_json.file_id+"','"+param_json.m3u8_status+"','"+param_json.resource_id_int+"','"+param_json.resource_title+"','"+param_json.resource_type_name+"');"
    });
}