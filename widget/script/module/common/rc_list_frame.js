var BASE_URL_ACTION;
BASE_URL_ACTION = $api.getStorage('BASE_URL_ACTION');
/*
*author:zhaoj
*function:打开日程详情页面
*date：20160116
*/
function openScheDetail(content,sTime,eTime){
	api.openFrame({
		name : 'rc_detail_frame',
		scrollToTop : true,
		allowEdit : true,
		url : '../../html/yingyong/rc_detail_frame.html',
		bgColor : 'rgba(0,0,0,0.5)',
		rect : {
			x : 0,
			y : 0,
			w : 'auto',
			h : api.winHeight,
		},
		pageParam : {
			date : date,
			content:content,
			sTime:sTime,
			eTime:eTime	
		},
		//页面是否弹动 为了下拉刷新使用
		bounces : false
	});
	api.execScript({
		name : 'rc_list_window',
		script : 'reBackType("detail");'
	});
}
/*
*author:zhaoj
*function:打开编辑日程页面Frame
*date：20160118
*/
function openScheEditFrame(content,start_day,start_time,end_day,end_time,id){
	//打开frame
	api.openFrame({
		name : 'rc_edit_frame',
		scrollToTop : true,
		allowEdit : true,
		url : '../../html/yingyong/rc_edit_frame.html',
		bgColor : '#ffffff',
		rect : {
			x : 0,
			y : header_h,
			w : 'auto',
			h : api.winHeight-header_h,
		},
		pageParam : {
			date : date,
			header_h:header_h,
			content:content,
			start_day:start_day,
			start_time:start_time,
			end_day:end_day,
			end_time:end_time,
			id : id
		},
		//页面是否弹动 为了下拉刷新使用
		bounces : false
	});
	api.execScript({
		name : 'rc_list_window',
		script : 'reBackType("edit");'
	});
}
/*
*author:zhaoj
*function:获取日程数据
*date：20160115
*/
function getScheDate(){
	var identity = parseInt($api.getStorage('identity'));
	if(identity == 5){
		var schedule_type ='teacher';
	}else if(identity == 6){
		var schedule_type ='student';
	}else{
		var schedule_type ='parent';
	}
	var person_id = parseInt($api.getStorage('person_id'));
	//var person_id = 30163;
	var data = {"list":[]};
	var specialData=[];
	api.ajax({
		url : BASE_URL_ACTION + '/space/getSchedule?schedule_type_id='+person_id+'&schedule_type='+schedule_type+'&random_num=' + creatRandomNum(),
		method : 'get',
		timeout : 30,
		dataType : 'json'
		}, function(ret, err) {
			//alert(JSON.stringify(ret));
			api.hideProgress();
			if(err){
				api.alert({
					msg : '对不起，获取日程失败'
                },function(ret,err){
                	//coding...
                });
			}else{
				if(ret.success) {
					var nDate = new Date();
					var nDate = Date.parse(new Date());
					for(var i=0; i<ret.schedule_list.length;i++){
						var index = ret.schedule_list[i].start_time.indexOf('T');
						var time = ret.schedule_list[i].start_time.substring(0,index);
						//获取设置日程的日期数据
						var timeParam = new Object();
						timeParam.date = time;
						specialData.push(timeParam);
						var initMonth =date[1] < 10 ? '0'+date[1]:date[1];
						var initDay =date[2] < 10 ? '0'+date[2]:date[2];
						var initDate = date[0]+'-'+initMonth+'-'+initDay;
						//获取当前日期的日程数据
						if(time == initDate){
							var param = new Object();
							var last_index = ret.schedule_list[i].start_time.length;
							var sTime=time+' '+ret.schedule_list[i].start_time.substring(index+1,last_index);
							var eIndex = ret.schedule_list[i].end_time.indexOf('T');
							var fLastIndex = ret.schedule_list[i].end_time.length;
							var fTime = ret.schedule_list[i].end_time.substring(0,eIndex)+' '+ret.schedule_list[i].end_time.substring(eIndex+1,fLastIndex);
							//检验是否是过期日程
							//var fDate = new Date(fTime);
							var fTimeDate = fTime.replace(/-/g,'\/');
							var fDate = Date.parse(new Date(fTimeDate));
							if(nDate < fDate){
								param.limit = 'noLimit';
							}else{
								param.limit = 'limit';
							}
							//检验是否没有开始的日程
							var sTimeDate = sTime.replace(/-/g,'\/');
							var sDate = Date.parse(new Date(sTimeDate));
							if(sDate > nDate){
								//没开始的日程
								isHaveNotice(ret.schedule_list[i].schedule_id,sTimeDate);
							}
							//检验是否是过期日程end
							param.show_start_time=ret.schedule_list[i].start_time.substring(index+1,last_index);
							param.start_day=time;
							param.start_time=ret.schedule_list[i].start_time.substring(index+1,last_index);
							param.end_day=ret.schedule_list[i].end_time.substring(0,eIndex);
							param.end_time=ret.schedule_list[i].end_time.substring(eIndex+1,fLastIndex);
							param.schedule_id=ret.schedule_list[i].schedule_id;
							param.title=Base64.decode(ret.schedule_list[i].title);
							param.encodeTitle = ret.schedule_list[i].title;
							param.startTime=sTime;
							param.endTime=fTime;
							data.list.push(param);
						}
					}
					//通知顶部下拉刷新数据加载完毕，组件会恢复到默认状态
					commonControlRefresh();
					var html_type = template.render('rc_script', data);
					$api.html($api.byId('rc_div'), html_type);
				} else {
					api.alert({
						msg : '对不起，获取日程失败'
	                },function(ret,err){
	                	//coding...
	                });
				}
			}
		
	});
}
/*
*author:zhaoj
*function:查询日程提醒数据
*date：20160123
*/
function isHaveNotice(schedule_id,sTimeDate){
	var person_id = parseInt($api.getStorage('person_id'));
	api.ajax({
		url : BASE_URL_ACTION + '/space/timetable/getTimeTableApp?person_id='+person_id+'&schedule_id='+schedule_id+'&random_num=' + creatRandomNum(),
		method : 'get',
		dataType : 'json',
		timeout : 30,
		cache : false,
		headers : {
			'Cookie' : 'person_id='+$api.getStorage("person_id")+';identity_id='+$api.getStorage("identity")+'; token='+$api.getStorage("token_ypt")+';'
		}
	}, function(ret, err) {
		api.hideProgress();
		if(err){
		}else{
			if(ret.success) {
				api.cancelNotification({
				    id: ret.notice_id
				});	
				deleteNotice(schedule_id);
			} else {
			}
		}
		var startDay = sTimeDate;
		var date=new Date(sTimeDate);//给定时间 
		var date=date.getTime();  //给定时间的毫秒数
		api.notification({
			    vibrate:[1000,2000],
			    notify: {
			        content: '日程提醒'
			    },
			    alarm: {
			        time:date
			    }
			}, function( ret, err ){
			    if( ret ){
			        var warn_value = ret.id;
					saveNotice(schedule_id,warn_value);	        
			    }else{
			         alert( JSON.stringify( err ) );
			    }
			});	
	});
}
/*
*author:zhaoj
*function:插入日程提醒数据
*date：20160123
*/
function saveNotice(schedule_id,notice_id){
	var person_id = parseInt($api.getStorage('person_id'));
	api.ajax({
		url : BASE_URL_ACTION + '/space/timetable/saveTimeTableApp',
		method : 'post',
		dataType : 'json',
		timeout : 30,
		cache : false,
		data : {
			values : {
				"person_id" : person_id,
				"schedule_id" : schedule_id,
				"notice_id" : notice_id
			}
		},
		headers : {
			'Cookie' : 'person_id='+$api.getStorage("person_id")+';identity_id='+$api.getStorage("identity")+'; token='+$api.getStorage("token_ypt")+';'
		}
	}, function(ret, err) {
	});
}
/*
*author:zhaoj
*function:删除日程
*date：20160116
*/
function deleteSche(schedule_id,content){
	if(delete_flag){
		delete_flag = false;
		if(content.length >10){
			content = Base64.decode(content).substring(0,9)+'..."';
		}else{
			content = Base64.decode(content)+'"';
		}
		var tip = '是否删除"'+content+'这条日程?'
		api.confirm({
		    title: '提示',
		    msg: tip,
		    buttons: ['是','否']
		},function( ret, err ){
		    if( ret.buttonIndex == 1 ){
		         //获取缓存中日程通知栏提醒数据,并根据id值去除特定的提醒
		        getNotice(schedule_id);
				var identity = parseInt($api.getStorage('identity'));
				if(identity == 5){
					var schedule_type ='teacher';
				}else if(identity == 6){
					var schedule_type ='student';
				}else{
					var schedule_type ='parent';
				}
				var person_id = parseInt($api.getStorage('person_id'));
				api.ajax({
					url : BASE_URL_ACTION + '/ypt/space/delSchedule?schedule_type_id='+person_id+'&schedule_type='+schedule_type+'&schedule_id='+schedule_id+'&random_num=' + creatRandomNum(),
					method : 'get',
					timeout : 30,
					dataType : 'json',
					headers : {
						'Cookie' : 'person_id='+$api.getStorage("person_id")+';identity_id='+$api.getStorage("identity")+'; token='+$api.getStorage("token_ypt")+';'
					}
				}, function(ret, err) {
					api.hideProgress();
					if(err){
						api.alert({
							msg : '对不起，删除日程失败'
		                });
					}else{
						if(ret.success) {
							getScheDate();
							api.toast({
							    msg: '日程删除成功',
							    duration: 2000,
							    location: 'middle'
							});
							delete_flag = true;
						} else {
							api.alert({
								msg : '对不起，删除日程失败'
			                });
						}
					}
				});
		    }else if(ret.buttonIndex == 2){
		    	delete_flag = true;
		    }else{
		    	delete_flag = true;
		    	//alert( JSON.stringify( err ) );
		    }
		});
	}
}
/*
*author:zhaoj
*function:查询日程提醒数据
*date：20160123
*/
function getNotice(schedule_id){
	var person_id = parseInt($api.getStorage('person_id'));
	api.ajax({
		url : BASE_URL_ACTION + '/space/timetable/getTimeTableApp?person_id='+person_id+'&schedule_id='+schedule_id+'&random_num=' + creatRandomNum(),
		method : 'get',
		dataType : 'json',
		timeout : 30,
		cache : false,
		headers : {
			'Cookie' : 'person_id='+$api.getStorage("person_id")+';identity_id='+$api.getStorage("identity")+'; token='+$api.getStorage("token_ypt")+';'
		}
	}, function(ret, err) {
		api.hideProgress();
		if(err){}else{
			if(ret.success) {
				api.cancelNotification({
				    id: ret.notice_id
				});	
				deleteNotice(schedule_id);
			} else {
			}
		}
	});
}
/*
*author:zhaoj
*function:删除日程提醒数据
*date：20160123
*/
function deleteNotice(schedule_id){
	var person_id = parseInt($api.getStorage('person_id'));
	api.ajax({
		url : BASE_URL_ACTION + '/space/timetable/deleteTimeTableApp',
		method : 'post',
		dataType : 'json',
		timeout : 30,
		cache : false,
		data : {
			values : {
				"person_id" : person_id,
				"schedule_id" : schedule_id
			}
		},
		headers : {
			'Cookie' : 'person_id='+$api.getStorage("person_id")+';identity_id='+$api.getStorage("identity")+'; token='+$api.getStorage("token_ypt")+';'
		}
	}, function(ret, err) {
	});
}

