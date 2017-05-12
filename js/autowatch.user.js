// ==UserScript==
// @name           RockingSoccer AutoWatch Match By 船长
// @version        1.0.1
// @namespace      
// @description    船长开发功能，感谢船长 https://rockingsoccer.com/zh/soccer/info/team-2548
//
// ==/UserScript==

var version = '2.1.0';

if (typeof GM_setValue == 'undefined') { 
	function GM_setValue(key, value) { 
		return localStorage.setItem(key, JSON.stringify(value)); 
	} 
} 

if (typeof GM_getValue == 'undefined') { 
	function GM_getValue(key, default_value) { 
		var result = localStorage.getItem(key); 
		if ((typeof result == 'null') && (typeof default_value != 'undefined')) { 
			result = default_value; 
		} 
		else { 
			result = JSON.parse(result); 
		} 
		return result; 
	} 
} 

function delayedReload(time)
{
    if(typeof(time) == "undefined") time = 2000;
    setTimeout(function(){location.reload();},time);
}

function autowatch(){
	var a = localStorage.getItem('watched_match'),nDate = new Date().getDate();
	if(a){
		var alist = JSON.parse(a);
	}else{
		alist = {};
		alist[nDate] = {};	
	}
	if(typeof alist[nDate] == 'undefined'){
		alist = {};
		alist[nDate] = {};	
	}
	$("a.lineup-link").each(function()
	{	
		var url = $(this).attr("href");
		if(typeof(alist[nDate][url]) == 'undefined'){
			$.get(url);
			alist[nDate][url] = 1;
		}
		
	});
	localStorage.setItem('watched_match',JSON.stringify(alist));
	$("span#updatetime").text("本次刷新时间：" + $("div#gametime").text());
	delayedReload(300000);
}

$(document).ready(function()
{
	if (location.href.indexOf('https://rockingsoccer.com/') < 0) 
		return;
	if(location.href == 'https://rockingsoccer.com/zh/soccer/friendlies') 
	{

		var auto_watch_match_str = '<br class="clearfix"><h2><span style="font-size:12px;"><a href="javascript:void(0)" id="auto_watch" style="font-size:12px;"><strong style="font-size:12px;">自动看比赛</strong></a>(五分钟刷新一次，点击之后不要关闭本网页）自动看球插件2 作者<a href="https://rockingsoccer.com/en/soccer/info/manager-1490" id="copywrite" style="font-size:12px;">船长</a> </span><br><br><span id="updatetime" style="font-size:12px;">上次刷新时间：未知</span><span id="stop_auto"><a href="javascript:void(0)" id="stop_auto" style="font-size:12px;">停止自动看比赛</a></span><br><br><span style="font-size:12px;" >使用注意：首次使用需要先填入时差，如果没有时差填入 0 。    更新：<a href="https://rockingsoccer.com/zh/soccer/info/manager-71751" style="font-size:12px;"> 凯文</a></span></h2>';

		$("div#content").children("h2").first().append(auto_watch_match_str);
		
		$("#auto_watch").click( function()
		{
			alert("已经开始自动看球，请不要关闭本网页");
			GM_setValue("auto_watch",1);
			delayedReload(0);
			autowatch();
		});

		$("#stop_auto").click( function()
		{
			alert("已经停止自动看球");
			GM_setValue("auto_watch",0);
		});

		var flag = GM_getValue("auto_watch","");
		if(flag == 1){
			autowatch();
		}
	}
});




