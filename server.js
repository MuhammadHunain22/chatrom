const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const path = require('path')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
var port = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname,'public')))

let users = []

io.on('connection', socket => {
 
    socket.on('username',username => {
    socket.username = username
    socket.emit('popup',`Welcome ${socket.username}`)
    socket.broadcast.emit('popup',`${socket.username} Joins Chatroom`)
    users.push(socket.username)

    io.emit('allusers',users)
 })


 socket.on('disconnect', () => {
     io.emit('popup',`${socket.username} Leaves Chatroom`)
     let index = users.indexOf(socket.username)
     users.splice(index,1)
     io.emit('allusers',users)
 })

 socket.on('chatsent', msg => {
    socket.broadcast.emit('message',{msg:msg,name:socket.username})
 })
})

server.listen(port)


