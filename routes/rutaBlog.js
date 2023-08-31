const express = require('express');
const router = express.Router();

const Blog = require("../models/modelBlog");


router.post("/", async(req,res,next) => {
    const {imagenDestacada,titulo,subtitulo,descripcion,fecha,imagenes} = req.body
    let existeTituloBlog ;
    try{
        existeTituloBlog = await Blog.findOne({titulo : titulo})
    } catch (error) {
        req.status(400).json({
            mensaje: "Error : Titulo repetido",
            err : error.message
        });
        return next(error)
    }

    if(existeTituloBlog) {
        const error = new Error(" Ya existe el mismo título");
        error.code = 401;
        return next(error);
    } else {
        const nuevoBlog = new Blog({
            imagenDestacada,
            titulo,
            subtitulo,
            descripcion,
            fecha,
            imagenes
        })
        console.log(nuevoBlog);

        try {
            await nuevoBlog.save()
        } catch (error) {
            const err = new Error("No se han podido guardar los datos");
            error.code = 500;
            return next(err);
        }
        res.status(200).json({
            mensaje : "Blog creado con éxito.",
            blogCreado : nuevoBlog
        })
    }
})

router.get("/", async(req,res,next)=>{
    let blogs ;
    try {
        blogs = await Blog.find({})
    } catch (error) {
        res.status(404).json({
            mensaje: `Error en listar todos las entradas del blog.`,
            error: error.messaje,
          });
          return next(error);
    }
    res.status(200).json({
        mensaje : "Mostrando todas las entradas del blog.",
        todoBlog : blogs,
    });
})

module.exports = router;