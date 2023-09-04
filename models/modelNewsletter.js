const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true // Para asegurarte de que no haya correos electrónicos duplicados
  }
});

// Aplica el complemento mongoose-unique-validator al esquema
subscriberSchema.plugin(uniqueValidator);


module.exports = new mongoose.model('Subscriber', subscriberSchema);
