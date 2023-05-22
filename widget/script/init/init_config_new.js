//颜色样式数组
var color_array=["aui-text-info","aui-text-success","aui-text-warning","aui-text-danger","aui-text-pink"];
var teacher_id_json;//教师所需模块id以及未读数目
var student_id_json;//学生所需模块id以及未读数目
var parent_id_json;//家长所需模块id以及未读数目
var work_id_json;//办公所需模块id以及未读数目
var basics_teacher_data ;//教师最终渲染json数据
var basics_student_data;//学生最终渲染json数据
var basics_parent_data ;//家长最终渲染json数据
var basics_work_data ;//家长最终渲染json数据
/*
*author:zhaoj
*function:初始化全局变量
*date：20170502
*/
function initGlobalVariable(){
    teacher_id_json = {"list":[]};//教师所需模块id以及未读数目
    student_id_json = {"list":[]};//学生所需模块id以及未读数目
    parent_id_json = {"list":[]};//家长所需模块id以及未读数目
    work_id_json = {"list":[]};//办公所需模块id以及未读数目
    basics_teacher_data = {"list":[{"name":"教学类","list":[]},{"name":"办公类",   "list":[]}]};//教师最终渲染json数据
    basics_student_data = {"list":[{"name":"慧学习","list":[]},{"name":"慧生活",  "list":[]}]};//学生最终渲染json数据
    basics_parent_data = {"list":[{"name":"慧学习","list":[]},{"name":"慧生活",   "list":[]}]};//家长最终渲染json数据
     basics_work_data = {"list":[{"name":"教学类","list":[]},{"name":"办公类",   "list":[]}]};//办公最终渲染json数据
}
/*
*author:zhaoj
*function:初始化应用菜单数据
*date：20170413
*/
function init_yy_menu_new(callback){
   	var code_list = [];
    initGlobalVariable();//初始化全局变量
    if(BASE_CRM_TYPE){
        getCrmInfoByPersonid(function(data){
            getCrmAboutHjx(function(flag_hjx){
                getCrmAboutWlyx(function(flag_wlyx){
                    if(data.list && data.list.length != 0){
                        var result = [];
                        code_list = checkYyList(data.list,result);
                        if(!flag_hjx && flag_wlyx){
                            code_list.push('hjx_wlyx');
                        }
                        callback(code_list);
                            
                    }else{
                        if(!flag_hjx && flag_wlyx){
                            code_list.push('hjx_wlyx');
                        }
                        callback(code_list);
                    }
                });
            });
        });
    }else{
        callback([]);
    }
}


/*
 * 功能：将获取的crm数据与现有数据做比较
 * 时间：20180907
 * 作者：张自强
 */
function checkYyList(data,result){
    if(data == null || data == [] || typeof(data) == undefined){
        return result;
    }
    for(var i=0;i<data.length;i++){
        if(data[i].purview_code){
            result.push(data[i].purview_code);
        }
        var result2 = checkYyList(data[i].children,result);
        result.concat(result2);
    }
    return result;
}

