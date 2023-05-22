/* openPicker时间  封装openPicker方法  2017.10.19 赵静
*/
var openPicker = {
    open : function(oparam,callback) {
        switch(oparam.type){
            case 0:
                openPicker.getData(oparam.time,function(time){
                    callback(time);
                });
                //日期
                break;
            case 1:
                openPicker.getTime(oparam.time,function(time){
                    callback(time);
                });
                //时间
                break;
            case 2:
                openPicker.getDataTime(oparam.time,function(time){
                    callback(time);
                });
                //日期加时间
                break;
        }
    },
    getData:function(data,callback){
        var back_time="";
        data = data.substring(0,10);
        if(api.systemType=='android'){
            api.openPicker({
                type: 'date',
                date: data,
                title:'选择日期',
            },function(ret,err){
                if(ret){
                    var year = ret.year;
                    var month = ret.month;
                    month = month > 9 ? month : '0'+month;
                    var day = ret.day;
                    day = day > 9 ? day : '0'+day;
                    //这是选择的是日期
                    back_time = year+'-'+month+'-'+day;
                    callback(back_time);
                }
            });
        }else{
            api.openPicker({
                type: 'date',
                date: data,
                title:'选择日期'
            },function(ret,err){
                var year = ret.year;
                var month = ret.month;
                month = month > 9 ? month : '0'+month;
                var day = ret.day;
                day = day > 9 ? day : '0'+day;
                //这是选择的是日期
                back_time = year+'-'+month+'-'+day;
                callback(back_time);
            });
        }
    },
    getTime:function(time,callback){
        var back_time;
        time = time.substring(11,16);
        if(api.systemType=='android'){
                api.openPicker({
                    type: 'time',
                    date: time,
                    title:'选择时间'
                },function(ret,err){
                    var hours = ret.hour;
                    hours  = hours  > 9 ? hours  : '0'+ hours;
                    var minutes = ret.minute;
                    minutes  = minutes  > 9 ? minutes  : '0'+ minutes;
                    back_time = hours+':'+minutes;
                    callback(back_time);
                });
        }else{
            api.openPicker({
                type: 'time',
                date: time,
                title:'选择时间'
            },function(ret,err){
                var hours = ret.hour;
                hours  = hours  > 9 ? hours  : '0'+ hours;
                var minutes = ret.minute;
                minutes  = minutes  > 9 ? minutes  : '0'+ minutes;
                back_time = hours+':'+minutes;
                callback(back_time);
            });
        }
    },
    getDataTime:function(dataTime,callback){
        var back_time;
        if(api.systemType=='android'){
            api.openPicker({
                type: 'date',
                date: dataTime.substring(0,10),
                title:'选择时间',
            },function(ret,err){
                if(ret){
                    var year = ret.year;
                    var month = ret.month;
                    month = month > 9 ? month : '0'+month;
                    var day = ret.day;
                    day = day > 9 ? day : '0'+day;
                    //这是选择的是日期
                    var value1 = year+'-'+month+'-'+day;
                    //选择时间
                    setTimeout(function(){
                        api.openPicker({
                            type: 'time',
                            date: dataTime,
                            title:'选择时间'
                        },function(ret,err){
                            var hours = ret.hour;
                            hours  = hours  > 9 ? hours  : '0'+ hours;
                            var minutes = ret.minute;
                            minutes  = minutes  > 9 ? minutes  : '0'+ minutes;
                            var value2 = hours+':'+minutes;
                            back_time = value1+' '+value2;
                            callback(back_time);
                        });
                    },250);
                }
            });
        }else{
            api.openPicker({
                type: 'date_time',
                date: dataTime,
                title:'选择时间'
            },function(ret,err){
                var year = ret.year;
                var month = ret.month;
                month = month > 9 ? month : '0'+month;
                var day = ret.day;
                day = day > 9 ? day : '0'+day;
                var hours = ret.hour;
                hours  = hours  > 9 ? hours  : '0'+ hours;
                var minutes = ret.minute;
                minutes  = minutes  > 9 ? minutes  : '0'+ minutes;
                //这是选择的是日期
                var value1=year+'-'+month+'-'+day;
                back_time = year+'-'+month+'-'+day+' '+hours+':'+minutes;
                callback(back_time);
            });
        }
    }
}