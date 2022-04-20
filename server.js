const express = require('express')
const {Server: HttpServer} = require('http')
const {Server: IOServer} = require('socket.io')

const app = express()
const httpserver = new HttpServer(app) 
const io = new IOServer(httpserver)

const PORT = process.env.PORT || 8080
app.use(express.static('public'))

const cajaMensajes = [];
const productsArray = [];
io.on('connection', socket=>{ //si no pongo 'connection' no anda
    //cuando se establece nueva coneccion les avisa a todos
    io.sockets.emit('nuevoCliente', {mensaje:`Nuevo usuario conectado! ${new Date().toLocaleTimeString()}`, datosTabla: productsArray}) 
    //envio mensaje a todos los usuarios
    socket.on('buttonOnClick' , objeto=>{
        const mensajeConFecha = {nombre: `${objeto.nombre} `, mensaje: objeto.mensaje, hora: new Date().toLocaleTimeString()}
        cajaMensajes.push(mensajeConFecha)
        io.sockets.emit('mensaje', mensajeConFecha)
    })
    //pedido de mensajes anteriores
    socket.on('pedidoDeMensajesAnteriores', ()=>{
        socket.emit('mensajesAnteriores', cajaMensajes)
    })
    socket.on('infoDeTabla', products=>{
        productsArray.push(products)
        io.sockets.emit('agregarInfo', productsArray)
    })
})

httpserver.listen(PORT, ()=>console.log(`listening on port ${PORT}`))

