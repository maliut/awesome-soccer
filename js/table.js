// 为 RS 中的表格增加本地排序功能
(function() {
    // 屏蔽默认排序事件
    $(".sortable a").attr("href", "javascript:void(0)");
    // jquery 排序
    let flag = 1;   // 升序或降序
    let rows = $("#content tbody tr");
    $(".sortable").click(function() {
        flag = -flag;
        switch ($(this).text()) {
            case "市场价值":
                rows.sort(sort_by_market_value);
                break;
            case "周薪":
                rows.sort(sort_by_weekly_wage);
                break;
            case "年龄":
                rows.sort(sort_by_age);
                break;
            case "价值":
                rows.sort(sort_by_value);
                break;
        }
        $("#content tbody").empty();
        rows.each(function() {
            $("#content tbody").append($(this));
        })
    })

    function sort_by_market_value(a, b) {
        return (RS.currency(a.children[7].innerText) - RS.currency(b.children[7].innerText)) * flag;
    }

    function sort_by_weekly_wage(a, b) {
        return (RS.currency(a.children[6].innerText) - RS.currency(b.children[6].innerText)) * flag;
    }

    function sort_by_age(a, b) {
        return (parseInt(a.children[5].innerText) - parseInt(b.children[5].innerText)) * flag;
    }

    function sort_by_value(a, b) {
        return (parseFloat(a.children[3].innerText) - parseFloat(b.children[3].innerText)) * flag;
    }

}).call(this);