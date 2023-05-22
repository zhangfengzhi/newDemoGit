/*
*author:zhaoj
*function:获取当前教师任教的教材
*date：20170401
*/
function getSchemeProgress(callback){
    api.ajax({
        url : BASE_URL_ACTION + '/ypt/space/course_package/get_scheme_progress?random_num='+creatRandomNum()+'&person_id='+$api.getStorage("person_id")+'&identity_id='+$api.getStorage('identity'),
        method : 'get',
        timeout : 0,
        dataType : 'json',
        headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
        }, function(ret, err) {
            if(err){
                callback(false,'获取教材信息失败，请稍候重试');
            }else{
                if(ret.success){
                    callback(true,ret);
                }else{
//              	if(api.uiMode == 'pad'){
//						api.hideProgress();
//						openChangeFrame();
//					}else{
						popAlertAndShowTitle('提示', Base64.encode('当前还没有教材，请先到“我”，找到设置教材功能，设置教材！'), 'api.execScript({name : "daoxueJyJs_index_window",script : "openSzJcFrame(1);"});');
//					}
                    
                }
            }
        });
}
/*
*author:zhaoj
*function:获取知识点接口
*date：20170401
*/
function getSectionAndStruc(callback){
    api.ajax({
        url : BASE_URL_ACTION + '/ypt/bkCtl/getSectionAndStruc?random_num='+creatRandomNum()+'&volume_id='+lobal_variable.volume_id+"&get_all_level=1",
        method : 'get',
        timeout : 0,
        dataType : 'json',
        headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
        }, function(ret, err) {
            if(err){
                callback(false,'获取知识点失败，请稍候重试');
            }else{
                if(ret.success){
                    callback(true,ret);
                }else{
                    callback(false,'获取知识点失败，请稍候重试');
                }
            }
        });
}
/*
*author:zhaoj
*function:获取教师教学进度接口
*date：20170401
*/
function getTeachingProgress(callback){
    api.ajax({
        url : BASE_URL_ACTION + '/ypt/space/course_package/get_teaching_progress?random_num='+creatRandomNum()+'&scheme_id='+lobal_variable.scheme_id+'&volume_id='+lobal_variable.volume_id+'&subject_id='+lobal_variable.subject_id+'&stage_id='+lobal_variable.stage_id+'&person_id='+$api.getStorage("person_id"),
        method : 'get',
        timeout : 0,
        dataType : 'json',
        headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
        }, function(ret, err) {
            if(err){
                callback(false,'');
            }else{
                if(ret.success){
                    callback(true,ret);
                }else{
                    callback(false,'');
                }
            }
        });
}
/*
*author:zhaoj
*function:获取课程包id
*date：20170401
*/
function getCoursepackageBySchemeidOrStructureid(callback){
    api.ajax({
        url : BASE_URL_ACTION + '/ypt/space/course_package/get_coursepackage_by_schemeid_or_structureid?random_num='+creatRandomNum()+'&scheme_id='+lobal_variable.scheme_id+'&volume_id='+lobal_variable.volume_id+'&subject_id='+lobal_variable.subject_id+'&stage_id='+lobal_variable.stage_id+'&person_id='+$api.getStorage("person_id")+'&page_num=1&page_size=1&structure_id='+lobal_variable.structure_id,
        method : 'get',
        timeout : 0,
        dataType : 'json',
        headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
        }, function(ret, err) {
            if(err){
                callback(false,'获取课程包失败，请稍候重试');
            }else{
                if(ret.success){
                    callback(true,ret);
                }else{
                    callback(false,'获取课程包失败，请稍候重试');
                }
            }
        });
}
/*
*author:zhaoj
*function:获取资源类型关系id
*date：20170401
*/
function getRestypeList(callback){
    api.ajax({
        url : BASE_URL_ACTION + '/ypt/space/course_package/get_restype_list?random_num='+creatRandomNum()+'&package_id='+lobal_variable.package_id,
        method : 'get',
        timeout : 0,
        dataType : 'json',
        headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
        }, function(ret, err) {
            if(err){
                callback(false,'获取资源类型关系失败，请稍候重试');
            }else{
                if(ret.success){
                    callback(true,ret);
                }else{
                    callback(false,'获取资源类型关系失败，请稍候重试');
                }
            }
        });
}
/*
*author:zhaoj
*function:获取资源类型关系id
*date：20170401
*/
function getResList(isIpadUse){
var url=BASE_URL_ACTION + '/ypt/space/course_package/get_res_list?random_num='+creatRandomNum()+'&res_type_id='+lobal_variable.res_type_id+'&package_id='+lobal_variable.package_id+'&page_num=1&page_size=2000';
var url1=BASE_URL_ACTION + '/ypt/space/course_package/get_dsideal_res_list?random_num='+creatRandomNum()+'&res_type_id='+lobal_variable.res_type_id+'&package_id='+lobal_variable.package_id+'&page_num=1&page_size=2000&person_id='+$api.getStorage("person_id")+'&is_cloud=0';
    console.log(url)
    console.log(url1)
    api.ajax({
        url : url1,
        method : 'get',
        timeout : 0,
        dataType : 'json',
        headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
        }, function(ret, err) {
            api.hideProgress();
            if(err){
                popToast('获取导学列表失败，请稍候重试');
            }else{
                if(ret.success){
                    for(var i = 0; i < ret.list.length; i++){
                        ret.list[i].slot_time = GetDateDiff(ret.list[i].create_time);
                        ret.list[i].name_base64 = Base64.encode(ret.list[i].name);
                        ret.list[i].p_id=-1;
                    }
                    commonAddOnceHtml('j_wdja','wdja_script',ret);
                    if(isIpadUse == 1){
						commonAddOrRemoveHideCss('j_list',1);
					}
                }else{
                    popToast('获取导学列表失败，请稍候重试');
                }
            }
            //通知顶部下拉刷新数据加载完毕，组件会恢复到默认状态
            api.refreshHeaderLoadDone();
           //api.refreshHeaderLoadDone();
        });
}
/*
*author:zhaoj
*function:获取精品导学案列表数据
*date：20170401
*/
function getBoutiqueLeadList(){
    api.ajax({
        url : BASE_URL_ACTION + '/ypt/space/lead/get_boutique_lead_list?random_num='+creatRandomNum()+'&keyword=&page_num=1&business_type=2&page_size=10&structure_id='+lobal_variable.structure_id+'&org_id='+$api.getStorage("school_id") +'&org_type=104',
        method : 'get',
        timeout : 0,
        dataType : 'json',
        headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
        }, function(ret, err) {
            api.hideProgress();
            if(err){
                popToast('获取导学列表失败，请稍候重试');
            }else{
                if(ret.success){
                    for(var i = 0; i < ret.list.length; i++){
                        ret.list[i].slot_time = GetDateDiff(ret.list[i].create_time);
                        ret.list[i].name_base64 = Base64.encode(ret.list[i].name);
                    }
                    commonAddOnceHtml('j_jpja','jpja_script',ret);
                }else{
                    popToast('获取导学列表失败，请稍候重试');
                }
            }
            //通知顶部下拉刷新数据加载完毕，组件会恢复到默认状态
           api.refreshHeaderLoadDone();
        });
}
/*
* 获得时间差,时间格式为 年-月-日 小时:分钟:秒 或者 年/月/日 小时：分钟：秒
* 其中，年月日为全格式，例如 ： 2010-10-12 01:00:00
* 返回精度为：秒，分，小时，天
*/
function GetDateDiff(create_time) {
    if (moment(create_time, "YYYY-MM-DD HH:mm:ss").isBetween(moment().subtract(60, 'days').format('YYYY-MM-DD HH:mm:ss'), moment().format('YYYY-MM-DD HH:mm:ss'))) {
        var createTime = moment(create_time, "YYYY-MM-DD HH:mm:ss");
        return createTime.startOf('s').fromNow();
    } else {
        return moment(create_time, "YYYY-MM-DD HH:mm:ss").format('L');
    }
}
/*
*author:zhaoj
*function:弹出confirm
*date：20160523
*/
function popConfirm(res_id,id,p_id,lead_id,type,msg){
    api.confirm({
        title : "提示",
        msg : msg,
        buttons : ["确定","取消"]
    }, function(ret, err) {
        if(1 == ret.buttonIndex) {
            if(type == 0){
                deletePublishByPid(p_id,lead_id);
            }else if(type == 1){
                deleteResourceByIds(res_id,id);
            }
        }
    });
}
/*
*author:zhaoj
*function:取消导学的发布
*date：20170401
*/
function deletePublishByPid(p_id,lead_id){
    showSelfProgress('取消中...'); 
    api.ajax({
        url : BASE_URL_ACTION + '/ypt/space/lead/delete_publish_by_pid',
        method : 'post',
        timeout : 0,
        dataType : 'json',
        data : {
            values : {
                "random_num" : creatRandomNum(),
                "p_id" : p_id,
                "lead_id" : lead_id,
                "b_type":1,
                "package_id":lobal_variable.package_id,
                "res_type_id":lobal_variable.res_type_id
            }
        },
        headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
        }, function(ret, err) {
            api.hideProgress();
            if(err){
                popToast('取消发布失败');
            }else{
                if(ret.success){
                    updataList();
                }else{
                    popToast('取消发布失败');
                }
            }
        });
}
/*
*author:zhaoj
*function:删除导学
*date：20170401
*/
function deleteResourceByIds(res_id,id){
    showSelfProgress('删除中...'); 
    api.ajax({
        url : BASE_URL_ACTION + '/ypt/space/course_package/_delete_resource_by_ids',
        method : 'post',
        timeout : 0,
        dataType : 'json',
        data : {
            values : {
                "random_num" : creatRandomNum(),
                "ids" : id,
                "b_type" : 1,
                "lead_id":res_id,
                "res_type_id" : lobal_variable.res_type_id
            }
        },
        headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
        }, function(ret, err) {
            api.hideProgress();
            if(err){
                popToast('删除失败');
            }else{
                if(ret.success){
                    popToast('删除成功');
                    updataList();
                }else{
                    popToast('删除失败');
                }
            }
        });
}
/*
*author:zhaoj
*function:选用导学
*date：20170401
*/
function saveAsLead(){
    showSelfProgress('整理中...'); 
    $api.css($api.byId('j_shadow'),'z-index:3');
    var value = $api.trimAll($api.val($api.byId('fl_val')));
    if(value.length == 0){
        popAlert('导学名称不可以为空');
        $api.css($api.byId('j_shadow'),'z-index:-1');
        return;
    }
    api.ajax({
        url : BASE_URL_ACTION + '/ypt/space/lead/save_as_lead',
        method : 'post',
        timeout : 0,
        dataType : 'json',
        data : {
            values : {
                "random_num" : creatRandomNum(),
                "lead_id" : api.pageParam.id,
                "teacher_id" : $api.getStorage("person_id"),
                "name" : value
            }
        },
        headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
        }, function(ret, err) {
            if(err){
            	api.hideProgress();
                popToast('选用失败');
                $api.css($api.byId('j_shadow'),'z-index:-1');
            }else{
                if(ret.success){
                    saveResource(0,ret.id,'');
                }else{
                	api.hideProgress();
                    popToast('选用失败');
                    $api.css($api.byId('j_shadow'),'z-index:-1');
                }
            }
        });
}
/*
*author:zhaoj
*function:课程包中保存/替换资源
*date：20170401
*/
function saveResource(type,id,callback){
    var lobal_variable = JSON.parse(api.pageParam.lobal_variable);
    var res_array = [{"res_id":id,"is_cloud":0}];
    getCurrentTerm(function(xq_id){
        api.ajax({
            url : BASE_URL_ACTION + '/ypt/space/course_package/save_resource',
            method : 'post',
            timeout : 0,
            dataType : 'json',
            data : {
                values : {
                    "random_num" : creatRandomNum(),
                    "add_res_m" : 1,
                    "identity_id" : $api.getStorage("identity"),
                    "issue_id" : xq_id,
                    "material_type" : 1,
                    "package_id" : lobal_variable.package_id,
                    "res_ids" : JSON.stringify(res_array),
                    "res_type_id" : lobal_variable.res_type_id,
                    "scheme_id" : lobal_variable.scheme_id,
                    "stage_id" : lobal_variable.stage_id,
                    "structure_id" : lobal_variable.structure_id,
                    "subject_id" : lobal_variable.subject_id,
                    "volume_id" : lobal_variable.volume_id,
                    "person_id" : $api.getStorage("person_id")
                }
            },
            headers : {
    'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
    }
            }, function(ret, err) {
                if(err){
                    if(type){
                        callback(false,'');
                    }else{
                        api.hideProgress();
                        popToast('选用失败');
                        $api.css($api.byId('j_shadow'),'z-index:-1');
                    }
                }else{
                    if(ret.success){
                        if(type){
                            callback(true,ret);
                        }else{
                            api.hideProgress();
                            popToast('选用成功');
//                          if(api.uiMode == 'pad'){
//								commonExecScript('daoxueIpad_index_window','daoxueIpad_index_frame','updataList();',1);//切换index列表数据
//								setTimeout(function(){
//									commonExecScript('daoxueIpad_index_window','','back()',0);
//								},2000);
//							}else{
								commonExecScript('daoxueJyJs_index_window','','changeBtnTitle(0)',0);//切换index列表数据
								setTimeout(function(){
									commonExecScript('daoxueJyJs_index_window','','back()',0);
								},2000);
//							}
                        }
                    }else{
                        if(type){
                            callback(false,'');
                        }else{
                            api.hideProgress();
                            popToast('选用失败');
                            $api.css($api.byId('j_shadow'),'z-index:-1');
                        }
                    }
                }
            });
        });
}
/*
*author:zhaoj
*function:保存导学
*date：20170405
*/
function saveLead(callback){
    getCurrentTerm(function(xq_id){
        api.ajax({
            url : BASE_URL_ACTION + '/ypt/space/lead/save_lead',
            method : 'post',
            timeout : 0,
            dataType : 'json',
            data : {
                values : {
                    "random_num" : creatRandomNum(),
                    "name" : daxue_info.name,
                    "desc" : daxue_info.desc,
                    "teacher_id": $api.getStorage("person_id"),
                    "province_id":$api.getStorage("province_id"),
                    "city_id":$api.getStorage("city_id"),
                    "district_id":$api.getStorage("district_id"),
                    "bureau_id":$api.getStorage("bureau_id"),
                    "issue_id":xq_id,
                    "stage_name" : lobal_variable.stage_name,
                    "stage_id" : lobal_variable.stage_id,
                    "scheme_id" : lobal_variable.scheme_id,
                    "subject_id" : lobal_variable.subject_id,
                    "subject_name" : lobal_variable.subject_name,
                    "volume_id":lobal_variable.volume_id,
                    "structure_id":lobal_variable.structure_id,
                    "format_lead_learn":daxue_info.format_lead_learn,
                    "lead_type":1
                }
            },
            headers : {
    'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
    }
            }, function(ret, err) {
                if(err){
                    callback(false,'对不起，获取学期信息失败');
                }else{
                    if(ret.success){
                        callback(true,ret);
                    }else{
                        callback(false,'对不起，获取学期信息失败');
                    }
                }
            });
    });
}
/*
 * author:zfz
 * function:获取当前学期id及名称
 * data:2016.4.26
 */
