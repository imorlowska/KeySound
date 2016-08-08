window.onload = function() {
	$("#text").fitText(2);
	$("#letter").fitText(0.3);
    letter = "A";
	$('#letter')[0].innerHTML = letter;
	document.body.onkeydown = function(e){
	console.log(String.fromCharCode(e.keyCode) + " ? " + letter);
		if (letter === String.fromCharCode(e.keyCode)) {
			getNextLetter();
		}
	};
}

getNextLetter = function() {
	var possible = "QWERTYUIOPASDFGHJKLZXCVBNM0123456789";
	letter = possible.charAt(Math.floor(Math.random() * possible.length));
	$('#letter')[0].innerHTML = letter;
}