/* UIAlbumBrowser 封装pUIAlbumBrowser模块  2018.02.12 赵静 
 * 在原有的基础上进行升级
*/
function privilegeManagement (jurisdiction,fun) {
 	var resultList = api.hasPermission({
		list:[jurisdiction]
	});
	if(!resultList[0].granted){
		api.confirm({
	    msg: '您未开启权限，是否获取权限',
	    buttons: ['确定', '取消']
		}, function(ret, err) {
		    var index = ret.buttonIndex;
		    if(index == 1){
			    api.requestPermission({
			    list:[jurisdiction],
			    code:1
				}, function(ret, err){
				    if(!ret.list[0].granted){
						popAlert('您未开启权限，请重新获取')			    	
				    }else{
				    	return fun()
				    }
				});
		    	
		    }if(index == 2){
		    	popAlert('获取失败')
		    }
		});
    }else{
	  return fun()  
    }
}
var UI_MediaScanner;//
var UIAlbumBrowser = {
    open : function(params_json,callback) {
    	privilegeManagement('storage-w',function(){
			UIAlbumBrowser.openBefore(params_json,callback)
		})
    },
    openBefore : function (params_json,callback){
    	UI_MediaScanner = api.require('UIAlbumBrowser');
        params_json = UIAlbumBrowser.resetParamsJson(params_json);
        UI_MediaScanner.open({
            //返回的资源种类,picture（图片）,video（视频）,all（图片和视频）
            type : params_json.type,
            //（可选项）图片显示的列数，须大于1
            max : params_json.max,
            styles : {
                bg : params_json.styles.bg,
                mark : {
                    icon : params_json.styles.mark.icon,
                    position : params_json.styles.mark.position,
                    size : params_json.styles.mark.size
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
            showPreview : params_json.showPreview,
            showBrowser : params_json.showBrowser
        }, function(ret) {
            if (ret) {
                if (getJsonObjLength(ret.list) != 0) {
                    callback(ret.list);
                }
            }else{
                popToast('打开相册失败，请稍候重试');
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
	},
    //将没有传递过来的参数没有设值的给默认值
    resetParamsJson : function(params_json){
        if(isEmptyString(params_json)){
            params_json = {};
        }
        if(isEmptyString(params_json.type)){
            params_json.type = 'picture';
        }
        if(isEmptyString(params_json.column)){
            params_json.column = 4;
        }
        if(isEmptyString(params_json.max)){
            params_json.max = 1;
        }
        if(isEmptyString(params_json.sort)){
            params_json.sort = {};
        }
        if(isEmptyString(params_json.sort.key)){
            params_json.sort.key = 'time';
        }
        if(isEmptyString(params_json.sort.order)){
            params_json.sort.order = 'desc';
        }
        if(isEmptyString(params_json.texts)){
            params_json.texts = {};
        }
        if(isEmptyString(params_json.texts.stateText)){
            params_json.texts.stateText = '已选择*项';
        }
        if(isEmptyString(params_json.texts.cancelText)){
            params_json.texts.cancelText = '取消';
        }
        if(isEmptyString(params_json.texts.finishText)){
            params_json.texts.finishText = '完成';
        }
        if(isEmptyString(params_json.styles)){
            params_json.styles = {};
        }
        if(isEmptyString(params_json.styles.bg)){
            params_json.styles.bg = '#fff';
        }
        if(isEmptyString(params_json.styles.mark)){
            params_json.styles.mark = {};
        }
        if(isEmptyString(params_json.styles.mark.icon)){
            params_json.styles.mark.icon = '';
        }
        if(isEmptyString(params_json.styles.mark.position)){
            params_json.styles.mark.position = 'bottom_right';
        }
        if(isEmptyString(params_json.styles.mark.size)){
            params_json.styles.mark.size = 20;
        }
        if(isEmptyString(params_json.styles.nav)){
            params_json.styles.nav = {};
        }
        if(isEmptyString(params_json.styles.nav.bg)){
            params_json.styles.nav.bg = '#eee';
        }
        if(isEmptyString(params_json.styles.nav.stateColor)){
            params_json.styles.nav.stateColor = '#000';
        }
        if(isEmptyString(params_json.styles.nav.stateSize)){
            params_json.styles.nav.stateSize = 18;
        }
        if(isEmptyString(params_json.styles.nav.cancleBg)){
            params_json.styles.nav.cancleBg = 'rgba(0,0,0,0)';
        }
        if(isEmptyString(params_json.styles.nav.cancelColor)){
            params_json.styles.nav.cancelColor = '#000';
        }
        if(isEmptyString(params_json.styles.nav.cancelSize)){
            params_json.styles.nav.cancelSize = 18;
        }
        if(isEmptyString(params_json.styles.nav.finishBg)){
            params_json.styles.nav.finishBg = 'rgba(0,0,0,0)';
        }
        if(isEmptyString(params_json.styles.nav.finishColor)){
            params_json.styles.nav.finishColor = '#000';
        }
        if(isEmptyString(params_json.styles.nav.finishSize)){
            params_json.styles.nav.finishSize = 18;
        }
        if(isEmptyString(params_json.rotation)){
            params_json.rotation = true;
        }
        if(isEmptyString(params_json.showPreview)){
            params_json.showPreview = false;
        }
        switch(params_json.type) {
            case 'picture':
                //图片
                if(isEmptyString(params_json.texts.selectedMaxText)){
                    params_json.texts.selectedMaxText = '你最多只能选择'+params_json.max+'个图片';
                }
                if(isEmptyString(params_json.showBrowser)){
                    params_json.showBrowser = true;
                }
                break;
            case 'video':
                //视频
                if(isEmptyString(params_json.texts.selectedMaxText)){
                    params_json.texts.selectedMaxText = '你最多只能选择'+params_json.max+'个视频';
                }
                if(isEmptyString(params_json.showBrowser)){
                    params_json.showBrowser = false;
                }
                break;
            case 'all':
                //图片或者视频
                if(isEmptyString(params_json.texts.selectedMaxText)){
                    params_json.texts.selectedMaxText = '你最多只能选择'+params_json.max+'个图片或者视频';
                }
                if(isEmptyString(params_json.showBrowser)){
                    params_json.showBrowser = false;
                }
                break;
            default:
                if(isEmptyString(params_json.texts.selectedMaxText)){
                    params_json.texts.stateText = '你最多只能选择'+params_json.max+'个图片';
                }
                if(isEmptyString(params_json.showBrowser)){
                    params_json.showBrowser = true;
                }
                break;
        }
        return params_json;
    }
};