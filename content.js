
/**
 * Checks content for instanes of word, word precceded by a space, and word preceeded by a >.
 * @param content = haystack
 * @param word = needle
 * @return int
*/
function checkContent(content,word){
	var check = -1;
	check =	content.indexOf(word);
	if(check < 0) check = content.indexOf(" " + word);
	if(check < 0) check = content.indexOf(">" + word);
	
	//todo:: add regex check for valid characters preceeding the found word. then we can add i back in since it is currently finding API...
	
	return check;
}

/**
 * Replaces characters (&, >, <, ") with HTML entities
 * @param str = String to replace characters
 * @return string 
*/
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
	if(request.action == "runValidate"){
		
		var validateResults = "";
		var wordListResults = "";
		var wordListCount = 0;
		var content = "";
		var contentList = new Array();
		var resultArr = new Array();
		//todo:: create hyperlinks to auto-perform a find for the selected word
		var wordList = new Array(
			"doesn't",
			"can't",
			"you'll",
			"won't",
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
			"overview of",
			"go to",
			"<p>&nbsp;</p>",
			"font-family:",
			"font-size:",
			"<u>",
			"<i>",
			"<p><img",
			".  ",
			"?  ",
			"!  ",
			"cellpadding=\"1\""
		);
		
		//each index of this array matches with an index from wordList and the value matches an index from responseList
		var responseMapping = new Array(
			0,
			0,
			0,
			0,
			1,
			1,
			2,
			2,
			3,
			3,
			4,
			4,
			5,
			5,
			6,
			6,
			7,
			7,
			8,
			8,
			10,
			11,
			12,
			13,
			13,
			13,
			13,
			14,
			15,
			15,
			15,
			16
		);
		
		var responseList = new Array(
			"Avoid contractions.",
			"Should be on-demand.",
			"Should be on-site.",
			"Should be dropdown.",
			"Should be plug-in.",
			"Should be web-to-lead.",
			"Should be email.",
			"Should be user name.",
			"Should be subpanel.",
			"First person is only used in the plural form (we).",
			"Should be introduction to.",
			"Should be navigate to.",
			"No instances should appear in text source.",
			"No text formatting.",
			"No spaces separating images and text.",
			"Single space after punctuation.",
			"Table cellpadding needs to be 4."
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
					wordListResults = wordListResults + "<a title='" + responseList[responseMapping[i]] + "'>[" + htmlEntities(wordList[i]) + "] = " + resultArr[i] + "</a><br>";
					//wordListResults = wordListResults + "&nbsp;&nbsp;&nbsp;--> " + responseList[responseMapping[i]] + "<br>";
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