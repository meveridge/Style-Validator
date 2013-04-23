
chrome.tabs.getSelected(null, function(tab) {
	chrome.tabs.sendMessage(tab.id, {greeting: "hello"}, function(response){
		if(response.validateResults){
			document.getElementById('popupContent').innerHTML = response.validateResults;
		}else{
			alert("No Response....");
		}
	});
});