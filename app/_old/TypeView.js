'use strict';

var EventEmitter = require('event-emitter-es6');
var $ = require('jquery');

var pos = 0,
    error = false,
    textSurfCont,
    correctWord = true,
    correctCount = 0,
    val,
    oldVal = "";


export default class TypeView extends EventEmitter {
    constructor(socketView) {
        super();

        this.socketView = socketView;

        this.getText();
        this.listenToInput();
    }

    initialize (gameId) {
        this.gameId = gameId;
        console.log('initializing with gameId', gameId);
    }

    countDown (counter) {
        if(counter === 0) {
            $('#user_input').prop('disabled', false);
            $('#countdown-container').hide();
            $('#main-container').removeClass('lightFade');

            var fired = false;
            document.body.onkeypress = function(e) {
                if(!fired) {
                    fired = true;
                    // do something
                    // $('input#user_input').val(String.fromCharCode(e.which));
                    $('input#user_input').focus();
                }
            };
            this.startTimer();
        }
        else {
            $('#user_input').prop('disabled', true);
            $('#countdown-container').show();
            $('#main-container').addClass('lightFade');
        }

        $('#countdown-timer').html(counter);


    }

    getText() {
        var textContents = 'Humans need to practice what they are learning a good deal before they master it. Furthermore, they tend to lose a good deal of their learning when they cease to practice the skills associated with this learning in their daily lives.'
        // var textContents = 'Humans need to practice what they are learning.'

        var text = "";

        this.words = [];
        this.words = this.words.concat(textContents.split(' '));
        text += textContents + " ";


        $("#text-contents").html("<span class='green-text'>" + text.replace(' ', '</span> '));
    }

    highlightNextWord(pos) {
        var textSurfCont = $("#text-contents").html().replace(/<\/?[^>]+(>|$)/g, "");

        var text = "",
            textArr = textSurfCont.split(' ');

        for(var i = 0; i < textArr.length; i++) {
            if(i == pos) {
                text += "<span class='green-text'>" + textArr[i] + " </span>";
            }
            else {
                text += textArr[i] + " ";
            }
        }

        $("#text-contents").html(text);
    }

    listenToInput() {
        var inputEl = $('input#user_input');
        // var started = false;

        inputEl.on('keyup', this.checkInput.bind(this));
        inputEl.on('keydown', function(e) {
            // if(!started) {
            //     started = true;
            //     this.startTimer();
            // }

            if(e.which === 32 && inputEl.val() == this.words[pos]) {
                e.preventDefault(); //important
                this.showNextWord();
            }

            this.checkInput();
        }.bind(this));

        inputEl.on('keypress', function(e) {
            if(this.words.length-1 === pos && (inputEl.val() + String.fromCharCode(e.which)) == this.words[pos]) {
                clearInterval(this.totalTime);
                this.showNextWord();
                e.preventDefault();

                alert('done, son');
            }

            this.checkInput();
        }.bind(this));
    }

    checkInput() {
        val = $('input#user_input').val();
        if(oldVal !==  val && pos < this.words.length) {
            oldVal = val;
            if(this.words[pos].substring(0,val.length) == val) {
                if(error) {
                    $("#text-contents").html($("#text-contents").html().replace('red-text','green-text'));
                }
            }
            else if(val !== this.words[pos] + " ") {
                error = true;
                correctWord = false;
                $("#text-contents").html($("#text-contents").html().replace('green-text','red-text'));
            }
        }
    }

    showNextWord() {
        console.log('go to next word');
        if(correctWord) {
            correctCount++;
        }

        pos++;

        $('input#user_input').val("");
        correctWord = true;

        this.recalcStats();
        this.highlightNextWord(pos);
    }

    secToMMSS(sec) {
        return Math.floor(sec / 60) + ":" + (sec%60 < 10 ? "0" + sec%60 : sec%60);
    }

    startTimer() {
        this.startTime = Date.now();
        var diff;
        this.totalTime = setInterval(function() {
            diff = Math.round((Date.now() - this.startTime)/1000);
            $('#elapsed_time').html(this.secToMMSS(diff));
        }.bind(this), 1000)
    }

    recalcStats() {
        var progress = pos/this.words.length,
            diff = (Date.now() - this.startTime)/1000,
            accuracy = Math.round((correctCount/pos) * 100 * 10) /10,
            speed = Math.round((60/diff) * pos);


        document.querySelector('#user_' + this.myUsername + ' .user-progress-slider').MaterialSlider.change(progress * 100);

        console.log('#user_' + this.myUsername + ' .bar-user-speed');
        document.querySelector('#user_' + this.myUsername + ' .bar-user-speed').innerHTML = speed;

        this.socketView.socket.emit('updateProgress', {
            gameId: this.gameId,
            speed: speed,
            progress: progress,
            accuracy: accuracy
        });

        $("#current_speed").html(speed);
        $("#current_accuracy").html(accuracy);
    }
}
