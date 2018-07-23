function Setting(
	displayName="Unnamed setting",
	inputType="text",
	id="",
	value="",
	size="",
	suffix=""
){
	this.displayName=displayName,
	this.inputType=inputType,
	this.id=id,
	this.value=value,
	this.size=size,
	this.suffix=suffix
}

function makeSettingsInterface(defaultSettings) {
	for(var i = 0; i < defaultSettings.length; i++){
		var htmlText = "<label for=\"" + defaultSettings[i].id + "\">" + 
			defaultSettings[i].displayName + 
			': </label><input type="' + defaultSettings[i].inputType + '" ';
		;
		if(defaultSettings[i].id != ""){
			htmlText += 'id="' + defaultSettings[i].id + '" ';
		}
		var initialValue = findGetParameter(defaultSettings[i].id);
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

function loadSetting(id){
	var field = document.getElementById(id);
	if(field.type == "number"){
		return parseFloat(field.value);
	}
	if(field.type == "checkbox"){
		return field.checked;
	}
}

