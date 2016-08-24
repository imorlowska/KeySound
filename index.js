window.onload = function() {
	fitText();
	
	meSpeak.loadConfig("dependencies/mespeak/mespeak_config.json");
	meSpeak.loadVoice('dependencies/mespeak/voices/en/en.json');
	times = [];
	i = 0;
	getLetter();
	any = false;
	
	id = meSpeak.speak('Welcome to Key Sound. Please type the following symbols. . . . . . ' + letter);
	//audio = new Audio('test.ogg');
	//audio.play();
	//audio.pause();
	
	
	document.body.onkeydown = function(e){
		if (!any && letter === String.fromCharCode(e.keyCode)) {
			meSpeak.stop(id);
			times.push((new Date().getTime()) - start);
			console.log(i + ": " + times[i]);
			i++;
			if (i % 11 === 0) doStats();
			else getNextLetter();
		} else if (any) {
			meSpeak.stop(id);
			any = false;
			fixText();
			getNextLetter();
		} else {
			meSpeak.stop(id);
			if (letter === "Z") id = meSpeak.speak("z"); // report to mespeak creator
			else id = meSpeak.speak(letter);
		}
	};
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
		id = meSpeak.speak("Your average time is " + average + " milliseconds. Press any key to practice again.");
	} else { //change to seconds
		var newavg = Math.round(average/100) / 10;
		$('#letter')[0].innerHTML = newavg + "s";
		id = meSpeak.speak("Your average time is " + newavg + " seconds. Press any key to practice again.");
	}
	fitText();
	any = true;
}

fixText = function() {
	$('#text')[0].innerHTML = "Type the symbol";
}

fitText = function() {
	$("#text").fitText(2);
	$("#letter").fitText(0.3);
}