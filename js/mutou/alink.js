	$('<input type="button" value="训练基地" style="margin-right:10px;">').click(function(){
		location.href ="https://rockingsoccer.com/zh/soccer/facilities/trainer/train-goalkeeping";
	}).insertBefore(".calendar");
	
	$('<input type="button" value="青训中心" style="margin-right:10px;">').click(function(){
		location.href ="https://rockingsoccer.com/zh/soccer/facilities/youth/log";
	}).insertBefore(".calendar");
	
	$('<input type="button" value="球员候选名单" style="margin-right:10px;">').click(function(){
		location.href ="https://rockingsoccer.com/zh/soccer/facilities/scout/players";
	}).insertBefore(".calendar");
	
	$('<input type="button" value="友谊赛" style="margin-right:10px;">').click(function(){
		location.href ="https://rockingsoccer.com/zh/soccer/friendlies/friendlies";
	}).insertBefore(".calendar");
	
	$('<input type="button" value="预备队" style="margin-right:10px;">').click(function(){
		location.href ="https://rockingsoccer.com/zh/soccer/players/bsquad";
	}).insertBefore(".calendar");
	
	$('<input type="button" value="论坛: 英语" style="margin-right:10px;">').click(function(){
		location.href ="https://rockingsoccer.com/zh/soccer/forum/home-en";
	}).insertBefore(".calendar");
	
	$(document).ready(function(){
	if ($('.dashboard_element h4').length > 0 ) { 
		$('<font color="red"><strong>可赚信用点</strong></font>').insertBefore(".calendar");
	}
	});