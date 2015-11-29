var jugador1 = true;
var fichas_insertadas = [
							[0,0,0,0,0,0,0],
							[0,0,0,0,0,0,0],
							[0,0,0,0,0,0,0],
							[0,0,0,0,0,0,0],
							[0,0,0,0,0,0,0],
							[0,0,0,0,0,0,0],
							[0,0,0,0,0,0,0]
						];

function insertarFicha() {
	// Variables locales de 'insertarFicha()'	
	var tablero = document.getElementById("tabla");
	var fichas_invisibles = tablero.getElementsByClassName("celda invisible");
	
	// Función de 'insertarFicha()'
	return function() {		
		var col = this.parentElement; // Columna en la que se está insertando ficha.			
		// Caída de la ficha y posición que ocupa al terminar de caer
		var celda_ocupada = caidaFicha(col);
		// Cambio de jugador al insertar ficha
		cambioJugador(fichas_invisibles);
		// Comprobar si alguien ha ganado la partida a partir de la última ficha insertada
		if (partidaGanada(celda_ocupada)) {
			if (!jugador1)
				alert("¡Ha ganado el jugador ROJO!");
			else
				alert("¡Ha ganado el jugador VERDE!");
			location.reload();
		}
	};
}

function caidaFicha(col) {
	var celda;
	for (var c=1; c<7; c++) {
		celda = col.children[c];
		var celda_siguiente = celda.nextElementSibling;
		var siguiente_vacia = celda_siguiente.className==="celda"; // true si la siguiente celda no tiene ficha.	
		var color_ficha; // Color de la ficha que cae (contenido de la clase celda)
		
		if (jugador1)
			color_ficha="celda ficha_roja";
		else
			color_ficha="celda ficha_verde";

		// La ficha empieza a caer:
		celda.className= color_ficha;
		if (siguiente_vacia) { // La ficha sigue cayendo.
			celda.className= "celda";
			celda_siguiente.className= color_ficha;
			if (c==6) // La ficha cae en la última línea y devuelvo su posición
				return celda.nextElementSibling;
		}
		else // La ficha deja de caer y devuelvo su posición
			return celda;
	}
}

function cambioJugador(fichas_invisibles) {
	jugador1 =!jugador1;
	if (jugador1) {
		for (var i=0; i<7; i++) {
			fichas_invisibles[i].className=("celda invisible ficha_roja");
		}
	}
	else {
		for (var j=0; j<7; j++) {
			fichas_invisibles[j].className=("celda invisible ficha_verde");
		}
	}
}

window.onload=ejecuta;
function ejecuta() {
	var tablero = document.getElementById("tabla");
	for(var i = 0; i< tablero.childElementCount; i++){
		tablero.children[i].firstElementChild.onclick = insertarFicha();
	}			
}

function partidaGanada(celda_ocupada) {
	var x = celda_ocupada.getAttribute("cell");
	var y = celda_ocupada.parentNode.getAttribute("col");
	var tablero = celda_ocupada.parentNode.parentNode;
	
	// Almaceno el valor de la última ficha insertada en la matriz 'fichas_insertadas[][]'
	if (jugador1)
		fichas_insertadas[y][x]="g"; // Jugador verde
	else
		fichas_insertadas[y][x]="r"; // Jugador rojo

	var color = fichas_insertadas[y][x];
	var contador = 0;

	//Comprobación vertical
	for (var r=x; r<7, fichas_insertadas[y][r]==color; r++) {
		if (fichas_insertadas[y][r]==color) {
			contador++;
		}
	}
	if (contador==4) return true;
	contador = 0;

	//Comprobación horizontal
	for (var c1=y; c1<7; c1++) { // derecha
		if (fichas_insertadas[c1][x]==color) {
			contador++;
		} else break;
	}
	for (var c2=y; c2>=0; c2--) { // izquierda
		if (c2!=y)
			if (fichas_insertadas[c2][x]==color) {
				contador++;
			} else break;
	}
	if (contador===4) return true;
	contador = 0;

	//Comprobación diagonal ascendente
	var fila = x;
	var columna = y;
	while (fila>=0 && fila<=6 && columna>=0 && columna<=6 && fichas_insertadas[columna][fila]==color) {
		contador++;
		columna++;
		fila--;
	}
	fila = x-0+1;
	columna = y-1;
	while (fila>=0 && fila<=6 && columna>=0 && columna<=6 && fichas_insertadas[columna][fila]==color) {
		contador++;
		columna--;
		fila++;
	}
	if (contador===4) return true;
	contador = 0;

	//Comprobación diagonal descendente
	fila = x;
	columna = y;
	while (fila>=0 && fila<=6 && columna>=0 && columna<=6 && fichas_insertadas[columna][fila]==color) {
		contador++;
		columna--;
		fila--;
	}
	fila = x-0+1;
	columna = y-0+1;
	while (fila>=0 && fila<=6 && columna>=0 && columna<=6 && fichas_insertadas[columna][fila]==color) {
		contador++;
		columna++;
		fila++;
	}
	if (contador===4) return true;
}

/*
// NOTA: El posicionamiento lo obtengo a través del método offsetTop, cuyo valor en la primera celda
// de cada columna 'col[1]', es 26px. Este valor incrementa en 74px por cada celda, correspondiendo 
// a la última celda el valor de 470px.
function partidaGanada(celda_ocupada) {
	var contador=1;
	var valor = celda_ocupada.className;
	var celda = celda_ocupada; // El valor de 'celda' cambiará en cada uno de los bucles a sus celdas hermanas.
	
	// VERTICALES:
	while (celda.nextElementSibling!==null && celda.nextElementSibling.className==valor) {
		contador++;
		celda = celda.nextElementSibling;
	}
	celda = celda_ocupada; // reinicio la celda a su posición original
	while (celda.previousElementSibling!==null && celda.previousElementSibling.className==valor) {
		contador++;
		celda = celda.previousElementSibling;
	}
	if (contador>=4) return true;

	// Reiniciando contadores.
	contador=1;
	celda = celda_ocupada;

	// HORIZONTALES:
	var pos = celda_ocupada.offsetTop; // Posición de la celda ocupada (con respecto a la altura)
	// derecha
	while (celda.parentNode.nextElementSibling!==null && celda==valor)
	for (var i=1; i<=7; i++) {
		var col_sig = celda.parentNode.nextElementSibling;
		if (col_sig.children[i].offsetT == pos) {

		}
	}
	

	return false;
}

*/