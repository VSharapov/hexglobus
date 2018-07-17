var urlToGetAllOpenIssues = "https://api.github.com/repos/VSharapov/hexglobus/issues?state=open";
fetch(urlToGetAllOpenIssues)
	.then(function(response) {
		return response.json();
	})
	.then(function(myJson) {
		myJson.forEach(printIssue);
	});

function printIssue(issue) {
	var htmlText = "<a href=\"" + 
		issue.html_url + 
		"\"><h3 class=\"issue\">" + 
		issue.title + 
		"</h3></a><p class=\"issue\">" + 
		issue.body + 
		"</p><br />";
		document.getElementById('issues').innerHTML += htmlText;
}

