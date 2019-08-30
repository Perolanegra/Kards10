let botao = document.querySelector(".botao");
botao.onclick = function() {
	toggleClass(botao, "teste");
};

function $id(el) {
	return document.getElementById(el);
}

function $name(el) {
	return document.getElementsByName(el);
}

function $tag(el) {
	return document.getElementsByTagName(el);
}

function $all(el) {
	return document.querySelectorAll(el);
}

function $sel(el) {
	return document.querySelector(el);
}

function hasClass(target, className) {
	return new RegExp("(\\s|^)" + className + "(\\s|$)").test(target.className);
}

function addClass(ele, cls) {
	if (!hasClass(ele, cls)) ele.className += " " + cls;
}

function removeClass(ele, cls) {
	if (hasClass(ele, cls)) {
		var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
		ele.className = ele.className.replace(reg, "");
	}
}

// Ex de uso toggleClass(nomeElemento,'classeToglada')
function toggleClass(ele, cls) {
	if (ele.classList) {
		ele.classList.toggle(cls);
	} else {
		var classes = ele.className.split(" ");
		var existingIndex = -1;
		for (var i = classes.length; i--; ) {
			if (classes[i] === cls) existingIndex = i;
		}

		if (existingIndex >= 0) {
			classes.splice(existingIndex, 1);
		} else {
			classes.push(cls);
			ele.className = classes.join(" ");
		}
	}
}

// Adiciona estilos inline
// Ele checka se já existe estilo e concatena os demais estilos, se houver estilo display ele reseta os estilos
// objetoDeEstilo = `color: red;width; 100px;height: 100px;`
// addStyles(elemento,objetoDeEstilo);
function addStyles(element, styles) {
	let stl = element.getAttribute("style");
	let stlDisplay = element.getAttribute("style").includes("display");

	function chkStyle() {
		if (stl) {
			if (stlDisplay) {
				element.setAttribute("style", "");
				return stl + ";" + styles;
			} else {
				return stl + ";" + styles;
			}
		} else {
			return styles;
		}
	}

	element.setAttribute("style", chkStyle());
}

// Adiciona display-block
function addStylesShow(element) {
	element.setAttribute("style", "");
	addStyles(element, `display: block!important;`);
}

// Adiciona display none mais estilos para hide cross-browser
function addStylesHide(element) {
	element.setAttribute("style", "");
	let stylesHide = `
	display:none!important;
	position: absolute !important;
	height: 1px;
	width: 1px;
	overflow: hidden;
	clip: rect(1px 1px 1px 1px);
	clip: rect(1px, 1px, 1px, 1px);`;
	addStyles(element, stylesHide);
}

function toggleShown(sel) {
	var e = document.querySelector(sel);
	if (e.style.display == "none") {
		e.style.display = "block";
	} else {
		e.style.display = "none";
	}
}

// Remover eventListners the um elemento - removeEvt(document.getElementById("btn"));
// Remover eventListners the um elemento e todos os filhos - removeEvt(document.getElementById("list"), true);
function removeEvt(el, withChildren) {
	if (withChildren) {
		el.parentNode.replaceChild(el.cloneNode(true), el);
	} else {
		var newEl = el.cloneNode(false);
		while (el.hasChildNodes()) newEl.appendChild(el.firstChild);
		el.parentNode.replaceChild(newEl, el);
	}
}

// Usada para usar obj dinamicos como target de eventos, passando uma classe para função
// EX: 	const loadingNew = dynamicObj("loading");
function dynamicObj(targetClass) {
	let all = $all(`.${targetClass}`) || "";
	let obj = all[all.length - 1];
	return obj;
}

// for crossbrowser
// document.documentElement.clientWidth
// document.body.clientWidth
function heightChange(elm, callback) {
	let lastHeight = elm.clientHeight,
		newHeight;
	(function run() {
		newHeight = elm.clientHeight;
		if (lastHeight != newHeight) callback();
		lastHeight = newHeight;

		if (elm.heightChangeTimer) clearTimeout(elm.heightChangeTimer);

		elm.heightChangeTimer = setTimeout(run, 200);
	})();
}

// Ao voltar na pagina resetar o estado do html
function backHistoryFix() {
	let refresh = `<input type="hidden" id="refreshed" value="yes">`;
	let page = $sel("body");
	page.innerHTML += refresh;

	window.onpageshow = function(event) {
		if (event.persisted) {
			var e = $id("refreshed");
			e.value = "no";
		} else {
			e.value = "yes";
		}
		e.value == "no" ? location.reload() : "";
	};
}

function userAgentHTML() {
	let el = document.documentElement;
	el.setAttribute("data-useragent", navigator.userAgent);
	el.setAttribute("data-platform", navigator.platform);
	el.className +=
		!!("ontouchstart" in window) || !!("onmsgesturechange" in window)
			? " touch"
			: "";
}

