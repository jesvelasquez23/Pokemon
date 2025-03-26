//funcion iniciar fuego
const seccionAtaque = document.getElementById("seleccionar-ataque");
const seccionMascota = document.getElementById("seleccionar-mascota");
const sectionMensaje = document.getElementById("fin-del-juego");
const botonMascotaJugador = document.getElementById("btn-seleccionar");

const botonReiniciarJuego = document.getElementById("btn-reiniciar");

//funcion seleccionMascotaJugador
const spanMascotaJugador = document.getElementById("mascota-jugador");

//funcion seleccionMasscotaPc
const spanMascotaEnemigo = document.getElementById("mascota-enemigo");
const seleccionDeSeleccionarMascota = document.getElementById(
  "seleccionar-mascota"
);

const spanVidasJugador = document.getElementById("vidas-jugador");
const spanVidasEnemigo = document.getElementById("vidas-enemigo");

//funcion crear-mensaje
const seccionMensaje = document.getElementById("resultado");
const mensajeJugador = document.getElementById("ataque-jugador");
const mensajeEnemigo = document.getElementById("ataque-enemigo");
const contenedorTarjeta = document.getElementById("contenedor-Tarjetas");
const contenedorAtaques = document.getElementById("contenedor-ataques");

const contenedorMapa = document.getElementById("ver-mapa");
const mapa = document.getElementById("mapa");

const btnMoverArriba = document.getElementById("btn-arriba");
const btnMoverAbajo = document.getElementById("btn-abajo");
const btnMoverDerecha = document.getElementById("btn-derecha");
const btnMoverIzquierda = document.getElementById("btn-izquierda");
const mapaBackground = new Image();
mapaBackground.src = "./img/mokemap.png";

let jugadorId = null;
let enemigoId = null;
let ataqueJugador = [];
let ataqueEnemigo = [];
let listaMokepones = [];
let mokeponesEnemigos = [];
let mascotaJugador;
let mascotaJugadorObjeto;
let opcionDeMokepones;
let ataquesMokepon;
let ataquesMokeponEnemigo;
let indexAtaqueJugador;
let indexAtaqueEnemigo;
let victorias = 0;
let derrotas = 0;
let conteoVidasJugador = 3;
let conteoVidasEnemigo = 3;
let inputHipodoge;
let inputCapepo;
let inputRatigueya;
let botonAtaqueFuego;
let botonAtaqueAgua;
let botonAtaqueTierra;
let botones;
let lienzo = mapa.getContext("2d");
let intervalo;
let alturaQueBuscamos;
let anchoDelMapa = window.innerWidth - 20;
const anchoMaximoDelMapa = 350;

if (anchoDelMapa > anchoMaximoDelMapa) {
  anchoDelMapa = anchoMaximoDelMapa - 20;
}

alturaQueBuscamos = (anchoDelMapa * 600) / 800;

mapa.width = anchoDelMapa;
mapa.height = alturaQueBuscamos;

class Mokepon {
  constructor(nombre, foto, vida, fotoMapa, id = null) {
    this.id = id;
    this.nombre = nombre;
    this.foto = foto;
    this.vida = vida;
    this.ataques = [];
    this.ancho = 40;
    this.alto = 40;
    this.x = aleatorio(0, mapa.width - this.ancho);
    this.y = aleatorio(0, mapa.height - this.alto);
    this.contenedorMapa = new Image();
    this.contenedorMapa.src = fotoMapa;
    this.velocidadMovimientoX = 0;
    this.velocidadMovimientoY = 0;
  }
  pintarMokepon() {
    lienzo.drawImage(
      this.contenedorMapa,
      this.x,
      this.y,
      this.ancho,
      this.alto
    );
  }
}

