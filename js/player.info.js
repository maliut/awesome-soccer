var str = '';
var count = 0;
var results1 = [];
var results2 = [];
$(".vt_col1 >tbody>tr>td").each(function(){
	results1.push($(this).html());
});
$(".vt_col3 >tbody>tr>td").each(function(){
	results2.push($(this).html());
});
refreshcss();
var name = $(".center > h2").html();
var url = window.location.href;
var reg = /^https:\/\/rockingsoccer.com\/[a-zA-z\/\-]*\/info\/player-([0-9]*)/;
url = url.match(reg);
if(url != null){
	player_id = url[1];
	var players = new rs_player(player_id);
	var player_info = players.anaPlayerInfo(name,results1,results2,1);
	//		print_r(player_info);
	$(".vt_col1").first().append('<tr><th title="粗略计算该球员可训练属性所使用的经验值，不包括未加点部分。">总经验值(估计值)</th><td title="这名球员一共拥有经验：'+formatLongNum(player_info.ex)+'">'+formatLongNum(player_info.ex)+'ex </td></tr>');

	//rs3
	$(".vt_col1").first().append('<tr><th title="根据该球员的年龄经验比、及身体条件，粗略计算该球员的评分。">球员评分(估计值)</th><td  title="">'+colorScore_2(player_info.train_grade)+' （ '+colorScore_1(player_info.totalScore)+'分&nbsp;'+'  属性 '+colorScore_1(player_info.property_score) + '分&nbsp;'+'  经验3.0 ' + colorScore_1(player_info.exp_score) +'分 ）'+'</td></tr>');
	//rs2
	$(".vt_col1").first().append('<tr><th>球员经验2.0</th><td>' + colorScore_1(player_info.old_exp_score) +'分 '+'</td></tr>');
	
	var pStore = new rs_playerStore();

	if(isLogin()){
		//version 1.3.9 add
		//	if(player_info.length>1){
		$(".vt_col1 >tbody>tr>td:eq("+(3+player_info.index_add)+")").append('<span class="ws_ana"></span>');
		$(".vt_col1 >tbody>tr>td:eq("+(8+player_info.index_add+player_info.jy)+")").append('<span class="vs_ana"></span>');
		$(".vt_col1 >tbody>tr>td:eq("+(4+player_info.login_add+player_info.index_add)+")").append('<span class="star_min_ana"></span>');
		var ball_list = ['talent','scoring',null,'endurance','passing',null,'power','dueling',null,'speed','blocking',null,null,'tactics',null];
		var check_list = ['talent','scoring','endurance','passing','power','dueling','speed','blocking','tactics','ws','vs','star_min'];
		$.each(ball_list,function(k,v){
			if(v != null){
				$(".vt_col3 >tbody>tr>td:eq("+k+")").append('<span class="'+v+'_ana"></span>');
			}
		})
//		$("<div class='plugn_ana'></div>").insertAfter($(".vt_col3"));
		$("<div class='plugn_ana'></div>").insertBefore($(".dashboard_element"));
		$("<p class='plugn_ana_p'>插件操作：选择历史数据对比</p>").appendTo($(".plugn_ana"));
		$("<select class='sel_his' id='sel_his'></select>").on({
			change:function(){
				changeSel($(this).val());
			}
		}).appendTo($(".plugn_ana_p"));
		if(typeof(player_info.history)!='undefined'){
			$.each(player_info.history,function(k,v){
				$('.sel_his').append("<option value='"+k+"' "+((k == 1)?'selected':'')+">"+v.last_get+"</option>");
			});
			changeSel(1);
		}
		//version 1.4.2 add
		$("<a class='change_color' href='javascript:void(0);'>[切换颜色显示风格]</a>").appendTo($(".plugn_ana_p"));
		$(".change_color").bind('click',function(){
			if(localStorage['updown_color_type'] == '1'){
				$(".updown_value").removeClass("ud_style1");
				localStorage['updown_color_type'] = 0;
			}else{
				$(".updown_value").addClass("ud_style1");
				localStorage['updown_color_type'] = 1;
			}
		});
	
		//version 1.4.2 end
		//	}
		//if(true){
		if(!(pStore.isset_player(player_id))){
			$('<p class="footnote" id="add_store_note">在球探中心->球员候选名单中显示。</p><input type="text" name="player_ext" id="player_ext" value="" style="width:150px;">').appendTo(".side");
			$('<input type="button" class="submit" value="加入候选名单(插件)">').click(function(){
				var str = '';
				pStore.add_player(player_id,$("#player_ext").val());
				//alert("加入成功！");
				$(this).hide();
				$("#player_ext").hide();
				$("#add_store_note").hide();
			}).appendTo(".side");
			
		}else{
			$('<p class="footnote" id="add_store_note">已加入候选名单(插件)</p>').appendTo(".side");
			$('<input type="button" class="submit" value="从候选名单去除(插件)">').click(function(){
				pStore.del_player(player_id);
				alert("删除成功！");
				$(this).hide();
				$("#add_store_note").hide();
			}).appendTo(".side");
		}
	}
}
//version 1.3.9 add
function changeSel(k){
	if(typeof(player_info.history) != undefined && typeof(player_info.history[k]) != undefined ){
		var now_info = player_info.history[k];
		if(typeof(now_info)!= 'undefined'){
			$.each(check_list,function(k,v){
				if(typeof(player_info[v])!='undefined' && typeof(now_info[v])!='undefined')
				$("."+v+"_ana").html(checkGrow(player_info[v],now_info[v]));
			});
		}
	}
}