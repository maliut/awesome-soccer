//var url = window.location.href;
//var msg = url.match(/^https:\/\/[^\/]*rockingsoccer.com\/[^\/]*\/[^\/]*\/facilities\/trainer\/train-([^\?]*)[\?]{0,1}.*$/);
//if(msg != null){
//	var position = msg[1];
//	var td_p = [null,null,'blocking','dueling','passing','scoring','tactics'];
//	if(typeof(position_ex[position])!='undefined'){
//		var now_position = position_ex[position];
//		$(".content > h3:first").after("<div class='button_div trig_train_fold'></div>");
//		$("<input type='button' value='关闭加点助手' class='submit train_plu' id='train_plu_close'>").on('click',function(){
//			var id = this.id;
//			if(id == 'train_plu_open'){
//				open_train_plu();
//			}else{
//				close_train_plu();
//			}
//		}).appendTo(".button_div");
//		function close_train_plu(){
//			$('.train_plu').val('打开加点助手');
//			$('.train_plu').attr('id','train_plu_open');
//			$('.button_div').addClass('trig_train_fold');
//			$('.up_ex').hide();
//			localStorage['auto_train'] = 0;
//		}
//		function open_train_plu(){
//			$('.train_plu').val('关闭加点助手');
//			$('.train_plu').attr('id','train_plu_close');
//			$('.button_div').removeClass('trig_train_fold');
//			$('.up_ex').show();
//			localStorage['auto_train'] = 1;
//		}
//		$('<p class="footnote">插件新增<b>显示训练效率</b>功能。因普遍存在四舍五入现象，数据会有一定的误差，仅供参考。以0.036/0.086为例，第一位数表示点击"+1"后会增加的星值数量，第二位数是第一位数除以需要的经验（为了显示方便这里显示结果乘1000），这代表着每点经验值可获得的星值（的1/1000），第二位数越高意味着训练该项的效率越高。（如你所见，最高效率的属性颜色标为了蓝色）。请注意，效率高并不意味着会使球员的表现或身价更高，仅表示加点时可以更快的增加球员星值（还不一定准确）。依然建议能力许可下，主增加主属性。</p>').appendTo(".button_div");
//		$(".horizontal_table > tbody > tr > td > a").each(function(k,v){
//			var href = this.href;
//			var reg = /^https:\/\/rockingsoccer.com\/[a-zA-z\/\-]*\/info\/player-([\d]*)$/;
//			var player_id = null;
//			player_id = href.match(reg);
//			if(player_id != null) {
//				display_upstar(player_id[1],$(this),false,true);
//			}
//		});
//		function display_upstar(player_id,now_obj,force,is_cache){
//			var player = new rs_player(player_id);
//			var obj = player.getPlayerInfo(force,is_cache);
//			var max_value = 0;
//			var max_k = 0;
//			now_obj.parent().parent().find('td').each(function(k,v){
//				if(td_p[k] != null){
//					var ex = $(this).find('.cost').html();
//					$(this).find('.up_ex').remove();
//					var now_attr = td_p[k];
//					ex = ex.replace(/[^\d]*/gi,'');
//					var pos_ex = obj.pos_ex;
//					if(typeof(pos_ex)!='undefined' && typeof(pos_ex[now_attr])!='undefined' ){
//						var up_star = pos_ex[now_attr];
//						var cost_s = ((parseFloat(up_star)/parseFloat(ex)))*1000;
//						cost_s = cost_s.toFixed(3);
//						$(this).append("<div class='up_ex' id='up_ex_"+player_id+"_"+k+"'><span title='训练后可增加"+up_star+"★,升级该属性的性价比为"+cost_s+"(存在误差，仅供参考)'>"+up_star+"/"+cost_s+"</span></div>");
//						if(cost_s > max_value){
//							max_value = cost_s;
//							max_k = k;
//						}
//					}else{
//						$(this).append("<div class='up_ex'><span title='未获取到该球员的属性，请打开该球员的链接或清空数据'>无数据</span></div>");
//					}
//				}
//				if(k == 0){
//					$(this).find('.up_ex').remove();
//					$(this).append("<div class='up_ex' id='player_button_"+player_id+"'></div>");
//					$("<input type='button' value='刷新球员数据' class='submit'>").on('click',function(){
//						display_upstar(player_id,now_obj,true,false);
//					}).appendTo("#player_button_"+player_id);
//				}
//			});
//			if(max_k >0 && max_value>0){
//				//				alert("#up_ex_"+player_id+"_"+max_k);
//				$("#up_ex_"+player_id+"_"+max_k+" span").css("color",'blue');
//			}
//		}
//	}
//	if(localStorage['auto_train'] == 1){
//		open_train_plu();
//	}else{
//		close_train_plu();
//	}
//}
////alert(msg);