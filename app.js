'use strict'

const express = require("express");
const app = express();
const bodyParser = require('body-parser');

var categoria_rutas = require("./src/rutas/categoria.rutas");
var factura_rutas = require("./src/rutas/factura.rutas");
var producto_rutas = require("./src/rutas/producto.rutas");
var usuario_rutas = require("./src/rutas/usuario.rutas");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', categoria_rutas, factura_rutas, producto_rutas, usuario_rutas);

module.exports = app;