function getCurrentTerm(callback){
    api.ajax({
        url : BASE_URL_ACTION + '/xx/getCurrentTerm',
        method : 'post',
        timeout : 30,
        dataType : 'json',
        headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
        }, function(ret, err) {
            if (err) {
                popToast('对不起，获取学期信息失败');
        } else {
            if(ret.success){
                callback(ret.XQ_ID);
            }else{
                popToast('对不起，获取学期信息失败');
            }
        }
    });
}
/*
 * author:zhaoj
 * function:获取班级
 * data:20170406
 */
function getPubOrgListByLeadId(){
    api.ajax({
        url : BASE_URL_ACTION + '/ypt/space/lead/get_pub_org_list_by_lead_id?random_num='+creatRandomNum()+'&lead_id='+api.pageParam.lead_id,
        method : 'get',
        timeout : 0,
        dataType : 'json',
        headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
        }, function(ret, err) {
            if(err){
                popToast('获取统计信息失败，请稍候重试');
            }else{
                if(ret.success){
                    var class_items = [];
                    for(var i = 0; i < ret.list.length; i++){
                        var oparam = new Object();
                        oparam.id = ret.list[i].class_group_id;
                        if(ret.list[i].class_name){
                            oparam.title = ret.list[i].class_name+'（'+ret.list[i].class_group_name+'）';
                        }else{
                            oparam.title = ret.list[i].class_group_name;
                        }
                        class_items.push(oparam);
                        org_type_array.push(ret.list[i].publish_type);
                    }
                    openNavigationBar(class_items)
                }else{
                    popToast('获取统计信息失败，请稍候重试');
                }
            }
        });
}
/*
 * author:zhaoj
 * function:获取学生统计
 * data:20170406
 */
