
	$("img.icon").on('load',function(){
		if(typeof this.src == 'string' && this.src.indexOf('/img/icons/buytickets.png') != -1){
			$(this).click();	
		}
	});