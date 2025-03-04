const socket = io('http://localhost:5000');

const form = document.getElementById('send-form');
const msginput = document.getElementById('message-box');
const msgcontainer = document.querySelector('.container');
const audio = new Audio("msgtone.wav");

const append = (msg, where) => {
    const newElement = document.createElement('div');
    newElement.innerText = msg;
    
    if(where === 'disconnected' || where === 'joined' )
    {
        newElement.classList.add('left-joined');
    }
    else
    {
        newElement.classList.add('convo');
        newElement.classList.add(where);
    }
    msgcontainer.append(newElement);
    
    if(where == 'recp')
    {
        audio.play();
    }
    
}

form.addEventListener('submit',(e) => {
    e.preventDefault();
    const message = msginput.value;
    append(`You: ${message}`,'recp');
    socket.emit('msg-send',message);
    msginput.value = '';
})

const userName = prompt("Enter Your Name To Join");
socket.emit('new-user-joined',userName);

socket.on('user-joined', name => {
    if(name){
        append(`${name} has joined the chat`,'joined');
    }
});

socket.on('receive', msgObj => {
    append(`${msgObj.name}: ${msgObj.message}`,'sender');
});

socket.on('left', user => {
    if(user){        
        append(`${user} has left the chat`,'disconnected');
    }
});