
var currentPage = 1;//当前分页数
var totalPages = 0;//总页数
var totalData = 0;//定义一个变量存储第一次加载返回来的总记录数
var header_h = 0;//定义头高度
var org_type = 102;//定义区域类型，104学校，105班级
var org_id = 0; //定义区域id，学校id或班级id
var org_name = '';
var picture_sz = [];
var list_url = '';
var isBackTop = false;
/**
 *界面初始构建时获取数据 
 * @param {Object} current_page：当前页数
 * @param {Object} url：接口地址
 */
function initData(current_page,url,isRefresh){
	api.removeEventListener({name : 'scrolltobottom'});
	api.showProgress({
		title : '加载中',
		text : '请稍候...',
		modal : false
	});
	currentPage = current_page;
	if (list_url == '') {
		org_type = $api.getStorage('org_level');
		if (org_type <= 101) {
			org_id = $api.getStorage('province_id');
		}else if ($api.getStorage('city_id') && $api.getStorage('city_id') != 0 && org_type == 102) {
			org_id = $api.getStorage('city_id');
		}else if ($api.getStorage('district_id') && $api.getStorage('district_id') != 0 && org_type == 103) {
			org_id = $api.getStorage('district_id');
		}
		list_url = BASE_URL_ACTION + '/blog/orgArticleList?' + 'search_type=title&pagesize=' + BASE_PAGE_SIZE +
		 '&random_num=' + creatRandomNum() + "&identity_id=" + $api.getStorage('identity') + '&org_id=' + org_id + '&org_type='
		  + org_type + '&business_type=7';
	}

	isBackTop = false;
	if (url && url != "") {
		list_url = url;
		isBackTop = true;
	}
	if (!isRefresh && current_page * 1 == 1){
		isBackTop = true;
	}
	getQZListData(list_url); 
}

/**
 *获取圈子列表 
 */
function getQZListData(url){
	list_url = url;
	var screenSetData = $api.getStorage('screenSetData');
	if (screenSetData){
		org_type = screenSetData.org_type;
	}
	api.showProgress({
		title : '加载中',
		text : '请稍候...',
		modal : true
	});
	
	api.ajax({
    	url : url + '&pagenum=' + currentPage,
		method : 'get',
		timeout : 30,
		dataType : 'json',
		headers : {
			'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
		}
    },function (ret,err){
    	if(err){
    		popToast('获取圈子信息失败，请稍候重试');
    		$api.css($api.byId('no_quanzi'),'display:block');
    		$api.css($api.byId('quanzi_div'),'display:none');
    	}else{
    		if(ret.success){
    			totalData = ret.total_row;
				totalPages = ret.total_page;
    			if(ret.list.length > 0){
    				var index_del = 0;//记录被删除的消息个数
    				var list = ret.list;
    				for(var i=0;i<list.length;i++){
    					var thumbs_id = [];
    					var open_thumbs_id = [];
    					if(ret.list[i].thumb_ids != '[]'){
    						ret.list[i].thumb_ids = ret.list[i].thumb_ids.substring(1,ret.list[i].thumb_ids.length-1);
    						thumbs_id = ret.list[i].thumb_ids.split(",");
							for(var j=0;j<thumbs_id.length;j++){
								var text_str = 'dsideal_yy';
								if(thumbs_id[j].indexOf(text_str)!=-1){
									if(BASE_APP_TYPE == 1){
										open_thumbs_id[j] = thumbs_id[j].substring(1,thumbs_id[j].length-1);
										thumbs_id[j] =  thumbs_id[j].substring(1,thumbs_id[j].length-1);	 							
									}else{
										open_thumbs_id[j] = BASE_URL_ACTION + BASE_IMAGE_BEGIN + thumbs_id[j].substring(thumbs_id[j].indexOf("Material")+9,thumbs_id[j].length-1);
										thumbs_id[j] = BASE_URL_ACTION + BASE_IMAGE_BEGIN + thumbs_id[j].substring(thumbs_id[j].indexOf("Material")+9,thumbs_id[j].length-1)+ commonReturnPhotoCutSize(0,0,0,thumbs_id[j].substring(thumbs_id[j].length-5,thumbs_id[j].length-1));
									}
								}else{
									open_thumbs_id[j] =thumbs_id[j].substring(1,thumbs_id[j].length-1);
									thumbs_id[j] =thumbs_id[j].substring(1,thumbs_id[j].length-1);
								}
								if(open_thumbs_id[j].indexOf('glyphicon-paperclip-org.png')!=-1){
									open_thumbs_id[j]=-1;
								}
							}
        				}
        				
    					ret.list[i].thumb_ids = thumbs_id;
    					ret.list[i].open_thumbs_id = open_thumbs_id;
    					ret.list[i].curPage = currentPage;
    					var param = new Object();
    					param.open_thumbs_id = open_thumbs_id;
    					picture_sz.push(param);
						if(list[i].is_del*1){//判断消息是否别删除，不显示已删除的消息
							ret.list[i].is_del = true;
							index_del++;
						}else{
							ret.list[i].is_del = false;
							
						}
						
//						var screenSetData = $api.getStorage('screenSetData');
//						if (screenSetData && screenSetData.partIndex == 0){
//							ret.list[i].avatar_fileid = $api.getStorage('avatar_url');
//						}
//						else{
							if(BASE_APP_TYPE == 1){
								ret.list[i].avatar_fileid = BASE_IMAGE_PRE + url_path_suffix + ret.list[i].avatar_fileid.substring(0, 2) + "/" +ret.list[i].avatar_fileid + commonReturnPhotoCutSize(1,96,96,ret.list[i].avatar_fileid.substring((ret.list[i].avatar_fileid.length)-3),0);
							}else{
								ret.list[i].avatar_fileid = BASE_URL_ACTION + BASE_IMAGE_BEGIN + ret.list[i].avatar_fileid.substring(0, 2) + "/" + ret.list[i].avatar_fileid + commonReturnPhotoCutSize(1,96,96,ret.list[i].avatar_fileid.substring((ret.list[i].avatar_fileid.length)-3),0);
							}
//						}
						
    					if(i==(ret.list.length-1)){//判断循环是否执行完，执行完再渲染页面
    						if(index_del == list.length && currentPage == 1){
								$api.css($api.byId('no_quanzi'),'display:block');
								$api.css($api.byId('quanzi_div'),'display:none');
    						}else{
    							commonAddManyHtml('quanzi_div','quanzi_script',ret);
    							$api.css($api.byId('no_quanzi'),'display:none');
    							$api.css($api.byId('quanzi_div'),'display:block');
    						//延迟加载图片
							setTimeout(function() {
								echoInit();
							}, 300);	
    						}
    					}
					}
				}else{
					$api.css($api.byId('no_quanzi'),'display:block');
					$api.css($api.byId('quanzi_div'),'display:none');
				}
			}else{
				popToast('获取圈子信息失败，请稍候重试');
			}
		}
		//通知顶部下拉刷新数据加载完毕，组件会恢复到默认状态
		commonControlRefresh();
		api.hideProgress();
		if (isBackTop){
			$api.byId("j_body").scrollTop = 0;
		}
		commonScrollBottomReload();
	});
}
