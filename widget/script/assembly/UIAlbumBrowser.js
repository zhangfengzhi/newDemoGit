/* UIAlbumBrowser 封装pUIAlbumBrowser模块  2017.09.14 赵静 
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
	open : function(num,callback) {
		privilegeManagement('storage-w',function(){
			UIAlbumBrowser.openBefore(num,callback)
		})
	},
	openBefore : function(num,callback){
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