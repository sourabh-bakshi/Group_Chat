const io = require('socket.io')(5000,{
    cors: {
        origin: '*',
        methods:["GET", "POST"]
    }
});

const users = {};

io.on('connection',socket => {
    socket.on('new-user-joined',name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('msg-send',msg => {
        socket.broadcast.emit('receive', {message: msg, name: users[socket.id]})
    });

    socket.on('disconnect', message => {
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    })
})
