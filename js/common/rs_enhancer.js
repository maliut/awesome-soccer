function changv(s) {
	var x = s.toString().split(".")
	var x2 = x.length > 1 ? '.' + x[1] : '';
	var s = x[0].toString().split(",").join("");
	//if(/[^0-9\.]/.test(s)) return "invalid value";
	s = s.replace(/^(\d*)$/, "$1.");
	s = (s).replace(/(\d*\.\d\d)\d*/, "$1");
	s = s.replace(".", ",");
	var re = /(\d)(\d{3},)/;
	while (re.test(s))
		s = s.replace(re, "$1,$2");
	s = s.replace(/,(\d\d)$/, ".$1");
	return s.replace(/^\./, "0.").substring(0, s.lastIndexOf(",")) + x2;
}
/*
function cc(num)
{  
   num  =  num+"";  
   var  re=/(-?\d+)(\d{3})/  
   while(re.test(num))
   {  
     num=num.replace(re,"$1,$2")  
   }  
   return  num;  
}
*/
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

function transferMoney(original_money_str) {
	var money_to_char = GM_getValue("currency_symbol", "");
	//alert(money_to_char);
	if (money_to_char == "" || money_to_char == null)
		return original_money_str;
	var money_to_rate_str = GM_getValue("currency_rate", "");
	var money_to_rate = parseFloat(money_to_rate_str);
	var money_original = parseInt(original_money_str.replace(/[^0-9]/ig, ""));
	var money_new = Math.round(money_original * money_to_rate);
	var money_new_str = money_to_char + changv(money_new);
	if (original_money_str[0] == '-')
		money_new_str = '-' + money_new_str;
	return money_new_str;
}

function getEx(value, per, type) {
	per = parseInt(per) / 100;
	var max = 0;
	var ratio = 1.0;

	switch (type) {
		case 'scoring':
			ratio = 1.037;
			value = (value * 20) / per;
			max = 11000;
			break;
		case 'passing':
			ratio = 1.036;
			value = (value * 20) / per;
			max = 10000;
			break;
		case 'dueling':
			ratio = 1.036;
			value = (value * 20) / per;
			max = 10000;
			break;
		case 'tactics':
			ratio = 1.036;
			value = value * 20;
			max = 10000;
			break;
		case 'blocking':
			var ratio = 1.039;
			value = (value * 20) / (1 - (1 - per) / 3.7);
			max = 13000;
			break;
		default:
			return false;
	}

	var sum = basenum = 200;
	for (var i = 1; i < value; i++) {
		basenum = basenum * ratio;
		var expCost = basenum;
		if (i >= value - 1) {
			expCost = basenum * (value - i);
		}
		if (expCost > max) {
			expCost = max;
		}
		sum += expCost;
	}
	return sum;
}

function parseAge(player_age_detail) {
	player_age_detail = player_age_detail.replace("周", "");
	var array = player_age_detail.split("岁");
	var player_age = parseInt(array[0]) + (parseInt(array[1]) / 52.0);
	return player_age.toFixed(2);
}

//四项属性，per是年龄百分比
function getTotalEx(scoring, passing, dueling, tactics, blocking, per) {
	return parseInt(getEx(blocking, per, 'blocking') + getEx(dueling, per, 'dueling') + getEx(passing, per, 'passing') + getEx(scoring, per, 'scoring') + getEx(tactics, per, 'tactics'));
}

function getPlayerScore(totalExp, player_age, talent_value, stamina_value, strength_value, speed_value, position) {
	var property_score = getPropertyScore(talent_value, stamina_value, strength_value, speed_value);
	var exp_score = getExpScore(totalExp, player_age);
	var score = parseFloat(exp_score) * parseFloat(property_score) / 100;
	score = parseInt(score);
	return parseInt(score);
}

function getoldPlayerScore(totalExp, player_age, talent_value, stamina_value, strength_value, speed_value, position) {
	var property_score = getPropertyScore(talent_value, stamina_value, strength_value, speed_value);
	var exp_score = getoldExpScore(totalExp, player_age);
	var score = parseFloat(exp_score) * parseFloat(property_score) / 100;
	score = parseInt(score);
	return parseInt(score);
}

function colorScore(value) {
	//if(typeof(value) == 'undefined' || value == '') return '暂无';
	value = parseFloat(value);
	if (value == 0) return '<font title="该球员年龄尚小（大于15岁26周）或未刷新数据">无</font>';
	var color;
	if (value >= 95) color = 'red';
	else if (value >= 90) color = '#930000';
	else if (value >= 85) color = '#D94600';
	else if (value >= 80) color = '#E800E8';
	else if (value >= 75) color = 'blue';
	else if (value >= 65) color = '#006666';
	else if (value >= 55) color = '#272727';
	else if (value >= 45) color = '#000000';
	else color = '#333333';
	return '<font color="' + color + '">' + value + '分</font>';
}


function bulkbuyticket() {
	$("a.tickets-link").each(function () {
		var ticketurl = $(this).attr("href");
		$.get(ticketurl, function (data, status) {
			var return_url = $(data).find('option:selected').val();
			buyticket(ticketurl, return_url);
		});
	});
	delayedReload();
}

function buyticket(post_url, return_url) {
	if (typeof (return_url) == 'undefined') {
		return;
	}
	$.post(post_url, { return_url: return_url, buy_ticket: '免费买票' });
}

function autoLogin() {
	var username = GM_getValue("currentUser", "");
	var password = GM_getValue("currentPassword", "");
	if (username != null && username != '' && password != null && password != '') {
		login(username, password);
	}
}
function login(username, password) {
	$.post(location.href, { username: username, password: password, login: "" });
	delayedReload(5000);
}

