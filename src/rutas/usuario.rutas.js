'use strict'
var express = require("express");
var usuarioControlador = require("../controladores/usuario.controlador");
var md_autorizacion = require("../middlewares/authenticated");

var api = express.Router();

api.post("/registrarUsuario", usuarioControlador.registrarUsuario);
api.post("/login", usuarioControlador.login);
api.put('/editarUsuario', md_autorizacion.ensureAuth, usuarioControlador.editarUsuario);
api.delete('/eliminarUsuario', md_autorizacion.ensureAuth, usuarioControlador.eliminarUsuario);
api.put('/obtenerFacturas', md_autorizacion.ensureAuth, usuarioControlador.obtenerFacturas);

module.exports = api;