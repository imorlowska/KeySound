window.onload = function() {
	fitText();
	
	layouts = ["qwerty", "qwerty-pl"];
	layout_nb = 0;
	layout = layouts[layout_nb];
	
	times = [];
	i = 0;
	any = true;
	
	$.get("http://ipinfo.io", function(response) {
		if (response.country === "PL") {
			layout_nb = 1;
			layout = layouts[layout_nb];
		}
		startTutorial();
	}, "jsonp");
	
	
	document.body.onkeydown = function(e){
		stopSound();
		if (any && isArrow(e.keyCode)) {
			changeLocale();
		} else if (!any && letter === String.fromCharCode(e.keyCode)) {
			times.push((new Date().getTime()) - start);
			i++;
			if (i % 11 === 0) doStats();
			else getNextLetter();
		} else if (any) {
			any = false;
			fixText();
		} else { //repeat symbol
			speakSymbol(letter);
		}
	};
}

isArrow = function(number) {
	return (number >= 37 && number < 41);
}

changeLocale = function() {
	layout_nb = (layout_nb+1) % layouts.length;
	layout = layouts[layout_nb];
	console.log("New layout: " + layout);
	audios = [];
	audios.push( ((layout_nb === 1) ? new Audio('audio/PL/new_layout.mp3') : new Audio('audio/new_layout.mp3')));
	audios.push( new Audio('audio/' + layout + '.mp3'));
	audios.push( ((layout_nb === 1) ? new Audio('audio/PL/press_any_key.mp3') : new Audio('audio/press_any_key.mp3')));
	playAudioList(audios);
	startTutorial(true);
}

stopSound = function() {
	if (!(typeof audio === "undefined")) audio.pause();
}

startTutorial = function(muted) {
	if (layout_nb !== 1) {
		$("#text")[0].innerHTML = "Please use headphones";
		$("#letter")[0].innerHTML = '<span class="glyphicon glyphicon-headphones" aria-hidden="true"></span>';
		fitText();
		audios = [];
		audios.push(new Audio('audio/welcome_headphones.mp3'));
		audios.push(new Audio('audio/press_any_key.mp3'));
	} else {
		$("#text")[0].innerHTML = "Użyj słuchawek";
		$("#letter")[0].innerHTML = '<span class="glyphicon glyphicon-headphones" aria-hidden="true"></span>';
		fitText();
		audios = [];
		audios.push(new Audio('audio/PL/welcome_headphones.mp3'));
		audios.push(new Audio('audio/PL/press_any_key.mp3'));
	}
	
	if (!muted) playAudioList(audios);
}

getLetter = function() {
	var possible = "QWERTYUIOPASDFGHJKLZXCVBNM";
	letter = possible.charAt(Math.floor(Math.random() * possible.length));
	$('#letter')[0].innerHTML = letter;
	start = new Date().getTime();
}

getNextLetter = function() {
	getLetter();
	speakSymbol(letter);
}

speakSymbol = function(symbol) {
	audio = new Audio('audio/' + layout + '/' + symbol + '.mp3');
	audio.play();
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
	$('#text')[0].innerHTML = ((layout_nb === 1)? "Twój średni czas to":"Your average time is")
	if (average < 1000) {
		$('#letter')[0].innerHTML = average + "ms";
	} else { //change to seconds
		var newavg = Math.round(average/100) / 10;
		$('#letter')[0].innerHTML = newavg + "s";
	}
	sayAverage(average);
	fitText();
	any = true;
}

fixText = function() {
	$('#text')[0].innerHTML = ((layout_nb === 1)? "Naciśnij następujący klawisz":"Type the following symbols");
	getLetter();
	audio = ((layout_nb === 1) ? new Audio('audio/PL/type.mp3') : new Audio('audio/type.mp3'))
	audio.play();
	audio.onended = function() {
		speakSymbol(letter);
	}
}

fitText = function() {
	$("#text").fitText(2);
	$("#letter").fitText(0.3);
}

playAudioList = function(tracks) {
	if (tracks.length === 0) {
		return;
	}
	audio = tracks[0];
	audio.play();
	audio.onended = function() {
		playAudioList(tracks.slice(1, tracks.length));
	}
}

