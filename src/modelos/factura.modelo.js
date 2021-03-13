'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var FacturaSchema = Schema({
    idUsuario: { type: Schema.Types.ObjectId, ref: 'usuarios' },
    editable: String,
    ProductoFactura: [{
        idProducto: { type: Schema.Types.ObjectId, ref: 'productos' },
        cantidad: Number,
        precio: Number
    }],
});

module.exports = mongoose.model('facturas', FacturaSchema);