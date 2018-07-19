function Setting(
	displayName="Unnamed setting",
	inputType="text",
	name="",
	value="",
	size="",
	suffix=""
){
	this.displayName=displayName,
	this.inputType=inputType,
	this.name=name,
	this.value=value,
	this.size=size,
	this.suffix=suffix
}

function makeSettingsInterface(defaultSettings) {
	for(var i = 0; i < defaultSettings.length; i++){
		var htmlText = defaultSettings[i].displayName +
			': <input type="' + defaultSettings[i].inputType +
			'" '
		;
		if(defaultSettings[i].name != ""){
			htmlText += 'name="' + defaultSettings[i].name + '" ';
		}
		var initialValue = findGetParameter(defaultSettings[i].name);
		if(initialValue != null && defaultSettings[i].inputType == "checkbox"){
			htmlText += "checked "
		}
		if(initialValue == null){initialValue = defaultSettings[i].value;}
		if(defaultSettings[i].value != ""){
			htmlText += 'value="' + initialValue + '" ';
		}
		if(defaultSettings[i].size != ""){
			htmlText += 'size=' + defaultSettings[i].size + ' ';
		}
		htmlText += '/>';
		htmlText += defaultSettings[i].suffix + '<br />\n';
		document.getElementById('settings').innerHTML += htmlText;
	}
}

function loadSetting(name){
	if(document.querySelector("input[name='" + name + "']").type == "number"){
		return parseFloat(document.querySelector("input[name='" + name + "']").value);
	}
	if(document.querySelector("input[name='" + name + "']").type == "checkbox"){
		return document.querySelector("input[name='" + name + "']").checked;
	}
}

