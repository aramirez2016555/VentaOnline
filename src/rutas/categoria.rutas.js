'use strict'
var express = require("express");
var categoriaControlador = require("../controladores/categoria.controlador");
var md_autorizacion = require("../middlewares/authenticated");

var api = express.Router();

api.post("/agregarCategoria", md_autorizacion.ensureAuth, categoriaControlador.agregarCategoria);
api.delete('/eliminarCategoria/:id', md_autorizacion.ensureAuth, categoriaControlador.eliminarCategoria);
api.put('/editarCategoria/:id', md_autorizacion.ensureAuth, categoriaControlador.editarCategoria);
api.get('/obtenerCategorias', categoriaControlador.obtenerCategorias);


module.exports = api;