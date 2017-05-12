function rs_player(player_id) {
	this.player_id = player_id;
	this.store_id = 'rs_players_' + this.player_id;
	var store_id = 'rs_players_' + this.player_id;
	this.getPlayerInfo = function (force, is_cache) {
		var playerinfo = checkPlayerCache(force, is_cache);
		if (playerinfo === false) {
			playerinfo = anaRequest(force);
		}
		return playerinfo;
	}

	var anaRequest = function (force) {

		var playerinfo = checkPlayerCache(force);
		if (playerinfo === false) {
			var url = geturl() + "info/";
			//			alert(url+"player-"+player_id);
			//            $.ajax({url:url+"player-"+pid,async:false,success:function(msg){
			$.ajax({
				url: url + "player-" + player_id, async: false, success: function (msg) {
					//				alert(msg);
					playerinfo = getPlayerInfoByContent(msg, force);
				}
			});
		}
		return playerinfo;
	}
	this.anaRequest = anaRequest;
	var checkPlayerCache = function (force, is_cache) {
		if (force === true) return false;
		//        return false;
		if (typeof (localStorage[store_id]) == 'string') {
			playerinfo = JSON.parse(localStorage[store_id]);
		} else if (typeof (localStorage[store_id]) == 'object') {
			playerinfo = localStorage[store_id];
		} else {
			playerinfo = false;
		}
		if (is_cache !== true && playerinfo === false || typeof (playerinfo.last_get) == 'undefined' || daysBetween(playerinfo.last_get) > 7)
			playerinfo = false;
		return playerinfo;
	}
	var getPlayerInfoByContent = function (msg, force) {
		var playerinfo = checkPlayerCache(force);
		if (playerinfo === false) {
			var results1 = [];
			var results2 = [];
			//get player name
			msg = msg.match(/"two_cols_wide"[\s\S]*$/);
			msg = msg.toString();
			var name = msg.match(/<h2[^>]*>([^<].*?)<\/h2>/);
			name = name[1];
			//get player base info:age,position,etc.
			msg1 = msg.match(/"vertical_table vt_col1"[\s\S]*<\/table>/gi);
			//get player attr:power,talent,socring,etc.
			msg2 = msg.match(/"vertical_table vt_col3"[\s\S]*<\/table>/gi);
			var re = /<td[\s]*>([\s\S].*?)<\/td>/gi;
			while (r = re.exec(msg1)) {
				results1.push(r[1]);
			}
			while (r = re.exec(msg2)) {
				results2.push(r[1]);
			}
			playerinfo = anaPlayerInfo(name, results1, results2, 0);
		}
		return playerinfo;
	}
	//analysis html to player object
	var anaPlayerInfo = function (name, results1, results2, fromDom) {
		var age = parseInt(getAge(results1[2]));
		var week = parseInt(getWeek(results1[2]));
		var per = getPer(results1[2]);
		var country = getCountry(results1[0]);
		if (country != false) {
			var country_img = country.img;
			var country_src = country.src;
			var country_name = country.title;
		} else {
			var country_img = '';
			var country_src = '';
			var country_name = '';
		}
		//if player below 22,there will be one more <td>(age at season start)
		var index_add = 0;
		//if player is nt player,there will be one more <td>(nt country)
		var nt_add = 0;
		//if user login,there will be tow more <td>(weekly wage,yearly wage)
		var login_add = 0;
		//if user login,there will be tow more <td>(market value,market value Experimental)
		var login_mvalue_add = 0;
		if (parseInt(age) <= 22) {
			if (parseInt(results1[3]) > 0) {
				index_add = 1;
			}
		}
		if (isLogin()) {
			if (getmoney(results1[3 + index_add]))
				login_add = 2;
			login_mvalue_add = 1;
		}
		var club = getClub(results1[7 + login_add + index_add + login_mvalue_add]);
		var club_url = club.club_url;
		var club_name = club.club_name;
		//if player below 22,he will have a min_value and max_value.
		var value = getValue(results1[4 + login_add + index_add], age);//价值
		var min_value = max_value = 0;
		if (value != null) {
			min_value = value.min;
			max_value = value.max;
		}
		var jy = 0;
		if (results1[5 + login_add + index_add] != null) {
			jy = results1[5 + login_add + index_add];
			if (jy.indexOf("trainer/train-") == -1) {
				jy = 0;
			} else {
				jy = 1;
			}
		} else {
			jy = 0;
		}
		//test is nt player or not
		if (results1[login_add + 8 + index_add + login_mvalue_add] != null) {
			var nt = results1[login_add + 8 + index_add + login_mvalue_add];
			if (nt.indexOf("info/team-") === -1) {
				nt = 0;
			} else {
				var ntClub = getClub(results1[login_add + 8 + index_add + login_mvalue_add]);
				if (ntClub && ntClub.club_name == country_name)
					nt = 1;
				else
					nt = 0;
			}
		} else {
			nt = 0;
		}
		var is_loan = 0;
		if (getClub(results1[8 + login_add + index_add + login_mvalue_add + nt])) {
			is_loan = 2;
		}
		if (isLogin()) {
			ws = getmoney(results1[3 + index_add]);
			vs = getmoney(results1[6 + index_add + login_add + jy]);//身价
			//			alert(vs);
			//            vs_e = getmoney(results1[login_add+index_add+nt+login_mvalue_add+9+is_loan]);
		} else {
			ws = vs = vs_e = 0;
		}
		//spilt value
		//        var e_value = getValue(results1[login_add+8+index_add+nt+login_mvalue_add+is_loan],age);
		//        var e_min_value = e_max_value = 0;
		//        if(e_value != null){
		//            e_min_value = e_value.min;
		//            e_max_value = e_value.max;
		//        }
		var playerinfo = {
			name: name,
			player_id: player_id,
			country_img: country_img,
			country_src: country_src,
			country_name: country_name,
			club_url: club_url,
			login_add: login_add,
			jy: jy,
			index_add: index_add,
			club_name: club_name,
			is_loan: is_loan,
			age: getAge(results1[2]),
			week: week,
			per: per,
			position: results1[3 + login_add + index_add],
			star_min: min_value,
			star_max: max_value,
			sa: results1[5 + login_add + index_add + jy],//特殊技能
			ws: ws,
			vs: vs,
			nt: nt,
			//            vs_e:vs_e,
			talent: getStar(results2[0]),
			scoring: getStar(results2[1]),
			attack: getStar1(results2[2]),	//rs2
			endurance: getStar(results2[3]),
			passing: getStar(results2[4]),
			midfield: getStar1(results2[5]),	//rs2
			power: getStar(results2[6]),
			dueling: getStar(results2[7]),
			defense: getStar1(results2[8]),	//rs2
			speed: getStar(results2[9]),
			blocking: getStar(results2[10]),
			goalkeeping: getStar1(results2[11]),	//rs2
			tactics: getStar(results2[12 + fromDom]),
			//            star_min_e:e_min_value,
			//            star_max_e:e_max_value,
		};
		var ex = parseInt(getEx(playerinfo.blocking, playerinfo.per, 'blocking') + getEx(playerinfo.dueling, playerinfo.per, 'dueling') + getEx(playerinfo.passing, playerinfo.per, 'passing') + getEx(playerinfo.scoring, playerinfo.per, 'scoring') + getEx(playerinfo.tactics, playerinfo.per, 'tactics'));
		var pos_ex = parsePosition(playerinfo.position, playerinfo.per);
		if (age > 16 || (age == 16 && week > 26)) {
			var week_a = (age - 16) * 52 + week;
			if (week_a > 0) playerinfo.ex_per = parseInt(ex / week_a);
		}
		var age_t = (parseInt(age) + week / 52.0).toFixed(2);
		playerinfo.ex = ex;
		playerinfo.pos_ex = pos_ex;
		var score2 = getPlayerScore(ex, age_t, playerinfo.talent, playerinfo.endurance, playerinfo.power, playerinfo.speed, playerinfo.position, true);
		playerinfo.property_score2 = score2.property_score;
		playerinfo.totalScore2 = score2.score;
		playerinfo.exp_score2 = score2.exp_score;




		var score1 = getPlayerScore1(ex, age_t, playerinfo.talent, playerinfo.endurance, playerinfo.power, playerinfo.speed, playerinfo.position, true);
		playerinfo.property_score1 = score1.property_score;
		playerinfo.totalScore1 = score1.score;
		playerinfo.exp_score1 = score1.exp_score;


		//rs3
		var score = getPlayerScore2(ex, age_t, playerinfo.talent, playerinfo.endurance, playerinfo.power, playerinfo.speed, playerinfo.position, true);
		playerinfo.property_score = score.property_score;
		playerinfo.totalScore = score.score;
		playerinfo.exp_score = score.exp_score;
		playerinfo.train_grade = score.train_grade;
		//rs2
		var score2 = getPlayerScore3(ex, age_t, playerinfo.talent, playerinfo.endurance, playerinfo.power, playerinfo.speed, playerinfo.position, true);
		playerinfo.old_exp_score = score2.exp_score;

		//version 1.4.2 add
		if (isLogin()) {
			//version 1.3.9 add
			var myDate = new Date();
			var date = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate();
			playerinfo.last_get = date;
			getplayerinfo = checkPlayerCache();
			if (getplayerinfo === false || typeof (getplayerinfo.history) == 'undefined')
				playerinfo.history = [];
			else
				playerinfo.history = getplayerinfo.history;
			var p = playerinfo.history;
			if (p.length > 20) playerinfo.history.pop();
			//		playerinfo.history.unshift = {};
			//		alert(getplayerinfo.last_get);
			//		alert(date);
			if (getplayerinfo === false || getplayerinfo.last_get != date)
				playerinfo.history.unshift({
					star_min: min_value,
					star_max: max_value,
					ws: ws,
					vs: vs,
					talent: playerinfo.talent,
					scoring: playerinfo.scoring,
					attack: playerinfo.attack,	//rs2
					endurance: playerinfo.endurance,
					passing: playerinfo.passing,
					midfield: playerinfo.midfield,	//rs2
					power: playerinfo.power,
					dueling: playerinfo.dueling,
					defense: playerinfo.defense,		//rs2
					speed: playerinfo.speed,
					blocking: playerinfo.blocking,
					goalkeeping: playerinfo.goalkeeping,		//rs2
					tactics: playerinfo.tactics,
					last_get: date,
				});
		}
		//version 1.4.2 add end
		localStorage[store_id] = JSON.stringify(playerinfo);
		return playerinfo;
	}
	this.anaPlayerInfo = anaPlayerInfo;
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

	function getStar(msg) {
		res = msg.match(/title="([0-9\.]*)"/);
		if (res != null)
			return res[1];
		else {
			res = msg.match(/([0-9\.]*)<\/span>/);
			if (res != null)
				return res[1];
			else
				return 0;
		}
	}

	//rs2
	function getStar1(msg) {
		res = msg.match(/title="([0-9]*)"/);
		if (res != null)
			return res[1];
		//		return 99;
		else {
			res = msg.match(/([0-9]*)/);
			if (res != null)
				return res[1];
			//			return 88;
			else
				return 0;
		}
	}


	function getCountry(msg) {
		img = msg.match(/href="(.*?)"/);
		if (img != null)
			img = img[1];
		else
			return false;
		src = msg.match(/src="(.*?)"/);
		if (src != null)
			src = src[1];
		else
			return false;
		title = msg.match(/title="(.*?)"/);
		if (title != null)
			title = title[1];
		else
			return false;
		return { img: img, src: src, title: title };
	}

	function getClub(msg) {
		if (typeof (msg) == "undefined") return false;
		club = msg.match(/<a[\s]*href="([^"]*)"[\s]*><span[^>]*>(.*?)<\/[\s]*span[\s]*><\/[\s]*a[\s]*>/);
		if (typeof (club) != 'undefined' && club != null)
			return { club_url: club[1], club_name: club[2] }
		else
			return false;
	}

	function getAge(msg) {
		msg = msg.match(/^[0-9]*/);
		return msg;
	}
	function getWeek(msg) {
		msg = msg.match(/([0-9]{1,2})/g);
		if (msg != null)
			return msg[1];
		else
			return 0;
	}
	function getPer(msg) {
		msg = msg.match(/([0-9]*)%/);
		if (msg != null)
			return msg[1];
		else
			return 0;
	}

	function getmoney(msg) {
		msg = msg.replace(/[\s,\.]+/gi, "");
		msg = msg.replace(/[&nbsp;]+/gi, "");
		msg = msg.match(/[0-9]+/);
		return msg;
	}

	function getEx(value, per, type) {
		per = parseInt(per) / 100;
		var max = 0;
		switch (type) {
			case 'scoring': var ratio = 1.037; value = (value * 20) / per; max = 11000; break;
			case 'passing': var ratio = 1.036; value = (value * 20) / per; max = 10000; break;
			case 'dueling': var ratio = 1.036; value = (value * 20) / per; max = 10000; break;
			case 'tactics': var ratio = 1.036; value = value * 20; max = 10000; break;
			case 'blocking': var ratio = 1.039; value = (value * 20) / Math.pow(per, 1 / 4); max = 13000; break;
			default: return false;
		}
		//		alert(type+'->'+value);
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

	function train2Star(type, position, per) {
		per = parseInt(per) / 100;
		var value = 1;
		if (typeof (position_ex[position]) != 'undefined') {
			var obj = position_ex[position];
			switch (type) {
				case 'scoring': value = (value * per) / 20; break;
				case 'passing': value = (value * per) / 20; break;
				case 'dueling': value = (value * per) / 20; break;
				case 'tactics': value = value / 20; break;
				case 'blocking': value = Math.pow(per, 1 / 4) * value / 20; break;
				default: return false;
			}
			if (typeof (obj[type]) != 'undefined') {
				//here todo
				return parseFloat(parseFloat(obj[type]).toFixed(3) * value).toFixed(3);
			}
		}
		return false;
	}
	function parsePosition(position, per) {
		switch (position) {
			case '守门员': var po = 'goalkeeping'; break;
			case 'Keeper': var po = 'goalkeeping'; break;
			case '前锋': var po = 'attack'; break;
			case 'Forward': var po = 'attack'; break;
			case '中场': var po = 'midfield'; break;
			case 'Midfielder': var po = 'midfield'; break;
			case '后卫': var po = 'defense'; break;
			case 'Defender': var po = 'defense'; break;
			default: return false;
		}
		//		alert(po);
		if (typeof (position_ex[po]) != 'undefined') {
			var obj = {
				scoring: train2Star('scoring', po, per),
				passing: train2Star('passing', po, per),
				dueling: train2Star('dueling', po, per),
				tactics: train2Star('tactics', po, per),
				blocking: train2Star('blocking', po, per),
				//rs2
				//				attack:train2Star('attack',po,per),
				//				midfield:train2Star('midfield',po,per),
				//				defense:train2Star('defense',po,per),
				//				goalkeeping:train2Star('goalkeeping',po,per),
				po: po

			};
			return obj;
		}
		return false;
	}

	var isLogin = function () {
		//        return true;
		if ($(".username").length > 0) return true;
		else return false;
	}
	this.isLogin = isLogin;
}
function getEndTime(id) {
	if (parseInt(id) > 0) {
		var url = geturl() + "info/";
		var endtime;
		$.ajax({
			url: url + "player-" + id + "/transfer",
			async: false,
			success: function (msg) {
				endtime = checkEndTime(msg);
			}
		});
		return endtime;
	}
}
function checkEndTime(msg) {
	var results1 = [];
	msg = msg.match(/"two_cols_wide"[\s\S]*$/);
	msg = msg.toString();
	if (msg == null) return false;
	msg1 = msg.match(/"vertical_table vt_col1"[\s\S]*<\/table>/gi);
	if (msg == null) return false;
	var re = /<td[\s]*>([\s\S].*?)<\/td>/gi;
	while (r = re.exec(msg1)) {
		results1.push(r[1]);
	}
	console.log(results1);
	if (typeof (results1[7]) != 'undefined' && results1[7] != null && is_date(results1[7])) return results1[7];
	if (typeof (results1[8]) != 'undefined' && results1[8] != null && is_date(results1[8])) return results1[8];
	if (typeof (results1[6]) != 'undefined' && results1[6] != null && is_date(results1[6])) return results1[6];
}
function is_date(msg) {
	msg = msg.match(/[0-9]{2}:[0-9]{2}/);
	if (msg == null) return false;
	else return true;
}

