/**
 * Crearemos nuestro evento que se quedará a la espera en segundo plano de que se liberen las 2 teclas a la vez
 * En nuestro evento le diremos que será de tipo keyup y pasaremos una función flecha con parametro event,
 * que será creado por el navegador, y si se sueltan esas 2 teclas, cambiaremos los datos, un mensaje y un input.
 */
document.addEventListener(
  'keyup',
  (event) => {
    if (event.ctrlKey && event.key == 'F10') {
      //También le diremos que borre la espera anterior con el método de clearTimeout que recibe el id del timeout.
      clearTimeout(idCargarLogin);
      cargarLogin();
    }
  },
  false
);

//Nuestra función cargarLogin cargará un input con el cual validaremos nuestro email
const cargarLogin = () => {
  let container = document.querySelector('div.bienvenida');
  let element = document.querySelector('div.bienvenida #mensaje');

  //Aquí crearemos nuestro input para validar nuestro email posteriormente
  //También verificamos que los elementos son lo que necesitamos, un elemento y un input
  if (container.childElementCount < 2) {
    let input = document.createElement('input');
    input.setAttribute('type', 'email');
    input.setAttribute('id', 'email');
    element.innerHTML = 'Usuario';
    //element.removeChild(element.firstChild);
    container.appendChild(input);
  }
};
let idCargarLogin = setTimeout(cargarLogin, 5000);
