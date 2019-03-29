function Setting(
	displayNameAndId="Unnamed setting",
	inputType="text",
	value="",
	size="",
	suffix=""
){
	this.displayNameAndId=displayNameAndId,
	this.inputType=inputType,
	this.value=value,
	this.size=size,
	this.suffix=suffix
}

function makeSettingsInterface(defaultSettings) {
	for(var i = 0; i < defaultSettings.length; i++){
		var htmlText = "<label for=\"" + defaultSettings[i].displayNameAndId + 
			"\">" + defaultSettings[i].displayNameAndId + 
			': </label><input type="' + defaultSettings[i].inputType + '" ';
		;
		if(defaultSettings[i].displayNameAndId != ""){
			htmlText += 'id="' + defaultSettings[i].displayNameAndId + '" ';
		}
		var initialValue = findGetParameter(defaultSettings[i].displayNameAndId);
		if(initialValue != null && defaultSettings[i].inputType == "checkbox"){
			htmlText += "checked ";
		}
		if(initialValue == null){initialValue = defaultSettings[i].value;}
		if(defaultSettings[i].value != ""){
			htmlText += 'value="' + initialValue + '" ';
		}
		if(defaultSettings[i].size != ""){
			htmlText += 'style=\"width:' + defaultSettings[i].size + 'em\" ';
		}
		htmlText += '/>';
		htmlText += defaultSettings[i].suffix + '<br />\n';
		if(defaultSettings[i].inputType == "number"){
			htmlText += '<input class="LogSlider" type="range" min="-11" max="11" id="' + 
				defaultSettings[i].displayNameAndId + 
				'Logslider" onchange="settingsLogslider(\'' + 
				defaultSettings[i].displayNameAndId + 
				'\')" oninput="document.getElementById(\'' + 
				defaultSettings[i].displayNameAndId + 
				'LogsliderMoveAmount\').value=signedString(' +  
				'logSliderTransform(document.getElementById(\'' + 
				defaultSettings[i].displayNameAndId + 
				'Logslider\').value))"><output id="' + 
				defaultSettings[i].displayNameAndId + 
				'LogsliderMoveAmount" for="' + 
				defaultSettings[i].displayNameAndId + 
				'">0</output><br />';
		}
		document.getElementById('settings').innerHTML += htmlText;
	}
	var htmlText = "<input class=\"LogSlider\" type=\"text\" id=\"viewURL\" " + 
		"disabled=\"disabled\" value=\"" + document.location + 
		"\" /><button onclick=\"copyURL()\">&#x1F4CB</button><br />";
	document.getElementById('settings').innerHTML += htmlText;
}

function copyURL() {
	var placeholderText = "Copied to clipboard";
	var copyText = document.getElementById("viewURL");
	copyText.select();
	document.execCommand("copy");
	var oldText = copyText.value;
	copyText.value = placeholderText;
	setTimeout(function() {
		if(copyText.value == placeholderText){
			copyText.value = oldText;
		}
	}, 1200);
}

function signedString(number) {
	sign = '';
	if(number > 0){sign = '+';}
	return sign + number;
}

function settingsLogslider(inputID, amount) {
	amount = document.getElementById(inputID + 'Logslider').value;
	document.getElementById(inputID).value = 
		parseInt(document.getElementById(inputID).value) + 
		logSliderTransform(amount);
	document.getElementById(inputID + 'Logslider').value = 0;
	document.getElementById(inputID + 'LogsliderMoveAmount').value = 0;
	document.getElementById(inputID).dispatchEvent(new Event('change'));
}

function logSliderTransform(x) {
	// Turns	 -11	-10 ... -3 -2 -1 0 1 ... 11
	// Into  -1024 -512 ... -4 -2 -1 0 1 ... 1024
	if(x==0){
		return x;
	}else{
		return Math.sign(x)*Math.pow(2, Math.abs(x)-1);
	}
}


function loadSetting(displayNameAndId){
	var field = document.getElementById(displayNameAndId);
	if(field.type == "number"){
		return parseFloat(field.value);
	}
	if(field.type == "checkbox"){
		return field.checked;
	}
}

