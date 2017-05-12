var url = geturl();
if(window.location.href == url+"friendlies")
{
	var mStore = new rs_matchStore();
	//html add
	$(".horizontal_table:first").before("<div class='setting_table trig_fold'><b>rs插件功能-自动看球:</b>[<span class='trig_auto_watch' title='open'>展开</span>]<br></div>");
	$("<div class='setting_time_diff'>设置当前时差</div><div class='setting_time_button'></div>").appendTo('.setting_table');
	$('<input id="time_diff" name="time_diff" value="" maxlenth=2 style="width:20px;text-align:center;">').on({
		keyup:function(){
			this.value=this.value.replace(/[^\.\d\-]/g,'');
			if(parseInt(this.value)>23 || parseInt(this.value) <-23)
			this.value = 0;
		},
		change:function(){
			localStorage['time_diff'] = parseInt($(this).val());
		}
	}).appendTo('.setting_time_diff');
	$("<span style='margin-left:2px;'>*(单位:小时。设置该项后才可以使用“自动看球”功能。)</span>").appendTo('.setting_time_diff');
	$('<input type="button" value="开启自动看球功能" id="open_auto_match" class="auto_match_button submit"><input type="button" value="关闭自动看球功能" id="close_auto_match" class="auto_match_button submit"><input type="button" value="一键开启所有可选择比赛" id="" class="auto_match_button_all submit"><input type="button" value="清空订阅" id="" class="empty_auto submit"><p class="footnote" style="margin-right:20px;">自动看球功能可以在比赛开始后自动打开球赛链接，防止漏看比赛漏拿信用点。点击设定阵容右边"预订"即可（已预订后会显示已订）。<b>需要注意以下几点</b> 1.设置好时差，因为判断比赛是否开始用的是本地时间（国内也即北京时间）。例如英格兰的比赛时间今天0点，本地时间为今天8点，则时差输入框内输入-8。2.确保本页面没有关闭（如果关闭就无法执行JS）。3.电脑休眠或待机一段时间后建议刷新页面（保证时间正确）。4.程序每3分钟检查一次是否有比赛开始，故不会立刻就打开比赛页面。</p>').appendTo(".setting_time_button");
	$(".auto_match_button").on('click',function(){
		$(".auto_match_button").hide();
		var id = this.id;
		if(id == 'open_auto_match'){
			localStorage['auto_match'] = 1;
			$("#close_auto_match").show();
		}else{
			localStorage['auto_match'] = 0;
			$("#open_auto_match").show();
		}
	});
	$(".trig_auto_watch").on('click',function(){
		if(this.title == 'open'){
			localStorage['auto_match_span'] = 1;
			$('.setting_table').removeClass("trig_fold");
			this.title = 'close';
			$(this).html("收起");
		}else{
			localStorage['auto_match_span'] = 0;
			$('.setting_table').addClass("trig_fold");
			this.title = 'open';
			$(this).html("展开");
		}
	});
	$(".auto_match_button_all").on('click',function(){
		if(localStorage['auto_match'] == 0) alert("请先开启该功能");
		else $(".match_watch").click();
	});
	$(".empty_auto").on('click',function(){
		mStore.empty_match();
		window.location.reload();
	});

	//init
	if(localStorage['auto_match'] == 1) $("#open_auto_match").hide()
	else $("#close_auto_match").hide();

	var time_diff = localStorage['time_diff'];	
	$("#time_diff").val(time_diff);

	if(localStorage['auto_match_span'] == 1){
		$('.setting_table').removeClass("trig_fold");
		$('.trig_auto_watch').attr('title','close');
		$('.trig_auto_watch').html("收起");
	}
	//match button
	//mStore.empty_match();
	$(".lineup-link").each(function(){
		var href = $(this).attr("href");
		var match_msg = href.match(/^https:\/\/rockingsoccer.com\/[a-zA-z\/\-]*\/lineup\/match-([\d]*)$/);
		if(match_msg!=null){
			var match_id = parseInt(match_msg[1]);
			if(!mStore.isset_match(match_id))
			$('<a class="match_watch" href="javascript:void(0);" data-matchid="'+match_id+'" title="预订该场比赛，比赛开始时自动打开">预订</a>').click(function(){
				if(match_id >0){
					var time = $(this).parents().parents().find("td:first >span").attr("title");
					var msg = time.match(/[\s]{1}(.{1,2})月[\s]{1}([0-9]{1,2})[\s]([0-9]{4}),[\s]{1}([0-9]{2}):([0-9]{2})/);
					if(msg == null){
						var msg = time.match(/[\s]{1}(january|february|march|april|may|june|july|august|september|october|november|december)[\s]{1}([0-9]{1,2})[\s]([0-9]{4}),[\s]{1}([0-9]{2}):([0-9]{2})/);
						if(msg == null){
							var msg = time.match(/([0-9]{4}){1}(.{1,2})月([0-9]{1,2})[^\d]*([0-9]{2}):([0-9]{2})/);
							tmp = msg[1];msg[1] = msg[2];msg[2] = msg[3];msg[3] = tmp;
						}
					}
					if(msg!=null){
						mStore.add_match(match_id,msg[1],msg[2],msg[3],msg[4],msg[5]);
						$(this).removeClass("match_watch");
						$(this).addClass("match_watch_done");
						$(this).html("已订");
					}
				}
			}).insertAfter(this);
			else
			$('<a class="match_watch_done" data-matchid="'+match_id+'" title="已预订此场比赛">已订</a>').insertAfter(this);
		}
	});
	//check match per 3minutes
	function checkMatchTime(){
		if(typeof(localStorage['auto_match']) == 'undefined' || localStorage['auto_match'] == null) localStorage['auto_match'] = 1;
		if(localStorage['auto_match'] == 1){
			var mList = mStore.get_storeList();
			var diff = localStorage['time_diff'];
			var date = new Date();
			var datetime = parseInt(date.getTime())+parseInt(diff)*60*60*1000;
			$.each(mList,function(k,v){
				if(v.timestamp < datetime && v.timestamp > datetime -10 *60 *1000){
					//now open match url
					mStore.del_match(v.id);
					$("[data-matchid="+v.id+"]").removeClass("match_watch_done").html('已打开');
					window.open(geturl()+"info/match-"+v.id);
				}else if(v.timestamp + 10 *60 *1000 < datetime){
					mStore.del_match(v.id);
				}
			});
		}
	}
	//checkMatchTime();
	setInterval(checkMatchTime, 180000);
}