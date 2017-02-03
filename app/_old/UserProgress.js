'use strict';

let EventEmitter = require('event-emitter-es6');
var $ = require('jquery');

export default class UserProgress extends EventEmitter {
    constructor(obj) {
        super();

        console.log('new uprogress', obj);
        this.userObj = obj;
        this.createLayout();
    }

    createLayout () {
        $('#user_progress_bars').append(`<div class='user-progress' id='user_${this.userObj.username}'>
            <div style="float: left; width: 24%; text-align:right">${this.userObj.isMe ? 'You' : this.userObj.username}</div>
            <div style="width:50%; float: left;">
                <input class="mdl-slider mdl-js-slider user-progress-slider" type="range" min="0" max="100" value="0" tabindex="0">
            </div>
            <div style="float: left; width: 24%;"><span class="bar-user-speed">0</span> wpm</div>
        </div>`);

        componentHandler.upgradeDom();
    }

    updateProgress(obj) {
        // console.log(this.userObj, obj);
        // console.log('#user_' + this.userObj.username + ' .user-progress-slider');
        document.querySelector('#user_' + this.userObj.username + ' .user-progress-slider').MaterialSlider.change(obj.progress * 100);
        document.querySelector('#user_' + this.userObj.username + ' .bar-user-speed').innerHTML = obj.speed;
    }
}
