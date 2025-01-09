const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "datos"
});



app.post("/create", (req, res) => {
    const nombre = req.body.nombre;
    const edad = req.body.edad;
    const genero = req.body.genero;
    const correo = req.body.correo;
    const clave = req.body.clave;

    db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send("Ocurrió un error al verificar el correo");
            return;
        }

        if (results.length > 0) {
            // Ya existe un usuario con este correo
            res.status(400).send("Ya existe un usuario con este correo");
            return;
        }



        db.query('insert into usuarios (nombre, edad, genero, correo, clave) values (?,?,?,?,?)', [nombre, edad, genero, correo, clave],
            (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send("Ocurrió un error al crear el usuario");
                } else {
                    res.send(result);
                }
            }
        );
    });

});

app.delete("/delete/:id", (req, res) => {

    const id = req.params.id;

    db.query('delete from usuarios where id_usuarios=?', id,
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );

});

app.post("/login", (req, res) => {
    const correo = req.body.correo;
    const clave = req.body.clave;

    db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send("Ocurrió un error al verificar el correo");
            return;
        }

        if (results.length === 0) {
            // El usuario no existe
            res.status(404).send("Usuario no encontrado");
            return;
        }

        const usuario = results[0];

        if (usuario.clave !== clave) {
            // Contraseña incorrecta
            res.status(401).send("Contraseña incorrecta");
            return;
        }

        // Inicio de sesión exitoso, se envia el nombre del usuario
        const token = jwt.sign({ id: usuario.id_usuarios, correo: usuario.correo, nombre: usuario.nombre }, "Stack", {
            expiresIn: '1d'
        });
        res.send({ token });

    });
});

app.get("/usuario/:id", (req, res) => {

    const id = req.params.id;

    db.query('select * from usuarios where id_usuarios=?', [id],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error en el servidor");
            } else {
                res.send(result);
            }
        }
    );

});

app.put("/updateDatos", (req, res) => {

    const id = req.body.id;
    const nombre = req.body.nombre;
    const edad = req.body.edad;
    const genero = req.body.genero;
    const correo = req.body.correo;

    db.query('update usuarios set nombre=?, edad=?, genero=?, correo=? where id_usuarios=?', [nombre, edad, genero, correo, id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );

});

app.put("/updateFoto", (req, res) => {

    const id = req.body.id;
    const url = req.body.url;

    db.query('update usuarios set url=? where id_usuarios=?', [url, id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );

});

app.put("/updatePassword", (req, res) => {
    const id = req.body.id;
    const antiguaClave = req.body.antiguaClave;
    const nuevaClave = req.body.nuevaClave;

    // Primero verifica que la contraseña antigua sea correcta
    db.query('SELECT clave FROM usuarios WHERE id_usuarios = ?', [id], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error en el servidor");
            return;
        }

        if (results.length === 0) {
            res.status(404).send("Usuario no encontrado");
            return;
        }

        const claveActual = results[0].clave;

        if (claveActual !== antiguaClave) {
            res.status(401).send("La contraseña antigua es incorrecta");
            return;
        }

        // Si la contraseña antigua es correcta, actualiza la contraseña
        db.query('UPDATE usuarios SET clave = ? WHERE id_usuarios = ?', [nuevaClave, id], (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error en el servidor");
            } else {
                res.send(result);
            }
        });
    });
});

app.put("/updatePassword", (req, res) => {
    const id = req.body.id;
    const antiguaClave = req.body.antiguaClave;
    const nuevaClave = req.body.nuevaClave;

    // Primero verifica que la contraseña antigua sea correcta
    db.query('SELECT clave FROM usuarios WHERE id_usuarios = ?', [id], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error en el servidor");
            return;
        }

        if (results.length === 0) {
            res.status(404).send("Usuario no encontrado");
            return;
        }

        const claveActual = results[0].clave;

        if (claveActual !== antiguaClave) {
            res.status(400).send("La contraseña antigua es incorrecta");
            return;
        }

        // Si la contraseña antigua es correcta, actualiza la contraseña
        db.query('UPDATE usuarios SET clave = ? WHERE id_usuarios = ?', [nuevaClave, id], (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error en el servidor");
            } else {
                res.send(result);
            }
        });
    });
});

app.post("/createDocument", (req, res) => {
    const titulo = req.body.titulo;
    const materia = req.body.materia;
    const universidad = req.body.universidad;
    const semestre = req.body.semestre;
    const url_archivo = req.body.url_archivo;
    const tipo_documento = req.body.tipo_documento;
    const id = req.body.id;

    db.query('insert into documento (titulo, materia, universidad, semestre, url_archivo, tipo_documento, id_usuarios) values (?,?,?,?,?,?,?)', [titulo, materia, universidad, semestre, url_archivo, tipo_documento, id],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Ocurrió un error al crear el documento");
            } else {
                res.send(result);
            }
        }
    );

});

app.post("/createLibro", (req, res) => {
    const titulo = req.body.titulo;
    const autor = req.body.autor;
    const materia = req.body.materia;
    const url_archivo = req.body.url_archivo;
    const id = req.body.id;

    db.query('insert into libro (titulo, autor, materia, url_archivo, id_usuarios) values (?,?,?,?,?)', [titulo, autor, materia, url_archivo, id],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Ocurrió un error al crear el libro");
            } else {
                res.send(result);
            }
        }
    );

});

