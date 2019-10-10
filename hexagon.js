function Hexagon(
  allHexagons,
  allHexagonSettings,
  scale=0,
  x,
  y,
  fillColor="", // Empty string for pseudo-random color
  text="")
{
  // Constant
  this.allHexagons=allHexagons;
  this.scale=scale;
  this.x=x;
  this.y=y;
  this.constantProperties=[scale, x, y];
  // Variable
  this.fillColor=fillColor;
  this.text=text;

  if(fillColor == ""){
    if(this.scale > 0){
      var childHexes = this.childHexes(true, allHexagonSettings);
      var contributingColors = [];
      for(i = 0; i < childHexes.list.length; i++){
        contributingColors.push(childHexes.list[i].fillColor);
      }
      contributingColors.push(childHexes.list[0].fillColor);
      if(this.x==0 && this.y==0){
        // console.log(contributingColors, this)
        // console.log(childHexes)
      }
      this.fillColor=mixColors(contributingColors);
    }else if(this.scale < 0){
      //inherit color from parent(s)
      var parentHexes = this.parentHexes(true, allHexagonSettings);
      var contributingColors = [];
      for(i = 0; i < parentHexes.list.length; i++){
        contributingColors.push(parentHexes.list[i].fillColor);
      }
      this.fillColor=mixColors(contributingColors);
    }else{
      this.fillColor=generateDeterministicColor(
        this.constantProperties, allHexagonSettings.rngSettings
      );
    }
  }
}

Hexagon.prototype.parentHexes = function (generateIfMissing, hexagonSettings) {
  var out = new Object();
  out.visibility = new Object();
  out.visibility.list = [];
  if(!(this.x%2 && this.y%2)){
    out.visibility.list.push({
      scale:this.scale+1,
      x:Math.floor(this.x/2),
      y:Math.floor(this.y/2)
    });
  }else{
    out.visibility.list.push({
      scale:this.scale+1,
      x:Math.ceil(this.x/2),
      y:Math.floor(this.y/2)
    });
    out.visibility.list.push({
      scale:this.scale+1,
      x:Math.floor(this.x/2),
      y:Math.ceil(this.y/2)
    });
  }
  if((this.x%2 || this.y%2) && !(this.x%2 && this.y%2)){
    out.visibility.list.push({
      scale:this.scale+1,
      x:Math.ceil(this.x/2),
      y:Math.ceil(this.y/2)
    });
  }
  if(generateIfMissing){
    this.allHexagons.generateVisible(out.visibility, hexagonSettings);
  }
  out.list = [];
  for(var i = 0; i < out.visibility.list.length; i++){
    out.list.push(this.allHexagons.getHex(
      out.visibility.list[i].scale,
      out.visibility.list[i].x,
      out.visibility.list[i].y
    ));
  }
  return out;
}

Hexagon.prototype.childHexes = function (generateIfMissing, hexagonSettings) {
  var out = new Object();
  out.visibility = new Object();
  out.visibility.list = [];
  var childOffsets = [
         [0, 0],
    // Center is always first
         [0,-1],
    [-1, 0], [1,-1],
    [-1, 1], [1, 0],
         [0, 1]
  ];
  for(var i = 0; i < childOffsets.length; i++){
    out.visibility.list.push({
      scale:this.scale-1,
      x:this.x*2 + childOffsets[i][0],
      y:this.y*2 + childOffsets[i][1]
    });
  }
  if(generateIfMissing){
    this.allHexagons.generateVisible(out.visibility, hexagonSettings);
  }
  out.list = [];
  for(var i = 0; i < out.visibility.list.length; i++){
    out.list.push(this.allHexagons.getHex(
      out.visibility.list[i].scale,
      out.visibility.list[i].x,
      out.visibility.list[i].y
    ));
  }
  return out;
}

function Hexagons() {
  this.list = []
  this.sxy = {}
}

Hexagons.prototype.getHex = function (scale, x, y) {
  if(scale in this.sxy == false){return undefined;}
  if(x in this.sxy[scale] == false){return undefined;}
  if(y in this.sxy[scale][x] == false){return undefined;}
  else{return this.sxy[scale][x][y]}
}

Hexagons.prototype.sxyAdd = function (hex) {
  var s = hex.scale
  var x = hex.x
  var y = hex.y

  if(s in this.sxy == false){
    this.sxy[s] = {}
  }
  if(x in this.sxy[s] == false){
    this.sxy[s][x] = {}
  }
  var retval = y in this.sxy[s][x];
  if(retval){
    console.log("Weird, this hex just got overwritten:")
    console.log(this.sxy[s][x][y])
    console.log("...with this one")
    console.log(hex)
  }
  this.sxy[s][x][y] = hex;
  return retval;
}

Hexagons.prototype.generateVisible = function (visibility, hexagonSettings) {
  for (var i = 0; i < visibility.list.length; i++) {
    if(this.getHex(
      visibility.list[i].scale,
      visibility.list[i].x,
      visibility.list[i].y
    ) == undefined){
      newHex = new Hexagon(
        this,
        hexagonSettings,
        visibility.list[i].scale,
        visibility.list[i].x,
        visibility.list[i].y,
        "",
        "" + visibility.list[i].x + "," + visibility.list[i].y
      )
      this.list.push(newHex);
      this.sxyAdd(newHex);
    }
  }
}

