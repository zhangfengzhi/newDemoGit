/* UIMediaScanner 封装pUIMediaScanner模块  2017.09.14 赵静 
*/
var UI_MediaScanner;//
var UIMediaScanner = {
	open : function(num,callback) {
		UI_MediaScanner = api.require('UIAlbumBrowser');
		UI_MediaScanner.open({
            //返回的资源种类,picture（图片）,video（视频）,all（图片和视频）
            type : 'image',
            //（可选项）图片显示的列数，须大于1
            max : num,
            styles : {
                bg : '#fff',
                mark : {
                    icon : '',
                    position : 'bottom_right',
                    size : 25
                },
                nav : {
                    bg : '#eee',
                    stateColor : '#000',
                    stateSize : 18,
                    cancleBg : 'rgba(0,0,0,0)',
                    cancelColor : '#000',
                    cancelSize : 18,
                    finishBg : 'rgba(0,0,0,0)',
                    finishColor : api.systemType == "android"?'#000':'#fff',
                    finishSize : 18,
                    unFinishColor: 'rgba(0,0,0,0)',
                    titleColor: '#000',
                },
                bottomTabBar: {
                	previewTitleColor: "#fff",
                }
            },
            rotation : false,
            showPreview : false,
            showBrowser : true
        }, function(ret) {
            if (ret) {
                if (getJsonObjLength(ret.list) != 0) {
                	callback(ret.list);
                }
            }
        });
	},
	transPath:function(pic_url_old,callback){
		UI_MediaScanner.transPath({
            path : pic_url_old
        }, function(ret) {
            if(ret.path){
			 callback(ret.path);
			}else{
			 callback(pic_url_old);
			}
        });
	},
	transPathNew:function(pic_url_old,callback){
		UI_MediaScanner.transPath({
            path : pic_url_old
        }, function(ret) {
            if(ret.path){
			 	callback({"flag":true,"path":ret.path});
			}else{
			 	callback({"flag":false,"path":pic_url_old});
			}
        });
	}
};