let Hipoge = new Mokepon(
  "Hipoge",
  "./img/mokepons_mokepon_hipodoge_attack.png",
  5,
  "./img/hipodoge.png"
);
let capepo = new Mokepon(
  "capepo",
  "./img/mokepons_mokepon_capipepo_attack.png ",
  5,
  "./img/capipepo.png"
);
let ratigueya = new Mokepon(
  "ratigueya",
  "./img/mokepons_mokepon_ratigueya_attack.png ",
  5,
  "./img/ratigueya.png"
);

const AtaquesHipoge = [
  { nombre: "💧", id: "btn-agua" },
  { nombre: "💧", id: "btn-agua" },
  { nombre: "💧", id: "btn-agua" },
  { nombre: "🔥", id: "btn-fuego" },
  { nombre: "🌱", id: "btn-tierra" },
];
Hipoge.ataques.push(...AtaquesHipoge);

const AtaquesCapepo = [
  { nombre: "🌱", id: "btn-tierra" },
  { nombre: "🌱", id: "btn-tierra" },
  { nombre: "🌱", id: "btn-tierra" },
  { nombre: "💧", id: "btn-agua" },
  { nombre: "🔥", id: "btn-fuego" },
];

capepo.ataques.push(...AtaquesCapepo);

const AtaquesRatigueya = [
  { nombre: "🔥", id: "btn-fuego" },
  { nombre: "🔥", id: "btn-fuego" },
  { nombre: "🔥", id: "btn-fuego" },
  { nombre: "💧", id: "btn-agua" },
  { nombre: "🌱", id: "btn-tierra" },
];

ratigueya.ataques.push(...AtaquesRatigueya);

listaMokepones.push(Hipoge, capepo, ratigueya);

function iniciarJuego() {
  seccionAtaque.style.display = "none";
  contenedorMapa.style.display = "none";
  /*
  
  se itera el arreglo por cada uno de los objetos que contenga
  se guarda la estructura html en una variable y comunicamos html con el inner
  */
  listaMokepones.forEach((mokepon) => {
    opcionDeMokepones = `
    
    <input type="radio" name="mascota" id= ${mokepon.nombre} />
    <label class="tarjeta-pokemon" for=${mokepon.nombre}>
          <p>${mokepon.nombre}</p>
          <img src=${mokepon.foto} alt=${mokepon.nombre} />
        </label>
        
        `;
    contenedorTarjeta.innerHTML += opcionDeMokepones;

    inputHipodoge = document.getElementById("Hipoge");
    inputCapepo = document.getElementById("capepo");
    inputRatigueya = document.getElementById("ratigueya");
  });

  sectionMensaje.style.display = "none";

  botonMascotaJugador.addEventListener("click", seleccionMascotaJugador);

  botonReiniciarJuego.addEventListener("click", reiniciarJuego);

  unirseAlJuego();
}

// realizar peticiones al servidor por medio de fetch

function seleccionMascotaJugador() {
  // seccionAtaque.style.display = "none";

  if (inputHipodoge.checked) {
    spanMascotaJugador.innerHTML = inputHipodoge.id;
    mascotaJugador = inputHipodoge.id;
  } else if (inputCapepo.checked) {
    spanMascotaJugador.innerHTML = inputCapepo.id;
    mascotaJugador = inputCapepo.id;
  } else if (inputRatigueya.checked) {
    spanMascotaJugador.innerHTML = inputRatigueya.id;
    mascotaJugador = inputRatigueya.id;
  } else {
    alert("selecciona una mascota");
    return;
  }

  seccionMascota.style.display = "none";

  seleccionarMokepon(mascotaJugador);
  extraerAtaques(mascotaJugador);
  contenedorMapa.style.display = "flex";
  iniciarMapa();
}

function unirseAlJuego() {
  fetch("http://192.168.230.81:8080/unirse").then(function (res) {
    if (res.ok) {
      res.text().then(function (respuesta) {
        console.log(respuesta);
        jugadorId = respuesta;
      });
    }
  });
}

