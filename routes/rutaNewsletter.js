const express = require('express');
const router = express.Router();
const validator = require("validator")

// Importa el modelo de suscriptor si tienes uno definido
const Subscriber = require('../models/modelNewsletter');

// Ruta para manejar la suscripción al newsletter
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    // Valida que el correo electrónico no esté vacío y cumpla con tus criterios de validación
    // Valida que el correo electrónico sea una dirección válida
    if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, error: 'La dirección de correo electrónico no es válida.' });
      }
    // Crea un nuevo registro de suscriptor en la base de datos (usando el modelo de Mongoose)
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    // Envía una respuesta de éxito
    res.status(201).json({message : "Suscrito correctamente" , success: true });
  } catch (error) {
    if (error.name === 'ValidationError' && error.errors.email.kind === 'unique') {
        // El correo electrónico ya existe en la base de datos
        return res.status(400).json({ success: false, error: 'Esta dirección de correo electrónico ya está suscrita.' });
      }

    console.error('Error al procesar la suscripción:', error);
    res.status(500).json({ success: false, error: 'Hubo un error al procesar la suscripción.' });
  }
});

router.get("/", async(req,res,next)=>{
    let todosSucritores; 
    try {
        todosSucritores = await Subscriber.find({}, "email")
    } catch (error) {
        res.status(500).json({
            mensaje : "Error en listar todos los suscritores"
        })
        return next(error);

    }
    res.status(200).json({
        mensaje : "Listando a todos los suscritores",
        suscritores : todosSucritores
    })
})


module.exports = router;
