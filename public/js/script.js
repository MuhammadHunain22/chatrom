const querystring = window.location.search;
const urlParams = new URLSearchParams(querystring);
const username = urlParams.get('name');

const socket = io();
const chats = document.querySelector('.chats');

socket.emit('username',username);

socket.on('popup', popup => {
    let welmsg = document.createElement('div');
    welmsg.classList.add('popup');
    welmsg.innerHTML = popup;
    document.querySelector('.chats').appendChild(welmsg);
});

document.querySelector('.msgform').addEventListener('submit',e => {
    e.preventDefault();
    let msg = e.target.elements.sendmsg.value;
    document.querySelector('.chats')
    .insertAdjacentHTML(
    'beforeend', 
    `<div class="msgrow user_text">
    <div class="msgouter">
    <div class="text">
    ${msg}
    </div>
    <span class="msgusername">You</span>
    </div>
    </div>`);
    socket.emit('chatsent',msg);
    e.target.elements.sendmsg.value="";
    chats.scrollTop = chats.scrollHeight;
});

socket.on('message',msg => {
    document.querySelector('.chats')
    .insertAdjacentHTML(
    'beforeend', 
    `
    <div class="msgrow">
    <div class="msgouter">
    <div class="text">
    ${msg.msg}
    </div>
    <span class="msgusername">${msg.name}</span>
    </div>
    </div>
    `);
    chats.scrollTop = chats.scrollHeight;
})

socket.on('allusers',users => {
    document.querySelector('.userCount')
    .innerHTML = '';

    for (i =0; i < users.length; i++){
        document.querySelector('.userCount')
    .innerHTML += `<li>${users[i]}</li>`;
    }

    let count = document.querySelector('.userCount').children.length

    document.querySelector('.total_count').innerHTML =`Total Users Connected ${count}`
})