app.get("/cargarTodosLosDocumentos", (req, res) => {
    db.query('SELECT documento.*, usuarios.nombre FROM documento INNER JOIN usuarios ON documento.id_usuarios = usuarios.id_usuarios',
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.get("/cargarTodosLosLibros", (req, res) => {
    db.query('SELECT libro.*, usuarios.nombre FROM libro INNER JOIN usuarios ON libro.id_usuarios = usuarios.id_usuarios',
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.post("/createPregunta", (req, res) => {
    const texto = req.body.pregunta;
    const materia = req.body.materia;
    const id = req.body.id;

    db.query('insert into preguntas (texto, id_usuarios, materia) values (?,?,?)', [texto, id, materia],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Ocurrió un error al crear la pregunta");
            } else {
                res.send(result);
            }
        }
    );

});

app.get("/cargarTodasLasPreguntas", (req, res) => {
    db.query('SELECT preguntas.*, usuarios.nombre FROM preguntas INNER JOIN usuarios ON preguntas.id_usuarios = usuarios.id_usuarios',
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.post("/createRespuesta", (req, res) => {
    const texto = req.body.respuesta;
    const id = req.body.id;
    const idPregunta = req.body.idPregunta;

    db.query('insert into respuestas (texto, id_usuarios, id_pregunta) values (?,?,?)', [texto, id, idPregunta],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Ocurrió un error al crear la respuesta");
            } else {
                res.send(result);
            }
        }
    );

});

app.get("/cargarTodasLasRespuestas/:id_pregunta", (req, res) => {
    const id_pregunta = req.params.id_pregunta;

    db.query('SELECT respuestas.*, usuarios.nombre, usuarios.url FROM respuestas INNER JOIN usuarios ON respuestas.id_usuarios = usuarios.id_usuarios WHERE respuestas.id_pregunta = ?', [id_pregunta],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error las preguntas");
            } else {
                res.send(result);
            }
        }
    );
});

app.post("/createCalificacion", (req, res) => {
    const id = req.body.id;
    const idCalificado = req.body.idCalificado;
    const puntuacion = req.body.puntuacion;

    db.query('insert into calificacion (usuario, usuario_calificado, puntuacion) values (?,?,?)', [id, idCalificado, puntuacion],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Ocurrió un error al enviar la puntuacion");
            } else {
                res.send(result);
            }
        }
    );

});

app.get("/cargarPuntuacion/:id", (req, res) => {
    const id = req.params.id;

    db.query('SELECT usuario_calificado, AVG(puntuacion) as promedio_calificacion FROM calificacion WHERE usuario_calificado = ?', [id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.get("/cargarPreguntasUsuario/:id", (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM preguntas WHERE id_usuarios = ?', [id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.put("/updatePregunta", (req, res) => {
    const texto = req.body.texto;
    const materia = req.body.materia;
    const id = req.body.id;

    db.query('UPDATE preguntas SET texto=?, materia=? WHERE id_pregunta = ?', [texto, materia, id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error en el servidor");
        } else {
            res.send(result);
        }
    });
});

app.delete("/deletePregunta/:id", (req, res) => {

    const id = req.params.id;

    db.query('delete from preguntas where id_pregunta=?', id,
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );

});

app.get("/cargarRespuestasUsuario/:id", (req, res) => {
    const id = req.params.id;
    db.query('SELECT respuestas.id_respuesta,respuestas.texto as respuesta, preguntas.texto as pregunta, preguntas.materia, usuarios.nombre FROM respuestas INNER JOIN preguntas ON respuestas.id_pregunta = preguntas.id_pregunta INNER JOIN usuarios ON preguntas.id_usuarios = usuarios.id_usuarios WHERE respuestas.id_usuarios = ?', [id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.put("/updateRespuestas", (req, res) => {
    const texto = req.body.texto;
    const id = req.body.id;

    db.query('UPDATE respuestas SET texto=? WHERE id_respuesta = ?', [texto, id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error en el servidor");
        } else {
            res.send(result);
        }
    });
});

app.delete("/deleteRespuesta/:id", (req, res) => {

    const id = req.params.id;

    db.query('delete from respuestas where id_respuesta=?', id,
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );

});

app.get('/buscar/:consulta', (req, res) => {
    const consulta = req.params.consulta;

    db.query(`SELECT preguntas.*, usuarios.nombre FROM preguntas INNER JOIN usuarios ON preguntas.id_usuarios = usuarios.id_usuarios WHERE texto LIKE ?`, [`%${consulta}%`], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error en el servidor');
        } else {
            res.json(results);
        }
    });
});

app.get("/cargarCalificaciones", (req, res) => {
    db.query('SELECT c.usuario_calificado as id_usuario_calificado, u.nombre as nombre_usuario_calificado, AVG(c.puntuacion) as promedio_calificaciones FROM calificacion c JOIN usuarios u ON c.usuario_calificado = u.id_usuarios GROUP BY c.usuario_calificado, u.nombre',
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});



app.listen(3001, () => {
    console.log("corriendo en el puerto 3001")
});