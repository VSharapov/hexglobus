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

