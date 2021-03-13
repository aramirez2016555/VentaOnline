'use strict'

var Categoria = require("../modelos/categoria.modelo");
var Factura = require("../modelos/factura.modelo");
var Producto = require("../modelos/producto.modelo");
var Usuario = require("../modelos/usuario.modelo");

var bcrypt = require('bcrypt-nodejs');
var jwt = require("../servicios/jwt");


//Crea una factura
function CrearFactura(req, res) {
    var facturaModel = new Factura();
    var params = req.body; 

 
        if(params.idUsuario){
            facturaModel.idUsuario = params.idUsuario;
            facturaModel.editable = "sí";
            facturaModel.save((err, guardada)=>{
                if(err) return res.status(500).send({ mensaje: 'Error en la petición' });
                if(!guardada) return res.status(500).send({ mensaje: 'Error al agregar la encuesta' });
    
                return res.status(200).send({ guardada })
            })
        }else{
            return res.status(500).send({mensaje: "Datos insuficientes"})
    }
    
}

//Cancela la creación de una factura
function CancelarFactura(req, res) {
    var params= req.body;

    Factura.findOne({_id: params.idFactura}).exec(
        (err, factura) => {
            if(err){
                console.log(err);
            }else{
                if (factura.editable == "no"){
                return res.status(500).send({ mensaje: "Es muy tarde, ya no puedes cambiar los datos" });
            }else{
                Factura.findByIdAndDelete(params.idFactura,(err, Eliminado)=>{
                if(err) return res.status(500).send({mensaje:"Error en la petición"});
                 if(!Eliminado) return res.status(500).send({mensaje:"Error en el id"});
                    return res.status(200).send({mensaje: "Factura cancelada"});
                })
            }
            }
            
        }
    )
    
}


//Se actualiza la factura
function FinalzarFactura(req, res) {

    var params = req.body; 
    var final = {};
        final['editable'] = "no";
            Factura.findByIdAndUpdate(params.idFactura, final, { new: true }, (err, productoActualizado) => {
              if (err) return res.status(500).send({ mensaje: 'Error en la petición' });
                  if (!productoActualizado) return res.status(500).send({ mensaje: 'No se editó el producto' });
             return res.status(200).send({ productoActualizado })
    })

    
}

//Se usa en el carrito
function Multiplicacion(Producto, cantidad){

    return Producto.precio * cantidad

}

//Resta la cantidad de productos en stock
function restaStock(Producto, cantidad){  
    var productoTotal= Producto.cantidad - cantidad
    return productoTotal
}


function Carrito(req, res){
    var idFactura = req.params.id;
    var params = req.body;
    var idProducto = params.idProducto;

    Factura.findOne({_id: idFactura}).exec(
        (err, factura) => {
            if(err){
                console.log(err);

            }else{
                if (factura.editable == "no"){
                return res.status(500).send({ mensaje: "Solo personal autorizado" });
            }else{
                var cantidad = params.cantidad;
                if(params.idProducto && params.cantidad){
                Producto.findById(idProducto).exec((err, Producto)=>{
                    if(err) return res.status(500).send({mensaje:"Error"})
                    var Subtotal = Multiplicacion(Producto,cantidad)
                    if(Subtotal === 0 ) return res.status(400).send({mensaje:"El producto no existe"})
                    Factura.findOne({_id:idFactura , "ProductoFactura.idProducto":idProducto, },{ProductoFactura:1}).exec((err, Facturas)=>{
                        if(err) return res.status(500).send({mensaje:"Error en la petición"})
                        if(Facturas != null){
                        if(Facturas.ProductoFactura.length > 0){
                            let i
                            let suma = cantidad
                            for(i=0; Facturas.ProductoFactura.length > i; i++){
                            const item =Facturas.ProductoFactura[i]
                            if(item.idProducto == idProducto){
                            suma = Number(item.cantidad) + Number(suma)
                            }
                            }
                            var restasStock =  restaStock(Producto, suma)
                            if(restasStock < 0 ) return res.status(400).send({mensaje:"Productos insuficientes"})

                        }
                    }
                    var restasStock =  restaStock(Producto, cantidad)
                    if(restasStock < 0 ) return res.status(400).send({mensaje:"Productos insuficientes"})
                    Factura.findByIdAndUpdate(idFactura ,{$push:{ProductoFactura:{idProducto:idProducto, cantidad:cantidad, SubTotal:Subtotal}}},{new: true}, 
                        (err, En_Carrito)=>{
                            Factura.populate(En_Carrito, {path: "ProductoFactura.idProducto"},(err, Carrito)=>{
                            if(err) return res.status(500).send({mensaje:"Error al ingresar"})
                            if(!Carrito) return res.status(500).send({mensaje:"La factura no existe"})
                            return res.status(200).send({Carrito})
                            })
                        })

                    })

                })
            }else{
                return res.status(200).send({mensaje:"Datos insuficientes"})
            }
            }
            }
            
        }
    )

    

}

module.exports = {
    CrearFactura,
    CancelarFactura,
    FinalzarFactura,
    Carrito
}