function getAddition(trainAddition){
		trainAddition = trainAddition.replace(/[^0-9\.]/ig,"");				
	return trainAddition;
}

function MyBuild(){
	this.trainBuild = 0;
	this.trainMultiple = 0;
	this.trainAddition = 0;
	
	this.trainDoc = function(msg){
		var map = {};

		var nameM = msg.match(/<h2[^>]*>([^<].*?)<\/h2>/);
		this.name = nameM[1];
		var re = /<th[\s]*>([\s\S].*?)<\/th><td[\s]*>([\s\S].*?)<\/td>/gi;
	
		var tacticsStr = "";
		while(r = re.exec(msg)){
			map[r[1]] = r[2];
//			if(r[2].indexOf("等级")>0){
//				tacticsStr = r[2];
//			}
		}

		r = re.exec(tacticsStr +"</td>");
		if(r){
			map[r[1]] = r[2];
		}

		this.trainBuild = getStar(map["等级"]);
//		this.trainMultiple = map["训练效果"];
		this.trainMultiple = this.trainBuild * 12;
		if(msg.indexOf("训练奖励") >= 0)
			this.trainAddition = getAddition(map["训练奖励"]);
		else
			this.trainAddition = 0;
	}
}

function futureExp(age,playerage,exp,talent,trainMultiple,trainAddition,skill){
	playerage = playerage.replace("周","");
	var array = playerage.split("岁");
//	var player_age = parseInt(array[0]) + (parseInt(array[1])/52.0);
//	alert(exp);
	if(age <= parseInt(array[0]))
		return '-';
	var fexp = 0 ;
	if(skill >= 0)
	fexp = parseInt(((age - parseInt(array[0]))*52- parseInt(array[1])) * talent * trainMultiple * ( 1 + trainAddition/100 ) + exp + (age - parseInt(array[0]) - parseInt(array[1])/52) * 10900 * 1.25);
	else
	fexp = parseInt(((age - parseInt(array[0]))*52- parseInt(array[1])) * talent * trainMultiple * ( 1 + trainAddition/100 ) + exp + (age - parseInt(array[0]) - parseInt(array[1])/52) * 10900);
	return parseInt(fexp);
}

function futurecExp(age,playerage,exp,talent,trainMultiple,trainAddition,skill,number,per,title){
	playerage = playerage.replace("周","");
	var array = playerage.split("岁");
	number = parseFloat(number);
	if(age <= parseInt(array[0]))
		return '-';
	var fexp = 0 ;
	if(skill >= 0)
	fexp = parseInt(((age - parseInt(array[0]))*52- parseInt(array[1])) * talent * trainMultiple * ( 1 + trainAddition/100 ) + exp + (age - parseInt(array[0]) - parseInt(array[1])/52) * 10900 * 1.25);
	else
	fexp = parseInt(((age - parseInt(array[0]))*52- parseInt(array[1])) * talent * trainMultiple * ( 1 + trainAddition/100 ) + exp + (age - parseInt(array[0]) - parseInt(array[1])/52) * 10900);
	per = parseInt(per)/100;
	var max = 0;
	var ratio = 1.0;
	var value = 1.0;
	switch(title){
		case '射门':
			value = player.scoring;
			ratio = 1.037;
			value = (value*20)/per;
			max = 11000;
			break;
		case '传球':
			value = player.passing;
			ratio = 1.036;
			value = (value*20)/per;
			max = 10000;
			break;
		case '拼抢':
			value = player.dueling;
			ratio = 1.036;
			value = (value*20)/per;
			max = 10000;
			break;
		case '战术':
			value = player.tactics;
			ratio = 1.036;
			value = value*20;
			max = 10000;
			break;
		case '拦截':
			value = player.blocking;
			var ratio = 1.039;
			value = (value*20)/(1-(1-per)/3.7);
			max = 13000;
			break;
		default:
			return false;
	}
	var cexp=fexp-exp;
	var basenum = 200;
	var i=1;
	var jd=0;
	value=Math.round(value);
	do{
		for(i;i<value;i++){
			basenum = basenum * ratio;
		}
		if(basenum>max){
			basenum=max;
		}
		jd=cexp/basenum;
		if(jd>1){
			var b=parseInt(basenum);
			cexp=cexp-b;
			value=value+1;
			/*number=number+0.05;*/
		}else{
			break;
		}
	}while(true)
	var Matt=0;
	var sh=1;
	if(age>21&&age<=25){
		sh=1.3693-0.0173*age;
	}else if(age>25&&age<=30){
		sh=1.5348-0.0238*age;
	}else if(age>30){
		sh=2.1286-0.0433*age;
	}
	if(sh<=0.1){
		sh=0.1;
	}
	Matt=value*0.05*sh;

	if(title=="拦截"){
		Matt=(Matt+value*0.05*2.7)/3.7;
	}
	return Matt.toFixed(2);
}

function futurecExpScoret(totalExp,player_age){
	player_age = parseFloat(player_age);
	if(player_age < 15.01){
		player_age = 15.01;
	}
	var exp = (25 - player_age)*46000;
	var exp_score = 100 * (totalExp + exp) / 460000;
	return parseInt(exp_score);
}
function futurecExpScores(totalExp,player_age){
	player_age = parseFloat(player_age);
	if(player_age < 15.01){
		player_age = 15.01;
	}
	var exp = (25 - player_age)*48000;
	var exp_score = 100 * (totalExp + exp) / 480000;
	return parseInt(exp_score);
}

		var player = new RSPlayer();
		var build = new MyBuild();
		var skill = 0;
		player.parseDoc($("div.center").html());
		var array = player.age_detail.split("岁");
		var age=parseInt(array[0])+1;
		skill = player.specialSkill.indexOf('勤恳');
		var trainBuild = 0;
		var trainMultiple = 0;
		var trainAddition = 0;
		$.ajax({
				type: "get",
				url: "https://rockingsoccer.com/zh/soccer/facilities/trainer",
				async : false,  //操作同步
				success: function(data)
				{
					build.trainDoc(data);					
					trainBuild = build.trainBuild;
					trainMultiple = build.trainMultiple;
					trainAddition = build.trainAddition;
//					alert(build.trainAddition);

				}
			});
		var a='<thead><tr><th>年龄</th><th>主属性</th><th>总经验</th><th>2.0经验分</th><th>3.0经验分</th></tr></thead>';
		for(var i=age;i<=35;i++){
			a+='<tbody class="new_table_tbody_'+i+'">';
		}
		a+='</tbody>';
		$('<h3>球员经验成长预估</h3><p id="add_store_note">训练等级：'+ trainBuild +' &nbsp;&nbsp;训练效果：'+ trainMultiple +'倍 &nbsp;&nbsp;职员加成：+'+ trainAddition +'%xp'+ ((skill >= 0)?'&nbsp;&nbsp;勤恳':'') +'</p><table class="horizontal_table" id="new_table"></table>').insertAfter($(".vt_col3"));
		$(a).appendTo("#new_table");
		for(var i=age;i<=35;i++){
			var exp=futureExp(i,player.age_detail,player.totalExp,player.talent,trainMultiple,trainAddition,skill);
			$('<tr><td>'+i+'</td><td>'
			+futurecExp(i,player.age_detail,player.totalExp,player.talent,trainMultiple,trainAddition,skill,player.mainSkill,player.agePercent,player.positionSkillName)+
			'</td><td>'
			+exp+
			'</td><td>'
			+futurecExpScoret(exp,i)+
			'</td><td>'
			+futurecExpScores(exp,i)+
			'</td></tr>').appendTo(".new_table_tbody_"+i+"");
		}
		
		