function delayedReload(time) {
	if (typeof (time) == "undefined") time = 2000;
	setTimeout(function () { location.reload(); }, time);
}

function buy_and_go_next_ticket(current_tickets_link_index, return_url) {
	if (current_tickets_link_index >= $("a.tickets-link").length) {
		$("#auto_buy_tickets_span").text("全部完成");
		return;
	}

	var current_tickets_link_a = $("a.tickets-link:eq(" + current_tickets_link_index + ")");

	var post_url = current_tickets_link_a.attr("href");
	var tickets_link_index = current_tickets_link_index + 1;

	if (((return_url.length > 0) && (return_url.indexOf("/soccer/info/match") < 0)) ||
		(post_url.indexOf("/soccer/info/match") < 0)) {
		$("#auto_buy_tickets_span").text("链接好像不是买票卖票的..放弃");
		return;
	}

	$.post(post_url, { return_url: return_url, buy_ticket: '免费买票' }, function (data) {
		$("#auto_buy_tickets_span").text("总共 " + $("a.tickets-link").length + " 个链接，已完成 " + tickets_link_index + " 个。");
		$("#auto_buy_tickets_div").append("<br />" + tickets_link_index + "<br />" + $("<div>" + data + "</div>").find('div.sys_notices').last().html());
		setTimeout(buy_and_go_next_ticket(++current_tickets_link_index, return_url), 1000);
	});
}

function chanllenge(start_time, team_id) {
	var url = 'https://rockingsoccer.com/zh/soccer/friendlies/friendlies/challenge';
	$.post(url, { start_time: start_time, challenge: "挑战", team_id: team_id, match_type: "" });
}

function addsettings(id, content) {
	var flag = GM_getValue(id, "");
	var string = '<tr><th>' + content + '</th>';
	string += '<td><input type="checkbox" id=' + id + ' name="' + id + '"';
	if (flag == 1) {
		string += 'checked="checked"';
	}
	string += '/></td></tr>';
	return string;
}

function getStar(span) {
	if (typeof GM_setValue == 'undefined') {
		return 0;
	}
	if (span == null) {
		return 0;
	}
	if (span.length < 3) {
		return span;
	}
	res = span.match(/title="([0-9\.]*)"/);
	if (res != null)
		return res[1];
	else {
		res = span.match(/([0-9\.]*)<\/span>/);
		if (res != null)
			return res[1];
		else
			return span;
	}
}

function getValue(msg, age) {
	if (age <= 21) {
		tmp = msg.match(/([0-9\.]+)[\s]*\-[\s]*([0-9\.]+)/);
		if (tmp != null) return { min: tmp[1], max: tmp[2] }
	}
	res = msg.match(/title="([0-9\.]*)"/);
	if (res == null) {
		res = msg.match(/([0-9\.]*)<\/span>/);
		if (res == null)
			return { min: 0, max: 0 };
	}
	return { min: res[1], max: res[1] };
}

function getmoney(msg) {
	var text = $("" + msg).text().replace(/[^0-9]/ig, "");
	//return parseInt(msg.text().replace(/[^0-9]/ig,""));
	return text;
}

function getValueSpan(numberMin, numberMax, title) {
	var spanclasss = "numeric-skill";
	numberMin = parseFloat(numberMin);
	numberMax = parseFloat(numberMax);
	if (numberMin < 3) {
		spanclass = "numeric-skill tiny";
	} else if (numberMin > 10) {
		spanclass = "numeric-skill red";
	} else if (numberMin > 5) {
		spanclass = "numeric-skill gold";
	} else {
		spanclass = "numeric-skill";
	}
	//<span class="numeric-skill gold" >6.05</span>
	var result = '<span class="' + spanclass + '" title="' + title + '">';
	if (numberMin != numberMax) {
		result += numberMin + '-' + numberMax;
	} else {
		result += numberMin;
	}
	result += '</span>';
	return result;
}

function genreateNumberSpan(number, title) {
	return getValueSpan(number, number, title);
}

function chanllenge(start_time, team_id) {
	var url = 'https://rockingsoccer.com/zh/soccer/friendlies/friendlies/challenge';
	$.post(url, { start_time: start_time, challenge: "挑战", team_id: team_id, match_type: "" });
}

