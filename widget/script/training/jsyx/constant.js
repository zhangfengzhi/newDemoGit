//访问地址
//='http://www.zgjsyxw.com/dsideal_yy';//http://116.211.105.42:12075/dsideal_yy';//10.10.6.199/dsideal_yy';//宽城http://218.62.27.194:8088/dsideal_yy    阿里云




//var BASE_SERVER_IP='www.zgjsyxw.com';  // www.zgjsyxw.com
//var BASE_APP_TYPE=1;//云版为1；局版为2
function toBack(){
    api.closeWin();
}
//http://218.62.27.194:8088/dsideal_yy/yx/html/qtym/index.html

function errCode(errCode){
    if(errCode==0){
        api.toast({
            msg: '网络异常，请检查网络连接是否正常',
            duration:2000,
            location: 'middle'
        });
    }
    if(errCode==1){
        api.toast({
            msg: '请求超时，请稍候再试',
            duration:2000,
            location: 'middle'
        });
    }
}