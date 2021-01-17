/**
 * Cargaremos las preguntas desde las cookies, y añadiremos nuevas
 */
//Patron para la puntuacion, numero entre 0 y 9
const puntos = /[0-9\/]+/;
//Evento que añadimos a nuestro campo puntuacion, ignoraremos toda tecla presionada menos un número entre 0 y 9
document.getElementById('puntuacion').addEventListener('keypress', (event) => {
  let maxLength = event.target.getAttribute('maxlength');
  let lengthActual = event.target.value.length;

  //Si no cumple los valores, no aceptaremos otros caracteres, solo 1 numero del 0 al 9
  if (!puntos.test(event.key) && lengthActual < maxLength) {
    event.preventDefault();
  }
});
/**
 * Método para guardar nuestro usuario actual dentro de la cookie cuestionario, buscaremos por filtro al usuario
 * @param {} user
 */
function guardarEnCuestionario(user) {
  let strCuestionarioJSON = Cookies.get('cuestionario');
  let objCuestionarioJS = JSON.parse(strCuestionarioJSON);

  let index = objCuestionarioJS.findIndex(
    (persona) => persona.correo === user.correo
  );

  objCuestionarioJS[index] = user;

  let strCuestionarioFinal = JSON.stringify(objCuestionarioJS);
  //Guardamos el usuario
  Cookies.set('cuestionario', strCuestionarioFinal, {
    expires: 365,
    sameSite: 'none',
    secure: true,
  });
}
/**
 * Obtenemos los datos del usuario actual desde la cookie, filtramos con el campo correo usando findIndex
 */
async function obtenerDatosUser() {
  let usuarioCorreo = await Cookies.get('usuario');

  let strCuestionarioJSON = await Cookies.get('cuestionario');
  let objCuestionarioJS = JSON.parse(strCuestionarioJSON);

  let index = objCuestionarioJS.findIndex(
    (persona) => persona.correo === usuarioCorreo
  );

  return objCuestionarioJS[index];
}

//Usaremos los datos del usuario para ir añadiendo las preguntas

document.getElementById('guardar').addEventListener('click', async function () {
  //Guardaremos nuestras preguntas
  let pregunta = document.getElementById('pregunta').value;
  let resTrue = document.getElementById('verdadero').checked;
  let resFalse = document.getElementById('falso').checked;
  let puntuacion = document.getElementById('puntuacion').value;

  let estado = 'guardando...';
  let respuesta;

  if (resTrue) {
    respuesta = 'Verdadero';
  } else {
    respuesta = 'Falso';
  }
  actualizarDatosUser(pregunta, respuesta, puntuacion, estado);
  //Después de añadir, dejamos los campos en blanco
  document.getElementById('pregunta').value = '';
  document.getElementById('verdadero').checked = false;
  document.getElementById('falso').checked = false;
  document.getElementById('puntuacion').value = '';
});
/**
 * Metodo para actualizxar los datos del usuario, usando los parámetros:
 * @param {*} pregunta pregunta, propiedad de las preguntas del usuario
 * @param {*} respuesta respuesta, propiedad de las preguntas del usuario
 * @param {*} puntuacion puntuacion, propiedad de las preguntas del usuario
 * @param {*} estado estado, propiedad de las preguntas del usuario
 */
async function actualizarDatosUser(pregunta, respuesta, puntuacion, estado) {
  //Añadimos los datos en la tabla de forma asincrona
  await addRowTable(pregunta, respuesta, puntuacion, estado);
  //Simulamos una espera de guardado de unos 5 segundos y despúes finalmente guardamos
  await simularGuardar();
  let datosUserActual = await obtenerDatosUser();

  let indexPregunta =
    datosUserActual.preguntas.push({
      titulo: pregunta,
      respuesta: respuesta,
      puntuacion: puntuacion,
      estado: estado,
    }) - 1;
  //guardamos finalmente, añadimos OK al registro guardado
  guardar(datosUserActual);
  //comprobamos si habilitamos el botón de "Atrás"
  comprobarLastState();
}
/**
 * Función para comprobar si habilitamos o no el botón de "Atrás"
 */
function comprobarLastState() {
  let estado = document.querySelector(
    'table tbody tr:last-child td:last-child'
  );
  if (estado.textContent === 'guardando...') {
    document.getElementById('atras').disabled = true;
  } else {
    document.getElementById('atras').disabled = false;
  }
}
/**
 * Método para simular el guardado, en caso de error, se debería de devolver un reject error, pero en nuestro caso no pasará nunca
 */
function simularGuardar() {
  let promesaGuardado = new Promise((resolve, reject) => {
    let guardadoTimeout = setTimeout(() => {
      resolve('OK');

      //no debería de dar error nunca en nuestra aplicacion,
      //pero si trabajamos con servidores o pag webs podría darse el caso
      //reject(new Error('ERROR'));
    }, 5000);
  });
  return promesaGuardado;
}
//Método async para el guardado de la pregunta del usuario
/**
 * @param {*} datosUserActual datosUserActual, objeto usuario actual
 */
async function guardar(datosUserActual) {
  let container =
    document.getElementById('preguntas').tBodies[0].rows.length - 1;
  //Modificamos el campo de la tabla y el del objeto, el usuario actual y la tabla:
  let estado = document.querySelector(
    'table tbody tr:nth-child(' +
      datosUserActual.preguntas.length +
      ') td:last-child'
  );
  datosUserActual.preguntas[datosUserActual.preguntas.length - 1].estado = 'OK';
  estado.innerHTML = 'OK';
  //Finalmente volvemos a guardar el usuario en el cuestionario, en la cookie
  await guardarEnCuestionario(datosUserActual);
}
/**
 * Evento que ocurrirá al pulsar el botón de atras, volveremos a la pantalla 2
 */
