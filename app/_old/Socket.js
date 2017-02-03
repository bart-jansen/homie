var EventEmitter = require('event-emitter-es6');

'use strict';

export default class Socket extends EventEmitter {

    constructor() {
        super();

        this.socket = io.connect();

        this.loginToSocket();
        this.monitorUsers();
        this.listenToDisconnects();
        this.gameNotifications();
    }

    loginToSocket() {
        this.username = Math.random().toString(36).substring(7);
        this.socket.emit('login', this.username);

        this.socket.on('login_error', function(message){
            console.log('login_error');
        });

        this.socket.on('login_successful', function(users){
            console.log('login_successful');
            this.emit('logged_in', {isMe: true, name: this.username});
        }.bind(this));
    }

    monitorUsers() {
        // this.socket.on('newUser', function(user) {
            // console.log('new usertje', user);
            // this.emit('addOpponent', user)
        // }.bind(this));

        this.socket.on('onlineUsers', function(users, idleUsers) {
            // $('#amount_of_users').html(users);
            // $('#amount_of_idles').html(idleUsers);
            console.log('users', users, 'idle users', idleUsers)
        });
    }

    listenToDisconnects() {
        this.socket.on('offline', function(name){
            console.log('you are racing with ' + name + ', but he/she disconnected');
            this.emit('removeUser', name)
        }.bind(this));

        this.socket.on('disconnect', function(){
            console.log('you disconnected..');
        });
    }

    gameNotifications () {
        this.socket.on('createdGame', function(gameId) {
            this.emit('createdGame', gameId);
        }.bind(this));

        this.socket.on('joinedGame', function(obj) {
            this.emit('joinedGame', obj);
        }.bind(this));

        this.socket.on('newPlayer', function(obj) {
            console.log(obj);
            this.emit('newPlayer', obj)
            // console.log('new player', username);
        }.bind(this));

        this.socket.on('countDown', function(count) {
            this.emit('countDown', count);
        }.bind(this));

        this.socket.on('playerProgress', function(obj) {
            this.emit('playerProgress', obj);
        }.bind(this));
    }

    findGame () {
        this.socket.emit('findGame', this.username);
    }

    // updateProgress (progress) {
    //     console.log(progress);
    // }
}
