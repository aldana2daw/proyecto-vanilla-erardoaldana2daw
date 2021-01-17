//Método que nos buscará a un usuario dentreo del cuestionario, usando la función filter, filtrando por correo, ya que será unico
/**
 * metodo buscarUsuario
 * @param {*} user usuario actual
 * @param {*} cuestionario cuestionario actual
 */
function buscarUsuario(user, cuestionario) {
  let index = cuestionario.findIndex((persona) => persona.correo === user);

  return cuestionario[index];
}

/**
 * Función constructora, objeto Persona
 * @param {*} correo correo de la Persona
 * @param {*} fecha fecha ultimo login
 * @param {*} preguntas preguntas de la Persona
 */
function Persona(correo, fecha, preguntas) {
  this.correo = correo;
  this.fecha = fecha;
  this.preguntas = preguntas;
}

/**
 * Evento que ocurrirá cuando pulsemos en el botón para redirigirnos a la pantalla 3 de preguntas
 */
document.addEventListener('click', (event) => {
  if (event.target.id === 'buttonPreguntas') {
    location = '../formularioPreguntasP3.html';
  }
});
/**
 * Funcion que se encargará de saludar al usuario que haya hecho login, con su fecha y hora de ultimo registro
 * @param {*} correo correo del usuario
 * @param {*} fecha fecha ultiomo registro del usuario
 */
const saludar = (correo, fecha) => {
  let container = document.querySelector('div.datosUser');
  let child = document.createElement('p');
  child.innerHTML =
    'Hola ' +
    correo +
    ' <br>La última vez que entraste fue el ' +
    fecha.getDate() +
    '-' +
    (fecha.getMonth() + 1) +
    '-' +
    fecha.getFullYear() +
    ' a las ' +
    fecha.getHours() +
    ':' +
    fecha.getMinutes() +
    ':' +
    fecha.getSeconds();

  container.appendChild(child);
};
//Lista sin repetidos usando Map , pasaremos el array y una clave, que sera el parametro para filtrar
function obtenerListaSinRepetidos(arr, key) {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
}
/**
 * Método para guardar en cuestionario, crearemos el objeto json con el método stringify y guardamos la cookie
 * @param {*} objCuestionario objCuestionario actual
 */
const guardarCuestionario = (objCuestionario) => {
  let strcuestionario = JSON.stringify(objCuestionario);

  Cookies.set('cuestionario', strcuestionario, {
    expires: 365,
    sameSite: 'none',
    secure: true,
  });
};
/**
 * Funcion cargarUsuario, realizará el cargado de nuestro usuario, creamos una fecha y preguntas del usuario.
 */
function cargarUsuario() {
  try {
    let date = new Date();
    let correoUser = Cookies.get('usuario');
    let preguntas = [];
    let nuevoUsuario = new Persona(correoUser, date, preguntas);
    if (correoUser !== null) {
      //para obtener la fecha si ya estaba, y actualizar a la nueva
      //pasar de JSON a objeto JS
      let strCuestionario = Cookies.get('cuestionario');
      if (strCuestionario !== undefined) {
        let objCuestionario = JSON.parse(strCuestionario);
        /*
         *Retornamos una lista sin repetidos y pasamos el campo
         * correo para que busque por ese campo, actuaría como el ID.
         */
        //Lista sin repetidos:
        let sinRepetidos = obtenerListaSinRepetidos(objCuestionario, 'correo');
        let datosUser = buscarUsuario(correoUser, sinRepetidos);

        //Si nos devuelve que no lo ha encontrado, lo añadiremos a la coleccion
        if (datosUser === undefined) {
          sinRepetidos.push(nuevoUsuario);
          guardarCuestionario(sinRepetidos);
          saludar(nuevoUsuario.correo, nuevoUsuario.fecha);
        } else {
          //Mantenemos la fecha nueva como la ultima,
          // Mostramos la ULTIMA VEZ
          let index = sinRepetidos.findIndex(
            (persona) => persona.correo === correoUser
          );
          saludar(correoUser, new Date(sinRepetidos[index].fecha));
          sinRepetidos[index].fecha = nuevoUsuario.fecha;
          guardarCuestionario(sinRepetidos);
        }
        //nuevo cuestionario con usuario nuevo
      } else {
        let cuestionario = [];
        cuestionario.push(nuevoUsuario);
        guardarCuestionario(cuestionario);
        saludar(nuevoUsuario.correo, nuevoUsuario.fecha);
      }
    }
  } catch (error) {
    console.error(error);
  }
}
cargarUsuario();
