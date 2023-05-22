/* photoBrowser图片组件  封装photoBrowser模块  2016.09.13 周枫 
* 增加:图片缓存本地功能   2017.06.15 赵静
*/
var photo_browser;
var img_array=[];//缓存之后的图片路径数组
var photoBrowser = {
	//打开图片浏览器
	open : function(img_urls, active_index) {
	    openPictureShowWin(img_urls,active_index);
	}
};
