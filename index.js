const express = require ("express");
const app = express();
const mongoose = require("mongoose");
const port = 5000;




app.use((req,res)=> {
    res.status(404).json({
        mensaje: "No se ha establecido conexión con el servidor"
    })
})

mongoose
.connect("mongodb+srv://Prashanth:Prashanth150492@cluster0.udzwxfp.mongodb.net/Backend-Laura?retryWrites=true&w=majority")
.then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`Servidor escuchano por el puerto ${port}`)
    );
  })
  .catch((error) => console.log(error));