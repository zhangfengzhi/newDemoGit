var resourceAry = [];

/*
 * 浏览数加一
 * 王俭
 * 2018.7.4
 */
function add_works_view_num(works_id){
	api.ajax({
        url:BASE_URL_ACTION+'/ypt/space/topic/add_works_view_num',
        method : 'post',
		dataType : 'json',
		timeout:30,
		data : {
			values : {
				"works_id" : works_id,
			}
		},
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
    },function(ret,err){
    	if (ret && ret.success){
			$api.text($api.byId('yulan_'+works_id), ret.view_num);
    	}
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
        console.log("oneByOne上传到资源库param_json="+JSON.stringify(param_json))
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
            showPicture(param_json);
            insertResourceBaseInfoOneByOne();
        }else{
            api.hideProgress();
            popToast('上传失败，请重新上传');
            resourceAry.splice(0,resourceAry.length);
        }
    });
}

/*
     * 功能：时间选择
     * 作者：张自强
     * 时间：20180912
     */
    function openTime(type){
        var now_time = $api.html($api.byId('j_time_'+type));
        if(now_time && now_time != '--'){
            setTime(type,now_time);
        }else{
            getCurrentData(function(time){
                now_fw_time = time;
                setTime(type,time);
            });
        }
    }
    
    /*
    *author:zhaoj
    *function:获取当前服务器时间
    *date：201701019
    */
    function setTime(type,nowTime){
        openPicker.open({"type":0,"time":nowTime},function(time){
            var j_time_0 = $api.html($api.byId('j_time_0'));
            var j_time_1 = $api.html($api.byId('j_time_1'));
//          if(api.uiMode == 'pad' && $api.getStorage('idy_type') !=  'work'){
//              j_time_0 = $api.val($api.byId('j_time_0'));
//              j_time_1 = $api.val($api.byId('j_time_1'));
//          }
            if(j_time_0 == '--'){
                j_time_0 = '';
            }
            if(j_time_1 == '--'){
                j_time_1 = '';
            }
            if(type){
                //结束日期
                if(Date.parse(j_time_0.replace(/-/g,'\/'))<=Date.parse(time.replace(/-/g,'\/'))){
//                  if(api.uiMode == 'pad' && $api.getStorage('idy_type') !=  'work'){
//                      $api.val($api.byId('j_time_'+type), time);
//                  }else{
                        $api.html($api.byId('j_time_'+type), time);
//                  }
                    end_time = time;
                }else{
                    if(j_time_0 == '' || typeof(j_time_0) == undefined || j_time_0 == null){
                        popAlert('请先选择开始日期！');
                    }else{
                        popAlert('结束日期不能小于开始日期！');
                    }
                }
            }else{
                //开始日期
                if(first_check_time){//第一次选择开始日期
                    first_check_time = false;
//                  if(Date.parse(now_fw_time.substring(0,10).replace(/-/g,'\/'))<=Date.parse(time.replace(/-/g,'\/'))){
//                  if(api.uiMode == 'pad' && $api.getStorage('idy_type') !=  'work'){
//                      $api.val($api.byId('j_time_'+type), time);
//                  }else{
                        $api.html($api.byId('j_time_'+type), time);
//                  }
                    start_time = time;
//                  }else{
//                      popAlert('不能是过去日期，请重新选择！');
//                  }
                }else{//非第一次选择开始日期
                    var falg_old_time = false;//结束日期小于开始日期
                    var falg_less_time = false;//开始日期是过去的时间
                    falg_old_time = Date.parse(time.replace(/-/g,'\/'))<=Date.parse(j_time_1.replace(/-/g,'\/'));
//                  falg_less_time = Date.parse(now_fw_time.substring(0,10).replace(/-/g,'\/'))<=Date.parse(time.replace(/-/g,'\/'));
                    if(j_time_1 == ''){
                       falg_old_time = true;
                    }
                    if(falg_old_time){
//                      if(api.uiMode == 'pad' && $api.getStorage('idy_type') !=  'work'){
//                          $api.val($api.byId('j_time_'+type), time);
//                      }else{
                            $api.html($api.byId('j_time_'+type), time);
//                      }
                        start_time = time;
                    }else{
                        popAlert('结束日期不能小于开始日期！');
                        return; 
                    }
                }
            }
            changeTimeAndInit(start_time,end_time);
        });
        
    }
    
    /*
    *author:zhaoj
    *function:获取当前服务器时间
    *date：201701019
    */
    function getCurrentData(callback){
        commonGetCurrentDate(function(nowTime,nowMillisecond){
            var year = nowTime.getFullYear();    //获取完整的年份(4位,1970-????)
            var month = nowTime.getMonth()*1+1;       //获取当前月份(0-11,0代表1月)
            month = month < 10?'0'+month:month;
            var day = nowTime.getDate();        //获取当前日(1-31)
            day = day < 10?'0'+day:day;
            var hour = nowTime.getHours();       //获取当前小时数(0-23)
            hour = hour < 10?'0'+hour:hour;
            var minutes = nowTime.getMinutes();     //获取当前分钟数(0-59)
            minutes = minutes < 10?'0'+minutes:minutes;
            var time = year+'-'+month+'-'+day+' '+hour+':'+minutes;
            callback(time);
        });
    }
    
    /*
     * 功能：修改时间并加载数据
     * 作者 ：张自强
     * 时间：20180912
     */
    function changeTimeAndInit(start_time,end_time){
        if(start_time && end_time){
            if(fromType == 2){
             
                    commonExecScript(api.winName,'zthd_tjtea_frame','changeTimeAndInit("'+start_time+'","'+end_time+'");',1);
               
            }else if(fromType == 1){
                commonExecScript(api.winName,'zthd_tj_frame','changeTimeAndInit("'+start_time+'","'+end_time+'");',1);
            }
        }
    }
    
    /*
     * 功能：修改排序方式
     * 作者：张自强
     * 时间：20180912
     */
    function changeSortType(sortColumn,sortType){
        sort_column = sortColumn;
        sort_type = sortType;
        if(fromType == 2){
                
                    commonExecScript(api.winName,'zthd_tjtea_frame','changeSortType('+sort_column+',"'+sort_type+'");',1);
            }else if(fromType == 1){
                commonExecScript(api.winName,'zthd_tj_frame','changeSortType('+sort_column+',"'+sort_type+'");',1);
            }
        
    } 
    
    /*
    *author:zfz
    *function:选视频、图片
    *date：20200313
    */
    function openPhotoAndAudioWindow(type){
        if(getImageNum() == false){
            return;
        }
        var imgArray = $api.domAll($api.byId('j_files'), 'li');
        var count = 9-imgArray.length;
        var param_json = {
            picOrVideo:type, 
            count:count, 
            time:180  
        }
        openUploadNew(param_json);
    }