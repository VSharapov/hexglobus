function main() {
  var canvas = document.querySelector('canvas');

  function initSize() {
    var percentageWidth = 50.0;
    canvas.width=window.innerWidth * (percentageWidth / 100.0);
    canvas.height=window.innerHeight;
  }

  var c = canvas.getContext('2d');

  var defaultSettings = [
    new Setting(
      "Hex size", 
      "number", 
      "60", 
      "4", 
      "px (minor diameter)"
    ),
    new Setting(
      "Random iterations", 
      "number", 
      "1", 
      "4", 
      " Change to get a different set of random colors"
    ),
    new Setting(
      "Transparency", 
      "checkbox", 
      "", 
      "", 
      " Makes everything 50% opaque"
    ),
    new Setting(
      "View scale", 
      "number", 
      "0", 
      "4"
    ),
    new Setting(
      "No zoom on scaling", 
      "checkbox", 
      "", 
      "", 
      " don't change hex size when changing scale to roughly match view area"
    ),
    new Setting(
      "View coordinate X", 
      "number", 
      "0", 
      "4"
    ),
    new Setting(
      "View coordinate Y", 
      "number", 
      "0", 
      "4"
    )
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

  function redraw(event=null) {
    initSize();

    if(event != null && event.target == document.getElementById('View scale')){
      var changeDirection = {true: -1, false: 1};
      changeDirection = changeDirection[
        sceneSettings.viewScale > loadSetting('View scale')
      ];
      var changeAmount = Math.pow(2, changeDirection);
      newHexSize = loadSetting('Hex size');
      while(sceneSettings.viewScale != loadSetting('View scale')){
        if(!loadSetting('No zoom on scaling')){
          newHexSize = newHexSize * changeAmount;
        }
        sceneSettings.viewScale += changeDirection;
        document.getElementById('View coordinate X').value = Math.floor(
          document.getElementById('View coordinate X').value/changeAmount
        );
        document.getElementById('View coordinate Y').value = Math.floor(
          document.getElementById('View coordinate Y').value/changeAmount
        );
      }
      document.getElementById('Hex size').value = parseInt(newHexSize);
    }

    sceneSettings.hexMinorDiameter = 
      loadSetting('Hex size');
    sceneSettings.hexMajorDiameter = 
      sceneSettings.hexMinorDiameter / Math.cos(Math.PI / 6);
    sceneSettings.columnSpacing = 
      sceneSettings.hexMajorDiameter * 3 / 4;
    sceneSettings.rowSpacing = 
      sceneSettings.hexMinorDiameter;
    sceneSettings.transparency = 
      loadSetting('Transparency');
    sceneSettings.viewScale = 
      loadSetting('View scale');
    sceneSettings.noZoomOnScaling = 
      loadSetting('No zoom on scaling');
    sceneSettings.hexOffsetX = 
      loadSetting('View coordinate X');
    sceneSettings.hexOffsetY = 
      loadSetting('View coordinate Y');
    hexagonSettings.rngSettings.minimumIterations = 
      loadSetting('Random iterations');
    sceneSettings.scale = 
      loadSetting('View scale');
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
    // console.log(JSON.stringify(hexagons).length);
    // console.log(LZString.compressToBase64(JSON.stringify(hexagons)).length);
    // console.log(LZString.compressToBase64(JSON.stringify(hexagons));
    document.getElementById('status').value='Rendering...';
    setTimeout(function(){
      drawScene(sceneSettings, hexagons);
    }, 0);
    function craftURL(d, l) {
      url = String(l).split('?')[0];
      url += '?';
      d.forEach(function(defaultSetting) {
        var current = loadSetting(defaultSetting.displayNameAndId);
        if(current != defaultSetting.value){
          url += encodeURIComponent(defaultSetting.displayNameAndId);
          if(defaultSetting.inputType != "checkbox"){
            url += '=' + encodeURIComponent(current);
          }
          url += '&';
        }
      });
      return url.slice(0, url.length-1);
    }
    document.getElementById('viewURL').value = craftURL(
      defaultSettings, 
      document.location
    );
  }
  redraw();
  
  window.addEventListener('resize', redraw);
  for(var i = 0; i < defaultSettings.length; i++){
    document.getElementById(
      defaultSettings[i].displayNameAndId
    ).addEventListener('change', redraw);
  }
}


