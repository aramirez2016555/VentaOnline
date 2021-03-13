'use strict'
var express = require("express");
var productoControlador = require("../controladores/producto.controlador");
var md_autorizacion = require("../middlewares/authenticated");

var api = express.Router();

api.post("/agregarProducto", md_autorizacion.ensureAuth, productoControlador.agregarProducto);
api.put('/editarProducto/:id', md_autorizacion.ensureAuth, productoControlador.editarProducto);
api.delete('/eliminarProducto/:id', md_autorizacion.ensureAuth, productoControlador.eliminarProducto);
api.get('/obtenerProductos', productoControlador.obtenerProductos);
api.get('/obtenerProdCat/:id', productoControlador.obtenerProdCat);
api.get('/obtenerPorNombre', productoControlador.obtenerPorNombre);
api.get('/obtenerAgotados', productoControlador.obtenerAgotados);

module.exports = api;