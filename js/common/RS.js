// common functions
window.RS = window.RS || {};

// base url
RS.URL = "https://rockingsoccer.com/zh/soccer/";

// convert currency text to num
// @example RS.currency("RSD 123 456 000") => 123456000
RS.currency = function(str) {
    let arr = str.split(/\s+/); // can not be " ", error in /players
    arr.splice(0, 1);
    return parseInt(arr.join(""));
};

/*******************************************************
 * class RS.Player
 *******************************************************/
// constructor
RS.Player = function(id) {
    this.id = id;
    this.storeId = "rs_player_" + id;
};

// get player info
RS.Player.prototype.getInfo = function(forceRefresh = false) {
    let playerInfo = null;
    if (!forceRefresh) playerInfo = this._getInfoFromCache();
    if (!playerInfo) playerInfo = this._getInfoFromHTML();
    return playerInfo;
};

// get player info from local storage, expire in 7 days
RS.Player.prototype._getInfoFromCache = function() {
    let playerInfo = JSON.parse(localStorage[this.storeId] ? localStorage[this.storeId] : null);
    if (!playerInfo || Date.now() - playerInfo.lastGet > 604800000) return null;    // 7 days
    return playerInfo;
};

// get player info from html. request html and then parse it.
RS.Player.prototype._getInfoFromHTML = function() {
    let playerInfo;
    if (window.location.href === RS.URL + "info/player-" + this.id) {
        playerInfo = this._parseInfoHTML($("body").html());    // 正处在当前页面，无需重复加载
    } else {
        let self = this;
        $.ajax({
            url: RS.URL + "info/player-" + this.id,
            async: false,
            success: function(html) {
                playerInfo = self._parseInfoHTML(html);
            }
        })
    }
    playerInfo.lastGet = Date.now();
    localStorage[this.storeId] = JSON.stringify(playerInfo);
    return playerInfo;
}

// parse player info from html at info/player-xxxxx page.
RS.Player.prototype._parseInfoHTML = function(html) {
    let info = this.info = {};  // player info
    let content = $(html).find(".center");
    info.name = $(content).find("h2")[0].innerText;
    let data = $(content).find(".vertical_table");
    let baseContent = data[0];
    let attrContent = data[1];
    let fixtContent = data[2];  // 固定属性训练次数
    // 基本信息
    $(baseContent.children[0]).children().each(function() {
        switch (this.children[0].innerText) {
            case "年龄":
                [info.age, info.week, info.percentage] = this.children[1].innerText.match(/\d+/g);
                info.week = parseInt(info.week);
                info.percentage = parseInt(info.percentage);
                info.age = (parseInt(info.age) + info.week / 52.0).toFixed(2);
                break;
            case "经验值":
                info.unusedExp = parseInt(this.children[1].innerText.split(",").join(""));
                break;
            case "特殊技能":
                info.isHardworking = (this.children[1].innerText.indexOf("勤恳") >= 0);
                info.skills = this.children[1].innerText.split("\n");
                break;
            case "位置":
                info.position = this.children[1].innerText;
                break;
        }
    });
    // 各项属性
    let lines = $(attrContent.children[1]).children();
    [info.talent, info.scoring] = [parseFloat(lines[0].children[1].innerText), parseFloat(lines[0].children[3].innerText)];
    [info.endurance, info.passing] = [parseFloat(lines[1].children[1].innerText), parseFloat(lines[1].children[3].innerText)];
    [info.power, info.dueling] = [parseFloat(lines[2].children[1].innerText), parseFloat(lines[2].children[3].innerText)];
    [info.speed, info.blocking] = [parseFloat(lines[3].children[1].innerText), parseFloat(lines[3].children[3].innerText)];
    info.tactics = parseFloat(lines[4].children[3].innerText);
    // 固定属性训练次数
    let tmp = $(fixtContent).find("td")[0];
    info.fixtTimes = tmp ? parseInt(tmp.innerText) : 0; // 有可能是老球员，不存在
    // 计算经验
    info.exp = this._getExpOf("blocking") + this._getExpOf("dueling") + this._getExpOf("passing") + this._getExpOf("scoring") + this._getExpOf("tactics");
    // TODO 技能和训练经验
    info.exp = parseInt(info.exp);
    // 计算分数
    info.trainingGrade = this._calculateTrainingGrade();
    info.propertyGrade = this._calculatePropertyGrade(info);
    info.expGrade = this._calculateExpGrade(info);
    info.overallGrade = parseInt(info.expGrade * info.propertyGrade / 100);
    console.log(info);
    return info;
}

