window.onload = function() {
	fitText();
	
	layout = "qwerty";
	
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
			speakLetter(letter);
		}
	};
}

stopSound = function() {
	if (!(typeof audio === "undefined")) audio.pause();
}

startTutorial = function() {
	audios = [];
	audios.push(new Audio('audio/welcome_headphones.ogg'));
	audios.push(new Audio('audio/press_any_key.ogg'));
	
	playAudioList(audios);
}

getLetter = function() {
	var possible = "1234567890QWERTYUIOPASDFGHJKLZXCVBNM";
	letter = possible.charAt(Math.floor(Math.random() * possible.length));
	$('#letter')[0].innerHTML = letter;
	start = new Date().getTime();
}

getNextLetter = function() {
	getLetter();
	speakLetter(letter);
}

speakLetter = function(symbol) {
	audio = new Audio('audio/' + layout + '/' + symbol + '.ogg');
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
	$('#text')[0].innerHTML = "Your average time is";
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
	$('#text')[0].innerHTML = "Type the following symbols";
	getLetter();
	audio = new Audio('audio/type.ogg');
	audio.play();
	audio.onended = function() {
		speakLetter(letter);
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
	var audios = [];
	if (average < 1000) {
		var hundreds = Math.floor(average/100);
		var tens = Math.floor(average/10) % 10;
		var ones = average % 10;
		
		audios = getAudioList(average);
		audios.push(new Audio('audio/times/mss.ogg'));
		
		
	} else { //change to seconds
		var number = Math.floor(Math.round(average/100)/10);
		var point = Math.round(average/100) % 10;
		
		audios = getAudioList(number);
		
		if (point > 0) {
			audios.push(new Audio('audio/times/point.ogg'));
			audios.push(new Audio('audio/times/' + point + '.ogg'));
		}
		
		if (number === 1 && point === 0) {
			audios.push(new Audio('audio/times/s.ogg'));
		} else {
			audios.push(new Audio('audio/times/ss.ogg'));
		}
		
	}
	audios.unshift(new Audio('audio/average_time.ogg'));
	audios.push(new Audio('audio/press_any_key.ogg'));
	playAudioList(audios);
}

getAudioList = function(number) {
	var audios = [];
	var hundreds = Math.floor(number/100);
	var tens = Math.floor(number/10) % 10;
	var ones = number % 10;
	
	if (hundreds > 0) {
		audios.push(new Audio('audio/times/' + hundreds + '.ogg'));
		audios.push(new Audio('audio/times/100.ogg'));
	}
	
	if (tens >= 2) {
		audios.push(new Audio('audio/times/' + tens + '0.ogg'));
	}
	
	if (tens === 1) {
		audios.push(new Audio('audio/times/1' + ones + '.ogg'));
	} else if (ones > 0) {
		audios.push(new Audio('audio/times/' + ones + '.ogg'));
	}
	
	return audios;
}










