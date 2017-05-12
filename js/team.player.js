$(".horizontal_table").attr('id','hori_show_normal_table');
setListenPlayer();
$('<div id="rs_plugins" style="margin-top:5px;"> <div class="getplayerinfo"></div></div>').click(function(){
    //    getAllPlayerInfo();
    //    alert(player.isLogin());
}).insertBefore(".horizontal_table");
$('<a>&nbsp;</a><a style="margin-left:5px;display:none;" class="loading_v">正在加载请稍后...</a>').appendTo("#rs_plugins");
//$('').hide().appendTo("#rs_plugins");
$('<br>').appendTo("#rs_plugins");
$('<button class="hori_show_type" id="hori_show_normal">切换数据显示</a>').click(function(){
    //	var player = new rs_player(1);
    //	var obj = player.getPlayerInfo(true);
    //	return false;
    getAllPlayerInfo(false);
    var now_id = this.id;
    if(now_id == 'hori_show_normal') this.id = 'hori_show_sp';
    else this.id = 'hori_show_normal';
    $(".horizontal_table").hide();
    $("#"+this.id+"_table").show();
    $("#foce_hori_show").show();
}).appendTo("#rs_plugins");

$('<button class="hori_show_type" id="foce_hori_show" style="margin-left:25px;display:none;">数据不太对？强制刷新数据(勿频繁使用)</a>').click(function(){
    //    return false;
    $(".horizontal_table").hide();
    $("#hori_show_normal_table").show();
    $("#hori_show_sp_table").remove();
    getAllPlayerInfo(true);
    $(".horizontal_table").hide();
    $("#hori_show_sp_table").show();
    $("#foce_hori_show").hide();
}).appendTo("#rs_plugins");
function getAllPlayerInfo(force){
    if($("#hori_show_sp_table").length==0 || force === true){
        $(".hori_show_type").hide();
        $(".loading_v").show();
        alert("获取数据中。。请稍后");
        var pos_list = [1,4,4,2];
        var pos = [];
        var index = -1;
        var url = geturl()+"info/";
        var now_pos = '';
        var addable = false;
        var sum_vs = sum_talent = sum_star_min = sum_star_max = sum_value  = sum_g_value_min = sum_g_value_max = sum_g_talent = sum_d_value_min = sum_d_value_max = sum_d_talent = sum_m_value_min = sum_m_value_max = sum_m_talent = sum_s_value_min = sum_s_value_max = sum_s_talent = count_g = count_d = count_m = count_s = count = num = g_block = g_value_min = g_value_max = g_tactics = g_vs = d_dueling = d_value_min = d_value_max = d_tactics = d_vs = m_passing= m_value_min = m_value_max = m_tactics = m_vs = s_scoring = s_tactics = s_value_min = s_value_max = s_vs = g_talent = d_talent = m_talent = s_talent = 0;
        var sum_vs_e = sum_star_min_e = sum_star_max_e =  sum_g_value_min_e = sum_g_value_max_e = sum_d_value_min_e = sum_d_value_max_e = sum_m_value_min_e = sum_m_value_max_e = sum_s_value_min_e = sum_s_value_max_e = g_value_min_e = g_value_max_e = g_vs_e = d_value_min_e = d_value_max_e = d_vs_e = m_value_min_e = m_value_max_e = m_vs_e = s_value_min_e = s_value_max_e = s_vs_e = 0;
        //		$('<table class="horizontal_table" id="hori_show_sp_table" style="display:none;"><thead><tr><th>球员</th><th>年龄</th><th>位置</th><th>价值</th><th title="天赋">天赋</th><th title="耐力">耐力</th><th title="力量">力量</th><th title="速度">速度</th><th title="拦截">拦截</th><th title="阻断">阻断</th><th title="传球">传球</th><th title="射门">射门</th><th title="战术">战术</th><th title="特技">特技</th><th title="身价">身价</th></tr></thead><tbody class="hori_show_sp_table_tbody"></tbody></table>').insertBefore(".horizontal_table");
        //        $('<table class="horizontal_table" id="hori_show_sp_table" style="display:none;"><thead><tr><th>球员</th><th>年龄</th><th>位置</th><th>价值</th><th title="天赋">天赋</th><th title="耐力">耐力</th><th title="力量">力量</th><th title="速度">速度</th><th title="主属性 门将：拦截，后卫：阻断，中场：传球，前锋：射门">主属性</th><th title="身价">身价</th></tr></thead><tbody class="hori_show_sp_table_tbody"></tbody></table>').insertBefore(".horizontal_table");
        $('<table class="horizontal_table" id="hori_show_sp_table" style="display:none;"><thead><tr><th>球员</th><th>年龄</th><th>位置</th><th>价值</th><th title="天赋">天赋</th><th title="耐力">耐力</th><th title="力量">力量</th><th title="速度">速度</th><th  title="粗略计算该球员可训练属性所使用的经验值，不包括未加点部分。">经验</th><th title="身价">身价</th></tr></thead><tbody class="hori_show_sp_table_tbody"></tbody></table>').insertBefore(".horizontal_table");
        $(".horizontal_table > tbody > tr > td > a").each(function(k,v){
            var href = this.href;
            var reg = /^https:\/\/rockingsoccer.com\/[a-zA-z\/\-]*\/info\/player-([\d]*)$/;
            var player_id = null;
            player_id = href.match(reg);
            if(player_id != null) {
                var player = new rs_player(player_id[1]);
                var obj = player.getPlayerInfo(force);
                if(now_pos != obj.position){
                    now_pos = obj.position;num = 0;index++;addable = true;
                }else{
                    if(num >= pos_list[index]){
                        addable = false;
                    }else{
                        addable = true;
                    }
                }
                num++;
                count++;
                if(addable === true){
                    pos.push(obj);
                    if(index == 0){
                        g_block += parseFloat(obj.blocking);
                        g_tactics += parseFloat(obj.tactics);
                        g_talent += parseFloat(obj.talent);
                        g_value_min += parseFloat(obj.star_min);
                        g_value_max += parseFloat(obj.star_max);
                        g_vs += parseInt(obj.vs);
                        //                        g_value_min_e += parseFloat(obj.star_min_e);
                        //                        g_value_max_e += parseFloat(obj.star_max_e);
                        //                        g_vs_e += parseInt(obj.vs_e);
                    }else if(index == 1){
                        d_dueling += parseFloat(obj.dueling);
                        d_tactics += parseFloat(obj.tactics);
                        d_value_min += parseFloat(obj.star_min);
                        d_value_max += parseFloat(obj.star_max);
                        d_talent += parseFloat(obj.talent);
                        d_vs += parseInt(obj.vs);
                        //                        d_value_min_e += parseFloat(obj.star_min_e);
                        //                        d_value_max_e += parseFloat(obj.star_max_e);
                        //                        d_vs_e += parseInt(obj.vs_e);
                    }else if(index == 2){
                        m_passing += parseFloat(obj.passing);
                        m_tactics += parseFloat(obj.tactics);
                        m_value_min += parseFloat(obj.star_min);
                        m_value_max += parseFloat(obj.star_max);
                        m_talent += parseFloat(obj.talent);
                        m_vs += parseInt(obj.vs);
                        //                        m_value_min_e += parseFloat(obj.star_min_e);
                        //                        m_value_max_e += parseFloat(obj.star_max_e);
                        //                        m_vs_e += parseInt(obj.vs_e);
                    }else if(index == 3){
                        s_scoring += parseFloat(obj.scoring);
                        s_tactics += parseFloat(obj.tactics);
                        s_value_min += parseFloat(obj.star_min);
                        s_value_max += parseFloat(obj.star_max);
                        s_talent += parseFloat(obj.talent);
                        s_vs += parseInt(obj.vs);
                        //                        s_value_min_e += parseFloat(obj.star_min_e);
                        //                        s_value_max_e += parseFloat(obj.star_max_e);
                        //                        s_vs_e += parseInt(obj.vs_e);
                    }
                }
                if(index == 0){
                    sum_g_value_min += parseFloat(obj.star_min);
                    sum_g_value_max += parseFloat(obj.star_max);
                    //                    sum_g_value_min_e += parseFloat(obj.star_min_e);
                    //                    sum_g_value_max_e += parseFloat(obj.star_max_e);
                    sum_g_talent += parseFloat(obj.talent);
                    var main_attr = colorValue(obj.blocking,"拦截");
                    count_g++;
                }else if(index == 1){
                    sum_d_value_min += parseFloat(obj.star_min);
                    sum_d_value_max += parseFloat(obj.star_max);
                    //                    sum_d_value_min_e += parseFloat(obj.star_min_e);
                    //                    sum_d_value_max_e += parseFloat(obj.star_max_e);
                    sum_d_talent += parseFloat(obj.talent);
                    var main_attr = colorValue(obj.dueling,"阻断");
                    count_d++;
                }else if(index == 2){
                    sum_m_value_min += parseFloat(obj.star_min);
                    sum_m_value_max += parseFloat(obj.star_max);
                    //                    sum_m_value_min_e += parseFloat(obj.star_min_e);
                    //                    sum_m_value_max_e += parseFloat(obj.star_max_e);
                    sum_m_talent += parseFloat(obj.talent);
                    var main_attr = colorValue(obj.passing,"传球");
                    count_m++;
                }else if(index == 3){
                    sum_s_value_min += parseFloat(obj.star_min);
                    sum_s_value_max += parseFloat(obj.star_max);
                    //                    sum_s_value_min_e += parseFloat(obj.star_min_e);
                    //                    sum_s_value_max_e += parseFloat(obj.star_max_e);
                    sum_s_talent += parseFloat(obj.talent);
                    var main_attr = colorValue(obj.scoring,"射门");
                    count_s++;
                }
                sum_vs += parseInt(obj.vs);
                //                sum_vs_e += parseInt(obj.vs_e);
                sum_talent += parseFloat(obj.talent);
                sum_star_min += parseFloat(obj.star_min);
                sum_star_max += parseFloat(obj.star_max);
                //                sum_star_min_e += parseFloat(obj.star_min_e);
                //                sum_star_max_e += parseFloat(obj.star_max_e);
                var sa = (obj.sa == '-')?'':'<br><font color="gray">'+obj.sa.replace("/<[^>]*br[^>]*>/gi","&nbsp;")+"</font>";
                if(count%2 == 1) tr_class = 'even';
                else tr_class = 'odd';
                var name_add_str = '<b>';
                if(obj.nt == 1) name_add_str += "<span title='这名球员是国脚'>(国脚)</span>";
                if(addable == true) name_add_str += " <span title='这名球员是该队的主力球员'>(主力)</span>";
                name_add_str += "</b>";
                if(name_add_str != '<b></b>') name_add_str = "<br>"+name_add_str;
                var name_add_str_before = "";
                if(typeof(obj.country_name) == "string"){
                    name_add_str_before = '<a href="'+obj.country_src+'" ><img src="'+obj.country_img+'" title="'+obj.country_name+'"  /></a>';
                }
                //				alert(obj.tactics);
                var str = '<tr class="'+tr_class+'"><td>'+name_add_str_before+'<a href="'+url+'player-'+obj.player_id+'">'+obj.name+"</a>"+name_add_str+""+sa+"</td><td>"+obj.age+"</td><td>"+obj.position+"</td><td style='text-align:left;'>"+colorValueStar(obj.star_min,obj.star_max)+checkUpDown(obj.star_max_e,obj.star_max)+"</td><td>"+colorValue(obj.talent,"天赋")+"</td><td>"+colorValue(obj.endurance,"耐力")+"</td><td>"+colorValue(obj.power,"力量")+"</td><td>"+colorValue(obj.speed,"速度")+"</td><td>"+formatLongNum(obj.ex)+"</td><td>"+obj.vs+checkUpDown(obj.vs_e,obj.vs)+"</td></tr>";
                //				var str = '<tr class="'+tr_class+'"><td><a href="'+url+'player-'+obj.player_id+'">'+obj.name+"</a>"+name_add_str+"</td><td>"+obj.age+"</td><td>"+obj.position+"</td><td style='text-align:left;'>"+colorValueStar(obj.star_min,obj.star_max)+checkUpDown(obj.star_max_e,obj.star_max)+"</td><td>"+colorValue(obj.talent,"天赋")+"</td><td>"+colorValue(obj.endurance,"耐力")+"</td><td>"+colorValue(obj.power,"力量")+"</td><td>"+colorValue(obj.speed,"速度")+"</td><td>"+colorValue(obj.blocking,"拦截")+"</td><td>"+colorValue(obj.dueling,"抢断")+"</td><td>"+colorValue(obj.passing,"传球")+"</td><td>"+colorValue(obj.scoring,"射门")+"</td><td>"+colorValue(obj.tactics,"战术")+"</td><td>"+obj.sa+"</td><td>"+obj.vs+checkUpDown(obj.vs_e,obj.vs)+"</td></tr>";
                $(str).appendTo(".hori_show_sp_table_tbody");
            }
        });
        $('<tr><td colspan="10"><table class="total_data" width="100%"></table> </td></tr>').appendTo(".hori_show_sp_table_tbody");
        str = '<thead><tr><td rowspan="2">阵容</td><td colspan="2">守门员</td><td colspan="2">后卫</td><td colspan="2">中场</td><td colspan="2">前锋</td><td colspan="2">平均</td><td rowspan="2">总身价</td><tr><td>实力</td><td>天赋</td><td>实力</td><td>天赋</td><td>实力</td><td>天赋</td><td>实力</td><td>天赋</td><td>实力</td><td>天赋</td></tr></thead>';
        str += "<tbody><tr class='odd'><td>"+"主力"+"</td><td style='text-align:left;'>"+colorValueStar(g_value_min/pos_list[0],g_value_max/pos_list[0])+"</td><td>"+colorValue(g_talent/pos_list[0])+"</td><td style='text-align:left;'>"+colorValueStar(d_value_min/pos_list[1],d_value_max/pos_list[1])+"</td><td>"+colorValue(d_talent/pos_list[1])+"</td><td style='text-align:left;'>"+colorValueStar(m_value_min/pos_list[2],m_value_max/pos_list[2])+"</td><td>"+colorValue(m_talent/pos_list[2])+"</td><td style='text-align:left;'>"+colorValueStar(s_value_min/pos_list[3],s_value_max/pos_list[3])+"</td><td>"+colorValue(s_talent/pos_list[3])+"</td><td style='text-align:left;'>"+colorValueStar((d_value_min+m_value_min+s_value_min+g_value_min)/(pos_list[0]+pos_list[1]+pos_list[2]+pos_list[3]),(d_value_max+m_value_max+s_value_max+g_value_max)/(pos_list[0]+pos_list[1]+pos_list[2]+pos_list[3]))+"</td><td>"+colorValue((d_talent+m_talent+s_talent+g_talent)/(pos_list[0]+pos_list[1]+pos_list[2]+pos_list[3]))+"</td><td>"+(g_vs+d_vs+m_vs+s_vs)+"</td></tr>";
        //        str += "<tr class='even'><td>"+"下赛季"+"</td><td style='text-align:left;'>"+colorValueStar(g_value_min_e/pos_list[0],g_value_max_e/pos_list[0])+"</td><td>"+colorValue(g_talent/pos_list[0])+"</td><td style='text-align:left;'>"+colorValueStar(d_value_min_e/pos_list[1],d_value_max_e/pos_list[1])+"</td><td>"+colorValue(d_talent/pos_list[1])+"</td><td style='text-align:left;'>"+colorValueStar(m_value_min_e/pos_list[2],m_value_max_e/pos_list[2])+"</td><td>"+colorValue(m_talent/pos_list[2])+"</td><td style='text-align:left;'>"+colorValueStar(s_value_min_e/pos_list[3],s_value_max_e/pos_list[3])+"</td><td>"+colorValue(s_talent/pos_list[3])+"</td><td style='text-align:left;'>"+colorValueStar((d_value_min_e+m_value_min_e+s_value_min_e+g_value_min_e)/(pos_list[0]+pos_list[1]+pos_list[2]+pos_list[3]),(d_value_max_e+m_value_max_e+s_value_max_e+g_value_max_e)/(pos_list[0]+pos_list[1]+pos_list[2]+pos_list[3]))+"</td><td>"+colorValue((d_talent+m_talent+s_talent+g_talent)/(pos_list[0]+pos_list[1]+pos_list[2]+pos_list[3]))+"</td><td>"+(g_vs_e+d_vs_e+m_vs_e+s_vs_e)+"</td></tr>";
        str += "<tr class='odd'><td>"+"总体"+"</td><td style='text-align:left;'>"+colorValueStar(sum_g_value_min/count_g,sum_g_value_max/count_g)+"</td><td>"+colorValue(sum_g_talent/count_g)+"</td><td style='text-align:left;'>"+colorValueStar(sum_d_value_min/count_d,sum_d_value_max/count_d)+"</td><td>"+colorValue(sum_d_talent/count_d)+"</td><td style='text-align:left;'>"+colorValueStar(sum_m_value_min/count_m,sum_m_value_max/count_m)+"</td><td>"+colorValue(sum_m_talent/count_m)+"</td><td style='text-align:left;'>"+colorValueStar(sum_s_value_min/count_s,sum_s_value_max/count_s)+"</td><td>"+colorValue(sum_s_talent/count_s)+"</td><td style='text-align:left;'>"+colorValueStar(sum_star_min/count,sum_star_max/count)+"</td><td>"+colorValue(sum_talent/count)+"</td><td>"+sum_vs+"</td></tr>";
        //        str += "<tr class='even'><td>"+"下赛季"+"</td><td style='text-align:left;'>"+colorValueStar(sum_g_value_min_e/count_g,sum_g_value_max_e/count_g)+"</td><td>"+colorValue(sum_g_talent/count_g)+"</td><td style='text-align:left;'>"+colorValueStar(sum_d_value_min_e/count_d,sum_d_value_max_e/count_d)+"</td><td>"+colorValue(sum_d_talent/count_d)+"</td><td style='text-align:left;'>"+colorValueStar(sum_m_value_min_e/count_m,sum_m_value_max_e/count_m)+"</td><td>"+colorValue(sum_m_talent/count_m)+"</td><td style='text-align:left;'>"+colorValueStar(sum_s_value_min_e/count_s,sum_s_value_max_e/count_s)+"</td><td>"+colorValue(sum_s_talent/count_s)+"</td><td style='text-align:left;'>"+colorValueStar(sum_star_min_e/count,sum_star_max_e/count)+"</td><td>"+colorValue(sum_talent/count)+"</td><td>"+sum_vs_e+"</td></tr></tbody>";
        $(str).appendTo(".total_data");
        $("[show-type=star]").click(function(){
            $("[show-type=star]").hide();
            $("[show-type=num]").show();
        })
        $("[show-type=num]").click(function(){
            $("[show-type=star]").show();
            $("[show-type=num]").hide();
        })
        $(".hori_show_type").show();
        $(".loading_v").hide();
    }
    setListenPlayer();
}