sayAverage = function(average) {
	if (layout_nb === 1) sayAveragePL(average);
	else {
		var audios = [];
		if (average < 1000) {
			audios = getNumbersToAudioList(average);
			audios.push(new Audio('audio/times/mss.mp3'));
		} else { //change to seconds
			var number = Math.floor(Math.round(average/100)/10);
			var point = Math.round(average/100) % 10;
			
			audios = getNumbersToAudioList(number);
			
			if (point > 0) {
				audios.push(new Audio('audio/times/point.mp3'));
				audios.push(new Audio('audio/times/' + point + '.mp3'));
			}
			
			if (number === 1 && point === 0) {
				audios.push(new Audio('audio/times/s.mp3'));
			} else {
				audios.push(new Audio('audio/times/ss.mp3'));
			}
		}
		audios.unshift(new Audio('audio/average_time.mp3')); // add to the front
		audios.push(new Audio('audio/press_any_key.mp3'));
		playAudioList(audios);
	}
}

getNumbersToAudioList = function(number) {
	var audios = [];
	
	var thousands = Math.floor(number/1000);
	var hundreds = Math.floor(number/100);
	var tens = Math.floor(number/10) % 10;
	var ones = number % 10;
	
	if (thousands > 0) {
		audios.push(new Audio('audio/times/' + thousands + '.mp3'));
		audios.push(new Audio('audio/times/1000.mp3'));
	}
	
	if (hundreds > 0) {
		audios.push(new Audio('audio/times/' + hundreds + '.mp3'));
		audios.push(new Audio('audio/times/100.mp3'));
	}
	
	if (tens >= 2) {
		audios.push(new Audio('audio/times/' + tens + '0.mp3'));
	}
	
	if (tens === 1) {
		audios.push(new Audio('audio/times/1' + ones + '.mp3'));
	} else if (ones > 0) {
		audios.push(new Audio('audio/times/' + ones + '.mp3'));
	}
	
	return audios;
}

sayAveragePL = function(average) {
	var audios = [];
		if (average < 1000) {
			audios = getNumbersToAudioListPL(average);
			audios.push(new Audio('audio/PL/times/mss.mp3'));
		} else { //change to seconds
			var number = Math.floor(Math.round(average/100)/10);
			var point = Math.round(average/100) % 10;
			
			audios = getNumbersToAudioListPL(number);
			
			if (point > 0) {
				audios.push(new Audio('audio/PL/times/przecinek.mp3'));
				audios.push(new Audio('audio/PL/times/' + point + '.mp3'));
				audios.push(new Audio('audio/PL/times/sekundy.mp3'));
			} else if (number === 1 && point === 0) {
				audios = [];
				audios.push(new Audio('audio/PL/times/jedna_sekunda.mp3'));
			} else if (point === 0){
				if (number < 5) audios.push(new Audio('audio/PL/times/sekundy.mp3'));
				else audios.push(new Audio('audio/PL/times/sekund.mp3'));
			}
		}
		audios.unshift(new Audio('audio/PL/average_time.mp3')); // add to the front
		audios.push(new Audio('audio/PL/press_any_key.mp3'));
		playAudioList(audios);
}

getNumbersToAudioListPL = function(number) {
	var audios = [];
	
	var thousands = Math.floor(number/1000);
	var hundreds = Math.floor(number/100);
	var tens = Math.floor(number/10) % 10;
	var ones = number % 10;
	
	if (thousands > 0) {
		if (thousands === 1) audios.push(new Audio('audio/PL/times/tysiac.mp3'));
		else {
			audios.push(new Audio('audio/PL/times/' + thousands + '.mp3'));
			if (thousands < 5) audios.push(new Audio('audio/PL/times/tysiecy.mp3'));
			else audios.push(new Audio('audio/PL/times/tysiace.mp3'));
		}
	}
	
	if (hundreds > 0) {
		audios.push(new Audio('audio/PL/times/' + hundreds + '00.mp3'));
	}
	
	if (tens >= 2) {
		audios.push(new Audio('audio/PL/times/' + tens + '0.mp3'));
	}
	
	if (tens === 1) {
		audios.push(new Audio('audio/PL/times/1' + ones + '.mp3'));
	} else if (ones > 0) {
		audios.push(new Audio('audio/PL/times/' + ones + '.mp3'));
	}
	
	return audios;
}










