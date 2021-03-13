'use strict'

var Categoria = require("../modelos/categoria.modelo");
var Factura = require("../modelos/factura.modelo");
var Producto = require("../modelos/producto.modelo");
var Usuario = require("../modelos/usuario.modelo");

var bcrypt = require('bcrypt-nodejs');
var jwt = require("../servicios/jwt");


//FuncionesUsuario

//Crea el usuario administrador
function administrador() {
    var usuarioModelo = Usuario();   
    usuarioModelo.nombre= "Administrador"
    usuarioModelo.rol="ROL_ADMIN"


    Usuario.find({ 
        nombre: "Administrador"

    }).exec((err, adminoEncontrado )=>{
        if(err) return console.log({mensaje: "Error al crear Administrador"});

        if(adminoEncontrado.length >= 1){
        return console.log("Administrador listo!");

        }else{bcrypt.hash("123456", null, null, (err, passwordEncriptada)=>{
            usuarioModelo.password = passwordEncriptada;

            usuarioModelo.save((err, usuarioguardado)=>{
                if(err) return console.log({mensaje : "Error en la peticion"});

                if(usuarioguardado){console.log("Administrador preparado");

                }else{
                console.log({mensaje:"Error en la petición"});
                }      
            })     
        })
        }
    })
}


//Registra un nuevo usuario
function registrarUsuario(req, res) {
    var usuarioModelo = new Usuario();
    var params = req.body;

         if (params.nombre && params.password) {
          usuarioModelo.nombre = params.nombre;
          usuarioModelo.username = params.username;
          usuarioModelo.rol = params.rol;


              Usuario.find(
                  { username: usuarioModelo.username }
              ).exec((err, usuariosEncontrados) => {
                 if (err) return res.status(500).send({ mensaje: 'Error en la petición' });

                 if (usuariosEncontrados && usuariosEncontrados.length >= 1) {
                 return res.status(500).send({ mensaje: 'El cliente ya existe' });

                  } else {
                       bcrypt.hash(params.password, null, null, (err, passwordEncriptada) => {
                       usuarioModelo.password = passwordEncriptada;

                          usuarioModelo.save((err, usuarioGuardado) => {

                            if (err) return res.status(500).send({ mensaje: 'Error en la petición' });

                            if (usuarioGuardado) {
                               res.status(200).send({ usuarioGuardado })
                             } else {
                                  res.status(404).send({ mensaje: 'No se registró' })
                        }
                    })
                })
            }
        })

    }
}


//Permite ingresar
function login(req, res) {
    var params = req.body; 


    Usuario.findOne({username: params.username}, (err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({mensaje: "Error en la petición"});
        if(usuarioEncontrado){
            bcrypt.compare(params.password, usuarioEncontrado.password, (err, passVerificada)=>{
                if(err) return res.status(500).send({mensaje: "Error en la petición"});
                if(passVerificada){
                     if(params.getToken == "true"){
                        return res.status(200).send({token: jwt.createToken(usuarioEncontrado)});
                     }else{
                        usuarioEncontrado.password = undefined;
                        return res.status(200).send({usuarioEncontrado});
                     }
                }else{
                    return res.status(500).send({mensaje:"El Usuario no se a podido identificar"});
                }
            })
        }else{
            return res.status(500).send({mensaje:"Error al buscar el Usuario"})
        }
    })
}




//Permite editar los datos de un usuario
function editarUsuario(req, res) {
    var idUsuario = req.user.sub;
    var params = req.body;
    delete params.password;

        Usuario.find(
          { username: params.username }
        ).exec((err, usuarioEncontrado) => {
             if (err) return res.status(500).send({ mensaje: 'Error en la petición' });

              if (usuarioEncontrado && usuarioEncontrado.length >= 1) {
              return res.status(500).send({ mensaje: 'Los datos ya existen' });
    }

                 if (req.user.rol != "ROL_ADMIN") {
                     Usuario.findByIdAndUpdate(idUsuario, params, { new: true }, (err, usuarioActualizado) => {
                 if (err) return res.status(500).send({ mensaje: 'Error en la petición' });

                   if (!usuarioActualizado) return res.status(500).send({ mensaje: 'No se editó al usuario' });
                    return res.status(200).send({ usuarioActualizado })
                })
                    }else{
                        return res.status(500).send({ mensaje: 'Un usuario administrador no puede ser editado' });
    }
    
})
  
}



//Elimina los datos de un usuario
function eliminarUsuario(req, res){
    var idUsuario= req.user.sub;

        if(req.user.rol != "ROL_CLIENTE"){
            return res.status(500).send({mensaje: "Un usuario administrador no puede ser eliminado"});
        }

             Usuario.findByIdAndDelete(idUsuario,(err, usuarioEliminado)=>{
                 if(err) return res.status(500).send({mensaje:"Error en la petición"});

                 if(!usuarioEliminado) return res.status(500).send({mensaje:"No se eliminó el usuario"});

              return res.status(200).send({mensaje: "Se ha eliminado el Usuario"});
    })

    
}


//Obtiene las facturas del cliente
function obtenerFacturas(req, res){
    Factura.find({idUsuario : req.user.sub}).exec(
        (err, fac) => {
           if(err){res.status(500).send("Error en la peticion");
           }else{
            if (!fac) return res.status(500).send({mensaje: "No hay facturas"})
            return res.status(200).send({fac});
           }
        }  
    )
}



module.exports = {
    administrador, registrarUsuario, login, editarUsuario, eliminarUsuario, obtenerFacturas
}