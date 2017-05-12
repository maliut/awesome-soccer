var url = window.location.href;
url = url.match(/^https:\/\/[^\/]*rockingsoccer.com\/[^\/]*\/[^\/]*/);
if(window.location.href == url)
{
	var obj = $(".external");
	if(obj.length > 0){
		var href = $(".external").attr('href');
		if(href.match(/https:\/\/[^\/]*rockingsoccer.com\/[^\/]*\/[^\/]*?site_id=[0-9]*/)){
			window.open(href);
//			alert(href);
			setTimeout(function(){document.location.href = window.location.href;},1000);
		}
	}
}