function RSPlayer() {
	this.id = -1;
	this.name = "";

	this.nationality = "";
	this.isNT = 0;
	this.language = "";

	this.age_detail = "";
	this.age = 15.0;
	this.agePercent = 1.0;
	this.position = "";
	this.valueMin = 1.0;
	this.valueMax = 1.0;
	this.marketValue = 1000;
	this.bidPrice = 1000;

	this.talent = 1.0;//天赋
	this.endurance = 1.0;//耐力
	this.power = 1.0;//力量
	this.speed = 1.0;//速度
	this.tactics = 1.0;//战术

	this.scoring = 1.0;
	this.passing = 1.0;
	this.dueling = 1.0;
	this.blocking = 1.0;

	this.effectMainSkill = 0;
	this.totalExp = 0;//经验
	this.playerScore = 0;//综合分
	this.trainGrade = 0; //rs玉林训练等级
	this.expScore = 0;//经验分
	this.oldExpScore = 0;//老经验分
	this.propertyScore = 0;//属性分

	this.positionExp = 0;
	this.mainSkill = 1.0;
	this.mainProperty = 1.0;
	this.positionSkillName = "";
	this.positionName = "";

	this.specialSkill = "";//特殊技能

	this.birthInfomation = "";//出生信息
	this.trainInfomation = "";//训练备注
	this.scoreInfomation = "";//积分信息,用于显示在player页面
	this.clubname = "";//球队名称
	this.morale = "-"; // 训练状态（士气）


	this.updateScore = function () {
		var player_age_detail = "" + this.age_detail;
		this.agePercent = parseInt(player_age_detail.substr(player_age_detail.indexOf("(")).replace(/[^0-9]/ig, ""));
		//this.agePercent = parseInt(this.player_age_detail.substr(this.player_age_detail.indexOf("(")).replace(/[^0-9]/ig,""));
		this.totalExp = getTotalEx(this.scoring, this.passing, this.dueling, this.tactics, this.blocking, this.agePercent);
		this.playerScore = getPlayerScore(this.totalExp, this.age, this.talent, this.endurance, this.power, this.speed, this.position);
		this.trainGrade = getTrainGrade(this.totalExp, this.age, this.talent);     //rs改
		this.propertyScore = getPropertyScore(this.talent, this.endurance, this.power, this.speed, this.position);
		this.expScore = getExpScore(this.totalExp, this.age);
		this.newexpScore = getoldExpScore(this.totalExp, this.age);
	}

	this.parseDoc = function (msg) {
		var map = {};
		//get player name
		//msg = msg.match(/"two_cols_wide"[\s\S]*$/);
		//msg = msg.toString();
		var nameM = msg.match(/<h2[^>]*>([^<].*?)<\/h2>/);
		this.name = nameM[1];
		var re = /<th[\s]*>([\s\S].*?)<\/th><td[\s]*>([\s\S].*?)<\/td>/gi;
		/*
		msg1 = msg.match(/"vertical_table vt_col1"[\s\S]*<\/table>/gi);
		msg2 = msg.match(/"vertical_table vt_col3"[\s\S]*<\/table>/gi);
		while(r = re.exec(msg1)){
			map[r[1]] = r[2];
		}*/
		var tacticsStr = "";
		while (r = re.exec(msg)) {
			//results2.push(r[1]);
			map[r[1]] = r[2];
			if (r[2].indexOf("战术") > 0) {
				tacticsStr = r[2];
			}
		}

		r = re.exec(tacticsStr + "</td>");
		if (r) {
			map[r[1]] = r[2];
		}

		this.age_detail = map["年龄"];
		this.age = parseAge(this.age_detail);
		this.position = map["位置"];
		var valueData = getValue(map["价值"], parseInt(this.age));
		this.specialSkill = map["特殊技能"];
		this.marketValue = getmoney(map["市场价值 (估计值)"]);
		this.clubname = map["俱乐部"];

		this.valueMin = valueData.min;
		this.valueMax = valueData.max;

		this.talent = getStar(map["天赋"]);
		this.scoring = getStar(map["射门"]);
		this.endurance = getStar(map["耐力"]);
		this.passing = getStar(map["传球"]);
		this.power = getStar(map["力量"]);
		this.dueling = getStar(map["拼抢"]);
		this.speed = getStar(map["速度"]);
		this.blocking = getStar(map["拦截"]);
		this.tactics = getStar(map["战术"]);

		var attackExp = getStar(map["进攻"]);
		var midfieldExp = getStar(map["中场"]);
		var defenderExp = getStar(map["防守"]);
		var goalkeepingExp = getStar(map["守门"]);

		if (typeof (map["训练状态"]) != "undefined") {
			this.morale = map["训练状态"];
		}

		switch (this.position) {
			case '守门员':
			case 'Keeper':
				this.positionExp = goalkeepingExp;
				this.mainSkill = this.blocking;
				this.mainProperty = this.speed;
				this.positionSkillName = "拦截";
				this.positionName = "守门";
				break;
			case '前锋':
			case 'Forward':
				this.positionExp = attackExp;
				this.mainSkill = this.scoring;
				this.mainProperty = this.speed;
				this.positionSkillName = "射门";
				this.positionName = "进攻";
				break;
			case '中场':
			case 'Midfielder':
				this.positionExp = midfieldExp;
				this.mainSkill = this.passing;
				this.mainProperty = this.power;
				this.positionSkillName = "传球";
				this.positionName = "中场";
				break;
			case '后卫':
			case 'Defender':
				this.positionExp = defenderExp;
				this.mainSkill = this.dueling;
				this.mainProperty = this.power;
				this.positionSkillName = "拼抢";
				this.positionName = "防守";
				break;
			default:
				break;
		}
		this.updateScore();
	}



	this.parseBid = function (doc) {
		this.bidPrice = parseInt(doc.children("td:eq(10)").text().replace(/[^0-9]/ig, ""));
	}

	this.debug = function () {
		//alert(this.name + ":" + this.age_detail + "，天赋:" + this.talent);
	}
}



function needLogin() {
	if ($("[name='password']").length > 0) {
		if ($("[name='login']").length > 0) {
			return 1;
		}
	}
	return 0;
}

