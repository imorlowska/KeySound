window.onload = function() {
	$("#text").fitText(2);
	$("#letter").fitText(0.3);
	
	meSpeak.loadConfig("dependencies/mespeak/mespeak_config.json");
	meSpeak.loadVoice('dependencies/mespeak/voices/en/en.json');
	
	getLetter();
	
	id = meSpeak.speak('Welcome to Key Sound. Please type the following symbols. . . . . . ' + letter);
	//new Audio('test.mp3').play();
	
	document.body.onkeydown = function(e){
		if (letter === String.fromCharCode(e.keyCode)) {
			meSpeak.stop(id);
			getNextLetter();
		}
	};
}

getLetter = function() {
	var possible = "QWERTYUIOPASDFGHJKLZXCVBNM0123456789";
	letter = possible.charAt(Math.floor(Math.random() * possible.length));
	$('#letter')[0].innerHTML = letter;
}

getNextLetter = function() {
	getLetter();
	if (letter === "Z") id = meSpeak.speak("z"); // report to mespeak creator
	else id = meSpeak.speak(letter);
}