/*
*author:zhaoj
*function:已进入app就没有提醒的添加提醒
*date：20160115
*/
function reloadAddNotice(){
	isOnLineStatus(function(is_true, line_type) {
		if (is_true) {
			var identity = parseInt($api.getStorage('identity'));
			if(identity == 5){
				var schedule_type ='teacher';
			}else if(identity == 6){
				var schedule_type ='student';
			}else{
				var schedule_type ='parent';
			}
			var person_id = parseInt($api.getStorage('person_id'));
			api.ajax({
				url : BASE_URL_ACTION + '/space/getSchedule?schedule_type_id='+person_id+'&schedule_type='+schedule_type+'&random_num=' + creatRandomNum(),
				method : 'get',
				timeout : 30,
				dataType : 'json'
				}, function(ret, err) {
					api.hideProgress();
					if(err){
					
					}else{
						if(ret.success) {
							var nDate = new Date();
							var nDate = Date.parse(new Date());
							for(var i=0; i<ret.schedule_list.length;i++){
								var index = ret.schedule_list[i].start_time.indexOf('T');
								var last_index = ret.schedule_list[i].start_time.length;
								var time = ret.schedule_list[i].start_time.substring(0,index);
								var sTime=time+' '+ret.schedule_list[i].start_time.substring(index+1,last_index);
								//检验是否没有开始的日程
								var sTimeDate = sTime.replace(/-/g,'\/');
								var sDate = Date.parse(new Date(sTimeDate));
								if(sDate > nDate){
									//没开始的日程
									isHaveNotice(ret.schedule_list[i].schedule_id,sTimeDate);
								}
							}
						} else {
						}
					}
				
			});
		} else {
		}
	});
}