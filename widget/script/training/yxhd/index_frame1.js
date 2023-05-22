	var is_bx=1;
    var bx_number=1;
    var xx_number=1;
    var header_h;
    var person_id=$api.getStorage("person_id");
	var currentPage=1;
	var lx_id=0;
	var identity;
	var BASE_URL_ACTION;
	var totalPages=1;
    apiready = function(){
       commonSetTheme({"level":5,"type":0});
       header_h=api.pageParam.header_h;
       api.showProgress({
				title : '加载中...',
				text : '请稍候...',
				modal : false
			});
		BASE_URL_ACTION = $api.getStorage('BASE_URL_ACTION');
		identity = $api.getStorage('identity');
		
		//打开滑动条
			if(api.pageParam.showProgress){
				openNavigationBar();
			}
			initHdStatusParam();
			//下拉刷新
			refreshDataInfo();
			//上拉加载数据
			scrollBottomReload();
			loadData(lx_id, 1, true);
      /* */
       
		
    };
    function refreshDataInfo() {
			//绑定下拉刷新历史会话事件
			api.setRefreshHeaderInfo({
				visible : true,
				loadingImg : 'widget://image/local_icon_refresh.png',
				bgColor : '#F0F0F0',
				textColor : '#8E8E8E',
				textDown : '下拉加载更多...',
				textUp : '松开加载...',
				showTime : true
			}, function(ret, err) {
				loadData(lx_id, 1, true);
			});
		}
    function initHdStatusParam(){
	//获取活动状态
	template.helper("getHdStatus", function(start_time,end_time){
		var date = new Date();
		var start_date = new Date(start_time.replace(/-/g,"/"));
		var end_date = new Date(end_time.replace(/-/g,"/"));
		var status = '';
		if(date.getTime() < start_date.getTime()){
			status = " <i class='aui-text-success' style='color:green'>[未开始]</i>&nbsp";
		}else if(date.getTime() > end_date.getTime()){
			status = "<i class='aui-text-success' style='color:red'>[已结束]</i>";
		}else{
			status = "<i class='aui-text-success' style='color:red'>[进行中]</i>";
		}
		return status;
	});
	
}
   /**
		 * 打开滑动
		 * 
		 * 2015.11.21
		 */
		function openNavigationBar() {
			getJsQueryRange(function(is_true, data) {
				if (is_true) {
					openNavigationBarToHtml(data.list);
				} else {
					api.hideProgress();
					api.toast({
						msg : data
					});
				}
			});
		}
		
		/**
		 * 打开menu列表
		 * 周枫
		 * 2016.1.13
		 */
		function openNavigationBarToHtml(bar_list) {
		commonCloseNavigationBar();
			var bar_items = [];
			for (var i = 0; i < bar_list.length; i++) {
				var arr = {
					title : bar_list[i].subject_name,
					titleSelected : bar_list[i].subject_name,
					bg : "#ffffff",
					alpha : 0.8,
					bgSelected : "#ffffff"
				}
				bar_ids.push(bar_list[i].subject_id);
				bar_items.push(arr);
			}
			
			var params = {
				h : 45,
				y : header_h+50,
				items : bar_items,
				winName:'index_window',
				frameName:'index_frame'
			};
			commonMyNavigationBar(params);
		}

		function callBackNew(id,index) {
			var bar_index = index;
			n_id = id;
			currentPage = 1;
			lx_id = bar_ids[bar_index];
			loadData(lx_id, currentPage, true);
		}
		/**
		 * 获取群组
		 * 
		 * 2017.7.7
		 */
		function getJsQueryRange(callback) {
			
				api.ajax({
					url : BASE_URL_ACTION + '/yx/hd/hdlxList',
					method : 'get',
					dataType : 'json',
					headers : {
						'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
					}
				}, function(ret, err) {
					if (ret) {
						if (ret.status == false) {
							callback(false, '获取研修活动类型失败');
						} else {
							//最终渲染数组
							var bar_items = [];
							var bar_items_json = {};
							//范围数组
							var org_list_attr = [];
							var org_list_attr = ret.list;
							var org_list_attr_l = org_list_attr.length;
							if (org_list_attr_l != 0) {
								for (var i = 0; i < org_list_attr_l; i++) {
									var org_item_json = {};
									org_item_json["subject_id"] = org_list_attr[i].lx_id;
									org_item_json["subject_name"] = org_list_attr[i].lx_name;
									bar_items[i] = org_item_json;
								}
							}
							
							bar_items_json["success"] = true;
							bar_items_json["list"] = bar_items;
							callback(true, bar_items_json);
						}
					} else {
						callback(false, '获取研修活动类型失败');
					}
				});
			
		}
		/**
		 * 加载活动
		 * 
		 * 2017.7.10
		 */
		function loadData(lx_id, currentPage, isReload) {
			api.showProgress({
				title : '加载中...',
				modal : false
			});
				currentPage = isReload ? 1 : currentPage;
				
				//获取
				api.ajax({
					url : BASE_URL_ACTION + '/yx/hd/getOrgHdList',
					method : 'post',
					dataType : 'json',
					cache : false,
					data : {
						values : {
							"page" : true,
							"page_number" : currentPage,
							"page_size" : 12,
							"lx_id" : lx_id,
							"stage_id" : 0,
							"subject_id" : 0,
							"page_size" : 12,
							"org_id":"99999"
						}
					},
					headers : {
						'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
					}
				}, function(ret, err) {
					if (ret.success == "true") {
							totalPages = ret.total_page;
							var html_type = template.render('zblist_script', ret);
							//alert(html_type);
							if(ret.list.length&&ret.list.length>0){
							if (currentPage == 1) {
								document.getElementById('aui-waterfall').innerHTML = html_type;
							} else {
								$api.append($api.byId('aui-waterfall'), html_type);
							}
							}else{
								document.getElementById('zblist_div').innerHTML ='<div style="width:100%;text-align:center;margin-top:15px;"><span>暂无活动</span></div>';
							}
							$aui.waterfall($api.byId("aui-waterfall"), {
								col : 2, //列数
								padding : 5, //容器内边距
								space : 5//列间距
							});
							//延迟加载图片
							setTimeout(function() {
								echoInit();
							}, 300);
						
						//						//通知顶部下拉刷新数据加载完毕，组件会恢复到默认状态
						//						api.refreshHeaderLoadDone();
						api.hideProgress();
					}else{
						api.hideProgress();
						api.toast({
						msg : '获取活动失败，请稍候再试！',
						location : 'middle'
						});
						
					}
				});
			
		}
		/**
		 * 上拉刷新页面数据
		 * 
		 * 2015.11.24
		 */
		function scrollBottomReload() {
			//下移到底部：
			api.addEventListener({
				name : 'scrolltobottom',
				extra : {
					threshold : 100 //设置距离底部多少距离时触发，默认值为0，数字类型
				}
			}, function(ret, err) {
				if ((currentPage + 1) <= totalPages) {
					loadData(lx_id, currentPage + 1, false);
					currentPage = currentPage + 1;
					// 页码+1
				} else {
					api.toast({
						msg : '已加载全部数据',
						location : 'bottom'
					});
				}
			});
		}
		/**
		 * 打开高百特对应活动的会议
		 * 张檬
		 * 2017.7.12
		 */
		function initMeeting(start_time,end_time,hd_id){
			var date = new Date();
			var start_date = new Date(start_time.replace(/-/g,"/"));
			var end_date = new Date(end_time.replace(/-/g,"/"));
			if(date.getTime() < start_date.getTime()||date.getTime() > end_date.getTime()){
				api.alert({
				    msg: '活动未在进行中。',
				}, function(ret, err) {
				
				});
			}else{
				//获取
				api.ajax({
					url : BASE_URL_ACTION + '/yx/hd/findHdById',
					method : 'post',
					dataType : 'json',
					cache : false,
					data : {
						values : {
							"id" : hd_id
						}
					},
					headers : {
						'Cookie' : 'person_id=' + $api.getStorage("person_id") + '; identity_id=' + $api.getStorage("identity") + '; token=' + $api.getStorage("token_ypt") + ';'
					}
				}, function(ret, err) {
					 if(ret){ 
					// var uri='"air.com.gobetter.imeeting:115.28.233.30:7921:'+$api.getStorage("person_name")+':'+ret.con_pass+':'+ret.hd_confid+'":root';
					var uri='gobetter://air.com.gobetter.imeeting/115.28.233.30/'+ret.hd_confid+'/'+$api.getStorage("person_name")+'/'+ret.con_pass+'/1';//"air.com.gobetter.imeeting:115.28.233.30:7921:'+$api.getStorage("person_name")+':123456:114767":root';
					 var person_id=$api.getStorage("person_id");
					 if(person_id==ret.person_id){
					var uri='gobetter://air.com.gobetter.imeeting/115.28.233.30/'+ret.hd_confid+'/'+$api.getStorage("person_name")+'/dsidealqyjh/1';//"air.com.gobetter.imeeting:115.28.233.30:7921:'+$api.getStorage("person_name")+':123456:114767":root';

					 }
					 //alert(uri);
					 if(api.systemType == 'android'){
				            api.appInstalled({
				            appBundle: 'air.com.gobetter.imeeting'
				        },function(ret, err){
				            if(ret.installed){
				            	
					 			api.openApp({
							    androidPkg: 'android.intent.action.VIEW', 
							    uri: uri
							}, function(ret, err) {
							    if (ret) {
							       // alert("ret"+JSON.stringify(ret));
							    } else {
							       api.alert({
				                    msg: '打开高百特会议系统失败，请联系管理员',
				                    buttons: ['确定']
				                	});
							    }
							});
				            }else{
				                api.alert({
				                    msg: '未发现相应程序，请安装高百特会议系统',
				                    buttons: ['确定']
				                });
				            }
				        });
				}
				/*api.openApp({
					 	androidPkg: "android.intent.action.VIEW",
				        mimeType: "text/html",
				        uri: uri
					}, function(ret, err) {
					    if (ret) {
					        alert("ret"+JSON.stringify(ret));
					    } else {
					    alert("err"+JSON.stringify(err));
					        api.alert({
							    msg: '请先安装高百特手机端程序。',
							}, function(ret, err) {
							
							});
					    }
					});*/
					}else{
						api.alert({
							    msg: '获取活动发生异常。',
							}, function(ret, err) {
							
						});
					}
				});
				
			}
		}
		