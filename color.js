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

function getIntColor(num) {
	var moddedNumber = num % 0x1000000; // Only 6 hex digits needed
	var flooredNumber = Math.floor(moddedNumber); // Just in case?
	return "#" + padZero(moddedNumber.toString(16), 6);
}

function generateDeterministicColor(constantProperties, rngSettings) {
	var scale = constantProperties[0];
	var seedString = JSON.stringify(constantProperties);
	var tempRNG = new RNG(seedString);
	// The prng should make different colors based on scale
	var randomIterations = rngSettings.minimumIterations + Math.abs(scale*2-(scale<0 ? 1 : 0));
	var randomNumber;
	for(var i = 0; i < randomIterations; i++){
		randomNumber = ((tempRNG.nextByte() << 16) | (tempRNG.nextByte() << 8) | (tempRNG.nextByte() & 0xFF));
	}
	var color = getIntColor(randomNumber);
	return color;
}

