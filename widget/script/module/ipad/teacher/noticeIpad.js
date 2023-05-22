var now_select_all = [];//记录当前已选中的数据，用于回显,1:教育局，2：学校，3:部门，7：教辅单位，-2：群组，-3人员，-4：下属教育局，-5：下属教辅单位；-6：下属学校，0：内部科室（根节点）,-7：内部科室（子节点）
/*
 * 功能：修改回显是否选中状态
 * 时间：20180726
 * 作者：张自强
 */
function checkStatesShow(add_type,type,id,name,rode){
	now_select_all = $api.getStorage('now_select_all');
	if(!now_select_all){
		now_select_all = [];
	}
    switch(add_type){
        case 1://加
            now_select_all.push({'type':type,'id':id,'name':name,'rode':rode});
            break;
        case 2://减
            for(var i=0;i<now_select_all.length;i++){
                if(now_select_all[i].type == type && now_select_all[i].id == id){
                    now_select_all.splice(i,1);
                }
            }
            break;
    }
    $api.setStorage('now_select_all',now_select_all);
}

/*
 * 功能：回显是否选中
 * 作者：张自强
 * 时间：20180726
 */
function checkShowSelected(type,id,callback){
	 now_select_all = $api.getStorage('now_select_all');
	 if(!now_select_all){
		now_select_all = [];
	 }
     var flag = false;
     for(var i=0;i<now_select_all.length;i++){
        if(type == now_select_all[i].type && id == now_select_all[i].id){
            flag = true;
        }
    }
    callback(flag);
}