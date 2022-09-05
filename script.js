

const usuarios = [
  {
      nombre: 'Ivan',
      mail: 'ivan25@mail.com',
      pass: 'pass123'
  },
  {
      nombre: 'Virginia',
      mail: 'virgi30@mail.com',
      pass:  'passvir123'
  },
  {
      nombre: 'Nicolas',
      mail:'nicolasr@mail.com',
      pass:  'nicopass'
  }
];


/* DOM */

let mailReg = document.getElementById('emailLogin');
let passReg = document.getElementById('passwordLogin');
let recordar = document.getElementById('recordarme');
let btnLogin = document.getElementById('login');
let modalEl = document.getElementById('modalLogin');
let modal = new bootstrap.Modal(modalEl);
const containerJuegos = document.getElementById("container");
let buscador = document.getElementById("buscador");

let toggles = document.querySelectorAll('.toggles');

const btnInicio = document.getElementById('btnInicio');
const btnBuscador = document.getElementById('btnBuscador');
const btnBiblioteca = document.getElementById('btnBiblioteca');
const botonesCategoria = document.querySelectorAll('.btnCategoria');
const btnOrdenarAZ = document.getElementById('btnAZ');
const btnOrdenarZA= document.getElementById('btnZA');
const btnOrdenarPrecio = document.getElementById('btnPrecio');
const btnValoracion = document.getElementById('btnValoracion');

/* FUNCIONES STORAGE */

function guardarDatos(storage) {
    let user = mailReg.value;
    let pass = passReg.value;

    const usuario = {
        'user': user,
        'pass': pass
    }

    storage === 'sessionStorage' && sessionStorage.setItem('usuario', JSON.stringify(usuario));
    storage === 'localStorage' && localStorage.setItem('usuario', JSON.stringify(usuario));

}

function borrarDatos() {
    localStorage.clear();
    sessionStorage.clear();
}

function recuperarUsuario(storage) {
    let usuarioEnStorage = JSON.parse(storage.getItem('usuario'));
    return usuarioEnStorage;
}

function presentarInfo(array, clase) {
    array.forEach(element => {
        element.classList.toggle(clase);
    });
}

function mostrarNombreUsuario(usuario) {
    nombreUsuario.innerHTML = `<span>${usuario.user}</span>`
}

function validateUser(usersDB, user, pass) {
  let isFound = usersDB.find((userDB) => userDB.mail == user);

  if (typeof isFound === 'undefined') {
      return 'Usuario y/o contraseña incorrectos'
  } else {

      if (isFound.pass != pass) {
          return 'Usuario y/o contraseña incorrectos'
      } else {
          return isFound;
      }
  }
}

function isLogged(usuario) {

  if (usuario) {
      mostrarNombreUsuario(usuario);
      presentarInfo(toggles, 'd-none');
      isLogged = true;
  } else {
    isLogged = false;
  }
}

/* BOTONES */


btnLogin.addEventListener('click', (e) => {
    e.preventDefault();
    if (!mailReg.value || !passReg.value) {
      Swal.fire({
        title: 'Atención!',
        text: 'Rellenar los campos es obligatorio',
        icon: 'warning',
        confirmButtonText: 'Ok'
      })
    } else {

      let data = validateUser(usuarios, mailReg.value, passReg.value);

      if (typeof data === 'string') {
          Swal.fire({
            title: 'Error!',
            text: `${data}`,
            icon: 'error',
            confirmButtonText: 'Oops!'
          })
      } else { 
              if (recordar.checked) {
                  guardarDatos('localStorage');
                  mostrarNombreUsuario(recuperarUsuario(localStorage));
              } else {
                  guardarDatos('sessionStorage');
                  mostrarNombreUsuario(recuperarUsuario(sessionStorage));
              }

              Swal.fire({
                title: 'Login Exitoso',
                icon: 'success',
                confirmButtonText: '¡Cool!'
              });
              modal.hide();
              presentarInfo(toggles, "d-none");
    }


  }

});

btnInicio.addEventListener('click', traerDatos);

btnBiblioteca.addEventListener('click', () => {
  fetch('./data.json')
  .then((response) => response.json())
  .then((data) => {
    mostrarBiblioteca(biblioteca(data));
  });
});

