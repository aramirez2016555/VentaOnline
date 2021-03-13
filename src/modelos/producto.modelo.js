'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProductoSchema = Schema({
    nombre: String,
    precio: Number,
    cantidad: Number,
    idCategoria: { type: Schema.Types.ObjectId, ref: 'categorias' }
});

module.exports = mongoose.model('productos', ProductoSchema);