/*
*author:zhaoj
*function:根据角色来进行整理应用json数据
*date：20170413
*/
function setBasicData(codeList,callback){
	var index1 = codeList.indexOf("hjx_rcbg_xzgw_deal");
	var index2 = codeList.indexOf("hjx_rcbg_xzgw_handled");
	if (index1 !== -1 && index2 !== 2){
		codeList.splice(index2,1);
	}

	var idy_type = $api.getStorage('idy_type');
	var idy_id = $api.getStorage('idy_id');
	var jsonPath = "widget://res/json/init_json/init_"+idy_type+".json";
//	if(api.uiMode == 'pad'){
//	   jsonPath = "widget://res/json/init_ipad_json/init_"+idy_type+".json";
//	}
	var wdkq_flag = false;
	var kqsp_flag = false;
	var kqgl_flag = false;
	var dktj_flag = false;
	addorLessPersonalizedYy(codeList,idy_id*1,function(code_list){
	   getKaoqinMenu(function(kq_count,kq_data){
	       if(kq_data.list){
	           for(var k=0;k<kq_data.list.length;k++){
	               switch(kq_data.list[k].id*1){
	                   case 1:
	                       wdkq_flag = true;
	                       break;
	                   case 2:
                           kqsp_flag = true;
                           break;
                       case 3:
                           kqgl_flag = true;
                           break;
                       case 6:
                           dktj_flag = true;
                           break;
	               }
	           }
	       }
           commonBaseConfig(jsonPath,function(data) {
                var now_code_list = [];
                switch(idy_id*1) {
                    case 0:
                        for(var j = 0; j < data.list.length; j++){
                            for(var i = 0; i <code_list.length; i++ ){
                                if(data.list[j].code == code_list[i]){
                                    var list_data = data.list[j];
                                    if(data.list[j].code == 'hjx_rcbg_tzgg'){
                                       list_data.count = kq_count;
                                    }else{
                                       list_data.count = 0;
                                    }
                                    var flag = false;
                                    switch(data.list[j].code){
                                        case 'hjx_rcbg_kqgl_kqjl'://wdkq
                                            if(wdkq_flag){
                                                flag = true;
                                            }
                                            break;
                                        case 'hjx_rcbg_kqgl_kqsp'://kqsp
                                            if(kqsp_flag){
                                                flag = true;
                                            }
                                            break;
                                        case 'hjx_rcbg_kqgl_kqgz'://kqgl
                                            if(kqgl_flag){
                                                flag = true;
                                            }
                                            break;
                                        case 'hjx_rcbg_kqgl_kqtj'://dktj
                                            if(dktj_flag){
                                                flag = true;
                                            }
                                            break;
                                        case 'hjx_rcbg_xzgw_deal':
	                                        if (index1 !== -1){
	                                        	flag = true;
	                                        }
                                        	if (index2 == -1){
                                        		list_data.childMenu = "deal";
                                        	}else{
                                        		list_data.childMenu = "";
                                        	}
                                        	break;
                                        case 'hjx_rcbg_xzgw_handled':
                                        	if (index1 == -1){
                                        		flag = true;
                                        		list_data.childMenu = "handled";
                                        	}else{
                                        		list_data.childMenu = "";
                                        	}
                                        	break;
                                        default:
                                            flag = true;
                                            for(var k=0;k<now_code_list.length;k++){
                                                if(now_code_list[k] == code_list[i]){
                                                    flag = false;
                                                }
                                            }
                                            break;
                                    }
                                    if(flag){
                                        now_code_list.push(code_list[i]);
                                        list_data.color = color_array[i%5];
                                        list_data.param_string = JSON.stringify(list_data);
                                        basics_teacher_data.list[list_data.config_type].list.push(list_data);
                                    }
                                }
                            }
                        }
                        callback(basics_teacher_data);
                        break;
                    case 1:
                        for(var j = 0; j < data.list.length; j++){
                            for(var i = 0; i <code_list.length; i++ ){
                                if(data.list[j].code == code_list[i]){
                                    var list_data = data.list[j];
                                    list_data.count = 0;
                                    list_data.color = color_array[i%5];
                                    list_data.param_string = JSON.stringify(list_data);
                                    basics_student_data.list[list_data.config_type].list.push(list_data);
                                }
                            }
                        }
                        callback(basics_student_data);
                        break;
                    case 2:
                        for(var j = 0; j < data.list.length; j++){
                            for(var i = 0; i <code_list.length; i++ ){
                                if(data.list[j].code == code_list[i]){
                                    var list_data = data.list[j];
                                    list_data.count = 0;
                                    list_data.color = color_array[i%5];
                                    list_data.param_string = JSON.stringify(list_data);
                                    basics_parent_data.list[list_data.config_type].list.push(list_data);
                                }
                            }
                        }
                        callback(basics_parent_data);
                        break;
                    case 3:
                        for(var j = 0; j < data.list.length; j++){
                            for(var i = 0; i <code_list.length; i++ ){
                                if(data.list[j].code == code_list[i]){
                                    var list_data = data.list[j];
                                    if(data.list[j].code == 'rcbg_tzgg'){
                                       list_data.count = kq_count;
                                    }else{
                                       list_data.count = 0;
                                    }
                                    var flag = false;
                                    switch(data.list[j].code){
                                        case 'rcbg_kqgl_kqjl'://wdkq
                                            if(wdkq_flag){
                                                flag = true;
                                            }
                                            break;
                                        case 'rcbg_kqgl_kqsp'://kqsp
                                            if(kqsp_flag){
                                                flag = true;
                                            }
                                            break;
                                        case 'rcbg_kqgl_kqgz'://kqgl
                                            if(kqgl_flag){
                                                flag = true;
                                            }
                                            break;
                                        case 'rcbg_kqgl_kqtj'://dktj
                                            if(dktj_flag){
                                                flag = true;
                                            }
                                            break;
                                        default:
                                            flag = true;
                                            for(var k=0;k<now_code_list.length;k++){
                                                if(now_code_list[k] == code_list[i]){
                                                    flag = false;
                                                }
                                            }
                                            break;
                                    }
                                    if(flag){
                                        now_code_list.push(code_list[i]);
                                        list_data.color = color_array[i%5];
                                        list_data.param_string = JSON.stringify(list_data);
                                        basics_work_data.list[list_data.config_type].list.push(list_data);
                                    }
                                }
                            }
                        }
                        callback(basics_work_data);
                        break;
                }
            });
       });
	});
}

