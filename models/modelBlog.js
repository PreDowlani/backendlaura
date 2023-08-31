const mongoose = require("mongoose");


const blogSchema = new mongoose.Schema ({
    imagenDestacada: String,
    titulo: String,
    subTitulo: String,
    descripcion: [String],
    fecha: Date,
    imagenes: [String]
})

module.exports = new mongoose.model("Blog",blogSchema)