'use strict'

var Categoria = require("../modelos/categoria.modelo");
var Factura = require("../modelos/factura.modelo");
var Producto = require("../modelos/producto.modelo");
var Usuario = require("../modelos/usuario.modelo");

var bcrypt = require('bcrypt-nodejs');
var jwt = require("../servicios/jwt");
const categoriaModelo = require("../modelos/categoria.modelo");


//Agrega un producto
function agregarProducto(req, res) {
    var productoModelo = new Producto(); 
    var params = req.body;


         if (req.user.rol === "ROL_ADMIN"){
              if (params.nombre) {
                productoModelo.nombre = params.nombre;
                productoModelo.precio = params.precio;
                 productoModelo.cantidad = params.cantidad;
                 productoModelo.idCategoria = params.idCategoria;


                 Producto.find(
                      { nombre: productoModelo.nombre }
                  ).exec((err, productoEncontrado) => {
                      if (err) return res.status(500).send({ mensaje: 'Error en la petición' });

                      if (productoEncontrado && productoEncontrado.length >= 1) {
                         return res.status(500).send({ mensaje: 'El producto ya existe' });

                      } else {
                            productoModelo.save((err, productoGuardado) => {
                        if (err) return res.status(500).send({ mensaje: 'Error en la petición' });

                        if (productoGuardado) {
                            res.status(200).send({ productoGuardado });

                        } else {
                            res.status(404).send({ mensaje: 'No se registró el producto'});
                        }
                    })
                }
            })

        }
    }else{
        return res.status(500).send({ mensaje: 'Solo personal autorizado' });
    }
}


//Edita un producto
function editarProducto(req, res) {
    var idProducto = req.params.id;
    var params = req.body; 


        Producto.find(
            { nombre: params.nombre }
        ).exec((err, ProductoEncontrado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la petición' });

                if (ProductoEncontrado && ProductoEncontrado.length >= 1) {
                    return res.status(500).send({ mensaje: 'El producto ya existe' });
        }

        if (req.user.rol == "ROL_ADMIN") {
            Producto.findByIdAndUpdate(idProducto, params, { new: true }, (err, productoActualizado) => {
              if (err) return res.status(500).send({ mensaje: 'Error en la petición' });
                 if (!productoActualizado) return res.status(500).send({ mensaje: 'No se edito al producto' });
                 return res.status(200).send({ productoActualizado })
            })
        }else{
            return res.status(500).send({ mensaje: 'Solo personal autorizado' });
    }
    })
}


//Elimina un producto
function eliminarProducto(req, res) {
    var idCategoria= req.params.id;
    if(req.user.rol != "ROL_ADMIN"){
        return res.status(500).send({mensaje: "Solo personal autorizado"});
    }

    Producto.findByIdAndDelete(idCategoria,(err, ProductoEliminado)=>{
    if(err) return res.status(500).send({mensaje:"Error en la petición"});
    if(!ProductoEliminado) return res.status(500).send({mensaje:"No se eliminó el producto"});
        return res.status(200).send({mensaje: "Se ha eliminado el producto"});
    })


    
}


//Obtiene los datos de un producto
function obtenerProductos(req, res) {


    Producto.find().exec((err, productos) => {
    if (err) return res.status(500).send({ mensaje: 'Error en la petición' });
    if (!productos) return res.status(500).send({ mensaje: 'Error en la consulta' });
    return res.status(200).send({ productos });
    })


}


//Obtiene los productos de una categoría en específico
function obtenerProdCat(req, res) {
    var categoriaId = req.params.id;

    Producto.find({idCategoria: categoriaId}).exec(
    (err, productos) => {
        if(err){res.status(500).send("Error en la peticion");

        }else{
            if (!productos) return res.status(500).send({mensaje: "No tienes productos con esa categoria"})
            return res.status(200).send({ productos });
        }
    })

}


//Obtiene los datos de un producto según el nombre
function obtenerPorNombre(req, res) {
    var params = req.body;

    Producto.find({nombre: params.nombre}).exec(
        (err, productos) => {
            if(err){res.status(500).send("Error en la petición");
            }else{
                if (!productos) return res.status(500).send({mensaje: "No existe el producto"})
                return res.status(200).send({ productos });
        }
    })
}


//Obtiene los productos que están agotados
function obtenerAgotados(req, res) {

    Producto.find({cantidad: 0}).exec(
    (err, productos) => {
        if(err){res.status(500).send("Error en la petición");

        }else{
            if (!productos) return res.status(500).send({mensaje: "No tienes productos con ese nombre"})
            return res.status(200).send({ productos });
        }
    })
}

module.exports = {
    agregarProducto,
    editarProducto,
    eliminarProducto,
    obtenerProductos,
    obtenerProdCat,
    obtenerPorNombre,
    obtenerAgotados
}