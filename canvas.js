function stripAlpha(colorString) {
	if(colorString.length > 7) {
		return colorString.slice(0, 7);
	} else {
		return colorString;
	}
}


function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function invertColor(hex, bw) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.' + hex);
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        // http://stackoverflow.com/a/3943023/112731
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
}

function hexCoordsToCanvasCoords(screenX, screenY, settings) {
	var x = screenX * settings.columnSpacing;
	var y = screenY * settings.rowSpacing;
	if(screenX % 2){
		// even columns are "normal", odd columns are offset upwards
	}else{
		y += settings.rowSpacing / 2;
	}
	return [x + settings.canvas.width/2, y + settings.canvas.height/2];
}


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
		// This makes some broken buttons, which are redundant anyway (at least in chrome)
		// Ahh, it's probably because getElementsByName()[0] should be used, oh well
		//if(defaultSettings[i].ladder){
		//	var quotedName
		//	htmlText += "<button onclick=\"document.getElementsByName('" + defaultSettings[i].name + "').stepUp(1);\">+</button>";
		//	htmlText += "<button onclick=\"document.getElementsByName('" + defaultSettings[i].name + "').stepUp(-1);\">-</button>";
		//}
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

function drawHexagon(c, centerX, centerY, d, hexagon) {
	r = d/2;
	R = r / Math.cos(Math.PI / 6);
	c.fillStyle = hexagon.fillColor;
	c.beginPath();
	c.moveTo(centerX + R, centerY);
	c.lineTo(centerX + R/2, centerY + r);
	c.lineTo(centerX - R/2, centerY + r);
	c.lineTo(centerX - R, centerY);
	c.lineTo(centerX - R/2, centerY - r);
	c.lineTo(centerX + R/2, centerY - r);
	c.closePath();
	c.fill();
	fontFactor = 4; // This is about as big as you can go for printing 3 digit coordinates
	c.font = Math.floor(d/fontFactor) + "px Arial";
	c.fillStyle = invertColor(c.fillStyle, 1);
	c.textAlign = "center";
	c.textBaseline = "middle";
	c.fillText(hexagon.text, centerX, centerY);
}

function drawScene(sceneSettings, hexagons) {
	sceneSettings.canvasContext.globalAlpha = 1 - 0.5 * sceneSettings.transparency;
	for(var i = sceneSettings.visibility.firstColumn; i <= sceneSettings.visibility.finalColumn; i++){
		for(var j = sceneSettings.visibility.firstRow; j <= sceneSettings.visibility.finalRow; j++){
			var x = i + sceneSettings.hexOffsetX;
			// If the screen is centered on an odd hex-column, then even screen-columns
			// will still be shifted one half-hex up, even though they should get
			// shifted down, and an easy fix for this is to shift them.
			var y = j + sceneSettings.hexOffsetY + (sceneSettings.hexOffsetX%2 && !(i%2) ? 1 : 0);
			var screenCoords = hexCoordsToCanvasCoords(i, j, sceneSettings);
			drawHexagon(
				sceneSettings.canvasContext,
				screenCoords[0],
				screenCoords[1],
				sceneSettings.hexMinorDiameter,
				hexagons.getHex(sceneSettings.scale, x, y)
			);
		}
	}
	document.getElementById('status').value='Finished';
}

function sceneVisibility(canvas, hexMajorDiameter, hexMinorDiameter, scale, offsetX, offsetY){
	var visibility = new Object();
	visibility.firstColumn = -Math.ceil(
		(canvas.width-hexMajorDiameter/2)/(3*(hexMajorDiameter/2))
	);
	visibility.finalColumn = -visibility.firstColumn;
	visibility.firstRow = -Math.ceil(canvas.height / (2*hexMinorDiameter));
	visibility.finalRow = -visibility.firstRow;
	visibility.list = [];
	for(var i = visibility.firstColumn; i <= visibility.finalColumn; i++){
		for(var j = visibility.firstRow; j <= visibility.finalRow; j++){
			var x = i + offsetX;
			// If the screen is centered on an odd hex-column, then even screen-columns
			// will still be shifted one half-hex up, even though they should get
			// shifted down, and an easy fix for this is to shift them.
			var y = j + offsetY + (offsetX%2 && !(i%2) ? 1 : 0);
			visibility.list.push({scale:scale, x:x, y:y});
		}
	}
	return visibility;
}

