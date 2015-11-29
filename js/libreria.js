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
			var celdasTablero = getElementsByAttribute("cell");
			for (var i=0; i<celdasTablero.length; i++) {
				celdasTablero[i].className="celda";
			}
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

// Como no existe esta función, que creo útil, me la invento.
function getElementsByAttribute(attribute) {
  var coincidencias = [];
  var elementos = document.getElementsByTagName('*'); // Todos los elementos de la página
  for (var i = 0, n = elementos.length; i < n; i++) {
    if (elementos[i].getAttribute(attribute) !== null) { // Compruebo uno a uno si los elementos tienen ese atributo
      coincidencias.push(elementos[i]); // Si tiene ese atributo, lo guardo en el array de coincidencias.
    }
  }
  return coincidencias;
}