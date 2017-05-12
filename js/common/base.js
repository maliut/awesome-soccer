var refresh_switch = true;
var position_ex = {
'goalkeeping':{
'scoring':0,
'passing':0.115,
'dueling':0,
'blocking':0.724,
'tactics':0.163,
},
'attack':{
'scoring':0.736,
'passing':0.16,
'dueling':0.205,
'blocking':0.002,
'tactics':0.189,
},
'midfield':{
'scoring':0,
'passing':0.695,
'dueling':0.218,
'blocking':0.055,
'tactics':0.307,
},
'defense':{
'scoring':0.175,
'passing':0.015,
'dueling':0.765,
'blocking':0.207,
'tactics':0.439,
},
}
function formatLongNum(ex){
	if(typeof(ex) != 'number') return '';
	else
	return ex.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
}
function geturl(){
	var url = window.location.href;
	var reg = /^https:\/\/[^\/]*rockingsoccer.com\/[^\/]*\/[^\/]*\//;
	return url.match(reg);
}
function getLoadingImg(){
	//	return '<img src="chrome-extension://mopjkbjieckbclilfmjlihiohjkkckdi/loading.gif">';
}
function setLoading(){
	var html_info = "正在加载请稍后...";
	$(".loading_v").html(html_info);
}
function endLoading(){
	$(".loading_v").empty();
}
function colorValueStarOld(min,max){
	if(min != max)
	return colorValue(min)+"<br>-<br>"+colorValue(max);
	else
	return colorValue(min);
}
function colorValueStar(min,max){
	var array = [];
	var str = '';
	var str_end = '';
	var gold = min -5;
	if(gold >0){
		array.unshift({
			width:(parseInt(gold)+1)*14,
			sclass:'star-skill'
		});
	}else{
		gold = 0;
	}
	var sil = min - gold;
	array.unshift({
		width:parseInt(sil*14),
		sclass:'star-silver-skill'
	});
	if(min!=max){
		var max_star = max - gold;
		array.unshift({
			width:parseInt(max_star*14),
			sclass:'star-outline-skill'
		});
		var title = "该球员的价值为："+parseFloat(min).toFixed(2)+"-"+parseFloat(max).toFixed(2)+"★\r\n\r\n注：点击可切换显示方式";
	}else{
		var title = "该球员的价值为："+parseFloat(min).toFixed(2)+"★\r\n\r\n注：点击可切换显示方式";
	}
	$.each(array,function(k,v){
		str += '<span class="'+v.sclass+'" style="width:'+v.width+'px;"';
		if(k == 0) str+= ' title="'+title+'" show-type="star" ';
		str += ">";
		str_end += "</span>";
	});
	str = ''+str + str_end+"<span show-type='num' style='display:none;' title='"+title+"'>"+colorValueStarOld(min,max)+"</span>";
	return str;
}
function colorValuePic(value,title){
	value = parseFloat(value);
	value = value.toFixed(2);
	var array = [];
	var str = '';
	var str_end = '';
	var gold = value -5;
	if(gold >0){
		array.unshift({
			width:(parseInt(gold)+1)*12,
			sclass:'balls-gold-skill'
		});
	}else{
		gold = 0;
	}
	var sil = value - gold;
	array.unshift({
		width:parseInt(sil*12),
		sclass:'balls-skill'
	});
	title = title+"："+parseFloat(value).toFixed(2)+"★";
	$.each(array,function(k,v){
		str += '<span class="'+v.sclass+'" style="width:'+v.width+'px;"';
		if(k == 0) str+= ' title="'+title+'" ';
		str += ">";
		str_end += "</span>";
	});
	str = ''+str + str_end;
	return str;
}
function colorValue(value,title){
	value = parseFloat(value);
	value = value.toFixed(2);
	var color;
	if(value >=7)  color = 'red';
	else if(value >=6) color = '#930000';
	else if(value >=5) color = '#D94600';
	else if(value >=4) color = '#E800E8';
	else if(value >=3) color = 'blue';
	else if(value >=2) color = '#006666';
	else if(value >=1) color = '#272727';
	else  color = '#ADADAD';
	if(typeof(title) != 'undefined'){
		title = title+":"+value+"★";
	}else{
		title = '';
	}
	return '<font color="'+color+'" title="'+title+'">'+value+'</font>';
}
function colorScore(value,title){
	if(typeof(value) == 'undefined' || value == '') return '暂无';
	value = parseFloat(value);
	if(value == 0) return '<font title="该球员年龄尚小（大于16岁26周）或未刷新数据">无</font>';
	var color;
	if(value >=95)  color = 'red';
	else if(value >=90) color = '#930000';
	else if(value >=85) color = '#D94600';
	else if(value >=80) color = '#E800E8';
	else if(value >=75) color = 'blue';
	else if(value >=65) color = '#006666';
	else if(value >=55) color = '#272727';
	else if(value >=45) color = '#000000';
	else  color = '#333333';
	if(typeof(title) != 'undefined'){
		title = title+":"+value+"分";
	}else{
		title = '';
	}
	return '<font color="'+color+'" title="'+title+'">'+value+'分</font>';
}
//rs2
function colorScore_1(value){
	if(typeof(value) == 'undefined' || value == '') return '暂无';
	value = parseFloat(value);
//	if(value == 0) return '<font title="该球员年龄尚小（大于16岁26周）或未刷新数据">无</font>';
	var color;
	if(value >=95)  color = 'red';
	else if(value >=90) color = '#930000';
	else if(value >=85) color = '#D94600';
	else if(value >=80) color = '#E800E8';
	else if(value >=75) color = 'blue';
	else if(value >=65) color = '#006666';
	else if(value >=55) color = '#272727';
	else if(value >=45) color = '#000000';
	else  color = '#333333';
	
	return '<font color="'+color+'" >'+value+'</font>';
}
function colorScore_2(value){
	if(typeof(value) == 'undefined' || value == '') return '见球员信息';
	value = parseInt(value);
//	value = parseFloat(value);
	var grade ='超级娃';
	var color;
	if(value == 11)  color = 'red';
	else if(value ==10) {color = '#930000',grade ='十训';}
	else if(value ==9) {color = '#D94600',grade ='九训';}
	else if(value ==8) {color = '#E800E8',grade ='八训'}
	else if(value ==7) {color = 'blue',grade ='七训';}
	else if(value ==6) {color = '#006666',grade ='六训';}
	else  {color = '#333333',grade ='五训及以下';}
	
	return '<font color="'+color+'" >'+grade.toString()+'</font>';
//	return '<font color="'+color+'" >'+value+'</font>';
}
function colorScore_3(value){
//	if(typeof(value) == 'undefined' || value == '') return '暂无';
	value = parseFloat(value);
//	if(value == 0) return '<font title="该球员年龄尚小（大于16岁26周）或未刷新数据">无</font>';
	var color;
	if(value > 10)  color = '#930000';
	else if(value > 5)  color = '#ff6700';
	else color = '#000000';
	
	return '<font color="'+color+'" >'+value+'</font>';
}
function positionAttribute(position){
	if(typeof(position) == 'undefined' || position == '') return '出错';
	var po;
	switch(position){
		case '守门员': po = '守门';break;
		case 'Keeper': po = '守门';break;
		case '前锋': po = '进攻';break;
		case 'Forward': po = '进攻';break;
		case '中场': po = '中场';break;
		case 'Midfielder': po = '中场';break;
		case '后卫': po = '防守';break;
		case 'Defender': po = '防守';break;
		default:return false;
		}
	return po.toString();
	}