// get experience of one trainable property
RS.Player.prototype._getExpOf = function(type) {
    let per = this.info.percentage / 100; 
    let ratio, value, max; 
    switch (type) {
		case "scoring": 
            ratio = 1.037; 
            value = (this.info.scoring * 20) / per; 
            max = 11000; 
            break;
		case "passing": 
            ratio = 1.036; 
            value = (this.info.passing * 20) / per; 
            max = 10000; 
            break;
		case "dueling":
            ratio = 1.036; 
            value = (this.info.dueling * 20) / per; 
            max = 10000; 
            break;
		case "tactics": 
            ratio = 1.036; 
            value = this.info.tactics * 20; 
            max = 10000; 
            break;
		case "blocking": 
            ratio = 1.039; 
            value = (this.info.blocking * 20) / Math.pow(per, 1 / 4); 
            max = 13000; 
            break;
		default: 
            return 0;
    }
    let sum = 200, basenum = 200;
    for (let i = 1; i < value; i++) {
        basenum *= ratio;
        let expCost = basenum;
        if (i >= value - 1) expCost = basenum * (value - i);
        if (expCost > max) expCost = max;
        sum += expCost;
    }
    return sum;
}

// calc by age, talent, exp
RS.Player.prototype._calculateTrainingGrade = function() {
    let info = this.info;
	let age = info.age - 15;
	let age1 = info.age - 16;
	let age2 = parseInt(age1);
	let age3 = parseInt((age1 - age2) * 53);
	let exp = info.talent * 120 * 52 + 9000 + 900;
	let exp11 = 9000 + 900;
	let exp12 = info.talent * 108 * 52 + 9000 + 900;
	let exp21 = info.talent * 120 * 52 + 10000 + 900;
	let exp22 = parseInt(info.age - 21) * exp21;
	let exp23 = 10000 + 900;
	let exp33 = parseInt(age) * exp + age3 * info.talent * 120;
	let exp41 = parseInt(exp11 / 52);
	let exp42 = parseInt(exp23 / 52);
	let grade;
	if (info.age < 15) { grade = 11; }
	else if (info.age < 16 && info.exp >= (age * 53) * info.talent * 120) { grade = 10; }
	else if (info.age < 16 && info.exp < (age * 53) * info.talent * 120) { grade = 9; }
	else if (info.age < 17 && info.exp >= exp33) { grade = 10; }
	else if (info.age < 17 && info.exp < exp33 && info.exp >= (age1 * 53) * info.talent * 108) { grade = 9; }
	else if (info.age < 17 && info.exp < exp33 && info.exp < (age1 * 53) * info.talent * 108) { grade = 8; }
	else if (info.age < 21 && info.exp >= exp33) { grade = 10; }
	else if (info.age < 21 && info.exp < exp33) {
		let exp1 = age2 * exp11 + age3 * exp41;
		let exp2 = info.exp - exp1;
		let i = parseInt(exp2 / (info.talent * (52 * age2 + age3)));
		if (i > 107) grade = 9;
		else if (i > 95) grade = 8;
		else if (i > 83) grade = 7;
		else if (i > 71) grade = 6;
		else grade = 5;
	}
	else if (info.exp > 6 * exp + exp22) { grade = 10; }
	else if (info.exp < 6 * exp + exp22) {
		let exp1 = 5 * exp11 + (age2 - 5) * exp23 + age3 * exp42;
		let i = parseInt((info.exp - exp1) / (info.talent * (52 * age2 + age3)));
		if (i > 107) grade = 9;
		else if (i > 95) grade = 8;
		else if (i > 83) grade = 7;
		else if (i > 71) grade = 6;
		else grade = 5;
	}
    return grade;
}

// calc property grade
RS.Player.prototype._calculatePropertyGrade = function() {
    let info = this.info;
    let property_score = info.talent * 1.5 + info.endurance + info.speed;
    property_score += (info.position === "守门员") ? 4.4 : info.power;
	property_score = property_score * 100 / 20.6;
	return parseInt(property_score);
}

// calc exp grade by exp and age
RS.Player.prototype._calculateExpGrade = function() {
    let info = this.info;
	if (info.age < 15.01) info.age = 15.01;
	let exp = (25 - info.age) * 48000;
	let exp_score = 100 * (info.exp + exp) / 480000;
	return parseInt(exp_score);
}

/*********************************************************
 * class RS.Trainer
 *********************************************************/
// constructor
RS.Trainer = function(html) {
    [this.level, this.addition] = this._parseHTML(html);
    this.base = this.level * 12;
}

// parse html to get info
RS.Trainer.prototype._parseHTML = function(html) {
    let block = $(html).find(".sideblock tbody")[0];
    let level = 0, addition = 0;
    $(block).children().each(function() {
        switch (this.children[0].innerText) {
            case "等级":
                level = parseInt(this.children[1].innerText);
                break;
            case "训练奖励":
                addition = parseInt(this.children[1].innerText.match(/\d+/)[0]);
                break;
        }
    });
    return [level, addition];
}