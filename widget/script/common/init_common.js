/**
 * 获取机构分类数据
 * 周枫
 * 2016.02.28
 */
function getCateGory(callback) {
	var type_url = BASE_URL_ACTION + '/blog/getCategory?';
	if(org_type == 0){
		type_url = type_url + 'business_id=1&business_type=1&level=1&identity_id=' + $api.getStorage('identity') + '&random_num=' + creatRandomNum();
	}else if(org_type == 1){
		type_url=type_url+'person_id='+$api.getStorage("person_id")+'&identity_id='+$api.getStorage("identity")+'&business_type=1&business_id='+$api.getStorage("person_id")+'&business_iid='+$api.getStorage("identity")+'&level=2&random_num='+creatRandomNum();
	}else if(org_type == 101 || org_type == 102|| org_type == 103|| org_type == 104){
		if(type == 1){
			//教师
			type_url = type_url + 'business_id=1&business_type=1&level=1&identity_id=5&random_num=' + creatRandomNum();
		}else if(type == 2){
			//学生
			type_url = type_url + 'business_id=1&business_type=1&level=1&identity_id=6&random_num=' + creatRandomNum();
		}else{
			type_url = type_url + 'business_id=1&business_type=1&level=1&identity_id=7&random_num=' + creatRandomNum();
		}
	}else if(org_type == 105){
		type_url = type_url + 'business_id='+org_id + '&person_id='+org_id + '&business_iid='+org_type+ '&identity_id=' + org_type + '&level='+1 + '&business_type='+3;
	}
	api.ajax({
		url : type_url,
		method : 'get',
		timeout : 30,
		dataType : 'json',
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		if (err) {
			api.hideProgress();
			callback(false, '获取文章分类失败');
		} else {
			if(ret.success){
				api.hideProgress();
				//最终渲染数组
				var bar_items = [];
				var bar_items_json = {};
				//范围数组
				var org_list_attr = [];
				var org_list_attr = ret.list;
				var org_list_attr_l = org_list_attr.length;
				var org_item_json = {};
				org_item_json["sequence"] = 0;
				org_item_json["name"] = '全部';
				bar_items[0] = org_item_json;
				if (org_list_attr_l != 0) {
					for (var i = 0; i < org_list_attr_l; i++) {
						var org_item_json = {};
						org_item_json["sequence"] = org_list_attr[i].id;
						org_item_json["name"] = org_list_attr[i].name;
						bar_items[i + 1] = org_item_json;
					}
				}
				bar_items_json["success"] = true;
				bar_items_json["list"] = bar_items;
				callback(true, bar_items_json);
			}else{
				api.hideProgress();
				callback(false, '获取文章分类失败');
			}
		}
	});
}
/**
 * 加载数据
 * 周枫
 * 2016.2.28
 */
