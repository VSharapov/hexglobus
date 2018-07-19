function hexCoordsToCanvasCoords(screenX, screenY, evenHexColumn, settings) {
	var x = screenX * settings.columnSpacing;
	var y = screenY * settings.rowSpacing;
	if(screenX % 2 == 0){
		// even screen-columns are "normal"
	}else{
		// odd screen-columns are offset in the Y-dimension
		var offsetDirection = evenHexColumn ? 1 : -1;
		y += (settings.rowSpacing / 2) * offsetDirection;
	}
	return {x: x + settings.canvas.width/2, y: y + settings.canvas.height/2};
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
	sceneSettings.visibility.list.forEach(function(coordinates){
		var hexagon = hexagons.getHex(sceneSettings.scale, coordinates.x, coordinates.y)
		var screenCoords = hexCoordsToCanvasCoords(
			hexagon.x - sceneSettings.hexOffsetX, 
			hexagon.y - sceneSettings.hexOffsetY, 
			sceneSettings.hexOffsetX%2==0,
			sceneSettings
		);
		drawHexagon(
			sceneSettings.canvasContext,
			screenCoords.x,
			screenCoords.y,
			sceneSettings.hexMinorDiameter,
			hexagon
		);
	});
	document.getElementById('status').value='Finished';
}

function sceneVisibility(canvas, hexMajorDiameter, hexMinorDiameter, scale, offsetX, offsetY){
	var visibility = new Object();
	visibility.firstColumn = -Math.ceil(
		(canvas.width-hexMajorDiameter/2)/(3*(hexMajorDiameter/2))
	);
	visibility.finalColumn = -visibility.firstColumn;
	var hexHeightsFloor = Math.floor(canvas.height / hexMinorDiameter);
	var extraRows = 1 * hexHeightsFloor%2==0;
	visibility.firstRow = 0-hexHeightsFloor - (offsetX%2==0) * extraRows;
	visibility.finalRow = 0+hexHeightsFloor + (offsetX%2!=0) * extraRows;
	visibility.list = [];
	for(var i = visibility.firstColumn; i <= visibility.finalColumn; i++){
		for(var j = visibility.firstRow; j <= visibility.finalRow; j++){
			var x = i + offsetX;
			var y = j + offsetY;
			visibility.list.push({scale:scale, x:x, y:y});
		}
	}
	return visibility;
}

