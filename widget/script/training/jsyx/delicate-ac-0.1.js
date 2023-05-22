/*
 * AUI JAVASCRIPT PLUGIN
 * 自定义弹出层
 * v 0.0.1
 * Copyright (c) 2015 auicss.com @流浪男  QQ：343757327  群：344869952
 */
(function(window) {
	var de = {};
	de.isElement = function(obj) {
		return !!(obj && obj.nodeType == 1);
	};
	de.topMenu = function(opts, callback) {
		//模态透明度
		var modalOpacity = "0.0";
		//模态框
		var x = 0,y = 0,w = 150,h = 300;
		//是否有指向三角
		var point = "on",pointX = 65,pointW = 10,pointH = 10;
		//菜单背景颜色 支持rgba透明
		var menuBgColor = "rgba(255,255,255,0.8)";
		//菜单圆角
		var menuRadius = "5";
		//内容文字颜色
		var textColor = "#333333";
		//已选文字颜色
		var activeColor = "#f1c40f";
		//已选背景颜色
		var activeBgColor = "#eeeeee";
		//选中背景风格
		var selectBgStyle = "dark";
		//文字对其方式
		var textAlign = "left";
		//文字大小
		var textSize = "18";
		//文字内容
		var textData = ["首页", "好友圈", "群微博", "我的微博", "-", "特别关注", "名人明星", "同事", "同学", "吐槽"];
		//分割线颜色
		var lineColor = "#eeeeee";
		//预设选中
		var textDefault = "首页";
		
		var _setting = function() {
			modalOpacity = opts.modalOpacity ? opts.modalOpacity : modalOpacity;
			x = opts.x ? opts.x : x;
			y = opts.y ? opts.y : y;
			w = opts.w ? opts.w : w;
			h = opts.h ? opts.h : h;
			point = opts.point ? opts.point : point;
			pointX = opts.pointX ? opts.pointX : pointX;
			pointW = opts.pointW ? opts.pointW : pointW;
			pointH = opts.pointH ? opts.pointH : pointH;
			menuBgColor = opts.menuBgColor ? opts.menuBgColor : menuBgColor;
			menuRadius = opts.menuRadius ? opts.menuRadius : menuRadius;
			textColor = opts.textColor ? opts.textColor : textColor;
			activeColor = opts.activeColor ? opts.activeColor : activeColor;
			activeBgColor = opts.activeBgColor ? opts.activeBgColor : activeBgColor;
			selectBgStyle = opts.selectBgStyle ? opts.selectBgStyle : selectBgStyle;
			textAlign = opts.textAlign ? opts.textAlign : textAlign;
			textSize = opts.textSize ? opts.textSize : textSize;
			textData = opts.textData ? opts.textData : textData;
			lineColor = opts.lineColor ? opts.lineColor : lineColor;
			textDefault = opts.textDefault ? opts.textDefault : textDefault;
		}
		var _init = function() {
			
			api.openFrame({
				name : 'delicate-modal-header',
				url : '../html/modal_header.html',
				rect : {
					x : 0,
					y : 0,
					w : "auto",
					h : "auto"
				},
				bgColor : "rgba(0,0,0,0)",
				pageParam : {
					modalOpacity : modalOpacity,
					x : x,
					y : y,
					w : w,
					h : h,
					point : point,
					pointX : pointX,
					pointW : pointW,
					pointH : pointH,
					menuBgColor : menuBgColor,
					menuRadius : menuRadius,
					textColor : textColor,
					activeColor : activeColor,
					activeBgColor : activeBgColor,
					selectBgStyle : selectBgStyle,
					textAlign : textAlign,
					textSize : textSize,
					textData : textData,
					lineColor : lineColor,
					textDefault : textDefault
				},
				bounces : false,
				vScrollBarEnabled : false,
				hScrollBarEnabled : false
			})
			api.addEventListener({
				name : 'modal-header-callback'
			}, function(ret) {
				if (ret) {
					setTimeout(function() {
						callback('' + ret.value.buttonIndex + '');
					}, 150)

				}
			});
		}
		//_setting();
		/////_init();

	}

	de.bodyMenu = function(opts, callback) {
		//模态透明度
		var modalOpacity = "0.0";
		//菜单背景颜色 支持rgba透明
		var menuBgColor = "rgba(255,255,255,0.8)";
		var menuBgColor2 = "rgba(255,255,255,0.8)";
		//菜单圆角
		var menuRadius = "5";
		//标题文字
        var textTitle = "Menu";
        //标题文字颜色
        var titleColor = "#333333";
        //标题背景颜色
        var titleBgColor = "#333333";
		//内容文字颜色
		var textColor = "#333333";
		//已选文字颜色
		var activeColor = "#f1c40f";
		//已选背景颜色
		var activeBgColor = "#eeeeee";
		//文字对其方式
		var textAlign = "left";
		//文字大小
		var textSize = "18";
		//文字内容
		var textData = ["上海菜", "北京菜", "川菜", "粤菜", "湘菜", "云南菜", "江浙菜", "贵州菜", "东北菜", "西北菜", "湖北菜", "鲁菜", "清真菜", "火锅", "家常菜", "自助餐", "小吃简餐", "东南亚菜", "西餐", "面包甜点", "快餐", "烧烤", "赣菜", "其他", "海鲜", "私家菜", "台湾菜", "杭帮菜", "农家菜", "闽菜", "徽菜", "海南菜", "新疆菜", "土菜", "广西菜", "桂北菜", "日本料理", "韩国料理", "印度菜", "越南菜", "泰国菜"];
		//预设选中
		var textDefault = "首页";
		
		var _setting = function() {
			modalOpacity = opts.modalOpacity ? opts.modalOpacity : modalOpacity;
			menuBgColor = opts.menuBgColor ? opts.menuBgColor : menuBgColor;
			menuBgColor2 = opts.menuBgColor2 ? opts.menuBgColor2 : menuBgColor2;
			menuRadius = opts.menuRadius ? opts.menuRadius : menuRadius;
			textTitle = opts.textTitle ? opts.textTitle : textTitle;
			titleColor = opts.titleColor ? opts.titleColor : titleColor;
			titleBgColor = opts.titleBgColor ? opts.titleBgColor : titleBgColor;
			textColor = opts.textColor ? opts.textColor : textColor;
			activeColor = opts.activeColor ? opts.activeColor : activeColor;
			activeBgColor = opts.activeBgColor ? opts.activeBgColor : activeBgColor;
			textAlign = opts.textAlign ? opts.textAlign : textAlign;
			textSize = opts.textSize ? opts.textSize : textSize;
			textData = opts.textData ? opts.textData : textData;
			textDefault = opts.textDefault ? opts.textDefault : textDefault;
		}
		var _init = function() {
			api.openFrame({
				name : 'delicate-modal-body',
				url : '../html/modal_body.html',
				rect : {
					x : 0,
					y : 0,
					w : "auto",
					h : "auto"
				},
				bgColor : "rgba(0,0,0,0)",
				pageParam : {
					modalOpacity : modalOpacity,
					menuBgColor : menuBgColor,
					menuBgColor2 : menuBgColor2,
					menuRadius : menuRadius,
					textTitle : textTitle,
					titleColor : titleColor,
					titleBgColor : titleBgColor,
					textColor : textColor,
					activeColor : activeColor,
					activeBgColor : activeBgColor,
					textAlign : textAlign,
					textSize : textSize,
					textData : textData,
					textDefault : textDefault
				},
				bounces : false,
				vScrollBarEnabled : false,
				hScrollBarEnabled : false
			})
			api.addEventListener({
				name : 'modal-body-callback'
			}, function(ret) {
				if (ret) {
					setTimeout(function() {
						callback('' + ret.value.buttonIndex + '');
					}, 150)

				}
			});
		}
		_setting();
		_init();

	}
	
	de.bottomMenu = function(opts, callback) {
		//模态透明度
		var modalOpacity = "0.0";
		//菜单背景颜色 支持rgba透明
		var menuBgColor = "rgba(255,255,255,0.8)";
		//菜单圆角
		var menuRadius = "5";
		//内容文字颜色
		var textColor = "#333333";
		//文字大小
		var textSize = "18";
		//文字内容
		var textData = [{
							"title":"微信好友","icon":"weixin","color":"#79c141"
						},{
							"title":"微信朋友圈","icon":"pengyouquan","color":"#ff9e00"
						},{
							"title":"新浪微博","icon":"weibo","color":"#f85357"
						},{
							"title":"QQ","icon":"QQ","color":"#339ee6"
						},{
							"title":"支付宝好友","icon":"zhifubao","color":"#00a0e9"
						},{
							"title":"复制链接","icon":"lianjie","color":"#5298dd"
						}];
		//分割线颜色
		var lineColor = "#333333";
		
		var _setting = function() {
			modalOpacity = opts.modalOpacity ? opts.modalOpacity : modalOpacity;
			menuBgColor = opts.menuBgColor ? opts.menuBgColor : menuBgColor;
			menuRadius = opts.menuRadius ? opts.menuRadius : menuRadius;
			textColor = opts.textColor ? opts.textColor : textColor;
			textSize = opts.textSize ? opts.textSize : textSize;
			textData = opts.textData ? opts.textData : textData;
			lineColor = opts.lineColor ? opts.lineColor : lineColor;
		}
		var _init = function() {
			
			api.openFrame({
				name : 'delicate-modal-footer',
				url : '../html/modal_footer.html',
				rect : {
					x : 0,
					y : 0,
					w : "auto",
					h : "auto"
				},
				bgColor : "rgba(0,0,0,0)",
				pageParam : {
					modalOpacity : modalOpacity,
					menuBgColor : menuBgColor,
					menuRadius : menuRadius,
					textColor : textColor,
					textSize : textSize,
					textData : textData,
					lineColor : lineColor
				},
				bounces : false,
				vScrollBarEnabled : false,
				hScrollBarEnabled : false
			})
			api.addEventListener({
				name : 'modal-footer-callback'
			}, function(ret) {
				if (ret) {
					setTimeout(function() {
						callback('' + ret.value.buttonIndex + '');
					}, 150)

				}
			});
		}
		_setting();
		_init();

	}
	window.$de = de;

})(window);