//enviar informacion al servidor sin respuesta
function seleccionarMokepon(mascotaJugador) {
  console.log("enviando mokepon al servidor: " + jugadorId, mascotaJugador);
  fetch(`http://192.168.230.81:8080/mokepon/${jugadorId}`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mokepon: mascotaJugador,
    }),
  }).then((res) => {
    if (res.ok) {
      console.log("mokepon asignado correctamente");
    } else {
      console.log("error asignando mokepon");
    }
  });
}

function extraerAtaques(mascotaJugador) {
  let ataques;
  for (let i = 0; i < listaMokepones.length; i++) {
    if (mascotaJugador === listaMokepones[i].nombre) {
      ataques = listaMokepones[i].ataques;
    }
  }
  mostrarAtaque(ataques);
}

function mostrarAtaque(ataques) {
  ataques.forEach((ataque) => {
    ataquesMokepon = `<button id= ${ataque.id} class="btns-ataque Bataque " >${ataque.nombre}</button>
    `;
    contenedorAtaques.innerHTML += ataquesMokepon;
  });
  botonAtaqueFuego = document.getElementById("btn-fuego");
  botonAtaqueAgua = document.getElementById("btn-agua");
  botonAtaqueTierra = document.getElementById("btn-tierra");

  // querySelectorAll seleccionamos a todos los botones que tengan la clase Bataque
  botones = document.querySelectorAll(".Bataque");
}

function secuenciaAtaque() {
  botones.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      if (e.target.textContent === "🔥") {
        ataqueJugador.push("FUEGO");
        console.log(ataqueJugador);
        boton.style.background = "#EEEEEE";
        boton.disabled = true;
      } else if (e.target.textContent === "💧") {
        ataqueJugador.push("AGUA");
        console.log(ataqueJugador);
        boton.style.background = "#EEEEEE";
        boton.disabled = true;
      } else {
        ataqueJugador.push("TIERRA");
        console.log(ataqueJugador);
        boton.style.background = "#EEEEEE";
        boton.disabled = true;
      }

      if (ataqueJugador.length === 5) {
        enviarAtaques();
      }
    });
  });
}

function ataquesAleatoriosEnemigo() {
  console.log("ataque enemigo", ataquesMokeponEnemigo);
  let numeroAtaque = aleatorio(1, ataquesMokeponEnemigo.length - 1);
  if (numeroAtaque == 0 || numeroAtaque == 1) {
    ataqueEnemigo.push("FUEGO");
  } else if (numeroAtaque == 3 || numeroAtaque == 4) {
    ataqueEnemigo.push("AGUA");
  } else {
    ataqueEnemigo.push("TIERRA");
  }
  console.log("ataques del enemigo: ", ataqueEnemigo);
  iniciarDuelo();
}

function enviarAtaques() {
  console.log("jugador ID: ", jugadorId);
  fetch(`http://192.168.230.81:8080/mokepon/${jugadorId}/ataques`, {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      ataques: ataqueJugador,
    }),
  });

  intervalo = setInterval(obtenerAtaques, 50);
}

function obtenerAtaques() {
  fetch(`http://192.168.230.81:8080/mokepon/${enemigoId}/ataques`).then(
    function (res) {
      if (res.ok) {
        res.json().then(function ({ ataques }) {
          if (ataques.length === 5) {
            ataqueEnemigo = ataques;
            resultadosDuelo();
          }
        });
      }
    }
  );
}

function seleccionMasscotaPc(enemigo) {
  seleccionDeSeleccionarMascota.style.display = "none";

  spanMascotaEnemigo.innerHTML = enemigo.nombre;
  ataquesMokeponEnemigo = enemigo.ataques;
  secuenciaAtaque();
}

function iniciarDuelo() {
  if (ataqueJugador.length === 5) {
    resultadosDuelo();
  }
}

function indexContrincantes(jugador, enemigo) {
  indexAtaqueJugador = ataqueJugador[jugador];
  indexAtaqueEnemigo = ataqueEnemigo[enemigo];
}