function getPlayerScore(totalExp, player_age, talent_value, stamina_value, strength_value, speed_value, position, is_obj) {
	var property_score = getPropertyScore(talent_value, stamina_value, strength_value, speed_value, position);
	var exp_score = getExpScore(totalExp, player_age);
	var score = parseFloat(exp_score) * parseFloat(property_score) / 100;
	score = parseInt(score);
	return !!!is_obj ? parseInt(score) : { score: score, property_score: property_score, exp_score: exp_score };
}

//rs3
function getPlayerScore2(totalExp, player_age, talent_value, stamina_value, strength_value, speed_value, position, is_obj) {
	var property_score = getPropertyScore(talent_value, stamina_value, strength_value, speed_value, position);
	var exp_score = getExpScore(totalExp, player_age);
	var score = parseFloat(exp_score) * parseFloat(property_score) / 100;
	score = parseInt(score);
	var train_grade = getTrainGrade(totalExp, player_age, talent_value);
	return !!!is_obj ? parseInt(score) : { score: score, property_score: property_score, exp_score: exp_score, train_grade: train_grade };
}

//rs2
function getPlayerScore3(totalExp, player_age, talent_value, stamina_value, strength_value, speed_value, position, is_obj) {
	var property_score = getPropertyScore(talent_value, stamina_value, strength_value, speed_value, position);
	var exp_score = getoldExpScore(totalExp, player_age);
	var score = parseFloat(exp_score) * parseFloat(property_score) / 100;
	score = parseInt(score);
	var train_grade = getTrainGrade(totalExp, player_age, talent_value);
	return !!!is_obj ? parseInt(score) : { score: score, property_score: property_score, exp_score: exp_score, train_grade: train_grade };
}

