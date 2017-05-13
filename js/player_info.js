// 为 RS 的球员页面增加经验分功能
(function() {
    const regex = /^https:\/\/rockingsoccer.com\/[a-zA-z\/\-]*\/info\/player-([0-9]*)$/;
    let result = window.location.href.match(regex);
    if (!result) return;    // 保证在概览界面
    let player = new RS.Player(parseInt(result[1]));
    let info = player.getInfo(true);
    // 插入经验值和评分
    let exp_str = ("" + info.exp).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
    $(".vt_col1").first()
        .append('<tr><th>总经验值&nbsp;(估计值)</th><td>' + exp_str + 'ex </td></tr>')
        .append('<tr><th>球员评分 (估计值)</th><td>' + getTrainingGradeFont(info.trainingGrade) + '&nbsp;&nbsp;(&nbsp;' + 
            getScoreGradeFont(info.overallGrade) + '分&nbsp;&nbsp;属性&nbsp;' +
            getScoreGradeFont(info.propertyGrade) + '分&nbsp;&nbsp;经验3.0&nbsp;' +
            getScoreGradeFont(info.expGrade) + '分&nbsp;)</td></tr>');
    // 计算未来经验
    // 可以考虑缓存，当变化时让用户手动更新
    let trainer;
    $.ajax({
        type: "get",
        url: RS.URL + "facilities/trainer",
        async: false,
        success: function(html) {
            trainer = new RS.Trainer(html);
        }
    });
    $(".vt_col1").last()
        .after("<table id='future_exp_table' class='horizontal_table vt_col3' cellspacing='0'></table>")
        .after('<p>训练等级：' + trainer.level + ' &nbsp;&nbsp;训练效果：' + trainer.base + '倍 &nbsp;&nbsp;职员加成：+' + trainer.addition + '%xp' + (info.isHardworking ? '&nbsp;&nbsp;勤恳' : '') + '</p>')
        .after('<h3>球员经验成长预估</h3>');
    $("#future_exp_table").append("<thead><tr><th>年龄</th><th>主属性</th><th>总经验</th><th>3.0经验分</th></tr></thead><tbody></tbody>");
    let small_age = parseInt(info.age) + 1;
    for (let i = small_age; i <= 35; i++) {
        let exp = calculateFutureExp(info, i, trainer);
        let attr = calculateFutureAttr(info, i, exp);
        let grade = calculateFutureExpGrade(exp, i);
        $("#future_exp_table tbody").append("<tr><td>" + i + "</td><td>" + attr + "</td><td>" + parseInt(exp) + "</td><td>" + grade + "</td>");
    }

    // 训练等级文字
    function getTrainingGradeFont(grade) {
        const colors = ["#333333", "#006666", "#0000ff", "#e800e8", "#d94600", "#930000", "#ff0000"];
        const texts = ["五训及以下", "六训", "七训", "八训", "九训", "十训", "超级娃"];
        let index = parseInt(Math.max(0, grade - 5));
        return '<font color="' + colors[index] + '">' + texts[index] + '</font>';
    }

    // 训练分数文字
    function getScoreGradeFont(grade) {
        let color;
        if (grade >= 95) {
            color = '#ff0000';
        } else if (grade >= 90) {
            color = '#930000';
        } else if (grade >= 85) {
            color = '#D94600';
        } else if (grade >= 80) {
            color = '#E800E8';
        } else if (grade >= 75) {
            color = '#0000ff';
        } else if (grade >= 65) {
            color = '#006666';
        } else if (grade >= 55) {
            color = '#272727';
        } else if (grade >= 45) {
            color = '#000000';
        } else {
            color = '#333333';
        }
        return '<font color="' + color + '">' + grade + '</font>';
    }

    // 计算未来某年龄的经验
    function calculateFutureExp(info, age, trainer) {
        let deltaYear = age - parseInt(info.age);
        let exp = (deltaYear * 52 - info.week) * info.talent * trainer.base * (1 + trainer.addition / 100) + info.exp;
        exp += (age - info.age) * 10900 * (info.isHardworking ? 1.25 : 1);
        return exp;
    }

    // 计算未来某年龄的主属性
    function calculateFutureAttr(info, age, future_exp) {
        let per = info.percentage / 100, max = 0, ratio = 1.0, value = 1.0;
        switch (info.position) {
            case '前锋':
                value = info.scoring;
                ratio = 1.037;
                value = (value * 20) / per;
                max = 11000;
                break;
            case '中场':
                value = info.passing;
                ratio = 1.036;
                value = (value * 20) / per;
                max = 10000;
                break;
            case '后卫':
                value = info.dueling;
                ratio = 1.036;
                value = (value * 20) / per;
                max = 10000;
                break;
            case '守门员':
                value = info.blocking;
                ratio = 1.039;
                value = (value * 20) / (1 - (1 - per) / 3.7);
                max = 13000;
                break;
        }
        let cexp = future_exp - info.exp;
        let basenum = 200, jd = 0;
        value = Math.round(value);
        do {
            for (let i = 1; i < value; i++) basenum *= ratio;
            if (basenum > max) basenum = max;
            jd = cexp / basenum;
            if (jd > 1) {
                cexp = cexp - parseInt(basenum);
                value += 1;
            } else {
                break;
            }
        } while (true)
        let sh = 1;
        if (age > 21 && age <= 25) {
            sh = 1.3693 - 0.0173 * age;
        } else if (age > 25 && age <= 30) {
            sh = 1.5348 - 0.0238 * age;
        } else if (age > 30) {
            sh = 2.1286 - 0.0433 * age;
        }
        if (sh < 0.1) sh = 0.1;
        let attr = value * 0.05 * sh;
        if (info.position === "守门员") attr = (attr + value * 0.05 * 2.7) / 3.7;
        return attr.toFixed(2);
    }

    // 计算未来某年龄的经验分3.0
    function calculateFutureExpGrade(future_exp, age) {
        if (age < 15.01) age = 15.01;
        let exp = (25 - age) * 48000;
        let exp_score = 100 * (future_exp + exp) / 480000;
        return parseInt(exp_score);
    }

}).call(this);
