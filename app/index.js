var $ = require('jquery');
var config = require('./config');

document.addEventListener("DOMContentLoaded", function(event) {
    var iconHTML = "";
    config.apps.forEach(function (app) { // create initial icons
        iconHTML += `<div class='app-container'><div class='app-icon'></div>${app.name}</div>`;
    });

    $('#icon-container').html(iconHTML);

    setTimeout(windowResizer(true), 10); // timeout fix for desktop browsers

    document.querySelector('#addItem').onclick = addItem;
    document.querySelector('#removeItem').onclick = removeItem;
});

window.onresize = windowResizer.bind(this, false); // no anim on resize

function windowResizer(doAnimation) {
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    var offsetX = 0, offsetY = 0;

    var amountOfCols = Math.min(4, Math.floor(windowWidth / config.itemWidth) );
    var amountOfRows = Math.ceil(config.apps.length / amountOfCols);

    if(windowWidth >= 1000) {
        offsetX = 60;
    }
    else if(amountOfCols !== 0) {
        offsetX = (windowWidth - (config.itemWidth * amountOfCols)) / 2;
    }

    // don't adjust when items exceed window height
    offsetY = Math.max(0, (windowHeight - (amountOfRows * config.itemHeight)) / 2);

    // apply offsets
    document.querySelectorAll('.app-container').forEach(function(container, index) {
        setTimeout(function() {
            container.style.opacity = 1; container.style.transform =  'translate(' + offsetX + 'px, ' + offsetY + 'px)';
        }, config.animationsEnabled && doAnimation ?  index* 50 : 0);
    });
}

function removeItem() {
    if(config.apps.length !== 0) {
        config.apps.splice(-1);
        var containers = document.querySelectorAll('.app-container');
        containers[containers.length-1].remove(); // remove HTML
        windowResizer(false);
    }
}

function addItem() {
    config.apps.push({name: 'new item'});
    $('#icon-container').append(`<div class='app-container'><div class='app-icon'></div>new item</div>`);
    windowResizer(false);
}
