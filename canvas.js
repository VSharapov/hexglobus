function hexCoordsToCanvasCoords(screenX, screenY, evenHexColumn, settings) {
	var x = screenX * settings.columnSpacing;
	var y = screenY * settings.rowSpacing + screenX * settings.rowSpacing * 0.5;
	return {x: x + settings.canvas.width/2, y: y + settings.canvas.height/2};
}

function drawSimpleHexagon(c, centerX, centerY, d, color, holeFactor=0.0) {
	r = d/2;
	R = r / Math.cos(Math.PI / 6);
	c.beginPath();
	c.moveTo(centerX + R, centerY);
	c.lineTo(centerX + R/2, centerY + r);
	c.lineTo(centerX - R/2, centerY + r);
	c.lineTo(centerX - R, centerY);
	c.lineTo(centerX - R/2, centerY - r);
	c.lineTo(centerX + R/2, centerY - r);
	c.closePath();
	if(holeFactor > 0){
		hole_r = r * holeFactor;
		hole_R = R * holeFactor;
		c.moveTo(centerX + hole_R, centerY);
		c.lineTo(centerX + hole_R/2, centerY - hole_r);
		c.lineTo(centerX - hole_R/2, centerY - hole_r);
		c.lineTo(centerX - hole_R, centerY);
		c.lineTo(centerX - hole_R/2, centerY + hole_r);
		c.lineTo(centerX + hole_R/2, centerY + hole_r);
		c.closePath();
	}
	c.fillStyle = color;
	c.fill();
}

function drawHexagon(c, centerX, centerY, d, hexagon, highl) {
	drawSimpleHexagon(c, centerX, centerY, d, hexagon.fillColor);
	fontFactor = 4; // This is about as big as you can go for printing 3 digit coordinates
	c.font = Math.floor(d/fontFactor) + "px Arial";
	c.fillStyle = invertColor(c.fillStyle, 1);
	c.textAlign = "center";
	c.textBaseline = "middle";
	c.fillText(hexagon.text, centerX, centerY);
}

function drawScene(sceneSettings, hexagons) {
	sceneSettings.canvasContext.globalAlpha = 1 - 0.5 * sceneSettings.transparency;
	sceneSettings.visibility.list.forEach(function(coordinates){
		var hexagon = hexagons.getHex(sceneSettings.scale, coordinates.x, coordinates.y)
		var screenCoords = hexCoordsToCanvasCoords(
			hexagon.x - sceneSettings.hexOffsetX, 
			hexagon.y - sceneSettings.hexOffsetY, 
			sceneSettings.hexOffsetX%2==0,
			sceneSettings
		);
		var centralHex = (
			screenCoords.x == sceneSettings.canvas.width/2 &&
			screenCoords.y == sceneSettings.canvas.height/2);
		drawHexagon(
			sceneSettings.canvasContext,
			screenCoords.x,
			screenCoords.y,
			sceneSettings.hexMinorDiameter,
			hexagon
		);
		if(centralHex){
			drawSimpleHexagon(
				sceneSettings.canvasContext,
				screenCoords.x,
				screenCoords.y,
				sceneSettings.hexMinorDiameter,
				"#000000",
				0.85
			);
			drawSimpleHexagon(
				sceneSettings.canvasContext,
				screenCoords.x,
				screenCoords.y,
				sceneSettings.hexMinorDiameter * 0.95,
				"#FFFFFF",
				0.95
			);
		}
	});
  // // Draws 1/4 and 3/4 lines for height and width. If you multiply all canvas width/height references by 0.5 this is really useful
  // // for debugging visibility calculations... which are all set now... except for one corner case.
  // sceneSettings.canvasContext.strokeRect(0, sceneSettings.canvas.height/4, sceneSettings.canvas.width, sceneSettings.canvas.height/2);
  // sceneSettings.canvasContext.strokeRect(sceneSettings.canvas.width/4, 0, sceneSettings.canvas.width/2, sceneSettings.canvas.height);
	document.getElementById('status').value='Finished';
}

function sceneVisibility(canvas, hexMajorDiameter, hexMinorDiameter, scale, offsetX, offsetY){
	var visibility = new Object();
	// First we delimit a rhombus which encapsulates the area on screen...
	visibility.firstColumn = -Math.ceil(
		(canvas.width-hexMajorDiameter/2)/(3*(hexMajorDiameter/2))
	); // This is elegant but technically wrong when hexHeightsFloor==0
	visibility.finalColumn = -visibility.firstColumn;
	var hexHeightsFloor = Math.floor(canvas.height / hexMinorDiameter);
	var extraRows = 1 * Number(hexHeightsFloor%2==0);
	firstRowAtZero = 0-Math.ceil(hexHeightsFloor/2);
	finalRowAtZero = 0+Math.ceil(hexHeightsFloor/2);
	visibility.firstRow = firstRowAtZero-Math.ceil(
		visibility.finalColumn / 2
	);
	visibility.finalRow = -visibility.firstRow;
	visibility.list = [];
	for(var i = visibility.firstColumn; i <= visibility.finalColumn; i++){
		for(var j = visibility.firstRow; j <= visibility.finalRow; j++){
			var x = i + offsetX;
			var y = j + offsetY;
      // if(!(y+Math.ceil(x/2-(x%2*hexHeightsFloor%2)) < firstRowAtZero)){
      if(
        !(y+x/2+(Math.abs(x)%2)*((hexHeightsFloor+1)%2) < firstRowAtZero) &&
        !(y+x/2-(Math.abs(x)%2)*((hexHeightsFloor+1)%2) > finalRowAtZero)
      ){
        visibility.list.push({scale:scale, x:x, y:y});
      }
		}
	}
	return visibility;
}