function getTrainIndexes(block) {

	var c1 = 0, c2 = 0, c3 = 0, c4 = 0, c5 = 0; // 依次：拦截，拼抢，传球，射门，战术
	if (location.href.indexOf('train-goalkeeping') >= 0) {
		c1 = 0.724;
		c2 = 0.0;
		c3 = 0.115;
		c4 = 0.0;
		c5 = 0.163;
	}
	else if (location.href.indexOf('train-defense') >= 0) {
		c1 = 0.207;
		c2 = 0.765;
		c3 = 0.015;
		c4 = 0.175;
		c5 = 0.439;
	}
	else if (location.href.indexOf('train-midfield') >= 0) {
		c1 = 0.055
		c2 = 0.218;
		c3 = 0.695;
		c4 = 0;
		c5 = 0.307;
	}
	else if (location.href.indexOf('train-attack') >= 0) {
		c1 = 0.002;
		c2 = 0.205;
		c3 = 0.16;
		c4 = 0.736;
		c5 = 0.189;
	}
	var c = [c1, c2, c3, c4, c5];

	var d = new Array();
	var p = new Array();
	for (var i = 0; i < 5; i++) {
		block = block.next();
		if (block.children().length > 0) {
			var form = block.children("div").first().children("form");
			var t1 = form.children("div.train_block").children("div.cost");
			var v1 = parseInt(t1.html().replace(",", ""));
			var p1 = 1000 * c[i] / v1;
			t1.parent().after("<div title='升星系数：" + c[i] + "'>+ " + p1.toFixed(3) + " 星</div>");
			var d1 = t1.parent().parent().children("div").last();
			d1.css("color", "blue");
			d1.css("font-size", "13px");

			d.push(d1);
			p.push(p1);
		}
	}

	var dmax = 0;
	var pmax = 0;

	for (var i = 0; i < d.length; i++) {
		if (p[i] > pmax) {
			pmax = p[i];
			dmax = d[i];
		}
	}
	if (dmax != 0) {
		dmax.css("color", "#990000");
		dmax.css("font-weight", "bold");
	}
}


