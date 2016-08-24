window.onload = function() {
	fitText();
	
	meSpeak.loadConfig("dependencies/mespeak/mespeak_config.json");
	meSpeak.loadVoice('dependencies/mespeak/voices/en/en.json');
	times = [];
	i = 0;
	any = true;

	startTutorial();
	
	document.body.onkeydown = function(e){
	stopSound();
		if (!any && letter === String.fromCharCode(e.keyCode)) {
			times.push((new Date().getTime()) - start);
			i++;
			if (i % 11 === 0) doStats();
			else getNextLetter();
		} else if (any) {
			any = false;
			fixText();
		} else { //repeat symbol
			if (letter === "Z") id = meSpeak.speak("z"); // report to mespeak creator
			else id = meSpeak.speak(letter);
		}
	};
}

stopSound = function() {
	if (!(typeof id === "undefined")) meSpeak.stop(id);
	if (!(typeof audio === "undefined")) audio.pause();
}

startTutorial = function() {
	audio = new Audio('audio/welcome_headphones.ogg');
	audio.play();
	audio.onended = function() {pressAnyKey();};
}

pressAnyKey = function() {
	stopSound();
	audio = new Audio('audio/press_any_key.ogg');
	any = true;
	audio.play();
}

getLetter = function() {
	var possible = "QWERTYUIOPASDFGHJKLZXCVBNM0123456789";
	letter = possible.charAt(Math.floor(Math.random() * possible.length));
	$('#letter')[0].innerHTML = letter;
	start = new Date().getTime();
}

getNextLetter = function() {
	getLetter();
	if (letter === "Z") id = meSpeak.speak("z"); // report to mespeak creator
	else id = meSpeak.speak(letter);
}

doStats = function() {
	var sum = 0;
	for (j = 1; j < times.length; j++) { //disregard first one
		sum += times[j];
	}
	var average = parseInt((sum / times.length) | 0);
	times = [];
	i = 0;
	console.log("Average time: " + average);
	$('#text')[0].innerHTML = "Your average time is";
	if (average < 1000) {
		$('#letter')[0].innerHTML = average + "ms";
	} else { //change to seconds
		var newavg = Math.round(average/100) / 10;
		$('#letter')[0].innerHTML = newavg + "s";
	}
	audio = new Audio('audio/average_time.ogg');
	audio.play();
	audio.onended = function() {
		if (average < 1000) {
			id = meSpeak.speak(average + " milliseconds.");
		} else { //change to seconds
			id = meSpeak.speak(newavg + " seconds.");
		}
		setTimeout(pressAnyKey, 3000);
	}
	fitText();
	any = true;
}

fixText = function() {
	$('#text')[0].innerHTML = "Type the following symbols";
	getLetter();
	audio = new Audio('audio/type.ogg');
	audio.play();
	audio.onended = function() {
		if (letter === "Z") id = meSpeak.speak("z"); // report to mespeak creator
		else id = meSpeak.speak(letter);
	}
}

fitText = function() {
	$("#text").fitText(2);
	$("#letter").fitText(0.3);
}