function getPropertyScore(talent_value, stamina_value, strength_value, speed_value, position) {
	var property_score = parseFloat(talent_value) * 1.5 + parseFloat(stamina_value) + parseFloat(speed_value);
	if (position != '守门员' && position != 'Keeper') {
		property_score += parseFloat(strength_value);
	} else {
		property_score += 4.4;
	}
	property_score = property_score * 100 / 20.6;
	return parseInt(property_score);
}

function getExpScore(totalExp, player_age) {
	player_age = parseFloat(player_age);
	if (player_age < 15.01) {
		player_age = 15.01;
	}
	var exp = (25 - player_age) * 48000;
	var exp_score = 100 * (totalExp + exp) / 480000;
	// var exp_score = totalExp / 4300 - player_age*10 + 250;
	// var exp_score = 100 * totalExp / (43000*(player_age-15));
	return parseInt(exp_score);
}

function getoldExpScore(totalExp, player_age) {
	player_age = parseFloat(player_age);
	if (player_age < 15.01) {
		player_age = 15.01;
	}
	var exp = (25 - player_age) * 46000;
	var exp_score = 100 * (totalExp + exp) / 460000;
	return parseInt(exp_score);
}

//改：球员获得经验训练等级
function getTrainGrade(totalExp, player_age, talent_value) {
	player_age = parseFloat(player_age);
	var age = player_age - 15;
	var age1 = player_age - 16;
	var age2 = parseInt(age1);
	var age3 = parseInt((age1 - age2) * 53);
	var exp = talent_value * 120 * 52 + 9000 + 900;
	var exp11 = 9000 + 900;
	var exp12 = talent_value * 108 * 52 + 9000 + 900;
	var exp21 = talent_value * 120 * 52 + 10000 + 900;
	var exp22 = parseInt(player_age - 21) * exp21;
	var exp23 = 10000 + 900;
	var exp33 = parseInt(age) * exp + age3 * talent_value * 120;
	var exp41 = parseInt(exp11 / 52);
	var exp42 = parseInt(exp23 / 52);
	var grade;
	if (player_age < 15) { grade = 11; }
	else if (player_age < 16 && totalExp >= (age * 53) * talent_value * 120) { grade = 10; }
	else if (player_age < 16 && totalExp < (age * 53) * talent_value * 120) { grade = 9; }
	else if (player_age < 17 && totalExp >= exp33) { grade = 10; }
	else if (player_age < 17 && totalExp < exp33 && totalExp >= (age1 * 53) * talent_value * 108) { grade = 9; }
	else if (player_age < 17 && totalExp < exp33 && totalExp < (age1 * 53) * talent_value * 108) { grade = 8; }
	else if (player_age < 21 && totalExp >= exp33) { grade = 10; }
	else if (player_age < 21 && totalExp < exp33) {
		var exp1 = age2 * exp11 + age3 * exp41;
		var exp2 = totalExp - exp1;
		var i = parseInt(exp2 / (talent_value * (52 * age2 + age3)));
		if (i > 107) grade = 9;
		else if (i > 95) grade = 8;
		else if (i > 83) grade = 7;
		else if (i > 71) grade = 6;
		else grade = 5;
	}
	else if (totalExp > 6 * exp + exp22) { grade = 10; }
	else if (totalExp < 6 * exp + exp22) {
		var exp1 = 5 * exp11 + (age2 - 5) * exp23 + age3 * exp42;
		var i = parseInt((totalExp - exp1) / (talent_value * (52 * age2 + age3)));
		if (i > 107) grade = 9;
		else if (i > 95) grade = 8;
		else if (i > 83) grade = 7;
		else if (i > 71) grade = 6;
		else grade = 5;
	}

	return parseInt(grade);
	//	return parseFloat(grade);
}

function getPlayerScore1(totalExp, player_age, talent_value, stamina_value, strength_value, speed_value, is_obj) {
	var property_score = getPropertyScore1(talent_value, stamina_value, strength_value, speed_value);
	var exp_score = getExpScore1(totalExp, player_age);
	var score = parseFloat(exp_score) * parseFloat(property_score) / 100;
	score = parseInt(score);
	return !!!is_obj ? parseInt(score) : { score: score, property_score: property_score, exp_score: exp_score };
}

function getPropertyScore1(talent_value, stamina_value, strength_value, speed_value) {
	var property_score = parseFloat(talent_value) + parseFloat(stamina_value) + parseFloat(strength_value) + parseFloat(speed_value);
	property_score = property_score * 100 / 16;
	return parseInt(property_score);
}

function getExpScore1(totalExp, player_age) {
	player_age = parseFloat(player_age);
	if (player_age < 15) {
		player_age = 15;
	}
	var exp = (parseFloat(player_age) - 15) * 30000 + 1;
	var exp_score = 100 * totalExp / exp;
	return parseInt(exp_score);
}