//combate
function resultadosDuelo() {
  console.log(victorias);
  console.log(derrotas);
  clearInterval(intervalo);

  for (let index = 0; index < ataqueJugador.length; index++) {
    if (ataqueJugador[index] === ataqueEnemigo[index]) {
      indexContrincantes(index, index);
      crearMensaje("EMPATE");
    } else if (
      ataqueJugador[index] == "FUEGO" &&
      ataqueEnemigo[index] == "TIERRA"
    ) {
      indexContrincantes(index, index);
      crearMensaje("GANASTE");
      victorias++;
      spanVidasJugador.innerHTML = victorias;
    } else if (
      ataqueJugador[index] === "AGUA" &&
      ataqueEnemigo[index] === "FUEGO"
    ) {
      indexContrincantes(index, index);
      crearMensaje("GANASTE");
      victorias++;
      spanVidasJugador.innerHTML = victorias;
    } else if (
      ataqueJugador[index] === "TIERRA" &&
      ataqueEnemigo[index] === "AGUA"
    ) {
      indexContrincantes(index, index);
      crearMensaje("GANASTE");
      victorias++;
      spanVidasJugador.innerHTML = victorias;
    } else {
      indexContrincantes(index, index);
      crearMensaje("PERDISTE");
      derrotas++;
      spanVidasEnemigo.innerHTML = derrotas;
    }
  }

  verificarVidas();
}

function verificarVidas() {
  console.log(victorias, derrotas);
  if (victorias > derrotas) {
    crearMensajeFinal("FELICIDADES! GANASTE EL COMBATE 💥");
  } else if (derrotas > victorias) {
    crearMensajeFinal("lo siento, perdiste la batalla 💀☠️");
  } else {
    crearMensajeFinal("EMPATE🤺");
  }
}

function crearMensaje(resultado) {
  let notificar = document.createElement("p");
  let notificarEnemigo = document.createElement("p");

  seccionMensaje.innerHTML = resultado;
  notificar.innerHTML = indexAtaqueJugador;
  notificarEnemigo.innerHTML = indexAtaqueEnemigo;

  mensajeEnemigo.appendChild(notificarEnemigo);
  mensajeJugador.appendChild(notificar);
}

function crearMensajeFinal(mensajeFinal) {
  seccionMensaje.innerHTML = mensajeFinal;

  botonReiniciarJuego.style.display = "block";
}

function reiniciarJuego() {
  location.reload();
}

function aleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function pintarCanvas() {
  mascotaJugadorObjeto.x =
    mascotaJugadorObjeto.x + mascotaJugadorObjeto.velocidadMovimientoX;
  mascotaJugadorObjeto.y =
    mascotaJugadorObjeto.y + mascotaJugadorObjeto.velocidadMovimientoY;

  lienzo.clearRect(0, 0, mapa.width, mapa.height);
  lienzo.drawImage(mapaBackground, 0, 0, mapa.width, mapa.height); //  parametros fondo de mapa
  // parametros de imagen: foto, x, y, ancho, alto

  mascotaJugadorObjeto.pintarMokepon();
  enviarPosicion(mascotaJugadorObjeto.x, mascotaJugadorObjeto.y);

  mokeponesEnemigos.forEach(function (mokepon) {
    mokepon.pintarMokepon();
    verificarColicion(mokepon);
  });
}

