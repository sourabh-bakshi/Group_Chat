const express = require('express');
const app = express();
const server = require('http').createServer(app);
const cors = require('cors');
const {Server} = require('socket.io');

app.use(cors());

const io = new Server(server,{
    cors:{
        origin: '*',
        methods: ['GET', 'POST']
    }
})

const users = {};

io.on('connection',socket => {
    socket.on('new-user-joined',name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('msg-send',msg => {
        socket.broadcast.emit('receive', {message: msg, name: users[socket.id]})
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    })
})

const Port = process.env.PORT || 5000;
server.listen(Port,() => {
    console.log(`Server is running on port ${Port}`);
});
