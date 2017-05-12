
chrome.webRequest.onBeforeSendHeaders.addListener(
        function(details) {
        	console.log(details);
            if (details.url.indexOf("facebook.com/") != -1 || details.url.indexOf("platform.twitter.com/") != -1 || details.url.indexOf("googletagservices.com/") != -1 || details.url.indexOf("googleadservices.com/") != -1 || details.url.indexOf("twitter.com/") != -1  || details.url.indexOf("www.projectwonderful.com/pwa.js") != -1  || details.url.indexOf("www.projectwonderful.com/pwa.js") != -1 ) {
            	
            	return {cancel:true};
            }
        }, {urls: ["<all_urls>"]}, ["blocking", "requestHeaders"]);