document.getElementById('atras').addEventListener('click', function () {
  location = '../correoCookieP2.html';
});
/**
 * Método para añadir un registro en la tabla
 * @param {} titulo titulo pregunta
 * @param {*} respuesta respuesta pregunta
 * @param {*} puntuacion puntuacion pregunta
 * @param {*} estado estado pregunta
 */
function addRowTable(titulo, respuesta, puntuacion, estado) {
  document.getElementById('atras').disabled = true;
  var table = document.getElementById('preguntas');
  let cuerpo = document.querySelector('tbody');
  //Añadimos una nueva fila con registros pasados como parámetros
  var row = table.insertRow(table.tBodies[0].rows.length + 1);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);

  cell1.innerHTML = titulo;
  cell2.innerHTML = respuesta;
  cell3.innerHTML = puntuacion;
  cell4.innerHTML = estado;

  cuerpo.appendChild(row);
}

//Aquí nos encargamos de cargar las preguntas a través de las cookies.
//recibimos valor pero defecto un boolean por si queremos hacer una espera de 5 segundos antes de mostrar la lista de preguntas
export async function cargarPreguntas(retraso = false) {
  let datosUserActual = await obtenerDatosUser();
  //En caso de retraso, llamaremos a cargar la tabla despues de 5 seegundos
  switch (retraso) {
    case true:
      mensajeCargandoTabla();
      setTimeout(() => {
        //element.innerHTML = '';
        cargarTabla(datosUserActual);
      }, 5000);

      break;
    case false:
      cargarTabla(datosUserActual);
      break;
    default:
      break;
  }
}
/**
 * Método para que muestre un mensaje mientras se carga la tabla, cargando preguntas
 */
function mensajeCargandoTabla() {
  let container = document.querySelector('main div.principal table#preguntas');
  let containerChild = document.createElement('thead');
  let element = document.createElement('tr');
  let child = document.createElement('th');
  let text = document.createTextNode('Cargando preguntas...');

  child.appendChild(text);
  element.appendChild(child);
  containerChild.appendChild(element);
  container.appendChild(containerChild);
}
/**
 * Método para cargar la cabecera
 */
function cargarCabecera() {
  let cabecera = new Set();
  cabecera.add('Pregunta');
  cabecera.add('Respuesta');
  cabecera.add('Puntuación');
  cabecera.add('Estado');

  let container = document.querySelector(
    'main div.principal table#preguntas thead'
  );

  container.innerHTML = '';
  let element = document.createElement('tr');
  cabecera.forEach((valor) => {
    let child = document.createElement('th');
    let text = document.createTextNode(valor);

    child.appendChild(text);
    element.appendChild(child);
  });

  container.appendChild(element);
}
//cargaremos las preguntas del usuario logeado
/**
 * Método para cargar la tabla
 * @param {*} datosUserActual datos del user actual
 */
async function cargarTabla(datosUserActual) {
  let container = document.getElementById('preguntas');
  //container.innerHTML = '';
  cargarCabecera();
  let containerChild = document.createElement('tbody');

  datosUserActual.preguntas.forEach((objPregunta) => {
    let fila = document.createElement('tr');

    let pregunta = document.createElement('td');
    let preguntaTexto = document.createTextNode(objPregunta.titulo);

    let respuesta = document.createElement('td');
    let respuestaTexto = document.createTextNode(objPregunta.respuesta);

    let puntuacion = document.createElement('td');
    let puntuacionTexto = document.createTextNode(objPregunta.puntuacion);

    let estado = document.createElement('td');
    estado.setAttribute('id', datosUserActual.correo);
    let estadoTexto = document.createTextNode(objPregunta.estado);

    //Añadimos los textos a los correspondientes elementos
    pregunta.appendChild(preguntaTexto);
    respuesta.appendChild(respuestaTexto);
    puntuacion.appendChild(puntuacionTexto);
    estado.appendChild(estadoTexto);

    //Ahora se añade los elementos al elemento padre, la fila
    fila.appendChild(pregunta);
    fila.appendChild(respuesta);
    fila.appendChild(puntuacion);
    fila.appendChild(estado);

    //Y finalmente al contenedor, table

    containerChild.appendChild(fila);
  });
  container.appendChild(containerChild);
}

//aqui comprobaremos todo lo necesario con nuestros datos del formulario
function comprobarFormulario() {
  let pregunta = document.getElementById('pregunta').value;
  let resTrue = document.getElementById('verdadero').checked;
  let resFalse = document.getElementById('falso').checked;
  let puntuacion = document.getElementById('puntuacion').value;

  //Comprobamos los campos y habilitamos nuestro botón de guardado
  if (pregunta.length != 0 && (resTrue || resFalse) && puntuacion.length != 0) {
    document.getElementById('guardar').disabled = false;
  } else {
    document.getElementById('guardar').disabled = true;
  }
}
//Ahora es hora de añadir los eventos de escucha para comprobar el formulario,
// si esta completo o cuando hacemos click sobre las opciones del mismo
window.addEventListener('load', comprobarFormulario);
document.addEventListener('keyup', comprobarFormulario);
document.addEventListener('click', comprobarFormulario);

let retraso = true;
cargarPreguntas(retraso);
