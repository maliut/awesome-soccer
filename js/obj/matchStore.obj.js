function rs_matchStore(){
    var storeList = [];
//    this.storeList = storeList;
    var storeKey = 'matchStore';
    var timeKey = 'timeStore';
    var _init = function(){
        if(typeof(storeList) == 'undefined' || storeList.length<1) storeList = get_storeList();
        checkTime();
    }
    var add_match = function(id,month,day,year,hour,minutes){
        _init();
        del_match(id);
        var match_date = new Date();
        match_date.setYear(year);
        month = parseInt(monthCNToEN(month));
        match_date.setMonth(month);
        match_date.setDate(day);
        match_date.setHours(hour);
        match_date.setMinutes(minutes);
        var timestamp = match_date.getTime();
        storeList.push({
            id:id,
            timestamp:timestamp,
//            month:month,
//            day:day,
//            year:year,
//            hour:hour,
//            minutes:minutes,
        });
        save_storeList(storeList);
    }
    this.add_match = add_match;
    var get_match =function(id){
        _init();
        var match_info = false;
        if(typeof(storeList) != 'undefined')
        $.each(storeList,function(k,v){
            if(v.id == id){
                match_info = v;
            }
        });
        return match_info;
    }
    this.get_match = get_match;
    var isset_match = function (id){
        _init();
        var isset = false;
        if(typeof(storeList) != 'undefined')
        $.each(storeList,function(k,v){
            if(v.id == id){
                isset = true;
                return;
            }
        });
        return isset;
    }
    this.isset_match = isset_match;
    
    var del_match = function (id){
        _init();
        var del_index = null;
        if(typeof(storeList) != 'undefined')
        $.each(storeList,function(k,v){
            if(v.id == id){
                del_index = k;
            }
        });
        if(del_index != null) 
                storeList.splice(del_index,1);
        save_storeList(storeList);
    }
    this.del_match = del_match;
    
    var check_match = function (id){
        _init();
        var del_index = null;
        if(typeof(storeList) != 'undefined')
        $.each(storeList,function(k,v){
            if(v.id == id){
                del_index = k;
            }
        });
        save_storeList(storeList);
    }
    this.check_match = check_match;
    
    var empty_match = function (){
        _init();
        storeList = [];
        save_storeList(storeList);
    }
    this.empty_match = empty_match;
    
    var get_storeList = function (){
        var list = localStorage[storeKey];
        if(typeof(list)!='undefined'){
            list = JSON.parse(list);
            return list;
        }else{
            return [];
        }
    }
    this.get_storeList = get_storeList;
    var save_storeList = function (list){
        if(typeof(list)!='undefined'){
            localStorage[storeKey] = JSON.stringify(list);
        }
        return list;
    }
    var checkTime = function(){
    	var gametime = $("#gametime").html();
    	msg = gametime.toString().match(/([0-9]{2}):([0-9]{2}):([0-9]{2})/);
    	if(msg != null){
    	   var myDate = new Date();
           var hours = myDate.getHours();
           var minutes = myDate.getMinutes();
           var hours_d = hours - parseInt(msg[1]);
           var minutes_d = Math.abs(minutes - parseInt(msg[2]));
           if(minutes_d > 5) refreshPage();
           if(typeof(localStorage[timeKey])!= 'undefined' && localStorage[timeKey] != 'undefined' && localStorage[timeKey]!= null && parseInt(localStorage[timeKey])!= hours_d){
               localStorage[timeKey] = 'undefined';
               refreshPage();
           }
           return localStorage[timeKey] = hours_d;
    	}
    }
    this.checkTime = checkTime;
    
    var refreshPage = function(){
//        refresh_switch = false;
//        if(confirm("检测到目前时间显示不对，是否刷新页面？")){
//            window.location.href=window.location.href;
//        }else{
//            
//        }
//        refresh_switch = true;
    }
    var monthCNToEN = function(month){
        if(parseInt(month)>0) return parseInt(month);
        switch(month){
            case "一":return 1-1;break;
            case "二":return 2-1;break;
            case "三":return 3-1;break;
            case "四":return 4-1;break;
            case "五":return 5-1;break;
            case "六":return 6-1;break;
            case "七":return 7-1;break;
            case "八":return 8-1;break;
            case "九":return 9-1;break;
            case "十":return 10-1;break;
            case "十一":return 11-1;break;
            case "十二":return 12-1;break;
            case "january":return 1-1;break;
            case "february":return 2-1;break;
            case "march":return 3-1;break;
            case "april":return 4-1;break;
            case "may":return 5-1;break;
            case "june":return 6-1;break;
            case "july":return 7-1;break;
            case "august":return 8-1;break;
            case "september":return 9-1;break;
            case "october":return 10-1;break;
            case "november":return 11-1;break;
            case "december":return 12-1;break;
        }
    }
}
