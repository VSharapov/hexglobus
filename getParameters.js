// https://stackoverflow.com/a/5448595/399257
function findGetParameter(parameterName) {
	var result = null,
	tmp = [];
	location.search
		.substr(1)
		.split("&")
		.forEach(function (item) {
			tmp = item.split("=");
			if (decodeURIComponent(tmp[0]) === parameterName) result = decodeURIComponent(tmp[1]);
		});
	return result;
}

