//runs when extension is called
chrome.tabs.getSelected(null, function(tab) {
	//send message to window to get the content
	chrome.tabs.sendMessage(tab.id, {action: "runValidate"}, function(response){
		if(response.validateResults){
			//got back the expected response, show popup data
			document.getElementById('popupContent').innerHTML = response.validateResults;
		}else{
			//something went wrong.
			alert("No Response....");
		}
	});
});