function getStudyLeadStatList(){
    api.ajax({
        url : BASE_URL_ACTION + '/ypt/space/lead/get_study_lead_stat_list?random_num='+creatRandomNum()+'&lead_id='+api.pageParam.lead_id+'&org_id='+org_id+'&org_type='+org_type+'&page_num='+currentPage+'&page_size='+BASE_PAGE_SIZE,
        method : 'get',
        timeout : 0,
        dataType : 'json',
        headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
        }, function(ret, err) {
            api.hideProgress();
            if(err){
                popToast('获取统计信息失败，请稍候重试');
            }else{
                if(ret.success){
                    totalPages = ret.total_page;
                    for(var i = 0; i < ret.list.length; i++){
                        if($api.getStorage('BASE_APP_TYPE') == 1){
                            ret.list[i].img_src = BASE_IMAGE_PRE+url_path_suffix + ret.list[i].avatar_fileid.substring(0,2)+'/'+ret.list[i].avatar_fileid+'@150w_150h_100Q_1x.jpg';
                        }else{
                            ret.list[i].img_src = BASE_URL_ACTION+'/html/thumb/Material/' + ret.list[i].avatar_fileid.substring(0,2)+'/'+ret.list[i].avatar_fileid+'@150w_150h_100Q_1x.jpg';
                        }
                    }
                    commonAddManyHtml('tj_body','tj_script',ret);
                }else{
                    popToast('获取统计信息失败，请稍候重试');
                }
            }
            //通知顶部下拉刷新数据加载完毕，组件会恢复到默认状态
           api.refreshHeaderLoadDone();
        });
}
/*
 * author:zhaoj
 * function:获取素材统计
 * data:20170406
 */
