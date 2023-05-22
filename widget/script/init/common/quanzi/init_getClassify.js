
var tempNum = 0;
var totalNum = 3;
var jigouList = {'areaList':[]};//机构分类数组
var classList;//班级分类数组
var groupList;//群组分类数组
var personalList;//个人分类数组
var allSelectData = {'org_list':[],'class_list':[],'group_list':[]};//存储分类选中数据
/**
 * 点击添加圈子按钮，获取发布范围数据
 * 王俭
 * 2018.5.2 
 */
function clickAddQuanzi(){
	$api.rmStorage('personalClassifyContent');
	$api.rmStorage('publishRangeContent');
	tempNum = 0;
	totalNum = 3;//个人、班级、群组
	jigouList = {'areaList':[]};//机构分类数组
	classList = [];//班级分类数组
	groupList = [];//群组分类数组
	personalList = [];//个人分类数组
	allSelectData = {'org_list':[],'class_list':[],'group_list':[]};//存储分类选中数据
	$api.rmStorage('areaRange');
	$api.rmStorage('personalClassifyId');
	$api.rmStorage('allClassifyData');
	commonShowProgress('加载中...',true);
	getJiGouClassifyData();
	if ($api.getStorage('idy_type') != 'work'){
		getClassClassify();
	}else{
		totalNum--;
	}
	getGroupClassify();
	getPersonalClassify();
}

function getJiGouClassifyData(){
	if ($api.getStorage('identity') == 5){
		if ($api.getStorage('province_id') && $api.getStorage('province_id') != 0 && $api.getStorage('org_level') <= 101){
			totalNum++;
			getProvinceClassify();
		}
		if ($api.getStorage('city_id') && $api.getStorage('city_id') != 0 && $api.getStorage('org_level') <= 102){
			totalNum++;
			getCityClassify();
		}
		if ($api.getStorage('district_id') && $api.getStorage('district_id') != 0 && $api.getStorage('org_level') <= 103){
			totalNum++;
			getDistrictClassify();
		}
	}
	
	if ($api.getStorage('idy_type') != 'work' && $api.getStorage('school_id') && $api.getStorage('school_id') != 0 && $api.getStorage('org_level') <= 104){
		totalNum++;
		getSchoolClassify();
	}
}

/*
 * 获取分类信息
 */
function getClassifyData(url,type,errTip,id){
	api.ajax({
        url : url,
        method : 'get',
        timeout : 0,
        dataType : 'json',
        headers : {
    	'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
    	}
     }, function(ret, err) {
     	if(err){
        	popToast(errTip);
        }else{
            if(ret && ret.success){
            	if (type == 'jigou'){
            		for (var i = 0; i < jigouList.areaList.length; i++){
            			if (id == jigouList.areaList[i].org_id){
            				jigouList.areaList[i]['list'] = ret.list;
            				jigouList.areaList[i].select_name = jigouList.areaList[i].list[0].name;
            				for (var j = 0; j < ret.list.length; j++){
            					if (j == 0){
            						if ($api.getStorage('identity') != 6){
            							if (id == $api.getStorage('school_id')){//默认选中学校
	            							allSelectData.org_list.push({
		            							'org_id':jigouList.areaList[i].org_id,
		            							'org_type':jigouList.areaList[i].org_type,
		            							'category_id':jigouList.areaList[i].list[j].id,
		            						});
		            						$api.setStorage('areaRange',allSelectData);
	            						}
            						}
            						jigouList.areaList[i].list[j]['select'] = true;//每组第一个分类默认选中
            					}else{
            						jigouList.areaList[i].list[j]['select'] = false;
            					}
            				}
		            		tempNum++;
		            		afterGetClassifyData();
		            		break;
            			}
            		}
            	}
            	else{
            		for (var i = 0; i < ret.list.length; i++){
            			if ($api.getStorage('idy_type') != 'work' && $api.getStorage('identity') == 6 && type == 'class'){
            				ret.list[i].org_name = '本班';
            				$api.setStorage('publishRangeContent',ret.list[i].org_name);
							ret.list[i]['select'] = true;
							allSelectData.class_list.push({
	    						"org_id":ret.list[i].org_id,
								"category_id":ret.list[i].category_s[0][0].id
	    					});
	    					$api.setStorage('areaRange',allSelectData);
						}else{
							ret.list[i]['select'] = false;
						}
            			ret.list[i]['select_name'] = ret.list[i].category_s[0][0].name;
            			for (var j = 0; j < ret.list[i].category_s[0].length; j++){
            				if (j == 0){
            					ret.list[i].category_s[0][j]['select'] = true;
            				}else{
            					ret.list[i].category_s[0][j]['select'] = false;
            				}
            			}
            		}
            		
            		if (type == 'class'){
            			classList = ret;
            			tempNum++;
            			afterGetClassifyData();
            			
            		}else if (type == 'group'){
            			groupList = ret;
            			tempNum++;
            			afterGetClassifyData();
            		}
            	}
                
            }else{
                if (type == 'jigou'){
                	jigouList = {'areaList':[]};
                }else if (type == 'class'){
                	classList = {'list':[]};
                }else if (type == 'group'){
                	groupList = {'list':[]};
                }
                
                tempNum++;
            	afterGetClassifyData();
            }
        }
    });
    api.hideProgress();
}

/**
 * 获取省分类 
 */
