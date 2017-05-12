function ajaxSend(objectOfXMLHttpRequest, callback) {
	if(!callback){
		return;
	}
	var s_ajaxListener = new Object();
	s_ajaxListener.tempOpen = objectOfXMLHttpRequest.prototype.open;
	s_ajaxListener.tempSend = objectOfXMLHttpRequest.prototype.send;
	s_ajaxListener.callback = function () {
		callback(this.method, this.url, this.data);
	}
	objectOfXMLHttpRequest.prototype.open = function(a,b) {
		if (!a) var a='';
		if (!b) var b='';
		s_ajaxListener.tempOpen.apply(this, arguments);
		s_ajaxListener.method = a;
		s_ajaxListener.url = b;
		if (a.toLowerCase() == 'get') {
			s_ajaxListener.data = b.split('?');
			s_ajaxListener.data = s_ajaxListener.data[1];
		}
	}
	objectOfXMLHttpRequest.prototype.send = function(a,b) {
		if (!a) var a='';
		if (!b) var b='';
		s_ajaxListener.tempSend.apply(this, arguments);
		if(s_ajaxListener.method.toLowerCase() == 'post') {
			s_ajaxListener.data = a;
		}
		s_ajaxListener.callback();
	}
}
function onAjaxSend(method, url, data) {  
	alert(url);
}
ajaxSend(unsafeWindow, onAjaxSend);