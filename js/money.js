// 为 RS 中的货币提供汇率转换功能
// 保证 RSD 完全准确，其他单位会有少量误差
(function() {
    const JPY = 123.45679;
    const CNY = 6.09;

    // for each money display
    $(".money-positive").each(function() {
        let rsd_text = $(this).attr("title");
        let rsd = RS.currency(rsd_text);
        $(this).attr("title", rsd_text + "\n" + format("JPY", JPY * rsd) + "\n" + format("CNY", CNY * rsd));
    });

    function format(prefix, num) {
        return prefix + " " + ("" + parseInt(num)).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
    }

}).call(this);