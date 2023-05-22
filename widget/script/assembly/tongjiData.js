/* talkingData实现移动App的数据统计功能  2016.11.29 周枫 */
var tongji_data = {
	//进入一个页面
	onPageStart : function(param_name) {
		var tj_app = api.require('talkingData');
		tj_app.onPageStart({
			pageName : param_name
		});
	},
	//离开一个页面
	onPageEnd : function(param_name) {
		var tj_app = api.require('talkingData');
		tj_app.onPageEnd({
			pageName : param_name
		});
	}
}; 