function RSDToRMB(value){
	if(typeof(value) == 'undefined' || value == '') return 0;
	value = value.toString().replace(/\s+/g,"");
//	value = value.toString().replace(/[^0-9]/ig,"");
	var rate = 6.25;
	value = parseInt(rate*value/1000)*1000;
	return value;
}

//

function checkUpDown(after,now){
	if(parseInt(after) == 0 || parseInt(now) == 0) return "";
	var diff = after - now;
	if( diff != 0 && diff<=10 && diff >=-10) {
		diff = parseFloat(diff);
		diff = diff.toFixed(2);
	}
	if(diff < 0){
		return '<br><span style="color:#66FF00;" title="下个赛季该球员将降低价值'+diff+'">↓'+diff+'</span>';
	}else if(diff >0){
		return '<br><span style="color:red;" title="下个赛季该球员将提升价值'+diff+'">↑'+diff+'</span>';
	}else{
		return "";
	}
}
function checkGrow(after,now){
	var diff = after - now;
	if( diff != 0 && diff<=10 && diff >=-10) {
		diff = parseFloat(diff);
		diff = diff.toFixed(2);
		diff_str = diff;
	}else{
		diff_str = formatLongNum(diff);
	}
	var addclass = '';
	if(localStorage['updown_color_type'] == '1'){
		addclass = 'ud_style1';
	}
	if(diff < -1000){
		return '<span class="updown_value updown_down '+addclass+'" title="降低了RSD '+diff_str+'">↓¥'+formatLongNum(RSDToRMB(diff_str))+'</span>';
	}else if(diff < 0){
		return '<span class="updown_value updown_down '+addclass+'" title="降低了 '+diff_str+'">↓'+diff_str+'</span>';
	}else if(diff > 1000){
		return '<span class="updown_value updown_up '+addclass+'" title="增加了RSD '+diff_str+'">↑¥'+formatLongNum(RSDToRMB(diff_str))+'</span>';
	}else if(diff > 0){
		return '<span class="updown_value updown_up '+addclass+'" title="增加了 '+diff_str+'">↑'+diff_str+'</span>';
	}else{
		return "";
	}
}
function isLogin(){
	//            return true;
	if($(".username").length>0) return true;
	else return false;
}
function print_r(array){
	var str = '';
	$.each(array,function(k,v){
		str += k+"->"+v+"\r\n";
	});
	alert(str);
}
function setListenPlayer(side){
	if(side != 'left') side = 'right';
	$("a[href *=player-]").mouseover(function(){
		$(".popTips").remove();
		var msg = $(this).attr("href");
		msg = msg.match(/^https:\/\/rockingsoccer.com\/[a-zA-z\/\-]*\/info\/player-([\d]*)$/);
		if(msg != null){
			if(parseInt(msg)<=0) return false;
			var player_id = msg[1];
			var this_obj = $(this);
			//        alert(obj.offset());
			var t = setTimeout(function(){
				this_obj.parents().find(".popTips").remove();
				var offset = this_obj.offset();
				if(side == 'right'){
					offset.top = offset.top - 310;
					offset.left = offset.left - 120;
				}else{
					offset.top =  offset.top - document.body.scrollTop;
					offset.left =  offset.left -300;
				}
				var tips = $( '<div class="popTips" style="display:none;"></div>' ).offset(offset);
				this_obj.after(tips).parents().find(".popTips").fadeIn('normal');
				this_obj.parents().find(".popTips").html('球员已经转职员');
				var player = new rs_player(player_id);
				var obj = player.getPlayerInfo();
				var sa = (obj.sa == '-')?'':'<font color="gray">'+obj.sa.replace("/<[^>]*br[^>]*>/gi","&nbsp;")+"</font>";
				var name_add_str = '<b>';
				if(obj.nt == 1) name_add_str += "<span title='这名球员是国脚'>(国脚)</span>";
				name_add_str += "</b>";
				var url = geturl();
				//                if(name_add_str != '<b></b>') name_add_str = "<br>"+name_add_str;
				
				//rs2  ¥ '+RSDToRMB(formatLongNum(parseInt(obj.vs)))+'
				var str = '<div class="contenter_card"><div class="attr_show_tr"><div class="attr_show_th">姓名</div><div class="attr_show_long"><a href="'+url+'player-'+obj.player_id+'">'+obj.name+'</a>'+name_add_str+'</div></div><div class="attr_show_tr"><div class="attr_show_th">年龄</div><div class="attr_show">'+obj.age+'岁'+obj.week+'周</div><div class="attr_show_th">健康</div><div class="attr_show">'+obj.per+'%</div>\
                </div><div class="attr_show_tr"><div class="attr_show_th">位置</div><div class="attr_show_long">'+obj.position+'</div>\
                </div><div class="attr_show_tr"><div class="attr_show_th">特技</div><div class="attr_show_long">'+sa+'&nbsp;</div>\
                </div><div class="attr_show_tr"><div class="attr_show_th">价值</div><div class="attr_show"> '+((obj.star_max==obj.star_min)?colorScore_3(formatLongNum(parseFloat(obj.star_max))):colorScore_3(formatLongNum(parseFloat(obj.star_min)))+'-'+colorScore_3(formatLongNum(parseFloat(obj.star_max))))+'</div><div class="attr_show_th">身价</div><div class="attr_show">¥ '+formatLongNum(RSDToRMB(parseInt(obj.vs)))+'\
                </div><div class="attr_show_tr"><div class="attr_show_th">训练</div><div class="attr_show">'+colorScore_2(obj.train_grade)+'&nbsp;</div>\
                <div class="attr_show_th">评分</div><div class="attr_show">'+colorScore_1(obj.totalScore) +'&nbsp;('+colorScore_1(obj.property_score) +','+colorScore_1(obj.exp_score) +')</div>\
                </div><div class="attr_show_tr"><div class="attr_show_th">经验</div><div class="attr_show">'+formatLongNum(obj.ex)+'&nbsp;</div>\
                <div class="attr_show_th">更新</div><div class="attr_show">'+(typeof(obj.last_get)!='undefined'?obj.last_get:'')+'&nbsp;</div>\
                </div><div class="attr_show_tr"><div class="attr_show_th">天赋</div><div class="attr_show">'+colorScore_3(formatLongNum(parseFloat(obj.talent)))+'</div><div class="attr_show_th">射门</div><div class="attr_show">'+colorScore_3(formatLongNum(parseFloat(obj.scoring)))+'\
                </div><div class="attr_show_tr"><div class="attr_show_th">耐力</div><div class="attr_show">'+colorScore_3(formatLongNum(parseFloat(obj.endurance)))+'</div><div class="attr_show_th">传球</div><div class="attr_show">'+colorScore_3(formatLongNum(parseFloat(obj.passing)))+'</div>\
                </div><div class="attr_show_tr"><div class="attr_show_th">力量</div><div class="attr_show">'+colorScore_3(formatLongNum(parseFloat(obj.power)))+'</div><div class="attr_show_th">拼抢</div><div class="attr_show">'+colorScore_3(formatLongNum(parseFloat(obj.dueling)))+'</div>\
                </div><div class="attr_show_tr"><div class="attr_show_th">速度</div><div class="attr_show">'+colorScore_3(formatLongNum(parseFloat(obj.speed)))+'</div></div><div class="attr_show_th">拦截</div><div class="attr_show">'+colorScore_3(formatLongNum(parseFloat(obj.blocking)))+'</div>\
                </div><div class="attr_show_tr"><div class="attr_show_th">'+positionAttribute(obj.position)+'</div><div class="attr_show">'+(obj.position=='前锋'?obj.attack:obj.position=='中场'?obj.midfield:obj.position=='后卫'?obj.defense:obj.goalkeeping)+'</div><div class="attr_show_th">战术</div><div class="attr_show">'+colorScore_3(formatLongNum(parseFloat(obj.tactics)))+'</div>\
                </div></div>';
				//改动部分结束
				
				this_obj.parents().find(".popTips").empty().append(str);
			},800);
			refreshcss();
			$(this).mouseleave(function(){
				//                var tl = setTimeout(function(){
				clearTimeout(t);
				$(this).parents().find('.popTips').remove();
				//                },200);
			});
		}
	});
}
function daysBetween(DateOne)
{
	var OneMonth = DateOne.substring(5,DateOne.lastIndexOf ('-'));
	var OneDay = DateOne.substring(DateOne.length,DateOne.lastIndexOf ('-')+1);
	var OneYear = DateOne.substring(0,DateOne.indexOf ('-'));
	var myDate = new Date();
	var date = myDate.getFullYear() +"/"+ (myDate.getMonth()+1) +"/"+myDate.getDate();
	var cha=((Date.parse(OneMonth+'/'+OneDay+'/'+OneYear)- Date.parse(date))/86400000);
	return Math.abs(cha);
}
function refreshcss(){
	$(".balls-gold-skill").css("background-image",'https://rockingsoccer.com/img/icons/balls-gold.png?v=1');
	$(".balls-skill").css("background-image",'https://rockingsoccer.com/img/icons/balls.png?v=1');
}