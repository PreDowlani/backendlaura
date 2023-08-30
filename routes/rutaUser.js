const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken"); //importamos a jwt para conseguir el token cuando creamos un usuario nuevo.

const Usuario = require('../models/modelUser'); 
// Asegúrate de proporcionar la ruta correcta al modelo Usuario

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener un usuario por su ID
router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post("/", async (req, res, next) => {
  const { nombreCompleto, email, password } = req.body;
  let existeUsuario;

  //Comprobamos primero si el email del nuevo usuario ya existe en nuestro Base de Datos:
  try {
    existeUsuario = await Usuario.findOne({ email: email });
  } catch (err) {
    res.status(500).json({
      mensaje: `Error en los datos `,
      error: err.messaje,
    });
    return next(err);
  }

  //Si ya existe un usuario con el mismo e-mail , le saldra error:
  // let nuevoUsuario;
  if (existeUsuario) {
    const error = new Error(" Ya existe un usuario con el mismo e-mail");
    error.code = 401;
    return next(error);
    // Si en caso contrario , tras verificar que no existe el nuevo email en nuestro base de datos , procedemos a crear el  nuevo usuario siguiendo nuestro modelo Schema.
  } else {
    //creamos el variable para encriptar la contraseña
    let hashedPassword;
    try {
      // hacemos la encriptacion con un  valor de 10(son las capas de seguridad) recomdable entre 10-14
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      const err = new Error("No se ha podido crear el usuario");
      err.code = 500;
      return next(err);
    }
    console.log(hashedPassword);
    const nuevoUsuario = new Usuario({
      nombreCompleto,
      email,
      password: hashedPassword,
    });
    console.log(nuevoUsuario);

    //procedemos a guardar dicho usuario en nuestro BDD.
    try {
      await nuevoUsuario.save();

      // si produce algun fallo , lo comunicaremos
    } catch (err) {
      const error = new Error("No se han podido guardar los datos");
      error.code = 500;
      return next(err);
    }
    // si todo esta bien , mostraremos que el usuario nuevo esta creado
    console.log(nuevoUsuario);
    res.status(200).json({
      mensaje: `Usuario creado con éxito`,
      usuarioCreado: nuevoUsuario,
    });
  }
});

// Actualizar un usuario por su ID
router.put('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (usuario) {
      usuario.nombreCompleto = req.body.nombreCompleto || usuario.nombreCompleto;
      usuario.email = req.body.email || usuario.email;
      usuario.password = req.body.password || usuario.password;

      const usuarioActualizado = await usuario.save();
      res.json(usuarioActualizado);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Actualizar parcialmente un usuario por su ID (PATCH)
router.patch('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (usuario) {
      if (req.body.nombreCompleto) {
        usuario.nombreCompleto = req.body.nombreCompleto;
      }
      if (req.body.email) {
        usuario.email = req.body.email;
      }
      if (req.body.password) {
        usuario.password = req.body.password;
      }

      const usuarioActualizado = await usuario.save();
      res.json(usuarioActualizado);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar un usuario por su ID
router.delete('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (usuario) {
      await usuario.remove();
      res.json({ message: 'Usuario eliminado' });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const usuario = await Usuario.findOne({ email });
      if (!usuario) {
        return res.status(401).json({ message: 'e-mail o contraseña inválidas' });
      }
  
      const passwordValida = await bcrypt.compare(password, usuario.password);
      if (!passwordValida) {
        return res.status(401).json({ message: 'e-mail o contraseña inválidas' });
      }
  
      // Generar un token JWT
      const token = jwt.sign(
        { userId: usuario._id, email: usuario.email },
        'laura_laverde_makeup_2023', // Reemplaza con una clave secreta segura en un entorno de producción
        { expiresIn: '1h' } // El token expira en 1 hora
      );
  
      res.json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;