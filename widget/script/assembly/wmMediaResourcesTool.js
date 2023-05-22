//通用的上传、选择图片、视频功能
var wmMediaResourcesTool; 
var common_wmMediaResourcesTool = {
    openPhoto:function(count,callback,cameraDevice){  //上传选择图片
        wmMediaResourcesTool = api.require('wmMediaResourcesTool'); 
        wmMediaResourcesTool.harvestPhoto({
            count: count,
            cameraDevice:cameraDevice
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
    openAudio:function(count,time,callback,cameraDevice){
        wmMediaResourcesTool = api.require('wmMediaResourcesTool'); 
        wmMediaResourcesTool.harvestVideo({
            count: count,
            time:time,
            cameraDevice:cameraDevice
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
    }  
}