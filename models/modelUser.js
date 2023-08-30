const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Definir el esquema del usuario
// const usuarioSchema = new mongoose.Schema({
//   nombreCompleto: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 8,
//     match: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    // El regex asegura que la contraseña contenga al menos una mayúscula, un dígito y un carácter especial
//   }
// });



const usuarioSchema = new mongoose.Schema({
    nombreCompleto: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        validate: {
          validator: function(value) {
            // const contraseñaRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
            const contraseñaRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;

            return contraseñaRegex.test(value);
          },
          message: props => `La contraseña no cumple con los requisitos.`
      }
    }
});

// Aplicar el plugin de mongoose-unique-validator al esquema
usuarioSchema.plugin(uniqueValidator);

// Crear el modelo de usuario utilizando el esquema
 

module.exports = new mongoose.model('Usuario', usuarioSchema);