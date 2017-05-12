if (location.href.indexOf("https://rockingsoccer.com/zh/soccer/facilities/youth/youthsquad") >= 0)
	{
		var thead_tr = $("table.horizontal_table").children("thead").children("tr");
		thead_tr.append("<th>状态</th><th>身价</th>");
		thead_tr.css("cursor", "pointer");
		thead_tr.children("th").css("color","#ccc");
		
		thead_tr.append(thead_tr.children("th:eq(5)"));
		
		var tbody_trs = $("table.horizontal_table").children("tbody").children("tr");
		var player_num = tbody_trs.length;
		
		tbody_trs.each(function()
		{
			var thisPlayer = new RSPlayer();
			var this_tr = $(this);			
			var player_href = $(this).children("td:eq(0)").children("a:eq(1)").attr("href");					
			this_tr.append("<td>&nbsp;</td><td>&nbsp;</td>");
			
			this_tr.append(this_tr.children("td:eq(5)"));
			
			thisPlayer.parseBid(this_tr);
			$.ajax({
				type: "get",
				url: player_href,
				success: function(data)
				{
					thisPlayer.parseDoc(data);
					var thisPlayer_morale_num = thisPlayer.morale;
					thisPlayer_morale_num = thisPlayer_morale_num.replace(/[^0-9|-]/ig,"");
					this_tr.children("td:eq(5)").html('<span title="' + thisPlayer.morale + '">' + thisPlayer_morale_num + '</span>');
					this_tr.children("td:eq(6)").html(changv(thisPlayer.marketValue));
				}
			});		
		});	
	}
	
if (location.href.indexOf("https://rockingsoccer.com/zh/soccer/facilities/youth/log") >= 0)
	{
		var thead_tr = $("table.horizontal_table").children("thead").children("tr");
		thead_tr.append("<th>天赋</th>");
		thead_tr.css("cursor", "pointer");
		thead_tr.children("th").css("color","#ccc");
		
		thead_tr.append(thead_tr.children("th:eq(4)"));
		thead_tr.append(thead_tr.children("th:eq(4)"));
		thead_tr.append(thead_tr.children("th:eq(4)"));
		
		var tbody_trs = $("table.horizontal_table").children("tbody").children("tr");
		var player_num = tbody_trs.length;
		
		tbody_trs.each(function()
		{
			var thisPlayer = new RSPlayer();
			var this_tr = $(this);			
			var player_href = $(this).children("td:eq(0)").children("a:eq(1)").attr("href");					
			this_tr.append("<td>&nbsp;</td>");
			
			this_tr.append(this_tr.children("td:eq(4)"));
			this_tr.append(this_tr.children("td:eq(4)"));
			this_tr.append(this_tr.children("td:eq(4)"));
			
			thisPlayer.parseBid(this_tr);
			$.ajax({
				type: "get",
				url: player_href,
				success: function(data)
				{
					thisPlayer.parseDoc(data);
					this_tr.children("td:eq(4)").html(genreateNumberSpan(thisPlayer.talent,"天赋"));
				}
			});		
		});	
	}