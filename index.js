window.onload = function() {
	$("#text").fitText(2);
	$("#letter").fitText(0.3);
	
	meSpeak.loadConfig("dependencies/mespeak/mespeak_config.json");
	meSpeak.loadVoice('dependencies/mespeak/voices/en/en-us.json');
	id = meSpeak.speak('Welcome to Key Sound. Please type the following symbols. . . . . . z');
	
    letter = 'Z';
	$('#letter')[0].innerHTML = letter;
	
	document.body.onkeydown = function(e){
	//console.log(String.fromCharCode(e.keyCode) + " ? " + letter);
		if (letter === String.fromCharCode(e.keyCode)) {
			meSpeak.stop(id);
			getNextLetter();
		}
	};
}

getNextLetter = function() {
	var possible = "QWERTYUIOPASDFGHJKLZXCVBNM0123456789";
	letter = possible.charAt(Math.floor(Math.random() * possible.length));
	$('#letter')[0].innerHTML = letter;
	if (letter === "Z") id = meSpeak.speak("z"); // report to mespeak creator
	else id = meSpeak.speak(letter);
}