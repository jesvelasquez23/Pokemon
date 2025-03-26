//se importa en una variable
const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.static("public"));
app.use(cors()); // cors para solucionar problemas de origen
app.use(express.json()); //usar todos los paquetes json

const jugadores = [];

class Jugador {
  constructor(id) {
    this.id = id;
  }
  asignarMokepon(mokepon) {
    this.mokepon = mokepon;
  }
  actualizarPosicion(x, y) {
    this.x = x;
    this.y = y;
  }
  asignarAtaques(ataques) {
    this.ataques = ataques;
  }
}

class Mokepon {
  constructor(nombre) {
    this.nombre = nombre;
  }
}

app.get("/unirse", (req, res) => {
  const id = crypto.randomUUID();
  const jugador = new Jugador(id);

  jugador.x = Math.floor(Math.random() * 500);
  jugador.y = Math.floor(Math.random() * 500);

  jugadores.push(jugador);
  // habilitamos los origenes del servidor
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");

  res.send(id);
});

app.post("/mokepon/:jugadorId", (req, res) => {
  //acceso a la variable de la url jugadoresId
  const jugadorId = req.params.jugadorId || "";
  const nombre = req.body.mokepon || "";

  const jugador = jugadores.find((j) => j.id === jugadorId);

  if (jugador) {
    jugador.asignarMokepon(new Mokepon(nombre));
    console.log(
      `Mokepon asignado a jugador ${jugadorId}:`,
      JSON.stringify(jugador, null, 2)
    );
  } else {
    console.log("Error: jugador no encontrado", jugadorId);
  }

  res.end();
});

app.post("/mokepon/:jugadorId/posicion", (req, res) => {
  const jugadorId = req.params.jugadorId || "";
  const x = req.body.x || 0;
  const y = req.body.y || 0;

  const jugador = jugadores.find((j) => j.id === jugadorId);

  if (jugador) {
    jugador.actualizarPosicion(x, y);
  }

  const enemigos = jugadores
    .filter((j) => j.id !== jugadorId && j.mokepon) // Solo jugadores con Mokepon asignado
    .map((j) => ({
      id: j.id,
      x: j.x || 0,
      y: j.y || 0,
      mokepon: j.mokepon,
    }));

  console.log(
    "enviando enemigos al cliente: ",
    JSON.stringify(enemigos, null, 2)
  );

  res.send({
    enemigos,
  });
});

app.post("/mokepon/:jugadorId/ataques", (req, res) => {
  //acceso a la variable de la url jugadoresId
  const jugadorId = req.params.jugadorId || "";
  const ataques = req.body.ataques || [];

  const jugador = jugadores.find((j) => j.id === jugadorId);

  if (jugador) {
    jugador.asignarAtaques(ataques);
  }

  res.end();
});

app.get("/mokepon/:jugadorId/ataques", (req, res) => {
  const jugadorId = req.params.jugadorId || "";
  const jugador = jugadores.find((jugador) => jugador.id === jugadorId);
  console.log("Jugador ID:", jugadorId);

  res.send({
    ataques: jugador.ataques || [],
  });
});

app.listen(8080, () => {
  console.log("el servidor ya arranco");
});
