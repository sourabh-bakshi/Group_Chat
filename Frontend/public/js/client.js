const userName = prompt("Enter Your Name To Join");// prompting user to enter name
const socket = io('https://group-chat-backend-byj7.onrender.com'); //connecting to backend chat socket.io server
// const socket = io('http://localhost:5000');

//selecting dom elements for user interaction
const form = document.getElementById('send-form');
const msginput = document.getElementById('input-box');
const msgcontainer = document.querySelector('.container');
const audio = new Audio("msgtone.wav");

let timeout;
let typingIndicator = document.querySelector('.typing-indicator');
let userTyping = document.querySelector('#userTyping');

let typingDiv = null;

msginput.addEventListener('keydown', () => {
    
    console.log('typing');
    clearTimeout(timeout);
    socket.emit('typing');    
    
    timeout = setTimeout(() =>{
        socket.emit('stopTyping');        
    },2000);
    
});

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
    audio.play().catch(err => console.log(err));
    msgcontainer.scrollTop = msgcontainer.scrollHeight;
    
}

form.addEventListener('submit',(e) => {
    e.preventDefault();
    const message = msginput.value;
    clearTimeout(timeout);
    socket.emit('stopTyping');        
    append(`You: ${message}`,'recp');
    socket.emit('msg-send',message);
    msginput.value = '';
})



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

socket.on('showTyping', user => {
    console.log('showing typing',user);

    if(!typingDiv){

        typingDiv = document.createElement('div');
        typingDiv.classList.add('typing-indicator','convo','sender');
        typingDiv.innerHTML = 
                `<span id="userTyping">${user} is typing</span>
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>`;
            
        msgcontainer.append(typingDiv);
        msgcontainer.scrollTop = msgcontainer.scrollHeight;        
    }
})

socket.on('hideTyping', () => {
    console.log('hiding typing');
    if(typingDiv){
        typingDiv.remove();
        typingDiv = null;
    }
});