function getProvinceClassify(){
	var data = {
		'areaName':'本省',
		'org_type':'101',
		'org_id':$api.getStorage('province_id'),
		'select':false,
		'select_name':'',
	};
	if ($api.getStorage('idy_type') == 'work' && jigouList.areaList.length == 0){
		$api.setStorage('publishRangeContent',data.areaName);
		data.select = true;
	}
    var url = BASE_URL_ACTION + '/blog/getCategory?random_num=' + creatRandomNum() + '&business_type=7&business_id=' + data.org_id
     + '&business_iid=' + data.org_type + '&identity_id=' + $api.getStorage('identity');
	jigouList.areaList.push(data);
	getClassifyData(url,'jigou','获取省分类信息失败，请重试',data.org_id);
}

/**
 * 获取市分类 
 */
function getCityClassify(){
	var data = {
		'areaName':'本市',
		'org_type':'102',
		'org_id':$api.getStorage('city_id'),
		'select':false,
		'select_name':'',
	};
	if ($api.getStorage('idy_type') == 'work' && jigouList.areaList.length == 0){
		$api.setStorage('publishRangeContent',data.areaName);
		data.select = true;
	}
    var url = BASE_URL_ACTION + '/blog/getCategory?random_num=' + creatRandomNum() + '&business_type=7&business_id=' + data.org_id
     + '&business_iid=' + data.org_type + '&identity_id=' + $api.getStorage('identity');
	jigouList.areaList.push(data);
	getClassifyData(url,'jigou','获取市分类信息失败，请重试',data.org_id);
}

/**
 * 获取区分类 
 */
function getDistrictClassify(){
	var data = {
		'areaName':'本区',
		'org_type':'103',
		'org_id':$api.getStorage('district_id'),
		'select':false,
		'select_name':'',
	};
	if ($api.getStorage('idy_type') == 'work' && jigouList.areaList.length == 0){
		data.select = true;
		$api.setStorage('publishRangeContent',data.areaName);
	}
	var url = BASE_URL_ACTION + '/blog/getCategory?random_num=' + creatRandomNum() + '&business_type=7&business_id=' + data.org_id 
	+ '&business_iid=' + data.org_type + '&identity_id=' + $api.getStorage('identity');
    
	jigouList.areaList.push(data);
	getClassifyData(url,'jigou','获取区分类信息失败，请重试',data.org_id);
}

/**
 * 获取学校分类 
 */
function getSchoolClassify(){
	var data = {
		'areaName':'本校',
		'org_type':'104',
		'org_id':$api.getStorage('school_id'),
		'select':false,
		'select_name':'',
	};
	
	if ($api.getStorage('idy_type') != 'work' && $api.getStorage("identity") * 1 == 5){
		data.select = true;
		$api.setStorage('publishRangeContent',data.areaName);
	}
	
	var url = BASE_URL_ACTION + '/blog/getCategory?random_num=' + creatRandomNum() + '&business_type=7&business_id=' + data.org_id
	 + '&business_iid=' + data.org_type + '&identity_id=' + $api.getStorage('identity');
	
	jigouList.areaList.push(data);
	getClassifyData(url,'jigou','获取学校分类信息失败，请重试',data.org_id);
}

/**
 * 获取班级分类 
 */
function getClassClassify(){
	var url = BASE_URL_ACTION + '/blog_expand/get_class_bypersonid?random_num=' + creatRandomNum() + '&person_id=' + $api.getStorage('person_id') + '&identity_id=' + $api.getStorage('identity');
	getClassifyData(url,'class','获取班级分类信息失败，请重试');
}

/**
 * 获取群组分类 
 */
function getGroupClassify(){
	var url = BASE_URL_ACTION+'/blog_expand/get_group_bypersonid?random_num='+creatRandomNum()+'&person_id='+$api.getStorage("person_id")+'&identity_id='+$api.getStorage("identity");
	getClassifyData(url,'group','获取群分类组信息失败，请重试');
}

/** 
 * 获取个人分类 
 */
function getPersonalClassify(){
	api.ajax({
        url : BASE_URL_ACTION + '/ypt/blog/getCategory?person_id='+$api.getStorage("person_id")+'&identity_id='+$api.getStorage("identity")+'&business_type=1&business_id='+$api.getStorage("person_id")+'&business_iid='+$api.getStorage("identity")+'&level=2&random_num='+creatRandomNum(),
        method : 'get',
        timeout : 0,
        dataType : 'json',
        headers : {
    	'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
    	}
     }, function(ret, err) {
     	if(err){
        	popToast('获取个人分类失败，请稍后重试');
        }else{
            if(ret && ret.success){
            	personalList = ret;
            	$api.setStorage('personalClassifyId',personalList.list[0].id);
            	$api.setStorage('personalClassifyContent',personalList.list[0].name);//个人分类选中内容；
            	tempNum++;
            	afterGetClassifyData();
            }else{
                popToast('获取个人分类失败，请稍后重试');
            }
        }
    });
}

/**
 * 分类信息获取完毕后跳转界面 
 */
function afterGetClassifyData(){
	if (tempNum == totalNum){
		var allClassifyData = {'jigouList':jigouList,'classList':classList,'groupList':groupList,'personalList':personalList};
		$api.setStorage('allClassifyData',allClassifyData);
    	api.hideProgress();
    	openAddQuanziWindow();//打开添加圈子window
	}
}