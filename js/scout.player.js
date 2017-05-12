if(isLogin()){
	//if(true){
	var pStore = new rs_playerStore();
	var pList = pStore.get_storeList();
	if(typeof(pList)!='undefined'){
		$('<br><h3>球员候选名单(插件)</h3><p class="footnote" id="add_store_note">截止时间会一直缓存，如需更新，请手动更新。根据网络状况，可能更新截止时间会耗时较长，故请勿频繁更新。</p><table class="horizontal_table" id="new_table"></table>').appendTo(".content");
		$('<thead><tr><th></th><th>球员</th><th>年龄</th><th>位置</th><th>价值</th><!--<th>市场价值</th>--><th>截止时间</th><th>备注</th><th>操作</th></tr></thead><tbody class="new_table_tbody"></tbody>').appendTo("#new_table");
		var count = 0;
		$.each(pList,function(k,v){
			var tr_class = ((count%2) == 1)?"even":"odd";
			url = geturl()+"info/";
			var player = new rs_player(v.id);
			var obj = player.getPlayerInfo();
			var str = '<tr class="'+tr_class+'" id="tr_'+v.id+'"><td><input type="checkbox" value="'+v.id+'" class="player_checkbox"></td><td><a href="'+url+'player-'+v.id+'" class="follow" target="_blank">'+obj.name+'</a></td><td>'+obj.age+'</td><td>'+obj.position+'</td><td>'+colorValueStarOld(obj.star_min,obj.star_max)+checkUpDown(obj.star_max_e,obj.star_max)+'</td><!--<td>'+formatLongNum(parseInt(obj.vs))+checkUpDown(obj.vs_e,obj.vs)+'</td>--><td><span id="endtime_'+v.id+'">'+((typeof(v.endtime)!='undefined' && v.endtime != null)?v.endtime:'')+'</span></td><td>'+v.ext+'</td><td id="del_td_'+v.id+'"></td></tr>';
			$(str).appendTo(".new_table_tbody"); 
			$('<a href="javascript:void(0);" class="submit">删除</a>').click(function(){
				pStore.del_player(v.id);
				$("#tr_"+v.id).remove();
				//alert("删除成功");
			}).appendTo("#del_td_"+v.id);
			$('<img src="/img//icons/reload.png" alt="reload" title="刷新" class="icon refresh_player">').click(function(){
				var endtime = getEndTime(v.id);
				if(typeof(endtime) == 'undefined') endtime = "未挂牌";
				pStore.player_edit_endtime(v.id,endtime);
				$("#endtime_"+v.id).html(endtime);
			}).insertBefore("#endtime_"+v.id);
		});
		$('<tfoot><tr><td colspan="9" class="del_all_button"></td></tr></tfoot>').appendTo("#new_table");
		$('<input type="button" value="删除" class="submit">').click(function(){
			$(".player_checkbox:checked").each(function(k,v){
				var id = $(this).val();
				pStore.del_player(id);
				$("#tr_"+id).remove();
			});
		}).appendTo(".del_all_button");
		$('<input type="button" value="清空" class="submit">').click(function(){
                    pStore.clear();
                    window.location.reload();
		}).appendTo(".del_all_button");
		$("[show-type=star]").click(function(){
			$("[show-type=star]").hide();
			$("[show-type=num]").show();
		})
		$("[show-type=num]").click(function(){
			$("[show-type=star]").show();
			$("[show-type=num]").hide();
		});
	}
	setListenPlayer();
}