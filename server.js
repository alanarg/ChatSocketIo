const express = require('express');
const path = require('path');


const app = express();
//definindo protocolo http
const server = require('http').createServer(app);
//Definindo protocolo WSS socket.io
const io = require('socket.io')(server);

//Definindo os arquivos publicos acessados pela aplicação através do path
app.use(express.static(path.join(__dirname,'public')));
//Para utilizar o ejs, framework de views para do node, configuremos:
app.set('views', path.join(__dirname,'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res)=>{
    res.render('index.html');
});
var messages = [];
//Toda vez que um cliente se conectar À um socket
io.on('connection',socket=>{
    //Chamar novamente todas as mensagens anteriores assim que conectar na aplicação
    socket.emit('previousMessages',messages);


     console.log(`socket conectado, ${socket.id}`);
    //3 funções principais
    //emit(): para enviar a mensagem para o respectivo socket
    //on(): para ouvir uma mensagem
    //broadcast.emit(): evia a mensagem para todos conectados na aplicação
     socket.on('sendMessage', data =>{
         messages.push(data);

         socket.broadcast.emit('receivedMessage', data);
     });

});

server.listen(3000);