/*
 * 功能：个性化功能添加或未设置crm时候添加应用
 * 作者：张自强
 * 时间：20180907
 */
function addorLessPersonalizedYy(codeList,idy_id,callback){
//添加方式为（例子）：tea_personalizedyy_list = [{'id':'23','code':'zysygh'},{'id':'22','code':'hjx_tb'}];在这添加的模块不受crm控制，添加完后要注意是否与crm配置过的应用重复
//var tea_add_personalizedyy_list = [{'id':'37','code':'zdy_ywxyd'},{'id':'42','code':'nmsjcx'}];
  var tea_add_personalizedyy_list = [{'id':'37','code':'zdy_ywxyd'}];
  var stu_add_personalizedyy_list = [{'id':'27','code':'zdy_ywxyd'}];
  var par_add_personalizedyy_list = [];
//var work_add_personalizedyy_list = [{'id':'19','code':'zdy_quanzi'},{'id':'22','code':'nmsjcx'}];
  var work_add_personalizedyy_list = [{'id':'19','code':'zdy_quanzi'}];
  var tea_less_personalizedyy_list = [{'id':'11','code':'hjx_wlyx_yxhd'}];
  var stu_less_personalizedyy_list = [];
  var par_less_personalizedyy_list = [];
  var work_less_personalizedyy_list = [{'id':'21','code':'hjx_wlyx_yxhd'}];
  var now_add_list = [];
  var now_less_list = [];
  switch(idy_id){
     case 0:
        now_add_list = tea_add_personalizedyy_list;
        now_less_list = tea_less_personalizedyy_list;
        break;
     case 1:
        now_add_list = stu_add_personalizedyy_list;
        now_less_list = stu_less_personalizedyy_list;
        break;
     case 2:
        now_add_list = par_add_personalizedyy_list;
        now_less_list = par_less_personalizedyy_list;
        break;
     case 3:
        now_add_list = work_add_personalizedyy_list;
        now_less_list = work_less_personalizedyy_list;
        break;
  }
  for(var i=0;i<now_add_list.length;i++){
    var flag = false;
    for(var h=0;h<codeList.length;h++){
        if(codeList[h] == now_add_list[i].code){
            flag = true;
        }
    }
    if(!flag){
        codeList.push(now_add_list[i].code);
    }
  }   
  for(var j=0;j<now_less_list.length;j++){
    for(var k=0;k<codeList.length;k++){
        if(codeList[k] == now_less_list[j].code){
            codeList.splice(k,1);
            k--;
        }
    }
  };
  var codeList_new = [];
  for(var l = 0; l < codeList.length;l++){
     if(codeList_new.indexOf(codeList[l]) == -1){
        codeList_new.push(codeList[l]);
     }
  }
  callback(codeList_new);
}

/*
*author:zhaoj
*function:获取考勤菜单权限
*date：20170413
*/
function getKaoqinMenu(callback) {
	api.ajax({
		url : BASE_URL_ACTION + '/leave/getPurviewInfo',
		method : 'get',
		timeout : 0,
		dataType : 'json',
		data : {
			values : {
				"random_num" : creatRandomNum(),
				"person_id" : $api.getStorage("person_id"),
				"identity_id" : $api.getStorage("identity"),
			}
		},
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		if (err) {
			callback(0,{});
		} else {
			if (ret.success) {
			    if(ret.list && ret.list.length != 0){
			      var rett = ret;
			      for(var i=0;i<rett.list.length;i++){
			         if(rett.list[i].id == 5){
			             callback(rett.list[i].count,ret);
			         }
			      }
			    }else{
			      callback(0,{});
			    }
			} else {
				callback(0,{});
			}
		}
	});
}