function isVisible(elm) {
	if (elm.style.visibility === "hidden") {
		return false;
	}
	if (elm.style.display === "none") {
		return false;
	}
	return true;
}


// Método que valida se um texto possui html, aspas, muitos espaços ou é vazio ou não atinge o minlenght
// Ele também retorna os erros e coloca um uma div especifica habilitando e desabilitando o botao do formulário

// Exemplo de uso
// let textareaSelector = $sel("#enviar-email-description");
// let targetMessage = $sel(".enviar-email-messages");
// let send = $sel("#enviar-email a.button");
// textareaSelector.onkeyup = function() {
// 	let textareaVal = textareaSelector.value;
// 	checkStringInput(textareaVal,targetMessage,send,"button--disabled","button--blue");
// };

function checkStringInput(string,	target,	sendButton,	classDisable, classEnable) {
	// Regex caracteres HTML
	let html = /(<([^>]+)>)/gi;
	// Regex para aspas " e '
	let quotes = /['"]+/g;
	// Regex para espaços consecutivos
	let spaces = /\s\s+/g;

	if (string.match(html)) {
		target.innerHTML = "";
		removeClass(sendButton, classEnable);
		sendButton.classList.contains(classDisable)
			? ""
			: addClass(sendButton, classDisable);
		let erro = "Não é permitido o envio de tags em HTML.";
		target.innerHTML = chooseMessageType(erro, "danger");
	} else if (string.match(quotes)) {
		target.innerHTML = "";
		removeClass(sendButton, classEnable);
		sendButton.classList.contains(classDisable)
			? ""
			: addClass(sendButton, classDisable);
		let erro = "Não é permitido o envio de tags com aspas.";
		target.innerHTML = chooseMessageType(erro, "danger");
	} else if (string.match(spaces)) {
		target.innerHTML = "";
		removeClass(sendButton, classEnable);
		sendButton.classList.contains(classDisable)
			? ""
			: addClass(sendButton, classDisable);
		let erro = "O texto digitado contém muitos espaços entre as palavras.";
		target.innerHTML = chooseMessageType(erro, "danger");
	} else if (string.length <= 0) {
		target.innerHTML = "";
		removeClass(sendButton, classEnable);
		sendButton.classList.contains(classDisable)
			? ""
			: addClass(sendButton, classDisable);
		let erro = "Sua mensagem não pode estar vazia.";
		target.innerHTML = chooseMessageType(erro, "warning");
	} else if (string.length <= 7) {
		target.innerHTML = "";
		removeClass(sendButton, classEnable);
		sendButton.classList.contains(classDisable)
			? ""
			: addClass(sendButton, classDisable);
		let erro = "Você precisa digitar um texto para enviar o formulário.";
		target.innerHTML = chooseMessageType(erro, "warning");
	} else {
		target.innerHTML = "";
		removeClass(sendButton, classDisable);
		addClass(sendButton, classEnable);
	}
}

// Método que retorna um template padrão de mensagens
// Type pode ser danger, warning, wait, loader, info e success
function chooseMessageType(erro, type) {
	return `<div class="alert alert-xs alert-${type}">
						<strong>Erro - </strong>${erro}
					</div>`;
}

// Método que converte uma string para minúsculo sem caracteres especiais
function regexStr(str, regexChain) {

	const regexData = [{
			pattern: "À",
			result: "A"
		},
		{
			pattern: "Á",
			result: "A"
		},
		{
			pattern: "Â",
			result: "A"
		},
		{
			pattern: "Ã",
			result: "A"
		},
		{
			pattern: "Ä",
			result: "A"
		},
		{
			pattern: "Å",
			result: "A"
		},
		{
			pattern: "Æ",
			result: "AE"
		},
		{
			pattern: "Ç",
			result: "C"
		},
		{
			pattern: "È",
			result: "E"
		},
		{
			pattern: "É",
			result: "E"
		},
		{
			pattern: "Ê",
			result: "E"
		},
		{
			pattern: "Ë",
			result: "E"
		},
		{
			pattern: "Ì",
			result: "I"
		},
		{
			pattern: "Í",
			result: "I"
		},
		{
			pattern: "Î",
			result: "I"
		},
		{
			pattern: "Ï",
			result: "I"
		},
		{
			pattern: "Ĳ",
			result: "IJ"
		},
		{
			pattern: "Ð",
			result: "D"
		},
		{
			pattern: "Ñ",
			result: "N"
		},
		{
			pattern: "Ò",
			result: "O"
		},
		{
			pattern: "Ó",
			result: "O"
		},
		{
			pattern: "Ô",
			result: "O"
		},
		{
			pattern: "Õ",
			result: "O"
		},
		{
			pattern: "Ö",
			result: "O"
		},
		{
			pattern: "Ø",
			result: "O"
		},
		{
			pattern: "Œ",
			result: "OE"
		},
		{
			pattern: "Þ",
			result: "TH"
		},
		{
			pattern: "Ù",
			result: "U"
		},
		{
			pattern: "Ú",
			result: "U"
		},
		{
			pattern: "Û",
			result: "U"
		},
		{
			pattern: "Ü",
			result: "U"
		},
		{
			pattern: "Ý",
			result: "Y"
		},
		{
			pattern: "Ÿ",
			result: "Y"
		},
		{
			pattern: "à",
			result: "a"
		},
		{
			pattern: "á",
			result: "a"
		},
		{
			pattern: "â",
			result: "a"
		},
		{
			pattern: "ã",
			result: "a"
		},
		{
			pattern: "ä",
			result: "a"
		},
		{
			pattern: "å",
			result: "a"
		},
		{
			pattern: "æ",
			result: "ae"
		},
		{
			pattern: "ç",
			result: "c"
		},
		{
			pattern: "è",
			result: "e"
		},
		{
			pattern: "é",
			result: "e"
		},
		{
			pattern: "ê",
			result: "e"
		},
		{
			pattern: "ë",
			result: "e"
		},
		{
			pattern: "ì",
			result: "i"
		},
		{
			pattern: "í",
			result: "i"
		},
		{
			pattern: "î",
			result: "i"
		},
		{
			pattern: "ï",
			result: "i"
		},
		{
			pattern: "ĳ",
			result: "ij"
		},
		{
			pattern: "ð",
			result: "d"
		},
		{
			pattern: "ñ",
			result: "n"
		},
		{
			pattern: "ò",
			result: "o"
		},
		{
			pattern: "ó",
			result: "o"
		},
		{
			pattern: "ô",
			result: "o"
		},
		{
			pattern: "õ",
			result: "o"
		},
		{
			pattern: "ö",
			result: "o"
		},
		{
			pattern: "ø",
			result: "o"
		},
		{
			pattern: "œ",
			result: "oe"
		},
		{
			pattern: "ß",
			result: "ss"
		},
		{
			pattern: "þ",
			result: "th"
		},
		{
			pattern: "ù",
			result: "u"
		},
		{
			pattern: "ú",
			result: "u"
		},
		{
			pattern: "û",
			result: "u"
		},
		{
			pattern: "ü",
			result: "u"
		},
		{
			pattern: "ý",
			result: "y"
		},
		{
			pattern: "ÿ",
			result: "y"
		},
		{
			pattern: "ﬀ",
			result: "ff"
		},
		{
			pattern: "ﬁ",
			result: "fi"
		},
		{
			pattern: "ﬂ",
			result: "fl"
		},
		{
			pattern: "ﬃ",
			result: "ffi"
		},
		{
			pattern: "ﬄ",
			result: "ffl"
		},
		{
			pattern: "ﬅ",
			result: "ft"
		},
		{
			pattern: "ﬆ",
			result: "st"
		},
		{
			pattern: "´`·#¬\\/()=?¿¡!^[*\\]¨{}<>;,:.'\\-_\"’”“–—¹|»«",
			result: ""
		},
		{
			pattern: "aàáäâÀÁÄÂãÃ",
			result: "a"
		},
		{
			pattern: "eèéëêÈÉËÊ",
			result: "e"
		},
		{
			pattern: "iìíïîÌÍÏÎ",
			result: "i"
		},
		{
			pattern: "oòóöôÒÓÖÔõÕ",
			result: "o"
		},
		{
			pattern: "uùúüûÙÚÜÛ",
			result: "u"
		},
		{
			pattern: "çÇ",
			result: "ç"
		},
		{
			pattern: "2²",
			result: 2
		}
	];

	regexChain = regexChain != undefined ? regexChain : regexData

	if (regexChain) {
		let r = str.toLowerCase();
		for (let i = 0; i < regexChain.length; i++) {
			r = r.replace(new RegExp(`[${regexChain[i].pattern}]`, "g"), regexChain[i].result);
		}
		return r;
	} else {
		return str;
	}

};

module.exports = {
	$id,
	$name,
	$tag,
	$all,
	$sel,
	hasClass,
	addClass,
	removeClass,
	toggleClass,
	toggleShown,
	addStyles,
	addStylesShow,
	addStylesHide,
	removeEvt,
	dynamicObj,
	heightChange,
	backHistoryFix,
	userAgentHTML,
	isVisible,
	checkStringInput,
	chooseMessageType,
	regexStr
};

function igor() {
	console.log('okkkk');
}
