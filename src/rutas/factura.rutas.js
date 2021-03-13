'use strict'
var express = require("express");
var facturaControlador = require("../controladores/factura.controlador");
var md_autorizacion = require("../middlewares/authenticated");

var api = express.Router();

api.post("/CrearFactura", facturaControlador.CrearFactura);
api.delete("/CancelarFactura", facturaControlador.CancelarFactura);
api.put('/FinalzarFactura', facturaControlador.FinalzarFactura);
api.put('/Carrito/:id', facturaControlador.Carrito);
module.exports = api;