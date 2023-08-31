const express = require ("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

const port = 5000;

app.use(cors());
app.use(express.json());

const rutaUser = require("./routes/rutaUser");
app.use("/api/usuario",rutaUser)

const rutaBlog = require("./routes/rutaBlog");
app.use("/api/blog",rutaBlog)


app.use((req,res)=> {
    res.status(404).json({
        mensaje: "No se ha establecido conexión con el servidor"
    })
})

mongoose
.connect("mongodb+srv://Prashanth:Prashanth150492@cluster0.udzwxfp.mongodb.net/Backend-Laura?retryWrites=true&w=majority")
.then(() => {
    app.listen(port, () =>
      console.log(`Servidor escuchano por el puerto ${port}`)
    );
  })
  .catch((error) => console.log(error));