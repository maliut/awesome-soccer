var mStore = new rs_matchStore();
var url = window.location.href;
url = url.match(/match-([0-9]*)$/);
if(url != null) {
	match_id = parseInt(url[1]);
	function checkMatchTime(){
		if(match_id >0 && localStorage['auto_match'] == 1){
			var mList = mStore.get_storeList();
			var diff = localStorage['time_diff'];
			var date = new Date();
			var datetime = parseInt(date.getTime())+parseInt(diff)*60*60*1000;
			$.each(mList,function(k,v){
				if(v.id == match_id && v.timestamp > datetime && v.timestamp < datetime +10 *60 *1000){
					//now open match url
					mStore.del_match(v.id);
				}
			});
		}
	}
	checkMatchTime();
	var notes = $('.notes');
	if(notes.length>0){
		$("<div id='jutou'></div>").insertBefore(".scoreboard");
		$("<a class='jutou' title='未经比赛球队同意，请勿将剧透结果公布、发表在论坛、QQ群等公众场合。因此带来的人品损失，插件作者及围观群众均概不负责。'><br>剧透</a>").on('click',function(){
//			if(confirm("未经比赛球队同意，请勿将剧透结果公布、发表在论坛、QQ群等公众场合。因此带来的人品损失，插件作者及围观群众均概不负责。")){
				var notes = $('.notes');
				if(notes.length>0){
					var action = $(".notes>ul>li:first").attr("onclick");
					msg = action.match(/^player\.go_to\(([\d]*)\);$/);
					if(msg!=null && parseInt(msg[1])>0){
						$(".notes>ul>li:first").click();
					}
					$("jutou").hide();
				}else{
					$("#jutou").empty();
					//				$("#jutou").html('未获取到比分数据');
				}
//			}
		}).appendTo("#jutou");
	}
}
setListenPlayer('left');