function loadData(lx_id, current_page, isReload,tip_text) {
	if(tip_text != "" && current_page == 1){
		showSelfProgress(tip_text);
	}
	currentPage = isReload ? 1 : current_page;
	var listUrl = getListUrl(lx_id);
	api.ajax({
		url : listUrl,
		method : 'get',
		timeout : 30,
		dataType : 'json',
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
	}, function(ret, err) {
		api.hideProgress();
		if (err) {
			noData();
		} else {
			if(ret.success){
				api.hideProgress();
				totalData = ret.total_row;
				totalPages = ret.total_page;
				if (isReload) {
					// 重新设置为1
					currentPage = 1;
				}
				var wz_list = ret.list;
				var wz_list_l = getJsonObjLength(wz_list);
				if (wz_list_l > 0) {
					for (var i = 0; i < wz_list_l; i++) {
						var wz_thumb_id = wz_list[i].thumb_id;
						var wz_thumb_url = '';
						if (BASE_APP_TYPE == 1) {
							if (wz_thumb_id.indexOf('/dsideal_yy') != -1) {
								var key = url_path_down+url_path_suffix;
								var key_re = BASE_IMAGE_PRE+url_path_suffix;
								wz_thumb_url = wz_thumb_id.replaceAll(key, key_re);
								wz_thumb_url = wz_thumb_url+commonReturnPhotoCutSize(0);
							}else{
								wz_thumb_url = wz_thumb_id;
							}
						}else{
							var key = '/dsideal_yy';
							if (wz_thumb_id.indexOf(url_path_suffix) != -1) {
								wz_thumb_id = wz_thumb_id.replaceAll(url_path_suffix, BASE_IMAGE_PRE);
							}
							if (wz_thumb_id.indexOf(key) != -1) {
								var key_re = BASE_URL_ACTION;
								var wz_thumb_file = wz_thumb_id.replaceAll(key, key_re);
								wz_thumb_url = wz_thumb_file+commonReturnPhotoCutSize(0);
							}else{
								wz_thumb_url = wz_thumb_id
							}
						}
						wz_list[i]["wz_thumb_url"] = wz_thumb_url;
						wz_list[i]["title_base64"] = Base64.encode(wz_list[i].title);
					}
				}
				addAriticleListHtml(currentPage,ret);
				if(org_type == 1){
					//我的文章,右划按钮初始化
					api.parseTapmode();
					swipe = new ListSwipe();
				}
				//延迟加载图片
				setTimeout(function() {
					echoInit();
				}, 300);
			}else{
				noData();
			}
		}
	});
	//通知顶部下拉刷新数据加载完毕，组件会恢复到默认状态
	commonControlRefresh();
}
/*
*author:zhaoj
*function:获取文章的url
*date：20160425
*/
function  getListUrl(lx_id){
	var list_url;
	if(org_type == 0 ||org_type == 101 || org_type == 102|| org_type == 103){
		list_url = BASE_URL_ACTION + '/blog/orgArticleList?';
	}else if(org_type == 105){
		//班级
		list_url = BASE_URL_ACTION + '/blog_expand/list_article_expand?';
	}else if(org_type == 104){
		//学校文章
		list_url = BASE_URL_ACTION + '/blog/orgArticleList?';
	}else{
		list_url = BASE_URL_ACTION + '/blog/search?';
	}
	//查询类型（title，content）
	list_url = list_url + 'search_type=title';
	if(org_type == 1){
		//我的文章
		list_url = list_url + '&org_id=' + $api.getStorage('school_id')+ '&org_type=' + 104 + '&person_id=' + $api.getStorage('person_id')+ '&pagenum=' + currentPage+ '&pagesize=' + BASE_PAGE_SIZE+ '&business_type=1'+ '&identity_id=' + $api.getStorage('identity')+ '&random_num=' + creatRandomNum();
	}else if(org_type == 101 || org_type == 102|| org_type == 103){
		//机构文章
		if(type == 1){
			//教师
			list_url = list_url + '&org_id=' + org_id + '&org_type=' + org_type + '&business_type=1&tab_type=&identity_id=5' + '&pagenum=' + currentPage + '&pagesize=' + BASE_PAGE_SIZE +  '&random_num=' + creatRandomNum();
		}else if(type == 2){
			//学生
			list_url = list_url + '&org_id=' + org_id + '&org_type=' + org_type + '&business_type=1&tab_type=&identity_id=6' + '&pagenum=' + currentPage + '&pagesize=' + BASE_PAGE_SIZE +  '&random_num=' + creatRandomNum();
		}else{
			//家长
			list_url = list_url + '&org_id=' + org_id + '&org_type=' + org_type + '&business_type=1&tab_type=&identity_id=7' + '&pagenum=' + currentPage + '&pagesize=' + BASE_PAGE_SIZE +  '&random_num=' + creatRandomNum();
		}
	}else if(org_type == 105){
		if(type == 1){
			list_url = list_url + '&business_id=' + org_id + '&business_type=3&identity_id=5' + '&business_iid=' + org_type + '&pagenum=' + currentPage + '&pagesize=' + BASE_PAGE_SIZE+  '&random_num=' + creatRandomNum();
		}else if(type == 2){
			list_url = list_url + '&business_id=' + org_id + '&business_type=3&identity_id=6' + '&business_iid=' + org_type + '&pagenum=' + currentPage + '&pagesize=' + BASE_PAGE_SIZE+  '&random_num=' + creatRandomNum();
		}else{
			list_url = list_url + '&business_id=' + org_id + '&business_type=3&identity_id=7' + '&business_iid=' + org_type + '&pagenum=' + currentPage + '&pagesize=' + BASE_PAGE_SIZE+  '&random_num=' + creatRandomNum();
		}
	}else if( org_type == 104){
		//学校文章
		if(type == 1){
			//教师
			list_url = list_url + '&org_id=' + org_id + '&org_type=' + org_type + '&business_type=1&tab_type=&identity_id=5' + '&pagenum=' + currentPage + '&pagesize=' + BASE_PAGE_SIZE +  '&random_num=' + creatRandomNum();
		}else if(type ==2){
			//学生
			list_url = list_url + '&org_id=' + org_id + '&org_type=' + org_type + '&business_type=1&tab_type=&identity_id=6' + '&pagenum=' + currentPage + '&pagesize=' + BASE_PAGE_SIZE +  '&random_num=' + creatRandomNum();
		}else{
			//家长
			list_url = list_url + '&org_id=' + org_id + '&org_type=' + org_type + '&business_type=1&tab_type=&identity_id=7' + '&pagenum=' + currentPage + '&pagesize=' + BASE_PAGE_SIZE +  '&random_num=' + creatRandomNum();
		}
	}else{
		list_url = list_url + '&pagenum=' + currentPage+ '&pagesize=' + BASE_PAGE_SIZE+ '&business_type=1';
	}
	if (lx_id != 0) {
		list_url = list_url + '&category_id=' + lx_id;
	}
	if (keyword != '') {
		list_url = list_url + '&search_key=' + keyword;
	}
	return list_url;
}
/*
*author:zhaoj
*function:没有文章
*date：20160425
*/
function  addAriticleListHtml(currentPage,data){
	var html_type = template.render('wzlist_script', data);
	if (currentPage == 1) {
		document.getElementById('wzlist_div').innerHTML = html_type;
	} else {
		$api.append($api.byId('wzlist_div'), html_type);
	}
}
/*
*author:zhaoj
*function:没有文章
*date：20160425
*/
function  noData(){
	api.hideProgress();
	var data = {"list":[]};
	var html_type = template.render('wzlist_script', data);
	document.getElementById('wzlist_div').innerHTML = html_type;
}
/**
 * 获取任课计划和班主任对应班级列表
 * query_type 0：班主任， 1：任课计划，2：全部
 * 周枫
 * 2016.4.7 
 */