botonesCategoria.forEach(btnCategoria => {
  btnCategoria.addEventListener('click', () => {
    let categoria = btnCategoria.textContent;
      fetch('./data.json')
      .then((response) => response.json())
      .then((data) =>{
        mostrarJuegos(filtrarCategoria(data, categoria));
    });
  });

})

btnOrdenarAZ.addEventListener('click', () => {
  fetch('./data.json')
  .then((response) => response.json())
  .then((data) =>{
    mostrarJuegos(ordenarDeAZ(data));

  });
});

btnOrdenarZA.addEventListener('click', () => {
  fetch('./data.json')
  .then((response) => response.json())
  .then((data) =>{
    mostrarJuegos(ordenarDeZA(data));
  });
})

btnOrdenarPrecio.addEventListener('click', () =>{
  fetch('./data.json')
  .then((response) => response.json())
  .then((data) =>{
    mostrarJuegos(ordenarPorPrecio(data));
  });
})

btnValoracion.addEventListener('click', () =>{
  fetch('./data.json')
  .then((response) => response.json())
  .then((data) =>{
    mostrarJuegos(ordenarPorValoracion(data));
  });
})

btnBuscador.addEventListener('click', () => {

  let busqueda = buscador.value;
  fetch('./data.json')
  .then((response) => response.json())
  .then((data) => {
    mostrarJuegos(buscadorJuegos(data, busqueda));
  });

})

/* FUNCIONES PAGINA WEB */


function traerDatos(){
  fetch('./data.json')
  .then((response) => response.json())
  .then((data) => {
  mostrarJuegos(data);
  });
}

function mostrarJuegos(array){
  containerJuegos.innerHTML = '';
  array.forEach(element => {

        html = `
        <div class="card" id="${element.nombre}" style="width: 18rem;">
        <img class="card-img-top imagen-juego" src=${element.img} alt="miniatura-juego">
        <div class="card-body">
          <h5 class="card-title titulo-juego">${element.nombre}</h5>
          <p class="card-text precio-juego">${element.precio}</p>
          <p class="card-text">Valoracion: ${element.puntuacion}</p>
          <div class="botonesDeCompra">
          <a href="#" class="boton btn btn-primary toggles botonComprar">Comprar</a>
          </div>
        </div>
      </div>`

      containerJuegos.innerHTML += html;
      });

}

function buscadorJuegos(array, search){
  return array.filter((element) => element.nombre.includes(search));
}

function filtrarCategoria(array, categoria){

  return array.filter((element) =>element.genero == categoria);
}

function biblioteca(array) {

  return array.filter((element) => element.enBiblioteca == true);


}

 function mostrarBiblioteca(array){
  containerJuegos.innerHTML = '';
  array.forEach(element => {

        html = `
        <div class="card" id="${element.nombre}" style="width: 18rem;">
        <img class="card-img-top imagen-juego" src=${element.img} alt="miniatura-juego">
        <div class="card-body">
          <h5 class="card-title titulo-juego">${element.nombre}</h5>
          <p class="card-text precio-juego">${element.genero}</p>
          <p class="card-text">Valoracion: ${element.puntuacion}</p>
        </div>
      </div>`

      containerJuegos.innerHTML += html;
      });
 }

 function ordenarDeAZ(array){
    let ordenadoDeAZ = array.sort((a,b) => a.nombre.localeCompare(b.nombre));
    return ordenadoDeAZ;
 }

function ordenarDeZA(array){
  let ordenadoDeZA = array.sort((a,b) => b.nombre.localeCompare(a.nombre));
  return ordenadoDeZA;
}

function ordenarPorPrecio(array){
  let ordenadoPorPrecio = array.sort((a,b) => a.precio - b.precio);
  return ordenadoPorPrecio;
}

function ordenarPorValoracion(array){
  let ordenadoPorValoracion = array.sort((a,b) => b.puntuacion - a.puntuacion);
  return ordenadoPorValoracion;
}

traerDatos();

  btnLogout.addEventListener('click', () => {
    borrarDatos();
    presentarInfo(toggles, 'd-none');
    traerDatos();
});

  isLogged(recuperarUsuario(localStorage));









