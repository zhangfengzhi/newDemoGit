/* webBrowser内置Web浏览器功能  封装webBrowser模块  2016.12.02 周枫 */
var webBrowser = {
	//直接打开已定制的带标题栏的浏览器组件，类似微信中的效果
	open : function(web_url) {
		var browser = api.require('webBrowser');
		browser.open({
			url : web_url
		});
	},
	//打开一个可指定大小和位置等属性的浏览器视图到当前window。
	openView : function(header_h, web_url, callback) {
		var browser = api.require('webBrowser');
		browser.openView({
			url : web_url,
			rect : {
				x : 0,
				y : header_h,
				w : 'auto',
				h : 'auto'
			},
			progress : {
				color : '#45C01A'
			}
		}, function(ret, err) {
			var html_title = '';
			if (err) {
				html_title = '网址不合法';
				callback(false, html_title);
			} else {
				switch (ret.state) {
					case 0:
						break;
					case 1:
						break;
					case 2:
						break;
					case 3:
						html_title = ret.title;
						callback(true, html_title);
						break;
					case 4:
						break;
					default:
						break;
				}
			}
		});
	},
	//历史记录后退一页
	historyBack : function() {
		var browser = api.require('webBrowser');
		browser.historyBack(function(ret, err) {
			if (!ret.status) {
				api.closeWin();
			}
		});
	},
	//关闭浏览窗口
	closeView : function() {
		var browser = api.require('webBrowser');
		browser.closeView();
		api.closeWin();
	}
}