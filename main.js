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
		new Setting("Random iterations", "number", "random-iterations", "1", "4", " Change to get a different set of random colors"),
		new Setting("Transparency", "checkbox", "transparency", "", "", " Makes everything 50% opaque"),
		new Setting("View coordinate X", "number", "view-coordinate-x", "0", "4"),
		new Setting("View coordinate Y", "number", "view-coordinate-y", "0", "4")
	]
	makeSettingsInterface(defaultSettings);

	var mouseController = new MouseController();
	canvas.addEventListener('mousewheel', function(event){
		mouseController.wheel(event);
		return false; 
	}, false);

	var keyController = new KeyboardController();
	window.addEventListener('keydown', function(event){
		keyController.keyDown(event);
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


