// ==UserScript==
// @name        HabraStorage HTML5 uploader
// @namespace   habraStorage
// @version     0.01
// @description Этот скрипт позволяет загружать картинки на HabraStorage без необходимости загружать и устанавливать Adobe FlashPlayer!
// @include     http://habrastorage.org/*
// @include     http://www.habrastorage.org/*
// ==/UserScript==

// Мой первый говнокод на JS
// Помогу избавиться от говнокода в C/C++ в обмен на исправление моего
// говнокода тут - <kafemanw@gmail.com>

// Получаем имя пользователя и мега-секретный ключ
var user    = unsafeWindow.user;
var userKey = unsafeWindow.userKey;

// Ну вот, а он не залогинен!
if (user.length == 0) {
	document.innerHTML = 'Извините, но эта штука доступна только пользователям ХабраХабра!';
}

// Сколько файлов загрузили
var uploadsCount = 0;

// На всякий случай избавляемся от оригинального flash-загрузчика
// Кстати, кто-нибудь знает, почему "bittons"? O_o
document.getElementById('bittonsHolder').innerHTML = '';

// "Очередь загрузок" и прогрессбар пока тоже не нужны
document.getElementById('fsUploadProgress').style.display = 'none';

// Делаем поле для "закидывания" файлов
var input = document.createElement('div');
input.innerHTML = '<h2>&rarr; Перетащи картинки сюда! &larr;</h2>Да-да, именно на эту надпись!';
input.id        = 'input';
document.getElementById('bittonsHolder').appendChild(input);

document.getElementById('input').ondragover = function () {
	return false;
};

document.getElementById('input').ondragend = function () {
	return false;
};

// Загружаем файл(ы)
document.getElementById('input').ondrop = function (e) {
	e.preventDefault();

	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'http://habrastorage.org/uploadController/?username='+user+'&userkey='+userKey);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if(xhr.status == 200) {
				// Парсим ответ
				var answer = eval('('+xhr.responseText+')');
				// Добавляем в список
				document.getElementById('uploadedFilesItems').innerHTML += '<div class="uploaded-item"><div class="uploaded-thumbnail"><label for="file-name-0"><img src="' + answer.crop + '" height="96" width="96"></label></div><div class="uploaded-url"><input type="text" size="35" onclick="this.select()" value="&lt;img src=&quot;' + answer.url + '&quot;/&gt;" id="file-name-0"></div></div>';
				// Выводим внизу сколько файлов мы загрузили
				uploadsCount++;
				document.getElementById('divStatus').innerHTML = 'Загружено: ' + uploadsCount;
			}
		}
	};

	if (e.dataTransfer.files.length>1) alert('К сожалению, мультизагрузка сейчас не работает :-(');
	// Если подробнее, то xhr.send(formData); чуть ниже не хочет выполняться второй раз

	// Т.к. HabraStorage принимает только по 1 файлу за раз, то делаем загрузку в цикле
	for (var i = 0; i < e.dataTransfer.files.length; i++) {
		var formData = new FormData();
		formData.append('Filedata', e.dataTransfer.files[i]);
		xhr.send(formData);
	}
}