function enviarPosicion(x, y) {
  fetch(`http://192.168.230.81:8080/mokepon/${jugadorId}/posicion`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      x,
      y,
    }),
  }).then(function (res) {
    if (res.ok) {
      res.json().then(function ({ enemigos }) {
        console.log(enemigos);
        mokeponesEnemigos = enemigos
          .map(function (enemigo) {
            if (!enemigo || !enemigo.mokepon) {
              console.log("enemigo sin mokepon: " + enemigo);
              return null;
            }
            let MokeponEnemigo = null;
            const MokeponNombre = enemigo.mokepon?.nombre || "";
            if (MokeponNombre === "Hipoge") {
              MokeponEnemigo = new Mokepon(
                "Hipoge",
                "./img/mokepons_mokepon_hipodoge_attack.png",
                5,
                "./img/hipodoge.png",
                enemigo.id
              );
            } else if (MokeponNombre === "capepo") {
              MokeponEnemigo = new Mokepon(
                "capepo",
                "./img/mokepons_mokepon_capipepo_attack.png ",
                5,
                "./img/capipepo.png",
                enemigo.id
              );
            } else if (MokeponNombre === "ratigueya") {
              MokeponEnemigo = new Mokepon(
                "ratigueya",
                "./img/mokepons_mokepon_ratigueya_attack.png ",
                5,
                "./img/ratigueya.png",
                enemigo.id
              );
            }

            if (!MokeponEnemigo) {
              console.log("no se pudo crear el mokeponEnemigo ", enemigo);
              return null;
            }

            MokeponEnemigo.x = enemigo.x;
            MokeponEnemigo.y = enemigo.y;

            return MokeponEnemigo;
          })
          .filter((m) => m !== null);
      });
    }
  });
}

function sepresionoTeclado(event) {
  switch (event.key) {
    case "ArrowUp":
      moverArriba();
      break;
    case "ArrowLeft":
      moverIzquierda();
      break;
    case "ArrowDown":
      moverAbajo();
      break;
    case "ArrowRight":
      moverDerecha();
      break;

    default:
      break;
  }
}

function moverDerecha() {
  mascotaJugadorObjeto.velocidadMovimientoX = 5;
}

function moverAbajo() {
  mascotaJugadorObjeto.velocidadMovimientoY = 5;
}
function moverArriba() {
  mascotaJugadorObjeto.velocidadMovimientoY = -5;
}

function moverIzquierda() {
  mascotaJugadorObjeto.velocidadMovimientoX = -5;
}

function detener() {
  mascotaJugadorObjeto.velocidadMovimientoX = 0;
  mascotaJugadorObjeto.velocidadMovimientoY = 0;
}

function iniciarMapa() {
  mascotaJugadorObjeto = obtenerObjetoMascota(mascotaJugador);
  console.log(mascotaJugadorObjeto, mascotaJugador);

  intervalo = setInterval(pintarCanvas, 50);
  window.addEventListener("keydown", sepresionoTeclado);
  window.addEventListener("keyup", detener);
}

function obtenerObjetoMascota() {
  for (let i = 0; i < listaMokepones.length; i++) {
    if (mascotaJugador === listaMokepones[i].nombre) {
      return listaMokepones[i];
    }
  }
}

function verificarColicion(enemigo) {
  const arribaEnemigo = enemigo.y;
  const abajoEnemigo = enemigo.y + enemigo.alto;
  const derechaEnemigo = enemigo.x + enemigo.ancho;
  const izquierdaEnemigo = enemigo.x;

  const arribaMascota = mascotaJugadorObjeto.y;
  const abajoMascota = mascotaJugadorObjeto.y + mascotaJugadorObjeto.alto;
  const derechaMascota = mascotaJugadorObjeto.x + mascotaJugadorObjeto.ancho;
  const izquierdaMascota = mascotaJugadorObjeto.x;

  if (
    abajoMascota < arribaEnemigo ||
    arribaMascota > abajoEnemigo ||
    derechaMascota < izquierdaEnemigo ||
    izquierdaMascota > derechaEnemigo
  ) {
    return;
  } else {
    detener();
    clearInterval(intervalo);
    enemigoId = enemigo.id;
    seccionAtaque.style.display = "flex";
    contenedorMapa.style.display = "none";
    seleccionMasscotaPc(enemigo);
  }
}

window.addEventListener("load", iniciarJuego);
