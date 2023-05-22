//滑动器  封装UISlider模块 20161124 王帅
var slidingDevice = {
    //打开滑动器
    openSlidingDevice : function(params,callback){
        var uislider = api.require('UISlider'); 
        uislider.open({
				animation : params.animation, //当值发生改变时，如 click 事件，是否为滑块的移动显示动画
				orientation : params.orientation, //滑动控件的朝向：vertical | horizontal
				rect : {
					x : params.rect.x,
					y : params.rect.y,
					size : params.rect.size
				},
				//提示气泡设置
				bubble : {
					direction : params.bubble.direction, //字符串类型；气泡弹出方向，取值范围：top（往上弹出）、bottom（往下弹出）；默认：top;
					state : params.bubble.state, //字符串类型；提示气泡显示状态；默认：highlight；取值范围如下：always（一直显示）;highlight（当用户与滑动控件有交互时显示一段时间）;hide（不显示）;
					w : params.bubble.w,
					h : params.bubble.h,
					size : params.bubble.size, //气泡内文字大小;
					color : params.bubble.color, //字符串类型；气泡内文字颜色;
					bg : params.bubble.bg, //气泡的背景图片路径;
					prefix : params.bubble.prefix, //（可选项）字符串类型；气泡文字的前缀；
					suffix : params.bubble.suffix //（可选项）字符串类型；气泡文字的后缀；
				},
				handler : {//滑块设置
					w : params.handler.w, //（可选项）数字类型；滑块宽度；
					h : params.handler.h, //（可选项）数字类型；滑块高度；
					bg :params.handler.bg//字符串类型；滑块图片的路径，要求本地路径（widget://、fs://）
				},
				bar : {//滑动条设置
					h : params.bar.h, //（可选项）数字类型；滑动条的高度；默认：4
					bg : params.bar.bg, //字符串类型；滑动条的背景
					active : params.bar.active//（可选项）字符串类型；滑动条滑块已选择区域背景，支持：rgb，rgba，#，img；默认：透明
				},
				value : {//滑动控件的值设置
					min : params.value.min, //数字类型；滑动控件的最小值
					max : params.value.max, //数字类型；滑动控件的最大值
					step : params.value.step, //数字类型；滑动时的步幅
					init : params.value.init //数字类型；初始值
				},
				fixedOn : params.fixedOn, //（可选项）模块视图添加到指定 frame 的名字（只指 frame，传 window 无效）
				fixed : params.fixed //（可选项）是否将模块视图固定到窗口上，不跟随窗口上下滚动
			}, function(ret, err) {
				/**
				 *id: 1,  数字类型；滑动控件的唯一标识，由模块内部自动生成
				 *eventType: 'sliding' ,      
				 *字符串类型；滑动控件值改变时触发；取值范围如下：
				 *show: 控件显示;sliding：滑动中;end：滑动结束;set：被 setValue 改变;click：滑动条被点击
				 * value: 50       滑动控件的当前值，在 eventType 的所有事件中都会返回
				 */
			if (ret) {
					callback(true,ret);
				} else {
					callback(false,ret);
				}
			});
    },
    //隐藏滑动器
    hideSlidingDevice : function (params){
       var uislider = api.require('UISlider');
       uislider.hide({
           id: params.id
       });
    },
    //显示滑动器
    showSlidingDevice : function (params){
       var uislider = api.require('UISlider');
       uislider.show({
           id: params.id
       });
    },
   
    //关闭滑动器
    closeSlidingDevice : function (params){
       var uislider = api.require('UISlider');
       uislider.close({
           id: params.id
       });
    },

    //锁定滑动器
    lockSlidingDevice : function (params){
       var uislider = api.require('UISlider');
       uislider.lock({
          id: params.id,
          lock: params.lock //是否锁定指定模块
        });
    },
    //设置 UISlider 的值
    setValueSlidingDevice : function(params){
       var uislider = api.require('UISlider');
       uislider.setValue({
          id: params.id,
          value: {
             min: params.value.min,
             max: params.value.max,
             step: params.value.step,
             value: params.value.value
           }
       });
    }
}