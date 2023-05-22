var number = 1;
//填充列表
function fillscore() {
	var pxbName = $api.trim($api.val($api.byId("pxbscore_name")));
	var data = {
		pxbName : pxbName,
		page_number : 1,
		page_size : 15,
		person_id : $api.getStorage('person_id')
	};
	findscore(data, 'init');
}

//查询成绩
function findscore(data, init) {
	isOnLineStatus(function(is_online, line_type) {
		if (is_online) {
			api.showProgress({
				title : '加载中...',
				text : '请稍候...',
				modal : false
			});
			api.ajax({
				url : path_url + '/yx/yd/myScoreList',
				method : 'post',
				timeout : 30,
				cache : false,
				dataTpye : 'json',
				data : {
					values : data
				}
			}, function(ret, err) {
				if (ret) {
					var urlJson = JSON.stringify(ret);
					var txt = $api.strToJson(urlJson);
					var kcDiv = $api.byId("kcDiv");
					//alert("kcDiv==="+kcDiv);
					if (init == 'init') {
						$api.html(kcDiv, '');
					}
					
					if (txt.list.length != 0) {
					   var kctmep=document.getElementById('kcDiv').innerHTML.replace(/<.+?>/gim,'');
					   //看看kcDiv里边有什么
					   if(kctmep=="暂无培训班信息"){
							  $api.html(kcDiv, '');
							}
					}
					
					for (var i = 0; i < txt.list.length; i++) {
						var kisa = txt.list[i].pxb_guoqi;
						//alert(kisa);
						if (kisa == 0 || kisa == '0') {
							kisa = "未过期";
						} else {
							kisa = "已过期";
						}
						var xuefen = "未评";
						if (null != txt.list[i].xfOfPerson && "" != txt.list[i].xfOfPerson.toString().trim()) {
							xuefen = txt.list[i].xfOfPerson
						}
						var index = Math.ceil(Math.random() * 9);
						var html = '<a href="javascript:void(0);" class="item Fix hightitem" tapmode onclick="openCourse(' + txt.list[i].pxb_id + ',\'' + txt.list[i].pxb_name + '\',' + txt.list[i].pxb_type + ');">' + '<div class="cnt">' + '<img class="pic" src="../../../image/training/jsyx/px_s' + index + '.jpg">' + '<div class="wrap">' + '<div class="wrap2">' + '<div class="content">' + '<div class="shopname">' + txt.list[i].pxb_name + '</div>' + '<div class="comment">' + '<span>是否过期 ：' + kisa + '</span>' + '</div>' + '<span class="classify">' + '学分/总学分：' + xuefen + '/' + txt.list[i].pxb_xf + '</span>' + '</div>' + '</div>' + '</div>' + '</div>' + '</a>';
						$api.append(kcDiv, html);
					}
					api.hideProgress();
					if (txt.list.length == 0) {//说明没查出信息，需要判断原有div里边是否有信息，如果有，那么什么都不做，如果没有，加上没有培训班的提示信息。
						var n = document.getElementById("kcDiv").innerHTML;
						if (n == null || n == "") {
							$api.append(kcDiv, "<div align='center' style='margin-top:50px;'><h3>暂无培训班信息</h3></div>");					
						} else {
							api.toast({
								msg : '已加载所有数据',
								duration : 2000,
								location : 'middle'
							});
						}
					}
				} else {
					errCode(err.code);
				}
			});
		}else {
			api.toast({
					    msg: '网络连接失败，请检查您的网络设置',
					    duration:2000,
					    location: 'middle'
					});
		}
	});	
}

function openCourse(pxbId, pxb_name,pxb_type) {
	var winname='show_myscore';
	var winurl='./show_myscore_window.html';
	/*if(pxb_type==0){
		winname='show_myxxscore';
		winurl='./show_myxxscore_window.html';
	}*/
	api.openWin({
		name : winname,
		url : winurl,
		rect : {
			x : 0,
			y : 0,
			w : 'auto',
			h : 'auto'
		},
		bounces : false,
			opaque : false,
			showProgress : false,
			vScrollBarEnabled : false,
			hScrollBarEnabled : false,
			slidBackEnabled : false,
			delay : 0,
			animation : {
					type : "reveal", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300
			},
		pageParam : {
			pxbId : pxbId,
			pxb_name : pxb_name,
			pxb_type : pxb_type,
			header_h:header_h
		}
	});
}

function queryCourse() {

	var pxbName = $api.trim($api.val($api.byId("pxbscore_name")));

	var data = {
		pxbName : pxbName,
		page_number : 1,
		page_size : 15,
		person_id : $api.getStorage('person_id')
	};
	number = 1;
	findscore(data, 'init');
}
var header_h;
apiready = function() {
    header_h=api.pageParam.header_h;
	var pxbName = $api.val($api.byId("pxbName"), "");
	fillscore();
	api.addEventListener({
		name : 'scrolltobottom',
		extra : {
			threshold : 0 //设置距离底部多少距离时触发，默认值为0，数字类型
		}
	}, function(ret, err) {
		var pxbName = $api.trim($api.val($api.byId("pxbscore_name")));
		var data = {
			pxbName : pxbName,
			page_number : 1,
			page_size : 15,
			person_id : $api.getStorage("person_id")
		};
		number = number + 1;
		data.page_number = number;
		findscore(data, '');
	});

};
