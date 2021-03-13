'use strict'

var Categoria = require("../modelos/categoria.modelo");
var Factura = require("../modelos/factura.modelo");
var Producto = require("../modelos/producto.modelo");
var Usuario = require("../modelos/usuario.modelo");

var bcrypt = require('bcrypt-nodejs');
var jwt = require("../servicios/jwt");



function defaultt(req, res) {
    var categoriaModel = Categoria();   
    categoriaModel.nombre= "Default"
    Categoria.find({ 
        nombre: "Default"
    }).exec((err, CategoriaEncontrada )=>{
        if(err) return console.log({mensaje: "Error al crear la categoría"});
        if(CategoriaEncontrada.length >= 1){
        return console.log("Categoría lista!");
        }else{
            categoriaModel.save((err, CategoriaGuardada)=>{
                if(err) return console.log({mensaje : "Error en la petición"});
                if(CategoriaGuardada){console.log("Categoría preparada");
                }else{
                console.log({mensaje:"Cargando..."});
                }      
            })     
        }
    })
}

//Agrega una categoría
function agregarCategoria(req, res) {
    var categoriaModel = new Categoria(); 
    var params = req.body;
    if (req.user.rol == "ROL_ADMIN") {
        if (params.nombre) {
            categoriaModel.nombre = params.nombre;
            Categoria.find(
                { nombre: categoriaModel.nombre }
            ).exec((err, CategoriaEncontrada) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la petición' });
                if (CategoriaEncontrada && CategoriaEncontrada.length >= 1) {
                    return res.status(500).send({ mensaje: 'La categoria ya existe' });
                } else {
                    categoriaModel.save((err, CategoriaGuardada) => {
                        if (err) return res.status(500).send({ mensaje: 'Error en la petición' });
                        if (CategoriaGuardada) {
                            res.status(200).send({ CategoriaGuardada })
                        } else {
                            res.status(404).send({ mensaje: 'No se registró'})
                        }
                    })
                }
            })

        }
    }else{
        return res.status(500).send({ mensaje: 'Solo personal autorizado' });
    }
}


//Elimina la categoría
function eliminarCategoria(req, res) {
    var idCategoria= req.params.id;
    var params = req.body; 
    if(req.user.rol != "ROL_ADMIN"){
        return res.status(500).send({mensaje: "Solo personal autorizado"});
    }

    if(idCategoria == "604c43e91f5b7d05e0f63a7a"){
        return res.status(500).send({mensaje: "No se puede borrar la categoría"});
    }

   
    Categoria.findByIdAndDelete(idCategoria,(err, usuarioEliminado)=>{
    if(err) return res.status(500).send({mensaje:"Error en la peticion"});
    if(!usuarioEliminado) return res.status(500).send({mensaje:"No se ha podido Eliminar la categoria"});
         return res.status(200).send({mensaje: "Se ha eliminado la categoria"});
    })


    Producto.updateMany({idCategoria: idCategoria}, params, { new: true }, (err, productoActualizado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!productoActualizado) return res.status(500).send({ mensaje: 'No se a podido editar el producto' });
    })
}


//Edita los datos de una categoría
function editarCategoria(req, res) {
    var idCategoria = req.params.id;
    var params = req.body; 
    Categoria.find(
        { nombre: params.nombre }
    ).exec((err, CategoriaEncontrada) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la petición' });
        if (CategoriaEncontrada && CategoriaEncontrada.length >= 1) {
            return res.status(500).send({ mensaje: 'La categoria ya existe' });
    }
        if (req.user.rol == "ROL_ADMIN") {
            Categoria.findByIdAndUpdate(idCategoria, params, { new: true }, (err, CategoriaActualizada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la petición' });
            if (!CategoriaActualizada) return res.status(500).send({ mensaje: 'No se editó la categoría' });
            return res.status(200).send({ CategoriaActualizada })
            })
        }else{
            return res.status(500).send({ mensaje: 'Solo personal autorizado' });
        }
})
}

//Obtiene los datos de la categoría
function obtenerCategorias(req, res) {


        Categoria.find().exec((err, categorias) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la petición' });
          if (!categorias) return res.status(500).send({ mensaje: 'Error en la petición' });
        return res.status(200).send({ categorias });
        })

    
}


module.exports = {
    defaultt,
    agregarCategoria,
    eliminarCategoria,
    editarCategoria,
    obtenerCategorias
}