/*
*author:zfz
*function:判断当前人员是否显示非财政审批菜单
*date：20171208
*/
function isShowFczsp(callBack){
	var org_id = $api.getStorage('bureau_id');
	var org_type;
	//机构类型： 100：全国， 101：省， 102：市， 103：区县， 104：校，
	if(Number(org_id) > 100000 && Number(org_id) < 200000){
		org_type = 101;
	}else if(Number(org_id) > 200000 && Number(org_id) < 300000){
		org_type = 102;
	}else if(Number(org_id) > 300000 && Number(org_id) < 400000){
		org_type = 103;
	}else if(Number(org_id) > 400000){
		org_type = 104;
	}
	var url = BASE_URL_ACTION + "/ypt/space/examine/getPersonInfo?person_id="+$api.getStorage("person_id")+"&identity_id="+$api.getStorage("identity")+"&org_id="+org_id+"&org_type="+org_type+"&random_num="+creatRandomNum();
		api.ajax({
			url : url,
			method : 'get',
			dataType : 'json',
			timeout : 30,
			headers : {
	'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
		}, function(ret, err) {
			if (ret.success) {
				if(ret.list.length>0){	//显示非财政
					var idy_id = $api.getStorage('idy_id');
					if(idy_id==0){
						teacher_id_json.list.push({"id":28,"no_count":0});
					}
					if(idy_id==3){
						work_id_json.list.push({"id":16,"no_count":0});
					}
					
					callBack(true);
				}else{
					callBack(false);
				}
			} else {
				callBack(false);
			}
		});
    //callBack(false);
}

/*
 * 功能：获取用户crm合同
 * 作者：张自强
 * 时间：20180907
 */
function getCrmInfoByPersonid(callback){
    api.ajax({
	    url:BASE_URL_ACTION + '/base/crm/getCrmInfoByPerson?random_num='+creatRandomNum()+'&person_id='+$api.getStorage('person_id')+'&identity_id='+$api.getStorage('identity')+'&plat=2&level=4&user_type=4',
	    method:'get',
	    timeout : 30,
	    dataType:'json',
	    headers : {
            'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
        }
    },function(ret,err){
    	if(err){
    	   callback({'list':[]});
    	}else{
    	   if(ret.success && ret.result_info){
    	       callback(ret.result_info);
    	   }else{
    	       callback({'list':[]});
    	   }
    	}
    });
}

/*
 * 功能：校验是否购买了慧教学
 * 作者：张自强
 * 时间：20181123
 */
function getCrmAboutHjx(callback){
    api.ajax({
        url:BASE_URL_ACTION + '/base/crm/getCrmInfoByPerson?random_num='+creatRandomNum()+'&person_id='+$api.getStorage('person_id')+'&identity_id='+$api.getStorage('identity')+'&plat=2&user_type=0&sys_type=11',
        method:'get',
        timeout : 30,
        dataType:'json',
        headers : {
            'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
        }
    },function(ret,err){
        if(err){
           callback(false);
        }else{
           if(ret.success){
               callback(true);
           }else{
               callback(false);
           }
        }
    });
}

/*
 * 功能：查看是否购买了研修
 * 作者：张自强
 * 时间：20181123
 */
function getCrmAboutWlyx(callback){
    api.ajax({
        url:BASE_URL_ACTION + '/base/crm/getCrmInfoByPerson?random_num='+creatRandomNum()+'&person_id='+$api.getStorage('person_id')+'&identity_id='+$api.getStorage('identity')+'&plat=2&user_type=0&sys_type=8',
        method:'get',
        timeout : 30,
        dataType:'json',
        headers : {
            'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
        }
    },function(ret,err){
        if(err){
           callback(false);
        }else{
           if(ret.success){
               callback(true);
           }else{
               callback(false);
           }
        }
    });
}