var updatelog = '';
$(document).ready(function () {
	if (location.href.indexOf('https://rockingsoccer.com/') < 0)
		return;

	if (location.href.indexOf("https://rockingsoccer.com/zh/soccer/team_settings") >= 0) {
		$("ul.menu_2").first().append("<li><a href='?rs_enhancer_settings'>汇率设置<img src='/img/icons/new.png' alt='新的' class='icon'></a></li>");
	}
	if (location.href.indexOf('rs_enhancer_settings') >= 0) {
		var div = $("div#content");
		div.empty();
		div.append("<h3>汇率设置页面</h3>");
		//div.append('<p>&nbsp;在此可以修改插件设置</p>');
		div.append('<table class="vertical_table vt_col1"></table>');
		var table = $('table.vt_col1').last();
		//table.append(addsettings("usecss","设置css"));
		//table.append(addsettings("trainajax","训练页面显示球员注释(网络条件差时建议关掉)"));
		//table.append(addsettings("trainplugin","训练显示系数"));
		//table.append('<tr ><td colspan="2" ><input type="submit" value="保存" class="submit"  name="save_emailsettings"  /></td></tr>');
		div.append('<p>货币符号：<input type="text" id="currency_symbol_input" name="currency_symbol_input" value="' + GM_getValue("currency_symbol", "") + '" />&nbsp;换算汇率：<input type="text" id="currency_rate_input" name="currency_rate_input"  value="' + GM_getValue("currency_rate", "") + '"/>&nbsp;<a href="javascript:void();" id="submit_exchange_rate_a">[提交设置全局汇率]</a></p>');
		//div.append('<p>自动登录：<input type="text" id="currentUser" name="currentUser" value = "' + GM_getValue("currentUser","") + '"/> 密码<input type="password" id="currentPassword" name="currentPassword" value="' + GM_getValue("currentPassword","") + '"/>&nbsp;<a href="javascript:void();" id="submitAutoLogin">保存自动登录</a></p>');
		//div.append('<p>----------------------------------------------------------------------------</p><h3>版本更新记录</h3>');
		//div.append(updatelog);
		$("#submit_exchange_rate_a").click(function () {
			GM_setValue("currency_symbol", $("#currency_symbol_input").val());
			GM_setValue("currency_rate", $("#currency_rate_input").val());

			alert("设置全局货币符号为：" + GM_getValue("currency_symbol", "") + "，换算汇率为：" + GM_getValue("currency_rate", "") + "\n游戏中所有显示货币之处均将按此换算。\n不需要此功能时，将货币符号一栏设置为空即可。");

			delayedReload(0);
		});

		//		$("#submitAutoLogin").click(function()
		//		{
		//			GM_setValue("currentUser",$("#currentUser").val());
		//			GM_setValue("currentPassword",$("#currentPassword").val());
		//			alert("保存自动登录用户名密码");
		//		});
		$('.submit').click(function () {
			$("input[type='checkbox']").each(function () {
				var property = $(this).attr("name");
				if ($(this).is(":checked")) {
					GM_setValue(property, 1);
				} else {
					GM_setValue(property, 0);
				}
			});
			delayedReload(0);
		});
	}

	$("span.money-positive,span.money-negative").each(function () {
		$(this).text(transferMoney($(this).text()));
	});

	if (location.href.indexOf('https://rockingsoccer.com/zh/soccer/info/team-') >= 0) {
		var li_players = $("div.menu").children("ul").first().children("li").first().next();
		var url_parade = li_players.children("a").first().attr("href") + "?tournament_id=-1&youth=on&parade=maxwell";
		li_players.parent().append('<li><a href="' + url_parade + '" ><font color="red"><strong>大阅兵</strong></a></font></li>');

		if (location.href.indexOf('parade=maxwell') >= 0) {
			$("div.side").remove();
			$("div#menu").remove();
			$("div.center").attr("style", "width:105%");
			var href = location.href;
			var endIndex = href.indexOf('/players?tournament_id=-1');
			href = href.substring(0, endIndex);
			var teamname = $("div.center").last().children("h2").text();
			$("div.center").last().children("h2").last().append('<h3><span><a href="https://rockingsoccer.com/zh/soccer">返回首页</a> | <a href="' + href + '">返回' + teamname + '</a></span></h3>');
			$("div.center").last().children("form").last().remove();

			$("table.horizontal_table").attr("style", "width:120%");

			$("form:contains('所有赛事')").append('<input type="hidden" name="parade" value="maxwell" />');

			var thead_tr = $("table.horizontal_table").children("thead").children("tr").first();
			thead_tr.css("cursor", "pointer");

			thead_tr.html('<th>球员</th><th></th><th>年龄</th><th>位置</th><th>价值</th><th>天赋</th><th>耐力</th><th>力量</th><th>速度<th>射门</span></th><th>传球</th><th>拼抢</th><th>拦截</th><th>战术</th><th>位置</th><th>特殊技能</th><th>经验</th><th>综合</th><th>状态</th><th>身价</th>');

			thead_tr.children("th").css("color", "#ccc");
			thead_tr.children("th").bind({
				mouseenter: function () {
					$(this).css("color", "white")
				},
				mouseleave: function () {
					$(this).css("color", "#ccc")
				}
			});

			var player_num_total = $("table.horizontal_table").children("tbody").children("tr").length;
			var player_num = player_num_total;

			var player_age_total = 0;
			var player_star_total = 0;
			var player_talent_total = 0;
			var player_value_total = 0;

			$("table.horizontal_table").children("tbody").children("tr").each(function () {
				$(this).append("<td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>");
				$(this).children("td").css("background-color", "#B9D78C");

				$(this).children("td:eq(3)").html('<span title="' + $(this).children("td:eq(3)").children("span").first().attr("title") + '">' + $(this).children("td:eq(3)").html().substr(0, $(this).children("td:eq(3)").html().indexOf('(')) + '</span>');

				var player_href = $(this).children("td").first().children("a").first().attr("href");
				var thistr = $(this);


				var thisPlayer = new RSPlayer();
				/*$.ajax({
					type: "get",
					url: player_href + "/employment",
					success: function(data)
					{
						var footnote_obj = $("<div>"+data+"</div>").find("p.footnote");
						var footnote_str_digest = '-';
						var footnote_str = '';
						if (footnote_obj.length > 0)
						{
							footnote_str = footnote_obj.last().text();
							
							if (footnote_str.indexOf('信用点') >= 0)
								footnote_str_digest = footnote_str.substr(footnote_str.indexOf('使用')).replace(/[^0-9]/ig,"");
							else if (footnote_str.indexOf('青训') >= 0)
								footnote_str_digest = footnote_str.substr(footnote_str.indexOf('的')).replace(/[^0-9]/ig,"");
							else
								footnote_str_digest = '-';
						}
						thisPlayer.birthInfomation = '<span title="' + footnote_str + '">' + footnote_str_digest + '</span>';
						thistr.children("td:eq(17)").html(thisPlayer.birthInfomation);
					} 
				});*/

				$.ajax({
					type: "get",
					url: player_href,
					success: function (data) {
						thisPlayer.parseDoc(data);


						//球员 年龄 位置 价值 天赋	耐力	力量	速度	射门	传球	拼抢	拦截	战术	位置经验	特殊技能	经验	综合 状态 身价
						//		2	3		4	5	6	7	8	9	10	11	12	13	14	15	    16	17   18  19
						thistr.children("td:eq(2)").html('<span title="' + thisPlayer.age_detail + '">' + thisPlayer.age + '</span>');
						thistr.children("td:eq(4)").html(getValueSpan(thisPlayer.valueMin, thisPlayer.valueMax, "价值"));
						thistr.children("td:eq(5)").html(genreateNumberSpan(thisPlayer.talent, "天赋"));
						thistr.children("td:eq(6)").html(genreateNumberSpan(thisPlayer.endurance, "耐力"));
						thistr.children("td:eq(7)").html(genreateNumberSpan(thisPlayer.power, "力量"));
						thistr.children("td:eq(8)").html(genreateNumberSpan(thisPlayer.speed, "速度"));
						thistr.children("td:eq(9)").html(genreateNumberSpan(thisPlayer.scoring, "射门"));
						thistr.children("td:eq(10)").html(genreateNumberSpan(thisPlayer.passing, "传球"));
						thistr.children("td:eq(11)").html(genreateNumberSpan(thisPlayer.dueling, "拼抢"));
						thistr.children("td:eq(12)").html(genreateNumberSpan(thisPlayer.blocking, "拦截"));
						thistr.children("td:eq(13)").html(genreateNumberSpan(thisPlayer.tactics, "战术"));
						thistr.children("td:eq(14)").html('<span title="' + thisPlayer.positionName + '">' + thisPlayer.positionExp + '</span>');
						thistr.children("td:eq(15)").html(thisPlayer.specialSkill);
						thistr.children("td:eq(16)").html('<span title="已加经验：' + thisPlayer.totalExp + '">' + thisPlayer.expScore + '</span>');
						thistr.children("td:eq(17)").html('<span title="身体：' + thisPlayer.propertyScore + '">' + thisPlayer.playerScore + '</span>');
						var thisPlayer_morale_num = thisPlayer.morale;
						thisPlayer_morale_num = thisPlayer_morale_num.replace(/[^0-9|-]/ig, "");
						thistr.children("td:eq(18)").html('<span title="' + thisPlayer.morale + '">' + thisPlayer_morale_num + '</span>');
						thistr.children("td:eq(19)").html(changv(thisPlayer.marketValue));
						var is_in_transfer = $("<div>" + data + "</div>").find("p.alert");
						var transfer_text = "";
						if (is_in_transfer.size() > 0) {
							if (is_in_transfer.first().html().indexOf('我要出价') >= 0) {
								transfer_text = "转会中";
							}
							else if (is_in_transfer.first().html().indexOf('我要租借') >= 0) {
								transfer_text = "可租借";
							}
							else {
							}

							thistr.children("td:eq(19)").append("<br/><strong><a href='" + is_in_transfer.children("a").first().attr("href") + "'>" + transfer_text + "</a></strong>");
						}

						player_age_total += parseFloat(thisPlayer.age);
						player_star_total += parseFloat(thisPlayer.valueMin);
						player_talent_total += parseFloat(thisPlayer.talent);
						player_value_total += parseInt(thisPlayer.marketValue);

						player_num--;
						if (player_num <= 0) {
							$("table.horizontal_table").append('<tfoot><tr><td><strong>' + teamname + '</strong></td><td><span title="总人数">' + player_num_total
								+ '</span></td><td><span title="平均年龄">' + (player_age_total / player_num_total).toFixed(2)
								+ '</span></td><td>&nbsp;</td><td><span title="平均价值"><strong>' + (player_star_total / player_num_total).toFixed(2)
								+ '</strong></span></td><td><span title="平均天赋">' + (player_talent_total / player_num_total).toFixed(2)
								+ '</span></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td><span title="总身价">' + changv(player_value_total)
								+ '</span></td></tr></tfoot>');

							var top15_player_list = new Array();
							var top15_player_star = new Array();
							var i = 0;
							var j = 0;
							var k = 0;
							var ga = 0;
							var de = 0;
							var mi = 0;
							var at = 0;
							for (i = 0; i < 15; i++) {
								top15_player_list[i] = -1;
								top15_player_star[i] = 0;
							}

							for (j = 0; j < player_num_total; j++) {
								var temp_player_postion = $("table.horizontal_table").children("tbody").children("tr:eq(" + j + ")").children("td:eq(3)").text();
								var temp_player_star = parseFloat($("table.horizontal_table").children("tbody").children("tr:eq(" + j + ")").children("td:eq(4)").text());
								if (temp_player_postion.indexOf("守门员") >= 0) {

									if (top15_player_star[14] < temp_player_star) {
										top15_player_star[14] = temp_player_star;
										top15_player_list[14] = j;
									}
									ga = 1;
								}
								if (temp_player_postion.indexOf("后卫") >= 0) {
									for (k = 13; (k >= 8) && (top15_player_star[k] < temp_player_star); k--) {
										if (k > 8) {
											top15_player_star[k] = top15_player_star[k - 1];
											top15_player_list[k] = top15_player_list[k - 1];
										}
									}

									if (k < 13) {
										top15_player_star[k + 1] = temp_player_star;
										top15_player_list[k + 1] = j;
									}
								}

								if (temp_player_postion.indexOf("中场") >= 0) {
									for (k = 7; (k >= 3) && (top15_player_star[k] < temp_player_star); k--) {
										if (k > 3) {
											top15_player_star[k] = top15_player_star[k - 1];
											top15_player_list[k] = top15_player_list[k - 1];
										}
									}

									if (k < 7) {
										top15_player_star[k + 1] = temp_player_star;
										top15_player_list[k + 1] = j;
									}
								}

								if (temp_player_postion.indexOf("前锋") >= 0) {
									for (k = 2; (k >= 0) && (top15_player_star[k] < temp_player_star); k--) {
										if (k > 0) {
											top15_player_star[k] = top15_player_star[k - 1];
											top15_player_list[k] = top15_player_list[k - 1];
										}
									}

									if (k < 2) {
										top15_player_star[k + 1] = temp_player_star;
										top15_player_list[k + 1] = j;
									}
								}
							}

							var player_age_top15 = 0;
							var player_star_top15 = 0;
							var player_talent_top15 = 0;
							var player_value_top15 = 0;

							for (i = 0; i < 15; i++) {
								if (top15_player_list[i] < 0)
									continue;
								var current_player_tr = $("table.horizontal_table").children("tbody").children("tr:eq(" + top15_player_list[i] + ")");

								current_player_tr.children("td:eq(0)").css("font-weight", "bold");
								player_age_top15 += parseFloat(current_player_tr.children("td:eq(2)").text());
								player_star_top15 += parseFloat(current_player_tr.children("td:eq(4)").text());
								player_talent_top15 += parseFloat(current_player_tr.children("td:eq(5)").text());
								player_value_top15 += parseFloat(current_player_tr.children("td:eq(19)").text().replace(/[^0-9]/ig, ""));

							}

							var de_player_star_topall = 0;
							var mi_player_star_topall = 0;
							var at_player_star_topall = 0;
							var player_star_top532 = 0;
							var player_star_top442 = 0;

							var ga_player_star_top = top15_player_star[14];
							for (i = 0; i < 3; i++) {
								if (top15_player_list[i] < 0)
									break;
								at_player_star_topall += top15_player_star[i];
								at++;
							}
							var at_player_star_top = 0;
							if (at > 0) at_player_star_top = at_player_star_topall / at;
							for (i = 3; i < 8; i++) {
								if (top15_player_list[i] < 0)
									break;
								mi_player_star_topall += top15_player_star[i];
								mi++;
							}
							var mi_player_star_top = 0;
							if (mi > 0) mi_player_star_top = mi_player_star_topall / mi;
							for (i = 8; i < 14; i++) {
								if (top15_player_list[i] < 0)
									break;
								de_player_star_topall += top15_player_star[i];
								de++;
							}
							var de_player_star_top = 0;
							if (de > 0) de_player_star_top = de_player_star_topall / de;
							var al = ga + de + mi + at;

							for (i = 0; i < 2; i++) player_star_top532 += top15_player_star[i];
							for (i = 3; i < 6; i++) player_star_top532 += top15_player_star[i];
							for (i = 8; i < 13; i++) player_star_top532 += top15_player_star[i];
							player_star_top532 = (player_star_top532 + top15_player_star[14]) / 11;

							for (i = 0; i < 2; i++) player_star_top442 += top15_player_star[i];
							for (i = 3; i < 7; i++) player_star_top442 += top15_player_star[i];
							for (i = 8; i < 12; i++) player_star_top442 += top15_player_star[i];
							player_star_top442 = (player_star_top442 + top15_player_star[14]) / 11;

							$("table.horizontal_table").children("tfoot").append('<tr><td><span title="按价值最高，守门员1，后卫6，中场5，前锋3"><strong>&gt;&gt;&nbsp;最强15人</strong></span></td><td><span title="有效人数">' + al + '</span></td><td><span title="平均年龄">' + (player_age_top15 / al).toFixed(2) + '</span></td><td>&nbsp;</td><td><span title="平均价值"><strong>' + (player_star_top15 / al).toFixed(2) + '</strong></span></td><td><span title="平均天赋">' + (player_talent_top15 / al).toFixed(2) + '</span></td><td><strong>守门</strong></td><td><span title="守门' + ga + '人">' + ga_player_star_top.toFixed(2) + '</span></td><td><strong>后卫</strong></td><td><span title="后卫' + de + '人">' + de_player_star_top.toFixed(2) + '</span></td><td><strong>中场</strong></td><td><span title="中场' + mi + '人">' + mi_player_star_top.toFixed(2) + '</span></td><td><strong>前锋</strong></td><td><span title="前锋' + at + '人">' + at_player_star_top.toFixed(2) + '</span></td><td><strong>最强532</strong></td><td>' + player_star_top532.toFixed(2) + '</td><td><strong>最强442</strong></td><td>' + player_star_top442.toFixed(2) + '</td><td>&nbsp;</td><td><span title="' + al + '人总身价">' + changv(player_value_top15) + '</span></td></tr>');
							$("table.horizontal_table").tablesorter();
						}
					}
				});
			});
		}
	}

	else if (location.href.indexOf("https://rockingsoccer.com/zh/soccer/league-ki.26/level-1/group-") >= " ") {
		var li_players = $("div.tab-menu").children("ul").first().children("li").first().next();
		var url_parade = li_players.children("a").first().attr("href") + "?tournament_id=-1&youth=on&parade=maxwell";
		li_players.parent().append('<li><a href="' + url_parade + '" ><font color="red"><strong>实力对比</strong></a></font></li>');
	}

	else if (location.href.indexOf("https://rockingsoccer.com/zh/soccer/facilities/scout/transferlist") >= 0) {
		var thead_tr = $("table.horizontal_table").children("thead").children("tr");
		thead_tr.append("<th>天赋</th><th>主技能</th><th>特殊技能</th><th>溢价率</th><th>经验</th><th>身体</th><th>状态</th>");
		thead_tr.css("cursor", "pointer");
		thead_tr.children("th").css("color", "#ccc");
		thead_tr.children("th").bind({
			mouseenter: function () {
				$(this).css("color", "white")
			},
			mouseleave: function () {
				$(this).css("color", "#ccc")
			}
		});
		//修改	
		thead_tr.append(thead_tr.children("th:eq(4)"));
		thead_tr.append(thead_tr.children("th:eq(9)"));
		thead_tr.append(thead_tr.children("th:eq(4)"));
		thead_tr.append(thead_tr.children("th:eq(4)"));

		var tbody_trs = $("table.horizontal_table").children("tbody").children("tr");
		var player_num = tbody_trs.length;

		tbody_trs.each(function () {
			var thisPlayer = new RSPlayer();
			var this_tr = $(this);
			var player_href = $(this).children("td:eq(0)").children("a:eq(1)").attr("href");
			this_tr.append("<td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>");
			//rs2			
			this_tr.append(this_tr.children("td:eq(4)"));
			this_tr.append(this_tr.children("td:eq(9)"));
			this_tr.append(this_tr.children("td:eq(4)"));
			this_tr.append(this_tr.children("td:eq(4)"));

			thisPlayer.parseBid(this_tr);
			$.ajax({
				type: "get",
				url: player_href,
				success: function (data) {
					thisPlayer.parseDoc(data);
					var premium_rate = parseInt(thisPlayer.bidPrice * 100 / thisPlayer.marketValue);

					this_tr.children("td:eq(4)").html(genreateNumberSpan(thisPlayer.talent, "天赋"));
					this_tr.children("td:eq(5)").html(genreateNumberSpan(thisPlayer.mainSkill, thisPlayer.positionSkillName));
					this_tr.children("td:eq(6)").html(thisPlayer.specialSkill);
					this_tr.children("td:eq(11)").html(premium_rate + '%');
					this_tr.children("td:eq(7)").html('<span title="已加经验：' + thisPlayer.totalExp + '">' + thisPlayer.expScore + '</span>');
					var thisPlayer_morale_num = thisPlayer.morale;
					thisPlayer_morale_num = thisPlayer_morale_num.replace(/[^0-9|-]/ig, "");
					this_tr.children("td:eq(9)").html('<span title="' + thisPlayer.morale + '">' + thisPlayer_morale_num + '</span>');
					this_tr.children("td:eq(8)").html('<span title="天赋' + thisPlayer.talent + "\n" + '耐力' + thisPlayer.endurance + "\n" + '力量' + thisPlayer.power + "\n" + '速度' + thisPlayer.speed + '">' + thisPlayer.propertyScore + '</span>');
					player_num--;
					if (player_num <= 0) {
						$("table.horizontal_table").tablesorter();
					}
				}
			});
		});


	}



	else if (location.href.indexOf("https://rockingsoccer.com/zh/soccer/facilities/scout/players") >= 0) {
		var obj_ths = $("table.horizontal_table").children("thead").children("tr");
		obj_ths.children("th").last().text("截止时间");
		obj_ths.append("<th>挂牌价</th>");
		$("table.horizontal_table").children("tbody").children("tr").append("<td>&nbsp;</td>");

		$("a:contains('在转会名单上')").each(function () {
			var this_td = $(this).parent();
			var transfer_href = $(this).attr("href");

			$.ajax({
				type: "get",
				url: transfer_href,
				success: function (data) {
					var expire_time = $("<div>" + data + "</div>").find("tr:contains('截止时间')").children("td").first().text();
					var bid_price = $("<div>" + data + "</div>").find("div.sub_block:contains('挂牌价')").children("div:eq(1)").text();
					this_td.text(expire_time);
					this_td.next().text(bid_price);
				}
			});
		});
	}

	if ((location.href.indexOf("/soccer/league-") >= 0)
		&& (location.href.indexOf("results") >= 0)
	) {
		var buy_ticket_str = "";
		var tickets_a_num = $("a.tickets-link").length;

		if (tickets_a_num > 0) {
			var ticketurl = $("a.tickets-link").first().attr("href");

			$.get(ticketurl, function (data, status) {
				var select_return_url_html = $("<div>" + data + "</div>").find('select.return-url').last().parent().html();

				var buy_ticket_str = '&nbsp;' + select_return_url_html + '&nbsp;<span id="auto_buy_tickets_span"><a href="javascript:void(0)" id="auto_buy_tickets_a"><strong>自动购票</strong></a></span>';
				$("div.center").last().children("h3").last().append(buy_ticket_str);

				$("#auto_buy_tickets_a").click(function () {
					var tickets_a_num_done = 0;
					var return_url = $('select.return-url').children('option:selected').val();

					$("#auto_buy_tickets_span").after('<div id="auto_buy_tickets_div">你选择的回购链接：' + ((return_url.length > 0) ? return_url : '无') + '<br /></div>');

					buy_and_go_next_ticket(0, return_url);
				});
			});
		}
	}


	var usecss = GM_getValue("usecss", "");
	if (usecss == 1) {
		$("#content-wrapper").css("background-color", "#B9D8B4");

		var global_objs = $("html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, font, img, ins, kbd, q, s, samp, small, strike, strong, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td");
		global_objs.css("font-family", "微软雅黑");
		global_objs.css("font-size", "13px");
	}

	if ((location.href.indexOf("https://rockingsoccer.com/zh/soccer/friendlies/friendlies") >= 0) ||
		((location.href.indexOf('https://rockingsoccer.com/zh/soccer/info/team-') >= 0) && (location.href.indexOf('challenge') >= 0))) {
		$("select[name=start_time]").children("option").each(function () {
			var secs = parseInt($(this).val());
			var date = new Date(secs * 1000);
			var display_time = date.toLocaleDateString() + " " + date.toLocaleTimeString();
			$(this).text(display_time);
		});

		var first_option = $("select[name=start_time]").children("option").first();
		var first_secs = parseInt(first_option.val());
		var new_options = "";
		for (var i = 1; i <= 72; ++i) {
			var new_secs = first_secs + 3600 * i;
			var new_date = new Date(new_secs * 1000);
			var new_display_time = new_date.toLocaleDateString() + " " + new_date.toLocaleTimeString();
			new_options += '<option value="' + new_secs + '">' + new_display_time + '</option>';
		}
		first_option.after(new_options);


		$("div.center").append('<p><a href="javascript:void(0)" id="multichanllenge">挑战多次</a></p>');

		$("#multichanllenge").click(function () {
			var start_time = parseInt($("select[name=start_time]").find('option:selected').val());
			var team_id = $("input[name=team_id]").val();
			var times = 6;
			alert("已经向队伍" + team_id + "发出了" + times + "次友谊赛请求，请等待对方接受");
			var time = start_time;
			for (var i = 0; i < times; i++) {
				time = start_time + i * 7200;
				setTimeout(chanllenge(time, team_id), 1000 * (i + 1));
			}
		});
	}
	else if ((location.href.indexOf('https://rockingsoccer.com/zh/soccer/info/team-') >= 0) && (location.href.indexOf('shortlist') >= 0)) {
		var thead_tr = $("table.horizontal_table").children("thead").children("tr");
		thead_tr.append("<th>俱乐部</th>");
		thead_tr.css("cursor", "pointer");
		thead_tr.children("th").css("color", "#ccc");

		thead_tr.append(thead_tr.children("th:eq(4)"));
		thead_tr.append(thead_tr.children("th:eq(4)"));

		var tbody_trs = $("table.horizontal_table").children("tbody").children("tr");
		var player_num = tbody_trs.length;

		tbody_trs.each(function () {
			var thisPlayer = new RSPlayer();
			var this_tr = $(this);
			var player_href = $(this).children("td:eq(0)").children("a:eq(1)").attr("href");
			this_tr.append("<td>&nbsp;</td>");

			this_tr.append(this_tr.children("td:eq(4)"));
			this_tr.append(this_tr.children("td:eq(4)"));

			thisPlayer.parseBid(this_tr);
			$.ajax({
				type: "get",
				url: player_href,
				success: function (data) {
					thisPlayer.parseDoc(data);
					this_tr.children("td:eq(4)").html(thisPlayer.clubname);
				}
			});
		});
	}
});

