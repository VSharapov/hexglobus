var canvas = document.querySelector('canvas')

function initSize() {
	var percentageWidth = 50.0;
	canvas.width=window.innerWidth * (percentageWidth / 100.0);
	canvas.height=window.innerHeight;
}
initSize();

var c = canvas.getContext('2d');

function stripAlpha(colorString) {
	if(colorString.length > 7) {
		return colorString.slice(0, 7);
	} else {
		return colorString;
	}
}

function getIntColor(num) {
	// num >>>= 0;
	// var b = num & 0xFF,
	//     g = (num & 0xFF00) >>> 8,
	//     r = (num & 0xFF0000) >>> 16,
	//     a = (num & 0xFF000000) >>> 24;
	// return "#" + r.toString(16) + g.toString(16) + b.toString(16) + a.toString(16);
	return "#" + padZero(num.toString(16), 6);
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

function padZero(str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}

function drawHexagon(centerX, centerY, d, hexText="", hexColor="random") {
	r = d/2;
	R = r / Math.cos(Math.PI / 6);
	if(hexColor != "random"){
		c.fillStyle = hexColor;
	} else {
		c.fillStyle = getRandomColor();
	}
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
	c.fillText(hexText, centerX, centerY);
}

function hexCoordsToCanvasCoords(row, col, settings) {
	var x = row * settings.columnSpacing;
	var y = col * settings.rowSpacing;
	if(row % 2){
		// even rows are "normal", odd rows are offset downwards
	}else{
		y += settings.rowSpacing / 2;
	}
	return [x + canvas.width/2, y + canvas.height/2];
}

function generateDeterministicColor(i, j) {
	var seedString = "" + i + ", " + j;
	var tempRNG = new Random(seedString.hashCode());
	// The prng is pretty simple, so I just added iterations until I stopped seeing patterns
	var randomIterations = parseInt(document.querySelector("input[name='random-iterations']").value);
	for(var i = 0; i < randomIterations; i++){randomNumber = tempRNG.next();};
	var moddedNumber = randomNumber % 0x1000000;
	var flooredNumber = Math.floor(moddedNumber);
	var color = getIntColor(flooredNumber);
	return color;
}

function drawScene(settings) {
	settings.columnSpacing = settings.hexMajorDiameter/2 + (settings.hexMinorDiameter/4);
	settings.rowSpacing = settings.hexMinorDiameter;
	
	// Rounding can make blank areas on the edges when the division is close, but it's not too bad
	var firstVisibleColumn = -Math.ceil((canvas.width-settings.hexMajorDiameter/2)/(3*(settings.hexMajorDiameter/2)));
	var finalVisibleColumn = -firstVisibleColumn;
	var firstVisibleRow = -Math.ceil(canvas.height / (2*settings.hexMinorDiameter));
	var finalVisibleRow = -firstVisibleRow;
	
	for(var i = firstVisibleColumn; i <= finalVisibleColumn; i++){
		for(var j = firstVisibleRow; j <= finalVisibleRow; j++){
			x = i + settings.hexOffsetX;
			y = j + settings.hexOffsetY;
			screenCoords = hexCoordsToCanvasCoords(i, j, settings);
			hexColor = generateDeterministicColor(x, y);
			hexText = x + ", " + y;
			drawHexagon(screenCoords[0], screenCoords[1], settings.hexMinorDiameter, hexText, hexColor);
		}
	}
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
		if(defaultSettings[i].value != ""){
			htmlText += 'value="' + defaultSettings[i].value + '" ';
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

function main() {
	var defaultSettings = [
		new Setting("Hex size (minor diameter)", "number", "hex-distance", "60", "4", "px"),
		new Setting("Random iterations", "number", "random-iterations", "3", "4", " (The prng isn't always random enough, so the lazy fix is to change iterations)"),
		new Setting("View coordinate X", "number", "view-coordinate-x", "-2", "4"),
		new Setting("View coordinate Y", "number", "view-coordinate-y", "-6", "4")
	]
	makeSettingsInterface(defaultSettings);

	var sceneSettings = new Object();

	function redraw() {
		sceneSettings.hexMinorDiameter = parseFloat(document.querySelector("input[name='hex-distance']").value);
		sceneSettings.hexMajorDiameter = sceneSettings.hexMinorDiameter / Math.cos(Math.PI / 6);
		sceneSettings.hexOffsetX = parseFloat(document.querySelector("input[name='view-coordinate-x']").value);
		sceneSettings.hexOffsetY = parseFloat(document.querySelector("input[name='view-coordinate-y']").value);
		initSize();
		drawScene(sceneSettings);
	}
	redraw();
	
	window.addEventListener('resize', redraw);
	for(var i = 0; i < defaultSettings.length; i++){
		document.getElementsByName(defaultSettings[i].name)[0].addEventListener('change', redraw);
	}
}

main();
