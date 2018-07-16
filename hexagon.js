function getIntColor(num) {
	var moddedNumber = num % 0x1000000; // Only 6 hex digits needed
	var flooredNumber = Math.floor(moddedNumber); // Just in case?
	return "#" + padZero(moddedNumber.toString(16), 6);
}

function generateDeterministicColor(constantProperties, rngSettings) {
	var scale = constantProperties[0];
	var seedString = JSON.stringify(constantProperties);
	var tempRNG = new Random(seedString.hashCode());
	// The prng should make different colors based on scale
	var randomIterations = rngSettings.minimumIterations + Math.abs(scale*2-(scale<0 ? 1 : 0));
	var randomNumber;
	for(var i = 0; i < randomIterations; i++){randomNumber = tempRNG.next();};
	var color = getIntColor(randomNumber);
	return color;
}

function Hexagon(
	allHexagonSettings,
	scale=0,
	x,
	y,
	fillColor="", // Empty string for pseudo-random color
	text="")
{
	// Constant
	this.scale=scale;
	this.x=x;
	this.y=y;
	this.constantProperties=[scale, x, y];
	// Variable
	this.fillColor=fillColor;
	this.text=text;

	if(fillColor == ""){
		this.fillColor=generateDeterministicColor(this.constantProperties, allHexagonSettings.rngSettings);
	}
}

function Hexagons() {
	this.list = []
}

Hexagons.prototype.getHex = function (scale, x, y) {
	function checkByCoordinates(someHex){
		return someHex.x == x && someHex.y == y && someHex.scale == scale;
	}
	return this.list.find(checkByCoordinates);
}

Hexagons.prototype.generateVisible = function (visibility, hexagonSettings) {
	for (var i = 0; i < visibility.list.length; i++) {
		this.list.push(new Hexagon(
			hexagonSettings,
			visibility.list[i].scale,
			visibility.list[i].x,
			visibility.list[i].y,
			"",
			"" + visibility.list[i].x + "," + visibility.list[i].y
		));
	}
}

