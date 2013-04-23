function checkContent(content,word){
	var check = -1;
	check =	content.indexOf(word);
	if(check < 0) check = content.indexOf(" " + word);
	if(check < 0) check = content.indexOf(">" + word);
	
	return check;
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
	//todo:: change hello greeting to something better....
	if(request.greeting == "hello"){
		
		//
		
		//todo:: change title references to something better
		var validateResults = "";
		var wordListResults = "";
		var wordListCount = 0;
		var content = "";
		var contentList = new Array();
		var resultArr = new Array();
		//todo:: set proper words
		var wordList = new Array(
			"doesn't",
			"can't",
			"you'll",
			"ondemand",
			"on demand",
			"onsite",
			"on site",
			"drop-down",
			"drop down",
			"plugin",
			"plug in",
			"webtolead",
			"web to lead",
			"e-mail",
			"e mail",
			"username",
			"user-name",
			"sub-panel",
			"sub panel",
			"i ",
			"overview of",
			"why are",
			"<p>&nbsp;</p>"
		);
		
		//
		
		//get content
		if(document.getElementById('topic')){
			var elem = document.getElementById('topic');
			content = elem.innerHTML;
			content = content.toLowerCase(); //convert content to lowercase for comparisions
			content = content.replace(/[\n\r]/g, ' '); // replace cariage returns with space
			
			//set content array breaking on space
			//contentList = content.split(" ");
			contentList = content;
			
			var i = 0;
			//loop through every word to check if its in content
			while(i < wordList.length){
			
				var foundIndex = checkContent(contentList,wordList[i]);
				if(foundIndex >= 0){
				//found it!
					if(resultArr[i]){
						//already exists, so increment count
						resultArr[i] = resultArr[i] + 1;
					}else{
						//first time we found this word
						resultArr[i] = 1;
					}
					//set content to remaining content so we can continue searching for the same word and get a count
					contentList = contentList.slice(foundIndex+1,100000);
				}else{
				//no result, or we have found all
					
					if(resultArr[i]){
						//already exists, so do nothing
					}else{
						//does not exist, and we didnt find it. set to 0 to maintain relative indexes with wordList
						resultArr[i] = 0;
					}
					//reset content
					//contentList = content.split(" ");
					contentList = content;
					
					//increment counter to move to next word in list
					i++;
				}
			}
			
			//build output
			validateResults = "Searched for " + wordList.length + " phrases.<br>";
			for(i=0;i<wordList.length;i++){
				if(resultArr[i]>0){
					wordListCount = wordListCount + 1;
					wordListResults = wordListResults + "[" + htmlEntities(wordList[i]) + "] = " + resultArr[i] + "<br>";
				}
			}
			
			validateResults = validateResults + "Found " + wordListCount + " unique phrases:<br>";
			
			if(wordListResults == ""){
				validateResults = validateResults + "No invalid words found.";
			}else{
				validateResults = validateResults + wordListResults;
			}
			
		}else{
			validateResults = "No content found to validate.";
		}
		
		//send output back to popup.js
		sendResponse({validateResults: validateResults});
		
	}
});