function MouseController(){
}

MouseController.prototype.wheel = function (event) {
	var textBox = document.querySelector("input[name='" + "hex-size" + "']");
	var changeDirection = 0;
	if(event.deltaY > 0){ // Scroll down == zoom out
		changeDirection = -1;
	}
	if(event.deltaY < 0){ // Scroll up == zoom in
		changeDirection = 1;
	}
	var changeAmount = 0;
	if(!event.shiftKey){
		changeAmount = Math.ceil(parseInt(textBox.value) / 10.0);
		if(changeAmount < 1){changeAmount=1;}
	}else{
		changeAmount=1;
	}
	textBox.value = parseInt(textBox.value) + changeAmount*changeDirection;
	textBox.dispatchEvent(new Event('change'));
}

function main() {
	var canvas = document.querySelector('canvas');

	function initSize() {
		var percentageWidth = 50.0;
		canvas.width=window.innerWidth * (percentageWidth / 100.0);
		canvas.height=window.innerHeight;
	}

	var c = canvas.getContext('2d');

	var defaultSettings = [
		new Setting("Hex size (minor diameter)", "number", "hex-size", "60", "4", "px"),
		new Setting("Random iterations", "number", "random-iterations", "3", "4", " (The prng isn't always random enough, so the lazy fix is to change iterations)"),
		new Setting("Transparency", "checkbox", "transparency", "", "", " Makes everything 50% opaque"),
		new Setting("View coordinate X", "number", "view-coordinate-x", "0", "4"),
		new Setting("View coordinate Y", "number", "view-coordinate-y", "0", "4")
	]
	makeSettingsInterface(defaultSettings);

	var mouseController = new MouseController();
	canvas.addEventListener('mousewheel',function(event){
		mouseController.wheel(event);
		return false; 
	}, false);

	var hexagons = new Hexagons();
	var hexagonSettings = new Object();
	hexagonSettings.rngSettings = new Object();

	var sceneSettings = new Object();

	function redraw() {
		initSize();
		sceneSettings.hexMinorDiameter = loadSetting('hex-size');
		sceneSettings.hexMajorDiameter = sceneSettings.hexMinorDiameter / Math.cos(Math.PI / 6);
		sceneSettings.columnSpacing = sceneSettings.hexMajorDiameter * 3 / 4;
		sceneSettings.rowSpacing = sceneSettings.hexMinorDiameter;
		hexagonSettings.rngSettings.minimumIterations = loadSetting('random-iterations');
		sceneSettings.transparency = loadSetting('transparency');
		sceneSettings.hexOffsetX = loadSetting('view-coordinate-x');
		sceneSettings.hexOffsetY = loadSetting('view-coordinate-y');
		// TODO: scale zero should be variable
		sceneSettings.scale = 0;
		sceneSettings.canvas = canvas;
		sceneSettings.canvasContext = c;
		sceneSettings.visibility=sceneVisibility(
			canvas,
			sceneSettings.hexMajorDiameter,
			sceneSettings.hexMinorDiameter,
			sceneSettings.scale,
			sceneSettings.hexOffsetX,
			sceneSettings.hexOffsetY
		);
		hexagons.generateVisible(sceneSettings.visibility, hexagonSettings);
		document.getElementById('status').value='Rendering...';
		setTimeout(function(){
			drawScene(sceneSettings, hexagons);
		}, 0);
	}
	redraw();
	
	window.addEventListener('resize', redraw);
	for(var i = 0; i < defaultSettings.length; i++){
		document.getElementsByName(defaultSettings[i].name)[0].addEventListener('change', redraw);
	}
}

