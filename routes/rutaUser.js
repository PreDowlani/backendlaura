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

// Crear un nuevo usuario
// router.post('/', async (req, res) => {
//   const usuario = new Usuario({
//     nombreCompleto: req.body.nombreCompleto,
//     email: req.body.email,
//     password: req.body.password
//   });

//   try {
//     const nuevoUsuario = await usuario.save();
//     res.status(201).json(nuevoUsuario);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// Crear un nuevo usuario COMPLETO CON VERIFICACION
router.post('/', async (req, res) => {
    const { nombreCompleto, email, password } = req.body;
  
    try {
      // Verificar si el correo electrónico ya está registrado
      const usuarioExistente = await Usuario.findOne({ email });
      if (usuarioExistente) {
        return res.status(400).json({ message: 'Email registrado, por favor prueba con otro email' });
      }
      let hashedPassword;
      try {
        // hacemos la encriptacion con un  valor de 10(son las capas de seguridad) recomdable entre 10-14
        hashedPassword = await bcrypt.hash(password, 10);
      } catch (error) {
        const err = new Error("No se ha podido crear el usuario");
        err.code = 500;
        return next(err);
      }
  
      const usuario = new Usuario({
        nombreCompleto,
        email,
        password : hashedPassword
      });
  
      const nuevoUsuario = await usuario.save();
      res.status(201).json(nuevoUsuario);
    } catch (error) {
      res.status(400).json({ message: error.message });
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