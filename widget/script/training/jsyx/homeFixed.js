	var header_h;
    apiready = function(){
        header_h=api.pageParam.header_h;
    	var person_id=$api.getStorage('person_id');
    	if(person_id!=undefined&&person_id!='undefined'&&person_id!=null&&person_id!=''){
	    	changePerson();
    	}else{
    	}
    }
	
	function closeSlide () {
		api.closeSlidPane();
	}
	
    function openNewWin (type) {
			api.openWin({
				name : type,
				url : './'+type+'.html',
				pageParam : {
					header_h : header_h
				},
				bounces : false,
				opaque : false,
				showProgress : false,
				vScrollBarEnabled : false,
				hScrollBarEnabled : false,
				slidBackEnabled : false,
				delay : 0,
				animation : {
					type : "reveal", //动画类型（详见动画类型常量）
					subType : "from_right", //动画子类型（详见动画子类型常量）
					duration : 300
				},
			});
    }

	function changePerson(){
		$api.attr($api.byId("touxiang"), "src", $api.getStorage('avatar_url'));
		$api.attr($api.byId("touxiang"), "onclick","");
    	$api.text($api.byId("name"), $api.getStorage('person_name'));
    	var jigou="";
    	if($api.getStorage('bureau_name')!=undefined&&$api.getStorage('bureau_name')!='undefined'){
    		jigou=$api.getStorage('bureau_name');
    	}else if($api.getStorage('school_name')!=undefined&&$api.getStorage('school_name')!='undefined'){
    		jigou=$api.getStorage('school_name');
    	}
    	$api.text($api.byId("jigou"),jigou);
        var header = $api.byId('topbar');
        $api.fixIos7Bar(header); 
    	//var loginDiv = $api.byId("login");	
		var personDiv = $api.byId("person");	
	//	loginDiv.style.display = "none";	
		personDiv.style.display = "block";	
	}
