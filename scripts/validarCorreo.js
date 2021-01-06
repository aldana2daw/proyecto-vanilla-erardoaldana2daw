//Añadiremos nuestro Listener con el evento focusout, que ocurrirá cuando pierda el foco nuestro elemento que buscamos.
//^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$

document.addEventListener('focusout', function (event) {
  let regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{0,}))$/.test(
    event.target.value
  );

  if (regexp && event.target.id === 'email') {
    Cookies.set('usuario', event.target.value, {
      expires: 365,
      sameSite: 'none',
      secure: true,
    });

    //En mozilla funciona con location, en chrome con location y location.href
    window.location = './correoCookieP2.html';
  } else {
    //Esperamos un rato para obtener nuestro foco de nuevo
    setTimeout(() => {
      event.target.focus();
      event.target.select();
      //mostrará un mensaje de error
      mensajeError();
    }, 100);
  }
});

/**
 * Mensaje de error que ocurrirá con la validación del email
 */
function mensajeError() {
  let container = document.querySelector('div.bienvenida');
  let element = document.querySelector('p#mensajeError');

  if (element === null) {
    let child = document.createElement('p');
    child.setAttribute('id', 'mensajeError');
    child.innerHTML = 'Correo o formato incorrecto, vuelve a intentarlo.';
    container.appendChild(child);
  }
}