function loadClassListData(callback){
	api.ajax({
		url : $api.getStorage('BASE_URL_ACTION') + '/class/getClassByPersonIDIdentityID',
		method : 'get',
		dataType : 'json',
		data : {
			values : {
				"person_id" : $api.getStorage('person_id'),
				"identity_id" : $api.getStorage('identity'),
				"query_type" : 2
			}
		}
	}, function(ret, err) {
		if(err) {
			callback(false, '获取班级列表失败')
		} else {
			if(ret.success){
				callback(true, ret.list)
			} else {
				callback(false, '获取班级列表失败')
			}
		}
	});
}
/*
*author:zhaoj
*function:删除文章
*date：20160323
*/
function deleteArticle(id,category_id,expand_id){
	var ids;
	if(BASE_URL_ACTION == 'http://218.62.27.194:8088/dsideal_yy'){
		ids =[{"id":id,"category_id":category_id}];
	}else{
		ids =[{"id":id,"category_id":category_id,"expand_id":expand_id}];
	}
	api.ajax({
		url : BASE_URL_ACTION + '/blog/deleteArticle',
		method : 'post',
		dataType : 'json',
		cache : false,
		data : {
			values : {
				"random_num":creatRandomNum(),
	            "ids": JSON.stringify(ids)
			}
		},
		headers : {
			'Cookie' : 'person_id='+$api.getStorage("person_id")+';identity_id='+$api.getStorage("identity")+'; token='+$api.getStorage("token_ypt")+';'
		}
	}, function(ret, err) {

		api.hideProgress();
		if(err){
            popToast('删除失败');
		} else {
			if(ret.success) {	
				deleteWz();
			} else {
				popToast('删除失败');
			}
		}
		
		
	});
}