function getLeadMaterialByLeadidAndStuid(){
    api.ajax({
        url : BASE_URL_ACTION + '/ypt/space/lead/get_lead_material_by_leadid_and_stuid?random_num='+creatRandomNum()+'&lead_id='+api.pageParam.lead_id+'&student_id='+api.pageParam.student_id,
        method : 'get',
        timeout : 0,
        dataType : 'json',
        headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
        }, function(ret, err) {
            api.hideProgress();
            if(err){
                popToast('获取统计信息失败，请稍候重试');
            }else{
                if(ret.success){
                    commonAddOnceHtml('res_body','res_script',ret);
                }else{
                    popToast('获取统计信息失败，请稍候重试');
                }
            }
        });
}
/*
 * author:zhaoj
 * function:创建课程包
 * data:20170408
 */
function saveCoursePackage(callback){
    api.ajax({
        url : BASE_URL_ACTION + '/ypt/space/course_package/save_course_package',
        method : 'post',
        timeout : 0,
        dataType : 'json',
        data : {
            values : {
                "random_num" : creatRandomNum(),
                "course_hour" : 1,
                "course_type" : "讲授课",
                "identity_id":$api.getStorage("identity"),
                "person_id": $api.getStorage("person_id"),
                "person_name": $api.getStorage("person_name"),
                "stage_id" : lobal_variable.stage_id,
                "scheme_id" : lobal_variable.scheme_id,
                "scheme_name" : lobal_variable.scheme_name,
                "subject_id" : lobal_variable.subject_id,
                "volume_id":lobal_variable.volume_id,
                "structure_id":lobal_variable.structure_id,
                "structure_name":lobal_variable.structure_name,
                "title":lobal_variable.structure_name
            }
        },
        headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
        }, function(ret, err) {
            if(err){
                callback(false,'获取导学失败，请稍候重试');
            }else{
                if(ret.success){
                    callback(true,ret);
                }else{
                    callback(false,'获取导学失败，请稍候重试');
                }
            }
        });
}
/*
*author:zhaoj
*function:显示隐藏学生分组按钮
*date：20161203
*/
function isShowWinFooterBtn(type){
    if(type){
        $api.removeCls($api.byId('j_footer'),'p-none');
    }else{
        $api.addCls($api.byId('j_footer'),'p-none');
    }
}
/*
*author:zhaoj
*function:展开孩子节点的数据
*date：20161505
*/
function openChild(id){
    var flag= false;
    for(var i = 0; i < class_id.length; i++){
        if(class_id[i] == id){
            flag=true;
            break;
        }
    }
    if(!flag){
        class_id.push(id);
    }
    var node_id=$api.dom(document.getElementById('j_child_'+id).parentNode, '.j_name');
    $api.removeCls(node_id, 'shou-qi');
    $api.addCls(node_id, 'zhan-kai');
    $api.removeCls($api.byId('j_child_'+id),'display-n');
    $api.removeAttr(node_id,'onclick');
    $api.attr(node_id,'onclick','closeChild('+id+')');
}
/*
*author:zhaoj
*function:隐藏孩子节点
*date：20161205
*/
function closeChild(id){
    for(var i = 0; i < class_id.length; i++){
        if(class_id[i] == id){
            class_id.splice(i,1);
        }
    }
    var node_id=$api.dom(document.getElementById('j_child_'+id).parentNode, '.j_name');
    $api.removeCls(node_id, 'zhan-kai');
    $api.addCls(node_id, 'shou-qi');
    $api.addCls($api.byId('j_child_'+id),'display-n');
    $api.removeAttr(node_id,'onclick');
    $api.attr(node_id,'onclick','openChild('+id+')');
}
/*
*author:zhaoj
*function:获取教师任教班级
*date：20161206
*/
function getTeachClassBySubject(callback){
    api.ajax({
        url : BASE_URL_ACTION + '/ypt/person/getTeachClassBySubject',
        method : 'post',
        timeout : 30,
        dataType : 'json',
        cache : false,
        data : {
            values : {
                "random_num" : creatRandomNum(),
                "teacher_id" : $api.getStorage("person_id")
            }
        },
        headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
    }, function(ret, err) {
        if (err) {
            callback(false,'获取任教班级失败,请稍候重试');
        } else {
            if(ret){
                callback(true,ret);
            }else{
                callback(false,'获取任教班级失败,请稍候重试');
            }
        }
    });
}
/*
*author:zhaoj
*function:获取教师创建的分组
*date：20161206
*/
function getXxGroup(class_ids,callback){
    api.ajax({
        url : BASE_URL_ACTION + '/ypt/xx/getXxGroup',
        method : 'post',
        timeout : 30,
        dataType : 'json',
        cache : false,
        data : {
            values : {
                "random_num" : creatRandomNum(),
                "class_id" : class_ids,
                "person_id" : $api.getStorage("person_id")
            }
        },
        headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
    }, function(ret, err) {
        if (err) {
            callback(false,'获取分组失败,请稍候重试');
        } else {
            if(ret){
                callback(true,ret);
            }else{
                callback(false,'获取分组失败,请稍候重试');
            }
        }
    });
}
/*
*author:zhaoj
*function:创建学生分组
*date：20161206
*/
function saveGroup(){
    $api.css($api.byId('j_shadow'),'z-index:3');
    var group_name = $api.trimAll($api.val($api.byId('fl_val')));
    if(group_name.length == 0){
        api.hideProgress();
        popAlert('群组名称不能为空！');
        $api.css($api.byId('j_shadow'),'z-index:-1');
        return;
    }
    api.ajax({
        url : BASE_URL_ACTION + '/ypt/group/saveGroup',
        method : 'post',
        timeout : 30,
        dataType : 'json',
        cache : false,
        data : {
            values : {
                "random_num" : creatRandomNum(),
                "avater_url" : "Li4vLi4vLi4vaW1hZ2VzL2hlYWRfaWNvbi9ncm91cC9kZWZhdWx0LnBuZw==",
                "group_desc" : "",
                "group_name" : group_name,
                "group_type" : 2,
                "parent_id" : -1,
                "parent_type" : 2,
                "plat_id" : 0,
                "plat_type" : 4,
                "use_range" : 1
            }
        },
        headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
    }, function(ret, err) {
        if (err) {
            api.hideProgress();
            popAlert('添加失败，请稍候重试');
            $api.css($api.byId('j_shadow'),'z-index:-1');
        } else {
            if(ret){
                addXxGroup(ret.id);
            }else{
                api.hideProgress();
                popAlert('添加失败，请稍候重试');
                $api.css($api.byId('j_shadow'),'z-index:-1');
            }
        }
    });
}
/*
*author:zhaoj
*function:创建学生分组
*date：20161206
*/
function addXxGroup(group_id){
    api.ajax({
        url : BASE_URL_ACTION + '/ypt/xx/addXxGroup',
        method : 'post',
        timeout : 30,
        dataType : 'json',
        cache : false,
        data : {
            values : {
                "random_num" : creatRandomNum(),
                "class_id" : api.pageParam.id,
                "group_id" : group_id,
                "person_id" : $api.getStorage("person_id")
            }
        },
        headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
    }, function(ret, err) {
        if (err) {
            popTipInfo(1);
        } else {
            if(ret){
                if(ret.success){
                    setTimeout(function(){
                        popToast('添加成功');
//                      if(api.uiMode == 'pad'){
//							commonExecScript('daoxueIpad_stu_group_window','daoxueJyJs_stu_group_frame','initData()',1);//切换index列表数据
//						}else{
							commonExecScript('daoxueJyJs_stu_group_window','daoxueJyJs_stu_group_frame','initData()',1);//切换index列表数据
//						}
                    },1500);
                    setTimeout(function(){
                        api.hideProgress();
//                  	if(api.uiMode == 'pad'){
//							commonCloseFrame("daoxueIpad_group_name_frame");
//						}else{
							commonCloseFrame("daoxueJyJs_group_name_frame");
//						}
                    },1600);
                }else{
                    popTipInfo(1);
                }
            }else{
                popTipInfo(1);
            }
        }
    });
}
/*
*author:zhaoj
*function:编辑学生分组
*date：20161206
*/
function updateGroup(){
    $api.css($api.byId('j_shadow'),'z-index:3');
    var group_name = $api.trimAll($api.val($api.byId('fl_val')));
    if(group_name.length == 0){
        api.hideProgress();
        popAlert('群组名称不能为空！');
        $api.css($api.byId('j_shadow'),'z-index:-1');
        return;
    }
    api.ajax({
        url : BASE_URL_ACTION + '/ypt/group/updateGroup',
        method : 'post',
        timeout : 30,
        dataType : 'json',
        cache : false,
        data : {
            values : {
                "random_num" : creatRandomNum(),
                "avater_url" : -1,
                "group_desc" : "",
                "id" : api.pageParam.id,
                "group_name" : group_name
            }
        },
        headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
    }, function(ret, err) {
        if (err) {
            popTipInfo(0);
        } else {
            if(ret){
                if(ret.success){
                    setTimeout(function(){
                        popToast('编辑成功');
//                      if(api.uiMode == 'pad'){
//							commonExecScript('daoxueIpad_stu_group_window','daoxueJyJs_stu_group_frame','initData()',1);//切换index列表数据
//						}else{
							commonExecScript('daoxueJyJs_stu_group_window','daoxueJyJs_stu_group_frame','initData()',1);//切换index列表数据
//						}
                    },1500);
                    setTimeout(function(){
                        api.hideProgress();
//                      if(api.uiMode == 'pad'){
//							commonCloseFrame("daoxueIpad_group_name_frame");
//						}else{
							commonCloseFrame("daoxueJyJs_group_name_frame");
//						}
                    },1600);
                }else{
                    popTipInfo(0);
                }
            }else{
                popTipInfo(0);
            }
        }
    });
}
/*
*author:zhaoj
*function:提示删除学生分组
*date：20161208
*/
function deleteGroup(group_id,group_name){
    var msg;
    if(group_name.length>5){
        msg = '确定删除分组“'+group_name.substring(0,5)+'...”吗？';
    }else{
        msg = '确定删除分组“'+group_name+'”吗？';
    }
    popTwoBtnConfirm('提示',msg,'deleteXxGroup('+group_id+')');
}
/*
*author:zhaoj
*function:删除学生分组
*date：20161206
*/
function deleteXxGroup(group_id){
    showSelfProgress('删除中...');
    api.ajax({
        url : BASE_URL_ACTION + '/ypt/xx/deleteXxGroup',
        method : 'post',
        timeout : 30,
        dataType : 'json',
        cache : false,
        data : {
            values : {
                "random_num" : creatRandomNum(),
                "group_id" : group_id,
                "person_id" : $api.getStorage("person_id"),
            }
        },
        headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
    }, function(ret, err) {
        if (err) {
            popTipInfo(2);
        } else {
            if(ret){
                if(ret.success){
                    setTimeout(function(){
                        api.hideProgress();
                        popToast('删除成功');
                        initData();
                    },1500);
                }else{
                    popTipInfo(2);
                }
            }else{
                popTipInfo(2);
            }
        }
    });
}
/*
*author:zhaoj
*function:添加和编辑失败的提示消息
*date：20161206
*/
function popTipInfo(type){
    if(type==1){
        popAlert('添加失败，请稍候重试');
    }else if(type==2){
        popAlert('删除失败，请稍候重试');
    }else{
        popAlert('编辑失败，请稍候重试');
    }
    api.hideProgress();
    $api.css($api.byId('j_shadow'),'z-index:-1');
}
/*
*author:zhaoj
*function:根据班级获取学生
*date：20161206
*/
function getStudentByTeaClassId(callback){
    api.ajax({
        url : BASE_URL_ACTION + '/ypt/xx/getStudentByTeaClassId',
        method : 'get',
        timeout : 30,
        dataType : 'json',
        cache : false,
        data : {
            values : {
                "random_num" : creatRandomNum(),
                "class_id" : api.pageParam.id,
                "teacher_id" : $api.getStorage("person_id"),
                "pageNumber" : 1,
                "pageSize" : 9999,
            }
        },
        headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
    }, function(ret, err) {
        if (err) {
            callback(false,'获取学生信息失败，请稍候重试');
        } else {
            if(ret){
                if(ret.success){
                    callback(true,ret);
                }else{
                    callback(false,'获取学生信息失败，请稍候重试');
                }
            }else{
                callback(false,'获取学生信息失败，请稍候重试');
            }
        }
    });
}
/*
*author:zhaoj
*function:根据分组获取学生
*date：20161206
*/
function getMemberByparams(callback){
    api.ajax({
        url : BASE_URL_ACTION + '/ypt/group/getMemberByparams',
        method : 'get',
        timeout : 30,
        dataType : 'json',
        cache : false,
        data : {
            values : {
                "random_num" : creatRandomNum(),
                "groupId" : api.pageParam.id,
                "pageNumber" : 1,
                "pageSize" : 9999,
                "keyword":"",
                "member_type":-1,
                "nodeId":api.pageParam.id,
                "orgType":-1,
                "rangeType":3,
                "stage_id":-1,
                "subject_id":-1
            }
        },
        headers : {
'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
}
    }, function(ret, err) {
        if (err) {
            callback(false,'获取学生信息失败，请稍候重试');
        } else {
            if(ret){
                if(ret.success){
                    callback(true,ret);
                }else{
                    callback(false,'获取学生信息失败，请稍候重试');
                }
            }else{
                callback(false,'获取学生信息失败，请稍候重试');
            }
        }
    });
}