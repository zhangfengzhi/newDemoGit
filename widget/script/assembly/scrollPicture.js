/* UIScrollPicture 图片轮播模块封装UIScrollPicture模块  2017.06.12 赵静 */
var scrollPicture = '';
var UIScrollPicture = {
	//打开手写签名模块
	open : function(params_json,callback) {
		scrollPicture = api.require('UIScrollPicture');
		params_json = UIScrollPicture.resetParamsJson(params_json);
		scrollPicture.open({
		    rect: {
		        x: params_json.x,
		        y: params_json.y,
		        w: params_json.w,
		        h: params_json.h
		    },
		    data: {
		        paths: params_json.paths,
		        captions: params_json.captions
		    },
		    styles: {
		        caption: {
		            height: params_json.styles.caption.height,
		            color: params_json.styles.caption.color,
		            size: params_json.styles.caption.size,
		            bgColor: params_json.styles.caption.bgColor,
		            position: params_json.styles.caption.position
		        },
		        indicator: {
		            align: params_json.styles.indicator.align,
		            color: params_json.styles.indicator.color,
		            activeColor: params_json.styles.indicator.activeColor
		        }
		    },
		    placeholderImg: params_json.placeholderImg,
		    contentMode: params_json.contentMode,
		    interval: params_json.interval,
		    auto:params_json.auto,
		    fixedOn: params_json.fixedOn,
		    loop: params_json.loop,
		    fixed: params_json.fixed
		}, function(ret, err) {
		    if (ret) {
		        callback(true,ret);
		    } else {
		       callback(false,'');
		    }
		});
	},
	//关闭
	close : function() {
		scrollPicture.close();
	},
	//显示模块
	show : function(){
		scrollPicture.show();
	},
	//隐藏模块
	hide : function(){
		scrollPicture.hide();
	},
	//指定当前项
	setCurrentIndex : function(index){
		scrollPicture.setCurrentIndex({
		    index: index
		});
	},
	//更新模块数据
	reloadData : function(params_json) {
		scrollPicture.reloadData({
		    data: {
		        paths: params_json.paths,
		        captions: params_json.captions
		    }
		});
	},
	//将没有传递过来的参数没有设值的给默认值
	resetParamsJson : function(params_json){
		if(isEmptyString(params_json)){
			params_json = {};
		}
		if(isEmptyString(params_json.x)){
			params_json.x = 0;
		}
		if(isEmptyString(params_json.y)){
			params_json.y = 0;
		}
		if(isEmptyString(params_json.w)){
			params_json.w = api.frameWidth;
		}
		if(isEmptyString(params_json.h)){
			params_json.h = Math.floor(api.frameWidth/4*3);
		}
		if(isEmptyString(params_json.placeholderImg)){
			params_json.placeholderImg = "widget://res/yy/weike/wk_default.png";
		}
		if(isEmptyString(params_json.contentMode)){
			params_json.contentMode = "scaleToFill";
		}
		if(isEmptyString(params_json.interval)){
			params_json.interval = 3;
		}
		if(isEmptyString(params_json.auto)){
			params_json.auto = false;
		}
		if(isEmptyString(params_json.fixedOn)){
			params_json.fixedOn = api.frameName;
		}
		if(isEmptyString(params_json.loop)){
			params_json.loop = true;
		}
		if(isEmptyString(params_json.fixed)){
			params_json.fixed = false;
		}
		if(isEmptyString(params_json.styles)){
			params_json.styles = {
				"caption":{},
				"indicator":{}
			};
		}
		if(isEmptyString(params_json.styles.caption)){
			params_json.styles.caption = {};
		}
		if(isEmptyString(params_json.styles.caption.height)){
			params_json.styles.caption.height = 35;
		}
		if(isEmptyString(params_json.styles.caption.color)){
			params_json.styles.caption.color = '#ffffff';
		}
		if(isEmptyString(params_json.styles.caption.size)){
			params_json.styles.caption.size = 13;
		}
		if(isEmptyString(params_json.styles.caption.bgColor)){
			params_json.styles.caption.bgColor = 'rgba(0,0,0,0.5)';
		}
		if(isEmptyString(params_json.styles.caption.position)){
			params_json.styles.caption.position = 'bottom';
		}
		if(isEmptyString(params_json.styles.indicator)){
			params_json.styles.indicator = {};
		}
		if(isEmptyString(params_json.styles.indicator.align)){
			params_json.styles.indicator.align = 'center';
		}
		if(isEmptyString(params_json.styles.indicator.color)){
			params_json.styles.indicator.color = '#FFFFFF';
		}
		if(isEmptyString(params_json.styles.indicator.activeColor)){
			params_json.styles.indicator.activeColor = '#DA70D6';
		}
		return params_json;
	},
};
