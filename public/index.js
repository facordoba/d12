const socket = io();
//nuevo cliente
socket.on('nuevoCliente', nuevoClienteConectado=>{
    const p = document.createElement('p');
    p.innerText = nuevoClienteConectado.mensaje;
    document.getElementById('mensajes').appendChild(p);
    if(nuevoClienteConectado.datosTabla.length == 0){
        return null
    }else{
        var source = document.getElementById("entry-template").innerHTML;
        var template = Handlebars.compile(source);
        var context = { 
            title: "Tabla de productos", 
            products: nuevoClienteConectado.datosTabla,
        };
        var html = template(context);
        document.getElementById('output').innerHTML = html
    }
})
//nuevo mensaje
document.getElementById('textButton').onclick = ()=>{
    if(document.getElementById('inputUserName').value != '' && document.getElementById('textToShow').value != '' ){
        socket.emit('buttonOnClick', {nombre: document.getElementById('inputUserName').value, mensaje: document.getElementById('textToShow').value})
        const button = document.getElementById('mensajesAnteriores')
        button.setAttribute('style','display:none')
        document.getElementById('textToShow').value = null
    }else{
        alert('El nombre de usuario o el mensajes estan incompletos')
    }
}
socket.on('mensaje', mensaje=>{
    const user = document.createElement('span');
    const message = document.createElement('span');
    const time = document.createElement('span');
    const br = document.createElement('br');
    user.setAttribute('class','usuario');
    message.setAttribute('class','mensaje');
    time.setAttribute('class','hora');
    user.innerText = mensaje.nombre  ;
    message.innerText = mensaje.mensaje  ;
    time.innerText = mensaje.hora  ;
    document.getElementById('mensajes').appendChild(user)
    document.getElementById('mensajes').appendChild(message)
    document.getElementById('mensajes').appendChild(time)
    document.getElementById('mensajes').appendChild(br)
})
//mensajes anteriores
document.getElementById('mensajesAnteriores').onclick = ()=>{
    socket.emit('pedidoDeMensajesAnteriores')
    const button = document.getElementById('mensajesAnteriores')
    button.setAttribute('style','display:none')
}
socket.on('mensajesAnteriores', cajaMensajes=>{
    for (let i = 0; i < cajaMensajes.length; i++) {
        const p = document.createElement('p');
        p.innerText = cajaMensajes[i];
        document.getElementById('mensajes').appendChild(p)
    }
})
//handlebars para la tabla
var context = { 
    title: "Tabla de productos", 
    products: [],
};
document.getElementById('formulario').onsubmit = function(event){
    event.preventDefault()
    if(event.target.title.value != '' && event.target.price.value != '' && event.target.thumbnail.value != ''){
        socket.emit('infoDeTabla', { title: event.target.title.value, price: event.target.price.value, thumbnail: event.target.thumbnail.value })
        event.target.title.value = null
        event.target.price.value = null
        event.target.thumbnail.value = null
    }
}
socket.on('agregarInfo', products=>{
    var source = document.getElementById("entry-template").innerHTML;
    var template = Handlebars.compile(source);
    var context = { 
        title: "Tabla de productos", 
        products: products,
    };
    var html = template(context);
    document.getElementById('output').innerHTML = html
})

