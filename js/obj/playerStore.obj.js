function rs_playerStore(){
    var storeList = [];
//    this.storeList = storeList;
    var storeKey = 'playerStore';

    var _init = function(){
        if(typeof(storeList) == 'undefined' || storeList.length<1) storeList = get_storeList();
    }
    var add_player = function(id,ext){
        _init();
        del_player(id);
        storeList.push({
            id:id,
            ext:ext,
            endtime:null,
        });
        save_storeList(storeList);
    }
    this.add_player = add_player;
    var player_edit_endtime = function(id,endtime){
        _init();
        player_info = get_player(id);
        if(player_info == false) return false;
        del_player(id);
        storeList.push({
            id:player_info.id,
            ext:player_info.ext,
            endtime:endtime,
        });
        save_storeList(storeList);
    }
    this.player_edit_endtime = player_edit_endtime;
    var get_player =function(id){
        _init();
        var player_info = false;
        if(typeof(storeList) != 'undefined')
        $.each(storeList,function(k,v){
            if(v.id == id){
                player_info = v;
            }
        });
        return player_info;
    }
    this.get_player = get_player;
    var isset_player = function (id){
        _init();
        var isset = false;
        if(typeof(storeList) != 'undefined')
        $.each(storeList,function(k,v){
            if(v.id == id){
                isset = true;
            }
        });
        return isset;
    }
    this.isset_player = isset_player;
    
    var del_player = function (id){
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
    this.del_player = del_player;
    
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
    var clear = function(){
        save_storeList([]);
    }
    this.clear = clear;
}
