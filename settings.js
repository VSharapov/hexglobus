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
		var htmlText = "<label for=\"" + defaultSettings[i].displayNameAndId + "\">" + 
			defaultSettings[i].displayNameAndId + 
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
		document.getElementById('settings').innerHTML += htmlText;
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

