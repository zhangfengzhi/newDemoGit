/* drawingBoard手写签名 封装drawingBoard模块  2017.05.31 赵静 */
var drawing_board = '';
var drawingBoard = {
	//打开手写签名模块
	open : function(params_json) {
		drawing_board = api.require('drawingBoard');
		params_json = drawingBoard.resetParamsJson(1,params_json);
		drawing_board.open({
		    rect: {
		        x: params_json.x,
		        y: params_json.y,
		        w: params_json.w,
		        h: params_json.h
		    },
		    styles: {
		        brush: {
		            color: '#f00',
		            width: params_json.brush.width
		        },
		        bgColor: params_json.file_id
		    },
		    fixedOn: params_json.frameName
		});
	},
	//关闭
	close : function() {
		drawing_board.close();
	},
	//清除所有痕迹
	clear : function(){
		drawing_board.clear();
	},
	//恢复刚撤销的笔画线条
	restore : function(){
		drawing_board.restore();
	},
	//撤销最新画出的笔画线条
	revoke : function(){
		drawing_board.revoke();
	},
	//保存图片在本地的绝对路径
	save : function(save_param, callback) {
		save_param = drawingBoard.resetParamsJson(0,save_param);
		drawing_board.save({
		    savePath: 'fs://img/'+api.pageParam.file_id+'.'+api.pageParam.ext,
		    copyToAlbum: false,
		    overlay:save_param.overlay,
		}, function(ret) {
		    callback(JSON.stringify(ret));
		});
	},
	//将没有传递过来的参数没有设值的给默认值
	resetParamsJson : function(type,params_json){
		if(isEmptyString(params_json)){
			params_json = {};
		}
		if(type){
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
				params_json.h = api.frameHeight;
			}
			if(isEmptyString(params_json.brush)){
				params_json.brush={};
			}
			if(isEmptyString(params_json.brush.color)){
				params_json.brush.color = "#333333";
			}
			if(isEmptyString(params_json.brush.width)){
				params_json.brush.width = 3;
			}
			if(isEmptyString(params_json.bgColor)){
				params_json.bgColor = "#ffffff";
			}
			if(isEmptyString(params_json.fixedOn)){
				params_json.fixedOn = api.frameName;
			}
		}else{
			if(isEmptyString(params_json.copyToAlbum)){
				params_json.copyToAlbum = true;
			}
			if(isEmptyString(params_json.overlay)){
				params_json.overlay = true;
			}
		}
		return params_json;
	},
};
